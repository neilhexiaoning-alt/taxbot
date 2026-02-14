import { detectMime } from "../media/mime.js";
// Lazy-load pdfjs-dist so non-PDF paths don't require native installs.
let pdfJsModulePromise = null;
async function loadPdfJs() {
    if (!pdfJsModulePromise) {
        pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").catch((err) => {
            pdfJsModulePromise = null;
            throw err;
        });
    }
    return pdfJsModulePromise;
}
async function extractDocumentText(b64, mime, fileName) {
    // For text/plain and text/csv, just decode
    if (mime === "text/plain" || mime === "text/csv") {
        try {
            return Buffer.from(b64, "base64").toString("utf-8");
        }
        catch {
            return null;
        }
    }
    // For PDF, use pdfjs-dist text extraction
    if (mime === "application/pdf") {
        try {
            const pdfjs = await loadPdfJs();
            const buffer = Buffer.from(b64, "base64");
            const pdf = await pdfjs.getDocument({
                data: new Uint8Array(buffer),
                disableWorker: true,
            }).promise;
            const maxPages = Math.min(pdf.numPages, 20);
            const textParts = [];
            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => ("str" in item ? String(item.str) : ""))
                    .filter(Boolean)
                    .join(" ");
                if (pageText) {
                    textParts.push(`--- 第${pageNum}页 ---\n${pageText}`);
                }
            }
            if (textParts.length > 0) {
                return textParts.join("\n\n");
            }
            return null;
        }
        catch {
            return null;
        }
    }
    return null;
}
function normalizeMime(mime) {
    if (!mime) {
        return undefined;
    }
    const cleaned = mime.split(";")[0]?.trim().toLowerCase();
    return cleaned || undefined;
}
async function sniffMimeFromBase64(base64) {
    const trimmed = base64.trim();
    if (!trimmed) {
        return undefined;
    }
    const take = Math.min(256, trimmed.length);
    const sliceLen = take - (take % 4);
    if (sliceLen < 8) {
        return undefined;
    }
    try {
        const head = Buffer.from(trimmed.slice(0, sliceLen), "base64");
        return await detectMime({ buffer: head });
    }
    catch {
        return undefined;
    }
}
function isImageMime(mime) {
    return typeof mime === "string" && mime.startsWith("image/");
}
function isSupportedDocumentMime(mime) {
    if (!mime || typeof mime !== "string") {
        return false;
    }
    const supportedDocTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "text/csv",
    ];
    return supportedDocTypes.includes(mime);
}
function isSupportedAttachmentMime(mime) {
    return isImageMime(mime) || isSupportedDocumentMime(mime);
}
/**
 * Parse attachments and extract images and documents as structured content blocks.
 * Returns the message text, an array of image content blocks, and an array of document content blocks
 * compatible with Claude API's format.
 */
export async function parseMessageWithAttachments(message, attachments, opts) {
    const maxBytes = opts?.maxBytes ?? 5_000_000; // 5 MB
    const log = opts?.log;
    if (!attachments || attachments.length === 0) {
        return { message, images: [], documents: [] };
    }
    const images = [];
    const documents = [];
    for (const [idx, att] of attachments.entries()) {
        if (!att) {
            continue;
        }
        const mime = att.mimeType ?? "";
        const content = att.content;
        const label = att.fileName || att.type || `attachment-${idx + 1}`;
        if (typeof content !== "string") {
            throw new Error(`attachment ${label}: content must be base64 string`);
        }
        let sizeBytes = 0;
        let b64 = content.trim();
        // Strip data URL prefix if present (e.g., "data:image/jpeg;base64,...")
        const dataUrlMatch = /^data:[^;]+;base64,(.*)$/.exec(b64);
        if (dataUrlMatch) {
            b64 = dataUrlMatch[1];
        }
        // Basic base64 sanity: length multiple of 4 and charset check.
        if (b64.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(b64)) {
            throw new Error(`attachment ${label}: invalid base64 content`);
        }
        try {
            sizeBytes = Buffer.from(b64, "base64").byteLength;
        }
        catch {
            throw new Error(`attachment ${label}: invalid base64 content`);
        }
        if (sizeBytes <= 0 || sizeBytes > maxBytes) {
            throw new Error(`attachment ${label}: exceeds size limit (${sizeBytes} > ${maxBytes} bytes)`);
        }
        const providedMime = normalizeMime(mime);
        const sniffedMime = normalizeMime(await sniffMimeFromBase64(b64));
        // Check if it's a supported attachment type
        const finalMime = sniffedMime ?? providedMime ?? mime;
        if (isImageMime(finalMime)) {
            // Process as image
            if (sniffedMime && providedMime && sniffedMime !== providedMime) {
                log?.warn(`attachment ${label}: mime mismatch (${providedMime} -> ${sniffedMime}), using sniffed`);
            }
            images.push({
                type: "image",
                data: b64,
                mimeType: finalMime,
            });
        }
        else if (isSupportedDocumentMime(finalMime)) {
            // Process as document
            documents.push({
                type: "document",
                data: b64,
                mimeType: finalMime,
                fileName: att.fileName,
            });
            log?.warn(`attachment ${label}: document type detected (${finalMime}), will be passed as text context`);
        }
        else {
            // Unsupported type
            if (sniffedMime && !isSupportedAttachmentMime(sniffedMime)) {
                log?.warn(`attachment ${label}: unsupported type (${sniffedMime}), dropping`);
                continue;
            }
            if (!sniffedMime && !isSupportedAttachmentMime(providedMime)) {
                log?.warn(`attachment ${label}: unable to detect supported mime type, dropping`);
                continue;
            }
        }
    }
    // Extract text from documents and inline into message so models can read the content
    if (documents.length > 0) {
        const textBlocks = [];
        for (const doc of documents) {
            try {
                const text = await extractDocumentText(doc.data, doc.mimeType, doc.fileName);
                if (text && text.trim().length > 0) {
                    const label = doc.fileName ?? "document";
                    textBlocks.push(`\n\n【文件内容：${label}】\n${text}\n【文件结束】`);
                    log?.warn(`attachment ${label}: extracted ${text.length} chars of text`);
                }
                else {
                    log?.warn(`attachment ${doc.fileName ?? "document"}: no text extracted`);
                }
            }
            catch (err) {
                log?.warn(`attachment ${doc.fileName ?? "document"}: text extraction failed: ${String(err)}`);
            }
        }
        if (textBlocks.length > 0) {
            message = message + textBlocks.join("");
        }
    }
    return { message, images, documents };
}
/**
 * @deprecated Use parseMessageWithAttachments instead.
 * This function converts images to markdown data URLs which Claude API cannot process as images.
 */
export function buildMessageWithAttachments(message, attachments, opts) {
    const maxBytes = opts?.maxBytes ?? 2_000_000; // 2 MB
    if (!attachments || attachments.length === 0) {
        return message;
    }
    const blocks = [];
    for (const [idx, att] of attachments.entries()) {
        if (!att) {
            continue;
        }
        const mime = att.mimeType ?? "";
        const content = att.content;
        const label = att.fileName || att.type || `attachment-${idx + 1}`;
        if (typeof content !== "string") {
            throw new Error(`attachment ${label}: content must be base64 string`);
        }
        if (!mime.startsWith("image/")) {
            throw new Error(`attachment ${label}: only image/* supported`);
        }
        let sizeBytes = 0;
        const b64 = content.trim();
        // Basic base64 sanity: length multiple of 4 and charset check.
        if (b64.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(b64)) {
            throw new Error(`attachment ${label}: invalid base64 content`);
        }
        try {
            sizeBytes = Buffer.from(b64, "base64").byteLength;
        }
        catch {
            throw new Error(`attachment ${label}: invalid base64 content`);
        }
        if (sizeBytes <= 0 || sizeBytes > maxBytes) {
            throw new Error(`attachment ${label}: exceeds size limit (${sizeBytes} > ${maxBytes} bytes)`);
        }
        const safeLabel = label.replace(/\s+/g, "_");
        const dataUrl = `![${safeLabel}](data:${mime};base64,${content})`;
        blocks.push(dataUrl);
    }
    if (blocks.length === 0) {
        return message;
    }
    const separator = message.trim().length > 0 ? "\n\n" : "";
    return `${message}${separator}${blocks.join("\n\n")}`;
}
