<<<<<<< HEAD
=======
// Slack plugin module implements channel entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "slack",
  name: "Slack",
  description: "Slack channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./api.js",
    exportName: "slackPlugin",
  },
<<<<<<< HEAD
  runtime: {
    specifier: "./runtime-api.js",
=======
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
>>>>>>> upstream/main
    exportName: "setSlackRuntime",
  },
});
