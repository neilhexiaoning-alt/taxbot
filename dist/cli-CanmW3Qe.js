import "./paths-B4BZAPZh.js";
import "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
import { jt as loadOpenClawPlugins } from "./reply-B1AnbNl6.js";
import "./registry-D74-I5q-.js";
import { t as createSubsystemLogger } from "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import { c as resolveDefaultAgentId, s as resolveAgentWorkspaceDir } from "./agent-scope-5j4KiZmG.js";
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
import "./sessions-B1VYnsjk.js";
import "./dock-CEzRHF7-.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./send-D5zBwK2f.js";
import "./plugins-MECKrdj4.js";
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