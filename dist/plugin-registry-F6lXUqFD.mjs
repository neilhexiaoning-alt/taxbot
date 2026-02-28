import { st as loadOpenClawPlugins } from "./reply-CReGWUt7.mjs";
import { c as resolveDefaultAgentId, s as resolveAgentWorkspaceDir } from "./agent-scope-BD88ooNs.mjs";
import { t as createSubsystemLogger } from "./subsystem-iSHcgawR.mjs";
import { i as loadConfig } from "./config-B_uz17RB.mjs";

//#region src/cli/command-options.ts
function hasExplicitOptions(command, names) {
	if (typeof command.getOptionValueSource !== "function") return false;
	return names.some((name) => command.getOptionValueSource(name) === "cli");
}

//#endregion
//#region src/cli/plugin-registry.ts
const log = createSubsystemLogger("plugins");
let pluginRegistryLoaded = false;
function ensurePluginRegistryLoaded() {
	if (pluginRegistryLoaded) return;
	const config = loadConfig();
	loadOpenClawPlugins({
		config,
		workspaceDir: resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config)),
		logger: {
			info: (msg) => log.info(msg),
			warn: (msg) => log.warn(msg),
			error: (msg) => log.error(msg),
			debug: (msg) => log.debug(msg)
		}
	});
	pluginRegistryLoaded = true;
}

//#endregion
export { hasExplicitOptions as n, ensurePluginRegistryLoaded as t };