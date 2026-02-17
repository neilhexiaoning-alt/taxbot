import type { Bot } from "grammy";
import { type TelegramThreadSpec } from "./bot/helpers.js";
export type TelegramDraftStream = {
    update: (text: string) => void;
    flush: () => Promise<void>;
    messageId: () => number | undefined;
    clear: () => Promise<void>;
    stop: () => void;
};
export declare function createTelegramDraftStream(params: {
    api: Bot["api"];
    chatId: number;
    maxChars?: number;
    thread?: TelegramThreadSpec | null;
    throttleMs?: number;
    log?: (message: string) => void;
    warn?: (message: string) => void;
}): TelegramDraftStream;
