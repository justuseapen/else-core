<<<<<<< HEAD
=======
// Best-effort delivery helpers normalize optional external destinations and
// decide when a reply should stay session-only.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { stringifyRouteThreadId } from "../../plugin-sdk/channel-route.js";
>>>>>>> upstream/main
import {
  INTERNAL_MESSAGE_CHANNEL,
  isDeliverableMessageChannel,
  normalizeMessageChannel,
} from "../../utils/message-channel.js";

<<<<<<< HEAD
=======
/** Optional external destination for best-effort delivery from session-only flows. */
>>>>>>> upstream/main
export type ExternalBestEffortDeliveryTarget = {
  deliver: boolean;
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string;
};

<<<<<<< HEAD
=======
/** Normalizes an optional best-effort destination into a deliver/no-deliver decision. */
>>>>>>> upstream/main
export function resolveExternalBestEffortDeliveryTarget(params: {
  channel?: string | null;
  to?: string | null;
  accountId?: string | null;
  threadId?: string | number | null;
}): ExternalBestEffortDeliveryTarget {
  const normalizedChannel = normalizeMessageChannel(params.channel);
  const channel =
    normalizedChannel && isDeliverableMessageChannel(normalizedChannel)
      ? normalizedChannel
      : undefined;
<<<<<<< HEAD
  const to = typeof params.to === "string" && params.to.trim() ? params.to.trim() : undefined;
=======
  const to = normalizeOptionalString(params.to);
>>>>>>> upstream/main
  const deliver = Boolean(channel && to);
  return {
    deliver,
    channel: deliver ? channel : undefined,
    to: deliver ? to : undefined,
<<<<<<< HEAD
    accountId:
      deliver && typeof params.accountId === "string" && params.accountId.trim()
        ? params.accountId.trim()
        : undefined,
    threadId:
      deliver && params.threadId != null && params.threadId !== ""
        ? String(params.threadId)
=======
    accountId: deliver ? normalizeOptionalString(params.accountId) : undefined,
    threadId:
      deliver && params.threadId != null && params.threadId !== ""
        ? stringifyRouteThreadId(params.threadId)
>>>>>>> upstream/main
        : undefined,
  };
}

<<<<<<< HEAD
=======
/** Detects best-effort sends that should stay session-only on the internal channel. */
>>>>>>> upstream/main
export function shouldDowngradeDeliveryToSessionOnly(params: {
  wantsDelivery: boolean;
  bestEffortDeliver: boolean;
  resolvedChannel: string;
}): boolean {
  return (
    params.wantsDelivery &&
    params.bestEffortDeliver &&
    params.resolvedChannel === INTERNAL_MESSAGE_CHANNEL
  );
}
