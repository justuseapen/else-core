<<<<<<< HEAD
import { Type } from "@sinclair/typebox";
import { getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/config-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/plugin-entry";
=======
// Xai plugin module implements x search behavior.
>>>>>>> upstream/main
import {
  jsonResult,
  readCache,
  readStringArrayParam,
  readStringParam,
  resolveCacheTtlMs,
  resolveTimeoutSeconds,
  writeCache,
} from "openclaw/plugin-sdk/provider-web-search";
<<<<<<< HEAD
import { isXaiToolEnabled, resolveXaiToolApiKey } from "./src/tool-auth-shared.js";
import {
  resolveEffectiveXSearchConfig,
  resolveLegacyXSearchConfig,
} from "./src/x-search-config.js";
import {
  buildXaiXSearchPayload,
  requestXaiXSearch,
=======
import { getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/runtime-config-snapshot";
import {
  isXaiToolEnabled,
  resolveXaiToolApiKeyWithAuth,
  type XaiToolAuthContext,
} from "./src/tool-auth-shared.js";
import { resolveEffectiveXSearchConfig } from "./src/x-search-config.js";
import {
  buildXaiXSearchPayload,
  requestXaiXSearch,
  resolveXaiXSearchEndpoint,
>>>>>>> upstream/main
  resolveXaiXSearchInlineCitations,
  resolveXaiXSearchMaxTurns,
  resolveXaiXSearchModel,
  type XaiXSearchOptions,
} from "./src/x-search-shared.js";
<<<<<<< HEAD
=======
import {
  buildMissingXSearchApiKeyPayload,
  createXSearchToolDefinition,
} from "./x-search-tool-shared.js";
>>>>>>> upstream/main

class PluginToolInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolInputError";
  }
}

const X_SEARCH_CACHE_KEY = Symbol.for("openclaw.xai.x-search.cache");

type XSearchCacheEntry = {
  expiresAt: number;
  insertedAt: number;
  value: Record<string, unknown>;
};

function getSharedXSearchCache(): Map<string, XSearchCacheEntry> {
  const root = globalThis as Record<PropertyKey, unknown>;
  const existing = root[X_SEARCH_CACHE_KEY];
  if (existing instanceof Map) {
    return existing as Map<string, XSearchCacheEntry>;
  }
  const next = new Map<string, XSearchCacheEntry>();
  root[X_SEARCH_CACHE_KEY] = next;
  return next;
}

const X_SEARCH_CACHE = getSharedXSearchCache();

<<<<<<< HEAD
function resolveXSearchConfig(cfg?: OpenClawConfig): Record<string, unknown> | undefined {
  return resolveEffectiveXSearchConfig(cfg);
}

function resolveXSearchEnabled(params: {
  cfg?: OpenClawConfig;
  config?: Record<string, unknown>;
  runtimeConfig?: OpenClawConfig;
}): boolean {
  return isXaiToolEnabled({
    enabled: params.config?.enabled as boolean | undefined,
    runtimeConfig: params.runtimeConfig,
    sourceConfig: params.cfg,
  });
}

function resolveXSearchApiKey(params: {
  sourceConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig;
}): string | undefined {
  return resolveXaiToolApiKey(params);
=======
function resolveXSearchConfig(cfg?: unknown): Record<string, unknown> | undefined {
  return resolveEffectiveXSearchConfig(cfg as never);
}

function resolveXSearchEnabled(params: {
  cfg?: unknown;
  config?: Record<string, unknown>;
  runtimeConfig?: unknown;
  auth?: XaiToolAuthContext;
}): boolean {
  return isXaiToolEnabled({
    enabled: params.config?.enabled as boolean | undefined,
    runtimeConfig: params.runtimeConfig as never,
    sourceConfig: params.cfg as never,
    auth: params.auth,
  });
}

async function resolveXSearchApiKey(params: {
  sourceConfig?: unknown;
  runtimeConfig?: unknown;
  auth?: XaiToolAuthContext;
}): Promise<string | undefined> {
  return await resolveXaiToolApiKeyWithAuth(params as never);
>>>>>>> upstream/main
}

function normalizeOptionalIsoDate(value: string | undefined, label: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new PluginToolInputError(`${label} must use YYYY-MM-DD`);
  }
  const [year, month, day] = trimmed.split("-").map((entry) => Number.parseInt(entry, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new PluginToolInputError(`${label} must be a valid calendar date`);
  }
  return trimmed;
}

function buildXSearchCacheKey(params: {
  query: string;
  model: string;
<<<<<<< HEAD
=======
  endpoint: string;
>>>>>>> upstream/main
  inlineCitations: boolean;
  maxTurns?: number;
  options: Omit<XaiXSearchOptions, "query">;
}) {
  return JSON.stringify([
    "x_search",
    params.model,
<<<<<<< HEAD
=======
    params.endpoint,
>>>>>>> upstream/main
    params.query,
    params.inlineCitations,
    params.maxTurns ?? null,
    params.options.allowedXHandles ?? null,
    params.options.excludedXHandles ?? null,
    params.options.fromDate ?? null,
    params.options.toDate ?? null,
    params.options.enableImageUnderstanding ?? false,
    params.options.enableVideoUnderstanding ?? false,
  ]);
}

export function createXSearchTool(options?: {
<<<<<<< HEAD
  config?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
=======
  config?: unknown;
  runtimeConfig?: Record<string, unknown> | null;
  auth?: XaiToolAuthContext;
>>>>>>> upstream/main
}) {
  const xSearchConfig = resolveXSearchConfig(options?.config);
  const runtimeConfig = options?.runtimeConfig ?? getRuntimeConfigSnapshot();
  if (
    !resolveXSearchEnabled({
      cfg: options?.config,
      config: xSearchConfig,
      runtimeConfig: runtimeConfig ?? undefined,
<<<<<<< HEAD
=======
      auth: options?.auth,
>>>>>>> upstream/main
    })
  ) {
    return null;
  }

<<<<<<< HEAD
  return {
    label: "X Search",
    name: "x_search",
    description:
      "Search X (formerly Twitter) using xAI, including targeted post or thread lookups. For per-post stats like reposts, replies, bookmarks, or views, prefer the exact post URL or status ID.",
    parameters: Type.Object({
      query: Type.String({ description: "X search query string." }),
      allowed_x_handles: Type.Optional(
        Type.Array(Type.String({ minLength: 1 }), {
          description: "Only include posts from these X handles.",
        }),
      ),
      excluded_x_handles: Type.Optional(
        Type.Array(Type.String({ minLength: 1 }), {
          description: "Exclude posts from these X handles.",
        }),
      ),
      from_date: Type.Optional(
        Type.String({ description: "Only include posts on or after this date (YYYY-MM-DD)." }),
      ),
      to_date: Type.Optional(
        Type.String({ description: "Only include posts on or before this date (YYYY-MM-DD)." }),
      ),
      enable_image_understanding: Type.Optional(
        Type.Boolean({ description: "Allow xAI to inspect images attached to matching posts." }),
      ),
      enable_video_understanding: Type.Optional(
        Type.Boolean({ description: "Allow xAI to inspect videos attached to matching posts." }),
      ),
    }),
    execute: async (_toolCallId: string, args: Record<string, unknown>) => {
      const apiKey = resolveXSearchApiKey({
        sourceConfig: options?.config,
        runtimeConfig: runtimeConfig ?? undefined,
      });
      if (!apiKey) {
        return jsonResult({
          error: "missing_xai_api_key",
          message:
            "x_search needs an xAI API key. Set XAI_API_KEY in the Gateway environment, or configure plugins.entries.xai.config.webSearch.apiKey.",
          docs: "https://docs.openclaw.ai/tools/web",
        });
      }

      const query = readStringParam(args, "query", { required: true });
      const allowedXHandles = readStringArrayParam(args, "allowed_x_handles");
      const excludedXHandles = readStringArrayParam(args, "excluded_x_handles");
      const fromDate = normalizeOptionalIsoDate(readStringParam(args, "from_date"), "from_date");
      const toDate = normalizeOptionalIsoDate(readStringParam(args, "to_date"), "to_date");
      if (fromDate && toDate && fromDate > toDate) {
        throw new PluginToolInputError("from_date must be on or before to_date");
      }

      const xSearchOptions: XaiXSearchOptions = {
        query,
=======
  return createXSearchToolDefinition(async (_toolCallId: string, args: Record<string, unknown>) => {
    const apiKey = await resolveXSearchApiKey({
      sourceConfig: options?.config,
      runtimeConfig: runtimeConfig ?? undefined,
      auth: options?.auth,
    });
    if (!apiKey) {
      return jsonResult(buildMissingXSearchApiKeyPayload());
    }

    const query = readStringParam(args, "query", { required: true });
    const allowedXHandles = readStringArrayParam(args, "allowed_x_handles");
    const excludedXHandles = readStringArrayParam(args, "excluded_x_handles");
    const fromDate = normalizeOptionalIsoDate(readStringParam(args, "from_date"), "from_date");
    const toDate = normalizeOptionalIsoDate(readStringParam(args, "to_date"), "to_date");
    if (fromDate && toDate && fromDate > toDate) {
      throw new PluginToolInputError("from_date must be on or before to_date");
    }

    const xSearchOptions: XaiXSearchOptions = {
      query,
      allowedXHandles,
      excludedXHandles,
      fromDate,
      toDate,
      enableImageUnderstanding: args.enable_image_understanding === true,
      enableVideoUnderstanding: args.enable_video_understanding === true,
    };
    const xSearchConfigRecord = xSearchConfig;
    const model = resolveXaiXSearchModel(xSearchConfigRecord);
    const endpoint = resolveXaiXSearchEndpoint(xSearchConfigRecord);
    const inlineCitations = resolveXaiXSearchInlineCitations(xSearchConfigRecord);
    const maxTurns = resolveXaiXSearchMaxTurns(xSearchConfigRecord);
    const cacheKey = buildXSearchCacheKey({
      query,
      model,
      endpoint,
      inlineCitations,
      maxTurns,
      options: {
>>>>>>> upstream/main
        allowedXHandles,
        excludedXHandles,
        fromDate,
        toDate,
<<<<<<< HEAD
        enableImageUnderstanding: args.enable_image_understanding === true,
        enableVideoUnderstanding: args.enable_video_understanding === true,
      };
      const xSearchConfigRecord = xSearchConfig as Record<string, unknown> | undefined;
      const model = resolveXaiXSearchModel(xSearchConfigRecord);
      const inlineCitations = resolveXaiXSearchInlineCitations(xSearchConfigRecord);
      const maxTurns = resolveXaiXSearchMaxTurns(xSearchConfigRecord);
      const cacheKey = buildXSearchCacheKey({
        query,
        model,
        inlineCitations,
        maxTurns,
        options: {
          allowedXHandles,
          excludedXHandles,
          fromDate,
          toDate,
          enableImageUnderstanding: xSearchOptions.enableImageUnderstanding,
          enableVideoUnderstanding: xSearchOptions.enableVideoUnderstanding,
        },
      });
      const cached = readCache(X_SEARCH_CACHE, cacheKey);
      if (cached) {
        return jsonResult({ ...cached.value, cached: true });
      }

      const startedAt = Date.now();
      const result = await requestXaiXSearch({
        apiKey,
        model,
        timeoutSeconds: resolveTimeoutSeconds(xSearchConfig?.timeoutSeconds, 30),
        inlineCitations,
        maxTurns,
        options: xSearchOptions,
      });
      const payload = buildXaiXSearchPayload({
        query,
        model,
        tookMs: Date.now() - startedAt,
        content: result.content,
        citations: result.citations,
        inlineCitations: result.inlineCitations,
        options: xSearchOptions,
      });
      writeCache(
        X_SEARCH_CACHE,
        cacheKey,
        payload,
        resolveCacheTtlMs(xSearchConfig?.cacheTtlMinutes, 15),
      );
      return jsonResult(payload);
    },
  };
=======
        enableImageUnderstanding: xSearchOptions.enableImageUnderstanding,
        enableVideoUnderstanding: xSearchOptions.enableVideoUnderstanding,
      },
    });
    const cached = readCache(X_SEARCH_CACHE, cacheKey);
    if (cached) {
      return jsonResult({ ...cached.value, cached: true });
    }

    const startedAt = Date.now();
    const result = await requestXaiXSearch({
      apiKey,
      endpoint,
      model,
      timeoutSeconds: resolveTimeoutSeconds(xSearchConfig?.timeoutSeconds, 30),
      inlineCitations,
      maxTurns,
      options: xSearchOptions,
    });
    const payload = buildXaiXSearchPayload({
      query,
      model,
      tookMs: Date.now() - startedAt,
      content: result.content,
      citations: result.citations,
      inlineCitations: result.inlineCitations,
      options: xSearchOptions,
    });
    writeCache(
      X_SEARCH_CACHE,
      cacheKey,
      payload,
      resolveCacheTtlMs(xSearchConfig?.cacheTtlMinutes, 15),
    );
    return jsonResult(payload);
  });
>>>>>>> upstream/main
}
