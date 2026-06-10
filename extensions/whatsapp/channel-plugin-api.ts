<<<<<<< HEAD
// Keep bundled channel bootstrap loads narrow so lightweight config-presence
// probes do not import the broad WhatsApp API barrel.
export { whatsappPlugin } from "./src/channel.js";
export { whatsappSetupPlugin } from "./src/channel.setup.js";
=======
// Keep bundled channel bootstrap loads narrow so lightweight channel entry
// loads do not import setup-only surfaces.
export { whatsappPlugin } from "./src/channel.js";
>>>>>>> upstream/main
