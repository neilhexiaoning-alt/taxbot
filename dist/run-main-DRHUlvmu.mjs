import "./pi-embedded-helpers-DIV_C5J8.mjs";
import { Dn as installUnhandledRejectionHandler } from "./reply-CReGWUt7.mjs";
import "./paths-DcBT4Q4r.mjs";
import "./agent-scope-BD88ooNs.mjs";
import { c as defaultRuntime, r as enableConsoleCapture } from "./subsystem-iSHcgawR.mjs";
import "./utils-D9-prTJL.mjs";
import "./exec-BRaJtAm2.mjs";
import "./model-selection-DNDKru6x.mjs";
import "./github-copilot-token-CewhQpWC.mjs";
import "./boolean-B7lX4AU9.mjs";
import { r as normalizeEnv, t as isTruthyEnvValue } from "./env-DE0tkFHW.mjs";
import { J as VERSION } from "./config-B_uz17RB.mjs";
import "./manifest-registry-BADIO_87.mjs";
import "./plugins-DSII6JvY.mjs";
import "./sandbox-oRz8OYlY.mjs";
import "./image-Dsy38YsT.mjs";
import "./pi-model-discovery-B6X6meeT.mjs";
import { E as formatUncaughtError } from "./chrome-PKn2zNTL.mjs";
import "./skills-Cb4fWMT0.mjs";
import "./routes-2qU-Bliw.mjs";
import "./server-context-CAvvAxGZ.mjs";
import "./message-channel-Ls7G_LaM.mjs";
import "./logging-sIVJ3oF8.mjs";
import "./accounts-Da593ZbL.mjs";
import "./paths-D0n0xdZb.mjs";
import "./redact-DjVwGPIJ.mjs";
import "./tool-display-C07JRsU3.mjs";
import "./deliver-DeFlE7gj.mjs";
import "./dispatcher-CWBZae0H.mjs";
import "./manager-s7p2EtXX.mjs";
import "./sqlite-CG_dxLw3.mjs";
import "./warnings-DCJmPZde.mjs";
import "./channel-summary-CADwe6FA.mjs";
import "./client-DgdwkhIS.mjs";
import "./call-DrwxBANw.mjs";
import "./login-qr-BEDNHQPL.mjs";
import "./pairing-store-bEGBKxWn.mjs";
import "./links-DX7cRSHU.mjs";
import "./progress-BYrleoMX.mjs";
import "./pi-tools.policy-DvvMN9Ge.mjs";
import "./prompt-style-DXmBJpDK.mjs";
import "./pairing-labels-JtCdT618.mjs";
import "./control-service-tDwWDpUV.mjs";
import "./restart-sentinel-BSJCs5vQ.mjs";
import "./channel-selection-CFHdlQsS.mjs";
import "./deps-C1EbislO.mjs";
import "./tailscale-4Z5W8e4e.mjs";
import { t as loadDotEnv } from "./dotenv-Ddu7lgmp.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-AOlAvuGZ.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-DFX3Ovni.mjs";
import { a as findRoutedCommand, n as emitCliBanner, t as ensureConfigReady } from "./config-guard-BmSEam-L.mjs";
import "./logging-BTIZSnJm.mjs";
import "./note-COgvwFa3.mjs";
import "./clack-prompter-CiUsChTN.mjs";
import "./onboarding-81PdWYa6.mjs";
import "./onboard-skills-CJmeZwSj.mjs";
import "./github-copilot-auth-DLp_veWW.mjs";
import "./onboard-channels-B7Nzchqn.mjs";
import "./plugin-auto-enable-DtZr53tO.mjs";
import "./archive-7jXYzIVl.mjs";
import "./installs-ChQ-kMei.mjs";
import "./health-format-CQglK8Ez.mjs";
import "./update-runner-Dy5Zj6kW.mjs";
import "./auth-CKLbBArb.mjs";
import "./audit-DMnpd9wB.mjs";
import "./table-DWsrGl_1.mjs";
import "./skills-status-B4i4oPU3.mjs";
import "./service-DhHo4Mch.mjs";
import "./systemd-UR47hdt4.mjs";
import "./service-audit-Cvhsjyh8.mjs";
import "./node-service-CSOsuHIp.mjs";
import "./channels-status-issues-WMEemfar.mjs";
import "./status.update-DcPF_ckr.mjs";
import { a as getCommandPath, c as getPrimaryCommand, d as hasHelpOrVersion } from "./register.subclis-B8vxNXy3.mjs";
import "./gateway-rpc-B6MBjPcg.mjs";
import "./help-format-Va6KVo1b.mjs";
import "./agent-_6k7z_IP.mjs";
import { t as ensurePluginRegistryLoaded } from "./plugin-registry-F6lXUqFD.mjs";
import "./configure-C1SagTxm.mjs";
import "./daemon-runtime-B-EHQzP_.mjs";
import "./systemd-linger-DSqFRbzY.mjs";
import "./widearea-dns-B2Uy-h8T.mjs";
import "./auth-health-DsWyh-I_.mjs";
import "./doctor-tgary4l1.mjs";
import "./hooks-status-DeeGK9W4.mjs";
import "./tui-DDeqszdv.mjs";
import process$1 from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

//#region src/cli/route.ts
async function prepareRoutedCommand(params) {
	emitCliBanner(VERSION, { argv: params.argv });
	await ensureConfigReady({
		runtime: defaultRuntime,
		commandPath: params.commandPath
	});
	if (params.loadPlugins) ensurePluginRegistryLoaded();
}
async function tryRouteCli(argv) {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) return false;
	if (hasHelpOrVersion(argv)) return false;
	const path = getCommandPath(argv, 2);
	if (!path[0]) return false;
	const route = findRoutedCommand(path);
	if (!route) return false;
	await prepareRoutedCommand({
		argv,
		commandPath: path,
		loadPlugins: route.loadPlugins
	});
	return route.run(argv);
}

//#endregion
//#region src/cli/run-main.ts
function rewriteUpdateFlagArgv(argv) {
	const index = argv.indexOf("--update");
	if (index === -1) return argv;
	const next = [...argv];
	next.splice(index, 1, "update");
	return next;
}
async function runCli(argv = process$1.argv) {
	const normalizedArgv = stripWindowsNodeExec(argv);
	loadDotEnv({ quiet: true });
	normalizeEnv();
	ensureOpenClawCliOnPath();
	assertSupportedRuntime();
	if (await tryRouteCli(normalizedArgv)) return;
	enableConsoleCapture();
	const { buildProgram } = await import("./program-D4Epj_jg.mjs").then((n) => n.t);
	const program = buildProgram();
	installUnhandledRejectionHandler();
	process$1.on("uncaughtException", (error) => {
		console.error("[openclaw] Uncaught exception:", formatUncaughtError(error));
		process$1.exit(1);
	});
	const parseArgv = rewriteUpdateFlagArgv(normalizedArgv);
	const primary = getPrimaryCommand(parseArgv);
	let primaryIsBuiltIn = false;
	if (primary) {
		const { registerSubCliByName } = await import("./register.subclis-B8vxNXy3.mjs").then((n) => n.i);
		primaryIsBuiltIn = await registerSubCliByName(program, primary);
	}
	if (!hasHelpOrVersion(parseArgv) && !primaryIsBuiltIn) {
		const { registerPluginCliCommands } = await import("./cli-DBubVaPh.mjs");
		const { loadConfig } = await import("./config-B_uz17RB.mjs").then((n) => n.t);
		registerPluginCliCommands(program, loadConfig());
	}
	await program.parseAsync(parseArgv);
}
function stripWindowsNodeExec(argv) {
	if (process$1.platform !== "win32") return argv;
	const stripControlChars = (value) => {
		let out = "";
		for (let i = 0; i < value.length; i += 1) {
			const code = value.charCodeAt(i);
			if (code >= 32 && code !== 127) out += value[i];
		}
		return out;
	};
	const normalizeArg = (value) => stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();
	const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\?\\/, "");
	const execPath = normalizeCandidate(process$1.execPath);
	const execPathLower = execPath.toLowerCase();
	const execBase = path.basename(execPath).toLowerCase();
	const isExecPath = (value) => {
		if (!value) return false;
		const normalized = normalizeCandidate(value);
		if (!normalized) return false;
		const lower = normalized.toLowerCase();
		return lower === execPathLower || path.basename(lower) === execBase || lower.endsWith("\\node.exe") || lower.endsWith("/node.exe") || lower.includes("node.exe") || path.basename(lower) === "node.exe" && fs.existsSync(normalized);
	};
	const filtered = argv.filter((arg, index) => index === 0 || !isExecPath(arg));
	if (filtered.length < 3) return filtered;
	const cleaned = [...filtered];
	if (isExecPath(cleaned[1])) cleaned.splice(1, 1);
	if (isExecPath(cleaned[2])) cleaned.splice(2, 1);
	return cleaned;
}

//#endregion
export { runCli };