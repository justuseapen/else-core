<<<<<<< HEAD
export {
  chunkMarkdownTextWithMode,
  createReplyDispatcherWithTyping,
  createReplyReferencePlanner,
  dispatchInboundMessage,
  finalizeInboundContext,
  getReplyFromConfig,
  isSilentReplyText,
  resolveTextChunkLimit,
  SILENT_REPLY_TOKEN,
=======
// Slack plugin module implements reply behavior.
export {
  createReplyDispatcherWithTyping,
  dispatchReplyWithBufferedBlockDispatcher,
  dispatchInboundMessage,
  settleReplyDispatcher,
>>>>>>> upstream/main
} from "openclaw/plugin-sdk/reply-runtime";
