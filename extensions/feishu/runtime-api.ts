// Private runtime barrel for the bundled Feishu extension.
// Keep this barrel thin and generic-only.

export type {
  AllowlistMatch,
  AnyAgentTool,
  BaseProbeResult,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelPlugin,
  HistoryEntry,
  OpenClawConfig,
  OpenClawPluginApi,
  OutboundIdentity,
  PluginRuntime,
  ReplyPayload,
} from "openclaw/plugin-sdk/core";
export type { OpenClawConfig as ClawdbotConfig } from "openclaw/plugin-sdk/core";
<<<<<<< HEAD
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
export type { GroupToolPolicyConfig } from "openclaw/plugin-sdk/config-runtime";
=======
export type RuntimeEnv = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  exit: (code: number) => void;
};
export type { GroupToolPolicyConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createActionGate,
  createDedupeCache,
} from "openclaw/plugin-sdk/core";
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "openclaw/plugin-sdk/channel-status";
export { buildAgentMediaPayload } from "openclaw/plugin-sdk/agent-media-payload";
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
<<<<<<< HEAD
export { createReplyPrefixContext } from "openclaw/plugin-sdk/channel-reply-pipeline";
=======
export { createReplyPrefixContext } from "openclaw/plugin-sdk/channel-outbound";
>>>>>>> upstream/main
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
  resolveChannelContextVisibilityMode,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/config-runtime";
export { loadSessionStore, resolveSessionStoreEntry } from "openclaw/plugin-sdk/config-runtime";
export { readJsonFileWithFallback } from "openclaw/plugin-sdk/json-store";
export { createPersistentDedupe } from "openclaw/plugin-sdk/persistent-dedupe";
=======
} from "openclaw/plugin-sdk/context-visibility-runtime";
export {
  loadSessionStore,
  resolveSessionStoreEntry,
} from "openclaw/plugin-sdk/session-store-runtime";
export { readJsonFileWithFallback } from "openclaw/plugin-sdk/json-store";
>>>>>>> upstream/main
export { normalizeAgentId } from "openclaw/plugin-sdk/routing";
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "openclaw/plugin-sdk/webhook-ingress";
export { setFeishuRuntime } from "./src/runtime.js";
