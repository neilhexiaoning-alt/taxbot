import "./pi-embedded-helpers-DIV_C5J8.mjs";
import { st as loadOpenClawPlugins } from "./reply-CReGWUt7.mjs";
import "./paths-DcBT4Q4r.mjs";
import { c as resolveDefaultAgentId, s as resolveAgentWorkspaceDir } from "./agent-scope-BD88ooNs.mjs";
import { t as createSubsystemLogger } from "./subsystem-iSHcgawR.mjs";
import "./utils-D9-prTJL.mjs";
import "./exec-BRaJtAm2.mjs";
import "./model-selection-DNDKru6x.mjs";
import "./github-copilot-token-CewhQpWC.mjs";
import "./boolean-B7lX4AU9.mjs";
import "./env-DE0tkFHW.mjs";
import { i as loadConfig } from "./config-B_uz17RB.mjs";
import "./manifest-registry-BADIO_87.mjs";
import "./plugins-DSII6JvY.mjs";
import "./sandbox-oRz8OYlY.mjs";
import "./image-Dsy38YsT.mjs";
import "./pi-model-discovery-B6X6meeT.mjs";
import "./chrome-PKn2zNTL.mjs";
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

//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenClawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}

//#endregion
export { registerPluginCliCommands };