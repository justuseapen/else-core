<<<<<<< HEAD
export * from "./src/action-runtime.js";
export * from "./src/directory-live.js";
export * from "./src/index.js";
export * from "./src/resolve-channels.js";
export * from "./src/resolve-users.js";
=======
// Slack API module exposes the plugin public contract.
export {
  handleSlackAction,
  slackActionRuntime,
  type SlackActionContext,
} from "./src/action-runtime.js";
export { listSlackDirectoryGroupsLive, listSlackDirectoryPeersLive } from "./src/directory-live.js";
export {
  deleteSlackMessage,
  editSlackMessage,
  getSlackMemberInfo,
  listEnabledSlackAccounts,
  listSlackAccountIds,
  listSlackEmojis,
  listSlackPins,
  listSlackReactions,
  monitorSlackProvider,
  pinSlackMessage,
  probeSlack,
  reactSlackMessage,
  readSlackMessages,
  removeOwnSlackReactions,
  removeSlackReaction,
  resolveDefaultSlackAccountId,
  resolveSlackAccount,
  resolveSlackAppToken,
  resolveSlackBotToken,
  resolveSlackGroupRequireMention,
  resolveSlackGroupToolPolicy,
  sendMessageSlack,
  sendSlackMessage,
  unpinSlackMessage,
} from "./src/index.js";
export {
  resolveSlackChannelAllowlist,
  type SlackChannelLookup,
  type SlackChannelResolution,
} from "./src/resolve-channels.js";
export {
  resolveSlackUserAllowlist,
  type SlackUserLookup,
  type SlackUserResolution,
} from "./src/resolve-users.js";
>>>>>>> upstream/main
export { registerSlackPluginHttpRoutes } from "./src/http/plugin-routes.js";
export { setSlackRuntime } from "./src/runtime.js";
