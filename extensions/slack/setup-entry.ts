<<<<<<< HEAD
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
=======
// Slack plugin module implements setup entry behavior.
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { registerSlackPluginHttpRoutes } from "./http-routes-api.js";
>>>>>>> upstream/main

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./channel-plugin-api.js",
    exportName: "slackSetupPlugin",
  },
=======
    specifier: "./setup-plugin-api.js",
    exportName: "slackSetupPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
    exportName: "setSlackRuntime",
  },
  registerSetupRuntime: registerSlackPluginHttpRoutes,
>>>>>>> upstream/main
});
