import { t as __exportAll } from "./rolldown-runtime-Cbj13DAv.js";
import { an as getPrimaryCommand, cn as hasHelpOrVersion } from "./entry.js";
import { a as reparseProgramFromActionArgs, r as registerSubCliCommands } from "./register.subclis-BjMU-yM2.js";

//#region src/cli/program/command-registry.ts
var command_registry_exports = /* @__PURE__ */ __exportAll({
	getCoreCliCommandNames: () => getCoreCliCommandNames,
	registerCoreCliByName: () => registerCoreCliByName,
	registerCoreCliCommands: () => registerCoreCliCommands,
	registerProgramCommands: () => registerProgramCommands
});
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
			(await import("./register.setup-C0tIOf-I.js")).registerSetupCommand(program);
		}
	},
	{
		commands: [{
			name: "onboard",
			description: "Onboarding helpers"
		}],
		register: async ({ program }) => {
			(await import("./register.onboard-BlnZr72W.js")).registerOnboardCommand(program);
		}
	},
	{
		commands: [{
			name: "configure",
			description: "Configure wizard"
		}],
		register: async ({ program }) => {
			(await import("./register.configure-DpYQ0gzS.js")).registerConfigureCommand(program);
		}
	},
	{
		commands: [{
			name: "config",
			description: "Config helpers"
		}],
		register: async ({ program }) => {
			(await import("./config-cli-DtCzDvg8.js")).registerConfigCli(program);
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
			(await import("./register.maintenance-5iRA15ga.js")).registerMaintenanceCommands(program);
		}
	},
	{
		commands: [{
			name: "message",
			description: "Send, read, and manage messages"
		}],
		register: async ({ program, ctx }) => {
			(await import("./register.message-Bmr4nBTc.js")).registerMessageCommands(program, ctx);
		}
	},
	{
		commands: [{
			name: "memory",
			description: "Memory commands"
		}],
		register: async ({ program }) => {
			(await import("./memory-cli-Dwo-v-iX.js").then((n) => n.t)).registerMemoryCli(program);
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
			(await import("./register.agent-Bv5-pF0r.js")).registerAgentCommands(program, { agentChannelOptions: ctx.agentChannelOptions });
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
			(await import("./register.status-health-sessions-Du3QCfZ-.js")).registerStatusHealthSessionsCommands(program);
		}
	},
	{
		commands: [{
			name: "browser",
			description: "Browser tools"
		}],
		register: async ({ program }) => {
			(await import("./browser-cli-D92JrCcK.js")).registerBrowserCli(program);
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
export { registerProgramCommands as i, getCoreCliCommandNames as n, registerCoreCliByName as r, command_registry_exports as t };