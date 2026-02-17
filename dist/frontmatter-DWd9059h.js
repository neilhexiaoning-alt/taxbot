import { t as parseBooleanValue } from "./boolean-mcn6kL0s.js";
import { n as MANIFEST_KEY, t as LEGACY_MANIFEST_KEYS } from "./legacy-names-CfOq9urt.js";
import path from "node:path";
import fs from "node:fs";
import JSON5 from "json5";
import YAML from "yaml";

//#region src/shared/config-eval.ts
function isTruthy(value) {
	if (value === void 0 || value === null) return false;
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value !== 0;
	if (typeof value === "string") return value.trim().length > 0;
	return true;
}
function resolveConfigPath(config, pathStr) {
	const parts = pathStr.split(".").filter(Boolean);
	let current = config;
	for (const part of parts) {
		if (typeof current !== "object" || current === null) return;
		current = current[part];
	}
	return current;
}
function isConfigPathTruthyWithDefaults(config, pathStr, defaults) {
	const value = resolveConfigPath(config, pathStr);
	if (value === void 0 && pathStr in defaults) return defaults[pathStr] ?? false;
	return isTruthy(value);
}
function resolveRuntimePlatform() {
	return process.platform;
}
function windowsPathExtensions() {
	const raw = process.env.PATHEXT;
	return ["", ...(raw !== void 0 ? raw.split(";").map((v) => v.trim()) : [
		".EXE",
		".CMD",
		".BAT",
		".COM"
	]).filter(Boolean)];
}
let cachedHasBinaryPath;
let cachedHasBinaryPathExt;
const hasBinaryCache = /* @__PURE__ */ new Map();
function hasBinary(bin) {
	const pathEnv = process.env.PATH ?? "";
	const pathExt = process.platform === "win32" ? process.env.PATHEXT ?? "" : "";
	if (cachedHasBinaryPath !== pathEnv || cachedHasBinaryPathExt !== pathExt) {
		cachedHasBinaryPath = pathEnv;
		cachedHasBinaryPathExt = pathExt;
		hasBinaryCache.clear();
	}
	if (hasBinaryCache.has(bin)) return hasBinaryCache.get(bin);
	const parts = pathEnv.split(path.delimiter).filter(Boolean);
	const extensions = process.platform === "win32" ? windowsPathExtensions() : [""];
	for (const part of parts) for (const ext of extensions) {
		const candidate = path.join(part, bin + ext);
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			hasBinaryCache.set(bin, true);
			return true;
		} catch {}
	}
	hasBinaryCache.set(bin, false);
	return false;
}

//#endregion
//#region src/markdown/frontmatter.ts
function stripQuotes(value) {
	if (value.startsWith("\"") && value.endsWith("\"") || value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
	return value;
}
function coerceFrontmatterValue(value) {
	if (value === null || value === void 0) return;
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (typeof value === "object") try {
		return JSON.stringify(value);
	} catch {
		return;
	}
}
function parseYamlFrontmatter(block) {
	try {
		const parsed = YAML.parse(block);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		const result = {};
		for (const [rawKey, value] of Object.entries(parsed)) {
			const key = rawKey.trim();
			if (!key) continue;
			const coerced = coerceFrontmatterValue(value);
			if (coerced === void 0) continue;
			result[key] = coerced;
		}
		return result;
	} catch {
		return null;
	}
}
function extractMultiLineValue(lines, startIndex) {
	const match = lines[startIndex].match(/^([\w-]+):\s*(.*)$/);
	if (!match) return {
		value: "",
		linesConsumed: 1
	};
	const inlineValue = match[2].trim();
	if (inlineValue) return {
		value: inlineValue,
		linesConsumed: 1
	};
	const valueLines = [];
	let i = startIndex + 1;
	while (i < lines.length) {
		const line = lines[i];
		if (line.length > 0 && !line.startsWith(" ") && !line.startsWith("	")) break;
		valueLines.push(line);
		i++;
	}
	return {
		value: valueLines.join("\n").trim(),
		linesConsumed: i - startIndex
	};
}
function parseLineFrontmatter(block) {
	const frontmatter = {};
	const lines = block.split("\n");
	let i = 0;
	while (i < lines.length) {
		const match = lines[i].match(/^([\w-]+):\s*(.*)$/);
		if (!match) {
			i++;
			continue;
		}
		const key = match[1];
		const inlineValue = match[2].trim();
		if (!key) {
			i++;
			continue;
		}
		if (!inlineValue && i + 1 < lines.length) {
			const nextLine = lines[i + 1];
			if (nextLine.startsWith(" ") || nextLine.startsWith("	")) {
				const { value, linesConsumed } = extractMultiLineValue(lines, i);
				if (value) frontmatter[key] = value;
				i += linesConsumed;
				continue;
			}
		}
		const value = stripQuotes(inlineValue);
		if (value) frontmatter[key] = value;
		i++;
	}
	return frontmatter;
}
function parseFrontmatterBlock(content) {
	const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	if (!normalized.startsWith("---")) return {};
	const endIndex = normalized.indexOf("\n---", 3);
	if (endIndex === -1) return {};
	const block = normalized.slice(4, endIndex);
	const lineParsed = parseLineFrontmatter(block);
	const yamlParsed = parseYamlFrontmatter(block);
	if (yamlParsed === null) return lineParsed;
	const merged = { ...yamlParsed };
	for (const [key, value] of Object.entries(lineParsed)) if (value.startsWith("{") || value.startsWith("[")) merged[key] = value;
	return merged;
}

//#endregion
//#region src/shared/frontmatter.ts
function normalizeStringList(input) {
	if (!input) return [];
	if (Array.isArray(input)) return input.map((value) => String(value).trim()).filter(Boolean);
	if (typeof input === "string") return input.split(",").map((value) => value.trim()).filter(Boolean);
	return [];
}
function getFrontmatterString(frontmatter, key) {
	const raw = frontmatter[key];
	return typeof raw === "string" ? raw : void 0;
}
function parseFrontmatterBool(value, fallback) {
	const parsed = parseBooleanValue(value);
	return parsed === void 0 ? fallback : parsed;
}
function resolveOpenClawManifestBlock(params) {
	const raw = getFrontmatterString(params.frontmatter, params.key ?? "metadata");
	if (!raw) return;
	try {
		const parsed = JSON5.parse(raw);
		if (!parsed || typeof parsed !== "object") return;
		const manifestKeys = [MANIFEST_KEY, ...LEGACY_MANIFEST_KEYS];
		for (const key of manifestKeys) {
			const candidate = parsed[key];
			if (candidate && typeof candidate === "object") return candidate;
		}
		return;
	} catch {
		return;
	}
}
function resolveOpenClawManifestRequires(metadataObj) {
	const requiresRaw = typeof metadataObj.requires === "object" && metadataObj.requires !== null ? metadataObj.requires : void 0;
	if (!requiresRaw) return;
	return {
		bins: normalizeStringList(requiresRaw.bins),
		anyBins: normalizeStringList(requiresRaw.anyBins),
		env: normalizeStringList(requiresRaw.env),
		config: normalizeStringList(requiresRaw.config)
	};
}
function resolveOpenClawManifestInstall(metadataObj, parseInstallSpec) {
	return (Array.isArray(metadataObj.install) ? metadataObj.install : []).map((entry) => parseInstallSpec(entry)).filter((entry) => Boolean(entry));
}
function resolveOpenClawManifestOs(metadataObj) {
	return normalizeStringList(metadataObj.os);
}

//#endregion
export { resolveOpenClawManifestInstall as a, parseFrontmatterBlock as c, resolveRuntimePlatform as d, resolveOpenClawManifestBlock as i, hasBinary as l, normalizeStringList as n, resolveOpenClawManifestOs as o, parseFrontmatterBool as r, resolveOpenClawManifestRequires as s, getFrontmatterString as t, isConfigPathTruthyWithDefaults as u };