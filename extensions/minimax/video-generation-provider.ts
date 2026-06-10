<<<<<<< HEAD
=======
// Minimax provider module implements model/runtime integration.
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
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import type {
  GeneratedVideoAsset,
  VideoGenerationProvider,
  VideoGenerationRequest,
} from "openclaw/plugin-sdk/video-generation";

const DEFAULT_MINIMAX_VIDEO_BASE_URL = "https://api.minimax.io";
const DEFAULT_MINIMAX_VIDEO_MODEL = "MiniMax-Hailuo-2.3";
const DEFAULT_TIMEOUT_MS = 120_000;
<<<<<<< HEAD
const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 90;
=======
const DEFAULT_OPERATION_TIMEOUT_MS = 1_200_000;
const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 120;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
>>>>>>> upstream/main
const MINIMAX_MODEL_ALLOWED_DURATIONS: Readonly<Record<string, readonly number[]>> = {
  "MiniMax-Hailuo-2.3": [6, 10],
  "MiniMax-Hailuo-02": [6, 10],
};
<<<<<<< HEAD
=======
const MINIMAX_MODEL_ALLOWED_RESOLUTIONS: Readonly<Record<string, readonly string[]>> = {
  "MiniMax-Hailuo-2.3": ["768P", "1080P"],
  "MiniMax-Hailuo-2.3-Fast": ["768P", "1080P"],
  "MiniMax-Hailuo-02": ["768P", "1080P"],
};
const MINIMAX_RESOLUTION_ORDER = ["480P", "720P", "768P", "1080P"] as const;
>>>>>>> upstream/main

type MinimaxBaseResp = {
  status_code?: number;
  status_msg?: string;
};

type MinimaxCreateResponse = {
  task_id?: string;
  base_resp?: MinimaxBaseResp;
};

type MinimaxQueryResponse = {
  task_id?: string;
  status?: string;
  file_id?: string;
  video_url?: string;
  base_resp?: MinimaxBaseResp;
};

type MinimaxFileRetrieveResponse = {
  file?: {
    download_url?: string;
    filename?: string;
  };
  base_resp?: MinimaxBaseResp;
};

function resolveMinimaxVideoBaseUrl(
  cfg: Parameters<typeof resolveApiKeyForProvider>[0]["cfg"],
<<<<<<< HEAD
): string {
  const direct = cfg?.models?.providers?.minimax?.baseUrl?.trim();
=======
  providerId: string,
): string {
  const direct = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
>>>>>>> upstream/main
  if (!direct) {
    return DEFAULT_MINIMAX_VIDEO_BASE_URL;
  }
  try {
    return new URL(direct).origin;
  } catch {
    return DEFAULT_MINIMAX_VIDEO_BASE_URL;
  }
}

<<<<<<< HEAD
=======
function resolveGeneratedVideoMaxBytes(req: VideoGenerationRequest): number {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * 1024 * 1024);
  }
  return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
}

>>>>>>> upstream/main
function assertMinimaxBaseResp(baseResp: MinimaxBaseResp | undefined, context: string): void {
  if (!baseResp || typeof baseResp.status_code !== "number" || baseResp.status_code === 0) {
    return;
  }
  throw new Error(
    `${context} (${baseResp.status_code}): ${baseResp.status_msg ?? "unknown error"}`,
  );
}

function toDataUrl(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function resolveFirstFrameImage(req: VideoGenerationRequest): string | undefined {
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
    throw new Error("MiniMax image-to-video input is missing image data.");
  }
<<<<<<< HEAD
  return toDataUrl(input.buffer, input.mimeType?.trim() || "image/png");
=======
  return toDataUrl(input.buffer, normalizeOptionalString(input.mimeType) ?? "image/png");
>>>>>>> upstream/main
}

function resolveDurationSeconds(params: {
  model: string;
  durationSeconds: number | undefined;
}): number | undefined {
  if (typeof params.durationSeconds !== "number" || !Number.isFinite(params.durationSeconds)) {
    return undefined;
  }
  const rounded = Math.max(1, Math.round(params.durationSeconds));
  const allowed = MINIMAX_MODEL_ALLOWED_DURATIONS[params.model];
  if (!allowed || allowed.length === 0) {
    return rounded;
  }
  return allowed.reduce((best, current) =>
    Math.abs(current - rounded) < Math.abs(best - rounded) ? current : best,
  );
}

<<<<<<< HEAD
=======
function resolveResolution(params: {
  model: string;
  resolution: string | undefined;
}): string | undefined {
  const requested = normalizeOptionalString(params.resolution)?.toUpperCase();
  if (!requested) {
    return undefined;
  }
  const allowed = MINIMAX_MODEL_ALLOWED_RESOLUTIONS[params.model];
  if (!allowed || allowed.length === 0 || allowed.includes(requested)) {
    return requested;
  }
  const requestedIndex = MINIMAX_RESOLUTION_ORDER.indexOf(
    requested as (typeof MINIMAX_RESOLUTION_ORDER)[number],
  );
  if (requestedIndex < 0) {
    return undefined;
  }
  return allowed.reduce((best, current) => {
    const currentIndex = MINIMAX_RESOLUTION_ORDER.indexOf(
      current as (typeof MINIMAX_RESOLUTION_ORDER)[number],
    );
    const bestIndex = MINIMAX_RESOLUTION_ORDER.indexOf(
      best as (typeof MINIMAX_RESOLUTION_ORDER)[number],
    );
    if (currentIndex < 0) {
      return best;
    }
    if (bestIndex < 0) {
      return current;
    }
    return Math.abs(currentIndex - requestedIndex) < Math.abs(bestIndex - requestedIndex)
      ? current
      : best;
  });
}

>>>>>>> upstream/main
async function pollMinimaxVideo(params: {
  taskId: string;
  headers: Headers;
  timeoutMs?: number;
  baseUrl: string;
  fetchFn: typeof fetch;
}): Promise<MinimaxQueryResponse> {
<<<<<<< HEAD
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const url = new URL(`${params.baseUrl}/v1/query/video_generation`);
    url.searchParams.set("task_id", params.taskId);
    const response = await fetchWithTimeout(
      url.toString(),
      {
        method: "GET",
        headers: params.headers,
      },
      params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      params.fetchFn,
    );
    await assertOkOrThrowHttpError(response, "MiniMax video status request failed");
    const payload = (await response.json()) as MinimaxQueryResponse;
    assertMinimaxBaseResp(payload.base_resp, "MiniMax video generation failed");
    switch (payload.status?.trim()) {
      case "Success":
        return payload;
      case "Fail":
        throw new Error(payload.base_resp?.status_msg?.trim() || "MiniMax video generation failed");
      case "Preparing":
      case "Processing":
      default:
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
=======
  const deadline = createProviderOperationDeadline({
    timeoutMs: params.timeoutMs,
    label: `MiniMax video generation task ${params.taskId}`,
  });
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const url = new URL(`${params.baseUrl}/v1/query/video_generation`);
    url.searchParams.set("task_id", params.taskId);
    const response = await fetchProviderOperationResponse({
      stage: "poll",
      url: url.toString(),
      init: {
        method: "GET",
        headers: params.headers,
      },
      timeoutMs: createProviderOperationTimeoutResolver({
        deadline,
        defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
      }),
      fetchFn: params.fetchFn,
      provider: "minimax",
      requestFailedMessage: "MiniMax video status request failed",
    });
    const payload = (await response.json()) as MinimaxQueryResponse;
    assertMinimaxBaseResp(payload.base_resp, "MiniMax video generation failed");
    switch (normalizeOptionalString(payload.status)) {
      case "Success":
        return payload;
      case "Fail":
        throw new Error(
          normalizeOptionalString(payload.base_resp?.status_msg) ||
            "MiniMax video generation failed",
        );
      default:
        await waitProviderOperationPollInterval({ deadline, pollIntervalMs: POLL_INTERVAL_MS });
>>>>>>> upstream/main
        break;
    }
  }
  throw new Error(`MiniMax video generation task ${params.taskId} did not finish in time`);
}

async function downloadVideoFromUrl(params: {
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
  await assertOkOrThrowHttpError(response, "MiniMax generated video download failed");
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
    provider: "minimax",
    requestFailedMessage: "MiniMax generated video download failed",
  });
  const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
  const buffer = await readResponseWithLimit(response, params.maxBytes, {
    onOverflow: ({ maxBytes }) =>
      new Error(`MiniMax generated video download exceeds ${maxBytes} bytes`),
  });
  return {
    buffer,
    mimeType,
    fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
>>>>>>> upstream/main
  };
}

async function downloadVideoFromFileId(params: {
  fileId: string;
  headers: Headers;
<<<<<<< HEAD
  timeoutMs?: number;
  baseUrl: string;
  fetchFn: typeof fetch;
}): Promise<GeneratedVideoAsset> {
  const url = new URL(`${params.baseUrl}/v1/files/retrieve`);
  url.searchParams.set("file_id", params.fileId);
  const metadataResponse = await fetchWithTimeout(
    url.toString(),
    {
      method: "GET",
      headers: params.headers,
    },
    params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    params.fetchFn,
  );
  await assertOkOrThrowHttpError(
    metadataResponse,
    "MiniMax generated video metadata request failed",
  );
  const metadata = (await metadataResponse.json()) as MinimaxFileRetrieveResponse;
  assertMinimaxBaseResp(metadata.base_resp, "MiniMax generated video metadata request failed");
  const downloadUrl = metadata.file?.download_url?.trim();
  if (!downloadUrl) {
    throw new Error("MiniMax generated video metadata missing download_url");
  }
  const response = await fetchWithTimeout(
    downloadUrl,
    { method: "GET" },
    params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    params.fetchFn,
  );
  await assertOkOrThrowHttpError(response, "MiniMax generated video download failed");
  const mimeType = response.headers.get("content-type")?.trim() || "video/mp4";
  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
    fileName:
      metadata.file?.filename?.trim() || `video-1.${mimeType.includes("webm") ? "webm" : "mp4"}`,
  };
}

export function buildMinimaxVideoGenerationProvider(): VideoGenerationProvider {
  return {
    id: "minimax",
=======
  timeoutMs?: ProviderOperationTimeoutMs;
  baseUrl: string;
  fetchFn: typeof fetch;
  maxBytes: number;
}): Promise<GeneratedVideoAsset> {
  const url = new URL(`${params.baseUrl}/v1/files/retrieve`);
  url.searchParams.set("file_id", params.fileId);
  const metadataResponse = await fetchProviderOperationResponse({
    stage: "download",
    url: url.toString(),
    init: {
      method: "GET",
      headers: params.headers,
    },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    provider: "minimax",
    requestFailedMessage: "MiniMax generated video metadata request failed",
  });
  const metadata = (await metadataResponse.json()) as MinimaxFileRetrieveResponse;
  assertMinimaxBaseResp(metadata.base_resp, "MiniMax generated video metadata request failed");
  const downloadUrl = normalizeOptionalString(metadata.file?.download_url);
  if (!downloadUrl) {
    throw new Error("MiniMax generated video metadata missing download_url");
  }
  const response = await fetchProviderDownloadResponse({
    url: downloadUrl,
    init: { method: "GET" },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    provider: "minimax",
    requestFailedMessage: "MiniMax generated video download failed",
  });
  const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
  const buffer = await readResponseWithLimit(response, params.maxBytes, {
    onOverflow: ({ maxBytes }) =>
      new Error(`MiniMax generated video download exceeds ${maxBytes} bytes`),
  });
  return {
    buffer,
    mimeType,
    fileName:
      normalizeOptionalString(metadata.file?.filename) ||
      `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
  };
}

function buildMinimaxVideoProvider(providerId: string): VideoGenerationProvider {
  return {
    id: providerId,
>>>>>>> upstream/main
    label: "MiniMax",
    defaultModel: DEFAULT_MINIMAX_VIDEO_MODEL,
    models: [
      DEFAULT_MINIMAX_VIDEO_MODEL,
      "MiniMax-Hailuo-2.3-Fast",
      "MiniMax-Hailuo-02",
      "I2V-01-Director",
      "I2V-01-live",
      "I2V-01",
    ],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
<<<<<<< HEAD
        provider: "minimax",
        agentDir,
      }),
    capabilities: {
      maxVideos: 1,
      maxInputImages: 1,
      maxInputVideos: 0,
      maxDurationSeconds: 10,
      supportedDurationSecondsByModel: MINIMAX_MODEL_ALLOWED_DURATIONS,
      supportsResolution: true,
      supportsWatermark: false,
=======
        provider: providerId,
        agentDir,
      }),
    capabilities: {
      generate: {
        maxVideos: 1,
        maxDurationSeconds: 10,
        supportedDurationSecondsByModel: MINIMAX_MODEL_ALLOWED_DURATIONS,
        resolutions: ["768P", "1080P"],
        supportsResolution: true,
        supportsWatermark: false,
      },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 1,
        maxDurationSeconds: 10,
        supportedDurationSecondsByModel: MINIMAX_MODEL_ALLOWED_DURATIONS,
        resolutions: ["768P", "1080P"],
        supportsResolution: true,
        supportsWatermark: false,
      },
      videoToVideo: {
        enabled: false,
      },
>>>>>>> upstream/main
    },
    async generateVideo(req) {
      if ((req.inputVideos?.length ?? 0) > 0) {
        throw new Error("MiniMax video generation does not support video reference inputs.");
      }
      const auth = await resolveApiKeyForProvider({
<<<<<<< HEAD
        provider: "minimax",
=======
        provider: providerId,
>>>>>>> upstream/main
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) {
        throw new Error("MiniMax API key missing");
      }

      const fetchFn = fetch;
<<<<<<< HEAD
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveMinimaxVideoBaseUrl(req.cfg),
=======
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS,
        label: "MiniMax video generation",
      });
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveMinimaxVideoBaseUrl(req.cfg, providerId),
>>>>>>> upstream/main
          defaultBaseUrl: DEFAULT_MINIMAX_VIDEO_BASE_URL,
          allowPrivateNetwork: false,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
          },
<<<<<<< HEAD
          provider: "minimax",
          capability: "video",
          transport: "http",
        });
      const model = req.model?.trim() || DEFAULT_MINIMAX_VIDEO_MODEL;
=======
          provider: providerId,
          capability: "video",
          transport: "http",
        });
      const model = normalizeOptionalString(req.model) ?? DEFAULT_MINIMAX_VIDEO_MODEL;
>>>>>>> upstream/main
      const body: Record<string, unknown> = {
        model,
        prompt: req.prompt,
      };
      const firstFrameImage = resolveFirstFrameImage(req);
      if (firstFrameImage) {
        body.first_frame_image = firstFrameImage;
      }
<<<<<<< HEAD
      if (req.resolution) {
        body.resolution = req.resolution;
=======
      const resolution = resolveResolution({
        model,
        resolution: req.resolution,
      });
      if (resolution) {
        body.resolution = resolution;
>>>>>>> upstream/main
      }
      const durationSeconds = resolveDurationSeconds({
        model,
        durationSeconds: req.durationSeconds,
      });
      if (typeof durationSeconds === "number") {
        body.duration = durationSeconds;
      }
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/v1/video_generation`,
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
        await assertOkOrThrowHttpError(response, "MiniMax video generation failed");
        const submitted = (await response.json()) as MinimaxCreateResponse;
        assertMinimaxBaseResp(submitted.base_resp, "MiniMax video generation failed");
<<<<<<< HEAD
        const taskId = submitted.task_id?.trim();
=======
        const taskId = normalizeOptionalString(submitted.task_id);
>>>>>>> upstream/main
        if (!taskId) {
          throw new Error("MiniMax video generation response missing task_id");
        }
        const completed = await pollMinimaxVideo({
          taskId,
          headers,
<<<<<<< HEAD
          timeoutMs: req.timeoutMs,
          baseUrl,
          fetchFn,
        });
        const videoUrl = completed.video_url?.trim();
        const fileId = completed.file_id?.trim();
        const video = videoUrl
          ? await downloadVideoFromUrl({
              url: videoUrl,
              timeoutMs: req.timeoutMs,
              fetchFn,
=======
          timeoutMs: resolveProviderOperationTimeoutMs({
            deadline,
            defaultTimeoutMs: DEFAULT_OPERATION_TIMEOUT_MS,
          }),
          baseUrl,
          fetchFn,
        });
        const videoUrl = normalizeOptionalString(completed.video_url);
        const fileId = normalizeOptionalString(completed.file_id);
        const video = videoUrl
          ? await downloadVideoFromUrl({
              url: videoUrl,
              timeoutMs: createProviderOperationTimeoutResolver({
                deadline,
                defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
              }),
              fetchFn,
              maxBytes: resolveGeneratedVideoMaxBytes(req),
>>>>>>> upstream/main
            })
          : fileId
            ? await downloadVideoFromFileId({
                fileId,
                headers,
<<<<<<< HEAD
                timeoutMs: req.timeoutMs,
                baseUrl,
                fetchFn,
=======
                timeoutMs: createProviderOperationTimeoutResolver({
                  deadline,
                  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
                }),
                baseUrl,
                fetchFn,
                maxBytes: resolveGeneratedVideoMaxBytes(req),
>>>>>>> upstream/main
              })
            : (() => {
                throw new Error(
                  "MiniMax video generation completed without a video URL or file_id",
                );
              })();
        return {
          videos: [video],
          model,
          metadata: {
            taskId,
            status: completed.status,
            fileId,
            videoUrl,
          },
        };
      } finally {
        await release();
      }
    },
  };
}
<<<<<<< HEAD
=======

export function buildMinimaxVideoGenerationProvider(): VideoGenerationProvider {
  return buildMinimaxVideoProvider("minimax");
}

export function buildMinimaxPortalVideoGenerationProvider(): VideoGenerationProvider {
  return buildMinimaxVideoProvider("minimax-portal");
}
>>>>>>> upstream/main
