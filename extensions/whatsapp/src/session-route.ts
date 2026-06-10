// Whatsapp plugin module implements session route behavior.
import {
  buildChannelOutboundSessionRoute,
  type ChannelOutboundSessionRouteParams,
} from "openclaw/plugin-sdk/core";
<<<<<<< HEAD
import { isWhatsAppGroupJid, normalizeWhatsAppTarget } from "./normalize.js";
=======
import {
  isWhatsAppGroupJid,
  isWhatsAppNewsletterJid,
  normalizeWhatsAppTarget,
} from "./normalize.js";
>>>>>>> upstream/main

export function resolveWhatsAppOutboundSessionRoute(params: ChannelOutboundSessionRouteParams) {
  const normalized = normalizeWhatsAppTarget(params.target);
  if (!normalized) {
    return null;
  }
  const isGroup = isWhatsAppGroupJid(normalized);
  const isNewsletter = isWhatsAppNewsletterJid(normalized);
  const chatType = isGroup ? "group" : isNewsletter ? "channel" : "direct";
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "whatsapp",
    accountId: params.accountId,
    peer: {
      kind: chatType,
      id: normalized,
    },
    chatType,
    from: normalized,
    to: normalized,
  });
}
