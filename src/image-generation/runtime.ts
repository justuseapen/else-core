/** Runtime entrypoint for image generation with provider fallback and override normalization. */
import { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
=======
import { resolveAgentModelTimeoutMsValue } from "../config/model-input.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { formatErrorMessage } from "../infra/errors.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  buildMediaGenerationNormalizationMetadata,
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  resolveMediaProviderRequestTimeoutMs,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
import { getProviderEnvVars } from "../secrets/provider-env-vars.js";
>>>>>>> upstream/main
import { parseImageGenerationModelRef } from "./model-ref.js";
import { resolveImageGenerationOverrides } from "./normalization.js";
import { getImageGenerationProvider, listImageGenerationProviders } from "./provider-registry.js";
<<<<<<< HEAD
import type {
  GeneratedImageAsset,
  ImageGenerationIgnoredOverride,
  ImageGenerationResolution,
  ImageGenerationResult,
  ImageGenerationSourceImage,
} from "./types.js";
=======
import type { GenerateImageParams, GenerateImageRuntimeResult } from "./runtime-types.js";
import type { ImageGenerationResult } from "./types.js";
>>>>>>> upstream/main

const log = createSubsystemLogger("image-generation");

// Runtime dependency seam for tests and plugin-host callers. Production uses
// the plugin registry and provider-env helpers by default.
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
export type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "warn">;
};

<<<<<<< HEAD
export type GenerateImageRuntimeResult = {
  images: GeneratedImageAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  metadata?: Record<string, unknown>;
  ignoredOverrides: ImageGenerationIgnoredOverride[];
};

function buildNoImageGenerationModelConfiguredMessage(cfg: OpenClawConfig): string {
  return buildNoCapabilityModelConfiguredMessage({
    capabilityLabel: "image-generation",
    modelConfigKey: "imageGenerationModel",
    providers: listImageGenerationProviders(cfg),
  });
}

export function listRuntimeImageGenerationProviders(params?: { config?: OpenClawConfig }) {
  return listImageGenerationProviders(params?.config);
=======
export type { GenerateImageParams, GenerateImageRuntimeResult } from "./runtime-types.js";

function buildNoImageGenerationModelConfiguredMessage(
  cfg: OpenClawConfig,
  deps: ImageGenerationRuntimeDeps,
): string {
  const listProviders = deps.listProviders ?? listImageGenerationProviders;
  return buildNoCapabilityModelConfiguredMessage({
    capabilityLabel: "image-generation",
    modelConfigKey: "imageGenerationModel",
    providers: listProviders(cfg),
    getProviderEnvVars: deps.getProviderEnvVars,
  });
}

/** Lists image-generation providers visible for the current config. */
export function listRuntimeImageGenerationProviders(
  params?: { config?: OpenClawConfig },
  deps: ImageGenerationRuntimeDeps = {},
) {
  return (deps.listProviders ?? listImageGenerationProviders)(params?.config);
>>>>>>> upstream/main
}

function resolveProviderImageGenerationOverrides(params: {
  provider: NonNullable<ReturnType<typeof getImageGenerationProvider>>;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution;
  inputImages?: ImageGenerationSourceImage[];
}) {
  const hasInputImages = (params.inputImages?.length ?? 0) > 0;
  const modeCaps = hasInputImages
    ? params.provider.capabilities.edit
    : params.provider.capabilities.generate;
  const geometry = params.provider.capabilities.geometry;
  const ignoredOverrides: ImageGenerationIgnoredOverride[] = [];
  let size = params.size;
  let aspectRatio = params.aspectRatio;
  let resolution = params.resolution;

  if (
    size &&
    (!modeCaps.supportsSize ||
      ((geometry?.sizes?.length ?? 0) > 0 && !geometry?.sizes?.includes(size)))
  ) {
    ignoredOverrides.push({ key: "size", value: size });
    size = undefined;
  }

  if (
    aspectRatio &&
    (!modeCaps.supportsAspectRatio ||
      ((geometry?.aspectRatios?.length ?? 0) > 0 && !geometry?.aspectRatios?.includes(aspectRatio)))
  ) {
    ignoredOverrides.push({ key: "aspectRatio", value: aspectRatio });
    aspectRatio = undefined;
  }

  if (
    resolution &&
    (!modeCaps.supportsResolution ||
      ((geometry?.resolutions?.length ?? 0) > 0 && !geometry?.resolutions?.includes(resolution)))
  ) {
    ignoredOverrides.push({ key: "resolution", value: resolution });
    resolution = undefined;
  }

  return {
    size,
    aspectRatio,
    resolution,
    ignoredOverrides,
  };
}

export async function generateImage(
  params: GenerateImageParams,
  deps: ImageGenerationRuntimeDeps = {},
): Promise<GenerateImageRuntimeResult> {
<<<<<<< HEAD
=======
  const getProvider = deps.getProvider ?? getImageGenerationProvider;
  const listProviders = deps.listProviders ?? listImageGenerationProviders;
  const logger = deps.log ?? log;
  const requestedTimeoutMs =
    params.timeoutMs ??
    resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.imageGenerationModel);
>>>>>>> upstream/main
  const candidates = resolveCapabilityModelCandidates({
    cfg: params.cfg,
    modelConfig: params.cfg.agents?.defaults?.imageGenerationModel,
    modelOverride: params.modelOverride,
    parseModelRef: parseImageGenerationModelRef,
<<<<<<< HEAD
=======
    agentDir: params.agentDir,
    listProviders,
    autoProviderFallback: params.autoProviderFallback,
>>>>>>> upstream/main
  });
  if (candidates.length === 0) {
    throw new Error(buildNoImageGenerationModelConfiguredMessage(params.cfg, deps));
  }

  const attempts: FallbackAttempt[] = [];
  let lastError: unknown;

  // Try configured/fallback models in order and return the first provider that
  // yields at least one image; failed attempts are preserved for diagnostics.
  for (const candidate of candidates) {
    const provider = getProvider(candidate.provider, params.cfg);
    if (!provider) {
      const error = `No image-generation provider registered for ${candidate.provider}`;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error,
      });
      lastError = new Error(error);
      logger.warn(
        `image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${error}`,
      );
      continue;
    }

    try {
<<<<<<< HEAD
      const sanitized = resolveProviderImageGenerationOverrides({
        provider,
        size: params.size,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        inputImages: params.inputImages,
      });
=======
      const timeoutMs = resolveMediaProviderRequestTimeoutMs({
        timeoutMs: requestedTimeoutMs,
        providerDefaultTimeoutMs: provider.defaultTimeoutMs,
      });
      const sanitized = resolveImageGenerationOverrides({
        provider,
        model: candidate.model,
        size: params.size,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        quality: params.quality,
        outputFormat: params.outputFormat,
        background: params.background,
        inputImages: params.inputImages,
      });
      // Providers receive only supported overrides. Ignored/normalized values
      // are returned to callers so user-facing replies can explain adjustments.
>>>>>>> upstream/main
      const result: ImageGenerationResult = await provider.generateImage({
        provider: candidate.provider,
        model: candidate.model,
        prompt: params.prompt,
        cfg: params.cfg,
        agentDir: params.agentDir,
        authStore: params.authStore,
        count: params.count,
        size: sanitized.size,
        aspectRatio: sanitized.aspectRatio,
        resolution: sanitized.resolution,
<<<<<<< HEAD
=======
        quality: sanitized.quality,
        outputFormat: sanitized.outputFormat,
        background: sanitized.background,
>>>>>>> upstream/main
        inputImages: params.inputImages,
        ...(timeoutMs !== undefined ? { timeoutMs } : {}),
        providerOptions: params.providerOptions,
        ssrfPolicy: params.ssrfPolicy,
      });
      if (!Array.isArray(result.images) || result.images.length === 0) {
        throw new Error("Image generation provider returned no images.");
      }
      return {
        images: result.images,
        provider: candidate.provider,
        model: result.model ?? candidate.model,
        attempts,
<<<<<<< HEAD
        metadata: result.metadata,
=======
        normalization: sanitized.normalization,
        metadata: {
          ...result.metadata,
          ...buildMediaGenerationNormalizationMetadata({
            normalization: sanitized.normalization,
            requestedSizeForDerivedAspectRatio: params.size,
          }),
        },
>>>>>>> upstream/main
        ignoredOverrides: sanitized.ignoredOverrides,
      };
    } catch (err) {
      lastError = err;
      const described = isFailoverError(err) ? describeFailoverError(err) : undefined;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error: described?.message ?? formatErrorMessage(err),
        reason: described?.reason,
        status: described?.status,
        code: described?.code,
      });
      logger.warn(
        `image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${
          described?.message ?? formatErrorMessage(err)
        }`,
      );
    }
  }

<<<<<<< HEAD
  throwCapabilityGenerationFailure({
=======
  return throwCapabilityGenerationFailure({
>>>>>>> upstream/main
    capabilityLabel: "image generation",
    attempts,
    lastError,
  });
}
