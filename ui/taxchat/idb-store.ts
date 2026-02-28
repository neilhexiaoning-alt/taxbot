/**
 * TaxChat IndexedDB Store — persistent message storage with localStorage fallback
 */

import type { ChatMessage } from "./types";

const DB_NAME = "taxbot_db";
const DB_VERSION = 1;
const MESSAGES_STORE = "messages";
const META_STORE = "meta";

let dbInstance: IDBDatabase | null = null;
let dbFailed = false;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbFailed) return Promise.reject(new Error("IndexedDB unavailable"));

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
          db.createObjectStore(MESSAGES_STORE);
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE);
        }
      };
      request.onsuccess = () => {
        dbInstance = request.result;
        dbInstance.onclose = () => { dbInstance = null; };
        resolve(dbInstance);
      };
      request.onerror = () => {
        dbFailed = true;
        reject(request.error);
      };
    } catch (e) {
      dbFailed = true;
      reject(e);
    }
  });
}

export async function saveMessagesToIDB(convId: string, messages: ChatMessage[]): Promise<void> {
  const db = await openDB();
  const toSave = messages.slice(-200);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MESSAGES_STORE, "readwrite");
    tx.objectStore(MESSAGES_STORE).put(toSave, convId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadMessagesFromIDB(convId: string): Promise<ChatMessage[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MESSAGES_STORE, "readonly");
      const req = tx.objectStore(MESSAGES_STORE).get(convId);
      req.onsuccess = () => {
        const result = req.result;
        resolve(Array.isArray(result) ? result : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteConversationFromIDB(convId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MESSAGES_STORE, "readwrite");
      tx.objectStore(MESSAGES_STORE).delete(convId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // silently fail
  }
}

/**
 * Migrate all conversations from localStorage to IndexedDB.
 * Sets a flag so migration only runs once.
 */
export async function migrateToIDB(conversationIds: string[]): Promise<boolean> {
  if (localStorage.getItem("taxbot_idb_migrated") === "1") return true;
  try {
    const db = await openDB();
    for (const convId of conversationIds) {
      const key = `taxbot_messages_${convId}`;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const messages = JSON.parse(raw);
        if (Array.isArray(messages)) {
          await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(MESSAGES_STORE, "readwrite");
            tx.objectStore(MESSAGES_STORE).put(messages.slice(-200), convId);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          });
        }
      } catch { /* skip corrupt entries */ }
    }
    localStorage.setItem("taxbot_idb_migrated", "1");
    // Keep localStorage keys as fallback — do NOT delete them
    console.log(`[IDB] Migrated ${conversationIds.length} conversations to IndexedDB`);
    return true;
  } catch (e) {
    console.warn("[IDB] Migration failed, using localStorage fallback:", e);
    return false;
  }
}

/** Check if IndexedDB is available and working */
export function isIDBAvailable(): boolean {
  return !dbFailed;
}
