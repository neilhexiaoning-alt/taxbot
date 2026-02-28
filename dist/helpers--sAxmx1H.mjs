import { D as DEFAULT_ACCOUNT_ID } from "./agent-scope-BD88ooNs.mjs";
import { t as formatCliCommand } from "./command-format-CRQZQg6U.mjs";

//#region src/channels/plugins/helpers.ts
function resolveChannelDefaultAccountId(params) {
	const accountIds = params.accountIds ?? params.plugin.config.listAccountIds(params.cfg);
	return params.plugin.config.defaultAccountId?.(params.cfg) ?? accountIds[0] ?? DEFAULT_ACCOUNT_ID;
}
function formatPairingApproveHint(channelId) {
	return `Approve via: ${formatCliCommand(`openclaw pairing list ${channelId}`)} / ${formatCliCommand(`openclaw pairing approve ${channelId} <code>`)}`;
}

//#endregion
export { resolveChannelDefaultAccountId as n, formatPairingApproveHint as t };