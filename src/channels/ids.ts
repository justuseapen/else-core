<<<<<<< HEAD
import { listChannelCatalogEntries } from "../plugins/channel-catalog-registry.js";

=======
/**
 * Built-in chat channel ids and aliases.
 *
 * Derives canonical ids from generated bundled channel metadata with runtime catalog fallback.
 */
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import { GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "../config/bundled-channel-config-metadata.generated.js";
import { listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read.js";

/**
 * Canonical chat channel id used by core routing, plugin config, and channel catalogs.
 */
>>>>>>> upstream/main
export type ChatChannelId = string;

type BundledChatChannelEntry = {
  id: ChatChannelId;
  aliases: readonly string[];
  order: number;
};

<<<<<<< HEAD
function normalizeChannelKey(raw?: string | null): string | undefined {
  const normalized = raw?.trim().toLowerCase();
  return normalized || undefined;
}

function listBundledChatChannelEntries(): BundledChatChannelEntry[] {
  return listChannelCatalogEntries({ origin: "bundled" })
    .flatMap(({ channel }) => {
      const id = normalizeChannelKey(channel.id);
      if (!id) {
        return [];
      }
      const aliases = (channel.aliases ?? [])
        .map((alias) => normalizeChannelKey(alias))
        .filter((alias): alias is string => Boolean(alias));
      return [
        {
          id,
          aliases,
          order: typeof channel.order === "number" ? channel.order : Number.MAX_SAFE_INTEGER,
        },
      ];
    })
=======
function listBundledChatChannelEntries(): BundledChatChannelEntry[] {
  return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false)
    .map((entry) => ({
      id: normalizeOptionalLowercaseString(entry.channelId) ?? entry.channelId,
      aliases: entry.aliases ?? [],
      order: entry.order ?? Number.MAX_SAFE_INTEGER,
    }))
>>>>>>> upstream/main
    .toSorted(
      (left, right) =>
        left.order - right.order || left.id.localeCompare(right.id, "en", { sensitivity: "base" }),
    );
}

const BUNDLED_CHAT_CHANNEL_ENTRIES = Object.freeze(listBundledChatChannelEntries());
const CHAT_CHANNEL_ID_SET = new Set(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
<<<<<<< HEAD

=======
let runtimeBundledChatChannelEntries: BundledChatChannelEntry[] | null = null;

/**
 * Stable built-in channel order derived from generated bundled channel metadata.
 */
>>>>>>> upstream/main
export const CHAT_CHANNEL_ORDER = Object.freeze(
  BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id),
);

<<<<<<< HEAD
export const CHANNEL_IDS = CHAT_CHANNEL_ORDER;

=======
/**
 * Alias retained for callers that still refer to chat channel ordering as channel ids.
 */
export const CHANNEL_IDS = CHAT_CHANNEL_ORDER;

/**
 * Maps configured built-in channel aliases to canonical chat channel ids.
 */
>>>>>>> upstream/main
export const CHAT_CHANNEL_ALIASES: Record<string, ChatChannelId> = Object.freeze(
  Object.fromEntries(
    BUNDLED_CHAT_CHANNEL_ENTRIES.flatMap((entry) =>
      entry.aliases.map((alias) => [alias, entry.id] as const),
    ),
  ),
) as Record<string, ChatChannelId>;

<<<<<<< HEAD
=======
/**
 * Lists configured built-in chat channel aliases.
 */
>>>>>>> upstream/main
export function listChatChannelAliases(): string[] {
  return Object.keys(CHAT_CHANNEL_ALIASES);
}

<<<<<<< HEAD
export function normalizeChatChannelId(raw?: string | null): ChatChannelId | null {
  const normalized = normalizeChannelKey(raw);
=======
function listRuntimeBundledChatChannelEntries(): BundledChatChannelEntry[] {
  // Generated metadata is the hot-path source. The runtime catalog fallback covers
  // dynamically registered bundled metadata without repeated catalog reads.
  runtimeBundledChatChannelEntries ??= listBundledChannelCatalogEntries().map((entry) => ({
    id: entry.id,
    aliases: entry.aliases,
    order: entry.order,
  }));
  return runtimeBundledChatChannelEntries;
}

function normalizeRuntimeBundledChatChannelId(normalized: string): ChatChannelId | null {
  for (const entry of listRuntimeBundledChatChannelEntries()) {
    if (entry.id === normalized || entry.aliases.includes(normalized)) {
      return entry.id;
    }
  }
  return null;
}

/**
 * Normalizes a raw chat channel id or alias to a known canonical built-in channel id.
 */
export function normalizeChatChannelId(raw?: string | null): ChatChannelId | null {
  const normalized = normalizeOptionalLowercaseString(raw);
>>>>>>> upstream/main
  if (!normalized) {
    return null;
  }
  const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
<<<<<<< HEAD
  return CHAT_CHANNEL_ID_SET.has(resolved) ? resolved : null;
=======
  return CHAT_CHANNEL_ID_SET.has(resolved)
    ? resolved
    : normalizeRuntimeBundledChatChannelId(normalized);
>>>>>>> upstream/main
}
