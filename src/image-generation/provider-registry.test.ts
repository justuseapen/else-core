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
=======
/** Tests image-generation provider registry aliases and plugin capability integration. */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/types.js";
import type { ImageGenerationProviderPlugin } from "../plugins/types.js";

type ProviderRegistryModule = typeof import("./provider-registry.js");

const resolvePluginCapabilityProvidersMock = vi.hoisted(() =>
  vi.fn<() => ImageGenerationProviderPlugin[]>(() => []),
);
vi.mock("../plugins/capability-provider-runtime.js", () => ({
  resolvePluginCapabilityProviders: resolvePluginCapabilityProvidersMock,
}));

function createProvider(
  params: Pick<ImageGenerationProviderPlugin, "id"> & Partial<ImageGenerationProviderPlugin>,
): ImageGenerationProviderPlugin {
  return {
    label: params.id,
    capabilities: {
      generate: {},
      edit: { enabled: false },
    },
    generateImage: async () => ({
      images: [{ buffer: Buffer.from("image"), mimeType: "image/png" }],
    }),
    ...params,
  };
}
>>>>>>> upstream/main

function requireImageProvider(
  registry: ProviderRegistryModule,
  id: string,
): ImageGenerationProviderPlugin {
  const provider = registry.getImageGenerationProvider(id);
  if (!provider) {
    throw new Error(`expected image generation provider ${id}`);
  }
  return provider;
}

async function loadProviderRegistry(): Promise<ProviderRegistryModule> {
  vi.resetModules();
  return import("./provider-registry.js");
}

describe("image-generation provider registry", () => {
<<<<<<< HEAD
  beforeAll(async () => {
    ({ getImageGenerationProvider, listImageGenerationProviders } =
      await import("./provider-registry.js"));
  });

  beforeEach(() => {
    resolveRuntimePluginRegistryMock.mockReset();
    resolveRuntimePluginRegistryMock.mockReturnValue(undefined);
  });

  it("does not load plugins when listing without config", () => {
    expect(listImageGenerationProviders()).toEqual([]);
    expect(resolveRuntimePluginRegistryMock).toHaveBeenCalledWith();
  });
=======
  let delegationCase: {
    calls: unknown[][];
    providers: ImageGenerationProviderPlugin[];
  };

  beforeAll(async () => {
    const cfg = {} as OpenClawConfig;
    const { listImageGenerationProviders } = await loadProviderRegistry();
    const providers = listImageGenerationProviders(cfg);
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
    const cfg = {} as OpenClawConfig;
>>>>>>> upstream/main

    expect(delegationCase.providers).toStrictEqual([]);
    expect(delegationCase.calls).toContainEqual([
      {
        key: "imageGenerationProviders",
        cfg,
      },
<<<<<<< HEAD
    });
    resolveRuntimePluginRegistryMock.mockReturnValue(registry);
=======
    ]);
  });

  it("uses active plugin providers without loading from disk", async () => {
    resolvePluginCapabilityProvidersMock.mockReturnValue([createProvider({ id: "custom-image" })]);
    const { getImageGenerationProvider } = await loadProviderRegistry();
>>>>>>> upstream/main

    const provider = getImageGenerationProvider("custom-image");

    expect(provider?.id).toBe("custom-image");
<<<<<<< HEAD
    expect(resolveRuntimePluginRegistryMock).toHaveBeenCalledWith();
  });

  it("ignores prototype-like provider ids and aliases", () => {
    const registry = createEmptyPluginRegistry();
    registry.imageGenerationProviders.push(
      {
        pluginId: "blocked-image",
        pluginName: "Blocked Image",
        source: "test",
        provider: {
          id: "__proto__",
          aliases: ["constructor", "prototype"],
          capabilities: {
            generate: {},
            edit: { enabled: false },
          },
          generateImage: async () => ({
            images: [{ buffer: Buffer.from("image"), mimeType: "image/png" }],
          }),
        },
      },
      {
        pluginId: "safe-image",
        pluginName: "Safe Image",
        source: "test",
        provider: {
          id: "safe-image",
          aliases: ["safe-alias", "constructor"],
          capabilities: {
            generate: {},
            edit: { enabled: false },
          },
          generateImage: async () => ({
            images: [{ buffer: Buffer.from("image"), mimeType: "image/png" }],
          }),
        },
      },
    );
    resolveRuntimePluginRegistryMock.mockReturnValue(registry);
=======
    expect(resolvePluginCapabilityProvidersMock).toHaveBeenCalledWith({
      key: "imageGenerationProviders",
      cfg: undefined,
    });
  });

  it("ignores prototype-like provider ids and aliases", async () => {
    resolvePluginCapabilityProvidersMock.mockReturnValue([
      createProvider({ id: "__proto__", aliases: ["constructor", "prototype"] }),
      createProvider({ id: "safe-image", aliases: ["safe-alias", "constructor"] }),
    ]);
    const registry = await loadProviderRegistry();
>>>>>>> upstream/main

    expect(registry.listImageGenerationProviders().map((provider) => provider.id)).toEqual([
      "safe-image",
    ]);
    expect(registry.getImageGenerationProvider("__proto__")).toBeUndefined();
    expect(registry.getImageGenerationProvider("constructor")).toBeUndefined();
    expect(requireImageProvider(registry, "safe-alias").id).toBe("safe-image");
  });
});
