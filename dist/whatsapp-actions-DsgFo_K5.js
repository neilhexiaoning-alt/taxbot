import "./auth-profiles-GYsKiVaE.js";
import "./exec-CBKBIMpA.js";
import "./agent-scope-F21xRiu_.js";
import "./github-copilot-token-DuFIqfeC.js";
import "./manifest-registry-QAG6awiS.js";
import "./config-CF5WgkYh.js";
import "./message-channel-BoxkHV_q.js";
import "./normalize-J3mTxq-2.js";
import "./bindings-CeWP3eHN.js";
import "./logging-CfEk_PnX.js";
import "./accounts-Beq84OQo.js";
import "./plugins-B4cKx11a.js";
import "./image-ops-DHR6894Y.js";
import "./ssrf-B2Y1od3A.js";
import "./tool-images-BzK_1ySW.js";
import { a as jsonResult, n as createActionGate, s as readReactionParams, u as readStringParam } from "./common-Bl39mxj5.js";
import "./chunk-CpW4isHi.js";
import "./markdown-tables-CePdHRv3.js";
import "./fetch-guard-DyNYivLB.js";
import "./fetch-C_wlQF6t.js";
import "./ir-bQID6YWA.js";
import "./render-scQFEkLe.js";
import "./tables-BgDwWN0_.js";
import { r as sendReactionWhatsApp } from "./outbound-3uYLYgt6.js";

//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		await sendReactionWhatsApp(chatJid, messageId, remove ? "" : emoji, {
			verbose: false,
			fromMe: typeof fromMeRaw === "boolean" ? fromMeRaw : void 0,
			participant: participant ?? void 0,
			accountId: accountId ?? void 0
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}

//#endregion
export { handleWhatsAppAction };