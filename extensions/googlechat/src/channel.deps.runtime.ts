<<<<<<< HEAD
export {
  buildChannelConfigSchema,
  chunkTextForOutbound,
  createAccountStatusSink,
  DEFAULT_ACCOUNT_ID,
  fetchRemoteMedia,
=======
// Googlechat plugin module implements channeleps behavior.
export {
  buildChannelConfigSchema,
  chunkTextForOutbound,
  DEFAULT_ACCOUNT_ID,
  readRemoteMediaBuffer,
>>>>>>> upstream/main
  GoogleChatConfigSchema,
  loadOutboundMediaFromUrl,
  missingTargetError,
  PAIRING_APPROVED_MESSAGE,
  resolveChannelMediaMaxBytes,
<<<<<<< HEAD
  runPassiveAccountLifecycle,
  type ChannelMessageActionAdapter,
=======
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
>>>>>>> upstream/main
  type ChannelStatusIssue,
  type OpenClawConfig,
} from "../runtime-api.js";
export {
<<<<<<< HEAD
  listGoogleChatAccountIds,
=======
  type GoogleChatConfigAccessorAccount,
  listGoogleChatAccountIds,
  resolveGoogleChatConfigAccessorAccount,
>>>>>>> upstream/main
  resolveDefaultGoogleChatAccountId,
  resolveGoogleChatAccount,
  type ResolvedGoogleChatAccount,
} from "./accounts.js";
export {
  isGoogleChatSpaceTarget,
  isGoogleChatUserTarget,
  normalizeGoogleChatTarget,
  resolveGoogleChatOutboundSpace,
} from "./targets.js";
