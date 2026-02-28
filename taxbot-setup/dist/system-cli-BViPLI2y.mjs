import "./paths-DcBT4Q4r.mjs";
import "./agent-scope-BD88ooNs.mjs";
import { E as danger, R as theme, c as defaultRuntime } from "./subsystem-iSHcgawR.mjs";
import "./utils-D9-prTJL.mjs";
import "./exec-BRaJtAm2.mjs";
import "./model-selection-DNDKru6x.mjs";
import "./github-copilot-token-CewhQpWC.mjs";
import "./boolean-B7lX4AU9.mjs";
import "./env-DE0tkFHW.mjs";
import "./config-B_uz17RB.mjs";
import "./manifest-registry-BADIO_87.mjs";
import "./message-channel-Ls7G_LaM.mjs";
import "./client-DgdwkhIS.mjs";
import "./call-DrwxBANw.mjs";
import { t as formatDocsLink } from "./links-DX7cRSHU.mjs";
import "./progress-BYrleoMX.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-B6MBjPcg.mjs";

//#region src/cli/system-cli.ts
const normalizeWakeMode = (raw) => {
	const mode = typeof raw === "string" ? raw.trim() : "";
	if (!mode) return "next-heartbeat";
	if (mode === "now" || mode === "next-heartbeat") return mode;
	throw new Error("--mode must be now or next-heartbeat");
};
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.openclaw.ai/cli/system")}\n`);
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const text = typeof opts.text === "string" ? opts.text.trim() : "";
			if (!text) throw new Error("--text is required");
			const result = await callGatewayFromCli("wake", opts, {
				mode: normalizeWakeMode(opts.mode),
				text
			}, { expectFinal: false });
			if (opts.json) defaultRuntime.log(JSON.stringify(result, null, 2));
			else defaultRuntime.log("ok");
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	addGatewayClientOptions(heartbeat.command("last").description("Show the last heartbeat event").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const result = await callGatewayFromCli("last-heartbeat", opts, void 0, { expectFinal: false });
			defaultRuntime.log(JSON.stringify(result, null, 2));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	addGatewayClientOptions(heartbeat.command("enable").description("Enable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const result = await callGatewayFromCli("set-heartbeats", opts, { enabled: true }, { expectFinal: false });
			defaultRuntime.log(JSON.stringify(result, null, 2));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	addGatewayClientOptions(heartbeat.command("disable").description("Disable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const result = await callGatewayFromCli("set-heartbeats", opts, { enabled: false }, { expectFinal: false });
			defaultRuntime.log(JSON.stringify(result, null, 2));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	addGatewayClientOptions(system.command("presence").description("List system presence entries").option("--json", "Output JSON", false)).action(async (opts) => {
		try {
			const result = await callGatewayFromCli("system-presence", opts, void 0, { expectFinal: false });
			defaultRuntime.log(JSON.stringify(result, null, 2));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerSystemCli };