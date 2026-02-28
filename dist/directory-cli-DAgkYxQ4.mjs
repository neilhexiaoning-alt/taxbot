import "./paths-DcBT4Q4r.mjs";
import "./agent-scope-BD88ooNs.mjs";
import { E as danger, R as theme, c as defaultRuntime } from "./subsystem-iSHcgawR.mjs";
import "./utils-D9-prTJL.mjs";
import "./exec-BRaJtAm2.mjs";
import "./model-selection-DNDKru6x.mjs";
import "./github-copilot-token-CewhQpWC.mjs";
import "./boolean-B7lX4AU9.mjs";
import "./env-DE0tkFHW.mjs";
import { i as loadConfig } from "./config-B_uz17RB.mjs";
import "./manifest-registry-BADIO_87.mjs";
import { t as getChannelPlugin } from "./plugins-DSII6JvY.mjs";
import "./message-channel-Ls7G_LaM.mjs";
import "./logging-sIVJ3oF8.mjs";
import "./accounts-Da593ZbL.mjs";
import { t as formatDocsLink } from "./links-DX7cRSHU.mjs";
import { n as resolveMessageChannelSelection } from "./channel-selection-CFHdlQsS.mjs";
import { n as resolveChannelDefaultAccountId } from "./helpers--sAxmx1H.mjs";
import { t as renderTable } from "./table-DWsrGl_1.mjs";

//#region src/cli/directory-cli.ts
function parseLimit(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		if (value <= 0) return null;
		return Math.floor(value);
	}
	if (typeof value !== "string") return null;
	const raw = value.trim();
	if (!raw) return null;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed) || parsed <= 0) return null;
	return parsed;
}
function buildRows(entries) {
	return entries.map((entry) => ({
		ID: entry.id,
		Name: entry.name?.trim() ?? ""
	}));
}
function registerDirectoryCli(program) {
	const directory = program.command("directory").description("Directory lookups (self, peers, groups) for channels that support it").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/directory", "docs.openclaw.ai/cli/directory")}\n`).action(() => {
		directory.help({ error: true });
	});
	const withChannel = (cmd) => cmd.option("--channel <name>", "Channel (auto when only one is configured)").option("--account <id>", "Account id (accountId)").option("--json", "Output JSON", false);
	const resolve = async (opts) => {
		const cfg = loadConfig();
		const channelId = (await resolveMessageChannelSelection({
			cfg,
			channel: opts.channel ?? null
		})).channel;
		const plugin = getChannelPlugin(channelId);
		if (!plugin) throw new Error(`Unsupported channel: ${String(channelId)}`);
		return {
			cfg,
			channelId,
			accountId: opts.account?.trim() || resolveChannelDefaultAccountId({
				plugin,
				cfg
			}),
			plugin
		};
	};
	withChannel(directory.command("self").description("Show the current account user")).action(async (opts) => {
		try {
			const { cfg, channelId, accountId, plugin } = await resolve({
				channel: opts.channel,
				account: opts.account
			});
			const fn = plugin.directory?.self;
			if (!fn) throw new Error(`Channel ${channelId} does not support directory self`);
			const result = await fn({
				cfg,
				accountId,
				runtime: defaultRuntime
			});
			if (opts.json) {
				defaultRuntime.log(JSON.stringify(result, null, 2));
				return;
			}
			if (!result) {
				defaultRuntime.log(theme.muted("Not available."));
				return;
			}
			const tableWidth = Math.max(60, (process.stdout.columns ?? 120) - 1);
			defaultRuntime.log(theme.heading("Self"));
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				}, {
					key: "Name",
					header: "Name",
					minWidth: 18,
					flex: true
				}],
				rows: buildRows([result])
			}).trimEnd());
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	withChannel(directory.command("peers").description("Peer directory (contacts/users)").command("list").description("List peers")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action(async (opts) => {
		try {
			const { cfg, channelId, accountId, plugin } = await resolve({
				channel: opts.channel,
				account: opts.account
			});
			const fn = plugin.directory?.listPeers;
			if (!fn) throw new Error(`Channel ${channelId} does not support directory peers`);
			const result = await fn({
				cfg,
				accountId,
				query: opts.query ?? null,
				limit: parseLimit(opts.limit),
				runtime: defaultRuntime
			});
			if (opts.json) {
				defaultRuntime.log(JSON.stringify(result, null, 2));
				return;
			}
			if (result.length === 0) {
				defaultRuntime.log(theme.muted("No peers found."));
				return;
			}
			const tableWidth = Math.max(60, (process.stdout.columns ?? 120) - 1);
			defaultRuntime.log(`${theme.heading("Peers")} ${theme.muted(`(${result.length})`)}`);
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				}, {
					key: "Name",
					header: "Name",
					minWidth: 18,
					flex: true
				}],
				rows: buildRows(result)
			}).trimEnd());
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	const groups = directory.command("groups").description("Group directory");
	withChannel(groups.command("list").description("List groups")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action(async (opts) => {
		try {
			const { cfg, channelId, accountId, plugin } = await resolve({
				channel: opts.channel,
				account: opts.account
			});
			const fn = plugin.directory?.listGroups;
			if (!fn) throw new Error(`Channel ${channelId} does not support directory groups`);
			const result = await fn({
				cfg,
				accountId,
				query: opts.query ?? null,
				limit: parseLimit(opts.limit),
				runtime: defaultRuntime
			});
			if (opts.json) {
				defaultRuntime.log(JSON.stringify(result, null, 2));
				return;
			}
			if (result.length === 0) {
				defaultRuntime.log(theme.muted("No groups found."));
				return;
			}
			const tableWidth = Math.max(60, (process.stdout.columns ?? 120) - 1);
			defaultRuntime.log(`${theme.heading("Groups")} ${theme.muted(`(${result.length})`)}`);
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				}, {
					key: "Name",
					header: "Name",
					minWidth: 18,
					flex: true
				}],
				rows: buildRows(result)
			}).trimEnd());
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	withChannel(groups.command("members").description("List group members").requiredOption("--group-id <id>", "Group id")).option("--limit <n>", "Limit results").action(async (opts) => {
		try {
			const { cfg, channelId, accountId, plugin } = await resolve({
				channel: opts.channel,
				account: opts.account
			});
			const fn = plugin.directory?.listGroupMembers;
			if (!fn) throw new Error(`Channel ${channelId} does not support group members listing`);
			const groupId = String(opts.groupId ?? "").trim();
			if (!groupId) throw new Error("Missing --group-id");
			const result = await fn({
				cfg,
				accountId,
				groupId,
				limit: parseLimit(opts.limit),
				runtime: defaultRuntime
			});
			if (opts.json) {
				defaultRuntime.log(JSON.stringify(result, null, 2));
				return;
			}
			if (result.length === 0) {
				defaultRuntime.log(theme.muted("No group members found."));
				return;
			}
			const tableWidth = Math.max(60, (process.stdout.columns ?? 120) - 1);
			defaultRuntime.log(`${theme.heading("Group Members")} ${theme.muted(`(${result.length})`)}`);
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				}, {
					key: "Name",
					header: "Name",
					minWidth: 18,
					flex: true
				}],
				rows: buildRows(result)
			}).trimEnd());
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerDirectoryCli };