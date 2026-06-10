<<<<<<< HEAD
=======
// Discord plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
<<<<<<< HEAD
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "discordSetupPlugin",
  },
=======
  features: {
    legacyStateMigrations: true,
  },
  plugin: {
    specifier: "./setup-plugin-api.js",
    exportName: "discordSetupPlugin",
  },
  legacyStateMigrations: {
    specifier: "./legacy-state-migrations-api.js",
    exportName: "detectDiscordLegacyStateMigrations",
  },
>>>>>>> upstream/main
});
