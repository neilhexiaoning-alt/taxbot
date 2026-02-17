import { Yt as resolveStateDir, fn as resolveRequiredHomeDir } from "./entry.js";
import { C as resolveOpenClawAgentDir, Ft as DEFAULT_MODEL, It as DEFAULT_PROVIDER, L as resolveConfiguredModelRef, Pt as DEFAULT_CONTEXT_TOKENS, R as resolveDefaultModelForAgent } from "./auth-profiles-GYsKiVaE.js";
import { l as normalizeAgentId, u as normalizeMainKey, v as isCronRunSessionKey, x as parseAgentSessionKey } from "./session-key-BGiG_JcT.js";
import { c as resolveDefaultAgentId, s as resolveAgentWorkspaceDir } from "./agent-scope-F21xRiu_.js";
import { i as loadConfig } from "./config-CF5WgkYh.js";
import { r as hasInterSessionUserProvenance } from "./input-provenance-DRrWAEiI.js";
import { C as resolveAgentMainSessionKey, F as normalizeSessionDeliveryFields, S as canonicalizeMainSessionAlias, T as resolveMainSessionKey, i as loadSessionStore, k as buildGroupDisplayName, x as resolveFreshSessionTotalTokens } from "./sessions-Cy55zv3n.js";
import { a as resolveSessionTranscriptPathInDir, c as resolveStorePath, i as resolveSessionTranscriptPath, n as resolveSessionFilePath } from "./paths-iP6tOVPR.js";
import { t as ensureOpenClawModelsJson } from "./models-config-6-o1aQBU.js";
import { n as extractToolCallNames, r as hasToolCall } from "./transcript-tools-NGlEvSNp.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

//#region src/agents/context.ts
function applyDiscoveredContextWindows(params) {
	for (const model of params.models) {
		if (!model?.id) continue;
		const contextWindow = typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
		if (!contextWindow || contextWindow <= 0) continue;
		const existing = params.cache.get(model.id);
		if (existing === void 0 || contextWindow < existing) params.cache.set(model.id, contextWindow);
	}
}
function applyConfiguredContextWindows(params) {
	const providers = params.modelsConfig?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const provider of Object.values(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			const modelId = typeof model?.id === "string" ? model.id : void 0;
			const contextWindow = typeof model?.contextWindow === "number" ? model.contextWindow : void 0;
			if (!modelId || !contextWindow || contextWindow <= 0) continue;
			params.cache.set(modelId, contextWindow);
		}
	}
}
const MODEL_CACHE = /* @__PURE__ */ new Map();
(async () => {
	let cfg;
	try {
		cfg = loadConfig();
	} catch {
		return;
	}
	try {
		await ensureOpenClawModelsJson(cfg);
	} catch {}
	try {
		const { discoverAuthStorage, discoverModels } = await import("./pi-model-discovery-EhM2JAQo.js").then((n) => n.r);
		const agentDir = resolveOpenClawAgentDir();
		const modelRegistry = discoverModels(discoverAuthStorage(agentDir), agentDir);
		applyDiscoveredContextWindows({
			cache: MODEL_CACHE,
			models: typeof modelRegistry.getAvailable === "function" ? modelRegistry.getAvailable() : modelRegistry.getAll()
		});
	} catch {}
	applyConfiguredContextWindows({
		cache: MODEL_CACHE,
		modelsConfig: cfg.models
	});
})().catch(() => {});
function lookupContextTokens(modelId) {
	if (!modelId) return;
	return MODEL_CACHE.get(modelId);
}

//#endregion
//#region src/shared/chat-envelope.ts
const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
const ENVELOPE_CHANNELS = [
	"WebChat",
	"WhatsApp",
	"Telegram",
	"Signal",
	"Slack",
	"Discord",
	"Google Chat",
	"iMessage",
	"Teams",
	"Matrix",
	"Zalo",
	"Zalo Personal",
	"BlueBubbles"
];
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
function looksLikeEnvelopeHeader(header) {
	if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) return true;
	if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) return true;
	return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}
function stripEnvelope(text) {
	const match = text.match(ENVELOPE_PREFIX);
	if (!match) return text;
	if (!looksLikeEnvelopeHeader(match[1] ?? "")) return text;
	return text.slice(match[0].length);
}
function stripMessageIdHints(text) {
	if (!text.includes("[message_id:")) return text;
	const lines = text.split(/\r?\n/);
	const filtered = lines.filter((line) => !MESSAGE_ID_LINE.test(line));
	return filtered.length === lines.length ? text : filtered.join("\n");
}

//#endregion
//#region src/gateway/chat-sanitize.ts
function stripEnvelopeFromContent(content) {
	let changed = false;
	return {
		content: content.map((item) => {
			if (!item || typeof item !== "object") return item;
			const entry = item;
			if (entry.type !== "text" || typeof entry.text !== "string") return item;
			const stripped = stripMessageIdHints(stripEnvelope(entry.text));
			if (stripped === entry.text) return item;
			changed = true;
			return {
				...entry,
				text: stripped
			};
		}),
		changed
	};
}
function stripEnvelopeFromMessage(message) {
	if (!message || typeof message !== "object") return message;
	const entry = message;
	if ((typeof entry.role === "string" ? entry.role.toLowerCase() : "") !== "user") return message;
	let changed = false;
	const next = { ...entry };
	if (typeof entry.content === "string") {
		const stripped = stripMessageIdHints(stripEnvelope(entry.content));
		if (stripped !== entry.content) {
			next.content = stripped;
			changed = true;
		}
	} else if (Array.isArray(entry.content)) {
		const updated = stripEnvelopeFromContent(entry.content);
		if (updated.changed) {
			next.content = updated.content;
			changed = true;
		}
	} else if (typeof entry.text === "string") {
		const stripped = stripMessageIdHints(stripEnvelope(entry.text));
		if (stripped !== entry.text) {
			next.text = stripped;
			changed = true;
		}
	}
	return changed ? next : message;
}
function stripEnvelopeFromMessages(messages) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = messages.map((message) => {
		const stripped = stripEnvelopeFromMessage(message);
		if (stripped !== message) changed = true;
		return stripped;
	});
	return changed ? next : messages;
}

//#endregion
//#region src/gateway/session-utils.fs.ts
const sessionTitleFieldsCache = /* @__PURE__ */ new Map();
const MAX_SESSION_TITLE_FIELDS_CACHE_ENTRIES = 5e3;
function readSessionTitleFieldsCacheKey(filePath, opts) {
	return `${filePath}\t${opts?.includeInterSession === true ? "1" : "0"}`;
}
function getCachedSessionTitleFields(cacheKey, stat) {
	const cached = sessionTitleFieldsCache.get(cacheKey);
	if (!cached) return null;
	if (cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
		sessionTitleFieldsCache.delete(cacheKey);
		return null;
	}
	sessionTitleFieldsCache.delete(cacheKey);
	sessionTitleFieldsCache.set(cacheKey, cached);
	return {
		firstUserMessage: cached.firstUserMessage,
		lastMessagePreview: cached.lastMessagePreview
	};
}
function setCachedSessionTitleFields(cacheKey, stat, value) {
	sessionTitleFieldsCache.set(cacheKey, {
		...value,
		mtimeMs: stat.mtimeMs,
		size: stat.size
	});
	while (sessionTitleFieldsCache.size > MAX_SESSION_TITLE_FIELDS_CACHE_ENTRIES) {
		const oldestKey = sessionTitleFieldsCache.keys().next().value;
		if (typeof oldestKey !== "string" || !oldestKey) break;
		sessionTitleFieldsCache.delete(oldestKey);
	}
}
function readSessionMessages(sessionId, storePath, sessionFile) {
	const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile).find((p) => fs.existsSync(p));
	if (!filePath) return [];
	const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
	const messages = [];
	for (const line of lines) {
		if (!line.trim()) continue;
		try {
			const parsed = JSON.parse(line);
			if (parsed?.message) {
				messages.push(parsed.message);
				continue;
			}
			if (parsed?.type === "compaction") {
				const ts = typeof parsed.timestamp === "string" ? Date.parse(parsed.timestamp) : NaN;
				const timestamp = Number.isFinite(ts) ? ts : Date.now();
				messages.push({
					role: "system",
					content: [{
						type: "text",
						text: "Compaction"
					}],
					timestamp,
					__openclaw: {
						kind: "compaction",
						id: typeof parsed.id === "string" ? parsed.id : void 0
					}
				});
			}
		} catch {}
	}
	return messages;
}
function resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId) {
	const candidates = [];
	const pushCandidate = (resolve) => {
		try {
			candidates.push(resolve());
		} catch {}
	};
	if (storePath) {
		const sessionsDir = path.dirname(storePath);
		if (sessionFile) pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, {
			sessionsDir,
			agentId
		}));
		pushCandidate(() => resolveSessionTranscriptPathInDir(sessionId, sessionsDir));
	} else if (sessionFile) if (agentId) pushCandidate(() => resolveSessionFilePath(sessionId, { sessionFile }, { agentId }));
	else {
		const trimmed = sessionFile.trim();
		if (trimmed) candidates.push(path.resolve(trimmed));
	}
	if (agentId) pushCandidate(() => resolveSessionTranscriptPath(sessionId, agentId));
	const home = resolveRequiredHomeDir(process.env, os.homedir);
	const legacyDir = path.join(home, ".openclaw", "sessions");
	pushCandidate(() => resolveSessionTranscriptPathInDir(sessionId, legacyDir));
	return Array.from(new Set(candidates));
}
function archiveFileOnDisk(filePath, reason) {
	const archived = `${filePath}.${reason}.${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}`;
	fs.renameSync(filePath, archived);
	return archived;
}
/**
* Archives all transcript files for a given session.
* Best-effort: silently skips files that don't exist or fail to rename.
*/
function archiveSessionTranscripts(opts) {
	const archived = [];
	for (const candidate of resolveSessionTranscriptCandidates(opts.sessionId, opts.storePath, opts.sessionFile, opts.agentId)) {
		if (!fs.existsSync(candidate)) continue;
		try {
			archived.push(archiveFileOnDisk(candidate, opts.reason));
		} catch {}
	}
	return archived;
}
function jsonUtf8Bytes(value) {
	try {
		return Buffer.byteLength(JSON.stringify(value), "utf8");
	} catch {
		return Buffer.byteLength(String(value), "utf8");
	}
}
function capArrayByJsonBytes(items, maxBytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map((item) => jsonUtf8Bytes(item));
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= parts[start] + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
const MAX_LINES_TO_SCAN = 10;
function readSessionTitleFieldsFromTranscript(sessionId, storePath, sessionFile, agentId, opts) {
	const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((p) => fs.existsSync(p));
	if (!filePath) return {
		firstUserMessage: null,
		lastMessagePreview: null
	};
	let stat;
	try {
		stat = fs.statSync(filePath);
	} catch {
		return {
			firstUserMessage: null,
			lastMessagePreview: null
		};
	}
	const cacheKey = readSessionTitleFieldsCacheKey(filePath, opts);
	const cached = getCachedSessionTitleFields(cacheKey, stat);
	if (cached) return cached;
	if (stat.size === 0) {
		const empty = {
			firstUserMessage: null,
			lastMessagePreview: null
		};
		setCachedSessionTitleFields(cacheKey, stat, empty);
		return empty;
	}
	let fd = null;
	try {
		fd = fs.openSync(filePath, "r");
		const size = stat.size;
		let firstUserMessage = null;
		try {
			const buf = Buffer.alloc(8192);
			const bytesRead = fs.readSync(fd, buf, 0, buf.length, 0);
			if (bytesRead > 0) {
				const lines = buf.toString("utf-8", 0, bytesRead).split(/\r?\n/).slice(0, MAX_LINES_TO_SCAN);
				for (const line of lines) {
					if (!line.trim()) continue;
					try {
						const msg = JSON.parse(line)?.message;
						if (msg?.role !== "user") continue;
						if (opts?.includeInterSession !== true && hasInterSessionUserProvenance(msg)) continue;
						const text = extractTextFromContent(msg.content);
						if (text) {
							firstUserMessage = text;
							break;
						}
					} catch {}
				}
			}
		} catch {}
		let lastMessagePreview = null;
		try {
			lastMessagePreview = readLastMessagePreviewFromOpenTranscript({
				fd,
				size
			});
		} catch {}
		const result = {
			firstUserMessage,
			lastMessagePreview
		};
		setCachedSessionTitleFields(cacheKey, stat, result);
		return result;
	} catch {
		return {
			firstUserMessage: null,
			lastMessagePreview: null
		};
	} finally {
		if (fd !== null) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function extractTextFromContent(content) {
	if (typeof content === "string") return content.trim() || null;
	if (!Array.isArray(content)) return null;
	for (const part of content) {
		if (!part || typeof part.text !== "string") continue;
		if (part.type === "text" || part.type === "output_text" || part.type === "input_text") {
			const trimmed = part.text.trim();
			if (trimmed) return trimmed;
		}
	}
	return null;
}
const LAST_MSG_MAX_BYTES = 16384;
const LAST_MSG_MAX_LINES = 20;
function readLastMessagePreviewFromOpenTranscript(params) {
	const readStart = Math.max(0, params.size - LAST_MSG_MAX_BYTES);
	const readLen = Math.min(params.size, LAST_MSG_MAX_BYTES);
	const buf = Buffer.alloc(readLen);
	fs.readSync(params.fd, buf, 0, readLen, readStart);
	const tailLines = buf.toString("utf-8").split(/\r?\n/).filter((l) => l.trim()).slice(-LAST_MSG_MAX_LINES);
	for (let i = tailLines.length - 1; i >= 0; i--) {
		const line = tailLines[i];
		try {
			const msg = JSON.parse(line)?.message;
			if (msg?.role !== "user" && msg?.role !== "assistant") continue;
			const text = extractTextFromContent(msg.content);
			if (text) return text;
		} catch {}
	}
	return null;
}
const PREVIEW_READ_SIZES = [
	64 * 1024,
	256 * 1024,
	1024 * 1024
];
const PREVIEW_MAX_LINES = 200;
function normalizeRole(role, isTool) {
	if (isTool) return "tool";
	switch ((role ?? "").toLowerCase()) {
		case "user": return "user";
		case "assistant": return "assistant";
		case "system": return "system";
		case "tool": return "tool";
		default: return "other";
	}
}
function truncatePreviewText(text, maxChars) {
	if (maxChars <= 0 || text.length <= maxChars) return text;
	if (maxChars <= 3) return text.slice(0, maxChars);
	return `${text.slice(0, maxChars - 3)}...`;
}
function extractPreviewText(message) {
	if (typeof message.content === "string") {
		const trimmed = message.content.trim();
		return trimmed ? trimmed : null;
	}
	if (Array.isArray(message.content)) {
		const parts = message.content.map((entry) => typeof entry?.text === "string" ? entry.text : "").filter((text) => text.trim().length > 0);
		if (parts.length > 0) return parts.join("\n").trim();
	}
	if (typeof message.text === "string") {
		const trimmed = message.text.trim();
		return trimmed ? trimmed : null;
	}
	return null;
}
function isToolCall(message) {
	return hasToolCall(message);
}
function extractToolNames(message) {
	return extractToolCallNames(message);
}
function extractMediaSummary(message) {
	if (!Array.isArray(message.content)) return null;
	for (const entry of message.content) {
		const raw = typeof entry?.type === "string" ? entry.type.trim().toLowerCase() : "";
		if (!raw || raw === "text" || raw === "toolcall" || raw === "tool_call") continue;
		return `[${raw}]`;
	}
	return null;
}
function buildPreviewItems(messages, maxItems, maxChars) {
	const items = [];
	for (const message of messages) {
		const toolCall = isToolCall(message);
		const role = normalizeRole(message.role, toolCall);
		let text = extractPreviewText(message);
		if (!text) {
			const toolNames = extractToolNames(message);
			if (toolNames.length > 0) {
				const shown = toolNames.slice(0, 2);
				const overflow = toolNames.length - shown.length;
				text = `call ${shown.join(", ")}`;
				if (overflow > 0) text += ` +${overflow}`;
			}
		}
		if (!text) text = extractMediaSummary(message);
		if (!text) continue;
		let trimmed = text.trim();
		if (!trimmed) continue;
		if (role === "user") trimmed = stripEnvelope(trimmed);
		trimmed = truncatePreviewText(trimmed, maxChars);
		items.push({
			role,
			text: trimmed
		});
	}
	if (items.length <= maxItems) return items;
	return items.slice(-maxItems);
}
function readRecentMessagesFromTranscript(filePath, maxMessages, readBytes) {
	let fd = null;
	try {
		fd = fs.openSync(filePath, "r");
		const size = fs.fstatSync(fd).size;
		if (size === 0) return [];
		const readStart = Math.max(0, size - readBytes);
		const readLen = Math.min(size, readBytes);
		const buf = Buffer.alloc(readLen);
		fs.readSync(fd, buf, 0, readLen, readStart);
		const tailLines = buf.toString("utf-8").split(/\r?\n/).filter((l) => l.trim()).slice(-PREVIEW_MAX_LINES);
		const collected = [];
		for (let i = tailLines.length - 1; i >= 0; i--) {
			const line = tailLines[i];
			try {
				const msg = JSON.parse(line)?.message;
				if (msg && typeof msg === "object") {
					collected.push(msg);
					if (collected.length >= maxMessages) break;
				}
			} catch {}
		}
		return collected.toReversed();
	} catch {
		return [];
	} finally {
		if (fd !== null) fs.closeSync(fd);
	}
}
function readSessionPreviewItemsFromTranscript(sessionId, storePath, sessionFile, agentId, maxItems, maxChars) {
	const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((p) => fs.existsSync(p));
	if (!filePath) return [];
	const boundedItems = Math.max(1, Math.min(maxItems, 50));
	const boundedChars = Math.max(20, Math.min(maxChars, 2e3));
	for (const readSize of PREVIEW_READ_SIZES) {
		const messages = readRecentMessagesFromTranscript(filePath, boundedItems, readSize);
		if (messages.length > 0 || readSize === PREVIEW_READ_SIZES[PREVIEW_READ_SIZES.length - 1]) return buildPreviewItems(messages, boundedItems, boundedChars);
	}
	return [];
}

//#endregion
//#region src/gateway/session-utils.ts
const DERIVED_TITLE_MAX_LEN = 60;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_DATA_RE = /^data:/i;
const AVATAR_HTTP_RE = /^https?:\/\//i;
const AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
const AVATAR_MIME_BY_EXT = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".bmp": "image/bmp",
	".tif": "image/tiff",
	".tiff": "image/tiff"
};
function resolveAvatarMime(filePath) {
	return AVATAR_MIME_BY_EXT[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function isWorkspaceRelativePath(value) {
	if (!value) return false;
	if (value.startsWith("~")) return false;
	if (AVATAR_SCHEME_RE.test(value) && !WINDOWS_ABS_RE.test(value)) return false;
	return true;
}
function resolveIdentityAvatarUrl(cfg, agentId, avatar) {
	if (!avatar) return;
	const trimmed = avatar.trim();
	if (!trimmed) return;
	if (AVATAR_DATA_RE.test(trimmed) || AVATAR_HTTP_RE.test(trimmed)) return trimmed;
	if (!isWorkspaceRelativePath(trimmed)) return;
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const workspaceRoot = path.resolve(workspaceDir);
	const resolved = path.resolve(workspaceRoot, trimmed);
	const relative = path.relative(workspaceRoot, resolved);
	if (relative.startsWith("..") || path.isAbsolute(relative)) return;
	try {
		const stat = fs.statSync(resolved);
		if (!stat.isFile() || stat.size > AVATAR_MAX_BYTES) return;
		const buffer = fs.readFileSync(resolved);
		return `data:${resolveAvatarMime(resolved)};base64,${buffer.toString("base64")}`;
	} catch {
		return;
	}
}
function formatSessionIdPrefix(sessionId, updatedAt) {
	const prefix = sessionId.slice(0, 8);
	if (updatedAt && updatedAt > 0) return `${prefix} (${new Date(updatedAt).toISOString().slice(0, 10)})`;
	return prefix;
}
function truncateTitle(text, maxLen) {
	if (text.length <= maxLen) return text;
	const cut = text.slice(0, maxLen - 1);
	const lastSpace = cut.lastIndexOf(" ");
	if (lastSpace > maxLen * .6) return cut.slice(0, lastSpace) + "…";
	return cut + "…";
}
function deriveSessionTitle(entry, firstUserMessage) {
	if (!entry) return;
	if (entry.displayName?.trim()) return entry.displayName.trim();
	if (entry.subject?.trim()) return entry.subject.trim();
	if (firstUserMessage?.trim()) return truncateTitle(firstUserMessage.replace(/\s+/g, " ").trim(), DERIVED_TITLE_MAX_LEN);
	if (entry.sessionId) return formatSessionIdPrefix(entry.sessionId, entry.updatedAt);
}
function loadSessionEntry(sessionKey) {
	const cfg = loadConfig();
	const sessionCfg = cfg.session;
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey
	});
	const agentId = resolveSessionStoreAgentId(cfg, canonicalKey);
	const storePath = resolveStorePath(sessionCfg?.store, { agentId });
	const store = loadSessionStore(storePath);
	const match = findStoreMatch(store, canonicalKey, sessionKey.trim());
	const legacyKey = match?.key !== canonicalKey ? match?.key : void 0;
	return {
		cfg,
		storePath,
		store,
		entry: match?.entry,
		canonicalKey,
		legacyKey
	};
}
/**
* Find a session entry by exact or case-insensitive key match.
* Returns both the entry and the actual store key it was found under,
* so callers can clean up legacy mixed-case keys when they differ from canonicalKey.
*/
function findStoreMatch(store, ...candidates) {
	for (const candidate of candidates) if (candidate && store[candidate]) return {
		entry: store[candidate],
		key: candidate
	};
	const loweredSet = new Set(candidates.filter(Boolean).map((c) => c.toLowerCase()));
	for (const key of Object.keys(store)) if (loweredSet.has(key.toLowerCase())) return {
		entry: store[key],
		key
	};
}
/**
* Find all on-disk store keys that match the given key case-insensitively.
* Returns every key from the store whose lowercased form equals the target's lowercased form.
*/
function findStoreKeysIgnoreCase(store, targetKey) {
	const lowered = targetKey.toLowerCase();
	const matches = [];
	for (const key of Object.keys(store)) if (key.toLowerCase() === lowered) matches.push(key);
	return matches;
}
/**
* Remove legacy key variants for one canonical session key.
* Candidates can include aliases (for example, "agent:ops:main" when canonical is "agent:ops:work").
*/
function pruneLegacyStoreKeys(params) {
	const keysToDelete = /* @__PURE__ */ new Set();
	for (const candidate of params.candidates) {
		const trimmed = String(candidate ?? "").trim();
		if (!trimmed) continue;
		if (trimmed !== params.canonicalKey) keysToDelete.add(trimmed);
		for (const match of findStoreKeysIgnoreCase(params.store, trimmed)) if (match !== params.canonicalKey) keysToDelete.add(match);
	}
	for (const key of keysToDelete) delete params.store[key];
}
function classifySessionKey(key, entry) {
	if (key === "global") return "global";
	if (key === "unknown") return "unknown";
	if (entry?.chatType === "group" || entry?.chatType === "channel") return "group";
	if (key.includes(":group:") || key.includes(":channel:")) return "group";
	return "direct";
}
function parseGroupKey(key) {
	const parts = (parseAgentSessionKey(key)?.rest ?? key).split(":").filter(Boolean);
	if (parts.length >= 3) {
		const [channel, kind, ...rest] = parts;
		if (kind === "group" || kind === "channel") return {
			channel,
			kind,
			id: rest.join(":")
		};
	}
	return null;
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function listExistingAgentIdsFromDisk() {
	const root = resolveStateDir();
	const agentsDir = path.join(root, "agents");
	try {
		return fs.readdirSync(agentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => normalizeAgentId(entry.name)).filter(Boolean);
	} catch {
		return [];
	}
}
function listConfiguredAgentIds(cfg) {
	const agents = cfg.agents?.list ?? [];
	if (agents.length > 0) {
		const ids = /* @__PURE__ */ new Set();
		for (const entry of agents) if (entry?.id) ids.add(normalizeAgentId(entry.id));
		const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
		ids.add(defaultId);
		const sorted = Array.from(ids).filter(Boolean);
		sorted.sort((a, b) => a.localeCompare(b));
		return sorted.includes(defaultId) ? [defaultId, ...sorted.filter((id) => id !== defaultId)] : sorted;
	}
	const ids = /* @__PURE__ */ new Set();
	const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
	ids.add(defaultId);
	for (const id of listExistingAgentIdsFromDisk()) ids.add(id);
	const sorted = Array.from(ids).filter(Boolean);
	sorted.sort((a, b) => a.localeCompare(b));
	if (sorted.includes(defaultId)) return [defaultId, ...sorted.filter((id) => id !== defaultId)];
	return sorted;
}
function listAgentsForGateway(cfg) {
	const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	const configuredById = /* @__PURE__ */ new Map();
	for (const entry of cfg.agents?.list ?? []) {
		if (!entry?.id) continue;
		const identity = entry.identity ? {
			name: entry.identity.name?.trim() || void 0,
			theme: entry.identity.theme?.trim() || void 0,
			emoji: entry.identity.emoji?.trim() || void 0,
			avatar: entry.identity.avatar?.trim() || void 0,
			avatarUrl: resolveIdentityAvatarUrl(cfg, normalizeAgentId(entry.id), entry.identity.avatar?.trim())
		} : void 0;
		configuredById.set(normalizeAgentId(entry.id), {
			name: typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : void 0,
			identity
		});
	}
	const explicitIds = new Set((cfg.agents?.list ?? []).map((entry) => entry?.id ? normalizeAgentId(entry.id) : "").filter(Boolean));
	const allowedIds = explicitIds.size > 0 ? new Set([...explicitIds, defaultId]) : null;
	let agentIds = listConfiguredAgentIds(cfg).filter((id) => allowedIds ? allowedIds.has(id) : true);
	if (mainKey && !agentIds.includes(mainKey) && (!allowedIds || allowedIds.has(mainKey))) agentIds = [...agentIds, mainKey];
	return {
		defaultId,
		mainKey,
		scope,
		agents: agentIds.map((id) => {
			const meta = configuredById.get(id);
			return {
				id,
				name: meta?.name,
				identity: meta?.identity
			};
		})
	};
}
function canonicalizeSessionKeyForAgent(agentId, key) {
	const lowered = key.toLowerCase();
	if (lowered === "global" || lowered === "unknown") return lowered;
	if (lowered.startsWith("agent:")) return lowered;
	return `agent:${normalizeAgentId(agentId)}:${lowered}`;
}
function resolveDefaultStoreAgentId(cfg) {
	return normalizeAgentId(resolveDefaultAgentId(cfg));
}
function resolveSessionStoreKey(params) {
	const raw = params.sessionKey.trim();
	if (!raw) return raw;
	const rawLower = raw.toLowerCase();
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	const parsed = parseAgentSessionKey(raw);
	if (parsed) {
		const agentId = normalizeAgentId(parsed.agentId);
		const lowered = raw.toLowerCase();
		const canonical = canonicalizeMainSessionAlias({
			cfg: params.cfg,
			agentId,
			sessionKey: lowered
		});
		if (canonical !== lowered) return canonical;
		return lowered;
	}
	const lowered = raw.toLowerCase();
	const rawMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	if (lowered === "main" || lowered === rawMainKey) return resolveMainSessionKey(params.cfg);
	return canonicalizeSessionKeyForAgent(resolveDefaultStoreAgentId(params.cfg), lowered);
}
function resolveSessionStoreAgentId(cfg, canonicalKey) {
	if (canonicalKey === "global" || canonicalKey === "unknown") return resolveDefaultStoreAgentId(cfg);
	const parsed = parseAgentSessionKey(canonicalKey);
	if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
	return resolveDefaultStoreAgentId(cfg);
}
function canonicalizeSpawnedByForAgent(cfg, agentId, spawnedBy) {
	const raw = spawnedBy?.trim();
	if (!raw) return;
	const lower = raw.toLowerCase();
	if (lower === "global" || lower === "unknown") return lower;
	let result;
	if (raw.toLowerCase().startsWith("agent:")) result = raw.toLowerCase();
	else result = `agent:${normalizeAgentId(agentId)}:${lower}`;
	const parsed = parseAgentSessionKey(result);
	return canonicalizeMainSessionAlias({
		cfg,
		agentId: parsed?.agentId ? normalizeAgentId(parsed.agentId) : agentId,
		sessionKey: result
	});
}
function resolveGatewaySessionStoreTarget(params) {
	const key = params.key.trim();
	const canonicalKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key
	});
	const agentId = resolveSessionStoreAgentId(params.cfg, canonicalKey);
	const storeConfig = params.cfg.session?.store;
	const storePath = resolveStorePath(storeConfig, { agentId });
	if (canonicalKey === "global" || canonicalKey === "unknown") return {
		agentId,
		storePath,
		canonicalKey,
		storeKeys: key && key !== canonicalKey ? [canonicalKey, key] : [key]
	};
	const storeKeys = /* @__PURE__ */ new Set();
	storeKeys.add(canonicalKey);
	if (key && key !== canonicalKey) storeKeys.add(key);
	if (params.scanLegacyKeys !== false) {
		const scanTargets = new Set(storeKeys);
		if (canonicalKey === resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId
		})) scanTargets.add(`agent:${agentId}:main`);
		const store = params.store ?? loadSessionStore(storePath);
		for (const seed of scanTargets) for (const legacyKey of findStoreKeysIgnoreCase(store, seed)) storeKeys.add(legacyKey);
	}
	return {
		agentId,
		storePath,
		canonicalKey,
		storeKeys: Array.from(storeKeys)
	};
}
function mergeSessionEntryIntoCombined(params) {
	const { cfg, combined, entry, agentId, canonicalKey } = params;
	const existing = combined[canonicalKey];
	if (existing && (existing.updatedAt ?? 0) > (entry.updatedAt ?? 0)) combined[canonicalKey] = {
		...entry,
		...existing,
		spawnedBy: canonicalizeSpawnedByForAgent(cfg, agentId, existing.spawnedBy ?? entry.spawnedBy)
	};
	else combined[canonicalKey] = {
		...existing,
		...entry,
		spawnedBy: canonicalizeSpawnedByForAgent(cfg, agentId, entry.spawnedBy ?? existing?.spawnedBy)
	};
}
function loadCombinedSessionStoreForGateway(cfg) {
	const storeConfig = cfg.session?.store;
	if (storeConfig && !isStorePathTemplate(storeConfig)) {
		const storePath = resolveStorePath(storeConfig);
		const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
		const store = loadSessionStore(storePath);
		const combined = {};
		for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
			cfg,
			combined,
			entry,
			agentId: defaultAgentId,
			canonicalKey: canonicalizeSessionKeyForAgent(defaultAgentId, key)
		});
		return {
			storePath,
			store: combined
		};
	}
	const agentIds = listConfiguredAgentIds(cfg);
	const combined = {};
	for (const agentId of agentIds) {
		const store = loadSessionStore(resolveStorePath(storeConfig, { agentId }));
		for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
			cfg,
			combined,
			entry,
			agentId,
			canonicalKey: canonicalizeSessionKeyForAgent(agentId, key)
		});
	}
	return {
		storePath: typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)",
		store: combined
	};
}
function getSessionDefaults(cfg) {
	const resolved = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const contextTokens = cfg.agents?.defaults?.contextTokens ?? lookupContextTokens(resolved.model) ?? DEFAULT_CONTEXT_TOKENS;
	return {
		modelProvider: resolved.provider ?? null,
		model: resolved.model ?? null,
		contextTokens: contextTokens ?? null
	};
}
function resolveSessionModelRef(cfg, entry, agentId) {
	const resolved = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	let provider = resolved.provider;
	let model = resolved.model;
	const storedModelOverride = entry?.modelOverride?.trim();
	if (storedModelOverride) {
		provider = entry?.providerOverride?.trim() || provider;
		model = storedModelOverride;
	}
	return {
		provider,
		model
	};
}
function listSessionsFromStore(params) {
	const { cfg, storePath, store, opts } = params;
	const now = Date.now();
	const includeGlobal = opts.includeGlobal === true;
	const includeUnknown = opts.includeUnknown === true;
	const includeDerivedTitles = opts.includeDerivedTitles === true;
	const includeLastMessage = opts.includeLastMessage === true;
	const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
	const label = typeof opts.label === "string" ? opts.label.trim() : "";
	const agentId = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
	const search = typeof opts.search === "string" ? opts.search.trim().toLowerCase() : "";
	const activeMinutes = typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes) ? Math.max(1, Math.floor(opts.activeMinutes)) : void 0;
	let sessions = Object.entries(store).filter(([key]) => {
		if (isCronRunSessionKey(key)) return false;
		if (!includeGlobal && key === "global") return false;
		if (!includeUnknown && key === "unknown") return false;
		if (agentId) {
			if (key === "global" || key === "unknown") return false;
			const parsed = parseAgentSessionKey(key);
			if (!parsed) return false;
			return normalizeAgentId(parsed.agentId) === agentId;
		}
		return true;
	}).filter(([key, entry]) => {
		if (!spawnedBy) return true;
		if (key === "unknown" || key === "global") return false;
		return entry?.spawnedBy === spawnedBy;
	}).filter(([, entry]) => {
		if (!label) return true;
		return entry?.label === label;
	}).map(([key, entry]) => {
		const updatedAt = entry?.updatedAt ?? null;
		const total = resolveFreshSessionTotalTokens(entry);
		const totalTokensFresh = typeof entry?.totalTokens === "number" ? entry?.totalTokensFresh !== false : false;
		const parsed = parseGroupKey(key);
		const channel = entry?.channel ?? parsed?.channel;
		const subject = entry?.subject;
		const groupChannel = entry?.groupChannel;
		const space = entry?.space;
		const id = parsed?.id;
		const origin = entry?.origin;
		const originLabel = origin?.label;
		const displayName = entry?.displayName ?? (channel ? buildGroupDisplayName({
			provider: channel,
			subject,
			groupChannel,
			space,
			id,
			key
		}) : void 0) ?? entry?.label ?? originLabel;
		const deliveryFields = normalizeSessionDeliveryFields(entry);
		const resolvedModel = resolveSessionModelRef(cfg, entry, normalizeAgentId(parseAgentSessionKey(key)?.agentId ?? resolveDefaultAgentId(cfg)));
		const modelProvider = resolvedModel.provider ?? DEFAULT_PROVIDER;
		const model = resolvedModel.model ?? DEFAULT_MODEL;
		return {
			key,
			entry,
			kind: classifySessionKey(key, entry),
			label: entry?.label,
			displayName,
			channel,
			subject,
			groupChannel,
			space,
			chatType: entry?.chatType,
			origin,
			updatedAt,
			sessionId: entry?.sessionId,
			systemSent: entry?.systemSent,
			abortedLastRun: entry?.abortedLastRun,
			thinkingLevel: entry?.thinkingLevel,
			verboseLevel: entry?.verboseLevel,
			reasoningLevel: entry?.reasoningLevel,
			elevatedLevel: entry?.elevatedLevel,
			sendPolicy: entry?.sendPolicy,
			inputTokens: entry?.inputTokens,
			outputTokens: entry?.outputTokens,
			totalTokens: total,
			totalTokensFresh,
			responseUsage: entry?.responseUsage,
			modelProvider,
			model,
			contextTokens: entry?.contextTokens,
			deliveryContext: deliveryFields.deliveryContext,
			lastChannel: deliveryFields.lastChannel ?? entry?.lastChannel,
			lastTo: deliveryFields.lastTo ?? entry?.lastTo,
			lastAccountId: deliveryFields.lastAccountId ?? entry?.lastAccountId
		};
	}).toSorted((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
	if (search) sessions = sessions.filter((s) => {
		return [
			s.displayName,
			s.label,
			s.subject,
			s.sessionId,
			s.key
		].some((f) => typeof f === "string" && f.toLowerCase().includes(search));
	});
	if (activeMinutes !== void 0) {
		const cutoff = now - activeMinutes * 6e4;
		sessions = sessions.filter((s) => (s.updatedAt ?? 0) >= cutoff);
	}
	if (typeof opts.limit === "number" && Number.isFinite(opts.limit)) {
		const limit = Math.max(1, Math.floor(opts.limit));
		sessions = sessions.slice(0, limit);
	}
	const finalSessions = sessions.map((s) => {
		const { entry, ...rest } = s;
		let derivedTitle;
		let lastMessagePreview;
		if (entry?.sessionId) {
			if (includeDerivedTitles || includeLastMessage) {
				const parsed = parseAgentSessionKey(s.key);
				const agentId = parsed && parsed.agentId ? normalizeAgentId(parsed.agentId) : resolveDefaultAgentId(cfg);
				const fields = readSessionTitleFieldsFromTranscript(entry.sessionId, storePath, entry.sessionFile, agentId);
				if (includeDerivedTitles) derivedTitle = deriveSessionTitle(entry, fields.firstUserMessage);
				if (includeLastMessage && fields.lastMessagePreview) lastMessagePreview = fields.lastMessagePreview;
			}
		}
		return {
			...rest,
			derivedTitle,
			lastMessagePreview
		};
	});
	return {
		ts: now,
		path: storePath,
		count: finalSessions.length,
		defaults: getSessionDefaults(cfg),
		sessions: finalSessions
	};
}

//#endregion
export { lookupContextTokens as _, loadCombinedSessionStoreForGateway as a, resolveGatewaySessionStoreTarget as c, archiveSessionTranscripts as d, capArrayByJsonBytes as f, stripEnvelopeFromMessages as g, resolveSessionTranscriptCandidates as h, listSessionsFromStore as i, resolveSessionModelRef as l, readSessionPreviewItemsFromTranscript as m, classifySessionKey as n, loadSessionEntry as o, readSessionMessages as p, listAgentsForGateway as r, pruneLegacyStoreKeys as s, canonicalizeSpawnedByForAgent as t, archiveFileOnDisk as u };