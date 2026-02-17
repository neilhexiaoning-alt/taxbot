import { s as resolveStateDir } from "../../paths-CyR9Pa1R.js";
import { d as resolveAgentIdFromSessionKey } from "../../session-key-CgcjHuX_.js";
import "../../registry-B3v_dMjW.js";
import { s as resolveAgentWorkspaceDir } from "../../agent-scope-CHHM9qlY.js";
import { c as createSubsystemLogger } from "../../exec-CTJFoTnU.js";
import "../../workspace-DhQVYQ1v.js";
import "../../tokens-_C-kmtm6.js";
import { K as hasInterSessionUserProvenance } from "../../pi-embedded-n26FO9Pa.js";
import "../../normalize-DiPfVVz6.js";
import "../../boolean-mcn6kL0s.js";
import "../../env-BDzJYlvR.js";
import "../../bindings-CaSaHrfa.js";
import "../../accounts-Dua6KzxY.js";
import "../../send-B5mjM8qh.js";
import "../../plugins-BmVEQmtR.js";
import "../../send-BwR5bbHA.js";
import "../../deliver-q03ptCn5.js";
import "../../send-BbDRH_ID.js";
import "../../image-ops-BN-gQcBh.js";
import "../../model-auth-DUBAGAng.js";
import "../../github-copilot-token-timpm27W.js";
import "../../pi-model-discovery-CvOm0Qeg.js";
import "../../message-channel-B_JP848Y.js";
import "../../pi-embedded-helpers-BrFJjKm3.js";
import "../../config-C-jA90S6.js";
import "../../manifest-registry-GgUdfF-z.js";
import "../../chrome-D_KkCJSg.js";
import "../../frontmatter-DWd9059h.js";
import "../../skills-BvFD0bOH.js";
import "../../redact-BjQ9RIiE.js";
import "../../errors-CsoDC3nn.js";
import "../../store-ky6KaH78.js";
import "../../thinking-BL4QW4f_.js";
import "../../paths-sVMzHKNe.js";
import "../../tool-images-CtOU3chJ.js";
import "../../image-BmFSAvE-.js";
import "../../reply-prefix-s-amvIdP.js";
import "../../manager-CwO66W6N.js";
import "../../sqlite-CPRKTBsQ.js";
import "../../retry-CbF43Enn.js";
import "../../common-CwTPIosL.js";
import "../../chunk-DtdDplIz.js";
import "../../markdown-tables-C-noWIUe.js";
import "../../fetch-CcQo7_WG.js";
import "../../ir-DsCzfB8s.js";
import "../../render-B1VqYyvo.js";
import "../../commands-registry-CIu526kl.js";
import "../../runner-CXGqZawD.js";
import "../../skill-commands-Ckvhk2Ta.js";
import "../../send-B2L_LPsH.js";
import "../../outbound-attachment-JUDeu6dM.js";
import "../../send-Du8Lznij.js";
import "../../resolve-route-BeiG2DuB.js";
import "../../channel-activity-Ddq1rNcH.js";
import "../../tables-7IKeeakS.js";
import "../../proxy-Dvn2GZAo.js";
import "../../replies-IfYvl8C8.js";
import { generateSlugViaLLM } from "../../llm-slug-generator.js";
import { t as resolveHookConfig } from "../../config-juH0T5BE.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/bundled/session-memory/handler.ts
/**
* Session memory hook handler
*
* Saves session context to memory when /new command is triggered
* Creates a new dated memory file with LLM-generated slug
*/
const log = createSubsystemLogger("hooks/session-memory");
/**
* Read recent messages from session file for slug generation
*/
async function getRecentSessionContent(sessionFilePath, messageCount = 15) {
	try {
		const lines = (await fs.readFile(sessionFilePath, "utf-8")).trim().split("\n");
		const allMessages = [];
		for (const line of lines) try {
			const entry = JSON.parse(line);
			if (entry.type === "message" && entry.message) {
				const msg = entry.message;
				const role = msg.role;
				if ((role === "user" || role === "assistant") && msg.content) {
					if (role === "user" && hasInterSessionUserProvenance(msg)) continue;
					const text = Array.isArray(msg.content) ? msg.content.find((c) => c.type === "text")?.text : msg.content;
					if (text && !text.startsWith("/")) allMessages.push(`${role}: ${text}`);
				}
			}
		} catch {}
		return allMessages.slice(-messageCount).join("\n");
	} catch {
		return null;
	}
}
/**
* Save session context to memory when /new command is triggered
*/
const saveSessionToMemory = async (event) => {
	if (event.type !== "command" || event.action !== "new") return;
	try {
		log.debug("Hook triggered for /new command");
		const context = event.context || {};
		const cfg = context.cfg;
		const agentId = resolveAgentIdFromSessionKey(event.sessionKey);
		const workspaceDir = cfg ? resolveAgentWorkspaceDir(cfg, agentId) : path.join(resolveStateDir(process.env, os.homedir), "workspace");
		const memoryDir = path.join(workspaceDir, "memory");
		await fs.mkdir(memoryDir, { recursive: true });
		const now = new Date(event.timestamp);
		const dateStr = now.toISOString().split("T")[0];
		const sessionEntry = context.previousSessionEntry || context.sessionEntry || {};
		const currentSessionId = sessionEntry.sessionId;
		const currentSessionFile = sessionEntry.sessionFile;
		log.debug("Session context resolved", {
			sessionId: currentSessionId,
			sessionFile: currentSessionFile,
			hasCfg: Boolean(cfg)
		});
		const sessionFile = currentSessionFile || void 0;
		const hookConfig = resolveHookConfig(cfg, "session-memory");
		const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
		let slug = null;
		let sessionContent = null;
		if (sessionFile) {
			sessionContent = await getRecentSessionContent(sessionFile, messageCount);
			log.debug("Session content loaded", {
				length: sessionContent?.length ?? 0,
				messageCount
			});
			const allowLlmSlug = !(process.env.OPENCLAW_TEST_FAST === "1" || process.env.VITEST === "true" || process.env.VITEST === "1" || false) && hookConfig?.llmSlug !== false;
			if (sessionContent && cfg && allowLlmSlug) {
				log.debug("Calling generateSlugViaLLM...");
				slug = await generateSlugViaLLM({
					sessionContent,
					cfg
				});
				log.debug("Generated slug", { slug });
			}
		}
		if (!slug) {
			slug = now.toISOString().split("T")[1].split(".")[0].replace(/:/g, "").slice(0, 4);
			log.debug("Using fallback timestamp slug", { slug });
		}
		const filename = `${dateStr}-${slug}.md`;
		const memoryFilePath = path.join(memoryDir, filename);
		log.debug("Memory file path resolved", {
			filename,
			path: memoryFilePath.replace(os.homedir(), "~")
		});
		const timeStr = now.toISOString().split("T")[1].split(".")[0];
		const sessionId = sessionEntry.sessionId || "unknown";
		const source = context.commandSource || "unknown";
		const entryParts = [
			`# Session: ${dateStr} ${timeStr} UTC`,
			"",
			`- **Session Key**: ${event.sessionKey}`,
			`- **Session ID**: ${sessionId}`,
			`- **Source**: ${source}`,
			""
		];
		if (sessionContent) entryParts.push("## Conversation Summary", "", sessionContent, "");
		const entry = entryParts.join("\n");
		await fs.writeFile(memoryFilePath, entry, "utf-8");
		log.debug("Memory file written successfully");
		const relPath = memoryFilePath.replace(os.homedir(), "~");
		log.info(`Session context saved to ${relPath}`);
	} catch (err) {
		if (err instanceof Error) log.error("Failed to save session memory", {
			errorName: err.name,
			errorMessage: err.message,
			stack: err.stack
		});
		else log.error("Failed to save session memory", { error: String(err) });
	}
};

//#endregion
export { saveSessionToMemory as default };