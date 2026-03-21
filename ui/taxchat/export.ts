/**
 * TaxChat Conversation Export — Markdown & HTML formats
 */

import type { AssistantMessage, UserMessage } from "./types";
import { state } from "./state";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export current conversation as Markdown */
export function exportAsMarkdown() {
  if (state.messages.length === 0) return;

  const conv = state.conversations.find(c => c.id === state.currentConversationId);
  const title = conv?.title || "对话";
  const lines: string[] = [`# ${title}`, ""];

  for (const msg of state.messages) {
    if (msg.type === "user") {
      const um = msg as UserMessage;
      lines.push(`## 用户`);
      lines.push(um.text);
      lines.push("");
    } else if (msg.type === "assistant") {
      const am = msg as AssistantMessage;
      const name = am.agentName ? `${am.agentEmoji || "🤖"} ${am.agentName}` : "慧助理";
      lines.push(`## ${name}`);
      lines.push(am.text);
      lines.push("");
    }
  }

  const md = lines.join("\n");
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${title}_${new Date().toISOString().slice(0, 10)}.md`);
}

/** Export current conversation as standalone HTML */
export function exportAsHTML() {
  if (state.messages.length === 0) return;

  const conv = state.conversations.find(c => c.id === state.currentConversationId);
  const title = conv?.title || "对话";

  let messagesHtml = "";
  for (const msg of state.messages) {
    if (msg.type === "user") {
      const um = msg as UserMessage;
      const escaped = escapeHtml(um.text);
      messagesHtml += `<div class="msg user"><div class="role">用户</div><div class="content">${escaped}</div></div>\n`;
    } else if (msg.type === "assistant") {
      const am = msg as AssistantMessage;
      const name = am.agentName ? `${am.agentEmoji || "🤖"} ${am.agentName}` : "慧助理";
      const escaped = escapeHtml(am.text);
      messagesHtml += `<div class="msg assistant"><div class="role">${escapeHtml(name)}</div><div class="content">${escaped}</div></div>\n`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
h1 { color: #1B3A5C; margin-bottom: 20px; }
.msg { margin-bottom: 16px; padding: 12px 16px; border-radius: 12px; }
.msg.user { background: #e3f2fd; }
.msg.assistant { background: white; border: 1px solid #e5e7eb; }
.role { font-weight: 600; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.content { white-space: pre-wrap; line-height: 1.6; }
.footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${messagesHtml}
<div class="footer">导出于 ${new Date().toLocaleString("zh-CN")}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, `${title}_${new Date().toISOString().slice(0, 10)}.html`);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}
