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
import { parseMusicGenerationModelRef } from "./model-ref.js";
import { getMusicGenerationProvider, listMusicGenerationProviders } from "./provider-registry.js";
import type {
  GeneratedMusicAsset,
  MusicGenerationIgnoredOverride,
  MusicGenerationOutputFormat,
  MusicGenerationResult,
  MusicGenerationSourceImage,
} from "./types.js";

const log = createSubsystemLogger("music-generation");

export type GenerateMusicParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
};

export type GenerateMusicRuntimeResult = {
  tracks: GeneratedMusicAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  lyrics?: string[];
  metadata?: Record<string, unknown>;
  ignoredOverrides: MusicGenerationIgnoredOverride[];
};

export function listRuntimeMusicGenerationProviders(params?: { config?: OpenClawConfig }) {
  return listMusicGenerationProviders(params?.config);
}

function resolveProviderMusicGenerationOverrides(params: {
  provider: NonNullable<ReturnType<typeof getMusicGenerationProvider>>;
  model: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
}) {
  const caps = params.provider.capabilities;
  const ignoredOverrides: MusicGenerationIgnoredOverride[] = [];
  let lyrics = params.lyrics;
  let instrumental = params.instrumental;
  let durationSeconds = params.durationSeconds;
  let format = params.format;

  if (lyrics?.trim() && !caps.supportsLyrics) {
    ignoredOverrides.push({ key: "lyrics", value: lyrics });
    lyrics = undefined;
  }

  if (typeof instrumental === "boolean" && !caps.supportsInstrumental) {
    ignoredOverrides.push({ key: "instrumental", value: instrumental });
    instrumental = undefined;
  }

  if (typeof durationSeconds === "number" && !caps.supportsDuration) {
    ignoredOverrides.push({ key: "durationSeconds", value: durationSeconds });
    durationSeconds = undefined;
  }

  if (format) {
    const supportedFormats =
      caps.supportedFormatsByModel?.[params.model] ?? caps.supportedFormats ?? [];
    if (
      !caps.supportsFormat ||
      (supportedFormats.length > 0 && !supportedFormats.includes(format))
    ) {
      ignoredOverrides.push({ key: "format", value: format });
      format = undefined;
    }
  }

  return {
    lyrics,
    instrumental,
    durationSeconds,
    format,
    ignoredOverrides,
  };
}

export async function generateMusic(
  params: GenerateMusicParams,
): Promise<GenerateMusicRuntimeResult> {
=======
// Runs music generation requests through provider runtimes and fallbacks.
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import { resolveAgentModelTimeoutMsValue } from "../config/model-input.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  buildMediaGenerationNormalizationMetadata,
  buildNoCapabilityModelConfiguredMessage,
  recordCapabilityCandidateFailure,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
import { getProviderEnvVars } from "../secrets/provider-env-vars.js";
import { parseMusicGenerationModelRef } from "./model-ref.js";
import { resolveMusicGenerationOverrides } from "./normalization.js";
import { getMusicGenerationProvider, listMusicGenerationProviders } from "./provider-registry.js";
import type { GenerateMusicParams, GenerateMusicRuntimeResult } from "./runtime-types.js";
import type { MusicGenerationResult } from "./types.js";

/**
 * Music generation runtime orchestration.
 *
 * The runtime resolves provider/model candidates, applies capability-based
 * normalization, invokes providers, and records fallback attempts consistently
 * with other media generation capabilities.
 */
const log = createSubsystemLogger("music-generation");

/** Injectable dependencies used by tests and alternate runtime hosts. */
export type MusicGenerationRuntimeDeps = {
  getProvider?: typeof getMusicGenerationProvider;
  listProviders?: typeof listMusicGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug">;
};

export type { GenerateMusicParams, GenerateMusicRuntimeResult } from "./runtime-types.js";

/** List runtime-visible music generation providers for a config snapshot. */
export function listRuntimeMusicGenerationProviders(
  params?: { config?: OpenClawConfig },
  deps: MusicGenerationRuntimeDeps = {},
) {
  return (deps.listProviders ?? listMusicGenerationProviders)(params?.config);
}

/** Generate music with provider fallback and capability-aware request normalization. */
export async function generateMusic(
  params: GenerateMusicParams,
  deps: MusicGenerationRuntimeDeps = {},
): Promise<GenerateMusicRuntimeResult> {
  const getProvider = deps.getProvider ?? getMusicGenerationProvider;
  const listProviders = deps.listProviders ?? listMusicGenerationProviders;
  const logger = deps.log ?? log;
  const timeoutMs =
    params.timeoutMs ??
    resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.musicGenerationModel);
>>>>>>> upstream/main
  const candidates = resolveCapabilityModelCandidates({
    cfg: params.cfg,
    modelConfig: params.cfg.agents?.defaults?.musicGenerationModel,
    modelOverride: params.modelOverride,
    parseModelRef: parseMusicGenerationModelRef,
<<<<<<< HEAD
=======
    agentDir: params.agentDir,
    listProviders,
    autoProviderFallback: params.autoProviderFallback,
>>>>>>> upstream/main
  });
  if (candidates.length === 0) {
    throw new Error(
      buildNoCapabilityModelConfiguredMessage({
        capabilityLabel: "music-generation",
        modelConfigKey: "musicGenerationModel",
<<<<<<< HEAD
        providers: listMusicGenerationProviders(params.cfg),
        fallbackSampleRef: "google/lyria-3-clip-preview",
=======
        providers: listProviders(params.cfg),
        fallbackSampleRef: "google/lyria-3-clip-preview",
        getProviderEnvVars: deps.getProviderEnvVars,
>>>>>>> upstream/main
      }),
    );
  }

  const attempts: FallbackAttempt[] = [];
  let lastError: unknown;

  for (const candidate of candidates) {
<<<<<<< HEAD
    const provider = getMusicGenerationProvider(candidate.provider, params.cfg);
    if (!provider) {
=======
    const provider = getProvider(candidate.provider, params.cfg);
    if (!provider) {
      // Candidate resolution can include stale config refs; keep them in attempts for diagnostics.
>>>>>>> upstream/main
      const error = `No music-generation provider registered for ${candidate.provider}`;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error,
      });
      lastError = new Error(error);
      continue;
    }

    try {
<<<<<<< HEAD
      const sanitized = resolveProviderMusicGenerationOverrides({
=======
      const sanitized = resolveMusicGenerationOverrides({
>>>>>>> upstream/main
        provider,
        model: candidate.model,
        lyrics: params.lyrics,
        instrumental: params.instrumental,
        durationSeconds: params.durationSeconds,
        format: params.format,
<<<<<<< HEAD
=======
        inputImages: params.inputImages,
>>>>>>> upstream/main
      });
      const result: MusicGenerationResult = await provider.generateMusic({
        provider: candidate.provider,
        model: candidate.model,
        prompt: params.prompt,
        cfg: params.cfg,
        agentDir: params.agentDir,
        authStore: params.authStore,
        lyrics: sanitized.lyrics,
        instrumental: sanitized.instrumental,
        durationSeconds: sanitized.durationSeconds,
        format: sanitized.format,
        inputImages: params.inputImages,
<<<<<<< HEAD
=======
        ...(timeoutMs !== undefined ? { timeoutMs } : {}),
>>>>>>> upstream/main
      });
      if (!Array.isArray(result.tracks) || result.tracks.length === 0) {
        throw new Error("Music generation provider returned no tracks.");
      }
      return {
        tracks: result.tracks,
        provider: candidate.provider,
        model: result.model ?? candidate.model,
        attempts,
        lyrics: result.lyrics,
<<<<<<< HEAD
        metadata: result.metadata,
=======
        normalization: sanitized.normalization,
        metadata: {
          ...result.metadata,
          ...buildMediaGenerationNormalizationMetadata({
            normalization: sanitized.normalization,
          }),
        },
>>>>>>> upstream/main
        ignoredOverrides: sanitized.ignoredOverrides,
      };
    } catch (err) {
      lastError = err;
<<<<<<< HEAD
      const described = isFailoverError(err) ? describeFailoverError(err) : undefined;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error: described?.message ?? (err instanceof Error ? err.message : String(err)),
        reason: described?.reason,
        status: described?.status,
        code: described?.code,
      });
      log.debug(`music-generation candidate failed: ${candidate.provider}/${candidate.model}`);
    }
  }

  throwCapabilityGenerationFailure({
=======
      // Preserve failed candidates so callers can see which provider/model refs were tried.
      recordCapabilityCandidateFailure({
        attempts,
        provider: candidate.provider,
        model: candidate.model,
        error: err,
      });
      logger.debug(`music-generation candidate failed: ${candidate.provider}/${candidate.model}`);
    }
  }

  return throwCapabilityGenerationFailure({
>>>>>>> upstream/main
    capabilityLabel: "music generation",
    attempts,
    lastError,
  });
}
