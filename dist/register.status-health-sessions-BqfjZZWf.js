import "./paths-B4BZAPZh.js";
import { B as theme, P as setVerbose, k as info, z as isRich } from "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
import { T as classifySessionKey, ar as lookupContextTokens } from "./reply-B1AnbNl6.js";
import "./registry-D74-I5q-.js";
import { f as defaultRuntime } from "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import "./agent-scope-5j4KiZmG.js";
import { Lt as DEFAULT_CONTEXT_TOKENS, Rt as DEFAULT_MODEL, f as resolveConfiguredModelRef, zt as DEFAULT_PROVIDER } from "./model-selection-DnrWKBOM.js";
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
import { O as resolveFreshSessionTotalTokens, i as loadSessionStore } from "./sessions-B1VYnsjk.js";
import "./dock-CEzRHF7-.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./send-D5zBwK2f.js";
import "./plugins-MECKrdj4.js";
import "./send-j6ZvUzIo.js";
import { c as resolveStorePath } from "./paths-CS8MdUIx.js";
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
import { n as formatTimeAgo } from "./format-relative-Czf5fUjn.js";
import "./channel-activity-cMUrV5zA.js";
import "./tables-DIbPoQpb.js";
import "./send-BogFunkR.js";
import "./pairing-store-CXkP5_3O.js";
import "./proxy-C6uKGYuE.js";
import { t as formatDocsLink } from "./links-DCbJQ1uz.js";
import { n as runCommandWithRuntime } from "./cli-utils-D2X_bDLt.js";
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
import { n as parsePositiveIntOrUndefined } from "./helpers-fRxKNzeV.js";
import "./skills-status-D-5tXP1x.js";
import "./dangerous-tools-DDkIucG0.js";
import { t as formatHelpExamples } from "./help-format-q1HOHFOI.js";
import "./skill-scanner-Af4i2A9G.js";
import "./channels-status-issues-DNl1CSf6.js";
import "./systemd-DTzLtG5-.js";
import "./service-DbIgGSI-.js";
import "./diagnostics-9GqfwHHx.js";
import "./table-CMnhkPVz.js";
import "./audit-BoGJtWj6.js";
import { t as statusCommand } from "./status-CwxEeZ5W.js";
import { r as healthCommand } from "./health-UGlyqH-a.js";
import "./update-check-C7IX-bKh.js";
import "./node-service-BTHMqg-K.js";
import "./status.update-VWct-djn.js";

//#region src/commands/sessions.ts
const KIND_PAD = 6;
const KEY_PAD = 26;
const AGE_PAD = 9;
const MODEL_PAD = 14;
const TOKENS_PAD = 20;
const formatKTokens = (value) => `${(value / 1e3).toFixed(value >= 1e4 ? 0 : 1)}k`;
const truncateKey = (key) => {
	if (key.length <= KEY_PAD) return key;
	const head = Math.max(4, KEY_PAD - 10);
	return `${key.slice(0, head)}...${key.slice(-6)}`;
};
const colorByPct = (label, pct, rich) => {
	if (!rich || pct === null) return label;
	if (pct >= 95) return theme.error(label);
	if (pct >= 80) return theme.warn(label);
	if (pct >= 60) return theme.success(label);
	return theme.muted(label);
};
const formatTokensCell = (total, contextTokens, rich) => {
	if (total === void 0) {
		const label = `unknown/${contextTokens ? formatKTokens(contextTokens) : "?"} (?%)`;
		return rich ? theme.muted(label.padEnd(TOKENS_PAD)) : label.padEnd(TOKENS_PAD);
	}
	const totalLabel = formatKTokens(total);
	const ctxLabel = contextTokens ? formatKTokens(contextTokens) : "?";
	const pct = contextTokens ? Math.min(999, Math.round(total / contextTokens * 100)) : null;
	return colorByPct(`${totalLabel}/${ctxLabel} (${pct ?? "?"}%)`.padEnd(TOKENS_PAD), pct, rich);
};
const formatKindCell = (kind, rich) => {
	const label = kind.padEnd(KIND_PAD);
	if (!rich) return label;
	if (kind === "group") return theme.accentBright(label);
	if (kind === "global") return theme.warn(label);
	if (kind === "direct") return theme.accent(label);
	return theme.muted(label);
};
const formatAgeCell = (updatedAt, rich) => {
	const padded = (updatedAt ? formatTimeAgo(Date.now() - updatedAt) : "unknown").padEnd(AGE_PAD);
	return rich ? theme.muted(padded) : padded;
};
const formatModelCell = (model, rich) => {
	const label = (model ?? "unknown").padEnd(MODEL_PAD);
	return rich ? theme.info(label) : label;
};
const formatFlagsCell = (row, rich) => {
	const label = [
		row.thinkingLevel ? `think:${row.thinkingLevel}` : null,
		row.verboseLevel ? `verbose:${row.verboseLevel}` : null,
		row.reasoningLevel ? `reasoning:${row.reasoningLevel}` : null,
		row.elevatedLevel ? `elev:${row.elevatedLevel}` : null,
		row.responseUsage ? `usage:${row.responseUsage}` : null,
		row.groupActivation ? `activation:${row.groupActivation}` : null,
		row.systemSent ? "system" : null,
		row.abortedLastRun ? "aborted" : null,
		row.sessionId ? `id:${row.sessionId}` : null
	].filter(Boolean).join(" ");
	return label.length === 0 ? "" : rich ? theme.muted(label) : label;
};
function toRows(store) {
	return Object.entries(store).map(([key, entry]) => {
		const updatedAt = entry?.updatedAt ?? null;
		return {
			key,
			kind: classifySessionKey(key, entry),
			updatedAt,
			ageMs: updatedAt ? Date.now() - updatedAt : null,
			sessionId: entry?.sessionId,
			systemSent: entry?.systemSent,
			abortedLastRun: entry?.abortedLastRun,
			thinkingLevel: entry?.thinkingLevel,
			verboseLevel: entry?.verboseLevel,
			reasoningLevel: entry?.reasoningLevel,
			elevatedLevel: entry?.elevatedLevel,
			responseUsage: entry?.responseUsage,
			groupActivation: entry?.groupActivation,
			inputTokens: entry?.inputTokens,
			outputTokens: entry?.outputTokens,
			totalTokens: entry?.totalTokens,
			totalTokensFresh: entry?.totalTokensFresh,
			model: entry?.model,
			contextTokens: entry?.contextTokens
		};
	}).toSorted((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
async function sessionsCommand(opts, runtime) {
	const cfg = loadConfig();
	const resolved = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const configContextTokens = cfg.agents?.defaults?.contextTokens ?? lookupContextTokens(resolved.model) ?? DEFAULT_CONTEXT_TOKENS;
	const configModel = resolved.model ?? DEFAULT_MODEL;
	const storePath = resolveStorePath(opts.store ?? cfg.session?.store);
	const store = loadSessionStore(storePath);
	let activeMinutes;
	if (opts.active !== void 0) {
		const parsed = Number.parseInt(String(opts.active), 10);
		if (Number.isNaN(parsed) || parsed <= 0) {
			runtime.error("--active must be a positive integer (minutes)");
			runtime.exit(1);
			return;
		}
		activeMinutes = parsed;
	}
	const rows = toRows(store).filter((row) => {
		if (activeMinutes === void 0) return true;
		if (!row.updatedAt) return false;
		return Date.now() - row.updatedAt <= activeMinutes * 6e4;
	});
	if (opts.json) {
		runtime.log(JSON.stringify({
			path: storePath,
			count: rows.length,
			activeMinutes: activeMinutes ?? null,
			sessions: rows.map((r) => ({
				...r,
				totalTokens: resolveFreshSessionTotalTokens(r) ?? null,
				totalTokensFresh: typeof r.totalTokens === "number" ? r.totalTokensFresh !== false : false,
				contextTokens: r.contextTokens ?? lookupContextTokens(r.model) ?? configContextTokens ?? null,
				model: r.model ?? configModel ?? null
			}))
		}, null, 2));
		return;
	}
	runtime.log(info(`Session store: ${storePath}`));
	runtime.log(info(`Sessions listed: ${rows.length}`));
	if (activeMinutes) runtime.log(info(`Filtered to last ${activeMinutes} minute(s)`));
	if (rows.length === 0) {
		runtime.log("No sessions found.");
		return;
	}
	const rich = isRich();
	const header = [
		"Kind".padEnd(KIND_PAD),
		"Key".padEnd(KEY_PAD),
		"Age".padEnd(AGE_PAD),
		"Model".padEnd(MODEL_PAD),
		"Tokens (ctx %)".padEnd(TOKENS_PAD),
		"Flags"
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	for (const row of rows) {
		const model = row.model ?? configModel;
		const contextTokens = row.contextTokens ?? lookupContextTokens(model) ?? configContextTokens;
		const total = resolveFreshSessionTotalTokens(row);
		const keyLabel = truncateKey(row.key).padEnd(KEY_PAD);
		const keyCell = rich ? theme.accent(keyLabel) : keyLabel;
		const line = [
			formatKindCell(row.kind, rich),
			keyCell,
			formatAgeCell(row.updatedAt, rich),
			formatModelCell(model, rich),
			formatTokensCell(total, contextTokens ?? null, rich),
			formatFlagsCell(row, rich)
		].join(" ");
		runtime.log(line.trimEnd());
	}
}

//#endregion
//#region src/cli/program/register.status-health-sessions.ts
function resolveVerbose(opts) {
	return Boolean(opts.verbose || opts.debug);
}
function parseTimeoutMs(timeout) {
	const parsed = parsePositiveIntOrUndefined(timeout);
	if (timeout !== void 0 && parsed === void 0) {
		defaultRuntime.error("--timeout must be a positive integer (milliseconds)");
		defaultRuntime.exit(1);
		return null;
	}
	return parsed;
}
function registerStatusHealthSessionsCommands(program) {
	program.command("status").description("Show channel health and recent session recipients").option("--json", "Output JSON instead of text", false).option("--all", "Full diagnosis (read-only, pasteable)", false).option("--usage", "Show model provider usage/quota snapshots", false).option("--deep", "Probe channels (WhatsApp Web + Telegram + Discord + Slack + Signal)", false).option("--timeout <ms>", "Probe timeout in milliseconds", "10000").option("--verbose", "Verbose logging", false).option("--debug", "Alias for --verbose", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw status", "Show channel health + session summary."],
		["openclaw status --all", "Full diagnosis (read-only)."],
		["openclaw status --json", "Machine-readable output."],
		["openclaw status --usage", "Show model provider usage/quota snapshots."],
		["openclaw status --deep", "Run channel probes (WA + Telegram + Discord + Slack + Signal)."],
		["openclaw status --deep --timeout 5000", "Tighten probe timeout."]
	])}`).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/status", "docs.openclaw.ai/cli/status")}\n`).action(async (opts) => {
		const verbose = resolveVerbose(opts);
		setVerbose(verbose);
		const timeout = parseTimeoutMs(opts.timeout);
		if (timeout === null) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			await statusCommand({
				json: Boolean(opts.json),
				all: Boolean(opts.all),
				deep: Boolean(opts.deep),
				usage: Boolean(opts.usage),
				timeoutMs: timeout,
				verbose
			}, defaultRuntime);
		});
	});
	program.command("health").description("Fetch health from the running gateway").option("--json", "Output JSON instead of text", false).option("--timeout <ms>", "Connection timeout in milliseconds", "10000").option("--verbose", "Verbose logging", false).option("--debug", "Alias for --verbose", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/health", "docs.openclaw.ai/cli/health")}\n`).action(async (opts) => {
		const verbose = resolveVerbose(opts);
		setVerbose(verbose);
		const timeout = parseTimeoutMs(opts.timeout);
		if (timeout === null) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			await healthCommand({
				json: Boolean(opts.json),
				timeoutMs: timeout,
				verbose
			}, defaultRuntime);
		});
	});
	program.command("sessions").description("List stored conversation sessions").option("--json", "Output as JSON", false).option("--verbose", "Verbose logging", false).option("--store <path>", "Path to session store (default: resolved from config)").option("--active <minutes>", "Only show sessions updated within the past N minutes").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw sessions", "List all sessions."],
		["openclaw sessions --active 120", "Only last 2 hours."],
		["openclaw sessions --json", "Machine-readable output."],
		["openclaw sessions --store ./tmp/sessions.json", "Use a specific session store."]
	])}\n\n${theme.muted("Shows token usage per session when the agent reports it; set agents.defaults.contextTokens to cap the window and show %.")}`).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/sessions", "docs.openclaw.ai/cli/sessions")}\n`).action(async (opts) => {
		setVerbose(Boolean(opts.verbose));
		await sessionsCommand({
			json: Boolean(opts.json),
			store: opts.store,
			active: opts.active
		}, defaultRuntime);
	});
}

//#endregion
export { registerStatusHealthSessionsCommands };