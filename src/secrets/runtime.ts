<<<<<<< HEAD
import { resolveOpenClawAgentDir } from "../agents/agent-paths.js";
import {
  listAgentIds,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
} from "../agents/agent-scope.js";
import type { AuthProfileStore } from "../agents/auth-profiles.js";
=======
/** Prepares secrets runtime snapshots from config, auth stores, plugins, and env. */
import { isDeepStrictEqual } from "node:util";
import { uniqueStrings } from "@openclaw/normalization-core/string-normalization";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope-config.js";
>>>>>>> upstream/main
import {
  clearRuntimeAuthProfileStoreSnapshots,
  loadAuthProfileStoreForSecretsRuntime,
  loadAuthProfileStoreWithoutExternalProfiles,
} from "../agents/auth-profiles.js";
<<<<<<< HEAD
import {
  clearRuntimeConfigSnapshot,
  setRuntimeConfigSnapshotRefreshHandler,
  setRuntimeConfigSnapshot,
  type OpenClawConfig,
} from "../config/config.js";
import type { PluginOrigin } from "../plugins/types.js";
=======
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
>>>>>>> upstream/main
import { resolveUserPath } from "../utils.js";
import { type SecretResolverWarning } from "./runtime-shared.js";
import {
<<<<<<< HEAD
  clearActiveRuntimeWebToolsMetadata,
  getActiveRuntimeWebToolsMetadata as getActiveRuntimeWebToolsMetadataFromState,
  setActiveRuntimeWebToolsMetadata,
} from "./runtime-web-tools-state.js";
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.js";
=======
  canUseSecretsRuntimeFastPath,
  collectCandidateAgentDirs,
  createEmptyRuntimeWebToolsMetadata,
  mergeSecretsRuntimeEnv,
  resolveRefreshAgentDirs,
} from "./runtime-fast-path.js";
import {
  activateSecretsRuntimeSnapshotState,
  clearSecretsRuntimeSnapshot as clearSecretsRuntimeSnapshotState,
  getActiveSecretsRuntimeEnv as getActiveSecretsRuntimeEnvState,
  getActiveSecretsRuntimeRefreshContext,
  getActiveSecretsRuntimeSnapshot as getActiveSecretsRuntimeSnapshotState,
  getLiveSecretsRuntimeAuthStores,
  getPreparedSecretsRuntimeSnapshotRefreshContext,
  registerSecretsRuntimeStateClearHook,
  setPreparedSecretsRuntimeSnapshotRefreshContext,
  type PreparedSecretsRuntimeSnapshot,
  type SecretsRuntimeRefreshContext,
} from "./runtime-state.js";
import { getActiveRuntimeWebToolsMetadata as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-web-tools-state.js";
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
>>>>>>> upstream/main

export type { SecretResolverWarning } from "./runtime-shared.js";
export type { PreparedSecretsRuntimeSnapshot } from "./runtime-state.js";

registerSecretsRuntimeStateClearHook(clearRuntimeAuthProfileStoreSnapshots);

let runtimeManifestPromise: Promise<typeof import("./runtime-manifest.runtime.js")> | null = null;
let runtimePreparePromise: Promise<typeof import("./runtime-prepare.runtime.js")> | null = null;

function loadRuntimeManifestHelpers() {
  runtimeManifestPromise ??= import("./runtime-manifest.runtime.js");
  return runtimeManifestPromise;
}

function loadRuntimePrepareHelpers() {
  runtimePreparePromise ??= import("./runtime-prepare.runtime.js");
  return runtimePreparePromise;
}

async function resolveLoadablePluginOrigins(params: {
  config: OpenClawConfig;
<<<<<<< HEAD
  authStores: Array<{ agentDir: string; store: AuthProfileStore }>;
  warnings: SecretResolverWarning[];
  webTools: RuntimeWebToolsMetadata;
};

type SecretsRuntimeRefreshContext = {
  env: Record<string, string | undefined>;
  explicitAgentDirs: string[] | null;
  loadAuthStore: (agentDir?: string) => AuthProfileStore;
  loadablePluginOrigins: ReadonlyMap<string, PluginOrigin>;
};

const RUNTIME_PATH_ENV_KEYS = [
  "HOME",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "OPENCLAW_HOME",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
  "OPENCLAW_AGENT_DIR",
  "PI_CODING_AGENT_DIR",
  "OPENCLAW_TEST_FAST",
] as const;

let activeSnapshot: PreparedSecretsRuntimeSnapshot | null = null;
let activeRefreshContext: SecretsRuntimeRefreshContext | null = null;
const preparedSnapshotRefreshContext = new WeakMap<
  PreparedSecretsRuntimeSnapshot,
  SecretsRuntimeRefreshContext
>();
let runtimeManifestPromise: Promise<typeof import("./runtime-manifest.runtime.js")> | null = null;
let runtimePreparePromise: Promise<typeof import("./runtime-prepare.runtime.js")> | null = null;

function loadRuntimeManifestHelpers() {
  runtimeManifestPromise ??= import("./runtime-manifest.runtime.js");
  return runtimeManifestPromise;
}

function loadRuntimePrepareHelpers() {
  runtimePreparePromise ??= import("./runtime-prepare.runtime.js");
  return runtimePreparePromise;
}

function cloneSnapshot(snapshot: PreparedSecretsRuntimeSnapshot): PreparedSecretsRuntimeSnapshot {
  return {
    sourceConfig: structuredClone(snapshot.sourceConfig),
    config: structuredClone(snapshot.config),
    authStores: snapshot.authStores.map((entry) => ({
      agentDir: entry.agentDir,
      store: structuredClone(entry.store),
    })),
    warnings: snapshot.warnings.map((warning) => ({ ...warning })),
    webTools: structuredClone(snapshot.webTools),
  };
}

function cloneRefreshContext(context: SecretsRuntimeRefreshContext): SecretsRuntimeRefreshContext {
  return {
    env: { ...context.env },
    explicitAgentDirs: context.explicitAgentDirs ? [...context.explicitAgentDirs] : null,
    loadAuthStore: context.loadAuthStore,
    loadablePluginOrigins: new Map(context.loadablePluginOrigins),
  };
}

function clearActiveSecretsRuntimeState(): void {
  activeSnapshot = null;
  activeRefreshContext = null;
  clearActiveRuntimeWebToolsMetadata();
  setRuntimeConfigSnapshotRefreshHandler(null);
  clearRuntimeConfigSnapshot();
  clearRuntimeAuthProfileStoreSnapshots();
=======
  env: NodeJS.ProcessEnv;
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
}): Promise<ReadonlyMap<string, PluginOrigin>> {
  const workspaceDir = resolveAgentWorkspaceDir(
    params.config,
    resolveDefaultAgentId(params.config),
  );
  const { listPluginOriginsFromMetadataSnapshot, loadPluginMetadataSnapshot } =
    await loadRuntimeManifestHelpers();
  const snapshot =
    params.pluginMetadataSnapshot ??
    loadPluginMetadataSnapshot({
      config: params.config,
      workspaceDir,
      env: params.env,
    });
  return listPluginOriginsFromMetadataSnapshot(snapshot);
}

function hasConfiguredPluginEntries(config: OpenClawConfig): boolean {
  const entries = config.plugins?.entries;
  return (
    Boolean(entries) &&
    typeof entries === "object" &&
    !Array.isArray(entries) &&
    Object.keys(entries).length > 0
  );
}

function hasConfiguredChannelEntries(config: OpenClawConfig): boolean {
  const channels = config.channels;
  return (
    Boolean(channels) &&
    typeof channels === "object" &&
    !Array.isArray(channels) &&
    Object.keys(channels).some((channelId) => channelId !== "defaults")
  );
>>>>>>> upstream/main
}

function hasConfiguredPluginIntegrationSecretProviders(config: OpenClawConfig): boolean {
  const providers = config.secrets?.providers;
  if (!providers || typeof providers !== "object" || Array.isArray(providers)) {
    return false;
  }
  return Object.values(providers).some(
    (provider) =>
      provider?.source === "exec" &&
      "pluginIntegration" in provider &&
      provider.pluginIntegration !== undefined,
  );
}

<<<<<<< HEAD
function resolveRefreshAgentDirs(
  config: OpenClawConfig,
  context: SecretsRuntimeRefreshContext,
): string[] {
  const configDerived = collectCandidateAgentDirs(config, context.env);
  if (!context.explicitAgentDirs || context.explicitAgentDirs.length === 0) {
    return configDerived;
  }
  return [...new Set([...context.explicitAgentDirs, ...configDerived])];
}

async function resolveLoadablePluginOrigins(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
}): Promise<ReadonlyMap<string, PluginOrigin>> {
  const workspaceDir = resolveAgentWorkspaceDir(
    params.config,
    resolveDefaultAgentId(params.config),
  );
  const { loadPluginManifestRegistry } = await loadRuntimeManifestHelpers();
  const manifestRegistry = loadPluginManifestRegistry({
    config: params.config,
    workspaceDir,
    cache: true,
    env: params.env,
  });
  return new Map(manifestRegistry.plugins.map((record) => [record.id, record.origin]));
}

function mergeSecretsRuntimeEnv(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> | undefined,
): Record<string, string | undefined> {
  const merged = { ...(env ?? process.env) } as Record<string, string | undefined>;
  for (const key of RUNTIME_PATH_ENV_KEYS) {
    if (merged[key] !== undefined) {
      continue;
    }
    const processValue = process.env[key];
    if (processValue !== undefined) {
      merged[key] = processValue;
    }
  }
  return merged;
=======
function shouldLoadPluginMetadataForSecrets(config: OpenClawConfig): boolean {
  return (
    hasConfiguredPluginEntries(config) ||
    hasConfiguredChannelEntries(config) ||
    hasConfiguredPluginIntegrationSecretProviders(config)
  );
>>>>>>> upstream/main
}

/** Prepares a secrets runtime snapshot and records refresh context for later activation. */
export async function prepareSecretsRuntimeSnapshot(params: {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  agentDirs?: string[];
  includeAuthStoreRefs?: boolean;
  loadAuthStore?: (agentDir?: string) => AuthProfileStore;
<<<<<<< HEAD
=======
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins" | "manifestRegistry">;
>>>>>>> upstream/main
  /** Test override for discovered loadable plugins and their origins. */
  loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): Promise<PreparedSecretsRuntimeSnapshot> {
  const {
    applyResolvedAssignments,
    collectAuthStoreAssignments,
    collectConfigAssignments,
    createResolverContext,
    resolveRuntimeWebTools,
    resolveSecretRefValues,
  } = await loadRuntimePrepareHelpers();
  const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
  const sourceConfig = structuredClone(params.config);
  const resolvedConfig = structuredClone(params.config);
<<<<<<< HEAD
  const loadablePluginOrigins =
    params.loadablePluginOrigins ??
    (await resolveLoadablePluginOrigins({ config: sourceConfig, env: runtimeEnv }));
=======
  const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
  let authStores: Array<{ agentDir: string; store: AuthProfileStore }> = [];
  const fastPathLoadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreWithoutExternalProfiles;
  const candidateDirs = params.agentDirs?.length
    ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv)))
    : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
  if (includeAuthStoreRefs) {
    for (const agentDir of candidateDirs) {
      authStores.push({
        agentDir,
        store: structuredClone(fastPathLoadAuthStore(agentDir)),
      });
    }
  }
  if (canUseSecretsRuntimeFastPath({ sourceConfig, authStores })) {
    const manifestRegistry =
      params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
    const snapshot = {
      sourceConfig,
      config: resolvedConfig,
      authStores,
      warnings: [],
      webTools: createEmptyRuntimeWebToolsMetadata(),
    };
    setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
      env: runtimeEnv,
      explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
      includeAuthStoreRefs,
      loadAuthStore: fastPathLoadAuthStore,
      loadablePluginOrigins: params.loadablePluginOrigins ?? new Map<string, PluginOrigin>(),
      ...(manifestRegistry ? { manifestRegistry } : {}),
    });
    return snapshot;
  }

  const {
    applyResolvedAssignments,
    collectAuthStoreAssignments,
    collectConfigAssignments,
    createResolverContext,
    resolveRuntimeWebTools,
    resolveSecretRefValues,
  } = await loadRuntimePrepareHelpers();
  const manifestRegistry =
    params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
  const loadablePluginOrigins =
    params.loadablePluginOrigins ??
    (shouldLoadPluginMetadataForSecrets(sourceConfig)
      ? await resolveLoadablePluginOrigins({
          config: sourceConfig,
          env: runtimeEnv,
          pluginMetadataSnapshot:
            params.pluginMetadataSnapshot ??
            (manifestRegistry ? { plugins: manifestRegistry.plugins } : undefined),
        })
      : new Map<string, PluginOrigin>());
>>>>>>> upstream/main
  const context = createResolverContext({
    sourceConfig,
    env: runtimeEnv,
    ...(manifestRegistry ? { manifestRegistry } : {}),
  });

  collectConfigAssignments({
    config: resolvedConfig,
    context,
    loadablePluginOrigins,
  });

<<<<<<< HEAD
  const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
  const authStores: Array<{ agentDir: string; store: AuthProfileStore }> = [];
  const loadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime;
  const candidateDirs = params.agentDirs?.length
    ? [...new Set(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv)))]
    : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
  if (includeAuthStoreRefs) {
    for (const agentDir of candidateDirs) {
      const store = structuredClone(loadAuthStore(agentDir));
      collectAuthStoreAssignments({
        store,
        context,
        agentDir,
      });
      authStores.push({ agentDir, store });
=======
  if (includeAuthStoreRefs) {
    const loadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime;
    if (!params.loadAuthStore) {
      authStores = candidateDirs.map((agentDir) => ({
        agentDir,
        store: structuredClone(loadAuthStore(agentDir)),
      }));
    }
    for (const entry of authStores) {
      collectAuthStoreAssignments({
        store: entry.store,
        context,
        agentDir: entry.agentDir,
      });
>>>>>>> upstream/main
    }
  }

  if (context.assignments.length > 0) {
    const refs = context.assignments.map((assignment) => assignment.ref);
    const resolved = await resolveSecretRefValues(refs, {
      config: sourceConfig,
      env: context.env,
      cache: context.cache,
      manifestRegistry: context.manifestRegistry,
    });
    applyResolvedAssignments({
      assignments: context.assignments,
      resolved,
    });
  }

  const snapshot = {
    sourceConfig,
    config: resolvedConfig,
    authStores,
    warnings: context.warnings,
    webTools: await resolveRuntimeWebTools({
      sourceConfig,
      resolvedConfig,
      context,
    }),
  };
  setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
    env: runtimeEnv,
    explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
<<<<<<< HEAD
    loadAuthStore,
    loadablePluginOrigins,
=======
    includeAuthStoreRefs,
    loadAuthStore: params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime,
    loadablePluginOrigins,
    ...(manifestRegistry ? { manifestRegistry } : {}),
>>>>>>> upstream/main
  });
  return snapshot;
}

/** Activates a prepared secrets runtime snapshot for fast runtime lookup. */
export function activateSecretsRuntimeSnapshot(snapshot: PreparedSecretsRuntimeSnapshot): void {
  const refreshContext =
    getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) ??
    getActiveSecretsRuntimeRefreshContext() ??
    ({
      env: { ...process.env } as Record<string, string | undefined>,
      explicitAgentDirs: null,
      includeAuthStoreRefs: snapshot.authStores.length > 0,
      loadAuthStore: loadAuthProfileStoreForSecretsRuntime,
      loadablePluginOrigins: new Map<string, PluginOrigin>(),
    } satisfies SecretsRuntimeRefreshContext);
<<<<<<< HEAD
  setRuntimeConfigSnapshot(next.config, next.sourceConfig);
  replaceRuntimeAuthProfileStoreSnapshots(next.authStores);
  activeSnapshot = next;
  activeRefreshContext = cloneRefreshContext(refreshContext);
  setActiveRuntimeWebToolsMetadata(next.webTools);
  setRuntimeConfigSnapshotRefreshHandler({
    refresh: async ({ sourceConfig }) => {
      if (!activeSnapshot || !activeRefreshContext) {
        return false;
      }
      const refreshed = await prepareSecretsRuntimeSnapshot({
        config: sourceConfig,
        env: activeRefreshContext.env,
        agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
        loadAuthStore: activeRefreshContext.loadAuthStore,
        loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
      });
      activateSecretsRuntimeSnapshot(refreshed);
      return true;
=======
  const coercePreflightSnapshot = (
    value: unknown,
    sourceConfig: OpenClawConfig,
  ): PreparedSecretsRuntimeSnapshot | null => {
    if (!value || typeof value !== "object") {
      return null;
    }
    const candidate = value as PreparedSecretsRuntimeSnapshot;
    return isDeepStrictEqual(candidate.sourceConfig, sourceConfig) ? candidate : null;
  };
  activateSecretsRuntimeSnapshotState({
    snapshot,
    refreshContext,
    refreshHandler: {
      preflight: async ({ sourceConfig, includeAuthStoreRefs }) => {
        const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
        const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
        if (!activeSnapshot || !activeRefreshContext) {
          return false;
        }
        return await prepareSecretsRuntimeSnapshot({
          config: sourceConfig,
          env: activeRefreshContext.env,
          agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
          includeAuthStoreRefs: includeAuthStoreRefs ?? activeRefreshContext.includeAuthStoreRefs,
          loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
          ...(activeRefreshContext.manifestRegistry
            ? { manifestRegistry: activeRefreshContext.manifestRegistry }
            : {}),
          ...(activeRefreshContext.loadAuthStore
            ? { loadAuthStore: activeRefreshContext.loadAuthStore }
            : {}),
        });
      },
      refresh: async ({ sourceConfig, includeAuthStoreRefs, preflightResult }) => {
        const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
        const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
        if (!activeSnapshot || !activeRefreshContext) {
          return false;
        }
        const oneShotSkipAuthStoreRefs =
          includeAuthStoreRefs === false && activeRefreshContext.includeAuthStoreRefs;
        const refreshed =
          coercePreflightSnapshot(preflightResult, sourceConfig) ??
          (await prepareSecretsRuntimeSnapshot({
            config: sourceConfig,
            env: activeRefreshContext.env,
            agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
            includeAuthStoreRefs: includeAuthStoreRefs ?? activeRefreshContext.includeAuthStoreRefs,
            loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
            ...(activeRefreshContext.manifestRegistry
              ? { manifestRegistry: activeRefreshContext.manifestRegistry }
              : {}),
            ...(activeRefreshContext.loadAuthStore
              ? { loadAuthStore: activeRefreshContext.loadAuthStore }
              : {}),
          }));
        if (oneShotSkipAuthStoreRefs) {
          refreshed.authStores = getLiveSecretsRuntimeAuthStores();
          setPreparedSecretsRuntimeSnapshotRefreshContext(refreshed, activeRefreshContext);
        }
        activateSecretsRuntimeSnapshot(refreshed);
        return true;
      },
>>>>>>> upstream/main
    },
  });
}

export async function refreshActiveSecretsRuntimeSnapshot(): Promise<boolean> {
  const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
  const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
  if (!activeSnapshot || !activeRefreshContext) {
    return false;
  }
  const refreshed = await prepareSecretsRuntimeSnapshot({
    config: activeSnapshot.sourceConfig,
    env: activeRefreshContext.env,
    agentDirs: resolveRefreshAgentDirs(activeSnapshot.sourceConfig, activeRefreshContext),
    includeAuthStoreRefs: activeRefreshContext.includeAuthStoreRefs,
    loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
    ...(activeRefreshContext.manifestRegistry
      ? { manifestRegistry: activeRefreshContext.manifestRegistry }
      : {}),
    ...(activeRefreshContext.loadAuthStore
      ? { loadAuthStore: activeRefreshContext.loadAuthStore }
      : {}),
  });
  activateSecretsRuntimeSnapshot(refreshed);
  return true;
}

export function getActiveSecretsRuntimeSnapshot(): PreparedSecretsRuntimeSnapshot | null {
  return getActiveSecretsRuntimeSnapshotState();
}

export function getActiveSecretsRuntimeEnv(): NodeJS.ProcessEnv {
  return getActiveSecretsRuntimeEnvState();
}

export function getActiveRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata | null {
  return getActiveRuntimeWebToolsMetadataFromState();
}

export function clearSecretsRuntimeSnapshot(): void {
  clearSecretsRuntimeSnapshotState();
}
