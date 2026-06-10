<<<<<<< HEAD
export {
  createChannelReplyPipeline,
=======
// Whatsapp plugin module implements inbound dispatch behavior.
export {
  createChannelMessageReplyPipeline,
>>>>>>> upstream/main
  dispatchReplyWithBufferedBlockDispatcher,
  finalizeInboundContext,
  getAgentScopedMediaLocalRoots,
  jidToE164,
  logVerbose,
<<<<<<< HEAD
=======
  resolveChannelMessageSourceReplyDeliveryMode,
>>>>>>> upstream/main
  resolveChunkMode,
  resolveIdentityNamePrefix,
  resolveInboundLastRouteSessionKey,
  resolveMarkdownTableMode,
  resolveSendableOutboundReplyParts,
  resolveTextChunkLimit,
  shouldLogVerbose,
  toLocationContext,
  type getChildLogger,
  type getReplyFromConfig,
  type LoadConfigFn,
  type ReplyPayload,
  type resolveAgentRoute,
} from "./runtime-api.js";
