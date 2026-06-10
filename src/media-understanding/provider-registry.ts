<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { resolvePluginCapabilityProviders } from "../plugins/capability-provider-runtime.js";
=======
// Media-understanding provider registry combines plugin capability providers,
// config-derived image providers, and test/runtime overrides.
import type { OpenClawConfig } from "../config/types.js";
import { resolvePluginCapabilityProviders } from "../plugins/capability-provider-runtime.js";
import { resolveImageCapableConfigProviderIds } from "./config-provider-models.js";
>>>>>>> upstream/main
import { describeImageWithModel, describeImagesWithModel } from "./image-runtime.js";
import { normalizeMediaProviderId } from "./provider-id.js";
import type { MediaUnderstandingProvider } from "./types.js";

type ConfigProvider = NonNullable<
  NonNullable<NonNullable<OpenClawConfig["models"]>["providers"]>[string]
>;

type ConfigProviderModel = NonNullable<ConfigProvider["models"]>[number];

function mergeProviderIntoRegistry(
  registry: Map<string, MediaUnderstandingProvider>,
  provider: MediaUnderstandingProvider,
  registryKey = provider.id,
) {
  const normalizedKey = normalizeMediaProviderId(registryKey);
  const existing = registry.get(normalizedKey);
  const merged = existing
    ? {
        ...existing,
        ...provider,
        capabilities: provider.capabilities ?? existing.capabilities,
        defaultModels: provider.defaultModels ?? existing.defaultModels,
        autoPriority: provider.autoPriority ?? existing.autoPriority,
        nativeDocumentInputs: provider.nativeDocumentInputs ?? existing.nativeDocumentInputs,
<<<<<<< HEAD
=======
        documentModels: provider.documentModels ?? existing.documentModels,
>>>>>>> upstream/main
      }
    : provider;
  registry.set(normalizedKey, hydrateModelBackedMediaProvider(merged));
}

function hydrateModelBackedMediaProvider(
  provider: MediaUnderstandingProvider,
): MediaUnderstandingProvider {
  // Manifest-only image providers can still route through the generic model
  // runtime when they declare image capability but no plugin hook.
  if (!provider.capabilities?.includes("image")) {
    return provider;
  }
  if (provider.describeImage && provider.describeImages) {
    return provider;
  }
  return {
    ...provider,
    describeImage: provider.describeImage ?? describeImageWithModel,
    describeImages: provider.describeImages ?? describeImagesWithModel,
  };
}

export { normalizeMediaExecutionProviderId, normalizeMediaProviderId } from "./provider-id.js";

/** Builds the media-understanding provider registry from plugin capabilities and config providers. */
export function buildMediaUnderstandingRegistry(
  overrides?: Record<string, MediaUnderstandingProvider>,
  cfg?: OpenClawConfig,
): Map<string, MediaUnderstandingProvider> {
  const registry = new Map<string, MediaUnderstandingProvider>();
  for (const provider of resolvePluginCapabilityProviders({
    key: "mediaUnderstandingProviders",
    cfg,
  })) {
    mergeProviderIntoRegistry(registry, provider);
  }
  // Auto-register media-understanding for config providers with image-capable models (#51392)
<<<<<<< HEAD
  const configProviders = cfg?.models?.providers;
  if (configProviders && typeof configProviders === "object") {
    for (const [providerKey, providerCfg] of Object.entries(configProviders)) {
      if (!providerKey?.trim()) {
        continue;
      }
      const normalizedKey = normalizeMediaProviderId(providerKey);
      if (registry.has(normalizedKey)) {
        continue;
      }
      const models = providerCfg.models ?? [];
      const hasImageModel = models.some(
        (m: ConfigProviderModel) => Array.isArray(m?.input) && m.input.includes("image"),
      );
      if (hasImageModel) {
        const autoProvider: MediaUnderstandingProvider = {
          id: normalizedKey,
          capabilities: ["image"],
          describeImage: describeImageWithModel,
          describeImages: describeImagesWithModel,
        };
        mergeProviderIntoRegistry(registry, autoProvider);
      }
=======
  for (const normalizedKey of resolveImageCapableConfigProviderIds(cfg)) {
    if (!registry.has(normalizedKey)) {
      mergeProviderIntoRegistry(registry, {
        id: normalizedKey,
        capabilities: ["image"],
        describeImage: describeImageWithModel,
        describeImages: describeImagesWithModel,
      });
>>>>>>> upstream/main
    }
  }
  if (overrides) {
    for (const [key, provider] of Object.entries(overrides)) {
<<<<<<< HEAD
      const normalizedKey = normalizeMediaProviderId(key);
      const existing = registry.get(normalizedKey);
      const merged = existing
        ? {
            ...existing,
            ...provider,
            capabilities: provider.capabilities ?? existing.capabilities,
            defaultModels: provider.defaultModels ?? existing.defaultModels,
            autoPriority: provider.autoPriority ?? existing.autoPriority,
            nativeDocumentInputs: provider.nativeDocumentInputs ?? existing.nativeDocumentInputs,
          }
        : provider;
      registry.set(normalizedKey, merged);
=======
      mergeProviderIntoRegistry(registry, provider, key);
>>>>>>> upstream/main
    }
  }
  return registry;
}

/** Looks up a media-understanding provider using the same id normalization as registry builds. */
export function getMediaUnderstandingProvider(
  id: string,
  registry: Map<string, MediaUnderstandingProvider>,
): MediaUnderstandingProvider | undefined {
  return registry.get(normalizeMediaProviderId(id));
}
