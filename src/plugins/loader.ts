<<<<<<< HEAD
=======
// Discovers, validates, and loads plugin metadata and runtime entrypoints.
>>>>>>> upstream/main
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import {
  clearAgentHarnesses,
  listRegisteredAgentHarnesses,
  restoreRegisteredAgentHarnesses,
} from "../agents/harness/registry.js";
import { resolveConfigEnvVars } from "../config/env-substitution.js";
import { createConfigRuntimeEnv } from "../config/env-vars.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import type { GatewayRequestHandler } from "../gateway/server-methods/types.js";
import { openRootFileSync } from "../infra/boundary-file-read.js";
import { tryReadJsonSync } from "../infra/json-files.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  DEFAULT_MEMORY_DREAMING_PLUGIN_ID,
  resolveMemoryDreamingConfig,
  resolveMemoryDreamingPluginConfig,
} from "../memory-host-sdk/dreaming.js";
import {
  clearDetachedTaskLifecycleRuntimeRegistration,
  getDetachedTaskLifecycleRuntimeRegistration,
  restoreDetachedTaskLifecycleRuntimeRegistration,
} from "../tasks/detached-task-runtime-state.js";
import { resolveUserPath } from "../utils.js";
<<<<<<< HEAD
import { buildPluginApi } from "./api-builder.js";
=======
import { resolvePluginActivationSourceConfig } from "./activation-source-config.js";
import { buildPluginApi } from "./api-builder.js";
import { attachPluginApiFacades } from "./api-facades.js";
import { isLateCallablePluginApiMethod } from "./api-lifecycle.js";
>>>>>>> upstream/main
import { inspectBundleMcpRuntimeSupport } from "./bundle-mcp.js";
import {
  clearPluginCommands,
  listRegisteredPluginCommands,
  restorePluginCommands,
} from "./command-registry-state.js";
import {
  clearCompactionProviders,
  listRegisteredCompactionProviders,
  restoreRegisteredCompactionProviders,
} from "./compaction-provider.js";
import {
  applyTestPluginDefaults,
  createPluginActivationSource,
  normalizePluginsConfig,
  resolveEffectiveEnableState,
  resolveEffectivePluginActivationState,
  resolveMemorySlotDecision,
  type PluginActivationConfigSource,
  type NormalizedPluginsConfig,
  type PluginActivationState,
} from "./config-state.js";
<<<<<<< HEAD
import { discoverOpenClawPlugins } from "./discovery.js";
import { initializeGlobalHookRunner } from "./hook-runner-global.js";
import { clearPluginInteractiveHandlers } from "./interactive-registry.js";
import { loadPluginManifestRegistry } from "./manifest-registry.js";
import type { PluginManifestContracts } from "./manifest.js";
=======
import { isPluginEnabledByDefaultForPlatform } from "./default-enablement.js";
import { resolveOpenClawDevSourceRoot } from "./dev-source-root.js";
import {
  discoverOpenClawPlugins,
  type PluginCandidate,
  type PluginDiscoveryResult,
} from "./discovery.js";
import {
  clearEmbeddingProviders,
  listRegisteredEmbeddingProviders,
  restoreRegisteredEmbeddingProviders,
} from "./embedding-providers.js";
import { shouldRejectHardlinkedPluginFiles } from "./hardlink-policy.js";
import { getGlobalHookRunner, initializeGlobalHookRunner } from "./hook-runner-global.js";
import { toSafeImportPath } from "./import-specifier.js";
import { collectPluginManifestCompatCodes } from "./installed-plugin-index-record-builder.js";
import { loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-records.js";
import {
  clearPluginInteractiveHandlers,
  listPluginInteractiveHandlers,
  restorePluginInteractiveHandlers,
} from "./interactive-registry.js";
import { PluginLoaderCacheState } from "./loader-cache-state.js";
import {
  channelPluginIdBelongsToManifest,
  loadBundledRuntimeChannelPlugin,
  mergeSetupRuntimeChannelPlugin,
  resolveBundledRuntimeChannelRegistration,
  resolveSetupChannelRegistration,
  shouldDeferConfiguredChannelFullRuntimeMerge,
  shouldLoadChannelPluginInSetupRuntime,
} from "./loader-channel-setup.js";
import {
  buildProvenanceIndex,
  compareDuplicateCandidateOrder,
  warnAboutUntrackedLoadedPlugins,
  warnWhenAllowlistIsOpen,
} from "./loader-provenance.js";
import {
  createPluginRecord,
  formatAutoEnabledActivationReason,
  formatMissingPluginRegisterError,
  formatPluginFailureSummary,
  markPluginActivationDisabled,
  recordPluginError,
} from "./loader-records.js";
import {
  loadPluginManifestRegistry,
  type PluginManifestRecord,
  type PluginManifestRegistry,
} from "./manifest-registry.js";
import type { PluginDiagnostic } from "./manifest-types.js";
>>>>>>> upstream/main
import {
  clearMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviders,
  restoreRegisteredMemoryEmbeddingProviders,
} from "./memory-embedding-providers.js";
import {
  clearMemoryPluginState,
<<<<<<< HEAD
  getMemoryFlushPlanResolver,
  getMemoryPromptSectionBuilder,
  getMemoryRuntime,
=======
  getMemoryCapabilityRegistration,
>>>>>>> upstream/main
  listMemoryCorpusSupplements,
  listMemoryPromptSupplements,
  restoreMemoryPluginState,
} from "./memory-state.js";
import { unwrapDefaultModuleExport } from "./module-export.js";
import {
  fingerprintPluginDiscoveryContext,
  resolvePluginDiscoveryContext,
} from "./plugin-control-plane-context.js";
import { withProfile } from "./plugin-load-profile.js";
import {
  createPluginModuleLoaderCache,
  getCachedPluginModuleLoader,
  type PluginModuleLoaderCache,
} from "./plugin-module-loader-cache.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
import {
  createPluginIdScopeSet,
  hasExplicitPluginIdScope,
  normalizePluginIdScope,
  serializePluginIdScope,
} from "./plugin-scope.js";
import { ensureOpenClawPluginSdkAlias } from "./plugin-sdk-dist-alias.js";
import { installOpenClawPluginSdkNativeResolver } from "./plugin-sdk-native-resolver.js";
import { createEmptyPluginRegistry } from "./registry-empty.js";
import type { PluginRegistryParams } from "./registry-types.js";
import { createPluginRegistry, type PluginRecord, type PluginRegistry } from "./registry.js";
<<<<<<< HEAD
import { resolvePluginCacheInputs } from "./roots.js";
import {
  getActivePluginRegistry,
  getActivePluginRegistryKey,
  recordImportedPluginId,
  setActivePluginRegistry,
} from "./runtime.js";
import type { CreatePluginRuntimeOptions } from "./runtime/index.js";
=======
import {
  getActivePluginRegistry,
  getActivePluginRegistryKey,
  getActivePluginRuntimeSubagentMode,
  recordImportedPluginId,
  setActivePluginRegistry,
} from "./runtime.js";
import type { CreatePluginRuntimeOptions } from "./runtime/types.js";
>>>>>>> upstream/main
import type { PluginRuntime } from "./runtime/types.js";
import { validateJsonSchemaValue } from "./schema-validator.js";
import {
  buildPluginLoaderAliasMap,
  buildPluginLoaderJitiOptions,
  listPluginSdkAliasCandidates,
  listPluginSdkExportedSubpaths,
<<<<<<< HEAD
=======
  type PluginRuntimeModuleResolution,
>>>>>>> upstream/main
  type PluginSdkResolutionPreference,
  resolveExtensionApiAlias,
  resolvePluginSdkAliasCandidateOrder,
  resolvePluginSdkAliasFile,
  resolvePluginRuntimeModulePath,
  resolvePluginRuntimeModulePathWithDiagnostics,
  resolvePluginSdkScopedAliasMap,
  shouldPreferNativeModuleLoad,
} from "./sdk-alias.js";
import { hasKind, kindsEqual } from "./slots.js";
<<<<<<< HEAD
=======
import { encodeStartupTraceSegment } from "./startup-trace-segment.js";
>>>>>>> upstream/main
import type {
  OpenClawPluginApi,
  OpenClawPluginDefinition,
  OpenClawPluginModule,
  PluginLogger,
  PluginRegistrationMode,
} from "./types.js";

export type PluginLoadResult = PluginRegistry;
export { PluginLoadReentryError } from "./loader-cache-state.js";

export type PluginLoadOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  autoEnabledReasons?: Readonly<Record<string, string[]>>;
  workspaceDir?: string;
  installRecords?: Record<string, PluginInstallRecord>;
  // Allows callers to resolve plugin roots and load paths against an explicit env
  // instead of the process-global environment.
  env?: NodeJS.ProcessEnv;
  // Direct raw-config callers can opt into the same single env-substitution pass
  // config IO normally performs before plugin validation.
  resolveRawConfigEnvVars?: boolean;
  logger?: PluginLogger;
  coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
  coreGatewayMethodNames?: readonly string[];
  hostServices?: PluginRegistryParams["hostServices"];
  runtimeOptions?: CreatePluginRuntimeOptions;
<<<<<<< HEAD
=======
  startupTrace?: {
    detail: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
  };
>>>>>>> upstream/main
  pluginSdkResolution?: PluginSdkResolutionPreference;
  cache?: boolean;
  mode?: "full" | "validate";
  onlyPluginIds?: string[];
  includeSetupOnlyChannelPlugins?: boolean;
  forceSetupOnlyChannelPlugins?: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins?: boolean;
  /**
   * Prefer `setupEntry` for configured channel plugins that explicitly opt in
   * via package metadata because their setup entry covers the pre-listen startup surface.
   */
  preferSetupRuntimeForChannelPlugins?: boolean;
  /**
   * Load channel runtime entries even when setup entries are available. Plugin CLI
   * registration needs the runtime entry because setup entries only own setup state.
   */
  forceFullRuntimeForChannelPlugins?: boolean;
  /**
   * For hot startup paths, prefer bundled plugin JS artifacts over source TS
   * entrypoints when both are present in a source checkout.
   */
  preferBuiltPluginArtifacts?: boolean;
  toolDiscovery?: boolean;
  activate?: boolean;
  loadModules?: boolean;
  throwOnLoadError?: boolean;
  manifestRegistry?: PluginManifestRegistry;
  discovery?: PluginDiscoveryResult;
};

<<<<<<< HEAD
=======
function detailPluginStartupTrace(
  startupTrace: PluginLoadOptions["startupTrace"] | undefined,
  pluginId: string,
  metrics: ReadonlyArray<readonly [string, number | string]>,
): void {
  startupTrace?.detail(
    `plugins.gateway-load.plugin.${encodeStartupTraceSegment(pluginId)}`,
    metrics,
  );
}

>>>>>>> upstream/main
const CLI_METADATA_ENTRY_BASENAMES = [
  "cli-metadata.ts",
  "cli-metadata.js",
  "cli-metadata.mjs",
  "cli-metadata.cjs",
] as const;

<<<<<<< HEAD
=======
function resolveDreamingSidecarEngineId(params: {
  cfg: OpenClawConfig;
  memorySlot: string | null | undefined;
}): string | null {
  const normalizedMemorySlot = normalizeLowercaseStringOrEmpty(params.memorySlot);
  if (
    !normalizedMemorySlot ||
    normalizedMemorySlot === "none" ||
    normalizedMemorySlot === DEFAULT_MEMORY_DREAMING_PLUGIN_ID
  ) {
    return null;
  }
  const dreamingConfig = resolveMemoryDreamingConfig({
    pluginConfig: resolveMemoryDreamingPluginConfig(params.cfg),
    cfg: params.cfg,
  });
  return dreamingConfig.enabled ? DEFAULT_MEMORY_DREAMING_PLUGIN_ID : null;
}

>>>>>>> upstream/main
export class PluginLoadFailureError extends Error {
  readonly pluginIds: string[];
  readonly registry: PluginRegistry;

  constructor(registry: PluginRegistry) {
    const failedPlugins = registry.plugins.filter((entry) => entry.status === "error");
    const summary = failedPlugins
      .map((entry) => `${entry.id}: ${entry.error ?? "unknown plugin load error"}`)
      .join("; ");
    super(`plugin load failed: ${summary}`);
    this.name = "PluginLoadFailureError";
    this.pluginIds = failedPlugins.map((entry) => entry.id);
    this.registry = registry;
  }
}

type CachedPluginState = {
  registry: PluginRegistry;
<<<<<<< HEAD
  memoryCorpusSupplements: ReturnType<typeof listMemoryCorpusSupplements>;
  memoryEmbeddingProviders: ReturnType<typeof listRegisteredMemoryEmbeddingProviders>;
  memoryFlushPlanResolver: ReturnType<typeof getMemoryFlushPlanResolver>;
  memoryPromptBuilder: ReturnType<typeof getMemoryPromptSectionBuilder>;
  memoryPromptSupplements: ReturnType<typeof listMemoryPromptSupplements>;
  memoryRuntime: ReturnType<typeof getMemoryRuntime>;
=======
  detachedTaskRuntimeRegistration: ReturnType<typeof getDetachedTaskLifecycleRuntimeRegistration>;
  commands?: ReturnType<typeof listRegisteredPluginCommands>;
  interactiveHandlers?: ReturnType<typeof listPluginInteractiveHandlers>;
  memoryCapability: ReturnType<typeof getMemoryCapabilityRegistration>;
  memoryCorpusSupplements: ReturnType<typeof listMemoryCorpusSupplements>;
  agentHarnesses: ReturnType<typeof listRegisteredAgentHarnesses>;
  compactionProviders: ReturnType<typeof listRegisteredCompactionProviders>;
  embeddingProviders: ReturnType<typeof listRegisteredEmbeddingProviders>;
  memoryEmbeddingProviders: ReturnType<typeof listRegisteredMemoryEmbeddingProviders>;
  memoryPromptSupplements: ReturnType<typeof listMemoryPromptSupplements>;
>>>>>>> upstream/main
};

const MAX_PLUGIN_REGISTRY_CACHE_ENTRIES = 128;
const pluginLoaderCacheState = new PluginLoaderCacheState<CachedPluginState>(
  MAX_PLUGIN_REGISTRY_CACHE_ENTRIES,
);
const fullWorkspacePluginLoaderCacheState = new PluginLoaderCacheState<CachedPluginState>(
  MAX_PLUGIN_REGISTRY_CACHE_ENTRIES,
);
const LAZY_RUNTIME_REFLECTION_KEYS = [
  "version",
  "config",
  "agent",
  "subagent",
  "system",
  "media",
  "mediaUnderstanding",
  "tts",
  "stt",
  "channel",
  "events",
  "logging",
  "state",
  "modelAuth",
  "imageGeneration",
  "videoGeneration",
  "musicGeneration",
  "llm",
] as const satisfies readonly (keyof PluginRuntime)[];

function createPluginCandidatesFromManifestRegistry(
  manifestRegistry: PluginManifestRegistry,
): PluginCandidate[] {
  return manifestRegistry.plugins.map((record) => ({
    idHint: record.id,
    rootDir: record.rootDir,
    source: record.source,
    ...(record.setupSource !== undefined ? { setupSource: record.setupSource } : {}),
    origin: record.origin,
    ...(record.workspaceDir !== undefined ? { workspaceDir: record.workspaceDir } : {}),
    ...(record.format !== undefined ? { format: record.format } : {}),
    ...(record.bundleFormat !== undefined ? { bundleFormat: record.bundleFormat } : {}),
  }));
}

export function clearPluginLoaderCache(): void {
  pluginLoaderCacheState.clear();
  fullWorkspacePluginLoaderCacheState.clear();
  clearActivatedPluginRuntimeState();
}

export function clearActivatedPluginRuntimeState(): void {
  clearAgentHarnesses();
  clearPluginCommands();
  clearCompactionProviders();
  clearDetachedTaskLifecycleRuntimeRegistration();
  clearPluginInteractiveHandlers();
  clearEmbeddingProviders();
  clearMemoryEmbeddingProviders();
  clearMemoryPluginState();
}

export function clearPluginRegistryLoadCache(): void {
  pluginLoaderCacheState.clearCachedRegistries();
  fullWorkspacePluginLoaderCacheState.clearCachedRegistries();
}

const defaultLogger = () => createSubsystemLogger("plugins");

<<<<<<< HEAD
function createPluginJitiLoader(options: Pick<PluginLoadOptions, "pluginSdkResolution">) {
  const jitiLoaders = new Map<string, ReturnType<typeof createJiti>>();
  return (modulePath: string) => {
    const tryNative = shouldPreferNativeJiti(modulePath);
    const aliasMap = buildPluginLoaderAliasMap(
      modulePath,
      process.argv[1],
      import.meta.url,
      options.pluginSdkResolution,
    );
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
      // Source .ts runtime shims import sibling ".js" specifiers that only exist
      // after build. Disable native loading for source entries so Jiti rewrites
      // those imports against the source graph, while keeping native dist/*.js
      // loading for the canonical built module graph.
      tryNative,
    });
    jitiLoaders.set(cacheKey, loader);
    return loader;
  };
}

export const __testing = {
=======
function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

type PluginRegistrySnapshot = {
  arrays: {
    tools: PluginRegistry["tools"];
    hooks: PluginRegistry["hooks"];
    typedHooks: PluginRegistry["typedHooks"];
    channels: PluginRegistry["channels"];
    channelSetups: PluginRegistry["channelSetups"];
    providers: PluginRegistry["providers"];
    modelCatalogProviders: PluginRegistry["modelCatalogProviders"];
    cliBackends: NonNullable<PluginRegistry["cliBackends"]>;
    textTransforms: PluginRegistry["textTransforms"];
    embeddingProviders: PluginRegistry["embeddingProviders"];
    speechProviders: PluginRegistry["speechProviders"];
    realtimeTranscriptionProviders: PluginRegistry["realtimeTranscriptionProviders"];
    realtimeVoiceProviders: PluginRegistry["realtimeVoiceProviders"];
    mediaUnderstandingProviders: PluginRegistry["mediaUnderstandingProviders"];
    transcriptSourceProviders: PluginRegistry["transcriptSourceProviders"];
    imageGenerationProviders: PluginRegistry["imageGenerationProviders"];
    videoGenerationProviders: PluginRegistry["videoGenerationProviders"];
    musicGenerationProviders: PluginRegistry["musicGenerationProviders"];
    webFetchProviders: PluginRegistry["webFetchProviders"];
    webSearchProviders: PluginRegistry["webSearchProviders"];
    migrationProviders: PluginRegistry["migrationProviders"];
    codexAppServerExtensionFactories: PluginRegistry["codexAppServerExtensionFactories"];
    agentToolResultMiddlewares: PluginRegistry["agentToolResultMiddlewares"];
    trustedToolPolicies: NonNullable<PluginRegistry["trustedToolPolicies"]>;
    memoryEmbeddingProviders: PluginRegistry["memoryEmbeddingProviders"];
    agentHarnesses: PluginRegistry["agentHarnesses"];
    httpRoutes: PluginRegistry["httpRoutes"];
    cliRegistrars: PluginRegistry["cliRegistrars"];
    reloads: NonNullable<PluginRegistry["reloads"]>;
    nodeHostCommands: NonNullable<PluginRegistry["nodeHostCommands"]>;
    nodeInvokePolicies: NonNullable<PluginRegistry["nodeInvokePolicies"]>;
    securityAuditCollectors: NonNullable<PluginRegistry["securityAuditCollectors"]>;
    services: PluginRegistry["services"];
    commands: PluginRegistry["commands"];
    sessionActions: NonNullable<PluginRegistry["sessionActions"]>;
    conversationBindingResolvedHandlers: PluginRegistry["conversationBindingResolvedHandlers"];
    diagnostics: PluginRegistry["diagnostics"];
  };
  gatewayHandlers: PluginRegistry["gatewayHandlers"];
  gatewayMethodDescriptors: PluginRegistry["gatewayMethodDescriptors"];
  coreGatewayMethodNames: NonNullable<PluginRegistry["coreGatewayMethodNames"]>;
};

function snapshotPluginRegistry(registry: PluginRegistry): PluginRegistrySnapshot {
  return {
    arrays: {
      tools: [...registry.tools],
      hooks: [...registry.hooks],
      typedHooks: [...registry.typedHooks],
      channels: [...registry.channels],
      channelSetups: [...registry.channelSetups],
      providers: [...registry.providers],
      modelCatalogProviders: [...registry.modelCatalogProviders],
      cliBackends: [...(registry.cliBackends ?? [])],
      textTransforms: [...registry.textTransforms],
      embeddingProviders: [...registry.embeddingProviders],
      speechProviders: [...registry.speechProviders],
      realtimeTranscriptionProviders: [...registry.realtimeTranscriptionProviders],
      realtimeVoiceProviders: [...registry.realtimeVoiceProviders],
      mediaUnderstandingProviders: [...registry.mediaUnderstandingProviders],
      transcriptSourceProviders: [...registry.transcriptSourceProviders],
      imageGenerationProviders: [...registry.imageGenerationProviders],
      videoGenerationProviders: [...registry.videoGenerationProviders],
      musicGenerationProviders: [...registry.musicGenerationProviders],
      webFetchProviders: [...registry.webFetchProviders],
      webSearchProviders: [...registry.webSearchProviders],
      migrationProviders: [...registry.migrationProviders],
      codexAppServerExtensionFactories: [...registry.codexAppServerExtensionFactories],
      agentToolResultMiddlewares: [...registry.agentToolResultMiddlewares],
      trustedToolPolicies: [...(registry.trustedToolPolicies ?? [])],
      memoryEmbeddingProviders: [...registry.memoryEmbeddingProviders],
      agentHarnesses: [...registry.agentHarnesses],
      httpRoutes: [...registry.httpRoutes],
      cliRegistrars: [...registry.cliRegistrars],
      reloads: [...(registry.reloads ?? [])],
      nodeHostCommands: [...(registry.nodeHostCommands ?? [])],
      nodeInvokePolicies: [...(registry.nodeInvokePolicies ?? [])],
      securityAuditCollectors: [...(registry.securityAuditCollectors ?? [])],
      services: [...registry.services],
      commands: [...registry.commands],
      sessionActions: [...(registry.sessionActions ?? [])],
      conversationBindingResolvedHandlers: [...registry.conversationBindingResolvedHandlers],
      diagnostics: [...registry.diagnostics],
    },
    gatewayHandlers: { ...registry.gatewayHandlers },
    gatewayMethodDescriptors: [...registry.gatewayMethodDescriptors],
    coreGatewayMethodNames: [...(registry.coreGatewayMethodNames ?? [])],
  };
}

function restorePluginRegistry(registry: PluginRegistry, snapshot: PluginRegistrySnapshot): void {
  registry.tools = snapshot.arrays.tools;
  registry.hooks = snapshot.arrays.hooks;
  registry.typedHooks = snapshot.arrays.typedHooks;
  registry.channels = snapshot.arrays.channels;
  registry.channelSetups = snapshot.arrays.channelSetups;
  registry.providers = snapshot.arrays.providers;
  registry.modelCatalogProviders = snapshot.arrays.modelCatalogProviders;
  registry.cliBackends = snapshot.arrays.cliBackends;
  registry.textTransforms = snapshot.arrays.textTransforms;
  registry.embeddingProviders = snapshot.arrays.embeddingProviders;
  registry.speechProviders = snapshot.arrays.speechProviders;
  registry.realtimeTranscriptionProviders = snapshot.arrays.realtimeTranscriptionProviders;
  registry.realtimeVoiceProviders = snapshot.arrays.realtimeVoiceProviders;
  registry.mediaUnderstandingProviders = snapshot.arrays.mediaUnderstandingProviders;
  registry.transcriptSourceProviders = snapshot.arrays.transcriptSourceProviders;
  registry.imageGenerationProviders = snapshot.arrays.imageGenerationProviders;
  registry.videoGenerationProviders = snapshot.arrays.videoGenerationProviders;
  registry.musicGenerationProviders = snapshot.arrays.musicGenerationProviders;
  registry.webFetchProviders = snapshot.arrays.webFetchProviders;
  registry.webSearchProviders = snapshot.arrays.webSearchProviders;
  registry.migrationProviders = snapshot.arrays.migrationProviders;
  registry.codexAppServerExtensionFactories = snapshot.arrays.codexAppServerExtensionFactories;
  registry.agentToolResultMiddlewares = snapshot.arrays.agentToolResultMiddlewares;
  registry.trustedToolPolicies = snapshot.arrays.trustedToolPolicies;
  registry.memoryEmbeddingProviders = snapshot.arrays.memoryEmbeddingProviders;
  registry.agentHarnesses = snapshot.arrays.agentHarnesses;
  registry.httpRoutes = snapshot.arrays.httpRoutes;
  registry.cliRegistrars = snapshot.arrays.cliRegistrars;
  registry.reloads = snapshot.arrays.reloads;
  registry.nodeHostCommands = snapshot.arrays.nodeHostCommands;
  registry.nodeInvokePolicies = snapshot.arrays.nodeInvokePolicies;
  registry.securityAuditCollectors = snapshot.arrays.securityAuditCollectors;
  registry.services = snapshot.arrays.services;
  registry.commands = snapshot.arrays.commands;
  registry.sessionActions = snapshot.arrays.sessionActions;
  registry.conversationBindingResolvedHandlers =
    snapshot.arrays.conversationBindingResolvedHandlers;
  registry.diagnostics = snapshot.arrays.diagnostics;
  registry.gatewayHandlers = snapshot.gatewayHandlers;
  registry.gatewayMethodDescriptors = snapshot.gatewayMethodDescriptors;
  registry.coreGatewayMethodNames = snapshot.coreGatewayMethodNames;
}

function createGuardedPluginRegistrationApi(api: OpenClawPluginApi): {
  api: OpenClawPluginApi;
  close: () => void;
} {
  let closed = false;
  const guardedApi = attachPluginApiFacades(
    new Proxy(api, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value !== "function") {
          return value;
        }
        if (typeof prop === "string" && isLateCallablePluginApiMethod(prop)) {
          return (...args: unknown[]) => Reflect.apply(value, target, args);
        }
        return (...args: unknown[]) => {
          const isLateCallableMethod =
            typeof prop === "string" && isLateCallablePluginApiMethod(prop);
          if (closed && !isLateCallableMethod) {
            return undefined;
          }
          return Reflect.apply(value, target, args);
        };
      },
    }),
  );
  return {
    api: guardedApi,
    close: () => {
      closed = true;
    },
  };
}

function runPluginRegisterSync(
  register: NonNullable<OpenClawPluginDefinition["register"]>,
  api: Parameters<NonNullable<OpenClawPluginDefinition["register"]>>[0],
): void {
  const guarded = createGuardedPluginRegistrationApi(api);
  try {
    const result = register(guarded.api);
    if (isPromiseLike(result)) {
      void Promise.resolve(result).catch(() => {});
      throw new Error("plugin register must be synchronous");
    }
  } finally {
    guarded.close();
  }
}

function createPluginModuleLoader(options: {
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}) {
  const moduleLoaders: PluginModuleLoaderCache = createPluginModuleLoaderCache();
  const createLoaderForModule = (modulePath: string) => {
    installOpenClawPluginSdkNativeResolver({
      argv1: process.argv[1],
      moduleUrl: import.meta.url,
      pluginModulePath: modulePath,
      devSourceRoot: options.devSourceRoot,
      pluginSdkResolution: options.pluginSdkResolution,
    });
    return getCachedPluginModuleLoader({
      cache: moduleLoaders,
      modulePath,
      importerUrl: import.meta.url,
      loaderFilename: modulePath,
      devSourceRoot: options.devSourceRoot,
      aliasMap: buildPluginLoaderAliasMap(
        modulePath,
        process.argv[1],
        import.meta.url,
        options.pluginSdkResolution,
        options.devSourceRoot,
      ),
      pluginSdkResolution: options.pluginSdkResolution,
    });
  };
  return (modulePath: string): unknown =>
    createLoaderForModule(modulePath)(toSafeImportPath(modulePath));
}

function resolveCanonicalDistRuntimeSource(source: string): string {
  const marker = `${path.sep}dist-runtime${path.sep}extensions${path.sep}`;
  const index = source.indexOf(marker);
  if (index === -1) {
    return source;
  }
  const candidate = `${source.slice(0, index)}${path.sep}dist${path.sep}extensions${path.sep}${source.slice(index + marker.length)}`;
  return fs.existsSync(candidate) ? candidate : source;
}

function rewriteBundledRuntimeArtifactRelativePath(relativePath: string): string {
  return relativePath.replace(/\.[^.]+$/u, ".js");
}

function listPackageLocalRuntimeArtifactOutputExtensions(sourceExt: string): string[] {
  switch (sourceExt) {
    case ".mts":
    case ".mjs":
      return [".mjs", ".js", ".cjs"];
    case ".cts":
    case ".cjs":
      return [".cjs", ".js", ".mjs"];
    default:
      return [".js", ".mjs", ".cjs"];
  }
}

function listPackageLocalRuntimeArtifactRelativePathBases(relativePath: string): string[] {
  const ext = path.extname(relativePath).toLowerCase();
  const withoutExt = ext ? relativePath.slice(0, -ext.length) : relativePath;
  if (!withoutExt.startsWith(`src${path.sep}`) && !withoutExt.startsWith("src/")) {
    return [withoutExt];
  }
  return [withoutExt.slice(4), withoutExt];
}

function listPackageLocalDistRuntimeArtifactRelativePaths(relativePath: string): string[] {
  const ext = path.extname(relativePath).toLowerCase();
  const candidates = new Set<string>();
  for (const base of listPackageLocalRuntimeArtifactRelativePathBases(relativePath)) {
    for (const outputExt of listPackageLocalRuntimeArtifactOutputExtensions(ext)) {
      candidates.add(`${base}${outputExt}`);
    }
  }
  return [...candidates];
}

function shouldPreferPackageLocalDistRuntimeArtifact(source: string): boolean {
  switch (path.extname(source).toLowerCase()) {
    case ".ts":
    case ".tsx":
    case ".mts":
    case ".cts":
      return true;
    default:
      return false;
  }
}

function resolvePackageLocalDistRuntimeArtifact(params: {
  source: string;
  rootDir: string;
}): string | null {
  const relativeSource = path.relative(params.rootDir, params.source);
  if (
    !shouldPreferPackageLocalDistRuntimeArtifact(relativeSource) ||
    relativeSource === "" ||
    relativeSource.startsWith("..") ||
    path.isAbsolute(relativeSource)
  ) {
    return null;
  }
  const artifactRoot = path.join(params.rootDir, "dist");
  for (const artifactRelativePath of listPackageLocalDistRuntimeArtifactRelativePaths(
    relativeSource,
  )) {
    const artifactSource = path.join(artifactRoot, artifactRelativePath);
    if (fs.existsSync(artifactSource)) {
      return safeRealpathOrResolve(artifactSource);
    }
  }
  return null;
}

function resolvePreferredBuiltRuntimeArtifact(params: {
  source: string;
  rootDir: string;
  origin: PluginOrigin;
  preferBuiltPluginArtifacts: boolean;
}): { source: string; rootDir: string } {
  const rootDir = safeRealpathOrResolve(params.rootDir);
  const source = safeRealpathOrResolve(params.source);
  if (!params.preferBuiltPluginArtifacts) {
    return { source, rootDir };
  }
  if (params.origin !== "bundled") {
    const artifactSource = resolvePackageLocalDistRuntimeArtifact({ source, rootDir });
    if (artifactSource) {
      return { source: artifactSource, rootDir };
    }
    return { source, rootDir };
  }
  const packageLocalArtifactSource = resolvePackageLocalDistRuntimeArtifact({ source, rootDir });
  if (packageLocalArtifactSource) {
    return { source: packageLocalArtifactSource, rootDir };
  }
  const extensionsDir = path.dirname(rootDir);
  if (path.basename(extensionsDir) !== "extensions") {
    return { source, rootDir };
  }
  const packageRoot = path.dirname(extensionsDir);
  if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") {
    return { source, rootDir };
  }
  const relativeSource = path.relative(rootDir, source);
  if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) {
    return { source, rootDir };
  }
  const artifactRelativePath = rewriteBundledRuntimeArtifactRelativePath(relativeSource);
  for (const artifactRootName of ["dist-runtime", "dist"] as const) {
    const artifactRoot = path.join(
      packageRoot,
      artifactRootName,
      "extensions",
      path.basename(rootDir),
    );
    const artifactSource = path.join(artifactRoot, artifactRelativePath);
    if (fs.existsSync(artifactSource)) {
      return {
        source: safeRealpathOrResolve(artifactSource),
        rootDir: safeRealpathOrResolve(artifactRoot),
      };
    }
  }
  return { source, rootDir };
}

function formatPluginRuntimeModuleResolutionError(params: {
  resolution: PluginRuntimeModuleResolution;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): string {
  const { resolution } = params;
  const candidates = resolution.candidates.length > 0 ? resolution.candidates.join(", ") : "<none>";
  return [
    "Unable to resolve plugin runtime module",
    `loader=${resolution.modulePath ?? "<unresolved>"}`,
    `packageRoot=${resolution.packageRoot ?? "<none>"}`,
    `pluginSdkResolution=${params.pluginSdkResolution ?? "auto"}`,
    `candidates=${candidates}`,
    ...(resolution.error ? [`resolverError=${resolution.error}`] : []),
  ].join("; ");
}

export const testing = {
>>>>>>> upstream/main
  buildPluginLoaderJitiOptions,
  buildPluginLoaderAliasMap,
  listPluginSdkAliasCandidates,
  listPluginSdkExportedSubpaths,
  resolveExtensionApiAlias,
  resolvePluginSdkScopedAliasMap,
  resolvePluginSdkAliasCandidateOrder,
  resolvePluginSdkAliasFile,
  resolvePluginRuntimeModulePath,
<<<<<<< HEAD
  shouldPreferNativeJiti,
=======
  ensureOpenClawPluginSdkAlias,
  shouldLoadChannelPluginInSetupRuntime,
  shouldPreferNativeModuleLoad,
  toSafeImportPath,
  createGuardedPluginRegistrationApi,
  runPluginRegisterSync,
>>>>>>> upstream/main
  getCompatibleActivePluginRegistry,
  resolvePluginLoadCacheContext,
  get maxPluginRegistryCacheEntries() {
    return pluginLoaderCacheState.maxEntries;
  },
  setMaxPluginRegistryCacheEntriesForTest(value?: number) {
    pluginLoaderCacheState.setMaxEntriesForTest(value);
    fullWorkspacePluginLoaderCacheState.setMaxEntriesForTest(value);
  },
};

function getPluginRegistryCache(onlyPluginIds?: string[]) {
  return onlyPluginIds ? pluginLoaderCacheState : fullWorkspacePluginLoaderCacheState;
}

function getCachedPluginRegistry(
  cacheKey: string,
  onlyPluginIds?: string[],
): CachedPluginState | undefined {
  return getPluginRegistryCache(onlyPluginIds).get(cacheKey);
}

function setCachedPluginRegistry(
  cacheKey: string,
  state: CachedPluginState,
  onlyPluginIds?: string[],
): void {
  getPluginRegistryCache(onlyPluginIds).set(cacheKey, state);
}

function getReusableCachedPluginRegistry(params: {
  cacheKey: string;
  onlyPluginIds: string[] | undefined;
  runtimeSubagentMode: "default" | "explicit" | "gateway-bindable";
  options: PluginLoadOptions;
}):
  | {
      state: CachedPluginState;
      cacheKey: string;
      runtimeSubagentMode: "default" | "explicit" | "gateway-bindable";
    }
  | undefined {
  const exact = getCachedPluginRegistry(params.cacheKey, params.onlyPluginIds);
  if (exact) {
    return {
      state: exact,
      cacheKey: params.cacheKey,
      runtimeSubagentMode: params.runtimeSubagentMode,
    };
  }
  if (params.runtimeSubagentMode !== "default") {
    return undefined;
  }
  const gatewayBindableContext = resolvePluginLoadCacheContext({
    ...params.options,
    runtimeOptions: {
      ...params.options.runtimeOptions,
      allowGatewaySubagentBinding: true,
    },
  });
  const gatewayBindable = getCachedPluginRegistry(
    gatewayBindableContext.cacheKey,
    gatewayBindableContext.onlyPluginIds,
  );
  if (!gatewayBindable) {
    return undefined;
  }
  return {
    state: gatewayBindable,
    cacheKey: gatewayBindableContext.cacheKey,
    runtimeSubagentMode: gatewayBindableContext.runtimeSubagentMode,
  };
}

function resolveBundledPackageRootForCache(stockRoot?: string): string | undefined {
  if (!stockRoot) {
    return undefined;
  }
  const resolved = path.resolve(stockRoot);
  const parent = path.dirname(resolved);
  if (
    path.basename(resolved) === "extensions" &&
    (path.basename(parent) === "dist" || path.basename(parent) === "dist-runtime")
  ) {
    return path.dirname(parent);
  }
  const sourcePackageRoot = parent;
  if (fs.existsSync(path.join(sourcePackageRoot, "package.json"))) {
    return sourcePackageRoot;
  }
  return undefined;
}

function readPackageVersionForCache(packageJsonPath: string): string {
  const parsed = tryReadJsonSync(packageJsonPath);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return "unknown";
  }
  const version = (parsed as { version?: unknown }).version;
  return typeof version === "string" && version.trim() ? version.trim() : "unknown";
}

const bundledPackageCacheIdentityByStockRoot = new Map<
  string,
  {
    packageJson: string;
    packageRoot: string;
    packageVersion: string;
    size: number;
    mtimeMs: number;
  }
>();

function resolveBundledPackageCacheIdentity(stockRoot?: string):
  | {
      packageJson: string;
      packageRoot: string;
      packageVersion: string;
      size: number;
      mtimeMs: number;
    }
  | undefined {
  if (!stockRoot) {
    return undefined;
  }
  const packageRoot = resolveBundledPackageRootForCache(stockRoot);
  if (!packageRoot) {
    return undefined;
  }
  const stockRootKey = path.resolve(stockRoot);
  const cached = bundledPackageCacheIdentityByStockRoot.get(stockRootKey);
  if (cached) {
    return cached;
  }
  const packageJsonPath = path.join(packageRoot, "package.json");
  try {
    const stat = fs.statSync(packageJsonPath);
    const identity = {
      packageJson: safeRealpathOrResolve(packageJsonPath),
      packageRoot: safeRealpathOrResolve(packageRoot),
      packageVersion: readPackageVersionForCache(packageJsonPath),
      size: stat.size,
      mtimeMs: stat.mtimeMs,
    };
    bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
    return identity;
  } catch {
    const identity = {
      packageJson: path.resolve(packageJsonPath),
      packageRoot: safeRealpathOrResolve(packageRoot),
      packageVersion: "missing",
      size: -1,
      mtimeMs: -1,
    };
    bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
    return identity;
  }
}

function buildCacheKey(params: {
  workspaceDir?: string;
  plugins: NormalizedPluginsConfig;
  activationMetadataKey?: string;
  installs?: Record<string, PluginInstallRecord>;
  env: NodeJS.ProcessEnv;
  devSourceRoot?: string | null;
  onlyPluginIds?: string[];
  includeSetupOnlyChannelPlugins?: boolean;
  forceSetupOnlyChannelPlugins?: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins?: boolean;
  preferSetupRuntimeForChannelPlugins?: boolean;
<<<<<<< HEAD
=======
  forceFullRuntimeForChannelPlugins?: boolean;
  preferBuiltPluginArtifacts?: boolean;
  resolveRawConfigEnvVars?: boolean;
  toolDiscovery?: boolean;
>>>>>>> upstream/main
  loadModules?: boolean;
  runtimeSubagentMode?: "default" | "explicit" | "gateway-bindable";
  pluginSdkResolution?: PluginSdkResolutionPreference;
  coreGatewayMethodNames?: string[];
<<<<<<< HEAD
=======
  activate?: boolean;
>>>>>>> upstream/main
}): string {
  const discoveryContext = resolvePluginDiscoveryContext({
    workspaceDir: params.workspaceDir,
    loadPaths: params.plugins.loadPaths,
    env: params.env,
  });
  const { roots, loadPaths } = discoveryContext;
  const bundledPackage = resolveBundledPackageCacheIdentity(roots.stock);
  const devSourceRoot = params.devSourceRoot ?? "";
  const installs = Object.fromEntries(
    Object.entries(params.installs ?? {}).map(([pluginId, install]) => [
      pluginId,
      {
        ...install,
        installPath:
          typeof install.installPath === "string"
            ? resolveUserPath(install.installPath, params.env)
            : install.installPath,
        sourcePath:
          typeof install.sourcePath === "string"
            ? resolveUserPath(install.sourcePath, params.env)
            : install.sourcePath,
      },
    ]),
  );
  const scopeKey = serializePluginIdScope(params.onlyPluginIds);
  const setupOnlyKey = params.includeSetupOnlyChannelPlugins === true ? "setup-only" : "runtime";
  const setupOnlyModeKey =
    params.forceSetupOnlyChannelPlugins === true ? "force-setup" : "normal-setup";
  const setupOnlyRequirementKey =
    params.requireSetupEntryForSetupOnlyChannelPlugins === true
      ? "require-setup-entry"
      : "allow-full-fallback";
  const startupChannelMode =
<<<<<<< HEAD
    params.preferSetupRuntimeForChannelPlugins === true ? "prefer-setup" : "full";
  const moduleLoadMode = params.loadModules === false ? "manifest-only" : "load-modules";
  const gatewayMethodsKey = JSON.stringify(params.coreGatewayMethodNames ?? []);
=======
    params.forceFullRuntimeForChannelPlugins === true
      ? "force-full"
      : params.preferSetupRuntimeForChannelPlugins === true
        ? "prefer-setup"
        : "full";
  const bundledArtifactMode =
    params.preferBuiltPluginArtifacts === true ? "prefer-built-artifacts" : "source-default";
  const rawConfigEnvMode =
    params.resolveRawConfigEnvVars === true ? "resolve-raw-env" : "runtime-config";
  const moduleLoadMode = params.loadModules === false ? "manifest-only" : "load-modules";
  const discoveryMode = params.toolDiscovery === true ? "tool-discovery" : "default-discovery";
  const runtimeSubagentMode = params.runtimeSubagentMode ?? "default";
  const gatewayMethodsKey = JSON.stringify(params.coreGatewayMethodNames ?? []);
  const activationMode = params.activate === false ? "snapshot" : "active";
>>>>>>> upstream/main
  return `${roots.workspace ?? ""}::${roots.global ?? ""}::${roots.stock ?? ""}::${JSON.stringify({
    bundledPackage,
    devSourceRoot,
    discoveryFingerprint: fingerprintPluginDiscoveryContext(discoveryContext),
    ...params.plugins,
    installs,
    loadPaths,
    activationMetadataKey: params.activationMetadataKey ?? "",
<<<<<<< HEAD
  })}::${scopeKey}::${setupOnlyKey}::${startupChannelMode}::${moduleLoadMode}::${params.runtimeSubagentMode ?? "default"}::${params.pluginSdkResolution ?? "auto"}::${gatewayMethodsKey}`;
=======
  })}::${scopeKey}::${setupOnlyKey}::${setupOnlyModeKey}::${setupOnlyRequirementKey}::${startupChannelMode}::${bundledArtifactMode}::${rawConfigEnvMode}::${moduleLoadMode}::${discoveryMode}::${runtimeSubagentMode}::${params.pluginSdkResolution ?? "auto"}::${gatewayMethodsKey}::${activationMode}`;
>>>>>>> upstream/main
}

function matchesScopedPluginRequest(params: {
  onlyPluginIdSet: ReadonlySet<string> | null;
  pluginId: string;
}): boolean {
  const scopedIds = params.onlyPluginIdSet;
  if (!scopedIds) {
    return true;
  }
  return scopedIds.has(params.pluginId);
}

function resolveRuntimeSubagentMode(
  runtimeOptions: PluginLoadOptions["runtimeOptions"],
): "default" | "explicit" | "gateway-bindable" {
  if (runtimeOptions?.allowGatewaySubagentBinding === true) {
    return "gateway-bindable";
  }
  if (runtimeOptions?.subagent) {
    return "explicit";
  }
  return "default";
}

function buildActivationMetadataHash(params: {
  activationSource: PluginActivationConfigSource;
  autoEnabledReasons: Readonly<Record<string, string[]>>;
}): string {
  const enabledSourceChannels = Object.entries(
    (params.activationSource.rootConfig?.channels as Record<string, unknown>) ?? {},
  )
    .filter(([, value]) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
      }
      return (value as { enabled?: unknown }).enabled === true;
    })
    .map(([channelId]) => channelId)
    .toSorted((left, right) => left.localeCompare(right));
  const pluginEntryStates = Object.entries(params.activationSource.plugins.entries)
    .map(([pluginId, entry]) => [pluginId, entry?.enabled ?? null] as const)
    .toSorted(([left], [right]) => left.localeCompare(right));
  const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons)
    .map(([pluginId, reasons]) => [pluginId, [...reasons]] as const)
    .toSorted(([left], [right]) => left.localeCompare(right));

  return createHash("sha256")
    .update(
      JSON.stringify({
        enabled: params.activationSource.plugins.enabled,
        allow: params.activationSource.plugins.allow,
        deny: params.activationSource.plugins.deny,
        memorySlot: params.activationSource.plugins.slots.memory,
        entries: pluginEntryStates,
        enabledChannels: enabledSourceChannels,
        autoEnabledReasons: autoEnableReasonEntries,
      }),
    )
    .digest("hex");
}

function redactPluginConfigForCacheKey(plugins: NormalizedPluginsConfig): NormalizedPluginsConfig {
  const entries = Object.fromEntries(
    Object.entries(plugins.entries).map(([pluginId, entry]) => [
      pluginId,
      "config" in entry ? { ...entry, config: "<plugin-config>" } : entry,
    ]),
  );
  return { ...plugins, entries };
}

function hasExplicitCompatibilityInputs(options: PluginLoadOptions): boolean {
  return (
    options.config !== undefined ||
    options.activationSourceConfig !== undefined ||
    options.autoEnabledReasons !== undefined ||
    options.workspaceDir !== undefined ||
    options.env !== undefined ||
    options.resolveRawConfigEnvVars !== undefined ||
    hasExplicitPluginIdScope(options.onlyPluginIds) ||
    options.runtimeOptions !== undefined ||
    options.pluginSdkResolution !== undefined ||
    options.coreGatewayHandlers !== undefined ||
    options.includeSetupOnlyChannelPlugins === true ||
    options.forceSetupOnlyChannelPlugins === true ||
    options.requireSetupEntryForSetupOnlyChannelPlugins === true ||
    options.preferSetupRuntimeForChannelPlugins === true ||
    options.preferBuiltPluginArtifacts === true ||
    options.loadModules === false
  );
}

function resolveCoreGatewayMethodNames(options: PluginLoadOptions): string[] {
  const names = new Set(options.coreGatewayMethodNames ?? []);
  for (const name of Object.keys(options.coreGatewayHandlers ?? {})) {
    names.add(name);
  }
  return Array.from(names).toSorted();
}

function pluginLoadOptionsMatchCacheKey(
  options: PluginLoadOptions,
  expectedCacheKey: string,
): boolean {
  return resolvePluginLoadCacheContext(options).cacheKey === expectedCacheKey;
}

function pluginToolDiscoveryOptionsMatchActiveCacheKey(
  options: PluginLoadOptions,
  expectedCacheKey: string,
): boolean {
  if (options.toolDiscovery !== true) {
    return false;
  }
  const fullRuntimeOptions = {
    ...options,
    toolDiscovery: undefined,
  };
  if (pluginLoadOptionsMatchCacheKey(fullRuntimeOptions, expectedCacheKey)) {
    return true;
  }
  if (options.activate !== false) {
    return false;
  }
  return pluginLoadOptionsMatchCacheKey(
    {
      ...fullRuntimeOptions,
      activate: true,
    },
    expectedCacheKey,
  );
}

function registryContainsPluginScope(
  registry: PluginRegistry,
  onlyPluginIds: readonly string[] | undefined,
): boolean {
  if (!onlyPluginIds || onlyPluginIds.length === 0) {
    return false;
  }
  const loadedPluginIds = new Set(registry.plugins.map((plugin) => plugin.id));
  return onlyPluginIds.every((pluginId) => loadedPluginIds.has(pluginId));
}

function scopedPluginLoadOptionsMatchWiderActiveCacheKey(
  options: PluginLoadOptions,
  expectedCacheKey: string,
  activeRegistry: PluginRegistry,
): boolean {
  const { onlyPluginIds } = resolvePluginLoadCacheContext(options);
  if (!registryContainsPluginScope(activeRegistry, onlyPluginIds)) {
    return false;
  }
  return pluginLoadOptionsMatchCacheKey(
    {
      ...options,
      onlyPluginIds: undefined,
    },
    expectedCacheKey,
  );
}

type PluginRegistrationPlan = {
  /** Public compatibility label passed to plugin register(api). */
  mode: PluginRegistrationMode;
  /** Load a setup entry instead of the normal runtime entry. */
  loadSetupEntry: boolean;
  /** Setup flow also needs the runtime channel entry for runtime setters/plugin shape. */
  loadSetupRuntimeEntry: boolean;
  /** Apply runtime capability policy such as memory-slot selection. */
  runRuntimeCapabilityPolicy: boolean;
  /** Register metadata that only belongs to live activation, not discovery snapshots. */
  runFullActivationOnlyRegistrations: boolean;
};

/**
 * Convert loader intent into explicit behavior flags.
 *
 * Registration modes are plugin-facing labels; this plan is the internal source
 * of truth for which entrypoint to load and which activation-only policies run.
 */
function resolvePluginRegistrationPlan(params: {
  canLoadScopedSetupOnlyChannelPlugin: boolean;
  scopedSetupOnlyChannelPluginRequested: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins: boolean;
  enableStateEnabled: boolean;
  shouldLoadModules: boolean;
  validateOnly: boolean;
  shouldActivate: boolean;
  manifestRecord: PluginManifestRecord;
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  preferSetupRuntimeForChannelPlugins: boolean;
  forceFullRuntimeForChannelPlugins: boolean;
  toolDiscovery: boolean;
}): PluginRegistrationPlan | null {
  if (params.canLoadScopedSetupOnlyChannelPlugin) {
    return {
      mode: "setup-only",
      loadSetupEntry: true,
      loadSetupRuntimeEntry: false,
      runRuntimeCapabilityPolicy: false,
      runFullActivationOnlyRegistrations: false,
    };
  }
  if (
    params.scopedSetupOnlyChannelPluginRequested &&
    params.requireSetupEntryForSetupOnlyChannelPlugins
  ) {
    return null;
  }
  if (!params.enableStateEnabled) {
    return null;
  }
  if (params.toolDiscovery) {
    return {
      mode: "tool-discovery",
      loadSetupEntry: false,
      loadSetupRuntimeEntry: false,
      runRuntimeCapabilityPolicy: true,
      runFullActivationOnlyRegistrations: false,
    };
  }
  const loadSetupRuntimeEntry =
    !params.forceFullRuntimeForChannelPlugins &&
    params.shouldLoadModules &&
    !params.validateOnly &&
    shouldLoadChannelPluginInSetupRuntime({
      manifestChannels: params.manifestRecord.channels,
      setupSource: params.manifestRecord.setupSource,
      startupDeferConfiguredChannelFullLoadUntilAfterListen:
        params.manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
      cfg: params.cfg,
      env: params.env,
      preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
    });
  if (loadSetupRuntimeEntry) {
    return {
      mode: "setup-runtime",
      loadSetupEntry: true,
      loadSetupRuntimeEntry: true,
      runRuntimeCapabilityPolicy: false,
      runFullActivationOnlyRegistrations: false,
    };
  }
  const mode = params.shouldActivate ? "full" : "discovery";
  return {
    mode,
    loadSetupEntry: false,
    loadSetupRuntimeEntry: false,
    runRuntimeCapabilityPolicy: true,
    runFullActivationOnlyRegistrations: mode === "full",
  };
}

function applyManifestSnapshotMetadata(
  record: PluginRecord,
  manifestRecord: PluginManifestRecord,
): void {
  record.channelIds = [...(manifestRecord.channels ?? [])];
  record.providerIds = [...(manifestRecord.providers ?? [])];
  record.cliBackendIds = [
    ...(manifestRecord.cliBackends ?? []),
    ...(manifestRecord.setup?.cliBackends ?? []),
  ];
  record.commands = (manifestRecord.commandAliases ?? []).map((alias) => alias.name);
}

function resolvePluginLoadCacheContext(options: PluginLoadOptions = {}) {
  const shouldResolveRawConfigEnvVars = options.resolveRawConfigEnvVars === true;
  const baseEnv = options.env ?? process.env;
  const rawConfig = options.config ?? {};
  const rawActivationSourceConfig = resolvePluginActivationSourceConfig({
    config: options.config,
    activationSourceConfig: options.activationSourceConfig,
  });
  const env = shouldResolveRawConfigEnvVars ? createConfigRuntimeEnv(rawConfig, baseEnv) : baseEnv;
  const cfg = applyTestPluginDefaults(
    shouldResolveRawConfigEnvVars
      ? (resolveConfigEnvVars(rawConfig, env, {
          onMissing: () => undefined,
        }) as OpenClawConfig)
      : rawConfig,
    env,
  );
  const activationSourceConfig = shouldResolveRawConfigEnvVars
    ? (resolveConfigEnvVars(rawActivationSourceConfig, env, {
        onMissing: () => undefined,
      }) as OpenClawConfig)
    : rawActivationSourceConfig;
  const normalized = normalizePluginsConfig(cfg.plugins);
  const activationSource = createPluginActivationSource({
    config: activationSourceConfig,
  });
  const trustNormalized = mergeTrustPluginConfigFromActivationSource({
    normalized,
    activationSource,
  });
  const onlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
  const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
  const forceSetupOnlyChannelPlugins = options.forceSetupOnlyChannelPlugins === true;
  const requireSetupEntryForSetupOnlyChannelPlugins =
    options.requireSetupEntryForSetupOnlyChannelPlugins === true;
  const preferSetupRuntimeForChannelPlugins = options.preferSetupRuntimeForChannelPlugins === true;
  const forceFullRuntimeForChannelPlugins = options.forceFullRuntimeForChannelPlugins === true;
  const preferBuiltPluginArtifacts = options.preferBuiltPluginArtifacts === true;
  const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
  const coreGatewayMethodNames = resolveCoreGatewayMethodNames(options);
  const installRecords = {
    ...(options.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env })),
    ...cfg.plugins?.installs,
  };
  const devSourceRoot = resolveOpenClawDevSourceRoot(env);
  const cacheKey = buildCacheKey({
    workspaceDir: options.workspaceDir,
    plugins: shouldResolveRawConfigEnvVars
      ? redactPluginConfigForCacheKey(trustNormalized)
      : trustNormalized,
    activationMetadataKey: buildActivationMetadataHash({
      activationSource,
      autoEnabledReasons: options.autoEnabledReasons ?? {},
    }),
    installs: installRecords,
    env,
    devSourceRoot,
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
    resolveRawConfigEnvVars: options.resolveRawConfigEnvVars,
    toolDiscovery: options.toolDiscovery,
    loadModules: options.loadModules,
    runtimeSubagentMode,
    pluginSdkResolution: options.pluginSdkResolution,
    ...(coreGatewayMethodNames !== undefined && { coreGatewayMethodNames }),
    activate: options.activate,
  });
  return {
    env,
    cfg,
    normalized: trustNormalized,
    activationSourceConfig,
    activationSource,
    autoEnabledReasons: options.autoEnabledReasons ?? {},
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
    shouldActivate: options.activate !== false,
    shouldLoadModules: options.loadModules !== false,
    runtimeSubagentMode,
    installRecords,
    devSourceRoot,
    cacheKey,
  };
}

function mergeTrustPluginConfigFromActivationSource(params: {
  normalized: NormalizedPluginsConfig;
  activationSource: PluginActivationConfigSource;
}): NormalizedPluginsConfig {
  const source = params.activationSource.plugins;
  const allow = mergePluginTrustList(params.normalized.allow, source.allow);
  const deny = mergePluginTrustList(params.normalized.deny, source.deny);
  const loadPaths = mergePluginTrustList(params.normalized.loadPaths, source.loadPaths);
  if (
    allow === params.normalized.allow &&
    deny === params.normalized.deny &&
    loadPaths === params.normalized.loadPaths
  ) {
    return params.normalized;
  }
  return {
    ...params.normalized,
    allow,
    deny,
    loadPaths,
  };
}

function mergePluginTrustList(runtimeList: string[], sourceList: readonly string[]): string[] {
  if (sourceList.length === 0) {
    return runtimeList;
  }
  const merged = [...runtimeList];
  const seen = new Set(merged);
  for (const entry of sourceList) {
    if (!seen.has(entry)) {
      merged.push(entry);
      seen.add(entry);
    }
  }
  return merged.length === runtimeList.length ? runtimeList : merged;
}

function getCompatibleActivePluginRegistry(
  options: PluginLoadOptions = {},
): PluginRegistry | undefined {
  if (options.resolveRawConfigEnvVars === true) {
    return undefined;
  }
  const activeRegistry = getActivePluginRegistry() ?? undefined;
  if (!activeRegistry) {
    return undefined;
  }
  if (!hasExplicitCompatibilityInputs(options)) {
    return activeRegistry;
  }
  const activeCacheKey = getActivePluginRegistryKey();
  if (!activeCacheKey) {
    return undefined;
  }
  const loadContext = resolvePluginLoadCacheContext(options);
  const matchesActiveCacheKey = (candidate: PluginLoadOptions): boolean => {
    if (pluginLoadOptionsMatchCacheKey(candidate, activeCacheKey)) {
      return true;
    }
    if (candidate.coreGatewayMethodNames !== undefined) {
      return false;
    }
    return pluginLoadOptionsMatchCacheKey(
      {
        ...candidate,
        coreGatewayMethodNames: activeRegistry.coreGatewayMethodNames ?? [],
      },
      activeCacheKey,
    );
  };
  const matchesCompatibleActiveRegistry = (candidate: PluginLoadOptions): boolean => {
    if (matchesActiveCacheKey(candidate)) {
      return true;
    }
    if (
      scopedPluginLoadOptionsMatchWiderActiveCacheKey(candidate, activeCacheKey, activeRegistry)
    ) {
      return true;
    }
    return pluginToolDiscoveryOptionsMatchActiveCacheKey(candidate, activeCacheKey);
  };

  if (matchesCompatibleActiveRegistry(options)) {
    return activeRegistry;
  }
  if (!loadContext.shouldActivate) {
    const activatingOptions = {
      ...options,
      activate: true,
    };
    if (matchesCompatibleActiveRegistry(activatingOptions)) {
      return activeRegistry;
    }
  }
  const activeRuntimeSubagentMode = getActivePluginRuntimeSubagentMode();
  if (activeRuntimeSubagentMode === "gateway-bindable") {
    const gatewayStartupOptions: PluginLoadOptions = {
      ...options,
      preferBuiltPluginArtifacts: true,
    };
    if (matchesCompatibleActiveRegistry(gatewayStartupOptions)) {
      return activeRegistry;
    }
    if (!loadContext.shouldActivate) {
      const activatingGatewayStartupOptions: PluginLoadOptions = {
        ...options,
        activate: true,
        preferBuiltPluginArtifacts: true,
      };
      if (matchesCompatibleActiveRegistry(activatingGatewayStartupOptions)) {
        return activeRegistry;
      }
    }
  }
  if (
    loadContext.runtimeSubagentMode === "default" &&
    activeRuntimeSubagentMode === "gateway-bindable"
  ) {
    const gatewayBindableOptions: PluginLoadOptions = {
      ...options,
      runtimeOptions: {
        ...options.runtimeOptions,
        allowGatewaySubagentBinding: true,
      },
    };
    const gatewayStartupOptions: PluginLoadOptions = {
      ...gatewayBindableOptions,
      preferBuiltPluginArtifacts: true,
    };
    if (!loadContext.shouldActivate) {
      const activatingGatewayBindableOptions: PluginLoadOptions = {
        ...options,
        activate: true,
        runtimeOptions: {
          ...options.runtimeOptions,
          allowGatewaySubagentBinding: true,
        },
      };
      const activatingGatewayStartupOptions: PluginLoadOptions = {
        ...activatingGatewayBindableOptions,
        preferBuiltPluginArtifacts: true,
      };
      if (
        matchesCompatibleActiveRegistry(gatewayBindableOptions) ||
        matchesCompatibleActiveRegistry(gatewayStartupOptions) ||
        matchesCompatibleActiveRegistry(activatingGatewayBindableOptions) ||
        matchesCompatibleActiveRegistry(activatingGatewayStartupOptions)
      ) {
        return activeRegistry;
      }
    } else if (
      matchesCompatibleActiveRegistry(gatewayBindableOptions) ||
      matchesCompatibleActiveRegistry(gatewayStartupOptions)
    ) {
      return activeRegistry;
    }
  }
  return undefined;
}

export function resolveRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined {
  if (!options || !hasExplicitCompatibilityInputs(options)) {
    return getCompatibleActivePluginRegistry();
  }
  const compatible = getCompatibleActivePluginRegistry(options);
  if (compatible) {
    return compatible;
  }
  // Helper/runtime callers should not recurse into the same snapshot load while
  // plugin registration is still in flight. Let direct loadOpenClawPlugins(...)
  // callers surface the hard error instead.
  if (isPluginRegistryLoadInFlight(options)) {
    return undefined;
  }
  return loadOpenClawPlugins(options);
}

export function getRuntimePluginRegistryForLoadOptions(
  options?: PluginLoadOptions,
): PluginRegistry | undefined {
  return resolveRuntimePluginRegistry(options);
}

export function resolvePluginRegistryLoadCacheKey(options: PluginLoadOptions = {}): string {
  return resolvePluginLoadCacheContext(options).cacheKey;
}

export function isPluginRegistryLoadInFlight(options: PluginLoadOptions = {}): boolean {
  return pluginLoaderCacheState.isLoadInFlight(resolvePluginRegistryLoadCacheKey(options));
}

export function resolveCompatibleRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined {
  // Check whether the active runtime registry is already compatible with these
  // load options. Unlike resolveRuntimePluginRegistry, this never triggers a
  // fresh plugin load on cache miss.
  return getCompatibleActivePluginRegistry(options);
}

function matchesScopedPluginRequest(params: {
  onlyPluginIdSet: ReadonlySet<string> | null;
  pluginId: string;
}): boolean {
  const scopedIds = params.onlyPluginIdSet;
  if (!scopedIds) {
    return true;
  }
  return scopedIds.has(params.pluginId);
}

function resolveRuntimeSubagentMode(
  runtimeOptions: PluginLoadOptions["runtimeOptions"],
): "default" | "explicit" | "gateway-bindable" {
  if (runtimeOptions?.allowGatewaySubagentBinding === true) {
    return "gateway-bindable";
  }
  if (runtimeOptions?.subagent) {
    return "explicit";
  }
  return "default";
}

function buildActivationMetadataHash(params: {
  activationSource: PluginActivationConfigSource;
  autoEnabledReasons: Readonly<Record<string, string[]>>;
}): string {
  const enabledSourceChannels = Object.entries(
    (params.activationSource.rootConfig?.channels as Record<string, unknown>) ?? {},
  )
    .filter(([, value]) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
      }
      return (value as { enabled?: unknown }).enabled === true;
    })
    .map(([channelId]) => channelId)
    .toSorted((left, right) => left.localeCompare(right));
  const pluginEntryStates = Object.entries(params.activationSource.plugins.entries)
    .map(([pluginId, entry]) => [pluginId, entry?.enabled ?? null] as const)
    .toSorted(([left], [right]) => left.localeCompare(right));
  const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons)
    .map(([pluginId, reasons]) => [pluginId, [...reasons]] as const)
    .toSorted(([left], [right]) => left.localeCompare(right));

  return createHash("sha256")
    .update(
      JSON.stringify({
        enabled: params.activationSource.plugins.enabled,
        allow: params.activationSource.plugins.allow,
        deny: params.activationSource.plugins.deny,
        memorySlot: params.activationSource.plugins.slots.memory,
        entries: pluginEntryStates,
        enabledChannels: enabledSourceChannels,
        autoEnabledReasons: autoEnableReasonEntries,
      }),
    )
    .digest("hex");
}

function hasExplicitCompatibilityInputs(options: PluginLoadOptions): boolean {
  return Boolean(
    options.config !== undefined ||
    options.activationSourceConfig !== undefined ||
    options.autoEnabledReasons !== undefined ||
    options.workspaceDir !== undefined ||
    options.env !== undefined ||
    options.onlyPluginIds?.length ||
    options.runtimeOptions !== undefined ||
    options.pluginSdkResolution !== undefined ||
    options.coreGatewayHandlers !== undefined ||
    options.includeSetupOnlyChannelPlugins === true ||
    options.preferSetupRuntimeForChannelPlugins === true ||
    options.loadModules === false,
  );
}

function resolvePluginLoadCacheContext(options: PluginLoadOptions = {}) {
  const env = options.env ?? process.env;
  const cfg = applyTestPluginDefaults(options.config ?? {}, env);
  const activationSourceConfig = options.activationSourceConfig ?? options.config ?? {};
  const normalized = normalizePluginsConfig(cfg.plugins);
  const activationSource = createPluginActivationSource({
    config: activationSourceConfig,
  });
  const onlyPluginIds = normalizeScopedPluginIds(options.onlyPluginIds);
  const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
  const preferSetupRuntimeForChannelPlugins = options.preferSetupRuntimeForChannelPlugins === true;
  const coreGatewayMethodNames = Object.keys(options.coreGatewayHandlers ?? {}).toSorted();
  const cacheKey = buildCacheKey({
    workspaceDir: options.workspaceDir,
    plugins: normalized,
    activationMetadataKey: buildActivationMetadataHash({
      activationSource,
      autoEnabledReasons: options.autoEnabledReasons ?? {},
    }),
    installs: cfg.plugins?.installs,
    env,
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    loadModules: options.loadModules,
    runtimeSubagentMode: resolveRuntimeSubagentMode(options.runtimeOptions),
    pluginSdkResolution: options.pluginSdkResolution,
    coreGatewayMethodNames,
  });
  return {
    env,
    cfg,
    normalized,
    activationSourceConfig,
    activationSource,
    autoEnabledReasons: options.autoEnabledReasons ?? {},
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    shouldActivate: options.activate !== false,
    shouldLoadModules: options.loadModules !== false,
    runtimeSubagentMode: resolveRuntimeSubagentMode(options.runtimeOptions),
    cacheKey,
  };
}

function getCompatibleActivePluginRegistry(
  options: PluginLoadOptions = {},
): PluginRegistry | undefined {
  const activeRegistry = getActivePluginRegistry() ?? undefined;
  if (!activeRegistry) {
    return undefined;
  }
  if (!hasExplicitCompatibilityInputs(options)) {
    return activeRegistry;
  }
  const activeCacheKey = getActivePluginRegistryKey();
  if (!activeCacheKey) {
    return undefined;
  }
  return resolvePluginLoadCacheContext(options).cacheKey === activeCacheKey
    ? activeRegistry
    : undefined;
}

export function resolveRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined {
  if (!options || !hasExplicitCompatibilityInputs(options)) {
    return getCompatibleActivePluginRegistry();
  }
  return getCompatibleActivePluginRegistry(options) ?? loadOpenClawPlugins(options);
}

export function resolveCompatibleRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined {
  // Check whether the active runtime registry is already compatible with these
  // load options. Unlike resolveRuntimePluginRegistry, this never triggers a
  // fresh plugin load on cache miss.
  return getCompatibleActivePluginRegistry(options);
}

function validatePluginConfig(params: {
  schema?: Record<string, unknown>;
  cacheKey?: string;
  value?: unknown;
}): { ok: boolean; value?: Record<string, unknown>; errors?: string[] } {
  const value = params.value;
  const schema = params.schema;
  if (!schema) {
    return { ok: true, value: value as Record<string, unknown> | undefined };
  }
  if (isEmptyPluginConfigJsonSchema(schema)) {
    if (
      value === undefined ||
      (value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)
    ) {
      return { ok: true, value: {} };
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, errors: ["<root>: must be object"] };
    }
    return { ok: false, errors: ["<root>: config must be empty"] };
  }
  const cacheKey = params.cacheKey ?? JSON.stringify(schema);
  const result = validateJsonSchemaValue({
    schema,
    cacheKey,
    value: value ?? {},
    applyDefaults: true,
  });
  if (result.ok) {
    return { ok: true, value: result.value as Record<string, unknown> | undefined };
  }
  return { ok: false, errors: result.errors.map((error) => error.text) };
}

function isEmptyPluginConfigJsonSchema(schema: Record<string, unknown>): boolean {
  if (schema.type !== "object" || schema.additionalProperties !== false) {
    return false;
  }
  const properties = schema.properties;
  if (
    !properties ||
    typeof properties !== "object" ||
    Array.isArray(properties) ||
    Object.keys(properties).length > 0
  ) {
    return false;
  }
  return !(
    "required" in schema ||
    "dependentRequired" in schema ||
    "dependencies" in schema ||
    "minProperties" in schema ||
    "allOf" in schema ||
    "anyOf" in schema ||
    "oneOf" in schema ||
    "not" in schema
  );
}

function resolvePluginModuleExport(moduleExport: unknown): {
  definition?: OpenClawPluginDefinition;
  register?: OpenClawPluginDefinition["register"];
} {
  const seen = new Set<unknown>();
  const candidates: unknown[] = [unwrapDefaultModuleExport(moduleExport), moduleExport];
  for (let index = 0; index < candidates.length && index < 12; index += 1) {
    const resolved = candidates[index];
    if (seen.has(resolved)) {
      continue;
    }
    seen.add(resolved);
    if (typeof resolved === "function") {
      return {
        register: resolved as OpenClawPluginDefinition["register"],
      };
    }
    if (resolved && typeof resolved === "object") {
      const def = resolved as OpenClawPluginDefinition;
      const register = def.register ?? def.activate;
      if (typeof register === "function") {
        return { definition: def, register };
      }
      for (const key of ["default", "module"]) {
        if (key in def) {
          candidates.push((def as Record<string, unknown>)[key]);
        }
      }
    }
  }
  const resolved = candidates[0];
  if (typeof resolved === "function") {
    return {
      register: resolved as OpenClawPluginDefinition["register"],
    };
  }
  if (resolved && typeof resolved === "object") {
    const def = resolved as OpenClawPluginDefinition;
    const register = def.register ?? def.activate;
    return { definition: def, register };
  }
  return {};
}

function kindIncludes(kind: unknown, target: string): boolean {
  return kind === target || (Array.isArray(kind) && kind.includes(target));
}

function formatBundledChannelWrongLoaderError(kind: unknown): string | null {
  if (kindIncludes(kind, "bundled-channel-setup-entry")) {
    return "bundled channel setup entry requires setup-runtime loader";
  }
  if (kindIncludes(kind, "bundled-channel-entry")) {
    return "bundled channel entry requires setup-runtime loader";
  }
<<<<<<< HEAD
  return !params.manifestChannels.some((channelId) =>
    isChannelConfigured(params.cfg, channelId, params.env),
  );
}

function createPluginRecord(params: {
  id: string;
  name?: string;
  description?: string;
  version?: string;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  source: string;
  rootDir?: string;
  origin: PluginRecord["origin"];
  workspaceDir?: string;
  enabled: boolean;
  activationState?: PluginActivationState;
  configSchema: boolean;
  contracts?: PluginManifestContracts;
}): PluginRecord {
  return {
    id: params.id,
    name: params.name ?? params.id,
    description: params.description,
    version: params.version,
    format: params.format ?? "openclaw",
    bundleFormat: params.bundleFormat,
    bundleCapabilities: params.bundleCapabilities,
    source: params.source,
    rootDir: params.rootDir,
    origin: params.origin,
    workspaceDir: params.workspaceDir,
    enabled: params.enabled,
    explicitlyEnabled: params.activationState?.explicitlyEnabled,
    activated: params.activationState?.activated,
    activationSource: params.activationState?.source,
    activationReason: params.activationState?.reason,
    status: params.enabled ? "loaded" : "disabled",
    toolNames: [],
    hookNames: [],
    channelIds: [],
    providerIds: [],
    speechProviderIds: [],
    realtimeTranscriptionProviderIds: [],
    realtimeVoiceProviderIds: [],
    mediaUnderstandingProviderIds: [],
    imageGenerationProviderIds: [],
    videoGenerationProviderIds: [],
    musicGenerationProviderIds: [],
    webFetchProviderIds: [],
    webSearchProviderIds: [],
    memoryEmbeddingProviderIds: [],
    gatewayMethods: [],
    cliCommands: [],
    services: [],
    commands: [],
    httpRoutes: 0,
    hookCount: 0,
    configSchema: params.configSchema,
    configUiHints: undefined,
    configJsonSchema: undefined,
    contracts: params.contracts,
  };
}

function markPluginActivationDisabled(record: PluginRecord, reason?: string): void {
  record.activated = false;
  record.activationSource = "disabled";
  record.activationReason = reason;
}

function formatAutoEnabledActivationReason(
  reasons: readonly string[] | undefined,
): string | undefined {
  if (!reasons || reasons.length === 0) {
    return undefined;
  }
  return reasons.join("; ");
}

function recordPluginError(params: {
  logger: PluginLogger;
  registry: PluginRegistry;
  record: PluginRecord;
  seenIds: Map<string, PluginRecord["origin"]>;
  pluginId: string;
  origin: PluginRecord["origin"];
  phase: PluginRecord["failurePhase"];
  error: unknown;
  logPrefix: string;
  diagnosticMessagePrefix: string;
}) {
  const errorText =
    process.env.OPENCLAW_PLUGIN_LOADER_DEBUG_STACKS === "1" &&
    params.error instanceof Error &&
    typeof params.error.stack === "string"
      ? params.error.stack
      : String(params.error);
  const deprecatedApiHint =
    errorText.includes("api.registerHttpHandler") && errorText.includes("is not a function")
      ? "deprecated api.registerHttpHandler(...) was removed; use api.registerHttpRoute(...) for plugin-owned routes or registerPluginHttpRoute(...) for dynamic lifecycle routes"
      : null;
  const displayError = deprecatedApiHint ? `${deprecatedApiHint} (${errorText})` : errorText;
  params.logger.error(`${params.logPrefix}${displayError}`);
  params.record.status = "error";
  params.record.error = displayError;
  params.record.failedAt = new Date();
  params.record.failurePhase = params.phase;
  params.registry.plugins.push(params.record);
  params.seenIds.set(params.pluginId, params.origin);
  params.registry.diagnostics.push({
    level: "error",
    pluginId: params.record.id,
    source: params.record.source,
    message: `${params.diagnosticMessagePrefix}${displayError}`,
  });
=======
  return null;
>>>>>>> upstream/main
}

function formatPluginFailureSummary(failedPlugins: PluginRecord[]): string {
  const grouped = new Map<NonNullable<PluginRecord["failurePhase"]>, string[]>();
  for (const plugin of failedPlugins) {
    const phase = plugin.failurePhase ?? "load";
    const ids = grouped.get(phase);
    if (ids) {
      ids.push(plugin.id);
      continue;
    }
    grouped.set(phase, [plugin.id]);
  }
  return [...grouped.entries()].map(([phase, ids]) => `${phase}: ${ids.join(", ")}`).join("; ");
}

function pushDiagnostics(diagnostics: PluginDiagnostic[], append: PluginDiagnostic[]) {
  diagnostics.push(...append);
}

function maybeThrowOnPluginLoadError(
  registry: PluginRegistry,
  throwOnLoadError: boolean | undefined,
): void {
  if (!throwOnLoadError) {
    return;
  }
  if (!registry.plugins.some((entry) => entry.status === "error")) {
    return;
  }
  throw new PluginLoadFailureError(registry);
}

function activatePluginRegistry(
  registry: PluginRegistry,
  cacheKey: string,
  runtimeSubagentMode: "default" | "explicit" | "gateway-bindable",
  workspaceDir?: string,
): void {
  const preserveGatewayHookRunner =
    runtimeSubagentMode === "default" &&
    getActivePluginRuntimeSubagentMode() === "gateway-bindable" &&
    getGlobalHookRunner() !== null;
  setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
  if (!preserveGatewayHookRunner) {
    initializeGlobalHookRunner(registry);
  }
<<<<<<< HEAD
  const resolved = resolveUserPath(trimmed, env);
  if (!resolved) {
    return;
  }
  if (matcher.exact.has(resolved) || matcher.dirs.includes(resolved)) {
    return;
  }
  const stat = safeStatSync(resolved);
  if (stat?.isDirectory()) {
    matcher.dirs.push(resolved);
    return;
  }
  matcher.exact.add(resolved);
}

function matchesPathMatcher(matcher: PathMatcher, sourcePath: string): boolean {
  if (matcher.exact.has(sourcePath)) {
    return true;
  }
  return matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
}

function buildProvenanceIndex(params: {
  config: OpenClawConfig;
  normalizedLoadPaths: string[];
  env: NodeJS.ProcessEnv;
}): PluginProvenanceIndex {
  const loadPathMatcher = createPathMatcher();
  for (const loadPath of params.normalizedLoadPaths) {
    addPathToMatcher(loadPathMatcher, loadPath, params.env);
  }

  const installRules = new Map<string, InstallTrackingRule>();
  const installs = params.config.plugins?.installs ?? {};
  for (const [pluginId, install] of Object.entries(installs)) {
    const rule: InstallTrackingRule = {
      trackedWithoutPaths: false,
      matcher: createPathMatcher(),
    };
    const trackedPaths = [install.installPath, install.sourcePath]
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
    if (trackedPaths.length === 0) {
      rule.trackedWithoutPaths = true;
    } else {
      for (const trackedPath of trackedPaths) {
        addPathToMatcher(rule.matcher, trackedPath, params.env);
      }
    }
    installRules.set(pluginId, rule);
  }

  return { loadPathMatcher, installRules };
}

function isTrackedByProvenance(params: {
  pluginId: string;
  source: string;
  index: PluginProvenanceIndex;
  env: NodeJS.ProcessEnv;
}): boolean {
  const sourcePath = resolveUserPath(params.source, params.env);
  const installRule = params.index.installRules.get(params.pluginId);
  if (installRule) {
    if (installRule.trackedWithoutPaths) {
      return true;
    }
    if (matchesPathMatcher(installRule.matcher, sourcePath)) {
      return true;
    }
  }
  return matchesPathMatcher(params.index.loadPathMatcher, sourcePath);
}

function matchesExplicitInstallRule(params: {
  pluginId: string;
  source: string;
  index: PluginProvenanceIndex;
  env: NodeJS.ProcessEnv;
}): boolean {
  const sourcePath = resolveUserPath(params.source, params.env);
  const installRule = params.index.installRules.get(params.pluginId);
  if (!installRule || installRule.trackedWithoutPaths) {
    return false;
  }
  return matchesPathMatcher(installRule.matcher, sourcePath);
}

function resolveCandidateDuplicateRank(params: {
  candidate: ReturnType<typeof discoverOpenClawPlugins>["candidates"][number];
  manifestByRoot: Map<string, ReturnType<typeof loadPluginManifestRegistry>["plugins"][number]>;
  provenance: PluginProvenanceIndex;
  env: NodeJS.ProcessEnv;
}): number {
  const manifestRecord = params.manifestByRoot.get(params.candidate.rootDir);
  const pluginId = manifestRecord?.id;
  const isExplicitInstall =
    params.candidate.origin === "global" &&
    pluginId !== undefined &&
    matchesExplicitInstallRule({
      pluginId,
      source: params.candidate.source,
      index: params.provenance,
      env: params.env,
    });

  if (params.candidate.origin === "config") {
    return 0;
  }
  if (params.candidate.origin === "global" && isExplicitInstall) {
    return 1;
  }
  if (params.candidate.origin === "bundled") {
    // Bundled plugin ids stay reserved unless the operator configured an override.
    return 2;
  }
  if (params.candidate.origin === "workspace") {
    return 3;
  }
  return 4;
}

function compareDuplicateCandidateOrder(params: {
  left: ReturnType<typeof discoverOpenClawPlugins>["candidates"][number];
  right: ReturnType<typeof discoverOpenClawPlugins>["candidates"][number];
  manifestByRoot: Map<string, ReturnType<typeof loadPluginManifestRegistry>["plugins"][number]>;
  provenance: PluginProvenanceIndex;
  env: NodeJS.ProcessEnv;
}): number {
  const leftPluginId = params.manifestByRoot.get(params.left.rootDir)?.id;
  const rightPluginId = params.manifestByRoot.get(params.right.rootDir)?.id;
  if (!leftPluginId || leftPluginId !== rightPluginId) {
    return 0;
  }
  return (
    resolveCandidateDuplicateRank({
      candidate: params.left,
      manifestByRoot: params.manifestByRoot,
      provenance: params.provenance,
      env: params.env,
    }) -
    resolveCandidateDuplicateRank({
      candidate: params.right,
      manifestByRoot: params.manifestByRoot,
      provenance: params.provenance,
      env: params.env,
    })
  );
}

function warnWhenAllowlistIsOpen(params: {
  emitWarning: boolean;
  logger: PluginLogger;
  pluginsEnabled: boolean;
  allow: string[];
  warningCacheKey: string;
  discoverablePlugins: Array<{ id: string; source: string; origin: PluginRecord["origin"] }>;
}) {
  if (!params.emitWarning) {
    return;
  }
  if (!params.pluginsEnabled) {
    return;
  }
  if (params.allow.length > 0) {
    return;
  }
  const autoDiscoverable = params.discoverablePlugins.filter(
    (entry) => entry.origin === "workspace" || entry.origin === "global",
  );
  if (autoDiscoverable.length === 0) {
    return;
  }
  if (openAllowlistWarningCache.has(params.warningCacheKey)) {
    return;
  }
  const preview = autoDiscoverable
    .slice(0, 6)
    .map((entry) => `${entry.id} (${entry.source})`)
    .join(", ");
  const extra = autoDiscoverable.length > 6 ? ` (+${autoDiscoverable.length - 6} more)` : "";
  openAllowlistWarningCache.add(params.warningCacheKey);
  params.logger.warn(
    `[plugins] plugins.allow is empty; discovered non-bundled plugins may auto-load: ${preview}${extra}. Set plugins.allow to explicit trusted ids.`,
  );
}

function warnAboutUntrackedLoadedPlugins(params: {
  registry: PluginRegistry;
  provenance: PluginProvenanceIndex;
  allowlist: string[];
  emitWarning: boolean;
  logger: PluginLogger;
  env: NodeJS.ProcessEnv;
}) {
  const allowSet = new Set(params.allowlist);
  for (const plugin of params.registry.plugins) {
    if (plugin.status !== "loaded" || plugin.origin === "bundled") {
      continue;
    }
    if (allowSet.has(plugin.id)) {
      continue;
    }
    if (
      isTrackedByProvenance({
        pluginId: plugin.id,
        source: plugin.source,
        index: params.provenance,
        env: params.env,
      })
    ) {
      continue;
    }
    const message =
      "loaded without install/load-path provenance; treat as untracked local code and pin trust via plugins.allow or install records";
    params.registry.diagnostics.push({
      level: "warn",
      pluginId: plugin.id,
      source: plugin.source,
      message,
    });
    if (params.emitWarning) {
      params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
    }
  }
}

function activatePluginRegistry(
  registry: PluginRegistry,
  cacheKey: string,
  runtimeSubagentMode: "default" | "explicit" | "gateway-bindable",
  workspaceDir?: string,
): void {
  setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
  initializeGlobalHookRunner(registry);
=======
>>>>>>> upstream/main
}

export function loadOpenClawPlugins(options: PluginLoadOptions = {}): PluginRegistry {
  const requestedOnlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
  const requestedOnlyPluginIdSet = createPluginIdScopeSet(requestedOnlyPluginIds);
  if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
    const emptyRegistry = createEmptyPluginRegistry();
    if (options.activate !== false) {
      clearActivatedPluginRuntimeState();
      activatePluginRegistry(
        emptyRegistry,
        `empty-plugin-scope::${resolveRuntimeSubagentMode(options.runtimeOptions)}::${options.workspaceDir ?? ""}`,
        resolveRuntimeSubagentMode(options.runtimeOptions),
        options.workspaceDir,
      );
    }
    return emptyRegistry;
  }
<<<<<<< HEAD
=======

>>>>>>> upstream/main
  const {
    env,
    cfg,
    normalized,
    activationSource,
    autoEnabledReasons,
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
<<<<<<< HEAD
=======
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
>>>>>>> upstream/main
    shouldActivate,
    shouldLoadModules,
    cacheKey,
    runtimeSubagentMode,
<<<<<<< HEAD
  } = resolvePluginLoadCacheContext(options);
  const logger = options.logger ?? defaultLogger();
  const validateOnly = options.mode === "validate";
  const onlyPluginIdSet = onlyPluginIds ? new Set(onlyPluginIds) : null;
  const cacheEnabled = options.cache !== false;
=======
    installRecords,
    devSourceRoot,
  } = resolvePluginLoadCacheContext(options);
  const logger = options.logger ?? defaultLogger();
  const validateOnly = options.mode === "validate";
  const onlyPluginIdSet = createPluginIdScopeSet(onlyPluginIds);

  const cacheEnabled = options.cache !== false && options.resolveRawConfigEnvVars !== true;
>>>>>>> upstream/main
  if (cacheEnabled) {
    const cached = getReusableCachedPluginRegistry({
      cacheKey,
      onlyPluginIds,
      runtimeSubagentMode,
      options,
    });
    if (cached) {
<<<<<<< HEAD
      restoreRegisteredMemoryEmbeddingProviders(cached.memoryEmbeddingProviders);
      restoreMemoryPluginState({
        corpusSupplements: cached.memoryCorpusSupplements,
        promptBuilder: cached.memoryPromptBuilder,
        promptSupplements: cached.memoryPromptSupplements,
        flushPlanResolver: cached.memoryFlushPlanResolver,
        runtime: cached.memoryRuntime,
      });
      if (shouldActivate) {
        activatePluginRegistry(
          cached.registry,
          cacheKey,
          runtimeSubagentMode,
=======
      if (shouldActivate) {
        restoreRegisteredAgentHarnesses(cached.state.agentHarnesses);
        restorePluginCommands(cached.state.commands ?? []);
        restoreRegisteredCompactionProviders(cached.state.compactionProviders);
        restoreDetachedTaskLifecycleRuntimeRegistration(
          cached.state.detachedTaskRuntimeRegistration,
        );
        restorePluginInteractiveHandlers(cached.state.interactiveHandlers ?? []);
        restoreRegisteredEmbeddingProviders(cached.state.embeddingProviders);
        restoreRegisteredMemoryEmbeddingProviders(cached.state.memoryEmbeddingProviders);
        restoreMemoryPluginState({
          capability: cached.state.memoryCapability,
          corpusSupplements: cached.state.memoryCorpusSupplements,
          promptSupplements: cached.state.memoryPromptSupplements,
        });
        activatePluginRegistry(
          cached.state.registry,
          cached.cacheKey,
          cached.runtimeSubagentMode,
>>>>>>> upstream/main
          options.workspaceDir,
        );
      }
      return cached.state.registry;
    }
  }
<<<<<<< HEAD

  // Clear previously registered plugin state before reloading.
  // Skip for non-activating (snapshot) loads to avoid wiping commands from other plugins.
  if (shouldActivate) {
    clearPluginCommands();
    clearPluginInteractiveHandlers();
    clearMemoryPluginState();
  }

  // Lazy: avoid creating the Jiti loader when all plugins are disabled (common in unit tests).
  const getJiti = createPluginJitiLoader(options);
=======
  pluginLoaderCacheState.beginLoad(cacheKey);
  try {
    // Clear previously registered plugin state before reloading.
    // Skip for non-activating (snapshot) loads to avoid wiping commands from other plugins.
    if (shouldActivate) {
      clearActivatedPluginRuntimeState();
    }
>>>>>>> upstream/main

    // Lazy: avoid creating module loaders when all plugins are disabled (common in unit tests).
    const loadPluginModule = createPluginModuleLoader({
      devSourceRoot,
      pluginSdkResolution: options.pluginSdkResolution,
    });

    let createPluginRuntimeFactory:
      | ((options?: CreatePluginRuntimeOptions) => PluginRuntime)
      | null = null;
    const resolveCreatePluginRuntime = (): ((
      options?: CreatePluginRuntimeOptions,
    ) => PluginRuntime) => {
      if (createPluginRuntimeFactory) {
        return createPluginRuntimeFactory;
      }
      const runtimeModuleResolution = resolvePluginRuntimeModulePathWithDiagnostics({
        devSourceRoot,
        pluginSdkResolution: options.pluginSdkResolution,
      });
      const runtimeModulePath = runtimeModuleResolution.resolvedPath;
      if (!runtimeModulePath) {
        throw new Error(
          formatPluginRuntimeModuleResolutionError({
            resolution: runtimeModuleResolution,
            pluginSdkResolution: options.pluginSdkResolution,
          }),
        );
      }
      const runtimeModule = withProfile(
        { source: runtimeModulePath },
        "runtime-module",
        () =>
          loadPluginModule(runtimeModulePath) as {
            createPluginRuntime?: (options?: CreatePluginRuntimeOptions) => PluginRuntime;
          },
      );
      if (typeof runtimeModule.createPluginRuntime !== "function") {
        throw new Error("Plugin runtime module missing createPluginRuntime export");
      }
      createPluginRuntimeFactory = runtimeModule.createPluginRuntime;
      return createPluginRuntimeFactory;
<<<<<<< HEAD
    }
    const runtimeModulePath = resolvePluginRuntimeModulePath({
      pluginSdkResolution: options.pluginSdkResolution,
    });
    if (!runtimeModulePath) {
      throw new Error("Unable to resolve plugin runtime module");
    }
    const runtimeModule = getJiti(runtimeModulePath)(runtimeModulePath) as {
      createPluginRuntime?: (options?: CreatePluginRuntimeOptions) => PluginRuntime;
=======
>>>>>>> upstream/main
    };

    // Lazily initialize the runtime so startup paths that discover/skip plugins do
    // not eagerly load every channel/runtime dependency tree.
    let resolvedRuntime: PluginRuntime | null = null;
    const resolveRuntime = (): PluginRuntime => {
      resolvedRuntime ??= resolveCreatePluginRuntime()(options.runtimeOptions);
      return resolvedRuntime;
    };
    const lazyRuntimeReflectionKeySet = new Set<PropertyKey>(LAZY_RUNTIME_REFLECTION_KEYS);
    const resolveLazyRuntimeDescriptor = (prop: PropertyKey): PropertyDescriptor | undefined => {
      if (!lazyRuntimeReflectionKeySet.has(prop)) {
        return Reflect.getOwnPropertyDescriptor(resolveRuntime() as object, prop);
      }
      return {
        configurable: true,
        enumerable: true,
        get() {
          return Reflect.get(resolveRuntime() as object, prop);
        },
        set(value: unknown) {
          Reflect.set(resolveRuntime() as object, prop, value);
        },
      };
    };
    const runtime = new Proxy({} as PluginRuntime, {
      get(_target, prop, receiver) {
        return Reflect.get(resolveRuntime(), prop, receiver);
      },
      set(_target, prop, value, receiver) {
        return Reflect.set(resolveRuntime(), prop, value, receiver);
      },
      has(_target, prop) {
        return lazyRuntimeReflectionKeySet.has(prop) || Reflect.has(resolveRuntime(), prop);
      },
      ownKeys() {
        return [...LAZY_RUNTIME_REFLECTION_KEYS];
      },
      getOwnPropertyDescriptor(_target, prop) {
        return resolveLazyRuntimeDescriptor(prop);
      },
      defineProperty(_target, prop, attributes) {
        return Reflect.defineProperty(resolveRuntime() as object, prop, attributes);
      },
      deleteProperty(_target, prop) {
        return Reflect.deleteProperty(resolveRuntime() as object, prop);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(resolveRuntime() as object);
      },
    });

<<<<<<< HEAD
  const {
    registry,
    createApi,
    registerReload,
    registerNodeHostCommand,
    registerSecurityAuditCollector,
  } = createPluginRegistry({
    logger,
    runtime,
    coreGatewayHandlers: options.coreGatewayHandlers as Record<string, GatewayRequestHandler>,
    activateGlobalSideEffects: shouldActivate,
  });
=======
    const {
      registry,
      createApi,
      rollbackPluginGlobalSideEffects,
      registerReload,
      registerNodeHostCommand,
      registerSecurityAuditCollector,
    } = createPluginRegistry({
      logger,
      runtime,
      coreGatewayHandlers: options.coreGatewayHandlers as Record<string, GatewayRequestHandler>,
      ...(options.coreGatewayMethodNames !== undefined && {
        coreGatewayMethodNames: options.coreGatewayMethodNames,
      }),
      ...(options.hostServices !== undefined && {
        hostServices: options.hostServices,
      }),
      activateGlobalSideEffects: shouldActivate,
    });
>>>>>>> upstream/main

    const suppliedManifestRegistry = options.manifestRegistry;
    const discovery = suppliedManifestRegistry
      ? {
          candidates: createPluginCandidatesFromManifestRegistry(suppliedManifestRegistry),
          diagnostics: [] as PluginDiagnostic[],
        }
      : (options.discovery ??
        discoverOpenClawPlugins({
          workspaceDir: options.workspaceDir,
          extraPaths: normalized.loadPaths,
          env,
          installRecords,
        }));
    const manifestRegistry =
      suppliedManifestRegistry ??
      loadPluginManifestRegistry({
        config: cfg,
        workspaceDir: options.workspaceDir,
        env,
        candidates: discovery.candidates,
        diagnostics: discovery.diagnostics,
        installRecords: Object.keys(installRecords).length > 0 ? installRecords : undefined,
      });
    pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
    warnWhenAllowlistIsOpen({
      emitWarning: shouldActivate,
      logger,
      pluginsEnabled: normalized.enabled,
      allow: normalized.allow,
      warningCacheKey: cacheKey,
      warningCache: pluginLoaderCacheState,
      // Keep warning input scoped as well so partial snapshot loads only mention the
      // plugins that were intentionally requested for this registry.
      discoverablePlugins: manifestRegistry.plugins
        .filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
        .map((plugin) => ({
          id: plugin.id,
          source: plugin.source,
          origin: plugin.origin,
        })),
    });
    const provenance = buildProvenanceIndex({
      normalizedLoadPaths: normalized.loadPaths,
      env,
      installRecords,
    });

    const manifestByRoot = new Map(
      manifestRegistry.plugins.map((record) => [record.rootDir, record]),
    );
    const orderedCandidates = [...discovery.candidates].toSorted((left, right) => {
      return compareDuplicateCandidateOrder({
        left,
        right,
        manifestByRoot,
        provenance,
        env,
      });
    });

    const seenIds = new Map<string, PluginRecord["origin"]>();
    const memorySlot = normalized.slots.memory;
    let selectedMemoryPluginId: string | null = null;
    let memorySlotMatched = false;
    const dreamingEngineId = resolveDreamingSidecarEngineId({ cfg, memorySlot });
    const pluginLoadStartMs = performance.now();
    let pluginLoadAttemptCount = 0;

    for (const candidate of orderedCandidates) {
      const manifestRecord = manifestByRoot.get(candidate.rootDir);
      if (!manifestRecord) {
        continue;
      }
      const pluginId = manifestRecord.id;
      const matchesRequestedScope = matchesScopedPluginRequest({
        onlyPluginIdSet,
        pluginId,
      });
      // Filter again at import time as a final guard. The earlier manifest filter keeps
      // warnings scoped; this one prevents loading/registering anything outside the scope.
      if (!matchesRequestedScope) {
        continue;
      }
      const activationState = resolveEffectivePluginActivationState({
        id: pluginId,
        origin: candidate.origin,
        config: normalized,
        rootConfig: cfg,
        enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
        activationSource,
        autoEnabledReason: formatAutoEnabledActivationReason(autoEnabledReasons[pluginId]),
      });
      const existingOrigin = seenIds.get(pluginId);
      if (existingOrigin) {
        const record = createPluginRecord({
          id: pluginId,
          name: manifestRecord.name ?? pluginId,
          description: manifestRecord.description,
          version: manifestRecord.version,
          packageName: manifestRecord.packageName,
          format: manifestRecord.format,
          bundleFormat: manifestRecord.bundleFormat,
          bundleCapabilities: manifestRecord.bundleCapabilities,
          source: candidate.source,
          rootDir: candidate.rootDir,
          origin: candidate.origin,
          workspaceDir: candidate.workspaceDir,
          trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
          enabled: false,
          compat: collectPluginManifestCompatCodes(manifestRecord),
          activationState,
          syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
          channelIds: manifestRecord.channels,
          providerIds: manifestRecord.providers,
          configSchema: Boolean(manifestRecord.configSchema),
          contracts: manifestRecord.contracts,
        });
        record.status = "disabled";
        record.error = `overridden by ${existingOrigin} plugin`;
        markPluginActivationDisabled(record, record.error);
        registry.plugins.push(record);
        continue;
      }

      const enableState = resolveEffectiveEnableState({
        id: pluginId,
        origin: candidate.origin,
        config: normalized,
        rootConfig: cfg,
        enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
        activationSource,
      });
      const entry = normalized.entries[pluginId];
      const record = createPluginRecord({
        id: pluginId,
        name: manifestRecord.name ?? pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        packageName: manifestRecord.packageName,
        format: manifestRecord.format,
        bundleFormat: manifestRecord.bundleFormat,
        bundleCapabilities: manifestRecord.bundleCapabilities,
        source: candidate.source,
        rootDir: candidate.rootDir,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
        enabled: enableState.enabled,
        compat: collectPluginManifestCompatCodes(manifestRecord),
        activationState,
        syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
        channelIds: manifestRecord.channels,
        providerIds: manifestRecord.providers,
        configSchema: Boolean(manifestRecord.configSchema),
        contracts: manifestRecord.contracts,
      });
      record.kind = manifestRecord.kind;
      record.configUiHints = manifestRecord.configUiHints;
      record.configJsonSchema = manifestRecord.configSchema;
      const pushPluginLoadError = (message: string) => {
        record.status = "error";
        record.error = message;
        record.failedAt = new Date();
        record.failurePhase = "validation";
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        registry.diagnostics.push({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: record.error,
        });
      };
      const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
      const runtimeCandidateEntry = resolvePreferredBuiltRuntimeArtifact({
        source: candidate.source,
        rootDir: pluginRoot,
        origin: candidate.origin,
        preferBuiltPluginArtifacts,
      });
      const runtimeSetupEntry = manifestRecord.setupSource
        ? resolvePreferredBuiltRuntimeArtifact({
            source: manifestRecord.setupSource,
            rootDir: pluginRoot,
            origin: candidate.origin,
            preferBuiltPluginArtifacts,
          })
        : undefined;

      const scopedSetupOnlyChannelPluginRequested =
        includeSetupOnlyChannelPlugins &&
        !validateOnly &&
        Boolean(onlyPluginIdSet) &&
        manifestRecord.channels.length > 0 &&
        (!enableState.enabled || forceSetupOnlyChannelPlugins);
      const canLoadScopedSetupOnlyChannelPlugin =
        scopedSetupOnlyChannelPluginRequested &&
        (candidate.origin !== "workspace" || enableState.enabled) &&
        (!requireSetupEntryForSetupOnlyChannelPlugins || Boolean(manifestRecord.setupSource));
      const registrationPlan = resolvePluginRegistrationPlan({
        canLoadScopedSetupOnlyChannelPlugin,
        scopedSetupOnlyChannelPluginRequested,
        requireSetupEntryForSetupOnlyChannelPlugins,
        enableStateEnabled: enableState.enabled,
        shouldLoadModules,
        validateOnly,
        shouldActivate,
        manifestRecord,
        cfg,
        env,
        preferSetupRuntimeForChannelPlugins: forceFullRuntimeForChannelPlugins
          ? false
          : preferSetupRuntimeForChannelPlugins,
        forceFullRuntimeForChannelPlugins,
        toolDiscovery: options.toolDiscovery === true,
      });

      if (!registrationPlan) {
        record.status = "disabled";
        record.error = enableState.reason;
        markPluginActivationDisabled(record, enableState.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      const registrationMode = registrationPlan.mode;
      if (!enableState.enabled) {
        record.status = "disabled";
        record.error = enableState.reason;
        markPluginActivationDisabled(record, enableState.reason);
      }

      if (record.format === "bundle") {
        const unsupportedCapabilities = (record.bundleCapabilities ?? []).filter(
          (capability) =>
            capability !== "skills" &&
            capability !== "mcpServers" &&
            capability !== "settings" &&
            !(
              (capability === "commands" ||
                capability === "agents" ||
                capability === "outputStyles" ||
                capability === "lspServers") &&
              (record.bundleFormat === "claude" || record.bundleFormat === "cursor")
            ) &&
            !(
              capability === "hooks" &&
              (record.bundleFormat === "codex" || record.bundleFormat === "claude")
            ),
        );
        for (const capability of unsupportedCapabilities) {
          registry.diagnostics.push({
            level: "warn",
            pluginId: record.id,
            source: record.source,
            message: `bundle capability detected but not wired into OpenClaw yet: ${capability}`,
          });
        }
        if (
          enableState.enabled &&
          record.rootDir &&
          record.bundleFormat &&
          (record.bundleCapabilities ?? []).includes("mcpServers")
        ) {
          const runtimeSupport = inspectBundleMcpRuntimeSupport({
            pluginId: record.id,
            rootDir: record.rootDir,
            bundleFormat: record.bundleFormat,
          });
          for (const message of runtimeSupport.diagnostics) {
            registry.diagnostics.push({
              level: "warn",
              pluginId: record.id,
              source: record.source,
              message,
            });
          }
          if (runtimeSupport.unsupportedServerNames.length > 0) {
            registry.diagnostics.push({
              level: "warn",
              pluginId: record.id,
              source: record.source,
              message:
                "bundle MCP servers use unsupported transports or incomplete configs " +
                `(stdio only today): ${runtimeSupport.unsupportedServerNames.join(", ")}`,
            });
          }
        }
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      // Fast-path bundled memory plugins that are guaranteed disabled by slot policy.
      // This avoids opening/importing heavy memory plugin modules that will never register.
      // Exception: the dreaming engine (memory-core by default) must load alongside the
      // selected memory slot plugin so dreaming can run even when lancedb holds the slot.
      if (
        registrationPlan.runRuntimeCapabilityPolicy &&
        candidate.origin === "bundled" &&
        hasKind(manifestRecord.kind, "memory")
      ) {
        if (pluginId !== dreamingEngineId) {
          const earlyMemoryDecision = resolveMemorySlotDecision({
            id: record.id,
            kind: manifestRecord.kind,
            slot: memorySlot,
            selectedId: selectedMemoryPluginId,
          });
          if (!earlyMemoryDecision.enabled) {
            record.enabled = false;
            record.status = "disabled";
            record.error = earlyMemoryDecision.reason;
            markPluginActivationDisabled(record, earlyMemoryDecision.reason);
            registry.plugins.push(record);
            seenIds.set(pluginId, candidate.origin);
            continue;
          }
        }
      }

      if (!manifestRecord.configSchema) {
        pushPluginLoadError("missing config schema");
        continue;
      }

      if (!shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
        const memoryDecision = resolveMemorySlotDecision({
          id: record.id,
          kind: record.kind,
          slot: memorySlot,
          selectedId: selectedMemoryPluginId,
        });

        if (!memoryDecision.enabled && pluginId !== dreamingEngineId) {
          record.enabled = false;
          record.status = "disabled";
          record.error = memoryDecision.reason;
          markPluginActivationDisabled(record, memoryDecision.reason);
          registry.plugins.push(record);
          seenIds.set(pluginId, candidate.origin);
          continue;
        }

        if (memoryDecision.selected && hasKind(record.kind, "memory")) {
          selectedMemoryPluginId = record.id;
          memorySlotMatched = true;
          record.memorySlotSelected = true;
        }
      }

      const validatedConfig = validatePluginConfig({
        schema: manifestRecord.configSchema,
        cacheKey: manifestRecord.schemaCacheKey,
        value: entry?.config,
      });

      if (!validatedConfig.ok) {
        logger.error(
          `[plugins] ${record.id} invalid config: ${validatedConfig.errors?.join(", ")}`,
        );
        pushPluginLoadError(`invalid config: ${validatedConfig.errors?.join(", ")}`);
        continue;
      }

      if (!shouldLoadModules) {
        applyManifestSnapshotMetadata(record, manifestRecord);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }

      const loadEntry =
        registrationPlan.loadSetupEntry && runtimeSetupEntry
          ? runtimeSetupEntry
          : runtimeCandidateEntry;
      const moduleLoadSource = resolveCanonicalDistRuntimeSource(loadEntry.source);
      const moduleRoot = resolveCanonicalDistRuntimeSource(loadEntry.rootDir);
      const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
        origin: candidate.origin,
        rootDir: candidate.rootDir,
        env,
      });
      const opened = openRootFileSync({
        absolutePath: moduleLoadSource,
        rootPath: moduleRoot,
        boundaryLabel: "plugin root",
        rejectHardlinks,
        skipLexicalRootCheck: true,
      });
      if (!opened.ok) {
        pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
        continue;
      }
      const safeSource = opened.path;
      fs.closeSync(opened.fd);

      let mod: OpenClawPluginModule | null = null;
      let moduleLoadMs = 0;
      let moduleLoadFailed = false;
      const beforeModuleLoad = performance.now();
      try {
        // Track the plugin as imported once module evaluation begins. Top-level
        // code may have already executed even if evaluation later throws.
        recordImportedPluginId(record.id);
        pluginLoadAttemptCount++;
        logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
        mod = withProfile(
          { pluginId: record.id, source: safeSource },
          registrationMode,
          () => loadPluginModule(safeSource) as OpenClawPluginModule,
        );
      } catch (err) {
        recordPluginError({
          logger,
          registry,
          record,
          seenIds,
          pluginId,
          origin: candidate.origin,
          phase: "load",
          error: err,
          logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
          diagnosticMessagePrefix: "failed to load plugin: ",
        });
        moduleLoadFailed = true;
        continue;
      } finally {
        moduleLoadMs = performance.now() - beforeModuleLoad;
        detailPluginStartupTrace(options.startupTrace, record.id, [
          ["loadMs", moduleLoadMs],
          ["loadFailedCount", moduleLoadFailed ? 1 : 0],
        ]);
      }

      if (registrationPlan.loadSetupEntry && manifestRecord.setupSource) {
        const setupRegistration = resolveSetupChannelRegistration(mod);
        if (setupRegistration.loadError) {
          recordPluginError({
            logger,
            registry,
            record,
            seenIds,
            pluginId,
            origin: candidate.origin,
            phase: "load",
            error: setupRegistration.loadError,
            logPrefix: `[plugins] ${record.id} failed to load setup entry from ${record.source}: `,
            diagnosticMessagePrefix: "failed to load setup entry: ",
          });
          continue;
        }
        if (setupRegistration.plugin) {
          if (
            !channelPluginIdBelongsToManifest({
              channelId: setupRegistration.plugin.id,
              pluginId: record.id,
              manifestChannels: manifestRecord.channels,
            })
          ) {
            pushPluginLoadError(
              `plugin id mismatch (config uses "${record.id}", setup export uses "${setupRegistration.plugin.id}")`,
            );
            continue;
          }
          const api = createApi(record, {
            config: cfg,
            pluginConfig: {},
            hookPolicy: entry?.hooks,
            registrationMode,
          });
          let mergedSetupRegistration = setupRegistration;
          let runtimeSetterApplied = false;
          if (
            registrationPlan.loadSetupRuntimeEntry &&
            setupRegistration.usesBundledSetupContract &&
            !shouldDeferConfiguredChannelFullRuntimeMerge({
              manifestChannels: manifestRecord.channels,
              startupDeferConfiguredChannelFullLoadUntilAfterListen:
                manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
              cfg,
              env,
              preferSetupRuntimeForChannelPlugins,
            }) &&
            resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source) !== safeSource
          ) {
            const runtimeModuleSource = resolveCanonicalDistRuntimeSource(
              runtimeCandidateEntry.source,
            );
            const runtimeModuleRoot = resolveCanonicalDistRuntimeSource(
              runtimeCandidateEntry.rootDir,
            );
            const runtimeOpened = openRootFileSync({
              absolutePath: runtimeModuleSource,
              rootPath: runtimeModuleRoot,
              boundaryLabel: "plugin root",
              rejectHardlinks,
              skipLexicalRootCheck: true,
            });
            if (!runtimeOpened.ok) {
              pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
              continue;
            }
            const safeRuntimeSource = runtimeOpened.path;
            fs.closeSync(runtimeOpened.fd);
            let runtimeMod: OpenClawPluginModule | null = null;
            try {
              runtimeMod = withProfile(
                { pluginId: record.id, source: safeRuntimeSource },
                "load-setup-runtime-entry",
                () => loadPluginModule(safeRuntimeSource) as OpenClawPluginModule,
              );
            } catch (err) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: err,
                logPrefix: `[plugins] ${record.id} failed to load setup-runtime entry from ${record.source}: `,
                diagnosticMessagePrefix: "failed to load setup-runtime entry: ",
              });
              continue;
            }
            const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
            if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
              pushPluginLoadError(
                `plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`,
              );
              continue;
            }
            if (runtimeRegistration.setChannelRuntime) {
              try {
                runtimeRegistration.setChannelRuntime(api.runtime);
                runtimeSetterApplied = true;
              } catch (err) {
                recordPluginError({
                  logger,
                  registry,
                  record,
                  seenIds,
                  pluginId,
                  origin: candidate.origin,
                  phase: "load",
                  error: err,
                  logPrefix: `[plugins] ${record.id} failed to apply setup-runtime channel runtime from ${record.source}: `,
                  diagnosticMessagePrefix: "failed to apply setup-runtime channel runtime: ",
                });
                continue;
              }
            }
            const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({
              registration: runtimeRegistration,
            });
            if (runtimePluginRegistration.loadError) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: runtimePluginRegistration.loadError,
                logPrefix: `[plugins] ${record.id} failed to load setup-runtime channel entry from ${record.source}: `,
                diagnosticMessagePrefix: "failed to load setup-runtime channel entry: ",
              });
              continue;
            }
            if (runtimePluginRegistration.plugin) {
              if (
                runtimePluginRegistration.plugin.id &&
                runtimePluginRegistration.plugin.id !== record.id
              ) {
                pushPluginLoadError(
                  `plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`,
                );
                continue;
              }
              mergedSetupRegistration = {
                ...setupRegistration,
                plugin: mergeSetupRuntimeChannelPlugin(
                  runtimePluginRegistration.plugin,
                  setupRegistration.plugin,
                ),
                setChannelRuntime:
                  runtimeRegistration.setChannelRuntime ?? setupRegistration.setChannelRuntime,
              };
            }
          }
          const mergedSetupPlugin = mergedSetupRegistration.plugin;
          if (!mergedSetupPlugin) {
            continue;
          }
          if (
            !channelPluginIdBelongsToManifest({
              channelId: mergedSetupPlugin.id,
              pluginId: record.id,
              manifestChannels: manifestRecord.channels,
            })
          ) {
            pushPluginLoadError(
              `plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`,
            );
            continue;
          }
          if (!runtimeSetterApplied) {
            try {
              mergedSetupRegistration.setChannelRuntime?.(api.runtime);
            } catch (err) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: err,
                logPrefix: `[plugins] ${record.id} failed to apply setup channel runtime from ${record.source}: `,
                diagnosticMessagePrefix: "failed to apply setup channel runtime: ",
              });
              continue;
            }
          }
          if (registrationMode === "setup-runtime") {
            const registerSetupRuntime = mergedSetupRegistration.registerSetupRuntime;
            if (registerSetupRuntime) {
              const registrySnapshot = snapshotPluginRegistry(registry);
              try {
                runPluginRegisterSync(
                  (registrationApi) => registerSetupRuntime(registrationApi),
                  api,
                );
              } catch (err) {
                restorePluginRegistry(registry, registrySnapshot);
                recordPluginError({
                  logger,
                  registry,
                  record,
                  seenIds,
                  pluginId,
                  origin: candidate.origin,
                  phase: "register",
                  error: err,
                  logPrefix: `[plugins] ${record.id} failed to register setup-runtime channel side effects from ${record.source}: `,
                  diagnosticMessagePrefix:
                    "failed to register setup-runtime channel side effects: ",
                });
                continue;
              }
            }
          }
          try {
            api.registerChannel(mergedSetupPlugin);
          } catch (err) {
            recordPluginError({
              logger,
              registry,
              record,
              seenIds,
              pluginId,
              origin: candidate.origin,
              phase: "load",
              error: err,
              logPrefix: `[plugins] ${record.id} failed to register setup channel from ${record.source}: `,
              diagnosticMessagePrefix: "failed to register setup channel: ",
            });
            continue;
          }
          registry.plugins.push(record);
          seenIds.set(pluginId, candidate.origin);
          continue;
        }
      }

      const resolved = resolvePluginModuleExport(mod);
      const definition = resolved.definition;
      const register = resolved.register;

      if (definition?.id && definition.id !== record.id) {
        pushPluginLoadError(
          `plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`,
        );
        continue;
      }

      record.name = definition?.name ?? record.name;
      record.description = definition?.description ?? record.description;
      record.version = definition?.version ?? record.version;
      const manifestKind = record.kind;
      const exportKind = definition?.kind;
      if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) {
        registry.diagnostics.push({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`,
        });
      }
      record.kind = definition?.kind ?? record.kind;

      if (hasKind(record.kind, "memory") && memorySlot === record.id) {
        memorySlotMatched = true;
      }

      if (registrationPlan.runRuntimeCapabilityPolicy) {
        if (pluginId !== dreamingEngineId) {
          const memoryDecision = resolveMemorySlotDecision({
            id: record.id,
            kind: record.kind,
            slot: memorySlot,
            selectedId: selectedMemoryPluginId,
          });

          if (!memoryDecision.enabled) {
            record.enabled = false;
            record.status = "disabled";
            record.error = memoryDecision.reason;
            markPluginActivationDisabled(record, memoryDecision.reason);
            registry.plugins.push(record);
            seenIds.set(pluginId, candidate.origin);
            continue;
          }

          if (memoryDecision.selected && hasKind(record.kind, "memory")) {
            selectedMemoryPluginId = record.id;
            record.memorySlotSelected = true;
          }
        }
      }

      if (registrationPlan.runFullActivationOnlyRegistrations) {
        if (definition?.reload) {
          registerReload(record, definition.reload);
        }
        for (const nodeHostCommand of definition?.nodeHostCommands ?? []) {
          registerNodeHostCommand(record, nodeHostCommand);
        }
        for (const collector of definition?.securityAuditCollectors ?? []) {
          registerSecurityAuditCollector(record, collector);
        }
      }

      if (validateOnly) {
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }

      if (typeof register !== "function") {
        const bundledChannelWrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
        if (bundledChannelWrongLoaderError) {
          logger.error(
            `[plugins] ${record.id} ${bundledChannelWrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`,
          );
          pushPluginLoadError(bundledChannelWrongLoaderError);
        } else {
          logger.error(`[plugins] ${record.id} missing register/activate export`);
          pushPluginLoadError(formatMissingPluginRegisterError(mod, env));
        }
        continue;
      }

      const api = createApi(record, {
        config: cfg,
        pluginConfig: validatedConfig.value,
        hookPolicy: entry?.hooks,
        registrationMode,
      });
      const registrySnapshot = snapshotPluginRegistry(registry);
      const previousAgentHarnesses = listRegisteredAgentHarnesses();
      const previousCompactionProviders = listRegisteredCompactionProviders();
      const previousDetachedTaskRuntimeRegistration = getDetachedTaskLifecycleRuntimeRegistration();
      const previousEmbeddingProviders = listRegisteredEmbeddingProviders();
      const previousMemoryCapability = getMemoryCapabilityRegistration();
      const previousMemoryEmbeddingProviders = listRegisteredMemoryEmbeddingProviders();
      const previousMemoryCorpusSupplements = listMemoryCorpusSupplements();
      const previousMemoryPromptSupplements = listMemoryPromptSupplements();

      const beforeRegister = performance.now();
      let registerFailed = false;
      try {
        withProfile(
          { pluginId: record.id, source: record.source },
          `${registrationMode}:register`,
          () => runPluginRegisterSync(register, api),
        );
        // Snapshot loads should not replace process-global runtime prompt state.
        if (!shouldActivate) {
          restoreRegisteredAgentHarnesses(previousAgentHarnesses);
          restoreRegisteredCompactionProviders(previousCompactionProviders);
          restoreDetachedTaskLifecycleRuntimeRegistration(previousDetachedTaskRuntimeRegistration);
          restoreRegisteredEmbeddingProviders(previousEmbeddingProviders);
          restoreRegisteredMemoryEmbeddingProviders(previousMemoryEmbeddingProviders);
          restoreMemoryPluginState({
            capability: previousMemoryCapability,
            corpusSupplements: previousMemoryCorpusSupplements,
            promptSupplements: previousMemoryPromptSupplements,
          });
        }
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
      } catch (err) {
        rollbackPluginGlobalSideEffects(record.id);
        restorePluginRegistry(registry, registrySnapshot);
        restoreRegisteredAgentHarnesses(previousAgentHarnesses);
        restoreRegisteredCompactionProviders(previousCompactionProviders);
        restoreDetachedTaskLifecycleRuntimeRegistration(previousDetachedTaskRuntimeRegistration);
        restoreRegisteredEmbeddingProviders(previousEmbeddingProviders);
        restoreRegisteredMemoryEmbeddingProviders(previousMemoryEmbeddingProviders);
        restoreMemoryPluginState({
          capability: previousMemoryCapability,
          corpusSupplements: previousMemoryCorpusSupplements,
          promptSupplements: previousMemoryPromptSupplements,
        });
        recordPluginError({
          logger,
          registry,
          record,
          seenIds,
          pluginId,
          origin: candidate.origin,
          phase: "register",
          error: err,
          logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
          diagnosticMessagePrefix: "plugin failed during register: ",
        });
        registerFailed = true;
      } finally {
        const registerMs = performance.now() - beforeRegister;
        detailPluginStartupTrace(options.startupTrace, record.id, [
          ["registerMs", registerMs],
          ["loadAndRegisterMs", moduleLoadMs + registerMs],
          ["registerFailedCount", registerFailed ? 1 : 0],
        ]);
      }
    }

    const pluginLoadElapsedMs = performance.now() - pluginLoadStartMs;
    if (pluginLoadAttemptCount > 0) {
      logger.debug?.(
        `[plugins] loaded ${registry.plugins.length} plugin(s) (${pluginLoadAttemptCount} attempted) in ${pluginLoadElapsedMs.toFixed(1)}ms`,
      );
    }

    // Scoped snapshot loads may intentionally omit the configured memory plugin, so only
    // emit the missing-memory diagnostic for full registry loads.
    if (!onlyPluginIdSet && typeof memorySlot === "string" && !memorySlotMatched) {
      registry.diagnostics.push({
        level: "warn",
        message: `memory slot plugin not found or not marked as memory: ${memorySlot}`,
      });
    }

    warnAboutUntrackedLoadedPlugins({
      registry,
      provenance,
      allowlist: normalized.allow,
      emitWarning: shouldActivate,
      logger,
      env,
    });

    maybeThrowOnPluginLoadError(registry, options.throwOnLoadError);

    if (shouldActivate && options.mode !== "validate") {
      const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
      if (failedPlugins.length > 0) {
        logger.warn(
          `[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(
            failedPlugins,
          )}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics, 'openclaw plugins list' for registry state, and restart the Gateway after plugin code or load-path changes.`,
        );
      }
    }

    if (cacheEnabled) {
      setCachedPluginRegistry(
        cacheKey,
        {
          commands: listRegisteredPluginCommands(),
          detachedTaskRuntimeRegistration: getDetachedTaskLifecycleRuntimeRegistration(),
          interactiveHandlers: listPluginInteractiveHandlers(),
          memoryCapability: getMemoryCapabilityRegistration(),
          memoryCorpusSupplements: listMemoryCorpusSupplements(),
          registry,
          agentHarnesses: listRegisteredAgentHarnesses(),
          compactionProviders: listRegisteredCompactionProviders(),
          embeddingProviders: listRegisteredEmbeddingProviders(),
          memoryEmbeddingProviders: listRegisteredMemoryEmbeddingProviders(),
          memoryPromptSupplements: listMemoryPromptSupplements(),
        },
        onlyPluginIds,
      );
    }
    if (shouldActivate) {
      activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, options.workspaceDir);
    }
    return registry;
  } finally {
    pluginLoaderCacheState.finishLoad(cacheKey);
  }
}

export async function loadOpenClawPluginCliRegistry(
  options: PluginLoadOptions = {},
): Promise<PluginRegistry> {
  const {
    env,
    cfg,
    normalized,
    activationSource,
    autoEnabledReasons,
    onlyPluginIds,
    cacheKey,
    installRecords,
    devSourceRoot,
  } = resolvePluginLoadCacheContext({
    ...options,
    activate: false,
  });
  const logger = options.logger ?? defaultLogger();
  const onlyPluginIdSet = createPluginIdScopeSet(onlyPluginIds);
  const loadPluginModule = createPluginModuleLoader({
    devSourceRoot,
    pluginSdkResolution: options.pluginSdkResolution,
  });
  const { registry, registerCli } = createPluginRegistry({
    logger,
    runtime: {} as PluginRuntime,
    coreGatewayHandlers: options.coreGatewayHandlers as Record<string, GatewayRequestHandler>,
    ...(options.coreGatewayMethodNames !== undefined && {
      coreGatewayMethodNames: options.coreGatewayMethodNames,
    }),
    activateGlobalSideEffects: false,
  });

  const discovery =
    options.discovery ??
    discoverOpenClawPlugins({
      workspaceDir: options.workspaceDir,
      extraPaths: normalized.loadPaths,
      env,
      installRecords,
    });
  const manifestRegistry = loadPluginManifestRegistry({
    config: cfg,
    workspaceDir: options.workspaceDir,
    env,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
    installRecords: Object.keys(installRecords).length > 0 ? installRecords : undefined,
  });
  pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
  warnWhenAllowlistIsOpen({
<<<<<<< HEAD
    emitWarning: shouldActivate,
=======
    emitWarning: false,
>>>>>>> upstream/main
    logger,
    pluginsEnabled: normalized.enabled,
    allow: normalized.allow,
    warningCacheKey: `${cacheKey}::cli-metadata`,
    warningCache: pluginLoaderCacheState,
    discoverablePlugins: manifestRegistry.plugins
      .filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
      .map((plugin) => ({
        id: plugin.id,
        source: plugin.source,
        origin: plugin.origin,
      })),
  });
  const provenance = buildProvenanceIndex({
    normalizedLoadPaths: normalized.loadPaths,
    env,
    installRecords,
  });
  const manifestByRoot = new Map(
    manifestRegistry.plugins.map((record) => [record.rootDir, record]),
  );
  const orderedCandidates = [...discovery.candidates].toSorted((left, right) => {
    return compareDuplicateCandidateOrder({
      left,
      right,
      manifestByRoot,
      provenance,
      env,
    });
  });

  const seenIds = new Map<string, PluginRecord["origin"]>();
  const memorySlot = normalized.slots.memory;
  let selectedMemoryPluginId: string | null = null;
  const dreamingEngineId = resolveDreamingSidecarEngineId({ cfg, memorySlot });

  for (const candidate of orderedCandidates) {
    const manifestRecord = manifestByRoot.get(candidate.rootDir);
    if (!manifestRecord) {
      continue;
    }
    const pluginId = manifestRecord.id;
<<<<<<< HEAD
    const matchesRequestedScope = matchesScopedPluginRequest({
      onlyPluginIdSet,
      pluginId,
    });
    // Filter again at import time as a final guard. The earlier manifest filter keeps
    // warnings scoped; this one prevents loading/registering anything outside the scope.
    if (!matchesRequestedScope) {
=======
    if (
      !matchesScopedPluginRequest({
        onlyPluginIdSet,
        pluginId,
      })
    ) {
>>>>>>> upstream/main
      continue;
    }
    const activationState = resolveEffectivePluginActivationState({
      id: pluginId,
      origin: candidate.origin,
      config: normalized,
      rootConfig: cfg,
<<<<<<< HEAD
      enabledByDefault: manifestRecord.enabledByDefault,
=======
      enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
>>>>>>> upstream/main
      activationSource,
      autoEnabledReason: formatAutoEnabledActivationReason(autoEnabledReasons[pluginId]),
    });
    const existingOrigin = seenIds.get(pluginId);
    if (existingOrigin) {
      const record = createPluginRecord({
        id: pluginId,
        name: manifestRecord.name ?? pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        packageName: manifestRecord.packageName,
        format: manifestRecord.format,
        bundleFormat: manifestRecord.bundleFormat,
        bundleCapabilities: manifestRecord.bundleCapabilities,
        source: candidate.source,
        rootDir: candidate.rootDir,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
        enabled: false,
<<<<<<< HEAD
        activationState,
=======
        compat: collectPluginManifestCompatCodes(manifestRecord),
        activationState,
        syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
        channelIds: manifestRecord.channels,
        providerIds: manifestRecord.providers,
>>>>>>> upstream/main
        configSchema: Boolean(manifestRecord.configSchema),
        contracts: manifestRecord.contracts,
      });
      record.status = "disabled";
      record.error = `overridden by ${existingOrigin} plugin`;
      markPluginActivationDisabled(record, record.error);
      registry.plugins.push(record);
      continue;
    }

    const enableState = resolveEffectiveEnableState({
      id: pluginId,
      origin: candidate.origin,
      config: normalized,
      rootConfig: cfg,
<<<<<<< HEAD
      enabledByDefault: manifestRecord.enabledByDefault,
=======
      enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
>>>>>>> upstream/main
      activationSource,
    });
    const entry = normalized.entries[pluginId];
    const record = createPluginRecord({
      id: pluginId,
      name: manifestRecord.name ?? pluginId,
      description: manifestRecord.description,
      version: manifestRecord.version,
      packageName: manifestRecord.packageName,
      format: manifestRecord.format,
      bundleFormat: manifestRecord.bundleFormat,
      bundleCapabilities: manifestRecord.bundleCapabilities,
      source: candidate.source,
      rootDir: candidate.rootDir,
      origin: candidate.origin,
      workspaceDir: candidate.workspaceDir,
      trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
      enabled: enableState.enabled,
<<<<<<< HEAD
      activationState,
=======
      compat: collectPluginManifestCompatCodes(manifestRecord),
      activationState,
      syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
      channelIds: manifestRecord.channels,
      providerIds: manifestRecord.providers,
>>>>>>> upstream/main
      configSchema: Boolean(manifestRecord.configSchema),
      contracts: manifestRecord.contracts,
    });
    record.kind = manifestRecord.kind;
    record.configUiHints = manifestRecord.configUiHints;
    record.configJsonSchema = manifestRecord.configSchema;
    const pushPluginLoadError = (message: string) => {
      record.status = "error";
      record.error = message;
      record.failedAt = new Date();
      record.failurePhase = "validation";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: record.error,
      });
    };

<<<<<<< HEAD
    const registrationMode = enableState.enabled
      ? !validateOnly &&
        shouldLoadChannelPluginInSetupRuntime({
          manifestChannels: manifestRecord.channels,
          setupSource: manifestRecord.setupSource,
          startupDeferConfiguredChannelFullLoadUntilAfterListen:
            manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
          cfg,
          env,
          preferSetupRuntimeForChannelPlugins,
        })
        ? "setup-runtime"
        : "full"
      : includeSetupOnlyChannelPlugins &&
          !validateOnly &&
          onlyPluginIdSet &&
          manifestRecord.channels.length > 0
        ? "setup-only"
        : null;

    if (!registrationMode) {
      record.status = "disabled";
      record.error = enableState.reason;
      markPluginActivationDisabled(record, enableState.reason);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
=======
>>>>>>> upstream/main
    if (!enableState.enabled) {
      record.status = "disabled";
      record.error = enableState.reason;
      markPluginActivationDisabled(record, enableState.reason);
<<<<<<< HEAD
    }

    if (record.format === "bundle") {
      const unsupportedCapabilities = (record.bundleCapabilities ?? []).filter(
        (capability) =>
          capability !== "skills" &&
          capability !== "mcpServers" &&
          capability !== "settings" &&
          !(
            (capability === "commands" ||
              capability === "agents" ||
              capability === "outputStyles" ||
              capability === "lspServers") &&
            (record.bundleFormat === "claude" || record.bundleFormat === "cursor")
          ) &&
          !(
            capability === "hooks" &&
            (record.bundleFormat === "codex" || record.bundleFormat === "claude")
          ),
      );
      for (const capability of unsupportedCapabilities) {
        registry.diagnostics.push({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `bundle capability detected but not wired into OpenClaw yet: ${capability}`,
        });
      }
      if (
        enableState.enabled &&
        record.rootDir &&
        record.bundleFormat &&
        (record.bundleCapabilities ?? []).includes("mcpServers")
      ) {
        const runtimeSupport = inspectBundleMcpRuntimeSupport({
          pluginId: record.id,
          rootDir: record.rootDir,
          bundleFormat: record.bundleFormat,
        });
        for (const message of runtimeSupport.diagnostics) {
          registry.diagnostics.push({
            level: "warn",
            pluginId: record.id,
            source: record.source,
            message,
          });
        }
        if (runtimeSupport.unsupportedServerNames.length > 0) {
          registry.diagnostics.push({
            level: "warn",
            pluginId: record.id,
            source: record.source,
            message:
              "bundle MCP servers use unsupported transports or incomplete configs " +
              `(stdio only today): ${runtimeSupport.unsupportedServerNames.join(", ")}`,
          });
        }
      }
=======
>>>>>>> upstream/main
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
<<<<<<< HEAD
    // Fast-path bundled memory plugins that are guaranteed disabled by slot policy.
    // This avoids opening/importing heavy memory plugin modules that will never register.
    if (
      registrationMode === "full" &&
      candidate.origin === "bundled" &&
      hasKind(manifestRecord.kind, "memory")
    ) {
      const earlyMemoryDecision = resolveMemorySlotDecision({
        id: record.id,
        kind: manifestRecord.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });
      if (!earlyMemoryDecision.enabled) {
        record.enabled = false;
        record.status = "disabled";
        record.error = earlyMemoryDecision.reason;
        markPluginActivationDisabled(record, earlyMemoryDecision.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
=======

    if (record.format === "bundle") {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
>>>>>>> upstream/main
    }

    if (!manifestRecord.configSchema) {
      pushPluginLoadError("missing config schema");
      continue;
    }

<<<<<<< HEAD
    if (!shouldLoadModules && registrationMode === "full") {
      const memoryDecision = resolveMemorySlotDecision({
        id: record.id,
        kind: record.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });

      if (!memoryDecision.enabled) {
        record.enabled = false;
        record.status = "disabled";
        record.error = memoryDecision.reason;
        markPluginActivationDisabled(record, memoryDecision.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }

      if (memoryDecision.selected && hasKind(record.kind, "memory")) {
        selectedMemoryPluginId = record.id;
        memorySlotMatched = true;
        record.memorySlotSelected = true;
      }
    }

=======
>>>>>>> upstream/main
    const validatedConfig = validatePluginConfig({
      schema: manifestRecord.configSchema,
      cacheKey: manifestRecord.schemaCacheKey,
      value: entry?.config,
    });
<<<<<<< HEAD

=======
>>>>>>> upstream/main
    if (!validatedConfig.ok) {
      logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.errors?.join(", ")}`);
      pushPluginLoadError(`invalid config: ${validatedConfig.errors?.join(", ")}`);
      continue;
    }

<<<<<<< HEAD
    if (!shouldLoadModules) {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }

=======
>>>>>>> upstream/main
    const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
    const cliMetadataSource = resolveCliMetadataEntrySource(candidate.rootDir);
    const sourceForCliMetadata =
      candidate.origin === "bundled"
        ? cliMetadataSource
          ? safeRealpathOrResolve(cliMetadataSource)
          : null
        : (cliMetadataSource ?? candidate.source);
    if (!sourceForCliMetadata) {
      record.status = "loaded";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    const opened = openRootFileSync({
      absolutePath: sourceForCliMetadata,
      rootPath: pluginRoot,
      boundaryLabel: "plugin root",
      rejectHardlinks: shouldRejectHardlinkedPluginFiles({
        origin: candidate.origin,
        rootDir: candidate.rootDir,
        env,
      }),
      skipLexicalRootCheck: true,
    });
    if (!opened.ok) {
      pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
      continue;
    }
    const safeSource = opened.path;
    fs.closeSync(opened.fd);

    let mod: OpenClawPluginModule | null;
    try {
<<<<<<< HEAD
      // Track the plugin as imported once module evaluation begins. Top-level
      // code may have already executed even if evaluation later throws.
      recordImportedPluginId(record.id);
      mod = getJiti(safeSource)(safeSource) as OpenClawPluginModule;
=======
      mod = withProfile(
        { pluginId: record.id, source: safeSource },
        "cli-metadata",
        () => loadPluginModule(safeSource) as OpenClawPluginModule,
      );
>>>>>>> upstream/main
    } catch (err) {
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "load",
        error: err,
        logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
        diagnosticMessagePrefix: "failed to load plugin: ",
      });
      continue;
    }

    const resolved = resolvePluginModuleExport(mod);
    const definition = resolved.definition;
    const register = resolved.register;

    if (definition?.id && definition.id !== record.id) {
      pushPluginLoadError(
        `plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`,
      );
      continue;
    }

    record.name = definition?.name ?? record.name;
    record.description = definition?.description ?? record.description;
    record.version = definition?.version ?? record.version;
    const manifestKind = record.kind;
    const exportKind = definition?.kind;
    if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) {
      registry.diagnostics.push({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`,
      });
    }
    record.kind = definition?.kind ?? record.kind;

<<<<<<< HEAD
    if (hasKind(record.kind, "memory") && memorySlot === record.id) {
      memorySlotMatched = true;
    }

    if (registrationMode === "full") {
=======
    if (pluginId !== dreamingEngineId) {
>>>>>>> upstream/main
      const memoryDecision = resolveMemorySlotDecision({
        id: record.id,
        kind: record.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });
      if (!memoryDecision.enabled) {
        record.enabled = false;
        record.status = "disabled";
        record.error = memoryDecision.reason;
        markPluginActivationDisabled(record, memoryDecision.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
<<<<<<< HEAD

=======
>>>>>>> upstream/main
      if (memoryDecision.selected && hasKind(record.kind, "memory")) {
        selectedMemoryPluginId = record.id;
        record.memorySlotSelected = true;
      }
    }

<<<<<<< HEAD
    if (registrationMode === "full") {
      if (definition?.reload) {
        registerReload(record, definition.reload);
      }
      for (const nodeHostCommand of definition?.nodeHostCommands ?? []) {
        registerNodeHostCommand(record, nodeHostCommand);
      }
      for (const collector of definition?.securityAuditCollectors ?? []) {
        registerSecurityAuditCollector(record, collector);
      }
    }

    if (validateOnly) {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }

=======
>>>>>>> upstream/main
    if (typeof register !== "function") {
      const bundledChannelWrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
      if (bundledChannelWrongLoaderError) {
        logger.error(
          `[plugins] ${record.id} ${bundledChannelWrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`,
        );
        pushPluginLoadError(bundledChannelWrongLoaderError);
      } else {
        logger.error(`[plugins] ${record.id} missing register/activate export`);
        pushPluginLoadError(formatMissingPluginRegisterError(mod, env));
      }
      continue;
    }

    const api = buildPluginApi({
      id: record.id,
      name: record.name,
      version: record.version,
      description: record.description,
      source: record.source,
      rootDir: record.rootDir,
      registrationMode: "cli-metadata",
      config: cfg,
      pluginConfig: validatedConfig.value,
      runtime: {} as PluginRuntime,
      logger,
      resolvePath: (input) => resolveUserPath(input),
      handlers: {
        registerCli: (registrar, opts) => registerCli(record, registrar, opts),
      },
    });
<<<<<<< HEAD
    const previousMemoryEmbeddingProviders = listRegisteredMemoryEmbeddingProviders();
    const previousMemoryFlushPlanResolver = getMemoryFlushPlanResolver();
    const previousMemoryPromptBuilder = getMemoryPromptSectionBuilder();
    const previousMemoryCorpusSupplements = listMemoryCorpusSupplements();
    const previousMemoryPromptSupplements = listMemoryPromptSupplements();
    const previousMemoryRuntime = getMemoryRuntime();
=======
>>>>>>> upstream/main

    const registrySnapshot = snapshotPluginRegistry(registry);
    try {
<<<<<<< HEAD
      const result = register(api);
      if (result && typeof result.then === "function") {
        registry.diagnostics.push({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: "plugin register returned a promise; async registration is ignored",
        });
      }
      // Snapshot loads should not replace process-global runtime prompt state.
      if (!shouldActivate) {
        restoreRegisteredMemoryEmbeddingProviders(previousMemoryEmbeddingProviders);
        restoreMemoryPluginState({
          corpusSupplements: previousMemoryCorpusSupplements,
          promptBuilder: previousMemoryPromptBuilder,
          promptSupplements: previousMemoryPromptSupplements,
          flushPlanResolver: previousMemoryFlushPlanResolver,
          runtime: previousMemoryRuntime,
        });
      }
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
    } catch (err) {
      restoreRegisteredMemoryEmbeddingProviders(previousMemoryEmbeddingProviders);
      restoreMemoryPluginState({
        corpusSupplements: previousMemoryCorpusSupplements,
        promptBuilder: previousMemoryPromptBuilder,
        promptSupplements: previousMemoryPromptSupplements,
        flushPlanResolver: previousMemoryFlushPlanResolver,
        runtime: previousMemoryRuntime,
      });
=======
      withProfile({ pluginId: record.id, source: record.source }, "cli-metadata:register", () =>
        runPluginRegisterSync(register, api),
      );
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
    } catch (err) {
      restorePluginRegistry(registry, registrySnapshot);
>>>>>>> upstream/main
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "register",
        error: err,
        logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
        diagnosticMessagePrefix: "plugin failed during register: ",
      });
    }
  }

<<<<<<< HEAD
  // Scoped snapshot loads may intentionally omit the configured memory plugin, so only
  // emit the missing-memory diagnostic for full registry loads.
  if (!onlyPluginIdSet && typeof memorySlot === "string" && !memorySlotMatched) {
    registry.diagnostics.push({
      level: "warn",
      message: `memory slot plugin not found or not marked as memory: ${memorySlot}`,
    });
  }

  warnAboutUntrackedLoadedPlugins({
    registry,
    provenance,
    allowlist: normalized.allow,
    emitWarning: shouldActivate,
    logger,
    env,
  });

  maybeThrowOnPluginLoadError(registry, options.throwOnLoadError);

  if (shouldActivate && options.mode !== "validate") {
    const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
    if (failedPlugins.length > 0) {
      logger.warn(
        `[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(
          failedPlugins,
        )}). Run 'openclaw plugins list' for details.`,
      );
    }
  }

  if (cacheEnabled) {
    setCachedPluginRegistry(cacheKey, {
      memoryCorpusSupplements: listMemoryCorpusSupplements(),
      registry,
      memoryEmbeddingProviders: listRegisteredMemoryEmbeddingProviders(),
      memoryFlushPlanResolver: getMemoryFlushPlanResolver(),
      memoryPromptBuilder: getMemoryPromptSectionBuilder(),
      memoryPromptSupplements: listMemoryPromptSupplements(),
      memoryRuntime: getMemoryRuntime(),
    });
  }
  if (shouldActivate) {
    activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, options.workspaceDir);
  }
=======
>>>>>>> upstream/main
  return registry;
}

export async function loadOpenClawPluginCliRegistry(
  options: PluginLoadOptions = {},
): Promise<PluginRegistry> {
  const { env, cfg, normalized, activationSource, autoEnabledReasons, onlyPluginIds, cacheKey } =
    resolvePluginLoadCacheContext({
      ...options,
      activate: false,
      cache: false,
    });
  const logger = options.logger ?? defaultLogger();
  const onlyPluginIdSet = onlyPluginIds ? new Set(onlyPluginIds) : null;
  const getJiti = createPluginJitiLoader(options);
  const { registry, registerCli } = createPluginRegistry({
    logger,
    runtime: {} as PluginRuntime,
    coreGatewayHandlers: options.coreGatewayHandlers as Record<string, GatewayRequestHandler>,
    activateGlobalSideEffects: false,
  });

  const discovery = discoverOpenClawPlugins({
    workspaceDir: options.workspaceDir,
    extraPaths: normalized.loadPaths,
    cache: false,
    env,
  });
  const manifestRegistry = loadPluginManifestRegistry({
    config: cfg,
    workspaceDir: options.workspaceDir,
    cache: false,
    env,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
  });
  pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
  warnWhenAllowlistIsOpen({
    emitWarning: false,
    logger,
    pluginsEnabled: normalized.enabled,
    allow: normalized.allow,
    warningCacheKey: `${cacheKey}::cli-metadata`,
    discoverablePlugins: manifestRegistry.plugins
      .filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
      .map((plugin) => ({
        id: plugin.id,
        source: plugin.source,
        origin: plugin.origin,
      })),
  });
  const provenance = buildProvenanceIndex({
    config: cfg,
    normalizedLoadPaths: normalized.loadPaths,
    env,
  });
  const manifestByRoot = new Map(
    manifestRegistry.plugins.map((record) => [record.rootDir, record]),
  );
  const orderedCandidates = [...discovery.candidates].toSorted((left, right) => {
    return compareDuplicateCandidateOrder({
      left,
      right,
      manifestByRoot,
      provenance,
      env,
    });
  });

  const seenIds = new Map<string, PluginRecord["origin"]>();
  const memorySlot = normalized.slots.memory;
  let selectedMemoryPluginId: string | null = null;

  for (const candidate of orderedCandidates) {
    const manifestRecord = manifestByRoot.get(candidate.rootDir);
    if (!manifestRecord) {
      continue;
    }
    const pluginId = manifestRecord.id;
    if (
      !matchesScopedPluginRequest({
        onlyPluginIdSet,
        pluginId,
      })
    ) {
      continue;
    }
    const activationState = resolveEffectivePluginActivationState({
      id: pluginId,
      origin: candidate.origin,
      config: normalized,
      rootConfig: cfg,
      enabledByDefault: manifestRecord.enabledByDefault,
      activationSource,
      autoEnabledReason: formatAutoEnabledActivationReason(autoEnabledReasons[pluginId]),
    });
    const existingOrigin = seenIds.get(pluginId);
    if (existingOrigin) {
      const record = createPluginRecord({
        id: pluginId,
        name: manifestRecord.name ?? pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        format: manifestRecord.format,
        bundleFormat: manifestRecord.bundleFormat,
        bundleCapabilities: manifestRecord.bundleCapabilities,
        source: candidate.source,
        rootDir: candidate.rootDir,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        enabled: false,
        activationState,
        configSchema: Boolean(manifestRecord.configSchema),
        contracts: manifestRecord.contracts,
      });
      record.status = "disabled";
      record.error = `overridden by ${existingOrigin} plugin`;
      markPluginActivationDisabled(record, record.error);
      registry.plugins.push(record);
      continue;
    }

    const enableState = resolveEffectiveEnableState({
      id: pluginId,
      origin: candidate.origin,
      config: normalized,
      rootConfig: cfg,
      enabledByDefault: manifestRecord.enabledByDefault,
      activationSource,
    });
    const entry = normalized.entries[pluginId];
    const record = createPluginRecord({
      id: pluginId,
      name: manifestRecord.name ?? pluginId,
      description: manifestRecord.description,
      version: manifestRecord.version,
      format: manifestRecord.format,
      bundleFormat: manifestRecord.bundleFormat,
      bundleCapabilities: manifestRecord.bundleCapabilities,
      source: candidate.source,
      rootDir: candidate.rootDir,
      origin: candidate.origin,
      workspaceDir: candidate.workspaceDir,
      enabled: enableState.enabled,
      activationState,
      configSchema: Boolean(manifestRecord.configSchema),
      contracts: manifestRecord.contracts,
    });
    record.kind = manifestRecord.kind;
    record.configUiHints = manifestRecord.configUiHints;
    record.configJsonSchema = manifestRecord.configSchema;
    const pushPluginLoadError = (message: string) => {
      record.status = "error";
      record.error = message;
      record.failedAt = new Date();
      record.failurePhase = "validation";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: record.error,
      });
    };

    if (!enableState.enabled) {
      record.status = "disabled";
      record.error = enableState.reason;
      markPluginActivationDisabled(record, enableState.reason);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }

    if (record.format === "bundle") {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }

    if (!manifestRecord.configSchema) {
      pushPluginLoadError("missing config schema");
      continue;
    }

    const validatedConfig = validatePluginConfig({
      schema: manifestRecord.configSchema,
      cacheKey: manifestRecord.schemaCacheKey,
      value: entry?.config,
    });
    if (!validatedConfig.ok) {
      logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.errors?.join(", ")}`);
      pushPluginLoadError(`invalid config: ${validatedConfig.errors?.join(", ")}`);
      continue;
    }

    const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
    const cliMetadataSource = resolveCliMetadataEntrySource(candidate.rootDir);
    const sourceForCliMetadata =
      candidate.origin === "bundled" ? cliMetadataSource : (cliMetadataSource ?? candidate.source);
    if (!sourceForCliMetadata) {
      record.status = "loaded";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    const opened = openBoundaryFileSync({
      absolutePath: sourceForCliMetadata,
      rootPath: pluginRoot,
      boundaryLabel: "plugin root",
      rejectHardlinks: candidate.origin !== "bundled",
      skipLexicalRootCheck: true,
    });
    if (!opened.ok) {
      pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
      continue;
    }
    const safeSource = opened.path;
    fs.closeSync(opened.fd);

    let mod: OpenClawPluginModule | null = null;
    try {
      mod = getJiti(safeSource)(safeSource) as OpenClawPluginModule;
    } catch (err) {
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "load",
        error: err,
        logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
        diagnosticMessagePrefix: "failed to load plugin: ",
      });
      continue;
    }

    const resolved = resolvePluginModuleExport(mod);
    const definition = resolved.definition;
    const register = resolved.register;

    if (definition?.id && definition.id !== record.id) {
      pushPluginLoadError(
        `plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`,
      );
      continue;
    }

    record.name = definition?.name ?? record.name;
    record.description = definition?.description ?? record.description;
    record.version = definition?.version ?? record.version;
    const manifestKind = record.kind;
    const exportKind = definition?.kind;
    if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) {
      registry.diagnostics.push({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`,
      });
    }
    record.kind = definition?.kind ?? record.kind;

    const memoryDecision = resolveMemorySlotDecision({
      id: record.id,
      kind: record.kind,
      slot: memorySlot,
      selectedId: selectedMemoryPluginId,
    });
    if (!memoryDecision.enabled) {
      record.enabled = false;
      record.status = "disabled";
      record.error = memoryDecision.reason;
      markPluginActivationDisabled(record, memoryDecision.reason);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (memoryDecision.selected && hasKind(record.kind, "memory")) {
      selectedMemoryPluginId = record.id;
      record.memorySlotSelected = true;
    }

    if (typeof register !== "function") {
      logger.error(`[plugins] ${record.id} missing register/activate export`);
      pushPluginLoadError("plugin export missing register/activate");
      continue;
    }

    const api = buildPluginApi({
      id: record.id,
      name: record.name,
      version: record.version,
      description: record.description,
      source: record.source,
      rootDir: record.rootDir,
      registrationMode: "cli-metadata",
      config: cfg,
      pluginConfig: validatedConfig.value,
      runtime: {} as PluginRuntime,
      logger,
      resolvePath: (input) => resolveUserPath(input),
      handlers: {
        registerCli: (registrar, opts) => registerCli(record, registrar, opts),
      },
    });

    try {
      await register(api);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
    } catch (err) {
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "register",
        error: err,
        logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
        diagnosticMessagePrefix: "plugin failed during register: ",
      });
    }
  }

  return registry;
}

function safeRealpathOrResolve(value: string): string {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}

function resolveCliMetadataEntrySource(rootDir: string): string | null {
  for (const basename of CLI_METADATA_ENTRY_BASENAMES) {
    const candidate = path.join(rootDir, basename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
<<<<<<< HEAD
=======
export { testing as __testing };
>>>>>>> upstream/main
