export type ChatAttachment = {
    type?: string;
    mimeType?: string;
    fileName?: string;
    content?: unknown;
};
export type ChatImageContent = {
    type: "image";
    data: string;
    mimeType: string;
};
export type ChatDocumentContent = {
    type: "document";
    data: string;
    mimeType: string;
    fileName?: string;
};
export type ChatAttachmentContent = ChatImageContent | ChatDocumentContent;
export type ParsedMessageWithImages = {
    message: string;
    images: ChatImageContent[];
    documents?: ChatDocumentContent[];
};
type AttachmentLog = {
    warn: (message: string) => void;
};
/**
 * Parse attachments and extract images and documents as structured content blocks.
 * Returns the message text, an array of image content blocks, and an array of document content blocks
 * compatible with Claude API's format.
 */
export declare function parseMessageWithAttachments(message: string, attachments: ChatAttachment[] | undefined, opts?: {
    maxBytes?: number;
    log?: AttachmentLog;
}): Promise<ParsedMessageWithImages>;
/**
 * @deprecated Use parseMessageWithAttachments instead.
 * This function converts images to markdown data URLs which Claude API cannot process as images.
 */
export declare function buildMessageWithAttachments(message: string, attachments: ChatAttachment[] | undefined, opts?: {
    maxBytes?: number;
}): string;
export {};
