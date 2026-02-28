import "./pi-embedded-helpers-DIV_C5J8.mjs";
import "./paths-DcBT4Q4r.mjs";
import "./agent-scope-BD88ooNs.mjs";
import { R as theme, c as defaultRuntime } from "./subsystem-iSHcgawR.mjs";
import "./utils-D9-prTJL.mjs";
import "./exec-BRaJtAm2.mjs";
import "./model-selection-DNDKru6x.mjs";
import "./github-copilot-token-CewhQpWC.mjs";
import "./boolean-B7lX4AU9.mjs";
import "./env-DE0tkFHW.mjs";
import "./config-B_uz17RB.mjs";
import "./manifest-registry-BADIO_87.mjs";
import "./plugins-DSII6JvY.mjs";
import "./sandbox-oRz8OYlY.mjs";
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
import "./channel-summary-CADwe6FA.mjs";
import "./client-DgdwkhIS.mjs";
import { t as formatDocsLink } from "./links-DX7cRSHU.mjs";
import { t as parseTimeoutMs } from "./parse-timeout-Ch4AYAvK.mjs";
import { t as runTui } from "./tui-DDeqszdv.mjs";

//#region src/cli/tui-cli.ts
function registerTuiCli(program) {
	program.command("tui").description("Open a terminal UI connected to the Gateway").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`).action(async (opts) => {
		try {
			const timeoutMs = parseTimeoutMs(opts.timeoutMs);
			if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`);
			const historyLimit = Number.parseInt(String(opts.historyLimit ?? "200"), 10);
			await runTui({
				url: opts.url,
				token: opts.token,
				password: opts.password,
				session: opts.session,
				deliver: Boolean(opts.deliver),
				thinking: opts.thinking,
				message: opts.message,
				timeoutMs,
				historyLimit: Number.isNaN(historyLimit) ? void 0 : historyLimit
			});
		} catch (err) {
			defaultRuntime.error(String(err));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerTuiCli };