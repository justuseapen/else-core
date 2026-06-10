<<<<<<< HEAD
import { assertOkOrThrowHttpError, fetchWithTimeout } from "openclaw/plugin-sdk/provider-http";
=======
// Vydra plugin module implements shared behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  assertOkOrThrowHttpError,
  createProviderOperationDeadline,
  fetchWithTimeout,
  resolveProviderOperationTimeoutMs,
  resolveProviderHttpRequestConfig,
  waitProviderOperationPollInterval,
  type ProviderOperationDeadline,
  type ProviderOperationTimeoutMs,
} from "openclaw/plugin-sdk/provider-http";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main

export const DEFAULT_VYDRA_BASE_URL = "https://www.vydra.ai/api/v1";
export const DEFAULT_VYDRA_IMAGE_MODEL = "grok-imagine";
export const DEFAULT_VYDRA_VIDEO_MODEL = "veo3";
export const DEFAULT_VYDRA_SPEECH_MODEL = "elevenlabs/tts";
export const DEFAULT_VYDRA_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
<<<<<<< HEAD
export const DEFAULT_HTTP_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 2_500;
const MAX_POLL_ATTEMPTS = 120;
=======
const DEFAULT_HTTP_TIMEOUT_MS = 120_000;
const DEFAULT_GENERATED_IMAGE_MAX_BYTES = 6 * 1024 * 1024;
const DEFAULT_GENERATED_AUDIO_MAX_BYTES = 16 * 1024 * 1024;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
const POLL_INTERVAL_MS = 2_500;
const MAX_POLL_ATTEMPTS = 120;
type VydraAuthStore = Parameters<typeof resolveApiKeyForProvider>[0]["store"];
>>>>>>> upstream/main

type VydraMediaKind = "audio" | "image" | "video";

type VydraJobPayload = {
  id?: string;
  jobId?: string;
  status?: string;
  message?: string;
  error?: string | { message?: string; detail?: string } | null;
};

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function addUrlValue(value: unknown, urls: Set<string>): void {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^https?:\/\//iu.test(trimmed)) {
      urls.add(trimmed);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      addUrlValue(entry, urls);
    }
  }
}

<<<<<<< HEAD
export function trimToUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
=======
export const trimToUndefined = normalizeOptionalString;
>>>>>>> upstream/main

export function normalizeVydraBaseUrl(value: string | undefined): string {
  const fallback = DEFAULT_VYDRA_BASE_URL;
  const trimmed = trimToUndefined(value);
  if (!trimmed) {
    return fallback;
  }
  try {
    const url = new URL(trimmed);
    if (url.hostname === "vydra.ai") {
      url.hostname = "www.vydra.ai";
    }
    const pathname = url.pathname.replace(/\/+$/u, "");
    if (!pathname) {
      url.pathname = "/api/v1";
    } else {
      url.pathname = pathname;
    }
    return url.toString().replace(/\/$/u, "");
  } catch {
    return fallback;
  }
}

<<<<<<< HEAD
export function resolveVydraBaseUrlFromConfig(cfg: unknown): string {
=======
function resolveVydraBaseUrlFromConfig(cfg: unknown): string {
>>>>>>> upstream/main
  const models = asObject(asObject(cfg)?.models);
  const providers = asObject(models?.providers);
  const vydra = asObject(providers?.vydra);
  return normalizeVydraBaseUrl(trimToUndefined(vydra?.baseUrl));
}

<<<<<<< HEAD
=======
export async function resolveVydraRequestContext(params: {
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: VydraAuthStore;
  capability: "image" | "video";
}): Promise<{
  fetchFn: typeof fetch;
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy: ReturnType<typeof resolveProviderHttpRequestConfig>["dispatcherPolicy"];
}> {
  const auth = await resolveApiKeyForProvider({
    provider: "vydra",
    cfg: params.cfg,
    agentDir: params.agentDir,
    store: params.authStore,
  });
  if (!auth.apiKey) {
    throw new Error("Vydra API key missing");
  }
  const fetchFn = fetch;
  const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
    resolveProviderHttpRequestConfig({
      baseUrl: resolveVydraBaseUrlFromConfig(params.cfg),
      defaultBaseUrl: DEFAULT_VYDRA_BASE_URL,
      allowPrivateNetwork: false,
      defaultHeaders: {
        Authorization: `Bearer ${auth.apiKey}`,
        "Content-Type": "application/json",
      },
      provider: "vydra",
      capability: params.capability,
      transport: "http",
    });
  return {
    fetchFn,
    baseUrl,
    allowPrivateNetwork,
    headers,
    dispatcherPolicy,
  };
}

>>>>>>> upstream/main
export function resolveVydraResponseJobId(payload: unknown): string | undefined {
  const object = asObject(payload) as VydraJobPayload | undefined;
  return trimToUndefined(object?.jobId) ?? trimToUndefined(object?.id);
}

export function resolveVydraResponseStatus(payload: unknown): string | undefined {
<<<<<<< HEAD
  return trimToUndefined(asObject(payload)?.status)?.toLowerCase();
}

export function resolveVydraErrorMessage(payload: unknown): string | undefined {
=======
  return normalizeOptionalLowercaseString(trimToUndefined(asObject(payload)?.status));
}

function resolveVydraErrorMessage(payload: unknown): string | undefined {
>>>>>>> upstream/main
  const object = asObject(payload) as VydraJobPayload | undefined;
  const error = object?.error;
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  const errorObject = asObject(error);
  return (
    trimToUndefined(errorObject?.message) ??
    trimToUndefined(errorObject?.detail) ??
    trimToUndefined(object?.message)
  );
}

export function extractVydraResultUrls(payload: unknown, kind: VydraMediaKind): string[] {
  const urls = new Set<string>();
  const preferredKeys =
    kind === "audio"
      ? ["audioUrl", "audioUrls"]
      : kind === "image"
        ? ["imageUrl", "imageUrls"]
        : ["videoUrl", "videoUrls"];
  const sharedKeys = ["resultUrl", "resultUrls", "outputUrl", "outputUrls", "url", "urls"];
  const recurseKeys = ["output", "outputs", "result", "results", "data", "asset", "assets"];

  const visit = (value: unknown, depth = 0) => {
    if (depth > 5) {
      return;
    }
    if (Array.isArray(value)) {
      for (const entry of value) {
        visit(entry, depth + 1);
      }
      return;
    }
    const object = asObject(value);
    if (!object) {
      return;
    }
    for (const key of [...preferredKeys, ...sharedKeys]) {
      addUrlValue(object[key], urls);
    }
    for (const key of recurseKeys) {
      if (key in object) {
        visit(object[key], depth + 1);
      }
    }
  };

  visit(payload);
  return [...urls];
}

<<<<<<< HEAD
function inferExtension(kind: VydraMediaKind, mimeType: string): string {
  const normalized = mimeType.toLowerCase();
  if (normalized.includes("jpeg")) {
    return "jpg";
  }
  if (normalized.includes("webp")) {
    return "webp";
  }
  if (normalized.includes("wav")) {
    return "wav";
  }
  if (normalized.includes("mpeg") || normalized.includes("mp3")) {
    return "mp3";
  }
  if (normalized.includes("webm")) {
    return "webm";
  }
  if (normalized.includes("quicktime")) {
    return "mov";
  }
  return kind === "image" ? "png" : kind === "audio" ? "mp3" : "mp4";
=======
function resolveVydraFileExtension(kind: VydraMediaKind, mimeType: string): string {
  return (
    extensionForMime(mimeType)?.slice(1) ??
    (kind === "image" ? "png" : kind === "audio" ? "mp3" : "mp4")
  );
}

function resolveVydraHttpTimeoutMs(timeoutMs: ProviderOperationTimeoutMs | undefined): number {
  const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
  if (typeof resolved !== "number" || !Number.isFinite(resolved) || resolved <= 0) {
    return DEFAULT_HTTP_TIMEOUT_MS;
  }
  return resolved;
}

export function resolveVydraGeneratedMediaMaxBytes(params: {
  cfg: { agents?: { defaults?: { mediaMaxMb?: number } } };
  kind: VydraMediaKind;
}): number {
  const configured = params.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * 1024 * 1024);
  }
  if (params.kind === "image") {
    return DEFAULT_GENERATED_IMAGE_MAX_BYTES;
  }
  if (params.kind === "audio") {
    return DEFAULT_GENERATED_AUDIO_MAX_BYTES;
  }
  return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
>>>>>>> upstream/main
}

export async function downloadVydraAsset(params: {
  url: string;
  kind: VydraMediaKind;
<<<<<<< HEAD
  timeoutMs?: number;
  fetchFn: typeof fetch;
}): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
  const response = await fetchWithTimeout(
    params.url,
    { method: "GET" },
    params.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS,
    params.fetchFn,
  );
=======
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  maxBytes: number;
}): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
  const timeoutMs = resolveVydraHttpTimeoutMs(params.timeoutMs);
  const response = await fetchWithTimeout(params.url, { method: "GET" }, timeoutMs, params.fetchFn);
>>>>>>> upstream/main
  await assertOkOrThrowHttpError(response, `Vydra ${params.kind} download failed`);
  const mimeType =
    response.headers.get("content-type")?.trim() ||
    (params.kind === "image" ? "image/png" : params.kind === "audio" ? "audio/mpeg" : "video/mp4");
<<<<<<< HEAD
  const arrayBuffer = await response.arrayBuffer();
  const extension = inferExtension(params.kind, mimeType);
  const fileStem = params.kind === "image" ? "image" : params.kind === "audio" ? "audio" : "video";
  return {
    buffer: Buffer.from(arrayBuffer),
=======
  const buffer = await readResponseWithLimit(response, params.maxBytes, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ maxBytes }) =>
      new Error(`Vydra ${params.kind} download exceeds ${maxBytes} bytes`),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      new Error(`Vydra ${params.kind} download stalled after ${chunkTimeoutMs}ms`),
  });
  const extension = resolveVydraFileExtension(params.kind, mimeType);
  const fileStem = params.kind === "image" ? "image" : params.kind === "audio" ? "audio" : "video";
  return {
    buffer,
>>>>>>> upstream/main
    mimeType,
    fileName: `${fileStem}-1.${extension}`,
  };
}

<<<<<<< HEAD
export async function waitForVydraJob(params: {
=======
async function waitForVydraJob(params: {
>>>>>>> upstream/main
  baseUrl: string;
  jobId: string;
  headers: Headers;
  timeoutMs?: number;
<<<<<<< HEAD
  fetchFn: typeof fetch;
  kind: VydraMediaKind;
}): Promise<unknown> {
=======
  deadline?: ProviderOperationDeadline;
  fetchFn: typeof fetch;
  kind: VydraMediaKind;
}): Promise<unknown> {
  const deadline =
    params.deadline ??
    createProviderOperationDeadline({
      timeoutMs: params.timeoutMs,
      label: `Vydra job ${params.jobId}`,
    });
>>>>>>> upstream/main
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchWithTimeout(
      `${params.baseUrl}/jobs/${params.jobId}`,
      {
        method: "GET",
        headers: params.headers,
      },
<<<<<<< HEAD
      params.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS,
=======
      resolveProviderOperationTimeoutMs({ deadline, defaultTimeoutMs: DEFAULT_HTTP_TIMEOUT_MS }),
>>>>>>> upstream/main
      params.fetchFn,
    );
    await assertOkOrThrowHttpError(response, "Vydra job status request failed");
    const payload = await response.json();
    const status = resolveVydraResponseStatus(payload);
    if (status === "completed" || extractVydraResultUrls(payload, params.kind).length > 0) {
      return payload;
    }
    if (status === "failed" || status === "error" || status === "cancelled") {
      throw new Error(resolveVydraErrorMessage(payload) ?? `Vydra job ${params.jobId} failed`);
    }
<<<<<<< HEAD
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error(`Vydra job ${params.jobId} did not finish in time`);
}
=======
    await waitProviderOperationPollInterval({ deadline, pollIntervalMs: POLL_INTERVAL_MS });
  }
  throw new Error(`Vydra job ${params.jobId} did not finish in time`);
}

export async function resolveCompletedVydraPayload(params: {
  submitted: unknown;
  baseUrl: string;
  headers: Headers;
  timeoutMs?: number;
  deadline?: ProviderOperationDeadline;
  fetchFn: typeof fetch;
  kind: VydraMediaKind;
  missingJobIdMessage: string;
}): Promise<unknown> {
  if (
    resolveVydraResponseStatus(params.submitted) === "completed" ||
    extractVydraResultUrls(params.submitted, params.kind).length > 0
  ) {
    return params.submitted;
  }
  const jobId = resolveVydraResponseJobId(params.submitted);
  if (!jobId) {
    throw new Error(resolveVydraErrorMessage(params.submitted) ?? params.missingJobIdMessage);
  }
  return waitForVydraJob({
    baseUrl: params.baseUrl,
    jobId,
    headers: params.headers,
    timeoutMs: params.timeoutMs,
    ...(params.deadline ? { deadline: params.deadline } : {}),
    fetchFn: params.fetchFn,
    kind: params.kind,
  });
}
>>>>>>> upstream/main
