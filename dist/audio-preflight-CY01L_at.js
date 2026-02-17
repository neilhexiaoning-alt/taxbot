import "./paths-Bp5uKvNR.js";
import { G as logVerbose, J as shouldLogVerbose } from "./registry-DykAc8X1.js";
import "./agent-scope-CY_DQWq_.js";
import "./exec-CtZxTex6.js";
import "./model-selection-Dc-tNyEx.js";
import "./github-copilot-token-ttqQRqMA.js";
import "./env-DutMcEGh.js";
import "./normalize-DkfyO2rR.js";
import "./bindings-Chg9tG5E.js";
import "./accounts-ByRdPRuM.js";
import "./plugins-B1FAWSp7.js";
import "./thinking-MNfuBcCX.js";
import "./image-ops-T7wOTwQY.js";
import "./pi-model-discovery-EwKVHlZB.js";
import "./message-channel-D33Aa4IX.js";
import "./pi-embedded-helpers-ChCgGKCl.js";
import "./config-CrQmj94P.js";
import "./manifest-registry-DS-vtueQ.js";
import "./chrome-BJfJNQb3.js";
import "./skills-BwWUxFkZ.js";
import "./redact-D22jo9M_.js";
import "./errors-DRkQELvv.js";
import "./paths-Cke0mRFu.js";
import "./tool-images-Uv9113lF.js";
import "./image-Cl4xTVyN.js";
import "./fetch-DFjDK4Ev.js";
import { a as runCapability, l as isAudioAttachment, n as createMediaAttachmentCache, r as normalizeMediaAttachments, t as buildProviderRegistry } from "./runner-BZq9x8AB.js";

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