<<<<<<< HEAD
import fs from "node:fs/promises";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
// Comfy plugin module implements workflow runtime behavior.
import fs from "node:fs/promises";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { canResolveEnvSecretRefInReadOnlyPath } from "openclaw/plugin-sdk/extension-shared";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
>>>>>>> upstream/main
import {
  isProviderApiKeyConfigured,
  type AuthProfileStore,
} from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  assertOkOrThrowHttpError,
  normalizeBaseUrl,
  resolveProviderHttpRequestConfig,
} from "openclaw/plugin-sdk/provider-http";
<<<<<<< HEAD
=======
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import {
  normalizeSecretInputString,
  resolveSecretInputString,
} from "openclaw/plugin-sdk/secret-input-runtime";
>>>>>>> upstream/main
import {
  buildHostnameAllowlistPolicyFromSuffixAllowlist,
  fetchWithSsrFGuard,
  isPrivateOrLoopbackHost,
<<<<<<< HEAD
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  type SsrFPolicy,
} from "openclaw/plugin-sdk/ssrf-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-runtime";
=======
  mergeSsrFPolicies,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  type SsrFPolicy,
} from "openclaw/plugin-sdk/ssrf-runtime";
import {
  asBoolean,
  isRecord,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
  uniqueStrings,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
>>>>>>> upstream/main

const DEFAULT_COMFY_LOCAL_BASE_URL = "http://127.0.0.1:8188";
const DEFAULT_COMFY_CLOUD_BASE_URL = "https://cloud.comfy.org";
const DEFAULT_PROMPT_INPUT_NAME = "text";
const DEFAULT_INPUT_IMAGE_INPUT_NAME = "image";
const DEFAULT_POLL_INTERVAL_MS = 1_500;
const DEFAULT_TIMEOUT_MS = 5 * 60_000;
<<<<<<< HEAD

export const DEFAULT_COMFY_MODEL = "workflow";

export type ComfyMode = "local" | "cloud";
export type ComfyCapability = "image" | "music" | "video";
export type ComfyOutputKind = "audio" | "gifs" | "images" | "videos";
export type ComfyWorkflow = Record<string, unknown>;
export type ComfyProviderConfig = Record<string, unknown>;
=======
const DEFAULT_GENERATED_IMAGE_MAX_BYTES = 6 * 1024 * 1024;
const DEFAULT_GENERATED_MEDIA_MAX_BYTES = 16 * 1024 * 1024;

export const DEFAULT_COMFY_MODEL = "workflow";

type ComfyMode = "local" | "cloud";
type ComfyCapability = "image" | "music" | "video";
type ComfyOutputKind = "audio" | "gifs" | "images" | "videos";
type ComfyWorkflow = Record<string, unknown>;
type ComfyProviderConfig = Record<string, unknown>;
>>>>>>> upstream/main
type ComfyFetchGuardParams = Parameters<typeof fetchWithSsrFGuard>[0];
type ComfyDispatcherPolicy = ComfyFetchGuardParams["dispatcherPolicy"];
type ComfyPromptResponse = {
  prompt_id?: string;
};
type ComfyOutputFile = {
  filename?: string;
  name?: string;
  subfolder?: string;
  type?: string;
};
type ComfyHistoryOutputEntry = Partial<Record<ComfyOutputKind, ComfyOutputFile[]>>;
type ComfyHistoryEntry = {
  outputs?: Record<string, ComfyHistoryOutputEntry>;
};
type ComfyUploadResponse = {
  name?: string;
  filename?: string;
};
type ComfyStatusResponse = {
  status?: string;
  message?: string;
  error?: string;
};
type ComfyNetworkPolicy = {
  apiPolicy?: SsrFPolicy;
};
<<<<<<< HEAD

export type ComfySourceImage = {
=======
type ComfyApiKeyResolution =
  | {
      status: "available";
      apiKey: string;
      source: string;
    }
  | {
      status: "missing";
    }
  | {
      status: "configured_unavailable";
    };

type ComfySourceImage = {
>>>>>>> upstream/main
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
};

<<<<<<< HEAD
export type ComfyGeneratedAsset = {
=======
type ComfyGeneratedAsset = {
>>>>>>> upstream/main
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  nodeId: string;
};

<<<<<<< HEAD
export type ComfyWorkflowResult = {
=======
type ComfyWorkflowResult = {
>>>>>>> upstream/main
  assets: ComfyGeneratedAsset[];
  model: string;
  promptId: string;
  outputNodeIds: string[];
};

let comfyFetchGuard = fetchWithSsrFGuard;

<<<<<<< HEAD
export function _setComfyFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void {
  comfyFetchGuard = impl ?? fetchWithSsrFGuard;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readConfigString(config: ComfyProviderConfig, key: string): string | undefined {
  const value = config[key];
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function readConfigBoolean(config: ComfyProviderConfig, key: string): boolean | undefined {
  const value = config[key];
  return typeof value === "boolean" ? value : undefined;
=======
export function setComfyFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void {
  comfyFetchGuard = impl ?? fetchWithSsrFGuard;
}

function resolveComfyGeneratedOutputMaxBytes(params: {
  cfg: OpenClawConfig;
  capability: ComfyCapability;
}): number {
  const configured = params.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * 1024 * 1024);
  }
  return params.capability === "image"
    ? DEFAULT_GENERATED_IMAGE_MAX_BYTES
    : DEFAULT_GENERATED_MEDIA_MAX_BYTES;
}

function readConfigBoolean(config: ComfyProviderConfig, key: string): boolean | undefined {
  return asBoolean(config[key]);
>>>>>>> upstream/main
}

function readConfigInteger(config: ComfyProviderConfig, key: string): number | undefined {
  const value = config[key];
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}

<<<<<<< HEAD
function mergeSsrFPolicies(...policies: Array<SsrFPolicy | undefined>): SsrFPolicy | undefined {
  const merged: SsrFPolicy = {};
  for (const policy of policies) {
    if (!policy) {
      continue;
    }
    if (policy.allowPrivateNetwork) {
      merged.allowPrivateNetwork = true;
    }
    if (policy.dangerouslyAllowPrivateNetwork) {
      merged.dangerouslyAllowPrivateNetwork = true;
    }
    if (policy.allowRfc2544BenchmarkRange) {
      merged.allowRfc2544BenchmarkRange = true;
    }
    if (policy.allowedHostnames?.length) {
      merged.allowedHostnames = Array.from(
        new Set([...(merged.allowedHostnames ?? []), ...policy.allowedHostnames]),
      );
    }
    if (policy.hostnameAllowlist?.length) {
      merged.hostnameAllowlist = Array.from(
        new Set([...(merged.hostnameAllowlist ?? []), ...policy.hostnameAllowlist]),
      );
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function getComfyConfig(cfg?: OpenClawConfig): ComfyProviderConfig {
  const raw = cfg?.models?.providers?.comfy;
  return isRecord(raw) ? raw : {};
=======
export function getComfyConfig(cfg?: OpenClawConfig): ComfyProviderConfig {
  const pluginConfig = cfg?.plugins?.entries?.comfy?.config;
  if (isRecord(pluginConfig)) {
    return pluginConfig;
  }
  const legacyConfig = cfg?.models?.providers?.comfy;
  return isRecord(legacyConfig) ? legacyConfig : {};
>>>>>>> upstream/main
}

function stripNestedCapabilityConfig(config: ComfyProviderConfig): ComfyProviderConfig {
  const next = { ...config };
  delete next.image;
  delete next.video;
  delete next.music;
  return next;
}

<<<<<<< HEAD
export function getComfyCapabilityConfig(
=======
function getComfyCapabilityConfig(
>>>>>>> upstream/main
  config: ComfyProviderConfig,
  capability: ComfyCapability,
): ComfyProviderConfig {
  const shared = stripNestedCapabilityConfig(config);
  const nested = config[capability];
  if (!isRecord(nested)) {
    return shared;
  }
  return { ...shared, ...nested };
}

<<<<<<< HEAD
export function resolveComfyMode(config: ComfyProviderConfig): ComfyMode {
  return readConfigString(config, "mode") === "cloud" ? "cloud" : "local";
}

function getRequiredConfigString(config: ComfyProviderConfig, key: string): string {
  const value = readConfigString(config, key);
  if (!value) {
    throw new Error(`models.providers.comfy.${key} is required`);
=======
function resolveComfyMode(config: ComfyProviderConfig): ComfyMode {
  return normalizeOptionalString(config.mode) === "cloud" ? "cloud" : "local";
}

function resolveComfyApiKey(
  config: ComfyProviderConfig,
  cfg?: OpenClawConfig,
): ComfyApiKeyResolution {
  const resolved = resolveSecretInputString({
    value: config.apiKey,
    path: "plugins.entries.comfy.config.apiKey",
    defaults: cfg?.secrets?.defaults,
    mode: "inspect",
  });
  if (resolved.status === "available") {
    const apiKey = normalizeSecretInputString(resolved.value);
    return apiKey
      ? {
          status: "available",
          apiKey,
          source: "plugins.entries.comfy.config.apiKey",
        }
      : { status: "missing" };
  }
  if (resolved.status === "configured_unavailable") {
    if (resolved.ref.source !== "env") {
      return { status: "configured_unavailable" };
    }
    const envVarName = resolved.ref.id.trim();
    if (
      !canResolveEnvSecretRefInReadOnlyPath({
        cfg,
        provider: resolved.ref.provider,
        id: envVarName,
      })
    ) {
      return { status: "configured_unavailable" };
    }
    const apiKey = normalizeSecretInputString(process.env[envVarName]);
    return apiKey
      ? {
          status: "available",
          apiKey,
          source: `plugins.entries.comfy.config.apiKey (${envVarName})`,
        }
      : { status: "configured_unavailable" };
  }
  return { status: "missing" };
}

function getRequiredConfigString(config: ComfyProviderConfig, key: string): string {
  const value = normalizeOptionalString(config[key]);
  if (!value) {
    throw new Error(`plugins.entries.comfy.config.${key} is required`);
>>>>>>> upstream/main
  }
  return value;
}

function resolveComfyWorkflowSource(config: ComfyProviderConfig): {
  workflow?: ComfyWorkflow;
  workflowPath?: string;
} {
  const workflow = config.workflow;
  if (isRecord(workflow)) {
    return { workflow: structuredClone(workflow) };
  }
<<<<<<< HEAD
  const workflowPath = readConfigString(config, "workflowPath");
=======
  const workflowPath = normalizeOptionalString(config.workflowPath);
>>>>>>> upstream/main
  return { workflowPath };
}

async function loadComfyWorkflow(config: ComfyProviderConfig): Promise<ComfyWorkflow> {
  const source = resolveComfyWorkflowSource(config);
  if (source.workflow) {
    return source.workflow;
  }
  if (!source.workflowPath) {
<<<<<<< HEAD
    throw new Error("models.providers.comfy.<capability>.workflow or workflowPath is required");
=======
    throw new Error(
      "plugins.entries.comfy.config.<capability>.workflow or workflowPath is required",
    );
>>>>>>> upstream/main
  }

  const resolvedPath = resolveUserPath(source.workflowPath);
  const raw = await fs.readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error(`Comfy workflow at ${resolvedPath} must be a JSON object`);
  }
  return parsed;
}

function setWorkflowInput(params: {
  workflow: ComfyWorkflow;
  nodeId: string;
  inputName: string;
  value: unknown;
}): void {
  const node = params.workflow[params.nodeId];
  if (!isRecord(node)) {
    throw new Error(`Comfy workflow missing node "${params.nodeId}"`);
  }
  const inputs = node.inputs;
  if (!isRecord(inputs)) {
    throw new Error(`Comfy workflow node "${params.nodeId}" is missing an inputs object`);
  }
  inputs[params.inputName] = params.value;
}

function resolveComfyNetworkPolicy(params: {
  baseUrl: string;
  allowPrivateNetwork: boolean;
}): ComfyNetworkPolicy {
  let parsed: URL;
  try {
    parsed = new URL(params.baseUrl);
  } catch {
    return {};
  }

<<<<<<< HEAD
  const hostname = parsed.hostname.trim().toLowerCase();
=======
  const hostname = normalizeOptionalLowercaseString(parsed.hostname) ?? "";
>>>>>>> upstream/main
  if (!hostname || !params.allowPrivateNetwork || !isPrivateOrLoopbackHost(hostname)) {
    return {};
  }

  const hostnamePolicy = buildHostnameAllowlistPolicyFromSuffixAllowlist([hostname]);
  const privateNetworkPolicy = ssrfPolicyFromDangerouslyAllowPrivateNetwork(true);
  return {
    apiPolicy: mergeSsrFPolicies(hostnamePolicy, privateNetworkPolicy),
  };
}

async function readJsonResponse<T>(params: {
  url: string;
  init?: RequestInit;
  timeoutMs?: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
  auditContext: string;
  errorPrefix: string;
}): Promise<T> {
  const { response, release } = await comfyFetchGuard({
    url: params.url,
    init: params.init,
    timeoutMs: params.timeoutMs,
    policy: params.policy,
    dispatcherPolicy: params.dispatcherPolicy,
    auditContext: params.auditContext,
  });
  try {
    await assertOkOrThrowHttpError(response, params.errorPrefix);
<<<<<<< HEAD
    return (await response.json()) as T;
=======
    try {
      return (await response.json()) as T;
    } catch (cause) {
      throw new Error(`${params.errorPrefix}: malformed JSON response`, { cause });
    }
>>>>>>> upstream/main
  } finally {
    await release();
  }
}

<<<<<<< HEAD
function inferFileExtension(params: { fileName?: string; mimeType?: string }): string {
  const normalizedMime = params.mimeType?.toLowerCase().trim();
  if (normalizedMime?.includes("jpeg")) {
    return "jpg";
  }
  if (normalizedMime?.includes("png")) {
    return "png";
  }
  if (normalizedMime?.includes("webm")) {
    return "webm";
  }
  if (normalizedMime?.includes("mp4")) {
    return "mp4";
  }
  if (normalizedMime?.includes("mpeg")) {
    return "mp3";
  }
  if (normalizedMime?.includes("wav")) {
    return "wav";
=======
function resolveFileExtension(params: { fileName?: string; mimeType?: string }): string {
  const extension = extensionForMime(params.mimeType);
  if (extension) {
    return extension.slice(1);
>>>>>>> upstream/main
  }
  const fileName = params.fileName?.trim();
  if (!fileName) {
    return "bin";
  }
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex < 0 || dotIndex === fileName.length - 1) {
    return "bin";
  }
  return fileName.slice(dotIndex + 1);
}

function toBlobBytes(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

async function uploadInputImage(params: {
  baseUrl: string;
  headers: Headers;
  timeoutMs: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
  image: ComfySourceImage;
  mode: ComfyMode;
  capability: ComfyCapability;
}): Promise<string> {
  const form = new FormData();
  form.set(
    "image",
    new Blob([toBlobBytes(params.image.buffer)], { type: params.image.mimeType }),
<<<<<<< HEAD
    params.image.fileName?.trim() ||
      `input.${inferFileExtension({ mimeType: params.image.mimeType })}`,
=======
    normalizeOptionalString(params.image.fileName) ||
      `input.${resolveFileExtension({ mimeType: params.image.mimeType })}`,
>>>>>>> upstream/main
  );
  form.set("type", "input");
  form.set("overwrite", "true");

  const headers = new Headers(params.headers);
  headers.delete("Content-Type");

  const payload = await readJsonResponse<ComfyUploadResponse>({
    url: `${params.baseUrl}${params.mode === "cloud" ? "/api/upload/image" : "/upload/image"}`,
    init: {
      method: "POST",
      headers,
      body: form,
    },
    timeoutMs: params.timeoutMs,
    policy: params.policy,
    dispatcherPolicy: params.dispatcherPolicy,
    auditContext: `comfy-${params.capability}-upload`,
    errorPrefix: "Comfy image upload failed",
  });

<<<<<<< HEAD
  const uploadedName = payload.filename?.trim() || payload.name?.trim();
=======
  const uploadedName =
    normalizeOptionalString(payload.filename) || normalizeOptionalString(payload.name);
>>>>>>> upstream/main
  if (!uploadedName) {
    throw new Error("Comfy image upload response missing filename");
  }
  return uploadedName;
}

function extractHistoryEntry(history: unknown, promptId: string): ComfyHistoryEntry | null {
  if (!isRecord(history)) {
    return null;
  }
  const directOutputs = history.outputs;
  if (isRecord(directOutputs)) {
    return history as ComfyHistoryEntry;
  }
  const nested = history[promptId];
  if (isRecord(nested)) {
    return nested as ComfyHistoryEntry;
  }
  return null;
}

async function waitForLocalHistory(params: {
  baseUrl: string;
  promptId: string;
  headers: Headers;
  timeoutMs: number;
  pollIntervalMs: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
}): Promise<ComfyHistoryEntry> {
  const deadline = Date.now() + params.timeoutMs;
<<<<<<< HEAD
  while (Date.now() <= deadline) {
=======
  for (;;) {
    const requestTimeoutMs = resolveComfyRemainingMs(deadline, params.timeoutMs);
>>>>>>> upstream/main
    const history = await readJsonResponse<unknown>({
      url: `${params.baseUrl}/history/${params.promptId}`,
      init: {
        method: "GET",
        headers: params.headers,
      },
<<<<<<< HEAD
      timeoutMs: params.timeoutMs,
=======
      timeoutMs: requestTimeoutMs,
>>>>>>> upstream/main
      policy: params.policy,
      dispatcherPolicy: params.dispatcherPolicy,
      auditContext: "comfy-history",
      errorPrefix: "Comfy history lookup failed",
    });

    const entry = extractHistoryEntry(history, params.promptId);
    if (entry?.outputs && Object.keys(entry.outputs).length > 0) {
      return entry;
    }

<<<<<<< HEAD
    await new Promise((resolve) => setTimeout(resolve, params.pollIntervalMs));
  }

  throw new Error(`Comfy workflow did not finish within ${Math.ceil(params.timeoutMs / 1000)}s`);
=======
    const pollDelayMs = resolveComfyRemainingMs(deadline, params.timeoutMs, params.pollIntervalMs);
    await new Promise((resolve) => {
      setTimeout(resolve, pollDelayMs);
    });
  }
>>>>>>> upstream/main
}

async function waitForCloudCompletion(params: {
  baseUrl: string;
  promptId: string;
  headers: Headers;
  timeoutMs: number;
  pollIntervalMs: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
}): Promise<void> {
  const deadline = Date.now() + params.timeoutMs;
<<<<<<< HEAD
  while (Date.now() <= deadline) {
=======
  for (;;) {
    const requestTimeoutMs = resolveComfyRemainingMs(deadline, params.timeoutMs);
>>>>>>> upstream/main
    const status = await readJsonResponse<ComfyStatusResponse>({
      url: `${params.baseUrl}/api/job/${params.promptId}/status`,
      init: {
        method: "GET",
        headers: params.headers,
      },
<<<<<<< HEAD
      timeoutMs: params.timeoutMs,
=======
      timeoutMs: requestTimeoutMs,
>>>>>>> upstream/main
      policy: params.policy,
      dispatcherPolicy: params.dispatcherPolicy,
      auditContext: "comfy-status",
      errorPrefix: "Comfy status lookup failed",
    });

    if (status.status === "completed") {
      return;
    }
    if (status.status === "failed" || status.status === "cancelled") {
      throw new Error(
        `Comfy workflow ${status.status}: ${status.error ?? status.message ?? params.promptId}`,
      );
    }

<<<<<<< HEAD
    await new Promise((resolve) => setTimeout(resolve, params.pollIntervalMs));
  }

  throw new Error(`Comfy workflow did not finish within ${Math.ceil(params.timeoutMs / 1000)}s`);
=======
    const pollDelayMs = resolveComfyRemainingMs(deadline, params.timeoutMs, params.pollIntervalMs);
    await new Promise((resolve) => {
      setTimeout(resolve, pollDelayMs);
    });
  }
}

function resolveComfyRemainingMs(
  deadline: number,
  timeoutMs: number,
  defaultTimeoutMs = timeoutMs,
) {
  const defaultMs = resolvePositiveTimerTimeoutMs(defaultTimeoutMs, 1);
  const remainingMs = deadline - Date.now();
  if (remainingMs <= 0) {
    throw new Error(`Comfy workflow did not finish within ${Math.ceil(timeoutMs / 1000)}s`);
  }
  return Math.max(1, Math.min(defaultMs, remainingMs));
>>>>>>> upstream/main
}

function collectOutputFiles(params: {
  history: ComfyHistoryEntry;
  outputNodeId?: string;
  outputKinds: readonly ComfyOutputKind[];
}): Array<{ nodeId: string; file: ComfyOutputFile }> {
  const outputs = params.history.outputs;
  if (!outputs) {
    return [];
  }

  const nodeIds = params.outputNodeId ? [params.outputNodeId] : Object.keys(outputs);
  const files: Array<{ nodeId: string; file: ComfyOutputFile }> = [];
  for (const nodeId of nodeIds) {
    const entry = outputs[nodeId];
    if (!entry) {
      continue;
    }
    for (const kind of params.outputKinds) {
      const bucket = entry[kind];
      if (!Array.isArray(bucket)) {
        continue;
      }
      for (const file of bucket) {
        files.push({ nodeId, file });
      }
    }
  }
  return files;
}

async function downloadOutputFile(params: {
  baseUrl: string;
  headers: Headers;
  timeoutMs: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
  file: ComfyOutputFile;
  mode: ComfyMode;
  capability: ComfyCapability;
<<<<<<< HEAD
}): Promise<{ buffer: Buffer; mimeType: string }> {
  const fileName = params.file.filename?.trim() || params.file.name?.trim();
=======
  maxBytes: number;
}): Promise<{ buffer: Buffer; mimeType: string }> {
  const fileName =
    normalizeOptionalString(params.file.filename) || normalizeOptionalString(params.file.name);
>>>>>>> upstream/main
  if (!fileName) {
    throw new Error("Comfy output entry missing filename");
  }

  const query = new URLSearchParams({
    filename: fileName,
<<<<<<< HEAD
    subfolder: params.file.subfolder?.trim() ?? "",
    type: params.file.type?.trim() ?? "output",
=======
    subfolder: normalizeOptionalString(params.file.subfolder) ?? "",
    type: normalizeOptionalString(params.file.type) ?? "output",
>>>>>>> upstream/main
  });
  const viewPath = params.mode === "cloud" ? "/api/view" : "/view";
  const auditContext = `comfy-${params.capability}-download`;

  const firstResponse = await comfyFetchGuard({
    url: `${params.baseUrl}${viewPath}?${query.toString()}`,
    init: {
      method: "GET",
      headers: params.headers,
      ...(params.mode === "cloud" ? { redirect: "manual" } : {}),
    },
    timeoutMs: params.timeoutMs,
    policy: params.policy,
    dispatcherPolicy: params.dispatcherPolicy,
    auditContext,
  });

  try {
    if (
      params.mode === "cloud" &&
      [301, 302, 303, 307, 308].includes(firstResponse.response.status)
    ) {
<<<<<<< HEAD
      const redirectUrl = firstResponse.response.headers.get("location")?.trim();
=======
      const redirectUrl = normalizeOptionalString(firstResponse.response.headers.get("location"));
>>>>>>> upstream/main
      if (!redirectUrl) {
        throw new Error("Comfy cloud output redirect missing location header");
      }
      const redirected = await comfyFetchGuard({
        url: redirectUrl,
        init: {
          method: "GET",
        },
        timeoutMs: params.timeoutMs,
        dispatcherPolicy: params.dispatcherPolicy,
        auditContext,
      });
      try {
        await assertOkOrThrowHttpError(redirected.response, "Comfy output download failed");
        const mimeType =
<<<<<<< HEAD
          redirected.response.headers.get("content-type")?.trim() || "application/octet-stream";
        return {
          buffer: Buffer.from(await redirected.response.arrayBuffer()),
=======
          normalizeOptionalString(redirected.response.headers.get("content-type")) ||
          "application/octet-stream";
        return {
          buffer: await readResponseWithLimit(redirected.response, params.maxBytes, {
            chunkTimeoutMs: params.timeoutMs,
            onOverflow: ({ maxBytes }) =>
              new Error(`Comfy ${params.capability} output download exceeds ${maxBytes} bytes`),
            onIdleTimeout: ({ chunkTimeoutMs }) =>
              new Error(
                `Comfy ${params.capability} output download stalled after ${chunkTimeoutMs}ms`,
              ),
          }),
>>>>>>> upstream/main
          mimeType,
        };
      } finally {
        await redirected.release();
      }
    }

    await assertOkOrThrowHttpError(firstResponse.response, "Comfy output download failed");
    const mimeType =
<<<<<<< HEAD
      firstResponse.response.headers.get("content-type")?.trim() || "application/octet-stream";
    return {
      buffer: Buffer.from(await firstResponse.response.arrayBuffer()),
=======
      normalizeOptionalString(firstResponse.response.headers.get("content-type")) ||
      "application/octet-stream";
    return {
      buffer: await readResponseWithLimit(firstResponse.response, params.maxBytes, {
        chunkTimeoutMs: params.timeoutMs,
        onOverflow: ({ maxBytes }) =>
          new Error(`Comfy ${params.capability} output download exceeds ${maxBytes} bytes`),
        onIdleTimeout: ({ chunkTimeoutMs }) =>
          new Error(`Comfy ${params.capability} output download stalled after ${chunkTimeoutMs}ms`),
      }),
>>>>>>> upstream/main
      mimeType,
    };
  } finally {
    await firstResponse.release();
  }
}

export function isComfyCapabilityConfigured(params: {
  cfg?: OpenClawConfig;
  agentDir?: string;
  capability: ComfyCapability;
}): boolean {
  const config = getComfyConfig(params.cfg);
  const capabilityConfig = getComfyCapabilityConfig(config, params.capability);
  const hasWorkflow = Boolean(
    resolveComfyWorkflowSource(capabilityConfig).workflow ||
<<<<<<< HEAD
    readConfigString(capabilityConfig, "workflowPath"),
  );
  const hasPromptNode = Boolean(readConfigString(capabilityConfig, "promptNodeId"));
=======
    normalizeOptionalString(capabilityConfig.workflowPath),
  );
  const hasPromptNode = Boolean(normalizeOptionalString(capabilityConfig.promptNodeId));
>>>>>>> upstream/main
  if (!hasWorkflow || !hasPromptNode) {
    return false;
  }
  if (resolveComfyMode(capabilityConfig) === "local") {
    return true;
  }
<<<<<<< HEAD
=======
  const configuredApiKey = resolveComfyApiKey(capabilityConfig, params.cfg);
  if (configuredApiKey.status === "available") {
    return true;
  }
  if (configuredApiKey.status === "configured_unavailable") {
    return false;
  }
>>>>>>> upstream/main
  return isProviderApiKeyConfigured({
    provider: "comfy",
    agentDir: params.agentDir,
  });
}

export async function runComfyWorkflow(params: {
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  prompt: string;
  model?: string;
  timeoutMs?: number;
  capability: ComfyCapability;
  outputKinds: readonly ComfyOutputKind[];
  inputImage?: ComfySourceImage;
}): Promise<ComfyWorkflowResult> {
  const config = getComfyConfig(params.cfg);
  const capabilityConfig = getComfyCapabilityConfig(config, params.capability);
  const mode = resolveComfyMode(capabilityConfig);
  const workflow = await loadComfyWorkflow(capabilityConfig);
  const promptNodeId = getRequiredConfigString(capabilityConfig, "promptNodeId");
  const promptInputName =
<<<<<<< HEAD
    readConfigString(capabilityConfig, "promptInputName") ?? DEFAULT_PROMPT_INPUT_NAME;
  const inputImageNodeId = readConfigString(capabilityConfig, "inputImageNodeId");
  const inputImageInputName =
    readConfigString(capabilityConfig, "inputImageInputName") ?? DEFAULT_INPUT_IMAGE_INPUT_NAME;
  const outputNodeId = readConfigString(capabilityConfig, "outputNodeId");
  const pollIntervalMs =
    readConfigInteger(capabilityConfig, "pollIntervalMs") ?? DEFAULT_POLL_INTERVAL_MS;
  const timeoutMs =
    readConfigInteger(capabilityConfig, "timeoutMs") ?? params.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const providerModel = params.model?.trim() || DEFAULT_COMFY_MODEL;
=======
    normalizeOptionalString(capabilityConfig.promptInputName) ?? DEFAULT_PROMPT_INPUT_NAME;
  const inputImageNodeId = normalizeOptionalString(capabilityConfig.inputImageNodeId);
  const inputImageInputName =
    normalizeOptionalString(capabilityConfig.inputImageInputName) ?? DEFAULT_INPUT_IMAGE_INPUT_NAME;
  const outputNodeId = normalizeOptionalString(capabilityConfig.outputNodeId);
  const pollIntervalMs = resolvePositiveTimerTimeoutMs(
    readConfigInteger(capabilityConfig, "pollIntervalMs"),
    DEFAULT_POLL_INTERVAL_MS,
  );
  const timeoutMs = resolvePositiveTimerTimeoutMs(
    readConfigInteger(capabilityConfig, "timeoutMs") ?? params.timeoutMs,
    DEFAULT_TIMEOUT_MS,
  );
  const providerModel = normalizeOptionalString(params.model) || DEFAULT_COMFY_MODEL;
>>>>>>> upstream/main

  setWorkflowInput({
    workflow,
    nodeId: promptNodeId,
    inputName: promptInputName,
    value: params.prompt,
  });

<<<<<<< HEAD
  const resolvedAuth =
    mode === "cloud"
      ? await resolveApiKeyForProvider({
          provider: "comfy",
          cfg: params.cfg,
          agentDir: params.agentDir,
          store: params.authStore,
        })
=======
  const pluginApiKey = resolveComfyApiKey(capabilityConfig, params.cfg);
  const resolvedAuth =
    mode === "cloud"
      ? pluginApiKey.status === "available"
        ? {
            apiKey: pluginApiKey.apiKey,
            source: pluginApiKey.source,
            mode: "api-key" as const,
          }
        : pluginApiKey.status === "configured_unavailable"
          ? null
          : await resolveApiKeyForProvider({
              provider: "comfy",
              cfg: params.cfg,
              agentDir: params.agentDir,
              store: params.authStore,
            })
>>>>>>> upstream/main
      : null;
  if (mode === "cloud" && !resolvedAuth?.apiKey) {
    throw new Error("Comfy Cloud API key missing");
  }

  const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
    resolveProviderHttpRequestConfig({
<<<<<<< HEAD
      baseUrl: readConfigString(capabilityConfig, "baseUrl"),
=======
      baseUrl: normalizeOptionalString(capabilityConfig.baseUrl),
>>>>>>> upstream/main
      defaultBaseUrl:
        mode === "cloud" ? DEFAULT_COMFY_CLOUD_BASE_URL : DEFAULT_COMFY_LOCAL_BASE_URL,
      allowPrivateNetwork:
        mode === "local" || readConfigBoolean(capabilityConfig, "allowPrivateNetwork") === true,
      defaultHeaders:
        mode === "cloud"
          ? {
              "X-API-Key": resolvedAuth?.apiKey ?? "",
              "Content-Type": "application/json",
            }
          : {
              "Content-Type": "application/json",
            },
      provider: "comfy",
      capability: params.capability === "music" ? "audio" : params.capability,
      transport: "http",
    });
  const normalizedBaseUrl =
    normalizeBaseUrl(baseUrl) ||
    (mode === "cloud" ? DEFAULT_COMFY_CLOUD_BASE_URL : DEFAULT_COMFY_LOCAL_BASE_URL);
  const networkPolicy = resolveComfyNetworkPolicy({
    baseUrl: normalizedBaseUrl,
    allowPrivateNetwork,
  });

  if (params.inputImage) {
    if (!inputImageNodeId) {
      throw new Error(
<<<<<<< HEAD
        "Comfy edit requests require models.providers.comfy.<capability>.inputImageNodeId to be configured",
=======
        "Comfy edit requests require plugins.entries.comfy.config.<capability>.inputImageNodeId to be configured",
>>>>>>> upstream/main
      );
    }
    const uploadedName = await uploadInputImage({
      baseUrl: normalizedBaseUrl,
      headers: new Headers(headers),
      timeoutMs,
      policy: networkPolicy.apiPolicy,
      dispatcherPolicy,
      image: params.inputImage,
      mode,
      capability: params.capability,
    });
    setWorkflowInput({
      workflow,
      nodeId: inputImageNodeId,
      inputName: inputImageInputName,
      value: uploadedName,
    });
  }

  const submitPayload = {
    prompt: workflow,
    ...(mode === "cloud" && resolvedAuth?.apiKey
      ? { extra_data: { api_key_comfy_org: resolvedAuth.apiKey } }
      : {}),
  };

  const promptResponse = await readJsonResponse<ComfyPromptResponse>({
    url: `${normalizedBaseUrl}${mode === "cloud" ? "/api/prompt" : "/prompt"}`,
    init: {
      method: "POST",
      headers,
      body: JSON.stringify(submitPayload),
    },
    timeoutMs,
    policy: networkPolicy.apiPolicy,
    dispatcherPolicy,
    auditContext: `comfy-${params.capability}-generate`,
    errorPrefix: "Comfy workflow submit failed",
  });

<<<<<<< HEAD
  const promptId = promptResponse.prompt_id?.trim();
=======
  const promptId = normalizeOptionalString(promptResponse.prompt_id);
>>>>>>> upstream/main
  if (!promptId) {
    throw new Error("Comfy workflow submit response missing prompt_id");
  }

  const history =
    mode === "cloud"
      ? await (async () => {
          await waitForCloudCompletion({
            baseUrl: normalizedBaseUrl,
            promptId,
            headers: new Headers(headers),
            timeoutMs,
            pollIntervalMs,
            policy: networkPolicy.apiPolicy,
            dispatcherPolicy,
          });
          return await readJsonResponse<unknown>({
            url: `${normalizedBaseUrl}/api/history_v2/${promptId}`,
            init: {
              method: "GET",
              headers: new Headers(headers),
            },
            timeoutMs,
            policy: networkPolicy.apiPolicy,
            dispatcherPolicy,
            auditContext: "comfy-history",
            errorPrefix: "Comfy history lookup failed",
          });
        })()
      : await waitForLocalHistory({
          baseUrl: normalizedBaseUrl,
          promptId,
          headers: new Headers(headers),
          timeoutMs,
          pollIntervalMs,
          policy: networkPolicy.apiPolicy,
          dispatcherPolicy,
        });

  const historyEntry = extractHistoryEntry(history, promptId);
  if (!historyEntry) {
    throw new Error(`Comfy history response missing outputs for prompt ${promptId}`);
  }

  const outputFiles = collectOutputFiles({
    history: historyEntry,
    outputNodeId,
    outputKinds: params.outputKinds,
  });
  if (outputFiles.length === 0) {
    throw new Error(`Comfy workflow ${promptId} completed without ${params.capability} outputs`);
  }

  const assets: ComfyGeneratedAsset[] = [];
<<<<<<< HEAD
=======
  const maxOutputBytes = resolveComfyGeneratedOutputMaxBytes({
    cfg: params.cfg,
    capability: params.capability,
  });
>>>>>>> upstream/main
  let assetIndex = 0;
  for (const output of outputFiles) {
    const downloaded = await downloadOutputFile({
      baseUrl: normalizedBaseUrl,
      headers: new Headers(headers),
      timeoutMs,
      policy: networkPolicy.apiPolicy,
      dispatcherPolicy,
      file: output.file,
      mode,
      capability: params.capability,
<<<<<<< HEAD
    });
    assetIndex += 1;
    const originalName = output.file.filename?.trim() || output.file.name?.trim();
=======
      maxBytes: maxOutputBytes,
    });
    assetIndex += 1;
    const originalName =
      normalizeOptionalString(output.file.filename) || normalizeOptionalString(output.file.name);
>>>>>>> upstream/main
    assets.push({
      buffer: downloaded.buffer,
      mimeType: downloaded.mimeType,
      fileName:
        originalName ||
<<<<<<< HEAD
        `${params.capability}-${assetIndex}.${inferFileExtension({ mimeType: downloaded.mimeType })}`,
=======
        `${params.capability}-${assetIndex}.${resolveFileExtension({ mimeType: downloaded.mimeType })}`,
>>>>>>> upstream/main
      nodeId: output.nodeId,
    });
  }

  return {
    assets,
    model: providerModel,
    promptId,
<<<<<<< HEAD
    outputNodeIds: Array.from(new Set(outputFiles.map((entry) => entry.nodeId))),
=======
    outputNodeIds: uniqueStrings(outputFiles.map((entry) => entry.nodeId)),
>>>>>>> upstream/main
  };
}
