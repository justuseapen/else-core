<<<<<<< HEAD
export { buildOpenrouterProvider } from "./provider-catalog.js";
=======
// Openrouter API module exposes the plugin public contract.
export { buildOpenRouterImageGenerationProvider } from "./image-generation-provider.js";
export { buildOpenRouterMusicGenerationProvider } from "./music-generation-provider.js";
export {
  buildOpenrouterProvider,
  isOpenRouterProxyReasoningUnsupportedModel,
} from "./provider-catalog.js";
export { buildOpenRouterSpeechProvider } from "./speech-provider.js";
>>>>>>> upstream/main
export {
  applyOpenrouterConfig,
  applyOpenrouterProviderConfig,
  OPENROUTER_DEFAULT_MODEL_REF,
} from "./onboard.js";
