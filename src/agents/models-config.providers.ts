<<<<<<< HEAD
export * from "./models-config.providers.static.js";
export { resolveImplicitProviders } from "./models-config.providers.implicit.js";
export { normalizeProviders } from "./models-config.providers.normalize.js";
export type {
  ProfileApiKeyResolution,
  ProviderApiKeyResolver,
  ProviderAuthResolver,
  ProviderConfig,
  SecretDefaults,
} from "./models-config.providers.secrets.js";
export { applyNativeStreamingUsageCompat } from "./models-config.providers.policy.js";
export { enforceSourceManagedProviderSecrets } from "./models-config.providers.source-managed.js";
export { resolveOllamaApiBase } from "../plugin-sdk/ollama.js";
=======
/**
 * Provider-config public barrel. It centralizes provider normalization,
 * implicit discovery, policy hooks, and secret enforcement imports for
 * models-config callers.
 */
export { resolveImplicitProviders } from "./models-config.providers.implicit.js";
export {
  normalizeProviderCatalogModelsForConfig,
  normalizeProviders,
} from "./models-config.providers.normalize.js";
export type { ProviderConfig } from "./models-config.providers.secrets.js";
export { applyNativeStreamingUsageCompat } from "./models-config.providers.policy.js";
export { enforceSourceManagedProviderSecrets } from "./models-config.providers.source-managed.js";
>>>>>>> upstream/main
