// Memory Host SDK tests cover embeddings behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
<<<<<<< HEAD
import * as authModule from "../../../../src/agents/model-auth.js";
import { DEFAULT_GEMINI_EMBEDDING_MODEL } from "./embeddings-gemini.js";
import { createEmbeddingProvider, DEFAULT_LOCAL_MODEL } from "./embeddings.js";
import * as nodeLlamaModule from "./node-llama.js";
import { mockPublicPinnedHostname } from "./test-helpers/ssrf.js";

const { createOllamaEmbeddingProviderMock } = vi.hoisted(() => ({
  createOllamaEmbeddingProviderMock: vi.fn(async () => {
    throw new Error("Unexpected ollama provider in embeddings.test.ts");
  }),
}));

vi.mock("../../../../src/infra/net/fetch-guard.js", () => ({
  fetchWithSsrFGuard: async (params: {
    url: string;
    init?: RequestInit;
    fetchImpl?: typeof fetch;
  }) => {
    const fetchImpl = params.fetchImpl ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error("fetch is not available");
    }
    const response = await fetchImpl(params.url, params.init);
    return {
      response,
      finalUrl: params.url,
      release: async () => {},
    };
  },
}));

vi.mock("./embeddings-ollama.js", () => ({
  createOllamaEmbeddingProvider: createOllamaEmbeddingProviderMock,
}));

const createFetchMock = () =>
  vi.fn(async (_input?: unknown, _init?: unknown) => ({
    ok: true,
    status: 200,
    json: async () => ({ data: [{ embedding: [1, 2, 3] }] }),
  }));
=======
import { LOCAL_EMBEDDING_WORKER_ERROR_CODES } from "./embedding-worker-errors.js";
import { createLocalEmbeddingWorkerProvider } from "./embeddings-worker.js";
import { createLocalEmbeddingProviderInProcess, DEFAULT_LOCAL_MODEL } from "./embeddings.js";

const nodeLlamaMock = vi.hoisted(() => ({
  importNodeLlamaCpp: vi.fn(),
}));
>>>>>>> upstream/main

vi.mock("./node-llama.js", () => ({
  importNodeLlamaCpp: nodeLlamaMock.importNodeLlamaCpp,
}));

<<<<<<< HEAD
function installFetchMock(fetchMock: typeof globalThis.fetch) {
  vi.stubGlobal("fetch", fetchMock);
}

function readFirstFetchRequest(fetchMock: { mock: { calls: unknown[][] } }) {
  const [url, init] = fetchMock.mock.calls[0] ?? [];
  return { url, init: init as RequestInit | undefined };
}

type ResolvedProviderAuth = Awaited<ReturnType<typeof authModule.resolveApiKeyForProvider>>;

beforeEach(() => {
  vi.spyOn(authModule, "resolveApiKeyForProvider");
  vi.spyOn(nodeLlamaModule, "importNodeLlamaCpp");
});

beforeEach(() => {
  vi.useRealTimers();
=======
beforeEach(() => {
  nodeLlamaMock.importNodeLlamaCpp.mockReset();
>>>>>>> upstream/main
});

afterEach(() => {
  vi.resetAllMocks();
});

<<<<<<< HEAD
function requireProvider(result: Awaited<ReturnType<typeof createEmbeddingProvider>>) {
  if (!result.provider) {
    throw new Error("Expected embedding provider");
=======
function createDeferred<T>() {
  let resolve: ((value: T) => void) | undefined;
  let reject: ((reason?: unknown) => void) | undefined;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (!resolve || !reject) {
    throw new Error("Expected deferred callbacks to be initialized");
>>>>>>> upstream/main
  }
  return { promise, resolve, reject };
}

function mockLocalEmbeddingRuntime(vector = new Float32Array([2.35, 3.45, 0.63, 4.3])) {
  const disposeContext = vi.fn();
  const disposeModel = vi.fn();
  const disposeLlama = vi.fn();
  const getEmbeddingFor = vi.fn().mockResolvedValue({ vector });
  const createEmbeddingContext = vi
    .fn()
    .mockResolvedValue({ getEmbeddingFor, dispose: disposeContext });
  const loadModel = vi.fn().mockResolvedValue({ createEmbeddingContext, dispose: disposeModel });
  const getLlama = vi.fn(async () => ({ loadModel, dispose: disposeLlama }));
  const resolveModelFile = vi.fn(async (modelPath: string) => `/resolved/${modelPath}`);

  nodeLlamaMock.importNodeLlamaCpp.mockResolvedValue({
    getLlama,
    resolveModelFile,
    LlamaLogLevel: { error: 0 },
  } as never);

  return {
    createEmbeddingContext,
    disposeContext,
    disposeLlama,
    disposeModel,
    getLlama,
    getEmbeddingFor,
    loadModel,
    resolveModelFile,
  };
}

describe("local embedding provider", () => {
  it("normalizes local embeddings and resolves the default local model", async () => {
    const runtime = mockLocalEmbeddingRuntime();

<<<<<<< HEAD
function createLocalProvider(options?: { fallback?: "none" | "openai" }) {
  return createEmbeddingProvider({
    config: {} as never,
    provider: "local",
    model: "text-embedding-3-small",
    fallback: options?.fallback ?? "none",
  });
}

function expectAutoSelectedProvider(
  result: Awaited<ReturnType<typeof createEmbeddingProvider>>,
  expectedId: "openai" | "gemini" | "mistral",
) {
  expect(result.requestedProvider).toBe("auto");
  const provider = requireProvider(result);
  expect(provider.id).toBe(expectedId);
  return provider;
}

function createAutoProvider(model = "") {
  return createEmbeddingProvider({
    config: {} as never,
    provider: "auto",
    model,
    fallback: "none",
  });
}

describe("embedding provider remote overrides", () => {
  it("uses remote baseUrl/apiKey and merges headers", async () => {
    const fetchMock = createFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    mockResolvedProviderKey("provider-key");

    const cfg = {
      models: {
        providers: {
          openai: {
            baseUrl: "https://api.openai.com/v1",
            headers: {
              "X-Provider": "p",
              "X-Shared": "provider",
            },
          },
        },
      },
    };

    const result = await createEmbeddingProvider({
      config: cfg as never,
      provider: "openai",
      remote: {
        baseUrl: "https://example.com/v1",
        apiKey: "  remote-key  ",
        headers: {
          "X-Shared": "remote",
          "X-Remote": "r",
        },
      },
      model: "text-embedding-3-small",
      fallback: "openai",
    });

    const provider = requireProvider(result);
    await provider.embedQuery("hello");

    expect(authModule.resolveApiKeyForProvider).not.toHaveBeenCalled();
    const url = fetchMock.mock.calls[0]?.[0];
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(url).toBe("https://example.com/v1/embeddings");
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer remote-key");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Provider"]).toBe("p");
    expect(headers["X-Shared"]).toBe("remote");
    expect(headers["X-Remote"]).toBe("r");
  });

  it("falls back to resolved api key when remote apiKey is blank", async () => {
    const fetchMock = createFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    mockResolvedProviderKey("provider-key");

    const cfg = {
      models: {
        providers: {
          openai: {
            baseUrl: "https://api.openai.com/v1",
          },
        },
      },
    };

    const result = await createEmbeddingProvider({
      config: cfg as never,
      provider: "openai",
      remote: {
        baseUrl: "https://example.com/v1",
        apiKey: "   ",
      },
      model: "text-embedding-3-small",
      fallback: "openai",
    });

    const provider = requireProvider(result);
    await provider.embedQuery("hello");

    expect(authModule.resolveApiKeyForProvider).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = (init?.headers as Record<string, string>) ?? {};
    expect(headers.Authorization).toBe("Bearer provider-key");
  });

  it("builds Gemini embeddings requests with api key header", async () => {
    const fetchMock = createGeminiFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    mockResolvedProviderKey("provider-key");

    const cfg = {
      models: {
        providers: {
          google: {
            baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          },
        },
      },
    };

    const result = await createEmbeddingProvider({
      config: cfg as never,
      provider: "gemini",
      remote: {
        apiKey: "gemini-key",
      },
      model: "text-embedding-004",
      fallback: "openai",
    });

    const provider = requireProvider(result);
    await provider.embedQuery("hello");

    const { url, init } = readFirstFetchRequest(fetchMock);
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent",
    );
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-goog-api-key"]).toBe("gemini-key");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("fails fast when Gemini remote apiKey is an unresolved SecretRef", async () => {
    await expect(
      createEmbeddingProvider({
        config: {} as never,
        provider: "gemini",
        remote: {
          apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
        },
        model: "text-embedding-004",
        fallback: "openai",
      }),
    ).rejects.toThrow(/agents\.\*\.memorySearch\.remote\.apiKey:/i);
  });

  it("uses GEMINI_API_KEY env indirection for Gemini remote apiKey", async () => {
    const fetchMock = createGeminiFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    vi.stubEnv("GEMINI_API_KEY", "env-gemini-key");

    const result = await createEmbeddingProvider({
      config: {} as never,
      provider: "gemini",
      remote: {
        apiKey: "GEMINI_API_KEY", // pragma: allowlist secret
      },
      model: "text-embedding-004",
      fallback: "openai",
    });

    const provider = requireProvider(result);
    await provider.embedQuery("hello");

    const { init } = readFirstFetchRequest(fetchMock);
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-goog-api-key"]).toBe("env-gemini-key");
  });

  it("builds Mistral embeddings requests with bearer auth", async () => {
    const fetchMock = createFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    mockResolvedProviderKey("provider-key");

    const cfg = {
      models: {
        providers: {
          mistral: {
            baseUrl: "https://api.mistral.ai/v1",
          },
        },
      },
    };

    const result = await createEmbeddingProvider({
      config: cfg as never,
      provider: "mistral",
      remote: {
        apiKey: "mistral-key", // pragma: allowlist secret
      },
      model: "mistral/mistral-embed",
      fallback: "none",
    });

    const provider = requireProvider(result);
    await provider.embedQuery("hello");

    const { url, init } = readFirstFetchRequest(fetchMock);
    expect(url).toBe("https://api.mistral.ai/v1/embeddings");
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer mistral-key");
    const payload = JSON.parse((init?.body as string | undefined) ?? "{}") as { model?: string };
    expect(payload.model).toBe("mistral-embed");
  });
});

describe("embedding provider auto selection", () => {
  it("keeps explicit model when openai is selected", async () => {
    const fetchMock = vi.fn(async (_input?: unknown, _init?: unknown) => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ embedding: [1, 2, 3] }] }),
    }));
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
    mockPublicPinnedHostname();
    vi.mocked(authModule.resolveApiKeyForProvider).mockImplementation(async ({ provider }) => {
      if (provider === "openai") {
        return { apiKey: "openai-key", source: "env: OPENAI_API_KEY", mode: "api-key" };
      }
      throw new Error(`Unexpected provider ${provider}`);
    });

    const result = await createEmbeddingProvider({
      config: {} as never,
      provider: "auto",
      model: "text-embedding-3-small",
      fallback: "none",
    });

    expect(result.requestedProvider).toBe("auto");
    const provider = requireProvider(result);
    expect(provider.id).toBe("openai");
    await provider.embedQuery("hello");
    const url = fetchMock.mock.calls[0]?.[0];
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(url).toBe("https://api.openai.com/v1/embeddings");
    const payload = JSON.parse(init?.body as string) as { model?: string };
    expect(payload.model).toBe("text-embedding-3-small");
  });

  it("selects the first available remote provider in auto mode", async () => {
    const cases: Array<{
      name: string;
      expectedProvider: "openai" | "gemini" | "mistral";
      fetchMockFactory: typeof createFetchMock | typeof createGeminiFetchMock;
      resolveApiKey: (provider: string) => ResolvedProviderAuth;
      expectedUrl: string;
    }> = [
      {
        name: "openai first",
        expectedProvider: "openai" as const,
        fetchMockFactory: createFetchMock,
        resolveApiKey(provider: string): ResolvedProviderAuth {
          if (provider === "openai") {
            return { apiKey: "openai-key", source: "env: OPENAI_API_KEY", mode: "api-key" };
          }
          throw new Error(`No API key found for provider "${provider}".`);
        },
        expectedUrl: "https://api.openai.com/v1/embeddings",
      },
      {
        name: "gemini fallback",
        expectedProvider: "gemini" as const,
        fetchMockFactory: createGeminiFetchMock,
        resolveApiKey(provider: string): ResolvedProviderAuth {
          if (provider === "openai") {
            throw new Error('No API key found for provider "openai".');
          }
          if (provider === "google") {
            return {
              apiKey: "gemini-key",
              source: "env: GEMINI_API_KEY",
              mode: "api-key" as const,
            };
          }
          throw new Error(`Unexpected provider ${provider}`);
        },
        expectedUrl: `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_EMBEDDING_MODEL}:embedContent`,
      },
      {
        name: "mistral after earlier misses",
        expectedProvider: "mistral" as const,
        fetchMockFactory: createFetchMock,
        resolveApiKey(provider: string): ResolvedProviderAuth {
          if (provider === "mistral") {
            return {
              apiKey: "mistral-key",
              source: "env: MISTRAL_API_KEY",
              mode: "api-key" as const,
            };
          }
          throw new Error(`No API key found for provider "${provider}".`);
        },
        expectedUrl: "https://api.mistral.ai/v1/embeddings",
      },
    ];

    for (const testCase of cases) {
      vi.resetAllMocks();
      vi.unstubAllGlobals();
      const fetchMock = testCase.fetchMockFactory();
      installFetchMock(fetchMock as unknown as typeof globalThis.fetch);
      mockPublicPinnedHostname();
      vi.mocked(authModule.resolveApiKeyForProvider).mockImplementation(async ({ provider }) =>
        testCase.resolveApiKey(provider),
      );

      const result = await createAutoProvider();
      const provider = expectAutoSelectedProvider(result, testCase.expectedProvider);
      await provider.embedQuery("hello");
      const [url] = fetchMock.mock.calls[0] ?? [];
      expect(url, testCase.name).toBe(testCase.expectedUrl);
    }
  });
});

describe("embedding provider local fallback", () => {
  it("falls back to openai when node-llama-cpp is missing", async () => {
    mockMissingLocalEmbeddingDependency();

    const fetchMock = createFetchMock();
    installFetchMock(fetchMock as unknown as typeof globalThis.fetch);

    mockResolvedProviderKey("provider-key");

    const result = await createLocalProvider({ fallback: "openai" });

    const provider = requireProvider(result);
    expect(provider.id).toBe("openai");
    expect(result.fallbackFrom).toBe("local");
    expect(result.fallbackReason).toContain("node-llama-cpp");
  });

  it("throws a helpful error when local is requested and fallback is none", async () => {
    mockMissingLocalEmbeddingDependency();
    await expect(createLocalProvider()).rejects.toThrow(/optional dependency node-llama-cpp/i);
  });

  it("mentions every remote provider in local setup guidance", async () => {
    mockMissingLocalEmbeddingDependency();
    await expect(createLocalProvider()).rejects.toThrow(/provider = "gemini"/i);
    await expect(createLocalProvider()).rejects.toThrow(/provider = "mistral"/i);
  });
});

describe("local embedding normalization", () => {
  async function createLocalProviderForTest() {
    return createEmbeddingProvider({
=======
    const provider = await createLocalEmbeddingProviderInProcess({
>>>>>>> upstream/main
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    const embedding = await provider.embedQuery("test query");
    const magnitude = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));

    expect(DEFAULT_LOCAL_MODEL).toBe(
      "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf",
    );
    expect(magnitude).toBeCloseTo(1, 5);
    expect(runtime.resolveModelFile).toHaveBeenCalledWith(
      DEFAULT_LOCAL_MODEL,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(runtime.loadModel).toHaveBeenCalledWith(
      expect.objectContaining({
        modelPath: `/resolved/${DEFAULT_LOCAL_MODEL}`,
        loadSignal: expect.any(AbortSignal),
      }),
<<<<<<< HEAD
      resolveModelFile: async () => "/fake/model.gguf",
      LlamaLogLevel: { error: 0 },
    } as never);

    const result = await createLocalProviderForTest();

    const provider = requireProvider(result);
    const embeddings = await provider.embedBatch(["text1", "text2", "text3"]);

    for (const embedding of embeddings) {
      const magnitude = Math.sqrt(embedding.reduce((sum, x) => sum + x * x, 0));
      expect(magnitude).toBeCloseTo(1.0, 5);
    }
  });
});

describe("local embedding ensureContext concurrency", () => {
  async function setupLocalProviderWithMockedInit(params?: {
    initializationDelayMs?: number;
    failFirstGetLlama?: boolean;
  }) {
    const getLlamaSpy = vi.fn();
    const loadModelSpy = vi.fn();
    const createContextSpy = vi.fn();
    let shouldFail = params?.failFirstGetLlama ?? false;

    vi.spyOn(nodeLlamaModule, "importNodeLlamaCpp").mockResolvedValue({
      getLlama: async (...args: unknown[]) => {
        getLlamaSpy(...args);
        if (shouldFail) {
          shouldFail = false;
          throw new Error("transient init failure");
        }
        if (params?.initializationDelayMs) {
          await sleep(params.initializationDelayMs);
        }
        return {
          loadModel: async (...modelArgs: unknown[]) => {
            loadModelSpy(...modelArgs);
            if (params?.initializationDelayMs) {
              await sleep(params.initializationDelayMs);
            }
            return {
              createEmbeddingContext: async () => {
                createContextSpy();
                return {
                  getEmbeddingFor: vi.fn().mockResolvedValue({
                    vector: new Float32Array([1, 0, 0, 0]),
                  }),
                };
              },
            };
          },
        };
      },
      resolveModelFile: async () => "/fake/model.gguf",
      LlamaLogLevel: { error: 0 },
    } as never);

    const result = await createEmbeddingProvider({
=======
    );
    expect(runtime.getEmbeddingFor).toHaveBeenCalledWith("test query");
  });

  it("passes default contextSize (4096) to createEmbeddingContext when not configured", async () => {
    const runtime = mockLocalEmbeddingRuntime();

    const provider = await createLocalEmbeddingProviderInProcess({
>>>>>>> upstream/main
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    await provider.embedQuery("context size default test");

    expect(runtime.createEmbeddingContext).toHaveBeenCalledWith(
      expect.objectContaining({ contextSize: 4096, createSignal: expect.any(AbortSignal) }),
    );
  });

  it("imports node-llama-cpp from an explicit module URL when provided", async () => {
    mockLocalEmbeddingRuntime();

    await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
      local: {
        nodeLlamaCppImportUrl: "file:///plugins/llama-cpp/node-llama-cpp.js",
      } as never,
    });

    expect(nodeLlamaMock.importNodeLlamaCpp).toHaveBeenCalledWith(
      "file:///plugins/llama-cpp/node-llama-cpp.js",
    );
  });

  it("passes configured contextSize to createEmbeddingContext", async () => {
    const runtime = mockLocalEmbeddingRuntime();

    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
      local: { contextSize: 2048 },
    });

    await provider.embedQuery("context size custom test");

    expect(runtime.createEmbeddingContext).toHaveBeenCalledWith(
      expect.objectContaining({ contextSize: 2048, createSignal: expect.any(AbortSignal) }),
    );
  });

  it('passes "auto" contextSize to createEmbeddingContext when explicitly set', async () => {
    const runtime = mockLocalEmbeddingRuntime();

    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
      local: { contextSize: "auto" },
    });

    await provider.embedQuery("context size auto test");

    expect(runtime.createEmbeddingContext).toHaveBeenCalledWith(
      expect.objectContaining({ contextSize: "auto", createSignal: expect.any(AbortSignal) }),
    );
  });

  it("runs local batch embeddings sequentially", async () => {
    const calls: string[] = [];
    const firstGate = createDeferred<{ vector: Float32Array }>();
    const secondGate = createDeferred<{ vector: Float32Array }>();
    const getEmbeddingFor = vi.fn((text: string) => {
      calls.push(text);
      return text === "first" ? firstGate.promise : secondGate.promise;
    });
    nodeLlamaMock.importNodeLlamaCpp.mockResolvedValue({
      getLlama: vi.fn(async () => ({
        loadModel: vi.fn(async () => ({
          createEmbeddingContext: vi.fn(async () => ({ getEmbeddingFor })),
        })),
      })),
      resolveModelFile: vi.fn(async () => "/resolved/model.gguf"),
      LlamaLogLevel: { error: 0 },
    } as never);
    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    const batchPromise = provider.embedBatch(["first", "second"]);
    await expect.poll(() => calls.join(",")).toBe("first");
    firstGate.resolve({ vector: new Float32Array([1, 0]) });
    await expect.poll(() => calls.join(",")).toBe("first,second");
    secondGate.resolve({ vector: new Float32Array([0, 1]) });

    await expect(batchPromise).resolves.toHaveLength(2);
  });

  it("trims explicit local model paths and cache directories", async () => {
    const runtime = mockLocalEmbeddingRuntime(new Float32Array([1, 0]));

    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
      local: {
        modelPath: "  /models/embed.gguf  ",
        modelCacheDir: "  /cache/models  ",
      },
    });

    await provider.embedBatch(["a", "b"]);

    expect(provider.model).toBe("/models/embed.gguf");
    expect(runtime.resolveModelFile).toHaveBeenCalledWith(
      "/models/embed.gguf",
      expect.objectContaining({
        directory: "/cache/models",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(runtime.getEmbeddingFor).toHaveBeenCalledTimes(2);
  });

  it("disposes cached local llama resources when closed", async () => {
    const runtime = mockLocalEmbeddingRuntime();

    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    await provider.embedQuery("load local resources");
    await provider.close?.();
    await provider.close?.();

    expect(runtime.disposeContext).toHaveBeenCalledTimes(1);
    expect(runtime.disposeModel).toHaveBeenCalledTimes(1);
    expect(runtime.disposeLlama).toHaveBeenCalledTimes(1);
    await expect(provider.embedQuery("after close")).rejects.toThrow(
      "Local embedding provider has been closed",
    );
  });

  it("does not wait for pending local llama initialization before close resolves", async () => {
    const disposeLlama = vi.fn();
    const getLlamaGate = createDeferred<unknown>();
    nodeLlamaMock.importNodeLlamaCpp.mockResolvedValue({
      getLlama: async () => (await getLlamaGate.promise) as never,
      resolveModelFile: vi.fn(async (modelPath: string) => `/resolved/${modelPath}`),
      LlamaLogLevel: { error: 0 },
    } as never);
    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    const embedPromise = provider.embedQuery("pending init");
    await expect(provider.close?.()).resolves.toBeUndefined();

    getLlamaGate.resolve({ loadModel: vi.fn(), dispose: disposeLlama });
    await expect(embedPromise).rejects.toThrow("Local embedding provider has been closed");
    expect(disposeLlama).toHaveBeenCalledTimes(1);
  });

  it("aborts pending local llama model loads when closed", async () => {
    const loadModelStarted = createDeferred<void>();
    const loadModelGate = createDeferred<never>();
    const disposeLlama = vi.fn();
    let capturedResolveSignal: AbortSignal | undefined;
    let capturedLoadSignal: AbortSignal | undefined;
    const loadModel = vi.fn(
      (params: { modelPath: string; loadSignal?: AbortSignal }): Promise<never> => {
        capturedLoadSignal = params.loadSignal;
        loadModelStarted.resolve();
        return loadModelGate.promise;
      },
    );
    nodeLlamaMock.importNodeLlamaCpp.mockResolvedValue({
      getLlama: async () => ({ loadModel, dispose: disposeLlama }),
      resolveModelFile: vi.fn(async (_modelPath: string, options?: { signal?: AbortSignal }) => {
        capturedResolveSignal = options?.signal;
        return "/resolved/model.gguf";
      }),
      LlamaLogLevel: { error: 0 },
    } as never);
    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    const embedPromise = provider.embedQuery("pending model load");
    await loadModelStarted.promise;
    await expect(provider.close?.()).resolves.toBeUndefined();

    expect(capturedResolveSignal?.aborted).toBe(true);
    expect(capturedLoadSignal?.aborted).toBe(true);
    expect(disposeLlama).toHaveBeenCalledTimes(1);
    loadModelGate.reject(new Error("load aborted"));
    await expect(embedPromise).rejects.toThrow("load aborted");
  });

  it("aborts pending local llama embedding context creation when closed", async () => {
    const createContextStarted = createDeferred<void>();
    const createContextGate = createDeferred<never>();
    const disposeLlama = vi.fn();
    const disposeModel = vi.fn();
    let capturedCreateSignal: AbortSignal | undefined;
    const createEmbeddingContext = vi.fn(
      (options?: { createSignal?: AbortSignal }): Promise<never> => {
        capturedCreateSignal = options?.createSignal;
        createContextStarted.resolve();
        return createContextGate.promise;
      },
    );
    nodeLlamaMock.importNodeLlamaCpp.mockResolvedValue({
      getLlama: async () => ({
        loadModel: vi.fn(async () => ({ createEmbeddingContext, dispose: disposeModel })),
        dispose: disposeLlama,
      }),
      resolveModelFile: vi.fn(async () => "/resolved/model.gguf"),
      LlamaLogLevel: { error: 0 },
    } as never);
    const provider = await createLocalEmbeddingProviderInProcess({
      config: {} as never,
      provider: "local",
      model: "",
      fallback: "none",
    });

    const embedPromise = provider.embedQuery("pending context create");
    await createContextStarted.promise;
    await expect(provider.close?.()).resolves.toBeUndefined();

    expect(capturedCreateSignal?.aborted).toBe(true);
    expect(disposeModel).toHaveBeenCalledTimes(1);
    expect(disposeLlama).toHaveBeenCalledTimes(1);
    createContextGate.reject(new Error("context create aborted"));
    await expect(embedPromise).rejects.toThrow("context create aborted");
  });

  it("uses a worker process for the public local provider", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-local-embedding-worker-"));
    const workerScript = path.join(tempDir, "worker.cjs");
    await fs.writeFile(
      workerScript,
      `
process.on("message", (message) => {
  if (message.type === "initialize") {
    if (message.options.local?.nodeLlamaCppImportUrl !== "file:///plugin/node-llama-cpp.js") {
      process.send({ id: message.id, ok: false, error: "missing nodeLlamaCppImportUrl" });
      return;
    }
    process.send({ id: message.id, ok: true });
    return;
  }
  if (message.type === "embedQuery") {
    process.send({ id: message.id, ok: true, value: [1, 0] });
    return;
  }
  if (message.type === "embedBatch") {
    process.send({ id: message.id, ok: true, value: message.texts.map(() => [0, 1]) });
    return;
  }
  process.send({ id: message.id, ok: true });
});
<<<<<<< HEAD

describe("FTS-only fallback when no provider available", () => {
  it("returns null provider when all requested auth paths fail", async () => {
    vi.mocked(authModule.resolveApiKeyForProvider).mockRejectedValue(
      new Error("No API key found for provider"),
=======
`,
      "utf8",
    );
    const provider = await createLocalEmbeddingWorkerProvider(
      {
        config: {} as never,
        provider: "local",
        model: "",
        fallback: "none",
      },
      {
        workerScriptPath: workerScript,
        nodeLlamaCppImportUrl: "file:///plugin/node-llama-cpp.js",
      },
>>>>>>> upstream/main
    );

    await expect(provider.embedQuery("hello")).resolves.toEqual([1, 0]);
    await expect(provider.embedBatch(["a", "b"])).resolves.toEqual([
      [0, 1],
      [0, 1],
    ]);
    await expect(provider.close?.()).resolves.toBeUndefined();
  });

  it("terminates the worker when close runs behind a pending request", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-local-embedding-worker-"));
    const workerScript = path.join(tempDir, "worker.cjs");
    const embedStartedPath = path.join(tempDir, "embed-started");
    await fs.writeFile(
      workerScript,
      `
const fs = require("node:fs");
const embedStartedPath = ${JSON.stringify(embedStartedPath)};
let busy = false;

process.on("message", (message) => {
  if (busy) {
    return;
  }
  if (message.type === "initialize") {
    process.send({ id: message.id, ok: true });
    return;
  }
  if (message.type === "embedQuery") {
    busy = true;
    fs.writeFileSync(embedStartedPath, "1");
  }
});
`,
      "utf8",
    );
    const provider = await createLocalEmbeddingWorkerProvider(
      {
        config: {} as never,
        provider: "local",
        model: "",
        fallback: "none",
      },
      { workerScriptPath: workerScript },
    );

    const embedPromise = provider.embedQuery("stuck");
    const embedError = embedPromise.then(
      () => undefined,
      (err: unknown) => err,
    );
    await expect
      .poll(async () => {
        try {
          await fs.access(embedStartedPath);
          return true;
        } catch {
          return false;
        }
      })
      .toBe(true);

    const closePromise = provider.close?.() ?? Promise.resolve();
    const closeResult = await Promise.race([
      closePromise.then(() => "closed" as const),
      new Promise<"timeout">((resolve) => {
        setTimeout(() => resolve("timeout"), 1_000);
      }),
    ]);

    expect(closeResult).toBe("closed");
    await expect(embedError).resolves.toMatchObject({
      code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
    });
  });

  it("does not pass inline-source or inspector exec args to the file-backed worker", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-local-embedding-worker-"));
    const workerScript = path.join(tempDir, "worker.cjs");
    await fs.writeFile(
      workerScript,
      `
process.on("message", (message) => {
  if (message.type === "initialize" || message.type === "close") {
    process.send({ id: message.id, ok: true });
    return;
  }
  process.send({ id: message.id, ok: true, value: [process.execArgv.length] });
});
`,
      "utf8",
    );
    const originalExecArgv = [...process.execArgv];
    let provider: Awaited<ReturnType<typeof createLocalEmbeddingWorkerProvider>> | undefined;
    try {
      process.execArgv.splice(
        0,
        process.execArgv.length,
        "--eval",
        "setInterval(() => {}, 1000)",
        "--print",
        "1 + 1",
        "--input-type=module",
        "--inspect-brk=127.0.0.1:0",
        "--inspect-port",
        "0",
      );
      provider = await createLocalEmbeddingWorkerProvider(
        {
          config: {} as never,
          provider: "local",
          model: "",
          fallback: "none",
        },
        { workerScriptPath: workerScript },
      );
      await expect(provider.embedQuery("hello")).resolves.toEqual([0]);
    } finally {
      process.execArgv.splice(0, process.execArgv.length, ...originalExecArgv);
      await provider?.close?.();
    }
  });

  it("reports worker initialization failures during provider creation", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-local-embedding-worker-"));
    const workerScript = path.join(tempDir, "worker.cjs");
    await fs.writeFile(
      workerScript,
      `
process.on("message", (message) => {
  process.send({
    id: message.id,
    ok: false,
    error: { message: "Cannot find package 'node-llama-cpp'", code: "ERR_MODULE_NOT_FOUND" },
  });
});
`,
      "utf8",
    );

    try {
      await createLocalEmbeddingWorkerProvider(
        {
          config: {} as never,
          provider: "local",
          model: "",
          fallback: "none",
        },
        { workerScriptPath: workerScript },
      );
      throw new Error("expected local embedding provider creation to fail");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe("Cannot find package 'node-llama-cpp'");
      expect((err as Error & { code?: string }).code).toBe("ERR_MODULE_NOT_FOUND");
    }
  });

  it("reports worker exits with structured failure codes", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-local-embedding-worker-"));
    const workerScript = path.join(tempDir, "worker.cjs");
    await fs.writeFile(
      workerScript,
      `
process.on("message", (message) => {
  if (message.type === "initialize") {
    process.send({ id: message.id, ok: true });
    return;
  }
  process.exit(134);
});
`,
      "utf8",
    );
    const provider = await createLocalEmbeddingWorkerProvider(
      {
        config: {} as never,
        provider: "local",
        model: "",
        fallback: "none",
      },
      { workerScriptPath: workerScript },
    );

    await expect(provider.embedQuery("hello")).rejects.toMatchObject({
      code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
      reason: "exit",
      exitCode: 134,
    });
  });
});
