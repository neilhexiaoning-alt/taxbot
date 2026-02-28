/**
 * TaxChat Utility Functions
 */

import { toSanitizedMarkdownHtml } from "../src/ui/markdown";
import type { CustomSkill } from "./types";
import { state, generateUUID, isAnySending, scheduleRender } from "./state";
import { saveFavorites, saveNotifications } from "./persistence";
import { TAX_KEYWORDS, TOOL_LABEL_MAP } from "./constants";

// ─── Formatting ────────────────────────────────────────────────
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function generateTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

// ─── Sorting ───────────────────────────────────────────────────
export function sortedFiles() {
  const files = [...state.knowledgeFiles];
  if (state.filesSortBy === "name") {
    files.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  } else {
    files.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  }
  return files;
}

export function sortedSkills() {
  const skills = [...state.customSkills];
  if (state.skillsSortBy === "name") {
    skills.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  } else {
    skills.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  return skills;
}

// ─── File Helpers ──────────────────────────────────────────────
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

export function removeAttachment(index: number) {
  state.attachments.splice(index, 1);
  scheduleRender();
}

// ─── Favorites ─────────────────────────────────────────────────
export function toggleFavorite(msgId: string) {
  if (state.favorites.has(msgId)) {
    state.favorites.delete(msgId);
  } else {
    state.favorites.add(msgId);
  }
  saveFavorites();
  scheduleRender();
}

// ─── Message Display ───────────────────────────────────────────
export function scrollToMessage(msgId: string) {
  const el = document.querySelector(`[data-msg-id="${msgId}"]`) as HTMLElement | null;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.style.transition = "outline 0.2s";
    el.style.outline = "2px solid #00A8FF";
    setTimeout(() => { el.style.outline = "none"; }, 1500);
  }
}

export function copyMessageText(msgId: string, text: string) {
  const el = document.createElement("div");
  el.innerHTML = toSanitizedMarkdownHtml(text);
  const plain = el.innerText || el.textContent || text;
  navigator.clipboard.writeText(plain).then(() => {
    const btn = document.querySelector(`[data-copy-id="${msgId}"]`) as HTMLElement | null;
    if (btn) {
      btn.classList.add("copied");
      const label = btn.querySelector(".action-label") as HTMLElement | null;
      if (label) label.textContent = "已复制";
      setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = "复制";
      }, 1500);
    }
  });
}

// ─── Document Generation ───────────────────────────────────────
export function generateWordDoc(text: string): string {
  const bodyHtml = toSanitizedMarkdownHtml(text);
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Taxbot</title>
<style>
  body { font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 12pt; line-height: 1.8; color: #333; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #999; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  h1 { font-size: 18pt; } h2 { font-size: 15pt; } h3 { font-size: 13pt; }
  ul, ol { padding-left: 2em; }
</style>
</head><body>${bodyHtml}</body></html>`;
}

export function saveMessageAsWord(text: string) {
  const wordDoc = generateWordDoc(text);
  const blob = new Blob([wordDoc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Taxbot_${generateTimestamp()}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Toast / Notifications ─────────────────────────────────────
export function showToast(message: string, durationMs = 5000) {
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastMessage = message;
  scheduleRender();
  state.toastTimer = setTimeout(() => {
    state.toastMessage = null;
    state.toastTimer = null;
    scheduleRender();
  }, durationMs);
}

export function addNotification(text: string, icon = "📚", taskId?: string, source?: "rental" | "consult") {
  state.notifications.push({
    id: generateUUID(),
    text,
    icon,
    timestamp: Date.now(),
    ...(taskId ? { taskId } : {}),
    ...(source ? { source } : {}),
  });
  saveNotifications();
}

export function dismissQuickStart() {
  state.showQuickStart = false;
  localStorage.setItem("quickstart_seen", "1");
  scheduleRender();
}

// ─── Text Processing ───────────────────────────────────────────
export function toolLabelMap(toolName: string): string {
  return TOOL_LABEL_MAP[toolName] || "正在思考...";
}

export function stripThinkingTags(text: string): string {
  let cleaned = text.replace(/<thinking>[\s\S]*?<\/thinking>\n?/g, "").trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>\n?/g, "").trim();
  cleaned = cleaned.replace(/<\/?final>/g, "").trim();
  cleaned = cleaned.replace(/^NO\n\n/i, "");
  return cleaned;
}

export function extractMessageText(message: unknown): string {
  const m = message as Record<string, unknown>;
  const role = typeof m.role === "string" ? m.role : "";
  const content = m.content;

  if (typeof content === "string") {
    if (role === "assistant") {
      return stripThinkingTags(content);
    }
    return content;
  }

  if (Array.isArray(content)) {
    const parts = content
      .map((p) => {
        const item = p as Record<string, unknown>;
        if (item?.type === "text" && typeof item.text === "string") {
          return item.text;
        }
        return null;
      })
      .filter((v): v is string => typeof v === "string");

    if (parts.length > 0) {
      const joined = parts.join("\n");
      if (role === "assistant") {
        return stripThinkingTags(joined);
      }
      return joined;
    }
  }

  if (typeof m.text === "string") {
    if (role === "assistant") {
      return stripThinkingTags(m.text);
    }
    return m.text;
  }

  return "";
}

export function isSystemMessage(text: string): boolean {
  const stripped = text.trim();
  const systemPatterns = [
    /^NO_REPLY$/i,
    /^Pre-compaction memory flush/i,
    /^Store durable memories/i,
  ];
  return systemPatterns.some(pattern => pattern.test(stripped));
}

export function sanitizeDisplayText(text: string): string {
  if (/^NO$/i.test(text.trim()) && !isAnySending()) {
    return "模型未能正确回复，请重新发送您的问题。";
  }
  return text;
}

export function autoLinkText(text: string): string {
  const urlChars = `[^\\s<>)"'，。、；：！？》）\\]]+`;
  const pathChars = `[^\\s<>:"*?|，。、；：！？》）\\]]+`;
  const re = new RegExp(
    `(\`\`\`[\\s\\S]*?\`\`\`)` +
    `|(\\[[^\\]]*\\]\\([^)]+\\))` +
    "|\`([^\`]+)\`" +
    `|(https?:\\/\\/${urlChars})` +
    `|([A-Za-z]:\\\\(?:${pathChars}\\\\)*${pathChars})`,
    "g"
  );
  return text.replace(re, (match, codeBlock, mdLink, inlineCode, url, filePath) => {
    if (codeBlock || mdLink) return match;
    if (inlineCode !== undefined) {
      const t = inlineCode.trim();
      if (/^[A-Za-z]:\\/.test(t)) {
        const cleaned = t.replace(/[.,;:!?)]+$/, "");
        return `[${cleaned}](#localpath=${encodeURIComponent(cleaned)})`;
      }
      if (/^https?:\/\//.test(t)) {
        const cleaned = t.replace(/[.,;:!?)]+$/, "");
        return `[${cleaned}](${cleaned})`;
      }
      return match;
    }
    if (url) {
      const cleaned = url.replace(/[.,;:!?)]+$/, "");
      return `[${cleaned}](${cleaned})`;
    }
    if (filePath) {
      const cleaned = filePath.replace(/[.,;:!?)]+$/, "");
      return `[${cleaned}](#localpath=${encodeURIComponent(cleaned)})`;
    }
    return match;
  });
}

// ─── Tax Detection ─────────────────────────────────────────────
export function isTaxRelated(text: string): boolean {
  return TAX_KEYWORDS.test(text);
}

export function buildTaxYesMessageList(): Array<{ input: string; answer: string }> {
  const result: Array<{ input: string; answer: string }> = [];
  const msgs = state.messages;
  for (let i = msgs.length - 1; i >= 0 && result.length < 5; i--) {
    const msg = msgs[i];
    if (msg.type === "assistant" && i > 0) {
      const prev = msgs[i - 1];
      if (prev?.type === "user") {
        result.unshift({ input: prev.text, answer: (msg as any).text || "" });
        i--;
      }
    }
  }
  return result;
}

export async function consultTaxYes(content: string): Promise<string | null> {
  try {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI?.taxYesChat) return null;
    const messageList = buildTaxYesMessageList();
    const result = await electronAPI.taxYesChat(content, messageList);
    if (result?.ok && result.answer && result.answer.trim()) {
      return result.answer.trim();
    }
    if (!result?.ok) {
      console.warn("Taxbot API error:", result?.error);
    }
    return null;
  } catch (err) {
    console.warn("Taxbot API call failed:", err);
    return null;
  }
}

export async function extractAttachmentTexts(attachments: typeof state.attachments): Promise<string> {
  const electronAPI = (window as any).electronAPI;
  if (!electronAPI?.extractDocumentText) return "";

  const parts: string[] = [];
  for (const att of attachments) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(att.dataUrl);
    if (!match) continue;
    const mimeType = match[1];
    const base64Data = match[2];
    try {
      const result = await electronAPI.extractDocumentText(base64Data, mimeType, att.name);
      if (result?.ok && result.text?.trim()) {
        parts.push(`【${att.name}】\n${result.text.trim()}`);
      }
    } catch (err) {
      console.warn(`Failed to extract text from ${att.name}:`, err);
    }
  }
  return parts.join("\n\n");
}

// ─── Misc Helpers ──────────────────────────────────────────────
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatImportResult(result: any): string {
  const parts: string[] = [];
  if (result.textCount > 0) parts.push(`文本 ${result.textCount}`);
  if (result.imageCount > 0) parts.push(`图片 ${result.imageCount}`);
  if (result.docCount > 0) parts.push(`文档 ${result.docCount}`);
  if (parts.length === 0) return result.message || "未找到可读取的文件";
  return `已导入: ${parts.join("、")}`;
}
