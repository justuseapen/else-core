// Memory Core tests cover index plugin behavior.
import { mkdirSync, rmSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  clearMemoryEmbeddingProviders as clearRegistry,
  listRegisteredMemoryEmbeddingProviderAdapters as listRegisteredAdapters,
  registerMemoryEmbeddingProvider as registerAdapter,
} from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
import { resolveSessionTranscriptsDirForAgent } from "openclaw/plugin-sdk/memory-core-host-runtime-core";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import "./test-runtime-mocks.js";
import type { MemoryIndexManager } from "./index.js";
import { closeAllMemorySearchManagers, getMemorySearchManager } from "./index.js";
import { splitSourceWideEmbeddingChunks } from "./manager-embedding-ops.js";
import { LOCAL_EMBEDDING_WORKER_ERROR_CODES } from "./manager-local-worker-errors.js";
import type { MemoryIndexMeta } from "./manager-reindex-state.js";
import { closeMemoryIndexManagersForAgent, EMBEDDING_PROBE_CACHE_TTL_MS } from "./manager.js";
import { registerBuiltInMemoryEmbeddingProviders } from "./provider-adapters.js";

// This suite performs real sqlite/media indexing and can exceed the global
// timeout when it shares a packed CI extension shard.
vi.setConfig({ testTimeout: 240_000 });

afterAll(() => {
  vi.resetConfig();
});

let embedBatchCalls = 0;
let embedBatchInputCalls = 0;
let providerRuntimeBatchCalls: string[][] = [];
let providerRuntimeBatchGate: Promise<void> | null = null;
let providerRuntimeBatchFailuresRemaining = 0;
let providerRuntimeActiveBatchCalls = 0;
let providerRuntimeMaxActiveBatchCalls = 0;
let providerCloseCalls = 0;
let providerCloseFailuresRemaining = 0;
let providerCloseGate: Promise<void> | null = null;
let providerInitGate: Promise<void> | null = null;
let providerCalls: Array<{ provider?: string; model?: string; outputDimensionality?: number }> = [];
let forceNoProvider = false;
<<<<<<< HEAD
=======

function createLocalWorkerExitError(): Error {
  return Object.assign(new Error("Local embedding worker exited unexpectedly (exit code 134)"), {
    code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
    reason: "exit",
    exitCode: 134,
  });
}
>>>>>>> upstream/main

vi.mock("./embeddings.js", () => {
  const embedText = (text: string) => {
    const lower = text.toLowerCase();
    const alpha = lower.split("alpha").length - 1;
    const beta = lower.split("beta").length - 1;
    const image = lower.split("image").length - 1;
    const audio = lower.split("audio").length - 1;
    return [alpha, beta, image, audio];
  };
  return {
    resolveEmbeddingProviderFallbackModel: (providerId: string, fallbackSourceModel: string) =>
      providerId === "gemini" || providerId === "fallback-provider"
        ? `${providerId}-embed`
        : fallbackSourceModel,
    resolveEmbeddingProviderAdapterId: (
      providerId: string,
      config?: {
        models?: {
          providers?: Record<string, { api?: string; baseUrl?: string; models?: unknown[] }>;
        };
      },
    ) => config?.models?.providers?.[providerId]?.api ?? providerId,
    resolveEmbeddingProviderAdapterTransport: (providerId: string) =>
      providerId === "local" ? "local" : "remote",
    createEmbeddingProvider: async (options: {
      provider?: string;
      model?: string;
      outputDimensionality?: number;
    }) => {
      providerCalls.push({
        provider: options.provider,
        model: options.model,
        outputDimensionality: options.outputDimensionality,
      });
<<<<<<< HEAD
=======
      await providerInitGate;
>>>>>>> upstream/main
      if (forceNoProvider) {
        return {
          provider: null,
          requestedProvider: options.provider ?? "auto",
          providerUnavailableReason: "No API key found for provider",
        };
      }
<<<<<<< HEAD
      const providerId = options.provider === "gemini" ? "gemini" : "mock";
=======
      const providerId =
        options.provider === "gemini" ||
        options.provider === "fallback-provider" ||
        options.provider === "batch-test" ||
        options.provider === "batch-wide-test" ||
        options.provider === "ollama"
          ? options.provider
          : "mock";
>>>>>>> upstream/main
      const model = options.model ?? "mock-embed";
      return {
        requestedProvider: options.provider ?? "openai",
        provider: {
          id: providerId,
          model,
          close: async () => {
            providerCloseCalls += 1;
            await providerCloseGate;
            if (providerCloseFailuresRemaining > 0) {
              providerCloseFailuresRemaining -= 1;
              throw new Error("provider close failed");
            }
          },
          embedQuery: async (text: string) => embedText(text),
          embedBatch: async (texts: string[]) => {
            embedBatchCalls += 1;
            return texts.map(embedText);
          },
          ...(providerId === "gemini" || providerId === "fallback-provider"
            ? {
                embedBatchInputs: async (
                  inputs: Array<{
                    text: string;
                    parts?: Array<
                      | { type: "text"; text: string }
                      | { type: "inline-data"; mimeType: string; data: string }
                    >;
                  }>,
                ) => {
                  embedBatchInputCalls += 1;
                  return inputs.map((input) => {
                    const inlineData = input.parts?.find((part) => part.type === "inline-data");
                    if (inlineData?.type === "inline-data" && inlineData.data.length > 9000) {
                      throw new Error("payload too large");
                    }
                    const mimeType =
                      inlineData?.type === "inline-data" ? inlineData.mimeType : undefined;
                    if (mimeType?.startsWith("image/")) {
                      return [0, 0, 1, 0];
                    }
                    if (mimeType?.startsWith("audio/")) {
                      return [0, 0, 0, 1];
                    }
                    return embedText(input.text);
                  });
                },
              }
            : {}),
        },
        ...(providerId === "batch-test" || providerId === "batch-wide-test"
          ? {
              runtime: {
                id: providerId,
                ...(providerId === "batch-wide-test" ? { sourceWideBatchEmbed: true } : {}),
                batchEmbed: async (batch: { chunks: Array<{ text: string }> }) => {
                  providerRuntimeActiveBatchCalls += 1;
                  providerRuntimeMaxActiveBatchCalls = Math.max(
                    providerRuntimeMaxActiveBatchCalls,
                    providerRuntimeActiveBatchCalls,
                  );
                  try {
                    await providerRuntimeBatchGate;
                    providerRuntimeBatchCalls.push(batch.chunks.map((chunk) => chunk.text));
                    if (providerRuntimeBatchFailuresRemaining > 0) {
                      providerRuntimeBatchFailuresRemaining -= 1;
                      throw new Error("provider runtime batch failed");
                    }
                    return batch.chunks.map((chunk) => embedText(chunk.text));
                  } finally {
                    providerRuntimeActiveBatchCalls -= 1;
                  }
                },
              },
            }
          : providerId === "gemini" || providerId === "fallback-provider"
            ? {
                runtime: {
                  id: providerId,
                  cacheKeyData: {
                    provider: providerId,
                    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
                    model,
                    outputDimensionality: options.outputDimensionality,
                    headers: [],
                  },
                },
              }
            : {}),
      };
    },
  };
});

describe("memory embedding provider registration", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearRegistry();
  });

  it("does not register a built-in local embedding provider", () => {
    clearRegistry();
    registerBuiltInMemoryEmbeddingProviders({ registerMemoryEmbeddingProvider: registerAdapter });

    const adapter = listRegisteredAdapters().find((entry) => entry.id === "local");

    expect(adapter).toBeUndefined();
  });
});

describe("memory index", () => {
  let fixtureRoot = "";
  let workspaceDir = "";
  let memoryDir = "";
  let indexVectorPath = "";
  let indexMainPath = "";
  let indexMultimodalPath = "";
<<<<<<< HEAD
  let indexStatusPath = "";
  let indexSourceChangePath = "";
  let indexModelPath = "";
  let indexFtsOnlyPath = "";
  let sourceChangeStateDir = "";
  const sourceChangeSessionLogLines = [
    JSON.stringify({
      type: "message",
      message: {
        role: "user",
        content: [{ type: "text", text: "session change test user line" }],
      },
    }),
    JSON.stringify({
      type: "message",
      message: {
        role: "assistant",
        content: [{ type: "text", text: "session change test assistant line" }],
      },
    }),
  ].join("\n");
=======
>>>>>>> upstream/main

  const managersForCleanup = new Set<MemoryIndexManager>();

  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-mem-fixtures-"));
    workspaceDir = path.join(fixtureRoot, "workspace");
    memoryDir = path.join(workspaceDir, "memory");
    indexMainPath = path.join(workspaceDir, "index-main.sqlite");
    indexVectorPath = path.join(workspaceDir, "index-vector.sqlite");
    indexMultimodalPath = path.join(workspaceDir, "index-multimodal.sqlite");
<<<<<<< HEAD
    indexStatusPath = path.join(workspaceDir, "index-status.sqlite");
    indexSourceChangePath = path.join(workspaceDir, "index-source-change.sqlite");
    indexModelPath = path.join(workspaceDir, "index-model-change.sqlite");
    indexFtsOnlyPath = path.join(workspaceDir, "index-fts-only.sqlite");
    sourceChangeStateDir = path.join(fixtureRoot, "state-source-change");

    await fs.mkdir(memoryDir, { recursive: true });
    await fs.writeFile(
      path.join(memoryDir, "2026-01-12.md"),
      "# Log\nAlpha memory line.\nZebra memory line.",
    );
=======
>>>>>>> upstream/main
  });

  afterAll(async () => {
    await Promise.all(Array.from(managersForCleanup).map((manager) => manager.close()));
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  });

  afterEach(async () => {
    vi.useRealTimers();
    await Promise.all(Array.from(managersForCleanup).map((manager) => manager.close()));
    await closeAllMemorySearchManagers();
    clearRegistry();
    managersForCleanup.clear();
  });

  beforeEach(async () => {
    vi.useRealTimers();
    // Perf: most suites don't need atomic swap behavior for full reindexes.
    // Keep atomic reindex tests on the safe path.
    vi.stubEnv("OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX", "1");
    clearRegistry();
    registerBuiltInMemoryEmbeddingProviders({ registerMemoryEmbeddingProvider: registerAdapter });
    embedBatchCalls = 0;
    embedBatchInputCalls = 0;
    providerRuntimeBatchCalls = [];
    providerRuntimeBatchGate = null;
    providerRuntimeBatchFailuresRemaining = 0;
    providerRuntimeActiveBatchCalls = 0;
    providerRuntimeMaxActiveBatchCalls = 0;
    providerCloseCalls = 0;
    providerCloseFailuresRemaining = 0;
    providerCloseGate = null;
    providerInitGate = null;
    providerCalls = [];
    forceNoProvider = false;

    rmSync(workspaceDir, { recursive: true, force: true });
    mkdirSync(memoryDir, { recursive: true });
    await fs.writeFile(
      path.join(memoryDir, "2026-01-12.md"),
      "# Log\nAlpha memory line.\nZebra memory line.",
    );
  });

  function resetManagerForTest(manager: MemoryIndexManager) {
    // These tests reuse managers for performance. Clear the index + embedding
    // cache to keep each test fully isolated.
    const db = (
      manager as unknown as {
        db: {
          exec: (sql: string) => void;
          prepare: (sql: string) => { get: (name: string) => { name?: string } | undefined };
        };
      }
    ).db;
    (manager as unknown as { resetIndex: () => void }).resetIndex();
    const embeddingCacheTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get("embedding_cache");
    if (embeddingCacheTable?.name === "embedding_cache") {
      db.exec("DELETE FROM embedding_cache");
    }
    (manager as unknown as { dirty: boolean }).dirty = true;
    (manager as unknown as { sessionsDirty: boolean }).sessionsDirty = false;
  }

  type TestCfg = Parameters<typeof getMemorySearchManager>[0]["cfg"];

  function createCfg(params: {
    storePath: string;
    extraPaths?: string[];
    sources?: Array<"memory" | "sessions">;
    sessionMemory?: boolean;
    provider?: string;
    fallback?: "none" | "gemini" | "fallback-provider";
    providerAliases?: NonNullable<NonNullable<TestCfg["models"]>["providers"]>;
    batchEnabled?: boolean;
    model?: string;
    outputDimensionality?: number;
    multimodal?: {
      enabled?: boolean;
      modalities?: Array<"image" | "audio" | "all">;
      maxFileBytes?: number;
    };
    vectorEnabled?: boolean;
    cacheEnabled?: boolean;
    minScore?: number;
    onSearch?: boolean;
    hybrid?: { enabled: boolean; vectorWeight?: number; textWeight?: number };
  }): TestCfg {
    return {
      agents: {
        defaults: {
          workspace: workspaceDir,
          memorySearch: {
            ...(params.provider !== undefined ? { provider: params.provider } : {}),
            model: params.model ?? "mock-embed",
            fallback: params.fallback,
            outputDimensionality: params.outputDimensionality,
            store: { path: params.storePath, vector: { enabled: params.vectorEnabled ?? false } },
            // Perf: keep test indexes to a single chunk to reduce sqlite work.
            chunking: { tokens: 4000, overlap: 0 },
            sync: { watch: false, onSessionStart: false, onSearch: params.onSearch ?? true },
            remote: params.batchEnabled
              ? {
                  nonBatchConcurrency: 1,
                  batch: { enabled: true, pollIntervalMs: 0, timeoutMinutes: 1 },
                }
              : undefined,
            query: {
              minScore: params.minScore ?? 0,
              hybrid: params.hybrid ?? { enabled: false },
            },
            cache: params.cacheEnabled ? { enabled: true } : undefined,
            extraPaths: params.extraPaths,
            multimodal: params.multimodal,
            sources: params.sources,
            experimental: { sessionMemory: params.sessionMemory ?? false },
          },
        },
        list: [{ id: "main", default: true }],
      },
      models: params.providerAliases ? { providers: params.providerAliases } : undefined,
    };
  }

  function requireManager(
    result: Awaited<ReturnType<typeof getMemorySearchManager>>,
    missingMessage = "manager missing",
  ): MemoryIndexManager {
    if (!result.manager) {
      throw new Error(missingMessage);
    }
    return result.manager as unknown as MemoryIndexManager;
  }

  async function getPersistentManager(cfg: TestCfg): Promise<MemoryIndexManager> {
    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);
    resetManagerForTest(manager);
    return manager;
  }

  async function getFreshManager(
    cfg: TestCfg,
    purpose?: "default" | "status" | "cli",
  ): Promise<MemoryIndexManager> {
    const { getRequiredMemoryIndexManager } = await import("./test-manager-helpers.js");
    return await getRequiredMemoryIndexManager({ cfg, agentId: "main", purpose });
  }

  async function expectHybridKeywordSearchFindsMemory(cfg: TestCfg) {
    const manager = await getFreshManager(cfg);
    try {
      const status = manager.status();
      if (!status.fts?.available) {
        return;
      }

      await manager.sync({ reason: "test" });
      const results = await manager.search("zebra");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.path).toContain("memory/2026-01-12.md");
    } finally {
      await manager.close?.();
    }
  }

  it("does not prepare vector deletes after unsafe reset drops a missing vector table", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-vector-missing-table.sqlite"),
      vectorEnabled: true,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);
    managersForCleanup.add(manager);
    type VectorState = { available: boolean | null; dims?: number };
    const vector = Reflect.get(manager, "vector") as VectorState;
    vector.available = true;
    vector.dims = 4;
    Reflect.set(manager, "vectorReady", Promise.resolve(true));

    await expect(
      Reflect.apply(Reflect.get(manager, "runUnsafeReindex"), manager, [
        { reason: "test", force: true },
      ]),
    ).resolves.toBeUndefined();
  });

  async function getFtsSessionManager(params: {
    stateDirName: string;
    storeFileName: string;
  }): Promise<MemoryIndexManager | null> {
    forceNoProvider = true;
    vi.stubEnv("OPENCLAW_STATE_DIR", path.join(workspaceDir, params.stateDirName));
    const cfg = createCfg({
      storePath: path.join(workspaceDir, params.storeFileName),
      sources: ["memory", "sessions"],
      sessionMemory: true,
      minScore: 0,
      hybrid: { enabled: true, vectorWeight: 0.7, textWeight: 0.3 },
    });
    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);
    resetManagerForTest(manager);
    return manager.status().fts?.available ? manager : null;
  }

  it("indexes memory files and searches", async () => {
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });
      const results = await manager.search("alpha");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.path).toContain("memory/2026-01-12.md");
      const status = manager.status();
      expect(status.sourceCounts).toStrictEqual([
        {
          source: "memory",
          files: status.files,
          chunks: status.chunks,
        },
      ]);
    } finally {
      await manager.close?.();
    }
  });

  it("batches dirty memory chunks across files", async () => {
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
    await fs.writeFile(path.join(memoryDir, "2026-01-14.md"), "# Log\nGamma memory line.");
    const cfg = createCfg({
      provider: "batch-wide-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-cross-file-batch.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });

      expect(providerRuntimeBatchCalls).toHaveLength(1);
      expect(providerRuntimeBatchCalls[0]).toEqual([
        "# Log\nAlpha memory line.\nZebra memory line.",
        "# Log\nBeta memory line.",
        "# Log\nGamma memory line.",
      ]);
    } finally {
      await manager.close?.();
    }
  });

  it("maps source-wide batch fallback results to missing chunks after cache hits", async () => {
    const cfg = createCfg({
      provider: "batch-wide-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-cross-file-batch-fallback-cache.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });

      await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
      providerRuntimeBatchCalls = [];
      providerRuntimeBatchFailuresRemaining = 1;
      embedBatchCalls = 0;

      await manager.sync({ reason: "test", force: true });

      expect(providerRuntimeBatchCalls).toEqual([["# Log\nBeta memory line."]]);
      expect(embedBatchCalls).toBe(1);
      const betaRow = (
        manager as unknown as {
          db: { prepare: (sql: string) => { get: (...args: unknown[]) => unknown } };
        }
      ).db
        .prepare("SELECT embedding FROM chunks WHERE path LIKE ? AND source = ?")
        .get("%2026-01-13.md", "memory") as { embedding: string } | undefined;

      expect(betaRow).toBeDefined();
      expect(JSON.parse(betaRow?.embedding ?? "[]")).toEqual([0, 1, 0, 0]);
    } finally {
      await manager.close?.();
    }
  });

  it("splits oversized source-wide embedding requests at the request cap", () => {
    expect(splitSourceWideEmbeddingChunks(["one", "two", "three", "four", "five"], 2)).toEqual([
      ["one", "two"],
      ["three", "four"],
      ["five"],
    ]);
  });

  it("keeps split chunks from oversized files in one source-wide batch", async () => {
    await fs.writeFile(
      path.join(memoryDir, "2026-01-13.md"),
      `# Log\n${"Long split memory line. ".repeat(1200)}`,
    );
    await fs.writeFile(path.join(memoryDir, "2026-01-14.md"), "# Log\nBeta memory line.");
    const cfg = createCfg({
      provider: "batch-wide-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-split-chunks-cross-file-batch.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });

      expect(providerRuntimeBatchCalls).toHaveLength(1);
      const combinedBatch = providerRuntimeBatchCalls[0] ?? [];
      expect(combinedBatch.length).toBeGreaterThan(3);
      expect(combinedBatch.join("\n")).toContain("Long split memory line.");
      expect(combinedBatch).toContain("# Log\nBeta memory line.");
    } finally {
      await manager.close?.();
    }
  });

  it("keeps custom batch runtimes per file without source-wide opt in", async () => {
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
    await fs.writeFile(path.join(memoryDir, "2026-01-14.md"), "# Log\nGamma memory line.");
    const cfg = createCfg({
      provider: "batch-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-custom-batch-compat.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });

      expect(providerRuntimeBatchCalls).toHaveLength(3);
      expect(providerRuntimeBatchCalls.every((call) => call.length === 1)).toBe(true);
      expect(providerRuntimeBatchCalls.map((call) => call[0]).toSorted()).toEqual(
        [
          "# Log\nAlpha memory line.\nZebra memory line.",
          "# Log\nBeta memory line.",
          "# Log\nGamma memory line.",
        ].toSorted(),
      );
    } finally {
      await manager.close?.();
    }
  });

  it("keeps custom batch runtimes concurrent without source-wide opt in", async () => {
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
    await fs.writeFile(path.join(memoryDir, "2026-01-14.md"), "# Log\nGamma memory line.");
    const cfg = createCfg({
      provider: "batch-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-custom-batch-concurrency.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    let releaseBatchGate: (() => void) | undefined;
    providerRuntimeBatchGate = new Promise((resolve) => {
      releaseBatchGate = resolve;
    });
    const syncPromise = manager.sync({ reason: "test" });
    let waitError: Error | undefined;
    try {
      await vi.waitFor(() => expect(providerRuntimeMaxActiveBatchCalls).toBeGreaterThan(1));
    } catch (err) {
      waitError = err instanceof Error ? err : new Error(String(err));
    } finally {
      releaseBatchGate?.();
      await syncPromise;
      await manager.close?.();
    }
    if (waitError) {
      throw waitError;
    }
  });

  it("bounds source-wide memory batches", async () => {
    const batchFileLimit = 2048;
    for (let index = 0; index < batchFileLimit; index += 1) {
      await fs.writeFile(
        path.join(memoryDir, `2026-02-${String(index + 1).padStart(4, "0")}.md`),
        `# Log\nBounded memory line ${index}.`,
      );
    }
    const cfg = createCfg({
      provider: "batch-wide-test",
      batchEnabled: true,
      storePath: path.join(workspaceDir, "index-bounded-cross-file-batch.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test" });

      expect(providerRuntimeBatchCalls).toHaveLength(2);
      expect(providerRuntimeBatchCalls[0]).toHaveLength(batchFileLimit);
      expect(providerRuntimeBatchCalls[1]).toHaveLength(1);
      expect(providerRuntimeBatchCalls.flat()).toHaveLength(batchFileLimit + 1);
    } finally {
      await manager.close?.();
    }
  });

  it("batches forced memory and session indexing across files", async () => {
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
    const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
    await fs.mkdir(sessionsDir, { recursive: true });
    await fs.writeFile(
      path.join(sessionsDir, "session-alpha.jsonl"),
      [
        JSON.stringify({
          type: "session",
          id: "session-alpha",
          timestamp: "2026-04-07T15:24:04.113Z",
        }),
        JSON.stringify({
          type: "message",
          message: {
            role: "user",
            timestamp: "2026-04-07T15:25:04.113Z",
            content: [{ type: "text", text: "Session alpha memory line." }],
          },
        }),
      ].join("\n") + "\n",
      "utf8",
    );
    await fs.writeFile(
      path.join(sessionsDir, "session-beta.jsonl"),
      [
        JSON.stringify({
          type: "session",
          id: "session-beta",
          timestamp: "2026-04-07T15:24:04.113Z",
        }),
        JSON.stringify({
          type: "message",
          message: {
            role: "assistant",
            timestamp: "2026-04-07T15:25:04.113Z",
            content: [{ type: "text", text: "Session beta memory line." }],
          },
        }),
      ].join("\n") + "\n",
      "utf8",
    );
    const cfg = createCfg({
      provider: "batch-wide-test",
      batchEnabled: true,
      sources: ["memory", "sessions"],
      sessionMemory: true,
      storePath: path.join(workspaceDir, "index-force-cross-source-batch.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "cli", force: true });

      expect(providerRuntimeBatchCalls).toHaveLength(1);
      const combinedBatch = providerRuntimeBatchCalls[0] ?? [];
      expect(combinedBatch.slice(0, 2)).toEqual([
        "# Log\nAlpha memory line.\nZebra memory line.",
        "# Log\nBeta memory line.",
      ]);
      expect(combinedBatch.join("\n")).toContain("Session alpha memory line.");
      expect(combinedBatch.join("\n")).toContain("Session beta memory line.");
    } finally {
      await manager.close?.();
    }
  });

  it("does not full-reindex on search when existing metadata belongs to another provider", async () => {
    const dbPath = path.join(workspaceDir, "index-provider-cutover.sqlite");
    const oldCfg = createCfg({
      storePath: dbPath,
      model: "old-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const oldManager = await getFreshManager(oldCfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();

    const nextCfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      model: "new-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const nextManager = await getFreshManager(nextCfg);
    try {
      expect(nextManager.status().dirty).toBe(true);
      expect(nextManager.status().custom?.indexIdentity).toEqual({
        status: "mismatched",
        reason: "index was built for model old-embed, expected new-embed",
      });
      embedBatchCalls = 0;

      const results = await nextManager.search("alpha");

      expect(results).toStrictEqual([]);
      expect(embedBatchCalls).toBe(0);
      expect(nextManager.status().dirty).toBe(true);

      await fs.writeFile(
        path.join(memoryDir, "2026-01-12.md"),
        "# Log\nAlpha memory line changed.\nZebra memory line.",
      );
      await nextManager.sync({ reason: "watch" });

      expect(embedBatchCalls).toBe(0);
      const stillPausedResults = await nextManager.search("alpha");
      expect(stillPausedResults).toStrictEqual([]);
      expect(nextManager.status().dirty).toBe(true);
      expect(nextManager.status().custom?.indexIdentity).toEqual({
        status: "mismatched",
        reason: "index was built for model old-embed, expected new-embed",
      });
    } finally {
      await nextManager.close?.();
    }
  });

  it("keeps status clean when configured provider alias resolves to indexed adapter", async () => {
    const dbPath = path.join(workspaceDir, "index-provider-alias-status.sqlite");
    const oldCfg = createCfg({
      storePath: dbPath,
      provider: "ollama",
      model: "ollama-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const oldManager = await getFreshManager(oldCfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();

    const aliasCfg = createCfg({
      storePath: dbPath,
      provider: "ollama-west",
      providerAliases: {
        "ollama-west": {
          api: "ollama",
          baseUrl: "http://127.0.0.1:11434",
          models: [],
        },
      },
      model: "ollama-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const statusManager = await getFreshManager(aliasCfg, "status");
    try {
      const status = statusManager.status();

      expect(status.dirty).toBe(false);
      expect(status.custom?.indexIdentity).toEqual({ status: "valid" });
    } finally {
      await statusManager.close?.();
    }
  });

  it("keeps status clean when configured model defaults to the adapter model (#90413)", async () => {
    const dbPath = path.join(workspaceDir, "index-default-model-status.sqlite");
    // Index under the provider's resolved default model, as provider init does.
    const indexCfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      model: "gemini-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const indexManager = await getFreshManager(indexCfg);
    await indexManager.sync({ reason: "test", force: true });
    await indexManager.close?.();

    // Plain status path before provider init: settings.model is the empty
    // default, so identity must resolve the adapter model instead of comparing
    // meta against a blank "expected" model.
    const statusCfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      model: "",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const statusManager = await getFreshManager(statusCfg, "status");
    try {
      const status = statusManager.status();

      expect(status.dirty).toBe(false);
      expect(status.custom?.indexIdentity).toEqual({ status: "valid" });
    } finally {
      await statusManager.close?.();
    }
  });

  it("rebuilds missing metadata with existing chunks on gateway sync", async () => {
    const dbPath = path.join(workspaceDir, "index-missing-meta-cutover.sqlite");
    const cfg = createCfg({
      storePath: dbPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "# Log\nBeta memory line.");
    const oldManager = await getFreshManager(cfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();
    await fs.rm(path.join(memoryDir, "2026-01-12.md"));

    const nextManager = await getFreshManager(cfg);
    try {
      (
        nextManager as unknown as {
          db: { exec: (sql: string) => void };
        }
      ).db.exec(`DELETE FROM meta WHERE key = 'memory_index_meta_v1'`);
      expect(nextManager.status().custom?.indexIdentity).toEqual({
        status: "missing",
        reason: "index metadata is missing",
      });

      const results = await nextManager.search("alpha");

      expect(results).toStrictEqual([]);
      expect(nextManager.status().dirty).toBe(true);
      expect(nextManager.status().custom?.indexIdentity).toEqual({
        status: "missing",
        reason: "index metadata is missing",
      });

      vi.stubEnv("OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX", "0");
      await nextManager.sync({ reason: "test" });

      expect(nextManager.status().dirty).toBe(false);
      expect(nextManager.status().custom?.indexIdentity).toEqual({ status: "valid" });
      const repairedAlphaResults = await nextManager.search("alpha");
      expect(
        repairedAlphaResults.some((result) => result.path.endsWith("memory/2026-01-12.md")),
      ).toBe(false);
      const repairedResults = await nextManager.search("beta");
      expect(repairedResults.length).toBeGreaterThan(0);
      expect(repairedResults[0]?.path).toContain("memory/2026-01-13.md");
    } finally {
      await nextManager.close?.();
    }
  });

  it("does not search stale provider rows after embeddings become unavailable", async () => {
    const dbPath = path.join(workspaceDir, "index-provider-unavailable-cutover.sqlite");
    const oldCfg = createCfg({
      storePath: dbPath,
      model: "semantic-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const oldManager = await getFreshManager(oldCfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();

    forceNoProvider = true;
    const nextManager = await getFreshManager(oldCfg);
    try {
      const results = await nextManager.search("alpha");

      expect(results).toStrictEqual([]);
      expect(nextManager.status().dirty).toBe(true);
      expect(nextManager.status().custom?.indexIdentity).toMatchObject({
        status: "mismatched",
      });
    } finally {
      await nextManager.close?.();
    }
  });

  it("does not rebuild missing semantic metadata when embeddings are unavailable", async () => {
    const dbPath = path.join(workspaceDir, "index-missing-meta-provider-unavailable.sqlite");
    const oldCfg = createCfg({
      storePath: dbPath,
      model: "semantic-embed",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const oldManager = await getFreshManager(oldCfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();

    forceNoProvider = true;
    const nextManager = await getFreshManager(oldCfg);
    try {
      const db = (
        nextManager as unknown as {
          db: {
            exec: (sql: string) => void;
            prepare: (sql: string) => {
              get: () => { model?: string } | undefined;
            };
          };
        }
      ).db;
      db.exec(`DELETE FROM meta WHERE key = 'memory_index_meta_v1'`);

      await nextManager.sync({ reason: "test" });

      expect(nextManager.status().dirty).toBe(true);
      expect(nextManager.status().custom?.indexIdentity).toEqual({
        status: "missing",
        reason: "index metadata is missing",
      });
      const row = db.prepare("SELECT model FROM chunks LIMIT 1").get();
      expect(row?.model).toBe("semantic-embed");
    } finally {
      await nextManager.close?.();
    }
  });

  it("clears dirty after sessions-only identity reindex", async () => {
    try {
      vi.stubEnv("OPENCLAW_STATE_DIR", path.join(workspaceDir, ".state-sessions-only-reindex"));
      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      await fs.writeFile(
        path.join(sessionsDir, "session-identity.jsonl"),
        [
          JSON.stringify({
            type: "session",
            id: "session-identity",
            timestamp: "2026-04-07T15:24:04.113Z",
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: "2026-04-07T15:25:04.113Z",
              content: [{ type: "text", text: "Session-only identity marker." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      const dbPath = path.join(workspaceDir, "index-sessions-only-cutover.sqlite");
      const oldCfg = createCfg({
        storePath: dbPath,
        sources: ["sessions"],
        sessionMemory: true,
        model: "old-embed",
      });
      const oldManager = await getFreshManager(oldCfg);
      await oldManager.sync({ reason: "test", force: true });
      await oldManager.close?.();

      const nextCfg = createCfg({
        storePath: dbPath,
        sources: ["sessions"],
        sessionMemory: true,
        provider: "gemini",
        model: "new-embed",
      });
      const nextManager = await getFreshManager(nextCfg);
      try {
        expect(nextManager.status().dirty).toBe(true);

        await nextManager.sync({ reason: "test", force: true });

        expect(nextManager.status().dirty).toBe(false);
        expect(nextManager.status().custom?.indexIdentity).toEqual({ status: "valid" });
      } finally {
        await nextManager.close?.();
      }
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("marks sessions-only indexes dirty when metadata is missing but chunks exist", async () => {
    try {
      vi.stubEnv("OPENCLAW_STATE_DIR", path.join(workspaceDir, ".state-sessions-missing-meta"));
      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      await fs.writeFile(
        path.join(sessionsDir, "session-missing-meta.jsonl"),
        [
          JSON.stringify({
            type: "session",
            id: "session-missing-meta",
            timestamp: "2026-04-07T15:24:04.113Z",
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: "2026-04-07T15:25:04.113Z",
              content: [{ type: "text", text: "Sessions missing metadata marker." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      const dbPath = path.join(workspaceDir, "index-sessions-missing-meta.sqlite");
      const cfg = createCfg({
        storePath: dbPath,
        sources: ["sessions"],
        sessionMemory: true,
      });
      const oldManager = await getFreshManager(cfg);
      await oldManager.sync({ reason: "test", force: true });
      await oldManager.close?.();

      const nextManager = await getFreshManager(cfg);
      try {
        (
          nextManager as unknown as {
            db: { exec: (sql: string) => void };
          }
        ).db.exec(`DELETE FROM meta WHERE key = 'memory_index_meta_v1'`);

        const status = nextManager.status();

        expect(status.dirty).toBe(true);
        expect(status.custom?.indexIdentity).toEqual({
          status: "missing",
          reason: "index metadata is missing",
        });
      } finally {
        await nextManager.close?.();
      }
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("keeps provider cutover vector search paused during targeted session sync", async () => {
    try {
      vi.stubEnv("OPENCLAW_STATE_DIR", path.join(workspaceDir, ".state-targeted-cutover"));
      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      const sessionFile = path.join(sessionsDir, "session-targeted-cutover.jsonl");
      await fs.writeFile(
        sessionFile,
        [
          JSON.stringify({
            type: "session",
            id: "session-targeted-cutover",
            timestamp: "2026-04-07T15:24:04.113Z",
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: "2026-04-07T15:25:04.113Z",
              content: [{ type: "text", text: "Targeted cutover marker." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      const dbPath = path.join(workspaceDir, "index-targeted-session-cutover.sqlite");
      const oldCfg = createCfg({
        storePath: dbPath,
        sources: ["memory", "sessions"],
        sessionMemory: true,
        model: "old-embed",
      });
      const oldManager = await getFreshManager(oldCfg);
      await oldManager.sync({ reason: "test", force: true });
      await oldManager.close?.();

      const nextCfg = createCfg({
        storePath: dbPath,
        sources: ["memory", "sessions"],
        sessionMemory: true,
        provider: "gemini",
        model: "new-embed",
      });
      const nextManager = await getFreshManager(nextCfg);
      try {
        expect(nextManager.status().dirty).toBe(true);
        embedBatchCalls = 0;

        await nextManager.sync({ reason: "test", sessionFiles: [sessionFile] });

        expect(embedBatchCalls).toBe(0);
        expect(nextManager.status().dirty).toBe(true);
        expect(nextManager.status().custom?.indexIdentity).toEqual({
          status: "mismatched",
          reason: "index was built for model old-embed, expected new-embed",
        });
        const results = await nextManager.search("alpha");
        expect(results).toStrictEqual([]);
      } finally {
        await nextManager.close?.();
      }
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("preserves memory dirty events raised during session identity reindex", async () => {
    try {
      vi.stubEnv("OPENCLAW_STATE_DIR", path.join(workspaceDir, ".state-dirty-during-session"));
      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      await fs.writeFile(
        path.join(sessionsDir, "session-dirty-during-reindex.jsonl"),
        [
          JSON.stringify({
            type: "session",
            id: "session-dirty-during-reindex",
            timestamp: "2026-04-07T15:24:04.113Z",
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: "2026-04-07T15:25:04.113Z",
              content: [{ type: "text", text: "Dirty during session marker." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      const dbPath = path.join(workspaceDir, "index-dirty-during-session.sqlite");
      const oldCfg = createCfg({
        storePath: dbPath,
        sources: ["memory", "sessions"],
        sessionMemory: true,
        model: "old-embed",
      });
      const oldManager = await getFreshManager(oldCfg);
      await oldManager.sync({ reason: "test", force: true });
      await oldManager.close?.();

      const nextCfg = createCfg({
        storePath: dbPath,
        sources: ["memory", "sessions"],
        sessionMemory: true,
        provider: "gemini",
        model: "new-embed",
      });
      const nextManager = await getFreshManager(nextCfg);
      try {
        const fields = nextManager as unknown as {
          dirty: boolean;
          syncSessionFiles: (params: unknown) => Promise<void>;
        };
        const syncSessionFiles = fields.syncSessionFiles.bind(nextManager);
        fields.syncSessionFiles = async (params) => {
          fields.dirty = true;
          await syncSessionFiles(params);
        };

        await nextManager.sync({ reason: "test", force: true });

        expect(nextManager.status().dirty).toBe(true);
        expect(nextManager.status().custom?.indexIdentity).toEqual({ status: "valid" });
      } finally {
        await nextManager.close?.();
      }
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("closes embedding providers when memory index managers close", async () => {
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);

    await manager.probeEmbeddingAvailability();
    expect(providerCloseCalls).toBe(0);

    await manager.close();
    await manager.close();

    expect(providerCloseCalls).toBe(1);
  });

  it("waits for pending sync before closing embedding providers", async () => {
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);
    await manager.probeEmbeddingAvailability();
    let resolveSync: () => void = () => {};
    (manager as unknown as { syncing: Promise<void> }).syncing = new Promise<void>((resolve) => {
      resolveSync = resolve;
    });

    const closePromise = manager.close();
    try {
      await Promise.resolve();
      expect(providerCloseCalls).toBe(0);

      let closeSettled = false;
      void closePromise.then(() => {
        closeSettled = true;
      });
      await Promise.resolve();

      expect(closeSettled).toBe(false);
    } finally {
      resolveSync();
    }
    await closePromise;
    expect(providerCloseCalls).toBe(1);
  });

  it("waits for sync that attaches after provider initialization before closing providers", async () => {
    let releaseProviderInit: () => void = () => {};
    providerInitGate = new Promise<void>((resolve) => {
      releaseProviderInit = resolve;
    });
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);
    let releaseSync: () => void = () => {};
    const syncStarted = new Promise<void>((resolve) => {
      const originalRunSyncWithReadonlyRecovery = (
        manager as unknown as {
          runSyncWithReadonlyRecovery: (params?: {
            reason?: string;
            force?: boolean;
            sessionFiles?: string[];
            progress?: (update: unknown) => void;
          }) => Promise<void>;
        }
      ).runSyncWithReadonlyRecovery.bind(manager);
      (
        manager as unknown as {
          runSyncWithReadonlyRecovery: typeof originalRunSyncWithReadonlyRecovery;
        }
      ).runSyncWithReadonlyRecovery = async (params) => {
        resolve();
        await new Promise<void>((syncResolve) => {
          releaseSync = syncResolve;
        });
        await originalRunSyncWithReadonlyRecovery(params);
      };
    });

    const syncPromise = manager.sync({ reason: "test" });
    await vi.waitFor(() => {
      expect(providerCalls).toHaveLength(1);
    });

    const closePromise = manager.close();
    try {
      releaseProviderInit();
      await syncStarted;
      await Promise.resolve();

      expect(providerCloseCalls).toBe(0);
    } finally {
      releaseSync();
    }
    await syncPromise;
    await closePromise;
    expect(providerCloseCalls).toBe(1);
  });

  it("evicts scoped memory index managers before close settles", async () => {
    let releaseProviderClose: () => void = () => {};
    providerCloseGate = new Promise<void>((resolve) => {
      releaseProviderClose = resolve;
    });
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const first = requireManager(await getMemorySearchManager({ cfg, agentId: "main" }));
    managersForCleanup.add(first);
    await first.probeEmbeddingAvailability();
    const closePromise = closeMemoryIndexManagersForAgent({ cfg, agentId: "main" });
    let second: MemoryIndexManager | null;
    try {
      await vi.waitFor(() => {
        expect(providerCloseCalls).toBe(1);
      });

      second = requireManager(await getMemorySearchManager({ cfg, agentId: "main" }));
      managersForCleanup.add(second);
      expect(second).not.toBe(first);
    } finally {
      releaseProviderClose();
      providerCloseGate = null;
    }
    await closePromise;

    const third = requireManager(await getMemorySearchManager({ cfg, agentId: "main" }));
    managersForCleanup.add(third);
    expect(third).toBe(second);
  });

  it("retries embedding provider close before releasing the manager", async () => {
    providerCloseFailuresRemaining = 1;
    const cfg = createCfg({
      storePath: indexMainPath,
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getFreshManager(cfg);

    await manager.probeEmbeddingAvailability();
    await manager.close();

    expect(providerCloseCalls).toBe(2);
  });

  it("indexes multimodal image and audio files from extra paths with Gemini structured inputs", async () => {
    const mediaDir = path.join(workspaceDir, "media-memory");
    await fs.mkdir(mediaDir, { recursive: true });
    await fs.writeFile(path.join(mediaDir, "diagram.png"), Buffer.from("png"));
    await fs.writeFile(path.join(mediaDir, "meeting.wav"), Buffer.from("wav"));

    const cfg = createCfg({
      storePath: indexMultimodalPath,
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      extraPaths: [mediaDir],
      multimodal: { enabled: true, modalities: ["image", "audio"] },
    });
    const manager = await getPersistentManager(cfg);
    await manager.sync({ reason: "test" });

    expect(embedBatchInputCalls).toBeGreaterThan(0);

    const imageResults = await manager.search("image");
    expect(imageResults.some((result) => result.path.endsWith("diagram.png"))).toBe(true);

    const audioResults = await manager.search("audio");
    expect(audioResults.some((result) => result.path.endsWith("meeting.wav"))).toBe(true);
  });

<<<<<<< HEAD
  it("skips oversized multimodal inputs without aborting sync", async () => {
    const mediaDir = path.join(workspaceDir, "media-oversize");
    await fs.mkdir(mediaDir, { recursive: true });
    await fs.writeFile(path.join(mediaDir, "huge.png"), Buffer.alloc(7000, 1));

    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-oversize-${randomUUID()}.sqlite`),
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      extraPaths: [mediaDir],
      multimodal: { enabled: true, modalities: ["image"] },
    });
    const manager = requireManager(await getMemorySearchManager({ cfg, agentId: "main" }));
    await manager.sync({ reason: "test" });

    expect(embedBatchInputCalls).toBeGreaterThan(0);
    const imageResults = await manager.search("image");
    expect(imageResults.some((result) => result.path.endsWith("huge.png"))).toBe(false);

    const alphaResults = await manager.search("alpha");
    expect(alphaResults.some((result) => result.path.endsWith("memory/2026-01-12.md"))).toBe(true);

    await manager.close?.();
  });

  it("reindexes a multimodal file after a transient mid-sync disappearance", async () => {
    const mediaDir = path.join(workspaceDir, "media-race");
    const imagePath = path.join(mediaDir, "diagram.png");
    await fs.mkdir(mediaDir, { recursive: true });
    await fs.writeFile(imagePath, Buffer.from("png"));

    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-race-${randomUUID()}.sqlite`),
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      extraPaths: [mediaDir],
      multimodal: { enabled: true, modalities: ["image"] },
    });
    const manager = requireManager(await getMemorySearchManager({ cfg, agentId: "main" }));
    const realReadFile = fs.readFile.bind(fs);
    let imageReads = 0;
    const readSpy = vi.spyOn(fs, "readFile").mockImplementation(async (...args) => {
      const [targetPath] = args;
      if (typeof targetPath === "string" && targetPath === imagePath) {
        imageReads += 1;
        if (imageReads === 2) {
          const err = Object.assign(
            new Error(`ENOENT: no such file or directory, open '${imagePath}'`),
            {
              code: "ENOENT",
            },
          ) as NodeJS.ErrnoException;
          throw err;
        }
      }
      return await realReadFile(...args);
    });

    await manager.sync({ reason: "test" });
    readSpy.mockRestore();

    const callsAfterFirstSync = embedBatchInputCalls;
    (manager as unknown as { dirty: boolean }).dirty = true;
    await manager.sync({ reason: "test" });

    expect(embedBatchInputCalls).toBeGreaterThan(callsAfterFirstSync);
    const results = await manager.search("image");
    expect(results.some((result) => result.path.endsWith("diagram.png"))).toBe(true);

    await manager.close?.();
  });

  it("keeps dirty false in status-only manager after prior indexing", async () => {
    const cfg = createCfg({ storePath: indexStatusPath });

    const first = await getMemorySearchManager({ cfg, agentId: "main" });
    const firstManager = requireManager(first);
    await firstManager.sync?.({ reason: "test" });
    await firstManager.close?.();
    const providerCallsBeforeStatus = providerCalls.length;

    const statusOnly = await getMemorySearchManager({
      cfg,
      agentId: "main",
      purpose: "status",
    });
    const statusManager = requireManager(statusOnly, "status manager missing");
    const status = statusManager.status();
    expect(status.dirty).toBe(false);
    expect(status.provider).toBe("openai");
    expect(providerCalls).toHaveLength(providerCallsBeforeStatus);
    await statusManager.close?.();
  });

  it("does not cache builtin status-only managers across repeated requests", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-status-${randomUUID()}.sqlite`),
    });

    const first = await getMemorySearchManager({
      cfg,
      agentId: "main",
      purpose: "status",
    });
    const second = await getMemorySearchManager({
      cfg,
      agentId: "main",
      purpose: "status",
    });

    const firstManager = requireManager(first, "first status manager missing");
    const secondManager = requireManager(second, "second status manager missing");
    expect(secondManager).not.toBe(firstManager);

    await firstManager.close?.();
    await secondManager.close?.();
  });

  it("reindexes sessions when source config adds sessions to an existing index", async () => {
    const stateDir = sourceChangeStateDir;
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    await fs.rm(stateDir, { recursive: true, force: true });
    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      path.join(sessionDir, "session-source-change.jsonl"),
      `${sourceChangeSessionLogLines}\n`,
    );

    const previousStateDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    const firstCfg = createCfg({
      storePath: indexSourceChangePath,
      sources: ["memory"],
      sessionMemory: false,
    });
    const secondCfg = createCfg({
      storePath: indexSourceChangePath,
      sources: ["memory", "sessions"],
      sessionMemory: true,
    });

    try {
      const first = await getMemorySearchManager({ cfg: firstCfg, agentId: "main" });
      const firstManager = requireManager(first);
      await firstManager.sync?.({ reason: "test" });
      const firstStatus = firstManager.status();
      expect(
        firstStatus.sourceCounts?.find((entry) => entry.source === "sessions")?.files ?? 0,
      ).toBe(0);
      await firstManager.close?.();

      const second = await getMemorySearchManager({ cfg: secondCfg, agentId: "main" });
      const secondManager = requireManager(second);
      await secondManager.sync?.({ reason: "test" });
      const secondStatus = secondManager.status();
      expect(secondStatus.sourceCounts?.find((entry) => entry.source === "sessions")?.files).toBe(
        1,
      );
      expect(
        secondStatus.sourceCounts?.find((entry) => entry.source === "sessions")?.chunks ?? 0,
      ).toBeGreaterThan(0);
      await secondManager.close?.();
    } finally {
      if (previousStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = previousStateDir;
      }
      await fs.rm(stateDir, { recursive: true, force: true });
    }
  });

  it("targets explicit session files during post-compaction sync", async () => {
    const stateDir = path.join(fixtureRoot, `state-targeted-${randomUUID()}`);
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    const firstSessionPath = path.join(sessionDir, "targeted-first.jsonl");
    const secondSessionPath = path.join(sessionDir, "targeted-second.jsonl");
    const storePath = path.join(workspaceDir, `index-targeted-${randomUUID()}.sqlite`);
    const previousStateDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      firstSessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "first transcript v1" }] },
      })}\n`,
    );
    await fs.writeFile(
      secondSessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "second transcript v1" }] },
      })}\n`,
    );

    try {
      const result = await getMemorySearchManager({
        cfg: createCfg({
          storePath,
          sources: ["sessions"],
          sessionMemory: true,
        }),
        agentId: "main",
      });
      const manager = requireManager(result);
      await manager.sync?.({ reason: "test" });

      const db = (
        manager as unknown as {
          db: {
            prepare: (sql: string) => {
              get: (path: string, source: string) => { hash: string } | undefined;
              all?: (...args: unknown[]) => unknown;
            };
          };
        }
      ).db;
      const getSessionHash = (sessionPath: string) =>
        db
          .prepare(`SELECT hash FROM files WHERE path = ? AND source = ?`)
          .get(sessionPath, "sessions")?.hash;

      const firstOriginalHash = getSessionHash("sessions/targeted-first.jsonl");
      const secondOriginalHash = getSessionHash("sessions/targeted-second.jsonl");

      await fs.writeFile(
        firstSessionPath,
        `${JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: [{ type: "text", text: "first transcript v2 after compaction" }],
          },
        })}\n`,
      );
      await fs.writeFile(
        secondSessionPath,
        `${JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: [{ type: "text", text: "second transcript v2 should stay untouched" }],
          },
        })}\n`,
      );

      const originalPrepare = db.prepare.bind(db);
      let bulkSessionStateAllCalls = 0;
      let perFileSessionHashPrepareCalls = 0;
      db.prepare = ((sql: string) => {
        const statement = originalPrepare(sql);
        if (sql === `SELECT path, hash FROM files WHERE source = ?`) {
          if (!statement.all) {
            throw new Error("expected sqlite statement.all for bulk session state query");
          }
          const bulkAll = statement.all.bind(statement);
          return {
            ...statement,
            all: (...args: unknown[]) => {
              bulkSessionStateAllCalls += 1;
              return bulkAll(...args);
            },
          };
        }
        if (sql === `SELECT hash FROM files WHERE path = ? AND source = ?`) {
          perFileSessionHashPrepareCalls += 1;
        }
        return statement;
      }) as typeof db.prepare;

      await manager.sync?.({
        reason: "post-compaction",
        sessionFiles: [firstSessionPath],
      });

      db.prepare = originalPrepare;

      expect(getSessionHash("sessions/targeted-first.jsonl")).not.toBe(firstOriginalHash);
      expect(getSessionHash("sessions/targeted-second.jsonl")).toBe(secondOriginalHash);
      expect(bulkSessionStateAllCalls).toBe(0);
      expect(perFileSessionHashPrepareCalls).toBeGreaterThan(0);
      await manager.close?.();
    } finally {
      if (previousStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = previousStateDir;
      }
      await fs.rm(stateDir, { recursive: true, force: true });
    }
  });

  it("preserves unrelated dirty sessions after targeted post-compaction sync", async () => {
    const stateDir = path.join(fixtureRoot, `state-targeted-dirty-${randomUUID()}`);
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    const firstSessionPath = path.join(sessionDir, "targeted-dirty-first.jsonl");
    const secondSessionPath = path.join(sessionDir, "targeted-dirty-second.jsonl");
    const storePath = path.join(workspaceDir, `index-targeted-dirty-${randomUUID()}.sqlite`);
    const previousStateDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      firstSessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "first transcript v1" }] },
      })}\n`,
    );
    await fs.writeFile(
      secondSessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "second transcript v1" }] },
      })}\n`,
    );

    try {
      const manager = requireManager(
        await getMemorySearchManager({
          cfg: createCfg({
            storePath,
            sources: ["sessions"],
            sessionMemory: true,
          }),
          agentId: "main",
        }),
      );
      await manager.sync({ reason: "test" });

      const db = (
        manager as unknown as {
          db: {
            prepare: (sql: string) => {
              get: (path: string, source: string) => { hash: string } | undefined;
            };
          };
        }
      ).db;
      const getSessionHash = (sessionPath: string) =>
        db
          .prepare(`SELECT hash FROM files WHERE path = ? AND source = ?`)
          .get(sessionPath, "sessions")?.hash;

      const firstOriginalHash = getSessionHash("sessions/targeted-dirty-first.jsonl");
      const secondOriginalHash = getSessionHash("sessions/targeted-dirty-second.jsonl");

      await fs.writeFile(
        firstSessionPath,
        `${JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: [{ type: "text", text: "first transcript v2 after compaction" }],
          },
        })}\n`,
      );
      await fs.writeFile(
        secondSessionPath,
        `${JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: [{ type: "text", text: "second transcript v2 still pending" }],
          },
        })}\n`,
      );

      const internal = manager as unknown as {
        sessionsDirty: boolean;
        sessionsDirtyFiles: Set<string>;
      };
      internal.sessionsDirty = true;
      internal.sessionsDirtyFiles.add(secondSessionPath);

      await manager.sync({
        reason: "post-compaction",
        sessionFiles: [firstSessionPath],
      });

      expect(getSessionHash("sessions/targeted-dirty-first.jsonl")).not.toBe(firstOriginalHash);
      expect(getSessionHash("sessions/targeted-dirty-second.jsonl")).toBe(secondOriginalHash);
      expect(internal.sessionsDirtyFiles.has(secondSessionPath)).toBe(true);
      expect(internal.sessionsDirty).toBe(true);

      await manager.sync({ reason: "test" });

      expect(getSessionHash("sessions/targeted-dirty-second.jsonl")).not.toBe(secondOriginalHash);
      await manager.close?.();
    } finally {
      if (previousStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = previousStateDir;
      }
      await fs.rm(stateDir, { recursive: true, force: true });
      await fs.rm(storePath, { force: true });
    }
  });

  it("queues targeted session sync when another sync is already in progress", async () => {
    const stateDir = path.join(fixtureRoot, `state-targeted-queued-${randomUUID()}`);
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    const sessionPath = path.join(sessionDir, "targeted-queued.jsonl");
    const storePath = path.join(workspaceDir, `index-targeted-queued-${randomUUID()}.sqlite`);
    const previousStateDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      sessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "queued transcript v1" }] },
      })}\n`,
    );

    try {
      const manager = requireManager(
        await getMemorySearchManager({
          cfg: createCfg({
            storePath,
            sources: ["sessions"],
            sessionMemory: true,
          }),
          agentId: "main",
        }),
      );
      await manager.sync({ reason: "test" });

      const db = (
        manager as unknown as {
          db: {
            prepare: (sql: string) => {
              get: (path: string, source: string) => { hash: string } | undefined;
            };
          };
        }
      ).db;
      const getSessionHash = (sessionRelPath: string) =>
        db
          .prepare(`SELECT hash FROM files WHERE path = ? AND source = ?`)
          .get(sessionRelPath, "sessions")?.hash;
      const originalHash = getSessionHash("sessions/targeted-queued.jsonl");

      const internal = manager as unknown as {
        runSyncWithReadonlyRecovery: (params?: {
          reason?: string;
          sessionFiles?: string[];
        }) => Promise<void>;
      };
      const originalRunSync = internal.runSyncWithReadonlyRecovery.bind(manager);
      let releaseBusySync: (() => void) | undefined;
      const busyGate = new Promise<void>((resolve) => {
        releaseBusySync = resolve;
      });
      internal.runSyncWithReadonlyRecovery = async (params) => {
        if (params?.reason === "busy-sync") {
          await busyGate;
        }
        return await originalRunSync(params);
      };

      const busySyncPromise = manager.sync({ reason: "busy-sync" });
      await fs.writeFile(
        sessionPath,
        `${JSON.stringify({
          type: "message",
          message: {
            role: "user",
            content: [{ type: "text", text: "queued transcript v2 after compaction" }],
          },
        })}\n`,
      );

      const targetedSyncPromise = manager.sync({
        reason: "post-compaction",
        sessionFiles: [sessionPath],
      });

      releaseBusySync?.();
      await Promise.all([busySyncPromise, targetedSyncPromise]);

      expect(getSessionHash("sessions/targeted-queued.jsonl")).not.toBe(originalHash);
      await manager.close?.();
    } finally {
      if (previousStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = previousStateDir;
      }
      await fs.rm(stateDir, { recursive: true, force: true });
      await fs.rm(storePath, { force: true });
    }
  });

  it("runs a full reindex after fallback activates during targeted sync", async () => {
    const stateDir = path.join(fixtureRoot, `state-targeted-fallback-${randomUUID()}`);
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    const sessionPath = path.join(sessionDir, "targeted-fallback.jsonl");
    const storePath = path.join(workspaceDir, `index-targeted-fallback-${randomUUID()}.sqlite`);
    const previousStateDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      sessionPath,
      `${JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "fallback transcript v1" }] },
      })}\n`,
    );

    try {
      const manager = requireManager(
        await getMemorySearchManager({
          cfg: createCfg({
            storePath,
            sources: ["sessions"],
            sessionMemory: true,
          }),
          agentId: "main",
        }),
      );
      await manager.sync({ reason: "test" });

      const internal = manager as unknown as {
        syncSessionFiles: (params: {
          targetSessionFiles?: string[];
          needsFullReindex: boolean;
        }) => Promise<void>;
        shouldFallbackOnError: (message: string) => boolean;
        activateFallbackProvider: (reason: string) => Promise<boolean>;
        runSafeReindex: (params: {
          reason?: string;
          force?: boolean;
          progress?: unknown;
        }) => Promise<void>;
        runUnsafeReindex: (params: {
          reason?: string;
          force?: boolean;
          progress?: unknown;
        }) => Promise<void>;
      };
      const originalSyncSessionFiles = internal.syncSessionFiles.bind(manager);
      const originalShouldFallbackOnError = internal.shouldFallbackOnError.bind(manager);
      const originalActivateFallbackProvider = internal.activateFallbackProvider.bind(manager);
      const originalRunSafeReindex = internal.runSafeReindex.bind(manager);
      const originalRunUnsafeReindex = internal.runUnsafeReindex.bind(manager);

      internal.syncSessionFiles = async (params) => {
        if (params.targetSessionFiles?.length) {
          throw new Error("embedding backend failed");
        }
        return await originalSyncSessionFiles(params);
      };
      internal.shouldFallbackOnError = () => true;
      const activateFallbackProvider = vi.fn(async () => true);
      internal.activateFallbackProvider = activateFallbackProvider;
      const runSafeReindex = vi.fn(async () => {});
      internal.runSafeReindex = runSafeReindex;
      const runUnsafeReindex = vi.fn(async () => {});
      internal.runUnsafeReindex = runUnsafeReindex;

      await manager.sync({
        reason: "post-compaction",
        sessionFiles: [sessionPath],
      });

      expect(activateFallbackProvider).toHaveBeenCalledWith("embedding backend failed");
      const expectedReindexParams = {
        reason: "post-compaction",
        force: true,
        progress: undefined,
      };
      const usesUnsafeReindex =
        process.env.OPENCLAW_TEST_FAST === "1" &&
        process.env.OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX === "1";
      if (usesUnsafeReindex) {
        expect(runUnsafeReindex).toHaveBeenCalledWith(expectedReindexParams);
        expect(runSafeReindex).not.toHaveBeenCalled();
      } else {
        expect(runSafeReindex).toHaveBeenCalledWith(expectedReindexParams);
        expect(runUnsafeReindex).not.toHaveBeenCalled();
      }

      internal.syncSessionFiles = originalSyncSessionFiles;
      internal.shouldFallbackOnError = originalShouldFallbackOnError;
      internal.activateFallbackProvider = originalActivateFallbackProvider;
      internal.runSafeReindex = originalRunSafeReindex;
      internal.runUnsafeReindex = originalRunUnsafeReindex;
      await manager.close?.();
    } finally {
      if (previousStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = previousStateDir;
      }
      await fs.rm(stateDir, { recursive: true, force: true });
      await fs.rm(storePath, { force: true });
    }
  });

  it("reindexes when the embedding model changes", async () => {
    const base = createCfg({ storePath: indexModelPath });
    const baseAgents = base.agents!;
    const baseDefaults = baseAgents.defaults!;
    const baseMemorySearch = baseDefaults.memorySearch!;

    const first = await getMemorySearchManager({
      cfg: {
        ...base,
        agents: {
          ...baseAgents,
          defaults: {
            ...baseDefaults,
            memorySearch: {
              ...baseMemorySearch,
              model: "mock-embed-v1",
            },
          },
        },
      },
      agentId: "main",
    });
    const firstManager = requireManager(first);
    await firstManager.sync?.({ reason: "test" });
    const callsAfterFirstSync = embedBatchCalls;
    await firstManager.close?.();

    const second = await getMemorySearchManager({
      cfg: {
        ...base,
        agents: {
          ...baseAgents,
          defaults: {
            ...baseDefaults,
            memorySearch: {
              ...baseMemorySearch,
              model: "mock-embed-v2",
            },
          },
        },
      },
      agentId: "main",
    });
    const secondManager = requireManager(second);
    await secondManager.sync?.({ reason: "test" });
    expect(embedBatchCalls).toBeGreaterThan(callsAfterFirstSync);
    const status = secondManager.status();
    expect(status.files).toBeGreaterThan(0);
    await secondManager.close?.();
  });

  it("passes Gemini outputDimensionality from config into the provider", async () => {
    const cfg = createCfg({
      storePath: indexMainPath,
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      outputDimensionality: 1536,
    });

    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    await manager.probeEmbeddingAvailability();

    expect(
      providerCalls.some(
        (call) =>
          call.provider === "gemini" &&
          call.model === "gemini-embedding-2-preview" &&
          call.outputDimensionality === 1536,
      ),
    ).toBe(true);
    await manager.close?.();
  });

  it("does not initialize the provider when searching an empty index", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-empty-${randomUUID()}.sqlite`),
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      outputDimensionality: 1536,
      onSearch: false,
    });

    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);

    const results = await manager.search("hello");

    expect(results).toEqual([]);
    expect(providerCalls).toEqual([]);
    await manager.close?.();
  });

  it("snapshots builtin file hashes with a single sqlite query per sync", async () => {
    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "beta line\n");
    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-prepare-reuse-${randomUUID()}.sqlite`),
      onSearch: false,
    });

    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);

    await manager.sync({ reason: "test" });
    (manager as unknown as { dirty: boolean }).dirty = true;

    const db = (
      manager as unknown as {
        db: {
          prepare: (sql: string) => { get: (...args: unknown[]) => unknown };
        };
      }
    ).db;
    const originalPrepare = db.prepare.bind(db);
    let selectSourceFileStatePrepareCalls = 0;
    let perFileHashPrepareCalls = 0;
    db.prepare = ((sql: string) => {
      if (sql === `SELECT path, hash FROM files WHERE source = ?`) {
        selectSourceFileStatePrepareCalls += 1;
      }
      if (sql === `SELECT hash FROM files WHERE path = ? AND source = ?`) {
        perFileHashPrepareCalls += 1;
      }
      return originalPrepare(sql);
    }) as typeof db.prepare;

    try {
      await manager.sync({ reason: "test" });
    } finally {
      db.prepare = originalPrepare;
    }

    expect(selectSourceFileStatePrepareCalls).toBe(1);
    expect(perFileHashPrepareCalls).toBe(0);
  });

  it("uses a single sqlite aggregation query for status counts", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, `index-status-aggregate-${randomUUID()}.sqlite`),
      sources: ["memory", "sessions"],
      sessionMemory: true,
      onSearch: false,
    });

    await fs.writeFile(path.join(memoryDir, "2026-01-13.md"), "beta line\n");

    const stateDir = path.join(fixtureRoot, `state-status-${randomUUID()}`);
    vi.stubEnv("OPENCLAW_STATE_DIR", stateDir);
    const sessionDir = path.join(stateDir, "agents", "main", "sessions");
    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(
      path.join(sessionDir, "status.jsonl"),
      JSON.stringify({
        type: "message",
        message: { role: "user", content: [{ type: "text", text: "session status line" }] },
      }) + "\n",
    );

    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);
    await manager.sync({ reason: "test" });

    const db = (
      manager as unknown as {
        db: {
          prepare: (sql: string) => { all: (...args: unknown[]) => unknown };
        };
      }
    ).db;
    const originalPrepare = db.prepare.bind(db);
    let aggregatePrepareCalls = 0;
    let legacyCountPrepareCalls = 0;
    db.prepare = ((sql: string) => {
      if (
        sql.includes(`SELECT 'files' AS kind, source, COUNT(*) as c FROM files`) &&
        sql.includes(`UNION ALL`)
      ) {
        aggregatePrepareCalls += 1;
      }
      if (
        sql === `SELECT COUNT(*) as c FROM files WHERE 1=1` ||
        sql === `SELECT COUNT(*) as c FROM chunks WHERE 1=1` ||
        sql === `SELECT source, COUNT(*) as c FROM files WHERE 1=1 GROUP BY source` ||
        sql === `SELECT source, COUNT(*) as c FROM chunks WHERE 1=1 GROUP BY source`
      ) {
        legacyCountPrepareCalls += 1;
      }
      return originalPrepare(sql);
    }) as typeof db.prepare;

    try {
      const status = manager.status();
      expect(status.files).toBeGreaterThan(0);
      expect(status.chunks).toBeGreaterThan(0);
      expect(
        status.sourceCounts?.find((entry) => entry.source === "memory")?.files,
      ).toBeGreaterThan(0);
      expect(
        status.sourceCounts?.find((entry) => entry.source === "sessions")?.files,
      ).toBeGreaterThan(0);
    } finally {
      db.prepare = originalPrepare;
      vi.unstubAllEnvs();
    }

    expect(aggregatePrepareCalls).toBe(1);
    expect(legacyCountPrepareCalls).toBe(0);
  });

  it("reindexes when Gemini outputDimensionality changes", async () => {
    const base = createCfg({
      storePath: indexModelPath,
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      outputDimensionality: 3072,
    });
    const baseAgents = base.agents!;
    const baseDefaults = baseAgents.defaults!;
    const baseMemorySearch = baseDefaults.memorySearch!;

    const first = await getMemorySearchManager({ cfg: base, agentId: "main" });
    const firstManager = requireManager(first);
    await firstManager.sync?.({ reason: "test" });
    const callsAfterFirstSync = embedBatchCalls;
    await firstManager.close?.();

    const second = await getMemorySearchManager({
      cfg: {
        ...base,
        agents: {
          ...baseAgents,
          defaults: {
            ...baseDefaults,
            memorySearch: {
              ...baseMemorySearch,
              outputDimensionality: 768,
            },
          },
        },
      },
      agentId: "main",
    });
    const secondManager = requireManager(second);
    await secondManager.sync?.({ reason: "test" });
    expect(embedBatchCalls).toBeGreaterThan(callsAfterFirstSync);
    await secondManager.close?.();
  });

  it("reindexes when extraPaths change", async () => {
    const storePath = path.join(workspaceDir, `index-scope-extra-${randomUUID()}.sqlite`);
    const firstExtraDir = path.join(workspaceDir, "scope-extra-a");
    const secondExtraDir = path.join(workspaceDir, "scope-extra-b");
    await fs.rm(firstExtraDir, { recursive: true, force: true });
    await fs.rm(secondExtraDir, { recursive: true, force: true });
    await fs.mkdir(firstExtraDir, { recursive: true });
    await fs.mkdir(secondExtraDir, { recursive: true });
    await fs.writeFile(path.join(firstExtraDir, "a.md"), "alpha only");
    await fs.writeFile(path.join(secondExtraDir, "b.md"), "beta only");

    const first = await getMemorySearchManager({
      cfg: createCfg({
        storePath,
        extraPaths: [firstExtraDir],
      }),
      agentId: "main",
    });
    const firstManager = requireManager(first);
    await firstManager.sync?.({ reason: "test" });
    await firstManager.close?.();

    const second = await getMemorySearchManager({
      cfg: createCfg({
        storePath,
        extraPaths: [secondExtraDir],
      }),
      agentId: "main",
    });
    const secondManager = requireManager(second);
    await secondManager.sync?.({ reason: "test" });
    const results = await secondManager.search("beta");
    expect(results.some((result) => result.path.endsWith("scope-extra-b/b.md"))).toBe(true);
    expect(results.some((result) => result.path.endsWith("scope-extra-a/a.md"))).toBe(false);
    await secondManager.close?.();
  });

  it("reindexes when multimodal settings change", async () => {
    const storePath = path.join(workspaceDir, `index-scope-multimodal-${randomUUID()}.sqlite`);
    const mediaDir = path.join(workspaceDir, "scope-media");
    await fs.rm(mediaDir, { recursive: true, force: true });
    await fs.mkdir(mediaDir, { recursive: true });
    await fs.writeFile(path.join(mediaDir, "diagram.png"), Buffer.from("png"));

    const first = await getMemorySearchManager({
      cfg: createCfg({
        storePath,
        provider: "gemini",
        model: "gemini-embedding-2-preview",
        extraPaths: [mediaDir],
      }),
      agentId: "main",
    });
    const firstManager = requireManager(first);
    await firstManager.sync?.({ reason: "test" });
    const multimodalCallsAfterFirstSync = embedBatchInputCalls;
    await firstManager.close?.();

    const second = await getMemorySearchManager({
      cfg: createCfg({
        storePath,
        provider: "gemini",
        model: "gemini-embedding-2-preview",
        extraPaths: [mediaDir],
        multimodal: { enabled: true, modalities: ["image"] },
      }),
      agentId: "main",
    });
    const secondManager = requireManager(second);
    await secondManager.sync?.({ reason: "test" });
    expect(embedBatchInputCalls).toBeGreaterThan(multimodalCallsAfterFirstSync);
    const results = await secondManager.search("image");
    expect(results.some((result) => result.path.endsWith("scope-media/diagram.png"))).toBe(true);
    await secondManager.close?.();
  });

  it("reuses cached embeddings on forced reindex", async () => {
    const cfg = createCfg({ storePath: indexMainPath, cacheEnabled: true });
    const manager = await getPersistentManager(cfg);
    // Seed the embedding cache once, then ensure a forced reindex doesn't
    // re-embed when the cache is enabled.
    await manager.sync({ reason: "test" });
    const afterFirst = embedBatchCalls;
    expect(afterFirst).toBeGreaterThan(0);

    await manager.sync({ force: true });
    expect(embedBatchCalls).toBe(afterFirst);
  });

  it.skip("finds keyword matches via hybrid search when query embedding is zero", async () => {
=======
  it("finds keyword matches via hybrid search when query embedding is zero", async () => {
>>>>>>> upstream/main
    await expectHybridKeywordSearchFindsMemory(
      createCfg({
        storePath: indexMainPath,
        hybrid: { enabled: true, vectorWeight: 0, textWeight: 1 },
      }),
    );
  });

  it("retries transient query embedding transport failures during search", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-search-query-retry.sqlite"),
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getPersistentManager(cfg);
    await manager.sync({ reason: "test" });

    let queryCalls = 0;
    (
      manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: (text: string) => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
        waitForEmbeddingRetry: (delayMs: number, action: string) => Promise<void>;
      }
    ).provider = {
      id: "mock",
      model: "mock-embed",
      embedQuery: async () => {
        queryCalls += 1;
        if (queryCalls === 1) {
          throw new Error("TypeError: fetch failed | other side closed");
        }
        return [1, 0, 0, 0];
      },
      embedBatch: async (texts: string[]) => texts.map(() => [1, 0, 0, 0]),
      close: async () => {},
    };
    (
      manager as unknown as {
        waitForEmbeddingRetry: (delayMs: number, action: string) => Promise<void>;
      }
    ).waitForEmbeddingRetry = async () => {};

    const results = await manager.search("alpha");

    expect(queryCalls).toBe(2);
    expect(results.some((result) => result.path.endsWith("memory/2026-01-12.md"))).toBe(true);
  });

  it("fails search after bounded query embedding retries are exhausted", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-search-query-retry-exhausted.sqlite"),
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getPersistentManager(cfg);
    await manager.sync({ reason: "test" });

    let queryCalls = 0;
    (
      manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: (text: string) => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
      }
    ).provider = {
      id: "mock",
      model: "mock-embed",
      embedQuery: async () => {
        queryCalls += 1;
        throw new Error("TypeError: fetch failed | other side closed");
      },
      embedBatch: async (texts: string[]) => texts.map(() => [1, 0, 0, 0]),
      close: async () => {},
    };
    (
      manager as unknown as {
        waitForEmbeddingRetry: (delayMs: number, action: string) => Promise<void>;
      }
    ).waitForEmbeddingRetry = async () => {};

    await expect(manager.search("alpha")).rejects.toThrow("fetch failed");
    expect(queryCalls).toBe(3);
  });

  it("preserves keyword-only hybrid hits when minScore exceeds text weight", async () => {
    await expectHybridKeywordSearchFindsMemory(
      createCfg({
        storePath: indexMainPath,
        minScore: 0.35,
        hybrid: { enabled: true, vectorWeight: 0.7, textWeight: 0.3 },
      }),
    );
  });

  it("reports vector availability after probe", async () => {
    const cfg = createCfg({ storePath: indexVectorPath, vectorEnabled: true });
    const manager = await getPersistentManager(cfg);
    const available = await manager.probeVectorAvailability();
    const status = manager.status();
    expect(status.vector?.enabled).toBe(true);
    expect(typeof status.vector?.available).toBe("boolean");
    expect(status.vector?.storeAvailable).toBe(available);
    expect(status.vector?.semanticAvailable).toBe(available);
    expect(status.vector?.available).toBe(available);
  });

  it("probes sqlite vector store availability without initializing embeddings", async () => {
    forceNoProvider = true;
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-vector-store-only.sqlite"),
      vectorEnabled: true,
    });
    const manager = await getPersistentManager(cfg);

    const available = await manager.probeVectorStoreAvailability?.();
    const status = manager.status();

    expect(providerCalls).toStrictEqual([]);
    expect(typeof status.vector?.storeAvailable).toBe("boolean");
    expect(status.vector?.storeAvailable).toBe(available);
    expect(status.vector?.semanticAvailable).toBeUndefined();
    expect(status.vector?.available).toBeUndefined();
  });

  it("marks older vector indexes dirty after vector store probing", async () => {
    const dbPath = path.join(workspaceDir, "index-vector-missing-dims.sqlite");
    const legacyCfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      vectorEnabled: false,
    });
    const legacyManager = await getFreshManager(legacyCfg);
    await legacyManager.sync({ reason: "test", force: true });
    await legacyManager.close?.();

    const cfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      vectorEnabled: true,
    });
    const manager = await getFreshManager(cfg);
    try {
      const metaAccess = manager as unknown as {
        readMeta(): MemoryIndexMeta | null;
      };
      const meta = metaAccess.readMeta();
      if (!meta) {
        throw new Error("expected index metadata");
      }
      expect(meta.vectorDims).toBeUndefined();

      await manager.probeVectorStoreAvailability?.();
      const status = manager.status();

      expect(status.dirty).toBe(true);
      expect(status.custom?.indexIdentity).toEqual({
        status: "mismatched",
        reason: "index vector dimensions are missing",
      });
    } finally {
      await manager.close?.();
    }
  });

  it("keeps empty vector indexes clean after vector store probing", async () => {
    await fs.rm(path.join(memoryDir, "2026-01-12.md"));
    const dbPath = path.join(workspaceDir, "index-empty-vector.sqlite");
    const legacyCfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      vectorEnabled: false,
    });
    const legacyManager = await getFreshManager(legacyCfg);
    await legacyManager.sync({ reason: "test", force: true });
    await legacyManager.close?.();

    const cfg = createCfg({
      storePath: dbPath,
      provider: "gemini",
      vectorEnabled: true,
    });
    const manager = await getFreshManager(cfg, "status");
    try {
      await manager.probeVectorStoreAvailability?.();

      const status = manager.status();

      expect(status.dirty).toBe(false);
      expect(status.custom?.indexIdentity).toEqual({ status: "valid" });
    } finally {
      await manager.close?.();
    }
  });

  it("caches embedding probe readiness across transient status managers", async () => {
    const cfg = createCfg({ storePath: path.join(workspaceDir, "index-probe-cache.sqlite") });
    const first = requireManager(
      await getMemorySearchManager({ cfg, agentId: "main", purpose: "status" }),
    );
    managersForCleanup.add(first);

    await expect(first.probeEmbeddingAvailability()).resolves.toEqual({ ok: true });
    expect(embedBatchCalls).toBe(1);
    await first.close();

    const second = requireManager(
      await getMemorySearchManager({ cfg, agentId: "main", purpose: "status" }),
    );
    managersForCleanup.add(second);

    const cachedBeforeProbe = second.getCachedEmbeddingAvailability?.();
    expect(cachedBeforeProbe?.ok).toBe(true);
    expect(cachedBeforeProbe?.checked).toBe(true);
    expect(cachedBeforeProbe?.cached).toBe(true);
    expect(cachedBeforeProbe?.checkedAtMs).toBeTypeOf("number");
    expect(cachedBeforeProbe?.cacheExpiresAtMs).toBeTypeOf("number");
    if (
      typeof cachedBeforeProbe?.checkedAtMs === "number" &&
      typeof cachedBeforeProbe.cacheExpiresAtMs === "number"
    ) {
      expect(cachedBeforeProbe.cacheExpiresAtMs - cachedBeforeProbe.checkedAtMs).toBe(
        EMBEDDING_PROBE_CACHE_TTL_MS,
      );
    }
    await expect(second.probeEmbeddingAvailability()).resolves.toStrictEqual({
      ok: true,
      checked: true,
      cached: true,
      checkedAtMs: cachedBeforeProbe?.checkedAtMs,
      cacheExpiresAtMs: cachedBeforeProbe?.cacheExpiresAtMs,
    });
    expect(embedBatchCalls).toBe(1);

    const cached = second.getCachedEmbeddingAvailability?.();
    expect((cached?.cacheExpiresAtMs ?? 0) - (cached?.checkedAtMs ?? 0)).toBe(
      EMBEDDING_PROBE_CACHE_TTL_MS,
    );
  });

  it("clears cached embedding probe readiness when local embeddings degrade", async () => {
    const cfg = createCfg({ storePath: path.join(workspaceDir, "index-probe-degraded.sqlite") });
    const manager = await getPersistentManager(cfg);

    await expect(manager.probeEmbeddingAvailability()).resolves.toEqual({ ok: true });
    expect(manager.getCachedEmbeddingAvailability()?.ok).toBe(true);
    (
      manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: (text: string) => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
      }
    ).provider = {
      id: "local",
      model: "local-model",
      embedQuery: async () => [1, 0],
      embedBatch: async (texts: string[]) => texts.map(() => [1, 0]),
      close: async () => {},
    };

    (
      manager as unknown as {
        markLocalEmbeddingProviderDegraded: (err: unknown) => void;
      }
    ).markLocalEmbeddingProviderDegraded(createLocalWorkerExitError());

    expect(manager.getCachedEmbeddingAvailability()).toBeNull();
    await expect(manager.probeEmbeddingAvailability()).resolves.toMatchObject({
      ok: false,
      error: expect.stringContaining("Local embeddings degraded"),
    });
  });

  it("does not activate fallback during search when index identity is already mismatched", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-search-degraded-fallback.sqlite"),
      fallback: "fallback-provider",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getPersistentManager(cfg);

    await manager.sync({ reason: "test" });
    const callsBeforeSearch = providerCalls.length;
    (
      manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: () => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
      }
    ).provider = {
      id: "local",
      model: "mock-embed",
      embedQuery: async () => {
        throw createLocalWorkerExitError();
      },
      embedBatch: async (texts: string[]) => texts.map(() => [1, 0, 0, 0]),
      close: async () => {},
    };

    const results = await manager.search("alpha");

    expect(results).toStrictEqual([]);
    expect(providerCalls.slice(callsBeforeSearch)).toStrictEqual([]);
    expect(
      (
        manager as unknown as {
          provider: { id: string } | null;
        }
      ).provider?.id,
    ).toBe("local");
  });

  it("rebuilds with fallback provider during explicit identity repair", async () => {
    const dbPath = path.join(workspaceDir, "index-cli-fallback-identity-repair.sqlite");
    const oldCfg = createCfg({
      storePath: dbPath,
      model: "old-embed",
    });
    const oldManager = await getFreshManager(oldCfg);
    await oldManager.sync({ reason: "test", force: true });
    await oldManager.close?.();

    const cfg = createCfg({
      storePath: dbPath,
      model: "new-embed",
      fallback: "fallback-provider",
    });
    const manager = await getFreshManager(cfg);
    try {
      expect(manager.status().dirty).toBe(true);
      const fields = manager as unknown as {
        providerInitialized: boolean;
        provider: {
          id: string;
          model: string;
          embedQuery: (text: string) => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
      };
      fields.providerInitialized = true;
      fields.provider = {
        id: "mock",
        model: "new-embed",
        embedQuery: async () => {
          throw createLocalWorkerExitError();
        },
        embedBatch: async () => {
          throw createLocalWorkerExitError();
        },
        close: async () => {},
      };

      await manager.sync({ reason: "cli" });

      expect(manager.status().dirty).toBe(false);
      expect(manager.status().provider).toBe("fallback-provider");
      expect(manager.status().model).toBe("fallback-provider-embed");
      expect(manager.status().custom?.indexIdentity).toEqual({ status: "valid" });
      await expect(manager.search("alpha")).resolves.not.toStrictEqual([]);
    } finally {
      await manager.close?.();
    }
  });

  it("activates configured fallback after probe-time local degradation", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-probe-degraded-fallback.sqlite"),
      fallback: "fallback-provider",
      hybrid: { enabled: true, vectorWeight: 0.5, textWeight: 0.5 },
    });
    const manager = await getPersistentManager(cfg);

    await manager.sync({ reason: "test" });
    (
      manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: () => Promise<number[]>;
          embedBatch: () => Promise<number[][]>;
          close: () => Promise<void>;
        };
      }
    ).provider = {
      id: "local",
      model: "mock-embed",
      embedQuery: async () => {
        throw createLocalWorkerExitError();
      },
      embedBatch: async () => {
        throw createLocalWorkerExitError();
      },
      close: async () => {},
    };
    const callsBeforeSearch = providerCalls.length;

    await expect(manager.probeEmbeddingAvailability()).resolves.toMatchObject({
      ok: false,
      error: expect.stringContaining("Local embedding worker exited"),
    });

    const results = await manager.search("alpha");

    expect(results).toStrictEqual([]);
    expect(providerCalls.slice(callsBeforeSearch).map((call) => call.provider)).toContain(
      "fallback-provider",
    );
    expect(
      (
        manager as unknown as {
          provider: { id: string } | null;
        }
      ).provider?.id,
    ).toBe("fallback-provider");
  });

  it("clears identity dirty after status resolves the indexed fallback provider", async () => {
    const dbPath = path.join(workspaceDir, "index-status-fallback-identity.sqlite");
    const indexedCfg = createCfg({
      storePath: dbPath,
      provider: "fallback-provider",
      model: "new-embed",
    });
    const indexedManager = await getFreshManager(indexedCfg);
    await indexedManager.sync({ reason: "test", force: true });
    await indexedManager.close?.();

    const cfg = createCfg({
      storePath: dbPath,
      fallback: "fallback-provider",
      model: "new-embed",
    });
    const { getRequiredMemoryIndexManager } = await import("./test-manager-helpers.js");
    const manager = await getRequiredMemoryIndexManager({
      cfg,
      agentId: "main",
      purpose: "status",
    });
    try {
      expect(manager.status().dirty).toBe(true);

      const fields = manager as unknown as {
        provider: {
          id: string;
          model: string;
          embedQuery: (text: string) => Promise<number[]>;
          embedBatch: (texts: string[]) => Promise<number[][]>;
          close: () => Promise<void>;
        };
        providerInitialized: boolean;
        providerRuntime: {
          id: string;
          cacheKeyData: Record<string, unknown>;
        };
        providerKey: string;
        computeProviderKey: () => string;
      };
      fields.provider = {
        id: "fallback-provider",
        model: "new-embed",
        embedQuery: async () => [1, 0, 0, 0],
        embedBatch: async (texts) => texts.map(() => [1, 0, 0, 0]),
        close: async () => {},
      };
      fields.providerRuntime = {
        id: "fallback-provider",
        cacheKeyData: {
          provider: "fallback-provider",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          model: "new-embed",
          headers: [],
        },
      };
      fields.providerInitialized = true;
      fields.providerKey = fields.computeProviderKey();

      expect(manager.status().dirty).toBe(false);
      expect(manager.status().custom?.indexIdentity).toEqual({ status: "valid" });
    } finally {
      await manager.close?.();
    }
  });

  it("keeps metadata after unchanged safe force reindex", async () => {
    vi.stubEnv("OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX", "0");
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-safe-force-metadata.sqlite"),
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test", force: true });
      expect(manager.status().custom?.indexIdentity).toEqual({ status: "valid" });

      await manager.sync({ reason: "cli", force: true });

      expect(manager.status().dirty).toBe(false);
      expect(manager.status().custom?.indexIdentity).toEqual({ status: "valid" });
    } finally {
      await manager.close?.();
    }
  });

  it("streams embedding cache rows during safe reindex", async () => {
    vi.stubEnv("OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX", "0");
    type EmbeddingCacheRow = {
      provider: string;
      model: string;
      provider_key: string;
      hash: string;
      embedding: string;
      dims: number | null;
      updated_at: number;
    };
    type StatementWithAll = {
      all: () => EmbeddingCacheRow[];
    };

    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-cache-seed-stream.sqlite"),
      cacheEnabled: true,
    });
    const manager = await getPersistentManager(cfg);
    await manager.sync({ reason: "test" });

    // Safe reindex streams cache rows from the original database and writes
    // them into a temporary database, so the SELECT spy belongs on this handle.
    const sourceDb = (
      manager as unknown as {
        db: {
          prepare: (sql: string) => unknown;
        };
      }
    ).db;
    const originalPrepare = sourceDb.prepare.bind(sourceDb);
    const cachedRows = (
      originalPrepare(
        "SELECT provider, model, provider_key, hash, embedding, dims, updated_at FROM embedding_cache",
      ) as StatementWithAll
    ).all();
    expect(cachedRows.length).toBeGreaterThan(0);

    const beforeCalls = embedBatchCalls;
    const prepareSpy = vi.spyOn(sourceDb, "prepare").mockImplementation((sql: string) => {
      if (
        sql.includes(
          "SELECT provider, model, provider_key, hash, embedding, dims, updated_at FROM embedding_cache",
        )
      ) {
        return {
          all: () => {
            throw new Error("embedding cache seed must stream rows via iterate()");
          },
          iterate: () => cachedRows[Symbol.iterator](),
        };
      }
      return originalPrepare(sql);
    });

    try {
      (manager as unknown as { dirty: boolean }).dirty = true;
      await manager.sync({ reason: "test", force: true });
    } finally {
      prepareSpy.mockRestore();
    }

    expect(embedBatchCalls).toBe(beforeCalls);
  });

  it("builds FTS index and returns search results when no embedding provider is available", async () => {
    forceNoProvider = true;

    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-fts-only.sqlite"),
      minScore: 0.35,
      hybrid: { enabled: true },
    });
    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);
    resetManagerForTest(manager);
    if (!manager.status().fts?.available) {
      return;
    }

    await fs.writeFile(
      path.join(memoryDir, "2026-01-12.md"),
      "# Log\nAlpha memory line.\nZebra memory line.",
    );
    await manager.sync({ reason: "test" });

    const status = manager.status();
    expect(status.chunks).toBeGreaterThan(0);
    expect(embedBatchCalls).toBe(0);

    const results = await manager.search("Alpha");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.snippet).toMatch(/Alpha/i);

    const noResults = await manager.search("nonexistent_xyz_keyword");
    expect(noResults.length).toBe(0);
  });

  it("fails fast instead of searching FTS when an explicit provider is unavailable", async () => {
    forceNoProvider = true;

    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-required-provider-missing.sqlite"),
      provider: "openai",
      minScore: 0.35,
      hybrid: { enabled: true },
    });
    const manager = await getFreshManager(cfg);
    try {
      await expect(manager.search("Alpha")).rejects.toThrow(
        /Memory search unavailable: embedding provider "openai" is configured but unavailable\.[\s\S]*agentId=main purpose=default[\s\S]*registeredMemoryEmbeddingProviders=none/,
      );
      await expect(manager.sync({ reason: "test" })).rejects.toThrow(
        /Memory sync unavailable: embedding provider "openai" is configured but unavailable\./,
      );
      forceNoProvider = false;
      await manager.sync({ reason: "test", force: true });
      const results = await manager.search("Alpha");
      expect(results.length).toBeGreaterThan(0);
    } finally {
      await manager.close?.();
    }
  });

  it("fails fast instead of returning FTS when an explicit provider is lost at runtime", async () => {
    const cfg = createCfg({
      storePath: path.join(workspaceDir, "index-required-provider-runtime-missing.sqlite"),
      provider: "openai",
      minScore: 0.35,
      hybrid: { enabled: true },
    });
    const manager = await getFreshManager(cfg);
    try {
      await manager.sync({ reason: "test", force: true });
      (
        manager as unknown as {
          provider: null;
        }
      ).provider = null;

      await expect(manager.search("Alpha")).rejects.toThrow(
        /Memory search unavailable: embedding provider "openai" is configured but unavailable\./,
      );
    } finally {
      await manager.close?.();
    }
  });
  it("prefers exact session transcript hits in FTS-only mode", async () => {
    try {
      const manager = await getFtsSessionManager({
        stateDirName: ".state-session-ranking",
        storeFileName: "index-fts-session-ranking.sqlite",
      });
      if (!manager) {
        return;
      }

      const memoryPath = path.join(workspaceDir, "MEMORY.md");
      await fs.writeFile(memoryPath, "Project Nebula stale codename: ORBIT-9.\n", "utf8");
      const staleAt = new Date("2020-01-01T00:00:00.000Z");
      await fs.utimes(memoryPath, staleAt, staleAt);

      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      const transcriptPath = path.join(sessionsDir, "session-ranking.jsonl");
      const now = Date.parse("2026-04-07T15:25:04.113Z");
      await fs.writeFile(
        transcriptPath,
        [
          JSON.stringify({
            type: "session",
            id: "session-ranking",
            timestamp: new Date(now - 60_000).toISOString(),
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "user",
              timestamp: new Date(now - 30_000).toISOString(),
              content: [{ type: "text", text: "What is the current Project Nebula codename?" }],
            },
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: new Date(now).toISOString(),
              content: [{ type: "text", text: "The current Project Nebula codename is ORBIT-10." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      await manager.sync({ reason: "test", force: true });
      const results = await manager.search("current Project Nebula codename ORBIT-10", {
        minScore: 0,
        maxResults: 3,
      });

      expect(results[0]?.source).toBe("sessions");
      expect(results[0]?.snippet).toContain("ORBIT-10");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("bootstraps an empty index on first search so session transcript hits are available", async () => {
    try {
      const manager = await getFtsSessionManager({
        stateDirName: ".state-session-bootstrap",
        storeFileName: "index-fts-session-bootstrap.sqlite",
      });
      if (!manager) {
        return;
      }

      const sessionsDir = resolveSessionTranscriptsDirForAgent("main");
      await fs.mkdir(sessionsDir, { recursive: true });
      const transcriptPath = path.join(sessionsDir, "session-bootstrap.jsonl");
      await fs.writeFile(
        transcriptPath,
        [
          JSON.stringify({
            type: "session",
            id: "session-bootstrap",
            timestamp: "2026-04-07T15:24:04.113Z",
          }),
          JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              timestamp: "2026-04-07T15:25:04.113Z",
              content: [{ type: "text", text: "The current Project Nebula codename is ORBIT-10." }],
            },
          }),
        ].join("\n") + "\n",
        "utf8",
      );

      const results = await manager.search("current Project Nebula codename ORBIT-10", {
        minScore: 0,
        maxResults: 3,
      });

      expect(results[0]?.source).toBe("sessions");
      expect(results[0]?.snippet).toContain("ORBIT-10");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("triggers full reindex and cleans up old-model FTS rows when switching from provider to FTS-only", async () => {
    const sharedStorePath = path.join(workspaceDir, "index-provider-to-fts-only.sqlite");

    // Phase 1: sync with a real provider — FTS rows stored under model = "mock-embed"
    const providerCfg = createCfg({ storePath: sharedStorePath, hybrid: { enabled: true } });
    const providerResult = await getMemorySearchManager({ cfg: providerCfg, agentId: "main" });
    const providerManager = requireManager(providerResult);
    managersForCleanup.add(providerManager);
    resetManagerForTest(providerManager);

    await providerManager.sync({ reason: "test" });

    const providerDb = (
      providerManager as unknown as { db: { prepare: (s: string) => { get: () => { c: number } } } }
    ).db;
    const providerFtsRows = providerDb
      .prepare("SELECT COUNT(*) as c FROM chunks_fts WHERE model = 'mock-embed'")
      .get();
    expect(providerFtsRows.c).toBeGreaterThan(0);

    await providerManager.close();
    managersForCleanup.delete(providerManager);

    // Phase 2: switch to FTS-only (no provider) — should trigger full reindex
    forceNoProvider = true;
    const ftsOnlyCfg = createCfg({ storePath: sharedStorePath, hybrid: { enabled: true } });
    const ftsOnlyResult = await getMemorySearchManager({ cfg: ftsOnlyCfg, agentId: "main" });
    const ftsOnlyManager = requireManager(ftsOnlyResult);
    managersForCleanup.add(ftsOnlyManager);

    await ftsOnlyManager.sync({ reason: "test" });

    const db = (
      ftsOnlyManager as unknown as { db: { prepare: (s: string) => { get: () => { c: number } } } }
    ).db;

    // old provider-model rows should be gone after full reindex
    const oldRows = db
      .prepare("SELECT COUNT(*) as c FROM chunks_fts WHERE model = 'mock-embed'")
      .get();
    expect(oldRows.c).toBe(0);

    // new fts-only rows should exist
    const newRows = db
      .prepare("SELECT COUNT(*) as c FROM chunks_fts WHERE model = 'fts-only'")
      .get();
    expect(newRows.c).toBeGreaterThan(0);
  });

  it("builds FTS index and returns search results when no embedding provider is available", async () => {
    forceNoProvider = true;

    const cfg = createCfg({
      storePath: indexFtsOnlyPath,
      minScore: 0.35,
      hybrid: { enabled: true },
    });
    const result = await getMemorySearchManager({ cfg, agentId: "main" });
    const manager = requireManager(result);
    managersForCleanup.add(manager);
    resetManagerForTest(manager);

    await fs.writeFile(
      path.join(memoryDir, "2026-01-12.md"),
      "# Log\nAlpha memory line.\nZebra memory line.",
    );
    await manager.sync({ reason: "test" });

    const status = manager.status();
    // chunks should be indexed via FTS even without a provider
    expect(status.chunks).toBeGreaterThan(0);
    expect(embedBatchCalls).toBe(0);

    // keyword search should still return matching results under the default threshold
    const results = await manager.search("Alpha");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.snippet).toMatch(/Alpha/i);

    // unknown terms should return no results
    const noResults = await manager.search("nonexistent_xyz_keyword");
    expect(noResults.length).toBe(0);
  });
});
