<<<<<<< HEAD
import type { ChatFullInfo, Message, UserFromGetMe } from "@grammyjs/types";
=======
// Telegram type declarations define plugin contracts.
import type { ChatFullInfo, Message, UserFromGetMe } from "grammy/types";
>>>>>>> upstream/main

/** App-specific stream mode for Telegram stream previews. */
export type TelegramStreamMode = "off" | "partial" | "block" | "progress";

type TelegramGetFile = () => Promise<{ file_path?: string }>;
export type TelegramChatDetails = {
  id?: number | string;
  available_reactions?: ChatFullInfo["available_reactions"] | null;
  is_forum?: boolean;
};
export type TelegramGetChat = (chatId: number | string) => Promise<TelegramChatDetails>;

export type TelegramGetFile = () => Promise<{ file_path?: string }>;
export type TelegramChatDetails = {
  id?: number | string;
  available_reactions?: ChatFullInfo["available_reactions"] | null;
  is_forum?: boolean;
};
export type TelegramGetChat = (chatId: number | string) => Promise<TelegramChatDetails>;

/**
 * Minimal context projection from Grammy's Context class.
 * Decouples the message processing pipeline from Grammy's full Context,
 * and allows constructing synthetic contexts for debounced/combined messages.
 */
export type TelegramContext = {
  message: Message;
  me?: UserFromGetMe;
  getFile: TelegramGetFile;
<<<<<<< HEAD
};

export type TelegramSyntheticContextSource = Pick<TelegramContext, "me"> & {
  getFile?: TelegramGetFile;
=======
>>>>>>> upstream/main
};

/** Telegram sticker metadata for context enrichment and caching. */
export interface StickerMetadata {
  /** Emoji associated with the sticker. */
  emoji?: string;
  /** Name of the sticker set the sticker belongs to. */
  setName?: string;
  /** Telegram file_id for sending the sticker back. */
  fileId?: string;
  /** Stable file_unique_id for cache deduplication. */
  fileUniqueId?: string;
  /** Cached description from previous vision processing (skip re-processing if present). */
  cachedDescription?: string;
}
