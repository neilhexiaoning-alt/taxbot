import "./paths-B4BZAPZh.js";
import "./utils-CFnnyoTP.js";
import "./registry-D74-I5q-.js";
import "./subsystem-CiM1FVu6.js";
import "./exec-DSVXqxGa.js";
import "./agent-scope-5j4KiZmG.js";
import "./model-selection-DnrWKBOM.js";
import "./github-copilot-token-D2zp6kMZ.js";
import "./boolean-BsqeuxE6.js";
import "./env-DRL0O4y1.js";
import "./config-DTlZk19z.js";
import "./manifest-registry-DoaWeDHN.js";
import "./ssrf-Bhv0qRd-.js";
import "./image-ops-Dmx5NOjU.js";
import "./message-channel-B11syIWY.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./plugins-MECKrdj4.js";
import "./tool-images-B-uxwbUZ.js";
import "./fetch-guard-BlxX1n2G.js";
import "./fetch-DbB8ywgG.js";
import { a as jsonResult, n as createActionGate, s as readReactionParams, u as readStringParam } from "./common-C4A6CsYx.js";
import "./chunk-BiewMCJC.js";
import "./markdown-tables-Cc0AOOs4.js";
import "./ir-DwRJAzeS.js";
import "./render-BBWKrfmg.js";
import "./tables-DIbPoQpb.js";
import { r as sendReactionWhatsApp } from "./outbound-EHyw_fLW.js";

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