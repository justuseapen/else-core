<<<<<<< HEAD
import { getActivePluginRegistry } from "../plugins/runtime.js";
import { getChatChannelMeta, listChatChannels, type ChatChannelMeta } from "./chat-meta.js";
import {
  CHANNEL_IDS,
  CHAT_CHANNEL_ALIASES,
  CHAT_CHANNEL_ORDER,
  listChatChannelAliases,
  normalizeChatChannelId,
  type ChatChannelId,
} from "./ids.js";
import type { ChannelId, ChannelMeta } from "./plugins/types.js";
export { CHANNEL_IDS, CHAT_CHANNEL_ORDER } from "./ids.js";
=======
// Public channel registry facade for channel ids, metadata, and setup copy.
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { normalizeChatChannelId, type ChatChannelId } from "./ids.js";
import type { ChannelId } from "./plugins/channel-id.types.js";
import type { ChannelMeta } from "./plugins/types.core.js";
import {
  findRegisteredChannelPluginEntry,
  findRegisteredChannelPluginEntryById,
  listRegisteredChannelPluginEntries,
} from "./registry-lookup.js";
export { getChatChannelMeta } from "./chat-meta.js";
export { CHAT_CHANNEL_ORDER } from "./ids.js";
>>>>>>> upstream/main
export type { ChatChannelId } from "./ids.js";
export { normalizeChatChannelId };

<<<<<<< HEAD
type RegisteredChannelPluginEntry = {
  plugin: {
    id?: string | null;
    meta?: Pick<ChannelMeta, "aliases" | "markdownCapable"> | null;
  };
};

function listRegisteredChannelPluginEntries(): RegisteredChannelPluginEntry[] {
  return getActivePluginRegistry()?.channels ?? [];
}

function findRegisteredChannelPluginEntry(
  normalizedKey: string,
): RegisteredChannelPluginEntry | undefined {
  return listRegisteredChannelPluginEntries().find((entry) => {
    const id = String(entry.plugin.id ?? "")
      .trim()
      .toLowerCase();
    if (id && id === normalizedKey) {
      return true;
    }
    return (entry.plugin.meta?.aliases ?? []).some(
      (alias) => alias.trim().toLowerCase() === normalizedKey,
    );
  });
}

function findRegisteredChannelPluginEntryById(
  id: string,
): RegisteredChannelPluginEntry | undefined {
  const normalizedId = normalizeChannelKey(id);
  if (!normalizedId) {
    return undefined;
  }
  return listRegisteredChannelPluginEntries().find(
    (entry) => normalizeChannelKey(entry.plugin.id) === normalizedId,
  );
}

const normalizeChannelKey = (raw?: string | null): string | undefined => {
  const normalized = raw?.trim().toLowerCase();
  return normalized || undefined;
};
export {
  CHAT_CHANNEL_ALIASES,
  getChatChannelMeta,
  listChatChannelAliases,
  listChatChannels,
  normalizeChatChannelId,
};

// Channel docking: prefer this helper in shared code. Importing from
// `src/channels/plugins/*` can eagerly load channel implementations.
=======
/**
 * Normalizes built-in chat channel ids without loading channel plugin implementations.
 */
>>>>>>> upstream/main
export function normalizeChannelId(raw?: string | null): ChatChannelId | null {
  return normalizeChatChannelId(raw);
}

/**
 * Normalizes any registered channel plugin id or alias after registry initialization.
 */
export function normalizeAnyChannelId(raw?: string | null): ChannelId | null {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return null;
  }
  return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}

/**
 * Lists registered channel plugin ids without importing their runtime implementations.
 */
export function listRegisteredChannelPluginIds(): ChannelId[] {
  return listRegisteredChannelPluginEntries().flatMap((entry) => {
    const id = normalizeOptionalString(entry.plugin.id);
    return id ? [id as ChannelId] : [];
  });
}

/**
 * Returns lightweight channel metadata used by message formatting and capability checks.
 */
export function getRegisteredChannelPluginMeta(
  id: string,
): Pick<ChannelMeta, "aliases" | "markdownCapable"> | null {
  return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}

<<<<<<< HEAD
export function getRegisteredChannelPluginMeta(
  id: string,
): Pick<ChannelMeta, "aliases" | "markdownCapable"> | null {
  return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}

export function formatChannelPrimerLine(meta: ChatChannelMeta): string {
=======
/**
 * Formats a concise channel primer line for setup/status flows.
 */
export function formatChannelPrimerLine(meta: ChannelMeta): string {
>>>>>>> upstream/main
  return `${meta.label}: ${meta.blurb}`;
}

/**
 * Formats a docs-aware channel selection line for interactive setup prompts.
 */
export function formatChannelSelectionLine(
  meta: ChannelMeta,
  docsLink: (path: string, label?: string) => string,
): string {
  const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
  const docsLabel = meta.docsLabel ?? meta.id;
  const docs = meta.selectionDocsOmitLabel
    ? docsLink(meta.docsPath)
    : docsLink(meta.docsPath, docsLabel);
  const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
  return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
