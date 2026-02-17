import "./paths-CyR9Pa1R.js";
import "./registry-B3v_dMjW.js";
import { c as resolveDefaultAgentId, r as resolveAgentDir, s as resolveAgentWorkspaceDir } from "./agent-scope-CHHM9qlY.js";
import "./exec-CTJFoTnU.js";
import "./workspace-DhQVYQ1v.js";
import "./tokens-_C-kmtm6.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-n26FO9Pa.js";
import "./normalize-DiPfVVz6.js";
import "./boolean-mcn6kL0s.js";
import "./env-BDzJYlvR.js";
import "./bindings-CaSaHrfa.js";
import "./accounts-Dua6KzxY.js";
import "./send-B5mjM8qh.js";
import "./plugins-BmVEQmtR.js";
import "./send-BwR5bbHA.js";
import "./deliver-q03ptCn5.js";
import "./send-BbDRH_ID.js";
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
import "./reply-prefix-s-amvIdP.js";
import "./manager-CwO66W6N.js";
import "./sqlite-CPRKTBsQ.js";
import "./retry-CbF43Enn.js";
import "./common-CwTPIosL.js";
import "./chunk-DtdDplIz.js";
import "./markdown-tables-C-noWIUe.js";
import "./fetch-CcQo7_WG.js";
import "./ir-DsCzfB8s.js";
import "./render-B1VqYyvo.js";
import "./commands-registry-CIu526kl.js";
import "./runner-CXGqZawD.js";
import "./skill-commands-Ckvhk2Ta.js";
import "./send-B2L_LPsH.js";
import "./outbound-attachment-JUDeu6dM.js";
import "./send-Du8Lznij.js";
import "./resolve-route-BeiG2DuB.js";
import "./channel-activity-Ddq1rNcH.js";
import "./tables-7IKeeakS.js";
import "./proxy-Dvn2GZAo.js";
import "./replies-IfYvl8C8.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		console.error("[llm-slug-generator] Failed to generate slug:", err);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}

//#endregion
export { generateSlugViaLLM };