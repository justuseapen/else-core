// Firecrawl provider module implements model/runtime integration.
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import type { WebSearchProviderPlugin } from "openclaw/plugin-sdk/provider-web-search-contract";
import { buildFirecrawlWebSearchProviderBase } from "../web-search-shared.js";

type FirecrawlClientModule = typeof import("./firecrawl-client.js");

let firecrawlClientModulePromise: Promise<FirecrawlClientModule> | undefined;

function loadFirecrawlClientModule(): Promise<FirecrawlClientModule> {
  firecrawlClientModulePromise ??= import("./firecrawl-client.js");
  return firecrawlClientModulePromise;
}

const GenericFirecrawlSearchSchema = {
  type: "object",
  properties: {
    query: { type: "string", description: "Search query string." },
    count: {
      type: "integer",
      description: "Number of results to return (1-10).",
      minimum: 1,
      maximum: 10,
    },
  },
  additionalProperties: false,
} satisfies Record<string, unknown>;

export function createFirecrawlWebSearchProvider(): WebSearchProviderPlugin {
  return {
<<<<<<< HEAD
    id: "firecrawl",
    label: "Firecrawl Search",
    hint: "Structured results with optional result scraping",
    onboardingScopes: ["text-inference"],
    credentialLabel: "Firecrawl API key",
    envVars: ["FIRECRAWL_API_KEY"],
    placeholder: "fc-...",
    signupUrl: "https://www.firecrawl.dev/",
    docsUrl: "https://docs.openclaw.ai/tools/firecrawl",
    autoDetectOrder: 60,
    credentialPath: "plugins.entries.firecrawl.config.webSearch.apiKey",
    inactiveSecretPaths: ["plugins.entries.firecrawl.config.webSearch.apiKey"],
    getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "firecrawl"),
    setCredentialValue: (searchConfigTarget, value) =>
      setScopedCredentialValue(searchConfigTarget, "firecrawl", value),
    getConfiguredCredentialValue: (config) =>
      resolveProviderWebSearchPluginConfig(config, "firecrawl")?.apiKey,
    setConfiguredCredentialValue: (configTarget, value) => {
      setProviderWebSearchPluginConfigValue(configTarget, "firecrawl", "apiKey", value);
    },
    applySelectionConfig: (config) => enablePluginInConfig(config, "firecrawl").config,
=======
    ...buildFirecrawlWebSearchProviderBase(),
>>>>>>> upstream/main
    createTool: (ctx) => ({
      description:
        "Search the web using Firecrawl. Returns structured results with snippets from Firecrawl Search. Use firecrawl_search for Firecrawl-specific knobs like sources or categories.",
      parameters: GenericFirecrawlSearchSchema,
      execute: async (args) => {
        const { runFirecrawlSearch } = await loadFirecrawlClientModule();
        return await runFirecrawlSearch({
          cfg: ctx.config,
          query: typeof args.query === "string" ? args.query : "",
          count: readPositiveIntegerParam(args, "count", {
            message: "count must be an integer from 1 to 10",
            max: 10,
          }),
        });
      },
    }),
  };
}
