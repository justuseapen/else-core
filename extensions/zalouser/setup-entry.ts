<<<<<<< HEAD
=======
// Zalouser plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
<<<<<<< HEAD
    specifier: "./api.js",
=======
    specifier: "./setup-plugin-api.js",
>>>>>>> upstream/main
    exportName: "zalouserSetupPlugin",
  },
});
