<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import { normalizeProviderId } from "../agents/provider-id.js";
import type { OpenClawConfig } from "../config/config.js";
import { buildPluginApi } from "./api-builder.js";
import { discoverOpenClawPlugins } from "./discovery.js";
import { loadPluginManifestRegistry } from "./manifest-registry.js";
import { resolvePluginCacheInputs } from "./roots.js";
import type { PluginRuntime } from "./runtime/types.js";
import {
  buildPluginLoaderAliasMap,
  buildPluginLoaderJitiOptions,
  shouldPreferNativeJiti,
} from "./sdk-alias.js";
import type {
=======
// Maintains plugin setup entries discovered from manifests and light exports.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import {
  normalizeStringEntries,
  normalizeUniqueStringEntries,
} from "@openclaw/normalization-core/string-normalization";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { buildPluginApi } from "./api-builder.js";
import { collectPluginConfigContractMatches } from "./config-contracts.js";
import type { PluginManifestRecord, PluginManifestRegistry } from "./manifest-registry.js";
import {
  createPluginModuleLoaderCache,
  getCachedPluginModuleLoader,
  type PluginModuleLoaderFactory,
  type PluginModuleLoaderCache,
} from "./plugin-module-loader-cache.js";
import { loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry.js";
import type { PluginRuntime } from "./runtime/types.js";
import { listSetupCliBackendIds, listSetupProviderIds } from "./setup-descriptors.js";
import type {
  CliBackendPlugin,
>>>>>>> upstream/main
  OpenClawPluginModule,
  PluginConfigMigration,
  PluginLogger,
  PluginSetupAutoEnableProbe,
  ProviderPlugin,
} from "./types.js";

const SETUP_API_EXTENSIONS = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"] as const;
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT =
  CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) ||
  CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);

type SetupProviderEntry = {
  pluginId: string;
  provider: ProviderPlugin;
};

<<<<<<< HEAD
=======
type SetupCliBackendEntry = {
  pluginId: string;
  backend: CliBackendPlugin;
};

>>>>>>> upstream/main
type SetupConfigMigrationEntry = {
  pluginId: string;
  migrate: PluginConfigMigration;
};

type SetupAutoEnableProbeEntry = {
  pluginId: string;
  probe: PluginSetupAutoEnableProbe;
};

<<<<<<< HEAD
type PluginSetupRegistry = {
  providers: SetupProviderEntry[];
  configMigrations: SetupConfigMigrationEntry[];
  autoEnableProbes: SetupAutoEnableProbeEntry[];
=======
export type PluginSetupRegistryDiagnosticCode =
  | "setup-descriptor-runtime-disabled"
  | "setup-descriptor-provider-missing-runtime"
  | "setup-descriptor-provider-runtime-undeclared"
  | "setup-descriptor-cli-backend-missing-runtime"
  | "setup-descriptor-cli-backend-runtime-undeclared";

export type PluginSetupRegistryDiagnostic = {
  pluginId: string;
  code: PluginSetupRegistryDiagnosticCode;
  declaredId?: string;
  runtimeId?: string;
  message: string;
};

type PluginSetupRegistry = {
  providers: SetupProviderEntry[];
  cliBackends: SetupCliBackendEntry[];
  configMigrations: SetupConfigMigrationEntry[];
  autoEnableProbes: SetupAutoEnableProbeEntry[];
  diagnostics: PluginSetupRegistryDiagnostic[];
>>>>>>> upstream/main
};

type SetupAutoEnableReason = {
  pluginId: string;
  reason: string;
};

<<<<<<< HEAD
=======
type PluginApiBuildParams = Parameters<typeof buildPluginApi>[0];

>>>>>>> upstream/main
const EMPTY_RUNTIME = {} as PluginRuntime;
const NOOP_LOGGER: PluginLogger = {
  info() {},
  warn() {},
  error() {},
};

<<<<<<< HEAD
const jitiLoaders = new Map<string, ReturnType<typeof createJiti>>();
const setupRegistryCache = new Map<string, PluginSetupRegistry>();
const setupProviderCache = new Map<string, ProviderPlugin | null>();

export function clearPluginSetupRegistryCache(): void {
  setupRegistryCache.clear();
  setupProviderCache.clear();
}

function getJiti(modulePath: string) {
  const aliasMap = buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url);
  const cacheKey = JSON.stringify({
    tryNative: shouldPreferNativeJiti(modulePath),
    aliasMap: Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)),
  });
  const cached = jitiLoaders.get(cacheKey);
  if (cached) {
    return cached;
  }
  const loader = createJiti(modulePath, buildPluginLoaderJitiOptions(aliasMap));
  jitiLoaders.set(cacheKey, loader);
  return loader;
}

function buildSetupRegistryCacheKey(params: {
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): string {
  const { roots, loadPaths } = resolvePluginCacheInputs({
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  return JSON.stringify({
    roots,
    loadPaths,
  });
}

function buildSetupProviderCacheKey(params: {
  provider: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): string {
  return JSON.stringify({
    provider: normalizeProviderId(params.provider),
    registry: buildSetupRegistryCacheKey(params),
  });
}

function resolveSetupApiPath(rootDir: string): string | null {
=======
const moduleLoaders: PluginModuleLoaderCache = createPluginModuleLoaderCache();
let moduleLoaderFactoryForTest: PluginModuleLoaderFactory | undefined;

export function clearPluginSetupRegistryCache(): void {
  moduleLoaders.clear();
}

export function setPluginSetupRegistryModuleLoaderFactoryForTest(
  factory: PluginModuleLoaderFactory | undefined,
): void {
  moduleLoaderFactoryForTest = factory;
  moduleLoaders.clear();
}

function getModuleLoader(modulePath: string) {
  return getCachedPluginModuleLoader({
    cache: moduleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    ...(moduleLoaderFactoryForTest ? { createLoader: moduleLoaderFactoryForTest } : {}),
  });
}

function resolveSetupApiPath(
  rootDir: string,
  options?: { includeBundledSourceFallback?: boolean },
): string | null {
>>>>>>> upstream/main
  const orderedExtensions = RUNNING_FROM_BUILT_ARTIFACT
    ? SETUP_API_EXTENSIONS
    : ([...SETUP_API_EXTENSIONS.slice(3), ...SETUP_API_EXTENSIONS.slice(0, 3)] as const);

  const findSetupApi = (candidateRootDir: string): string | null => {
    for (const extension of orderedExtensions) {
      const candidate = path.join(candidateRootDir, `setup-api${extension}`);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  };

  const direct = findSetupApi(rootDir);
  if (direct) {
    return direct;
  }

<<<<<<< HEAD
  const bundledExtensionDir = path.basename(rootDir);
  const repoRoot = path.resolve(path.dirname(CURRENT_MODULE_PATH), "..", "..");
  const sourceExtensionRoot = path.join(repoRoot, "extensions", bundledExtensionDir);
  if (sourceExtensionRoot !== rootDir) {
=======
  if (options?.includeBundledSourceFallback === false) {
    return null;
  }

  const bundledExtensionDir = path.basename(rootDir);
  const repoRootCandidates = [path.resolve(path.dirname(CURRENT_MODULE_PATH), "..", "..")];
  for (const repoRoot of repoRootCandidates) {
    const sourceExtensionRoot = path.join(repoRoot, "extensions", bundledExtensionDir);
    if (sourceExtensionRoot === rootDir) {
      continue;
    }
>>>>>>> upstream/main
    const sourceFallback = findSetupApi(sourceExtensionRoot);
    if (sourceFallback) {
      return sourceFallback;
    }
  }

  return null;
}

<<<<<<< HEAD
=======
function collectConfiguredPluginEntryIds(config: OpenClawConfig): string[] {
  const entries = config.plugins?.entries;
  if (!entries || typeof entries !== "object") {
    return [];
  }
  return normalizeStringEntries(Object.keys(entries)).toSorted();
}

function resolveRelevantSetupMigrationPluginIds(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): string[] {
  const ids = new Set<string>(collectConfiguredPluginEntryIds(params.config));
  const registry = loadSetupManifestRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  for (const plugin of registry.plugins) {
    const paths = plugin.configContracts?.compatibilityMigrationPaths;
    if (!paths?.length) {
      continue;
    }
    if (
      paths.some(
        (pathPattern) =>
          collectPluginConfigContractMatches({
            root: params.config,
            pathPattern,
          }).length > 0,
      )
    ) {
      ids.add(plugin.id);
    }
  }
  return [...ids].toSorted();
}

>>>>>>> upstream/main
function resolveRegister(mod: OpenClawPluginModule): {
  definition?: { id?: string };
  register?: (api: ReturnType<typeof buildPluginApi>) => void | Promise<void>;
} {
  if (typeof mod === "function") {
    return { register: mod };
  }
  if (mod && typeof mod === "object" && typeof mod.register === "function") {
    return {
      definition: mod as { id?: string },
      register: mod.register.bind(mod),
    };
  }
  return {};
}

<<<<<<< HEAD
=======
function rewriteBundledSetupSourceToBuiltArtifact(
  source: string,
  record: PluginManifestRecord,
): string {
  if (record.origin !== "bundled") {
    return source;
  }
  const rootDir = path.resolve(record.rootDir);
  const sourcePath = path.resolve(source);
  const extensionsDir = path.dirname(rootDir);
  if (path.basename(extensionsDir) !== "extensions") {
    return source;
  }
  const packageRoot = path.dirname(extensionsDir);
  if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") {
    return source;
  }
  const relativeSource = path.relative(rootDir, sourcePath);
  if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) {
    return source;
  }
  const artifactRelativePath = relativeSource.replace(/\.[^.]+$/u, ".js");
  for (const artifactRootName of ["dist-runtime", "dist"] as const) {
    const candidate = path.join(
      packageRoot,
      artifactRootName,
      "extensions",
      path.basename(rootDir),
      artifactRelativePath,
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return source;
}

function resolveLoadableSetupRuntimeSource(record: PluginManifestRecord): string | null {
  const source = record.setupSource ?? resolveSetupApiPath(record.rootDir);
  return source ? rewriteBundledSetupSourceToBuiltArtifact(source, record) : null;
}

function resolveDeclaredSetupRuntimeSource(record: PluginManifestRecord): string | null {
  return (
    record.setupSource ??
    resolveSetupApiPath(record.rootDir, {
      includeBundledSourceFallback: false,
    })
  );
}

function resolveSetupRegistration(record: PluginManifestRecord): {
  setupSource: string;
  register: (api: ReturnType<typeof buildPluginApi>) => void | Promise<void>;
} | null {
  if (record.setup?.requiresRuntime === false) {
    return null;
  }
  const setupSource = resolveLoadableSetupRuntimeSource(record);
  if (!setupSource) {
    return null;
  }

  let mod: OpenClawPluginModule;
  try {
    mod = getModuleLoader(setupSource)(setupSource) as OpenClawPluginModule;
  } catch {
    return null;
  }

  const resolved = resolveRegister((mod as { default?: OpenClawPluginModule }).default ?? mod);
  if (!resolved.register) {
    return null;
  }
  if (resolved.definition?.id && resolved.definition.id !== record.id) {
    return null;
  }
  return {
    setupSource,
    register: resolved.register,
  };
}

function buildSetupPluginApi(params: {
  record: PluginManifestRecord;
  setupSource: string;
  handlers: PluginApiBuildParams["handlers"];
}): ReturnType<typeof buildPluginApi> {
  return buildPluginApi({
    id: params.record.id,
    name: params.record.name ?? params.record.id,
    version: params.record.version,
    description: params.record.description,
    source: params.setupSource,
    rootDir: params.record.rootDir,
    registrationMode: "setup-only",
    config: {} as OpenClawConfig,
    runtime: EMPTY_RUNTIME,
    logger: NOOP_LOGGER,
    resolvePath: (input) => input,
    handlers: params.handlers,
  });
}

function ignoreAsyncSetupRegisterResult(result: void | Promise<void>): void {
  if (!result || typeof result.then !== "function") {
    return;
  }
  // Setup-only registration is sync-only. Swallow async rejections so they do
  // not trip the global unhandledRejection fatal path.
  void Promise.resolve(result).catch(() => undefined);
}

>>>>>>> upstream/main
function matchesProvider(provider: ProviderPlugin, providerId: string): boolean {
  const normalized = normalizeProviderId(providerId);
  if (normalizeProviderId(provider.id) === normalized) {
    return true;
  }
  return [...(provider.aliases ?? []), ...(provider.hookAliases ?? [])].some(
    (alias) => normalizeProviderId(alias) === normalized,
  );
}

<<<<<<< HEAD
export function resolvePluginSetupRegistry(params?: {
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): PluginSetupRegistry {
  const env = params?.env ?? process.env;
  const cacheKey = buildSetupRegistryCacheKey({
    workspaceDir: params?.workspaceDir,
    env,
  });
  const cached = setupRegistryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const providers: SetupProviderEntry[] = [];
  const configMigrations: SetupConfigMigrationEntry[] = [];
  const autoEnableProbes: SetupAutoEnableProbeEntry[] = [];
  const providerKeys = new Set<string>();

  const discovery = discoverOpenClawPlugins({
    workspaceDir: params?.workspaceDir,
    env,
    cache: true,
  });
  const manifestRegistry = loadPluginManifestRegistry({
    workspaceDir: params?.workspaceDir,
    env,
    cache: true,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
  });

  for (const record of manifestRegistry.plugins) {
    const setupSource = resolveSetupApiPath(record.rootDir);
    if (!setupSource) {
      continue;
    }

    let mod: OpenClawPluginModule;
    try {
      mod = getJiti(setupSource)(setupSource) as OpenClawPluginModule;
    } catch {
      continue;
    }

    const resolved = resolveRegister((mod as { default?: OpenClawPluginModule }).default ?? mod);
    if (!resolved.register) {
      continue;
    }
    if (resolved.definition?.id && resolved.definition.id !== record.id) {
      continue;
    }

    const api = buildPluginApi({
      id: record.id,
      name: record.name ?? record.id,
      version: record.version,
      description: record.description,
      source: setupSource,
      rootDir: record.rootDir,
      registrationMode: "setup-only",
      config: {} as OpenClawConfig,
      runtime: EMPTY_RUNTIME,
      logger: NOOP_LOGGER,
      resolvePath: (input) => input,
=======
function loadSetupManifestRegistry(params?: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  pluginIds?: readonly string[];
}) {
  const env = params?.env ?? process.env;
  return loadPluginManifestRegistryForPluginRegistry({
    config: params?.config,
    workspaceDir: params?.workspaceDir,
    env,
    pluginIds: params?.pluginIds,
    includeDisabled: true,
  });
}

function findUniqueSetupManifestOwner(params: {
  registry: ReturnType<typeof loadSetupManifestRegistry>;
  normalizedId: string;
  listIds: (record: PluginManifestRecord) => readonly string[];
}): PluginManifestRecord | undefined {
  const matches = params.registry.plugins.filter((entry) =>
    params.listIds(entry).some((id) => normalizeProviderId(id) === params.normalizedId),
  );
  if (matches.length === 0) {
    return undefined;
  }
  // Setup lookup can execute plugin code. Refuse ambiguous ownership instead of
  // depending on manifest ordering across bundled/workspace/global sources.
  return matches.length === 1 ? matches[0] : undefined;
}

function mapNormalizedIds(ids: readonly string[]): Map<string, string> {
  const mapped = new Map<string, string>();
  for (const id of ids) {
    const normalized = normalizeProviderId(id);
    if (!normalized || mapped.has(normalized)) {
      continue;
    }
    mapped.set(normalized, id);
  }
  return mapped;
}

function pushDescriptorRuntimeDisabledDiagnostic(params: {
  record: PluginManifestRecord;
  diagnostics: PluginSetupRegistryDiagnostic[];
}): void {
  if (!resolveDeclaredSetupRuntimeSource(params.record)) {
    return;
  }
  params.diagnostics.push({
    pluginId: params.record.id,
    code: "setup-descriptor-runtime-disabled",
    message:
      "setup.requiresRuntime is false, so OpenClaw ignored the plugin setup runtime entry. Remove setup-api/openclaw.setupEntry or set requiresRuntime true if setup lookup still needs plugin code.",
  });
}

function pushSetupDescriptorDriftDiagnostics(params: {
  record: PluginManifestRecord;
  providers: readonly ProviderPlugin[];
  cliBackends: readonly CliBackendPlugin[];
  diagnostics: PluginSetupRegistryDiagnostic[];
}): void {
  const declaredProviderIds = params.record.setup?.providers?.map((entry) => entry.id);
  if (declaredProviderIds) {
    for (const declaredId of declaredProviderIds) {
      if (!params.providers.some((provider) => matchesProvider(provider, declaredId))) {
        params.diagnostics.push({
          pluginId: params.record.id,
          code: "setup-descriptor-provider-missing-runtime",
          declaredId,
          message: `setup.providers declares "${declaredId}" but setup runtime did not register a matching provider.`,
        });
      }
    }
    for (const provider of params.providers) {
      if (!declaredProviderIds.some((declaredId) => matchesProvider(provider, declaredId))) {
        params.diagnostics.push({
          pluginId: params.record.id,
          code: "setup-descriptor-provider-runtime-undeclared",
          runtimeId: provider.id,
          message: `setup runtime registered provider "${provider.id}" but setup.providers does not declare it.`,
        });
      }
    }
  }

  const declaredCliBackendIds = params.record.setup?.cliBackends;
  if (declaredCliBackendIds) {
    const declaredCliBackends = mapNormalizedIds(declaredCliBackendIds);
    const runtimeCliBackends = mapNormalizedIds(params.cliBackends.map((backend) => backend.id));
    for (const [normalized, declaredId] of declaredCliBackends) {
      if (!runtimeCliBackends.has(normalized)) {
        params.diagnostics.push({
          pluginId: params.record.id,
          code: "setup-descriptor-cli-backend-missing-runtime",
          declaredId,
          message: `setup.cliBackends declares "${declaredId}" but setup runtime did not register a matching CLI backend.`,
        });
      }
    }
    for (const [normalized, runtimeId] of runtimeCliBackends) {
      if (!declaredCliBackends.has(normalized)) {
        params.diagnostics.push({
          pluginId: params.record.id,
          code: "setup-descriptor-cli-backend-runtime-undeclared",
          runtimeId,
          message: `setup runtime registered CLI backend "${runtimeId}" but setup.cliBackends does not declare it.`,
        });
      }
    }
  }
}

export function resolvePluginSetupRegistry(params?: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  pluginIds?: readonly string[];
  manifestRegistry?: PluginManifestRegistry;
}): PluginSetupRegistry {
  const env = params?.env ?? process.env;
  const scopedPluginIds = params?.pluginIds
    ? new Set(normalizeUniqueStringEntries(params.pluginIds))
    : null;
  if (scopedPluginIds && scopedPluginIds.size === 0) {
    const empty = {
      providers: [],
      cliBackends: [],
      configMigrations: [],
      autoEnableProbes: [],
      diagnostics: [],
    } satisfies PluginSetupRegistry;
    return empty;
  }

  const providers: SetupProviderEntry[] = [];
  const cliBackends: SetupCliBackendEntry[] = [];
  const configMigrations: SetupConfigMigrationEntry[] = [];
  const autoEnableProbes: SetupAutoEnableProbeEntry[] = [];
  const diagnostics: PluginSetupRegistryDiagnostic[] = [];
  const providerKeys = new Set<string>();
  const cliBackendKeys = new Set<string>();

  const manifestRegistry =
    params?.manifestRegistry ??
    loadSetupManifestRegistry({
      config: params?.config,
      workspaceDir: params?.workspaceDir,
      env,
      pluginIds: params?.pluginIds,
    });

  for (const record of manifestRegistry.plugins) {
    if (scopedPluginIds && !scopedPluginIds.has(record.id)) {
      continue;
    }
    if (record.setup?.requiresRuntime === false) {
      pushDescriptorRuntimeDisabledDiagnostic({
        record,
        diagnostics,
      });
      continue;
    }
    const setupRegistration = resolveSetupRegistration(record);
    if (!setupRegistration) {
      continue;
    }

    const recordProviders: ProviderPlugin[] = [];
    const recordCliBackends: CliBackendPlugin[] = [];
    const api = buildSetupPluginApi({
      record,
      setupSource: setupRegistration.setupSource,
>>>>>>> upstream/main
      handlers: {
        registerProvider(provider) {
          const key = `${record.id}:${normalizeProviderId(provider.id)}`;
          if (providerKeys.has(key)) {
            return;
          }
          providerKeys.add(key);
          providers.push({
            pluginId: record.id,
            provider,
          });
<<<<<<< HEAD
=======
          recordProviders.push(provider);
        },
        registerCliBackend(backend) {
          const key = `${record.id}:${normalizeProviderId(backend.id)}`;
          if (cliBackendKeys.has(key)) {
            return;
          }
          cliBackendKeys.add(key);
          cliBackends.push({
            pluginId: record.id,
            backend,
          });
          recordCliBackends.push(backend);
>>>>>>> upstream/main
        },
        registerConfigMigration(migrate) {
          configMigrations.push({
            pluginId: record.id,
            migrate,
          });
        },
        registerAutoEnableProbe(probe) {
          autoEnableProbes.push({
            pluginId: record.id,
            probe,
          });
        },
      },
    });

    try {
<<<<<<< HEAD
      const result = resolved.register(api);
      if (result && typeof result.then === "function") {
        // Keep setup registration sync-only.
=======
      const result = setupRegistration.register(api);
      if (result && typeof result.then === "function") {
        // Keep setup registration sync-only.
        ignoreAsyncSetupRegisterResult(result);
>>>>>>> upstream/main
      }
    } catch {
      continue;
    }
<<<<<<< HEAD
=======
    pushSetupDescriptorDriftDiagnostics({
      record,
      providers: recordProviders,
      cliBackends: recordCliBackends,
      diagnostics,
    });
>>>>>>> upstream/main
  }

  const registry = {
    providers,
<<<<<<< HEAD
    configMigrations,
    autoEnableProbes,
  } satisfies PluginSetupRegistry;
  setupRegistryCache.set(cacheKey, registry);
=======
    cliBackends,
    configMigrations,
    autoEnableProbes,
    diagnostics,
  } satisfies PluginSetupRegistry;
>>>>>>> upstream/main
  return registry;
}

export function resolvePluginSetupProvider(params: {
  provider: string;
<<<<<<< HEAD
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): ProviderPlugin | undefined {
  const cacheKey = buildSetupProviderCacheKey(params);
  if (setupProviderCache.has(cacheKey)) {
    return setupProviderCache.get(cacheKey) ?? undefined;
  }

  const env = params.env ?? process.env;
  const normalizedProvider = normalizeProviderId(params.provider);
  const discovery = discoverOpenClawPlugins({
    workspaceDir: params.workspaceDir,
    env,
    cache: true,
  });
  const manifestRegistry = loadPluginManifestRegistry({
    workspaceDir: params.workspaceDir,
    env,
    cache: true,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
  });
  const record = manifestRegistry.plugins.find((entry) =>
    entry.providers.some((providerId) => normalizeProviderId(providerId) === normalizedProvider),
  );
  if (!record) {
    setupProviderCache.set(cacheKey, null);
    return undefined;
  }

  const setupSource = record.setupSource ?? resolveSetupApiPath(record.rootDir);
  if (!setupSource) {
    setupProviderCache.set(cacheKey, null);
    return undefined;
  }

  let mod: OpenClawPluginModule;
  try {
    mod = getJiti(setupSource)(setupSource) as OpenClawPluginModule;
  } catch {
    setupProviderCache.set(cacheKey, null);
    return undefined;
  }

  const resolved = resolveRegister((mod as { default?: OpenClawPluginModule }).default ?? mod);
  if (!resolved.register) {
    setupProviderCache.set(cacheKey, null);
    return undefined;
  }
  if (resolved.definition?.id && resolved.definition.id !== record.id) {
    setupProviderCache.set(cacheKey, null);
=======
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  pluginIds?: readonly string[];
}): ProviderPlugin | undefined {
  const env = params.env ?? process.env;
  const normalizedProvider = normalizeProviderId(params.provider);
  const manifestRegistry = loadSetupManifestRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env,
    pluginIds: params.pluginIds,
  });
  const record = findUniqueSetupManifestOwner({
    registry: manifestRegistry,
    normalizedId: normalizedProvider,
    listIds: listSetupProviderIds,
  });
  if (!record) {
    return undefined;
  }

  const setupRegistration = resolveSetupRegistration(record);
  if (!setupRegistration) {
>>>>>>> upstream/main
    return undefined;
  }

  let matchedProvider: ProviderPlugin | undefined;
  const localProviderKeys = new Set<string>();
<<<<<<< HEAD
  const api = buildPluginApi({
    id: record.id,
    name: record.name ?? record.id,
    version: record.version,
    description: record.description,
    source: setupSource,
    rootDir: record.rootDir,
    registrationMode: "setup-only",
    config: {} as OpenClawConfig,
    runtime: EMPTY_RUNTIME,
    logger: NOOP_LOGGER,
    resolvePath: (input) => input,
=======
  const api = buildSetupPluginApi({
    record,
    setupSource: setupRegistration.setupSource,
>>>>>>> upstream/main
    handlers: {
      registerProvider(provider) {
        const key = normalizeProviderId(provider.id);
        if (localProviderKeys.has(key)) {
          return;
        }
        localProviderKeys.add(key);
        if (matchesProvider(provider, normalizedProvider)) {
          matchedProvider = provider;
        }
      },
      registerConfigMigration() {},
      registerAutoEnableProbe() {},
    },
  });

  try {
<<<<<<< HEAD
    const result = resolved.register(api);
    if (result && typeof result.then === "function") {
      // Keep setup registration sync-only.
    }
  } catch {
    setupProviderCache.set(cacheKey, null);
    return undefined;
  }

  setupProviderCache.set(cacheKey, matchedProvider ?? null);
  return matchedProvider;
}

=======
    const result = setupRegistration.register(api);
    if (result && typeof result.then === "function") {
      // Keep setup registration sync-only.
      ignoreAsyncSetupRegisterResult(result);
    }
  } catch {
    return undefined;
  }

  return matchedProvider;
}

export function resolvePluginSetupCliBackend(params: {
  backend: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): SetupCliBackendEntry | undefined {
  const normalized = normalizeProviderId(params.backend);

  const env = params.env ?? process.env;
  // Narrow setup lookup from manifest-owned descriptors before executing any
  // plugin setup module. This avoids booting every setup-api just to find one
  // backend owner.
  const manifestRegistry = loadSetupManifestRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env,
  });
  const record = findUniqueSetupManifestOwner({
    registry: manifestRegistry,
    normalizedId: normalized,
    listIds: listSetupCliBackendIds,
  });
  if (!record) {
    return undefined;
  }

  const setupRegistration = resolveSetupRegistration(record);
  if (!setupRegistration) {
    return undefined;
  }

  let matchedBackend: CliBackendPlugin | undefined;
  const localBackendKeys = new Set<string>();
  const api = buildSetupPluginApi({
    record,
    setupSource: setupRegistration.setupSource,
    handlers: {
      registerProvider() {},
      registerConfigMigration() {},
      registerAutoEnableProbe() {},
      registerCliBackend(backend) {
        const key = normalizeProviderId(backend.id);
        if (localBackendKeys.has(key)) {
          return;
        }
        localBackendKeys.add(key);
        if (key === normalized) {
          matchedBackend = backend;
        }
      },
    },
  });

  try {
    const result = setupRegistration.register(api);
    if (result && typeof result.then === "function") {
      // Keep setup registration sync-only.
      ignoreAsyncSetupRegisterResult(result);
    }
  } catch {
    return undefined;
  }

  const resolvedEntry = matchedBackend ? { pluginId: record.id, backend: matchedBackend } : null;
  return resolvedEntry ?? undefined;
}

>>>>>>> upstream/main
export function runPluginSetupConfigMigrations(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): {
  config: OpenClawConfig;
  changes: string[];
} {
  let next = params.config;
  const changes: string[] = [];
<<<<<<< HEAD

  for (const entry of resolvePluginSetupRegistry(params).configMigrations) {
=======
  const pluginIds = resolveRelevantSetupMigrationPluginIds(params);
  if (pluginIds.length === 0) {
    return { config: next, changes };
  }

  for (const entry of resolvePluginSetupRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    pluginIds,
  }).configMigrations) {
>>>>>>> upstream/main
    const migration = entry.migrate(next);
    if (!migration || migration.changes.length === 0) {
      continue;
    }
    next = migration.config;
    changes.push(...migration.changes);
  }

  return { config: next, changes };
}

export function resolvePluginSetupAutoEnableReasons(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
=======
  pluginIds?: readonly string[];
  manifestRegistry?: PluginManifestRegistry;
>>>>>>> upstream/main
}): SetupAutoEnableReason[] {
  const env = params.env ?? process.env;
  const reasons: SetupAutoEnableReason[] = [];
  const seen = new Set<string>();

  for (const entry of resolvePluginSetupRegistry({
<<<<<<< HEAD
    workspaceDir: params.workspaceDir,
    env,
=======
    config: params.config,
    workspaceDir: params.workspaceDir,
    env,
    pluginIds: params.pluginIds,
    manifestRegistry: params.manifestRegistry,
>>>>>>> upstream/main
  }).autoEnableProbes) {
    const raw = entry.probe({
      config: params.config,
      env,
    });
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const reason of values) {
      const normalized = reason.trim();
      if (!normalized) {
        continue;
      }
      const key = `${entry.pluginId}:${normalized}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      reasons.push({
        pluginId: entry.pluginId,
        reason: normalized,
      });
    }
  }

  return reasons;
}
