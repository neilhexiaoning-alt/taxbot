import { jt as loadOpenClawPlugins } from "./reply-B1AnbNl6.js";
import { t as createSubsystemLogger } from "./subsystem-CiM1FVu6.js";
import { E as resolveDefaultAgentWorkspaceDir, c as resolveDefaultAgentId, s as resolveAgentWorkspaceDir } from "./agent-scope-5j4KiZmG.js";
import { i as loadConfig } from "./config-DTlZk19z.js";

//#region src/plugins/status.ts
const log = createSubsystemLogger("plugins");
function buildPluginStatusReport(params) {
	const config = params?.config ?? loadConfig();
	const workspaceDir = params?.workspaceDir ? params.workspaceDir : resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config)) ?? resolveDefaultAgentWorkspaceDir();
	return {
		workspaceDir,
		...loadOpenClawPlugins({
			config,
			workspaceDir,
			logger: {
				info: (msg) => log.info(msg),
				warn: (msg) => log.warn(msg),
				error: (msg) => log.error(msg),
				debug: (msg) => log.debug(msg)
			}
		})
	};
}

//#endregion
export { buildPluginStatusReport as t };