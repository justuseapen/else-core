<<<<<<< HEAD
import {
  comparableChannelTargetsShareRoute,
  parseExplicitTargetForChannel,
  resolveComparableTargetForChannel,
} from "../../channels/plugins/target-parsing.js";
import type { ChannelOutboundTargetMode } from "../../channels/plugins/types.js";
import type { SessionEntry } from "../../config/sessions.js";
import { deliveryContextFromSession } from "../../utils/delivery-context.js";
import type {
  DeliverableMessageChannel,
  GatewayMessageChannel,
} from "../../utils/message-channel.js";
import {
  isDeliverableMessageChannel,
  normalizeMessageChannel,
} from "../../utils/message-channel.js";

=======
// Session target resolution chooses the effective channel, destination,
// account, and thread from explicit input, turn source, or session history.
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
  normalizeOptionalThreadValue,
} from "@openclaw/normalization-core/string-coerce";
import { resolveExplicitDeliveryTargetCompat } from "../../channels/plugins/target-parsing-loaded.js";
import type { ChannelOutboundTargetMode } from "../../channels/plugins/types.public.js";
import type { SessionEntry } from "../../config/sessions.js";
import { channelRouteTargetsShareConversation } from "../../plugin-sdk/channel-route.js";
import { deliveryContextFromSession } from "../../utils/delivery-context.shared.js";
import {
  isDeliverableMessageChannel,
  normalizeMessageChannel,
} from "../../utils/message-channel-core.js";
import type {
  DeliverableMessageChannel,
  GatewayMessageChannel,
} from "../../utils/message-channel-normalize.js";
import { resolveTargetPrefixedChannel } from "./channel-target-prefix.js";

/**
 * Resolved delivery destination derived from session history, turn source, or explicit input.
 */
>>>>>>> upstream/main
export type SessionDeliveryTarget = {
  channel?: DeliverableMessageChannel;
  to?: string;
  accountId?: string;
  threadId?: string | number;
<<<<<<< HEAD
  /** Whether threadId came from an explicit source (config/param/:topic: parsing) vs session history. */
  threadIdExplicit?: boolean;
=======
  threadIdSource?: "explicit" | "session" | "turn-source";
>>>>>>> upstream/main
  mode: ChannelOutboundTargetMode;
  lastChannel?: DeliverableMessageChannel;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
};

<<<<<<< HEAD
function parseExplicitTargetWithPlugin(params: {
  channel?: DeliverableMessageChannel;
  fallbackChannel?: DeliverableMessageChannel;
  raw?: string;
}) {
  const raw = params.raw?.trim();
  if (!raw) {
    return null;
  }
  const provider = params.channel ?? params.fallbackChannel;
  if (!provider) {
    return null;
  }
  return parseExplicitTargetForChannel(provider, raw);
}

=======
function resolveParsedRouteTarget(params: {
  channel: string;
  rawTarget?: string | null;
  fallbackThreadId?: string | number | null;
}) {
  const channel = normalizeLowercaseStringOrEmpty(params.channel);
  const rawTo = normalizeOptionalString(params.rawTarget);
  if (!channel || !rawTo) {
    return null;
  }
  const parsed = resolveExplicitDeliveryTargetCompat({
    channel,
    rawTarget: rawTo,
    fallbackThreadId: params.fallbackThreadId,
  });
  const threadId = normalizeOptionalThreadValue(parsed?.threadId ?? params.fallbackThreadId);
  return {
    channel,
    rawTo,
    to: parsed?.to ?? rawTo,
    ...(threadId != null ? { threadId } : {}),
    chatType: parsed?.chatType,
  };
}

/**
 * Resolves the effective outbound target for a session-scoped delivery request.
 */
>>>>>>> upstream/main
export function resolveSessionDeliveryTarget(params: {
  entry?: SessionEntry;
  requestedChannel?: GatewayMessageChannel;
  explicitTo?: string;
  explicitThreadId?: string | number;
  fallbackChannel?: DeliverableMessageChannel;
  allowMismatchedLastTo?: boolean;
  mode?: ChannelOutboundTargetMode;
  /**
   * When set, this overrides the session-level `lastChannel` for "last"
   * resolution. This prevents cross-channel reply routing when multiple
   * channels share the same session and an inbound message updates `lastChannel`
   * while an agent turn is still in flight.
   */
  turnSourceChannel?: DeliverableMessageChannel;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
}): SessionDeliveryTarget {
  const context = deliveryContextFromSession(params.entry);
  const sessionLastChannel =
    context?.channel && isDeliverableMessageChannel(context.channel) ? context.channel : undefined;
  const parsedSessionTarget = sessionLastChannel
<<<<<<< HEAD
    ? resolveComparableTargetForChannel({
=======
    ? resolveParsedRouteTarget({
>>>>>>> upstream/main
        channel: sessionLastChannel,
        rawTarget: context?.to,
        fallbackThreadId: context?.threadId,
      })
    : null;

  const hasTurnSourceChannel = params.turnSourceChannel != null;
  const parsedTurnSourceTarget =
    hasTurnSourceChannel && params.turnSourceChannel
<<<<<<< HEAD
      ? resolveComparableTargetForChannel({
=======
      ? resolveParsedRouteTarget({
>>>>>>> upstream/main
          channel: params.turnSourceChannel,
          rawTarget: params.turnSourceTo,
          fallbackThreadId: params.turnSourceThreadId,
        })
      : null;
  const hasTurnSourceThreadId = parsedTurnSourceTarget?.threadId != null;
  const lastChannel = hasTurnSourceChannel ? params.turnSourceChannel : sessionLastChannel;
<<<<<<< HEAD
  const lastTo = hasTurnSourceChannel ? params.turnSourceTo : context?.to;
=======
  const lastTo = hasTurnSourceChannel
    ? (parsedTurnSourceTarget?.to ?? params.turnSourceTo)
    : (parsedSessionTarget?.to ?? context?.to);
>>>>>>> upstream/main
  const lastAccountId = hasTurnSourceChannel ? params.turnSourceAccountId : context?.accountId;
  const turnToMatchesSession =
    !params.turnSourceTo ||
    !context?.to ||
    (params.turnSourceChannel === sessionLastChannel &&
<<<<<<< HEAD
      comparableChannelTargetsShareRoute({
        left: parsedTurnSourceTarget,
        right: parsedSessionTarget,
      }));
=======
      channelRouteTargetsShareConversation({
        left: parsedTurnSourceTarget,
        right: parsedSessionTarget,
      }));
  // Shared sessions can receive cross-channel updates mid-turn; only inherit session threads
  // when the turn source still identifies the same conversation.
>>>>>>> upstream/main
  const lastThreadId = hasTurnSourceThreadId
    ? parsedTurnSourceTarget?.threadId
    : hasTurnSourceChannel &&
        (params.turnSourceChannel !== sessionLastChannel || !turnToMatchesSession)
      ? undefined
      : parsedSessionTarget?.threadId;

  const rawRequested = params.requestedChannel ?? "last";
  const requested = rawRequested === "last" ? "last" : normalizeMessageChannel(rawRequested);
  const requestedChannel =
    requested === "last"
      ? "last"
      : requested && isDeliverableMessageChannel(requested)
        ? requested
        : undefined;

  const rawExplicitTo =
    typeof params.explicitTo === "string" && params.explicitTo.trim()
      ? params.explicitTo.trim()
      : undefined;

<<<<<<< HEAD
  let channel = requestedChannel === "last" ? lastChannel : requestedChannel;
=======
  const explicitPrefixedChannel =
    requestedChannel === "last" ? resolveTargetPrefixedChannel(rawExplicitTo) : undefined;
  let channel =
    explicitPrefixedChannel && isDeliverableMessageChannel(explicitPrefixedChannel)
      ? explicitPrefixedChannel
      : requestedChannel === "last"
        ? lastChannel
        : requestedChannel;
>>>>>>> upstream/main
  if (!channel && params.fallbackChannel && isDeliverableMessageChannel(params.fallbackChannel)) {
    channel = params.fallbackChannel;
  }

<<<<<<< HEAD
  let explicitTo = rawExplicitTo;
  const parsedExplicitTarget = parseExplicitTargetWithPlugin({
    channel,
    fallbackChannel: !channel ? lastChannel : undefined,
    raw: rawExplicitTo,
  });
  if (parsedExplicitTarget?.to) {
    explicitTo = parsedExplicitTarget.to;
  }
  const explicitThreadId =
    params.explicitThreadId != null && params.explicitThreadId !== ""
      ? params.explicitThreadId
      : parsedExplicitTarget?.threadId;
=======
  const parsedExplicitTarget =
    channel && rawExplicitTo
      ? resolveExplicitDeliveryTargetCompat({
          channel,
          rawTarget: rawExplicitTo,
          fallbackThreadId: params.explicitThreadId,
        })
      : null;
  const explicitTo = parsedExplicitTarget?.to ?? rawExplicitTo;
  const explicitThreadId = normalizeOptionalThreadValue(
    parsedExplicitTarget?.threadId ?? params.explicitThreadId,
  );
  const explicitThreadIdSource = explicitThreadId != null ? "explicit" : undefined;
>>>>>>> upstream/main

  let to = explicitTo;
  if (!to && lastTo) {
    if (channel && channel === lastChannel) {
      to = lastTo;
    } else if (params.allowMismatchedLastTo) {
      to = lastTo;
    }
  }

  const mode = params.mode ?? (explicitTo ? "explicit" : "implicit");
  const accountId = channel && channel === lastChannel ? lastAccountId : undefined;
  const threadId =
    channel && channel === lastChannel
      ? mode === "heartbeat"
        ? hasTurnSourceThreadId
          ? params.turnSourceThreadId
          : undefined
        : lastThreadId
      : undefined;

<<<<<<< HEAD
=======
  const inheritedThreadIdSource =
    threadId != null ? (hasTurnSourceThreadId ? "turn-source" : "session") : undefined;
>>>>>>> upstream/main
  const resolvedThreadId = explicitThreadId ?? threadId;
  return {
    channel,
    to,
    accountId,
    threadId: resolvedThreadId,
<<<<<<< HEAD
    threadIdExplicit: resolvedThreadId != null && explicitThreadId != null,
=======
    threadIdSource: explicitThreadIdSource ?? inheritedThreadIdSource,
>>>>>>> upstream/main
    mode,
    lastChannel,
    lastTo,
    lastAccountId,
    lastThreadId,
  };
}
