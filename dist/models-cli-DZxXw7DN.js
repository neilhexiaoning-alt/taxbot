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
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-BeUql7qI.js";
import "./progress-C0Eq81ZL.js";
import "./replies-dGUYE7k3.js";
import "./pi-tools.policy-Dle3hR8S.js";
import "./onboard-helpers-CQEkF4Ds.js";
import "./prompt-style-CPqouQNO.js";
import "./pairing-labels-CueqFrkf.js";
import "./note-D0U3cGWp.js";
import "./clack-prompter-D3HMaWhz.js";
import "./table-ozIiGDit.js";
import "./shared-DQBJrhrA.js";
import "./auth-token-9aoEmy6K.js";
import "./logging-BaDbOwCs.js";
import { c as githubCopilotLoginCommand } from "./provider-auth-helpers-LPWzmpve.js";
import { C as modelsAliasesListCommand, S as modelsAliasesAddCommand, _ as modelsAuthOrderSetCommand, a as modelsStatusCommand, b as modelsAuthPasteTokenCommand, c as modelsImageFallbacksClearCommand, d as modelsFallbacksAddCommand, f as modelsFallbacksClearCommand, g as modelsAuthOrderGetCommand, h as modelsAuthOrderClearCommand, i as modelsScanCommand, l as modelsImageFallbacksListCommand, m as modelsFallbacksRemoveCommand, n as modelsSetImageCommand, o as modelsListCommand, p as modelsFallbacksListCommand, r as modelsSetCommand, s as modelsImageFallbacksAddCommand, u as modelsImageFallbacksRemoveCommand, v as modelsAuthAddCommand, w as modelsAliasesRemoveCommand, x as modelsAuthSetupTokenCommand, y as modelsAuthLoginCommand } from "./models-BTpbJV8w.js";
import "./auth-health-C9hW4UHM.js";

//#region src/cli/models-cli.ts
function runModelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function registerModelsCli(program) {
	const models = program.command("models").description("Model discovery, scanning, and configuration").option("--status-json", "Output JSON (alias for `models status --json`)", false).option("--status-plain", "Plain output (alias for `models status --plain`)", false).option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/models", "docs.openclaw.ai/cli/models")}\n`);
	models.command("list").description("List models (configured by default)").option("--all", "Show full model catalog", false).option("--local", "Filter to local models", false).option("--provider <name>", "Filter by provider").option("--json", "Output JSON", false).option("--plain", "Plain line output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsListCommand(opts, defaultRuntime);
		});
	});
	models.command("status").description("Show configured model state").option("--json", "Output JSON", false).option("--plain", "Plain output", false).option("--check", "Exit non-zero if auth is expiring/expired (1=expired/missing, 2=expiring)", false).option("--probe", "Probe configured provider auth (live)", false).option("--probe-provider <name>", "Only probe a single provider").option("--probe-profile <id>", "Only probe specific auth profile ids (repeat or comma-separated)", (value, previous) => {
		const next = Array.isArray(previous) ? previous : previous ? [previous] : [];
		next.push(value);
		return next;
	}).option("--probe-timeout <ms>", "Per-probe timeout in ms").option("--probe-concurrency <n>", "Concurrent probes").option("--probe-max-tokens <n>", "Probe max tokens (best-effort)").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)").action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsStatusCommand({
				json: Boolean(opts.json),
				plain: Boolean(opts.plain),
				check: Boolean(opts.check),
				probe: Boolean(opts.probe),
				probeProvider: opts.probeProvider,
				probeProfile: opts.probeProfile,
				probeTimeout: opts.probeTimeout,
				probeConcurrency: opts.probeConcurrency,
				probeMaxTokens: opts.probeMaxTokens,
				agent
			}, defaultRuntime);
		});
	});
	models.command("set").description("Set the default model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsSetCommand(model, defaultRuntime);
		});
	});
	models.command("set-image").description("Set the image model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsSetImageCommand(model, defaultRuntime);
		});
	});
	const aliases = models.command("aliases").description("Manage model aliases");
	aliases.command("list").description("List model aliases").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAliasesListCommand(opts, defaultRuntime);
		});
	});
	aliases.command("add").description("Add or update a model alias").argument("<alias>", "Alias name").argument("<model>", "Model id or alias").action(async (alias, model) => {
		await runModelsCommand(async () => {
			await modelsAliasesAddCommand(alias, model, defaultRuntime);
		});
	});
	aliases.command("remove").description("Remove a model alias").argument("<alias>", "Alias name").action(async (alias) => {
		await runModelsCommand(async () => {
			await modelsAliasesRemoveCommand(alias, defaultRuntime);
		});
	});
	const fallbacks = models.command("fallbacks").description("Manage model fallback list");
	fallbacks.command("list").description("List fallback models").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsFallbacksListCommand(opts, defaultRuntime);
		});
	});
	fallbacks.command("add").description("Add a fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsFallbacksAddCommand(model, defaultRuntime);
		});
	});
	fallbacks.command("remove").description("Remove a fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsFallbacksRemoveCommand(model, defaultRuntime);
		});
	});
	fallbacks.command("clear").description("Clear all fallback models").action(async () => {
		await runModelsCommand(async () => {
			await modelsFallbacksClearCommand(defaultRuntime);
		});
	});
	const imageFallbacks = models.command("image-fallbacks").description("Manage image model fallback list");
	imageFallbacks.command("list").description("List image fallback models").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksListCommand(opts, defaultRuntime);
		});
	});
	imageFallbacks.command("add").description("Add an image fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksAddCommand(model, defaultRuntime);
		});
	});
	imageFallbacks.command("remove").description("Remove an image fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksRemoveCommand(model, defaultRuntime);
		});
	});
	imageFallbacks.command("clear").description("Clear all image fallback models").action(async () => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksClearCommand(defaultRuntime);
		});
	});
	models.command("scan").description("Scan OpenRouter free models for tools + images").option("--min-params <b>", "Minimum parameter size (billions)").option("--max-age-days <days>", "Skip models older than N days").option("--provider <name>", "Filter by provider prefix").option("--max-candidates <n>", "Max fallback candidates", "6").option("--timeout <ms>", "Per-probe timeout in ms").option("--concurrency <n>", "Probe concurrency").option("--no-probe", "Skip live probes; list free candidates only").option("--yes", "Accept defaults without prompting", false).option("--no-input", "Disable prompts (use defaults)").option("--set-default", "Set agents.defaults.model to the first selection", false).option("--set-image", "Set agents.defaults.imageModel to the first image selection", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsScanCommand(opts, defaultRuntime);
		});
	});
	models.action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsStatusCommand({
				json: Boolean(opts?.statusJson),
				plain: Boolean(opts?.statusPlain),
				agent: opts?.agent
			}, defaultRuntime);
		});
	});
	const auth = models.command("auth").description("Manage model auth profiles");
	auth.option("--agent <id>", "Agent id for auth order get/set/clear");
	auth.action(() => {
		auth.help();
	});
	auth.command("add").description("Interactive auth helper (setup-token or paste token)").action(async () => {
		await runModelsCommand(async () => {
			await modelsAuthAddCommand({}, defaultRuntime);
		});
	});
	auth.command("login").description("Run a provider plugin auth flow (OAuth/API key)").option("--provider <id>", "Provider id registered by a plugin").option("--method <id>", "Provider auth method id").option("--set-default", "Apply the provider's default model recommendation", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthLoginCommand({
				provider: opts.provider,
				method: opts.method,
				setDefault: Boolean(opts.setDefault)
			}, defaultRuntime);
		});
	});
	auth.command("setup-token").description("Run a provider CLI to create/sync a token (TTY required)").option("--provider <name>", "Provider id (default: anthropic)").option("--yes", "Skip confirmation", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthSetupTokenCommand({
				provider: opts.provider,
				yes: Boolean(opts.yes)
			}, defaultRuntime);
		});
	});
	auth.command("paste-token").description("Paste a token into auth-profiles.json and update config").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--profile-id <id>", "Auth profile id (default: <provider>:manual)").option("--expires-in <duration>", "Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.").action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthPasteTokenCommand({
				provider: opts.provider,
				profileId: opts.profileId,
				expiresIn: opts.expiresIn
			}, defaultRuntime);
		});
	});
	auth.command("login-github-copilot").description("Login to GitHub Copilot via GitHub device flow (TTY required)").option("--profile-id <id>", "Auth profile id (default: github-copilot:github)").option("--yes", "Overwrite existing profile without prompting", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await githubCopilotLoginCommand({
				profileId: opts.profileId,
				yes: Boolean(opts.yes)
			}, defaultRuntime);
		});
	});
	const order = auth.command("order").description("Manage per-agent auth profile order overrides");
	order.command("get").description("Show per-agent auth order override (from auth-profiles.json)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderGetCommand({
				provider: opts.provider,
				agent,
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
	order.command("set").description("Set per-agent auth order override (locks rotation to this list)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").argument("<profileIds...>", "Auth profile ids (e.g. anthropic:default)").action(async (profileIds, opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderSetCommand({
				provider: opts.provider,
				agent,
				order: profileIds
			}, defaultRuntime);
		});
	});
	order.command("clear").description("Clear per-agent auth order override (fall back to config/round-robin)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderClearCommand({
				provider: opts.provider,
				agent
			}, defaultRuntime);
		});
	});
}

//#endregion
export { registerModelsCli };