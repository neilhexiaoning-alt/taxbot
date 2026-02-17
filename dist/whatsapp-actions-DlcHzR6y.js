import "./paths-Bp5uKvNR.js";
import "./registry-DykAc8X1.js";
import "./agent-scope-CY_DQWq_.js";
import "./exec-CtZxTex6.js";
import "./model-selection-Dc-tNyEx.js";
import "./github-copilot-token-ttqQRqMA.js";
import "./env-DutMcEGh.js";
import "./normalize-DkfyO2rR.js";
import "./bindings-Chg9tG5E.js";
import "./accounts-ByRdPRuM.js";
import "./plugins-B1FAWSp7.js";
import "./image-ops-T7wOTwQY.js";
import "./message-channel-D33Aa4IX.js";
import "./config-CrQmj94P.js";
import "./manifest-registry-DS-vtueQ.js";
import "./tool-images-Uv9113lF.js";
import { i as jsonResult, l as readStringParam, o as readReactionParams, t as createActionGate } from "./common-Bi2CCRWc.js";
import "./chunk-DoZ90AdZ.js";
import "./markdown-tables-CG4nd8Tg.js";
import "./fetch-DFjDK4Ev.js";
import "./ir-1EgBLVMM.js";
import "./render-95l30zcf.js";
import "./active-listener-J0LlY-PF.js";
import { r as sendReactionWhatsApp } from "./outbound-Sk6MCxI_.js";

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