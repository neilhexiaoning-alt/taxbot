import { U as CONFIG_DIR, st as resolveUserPath } from "./entry.js";
import { a as resolveOpenClawManifestInstall, c as parseFrontmatterBlock, d as resolveRuntimePlatform, i as resolveOpenClawManifestBlock, l as hasBinary, n as normalizeStringList, o as resolveOpenClawManifestOs, r as parseFrontmatterBool, s as resolveOpenClawManifestRequires, t as getFrontmatterString, u as isConfigPathTruthyWithDefaults } from "./frontmatter-CEDVhyuu.js";
import { n as MANIFEST_KEY } from "./legacy-names-CGwVBoKR.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

//#region src/hooks/frontmatter.ts
function parseFrontmatter(content) {
	return parseFrontmatterBlock(content);
}
function parseInstallSpec(input) {
	if (!input || typeof input !== "object") return;
	const raw = input;
	const kind = (typeof raw.kind === "string" ? raw.kind : typeof raw.type === "string" ? raw.type : "").trim().toLowerCase();
	if (kind !== "bundled" && kind !== "npm" && kind !== "git") return;
	const spec = { kind };
	if (typeof raw.id === "string") spec.id = raw.id;
	if (typeof raw.label === "string") spec.label = raw.label;
	const bins = normalizeStringList(raw.bins);
	if (bins.length > 0) spec.bins = bins;
	if (typeof raw.package === "string") spec.package = raw.package;
	if (typeof raw.repository === "string") spec.repository = raw.repository;
	return spec;
}
function resolveOpenClawMetadata(frontmatter) {
	const metadataObj = resolveOpenClawManifestBlock({ frontmatter });
	if (!metadataObj) return;
	const requires = resolveOpenClawManifestRequires(metadataObj);
	const install = resolveOpenClawManifestInstall(metadataObj, parseInstallSpec);
	const osRaw = resolveOpenClawManifestOs(metadataObj);
	const eventsRaw = normalizeStringList(metadataObj.events);
	return {
		always: typeof metadataObj.always === "boolean" ? metadataObj.always : void 0,
		emoji: typeof metadataObj.emoji === "string" ? metadataObj.emoji : void 0,
		homepage: typeof metadataObj.homepage === "string" ? metadataObj.homepage : void 0,
		hookKey: typeof metadataObj.hookKey === "string" ? metadataObj.hookKey : void 0,
		export: typeof metadataObj.export === "string" ? metadataObj.export : void 0,
		os: osRaw.length > 0 ? osRaw : void 0,
		events: eventsRaw.length > 0 ? eventsRaw : [],
		requires,
		install: install.length > 0 ? install : void 0
	};
}
function resolveHookInvocationPolicy(frontmatter) {
	return { enabled: parseFrontmatterBool(getFrontmatterString(frontmatter, "enabled"), true) };
}
function resolveHookKey(hookName, entry) {
	return entry?.metadata?.hookKey ?? hookName;
}

//#endregion
//#region src/hooks/config.ts
const DEFAULT_CONFIG_VALUES = {
	"browser.enabled": true,
	"browser.evaluateEnabled": true,
	"workspace.dir": true
};
function isConfigPathTruthy(config, pathStr) {
	return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}
function resolveHookConfig(config, hookKey) {
	const hooks = config?.hooks?.internal?.entries;
	if (!hooks || typeof hooks !== "object") return;
	const entry = hooks[hookKey];
	if (!entry || typeof entry !== "object") return;
	return entry;
}
function shouldIncludeHook(params) {
	const { entry, config, eligibility } = params;
	const hookConfig = resolveHookConfig(config, resolveHookKey(entry.hook.name, entry));
	const pluginManaged = entry.hook.source === "openclaw-plugin";
	const osList = entry.metadata?.os ?? [];
	const remotePlatforms = eligibility?.remote?.platforms ?? [];
	if (!pluginManaged && hookConfig?.enabled === false) return false;
	if (osList.length > 0 && !osList.includes(resolveRuntimePlatform()) && !remotePlatforms.some((platform) => osList.includes(platform))) return false;
	if (entry.metadata?.always === true) return true;
	const requiredBins = entry.metadata?.requires?.bins ?? [];
	if (requiredBins.length > 0) for (const bin of requiredBins) {
		if (hasBinary(bin)) continue;
		if (eligibility?.remote?.hasBin?.(bin)) continue;
		return false;
	}
	const requiredAnyBins = entry.metadata?.requires?.anyBins ?? [];
	if (requiredAnyBins.length > 0) {
		if (!(requiredAnyBins.some((bin) => hasBinary(bin)) || eligibility?.remote?.hasAnyBin?.(requiredAnyBins))) return false;
	}
	const requiredEnv = entry.metadata?.requires?.env ?? [];
	if (requiredEnv.length > 0) for (const envName of requiredEnv) {
		if (process.env[envName]) continue;
		if (hookConfig?.env?.[envName]) continue;
		return false;
	}
	const requiredConfig = entry.metadata?.requires?.config ?? [];
	if (requiredConfig.length > 0) {
		for (const configPath of requiredConfig) if (!isConfigPathTruthy(config, configPath)) return false;
	}
	return true;
}

//#endregion
//#region src/hooks/bundled-dir.ts
function resolveBundledHooksDir() {
	const override = process.env.OPENCLAW_BUNDLED_HOOKS_DIR?.trim();
	if (override) return override;
	try {
		const execDir = path.dirname(process.execPath);
		const sibling = path.join(execDir, "hooks", "bundled");
		if (fs.existsSync(sibling)) return sibling;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const distBundled = path.join(moduleDir, "bundled");
		if (fs.existsSync(distBundled)) return distBundled;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const root = path.resolve(moduleDir, "..", "..");
		const srcBundled = path.join(root, "src", "hooks", "bundled");
		if (fs.existsSync(srcBundled)) return srcBundled;
	} catch {}
}

//#endregion
//#region src/hooks/workspace.ts
function readHookPackageManifest(dir) {
	const manifestPath = path.join(dir, "package.json");
	if (!fs.existsSync(manifestPath)) return null;
	try {
		const raw = fs.readFileSync(manifestPath, "utf-8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function resolvePackageHooks(manifest) {
	const raw = manifest[MANIFEST_KEY]?.hooks;
	if (!Array.isArray(raw)) return [];
	return raw.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
}
function resolveContainedDir(baseDir, targetDir) {
	const base = path.resolve(baseDir);
	const resolved = path.resolve(baseDir, targetDir);
	const relative = path.relative(base, resolved);
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
	return resolved;
}
function loadHookFromDir(params) {
	const hookMdPath = path.join(params.hookDir, "HOOK.md");
	if (!fs.existsSync(hookMdPath)) return null;
	try {
		const frontmatter = parseFrontmatter(fs.readFileSync(hookMdPath, "utf-8"));
		const name = frontmatter.name || params.nameHint || path.basename(params.hookDir);
		const description = frontmatter.description || "";
		const handlerCandidates = [
			"handler.ts",
			"handler.js",
			"index.ts",
			"index.js"
		];
		let handlerPath;
		for (const candidate of handlerCandidates) {
			const candidatePath = path.join(params.hookDir, candidate);
			if (fs.existsSync(candidatePath)) {
				handlerPath = candidatePath;
				break;
			}
		}
		if (!handlerPath) {
			console.warn(`[hooks] Hook "${name}" has HOOK.md but no handler file in ${params.hookDir}`);
			return null;
		}
		return {
			name,
			description,
			source: params.source,
			pluginId: params.pluginId,
			filePath: hookMdPath,
			baseDir: params.hookDir,
			handlerPath
		};
	} catch (err) {
		console.warn(`[hooks] Failed to load hook from ${params.hookDir}:`, err);
		return null;
	}
}
/**
* Scan a directory for hooks (subdirectories containing HOOK.md)
*/
function loadHooksFromDir(params) {
	const { dir, source, pluginId } = params;
	if (!fs.existsSync(dir)) return [];
	if (!fs.statSync(dir).isDirectory()) return [];
	const hooks = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const hookDir = path.join(dir, entry.name);
		const manifest = readHookPackageManifest(hookDir);
		const packageHooks = manifest ? resolvePackageHooks(manifest) : [];
		if (packageHooks.length > 0) {
			for (const hookPath of packageHooks) {
				const resolvedHookDir = resolveContainedDir(hookDir, hookPath);
				if (!resolvedHookDir) {
					console.warn(`[hooks] Ignoring out-of-package hook path "${hookPath}" in ${hookDir} (must be within package directory)`);
					continue;
				}
				const hook = loadHookFromDir({
					hookDir: resolvedHookDir,
					source,
					pluginId,
					nameHint: path.basename(resolvedHookDir)
				});
				if (hook) hooks.push(hook);
			}
			continue;
		}
		const hook = loadHookFromDir({
			hookDir,
			source,
			pluginId,
			nameHint: entry.name
		});
		if (hook) hooks.push(hook);
	}
	return hooks;
}
function loadHookEntries(workspaceDir, opts) {
	const managedHooksDir = opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks");
	const workspaceHooksDir = path.join(workspaceDir, "hooks");
	const bundledHooksDir = opts?.bundledHooksDir ?? resolveBundledHooksDir();
	const extraDirs = (opts?.config?.hooks?.internal?.load?.extraDirs ?? []).map((d) => typeof d === "string" ? d.trim() : "").filter(Boolean);
	const bundledHooks = bundledHooksDir ? loadHooksFromDir({
		dir: bundledHooksDir,
		source: "openclaw-bundled"
	}) : [];
	const extraHooks = extraDirs.flatMap((dir) => {
		return loadHooksFromDir({
			dir: resolveUserPath(dir),
			source: "openclaw-workspace"
		});
	});
	const managedHooks = loadHooksFromDir({
		dir: managedHooksDir,
		source: "openclaw-managed"
	});
	const workspaceHooks = loadHooksFromDir({
		dir: workspaceHooksDir,
		source: "openclaw-workspace"
	});
	const merged = /* @__PURE__ */ new Map();
	for (const hook of extraHooks) merged.set(hook.name, hook);
	for (const hook of bundledHooks) merged.set(hook.name, hook);
	for (const hook of managedHooks) merged.set(hook.name, hook);
	for (const hook of workspaceHooks) merged.set(hook.name, hook);
	return Array.from(merged.values()).map((hook) => {
		let frontmatter = {};
		try {
			frontmatter = parseFrontmatter(fs.readFileSync(hook.filePath, "utf-8"));
		} catch {}
		return {
			hook,
			frontmatter,
			metadata: resolveOpenClawMetadata(frontmatter),
			invocation: resolveHookInvocationPolicy(frontmatter)
		};
	});
}
function loadWorkspaceHookEntries(workspaceDir, opts) {
	return loadHookEntries(workspaceDir, opts);
}

//#endregion
export { parseFrontmatter as a, shouldIncludeHook as i, isConfigPathTruthy as n, resolveHookConfig as r, loadWorkspaceHookEntries as t };