<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
import type { Api } from "@mariozechner/pi-ai";
import type { ModelDefinitionConfig, ModelProviderConfig } from "../../config/types.js";
import { normalizeGoogleApiBaseUrl } from "../../infra/google-api-base-url.js";
import { isSecretRefHeaderValueMarker } from "../model-auth-markers.js";
=======
/**
 * Converts inline provider model config into runtime model definitions.
 */
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import type { ModelDefinitionConfig, ModelProviderConfig } from "../../config/types.js";
import { normalizeGoogleApiBaseUrl } from "../../infra/google-api-base-url.js";
import type { Api } from "../../llm/types.js";
import { isSecretRefHeaderValueMarker } from "../model-auth-markers.js";
import { attachModelProviderLocalService } from "../provider-local-service.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
import {
  attachModelProviderRequestTransport,
  resolveProviderRequestConfig,
  sanitizeConfiguredModelProviderRequest,
} from "../provider-request-config.js";

<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
=======
/**
 * Normalizes inline `models.providers` config into runtime model entries.
 */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
export type InlineModelEntry = Omit<ModelDefinitionConfig, "api"> & {
  api?: Api;
  provider: string;
  baseUrl?: string;
  headers?: Record<string, string>;
};

export type InlineProviderConfig = {
  baseUrl?: string;
  api?: ModelDefinitionConfig["api"];
  models?: ModelDefinitionConfig[];
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
  headers?: unknown;
  authHeader?: boolean;
  request?: ModelProviderConfig["request"];
};

=======
  contextWindow?: ModelProviderConfig["contextWindow"];
  contextTokens?: ModelProviderConfig["contextTokens"];
  maxTokens?: ModelProviderConfig["maxTokens"];
  params?: ModelProviderConfig["params"];
  headers?: unknown;
  authHeader?: boolean;
  timeoutSeconds?: ModelProviderConfig["timeoutSeconds"];
  request?: ModelProviderConfig["request"];
  localService?: ModelProviderConfig["localService"];
};

/** Returns a supported transport API id from raw config values. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
export function normalizeResolvedTransportApi(
  api: unknown,
): ModelDefinitionConfig["api"] | undefined {
  switch (api) {
    case "anthropic-messages":
    case "bedrock-converse-stream":
    case "github-copilot":
    case "google-generative-ai":
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
    case "ollama":
    case "openai-codex-responses":
=======
    case "google-vertex":
    case "ollama":
    case "openai-chatgpt-responses":
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
    case "openai-completions":
    case "openai-responses":
    case "azure-openai-responses":
      return api;
    default:
      return undefined;
  }
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
=======
/** Sanitizes configured provider/model headers before they enter runtime model metadata. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
export function sanitizeModelHeaders(
  headers: unknown,
  opts?: { stripSecretRefMarkers?: boolean },
): Record<string, string> | undefined {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return undefined;
  }
  const next: Record<string, string> = {};
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (typeof headerValue !== "string") {
      continue;
    }
    if (opts?.stripSecretRefMarkers && isSecretRefHeaderValueMarker(headerValue)) {
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
=======
      // Catalog/runtime model records are inspectable. Secret-ref markers are resolved later during
      // auth setup, so inline provider discovery must not expose them as literal headers.
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
      continue;
    }
    next[headerName] = headerValue;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

function isLegacyFoundryVisionModelCandidate(params: {
  provider?: string;
  modelId?: string;
  modelName?: string;
}): boolean {
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
  if (params.provider?.trim().toLowerCase() !== "microsoft-foundry") {
=======
  if (normalizeOptionalLowercaseString(params.provider) !== "microsoft-foundry") {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
    return false;
  }
  const normalizedCandidates = [params.modelId, params.modelName]
    .filter((value): value is string => typeof value === "string")
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
=======
    .map((value) => normalizeOptionalLowercaseString(value))
    .filter((value): value is string => Boolean(value));
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
  return normalizedCandidates.some(
    (candidate) =>
      candidate.startsWith("gpt-") ||
      candidate.startsWith("o1") ||
      candidate.startsWith("o3") ||
      candidate.startsWith("o4") ||
      candidate === "computer-use-preview",
  );
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
=======
/** Resolves model input modalities with Foundry legacy vision-model compatibility. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
export function resolveProviderModelInput(params: {
  provider?: string;
  modelId?: string;
  modelName?: string;
  input?: unknown;
  fallbackInput?: unknown;
}): Array<"text" | "image"> {
  const resolvedInput = Array.isArray(params.input) ? params.input : params.fallbackInput;
  const normalizedInput = Array.isArray(resolvedInput)
    ? resolvedInput.filter((item): item is "text" | "image" => item === "text" || item === "image")
    : [];
  if (
    normalizedInput.length > 0 &&
    !normalizedInput.includes("image") &&
    isLegacyFoundryVisionModelCandidate(params)
  ) {
    return ["text", "image"];
  }
  return normalizedInput.length > 0 ? normalizedInput : ["text"];
}

function resolveInlineProviderTransport(params: { api?: Api | null; baseUrl?: string }): {
  api?: Api;
  baseUrl?: string;
} {
  const api = normalizeResolvedTransportApi(params.api);
  return {
    api,
    baseUrl:
      api === "google-generative-ai" ? normalizeGoogleApiBaseUrl(params.baseUrl) : params.baseUrl,
  };
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
=======
/** Builds runtime model records from inline provider config, inheriting provider-level defaults. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
export function buildInlineProviderModels(
  providers: Record<string, InlineProviderConfig>,
): InlineModelEntry[] {
  return Object.entries(providers).flatMap(([providerId, entry]) => {
    const trimmed = providerId.trim();
    if (!trimmed) {
      return [];
    }
    const providerHeaders = sanitizeModelHeaders(entry?.headers, {
      stripSecretRefMarkers: true,
    });
    const providerRequest = sanitizeConfiguredModelProviderRequest(entry?.request);
    return (entry?.models ?? []).map((model) => {
      const transport = resolveInlineProviderTransport({
        api: model.api ?? entry?.api,
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
        baseUrl: entry?.baseUrl,
=======
        baseUrl: (model as InlineModelEntry).baseUrl ?? entry?.baseUrl,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
      });
      const modelHeaders = sanitizeModelHeaders((model as InlineModelEntry).headers, {
        stripSecretRefMarkers: true,
      });
      const requestConfig = resolveProviderRequestConfig({
        provider: trimmed,
        api: transport.api ?? model.api,
        baseUrl: transport.baseUrl,
        providerHeaders,
        modelHeaders,
        authHeader: entry?.authHeader,
        request: providerRequest,
        capability: "llm",
        transport: "stream",
      });
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.inline-provider.ts
      return attachModelProviderRequestTransport(
        {
          ...model,
          input: resolveProviderModelInput({
            provider: trimmed,
            modelId: model.id,
            modelName: model.name,
            input: model.input,
          }),
          provider: trimmed,
          baseUrl: requestConfig.baseUrl ?? transport.baseUrl,
          api: requestConfig.api ?? model.api,
          headers: requestConfig.headers,
        },
        providerRequest,
=======
      return attachModelProviderLocalService(
        attachModelProviderRequestTransport(
          {
            ...model,
            contextWindow: model.contextWindow ?? entry?.contextWindow,
            contextTokens: model.contextTokens ?? entry?.contextTokens,
            maxTokens: model.maxTokens ?? entry?.maxTokens,
            input: resolveProviderModelInput({
              provider: trimmed,
              modelId: model.id,
              modelName: model.name,
              input: model.input,
            }),
            provider: trimmed,
            baseUrl: requestConfig.baseUrl ?? transport.baseUrl,
            api: requestConfig.api ?? model.api,
            headers: requestConfig.headers,
          },
          providerRequest,
        ),
        entry?.localService,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.inline-provider.ts
      );
    });
  });
}
