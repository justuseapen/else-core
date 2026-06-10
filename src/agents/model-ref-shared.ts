<<<<<<< HEAD
import {
  normalizeGooglePreviewModelId,
  normalizeNativeXaiModelId,
} from "../plugin-sdk/provider-model-shared.js";
import { normalizeProviderId } from "./provider-id.js";

export type StaticModelRef = {
=======
/**
 * Shared provider/model reference normalization for static catalogs,
 * allowlists, and display paths. Manifest policies are optional so tests can
 * isolate built-in normalization behavior.
 */
import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import {
  collectManifestModelIdNormalizationPolicies,
  normalizeBuiltInProviderModelId,
  normalizeConfiguredProviderCatalogModelRef,
  normalizeConfiguredProviderCatalogModelId as normalizeConfiguredProviderCatalogModelIdShared,
  normalizeStaticProviderModelIdWithPolicies,
} from "@openclaw/model-catalog-core/provider-model-id-normalization";
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { normalizeProviderModelIdWithManifest } from "../plugins/manifest-model-id-normalization.js";

type StaticModelRef = {
>>>>>>> upstream/main
  provider: string;
  model: string;
};

<<<<<<< HEAD
=======
export type ProviderModelIdNormalizationOptions = {
  allowManifestNormalization?: boolean;
  manifestPlugins?: readonly ManifestModelIdNormalizationRecord[];
};

export type ManifestModelIdNormalizationProvider = {
  aliases?: Record<string, string>;
  stripPrefixes?: string[];
  prefixWhenBare?: string;
  prefixWhenBareAfterAliasStartsWith?: {
    modelPrefix: string;
    prefix: string;
  }[];
};

export type ManifestModelIdNormalizationRecord = {
  modelIdNormalization?: {
    providers?: Record<string, ManifestModelIdNormalizationProvider>;
  };
};

/** Join provider and model into the canonical provider/model key. */
>>>>>>> upstream/main
export function modelKey(provider: string, model: string): string {
  const providerId = provider.trim();
  const modelId = model.trim();
  if (!providerId) {
    return modelId;
  }
  if (!modelId) {
    return providerId;
  }
<<<<<<< HEAD
  return modelId.toLowerCase().startsWith(`${providerId.toLowerCase()}/`)
=======
  return normalizeLowercaseStringOrEmpty(modelId).startsWith(
    `${normalizeLowercaseStringOrEmpty(providerId)}/`,
  )
>>>>>>> upstream/main
    ? modelId
    : `${providerId}/${modelId}`;
}

<<<<<<< HEAD
export function normalizeAnthropicModelId(model: string): string {
  const trimmed = model.trim();
  if (!trimmed) {
    return trimmed;
  }
  switch (trimmed.toLowerCase()) {
    case "opus-4.6":
      return "claude-opus-4-6";
    case "opus-4.5":
      return "claude-opus-4-5";
    case "sonnet-4.6":
      return "claude-sonnet-4-6";
    case "sonnet-4.5":
      return "claude-sonnet-4-5";
    default:
      return trimmed;
  }
}

function normalizeHuggingfaceModelId(model: string): string {
  const trimmed = model.trim();
  if (!trimmed) {
    return trimmed;
  }
  const prefix = "huggingface/";
  return trimmed.toLowerCase().startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
}

export function normalizeStaticProviderModelId(provider: string, model: string): string {
  if (provider === "anthropic") {
    return normalizeAnthropicModelId(model);
  }
  if (provider === "huggingface") {
    return normalizeHuggingfaceModelId(model);
  }
  if (provider === "google" || provider === "google-vertex") {
    return normalizeGooglePreviewModelId(model);
  }
  if (provider === "openrouter" && !model.includes("/")) {
    return `openrouter/${model}`;
  }
  if (provider === "xai") {
    return normalizeNativeXaiModelId(model);
  }
  if (provider === "vercel-ai-gateway" && !model.includes("/")) {
    const normalizedAnthropicModel = normalizeAnthropicModelId(model);
    if (normalizedAnthropicModel.startsWith("claude-")) {
      return `anthropic/${normalizedAnthropicModel}`;
    }
  }
  return model;
}

export function parseStaticModelRef(raw: string, defaultProvider: string): StaticModelRef | null {
=======
/** Normalize a static provider model ID with built-in and optional manifest policy. */
export function normalizeStaticProviderModelId(
  provider: string,
  model: string,
  options: ProviderModelIdNormalizationOptions = {},
): string {
  const normalizedProvider = normalizeProviderId(provider);
  if (options.allowManifestNormalization === false) {
    return normalizeBuiltInProviderModelId(normalizedProvider, model);
  }
  if (options.manifestPlugins) {
    return normalizeStaticProviderModelIdWithPolicies(
      normalizedProvider,
      model,
      collectManifestModelIdNormalizationPolicies(options.manifestPlugins),
    );
  }
  const manifestModelId =
    normalizeProviderModelIdWithManifest({
      provider: normalizedProvider,
      context: {
        provider: normalizedProvider,
        modelId: model,
      },
    }) ?? model;
  return normalizeBuiltInProviderModelId(normalizedProvider, manifestModelId);
}

/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
export function normalizeConfiguredProviderCatalogModelId(
  provider: string,
  model: string,
  options: ProviderModelIdNormalizationOptions = {},
): string {
  if (options.allowManifestNormalization === false) {
    return normalizeConfiguredProviderCatalogModelIdShared(provider, model, new Map());
  }
  if (options.manifestPlugins) {
    return normalizeConfiguredProviderCatalogModelIdShared(
      provider,
      model,
      collectManifestModelIdNormalizationPolicies(options.manifestPlugins),
    );
  }
  return normalizeConfiguredProviderCatalogModelRef(
    normalizeStaticProviderModelId(provider, model, options),
  );
}

function parseStaticModelRef(raw: string, defaultProvider: string): StaticModelRef | null {
>>>>>>> upstream/main
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const slash = trimmed.indexOf("/");
  const providerRaw = slash === -1 ? defaultProvider : trimmed.slice(0, slash).trim();
  const modelRaw = slash === -1 ? trimmed : trimmed.slice(slash + 1).trim();
  if (!providerRaw || !modelRaw) {
    return null;
  }
  const provider = normalizeProviderId(providerRaw);
  return {
    provider,
    model: normalizeStaticProviderModelId(provider, modelRaw),
  };
}

<<<<<<< HEAD
=======
/** Resolve an allowlist entry to a canonical provider/model key. */
>>>>>>> upstream/main
export function resolveStaticAllowlistModelKey(
  raw: string,
  defaultProvider: string,
): string | null {
  const parsed = parseStaticModelRef(raw, defaultProvider);
  if (!parsed) {
    return null;
  }
  return modelKey(parsed.provider, parsed.model);
}
<<<<<<< HEAD
=======

/** Preserve literal provider/model refs that already include a provider prefix twice. */
export function formatLiteralProviderPrefixedModelRef(provider: string, modelRef: string): string {
  const providerId = normalizeProviderId(provider);
  const trimmedRef = modelRef.trim();
  if (!providerId || !trimmedRef) {
    return trimmedRef;
  }
  const normalizedRef = normalizeLowercaseStringOrEmpty(trimmedRef);
  const literalPrefix = `${providerId}/${providerId}/`;
  if (normalizedRef.startsWith(literalPrefix)) {
    return trimmedRef;
  }
  return normalizedRef.startsWith(`${providerId}/`) ? `${providerId}/${trimmedRef}` : trimmedRef;
}
>>>>>>> upstream/main
