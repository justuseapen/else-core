<<<<<<< HEAD
=======
// Feishu plugin module implements channel entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelEntry({
  id: "feishu",
  name: "Feishu",
  description: "Feishu/Lark channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./api.js",
    exportName: "feishuPlugin",
  },
<<<<<<< HEAD
=======
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
>>>>>>> upstream/main
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setFeishuRuntime",
  },
});
