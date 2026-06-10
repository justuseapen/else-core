<<<<<<< HEAD
=======
// Xai provider module implements model/runtime integration.
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
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import type {
  GeneratedVideoAsset,
  VideoGenerationProvider,
  VideoGenerationRequest,
<<<<<<< HEAD
  VideoGenerationSourceAsset,
=======
>>>>>>> upstream/main
} from "openclaw/plugin-sdk/video-generation";

const DEFAULT_XAI_VIDEO_BASE_URL = "https://api.x.ai/v1";
const DEFAULT_XAI_VIDEO_MODEL = "grok-imagine-video";
<<<<<<< HEAD
const DEFAULT_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_ATTEMPTS = 120;
const XAI_VIDEO_ASPECT_RATIOS = new Set(["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]);
=======
const DEFAULT_TIMEOUT_MS = 600_000;
const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_ATTEMPTS = 120;
const XAI_VIDEO_ASPECT_RATIOS = new Set(["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]);
const XAI_VIDEO_MALFORMED_RESPONSE = "xAI video generation response malformed";
// xAI documents these as the only meaningful values; everything else (queued,
// processing, submitted, pending, in_progress, ...) means "keep polling".
const XAI_VIDEO_TERMINAL_FAILURE_STATUSES = new Set(["failed", "error", "expired", "cancelled"]);
const XAI_VIDEO_DEFAULT_DURATION_SECONDS = 8;
const XAI_VIDEO_DEFAULT_ASPECT_RATIO = "16:9";
const XAI_VIDEO_DEFAULT_RESOLUTION = "720p";
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
>>>>>>> upstream/main

type XaiVideoCreateResponse = {
  request_id?: string;
  error?: {
    code?: string;
    message?: string;
  } | null;
};

type XaiVideoStatusResponse = {
  request_id?: string;
<<<<<<< HEAD
  status?: "queued" | "processing" | "done" | "failed" | "expired";
=======
  // Free-form: xAI returns whatever string it wants here. The caller decides
  // which strings are terminal vs continue-polling.
  status: string;
>>>>>>> upstream/main
  video?: {
    url?: string;
  } | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};

<<<<<<< HEAD
function resolveXaiVideoBaseUrl(req: VideoGenerationRequest): string {
  return req.cfg?.models?.providers?.xai?.baseUrl?.trim() || DEFAULT_XAI_VIDEO_BASE_URL;
=======
type VideoGenerationSourceInput = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  role?: string;
};

async function readXaiVideoJson(response: Response): Promise<Record<string, unknown>> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
  }
  if (!isRecord(payload)) {
    throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
  }
  return payload;
}

function xaiErrorMessage(payload: Record<string, unknown>): string | undefined {
  const error = payload.error;
  if (error === undefined || error === null) {
    return undefined;
  }
  if (!isRecord(error)) {
    throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
  }
  return normalizeOptionalString(error.message);
}

function readXaiCreateResponse(payload: Record<string, unknown>): XaiVideoCreateResponse {
  return {
    request_id: normalizeOptionalString(payload.request_id),
    error: xaiErrorMessage(payload) ? { message: xaiErrorMessage(payload) } : null,
  };
}

function readXaiStatusResponse(payload: Record<string, unknown>): XaiVideoStatusResponse {
  const video = payload.video;
  if (video !== undefined && video !== null && !isRecord(video)) {
    throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
  }
  return {
    request_id: normalizeOptionalString(payload.request_id),
    status: normalizeOptionalString(payload.status) ?? "",
    video: isRecord(video) ? { url: normalizeOptionalString(video.url) } : null,
    error: xaiErrorMessage(payload) ? { message: xaiErrorMessage(payload) } : null,
  };
}

function resolveXaiVideoBaseUrl(req: VideoGenerationRequest): string {
  return (
    normalizeOptionalString(req.cfg?.models?.providers?.xai?.baseUrl) ?? DEFAULT_XAI_VIDEO_BASE_URL
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

<<<<<<< HEAD
function resolveImageUrl(input: VideoGenerationSourceAsset | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  if (input.url?.trim()) {
    return input.url.trim();
=======
function resolveImageUrl(input: VideoGenerationSourceInput | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  const inputUrl = normalizeOptionalString(input.url);
  if (inputUrl) {
    return inputUrl;
>>>>>>> upstream/main
  }
  if (!input.buffer) {
    throw new Error("xAI image-to-video input is missing image data.");
  }
<<<<<<< HEAD
  return toDataUrl(input.buffer, input.mimeType?.trim() || "image/png");
}

function resolveInputVideoUrl(input: VideoGenerationSourceAsset | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  const url = input.url?.trim();
=======
  return toDataUrl(input.buffer, normalizeOptionalString(input.mimeType) ?? "image/png");
}

function resolveRequiredImageUrl(input: VideoGenerationSourceInput): string {
  const imageUrl = resolveImageUrl(input);
  if (!imageUrl) {
    throw new Error("xAI image-to-video input is missing image data.");
  }
  return imageUrl;
}

function isReferenceImage(input: VideoGenerationSourceInput): boolean {
  return normalizeOptionalString(input.role)?.toLowerCase() === "reference_image";
}

function resolveInputVideoUrl(input: VideoGenerationSourceInput | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  const url = normalizeOptionalString(input.url);
>>>>>>> upstream/main
  if (url) {
    return url;
  }
  if (input.buffer) {
    throw new Error("xAI video editing currently requires a remote mp4 URL input.");
  }
  throw new Error("xAI video editing input is missing video data.");
}

function resolveDurationSeconds(params: {
  durationSeconds?: number;
  min?: number;
  max?: number;
}): number | undefined {
  if (typeof params.durationSeconds !== "number" || !Number.isFinite(params.durationSeconds)) {
    return undefined;
  }
  const rounded = Math.round(params.durationSeconds);
  return Math.max(params.min ?? 1, Math.min(params.max ?? 15, rounded));
}

function resolveAspectRatio(value: string | undefined): string | undefined {
<<<<<<< HEAD
  const trimmed = value?.trim();
=======
  const trimmed = normalizeOptionalString(value);
>>>>>>> upstream/main
  if (!trimmed || !XAI_VIDEO_ASPECT_RATIOS.has(trimmed)) {
    return undefined;
  }
  return trimmed;
}

function resolveResolution(value: string | undefined): "480p" | "720p" | undefined {
<<<<<<< HEAD
  if (value === "480P") {
    return "480p";
  }
  if (value === "720P" || value === "1080P") {
=======
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "480p") {
    return "480p";
  }
  if (normalized === "720p" || normalized === "1080p") {
>>>>>>> upstream/main
    return "720p";
  }
  return undefined;
}

<<<<<<< HEAD
function resolveXaiVideoMode(req: VideoGenerationRequest): "generate" | "edit" | "extend" {
  const hasVideoInput = (req.inputVideos?.length ?? 0) > 0;
=======
function resolveXaiVideoMode(
  req: VideoGenerationRequest,
): "generate" | "referenceToVideo" | "edit" | "extend" {
  const hasVideoInput = (req.inputVideos?.length ?? 0) > 0;
  if (!hasVideoInput && (req.inputImages ?? []).some(isReferenceImage)) {
    return "referenceToVideo";
  }
>>>>>>> upstream/main
  if (!hasVideoInput) {
    return "generate";
  }
  return typeof resolveDurationSeconds({
    durationSeconds: req.durationSeconds,
    min: 2,
    max: 10,
  }) === "number"
    ? "extend"
    : "edit";
}

function buildCreateBody(req: VideoGenerationRequest): Record<string, unknown> {
<<<<<<< HEAD
  if ((req.inputImages?.length ?? 0) > 1) {
    throw new Error("xAI video generation supports at most one reference image.");
=======
  const inputImages = req.inputImages ?? [];
  const hasReferenceImages = inputImages.some(isReferenceImage);
  if (hasReferenceImages && !inputImages.every(isReferenceImage)) {
    throw new Error(
      "xAI reference-image video generation requires every image role to be reference_image.",
    );
  }
  if (!hasReferenceImages && inputImages.length > 1) {
    throw new Error("xAI image-to-video generation supports at most one first-frame image.");
  }
  if (hasReferenceImages && inputImages.length > 7) {
    throw new Error("xAI reference-image video generation supports at most 7 reference images.");
>>>>>>> upstream/main
  }
  if ((req.inputVideos?.length ?? 0) > 1) {
    throw new Error("xAI video generation supports at most one input video.");
  }
  if ((req.inputImages?.length ?? 0) > 0 && (req.inputVideos?.length ?? 0) > 0) {
    throw new Error("xAI video generation does not support image and video inputs together.");
  }

  const mode = resolveXaiVideoMode(req);
  const body: Record<string, unknown> = {
<<<<<<< HEAD
    model: req.model?.trim() || DEFAULT_XAI_VIDEO_MODEL,
=======
    model: normalizeOptionalString(req.model) ?? DEFAULT_XAI_VIDEO_MODEL,
>>>>>>> upstream/main
    prompt: req.prompt,
  };

  if (mode === "generate") {
    const imageUrl = resolveImageUrl(req.inputImages?.[0]);
    if (imageUrl) {
      body.image = { url: imageUrl };
    }
<<<<<<< HEAD
    const duration = resolveDurationSeconds({
      durationSeconds: req.durationSeconds,
      min: 1,
      max: 15,
    });
    if (typeof duration === "number") {
      body.duration = duration;
    }
    const aspectRatio = resolveAspectRatio(req.aspectRatio);
    if (aspectRatio) {
      body.aspect_ratio = aspectRatio;
    }
    const resolution = resolveResolution(req.resolution);
    if (resolution) {
      body.resolution = resolution;
    }
=======
    body.duration =
      resolveDurationSeconds({
        durationSeconds: req.durationSeconds,
        min: 1,
        max: 15,
      }) ?? XAI_VIDEO_DEFAULT_DURATION_SECONDS;
    body.aspect_ratio = resolveAspectRatio(req.aspectRatio) ?? XAI_VIDEO_DEFAULT_ASPECT_RATIO;
    body.resolution = resolveResolution(req.resolution) ?? XAI_VIDEO_DEFAULT_RESOLUTION;
    return body;
  }

  if (mode === "referenceToVideo") {
    body.reference_images = inputImages.map((image) => ({ url: resolveRequiredImageUrl(image) }));
    body.duration =
      resolveDurationSeconds({
        durationSeconds: req.durationSeconds,
        min: 1,
        max: 10,
      }) ?? XAI_VIDEO_DEFAULT_DURATION_SECONDS;
    body.aspect_ratio = resolveAspectRatio(req.aspectRatio) ?? XAI_VIDEO_DEFAULT_ASPECT_RATIO;
    body.resolution = resolveResolution(req.resolution) ?? XAI_VIDEO_DEFAULT_RESOLUTION;
>>>>>>> upstream/main
    return body;
  }

  body.video = { url: resolveInputVideoUrl(req.inputVideos?.[0]) };
  if (mode === "extend") {
    const duration = resolveDurationSeconds({
      durationSeconds: req.durationSeconds,
      min: 2,
      max: 10,
    });
    if (typeof duration === "number") {
      body.duration = duration;
    }
  }
  return body;
}

function resolveCreateEndpoint(req: VideoGenerationRequest): string {
  switch (resolveXaiVideoMode(req)) {
    case "edit":
      return "/videos/edits";
    case "extend":
      return "/videos/extensions";
<<<<<<< HEAD
    case "generate":
=======
>>>>>>> upstream/main
    default:
      return "/videos/generations";
  }
}

async function pollXaiVideo(params: {
  requestId: string;
  headers: Headers;
  timeoutMs?: number;
  baseUrl: string;
  fetchFn: typeof fetch;
}): Promise<XaiVideoStatusResponse> {
<<<<<<< HEAD
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchWithTimeout(
      `${params.baseUrl}/videos/${params.requestId}`,
      {
        method: "GET",
        headers: params.headers,
      },
      params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      params.fetchFn,
    );
    await assertOkOrThrowHttpError(response, "xAI video status request failed");
    const payload = (await response.json()) as XaiVideoStatusResponse;
    switch (payload.status) {
      case "done":
        return payload;
      case "failed":
      case "expired":
        throw new Error(payload.error?.message?.trim() || `xAI video generation ${payload.status}`);
      case "queued":
      case "processing":
      default:
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        break;
    }
=======
  const deadline = createProviderOperationDeadline({
    timeoutMs: params.timeoutMs,
    label: `xAI video generation request ${params.requestId}`,
  });
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchProviderOperationResponse({
      stage: "poll",
      url: `${params.baseUrl}/videos/${params.requestId}`,
      init: {
        method: "GET",
        headers: params.headers,
      },
      timeoutMs: createProviderOperationTimeoutResolver({
        deadline,
        defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
      }),
      fetchFn: params.fetchFn,
      provider: "xai",
      requestFailedMessage: "xAI video status request failed",
    });
    const payload = readXaiStatusResponse(await readXaiVideoJson(response));
    const normalizedStatus = payload.status.toLowerCase();
    if (normalizedStatus === "done") {
      return payload;
    }
    if (XAI_VIDEO_TERMINAL_FAILURE_STATUSES.has(normalizedStatus)) {
      throw new Error(
        normalizeOptionalString(payload.error?.message) ??
          `xAI video generation ${normalizedStatus}`,
      );
    }
    // Any other status (queued, processing, submitted, pending, in_progress,
    // empty, …) is non-terminal: keep polling.
    await waitProviderOperationPollInterval({ deadline, pollIntervalMs: POLL_INTERVAL_MS });
>>>>>>> upstream/main
  }
  throw new Error(`xAI video generation task ${params.requestId} did not finish in time`);
}

async function downloadXaiVideo(params: {
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
  await assertOkOrThrowHttpError(response, "xAI generated video download failed");
  const mimeType = response.headers.get("content-type")?.trim() || "video/mp4";
  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
    fileName: `video-1.${mimeType.includes("webm") ? "webm" : "mp4"}`,
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
    provider: "xai",
    requestFailedMessage: "xAI generated video download failed",
  });
  const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
  const buffer = await readResponseWithLimit(response, params.maxBytes, {
    onOverflow: ({ maxBytes }) =>
      new Error(`xAI generated video download exceeds ${maxBytes} bytes`),
  });
  return {
    buffer,
    mimeType,
    fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
>>>>>>> upstream/main
  };
}

export function buildXaiVideoGenerationProvider(): VideoGenerationProvider {
  return {
    id: "xai",
    label: "xAI",
    defaultModel: DEFAULT_XAI_VIDEO_MODEL,
<<<<<<< HEAD
=======
    defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
>>>>>>> upstream/main
    models: [DEFAULT_XAI_VIDEO_MODEL],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "xai",
        agentDir,
      }),
    capabilities: {
<<<<<<< HEAD
      maxVideos: 1,
      maxInputImages: 1,
      maxInputVideos: 1,
      maxDurationSeconds: 15,
      supportsAspectRatio: true,
      supportsResolution: true,
=======
      generate: {
        maxVideos: 1,
        maxDurationSeconds: 15,
        aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
        resolutions: ["480P", "720P"],
        supportsAspectRatio: true,
        supportsResolution: true,
      },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 7,
        maxDurationSeconds: 15,
        aspectRatios: [...XAI_VIDEO_ASPECT_RATIOS],
        resolutions: ["480P", "720P"],
        supportsAspectRatio: true,
        supportsResolution: true,
      },
      videoToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputVideos: 1,
        maxDurationSeconds: 15,
        supportsAspectRatio: true,
        supportsResolution: true,
      },
>>>>>>> upstream/main
    },
    async generateVideo(req) {
      const auth = await resolveApiKeyForProvider({
        provider: "xai",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) {
        throw new Error("xAI API key missing");
      }

      const fetchFn = fetch;
<<<<<<< HEAD
=======
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs,
        label: "xAI video generation",
      });
>>>>>>> upstream/main
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveXaiVideoBaseUrl(req),
          defaultBaseUrl: DEFAULT_XAI_VIDEO_BASE_URL,
          allowPrivateNetwork: false,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
          },
          provider: "xai",
          capability: "video",
          transport: "http",
        });
<<<<<<< HEAD
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}${resolveCreateEndpoint(req)}`,
        headers,
        body: buildCreateBody(req),
        timeoutMs: req.timeoutMs,
=======
      // Per-submit idempotency key prevents accidental double-charging if
      // the request is replayed. Polls intentionally reuse `headers` without it.
      const submitHeaders = new Headers(headers);
      submitHeaders.set("x-idempotency-key", crypto.randomUUID());
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}${resolveCreateEndpoint(req)}`,
        headers: submitHeaders,
        body: buildCreateBody(req),
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
        await assertOkOrThrowHttpError(response, "xAI video generation failed");
<<<<<<< HEAD
        const submitted = (await response.json()) as XaiVideoCreateResponse;
        const requestId = submitted.request_id?.trim();
        if (!requestId) {
          throw new Error(
            submitted.error?.message?.trim() || "xAI video generation response missing request_id",
=======
        const submitted = readXaiCreateResponse(await readXaiVideoJson(response));
        const requestId = normalizeOptionalString(submitted.request_id);
        if (!requestId) {
          throw new Error(
            normalizeOptionalString(submitted.error?.message) ??
              "xAI video generation response missing request_id",
>>>>>>> upstream/main
          );
        }
        const completed = await pollXaiVideo({
          requestId,
          headers,
<<<<<<< HEAD
          timeoutMs: req.timeoutMs,
          baseUrl,
          fetchFn,
        });
        const videoUrl = completed.video?.url?.trim();
        if (!videoUrl) {
          throw new Error("xAI video generation completed without an output URL");
        }
        const video = await downloadXaiVideo({
          url: videoUrl,
          timeoutMs: req.timeoutMs,
          fetchFn,
        });
        return {
          videos: [video],
          model: req.model?.trim() || DEFAULT_XAI_VIDEO_MODEL,
=======
          timeoutMs: resolveProviderOperationTimeoutMs({
            deadline,
            defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
          }),
          baseUrl,
          fetchFn,
        });
        const videoUrl = normalizeOptionalString(completed.video?.url);
        if (!videoUrl) {
          throw new Error(XAI_VIDEO_MALFORMED_RESPONSE);
        }
        const video = await downloadXaiVideo({
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
          model: normalizeOptionalString(req.model) ?? DEFAULT_XAI_VIDEO_MODEL,
>>>>>>> upstream/main
          metadata: {
            requestId,
            status: completed.status,
            videoUrl,
            mode: resolveXaiVideoMode(req),
          },
        };
      } finally {
        await release();
      }
    },
  };
}
