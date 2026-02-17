import { t as isTruthyEnvValue } from "./env-DRL0O4y1.js";
import { a as hasHelpOrVersion, r as getPrimaryCommand, t as buildParseArgv } from "./argv-DazyWgMb.js";
import { r as resolveActionArgs } from "./helpers-fRxKNzeV.js";

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
const shouldRegisterPrimaryOnly = (argv) => {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS)) return false;
	if (hasHelpOrVersion(argv)) return false;
	return true;
};
const shouldEagerRegisterSubcommands = (_argv) => {
	return isTruthyEnvValue(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS);
};
const loadConfig = async () => {
	return (await import("./config-DTlZk19z.js").then((n) => n.t)).loadConfig();
};
const entries = [
	{
		name: "acp",
		description: "Agent Control Protocol tools",
		register: async (program) => {
			(await import("./acp-cli-CQfPBOuw.js")).registerAcpCli(program);
		}
	},
	{
		name: "gateway",
		description: "Gateway control",
		register: async (program) => {
			(await import("./gateway-cli-CRiBIFy7.js")).registerGatewayCli(program);
		}
	},
	{
		name: "daemon",
		description: "Gateway service (legacy alias)",
		register: async (program) => {
			(await import("./daemon-cli-DaaXGjCU.js").then((n) => n.t)).registerDaemonCli(program);
		}
	},
	{
		name: "logs",
		description: "Gateway logs",
		register: async (program) => {
			(await import("./logs-cli-L3CSl9eH.js")).registerLogsCli(program);
		}
	},
	{
		name: "system",
		description: "System events, heartbeat, and presence",
		register: async (program) => {
			(await import("./system-cli-BXmyBeHo.js")).registerSystemCli(program);
		}
	},
	{
		name: "models",
		description: "Model configuration",
		register: async (program) => {
			(await import("./models-cli-DWnKE7eL.js")).registerModelsCli(program);
		}
	},
	{
		name: "approvals",
		description: "Exec approvals",
		register: async (program) => {
			(await import("./exec-approvals-cli-CZyrek-7.js")).registerExecApprovalsCli(program);
		}
	},
	{
		name: "nodes",
		description: "Node commands",
		register: async (program) => {
			(await import("./nodes-cli-D0ZgQNZ0.js")).registerNodesCli(program);
		}
	},
	{
		name: "devices",
		description: "Device pairing + token management",
		register: async (program) => {
			(await import("./devices-cli-DjcKWmAx.js")).registerDevicesCli(program);
		}
	},
	{
		name: "node",
		description: "Node control",
		register: async (program) => {
			(await import("./node-cli-DNqkPOcj.js")).registerNodeCli(program);
		}
	},
	{
		name: "sandbox",
		description: "Sandbox tools",
		register: async (program) => {
			(await import("./sandbox-cli-fa79XFFH.js")).registerSandboxCli(program);
		}
	},
	{
		name: "tui",
		description: "Terminal UI",
		register: async (program) => {
			(await import("./tui-cli-QAzOTO5S.js")).registerTuiCli(program);
		}
	},
	{
		name: "cron",
		description: "Cron scheduler",
		register: async (program) => {
			(await import("./cron-cli-l3DditFa.js")).registerCronCli(program);
		}
	},
	{
		name: "dns",
		description: "DNS helpers",
		register: async (program) => {
			(await import("./dns-cli-Dq8rkPRa.js")).registerDnsCli(program);
		}
	},
	{
		name: "docs",
		description: "Docs helpers",
		register: async (program) => {
			(await import("./docs-cli-CEb-qAdm.js")).registerDocsCli(program);
		}
	},
	{
		name: "hooks",
		description: "Hooks tooling",
		register: async (program) => {
			(await import("./hooks-cli-CKgA2gDR.js")).registerHooksCli(program);
		}
	},
	{
		name: "webhooks",
		description: "Webhook helpers",
		register: async (program) => {
			(await import("./webhooks-cli-DzWNEJW4.js")).registerWebhooksCli(program);
		}
	},
	{
		name: "pairing",
		description: "Pairing helpers",
		register: async (program) => {
			const { registerPluginCliCommands } = await import("./cli-CanmW3Qe.js");
			registerPluginCliCommands(program, await loadConfig());
			(await import("./pairing-cli-BIN_TFfz.js")).registerPairingCli(program);
		}
	},
	{
		name: "plugins",
		description: "Plugin management",
		register: async (program) => {
			(await import("./plugins-cli-Bcpnp8wM.js")).registerPluginsCli(program);
			const { registerPluginCliCommands } = await import("./cli-CanmW3Qe.js");
			registerPluginCliCommands(program, await loadConfig());
		}
	},
	{
		name: "channels",
		description: "Channel management",
		register: async (program) => {
			(await import("./channels-cli-Bj7Xphwo.js")).registerChannelsCli(program);
		}
	},
	{
		name: "directory",
		description: "Directory commands",
		register: async (program) => {
			(await import("./directory-cli-BXA-5__j.js")).registerDirectoryCli(program);
		}
	},
	{
		name: "security",
		description: "Security helpers",
		register: async (program) => {
			(await import("./security-cli-CtSPpJNx.js")).registerSecurityCli(program);
		}
	},
	{
		name: "skills",
		description: "Skills management",
		register: async (program) => {
			(await import("./skills-cli-BRP7PGZh.js")).registerSkillsCli(program);
		}
	},
	{
		name: "update",
		description: "CLI update helpers",
		register: async (program) => {
			(await import("./update-cli-BRmlInID.js")).registerUpdateCli(program);
		}
	},
	{
		name: "completion",
		description: "Generate shell completion script",
		register: async (program) => {
			(await import("./completion-cli-DQNLvurY.js").then((n) => n.n)).registerCompletionCli(program);
		}
	}
];
function getSubCliEntries() {
	return entries;
}
function removeCommand$1(program, command) {
	const commands = program.commands;
	const index = commands.indexOf(command);
	if (index >= 0) commands.splice(index, 1);
}
async function registerSubCliByName(program, name) {
	const entry = entries.find((candidate) => candidate.name === name);
	if (!entry) return false;
	const existing = program.commands.find((cmd) => cmd.name() === entry.name);
	if (existing) removeCommand$1(program, existing);
	await entry.register(program);
	return true;
}
function registerLazyCommand(program, entry) {
	const placeholder = program.command(entry.name).description(entry.description);
	placeholder.allowUnknownOption(true);
	placeholder.allowExcessArguments(true);
	placeholder.action(async (...actionArgs) => {
		removeCommand$1(program, placeholder);
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
//#region src/cli/program/command-registry.ts
const shouldRegisterCorePrimaryOnly = (argv) => {
	if (hasHelpOrVersion(argv)) return false;
	return true;
};
const coreEntries = [
	{
		commands: [{
			name: "setup",
			description: "Setup helpers"
		}],
		register: async ({ program }) => {
			(await import("./register.setup-B91x6YaT.js")).registerSetupCommand(program);
		}
	},
	{
		commands: [{
			name: "onboard",
			description: "Onboarding helpers"
		}],
		register: async ({ program }) => {
			(await import("./register.onboard-DVBdWsKX.js")).registerOnboardCommand(program);
		}
	},
	{
		commands: [{
			name: "configure",
			description: "Configure wizard"
		}],
		register: async ({ program }) => {
			(await import("./register.configure-DxC7ag-1.js")).registerConfigureCommand(program);
		}
	},
	{
		commands: [{
			name: "config",
			description: "Config helpers"
		}],
		register: async ({ program }) => {
			(await import("./config-cli-ncwvPLpc.js")).registerConfigCli(program);
		}
	},
	{
		commands: [
			{
				name: "doctor",
				description: "Health checks + quick fixes for the gateway and channels"
			},
			{
				name: "dashboard",
				description: "Open the Control UI with your current token"
			},
			{
				name: "reset",
				description: "Reset local config/state (keeps the CLI installed)"
			},
			{
				name: "uninstall",
				description: "Uninstall the gateway service + local data (CLI remains)"
			}
		],
		register: async ({ program }) => {
			(await import("./register.maintenance-BFp4uuRp.js")).registerMaintenanceCommands(program);
		}
	},
	{
		commands: [{
			name: "message",
			description: "Send, read, and manage messages"
		}],
		register: async ({ program, ctx }) => {
			(await import("./register.message-CPqmzxz_.js")).registerMessageCommands(program, ctx);
		}
	},
	{
		commands: [{
			name: "memory",
			description: "Memory commands"
		}],
		register: async ({ program }) => {
			(await import("./memory-cli-34wXZGhd.js").then((n) => n.t)).registerMemoryCli(program);
		}
	},
	{
		commands: [{
			name: "agent",
			description: "Agent commands"
		}, {
			name: "agents",
			description: "Manage isolated agents"
		}],
		register: async ({ program, ctx }) => {
			(await import("./register.agent-Duk1eZX2.js")).registerAgentCommands(program, { agentChannelOptions: ctx.agentChannelOptions });
		}
	},
	{
		commands: [
			{
				name: "status",
				description: "Gateway status"
			},
			{
				name: "health",
				description: "Gateway health"
			},
			{
				name: "sessions",
				description: "Session management"
			}
		],
		register: async ({ program }) => {
			(await import("./register.status-health-sessions-BqfjZZWf.js")).registerStatusHealthSessionsCommands(program);
		}
	},
	{
		commands: [{
			name: "browser",
			description: "Browser tools"
		}],
		register: async ({ program }) => {
			(await import("./browser-cli-BKosi02D.js")).registerBrowserCli(program);
		}
	}
];
function getCoreCliCommandNames() {
	const seen = /* @__PURE__ */ new Set();
	const names = [];
	for (const entry of coreEntries) for (const cmd of entry.commands) {
		if (seen.has(cmd.name)) continue;
		seen.add(cmd.name);
		names.push(cmd.name);
	}
	return names;
}
function removeCommand(program, command) {
	const commands = program.commands;
	const index = commands.indexOf(command);
	if (index >= 0) commands.splice(index, 1);
}
function registerLazyCoreCommand(program, ctx, entry, command) {
	const placeholder = program.command(command.name).description(command.description);
	placeholder.allowUnknownOption(true);
	placeholder.allowExcessArguments(true);
	placeholder.action(async (...actionArgs) => {
		for (const cmd of entry.commands) {
			const existing = program.commands.find((c) => c.name() === cmd.name);
			if (existing) removeCommand(program, existing);
		}
		await entry.register({
			program,
			ctx,
			argv: process.argv
		});
		await reparseProgramFromActionArgs(program, actionArgs);
	});
}
async function registerCoreCliByName(program, ctx, name, argv = process.argv) {
	const entry = coreEntries.find((candidate) => candidate.commands.some((cmd) => cmd.name === name));
	if (!entry) return false;
	for (const cmd of entry.commands) {
		const existing = program.commands.find((c) => c.name() === cmd.name);
		if (existing) removeCommand(program, existing);
	}
	await entry.register({
		program,
		ctx,
		argv
	});
	return true;
}
function registerCoreCliCommands(program, ctx, argv) {
	const primary = getPrimaryCommand(argv);
	if (primary && shouldRegisterCorePrimaryOnly(argv)) {
		const entry = coreEntries.find((candidate) => candidate.commands.some((cmd) => cmd.name === primary));
		if (entry) {
			const cmd = entry.commands.find((c) => c.name === primary);
			if (cmd) registerLazyCoreCommand(program, ctx, entry, cmd);
			return;
		}
	}
	for (const entry of coreEntries) for (const cmd of entry.commands) registerLazyCoreCommand(program, ctx, entry, cmd);
}
function registerProgramCommands(program, ctx, argv = process.argv) {
	registerCoreCliCommands(program, ctx, argv);
	registerSubCliCommands(program, argv);
}

//#endregion
//#region src/cli/program/program-context.ts
const PROGRAM_CONTEXT_SYMBOL = Symbol.for("openclaw.cli.programContext");
function setProgramContext(program, ctx) {
	program[PROGRAM_CONTEXT_SYMBOL] = ctx;
}
function getProgramContext(program) {
	return program[PROGRAM_CONTEXT_SYMBOL];
}

//#endregion
export { registerProgramCommands as a, registerCoreCliByName as i, setProgramContext as n, getSubCliEntries as o, getCoreCliCommandNames as r, registerSubCliByName as s, getProgramContext as t };