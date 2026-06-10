<<<<<<< HEAD
import { Type } from "@sinclair/typebox";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
// Ollama provider module implements model/runtime integration.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
import {
  isNonSecretApiKeyMarker,
  normalizeOptionalSecretInput,
} from "openclaw/plugin-sdk/provider-auth";
import { resolveEnvApiKey } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  enablePluginInConfig,
<<<<<<< HEAD
  readNumberParam,
  readResponseText,
  readStringParam,
=======
  readPositiveIntegerParam,
  readResponseText,
  readStringParam,
  resolveProviderWebSearchPluginConfig,
>>>>>>> upstream/main
  resolveSearchCount,
  resolveSiteName,
  truncateText,
  wrapWebContent,
  type WebSearchProviderPlugin,
} from "openclaw/plugin-sdk/provider-web-search";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
<<<<<<< HEAD
import { OLLAMA_DEFAULT_BASE_URL } from "./defaults.js";
=======
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Type } from "typebox";
import { OLLAMA_DEFAULT_BASE_URL } from "./defaults.js";
import { readProviderBaseUrl } from "./provider-base-url.js";
>>>>>>> upstream/main
import {
  buildOllamaBaseUrlSsrFPolicy,
  fetchOllamaModels,
  resolveOllamaApiBase,
} from "./provider-models.js";
import { checkOllamaCloudAuth } from "./setup.js";

const OLLAMA_WEB_SEARCH_SCHEMA = Type.Object(
  {
    query: Type.String({ description: "Search query string." }),
    count: Type.Optional(
<<<<<<< HEAD
      Type.Number({
=======
      Type.Integer({
>>>>>>> upstream/main
        description: "Number of results to return (1-10).",
        minimum: 1,
        maximum: 10,
      }),
    ),
  },
  { additionalProperties: false },
);

<<<<<<< HEAD
const OLLAMA_WEB_SEARCH_PATH = "/api/experimental/web_search";
=======
const OLLAMA_HOSTED_WEB_SEARCH_PATH = "/api/web_search";
const OLLAMA_LOCAL_WEB_SEARCH_PROXY_PATH = "/api/experimental/web_search";
const OLLAMA_CLOUD_BASE_URL = "https://ollama.com";
>>>>>>> upstream/main
const DEFAULT_OLLAMA_WEB_SEARCH_COUNT = 5;
const DEFAULT_OLLAMA_WEB_SEARCH_TIMEOUT_MS = 15_000;
const OLLAMA_WEB_SEARCH_SNIPPET_MAX_CHARS = 300;

type OllamaWebSearchResult = {
  title?: string;
  url?: string;
  content?: string;
};

type OllamaWebSearchResponse = {
  results?: OllamaWebSearchResult[];
};

<<<<<<< HEAD
function resolveOllamaWebSearchApiKey(config?: OpenClawConfig): string | undefined {
=======
type OllamaWebSearchAttempt = {
  baseUrl: string;
  path: string;
  apiKey?: string;
};

async function readOllamaWebSearchResponse(response: Response): Promise<OllamaWebSearchResponse> {
  try {
    return (await response.json()) as OllamaWebSearchResponse;
  } catch (cause) {
    throw new Error("Ollama web search returned malformed JSON", { cause });
  }
}

function isOllamaCloudBaseUrl(baseUrl: string): boolean {
  try {
    const parsed = new URL(baseUrl);
    return parsed.protocol === "https:" && parsed.hostname === "ollama.com";
  } catch {
    return false;
  }
}

function resolveConfiguredOllamaWebSearchApiKey(config?: OpenClawConfig): string | undefined {
>>>>>>> upstream/main
  const providerApiKey = normalizeOptionalSecretInput(config?.models?.providers?.ollama?.apiKey);
  if (providerApiKey && !isNonSecretApiKeyMarker(providerApiKey)) {
    return providerApiKey;
  }
<<<<<<< HEAD
  return resolveEnvApiKey("ollama")?.apiKey;
}

function resolveOllamaWebSearchBaseUrl(config?: OpenClawConfig): string {
  const configuredBaseUrl = config?.models?.providers?.ollama?.baseUrl;
  if (typeof configuredBaseUrl === "string" && configuredBaseUrl.trim()) {
=======
  return undefined;
}

function resolveEnvOllamaWebSearchApiKey(): string | undefined {
  return resolveEnvApiKey("ollama")?.apiKey;
}

function resolveOllamaWebSearchApiKey(config?: OpenClawConfig): string | undefined {
  return resolveConfiguredOllamaWebSearchApiKey(config) ?? resolveEnvOllamaWebSearchApiKey();
}

function resolveOllamaWebSearchBaseUrl(config?: OpenClawConfig): string {
  const pluginBaseUrl = normalizeOptionalString(
    resolveProviderWebSearchPluginConfig(config, "ollama")?.baseUrl,
  );
  if (pluginBaseUrl) {
    return resolveOllamaApiBase(pluginBaseUrl);
  }
  const configuredBaseUrl = readProviderBaseUrl(config?.models?.providers?.ollama);
  if (configuredBaseUrl) {
>>>>>>> upstream/main
    return resolveOllamaApiBase(configuredBaseUrl);
  }
  return OLLAMA_DEFAULT_BASE_URL;
}

function normalizeOllamaWebSearchResult(
  result: OllamaWebSearchResult,
): { title: string; url: string; content: string } | null {
<<<<<<< HEAD
  const url = typeof result.url === "string" ? result.url.trim() : "";
=======
  const url = normalizeOptionalString(result.url) ?? "";
>>>>>>> upstream/main
  if (!url) {
    return null;
  }
  return {
<<<<<<< HEAD
    title: typeof result.title === "string" ? result.title.trim() : "",
    url,
    content: typeof result.content === "string" ? result.content.trim() : "",
  };
}

=======
    title: normalizeOptionalString(result.title) ?? "",
    url,
    content: normalizeOptionalString(result.content) ?? "",
  };
}

function buildOllamaWebSearchAttempts(params: {
  baseUrl: string;
  configuredApiKey?: string;
  envApiKey?: string;
}): OllamaWebSearchAttempt[] {
  if (isOllamaCloudBaseUrl(params.baseUrl)) {
    return [
      {
        baseUrl: params.baseUrl,
        path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
        apiKey: params.configuredApiKey ?? params.envApiKey,
      },
    ];
  }

  const attempts: OllamaWebSearchAttempt[] = [
    {
      baseUrl: params.baseUrl,
      path: OLLAMA_LOCAL_WEB_SEARCH_PROXY_PATH,
      apiKey: params.configuredApiKey,
    },
    {
      baseUrl: params.baseUrl,
      path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
      apiKey: params.configuredApiKey,
    },
  ];
  if (params.envApiKey) {
    attempts.push({
      baseUrl: OLLAMA_CLOUD_BASE_URL,
      path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
      apiKey: params.envApiKey,
    });
  }
  return attempts;
}

>>>>>>> upstream/main
export async function runOllamaWebSearch(params: {
  config?: OpenClawConfig;
  query: string;
  count?: number;
}): Promise<Record<string, unknown>> {
  const query = params.query.trim();
  if (!query) {
    throw new Error("query parameter is required");
  }

  const baseUrl = resolveOllamaWebSearchBaseUrl(params.config);
<<<<<<< HEAD
  const apiKey = resolveOllamaWebSearchApiKey(params.config);
  const count = resolveSearchCount(params.count, DEFAULT_OLLAMA_WEB_SEARCH_COUNT);
  const startedAt = Date.now();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  const { response, release } = await fetchWithSsrFGuard({
    url: `${baseUrl}${OLLAMA_WEB_SEARCH_PATH}`,
    init: {
      method: "POST",
      headers,
      body: JSON.stringify({ query, max_results: count }),
      signal: AbortSignal.timeout(DEFAULT_OLLAMA_WEB_SEARCH_TIMEOUT_MS),
    },
    policy: buildOllamaBaseUrlSsrFPolicy(baseUrl),
    auditContext: "ollama-web-search.search",
  });

  try {
    if (response.status === 401) {
      throw new Error("Ollama web search authentication failed. Run `ollama signin`.");
    }
    if (response.status === 403) {
      throw new Error(
        "Ollama web search is unavailable. Ensure cloud-backed web search is enabled on the Ollama host.",
      );
    }
    if (!response.ok) {
      const detail = await readResponseText(response, { maxBytes: 64_000 });
      throw new Error(`Ollama web search failed (${response.status}): ${detail.text || ""}`.trim());
    }

    const payload = (await response.json()) as OllamaWebSearchResponse;
    const results = Array.isArray(payload.results)
      ? payload.results
          .map(normalizeOllamaWebSearchResult)
          .filter((result): result is NonNullable<typeof result> => result !== null)
          .slice(0, count)
      : [];

    return {
      query,
      provider: "ollama",
      count: results.length,
      tookMs: Date.now() - startedAt,
      externalContent: {
        untrusted: true,
        source: "web_search",
        provider: "ollama",
        wrapped: true,
      },
      results: results.map((result) => {
        const snippet = truncateText(result.content, OLLAMA_WEB_SEARCH_SNIPPET_MAX_CHARS).text;
        return {
          title: result.title ? wrapWebContent(result.title, "web_search") : "",
          url: result.url,
          snippet: snippet ? wrapWebContent(snippet, "web_search") : "",
          siteName: resolveSiteName(result.url) || undefined,
        };
      }),
    };
  } finally {
    await release();
  }
=======
  const configuredApiKey = resolveConfiguredOllamaWebSearchApiKey(params.config);
  const envApiKey = resolveEnvOllamaWebSearchApiKey();
  const count = resolveSearchCount(params.count, DEFAULT_OLLAMA_WEB_SEARCH_COUNT);
  const startedAt = Date.now();
  const body = JSON.stringify({ query, max_results: count });
  const attempts = buildOllamaWebSearchAttempts({ baseUrl, configuredApiKey, envApiKey });

  let payload: OllamaWebSearchResponse | undefined;
  let lastError: Error | undefined;
  for (const attempt of attempts) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (attempt.apiKey) {
      headers.Authorization = `Bearer ${attempt.apiKey}`;
    }
    const { response, release } = await fetchWithSsrFGuard({
      url: `${attempt.baseUrl}${attempt.path}`,
      init: {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(DEFAULT_OLLAMA_WEB_SEARCH_TIMEOUT_MS),
      },
      policy: buildOllamaBaseUrlSsrFPolicy(attempt.baseUrl),
      auditContext: "ollama-web-search.search",
    });

    try {
      if (response.status === 401) {
        throw new Error("Ollama web search authentication failed. Run `ollama signin`.");
      }
      if (response.status === 403) {
        throw new Error(
          "Ollama web search is unavailable. Ensure cloud-backed web search is enabled on the Ollama host.",
        );
      }
      if (!response.ok) {
        const detail = await readResponseText(response, { maxBytes: 64_000 });
        const message =
          `Ollama web search failed (${response.status}): ${detail.text || ""}`.trim();
        if (response.status === 404) {
          lastError = new Error(message);
          continue;
        }
        throw new Error(message);
      }
      payload = await readOllamaWebSearchResponse(response);
      break;
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error(String(error));
      }
      throw lastError;
    } finally {
      await release();
    }
  }

  if (!payload) {
    throw lastError ?? new Error("Ollama web search failed");
  }

  const results = Array.isArray(payload.results)
    ? payload.results
        .map(normalizeOllamaWebSearchResult)
        .filter((result): result is NonNullable<typeof result> => result !== null)
        .slice(0, count)
    : [];

  return {
    query,
    provider: "ollama",
    count: results.length,
    tookMs: Date.now() - startedAt,
    externalContent: {
      untrusted: true,
      source: "web_search",
      provider: "ollama",
      wrapped: true,
    },
    results: results.map((result) => {
      const snippet = truncateText(result.content, OLLAMA_WEB_SEARCH_SNIPPET_MAX_CHARS).text;
      return {
        title: result.title ? wrapWebContent(result.title, "web_search") : "",
        url: result.url,
        snippet: snippet ? wrapWebContent(snippet, "web_search") : "",
        siteName: resolveSiteName(result.url) || undefined,
      };
    }),
  };
>>>>>>> upstream/main
}

async function warnOllamaWebSearchPrereqs(params: {
  config: OpenClawConfig;
  prompter: {
    note: (message: string, title?: string) => Promise<void>;
  };
}): Promise<OpenClawConfig> {
  const baseUrl = resolveOllamaWebSearchBaseUrl(params.config);
  const { reachable } = await fetchOllamaModels(baseUrl);
  if (!reachable) {
    await params.prompter.note(
      [
        "Ollama Web Search requires Ollama to be running.",
        `Expected host: ${baseUrl}`,
        "Start Ollama before using this provider.",
      ].join("\n"),
      "Ollama Web Search",
    );
    return params.config;
  }

  const auth = await checkOllamaCloudAuth(baseUrl);
  if (!auth.signedIn) {
    await params.prompter.note(
      [
        "Ollama Web Search requires `ollama signin`.",
        ...(auth.signinUrl ? [auth.signinUrl] : ["Run `ollama signin`."]),
      ].join("\n"),
      "Ollama Web Search",
    );
  }

  return params.config;
}

export function createOllamaWebSearchProvider(): WebSearchProviderPlugin {
  return {
    id: "ollama",
    label: "Ollama Web Search",
    hint: "Local Ollama host · requires ollama signin",
    onboardingScopes: ["text-inference"],
    requiresCredential: false,
    envVars: [],
    placeholder: "(run ollama signin)",
    signupUrl: "https://ollama.com/",
    docsUrl: "https://docs.openclaw.ai/tools/web",
    autoDetectOrder: 110,
    credentialPath: "",
    getCredentialValue: () => undefined,
    setCredentialValue: () => {},
    applySelectionConfig: (config) => enablePluginInConfig(config, "ollama").config,
    runSetup: async (ctx) =>
      await warnOllamaWebSearchPrereqs({
        config: ctx.config,
        prompter: ctx.prompter,
      }),
    createTool: (ctx) => ({
      description:
<<<<<<< HEAD
        "Search the web using Ollama's experimental web search API. Returns titles, URLs, and snippets from the configured Ollama host.",
=======
        "Search the web using Ollama's web search API. Returns titles, URLs, and snippets from the configured Ollama host.",
>>>>>>> upstream/main
      parameters: OLLAMA_WEB_SEARCH_SCHEMA,
      execute: async (args) =>
        await runOllamaWebSearch({
          config: ctx.config,
          query: readStringParam(args, "query", { required: true }),
<<<<<<< HEAD
          count: readNumberParam(args, "count", { integer: true }),
=======
          count: readPositiveIntegerParam(args, "count", {
            max: 10,
            message: "count must be an integer from 1 to 10.",
          }),
>>>>>>> upstream/main
        }),
    }),
  };
}

<<<<<<< HEAD
export const __testing = {
  normalizeOllamaWebSearchResult,
  resolveOllamaWebSearchApiKey,
  resolveOllamaWebSearchBaseUrl,
  warnOllamaWebSearchPrereqs,
};
=======
export const testing = {
  buildOllamaWebSearchAttempts,
  normalizeOllamaWebSearchResult,
  resolveConfiguredOllamaWebSearchApiKey,
  resolveEnvOllamaWebSearchApiKey,
  resolveOllamaWebSearchApiKey,
  resolveOllamaWebSearchBaseUrl,
  isOllamaCloudBaseUrl,
  readOllamaWebSearchResponse,
  warnOllamaWebSearchPrereqs,
};
export { testing as __testing };
>>>>>>> upstream/main
