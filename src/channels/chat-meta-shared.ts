<<<<<<< HEAD
import { listChannelCatalogEntries } from "../plugins/channel-catalog-registry.js";
import type { PluginPackageChannel } from "../plugins/manifest.js";
import { CHAT_CHANNEL_ORDER, type ChatChannelId } from "./ids.js";
import { resolveChannelExposure } from "./plugins/exposure.js";
import type { ChannelMeta } from "./plugins/types.js";

=======
/**
 * Built-in chat channel metadata builder.
 *
 * Converts bundled channel catalog entries into setup/status metadata records.
 */
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import type { PluginPackageChannel } from "../plugins/manifest.js";
import { listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read.js";
import { CHAT_CHANNEL_ORDER, type ChatChannelId } from "./ids.js";
import { buildManifestChannelMeta } from "./plugins/channel-meta.js";
import type { ChannelMeta } from "./plugins/types.core.js";

/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
>>>>>>> upstream/main
export type ChatChannelMeta = ChannelMeta;

const CHAT_CHANNEL_ID_SET = new Set<string>(CHAT_CHANNEL_ORDER);

function toChatChannelMeta(params: {
  id: ChatChannelId;
  channel: PluginPackageChannel;
}): ChatChannelMeta {
<<<<<<< HEAD
  const label = params.channel.label?.trim();
  if (!label) {
    throw new Error(`Missing label for bundled chat channel "${params.id}"`);
  }
  const exposure = resolveChannelExposure(params.channel);

  return {
    id: params.id,
    label,
    selectionLabel: params.channel.selectionLabel?.trim() || label,
    docsPath: params.channel.docsPath?.trim() || `/channels/${params.id}`,
    docsLabel: params.channel.docsLabel?.trim() || undefined,
    blurb: params.channel.blurb?.trim() || "",
    ...(params.channel.aliases?.length ? { aliases: params.channel.aliases } : {}),
    ...(params.channel.order !== undefined ? { order: params.channel.order } : {}),
    ...(params.channel.selectionDocsPrefix !== undefined
      ? { selectionDocsPrefix: params.channel.selectionDocsPrefix }
      : {}),
    ...(params.channel.selectionDocsOmitLabel !== undefined
      ? { selectionDocsOmitLabel: params.channel.selectionDocsOmitLabel }
      : {}),
    ...(params.channel.selectionExtras?.length
      ? { selectionExtras: params.channel.selectionExtras }
      : {}),
    ...(params.channel.detailLabel?.trim()
      ? { detailLabel: params.channel.detailLabel.trim() }
      : {}),
    ...(params.channel.systemImage?.trim()
      ? { systemImage: params.channel.systemImage.trim() }
      : {}),
    ...(params.channel.markdownCapable !== undefined
      ? { markdownCapable: params.channel.markdownCapable }
      : {}),
    exposure,
    ...(params.channel.quickstartAllowFrom !== undefined
      ? { quickstartAllowFrom: params.channel.quickstartAllowFrom }
      : {}),
    ...(params.channel.forceAccountBinding !== undefined
      ? { forceAccountBinding: params.channel.forceAccountBinding }
      : {}),
    ...(params.channel.preferSessionLookupForAnnounceTarget !== undefined
      ? {
          preferSessionLookupForAnnounceTarget: params.channel.preferSessionLookupForAnnounceTarget,
        }
      : {}),
    ...(params.channel.preferOver?.length ? { preferOver: params.channel.preferOver } : {}),
  };
=======
  const label = normalizeOptionalString(params.channel.label);
  if (!label) {
    throw new Error(`Missing label for bundled chat channel "${params.id}"`);
  }

  return buildManifestChannelMeta({
    id: params.id,
    channel: params.channel,
    label,
    selectionLabel: normalizeOptionalString(params.channel.selectionLabel) || label,
    docsPath: normalizeOptionalString(params.channel.docsPath) || `/channels/${params.id}`,
    docsLabel: normalizeOptionalString(params.channel.docsLabel),
    blurb: normalizeOptionalString(params.channel.blurb) || "",
    detailLabel: normalizeOptionalString(params.channel.detailLabel),
    systemImage: normalizeOptionalString(params.channel.systemImage),
    arrayFieldMode: "non-empty",
    selectionDocsPrefixMode: "defined",
  });
>>>>>>> upstream/main
}

export function buildChatChannelMetaById(): Record<ChatChannelId, ChatChannelMeta> {
  const entries = new Map<ChatChannelId, ChatChannelMeta>();

<<<<<<< HEAD
  for (const entry of listChannelCatalogEntries({ origin: "bundled" })) {
    const channel = entry.channel;
    if (!channel) {
      continue;
    }
    const rawId = channel?.id?.trim();
=======
  for (const entry of listBundledChannelCatalogEntries()) {
    // The catalog can contain non-chat bundled channels. Keep this map restricted to the
    // generated chat-channel order so setup/status views stay stable.
    const rawId = normalizeOptionalString(entry.id);
>>>>>>> upstream/main
    if (!rawId || !CHAT_CHANNEL_ID_SET.has(rawId)) {
      continue;
    }
    const id = rawId;
    entries.set(
      id,
      toChatChannelMeta({
        id,
<<<<<<< HEAD
        channel,
=======
        channel: entry.channel,
>>>>>>> upstream/main
      }),
    );
  }

  return Object.freeze(Object.fromEntries(entries)) as Record<ChatChannelId, ChatChannelMeta>;
}
