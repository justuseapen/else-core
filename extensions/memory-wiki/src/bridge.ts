<<<<<<< HEAD
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveMemoryHostEventLogPath } from "openclaw/plugin-sdk/memory-host-events";
import {
  resolveMemoryCorePluginConfig,
  resolveMemoryDreamingWorkspaces,
} from "openclaw/plugin-sdk/memory-host-status";
import type { OpenClawConfig } from "../api.js";
import type { ResolvedMemoryWikiConfig } from "./config.js";
import { appendMemoryWikiLog } from "./log.js";
import { renderMarkdownFence, renderWikiMarkdown, slugifyWikiSegment } from "./markdown.js";
import {
  pruneImportedSourceEntries,
  readMemoryWikiSourceSyncState,
  setImportedSourceEntry,
  shouldSkipImportedSourceWrite,
=======
// Memory Wiki plugin module implements bridge behavior.
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getMemoryCapabilityRegistration,
  listActiveMemoryPublicArtifacts,
  type MemoryPluginPublicArtifact,
} from "openclaw/plugin-sdk/memory-host-core";
import type { OpenClawConfig } from "../api.js";
import type { ResolvedMemoryWikiConfig } from "./config.js";
import { appendMemoryWikiLog } from "./log.js";
import {
  createWikiPageFilename,
  renderMarkdownFence,
  renderWikiMarkdown,
  slugifyWikiSegment,
} from "./markdown.js";
import { writeImportedSourcePage } from "./source-page-shared.js";
import { resolveArtifactKey } from "./source-path-shared.js";
import {
  assertMemoryWikiSourceSyncStateCapacity,
  pruneImportedSourceEntries,
  readMemoryWikiSourceSyncState,
>>>>>>> upstream/main
  writeMemoryWikiSourceSyncState,
} from "./source-sync-state.js";
import { initializeMemoryWikiVault } from "./vault.js";

type BridgeArtifact = {
  syncKey: string;
  artifactType: "markdown" | "memory-events";
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
};

export type BridgeMemoryWikiResult = {
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  removedCount: number;
  artifactCount: number;
  workspaces: number;
  pagePaths: string[];
};

<<<<<<< HEAD
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdownFilesRecursive(rootDir: string): Promise<string[]> {
  const entries = await fs.readdir(rootDir, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFilesRecursive(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files.toSorted((left, right) => left.localeCompare(right));
}

async function resolveArtifactKey(absolutePath: string): Promise<string> {
  const canonicalPath = await fs.realpath(absolutePath).catch(() => path.resolve(absolutePath));
  return process.platform === "win32" ? canonicalPath.toLowerCase() : canonicalPath;
}

async function collectWorkspaceArtifacts(
  workspaceDir: string,
  bridgeConfig: ResolvedMemoryWikiConfig["bridge"],
): Promise<BridgeArtifact[]> {
  const artifacts: BridgeArtifact[] = [];
  if (bridgeConfig.indexMemoryRoot) {
    for (const relPath of ["MEMORY.md", "memory.md"]) {
      const absolutePath = path.join(workspaceDir, relPath);
      if (await pathExists(absolutePath)) {
        const syncKey = await resolveArtifactKey(absolutePath);
        artifacts.push({
          syncKey,
          artifactType: "markdown",
          workspaceDir,
          relativePath: relPath,
          absolutePath,
        });
      }
    }
  }

  if (bridgeConfig.indexDailyNotes) {
    const memoryDir = path.join(workspaceDir, "memory");
    const files = await listMarkdownFilesRecursive(memoryDir);
    for (const absolutePath of files) {
      const relativePath = path.relative(workspaceDir, absolutePath).replace(/\\/g, "/");
      if (!relativePath.startsWith("memory/dreaming/")) {
        const syncKey = await resolveArtifactKey(absolutePath);
        artifacts.push({
          syncKey,
          artifactType: "markdown",
          workspaceDir,
          relativePath,
          absolutePath,
        });
      }
    }
  }

  if (bridgeConfig.indexDreamReports) {
    const dreamingDir = path.join(workspaceDir, "memory", "dreaming");
    const files = await listMarkdownFilesRecursive(dreamingDir);
    for (const absolutePath of files) {
      const relativePath = path.relative(workspaceDir, absolutePath).replace(/\\/g, "/");
      const syncKey = await resolveArtifactKey(absolutePath);
      artifacts.push({
        syncKey,
        artifactType: "markdown",
        workspaceDir,
        relativePath,
        absolutePath,
      });
    }
  }

  if (bridgeConfig.followMemoryEvents) {
    const eventLogPath = resolveMemoryHostEventLogPath(workspaceDir);
    if (await pathExists(eventLogPath)) {
      const syncKey = await resolveArtifactKey(eventLogPath);
      artifacts.push({
        syncKey,
        artifactType: "memory-events",
        workspaceDir,
        relativePath: path.relative(workspaceDir, eventLogPath).replace(/\\/g, "/"),
        absolutePath: eventLogPath,
      });
    }
  }

  const deduped = new Map<string, BridgeArtifact>();
  for (const artifact of artifacts) {
=======
function shouldImportArtifact(
  artifact: MemoryPluginPublicArtifact,
  bridgeConfig: ResolvedMemoryWikiConfig["bridge"],
): boolean {
  switch (artifact.kind) {
    case "memory-root":
      return bridgeConfig.indexMemoryRoot;
    case "daily-note":
      return bridgeConfig.indexDailyNotes;
    case "dream-report":
      return bridgeConfig.indexDreamReports;
    case "event-log":
      return bridgeConfig.followMemoryEvents;
    default:
      return false;
  }
}

async function collectBridgeArtifacts(
  bridgeConfig: ResolvedMemoryWikiConfig["bridge"],
  artifacts: MemoryPluginPublicArtifact[],
): Promise<BridgeArtifact[]> {
  const collected: BridgeArtifact[] = [];
  for (const artifact of artifacts) {
    if (!shouldImportArtifact(artifact, bridgeConfig)) {
      continue;
    }
    const syncKey = await resolveArtifactKey(artifact.absolutePath);
    collected.push({
      syncKey,
      artifactType: artifact.kind === "event-log" ? "memory-events" : "markdown",
      workspaceDir: artifact.workspaceDir,
      relativePath: artifact.relativePath,
      absolutePath: artifact.absolutePath,
    });
  }
  const deduped = new Map<string, BridgeArtifact>();
  for (const artifact of collected) {
>>>>>>> upstream/main
    deduped.set(artifact.syncKey, artifact);
  }
  return [...deduped.values()];
}

function resolveBridgeTitle(artifact: BridgeArtifact, agentIds: string[]): string {
  if (artifact.artifactType === "memory-events") {
    if (agentIds.length === 0) {
      return "Memory Bridge: event journal";
    }
    return `Memory Bridge (${agentIds.join(", ")}): event journal`;
  }
  const base = artifact.relativePath
    .replace(/\.md$/i, "")
    .replace(/^memory\//, "")
    .replace(/\//g, " / ");
  if (agentIds.length === 0) {
    return `Memory Bridge: ${base}`;
  }
  return `Memory Bridge (${agentIds.join(", ")}): ${base}`;
}

function resolveBridgePagePath(params: { workspaceDir: string; relativePath: string }): {
  pageId: string;
  pagePath: string;
  workspaceSlug: string;
  artifactSlug: string;
} {
  const workspaceBaseSlug = slugifyWikiSegment(path.basename(params.workspaceDir));
  const workspaceHash = createHash("sha1").update(path.resolve(params.workspaceDir)).digest("hex");
  const artifactBaseSlug = slugifyWikiSegment(
    params.relativePath.replace(/\.md$/i, "").replace(/\//g, "-"),
  );
  const artifactHash = createHash("sha1").update(params.relativePath).digest("hex");
  const workspaceSlug = `${workspaceBaseSlug}-${workspaceHash.slice(0, 8)}`;
  const artifactSlug = `${artifactBaseSlug}-${artifactHash.slice(0, 8)}`;
<<<<<<< HEAD
  return {
    pageId: `source.bridge.${workspaceSlug}.${artifactSlug}`,
    pagePath: path
      .join("sources", `bridge-${workspaceSlug}-${artifactSlug}.md`)
      .replace(/\\/g, "/"),
=======
  const fileName = createWikiPageFilename(`bridge-${workspaceSlug}-${artifactSlug}`);
  return {
    pageId: `source.bridge.${workspaceSlug}.${artifactSlug}`,
    pagePath: path.join("sources", fileName).replace(/\\/g, "/"),
>>>>>>> upstream/main
    workspaceSlug,
    artifactSlug,
  };
}

async function writeBridgeSourcePage(params: {
  config: ResolvedMemoryWikiConfig;
  artifact: BridgeArtifact;
  agentIds: string[];
  sourceUpdatedAtMs: number;
  sourceSize: number;
  state: Awaited<ReturnType<typeof readMemoryWikiSourceSyncState>>;
}): Promise<{ pagePath: string; changed: boolean; created: boolean }> {
  const { pageId, pagePath } = resolveBridgePagePath({
    workspaceDir: params.artifact.workspaceDir,
    relativePath: params.artifact.relativePath,
  });
  const title = resolveBridgeTitle(params.artifact, params.agentIds);
<<<<<<< HEAD
  const pageAbsPath = path.join(params.config.vault.path, pagePath);
  const created = !(await pathExists(pageAbsPath));
  const sourceUpdatedAt = new Date(params.sourceUpdatedAtMs).toISOString();
=======
>>>>>>> upstream/main
  const renderFingerprint = createHash("sha1")
    .update(
      JSON.stringify({
        artifactType: params.artifact.artifactType,
        workspaceDir: params.artifact.workspaceDir,
        relativePath: params.artifact.relativePath,
        agentIds: params.agentIds,
      }),
    )
    .digest("hex");
<<<<<<< HEAD
  const shouldSkip = await shouldSkipImportedSourceWrite({
    vaultRoot: params.config.vault.path,
    syncKey: params.artifact.syncKey,
    expectedPagePath: pagePath,
    expectedSourcePath: params.artifact.absolutePath,
    sourceUpdatedAtMs: params.sourceUpdatedAtMs,
    sourceSize: params.sourceSize,
    renderFingerprint,
    state: params.state,
  });
  if (shouldSkip) {
    return { pagePath, changed: false, created };
  }
  const raw = await fs.readFile(params.artifact.absolutePath, "utf8");
  const contentLanguage = params.artifact.artifactType === "memory-events" ? "json" : "markdown";
  const rendered = renderWikiMarkdown({
    frontmatter: {
      pageType: "source",
      id: pageId,
      title,
      sourceType:
        params.artifact.artifactType === "memory-events" ? "memory-bridge-events" : "memory-bridge",
      sourcePath: params.artifact.absolutePath,
      bridgeRelativePath: params.artifact.relativePath,
      bridgeWorkspaceDir: params.artifact.workspaceDir,
      bridgeAgentIds: params.agentIds,
      status: "active",
      updatedAt: sourceUpdatedAt,
    },
    body: [
      `# ${title}`,
      "",
      "## Bridge Source",
      `- Workspace: \`${params.artifact.workspaceDir}\``,
      `- Relative path: \`${params.artifact.relativePath}\``,
      `- Kind: \`${params.artifact.artifactType}\``,
      `- Agents: ${params.agentIds.length > 0 ? params.agentIds.join(", ") : "unknown"}`,
      `- Updated: ${sourceUpdatedAt}`,
      "",
      "## Content",
      renderMarkdownFence(raw, contentLanguage),
      "",
      "## Notes",
      "<!-- openclaw:human:start -->",
      "<!-- openclaw:human:end -->",
      "",
    ].join("\n"),
  });
  const existing = await fs.readFile(pageAbsPath, "utf8").catch(() => "");
  if (existing !== rendered) {
    await fs.writeFile(pageAbsPath, rendered, "utf8");
  }
  setImportedSourceEntry({
    syncKey: params.artifact.syncKey,
    state: params.state,
    entry: {
      group: "bridge",
      pagePath,
      sourcePath: params.artifact.absolutePath,
      sourceUpdatedAtMs: params.sourceUpdatedAtMs,
      sourceSize: params.sourceSize,
      renderFingerprint,
    },
  });
  return { pagePath, changed: existing !== rendered, created };
=======
  return writeImportedSourcePage({
    vaultRoot: params.config.vault.path,
    syncKey: params.artifact.syncKey,
    sourcePath: params.artifact.absolutePath,
    sourceUpdatedAtMs: params.sourceUpdatedAtMs,
    sourceSize: params.sourceSize,
    renderFingerprint,
    pagePath,
    group: "bridge",
    state: params.state,
    buildRendered: (raw, updatedAt) => {
      const contentLanguage =
        params.artifact.artifactType === "memory-events" ? "json" : "markdown";
      return renderWikiMarkdown({
        frontmatter: {
          pageType: "source",
          id: pageId,
          title,
          sourceType:
            params.artifact.artifactType === "memory-events"
              ? "memory-bridge-events"
              : "memory-bridge",
          sourcePath: params.artifact.absolutePath,
          bridgeRelativePath: params.artifact.relativePath,
          bridgeWorkspaceDir: params.artifact.workspaceDir,
          bridgeAgentIds: params.agentIds,
          status: "active",
          updatedAt,
        },
        body: [
          `# ${title}`,
          "",
          "## Bridge Source",
          `- Workspace: \`${params.artifact.workspaceDir}\``,
          `- Relative path: \`${params.artifact.relativePath}\``,
          `- Kind: \`${params.artifact.artifactType}\``,
          `- Agents: ${params.agentIds.length > 0 ? params.agentIds.join(", ") : "unknown"}`,
          `- Updated: ${updatedAt}`,
          "",
          "## Content",
          renderMarkdownFence(raw, contentLanguage),
          "",
          "## Notes",
          "<!-- openclaw:human:start -->",
          "<!-- openclaw:human:end -->",
          "",
        ].join("\n"),
      });
    },
  });
>>>>>>> upstream/main
}

export async function syncMemoryWikiBridgeSources(params: {
  config: ResolvedMemoryWikiConfig;
  appConfig?: OpenClawConfig;
}): Promise<BridgeMemoryWikiResult> {
  await initializeMemoryWikiVault(params.config);
  if (
    params.config.vaultMode !== "bridge" ||
    !params.config.bridge.enabled ||
<<<<<<< HEAD
    !params.config.bridge.readMemoryCore ||
=======
    !params.config.bridge.readMemoryArtifacts ||
>>>>>>> upstream/main
    !params.appConfig
  ) {
    return {
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
    };
  }

<<<<<<< HEAD
  const memoryPluginConfig = resolveMemoryCorePluginConfig(params.appConfig);
  if (!memoryPluginConfig) {
    return {
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
    };
  }

  const workspaces = resolveMemoryDreamingWorkspaces(params.appConfig);
  const state = await readMemoryWikiSourceSyncState(params.config.vault.path);
  const results: Array<{ pagePath: string; changed: boolean; created: boolean }> = [];
  let artifactCount = 0;
  const activeKeys = new Set<string>();
  for (const workspace of workspaces) {
    const artifacts = await collectWorkspaceArtifacts(workspace.workspaceDir, params.config.bridge);
    artifactCount += artifacts.length;
    for (const artifact of artifacts) {
      const stats = await fs.stat(artifact.absolutePath);
      activeKeys.add(artifact.syncKey);
      results.push(
        await writeBridgeSourcePage({
          config: params.config,
          artifact,
          agentIds: workspace.agentIds,
          sourceUpdatedAtMs: stats.mtimeMs,
          sourceSize: stats.size,
          state,
        }),
      );
    }
  }

  const removedCount = await pruneImportedSourceEntries({
    vaultRoot: params.config.vault.path,
    group: "bridge",
    activeKeys,
    state,
  });
=======
  const publicArtifacts = await listActiveMemoryPublicArtifacts({ cfg: params.appConfig });
  const results: Array<{ pagePath: string; changed: boolean; created: boolean }> = [];
  const activeKeys = new Set<string>();
  const artifacts = await collectBridgeArtifacts(params.config.bridge, publicArtifacts);
  const state = await readMemoryWikiSourceSyncState(params.config.vault.path);
  assertMemoryWikiSourceSyncStateCapacity({
    state,
    group: "bridge",
    incomingCount: artifacts.length,
  });
  const agentIdsByWorkspace = new Map<string, string[]>();
  for (const artifact of publicArtifacts) {
    agentIdsByWorkspace.set(artifact.workspaceDir, artifact.agentIds);
  }
  const artifactCount = artifacts.length;
  for (const artifact of artifacts) {
    const stats = await fs.stat(artifact.absolutePath);
    activeKeys.add(artifact.syncKey);
    results.push(
      await writeBridgeSourcePage({
        config: params.config,
        artifact,
        agentIds: agentIdsByWorkspace.get(artifact.workspaceDir) ?? [],
        sourceUpdatedAtMs: stats.mtimeMs,
        sourceSize: stats.size,
        state,
      }),
    );
  }
  const workspaceCount = new Set(publicArtifacts.map((artifact) => artifact.workspaceDir)).size;

  // Skip pruning when memory-core is not loaded (e.g. CLI context) to avoid
  // removing all bridge-imported entries. See #68373.
  const memoryCapability = getMemoryCapabilityRegistration();
  const removedCount = memoryCapability
    ? await pruneImportedSourceEntries({
        vaultRoot: params.config.vault.path,
        group: "bridge",
        activeKeys,
        state,
      })
    : 0;
>>>>>>> upstream/main
  await writeMemoryWikiSourceSyncState(params.config.vault.path, state);
  const importedCount = results.filter((result) => result.changed && result.created).length;
  const updatedCount = results.filter((result) => result.changed && !result.created).length;
  const skippedCount = results.filter((result) => !result.changed).length;
  const pagePaths = results
    .map((result) => result.pagePath)
    .toSorted((left, right) => left.localeCompare(right));

  if (importedCount > 0 || updatedCount > 0 || removedCount > 0) {
    await appendMemoryWikiLog(params.config.vault.path, {
      type: "ingest",
      timestamp: new Date().toISOString(),
      details: {
        sourceType: "memory-bridge",
<<<<<<< HEAD
        workspaces: workspaces.length,
=======
        workspaces: workspaceCount,
>>>>>>> upstream/main
        artifactCount,
        importedCount,
        updatedCount,
        skippedCount,
        removedCount,
      },
    });
  }

  return {
    importedCount,
    updatedCount,
    skippedCount,
    removedCount,
    artifactCount,
<<<<<<< HEAD
    workspaces: workspaces.length,
=======
    workspaces: workspaceCount,
>>>>>>> upstream/main
    pagePaths,
  };
}
