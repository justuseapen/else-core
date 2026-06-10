<<<<<<< HEAD
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import type { OpenClawConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
import {
  normalizeVideoGenerationDuration,
  resolveVideoGenerationSupportedDurations,
} from "./duration-support.js";
import { parseVideoGenerationModelRef } from "./model-ref.js";
import { getVideoGenerationProvider, listVideoGenerationProviders } from "./provider-registry.js";
import type {
  GeneratedVideoAsset,
  VideoGenerationIgnoredOverride,
  VideoGenerationResolution,
  VideoGenerationResult,
  VideoGenerationSourceAsset,
} from "./types.js";

const log = createSubsystemLogger("video-generation");

export type GenerateVideoParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[];
};

export type GenerateVideoRuntimeResult = {
  videos: GeneratedVideoAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  metadata?: Record<string, unknown>;
  ignoredOverrides: VideoGenerationIgnoredOverride[];
};

function buildNoVideoGenerationModelConfiguredMessage(cfg: OpenClawConfig): string {
  return buildNoCapabilityModelConfiguredMessage({
    capabilityLabel: "video-generation",
    modelConfigKey: "videoGenerationModel",
    providers: listVideoGenerationProviders(cfg),
  });
}

export function listRuntimeVideoGenerationProviders(params?: { config?: OpenClawConfig }) {
  return listVideoGenerationProviders(params?.config);
}

function resolveProviderVideoGenerationOverrides(params: {
  provider: NonNullable<ReturnType<typeof getVideoGenerationProvider>>;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  audio?: boolean;
  watermark?: boolean;
}) {
  const caps = params.provider.capabilities;
  const ignoredOverrides: VideoGenerationIgnoredOverride[] = [];
  let size = params.size;
  let aspectRatio = params.aspectRatio;
  let resolution = params.resolution;
  let audio = params.audio;
  let watermark = params.watermark;

  if (size && !caps.supportsSize) {
    ignoredOverrides.push({ key: "size", value: size });
    size = undefined;
  }

  if (aspectRatio && !caps.supportsAspectRatio) {
    ignoredOverrides.push({ key: "aspectRatio", value: aspectRatio });
    aspectRatio = undefined;
  }

  if (resolution && !caps.supportsResolution) {
    ignoredOverrides.push({ key: "resolution", value: resolution });
    resolution = undefined;
  }

  if (typeof audio === "boolean" && !caps.supportsAudio) {
    ignoredOverrides.push({ key: "audio", value: audio });
    audio = undefined;
  }

  if (typeof watermark === "boolean" && !caps.supportsWatermark) {
    ignoredOverrides.push({ key: "watermark", value: watermark });
    watermark = undefined;
  }

  return {
    size,
    aspectRatio,
    resolution,
    audio,
    watermark,
    ignoredOverrides,
  };
=======
// Video generation runtime coordinates provider auth, fallbacks, and job polling.
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import { resolveAgentModelTimeoutMsValue } from "../config/model-input.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  buildMediaGenerationNormalizationMetadata,
  buildNoCapabilityModelConfiguredMessage,
  recordCapabilityCandidateFailure,
  resolveCapabilityModelCandidates,
  resolveMediaProviderRequestTimeoutMs,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
import { getProviderEnvVars } from "../secrets/provider-env-vars.js";
import { resolveVideoGenerationModeCapabilities } from "./capabilities.js";
import {
  buildReferenceInputCapabilityFailure,
  resolveProviderWithModelCapabilities,
} from "./capability-overlays.js";
import { resolveVideoGenerationSupportedDurations } from "./duration-support.js";
import { parseVideoGenerationModelRef } from "./model-ref.js";
import { resolveVideoGenerationOverrides } from "./normalization.js";
import { getVideoGenerationProvider, listVideoGenerationProviders } from "./provider-registry.js";
import type { GenerateVideoParams, GenerateVideoRuntimeResult } from "./runtime-types.js";
import type { VideoGenerationProviderOptionType, VideoGenerationResult } from "./types.js";

const log = createSubsystemLogger("video-generation");
const MODEL_CAPABILITY_LOOKUP_TIMEOUT_MS = 5_000;
// Internal request hint for providers that perform their own final snapping.
const SUPPORTED_DURATIONS_HINT = Symbol.for("openclaw.videoGeneration.supportedDurations");

export type VideoGenerationRuntimeDeps = {
  getProvider?: typeof getVideoGenerationProvider;
  listProviders?: typeof listVideoGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug" | "warn">;
};

export type { GenerateVideoParams, GenerateVideoRuntimeResult } from "./runtime-types.js";

/**
 * Validate agent-supplied providerOptions against the candidate's declared
 * schema. Returns a human-readable skip reason when the candidate cannot
 * accept the supplied options, or undefined when everything checks out.
 *
 * Backward-compatible behavior:
 * - Provider declares no schema (undefined): pass options through as-is.
 *   The provider receives them and may silently ignore unknown keys. This is
 *   the safe default for legacy / not-yet-migrated providers.
 * - Provider explicitly declares an empty schema ({}): rejects any options.
 *   This is the opt-in signal that the provider has been audited and truly
 *   supports no options.
 * - Provider declares a typed schema: validates each key name and value type,
 *   skipping the candidate on any mismatch.
 */
function validateProviderOptionsAgainstDeclaration(params: {
  providerId: string;
  model: string;
  providerOptions: Record<string, unknown>;
  declaration: Readonly<Record<string, VideoGenerationProviderOptionType>> | undefined;
}): string | undefined {
  const { providerId, model, providerOptions, declaration } = params;
  const keys = Object.keys(providerOptions);
  if (keys.length === 0) {
    return undefined;
  }
  if (declaration === undefined) {
    return undefined;
  }
  if (Object.keys(declaration).length === 0) {
    return `${providerId}/${model} does not accept providerOptions (caller supplied: ${keys.join(", ")}); skipping`;
  }
  const unknown = keys.filter((key) => !Object.hasOwn(declaration, key));
  if (unknown.length > 0) {
    const accepted = Object.keys(declaration).join(", ");
    return `${providerId}/${model} does not accept providerOptions keys: ${unknown.join(", ")} (accepted: ${accepted}); skipping`;
  }
  for (const key of keys) {
    const expected = declaration[key];
    const value = providerOptions[key];
    const actual = typeof value;
    if (expected === "number" && (actual !== "number" || !Number.isFinite(value as number))) {
      return `${providerId}/${model} expects providerOptions.${key} to be a finite number, got ${actual}; skipping`;
    }
    if (expected === "boolean" && actual !== "boolean") {
      return `${providerId}/${model} expects providerOptions.${key} to be a boolean, got ${actual}; skipping`;
    }
    if (expected === "string" && actual !== "string") {
      return `${providerId}/${model} expects providerOptions.${key} to be a string, got ${actual}; skipping`;
    }
  }
  return undefined;
}

function buildNoVideoGenerationModelConfiguredMessage(
  cfg: OpenClawConfig,
  deps: VideoGenerationRuntimeDeps,
): string {
  const listProviders = deps.listProviders ?? listVideoGenerationProviders;
  return buildNoCapabilityModelConfiguredMessage({
    capabilityLabel: "video-generation",
    modelConfigKey: "videoGenerationModel",
    providers: listProviders(cfg),
    getProviderEnvVars: deps.getProviderEnvVars,
  });
}

export function listRuntimeVideoGenerationProviders(
  params?: { config?: OpenClawConfig },
  deps: VideoGenerationRuntimeDeps = {},
) {
  return (deps.listProviders ?? listVideoGenerationProviders)(params?.config);
>>>>>>> upstream/main
}

export async function generateVideo(
  params: GenerateVideoParams,
<<<<<<< HEAD
): Promise<GenerateVideoRuntimeResult> {
=======
  deps: VideoGenerationRuntimeDeps = {},
): Promise<GenerateVideoRuntimeResult> {
  const getProvider = deps.getProvider ?? getVideoGenerationProvider;
  const listProviders = deps.listProviders ?? listVideoGenerationProviders;
  const logger = deps.log ?? log;
  const requestedTimeoutMs =
    params.timeoutMs ??
    resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.videoGenerationModel);
>>>>>>> upstream/main
  const candidates = resolveCapabilityModelCandidates({
    cfg: params.cfg,
    modelConfig: params.cfg.agents?.defaults?.videoGenerationModel,
    modelOverride: params.modelOverride,
    parseModelRef: parseVideoGenerationModelRef,
<<<<<<< HEAD
  });
  if (candidates.length === 0) {
    throw new Error(buildNoVideoGenerationModelConfiguredMessage(params.cfg));
=======
    agentDir: params.agentDir,
    listProviders,
    autoProviderFallback: params.autoProviderFallback,
  });
  if (candidates.length === 0) {
    throw new Error(buildNoVideoGenerationModelConfiguredMessage(params.cfg, deps));
>>>>>>> upstream/main
  }

  const attempts: FallbackAttempt[] = [];
  let lastError: unknown;
<<<<<<< HEAD

  for (const candidate of candidates) {
    const provider = getVideoGenerationProvider(candidate.provider, params.cfg);
=======
  let skipWarnEmitted = false;
  const warnOnFirstSkip = (reason: string) => {
    // Skip events are common in normal fallback flow, so log the *first* one in
    // a request at warn level with the reason, and leave the rest at debug.
    // This gives the operator visible feedback that their primary provider was
    // passed over without flooding logs on long fallback chains.
    if (!skipWarnEmitted) {
      skipWarnEmitted = true;
      logger.warn(`video-generation candidate skipped: ${reason}`);
    }
  };

  for (const candidate of candidates) {
    const provider = getProvider(candidate.provider, params.cfg);
>>>>>>> upstream/main
    if (!provider) {
      const error = `No video-generation provider registered for ${candidate.provider}`;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error,
      });
      lastError = new Error(error);
      continue;
    }
<<<<<<< HEAD

    try {
      const sanitized = resolveProviderVideoGenerationOverrides({
        provider,
        size: params.size,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        audio: params.audio,
        watermark: params.watermark,
      });
      const requestedDurationSeconds =
        typeof params.durationSeconds === "number" && Number.isFinite(params.durationSeconds)
          ? Math.max(1, Math.round(params.durationSeconds))
          : undefined;
      const normalizedDurationSeconds = normalizeVideoGenerationDuration({
        provider,
        model: candidate.model,
        durationSeconds: requestedDurationSeconds,
      });
      const supportedDurationSeconds = resolveVideoGenerationSupportedDurations({
        provider,
        model: candidate.model,
      });
      const result: VideoGenerationResult = await provider.generateVideo({
=======
    const timeoutMs = resolveMediaProviderRequestTimeoutMs({
      timeoutMs: requestedTimeoutMs,
      providerDefaultTimeoutMs: provider.defaultTimeoutMs,
    });
    const activeProvider = await resolveProviderWithModelCapabilities({
      provider,
      providerId: candidate.provider,
      model: candidate.model,
      cfg: params.cfg,
      agentDir: params.agentDir,
      authStore: params.authStore,
      timeoutMs: MODEL_CAPABILITY_LOOKUP_TIMEOUT_MS,
      log: logger,
    });

    // Guard: skip candidates that cannot satisfy reference-input counts so
    // we never silently drop audio/image/video refs by falling over to a
    // provider that ignores them and "succeeds" without the caller's assets.
    const inputImageCount = params.inputImages?.length ?? 0;
    const inputVideoCount = params.inputVideos?.length ?? 0;
    const inputAudioCount = params.inputAudios?.length ?? 0;
    const referenceInputMismatch = buildReferenceInputCapabilityFailure({
      providerId: candidate.provider,
      model: candidate.model,
      provider: activeProvider,
      inputImageCount,
      inputVideoCount,
      inputAudioCount,
    });
    if (referenceInputMismatch) {
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error: referenceInputMismatch,
      });
      lastError = new Error(referenceInputMismatch);
      warnOnFirstSkip(referenceInputMismatch);
      logger.debug(
        `video-generation candidate skipped (reference input capability): ${candidate.provider}/${candidate.model}`,
      );
      continue;
    }

    // Guard: skip candidates that do not accept the requested providerOptions keys,
    // or whose declared providerOptions schema does not match the supplied value
    // types. Same skip-in-fallback rationale as the audio guard above — we never
    // want to silently forward provider-specific options to the wrong provider,
    // but we also do not want to block valid fallback candidates that *do* accept
    // them. Providers opt in by declaring `capabilities.providerOptions` on the
    // active mode or on the flat provider capabilities.
    if (
      params.providerOptions &&
      typeof params.providerOptions === "object" &&
      Object.keys(params.providerOptions).length > 0
    ) {
      const { capabilities: optCaps } = resolveVideoGenerationModeCapabilities({
        provider: activeProvider,
        model: candidate.model,
        inputImageCount,
        inputVideoCount,
      });
      const declaredOptions =
        optCaps?.providerOptions ?? activeProvider.capabilities.providerOptions ?? undefined;
      const mismatch = validateProviderOptionsAgainstDeclaration({
        providerId: candidate.provider,
        model: candidate.model,
        providerOptions: params.providerOptions,
        declaration: declaredOptions,
      });
      if (mismatch) {
        attempts.push({ provider: candidate.provider, model: candidate.model, error: mismatch });
        lastError = new Error(mismatch);
        warnOnFirstSkip(mismatch);
        logger.debug(
          `video-generation candidate skipped (providerOptions): ${candidate.provider}/${candidate.model}`,
        );
        continue;
      }
    }

    // Guard: skip candidates whose maxDurationSeconds hard cap is below the requested
    // duration. Only applies when the provider uses a simple max with no explicit
    // supported-durations list — when a list exists, runtime normalization snaps to the
    // nearest valid value so skipping is not appropriate.
    const supportedDurations = resolveVideoGenerationSupportedDurations({
      provider: activeProvider,
      model: candidate.model,
      inputImageCount,
      inputVideoCount,
    });
    const requestedDuration = params.durationSeconds;
    if (typeof requestedDuration === "number" && Number.isFinite(requestedDuration)) {
      const { capabilities: durCaps } = resolveVideoGenerationModeCapabilities({
        provider: activeProvider,
        model: candidate.model,
        inputImageCount,
        inputVideoCount,
      });
      const maxDuration =
        durCaps?.maxDurationSeconds ?? activeProvider.capabilities.maxDurationSeconds;
      if (
        !supportedDurations &&
        typeof maxDuration === "number" &&
        // Compare the normalized (rounded) duration, not the raw float, since
        // resolveVideoGenerationOverrides applies Math.round before sending to the provider.
        // A request for 4.4s against maxDurationSeconds=4 rounds to 4 and is valid.
        Math.round(requestedDuration) > maxDuration
      ) {
        const error = `${candidate.provider}/${candidate.model} supports at most ${maxDuration}s per video, ${requestedDuration}s requested; skipping`;
        attempts.push({ provider: candidate.provider, model: candidate.model, error });
        lastError = new Error(error);
        warnOnFirstSkip(error);
        logger.debug(
          `video-generation candidate skipped (duration capability): ${candidate.provider}/${candidate.model}`,
        );
        continue;
      }
    }

    try {
      const sanitized = resolveVideoGenerationOverrides({
        provider: activeProvider,
        model: candidate.model,
        size: params.size,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        durationSeconds: params.durationSeconds,
        audio: params.audio,
        watermark: params.watermark,
        inputImageCount,
        inputVideoCount,
      });
      const generationRequest: Parameters<typeof provider.generateVideo>[0] & {
        [SUPPORTED_DURATIONS_HINT]?: readonly number[];
      } = {
>>>>>>> upstream/main
        provider: candidate.provider,
        model: candidate.model,
        prompt: params.prompt,
        cfg: params.cfg,
        agentDir: params.agentDir,
        authStore: params.authStore,
        size: sanitized.size,
        aspectRatio: sanitized.aspectRatio,
        resolution: sanitized.resolution,
<<<<<<< HEAD
        durationSeconds: normalizedDurationSeconds,
=======
        durationSeconds: sanitized.durationSeconds,
>>>>>>> upstream/main
        audio: sanitized.audio,
        watermark: sanitized.watermark,
        inputImages: params.inputImages,
        inputVideos: params.inputVideos,
<<<<<<< HEAD
      });
      if (!Array.isArray(result.videos) || result.videos.length === 0) {
        throw new Error("Video generation provider returned no videos.");
      }
=======
        inputAudios: params.inputAudios,
        providerOptions: params.providerOptions,
        ...(timeoutMs !== undefined ? { timeoutMs } : {}),
      };
      if (supportedDurations) {
        generationRequest[SUPPORTED_DURATIONS_HINT] = supportedDurations;
      }
      const result: VideoGenerationResult = await provider.generateVideo(generationRequest);
      if (!Array.isArray(result.videos) || result.videos.length === 0) {
        throw new Error("Video generation provider returned no videos.");
      }
      for (const [index, video] of result.videos.entries()) {
        if (!video.buffer && !video.url) {
          throw new Error(
            `Video generation provider returned an undeliverable asset at index ${index}: neither buffer nor url is set.`,
          );
        }
      }
>>>>>>> upstream/main
      return {
        videos: result.videos,
        provider: candidate.provider,
        model: result.model ?? candidate.model,
        attempts,
<<<<<<< HEAD
        ignoredOverrides: sanitized.ignoredOverrides,
        metadata:
          typeof requestedDurationSeconds === "number" &&
          typeof normalizedDurationSeconds === "number" &&
          requestedDurationSeconds !== normalizedDurationSeconds
            ? {
                ...result.metadata,
                requestedDurationSeconds,
                normalizedDurationSeconds,
                ...(supportedDurationSeconds ? { supportedDurationSeconds } : {}),
              }
            : result.metadata,
      };
    } catch (err) {
      lastError = err;
      const described = isFailoverError(err) ? describeFailoverError(err) : undefined;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error: described?.message ?? (err instanceof Error ? err.message : String(err)),
        reason: described?.reason,
        status: described?.status,
        code: described?.code,
      });
      log.debug(`video-generation candidate failed: ${candidate.provider}/${candidate.model}`);
    }
  }

  throwCapabilityGenerationFailure({
=======
        normalization: sanitized.normalization,
        ignoredOverrides: sanitized.ignoredOverrides,
        metadata: {
          ...result.metadata,
          ...buildMediaGenerationNormalizationMetadata({
            normalization: sanitized.normalization,
            requestedSizeForDerivedAspectRatio: params.size,
            includeSupportedDurationSeconds: true,
          }),
        },
      };
    } catch (err) {
      lastError = err;
      recordCapabilityCandidateFailure({
        attempts,
        provider: candidate.provider,
        model: candidate.model,
        error: err,
      });
      logger.debug(`video-generation candidate failed: ${candidate.provider}/${candidate.model}`);
    }
  }

  return throwCapabilityGenerationFailure({
>>>>>>> upstream/main
    capabilityLabel: "video generation",
    attempts,
    lastError,
  });
}
