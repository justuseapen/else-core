<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { buildMediaUnderstandingRegistry, normalizeMediaProviderId } from "./provider-registry.js";
import type { MediaUnderstandingCapability, MediaUnderstandingProvider } from "./types.js";
=======
// Media-understanding default model/provider selection from config, manifest
// metadata, and capability declarations.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { uniqueStrings } from "@openclaw/normalization-core/string-normalization";
import { resolveRuntimeConfigCacheKey } from "../config/runtime-snapshot.js";
import type { OpenClawConfig } from "../config/types.js";
import { buildMediaUnderstandingManifestMetadataRegistry } from "./manifest-metadata.js";
import {
  normalizeMediaExecutionProviderId,
  normalizeMediaProviderId,
} from "./provider-registry.js";
import { providerSupportsCapability } from "./provider-supports.js";
import type { MediaUnderstandingCapability, MediaUnderstandingProvider } from "./types.js";
export {
  CLI_OUTPUT_MAX_BUFFER,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_CHARS_BY_CAPABILITY,
  DEFAULT_MEDIA_CONCURRENCY,
  DEFAULT_PROMPT,
  DEFAULT_TIMEOUT_SECONDS,
  DEFAULT_VIDEO_MAX_BASE64_BYTES,
  MIN_AUDIO_FILE_BYTES,
} from "./defaults.constants.js";
>>>>>>> upstream/main

let defaultRegistryCache: Map<string, MediaUnderstandingProvider> | null = null;
const configRegistryCache = new Map<string, Map<string, MediaUnderstandingProvider>>();
const MAX_CONFIG_REGISTRY_CACHE_ENTRIES = 32;

<<<<<<< HEAD
export const DEFAULT_MAX_CHARS = 500;
export const DEFAULT_MAX_CHARS_BY_CAPABILITY: Record<
  MediaUnderstandingCapability,
  number | undefined
> = {
  image: DEFAULT_MAX_CHARS,
  audio: undefined,
  video: DEFAULT_MAX_CHARS,
};
export const DEFAULT_MAX_BYTES: Record<MediaUnderstandingCapability, number> = {
  image: 10 * MB,
  audio: 20 * MB,
  video: 50 * MB,
};
export const DEFAULT_TIMEOUT_SECONDS: Record<MediaUnderstandingCapability, number> = {
  image: 60,
  audio: 60,
  video: 120,
};
export const DEFAULT_PROMPT: Record<MediaUnderstandingCapability, string> = {
  image: "Describe the image.",
  audio: "Transcribe the audio.",
  video: "Describe the video.",
};
export const DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
export const CLI_OUTPUT_MAX_BUFFER = 5 * MB;
export const DEFAULT_MEDIA_CONCURRENCY = 2;

function providerSupportsCapability(
  provider: MediaUnderstandingProvider | undefined,
  capability: MediaUnderstandingCapability,
): boolean {
  if (!provider) {
    return false;
  }
  if (capability === "audio") {
    return Boolean(provider.transcribeAudio);
  }
  if (capability === "image") {
    return Boolean(provider.describeImage);
  }
  return Boolean(provider.describeVideo);
}

function resolveDefaultRegistry(cfg?: OpenClawConfig) {
  return buildMediaUnderstandingRegistry(undefined, cfg ?? ({} as OpenClawConfig));
}

=======
function cacheConfigRegistry(
  key: string,
  registry: Map<string, MediaUnderstandingProvider>,
): Map<string, MediaUnderstandingProvider> {
  // Config snapshots are process-stable enough for bounded reuse; cap entries so
  // tests and multi-workspace runs cannot grow this cache without limit.
  if (
    !configRegistryCache.has(key) &&
    configRegistryCache.size >= MAX_CONFIG_REGISTRY_CACHE_ENTRIES
  ) {
    const oldestKey = configRegistryCache.keys().next().value;
    if (oldestKey) {
      configRegistryCache.delete(oldestKey);
    }
  }
  configRegistryCache.set(key, registry);
  return registry;
}

function resolveDefaultRegistry(cfg?: OpenClawConfig, workspaceDir?: string) {
  if (!cfg) {
    defaultRegistryCache ??= buildMediaUnderstandingManifestMetadataRegistry();
    return defaultRegistryCache;
  }
  const cacheKey = `${resolveRuntimeConfigCacheKey(cfg)}:${workspaceDir ?? ""}`;
  const cached = configRegistryCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const registry = buildMediaUnderstandingManifestMetadataRegistry(cfg, workspaceDir);
  return cacheConfigRegistry(cacheKey, registry);
}

function providerHasDeclaredCapability(
  provider: MediaUnderstandingProvider | undefined,
  capability: MediaUnderstandingCapability,
): boolean {
  return (
    provider?.capabilities?.includes(capability) ?? providerSupportsCapability(provider, capability)
  );
}

function resolveConfiguredImageProviderModel(params: {
  cfg?: OpenClawConfig;
  providerId: string;
}): string | undefined {
  const normalizedProviderId = normalizeMediaProviderId(params.providerId);
  const providers = params.cfg?.models?.providers;
  if (!providers || typeof providers !== "object") {
    return undefined;
  }
  for (const [providerKey, providerCfg] of Object.entries(providers)) {
    if (normalizeMediaProviderId(providerKey) !== normalizedProviderId) {
      continue;
    }
    const models = providerCfg?.models ?? [];
    const match = models.find(
      (model) =>
        Boolean(normalizeOptionalString(model?.id)) &&
        Array.isArray(model?.input) &&
        model.input.includes("image"),
    );
    return normalizeOptionalString(match?.id);
  }
  return undefined;
}

function resolveConfiguredImageProviderIds(cfg?: OpenClawConfig): string[] {
  const providers = cfg?.models?.providers;
  if (!providers || typeof providers !== "object") {
    return [];
  }
  const configured: string[] = [];
  for (const [providerKey, providerCfg] of Object.entries(providers)) {
    const normalizedProviderId = normalizeMediaExecutionProviderId(providerKey);
    if (!normalizedProviderId || configured.includes(normalizedProviderId)) {
      continue;
    }
    const models = providerCfg?.models ?? [];
    const hasImageModel = models.some(
      (model) => Array.isArray(model?.input) && model.input.includes("image"),
    );
    if (hasImageModel) {
      configured.push(normalizedProviderId);
    }
  }
  return configured;
}

function isExecutionAliasProvider(providerId: string): boolean {
  return normalizeMediaProviderId(providerId) !== providerId;
}

function insertConfiguredImageProviders(params: {
  prioritized: string[];
  configured: string[];
}): string[] {
  const merged = [...params.prioritized];
  for (const providerId of params.configured.filter(isExecutionAliasProvider)) {
    const canonicalProviderId = normalizeMediaProviderId(providerId);
    const canonicalIndex = merged.indexOf(canonicalProviderId);
    if (canonicalIndex >= 0) {
      merged.splice(canonicalIndex, 0, providerId);
    } else {
      merged.unshift(providerId);
    }
  }
  for (const providerId of params.configured.filter((id) => !isExecutionAliasProvider(id))) {
    merged.push(providerId);
  }
  return uniqueStrings(merged);
}

/** Resolves the default provider model for a media capability from config or manifest metadata. */
>>>>>>> upstream/main
export function resolveDefaultMediaModel(params: {
  providerId: string;
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
<<<<<<< HEAD
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string | undefined {
  const registry = params.providerRegistry ?? resolveDefaultRegistry(params.cfg);
  const provider = registry.get(normalizeMediaProviderId(params.providerId));
  return provider?.defaultModels?.[params.capability]?.trim() || undefined;
}

export function resolveAutoMediaKeyProviders(params: {
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[] {
  const registry = params.providerRegistry ?? resolveDefaultRegistry(params.cfg);
=======
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
  includeConfiguredImageModels?: boolean;
}): string | undefined {
  if (!params.providerRegistry && params.includeConfiguredImageModels !== false) {
    const configuredImageModel =
      params.capability === "image"
        ? resolveConfiguredImageProviderModel({
            cfg: params.cfg,
            providerId: params.providerId,
          })
        : undefined;
    if (configuredImageModel) {
      return configuredImageModel;
    }
  }
  const registry =
    params.providerRegistry ?? resolveDefaultRegistry(params.cfg, params.workspaceDir);
  const provider = registry.get(normalizeMediaProviderId(params.providerId));
  const manifestDefaultModel = normalizeOptionalString(
    provider?.defaultModels?.[params.capability],
  );
  if (manifestDefaultModel) {
    return manifestDefaultModel;
  }
  return undefined;
}

/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
export function resolveAutoMediaKeyProviders(params: {
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[] {
  const registry =
    params.providerRegistry ?? resolveDefaultRegistry(params.cfg, params.workspaceDir);
>>>>>>> upstream/main
  type AutoProviderEntry = {
    provider: MediaUnderstandingProvider;
    priority: number;
  };
<<<<<<< HEAD
  return [...registry.values()]
    .filter((provider) => providerSupportsCapability(provider, params.capability))
=======
  const prioritized = [...registry.values()]
    .filter((provider) => providerHasDeclaredCapability(provider, params.capability))
>>>>>>> upstream/main
    .map((provider): AutoProviderEntry | null => {
      const priority = provider.autoPriority?.[params.capability];
      return typeof priority === "number" && Number.isFinite(priority)
        ? { provider, priority }
        : null;
    })
    .filter((entry): entry is AutoProviderEntry => entry !== null)
    .toSorted((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }
      return left.provider.id.localeCompare(right.provider.id);
    })
    .map((entry) => normalizeMediaProviderId(entry.provider.id))
    .filter(Boolean);
<<<<<<< HEAD
}

export function providerSupportsNativePdfDocument(params: {
  providerId: string;
  cfg?: OpenClawConfig;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): boolean {
  const registry = params.providerRegistry ?? resolveDefaultRegistry(params.cfg);
=======
  if (params.providerRegistry || params.capability !== "image") {
    return prioritized;
  }
  return insertConfiguredImageProviders({
    prioritized,
    configured: resolveConfiguredImageProviderIds(params.cfg),
  });
}

/** Returns whether provider metadata declares native PDF document input support. */
export function providerSupportsNativePdfDocument(params: {
  providerId: string;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): boolean {
  const registry =
    params.providerRegistry ?? resolveDefaultRegistry(params.cfg, params.workspaceDir);
>>>>>>> upstream/main
  const provider = registry.get(normalizeMediaProviderId(params.providerId));
  return provider?.nativeDocumentInputs?.includes("pdf") ?? false;
}

<<<<<<< HEAD
/**
 * Minimum audio file size in bytes below which transcription is skipped.
 * Files smaller than this threshold are almost certainly empty or corrupt
 * and would cause unhelpful API errors from Whisper/transcription providers.
 */
export const MIN_AUDIO_FILE_BYTES = 1024;
=======
/** Resolves provider-specific document model hints, preserving explicit unsupported markers. */
export function resolveDocumentMediaModel(params: {
  providerId: string;
  document: "pdf";
  mode: "textExtraction" | "image";
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string | false | undefined {
  const registry =
    params.providerRegistry ?? resolveDefaultRegistry(params.cfg, params.workspaceDir);
  const provider = registry.get(normalizeMediaProviderId(params.providerId));
  const value = provider?.documentModels?.[params.document]?.[params.mode];
  if (value === false) {
    return false;
  }
  return normalizeOptionalString(value);
}
>>>>>>> upstream/main
