<<<<<<< HEAD
=======
// Synology Chat plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for OpenClaw",
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
=======
    specifier: "./channel-plugin-api.js",
>>>>>>> upstream/main
    exportName: "synologyChatPlugin",
  },
  runtime: {
    specifier: "./api.js",
    exportName: "setSynologyRuntime",
  },
});
