import { f as resolveLegacyStateDirs, g as resolveStateDir, m as resolveOAuthDir, p as resolveNewStateDir, t as CONFIG_PATH } from "./paths-B4BZAPZh.js";
import { f as isRecord, v as resolveHomeDir } from "./utils-CFnnyoTP.js";
import { i as buildAgentMainSessionKey, l as normalizeAgentId, r as DEFAULT_MAIN_KEY, t as DEFAULT_ACCOUNT_ID } from "./session-key-CZ6OwgSB.js";
import { c as resolveDefaultAgentId } from "./agent-scope-5j4KiZmG.js";
import { t as formatCliCommand } from "./command-format-DEKzLnLg.js";
import { d as OpenClawSchema, n as migrateLegacyConfig, o as readConfigFileSnapshot } from "./config-DTlZk19z.js";
import { k as canonicalizeMainSessionAlias, s as saveSessionStore } from "./sessions-B1VYnsjk.js";
import { a as resolveTelegramAccount, i as listTelegramAccountIds } from "./normalize-CEDF7eBP.js";
import { t as note } from "./note-DjnX9YFe.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DhG5ARn2.js";
import { t as isWithinDir } from "./path-safety-CP6a8uVu.js";
import { n as normalizeTelegramAllowFromEntry, t as isNumericTelegramUserId } from "./allow-from-6-s85nbC.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import JSON5 from "json5";
import fs$1 from "node:fs/promises";

//#region src/commands/doctor-legacy-config.ts
function normalizeLegacyConfigValues(cfg) {
	const changes = [];
	let next = cfg;
	const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
	const normalizeDmAliases = (params) => {
		let changed = false;
		let updated = params.entry;
		const rawDm = updated.dm;
		const dm = isRecord(rawDm) ? structuredClone(rawDm) : null;
		let dmChanged = false;
		const allowFromEqual = (a, b) => {
			if (!Array.isArray(a) || !Array.isArray(b)) return false;
			const na = a.map((v) => String(v).trim()).filter(Boolean);
			const nb = b.map((v) => String(v).trim()).filter(Boolean);
			if (na.length !== nb.length) return false;
			return na.every((v, i) => v === nb[i]);
		};
		const topDmPolicy = updated.dmPolicy;
		const legacyDmPolicy = dm?.policy;
		if (topDmPolicy === void 0 && legacyDmPolicy !== void 0) {
			updated = {
				...updated,
				dmPolicy: legacyDmPolicy
			};
			changed = true;
			if (dm) {
				delete dm.policy;
				dmChanged = true;
			}
			changes.push(`Moved ${params.pathPrefix}.dm.policy → ${params.pathPrefix}.dmPolicy.`);
		} else if (topDmPolicy !== void 0 && legacyDmPolicy !== void 0) {
			if (topDmPolicy === legacyDmPolicy) {
				if (dm) {
					delete dm.policy;
					dmChanged = true;
					changes.push(`Removed ${params.pathPrefix}.dm.policy (dmPolicy already set).`);
				}
			}
		}
		const topAllowFrom = updated.allowFrom;
		const legacyAllowFrom = dm?.allowFrom;
		if (topAllowFrom === void 0 && legacyAllowFrom !== void 0) {
			updated = {
				...updated,
				allowFrom: legacyAllowFrom
			};
			changed = true;
			if (dm) {
				delete dm.allowFrom;
				dmChanged = true;
			}
			changes.push(`Moved ${params.pathPrefix}.dm.allowFrom → ${params.pathPrefix}.allowFrom.`);
		} else if (topAllowFrom !== void 0 && legacyAllowFrom !== void 0) {
			if (allowFromEqual(topAllowFrom, legacyAllowFrom)) {
				if (dm) {
					delete dm.allowFrom;
					dmChanged = true;
					changes.push(`Removed ${params.pathPrefix}.dm.allowFrom (allowFrom already set).`);
				}
			}
		}
		if (dm && isRecord(rawDm) && dmChanged) if (Object.keys(dm).length === 0) {
			if (updated.dm !== void 0) {
				const { dm: _ignored, ...rest } = updated;
				updated = rest;
				changed = true;
				changes.push(`Removed empty ${params.pathPrefix}.dm after migration.`);
			}
		} else {
			updated = {
				...updated,
				dm
			};
			changed = true;
		}
		return {
			entry: updated,
			changed
		};
	};
	const normalizeProvider = (provider) => {
		const rawEntry = next.channels?.[provider];
		if (!isRecord(rawEntry)) return;
		const base = normalizeDmAliases({
			provider,
			entry: rawEntry,
			pathPrefix: `channels.${provider}`
		});
		let updated = base.entry;
		let changed = base.changed;
		const rawAccounts = updated.accounts;
		if (isRecord(rawAccounts)) {
			let accountsChanged = false;
			const accounts = { ...rawAccounts };
			for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
				if (!isRecord(rawAccount)) continue;
				const res = normalizeDmAliases({
					provider,
					entry: rawAccount,
					pathPrefix: `channels.${provider}.accounts.${accountId}`
				});
				if (res.changed) {
					accounts[accountId] = res.entry;
					accountsChanged = true;
				}
			}
			if (accountsChanged) {
				updated = {
					...updated,
					accounts
				};
				changed = true;
			}
		}
		if (changed) next = {
			...next,
			channels: {
				...next.channels,
				[provider]: updated
			}
		};
	};
	normalizeProvider("slack");
	normalizeProvider("discord");
	const legacyAckReaction = cfg.messages?.ackReaction?.trim();
	const hasWhatsAppConfig = cfg.channels?.whatsapp !== void 0;
	if (legacyAckReaction && hasWhatsAppConfig) {
		if (!(cfg.channels?.whatsapp?.ackReaction !== void 0)) {
			const legacyScope = cfg.messages?.ackReactionScope ?? "group-mentions";
			let direct = true;
			let group = "mentions";
			if (legacyScope === "all") {
				direct = true;
				group = "always";
			} else if (legacyScope === "direct") {
				direct = true;
				group = "never";
			} else if (legacyScope === "group-all") {
				direct = false;
				group = "always";
			} else if (legacyScope === "group-mentions") {
				direct = false;
				group = "mentions";
			}
			next = {
				...next,
				channels: {
					...next.channels,
					whatsapp: {
						...next.channels?.whatsapp,
						ackReaction: {
							emoji: legacyAckReaction,
							direct,
							group
						}
					}
				}
			};
			changes.push(`Copied messages.ackReaction → channels.whatsapp.ackReaction (scope: ${legacyScope}).`);
		}
	}
	return {
		config: next,
		changes
	};
}

//#endregion
//#region src/infra/state-migrations.fs.ts
function safeReadDir(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}
function existsDir(dir) {
	try {
		return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
	} catch {
		return false;
	}
}
function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}
function fileExists(p) {
	try {
		return fs.existsSync(p) && fs.statSync(p).isFile();
	} catch {
		return false;
	}
}
function isLegacyWhatsAppAuthFile(name) {
	if (name === "creds.json" || name === "creds.json.bak") return true;
	if (!name.endsWith(".json")) return false;
	return /^(app-state-sync|session|sender-key|pre-key)-/.test(name);
}
function readSessionStoreJson5(storePath) {
	try {
		const raw = fs.readFileSync(storePath, "utf-8");
		const parsed = JSON5.parse(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			store: parsed,
			ok: true
		};
	} catch {}
	return {
		store: {},
		ok: false
	};
}

//#endregion
//#region src/infra/state-migrations.ts
let autoMigrateStateDirChecked = false;
function isSurfaceGroupKey(key) {
	return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key) {
	const trimmed = key.trim();
	if (!trimmed) return false;
	if (trimmed.startsWith("group:")) return true;
	const lower = trimmed.toLowerCase();
	if (!lower.includes("@g.us")) return false;
	if (!trimmed.includes(":")) return true;
	if (lower.startsWith("whatsapp:") && !trimmed.includes(":group:")) return true;
	return false;
}
function canonicalizeSessionKeyForAgent(params) {
	const agentId = normalizeAgentId(params.agentId);
	const raw = params.key.trim();
	if (!raw) return raw;
	if (raw.toLowerCase() === "global" || raw.toLowerCase() === "unknown") return raw.toLowerCase();
	const canonicalMain = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.scope,
			mainKey: params.mainKey
		} },
		agentId,
		sessionKey: raw
	});
	if (canonicalMain !== raw) return canonicalMain.toLowerCase();
	if (raw.toLowerCase().startsWith("agent:")) return raw.toLowerCase();
	if (raw.toLowerCase().startsWith("subagent:")) return `agent:${agentId}:subagent:${raw.slice(9)}`.toLowerCase();
	if (raw.startsWith("group:")) {
		const id = raw.slice(6).trim();
		if (!id) return raw;
		return `agent:${agentId}:${id.toLowerCase().includes("@g.us") ? "whatsapp" : "unknown"}:group:${id}`.toLowerCase();
	}
	if (!raw.includes(":") && raw.toLowerCase().includes("@g.us")) return `agent:${agentId}:whatsapp:group:${raw}`.toLowerCase();
	if (raw.toLowerCase().startsWith("whatsapp:") && raw.toLowerCase().includes("@g.us")) {
		const cleaned = raw.slice(9).trim().replace(/^group:/i, "").trim();
		if (cleaned && !isSurfaceGroupKey(raw)) return `agent:${agentId}:whatsapp:group:${cleaned}`.toLowerCase();
	}
	if (isSurfaceGroupKey(raw)) return `agent:${agentId}:${raw}`.toLowerCase();
	return `agent:${agentId}:${raw}`.toLowerCase();
}
function pickLatestLegacyDirectEntry(store) {
	let best = null;
	let bestUpdated = -1;
	for (const [key, entry] of Object.entries(store)) {
		if (!entry || typeof entry !== "object") continue;
		const normalized = key.trim();
		if (!normalized) continue;
		if (normalized === "global") continue;
		if (normalized.startsWith("agent:")) continue;
		if (normalized.toLowerCase().startsWith("subagent:")) continue;
		if (isLegacyGroupKey(normalized) || isSurfaceGroupKey(normalized)) continue;
		const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
		if (updatedAt > bestUpdated) {
			bestUpdated = updatedAt;
			best = entry;
		}
	}
	return best;
}
function normalizeSessionEntry(entry) {
	const sessionId = typeof entry.sessionId === "string" ? entry.sessionId : null;
	if (!sessionId) return null;
	const updatedAt = typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : Date.now();
	const normalized = {
		...entry,
		sessionId,
		updatedAt
	};
	const rec = normalized;
	if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") rec.groupChannel = rec.room;
	delete rec.room;
	return normalized;
}
function resolveUpdatedAt(entry) {
	return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : 0;
}
function mergeSessionEntry(params) {
	if (!params.existing) return params.incoming;
	const existingUpdated = resolveUpdatedAt(params.existing);
	const incomingUpdated = resolveUpdatedAt(params.incoming);
	if (incomingUpdated > existingUpdated) return params.incoming;
	if (incomingUpdated < existingUpdated) return params.existing;
	return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
	const canonical = {};
	const meta = /* @__PURE__ */ new Map();
	const legacyKeys = [];
	for (const [key, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		const canonicalKey = canonicalizeSessionKeyForAgent({
			key,
			agentId: params.agentId,
			mainKey: params.mainKey,
			scope: params.scope
		});
		const isCanonical = canonicalKey === key;
		if (!isCanonical) legacyKeys.push(key);
		const existing = canonical[canonicalKey];
		if (!existing) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: resolveUpdatedAt(entry)
			});
			continue;
		}
		const existingMeta = meta.get(canonicalKey);
		const incomingUpdated = resolveUpdatedAt(entry);
		const existingUpdated = existingMeta?.updatedAt ?? resolveUpdatedAt(existing);
		if (incomingUpdated > existingUpdated) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
		if (incomingUpdated < existingUpdated) continue;
		if (existingMeta?.isCanonical && !isCanonical) continue;
		if (!existingMeta?.isCanonical && isCanonical) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
	}
	return {
		store: canonical,
		legacyKeys
	};
}
function listLegacySessionKeys(params) {
	const legacy = [];
	for (const key of Object.keys(params.store)) if (canonicalizeSessionKeyForAgent({
		key,
		agentId: params.agentId,
		mainKey: params.mainKey,
		scope: params.scope
	}) !== key) legacy.push(key);
	return legacy;
}
function emptyDirOrMissing(dir) {
	if (!existsDir(dir)) return true;
	return safeReadDir(dir).length === 0;
}
function removeDirIfEmpty(dir) {
	if (!existsDir(dir)) return;
	if (!emptyDirOrMissing(dir)) return;
	try {
		fs.rmdirSync(dir);
	} catch {}
}
function resolveSymlinkTarget(linkPath) {
	try {
		const target = fs.readlinkSync(linkPath);
		return path.resolve(path.dirname(linkPath), target);
	} catch {
		return null;
	}
}
function formatStateDirMigration(legacyDir, targetDir) {
	return `State dir: ${legacyDir} → ${targetDir} (legacy path now symlinked)`;
}
function isDirPath(filePath) {
	try {
		return fs.statSync(filePath).isDirectory();
	} catch {
		return false;
	}
}
function isLegacyTreeSymlinkMirror(currentDir, realTargetDir) {
	let entries;
	try {
		entries = fs.readdirSync(currentDir, { withFileTypes: true });
	} catch {
		return false;
	}
	if (entries.length === 0) return false;
	for (const entry of entries) {
		const entryPath = path.join(currentDir, entry.name);
		let stat;
		try {
			stat = fs.lstatSync(entryPath);
		} catch {
			return false;
		}
		if (stat.isSymbolicLink()) {
			const resolvedTarget = resolveSymlinkTarget(entryPath);
			if (!resolvedTarget) return false;
			let resolvedRealTarget;
			try {
				resolvedRealTarget = fs.realpathSync(resolvedTarget);
			} catch {
				return false;
			}
			if (!isWithinDir(realTargetDir, resolvedRealTarget)) return false;
			continue;
		}
		if (stat.isDirectory()) {
			if (!isLegacyTreeSymlinkMirror(entryPath, realTargetDir)) return false;
			continue;
		}
		return false;
	}
	return true;
}
function isLegacyDirSymlinkMirror(legacyDir, targetDir) {
	let realTargetDir;
	try {
		realTargetDir = fs.realpathSync(targetDir);
	} catch {
		return false;
	}
	return isLegacyTreeSymlinkMirror(legacyDir, realTargetDir);
}
async function autoMigrateLegacyStateDir(params) {
	if (autoMigrateStateDirChecked) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateStateDirChecked = true;
	if ((params.env ?? process.env).OPENCLAW_STATE_DIR?.trim()) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	const homedir = params.homedir ?? os.homedir;
	const targetDir = resolveNewStateDir(homedir);
	const legacyDirs = resolveLegacyStateDirs(homedir);
	let legacyDir = legacyDirs.find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	const warnings = [];
	const changes = [];
	let legacyStat = null;
	try {
		legacyStat = legacyDir ? fs.lstatSync(legacyDir) : null;
	} catch {
		legacyStat = null;
	}
	if (!legacyStat) return {
		migrated: false,
		skipped: false,
		changes,
		warnings
	};
	if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
		warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	let symlinkDepth = 0;
	while (legacyStat.isSymbolicLink()) {
		const legacyTarget = legacyDir ? resolveSymlinkTarget(legacyDir) : null;
		if (!legacyTarget) {
			warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"}); could not resolve target.`);
			return {
				migrated: false,
				skipped: false,
				changes,
				warnings
			};
		}
		if (path.resolve(legacyTarget) === path.resolve(targetDir)) return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
		if (legacyDirs.some((dir) => path.resolve(dir) === path.resolve(legacyTarget))) {
			legacyDir = legacyTarget;
			try {
				legacyStat = fs.lstatSync(legacyDir);
			} catch {
				legacyStat = null;
			}
			if (!legacyStat) {
				warnings.push(`Legacy state dir missing after symlink resolution: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
				warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			symlinkDepth += 1;
			if (symlinkDepth > 2) {
				warnings.push(`Legacy state dir symlink chain too deep: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			continue;
		}
		warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"} → ${legacyTarget}); skipping auto-migration.`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	if (isDirPath(targetDir)) {
		if (legacyDir && isLegacyDirSymlinkMirror(legacyDir, targetDir)) return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
		warnings.push(`State dir migration skipped: target already exists (${targetDir}). Remove or merge manually.`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.renameSync(legacyDir, targetDir);
	} catch (err) {
		warnings.push(`Failed to move legacy state dir (${legacyDir ?? "unknown"} → ${targetDir}): ${String(err)}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.symlinkSync(targetDir, legacyDir, "dir");
		changes.push(formatStateDirMigration(legacyDir, targetDir));
	} catch (err) {
		try {
			if (process.platform === "win32") {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: err });
				fs.symlinkSync(targetDir, legacyDir, "junction");
				changes.push(formatStateDirMigration(legacyDir, targetDir));
			} else throw err;
		} catch (fallbackErr) {
			try {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: fallbackErr });
				fs.renameSync(targetDir, legacyDir);
				warnings.push(`State dir migration rolled back (failed to link legacy path): ${String(fallbackErr)}`);
				return {
					migrated: false,
					skipped: false,
					changes: [],
					warnings
				};
			} catch (rollbackErr) {
				warnings.push(`State dir moved but failed to link legacy path (${legacyDir ?? "unknown"} → ${targetDir}): ${String(fallbackErr)}`);
				warnings.push(`Rollback failed; set OPENCLAW_STATE_DIR=${targetDir} to avoid split state: ${String(rollbackErr)}`);
				changes.push(`State dir: ${legacyDir ?? "unknown"} → ${targetDir}`);
			}
		}
	}
	return {
		migrated: changes.length > 0,
		skipped: false,
		changes,
		warnings
	};
}
async function detectLegacyStateMigrations(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env, params.homedir ?? os.homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const targetAgentId = normalizeAgentId(resolveDefaultAgentId(params.cfg));
	const rawMainKey = params.cfg.session?.mainKey;
	const targetMainKey = typeof rawMainKey === "string" && rawMainKey.trim().length > 0 ? rawMainKey.trim() : DEFAULT_MAIN_KEY;
	const targetScope = params.cfg.session?.scope;
	const sessionsLegacyDir = path.join(stateDir, "sessions");
	const sessionsLegacyStorePath = path.join(sessionsLegacyDir, "sessions.json");
	const sessionsTargetDir = path.join(stateDir, "agents", targetAgentId, "sessions");
	const sessionsTargetStorePath = path.join(sessionsTargetDir, "sessions.json");
	const legacySessionEntries = safeReadDir(sessionsLegacyDir);
	const hasLegacySessions = fileExists(sessionsLegacyStorePath) || legacySessionEntries.some((e) => e.isFile() && e.name.endsWith(".jsonl"));
	const targetSessionParsed = fileExists(sessionsTargetStorePath) ? readSessionStoreJson5(sessionsTargetStorePath) : {
		store: {},
		ok: true
	};
	const legacyKeys = targetSessionParsed.ok ? listLegacySessionKeys({
		store: targetSessionParsed.store,
		agentId: targetAgentId,
		mainKey: targetMainKey,
		scope: targetScope
	}) : [];
	const legacyAgentDir = path.join(stateDir, "agent");
	const targetAgentDir = path.join(stateDir, "agents", targetAgentId, "agent");
	const hasLegacyAgentDir = existsDir(legacyAgentDir);
	const targetWhatsAppAuthDir = path.join(oauthDir, "whatsapp", DEFAULT_ACCOUNT_ID);
	const hasLegacyWhatsAppAuth = fileExists(path.join(oauthDir, "creds.json")) && !fileExists(path.join(targetWhatsAppAuthDir, "creds.json"));
	const legacyTelegramAllowFromPath = path.join(oauthDir, "telegram-allowFrom.json");
	const targetTelegramAllowFromPath = path.join(oauthDir, `telegram-${DEFAULT_ACCOUNT_ID}-allowFrom.json`);
	const hasLegacyTelegramAllowFrom = fileExists(legacyTelegramAllowFromPath) && !fileExists(targetTelegramAllowFromPath);
	const preview = [];
	if (hasLegacySessions) preview.push(`- Sessions: ${sessionsLegacyDir} → ${sessionsTargetDir}`);
	if (legacyKeys.length > 0) preview.push(`- Sessions: canonicalize legacy keys in ${sessionsTargetStorePath}`);
	if (hasLegacyAgentDir) preview.push(`- Agent dir: ${legacyAgentDir} → ${targetAgentDir}`);
	if (hasLegacyWhatsAppAuth) preview.push(`- WhatsApp auth: ${oauthDir} → ${targetWhatsAppAuthDir} (keep oauth.json)`);
	if (hasLegacyTelegramAllowFrom) preview.push(`- Telegram pairing allowFrom: ${legacyTelegramAllowFromPath} → ${targetTelegramAllowFromPath}`);
	return {
		targetAgentId,
		targetMainKey,
		targetScope,
		stateDir,
		oauthDir,
		sessions: {
			legacyDir: sessionsLegacyDir,
			legacyStorePath: sessionsLegacyStorePath,
			targetDir: sessionsTargetDir,
			targetStorePath: sessionsTargetStorePath,
			hasLegacy: hasLegacySessions || legacyKeys.length > 0,
			legacyKeys
		},
		agentDir: {
			legacyDir: legacyAgentDir,
			targetDir: targetAgentDir,
			hasLegacy: hasLegacyAgentDir
		},
		whatsappAuth: {
			legacyDir: oauthDir,
			targetDir: targetWhatsAppAuthDir,
			hasLegacy: hasLegacyWhatsAppAuth
		},
		pairingAllowFrom: {
			legacyTelegramPath: legacyTelegramAllowFromPath,
			targetTelegramPath: targetTelegramAllowFromPath,
			hasLegacyTelegram: hasLegacyTelegramAllowFrom
		},
		preview
	};
}
async function migrateLegacySessions(detected, now) {
	const changes = [];
	const warnings = [];
	if (!detected.sessions.hasLegacy) return {
		changes,
		warnings
	};
	ensureDir(detected.sessions.targetDir);
	const legacyParsed = fileExists(detected.sessions.legacyStorePath) ? readSessionStoreJson5(detected.sessions.legacyStorePath) : {
		store: {},
		ok: true
	};
	const targetParsed = fileExists(detected.sessions.targetStorePath) ? readSessionStoreJson5(detected.sessions.targetStorePath) : {
		store: {},
		ok: true
	};
	const legacyStore = legacyParsed.store;
	const targetStore = targetParsed.store;
	const canonicalizedTarget = canonicalizeSessionStore({
		store: targetStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope
	});
	const canonicalizedLegacy = canonicalizeSessionStore({
		store: legacyStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope
	});
	const merged = { ...canonicalizedTarget.store };
	for (const [key, entry] of Object.entries(canonicalizedLegacy.store)) merged[key] = mergeSessionEntry({
		existing: merged[key],
		incoming: entry,
		preferIncomingOnTie: false
	});
	const mainKey = buildAgentMainSessionKey({
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey
	});
	if (!merged[mainKey]) {
		const latest = pickLatestLegacyDirectEntry(legacyStore);
		if (latest?.sessionId) {
			merged[mainKey] = latest;
			changes.push(`Migrated latest direct-chat session → ${mainKey}`);
		}
	}
	if (!legacyParsed.ok) warnings.push(`Legacy sessions store unreadable; left in place at ${detected.sessions.legacyStorePath}`);
	if ((legacyParsed.ok || targetParsed.ok) && (Object.keys(legacyStore).length > 0 || Object.keys(targetStore).length > 0)) {
		const normalized = {};
		for (const [key, entry] of Object.entries(merged)) {
			const normalizedEntry = normalizeSessionEntry(entry);
			if (!normalizedEntry) continue;
			normalized[key] = normalizedEntry;
		}
		await saveSessionStore(detected.sessions.targetStorePath, normalized, { skipMaintenance: true });
		changes.push(`Merged sessions store → ${detected.sessions.targetStorePath}`);
		if (canonicalizedTarget.legacyKeys.length > 0) changes.push(`Canonicalized ${canonicalizedTarget.legacyKeys.length} legacy session key(s)`);
	}
	const entries = safeReadDir(detected.sessions.legacyDir);
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (entry.name === "sessions.json") continue;
		const from = path.join(detected.sessions.legacyDir, entry.name);
		const to = path.join(detected.sessions.targetDir, entry.name);
		if (fileExists(to)) continue;
		try {
			fs.renameSync(from, to);
			changes.push(`Moved ${entry.name} → agents/${detected.targetAgentId}/sessions`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	if (legacyParsed.ok) try {
		if (fileExists(detected.sessions.legacyStorePath)) fs.rmSync(detected.sessions.legacyStorePath, { force: true });
	} catch {}
	removeDirIfEmpty(detected.sessions.legacyDir);
	if (safeReadDir(detected.sessions.legacyDir).filter((e) => e.isFile()).length > 0) {
		const backupDir = `${detected.sessions.legacyDir}.legacy-${now()}`;
		try {
			fs.renameSync(detected.sessions.legacyDir, backupDir);
			warnings.push(`Left legacy sessions at ${backupDir}`);
		} catch {}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyAgentDir(detected, now) {
	const changes = [];
	const warnings = [];
	if (!detected.agentDir.hasLegacy) return {
		changes,
		warnings
	};
	ensureDir(detected.agentDir.targetDir);
	const entries = safeReadDir(detected.agentDir.legacyDir);
	for (const entry of entries) {
		const from = path.join(detected.agentDir.legacyDir, entry.name);
		const to = path.join(detected.agentDir.targetDir, entry.name);
		if (fs.existsSync(to)) continue;
		try {
			fs.renameSync(from, to);
			changes.push(`Moved agent file ${entry.name} → agents/${detected.targetAgentId}/agent`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	removeDirIfEmpty(detected.agentDir.legacyDir);
	if (!emptyDirOrMissing(detected.agentDir.legacyDir)) {
		const backupDir = path.join(detected.stateDir, "agents", detected.targetAgentId, `agent.legacy-${now()}`);
		try {
			fs.renameSync(detected.agentDir.legacyDir, backupDir);
			warnings.push(`Left legacy agent dir at ${backupDir}`);
		} catch (err) {
			warnings.push(`Failed relocating legacy agent dir: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyWhatsAppAuth(detected) {
	const changes = [];
	const warnings = [];
	if (!detected.whatsappAuth.hasLegacy) return {
		changes,
		warnings
	};
	ensureDir(detected.whatsappAuth.targetDir);
	const entries = safeReadDir(detected.whatsappAuth.legacyDir);
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (entry.name === "oauth.json") continue;
		if (!isLegacyWhatsAppAuthFile(entry.name)) continue;
		const from = path.join(detected.whatsappAuth.legacyDir, entry.name);
		const to = path.join(detected.whatsappAuth.targetDir, entry.name);
		if (fileExists(to)) continue;
		try {
			fs.renameSync(from, to);
			changes.push(`Moved WhatsApp auth ${entry.name} → whatsapp/default`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyTelegramPairingAllowFrom(detected) {
	const changes = [];
	const warnings = [];
	if (!detected.pairingAllowFrom.hasLegacyTelegram) return {
		changes,
		warnings
	};
	const legacyPath = detected.pairingAllowFrom.legacyTelegramPath;
	const targetPath = detected.pairingAllowFrom.targetTelegramPath;
	try {
		ensureDir(path.dirname(targetPath));
		fs.copyFileSync(legacyPath, targetPath);
		changes.push(`Copied Telegram pairing allowFrom → ${targetPath}`);
	} catch (err) {
		warnings.push(`Failed migrating Telegram pairing allowFrom (${legacyPath}): ${String(err)}`);
	}
	return {
		changes,
		warnings
	};
}
async function runLegacyStateMigrations(params) {
	const now = params.now ?? (() => Date.now());
	const detected = params.detected;
	const sessions = await migrateLegacySessions(detected, now);
	const agentDir = await migrateLegacyAgentDir(detected, now);
	const whatsappAuth = await migrateLegacyWhatsAppAuth(detected);
	const telegramPairingAllowFrom = await migrateLegacyTelegramPairingAllowFrom(detected);
	return {
		changes: [
			...sessions.changes,
			...agentDir.changes,
			...whatsappAuth.changes,
			...telegramPairingAllowFrom.changes
		],
		warnings: [
			...sessions.warnings,
			...agentDir.warnings,
			...whatsappAuth.warnings,
			...telegramPairingAllowFrom.warnings
		]
	};
}

//#endregion
//#region src/commands/doctor-config-flow.ts
function normalizeIssuePath(path) {
	return path.filter((part) => typeof part !== "symbol");
}
function isUnrecognizedKeysIssue(issue) {
	return issue.code === "unrecognized_keys";
}
function formatPath(parts) {
	if (parts.length === 0) return "<root>";
	let out = "";
	for (const part of parts) {
		if (typeof part === "number") {
			out += `[${part}]`;
			continue;
		}
		out = out ? `${out}.${part}` : part;
	}
	return out || "<root>";
}
function resolvePathTarget(root, path) {
	let current = root;
	for (const part of path) {
		if (typeof part === "number") {
			if (!Array.isArray(current)) return null;
			if (part < 0 || part >= current.length) return null;
			current = current[part];
			continue;
		}
		if (!current || typeof current !== "object" || Array.isArray(current)) return null;
		const record = current;
		if (!(part in record)) return null;
		current = record[part];
	}
	return current;
}
function stripUnknownConfigKeys(config) {
	const parsed = OpenClawSchema.safeParse(config);
	if (parsed.success) return {
		config,
		removed: []
	};
	const next = structuredClone(config);
	const removed = [];
	for (const issue of parsed.error.issues) {
		if (!isUnrecognizedKeysIssue(issue)) continue;
		const path = normalizeIssuePath(issue.path);
		const target = resolvePathTarget(next, path);
		if (!target || typeof target !== "object" || Array.isArray(target)) continue;
		const record = target;
		for (const key of issue.keys) {
			if (typeof key !== "string") continue;
			if (!(key in record)) continue;
			delete record[key];
			removed.push(formatPath([...path, key]));
		}
	}
	return {
		config: next,
		removed
	};
}
function noteOpencodeProviderOverrides(cfg) {
	const providers = cfg.models?.providers;
	if (!providers) return;
	const overrides = [];
	if (providers.opencode) overrides.push("opencode");
	if (providers["opencode-zen"]) overrides.push("opencode-zen");
	if (overrides.length === 0) return;
	const lines = overrides.flatMap((id) => {
		const providerEntry = providers[id];
		const api = isRecord(providerEntry) && typeof providerEntry.api === "string" ? providerEntry.api : void 0;
		return [`- models.providers.${id} is set; this overrides the built-in OpenCode Zen catalog.`, api ? `- models.providers.${id}.api=${api}` : null].filter((line) => Boolean(line));
	});
	lines.push("- Remove these entries to restore per-model API routing + costs (then re-run onboarding if needed).");
	note(lines.join("\n"), "OpenCode Zen");
}
function scanTelegramAllowFromUsernameEntries(cfg) {
	const hits = [];
	const telegram = cfg.channels?.telegram;
	if (!telegram) return hits;
	const scanList = (pathLabel, list) => {
		if (!Array.isArray(list)) return;
		for (const entry of list) {
			const normalized = normalizeTelegramAllowFromEntry(entry);
			if (!normalized || normalized === "*") continue;
			if (isNumericTelegramUserId(normalized)) continue;
			hits.push({
				path: pathLabel,
				entry: String(entry).trim()
			});
		}
	};
	const scanAccount = (prefix, account) => {
		scanList(`${prefix}.allowFrom`, account.allowFrom);
		scanList(`${prefix}.groupAllowFrom`, account.groupAllowFrom);
		const groups = account.groups;
		if (!groups || typeof groups !== "object" || Array.isArray(groups)) return;
		const groupsRecord = groups;
		for (const groupId of Object.keys(groupsRecord)) {
			const group = groupsRecord[groupId];
			if (!group || typeof group !== "object" || Array.isArray(group)) continue;
			const groupRec = group;
			scanList(`${prefix}.groups.${groupId}.allowFrom`, groupRec.allowFrom);
			const topics = groupRec.topics;
			if (!topics || typeof topics !== "object" || Array.isArray(topics)) continue;
			const topicsRecord = topics;
			for (const topicId of Object.keys(topicsRecord)) {
				const topic = topicsRecord[topicId];
				if (!topic || typeof topic !== "object" || Array.isArray(topic)) continue;
				scanList(`${prefix}.groups.${groupId}.topics.${topicId}.allowFrom`, topic.allowFrom);
			}
		}
	};
	scanAccount("channels.telegram", telegram);
	const accounts = telegram.accounts;
	if (!accounts || typeof accounts !== "object" || Array.isArray(accounts)) return hits;
	for (const key of Object.keys(accounts)) {
		const account = accounts[key];
		if (!account || typeof account !== "object" || Array.isArray(account)) continue;
		scanAccount(`channels.telegram.accounts.${key}`, account);
	}
	return hits;
}
async function maybeRepairTelegramAllowFromUsernames(cfg) {
	if (scanTelegramAllowFromUsernameEntries(cfg).length === 0) return {
		config: cfg,
		changes: []
	};
	const tokens = Array.from(new Set(listTelegramAccountIds(cfg).map((accountId) => resolveTelegramAccount({
		cfg,
		accountId
	})).map((account) => account.tokenSource === "none" ? "" : account.token).map((token) => token.trim()).filter(Boolean)));
	if (tokens.length === 0) return {
		config: cfg,
		changes: [`- Telegram allowFrom contains @username entries, but no Telegram bot token is configured; cannot auto-resolve (run onboarding or replace with numeric sender IDs).`]
	};
	const resolveUserId = async (raw) => {
		const trimmed = raw.trim();
		if (!trimmed) return null;
		const stripped = normalizeTelegramAllowFromEntry(trimmed);
		if (!stripped || stripped === "*") return null;
		if (isNumericTelegramUserId(stripped)) return stripped;
		if (/\s/.test(stripped)) return null;
		const username = stripped.startsWith("@") ? stripped : `@${stripped}`;
		for (const token of tokens) {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 4e3);
			try {
				const url = `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(username)}`;
				const res = await fetch(url, { signal: controller.signal }).catch(() => null);
				if (!res || !res.ok) continue;
				const data = await res.json().catch(() => null);
				const id = data?.ok ? data?.result?.id : void 0;
				if (typeof id === "number" || typeof id === "string") return String(id);
			} catch {} finally {
				clearTimeout(timeout);
			}
		}
		return null;
	};
	const changes = [];
	const next = structuredClone(cfg);
	const repairList = async (pathLabel, holder, key) => {
		const raw = holder[key];
		if (!Array.isArray(raw)) return;
		const out = [];
		const replaced = [];
		for (const entry of raw) {
			const normalized = normalizeTelegramAllowFromEntry(entry);
			if (!normalized) continue;
			if (normalized === "*") {
				out.push("*");
				continue;
			}
			if (isNumericTelegramUserId(normalized)) {
				out.push(normalized);
				continue;
			}
			const resolved = await resolveUserId(String(entry));
			if (resolved) {
				out.push(resolved);
				replaced.push({
					from: String(entry).trim(),
					to: resolved
				});
			} else out.push(String(entry).trim());
		}
		const deduped = [];
		const seen = /* @__PURE__ */ new Set();
		for (const entry of out) {
			const k = String(entry).trim();
			if (!k || seen.has(k)) continue;
			seen.add(k);
			deduped.push(entry);
		}
		holder[key] = deduped;
		if (replaced.length > 0) {
			for (const rep of replaced.slice(0, 5)) changes.push(`- ${pathLabel}: resolved ${rep.from} -> ${rep.to}`);
			if (replaced.length > 5) changes.push(`- ${pathLabel}: resolved ${replaced.length - 5} more @username entries`);
		}
	};
	const repairAccount = async (prefix, account) => {
		await repairList(`${prefix}.allowFrom`, account, "allowFrom");
		await repairList(`${prefix}.groupAllowFrom`, account, "groupAllowFrom");
		const groups = account.groups;
		if (!groups || typeof groups !== "object" || Array.isArray(groups)) return;
		const groupsRecord = groups;
		for (const groupId of Object.keys(groupsRecord)) {
			const group = groupsRecord[groupId];
			if (!group || typeof group !== "object" || Array.isArray(group)) continue;
			const groupRec = group;
			await repairList(`${prefix}.groups.${groupId}.allowFrom`, groupRec, "allowFrom");
			const topics = groupRec.topics;
			if (!topics || typeof topics !== "object" || Array.isArray(topics)) continue;
			const topicsRecord = topics;
			for (const topicId of Object.keys(topicsRecord)) {
				const topic = topicsRecord[topicId];
				if (!topic || typeof topic !== "object" || Array.isArray(topic)) continue;
				await repairList(`${prefix}.groups.${groupId}.topics.${topicId}.allowFrom`, topic, "allowFrom");
			}
		}
	};
	const telegram = next.channels?.telegram;
	if (telegram && typeof telegram === "object" && !Array.isArray(telegram)) {
		await repairAccount("channels.telegram", telegram);
		const accounts = telegram.accounts;
		if (accounts && typeof accounts === "object" && !Array.isArray(accounts)) for (const key of Object.keys(accounts)) {
			const account = accounts[key];
			if (!account || typeof account !== "object" || Array.isArray(account)) continue;
			await repairAccount(`channels.telegram.accounts.${key}`, account);
		}
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetDir = path.join(home, ".openclaw");
	const targetPath = path.join(targetDir, "openclaw.json");
	try {
		await fs$1.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [
		path.join(home, ".clawdbot", "clawdbot.json"),
		path.join(home, ".moldbot", "moldbot.json"),
		path.join(home, ".moltbot", "moltbot.json")
	];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs$1.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs$1.mkdir(targetDir, { recursive: true });
	try {
		await fs$1.copyFile(legacyPath, targetPath, fs$1.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch {}
	return changes;
}
async function loadAndMaybeMigrateDoctorConfig(params) {
	const shouldRepair = params.options.repair === true || params.options.yes === true;
	const stateDirResult = await autoMigrateLegacyStateDir({ env: process.env });
	if (stateDirResult.changes.length > 0) note(stateDirResult.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	if (stateDirResult.warnings.length > 0) note(stateDirResult.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
	const legacyConfigChanges = await maybeMigrateLegacyConfig();
	if (legacyConfigChanges.length > 0) note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	let snapshot = await readConfigFileSnapshot();
	const baseCfg = snapshot.config ?? {};
	let cfg = baseCfg;
	let candidate = structuredClone(baseCfg);
	let pendingChanges = false;
	let shouldWriteConfig = false;
	const fixHints = [];
	if (snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) note("Config invalid; doctor will run with best-effort config.", "Config");
	const warnings = snapshot.warnings ?? [];
	if (warnings.length > 0) note(warnings.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n"), "Config warnings");
	if (snapshot.legacyIssues.length > 0) {
		note(snapshot.legacyIssues.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n"), "Legacy config keys detected");
		const { config: migrated, changes } = migrateLegacyConfig(snapshot.parsed);
		if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
		if (migrated) {
			candidate = migrated;
			pendingChanges = pendingChanges || changes.length > 0;
		}
		if (shouldRepair) {
			if (migrated) cfg = migrated;
		} else fixHints.push(`Run "${formatCliCommand("openclaw doctor --fix")}" to apply legacy migrations.`);
	}
	const normalized = normalizeLegacyConfigValues(candidate);
	if (normalized.changes.length > 0) {
		note(normalized.changes.join("\n"), "Doctor changes");
		candidate = normalized.config;
		pendingChanges = true;
		if (shouldRepair) cfg = normalized.config;
		else fixHints.push(`Run "${formatCliCommand("openclaw doctor --fix")}" to apply these changes.`);
	}
	const autoEnable = applyPluginAutoEnable({
		config: candidate,
		env: process.env
	});
	if (autoEnable.changes.length > 0) {
		note(autoEnable.changes.join("\n"), "Doctor changes");
		candidate = autoEnable.config;
		pendingChanges = true;
		if (shouldRepair) cfg = autoEnable.config;
		else fixHints.push(`Run "${formatCliCommand("openclaw doctor --fix")}" to apply these changes.`);
	}
	if (shouldRepair) {
		const repair = await maybeRepairTelegramAllowFromUsernames(candidate);
		if (repair.changes.length > 0) {
			note(repair.changes.join("\n"), "Doctor changes");
			candidate = repair.config;
			pendingChanges = true;
			cfg = repair.config;
		}
	} else {
		const hits = scanTelegramAllowFromUsernameEntries(candidate);
		if (hits.length > 0) note([`- Telegram allowFrom contains ${hits.length} non-numeric entries (e.g. ${hits[0]?.entry ?? "@"}); Telegram authorization requires numeric sender IDs.`, `- Run "${formatCliCommand("openclaw doctor --fix")}" to auto-resolve @username entries to numeric IDs (requires a Telegram bot token).`].join("\n"), "Doctor warnings");
	}
	const unknown = stripUnknownConfigKeys(candidate);
	if (unknown.removed.length > 0) {
		const lines = unknown.removed.map((path) => `- ${path}`).join("\n");
		candidate = unknown.config;
		pendingChanges = true;
		if (shouldRepair) {
			cfg = unknown.config;
			note(lines, "Doctor changes");
		} else {
			note(lines, "Unknown config keys");
			fixHints.push("Run \"openclaw doctor --fix\" to remove these keys.");
		}
	}
	if (!shouldRepair && pendingChanges) {
		if (await params.confirm({
			message: "Apply recommended config repairs now?",
			initialValue: true
		})) {
			cfg = candidate;
			shouldWriteConfig = true;
		} else if (fixHints.length > 0) note(fixHints.join("\n"), "Doctor");
	}
	noteOpencodeProviderOverrides(cfg);
	return {
		cfg,
		path: snapshot.path ?? CONFIG_PATH,
		shouldWriteConfig
	};
}

//#endregion
export { detectLegacyStateMigrations as n, runLegacyStateMigrations as r, loadAndMaybeMigrateDoctorConfig as t };