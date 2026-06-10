<<<<<<< HEAD
=======
// Whatsapp plugin module implements setup entry behavior.
>>>>>>> upstream/main
import { defineBundledChannelSetupEntry } from "openclaw/plugin-sdk/channel-entry-contract";

export default defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
<<<<<<< HEAD
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "whatsappSetupPlugin",
  },
=======
  features: {
    legacyStateMigrations: true,
    legacySessionSurfaces: true,
  },
  plugin: {
    specifier: "./setup-plugin-api.js",
    exportName: "whatsappSetupPlugin",
  },
  legacyStateMigrations: {
    specifier: "./legacy-state-migrations-api.js",
    exportName: "detectWhatsAppLegacyStateMigrations",
  },
  legacySessionSurface: {
    specifier: "./legacy-session-surface-api.js",
    exportName: "whatsappLegacySessionSurface",
  },
>>>>>>> upstream/main
});
