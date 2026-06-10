<<<<<<< HEAD
export {
  resolveAgentConfig,
  resolveAgentDir,
  resolveAgentModelFallbacksOverride,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
  resolveAgentSkillsFilter,
} from "../../agents/agent-scope.js";
export { resolveSessionAuthProfileOverride } from "../../agents/auth-profiles/session-override.js";
export { lookupContextTokens } from "../../agents/context.js";
export { resolveCronStyleNow } from "../../agents/current-time.js";
export { DEFAULT_CONTEXT_TOKENS, DEFAULT_MODEL, DEFAULT_PROVIDER } from "../../agents/defaults.js";
export { loadModelCatalog } from "../../agents/model-catalog.js";
export {
  getModelRefStatus,
  normalizeModelSelection,
  resolveAllowedModelRef,
  resolveConfiguredModelRef,
  resolveHooksGmailModel,
  resolveThinkingDefault,
} from "../../agents/model-selection.js";
export { buildWorkspaceSkillSnapshot } from "../../agents/skills.js";
export { getSkillsSnapshotVersion } from "../../agents/skills/refresh.js";
export { runSubagentAnnounceFlow } from "../../agents/subagent-announce.js";
export { resolveAgentTimeoutMs } from "../../agents/timeout.js";
export { deriveSessionTotalTokens, hasNonzeroUsage } from "../../agents/usage.js";
export { DEFAULT_IDENTITY_FILENAME, ensureAgentWorkspace } from "../../agents/workspace.js";
export { normalizeThinkLevel, supportsXHighThinking } from "../../auto-reply/thinking.js";
export { createOutboundSendDeps } from "../../cli/outbound-send-deps.js";
export {
  resolveAgentMainSessionKey,
  setSessionRuntimeModel,
  updateSessionStore,
} from "../../config/sessions.js";
export { deliverOutboundPayloads } from "../../infra/outbound/deliver.js";
export { getRemoteSkillEligibility } from "../../infra/skills-remote.js";
export { logWarn } from "../../logger.js";
export { buildAgentMainSessionKey, normalizeAgentId } from "../../routing/session-key.js";
export {
  buildSafeExternalPrompt,
  detectSuspiciousPatterns,
  getHookType,
  isExternalHookSession,
  mapHookExternalContentSource,
  resolveHookExternalContentSource,
} from "../../security/external-content.js";
export { estimateUsageCost, resolveModelCostConfig } from "../../utils/usage-format.js";
=======
// Runtime dependency facade for isolated cron agent turns.
export {
  resolveAgentConfig,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
  type ResolvedAgentConfig,
} from "../../agents/agent-scope-config.js";
export { resolveCronStyleNow } from "../../agents/current-time.js";
export { DEFAULT_CONTEXT_TOKENS } from "../../agents/defaults.js";
export { isCliProvider } from "../../agents/model-selection-cli.js";
export { resolveThinkingDefault } from "../../agents/model-thinking-default.js";
export { resolveAgentTimeoutMs } from "../../agents/timeout.js";
export { deriveSessionTotalTokens, hasNonzeroUsage } from "../../agents/usage.js";
export { DEFAULT_IDENTITY_FILENAME, ensureAgentWorkspace } from "../../agents/workspace.js";
export {
  isThinkingLevelSupported,
  normalizeThinkLevel,
  resolveSupportedThinkingLevel,
} from "../../auto-reply/thinking.js";
export { resolveSessionTranscriptPath } from "../../config/sessions/paths.js";
export { setSessionRuntimeModel } from "../../config/sessions/types.js";
export { logWarn } from "../../logger.js";
export { normalizeAgentId } from "../../routing/session-key.js";
export {
  isExternalHookSession,
  mapHookExternalContentSource,
  resolveHookExternalContentSource,
} from "../../security/external-content-source.js";
>>>>>>> upstream/main
