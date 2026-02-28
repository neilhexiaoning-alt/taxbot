/**
 * TaxChat Agent Management
 */

import type { AgentEntry, AgentMention } from "./types";
import { state, generateUUID, scheduleRender } from "./state";
import { AGENT_TEMPLATES, BUILTIN_SKILLS } from "./constants";
import { showToast } from "./utils";

/** Build skills info array from selected skill IDs for TOOLS.md generation */
function buildSkillsForTools(selectedIds: string[]): { name: string; emoji: string; description: string; prompt: string }[] {
  if (!selectedIds.length) return [];
  const allSkills = [...BUILTIN_SKILLS, ...state.customSkills.filter(s => !s.id.startsWith("__builtin_"))];
  return selectedIds
    .map(id => allSkills.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map(s => ({ name: s.name, emoji: s.emoji, description: s.description, prompt: s.prompt }));
}

// ─── Agent Memory Cache ────────────────────────────────────────
const agentMemoryCache = new Map<string, string>();

export async function loadAgentMemory(agentId: string): Promise<string> {
  if (agentMemoryCache.has(agentId)) return agentMemoryCache.get(agentId)!;
  const api = (window as any).electronAPI;
  if (!api?.readAgentMemory) return "";
  try {
    const res = await api.readAgentMemory(agentId);
    const content = res?.ok ? (res.content || "") : "";
    agentMemoryCache.set(agentId, content);
    return content;
  } catch { return ""; }
}

export async function saveAgentMemory(agentId: string, content: string) {
  agentMemoryCache.set(agentId, content);
  const api = (window as any).electronAPI;
  if (!api?.writeAgentMemory) return;
  try { await api.writeAgentMemory(agentId, content); } catch {}
}

export async function appendAgentMemory(agentId: string, newEntry: string) {
  const existing = await loadAgentMemory(agentId);
  const timestamp = new Date().toLocaleString("zh-CN");
  const updated = existing
    ? `${existing}\n\n---\n\n[${timestamp}]\n${newEntry}`
    : `[${timestamp}]\n${newEntry}`;
  await saveAgentMemory(agentId, updated);
}

// ─── Agent CRUD ────────────────────────────────────────────────
export async function loadAgents() {
  if (!state.client || !state.connected) return;
  if (state.agentsLoading) return;
  state.agentsLoading = true;
  scheduleRender();
  try {
    const res = await state.client.request("agents.list", {}) as any;
    console.log("[Agents] agents.list response:", JSON.stringify(res, null, 2)?.substring(0, 500));
    if (res?.agents && Array.isArray(res.agents)) {
      const defaultId = res.defaultId || "main";
      state.agentsList = res.agents.map((a: any) => ({
        id: a.id,
        name: a.name?.trim() || a.identity?.name?.trim() || a.id,
        emoji: (a.identity?.emoji?.trim() && a.identity.emoji.trim().length <= 8) ? a.identity.emoji.trim() : "🤖",
        avatarUrl: a.identity?.avatarUrl || a.identity?.avatar || undefined,
        description: a.identity?.theme?.trim() || "",
        isDefault: a.id === defaultId,
      }));
      if (!state.agentsList.find(a => a.isDefault)) {
        state.agentsList.unshift({ id: defaultId, name: defaultId, emoji: "🤖", description: "", isDefault: true });
      }
      state.agentsList.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return a.name.localeCompare(b.name);
      });
      console.log("[Agents] Loaded", state.agentsList.length, "agents:", state.agentsList.map(a => `${a.id}(${a.name})`).join(", "));

      const nameless = state.agentsList.filter(a => !a.isDefault && a.name === a.id);
      if (nameless.length > 0) {
        console.log("[Agents] Found agents without names, attempting recovery:", nameless.map(a => a.id));
        await recoverAgentNames();
      }
    } else {
      console.warn("[Agents] agents.list returned unexpected shape:", res);
    }
  } catch (err: any) {
    console.error("loadAgents error:", err);
  }
  state.agentsLoading = false;
  scheduleRender();
  syncAgentsToMainWorkspace();
}

export async function recoverAgentNames() {
  const api = (window as any).electronAPI;
  if (!api?.recoverAgentIdentities || !state.client) return;
  try {
    const result = await api.recoverAgentIdentities();
    if (!result?.ok || !result.agents?.length) return;

    const recovered = result.agents as Array<{ id: string; name: string; emoji: string; description: string; avatarUrl?: string }>;
    console.log("[Agents] Recovered identities:", recovered.map((a: any) => `${a.id}→${a.name}${a.avatarUrl ? " (has avatar)" : ""}`));

    let changed = false;
    for (const rec of recovered) {
      const agent = state.agentsList.find(a => a.id === rec.id);
      if (agent && agent.name === agent.id && rec.name !== rec.id) {
        agent.name = rec.name;
        agent.emoji = rec.emoji || agent.emoji;
        agent.description = rec.description || agent.description;
        if (rec.avatarUrl) agent.avatarUrl = rec.avatarUrl;
        changed = true;
      } else if (agent && rec.avatarUrl && !agent.avatarUrl) {
        agent.avatarUrl = rec.avatarUrl;
        changed = true;
      }
    }
    if (!changed) return;
    scheduleRender();

    const configRes = await state.client.request("config.get", {}) as any;
    const baseHash = configRes?.hash || null;
    const currentConfig = configRes?.config || {};
    const existingList = (currentConfig.agents?.list || []) as any[];

    const hasDefault = existingList.some((a: any) => a.id === "main" || a.default === true);
    const newList = hasDefault ? [...existingList] : [{ id: "main", default: true }];

    for (const rec of recovered) {
      if (newList.some((a: any) => a.id === rec.id && a.name && a.name !== a.id)) continue;
      const idx = newList.findIndex((a: any) => a.id === rec.id);
      if (idx >= 0) newList.splice(idx, 1);
      const identityObj: any = { name: rec.name, emoji: rec.emoji, theme: rec.description };
      if (rec.avatarUrl) identityObj.avatar = rec.avatarUrl;
      newList.push({
        id: rec.id,
        name: rec.name,
        identity: identityObj,
      });
    }

    console.log("[Agents] Patching config to restore agent names:", newList.map((a: any) => `${a.id}(${a.name})`));
    await state.client.request("config.patch", {
      baseHash,
      raw: JSON.stringify({ agents: { ...currentConfig.agents, list: newList } }),
      note: "恢复智能体名称",
      restartDelayMs: 0,
    });
  } catch (err) {
    console.warn("[Agents] Recovery failed:", err);
  }
}

export async function syncAgentsToMainWorkspace() {
  const api = (window as any).electronAPI;
  if (!api?.syncAgentsToMainWorkspace) return;
  try {
    const agents = state.agentsList.map(a => ({
      name: a.name,
      emoji: a.emoji,
      description: a.description,
      isDefault: a.isDefault,
    }));
    await api.syncAgentsToMainWorkspace({ agents });
    console.log("[Agent] Synced agent list to main workspace");
  } catch (err) {
    console.warn("[Agent] Failed to sync agents to main workspace:", err);
  }
}

export async function createAgentFromTemplate(tpl: typeof AGENT_TEMPLATES[0]) {
  state.agentCreateDraft = {
    name: tpl.name,
    emoji: tpl.emoji,
    description: tpl.description,
    identityDesc: tpl.identityDesc,
    expertise: tpl.expertise,
    avatarDataUrl: "",
  } as any;
  state.editingAgentId = null;
  await createAgent();
}

export async function createAgent() {
  if (!state.client || !state.connected) return;
  const d = state.agentCreateDraft;
  const name = d.name.trim();
  if (!name) { showToast("请填写名称"); return; }
  const asciiSlug = name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase().slice(0, 32);
  const id = asciiSlug || ("agent-" + Date.now().toString(36));
  if (state.agentsList.find(a => a.id === id)) { showToast("已存在同名智能体"); return; }
  state.agentSaving = true;
  scheduleRender();
  try {
    const configRes = await state.client.request("config.get", {}) as any;
    const baseHash = configRes?.hash || null;
    const currentConfig = configRes?.config || {};
    const existingList = (currentConfig.agents?.list || []) as any[];
    console.log("[Agent] createAgent: existingList =", JSON.stringify(existingList));
    const hasDefault = existingList.some((a: any) => a.id === "main" || a.default === true);
    const fullList = hasDefault ? [...existingList] : [{ id: "main", default: true }, ...existingList];
    const identityObj: any = { name, emoji: d.emoji.trim() || "🤖", theme: d.description.trim() || undefined };
    if (d.avatarDataUrl) {
      identityObj.avatar = d.avatarDataUrl;
    }
    const newList = [...fullList, { id, name, identity: identityObj }];
    console.log("[Agent] createAgent: newList =", JSON.stringify(newList));
    const patch = {
      agents: { ...currentConfig.agents, list: newList },
    };
    await state.client.request("config.patch", { baseHash, raw: JSON.stringify(patch), note: `新建智能体: ${name}`, restartDelayMs: 1000 });
    if ((window as any).electronAPI?.createAgentWorkspace) {
      const wsResult = await (window as any).electronAPI.createAgentWorkspace({ agentId: id, name, emoji: d.emoji.trim() || "🤖", description: d.description.trim(), identityDesc: d.identityDesc.trim(), expertise: d.expertise.trim(), selectedSkills: buildSkillsForTools(d.selectedSkills || []) });
      console.log("[Agent] createAgentWorkspace result:", wsResult);
    }
    if (d.avatarDataUrl && (window as any).electronAPI?.saveAgentAvatar) {
      await (window as any).electronAPI.saveAgentAvatar({ agentId: id, avatarDataUrl: d.avatarDataUrl });
    }
    showToast(`智能体 "${name}" 已创建`);
    state.creatingAgent = false;
    state.agentCreateDraft = { name: "", emoji: "🤖", description: "", identityDesc: "", expertise: "", avatarDataUrl: "", selectedSkills: [] };
    setTimeout(() => loadAgents(), 1500);
  } catch (err: any) {
    showToast("创建失败: " + (err?.message || String(err)));
  }
  state.agentSaving = false;
  scheduleRender();
}

export async function deleteAgent(agentId: string) {
  if (!state.client || !state.connected) return;
  const agent = state.agentsList.find(a => a.id === agentId);
  if (!agent || agent.isDefault) return;
  state.agentSaving = true;
  state.confirmingAgentDelete = null;
  scheduleRender();
  try {
    const configRes = await state.client.request("config.get", {}) as any;
    const baseHash = configRes?.hash || null;
    const currentConfig = configRes?.config || {};
    const existingList = (currentConfig.agents?.list || []) as any[];
    const filteredList = existingList.filter((a: any) => a.id !== agentId);
    const hasDefault = filteredList.some((a: any) => a.id === "main" || a.default === true);
    const finalList = hasDefault ? filteredList : [{ id: "main", default: true }, ...filteredList];
    const patch = {
      agents: { ...currentConfig.agents, list: finalList },
    };
    await state.client.request("config.patch", { baseHash, raw: JSON.stringify(patch), note: `删除智能体: ${agent.name}`, restartDelayMs: 1000 });
    if ((window as any).electronAPI?.deleteAgentWorkspace) {
      await (window as any).electronAPI.deleteAgentWorkspace({ agentId: agentId });
    }
    showToast(`智能体 "${agent.name}" 已删除`);
    setTimeout(() => loadAgents(), 1500);
  } catch (err: any) {
    showToast("删除失败: " + (err?.message || String(err)));
  }
  state.agentSaving = false;
  scheduleRender();
}

export async function openAgentEditor(agent: AgentEntry) {
  state.editingAgentId = agent.id;
  state.agentCreateDraft = {
    name: agent.name,
    emoji: agent.emoji,
    description: agent.description,
    identityDesc: "",
    expertise: "",
    avatarDataUrl: agent.avatarUrl || "",
    selectedSkills: [],
  };
  state.creatingAgent = true;
  scheduleRender();
  if ((window as any).electronAPI?.readAgentWorkspace) {
    try {
      const ws = await (window as any).electronAPI.readAgentWorkspace({ agentId: agent.id });
      if (ws?.ok) {
        if (ws.description) state.agentCreateDraft.description = ws.description;
        if (ws.identityDesc) state.agentCreateDraft.identityDesc = ws.identityDesc;
        if (ws.expertise) state.agentCreateDraft.expertise = ws.expertise;
        // Restore selected skills by matching names from TOOLS.md to skill IDs
        if (ws.toolsSkillNames?.length) {
          const allSkills = [...BUILTIN_SKILLS, ...state.customSkills.filter(s => !s.id.startsWith("__builtin_"))];
          state.agentCreateDraft.selectedSkills = ws.toolsSkillNames
            .map((name: string) => allSkills.find(s => s.name === name)?.id)
            .filter((id: string | undefined): id is string => !!id);
        }
        scheduleRender();
      }
    } catch (err) {
      console.warn("[Agent] Failed to read workspace:", err);
    }
  }
}

export async function updateAgent() {
  if (!state.client || !state.connected || !state.editingAgentId) return;
  const d = state.agentCreateDraft;
  const name = d.name.trim();
  if (!name) { showToast("请填写名称"); return; }
  state.agentSaving = true;
  scheduleRender();
  try {
    const configRes = await state.client.request("config.get", {}) as any;
    const baseHash = configRes?.hash || null;
    const currentConfig = configRes?.config || {};
    const existingList = (currentConfig.agents?.list || []) as any[];
    const hasDefault = existingList.some((a: any) => a.id === "main" || a.default === true);
    const fullList = hasDefault ? existingList : [{ id: "main", default: true }, ...existingList];
    const identityObj: any = { name, emoji: d.emoji.trim() || "🤖", theme: d.description.trim() || undefined };
    if (d.avatarDataUrl) {
      identityObj.avatar = d.avatarDataUrl;
    }
    const updatedList = fullList.map((a: any) =>
      a.id === state.editingAgentId
        ? { ...a, name, identity: identityObj }
        : a
    );
    const patch = {
      agents: { ...currentConfig.agents, list: updatedList },
    };
    await state.client.request("config.patch", { baseHash, raw: JSON.stringify(patch), note: `修改智能体: ${name}`, restartDelayMs: 1000 });
    if ((window as any).electronAPI?.updateAgentWorkspace && state.editingAgentId) {
      const wsResult = await (window as any).electronAPI.updateAgentWorkspace({ agentId: state.editingAgentId, name, emoji: d.emoji.trim() || "🤖", description: d.description.trim(), identityDesc: d.identityDesc.trim(), expertise: d.expertise.trim(), selectedSkills: buildSkillsForTools(d.selectedSkills || []) });
      console.log("[Agent] updateAgentWorkspace result:", wsResult);
    }
    if (d.avatarDataUrl && (window as any).electronAPI?.saveAgentAvatar && state.editingAgentId) {
      await (window as any).electronAPI.saveAgentAvatar({ agentId: state.editingAgentId, avatarDataUrl: d.avatarDataUrl });
    }
    showToast(`智能体 "${name}" 已更新`);
    state.creatingAgent = false;
    state.editingAgentId = null;
    state.agentCreateDraft = { name: "", emoji: "🤖", description: "", identityDesc: "", expertise: "", avatarDataUrl: "", selectedSkills: [] };
    setTimeout(() => loadAgents(), 1500);
  } catch (err: any) {
    showToast("更新失败: " + (err?.message || String(err)));
  }
  state.agentSaving = false;
  scheduleRender();
}

// ─── Mention Parsing ───────────────────────────────────────────
export function parseAgentMentions(text: string): { mentions: AgentMention[]; cleanText: string } {
  const mentions: AgentMention[] = [];
  const seen = new Set<string>();
  let cleanText = text;
  const regex = /@(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const name = m[1];
    const agent = state.agentsList.find(a => a.name === name || a.id === name);
    if (agent && !seen.has(agent.id)) {
      seen.add(agent.id);
      mentions.push({ agentId: agent.id, agentName: agent.name, agentEmoji: agent.emoji, isDefault: !!agent.isDefault });
      cleanText = cleanText.replace(m[0], "").trim();
    }
  }
  return { mentions, cleanText };
}

export function getMentionCandidates(): AgentEntry[] {
  const filter = state.mentionFilter;
  return state.agentsList.filter(a => !filter || a.name.toLowerCase().includes(filter) || a.id.toLowerCase().includes(filter));
}

export function insertAgentMention(agent: AgentEntry) {
  console.log("[Agent] insertAgentMention called:", agent.name, agent.id);
  const cursorReplace = state.draft.replace(/@(\S*)$/, `@${agent.name} `);
  state.draft = cursorReplace === state.draft ? state.draft + `@${agent.name} ` : cursorReplace;
  state.sidePanel = null;
  state.mentionDropdownVisible = false;
  state.mentionIndex = 0;
  scheduleRender();
  setTimeout(() => { state.inputRef?.focus(); }, 50);
}
