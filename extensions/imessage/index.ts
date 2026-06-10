<<<<<<< HEAD
=======
// Imessage plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "imessage",
  name: "iMessage",
  description: "iMessage channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
=======
    specifier: "./channel-plugin-api.js",
>>>>>>> upstream/main
    exportName: "imessagePlugin",
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setIMessageRuntime",
  },
});
