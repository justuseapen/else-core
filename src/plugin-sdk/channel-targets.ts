/**
 * Public SDK subpath for channel target parsing, matching, and allowlist helpers.
 */
export {
  applyChannelMatchMeta,
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatch,
  resolveChannelEntryMatchWithFallback,
  resolveChannelMatchConfig,
  resolveNestedAllowlistDecision,
  type ChannelEntryMatch,
  type ChannelMatchSource,
} from "../channels/channel-config.js";
export {
  buildMessagingTarget,
  ensureTargetId,
  normalizeTargetId,
  parseAtUserTarget,
  parseMentionPrefixOrAtUserTarget,
  parseTargetMention,
  parseTargetPrefix,
  parseTargetPrefixes,
  requireTargetKind,
  type MessagingTarget,
  type MessagingTargetKind,
  type MessagingTargetParseOptions,
} from "../channels/targets.js";
export {
  createAllowedChatSenderMatcher,
  parseChatAllowTargetPrefixes,
  parseChatTargetPrefixesOrThrow,
  resolveServicePrefixedAllowTarget,
  resolveServicePrefixedChatTarget,
  resolveServicePrefixedOrChatAllowTarget,
  resolveServicePrefixedTarget,
  type ChatSenderAllowParams,
  type ChatTargetPrefixesParams,
  type ParsedChatAllowTarget,
  type ParsedChatTarget,
  type ServicePrefix,
} from "../channels/plugins/chat-target-prefixes.js";
<<<<<<< HEAD
export type { ChannelId } from "../channels/plugins/types.js";
export { normalizeChannelId } from "../channels/plugins/registry.js";
=======
export type { ChannelId } from "../channels/plugins/types.public.js";
export { normalizeChannelId } from "../channels/plugins/registry.js";
export { resolveChannelTtsVoiceDelivery } from "../channels/plugins/tts-capabilities.js";
>>>>>>> upstream/main
export {
  buildUnresolvedTargetResults,
  resolveTargetsWithOptionalToken,
} from "../channels/plugins/target-resolvers.js";
