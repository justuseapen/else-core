<<<<<<< HEAD
export {
  registerSessionBindingAdapter,
  __testing,
} from "../../../../src/infra/outbound/session-binding-service.js";
export { setActivePluginRegistry } from "../../../../src/plugins/runtime.js";
export { resolveAgentRoute } from "../../../../src/routing/resolve-route.js";
export { createTestRegistry } from "../../../../src/test-utils/channel-plugins.js";
export type { OpenClawConfig } from "../../../../src/config/config.js";
=======
// Matrix plugin module implements monitor route test support behavior.
export {
  registerSessionBindingAdapter,
  testing,
} from "openclaw/plugin-sdk/session-binding-runtime";
export { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
export {
  createTestRegistry,
  setActivePluginRegistry,
} from "openclaw/plugin-sdk/plugin-test-runtime";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
