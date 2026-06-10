<<<<<<< HEAD
=======
// Whatsapp plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "whatsapp",
  name: "WhatsApp",
  description: "WhatsApp channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "whatsappPlugin",
  },
  runtime: {
<<<<<<< HEAD
    specifier: "./runtime-api.js",
=======
    specifier: "./runtime-setter-api.js",
>>>>>>> upstream/main
    exportName: "setWhatsAppRuntime",
  },
});
