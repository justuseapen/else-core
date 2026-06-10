<<<<<<< HEAD
=======
// Msteams plugin entrypoint registers its OpenClaw integration.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "msteams",
  name: "Microsoft Teams",
  description: "Microsoft Teams channel plugin (Bot Framework)",
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
    exportName: "msteamsPlugin",
  },
=======
    specifier: "./channel-plugin-api.js",
    exportName: "msteamsPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
>>>>>>> upstream/main
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setMSTeamsRuntime",
  },
});
