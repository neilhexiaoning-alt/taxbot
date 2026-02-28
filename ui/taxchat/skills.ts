/**
 * TaxChat Skill Management
 */

import type { CustomSkill } from "./types";
import { state, generateUUID, isAnySending, scheduleRender } from "./state";
import { BUILTIN_SKILLS } from "./constants";
import { saveCustomSkills } from "./persistence";
import { showToast, addNotification } from "./utils";

// ─── Managed Skills Sync ───────────────────────────────────────
export async function syncManagedSkills() {
  const api = (window as any).electronAPI;
  if (!api?.listManagedSkills) return;
  try {
    const result = await api.listManagedSkills();
    if (!result?.ok || !result.skills) return;
    const builtinFolders = new Set(BUILTIN_SKILLS.map(s => s.folderName));
    let changed = false;
    for (const ms of result.skills) {
      if (builtinFolders.has(ms.folderName)) continue;
      const existing = state.customSkills.find(s => s.folderName === ms.folderName)
        || state.customSkills.find(s => `custom-${s.id.slice(0, 8)}` === ms.folderName);
      if (existing) {
        const newPrompt = ms.prompt || "";
        const newDesc = ms.description || "";
        if (existing.prompt !== newPrompt || existing.description !== newDesc) {
          existing.prompt = newPrompt;
          existing.description = newDesc;
          if (ms.emoji) existing.emoji = ms.emoji;
          changed = true;
        }
        continue;
      }
      state.customSkills.push({
        id: generateUUID(),
        name: ms.name === ms.folderName ? ms.description.slice(0, 20) || ms.folderName : ms.name,
        emoji: ms.emoji || "🤖",
        description: ms.description || "",
        prompt: ms.prompt || "",
        pinned: false,
        createdAt: Date.now(),
        folderName: ms.folderName,
      });
      changed = true;
    }
    if (changed) {
      saveCustomSkills();
      scheduleRender();
    }
  } catch (err) {
    console.warn("Failed to sync managed skills:", err);
  }
}

// ─── Skill Editor ──────────────────────────────────────────────
export function openSkillEditor(skill?: CustomSkill) {
  state.editingSkill = skill
    ? { ...skill }
    : { id: generateUUID(), name: "", emoji: "🤖", description: "", prompt: "", pinned: false, createdAt: Date.now() };
  scheduleRender();
}

export async function saveSkillFromEditor() {
  const s = state.editingSkill;
  if (!s || !s.name.trim() || !s.prompt.trim()) return;

  const idx = state.customSkills.findIndex(c => c.id === s.id);
  if (idx >= 0) {
    state.customSkills[idx] = s;
  } else {
    state.customSkills.push(s);
  }
  saveCustomSkills();
  state.editingSkill = null;

  const api = (window as any).electronAPI;
  if (api?.saveCustomSkill) {
    try {
      const result = await api.saveCustomSkill({
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        description: s.description,
        prompt: s.prompt,
      });
      if (result?.folderName) {
        s.folderName = result.folderName;
        saveCustomSkills();
      }
    } catch (err) {
      console.warn("Failed to save skill to gateway:", err);
    }
  }

  scheduleRender();
}

export async function deleteCustomSkill(id: string) {
  const skill = state.customSkills.find(s => s.id === id);
  if (!skill) return;
  if (!confirm(`确定要删除技能"${skill.name}"吗？`)) return;
  // Sync TaxStore installed state
  if (skill.taxstoreSkillId) {
    state.taxstoreInstalledIds.delete(skill.taxstoreSkillId);
  }
  state.customSkills = state.customSkills.filter(s => s.id !== id);
  saveCustomSkills();
  scheduleRender();

  const api = (window as any).electronAPI;
  if (api?.deleteCustomSkill) {
    try {
      await api.deleteCustomSkill(id, skill.name, skill.folderName);
    } catch (err) {
      console.warn("Failed to delete skill file:", err);
    }
  }
}

export async function exportSkillAsZip(skill: CustomSkill) {
  const api = (window as any).electronAPI;
  if (!api?.exportSkill) {
    alert("导出功能不可用");
    return;
  }
  try {
    const result = await api.exportSkill(skill.id, skill.name);
    if (result.ok) {
      alert(`技能已导出到：${result.path}`);
    } else if (result.error !== "cancelled") {
      alert(`导出失败：${result.error}`);
    }
  } catch (err: any) {
    alert(`导出失败：${err.message || err}`);
  }
}

export async function handleInstallSkillPackage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".zip";
  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];

      const api = (window as any).electronAPI;
      if (!api?.installSkillPackage) {
        alert("当前环境不支持技能包安装");
        return;
      }

      showToast("正在安装技能包...");
      try {
        const result = await api.installSkillPackage(base64Data, file.name);
        if (!result?.ok) {
          alert(`安装失败: ${result?.error || "未知错误"}`);
          return;
        }

        const skill: CustomSkill = {
          id: generateUUID(),
          name: result.skill?.name || file.name.replace(/\.zip$/i, ""),
          emoji: result.skill?.emoji || "📦",
          description: result.skill?.description || "",
          prompt: result.skill?.prompt || "",
          pinned: false,
          createdAt: Date.now(),
          folderName: result.folderName,
        };
        state.customSkills.push(skill);
        saveCustomSkills();
        scheduleRender();

        showToast(`技能"${skill.name}"已安装，正在重启服务...`);
        addNotification(`技能包已安装: ${skill.name}`, "📦");
      } catch (err) {
        alert(`安装失败: ${(err as Error).message}`);
      }
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

export function toggleSkillPin(id: string) {
  const skill = state.customSkills.find(s => s.id === id);
  if (!skill) return;
  skill.pinned = !skill.pinned;
  saveCustomSkills();
  scheduleRender();
}

export function handleCustomSkillClick(skill: CustomSkill) {
  if (isAnySending()) return;
  state.activeCustomSkill = skill;
  state.lastSkillName = skill.folderName || `custom-${skill.id.substring(0, 8)}`;
  const tag = `使用技能「${skill.name}」`;
  if (!state.draft.startsWith(tag)) {
    state.draft = tag + (state.draft ? " " + state.draft : "");
  }
  state.sidePanel = null;
  scheduleRender();
  setTimeout(() => { state.inputRef?.focus(); }, 50);
}

export function clearActiveCustomSkill() {
  state.activeCustomSkill = null;
  state.lastSkillName = null;
  scheduleRender();
}

// handleQuickSkill needs handleSend and handleFiles from chat.ts
// To avoid circular imports, we accept them as parameters from the render layer
export function handleQuickSkill(
  skillName: string,
  prompt: string,
  displayLabel: string,
  noFilePicker?: boolean,
  sendFn?: () => void,
  filesFn?: (files: FileList) => void,
) {
  if (!state.client) return;

  state.lastSkillName = skillName;

  if (noFilePicker) {
    const builtinSkill = BUILTIN_SKILLS.find(s => s.folderName === skillName);
    if (builtinSkill) {
      state.activeCustomSkill = builtinSkill;
    }
    state.draft = "请执行票据整理流程";
    sendFn?.();
    return;
  }

  if (state.attachments.length > 0) {
    state.draft = prompt;
    sendFn?.();
    return;
  }

  state.pendingSkill = { name: skillName, prompt, displayLabel };
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.xml";
  fileInput.multiple = true;
  fileInput.onchange = () => {
    if (fileInput.files && fileInput.files.length > 0) {
      filesFn?.(fileInput.files);
    } else {
      state.pendingSkill = null;
    }
  };
  fileInput.click();
}
