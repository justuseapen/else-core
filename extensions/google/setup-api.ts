<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { normalizeGoogleProviderConfig } from "./api.js";
=======
// Google API module exposes the plugin public contract.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildGoogleGeminiCliBackend } from "./cli-backend.js";
import { createGoogleVertexProvider } from "./provider-contract-api.js";
>>>>>>> upstream/main

export default definePluginEntry({
  id: "google",
  name: "Google Setup",
  description: "Lightweight Google setup hooks",
  register(api) {
<<<<<<< HEAD
    api.registerProvider({
      id: "google",
      label: "Google AI Studio",
      hookAliases: ["google-antigravity", "google-vertex"],
      auth: [],
      normalizeConfig: ({ provider, providerConfig }) =>
        normalizeGoogleProviderConfig(provider, providerConfig),
    });
=======
    api.registerProvider(createGoogleVertexProvider());
    api.registerCliBackend(buildGoogleGeminiCliBackend());
>>>>>>> upstream/main
  },
});
