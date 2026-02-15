import { normalizeVerboseLevel } from "../auto-reply/thinking.js";
import { loadConfig } from "../config/config.js";
import { getAgentRunContext } from "../infra/agent-events.js";
import { resolveHeartbeatVisibility } from "../infra/heartbeat-visibility.js";
import { loadSessionEntry } from "./session-utils.js";
import { formatForLog } from "./ws-log.js";
/**
 * Check if webchat broadcasts should be suppressed for heartbeat runs.
 * Returns true if the run is a heartbeat and showOk is false.
 */
function shouldSuppressHeartbeatBroadcast(runId) {
    const runContext = getAgentRunContext(runId);
    if (!runContext?.isHeartbeat) {
        return false;
    }
    try {
        const cfg = loadConfig();
        const visibility = resolveHeartbeatVisibility({ cfg, channel: "webchat" });
        return !visibility.showOk;
    }
    catch {
        // Default to suppressing if we can't load config
        return true;
    }
}
export function createChatRunRegistry() {
    const chatRunSessions = new Map();
    const add = (sessionId, entry) => {
        const queue = chatRunSessions.get(sessionId);
        if (queue) {
            queue.push(entry);
        }
        else {
            chatRunSessions.set(sessionId, [entry]);
        }
    };
    const peek = (sessionId) => chatRunSessions.get(sessionId)?.[0];
    const shift = (sessionId) => {
        const queue = chatRunSessions.get(sessionId);
        if (!queue || queue.length === 0) {
            return undefined;
        }
        const entry = queue.shift();
        if (!queue.length) {
            chatRunSessions.delete(sessionId);
        }
        return entry;
    };
    const remove = (sessionId, clientRunId, sessionKey) => {
        const queue = chatRunSessions.get(sessionId);
        if (!queue || queue.length === 0) {
            return undefined;
        }
        const idx = queue.findIndex((entry) => entry.clientRunId === clientRunId && (sessionKey ? entry.sessionKey === sessionKey : true));
        if (idx < 0) {
            return undefined;
        }
        const [entry] = queue.splice(idx, 1);
        if (!queue.length) {
            chatRunSessions.delete(sessionId);
        }
        return entry;
    };
    const clear = () => {
        chatRunSessions.clear();
    };
    return { add, peek, shift, remove, clear };
}
export function createChatRunState() {
    const registry = createChatRunRegistry();
    const buffers = new Map();
    const deltaSentAt = new Map();
    const abortedRuns = new Map();
    const clear = () => {
        registry.clear();
        buffers.clear();
        deltaSentAt.clear();
        abortedRuns.clear();
    };
    return {
        registry,
        buffers,
        deltaSentAt,
        abortedRuns,
        clear,
    };
}
export function createAgentEventHandler({ broadcast, nodeSendToSession, agentRunSeq, chatRunState, resolveSessionKeyForRun, clearAgentRunContext, }) {
    // Track text from completed turns so multi-turn responses (text → tool_call → text)
    // accumulate correctly without garbling.
    const turnBases = new Map();
    const emitChatDelta = (sessionKey, clientRunId, seq, text) => {
        console.log(`[chat-delta] sessionKey=${sessionKey} textLen=${text?.length ?? 0} seq=${seq} runId=${clientRunId?.slice(0, 8)}`);
        const prevBuffer = chatRunState.buffers.get(clientRunId) ?? "";
        const base = turnBases.get(clientRunId) ?? "";
        // Compare new text against just the CURRENT turn's text (not the full buffer)
        const prevTurnText = base ? prevBuffer.slice(base.length + 2) : prevBuffer;
        let accumulated;
        if (prevTurnText &&
            text.length < prevTurnText.length &&
            !prevTurnText.startsWith(text)) {
            // New turn detected: save current buffer as the base for previous turns
            turnBases.set(clientRunId, prevBuffer);
            accumulated = prevBuffer + "\n\n" + text;
        }
        else if (base) {
            // Continuing current turn after a previous turn boundary
            accumulated = base + "\n\n" + text;
        }
        else {
            // Normal streaming within the first turn
            accumulated = text;
        }
        chatRunState.buffers.set(clientRunId, accumulated);
        const now = Date.now();
        const last = chatRunState.deltaSentAt.get(clientRunId) ?? 0;
        if (now - last < 150) {
            return;
        }
        chatRunState.deltaSentAt.set(clientRunId, now);
        const payload = {
            runId: clientRunId,
            sessionKey,
            seq,
            state: "delta",
            message: {
                role: "assistant",
                content: [{ type: "text", text: accumulated }],
                timestamp: now,
            },
        };
        // Suppress webchat broadcast for heartbeat runs when showOk is false
        if (!shouldSuppressHeartbeatBroadcast(clientRunId)) {
            broadcast("chat", payload, { dropIfSlow: true });
        }
        nodeSendToSession(sessionKey, "chat", payload);
    };
    const emitChatFinal = (sessionKey, clientRunId, seq, jobState, error) => {
        const text = chatRunState.buffers.get(clientRunId)?.trim() ?? "";
        console.log(`[chat-final] sessionKey=${sessionKey} state=${jobState} textLen=${text.length} seq=${seq} runId=${clientRunId?.slice(0, 8)} error=${error ? "yes" : "no"}`);
        chatRunState.buffers.delete(clientRunId);
        chatRunState.deltaSentAt.delete(clientRunId);
        turnBases.delete(clientRunId);
        if (jobState === "done") {
            const payload = {
                runId: clientRunId,
                sessionKey,
                seq,
                state: "final",
                message: text
                    ? {
                        role: "assistant",
                        content: [{ type: "text", text }],
                        timestamp: Date.now(),
                    }
                    : undefined,
            };
            // Suppress webchat broadcast for heartbeat runs when showOk is false
            if (!shouldSuppressHeartbeatBroadcast(clientRunId)) {
                broadcast("chat", payload);
            }
            nodeSendToSession(sessionKey, "chat", payload);
            return;
        }
        const payload = {
            runId: clientRunId,
            sessionKey,
            seq,
            state: "error",
            errorMessage: error ? formatForLog(error) : undefined,
        };
        broadcast("chat", payload);
        nodeSendToSession(sessionKey, "chat", payload);
    };
    const shouldEmitToolEvents = (runId, sessionKey) => {
        const runContext = getAgentRunContext(runId);
        const runVerbose = normalizeVerboseLevel(runContext?.verboseLevel);
        if (runVerbose) {
            return runVerbose === "on";
        }
        if (!sessionKey) {
            return false;
        }
        try {
            const { cfg, entry } = loadSessionEntry(sessionKey);
            const sessionVerbose = normalizeVerboseLevel(entry?.verboseLevel);
            if (sessionVerbose) {
                return sessionVerbose === "on";
            }
            const defaultVerbose = normalizeVerboseLevel(cfg.agents?.defaults?.verboseDefault);
            return defaultVerbose === "on";
        }
        catch {
            return false;
        }
    };
    return (evt) => {
        const chatLink = chatRunState.registry.peek(evt.runId);
        const sessionKey = chatLink?.sessionKey ?? resolveSessionKeyForRun(evt.runId);
        const clientRunId = chatLink?.clientRunId ?? evt.runId;
        const isAborted = chatRunState.abortedRuns.has(clientRunId) || chatRunState.abortedRuns.has(evt.runId);
        // Diagnostic: trace assistant and lifecycle events for debugging UI display issues
        if (evt.stream === "assistant" || evt.stream === "lifecycle") {
            const textLen = typeof evt.data?.text === "string" ? evt.data.text.length : -1;
            const phase = evt.data?.phase ?? "";
            console.log(`[chat-event-trace] stream=${evt.stream} seq=${evt.seq} sessionKey=${sessionKey ?? "NONE"} chatLink=${!!chatLink} isAborted=${isAborted} textLen=${textLen} phase=${phase} runId=${evt.runId?.slice(0, 8)}`);
        }
        // Include sessionKey so Control UI can filter tool streams per session.
        const agentPayload = sessionKey ? { ...evt, sessionKey } : evt;
        const last = agentRunSeq.get(evt.runId) ?? 0;
        if (evt.stream === "tool" && !shouldEmitToolEvents(evt.runId, sessionKey)) {
            agentRunSeq.set(evt.runId, evt.seq);
            return;
        }
        if (evt.seq !== last + 1) {
            broadcast("agent", {
                runId: evt.runId,
                stream: "error",
                ts: Date.now(),
                sessionKey,
                data: {
                    reason: "seq gap",
                    expected: last + 1,
                    received: evt.seq,
                },
            });
        }
        agentRunSeq.set(evt.runId, evt.seq);
        broadcast("agent", agentPayload);
        const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
        if (sessionKey) {
            nodeSendToSession(sessionKey, "agent", agentPayload);
            if (!isAborted && evt.stream === "assistant" && typeof evt.data?.text === "string") {
                emitChatDelta(sessionKey, clientRunId, evt.seq, evt.data.text);
            }
            else if (!isAborted && (lifecyclePhase === "end" || lifecyclePhase === "error")) {
                if (chatLink) {
                    const finished = chatRunState.registry.shift(evt.runId);
                    if (!finished) {
                        clearAgentRunContext(evt.runId);
                        return;
                    }
                    emitChatFinal(finished.sessionKey, finished.clientRunId, evt.seq, lifecyclePhase === "error" ? "error" : "done", evt.data?.error);
                }
                else {
                    emitChatFinal(sessionKey, evt.runId, evt.seq, lifecyclePhase === "error" ? "error" : "done", evt.data?.error);
                }
            }
            else if (isAborted && (lifecyclePhase === "end" || lifecyclePhase === "error")) {
                chatRunState.abortedRuns.delete(clientRunId);
                chatRunState.abortedRuns.delete(evt.runId);
                chatRunState.buffers.delete(clientRunId);
                chatRunState.deltaSentAt.delete(clientRunId);
                turnBases.delete(clientRunId);
                if (chatLink) {
                    chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
                }
            }
        }
        if (lifecyclePhase === "end" || lifecyclePhase === "error") {
            clearAgentRunContext(evt.runId);
        }
    };
}
