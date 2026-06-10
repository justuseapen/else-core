<<<<<<< HEAD
import { getChannelPlugin, normalizeChannelId } from "../../channels/plugins/index.js";

export function extractExplicitGroupId(raw: string | undefined | null): string | undefined {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return undefined;
  }
  const parts = trimmed.split(":").filter(Boolean);
  if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) {
    const joined = parts.slice(2).join(":");
    return joined.replace(/:topic:.*$/, "") || undefined;
  }
  if (parts.length >= 2 && (parts[0] === "group" || parts[0] === "channel")) {
    const joined = parts.slice(1).join(":");
    return joined.replace(/:topic:.*$/, "") || undefined;
  }
  const channelId = normalizeChannelId(parts[0] ?? "") ?? parts[0]?.trim().toLowerCase();
  const parsed = channelId
    ? getChannelPlugin(channelId)?.messaging?.parseExplicitTarget?.({ raw: trimmed })
    : null;
  if (parsed && parsed.chatType && parsed.chatType !== "direct") {
    return parsed.to.replace(/:topic:.*$/, "") || undefined;
=======
/** Extracts group/channel ids from explicit message targets. */
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { uniqueStrings } from "@openclaw/normalization-core/string-normalization";
import { getLoadedChannelPluginForRead } from "../../channels/plugins/registry-loaded-read.js";
import type { ChannelMessagingAdapter } from "../../channels/plugins/types.public.js";
import { normalizeAnyChannelId } from "../../channels/registry.js";
import {
  stripTargetKindPrefix,
  stripTargetProviderPrefix,
  stripTargetTopicSuffix,
} from "../../infra/outbound/channel-target-prefix.js";
import { extractSimpleExplicitGroupId } from "./group-id-simple.js";

function extractInferredGroupTargetId(params: {
  raw: string;
  channelId: string;
  messaging?: ChannelMessagingAdapter;
}): string | undefined {
  const normalized = params.messaging?.normalizeTarget?.(params.raw);
  const candidates = uniqueStrings(
    [normalized, params.raw].filter((candidate): candidate is string => Boolean(candidate)),
  );
  for (const candidate of candidates) {
    const chatType = params.messaging?.inferTargetChatType?.({ to: candidate });
    if (chatType === "direct" || chatType == null) {
      continue;
    }
    const target = stripTargetTopicSuffix(
      stripTargetKindPrefix(stripTargetProviderPrefix(candidate, params.channelId), [
        "group",
        "channel",
        "conversation",
        "room",
        "thread",
      ]),
      { allowNumericShorthand: params.channelId === "telegram" },
    );
    if (target) {
      return target;
    }
>>>>>>> upstream/main
  }
  return undefined;
}

function extractLegacyParsedGroupTargetId(params: {
  raw: string;
  channelId: string;
  messaging?: ChannelMessagingAdapter;
}): string | undefined {
  const parsed = params.messaging?.parseExplicitTarget?.({ raw: params.raw });
  if (parsed?.chatType === "direct" || parsed?.chatType == null) {
    return undefined;
  }
  const target = stripTargetTopicSuffix(
    stripTargetKindPrefix(stripTargetProviderPrefix(parsed.to, params.channelId), [
      "group",
      "channel",
      "conversation",
      "room",
      "thread",
    ]),
    { allowNumericShorthand: params.channelId === "telegram" },
  );
  return target || undefined;
}

/** Extracts a group/channel target id from explicit channel target syntax. */
export function extractExplicitGroupId(raw: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalString(raw) ?? "";
  if (!trimmed) {
    return undefined;
  }
  const simple = extractSimpleExplicitGroupId(trimmed);
  if (simple) {
    return simple;
  }
  const firstPart = trimmed.split(":").find(Boolean);
  const channelId =
    normalizeAnyChannelId(firstPart ?? "") ?? normalizeOptionalLowercaseString(firstPart);
  const messaging = channelId ? getLoadedChannelPluginForRead(channelId)?.messaging : undefined;
  if (!channelId) {
    return undefined;
  }
  return (
    extractInferredGroupTargetId({
      raw: trimmed,
      channelId,
      messaging,
    }) ??
    extractLegacyParsedGroupTargetId({
      raw: trimmed,
      channelId,
      messaging,
    })
  );
}
