<<<<<<< HEAD
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyPluginRegistry } from "../plugins/registry.js";

const { resolveRuntimePluginRegistryMock } = vi.hoisted(() => ({
  resolveRuntimePluginRegistryMock: vi.fn<
    (params?: unknown) => ReturnType<typeof createEmptyPluginRegistry> | undefined
  >(() => undefined),
}));

vi.mock("../plugins/loader.js", () => ({
  resolveRuntimePluginRegistry: resolveRuntimePluginRegistryMock,
}));

let getVideoGenerationProvider: typeof import("./provider-registry.js").getVideoGenerationProvider;
let listVideoGenerationProviders: typeof import("./provider-registry.js").listVideoGenerationProviders;

describe("video-generation provider registry", () => {
  beforeAll(async () => {
    ({ getVideoGenerationProvider, listVideoGenerationProviders } =
      await import("./provider-registry.js"));
  });

  beforeEach(() => {
    resolveRuntimePluginRegistryMock.mockReset();
    resolveRuntimePluginRegistryMock.mockReturnValue(undefined);
  });

  it("does not load plugins when listing without config", () => {
    expect(listVideoGenerationProviders()).toEqual([]);
    expect(resolveRuntimePluginRegistryMock).toHaveBeenCalledWith();
  });

  it("uses active plugin providers without loading from disk", () => {
    const registry = createEmptyPluginRegistry();
    registry.videoGenerationProviders.push({
      pluginId: "custom-video",
      pluginName: "Custom Video",
      source: "test",
      provider: {
        id: "custom-video",
        label: "Custom Video",
        capabilities: {},
        generateVideo: async () => ({
          videos: [{ buffer: Buffer.from("video"), mimeType: "video/mp4" }],
        }),
      },
    });
    resolveRuntimePluginRegistryMock.mockReturnValue(registry);
=======
// Video provider registry tests cover provider registration and lookup.
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { VideoGenerationProviderPlugin } from "../plugins/types.js";

type ProviderRegistryModule = typeof import("./provider-registry.js");

const resolvePluginCapabilityProvidersMock = vi.hoisted(() =>
  vi.fn<() => VideoGenerationProviderPlugin[]>(() => []),
);
vi.mock("../plugins/capability-provider-runtime.js", () => ({
  resolvePluginCapabilityProviders: resolvePluginCapabilityProvidersMock,
}));

function createProvider(
  params: Pick<VideoGenerationProviderPlugin, "id"> & Partial<VideoGenerationProviderPlugin>,
): VideoGenerationProviderPlugin {
  return {
    label: params.id,
    capabilities: {},
    generateVideo: async () => ({
      videos: [{ buffer: Buffer.from("video"), mimeType: "video/mp4" }],
    }),
    ...params,
  };
}

function requireVideoProvider(
  registry: ProviderRegistryModule,
  id: string,
): VideoGenerationProviderPlugin {
  const provider = registry.getVideoGenerationProvider(id);
  if (!provider) {
    throw new Error(`expected video generation provider ${id}`);
  }
  return provider;
}

async function loadProviderRegistry(): Promise<ProviderRegistryModule> {
  vi.resetModules();
  return import("./provider-registry.js");
}

describe("video-generation provider registry", () => {
  let delegationCase: {
    calls: unknown[][];
    providers: VideoGenerationProviderPlugin[];
  };

  beforeAll(async () => {
    const { listVideoGenerationProviders } = await loadProviderRegistry();
    const providers = listVideoGenerationProviders();
    delegationCase = {
      calls: [...resolvePluginCapabilityProvidersMock.mock.calls],
      providers,
    };
  });

  beforeEach(() => {
    vi.resetModules();
    resolvePluginCapabilityProvidersMock.mockReset();
    resolvePluginCapabilityProvidersMock.mockReturnValue([]);
  });

  it("delegates provider resolution to the capability provider boundary", () => {
    expect(delegationCase.providers).toStrictEqual([]);
    expect(delegationCase.calls).toContainEqual([
      {
        key: "videoGenerationProviders",
        cfg: undefined,
      },
    ]);
  });

  it("uses active plugin providers without loading from disk", async () => {
    resolvePluginCapabilityProvidersMock.mockReturnValue([createProvider({ id: "custom-video" })]);
    const { getVideoGenerationProvider } = await loadProviderRegistry();
>>>>>>> upstream/main

    const provider = getVideoGenerationProvider("custom-video");

    expect(provider?.id).toBe("custom-video");
<<<<<<< HEAD
    expect(resolveRuntimePluginRegistryMock).toHaveBeenCalledWith();
  });

  it("ignores prototype-like provider ids and aliases", () => {
    const registry = createEmptyPluginRegistry();
    registry.videoGenerationProviders.push(
      {
        pluginId: "blocked-video",
        pluginName: "Blocked Video",
        source: "test",
        provider: {
          id: "__proto__",
          aliases: ["constructor", "prototype"],
          capabilities: {},
          generateVideo: async () => ({
            videos: [{ buffer: Buffer.from("video"), mimeType: "video/mp4" }],
          }),
        },
      },
      {
        pluginId: "safe-video",
        pluginName: "Safe Video",
        source: "test",
        provider: {
          id: "safe-video",
          aliases: ["safe-alias", "constructor"],
          capabilities: {},
          generateVideo: async () => ({
            videos: [{ buffer: Buffer.from("video"), mimeType: "video/mp4" }],
          }),
        },
      },
    );
    resolveRuntimePluginRegistryMock.mockReturnValue(registry);

    expect(listVideoGenerationProviders().map((provider) => provider.id)).toEqual(["safe-video"]);
    expect(getVideoGenerationProvider("__proto__")).toBeUndefined();
    expect(getVideoGenerationProvider("constructor")).toBeUndefined();
    expect(getVideoGenerationProvider("safe-alias")?.id).toBe("safe-video");
=======
    expect(resolvePluginCapabilityProvidersMock).toHaveBeenCalledWith({
      key: "videoGenerationProviders",
      cfg: undefined,
    });
  });

  it("ignores prototype-like provider ids and aliases", async () => {
    resolvePluginCapabilityProvidersMock.mockReturnValue([
      createProvider({ id: "__proto__", aliases: ["constructor", "prototype"] }),
      createProvider({ id: "safe-video", aliases: ["safe-alias", "constructor"] }),
    ]);
    const registry = await loadProviderRegistry();

    expect(registry.listVideoGenerationProviders().map((provider) => provider.id)).toEqual([
      "safe-video",
    ]);
    expect(registry.getVideoGenerationProvider("__proto__")).toBeUndefined();
    expect(registry.getVideoGenerationProvider("constructor")).toBeUndefined();
    expect(requireVideoProvider(registry, "safe-alias").id).toBe("safe-video");
>>>>>>> upstream/main
  });
});
