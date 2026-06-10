<<<<<<< HEAD
=======
// Qa Channel plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "qa-channel",
  name: "QA Channel",
  description: "Synthetic QA channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
    exportName: "qaChannelPlugin",
  },
  runtime: {
    specifier: "./runtime-api.js",
=======
    specifier: "./channel-plugin-api.js",
    exportName: "qaChannelPlugin",
  },
  runtime: {
    specifier: "./api.js",
>>>>>>> upstream/main
    exportName: "setQaChannelRuntime",
  },
});
