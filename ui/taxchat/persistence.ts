/**
 * TaxChat Persistence — localStorage + IndexedDB storage with debounced saves
 */

import type { ChatMessage, Conversation, NotificationEntry, CustomSkill } from "./types";
import { state } from "./state";
import { generateUUID } from "./state";
import {
  FAVORITES_STORAGE_KEY,
  MESSAGES_STORAGE_KEY,
  NOTIFICATIONS_STORAGE_KEY,
  CUSTOM_SKILLS_STORAGE_KEY,
  CONVERSATIONS_STORAGE_KEY,
  CURRENT_CONV_KEY,
} from "./constants";
import { saveMessagesToIDB, loadMessagesFromIDB, deleteConversationFromIDB, migrateToIDB, isIDBAvailable } from "./idb-store";

// Track whether IDB migration has completed
let idbReady = false;

// ─── Conversation Storage ──────────────────────────────────────
export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveConversations() {
  try {
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(state.conversations));
  } catch {}
}

export function loadMessagesForConversation(convId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`taxbot_messages_${convId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Load messages with IDB priority, falling back to localStorage.
 * Always tries IDB if available (regardless of migration status).
 */
export async function loadMessagesAsync(convId: string): Promise<ChatMessage[]> {
  if (isIDBAvailable()) {
    try {
      const idbMessages = await loadMessagesFromIDB(convId);
      if (idbMessages && idbMessages.length > 0) return idbMessages;
    } catch { /* fall through to localStorage */ }
  }
  return loadMessagesForConversation(convId);
}

export function saveMessagesForConversation(convId: string, messages: ChatMessage[]) {
  const toSave = messages.slice(-200);
  // Always write to localStorage (sync, reliable)
  try { localStorage.setItem(`taxbot_messages_${convId}`, JSON.stringify(toSave)); } catch {}
  // Also write to IDB if available (async, for large datasets)
  if (idbReady && isIDBAvailable()) {
    saveMessagesToIDB(convId, toSave).catch(() => {});
  }
}

export function loadFavoritesForConversation(convId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`taxbot_favorites_${convId}`);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export function saveFavoritesForConversation(convId: string, favorites: Set<string>) {
  try {
    localStorage.setItem(`taxbot_favorites_${convId}`, JSON.stringify([...favorites]));
  } catch {}
}

// ─── Legacy Single-conversation Storage ────────────────────────
export function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

// ─── Save Current State ────────────────────────────────────────
export function saveMessages() {
  try {
    saveMessagesForConversation(state.currentConversationId, state.messages);
    const conv = state.conversations.find(c => c.id === state.currentConversationId);
    if (conv) {
      conv.updatedAt = Date.now();
      conv.messageCount = state.messages.length;
      saveConversations();
    }
  } catch {}
}

// ─── Debounced Save ────────────────────────────────────────────
let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced version of saveMessages — coalesces rapid saves (e.g., from
 * multiple agent completions) into a single write after 2 seconds.
 * For critical operations (conversation switch, user-initiated clear),
 * use saveMessages() directly instead.
 */
export function debouncedSaveMessages() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveMessages();
  }, 2000);
}

/** Flush any pending debounced save immediately */
export function flushPendingSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
    saveMessages();
  }
}

export function saveFavorites() {
  try {
    saveFavoritesForConversation(state.currentConversationId, state.favorites);
  } catch {}
  syncFavoritesToMemory();
}

/** Sync favorited messages to agent memory file so the bot can recall them */
function syncFavoritesToMemory() {
  const api = (window as any).electronAPI;
  if (!api?.syncFavoritesToMemory) return;

  const favMsgs: Array<{ text: string; timestamp: number; question?: string }> = [];
  for (const msgId of state.favorites) {
    const idx = state.messages.findIndex(m => m.id === msgId);
    if (idx < 0) continue;
    const msg = state.messages[idx];
    if (msg.type !== "assistant") continue;
    let question: string | undefined;
    for (let j = idx - 1; j >= 0; j--) {
      if (state.messages[j].type === "user") {
        question = state.messages[j].text;
        break;
      }
    }
    favMsgs.push({ text: msg.text, timestamp: msg.timestamp, question });
  }
  api.syncFavoritesToMemory(favMsgs).catch(() => {});
}

// ─── Delete Conversation from IDB ──────────────────────────────
export function deleteConversationData(convId: string) {
  localStorage.removeItem(`taxbot_messages_${convId}`);
  localStorage.removeItem(`taxbot_favorites_${convId}`);
  if (idbReady && isIDBAvailable()) {
    deleteConversationFromIDB(convId).catch(() => {});
  }
}

// ─── Notifications ─────────────────────────────────────────────
export function loadNotifications(): NotificationEntry[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

export function saveNotifications() {
  const toSave = state.notifications.slice(-50);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(toSave));
}

// ─── Custom Skills ─────────────────────────────────────────────
export function loadCustomSkills(): CustomSkill[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SKILLS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

export function saveCustomSkills() {
  localStorage.setItem(CUSTOM_SKILLS_STORAGE_KEY, JSON.stringify(state.customSkills));
}

// ─── Migration ─────────────────────────────────────────────────
/**
 * Migrate old single-conversation storage to new multi-conversation format.
 * Called once on startup if no conversations exist yet but old messages do.
 */
export function migrateOldMessages(): { conversations: Conversation[]; currentId: string } {
  const oldMessages = loadMessages();
  const oldFavorites = loadFavorites();
  const convId = generateUUID();
  const now = Date.now();

  const firstUserMsg = oldMessages.find(m => m.type === "user");
  const title = firstUserMsg
    ? firstUserMsg.text.replace(/\n/g, " ").slice(0, 20) + (firstUserMsg.text.length > 20 ? "..." : "")
    : "默认对话";

  const conv: Conversation = {
    id: convId,
    title,
    createdAt: oldMessages.length > 0 ? oldMessages[0].timestamp : now,
    updatedAt: oldMessages.length > 0 ? oldMessages[oldMessages.length - 1].timestamp : now,
    messageCount: oldMessages.length,
  };

  if (oldMessages.length > 0) {
    saveMessagesForConversation(convId, oldMessages);
  }
  if (oldFavorites.size > 0) {
    saveFavoritesForConversation(convId, oldFavorites);
  }

  return { conversations: [conv], currentId: convId };
}

// ─── Init ──────────────────────────────────────────────────────
// Populate state fields that depend on localStorage
export function initPersistence() {
  state.notifications = loadNotifications();
  state.customSkills = loadCustomSkills();

  // Attempt IndexedDB migration in background (non-blocking)
  const convIds = state.conversations.map(c => c.id);
  if (convIds.length === 0) {
    // No conversations yet — will migrate after they're loaded
    const loaded = loadConversations();
    if (loaded.length > 0) {
      migrateToIDB(loaded.map(c => c.id))
        .then(ok => { idbReady = ok; })
        .catch(() => { idbReady = false; });
    } else {
      idbReady = true; // No data to migrate
    }
  } else {
    migrateToIDB(convIds)
      .then(ok => { idbReady = ok; })
      .catch(() => { idbReady = false; });
  }
}
