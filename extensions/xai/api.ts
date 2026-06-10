<<<<<<< HEAD
import {
  getModelProviderHint,
  normalizeNativeXaiModelId,
  normalizeProviderId,
  resolveProviderEndpoint,
} from "openclaw/plugin-sdk/provider-model-shared";
import {
  applyXaiModelCompat,
  resolveXaiModelCompatPatch,
} from "openclaw/plugin-sdk/provider-tools";

export { buildXaiProvider } from "./provider-catalog.js";
export { applyXaiConfig, applyXaiProviderConfig } from "./onboard.js";
=======
// Xai API module exposes the plugin public contract.
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import {
  normalizeOptionalLowercaseString,
  readStringValue,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import {
  applyXaiModelCompat,
  HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING,
  normalizeNativeXaiModelId,
  XAI_TOOL_SCHEMA_PROFILE,
} from "./model-compat.js";

export { buildXaiProvider } from "./provider-catalog.js";
export { applyXaiConfig, applyXaiProviderConfig } from "./onboard.js";
export { buildXaiImageGenerationProvider } from "./image-generation-provider.js";
>>>>>>> upstream/main
export {
  buildXaiCatalogModels,
  buildXaiModelDefinition,
  resolveXaiCatalogEntry,
  XAI_BASE_URL,
  XAI_DEFAULT_CONTEXT_WINDOW,
<<<<<<< HEAD
  XAI_DEFAULT_MODEL_ID,
  XAI_DEFAULT_MODEL_REF,
  XAI_DEFAULT_MAX_TOKENS,
} from "./model-definitions.js";
export { isModernXaiModel, resolveXaiForwardCompatModel } from "./provider-models.js";
export {
  applyXaiModelCompat,
  HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING,
  XAI_TOOL_SCHEMA_PROFILE,
  resolveXaiModelCompatPatch,
} from "openclaw/plugin-sdk/provider-tools";

function isXaiNativeEndpoint(baseUrl: unknown): boolean {
  return (
    typeof baseUrl === "string" && resolveProviderEndpoint(baseUrl).endpointClass === "xai-native"
=======
  XAI_DEFAULT_IMAGE_MODEL,
  XAI_DEFAULT_MODEL_ID,
  XAI_DEFAULT_MODEL_REF,
  XAI_DEFAULT_MAX_TOKENS,
  XAI_IMAGE_MODELS,
} from "./model-definitions.js";
export { isModernXaiModel, resolveXaiForwardCompatModel } from "./provider-models.js";
export { applyXaiRuntimeModelCompat } from "./runtime-model-compat.js";
export { applyXaiModelCompat, HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING, XAI_TOOL_SCHEMA_PROFILE };

const XAI_NATIVE_ENDPOINT_HOSTS = new Set(["api.x.ai"]);

function resolveHostname(value: string): string | undefined {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function isXaiNativeEndpoint(baseUrl: unknown): boolean {
  return (
    typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "")
>>>>>>> upstream/main
  );
}

export function isXaiModelHint(modelId: string): boolean {
  return getModelProviderHint(modelId) === "x-ai";
}

export { normalizeNativeXaiModelId as normalizeXaiModelId };

<<<<<<< HEAD
=======
function getModelProviderHint(modelId: string): string | null {
  const trimmed = normalizeOptionalLowercaseString(modelId);
  if (!trimmed) {
    return null;
  }
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) {
    return null;
  }
  return trimmed.slice(0, slashIndex) || null;
}

>>>>>>> upstream/main
function shouldUseXaiResponsesTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): boolean {
  if (params.api !== "openai-completions") {
    return false;
  }
  if (isXaiNativeEndpoint(params.baseUrl)) {
    return true;
  }
  return normalizeProviderId(params.provider) === "xai" && !params.baseUrl;
}

<<<<<<< HEAD
export function shouldContributeXaiCompat(params: {
  modelId: string;
  model: { api?: unknown; baseUrl?: unknown };
}): boolean {
  if (params.model.api !== "openai-completions") {
    return false;
  }
  return isXaiNativeEndpoint(params.model.baseUrl) || isXaiModelHint(params.modelId);
}

=======
>>>>>>> upstream/main
export function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): { api: "openai-responses"; baseUrl?: string } | undefined {
  if (!shouldUseXaiResponsesTransport(params)) {
    return undefined;
  }
  return {
    api: "openai-responses",
<<<<<<< HEAD
    baseUrl: typeof params.baseUrl === "string" ? params.baseUrl : undefined,
  };
}
=======
    baseUrl: readStringValue(params.baseUrl),
  };
}

export function resolveXaiBaseUrl(baseUrlOrConfig?: unknown): string {
  let candidate = baseUrlOrConfig;
  if (
    baseUrlOrConfig &&
    typeof baseUrlOrConfig === "object" &&
    !Array.isArray(baseUrlOrConfig) &&
    "cfg" in baseUrlOrConfig
  ) {
    candidate =
      (baseUrlOrConfig as { cfg?: { models?: { providers?: { xai?: { baseUrl?: unknown } } } } })
        .cfg?.models?.providers?.xai?.baseUrl ?? baseUrlOrConfig;
  }
  return readStringValue(candidate) || "https://api.x.ai/v1";
}
>>>>>>> upstream/main
