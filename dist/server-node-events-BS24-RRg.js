import "./paths-B4BZAPZh.js";
import "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
import { A as pruneLegacyStoreKeys, Ot as requestHeartbeatNow, j as resolveGatewaySessionStoreTarget, k as loadSessionEntry, ur as enqueueSystemEvent } from "./reply-B1AnbNl6.js";
import { u as normalizeMainKey } from "./session-key-CZ6OwgSB.js";
import "./registry-D74-I5q-.js";
import { f as defaultRuntime } from "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import "./agent-scope-5j4KiZmG.js";
import "./model-selection-DnrWKBOM.js";
import "./github-copilot-token-D2zp6kMZ.js";
import "./boolean-BsqeuxE6.js";
import "./env-DRL0O4y1.js";
import { i as loadConfig } from "./config-DTlZk19z.js";
import "./manifest-registry-DoaWeDHN.js";
import "./runner-BBNVS4uo.js";
import "./image-wG1bcosY.js";
import "./models-config-DE_nkoL4.js";
import "./pi-model-discovery-DX1x3UsN.js";
import "./pi-embedded-helpers-XPBkJnfO.js";
import "./sandbox-CCXqNFNa.js";
import "./chrome-CZ4H3suC.js";
import "./tailscale-DOI5fbGP.js";
import "./auth-CN3K_86O.js";
import "./server-context-Dx2Suq6r.js";
import "./frontmatter-CjCfqPvH.js";
import "./skills-Bme2RWJt.js";
import "./routes-ETEIzbdF.js";
import "./redact-CjJyQlVU.js";
import "./errors-CdJjJ1Jq.js";
import "./paths-CWc9mjAN.js";
import "./ssrf-Bhv0qRd-.js";
import "./image-ops-Dmx5NOjU.js";
import "./store-Dtv6xckJ.js";
import "./ports-CyKvUwdk.js";
import "./trash-CXJgiRwI.js";
import "./message-channel-B11syIWY.js";
import { l as updateSessionStore } from "./sessions-B1VYnsjk.js";
import "./dock-CEzRHF7-.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./send-D5zBwK2f.js";
import { r as normalizeChannelId } from "./plugins-MECKrdj4.js";
import "./send-j6ZvUzIo.js";
import "./paths-CS8MdUIx.js";
import "./tool-images-B-uxwbUZ.js";
import "./tool-display-I-_BPOaX.js";
import "./fetch-guard-BlxX1n2G.js";
import "./fetch-DbB8ywgG.js";
import "./model-catalog-CZMJoTSB.js";
import "./tokens-DH4MwODN.js";
import "./with-timeout-D02ZTcNS.js";
import "./deliver-MzjBKeOi.js";
import "./send-C7k84fkX.js";
import "./model-DO6y7gYr.js";
import "./reply-prefix-B3HwXbd2.js";
import "./memory-cli-34wXZGhd.js";
import "./manager-czpk57iz.js";
import "./sqlite-BC7KQnZb.js";
import "./retry-BJemoUJU.js";
import "./common-C4A6CsYx.js";
import "./chunk-BiewMCJC.js";
import "./markdown-tables-Cc0AOOs4.js";
import "./ir-DwRJAzeS.js";
import "./render-BBWKrfmg.js";
import "./commands-registry-B3a6qfAe.js";
import "./client-C1BL_CRC.js";
import "./call-wSDmIHBv.js";
import "./channel-activity-cMUrV5zA.js";
import "./tables-DIbPoQpb.js";
import "./send-BogFunkR.js";
import "./pairing-store-CXkP5_3O.js";
import "./proxy-C6uKGYuE.js";
import "./links-DCbJQ1uz.js";
import "./cli-utils-D2X_bDLt.js";
import "./progress-DDsYyzm-.js";
import "./resolve-route-DYsVV_km.js";
import "./replies-D190o81L.js";
import "./skill-commands-CETjctyN.js";
import "./workspace-dirs-JzAjnGf0.js";
import "./pi-tools.policy-CIbLFTDH.js";
import "./send-BOUjI9we.js";
import "./onboard-helpers-vhMfSJom.js";
import "./prompt-style-BAr7Tkma.js";
import "./outbound-attachment-D1NyWD1B.js";
import "./pairing-labels-97H61XdG.js";
import "./session-cost-usage-DeNCxeDS.js";
import "./nodes-screen-Cl6H3i9t.js";
import "./control-service-DOvxvD37.js";
import "./channel-selection-B5Ud2Fxf.js";
import "./delivery-queue-CrOjNqb8.js";
import "./deps-BS2Te0AD.js";
import { t as formatForLog } from "./ws-log-DgSfdtUr.js";
import { t as agentCommand } from "./agent-BhJ-_m_D.js";
import { randomUUID } from "node:crypto";

//#region src/gateway/server-node-events.ts
const MAX_EXEC_EVENT_OUTPUT_CHARS = 180;
function compactExecEventOutput(raw) {
	const normalized = raw.replace(/\s+/g, " ").trim();
	if (!normalized) return "";
	if (normalized.length <= MAX_EXEC_EVENT_OUTPUT_CHARS) return normalized;
	const safe = Math.max(1, MAX_EXEC_EVENT_OUTPUT_CHARS - 1);
	return `${normalized.slice(0, safe)}…`;
}
async function touchSessionStore(params) {
	const { storePath } = params;
	if (!storePath) return;
	await updateSessionStore(storePath, (store) => {
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: params.sessionKey,
			store
		});
		pruneLegacyStoreKeys({
			store,
			canonicalKey: target.canonicalKey,
			candidates: target.storeKeys
		});
		store[params.canonicalKey] = {
			sessionId: params.sessionId,
			updatedAt: params.now,
			thinkingLevel: params.entry?.thinkingLevel,
			verboseLevel: params.entry?.verboseLevel,
			reasoningLevel: params.entry?.reasoningLevel,
			systemSent: params.entry?.systemSent,
			sendPolicy: params.entry?.sendPolicy,
			lastChannel: params.entry?.lastChannel,
			lastTo: params.entry?.lastTo
		};
	});
}
function parseSessionKeyFromPayloadJSON(payloadJSON) {
	let payload;
	try {
		payload = JSON.parse(payloadJSON);
	} catch {
		return null;
	}
	if (typeof payload !== "object" || payload === null) return null;
	const obj = payload;
	const sessionKey = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "";
	return sessionKey.length > 0 ? sessionKey : null;
}
const handleNodeEvent = async (ctx, nodeId, evt) => {
	switch (evt.event) {
		case "voice.transcript": {
			if (!evt.payloadJSON) return;
			let payload;
			try {
				payload = JSON.parse(evt.payloadJSON);
			} catch {
				return;
			}
			const obj = typeof payload === "object" && payload !== null ? payload : {};
			const text = typeof obj.text === "string" ? obj.text.trim() : "";
			if (!text) return;
			if (text.length > 2e4) return;
			const sessionKeyRaw = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "";
			const cfg = loadConfig();
			const rawMainKey = normalizeMainKey(cfg.session?.mainKey);
			const sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : rawMainKey;
			const { storePath, entry, canonicalKey } = loadSessionEntry(sessionKey);
			const now = Date.now();
			const sessionId = entry?.sessionId ?? randomUUID();
			await touchSessionStore({
				cfg,
				sessionKey,
				storePath,
				canonicalKey,
				entry,
				sessionId,
				now
			});
			ctx.addChatRun(sessionId, {
				sessionKey: canonicalKey,
				clientRunId: `voice-${randomUUID()}`
			});
			agentCommand({
				message: text,
				sessionId,
				sessionKey: canonicalKey,
				thinking: "low",
				deliver: false,
				messageChannel: "node"
			}, defaultRuntime, ctx.deps).catch((err) => {
				ctx.logGateway.warn(`agent failed node=${nodeId}: ${formatForLog(err)}`);
			});
			return;
		}
		case "agent.request": {
			if (!evt.payloadJSON) return;
			let link = null;
			try {
				link = JSON.parse(evt.payloadJSON);
			} catch {
				return;
			}
			const message = (link?.message ?? "").trim();
			if (!message) return;
			if (message.length > 2e4) return;
			const channel = normalizeChannelId(typeof link?.channel === "string" ? link.channel.trim() : "") ?? void 0;
			const to = typeof link?.to === "string" && link.to.trim() ? link.to.trim() : void 0;
			const deliver = Boolean(link?.deliver) && Boolean(channel);
			const sessionKeyRaw = (link?.sessionKey ?? "").trim();
			const sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : `node-${nodeId}`;
			const cfg = loadConfig();
			const { storePath, entry, canonicalKey } = loadSessionEntry(sessionKey);
			const now = Date.now();
			const sessionId = entry?.sessionId ?? randomUUID();
			await touchSessionStore({
				cfg,
				sessionKey,
				storePath,
				canonicalKey,
				entry,
				sessionId,
				now
			});
			agentCommand({
				message,
				sessionId,
				sessionKey: canonicalKey,
				thinking: link?.thinking ?? void 0,
				deliver,
				to,
				channel,
				timeout: typeof link?.timeoutSeconds === "number" ? link.timeoutSeconds.toString() : void 0,
				messageChannel: "node"
			}, defaultRuntime, ctx.deps).catch((err) => {
				ctx.logGateway.warn(`agent failed node=${nodeId}: ${formatForLog(err)}`);
			});
			return;
		}
		case "chat.subscribe": {
			if (!evt.payloadJSON) return;
			const sessionKey = parseSessionKeyFromPayloadJSON(evt.payloadJSON);
			if (!sessionKey) return;
			ctx.nodeSubscribe(nodeId, sessionKey);
			return;
		}
		case "chat.unsubscribe": {
			if (!evt.payloadJSON) return;
			const sessionKey = parseSessionKeyFromPayloadJSON(evt.payloadJSON);
			if (!sessionKey) return;
			ctx.nodeUnsubscribe(nodeId, sessionKey);
			return;
		}
		case "exec.started":
		case "exec.finished":
		case "exec.denied": {
			if (!evt.payloadJSON) return;
			let payload;
			try {
				payload = JSON.parse(evt.payloadJSON);
			} catch {
				return;
			}
			const obj = typeof payload === "object" && payload !== null ? payload : {};
			const sessionKey = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : `node-${nodeId}`;
			if (!sessionKey) return;
			const runId = typeof obj.runId === "string" ? obj.runId.trim() : "";
			const command = typeof obj.command === "string" ? obj.command.trim() : "";
			const exitCode = typeof obj.exitCode === "number" && Number.isFinite(obj.exitCode) ? obj.exitCode : void 0;
			const timedOut = obj.timedOut === true;
			const output = typeof obj.output === "string" ? obj.output.trim() : "";
			const reason = typeof obj.reason === "string" ? obj.reason.trim() : "";
			let text = "";
			if (evt.event === "exec.started") {
				text = `Exec started (node=${nodeId}${runId ? ` id=${runId}` : ""})`;
				if (command) text += `: ${command}`;
			} else if (evt.event === "exec.finished") {
				const exitLabel = timedOut ? "timeout" : `code ${exitCode ?? "?"}`;
				const compactOutput = compactExecEventOutput(output);
				if (!(timedOut || exitCode !== 0 || compactOutput.length > 0)) return;
				text = `Exec finished (node=${nodeId}${runId ? ` id=${runId}` : ""}, ${exitLabel})`;
				if (compactOutput) text += `\n${compactOutput}`;
			} else {
				text = `Exec denied (node=${nodeId}${runId ? ` id=${runId}` : ""}${reason ? `, ${reason}` : ""})`;
				if (command) text += `: ${command}`;
			}
			enqueueSystemEvent(text, {
				sessionKey,
				contextKey: runId ? `exec:${runId}` : "exec"
			});
			requestHeartbeatNow({ reason: "exec-event" });
			return;
		}
		default: return;
	}
};

//#endregion
export { handleNodeEvent };