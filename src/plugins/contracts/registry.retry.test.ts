<<<<<<< HEAD
=======
// Registry retry tests cover plugin registry retry behavior after transient failures.
>>>>>>> upstream/main
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProviderPlugin, WebFetchProviderPlugin, WebSearchProviderPlugin } from "../types.js";

type MockPluginRecord = {
  id: string;
  status: "loaded" | "error";
  error?: string;
  providerIds: string[];
  webFetchProviderIds: string[];
  webSearchProviderIds: string[];
<<<<<<< HEAD
=======
  migrationProviderIds: string[];
>>>>>>> upstream/main
};

type MockRuntimeRegistry = {
  plugins: MockPluginRecord[];
  diagnostics: Array<{ pluginId?: string; message: string }>;
  providers: Array<{ pluginId: string; provider: ProviderPlugin }>;
  webFetchProviders: Array<{ pluginId: string; provider: WebFetchProviderPlugin }>;
  webSearchProviders: Array<{ pluginId: string; provider: WebSearchProviderPlugin }>;
};

function createMockRuntimeRegistry(params: {
  plugin: MockPluginRecord;
  providers?: Array<{ pluginId: string; provider: ProviderPlugin }>;
  webFetchProviders?: Array<{ pluginId: string; provider: WebFetchProviderPlugin }>;
  webSearchProviders?: Array<{ pluginId: string; provider: WebSearchProviderPlugin }>;
  diagnostics?: Array<{ pluginId?: string; message: string }>;
}): MockRuntimeRegistry {
  return {
    plugins: [params.plugin],
    diagnostics: params.diagnostics ?? [],
    providers: params.providers ?? [],
    webFetchProviders: params.webFetchProviders ?? [],
    webSearchProviders: params.webSearchProviders ?? [],
  };
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("plugin contract registry scoped retries", () => {
  it("retries provider loads after a transient plugin-scoped runtime error", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi
      .fn()
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
<<<<<<< HEAD
            id: "xai",
            status: "error",
            error: "transient xai load failure",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
          },
          diagnostics: [{ pluginId: "xai", message: "transient xai load failure" }],
=======
            id: "arcee",
            status: "error",
            error: "transient arcee load failure",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
            migrationProviderIds: [],
          },
          diagnostics: [{ pluginId: "arcee", message: "transient arcee load failure" }],
>>>>>>> upstream/main
        }),
      )
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
<<<<<<< HEAD
            id: "xai",
            status: "loaded",
            providerIds: ["xai"],
            webFetchProviderIds: [],
            webSearchProviderIds: ["grok"],
          },
          providers: [
            {
              pluginId: "xai",
              provider: {
                id: "xai",
                label: "xAI",
                docsPath: "/providers/xai",
=======
            id: "arcee",
            status: "loaded",
            providerIds: ["arcee"],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
            migrationProviderIds: [],
          },
          providers: [
            {
              pluginId: "arcee",
              provider: {
                id: "arcee",
                label: "Arcee",
                docsPath: "/providers/arcee",
>>>>>>> upstream/main
                auth: [],
              } as ProviderPlugin,
            },
          ],
        }),
      );

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));
<<<<<<< HEAD
=======
    vi.doMock("../provider-contract-public-artifacts.js", () => ({
      resolveBundledExplicitProviderContractsFromPublicArtifacts: () => null,
    }));
>>>>>>> upstream/main

    const { resolveProviderContractProvidersForPluginIds } = await import("./registry.js");

    expect(
<<<<<<< HEAD
      resolveProviderContractProvidersForPluginIds(["xai"]).map((provider) => provider.id),
    ).toEqual(["xai"]);
=======
      resolveProviderContractProvidersForPluginIds(["arcee"]).map((provider) => provider.id),
    ).toEqual(["arcee"]);
>>>>>>> upstream/main
    expect(loadBundledCapabilityRuntimeRegistry).toHaveBeenCalledTimes(2);
  });

  it("retries web search provider loads after a transient plugin-scoped runtime error", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi
      .fn()
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
<<<<<<< HEAD
            id: "xai",
            status: "error",
            error: "transient grok load failure",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
          },
          diagnostics: [{ pluginId: "xai", message: "transient grok load failure" }],
=======
            id: "searxng",
            status: "error",
            error: "transient searxng load failure",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
            migrationProviderIds: [],
          },
          diagnostics: [{ pluginId: "searxng", message: "transient searxng load failure" }],
>>>>>>> upstream/main
        }),
      )
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
<<<<<<< HEAD
            id: "xai",
            status: "loaded",
            providerIds: ["xai"],
            webFetchProviderIds: [],
            webSearchProviderIds: ["grok"],
          },
          webSearchProviders: [
            {
              pluginId: "xai",
              provider: {
                id: "grok",
                label: "Grok Search",
                hint: "Search the web with Grok",
                envVars: ["XAI_API_KEY"],
                placeholder: "XAI_API_KEY",
                signupUrl: "https://x.ai",
                credentialPath: "plugins.entries.xai.config.webSearch.apiKey",
=======
            id: "searxng",
            status: "loaded",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: ["searxng"],
            migrationProviderIds: [],
          },
          webSearchProviders: [
            {
              pluginId: "searxng",
              provider: {
                id: "searxng",
                label: "SearXNG",
                hint: "Search the web with SearXNG",
                envVars: ["SEARXNG_URL"],
                placeholder: "https://search.example.test",
                signupUrl: "https://docs.searxng.org",
                credentialPath: "plugins.entries.searxng.config.webSearch.url",
>>>>>>> upstream/main
                requiresCredential: true,
                getCredentialValue: () => undefined,
                setCredentialValue() {},
                createTool: () => ({
                  description: "search",
                  parameters: {},
                  execute: async () => ({}),
                }),
              } as WebSearchProviderPlugin,
            },
          ],
        }),
      );

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));
<<<<<<< HEAD
=======
    vi.doMock("../web-provider-public-artifacts.explicit.js", () => ({
      resolveBundledExplicitWebSearchProvidersFromPublicArtifacts: () => null,
    }));
>>>>>>> upstream/main

    const { resolveWebSearchProviderContractEntriesForPluginId } = await import("./registry.js");

    expect(
<<<<<<< HEAD
      resolveWebSearchProviderContractEntriesForPluginId("xai").map((entry) => entry.provider.id),
    ).toEqual(["grok"]);
=======
      resolveWebSearchProviderContractEntriesForPluginId("searxng").map(
        (entry) => entry.provider.id,
      ),
    ).toEqual(["searxng"]);
>>>>>>> upstream/main
    expect(loadBundledCapabilityRuntimeRegistry).toHaveBeenCalledTimes(2);
  });

  it("reuses the single registered provider contract for paired manifest alias ids", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi.fn().mockReturnValue(
      createMockRuntimeRegistry({
        plugin: {
          id: "byteplus",
          status: "loaded",
          providerIds: ["byteplus"],
          webFetchProviderIds: [],
          webSearchProviderIds: [],
<<<<<<< HEAD
=======
          migrationProviderIds: [],
>>>>>>> upstream/main
        },
        providers: [
          {
            pluginId: "byteplus",
            provider: {
              id: "byteplus",
              label: "BytePlus",
              docsPath: "/providers/byteplus",
              auth: [],
            } as ProviderPlugin,
          },
        ],
      }),
    );

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));
<<<<<<< HEAD
=======
    vi.doMock("../provider-contract-public-artifacts.js", () => ({
      resolveBundledExplicitProviderContractsFromPublicArtifacts: () => null,
    }));
>>>>>>> upstream/main

    const { requireProviderContractProvider } = await import("./registry.js");

    expect(requireProviderContractProvider("byteplus-plan").id).toBe("byteplus");
    expect(loadBundledCapabilityRuntimeRegistry).toHaveBeenCalledTimes(1);
  });

<<<<<<< HEAD
=======
  it("uses provider public artifacts before falling back to the bundled runtime registry", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi.fn(() => {
      throw new Error("provider contract public artifact should not hit bundled runtime registry");
    });
    const resolveBundledExplicitProviderContractsFromPublicArtifacts = vi.fn(() => [
      {
        pluginId: "openai",
        provider: {
          id: "openai",
          label: "OpenAI",
          docsPath: "/providers/openai",
          auth: [
            {
              id: "api-key",
              label: "API key",
              kind: "api_key",
              run: async () => ({ profiles: [] }),
            },
          ],
        } as ProviderPlugin,
      },
      {
        pluginId: "openai",
        provider: {
          id: "openai",
          label: "OpenAI Codex",
          docsPath: "/providers/openai",
          auth: [
            {
              id: "oauth",
              label: "OAuth",
              kind: "oauth",
              run: async () => ({ profiles: [] }),
            },
          ],
        } as ProviderPlugin,
      },
    ]);

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));
    vi.doMock("../provider-contract-public-artifacts.js", () => ({
      resolveBundledExplicitProviderContractsFromPublicArtifacts,
    }));

    const { resolveProviderContractProvidersForPluginIds } = await import("./registry.js");

    expect(
      resolveProviderContractProvidersForPluginIds(["openai"]).map((provider) => provider.id),
    ).toEqual(["openai"]);
    expect(resolveBundledExplicitProviderContractsFromPublicArtifacts).toHaveBeenCalledTimes(1);
    expect(loadBundledCapabilityRuntimeRegistry).not.toHaveBeenCalled();
  });

  it("uses web search public artifacts before falling back to the bundled runtime registry", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi.fn(() => {
      throw new Error(
        "web search contract public artifact should not hit bundled runtime registry",
      );
    });
    const resolveBundledExplicitWebSearchProvidersFromPublicArtifacts = vi.fn(() => [
      {
        pluginId: "google",
        id: "gemini",
        label: "Gemini",
        hint: "Search with Gemini",
        envVars: ["GEMINI_API_KEY"],
        placeholder: "GEMINI_API_KEY",
        signupUrl: "https://aistudio.google.com",
        credentialPath: "plugins.entries.google.config.webSearch.apiKey",
        requiresCredential: true,
        getCredentialValue: () => undefined,
        setCredentialValue() {},
        createTool: () => ({
          description: "search",
          parameters: {},
          execute: async () => ({}),
        }),
        credentialValue: "AIzaSyDUMMY",
      },
    ]);

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));
    vi.doMock("../web-provider-public-artifacts.explicit.js", () => ({
      resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
    }));

    const { resolveWebSearchProviderContractEntriesForPluginId } = await import("./registry.js");

    expect(
      resolveWebSearchProviderContractEntriesForPluginId("google").map(
        (entry) => entry.provider.id,
      ),
    ).toEqual(["gemini"]);
    expect(resolveBundledExplicitWebSearchProvidersFromPublicArtifacts).toHaveBeenCalledTimes(1);
    expect(loadBundledCapabilityRuntimeRegistry).not.toHaveBeenCalled();
  });

>>>>>>> upstream/main
  it("retries web fetch provider loads after a transient plugin-scoped runtime error", async () => {
    const loadBundledCapabilityRuntimeRegistry = vi
      .fn()
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
            id: "firecrawl",
            status: "error",
            error: "transient firecrawl fetch load failure",
            providerIds: [],
            webFetchProviderIds: [],
            webSearchProviderIds: [],
<<<<<<< HEAD
=======
            migrationProviderIds: [],
>>>>>>> upstream/main
          },
          diagnostics: [
            { pluginId: "firecrawl", message: "transient firecrawl fetch load failure" },
          ],
        }),
      )
      .mockReturnValueOnce(
        createMockRuntimeRegistry({
          plugin: {
            id: "firecrawl",
            status: "loaded",
            providerIds: [],
            webFetchProviderIds: ["firecrawl"],
            webSearchProviderIds: ["firecrawl"],
<<<<<<< HEAD
=======
            migrationProviderIds: [],
>>>>>>> upstream/main
          },
          webFetchProviders: [
            {
              pluginId: "firecrawl",
              provider: {
                id: "firecrawl",
                label: "Firecrawl",
                hint: "Fetch with Firecrawl",
                envVars: ["FIRECRAWL_API_KEY"],
                placeholder: "fc-...",
                signupUrl: "https://firecrawl.dev",
                credentialPath: "plugins.entries.firecrawl.config.webFetch.apiKey",
                requiresCredential: true,
                getCredentialValue: () => undefined,
                setCredentialValue() {},
                createTool: () => ({
                  description: "fetch",
                  parameters: {},
                  execute: async () => ({}),
                }),
              } as WebFetchProviderPlugin,
            },
          ],
        }),
      );

    vi.doMock("../bundled-capability-runtime.js", () => ({
      loadBundledCapabilityRuntimeRegistry,
    }));

    const { resolveWebFetchProviderContractEntriesForPluginId } = await import("./registry.js");

    expect(
      resolveWebFetchProviderContractEntriesForPluginId("firecrawl").map(
        (entry) => entry.provider.id,
      ),
    ).toEqual(["firecrawl"]);
    expect(loadBundledCapabilityRuntimeRegistry).toHaveBeenCalledTimes(2);
  });
});
