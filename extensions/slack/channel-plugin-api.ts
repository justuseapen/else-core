// Keep bundled channel entry imports narrow so bootstrap/discovery paths do
<<<<<<< HEAD
// not drag the broad Slack API barrel into lightweight plugin loads.
export { slackPlugin } from "./src/channel.js";
export { slackSetupPlugin } from "./src/channel.setup.js";
=======
// not drag setup-only Slack surfaces into lightweight channel plugin loads.
export { slackPlugin } from "./src/channel.js";
>>>>>>> upstream/main
