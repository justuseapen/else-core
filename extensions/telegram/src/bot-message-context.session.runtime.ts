<<<<<<< HEAD
export { readSessionUpdatedAt, resolveStorePath } from "openclaw/plugin-sdk/config-runtime";
export { recordInboundSession } from "openclaw/plugin-sdk/conversation-runtime";
export { finalizeInboundContext } from "openclaw/plugin-sdk/reply-dispatch-runtime";
=======
// Telegram plugin module implements bot message context.session behavior.
export { buildChannelInboundEventContext } from "openclaw/plugin-sdk/channel-inbound";
export { readSessionUpdatedAt, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
export { recordInboundSession } from "openclaw/plugin-sdk/conversation-runtime";
>>>>>>> upstream/main
export { resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
export { resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
