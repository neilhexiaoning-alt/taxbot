import { _ as defaultRuntime } from "./entry.js";
import "./auth-profiles-GYsKiVaE.js";
import { u as normalizeMainKey } from "./session-key-BGiG_JcT.js";
import "./exec-CBKBIMpA.js";
import "./agent-scope-F21xRiu_.js";
import "./github-copilot-token-DuFIqfeC.js";
import "./model-CEWuUQPV.js";
import "./pi-model-discovery-EhM2JAQo.js";
import "./frontmatter-CEDVhyuu.js";
import "./skills-WdwyspYD.js";
import "./manifest-registry-QAG6awiS.js";
import { i as loadConfig } from "./config-CF5WgkYh.js";
import "./client-Bp-CZTme.js";
import "./call-Cn29hQ46.js";
import "./message-channel-BoxkHV_q.js";
import { Jt as requestHeartbeatNow, nn as enqueueSystemEvent } from "./subagent-registry-kdTa9uwX.js";
import { l as updateSessionStore } from "./sessions-Cy55zv3n.js";
import "./tokens-vdnEt1VF.js";
import "./normalize-J3mTxq-2.js";
import "./bindings-CeWP3eHN.js";
import "./logging-CfEk_PnX.js";
import "./accounts-Beq84OQo.js";
import "./send-DJZBYeK5.js";
import { r as normalizeChannelId } from "./plugins-B4cKx11a.js";
import "./send-DlPIYd0T.js";
import "./with-timeout-DsNXM1CO.js";
import "./deliver-BRNIcAT5.js";
import "./send-duSeswNZ.js";
import "./image-ops-DHR6894Y.js";
import "./pi-embedded-helpers-Bkf18Lss.js";
import "./sandbox-wO-1oO2k.js";
import "./chrome-BxSF3eyi.js";
import "./tailscale-D7IN8dvd.js";
import "./auth-DUKy_TmG.js";
import "./server-context-D56LKCTT.js";
import "./routes-BP-1vJKR.js";
import "./redact-C5wI7Ob4.js";
import "./errors-CFvaLX5j.js";
import "./paths-CRRAf1k1.js";
import "./ssrf-B2Y1od3A.js";
import "./store-ZMcXdLES.js";
import "./ports-Bl3QRYGX.js";
import "./trash-CyQ0N--G.js";
import "./dock-CydjVxuT.js";
import "./paths-iP6tOVPR.js";
import "./tool-images-BzK_1ySW.js";
import "./thinking-C1OQknuZ.js";
import "./models-config-6-o1aQBU.js";
import "./reply-prefix-CVcuHH0W.js";
import "./memory-cli-Dwo-v-iX.js";
import "./manager-R53uMDbK.js";
import "./sqlite-DNTJEWLw.js";
import "./retry-BJxmeyhA.js";
import "./common-Bl39mxj5.js";
import "./chunk-CpW4isHi.js";
import "./markdown-tables-CePdHRv3.js";
import "./fetch-guard-DyNYivLB.js";
import "./fetch-C_wlQF6t.js";
import "./ir-bQID6YWA.js";
import "./render-scQFEkLe.js";
import "./commands-registry-BNsIL0Gh.js";
import "./image-jbnSC1p0.js";
import "./tool-display-BU5ZoPjU.js";
import "./runner-BxAR2JJ5.js";
import "./model-catalog-CSKVVT2n.js";
import { c as resolveGatewaySessionStoreTarget, o as loadSessionEntry, s as pruneLegacyStoreKeys } from "./session-utils-DDGM3uen.js";
import "./skill-commands-Ck6X4pqf.js";
import "./workspace-dirs-BbV1AS7m.js";
import "./pairing-store-BDgc-abf.js";
import "./nodes-screen-BXMpVZkZ.js";
import "./session-cost-usage-BCCZShZY.js";
import "./control-service-DmTFNFCT.js";
import "./channel-selection-sIhb3cYi.js";
import "./send-DYGb8eCO.js";
import "./outbound-attachment-DAmFDdOr.js";
import "./delivery-queue-P--h9nsG.js";
import "./send-CTEyOMfF.js";
import "./resolve-route-BeShF7ju.js";
import "./channel-activity-Dx2itHd7.js";
import "./tables-BgDwWN0_.js";
import "./proxy-YVeCaBKC.js";
import "./links-D0KDzdwy.js";
import "./cli-utils-BeUql7qI.js";
import "./progress-C0Eq81ZL.js";
import "./replies-dGUYE7k3.js";
import "./pi-tools.policy-Dle3hR8S.js";
import "./onboard-helpers-CQEkF4Ds.js";
import "./prompt-style-CPqouQNO.js";
import "./pairing-labels-CueqFrkf.js";
import "./outbound-send-deps-C57eEw5y.js";
import { t as formatForLog } from "./ws-log-CzWfakqi.js";
import { t as agentCommand } from "./agent-ryGRIqHy.js";
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