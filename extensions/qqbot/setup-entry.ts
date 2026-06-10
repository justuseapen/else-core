<<<<<<< HEAD
=======
// Qqbot plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
    exportName: "qqbotSetupPlugin",
  },
=======
    specifier: "./setup-plugin-api.js",
    exportName: "qqbotSetupPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
>>>>>>> upstream/main
});
