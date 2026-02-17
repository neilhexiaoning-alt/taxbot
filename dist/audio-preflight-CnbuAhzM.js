import "./paths-B4BZAPZh.js";
import { F as shouldLogVerbose, M as logVerbose } from "./utils-CFnnyoTP.js";
import "./thinking-EAliFiVK.js";
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
import { a as runCapability, n as createMediaAttachmentCache, o as isAudioAttachment, r as normalizeMediaAttachments, t as buildProviderRegistry } from "./runner-BBNVS4uo.js";
import "./image-wG1bcosY.js";
import "./models-config-DE_nkoL4.js";
import "./pi-model-discovery-DX1x3UsN.js";
import "./pi-embedded-helpers-XPBkJnfO.js";
import "./sandbox-CCXqNFNa.js";
import "./chrome-CZ4H3suC.js";
import "./tailscale-DOI5fbGP.js";
import "./auth-CN3K_86O.js";
import "./server-context-Dx2Suq6r.js";
import "./frontmatter-CjCfqPvH.js";
import "./skills-Bme2RWJt.js";
import "./routes-ETEIzbdF.js";
import "./redact-CjJyQlVU.js";
import "./errors-CdJjJ1Jq.js";
import "./paths-CWc9mjAN.js";
import "./ssrf-Bhv0qRd-.js";
import "./image-ops-Dmx5NOjU.js";
import "./store-Dtv6xckJ.js";
import "./ports-CyKvUwdk.js";
import "./trash-CXJgiRwI.js";
import "./message-channel-B11syIWY.js";
import "./sessions-B1VYnsjk.js";
import "./dock-CEzRHF7-.js";
import "./normalize-CEDF7eBP.js";
import "./bindings-DszN1V1x.js";
import "./logging-B-Ool4n-.js";
import "./accounts-IY7lqWQi.js";
import "./plugins-MECKrdj4.js";
import "./paths-CS8MdUIx.js";
import "./tool-images-B-uxwbUZ.js";
import "./tool-display-I-_BPOaX.js";
import "./fetch-guard-BlxX1n2G.js";
import "./fetch-DbB8ywgG.js";
import "./model-catalog-CZMJoTSB.js";

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