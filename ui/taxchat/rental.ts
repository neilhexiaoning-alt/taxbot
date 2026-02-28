/**
 * Agent Rental — publish agents, poll tasks, complete tasks
 */

import { state, generateUUID, scheduleRender } from "./state";
import { showToast, addNotification, extractMessageText, isSystemMessage } from "./utils";
import {
  tsPublishAgent,
  tsGetMyAgents,
  tsGetPendingTasks,
  tsCompleteTask,
  tsUnpublishAgent,
  tsUpdateAgent,
  tsHeartbeat,
  tsUploadTaskAttachment,
  tsGetTaskMessages,
  tsSendTaskMessage,
  tsGetMyTasks,
  tsListAgents,
  tsCreateTask,
  tsMarkTaskRead,
  tsRequestRevision,
  tsRateTask,
  tsGetAgentStats,
} from "./taxstore-api";
import { loadAgentMemory, appendAgentMemory } from "./agents";
import { buildConversationContext } from "./chat";
import type { AgentListing, AgentTask, TaskAttachmentMeta } from "./taxstore-api";

// ─── Helpers ─────────────────────────────────────────────────

/** Convert ArrayBuffer to base64 safely (handles large files) */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
  }
  return btoa(parts.join(""));
}

/** Download task attachments, returning image attachments as base64 for the LLM */
async function fetchTaskAttachments(attachmentsJson: string): Promise<{
  imageAtts: { type: string; mimeType: string; fileName: string; content: string }[];
  textSuffix: string;
}> {
  const imageAtts: { type: string; mimeType: string; fileName: string; content: string }[] = [];
  let textSuffix = "";
  try {
    const atts = JSON.parse(attachmentsJson) as TaskAttachmentMeta[];
    const otherAtts: TaskAttachmentMeta[] = [];
    for (const a of atts) {
      if (a.type?.startsWith("image/")) {
        try {
          const res = await fetch(`https://taxbot.cc:8443${a.url}`);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            imageAtts.push({ type: "image", mimeType: a.type, fileName: a.name, content: arrayBufferToBase64(buf) });
          } else { otherAtts.push(a); }
        } catch { otherAtts.push(a); }
      } else {
        otherAtts.push(a);
      }
    }
    if (otherAtts.length > 0) {
      textSuffix = `\n\n【附件】\n${otherAtts.map(a => `- ${a.name} (${a.type}, ${(a.size / 1024).toFixed(0)}KB): https://taxbot.cc:8443${a.url}`).join("\n")}`;
    }
  } catch { /* ignore parse errors */ }
  return { imageAtts, textSuffix };
}

// ─── Publish ─────────────────────────────────────────────────

export function openPublishDialog(agent: import("./types").AgentEntry) {
  if (!state.taxstoreConnected || !state.taxstoreToken) {
    showToast("请先在技能面板中登录 TaxStore 账户");
    return;
  }
  state.rentalPublishAgent = agent;
  const existingListing = state.rentalMyListings.find(l => l.agentId === agent.id);
  const existingTags: string[] = existingListing?.tags ? (() => { try { return JSON.parse(existingListing.tags!); } catch { return []; } })() : [];
  state.rentalPublishDraft = { price: existingListing?.price || 10, description: agent.description || "", tags: existingTags };
  state.rentalPublishDialog = true;
  scheduleRender();
}

export function closePublishDialog() {
  state.rentalPublishDialog = false;
  state.rentalPublishAgent = null;
  scheduleRender();
}

export async function publishAgent() {
  if (!state.taxstoreToken || !state.rentalPublishAgent) return;
  const agent = state.rentalPublishAgent;
  const draft = state.rentalPublishDraft;

  if (draft.price < 1) {
    showToast("价格至少为 1 积分");
    return;
  }
  if (!draft.description.trim()) {
    showToast("请填写市场描述");
    return;
  }

  try {
    const publishName = agent.isDefault
      ? `Taxbot Agent by ${state.taxstoreUser?.name || "Unknown"}`
      : agent.name;
    const listing = await tsPublishAgent(state.taxstoreToken, {
      name: publishName,
      emoji: agent.emoji,
      description: draft.description.trim(),
      price: draft.price,
      agentId: agent.id,
      avatarUrl: agent.avatarUrl,
      tags: draft.tags.length > 0 ? JSON.stringify(draft.tags) : undefined,
    });
    state.rentalMyListings.push(listing);
    closePublishDialog();
    showToast(`智能体「${agent.name}」已发布到市场`);
    addNotification(`智能体「${agent.name}」已上架`, "🏪");
  } catch (err: any) {
    showToast(err.message || "发布失败");
  }
}

// ─── My Listings ─────────────────────────────────────────────

export async function loadMyListings() {
  if (!state.taxstoreToken) return;
  try {
    state.rentalMyListings = await tsGetMyAgents(state.taxstoreToken);
    scheduleRender();
  } catch {
    // Non-critical
  }
}

export function getListingForAgent(agentId: string): AgentListing | undefined {
  return state.rentalMyListings.find(l => l.agentId === agentId && l.status === "active");
}

export async function unpublishAgent(listingId: string) {
  if (!state.taxstoreToken) return;
  try {
    await tsUnpublishAgent(state.taxstoreToken, listingId);
    state.rentalMyListings = state.rentalMyListings.filter(l => l.id !== listingId);
    showToast("已下架");
    scheduleRender();
  } catch (err: any) {
    showToast(err.message || "下架失败");
  }
}

// ─── Task Polling ────────────────────────────────────────────

export async function pollPendingTasks() {
  if (!state.taxstoreToken || !state.taxstoreConnected) return;
  try {
    const tasks = await tsGetPendingTasks(state.taxstoreToken);
    const oldMap = new Map(state.rentalPendingTasks.map(t => [t.id, t]));
    const newTasks = tasks.filter(t => !oldMap.has(t.id));

    // Detect new messages on existing tasks
    for (const t of tasks) {
      const old = oldMap.get(t.id);
      if (old && (t.unreadMessageCount || 0) > 0 && (old.unreadMessageCount || 0) === 0) {
        addNotification(`${t.client.name} 给任务「${t.title}」发了新留言`, "💬", t.id, "rental");
      }
    }

    state.rentalPendingTasks = tasks;

    // Update active task if it's in the list (sync unread count)
    if (state.rentalActiveTask) {
      const updated = tasks.find(t => t.id === state.rentalActiveTask!.id);
      if (updated) state.rentalActiveTask.unreadMessageCount = updated.unreadMessageCount;
    }

    for (const t of newTasks) {
      if (t.status === "revision_requested") {
        addNotification(`收到修订请求: ${t.title} (${t.listing.name})`, "✏️", t.id, "rental");
      } else {
        addNotification(`收到新任务: ${t.title} (${t.listing.name})`, "📋", t.id, "rental");
      }
    }

    scheduleRender();
  } catch {
    // Non-critical — silent fail
  }

  // Send heartbeat for all active listings
  try {
    const activeIds = state.rentalMyListings
      .filter(l => l.status === "active")
      .map(l => l.id);
    if (activeIds.length > 0 && state.taxstoreToken) {
      tsHeartbeat(state.taxstoreToken, activeIds);
    }
  } catch { /* silent */ }

  // Auto-complete tasks that have been pending for > 2 hours
  checkAutoCompleteTasks();
}

export function startTaskPolling() {
  if (state.rentalPollingTimer) return;
  // Poll immediately then every 60s
  pollPendingTasks();
  state.rentalPollingTimer = setInterval(pollPendingTasks, 60_000);
}

export function stopTaskPolling() {
  if (state.rentalPollingTimer) {
    clearInterval(state.rentalPollingTimer);
    state.rentalPollingTimer = null;
  }
}

// ─── Client Task Polling (consult notifications) ─────────────

export async function pollConsultTasks() {
  if (!state.taxstoreToken || !state.taxstoreConnected) return;
  try {
    const tasks = await tsGetMyTasks(state.taxstoreToken);
    const oldTaskMap = new Map(state.consultMyTasks.map(t => [t.id, t]));
    const prevCount = state.consultMyTasks.length;

    for (const t of tasks) {
      const old = oldTaskMap.get(t.id);
      if (old && old.status !== "completed" && t.status === "completed") {
        addNotification(`你的咨询已完成: ${t.title} (${t.listing?.name || "智能体"})`, "✅", t.id, "consult");
      }
      // Notify on new messages
      if (old && (t.unreadMessageCount || 0) > 0 && (old.unreadMessageCount || 0) === 0) {
        addNotification(`${t.listing?.name || "智能体"} 给你发了新留言`, "💬", t.id, "consult");
      }
    }

    // Count unread: completed but not read, OR has unread messages
    const unread = tasks.filter(t =>
      (t.status === "completed" && !t.clientRead) || (t.unreadMessageCount || 0) > 0
    ).length;

    state.consultMyTasks = tasks;
    state.consultUnreadCount = unread;
    scheduleRender();
  } catch {
    // silent
  }
}

export function startConsultPolling() {
  if (state.consultPollingTimer) return;
  pollConsultTasks();
  state.consultPollingTimer = setInterval(pollConsultTasks, 60_000);
}

export function stopConsultPolling() {
  if (state.consultPollingTimer) {
    clearInterval(state.consultPollingTimer);
    state.consultPollingTimer = null;
  }
}

// ─── Consult Panel Functions ────────────────────────────────

export async function loadConsultAgents() {
  state.consultLoading = true;
  scheduleRender();
  try {
    const data = await tsListAgents({
      q: state.consultSearch || undefined,
      sort: "popular",
      limit: 50,
    });
    state.consultAgents = data.agents;
  } catch (e: any) {
    showToast(e.message || "加载智能体失败");
  } finally {
    state.consultLoading = false;
    scheduleRender();
  }
  // Load platform stats (non-blocking)
  loadConsultStats();
}

export async function loadConsultStats() {
  try {
    const stats = await tsGetAgentStats();
    if (stats.recentCount === 0) {
      state.consultAvgTime = "暂无数据";
    } else {
      const mins = stats.avgMinutes;
      let timeStr: string;
      if (mins < 1) timeStr = "不到 1 分钟";
      else if (mins < 60) timeStr = `约 ${mins} 分钟`;
      else {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        timeStr = m === 0 ? `约 ${h} 小时` : `约 ${h} 小时 ${m} 分钟`;
      }
      state.consultAvgTime = `${timeStr}（近 ${stats.recentCount} 单）`;
    }
    scheduleRender();
  } catch {
    state.consultAvgTime = "暂无数据";
    scheduleRender();
  }
}

export function openConsultDetail(agent: AgentListing) {
  state.consultSelectedAgent = agent;
  state.consultView = "detail";
  state.consultTaskTitle = "";
  state.consultTaskContent = "";
  state.consultAttachments = [];
  scheduleRender();
}

export function backToConsultList() {
  state.consultView = "list";
  state.consultSelectedAgent = null;
  scheduleRender();
}

export function openConsultMyTasks() {
  state.consultView = "my-tasks";
  pollConsultTasks();
  scheduleRender();
}

export function openConsultTaskDetail(task: AgentTask) {
  state.consultSelectedTask = task;
  state.consultView = "task-detail";
  // Reset sub-panels
  state.consultMessages = [];
  state.consultMessageInput = "";
  state.consultMessagesOpen = false;
  state.consultMessagesSending = false;
  state.consultRevisionOpen = false;
  state.consultRevisionText = "";
  state.consultRatingOpen = false;
  state.consultRatingValue = 0;
  state.consultRatingHover = 0;
  state.consultRatingComment = "";
  // Mark as read
  if (state.taxstoreToken && task.status === "completed" && !task.clientRead) {
    task.clientRead = true;
    state.consultUnreadCount = Math.max(0, state.consultUnreadCount - 1);
    tsMarkTaskRead(state.taxstoreToken, task.id);
  }
  scheduleRender();
}

export function backFromConsultTaskDetail() {
  state.consultSelectedTask = null;
  state.consultView = "my-tasks";
  scheduleRender();
}

// ─── Consult Task Messages ──────────────────────────────────

export async function toggleConsultMessages() {
  state.consultMessagesOpen = !state.consultMessagesOpen;
  if (state.consultMessagesOpen && state.consultMessages.length === 0) {
    await loadConsultMessages();
  }
  scheduleRender();
}

export async function loadConsultMessages() {
  if (!state.taxstoreToken || !state.consultSelectedTask) return;
  try {
    state.consultMessages = await tsGetTaskMessages(state.taxstoreToken, state.consultSelectedTask.id);
    // Clear unread count for this task (GET already marks as read server-side)
    if (state.consultSelectedTask.unreadMessageCount) {
      state.consultSelectedTask.unreadMessageCount = 0;
      const idx = state.consultMyTasks.findIndex(t => t.id === state.consultSelectedTask?.id);
      if (idx >= 0) state.consultMyTasks[idx].unreadMessageCount = 0;
      // Recompute total unread
      state.consultUnreadCount = state.consultMyTasks.filter(t =>
        (t.status === "completed" && !t.clientRead) || (t.unreadMessageCount || 0) > 0
      ).length;
    }
  } catch {
    // silent
  }
  scheduleRender();
}

export async function sendConsultMessage() {
  if (!state.taxstoreToken || !state.consultSelectedTask) return;
  const content = state.consultMessageInput.trim();
  if (!content) return;
  state.consultMessagesSending = true;
  scheduleRender();
  try {
    const msg = await tsSendTaskMessage(state.taxstoreToken, state.consultSelectedTask.id, content);
    state.consultMessages.push(msg);
    state.consultMessageInput = "";
  } catch (e: any) {
    showToast(e.message || "发送失败");
  } finally {
    state.consultMessagesSending = false;
    scheduleRender();
  }
}

// ─── Consult Task Revision ──────────────────────────────────

export function toggleConsultRevision() {
  state.consultRevisionOpen = !state.consultRevisionOpen;
  scheduleRender();
}

export async function submitConsultRevision() {
  if (!state.taxstoreToken || !state.consultSelectedTask) return;
  const text = state.consultRevisionText.trim();
  if (!text) { showToast("请填写修订说明"); return; }
  state.consultRevisionSubmitting = true;
  scheduleRender();
  try {
    const updated = await tsRequestRevision(state.taxstoreToken, state.consultSelectedTask.id, text);
    state.consultSelectedTask.status = updated.status;
    state.consultSelectedTask.revisionCount = updated.revisionCount;
    state.consultSelectedTask.revisionRequest = updated.revisionRequest;
    state.consultRevisionOpen = false;
    state.consultRevisionText = "";
    showToast("修订请求已发送");
    // Also update in my-tasks list
    const idx = state.consultMyTasks.findIndex(t => t.id === state.consultSelectedTask?.id);
    if (idx >= 0) { state.consultMyTasks[idx].status = updated.status; }
  } catch (e: any) {
    showToast(e.message || "请求修订失败");
  } finally {
    state.consultRevisionSubmitting = false;
    scheduleRender();
  }
}

// ─── Consult Task Rating ────────────────────────────────────

export function toggleConsultRating() {
  state.consultRatingOpen = !state.consultRatingOpen;
  scheduleRender();
}

export async function submitConsultRating() {
  if (!state.taxstoreToken || !state.consultSelectedTask) return;
  if (state.consultRatingValue < 1) { showToast("请选择评分"); return; }
  state.consultRatingSubmitting = true;
  scheduleRender();
  try {
    await tsRateTask(state.taxstoreToken, state.consultSelectedTask.id, {
      rating: state.consultRatingValue,
      comment: state.consultRatingComment.trim() || undefined,
    });
    state.consultSelectedTask.rating = state.consultRatingValue;
    state.consultSelectedTask.ratingComment = state.consultRatingComment.trim() || undefined;
    state.consultRatingOpen = false;
    showToast("感谢您的评价！");
    // Also update in my-tasks list
    const idx = state.consultMyTasks.findIndex(t => t.id === state.consultSelectedTask?.id);
    if (idx >= 0) { state.consultMyTasks[idx].rating = state.consultRatingValue; }
  } catch (e: any) {
    showToast(e.message || "评价失败");
  } finally {
    state.consultRatingSubmitting = false;
    scheduleRender();
  }
}

export async function uploadConsultAttachment(file: File) {
  if (!state.taxstoreToken) return;
  if (file.size > 10 * 1024 * 1024) {
    showToast("文件大小不能超过 10MB");
    return;
  }
  state.consultUploading = true;
  scheduleRender();
  try {
    const meta = await tsUploadTaskAttachment(state.taxstoreToken, file);
    state.consultAttachments.push(meta);
  } catch (e: any) {
    showToast(e.message || "上传失败");
  } finally {
    state.consultUploading = false;
    scheduleRender();
  }
}

export function removeConsultAttachment(index: number) {
  state.consultAttachments.splice(index, 1);
  scheduleRender();
}

export async function submitConsultTask() {
  if (!state.taxstoreToken || !state.consultSelectedAgent) return;
  if (!state.consultTaskTitle.trim() || !state.consultTaskContent.trim()) {
    showToast("请填写标题和内容");
    return;
  }
  state.consultSubmitting = true;
  scheduleRender();
  try {
    await tsCreateTask(state.taxstoreToken, state.consultSelectedAgent.id, {
      title: state.consultTaskTitle.trim(),
      content: state.consultTaskContent.trim(),
      attachments: state.consultAttachments.length > 0 ? state.consultAttachments : undefined,
    });
    showToast("任务已提交！智能体主人会尽快处理");
    state.consultTaskTitle = "";
    state.consultTaskContent = "";
    state.consultAttachments = [];
    state.consultView = "my-tasks";
    state.consultSelectedAgent = null;
    pollConsultTasks();
  } catch (e: any) {
    showToast(e.message || "提交失败");
  } finally {
    state.consultSubmitting = false;
    scheduleRender();
  }
}

// ─── Task Processing ─────────────────────────────────────────

let rentalPollController: AbortController | null = null;

export function openTaskPanel(task: AgentTask) {
  state.rentalActiveTask = task;
  state.rentalTaskResult = task.result || "";
  state.rentalAgentProcessing = false;
  state.rentalTaskPanel = true;
  state.rentalTaskAttachments = [];
  state.rentalTaskInstruction = "";
  scheduleRender();
}

export function closeTaskPanel() {
  // Abort any ongoing agent polling
  if (rentalPollController) {
    rentalPollController.abort();
    rentalPollController = null;
  }
  state.rentalTaskPanel = false;
  state.rentalActiveTask = null;
  state.rentalTaskResult = "";
  state.rentalAgentProcessing = false;
  state.rentalTaskAttachments = [];
  state.rentalTaskInstruction = "";
  scheduleRender();
}

/** Extract assistant text from chat.history result (same logic as chat.ts) */
function extractRentalAssistantText(result: any): string {
  if (!result?.messages || result.messages.length === 0) return "";
  const msgs = result.messages as any[];
  let lastUserIdx = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === "user") { lastUserIdx = i; break; }
  }
  const startIdx = lastUserIdx >= 0 ? lastUserIdx + 1 : 0;
  const texts: string[] = [];
  for (let i = startIdx; i < msgs.length; i++) {
    if (msgs[i].role === "assistant") {
      const t = extractMessageText(msgs[i]);
      if (t && !isSystemMessage(t)) texts.push(t);
    }
  }
  return texts.join("\n\n");
}

/** Send the task content to the local agent and poll for its response */
export async function processTaskWithAgent() {
  if (!state.client || !state.rentalActiveTask) return;

  const agentId = state.rentalActiveTask.listing.agentId;
  const agent = agentId ? state.agentsList.find(a => a.id === agentId) : null;
  if (!agent) {
    showToast("未找到对应的本地智能体");
    return;
  }

  state.rentalAgentProcessing = true;
  state.rentalTaskResult = "";
  scheduleRender();

  // Use a dedicated session key for rental task processing
  const sessionKey = `agent:${agent.id}:rental`;

  // Build the message to send to the agent
  const isRevision = state.rentalActiveTask.status === "revision_requested";
  let agentMessage = isRevision
    ? `请根据客户的修订要求修改之前的回答：\n\n【任务标题】${state.rentalActiveTask.title}\n\n【任务内容】\n${state.rentalActiveTask.content}\n\n【之前的回答】\n${state.rentalActiveTask.result || ""}\n\n【客户修订要求】\n${state.rentalActiveTask.revisionRequest || ""}`
    : `请处理以下用户任务，直接给出完整的回答结果：\n\n【任务标题】${state.rentalActiveTask.title}\n\n【任务内容】\n${state.rentalActiveTask.content}`;

  // Include attachment info if available — images are sent as base64 to the LLM
  let imageAttachments: { type: string; mimeType: string; fileName: string; content: string }[] = [];
  if (state.rentalActiveTask.attachments) {
    const { imageAtts, textSuffix } = await fetchTaskAttachments(state.rentalActiveTask.attachments);
    imageAttachments = imageAtts;
    agentMessage += textSuffix;
  }

  // Include agent memory if available
  const memory = await loadAgentMemory(agent.id);
  if (memory) {
    agentMessage = `【智能体记忆】\n${memory}\n---\n\n${agentMessage}`;
  }

  // Send message to the agent
  const idempotencyKey = generateUUID();
  try {
    const sendPayload: any = {
      sessionKey,
      message: agentMessage,
      deliver: false,
      idempotencyKey,
    };
    if (imageAttachments.length > 0) {
      sendPayload.attachments = imageAttachments;
    }
    await state.client.request("chat.send", sendPayload);
  } catch (err) {
    state.rentalAgentProcessing = false;
    showToast("发送任务给智能体失败：" + String(err));
    scheduleRender();
    return;
  }

  // Poll for the response
  rentalPollController?.abort();
  const controller = new AbortController();
  rentalPollController = controller;
  const signal = controller.signal;

  const POLL_INTERVAL = 1500;
  const STALE_TIMEOUT = 10_000;
  const MAX_TOTAL_TIME = 120_000;
  const startTime = Date.now();
  let lastChangeTime = Date.now();
  let prevText = "";

  const poll = () => {
    if (signal.aborted || !state.rentalAgentProcessing) return;

    if (Date.now() - startTime > MAX_TOTAL_TIME) {
      state.rentalAgentProcessing = false;
      if (prevText) {
        state.rentalTaskResult = prevText;
      } else {
        showToast("智能体处理超时，请手动填写结果");
      }
      rentalPollController = null;
      scheduleRender();
      return;
    }

    state.client?.request("chat.history", { sessionKey, limit: 20 })
      .then((result: any) => {
        if (signal.aborted || !state.rentalAgentProcessing) return;

        const historyText = extractRentalAssistantText(result);

        if (historyText && historyText !== prevText) {
          lastChangeTime = Date.now();
          prevText = historyText;
          // Live-update the result area as the agent generates text
          state.rentalTaskResult = historyText;
          scheduleRender();
        }

        // If we have content and it's been stable for STALE_TIMEOUT, we're done
        if (prevText.length > 0 && Date.now() - lastChangeTime > STALE_TIMEOUT) {
          state.rentalAgentProcessing = false;
          state.rentalTaskResult = prevText;
          rentalPollController = null;
          scheduleRender();
          return;
        }

        setTimeout(poll, POLL_INTERVAL);
      })
      .catch(() => {
        if (signal.aborted) return;
        if (Date.now() - startTime < MAX_TOTAL_TIME) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          state.rentalAgentProcessing = false;
          if (!prevText) showToast("获取智能体回复失败");
          rentalPollController = null;
          scheduleRender();
        }
      });
  };

  // Start polling after a short delay
  setTimeout(poll, 800);
}

/** Send an instruction to the agent to revise/modify the current task result */
export async function reviseTaskWithInstruction() {
  if (!state.client || !state.rentalActiveTask) return;

  const instruction = state.rentalTaskInstruction.trim();
  if (!instruction) {
    showToast("请输入修改指令");
    return;
  }

  const currentResult = state.rentalTaskResult.trim();
  if (!currentResult) {
    showToast("请先让智能体生成回答，再进行修改");
    return;
  }

  const agentId = state.rentalActiveTask.listing.agentId;
  const agent = agentId ? state.agentsList.find(a => a.id === agentId) : null;
  if (!agent) {
    showToast("未找到对应的本地智能体");
    return;
  }

  state.rentalAgentProcessing = true;
  state.rentalTaskInstruction = "";
  scheduleRender();

  const sessionKey = `agent:${agent.id}:rental`;

  const reviseMessage = `以下是你之前对用户任务的回答，请根据用户的修改指令进行修改，直接给出修改后的完整回答：\n\n【原始任务】${state.rentalActiveTask.title}\n\n【你之前的回答】\n${currentResult}\n\n【用户修改指令】\n${instruction}`;

  const idempotencyKey = generateUUID();
  try {
    await state.client.request("chat.send", {
      sessionKey,
      message: reviseMessage,
      deliver: false,
      idempotencyKey,
    });
  } catch (err) {
    state.rentalAgentProcessing = false;
    showToast("发送修改指令失败：" + String(err));
    scheduleRender();
    return;
  }

  // Poll for revised response (reuse same polling logic)
  rentalPollController?.abort();
  const controller = new AbortController();
  rentalPollController = controller;
  const signal = controller.signal;

  const POLL_INTERVAL = 1500;
  const STALE_TIMEOUT = 10_000;
  const MAX_TOTAL_TIME = 120_000;
  const startTime = Date.now();
  let lastChangeTime = Date.now();
  let prevText = "";

  const poll = () => {
    if (signal.aborted || !state.rentalAgentProcessing) return;

    if (Date.now() - startTime > MAX_TOTAL_TIME) {
      state.rentalAgentProcessing = false;
      if (prevText) {
        state.rentalTaskResult = prevText;
      } else {
        showToast("智能体修改超时");
      }
      rentalPollController = null;
      scheduleRender();
      return;
    }

    state.client?.request("chat.history", { sessionKey, limit: 20 })
      .then((result: any) => {
        if (signal.aborted || !state.rentalAgentProcessing) return;

        const historyText = extractRentalAssistantText(result);

        if (historyText && historyText !== prevText) {
          lastChangeTime = Date.now();
          prevText = historyText;
          state.rentalTaskResult = historyText;
          scheduleRender();
        }

        if (prevText.length > 0 && Date.now() - lastChangeTime > STALE_TIMEOUT) {
          state.rentalAgentProcessing = false;
          state.rentalTaskResult = prevText;
          rentalPollController = null;
          scheduleRender();
          return;
        }

        setTimeout(poll, POLL_INTERVAL);
      })
      .catch(() => {
        if (signal.aborted) return;
        if (Date.now() - startTime < MAX_TOTAL_TIME) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          state.rentalAgentProcessing = false;
          if (!prevText) showToast("获取修改结果失败");
          rentalPollController = null;
          scheduleRender();
        }
      });
  };

  setTimeout(poll, 800);
}

export async function submitTaskResult() {
  if (!state.taxstoreToken || !state.rentalActiveTask) return;

  const result = state.rentalTaskResult.trim();
  if (!result) {
    showToast("请填写任务结果");
    return;
  }

  try {
    const task = state.rentalActiveTask;

    // Upload attachments first
    let resultAttachments: TaskAttachmentMeta[] | undefined;
    if (state.rentalTaskAttachments.length > 0) {
      resultAttachments = [];
      for (const file of state.rentalTaskAttachments) {
        const meta = await tsUploadTaskAttachment(state.taxstoreToken, file);
        resultAttachments.push(meta);
      }
    }

    await tsCompleteTask(state.taxstoreToken, task.id, result, resultAttachments);
    // Remove from pending list
    state.rentalPendingTasks = state.rentalPendingTasks.filter(t => t.id !== task.id);
    showToast("任务结果已提交，积分已到账");
    addNotification(`任务「${task.title}」已完成`, "✅");

    // Save task info and result to agent memory
    const agentId = task.listing.agentId;
    if (agentId) {
      const memoryEntry = `【出租任务完成】客户: ${task.client.name}\n任务: ${task.title}\n内容: ${task.content}\n回答: ${result}`;
      appendAgentMemory(agentId, memoryEntry);
    }

    closeTaskPanel();
    // Refresh completed tasks list
    loadCompletedTasks();
  } catch (err: any) {
    showToast(err.message || "提交失败");
  }
}

// ─── Auto-complete overdue tasks ─────────────────────────────

const AUTO_COMPLETE_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours
const autoCompletingTasks = new Set<string>(); // prevent double-processing

async function autoCompleteTask(task: AgentTask) {
  if (!state.client || !state.taxstoreToken) return;
  if (autoCompletingTasks.has(task.id)) return;

  const agentId = task.listing.agentId;
  const agent = agentId ? state.agentsList.find(a => a.id === agentId) : null;
  if (!agent) return;

  autoCompletingTasks.add(task.id);
  addNotification(`任务「${task.title}」超时未处理，智能体自动处理中...`, "⏰", task.id, "rental");

  const sessionKey = `agent:${agent.id}:auto:${task.id}`;

  // Build message
  let agentMessage = `请处理以下用户任务，直接给出完整的回答结果：\n\n【任务标题】${task.title}\n\n【任务内容】\n${task.content}`;

  let autoImageAtts: { type: string; mimeType: string; fileName: string; content: string }[] = [];
  if (task.attachments) {
    const { imageAtts, textSuffix } = await fetchTaskAttachments(task.attachments);
    autoImageAtts = imageAtts;
    agentMessage += textSuffix;
  }

  const memory = await loadAgentMemory(agent.id);
  if (memory) {
    agentMessage = `【智能体记忆】\n${memory}\n---\n\n${agentMessage}`;
  }

  try {
    const autoPayload: any = {
      sessionKey,
      message: agentMessage,
      deliver: false,
      idempotencyKey: generateUUID(),
    };
    if (autoImageAtts.length > 0) {
      autoPayload.attachments = autoImageAtts;
    }
    await state.client.request("chat.send", autoPayload);
  } catch {
    autoCompletingTasks.delete(task.id);
    return;
  }

  // Poll for response
  const POLL_INTERVAL = 2000;
  const STALE_TIMEOUT = 12_000;
  const MAX_TOTAL_TIME = 180_000; // 3 minutes max for auto
  const startTime = Date.now();
  let lastChangeTime = Date.now();
  let prevText = "";

  const poll = async () => {
    if (!state.taxstoreToken) { autoCompletingTasks.delete(task.id); return; }

    if (Date.now() - startTime > MAX_TOTAL_TIME) {
      // Timeout — submit whatever we have or a default message
      const finalText = prevText || "非常抱歉，智能体处理超时。请您重新提交任务或联系智能体主人。";
      try {
        await tsCompleteTask(state.taxstoreToken!, task.id, finalText);
        state.rentalPendingTasks = state.rentalPendingTasks.filter(t => t.id !== task.id);
        addNotification(`任务「${task.title}」已自动完成`, "✅");
        if (agentId) {
          appendAgentMemory(agentId, `【自动完成任务】客户: ${task.client.name}\n任务: ${task.title}\n回答: ${finalText}`);
        }
        loadCompletedTasks();
        scheduleRender();
      } catch { /* silent */ }
      autoCompletingTasks.delete(task.id);
      return;
    }

    try {
      const result: any = await state.client?.request("chat.history", { sessionKey, limit: 20 });
      const historyText = extractRentalAssistantText(result);

      if (historyText && historyText !== prevText) {
        lastChangeTime = Date.now();
        prevText = historyText;
      }

      // Stable result — submit
      if (prevText.length > 0 && Date.now() - lastChangeTime > STALE_TIMEOUT) {
        await tsCompleteTask(state.taxstoreToken!, task.id, prevText);
        state.rentalPendingTasks = state.rentalPendingTasks.filter(t => t.id !== task.id);
        addNotification(`任务「${task.title}」已自动完成`, "✅");
        if (agentId) {
          appendAgentMemory(agentId, `【自动完成任务】客户: ${task.client.name}\n任务: ${task.title}\n回答: ${prevText}`);
        }
        loadCompletedTasks();
        scheduleRender();
        autoCompletingTasks.delete(task.id);
        return;
      }

      setTimeout(poll, POLL_INTERVAL);
    } catch {
      if (Date.now() - startTime < MAX_TOTAL_TIME) {
        setTimeout(poll, POLL_INTERVAL);
      } else {
        autoCompletingTasks.delete(task.id);
      }
    }
  };

  setTimeout(poll, 1000);
}

async function checkAutoCompleteTasks() {
  if (!state.taxstoreToken || !state.client) return;
  const now = Date.now();
  for (const task of state.rentalPendingTasks) {
    if (autoCompletingTasks.has(task.id)) continue;
    // Skip if task is currently being manually processed
    if (state.rentalActiveTask?.id === task.id) continue;
    const age = now - new Date(task.createdAt).getTime();
    if (age > AUTO_COMPLETE_THRESHOLD) {
      autoCompleteTask(task); // fire and forget — runs in background
    }
  }
}

// ─── Init ────────────────────────────────────────────────────

// ─── Completed Tasks ─────────────────────────────────────────

export async function loadCompletedTasks() {
  if (!state.taxstoreToken) return;
  try {
    state.rentalCompletedTasks = await tsGetPendingTasks(state.taxstoreToken, "completed");
    scheduleRender();
  } catch {
    // Non-critical
  }
}

export function getCompletedTasksForListing(listingId: string): import("./taxstore-api").AgentTask[] {
  return state.rentalCompletedTasks.filter(t => t.listing.id === listingId);
}

// ─── Task Messages ──────────────────────────────────────────

export async function loadTaskMessages(taskId: string) {
  if (!state.taxstoreToken) return;
  try {
    state.rentalMessages = await tsGetTaskMessages(state.taxstoreToken, taskId);
    // Clear unread count for this task (GET marks messages read server-side)
    const task = state.rentalPendingTasks.find(t => t.id === taskId);
    if (task && task.unreadMessageCount) task.unreadMessageCount = 0;
    if (state.rentalActiveTask?.id === taskId && state.rentalActiveTask.unreadMessageCount) {
      state.rentalActiveTask.unreadMessageCount = 0;
    }
    scheduleRender();
  } catch { /* ignore */ }
}

export async function sendTaskMessage() {
  if (!state.taxstoreToken || !state.rentalActiveTask || !state.rentalMessageInput.trim()) return;
  try {
    const msg = await tsSendTaskMessage(state.taxstoreToken, state.rentalActiveTask.id, state.rentalMessageInput.trim());
    state.rentalMessages = [...state.rentalMessages, msg];
    state.rentalMessageInput = "";
  } catch (err: any) {
    showToast(err.message || "发送失败");
  }
  scheduleRender();
}

export function toggleMessages() {
  state.rentalMessagesOpen = !state.rentalMessagesOpen;
  if (state.rentalMessagesOpen && state.rentalActiveTask) {
    loadTaskMessages(state.rentalActiveTask.id);
  }
  scheduleRender();
}

/** Called after TaxStore login succeeds or on startup if already logged in */
export async function initRental() {
  if (!state.taxstoreToken || !state.taxstoreConnected) return;
  await loadMyListings();
  loadCompletedTasks();
  startTaskPolling();
  startConsultPolling();
}
