<<<<<<< HEAD
=======
// Slack API module exposes the plugin public contract.
>>>>>>> upstream/main
export type { ResolvedSlackAccount } from "./src/accounts.js";
export type { SlackMessageEvent } from "./src/types.js";
export { slackPlugin } from "./src/channel.js";
export { setSlackRuntime } from "./src/runtime.js";
export { createSlackActions } from "./src/channel-actions.js";
<<<<<<< HEAD
=======
export { createSlackOutboundPayloadHarness } from "./src/outbound-payload.test-harness.js";
>>>>>>> upstream/main
export { prepareSlackMessage } from "./src/monitor/message-handler/prepare.js";
export { createInboundSlackTestContext } from "./src/monitor/message-handler/prepare.test-helpers.js";
export { slackOutbound } from "./src/outbound-adapter.js";
export { sendMessageSlack } from "./src/send.js";
