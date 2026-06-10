<<<<<<< HEAD
import {
  resolveProviderEndpoint,
  resolveProviderHttpRequestConfig,
  type ProviderRequestTransportOverrides,
} from "openclaw/plugin-sdk/provider-http";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import {
  applyAgentDefaultModelPrimary,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import { normalizeAntigravityModelId, normalizeGoogleModelId } from "./model-id.js";
import { parseGoogleOauthApiKey } from "./oauth-token-shared.js";
export { normalizeAntigravityModelId, normalizeGoogleModelId };

type GoogleApiCarrier = {
  api?: string | null;
};

type GoogleProviderConfigLike = GoogleApiCarrier & {
  models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};

export const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function isCanonicalGoogleApiOriginShorthand(value: string): boolean {
  return /^https:\/\/generativelanguage\.googleapis\.com\/?$/i.test(value);
}

export function normalizeGoogleApiBaseUrl(baseUrl?: string): string {
  const raw = trimTrailingSlashes(baseUrl?.trim() || DEFAULT_GOOGLE_API_BASE_URL);
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    if (
      resolveProviderEndpoint(url.toString()).endpointClass === "google-generative-ai" &&
      trimTrailingSlashes(url.pathname || "") === ""
    ) {
      url.pathname = "/v1beta";
    }
    return trimTrailingSlashes(url.toString());
  } catch {
    if (isCanonicalGoogleApiOriginShorthand(raw)) {
      return DEFAULT_GOOGLE_API_BASE_URL;
    }
    return raw;
  }
}

export function isGoogleGenerativeAiApi(api?: string | null): boolean {
  return api === "google-generative-ai";
}

export function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined {
  return baseUrl ? normalizeGoogleApiBaseUrl(baseUrl) : baseUrl;
}

export function resolveGoogleGenerativeAiTransport<TApi extends string | null | undefined>(params: {
  api: TApi;
  baseUrl?: string;
}): { api: TApi; baseUrl?: string } {
  return {
    api: params.api,
    baseUrl: isGoogleGenerativeAiApi(params.api)
      ? normalizeGoogleGenerativeAiBaseUrl(params.baseUrl)
      : params.baseUrl,
  };
}

export function resolveGoogleGenerativeAiApiOrigin(baseUrl?: string): string {
  return normalizeGoogleApiBaseUrl(baseUrl).replace(/\/v1beta$/i, "");
}

export function shouldNormalizeGoogleGenerativeAiProviderConfig(
  providerKey: string,
  provider: GoogleProviderConfigLike,
): boolean {
  if (providerKey === "google" || providerKey === "google-vertex") {
    return true;
  }
  if (isGoogleGenerativeAiApi(provider.api)) {
    return true;
  }
  return provider.models?.some((model) => isGoogleGenerativeAiApi(model?.api)) ?? false;
}

export function shouldNormalizeGoogleProviderConfig(
  providerKey: string,
  provider: GoogleProviderConfigLike,
): boolean {
  return (
    providerKey === "google-antigravity" ||
    shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider)
  );
}

function normalizeProviderModels(
  provider: ModelProviderConfig,
  normalizeId: (id: string) => string,
): ModelProviderConfig {
  const models = provider.models;
  if (!Array.isArray(models) || models.length === 0) {
    return provider;
  }

  let mutated = false;
  const nextModels = models.map((model) => {
    const nextId = normalizeId(model.id);
    if (nextId === model.id) {
      return model;
    }
    mutated = true;
    return { ...model, id: nextId };
  });

  return mutated ? { ...provider, models: nextModels } : provider;
}

export function normalizeGoogleProviderConfig(
  providerKey: string,
  provider: ModelProviderConfig,
): ModelProviderConfig {
  let nextProvider = provider;

  if (shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, nextProvider)) {
    const modelNormalized = normalizeProviderModels(nextProvider, normalizeGoogleModelId);
    const normalizedBaseUrl = normalizeGoogleGenerativeAiBaseUrl(modelNormalized.baseUrl);
    nextProvider =
      normalizedBaseUrl !== modelNormalized.baseUrl
        ? { ...modelNormalized, baseUrl: normalizedBaseUrl ?? modelNormalized.baseUrl }
        : modelNormalized;
  }

  if (providerKey === "google-antigravity") {
    nextProvider = normalizeProviderModels(nextProvider, normalizeAntigravityModelId);
  }

  return nextProvider;
}

export function parseGeminiAuth(apiKey: string): { headers: Record<string, string> } {
  const parsed = apiKey.startsWith("{") ? parseGoogleOauthApiKey(apiKey) : null;
  if (parsed?.token) {
    return {
      headers: {
        Authorization: `Bearer ${parsed.token}`,
        "Content-Type": "application/json",
      },
    };
  }

  return {
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };
=======
// Google API module exposes the plugin public contract.
import {
  resolveProviderHttpRequestConfig,
  type ProviderRequestTransportOverrides,
} from "openclaw/plugin-sdk/provider-http";
import { parseGeminiAuth } from "./gemini-auth.js";
export { parseGeminiAuth };
export { applyGoogleGeminiModelDefault, GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard.js";
import {
  DEFAULT_GOOGLE_API_BASE_URL,
  normalizeGoogleGenerativeAiBaseUrl,
} from "./provider-policy.js";
export { normalizeAntigravityModelId, normalizeGoogleModelId } from "./model-id.js";
export {
  createGoogleThinkingPayloadWrapper,
  createGoogleThinkingStreamWrapper,
  isGoogleGemini3FlashModel,
  isGoogleGemini3ProModel,
  isGoogleGemini3ThinkingLevelModel,
  isGoogleThinkingRequiredModel,
  resolveGoogleGemini3ThinkingLevel,
  sanitizeGoogleThinkingPayload,
  stripInvalidGoogleThinkingBudget,
  type GoogleThinkingInputLevel,
  type GoogleThinkingLevel,
} from "./thinking-api.js";
export {
  buildGoogleGenerativeAiParams,
  createGoogleGenerativeAiTransportStreamFn,
} from "./transport-stream.js";
export {
  DEFAULT_GOOGLE_API_BASE_URL,
  isGoogleGenerativeAiApi,
  isGoogleVertexBaseUrl,
  isGoogleVertexHostname,
  normalizeGoogleApiBaseUrl,
  normalizeGoogleGenerativeAiBaseUrl,
  normalizeGoogleProviderConfig,
  resolveGoogleGenerativeAiApiOrigin,
  resolveGoogleGenerativeAiTransport,
  shouldNormalizeGoogleGenerativeAiProviderConfig,
  shouldNormalizeGoogleProviderConfig,
} from "./provider-policy.js";
export { buildGoogleGeminiCliProvider } from "./gemini-cli-provider.js";
export { buildGoogleProvider } from "./provider-registration.js";

type GoogleGenerativeAiRequestOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};

function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl?: string): string {
  const normalized =
    normalizeGoogleGenerativeAiBaseUrl(baseUrl ?? DEFAULT_GOOGLE_API_BASE_URL) ??
    DEFAULT_GOOGLE_API_BASE_URL;
  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(
      "Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com",
    );
  }
  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "generativelanguage.googleapis.com"
  ) {
    throw new Error(
      "Google Generative AI baseUrl must use https://generativelanguage.googleapis.com",
    );
  }
  return normalized;
>>>>>>> upstream/main
}

export function resolveGoogleGenerativeAiHttpRequestConfig(params: {
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
<<<<<<< HEAD
  request?: ProviderRequestTransportOverrides;
=======
  request?: GoogleGenerativeAiRequestOverrides;
>>>>>>> upstream/main
  capability: "image" | "audio" | "video";
  transport: "http" | "media-understanding";
}) {
  return resolveProviderHttpRequestConfig({
<<<<<<< HEAD
    baseUrl: normalizeGoogleApiBaseUrl(params.baseUrl ?? DEFAULT_GOOGLE_API_BASE_URL),
    defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
    allowPrivateNetwork: Boolean(params.baseUrl?.trim()),
=======
    baseUrl: resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl),
    defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
    allowPrivateNetwork: params.request?.allowPrivateNetwork,
>>>>>>> upstream/main
    headers: params.headers,
    request: params.request,
    defaultHeaders: parseGeminiAuth(params.apiKey).headers,
    provider: "google",
    api: "google-generative-ai",
    capability: params.capability,
    transport: params.transport,
  });
}
<<<<<<< HEAD

export const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";

export function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
} {
  const current = cfg.agents?.defaults?.model as unknown;
  const currentPrimary =
    typeof current === "string"
      ? current.trim() || undefined
      : current &&
          typeof current === "object" &&
          typeof (current as { primary?: unknown }).primary === "string"
        ? ((current as { primary: string }).primary || "").trim() || undefined
        : undefined;
  if (currentPrimary === GOOGLE_GEMINI_DEFAULT_MODEL) {
    return { next: cfg, changed: false };
  }
  return {
    next: applyAgentDefaultModelPrimary(cfg, GOOGLE_GEMINI_DEFAULT_MODEL),
    changed: true,
  };
}
=======
>>>>>>> upstream/main
