/**
 * TaxChat State Management
 */

import type {
  AppState,
  ActiveRun,
  ChatMessage,
  AgentEntry,
  Conversation,
  NotificationEntry,
  CustomSkill,
} from "./types";

// ─── UUID Generator ────────────────────────────────────────────
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Render Scheduling ─────────────────────────────────────────
// setRenderer() is called by render.ts at init time to inject renderApp.
// All modules call scheduleRender() instead of renderApp() directly.
let rendererFn: (() => void) | null = null;
let renderPending = false;

export function setRenderer(fn: () => void) {
  rendererFn = fn;
}

export function scheduleRender() {
  if (renderPending) return;
  renderPending = true;
  requestAnimationFrame(() => {
    renderPending = false;
    rendererFn?.();
  });
}

// ─── Scroll Control ────────────────────────────────────────────
export let _forceScrollBottom = true;
export function setForceScrollBottom(val: boolean) {
  _forceScrollBottom = val;
}

// ─── Application State ─────────────────────────────────────────
export const state: AppState = {
  connected: false,
  hello: null,
  lastError: null,
  gatewayUrl: "ws://127.0.0.1:18789",
  client: null,
  sessionKey: "taxchat",
  messages: [] as ChatMessage[],
  draft: "",
  activeRuns: new Map<string, ActiveRun>(),
  inputRef: null,
  attachments: [],
  dragOver: false,
  toolMessages: undefined,
  stream: undefined,
  streamStartedAt: undefined,
  previewAttachment: null,
  pendingSkill: null,
  favorites: new Set<string>(),
  favSearchQuery: "",
  sidebarCollapsed: localStorage.getItem("taxbot_sidebar_collapsed") === "true",
  sidePanel: null,
  sidePanelWidth: parseInt(localStorage.getItem("taxbot_side_panel_width") || "340", 10),
  skillsTab: "installed" as const,
  confirmingClear: false,
  authorizedFolder: localStorage.getItem("taxbot_authorized_folder"),
  folderKnowledge: null,
  folderKnowledgeSent: false,
  importingFolder: false,
  importResult: null,
  lastSkillName: null,
  toastMessage: null,
  toastTimer: null,
  notifications: [] as NotificationEntry[], // populated by persistence.ts init
  panelTab: "favorites" as const,
  customSkills: [] as CustomSkill[], // populated by persistence.ts init
  editingSkill: null,
  activeCustomSkill: null,
  showStatusMenu: false,
  showNotifications: false,
  notifDetail: null,
  knowledgeFiles: [],
  knowledgeRefs: [],
  knowledgeDragOver: false,
  knowledgeLoading: false,
  builtinSkillsCollapsed: true,
  filesSortBy: "time" as const,
  skillsSortBy: "time" as const,
  showQuickStart: !localStorage.getItem("quickstart_seen"),
  // Model config
  fontSize: (localStorage.getItem("taxbot_font_size") || "medium") as AppState["fontSize"],
  settingsView: "main" as const,
  modelList: [] as AppState["modelList"],
  modelLoading: false,
  modelSaving: false,
  modelError: null as string | null,
  modelConfigDraft: { provider: "", baseUrl: "", apiKey: "", api: "openai-completions", modelId: "" },
  configBaseHash: null as string | null,
  currentModelConfig: null as Record<string, any> | null,
  apiKeyVisible: false,
  activeModel: null as AppState["activeModel"],
  confirmingModelSave: false,
  confirmingSessionClear: false,
  confirmingExit: false,
  pendingDispatch: null as AppState["pendingDispatch"],
  agentsList: [] as AgentEntry[],
  agentsLoading: false,
  creatingAgent: false,
  agentCreateDraft: { name: "", emoji: "🤖", description: "", identityDesc: "", expertise: "", avatarDataUrl: "", selectedSkills: [] as string[] },
  editingAgentId: null as string | null,
  agentSaving: false,
  confirmingAgentDelete: null as string | null,
  mentionDropdownVisible: false,
  mentionFilter: "",
  mentionIndex: 0,
  replyingTo: null as ChatMessage | null,
  // Conversation management — initialized by conversations.ts
  conversations: [] as Conversation[],
  currentConversationId: "",
  renamingConversation: null as string | null,
  confirmingConvDelete: null as string | null,
  backgroundMessages: new Map<string, ChatMessage[]>(),
  unreadConversations: new Set<string>(),
  viewingAgentMemory: null as AppState["viewingAgentMemory"],
  confirmingMemoryClear: false,
  collaborationTasks: null as AppState["collaborationTasks"],
  // Quick commands (Feature 19)
  commandPaletteVisible: false,
  commandFilter: "",
  commandIndex: 0,
  // Message search (Feature 4)
  searchOpen: false,
  searchQuery: "",
  searchResults: [] as string[],
  searchIndex: 0,
  // TaxStore marketplace
  taxstoreConnected: false,
  taxstoreToken: null as string | null,
  taxstoreUser: null as AppState["taxstoreUser"],
  taxstoreSkills: [] as AppState["taxstoreSkills"],
  taxstorePage: 1,
  taxstoreTotalPages: 1,
  taxstoreQuery: "",
  taxstoreCategory: "",
  taxstoreSort: "latest" as const,
  taxstoreLoading: false,
  taxstoreError: null as string | null,
  taxstoreInstalledIds: new Set<string>(),
  taxstoreUpdates: [] as AppState["taxstoreUpdates"],
  taxstoreLoginEmail: "",
  taxstoreLoginPassword: "",
  taxstoreInstallingId: null,
  taxstoreInstallStep: null,
  // Agent rental marketplace
  rentalActiveTab: "agents" as const,
  rentalPublishDialog: false,
  rentalPublishAgent: null,
  rentalPublishDraft: { price: 10, description: "", tags: [] as string[] },
  rentalMyListings: [] as AppState["rentalMyListings"],
  rentalPendingTasks: [] as AppState["rentalPendingTasks"],
  rentalActiveTask: null,
  rentalTaskResult: "",
  rentalTaskPanel: false,
  rentalPollingTimer: null,
  rentalAgentProcessing: false,
  rentalCompletedTasks: [] as AppState["rentalCompletedTasks"],
  rentalTaskListType: null,
  rentalTaskDetailView: null,
  rentalTaskAttachments: [] as File[],
  rentalTaskInstruction: "",
  rentalMessages: [] as AppState["rentalMessages"],
  rentalMessageInput: "",
  rentalMessagesOpen: false,
  // Client-submitted tasks (consult)
  consultMyTasks: [] as AppState["consultMyTasks"],
  consultUnreadCount: 0,
  consultPollingTimer: null,
  consultView: "list" as const,
  consultAgents: [] as AppState["consultAgents"],
  consultLoading: false,
  consultSearch: "",
  consultAvgTime: "",
  consultSelectedAgent: null,
  consultTaskTitle: "",
  consultTaskContent: "",
  consultSubmitting: false,
  consultSelectedTask: null,
  consultAttachments: [] as AppState["consultAttachments"],
  consultUploading: false,
  // Task detail features
  consultMessages: [] as AppState["consultMessages"],
  consultMessageInput: "",
  consultMessagesOpen: false,
  consultMessagesSending: false,
  consultRevisionOpen: false,
  consultRevisionText: "",
  consultRevisionSubmitting: false,
  consultRatingOpen: false,
  consultRatingValue: 0,
  consultRatingHover: 0,
  consultRatingComment: "",
  consultRatingSubmitting: false,
  // Global refresh
  refreshing: false,
  lastRefreshTime: null as number | null,
};

// ─── State Helpers ──────────────────────────────────────────────
export function isAnySending(): boolean {
  return state.activeRuns.size > 0;
}

export function isSessionBusy(sessionKey: string): boolean {
  return state.activeRuns.has(sessionKey);
}

export function findRunForEvent(evtSessionKey: string): ActiveRun | null {
  for (const run of state.activeRuns.values()) {
    if (evtSessionKey.endsWith(run.sessionKey) || evtSessionKey === run.sessionKey) {
      return run;
    }
  }
  // Also check default session
  if (evtSessionKey.endsWith(state.sessionKey)) {
    return state.activeRuns.get(state.sessionKey) || null;
  }
  return null;
}

/**
 * Get the messages array for a given session key.
 * Returns state.messages if it's the current conversation,
 * or the backgroundMessages entry if it's a background conversation.
 */
export function getMessagesForSession(sessionKey: string): ChatMessage[] {
  // Current conversation
  if (sessionKey === state.sessionKey) return state.messages;
  // Background conversation — extract convId from "taxchat-{convId}"
  const convId = sessionKey.startsWith("taxchat-") ? sessionKey.slice(8) : sessionKey;
  if (state.backgroundMessages.has(convId)) {
    return state.backgroundMessages.get(convId)!;
  }
  return state.messages; // fallback
}

/**
 * Check if a session key is for the currently active conversation.
 */
export function isCurrentSession(sessionKey: string): boolean {
  return sessionKey === state.sessionKey;
}
