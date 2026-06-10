<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { normalizePluginsConfig, resolveEnableState } from "../plugins/config-state.js";
import type { PluginOrigin } from "../plugins/types.js";
=======
/** Collects plugin config secret refs from runtime plugin metadata. */
import { normalizeStringEntries } from "@openclaw/normalization-core/string-normalization";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  collectPluginConfigContractMatches,
  resolvePluginConfigContractsById,
} from "../plugins/config-contracts.js";
import { normalizePluginsConfig, resolveEnableState } from "../plugins/config-state.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import { parseConfigPathArrayIndex } from "../shared/path-array-index.js";
>>>>>>> upstream/main
import {
  collectSecretInputAssignment,
  type ResolverContext,
  type SecretDefaults,
} from "./runtime-shared.js";
import { isRecord } from "./shared.js";

<<<<<<< HEAD
const ACPX_PLUGIN_ID = "acpx";
const ACPX_ENABLED_BY_DEFAULT = false;

/**
 * Walk plugin config entries and collect SecretRef assignments for MCP server
 * env vars. Without this, SecretRefs in paths like
 * `plugins.entries.acpx.config.mcpServers.*.env.*` are never resolved and
 * remain as raw objects at runtime.
 *
 * This surface is intentionally scoped to ACPX. Third-party plugins may define
 * their own `mcpServers`-shaped config, but that is not a documented SecretRef
 * surface and should not be rewritten here.
=======
function parsePluginConfigArrayIndex(segment: string): number | undefined {
  return parseConfigPathArrayIndex(segment);
}

/**
 * Walk manifest-declared plugin config SecretRef surfaces and collect
 * assignments for runtime materialization. Plugin-owned metadata controls which
 * config paths support SecretRefs and whether bundled plugins stay inactive on
 * that surface until explicitly enabled.
>>>>>>> upstream/main
 *
 * When `loadablePluginOrigins` is provided, entries whose ID is not in the map
 * are treated as inactive (stale config entries for plugins that are no longer
 * installed). This prevents resolution failures for SecretRefs belonging to
 * non-loadable plugins from blocking startup or preflight validation.
 */
<<<<<<< HEAD
export function collectPluginConfigAssignments(params: {
  config: OpenClawConfig;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
=======
/** Collects SecretRef assignments from plugin-owned config contract paths. */
export function collectPluginConfigAssignments(params: {
  /** Mutable config snapshot whose plugin config values will receive resolved secrets. */
  config: OpenClawConfig;
  /** Defaults from the source config, used while matching manifest-declared SecretInput paths. */
  defaults: SecretDefaults | undefined;
  /** Resolver context that receives assignments and inactive-surface warnings. */
  context: ResolverContext;
  /** Optional installed plugin roots; missing IDs are treated as stale inactive config. */
>>>>>>> upstream/main
  loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): void {
  const entries = params.config.plugins?.entries;
  if (!isRecord(entries)) {
    return;
  }

  const normalizedConfig = normalizePluginsConfig(params.config.plugins);
<<<<<<< HEAD

  for (const [pluginId, entry] of Object.entries(entries)) {
    if (pluginId !== ACPX_PLUGIN_ID) {
=======
  const workspaceDir = resolveAgentWorkspaceDir(
    params.config,
    resolveDefaultAgentId(params.config),
  );
  const bundledLoadablePluginIds = [...(params.loadablePluginOrigins?.entries() ?? [])]
    .filter(([, origin]) => origin === "bundled")
    .map(([pluginId]) => pluginId);
  const pluginSecretInputs = new Map(
    [
      ...resolvePluginConfigContractsById({
        config: params.config,
        workspaceDir,
        env: params.context.env,
        fallbackToBundledMetadata: true,
        fallbackToBundledMetadataForResolvedBundled: true,
        fallbackBundledPluginIds: bundledLoadablePluginIds,
        pluginIds: Object.keys(entries),
      }).entries(),
    ].flatMap(([pluginId, metadata]) => {
      const secretInputs = metadata.configContracts.secretInputs;
      if (!secretInputs?.paths.length) {
        return [];
      }
      return [
        [
          pluginId,
          {
            origin: metadata.origin,
            bundledDefaultEnabled: secretInputs.bundledDefaultEnabled,
            paths: secretInputs.paths,
          },
        ] as const,
      ];
    }),
  );

  for (const [pluginId, entry] of Object.entries(entries)) {
    const secretInputs = pluginSecretInputs.get(pluginId);
    if (!secretInputs) {
>>>>>>> upstream/main
      continue;
    }
    if (!isRecord(entry)) {
      continue;
    }
    const pluginConfig = entry.config;
    if (!isRecord(pluginConfig)) {
      continue;
    }

    const pluginOrigin = params.loadablePluginOrigins?.get(pluginId);
    if (params.loadablePluginOrigins && !pluginOrigin) {
<<<<<<< HEAD
      collectMcpServerEnvAssignments({
        pluginId,
        pluginConfig,
=======
      collectConfiguredPluginSecretAssignments({
        pluginId,
        pluginConfig,
        secretPaths: secretInputs.paths,
>>>>>>> upstream/main
        active: false,
        inactiveReason: "plugin is not loadable (stale config entry).",
        defaults: params.defaults,
        context: params.context,
      });
      continue;
    }

<<<<<<< HEAD
    const enableState = resolveEnableState(
      pluginId,
      pluginOrigin ?? "config",
      normalizedConfig,
      pluginId === ACPX_PLUGIN_ID && pluginOrigin === "bundled"
        ? ACPX_ENABLED_BY_DEFAULT
        : undefined,
    );
    collectMcpServerEnvAssignments({
      pluginId,
      pluginConfig,
=======
    const resolvedOrigin = pluginOrigin ?? secretInputs.origin;
    const enableState = resolveEnableState(
      pluginId,
      resolvedOrigin,
      normalizedConfig,
      resolvedOrigin === "bundled" ? secretInputs.bundledDefaultEnabled : undefined,
    );
    collectConfiguredPluginSecretAssignments({
      pluginId,
      pluginConfig,
      secretPaths: secretInputs.paths,
>>>>>>> upstream/main
      active: enableState.enabled,
      inactiveReason: enableState.reason ?? "plugin is disabled.",
      defaults: params.defaults,
      context: params.context,
    });
  }
}

<<<<<<< HEAD
function collectMcpServerEnvAssignments(params: {
  pluginId: string;
  pluginConfig: Record<string, unknown>;
=======
function collectConfiguredPluginSecretAssignments(params: {
  pluginId: string;
  pluginConfig: Record<string, unknown>;
  secretPaths: ReadonlyArray<{ path: string; expected?: "string" }>;
>>>>>>> upstream/main
  active: boolean;
  inactiveReason: string;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
}): void {
<<<<<<< HEAD
  const mcpServers = params.pluginConfig.mcpServers;
  if (!isRecord(mcpServers)) {
    return;
  }

  for (const [serverName, serverConfig] of Object.entries(mcpServers)) {
    if (!isRecord(serverConfig)) {
      continue;
    }
    const env = serverConfig.env;
    if (!isRecord(env)) {
      continue;
    }

    for (const [envKey, envValue] of Object.entries(env)) {
=======
  const seenPaths = new Set<string>();
  for (const secretPath of params.secretPaths) {
    for (const match of collectPluginConfigContractMatches({
      root: params.pluginConfig,
      pathPattern: secretPath.path,
    })) {
      const fullPath = `plugins.entries.${params.pluginId}.config.${match.path}`;
      if (seenPaths.has(fullPath)) {
        continue;
      }
      seenPaths.add(fullPath);

>>>>>>> upstream/main
      // SecretInput allows both explicit objects and inline env-template refs
      // like `${MCP_API_KEY}`. Non-ref strings remain untouched because
      // collectSecretInputAssignment ignores them.
      collectSecretInputAssignment({
<<<<<<< HEAD
        value: envValue,
        path: `plugins.entries.${params.pluginId}.config.mcpServers.${serverName}.env.${envKey}`,
        expected: "string",
=======
        value: match.value,
        path: fullPath,
        expected: secretPath.expected ?? "string",
>>>>>>> upstream/main
        defaults: params.defaults,
        context: params.context,
        active: params.active,
        inactiveReason: `plugin "${params.pluginId}": ${params.inactiveReason}`,
<<<<<<< HEAD
        apply: (value) => {
          env[envKey] = value;
        },
=======
        apply: createPluginConfigAssignmentApply(params.pluginConfig, match.path),
>>>>>>> upstream/main
      });
    }
  }
}
<<<<<<< HEAD
=======

function createPluginConfigAssignmentApply(
  pluginConfig: Record<string, unknown>,
  relativePath: string,
): (value: unknown) => void {
  return (value) => {
    // Manifest paths use dotted/bracket notation; assignment writes need concrete object/array steps.
    const segments = normalizeStringEntries(relativePath.replace(/\[(\d+)\]/g, ".$1").split("."));
    if (segments.length === 0) {
      return;
    }
    let current: unknown = pluginConfig;
    for (const segment of segments.slice(0, -1)) {
      if (Array.isArray(current)) {
        const index = parsePluginConfigArrayIndex(segment);
        current = index !== undefined && index < current.length ? current[index] : undefined;
        continue;
      }
      current = isRecord(current) ? current[segment] : undefined;
    }
    const finalSegment = segments.at(-1);
    if (!finalSegment) {
      return;
    }
    if (Array.isArray(current)) {
      const index = parsePluginConfigArrayIndex(finalSegment);
      if (index !== undefined && index < current.length) {
        current[index] = value;
      }
      return;
    }
    if (isRecord(current)) {
      current[finalSegment] = value;
    }
  };
}
>>>>>>> upstream/main
