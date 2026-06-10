<<<<<<< HEAD
export { resolveMentionGating } from "openclaw/plugin-sdk/channel-inbound";
export { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
export { recordPendingHistoryEntryIfEnabled } from "openclaw/plugin-sdk/reply-history";
export { parseActivationCommand } from "openclaw/plugin-sdk/reply-runtime";
=======
// Whatsapp plugin module implements group gating behavior.
export {
  implicitMentionKindWhen,
  resolveInboundMentionDecision,
} from "openclaw/plugin-sdk/channel-mention-gating";
export { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
export { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
export { parseActivationCommand } from "openclaw/plugin-sdk/group-activation";
>>>>>>> upstream/main
export { normalizeE164 } from "../../text-runtime.js";
