<<<<<<< HEAD
=======
// Zalo plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "zalo",
  name: "Zalo",
  description: "Zalo channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
    exportName: "zaloPlugin",
  },
=======
    specifier: "./channel-plugin-api.js",
    exportName: "zaloPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
>>>>>>> upstream/main
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setZaloRuntime",
  },
});
