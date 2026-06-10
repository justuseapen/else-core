<<<<<<< HEAD
=======
// Feishu API module exposes the plugin public contract.
>>>>>>> upstream/main
export { feishuPlugin } from "./src/channel.js";
export { registerFeishuDocTools } from "./src/docx.js";
export { registerFeishuChatTools } from "./src/chat.js";
export { registerFeishuWikiTools } from "./src/wiki.js";
export { registerFeishuDriveTools } from "./src/drive.js";
export { registerFeishuPermTools } from "./src/perm.js";
export { registerFeishuBitableTools } from "./src/bitable.js";
export {
  handleFeishuSubagentDeliveryTarget,
  handleFeishuSubagentEnded,
  handleFeishuSubagentSpawning,
} from "./src/subagent-hooks.js";
<<<<<<< HEAD
export * from "./src/conversation-id.js";
export * from "./src/setup-core.js";
export * from "./src/setup-surface.js";
export * from "./src/thread-bindings.js";
export { __testing as feishuThreadBindingTesting } from "./src/thread-bindings.js";
=======
export {
  buildFeishuConversationId,
  buildFeishuModelOverrideParentCandidates,
  type FeishuGroupSessionScope,
  parseFeishuConversationId,
  parseFeishuDirectConversationId,
  parseFeishuTargetId,
} from "./src/conversation-id.js";
export { feishuSetupAdapter, setFeishuNamedAccountEnabled } from "./src/setup-core.js";
export { feishuSetupWizard, runFeishuLogin } from "./src/setup-surface.js";
export {
  testing as __testing,
  testing,
  createFeishuThreadBindingManager,
  getFeishuThreadBindingManager,
} from "./src/thread-bindings.js";
export { testing as feishuThreadBindingTesting } from "./src/thread-bindings.js";
export { createClackPrompter } from "openclaw/plugin-sdk/setup-runtime";
>>>>>>> upstream/main

export const feishuSessionBindingAdapterChannels = ["feishu"] as const;
