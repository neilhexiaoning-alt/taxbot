/**
 * TaxChat Virtual Scrolling — only renders visible messages for performance.
 *
 * Strategy: estimated heights with measurement cache + overscan buffer.
 * Non-virtual elements (thinking indicators, collab cards) are always rendered.
 */

import type { ChatMessage } from "./types";
import { state, scheduleRender } from "./state";

// ─── Height Estimation ────────────────────────────────────────
const DEFAULT_USER_HEIGHT = 70;
const DEFAULT_ASSISTANT_HEIGHT = 140;
const OVERSCAN = 5; // extra items above/below viewport

const measuredHeights = new Map<string, number>();

function estimateHeight(msg: ChatMessage): number {
  if (msg.id && measuredHeights.has(msg.id)) return measuredHeights.get(msg.id)!;
  return msg.type === "user" ? DEFAULT_USER_HEIGHT : DEFAULT_ASSISTANT_HEIGHT;
}

// ─── Virtual Range Calculation ────────────────────────────────
export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  topPadding: number;
  bottomPadding: number;
  totalHeight: number;
}

/**
 * Calculate which messages should be rendered given the scroll position.
 */
export function calculateVirtualRange(
  messages: ChatMessage[],
  scrollTop: number,
  containerHeight: number,
): VirtualRange {
  if (messages.length === 0) {
    return { startIndex: 0, endIndex: 0, topPadding: 0, bottomPadding: 0, totalHeight: 0 };
  }

  // If fewer than 40 messages, render all (no virtualization needed)
  if (messages.length < 40) {
    return {
      startIndex: 0,
      endIndex: messages.length,
      topPadding: 0,
      bottomPadding: 0,
      totalHeight: messages.reduce((sum, m) => sum + estimateHeight(m), 0),
    };
  }

  // Calculate cumulative heights
  let totalHeight = 0;
  const offsets: number[] = [];
  for (const msg of messages) {
    offsets.push(totalHeight);
    totalHeight += estimateHeight(msg);
  }

  // Find visible range
  let startIndex = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i] + estimateHeight(messages[i]) >= scrollTop) {
      startIndex = i;
      break;
    }
  }

  let endIndex = startIndex;
  for (let i = startIndex; i < messages.length; i++) {
    endIndex = i + 1;
    if (offsets[i] > scrollTop + containerHeight) break;
  }

  // Apply overscan
  startIndex = Math.max(0, startIndex - OVERSCAN);
  endIndex = Math.min(messages.length, endIndex + OVERSCAN);

  // Calculate paddings
  const topPadding = offsets[startIndex] || 0;
  let bottomPadding = 0;
  for (let i = endIndex; i < messages.length; i++) {
    bottomPadding += estimateHeight(messages[i]);
  }

  return { startIndex, endIndex, topPadding, bottomPadding, totalHeight };
}

// ─── Height Measurement ──────────────────────────────────────
/**
 * Measure rendered message heights from DOM and update cache.
 * Called after render to improve accuracy for subsequent frames.
 */
export function measureRenderedHeights() {
  const container = document.getElementById("messages-container");
  if (!container) return;

  const elements = container.querySelectorAll("[data-msg-id]");
  for (const el of elements) {
    const id = el.getAttribute("data-msg-id");
    if (!id) continue;
    const height = (el as HTMLElement).offsetHeight;
    if (height > 0) {
      measuredHeights.set(id, height);
    }
  }
}

// ─── Auto Scroll ─────────────────────────────────────────────
let wasAtBottom = true;

/** Check if user is scrolled near the bottom */
export function checkAtBottom(container: HTMLElement): boolean {
  const threshold = 80;
  wasAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  return wasAtBottom;
}

/** Scroll to bottom if user was previously at bottom */
export function autoScrollToBottom(container: HTMLElement) {
  if (wasAtBottom) {
    container.scrollTop = container.scrollHeight;
  }
}

/** Force scroll to bottom (e.g., new message from user) */
export function forceScrollToBottom() {
  wasAtBottom = true;
  const container = document.getElementById("messages-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/** Clear height cache (e.g., when switching conversations) */
export function clearHeightCache() {
  measuredHeights.clear();
}
