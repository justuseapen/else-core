<<<<<<< HEAD
import { Type } from "@sinclair/typebox";
import type { OpenClawConfig } from "../../config/config.js";
import { loadConfig } from "../../config/config.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import { saveMediaBuffer } from "../../media/store.js";
import { loadWebMedia } from "../../media/web-media.js";
=======
/**
 * music_generate built-in tool.
 *
 * Resolves music providers/options, saves generated tracks, and supports detached background runs.
 */
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import { Type } from "typebox";
import { getRuntimeConfig } from "../../config/config.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SsrFPolicy } from "../../infra/net/ssrf.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import { resolveGeneratedMediaMaxBytes } from "../../media/configured-max-bytes.js";
import {
  classifyMediaReferenceSource,
  normalizeMediaReferenceSource,
} from "../../media/media-reference.js";
import { saveMediaBuffer } from "../../media/store.js";
import { loadWebMedia } from "../../media/web-media.js";
import { resolveMusicGenerationModeCapabilities } from "../../music-generation/capabilities.js";
>>>>>>> upstream/main
import { parseMusicGenerationModelRef } from "../../music-generation/model-ref.js";
import {
  generateMusic,
  listRuntimeMusicGenerationProviders,
} from "../../music-generation/runtime.js";
import type { MusicGenerationOutputFormat } from "../../music-generation/types.js";
import type {
  MusicGenerationProvider,
  MusicGenerationSourceImage,
} from "../../music-generation/types.js";
import { readSnakeCaseParamRaw } from "../../param-key.js";
import { resolveUserPath } from "../../utils.js";
import type { DeliveryContext } from "../../utils/delivery-context.js";
<<<<<<< HEAD
import {
  ToolInputError,
  readNumberParam,
  readStringArrayParam,
  readStringParam,
} from "./common.js";
import { decodeDataUrl } from "./image-tool.helpers.js";
import {
  applyMusicGenerationModelConfigDefaults,
  findCapabilityProviderById,
  resolveCapabilityModelConfigForTool,
  resolveMediaToolLocalRoots,
} from "./media-tool-shared.js";
import { type ToolModelConfig } from "./model-config.helpers.js";
=======
import { buildTimeoutAbortSignal } from "../../utils/fetch-timeout.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
import {
  formatGeneratedAttachmentLines,
  type AgentGeneratedAttachment,
} from "../generated-attachments.js";
import {
  buildMediaGenerationRequestKey,
  recordRecentMediaGenerationTaskStartForSession,
} from "../media-generation-task-status-shared.js";
import { ToolInputError, readNumberParam, readStringParam } from "./common.js";
import { decodeDataUrl } from "./image-tool.helpers.js";
import {
  buildMediaGenerationStartedToolResult,
  createDefaultMediaGenerateBackgroundScheduler,
  notifyMediaGenerationAsyncTaskStarted,
  scheduleMediaGenerationTaskCompletion,
  shouldDetachMediaGenerationTask,
  type MediaGenerateAsyncStartCallback,
  type MediaGenerateBackgroundScheduler,
} from "./media-generate-background-shared.js";
import {
  applyMusicGenerationModelConfigDefaults,
  buildMediaReferenceDetails,
  buildTaskRunDetails,
  hasGenerationToolAvailability,
  normalizeMediaReferenceInputs,
  readBooleanToolParam,
  resolveCapabilityModelConfigForTool,
  resolveGenerateAction,
  resolveMediaToolLocalRoots,
  resolveRemoteMediaSsrfPolicy,
  resolveSelectedCapabilityProvider,
} from "./media-tool-shared.js";
import {
  coerceToolModelConfig,
  hasToolModelConfig,
  type ToolModelConfig,
} from "./model-config.helpers.js";
>>>>>>> upstream/main
import {
  completeMusicGenerationTaskRun,
  createMusicGenerationTaskRun,
  failMusicGenerationTaskRun,
<<<<<<< HEAD
  recordMusicGenerationTaskProgress,
  type MusicGenerationTaskHandle,
  wakeMusicGenerationTaskCompletion,
=======
  musicGenerationTaskLifecycle,
  recordMusicGenerationTaskProgress,
  type MusicGenerationTaskHandle,
>>>>>>> upstream/main
} from "./music-generate-background.js";
import {
  createMusicGenerateDuplicateGuardResult,
  createMusicGenerateListActionResult,
  createMusicGenerateStatusActionResult,
} from "./music-generate-tool.actions.js";
import {
  createSandboxBridgeReadFile,
  resolveSandboxedBridgeMediaPath,
  type AnyAgentTool,
  type SandboxFsBridge,
  type ToolFsPolicy,
} from "./tool-runtime.helpers.js";

const log = createSubsystemLogger("agents/tools/music-generate");
const MAX_INPUT_IMAGES = 10;
const SUPPORTED_OUTPUT_FORMATS = new Set<MusicGenerationOutputFormat>(["mp3", "wav"]);
<<<<<<< HEAD
=======
const DEFAULT_REFERENCE_FETCH_TIMEOUT_MS = 30_000;
const DEFAULT_MUSIC_GENERATION_TIMEOUT_MS = 300_000;
const MIN_MUSIC_GENERATION_TIMEOUT_MS = 120_000;
>>>>>>> upstream/main

const MusicGenerateToolSchema = Type.Object({
  action: Type.Optional(
    Type.String({
<<<<<<< HEAD
      description:
        'Optional action: "generate" (default), "status" to inspect the active session task, or "list" to inspect available providers/models.',
    }),
  ),
  prompt: Type.Optional(Type.String({ description: "Music generation prompt." })),
  lyrics: Type.Optional(
    Type.String({
      description: "Optional lyrics to guide sung output when the provider supports it.",
=======
      description: '"generate" default, "status" active task, "list" providers/models.',
    }),
  ),
  prompt: Type.Optional(Type.String({ description: "Music prompt: style, genre, mood, purpose." })),
  lyrics: Type.Optional(
    Type.String({
      description:
        "Exact sung lyrics only when the user supplies lyrics or asks for vocal words. For song/style requests, use prompt instead.",
>>>>>>> upstream/main
    }),
  ),
  instrumental: Type.Optional(
    Type.Boolean({
<<<<<<< HEAD
      description: "Optional toggle for instrumental-only output when the provider supports it.",
=======
      description: "Instrumental-only toggle.",
>>>>>>> upstream/main
    }),
  ),
  image: Type.Optional(
    Type.String({
<<<<<<< HEAD
      description: "Optional single reference image path or URL.",
=======
      description: "Reference image path/URL.",
>>>>>>> upstream/main
    }),
  ),
  images: Type.Optional(
    Type.Array(Type.String(), {
<<<<<<< HEAD
      description: `Optional reference images (up to ${MAX_INPUT_IMAGES}).`,
=======
      description: `Reference images; max ${MAX_INPUT_IMAGES}.`,
>>>>>>> upstream/main
    }),
  ),
  model: Type.Optional(
    Type.String({
<<<<<<< HEAD
      description: "Optional provider/model override, e.g. google/lyria-3-pro-preview.",
    }),
  ),
  durationSeconds: Type.Optional(
    Type.Number({
      description: "Optional target duration in seconds when the provider supports duration hints.",
=======
      description: "Provider/model override, e.g. google/lyria-3-pro-preview.",
    }),
  ),
  durationSeconds: Type.Optional(
    Type.Integer({
      description: "Target seconds; provider may clamp.",
>>>>>>> upstream/main
      minimum: 1,
    }),
  ),
  format: Type.Optional(
    Type.String({
<<<<<<< HEAD
      description: 'Optional output format hint: "mp3" or "wav" when the provider supports it.',
=======
      description: "Output format: mp3, wav.",
>>>>>>> upstream/main
    }),
  ),
  filename: Type.Optional(
    Type.String({
<<<<<<< HEAD
      description:
        "Optional output filename hint. OpenClaw preserves the basename and saves under its managed media directory.",
=======
      description: "Output filename hint; basename preserved in managed media dir.",
>>>>>>> upstream/main
    }),
  ),
});

<<<<<<< HEAD
export function resolveMusicGenerationModelConfigForTool(params: {
  cfg?: OpenClawConfig;
  agentDir?: string;
}): ToolModelConfig | null {
  return resolveCapabilityModelConfigForTool({
    cfg: params.cfg,
    agentDir: params.agentDir,
    modelConfig: params.cfg?.agents?.defaults?.musicGenerationModel,
    providers: listRuntimeMusicGenerationProviders({ config: params.cfg }),
  });
}

=======
function resolveMusicGenerationModelConfigForTool(params: {
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
}): ToolModelConfig | null {
  return resolveCapabilityModelConfigForTool({
    cfg: params.cfg,
    workspaceDir: params.workspaceDir,
    agentDir: params.agentDir,
    authStore: params.authStore,
    modelConfig: params.cfg?.agents?.defaults?.musicGenerationModel,
    providers: () => listRuntimeMusicGenerationProviders({ config: params.cfg }),
  });
}

function hasExplicitMusicGenerationModelConfig(cfg?: OpenClawConfig): boolean {
  return hasToolModelConfig(coerceToolModelConfig(cfg?.agents?.defaults?.musicGenerationModel));
}

>>>>>>> upstream/main
function resolveSelectedMusicGenerationProvider(params: {
  config?: OpenClawConfig;
  musicGenerationModelConfig: ToolModelConfig;
  modelOverride?: string;
}): MusicGenerationProvider | undefined {
<<<<<<< HEAD
  const selectedRef =
    parseMusicGenerationModelRef(params.modelOverride) ??
    parseMusicGenerationModelRef(params.musicGenerationModelConfig.primary);
  if (!selectedRef) {
    return undefined;
  }
  return findCapabilityProviderById({
    providers: listRuntimeMusicGenerationProviders({ config: params.config }),
    providerId: selectedRef.provider,
=======
  return resolveSelectedCapabilityProvider({
    providers: listRuntimeMusicGenerationProviders({ config: params.config }),
    modelConfig: params.musicGenerationModelConfig,
    modelOverride: params.modelOverride,
    parseModelRef: parseMusicGenerationModelRef,
>>>>>>> upstream/main
  });
}

function resolveAction(args: Record<string, unknown>): "generate" | "list" | "status" {
<<<<<<< HEAD
  const raw = readStringParam(args, "action");
  if (!raw) {
    return "generate";
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === "generate" || normalized === "list" || normalized === "status") {
    return normalized;
  }
  throw new ToolInputError('action must be "generate", "status", or "list"');
}

function readBooleanParam(params: Record<string, unknown>, key: string): boolean | undefined {
  const raw = readSnakeCaseParamRaw(params, key);
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return undefined;
}

function normalizeOutputFormat(raw: string | undefined): MusicGenerationOutputFormat | undefined {
  const normalized = raw?.trim().toLowerCase() as MusicGenerationOutputFormat | undefined;
=======
  return resolveGenerateAction({
    args,
    allowed: ["generate", "status", "list"],
    defaultAction: "generate",
  });
}

function normalizeOutputFormat(raw: string | undefined): MusicGenerationOutputFormat | undefined {
  const normalized = normalizeOptionalLowercaseString(raw) as
    | MusicGenerationOutputFormat
    | undefined;
>>>>>>> upstream/main
  if (!normalized) {
    return undefined;
  }
  if (SUPPORTED_OUTPUT_FORMATS.has(normalized)) {
    return normalized;
  }
  throw new ToolInputError('format must be one of "mp3" or "wav"');
}

function normalizeReferenceImageInputs(args: Record<string, unknown>): string[] {
<<<<<<< HEAD
  const single = readStringParam(args, "image");
  const multiple = readStringArrayParam(args, "images");
  const combined = [...(single ? [single] : []), ...(multiple ?? [])];
  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const candidate of combined) {
    const trimmed = candidate.trim();
    const dedupe = trimmed.startsWith("@") ? trimmed.slice(1).trim() : trimmed;
    if (!dedupe || seen.has(dedupe)) {
      continue;
    }
    seen.add(dedupe);
    deduped.push(trimmed);
  }
  if (deduped.length > MAX_INPUT_IMAGES) {
    throw new ToolInputError(
      `Too many reference images: ${deduped.length} provided, maximum is ${MAX_INPUT_IMAGES}.`,
    );
  }
  return deduped;
=======
  return normalizeMediaReferenceInputs({
    args,
    singularKey: "image",
    pluralKey: "images",
    maxCount: MAX_INPUT_IMAGES,
    label: "reference images",
  });
>>>>>>> upstream/main
}

function validateMusicGenerationCapabilities(params: {
  provider: MusicGenerationProvider | undefined;
  model?: string;
  inputImageCount: number;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
}) {
  const provider = params.provider;
  if (!provider) {
    return;
  }
<<<<<<< HEAD
  const caps = provider.capabilities;
  if (params.inputImageCount > 0) {
    const maxInputImages = caps.maxInputImages ?? MAX_INPUT_IMAGES;
=======
  const { capabilities: caps } = resolveMusicGenerationModeCapabilities({
    provider,
    inputImageCount: params.inputImageCount,
  });
  if (params.inputImageCount > 0) {
    if (!caps) {
      throw new ToolInputError(`${provider.id} does not support reference-image edit inputs.`);
    }
    if ("enabled" in caps && !caps.enabled) {
      throw new ToolInputError(`${provider.id} does not support reference-image edit inputs.`);
    }
    const maxInputImages =
      ("maxInputImages" in caps ? caps.maxInputImages : undefined) ?? MAX_INPUT_IMAGES;
>>>>>>> upstream/main
    if (params.inputImageCount > maxInputImages) {
      throw new ToolInputError(
        `${provider.id} supports at most ${maxInputImages} reference image${maxInputImages === 1 ? "" : "s"}.`,
      );
    }
  }
<<<<<<< HEAD
  if (
    typeof params.durationSeconds === "number" &&
    caps.supportsDuration &&
    typeof caps.maxDurationSeconds === "number"
  ) {
    if (params.durationSeconds > caps.maxDurationSeconds) {
      throw new ToolInputError(
        `${provider.id} supports at most ${caps.maxDurationSeconds} seconds per track.`,
      );
    }
  }
=======
>>>>>>> upstream/main
}

type MusicGenerateSandboxConfig = {
  root: string;
  bridge: SandboxFsBridge;
};

<<<<<<< HEAD
type MusicGenerateBackgroundScheduler = (work: () => Promise<void>) => void;

function defaultScheduleMusicGenerateBackgroundWork(work: () => Promise<void>) {
  queueMicrotask(() => {
    void work().catch((error) => {
      log.error("Detached music generation job crashed", {
        error,
      });
    });
  });
}

=======
type MusicGenerationTimeoutNormalization = {
  requested: number;
  applied: number;
  minimum: number;
};

function normalizeMusicGenerationTimeoutMs(timeoutMs: number | undefined): {
  timeoutMs?: number;
  normalization?: MusicGenerationTimeoutNormalization;
  message?: string;
} {
  if (timeoutMs === undefined) {
    return { timeoutMs: DEFAULT_MUSIC_GENERATION_TIMEOUT_MS };
  }
  if (timeoutMs >= MIN_MUSIC_GENERATION_TIMEOUT_MS) {
    return { timeoutMs };
  }

  const normalization = {
    requested: timeoutMs,
    applied: MIN_MUSIC_GENERATION_TIMEOUT_MS,
    minimum: MIN_MUSIC_GENERATION_TIMEOUT_MS,
  };
  const message = `Timeout normalized: requested ${timeoutMs}ms; used ${MIN_MUSIC_GENERATION_TIMEOUT_MS}ms.`;
  log.warn("music_generate timeoutMs is below provider minimum; using minimum", {
    requestedTimeoutMs: timeoutMs,
    appliedTimeoutMs: MIN_MUSIC_GENERATION_TIMEOUT_MS,
    minimumTimeoutMs: MIN_MUSIC_GENERATION_TIMEOUT_MS,
  });
  return {
    timeoutMs: MIN_MUSIC_GENERATION_TIMEOUT_MS,
    normalization,
    message,
  };
}

const defaultScheduleMusicGenerateBackgroundWork = createDefaultMediaGenerateBackgroundScheduler({
  toolName: "music_generate",
  onCrash: (message, meta) => log.error(message, meta),
});

>>>>>>> upstream/main
async function loadReferenceImages(params: {
  inputs: string[];
  workspaceDir?: string;
  sandboxConfig: { root: string; bridge: SandboxFsBridge; workspaceOnly: boolean } | null;
<<<<<<< HEAD
=======
  ssrfPolicy?: SsrFPolicy;
  timeoutMs?: number;
>>>>>>> upstream/main
}): Promise<
  Array<{
    sourceImage: MusicGenerationSourceImage;
    resolvedInput: string;
    rewrittenFrom?: string;
  }>
> {
  const loaded: Array<{
    sourceImage: MusicGenerationSourceImage;
    resolvedInput: string;
    rewrittenFrom?: string;
  }> = [];

  for (const rawInput of params.inputs) {
    const trimmed = rawInput.trim();
<<<<<<< HEAD
    const inputRaw = trimmed.startsWith("@") ? trimmed.slice(1).trim() : trimmed;
    if (!inputRaw) {
      throw new ToolInputError("image required (empty string in array)");
    }
    const looksLikeWindowsDrivePath = /^[a-zA-Z]:[\\/]/.test(inputRaw);
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(inputRaw);
    const isFileUrl = /^file:/i.test(inputRaw);
    const isHttpUrl = /^https?:\/\//i.test(inputRaw);
    const isDataUrl = /^data:/i.test(inputRaw);
    if (hasScheme && !looksLikeWindowsDrivePath && !isFileUrl && !isHttpUrl && !isDataUrl) {
=======
    const inputRaw = normalizeMediaReferenceSource(
      trimmed.startsWith("@") ? trimmed.slice(1).trim() : trimmed,
    );
    if (!inputRaw) {
      throw new ToolInputError("image required (empty string in array)");
    }
    const refInfo = classifyMediaReferenceSource(inputRaw);
    const { isDataUrl, isHttpUrl } = refInfo;
    if (refInfo.hasUnsupportedScheme) {
>>>>>>> upstream/main
      throw new ToolInputError(
        `Unsupported image reference: ${rawInput}. Use a file path, a file:// URL, a data: URL, or an http(s) URL.`,
      );
    }
    if (params.sandboxConfig && isHttpUrl) {
      throw new ToolInputError("Sandboxed music_generate does not allow remote image URLs.");
    }

    const resolvedInput = params.sandboxConfig
      ? inputRaw
      : inputRaw.startsWith("~")
        ? resolveUserPath(inputRaw)
        : inputRaw;
    const resolvedPathInfo: { resolved: string; rewrittenFrom?: string } = isDataUrl
      ? { resolved: "" }
      : params.sandboxConfig
        ? await resolveSandboxedBridgeMediaPath({
            sandbox: params.sandboxConfig,
            mediaPath: resolvedInput,
            inboundFallbackDir: "media/inbound",
          })
        : {
            resolved: resolvedInput.startsWith("file://")
              ? resolvedInput.slice("file://".length)
              : resolvedInput,
          };
    const resolvedPath = isDataUrl ? null : resolvedPathInfo.resolved;
    const localRoots = resolveMediaToolLocalRoots(
      params.workspaceDir,
      {
        workspaceOnly: params.sandboxConfig?.workspaceOnly === true,
      },
      resolvedPath ? [resolvedPath] : undefined,
    );
    const media = isDataUrl
      ? decodeDataUrl(resolvedInput)
      : params.sandboxConfig
        ? await loadWebMedia(resolvedPath ?? resolvedInput, {
            sandboxValidated: true,
            readFile: createSandboxBridgeReadFile({ sandbox: params.sandboxConfig }),
          })
<<<<<<< HEAD
        : await loadWebMedia(resolvedPath ?? resolvedInput, {
            localRoots,
          });
=======
        : await (async () => {
            const referenceTarget = resolvedPath ?? resolvedInput;
            const isRemoteReference = /^https?:\/\//i.test(referenceTarget);
            const { signal, cleanup } = buildTimeoutAbortSignal({
              timeoutMs: params.timeoutMs ?? DEFAULT_REFERENCE_FETCH_TIMEOUT_MS,
              operation: "music-generate.reference-fetch",
              ...(isRemoteReference ? { url: referenceTarget } : {}),
            });
            try {
              return await loadWebMedia(resolvedPath ?? resolvedInput, {
                localRoots,
                requestInit: signal ? { signal } : undefined,
                ssrfPolicy: params.ssrfPolicy,
              });
            } finally {
              cleanup();
            }
          })();
>>>>>>> upstream/main
    if (media.kind !== "image") {
      throw new ToolInputError(`Unsupported media type: ${media.kind ?? "unknown"}`);
    }
    const mimeType = "mimeType" in media ? media.mimeType : media.contentType;
    const fileName = "fileName" in media ? media.fileName : undefined;
    loaded.push({
      sourceImage: {
        buffer: media.buffer,
        mimeType,
        fileName,
      },
      resolvedInput,
      ...(resolvedPathInfo.rewrittenFrom ? { rewrittenFrom: resolvedPathInfo.rewrittenFrom } : {}),
    });
  }

  return loaded;
}

type LoadedReferenceImage = Awaited<ReturnType<typeof loadReferenceImages>>[number];

type ExecutedMusicGeneration = {
  provider: string;
  model: string;
  savedPaths: string[];
<<<<<<< HEAD
=======
  count: number;
  paths: string[];
  attachments: AgentGeneratedAttachment[];
>>>>>>> upstream/main
  contentText: string;
  details: Record<string, unknown>;
  wakeResult: string;
};

async function executeMusicGenerationJob(params: {
  effectiveCfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  model?: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  filename?: string;
  loadedReferenceImages: LoadedReferenceImage[];
  taskHandle?: MusicGenerationTaskHandle | null;
<<<<<<< HEAD
=======
  autoProviderFallback?: boolean;
  timeoutMs?: number;
  timeoutNormalization?: MusicGenerationTimeoutNormalization;
>>>>>>> upstream/main
}): Promise<ExecutedMusicGeneration> {
  if (params.taskHandle) {
    recordMusicGenerationTaskProgress({
      handle: params.taskHandle,
      progressSummary: "Generating music",
    });
  }
  const result = await generateMusic({
    cfg: params.effectiveCfg,
    prompt: params.prompt,
    agentDir: params.agentDir,
    modelOverride: params.model,
    lyrics: params.lyrics,
    instrumental: params.instrumental,
    durationSeconds: params.durationSeconds,
    format: params.format,
    inputImages: params.loadedReferenceImages.map((entry) => entry.sourceImage),
<<<<<<< HEAD
=======
    autoProviderFallback: params.autoProviderFallback,
    timeoutMs: params.timeoutMs,
>>>>>>> upstream/main
  });
  if (params.taskHandle) {
    recordMusicGenerationTaskProgress({
      handle: params.taskHandle,
      progressSummary: "Saving generated music",
    });
  }
<<<<<<< HEAD
=======
  const mediaMaxBytes = resolveGeneratedMediaMaxBytes(params.effectiveCfg, "audio");
>>>>>>> upstream/main
  const savedTracks = await Promise.all(
    result.tracks.map((track) =>
      saveMediaBuffer(
        track.buffer,
        track.mimeType,
        "tool-music-generation",
<<<<<<< HEAD
        undefined,
=======
        mediaMaxBytes,
>>>>>>> upstream/main
        params.filename || track.fileName,
      ),
    ),
  );
  const ignoredOverrides = result.ignoredOverrides ?? [];
  const ignoredOverrideKeys = new Set(ignoredOverrides.map((entry) => entry.key));
<<<<<<< HEAD
=======
  const requestedDurationSeconds =
    result.normalization?.durationSeconds?.requested ??
    (typeof result.metadata?.requestedDurationSeconds === "number" &&
    Number.isFinite(result.metadata.requestedDurationSeconds)
      ? result.metadata.requestedDurationSeconds
      : params.durationSeconds);
  const runtimeNormalizedDurationSeconds =
    result.normalization?.durationSeconds?.applied ??
    (typeof result.metadata?.normalizedDurationSeconds === "number" &&
    Number.isFinite(result.metadata.normalizedDurationSeconds)
      ? result.metadata.normalizedDurationSeconds
      : undefined);
  const appliedDurationSeconds =
    runtimeNormalizedDurationSeconds ??
    (!ignoredOverrideKeys.has("durationSeconds") && typeof params.durationSeconds === "number"
      ? params.durationSeconds
      : undefined);
>>>>>>> upstream/main
  const warning =
    ignoredOverrides.length > 0
      ? `Ignored unsupported overrides for ${result.provider}/${result.model}: ${ignoredOverrides.map((entry) => `${entry.key}=${String(entry.value)}`).join(", ")}.`
      : undefined;
<<<<<<< HEAD
  const lines = [
    `Generated ${savedTracks.length} track${savedTracks.length === 1 ? "" : "s"} with ${result.provider}/${result.model}.`,
    ...(warning ? [`Warning: ${warning}`] : []),
    ...(result.lyrics?.length ? ["Lyrics returned.", ...result.lyrics] : []),
    ...savedTracks.map((track) => `MEDIA:${track.path}`),
  ];
=======
  const attachments: AgentGeneratedAttachment[] = savedTracks.map((track, index) => ({
    type: "audio",
    path: track.path,
    mimeType: track.contentType,
    name: result.tracks[index]?.fileName,
  }));
  const lines = [
    `Generated ${savedTracks.length} track${savedTracks.length === 1 ? "" : "s"} with ${result.provider}/${result.model}.`,
    ...(warning ? [`Warning: ${warning}`] : []),
    ...(params.timeoutNormalization
      ? [
          `Timeout normalized: requested ${params.timeoutNormalization.requested}ms; used ${params.timeoutNormalization.applied}ms.`,
        ]
      : []),
    typeof requestedDurationSeconds === "number" &&
    typeof appliedDurationSeconds === "number" &&
    requestedDurationSeconds !== appliedDurationSeconds
      ? `Duration normalized: requested ${requestedDurationSeconds}s; used ${appliedDurationSeconds}s.`
      : null,
    ...(result.lyrics?.length ? ["Lyrics returned.", ...result.lyrics] : []),
    ...formatGeneratedAttachmentLines(attachments),
  ].filter((entry): entry is string => Boolean(entry));
>>>>>>> upstream/main
  return {
    provider: result.provider,
    model: result.model,
    savedPaths: savedTracks.map((track) => track.path),
<<<<<<< HEAD
=======
    count: savedTracks.length,
    paths: savedTracks.map((track) => track.path),
    attachments,
>>>>>>> upstream/main
    contentText: lines.join("\n"),
    wakeResult: lines.join("\n"),
    details: {
      provider: result.provider,
      model: result.model,
      count: savedTracks.length,
      media: {
        mediaUrls: savedTracks.map((track) => track.path),
<<<<<<< HEAD
      },
      paths: savedTracks.map((track) => track.path),
      ...(params.taskHandle
        ? {
            task: {
              taskId: params.taskHandle.taskId,
              runId: params.taskHandle.runId,
            },
          }
        : {}),
=======
        attachments,
      },
      attachments,
      paths: savedTracks.map((track) => track.path),
      ...buildTaskRunDetails(params.taskHandle),
>>>>>>> upstream/main
      ...(!ignoredOverrideKeys.has("lyrics") && params.lyrics
        ? { requestedLyrics: params.lyrics }
        : {}),
      ...(!ignoredOverrideKeys.has("instrumental") && typeof params.instrumental === "boolean"
        ? { instrumental: params.instrumental }
        : {}),
<<<<<<< HEAD
      ...(!ignoredOverrideKeys.has("durationSeconds") && typeof params.durationSeconds === "number"
        ? { durationSeconds: params.durationSeconds }
        : {}),
      ...(!ignoredOverrideKeys.has("format") && params.format ? { format: params.format } : {}),
      ...(params.filename ? { filename: params.filename } : {}),
      ...(params.loadedReferenceImages.length === 1
        ? {
            image: params.loadedReferenceImages[0]?.resolvedInput,
            ...(params.loadedReferenceImages[0]?.rewrittenFrom
              ? { rewrittenFrom: params.loadedReferenceImages[0].rewrittenFrom }
              : {}),
          }
        : params.loadedReferenceImages.length > 1
          ? {
              images: params.loadedReferenceImages.map((entry) => ({
                image: entry.resolvedInput,
                ...(entry.rewrittenFrom ? { rewrittenFrom: entry.rewrittenFrom } : {}),
              })),
            }
          : {}),
      ...(result.lyrics?.length ? { lyrics: result.lyrics } : {}),
      attempts: result.attempts,
=======
      ...(typeof appliedDurationSeconds === "number"
        ? { durationSeconds: appliedDurationSeconds }
        : {}),
      ...(typeof requestedDurationSeconds === "number" &&
      typeof appliedDurationSeconds === "number" &&
      requestedDurationSeconds !== appliedDurationSeconds
        ? { requestedDurationSeconds }
        : {}),
      ...(!ignoredOverrideKeys.has("format") && params.format ? { format: params.format } : {}),
      ...(params.filename ? { filename: params.filename } : {}),
      ...(params.timeoutMs !== undefined ? { timeoutMs: params.timeoutMs } : {}),
      ...(params.timeoutNormalization
        ? {
            requestedTimeoutMs: params.timeoutNormalization.requested,
            timeoutNormalization: params.timeoutNormalization,
          }
        : {}),
      ...buildMediaReferenceDetails({
        entries: params.loadedReferenceImages,
        singleKey: "image",
        pluralKey: "images",
        getResolvedInput: (entry) => entry.resolvedInput,
      }),
      ...(result.lyrics?.length ? { lyrics: result.lyrics } : {}),
      attempts: result.attempts,
      ...(result.normalization ? { normalization: result.normalization } : {}),
>>>>>>> upstream/main
      metadata: result.metadata,
      ...(warning ? { warning } : {}),
      ...(ignoredOverrides.length > 0 ? { ignoredOverrides } : {}),
    },
  };
}

export function createMusicGenerateTool(options?: {
  config?: OpenClawConfig;
  agentDir?: string;
<<<<<<< HEAD
=======
  authProfileStore?: AuthProfileStore;
>>>>>>> upstream/main
  agentSessionKey?: string;
  requesterOrigin?: DeliveryContext;
  workspaceDir?: string;
  sandbox?: MusicGenerateSandboxConfig;
  fsPolicy?: ToolFsPolicy;
<<<<<<< HEAD
  scheduleBackgroundWork?: MusicGenerateBackgroundScheduler;
}): AnyAgentTool | null {
  const cfg: OpenClawConfig = options?.config ?? loadConfig();
  const musicGenerationModelConfig = resolveMusicGenerationModelConfigForTool({
    cfg,
    agentDir: options?.agentDir,
  });
  if (!musicGenerationModelConfig) {
=======
  scheduleBackgroundWork?: MediaGenerateBackgroundScheduler;
  onAsyncTaskStarted?: MediaGenerateAsyncStartCallback;
}): AnyAgentTool | null {
  const cfg: OpenClawConfig = options?.config ?? getRuntimeConfig();
  if (
    !hasGenerationToolAvailability({
      cfg,
      agentDir: options?.agentDir,
      workspaceDir: options?.workspaceDir,
      authStore: options?.authProfileStore,
      modelConfig: cfg.agents?.defaults?.musicGenerationModel,
      providerKey: "musicGenerationProviders",
    })
  ) {
>>>>>>> upstream/main
    return null;
  }

  const sandboxConfig = options?.sandbox
    ? {
        root: options.sandbox.root,
        bridge: options.sandbox.bridge,
        workspaceOnly: options.fsPolicy?.workspaceOnly === true,
      }
    : null;
  const scheduleBackgroundWork =
    options?.scheduleBackgroundWork ?? defaultScheduleMusicGenerateBackgroundWork;

  return {
    label: "Music Generation",
    name: "music_generate",
    displaySummary: "Generate music",
    description:
<<<<<<< HEAD
      "Generate music using configured providers. Generated tracks are saved under OpenClaw-managed media storage and delivered automatically as attachments.",
=======
      'Create audio/music for song, jingle, beat, loop, soundtrack, anthem, instrumental requests. If user asks make/generate/create song/music, call music_generate; do not just write lyrics unless lyrics/text only. Prompt gets style/genre/mood/tempo/instruments/purpose. lyrics only exact sung words. Session chats: background task; do not call again for same request; wait completion, then report through the current visible-reply contract with generated media attached using structured media fields. "status" checks active task.',
>>>>>>> upstream/main
    parameters: MusicGenerateToolSchema,
    execute: async (_toolCallId, rawArgs) => {
      const args = rawArgs as Record<string, unknown>;
      const action = resolveAction(args);
<<<<<<< HEAD
      const effectiveCfg =
        applyMusicGenerationModelConfigDefaults(cfg, musicGenerationModelConfig) ?? cfg;

      if (action === "list") {
        return createMusicGenerateListActionResult(effectiveCfg);
=======

      if (action === "list") {
        return createMusicGenerateListActionResult(cfg, {
          workspaceDir: options?.workspaceDir,
          agentDir: options?.agentDir,
          authStore: options?.authProfileStore,
        });
>>>>>>> upstream/main
      }

      if (action === "status") {
        return createMusicGenerateStatusActionResult(options?.agentSessionKey);
      }

<<<<<<< HEAD
      const duplicateGuardResult = createMusicGenerateDuplicateGuardResult(
        options?.agentSessionKey,
=======
      const musicGenerationModelConfig = resolveMusicGenerationModelConfigForTool({
        cfg,
        workspaceDir: options?.workspaceDir,
        agentDir: options?.agentDir,
        authStore: options?.authProfileStore,
      });
      if (!musicGenerationModelConfig) {
        throw new ToolInputError("No music-generation model configured.");
      }
      const explicitModelConfig = hasExplicitMusicGenerationModelConfig(cfg);
      const effectiveCfg =
        applyMusicGenerationModelConfigDefaults(cfg, musicGenerationModelConfig) ?? cfg;
      const prompt = readStringParam(args, "prompt", { required: true });

      const activeDuplicateGuardResult = createMusicGenerateDuplicateGuardResult(
        options?.agentSessionKey,
      );
      if (activeDuplicateGuardResult) {
        return activeDuplicateGuardResult;
      }

      const lyrics = readStringParam(args, "lyrics");
      const instrumental = readBooleanToolParam(args, "instrumental");
      const model = readStringParam(args, "model");
      const durationSeconds = readNumberParam(args, "durationSeconds", {
        positiveInteger: true,
        strict: true,
      });
      if (
        durationSeconds === undefined &&
        readSnakeCaseParamRaw(args, "durationSeconds") !== undefined
      ) {
        throw new ToolInputError("durationSeconds must be a positive integer");
      }
      const format = normalizeOutputFormat(readStringParam(args, "format"));
      const filename = readStringParam(args, "filename");
      const timeout = normalizeMusicGenerationTimeoutMs(musicGenerationModelConfig.timeoutMs);
      const timeoutMs = timeout.timeoutMs;
      const imageInputs = normalizeReferenceImageInputs(args);
      const explicitModelRef = parseMusicGenerationModelRef(model);
      const primaryModelRef = parseMusicGenerationModelRef(musicGenerationModelConfig.primary);
      const selectedModelRef = explicitModelRef ?? primaryModelRef;
      const shouldResolveSelectedProvider =
        imageInputs.length > 0 ||
        (model !== undefined && !explicitModelRef) ||
        (model === undefined && !primaryModelRef);
      const selectedProvider = shouldResolveSelectedProvider
        ? resolveSelectedMusicGenerationProvider({
            config: effectiveCfg,
            musicGenerationModelConfig,
            modelOverride: model,
          })
        : undefined;
      const selectedProviderId = selectedProvider?.id ?? selectedModelRef?.provider;
      const requestKey = buildMediaGenerationRequestKey({
        tool: "music_generate",
        prompt,
        provider: selectedProviderId,
        model:
          model !== undefined
            ? (explicitModelRef?.model ?? model)
            : (primaryModelRef?.model ??
              musicGenerationModelConfig.primary ??
              selectedProvider?.defaultModel),
        lyrics,
        instrumental,
        durationSeconds,
        format,
        filename,
        imageInputs,
      });
      const duplicateGuardResult = createMusicGenerateDuplicateGuardResult(
        options?.agentSessionKey,
        { requestKey },
>>>>>>> upstream/main
      );
      if (duplicateGuardResult) {
        return duplicateGuardResult;
      }
<<<<<<< HEAD

      const prompt = readStringParam(args, "prompt", { required: true });
      const lyrics = readStringParam(args, "lyrics");
      const instrumental = readBooleanParam(args, "instrumental");
      const model = readStringParam(args, "model");
      const durationSeconds = readNumberParam(args, "durationSeconds", {
        integer: true,
        strict: true,
      });
      const format = normalizeOutputFormat(readStringParam(args, "format"));
      const filename = readStringParam(args, "filename");
      const imageInputs = normalizeReferenceImageInputs(args);
      const selectedProvider = resolveSelectedMusicGenerationProvider({
        config: effectiveCfg,
        musicGenerationModelConfig,
        modelOverride: model,
      });
=======
      const remoteMediaSsrfPolicy = resolveRemoteMediaSsrfPolicy(effectiveCfg);
>>>>>>> upstream/main
      const loadedReferenceImages = await loadReferenceImages({
        inputs: imageInputs,
        workspaceDir: options?.workspaceDir,
        sandboxConfig,
<<<<<<< HEAD
      });
      validateMusicGenerationCapabilities({
        provider: selectedProvider,
        model:
          parseMusicGenerationModelRef(model)?.model ?? model ?? selectedProvider?.defaultModel,
=======
        ssrfPolicy: remoteMediaSsrfPolicy,
      });
      validateMusicGenerationCapabilities({
        provider: selectedProvider,
        model: selectedModelRef?.model ?? model ?? selectedProvider?.defaultModel,
>>>>>>> upstream/main
        inputImageCount: loadedReferenceImages.length,
        lyrics,
        instrumental,
        durationSeconds,
        format,
      });
      const taskHandle = createMusicGenerationTaskRun({
        sessionKey: options?.agentSessionKey,
        requesterOrigin: options?.requesterOrigin,
        prompt,
<<<<<<< HEAD
        providerId: selectedProvider?.id,
      });
      const shouldDetach = Boolean(taskHandle && options?.agentSessionKey?.trim());

      if (shouldDetach) {
        scheduleBackgroundWork(async () => {
          try {
            const executed = await executeMusicGenerationJob({
=======
        providerId: selectedProvider?.id ?? selectedModelRef?.provider,
      });
      const shouldDetach = Boolean(
        taskHandle && shouldDetachMediaGenerationTask(options?.agentSessionKey),
      );

      if (shouldDetach && taskHandle) {
        recordRecentMediaGenerationTaskStartForSession({
          sessionKey: options?.agentSessionKey,
          taskKind: "music_generation",
          sourcePrefix: "music_generate",
          taskId: taskHandle.taskId,
          runId: taskHandle.runId,
          taskLabel: prompt,
          requestKey,
          providerId: selectedProviderId,
          progressSummary: "Generating music",
        });
        scheduleMediaGenerationTaskCompletion({
          lifecycle: musicGenerationTaskLifecycle,
          handle: taskHandle,
          scheduleBackgroundWork,
          progressSummary: "Generating music",
          config: effectiveCfg,
          toolName: "Music generation",
          onWakeFailure: (message, meta) => log.warn(message, meta),
          run: () =>
            executeMusicGenerationJob({
>>>>>>> upstream/main
              effectiveCfg,
              prompt,
              agentDir: options?.agentDir,
              model,
              lyrics,
              instrumental,
              durationSeconds,
              format,
              filename,
              loadedReferenceImages,
              taskHandle,
<<<<<<< HEAD
            });
            completeMusicGenerationTaskRun({
              handle: taskHandle,
              provider: executed.provider,
              model: executed.model,
              count: executed.savedPaths.length,
              paths: executed.savedPaths,
            });
            try {
              await wakeMusicGenerationTaskCompletion({
                config: effectiveCfg,
                handle: taskHandle,
                status: "ok",
                statusLabel: "completed successfully",
                result: executed.wakeResult,
                mediaUrls: executed.savedPaths,
              });
            } catch (error) {
              log.warn("Music generation completion wake failed after successful generation", {
                taskId: taskHandle?.taskId,
                runId: taskHandle?.runId,
                error,
              });
            }
          } catch (error) {
            failMusicGenerationTaskRun({
              handle: taskHandle,
              error,
            });
            await wakeMusicGenerationTaskCompletion({
              config: effectiveCfg,
              handle: taskHandle,
              status: "error",
              statusLabel: "failed",
              result: error instanceof Error ? error.message : String(error),
            });
            return;
          }
        });

        return {
          content: [
            {
              type: "text",
              text: `Background task started for music generation (${taskHandle?.taskId ?? "unknown"}). Do not call music_generate again for this request. Wait for the completion event; I'll post the finished music here when it's ready.`,
            },
          ],
          details: {
            async: true,
            status: "started",
            ...(taskHandle
              ? {
                  task: {
                    taskId: taskHandle.taskId,
                    runId: taskHandle.runId,
                  },
                }
              : {}),
            ...(loadedReferenceImages.length === 1
              ? {
                  image: loadedReferenceImages[0]?.resolvedInput,
                  ...(loadedReferenceImages[0]?.rewrittenFrom
                    ? { rewrittenFrom: loadedReferenceImages[0].rewrittenFrom }
                    : {}),
                }
              : loadedReferenceImages.length > 1
                ? {
                    images: loadedReferenceImages.map((entry) => ({
                      image: entry.resolvedInput,
                      ...(entry.rewrittenFrom ? { rewrittenFrom: entry.rewrittenFrom } : {}),
                    })),
                  }
                : {}),
=======
              autoProviderFallback: explicitModelConfig ? false : undefined,
              timeoutMs,
              timeoutNormalization: timeout.normalization,
            }),
        });

        await notifyMediaGenerationAsyncTaskStarted({
          callback: options?.onAsyncTaskStarted,
          message: "Music generation started; wait for the generated music completion event.",
          toolName: "music_generate",
          handle: taskHandle,
          onFailure: (message, meta) => log.warn(message, meta),
        });

        return buildMediaGenerationStartedToolResult({
          toolName: "music_generate",
          generationLabel: "music",
          completionLabel: "music",
          taskHandle,
          messages: [timeout.message],
          detailExtras: {
            ...buildMediaReferenceDetails({
              entries: loadedReferenceImages,
              singleKey: "image",
              pluralKey: "images",
              getResolvedInput: (entry) => entry.resolvedInput,
            }),
>>>>>>> upstream/main
            ...(model ? { model } : {}),
            ...(lyrics ? { requestedLyrics: lyrics } : {}),
            ...(typeof instrumental === "boolean" ? { instrumental } : {}),
            ...(typeof durationSeconds === "number" ? { durationSeconds } : {}),
            ...(format ? { format } : {}),
            ...(filename ? { filename } : {}),
<<<<<<< HEAD
          },
        };
=======
            ...(timeoutMs !== undefined ? { timeoutMs } : {}),
            ...(timeout.normalization
              ? {
                  requestedTimeoutMs: timeout.normalization.requested,
                  timeoutNormalization: timeout.normalization,
                  warning: timeout.message,
                }
              : {}),
          },
        });
>>>>>>> upstream/main
      }

      try {
        const executed = await executeMusicGenerationJob({
          effectiveCfg,
          prompt,
          agentDir: options?.agentDir,
          lyrics,
          instrumental,
          durationSeconds,
          model,
          format,
          filename,
          loadedReferenceImages,
          taskHandle,
<<<<<<< HEAD
=======
          autoProviderFallback: explicitModelConfig ? false : undefined,
          timeoutMs,
          timeoutNormalization: timeout.normalization,
>>>>>>> upstream/main
        });
        completeMusicGenerationTaskRun({
          handle: taskHandle,
          provider: executed.provider,
          model: executed.model,
          count: executed.savedPaths.length,
          paths: executed.savedPaths,
        });
        return {
          content: [{ type: "text", text: executed.contentText }],
          details: executed.details,
        };
      } catch (error) {
        failMusicGenerationTaskRun({
          handle: taskHandle,
          error,
        });
        throw error;
      }
    },
  };
}
