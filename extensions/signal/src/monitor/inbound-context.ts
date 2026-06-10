<<<<<<< HEAD
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/config-runtime";
import {
  evaluateSupplementalContextVisibility,
  type ContextVisibilityDecision,
} from "openclaw/plugin-sdk/security-runtime";
=======
// Signal plugin module implements inbound context behavior.
import { filterChannelInboundQuoteContext } from "openclaw/plugin-sdk/channel-inbound";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
import type { ContextVisibilityDecision } from "openclaw/plugin-sdk/security-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import {
  formatSignalSenderDisplay,
  isSignalSenderAllowed,
  resolveSignalSender,
} from "../identity.js";
import type { SignalDataMessage } from "./event-handler.types.js";

<<<<<<< HEAD
export type SignalQuoteContext = {
=======
type SignalQuoteContext = {
>>>>>>> upstream/main
  contextVisibilityMode: ReturnType<typeof resolveChannelContextVisibilityMode>;
  decision: ContextVisibilityDecision;
  quoteSenderAllowed: boolean;
  visibleQuoteText: string;
  visibleQuoteSender?: string;
};

export function resolveSignalQuoteContext(params: {
  cfg: Parameters<typeof resolveChannelContextVisibilityMode>[0]["cfg"];
  accountId: string;
  isGroup: boolean;
  dataMessage?: SignalDataMessage | null;
  effectiveGroupAllow: string[];
}): SignalQuoteContext {
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg: params.cfg,
    channel: "signal",
    accountId: params.accountId,
  });
<<<<<<< HEAD
  const quoteText = params.dataMessage?.quote?.text?.trim() ?? "";
=======
  const quoteText = normalizeOptionalString(params.dataMessage?.quote?.text) ?? "";
>>>>>>> upstream/main
  const quoteSender = resolveSignalSender({
    sourceNumber: params.dataMessage?.quote?.author ?? null,
    sourceUuid: params.dataMessage?.quote?.authorUuid ?? null,
  });
  const quoteSenderAllowed =
    !params.isGroup || params.effectiveGroupAllow.length === 0
      ? true
      : quoteSender
        ? isSignalSenderAllowed(quoteSender, params.effectiveGroupAllow)
        : false;
<<<<<<< HEAD
  const decision = evaluateSupplementalContextVisibility({
    mode: contextVisibilityMode,
    kind: "quote",
    senderAllowed: quoteSenderAllowed,
  });
=======
  const visibleQuote = filterChannelInboundQuoteContext(contextVisibilityMode, {
    body: quoteText,
    sender: quoteSender ? formatSignalSenderDisplay(quoteSender) : undefined,
    senderAllowed: quoteSenderAllowed,
    isQuote: true,
  });
  const decision: ContextVisibilityDecision = {
    include: Boolean(visibleQuote),
    reason: visibleQuote
      ? contextVisibilityMode === "all"
        ? "mode_all"
        : quoteSenderAllowed
          ? "sender_allowed"
          : "quote_override"
      : "blocked",
  };
>>>>>>> upstream/main

  return {
    contextVisibilityMode,
    decision,
    quoteSenderAllowed,
<<<<<<< HEAD
    visibleQuoteText: decision.include ? quoteText : "",
    visibleQuoteSender:
      decision.include && quoteSender ? formatSignalSenderDisplay(quoteSender) : undefined,
=======
    visibleQuoteText: visibleQuote?.body ?? "",
    visibleQuoteSender: visibleQuote?.sender,
>>>>>>> upstream/main
  };
}
