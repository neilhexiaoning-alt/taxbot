import "./paths-CyR9Pa1R.js";
import { X as shouldLogVerbose, q as logVerbose } from "./registry-B3v_dMjW.js";
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
import "./pi-model-discovery-CvOm0Qeg.js";
import "./message-channel-B_JP848Y.js";
import "./pi-embedded-helpers-BrFJjKm3.js";
import "./config-C-jA90S6.js";
import "./manifest-registry-GgUdfF-z.js";
import "./chrome-D_KkCJSg.js";
import "./frontmatter-DWd9059h.js";
import "./skills-BvFD0bOH.js";
import "./redact-BjQ9RIiE.js";
import "./errors-CsoDC3nn.js";
import "./store-ky6KaH78.js";
import "./thinking-BL4QW4f_.js";
import "./paths-sVMzHKNe.js";
import "./tool-images-CtOU3chJ.js";
import "./image-BmFSAvE-.js";
import "./fetch-CcQo7_WG.js";
import { a as runCapability, l as isAudioAttachment, n as createMediaAttachmentCache, r as normalizeMediaAttachments, t as buildProviderRegistry } from "./runner-CXGqZawD.js";

//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	const providerRegistry = buildProviderRegistry(params.providers);
	const cache = createMediaAttachmentCache(attachments);
	try {
		const result = await runCapability({
			capability: "audio",
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentDir: params.agentDir,
			providerRegistry,
			config: audioConfig,
			activeModel: params.activeModel
		});
		if (!result || result.outputs.length === 0) return;
		const audioOutput = result.outputs.find((output) => output.kind === "audio.transcription");
		if (!audioOutput || !audioOutput.text) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${audioOutput.text.length} chars from attachment ${firstAudio.index}`);
		return audioOutput.text;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	} finally {
		await cache.cleanup();
	}
}

//#endregion
export { transcribeFirstAudio };