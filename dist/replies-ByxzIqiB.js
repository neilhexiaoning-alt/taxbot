import { t as __exportAll } from "./rolldown-runtime-Cbj13DAv.js";
import { G as logVerbose } from "./registry-DykAc8X1.js";
import { n as SILENT_REPLY_TOKEN, r as isSilentReplyText } from "./tokens-Db_vZ5Rl.js";
import { s as resolveSlackAccount, u as resolveSlackBotToken } from "./normalize-DkfyO2rR.js";
import { n as loadConfig } from "./config-CrQmj94P.js";
import { c as resolveChunkMode, i as chunkMarkdownTextWithMode, l as resolveTextChunkLimit } from "./chunk-DoZ90AdZ.js";
import { n as resolveMarkdownTableMode } from "./markdown-tables-CG4nd8Tg.js";
import { a as loadWebMedia, n as markdownToIR, t as chunkMarkdownIR } from "./ir-1EgBLVMM.js";
import { t as renderMarkdownWithMarkers } from "./render-95l30zcf.js";
import { WebClient } from "@slack/web-api";

//#region src/channels/targets.ts
function normalizeTargetId(kind, id) {
	return `${kind}:${id}`.toLowerCase();
}
function buildMessagingTarget(kind, id, raw) {
	return {
		kind,
		id,
		raw,
		normalized: normalizeTargetId(kind, id)
	};
}
function ensureTargetId(params) {
	if (!params.pattern.test(params.candidate)) throw new Error(params.errorMessage);
	return params.candidate;
}
function requireTargetKind(params) {
	const kindLabel = params.kind;
	if (!params.target) throw new Error(`${params.platform} ${kindLabel} id is required.`);
	if (params.target.kind !== params.kind) throw new Error(`${params.platform} ${kindLabel} id is required (use ${kindLabel}:<id>).`);
	return params.target.id;
}

//#endregion
//#region src/slack/targets.ts
function parseSlackTarget(raw, options = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const mentionMatch = trimmed.match(/^<@([A-Z0-9]+)>$/i);
	if (mentionMatch) return buildMessagingTarget("user", mentionMatch[1], trimmed);
	if (trimmed.startsWith("user:")) {
		const id = trimmed.slice(5).trim();
		return id ? buildMessagingTarget("user", id, trimmed) : void 0;
	}
	if (trimmed.startsWith("channel:")) {
		const id = trimmed.slice(8).trim();
		return id ? buildMessagingTarget("channel", id, trimmed) : void 0;
	}
	if (trimmed.startsWith("slack:")) {
		const id = trimmed.slice(6).trim();
		return id ? buildMessagingTarget("user", id, trimmed) : void 0;
	}
	if (trimmed.startsWith("@")) return buildMessagingTarget("user", ensureTargetId({
		candidate: trimmed.slice(1).trim(),
		pattern: /^[A-Z0-9]+$/i,
		errorMessage: "Slack DMs require a user id (use user:<id> or <@id>)"
	}), trimmed);
	if (trimmed.startsWith("#")) return buildMessagingTarget("channel", ensureTargetId({
		candidate: trimmed.slice(1).trim(),
		pattern: /^[A-Z0-9]+$/i,
		errorMessage: "Slack channels require a channel id (use channel:<id>)"
	}), trimmed);
	if (options.defaultKind) return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
	return buildMessagingTarget("channel", trimmed, trimmed);
}
function resolveSlackChannelId(raw) {
	return requireTargetKind({
		platform: "Slack",
		target: parseSlackTarget(raw, { defaultKind: "channel" }),
		kind: "channel"
	});
}

//#endregion
//#region src/slack/client.ts
const SLACK_DEFAULT_RETRY_OPTIONS = {
	retries: 2,
	factor: 2,
	minTimeout: 500,
	maxTimeout: 3e3,
	randomize: true
};
function resolveSlackWebClientOptions(options = {}) {
	return {
		...options,
		retryConfig: options.retryConfig ?? SLACK_DEFAULT_RETRY_OPTIONS
	};
}
function createSlackWebClient(token, options = {}) {
	return new WebClient(token, resolveSlackWebClientOptions(options));
}

//#endregion
//#region src/slack/format.ts
function escapeSlackMrkdwnSegment(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const SLACK_ANGLE_TOKEN_RE = /<[^>\n]+>/g;
function isAllowedSlackAngleToken(token) {
	if (!token.startsWith("<") || !token.endsWith(">")) return false;
	const inner = token.slice(1, -1);
	return inner.startsWith("@") || inner.startsWith("#") || inner.startsWith("!") || inner.startsWith("mailto:") || inner.startsWith("tel:") || inner.startsWith("http://") || inner.startsWith("https://") || inner.startsWith("slack://");
}
function escapeSlackMrkdwnContent(text) {
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	SLACK_ANGLE_TOKEN_RE.lastIndex = 0;
	const out = [];
	let lastIndex = 0;
	for (let match = SLACK_ANGLE_TOKEN_RE.exec(text); match; match = SLACK_ANGLE_TOKEN_RE.exec(text)) {
		const matchIndex = match.index ?? 0;
		out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex, matchIndex)));
		const token = match[0] ?? "";
		out.push(isAllowedSlackAngleToken(token) ? token : escapeSlackMrkdwnSegment(token));
		lastIndex = matchIndex + token.length;
	}
	out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex)));
	return out.join("");
}
function escapeSlackMrkdwnText(text) {
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	return text.split("\n").map((line) => {
		if (line.startsWith("> ")) return `> ${escapeSlackMrkdwnContent(line.slice(2))}`;
		return escapeSlackMrkdwnContent(line);
	}).join("\n");
}
function buildSlackLink(link, text) {
	const href = link.href.trim();
	if (!href) return null;
	const trimmedLabel = text.slice(link.start, link.end).trim();
	const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
	if (!(trimmedLabel.length > 0 && trimmedLabel !== href && trimmedLabel !== comparableHref)) return null;
	const safeHref = escapeSlackMrkdwnSegment(href);
	return {
		start: link.start,
		end: link.end,
		open: `<${safeHref}|`,
		close: ">"
	};
}
function markdownToSlackMrkdwnChunks(markdown, limit, options = {}) {
	return chunkMarkdownIR(markdownToIR(markdown ?? "", {
		linkify: false,
		autolink: false,
		headingStyle: "bold",
		blockquotePrefix: "> ",
		tableMode: options.tableMode
	}), limit).map((chunk) => renderMarkdownWithMarkers(chunk, {
		styleMarkers: {
			bold: {
				open: "*",
				close: "*"
			},
			italic: {
				open: "_",
				close: "_"
			},
			strikethrough: {
				open: "~",
				close: "~"
			},
			code: {
				open: "`",
				close: "`"
			},
			code_block: {
				open: "```\n",
				close: "```"
			}
		},
		escapeText: escapeSlackMrkdwnText,
		buildLink: buildSlackLink
	}));
}

//#endregion
//#region src/slack/send.ts
const SLACK_TEXT_LIMIT = 4e3;
function hasCustomIdentity(identity) {
	return Boolean(identity?.username || identity?.iconUrl || identity?.iconEmoji);
}
function isSlackCustomizeScopeError(err) {
	if (!(err instanceof Error)) return false;
	const maybeData = err;
	if (maybeData.data?.error?.toLowerCase() !== "missing_scope") return false;
	if ((maybeData.data?.needed?.toLowerCase())?.includes("chat:write.customize")) return true;
	return [...maybeData.data?.response_metadata?.scopes ?? [], ...maybeData.data?.response_metadata?.acceptedScopes ?? []].map((scope) => scope.toLowerCase()).includes("chat:write.customize");
}
async function postSlackMessageBestEffort(params) {
	const basePayload = {
		channel: params.channelId,
		text: params.text,
		thread_ts: params.threadTs
	};
	try {
		if (params.identity?.iconUrl) return await params.client.chat.postMessage({
			...basePayload,
			...params.identity.username ? { username: params.identity.username } : {},
			icon_url: params.identity.iconUrl
		});
		if (params.identity?.iconEmoji) return await params.client.chat.postMessage({
			...basePayload,
			...params.identity.username ? { username: params.identity.username } : {},
			icon_emoji: params.identity.iconEmoji
		});
		return await params.client.chat.postMessage({
			...basePayload,
			...params.identity?.username ? { username: params.identity.username } : {}
		});
	} catch (err) {
		if (!hasCustomIdentity(params.identity) || !isSlackCustomizeScopeError(err)) throw err;
		logVerbose("slack send: missing chat:write.customize, retrying without custom identity");
		return params.client.chat.postMessage(basePayload);
	}
}
function resolveToken(params) {
	const explicit = resolveSlackBotToken(params.explicit);
	if (explicit) return explicit;
	const fallback = resolveSlackBotToken(params.fallbackToken);
	if (!fallback) {
		logVerbose(`slack send: missing bot token for account=${params.accountId} explicit=${Boolean(params.explicit)} source=${params.fallbackSource ?? "unknown"}`);
		throw new Error(`Slack bot token missing for account "${params.accountId}" (set channels.slack.accounts.${params.accountId}.botToken or SLACK_BOT_TOKEN for default).`);
	}
	return fallback;
}
function parseRecipient(raw) {
	const target = parseSlackTarget(raw);
	if (!target) throw new Error("Recipient is required for Slack sends");
	return {
		kind: target.kind,
		id: target.id
	};
}
async function resolveChannelId(client, recipient) {
	if (recipient.kind === "channel") return { channelId: recipient.id };
	const channelId = (await client.conversations.open({ users: recipient.id })).channel?.id;
	if (!channelId) throw new Error("Failed to open Slack DM channel");
	return {
		channelId,
		isDm: true
	};
}
async function uploadSlackFile(params) {
	const { buffer, contentType: _contentType, fileName } = await loadWebMedia(params.mediaUrl, {
		maxBytes: params.maxBytes,
		localRoots: params.mediaLocalRoots
	});
	const basePayload = {
		channel_id: params.channelId,
		file: buffer,
		filename: fileName,
		...params.caption ? { initial_comment: params.caption } : {}
	};
	const payload = params.threadTs ? {
		...basePayload,
		thread_ts: params.threadTs
	} : basePayload;
	const parsed = await params.client.files.uploadV2(payload);
	return parsed.files?.[0]?.id ?? parsed.file?.id ?? parsed.files?.[0]?.name ?? parsed.file?.name ?? "unknown";
}
async function sendMessageSlack(to, message, opts = {}) {
	const trimmedMessage = message?.trim() ?? "";
	if (!trimmedMessage && !opts.mediaUrl) throw new Error("Slack send requires text or media");
	const cfg = loadConfig();
	const account = resolveSlackAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken({
		explicit: opts.token,
		accountId: account.accountId,
		fallbackToken: account.botToken,
		fallbackSource: account.botTokenSource
	});
	const client = opts.client ?? createSlackWebClient(token);
	const { channelId } = await resolveChannelId(client, parseRecipient(to));
	const textLimit = resolveTextChunkLimit(cfg, "slack", account.accountId);
	const chunkLimit = Math.min(textLimit, SLACK_TEXT_LIMIT);
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "slack",
		accountId: account.accountId
	});
	const chunkMode = resolveChunkMode(cfg, "slack", account.accountId);
	const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(trimmedMessage, chunkLimit, chunkMode) : [trimmedMessage]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, chunkLimit, { tableMode }));
	if (!chunks.length && trimmedMessage) chunks.push(trimmedMessage);
	const mediaMaxBytes = typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb * 1024 * 1024 : void 0;
	let lastMessageId = "";
	if (opts.mediaUrl) {
		const [firstChunk, ...rest] = chunks;
		lastMessageId = await uploadSlackFile({
			client,
			channelId,
			mediaUrl: opts.mediaUrl,
			mediaLocalRoots: opts.mediaLocalRoots,
			caption: firstChunk,
			threadTs: opts.threadTs,
			maxBytes: mediaMaxBytes
		});
		for (const chunk of rest) lastMessageId = (await postSlackMessageBestEffort({
			client,
			channelId,
			text: chunk,
			threadTs: opts.threadTs,
			identity: opts.identity
		})).ts ?? lastMessageId;
	} else for (const chunk of chunks.length ? chunks : [""]) lastMessageId = (await postSlackMessageBestEffort({
		client,
		channelId,
		text: chunk,
		threadTs: opts.threadTs,
		identity: opts.identity
	})).ts ?? lastMessageId;
	return {
		messageId: lastMessageId || "unknown",
		channelId
	};
}

//#endregion
//#region src/auto-reply/reply/reply-reference.ts
function createReplyReferencePlanner(options) {
	let hasReplied = options.hasReplied ?? false;
	const allowReference = options.allowReference !== false;
	const existingId = options.existingId?.trim();
	const startId = options.startId?.trim();
	const use = () => {
		if (!allowReference) return;
		if (options.replyToMode === "off") return;
		const id = existingId ?? startId;
		if (!id) return;
		if (options.replyToMode === "all") {
			hasReplied = true;
			return id;
		}
		if (!hasReplied) {
			hasReplied = true;
			return id;
		}
	};
	const markSent = () => {
		hasReplied = true;
	};
	return {
		use,
		markSent,
		hasReplied: () => hasReplied
	};
}

//#endregion
//#region src/slack/monitor/replies.ts
var replies_exports = /* @__PURE__ */ __exportAll({
	createSlackReplyDeliveryPlan: () => createSlackReplyDeliveryPlan,
	deliverReplies: () => deliverReplies,
	deliverSlackSlashReplies: () => deliverSlackSlashReplies,
	resolveSlackThreadTs: () => resolveSlackThreadTs
});
async function deliverReplies(params) {
	for (const payload of params.replies) {
		const threadTs = payload.replyToId ?? params.replyThreadTs;
		const mediaList = payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : []);
		const text = payload.text ?? "";
		if (!text && mediaList.length === 0) continue;
		if (mediaList.length === 0) {
			const trimmed = text.trim();
			if (!trimmed || isSilentReplyText(trimmed, SILENT_REPLY_TOKEN)) continue;
			await sendMessageSlack(params.target, trimmed, {
				token: params.token,
				threadTs,
				accountId: params.accountId
			});
		} else {
			let first = true;
			for (const mediaUrl of mediaList) {
				const caption = first ? text : "";
				first = false;
				await sendMessageSlack(params.target, caption, {
					token: params.token,
					mediaUrl,
					threadTs,
					accountId: params.accountId
				});
			}
		}
		params.runtime.log?.(`delivered reply to ${params.target}`);
	}
}
/**
* Compute effective threadTs for a Slack reply based on replyToMode.
* - "off": stay in thread if already in one, otherwise main channel
* - "first": first reply goes to thread, subsequent replies to main channel
* - "all": all replies go to thread
*/
function resolveSlackThreadTs(params) {
	return createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasReplied
	}).use();
}
function createSlackReplyReferencePlanner(params) {
	return createReplyReferencePlanner({
		replyToMode: params.incomingThreadTs ? "all" : params.replyToMode,
		existingId: params.incomingThreadTs,
		startId: params.messageTs,
		hasReplied: params.hasReplied
	});
}
function createSlackReplyDeliveryPlan(params) {
	const replyReference = createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasRepliedRef.value
	});
	return {
		nextThreadTs: () => replyReference.use(),
		markSent: () => {
			replyReference.markSent();
			params.hasRepliedRef.value = replyReference.hasReplied();
		}
	};
}
async function deliverSlackSlashReplies(params) {
	const messages = [];
	const chunkLimit = Math.min(params.textLimit, 4e3);
	for (const payload of params.replies) {
		const textRaw = payload.text?.trim() ?? "";
		const text = textRaw && !isSilentReplyText(textRaw, SILENT_REPLY_TOKEN) ? textRaw : void 0;
		const mediaList = payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : []);
		const combined = [text ?? "", ...mediaList.map((url) => url.trim()).filter(Boolean)].filter(Boolean).join("\n");
		if (!combined) continue;
		const chunkMode = params.chunkMode ?? "length";
		const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(combined, chunkLimit, chunkMode) : [combined]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, chunkLimit, { tableMode: params.tableMode }));
		if (!chunks.length && combined) chunks.push(combined);
		for (const chunk of chunks) messages.push(chunk);
	}
	if (messages.length === 0) return;
	const responseType = params.ephemeral ? "ephemeral" : "in_channel";
	for (const text of messages) await params.respond({
		text,
		response_type: responseType
	});
}

//#endregion
export { sendMessageSlack as a, parseSlackTarget as c, ensureTargetId as d, requireTargetKind as f, createReplyReferencePlanner as i, resolveSlackChannelId as l, deliverReplies as n, createSlackWebClient as o, replies_exports as r, resolveSlackWebClientOptions as s, createSlackReplyDeliveryPlan as t, buildMessagingTarget as u };