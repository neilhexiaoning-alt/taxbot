import { G as shouldLogVerbose, H as logVerbose } from "./registry-BI4o0LRR.js";
import "./paths-ZQWYGl2V.js";
import "./model-selection-CowK-FhO.js";
import "./config-BWkAE3kO.js";
import "./agent-scope-CXOONheC.js";
import "./exec-DWU0ncr5.js";
import "./skills-Y10K9pHz.js";
import "./redact-DLALByE6.js";
import "./errors-DsAYQPj4.js";
import "./image-ops-BkWO-jIF.js";
import "./fetch-1G8NOF9c.js";
import "./env-BMPixUW7.js";
import "./thinking-Y1-LpZ2x.js";
import "./normalize-BAbkga68.js";
import "./bindings-C-PiS--V.js";
import "./accounts-o3kraf60.js";
import "./plugins-I-9kMaQm.js";
import "./message-channel-D4VZ-i3l.js";
import "./pi-embedded-helpers-9zZ0QT_L.js";
import "./github-copilot-token-B2_Quzki.js";
import "./manifest-registry-C859nZr8.js";
import "./paths-Dxk5i2ju.js";
import "./tool-images-B0kljyLA.js";
import "./chrome-B7Ju0OOG.js";
import { a as runCapability, l as isAudioAttachment, n as createMediaAttachmentCache, r as normalizeMediaAttachments, t as buildProviderRegistry } from "./runner-1DK3rI6O.js";
import "./image-B1DRN441.js";
import "./pi-model-discovery-DtR631Ph.js";

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