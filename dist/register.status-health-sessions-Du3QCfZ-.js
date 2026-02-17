import { Dt as theme, _ as defaultRuntime, xt as setVerbose } from "./entry.js";
import "./auth-profiles-GYsKiVaE.js";
import "./exec-CBKBIMpA.js";
import "./agent-scope-F21xRiu_.js";
import "./github-copilot-token-DuFIqfeC.js";
import "./model-CEWuUQPV.js";
import "./pi-model-discovery-EhM2JAQo.js";
import "./frontmatter-CEDVhyuu.js";
import "./skills-WdwyspYD.js";
import "./manifest-registry-QAG6awiS.js";
import "./skills-status-CXVlWZRW.js";
import "./config-CF5WgkYh.js";
import "./client-Bp-CZTme.js";
import "./call-Cn29hQ46.js";
import "./message-channel-BoxkHV_q.js";
import "./subagent-registry-kdTa9uwX.js";
import "./sessions-Cy55zv3n.js";
import "./tokens-vdnEt1VF.js";
import "./normalize-J3mTxq-2.js";
import "./bindings-CeWP3eHN.js";
import "./logging-CfEk_PnX.js";
import "./accounts-Beq84OQo.js";
import "./send-DJZBYeK5.js";
import "./plugins-B4cKx11a.js";
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
import "./session-utils-DDGM3uen.js";
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
import { t as formatDocsLink } from "./links-D0KDzdwy.js";
import { n as runCommandWithRuntime } from "./cli-utils-BeUql7qI.js";
import "./progress-C0Eq81ZL.js";
import "./replies-dGUYE7k3.js";
import "./pi-tools.policy-Dle3hR8S.js";
import "./onboard-helpers-CQEkF4Ds.js";
import "./prompt-style-CPqouQNO.js";
import "./pairing-labels-CueqFrkf.js";
import "./dangerous-tools-u9-jOGeF.js";
import { t as formatHelpExamples } from "./help-format-DtXnxrDa.js";
import "./skill-scanner-DLxZR9YD.js";
import "./channels-status-issues-B2SmtcRL.js";
import { n as parsePositiveIntOrUndefined } from "./helpers-DrQky-et.js";
import "./systemd-B6tvjHkP.js";
import "./service-BvvGeatd.js";
import "./diagnostics-DjveIvle.js";
import "./table-ozIiGDit.js";
import "./audit-Dn_2xve1.js";
import { n as statusCommand } from "./status-DVqZ11H_.js";
import { r as healthCommand } from "./health-BdRowCdl.js";
import "./update-check-ByQxwtzZ.js";
import "./node-service-CexwKySz.js";
import "./status.update-C5S3-C3t.js";
import { t as sessionsCommand } from "./sessions-D9eld02k.js";

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