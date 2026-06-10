<<<<<<< HEAD
=======
/**
 * BytePlus Seedance video generation provider implementation.
 */
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
>>>>>>> upstream/main
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  assertOkOrThrowHttpError,
<<<<<<< HEAD
  fetchWithTimeout,
  postJsonRequest,
  resolveProviderHttpRequestConfig,
} from "openclaw/plugin-sdk/provider-http";
=======
  createProviderOperationDeadline,
  createProviderOperationTimeoutResolver,
  fetchProviderDownloadResponse,
  fetchProviderOperationResponse,
  postJsonRequest,
  resolveProviderOperationTimeoutMs,
  resolveProviderHttpRequestConfig,
  waitProviderOperationPollInterval,
  type ProviderOperationTimeoutMs,
} from "openclaw/plugin-sdk/provider-http";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import {
  asSafeIntegerInRange,
  isRecord,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import type {
  GeneratedVideoAsset,
  VideoGenerationProvider,
  VideoGenerationRequest,
} from "openclaw/plugin-sdk/video-generation";
import { BYTEPLUS_BASE_URL } from "./models.js";

const DEFAULT_BYTEPLUS_VIDEO_MODEL = "seedance-1-0-lite-t2v-250428";
const DEFAULT_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_ATTEMPTS = 120;
<<<<<<< HEAD

type BytePlusTaskCreateResponse = {
  id?: string;
};

type BytePlusTaskResponse = {
  id?: string;
  model?: string;
  status?: "running" | "failed" | "queued" | "succeeded" | "cancelled";
  error?: {
    code?: string;
    message?: string;
  };
  content?: {
    video_url?: string;
    last_frame_url?: string;
    file_url?: string;
  };
  duration?: number;
  ratio?: string;
  resolution?: string;
};

function resolveBytePlusVideoBaseUrl(req: VideoGenerationRequest): string {
  return req.cfg?.models?.providers?.byteplus?.baseUrl?.trim() || BYTEPLUS_BASE_URL;
=======
const BYTEPLUS_SEED_MAX = 2_147_483_647;
const BYTEPLUS_MIN_DURATION_SECONDS = 2;
const BYTEPLUS_MAX_DURATION_SECONDS = 12;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;

type BytePlusTaskCreateResponse = {
  id?: unknown;
};

type BytePlusTaskResponse = {
  id?: unknown;
  model?: unknown;
  status?: unknown;
  error?: unknown;
  content?: unknown;
  duration?: unknown;
  ratio?: unknown;
  resolution?: unknown;
};

type BytePlusTaskStatus = "running" | "failed" | "queued" | "succeeded" | "cancelled";

async function readBytePlusJsonResponse<T>(
  response: Pick<Response, "json">,
  label: string,
): Promise<T> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new Error(`${label}: malformed JSON response`, { cause });
  }
  if (!isRecord(payload)) {
    throw new Error(`${label}: malformed JSON response`);
  }
  return payload as T;
}

function readBytePlusTaskStatus(payload: BytePlusTaskResponse): BytePlusTaskStatus {
  const status = normalizeOptionalString(payload.status);
  switch (status) {
    case "running":
    case "failed":
    case "queued":
    case "succeeded":
    case "cancelled":
      return status;
    case undefined:
      throw new Error("BytePlus video status response missing task status");
    default:
      throw new Error(`BytePlus video status response returned unknown task status: ${status}`);
  }
}

function readBytePlusErrorMessage(error: unknown): string | undefined {
  return isRecord(error) ? normalizeOptionalString(error.message) : undefined;
}

function readBytePlusVideoUrl(payload: BytePlusTaskResponse): string {
  const content = payload.content;
  if (content !== undefined && !isRecord(content)) {
    throw new Error("BytePlus video generation completed with malformed content");
  }
  const videoUrl = normalizeOptionalString(content?.video_url);
  if (!videoUrl) {
    throw new Error("BytePlus video generation completed without a video URL");
  }
  return videoUrl;
}

function resolveBytePlusVideoBaseUrl(req: VideoGenerationRequest): string {
  return (
    normalizeOptionalString(req.cfg?.models?.providers?.byteplus?.baseUrl) ?? BYTEPLUS_BASE_URL
  );
}

function resolveGeneratedVideoMaxBytes(req: VideoGenerationRequest): number {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * 1024 * 1024);
  }
  return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
>>>>>>> upstream/main
}

function toDataUrl(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function resolveBytePlusImageUrl(req: VideoGenerationRequest): string | undefined {
  const input = req.inputImages?.[0];
  if (!input) {
    return undefined;
  }
<<<<<<< HEAD
  if (input.url?.trim()) {
    return input.url.trim();
=======
  const inputUrl = normalizeOptionalString(input.url);
  if (inputUrl) {
    return inputUrl;
>>>>>>> upstream/main
  }
  if (!input.buffer) {
    throw new Error("BytePlus reference image is missing image data.");
  }
<<<<<<< HEAD
  return toDataUrl(input.buffer, input.mimeType?.trim() || "image/png");
=======
  return toDataUrl(input.buffer, normalizeOptionalString(input.mimeType) ?? "image/png");
}

function resolveBytePlusSeed(value: unknown): number | undefined {
  return asSafeIntegerInRange(value, { min: -1, max: BYTEPLUS_SEED_MAX });
}

function resolveBytePlusDurationSeconds(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return asSafeIntegerInRange(Math.round(value), {
    min: BYTEPLUS_MIN_DURATION_SECONDS,
    max: BYTEPLUS_MAX_DURATION_SECONDS,
  });
}

function readBytePlusDurationSeconds(value: unknown): number | undefined {
  return asSafeIntegerInRange(value, {
    min: BYTEPLUS_MIN_DURATION_SECONDS,
    max: BYTEPLUS_MAX_DURATION_SECONDS,
  });
>>>>>>> upstream/main
}

async function pollBytePlusTask(params: {
  taskId: string;
  headers: Headers;
  timeoutMs?: number;
  baseUrl: string;
  fetchFn: typeof fetch;
}): Promise<BytePlusTaskResponse> {
<<<<<<< HEAD
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchWithTimeout(
      `${params.baseUrl}/contents/generations/tasks/${params.taskId}`,
      {
        method: "GET",
        headers: params.headers,
      },
      params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      params.fetchFn,
    );
    await assertOkOrThrowHttpError(response, "BytePlus video status request failed");
    const payload = (await response.json()) as BytePlusTaskResponse;
    switch (payload.status?.trim()) {
=======
  const deadline = createProviderOperationDeadline({
    timeoutMs: params.timeoutMs,
    label: `BytePlus video generation task ${params.taskId}`,
  });
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchProviderOperationResponse({
      stage: "poll",
      url: `${params.baseUrl}/contents/generations/tasks/${params.taskId}`,
      init: {
        method: "GET",
        headers: params.headers,
      },
      timeoutMs: createProviderOperationTimeoutResolver({
        deadline,
        defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
      }),
      fetchFn: params.fetchFn,
      provider: "byteplus",
      requestFailedMessage: "BytePlus video status request failed",
    });
    const payload = await readBytePlusJsonResponse<BytePlusTaskResponse>(
      response,
      "BytePlus video status request failed",
    );
    switch (readBytePlusTaskStatus(payload)) {
>>>>>>> upstream/main
      case "succeeded":
        return payload;
      case "failed":
      case "cancelled":
<<<<<<< HEAD
        throw new Error(payload.error?.message?.trim() || "BytePlus video generation failed");
      case "queued":
      case "running":
      default:
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
=======
        throw new Error(
          readBytePlusErrorMessage(payload.error) || "BytePlus video generation failed",
        );
      default:
        await waitProviderOperationPollInterval({ deadline, pollIntervalMs: POLL_INTERVAL_MS });
>>>>>>> upstream/main
        break;
    }
  }
  throw new Error(`BytePlus video generation task ${params.taskId} did not finish in time`);
}

async function downloadBytePlusVideo(params: {
  url: string;
<<<<<<< HEAD
  timeoutMs?: number;
  fetchFn: typeof fetch;
}): Promise<GeneratedVideoAsset> {
  const response = await fetchWithTimeout(
    params.url,
    { method: "GET" },
    params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    params.fetchFn,
  );
  await assertOkOrThrowHttpError(response, "BytePlus generated video download failed");
  const mimeType = response.headers.get("content-type")?.trim() || "video/mp4";
  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
    fileName: `video-1.${mimeType.includes("webm") ? "webm" : "mp4"}`,
  };
}

=======
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  maxBytes: number;
}): Promise<GeneratedVideoAsset> {
  const response = await fetchProviderDownloadResponse({
    url: params.url,
    init: { method: "GET" },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    provider: "byteplus",
    requestFailedMessage: "BytePlus generated video download failed",
  });
  const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
  const buffer = await readResponseWithLimit(response, params.maxBytes, {
    onOverflow: ({ maxBytes }) =>
      new Error(`BytePlus generated video download exceeds ${maxBytes} bytes`),
  });
  return {
    buffer,
    mimeType,
    fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
  };
}

/** Builds the BytePlus video generation provider registered by the plugin. */
>>>>>>> upstream/main
export function buildBytePlusVideoGenerationProvider(): VideoGenerationProvider {
  return {
    id: "byteplus",
    label: "BytePlus",
    defaultModel: DEFAULT_BYTEPLUS_VIDEO_MODEL,
    models: [
      DEFAULT_BYTEPLUS_VIDEO_MODEL,
      "seedance-1-0-lite-i2v-250428",
      "seedance-1-0-pro-250528",
      "seedance-1-5-pro-251215",
    ],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "byteplus",
        agentDir,
      }),
    capabilities: {
<<<<<<< HEAD
      maxVideos: 1,
      maxInputImages: 1,
      maxInputVideos: 0,
      maxDurationSeconds: 12,
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsAudio: true,
      supportsWatermark: true,
=======
      providerOptions: {
        seed: "number",
        draft: "boolean",
        camera_fixed: "boolean",
      },
      generate: {
        maxVideos: 1,
        maxDurationSeconds: 12,
        supportsAspectRatio: true,
        supportsResolution: true,
        supportsAudio: true,
        supportsWatermark: true,
      },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 1,
        maxDurationSeconds: 12,
        supportsAspectRatio: true,
        supportsResolution: true,
        supportsAudio: true,
        supportsWatermark: true,
      },
      videoToVideo: {
        enabled: false,
      },
>>>>>>> upstream/main
    },
    async generateVideo(req) {
      if ((req.inputVideos?.length ?? 0) > 0) {
        throw new Error("BytePlus video generation does not support video reference inputs.");
      }
      const auth = await resolveApiKeyForProvider({
        provider: "byteplus",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) {
        throw new Error("BytePlus API key missing");
      }

      const fetchFn = fetch;
<<<<<<< HEAD
=======
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs,
        label: "BytePlus video generation",
      });
>>>>>>> upstream/main
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveBytePlusVideoBaseUrl(req),
          defaultBaseUrl: BYTEPLUS_BASE_URL,
          allowPrivateNetwork: false,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
          },
          provider: "byteplus",
          capability: "video",
          transport: "http",
        });
<<<<<<< HEAD
=======
      // Seedance 1.0 has separate T2V and I2V model IDs (e.g. seedance-1-0-lite-t2v-250428 vs
      // seedance-1-0-lite-i2v-250428). When input images are provided with a T2V model, auto-
      // switch to the corresponding I2V variant so the API does not reject with task_type mismatch.
      // 1.5 Pro uses a single model ID for both modes and is unaffected by this substitution.
      const hasInputImages = (req.inputImages?.length ?? 0) > 0;
      const requestedModel = normalizeOptionalString(req.model) || DEFAULT_BYTEPLUS_VIDEO_MODEL;
      const resolvedModel =
        hasInputImages && requestedModel.includes("-t2v-")
          ? requestedModel.replace("-t2v-", "-i2v-")
          : requestedModel;

>>>>>>> upstream/main
      const content: Array<Record<string, unknown>> = [{ type: "text", text: req.prompt }];
      const imageUrl = resolveBytePlusImageUrl(req);
      if (imageUrl) {
        content.push({
          type: "image_url",
          image_url: { url: imageUrl },
          role: "first_frame",
        });
      }
      const body: Record<string, unknown> = {
<<<<<<< HEAD
        model: req.model?.trim() || DEFAULT_BYTEPLUS_VIDEO_MODEL,
        content,
      };
      if (req.aspectRatio?.trim()) {
        body.ratio = req.aspectRatio.trim();
      }
      if (req.resolution) {
        body.resolution = req.resolution;
      }
      if (typeof req.durationSeconds === "number" && Number.isFinite(req.durationSeconds)) {
        body.duration = Math.max(1, Math.round(req.durationSeconds));
=======
        model: resolvedModel,
        content,
      };
      const aspectRatio = normalizeOptionalString(req.aspectRatio);
      if (aspectRatio) {
        body.ratio = aspectRatio;
      }
      // Seedance API requires lowercase resolution values (e.g. "480p", "720p"); uppercase
      // variants like "480P" are rejected with InvalidParameter.
      const resolution = normalizeOptionalString(req.resolution)?.toLowerCase();
      if (resolution) {
        body.resolution = resolution;
      }
      const duration = resolveBytePlusDurationSeconds(req.durationSeconds);
      if (duration !== undefined) {
        body.duration = duration;
>>>>>>> upstream/main
      }
      if (typeof req.audio === "boolean") {
        body.generate_audio = req.audio;
      }
      if (typeof req.watermark === "boolean") {
        body.watermark = req.watermark;
      }

<<<<<<< HEAD
=======
      // Forward declared providerOptions: seed, draft, camerafixed.
      // draft=true forces 480p resolution for faster generation.
      const opts = req.providerOptions ?? {};
      const seed = resolveBytePlusSeed(opts.seed);
      const draft = opts.draft === true;
      // Official JSON body field is camera_fixed (with underscore).
      const cameraFixed = typeof opts.camera_fixed === "boolean" ? opts.camera_fixed : undefined;
      if (seed != null) {
        body.seed = seed;
      }
      if (draft && !body.resolution) {
        body.resolution = "480p";
      }
      if (cameraFixed != null) {
        body.camera_fixed = cameraFixed;
      }

>>>>>>> upstream/main
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/contents/generations/tasks`,
        headers,
        body,
<<<<<<< HEAD
        timeoutMs: req.timeoutMs,
=======
        timeoutMs: resolveProviderOperationTimeoutMs({
          deadline,
          defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
        }),
>>>>>>> upstream/main
        fetchFn,
        allowPrivateNetwork,
        dispatcherPolicy,
      });
      try {
        await assertOkOrThrowHttpError(response, "BytePlus video generation failed");
<<<<<<< HEAD
        const submitted = (await response.json()) as BytePlusTaskCreateResponse;
        const taskId = submitted.id?.trim();
=======
        const submitted = await readBytePlusJsonResponse<BytePlusTaskCreateResponse>(
          response,
          "BytePlus video generation failed",
        );
        const taskId = normalizeOptionalString(submitted.id);
>>>>>>> upstream/main
        if (!taskId) {
          throw new Error("BytePlus video generation response missing task id");
        }
        const completed = await pollBytePlusTask({
          taskId,
          headers,
<<<<<<< HEAD
          timeoutMs: req.timeoutMs,
          baseUrl,
          fetchFn,
        });
        const videoUrl = completed.content?.video_url?.trim();
        if (!videoUrl) {
          throw new Error("BytePlus video generation completed without a video URL");
        }
        const video = await downloadBytePlusVideo({
          url: videoUrl,
          timeoutMs: req.timeoutMs,
          fetchFn,
        });
        return {
          videos: [video],
          model: completed.model ?? req.model ?? DEFAULT_BYTEPLUS_VIDEO_MODEL,
          metadata: {
            taskId,
            status: completed.status,
            videoUrl,
            ratio: completed.ratio,
            resolution: completed.resolution,
            duration: completed.duration,
=======
          timeoutMs: resolveProviderOperationTimeoutMs({
            deadline,
            defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
          }),
          baseUrl,
          fetchFn,
        });
        const videoUrl = readBytePlusVideoUrl(completed);
        const video = await downloadBytePlusVideo({
          url: videoUrl,
          timeoutMs: createProviderOperationTimeoutResolver({
            deadline,
            defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
          }),
          fetchFn,
          maxBytes: resolveGeneratedVideoMaxBytes(req),
        });
        return {
          videos: [video],
          model: normalizeOptionalString(completed.model) ?? resolvedModel,
          metadata: {
            taskId,
            status: normalizeOptionalString(completed.status),
            videoUrl,
            ratio: normalizeOptionalString(completed.ratio),
            resolution: normalizeOptionalString(completed.resolution),
            duration: readBytePlusDurationSeconds(completed.duration),
>>>>>>> upstream/main
          },
        };
      } finally {
        await release();
      }
    },
  };
}
