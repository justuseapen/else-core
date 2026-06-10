<<<<<<< HEAD
=======
/**
 * Runtime-policy bridge for provider config normalization. These helpers call
 * plugin hooks without triggering runtime plugin loading from config assembly.
 */
>>>>>>> upstream/main
import {
  applyProviderNativeStreamingUsageCompatWithPlugin,
  normalizeProviderConfigWithPlugin,
  resolveProviderConfigApiKeyWithPlugin,
} from "../plugins/provider-runtime.js";
import { resolveProviderPluginLookupKey } from "./models-config.providers.policy.lookup.js";
import type { ProviderConfig } from "./models-config.providers.secrets.js";

<<<<<<< HEAD
=======
/** Apply provider native-streaming usage compatibility policy. */
>>>>>>> upstream/main
export function applyProviderNativeStreamingUsagePolicy(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider);
  return (
    applyProviderNativeStreamingUsageCompatWithPlugin({
      provider: runtimeProviderKey,
<<<<<<< HEAD
=======
      allowRuntimePluginLoad: false,
>>>>>>> upstream/main
      context: {
        provider: providerKey,
        providerConfig: provider,
      },
    }) ?? provider
  );
}

<<<<<<< HEAD
=======
/** Normalize provider config through any already-available plugin policy hook. */
>>>>>>> upstream/main
export function normalizeProviderConfigPolicy(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider);
  return (
    normalizeProviderConfigWithPlugin({
      provider: runtimeProviderKey,
<<<<<<< HEAD
=======
      allowRuntimePluginLoad: false,
>>>>>>> upstream/main
      context: {
        provider: providerKey,
        providerConfig: provider,
      },
    }) ?? provider
  );
}

<<<<<<< HEAD
=======
/** Resolve a provider API-key policy function from already-available plugin hooks. */
>>>>>>> upstream/main
export function resolveProviderConfigApiKeyPolicy(
  providerKey: string,
  provider?: ProviderConfig,
): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider).trim();
  return (env) =>
    resolveProviderConfigApiKeyWithPlugin({
      provider: runtimeProviderKey,
<<<<<<< HEAD
=======
      allowRuntimePluginLoad: false,
>>>>>>> upstream/main
      context: {
        provider: providerKey,
        env,
      },
    });
}
