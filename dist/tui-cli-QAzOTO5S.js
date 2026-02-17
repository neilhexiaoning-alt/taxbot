import "./paths-B4BZAPZh.js";
import { B as theme } from "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
import "./registry-D74-I5q-.js";
import { f as defaultRuntime } from "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import "./agent-scope-5j4KiZmG.js";
import "./model-selection-DnrWKBOM.js";
import "./github-copilot-token-D2zp6kMZ.js";
import "./boolean-BsqeuxE6.js";
import "./env-DRL0O4y1.js";
import "./config-DTlZk19z.js";
import "./manifest-registry-DoaWeDHN.js";
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
import "./plugins-MECKrdj4.js";
import "./paths-CS8MdUIx.js";
import "./tool-images-B-uxwbUZ.js";
import "./tool-display-I-_BPOaX.js";
import "./commands-registry-B3a6qfAe.js";
import "./client-C1BL_CRC.js";
import "./call-wSDmIHBv.js";
import { t as formatDocsLink } from "./links-DCbJQ1uz.js";
import { t as parseTimeoutMs } from "./parse-timeout-cOhkPW_X.js";
import { t as runTui } from "./tui-CRTpgJsf.js";

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