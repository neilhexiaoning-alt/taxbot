import "../pi-embedded-helpers-DIV_C5J8.mjs";
import { $n as removeAckReactionAfterReply, An as DEFAULT_GROUP_HISTORY_LIMIT, Ar as resolveAckReaction, B as CHANNEL_MESSAGE_ACTION_NAMES, Bi as resolveChannelEntryMatchWithFallback, Cn as createReplyPrefixContext, Ct as resolveDefaultLineAccountId, Dr as readReactionParams, Er as readNumberParam, Et as normalizeIMessageHandle, Fn as recordPendingHistoryEntry, Gn as formatLocationText, H as BLUEBUBBLES_ACTION_NAMES, Hn as resolveWhatsAppHeartbeatRecipients, Ii as formatAllowlistMatchMeta, In as recordPendingHistoryEntryIfEnabled, Kn as toLocationContext, Li as buildChannelKeyCandidates, Mn as buildPendingHistoryContextFromMap, Nn as clearHistoryEntries, Or as readStringParam, Pn as clearHistoryEntriesIfEnabled, Pr as normalizePluginHttpPath, Qn as resolveControlCommandGate, Qt as summarizeMapping, Ri as normalizeChannelSlug, St as normalizeAccountId$1, Tn as resolveMentionGatingWithBypass, Tr as jsonResult, U as BLUEBUBBLES_GROUP_ACTIONS, Un as recordInboundSession, V as BLUEBUBBLES_ACTIONS, Vi as resolveNestedAllowlistDecision, Xn as normalizeDiscordSlug, Xt as resolveDiscordChannelAllowlist, Yn as parseDiscordTarget, Yt as resolveDiscordUserAllowlist, Zt as mergeAllowlist, _n as logTypingFailure, _t as hasMarkdownToConvert, ar as createActionCard, bt as registerPluginHttpRoute, ci as onDiagnosticEvent, cr as createListCard, er as shouldAckReaction, et as optionalStringEnum, gn as logInboundDrop, hn as logAckFailure, ht as resolveSlackChannelAllowlist, kt as detectBinary, lr as createReceiptCard, mn as createTypingCallbacks, mt as resolveSlackUserAllowlist, oi as emitDiagnosticEvent, or as createImageCard, si as isDiagnosticsEnabled, sr as createInfoCard, tr as shouldAckReactionForWhatsApp, tt as stringEnum, vn as collectDiscordAuditChannelIds, vt as processLineMessage, wn as resolveMentionGating, wr as createActionGate, wt as resolveLineAccount, xn as loginWeb, xt as listLineAccountIds, yt as stripMarkdown, z as missingTargetError, zi as resolveChannelEntryMatch } from "../reply-CReGWUt7.mjs";
import "../paths-DcBT4Q4r.mjs";
import { D as DEFAULT_ACCOUNT_ID, N as normalizeAccountId } from "../agent-scope-BD88ooNs.mjs";
import { H as registerLogTransport, v as getChatChannelMeta } from "../subsystem-iSHcgawR.mjs";
import { d as normalizeE164, t as CONFIG_DIR } from "../utils-D9-prTJL.mjs";
import { t as runCommandWithTimeout } from "../exec-BRaJtAm2.mjs";
import "../model-selection-DNDKru6x.mjs";
import "../github-copilot-token-CewhQpWC.mjs";
import { t as formatCliCommand } from "../command-format-CRQZQg6U.mjs";
import "../boolean-B7lX4AU9.mjs";
import "../env-DE0tkFHW.mjs";
import { A as requireOpenAllowFrom, C as BlockStreamingCoalesceSchema, D as MarkdownConfigSchema, E as GroupPolicySchema, O as MarkdownTableModeSchema, S as ToolPolicySchema, T as DmPolicySchema, _ as SlackConfigSchema, d as WhatsAppConfigSchema, f as DiscordConfigSchema, g as SignalConfigSchema, h as MSTeamsConfigSchema, k as normalizeAllowFrom, m as IMessageConfigSchema, p as GoogleChatConfigSchema, v as TelegramConfigSchema, w as DmConfigSchema } from "../config-B_uz17RB.mjs";
import "../manifest-registry-BADIO_87.mjs";
import { A as listSlackAccountIds, C as resolveDefaultTelegramAccountId, I as listDiscordAccountIds, M as resolveSlackAccount, N as resolveSlackReplyToMode, R as resolveDefaultDiscordAccountId, S as listTelegramAccountIds, a as listDiscordDirectoryPeersFromConfig, b as normalizeWhatsAppTarget, c as listTelegramDirectoryGroupsFromConfig, d as listWhatsAppDirectoryPeersFromConfig, f as looksLikeSlackTargetId, i as listDiscordDirectoryGroupsFromConfig, j as resolveDefaultSlackAccountId, k as listEnabledSlackAccounts, l as listTelegramDirectoryPeersFromConfig, o as listSlackDirectoryGroupsFromConfig, p as normalizeSlackMessagingTarget, s as listSlackDirectoryPeersFromConfig, u as listWhatsAppDirectoryGroupsFromConfig, w as resolveTelegramAccount, y as isWhatsAppGroupJid, z as resolveDiscordAccount } from "../plugins-DSII6JvY.mjs";
import { $ as resolveTelegramGroupRequireMention, G as resolveDiscordGroupRequireMention, J as resolveGoogleChatGroupToolPolicy, K as resolveDiscordGroupToolPolicy, Q as resolveSlackGroupToolPolicy, U as resolveBlueBubblesGroupRequireMention, W as resolveBlueBubblesGroupToolPolicy, X as resolveIMessageGroupToolPolicy, Y as resolveIMessageGroupRequireMention, Z as resolveSlackGroupRequireMention, dt as resolveSignalAccount, et as resolveTelegramGroupToolPolicy, ft as listIMessageAccountIds, lt as listSignalAccountIds, mt as resolveIMessageAccount, nt as resolveWhatsAppGroupToolPolicy, ot as resolveToolsBySender, pt as resolveDefaultIMessageAccountId, q as resolveGoogleChatGroupRequireMention, st as buildSlackThreadingToolContext, tt as resolveWhatsAppGroupRequireMention, ut as resolveDefaultSignalAccountId } from "../sandbox-oRz8OYlY.mjs";
import "../image-Dsy38YsT.mjs";
import "../pi-model-discovery-B6X6meeT.mjs";
import "../chrome-PKn2zNTL.mjs";
import "../skills-Cb4fWMT0.mjs";
import { d as extensionForMime, f as getFileExtension, s as extractOriginalFilename, u as detectMime } from "../routes-2qU-Bliw.mjs";
import "../server-context-CAvvAxGZ.mjs";
import "../message-channel-Ls7G_LaM.mjs";
import "../logging-sIVJ3oF8.mjs";
import { a as resolveWhatsAppAuthDir, i as resolveWhatsAppAccount, n as listWhatsAppAccountIds, r as resolveDefaultWhatsAppAccountId } from "../accounts-Da593ZbL.mjs";
import "../paths-D0n0xdZb.mjs";
import "../redact-DjVwGPIJ.mjs";
import "../tool-display-C07JRsU3.mjs";
import { K as SILENT_REPLY_TOKEN, M as loadWebMedia, m as resolveChannelMediaMaxBytes, q as isSilentReplyText } from "../deliver-DeFlE7gj.mjs";
import "../dispatcher-CWBZae0H.mjs";
import "../manager-s7p2EtXX.mjs";
import "../sqlite-CG_dxLw3.mjs";
import "../warnings-DCJmPZde.mjs";
import "../channel-summary-CADwe6FA.mjs";
import "../client-DgdwkhIS.mjs";
import "../call-DrwxBANw.mjs";
import "../login-qr-BEDNHQPL.mjs";
import "../pairing-store-bEGBKxWn.mjs";
import { t as formatDocsLink } from "../links-DX7cRSHU.mjs";
import "../progress-BYrleoMX.mjs";
import "../pi-tools.policy-DvvMN9Ge.mjs";
import "../prompt-style-DXmBJpDK.mjs";
import "../pairing-labels-JtCdT618.mjs";
import "../control-service-tDwWDpUV.mjs";
import "../restart-sentinel-BSJCs5vQ.mjs";
import "../channel-selection-CFHdlQsS.mjs";
import { t as formatPairingApproveHint } from "../helpers--sAxmx1H.mjs";
import os from "node:os";
import path from "node:path";
import { createWriteStream } from "node:fs";
import fsPromises from "node:fs/promises";
import { z } from "zod";
import { request } from "node:https";
import { pipeline } from "node:stream/promises";

//#region src/plugins/config-schema.ts
function error(message) {
	return {
		success: false,
		error: { issues: [{
			path: [],
			message
		}] }
	};
}
function emptyPluginConfigSchema() {
	return {
		safeParse(value) {
			if (value === void 0) return {
				success: true,
				data: void 0
			};
			if (!value || typeof value !== "object" || Array.isArray(value)) return error("expected config object");
			if (Object.keys(value).length > 0) return error("config must be empty");
			return {
				success: true,
				data: value
			};
		},
		jsonSchema: {
			type: "object",
			additionalProperties: false,
			properties: {}
		}
	};
}

//#endregion
//#region src/channels/plugins/config-schema.ts
function buildChannelConfigSchema(schema) {
	return { schema: schema.toJSONSchema({
		target: "draft-07",
		unrepresentable: "any"
	}) };
}

//#endregion
//#region src/channels/plugins/config-helpers.ts
function setAccountEnabledInConfigSection(params) {
	const accountKey = params.accountId || DEFAULT_ACCOUNT_ID;
	const base = params.cfg.channels?.[params.sectionKey];
	const hasAccounts = Boolean(base?.accounts);
	if (params.allowTopLevel && accountKey === DEFAULT_ACCOUNT_ID && !hasAccounts) return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.sectionKey]: {
				...base,
				enabled: params.enabled
			}
		}
	};
	const baseAccounts = base?.accounts ?? {};
	const existing = baseAccounts[accountKey] ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.sectionKey]: {
				...base,
				accounts: {
					...baseAccounts,
					[accountKey]: {
						...existing,
						enabled: params.enabled
					}
				}
			}
		}
	};
}
function deleteAccountFromConfigSection(params) {
	const accountKey = params.accountId || DEFAULT_ACCOUNT_ID;
	const base = params.cfg.channels?.[params.sectionKey];
	if (!base) return params.cfg;
	const baseAccounts = base.accounts && typeof base.accounts === "object" ? { ...base.accounts } : void 0;
	if (accountKey !== DEFAULT_ACCOUNT_ID) {
		const accounts = baseAccounts ? { ...baseAccounts } : {};
		delete accounts[accountKey];
		return {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				[params.sectionKey]: {
					...base,
					accounts: Object.keys(accounts).length ? accounts : void 0
				}
			}
		};
	}
	if (baseAccounts && Object.keys(baseAccounts).length > 0) {
		delete baseAccounts[accountKey];
		const baseRecord = { ...base };
		for (const field of params.clearBaseFields ?? []) if (field in baseRecord) baseRecord[field] = void 0;
		return {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				[params.sectionKey]: {
					...baseRecord,
					accounts: Object.keys(baseAccounts).length ? baseAccounts : void 0
				}
			}
		};
	}
	const nextChannels = { ...params.cfg.channels };
	delete nextChannels[params.sectionKey];
	const nextCfg = { ...params.cfg };
	if (Object.keys(nextChannels).length > 0) nextCfg.channels = nextChannels;
	else delete nextCfg.channels;
	return nextCfg;
}

//#endregion
//#region src/channels/plugins/setup-helpers.ts
function channelHasAccounts(cfg, channelKey) {
	const base = cfg.channels?.[channelKey];
	return Boolean(base?.accounts && Object.keys(base.accounts).length > 0);
}
function shouldStoreNameInAccounts(params) {
	if (params.alwaysUseAccounts) return true;
	if (params.accountId !== DEFAULT_ACCOUNT_ID) return true;
	return channelHasAccounts(params.cfg, params.channelKey);
}
function applyAccountNameToChannelSection(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return params.cfg;
	const accountId = normalizeAccountId(params.accountId);
	const baseConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!shouldStoreNameInAccounts({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId,
		alwaysUseAccounts: params.alwaysUseAccounts
	}) && accountId === DEFAULT_ACCOUNT_ID) {
		const safeBase = base ?? {};
		return {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				[params.channelKey]: {
					...safeBase,
					name: trimmed
				}
			}
		};
	}
	const baseAccounts = base?.accounts ?? {};
	const existingAccount = baseAccounts[accountId] ?? {};
	const baseWithoutName = accountId === DEFAULT_ACCOUNT_ID ? (({ name: _ignored, ...rest }) => rest)(base ?? {}) : base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...baseWithoutName,
				accounts: {
					...baseAccounts,
					[accountId]: {
						...existingAccount,
						name: trimmed
					}
				}
			}
		}
	};
}
function migrateBaseNameToDefaultAccount(params) {
	if (params.alwaysUseAccounts) return params.cfg;
	const base = params.cfg.channels?.[params.channelKey];
	const baseName = base?.name?.trim();
	if (!baseName) return params.cfg;
	const accounts = { ...base?.accounts };
	const defaultAccount = accounts[DEFAULT_ACCOUNT_ID] ?? {};
	if (!defaultAccount.name) accounts[DEFAULT_ACCOUNT_ID] = {
		...defaultAccount,
		name: baseName
	};
	const { name: _ignored, ...rest } = base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...rest,
				accounts
			}
		}
	};
}

//#endregion
//#region src/channels/plugins/pairing-message.ts
const PAIRING_APPROVED_MESSAGE = "✅ OpenClaw access approved. Send a message to start chatting.";

//#endregion
//#region src/channels/plugins/onboarding/helpers.ts
const promptAccountId = async (params) => {
	const existingIds = params.listAccountIds(params.cfg);
	const initial = params.currentId?.trim() || params.defaultAccountId || DEFAULT_ACCOUNT_ID;
	const choice = await params.prompter.select({
		message: `${params.label} account`,
		options: [...existingIds.map((id) => ({
			value: id,
			label: id === DEFAULT_ACCOUNT_ID ? "default (primary)" : id
		})), {
			value: "__new__",
			label: "Add a new account"
		}],
		initialValue: initial
	});
	if (choice !== "__new__") return normalizeAccountId(choice);
	const entered = await params.prompter.text({
		message: `New ${params.label} account id`,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const normalized = normalizeAccountId(String(entered));
	if (String(entered).trim() !== normalized) await params.prompter.note(`Normalized account id to "${normalized}".`, `${params.label} account`);
	return normalized;
};
function addWildcardAllowFrom(allowFrom) {
	const next = (allowFrom ?? []).map((v) => String(v).trim()).filter(Boolean);
	if (!next.includes("*")) next.push("*");
	return next;
}

//#endregion
//#region src/channels/plugins/onboarding/channel-access.ts
function parseAllowlistEntries(raw) {
	return String(raw ?? "").split(/[,\n]/g).map((entry) => entry.trim()).filter(Boolean);
}
function formatAllowlistEntries(entries) {
	return entries.map((entry) => entry.trim()).filter(Boolean).join(", ");
}
async function promptChannelAccessPolicy(params) {
	const options = [{
		value: "allowlist",
		label: "Allowlist (recommended)"
	}];
	if (params.allowOpen !== false) options.push({
		value: "open",
		label: "Open (allow all channels)"
	});
	if (params.allowDisabled !== false) options.push({
		value: "disabled",
		label: "Disabled (block all channels)"
	});
	const initialValue = params.currentPolicy ?? "allowlist";
	return await params.prompter.select({
		message: `${params.label} access`,
		options,
		initialValue
	});
}
async function promptChannelAllowlist(params) {
	const initialValue = params.currentEntries && params.currentEntries.length > 0 ? formatAllowlistEntries(params.currentEntries) : void 0;
	return parseAllowlistEntries(await params.prompter.text({
		message: `${params.label} allowlist (comma-separated)`,
		placeholder: params.placeholder,
		initialValue
	}));
}
async function promptChannelAccessConfig(params) {
	const hasEntries = (params.currentEntries ?? []).length > 0;
	const shouldPrompt = params.defaultPrompt ?? !hasEntries;
	if (!await params.prompter.confirm({
		message: params.updatePrompt ? `Update ${params.label} access?` : `Configure ${params.label} access?`,
		initialValue: shouldPrompt
	})) return null;
	const policy = await promptChannelAccessPolicy({
		prompter: params.prompter,
		label: params.label,
		currentPolicy: params.currentPolicy,
		allowOpen: params.allowOpen,
		allowDisabled: params.allowDisabled
	});
	if (policy !== "allowlist") return {
		policy,
		entries: []
	};
	return {
		policy,
		entries: await promptChannelAllowlist({
			prompter: params.prompter,
			label: params.label,
			currentEntries: params.currentEntries,
			placeholder: params.placeholder
		})
	};
}

//#endregion
//#region src/channels/plugins/onboarding/discord.ts
const channel$5 = "discord";
function setDiscordDmPolicy(cfg, dmPolicy) {
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.discord?.dm?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				dm: {
					...cfg.channels?.discord?.dm,
					enabled: cfg.channels?.discord?.dm?.enabled ?? true,
					policy: dmPolicy,
					...allowFrom ? { allowFrom } : {}
				}
			}
		}
	};
}
async function noteDiscordTokenHelp(prompter) {
	await prompter.note([
		"1) Discord Developer Portal → Applications → New Application",
		"2) Bot → Add Bot → Reset Token → copy token",
		"3) OAuth2 → URL Generator → scope 'bot' → invite to your server",
		"Tip: enable Message Content Intent if you need message text. (Bot → Privileged Gateway Intents → Message Content Intent)",
		`Docs: ${formatDocsLink("/discord", "discord")}`
	].join("\n"), "Discord bot token");
}
function setDiscordGroupPolicy(cfg, accountId, groupPolicy) {
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				enabled: true,
				groupPolicy
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				enabled: true,
				accounts: {
					...cfg.channels?.discord?.accounts,
					[accountId]: {
						...cfg.channels?.discord?.accounts?.[accountId],
						enabled: cfg.channels?.discord?.accounts?.[accountId]?.enabled ?? true,
						groupPolicy
					}
				}
			}
		}
	};
}
function setDiscordGuildChannelAllowlist(cfg, accountId, entries) {
	const guilds = { ...accountId === DEFAULT_ACCOUNT_ID ? cfg.channels?.discord?.guilds ?? {} : cfg.channels?.discord?.accounts?.[accountId]?.guilds ?? {} };
	for (const entry of entries) {
		const guildKey = entry.guildKey || "*";
		const existing = guilds[guildKey] ?? {};
		if (entry.channelKey) {
			const channels = { ...existing.channels };
			channels[entry.channelKey] = { allow: true };
			guilds[guildKey] = {
				...existing,
				channels
			};
		} else guilds[guildKey] = existing;
	}
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				enabled: true,
				guilds
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				enabled: true,
				accounts: {
					...cfg.channels?.discord?.accounts,
					[accountId]: {
						...cfg.channels?.discord?.accounts?.[accountId],
						enabled: cfg.channels?.discord?.accounts?.[accountId]?.enabled ?? true,
						guilds
					}
				}
			}
		}
	};
}
function setDiscordAllowFrom(cfg, allowFrom) {
	return {
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				dm: {
					...cfg.channels?.discord?.dm,
					enabled: cfg.channels?.discord?.dm?.enabled ?? true,
					allowFrom
				}
			}
		}
	};
}
function parseDiscordAllowFromInput(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
async function promptDiscordAllowFrom(params) {
	const accountId = params.accountId && normalizeAccountId(params.accountId) ? normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultDiscordAccountId(params.cfg);
	const token = resolveDiscordAccount({
		cfg: params.cfg,
		accountId
	}).token;
	const existing = params.cfg.channels?.discord?.dm?.allowFrom ?? [];
	await params.prompter.note([
		"Allowlist Discord DMs by username (we resolve to user ids).",
		"Examples:",
		"- 123456789012345678",
		"- @alice",
		"- alice#1234",
		"Multiple entries: comma-separated.",
		`Docs: ${formatDocsLink("/discord", "discord")}`
	].join("\n"), "Discord allowlist");
	const parseInputs = (value) => parseDiscordAllowFromInput(value);
	const parseId = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return null;
		const mention = trimmed.match(/^<@!?(\d+)>$/);
		if (mention) return mention[1];
		const prefixed = trimmed.replace(/^(user:|discord:)/i, "");
		if (/^\d+$/.test(prefixed)) return prefixed;
		return null;
	};
	while (true) {
		const entry = await params.prompter.text({
			message: "Discord allowFrom (usernames or ids)",
			placeholder: "@alice, 123456789012345678",
			initialValue: existing[0] ? String(existing[0]) : void 0,
			validate: (value) => String(value ?? "").trim() ? void 0 : "Required"
		});
		const parts = parseInputs(String(entry));
		if (!token) {
			const ids = parts.map(parseId).filter(Boolean);
			if (ids.length !== parts.length) {
				await params.prompter.note("Bot token missing; use numeric user ids (or mention form) only.", "Discord allowlist");
				continue;
			}
			const unique = [...new Set([...existing.map((v) => String(v).trim()), ...ids])].filter(Boolean);
			return setDiscordAllowFrom(params.cfg, unique);
		}
		const results = await resolveDiscordUserAllowlist({
			token,
			entries: parts
		}).catch(() => null);
		if (!results) {
			await params.prompter.note("Failed to resolve usernames. Try again.", "Discord allowlist");
			continue;
		}
		const unresolved = results.filter((res) => !res.resolved || !res.id);
		if (unresolved.length > 0) {
			await params.prompter.note(`Could not resolve: ${unresolved.map((res) => res.input).join(", ")}`, "Discord allowlist");
			continue;
		}
		const ids = results.map((res) => res.id);
		const unique = [...new Set([...existing.map((v) => String(v).trim()).filter(Boolean), ...ids])];
		return setDiscordAllowFrom(params.cfg, unique);
	}
}
const dmPolicy$4 = {
	label: "Discord",
	channel: channel$5,
	policyKey: "channels.discord.dm.policy",
	allowFromKey: "channels.discord.dm.allowFrom",
	getCurrent: (cfg) => cfg.channels?.discord?.dm?.policy ?? "pairing",
	setPolicy: (cfg, policy) => setDiscordDmPolicy(cfg, policy),
	promptAllowFrom: promptDiscordAllowFrom
};
const discordOnboardingAdapter = {
	channel: channel$5,
	getStatus: async ({ cfg }) => {
		const configured = listDiscordAccountIds(cfg).some((accountId) => Boolean(resolveDiscordAccount({
			cfg,
			accountId
		}).token));
		return {
			channel: channel$5,
			configured,
			statusLines: [`Discord: ${configured ? "configured" : "needs token"}`],
			selectionHint: configured ? "configured" : "needs token",
			quickstartScore: configured ? 2 : 1
		};
	},
	configure: async ({ cfg, prompter, accountOverrides, shouldPromptAccountIds }) => {
		const discordOverride = accountOverrides.discord?.trim();
		const defaultDiscordAccountId = resolveDefaultDiscordAccountId(cfg);
		let discordAccountId = discordOverride ? normalizeAccountId(discordOverride) : defaultDiscordAccountId;
		if (shouldPromptAccountIds && !discordOverride) discordAccountId = await promptAccountId({
			cfg,
			prompter,
			label: "Discord",
			currentId: discordAccountId,
			listAccountIds: listDiscordAccountIds,
			defaultAccountId: defaultDiscordAccountId
		});
		let next = cfg;
		const resolvedAccount = resolveDiscordAccount({
			cfg: next,
			accountId: discordAccountId
		});
		const accountConfigured = Boolean(resolvedAccount.token);
		const canUseEnv = discordAccountId === DEFAULT_ACCOUNT_ID && Boolean(process.env.DISCORD_BOT_TOKEN?.trim());
		const hasConfigToken = Boolean(resolvedAccount.config.token);
		let token = null;
		if (!accountConfigured) await noteDiscordTokenHelp(prompter);
		if (canUseEnv && !resolvedAccount.config.token) if (await prompter.confirm({
			message: "DISCORD_BOT_TOKEN detected. Use env var?",
			initialValue: true
		})) next = {
			...next,
			channels: {
				...next.channels,
				discord: {
					...next.channels?.discord,
					enabled: true
				}
			}
		};
		else token = String(await prompter.text({
			message: "Enter Discord bot token",
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		else if (hasConfigToken) {
			if (!await prompter.confirm({
				message: "Discord token already configured. Keep it?",
				initialValue: true
			})) token = String(await prompter.text({
				message: "Enter Discord bot token",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
		} else token = String(await prompter.text({
			message: "Enter Discord bot token",
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		if (token) if (discordAccountId === DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				discord: {
					...next.channels?.discord,
					enabled: true,
					token
				}
			}
		};
		else next = {
			...next,
			channels: {
				...next.channels,
				discord: {
					...next.channels?.discord,
					enabled: true,
					accounts: {
						...next.channels?.discord?.accounts,
						[discordAccountId]: {
							...next.channels?.discord?.accounts?.[discordAccountId],
							enabled: next.channels?.discord?.accounts?.[discordAccountId]?.enabled ?? true,
							token
						}
					}
				}
			}
		};
		const currentEntries = Object.entries(resolvedAccount.config.guilds ?? {}).flatMap(([guildKey, value]) => {
			const channels = value?.channels ?? {};
			const channelKeys = Object.keys(channels);
			if (channelKeys.length === 0) return [guildKey];
			return channelKeys.map((channelKey) => `${guildKey}/${channelKey}`);
		});
		const accessConfig = await promptChannelAccessConfig({
			prompter,
			label: "Discord channels",
			currentPolicy: resolvedAccount.config.groupPolicy ?? "allowlist",
			currentEntries,
			placeholder: "My Server/#general, guildId/channelId, #support",
			updatePrompt: Boolean(resolvedAccount.config.guilds)
		});
		if (accessConfig) if (accessConfig.policy !== "allowlist") next = setDiscordGroupPolicy(next, discordAccountId, accessConfig.policy);
		else {
			const accountWithTokens = resolveDiscordAccount({
				cfg: next,
				accountId: discordAccountId
			});
			let resolved = accessConfig.entries.map((input) => ({
				input,
				resolved: false
			}));
			if (accountWithTokens.token && accessConfig.entries.length > 0) try {
				resolved = await resolveDiscordChannelAllowlist({
					token: accountWithTokens.token,
					entries: accessConfig.entries
				});
				const resolvedChannels = resolved.filter((entry) => entry.resolved && entry.channelId);
				const resolvedGuilds = resolved.filter((entry) => entry.resolved && entry.guildId && !entry.channelId);
				const unresolved = resolved.filter((entry) => !entry.resolved).map((entry) => entry.input);
				if (resolvedChannels.length > 0 || resolvedGuilds.length > 0 || unresolved.length > 0) {
					const summary = [];
					if (resolvedChannels.length > 0) summary.push(`Resolved channels: ${resolvedChannels.map((entry) => entry.channelId).filter(Boolean).join(", ")}`);
					if (resolvedGuilds.length > 0) summary.push(`Resolved guilds: ${resolvedGuilds.map((entry) => entry.guildId).filter(Boolean).join(", ")}`);
					if (unresolved.length > 0) summary.push(`Unresolved (kept as typed): ${unresolved.join(", ")}`);
					await prompter.note(summary.join("\n"), "Discord channels");
				}
			} catch (err) {
				await prompter.note(`Channel lookup failed; keeping entries as typed. ${String(err)}`, "Discord channels");
			}
			const allowlistEntries = [];
			for (const entry of resolved) {
				const guildKey = entry.guildId ?? (entry.guildName ? normalizeDiscordSlug(entry.guildName) : void 0) ?? "*";
				const channelKey = entry.channelId ?? (entry.channelName ? normalizeDiscordSlug(entry.channelName) : void 0);
				if (!channelKey && guildKey === "*") continue;
				allowlistEntries.push({
					guildKey,
					...channelKey ? { channelKey } : {}
				});
			}
			next = setDiscordGroupPolicy(next, discordAccountId, "allowlist");
			next = setDiscordGuildChannelAllowlist(next, discordAccountId, allowlistEntries);
		}
		return {
			cfg: next,
			accountId: discordAccountId
		};
	},
	dmPolicy: dmPolicy$4,
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			discord: {
				...cfg.channels?.discord,
				enabled: false
			}
		}
	})
};

//#endregion
//#region src/channels/plugins/normalize/discord.ts
function normalizeDiscordMessagingTarget(raw) {
	return parseDiscordTarget(raw, { defaultKind: "channel" })?.normalized;
}
function looksLikeDiscordTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^<@!?\d+>$/.test(trimmed)) return true;
	if (/^(user|channel|discord):/i.test(trimmed)) return true;
	if (/^\d{6,}$/.test(trimmed)) return true;
	return false;
}

//#endregion
//#region src/channels/plugins/status-issues/shared.ts
function asString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function formatMatchMetadata(params) {
	const matchKey = typeof params.matchKey === "string" ? params.matchKey : typeof params.matchKey === "number" ? String(params.matchKey) : void 0;
	const matchSource = asString(params.matchSource);
	const parts = [matchKey ? `matchKey=${matchKey}` : null, matchSource ? `matchSource=${matchSource}` : null].filter((entry) => Boolean(entry));
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function appendMatchMetadata(message, params) {
	const meta = formatMatchMetadata(params);
	return meta ? `${message} (${meta})` : message;
}

//#endregion
//#region src/channels/plugins/status-issues/discord.ts
function readDiscordAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		configured: value.configured,
		application: value.application,
		audit: value.audit
	};
}
function readDiscordApplicationSummary(value) {
	if (!isRecord(value)) return {};
	const intentsRaw = value.intents;
	if (!isRecord(intentsRaw)) return {};
	return { intents: { messageContent: intentsRaw.messageContent === "enabled" || intentsRaw.messageContent === "limited" || intentsRaw.messageContent === "disabled" ? intentsRaw.messageContent : void 0 } };
}
function readDiscordPermissionsAuditSummary(value) {
	if (!isRecord(value)) return {};
	const unresolvedChannels = typeof value.unresolvedChannels === "number" && Number.isFinite(value.unresolvedChannels) ? value.unresolvedChannels : void 0;
	const channelsRaw = value.channels;
	return {
		unresolvedChannels,
		channels: Array.isArray(channelsRaw) ? channelsRaw.map((entry) => {
			if (!isRecord(entry)) return null;
			const channelId = asString(entry.channelId);
			if (!channelId) return null;
			const ok = typeof entry.ok === "boolean" ? entry.ok : void 0;
			const missing = Array.isArray(entry.missing) ? entry.missing.map((v) => asString(v)).filter(Boolean) : void 0;
			const error = asString(entry.error) ?? null;
			const matchKey = asString(entry.matchKey) ?? void 0;
			const matchSource = asString(entry.matchSource) ?? void 0;
			return {
				channelId,
				ok,
				missing: missing?.length ? missing : void 0,
				error,
				matchKey,
				matchSource
			};
		}).filter(Boolean) : void 0
	};
}
function collectDiscordStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readDiscordAccountStatus(entry);
		if (!account) continue;
		const accountId = asString(account.accountId) ?? "default";
		const enabled = account.enabled !== false;
		const configured = account.configured === true;
		if (!enabled || !configured) continue;
		if (readDiscordApplicationSummary(account.application).intents?.messageContent === "disabled") issues.push({
			channel: "discord",
			accountId,
			kind: "intent",
			message: "Message Content Intent is disabled. Bot may not see normal channel messages.",
			fix: "Enable Message Content Intent in Discord Dev Portal → Bot → Privileged Gateway Intents, or require mention-only operation."
		});
		const audit = readDiscordPermissionsAuditSummary(account.audit);
		if (audit.unresolvedChannels && audit.unresolvedChannels > 0) issues.push({
			channel: "discord",
			accountId,
			kind: "config",
			message: `Some configured guild channels are not numeric IDs (unresolvedChannels=${audit.unresolvedChannels}). Permission audit can only check numeric channel IDs.`,
			fix: "Use numeric channel IDs as keys in channels.discord.guilds.*.channels (then rerun channels status --probe)."
		});
		for (const channel of audit.channels ?? []) {
			if (channel.ok === true) continue;
			const missing = channel.missing?.length ? ` missing ${channel.missing.join(", ")}` : "";
			const error = channel.error ? `: ${channel.error}` : "";
			const baseMessage = `Channel ${channel.channelId} permission check failed.${missing}${error}`;
			issues.push({
				channel: "discord",
				accountId,
				kind: "permissions",
				message: appendMatchMetadata(baseMessage, {
					matchKey: channel.matchKey,
					matchSource: channel.matchSource
				}),
				fix: "Ensure the bot role can view + send in this channel (and that channel overrides don't deny it)."
			});
		}
	}
	return issues;
}

//#endregion
//#region src/channels/plugins/onboarding/imessage.ts
const channel$4 = "imessage";
function setIMessageDmPolicy(cfg, dmPolicy) {
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.imessage?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			imessage: {
				...cfg.channels?.imessage,
				dmPolicy,
				...allowFrom ? { allowFrom } : {}
			}
		}
	};
}
function setIMessageAllowFrom(cfg, accountId, allowFrom) {
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			imessage: {
				...cfg.channels?.imessage,
				allowFrom
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			imessage: {
				...cfg.channels?.imessage,
				accounts: {
					...cfg.channels?.imessage?.accounts,
					[accountId]: {
						...cfg.channels?.imessage?.accounts?.[accountId],
						allowFrom
					}
				}
			}
		}
	};
}
function parseIMessageAllowFromInput(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
async function promptIMessageAllowFrom(params) {
	const accountId = params.accountId && normalizeAccountId(params.accountId) ? normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultIMessageAccountId(params.cfg);
	const existing = resolveIMessageAccount({
		cfg: params.cfg,
		accountId
	}).config.allowFrom ?? [];
	await params.prompter.note([
		"Allowlist iMessage DMs by handle or chat target.",
		"Examples:",
		"- +15555550123",
		"- user@example.com",
		"- chat_id:123",
		"- chat_guid:... or chat_identifier:...",
		"Multiple entries: comma-separated.",
		`Docs: ${formatDocsLink("/imessage", "imessage")}`
	].join("\n"), "iMessage allowlist");
	const entry = await params.prompter.text({
		message: "iMessage allowFrom (handle or chat_id)",
		placeholder: "+15555550123, user@example.com, chat_id:123",
		initialValue: existing[0] ? String(existing[0]) : void 0,
		validate: (value) => {
			const raw = String(value ?? "").trim();
			if (!raw) return "Required";
			const parts = parseIMessageAllowFromInput(raw);
			for (const part of parts) {
				if (part === "*") continue;
				if (part.toLowerCase().startsWith("chat_id:")) {
					const id = part.slice(8).trim();
					if (!/^\d+$/.test(id)) return `Invalid chat_id: ${part}`;
					continue;
				}
				if (part.toLowerCase().startsWith("chat_guid:")) {
					if (!part.slice(10).trim()) return "Invalid chat_guid entry";
					continue;
				}
				if (part.toLowerCase().startsWith("chat_identifier:")) {
					if (!part.slice(16).trim()) return "Invalid chat_identifier entry";
					continue;
				}
				if (!normalizeIMessageHandle(part)) return `Invalid handle: ${part}`;
			}
		}
	});
	const parts = parseIMessageAllowFromInput(String(entry));
	const unique = [...new Set(parts)];
	return setIMessageAllowFrom(params.cfg, accountId, unique);
}
const dmPolicy$3 = {
	label: "iMessage",
	channel: channel$4,
	policyKey: "channels.imessage.dmPolicy",
	allowFromKey: "channels.imessage.allowFrom",
	getCurrent: (cfg) => cfg.channels?.imessage?.dmPolicy ?? "pairing",
	setPolicy: (cfg, policy) => setIMessageDmPolicy(cfg, policy),
	promptAllowFrom: promptIMessageAllowFrom
};
const imessageOnboardingAdapter = {
	channel: channel$4,
	getStatus: async ({ cfg }) => {
		const configured = listIMessageAccountIds(cfg).some((accountId) => {
			const account = resolveIMessageAccount({
				cfg,
				accountId
			});
			return Boolean(account.config.cliPath || account.config.dbPath || account.config.allowFrom || account.config.service || account.config.region);
		});
		const imessageCliPath = cfg.channels?.imessage?.cliPath ?? "imsg";
		const imessageCliDetected = await detectBinary(imessageCliPath);
		return {
			channel: channel$4,
			configured,
			statusLines: [`iMessage: ${configured ? "configured" : "needs setup"}`, `imsg: ${imessageCliDetected ? "found" : "missing"} (${imessageCliPath})`],
			selectionHint: imessageCliDetected ? "imsg found" : "imsg missing",
			quickstartScore: imessageCliDetected ? 1 : 0
		};
	},
	configure: async ({ cfg, prompter, accountOverrides, shouldPromptAccountIds }) => {
		const imessageOverride = accountOverrides.imessage?.trim();
		const defaultIMessageAccountId = resolveDefaultIMessageAccountId(cfg);
		let imessageAccountId = imessageOverride ? normalizeAccountId(imessageOverride) : defaultIMessageAccountId;
		if (shouldPromptAccountIds && !imessageOverride) imessageAccountId = await promptAccountId({
			cfg,
			prompter,
			label: "iMessage",
			currentId: imessageAccountId,
			listAccountIds: listIMessageAccountIds,
			defaultAccountId: defaultIMessageAccountId
		});
		let next = cfg;
		let resolvedCliPath = resolveIMessageAccount({
			cfg: next,
			accountId: imessageAccountId
		}).config.cliPath ?? "imsg";
		if (!await detectBinary(resolvedCliPath)) {
			const entered = await prompter.text({
				message: "imsg CLI path",
				initialValue: resolvedCliPath,
				validate: (value) => value?.trim() ? void 0 : "Required"
			});
			resolvedCliPath = String(entered).trim();
			if (!resolvedCliPath) await prompter.note("imsg CLI path required to enable iMessage.", "iMessage");
		}
		if (resolvedCliPath) if (imessageAccountId === DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				imessage: {
					...next.channels?.imessage,
					enabled: true,
					cliPath: resolvedCliPath
				}
			}
		};
		else next = {
			...next,
			channels: {
				...next.channels,
				imessage: {
					...next.channels?.imessage,
					enabled: true,
					accounts: {
						...next.channels?.imessage?.accounts,
						[imessageAccountId]: {
							...next.channels?.imessage?.accounts?.[imessageAccountId],
							enabled: next.channels?.imessage?.accounts?.[imessageAccountId]?.enabled ?? true,
							cliPath: resolvedCliPath
						}
					}
				}
			}
		};
		await prompter.note([
			"This is still a work in progress.",
			"Ensure OpenClaw has Full Disk Access to Messages DB.",
			"Grant Automation permission for Messages when prompted.",
			"List chats with: imsg chats --limit 20",
			`Docs: ${formatDocsLink("/imessage", "imessage")}`
		].join("\n"), "iMessage next steps");
		return {
			cfg: next,
			accountId: imessageAccountId
		};
	},
	dmPolicy: dmPolicy$3,
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			imessage: {
				...cfg.channels?.imessage,
				enabled: false
			}
		}
	})
};

//#endregion
//#region src/channels/plugins/normalize/imessage.ts
const SERVICE_PREFIXES = [
	"imessage:",
	"sms:",
	"auto:"
];
const CHAT_TARGET_PREFIX_RE = /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;
function normalizeIMessageMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const lower = trimmed.toLowerCase();
	for (const prefix of SERVICE_PREFIXES) if (lower.startsWith(prefix)) {
		const normalizedHandle = normalizeIMessageHandle(trimmed.slice(prefix.length).trim());
		if (!normalizedHandle) return;
		if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) return normalizedHandle;
		return `${prefix}${normalizedHandle}`;
	}
	return normalizeIMessageHandle(trimmed) || void 0;
}
function looksLikeIMessageTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(imessage:|sms:|auto:)/i.test(trimmed)) return true;
	if (CHAT_TARGET_PREFIX_RE.test(trimmed)) return true;
	if (trimmed.includes("@")) return true;
	return /^\+?\d{3,}$/.test(trimmed);
}

//#endregion
//#region src/channels/plugins/onboarding/slack.ts
const channel$3 = "slack";
function setSlackDmPolicy(cfg, dmPolicy) {
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.slack?.dm?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				dm: {
					...cfg.channels?.slack?.dm,
					enabled: cfg.channels?.slack?.dm?.enabled ?? true,
					policy: dmPolicy,
					...allowFrom ? { allowFrom } : {}
				}
			}
		}
	};
}
function buildSlackManifest(botName) {
	const safeName = botName.trim() || "OpenClaw";
	const manifest = {
		display_information: {
			name: safeName,
			description: `${safeName} connector for OpenClaw`
		},
		features: {
			bot_user: {
				display_name: safeName,
				always_online: false
			},
			app_home: {
				messages_tab_enabled: true,
				messages_tab_read_only_enabled: false
			},
			slash_commands: [{
				command: "/openclaw",
				description: "Send a message to OpenClaw",
				should_escape: false
			}]
		},
		oauth_config: { scopes: { bot: [
			"chat:write",
			"channels:history",
			"channels:read",
			"groups:history",
			"im:history",
			"mpim:history",
			"users:read",
			"app_mentions:read",
			"reactions:read",
			"reactions:write",
			"pins:read",
			"pins:write",
			"emoji:read",
			"commands",
			"files:read",
			"files:write"
		] } },
		settings: {
			socket_mode_enabled: true,
			event_subscriptions: { bot_events: [
				"app_mention",
				"message.channels",
				"message.groups",
				"message.im",
				"message.mpim",
				"reaction_added",
				"reaction_removed",
				"member_joined_channel",
				"member_left_channel",
				"channel_rename",
				"pin_added",
				"pin_removed"
			] }
		}
	};
	return JSON.stringify(manifest, null, 2);
}
async function noteSlackTokenHelp(prompter, botName) {
	const manifest = buildSlackManifest(botName);
	await prompter.note([
		"1) Slack API → Create App → From scratch",
		"2) Add Socket Mode + enable it to get the app-level token (xapp-...)",
		"3) OAuth & Permissions → install app to workspace (xoxb- bot token)",
		"4) Enable Event Subscriptions (socket) for message events",
		"5) App Home → enable the Messages tab for DMs",
		"Tip: set SLACK_BOT_TOKEN + SLACK_APP_TOKEN in your env.",
		`Docs: ${formatDocsLink("/slack", "slack")}`,
		"",
		"Manifest (JSON):",
		manifest
	].join("\n"), "Slack socket mode tokens");
}
function setSlackGroupPolicy(cfg, accountId, groupPolicy) {
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				enabled: true,
				groupPolicy
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				enabled: true,
				accounts: {
					...cfg.channels?.slack?.accounts,
					[accountId]: {
						...cfg.channels?.slack?.accounts?.[accountId],
						enabled: cfg.channels?.slack?.accounts?.[accountId]?.enabled ?? true,
						groupPolicy
					}
				}
			}
		}
	};
}
function setSlackChannelAllowlist(cfg, accountId, channelKeys) {
	const channels = Object.fromEntries(channelKeys.map((key) => [key, { allow: true }]));
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				enabled: true,
				channels
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				enabled: true,
				accounts: {
					...cfg.channels?.slack?.accounts,
					[accountId]: {
						...cfg.channels?.slack?.accounts?.[accountId],
						enabled: cfg.channels?.slack?.accounts?.[accountId]?.enabled ?? true,
						channels
					}
				}
			}
		}
	};
}
function setSlackAllowFrom(cfg, allowFrom) {
	return {
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				dm: {
					...cfg.channels?.slack?.dm,
					enabled: cfg.channels?.slack?.dm?.enabled ?? true,
					allowFrom
				}
			}
		}
	};
}
function parseSlackAllowFromInput(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
async function promptSlackAllowFrom(params) {
	const accountId = params.accountId && normalizeAccountId(params.accountId) ? normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultSlackAccountId(params.cfg);
	const resolved = resolveSlackAccount({
		cfg: params.cfg,
		accountId
	});
	const token = resolved.config.userToken ?? resolved.config.botToken ?? "";
	const existing = params.cfg.channels?.slack?.dm?.allowFrom ?? [];
	await params.prompter.note([
		"Allowlist Slack DMs by username (we resolve to user ids).",
		"Examples:",
		"- U12345678",
		"- @alice",
		"Multiple entries: comma-separated.",
		`Docs: ${formatDocsLink("/slack", "slack")}`
	].join("\n"), "Slack allowlist");
	const parseInputs = (value) => parseSlackAllowFromInput(value);
	const parseId = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return null;
		const mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
		if (mention) return mention[1]?.toUpperCase();
		const prefixed = trimmed.replace(/^(slack:|user:)/i, "");
		if (/^[A-Z][A-Z0-9]+$/i.test(prefixed)) return prefixed.toUpperCase();
		return null;
	};
	while (true) {
		const entry = await params.prompter.text({
			message: "Slack allowFrom (usernames or ids)",
			placeholder: "@alice, U12345678",
			initialValue: existing[0] ? String(existing[0]) : void 0,
			validate: (value) => String(value ?? "").trim() ? void 0 : "Required"
		});
		const parts = parseInputs(String(entry));
		if (!token) {
			const ids = parts.map(parseId).filter(Boolean);
			if (ids.length !== parts.length) {
				await params.prompter.note("Slack token missing; use user ids (or mention form) only.", "Slack allowlist");
				continue;
			}
			const unique = [...new Set([...existing.map((v) => String(v).trim()), ...ids])].filter(Boolean);
			return setSlackAllowFrom(params.cfg, unique);
		}
		const results = await resolveSlackUserAllowlist({
			token,
			entries: parts
		}).catch(() => null);
		if (!results) {
			await params.prompter.note("Failed to resolve usernames. Try again.", "Slack allowlist");
			continue;
		}
		const unresolved = results.filter((res) => !res.resolved || !res.id);
		if (unresolved.length > 0) {
			await params.prompter.note(`Could not resolve: ${unresolved.map((res) => res.input).join(", ")}`, "Slack allowlist");
			continue;
		}
		const ids = results.map((res) => res.id);
		const unique = [...new Set([...existing.map((v) => String(v).trim()).filter(Boolean), ...ids])];
		return setSlackAllowFrom(params.cfg, unique);
	}
}
const dmPolicy$2 = {
	label: "Slack",
	channel: channel$3,
	policyKey: "channels.slack.dm.policy",
	allowFromKey: "channels.slack.dm.allowFrom",
	getCurrent: (cfg) => cfg.channels?.slack?.dm?.policy ?? "pairing",
	setPolicy: (cfg, policy) => setSlackDmPolicy(cfg, policy),
	promptAllowFrom: promptSlackAllowFrom
};
const slackOnboardingAdapter = {
	channel: channel$3,
	getStatus: async ({ cfg }) => {
		const configured = listSlackAccountIds(cfg).some((accountId) => {
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			return Boolean(account.botToken && account.appToken);
		});
		return {
			channel: channel$3,
			configured,
			statusLines: [`Slack: ${configured ? "configured" : "needs tokens"}`],
			selectionHint: configured ? "configured" : "needs tokens",
			quickstartScore: configured ? 2 : 1
		};
	},
	configure: async ({ cfg, prompter, accountOverrides, shouldPromptAccountIds }) => {
		const slackOverride = accountOverrides.slack?.trim();
		const defaultSlackAccountId = resolveDefaultSlackAccountId(cfg);
		let slackAccountId = slackOverride ? normalizeAccountId(slackOverride) : defaultSlackAccountId;
		if (shouldPromptAccountIds && !slackOverride) slackAccountId = await promptAccountId({
			cfg,
			prompter,
			label: "Slack",
			currentId: slackAccountId,
			listAccountIds: listSlackAccountIds,
			defaultAccountId: defaultSlackAccountId
		});
		let next = cfg;
		const resolvedAccount = resolveSlackAccount({
			cfg: next,
			accountId: slackAccountId
		});
		const accountConfigured = Boolean(resolvedAccount.botToken && resolvedAccount.appToken);
		const canUseEnv = slackAccountId === DEFAULT_ACCOUNT_ID && Boolean(process.env.SLACK_BOT_TOKEN?.trim()) && Boolean(process.env.SLACK_APP_TOKEN?.trim());
		const hasConfigTokens = Boolean(resolvedAccount.config.botToken && resolvedAccount.config.appToken);
		let botToken = null;
		let appToken = null;
		const slackBotName = String(await prompter.text({
			message: "Slack bot display name (used for manifest)",
			initialValue: "OpenClaw"
		})).trim();
		if (!accountConfigured) await noteSlackTokenHelp(prompter, slackBotName);
		if (canUseEnv && (!resolvedAccount.config.botToken || !resolvedAccount.config.appToken)) if (await prompter.confirm({
			message: "SLACK_BOT_TOKEN + SLACK_APP_TOKEN detected. Use env vars?",
			initialValue: true
		})) next = {
			...next,
			channels: {
				...next.channels,
				slack: {
					...next.channels?.slack,
					enabled: true
				}
			}
		};
		else {
			botToken = String(await prompter.text({
				message: "Enter Slack bot token (xoxb-...)",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
			appToken = String(await prompter.text({
				message: "Enter Slack app token (xapp-...)",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
		}
		else if (hasConfigTokens) {
			if (!await prompter.confirm({
				message: "Slack tokens already configured. Keep them?",
				initialValue: true
			})) {
				botToken = String(await prompter.text({
					message: "Enter Slack bot token (xoxb-...)",
					validate: (value) => value?.trim() ? void 0 : "Required"
				})).trim();
				appToken = String(await prompter.text({
					message: "Enter Slack app token (xapp-...)",
					validate: (value) => value?.trim() ? void 0 : "Required"
				})).trim();
			}
		} else {
			botToken = String(await prompter.text({
				message: "Enter Slack bot token (xoxb-...)",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
			appToken = String(await prompter.text({
				message: "Enter Slack app token (xapp-...)",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
		}
		if (botToken && appToken) if (slackAccountId === DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				slack: {
					...next.channels?.slack,
					enabled: true,
					botToken,
					appToken
				}
			}
		};
		else next = {
			...next,
			channels: {
				...next.channels,
				slack: {
					...next.channels?.slack,
					enabled: true,
					accounts: {
						...next.channels?.slack?.accounts,
						[slackAccountId]: {
							...next.channels?.slack?.accounts?.[slackAccountId],
							enabled: next.channels?.slack?.accounts?.[slackAccountId]?.enabled ?? true,
							botToken,
							appToken
						}
					}
				}
			}
		};
		const accessConfig = await promptChannelAccessConfig({
			prompter,
			label: "Slack channels",
			currentPolicy: resolvedAccount.config.groupPolicy ?? "allowlist",
			currentEntries: Object.entries(resolvedAccount.config.channels ?? {}).filter(([, value]) => value?.allow !== false && value?.enabled !== false).map(([key]) => key),
			placeholder: "#general, #private, C123",
			updatePrompt: Boolean(resolvedAccount.config.channels)
		});
		if (accessConfig) if (accessConfig.policy !== "allowlist") next = setSlackGroupPolicy(next, slackAccountId, accessConfig.policy);
		else {
			let keys = accessConfig.entries;
			const accountWithTokens = resolveSlackAccount({
				cfg: next,
				accountId: slackAccountId
			});
			if (accountWithTokens.botToken && accessConfig.entries.length > 0) try {
				const resolved = await resolveSlackChannelAllowlist({
					token: accountWithTokens.botToken,
					entries: accessConfig.entries
				});
				const resolvedKeys = resolved.filter((entry) => entry.resolved && entry.id).map((entry) => entry.id);
				const unresolved = resolved.filter((entry) => !entry.resolved).map((entry) => entry.input);
				keys = [...resolvedKeys, ...unresolved.map((entry) => entry.trim()).filter(Boolean)];
				if (resolvedKeys.length > 0 || unresolved.length > 0) await prompter.note([resolvedKeys.length > 0 ? `Resolved: ${resolvedKeys.join(", ")}` : void 0, unresolved.length > 0 ? `Unresolved (kept as typed): ${unresolved.join(", ")}` : void 0].filter(Boolean).join("\n"), "Slack channels");
			} catch (err) {
				await prompter.note(`Channel lookup failed; keeping entries as typed. ${String(err)}`, "Slack channels");
			}
			next = setSlackGroupPolicy(next, slackAccountId, "allowlist");
			next = setSlackChannelAllowlist(next, slackAccountId, keys);
		}
		return {
			cfg: next,
			accountId: slackAccountId
		};
	},
	dmPolicy: dmPolicy$2,
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			slack: {
				...cfg.channels?.slack,
				enabled: false
			}
		}
	})
};

//#endregion
//#region src/channels/plugins/onboarding/telegram.ts
const channel$2 = "telegram";
function setTelegramDmPolicy(cfg, dmPolicy) {
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.telegram?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			telegram: {
				...cfg.channels?.telegram,
				dmPolicy,
				...allowFrom ? { allowFrom } : {}
			}
		}
	};
}
async function noteTelegramTokenHelp(prompter) {
	await prompter.note([
		"1) Open Telegram and chat with @BotFather",
		"2) Run /newbot (or /mybots)",
		"3) Copy the token (looks like 123456:ABC...)",
		"Tip: you can also set TELEGRAM_BOT_TOKEN in your env.",
		`Docs: ${formatDocsLink("/telegram")}`,
		"Website: https://openclaw.ai"
	].join("\n"), "Telegram bot token");
}
async function noteTelegramUserIdHelp(prompter) {
	await prompter.note([
		`1) DM your bot, then read from.id in \`${formatCliCommand("openclaw logs --follow")}\` (safest)`,
		"2) Or call https://api.telegram.org/bot<bot_token>/getUpdates and read message.from.id",
		"3) Third-party: DM @userinfobot or @getidsbot",
		`Docs: ${formatDocsLink("/telegram")}`,
		"Website: https://openclaw.ai"
	].join("\n"), "Telegram user id");
}
async function promptTelegramAllowFrom(params) {
	const { cfg, prompter, accountId } = params;
	const resolved = resolveTelegramAccount({
		cfg,
		accountId
	});
	const existingAllowFrom = resolved.config.allowFrom ?? [];
	await noteTelegramUserIdHelp(prompter);
	const token = resolved.token;
	if (!token) await prompter.note("Telegram token missing; username lookup is unavailable.", "Telegram");
	const resolveTelegramUserId = async (raw) => {
		const trimmed = raw.trim();
		if (!trimmed) return null;
		const stripped = trimmed.replace(/^(telegram|tg):/i, "").trim();
		if (/^\d+$/.test(stripped)) return stripped;
		if (!token) return null;
		const username = stripped.startsWith("@") ? stripped : `@${stripped}`;
		const url = `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(username)}`;
		try {
			const res = await fetch(url);
			if (!res.ok) return null;
			const data = await res.json().catch(() => null);
			const id = data?.ok ? data?.result?.id : void 0;
			if (typeof id === "number" || typeof id === "string") return String(id);
			return null;
		} catch {
			return null;
		}
	};
	const parseInput = (value) => value.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
	let resolvedIds = [];
	while (resolvedIds.length === 0) {
		const entry = await prompter.text({
			message: "Telegram allowFrom (username or user id)",
			placeholder: "@username",
			initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : void 0,
			validate: (value) => String(value ?? "").trim() ? void 0 : "Required"
		});
		const parts = parseInput(String(entry));
		const results = await Promise.all(parts.map((part) => resolveTelegramUserId(part)));
		const unresolved = parts.filter((_, idx) => !results[idx]);
		if (unresolved.length > 0) {
			await prompter.note(`Could not resolve: ${unresolved.join(", ")}. Use @username or numeric id.`, "Telegram allowlist");
			continue;
		}
		resolvedIds = results.filter(Boolean);
	}
	const merged = [...existingAllowFrom.map((item) => String(item).trim()).filter(Boolean), ...resolvedIds];
	const unique = [...new Set(merged)];
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			telegram: {
				...cfg.channels?.telegram,
				enabled: true,
				dmPolicy: "allowlist",
				allowFrom: unique
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			telegram: {
				...cfg.channels?.telegram,
				enabled: true,
				accounts: {
					...cfg.channels?.telegram?.accounts,
					[accountId]: {
						...cfg.channels?.telegram?.accounts?.[accountId],
						enabled: cfg.channels?.telegram?.accounts?.[accountId]?.enabled ?? true,
						dmPolicy: "allowlist",
						allowFrom: unique
					}
				}
			}
		}
	};
}
async function promptTelegramAllowFromForAccount(params) {
	const accountId = params.accountId && normalizeAccountId(params.accountId) ? normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultTelegramAccountId(params.cfg);
	return promptTelegramAllowFrom({
		cfg: params.cfg,
		prompter: params.prompter,
		accountId
	});
}
const dmPolicy$1 = {
	label: "Telegram",
	channel: channel$2,
	policyKey: "channels.telegram.dmPolicy",
	allowFromKey: "channels.telegram.allowFrom",
	getCurrent: (cfg) => cfg.channels?.telegram?.dmPolicy ?? "pairing",
	setPolicy: (cfg, policy) => setTelegramDmPolicy(cfg, policy),
	promptAllowFrom: promptTelegramAllowFromForAccount
};
const telegramOnboardingAdapter = {
	channel: channel$2,
	getStatus: async ({ cfg }) => {
		const configured = listTelegramAccountIds(cfg).some((accountId) => Boolean(resolveTelegramAccount({
			cfg,
			accountId
		}).token));
		return {
			channel: channel$2,
			configured,
			statusLines: [`Telegram: ${configured ? "configured" : "needs token"}`],
			selectionHint: configured ? "recommended · configured" : "recommended · newcomer-friendly",
			quickstartScore: configured ? 1 : 10
		};
	},
	configure: async ({ cfg, prompter, accountOverrides, shouldPromptAccountIds, forceAllowFrom }) => {
		const telegramOverride = accountOverrides.telegram?.trim();
		const defaultTelegramAccountId = resolveDefaultTelegramAccountId(cfg);
		let telegramAccountId = telegramOverride ? normalizeAccountId(telegramOverride) : defaultTelegramAccountId;
		if (shouldPromptAccountIds && !telegramOverride) telegramAccountId = await promptAccountId({
			cfg,
			prompter,
			label: "Telegram",
			currentId: telegramAccountId,
			listAccountIds: listTelegramAccountIds,
			defaultAccountId: defaultTelegramAccountId
		});
		let next = cfg;
		const resolvedAccount = resolveTelegramAccount({
			cfg: next,
			accountId: telegramAccountId
		});
		const accountConfigured = Boolean(resolvedAccount.token);
		const canUseEnv = telegramAccountId === DEFAULT_ACCOUNT_ID && Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
		const hasConfigToken = Boolean(resolvedAccount.config.botToken || resolvedAccount.config.tokenFile);
		let token = null;
		if (!accountConfigured) await noteTelegramTokenHelp(prompter);
		if (canUseEnv && !resolvedAccount.config.botToken) if (await prompter.confirm({
			message: "TELEGRAM_BOT_TOKEN detected. Use env var?",
			initialValue: true
		})) next = {
			...next,
			channels: {
				...next.channels,
				telegram: {
					...next.channels?.telegram,
					enabled: true
				}
			}
		};
		else token = String(await prompter.text({
			message: "Enter Telegram bot token",
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		else if (hasConfigToken) {
			if (!await prompter.confirm({
				message: "Telegram token already configured. Keep it?",
				initialValue: true
			})) token = String(await prompter.text({
				message: "Enter Telegram bot token",
				validate: (value) => value?.trim() ? void 0 : "Required"
			})).trim();
		} else token = String(await prompter.text({
			message: "Enter Telegram bot token",
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		if (token) if (telegramAccountId === DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				telegram: {
					...next.channels?.telegram,
					enabled: true,
					botToken: token
				}
			}
		};
		else next = {
			...next,
			channels: {
				...next.channels,
				telegram: {
					...next.channels?.telegram,
					enabled: true,
					accounts: {
						...next.channels?.telegram?.accounts,
						[telegramAccountId]: {
							...next.channels?.telegram?.accounts?.[telegramAccountId],
							enabled: next.channels?.telegram?.accounts?.[telegramAccountId]?.enabled ?? true,
							botToken: token
						}
					}
				}
			}
		};
		if (forceAllowFrom) next = await promptTelegramAllowFrom({
			cfg: next,
			prompter,
			accountId: telegramAccountId
		});
		return {
			cfg: next,
			accountId: telegramAccountId
		};
	},
	dmPolicy: dmPolicy$1,
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			telegram: {
				...cfg.channels?.telegram,
				enabled: false
			}
		}
	})
};

//#endregion
//#region src/channels/plugins/normalize/telegram.ts
function normalizeTelegramMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	let normalized = trimmed;
	if (normalized.startsWith("telegram:")) normalized = normalized.slice(9).trim();
	else if (normalized.startsWith("tg:")) normalized = normalized.slice(3).trim();
	if (!normalized) return;
	const tmeMatch = /^https?:\/\/t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized) ?? /^t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized);
	if (tmeMatch?.[1]) normalized = `@${tmeMatch[1]}`;
	if (!normalized) return;
	return `telegram:${normalized}`.toLowerCase();
}
function looksLikeTelegramTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(telegram|tg):/i.test(trimmed)) return true;
	if (trimmed.startsWith("@")) return true;
	return /^-?\d{6,}$/.test(trimmed);
}

//#endregion
//#region src/channels/plugins/status-issues/telegram.ts
function readTelegramAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		configured: value.configured,
		allowUnmentionedGroups: value.allowUnmentionedGroups,
		audit: value.audit
	};
}
function readTelegramGroupMembershipAuditSummary(value) {
	if (!isRecord(value)) return {};
	const unresolvedGroups = typeof value.unresolvedGroups === "number" && Number.isFinite(value.unresolvedGroups) ? value.unresolvedGroups : void 0;
	const hasWildcardUnmentionedGroups = typeof value.hasWildcardUnmentionedGroups === "boolean" ? value.hasWildcardUnmentionedGroups : void 0;
	const groupsRaw = value.groups;
	return {
		unresolvedGroups,
		hasWildcardUnmentionedGroups,
		groups: Array.isArray(groupsRaw) ? groupsRaw.map((entry) => {
			if (!isRecord(entry)) return null;
			const chatId = asString(entry.chatId);
			if (!chatId) return null;
			return {
				chatId,
				ok: typeof entry.ok === "boolean" ? entry.ok : void 0,
				status: asString(entry.status) ?? null,
				error: asString(entry.error) ?? null,
				matchKey: asString(entry.matchKey) ?? void 0,
				matchSource: asString(entry.matchSource) ?? void 0
			};
		}).filter(Boolean) : void 0
	};
}
function collectTelegramStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readTelegramAccountStatus(entry);
		if (!account) continue;
		const accountId = asString(account.accountId) ?? "default";
		const enabled = account.enabled !== false;
		const configured = account.configured === true;
		if (!enabled || !configured) continue;
		if (account.allowUnmentionedGroups === true) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: "Config allows unmentioned group messages (requireMention=false). Telegram Bot API privacy mode will block most group messages unless disabled.",
			fix: "In BotFather run /setprivacy → Disable for this bot (then restart the gateway)."
		});
		const audit = readTelegramGroupMembershipAuditSummary(account.audit);
		if (audit.hasWildcardUnmentionedGroups === true) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: "Telegram groups config uses \"*\" with requireMention=false; membership probing is not possible without explicit group IDs.",
			fix: "Add explicit numeric group ids under channels.telegram.groups (or per-account groups) to enable probing."
		});
		if (audit.unresolvedGroups && audit.unresolvedGroups > 0) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: `Some configured Telegram groups are not numeric IDs (unresolvedGroups=${audit.unresolvedGroups}). Membership probe can only check numeric group IDs.`,
			fix: "Use numeric chat IDs (e.g. -100...) as keys in channels.telegram.groups for requireMention=false groups."
		});
		for (const group of audit.groups ?? []) {
			if (group.ok === true) continue;
			const status = group.status ? ` status=${group.status}` : "";
			const err = group.error ? `: ${group.error}` : "";
			const baseMessage = `Group ${group.chatId} not reachable by bot.${status}${err}`;
			issues.push({
				channel: "telegram",
				accountId,
				kind: "runtime",
				message: appendMatchMetadata(baseMessage, {
					matchKey: group.matchKey,
					matchSource: group.matchSource
				}),
				fix: "Invite the bot to the group, then DM the bot once (/start) and restart the gateway."
			});
		}
	}
	return issues;
}

//#endregion
//#region src/commands/signal-install.ts
function looksLikeArchive(name) {
	return name.endsWith(".tar.gz") || name.endsWith(".tgz") || name.endsWith(".zip");
}
function pickAsset(assets, platform) {
	const withName = assets.filter((asset) => Boolean(asset.name && asset.browser_download_url));
	const byName = (pattern) => withName.find((asset) => pattern.test(asset.name.toLowerCase()));
	if (platform === "linux") return byName(/linux-native/) || byName(/linux/) || withName.find((asset) => looksLikeArchive(asset.name.toLowerCase()));
	if (platform === "darwin") return byName(/macos|osx|darwin/) || withName.find((asset) => looksLikeArchive(asset.name.toLowerCase()));
	if (platform === "win32") return byName(/windows|win/) || withName.find((asset) => looksLikeArchive(asset.name.toLowerCase()));
	return withName.find((asset) => looksLikeArchive(asset.name.toLowerCase()));
}
async function downloadToFile(url, dest, maxRedirects = 5) {
	await new Promise((resolve, reject) => {
		const req = request(url, (res) => {
			if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
				const location = res.headers.location;
				if (!location || maxRedirects <= 0) {
					reject(/* @__PURE__ */ new Error("Redirect loop or missing Location header"));
					return;
				}
				const redirectUrl = new URL(location, url).href;
				resolve(downloadToFile(redirectUrl, dest, maxRedirects - 1));
				return;
			}
			if (!res.statusCode || res.statusCode >= 400) {
				reject(/* @__PURE__ */ new Error(`HTTP ${res.statusCode ?? "?"} downloading file`));
				return;
			}
			pipeline(res, createWriteStream(dest)).then(resolve).catch(reject);
		});
		req.on("error", reject);
		req.end();
	});
}
async function findSignalCliBinary(root) {
	const candidates = [];
	const enqueue = async (dir, depth) => {
		if (depth > 3) return;
		const entries = await fsPromises.readdir(dir, { withFileTypes: true }).catch(() => []);
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) await enqueue(full, depth + 1);
			else if (entry.isFile() && entry.name === "signal-cli") candidates.push(full);
		}
	};
	await enqueue(root, 0);
	return candidates[0] ?? null;
}
async function installSignalCli(runtime) {
	if (process.platform === "win32") return {
		ok: false,
		error: "Signal CLI auto-install is not supported on Windows yet."
	};
	const response = await fetch("https://api.github.com/repos/AsamK/signal-cli/releases/latest", { headers: {
		"User-Agent": "openclaw",
		Accept: "application/vnd.github+json"
	} });
	if (!response.ok) return {
		ok: false,
		error: `Failed to fetch release info (${response.status})`
	};
	const payload = await response.json();
	const version = payload.tag_name?.replace(/^v/, "") ?? "unknown";
	const asset = pickAsset(payload.assets ?? [], process.platform);
	const assetName = asset?.name ?? "";
	const assetUrl = asset?.browser_download_url ?? "";
	if (!assetName || !assetUrl) return {
		ok: false,
		error: "No compatible release asset found for this platform."
	};
	const tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "openclaw-signal-"));
	const archivePath = path.join(tmpDir, assetName);
	runtime.log(`Downloading signal-cli ${version} (${assetName})…`);
	await downloadToFile(assetUrl, archivePath);
	const installRoot = path.join(CONFIG_DIR, "tools", "signal-cli", version);
	await fsPromises.mkdir(installRoot, { recursive: true });
	if (assetName.endsWith(".zip")) await runCommandWithTimeout([
		"unzip",
		"-q",
		archivePath,
		"-d",
		installRoot
	], { timeoutMs: 6e4 });
	else if (assetName.endsWith(".tar.gz") || assetName.endsWith(".tgz")) await runCommandWithTimeout([
		"tar",
		"-xzf",
		archivePath,
		"-C",
		installRoot
	], { timeoutMs: 6e4 });
	else return {
		ok: false,
		error: `Unsupported archive type: ${assetName}`
	};
	const cliPath = await findSignalCliBinary(installRoot);
	if (!cliPath) return {
		ok: false,
		error: `signal-cli binary not found after extracting ${assetName}`
	};
	await fsPromises.chmod(cliPath, 493).catch(() => {});
	return {
		ok: true,
		cliPath,
		version
	};
}

//#endregion
//#region src/channels/plugins/onboarding/signal.ts
const channel$1 = "signal";
function setSignalDmPolicy(cfg, dmPolicy) {
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.signal?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			signal: {
				...cfg.channels?.signal,
				dmPolicy,
				...allowFrom ? { allowFrom } : {}
			}
		}
	};
}
function setSignalAllowFrom(cfg, accountId, allowFrom) {
	if (accountId === DEFAULT_ACCOUNT_ID) return {
		...cfg,
		channels: {
			...cfg.channels,
			signal: {
				...cfg.channels?.signal,
				allowFrom
			}
		}
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			signal: {
				...cfg.channels?.signal,
				accounts: {
					...cfg.channels?.signal?.accounts,
					[accountId]: {
						...cfg.channels?.signal?.accounts?.[accountId],
						allowFrom
					}
				}
			}
		}
	};
}
function parseSignalAllowFromInput(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
function isUuidLike(value) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
async function promptSignalAllowFrom(params) {
	const accountId = params.accountId && normalizeAccountId(params.accountId) ? normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultSignalAccountId(params.cfg);
	const existing = resolveSignalAccount({
		cfg: params.cfg,
		accountId
	}).config.allowFrom ?? [];
	await params.prompter.note([
		"Allowlist Signal DMs by sender id.",
		"Examples:",
		"- +15555550123",
		"- uuid:123e4567-e89b-12d3-a456-426614174000",
		"Multiple entries: comma-separated.",
		`Docs: ${formatDocsLink("/signal", "signal")}`
	].join("\n"), "Signal allowlist");
	const entry = await params.prompter.text({
		message: "Signal allowFrom (E.164 or uuid)",
		placeholder: "+15555550123, uuid:123e4567-e89b-12d3-a456-426614174000",
		initialValue: existing[0] ? String(existing[0]) : void 0,
		validate: (value) => {
			const raw = String(value ?? "").trim();
			if (!raw) return "Required";
			const parts = parseSignalAllowFromInput(raw);
			for (const part of parts) {
				if (part === "*") continue;
				if (part.toLowerCase().startsWith("uuid:")) {
					if (!part.slice(5).trim()) return "Invalid uuid entry";
					continue;
				}
				if (isUuidLike(part)) continue;
				if (!normalizeE164(part)) return `Invalid entry: ${part}`;
			}
		}
	});
	const normalized = parseSignalAllowFromInput(String(entry)).map((part) => {
		if (part === "*") return "*";
		if (part.toLowerCase().startsWith("uuid:")) return `uuid:${part.slice(5).trim()}`;
		if (isUuidLike(part)) return `uuid:${part}`;
		return normalizeE164(part);
	}).filter(Boolean);
	const unique = [...new Set(normalized)];
	return setSignalAllowFrom(params.cfg, accountId, unique);
}
const dmPolicy = {
	label: "Signal",
	channel: channel$1,
	policyKey: "channels.signal.dmPolicy",
	allowFromKey: "channels.signal.allowFrom",
	getCurrent: (cfg) => cfg.channels?.signal?.dmPolicy ?? "pairing",
	setPolicy: (cfg, policy) => setSignalDmPolicy(cfg, policy),
	promptAllowFrom: promptSignalAllowFrom
};
const signalOnboardingAdapter = {
	channel: channel$1,
	getStatus: async ({ cfg }) => {
		const configured = listSignalAccountIds(cfg).some((accountId) => resolveSignalAccount({
			cfg,
			accountId
		}).configured);
		const signalCliPath = cfg.channels?.signal?.cliPath ?? "signal-cli";
		const signalCliDetected = await detectBinary(signalCliPath);
		return {
			channel: channel$1,
			configured,
			statusLines: [`Signal: ${configured ? "configured" : "needs setup"}`, `signal-cli: ${signalCliDetected ? "found" : "missing"} (${signalCliPath})`],
			selectionHint: signalCliDetected ? "signal-cli found" : "signal-cli missing",
			quickstartScore: signalCliDetected ? 1 : 0
		};
	},
	configure: async ({ cfg, runtime, prompter, accountOverrides, shouldPromptAccountIds, options }) => {
		const signalOverride = accountOverrides.signal?.trim();
		const defaultSignalAccountId = resolveDefaultSignalAccountId(cfg);
		let signalAccountId = signalOverride ? normalizeAccountId(signalOverride) : defaultSignalAccountId;
		if (shouldPromptAccountIds && !signalOverride) signalAccountId = await promptAccountId({
			cfg,
			prompter,
			label: "Signal",
			currentId: signalAccountId,
			listAccountIds: listSignalAccountIds,
			defaultAccountId: defaultSignalAccountId
		});
		let next = cfg;
		const accountConfig = resolveSignalAccount({
			cfg: next,
			accountId: signalAccountId
		}).config;
		let resolvedCliPath = accountConfig.cliPath ?? "signal-cli";
		let cliDetected = await detectBinary(resolvedCliPath);
		if (options?.allowSignalInstall) {
			if (await prompter.confirm({
				message: cliDetected ? "signal-cli detected. Reinstall/update now?" : "signal-cli not found. Install now?",
				initialValue: !cliDetected
			})) try {
				const result = await installSignalCli(runtime);
				if (result.ok && result.cliPath) {
					cliDetected = true;
					resolvedCliPath = result.cliPath;
					await prompter.note(`Installed signal-cli at ${result.cliPath}`, "Signal");
				} else if (!result.ok) await prompter.note(result.error ?? "signal-cli install failed.", "Signal");
			} catch (err) {
				await prompter.note(`signal-cli install failed: ${String(err)}`, "Signal");
			}
		}
		if (!cliDetected) await prompter.note("signal-cli not found. Install it, then rerun this step or set channels.signal.cliPath.", "Signal");
		let account = accountConfig.account ?? "";
		if (account) {
			if (!await prompter.confirm({
				message: `Signal account set (${account}). Keep it?`,
				initialValue: true
			})) account = "";
		}
		if (!account) account = String(await prompter.text({
			message: "Signal bot number (E.164)",
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		if (account) if (signalAccountId === DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				signal: {
					...next.channels?.signal,
					enabled: true,
					account,
					cliPath: resolvedCliPath ?? "signal-cli"
				}
			}
		};
		else next = {
			...next,
			channels: {
				...next.channels,
				signal: {
					...next.channels?.signal,
					enabled: true,
					accounts: {
						...next.channels?.signal?.accounts,
						[signalAccountId]: {
							...next.channels?.signal?.accounts?.[signalAccountId],
							enabled: next.channels?.signal?.accounts?.[signalAccountId]?.enabled ?? true,
							account,
							cliPath: resolvedCliPath ?? "signal-cli"
						}
					}
				}
			}
		};
		await prompter.note([
			"Link device with: signal-cli link -n \"OpenClaw\"",
			"Scan QR in Signal → Linked Devices",
			`Then run: ${formatCliCommand("openclaw gateway call channels.status --params '{\"probe\":true}'")}`,
			`Docs: ${formatDocsLink("/signal", "signal")}`
		].join("\n"), "Signal next steps");
		return {
			cfg: next,
			accountId: signalAccountId
		};
	},
	dmPolicy,
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			signal: {
				...cfg.channels?.signal,
				enabled: false
			}
		}
	})
};

//#endregion
//#region src/channels/plugins/normalize/signal.ts
function normalizeSignalMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	let normalized = trimmed;
	if (normalized.toLowerCase().startsWith("signal:")) normalized = normalized.slice(7).trim();
	if (!normalized) return;
	const lower = normalized.toLowerCase();
	if (lower.startsWith("group:")) {
		const id = normalized.slice(6).trim();
		return id ? `group:${id}`.toLowerCase() : void 0;
	}
	if (lower.startsWith("username:")) {
		const id = normalized.slice(9).trim();
		return id ? `username:${id}`.toLowerCase() : void 0;
	}
	if (lower.startsWith("u:")) {
		const id = normalized.slice(2).trim();
		return id ? `username:${id}`.toLowerCase() : void 0;
	}
	if (lower.startsWith("uuid:")) {
		const id = normalized.slice(5).trim();
		return id ? id.toLowerCase() : void 0;
	}
	return normalized.toLowerCase();
}
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_COMPACT_PATTERN = /^[0-9a-f]{32}$/i;
function looksLikeSignalTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(signal:)?(group:|username:|u:)/i.test(trimmed)) return true;
	if (/^(signal:)?uuid:/i.test(trimmed)) {
		const stripped = trimmed.replace(/^signal:/i, "").replace(/^uuid:/i, "").trim();
		if (!stripped) return false;
		return UUID_PATTERN.test(stripped) || UUID_COMPACT_PATTERN.test(stripped);
	}
	if (UUID_PATTERN.test(trimmed) || UUID_COMPACT_PATTERN.test(trimmed)) return true;
	return /^\+?\d{3,}$/.test(trimmed);
}

//#endregion
//#region src/config/merge-config.ts
function mergeConfigSection(base, patch, options = {}) {
	const next = { ...base ?? void 0 };
	for (const [key, value] of Object.entries(patch)) {
		if (value === void 0) {
			if (options.unsetOnUndefined?.includes(key)) delete next[key];
			continue;
		}
		next[key] = value;
	}
	return next;
}
function mergeWhatsAppConfig(cfg, patch, options) {
	return {
		...cfg,
		channels: {
			...cfg.channels,
			whatsapp: mergeConfigSection(cfg.channels?.whatsapp, patch, options)
		}
	};
}

//#endregion
//#region src/channels/plugins/onboarding/whatsapp.ts
const channel = "whatsapp";
function setWhatsAppDmPolicy(cfg, dmPolicy) {
	return mergeWhatsAppConfig(cfg, { dmPolicy });
}
function setWhatsAppAllowFrom(cfg, allowFrom) {
	return mergeWhatsAppConfig(cfg, { allowFrom }, { unsetOnUndefined: ["allowFrom"] });
}
function setWhatsAppSelfChatMode(cfg, selfChatMode) {
	return mergeWhatsAppConfig(cfg, { selfChatMode });
}
async function pathExists(filePath) {
	try {
		await fsPromises.access(filePath);
		return true;
	} catch {
		return false;
	}
}
async function detectWhatsAppLinked(cfg, accountId) {
	const { authDir } = resolveWhatsAppAuthDir({
		cfg,
		accountId
	});
	return await pathExists(path.join(authDir, "creds.json"));
}
async function promptWhatsAppAllowFrom(cfg, _runtime, prompter, options) {
	const existingPolicy = cfg.channels?.whatsapp?.dmPolicy ?? "pairing";
	const existingAllowFrom = cfg.channels?.whatsapp?.allowFrom ?? [];
	const existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
	if (options?.forceAllowlist) {
		await prompter.note("We need the sender/owner number so OpenClaw can allowlist you.", "WhatsApp number");
		const entry = await prompter.text({
			message: "Your personal WhatsApp number (the phone you will message from)",
			placeholder: "+15555550123",
			initialValue: existingAllowFrom[0],
			validate: (value) => {
				const raw = String(value ?? "").trim();
				if (!raw) return "Required";
				if (!normalizeE164(raw)) return `Invalid number: ${raw}`;
			}
		});
		const normalized = normalizeE164(String(entry).trim());
		const merged = [...existingAllowFrom.filter((item) => item !== "*").map((item) => normalizeE164(item)).filter(Boolean), normalized];
		const unique = [...new Set(merged.filter(Boolean))];
		let next = setWhatsAppSelfChatMode(cfg, true);
		next = setWhatsAppDmPolicy(next, "allowlist");
		next = setWhatsAppAllowFrom(next, unique);
		await prompter.note(["Allowlist mode enabled.", `- allowFrom includes ${normalized}`].join("\n"), "WhatsApp allowlist");
		return next;
	}
	await prompter.note([
		"WhatsApp direct chats are gated by `channels.whatsapp.dmPolicy` + `channels.whatsapp.allowFrom`.",
		"- pairing (default): unknown senders get a pairing code; owner approves",
		"- allowlist: unknown senders are blocked",
		"- open: public inbound DMs (requires allowFrom to include \"*\")",
		"- disabled: ignore WhatsApp DMs",
		"",
		`Current: dmPolicy=${existingPolicy}, allowFrom=${existingLabel}`,
		`Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`
	].join("\n"), "WhatsApp DM access");
	if (await prompter.select({
		message: "WhatsApp phone setup",
		options: [{
			value: "personal",
			label: "This is my personal phone number"
		}, {
			value: "separate",
			label: "Separate phone just for OpenClaw"
		}]
	}) === "personal") {
		await prompter.note("We need the sender/owner number so OpenClaw can allowlist you.", "WhatsApp number");
		const entry = await prompter.text({
			message: "Your personal WhatsApp number (the phone you will message from)",
			placeholder: "+15555550123",
			initialValue: existingAllowFrom[0],
			validate: (value) => {
				const raw = String(value ?? "").trim();
				if (!raw) return "Required";
				if (!normalizeE164(raw)) return `Invalid number: ${raw}`;
			}
		});
		const normalized = normalizeE164(String(entry).trim());
		const merged = [...existingAllowFrom.filter((item) => item !== "*").map((item) => normalizeE164(item)).filter(Boolean), normalized];
		const unique = [...new Set(merged.filter(Boolean))];
		let next = setWhatsAppSelfChatMode(cfg, true);
		next = setWhatsAppDmPolicy(next, "allowlist");
		next = setWhatsAppAllowFrom(next, unique);
		await prompter.note([
			"Personal phone mode enabled.",
			"- dmPolicy set to allowlist (pairing skipped)",
			`- allowFrom includes ${normalized}`
		].join("\n"), "WhatsApp personal phone");
		return next;
	}
	const policy = await prompter.select({
		message: "WhatsApp DM policy",
		options: [
			{
				value: "pairing",
				label: "Pairing (recommended)"
			},
			{
				value: "allowlist",
				label: "Allowlist only (block unknown senders)"
			},
			{
				value: "open",
				label: "Open (public inbound DMs)"
			},
			{
				value: "disabled",
				label: "Disabled (ignore WhatsApp DMs)"
			}
		]
	});
	let next = setWhatsAppSelfChatMode(cfg, false);
	next = setWhatsAppDmPolicy(next, policy);
	if (policy === "open") next = setWhatsAppAllowFrom(next, ["*"]);
	if (policy === "disabled") return next;
	const allowOptions = existingAllowFrom.length > 0 ? [
		{
			value: "keep",
			label: "Keep current allowFrom"
		},
		{
			value: "unset",
			label: "Unset allowFrom (use pairing approvals only)"
		},
		{
			value: "list",
			label: "Set allowFrom to specific numbers"
		}
	] : [{
		value: "unset",
		label: "Unset allowFrom (default)"
	}, {
		value: "list",
		label: "Set allowFrom to specific numbers"
	}];
	const mode = await prompter.select({
		message: "WhatsApp allowFrom (optional pre-allowlist)",
		options: allowOptions.map((opt) => ({
			value: opt.value,
			label: opt.label
		}))
	});
	if (mode === "keep") {} else if (mode === "unset") next = setWhatsAppAllowFrom(next, void 0);
	else {
		const allowRaw = await prompter.text({
			message: "Allowed sender numbers (comma-separated, E.164)",
			placeholder: "+15555550123, +447700900123",
			validate: (value) => {
				const raw = String(value ?? "").trim();
				if (!raw) return "Required";
				const parts = raw.split(/[\n,;]+/g).map((p) => p.trim()).filter(Boolean);
				if (parts.length === 0) return "Required";
				for (const part of parts) {
					if (part === "*") continue;
					if (!normalizeE164(part)) return `Invalid number: ${part}`;
				}
			}
		});
		const normalized = String(allowRaw).split(/[\n,;]+/g).map((p) => p.trim()).filter(Boolean).map((part) => part === "*" ? "*" : normalizeE164(part));
		const unique = [...new Set(normalized.filter(Boolean))];
		next = setWhatsAppAllowFrom(next, unique);
	}
	return next;
}
const whatsappOnboardingAdapter = {
	channel,
	getStatus: async ({ cfg, accountOverrides }) => {
		const overrideId = accountOverrides.whatsapp?.trim();
		const defaultAccountId = resolveDefaultWhatsAppAccountId(cfg);
		const accountId = overrideId ? normalizeAccountId(overrideId) : defaultAccountId;
		const linked = await detectWhatsAppLinked(cfg, accountId);
		return {
			channel,
			configured: linked,
			statusLines: [`WhatsApp (${accountId === DEFAULT_ACCOUNT_ID ? "default" : accountId}): ${linked ? "linked" : "not linked"}`],
			selectionHint: linked ? "linked" : "not linked",
			quickstartScore: linked ? 5 : 4
		};
	},
	configure: async ({ cfg, runtime, prompter, options, accountOverrides, shouldPromptAccountIds, forceAllowFrom }) => {
		const overrideId = accountOverrides.whatsapp?.trim();
		let accountId = overrideId ? normalizeAccountId(overrideId) : resolveDefaultWhatsAppAccountId(cfg);
		if (shouldPromptAccountIds || options?.promptWhatsAppAccountId) {
			if (!overrideId) accountId = await promptAccountId({
				cfg,
				prompter,
				label: "WhatsApp",
				currentId: accountId,
				listAccountIds: listWhatsAppAccountIds,
				defaultAccountId: resolveDefaultWhatsAppAccountId(cfg)
			});
		}
		let next = cfg;
		if (accountId !== DEFAULT_ACCOUNT_ID) next = {
			...next,
			channels: {
				...next.channels,
				whatsapp: {
					...next.channels?.whatsapp,
					accounts: {
						...next.channels?.whatsapp?.accounts,
						[accountId]: {
							...next.channels?.whatsapp?.accounts?.[accountId],
							enabled: next.channels?.whatsapp?.accounts?.[accountId]?.enabled ?? true
						}
					}
				}
			}
		};
		const linked = await detectWhatsAppLinked(next, accountId);
		const { authDir } = resolveWhatsAppAuthDir({
			cfg: next,
			accountId
		});
		if (!linked) await prompter.note([
			"Scan the QR with WhatsApp on your phone.",
			`Credentials are stored under ${authDir}/ for future runs.`,
			`Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`
		].join("\n"), "WhatsApp linking");
		if (await prompter.confirm({
			message: linked ? "WhatsApp already linked. Re-link now?" : "Link WhatsApp now (QR)?",
			initialValue: !linked
		})) try {
			await loginWeb(false, void 0, runtime, accountId);
		} catch (err) {
			runtime.error(`WhatsApp login failed: ${String(err)}`);
			await prompter.note(`Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`, "WhatsApp help");
		}
		else if (!linked) await prompter.note(`Run \`${formatCliCommand("openclaw channels login")}\` later to link WhatsApp.`, "WhatsApp");
		next = await promptWhatsAppAllowFrom(next, runtime, prompter, { forceAllowlist: forceAllowFrom });
		return {
			cfg: next,
			accountId
		};
	},
	onAccountRecorded: (accountId, options) => {
		options?.onWhatsAppAccountId?.(accountId);
	}
};

//#endregion
//#region src/channels/plugins/normalize/whatsapp.ts
function normalizeWhatsAppMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	return normalizeWhatsAppTarget(trimmed) ?? void 0;
}
function looksLikeWhatsAppTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^whatsapp:/i.test(trimmed)) return true;
	if (trimmed.includes("@")) return true;
	return /^\+?\d{3,}$/.test(trimmed);
}

//#endregion
//#region src/channels/plugins/status-issues/whatsapp.ts
function readWhatsAppAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		linked: value.linked,
		connected: value.connected,
		running: value.running,
		reconnectAttempts: value.reconnectAttempts,
		lastError: value.lastError
	};
}
function collectWhatsAppStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readWhatsAppAccountStatus(entry);
		if (!account) continue;
		const accountId = asString(account.accountId) ?? "default";
		if (!(account.enabled !== false)) continue;
		const linked = account.linked === true;
		const running = account.running === true;
		const connected = account.connected === true;
		const reconnectAttempts = typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
		const lastError = asString(account.lastError);
		if (!linked) {
			issues.push({
				channel: "whatsapp",
				accountId,
				kind: "auth",
				message: "Not linked (no WhatsApp Web session).",
				fix: `Run: ${formatCliCommand("openclaw channels login")} (scan QR on the gateway host).`
			});
			continue;
		}
		if (running && !connected) issues.push({
			channel: "whatsapp",
			accountId,
			kind: "runtime",
			message: `Linked but disconnected${reconnectAttempts != null ? ` (reconnectAttempts=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
			fix: `Run: ${formatCliCommand("openclaw doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`
		});
	}
	return issues;
}

//#endregion
//#region src/channels/plugins/status-issues/bluebubbles.ts
function readBlueBubblesAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		configured: value.configured,
		running: value.running,
		baseUrl: value.baseUrl,
		lastError: value.lastError,
		probe: value.probe
	};
}
function readBlueBubblesProbeResult(value) {
	if (!isRecord(value)) return null;
	return {
		ok: typeof value.ok === "boolean" ? value.ok : void 0,
		status: typeof value.status === "number" ? value.status : null,
		error: asString(value.error) ?? null
	};
}
function collectBlueBubblesStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readBlueBubblesAccountStatus(entry);
		if (!account) continue;
		const accountId = asString(account.accountId) ?? "default";
		if (!(account.enabled !== false)) continue;
		const configured = account.configured === true;
		const running = account.running === true;
		const lastError = asString(account.lastError);
		const probe = readBlueBubblesProbeResult(account.probe);
		if (!configured) {
			issues.push({
				channel: "bluebubbles",
				accountId,
				kind: "config",
				message: "Not configured (missing serverUrl or password).",
				fix: "Run: openclaw channels add bluebubbles --http-url <server-url> --password <password>"
			});
			continue;
		}
		if (probe && probe.ok === false) {
			const errorDetail = probe.error ? `: ${probe.error}` : probe.status ? ` (HTTP ${probe.status})` : "";
			issues.push({
				channel: "bluebubbles",
				accountId,
				kind: "runtime",
				message: `BlueBubbles server unreachable${errorDetail}`,
				fix: "Check that the BlueBubbles server is running and accessible. Verify serverUrl and password in your config."
			});
		}
		if (running && lastError) issues.push({
			channel: "bluebubbles",
			accountId,
			kind: "runtime",
			message: `Channel error: ${lastError}`,
			fix: "Check gateway logs for details. If the webhook is failing, verify the webhook URL is configured in BlueBubbles server settings."
		});
	}
	return issues;
}

//#endregion
//#region src/line/config-schema.ts
const DmPolicySchema$1 = z.enum([
	"open",
	"allowlist",
	"pairing",
	"disabled"
]);
const GroupPolicySchema$1 = z.enum([
	"open",
	"allowlist",
	"disabled"
]);
const LineGroupConfigSchema = z.object({
	enabled: z.boolean().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	requireMention: z.boolean().optional(),
	systemPrompt: z.string().optional(),
	skills: z.array(z.string()).optional()
}).strict();
const LineAccountConfigSchema = z.object({
	enabled: z.boolean().optional(),
	channelAccessToken: z.string().optional(),
	channelSecret: z.string().optional(),
	tokenFile: z.string().optional(),
	secretFile: z.string().optional(),
	name: z.string().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	dmPolicy: DmPolicySchema$1.optional().default("pairing"),
	groupPolicy: GroupPolicySchema$1.optional().default("allowlist"),
	mediaMaxMb: z.number().optional(),
	webhookPath: z.string().optional(),
	groups: z.record(z.string(), LineGroupConfigSchema.optional()).optional()
}).strict();
const LineConfigSchema = z.object({
	enabled: z.boolean().optional(),
	channelAccessToken: z.string().optional(),
	channelSecret: z.string().optional(),
	tokenFile: z.string().optional(),
	secretFile: z.string().optional(),
	name: z.string().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	dmPolicy: DmPolicySchema$1.optional().default("pairing"),
	groupPolicy: GroupPolicySchema$1.optional().default("allowlist"),
	mediaMaxMb: z.number().optional(),
	webhookPath: z.string().optional(),
	accounts: z.record(z.string(), LineAccountConfigSchema.optional()).optional(),
	groups: z.record(z.string(), LineGroupConfigSchema.optional()).optional()
}).strict();

//#endregion
export { BLUEBUBBLES_ACTIONS, BLUEBUBBLES_ACTION_NAMES, BLUEBUBBLES_GROUP_ACTIONS, BlockStreamingCoalesceSchema, CHANNEL_MESSAGE_ACTION_NAMES, DEFAULT_ACCOUNT_ID, DEFAULT_GROUP_HISTORY_LIMIT, DiscordConfigSchema, DmConfigSchema, DmPolicySchema, GoogleChatConfigSchema, GroupPolicySchema, IMessageConfigSchema, LineConfigSchema, MSTeamsConfigSchema, MarkdownConfigSchema, MarkdownTableModeSchema, PAIRING_APPROVED_MESSAGE, SILENT_REPLY_TOKEN, SignalConfigSchema, SlackConfigSchema, TelegramConfigSchema, ToolPolicySchema, WhatsAppConfigSchema, addWildcardAllowFrom, applyAccountNameToChannelSection, buildChannelConfigSchema, buildChannelKeyCandidates, buildPendingHistoryContextFromMap, buildSlackThreadingToolContext, clearHistoryEntries, clearHistoryEntriesIfEnabled, collectBlueBubblesStatusIssues, collectDiscordAuditChannelIds, collectDiscordStatusIssues, collectTelegramStatusIssues, collectWhatsAppStatusIssues, createActionCard, createActionGate, createImageCard, createInfoCard, createListCard, createReceiptCard, createReplyPrefixContext, createTypingCallbacks, deleteAccountFromConfigSection, detectMime, discordOnboardingAdapter, emitDiagnosticEvent, emptyPluginConfigSchema, extensionForMime, extractOriginalFilename, formatAllowlistMatchMeta, formatDocsLink, formatLocationText, formatPairingApproveHint, getChatChannelMeta, getFileExtension, hasMarkdownToConvert, imessageOnboardingAdapter, isDiagnosticsEnabled, isSilentReplyText, isWhatsAppGroupJid, jsonResult, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledSlackAccounts, listIMessageAccountIds, listLineAccountIds, listSignalAccountIds, listSlackAccountIds, listSlackDirectoryGroupsFromConfig, listSlackDirectoryPeersFromConfig, listTelegramAccountIds, listTelegramDirectoryGroupsFromConfig, listTelegramDirectoryPeersFromConfig, listWhatsAppAccountIds, listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, loadWebMedia, logAckFailure, logInboundDrop, logTypingFailure, looksLikeDiscordTargetId, looksLikeIMessageTargetId, looksLikeSignalTargetId, looksLikeSlackTargetId, looksLikeTelegramTargetId, looksLikeWhatsAppTargetId, mergeAllowlist, migrateBaseNameToDefaultAccount, missingTargetError, normalizeAccountId, normalizeAllowFrom, normalizeChannelSlug, normalizeDiscordMessagingTarget, normalizeE164, normalizeIMessageMessagingTarget, normalizeAccountId$1 as normalizeLineAccountId, normalizePluginHttpPath, normalizeSignalMessagingTarget, normalizeSlackMessagingTarget, normalizeTelegramMessagingTarget, normalizeWhatsAppMessagingTarget, normalizeWhatsAppTarget, onDiagnosticEvent, optionalStringEnum, processLineMessage, promptAccountId, promptChannelAccessConfig, readNumberParam, readReactionParams, readStringParam, recordInboundSession, recordPendingHistoryEntry, recordPendingHistoryEntryIfEnabled, registerLogTransport, registerPluginHttpRoute, removeAckReactionAfterReply, requireOpenAllowFrom, resolveAckReaction, resolveBlueBubblesGroupRequireMention, resolveBlueBubblesGroupToolPolicy, resolveChannelEntryMatch, resolveChannelEntryMatchWithFallback, resolveChannelMediaMaxBytes, resolveControlCommandGate, resolveDefaultDiscordAccountId, resolveDefaultIMessageAccountId, resolveDefaultLineAccountId, resolveDefaultSignalAccountId, resolveDefaultSlackAccountId, resolveDefaultTelegramAccountId, resolveDefaultWhatsAppAccountId, resolveDiscordAccount, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveGoogleChatGroupRequireMention, resolveGoogleChatGroupToolPolicy, resolveIMessageAccount, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, resolveLineAccount, resolveMentionGating, resolveMentionGatingWithBypass, resolveNestedAllowlistDecision, resolveSignalAccount, resolveSlackAccount, resolveSlackGroupRequireMention, resolveSlackGroupToolPolicy, resolveSlackReplyToMode, resolveTelegramAccount, resolveTelegramGroupRequireMention, resolveTelegramGroupToolPolicy, resolveToolsBySender, resolveWhatsAppAccount, resolveWhatsAppGroupRequireMention, resolveWhatsAppGroupToolPolicy, resolveWhatsAppHeartbeatRecipients, setAccountEnabledInConfigSection, shouldAckReaction, shouldAckReactionForWhatsApp, signalOnboardingAdapter, slackOnboardingAdapter, stringEnum, stripMarkdown, summarizeMapping, telegramOnboardingAdapter, toLocationContext, whatsappOnboardingAdapter };