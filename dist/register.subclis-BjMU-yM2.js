import { t as __exportAll } from "./rolldown-runtime-Cbj13DAv.js";
import { an as getPrimaryCommand, cn as hasHelpOrVersion, n as isTruthyEnvValue, tn as buildParseArgv } from "./entry.js";
import { r as resolveActionArgs } from "./helpers-DrQky-et.js";

//#region src/cli/program/action-reparse.ts
async function reparseProgramFromActionArgs(program, actionArgs) {
	const actionCommand = actionArgs.at(-1);
	const rawArgs = (actionCommand?.parent ?? program).rawArgs;
	const actionArgsList = resolveActionArgs(actionCommand);
	const fallbackArgv = actionCommand?.name() ? [actionCommand.name(), ...actionArgsList] : actionArgsList;
	const parseArgv = buildParseArgv({
		programName: program.name(),
		rawArgs,
		fallbackArgv
	});
	await program.parseAsync(parseArgv);
}

//#endregion
//#region src/cli/program/register.subclis.ts
var register_subclis_exports = /* @__PURE__ */ __exportAll({
	getSubCliEntries: () => getSubCliEntries,
	registerSubCliByName: () => registerSubCliByName,
	registerSubCliCommands: () => registerSubCliCommands
});
const shouldRegisterPrimaryOnly = (argv) => {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS)) return false;
	if (hasHelpOrVersion(argv)) return false;
	return true;
};
const shouldEagerRegisterSubcommands = (_argv) => {
	return isTruthyEnvValue(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS);
};
const loadConfig = async () => {
	return (await import("./config-CF5WgkYh.js").then((n) => n.t)).loadConfig();
};
const entries = [
	{
		name: "acp",
		description: "Agent Control Protocol tools",
		register: async (program) => {
			(await import("./acp-cli-DwLw02yB.js")).registerAcpCli(program);
		}
	},
	{
		name: "gateway",
		description: "Gateway control",
		register: async (program) => {
			(await import("./gateway-cli-LXqx2qUF.js")).registerGatewayCli(program);
		}
	},
	{
		name: "daemon",
		description: "Gateway service (legacy alias)",
		register: async (program) => {
			(await import("./daemon-cli-BJk2my4o.js").then((n) => n.t)).registerDaemonCli(program);
		}
	},
	{
		name: "logs",
		description: "Gateway logs",
		register: async (program) => {
			(await import("./logs-cli-C9cJBXys.js")).registerLogsCli(program);
		}
	},
	{
		name: "system",
		description: "System events, heartbeat, and presence",
		register: async (program) => {
			(await import("./system-cli-BJyqunUd.js")).registerSystemCli(program);
		}
	},
	{
		name: "models",
		description: "Model configuration",
		register: async (program) => {
			(await import("./models-cli-DZxXw7DN.js")).registerModelsCli(program);
		}
	},
	{
		name: "approvals",
		description: "Exec approvals",
		register: async (program) => {
			(await import("./exec-approvals-cli-CtwS46vi.js")).registerExecApprovalsCli(program);
		}
	},
	{
		name: "nodes",
		description: "Node commands",
		register: async (program) => {
			(await import("./nodes-cli-BMlXiid_.js")).registerNodesCli(program);
		}
	},
	{
		name: "devices",
		description: "Device pairing + token management",
		register: async (program) => {
			(await import("./devices-cli-H0zCFD1Z.js")).registerDevicesCli(program);
		}
	},
	{
		name: "node",
		description: "Node control",
		register: async (program) => {
			(await import("./node-cli-DP3YjmcU.js")).registerNodeCli(program);
		}
	},
	{
		name: "sandbox",
		description: "Sandbox tools",
		register: async (program) => {
			(await import("./sandbox-cli-Cfa7dL2-.js")).registerSandboxCli(program);
		}
	},
	{
		name: "tui",
		description: "Terminal UI",
		register: async (program) => {
			(await import("./tui-cli-B6KOyDnB.js")).registerTuiCli(program);
		}
	},
	{
		name: "cron",
		description: "Cron scheduler",
		register: async (program) => {
			(await import("./cron-cli-CeKWtNhW.js")).registerCronCli(program);
		}
	},
	{
		name: "dns",
		description: "DNS helpers",
		register: async (program) => {
			(await import("./dns-cli-B6t00vL6.js")).registerDnsCli(program);
		}
	},
	{
		name: "docs",
		description: "Docs helpers",
		register: async (program) => {
			(await import("./docs-cli-D7BvSNDi.js")).registerDocsCli(program);
		}
	},
	{
		name: "hooks",
		description: "Hooks tooling",
		register: async (program) => {
			(await import("./hooks-cli-ThrXPEVs.js")).registerHooksCli(program);
		}
	},
	{
		name: "webhooks",
		description: "Webhook helpers",
		register: async (program) => {
			(await import("./webhooks-cli-BnlH1hSx.js")).registerWebhooksCli(program);
		}
	},
	{
		name: "pairing",
		description: "Pairing helpers",
		register: async (program) => {
			const { registerPluginCliCommands } = await import("./cli-DQDEt4vk.js");
			registerPluginCliCommands(program, await loadConfig());
			(await import("./pairing-cli-BiS6BdTO.js")).registerPairingCli(program);
		}
	},
	{
		name: "plugins",
		description: "Plugin management",
		register: async (program) => {
			(await import("./plugins-cli-Bx8WRB35.js")).registerPluginsCli(program);
			const { registerPluginCliCommands } = await import("./cli-DQDEt4vk.js");
			registerPluginCliCommands(program, await loadConfig());
		}
	},
	{
		name: "channels",
		description: "Channel management",
		register: async (program) => {
			(await import("./channels-cli-tWn7Hn-7.js")).registerChannelsCli(program);
		}
	},
	{
		name: "directory",
		description: "Directory commands",
		register: async (program) => {
			(await import("./directory-cli-CnZ253Ci.js")).registerDirectoryCli(program);
		}
	},
	{
		name: "security",
		description: "Security helpers",
		register: async (program) => {
			(await import("./security-cli-DbUU2myt.js")).registerSecurityCli(program);
		}
	},
	{
		name: "skills",
		description: "Skills management",
		register: async (program) => {
			(await import("./skills-cli-cirpZgBO.js")).registerSkillsCli(program);
		}
	},
	{
		name: "update",
		description: "CLI update helpers",
		register: async (program) => {
			(await import("./update-cli-BScA8PWO.js")).registerUpdateCli(program);
		}
	},
	{
		name: "completion",
		description: "Generate shell completion script",
		register: async (program) => {
			(await import("./completion-cli-DB51lSHS.js").then((n) => n.n)).registerCompletionCli(program);
		}
	}
];
function getSubCliEntries() {
	return entries;
}
function removeCommand(program, command) {
	const commands = program.commands;
	const index = commands.indexOf(command);
	if (index >= 0) commands.splice(index, 1);
}
async function registerSubCliByName(program, name) {
	const entry = entries.find((candidate) => candidate.name === name);
	if (!entry) return false;
	const existing = program.commands.find((cmd) => cmd.name() === entry.name);
	if (existing) removeCommand(program, existing);
	await entry.register(program);
	return true;
}
function registerLazyCommand(program, entry) {
	const placeholder = program.command(entry.name).description(entry.description);
	placeholder.allowUnknownOption(true);
	placeholder.allowExcessArguments(true);
	placeholder.action(async (...actionArgs) => {
		removeCommand(program, placeholder);
		await entry.register(program);
		await reparseProgramFromActionArgs(program, actionArgs);
	});
}
function registerSubCliCommands(program, argv = process.argv) {
	if (shouldEagerRegisterSubcommands(argv)) {
		for (const entry of entries) entry.register(program);
		return;
	}
	const primary = getPrimaryCommand(argv);
	if (primary && shouldRegisterPrimaryOnly(argv)) {
		const entry = entries.find((candidate) => candidate.name === primary);
		if (entry) {
			registerLazyCommand(program, entry);
			return;
		}
	}
	for (const candidate of entries) registerLazyCommand(program, candidate);
}

//#endregion
export { reparseProgramFromActionArgs as a, register_subclis_exports as i, registerSubCliByName as n, registerSubCliCommands as r, getSubCliEntries as t };