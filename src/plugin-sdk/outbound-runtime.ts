<<<<<<< HEAD
export { createRuntimeOutboundDelegates } from "../channels/plugins/runtime-forwarders.js";
export { resolveOutboundSendDep, type OutboundSendDeps } from "../infra/outbound/send-deps.js";
export { resolveAgentOutboundIdentity, type OutboundIdentity } from "../infra/outbound/identity.js";
export { sanitizeForPlainText } from "../infra/outbound/sanitize-text.js";
=======
/** @deprecated Compatibility subpath. Use `openclaw/plugin-sdk/channel-outbound`. */
export {
  buildOutboundSessionContext,
  createOutboundPayloadPlan,
  createReplyToFanout,
  createRuntimeOutboundDelegates,
  projectOutboundPayloadPlanForDelivery,
  resolveAgentOutboundIdentity,
  resolveOutboundSendDep,
  sanitizeForPlainText,
} from "./channel-outbound.js";
export type {
  OutboundDeliveryFormattingOptions,
  OutboundIdentity,
  OutboundSendDeps,
  OutboundSessionContext,
  ReplyToResolution,
} from "./channel-outbound.js";

/** @deprecated Direct outbound delivery is compatibility/runtime substrate. */
export { deliverOutboundPayloads } from "../infra/outbound/deliver.js";
/** @deprecated Direct outbound delivery params are compatibility/runtime substrate. */
export type { DeliverOutboundPayloadsParams } from "../infra/outbound/deliver.js";
export { type OutboundDeliveryResult } from "../infra/outbound/deliver.js";
>>>>>>> upstream/main
