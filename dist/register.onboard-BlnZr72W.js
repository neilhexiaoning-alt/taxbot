import { Dt as theme, _ as defaultRuntime } from "./entry.js";
import "./auth-profiles-GYsKiVaE.js";
import "./exec-CBKBIMpA.js";
import "./agent-scope-F21xRiu_.js";
import "./github-copilot-token-DuFIqfeC.js";
import "./model-CEWuUQPV.js";
import "./pi-model-discovery-EhM2JAQo.js";
import "./frontmatter-CEDVhyuu.js";
import "./skills-WdwyspYD.js";
import "./manifest-registry-QAG6awiS.js";
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
import "./note-D0U3cGWp.js";
import "./clack-prompter-D3HMaWhz.js";
import "./daemon-runtime-DpjxIoTx.js";
import "./systemd-B6tvjHkP.js";
import "./service-BvvGeatd.js";
import "./health-BdRowCdl.js";
import "./onboarding-AsuVK6QL.js";
import "./shared-DQBJrhrA.js";
import "./auth-token-9aoEmy6K.js";
import "./logging-BaDbOwCs.js";
import { n as formatAuthChoiceChoicesForCli } from "./auth-choice-options-CHNfjpOP.js";
import "./openai-model-default-DpjrUU6j.js";
import "./vllm-setup-BhM-ftxv.js";
import "./systemd-linger-CWzJNp6I.js";
import "./model-picker-B_AJWwXF.js";
import "./onboard-custom-D7pQJ0gR.js";
import { n as ONBOARD_PROVIDER_AUTH_FLAGS, t as onboardCommand } from "./onboard-DWAu4Twj.js";

//#region src/cli/program/register.onboard.ts
function resolveInstallDaemonFlag(command, opts) {
	if (!command || typeof command !== "object") return;
	const getOptionValueSource = "getOptionValueSource" in command ? command.getOptionValueSource : void 0;
	if (typeof getOptionValueSource !== "function") return;
	if (getOptionValueSource.call(command, "skipDaemon") === "cli") return false;
	if (getOptionValueSource.call(command, "installDaemon") === "cli") return Boolean(opts.installDaemon);
}
const AUTH_CHOICE_HELP = formatAuthChoiceChoicesForCli({
	includeLegacyAliases: true,
	includeSkip: true
});
function registerOnboardCommand(program) {
	const command = program.command("onboard").description("Interactive wizard to set up the gateway, workspace, and skills").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/onboard", "docs.openclaw.ai/cli/onboard")}\n`).option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace)").option("--reset", "Reset config + credentials + sessions + workspace before running wizard").option("--non-interactive", "Run without prompts", false).option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false).option("--flow <flow>", "Wizard flow: quickstart|advanced|manual").option("--mode <mode>", "Wizard mode: local|remote").option("--auth-choice <choice>", `Auth: ${AUTH_CHOICE_HELP}`).option("--token-provider <id>", "Token provider id (non-interactive; used with --auth-choice token)").option("--token <token>", "Token value (non-interactive; used with --auth-choice token)").option("--token-profile-id <id>", "Auth profile id (non-interactive; default: <provider>:manual)").option("--token-expires-in <duration>", "Optional token expiry duration (e.g. 365d, 12h)").option("--cloudflare-ai-gateway-account-id <id>", "Cloudflare Account ID").option("--cloudflare-ai-gateway-gateway-id <id>", "Cloudflare AI Gateway ID");
	for (const providerFlag of ONBOARD_PROVIDER_AUTH_FLAGS) command.option(providerFlag.cliOption, providerFlag.description);
	command.option("--custom-base-url <url>", "Custom provider base URL").option("--custom-api-key <key>", "Custom provider API key (optional)").option("--custom-model-id <id>", "Custom provider model ID").option("--custom-provider-id <id>", "Custom provider ID (optional; auto-derived by default)").option("--custom-compatibility <mode>", "Custom provider API compatibility: openai|anthropic (default: openai)").option("--gateway-port <port>", "Gateway port").option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom").option("--gateway-auth <mode>", "Gateway auth: token|password").option("--gateway-token <token>", "Gateway token (token auth)").option("--gateway-password <password>", "Gateway password (password auth)").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").option("--tailscale <mode>", "Tailscale: off|serve|funnel").option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit").option("--install-daemon", "Install gateway service").option("--no-install-daemon", "Skip gateway service install").option("--skip-daemon", "Skip gateway service install").option("--daemon-runtime <runtime>", "Daemon runtime: node|bun").option("--skip-channels", "Skip channel setup").option("--skip-skills", "Skip skills setup").option("--skip-health", "Skip health check").option("--skip-ui", "Skip Control UI/TUI prompts").option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun").option("--json", "Output JSON summary", false);
	command.action(async (opts, commandRuntime) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const installDaemon = resolveInstallDaemonFlag(commandRuntime, { installDaemon: Boolean(opts.installDaemon) });
			const gatewayPort = typeof opts.gatewayPort === "string" ? Number.parseInt(opts.gatewayPort, 10) : void 0;
			await onboardCommand({
				workspace: opts.workspace,
				nonInteractive: Boolean(opts.nonInteractive),
				acceptRisk: Boolean(opts.acceptRisk),
				flow: opts.flow,
				mode: opts.mode,
				authChoice: opts.authChoice,
				tokenProvider: opts.tokenProvider,
				token: opts.token,
				tokenProfileId: opts.tokenProfileId,
				tokenExpiresIn: opts.tokenExpiresIn,
				anthropicApiKey: opts.anthropicApiKey,
				openaiApiKey: opts.openaiApiKey,
				openrouterApiKey: opts.openrouterApiKey,
				aiGatewayApiKey: opts.aiGatewayApiKey,
				cloudflareAiGatewayAccountId: opts.cloudflareAiGatewayAccountId,
				cloudflareAiGatewayGatewayId: opts.cloudflareAiGatewayGatewayId,
				cloudflareAiGatewayApiKey: opts.cloudflareAiGatewayApiKey,
				moonshotApiKey: opts.moonshotApiKey,
				kimiCodeApiKey: opts.kimiCodeApiKey,
				geminiApiKey: opts.geminiApiKey,
				zaiApiKey: opts.zaiApiKey,
				xiaomiApiKey: opts.xiaomiApiKey,
				qianfanApiKey: opts.qianfanApiKey,
				minimaxApiKey: opts.minimaxApiKey,
				syntheticApiKey: opts.syntheticApiKey,
				veniceApiKey: opts.veniceApiKey,
				togetherApiKey: opts.togetherApiKey,
				huggingfaceApiKey: opts.huggingfaceApiKey,
				opencodeZenApiKey: opts.opencodeZenApiKey,
				xaiApiKey: opts.xaiApiKey,
				litellmApiKey: opts.litellmApiKey,
				customBaseUrl: opts.customBaseUrl,
				customApiKey: opts.customApiKey,
				customModelId: opts.customModelId,
				customProviderId: opts.customProviderId,
				customCompatibility: opts.customCompatibility,
				gatewayPort: typeof gatewayPort === "number" && Number.isFinite(gatewayPort) ? gatewayPort : void 0,
				gatewayBind: opts.gatewayBind,
				gatewayAuth: opts.gatewayAuth,
				gatewayToken: opts.gatewayToken,
				gatewayPassword: opts.gatewayPassword,
				remoteUrl: opts.remoteUrl,
				remoteToken: opts.remoteToken,
				tailscale: opts.tailscale,
				tailscaleResetOnExit: Boolean(opts.tailscaleResetOnExit),
				reset: Boolean(opts.reset),
				installDaemon,
				daemonRuntime: opts.daemonRuntime,
				skipChannels: Boolean(opts.skipChannels),
				skipSkills: Boolean(opts.skipSkills),
				skipHealth: Boolean(opts.skipHealth),
				skipUi: Boolean(opts.skipUi),
				nodeManager: opts.nodeManager,
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
}

//#endregion
export { registerOnboardCommand };