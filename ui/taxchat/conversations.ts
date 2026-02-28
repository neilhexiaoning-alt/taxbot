/**
 * TaxChat Conversation Management
 */

import type { Conversation } from "./types";
import { state, generateUUID, scheduleRender, setForceScrollBottom } from "./state";
import {
  loadConversations,
  saveConversations,
  loadMessagesForConversation,
  loadMessagesAsync,
  loadFavoritesForConversation,
  saveFavorites,
  saveMessages,
  flushPendingSave,
  deleteConversationData,
  migrateOldMessages,
} from "./persistence";
import { clearHeightCache } from "./virtual-scroll";
import { MESSAGES_STORAGE_KEY, CURRENT_CONV_KEY } from "./constants";

/** Remove favorite IDs that reference messages no longer in state.messages */
function pruneOrphanedFavorites() {
  const msgIds = new Set(state.messages.map(m => m.id));
  let changed = false;
  for (const favId of state.favorites) {
    if (!msgIds.has(favId)) {
      state.favorites.delete(favId);
      changed = true;
    }
  }
  if (changed) saveFavorites();
}

// ─── Conversation CRUD ─────────────────────────────────────────

export function createConversation() {
  flushPendingSave();
  saveMessages();

  const convId = generateUUID();
  const now = Date.now();
  const conv: Conversation = {
    id: convId,
    title: "新对话",
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    lastAccessedAt: now,
  };
  state.conversations.unshift(conv);
  saveConversations();
  switchConversation(convId);
}

export function switchConversation(convId: string) {
  if (convId === state.currentConversationId) return;

  flushPendingSave();
  saveMessages();

  const oldConvId = state.currentConversationId;
  const oldSessionKey = state.sessionKey;

  // If the old conversation has active runs, keep them alive by moving messages to background
  const hasActiveRunsForOld = [...state.activeRuns.values()].some(r => r.sessionKey === oldSessionKey);
  if (hasActiveRunsForOld) {
    state.backgroundMessages.set(oldConvId, [...state.messages]);
  }

  // Only clear runs that belong to the OLD session if there are NONE active
  if (!hasActiveRunsForOld) {
    // Clear old session's runs only
    for (const [sk] of state.activeRuns) {
      if (sk === oldSessionKey) state.activeRuns.delete(sk);
    }
  }

  state.replyingTo = null;
  state.pendingDispatch = null;

  state.currentConversationId = convId;
  state.sessionKey = `taxchat-${convId}`;

  // If background messages exist for the new conversation, use them (they're more up-to-date)
  if (state.backgroundMessages.has(convId)) {
    state.messages = state.backgroundMessages.get(convId)!;
    state.backgroundMessages.delete(convId);
  } else {
    state.messages = loadMessagesForConversation(convId);
  }

  state.favorites = loadFavoritesForConversation(convId);
  pruneOrphanedFavorites();
  state.unreadConversations.delete(convId);
  // Update lastAccessedAt for sort-by-click ordering
  const targetConv = state.conversations.find(c => c.id === convId);
  if (targetConv) targetConv.lastAccessedAt = Date.now();
  saveConversations();
  localStorage.setItem(CURRENT_CONV_KEY, convId);
  clearHeightCache();
  setForceScrollBottom(true);
  scheduleRender();

  // If localStorage was empty, try recovering from IndexedDB
  if (state.messages.length === 0) {
    loadMessagesAsync(convId).then(msgs => {
      if (msgs.length > 0 && state.currentConversationId === convId) {
        state.messages = msgs;
        pruneOrphanedFavorites();
        clearHeightCache();
        setForceScrollBottom(true);
        scheduleRender();
      }
    });
  }
}

export function deleteConversation(convId: string) {
  state.conversations = state.conversations.filter(c => c.id !== convId);

  deleteConversationData(convId);

  if (convId === state.currentConversationId) {
    if (state.conversations.length === 0) {
      createConversation();
    } else {
      switchConversation(state.conversations[0].id);
    }
  }

  saveConversations();
  state.confirmingConvDelete = null;
  scheduleRender();
}

export function renameConversation(convId: string, newTitle: string) {
  const conv = state.conversations.find(c => c.id === convId);
  if (conv) {
    conv.title = newTitle.trim() || "新对话";
    saveConversations();
  }
  state.renamingConversation = null;
  scheduleRender();
}

/** Auto-generate title from first user message (called after first message sent) */
export function autoTitleConversation() {
  const conv = state.conversations.find(c => c.id === state.currentConversationId);
  if (!conv || conv.title !== "新对话") return;

  const firstUserMsg = state.messages.find(m => m.type === "user");
  if (firstUserMsg) {
    const text = firstUserMsg.text.replace(/\n/g, " ").trim();
    conv.title = text.slice(0, 20) + (text.length > 20 ? "..." : "");
    saveConversations();
  }
}

// ─── Init ──────────────────────────────────────────────────────
/** Initialize conversations (migrate old data if needed). Called once at startup. */
export function initConversations() {
  let convs = loadConversations();
  let currentId = localStorage.getItem(CURRENT_CONV_KEY) || "";

  if (convs.length === 0) {
    const oldRaw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (oldRaw) {
      const migrated = migrateOldMessages();
      convs = migrated.conversations;
      currentId = migrated.currentId;
    } else {
      const convId = generateUUID();
      convs = [{
        id: convId,
        title: "新对话",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 0,
      }];
      currentId = convId;
    }
    state.conversations = convs;
    state.currentConversationId = currentId;
    saveConversations();
    localStorage.setItem(CURRENT_CONV_KEY, currentId);
  } else {
    state.conversations = convs;
    if (!convs.find(c => c.id === currentId)) {
      currentId = convs[0].id;
    }
    state.currentConversationId = currentId;
  }

  state.messages = loadMessagesForConversation(currentId);
  state.favorites = loadFavoritesForConversation(currentId);
  pruneOrphanedFavorites();
  state.sessionKey = `taxchat-${currentId}`;

  // If localStorage was empty (e.g., IDB migration deleted keys), try recovering from IndexedDB
  if (state.messages.length === 0) {
    loadMessagesAsync(currentId).then(msgs => {
      if (msgs.length > 0 && state.currentConversationId === currentId) {
        state.messages = msgs;
        pruneOrphanedFavorites();
        clearHeightCache();
        setForceScrollBottom(true);
        scheduleRender();
      }
    });
  }
}
