<<<<<<< HEAD
=======
// Irc plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "ircPlugin",
  },
<<<<<<< HEAD
=======
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
>>>>>>> upstream/main
});
