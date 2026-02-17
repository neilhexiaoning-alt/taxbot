import "./paths-CyR9Pa1R.js";
import "./registry-B3v_dMjW.js";
import "./agent-scope-CHHM9qlY.js";
import "./exec-CTJFoTnU.js";
import "./workspace-DhQVYQ1v.js";
import "./normalize-DiPfVVz6.js";
import "./boolean-mcn6kL0s.js";
import "./env-BDzJYlvR.js";
import "./bindings-CaSaHrfa.js";
import "./accounts-Dua6KzxY.js";
import "./plugins-BmVEQmtR.js";
import "./image-ops-BN-gQcBh.js";
import "./model-auth-DUBAGAng.js";
import "./github-copilot-token-timpm27W.js";
import "./message-channel-B_JP848Y.js";
import "./config-C-jA90S6.js";
import "./manifest-registry-GgUdfF-z.js";
import "./tool-images-CtOU3chJ.js";
import { i as jsonResult, l as readStringParam, o as readReactionParams, t as createActionGate } from "./common-CwTPIosL.js";
import "./chunk-DtdDplIz.js";
import "./markdown-tables-C-noWIUe.js";
import "./fetch-CcQo7_WG.js";
import "./ir-DsCzfB8s.js";
import "./render-B1VqYyvo.js";
import "./tables-7IKeeakS.js";
import { r as sendReactionWhatsApp } from "./outbound-BbU9Vgon.js";

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