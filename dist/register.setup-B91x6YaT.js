import "./paths-B4BZAPZh.js";
import { B as theme, C as shortenHomePath } from "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
import "./reply-B1AnbNl6.js";
import "./registry-D74-I5q-.js";
import { f as defaultRuntime } from "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import { S as ensureAgentWorkspace, p as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-5j4KiZmG.js";
import "./model-selection-DnrWKBOM.js";
import "./github-copilot-token-D2zp6kMZ.js";
import "./boolean-BsqeuxE6.js";
import "./env-DRL0O4y1.js";
import { l as writeConfigFile, r as createConfigIO } from "./config-DTlZk19z.js";
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
import "./sessions-B1VYnsjk.js";
import "./dock-CEzRHF7-.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./send-D5zBwK2f.js";
import "./plugins-MECKrdj4.js";
import "./send-j6ZvUzIo.js";
import { o as resolveSessionTranscriptsDir } from "./paths-CS8MdUIx.js";
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
import "./note-DjnX9YFe.js";
import "./clack-prompter-D10YJwlj.js";
import { t as hasExplicitOptions } from "./command-options-lo7lW1mW.js";
import "./daemon-runtime-B64hB5JZ.js";
import "./systemd-DTzLtG5-.js";
import "./service-DbIgGSI-.js";
import "./health-UGlyqH-a.js";
import "./onboarding-Dn9VCalp.js";
import "./shared-DdvyCVeh.js";
import "./auth-token-oyH5CUBR.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-CM4P2SKc.js";
import "./openai-model-default-DpnGdnY0.js";
import "./vllm-setup-CZoo2oOE.js";
import "./systemd-linger-CULlWf-A.js";
import "./model-picker-T9_v0ftZ.js";
import "./onboard-custom-lbcLnvMe.js";
import { t as onboardCommand } from "./onboard-ClOXKJhN.js";
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