import "./registry-BI4o0LRR.js";
import "./paths-ZQWYGl2V.js";
import "./model-selection-CowK-FhO.js";
import "./config-BWkAE3kO.js";
import "./agent-scope-CXOONheC.js";
import "./exec-DWU0ncr5.js";
import "./image-ops-BkWO-jIF.js";
import "./fetch-1G8NOF9c.js";
import "./env-BMPixUW7.js";
import "./normalize-BAbkga68.js";
import "./bindings-C-PiS--V.js";
import "./accounts-o3kraf60.js";
import "./plugins-I-9kMaQm.js";
import "./message-channel-D4VZ-i3l.js";
import "./github-copilot-token-B2_Quzki.js";
import "./manifest-registry-C859nZr8.js";
import "./tool-images-B0kljyLA.js";
import { i as jsonResult, l as readStringParam, o as readReactionParams, t as createActionGate } from "./common-_3g0UsoC.js";
import "./active-listener-BMJmKfL4.js";
import "./ir-VqywxPfh.js";
import "./chunk-B1La9dUK.js";
import "./markdown-tables-GIz_dEG-.js";
import "./render-DW7AcFdD.js";
import { r as sendReactionWhatsApp } from "./outbound-Bp1muIPn.js";

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