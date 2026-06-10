<<<<<<< HEAD
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
export type { OpenClawConfig, GroupPolicy } from "openclaw/plugin-sdk/config-runtime";
export type { MarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
=======
// Zalo plugin module implements runtime support behavior.
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
export type { OpenClawConfig, GroupPolicy } from "openclaw/plugin-sdk/config-contracts";
export type { MarkdownTableMode } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
export type { BaseTokenResolution } from "openclaw/plugin-sdk/channel-contract";
export type {
  BaseProbeResult,
  ChannelAccountSnapshot,
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
  ChannelStatusIssue,
} from "openclaw/plugin-sdk/channel-contract";
export type { SecretInput } from "openclaw/plugin-sdk/secret-input";
<<<<<<< HEAD
export type { SenderGroupAccessDecision } from "openclaw/plugin-sdk/group-access";
=======
>>>>>>> upstream/main
export type { ChannelPlugin, PluginRuntime, WizardPrompter } from "openclaw/plugin-sdk/core";
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
export type { OutboundReplyPayload } from "openclaw/plugin-sdk/reply-payload";
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createDedupeCache,
  formatPairingApproveHint,
  jsonResult,
  normalizeAccountId,
  readStringParam,
  resolveClientIp,
} from "openclaw/plugin-sdk/core";
export {
  applyAccountNameToChannelSection,
  applySetupAccountConfigPatch,
  buildSingleChannelSecretPromptState,
  mergeAllowFromEntries,
  migrateBaseNameToDefaultAccount,
  promptSingleChannelSecretInput,
  runSingleChannelSecretStep,
  setTopLevelChannelDmPolicyWithAllowFrom,
} from "openclaw/plugin-sdk/setup";
export {
  buildSecretInputSchema,
  hasConfiguredSecretInput,
  normalizeResolvedSecretInputString,
  normalizeSecretInputString,
} from "openclaw/plugin-sdk/secret-input";
export {
  buildTokenChannelStatusSummary,
  PAIRING_APPROVED_MESSAGE,
} from "openclaw/plugin-sdk/channel-status";
export { buildBaseAccountStatusSnapshot } from "openclaw/plugin-sdk/status-helpers";
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
export {
  formatAllowFromLowercase,
  isNormalizedSenderAllowed,
} from "openclaw/plugin-sdk/allow-from";
export { addWildcardAllowFrom } from "openclaw/plugin-sdk/setup";
<<<<<<< HEAD
export { evaluateSenderGroupAccess } from "openclaw/plugin-sdk/group-access";
export { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/config-runtime";
export {
  warnMissingProviderGroupPolicyFallbackOnce,
  resolveDefaultGroupPolicy,
} from "openclaw/plugin-sdk/config-runtime";
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
export { createChannelReplyPipeline } from "openclaw/plugin-sdk/channel-reply-pipeline";
=======
export { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
export {
  warnMissingProviderGroupPolicyFallbackOnce,
  resolveDefaultGroupPolicy,
} from "openclaw/plugin-sdk/runtime-group-policy";
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
>>>>>>> upstream/main
export { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
export {
  deliverTextOrMediaReply,
  isNumericTargetId,
  sendPayloadWithChunkedTextAndMedia,
} from "openclaw/plugin-sdk/reply-payload";
<<<<<<< HEAD
export {
  resolveDirectDmAuthorizationOutcome,
  resolveSenderCommandAuthorizationWithRuntime,
} from "openclaw/plugin-sdk/command-auth";
=======
>>>>>>> upstream/main
export { resolveInboundRouteEnvelopeBuilderWithRuntime } from "openclaw/plugin-sdk/inbound-envelope";
export { waitForAbortSignal } from "openclaw/plugin-sdk/runtime";
export {
  applyBasicWebhookRequestGuards,
  createFixedWindowRateLimiter,
  createWebhookAnomalyTracker,
  readJsonWebhookBodyOrReject,
<<<<<<< HEAD
=======
  registerPluginHttpRoute,
>>>>>>> upstream/main
  registerWebhookTarget,
  registerWebhookTargetWithPluginRoute,
  resolveWebhookPath,
  resolveWebhookTargetWithAuthOrRejectSync,
  WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
  WEBHOOK_RATE_LIMIT_DEFAULTS,
  withResolvedWebhookRequestPipeline,
} from "openclaw/plugin-sdk/webhook-ingress";
export type {
  RegisterWebhookPluginRouteOptions,
  RegisterWebhookTargetOptions,
} from "openclaw/plugin-sdk/webhook-ingress";
