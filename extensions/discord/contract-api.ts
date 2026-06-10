<<<<<<< HEAD
export { createThreadBindingManager } from "./src/monitor/thread-bindings.manager.js";
export { normalizeCompatibilityConfig, legacyConfigRules } from "./src/doctor-contract.js";
export {
  collectRuntimeConfigAssignments,
  secretTargetRegistryEntries,
} from "./src/secret-config-contract.js";
export {
  unsupportedSecretRefSurfacePatterns,
  collectUnsupportedSecretRefConfigCandidates,
} from "./src/security-contract.js";
=======
// Discord API module exposes the plugin public contract.
>>>>>>> upstream/main
export { deriveLegacySessionChatType } from "./src/session-contract.js";
export type {
  DiscordInteractiveHandlerContext,
  DiscordInteractiveHandlerRegistration,
} from "./src/interactive-dispatch.js";
<<<<<<< HEAD
export { collectDiscordSecurityAuditFindings } from "./src/security-audit.js";
=======
>>>>>>> upstream/main
