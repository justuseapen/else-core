<<<<<<< HEAD
export { createFeishuThreadBindingManager } from "./src/thread-bindings.js";
export {
  collectRuntimeConfigAssignments,
  secretTargetRegistryEntries,
} from "./src/secret-contract.js";
export { messageActionTargetAliases } from "./src/message-action-contract.js";
=======
// Feishu API module exposes the plugin public contract.
export { collectFeishuSecurityAuditFindings } from "./src/security-audit.js";
export { messageActionTargetAliases } from "./src/message-action-contract.js";
export {
  buildFeishuConversationId,
  parseFeishuConversationId,
  parseFeishuDirectConversationId,
  parseFeishuTargetId,
} from "./src/conversation-id.js";
>>>>>>> upstream/main
