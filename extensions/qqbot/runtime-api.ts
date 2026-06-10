<<<<<<< HEAD
export type { ChannelPlugin, OpenClawPluginApi, PluginRuntime } from "openclaw/plugin-sdk/core";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
// Qqbot API module exposes the plugin public contract.
export type { ChannelPlugin, OpenClawPluginApi, PluginRuntime } from "openclaw/plugin-sdk/core";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
export type {
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "openclaw/plugin-sdk/core";
export type { ResolvedQQBotAccount, QQBotAccountConfig } from "./src/types.js";
<<<<<<< HEAD
export { getQQBotRuntime, setQQBotRuntime } from "./src/runtime.js";
=======
export { getQQBotRuntime, setQQBotRuntime } from "./src/bridge/runtime.js";
>>>>>>> upstream/main
