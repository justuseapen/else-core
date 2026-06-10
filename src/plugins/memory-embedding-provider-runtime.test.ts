<<<<<<< HEAD
=======
// Covers memory embedding provider runtime hooks from plugins.
>>>>>>> upstream/main
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearMemoryEmbeddingProviders,
  registerMemoryEmbeddingProvider,
  type MemoryEmbeddingProviderAdapter,
} from "./memory-embedding-providers.js";

const mocks = vi.hoisted(() => ({
  resolvePluginCapabilityProviders: vi.fn<
    typeof import("./capability-provider-runtime.js").resolvePluginCapabilityProviders
  >(() => []),
<<<<<<< HEAD
}));

vi.mock("./capability-provider-runtime.js", () => ({
=======
  resolvePluginCapabilityProvider: vi.fn<
    typeof import("./capability-provider-runtime.js").resolvePluginCapabilityProvider
  >(() => undefined),
}));

vi.mock("./capability-provider-runtime.js", () => ({
  resolvePluginCapabilityProvider: mocks.resolvePluginCapabilityProvider,
>>>>>>> upstream/main
  resolvePluginCapabilityProviders: mocks.resolvePluginCapabilityProviders,
}));

let runtimeModule: typeof import("./memory-embedding-provider-runtime.js");

function createCapabilityAdapter(id: string): MemoryEmbeddingProviderAdapter {
  return {
    id,
    create: async () => ({ provider: null }),
  };
}

beforeEach(async () => {
  clearMemoryEmbeddingProviders();
  mocks.resolvePluginCapabilityProviders.mockReset();
  mocks.resolvePluginCapabilityProviders.mockReturnValue([]);
<<<<<<< HEAD
=======
  mocks.resolvePluginCapabilityProvider.mockReset();
  mocks.resolvePluginCapabilityProvider.mockReturnValue(undefined);
>>>>>>> upstream/main
  runtimeModule = await import("./memory-embedding-provider-runtime.js");
});

afterEach(() => {
  clearMemoryEmbeddingProviders();
});

describe("memory embedding provider runtime resolution", () => {
<<<<<<< HEAD
  it("prefers registered adapters over capability fallback adapters", () => {
=======
  it("merges registered and declared capability fallback adapters", () => {
>>>>>>> upstream/main
    registerMemoryEmbeddingProvider({
      id: "registered",
      create: async () => ({ provider: null }),
    });
    mocks.resolvePluginCapabilityProviders.mockReturnValue([createCapabilityAdapter("capability")]);

    expect(runtimeModule.listMemoryEmbeddingProviders().map((adapter) => adapter.id)).toEqual([
      "registered",
<<<<<<< HEAD
    ]);
    expect(runtimeModule.getMemoryEmbeddingProvider("registered")?.id).toBe("registered");
    expect(mocks.resolvePluginCapabilityProviders).not.toHaveBeenCalled();
=======
      "capability",
    ]);
    expect(runtimeModule.getMemoryEmbeddingProvider("registered")?.id).toBe("registered");
    expect(mocks.resolvePluginCapabilityProviders).toHaveBeenCalledTimes(1);
>>>>>>> upstream/main
  });

  it("falls back to declared capability adapters when the registry is cold", () => {
    mocks.resolvePluginCapabilityProviders.mockReturnValue([createCapabilityAdapter("ollama")]);
<<<<<<< HEAD
=======
    mocks.resolvePluginCapabilityProvider.mockReturnValue(createCapabilityAdapter("ollama"));
>>>>>>> upstream/main

    expect(runtimeModule.listMemoryEmbeddingProviders().map((adapter) => adapter.id)).toEqual([
      "ollama",
    ]);
    expect(runtimeModule.getMemoryEmbeddingProvider("ollama")?.id).toBe("ollama");
<<<<<<< HEAD
    expect(mocks.resolvePluginCapabilityProviders).toHaveBeenCalledTimes(2);
  });

  it("does not consult capability fallback once runtime adapters are registered", () => {
    registerMemoryEmbeddingProvider({
      id: "openai",
      create: async () => ({ provider: null }),
    });
    mocks.resolvePluginCapabilityProviders.mockReturnValue([createCapabilityAdapter("ollama")]);

    expect(runtimeModule.getMemoryEmbeddingProvider("ollama")).toBeUndefined();
    expect(mocks.resolvePluginCapabilityProviders).not.toHaveBeenCalled();
=======
    expect(mocks.resolvePluginCapabilityProviders).toHaveBeenCalledTimes(1);
    expect(mocks.resolvePluginCapabilityProvider).toHaveBeenCalledWith({
      key: "memoryEmbeddingProviders",
      providerId: "ollama",
      cfg: undefined,
    });
  });

  it("uses a configured provider api as the memory adapter owner", () => {
    const ollamaAdapter = createCapabilityAdapter("ollama");
    const config = {
      models: {
        providers: {
          "ollama-5080": {
            api: "ollama",
            baseUrl: "http://10.0.0.8:11435",
            models: [],
          },
        },
      },
    };
    mocks.resolvePluginCapabilityProvider.mockImplementation(({ providerId }) =>
      providerId === "ollama" ? ollamaAdapter : undefined,
    );

    expect(runtimeModule.getMemoryEmbeddingProvider("ollama-5080", config as never)).toBe(
      ollamaAdapter,
    );
    expect(mocks.resolvePluginCapabilityProvider).toHaveBeenCalledWith({
      key: "memoryEmbeddingProviders",
      providerId: "ollama-5080",
      cfg: config,
    });
    expect(mocks.resolvePluginCapabilityProvider).toHaveBeenCalledWith({
      key: "memoryEmbeddingProviders",
      providerId: "ollama",
      cfg: config,
    });
  });

  it("uses registered adapters through a configured provider api", () => {
    const ollamaAdapter = createCapabilityAdapter("ollama");
    registerMemoryEmbeddingProvider(ollamaAdapter);

    expect(
      runtimeModule.getMemoryEmbeddingProvider("ollama-gpu1", {
        models: {
          providers: {
            "ollama-gpu1": {
              api: "ollama",
              baseUrl: "http://ollama-host:11435",
              models: [],
            },
          },
        },
      } as never),
    ).toBe(ollamaAdapter);
    expect(mocks.resolvePluginCapabilityProvider).not.toHaveBeenCalled();
  });

  it("prefers registered adapters over declared capability fallback adapters with the same id", () => {
    const registered = {
      id: "openai",
      create: async () => ({ provider: null }),
    } satisfies MemoryEmbeddingProviderAdapter;
    registerMemoryEmbeddingProvider({
      ...registered,
    });
    mocks.resolvePluginCapabilityProviders.mockReturnValue([createCapabilityAdapter("openai")]);

    expect(runtimeModule.getMemoryEmbeddingProvider("openai")).toStrictEqual(registered);
    expect(runtimeModule.listMemoryEmbeddingProviders().map((adapter) => adapter.id)).toEqual([
      "openai",
    ]);
    expect(mocks.resolvePluginCapabilityProviders).toHaveBeenCalledTimes(1);
>>>>>>> upstream/main
  });
});
