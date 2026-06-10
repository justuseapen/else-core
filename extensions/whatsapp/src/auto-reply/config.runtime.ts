<<<<<<< HEAD
export {
  evaluateSessionFreshness,
  loadConfig,
  loadSessionStore,
  recordSessionMetaFromInbound,
  resolveChannelContextVisibilityMode,
  resolveChannelGroupPolicy,
  resolveChannelGroupRequireMention,
  resolveGroupSessionKey,
=======
// Whatsapp helper module supports config behavior.
export {
  evaluateSessionFreshness,
  loadSessionStore,
>>>>>>> upstream/main
  resolveSessionKey,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveStorePath,
  resolveThreadFlag,
  resolveChannelResetConfig,
  updateLastRoute,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/config-runtime";
=======
} from "openclaw/plugin-sdk/session-store-runtime";
export {
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
} from "openclaw/plugin-sdk/runtime-config-snapshot";
export { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
>>>>>>> upstream/main
