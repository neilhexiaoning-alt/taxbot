/**
 * TaxChat Entry Point — UI Rendering & Initialization
 */

import "./taxchat/styles/index.css";
import { TAXBOT_VERSION } from "./taxchat/version";
import { html, render } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { live } from "lit/directives/live.js";
import { toSanitizedMarkdownHtml } from "./src/ui/markdown";

import type { AssistantMessage } from "./taxchat/types";
import { BUILTIN_SKILLS, AGENT_TEMPLATES } from "./taxchat/constants";
import {
  state, isAnySending, scheduleRender, setRenderer,
  _forceScrollBottom, setForceScrollBottom,
} from "./taxchat/state";
import { initPersistence, saveNotifications, loadFavoritesForConversation, loadMessagesForConversation, saveFavoritesForConversation } from "./taxchat/persistence";
import {
  createConversation, switchConversation, deleteConversation,
  renameConversation, initConversations,
} from "./taxchat/conversations";
import { connectGateway, cancelReconnect } from "./taxchat/gateway-connect";
import {
  handleSend, handleFiles, abortRun,
  doClearAll, doClearSession, doExitApp,
} from "./taxchat/chat";
import {
  loadAgents, createAgent, createAgentFromTemplate, deleteAgent,
  openAgentEditor, updateAgent, loadAgentMemory, saveAgentMemory,
  appendAgentMemory, insertAgentMention, getMentionCandidates,
} from "./taxchat/agents";
import {
  handleQuickSkill as _handleQuickSkill,
  openSkillEditor, saveSkillFromEditor, deleteCustomSkill,
  exportSkillAsZip, handleInstallSkillPackage, toggleSkillPin,
  handleCustomSkillClick, clearActiveCustomSkill,
  syncManagedSkills,
} from "./taxchat/skills";
import {
  loadFolderKnowledge, loadKnowledgeFiles, handleKnowledgeDrop,
  addKnowledgeRef, removeKnowledgeRef, deleteKnowledgeFileAction,
  handleAuthorizeFolder, handleRefreshFolder,
  saveMessageToKnowledge,
  startWatcher, registerWatcherListener, registerManagedSkillsListener,
  knowledgeDragCounter, setKnowledgeDragCounter,
} from "./taxchat/knowledge";
import {
  loadModelConfig, saveModelConfig,
  getProviderNames, getModelsForProvider,
  selectProvider, selectModel,
} from "./taxchat/settings";
import {
  formatTime, formatFileSize, sortedFiles, sortedSkills,
  copyMessageText, scrollToMessage, saveMessageAsWord,
  showToast, dismissQuickStart, toggleFavorite,
  autoLinkText, sanitizeDisplayText,
  removeAttachment,
} from "./taxchat/utils";
import {
  registerCommands, getFilteredCommands, checkCommandTrigger,
  closeCommandPalette, commandNavigate, commandExecuteSelected,
} from "./taxchat/commands";
import { exportAsMarkdown, exportAsHTML } from "./taxchat/export";
import {
  openSearch, closeSearch, performSearch,
  nextResult, prevResult, isSearchHit, isSearchFocused,
} from "./taxchat/search";
import {
  calculateVirtualRange, measureRenderedHeights,
  checkAtBottom, autoScrollToBottom, forceScrollToBottom,
  clearHeightCache,
} from "./taxchat/virtual-scroll";
import {
  initTaxStore, loginTaxStore, logoutTaxStore,
  fetchSkills, searchSkills, filterByCategory, changeSortOrder,
  installFromTaxStore, syncInstalled,
  isInstalledLocally, avgRating,
} from "./taxchat/taxstore";
import {
  openPublishDialog, closePublishDialog, publishAgent,
  getListingForAgent, unpublishAgent,
  openTaskPanel, closeTaskPanel, submitTaskResult,
  processTaskWithAgent, reviseTaskWithInstruction, initRental, getCompletedTasksForListing,
  toggleMessages, sendTaskMessage,
  loadConsultAgents, openConsultDetail, backToConsultList,
  openConsultMyTasks, openConsultTaskDetail, backFromConsultTaskDetail,
  submitConsultTask, uploadConsultAttachment, removeConsultAttachment,
  toggleConsultMessages, sendConsultMessage, loadConsultMessages,
  toggleConsultRevision, submitConsultRevision,
  toggleConsultRating, submitConsultRating,
  loadMyListings, pollPendingTasks, loadCompletedTasks, pollConsultTasks,
} from "./taxchat/rental";
import { tsGetMe } from "./taxchat/taxstore-api";

// ─── Avatar URL Helper ──────────────────────────────────────
/** Resolve agent avatar URL — handles data URLs, relative paths, and full URLs */
function agentAvatarSrc(url: string | null | undefined): string | null {
  if (!url || url.length < 2) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http")) return url;
  return `https://taxbot.cc:8443${url}`;
}

/** Resolve attachment URL */
function attUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `https://taxbot.cc:8443${url}`;
}

/** Parse attachment JSON */
function parseAtts(json: string | null | undefined): Array<{ name: string; url: string; type: string; size: number }> {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

/** Format file size */
function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ─── Global Refresh ──────────────────────────────────────────
async function refreshAll() {
  if (state.refreshing) return;
  state.refreshing = true;
  scheduleRender();

  const tasks: Promise<unknown>[] = [];

  // Gateway + Agents
  if (!state.connected) {
    tasks.push(connectGateway().catch(() => {}));
  }
  tasks.push(loadAgents().catch(() => {}));

  // TaxStore data (only if logged in)
  if (state.taxstoreToken && state.taxstoreConnected) {
    tasks.push(tsGetMe(state.taxstoreToken).then(u => { if (u) state.taxstoreUser = u; }).catch(() => {}));
    tasks.push(loadMyListings().catch(() => {}));
    tasks.push(pollPendingTasks().catch(() => {}));
    tasks.push(loadCompletedTasks().catch(() => {}));
    tasks.push(pollConsultTasks().catch(() => {}));
    tasks.push(loadConsultAgents().catch(() => {}));
  }

  // Knowledge files
  if (state.authorizedFolder) {
    tasks.push(loadKnowledgeFiles().catch(() => {}));
  }

  await Promise.allSettled(tasks);

  state.refreshing = false;
  state.lastRefreshTime = Date.now();
  showToast("数据已刷新");
  scheduleRender();
}

// ─── Quick Skill Wrapper ──────────────────────────────────────
function handleQuickSkill(skillName: string, prompt: string, displayLabel: string, noFilePicker?: boolean) {
  _handleQuickSkill(skillName, prompt, displayLabel, noFilePicker, handleSend, handleFiles);
}

// ─── Render Functions (extracted from original) ───────────────

function renderQuickStart() {
  return html`
    <div class="quickstart-overlay" @click=${dismissQuickStart}>
      <div class="quickstart-container" @click=${(e: Event) => e.stopPropagation()}>

        <div class="qs-topbar">
          <button class="qs-back-btn" @click=${dismissQuickStart}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            返回
          </button>
          <span class="qs-topbar-title">使用指南</span>
          <span style="width:60px;"></span>
        </div>

        <!-- Hero -->
        <div class="qs-hero">
          <img src="./assets/taxchat-logo.png" alt="Taxbot" style="width:72px;height:72px;" />
          <h1>欢迎使用Taxbot</h1>
          <p>您的 AI 税务助手，帮助您分析税务风险、审核票据合同、整理报销单、管理知识库。</p>
        </div>

        <!-- Section 1: Layout Overview -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">1</span> 界面布局</div>
          <div class="qs-section-desc">应用采用左侧功能菜单 + 右侧聊天的布局。点击左侧图标可展开知识库、技能、收藏等面板，聊天始终可见。</div>
          <div class="qs-sidebar-mock">
            <div class="qs-sidebar-nav">
              <div class="qs-sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
              <div class="qs-sidebar-icon active"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
              <div class="qs-sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            </div>
            <div class="qs-sidebar-panel">
              <div class="qs-sidebar-panel-title">技能管理</div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">🧾</span>
                <div class="qs-skill-info"><div class="qs-skill-name">税务风险治理</div><div class="qs-skill-desc">风险识别与说明函生成</div></div>
              </div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">📊</span>
                <div class="qs-skill-info"><div class="qs-skill-name">申报表预审</div><div class="qs-skill-desc">申报表与财务报表比对</div></div>
              </div>
              <div class="qs-skill-row">
                <span class="qs-skill-emoji">📝</span>
                <div class="qs-skill-info"><div class="qs-skill-name">合同及票据税审</div><div class="qs-skill-desc">从税务角度审核合同</div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Chat -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">2</span> 智能对话</div>
          <div class="qs-section-desc">在底部输入框输入税务问题，AI 实时解答。支持多轮对话，上下文自动关联。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">对话界面</span>
            </div>
            <div class="qs-mockup-body">
              <div class="qs-chat-row user"><div class="qs-chat-bubble qs-chat-user">收到一张6%咨询费发票，可以抵扣吗？</div></div>
              <div class="qs-chat-row"><div class="qs-chat-bubble qs-chat-ai">咨询费属于<b>现代服务业</b>，一般纳税人取得6%税率专用发票可进行<b>进项税额抵扣</b>。需注意：<br/>1. 确保为增值税专用发票<br/>2. 业务真实性需有合同支撑<br/>3. 需在规定期限内认证</div></div>
              <div class="qs-chat-row user"><div class="qs-chat-bubble qs-chat-user">小规模纳税人呢？</div></div>
              <div class="qs-chat-row"><div class="qs-chat-bubble qs-chat-ai">小规模纳税人采用<b>简易计税</b>，不存在进项抵扣，发票直接计入成本费用。</div></div>
            </div>
          </div>
        </div>

        <!-- Section 3: Quick Skills -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">3</span> 快捷技能栏</div>
          <div class="qs-section-desc">聊天输入框上方为快捷技能栏，点击即可启用专业税务技能，上传文件后自动分析。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">快捷技能</span>
            </div>
            <div class="qs-btn-row">
              <div class="qs-btn-pill">🧾 税务风险治理</div>
              <div class="qs-btn-pill">📊 申报表预审</div>
              <div class="qs-btn-pill">📝 合同及票据税审</div>
              <div class="qs-btn-pill">🔍 发票查验</div>
              <div class="qs-btn-pill">🧾 票据整理</div>
              <div class="qs-btn-pill">📚 知识库</div>
              <div class="qs-btn-pill">📎 上传文件</div>
            </div>
          </div>
        </div>

        <!-- Section 4: Knowledge -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">4</span> 知识库管理</div>
          <div class="qs-section-desc">点击左侧 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 图标打开知识库面板。授权文件夹后，AI 自动学习其中文件，点击"引用"可将指定文件作为上下文发送。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">知识库面板</span>
            </div>
            <div class="qs-mockup-body">
              <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">📂 D:\\我的文档\\税务资料 &nbsp;<span style="color:#2E5484;">更换</span> &nbsp;<span style="color:#2E5484;">刷新</span></div>
              <div class="qs-file-row"><span>📄</span><span class="qs-file-name">2024年度纳税申报表.pdf</span><span class="qs-file-size">2.3MB</span><span class="qs-file-btn">引用</span></div>
              <div class="qs-file-row"><span>📊</span><span class="qs-file-name">财务报表汇总.xlsx</span><span class="qs-file-size">856KB</span><span class="qs-file-btn">引用</span></div>
              <div class="qs-file-row"><span>📝</span><span class="qs-file-name">服务合同-2024.docx</span><span class="qs-file-size">145KB</span><span class="qs-file-btn">引用</span></div>
            </div>
          </div>
        </div>

        <!-- Section 5: Message Actions -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">5</span> 消息操作</div>
          <div class="qs-section-desc">鼠标悬停在 AI 回复上，会浮现操作按钮：复制、导出 Word、收藏、存入知识库。</div>
          <div class="qs-mockup">
            <div class="qs-mockup-bar">
              <span class="qs-dot qs-dot-r"></span>
              <span class="qs-dot qs-dot-y"></span>
              <span class="qs-dot qs-dot-g"></span>
              <span style="margin-left:8px;">消息操作</span>
            </div>
            <div class="qs-mockup-body">
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:100%;">
                增值税（6%）：咨询服务费 50,000 元，税额 2,830.19 元<br/>
                <b>风险提示：</b>合同未注明价税分离条款，建议补充。
              </div>
              <div class="qs-msg-actions" style="margin-top:6px;">
                <span class="qs-msg-action">📋 复制</span>
                <span class="qs-msg-action">📝 导出Word</span>
                <span class="qs-msg-action">⭐ 收藏</span>
                <span class="qs-msg-action">💾 存入知识库</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6: Tips -->
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">6</span> 实用技巧</div>
        </div>
        <div class="qs-tips-grid">
          <div class="qs-tip-card" style="background:#f0f9ff;"><b style="color:#1B3A5C;">📂 知识库自动学习</b>授权文件夹后，新增文件自动学习，无需手动导入。</div>
          <div class="qs-tip-card" style="background:#fefce8;"><b style="color:#a16207;">⭐ 收藏重要回复</b>收藏后可从左侧面板快速查找历史回复。</div>
          <div class="qs-tip-card" style="background:#f0fdf4;"><b style="color:#15803d;">📎 拖拽上传文件</b>将文件直接拖入输入区域即可上传分析。</div>
          <div class="qs-tip-card" style="background:#fdf2f8;"><b style="color:#be185d;">🛠 固定常用技能</b>自定义技能点击固定后出现在快捷栏。</div>
        </div>

        <!-- Footer -->
        <div class="qs-footer">
          <button class="qs-btn-start" @click=${dismissQuickStart}>开始使用Taxbot</button>
          <div class="qs-footer-hint">可随时在左侧"关于"页面重新查看此指南</div>
        </div>

      </div>
    </div>
  `;
}

function renderMessages() {
  if (state.messages.length === 0) {
    return html`
      <div class="empty-state">
        <div class="empty-state__icon">
          <img src="./assets/taxchat-logo.png" alt="Taxbot" style="width: 120px; height: 120px;" />
        </div>
        <div class="empty-state__text">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">欢迎来到Taxbot</div>
          <div>有任何税务问题？请在下方输入并提问</div>
        </div>
      </div>
    `;
  }

  const groups: typeof html[] = [];

  // Virtual scrolling: calculate visible range
  const container = document.getElementById("messages-container");
  const scrollTop = container?.scrollTop || 0;
  const containerHeight = container?.clientHeight || 600;
  const vRange = calculateVirtualRange(state.messages, scrollTop, containerHeight);
  const visibleMessages = state.messages.slice(vRange.startIndex, vRange.endIndex);

  // Top spacer
  if (vRange.topPadding > 0) {
    groups.push(html`<div style="height:${vRange.topPadding}px;"></div>`);
  }

  for (const msg of visibleMessages) {
    // Helper: render quote card if message has replyToId
    const renderQuoteCard = (replyToId?: string) => {
      if (!replyToId) return "";
      const quoted = state.messages.find(m => m.id === replyToId);
      if (!quoted) return "";
      const sender = quoted.type === "user" ? "我" : ((quoted as AssistantMessage).agentName || "Taxbot");
      const preview = quoted.text.length > 80 ? quoted.text.slice(0, 80) + "..." : quoted.text;
      return html`<div class="message-quote-card" @click=${() => {
        const el = document.querySelector(`[data-msg-id="${replyToId}"]`);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("highlight-flash"); setTimeout(() => el.classList.remove("highlight-flash"), 1500); }
      }}><span class="quote-sender">${sender}</span><span class="quote-text">${preview}</span></div>`;
    };

    if (msg.type === "user") {
      groups.push(html`
        <div class="message-group" data-msg-id="${msg.id}">
          <div class="message-item user">
            <div class="message-content user">
              ${renderQuoteCard(msg.replyToId)}
              ${msg.text ? html`<div class="message-bubble user">${msg.text}</div>` : ""}
              ${msg.attachments && msg.attachments.length > 0 ? html`
                <div class="message-attachments">
                  ${msg.attachments.map(att => html`
                    <div class="attachment-thumbnail" @click=${() => {
                      state.previewAttachment = att;
                      renderApp();
                    }}>
                      ${att.type.startsWith("image/") ? html`
                        <img src=${att.dataUrl} alt=${att.name} class="thumbnail-image" />
                      ` : html`
                        <div class="thumbnail-file">
                          <span class="file-icon">📄</span>
                          <span class="file-name">${att.name}</span>
                        </div>
                      `}
                    </div>
                  `)}
                </div>
              ` : ""}
            </div>
            <div class="message-avatar user">👤</div>
          </div>
          <div class="message-actions user-actions">
            <button class="message-action-btn" @click=${() => { state.replyingTo = msg; renderApp(); setTimeout(() => state.inputRef?.focus(), 50); }} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    } else {
      const isFav = state.favorites.has(msg.id);
      const aMsg = msg as AssistantMessage;
      groups.push(html`
        <div class="message-group" data-msg-id="${msg.id}">
          ${aMsg.agentName ? html`<div class="message-agent-name">${aMsg.agentEmoji || "🤖"} ${aMsg.agentName}</div>` : ""}
          ${renderQuoteCard(aMsg.replyToId)}
          <div class="message-item">
            <div class="message-avatar assistant">${aMsg.agentAvatarUrl
              ? html`<img src="${aMsg.agentAvatarUrl}" class="agent-avatar-img" alt="${aMsg.agentName || ""}" />`
              : aMsg.agentEmoji
              ? html`<span class="agent-emoji-avatar">${aMsg.agentEmoji}</span>`
              : html`<img src="./assets/taxchat-logo.png" alt="Taxbot" />`}</div>
            <div class="message-bubble assistant markdown-body ${isFav ? "favorited" : ""}">${unsafeHTML(toSanitizedMarkdownHtml(autoLinkText(sanitizeDisplayText(msg.text))))}</div>
          </div>
          <div class="message-actions">
            <button class="message-action-btn" @click=${() => { state.replyingTo = msg; renderApp(); setTimeout(() => state.inputRef?.focus(), 50); }} title="引用回复">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></span><span class="action-label">引用</span>
            </button>
            <button class="message-action-btn" data-copy-id="${msg.id}" @click=${() => copyMessageText(msg.id, msg.text)} title="复制文本">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span><span class="action-label">复制</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageAsWord(msg.text)} title="保存为Word文档">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span><span class="action-label">保存Word</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageToKnowledge(msg.text)} title="保存到知识库">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span><span class="action-label">存知识库</span>
            </button>
            <button class="message-action-btn ${isFav ? "fav-active" : ""}" @click=${() => toggleFavorite(msg.id)} title="${isFav ? "取消收藏" : "收藏"}">
              <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="action-label">${isFav ? "已收藏" : "收藏"}</span>
            </button>
            ${aMsg.agentId ? html`
              <button class="message-action-btn" @click=${() => { appendAgentMemory(aMsg.agentId!, msg.text.length > 500 ? msg.text.slice(0, 500) + "..." : msg.text); showToast("已保存到智能体记忆"); }} title="保存到该智能体的记忆">
                <span class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg></span><span class="action-label">记住</span>
              </button>
            ` : ""}
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    }
  }

  // Bottom spacer for virtual scroll
  if (vRange.bottomPadding > 0) {
    groups.push(html`<div style="height:${vRange.bottomPadding}px;"></div>`);
  }

  // Show collaboration card when multi-agent orchestration is in progress
  if (state.collaborationTasks && state.collaborationTasks.length > 0) {
    const statusIcon = (s: string) => s === "done" ? "✅" : s === "error" ? "❌" : "💭";
    groups.push(html`
      <div class="message-group">
        <div class="collab-card">
          <div class="collab-card__header">🤝 智能体协作中</div>
          ${state.collaborationTasks.map(t => html`
            <div class="collab-card__row">
              <span class="collab-card__emoji">${t.agentEmoji}</span>
              <span class="collab-card__name">${t.agentName}</span>
              <span class="collab-card__task">${t.task}</span>
              <span class="collab-card__status">${statusIcon(t.status)}</span>
            </div>
          `)}
        </div>
      </div>
    `);
  }

  // Show thinking indicators for ALL active runs (parallel agents)
  for (const run of state.activeRuns.values()) {
    const tgtAgent = run.agentId ? state.agentsList.find(a => a.id === run.agentId) : null;
    groups.push(html`
      <div class="message-group">
        ${tgtAgent ? html`<div class="message-agent-name">${tgtAgent.emoji || "🤖"} ${tgtAgent.name}</div>` : ""}
        <div class="message-item">
          <div class="message-avatar assistant">${tgtAgent?.avatarUrl
            ? html`<img src="${tgtAgent.avatarUrl}" class="agent-avatar-img" alt="${tgtAgent.name}" />`
            : tgtAgent?.emoji
            ? html`<span class="agent-emoji-avatar">${tgtAgent.emoji}</span>`
            : html`<img src="./assets/taxchat-logo.png" alt="Taxbot" />`}</div>
          <div class="message-bubble assistant">
            <div class="thinking-indicator">
              ${run.thinkingLabel ? html`<span class="thinking-label">${run.thinkingLabel}</span>` : ""}
              <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
              <button class="thinking-cancel-btn" @click=${() => abortRun(run.sessionKey)} title="取消">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <span>取消</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  return html`${groups}`;
}


// ─── Side Panel Resize ──────────────────────────────────────
function handleSidePanelResizeStart(e: MouseEvent) {
  e.preventDefault();
  const panel = (e.target as HTMLElement).parentElement!;
  const handle = e.target as HTMLElement;
  handle.classList.add("dragging");
  const startX = e.clientX;
  const startW = panel.offsetWidth;

  const onMove = (ev: MouseEvent) => {
    const newW = Math.min(Math.max(startW + ev.clientX - startX, 240), 700);
    panel.style.width = newW + "px";
  };
  const onUp = (ev: MouseEvent) => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    handle.classList.remove("dragging");
    const finalW = Math.min(Math.max(startW + ev.clientX - startX, 240), 700);
    state.sidePanelWidth = finalW;
    localStorage.setItem("taxbot_side_panel_width", String(finalW));
    renderApp();
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  // Always show chat interface, connection status only in header
  const statusText = state.connected ? "助理已就位" : "助理准备中...";
  const statusClass = state.connected ? "ok" : "";

  const content = html`
    <div class="taxchat-app">
      <header class="taxchat-header">
        <div class="taxchat-header__title">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="taxchat-header__logo" @click=${() => { state.sidePanel = state.sidePanel === "about" ? null : "about"; renderApp(); }} style="cursor: pointer;" title="关于Taxbot">
              <img src="./assets/taxchat-logo.png" alt="Taxbot" />
            </div>
            <h1>Taxbot</h1>
            <div class="taxchat-header__status" @click=${(e: Event) => { e.stopPropagation(); state.showStatusMenu = !state.showStatusMenu; renderApp(); }}>
              <span class="status-dot ${statusClass}"></span> ${statusText} <span class="status-arrow">▾</span>
              ${state.showStatusMenu ? html`
                <div class="status-menu" @click=${(e: Event) => e.stopPropagation()}>
                  ${state.connected ? html`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.restartGateway) api.restartGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>📞 呼叫个人助理</div>
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.stopGateway) api.stopGateway(); state.connected = false; cancelReconnect(); renderApp(); }}>😴 让助理下班</div>
                  ` : html`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = (window as any).electronAPI; if (api?.startGateway) api.startGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>📞 呼叫个人助理</div>
                  `}
                </div>
              ` : ""}
            </div>
          </div>
        </div>
        <div class="taxchat-header__right">
          ${(() => { const _unread = state.notifications.filter(n => !n.read).length; return html`
          <button class="header-notif-btn" @click=${(e: Event) => { e.stopPropagation(); state.showNotifications = !state.showNotifications; renderApp(); }} title="消息">
            🔔${_unread > 0 ? html`<span class="header-notif-badge">${_unread}</span>` : ""}
          </button>
          ${state.showNotifications ? html`
            <div class="notif-dropdown" @click=${(e: Event) => e.stopPropagation()}>
              <div class="notif-dropdown__header">
                <span>消息${_unread > 0 ? ` (${_unread})` : ""}</span>
                <div class="notif-dropdown__actions">
                  ${_unread > 0 ? html`<button class="notif-dropdown__clear" @click=${() => { state.notifications.forEach(n => n.read = true); saveNotifications(); renderApp(); }}>全部已读</button>` : ""}
                  ${state.notifications.length > 0 ? html`<button class="notif-dropdown__clear" @click=${() => { state.notifications = []; saveNotifications(); renderApp(); }}>清空</button>` : ""}
                </div>
              </div>
              <div class="notif-dropdown__list">
                ${state.notifications.length === 0
                  ? html`<div class="notif-dropdown__empty">暂无消息</div>`
                  : [...state.notifications].reverse().map(n => html`
                    <div class="notif-item ${n.source ? 'notif-item--task' : n.taskId ? 'notif-item--task' : 'notif-item--clickable'} ${n.read ? 'notif-item--read' : ''}" @click=${() => {
                      n.read = true;
                      saveNotifications();
                      state.showNotifications = false;
                      if (n.taskId && n.source === "rental") {
                        const task = state.rentalPendingTasks.find(t => t.id === n.taskId);
                        if (task) { openTaskPanel(task); }
                        else { state.notifDetail = n; renderApp(); }
                      } else if (n.taskId && n.source === "consult") {
                        const task = state.consultMyTasks.find(t => t.id === n.taskId);
                        if (task) { state.sidePanel = "consult"; openConsultTaskDetail(task); }
                        else { state.sidePanel = "consult"; openConsultMyTasks(); renderApp(); }
                      } else if (n.taskId) {
                        // Legacy notifications without source — try both lists
                        const rTask = state.rentalPendingTasks.find(t => t.id === n.taskId);
                        if (rTask) { openTaskPanel(rTask); }
                        else {
                          const cTask = state.consultMyTasks.find(t => t.id === n.taskId);
                          if (cTask) { state.sidePanel = "consult"; openConsultTaskDetail(cTask); }
                          else { state.notifDetail = n; renderApp(); }
                        }
                      } else {
                        state.notifDetail = n; renderApp();
                      }
                    }}>
                      ${!n.read ? html`<div class="notif-item__dot"></div>` : ""}
                      <div class="notif-item__icon">${n.icon}</div>
                      <div class="notif-item__body">
                        <div class="notif-item__text">${n.text}</div>
                        <div class="notif-item__time">${formatTime(n.timestamp)}</div>
                        ${n.source === "rental" ? html`<div class="notif-item__hint">点击处理任务</div>` : n.source === "consult" ? html`<div class="notif-item__hint">点击查看详情</div>` : ""}
                      </div>
                      <button class="notif-item__remove" @click=${(e: Event) => {
                        e.stopPropagation();
                        state.notifications = state.notifications.filter(x => x.id !== n.id);
                        saveNotifications();
                        renderApp();
                      }} title="删除">✕</button>
                    </div>
                  `)
                }
              </div>
            </div>
          ` : ""}`; })()}
          <button class="header-refresh-btn ${state.refreshing ? "spinning" : ""}" @click=${() => refreshAll()} title="${state.lastRefreshTime ? `上次刷新: ${formatTime(state.lastRefreshTime)}` : "刷新所有数据"}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button class="header-exit-btn" @click=${() => { state.confirmingExit = true; renderApp(); }} title="退出应用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      ${state.confirmingExit ? html`
        <div class="model-confirm-overlay" @click=${() => { state.confirmingExit = false; renderApp(); }}>
          <div class="model-confirm-dialog" @click=${(e: Event) => e.stopPropagation()}>
            <div class="model-confirm-title">确认退出应用</div>
            <div class="model-confirm-hint" style="margin-bottom:20px;font-size:13px;">退出将关闭窗口并关闭 Gateway 服务。</div>
            <div class="model-confirm-actions">
              <button class="model-confirm-btn cancel" @click=${() => { state.confirmingExit = false; renderApp(); }}>取消</button>
              <button class="model-confirm-btn confirm" style="background:linear-gradient(135deg,#ef4444,#dc2626);" @click=${() => { doExitApp(); }}>确认退出</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.notifDetail ? html`
        <div class="notif-detail-overlay" @click=${() => { state.notifDetail = null; renderApp(); }}>
          <div class="notif-detail-dialog" @click=${(e: Event) => e.stopPropagation()}>
            <div class="notif-detail-icon">${state.notifDetail.icon}</div>
            <div class="notif-detail-text">${state.notifDetail.text}</div>
            <div class="notif-detail-time">${formatTime(state.notifDetail.timestamp)}</div>
            <button class="notif-detail-close" @click=${() => { state.notifDetail = null; renderApp(); }}>关闭</button>
          </div>
        </div>
      ` : ""}

      <div class="taxchat-body">
        <nav class="taxchat-sidebar ${state.sidebarCollapsed ? "collapsed" : ""}">
          <div class="sidebar-menu">
            <button class="sidebar-item ${state.sidePanel === "conversations" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "conversations" ? null : "conversations"; renderApp(); }} title="对话">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">对话</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "knowledge" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "knowledge" ? null : "knowledge"; if (state.sidePanel === "knowledge") loadKnowledgeFiles(); renderApp(); }} title="知识库">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span><span class="sidebar-label">知识库</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "skills" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "skills" ? null : "skills"; if (state.sidePanel === "skills" && state.skillsTab === "market" && state.taxstoreConnected && state.taxstoreSkills.length === 0) fetchSkills(1); renderApp(); }} title="我的技能">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="sidebar-label">我的技能</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "agents" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "agents" ? null : "agents"; if (state.sidePanel === "agents") loadAgents(); renderApp(); }} title="我的智能体">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="sidebar-label">我的智能体</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "favorites" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "favorites" ? null : "favorites"; renderApp(); }} title="收藏">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span><span class="sidebar-label">收藏</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "consult" ? "active" : ""}" @click=${() => { if (state.sidePanel === "consult") { state.sidePanel = null; } else { state.sidePanel = "consult"; state.consultView = "list"; if (state.consultAgents.length === 0) loadConsultAgents(); } renderApp(); }} title="AI专家咨询">
              <span class="sidebar-icon" style="position:relative;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>${state.consultUnreadCount > 0 ? html`<span class="sidebar-red-dot"></span>` : ""}</span><span class="sidebar-label">AI专家咨询${state.consultUnreadCount > 0 ? html`<span class="consult-unread-badge">${state.consultUnreadCount}</span>` : ""}</span>
            </button>
          </div>
          <div class="sidebar-bottom">
            <button class="sidebar-item ${state.sidePanel === "settings" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "settings" ? null : "settings"; if (state.sidePanel === "settings" && state.modelList.length === 0) loadModelConfig(); renderApp(); }} title="设置">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></span><span class="sidebar-label">设置</span>
            </button>
            <button class="sidebar-item ${state.sidePanel === "about" ? "active" : ""}" @click=${() => { state.sidePanel = state.sidePanel === "about" ? null : "about"; renderApp(); }} title="关于">
              <span class="sidebar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span><span class="sidebar-label">关于</span>
            </button>
            <button class="sidebar-item" @click=${() => { window.open("https://taxbot.cc", "_blank"); }} title="Taxbot">
              <span class="sidebar-icon"><img src="./assets/taxchat-logo.png" alt="Taxbot" style="width:18px;height:18px;border-radius:4px;object-fit:contain;" /></span><span class="sidebar-label">Taxbot</span>
            </button>
            <button class="sidebar-collapse-btn" @click=${() => { state.sidebarCollapsed = !state.sidebarCollapsed; localStorage.setItem("taxbot_sidebar_collapsed", String(state.sidebarCollapsed)); renderApp(); }} title=${state.sidebarCollapsed ? "展开侧栏" : "收起侧栏"}>
              ${state.sidebarCollapsed ? html`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>` : html`<span class="sidebar-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></span>`}
            </button>
          </div>
        </nav>

        <div class="side-panel ${state.sidePanel ? "open" : ""} ${state.sidePanel === "about" || state.sidePanel === "settings" || state.sidePanel === "consult" ? "fullscreen" : ""}"
             style="${state.sidePanel && state.sidePanel !== "about" && state.sidePanel !== "settings" && state.sidePanel !== "consult" ? `width:${state.sidePanelWidth}px` : ""}">
          ${state.sidePanel && state.sidePanel !== "about" && state.sidePanel !== "settings" && state.sidePanel !== "consult" ? html`
            <div class="side-panel-resize" @mousedown=${handleSidePanelResizeStart}></div>
          ` : ""}
        ${state.sidePanel === "conversations" ? html`
          <div class="side-panel-view conversations-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 对话列表</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <button class="conv-new-btn" @click=${() => { createConversation(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                新建对话
              </button>
              <div class="conv-list">
                ${[...state.conversations].sort((a, b) => (b.lastAccessedAt || b.updatedAt) - (a.lastAccessedAt || a.updatedAt)).map(conv => {
                  const isActive = conv.id === state.currentConversationId;
                  const isRenaming = state.renamingConversation === conv.id;
                  const isConfirmingDelete = state.confirmingConvDelete === conv.id;
                  const timeStr = new Date(conv.updatedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  const hasUnread = state.unreadConversations.has(conv.id);
                  const convSK = `taxchat-${conv.id}`;
                  const isReplying = [...state.activeRuns.values()].some(r => r.sessionKey === convSK);
                  return html`
                    <div class="conv-item ${isActive ? "conv-item--active" : ""} ${hasUnread ? "conv-item--unread" : ""}" @click=${() => { if (!isRenaming && !isConfirmingDelete) switchConversation(conv.id); }}>
                      <div class="conv-item__main">
                        ${isRenaming ? html`
                          <input class="conv-rename-input" type="text" .value=${conv.title}
                            @click=${(e: Event) => e.stopPropagation()}
                            @keydown=${(e: KeyboardEvent) => {
                              if (e.key === "Enter") { renameConversation(conv.id, (e.target as HTMLInputElement).value); }
                              if (e.key === "Escape") { state.renamingConversation = null; renderApp(); }
                            }}
                            @blur=${(e: Event) => { renameConversation(conv.id, (e.target as HTMLInputElement).value); }}
                          />
                        ` : html`
                          <div class="conv-item__title">${hasUnread ? html`<span class="conv-unread-dot"></span>` : ""}${conv.title}</div>
                          <div class="conv-item__meta">${isReplying ? html`<span class="conv-replying">回复中...</span>` : ""}${timeStr} · ${conv.messageCount} 条消息</div>
                        `}
                      </div>
                      ${isConfirmingDelete ? html`
                        <div class="conv-delete-confirm" @click=${(e: Event) => e.stopPropagation()}>
                          <span>删除?</span>
                          <button class="conv-confirm-yes" @click=${() => deleteConversation(conv.id)}>是</button>
                          <button class="conv-confirm-no" @click=${() => { state.confirmingConvDelete = null; renderApp(); }}>否</button>
                        </div>
                      ` : html`
                        <div class="conv-item__actions">
                          <button class="conv-action-btn" @click=${(e: Event) => { e.stopPropagation(); state.renamingConversation = conv.id; renderApp(); requestAnimationFrame(() => { const inp = document.querySelector('.conv-rename-input') as HTMLInputElement; if (inp) { inp.focus(); inp.select(); } }); }} title="重命名">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button class="conv-action-btn conv-action-btn--danger" @click=${(e: Event) => { e.stopPropagation(); state.confirmingConvDelete = conv.id; renderApp(); }} title="删除">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      `}
                    </div>
                  `;
                })}
              </div>
            </div>
          </div>
        ` : ""}
        ${state.sidePanel === "favorites" ? (() => {
          // Collect favorites from ALL conversations
          type FavItem = { msg: AssistantMessage; convId: string; convTitle: string };
          const allFavItems: FavItem[] = [];
          for (const conv of state.conversations) {
            const isCurrentConv = conv.id === state.currentConversationId;
            const favIds = isCurrentConv ? state.favorites : loadFavoritesForConversation(conv.id);
            if (favIds.size === 0) continue;
            const msgs = isCurrentConv ? state.messages : loadMessagesForConversation(conv.id);
            for (const m of msgs) {
              if (m.type === "assistant" && favIds.has(m.id)) {
                allFavItems.push({ msg: m as AssistantMessage, convId: conv.id, convTitle: conv.title });
              }
            }
          }
          const query = state.favSearchQuery.trim().toLowerCase();
          const filtered = query ? allFavItems.filter(f => f.msg.text.toLowerCase().includes(query)) : allFavItems;
          return html`
          <div class="side-panel-view favorites-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 收藏夹 (${filtered.length})</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="fav-search-bar">
              <svg class="fav-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="fav-search-input" type="text" placeholder="搜索收藏..." .value=${state.favSearchQuery} @input=${(e: Event) => { state.favSearchQuery = (e.target as HTMLInputElement).value; renderApp(); }} />
              ${state.favSearchQuery ? html`<button class="fav-search-clear" @click=${() => { state.favSearchQuery = ""; renderApp(); }}>✕</button>` : ""}
            </div>
            <div class="side-panel-body">
              ${filtered.length === 0
                ? html`<div class="favorites-empty">${state.favSearchQuery ? "无匹配结果" : "暂无收藏"}</div>`
                : (() => {
                  // Group by date
                  const groups: Map<string, FavItem[]> = new Map();
                  for (const f of filtered) {
                    const d = new Date(f.msg.timestamp);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    if (!groups.has(key)) groups.set(key, []);
                    groups.get(key)!.push(f);
                  }
                  const sortedGroups = [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
                  return sortedGroups.map(([dateKey, items]) => {
                    const today = new Date();
                    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
                    const label = dateKey === todayKey ? "今天" : dateKey === yesterdayKey ? "昨天" : dateKey;
                    return html`
                      <div class="fav-date-group">
                        <div class="fav-date-header">${label}<span class="fav-date-count">${items.length}</span></div>
                        ${items.map(f => {
                          const isCurrent = f.convId === state.currentConversationId;
                          return html`
                          <div class="favorites-item" @click=${() => {
                            const mid = f.msg.id;
                            const targetConvId = f.convId;
                            state.sidePanel = null;
                            if (targetConvId !== state.currentConversationId) {
                              switchConversation(targetConvId);
                            }
                            renderApp();
                            setTimeout(() => scrollToMessage(mid), 350);
                          }}>
                            <div class="favorites-item__text">${f.msg.text.length > 80 ? f.msg.text.slice(0, 80) + "..." : f.msg.text}</div>
                            <div class="favorites-item__meta">
                              <span>${formatTime(f.msg.timestamp)}</span>
                              ${!isCurrent ? html`<span class="fav-conv-tag">${f.convTitle}</span>` : ""}
                              <button class="favorites-item__remove" @click=${(e: Event) => {
                                e.stopPropagation();
                                if (isCurrent) {
                                  toggleFavorite(f.msg.id);
                                } else {
                                  // Remove from other conversation's favorites
                                  const favs = loadFavoritesForConversation(f.convId);
                                  favs.delete(f.msg.id);
                                  saveFavoritesForConversation(f.convId, favs);
                                  renderApp();
                                }
                              }} title="取消收藏">✕</button>
                            </div>
                          </div>
                        `;})}
                      </div>
                    `;
                  });
                })()}
            </div>
          </div>
        `;})() : ""}
        ${state.sidePanel === "knowledge" ? html`
          <div class="side-panel-view knowledge-view"
            @dragover=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); }}
            @dragenter=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setKnowledgeDragCounter(knowledgeDragCounter + 1); if (!state.knowledgeDragOver) { state.knowledgeDragOver = true; renderApp(); } }}
            @dragleave=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setKnowledgeDragCounter(knowledgeDragCounter - 1); if (knowledgeDragCounter <= 0) { setKnowledgeDragCounter(0); state.knowledgeDragOver = false; renderApp(); } }}
            @drop=${(e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setKnowledgeDragCounter(0); state.knowledgeDragOver = false; renderApp(); handleKnowledgeDrop(e); }}
          >
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 知识库</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              ${!state.authorizedFolder ? html`
                <div class="knowledge-empty">
                  <div style="margin-bottom: 12px; color: #9ca3af;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                  <div style="margin-bottom: 16px; color: #6b7280;">尚未选择知识库文件夹</div>
                  <button class="skill-add-btn" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 选择文件夹</button>
                </div>
              ` : html`
                <div class="knowledge-folder-bar">
                  <span class="knowledge-folder-path" title=${state.authorizedFolder}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;flex-shrink:0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> ${state.authorizedFolder}</span>
                  <button class="knowledge-folder-change" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())} title="更换文件夹">更换</button>
                  <button class="knowledge-folder-change" @click=${() => loadKnowledgeFiles()} title="刷新文件列表">刷新</button>
                </div>
                ${state.knowledgeFiles.length > 0 ? html`
                  <div class="sort-bar">
                    <span class="sort-bar__label">排序:</span>
                    <button class="sort-bar__btn ${state.filesSortBy === "time" ? "active" : ""}" @click=${() => { state.filesSortBy = "time"; renderApp(); }}>按时间</button>
                    <button class="sort-bar__btn ${state.filesSortBy === "name" ? "active" : ""}" @click=${() => { state.filesSortBy = "name"; renderApp(); }}>按名称</button>
                  </div>
                ` : ""}
                ${state.knowledgeDragOver ? html`
                  <div class="knowledge-drop-zone">
                    <div class="knowledge-drop-text"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 松开以添加文件到知识库</div>
                  </div>
                ` : ""}
                ${state.knowledgeLoading ? html`
                  <div class="knowledge-empty">加载中...</div>
                ` : state.knowledgeFiles.length === 0 ? html`
                  <div class="knowledge-empty">文件夹中没有可识别的文件<br><small>支持: txt, pdf, docx, xlsx, csv, json, md 等</small></div>
                ` : sortedFiles().map(f => html`
                  <div class="knowledge-file-item">
                    <span class="knowledge-file-icon">${f.type === "image" ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` : f.type === "doc" ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`}</span>
                    <span class="knowledge-file-name" title=${f.name}>${f.name}</span>
                    <span class="knowledge-file-size">${formatFileSize(f.size)}</span>
                    <button class="knowledge-file-btn ref" @click=${() => addKnowledgeRef(f.name)} title="引用到对话">引用</button>
                    <button class="knowledge-file-btn del" @click=${() => deleteKnowledgeFileAction(f.name)} title="删除文件"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                `)}
              `}
            </div>
          </div>
        ` : ""}
        ${state.sidePanel === "skills" ? html`
          <div class="side-panel-view skills-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> 技能</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <!-- Tab Bar -->
            <div class="skills-tab-bar">
              <button class="skills-tab ${state.skillsTab === "installed" ? "active" : ""}"
                @click=${() => { state.skillsTab = "installed"; renderApp(); }}>已安装</button>
              <button class="skills-tab ${state.skillsTab === "market" ? "active" : ""}"
                @click=${() => { state.skillsTab = "market"; if (state.taxstoreConnected && state.taxstoreSkills.length === 0) fetchSkills(1); renderApp(); }}>市场</button>
            </div>
            <!-- Installed Tab -->
            ${state.skillsTab === "installed" ? html`
            <div class="side-panel-body">
              <div class="skill-section-header" @click=${() => { state.builtinSkillsCollapsed = !state.builtinSkillsCollapsed; renderApp(); }}>
                <span class="skill-section-arrow ${state.builtinSkillsCollapsed ? "collapsed" : ""}">▾</span>
                <span class="skill-section-label">预制技能</span>
                <span class="skill-section-count">${BUILTIN_SKILLS.length}</span>
              </div>
              ${state.builtinSkillsCollapsed ? "" : BUILTIN_SKILLS.map(sk => html`
                <div class="skill-item skill-item--builtin">
                  <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                  <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                    <div class="skill-item__name">${sk.name} <span class="skill-builtin-badge">预制</span></div>
                    ${sk.description ? html`<div class="skill-item__desc">${sk.description}</div>` : ""}
                  </div>
                </div>
              `)}
              <div class="skill-section-label" style="margin-top: 12px; padding-left: 12px;">自定义技能</div>
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${() => openSkillEditor()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建 Skill</button>
                <button class="skill-add-btn" @click=${() => handleInstallSkillPackage()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> 上传技能包</button>
              </div>
              ${state.customSkills.length > 1 ? html`
                <div class="sort-bar">
                  <span class="sort-bar__label">排序:</span>
                  <button class="sort-bar__btn ${state.skillsSortBy === "time" ? "active" : ""}" @click=${() => { state.skillsSortBy = "time"; renderApp(); }}>按时间</button>
                  <button class="sort-bar__btn ${state.skillsSortBy === "name" ? "active" : ""}" @click=${() => { state.skillsSortBy = "name"; renderApp(); }}>按名称</button>
                </div>
              ` : ""}
              ${state.customSkills.length === 0
                ? html`<div class="knowledge-empty" style="padding: 12px;">暂无自定义技能</div>`
                : sortedSkills().map(sk => html`
                  <div class="skill-item skill-item--custom">
                    <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                    <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                      <div class="skill-item__name">${sk.name}</div>
                      ${sk.description ? html`<div class="skill-item__desc">${sk.description}</div>` : ""}
                    </div>
                    <div class="skill-item__actions">
                      <button class="skill-item__btn ${sk.pinned ? "pinned" : ""}" @click=${() => toggleSkillPin(sk.id)} title="${sk.pinned ? "取消快捷" : "添加到快捷"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg></button>
                      <button class="skill-item__btn" @click=${() => exportSkillAsZip(sk)} title="导出"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                      <button class="skill-item__btn" @click=${() => openSkillEditor(sk)} title="编辑"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button class="skill-item__btn" @click=${() => deleteCustomSkill(sk.id)} title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </div>
                `)
              }
            </div>
            ` : ""}
            <!-- Market Tab -->
            ${state.skillsTab === "market" ? html`
            ${!state.taxstoreConnected ? html`
              <div class="ts-login">
                <div class="ts-login-title">连接 TaxStore</div>
                <div class="ts-login-desc">登录 taxbot.cc 账户，浏览和安装技能</div>
                <input type="email" placeholder="邮箱" .value=${state.taxstoreLoginEmail}
                  @input=${(e: Event) => { state.taxstoreLoginEmail = (e.target as HTMLInputElement).value; }} />
                <input type="password" placeholder="密码" .value=${state.taxstoreLoginPassword}
                  @input=${(e: Event) => { state.taxstoreLoginPassword = (e.target as HTMLInputElement).value; }}
                  @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") loginTaxStore(state.taxstoreLoginEmail, state.taxstoreLoginPassword); }} />
                ${state.taxstoreError ? html`<div class="ts-login-error">${state.taxstoreError}</div>` : ""}
                <button class="ts-login-btn" ?disabled=${state.taxstoreLoading}
                  @click=${() => loginTaxStore(state.taxstoreLoginEmail, state.taxstoreLoginPassword)}>
                  ${state.taxstoreLoading ? "连接中..." : "登录"}
                </button>
                <div class="ts-login-desc" style="margin-top:4px;">
                  没有账户？访问 <a href="https://taxbot.cc:8443/taxbot" target="_blank" style="color:#2E5484;">taxbot.cc</a> 注册
                </div>
              </div>
            ` : html`
              <div class="ts-user-bar">
                <span class="ts-user-name">${state.taxstoreUser?.name || state.taxstoreUser?.email}</span>
                <span class="ts-points-badge">${state.taxstoreUser?.points ?? 0} 积分</span>
                <button class="ts-logout-btn" @click=${logoutTaxStore} title="断开连接">退出</button>
              </div>
              ${state.taxstoreUpdates.length > 0 ? html`
                <div class="ts-update-banner">
                  <span class="ts-update-banner-icon">🔄</span>
                  <span class="ts-update-banner-text">${state.taxstoreUpdates.length} 个技能有更新可用</span>
                </div>
              ` : ""}
              <div class="ts-filter-bar">
                <input class="ts-search-input" type="text" placeholder="搜索技能..."
                  .value=${state.taxstoreQuery}
                  @input=${(e: Event) => { state.taxstoreQuery = (e.target as HTMLInputElement).value; }}
                  @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") searchSkills(state.taxstoreQuery); }} />
                <button class="ts-sort-btn ${state.taxstoreSort === "latest" ? "active" : ""}"
                  @click=${() => changeSortOrder("latest")}>最新</button>
                <button class="ts-sort-btn ${state.taxstoreSort === "popular" ? "active" : ""}"
                  @click=${() => changeSortOrder("popular")}>热门</button>
              </div>
              <div class="ts-category-bar">
                <button class="ts-cat-tag ${state.taxstoreCategory === "" ? "active" : ""}"
                  @click=${() => filterByCategory("")}>全部</button>
                <button class="ts-cat-tag ${state.taxstoreCategory === "tax-tools" ? "active" : ""}"
                  @click=${() => filterByCategory("tax-tools")}>税务工具</button>
                <button class="ts-cat-tag ${state.taxstoreCategory === "forms" ? "active" : ""}"
                  @click=${() => filterByCategory("forms")}>报表</button>
                <button class="ts-cat-tag ${state.taxstoreCategory === "reporting" ? "active" : ""}"
                  @click=${() => filterByCategory("reporting")}>报告</button>
                <button class="ts-cat-tag ${state.taxstoreCategory === "automation" ? "active" : ""}"
                  @click=${() => filterByCategory("automation")}>自动化</button>
              </div>
              ${state.taxstoreError ? html`<div class="ts-error">${state.taxstoreError}</div>` : ""}
              ${state.taxstoreLoading ? html`<div class="ts-loading">加载中...</div>` : html`
                <div class="ts-skills-list">
                  ${state.taxstoreSkills.length === 0
                    ? html`<div class="ts-empty">${state.taxstoreQuery ? "未找到匹配技能" : "暂无技能"}</div>`
                    : state.taxstoreSkills.map(sk => {
                      const installed = isInstalledLocally(sk.id);
                      return html`
                        <div class="ts-skill-card">
                          <div class="ts-skill-header">
                            <span class="ts-skill-name">${sk.name}</span>
                            <span class="ts-skill-version">v${sk.version}</span>
                          </div>
                          ${sk.description ? html`<div class="ts-skill-desc">${sk.description}</div>` : ""}
                          <div class="ts-skill-meta">
                            <span class="ts-skill-rating">${sk.reviews?.length ? html`★ ${avgRating(sk.reviews)}` : ""}</span>
                            <span>${sk.downloads} 下载</span>
                            <span class="ts-skill-cost ${sk.pointsCost === 0 ? "free" : "paid"}">${sk.pointsCost === 0 ? "免费" : `${sk.pointsCost} 积分`}</span>
                            <span>${sk.author?.name || ""}</span>
                            ${state.taxstoreInstallingId === sk.id
                              ? html`<span class="ts-install-progress">${state.taxstoreInstallStep === "downloading" ? "下载中..." : "安装中..."}</span>`
                              : html`<button class="ts-install-btn ${installed ? "installed" : ""}"
                                  @click=${() => { if (!installed) installFromTaxStore(sk); }}
                                  ?disabled=${installed || !!state.taxstoreInstallingId}>
                                  ${installed ? "已安装" : "安装"}
                                </button>`
                            }
                          </div>
                        </div>
                      `;
                    })
                  }
                </div>
                ${state.taxstoreTotalPages > 1 ? html`
                  <div class="ts-pagination">
                    <button class="ts-page-btn" ?disabled=${state.taxstorePage <= 1}
                      @click=${() => fetchSkills(state.taxstorePage - 1)}>上一页</button>
                    <span>${state.taxstorePage} / ${state.taxstoreTotalPages}</span>
                    <button class="ts-page-btn" ?disabled=${state.taxstorePage >= state.taxstoreTotalPages}
                      @click=${() => fetchSkills(state.taxstorePage + 1)}>下一页</button>
                  </div>
                ` : ""}
              `}
            `}
            ` : ""}
          </div>
        ` : ""}
        ${state.sidePanel === "agents" ? html`
          <div class="side-panel-view agents-view">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 我的智能体</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="side-panel-body">
              <!-- Tab bar -->
              <div class="rental-tab-bar">
                <button class="rental-tab ${state.rentalActiveTab === "agents" ? "rental-tab--active" : ""}"
                  @click=${() => { state.rentalActiveTab = "agents"; renderApp(); }}>
                  🤖 智能体列表
                </button>
                <button class="rental-tab ${state.rentalActiveTab === "tasks" ? "rental-tab--active" : ""}"
                  @click=${() => { state.rentalActiveTab = "tasks"; renderApp(); }}>
                  📋 任务
                  ${state.rentalPendingTasks.length > 0 ? html`<span class="rental-tab-badge">${state.rentalPendingTasks.length}</span>` : ""}
                </button>
              </div>

              ${state.rentalActiveTab === "agents" ? html`
              <!-- 智能体列表 tab -->
              <div class="skill-add-row">
                <button class="skill-add-btn" @click=${() => { state.editingAgentId = null; state.agentCreateDraft = { name: "", emoji: "🤖", description: "", identityDesc: "", expertise: "", avatarDataUrl: "", selectedSkills: [] }; state.creatingAgent = !state.creatingAgent; renderApp(); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建智能体
                </button>
              </div>
              ${state.agentsLoading ? html`<div class="knowledge-empty">加载中...</div>` : ""}
              ${!state.agentsLoading && state.agentsList.length === 0 ? html`<div class="knowledge-empty">暂无智能体</div>` : ""}
              ${state.agentsList.map(agent => {
                const listing = getListingForAgent(agent.id);
                const completedTasks = listing ? getCompletedTasksForListing(listing.id) : [];
                const totalEarned = completedTasks.reduce((sum, t) => sum + t.price, 0);
                return html`
                <div class="skill-item agent-card-uniform" @click=${() => { insertAgentMention(agent); }} style="cursor:pointer" title="点击@${agent.name}">
                  <div class="skill-item__emoji">${agent.avatarUrl ? html`<img src="${agent.avatarUrl}" class="agent-avatar-img" />` : agent.emoji}</div>
                  <div class="skill-item__body">
                    <div class="skill-item__name">${agent.name} ${agent.isDefault ? html`<span class="skill-builtin-badge">默认</span>` : ""}</div>
                    <div class="skill-item__desc">${agent.description || "\u00A0"}</div>
                    <div class="agent-card-rental-line">${listing ? html`<span class="agent-rental-badge agent-rental-badge--active">🏪 ${listing.price}积分/次</span>${completedTasks.length > 0 ? html`<span class="agent-card-stats">✅${completedTasks.length}${listing.avgRating > 0 ? html` ⭐${listing.avgRating.toFixed(1)}` : ""} 💰${totalEarned}</span>` : ""}` : "\u00A0"}</div>
                  </div>
                  <div class="skill-item__actions">
                    ${!agent.isDefault ? html`
                      ${state.confirmingAgentDelete === agent.id ? html`
                        <span class="agent-delete-confirm">
                          确定删除？
                          <button class="agent-action-btn agent-action-btn--danger" @click=${(e: Event) => { e.stopPropagation(); deleteAgent(agent.id); }}>是</button>
                          <button class="agent-action-btn" @click=${(e: Event) => { e.stopPropagation(); state.confirmingAgentDelete = null; renderApp(); }}>否</button>
                        </span>
                      ` : html`
                        ${listing
                          ? html`<button class="agent-action-btn" @click=${(e: Event) => { e.stopPropagation(); unpublishAgent(listing.id); }}>下架</button>`
                          : state.taxstoreConnected
                            ? html`<button class="agent-rental-badge agent-rental-badge--btn" @click=${(e: Event) => { e.stopPropagation(); openPublishDialog(agent); }}>🏪 出租赚积分</button>`
                            : ""
                        }
                        <button class="agent-action-btn" @click=${(e: Event) => { e.stopPropagation(); openAgentEditor(agent); }}>编辑</button>
                        <button class="agent-action-btn agent-action-btn--danger" @click=${(e: Event) => { e.stopPropagation(); state.confirmingAgentDelete = agent.id; renderApp(); }}>删除</button>
                      `}
                    ` : html`
                      ${listing
                        ? html`<button class="agent-action-btn" @click=${(e: Event) => { e.stopPropagation(); unpublishAgent(listing.id); }}>下架</button>`
                        : state.taxstoreConnected
                          ? html`<button class="agent-rental-badge agent-rental-badge--btn" @click=${(e: Event) => { e.stopPropagation(); openPublishDialog(agent); }}>🏪 出租赚积分</button>`
                          : ""
                      }
                    `}
                  </div>
                </div>
              `; })}
              ` : html`
              <!-- 任务 tab -->
              <!-- 待处理任务 -->
              ${state.rentalPendingTasks.length > 0 ? html`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    📋 待处理任务 <span class="rental-tasks-count">${state.rentalPendingTasks.length}</span>
                  </div>
                  ${state.rentalPendingTasks.map(task => html`
                    <div class="rental-task-card" @click=${() => openTaskPanel(task)}>
                      <div class="rental-task-card-emoji">${task.listing.emoji}</div>
                      <div class="rental-task-card-body">
                        <div class="rental-task-card-name">${task.title}${(task.unreadMessageCount || 0) > 0 ? html`<span class="rental-task-msg-dot">💬</span>` : ""}</div>
                        <div class="rental-task-card-desc">${task.listing.name} · ${task.client.name}</div>
                      </div>
                      <div class="rental-task-card-price">${task.price} 积分</div>
                    </div>
                  `)}
                </div>
              ` : html`
                <div class="rental-tasks-empty">暂无待处理任务</div>
              `}

              <!-- 已完成任务记录 -->
              ${state.rentalCompletedTasks.length > 0 ? html`
                <div class="rental-tasks-section">
                  <div class="rental-tasks-header">
                    ✅ 已完成任务 <span class="rental-completed-count">${state.rentalCompletedTasks.length}</span>
                  </div>
                  ${state.rentalCompletedTasks.map(task => html`
                    <div class="rental-task-card rental-task-card--completed" @click=${() => { state.rentalTaskDetailView = task; scheduleRender(); }}>
                      <div class="rental-task-card-emoji">${task.listing.emoji}</div>
                      <div class="rental-task-card-body">
                        <div class="rental-task-card-name">${task.title}</div>
                        <div class="rental-task-card-desc">
                          ${task.listing.name} · ${task.client.name}
                          · ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ""}
                        </div>
                        ${task.rating ? html`
                          <div class="rental-task-card-rating">
                            ${"⭐".repeat(task.rating)}
                            ${task.ratingComment ? html`<span class="rental-task-card-comment">${task.ratingComment}</span>` : ""}
                          </div>
                        ` : ""}
                      </div>
                      <div class="rental-task-card-price rental-task-card-price--earned">+${task.price} 积分</div>
                    </div>
                  `)}
                </div>
              ` : ""}

              ${state.rentalPendingTasks.length === 0 && state.rentalCompletedTasks.length === 0 ? html`
                <div class="rental-tasks-empty">暂无任务记录</div>
              ` : ""}
              `}

              <!-- 推荐模板 (仅在智能体列表 tab 显示) -->
              ${state.rentalActiveTab === "agents" && AGENT_TEMPLATES.some(tpl => !state.agentsList.some(a => a.name === tpl.name)) ? html`
                <div class="agent-templates-section">
                  <div class="agent-templates-header">推荐模板</div>
                  ${AGENT_TEMPLATES.map(tpl => {
                    const exists = state.agentsList.some(a => a.name === tpl.name);
                    return html`
                      <div class="agent-template-item">
                        <span class="agent-template-emoji">${tpl.emoji}</span>
                        <div class="agent-template-body">
                          <div class="agent-template-name">${tpl.name}</div>
                          <div class="agent-template-desc">${tpl.description}</div>
                        </div>
                        ${exists
                          ? html`<span class="agent-template-badge">已创建</span>`
                          : html`<button class="agent-template-btn" @click=${(e: Event) => { e.stopPropagation(); createAgentFromTemplate(tpl); }}>一键创建</button>`
                        }
                      </div>
                    `;
                  })}
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}
        ${state.sidePanel === "settings" ? html`
          <div class="side-panel-view settings-view">
            <div class="side-panel-header">
              <span class="panel-title">${state.settingsView === "model" ? html`
                <button class="settings-back-btn" @click=${() => { state.settingsView = "main"; state.modelError = null; renderApp(); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button> 模型配置
              ` : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> 设置`}</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; state.settingsView = "main"; state.confirmingClear = false; state.modelError = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="side-panel-body settings-fullscreen">
              ${state.settingsView === "model" ? html`
              <!-- Model Config Sub-View -->
              <div class="about-settings">
                ${state.modelLoading ? html`<div class="knowledge-empty">加载中...</div>` : html`
                  ${state.activeModel ? html`
                  <div class="model-current-card">
                    <div class="model-current-title">当前模型</div>
                    <div class="model-current-rows">
                      <div class="model-current-row"><span class="model-current-label">提供商</span><span class="model-current-value">${state.activeModel.provider || "-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">模型</span><span class="model-current-value">${state.activeModel.modelId || "-"}</span></div>
                      <div class="model-current-row"><span class="model-current-label">API 地址</span><span class="model-current-value">${state.activeModel.baseUrl || "-"}</span></div>
                      <div class="model-current-row">
                        <span class="model-current-label">API Key</span>
                        <span class="model-current-value model-current-key">
                          ${state.activeModel.apiKey ? (state.apiKeyVisible ? state.activeModel.apiKey : state.activeModel.apiKey.replace(/./g, "•")) : "-"}
                          ${state.activeModel.apiKey ? html`<button class="settings-key-toggle-sm" type="button" @click=${() => { state.apiKeyVisible = !state.apiKeyVisible; renderApp(); }} title=${state.apiKeyVisible ? "隐藏" : "显示"}>
                            ${state.apiKeyVisible ? html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>` : html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                          </button>` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  ` : ""}
                  <div class="about-setting-group">
                    <div class="about-setting-title">选择模型</div>
                    <div class="settings-form">
                      <div class="settings-field">
                        <label class="settings-label">模型提供商</label>
                        <select class="settings-input" .value=${state.modelConfigDraft.provider} @change=${(e: Event) => { selectProvider((e.target as HTMLSelectElement).value); }}>
                          ${state.modelList.length === 0 && !state.modelConfigDraft.provider ? html`<option value="">-- 无可用提供商 --</option>` : ""}
                          ${getProviderNames().map(p => html`
                            <option value=${p} ?selected=${p === state.modelConfigDraft.provider}>${p}${(() => { const cnt = getModelsForProvider(p).length; return cnt > 0 ? ` (${cnt} 个模型)` : ""; })()}</option>
                          `)}
                        </select>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">模型</label>
                        ${(() => {
                          const models = getModelsForProvider(state.modelConfigDraft.provider);
                          return html`
                            <select class="settings-input" .value=${state.modelConfigDraft.modelId} @change=${(e: Event) => { selectModel((e.target as HTMLSelectElement).value); }}>
                              ${models.length === 0 ? html`<option value="">-- 无可用模型 --</option>` : ""}
                              ${models.map(m => html`
                                <option value=${m.id} ?selected=${m.id === state.modelConfigDraft.modelId}>${m.name || m.id}${m.contextWindow ? ` (${Math.round(m.contextWindow / 1024)}K)` : ""}${m.reasoning ? " · 推理" : ""}</option>
                              `)}
                            </select>
                          `;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div class="about-setting-group">
                    <div class="about-setting-title">提供商配置</div>
                    <div class="settings-form">
                      <div class="settings-field">
                        <label class="settings-label">API 地址</label>
                        <input class="settings-input" type="text" .value=${state.modelConfigDraft.baseUrl} @input=${(e: Event) => { state.modelConfigDraft.baseUrl = (e.target as HTMLInputElement).value; }} placeholder="如: https://api.openai.com/v1" />
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API Key</label>
                        <div class="settings-input-wrap">
                          <input class="settings-input settings-input-key" type=${state.apiKeyVisible ? "text" : "password"} .value=${state.modelConfigDraft.apiKey} @input=${(e: Event) => { state.modelConfigDraft.apiKey = (e.target as HTMLInputElement).value; }} placeholder="sk-..." />
                          <button class="settings-key-toggle" type="button" @click=${() => { state.apiKeyVisible = !state.apiKeyVisible; renderApp(); }} title=${state.apiKeyVisible ? "隐藏" : "显示"}>
                            ${state.apiKeyVisible ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>` : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                          </button>
                        </div>
                      </div>
                      <div class="settings-field">
                        <label class="settings-label">API 协议</label>
                        <select class="settings-input" .value=${state.modelConfigDraft.api} @change=${(e: Event) => { state.modelConfigDraft.api = (e.target as HTMLSelectElement).value; renderApp(); }}>
                          <option value="openai-completions">OpenAI 兼容 (通义千问/DeepSeek等)</option>
                          <option value="openai-responses">OpenAI Responses</option>
                          <option value="anthropic-messages">Anthropic Claude</option>
                          <option value="google-generative-ai">Google Gemini</option>
                          <option value="github-copilot">GitHub Copilot</option>
                          <option value="bedrock-converse-stream">AWS Bedrock</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  ${state.modelError ? html`<div class="settings-error">${state.modelError}</div>` : ""}
                  ${state.confirmingModelSave ? html`
                    <div class="model-confirm-overlay">
                      <div class="model-confirm-dialog">
                        <div class="model-confirm-title">确认更换模型</div>
                        <div class="model-confirm-info">
                          <div class="model-confirm-row"><span class="model-confirm-label">提供商</span><span class="model-confirm-value">${state.modelConfigDraft.provider}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">模型</span><span class="model-confirm-value">${state.modelConfigDraft.modelId}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 地址</span><span class="model-confirm-value">${state.modelConfigDraft.baseUrl}</span></div>
                          <div class="model-confirm-row"><span class="model-confirm-label">API 协议</span><span class="model-confirm-value">${state.modelConfigDraft.api}</span></div>
                        </div>
                        <div class="model-confirm-hint">更换模型后服务将自动重启</div>
                        <div class="model-confirm-actions">
                          <button class="model-confirm-btn cancel" @click=${() => { state.confirmingModelSave = false; renderApp(); }}>取消</button>
                          <button class="model-confirm-btn confirm" @click=${() => { state.confirmingModelSave = false; saveModelConfig(); }} ?disabled=${state.modelSaving}>
                            ${state.modelSaving ? "保存中..." : "确认更换"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ` : html`
                    <button class="settings-save-btn" @click=${() => { state.confirmingModelSave = true; state.modelError = null; renderApp(); }} ?disabled=${state.modelSaving}>
                      保存配置
                    </button>
                  `}
                `}
              </div>
              ` : html`
              <!-- Settings Main View -->
              <div class="about-settings">
                <div class="about-setting-group">
                  <div class="about-setting-title">模型</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${() => { state.settingsView = "model"; loadModelConfig(); renderApp(); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <span>模型配置</span>
                      ${state.modelList.length > 0 ? html`<span class="settings-model-tag">${state.modelConfigDraft.modelId || state.modelList[0]?.name || state.modelList[0]?.id}</span>` : ""}
                    </button>
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">字体大小</div>
                  <div class="font-size-picker">
                    ${(["small", "medium", "large", "xlarge"] as const).map(size => {
                      const label = size === "small" ? "小" : size === "medium" ? "中" : size === "large" ? "大" : "超大";
                      const px = size === "small" ? "12px" : size === "medium" ? "14px" : size === "large" ? "16px" : "19px";
                      return html`
                      <button class="font-size-btn ${state.fontSize === size ? "font-size-btn--active" : ""}"
                        @click=${() => { state.fontSize = size; localStorage.setItem("taxbot_font_size", size); document.documentElement.setAttribute("data-font-size", size); renderApp(); }}>
                        <span class="font-size-btn__label" style="font-size:${px}">${label}</span>
                        <span class="font-size-btn__sample" style="font-size:${px}">Aa</span>
                      </button>`;
                    })}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">知识库</div>
                  <div class="about-setting-row">
                    <button class="about-action-btn" @click=${() => { handleAuthorizeFolder(); }} ?disabled=${state.importingFolder}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>${state.importingFolder ? "导入中..." : "授权访问文件夹"}</span>
                      ${state.authorizedFolder ? html`
                        <span class="settings-folder-info">
                          <span class="settings-folder-path" title=${state.authorizedFolder}>${state.authorizedFolder}</span>
                          <button class="settings-folder-refresh" @click=${(e: Event) => { e.stopPropagation(); handleRefreshFolder(); }} ?disabled=${state.importingFolder} title="重新读取文件夹">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                              <path d="M21 3v5h-5"/>
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                              <path d="M3 21v-5h5"/>
                            </svg>
                          </button>
                        </span>
                      ` : ""}
                    </button>
                    ${state.importResult ? html`<div class="about-folder-status">${state.importResult}</div>` : ""}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">数据管理</div>
                  <div class="about-setting-row">
                    ${state.confirmingClear ? html`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空所有对话记录？</span>
                        <button class="about-confirm-btn confirm" @click=${() => { doClearAll(); }}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${() => { state.confirmingClear = false; renderApp(); }}>取消</button>
                      </div>
                    ` : html`
                      <button class="about-action-btn danger" @click=${() => { state.confirmingClear = true; renderApp(); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        <span>清空对话记录</span>
                      </button>
                    `}
                  </div>
                  <div class="about-setting-row" style="margin-top: 8px;">
                    ${state.confirmingSessionClear ? html`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认清空服务端会话？此操作不可恢复。</span>
                        <button class="about-confirm-btn confirm" @click=${() => { doClearSession(); }}>确认</button>
                        <button class="about-confirm-btn cancel" @click=${() => { state.confirmingSessionClear = false; renderApp(); }}>取消</button>
                      </div>
                    ` : html`
                      <button class="about-action-btn danger" @click=${() => { state.confirmingSessionClear = true; renderApp(); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                        </svg>
                        <span>清空 Session</span>
                      </button>
                    `}
                  </div>
                </div>
                <div class="about-setting-group">
                  <div class="about-setting-title">应用</div>
                  <div class="about-setting-row">
                    ${state.confirmingExit ? html`
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="about-confirm-hint" style="margin: 0;">确认退出？将关闭窗口并关闭 Gateway。</span>
                        <button class="about-confirm-btn confirm" @click=${() => { doExitApp(); }}>确认退出</button>
                        <button class="about-confirm-btn cancel" @click=${() => { state.confirmingExit = false; renderApp(); }}>取消</button>
                      </div>
                    ` : html`
                      <button class="about-action-btn danger" @click=${() => { state.confirmingExit = true; renderApp(); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>退出应用</span>
                      </button>
                    `}
                  </div>
                </div>
              </div>
              `}
            </div>
          </div>
        ` : ""}
        ${state.sidePanel === "about" ? html`
          <div class="side-panel-view about-view">
            <div class="side-panel-header">
              <span class="panel-title">关于</span>
              <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
            </div>
            <div class="side-panel-body about-fullscreen">
              <div class="about-hero">
                <div class="about-logo">
                  <img src="./assets/taxchat-logo.png" alt="Taxbot" />
                </div>
                <div class="about-hero-text">
                  <div class="about-title">Taxbot Evo</div>
                  <div class="about-subtitle">AI 税务助理 · v${TAXBOT_VERSION}</div>
                </div>
              </div>
              <div class="about-desc">通过 Skill 和 Agent 实现财税能力的自进化</div>
              <div class="about-cards">
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
                  <div class="about-card-label">Skill 技能</div>
                  <div class="about-card-desc">安装、创建、分享技能包，持续扩展能力边界</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                  <div class="about-card-label">Agent 智能体</div>
                  <div class="about-card-desc">创建专属智能体，出租到广场自动服务赚积分</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                  <div class="about-card-label">智能对话</div>
                  <div class="about-card-desc">多轮对话、知识库学习、文件分析</div>
                </div>
                <div class="about-card">
                  <div class="about-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
                  <div class="about-card-label">自进化</div>
                  <div class="about-card-desc">技能越装越多、智能体越用越强、记忆持续积累</div>
                </div>
              </div>
              <div class="about-divider"></div>
              <div class="about-guide">
                <div class="about-setting-title">功能使用向导</div>

                <!-- 1. 智能对话 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">1</span> 智能对话</div>
                  <div class="qs-section-desc">在主聊天区直接输入问题，支持多轮对话、文件上传分析。AI 回复支持复制、导出 Word、收藏、存入知识库等操作。可用 @智能体名 指定特定智能体回答。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#34d399;"></span> 对话窗口</div>
                    <div class="guide-illust-body">
                      <div class="guide-chat-row right"><div class="guide-bubble guide-bubble--user">帮我分析这张增值税发票有什么风险？</div></div>
                      <div class="guide-chat-row"><div class="guide-bubble guide-bubble--ai">根据发票信息分析，发现以下 2 个风险点：<br>1. 税率与商品编码不匹配...<br>2. 开票日期晚于合同约定...</div></div>
                      <div class="guide-actions">
                        <span class="guide-action-tag">📋 复制</span>
                        <span class="guide-action-tag">📄 导出Word</span>
                        <span class="guide-action-tag">⭐ 收藏</span>
                        <span class="guide-action-tag">📚 存入知识库</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. 多对话管理 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">2</span> 多对话管理</div>
                  <div class="qs-section-desc">左侧栏"对话"面板可创建多个独立对话，每个对话有独立的消息和上下文。切换对话时 AI 回复不中断，回复完成后自动显示未读标记。对话列表按最后点击顺序排列。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#3b82f6;"></span> 对话列表</div>
                    <div class="guide-illust-body">
                      <div class="guide-conv-item guide-conv-item--active">
                        <span>💬</span>
                        <span class="guide-conv-title">增值税发票风险分析</span>
                        <span class="guide-conv-meta">刚刚</span>
                      </div>
                      <div class="guide-conv-item guide-conv-item--unread">
                        <span class="guide-conv-dot"></span>
                        <span class="guide-conv-title" style="font-weight:600;">企业所得税筹划方案</span>
                        <span class="guide-conv-meta" style="color:#0284c7;">回复中...</span>
                      </div>
                      <div class="guide-conv-item">
                        <span>💬</span>
                        <span class="guide-conv-title">个税年度汇算清缴</span>
                        <span class="guide-conv-meta">昨天</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. Skill 技能 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">3</span> Skill 技能</div>
                  <div class="qs-section-desc">每个 Skill 是一个独立的财税能力单元。内置核心技能可直接使用，还可从 TaxStore 市场安装社区技能，或自己创建并分享。点击左侧栏"我的技能"管理技能。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;"></span> 我的技能</div>
                    <div class="guide-illust-body">
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">🛡️</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">税务风险治理</div><div class="guide-skill-desc">识别纳税风险并生成治理方案</div></div>
                        <span class="guide-skill-badge">内置</span>
                      </div>
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">📋</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">申报表预审</div><div class="guide-skill-desc">审核申报表数据逻辑</div></div>
                        <span class="guide-skill-badge">内置</span>
                      </div>
                      <div class="guide-skill-item">
                        <span class="guide-skill-emoji">🏪</span>
                        <div class="guide-skill-text"><div class="guide-skill-name">更多技能...</div><div class="guide-skill-desc">从 TaxStore 市场安装</div></div>
                        <span class="guide-skill-badge" style="background:#dcfce7;color:#16a34a;">市场</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 4. Agent 智能体 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">4</span> Agent 智能体</div>
                  <div class="qs-section-desc">创建拥有专属身份、记忆和专长的智能体。在对话中用 @智能体名 调用，或发布到广场出租赚取积分。每次完成任务后智能体自动积累经验记忆，越用越强。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span> 智能体生命周期</div>
                    <div class="guide-illust-body">
                      <div class="guide-flow">
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#dbeafe;">✏️</div><div class="guide-flow-label">创建智能体</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#fef3c7;">💬</div><div class="guide-flow-label">对话中使用</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#dcfce7;">🏪</div><div class="guide-flow-label">发布到广场</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#fce7f3;">💰</div><div class="guide-flow-label">自动赚积分</div></div>
                        <span class="guide-flow-arrow">→</span>
                        <div class="guide-flow-step"><div class="guide-flow-icon" style="background:#ede9fe;">🧠</div><div class="guide-flow-label">积累记忆</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 5. 知识库 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">5</span> 知识库</div>
                  <div class="qs-section-desc">授权本地文件夹后，财税文件（PDF、Word、Excel 等）自动学习入库。知识库为对话和技能提供专业上下文，让 AI 回答更精准。还可将重要回复直接存入知识库。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#10b981;"></span> 知识库文件</div>
                    <div class="guide-illust-body">
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📄</span>
                        <span class="guide-file-name">2024年企业所得税汇算清缴.pdf</span>
                        <span class="guide-file-size">2.4 MB</span>
                        <span class="guide-file-status">✓ 已学习</span>
                      </div>
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📊</span>
                        <span class="guide-file-name">增值税申报表模板.xlsx</span>
                        <span class="guide-file-size">856 KB</span>
                        <span class="guide-file-status">✓ 已学习</span>
                      </div>
                      <div class="guide-file-row">
                        <span class="guide-file-icon">📝</span>
                        <span class="guide-file-name">税务风险检查清单.docx</span>
                        <span class="guide-file-size">128 KB</span>
                        <span class="guide-file-status" style="color:#f59e0b;">⟳ 学习中</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 6. AI专家咨询 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">6</span> AI专家咨询</div>
                  <div class="qs-section-desc">在左侧栏"AI专家咨询"中，浏览广场上其他用户发布的专业智能体，付积分提交咨询任务。智能体主人审核后自动处理，完成后可查看结果、留言沟通、申请修订和评分。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#ec4899;"></span> 咨询流程</div>
                    <div class="guide-illust-body">
                      <div class="guide-consult-flow">
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> 浏览广场</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> 提交任务</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg> 主人审核</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> AI处理</div>
                        <span class="guide-consult-arrow">→</span>
                        <div class="guide-consult-step"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 查看结果</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 7. 消息中心 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">7</span> 消息中心</div>
                  <div class="qs-section-desc">右上角 🔔 消息中心实时推送任务通知、留言提醒、技能更新等。点击通知可直接跳转到对应功能页面：出租任务通知 → 任务处理面板，咨询通知 → 咨询详情页。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;"></span> 消息通知</div>
                    <div class="guide-illust-body">
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">📋</span>
                        <div><div class="guide-notif-text">您收到新的咨询任务：增值税进项税额转出问题</div><div class="guide-notif-hint">点击处理任务</div></div>
                        <span class="guide-notif-time">2分钟前</span>
                      </div>
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">✅</span>
                        <div><div class="guide-notif-text">您的咨询"个税专项扣除"已完成，快去查看结果吧</div><div class="guide-notif-hint">点击查看详情</div></div>
                        <span class="guide-notif-time">10分钟前</span>
                      </div>
                      <div class="guide-notif-item">
                        <span class="guide-notif-icon">💬</span>
                        <div><div class="guide-notif-text">智能体给你发了新留言</div><div class="guide-notif-hint">点击查看详情</div></div>
                        <span class="guide-notif-time">1小时前</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 8. 收藏 -->
                <div class="qs-section" style="padding:0 0 20px;">
                  <div class="qs-section-title"><span class="qs-section-num">8</span> 收藏与搜索</div>
                  <div class="qs-section-desc">对话中点击 ⭐ 收藏重要回复。收藏面板汇聚所有对话中的收藏内容，点击可跳转到对应对话。还可使用搜索功能（Ctrl+F）在当前对话中查找消息。</div>
                  <div class="guide-illust">
                    <div class="guide-illust-bar"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span> 收藏夹</div>
                    <div class="guide-illust-body">
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div class="guide-fav-text">增值税进项税额转出的 5 种常见情形及处理方法...</div>
                      </div>
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div style="flex:1;">
                          <div class="guide-fav-text">企业所得税汇算清缴 A105000 表填报要点...</div>
                          <span class="guide-fav-tag">企业所得税筹划方案</span>
                        </div>
                      </div>
                      <div class="guide-fav-item">
                        <span class="guide-fav-star">⭐</span>
                        <div class="guide-fav-text">个税年终奖单独计税 vs 并入综合所得对比分析...</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="qs-tips-grid" style="padding:0 0 20px;">
                  <div class="qs-tip-card" style="background:#f0f9ff;"><b style="color:#1B3A5C;">Skill 自进化</b>从市场安装技能，或自己创建并分享给社区。</div>
                  <div class="qs-tip-card" style="background:#fefce8;"><b style="color:#a16207;">Agent 自进化</b>智能体在完成任务中积累记忆，能力持续成长。</div>
                  <div class="qs-tip-card" style="background:#f0fdf4;"><b style="color:#15803d;">出租赚积分</b>发布智能体到广场，被使用时自动赚取积分收益。</div>
                  <div class="qs-tip-card" style="background:#fdf2f8;"><b style="color:#be185d;">知识库自学习</b>授权文件夹后新文件自动学习，越用越懂你。</div>
                </div>
              </div>
            </div>
          </div>
        ` : ""}
        ${state.sidePanel === "consult" ? html`
          <div class="side-panel-view consult-view" style="display:flex;flex-direction:column;overflow:hidden;">
            <div class="side-panel-header">
              <span class="panel-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${state.consultView === "list" ? "AI专家咨询（专业智能体）" : state.consultView === "detail" ? "智能体详情" : state.consultView === "my-tasks" ? "我的咨询" : "咨询详情"}</span>
              <div style="display:flex;gap:6px;align-items:center;">
                ${state.consultView === "list" ? html`
                  <button class="consult-mytasks-btn" @click=${() => { openConsultMyTasks(); }} title="我的咨询">
                    📋 我的咨询${state.consultUnreadCount > 0 ? html`<span class="consult-unread-badge" style="margin-left:4px;">${state.consultUnreadCount}</span>` : ""}
                  </button>
                ` : ""}
                <button class="side-panel-close" @click=${() => { state.sidePanel = null; renderApp(); }} title="关闭">✕</button>
              </div>
            </div>
            <div style="flex:1;overflow-y:auto;padding:16px;">
              ${state.consultView === "list" ? html`
                <!-- Flow introduction -->
                <div class="consult-flow">
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <div class="consult-flow-label">选择智能体</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
                    <div class="consult-flow-label">发布任务</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/></svg></div>
                    <div class="consult-flow-label">智能体处理</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg></div>
                    <div class="consult-flow-label">主人审核确认</div>
                  </div>
                  <div class="consult-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                  <div class="consult-flow-step">
                    <div class="consult-flow-icon consult-flow-icon--done"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                    <div class="consult-flow-label">获得结果</div>
                  </div>
                </div>
                <div class="consult-info-row">
                  <div class="consult-info-box">
                    <div class="consult-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
                    <div>
                      <div class="consult-info-title">为什么需要智能体主人审核？</div>
                      <div class="consult-info-desc">财税领域专业性强，AI 生成的结果仍需专业人员把关确认，确保每一份交付都准确可靠。</div>
                    </div>
                  </div>
                  <div class="consult-info-box consult-info-box--stats">
                    <div class="consult-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div>
                      <div class="consult-info-title">平均完成时间</div>
                      <div class="consult-info-desc">${state.consultAvgTime || "加载中..."}</div>
                    </div>
                  </div>
                </div>
                <!-- Search bar -->
                <div class="consult-search-bar">
                  <input type="text" placeholder="搜索智能体..." .value=${state.consultSearch}
                    @input=${(e: Event) => { state.consultSearch = (e.target as HTMLInputElement).value; }}
                    @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") loadConsultAgents(); }}
                  />
                  <button @click=${() => loadConsultAgents()}>搜索</button>
                </div>
                ${state.consultLoading ? html`<div class="consult-loading">加载中...</div>` : ""}
                ${!state.consultLoading && state.consultAgents.length === 0 ? html`<div class="consult-empty">暂无在线智能体</div>` : ""}
                <div class="consult-agent-grid">
                  ${state.consultAgents.map(a => html`
                    <div class="consult-agent-card" @click=${() => openConsultDetail(a)}>
                      <div class="consult-agent-card-top">
                        <div class="consult-agent-avatar">
                          ${agentAvatarSrc(a.avatarUrl) ? html`<img src="${agentAvatarSrc(a.avatarUrl)}" alt="" @error=${(e: Event) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.insertAdjacentHTML("beforeend", `<span>${a.emoji || "🤖"}</span>`); }} />` : html`<span>${a.emoji || "🤖"}</span>`}
                        </div>
                        <div class="consult-agent-header">
                          <div class="consult-agent-name">${a.name}</div>
                          <div class="consult-agent-owner">by ${a.owner?.name || "匿名"}</div>
                        </div>
                      </div>
                      <div class="consult-agent-desc">${a.description}</div>
                      <div class="consult-agent-footer">
                        <div class="consult-agent-stats">
                          ${a.avgRating > 0 ? html`<span class="consult-agent-rating">★ ${a.avgRating.toFixed(1)}</span>` : ""}
                          ${a.completedTasks > 0 ? html`<span class="consult-agent-tasks">${a.completedTasks} 完成</span>` : ""}
                        </div>
                        <div class="consult-agent-price">💰 ${a.price} 积分</div>
                      </div>
                    </div>
                  `)}
                </div>
              ` : state.consultView === "detail" && state.consultSelectedAgent ? html`
                <!-- Agent detail + task form -->
                <button class="consult-back-btn" @click=${() => backToConsultList()}>← 返回列表</button>
                <div class="consult-detail-header">
                  <div class="consult-detail-avatar">
                    ${agentAvatarSrc(state.consultSelectedAgent.avatarUrl) ? html`<img src="${agentAvatarSrc(state.consultSelectedAgent.avatarUrl)}" alt="" @error=${(e: Event) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.insertAdjacentHTML("beforeend", `<span>${state.consultSelectedAgent!.emoji || "🤖"}</span>`); }} />` : html`<span>${state.consultSelectedAgent.emoji || "🤖"}</span>`}
                  </div>
                  <div>
                    <div class="consult-detail-name">${state.consultSelectedAgent.name}</div>
                    <div class="consult-detail-owner">by ${state.consultSelectedAgent.owner.name}</div>
                  </div>
                </div>
                <div class="consult-detail-desc">${state.consultSelectedAgent.description}</div>
                <div class="consult-detail-stats">
                  <span>💰 ${state.consultSelectedAgent.price} 积分/次</span>
                  ${state.consultSelectedAgent.avgRating > 0 ? html`<span>⭐ ${state.consultSelectedAgent.avgRating.toFixed(1)}</span>` : ""}
                  <span>✅ 已完成 ${state.consultSelectedAgent.completedTasks} 单</span>
                </div>
                ${!state.taxstoreToken ? html`
                  <div class="consult-login-hint">请先在设置中登录 TaxStore 账户后再提交任务</div>
                ` : html`
                  <div class="consult-form">
                    <h4>提交咨询任务</h4>
                    <div class="consult-field">
                      <label>任务标题</label>
                      <input type="text" placeholder="请简要描述您的需求" .value=${state.consultTaskTitle}
                        @input=${(e: Event) => { state.consultTaskTitle = (e.target as HTMLInputElement).value; scheduleRender(); }} />
                    </div>
                    <div class="consult-field">
                      <label>详细描述</label>
                      <textarea placeholder="请详细描述您的需求，越详细越好..." .value=${state.consultTaskContent}
                        @input=${(e: Event) => { state.consultTaskContent = (e.target as HTMLTextAreaElement).value; scheduleRender(); }}></textarea>
                    </div>
                    <div class="consult-field">
                      <label>附件（可选）</label>
                      <div class="consult-attachments">
                        ${state.consultAttachments.map((att, i) => html`
                          <div class="consult-att-item">
                            <span class="consult-att-icon">${att.type?.startsWith("image/") ? "🖼️" : "📎"}</span>
                            <span class="consult-att-name" title=${att.name}>${att.name}</span>
                            <span class="consult-att-size">${fmtSize(att.size)}</span>
                            <button class="consult-att-remove" @click=${() => removeConsultAttachment(i)} title="移除">✕</button>
                          </div>
                        `)}
                        ${state.consultUploading ? html`<div class="consult-att-uploading">⏳ 上传中...</div>` : ""}
                        <label class="consult-att-add-btn">
                          📎 添加附件
                          <input type="file" style="display:none" @change=${(e: Event) => {
                            const f = (e.target as HTMLInputElement).files?.[0];
                            if (f) uploadConsultAttachment(f);
                            (e.target as HTMLInputElement).value = "";
                          }} />
                        </label>
                      </div>
                    </div>
                    <div class="consult-form-footer">
                      <span class="consult-form-price">需支付 ${state.consultSelectedAgent.price} 积分</span>
                      <button class="consult-submit-btn" @click=${() => submitConsultTask()} ?disabled=${state.consultSubmitting || !state.consultTaskTitle.trim() || !state.consultTaskContent.trim()}>
                        ${state.consultSubmitting ? "提交中..." : "提交任务"}
                      </button>
                    </div>
                  </div>
                `}
              ` : state.consultView === "my-tasks" ? html`
                <!-- My tasks list -->
                <button class="consult-back-btn" @click=${() => { state.consultView = "list"; scheduleRender(); }}>← 返回广场</button>
                ${state.consultMyTasks.length === 0 ? html`<div class="consult-empty">暂无咨询记录</div>` : ""}
                <div class="consult-tasks-list">
                  ${state.consultMyTasks.map(t => html`
                    <div class="consult-task-item consult-task-item--${t.status}" @click=${() => openConsultTaskDetail(t)}>
                      <div class="consult-task-item-icon">
                        ${agentAvatarSrc(t.listing?.avatarUrl) ? html`<img src="${agentAvatarSrc(t.listing?.avatarUrl)}" alt="" @error=${(e: Event) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.insertAdjacentHTML("beforeend", `<span>${t.listing?.emoji || "🤖"}</span>`); }} />` : html`<span>${t.listing?.emoji || "🤖"}</span>`}
                      </div>
                      <div class="consult-task-item-body">
                        <div class="consult-task-item-title">${t.title}</div>
                        <div class="consult-task-item-meta">
                          ${t.listing?.name || "智能体"} · ${t.status === "pending" ? "等待处理" : t.status === "processing" ? "处理中" : t.status === "completed" ? "已完成" : t.status === "revision_requested" ? "修订中" : t.status}
                          · ${new Date(t.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </div>
                      <div class="consult-task-item-right">
                        ${(t.unreadMessageCount || 0) > 0 ? html`<span class="consult-task-msg-badge">💬 ${t.unreadMessageCount}</span>` : ""}
                        <div class="consult-task-item-price">💰 ${t.price}</div>
                        ${t.status === "completed" ? html`<div class="consult-task-item-status consult-task-item-status--done">已完成</div>` : t.status === "pending" ? html`<div class="consult-task-item-status consult-task-item-status--pending">等待中</div>` : html`<div class="consult-task-item-status consult-task-item-status--processing">处理中</div>`}
                      </div>
                    </div>
                  `)}
                </div>
              ` : state.consultView === "task-detail" && state.consultSelectedTask ? html`
                <!-- Task detail -->
                <button class="consult-back-btn" @click=${() => backFromConsultTaskDetail()}>← 返回列表</button>
                <div class="consult-task-detail">
                  <div class="consult-task-detail-header">
                    <span class="consult-task-detail-emoji">${agentAvatarSrc(state.consultSelectedTask.listing?.avatarUrl) ? html`<img src="${agentAvatarSrc(state.consultSelectedTask.listing?.avatarUrl)}" alt="" style="width:32px;height:32px;border-radius:8px;object-fit:cover;" @error=${(e: Event) => { (e.target as HTMLImageElement).replaceWith(document.createTextNode(state.consultSelectedTask!.listing?.emoji || "🤖")); }} />` : (state.consultSelectedTask.listing?.emoji || "🤖")}</span>
                    <div>
                      <div class="consult-task-detail-title">${state.consultSelectedTask.title}</div>
                      <div class="consult-task-detail-meta">
                        ${state.consultSelectedTask.listing?.name || "智能体"} · 提交于 ${new Date(state.consultSelectedTask.createdAt).toLocaleString("zh-CN")}
                        ${state.consultSelectedTask.completedAt ? html` · 完成于 ${new Date(state.consultSelectedTask.completedAt).toLocaleString("zh-CN")}` : ""}
                      </div>
                    </div>
                  </div>
                  <div class="consult-task-detail-section">
                    <div class="consult-task-detail-label">我的描述</div>
                    <div class="consult-task-detail-content">${state.consultSelectedTask.content}</div>
                  </div>
                  ${parseAtts(state.consultSelectedTask.attachments).length > 0 ? html`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">我的附件</div>
                      <div class="consult-att-list">
                        ${parseAtts(state.consultSelectedTask.attachments).map(att => html`
                          <a class="consult-att-link" href=${attUrl(att.url)} target="_blank">
                            ${att.type?.startsWith("image/") ? html`<img class="consult-att-thumb" src=${attUrl(att.url)} alt=${att.name} />` : html`<span class="consult-att-file-icon">📎</span>`}
                            <span class="consult-att-link-name">${att.name}</span>
                            <span class="consult-att-link-size">${fmtSize(att.size)}</span>
                          </a>
                        `)}
                      </div>
                    </div>
                  ` : ""}
                  ${state.consultSelectedTask.result ? html`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-label">处理结果</div>
                      <div class="consult-task-detail-result">${state.consultSelectedTask.result}</div>
                    </div>
                    ${parseAtts(state.consultSelectedTask.resultAttachments).length > 0 ? html`
                      <div class="consult-task-detail-section">
                        <div class="consult-task-detail-label">结果附件</div>
                        <div class="consult-att-list">
                          ${parseAtts(state.consultSelectedTask.resultAttachments).map(att => html`
                            <a class="consult-att-link" href=${attUrl(att.url)} target="_blank">
                              ${att.type?.startsWith("image/") ? html`<img class="consult-att-thumb" src=${attUrl(att.url)} alt=${att.name} />` : html`<span class="consult-att-file-icon">📎</span>`}
                              <span class="consult-att-link-name">${att.name}</span>
                              <span class="consult-att-link-size">${fmtSize(att.size)}</span>
                            </a>
                          `)}
                        </div>
                      </div>
                    ` : ""}
                  ` : html`
                    <div class="consult-task-detail-section">
                      <div class="consult-task-detail-waiting">
                        ${state.consultSelectedTask.status === "pending" ? "⏳ 等待智能体主人接单处理..." : state.consultSelectedTask.status === "processing" ? "🔄 智能体正在处理中..." : state.consultSelectedTask.status === "revision_requested" ? "📝 已请求修订，等待处理..." : "等待处理..."}
                      </div>
                    </div>
                  `}

                  <!-- Action buttons row -->
                  <div class="consult-td-actions">
                    <button class="consult-td-action-btn" @click=${() => toggleConsultMessages()}>
                      💬 留言沟通${(state.consultSelectedTask.unreadMessageCount || 0) > 0 ? html`<span class="consult-unread-badge" style="margin-left:4px;">${state.consultSelectedTask.unreadMessageCount}</span>` : ""}
                    </button>
                    ${state.consultSelectedTask.status === "completed" && !state.consultSelectedTask.rating && (state.consultSelectedTask.revisionCount || 0) < 3 ? html`
                      <button class="consult-td-action-btn consult-td-action-btn--revision" @click=${() => toggleConsultRevision()}>
                        🔄 请求修订${state.consultSelectedTask.revisionCount ? html` (${state.consultSelectedTask.revisionCount}/3)` : ""}
                      </button>
                    ` : ""}
                    ${state.consultSelectedTask.status === "completed" && !state.consultSelectedTask.rating ? html`
                      <button class="consult-td-action-btn consult-td-action-btn--rating" @click=${() => toggleConsultRating()}>
                        ⭐ 给个评价
                      </button>
                    ` : ""}
                  </div>

                  <!-- Rating display (if already rated) -->
                  ${state.consultSelectedTask.rating ? html`
                    <div class="consult-td-rated">
                      <div class="consult-td-rated-stars">${"★".repeat(state.consultSelectedTask.rating)}${"☆".repeat(5 - state.consultSelectedTask.rating)}</div>
                      ${state.consultSelectedTask.ratingComment ? html`<div class="consult-td-rated-comment">${state.consultSelectedTask.ratingComment}</div>` : ""}
                    </div>
                  ` : ""}

                  <!-- Rating panel -->
                  ${state.consultRatingOpen ? html`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">评价服务</div>
                      <div class="consult-td-stars">
                        ${[1,2,3,4,5].map(v => html`
                          <span class="consult-td-star ${v <= (state.consultRatingHover || state.consultRatingValue) ? "consult-td-star--active" : ""}"
                            @click=${() => { state.consultRatingValue = v; scheduleRender(); }}
                            @mouseenter=${() => { state.consultRatingHover = v; scheduleRender(); }}
                            @mouseleave=${() => { state.consultRatingHover = 0; scheduleRender(); }}>★</span>
                        `)}
                        <span class="consult-td-star-label">${state.consultRatingValue === 1 ? "很差" : state.consultRatingValue === 2 ? "较差" : state.consultRatingValue === 3 ? "一般" : state.consultRatingValue === 4 ? "满意" : state.consultRatingValue === 5 ? "非常满意" : ""}</span>
                      </div>
                      <textarea class="consult-td-input" placeholder="写点评价吧（可选）" rows="2"
                        .value=${state.consultRatingComment}
                        @input=${(e: Event) => { state.consultRatingComment = (e.target as HTMLTextAreaElement).value; scheduleRender(); }}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${() => toggleConsultRating()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${() => submitConsultRating()} ?disabled=${state.consultRatingSubmitting || state.consultRatingValue < 1}>
                          ${state.consultRatingSubmitting ? "提交中..." : "提交评价"}
                        </button>
                      </div>
                    </div>
                  ` : ""}

                  <!-- Revision panel -->
                  ${state.consultRevisionOpen ? html`
                    <div class="consult-td-panel">
                      <div class="consult-td-panel-title">请求修订</div>
                      <div class="consult-td-panel-hint">请描述需要修改的内容，智能体主人会重新处理（最多 3 次修订）</div>
                      <textarea class="consult-td-input" placeholder="请说明需要修改的地方..." rows="3"
                        .value=${state.consultRevisionText}
                        @input=${(e: Event) => { state.consultRevisionText = (e.target as HTMLTextAreaElement).value; scheduleRender(); }}></textarea>
                      <div class="consult-td-panel-actions">
                        <button class="consult-td-btn-cancel" @click=${() => toggleConsultRevision()}>取消</button>
                        <button class="consult-td-btn-submit" @click=${() => submitConsultRevision()} ?disabled=${state.consultRevisionSubmitting || !state.consultRevisionText.trim()}>
                          ${state.consultRevisionSubmitting ? "提交中..." : "发送修订请求"}
                        </button>
                      </div>
                    </div>
                  ` : ""}

                  <!-- Messages panel -->
                  ${state.consultMessagesOpen ? html`
                    <div class="consult-td-messages">
                      <div class="consult-td-panel-title">留言沟通</div>
                      <div class="consult-td-msg-list">
                        ${state.consultMessages.length === 0 ? html`<div class="consult-td-msg-empty">${state.consultSelectedTask.status === "completed" ? "暂无留言记录" : "暂无留言，发一条吧"}</div>` : ""}
                        ${state.consultMessages.map(msg => html`
                          <div class="consult-td-msg ${msg.sender.id === state.taxstoreUser?.id ? "consult-td-msg--mine" : "consult-td-msg--theirs"}">
                            <div class="consult-td-msg-sender">${msg.sender.name}</div>
                            <div class="consult-td-msg-bubble">${msg.content}</div>
                            <div class="consult-td-msg-time">${new Date(msg.createdAt).toLocaleString("zh-CN")}</div>
                          </div>
                        `)}
                      </div>
                      ${state.consultSelectedTask.status !== "completed" ? html`
                        <div class="consult-td-msg-input-row">
                          <input type="text" class="consult-td-msg-input" placeholder="输入留言..."
                            .value=${state.consultMessageInput}
                            @input=${(e: Event) => { state.consultMessageInput = (e.target as HTMLInputElement).value; scheduleRender(); }}
                            @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendConsultMessage(); } }} />
                          <button class="consult-td-msg-send" @click=${() => sendConsultMessage()} ?disabled=${state.consultMessagesSending || !state.consultMessageInput.trim()}>
                            ${state.consultMessagesSending ? "..." : "发送"}
                          </button>
                        </div>
                      ` : html`<div class="consult-td-msg-closed">任务已完成，留言已关闭</div>`}
                    </div>
                  ` : ""}

                  <div class="consult-task-detail-footer">
                    <span>💰 ${state.consultSelectedTask.price} 积分</span>
                    <span class="consult-task-detail-status consult-task-detail-status--${state.consultSelectedTask.status}">
                      ${state.consultSelectedTask.status === "completed" ? "✅ 已完成" : state.consultSelectedTask.status === "pending" ? "⏳ 等待中" : state.consultSelectedTask.status === "revision_requested" ? "📝 修订中" : "🔄 处理中"}
                    </span>
                  </div>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}
        </div><!-- /side-panel -->

        <div class="taxchat-main">
          ${state.searchOpen ? html`
            <div class="search-bar">
              <input
                id="taxchat-search-input"
                type="text"
                placeholder="搜索消息..."
                .value=${state.searchQuery}
                @input=${(e: Event) => performSearch((e.target as HTMLInputElement).value)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Escape") closeSearch();
                  else if (e.key === "Enter") { e.shiftKey ? prevResult() : nextResult(); }
                }}
              />
              <span class="search-count">
                ${state.searchResults.length > 0
                  ? `${state.searchIndex + 1}/${state.searchResults.length}`
                  : state.searchQuery ? "无结果" : ""}
              </span>
              <button class="search-nav-btn" @click=${prevResult} title="上一个">▲</button>
              <button class="search-nav-btn" @click=${nextResult} title="下一个">▼</button>
              <button class="search-close-btn" @click=${closeSearch} title="关闭">✕</button>
            </div>
          ` : ""}
          <div class="taxchat-messages" id="messages-container">
            ${renderMessages()}
          </div>

      <div class="taxchat-input-area">
        <div class="taxchat-quick-actions">
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => handleQuickSkill("tax-risk", "请按照税务风险治理流程，分析我上传的文件内容，识别税务风险点，给出风险分析、说明函、应对话术和操作建议。请直接分析文件内容，不要调用任何工具或命令。", "税务风险治理")}
            title="上传税务风险文件，自动分析并生成说明函"
          >
            <span class="qa-icon">🧾</span>
            <span>税务风险治理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => handleQuickSkill("tax-review", "请按照纳税申报表预审流程，分析我上传的纳税申报表和财务报表，比对两个表格的数据差异，以表格形式输出比对结果，并分析税务风险给出处理建议。请直接分析文件内容，不要调用任何工具或命令。", "纳税申报表预审")}
            title="上传纳税申报表和财务报表，自动比对分析"
          >
            <span class="qa-icon">📊</span>
            <span>申报表预审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => handleQuickSkill("contract-tax", "请按照票据合同税务审核流程，从税务角度分析我上传的合同或票据，列支涉及的税目并计算相关税额，给出风险提示和修改建议。请直接分析文件内容，不要调用任何工具或命令。", "合同税务审核")}
            title="上传合同或票据，从税务角度审核分析"
          >
            <span class="qa-icon">📝</span>
            <span>合同及票据税审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => handleQuickSkill("invoice-check", BUILTIN_SKILLS[3].prompt, "发票查验")}
            title="上传发票图片/PDF/XML，查验发票真伪并分析风险"
          >
            <span class="qa-icon">🔍</span>
            <span>发票查验</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => handleQuickSkill("receipt-organizer", BUILTIN_SKILLS[4].prompt, "票据整理", true)}
            title="扫描文件夹中的票据，按类型分类整理，生成报销单"
          >
            <span class="qa-icon">🧾</span>
            <span>票据整理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => {
              if (!state.authorizedFolder) {
                showToast("请先在知识库面板中选择文件夹");
                state.sidePanel = "knowledge";
                renderApp();
                return;
              }
              handleCustomSkillClick(BUILTIN_SKILLS[5]);
            }}
            title="在指定文件夹中检索文件、提取摘要、搜索内容"
          >
            <span class="qa-icon">📚</span>
            <span>知识库</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${false}
            @click=${() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx";
              fileInput.multiple = true;
              fileInput.onchange = () => {
                if (fileInput.files && fileInput.files.length > 0) {
                  handleFiles(fileInput.files);
                }
              };
              fileInput.click();
            }}
            title="上传图片或文件"
          >
            <span class="qa-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
            <span>上传文件</span>
          </button>
          ${state.customSkills.filter(s => s.pinned).sort((a, b) => a.createdAt - b.createdAt).map(sk => html`
            <button
              class="quick-action-btn custom"
              ?disabled=${false}
              @click=${() => handleCustomSkillClick(sk)}
              title=${sk.description || sk.name}
            >
              <span class="qa-icon">${sk.emoji}</span>
              <span>${sk.name}</span>
            </button>
          `)}
        </div>

        <div class="taxchat-input-container"
          @dragover=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = true;
            renderApp();
          }}
          @dragleave=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = false;
            renderApp();
          }}
          @drop=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            state.dragOver = false;
            console.log("Drop event, files:", e.dataTransfer?.files?.length);
            if (e.dataTransfer?.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          class=${state.dragOver ? "taxchat-input-container drag-over" : "taxchat-input-container"}
        >
          ${state.activeCustomSkill ? html`
            <div class="skill-prompt-bubble">
              <span class="skill-prompt-bubble__emoji">${state.activeCustomSkill.emoji}</span>
              <span class="skill-prompt-bubble__text">${state.activeCustomSkill.name}${state.activeCustomSkill.description ? ` · ${state.activeCustomSkill.description}` : ""}</span>
              <button class="skill-prompt-bubble__close" @click=${() => clearActiveCustomSkill()} title="取消技能">✕</button>
            </div>
          ` : ""}
          ${state.mentionDropdownVisible ? html`
            <div class="agent-mention-dropdown">
              ${getMentionCandidates().map((a, i) => html`
                  <div class="agent-mention-item ${i === state.mentionIndex ? "agent-mention-item--active" : ""}" @mousedown=${(e: Event) => { e.preventDefault(); insertAgentMention(a); }} @mouseenter=${() => { state.mentionIndex = i; renderApp(); }}>
                    <span class="agent-mention-emoji">${a.avatarUrl ? html`<img src="${a.avatarUrl}" class="agent-avatar-img-sm" />` : a.emoji}</span>
                    <span class="agent-mention-name">${a.name}</span>
                    ${a.description ? html`<span class="agent-mention-desc">${a.description}</span>` : ""}
                  </div>
                `)}
              ${getMentionCandidates().length === 0 ? html`<div class="agent-mention-empty">未找到匹配的智能体</div>` : ""}
            </div>
          ` : ""}
          ${state.commandPaletteVisible ? html`
            <div class="command-palette">
              ${getFilteredCommands().map((cmd, i) => html`
                <div class="command-item ${i === state.commandIndex ? "active" : ""}"
                  @mousedown=${(e: Event) => { e.preventDefault(); closeCommandPalette(); state.draft = ""; cmd.action(); scheduleRender(); }}
                  @mouseenter=${() => { state.commandIndex = i; scheduleRender(); }}>
                  <span class="command-emoji">${cmd.emoji}</span>
                  <div class="command-info">
                    <div class="command-name">${cmd.name}</div>
                    <div class="command-desc">${cmd.description}</div>
                  </div>
                </div>
              `)}
              ${getFilteredCommands().length === 0 ? html`<div class="command-item"><span class="command-desc">无匹配指令</span></div>` : ""}
            </div>
          ` : ""}
          ${state.replyingTo ? html`
            <div class="reply-bar">
              <div class="reply-bar__content">
                <div class="reply-bar__label">回复 ${state.replyingTo.type === "user" ? "我" : ((state.replyingTo as AssistantMessage).agentName || "Taxbot")}</div>
                <div class="reply-bar__text">${state.replyingTo.text.length > 60 ? state.replyingTo.text.slice(0, 60) + "..." : state.replyingTo.text}</div>
              </div>
              <button class="reply-bar__close" @click=${() => { state.replyingTo = null; renderApp(); }}>✕</button>
            </div>
          ` : ""}
          <textarea
            id="message-input"
            class="taxchat-input"
            rows="1"
            placeholder=${state.activeCustomSkill ? `请输入内容，将按「${state.activeCustomSkill.name}」流程处理...` : "输入您的税务问题...或拖入/粘贴文件"}
            .value=${state.draft}
            @input=${(e: Event) => {
              const ta = e.target as HTMLTextAreaElement;
              state.draft = ta.value;
              // Auto-resize: reset height then set to scrollHeight (capped by CSS max-height)
              ta.style.height = "auto";
              ta.style.height = ta.scrollHeight + "px";
              // Quick command detection: draft starts with / and no spaces
              if (checkCommandTrigger()) {
                return; // command palette handles rendering
              }
              // @mention dropdown: detect the last @token being typed (anywhere in text)
              const mentionMatch = state.draft.match(/@(\S*)$/);
              if (mentionMatch && state.agentsList.length > 0) {
                const prevFilter = state.mentionFilter;
                state.mentionDropdownVisible = true;
                state.mentionFilter = mentionMatch[1].toLowerCase();
                if (state.mentionFilter !== prevFilter) {
                  state.mentionIndex = 0;
                }
              } else {
                state.mentionDropdownVisible = false;
                state.mentionFilter = "";
                state.mentionIndex = 0;
              }
              renderApp();
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (state.commandPaletteVisible) {
                if (e.key === "ArrowDown") { e.preventDefault(); commandNavigate("down"); return; }
                if (e.key === "ArrowUp") { e.preventDefault(); commandNavigate("up"); return; }
                if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); commandExecuteSelected(); return; }
                if (e.key === "Escape") { e.preventDefault(); closeCommandPalette(); return; }
              }
              if (state.mentionDropdownVisible) {
                const candidates = getMentionCandidates();
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  state.mentionIndex = candidates.length ? (state.mentionIndex + 1) % candidates.length : 0;
                  renderApp();
                  requestAnimationFrame(() => {
                    document.querySelector('.agent-mention-item--active')?.scrollIntoView({ block: 'nearest' });
                  });
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  state.mentionIndex = candidates.length ? (state.mentionIndex - 1 + candidates.length) % candidates.length : 0;
                  renderApp();
                  requestAnimationFrame(() => {
                    document.querySelector('.agent-mention-item--active')?.scrollIntoView({ block: 'nearest' });
                  });
                  return;
                }
                if (e.key === "Enter" && !e.isComposing) {
                  e.preventDefault();
                  if (candidates.length > 0 && state.mentionIndex < candidates.length) {
                    insertAgentMention(candidates[state.mentionIndex]);
                  }
                  return;
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  state.mentionDropdownVisible = false;
                  state.mentionIndex = 0;
                  renderApp();
                  return;
                }
              }
              if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            @paste=${(e: ClipboardEvent) => {
              console.log("Paste event, files:", e.clipboardData?.files?.length);
              if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
                e.preventDefault();
                handleFiles(e.clipboardData.files);
              }
            }}
            ?disabled=${false}
            rows="1"
          ></textarea>
          <button
            class="taxchat-button primary send-inline"
            ?disabled=${state.draft.trim().length === 0 && state.attachments.length === 0 && state.knowledgeRefs.length === 0}
            @click=${handleSend}
            title="发送消息 (Enter)"
          >
            <span class="button-icon">➤</span>
          </button>

          ${state.dragOver ? html`
            <div class="drag-overlay">
              <div class="drag-text">📁 拖入文件即可上传</div>
            </div>
          ` : ""}
        </div>

        ${state.attachments.length > 0 ? html`
          <div class="attachments-list">
            ${state.attachments.map((att, idx) => html`
              <div class="attachment-item">
                <span class="attachment-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
                <span class="attachment-name" title=${att.name}>${att.name}</span>
                <span class="attachment-size">${formatFileSize(att.size)}</span>
                <button
                  class="attachment-remove"
                  @click=${() => removeAttachment(idx)}
                  title="移除"
                >
                  ✕
                </button>
              </div>
            `)}
          </div>
        ` : ""}

        ${state.knowledgeRefs.length > 0 ? html`
          <div class="knowledge-refs-list">
            ${state.knowledgeRefs.map((ref, idx) => html`
              <div class="knowledge-ref-item">
                <span class="kr-icon">📚</span>
                <span class="kr-name" title=${ref.name}>${ref.name}</span>
                <button class="kr-remove" @click=${() => removeKnowledgeRef(idx)} title="移除引用">✕</button>
              </div>
            `)}
          </div>
        ` : ""}
      </div>

        </div><!-- /taxchat-main -->
      </div><!-- /taxchat-body -->


      ${state.showQuickStart ? renderQuickStart() : ""}

      ${state.editingSkill ? html`
        <div class="skill-editor-overlay" @click=${() => { state.editingSkill = null; renderApp(); }}>
          <div class="skill-editor" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${state.customSkills.some(s => s.id === state.editingSkill!.id) ? "编辑 Skill" : "新建 Skill"}</h3>
            <label>名称 *</label>
            <input type="text" .value=${live(state.editingSkill.name)} @input=${(e: Event) => { state.editingSkill!.name = (e.target as HTMLInputElement).value; }} placeholder="例：增值税计算助手" />
            <label>图标</label>
            <input type="text" .value=${live(state.editingSkill.emoji)} @input=${(e: Event) => { state.editingSkill!.emoji = (e.target as HTMLInputElement).value; }} placeholder="🤖" style="width: 60px;" />
            <label>描述</label>
            <textarea .value=${live(state.editingSkill.description)} @input=${(e: Event) => { state.editingSkill!.description = (e.target as HTMLTextAreaElement).value; }} placeholder="描述这个技能的用途和使用场景，例如：当用户提到增值税计算、税率查询时使用此技能" style="min-height: 60px;"></textarea>
            <label>操作流程 *</label>
            <textarea .value=${live(state.editingSkill.prompt)} @input=${(e: Event) => { state.editingSkill!.prompt = (e.target as HTMLTextAreaElement).value; }} placeholder="请详细描述技能的操作流程（自然语言）。例如：分析用户上传的文件，从增值税角度列出所有涉税项目，计算应纳税额..."></textarea>
            <div class="skill-editor__actions">
              <button class="skill-editor__cancel" @click=${() => { state.editingSkill = null; renderApp(); }}>取消</button>
              <button class="skill-editor__save" @click=${() => {
                if (!state.editingSkill?.name.trim()) { alert("请填写名称"); return; }
                if (!state.editingSkill?.prompt.trim()) { alert("请填写操作流程"); return; }
                saveSkillFromEditor();
              }}>保存技能</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.creatingAgent ? html`
        <div class="agent-editor-overlay" @click=${() => { state.creatingAgent = false; state.editingAgentId = null; renderApp(); }}>
          <div class="agent-editor" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${state.editingAgentId ? "编辑智能体" : "新建智能体"}</h3>
            <div class="agent-editor-avatar-row">
              <div class="agent-editor-avatar-preview" @click=${() => {
                const fi = document.createElement("input");
                fi.type = "file";
                fi.accept = "image/*";
                fi.onchange = () => {
                  if (!fi.files?.[0]) return;
                  const file = fi.files[0];
                  if (file.size > 512 * 1024) { showToast("图片不能超过 512KB"); return; }
                  const reader = new FileReader();
                  reader.onload = () => {
                    state.agentCreateDraft.avatarDataUrl = reader.result as string;
                    renderApp();
                  };
                  reader.readAsDataURL(file);
                };
                fi.click();
              }} title="点击上传头像图片">
                ${state.agentCreateDraft.avatarDataUrl
                  ? html`<img src="${state.agentCreateDraft.avatarDataUrl}" class="agent-avatar-preview-img" />`
                  : html`<span>${state.agentCreateDraft.emoji || "🤖"}</span>`}
                <div class="agent-avatar-upload-hint">上传</div>
              </div>
              <div class="agent-editor-avatar-input">
                <label>Emoji（无图片时显示）</label>
                <input type="text" maxlength="4" .value=${live(state.agentCreateDraft.emoji)} @input=${(e: Event) => { state.agentCreateDraft.emoji = (e.target as HTMLInputElement).value; renderApp(); }} placeholder="🤖" style="width: 60px; font-size: 20px; text-align: center;" />
                ${state.agentCreateDraft.avatarDataUrl ? html`<button class="agent-avatar-remove" @click=${() => { state.agentCreateDraft.avatarDataUrl = ""; renderApp(); }}>移除图片</button>` : ""}
              </div>
            </div>
            <label>名称 *</label>
            <input type="text" maxlength="30" .value=${live(state.agentCreateDraft.name)} @input=${(e: Event) => { state.agentCreateDraft.name = (e.target as HTMLInputElement).value; renderApp(); }} placeholder="如：财务助手、合同审查员" />
            <label>描述 <span class="agent-field-hint">对应 SOUL.md — 智能体的性格与行为方式</span></label>
            <textarea .value=${live(state.agentCreateDraft.description)} @input=${(e: Event) => { state.agentCreateDraft.description = (e.target as HTMLTextAreaElement).value; }} placeholder="描述智能体的定位和行为风格。例如：&#10;你是一位资深税务顾问，说话严谨专业，回答问题时会引用具体法规条文。"></textarea>
            <label>身份 <span class="agent-field-hint">对应 IDENTITY.md — 智能体的角色定义</span></label>
            <textarea .value=${live(state.agentCreateDraft.identityDesc)} @input=${(e: Event) => { state.agentCreateDraft.identityDesc = (e.target as HTMLTextAreaElement).value; }} placeholder="定义智能体的身份角色。例如：&#10;税务部门高级顾问，专注增值税和企业所得税领域，拥有10年从业经验。" style="min-height:80px;"></textarea>
            <label>擅长 <span class="agent-field-hint">对应 AGENTS.md — 智能体的技能与工作指南</span></label>
            <textarea .value=${live(state.agentCreateDraft.expertise)} @input=${(e: Event) => { state.agentCreateDraft.expertise = (e.target as HTMLTextAreaElement).value; }} placeholder="列出智能体擅长的任务。例如：&#10;- 合同涉税条款审核&#10;- 增值税税率适用分析&#10;- 跨境税务合规咨询" style="min-height:80px;"></textarea>
            <label>可用技能 <span class="agent-field-hint">对应 TOOLS.md — 勾选智能体可使用的技能</span></label>
            <div class="agent-skills-selector">
              ${[...BUILTIN_SKILLS, ...state.customSkills.filter(s => !s.id.startsWith("__builtin_"))].map(sk => {
                const selected = (state.agentCreateDraft.selectedSkills || []).includes(sk.id);
                return html`
                  <label class="agent-skill-option ${selected ? "selected" : ""}" @click=${(e: Event) => {
                    e.preventDefault();
                    const cur: string[] = state.agentCreateDraft.selectedSkills || [];
                    state.agentCreateDraft.selectedSkills = selected ? cur.filter((id: string) => id !== sk.id) : [...cur, sk.id];
                    renderApp();
                  }}>
                    <span class="agent-skill-check">${selected ? "☑" : "☐"}</span>
                    <span class="agent-skill-emoji">${sk.emoji}</span>
                    <span class="agent-skill-name">${sk.name}</span>
                    ${sk.description ? html`<span class="agent-skill-desc">${sk.description}</span>` : ""}
                  </label>`;
              })}
              ${BUILTIN_SKILLS.length === 0 && state.customSkills.length === 0 ? html`<div style="color:#9ca3af;font-size:12px;padding:8px;">暂无可用技能</div>` : ""}
            </div>
            <div class="agent-editor__actions">
              ${state.editingAgentId ? html`
                <button class="agent-editor__memory-btn" @click=${async () => {
                  const mem = await loadAgentMemory(state.editingAgentId!);
                  state.viewingAgentMemory = { agentId: state.editingAgentId!, agentName: state.agentCreateDraft.name, content: mem };
                  renderApp();
                }} title="查看/编辑该智能体的记忆">查看记忆</button>
              ` : ""}
              <button class="agent-editor__cancel" @click=${() => { state.creatingAgent = false; state.editingAgentId = null; state.agentCreateDraft = { name: "", emoji: "🤖", description: "", identityDesc: "", expertise: "", avatarDataUrl: "", selectedSkills: [] }; renderApp(); }}>取消</button>
              <button class="agent-editor__save" ?disabled=${state.agentSaving || !state.agentCreateDraft.name.trim()} @click=${() => { state.editingAgentId ? updateAgent() : createAgent(); }}>${state.agentSaving ? "保存中..." : state.editingAgentId ? "保存修改" : "创建智能体"}</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.viewingAgentMemory ? html`
        <div class="agent-editor-overlay" @click=${() => { state.viewingAgentMemory = null; state.confirmingMemoryClear = false; renderApp(); }}>
          <div class="agent-editor agent-memory-editor" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${state.viewingAgentMemory.agentName} — 记忆</h3>
            <p style="font-size:12px;color:#999;margin:0 0 8px;">智能体对话时会参考这些记忆。可手动编辑或清空。</p>
            <textarea class="agent-memory-textarea" .value=${state.viewingAgentMemory.content}
              @input=${(e: Event) => { if (state.viewingAgentMemory) state.viewingAgentMemory.content = (e.target as HTMLTextAreaElement).value; }}
              placeholder="暂无记忆。智能体对话中点击「记住」按钮可保存回复到此处。"
            ></textarea>
            ${state.confirmingMemoryClear ? html`
              <div class="memory-clear-confirm">
                <div class="memory-clear-warn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>清空后，智能体将丢失所有积累的经验和对话记忆，无法恢复。确定清空吗？</span>
                </div>
                <div class="memory-clear-btns">
                  <button class="memory-clear-yes" @click=${() => {
                    if (state.viewingAgentMemory) {
                      saveAgentMemory(state.viewingAgentMemory.agentId, "");
                      state.viewingAgentMemory.content = "";
                      state.confirmingMemoryClear = false;
                      showToast("记忆已清空");
                      renderApp();
                    }
                  }}>确定清空</button>
                  <button class="memory-clear-no" @click=${() => { state.confirmingMemoryClear = false; renderApp(); }}>取消</button>
                </div>
              </div>
            ` : ""}
            <div class="agent-editor__actions">
              <button class="agent-editor__cancel" @click=${() => {
                state.confirmingMemoryClear = true;
                renderApp();
              }} ?disabled=${!state.viewingAgentMemory.content}>清空记忆</button>
              <button class="agent-editor__save" @click=${() => {
                if (state.viewingAgentMemory) {
                  saveAgentMemory(state.viewingAgentMemory.agentId, state.viewingAgentMemory.content);
                  showToast("记忆已保存");
                  state.viewingAgentMemory = null;
                  state.confirmingMemoryClear = false;
                  renderApp();
                }
              }}>保存</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.rentalPublishDialog && state.rentalPublishAgent ? html`
        <div class="rental-publish-overlay" @click=${closePublishDialog}>
          <div class="rental-publish-dialog" @click=${(e: Event) => e.stopPropagation()}>
            <h3>🏪 发布到智能体市场</h3>
            <div class="rental-publish-agent-preview">
              <div class="rental-publish-agent-emoji">
                ${state.rentalPublishAgent.avatarUrl ? html`<img src="${state.rentalPublishAgent.avatarUrl}" />` : state.rentalPublishAgent.emoji}
              </div>
              <div class="rental-publish-agent-info">
                <div class="rental-publish-agent-name">${state.rentalPublishAgent.isDefault ? `Taxbot Agent by ${state.taxstoreUser?.name || ""}` : state.rentalPublishAgent.name}</div>
                <div class="rental-publish-agent-desc">${state.rentalPublishAgent.description}</div>
              </div>
            </div>
            <div class="rental-field">
              <label>单次任务价格（积分）</label>
              <input type="number" min="1" max="9999" .value=${String(state.rentalPublishDraft.price)}
                @input=${(e: Event) => { state.rentalPublishDraft.price = parseInt((e.target as HTMLInputElement).value) || 0; }} />
              <div class="rental-field-hint">用户下单时将支付此积分，任务完成后积分转给你</div>
            </div>
            <div class="rental-field">
              <label>市场描述</label>
              <textarea .value=${state.rentalPublishDraft.description}
                @input=${(e: Event) => { state.rentalPublishDraft.description = (e.target as HTMLTextAreaElement).value; }}
                placeholder="描述这个智能体能做什么、擅长什么..."></textarea>
              <div class="rental-field-hint">将展示给市场上的其他用户</div>
            </div>
            <div class="rental-field">
              <label>专业标签 <span style="color:#9ca3af;font-weight:normal;">(最多5个)</span></label>
              <div class="rental-tags-grid">
                ${["个税", "增值税", "企业所得税", "印花税", "土地增值税",
                  "纳税申报", "税务筹划", "发票管理", "税务登记",
                  "财务报表", "审计", "会计核算", "成本管理",
                  "社保公积金", "工商注册", "政策咨询"].map(tag => {
                  const isSelected = state.rentalPublishDraft.tags.includes(tag);
                  return html`<button type="button" class="rental-tag-chip ${isSelected ? "rental-tag-chip--active" : ""}"
                    @click=${() => {
                      if (isSelected) {
                        state.rentalPublishDraft.tags = state.rentalPublishDraft.tags.filter(t => t !== tag);
                      } else if (state.rentalPublishDraft.tags.length < 5) {
                        state.rentalPublishDraft.tags = [...state.rentalPublishDraft.tags, tag];
                      }
                      scheduleRender();
                    }}>${tag}</button>`;
                })}
              </div>
            </div>
            <div class="rental-publish-actions">
              <button class="rental-btn-cancel" @click=${closePublishDialog}>取消</button>
              <button class="rental-btn-publish"
                ?disabled=${!state.rentalPublishDraft.description.trim() || state.rentalPublishDraft.price < 1}
                @click=${publishAgent}>发布 (${state.rentalPublishDraft.price} 积分/次)</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.rentalTaskPanel && state.rentalActiveTask ? html`
        <div class="rental-task-overlay" @click=${closeTaskPanel}>
          <div class="rental-task-panel" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${state.rentalActiveTask.status === "revision_requested" ? "✏️ 处理修订请求" : "📋 处理任务"}</h3>
            <div class="rental-task-info">
              <div class="rental-task-title">${state.rentalActiveTask.title}</div>
              <div class="rental-task-meta">
                来自: ${state.rentalActiveTask.client.name} · 智能体: ${state.rentalActiveTask.listing.emoji} ${state.rentalActiveTask.listing.name}
                ${state.rentalActiveTask.revisionCount ? html` · <span style="color:#9333ea;">第 ${state.rentalActiveTask.revisionCount + 1} 次修订</span>` : ""}
              </div>
              ${state.rentalActiveTask.status === "revision_requested" && state.rentalActiveTask.revisionRequest ? html`
                <div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.2);">
                  <div style="font-size:12px;color:#9333ea;font-weight:600;margin-bottom:4px;">📝 客户修订要求</div>
                  <div style="font-size:13px;color:#e2e8f0;white-space:pre-wrap;">${state.rentalActiveTask.revisionRequest}</div>
                </div>
              ` : ""}
              <div class="rental-task-content">${state.rentalActiveTask.content}</div>
              ${(() => {
                if (!state.rentalActiveTask?.attachments) return "";
                try {
                  const atts = JSON.parse(state.rentalActiveTask.attachments) as Array<{name: string; url: string; type: string; size: number}>;
                  if (atts.length === 0) return "";
                  const images = atts.filter(a => a.type?.startsWith("image/"));
                  const files = atts.filter(a => !a.type?.startsWith("image/"));
                  return html`
                    <div class="rental-task-client-attachments">
                      <div class="rental-task-attachments-label">📎 客户附件 (${atts.length})</div>
                      ${images.length > 0 ? html`
                        <div class="rental-att-images">
                          ${images.map(att => html`
                            <a class="rental-att-img-wrap" href="https://taxbot.cc:8443${att.url}" target="_blank" rel="noopener noreferrer" title="${att.name}">
                              <img class="rental-att-img" src="https://taxbot.cc:8443${att.url}" alt="${att.name}" />
                              <span class="rental-att-img-name">${att.name}</span>
                            </a>
                          `)}
                        </div>
                      ` : ""}
                      ${files.length > 0 ? html`
                        <div class="rental-task-attachments-list">
                          ${files.map(att => html`
                            <a class="rental-task-attachment-item" href="https://taxbot.cc:8443${att.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;cursor:pointer;">
                              <span class="rental-att-file-icon">📄</span>
                              <span class="rental-task-attachment-name">${att.name}</span>
                              <span class="rental-task-attachment-size">(${(att.size / 1024).toFixed(0)}KB)</span>
                            </a>
                          `)}
                        </div>
                      ` : ""}
                    </div>`;
                } catch { return ""; }
              })()}
            </div>
            <div class="rental-task-agent-action">
              ${state.rentalAgentProcessing ? (() => {
                const _agentId = state.rentalActiveTask?.listing.agentId;
                const _agent = _agentId ? state.agentsList.find(a => a.id === _agentId) : null;
                return html`
                <div class="rental-agent-processing">
                  <div class="rental-agent-spinner"></div>
                  ${_agent ? html`
                    <span class="rental-processing-agent">
                      ${_agent.avatarUrl
                        ? html`<img src="${_agent.avatarUrl}" class="rental-processing-avatar" />`
                        : html`<span class="rental-processing-emoji">${_agent.emoji}</span>`}
                      <strong>${_agent.name}</strong> 正在处理任务...
                    </span>
                  ` : html`<span>智能体正在处理任务，请稍候...</span>`}
                </div>`;
              })() : html`
                <button class="rental-btn-agent"
                  @click=${processTaskWithAgent}>
                  🤖 让智能体处理
                </button>
              `}
            </div>
            <div class="rental-task-result-label">
              ${state.rentalAgentProcessing ? "智能体回答中..." : "智能体回答 / 任务结果"}
            </div>
            <textarea class="rental-task-result-area"
              .value=${state.rentalTaskResult}
              @input=${(e: Event) => { state.rentalTaskResult = (e.target as HTMLTextAreaElement).value; }}
              ?readonly=${state.rentalAgentProcessing}
              placeholder="智能体处理后结果会显示在这里，也可以直接手动填写..."></textarea>
            ${state.rentalTaskResult.trim() ? html`
            <div class="rental-task-instruction">
              <div class="rental-task-instruction-label">✏️ 修改指令 <span style="color:#9ca3af;font-weight:normal;">（输入指令让智能体修改上方结果）</span></div>
              <div class="rental-task-instruction-row">
                <input class="rental-task-instruction-input"
                  type="text"
                  .value=${state.rentalTaskInstruction}
                  @input=${(e: Event) => { state.rentalTaskInstruction = (e.target as HTMLInputElement).value; scheduleRender(); }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter" && !e.shiftKey && state.rentalTaskInstruction.trim() && !state.rentalAgentProcessing) {
                      e.preventDefault();
                      reviseTaskWithInstruction();
                    }
                  }}
                  ?disabled=${state.rentalAgentProcessing}
                  placeholder="例如：把结论部分写得更详细一些..." />
                <button class="rental-btn-revise"
                  ?disabled=${!state.rentalTaskInstruction.trim() || state.rentalAgentProcessing}
                  @click=${reviseTaskWithInstruction}>
                  ${state.rentalAgentProcessing ? "修改中..." : "发送"}
                </button>
              </div>
            </div>
            ` : ""}
            <div class="rental-task-attachments">
              <div class="rental-task-attachments-label">📎 附件 <span style="color:#9ca3af;font-weight:normal;">(可选，最多5个)</span></div>
              <div class="rental-task-attachments-list">
                ${state.rentalTaskAttachments.map((f, i) => html`
                  <div class="rental-task-attachment-item">
                    <span class="rental-task-attachment-name">${f.name}</span>
                    <span class="rental-task-attachment-size">(${(f.size / 1024).toFixed(0)}KB)</span>
                    <button class="rental-task-attachment-remove" @click=${() => {
                      state.rentalTaskAttachments = state.rentalTaskAttachments.filter((_, j) => j !== i);
                      scheduleRender();
                    }}>✕</button>
                  </div>
                `)}
                ${state.rentalTaskAttachments.length < 5 ? html`
                  <label class="rental-task-attachment-add">
                    📎 添加附件
                    <input type="file" multiple style="display:none;" @change=${(e: Event) => {
                      const input = e.target as HTMLInputElement;
                      const newFiles = Array.from(input.files || []);
                      const valid = newFiles.filter(f => f.size <= 10 * 1024 * 1024);
                      if (valid.length < newFiles.length) showToast("部分文件超过10MB限制，已跳过");
                      state.rentalTaskAttachments = [...state.rentalTaskAttachments, ...valid].slice(0, 5);
                      input.value = "";
                      scheduleRender();
                    }} />
                  </label>
                ` : ""}
              </div>
            </div>
            <!-- Messages -->
            <div class="rental-messages-section">
              <button class="rental-messages-toggle" @click=${toggleMessages}>
                💬 留言沟通 ${(state.rentalActiveTask?.unreadMessageCount || 0) > 0 ? html`<span class="rental-messages-badge rental-messages-badge--unread">${state.rentalActiveTask!.unreadMessageCount}</span>` : state.rentalMessages.length > 0 ? html`<span class="rental-messages-badge">${state.rentalMessages.length}</span>` : ""}
              </button>
              ${state.rentalMessagesOpen ? html`
                <div class="rental-messages-container">
                  <div class="rental-messages-list">
                    ${state.rentalMessages.length === 0
                      ? html`<div class="rental-messages-empty">暂无留言</div>`
                      : state.rentalMessages.map(msg => html`
                        <div class="rental-message-row ${msg.sender.id === state.taxstoreUser?.id ? "rental-message-row--mine" : ""}">
                          <div class="rental-message-bubble ${msg.sender.id === state.taxstoreUser?.id ? "rental-message-bubble--mine" : "rental-message-bubble--other"}">
                            <div class="rental-message-sender">${msg.sender.name}</div>
                            <div class="rental-message-content">${msg.content}</div>
                            <div class="rental-message-time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      `)
                    }
                  </div>
                  <div class="rental-messages-input-row">
                    <input type="text" class="rental-messages-input" .value=${state.rentalMessageInput}
                      @input=${(e: Event) => { state.rentalMessageInput = (e.target as HTMLInputElement).value; scheduleRender(); }}
                      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); sendTaskMessage(); } }}
                      placeholder="输入留言..." />
                    <button class="rental-messages-send" @click=${sendTaskMessage}
                      ?disabled=${!state.rentalMessageInput.trim()}>发送</button>
                  </div>
                </div>
              ` : ""}
            </div>
            <div class="rental-task-actions">
              <span class="rental-task-price">💰 完成可获得 ${state.rentalActiveTask.price} 积分</span>
              <div style="display:flex;gap:8px;">
                <button class="rental-btn-cancel" @click=${closeTaskPanel}>取消</button>
                <button class="rental-btn-submit"
                  ?disabled=${!state.rentalTaskResult.trim() || state.rentalAgentProcessing}
                  @click=${submitTaskResult}>提交结果</button>
              </div>
            </div>
          </div>
        </div>
      ` : ""}

      <!-- 任务列表弹窗 -->
      ${state.rentalTaskListType ? (() => {
        const isPending = state.rentalTaskListType === "pending";
        const tasks = isPending ? state.rentalPendingTasks : state.rentalCompletedTasks;
        return html`
        <div class="rental-task-overlay" @click=${() => { state.rentalTaskListType = null; scheduleRender(); }}>
          <div class="rental-tasklist-dialog" @click=${(e: Event) => e.stopPropagation()}>
            <div class="rental-tasklist-header">
              <h3>${isPending ? "📋 待处理任务" : "✅ 已完成任务"} <span class="rental-tasklist-badge ${isPending ? "rental-tasklist-badge--pending" : "rental-tasklist-badge--done"}">${tasks.length}</span></h3>
              <button class="rental-tasklist-close" @click=${() => { state.rentalTaskListType = null; scheduleRender(); }}>✕</button>
            </div>
            <div class="rental-tasklist-body">
              ${tasks.length === 0 ? html`<div class="rental-tasklist-empty">暂无任务</div>` : ""}
              ${tasks.map(task => html`
                <div class="rental-tasklist-item ${isPending ? "rental-tasklist-item--pending" : "rental-tasklist-item--done"}"
                  @click=${() => {
                    if (isPending) { state.rentalTaskListType = null; openTaskPanel(task); }
                    else { state.rentalTaskDetailView = task; scheduleRender(); }
                  }}>
                  <div class="rental-tasklist-item-emoji">${task.listing.emoji}</div>
                  <div class="rental-tasklist-item-body">
                    <div class="rental-tasklist-item-title">${task.title}</div>
                    <div class="rental-tasklist-item-meta">
                      ${task.listing.name} · ${task.client.name}
                      ${task.completedAt ? html` · ${new Date(task.completedAt).toLocaleDateString()}` : ""}
                    </div>
                    ${!isPending && task.rating ? html`
                      <div class="rental-tasklist-item-rating">${"⭐".repeat(task.rating)}${task.ratingComment ? html` <span class="rental-task-card-comment">${task.ratingComment}</span>` : ""}</div>
                    ` : ""}
                  </div>
                  <div class="rental-tasklist-item-right">
                    <div class="rental-tasklist-item-price ${isPending ? "" : "rental-task-card-price--earned"}">${isPending ? "" : "+"}${task.price} 积分</div>
                    ${isPending ? html`<div class="rental-tasklist-item-action">处理 →</div>` : html`<div class="rental-tasklist-item-action">详情 →</div>`}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>`;
      })() : ""}

      <!-- 已完成任务详情弹窗 -->
      ${state.rentalTaskDetailView ? html`
        <div class="rental-task-overlay" @click=${() => { state.rentalTaskDetailView = null; scheduleRender(); }}>
          <div class="rental-task-panel" @click=${(e: Event) => e.stopPropagation()}>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <h3 style="margin:0;">✅ 任务详情</h3>
              <button class="rental-tasklist-close" @click=${() => { state.rentalTaskDetailView = null; scheduleRender(); }}>✕</button>
            </div>
            <div class="rental-task-info">
              <div class="rental-task-title">${state.rentalTaskDetailView.title}</div>
              <div class="rental-task-meta">
                来自: ${state.rentalTaskDetailView.client.name} · 智能体: ${state.rentalTaskDetailView.listing.emoji} ${state.rentalTaskDetailView.listing.name}
              </div>
              <div class="rental-task-content">${state.rentalTaskDetailView.content}</div>
            </div>
            ${state.rentalTaskDetailView.result ? html`
              <div class="rental-task-result-label">智能体回复</div>
              <div class="rental-task-detail-result">${state.rentalTaskDetailView.result}</div>
            ` : ""}
            <div class="rental-task-detail-footer">
              <div class="rental-task-detail-stats">
                <span class="rental-task-card-price--earned">+${state.rentalTaskDetailView.price} 积分</span>
                ${state.rentalTaskDetailView.completedAt ? html`<span style="color:#9ca3af;font-size:12px;">完成于 ${new Date(state.rentalTaskDetailView.completedAt).toLocaleString()}</span>` : ""}
              </div>
              ${state.rentalTaskDetailView.rating ? html`
                <div class="rental-task-detail-rating">
                  ${"⭐".repeat(state.rentalTaskDetailView.rating)}
                  ${state.rentalTaskDetailView.ratingComment ? html`<span style="color:#9ca3af;font-size:12px;margin-left:8px;">${state.rentalTaskDetailView.ratingComment}</span>` : ""}
                </div>
              ` : ""}
            </div>
          </div>
        </div>
      ` : ""}

      ${state.previewAttachment ? html`
        <div class="preview-modal" @click=${() => {
          state.previewAttachment = null;
          renderApp();
        }}>
          <div class="preview-content" @click=${(e: Event) => e.stopPropagation()}>
            <button class="preview-close" @click=${() => {
              state.previewAttachment = null;
              renderApp();
            }}>✕</button>
            ${state.previewAttachment.type.startsWith("image/") ? html`
              <img src=${state.previewAttachment.dataUrl} alt=${state.previewAttachment.name} class="preview-image" />
            ` : html`
              <div class="preview-file-info">
                <div class="preview-file-icon">📄</div>
                <div class="preview-file-name">${state.previewAttachment.name}</div>
                <div class="preview-file-size">${formatFileSize(state.previewAttachment.size)}</div>
                <div class="preview-file-type">${state.previewAttachment.type}</div>
              </div>
            `}
          </div>
        </div>
      ` : ""}

      ${state.toastMessage ? html`
        <div class="taxchat-toast">
          <div class="taxchat-toast__icon">📚</div>
          <div class="taxchat-toast__text">${state.toastMessage}</div>
          <button class="taxchat-toast__close" @click=${() => {
            if (state.toastTimer) clearTimeout(state.toastTimer);
            state.toastMessage = null;
            state.toastTimer = null;
            renderApp();
          }}>✕</button>
        </div>
      ` : ""}
    </div>
  `;

  render(content, app);

  // Auto-scroll + virtual scroll measurement
  requestAnimationFrame(() => {
    const container = document.getElementById("messages-container");
    if (container) {
      // Measure rendered heights for virtual scroll accuracy
      measureRenderedHeights();

      // Auto scroll — only force when explicitly requested (send, switch conv)
      if (_forceScrollBottom) {
        container.scrollTop = container.scrollHeight;
        setForceScrollBottom(false);
      } else {
        // Respects wasAtBottom: scrolls only if user was already at bottom
        autoScrollToBottom(container);
      }

      // Attach scroll listener for virtual scroll recalculation (once)
      if (!(container as any).__vsListenerAttached) {
        (container as any).__vsListenerAttached = true;
        let vsRafPending = false;
        container.addEventListener("scroll", () => {
          checkAtBottom(container);
          // Only re-render for virtual scroll when message count warrants it
          if (state.messages.length >= 40 && !vsRafPending) {
            vsRafPending = true;
            requestAnimationFrame(() => {
              vsRafPending = false;
              scheduleRender();
            });
          }
        }, { passive: true });
      }
    }
  });

  // Focus input (skip when side panel is open to avoid stealing focus from panel inputs)
  const input = document.getElementById("message-input") as HTMLTextAreaElement;
  if (input && !state.sidePanel && !state.searchOpen) {
    input.focus();
    state.inputRef = input;
  }
}

// ─── Event Listeners ──────────────────────────────────────────

// Intercept link clicks in messages to open file paths and URLs via Electron
// Close status menu on outside click
document.addEventListener("click", () => {
  let changed = false;
  if (state.showStatusMenu) { state.showStatusMenu = false; changed = true; }
  if (state.showNotifications) { state.showNotifications = false; changed = true; }
  if (changed) renderApp();
});

document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest("a") as HTMLAnchorElement | null;
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  // Only handle links inside message bubbles
  if (!anchor.closest(".message-bubble")) return;
  e.preventDefault();
  e.stopPropagation();
  const api = (window as any).electronAPI;
  if (href.startsWith("#localpath=")) {
    const localPath = decodeURIComponent(href.replace("#localpath=", ""));
    if (api?.openPath) {
      api.openPath(localPath);
    }
  } else if (/^https?:\/\//i.test(href)) {
    if (api?.openPath) {
      api.openPath(href);
    } else {
      window.open(href, "_blank");
    }
  }
});

// Ctrl+F to open search
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    openSearch();
  }
});

// Auto-connect on load
document.addEventListener("DOMContentLoaded", () => {
  // Apply saved font size
  document.documentElement.setAttribute("data-font-size", state.fontSize);

  connectGateway();
  loadFolderKnowledge();
  registerWatcherListener();
  registerManagedSkillsListener();
  startWatcher();
  syncManagedSkills();

  // Listen for gateway port changes (port conflict auto-switch)
  const api = (window as any).electronAPI;
  if (api?.onGatewayPortChanged) {
    api.onGatewayPortChanged((port: number) => {
      console.log(`[Gateway] Port changed to ${port}, reconnecting...`);
      state.gatewayUrl = `ws://127.0.0.1:${port}`;
      connectGateway();
    });
  }
});

// ─── Register Quick Commands ────────────────────────────────
registerCommands([
  { id: "risk",     name: "/risk",     emoji: "🧾", description: "税务风险治理",     action: () => handleQuickSkill("risk-governance", "请对上传的文件进行税务风险分析", "税务风险治理") },
  { id: "invoice",  name: "/invoice",  emoji: "🔍", description: "发票查验",         action: () => handleQuickSkill("invoice-check", "请查验这些发票", "发票查验") },
  { id: "compare",  name: "/compare",  emoji: "📊", description: "纳税申报表预审",   action: () => handleQuickSkill("declaration-review", "请审核纳税申报表", "纳税申报表预审") },
  { id: "contract", name: "/contract", emoji: "📝", description: "合同及票据税审",   action: () => handleQuickSkill("contract-review", "请进行合同税审", "合同及票据税审") },
  { id: "receipt",  name: "/receipt",  emoji: "📂", description: "票据整理",         action: () => handleQuickSkill("receipt-organize", "请执行票据整理流程", "票据整理", true) },
  { id: "clear",    name: "/clear",    emoji: "🗑️", description: "清空当前对话",      action: () => { state.confirmingClear = true; scheduleRender(); } },
  { id: "new",      name: "/new",      emoji: "💬", description: "新建对话",         action: () => createConversation() },
  { id: "export",   name: "/export",   emoji: "📤", description: "导出对话 (Markdown)", action: () => exportAsMarkdown() },
  { id: "exporthtml", name: "/exporthtml", emoji: "🌐", description: "导出对话 (HTML)", action: () => exportAsHTML() },
  { id: "search",   name: "/search",   emoji: "🔎", description: "搜索消息",         action: () => openSearch() },
]);

// ─── Initialization ──────────────────────────────────────────
initPersistence();
initConversations();
setRenderer(renderApp);
scheduleRender();

// TaxStore — restore session & sync (non-blocking)
initTaxStore().then(() => {
  if (state.taxstoreConnected) {
    syncInstalled();
    initRental();
  }
});
