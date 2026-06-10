<<<<<<< HEAD
=======
// Imessage plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
<<<<<<< HEAD
=======
  features: {
    legacyStateMigrations: true,
  },
>>>>>>> upstream/main
  plugin: {
    specifier: "./api.js",
    exportName: "imessageSetupPlugin",
  },
<<<<<<< HEAD
=======
  legacyStateMigrations: {
    specifier: "./legacy-state-migrations-api.js",
    exportName: "detectIMessageLegacyStateMigrations",
  },
>>>>>>> upstream/main
});
