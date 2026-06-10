<<<<<<< HEAD
export type DeliveryContext = {
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
};

type DeliveryContextSource = {
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  origin?: {
    provider?: string;
    accountId?: string;
    threadId?: string | number;
  };
  deliveryContext?: DeliveryContext;
};

function normalizeChannel(raw?: string): string | undefined {
  const value = raw?.trim().toLowerCase();
  return value || undefined;
}

function normalizeText(raw?: string): string | undefined {
  const value = raw?.trim();
  return value || undefined;
}

function normalizeThreadId(raw?: string | number): string | number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.trunc(raw);
  }
  if (typeof raw === "string") {
    const value = raw.trim();
    return value || undefined;
  }
  return undefined;
}

function normalizeDeliveryContext(context?: DeliveryContext): DeliveryContext | undefined {
  if (!context) {
    return undefined;
  }
  const normalized: DeliveryContext = {
    channel: normalizeChannel(context.channel),
    to: normalizeText(context.to),
    accountId: normalizeText(context.accountId),
  };
  const threadId = normalizeThreadId(context.threadId);
  if (threadId != null) {
    normalized.threadId = threadId;
  }
  if (
    !normalized.channel &&
    !normalized.to &&
    !normalized.accountId &&
    normalized.threadId == null
  ) {
    return undefined;
  }
  return normalized;
}

function mergeDeliveryContext(
  primary?: DeliveryContext,
  fallback?: DeliveryContext,
): DeliveryContext | undefined {
  const normalizedPrimary = normalizeDeliveryContext(primary);
  const normalizedFallback = normalizeDeliveryContext(fallback);
  if (!normalizedPrimary && !normalizedFallback) {
    return undefined;
  }
  const channelsConflict =
    normalizedPrimary?.channel &&
    normalizedFallback?.channel &&
    normalizedPrimary.channel !== normalizedFallback.channel;
  return normalizeDeliveryContext({
    channel: normalizedPrimary?.channel ?? normalizedFallback?.channel,
    to: channelsConflict
      ? normalizedPrimary?.to
      : (normalizedPrimary?.to ?? normalizedFallback?.to),
    accountId: channelsConflict
      ? normalizedPrimary?.accountId
      : (normalizedPrimary?.accountId ?? normalizedFallback?.accountId),
    threadId: channelsConflict
      ? normalizedPrimary?.threadId
      : (normalizedPrimary?.threadId ?? normalizedFallback?.threadId),
  });
}

function deliveryContextFromSession(entry?: DeliveryContextSource): DeliveryContext | undefined {
  if (!entry) {
    return undefined;
  }
  return normalizeDeliveryContext({
    channel:
      entry.deliveryContext?.channel ??
      entry.lastChannel ??
      entry.channel ??
      entry.origin?.provider,
    to: entry.deliveryContext?.to ?? entry.lastTo,
    accountId: entry.deliveryContext?.accountId ?? entry.lastAccountId ?? entry.origin?.accountId,
    threadId: entry.deliveryContext?.threadId ?? entry.lastThreadId ?? entry.origin?.threadId,
  });
}

function isInternalMessageChannel(raw?: string): boolean {
  return normalizeChannel(raw) === "webchat";
}

function normalizeTelegramAnnounceTarget(target: string | undefined): string | undefined {
  const trimmed = target?.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.startsWith("group:")) {
    return `telegram:${trimmed.slice("group:".length)}`;
  }
  if (!trimmed.startsWith("telegram:")) {
    return undefined;
  }
  const raw = trimmed.slice("telegram:".length);
  const topicMatch = /^(.*):topic:[^:]+$/u.exec(raw);
  return `telegram:${topicMatch?.[1] ?? raw}`;
=======
/**
 * Subagent announcement origin resolver.
 *
 * Merges requester and session delivery context while avoiding stale thread ids after retargeting.
 */
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { getLoadedChannelPluginForRead } from "../channels/plugins/registry-loaded-read.js";
import type { ChannelId } from "../channels/plugins/types.public.js";
import {
  stripTargetKindPrefix,
  stripTargetProviderPrefix,
  stripTargetTopicSuffix,
} from "../infra/outbound/channel-target-prefix.js";
import {
  deliveryContextFromSession,
  mergeDeliveryContext,
  normalizeDeliveryContext,
} from "../utils/delivery-context.shared.js";
import type {
  DeliveryContext,
  DeliveryContextSessionSource,
} from "../utils/delivery-context.types.js";
import { isInternalMessageChannel } from "../utils/message-channel.js";
export type { DeliveryContext } from "../utils/delivery-context.types.js";

function normalizeAnnounceRouteTarget(context?: DeliveryContext): string | undefined {
  const rawTo = normalizeOptionalString(context?.to);
  if (!rawTo) {
    return undefined;
  }
  const channel = normalizeOptionalString(context?.channel);
  const messaging = channel
    ? getLoadedChannelPluginForRead(channel as ChannelId)?.messaging
    : undefined;
  const route = stripTargetTopicSuffix(
    stripTargetKindPrefix(stripTargetProviderPrefix(rawTo, channel ?? ""), ["group", "channel"]),
  );
  const normalized = messaging?.normalizeTarget?.(route) ?? route;
  return normalized || undefined;
>>>>>>> upstream/main
}

function shouldStripThreadFromAnnounceEntry(
  normalizedRequester?: DeliveryContext,
  normalizedEntry?: DeliveryContext,
): boolean {
  if (
    !normalizedRequester?.to ||
    normalizedRequester.threadId != null ||
    normalizedEntry?.threadId == null
  ) {
    return false;
  }
<<<<<<< HEAD
  const requesterChannel = normalizeChannel(normalizedRequester.channel);
  if (requesterChannel === "telegram") {
    const requesterTarget = normalizeTelegramAnnounceTarget(normalizedRequester.to);
    const entryTarget = normalizeTelegramAnnounceTarget(normalizedEntry?.to);
    if (requesterTarget && entryTarget) {
      return requesterTarget !== entryTarget;
    }
=======
  const requesterTarget = normalizeAnnounceRouteTarget(normalizedRequester);
  const entryTarget = normalizeAnnounceRouteTarget(normalizedEntry);
  if (requesterTarget && entryTarget) {
    return requesterTarget !== entryTarget;
>>>>>>> upstream/main
  }
  return false;
}

<<<<<<< HEAD
export function resolveAnnounceOrigin(
  entry?: DeliveryContextSource,
=======
/** Resolve the delivery origin for a subagent completion announcement. */
export function resolveAnnounceOrigin(
  entry?: DeliveryContextSessionSource,
>>>>>>> upstream/main
  requesterOrigin?: DeliveryContext,
): DeliveryContext | undefined {
  const normalizedRequester = normalizeDeliveryContext(requesterOrigin);
  const normalizedEntry = deliveryContextFromSession(entry);
  if (normalizedRequester?.channel && isInternalMessageChannel(normalizedRequester.channel)) {
    return mergeDeliveryContext(
      {
        accountId: normalizedRequester.accountId,
        threadId: normalizedRequester.threadId,
      },
      normalizedEntry,
    );
  }
  const entryForMerge =
    normalizedEntry && shouldStripThreadFromAnnounceEntry(normalizedRequester, normalizedEntry)
      ? (() => {
<<<<<<< HEAD
=======
          // A stored thread only applies to the same normalized route target.
>>>>>>> upstream/main
          const { threadId: _ignore, ...rest } = normalizedEntry;
          return rest;
        })()
      : normalizedEntry;
  return mergeDeliveryContext(normalizedRequester, entryForMerge);
}
