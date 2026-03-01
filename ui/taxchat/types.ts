/**
 * TaxChat Type Definitions
 */

import type { GatewayHelloOk } from "../src/ui/gateway";
import type { GatewayBrowserClient } from "../src/ui/gateway";

export interface UserMessage {
  type: "user";
  text: string;
  timestamp: number;
  id: string;
  attachments?: FileAttachment[];
  targetAgentNames?: string[]; // which agents this message was directed at (empty = main/default)
  replyToId?: string; // ID of the quoted/referenced message
}

export interface AssistantMessage {
  type: "assistant";
  text: string;
  timestamp: number;
  id: string;
  agentId?: string;
  agentEmoji?: string;
  agentName?: string;
  agentAvatarUrl?: string;
  replyToId?: string; // ID of the quoted/referenced message
}

export type ChatMessage = UserMessage | AssistantMessage;

export interface AgentEntry {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string;
  description: string;
  isDefault: boolean;
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface NotificationEntry {
  id: string;
  text: string;
  icon: string;
  timestamp: number;
  taskId?: string;
  read?: boolean;
  source?: "rental" | "consult";
}

export interface CustomSkill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  prompt: string;
  pinned: boolean;
  createdAt: number;
  folderName?: string;
  noFilePicker?: boolean;
  taxstoreSkillId?: string;   // linked TaxStore skill ID
  taxstoreVersion?: string;   // installed version from TaxStore
}

export interface ActiveRun {
  runId: string | null;
  sessionKey: string;
  agentId: string | null;
  agentName: string | null;
  agentEmoji: string | null;
  agentAvatarUrl: string | null;
  thinkingLabel: string;
  toolsActive: number;
  _retryCount: number;
  reactive: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  lastAccessedAt?: number;
}

export type AgentMention = { agentId: string; agentName: string; agentEmoji: string; isDefault: boolean };

export interface AppState {
  connected: boolean;
  hello: GatewayHelloOk | null;
  lastError: string | null;
  gatewayUrl: string;
  client: GatewayBrowserClient | null;
  sessionKey: string;
  messages: ChatMessage[];
  draft: string;
  activeRuns: Map<string, ActiveRun>;
  inputRef: HTMLTextAreaElement | null;
  attachments: FileAttachment[];
  dragOver: boolean;
  toolMessages?: unknown;
  stream?: unknown;
  streamStartedAt?: number;
  previewAttachment: FileAttachment | null;
  pendingSkill: { name: string; prompt: string; displayLabel: string } | null;
  favorites: Set<string>;
  favSearchQuery: string;
  sidebarCollapsed: boolean;
  sidePanel: "knowledge" | "skills" | "agents" | "favorites" | "conversations" | "settings" | "about" | "consult" | null;
  sidePanelWidth: number;
  skillsTab: "installed" | "market";
  confirmingClear: boolean;
  authorizedFolder: string | null;
  folderKnowledge: string | null;
  folderKnowledgeSent: boolean;
  importingFolder: boolean;
  importResult: string | null;
  lastSkillName: string | null;
  toastMessage: string | null;
  toastTimer: ReturnType<typeof setTimeout> | null;
  notifications: NotificationEntry[];
  panelTab: "favorites" | "notifications";
  customSkills: CustomSkill[];
  editingSkill: CustomSkill | null;
  activeCustomSkill: CustomSkill | null;
  showStatusMenu: boolean;
  showNotifications: boolean;
  notifDetail: NotificationEntry | null;
  knowledgeFiles: Array<{ name: string; size: number; ext: string; type: string; mtime?: number }>;
  knowledgeRefs: Array<{ name: string }>;
  knowledgeDragOver: boolean;
  knowledgeLoading: boolean;
  knowledgePreview: { name: string; type: string; content: string; url: string; loading: boolean; error: string | null; extractedText?: string; pdfTextMode?: boolean } | null;
  knowledgeQuoteBtn: { visible: boolean; x: number; y: number; text: string } | null;
  builtinSkillsCollapsed: boolean;
  filesSortBy: "time" | "name";
  skillsSortBy: "time" | "name";
  showQuickStart: boolean;
  settingsView: "main" | "model";
  fontSize: "small" | "medium" | "large" | "xlarge";
  modelList: Array<{ id: string; name: string; provider: string; contextWindow?: number; reasoning?: boolean }>;
  modelLoading: boolean;
  modelSaving: boolean;
  modelError: string | null;
  modelConfigDraft: {
    provider: string;
    baseUrl: string;
    apiKey: string;
    api: string;
    modelId: string;
  };
  configBaseHash: string | null;
  currentModelConfig: Record<string, any> | null;
  apiKeyVisible: boolean;
  activeModel: { provider: string; modelId: string; baseUrl: string; apiKey: string } | null;
  confirmingModelSave: boolean;
  confirmingSessionClear: boolean;
  confirmingExit: boolean;
  pendingDispatch: {
    targets: Array<{ sessionKey: string; agentId: string; agent: AgentEntry | null }>;
    finalMessage: string;
    apiAttachments: any[];
  } | null;
  agentsList: AgentEntry[];
  agentsLoading: boolean;
  creatingAgent: boolean;
  agentCreateDraft: { name: string; emoji: string; description: string; identityDesc: string; expertise: string; [key: string]: any };
  agentSaving: boolean;
  confirmingAgentDelete: string | null;
  editingAgentId?: string | null;
  mentionDropdownVisible: boolean;
  mentionFilter: string;
  mentionIndex: number;
  recentMentionIds: string[];
  lastSingleMentionAgent: { id: string; name: string } | null;
  replyingTo: ChatMessage | null;
  conversations: Conversation[];
  currentConversationId: string;
  renamingConversation: string | null;
  confirmingConvDelete: string | null;
  backgroundMessages: Map<string, ChatMessage[]>;
  unreadConversations: Set<string>;
  viewingAgentMemory: { agentId: string; agentName: string; content: string } | null;
  confirmingMemoryClear: boolean;
  collaborationTasks: Array<{
    agentId: string; agentName: string; agentEmoji: string;
    task: string; status: "pending" | "working" | "done" | "error";
    result?: string;
  }> | null;
  // Sequential collaboration queue — agents dispatched one-by-one
  collabQueue: Array<{ sessionKey: string; agentId: string; agent: AgentEntry | null }> | null;
  collabFinalMessage: string | null;
  collabApiAttachments: any[] | null;
  collabMainResponse: string | null;
  // Quick commands (Feature 19)
  commandPaletteVisible: boolean;
  commandFilter: string;
  commandIndex: number;
  // Message search (Feature 4)
  searchOpen: boolean;
  searchQuery: string;
  searchResults: string[];
  searchIndex: number;
  // TaxStore marketplace
  taxstoreConnected: boolean;
  taxstoreToken: string | null;
  taxstoreUser: { id: string; name: string; email: string; role: string; points: number } | null;
  taxstoreSkills: import("./taxstore-api").TaxStoreSkill[];
  taxstorePage: number;
  taxstoreTotalPages: number;
  taxstoreQuery: string;
  taxstoreCategory: string;
  taxstoreSort: "latest" | "popular";
  taxstoreLoading: boolean;
  taxstoreError: string | null;
  taxstoreInstalledIds: Set<string>;
  taxstoreUpdates: Array<{ skillId: string; name: string; localVersion: string; remoteVersion: string }>;
  taxstoreLoginEmail: string;
  taxstoreLoginPassword: string;
  taxstoreInstallingId: string | null;
  taxstoreInstallStep: "downloading" | "installing" | null;
  // Agent rental marketplace
  rentalActiveTab: "agents" | "tasks";
  rentalPublishDialog: boolean;
  rentalPublishAgent: AgentEntry | null;
  rentalPublishDraft: { price: number; description: string; tags: string[] };
  rentalMyListings: import("./taxstore-api").AgentListing[];
  rentalPendingTasks: import("./taxstore-api").AgentTask[];
  rentalActiveTask: import("./taxstore-api").AgentTask | null;
  rentalTaskResult: string;
  rentalTaskPanel: boolean;
  rentalPollingTimer: ReturnType<typeof setInterval> | null;
  rentalAgentProcessing: boolean;
  rentalCompletedTasks: import("./taxstore-api").AgentTask[];
  rentalTaskListType: "pending" | "completed" | null;
  rentalTaskDetailView: import("./taxstore-api").AgentTask | null;
  rentalTaskAttachments: File[];
  rentalTaskInstruction: string;
  // Messages
  rentalMessages: import("./taxstore-api").TaskMessage[];
  rentalMessageInput: string;
  rentalMessagesOpen: boolean;
  // Client-submitted tasks (consult)
  consultMyTasks: import("./taxstore-api").AgentTask[];
  consultUnreadCount: number;
  consultPollingTimer: ReturnType<typeof setInterval> | null;
  consultView: "list" | "detail" | "my-tasks" | "task-detail";
  consultAgents: import("./taxstore-api").AgentListing[];
  consultLoading: boolean;
  consultSearch: string;
  consultAvgTime: string;
  consultSelectedAgent: import("./taxstore-api").AgentListing | null;
  consultTaskTitle: string;
  consultTaskContent: string;
  consultSubmitting: boolean;
  consultSelectedTask: import("./taxstore-api").AgentTask | null;
  consultAttachments: import("./taxstore-api").TaskAttachmentMeta[];
  consultUploading: boolean;
  // Task detail features
  consultMessages: import("./taxstore-api").TaskMessage[];
  consultMessageInput: string;
  consultMessagesOpen: boolean;
  consultMessagesSending: boolean;
  consultRevisionOpen: boolean;
  consultRevisionText: string;
  consultRevisionSubmitting: boolean;
  consultRatingOpen: boolean;
  consultRatingValue: number;
  consultRatingHover: number;
  consultRatingComment: string;
  consultRatingSubmitting: boolean;
  // Global refresh
  refreshing: boolean;
  lastRefreshTime: number | null;
  // Version update
  updateAvailable: { version: string; changelog: string; downloadUrl: string } | null;
  updateChecking: boolean;
  // License / authorization
  licenseStatus: "checking" | "trial" | "licensed" | "expired";
  licenseExpiresAt: number | null;
  trialStartedAt: number | null;
  licenseCode: string | null;
  licenseView: "status" | "activate" | "apply";
  licenseActivateCode: string;
  licenseActivating: boolean;
  licenseApplyForm: { email: string; phone: string; reason: string; period: string };
  licenseApplying: boolean;
  licenseApplyResult: "success" | "error" | null;
}
