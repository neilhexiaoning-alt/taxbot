/**
 * TaxChat State Update Queue — serializes concurrent state mutations
 * to prevent race conditions when multiple agents respond simultaneously.
 */

import { scheduleRender } from "./state";

let queue: (() => void)[] = [];
let processing = false;

/**
 * Enqueue a state update function to be processed sequentially.
 * All queued updates run in order via microtask, then a single render is triggered.
 */
export function enqueueStateUpdate(fn: () => void) {
  queue.push(fn);
  if (!processing) {
    processing = true;
    queueMicrotask(processQueue);
  }
}

function processQueue() {
  while (queue.length > 0) {
    const fn = queue.shift()!;
    try { fn(); } catch (e) { console.error("[UpdateQueue] Error in queued update:", e); }
  }
  processing = false;
  scheduleRender();
}
