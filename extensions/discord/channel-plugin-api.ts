// Keep bundled channel entry imports narrow so bootstrap/discovery paths do
<<<<<<< HEAD
// not drag the broad Discord API barrel into lightweight plugin loads.
export { discordPlugin } from "./src/channel.js";
export { discordSetupPlugin } from "./src/channel.setup.js";
=======
// not drag setup-only surfaces into lightweight channel plugin loads.
export { discordPlugin } from "./src/channel.js";
>>>>>>> upstream/main
