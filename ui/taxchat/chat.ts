/**
 * TaxChat Chat Logic — send, receive, abort, context building
 */

import type { AppState, AssistantMessage, UserMessage, AgentEntry } from "./types";
import { state, generateUUID, isAnySending, isSessionBusy, getMessagesForSession, isCurrentSession, scheduleRender } from "./state";
import { CONTEXT_MAX_MESSAGES, CONTEXT_MAX_CHARS, BUILTIN_SKILLS, TAX_SKILL_NAMES } from "./constants";
import { saveMessages, debouncedSaveMessages, saveFavorites, saveMessagesForConversation } from "./persistence";
import { autoTitleConversation } from "./conversations";
import { loadAgentMemory, parseAgentMentions } from "./agents";
import {
  showToast,
  readFileAsDataUrl,
  extractAttachmentTexts,
  extractMessageText,
  isSystemMessage,
  isTaxRelated,
  consultTaxYes,
  escapeRegex,
} from "./utils";
import { selectRelevantKnowledge } from "./knowledge";

// ─── Conversation Context ──────────────────────────────────────
export function buildConversationContext(excludeSessionKeys?: string[], forAgentName?: string): string {
  const msgs = state.messages;
  if (msgs.length === 0) return "";

  const recent = msgs.slice(-CONTEXT_MAX_MESSAGES);
  const lines: string[] = [];
  let totalChars = 0;

  for (const msg of recent) {
    let line: string;
    let isRelevant = true;

    if (msg.type === "user") {
      const um = msg as UserMessage;
      if (um.targetAgentNames && um.targetAgentNames.length > 0) {
        line = `【用户→${um.targetAgentNames.join("、")}】${um.text}`;
        if (forAgentName) {
          isRelevant = um.targetAgentNames.includes(forAgentName);
        }
      } else {
        line = `【用户→Taxbot】${um.text}`;
        isRelevant = true;
      }
    } else {
      const aMsg = msg as AssistantMessage;
      const name = aMsg.agentName || "Taxbot";
      const emoji = aMsg.agentEmoji || "";
      let text = msg.text;

      if (forAgentName && name !== forAgentName && name !== "Taxbot") {
        isRelevant = false;
        text = text.length > 80 ? text.slice(0, 80) + "..." : text;
      } else if (text.length > 2000) {
        text = text.slice(0, 2000) + "...（已截断）";
      }

      line = isRelevant ? `★【${emoji}${name}】${text}` : `【${emoji}${name}】${text}`;
    }

    if (msg.type === "user" && isRelevant && forAgentName) {
      line = "★" + line;
    }

    if (totalChars + line.length > CONTEXT_MAX_CHARS) break;
    lines.push(line);
    totalChars += line.length;
  }

  if (lines.length === 0) return "";

  const header = forAgentName
    ? `【以下是对话记录。标有 ★ 的是与你（${forAgentName}）直接相关的消息，其余为其他智能体的简要记录。你只需回复发给你的消息。】`
    : `【以下是当前群组对话记录。每条用户消息标注了发送目标（如"用户→Taxbot"表示发给Taxbot的）。你只需回复发给你的消息，不要回复发给其他智能体的消息。你可以参考对话上下文来理解背景，但不要主动回答别人的问题。】`;

  return `${header}\n\n${lines.join("\n\n")}`;
}

// ─── Bad Response Detection ────────────────────────────────────
export function isBadResponse(text: string): boolean {
  const t = text.trim();
  return !t || /^NO$/i.test(t) || t === "回复获取失败，请重试。" || t === "模型未能正确回复，请重新发送您的问题。";
}

// ─── Collaboration Task Status ─────────────────────────────────
function updateCollabTaskStatus(agentId: string | null, status: "done" | "error") {
  if (!state.collaborationTasks || !agentId) return;
  const task = state.collaborationTasks.find(t => t.agentId === agentId);
  if (task) task.status = status;
  const allDone = state.collaborationTasks.every(t => t.status === "done" || t.status === "error");
  if (allDone) {
    setTimeout(() => { state.collaborationTasks = null; scheduleRender(); }, 3000);
  }
}

// ─── Finish Sending ────────────────────────────────────────────
export function finishSendingForRun(sessionKey: string) {
  const run = state.activeRuns.get(sessionKey);
  if (!run) return;

  const isBg = !isCurrentSession(sessionKey);
  const msgs = getMessagesForSession(sessionKey);

  const recentAssistant = msgs.filter(m => m.type === "assistant");
  const hasRealResponse = recentAssistant.some(m => !isBadResponse((m as any).text || ""));

  if (hasRealResponse) {
    const filtered = msgs.filter(m => {
      if (m.type === "assistant" && isBadResponse((m as any).text || "")) {
        console.log("[finishSending] Removing bad message:", ((m as any).text || "").substring(0, 40));
        return false;
      }
      return true;
    });
    if (isBg) {
      // Background conversation: update backgroundMessages, save to persistence, mark unread
      const convId = sessionKey.startsWith("taxchat-") ? sessionKey.slice(8) : sessionKey;
      state.backgroundMessages.set(convId, filtered);
      saveMessagesForConversation(convId, filtered);
      state.unreadConversations.add(convId);
      // Update conversation metadata
      const conv = state.conversations.find(c => c.id === convId);
      if (conv) { conv.updatedAt = Date.now(); conv.messageCount = filtered.length; }
    } else {
      state.messages = filtered;
      debouncedSaveMessages();
    }
    state.activeRuns.delete(sessionKey);
    updateCollabTaskStatus(run.agentId, "done");
    if (sessionKey === state.sessionKey && state.pendingDispatch) {
      dispatchPendingAgents();
    }
    if (!run.reactive && run.agentId) {
      checkReactiveMentions(run);
    }
    scheduleRender();
    return;
  }

  const lastMsg = msgs[msgs.length - 1];
  const lastText = ((lastMsg as any)?.text || "").trim();
  const isNoResponse = lastMsg?.type === "assistant" && /^NO$/i.test(lastText);
  const isFailResponse = lastMsg?.type === "assistant" && lastText === "回复获取失败，请重试。";

  if ((isNoResponse || isFailResponse) && run._retryCount < 1) {
    run._retryCount++;
    console.log(`[AutoRetry] Model responded with "${lastText}", retrying (attempt ${run._retryCount}) for ${sessionKey}`);
    msgs.pop();
    run.thinkingLabel = "正在重试...";
    run.toolsActive = 0;
    run.runId = null;
    scheduleRender();
    const idempotencyKey = generateUUID();
    state.client?.request("chat.send", {
      sessionKey: sessionKey,
      message: "请直接回答上面的问题。",
      deliver: false,
      idempotencyKey,
    }).catch((err: any) => {
      console.error("Auto-retry send failed:", err);
      state.activeRuns.delete(sessionKey);
      updateCollabTaskStatus(run.agentId, "error");
      if (isBg) {
        const convId = sessionKey.startsWith("taxchat-") ? sessionKey.slice(8) : sessionKey;
        saveMessagesForConversation(convId, msgs);
        state.unreadConversations.add(convId);
      } else {
        debouncedSaveMessages();
      }
      scheduleRender();
    });
    return;
  }

  state.activeRuns.delete(sessionKey);
  updateCollabTaskStatus(run.agentId, "done");
  if (isBg) {
    const convId = sessionKey.startsWith("taxchat-") ? sessionKey.slice(8) : sessionKey;
    saveMessagesForConversation(convId, msgs);
    state.unreadConversations.add(convId);
    const conv = state.conversations.find(c => c.id === convId);
    if (conv) { conv.updatedAt = Date.now(); conv.messageCount = msgs.length; }
  } else {
    debouncedSaveMessages();
  }

  if (sessionKey === state.sessionKey && state.pendingDispatch) {
    dispatchPendingAgents();
  }
  if (!run.reactive && run.agentId) {
    checkReactiveMentions(run);
  }

  scheduleRender();
}

// ─── Fetch Complete Response (Polling with AbortController + Timeout) ──
const POLL_INTERVAL = 1500;
const STALE_TIMEOUT = 10_000;   // 10s without content change → complete
const MAX_TOTAL_TIME = 120_000; // 2 min absolute timeout
const pollingControllers = new Map<string, AbortController>();

/** Extract assistant text from chat.history result */
function extractHistoryAssistantText(result: any): string {
  if (!result?.messages || result.messages.length === 0) return "";
  const msgs = result.messages as any[];
  let lastUserIdx = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === "user") { lastUserIdx = i; break; }
  }
  const startIdx = lastUserIdx >= 0 ? lastUserIdx + 1 : 0;
  const assistantTexts: string[] = [];
  for (let i = startIdx; i < msgs.length; i++) {
    if (msgs[i].role === "assistant") {
      const t = extractMessageText(msgs[i]);
      if (t && !isSystemMessage(t)) assistantTexts.push(t);
    }
  }
  if (assistantTexts.length === 0) {
    for (let i = startIdx; i < msgs.length; i++) {
      const content = (msgs[i] as any).content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block?.type === "tool_result") {
          const rc = block.content;
          if (typeof rc === "string" && rc.trim()) {
            assistantTexts.push(rc.trim());
          } else if (Array.isArray(rc)) {
            for (const sub of rc) {
              if (sub?.type === "text" && typeof sub.text === "string" && sub.text.trim()) {
                assistantTexts.push(sub.text.trim());
              }
            }
          }
        }
      }
    }
  }
  return assistantTexts.join("\n\n");
}

/** Upsert assistant message text in state.messages */
function upsertAssistantText(runId: string, sessionKey: string, text: string) {
  const msgs = getMessagesForSession(sessionKey);
  const existingIdx = msgs.findIndex(m => m.type === "assistant" && m.id === runId);
  if (existingIdx >= 0) {
    if (text.length > ((msgs[existingIdx] as any).text || "").length) {
      (msgs[existingIdx] as any).text = text;
    }
  } else {
    const run = state.activeRuns.get(sessionKey);
    msgs.push({
      type: "assistant",
      text,
      timestamp: Date.now(),
      id: runId,
      agentId: run?.agentId || undefined,
      agentEmoji: run?.agentEmoji || undefined,
      agentName: run?.agentName || undefined,
      agentAvatarUrl: run?.agentAvatarUrl || undefined,
    });
  }
}

export function fetchCompleteResponse(runId: string, sessionKey: string): void {
  // Cancel any existing polling for this session
  pollingControllers.get(sessionKey)?.abort();

  const controller = new AbortController();
  pollingControllers.set(sessionKey, controller);
  const signal = controller.signal;

  const startTime = Date.now();
  let lastChangeTime = Date.now();
  let prevText = "";

  const poll = () => {
    if (signal.aborted || !state.activeRuns.has(sessionKey)) {
      pollingControllers.delete(sessionKey);
      return;
    }

    // Absolute timeout
    if (Date.now() - startTime > MAX_TOTAL_TIME) {
      if (prevText) upsertAssistantText(runId, sessionKey, prevText);
      finishSendingForRun(sessionKey);
      pollingControllers.delete(sessionKey);
      return;
    }

    state.client?.request("chat.history", { sessionKey, limit: 20 })
      .then((result: any) => {
        if (signal.aborted || !state.activeRuns.has(sessionKey)) {
          pollingControllers.delete(sessionKey);
          return;
        }

        const historyText = extractHistoryAssistantText(result);

        if (historyText && historyText !== prevText) {
          // Content changed — reset stale timer
          lastChangeTime = Date.now();
          prevText = historyText;
          upsertAssistantText(runId, sessionKey, historyText);
          scheduleRender();
        }

        // Check stale timeout (only if we have some content)
        if (prevText.length > 0 && Date.now() - lastChangeTime > STALE_TIMEOUT) {
          upsertAssistantText(runId, sessionKey, prevText);
          finishSendingForRun(sessionKey);
          pollingControllers.delete(sessionKey);
          return;
        }

        // Continue polling
        setTimeout(poll, POLL_INTERVAL);
      })
      .catch(() => {
        if (signal.aborted) return;
        if (Date.now() - startTime < MAX_TOTAL_TIME) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          if (!prevText) {
            const hasReal = state.messages.some(m => m.type === "assistant" && !isBadResponse((m as any).text || ""));
            if (!hasReal && !state.messages.some(m => m.id === runId)) {
              state.messages.push({
                type: "assistant",
                text: "回复获取失败，请重试。",
                timestamp: Date.now(),
                id: runId,
              });
            }
          }
          finishSendingForRun(sessionKey);
          pollingControllers.delete(sessionKey);
        }
      });
  };

  // Start polling after initial short delay
  setTimeout(poll, 800);
}

export function cancelPolling(sessionKey: string) {
  const ctrl = pollingControllers.get(sessionKey);
  if (ctrl) {
    ctrl.abort();
    pollingControllers.delete(sessionKey);
  }
}

// ─── Dispatch & Reactive Mentions ──────────────────────────────
function getLastAssistantText(): string {
  for (let i = state.messages.length - 1; i >= 0; i--) {
    if (state.messages[i].type === "assistant") {
      return (state.messages[i] as AssistantMessage).text || "";
    }
  }
  return "";
}

function extractAgentTask(response: string, agentName: string): string | null {
  const patterns = [
    new RegExp(`【分配给\\s*${escapeRegex(agentName)}】([\\s\\S]*?)(?=【分配给|$)`, "i"),
    new RegExp(`【${escapeRegex(agentName)}】([\\s\\S]*?)(?=【|$)`, "i"),
    new RegExp(`(?:^|\\n)\\*?\\*?${escapeRegex(agentName)}\\*?\\*?[：:]([\\s\\S]*?)(?=\\n\\*?\\*?\\S+[：:]|$)`, "im"),
  ];
  for (const re of patterns) {
    const m = response.match(re);
    if (m && m[1]?.trim()) return m[1].trim();
  }
  return null;
}

async function dispatchPendingAgents() {
  const pending = state.pendingDispatch;
  if (!pending || !state.client) {
    state.pendingDispatch = null;
    return;
  }
  state.pendingDispatch = null;

  const mainResponse = getLastAssistantText();
  if (!mainResponse) {
    console.warn("[Orchestration] No main response found, skipping dispatch");
    return;
  }

  console.log("[Orchestration] Main responded, dispatching to agents:", pending.targets.map(t => t.agent?.name));

  const collabTasks: NonNullable<AppState["collaborationTasks"]> = [];
  for (const t of pending.targets) {
    const agentName = t.agent?.name || t.agentId;
    const task = extractAgentTask(mainResponse, agentName);
    collabTasks.push({
      agentId: t.agentId,
      agentName,
      agentEmoji: t.agent?.emoji || "🤖",
      task: task ? (task.length > 60 ? task.slice(0, 60) + "..." : task) : "处理用户请求",
      status: "working",
    });
  }
  state.collaborationTasks = collabTasks;

  for (const t of pending.targets) {
    if (isSessionBusy(t.sessionKey)) continue;

    const agentName = t.agent?.name || t.agentId;
    const assignedTask = extractAgentTask(mainResponse, agentName);

    let agentMessage: string;
    if (assignedTask) {
      agentMessage = `${assignedTask}\n\n（以上是协调者为你分配的任务。用户的原始请求：${pending.finalMessage}）\n\n提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`;
    } else {
      agentMessage = `协调者的分析如下：\n${mainResponse}\n\n请根据你的专长，回应用户的请求：${pending.finalMessage}\n\n提示：如需其他智能体协助，请使用 @智能体名称 格式标注。`;
    }

    if (t.agentId) {
      const memory = await loadAgentMemory(t.agentId);
      if (memory) {
        agentMessage = `【智能体记忆】\n${memory}\n---\n\n${agentMessage}`;
      }
    }

    const conversationContext = buildConversationContext([], agentName);
    if (conversationContext) {
      agentMessage = `${conversationContext}\n\n---\n\n${agentMessage}`;
    }

    state.activeRuns.set(t.sessionKey, {
      runId: null,
      sessionKey: t.sessionKey,
      agentId: t.agentId,
      agentName: t.agent?.name || null,
      agentEmoji: t.agent?.emoji || null,
      agentAvatarUrl: t.agent?.avatarUrl || null,
      thinkingLabel: "正在思考...",
      toolsActive: 0,
      _retryCount: 0,
      reactive: false,
    });

    const idempotencyKey = generateUUID();
    const requestPayload: any = {
      sessionKey: t.sessionKey,
      message: agentMessage,
      deliver: false,
      idempotencyKey,
    };
    if (pending.apiAttachments.length > 0) {
      requestPayload.attachments = pending.apiAttachments;
    }

    console.log(`[Orchestration] Dispatching to ${agentName} (${t.sessionKey})`);
    state.client
      .request("chat.send", requestPayload)
      .then((r: unknown) => { console.log(`[Orchestration] ${agentName} accepted:`, r); })
      .catch((err) => {
        state.messages.push({ type: "assistant", text: `${agentName} 任务发送失败：${String(err)}`, timestamp: Date.now(), id: generateUUID() });
        state.activeRuns.delete(t.sessionKey);
        scheduleRender();
      });
  }
  scheduleRender();
}

/** Detect explicit @mention — avoids false positives from short agent names appearing in regular text */
function detectExplicitMention(text: string, agentName: string): boolean {
  // 1. @AgentName format (most explicit)
  if (text.includes(`@${agentName}`)) return true;
  // 2. 【...AgentName...】 bracket-marked format
  if (new RegExp(`【[^】]*${escapeRegex(agentName)}[^【]*】`).test(text)) return true;
  // 3. Only for names 3+ chars: boundary-delimited match (Chinese punctuation / whitespace)
  if (agentName.length >= 3) {
    const bp = `(?:^|[\\s，。、！？：；""''（）《》])${escapeRegex(agentName)}(?:$|[\\s，。、！？：；""''（）《》])`;
    if (new RegExp(bp, "m").test(text)) return true;
  }
  return false;
}

function checkReactiveMentions(finishedRun: { agentId: string | null; agentName: string | null; agentEmoji: string | null; agentAvatarUrl: string | null; reactive: boolean; sessionKey: string }) {
  if (!state.client) return;

  let responseText = "";
  for (let i = state.messages.length - 1; i >= 0; i--) {
    const m = state.messages[i];
    if (m.type === "assistant" && (m as AssistantMessage).agentId === finishedRun.agentId) {
      responseText = m.text;
      break;
    }
  }
  if (!responseText || responseText.length < 5) return;

  const mentionedAgents: AgentEntry[] = [];
  for (const agent of state.agentsList) {
    if (agent.id === finishedRun.agentId) continue;
    if (agent.isDefault) continue;
    if (detectExplicitMention(responseText, agent.name)) {
      mentionedAgents.push(agent);
    }
  }
  if (mentionedAgents.length === 0) return;

  const srcName = finishedRun.agentName || "智能体";

  for (const agent of mentionedAgents) {
    const sk = `agent:${agent.id}:main`;
    if (isSessionBusy(sk)) continue;

    const prompt = `${srcName}在回复中提到了你（${agent.name}）。以下是${srcName}的回复：\n\n${responseText.length > 800 ? responseText.slice(0, 800) + "...（已截断）" : responseText}\n\n请根据对话上下文判断，如果${srcName}的回复涉及你的专长或需要你补充，请给出你的回复。如果与你无关，请简短回复"无需补充"即可。`;

    const conversationContext = buildConversationContext([], agent.name);
    let agentMessage = prompt;
    if (conversationContext) {
      agentMessage = `${conversationContext}\n\n---\n\n${prompt}`;
    }

    console.log(`[Reactive] ${srcName} mentioned ${agent.name}, dispatching`);

    state.activeRuns.set(sk, {
      runId: null,
      sessionKey: sk,
      agentId: agent.id,
      agentName: agent.name,
      agentEmoji: agent.emoji,
      agentAvatarUrl: agent.avatarUrl || null,
      thinkingLabel: "正在思考...",
      toolsActive: 0,
      _retryCount: 0,
      reactive: true,
    });

    const idempotencyKey = generateUUID();
    state.client
      .request("chat.send", { sessionKey: sk, message: agentMessage, deliver: false, idempotencyKey })
      .then((r: unknown) => { console.log(`[Reactive] ${agent.name} accepted:`, r); })
      .catch((err) => {
        state.messages.push({ type: "assistant", text: `${agent.name} 响应失败：${String(err)}`, timestamp: Date.now(), id: generateUUID() });
        state.activeRuns.delete(sk);
        scheduleRender();
      });
  }
  scheduleRender();
}

// ─── File Handling ─────────────────────────────────────────────
export async function handleFiles(files: FileList | File[]) {
  const fileArray = Array.from(files);
  console.log("handleFiles called with", fileArray.length, "files");

  for (const file of fileArray) {
    console.log("Processing file:", file.name, "size:", file.size, "type:", file.type);

    if (file.size > 10 * 1024 * 1024) {
      state.lastError = `文件"${file.name}"过大（>10MB），请选择更小的文件`;
      scheduleRender();
      continue;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      console.log("File read as data URL, length:", dataUrl.length);

      state.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: dataUrl,
      });
      console.log("File added to attachments, total:", state.attachments.length);
    } catch (err) {
      state.lastError = `无法读取文件"${file.name}"：${String(err)}`;
      console.error("File read error:", err);
    }
  }

  console.log("Final attachments count:", state.attachments.length);

  if (state.pendingSkill && state.attachments.length > 0) {
    const skill = state.pendingSkill;
    state.pendingSkill = null;
    state.draft = skill.prompt;
    scheduleRender();
    handleSend();
    return;
  }

  scheduleRender();
}

// ─── Send Message ──────────────────────────────────────────────
export async function handleSend() {
  if (!state.client) return;

  if (!state.draft.trim() && state.attachments.length === 0) return;

  const userText = state.draft.trim();
  const msgId = generateUUID();

  const { mentions, cleanText: textWithoutMentions } = parseAgentMentions(userText);

  type SendTarget = { sessionKey: string; agentId: string; agent: AgentEntry | null };
  const nonDefaultTargets: SendTarget[] = [];
  let hasDefaultMention = false;

  for (const mention of mentions) {
    if (mention.isDefault) {
      hasDefaultMention = true;
    } else {
      const sk = `agent:${mention.agentId}:main`;
      const agent = state.agentsList.find(a => a.id === mention.agentId) || null;
      nonDefaultTargets.push({ sessionKey: sk, agentId: mention.agentId, agent });
    }
  }

  const useOrchestration = nonDefaultTargets.length >= 2;

  type DirectTarget = { sessionKey: string; agentId: string | null; agent: AgentEntry | null };
  const directTargets: DirectTarget[] = [];

  if (useOrchestration) {
    directTargets.push({ sessionKey: state.sessionKey, agentId: null, agent: null });
  } else if (mentions.length === 0) {
    directTargets.push({ sessionKey: state.sessionKey, agentId: null, agent: null });
  } else {
    if (hasDefaultMention) {
      directTargets.push({ sessionKey: state.sessionKey, agentId: null, agent: null });
    }
    for (const t of nonDefaultTargets) {
      directTargets.push(t);
    }
  }

  const busyNames: string[] = [];
  const freeTargets: DirectTarget[] = [];
  for (const t of directTargets) {
    if (isSessionBusy(t.sessionKey)) {
      const name = t.agent ? `${t.agent.emoji || "🤖"} ${t.agent.name}` : "智能体";
      busyNames.push(name);
    } else {
      freeTargets.push(t);
    }
  }
  if (useOrchestration) {
    for (const t of nonDefaultTargets) {
      if (isSessionBusy(t.sessionKey)) {
        const name = t.agent ? `${t.agent.emoji || "🤖"} ${t.agent.name}` : "智能体";
        if (!busyNames.includes(name)) busyNames.push(name);
      }
    }
  }
  if (busyNames.length > 0) {
    showToast(`${busyNames.join("、")} 正在工作中，请稍等，或安排其它智能体处理`);
  }
  if (freeTargets.length === 0) return;

  for (const t of freeTargets) {
    state.activeRuns.set(t.sessionKey, {
      runId: null,
      sessionKey: t.sessionKey,
      agentId: t.agentId,
      agentName: t.agent?.name || null,
      agentEmoji: t.agent?.emoji || null,
      agentAvatarUrl: t.agent?.avatarUrl || null,
      thinkingLabel: useOrchestration ? "正在分析任务..." : "正在思考...",
      toolsActive: 0,
      _retryCount: 0,
      reactive: false,
    });
  }

  const triggeredSkillName = state.lastSkillName;
  state.lastSkillName = null;

  const activeSkill = state.activeCustomSkill;
  state.activeCustomSkill = null;

  const contentText = mentions.length > 0 ? textWithoutMentions : userText;

  let detectedSkill = activeSkill;
  if (!detectedSkill && contentText) {
    const textLower = contentText.toLowerCase();
    for (const sk of state.customSkills) {
      if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
        detectedSkill = sk;
        break;
      }
    }
    if (!detectedSkill) {
      for (const sk of BUILTIN_SKILLS) {
        if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
          detectedSkill = sk;
          break;
        }
      }
    }
  }

  let messageToSend: string;
  if (detectedSkill && detectedSkill.prompt) {
    let skillSuffix = "";
    if (detectedSkill.id === "__builtin_knowledge-base" && state.authorizedFolder) {
      skillSuffix = `\n\n【知识库路径】\n${state.authorizedFolder}`;
    }
    messageToSend = `请严格按照以下操作流程处理用户的输入。\n\n【${detectedSkill.name} - 操作流程】\n${detectedSkill.prompt}\n\n【用户输入】\n${contentText}${skillSuffix}`;
    console.log(`[Skill] Embedded prompt for skill "${detectedSkill.name}", prompt length: ${detectedSkill.prompt.length}`);
  } else if (detectedSkill) {
    messageToSend = `请按照${detectedSkill.name}的操作流程处理以下内容。\n\n${contentText}`;
    console.log(`[Skill] Skill "${detectedSkill.name}" active but no prompt text`);
  } else {
    messageToSend = contentText;
  }

  const hasAttachments = state.attachments.length > 0;
  const hasImages = state.attachments.some(att => att.type.startsWith("image/"));
  const hasDocuments = state.attachments.some(att =>
    att.type === "application/pdf" ||
    att.type.includes("word") ||
    att.type.includes("excel") ||
    att.type.includes("document")
  );

  const displayText = userText || `(${state.attachments.length} 个文件)`;

  if (hasAttachments && !detectedSkill) {
    if (!contentText) {
      if (hasImages && hasDocuments) {
        messageToSend = "请分析这些图片和文档，提取其中的文字内容并总结要点。";
      } else if (hasImages) {
        messageToSend = "请提取图片中的所有文字内容，保持原有的结构和格式。如果图片中没有文字，请描述图片的内容。";
      } else if (hasDocuments) {
        messageToSend = "请分析这个文档，提取并总结其中的主要内容。";
      }
    } else if (hasImages) {
      messageToSend = `${contentText}\n\n（注：请先识别并提取图片中的文字内容，然后结合我的问题进行分析）`;
    }
  } else if (hasAttachments && detectedSkill && hasImages) {
    messageToSend += "\n\n（注：请先识别并提取图片中的文字内容，然后结合操作流程进行分析）";
  }

  const replyToMsg = state.replyingTo;
  if (replyToMsg) {
    const quoteSender = replyToMsg.type === "user" ? "用户" : ((replyToMsg as AssistantMessage).agentName || "Taxbot");
    const quoteText = replyToMsg.text.length > 300 ? replyToMsg.text.slice(0, 300) + "..." : replyToMsg.text;
    messageToSend = `【引用 ${quoteSender} 的消息】：${quoteText}\n\n${messageToSend}`;
  }

  const messageAttachments = state.attachments.length > 0 ? [...state.attachments] : undefined;

  state.messages.push({
    type: "user",
    text: displayText,
    timestamp: Date.now(),
    id: msgId,
    attachments: messageAttachments,
    targetAgentNames: mentions.length > 0 ? mentions.map(m => m.agentName) : undefined,
    replyToId: replyToMsg?.id,
  });

  autoTitleConversation();
  saveMessages();

  state.replyingTo = null;
  state.draft = "";
  scheduleRender();

  let apiAttachments = state.attachments
    .map(att => {
      const match = /^data:([^;]+);base64,(.+)$/.exec(att.dataUrl);
      if (!match) {
        console.warn("Failed to parse data URL for file:", att.name);
        return null;
      }
      const mimeType = match[1];
      let attachmentType = "document";
      if (mimeType.startsWith("image/")) {
        attachmentType = "image";
      }
      const attachment = {
        type: attachmentType,
        mimeType: mimeType,
        fileName: att.name,
        content: match[2],
      };
      console.log(`Prepared attachment: ${att.name}, type: ${attachmentType}, mime: ${mimeType}, base64 length: ${match[2].length}`);
      return attachment;
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  console.log(`Total attachments prepared: ${apiAttachments.length}`);

  let documentText = "";
  if (hasDocuments) {
    documentText = await extractAttachmentTexts(state.attachments);
    if (documentText) {
      messageToSend += `\n\n【文件内容】\n${documentText}`;
    }
  }

  apiAttachments = apiAttachments.filter(a => a.type === "image");

  state.attachments = [];

  if (state.knowledgeRefs.length > 0) {
    const api = (window as any).electronAPI;
    if (api?.readKnowledgeFile) {
      const refParts: string[] = [];
      for (const ref of state.knowledgeRefs) {
        try {
          const result = await api.readKnowledgeFile(ref.name);
          if (result?.ok && result.content) {
            refParts.push(`【知识库引用: ${ref.name}】\n${result.content}`);
          }
        } catch (_) {}
      }
      if (refParts.length > 0) {
        messageToSend = `${messageToSend}\n\n---\n${refParts.join("\n\n")}\n---`;
      }
    }
    state.knowledgeRefs = [];
    scheduleRender();
  }

  if (state.folderKnowledge && !state.folderKnowledgeSent) {
    const relevantKnowledge = selectRelevantKnowledge(contentText || messageToSend);
    if (relevantKnowledge) {
      messageToSend = `${messageToSend}\n\n---\n【已导入知识库文件内容】\n以下是与你的问题相关的知识库内容：\n${relevantKnowledge}\n---`;
    }
    state.folderKnowledgeSent = true;
  }

  const finalMessage = messageToSend || (apiAttachments.length > 0 ? "(查看附件)" : "");

  if (useOrchestration) {
    const agentNames = nonDefaultTargets.map(t => `${t.agent?.emoji || "🤖"} ${t.agent?.name || t.agentId}`).join("、");
    const orchestrationPrompt = `用户同时@了以下智能体协同工作：${agentNames}。\n\n请分析用户的意图，根据每个智能体的专长为它们分配具体的子任务。回复格式要求：\n1. 先简要说明你的任务分解思路\n2. 然后用以下格式为每个智能体分配任务：\n\n【分配给 智能体名称】\n具体的任务描述...\n\n用户的原始请求：${finalMessage}`;

    const freeAgentTargets = nonDefaultTargets.filter(t => !isSessionBusy(t.sessionKey));
    state.pendingDispatch = {
      targets: freeAgentTargets,
      finalMessage,
      apiAttachments: [...apiAttachments],
    };

    const conversationContext = buildConversationContext(freeTargets.map(t => t.sessionKey));
    let mainMessage = orchestrationPrompt;
    if (conversationContext) {
      mainMessage = `${conversationContext}\n\n---\n\n${orchestrationPrompt}`;
    }

    const idempotencyKey = generateUUID();
    const requestPayload: any = {
      sessionKey: state.sessionKey,
      message: mainMessage,
      deliver: false,
      idempotencyKey,
    };
    if (apiAttachments.length > 0) {
      requestPayload.attachments = apiAttachments;
    }

    console.log("[Orchestration] Sending to main for task dispatch:", state.sessionKey);
    state.client
      .request("chat.send", requestPayload)
      .then((r: unknown) => { console.log("[Orchestration] Main accepted:", r); })
      .catch((err) => {
        state.messages.push({ type: "assistant", text: `任务分配失败：${String(err)}`, timestamp: Date.now(), id: generateUUID() });
        state.activeRuns.delete(state.sessionKey);
        state.pendingDispatch = null;
        scheduleRender();
      });
    return;
  }

  for (const t of freeTargets) {
    let agentMessage = finalMessage;

    if (t.agentId) {
      const memory = await loadAgentMemory(t.agentId);
      if (memory) {
        agentMessage = `【智能体记忆 — 以下是你在之前对话中积累的重要结论和知识，请参考】\n${memory}\n---\n\n${agentMessage}`;
      }
    }

    const perAgentContext = buildConversationContext([], t.agent?.name);
    if (perAgentContext) {
      agentMessage = `${perAgentContext}\n\n---\n\n${agentMessage}`;
    }

    const idempotencyKey = generateUUID();
    const requestPayload: any = {
      sessionKey: t.sessionKey,
      message: agentMessage,
      deliver: false,
      idempotencyKey,
    };

    if (apiAttachments.length > 0) {
      requestPayload.attachments = apiAttachments;
    }

    console.log(`Sending chat.send to ${t.sessionKey}:`, {
      ...requestPayload,
      attachments: apiAttachments.map(a => ({ ...a, content: a.content.substring(0, 50) + "..." }))
    });

    state.client
      .request("chat.send", requestPayload)
      .then((response: unknown) => {
        console.log(`Chat.send response (${t.sessionKey}):`, response);
      })
      .catch((err) => {
        state.messages.push({
          type: "assistant",
          text: `抱歉，发送消息时出错（${t.agent?.name || "默认"}）：${String(err)}`,
          timestamp: Date.now(),
          id: generateUUID(),
        });
        state.activeRuns.delete(t.sessionKey);
        scheduleRender();
      });
  }
}

// ─── Abort ─────────────────────────────────────────────────────
export function abortRun(sessionKey: string) {
  if (!state.client) return;
  const run = state.activeRuns.get(sessionKey);
  if (!run) return;
  cancelPolling(sessionKey);
  state.client.request("chat.abort", { sessionKey }).catch(() => {});
  state.activeRuns.delete(sessionKey);
  if (sessionKey === state.sessionKey && state.pendingDispatch) {
    state.pendingDispatch = null;
  }
  scheduleRender();
}

export function handleAbort() {
  if (!state.client || state.activeRuns.size === 0) return;
  for (const [sk] of state.activeRuns) {
    cancelPolling(sk);
    state.client.request("chat.abort", { sessionKey: sk }).catch(() => {});
  }
  state.activeRuns.clear();
  state.pendingDispatch = null;
  scheduleRender();
}

// ─── Clear / Exit ──────────────────────────────────────────────
export function doClearAll() {
  state.messages = [];
  state.draft = "";
  state.activeRuns.clear();
  state.pendingDispatch = null;
  state.favorites.clear();
  state.sidePanel = null;
  state.confirmingClear = false;
  state.folderKnowledgeSent = false;
  saveFavorites();
  saveMessages();
  scheduleRender();
}

export async function doClearSession() {
  state.confirmingSessionClear = false;
  if (!state.client || !state.connected) {
    showToast("未连接到服务");
    scheduleRender();
    return;
  }
  try {
    await state.client.request("sessions.delete", {
      key: state.sessionKey,
      deleteTranscript: true,
    });
    state.messages = [];
    state.draft = "";
    state.activeRuns.clear();
    state.folderKnowledgeSent = false;
    saveMessages();
    showToast("会话已清空");
  } catch (err: any) {
    showToast("清空失败: " + (err?.message || String(err)));
  }
  scheduleRender();
}

export function doExitApp() {
  const api = (window as any).electronAPI;
  if (api?.quitApp) {
    api.quitApp();
  } else {
    window.close();
  }
}
