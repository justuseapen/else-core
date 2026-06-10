<<<<<<< HEAD
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveStateDir } from "./api.js";

=======
// Memory Lancedb plugin module implements lancedb runtime behavior.
>>>>>>> upstream/main
type LanceDbModule = typeof import("@lancedb/lancedb");

export type LanceDbRuntimeLogger = {
  info?: (message: string) => void;
  warn?: (message: string) => void;
};

<<<<<<< HEAD
type RuntimeManifest = {
  name: string;
  private: true;
  type: "module";
  dependencies: Record<string, string>;
};

type PackageJsonWithDependencies = {
  dependencies?: Record<string, string>;
};

type ReadPackageJson = (manifestPath: string) => PackageJsonWithDependencies | null;

=======
>>>>>>> upstream/main
type LanceDbRuntimeLoaderDeps = {
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
  importBundled: () => Promise<LanceDbModule>;
};

<<<<<<< HEAD
function defaultReadPackageJson(manifestPath: string): PackageJsonWithDependencies | null {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as PackageJsonWithDependencies;
  } catch {
    return null;
  }
}

function buildMemoryLanceDbManifestCandidates(modulePath: string): string[] {
  const moduleDir = path.dirname(modulePath);
  const candidates = new Set<string>();
  candidates.add(path.join(moduleDir, "package.json"));

  let cursor = moduleDir;
  while (true) {
    candidates.add(path.join(cursor, "extensions", "memory-lancedb", "package.json"));
    const parent = path.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }

  return [...candidates];
}

export function resolveLanceDbDependencySpec(
  modulePath: string,
  readPackageJson: ReadPackageJson = defaultReadPackageJson,
): string {
  for (const manifestPath of buildMemoryLanceDbManifestCandidates(modulePath)) {
    const lanceDbSpec = readPackageJson(manifestPath)?.dependencies?.["@lancedb/lancedb"];
    if (lanceDbSpec) {
      return lanceDbSpec;
    }
  }
  throw new Error('memory-lancedb package.json is missing "@lancedb/lancedb"');
}

const MEMORY_LANCEDB_RUNTIME_MANIFEST: RuntimeManifest = (() => {
  const lanceDbSpec = resolveLanceDbDependencySpec(fileURLToPath(import.meta.url));
  return {
    name: "openclaw-memory-lancedb-runtime",
    private: true,
    type: "module",
    dependencies: {
      "@lancedb/lancedb": lanceDbSpec,
    },
  };
})();

function resolveRuntimeDir(stateDir: string): string {
  return path.join(stateDir, "plugin-runtimes", "memory-lancedb", "lancedb");
=======
function buildLoadFailureMessage(error: unknown): string {
  return [
    "memory-lancedb: bundled @lancedb/lancedb dependency is unavailable.",
    "Install or repair the memory-lancedb plugin package dependencies, then restart OpenClaw.",
    String(error),
  ].join(" ");
>>>>>>> upstream/main
}

function isUnsupportedNativePlatform(params: {
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
}): boolean {
  return params.platform === "darwin" && params.arch === "x64";
}

function buildUnsupportedNativePlatformMessage(params: {
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
}): string {
  return [
    `memory-lancedb: LanceDB runtime is unavailable on ${params.platform}-${params.arch}.`,
    "The bundled @lancedb/lancedb dependency does not publish a native package for this platform.",
    "Disable memory-lancedb or switch to a supported memory backend/platform.",
  ].join(" ");
}

export function createLanceDbRuntimeLoader(overrides: Partial<LanceDbRuntimeLoaderDeps> = {}): {
  load: (loggerInstance?: LanceDbRuntimeLogger) => Promise<LanceDbModule>;
} {
  const deps: LanceDbRuntimeLoaderDeps = {
    platform: overrides.platform ?? process.platform,
    arch: overrides.arch ?? process.arch,
    importBundled: overrides.importBundled ?? (() => import("@lancedb/lancedb")),
  };

  let loadPromise: Promise<LanceDbModule> | null = null;

  return {
    async load(_logger?: LanceDbRuntimeLogger): Promise<LanceDbModule> {
      if (!loadPromise) {
        loadPromise = deps.importBundled().catch((error: unknown) => {
          loadPromise = null;
          if (isUnsupportedNativePlatform({ platform: deps.platform, arch: deps.arch })) {
            throw new Error(
              buildUnsupportedNativePlatformMessage({
                platform: deps.platform,
                arch: deps.arch,
              }),
              { cause: error },
            );
          }
          throw new Error(buildLoadFailureMessage(error), { cause: error });
        });
      }
      return await loadPromise;
    },
  };
}

const defaultLoader = createLanceDbRuntimeLoader();

export async function loadLanceDbModule(logger?: LanceDbRuntimeLogger): Promise<LanceDbModule> {
  return await defaultLoader.load(logger);
}
