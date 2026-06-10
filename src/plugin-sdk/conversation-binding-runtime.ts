<<<<<<< HEAD
=======
/**
 * Runtime SDK subpath for conversation binding routes and session binding records.
 */
>>>>>>> upstream/main
export {
  ensureConfiguredBindingRouteReady,
  resolveConfiguredBindingRoute,
  type ConfiguredBindingRouteResult,
<<<<<<< HEAD
=======
  resolveRuntimeConversationBindingRoute,
  type RuntimeConversationBindingRouteResult,
>>>>>>> upstream/main
} from "../channels/plugins/binding-routing.js";
export {
  type SessionBindingRecord,
  getSessionBindingService,
} from "../infra/outbound/session-binding-service.js";
export { isPluginOwnedSessionBindingRecord } from "../plugins/conversation-binding.js";
export { buildPairingReply } from "../pairing/pairing-messages.js";
