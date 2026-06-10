<<<<<<< HEAD
=======
/**
 * Applies provider plugin policy to configured model provider settings.
 */
>>>>>>> upstream/main
import {
  applyProviderNativeStreamingUsagePolicy,
  normalizeProviderConfigPolicy,
  resolveProviderConfigApiKeyPolicy,
} from "./models-config.providers.policy.runtime.js";
import type { ProviderConfig } from "./models-config.providers.secrets.js";

<<<<<<< HEAD
=======
/**
 * Provider-specific config policy adapters.
 *
 * Runtime policy rules live in the sibling runtime module; this file exposes the
 * small stable API used by models-config loading and tests.
 */
/** Applies native-streaming usage compatibility policy to the provider map. */
>>>>>>> upstream/main
export function applyNativeStreamingUsageCompat(
  providers: Record<string, ProviderConfig>,
): Record<string, ProviderConfig> {
  let changed = false;
  const nextProviders: Record<string, ProviderConfig> = {};

  for (const [providerKey, provider] of Object.entries(providers)) {
    const nextProvider = applyProviderNativeStreamingUsagePolicy(providerKey, provider);
    nextProviders[providerKey] = nextProvider;
    changed ||= nextProvider !== provider;
  }

  return changed ? nextProviders : providers;
}

<<<<<<< HEAD
=======
/** Normalizes a provider config according to provider-specific runtime policy. */
>>>>>>> upstream/main
export function normalizeProviderSpecificConfig(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const normalized = normalizeProviderConfigPolicy(providerKey, provider);
  if (normalized && normalized !== provider) {
    return normalized;
  }
  return provider;
}

<<<<<<< HEAD
=======
/** Resolves a provider-specific API key env lookup policy when one exists. */
>>>>>>> upstream/main
export function resolveProviderConfigApiKeyResolver(
  providerKey: string,
  provider?: ProviderConfig,
): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined {
  return resolveProviderConfigApiKeyPolicy(providerKey, provider);
}
