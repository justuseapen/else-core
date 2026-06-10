/** Builds web-tool secret metadata from config, plugins, and provider contracts. */
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { sortUniqueStrings } from "@openclaw/normalization-core/string-normalization";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveSecretInputRef } from "../config/types.secrets.js";
<<<<<<< HEAD
import {
  resolveManifestContractOwnerPluginId,
  resolveManifestContractPluginIds,
} from "../plugins/manifest-registry.js";
=======
import { loadInstalledPluginIndexInstallRecordsSync } from "../plugins/installed-plugin-index-records.js";
>>>>>>> upstream/main
import type {
  PluginWebFetchProviderEntry,
  PluginWebSearchProviderEntry,
  WebFetchCredentialResolutionSource,
  WebSearchCredentialResolutionSource,
} from "../plugins/types.js";
<<<<<<< HEAD
import { resolvePluginWebFetchProviders } from "../plugins/web-fetch-providers.runtime.js";
import { sortWebFetchProvidersForAutoDetect } from "../plugins/web-fetch-providers.shared.js";
import { resolvePluginWebSearchProviders } from "../plugins/web-search-providers.runtime.js";
=======
import { sortWebFetchProvidersForAutoDetect } from "../plugins/web-fetch-providers.shared.js";
import {
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
} from "../plugins/web-provider-public-artifacts.explicit.js";
>>>>>>> upstream/main
import { sortWebSearchProvidersForAutoDetect } from "../plugins/web-search-providers.shared.js";
import { createLazyRuntimeSurface } from "../shared/lazy-runtime.js";
import { normalizeSecretInput } from "../utils/normalize-secret-input.js";
import { secretRefKey } from "./ref-contract.js";
import { resolveSecretRefValues } from "./resolve.js";
import { hasCredentialBearingObjectValue } from "./runtime-secret-scan.js";
import type { ResolverContext, SecretDefaults } from "./runtime-shared.js";
import {
  ensureObject,
  hasConfiguredSecretRef,
  isRecord,
  resolveRuntimeWebProviderSurface,
  resolveRuntimeWebProviderSelection,
  type SecretResolutionResult,
} from "./runtime-web-tools.shared.js";
import type {
  RuntimeWebDiagnostic,
  RuntimeWebDiagnosticCode,
  RuntimeWebFetchMetadata,
  RuntimeWebSearchMetadata,
  RuntimeWebToolsMetadata,
} from "./runtime-web-tools.types.js";

<<<<<<< HEAD
type WebSearchProvider = string;
type WebFetchProvider = string;

=======
>>>>>>> upstream/main
export type {
  RuntimeWebDiagnostic,
  RuntimeWebDiagnosticCode,
  RuntimeWebFetchMetadata,
  RuntimeWebSearchMetadata,
  RuntimeWebToolsMetadata,
};

const loadRuntimeWebToolsFallbackProviders = createLazyRuntimeSurface(
  () => import("./runtime-web-tools-fallback.runtime.js"),
  ({ runtimeWebToolsFallbackProviders }) => runtimeWebToolsFallbackProviders,
);
const loadRuntimeWebToolsPublicArtifacts = createLazyRuntimeSurface(
  () => import("./runtime-web-tools-public-artifacts.runtime.js"),
  (mod) => mod,
);
const loadRuntimeWebToolsManifest = createLazyRuntimeSurface(
  () => import("./runtime-web-tools-manifest.runtime.js"),
  (mod) => mod,
);

type FetchConfig = NonNullable<OpenClawConfig["tools"]>["web"] extends infer Web
  ? Web extends { fetch?: infer Fetch }
    ? Fetch
    : undefined
  : undefined;

<<<<<<< HEAD
type SecretResolutionResult = {
  value?: string;
  source: WebSearchCredentialResolutionSource | WebFetchCredentialResolutionSource;
  secretRefConfigured: boolean;
  unresolvedRefReason?: string;
  fallbackEnvVar?: string;
  fallbackUsedAfterRefFailure: boolean;
};
=======
type SecretResolutionSource =
  | WebSearchCredentialResolutionSource
  | WebFetchCredentialResolutionSource;
>>>>>>> upstream/main

function needsRuntimeWebFetchProviderDiscovery(params: {
  fetch: FetchConfig;
  rawProvider: string;
  hasPluginWebFetchConfig: boolean;
  defaults: SecretDefaults | undefined;
}): boolean {
  if (isRecord(params.fetch) && params.fetch.enabled === false) {
    return false;
  }
  if (params.hasPluginWebFetchConfig) {
    return true;
  }
  if (!isRecord(params.fetch)) {
    return false;
  }
  if (params.rawProvider) {
    return true;
  }
  // Limits-only fetch config must stay on the runtime fast path; credential-shaped values are
  // the signal that provider discovery and SecretRef resolution are actually needed.
  return hasCredentialBearingObjectValue(params.fetch, params.defaults);
}

function hasPluginScopedWebToolConfig(
  config: OpenClawConfig,
  key: "webSearch" | "webFetch",
): boolean {
  const entries = config.plugins?.entries;
  if (!entries) {
    return false;
  }
  return Object.values(entries).some((entry) => {
    if (!isRecord(entry)) {
      return false;
    }
    const pluginConfig = isRecord(entry.config) ? entry.config : undefined;
    return Boolean(pluginConfig?.[key]);
  });
}

function inferSingleBundledPluginScopedWebToolConfigOwner(
  config: OpenClawConfig,
  key: "webSearch" | "webFetch",
): string | undefined {
  const entries = config.plugins?.entries;
  if (!entries) {
    return undefined;
  }
  const matches: string[] = [];
  for (const [pluginId, entry] of Object.entries(entries)) {
    if (!isRecord(entry) || entry.enabled === false) {
      continue;
    }
    const pluginConfig = isRecord(entry.config) ? entry.config : undefined;
    if (!isRecord(pluginConfig?.[key])) {
      continue;
    }
    matches.push(pluginId);
    if (matches.length > 1) {
      return undefined;
    }
  }
  return matches[0];
}

<<<<<<< HEAD
function normalizeFetchProvider(
  value: unknown,
  providers: PluginWebFetchProviderEntry[],
): WebFetchProvider | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (providers.some((provider) => provider.id === normalized)) {
    return normalized;
  }
  return undefined;
}

function hasCustomWebSearchPluginRisk(config: OpenClawConfig): boolean {
  const plugins = config.plugins;
=======
function inferExactBundledPluginScopedWebToolConfigOwner(params: {
  config: OpenClawConfig;
  key: "webSearch" | "webFetch";
  pluginId: string;
}): string | undefined {
  const entry = params.config.plugins?.entries?.[params.pluginId];
  if (!isRecord(entry) || entry.enabled === false) {
    return undefined;
  }
  const pluginConfig = isRecord(entry.config) ? entry.config : undefined;
  return isRecord(pluginConfig?.[params.key]) ? params.pluginId : undefined;
}

type WebProviderContract = "webSearchProviders" | "webFetchProviders";

async function hasCustomWebProviderPluginRisk(params: {
  contract: WebProviderContract;
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
}): Promise<boolean> {
  const installRecords = loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
  if (Object.keys(installRecords).length > 0) {
    return true;
  }

  const plugins = params.config.plugins;
>>>>>>> upstream/main
  if (!plugins) {
    return false;
  }
  if (Array.isArray(plugins.load?.paths) && plugins.load.paths.length > 0) {
    return true;
  }
<<<<<<< HEAD
  if (plugins.installs && Object.keys(plugins.installs).length > 0) {
    return true;
  }

  const bundledPluginIds = new Set<string>(
    resolveManifestContractPluginIds({
      contract: "webSearchProviders",
      origin: "bundled",
      config,
      env: process.env,
    }),
  );
=======
  const { resolveManifestContractPluginIds } = await loadRuntimeWebToolsManifest();
  const bundledPluginIds = new Set<string>(
    resolveManifestContractPluginIds({
      contract: params.contract,
      origin: "bundled",
      config: params.config,
      env: params.env,
    }),
  );
  // Public artifacts are complete only for bundled providers. Any configured non-bundled
  // plugin surface has to fall back to manifest/runtime discovery to avoid hiding providers.
>>>>>>> upstream/main
  const hasNonBundledPluginId = (pluginId: string) => !bundledPluginIds.has(pluginId.trim());
  if (Array.isArray(plugins.allow) && plugins.allow.some(hasNonBundledPluginId)) {
    return true;
  }
  if (Array.isArray(plugins.deny) && plugins.deny.some(hasNonBundledPluginId)) {
    return true;
  }
  if (plugins.entries && Object.keys(plugins.entries).some(hasNonBundledPluginId)) {
    return true;
  }

  return false;
}

function readNonEmptyEnvValue(
  env: NodeJS.ProcessEnv,
  names: string[],
): { value?: string; envVar?: string } {
  for (const envVar of names) {
    const value = normalizeSecretInput(env[envVar]);
    if (value) {
      return { value, envVar };
    }
  }
  return {};
}

function buildUnresolvedReason(params: {
  path: string;
  kind: "unresolved" | "non-string" | "empty";
  refLabel: string;
}): string {
  if (params.kind === "non-string") {
    return `${params.path} SecretRef resolved to a non-string value.`;
  }
  if (params.kind === "empty") {
    return `${params.path} SecretRef resolved to an empty value.`;
  }
  return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
}

async function resolveSecretInputWithEnvFallback(params: {
  sourceConfig: OpenClawConfig;
  context: ResolverContext;
  defaults: SecretDefaults | undefined;
  value: unknown;
  path: string;
  envVars: string[];
  restrictEnvRefsToEnvVars?: boolean;
<<<<<<< HEAD
}): Promise<SecretResolutionResult> {
=======
}): Promise<SecretResolutionResult<SecretResolutionSource>> {
>>>>>>> upstream/main
  const { ref } = resolveSecretInputRef({
    value: params.value,
    defaults: params.defaults,
  });

  if (!ref) {
    const configValue = normalizeSecretInput(params.value);
    if (configValue) {
      return {
        value: configValue,
        source: "config",
        secretRefConfigured: false,
        fallbackUsedAfterRefFailure: false,
      };
    }
    const fallback = readNonEmptyEnvValue(params.context.env, params.envVars);
    if (fallback.value) {
      return {
        value: fallback.value,
        source: "env",
        fallbackEnvVar: fallback.envVar,
        secretRefConfigured: false,
        fallbackUsedAfterRefFailure: false,
      };
    }
    return {
      source: "missing",
      secretRefConfigured: false,
      fallbackUsedAfterRefFailure: false,
    };
  }

  const refLabel = `${ref.source}:${ref.provider}:${ref.id}`;
  let resolvedFromRef: string | undefined;
  let unresolvedRefReason: string | undefined;

  if (
    params.restrictEnvRefsToEnvVars === true &&
    ref.source === "env" &&
    !params.envVars.includes(ref.id)
  ) {
    unresolvedRefReason = `${params.path} SecretRef env var "${ref.id}" is not allowed.`;
  } else {
    try {
      const resolved = await resolveSecretRefValues([ref], {
        config: params.sourceConfig,
        env: params.context.env,
        cache: params.context.cache,
<<<<<<< HEAD
=======
        manifestRegistry: params.context.manifestRegistry,
>>>>>>> upstream/main
      });
      const resolvedValue = resolved.get(secretRefKey(ref));
      if (typeof resolvedValue !== "string") {
        unresolvedRefReason = buildUnresolvedReason({
          path: params.path,
          kind: "non-string",
          refLabel,
        });
      } else {
        resolvedFromRef = normalizeSecretInput(resolvedValue);
        if (!resolvedFromRef) {
          unresolvedRefReason = buildUnresolvedReason({
            path: params.path,
            kind: "empty",
            refLabel,
          });
        }
      }
    } catch {
      unresolvedRefReason = buildUnresolvedReason({
        path: params.path,
        kind: "unresolved",
        refLabel,
      });
    }
  }

  if (resolvedFromRef) {
    return {
      value: resolvedFromRef,
      source: "secretRef",
      secretRefConfigured: true,
      fallbackUsedAfterRefFailure: false,
    };
  }

  const fallback = readNonEmptyEnvValue(params.context.env, params.envVars);
  if (fallback.value) {
    // Provider env vars remain the explicit recovery path for unresolved refs so startup can
    // continue while diagnostics still report which configured SecretRef failed.
    return {
      value: fallback.value,
      source: "env",
      fallbackEnvVar: fallback.envVar,
      unresolvedRefReason,
      secretRefConfigured: true,
      fallbackUsedAfterRefFailure: true,
    };
  }

  return {
    source: "missing",
    unresolvedRefReason,
    secretRefConfigured: true,
    fallbackUsedAfterRefFailure: false,
  };
}

function setResolvedWebSearchApiKey(params: {
  resolvedConfig: OpenClawConfig;
  provider: PluginWebSearchProviderEntry;
  value: string;
}): void {
  if (params.provider.setConfiguredCredentialValue) {
    params.provider.setConfiguredCredentialValue(params.resolvedConfig, params.value);
    return;
  }
  const tools = ensureObject(params.resolvedConfig as Record<string, unknown>, "tools");
  const web = ensureObject(tools, "web");
  const search = ensureObject(web, "search");
<<<<<<< HEAD
  if (params.provider.setConfiguredCredentialValue) {
    params.provider.setConfiguredCredentialValue(params.resolvedConfig, params.value);
    if (params.provider.id !== "brave") {
      return;
    }
  }
  params.provider.setCredentialValue(search, params.value);
}

function keyPathForProvider(provider: PluginWebSearchProviderEntry): string {
  return provider.credentialPath;
=======
  params.provider.setCredentialValue(search, params.value);
}

async function resolveBundledWebSearchProviders(params: {
  sourceConfig: OpenClawConfig;
  context: ResolverContext;
  configuredBundledPluginId?: string;
  onlyPluginIds?: readonly string[];
  hasCustomWebSearchPluginRisk: boolean;
}): Promise<PluginWebSearchProviderEntry[]> {
  const env = { ...process.env, ...params.context.env };
  const onlyPluginIds =
    params.configuredBundledPluginId !== undefined
      ? [params.configuredBundledPluginId]
      : params.onlyPluginIds && params.onlyPluginIds.length > 0
        ? sortUniqueStrings(params.onlyPluginIds)
        : undefined;
  // Narrow plugin hints can use explicit public artifacts first; broad custom-plugin risk still
  // routes through runtime discovery because installed or path-loaded providers may participate.
  if (onlyPluginIds && onlyPluginIds.length > 0) {
    const bundled = resolveBundledExplicitWebSearchProvidersFromPublicArtifacts({ onlyPluginIds });
    if (bundled && bundled.length > 0) {
      return bundled;
    }
    const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
    return resolvePluginWebSearchProviders({
      config: params.sourceConfig,
      env,
      onlyPluginIds,
      origin: "bundled",
    });
  }
  if (!params.hasCustomWebSearchPluginRisk) {
    const { resolveBundledWebSearchProvidersFromPublicArtifacts } =
      await loadRuntimeWebToolsPublicArtifacts();
    const bundled = resolveBundledWebSearchProvidersFromPublicArtifacts({
      config: params.sourceConfig,
      env,
    });
    if (bundled && bundled.length > 0) {
      return bundled;
    }
    const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
    return resolvePluginWebSearchProviders({
      config: params.sourceConfig,
      env,
      origin: "bundled",
    });
  }
  const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
  return resolvePluginWebSearchProviders({
    config: params.sourceConfig,
    env,
  });
}

async function resolveBundledWebFetchProviders(params: {
  sourceConfig: OpenClawConfig;
  context: ResolverContext;
  configuredBundledPluginId?: string;
  hasCustomWebFetchPluginRisk: boolean;
}): Promise<PluginWebFetchProviderEntry[]> {
  const env = { ...process.env, ...params.context.env };
  // Web fetch has no keyless auto-detect fallback; a configured bundled owner can be resolved
  // directly without loading every provider manifest.
  if (params.configuredBundledPluginId) {
    const bundled = resolveBundledExplicitWebFetchProvidersFromPublicArtifacts({
      onlyPluginIds: [params.configuredBundledPluginId],
    });
    if (bundled && bundled.length > 0) {
      return bundled;
    }
    const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
    return resolvePluginWebFetchProviders({
      config: params.sourceConfig,
      env,
      onlyPluginIds: [params.configuredBundledPluginId],
      origin: "bundled",
    });
  }
  if (!params.hasCustomWebFetchPluginRisk) {
    const { resolveBundledWebFetchProvidersFromPublicArtifacts } =
      await loadRuntimeWebToolsPublicArtifacts();
    const bundled = resolveBundledWebFetchProvidersFromPublicArtifacts({
      config: params.sourceConfig,
      env,
    });
    if (bundled && bundled.length > 0) {
      return bundled;
    }
    const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
    return resolvePluginWebFetchProviders({
      config: params.sourceConfig,
      env,
      origin: "bundled",
    });
  }
  const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
  return resolvePluginWebFetchProviders({
    config: params.sourceConfig,
    env,
    origin: "bundled",
  });
}

function readConfiguredProviderCredential(params: {
  provider: PluginWebSearchProviderEntry;
  config: OpenClawConfig;
  search: Record<string, unknown> | undefined;
}): unknown {
  return (
    params.provider.getConfiguredCredentialValue?.(params.config) ??
    params.provider.getCredentialValue(params.search)
  );
}

function readConfiguredProviderCredentialFallback(params: {
  provider: PluginWebSearchProviderEntry;
  config: OpenClawConfig;
  search: Record<string, unknown> | undefined;
}): { path: string; value: unknown } | undefined {
  return params.provider.getConfiguredCredentialFallback?.(params.config);
>>>>>>> upstream/main
}

function readConfiguredProviderCredential(params: {
  provider: PluginWebSearchProviderEntry;
  config: OpenClawConfig;
  search: Record<string, unknown> | undefined;
}): unknown {
  const configuredValue = params.provider.getConfiguredCredentialValue?.(params.config);
  return configuredValue ?? params.provider.getCredentialValue(params.search);
}

function inactivePathsForProvider(provider: PluginWebSearchProviderEntry): string[] {
  if (provider.requiresCredential === false) {
    return [];
  }
  return provider.inactiveSecretPaths?.length
    ? provider.inactiveSecretPaths
    : [provider.credentialPath];
}

function setResolvedWebFetchApiKey(params: {
  resolvedConfig: OpenClawConfig;
  provider: PluginWebFetchProviderEntry;
  value: string;
}): void {
  const tools = ensureObject(params.resolvedConfig as Record<string, unknown>, "tools");
  const web = ensureObject(tools, "web");
  const fetch = ensureObject(web, "fetch");
  if (params.provider.setConfiguredCredentialValue) {
    params.provider.setConfiguredCredentialValue(params.resolvedConfig, params.value);
    return;
  }
  params.provider.setCredentialValue(fetch, params.value);
<<<<<<< HEAD
}

function keyPathForFetchProvider(provider: PluginWebFetchProviderEntry): string {
  return provider.credentialPath;
}

function readConfiguredFetchProviderCredential(params: {
  provider: PluginWebFetchProviderEntry;
  config: OpenClawConfig;
  fetch: Record<string, unknown> | undefined;
}): unknown {
  const configuredValue = params.provider.getConfiguredCredentialValue?.(params.config);
  return configuredValue ?? params.provider.getCredentialValue(params.fetch);
}

function inactivePathsForFetchProvider(provider: PluginWebFetchProviderEntry): string[] {
  if (provider.requiresCredential === false) {
    return [];
  }
  return provider.inactiveSecretPaths?.length
    ? provider.inactiveSecretPaths
    : [provider.credentialPath];
}

function hasConfiguredSecretRef(value: unknown, defaults: SecretDefaults | undefined): boolean {
  return Boolean(
    resolveSecretInputRef({
      value,
      defaults,
    }).ref,
  );
=======
>>>>>>> upstream/main
}

function readConfiguredFetchProviderCredential(params: {
  provider: PluginWebFetchProviderEntry;
  config: OpenClawConfig;
  fetch: Record<string, unknown> | undefined;
}): unknown {
  const configuredValue = params.provider.getConfiguredCredentialValue?.(params.config);
  return configuredValue ?? params.provider.getCredentialValue(params.fetch);
}

function readConfiguredFetchProviderCredentialFallback(params: {
  provider: PluginWebFetchProviderEntry;
  config: OpenClawConfig;
  fetch: Record<string, unknown> | undefined;
}): { path: string; value: unknown } | undefined {
  return params.provider.getConfiguredCredentialFallback?.(params.config);
}

function inactivePathsForFetchProvider(provider: PluginWebFetchProviderEntry): string[] {
  if (provider.requiresCredential === false) {
    return [];
  }
  return provider.inactiveSecretPaths?.length
    ? provider.inactiveSecretPaths
    : [provider.credentialPath];
}

/**
 * Resolves runtime web search/fetch provider metadata and writes selected credentials into a
 * cloned runtime config without mutating the source config.
 */
/** Resolves web search/fetch secret metadata from config, plugins, and fallback runtime providers. */
export async function resolveRuntimeWebTools(params: {
  sourceConfig: OpenClawConfig;
  resolvedConfig: OpenClawConfig;
  context: ResolverContext;
}): Promise<RuntimeWebToolsMetadata> {
  const defaults = params.sourceConfig.secrets?.defaults;
  const diagnostics: RuntimeWebDiagnostic[] = [];
  const env = { ...process.env, ...params.context.env };

<<<<<<< HEAD
  const tools = isRecord(params.sourceConfig.tools) ? params.sourceConfig.tools : undefined;
  const web = isRecord(tools?.web) ? tools.web : undefined;
  const search = isRecord(web?.search) ? web.search : undefined;
  const rawProvider =
    typeof search?.provider === "string" ? search.provider.trim().toLowerCase() : "";
  const configuredBundledPluginId = resolveManifestContractOwnerPluginId({
    contract: "webSearchProviders",
    value: rawProvider,
    origin: "bundled",
    config: params.sourceConfig,
    env: { ...process.env, ...params.context.env },
  });
=======
  const sourceTools = isRecord(params.sourceConfig.tools) ? params.sourceConfig.tools : undefined;
  const sourceWeb = isRecord(sourceTools?.web) ? sourceTools.web : undefined;
  const resolvedTools = isRecord(params.resolvedConfig.tools)
    ? params.resolvedConfig.tools
    : undefined;
  const resolvedWeb = isRecord(resolvedTools?.web) ? resolvedTools.web : undefined;
  let hasCustomWebSearchRisk: Promise<boolean> | undefined;
  const getHasCustomWebSearchRisk = (): Promise<boolean> => {
    hasCustomWebSearchRisk ??= hasCustomWebProviderPluginRisk({
      contract: "webSearchProviders",
      config: params.sourceConfig,
      env,
    });
    return hasCustomWebSearchRisk;
  };
  let hasCustomWebFetchRisk: Promise<boolean> | undefined;
  const getHasCustomWebFetchRisk = (): Promise<boolean> => {
    hasCustomWebFetchRisk ??= hasCustomWebProviderPluginRisk({
      contract: "webFetchProviders",
      config: params.sourceConfig,
      env,
    });
    return hasCustomWebFetchRisk;
  };
  const legacyXSearchSource = isRecord(sourceWeb?.x_search) ? sourceWeb.x_search : undefined;
  const legacyXSearchResolved = isRecord(resolvedWeb?.x_search) ? resolvedWeb.x_search : undefined;
>>>>>>> upstream/main

  // Doctor owns the migration, but runtime still needs to resolve the legacy SecretRef surface
  // so existing configs do not silently stop working before users repair them.
  if (
    legacyXSearchSource &&
    legacyXSearchResolved &&
    Object.hasOwn(legacyXSearchSource, "apiKey")
  ) {
    const legacyXSearchSourceRecord = legacyXSearchSource as Record<string, unknown>;
    const legacyXSearchResolvedRecord = legacyXSearchResolved as Record<string, unknown>;
    const resolution = await resolveSecretInputWithEnvFallback({
      sourceConfig: params.sourceConfig,
      context: params.context,
      defaults,
      value: legacyXSearchSourceRecord.apiKey,
      path: "tools.web.x_search.apiKey",
      envVars: ["XAI_API_KEY"],
    });
    if (resolution.value) {
      legacyXSearchResolvedRecord.apiKey = resolution.value;
    }
  }

  const hasPluginWebSearchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webSearch");
  const hasPluginWebFetchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webFetch");
  if (!sourceWeb && !hasPluginWebSearchConfig && !hasPluginWebFetchConfig) {
    return {
      search: {
        providerSource: "none",
        diagnostics: [],
      },
      fetch: {
        providerSource: "none",
        diagnostics: [],
      },
      diagnostics,
    };
  }
  const search = isRecord(sourceWeb?.search) ? sourceWeb.search : undefined;
  const fetch = isRecord(sourceWeb?.fetch) ? (sourceWeb.fetch as FetchConfig) : undefined;
  if (!search && !fetch && !hasPluginWebSearchConfig && !hasPluginWebFetchConfig) {
    return {
      search: {
        providerSource: "none",
        diagnostics: [],
      },
      fetch: {
        providerSource: "none",
        diagnostics: [],
      },
      diagnostics,
    };
  }
  const rawProvider = normalizeLowercaseStringOrEmpty(search?.provider);
  let configuredBundledWebSearchPluginIdHint: string | undefined;
  if (hasPluginWebSearchConfig && !(await getHasCustomWebSearchRisk())) {
    if (rawProvider) {
      configuredBundledWebSearchPluginIdHint = inferExactBundledPluginScopedWebToolConfigOwner({
        config: params.sourceConfig,
        key: "webSearch",
        pluginId: rawProvider,
      });
    }
    configuredBundledWebSearchPluginIdHint ??= inferSingleBundledPluginScopedWebToolConfigOwner(
      params.sourceConfig,
      "webSearch",
    );
  }
  const searchMetadata: RuntimeWebSearchMetadata = {
    providerSource: "none",
    diagnostics: [],
  };
<<<<<<< HEAD

  const searchProviders = sortWebSearchProvidersForAutoDetect(
    configuredBundledPluginId
      ? resolvePluginWebSearchProviders({
          config: params.sourceConfig,
          env: { ...process.env, ...params.context.env },
          bundledAllowlistCompat: true,
          onlyPluginIds: [configuredBundledPluginId],
          origin: "bundled",
        })
      : !hasCustomWebSearchPluginRisk(params.sourceConfig)
        ? resolvePluginWebSearchProviders({
            config: params.sourceConfig,
            env: { ...process.env, ...params.context.env },
            bundledAllowlistCompat: true,
            origin: "bundled",
          })
        : resolvePluginWebSearchProviders({
            config: params.sourceConfig,
            env: { ...process.env, ...params.context.env },
            bundledAllowlistCompat: true,
          }),
  );
  const searchConfigured = Boolean(search);
  const hasConfiguredSearchSurface =
    searchConfigured ||
    searchProviders.some((provider) => {
      if (provider.requiresCredential === false) {
        return false;
      }
      const value = readConfiguredProviderCredential({
        provider,
        config: params.sourceConfig,
        search,
      });
      return value !== undefined;
    });
  const searchEnabled = hasConfiguredSearchSurface && search?.enabled !== false;
  const providers = hasConfiguredSearchSurface ? searchProviders : [];
  const configuredProvider = normalizeProvider(rawProvider, providers);

  if (rawProvider && !configuredProvider) {
    const diagnostic: RuntimeWebDiagnostic = {
      code: "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT",
      message: `tools.web.search.provider is "${rawProvider}". Falling back to auto-detect precedence.`,
      path: "tools.web.search.provider",
    };
    diagnostics.push(diagnostic);
    searchMetadata.diagnostics.push(diagnostic);
    pushWarning(params.context, {
      code: "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT",
      path: "tools.web.search.provider",
      message: diagnostic.message,
    });
  }

  if (configuredProvider) {
    searchMetadata.providerConfigured = configuredProvider;
    searchMetadata.providerSource = "configured";
  }

  if (searchEnabled) {
    const candidates = configuredProvider
      ? providers.filter((provider) => provider.id === configuredProvider)
      : providers;
    const unresolvedWithoutFallback: Array<{
      provider: WebSearchProvider;
      path: string;
      reason: string;
    }> = [];

    let selectedProvider: WebSearchProvider | undefined;
    let selectedResolution: SecretResolutionResult | undefined;
    let keylessFallbackProvider: PluginWebSearchProviderEntry | undefined;

    for (const provider of candidates) {
      if (provider.requiresCredential === false) {
        if (!keylessFallbackProvider) {
          keylessFallbackProvider = provider;
        }
        if (configuredProvider) {
          selectedProvider = provider.id;
          break;
        }
        continue;
      }
      const path = keyPathForProvider(provider);
      const value = readConfiguredProviderCredential({
        provider,
        config: params.sourceConfig,
        search,
      });
      const resolution = await resolveSecretInputWithEnvFallback({
        sourceConfig: params.sourceConfig,
        context: params.context,
        defaults,
        value,
        path,
        envVars: provider.envVars,
      });

      if (resolution.secretRefConfigured && resolution.fallbackUsedAfterRefFailure) {
        const diagnostic: RuntimeWebDiagnostic = {
          code: "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED",
          message:
            `${path} SecretRef could not be resolved; using ${resolution.fallbackEnvVar ?? "env fallback"}. ` +
            (resolution.unresolvedRefReason ?? "").trim(),
          path,
        };
        diagnostics.push(diagnostic);
        searchMetadata.diagnostics.push(diagnostic);
        pushWarning(params.context, {
          code: "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED",
          path,
          message: diagnostic.message,
        });
      }

      if (resolution.secretRefConfigured && !resolution.value && resolution.unresolvedRefReason) {
        unresolvedWithoutFallback.push({
          provider: provider.id,
          path,
          reason: resolution.unresolvedRefReason,
        });
      }

      if (configuredProvider) {
        selectedProvider = provider.id;
        selectedResolution = resolution;
        if (resolution.value) {
          setResolvedWebSearchApiKey({
            resolvedConfig: params.resolvedConfig,
            provider,
            value: resolution.value,
          });
        }
        break;
      }

      if (resolution.value) {
        selectedProvider = provider.id;
        selectedResolution = resolution;
        setResolvedWebSearchApiKey({
          resolvedConfig: params.resolvedConfig,
=======
  if (search || hasPluginWebSearchConfig) {
    const searchSurface = await resolveRuntimeWebProviderSurface({
      contract: "webSearchProviders",
      rawProvider,
      providerPath: "tools.web.search.provider",
      toolConfig: search,
      diagnostics,
      metadataDiagnostics: searchMetadata.diagnostics,
      invalidAutoDetectCode: "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT",
      sourceConfig: params.sourceConfig,
      context: params.context,
      configuredBundledPluginIdHint: configuredBundledWebSearchPluginIdHint,
      resolveProviders: async ({ configuredBundledPluginId }) =>
        resolveBundledWebSearchProviders({
          sourceConfig: params.sourceConfig,
          context: params.context,
          configuredBundledPluginId,
          hasCustomWebSearchPluginRisk: await getHasCustomWebSearchRisk(),
        }),
      sortProviders: sortWebSearchProvidersForAutoDetect,
      readConfiguredCredential: ({ provider, config, toolConfig }) =>
        readConfiguredProviderCredential({
>>>>>>> upstream/main
          provider,
          config,
          search: toolConfig,
        }),
      readConfiguredCredentialFallback: ({ provider, config, toolConfig }) =>
        readConfiguredProviderCredentialFallback({
          provider,
          config,
          search: toolConfig,
        }),
      ignoreKeylessProvidersForConfiguredSurface: true,
      emptyProvidersWhenSurfaceMissing: true,
      normalizeConfiguredProviderAgainstActiveProviders: true,
    });

    await resolveRuntimeWebProviderSelection({
      scopePath: "tools.web.search",
      toolConfig: search,
      enabled: searchSurface.enabled,
      providers: searchSurface.providers,
      configuredProvider: searchSurface.configuredProvider,
      metadata: searchMetadata,
      diagnostics,
      sourceConfig: params.sourceConfig,
      resolvedConfig: params.resolvedConfig,
      context: params.context,
      defaults,
      deferKeylessFallback: true,
      fallbackUsedCode: "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED",
      noFallbackCode: "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK",
      autoDetectSelectedCode: "WEB_SEARCH_AUTODETECT_SELECTED",
      readConfiguredCredential: ({ provider, config, toolConfig }) =>
        readConfiguredProviderCredential({
          provider,
          config,
          search: toolConfig,
        }),
      readConfiguredCredentialFallback: ({ provider, config, toolConfig }) =>
        readConfiguredProviderCredentialFallback({
          provider,
          config,
          search: toolConfig,
        }),
      resolveSecretInput: ({ value, path, envVars }) =>
        resolveSecretInputWithEnvFallback({
          sourceConfig: params.sourceConfig,
          context: params.context,
          defaults,
          value,
          path,
          envVars,
        }),
      setResolvedCredential: ({ resolvedConfig, provider, value }) =>
        setResolvedWebSearchApiKey({
          resolvedConfig,
          provider,
          value,
        }),
      inactivePathsForProvider,
      hasConfiguredSecretRef,
      mergeRuntimeMetadata: async ({ provider, metadata, toolConfig, selectedResolution }) => {
        if (!provider.resolveRuntimeMetadata) {
          return;
        }
        Object.assign(
          metadata,
          await provider.resolveRuntimeMetadata({
            config: params.sourceConfig,
            searchConfig: toolConfig,
            runtimeMetadata: metadata,
            resolvedCredential: selectedResolution
              ? {
                  value: selectedResolution.value,
                  source: selectedResolution.source,
                  fallbackEnvVar: selectedResolution.fallbackEnvVar,
                }
              : undefined,
          }),
        );
      },
    });
  }

<<<<<<< HEAD
  if (searchEnabled && !configuredProvider && searchMetadata.selectedProvider) {
    for (const provider of providers) {
      if (provider.id === searchMetadata.selectedProvider) {
        continue;
      }
      const value = readConfiguredProviderCredential({
        provider,
        config: params.sourceConfig,
        search,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: `tools.web.search auto-detected provider is "${searchMetadata.selectedProvider}".`,
        });
      }
    }
  } else if (search && !searchEnabled) {
    for (const provider of providers) {
      const value = readConfiguredProviderCredential({
        provider,
        config: params.sourceConfig,
        search,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: "tools.web.search is disabled.",
        });
      }
    }
  }

  if (searchEnabled && search && configuredProvider) {
    for (const provider of providers) {
      if (provider.id === configuredProvider) {
        continue;
      }
      const value = readConfiguredProviderCredential({
        provider,
        config: params.sourceConfig,
        search,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: `tools.web.search.provider is "${configuredProvider}".`,
        });
      }
    }
  }

  const fetch = isRecord(web?.fetch) ? (web.fetch as FetchConfig) : undefined;
  const rawFetchProvider =
    typeof fetch?.provider === "string" ? fetch.provider.trim().toLowerCase() : "";
  const configuredBundledFetchPluginId = resolveManifestContractOwnerPluginId({
    contract: "webFetchProviders",
    value: rawFetchProvider,
    origin: "bundled",
    config: params.sourceConfig,
    env: { ...process.env, ...params.context.env },
  });
=======
  const rawFetchProvider = normalizeLowercaseStringOrEmpty(fetch?.provider);
>>>>>>> upstream/main
  const fetchMetadata: RuntimeWebFetchMetadata = {
    providerSource: "none",
    diagnostics: [],
  };
<<<<<<< HEAD
  const fetchProviders = sortWebFetchProvidersForAutoDetect(
    configuredBundledFetchPluginId
      ? resolvePluginWebFetchProviders({
          config: params.sourceConfig,
          env: { ...process.env, ...params.context.env },
          bundledAllowlistCompat: true,
          onlyPluginIds: [configuredBundledFetchPluginId],
          origin: "bundled",
        })
      : resolvePluginWebFetchProviders({
          config: params.sourceConfig,
          env: { ...process.env, ...params.context.env },
          bundledAllowlistCompat: true,
          origin: "bundled",
        }),
  );
  const hasConfiguredFetchSurface =
    Boolean(fetch) ||
    fetchProviders.some((provider) => {
      const value = readConfiguredFetchProviderCredential({
        provider,
        config: params.sourceConfig,
        fetch,
      });
      return value !== undefined;
    });
  const fetchEnabled = hasConfiguredFetchSurface && fetch?.enabled !== false;
  const configuredFetchProvider = normalizeFetchProvider(rawFetchProvider, fetchProviders);

  if (rawFetchProvider && !configuredFetchProvider) {
    const diagnostic: RuntimeWebDiagnostic = {
      code: "WEB_FETCH_PROVIDER_INVALID_AUTODETECT",
      message: `tools.web.fetch.provider is "${rawFetchProvider}". Falling back to auto-detect precedence.`,
      path: "tools.web.fetch.provider",
    };
    diagnostics.push(diagnostic);
    fetchMetadata.diagnostics.push(diagnostic);
    pushWarning(params.context, {
      code: "WEB_FETCH_PROVIDER_INVALID_AUTODETECT",
      path: "tools.web.fetch.provider",
      message: diagnostic.message,
    });
  }

  if (configuredFetchProvider) {
    fetchMetadata.providerConfigured = configuredFetchProvider;
    fetchMetadata.providerSource = "configured";
  }

  if (fetchEnabled) {
    const candidates = configuredFetchProvider
      ? fetchProviders.filter((provider) => provider.id === configuredFetchProvider)
      : fetchProviders;
    const unresolvedWithoutFallback: Array<{
      provider: WebFetchProvider;
      path: string;
      reason: string;
    }> = [];

    let selectedProvider: WebFetchProvider | undefined;
    let selectedResolution: SecretResolutionResult | undefined;

    for (const provider of candidates) {
      if (provider.requiresCredential === false) {
        selectedProvider = provider.id;
        selectedResolution = {
          source: "missing",
          secretRefConfigured: false,
          fallbackUsedAfterRefFailure: false,
        };
        break;
      }
      const path = keyPathForFetchProvider(provider);
      const value = readConfiguredFetchProviderCredential({
        provider,
        config: params.sourceConfig,
        fetch,
      });
      const resolution = await resolveSecretInputWithEnvFallback({
        sourceConfig: params.sourceConfig,
        context: params.context,
        defaults,
        value,
        path,
        envVars: provider.envVars,
        restrictEnvRefsToEnvVars: true,
      });

      if (resolution.secretRefConfigured && resolution.fallbackUsedAfterRefFailure) {
        const diagnostic: RuntimeWebDiagnostic = {
          code: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED",
          message:
            `${path} SecretRef could not be resolved; using ${resolution.fallbackEnvVar ?? "env fallback"}. ` +
            (resolution.unresolvedRefReason ?? "").trim(),
          path,
        };
        diagnostics.push(diagnostic);
        fetchMetadata.diagnostics.push(diagnostic);
        pushWarning(params.context, {
          code: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED",
          path,
          message: diagnostic.message,
        });
      }

      if (resolution.secretRefConfigured && !resolution.value && resolution.unresolvedRefReason) {
        unresolvedWithoutFallback.push({
          provider: provider.id,
          path,
          reason: resolution.unresolvedRefReason,
        });
      }

      if (configuredFetchProvider) {
        selectedProvider = provider.id;
        selectedResolution = resolution;
        if (resolution.value) {
          setResolvedWebFetchApiKey({
            resolvedConfig: params.resolvedConfig,
            provider,
            value: resolution.value,
          });
        }
        break;
      }

      if (resolution.value) {
        selectedProvider = provider.id;
        selectedResolution = resolution;
        setResolvedWebFetchApiKey({
          resolvedConfig: params.resolvedConfig,
          provider,
          value: resolution.value,
        });
        break;
      }
    }

    const failUnresolvedFetchNoFallback = (unresolved: { path: string; reason: string }) => {
      const diagnostic: RuntimeWebDiagnostic = {
        code: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK",
        message: unresolved.reason,
        path: unresolved.path,
      };
      diagnostics.push(diagnostic);
      fetchMetadata.diagnostics.push(diagnostic);
      pushWarning(params.context, {
        code: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK",
        path: unresolved.path,
        message: unresolved.reason,
      });
      throw new Error(`[WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK] ${unresolved.reason}`);
    };

    if (configuredFetchProvider) {
      const unresolved = unresolvedWithoutFallback[0];
      if (unresolved) {
        failUnresolvedFetchNoFallback(unresolved);
      }
    } else {
      if (!selectedProvider && unresolvedWithoutFallback.length > 0) {
        failUnresolvedFetchNoFallback(unresolvedWithoutFallback[0]);
      }

      if (selectedProvider) {
        const selectedProviderEntry = fetchProviders.find((entry) => entry.id === selectedProvider);
        const selectedDetails =
          selectedProviderEntry?.requiresCredential === false
            ? `tools.web.fetch auto-detected keyless provider "${selectedProvider}" as the default fallback.`
            : `tools.web.fetch auto-detected provider "${selectedProvider}" from available credentials.`;
        const diagnostic: RuntimeWebDiagnostic = {
          code: "WEB_FETCH_AUTODETECT_SELECTED",
          message: selectedDetails,
          path: "tools.web.fetch.provider",
        };
        diagnostics.push(diagnostic);
        fetchMetadata.diagnostics.push(diagnostic);
      }
    }

    if (selectedProvider) {
      fetchMetadata.selectedProvider = selectedProvider;
      fetchMetadata.selectedProviderKeySource = selectedResolution?.source;
      if (!configuredFetchProvider) {
        fetchMetadata.providerSource = "auto-detect";
      }
      const provider = fetchProviders.find((entry) => entry.id === selectedProvider);
      if (provider?.resolveRuntimeMetadata) {
        Object.assign(
          fetchMetadata,
          await provider.resolveRuntimeMetadata({
            config: params.sourceConfig,
            fetchConfig: fetch,
            runtimeMetadata: fetchMetadata,
=======
  const discoverFetchProviders = needsRuntimeWebFetchProviderDiscovery({
    fetch,
    rawProvider: rawFetchProvider,
    hasPluginWebFetchConfig,
    defaults,
  });
  if (discoverFetchProviders) {
    const fetchSurface = await resolveRuntimeWebProviderSurface({
      contract: "webFetchProviders",
      rawProvider: rawFetchProvider,
      providerPath: "tools.web.fetch.provider",
      toolConfig: fetch,
      diagnostics,
      metadataDiagnostics: fetchMetadata.diagnostics,
      invalidAutoDetectCode: "WEB_FETCH_PROVIDER_INVALID_AUTODETECT",
      sourceConfig: params.sourceConfig,
      context: params.context,
      resolveProviders: async ({ configuredBundledPluginId }) =>
        resolveBundledWebFetchProviders({
          sourceConfig: params.sourceConfig,
          context: params.context,
          configuredBundledPluginId,
          hasCustomWebFetchPluginRisk: await getHasCustomWebFetchRisk(),
        }),
      sortProviders: sortWebFetchProvidersForAutoDetect,
      readConfiguredCredential: ({ provider, config, toolConfig }) =>
        readConfiguredFetchProviderCredential({
          provider,
          config,
          fetch: toolConfig,
        }),
      readConfiguredCredentialFallback: ({ provider, config, toolConfig }) =>
        readConfiguredFetchProviderCredentialFallback({
          provider,
          config,
          fetch: toolConfig,
        }),
    });

    await resolveRuntimeWebProviderSelection({
      scopePath: "tools.web.fetch",
      toolConfig: fetch,
      enabled: fetchSurface.enabled,
      providers: fetchSurface.providers,
      configuredProvider: fetchSurface.configuredProvider,
      metadata: fetchMetadata,
      diagnostics,
      sourceConfig: params.sourceConfig,
      resolvedConfig: params.resolvedConfig,
      context: params.context,
      defaults,
      deferKeylessFallback: false,
      fallbackUsedCode: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED",
      noFallbackCode: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK",
      autoDetectSelectedCode: "WEB_FETCH_AUTODETECT_SELECTED",
      readConfiguredCredential: ({ provider, config, toolConfig }) =>
        readConfiguredFetchProviderCredential({
          provider,
          config,
          fetch: toolConfig,
        }),
      readConfiguredCredentialFallback: ({ provider, config, toolConfig }) =>
        readConfiguredFetchProviderCredentialFallback({
          provider,
          config,
          fetch: toolConfig,
        }),
      resolveSecretInput: ({ value, path, envVars }) =>
        resolveSecretInputWithEnvFallback({
          sourceConfig: params.sourceConfig,
          context: params.context,
          defaults,
          value,
          path,
          envVars,
          restrictEnvRefsToEnvVars: true,
        }),
      setResolvedCredential: ({ resolvedConfig, provider, value }) =>
        setResolvedWebFetchApiKey({
          resolvedConfig,
          provider,
          value,
        }),
      inactivePathsForProvider: inactivePathsForFetchProvider,
      hasConfiguredSecretRef,
      mergeRuntimeMetadata: async ({ provider, metadata, toolConfig, selectedResolution }) => {
        if (!provider.resolveRuntimeMetadata) {
          return;
        }
        Object.assign(
          metadata,
          await provider.resolveRuntimeMetadata({
            config: params.sourceConfig,
            fetchConfig: toolConfig,
            runtimeMetadata: metadata,
>>>>>>> upstream/main
            resolvedCredential: selectedResolution
              ? {
                  value: selectedResolution.value,
                  source: selectedResolution.source,
                  fallbackEnvVar: selectedResolution.fallbackEnvVar,
                }
              : undefined,
          }),
        );
<<<<<<< HEAD
      }
    }
  }

  if (fetchEnabled && !configuredFetchProvider && fetchMetadata.selectedProvider) {
    for (const provider of fetchProviders) {
      if (provider.id === fetchMetadata.selectedProvider) {
        continue;
      }
      const value = readConfiguredFetchProviderCredential({
        provider,
        config: params.sourceConfig,
        fetch,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForFetchProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: `tools.web.fetch auto-detected provider is "${fetchMetadata.selectedProvider}".`,
        });
      }
    }
  } else if (fetch && !fetchEnabled) {
    for (const provider of fetchProviders) {
      const value = readConfiguredFetchProviderCredential({
        provider,
        config: params.sourceConfig,
        fetch,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForFetchProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: "tools.web.fetch is disabled.",
        });
      }
    }
  }

  if (fetchEnabled && fetch && configuredFetchProvider) {
    for (const provider of fetchProviders) {
      if (provider.id === configuredFetchProvider) {
        continue;
      }
      const value = readConfiguredFetchProviderCredential({
        provider,
        config: params.sourceConfig,
        fetch,
      });
      if (!hasConfiguredSecretRef(value, defaults)) {
        continue;
      }
      for (const path of inactivePathsForFetchProvider(provider)) {
        pushInactiveSurfaceWarning({
          context: params.context,
          path,
          details: `tools.web.fetch.provider is "${configuredFetchProvider}".`,
        });
      }
    }
=======
      },
    });
>>>>>>> upstream/main
  }

  return {
    search: searchMetadata,
    fetch: fetchMetadata,
    diagnostics,
  };
}
