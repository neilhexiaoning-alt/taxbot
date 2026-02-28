/**
 * TaxChat Gateway Connection & Event Handling
 */

import { GatewayBrowserClient } from "../src/ui/gateway";
import type { AssistantMessage } from "./types";
import { state, generateUUID, findRunForEvent, getMessagesForSession, isCurrentSession, scheduleRender } from "./state";
import { loadAgents } from "./agents";
import { syncManagedSkills } from "./skills";
import { extractMessageText, isSystemMessage, toolLabelMap } from "./utils";
import { finishSendingForRun, fetchCompleteResponse, isBadResponse } from "./chat";
import { enqueueStateUpdate } from "./update-queue";

// ─── Reconnection State ────────────────────────────────────────
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let isReconnecting = false;

export function cancelReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (reconnectTimer || isReconnecting) return;
  reconnectAttempt++;
  const delay = Math.min(2000 * reconnectAttempt, 10000);
  console.log(`[Reconnect] attempt ${reconnectAttempt} in ${delay}ms`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectGateway();
  }, delay);
}

// ─── Connect ───────────────────────────────────────────────────
export async function connectGateway() {
  isReconnecting = true;
  cancelReconnect();

  state.lastError = null;
  if (state.client) {
    state.client.stop();
    state.client = null;
  }

  let gatewayToken: string | undefined;
  try {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI?.getGatewayPort) {
      const port = await electronAPI.getGatewayPort();
      if (port && port !== 18789) {
        state.gatewayUrl = `ws://127.0.0.1:${port}`;
        console.log(`[Gateway] Using port ${port}`);
      }
    }
    if (electronAPI?.getGatewayToken) {
      gatewayToken = await electronAPI.getGatewayToken() || undefined;
    }
  } catch (_) { /* not in Electron */ }
  if (!gatewayToken) {
    const params = new URLSearchParams(window.location.search);
    gatewayToken = params.get("token") || undefined;
  }

  isReconnecting = false;

  state.client = new GatewayBrowserClient({
    url: state.gatewayUrl,
    clientName: "webchat-ui",
    mode: "webchat",
    token: gatewayToken,
    onHello: (hello) => {
      state.connected = true;
      state.hello = hello;
      state.lastError = null;
      reconnectAttempt = 0;
      cancelReconnect();
      scheduleRender();
      loadAgents();
    },
    onClose: ({ code }) => {
      state.connected = false;
      if (isReconnecting) return;
      if (code !== 1012) {
        state.lastError = `正在等待服务启动...`;
      }
      scheduleRender();
      scheduleReconnect();
    },
    onEvent: (evt) => {
      console.log("Gateway event:", evt.event, evt.payload);

      // Handle agent events (tool execution progress)
      if (evt.event === "agent") {
        const agentPayload = evt.payload as any;
        const evtSK = agentPayload?.sessionKey ? String(agentPayload.sessionKey) : "";
        const matchedRun = evtSK ? findRunForEvent(evtSK) : null;
        if (!matchedRun && evtSK) return;

        if (agentPayload?.stream === "tool" && agentPayload?.data) {
          const phase = agentPayload.data.phase;
          const toolName = agentPayload.data.name || "";
          if (phase === "start" && matchedRun) {
            enqueueStateUpdate(() => {
              matchedRun.toolsActive = (matchedRun.toolsActive || 0) + 1;
              matchedRun.thinkingLabel = toolLabelMap(toolName);
            });
          } else if (phase === "result" && matchedRun) {
            enqueueStateUpdate(() => {
              matchedRun.toolsActive = Math.max(0, (matchedRun.toolsActive || 0) - 1);
              matchedRun.thinkingLabel = "正在思考...";
            });
          }
        } else if (agentPayload?.stream === "lifecycle" && agentPayload?.data?.phase === "end") {
          if (matchedRun) {
            enqueueStateUpdate(() => {
              matchedRun.toolsActive = 0;
            });
            const runId = matchedRun.runId || agentPayload.runId || generateUUID();
            const runSK = matchedRun.sessionKey;
            setTimeout(() => {
              if (state.activeRuns.has(runSK)) {
                console.log("Lifecycle end triggered fetchCompleteResponse (safety net) for", runSK);
                enqueueStateUpdate(() => {
                  const r = state.activeRuns.get(runSK);
                  if (r) r.thinkingLabel = "正在整理回复...";
                });
                fetchCompleteResponse(runId, runSK);
              }
            }, 300);
          }
          setTimeout(() => syncManagedSkills(), 2000);
        } else if (agentPayload?.stream === "assistant") {
          if (matchedRun && matchedRun.thinkingLabel && matchedRun.thinkingLabel !== "正在思考...") {
            enqueueStateUpdate(() => {
              matchedRun.thinkingLabel = "正在思考...";
            });
          }
        }
      }

      // Handle chat events
      if (evt.event === "chat") {
        const payload = evt.payload as any;
        const evtSK = payload?.sessionKey ? String(payload.sessionKey) : "";
        const matchedRun = evtSK ? findRunForEvent(evtSK) : null;
        if (!matchedRun && evtSK) return;

        console.log("Chat message received:", payload.message, "state:", payload.state, "session:", evtSK);

        // Handle delta state (streaming message parts)
        if (payload.state === "delta" && payload?.message) {
          const text = typeof payload.message === "string"
            ? payload.message
            : extractMessageText(payload.message);

          if (text && !isSystemMessage(text) && matchedRun) {
            enqueueStateUpdate(() => {
              if (!matchedRun.runId && payload.runId) {
                matchedRun.runId = payload.runId;
              }
              const msgs = getMessagesForSession(matchedRun.sessionKey);
              const existingIdx = msgs.findIndex(m => m.type === "assistant" && m.id === payload.runId);
              if (existingIdx >= 0) {
                (msgs[existingIdx] as any).text = text;
              } else {
                msgs.push({
                  type: "assistant",
                  text: text,
                  timestamp: Date.now(),
                  id: payload.runId,
                  agentId: matchedRun.agentId || undefined,
                  agentEmoji: matchedRun.agentEmoji || undefined,
                  agentName: matchedRun.agentName || undefined,
                  agentAvatarUrl: matchedRun.agentAvatarUrl || undefined,
                });
              }
            });
          }
        }

        // Handle final state
        if (payload.state === "final" && matchedRun) {
          enqueueStateUpdate(() => {
            if (!matchedRun.runId && payload.runId) {
              matchedRun.runId = payload.runId;
            }

            if (matchedRun.runId && payload.runId !== matchedRun.runId) {
              console.log("Ignoring final from different run:", payload.runId, "expected:", matchedRun.runId);
              return;
            }

            let inlineText = "";
            if (payload?.message) {
              const t = typeof payload.message === "string"
                ? payload.message
                : extractMessageText(payload.message);
              if (t && !isSystemMessage(t)) {
                inlineText = t;
              }
            }

            if (inlineText) {
              const msgs = getMessagesForSession(matchedRun.sessionKey);
              const existingIdx = msgs.findIndex(m => m.type === "assistant" && m.id === payload.runId);
              if (existingIdx >= 0) {
                (msgs[existingIdx] as any).text = inlineText;
              } else {
                msgs.push({
                  type: "assistant",
                  text: inlineText,
                  timestamp: Date.now(),
                  id: payload.runId,
                  agentId: matchedRun.agentId || undefined,
                  agentEmoji: matchedRun.agentEmoji || undefined,
                  agentName: matchedRun.agentName || undefined,
                  agentAvatarUrl: matchedRun.agentAvatarUrl || undefined,
                });
              }
            }

            if (matchedRun.toolsActive > 0) {
              console.log("Tools still active (" + matchedRun.toolsActive + "), deferring fetchCompleteResponse for", matchedRun.sessionKey);
              return;
            }

            const runId = matchedRun.runId || payload.runId;
            if (inlineText && !isBadResponse(inlineText)) {
              console.log("[final] Inline text is good, finishing immediately for", matchedRun.sessionKey);
              finishSendingForRun(matchedRun.sessionKey);
            } else {
              console.log("[final] No good inline text, falling back to polling for", matchedRun.sessionKey);
              matchedRun.thinkingLabel = "正在整理回复...";
              fetchCompleteResponse(runId, matchedRun.sessionKey);
            }
          });
        }

        // Handle error state
        if (payload.state === "error" && matchedRun) {
          enqueueStateUpdate(() => {
            const msgs = getMessagesForSession(matchedRun.sessionKey);
            const errorText = payload.errorMessage || "处理请求时出错";
            msgs.push({
              type: "assistant",
              text: `错误：${errorText}`,
              timestamp: Date.now(),
              id: generateUUID(),
            });
            finishSendingForRun(matchedRun.sessionKey);
          });
        }
      }
    },
  });
  state.client.start();
}
