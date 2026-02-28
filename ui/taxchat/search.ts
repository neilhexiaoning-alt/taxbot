/**
 * TaxChat Message Search — Ctrl+F in-conversation search
 */

import { state, scheduleRender } from "./state";

export function openSearch() {
  state.searchOpen = true;
  state.searchQuery = "";
  state.searchResults = [];
  state.searchIndex = 0;
  scheduleRender();
  // Focus the search input after render
  setTimeout(() => {
    const input = document.getElementById("taxchat-search-input") as HTMLInputElement | null;
    input?.focus();
  }, 50);
}

export function closeSearch() {
  state.searchOpen = false;
  state.searchQuery = "";
  state.searchResults = [];
  state.searchIndex = 0;
  scheduleRender();
}

export function performSearch(query: string) {
  state.searchQuery = query;
  if (!query.trim()) {
    state.searchResults = [];
    state.searchIndex = 0;
    scheduleRender();
    return;
  }

  const q = query.toLowerCase();
  const results: string[] = [];
  for (const msg of state.messages) {
    if (msg.text && msg.text.toLowerCase().includes(q) && msg.id) {
      results.push(msg.id);
    }
  }
  state.searchResults = results;
  state.searchIndex = results.length > 0 ? 0 : -1;
  scheduleRender();

  if (results.length > 0) {
    scrollToSearchResult();
  }
}

export function nextResult() {
  if (state.searchResults.length === 0) return;
  state.searchIndex = (state.searchIndex + 1) % state.searchResults.length;
  scheduleRender();
  scrollToSearchResult();
}

export function prevResult() {
  if (state.searchResults.length === 0) return;
  state.searchIndex = (state.searchIndex - 1 + state.searchResults.length) % state.searchResults.length;
  scheduleRender();
  scrollToSearchResult();
}

function scrollToSearchResult() {
  const msgId = state.searchResults[state.searchIndex];
  if (!msgId) return;
  const el = document.querySelector(`[data-msg-id="${msgId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("search-highlight");
    setTimeout(() => el.classList.remove("search-highlight"), 2000);
  }
}

/** Check if a message is in current search results */
export function isSearchHit(msgId: string): boolean {
  return state.searchResults.includes(msgId);
}

/** Check if a message is the currently focused search result */
export function isSearchFocused(msgId: string): boolean {
  return state.searchResults[state.searchIndex] === msgId;
}
