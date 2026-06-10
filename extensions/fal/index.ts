// Fal plugin entrypoint registers its OpenClaw integration.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
<<<<<<< HEAD
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildFalImageGenerationProvider } from "./image-generation-provider.js";
import { applyFalConfig, FAL_DEFAULT_IMAGE_MODEL_REF } from "./onboard.js";
=======
import { buildFalImageGenerationProvider } from "./image-generation-provider.js";
import { buildFalMusicGenerationProvider } from "./music-generation-provider.js";
import { createFalProvider } from "./provider-registration.js";
>>>>>>> upstream/main
import { buildFalVideoGenerationProvider } from "./video-generation-provider.js";

const PROVIDER_ID = "fal";

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "fal Provider",
  description: "Bundled fal image, video, and music generation provider",
  register(api) {
    api.registerProvider(createFalProvider());
    api.registerImageGenerationProvider(buildFalImageGenerationProvider());
<<<<<<< HEAD
=======
    api.registerMusicGenerationProvider(buildFalMusicGenerationProvider());
>>>>>>> upstream/main
    api.registerVideoGenerationProvider(buildFalVideoGenerationProvider());
  },
});
