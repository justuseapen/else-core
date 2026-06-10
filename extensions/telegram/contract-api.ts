<<<<<<< HEAD
export { normalizeCompatibilityConfig, legacyConfigRules } from "./src/doctor-contract.js";
export {
  collectRuntimeConfigAssignments,
  secretTargetRegistryEntries,
} from "./src/secret-contract.js";
=======
// Telegram API module exposes the plugin public contract.
>>>>>>> upstream/main
export {
  TELEGRAM_COMMAND_NAME_PATTERN,
  normalizeTelegramCommandDescription,
  normalizeTelegramCommandName,
  resolveTelegramCustomCommands,
} from "./src/command-config.js";
export { parseTelegramTopicConversation } from "./src/topic-conversation.js";
export { singleAccountKeysToMove } from "./src/setup-contract.js";
<<<<<<< HEAD
=======
export { mergeTelegramAccountConfig } from "./src/accounts.js";
>>>>>>> upstream/main
export {
  buildCommandsPaginationKeyboard,
  buildTelegramModelsProviderChannelData,
} from "./src/command-ui.js";
export type {
  TelegramInteractiveHandlerContext,
  TelegramInteractiveHandlerRegistration,
} from "./src/interactive-dispatch.js";
<<<<<<< HEAD
export { collectTelegramSecurityAuditFindings } from "./src/security-audit.js";
=======
>>>>>>> upstream/main
