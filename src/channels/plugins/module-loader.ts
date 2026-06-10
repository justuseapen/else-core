<<<<<<< HEAD
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { createJiti } from "jiti";
import { openBoundaryFileSync } from "../../infra/boundary-file-read.js";
import {
  buildPluginLoaderAliasMap,
  buildPluginLoaderJitiOptions,
  shouldPreferNativeJiti,
} from "../../plugins/sdk-alias.js";

const nodeRequire = createRequire(import.meta.url);

function createModuleLoader() {
  const jitiLoaders = new Map<string, ReturnType<typeof createJiti>>();

  return (modulePath: string) => {
    const tryNative =
      shouldPreferNativeJiti(modulePath) || modulePath.includes(`${path.sep}dist${path.sep}`);
    const aliasMap = buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url);
    const cacheKey = JSON.stringify({
      tryNative,
      aliasMap: Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)),
    });
    const cached = jitiLoaders.get(cacheKey);
    if (cached) {
      return cached;
    }
    const loader = createJiti(import.meta.url, {
      ...buildPluginLoaderJitiOptions(aliasMap),
      tryNative,
    });
    jitiLoaders.set(cacheKey, loader);
    return loader;
  };
}

let loadModule = createModuleLoader();

export function isJavaScriptModulePath(modulePath: string): boolean {
  return [".js", ".mjs", ".cjs"].includes(path.extname(modulePath).toLowerCase());
}

export function resolveCompiledBundledModulePath(modulePath: string): string {
  const compiledDistModulePath = modulePath.replace(
    `${path.sep}dist-runtime${path.sep}`,
    `${path.sep}dist${path.sep}`,
  );
  return compiledDistModulePath !== modulePath && fs.existsSync(compiledDistModulePath)
    ? compiledDistModulePath
    : modulePath;
}

export function resolvePluginModuleCandidates(rootDir: string, specifier: string): string[] {
=======
/**
 * Channel plugin module loader.
 *
 * Loads JavaScript or source plugin modules through native require or cached TS loaders.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { openRootFileSync } from "../../infra/boundary-file-read.js";
import { isJavaScriptModulePath } from "../../plugins/native-module-require.js";
import {
  getCachedPluginModuleLoader,
  type PluginModuleLoaderCache,
  type PluginModuleLoaderFactory,
} from "../../plugins/plugin-module-loader-cache.js";

const nodeRequire = createRequire(import.meta.url);
const SOURCE_MODULE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);
const jitiLoaders: PluginModuleLoaderCache = new Map();
let channelPluginModuleLoaderFactoryForTest: PluginModuleLoaderFactory | undefined;

/**
 * Installs a test-only module loader factory for source channel plugin modules.
 */
export function setChannelPluginModuleLoaderFactoryForTest(
  factory?: PluginModuleLoaderFactory,
): void {
  channelPluginModuleLoaderFactoryForTest = factory;
  jitiLoaders.clear();
}

function hasNativeSourceRequireHook(modulePath: string): boolean {
  const extension = path.extname(modulePath).toLowerCase();
  return (
    SOURCE_MODULE_EXTENSIONS.has(extension) &&
    typeof nodeRequire.extensions?.[extension] === "function"
  );
}

function isSourceModulePath(modulePath: string): boolean {
  return SOURCE_MODULE_EXTENSIONS.has(path.extname(modulePath).toLowerCase());
}

function loadModuleWithJiti(modulePath: string): unknown {
  const loadWithJiti = getCachedPluginModuleLoader({
    cache: jitiLoaders,
    modulePath,
    importerUrl: import.meta.url,
    loaderFilename: import.meta.url,
    tryNative: false,
    cacheScopeKey: "channel-plugin-module-loader",
    ...(channelPluginModuleLoaderFactoryForTest
      ? { createLoader: channelPluginModuleLoaderFactoryForTest }
      : {}),
  });
  return loadWithJiti(modulePath);
}

function loadModule(modulePath: string): unknown {
  if (!isJavaScriptModulePath(modulePath) && !hasNativeSourceRequireHook(modulePath)) {
    if (isSourceModulePath(modulePath)) {
      // Local source plugins need the TS loader unless the current runtime has
      // installed a native source require hook for that extension.
      return loadModuleWithJiti(modulePath);
    }
    throw new Error(`channel plugin module must be built JavaScript: ${modulePath}`);
  }
  try {
    return nodeRequire(modulePath);
  } catch (error) {
    if (isSourceModulePath(modulePath)) {
      // Native source hooks can still fail on ESM/TS edge cases; fall back to
      // the cached loader before surfacing the error.
      return loadModuleWithJiti(modulePath);
    }
    throw new Error(`failed to load channel plugin module with native require: ${modulePath}`, {
      cause: error,
    });
  }
}

function resolvePluginModuleCandidates(rootDir: string, specifier: string): string[] {
>>>>>>> upstream/main
  const normalizedSpecifier = specifier.replace(/\\/g, "/");
  const resolvedPath = path.resolve(rootDir, normalizedSpecifier);
  const ext = path.extname(resolvedPath);
  if (ext) {
    return [resolvedPath];
  }
  return [
    resolvedPath,
    `${resolvedPath}.ts`,
<<<<<<< HEAD
    `${resolvedPath}.js`,
    `${resolvedPath}.mjs`,
=======
    `${resolvedPath}.mts`,
    `${resolvedPath}.js`,
    `${resolvedPath}.mjs`,
    `${resolvedPath}.cts`,
>>>>>>> upstream/main
    `${resolvedPath}.cjs`,
  ];
}

<<<<<<< HEAD
=======
/**
 * Resolves a plugin-relative module specifier to an existing candidate path.
 */
>>>>>>> upstream/main
export function resolveExistingPluginModulePath(rootDir: string, specifier: string): string {
  for (const candidate of resolvePluginModuleCandidates(rootDir, specifier)) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.resolve(rootDir, specifier);
}

<<<<<<< HEAD
=======
/**
 * Loads a channel plugin module after enforcing plugin-root file boundaries.
 */
>>>>>>> upstream/main
export function loadChannelPluginModule(params: {
  modulePath: string;
  rootDir: string;
  boundaryRootDir?: string;
  boundaryLabel?: string;
<<<<<<< HEAD
  shouldTryNativeRequire?: (safePath: string) => boolean;
}): unknown {
  const opened = openBoundaryFileSync({
=======
}): unknown {
  const opened = openRootFileSync({
>>>>>>> upstream/main
    absolutePath: params.modulePath,
    rootPath: params.boundaryRootDir ?? params.rootDir,
    boundaryLabel: params.boundaryLabel ?? "plugin root",
    rejectHardlinks: false,
    skipLexicalRootCheck: true,
  });
  if (!opened.ok) {
    throw new Error(
      `${params.boundaryLabel ?? "plugin"} module path escapes plugin root or fails alias checks`,
    );
  }
  const safePath = opened.path;
<<<<<<< HEAD
  fs.closeSync(opened.fd);
  if (process.platform === "win32" && params.shouldTryNativeRequire?.(safePath)) {
    try {
      return nodeRequire(safePath);
    } catch {
      // Fall back to the Jiti loader path when require() cannot handle the entry.
    }
  }
  return loadModule(safePath)(safePath);
=======
  // The boundary check opens the file to verify the path; close before loading
  // through require/jiti so module evaluation owns its own descriptor lifecycle.
  fs.closeSync(opened.fd);
  return loadModule(safePath);
>>>>>>> upstream/main
}
