<<<<<<< HEAD
import { postTrustedWebToolsJson, wrapWebContent } from "openclaw/plugin-sdk/provider-web-search";
import {
  buildXaiResponsesToolBody,
  resolveXaiResponseTextAndCitations,
  XAI_RESPONSES_ENDPOINT,
=======
// Xai plugin module implements x search shared behavior.
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { postTrustedWebToolsJson, wrapWebContent } from "openclaw/plugin-sdk/provider-web-search";
import {
  buildXaiResponsesToolBody,
  requireXaiResponseTextCitationsAndInline,
  resolveXaiResponsesEndpoint,
>>>>>>> upstream/main
} from "./responses-tool-shared.js";
import {
  coerceXaiToolConfig,
  resolveNormalizedXaiToolModel,
  resolvePositiveIntegerToolConfig,
} from "./tool-config-shared.js";
<<<<<<< HEAD
import { type XaiWebSearchResponse } from "./web-search-shared.js";

export const XAI_X_SEARCH_ENDPOINT = XAI_RESPONSES_ENDPOINT;
export const XAI_DEFAULT_X_SEARCH_MODEL = "grok-4-1-fast-non-reasoning";

export type XaiXSearchConfig = {
  apiKey?: unknown;
=======
import type { XaiWebSearchResponse } from "./web-search-shared.js";

export const XAI_DEFAULT_X_SEARCH_MODEL = "grok-4-1-fast-non-reasoning";

type XaiXSearchConfig = {
  apiKey?: unknown;
  baseUrl?: unknown;
>>>>>>> upstream/main
  model?: unknown;
  inlineCitations?: unknown;
  maxTurns?: unknown;
};

export type XaiXSearchOptions = {
  query: string;
  allowedXHandles?: string[];
  excludedXHandles?: string[];
  fromDate?: string;
  toDate?: string;
  enableImageUnderstanding?: boolean;
  enableVideoUnderstanding?: boolean;
};

<<<<<<< HEAD
export type XaiXSearchResult = {
=======
type XaiXSearchResult = {
>>>>>>> upstream/main
  content: string;
  citations: string[];
  inlineCitations?: XaiWebSearchResponse["inline_citations"];
};

<<<<<<< HEAD
export function resolveXaiXSearchConfig(config?: Record<string, unknown>): XaiXSearchConfig {
  return coerceXaiToolConfig<XaiXSearchConfig>(config);
=======
function resolveXaiXSearchConfig(config?: Record<string, unknown>): XaiXSearchConfig {
  return coerceXaiToolConfig(config) as XaiXSearchConfig;
>>>>>>> upstream/main
}

export function resolveXaiXSearchModel(config?: Record<string, unknown>): string {
  return resolveNormalizedXaiToolModel({
    config,
    defaultModel: XAI_DEFAULT_X_SEARCH_MODEL,
  });
}

<<<<<<< HEAD
=======
export function resolveXaiXSearchEndpoint(config?: Record<string, unknown>): string {
  return resolveXaiResponsesEndpoint(resolveXaiXSearchConfig(config).baseUrl);
}

>>>>>>> upstream/main
export function resolveXaiXSearchInlineCitations(config?: Record<string, unknown>): boolean {
  return resolveXaiXSearchConfig(config).inlineCitations === true;
}

export function resolveXaiXSearchMaxTurns(config?: Record<string, unknown>): number | undefined {
  return resolvePositiveIntegerToolConfig(config, "maxTurns");
}

function buildXSearchTool(options: XaiXSearchOptions): Record<string, unknown> {
  return {
    type: "x_search",
    ...(options.allowedXHandles?.length ? { allowed_x_handles: options.allowedXHandles } : {}),
    ...(options.excludedXHandles?.length ? { excluded_x_handles: options.excludedXHandles } : {}),
    ...(options.fromDate ? { from_date: options.fromDate } : {}),
    ...(options.toDate ? { to_date: options.toDate } : {}),
    ...(options.enableImageUnderstanding ? { enable_image_understanding: true } : {}),
    ...(options.enableVideoUnderstanding ? { enable_video_understanding: true } : {}),
  };
}

export function buildXaiXSearchPayload(params: {
  query: string;
  model: string;
  tookMs: number;
  content: string;
  citations: string[];
  inlineCitations?: XaiWebSearchResponse["inline_citations"];
  options?: XaiXSearchOptions;
}): Record<string, unknown> {
  return {
    query: params.query,
    provider: "xai",
    model: params.model,
    tookMs: params.tookMs,
    externalContent: {
      untrusted: true,
      source: "x_search",
      provider: "xai",
      wrapped: true,
    },
    content: wrapWebContent(params.content, "web_search"),
    citations: params.citations,
    ...(params.inlineCitations ? { inlineCitations: params.inlineCitations } : {}),
    ...(params.options?.allowedXHandles?.length
      ? { allowedXHandles: params.options.allowedXHandles }
      : {}),
    ...(params.options?.excludedXHandles?.length
      ? { excludedXHandles: params.options.excludedXHandles }
      : {}),
    ...(params.options?.fromDate ? { fromDate: params.options.fromDate } : {}),
    ...(params.options?.toDate ? { toDate: params.options.toDate } : {}),
    ...(params.options?.enableImageUnderstanding ? { enableImageUnderstanding: true } : {}),
    ...(params.options?.enableVideoUnderstanding ? { enableVideoUnderstanding: true } : {}),
  };
}

export async function requestXaiXSearch(params: {
  apiKey: string;
<<<<<<< HEAD
=======
  endpoint: string;
>>>>>>> upstream/main
  model: string;
  timeoutSeconds: number;
  inlineCitations: boolean;
  maxTurns?: number;
  options: XaiXSearchOptions;
}): Promise<XaiXSearchResult> {
  return await postTrustedWebToolsJson(
    {
<<<<<<< HEAD
      url: XAI_X_SEARCH_ENDPOINT,
=======
      url: params.endpoint,
>>>>>>> upstream/main
      timeoutSeconds: params.timeoutSeconds,
      apiKey: params.apiKey,
      body: buildXaiResponsesToolBody({
        model: params.model,
        inputText: params.options.query,
        tools: [buildXSearchTool(params.options)],
        maxTurns: params.maxTurns,
      }),
      errorLabel: "xAI",
    },
    async (response) => {
<<<<<<< HEAD
      const data = (await response.json()) as XaiWebSearchResponse;
      const { content, citations } = resolveXaiResponseTextAndCitations(data);
      return {
        content,
        citations,
        inlineCitations:
          params.inlineCitations && Array.isArray(data.inline_citations)
            ? data.inline_citations
            : undefined,
      };
    },
  );
}

export const __testing = {
  buildXSearchTool,
  buildXaiXSearchPayload,
  requestXaiXSearch,
  resolveXaiXSearchConfig,
  resolveXaiXSearchInlineCitations,
  resolveXaiXSearchMaxTurns,
  resolveXaiXSearchModel,
  XAI_DEFAULT_X_SEARCH_MODEL,
} as const;
=======
      const data = (await readProviderJsonObjectResponse(
        response,
        "xAI X search failed",
      )) as XaiWebSearchResponse;
      return requireXaiResponseTextCitationsAndInline(
        data,
        "xAI X search failed",
        params.inlineCitations,
      );
    },
  );
}
>>>>>>> upstream/main
