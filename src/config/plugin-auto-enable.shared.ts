<<<<<<< HEAD
import { normalizeProviderId } from "../agents/model-selection.js";
import {
  hasPotentialConfiguredChannels,
  listPotentialConfiguredChannelIds,
} from "../channels/config-presence.js";
import { getChatChannelMeta, normalizeChatChannelId } from "../channels/registry.js";
import {
  loadPluginManifestRegistry,
  resolveManifestContractOwnerPluginId,
  type PluginManifestRegistry,
} from "../plugins/manifest-registry.js";
=======
// Shares plugin auto-enable detection across config and runtime code.
import { collectConfiguredModelRefs } from "@openclaw/model-catalog-core/configured-model-refs";
import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import { collectConfiguredAgentHarnessRuntimes } from "../agents/harness-runtimes.js";
import {
  listPotentialConfiguredChannelPresenceSignals,
  type ChannelPresenceSignalSource,
} from "../channels/config-presence.js";
import {
  hasBundledChannelConfiguredState,
  listBundledChannelIdsWithConfiguredState,
} from "../channels/plugins/configured-state.js";
import { getChatChannelMeta, normalizeChatChannelId } from "../channels/registry.js";
import { normalizePluginsConfig } from "../plugins/config-state.js";
import { getCurrentPluginMetadataSnapshot } from "../plugins/current-plugin-metadata-snapshot.js";
import type { PluginDiscoveryResult } from "../plugins/discovery.js";
import { resolveInstalledPluginIndexPolicyHash } from "../plugins/installed-plugin-index-policy.js";
import type { PluginManifestRecord, PluginManifestRegistry } from "../plugins/manifest-registry.js";
import { loadPluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
>>>>>>> upstream/main
import { resolveOwningPluginIdsForModelRef } from "../plugins/providers.js";
import { resolvePluginSetupAutoEnableReasons } from "../plugins/setup-registry.js";
import { isRecord } from "../utils.js";
import { isChannelConfigured } from "./channel-configured.js";
<<<<<<< HEAD
import type { OpenClawConfig } from "./config.js";
import { shouldSkipPreferredPluginAutoEnable } from "./plugin-auto-enable.prefer-over.js";
import { ensurePluginAllowlisted } from "./plugins-allowlist.js";
import { isBlockedObjectKey } from "./prototype-keys.js";

export type PluginAutoEnableCandidate =
  | {
      pluginId: string;
      kind: "channel-configured";
      channelId: string;
    }
  | {
      pluginId: string;
      kind: "provider-auth-configured";
      providerId: string;
    }
  | {
      pluginId: string;
      kind: "provider-model-configured";
      modelRef: string;
    }
  | {
      pluginId: string;
      kind: "web-fetch-provider-selected";
      providerId: string;
    }
  | {
      pluginId: string;
      kind: "plugin-web-search-configured";
    }
  | {
      pluginId: string;
      kind: "plugin-web-fetch-configured";
    }
  | {
      pluginId: string;
      kind: "plugin-tool-configured";
    }
  | {
      pluginId: string;
      kind: "setup-auto-enable";
      reason: string;
    };

export type PluginAutoEnableResult = {
  config: OpenClawConfig;
  changes: string[];
  autoEnabledReasons: Record<string, string[]>;
};
=======
import { shouldSkipPreferredPluginAutoEnable } from "./plugin-auto-enable.prefer-over.js";
import type {
  PluginAutoEnableCandidate,
  PluginAutoEnableResult,
} from "./plugin-auto-enable.types.js";
import { ensurePluginAllowlisted } from "./plugins-allowlist.js";
import { isBlockedObjectKey } from "./prototype-keys.js";
import type { OpenClawConfig } from "./types.openclaw.js";
export type {
  PluginAutoEnableCandidate,
  PluginAutoEnableResult,
} from "./plugin-auto-enable.types.js";
>>>>>>> upstream/main

const EMPTY_PLUGIN_MANIFEST_REGISTRY: PluginManifestRegistry = {
  plugins: [],
  diagnostics: [],
};

function resolveAutoEnableProviderPluginIds(
  registry: PluginManifestRegistry,
): Readonly<Record<string, string>> {
  const entries = new Map<string, string>();
  for (const plugin of registry.plugins) {
    for (const providerId of plugin.autoEnableWhenConfiguredProviders ?? []) {
      if (!entries.has(providerId)) {
        entries.set(providerId, plugin.id);
      }
    }
  }
  return Object.fromEntries(entries);
}

<<<<<<< HEAD
function collectModelRefs(cfg: OpenClawConfig): string[] {
  const refs: string[] = [];
  const pushModelRef = (value: unknown) => {
    if (typeof value === "string" && value.trim()) {
      refs.push(value.trim());
    }
  };
  const collectFromAgent = (agent: Record<string, unknown> | null | undefined) => {
    if (!agent) {
      return;
    }
    const model = agent.model;
    if (typeof model === "string") {
      pushModelRef(model);
    } else if (isRecord(model)) {
      pushModelRef(model.primary);
      const fallbacks = model.fallbacks;
      if (Array.isArray(fallbacks)) {
        for (const entry of fallbacks) {
          pushModelRef(entry);
        }
      }
    }
    const models = agent.models;
    if (isRecord(models)) {
      for (const key of Object.keys(models)) {
        pushModelRef(key);
      }
    }
  };

  collectFromAgent(cfg.agents?.defaults as Record<string, unknown> | undefined);
  const list = cfg.agents?.list;
  if (Array.isArray(list)) {
    for (const entry of list) {
      if (isRecord(entry)) {
        collectFromAgent(entry);
      }
    }
  }
  return refs;
=======
function canReuseUnscopedCurrentPluginMetadataSnapshot(config: OpenClawConfig): boolean {
  return normalizePluginsConfig(config.plugins).loadPaths.length === 0;
>>>>>>> upstream/main
}

function extractProviderFromModelRef(value: string): string | null {
  const trimmed = value.trim();
  const slash = trimmed.indexOf("/");
  if (slash <= 0) {
    return null;
  }
  return normalizeProviderId(trimmed.slice(0, slash));
}

<<<<<<< HEAD
=======
function hasConfiguredEmbeddedHarnessRuntime(
  cfg: OpenClawConfig,
  _env: NodeJS.ProcessEnv,
): boolean {
  return collectConfiguredAgentHarnessRuntimes(cfg).length > 0;
}

function resolveAgentHarnessOwnerPluginIds(
  registry: PluginManifestRegistry,
  runtime: string,
): string[] {
  const normalizedRuntime = normalizeOptionalLowercaseString(runtime);
  if (!normalizedRuntime) {
    return [];
  }
  return registry.plugins
    .filter((plugin) =>
      [...(plugin.activation?.onAgentHarnesses ?? []), ...(plugin.cliBackends ?? [])].some(
        (entry) => normalizeOptionalLowercaseString(entry) === normalizedRuntime,
      ),
    )
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}

>>>>>>> upstream/main
function isProviderConfigured(cfg: OpenClawConfig, providerId: string): boolean {
  const normalized = normalizeProviderId(providerId);
  const profiles = cfg.auth?.profiles;
  if (profiles && typeof profiles === "object") {
    for (const profile of Object.values(profiles)) {
      if (!isRecord(profile)) {
        continue;
      }
<<<<<<< HEAD
      const provider = normalizeProviderId(String(profile.provider ?? ""));
=======
      const provider = normalizeProviderId(profile.provider ?? "");
>>>>>>> upstream/main
      if (provider === normalized) {
        return true;
      }
    }
  }

  const providerConfig = cfg.models?.providers;
  if (providerConfig && typeof providerConfig === "object") {
    for (const key of Object.keys(providerConfig)) {
      if (normalizeProviderId(key) === normalized) {
        return true;
      }
    }
  }

<<<<<<< HEAD
  for (const ref of collectModelRefs(cfg)) {
=======
  for (const { value: ref } of collectConfiguredModelRefs(cfg, {
    includeChannelModelOverrides: false,
  })) {
>>>>>>> upstream/main
    const provider = extractProviderFromModelRef(ref);
    if (provider && provider === normalized) {
      return true;
    }
  }

  return false;
}

function hasPluginOwnedWebSearchConfig(cfg: OpenClawConfig, pluginId: string): boolean {
  const pluginConfig = cfg.plugins?.entries?.[pluginId]?.config;
  return isRecord(pluginConfig) && isRecord(pluginConfig.webSearch);
}

function hasPluginOwnedWebFetchConfig(cfg: OpenClawConfig, pluginId: string): boolean {
  const pluginConfig = cfg.plugins?.entries?.[pluginId]?.config;
  return isRecord(pluginConfig) && isRecord(pluginConfig.webFetch);
}

<<<<<<< HEAD
function hasPluginOwnedToolConfig(cfg: OpenClawConfig, pluginId: string): boolean {
  const pluginConfig = cfg.plugins?.entries?.xai?.config;
  const web = cfg.tools?.web as Record<string, unknown> | undefined;
  return (
    pluginId === "xai" &&
    Boolean(
      isRecord(web?.x_search) ||
      (isRecord(pluginConfig) &&
        (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution))),
    )
  );
=======
function resolvePluginOwnedToolConfigKeys(plugin: PluginManifestRecord): string[] {
  if ((plugin.contracts?.tools?.length ?? 0) === 0) {
    return [];
  }
  const properties = isRecord(plugin.configSchema) ? plugin.configSchema.properties : undefined;
  if (!isRecord(properties)) {
    return [];
  }
  return Object.keys(properties).filter((key) => key !== "webSearch" && key !== "webFetch");
}

function hasPluginOwnedToolConfig(cfg: OpenClawConfig, plugin: PluginManifestRecord): boolean {
  const pluginConfig = cfg.plugins?.entries?.[plugin.id]?.config;
  if (!isRecord(pluginConfig)) {
    return false;
  }
  return resolvePluginOwnedToolConfigKeys(plugin).some((key) => pluginConfig[key] !== undefined);
>>>>>>> upstream/main
}

function resolveProviderPluginsWithOwnedWebSearch(
  registry: PluginManifestRegistry,
<<<<<<< HEAD
): ReadonlySet<string> {
  return new Set(
    registry.plugins
      .filter((plugin) => plugin.providers.length > 0)
      .filter((plugin) => (plugin.contracts?.webSearchProviders?.length ?? 0) > 0)
      .map((plugin) => plugin.id),
  );
=======
): PluginManifestRecord[] {
  return registry.plugins
    .filter((plugin) => (plugin.providers?.length ?? 0) > 0)
    .filter((plugin) => (plugin.contracts?.webSearchProviders?.length ?? 0) > 0);
>>>>>>> upstream/main
}

function resolveProviderPluginsWithOwnedWebFetch(
  registry: PluginManifestRegistry,
<<<<<<< HEAD
): ReadonlySet<string> {
  return new Set(
    registry.plugins
      .filter((plugin) => (plugin.contracts?.webFetchProviders?.length ?? 0) > 0)
      .map((plugin) => plugin.id),
  );
}

function resolvePluginIdForConfiguredWebFetchProvider(
  providerId: string | undefined,
  env: NodeJS.ProcessEnv,
): string | undefined {
  return resolveManifestContractOwnerPluginId({
    contract: "webFetchProviders",
    value: typeof providerId === "string" ? providerId.trim().toLowerCase() : "",
    origin: "bundled",
    env,
  });
}

function buildChannelToPluginIdMap(registry: PluginManifestRegistry): Map<string, string> {
  const map = new Map<string, string>();
  for (const record of registry.plugins) {
    for (const channelId of record.channels) {
      if (channelId && !map.has(channelId)) {
        map.set(channelId, record.id);
      }
    }
  }
  return map;
}

function resolvePluginIdForChannel(
  channelId: string,
  channelToPluginId: ReadonlyMap<string, string>,
): string {
  const builtInId = normalizeChatChannelId(channelId);
  if (builtInId) {
    return builtInId;
  }
  return channelToPluginId.get(channelId) ?? channelId;
}

function collectCandidateChannelIds(cfg: OpenClawConfig, env: NodeJS.ProcessEnv): string[] {
  return listPotentialConfiguredChannelIds(cfg, env).map(
    (channelId) => normalizeChatChannelId(channelId) ?? channelId,
  );
=======
): PluginManifestRecord[] {
  return registry.plugins.filter(
    (plugin) => (plugin.contracts?.webFetchProviders?.length ?? 0) > 0,
  );
}

function resolvePluginsWithOwnedToolConfig(
  registry: PluginManifestRegistry,
): PluginManifestRecord[] {
  return registry.plugins.filter((plugin) => (plugin.contracts?.tools?.length ?? 0) > 0);
}

function resolvePluginIdForConfiguredWebFetchProvider(
  providerId: string | undefined,
  registry: PluginManifestRegistry,
): string | undefined {
  const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
  if (!normalizedProviderId) {
    return undefined;
  }
  return registry.plugins.find(
    (plugin) =>
      plugin.origin === "bundled" &&
      (plugin.contracts?.webFetchProviders ?? []).some(
        (candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId,
      ),
  )?.id;
}

function resolvePluginIdForConfiguredWebSearchProvider(
  providerId: string | undefined,
  registry: PluginManifestRegistry,
): string | undefined {
  const normalizedProviderId = normalizeOptionalLowercaseString(providerId);
  if (!normalizedProviderId) {
    return undefined;
  }
  return registry.plugins.find((plugin) =>
    (plugin.contracts?.webSearchProviders ?? []).some(
      (candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProviderId,
    ),
  )?.id;
}

function normalizeManifestChannelId(channelId: string): string {
  return normalizeChatChannelId(channelId) ?? channelId;
}

function getManifestChannelPreferOver(
  plugin: PluginManifestRecord,
  channelId: string,
): readonly string[] {
  return plugin.channelConfigs?.[channelId]?.preferOver ?? [];
}

function collectPluginIdsForConfiguredChannel(
  channelId: string,
  registry: PluginManifestRegistry,
): string[] {
  const normalizedChannelId = normalizeManifestChannelId(channelId);
  const builtInId = normalizeChatChannelId(normalizedChannelId);
  const claims: Array<{ plugin: PluginManifestRecord; preferOver: readonly string[] }> = [];
  for (const record of registry.plugins) {
    if (
      (record.channels ?? []).some((id) => normalizeManifestChannelId(id) === normalizedChannelId)
    ) {
      claims.push({
        plugin: record,
        preferOver: getManifestChannelPreferOver(record, normalizedChannelId),
      });
    }
  }

  if (claims.length === 0) {
    return builtInId ? [builtInId] : [];
  }

  const claimIds = new Set(claims.map((claim) => claim.plugin.id));
  if (builtInId) {
    claimIds.add(builtInId);
  }
  const preferredIds = new Set<string>();
  for (const claim of claims) {
    for (const preferredOverId of claim.preferOver) {
      if (claimIds.has(preferredOverId)) {
        // Keep both sides as candidates. The preferOver filter later disables
        // the lower-priority plugin unless the preferred plugin is explicitly
        // disabled/denied, preserving fallback to bundled channel support.
        preferredIds.add(claim.plugin.id);
        preferredIds.add(preferredOverId);
      }
    }
  }

  if (preferredIds.size > 0) {
    return [...preferredIds].toSorted((left, right) => left.localeCompare(right));
  }
  return [claims[0]?.plugin.id ?? builtInId ?? normalizedChannelId];
}

function collectConfiguredChannelIds(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv,
  discovery?: PluginDiscoveryResult,
): string[] {
  const configuredStateChannelIds = new Set(listBundledChannelIdsWithConfiguredState(discovery));
  return listPotentialConfiguredChannelPresenceSignals(cfg, env, {
    includePersistedAuthState: false,
    discovery,
  })
    .map((signal) => ({
      source: signal.source,
      channelId: normalizeChatChannelId(signal.channelId) ?? signal.channelId,
    }))
    .filter(({ channelId, source }) =>
      isAutoEnableConfiguredChannelSignal({
        cfg,
        env,
        channelId,
        source,
        configuredStateChannelIds,
        discovery,
      }),
    )
    .map(({ channelId }) => channelId);
}

function isAutoEnableConfiguredChannelSignal(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  channelId: string;
  source: ChannelPresenceSignalSource;
  configuredStateChannelIds: ReadonlySet<string>;
  discovery?: PluginDiscoveryResult;
}): boolean {
  if (
    params.source === "env" &&
    params.configuredStateChannelIds.has(params.channelId) &&
    !hasBundledChannelConfiguredState({
      channelId: params.channelId,
      cfg: params.cfg,
      env: params.env,
      discovery: params.discovery,
    })
  ) {
    return false;
  }
  return isChannelConfigured(params.cfg, params.channelId, params.env);
>>>>>>> upstream/main
}

function hasConfiguredWebSearchPluginEntry(cfg: OpenClawConfig): boolean {
  const entries = cfg.plugins?.entries;
  return (
<<<<<<< HEAD
    !!entries &&
=======
    Boolean(entries) &&
>>>>>>> upstream/main
    typeof entries === "object" &&
    Object.values(entries).some(
      (entry) => isRecord(entry) && isRecord(entry.config) && isRecord(entry.config.webSearch),
    )
  );
}

<<<<<<< HEAD
function hasConfiguredWebFetchPluginEntry(cfg: OpenClawConfig): boolean {
  const entries = cfg.plugins?.entries;
  return (
    !!entries &&
=======
function hasConfiguredWebSearchProviderSelection(cfg: OpenClawConfig): boolean {
  const provider = cfg.tools?.web?.search?.provider;
  return (
    cfg.tools?.web?.search?.enabled !== false &&
    typeof provider === "string" &&
    Boolean(provider.trim())
  );
}

function hasConfiguredWebFetchPluginEntry(cfg: OpenClawConfig): boolean {
  const entries = cfg.plugins?.entries;
  return (
    Boolean(entries) &&
>>>>>>> upstream/main
    typeof entries === "object" &&
    Object.values(entries).some(
      (entry) => isRecord(entry) && isRecord(entry.config) && isRecord(entry.config.webFetch),
    )
  );
}

<<<<<<< HEAD
function configMayNeedPluginManifestRegistry(cfg: OpenClawConfig): boolean {
  const pluginEntries = cfg.plugins?.entries;
  if (
    pluginEntries &&
    Object.values(pluginEntries).some((entry) => isRecord(entry) && isRecord(entry.config))
  ) {
    return true;
  }
=======
function hasConfiguredPluginConfigEntry(cfg: OpenClawConfig): boolean {
  const entries = cfg.plugins?.entries;
  return (
    Boolean(entries) &&
    typeof entries === "object" &&
    Object.values(entries).some((entry) => isRecord(entry) && isRecord(entry.config))
  );
}

function listContainsNormalized(value: unknown, expected: string): boolean {
  return (
    Array.isArray(value) &&
    value.some((entry) => normalizeOptionalLowercaseString(entry) === expected)
  );
}

function toolPolicyReferencesBrowser(value: unknown): boolean {
  return (
    isRecord(value) &&
    (listContainsNormalized(value.allow, "browser") ||
      listContainsNormalized(value.alsoAllow, "browser"))
  );
}

function hasBrowserToolReference(cfg: OpenClawConfig): boolean {
  if (toolPolicyReferencesBrowser(cfg.tools)) {
    return true;
  }
  const agentList = cfg.agents?.list;
  return Array.isArray(agentList)
    ? agentList.some((entry) => isRecord(entry) && toolPolicyReferencesBrowser(entry.tools))
    : false;
}

function collectConfiguredPluginEntryIds(cfg: OpenClawConfig): string[] {
  const entries = cfg.plugins?.entries;
  if (!entries || typeof entries !== "object") {
    return [];
  }
  return Object.keys(entries)
    .map((pluginId) => pluginId.trim())
    .filter((pluginId) => pluginId && !isPluginEntryExplicitlyDisabled(cfg, pluginId));
}

function hasOwnPluginEntry(cfg: OpenClawConfig, pluginId: string): boolean {
  const entries = cfg.plugins?.entries;
  return Boolean(entries) && typeof entries === "object" && Object.hasOwn(entries, pluginId);
}

function isPluginEntryExplicitlyDisabled(cfg: OpenClawConfig, pluginId: string): boolean {
  return cfg.plugins?.entries?.[pluginId]?.enabled === false;
}

function hasNonDisabledPluginEntry(cfg: OpenClawConfig, pluginId: string): boolean {
  if (!hasOwnPluginEntry(cfg, pluginId)) {
    return false;
  }
  return !isPluginEntryExplicitlyDisabled(cfg, pluginId);
}

function hasBrowserSetupAutoEnableRelevantConfig(cfg: OpenClawConfig): boolean {
  if (cfg.browser?.enabled === false || isPluginEntryExplicitlyDisabled(cfg, "browser")) {
    return false;
  }
  if (isRecord(cfg.browser)) {
    return true;
  }
  if (hasNonDisabledPluginEntry(cfg, "browser")) {
    return true;
  }
  return hasBrowserToolReference(cfg);
}

function hasAcpxSetupAutoEnableRelevantConfig(cfg: OpenClawConfig): boolean {
  if (isPluginEntryExplicitlyDisabled(cfg, "acpx")) {
    return false;
  }
  if (!isRecord(cfg.acp)) {
    return false;
  }
  const backend = normalizeOptionalLowercaseString(cfg.acp.backend);
  const configured =
    cfg.acp.enabled === true ||
    (isRecord(cfg.acp.dispatch) && cfg.acp.dispatch.enabled === true) ||
    backend === "acpx";
  return configured && (!backend || backend === "acpx");
}

function hasXaiSetupAutoEnableRelevantConfig(cfg: OpenClawConfig): boolean {
  if (isPluginEntryExplicitlyDisabled(cfg, "xai")) {
    return false;
  }
  const pluginConfig = cfg.plugins?.entries?.xai?.config;
  return (
    (isRecord(pluginConfig) &&
      (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution))) ||
    (isRecord(cfg.tools?.web) && isRecord((cfg.tools.web as Record<string, unknown>).x_search))
  );
}

function resolveRelevantSetupAutoEnablePluginIds(cfg: OpenClawConfig): string[] {
  const pluginIds = new Set<string>(collectConfiguredPluginEntryIds(cfg));
  if (hasBrowserSetupAutoEnableRelevantConfig(cfg)) {
    pluginIds.add("browser");
  }
  if (hasAcpxSetupAutoEnableRelevantConfig(cfg)) {
    pluginIds.add("acpx");
  }
  if (hasXaiSetupAutoEnableRelevantConfig(cfg)) {
    pluginIds.add("xai");
  }
  return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}

function hasSetupAutoEnableRelevantConfig(cfg: OpenClawConfig): boolean {
  return (
    hasBrowserSetupAutoEnableRelevantConfig(cfg) ||
    hasAcpxSetupAutoEnableRelevantConfig(cfg) ||
    hasXaiSetupAutoEnableRelevantConfig(cfg) ||
    hasConfiguredPluginConfigEntry(cfg)
  );
}

function hasPluginEntries(cfg: OpenClawConfig): boolean {
  const entries = cfg.plugins?.entries;
  return Boolean(entries) && typeof entries === "object" && Object.keys(entries).length > 0;
}

function hasPluginAllowlistWithMaterialEntries(cfg: OpenClawConfig): boolean {
  if (
    !Array.isArray(cfg.plugins?.allow) ||
    cfg.plugins.allow.length === 0 ||
    !hasPluginEntries(cfg)
  ) {
    return false;
  }
  const entries = cfg.plugins?.entries;
  if (!entries || typeof entries !== "object") {
    return false;
  }
  return Object.values(entries).some(hasMaterialPluginEntryConfig);
}

function hasConfiguredProviderModelOrHarness(cfg: OpenClawConfig, env: NodeJS.ProcessEnv): boolean {
>>>>>>> upstream/main
  if (cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) {
    return true;
  }
  if (cfg.models?.providers && Object.keys(cfg.models.providers).length > 0) {
    return true;
  }
<<<<<<< HEAD
  if (collectModelRefs(cfg).length > 0) {
=======
  if (collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false }).length > 0) {
    return true;
  }
  return hasConfiguredEmbeddedHarnessRuntime(cfg, env);
}

function arePluginsGloballyDisabled(cfg: OpenClawConfig): boolean {
  return cfg.plugins?.enabled === false;
}

function configMayNeedPluginManifestRegistry(cfg: OpenClawConfig, env: NodeJS.ProcessEnv): boolean {
  if (arePluginsGloballyDisabled(cfg)) {
    return false;
  }
  if (hasPluginAllowlistWithMaterialEntries(cfg)) {
    return true;
  }
  if (hasConfiguredPluginConfigEntry(cfg)) {
    return true;
  }
  if (hasConfiguredProviderModelOrHarness(cfg, env)) {
    return true;
  }
  if (hasConfiguredWebSearchProviderSelection(cfg)) {
>>>>>>> upstream/main
    return true;
  }
  const configuredChannels = cfg.channels as Record<string, unknown> | undefined;
  if (!configuredChannels || typeof configuredChannels !== "object") {
    return false;
  }
  for (const key of Object.keys(configuredChannels)) {
    if (key === "defaults" || key === "modelByChannel") {
      continue;
    }
<<<<<<< HEAD
    if (!normalizeChatChannelId(key)) {
      return true;
    }
=======
    return true;
>>>>>>> upstream/main
  }
  return false;
}

export function configMayNeedPluginAutoEnable(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv,
): boolean {
<<<<<<< HEAD
  if (hasPotentialConfiguredChannels(cfg, env)) {
    return true;
  }
  if (cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) {
    return true;
  }
  if (cfg.models?.providers && Object.keys(cfg.models.providers).length > 0) {
    return true;
  }
  if (collectModelRefs(cfg).length > 0) {
    return true;
  }
  const web = cfg.tools?.web as Record<string, unknown> | undefined;
  if (
    isRecord(web?.x_search) ||
    hasConfiguredWebSearchPluginEntry(cfg) ||
    hasConfiguredWebFetchPluginEntry(cfg)
  ) {
    return true;
  }
  return (
    resolvePluginSetupAutoEnableReasons({
      config: cfg,
      env,
    }).length > 0
  );
=======
  return resolvePluginAutoEnableReadiness(cfg, env).mayNeedAutoEnable;
}

export function resolvePluginAutoEnableReadiness(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv,
  discovery?: PluginDiscoveryResult,
): { mayNeedAutoEnable: boolean; configuredChannelIds: string[] } {
  if (arePluginsGloballyDisabled(cfg)) {
    return { mayNeedAutoEnable: false, configuredChannelIds: [] };
  }
  if (hasPluginAllowlistWithMaterialEntries(cfg)) {
    return { mayNeedAutoEnable: true, configuredChannelIds: [] };
  }
  if (hasConfiguredPluginConfigEntry(cfg)) {
    return { mayNeedAutoEnable: true, configuredChannelIds: [] };
  }
  const configuredChannelIds = collectConfiguredChannelIds(cfg, env, discovery);
  if (configuredChannelIds.length > 0) {
    return { mayNeedAutoEnable: true, configuredChannelIds };
  }
  if (hasConfiguredProviderModelOrHarness(cfg, env)) {
    return { mayNeedAutoEnable: true, configuredChannelIds };
  }
  if (
    hasConfiguredWebSearchProviderSelection(cfg) ||
    hasConfiguredWebSearchPluginEntry(cfg) ||
    hasConfiguredWebFetchPluginEntry(cfg)
  ) {
    return { mayNeedAutoEnable: true, configuredChannelIds };
  }
  if (!hasSetupAutoEnableRelevantConfig(cfg)) {
    return { mayNeedAutoEnable: false, configuredChannelIds };
  }
  return {
    mayNeedAutoEnable:
      resolvePluginSetupAutoEnableReasons({
        config: cfg,
        env,
        pluginIds: resolveRelevantSetupAutoEnablePluginIds(cfg),
      }).length > 0,
    configuredChannelIds,
  };
>>>>>>> upstream/main
}

export function resolvePluginAutoEnableCandidateReason(
  candidate: PluginAutoEnableCandidate,
): string {
  switch (candidate.kind) {
    case "channel-configured":
      return `${candidate.channelId} configured`;
    case "provider-auth-configured":
      return `${candidate.providerId} auth configured`;
    case "provider-model-configured":
      return `${candidate.modelRef} model configured`;
<<<<<<< HEAD
=======
    case "agent-harness-runtime-configured":
      return `${candidate.runtime} agent runtime configured`;
    case "web-search-provider-selected":
      return `${candidate.providerId} web search provider selected`;
>>>>>>> upstream/main
    case "web-fetch-provider-selected":
      return `${candidate.providerId} web fetch provider selected`;
    case "plugin-web-search-configured":
      return `${candidate.pluginId} web search configured`;
    case "plugin-web-fetch-configured":
      return `${candidate.pluginId} web fetch configured`;
    case "plugin-tool-configured":
      return `${candidate.pluginId} tool configured`;
    case "setup-auto-enable":
      return candidate.reason;
  }
<<<<<<< HEAD
=======
  throw new Error("Unsupported plugin auto-enable candidate");
>>>>>>> upstream/main
}

export function resolveConfiguredPluginAutoEnableCandidates(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  registry: PluginManifestRegistry;
<<<<<<< HEAD
}): PluginAutoEnableCandidate[] {
  const changes: PluginAutoEnableCandidate[] = [];
  const channelToPluginId = buildChannelToPluginIdMap(params.registry);
  for (const channelId of collectCandidateChannelIds(params.config, params.env)) {
    const pluginId = resolvePluginIdForChannel(channelId, channelToPluginId);
    if (isChannelConfigured(params.config, channelId, params.env)) {
=======
  configuredChannelIds?: readonly string[];
}): PluginAutoEnableCandidate[] {
  const changes: PluginAutoEnableCandidate[] = [];
  for (const channelId of params.configuredChannelIds ??
    collectConfiguredChannelIds(params.config, params.env)) {
    for (const pluginId of collectPluginIdsForConfiguredChannel(channelId, params.registry)) {
>>>>>>> upstream/main
      changes.push({ pluginId, kind: "channel-configured", channelId });
    }
  }

  for (const [providerId, pluginId] of Object.entries(
    resolveAutoEnableProviderPluginIds(params.registry),
  )) {
    if (isProviderConfigured(params.config, providerId)) {
      changes.push({ pluginId, kind: "provider-auth-configured", providerId });
    }
  }

<<<<<<< HEAD
  for (const modelRef of collectModelRefs(params.config)) {
=======
  for (const { value: modelRef } of collectConfiguredModelRefs(params.config, {
    includeChannelModelOverrides: false,
  })) {
>>>>>>> upstream/main
    const owningPluginIds = resolveOwningPluginIdsForModelRef({
      model: modelRef,
      config: params.config,
      env: params.env,
      manifestRegistry: params.registry,
    });
    if (owningPluginIds?.length === 1) {
      changes.push({
        pluginId: owningPluginIds[0],
        kind: "provider-model-configured",
        modelRef,
      });
    }
  }

<<<<<<< HEAD
=======
  for (const runtime of collectConfiguredAgentHarnessRuntimes(params.config)) {
    const pluginIds = resolveAgentHarnessOwnerPluginIds(params.registry, runtime);
    for (const pluginId of pluginIds) {
      changes.push({
        pluginId,
        kind: "agent-harness-runtime-configured",
        runtime,
      });
    }
  }

  const webSearchConfig = params.config.tools?.web?.search;
  const webSearchProvider =
    webSearchConfig?.enabled !== false && typeof webSearchConfig?.provider === "string"
      ? webSearchConfig.provider
      : undefined;
  const webSearchPluginId = resolvePluginIdForConfiguredWebSearchProvider(
    webSearchProvider,
    params.registry,
  );
  if (webSearchPluginId) {
    changes.push({
      pluginId: webSearchPluginId,
      kind: "web-search-provider-selected",
      providerId: normalizeOptionalLowercaseString(webSearchProvider) ?? "",
    });
  }

>>>>>>> upstream/main
  const webFetchProvider =
    typeof params.config.tools?.web?.fetch?.provider === "string"
      ? params.config.tools.web.fetch.provider
      : undefined;
  const webFetchPluginId = resolvePluginIdForConfiguredWebFetchProvider(
    webFetchProvider,
<<<<<<< HEAD
    params.env,
=======
    params.registry,
>>>>>>> upstream/main
  );
  if (webFetchPluginId) {
    changes.push({
      pluginId: webFetchPluginId,
      kind: "web-fetch-provider-selected",
<<<<<<< HEAD
      providerId: String(webFetchProvider).trim().toLowerCase(),
    });
  }

  for (const pluginId of resolveProviderPluginsWithOwnedWebSearch(params.registry)) {
    if (hasPluginOwnedWebSearchConfig(params.config, pluginId)) {
      changes.push({ pluginId, kind: "plugin-web-search-configured" });
    }
    if (hasPluginOwnedToolConfig(params.config, pluginId)) {
=======
      providerId: normalizeOptionalLowercaseString(webFetchProvider) ?? "",
    });
  }

  for (const plugin of resolveProviderPluginsWithOwnedWebSearch(params.registry)) {
    const pluginId = plugin.id;
    if (hasPluginOwnedWebSearchConfig(params.config, pluginId)) {
      changes.push({ pluginId, kind: "plugin-web-search-configured" });
    }
  }

  for (const plugin of resolvePluginsWithOwnedToolConfig(params.registry)) {
    const pluginId = plugin.id;
    if (hasPluginOwnedToolConfig(params.config, plugin)) {
>>>>>>> upstream/main
      changes.push({ pluginId, kind: "plugin-tool-configured" });
    }
  }

<<<<<<< HEAD
  for (const pluginId of resolveProviderPluginsWithOwnedWebFetch(params.registry)) {
=======
  for (const plugin of resolveProviderPluginsWithOwnedWebFetch(params.registry)) {
    const pluginId = plugin.id;
>>>>>>> upstream/main
    if (hasPluginOwnedWebFetchConfig(params.config, pluginId)) {
      changes.push({ pluginId, kind: "plugin-web-fetch-configured" });
    }
  }

<<<<<<< HEAD
  for (const entry of resolvePluginSetupAutoEnableReasons({
    config: params.config,
    env: params.env,
  })) {
    changes.push({
      pluginId: entry.pluginId,
      kind: "setup-auto-enable",
      reason: entry.reason,
    });
=======
  if (hasSetupAutoEnableRelevantConfig(params.config)) {
    const manifestMatchedPluginIds = new Set(changes.map((entry) => entry.pluginId));
    const setupPluginIds = resolveRelevantSetupAutoEnablePluginIds(params.config).filter(
      (pluginId) => !manifestMatchedPluginIds.has(pluginId),
    );
    for (const entry of resolvePluginSetupAutoEnableReasons({
      config: params.config,
      env: params.env,
      pluginIds: setupPluginIds,
    })) {
      changes.push({
        pluginId: entry.pluginId,
        kind: "setup-auto-enable",
        reason: entry.reason,
      });
    }
>>>>>>> upstream/main
  }

  return changes;
}

function isPluginExplicitlyDisabled(cfg: OpenClawConfig, pluginId: string): boolean {
  const builtInChannelId = normalizeChatChannelId(pluginId);
  if (builtInChannelId) {
    const channels = cfg.channels as Record<string, unknown> | undefined;
    const channelConfig = channels?.[builtInChannelId];
    if (
      channelConfig &&
      typeof channelConfig === "object" &&
      !Array.isArray(channelConfig) &&
      (channelConfig as { enabled?: unknown }).enabled === false
    ) {
      return true;
    }
  }
  return cfg.plugins?.entries?.[pluginId]?.enabled === false;
}

function isPluginDenied(cfg: OpenClawConfig, pluginId: string): boolean {
  const deny = cfg.plugins?.deny;
  return Array.isArray(deny) && deny.includes(pluginId);
}

<<<<<<< HEAD
=======
function isPluginExplicitlySelected(cfg: OpenClawConfig, pluginId: string): boolean {
  const allow = cfg.plugins?.allow;
  if (Array.isArray(allow) && allow.includes(pluginId)) {
    return true;
  }
  return hasMaterialPluginEntryConfig(cfg.plugins?.entries?.[pluginId]);
}

function disableImplicitPreferredOverPlugin(params: {
  config: OpenClawConfig;
  originalConfig: OpenClawConfig;
  pluginId: string;
  manifestRegistry: PluginManifestRegistry;
}): OpenClawConfig {
  if (isPluginExplicitlySelected(params.originalConfig, params.pluginId)) {
    return params.config;
  }
  if (
    !normalizeChatChannelId(params.pluginId) &&
    !isKnownPluginId(params.pluginId, params.manifestRegistry)
  ) {
    return params.config;
  }
  const existingEntry = params.config.plugins?.entries?.[params.pluginId];
  return {
    ...params.config,
    plugins: {
      ...params.config.plugins,
      entries: {
        ...params.config.plugins?.entries,
        [params.pluginId]: {
          ...(existingEntry && typeof existingEntry === "object" ? existingEntry : {}),
          enabled: false,
        },
      },
    },
  };
}

>>>>>>> upstream/main
function isBuiltInChannelAlreadyEnabled(cfg: OpenClawConfig, channelId: string): boolean {
  const channels = cfg.channels as Record<string, unknown> | undefined;
  const channelConfig = channels?.[channelId];
  return (
<<<<<<< HEAD
    !!channelConfig &&
=======
    Boolean(channelConfig) &&
>>>>>>> upstream/main
    typeof channelConfig === "object" &&
    !Array.isArray(channelConfig) &&
    (channelConfig as { enabled?: unknown }).enabled === true
  );
}

<<<<<<< HEAD
function registerPluginEntry(cfg: OpenClawConfig, pluginId: string): OpenClawConfig {
  const builtInChannelId = normalizeChatChannelId(pluginId);
=======
function resolveAutoEnableChannelId(params: {
  entry: PluginAutoEnableCandidate;
  manifestRegistry: PluginManifestRegistry;
}): string | null {
  const builtInChannelId = normalizeChatChannelId(params.entry.pluginId);
  if (builtInChannelId) {
    return builtInChannelId;
  }
  if (params.entry.kind !== "channel-configured") {
    return null;
  }
  const plugin = params.manifestRegistry.plugins.find(
    (record) => record.id === params.entry.pluginId,
  );
  if (plugin?.origin !== "bundled") {
    return null;
  }
  const channelId = normalizeManifestChannelId(params.entry.channelId);
  return (plugin.channels ?? []).some((id) => normalizeManifestChannelId(id) === channelId)
    ? channelId
    : null;
}

function registerPluginEntry(
  cfg: OpenClawConfig,
  entry: PluginAutoEnableCandidate,
  manifestRegistry: PluginManifestRegistry,
): OpenClawConfig {
  const builtInChannelId = resolveAutoEnableChannelId({ entry, manifestRegistry });
>>>>>>> upstream/main
  if (builtInChannelId) {
    const channels = cfg.channels as Record<string, unknown> | undefined;
    const existing = channels?.[builtInChannelId];
    const existingRecord =
      existing && typeof existing === "object" && !Array.isArray(existing)
        ? (existing as Record<string, unknown>)
        : {};
    return {
      ...cfg,
      channels: {
        ...cfg.channels,
        [builtInChannelId]: {
          ...existingRecord,
          enabled: true,
        },
      },
    };
  }

  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      entries: {
        ...cfg.plugins?.entries,
<<<<<<< HEAD
        [pluginId]: {
          ...(cfg.plugins?.entries?.[pluginId] as Record<string, unknown> | undefined),
=======
        [entry.pluginId]: {
          ...(cfg.plugins?.entries?.[entry.pluginId] as Record<string, unknown> | undefined),
>>>>>>> upstream/main
          enabled: true,
        },
      },
    },
  };
}

<<<<<<< HEAD
function formatAutoEnableChange(entry: PluginAutoEnableCandidate): string {
  let reason = resolvePluginAutoEnableCandidateReason(entry).trim();
  const channelId = normalizeChatChannelId(entry.pluginId);
  if (channelId) {
    const label = getChatChannelMeta(channelId).label;
    reason = reason.replace(new RegExp(`^${channelId}\\b`, "i"), label);
  }
  return `${reason}, enabled automatically.`;
=======
function hasMaterialPluginEntryConfig(entry: unknown): boolean {
  if (!isRecord(entry)) {
    return false;
  }
  return (
    entry.enabled === true ||
    isRecord(entry.config) ||
    isRecord(entry.hooks) ||
    isRecord(entry.subagent) ||
    isRecord(entry.llm) ||
    entry.apiKey !== undefined ||
    entry.env !== undefined
  );
}

function isKnownPluginId(pluginId: string, manifestRegistry: PluginManifestRegistry): boolean {
  if (normalizeChatChannelId(pluginId)) {
    return true;
  }
  return manifestRegistry.plugins.some((plugin) => plugin.id === pluginId);
}

function materializeConfiguredPluginEntryAllowlist(params: {
  config: OpenClawConfig;
  changes: string[];
  manifestRegistry: PluginManifestRegistry;
}): OpenClawConfig {
  let next = params.config;
  const allow = next.plugins?.allow;
  const entries = next.plugins?.entries;
  if (!Array.isArray(allow) || allow.length === 0 || !entries || typeof entries !== "object") {
    return next;
  }

  for (const pluginId of Object.keys(entries).toSorted((left, right) =>
    left.localeCompare(right),
  )) {
    const entry = entries[pluginId];
    if (
      !hasMaterialPluginEntryConfig(entry) ||
      isPluginDenied(next, pluginId) ||
      isPluginExplicitlyDisabled(next, pluginId) ||
      allow.includes(pluginId) ||
      !isKnownPluginId(pluginId, params.manifestRegistry)
    ) {
      continue;
    }
    next = ensurePluginAllowlisted(next, pluginId);
    params.changes.push(`${pluginId} plugin config present, added to plugin allowlist.`);
  }

  return next;
}

function resolveChannelAutoEnableDisplayLabel(
  entry: Extract<PluginAutoEnableCandidate, { kind: "channel-configured" }>,
  manifestRegistry: PluginManifestRegistry,
): string | undefined {
  const builtInChannelId = normalizeChatChannelId(entry.channelId);
  const plugin = manifestRegistry.plugins.find((record) => record.id === entry.pluginId);
  return (
    (builtInChannelId ? getChatChannelMeta(builtInChannelId)?.label : undefined) ??
    plugin?.channelConfigs?.[entry.channelId]?.label ??
    plugin?.channelCatalogMeta?.label
  );
}

function formatAutoEnableChange(
  entry: PluginAutoEnableCandidate,
  manifestRegistry: PluginManifestRegistry,
): string {
  if (entry.kind === "channel-configured") {
    const label = resolveChannelAutoEnableDisplayLabel(entry, manifestRegistry);
    if (label) {
      return `${label} configured, enabled automatically.`;
    }
  }
  return `${resolvePluginAutoEnableCandidateReason(entry).trim()}, enabled automatically.`;
>>>>>>> upstream/main
}

export function resolvePluginAutoEnableManifestRegistry(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  manifestRegistry?: PluginManifestRegistry;
}): PluginManifestRegistry {
<<<<<<< HEAD
  return (
    params.manifestRegistry ??
    (configMayNeedPluginManifestRegistry(params.config)
      ? loadPluginManifestRegistry({ config: params.config, env: params.env })
      : EMPTY_PLUGIN_MANIFEST_REGISTRY)
=======
  if (params.manifestRegistry) {
    return params.manifestRegistry;
  }
  if (!configMayNeedPluginManifestRegistry(params.config, params.env)) {
    return EMPTY_PLUGIN_MANIFEST_REGISTRY;
  }
  const currentSnapshot = getCurrentPluginMetadataSnapshot({
    config: params.config,
    env: params.env,
    allowWorkspaceScopedSnapshot: true,
  });
  const policyCompatibleCurrentSnapshot =
    currentSnapshot ??
    (() => {
      if (!canReuseUnscopedCurrentPluginMetadataSnapshot(params.config)) {
        return undefined;
      }
      const snapshot = getCurrentPluginMetadataSnapshot({
        env: params.env,
        allowWorkspaceScopedSnapshot: true,
        requireDefaultDiscoveryContext: true,
      });
      return snapshot?.policyHash === resolveInstalledPluginIndexPolicyHash(params.config)
        ? snapshot
        : undefined;
    })();
  return (
    policyCompatibleCurrentSnapshot?.manifestRegistry ??
    loadPluginMetadataSnapshot({
      config: params.config,
      env: params.env,
    }).manifestRegistry
>>>>>>> upstream/main
  );
}

export function materializePluginAutoEnableCandidatesInternal(params: {
  config?: OpenClawConfig;
  candidates: readonly PluginAutoEnableCandidate[];
  env: NodeJS.ProcessEnv;
  manifestRegistry: PluginManifestRegistry;
}): PluginAutoEnableResult {
  let next = params.config ?? {};
  const changes: string[] = [];
  const autoEnabledReasons = new Map<string, string[]>();

  if (next.plugins?.enabled === false) {
    return { config: next, changes, autoEnabledReasons: {} };
  }

<<<<<<< HEAD
  for (const entry of params.candidates) {
    const builtInChannelId = normalizeChatChannelId(entry.pluginId);
=======
  const preferOverCache = new Map<string, string[]>();

  for (const entry of params.candidates) {
    const builtInChannelId = resolveAutoEnableChannelId({
      entry,
      manifestRegistry: params.manifestRegistry,
    });
>>>>>>> upstream/main
    if (isPluginDenied(next, entry.pluginId) || isPluginExplicitlyDisabled(next, entry.pluginId)) {
      continue;
    }
    if (
      shouldSkipPreferredPluginAutoEnable({
        config: next,
        entry,
        configured: params.candidates,
        env: params.env,
        registry: params.manifestRegistry,
        isPluginDenied,
        isPluginExplicitlyDisabled,
<<<<<<< HEAD
      })
    ) {
=======
        preferOverCache,
      })
    ) {
      next = disableImplicitPreferredOverPlugin({
        config: next,
        originalConfig: params.config ?? {},
        pluginId: entry.pluginId,
        manifestRegistry: params.manifestRegistry,
      });
>>>>>>> upstream/main
      continue;
    }

    const allow = next.plugins?.allow;
<<<<<<< HEAD
    const allowMissing =
      builtInChannelId == null && Array.isArray(allow) && !allow.includes(entry.pluginId);
=======
    const hasRestrictiveAllowlist = Array.isArray(allow) && allow.length > 0;
    const allowMissing = hasRestrictiveAllowlist && !allow.includes(entry.pluginId);
>>>>>>> upstream/main
    const alreadyEnabled =
      builtInChannelId != null
        ? isBuiltInChannelAlreadyEnabled(next, builtInChannelId)
        : next.plugins?.entries?.[entry.pluginId]?.enabled === true;
    if (alreadyEnabled && !allowMissing) {
      continue;
    }

<<<<<<< HEAD
    next = registerPluginEntry(next, entry.pluginId);
    if (!builtInChannelId) {
=======
    next = registerPluginEntry(next, entry, params.manifestRegistry);
    if (hasRestrictiveAllowlist) {
>>>>>>> upstream/main
      next = ensurePluginAllowlisted(next, entry.pluginId);
    }
    const reason = resolvePluginAutoEnableCandidateReason(entry);
    autoEnabledReasons.set(entry.pluginId, [
      ...(autoEnabledReasons.get(entry.pluginId) ?? []),
      reason,
    ]);
<<<<<<< HEAD
    changes.push(formatAutoEnableChange(entry));
  }

=======
    changes.push(formatAutoEnableChange(entry, params.manifestRegistry));
  }

  next = materializeConfiguredPluginEntryAllowlist({
    config: next,
    changes,
    manifestRegistry: params.manifestRegistry,
  });

>>>>>>> upstream/main
  const autoEnabledReasonRecord: Record<string, string[]> = Object.create(null);
  for (const [pluginId, reasons] of autoEnabledReasons) {
    if (!isBlockedObjectKey(pluginId)) {
      autoEnabledReasonRecord[pluginId] = [...reasons];
    }
  }

  return { config: next, changes, autoEnabledReasons: autoEnabledReasonRecord };
}
