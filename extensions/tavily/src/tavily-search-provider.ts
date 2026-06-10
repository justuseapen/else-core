// Tavily provider module implements model/runtime integration.
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import type { WebSearchProviderPlugin } from "openclaw/plugin-sdk/provider-web-search-contract";
import { buildTavilyWebSearchProviderBase } from "../web-search-shared.js";

type TavilyClientModule = typeof import("./tavily-client.js");

let tavilyClientModulePromise: Promise<TavilyClientModule> | undefined;

function loadTavilyClientModule(): Promise<TavilyClientModule> {
  tavilyClientModulePromise ??= import("./tavily-client.js");
  return tavilyClientModulePromise;
}

const GenericTavilySearchSchema = {
  type: "object",
  properties: {
    query: { type: "string", description: "Search query string." },
    count: {
      type: "integer",
      description: "Number of results to return (1-20).",
      minimum: 1,
      maximum: 20,
    },
  },
  additionalProperties: false,
} satisfies Record<string, unknown>;

export function createTavilyWebSearchProvider(): WebSearchProviderPlugin {
  return {
<<<<<<< HEAD
    id: "tavily",
    label: "Tavily Search",
    hint: "Structured results with domain filters and AI answer summaries",
    onboardingScopes: ["text-inference"],
    credentialLabel: "Tavily API key",
    envVars: ["TAVILY_API_KEY"],
    placeholder: "tvly-...",
    signupUrl: "https://tavily.com/",
    docsUrl: "https://docs.openclaw.ai/tools/tavily",
    autoDetectOrder: 70,
    credentialPath: "plugins.entries.tavily.config.webSearch.apiKey",
    inactiveSecretPaths: ["plugins.entries.tavily.config.webSearch.apiKey"],
    getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "tavily"),
    setCredentialValue: (searchConfigTarget, value) =>
      setScopedCredentialValue(searchConfigTarget, "tavily", value),
    getConfiguredCredentialValue: (config) =>
      resolveProviderWebSearchPluginConfig(config, "tavily")?.apiKey,
    setConfiguredCredentialValue: (configTarget, value) => {
      setProviderWebSearchPluginConfigValue(configTarget, "tavily", "apiKey", value);
    },
    applySelectionConfig: (config) => enablePluginInConfig(config, "tavily").config,
=======
    ...buildTavilyWebSearchProviderBase(),
>>>>>>> upstream/main
    createTool: (ctx) => ({
      description:
        "Search the web using Tavily. Returns structured results with snippets. Use tavily_search for Tavily-specific options like search depth, topic filtering, or AI answers.",
      parameters: GenericTavilySearchSchema,
      execute: async (args) => {
        const { runTavilySearch } = await loadTavilyClientModule();
        return await runTavilySearch({
          cfg: ctx.config,
          query: typeof args.query === "string" ? args.query : "",
          maxResults: readPositiveIntegerParam(args, "count", {
            message: "count must be an integer from 1 to 20",
            max: 20,
          }),
        });
      },
    }),
  };
}
