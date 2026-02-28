#!/usr/bin/env node
import "./paths-DcBT4Q4r.mjs";
import "./subsystem-iSHcgawR.mjs";
import { t as isValidProfileName } from "./profile-utils-CqLvImDW.mjs";
import "./boolean-B7lX4AU9.mjs";
import { r as normalizeEnv, t as isTruthyEnvValue } from "./env-DE0tkFHW.mjs";
import { t as installProcessWarningFilter } from "./warnings-DCJmPZde.mjs";
import process$1 from "node:process";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

//#region src/cli/profile.ts
function takeValue(raw, next) {
	if (raw.includes("=")) {
		const [, value] = raw.split("=", 2);
		return {
			value: (value ?? "").trim() || null,
			consumedNext: false
		};
	}
	return {
		value: (next ?? "").trim() || null,
		consumedNext: Boolean(next)
	};
}
function parseCliProfileArgs(argv) {
	if (argv.length < 2) return {
		ok: true,
		profile: null,
		argv
	};
	const out = argv.slice(0, 2);
	let profile = null;
	let sawDev = false;
	let sawCommand = false;
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (sawCommand) {
			out.push(arg);
			continue;
		}
		if (arg === "--dev") {
			if (profile && profile !== "dev") return {
				ok: false,
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			continue;
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			if (sawDev) return {
				ok: false,
				error: "Cannot combine --dev with --profile"
			};
			const next = args[i + 1];
			const { value, consumedNext } = takeValue(arg, next);
			if (consumedNext) i += 1;
			if (!value) return {
				ok: false,
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				ok: false,
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			continue;
		}
		if (!arg.startsWith("-")) {
			sawCommand = true;
			out.push(arg);
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		profile,
		argv: out
	};
}
function resolveProfileStateDir(profile, homedir) {
	const suffix = profile.toLowerCase() === "default" ? "" : `-${profile}`;
	return path.join(homedir(), `.openclaw${suffix}`);
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	env.OPENCLAW_PROFILE = profile;
	const stateDir = env.OPENCLAW_STATE_DIR?.trim() || resolveProfileStateDir(profile, homedir);
	if (!env.OPENCLAW_STATE_DIR?.trim()) env.OPENCLAW_STATE_DIR = stateDir;
	if (!env.OPENCLAW_CONFIG_PATH?.trim()) env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	if (profile === "dev" && !env.OPENCLAW_GATEWAY_PORT?.trim()) env.OPENCLAW_GATEWAY_PORT = "19001";
}

//#endregion
//#region src/process/child-process-bridge.ts
const defaultSignals = process$1.platform === "win32" ? [
	"SIGTERM",
	"SIGINT",
	"SIGBREAK"
] : [
	"SIGTERM",
	"SIGINT",
	"SIGHUP",
	"SIGQUIT"
];
function attachChildProcessBridge(child, { signals = defaultSignals, onSignal } = {}) {
	const listeners = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const listener = () => {
			onSignal?.(signal);
			try {
				child.kill(signal);
			} catch {}
		};
		try {
			process$1.on(signal, listener);
			listeners.set(signal, listener);
		} catch {}
	}
	const detach = () => {
		for (const [signal, listener] of listeners) process$1.off(signal, listener);
		listeners.clear();
	};
	child.once("exit", detach);
	child.once("error", detach);
	return { detach };
}

//#endregion
//#region src/entry.ts
process$1.title = "openclaw";
installProcessWarningFilter();
normalizeEnv();
if (process$1.argv.includes("--no-color")) {
	process$1.env.NO_COLOR = "1";
	process$1.env.FORCE_COLOR = "0";
}
const EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
function hasExperimentalWarningSuppressed(nodeOptions) {
	if (!nodeOptions) return false;
	return nodeOptions.includes(EXPERIMENTAL_WARNING_FLAG) || nodeOptions.includes("--no-warnings");
}
function ensureExperimentalWarningSuppressed() {
	if (isTruthyEnvValue(process$1.env.OPENCLAW_NO_RESPAWN)) return false;
	if (isTruthyEnvValue(process$1.env.OPENCLAW_NODE_OPTIONS_READY)) return false;
	const nodeOptions = process$1.env.NODE_OPTIONS ?? "";
	if (hasExperimentalWarningSuppressed(nodeOptions)) return false;
	process$1.env.OPENCLAW_NODE_OPTIONS_READY = "1";
	process$1.env.NODE_OPTIONS = `${nodeOptions} ${EXPERIMENTAL_WARNING_FLAG}`.trim();
	const child = spawn(process$1.execPath, [...process$1.execArgv, ...process$1.argv.slice(1)], {
		stdio: "inherit",
		env: process$1.env
	});
	attachChildProcessBridge(child);
	child.once("exit", (code, signal) => {
		if (signal) {
			process$1.exitCode = 1;
			return;
		}
		process$1.exit(code ?? 1);
	});
	child.once("error", (error) => {
		console.error("[openclaw] Failed to respawn CLI:", error instanceof Error ? error.stack ?? error.message : error);
		process$1.exit(1);
	});
	return true;
}
function normalizeWindowsArgv(argv) {
	if (process$1.platform !== "win32") return argv;
	if (argv.length < 2) return argv;
	const stripControlChars = (value) => {
		let out = "";
		for (let i = 0; i < value.length; i += 1) {
			const code = value.charCodeAt(i);
			if (code >= 32 && code !== 127) out += value[i];
		}
		return out;
	};
	const normalizeArg = (value) => stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();
	const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\?\\/, "");
	const execPath = normalizeCandidate(process$1.execPath);
	const execPathLower = execPath.toLowerCase();
	const execBase = path.basename(execPath).toLowerCase();
	const isExecPath = (value) => {
		if (!value) return false;
		const lower = normalizeCandidate(value).toLowerCase();
		return lower === execPathLower || path.basename(lower) === execBase || lower.endsWith("\\node.exe") || lower.endsWith("/node.exe") || lower.includes("node.exe");
	};
	const next = [...argv];
	for (let i = 1; i <= 3 && i < next.length;) {
		if (isExecPath(next[i])) {
			next.splice(i, 1);
			continue;
		}
		i += 1;
	}
	const filtered = next.filter((arg, index) => index === 0 || !isExecPath(arg));
	if (filtered.length < 3) return filtered;
	const cleaned = [...filtered];
	for (let i = 2; i < cleaned.length;) {
		const arg = cleaned[i];
		if (!arg || arg.startsWith("-")) {
			i += 1;
			continue;
		}
		if (isExecPath(arg)) {
			cleaned.splice(i, 1);
			continue;
		}
		break;
	}
	return cleaned;
}
process$1.argv = normalizeWindowsArgv(process$1.argv);
if (!ensureExperimentalWarningSuppressed()) {
	const parsed = parseCliProfileArgs(process$1.argv);
	if (!parsed.ok) {
		console.error(`[openclaw] ${parsed.error}`);
		process$1.exit(2);
	}
	if (parsed.profile) {
		applyCliProfileEnv({ profile: parsed.profile });
		process$1.argv = parsed.argv;
	}
	import("./run-main-DRHUlvmu.mjs").then(({ runCli }) => runCli(process$1.argv)).catch((error) => {
		console.error("[openclaw] Failed to start CLI:", error instanceof Error ? error.stack ?? error.message : error);
		process$1.exitCode = 1;
	});
}

//#endregion
export {  };