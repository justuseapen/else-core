<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { syncMemoryWikiImportedSources } from "./source-sync.js";
import { createMemoryWikiTestHarness } from "./test-helpers.js";

const { createTempDir, createVault } = createMemoryWikiTestHarness();

describe("syncMemoryWikiImportedSources", () => {
  it("refreshes indexes when imported sources change and skips when they do not", async () => {
    const privateDir = await createTempDir("memory-wiki-sync-private-");

    const sourcePath = path.join(privateDir, "alpha.md");
    await fs.writeFile(sourcePath, "# Alpha\n", "utf8");

    const { rootDir: vaultDir, config } = await createVault({
      prefix: "memory-wiki-sync-vault-",
      config: {
        vaultMode: "unsafe-local",
        unsafeLocal: {
          allowPrivateMemoryCoreAccess: true,
          paths: [sourcePath],
        },
      },
    });

    const first = await syncMemoryWikiImportedSources({ config });

    expect(first.indexesRefreshed).toBe(true);
    expect(first.indexRefreshReason).toBe("import-changed");
    await expect(fs.readFile(path.join(vaultDir, "index.md"), "utf8")).resolves.toContain(
      "Unsafe Local Import: alpha.md",
    );

    const second = await syncMemoryWikiImportedSources({ config });

    expect(second.indexesRefreshed).toBe(false);
    expect(second.indexRefreshReason).toBe("no-import-changes");

    await fs.rm(path.join(vaultDir, "sources", "index.md"));
    const third = await syncMemoryWikiImportedSources({ config });

    expect(third.indexesRefreshed).toBe(true);
    expect(third.indexRefreshReason).toBe("missing-indexes");
    await expect(
      fs.readFile(path.join(vaultDir, "sources", "index.md"), "utf8"),
    ).resolves.toContain("Unsafe Local Import: alpha.md");
  });

  it("respects ingest.autoCompile=false", async () => {
    const privateDir = await createTempDir("memory-wiki-sync-private-");

    const sourcePath = path.join(privateDir, "alpha.md");
    await fs.writeFile(sourcePath, "# Alpha\n", "utf8");

    const { config } = await createVault({
      prefix: "memory-wiki-sync-vault-",
      config: {
        vaultMode: "unsafe-local",
        unsafeLocal: {
          allowPrivateMemoryCoreAccess: true,
          paths: [sourcePath],
        },
        ingest: {
          autoCompile: false,
        },
      },
    });

    const result = await syncMemoryWikiImportedSources({ config });

    expect(result.indexesRefreshed).toBe(false);
    expect(result.indexRefreshReason).toBe("auto-compile-disabled");
=======
// Memory Wiki tests cover source sync plugin behavior.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncMemoryWikiImportedSources } from "./source-sync.js";

const { syncBridgeMock, syncUnsafeLocalMock, refreshIndexesMock } = vi.hoisted(() => ({
  syncBridgeMock: vi.fn(),
  syncUnsafeLocalMock: vi.fn(),
  refreshIndexesMock: vi.fn(),
}));

vi.mock("./bridge.js", () => ({
  syncMemoryWikiBridgeSources: syncBridgeMock,
}));

vi.mock("./unsafe-local.js", () => ({
  syncMemoryWikiUnsafeLocalSources: syncUnsafeLocalMock,
}));

vi.mock("./compile.js", () => ({
  refreshMemoryWikiIndexesAfterImport: refreshIndexesMock,
}));

const bridgeResult = {
  importedCount: 1,
  updatedCount: 2,
  skippedCount: 3,
  removedCount: 4,
  artifactCount: 10,
  workspaces: 2,
  pagePaths: ["sources/alpha.md"],
};

describe("syncMemoryWikiImportedSources", () => {
  beforeEach(() => {
    syncBridgeMock.mockReset();
    syncUnsafeLocalMock.mockReset();
    refreshIndexesMock.mockReset();
    syncBridgeMock.mockResolvedValue(bridgeResult);
    syncUnsafeLocalMock.mockResolvedValue({
      ...bridgeResult,
      workspaces: 0,
    });
    refreshIndexesMock.mockResolvedValue({
      refreshed: true,
      reason: "import-changed",
      compile: { updatedFiles: ["index.md", "sources/index.md"] },
    });
  });

  it("routes bridge mode through bridge sync and merges refresh results", async () => {
    const config = { vaultMode: "bridge" } as Parameters<
      typeof syncMemoryWikiImportedSources
    >[0]["config"];
    const appConfig = { agents: { list: [{ id: "main", default: true }] } } as Parameters<
      typeof syncMemoryWikiImportedSources
    >[0]["appConfig"];

    const result = await syncMemoryWikiImportedSources({ config, appConfig });

    expect(syncBridgeMock).toHaveBeenCalledWith({ config, appConfig });
    expect(syncUnsafeLocalMock).not.toHaveBeenCalled();
    expect(refreshIndexesMock).toHaveBeenCalledWith({
      config,
      syncResult: bridgeResult,
    });
    expect(result).toEqual({
      ...bridgeResult,
      indexesRefreshed: true,
      indexRefreshReason: "import-changed",
      indexUpdatedFiles: ["index.md", "sources/index.md"],
    });
  });

  it("routes unsafe-local mode through unsafe-local sync", async () => {
    const unsafeLocalResult = {
      ...bridgeResult,
      importedCount: 2,
      workspaces: 0,
      pagePaths: ["sources/private.md"],
    };
    syncUnsafeLocalMock.mockResolvedValueOnce(unsafeLocalResult);
    refreshIndexesMock.mockResolvedValueOnce({
      refreshed: false,
      reason: "auto-compile-disabled",
    });
    const config = { vaultMode: "unsafe-local" } as Parameters<
      typeof syncMemoryWikiImportedSources
    >[0]["config"];

    const result = await syncMemoryWikiImportedSources({ config });

    expect(syncUnsafeLocalMock).toHaveBeenCalledWith(config);
    expect(syncBridgeMock).not.toHaveBeenCalled();
    expect(refreshIndexesMock).toHaveBeenCalledWith({
      config,
      syncResult: unsafeLocalResult,
    });
    expect(result).toEqual({
      ...unsafeLocalResult,
      indexesRefreshed: false,
      indexRefreshReason: "auto-compile-disabled",
      indexUpdatedFiles: [],
    });
  });

  it("returns a no-op sync result outside imported-source modes", async () => {
    const config = { vaultMode: "isolated" } as Parameters<
      typeof syncMemoryWikiImportedSources
    >[0]["config"];

    const result = await syncMemoryWikiImportedSources({ config });

    expect(syncBridgeMock).not.toHaveBeenCalled();
    expect(syncUnsafeLocalMock).not.toHaveBeenCalled();
    expect(refreshIndexesMock).toHaveBeenCalledWith({
      config,
      syncResult: {
        importedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        removedCount: 0,
        artifactCount: 0,
        workspaces: 0,
        pagePaths: [],
      },
    });
    expect(result).toEqual({
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
      indexesRefreshed: true,
      indexRefreshReason: "import-changed",
      indexUpdatedFiles: ["index.md", "sources/index.md"],
    });
>>>>>>> upstream/main
  });
});
