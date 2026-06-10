<<<<<<< HEAD
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyPluginRegistry } from "./registry.js";
=======
// Covers web fetch provider runtime hooks supplied by plugins.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyPluginRegistry } from "./registry-empty.js";
>>>>>>> upstream/main

type LoaderModule = typeof import("./loader.js");
type ManifestRegistryModule = typeof import("./manifest-registry.js");
type RuntimeModule = typeof import("./runtime.js");
type WebFetchProvidersRuntimeModule = typeof import("./web-fetch-providers.runtime.js");
type WebFetchProvidersSharedModule = typeof import("./web-fetch-providers.shared.js");

let loaderModule: LoaderModule;
let manifestRegistryModule: ManifestRegistryModule;
let webFetchProvidersSharedModule: WebFetchProvidersSharedModule;
let loadOpenClawPluginsMock: ReturnType<typeof vi.fn>;
let setActivePluginRegistry: RuntimeModule["setActivePluginRegistry"];
<<<<<<< HEAD
let resolvePluginWebFetchProviders: WebFetchProvidersRuntimeModule["resolvePluginWebFetchProviders"];
let resetWebFetchProviderSnapshotCacheForTests: WebFetchProvidersRuntimeModule["__testing"]["resetWebFetchProviderSnapshotCacheForTests"];

const DEFAULT_WORKSPACE = "/tmp/workspace";

=======
let resetPluginRuntimeStateForTest: RuntimeModule["resetPluginRuntimeStateForTest"];
let resolvePluginWebFetchProviders: WebFetchProvidersRuntimeModule["resolvePluginWebFetchProviders"];
let clearLoadPluginMetadataSnapshotMemo: typeof import("./plugin-metadata-snapshot.js").clearLoadPluginMetadataSnapshotMemo;

const DEFAULT_WORKSPACE = "/tmp/workspace";

type PluginLoadOptions = { logger?: Record<string, unknown> } & Record<string, unknown>;

function firstPluginLoadOptions(mock: { mock: { calls: unknown[][] } }): PluginLoadOptions {
  return (mock.mock.calls[0]?.[0] ?? {}) as PluginLoadOptions;
}

>>>>>>> upstream/main
function createWebFetchEnv(overrides?: Partial<NodeJS.ProcessEnv>) {
  return {
    OPENCLAW_HOME: "/tmp/openclaw-home",
    ...overrides,
  } as NodeJS.ProcessEnv;
}

function createFirecrawlAllowConfig() {
  return {
    plugins: {
      allow: ["firecrawl"],
    },
  };
}

function createManifestRegistryFixture() {
  return {
    plugins: [
      {
        id: "firecrawl",
        origin: "bundled",
        rootDir: "/tmp/firecrawl",
        source: "/tmp/firecrawl/index.js",
        manifestPath: "/tmp/firecrawl/openclaw.plugin.json",
        channels: [],
        providers: [],
<<<<<<< HEAD
=======
        cliBackends: [],
        syntheticAuthRefs: [],
        nonSecretAuthMarkers: [],
>>>>>>> upstream/main
        skills: [],
        hooks: [],
        configUiHints: { "webFetch.apiKey": { label: "key" } },
      },
      {
        id: "noise",
        origin: "bundled",
        rootDir: "/tmp/noise",
        source: "/tmp/noise/index.js",
        manifestPath: "/tmp/noise/openclaw.plugin.json",
        channels: [],
        providers: [],
<<<<<<< HEAD
=======
        cliBackends: [],
        syntheticAuthRefs: [],
        nonSecretAuthMarkers: [],
>>>>>>> upstream/main
        skills: [],
        hooks: [],
        configUiHints: { unrelated: { label: "nope" } },
      },
    ],
    diagnostics: [],
  };
}

function createRuntimeWebFetchProvider() {
  return {
    pluginId: "firecrawl",
    pluginName: "Firecrawl",
    source: "test" as const,
    provider: {
      id: "firecrawl",
      label: "Firecrawl",
      hint: "Firecrawl runtime provider",
      envVars: ["FIRECRAWL_API_KEY"],
      placeholder: "firecrawl-...",
      signupUrl: "https://example.com/firecrawl",
      credentialPath: "plugins.entries.firecrawl.config.webFetch.apiKey",
      getCredentialValue: () => "configured",
      setCredentialValue: () => {},
      createTool: () => ({
        description: "firecrawl",
        parameters: {},
        execute: async () => ({}),
      }),
    },
  };
}

describe("resolvePluginWebFetchProviders", () => {
  beforeAll(async () => {
<<<<<<< HEAD
    loaderModule = await import("./loader.js");
    manifestRegistryModule = await import("./manifest-registry.js");
    webFetchProvidersSharedModule = await import("./web-fetch-providers.shared.js");
    ({ setActivePluginRegistry } = await import("./runtime.js"));
    ({
      resolvePluginWebFetchProviders,
      __testing: { resetWebFetchProviderSnapshotCacheForTests },
    } = await import("./web-fetch-providers.runtime.js"));
  });

  beforeEach(() => {
    resetWebFetchProviderSnapshotCacheForTests();
=======
    vi.doMock("./plugin-registry.js", async () => {
      const actual =
        await vi.importActual<typeof import("./plugin-registry.js")>("./plugin-registry.js");
      return {
        ...actual,
        loadPluginRegistrySnapshotWithMetadata: () => ({
          snapshot: { plugins: [], diagnostics: [] },
          source: "derived",
          diagnostics: [],
        }),
      };
    });
    loaderModule = await import("./loader.js");
    manifestRegistryModule = await import("./manifest-registry.js");
    webFetchProvidersSharedModule = await import("./web-fetch-providers.shared.js");
    ({ resetPluginRuntimeStateForTest, setActivePluginRegistry } = await import("./runtime.js"));
    ({ clearLoadPluginMetadataSnapshotMemo } = await import("./plugin-metadata-snapshot.js"));
    ({ resolvePluginWebFetchProviders } = await import("./web-fetch-providers.runtime.js"));
  });

  beforeEach(() => {
    clearLoadPluginMetadataSnapshotMemo();
>>>>>>> upstream/main
    vi.spyOn(manifestRegistryModule, "loadPluginManifestRegistry").mockReturnValue(
      createManifestRegistryFixture() as ManifestRegistryModule["loadPluginManifestRegistry"] extends (
        ...args: unknown[]
      ) => infer R
        ? R
        : never,
    );
    loadOpenClawPluginsMock = vi
      .spyOn(loaderModule, "loadOpenClawPlugins")
      .mockImplementation(() => {
        const registry = createEmptyPluginRegistry();
        registry.webFetchProviders = [createRuntimeWebFetchProvider()];
        return registry;
      });
<<<<<<< HEAD
    setActivePluginRegistry(createEmptyPluginRegistry());
  });

  afterEach(() => {
    setActivePluginRegistry(createEmptyPluginRegistry());
=======
    resetPluginRuntimeStateForTest();
  });

  afterEach(() => {
    resetPluginRuntimeStateForTest();
    clearLoadPluginMetadataSnapshotMemo();
>>>>>>> upstream/main
    vi.restoreAllMocks();
  });

  it("falls back to the plugin loader when no compatible active registry exists", () => {
    const providers = resolvePluginWebFetchProviders({});

    expect(providers.map((provider) => `${provider.pluginId}:${provider.id}`)).toEqual([
      "firecrawl:firecrawl",
    ]);
    expect(loadOpenClawPluginsMock).toHaveBeenCalledTimes(1);
  });

<<<<<<< HEAD
=======
  it("loads manifest-declared web-fetch providers in setup mode without the plugin loader", () => {
    const providers = resolvePluginWebFetchProviders({
      config: createFirecrawlAllowConfig(),
      mode: "setup",
    });

    expect(providers.map((provider) => `${provider.pluginId}:${provider.id}`)).toEqual([
      "firecrawl:firecrawl",
    ]);
    expect(loadOpenClawPluginsMock).not.toHaveBeenCalled();
  });

  it("does not force a fresh snapshot load when the same web-provider load is already in flight", () => {
    const inFlightSpy = vi
      .spyOn(loaderModule, "isPluginRegistryLoadInFlight")
      .mockReturnValue(true);
    loadOpenClawPluginsMock.mockImplementation(() => {
      throw new Error("resolvePluginWebFetchProviders should not bypass the in-flight guard");
    });

    const providers = resolvePluginWebFetchProviders({
      config: createFirecrawlAllowConfig(),
      workspaceDir: DEFAULT_WORKSPACE,
      env: createWebFetchEnv(),
    });

    expect(providers).toStrictEqual([]);
    const { logger: inFlightLogger, ...inFlightLoadOptions } = firstPluginLoadOptions(inFlightSpy);
    expect(Object.keys(inFlightLogger ?? {}).toSorted()).toEqual([
      "debug",
      "error",
      "info",
      "warn",
    ]);
    expect(inFlightLoadOptions).toEqual({
      config: createFirecrawlAllowConfig(),
      activationSourceConfig: createFirecrawlAllowConfig(),
      autoEnabledReasons: {},
      workspaceDir: DEFAULT_WORKSPACE,
      env: createWebFetchEnv(),
      cache: true,
      activate: false,
      onlyPluginIds: ["firecrawl"],
    });
    expect(loadOpenClawPluginsMock).not.toHaveBeenCalled();
  });

>>>>>>> upstream/main
  it("reuses a compatible active registry for snapshot resolution when config is provided", () => {
    const env = createWebFetchEnv();
    const rawConfig = createFirecrawlAllowConfig();
    const { config, activationSourceConfig, autoEnabledReasons } =
      webFetchProvidersSharedModule.resolveBundledWebFetchResolutionConfig({
        config: rawConfig,
<<<<<<< HEAD
        bundledAllowlistCompat: true,
        env,
      });
    const { cacheKey } = loaderModule.__testing.resolvePluginLoadCacheContext({
=======
        env,
      });
    const { cacheKey } = loaderModule.testing.resolvePluginLoadCacheContext({
>>>>>>> upstream/main
      config,
      activationSourceConfig,
      autoEnabledReasons,
      workspaceDir: DEFAULT_WORKSPACE,
      env,
      onlyPluginIds: ["firecrawl"],
<<<<<<< HEAD
      cache: false,
      activate: false,
    });
    const registry = createEmptyPluginRegistry();
=======
      cache: true,
      activate: false,
    });
    const registry = createEmptyPluginRegistry();
    registry.plugins.push({ id: "firecrawl", status: "loaded" } as never);
>>>>>>> upstream/main
    registry.webFetchProviders.push(createRuntimeWebFetchProvider());
    setActivePluginRegistry(registry, cacheKey);

    const providers = resolvePluginWebFetchProviders({
      config: rawConfig,
<<<<<<< HEAD
      bundledAllowlistCompat: true,
=======
>>>>>>> upstream/main
      workspaceDir: DEFAULT_WORKSPACE,
      env,
    });

    expect(providers.map((provider) => `${provider.pluginId}:${provider.id}`)).toEqual([
      "firecrawl:firecrawl",
    ]);
    expect(loadOpenClawPluginsMock).not.toHaveBeenCalled();
  });

  it("inherits workspaceDir from the active registry for compatible web-fetch snapshot reuse", () => {
    const env = createWebFetchEnv();
    const rawConfig = createFirecrawlAllowConfig();
    const { config, activationSourceConfig, autoEnabledReasons } =
      webFetchProvidersSharedModule.resolveBundledWebFetchResolutionConfig({
        config: rawConfig,
<<<<<<< HEAD
        bundledAllowlistCompat: true,
        workspaceDir: DEFAULT_WORKSPACE,
        env,
      });
    const { cacheKey } = loaderModule.__testing.resolvePluginLoadCacheContext({
=======
        workspaceDir: DEFAULT_WORKSPACE,
        env,
      });
    const { cacheKey } = loaderModule.testing.resolvePluginLoadCacheContext({
>>>>>>> upstream/main
      config,
      activationSourceConfig,
      autoEnabledReasons,
      workspaceDir: DEFAULT_WORKSPACE,
      env,
      onlyPluginIds: ["firecrawl"],
<<<<<<< HEAD
      cache: false,
      activate: false,
    });
    const registry = createEmptyPluginRegistry();
=======
      cache: true,
      activate: false,
    });
    const registry = createEmptyPluginRegistry();
    registry.plugins.push({ id: "firecrawl", status: "loaded" } as never);
>>>>>>> upstream/main
    registry.webFetchProviders.push(createRuntimeWebFetchProvider());
    setActivePluginRegistry(registry, cacheKey, "default", DEFAULT_WORKSPACE);

    const providers = resolvePluginWebFetchProviders({
      config: rawConfig,
<<<<<<< HEAD
      bundledAllowlistCompat: true,
=======
>>>>>>> upstream/main
      env,
    });

    expect(providers.map((provider) => `${provider.pluginId}:${provider.id}`)).toEqual([
      "firecrawl:firecrawl",
    ]);
    expect(loadOpenClawPluginsMock).not.toHaveBeenCalled();
  });

<<<<<<< HEAD
  it("uses the active registry workspace for candidate discovery and snapshot loads when workspaceDir is omitted", () => {
=======
  it("uses the active registry workspace for candidate discovery when workspaceDir is omitted", () => {
>>>>>>> upstream/main
    const env = createWebFetchEnv();
    const rawConfig = createFirecrawlAllowConfig();

    setActivePluginRegistry(
      createEmptyPluginRegistry(),
      undefined,
      "default",
      "/tmp/runtime-workspace",
    );

    resolvePluginWebFetchProviders({
      config: rawConfig,
<<<<<<< HEAD
      bundledAllowlistCompat: true,
      env,
    });

    expect(manifestRegistryModule.loadPluginManifestRegistry).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceDir: "/tmp/runtime-workspace",
      }),
    );
    expect(loadOpenClawPluginsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceDir: "/tmp/runtime-workspace",
        onlyPluginIds: ["firecrawl"],
      }),
    );
  });

  it("invalidates web-fetch snapshot memoization when the active registry workspace changes", () => {
=======
      env,
    });

    expect(manifestRegistryModule.loadPluginManifestRegistry).toHaveBeenCalledWith({
      config: rawConfig,
      workspaceDir: "/tmp/runtime-workspace",
      env,
      diagnostics: [],
      installRecords: {},
    });
    const { logger, ...loadOptions } = firstPluginLoadOptions(loadOpenClawPluginsMock);
    expect(Object.keys(logger ?? {}).toSorted()).toEqual(["debug", "error", "info", "warn"]);
    expect(loadOptions).toEqual({
      config: createFirecrawlAllowConfig(),
      activationSourceConfig: createFirecrawlAllowConfig(),
      autoEnabledReasons: {},
      workspaceDir: "/tmp/runtime-workspace",
      env,
      cache: true,
      activate: false,
      onlyPluginIds: ["firecrawl"],
    });
  });

  it("resolves web-fetch providers for each active registry workspace", () => {
>>>>>>> upstream/main
    const env = createWebFetchEnv();
    const config = createFirecrawlAllowConfig();

    setActivePluginRegistry(createEmptyPluginRegistry(), undefined, "default", "/tmp/workspace-a");
    resolvePluginWebFetchProviders({
      config,
<<<<<<< HEAD
      bundledAllowlistCompat: true,
=======
>>>>>>> upstream/main
      env,
    });

    setActivePluginRegistry(createEmptyPluginRegistry(), undefined, "default", "/tmp/workspace-b");
    resolvePluginWebFetchProviders({
      config,
<<<<<<< HEAD
      bundledAllowlistCompat: true,
=======
>>>>>>> upstream/main
      env,
    });

    expect(loadOpenClawPluginsMock).toHaveBeenCalledTimes(2);
  });
});
