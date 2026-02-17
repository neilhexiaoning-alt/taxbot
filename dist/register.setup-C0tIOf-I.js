import { Dt as theme, _ as defaultRuntime, ut as shortenHomePath } from "./entry.js";
import "./auth-profiles-GYsKiVaE.js";
import "./exec-CBKBIMpA.js";
import { S as ensureAgentWorkspace, p as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-F21xRiu_.js";
import "./github-copilot-token-DuFIqfeC.js";
import "./model-CEWuUQPV.js";
import "./pi-model-discovery-EhM2JAQo.js";
import "./frontmatter-CEDVhyuu.js";
import "./skills-WdwyspYD.js";
import "./manifest-registry-QAG6awiS.js";
import { l as writeConfigFile, r as createConfigIO } from "./config-CF5WgkYh.js";
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
import { o as resolveSessionTranscriptsDir } from "./paths-iP6tOVPR.js";
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
import { t as hasExplicitOptions } from "./command-options-ypGpYUNI.js";
import "./daemon-runtime-DpjxIoTx.js";
import "./systemd-B6tvjHkP.js";
import "./service-BvvGeatd.js";
import "./health-BdRowCdl.js";
import "./onboarding-AsuVK6QL.js";
import "./shared-DQBJrhrA.js";
import "./auth-token-9aoEmy6K.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-BaDbOwCs.js";
import "./openai-model-default-DpjrUU6j.js";
import "./vllm-setup-BhM-ftxv.js";
import "./systemd-linger-CWzJNp6I.js";
import "./model-picker-B_AJWwXF.js";
import "./onboard-custom-D7pQJ0gR.js";
import { t as onboardCommand } from "./onboard-DWAu4Twj.js";
import JSON5 from "json5";
import fs from "node:fs/promises";

//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fs.readFile(configPath, "utf-8");
		const parsed = JSON5.parse(raw);
		if (parsed && typeof parsed === "object") return {
			exists: true,
			parsed
		};
		return {
			exists: true,
			parsed: {}
		};
	} catch {
		return {
			exists: false,
			parsed: {}
		};
	}
}
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const configPath = createConfigIO().configPath;
	const existingRaw = await readConfigFileRaw(configPath);
	const cfg = existingRaw.parsed;
	const defaults = cfg.agents?.defaults ?? {};
	const workspace = desiredWorkspace ?? defaults.workspace ?? DEFAULT_AGENT_WORKSPACE_DIR;
	const next = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				workspace
			}
		}
	};
	if (!existingRaw.exists || defaults.workspace !== workspace) {
		await writeConfigFile(next);
		if (!existingRaw.exists) runtime.log(`Wrote ${formatConfigPath(configPath)}`);
		else logConfigUpdated(runtime, {
			path: configPath,
			suffix: "(set agents.defaults.workspace)"
		});
	} else runtime.log(`Config OK: ${formatConfigPath(configPath)}`);
	const ws = await ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDir();
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}

//#endregion
//#region src/cli/program/register.setup.ts
function registerSetupCommand(program) {
	program.command("setup").description("Initialize ~/.openclaw/openclaw.json and the agent workspace").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace; stored as agents.defaults.workspace)").option("--wizard", "Run the interactive onboarding wizard", false).option("--non-interactive", "Run the wizard without prompts", false).option("--mode <mode>", "Wizard mode: local|remote").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const hasWizardFlags = hasExplicitOptions(command, [
				"wizard",
				"nonInteractive",
				"mode",
				"remoteUrl",
				"remoteToken"
			]);
			if (opts.wizard || hasWizardFlags) {
				await onboardCommand({
					workspace: opts.workspace,
					nonInteractive: Boolean(opts.nonInteractive),
					mode: opts.mode,
					remoteUrl: opts.remoteUrl,
					remoteToken: opts.remoteToken
				}, defaultRuntime);
				return;
			}
			await setupCommand({ workspace: opts.workspace }, defaultRuntime);
		});
	});
}

//#endregion
export { registerSetupCommand };