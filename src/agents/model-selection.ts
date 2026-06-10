/**
 * Public model-selection facade for persisted, configured, and allowed refs.
 */
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
  toAgentModelListLike,
} from "../config/model-input.js";
<<<<<<< HEAD
import { createSubsystemLogger } from "../logging/subsystem.js";
import { sanitizeForLog, stripAnsi } from "../terminal/ansi.js";
=======
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main
import {
  resolveAgentConfig,
  resolveAgentEffectiveModelPrimary,
  resolveAgentModelFallbacksOverride,
} from "./agent-scope.js";
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "./defaults.js";
<<<<<<< HEAD
import type { ModelCatalogEntry } from "./model-catalog.js";
import { splitTrailingAuthProfile } from "./model-ref-profile.js";
import { modelKey as sharedModelKey, normalizeStaticProviderModelId } from "./model-ref-shared.js";
=======
import { findModelInCatalog } from "./model-catalog-lookup.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
import { splitTrailingAuthProfile } from "./model-ref-profile.js";
export {
  resolveThinkingDefault,
  resolveThinkingDefaultWithRuntimeCatalog,
} from "./model-thinking-default.js";
>>>>>>> upstream/main
import {
  type ModelManifestNormalizationContext,
  type ModelRef,
  findNormalizedProviderKey,
  findNormalizedProviderValue,
  legacyModelKey,
  modelKey,
  normalizeModelRef,
  normalizeProviderId,
  normalizeProviderIdForAuth,
<<<<<<< HEAD
} from "./provider-id.js";
import { normalizeProviderModelIdWithRuntime } from "./provider-model-normalization.runtime.js";
=======
  parseModelRef,
} from "./model-selection-normalize.js";
import {
  buildAllowedModelSetWithFallbacks,
  buildConfiguredAllowlistKeys,
  buildConfiguredModelCatalog,
  buildModelAliasIndex,
  getModelRefStatusWithFallbackModels,
  inferUniqueProviderFromCatalog,
  inferUniqueProviderFromConfiguredModels,
  normalizeModelSelection,
  resolveBareModelDefaultProvider,
  resolveAllowedModelRefFromAliasIndex,
  resolveAllowlistModelKey as resolveAllowlistModelKeyFromShared,
  resolveConfiguredModelRef,
  resolveConfiguredOpenRouterCompatAlias,
  resolveHooksGmailModel,
  resolveModelRefFromString,
  type ModelAliasIndex,
  type ModelRefStatus,
} from "./model-selection-shared.js";
>>>>>>> upstream/main

export type { ModelAliasIndex, ModelManifestNormalizationContext, ModelRef, ModelRefStatus };

<<<<<<< HEAD
function getLog(): ReturnType<typeof createSubsystemLogger> {
  log ??= createSubsystemLogger("model-selection");
  return log;
}

export type ModelRef = {
  provider: string;
  model: string;
};

export type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive";

export type ModelAliasIndex = {
  byAlias: Map<string, { alias: string; ref: ModelRef }>;
  byKey: Map<string, string[]>;
};

function normalizeAliasKey(value: string): string {
  return value.trim().toLowerCase();
}

function sanitizeModelWarningValue(value: string): string {
  const stripped = value ? stripAnsi(value) : "";
  let controlBoundary = -1;
  for (let index = 0; index < stripped.length; index += 1) {
    const code = stripped.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f) {
      controlBoundary = index;
      break;
    }
  }
  if (controlBoundary === -1) {
    return sanitizeForLog(stripped);
  }
  return sanitizeForLog(stripped.slice(0, controlBoundary));
}

export function modelKey(provider: string, model: string) {
  return sharedModelKey(provider, model);
}

export function legacyModelKey(provider: string, model: string): string | null {
  const providerId = provider.trim();
  const modelId = model.trim();
  if (!providerId || !modelId) {
    return null;
  }
  const rawKey = `${providerId}/${modelId}`;
  const canonicalKey = modelKey(providerId, modelId);
  return rawKey === canonicalKey ? null : rawKey;
}
=======
export type ThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";
>>>>>>> upstream/main

export {
  buildConfiguredAllowlistKeys,
  buildConfiguredModelCatalog,
  buildModelAliasIndex,
  findNormalizedProviderKey,
  findNormalizedProviderValue,
  inferUniqueProviderFromConfiguredModels,
  inferUniqueProviderFromCatalog,
  legacyModelKey,
  modelKey,
  normalizeModelRef,
  normalizeModelSelection,
  normalizeProviderId,
  normalizeProviderIdForAuth,
  parseModelRef,
  resolveBareModelDefaultProvider,
  resolveConfiguredModelRef,
  resolveHooksGmailModel,
  resolveModelRefFromString,
};
export { isCliProvider } from "./model-selection-cli.js";

<<<<<<< HEAD
function normalizeProviderModelId(provider: string, model: string): string {
  const staticModelId = normalizeStaticProviderModelId(provider, model);
  return (
    normalizeProviderModelIdWithRuntime({
      provider,
      context: {
        provider,
        modelId: staticModelId,
      },
    }) ?? staticModelId
  );
}

type ModelRefNormalizeOptions = {
  allowPluginNormalization?: boolean;
};

export function normalizeModelRef(
  provider: string,
  model: string,
  options?: ModelRefNormalizeOptions,
): ModelRef {
  const normalizedProvider = normalizeProviderId(provider);
  const normalizedModel =
    options?.allowPluginNormalization === false
      ? model.trim()
      : normalizeProviderModelId(normalizedProvider, model.trim());
  return { provider: normalizedProvider, model: normalizedModel };
}

type ParseModelRefOptions = ModelRefNormalizeOptions;

export function parseModelRef(
  raw: string,
  defaultProvider: string,
  options?: ParseModelRefOptions,
): ModelRef | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const slash = trimmed.indexOf("/");
  if (slash === -1) {
    return normalizeModelRef(defaultProvider, trimmed, options);
  }
  const providerRaw = trimmed.slice(0, slash).trim();
  const model = trimmed.slice(slash + 1).trim();
  if (!providerRaw || !model) {
    return null;
  }
  return normalizeModelRef(providerRaw, model, options);
}

export function resolvePersistedModelRef(params: {
  defaultProvider: string;
  runtimeProvider?: string;
  runtimeModel?: string;
  overrideProvider?: string;
  overrideModel?: string;
}): ModelRef | null {
  const defaultProvider = params.defaultProvider.trim();
  const runtimeProvider = params.runtimeProvider?.trim();
  const runtimeModel = params.runtimeModel?.trim();
  if (runtimeModel) {
    if (runtimeProvider) {
      return { provider: runtimeProvider, model: runtimeModel };
    }
    return (
      parseModelRef(runtimeModel, defaultProvider) ?? {
        provider: defaultProvider,
        model: runtimeModel,
      }
    );
  }

  const overrideProvider = params.overrideProvider?.trim();
  const overrideModel = params.overrideModel?.trim();
  if (!overrideModel) {
    return null;
  }
  const encodedOverride = overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel;
  return (
    parseModelRef(encodedOverride, defaultProvider) ?? {
=======
function normalizePersistedDefaultProvider(value: unknown): string {
  return normalizeOptionalString(value) ?? DEFAULT_PROVIDER;
}

export function resolvePersistedOverrideModelRef(params: {
  defaultProvider?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowPluginNormalization?: boolean;
}): ModelRef | null {
  const defaultProvider = normalizePersistedDefaultProvider(params.defaultProvider);
  const overrideProvider = normalizeOptionalString(params.overrideProvider);
  const overrideModel = normalizeOptionalString(params.overrideModel);
  if (!overrideModel) {
    return null;
  }
  const encodedOverride = overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel;
  return (
    parseModelRef(encodedOverride, defaultProvider, {
      allowPluginNormalization: params.allowPluginNormalization,
    }) ?? {
>>>>>>> upstream/main
      provider: overrideProvider || defaultProvider,
      model: overrideModel,
    }
  );
}

<<<<<<< HEAD
export function inferUniqueProviderFromConfiguredModels(params: {
  cfg: OpenClawConfig;
  model: string;
}): string | undefined {
  const model = params.model.trim();
  if (!model) {
    return undefined;
  }
  const normalized = model.toLowerCase();
  const providers = new Set<string>();
  const addProvider = (provider: string) => {
    const normalizedProvider = normalizeProviderId(provider);
    if (!normalizedProvider) {
      return;
    }
    providers.add(normalizedProvider);
  };
  const configuredModels = params.cfg.agents?.defaults?.models;
  if (configuredModels) {
    for (const key of Object.keys(configuredModels)) {
      const ref = key.trim();
      if (!ref || !ref.includes("/")) {
        continue;
      }
      const parsed = parseModelRef(ref, DEFAULT_PROVIDER, {
        allowPluginNormalization: false,
      });
      if (!parsed) {
        continue;
      }
      if (parsed.model === model || parsed.model.toLowerCase() === normalized) {
        addProvider(parsed.provider);
        if (providers.size > 1) {
          return undefined;
        }
      }
    }
  }
  const configuredProviders = params.cfg.models?.providers;
  if (configuredProviders) {
    for (const [providerId, providerConfig] of Object.entries(configuredProviders)) {
      const models = providerConfig?.models;
      if (!Array.isArray(models)) {
        continue;
      }
      for (const entry of models) {
        const modelId = entry?.id?.trim();
        if (!modelId) {
          continue;
        }
        if (modelId === model || modelId.toLowerCase() === normalized) {
          addProvider(providerId);
        }
      }
      if (providers.size > 1) {
        return undefined;
      }
    }
  }
  if (providers.size !== 1) {
    return undefined;
  }
  return providers.values().next().value;
}

export function resolveAllowlistModelKey(raw: string, defaultProvider: string): string | null {
  const parsed = parseModelRef(raw, defaultProvider);
  if (!parsed) {
    return null;
  }
  return modelKey(parsed.provider, parsed.model);
}

export function buildConfiguredAllowlistKeys(params: {
  cfg: OpenClawConfig | undefined;
  defaultProvider: string;
}): Set<string> | null {
  const rawAllowlist = Object.keys(params.cfg?.agents?.defaults?.models ?? {});
  if (rawAllowlist.length === 0) {
    return null;
  }

  const keys = new Set<string>();
  for (const raw of rawAllowlist) {
    const key = resolveAllowlistModelKey(String(raw ?? ""), params.defaultProvider);
    if (key) {
      keys.add(key);
    }
  }
  return keys.size > 0 ? keys : null;
}

export function buildModelAliasIndex(params: {
  cfg: OpenClawConfig;
  defaultProvider: string;
  allowPluginNormalization?: boolean;
}): ModelAliasIndex {
  const byAlias = new Map<string, { alias: string; ref: ModelRef }>();
  const byKey = new Map<string, string[]>();

  const rawModels = params.cfg.agents?.defaults?.models ?? {};
  for (const [keyRaw, entryRaw] of Object.entries(rawModels)) {
    const parsed = parseModelRef(String(keyRaw ?? ""), params.defaultProvider, {
      allowPluginNormalization: params.allowPluginNormalization,
    });
    if (!parsed) {
      continue;
    }
    const alias = String((entryRaw as { alias?: string } | undefined)?.alias ?? "").trim();
    if (!alias) {
      continue;
    }
    const aliasKey = normalizeAliasKey(alias);
    byAlias.set(aliasKey, { alias, ref: parsed });
    const key = modelKey(parsed.provider, parsed.model);
    const existing = byKey.get(key) ?? [];
    existing.push(alias);
    byKey.set(key, existing);
  }

  return { byAlias, byKey };
}

export function resolveModelRefFromString(params: {
  raw: string;
  defaultProvider: string;
  aliasIndex?: ModelAliasIndex;
  allowPluginNormalization?: boolean;
}): { ref: ModelRef; alias?: string } | null {
  const { model } = splitTrailingAuthProfile(params.raw);
  if (!model) {
    return null;
  }
  if (!model.includes("/")) {
    const aliasKey = normalizeAliasKey(model);
    const aliasMatch = params.aliasIndex?.byAlias.get(aliasKey);
    if (aliasMatch) {
      return { ref: aliasMatch.ref, alias: aliasMatch.alias };
    }
  }
  const parsed = parseModelRef(model, params.defaultProvider, {
    allowPluginNormalization: params.allowPluginNormalization,
  });
  if (!parsed) {
    return null;
  }
  return { ref: parsed };
}

export function resolveConfiguredModelRef(params: {
  cfg: OpenClawConfig;
  defaultProvider: string;
  defaultModel: string;
  allowPluginNormalization?: boolean;
}): ModelRef {
  const rawModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model) ?? "";
  if (rawModel) {
    const trimmed = rawModel.trim();
    const aliasIndex = buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider: params.defaultProvider,
      allowPluginNormalization: params.allowPluginNormalization,
    });
    if (!trimmed.includes("/")) {
      const aliasKey = normalizeAliasKey(trimmed);
      const aliasMatch = aliasIndex.byAlias.get(aliasKey);
      if (aliasMatch) {
        return aliasMatch.ref;
      }

      const inferredProvider = inferUniqueProviderFromConfiguredModels({
        cfg: params.cfg,
        model: trimmed,
      });
      if (inferredProvider) {
        return { provider: inferredProvider, model: trimmed };
      }

      // Default to the configured provider if no provider is specified, but warn as this is deprecated.
      const safeTrimmed = sanitizeModelWarningValue(trimmed);
      const safeResolved = sanitizeForLog(`${params.defaultProvider}/${safeTrimmed}`);
      getLog().warn(
        `Model "${safeTrimmed}" specified without provider. Falling back to "${safeResolved}". Please use "${safeResolved}" in your config.`,
      );
      return { provider: params.defaultProvider, model: trimmed };
    }

    const resolved = resolveModelRefFromString({
      raw: trimmed,
      defaultProvider: params.defaultProvider,
      aliasIndex,
      allowPluginNormalization: params.allowPluginNormalization,
    });
    if (resolved) {
      return resolved.ref;
    }

    // User specified a model but it could not be resolved — warn before falling back.
    const safe = sanitizeForLog(trimmed);
    const safeFallback = sanitizeForLog(`${params.defaultProvider}/${params.defaultModel}`);
    getLog().warn(
      `Model "${safe}" could not be resolved. Falling back to default "${safeFallback}".`,
=======
/**
 * Runtime-first resolver for persisted model metadata.
 * Use this when callers intentionally want the last executed model identity.
 */
export function resolvePersistedModelRef(params: {
  defaultProvider?: unknown;
  runtimeProvider?: unknown;
  runtimeModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowPluginNormalization?: boolean;
}): ModelRef | null {
  const defaultProvider = normalizePersistedDefaultProvider(params.defaultProvider);
  const runtimeProvider = normalizeOptionalString(params.runtimeProvider);
  const runtimeModel = normalizeOptionalString(params.runtimeModel);
  if (runtimeModel) {
    if (runtimeProvider) {
      return { provider: runtimeProvider, model: runtimeModel };
    }
    return (
      parseModelRef(runtimeModel, defaultProvider, {
        allowPluginNormalization: params.allowPluginNormalization,
      }) ?? {
        provider: defaultProvider,
        model: runtimeModel,
      }
>>>>>>> upstream/main
    );
  }
  return resolvePersistedOverrideModelRef({
    defaultProvider,
    overrideProvider: params.overrideProvider,
    overrideModel: params.overrideModel,
    allowPluginNormalization: params.allowPluginNormalization,
  });
}

/**
 * Selected-model resolver for persisted model metadata.
 * Use this for control/status/UI surfaces that should honor explicit session
 * overrides before falling back to runtime identity.
 */
export function resolvePersistedSelectedModelRef(params: {
  defaultProvider?: unknown;
  runtimeProvider?: unknown;
  runtimeModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowPluginNormalization?: boolean;
}): ModelRef | null {
  const override = resolvePersistedOverrideModelRef({
    defaultProvider: params.defaultProvider,
    overrideProvider: params.overrideProvider,
    overrideModel: params.overrideModel,
    allowPluginNormalization: params.allowPluginNormalization,
  });
  if (override) {
    return override;
  }
  return resolvePersistedModelRef({
    defaultProvider: params.defaultProvider,
    runtimeProvider: params.runtimeProvider,
    runtimeModel: params.runtimeModel,
    allowPluginNormalization: params.allowPluginNormalization,
  });
}

export function normalizeStoredOverrideModel(params: {
  providerOverride?: unknown;
  modelOverride?: unknown;
}): { providerOverride?: string; modelOverride?: string } {
  const providerOverride = normalizeOptionalString(params.providerOverride);
  const modelOverride = normalizeOptionalString(params.modelOverride);
  if (!providerOverride || !modelOverride) {
    return {
      providerOverride,
      modelOverride,
    };
  }

  const providerPrefix = `${providerOverride.toLowerCase()}/`;
  return {
    providerOverride,
    modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix)
      ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride
      : modelOverride,
  };
}

export function resolveAllowlistModelKey(
  raw: string,
  defaultProvider: string,
  cfg?: OpenClawConfig,
  manifestPlugins?: ModelManifestNormalizationContext["manifestPlugins"],
): string | null {
  return resolveAllowlistModelKeyFromShared({ cfg, raw, defaultProvider, manifestPlugins });
}

export function resolveDefaultModelForAgent(
  params: {
    cfg: OpenClawConfig;
    agentId?: string;
    allowPluginNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): ModelRef {
  const agentModelOverride = params.agentId
    ? resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)
    : undefined;
  const cfg =
    agentModelOverride && agentModelOverride.length > 0
      ? {
          ...params.cfg,
          agents: {
            ...params.cfg.agents,
            defaults: {
              ...params.cfg.agents?.defaults,
              model: {
                ...toAgentModelListLike(params.cfg.agents?.defaults?.model),
                primary: agentModelOverride,
              },
            },
          },
        }
      : params.cfg;
  return resolveConfiguredModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
    allowPluginNormalization: params.allowPluginNormalization,
    manifestPlugins: params.manifestPlugins,
  });
}

export async function canonicalizeCaseOnlyCatalogModelRef(params: {
  raw: string | undefined;
  cfg?: OpenClawConfig;
  defaultProvider: string;
  loadCatalog: () => Promise<ModelCatalogEntry[]>;
  aliasIndex?: ModelAliasIndex;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
  preserveAuthProfile?: boolean;
}): Promise<string | undefined> {
  const rawModel = normalizeOptionalString(params.raw);
  if (!rawModel) {
    return undefined;
  }
  const split = splitTrailingAuthProfile(rawModel);
  if (shouldKeepProfileQualifiedModelRefRaw(split.profile, params.preserveAuthProfile)) {
    return rawModel;
  }
  if (!isCaseOnlyProviderModelRef(split.model)) {
    return rawModel;
  }
  const resolved = resolveModelRefFromString({
    cfg: params.cfg,
    raw: split.model,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
    allowManifestNormalization: params.allowManifestNormalization,
    allowPluginNormalization: params.allowPluginNormalization,
  });
  if (!resolved) {
    return rawModel;
  }
  const entry = findModelInCatalog(
    await params.loadCatalog(),
    resolved.ref.provider,
    resolved.ref.model,
  );
  return entry ? formatCatalogModelRef(entry, split.profile) : rawModel;
}

function hasExplicitProviderModelRef(raw: string): boolean {
  const slash = raw.indexOf("/");
  return slash > 0 && slash < raw.length - 1;
}

function isCaseOnlyProviderModelRef(raw: string): boolean {
  return hasExplicitProviderModelRef(raw) && raw !== raw.toLowerCase();
}

function shouldKeepProfileQualifiedModelRefRaw(
  profile: string | undefined,
  preserveAuthProfile: boolean | undefined,
): boolean {
  return Boolean(profile && preserveAuthProfile === false);
}

function formatCatalogModelRef(entry: ModelCatalogEntry, profile: string | undefined): string {
  return appendAuthProfileSuffix(`${entry.provider}/${entry.id}`, profile);
}

function appendAuthProfileSuffix(modelRef: string, profile: string | undefined): string {
  return profile ? `${modelRef}@${profile}` : modelRef;
}

function resolveAllowedFallbacks(params: { cfg: OpenClawConfig; agentId?: string }): string[] {
  if (params.agentId) {
    const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
    if (override !== undefined) {
      return override;
    }
  }
  return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}

export function resolveSubagentConfiguredModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  includeAgentPrimary?: boolean;
}): string | undefined {
  const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
  return (
    normalizeModelSelection(agentConfig?.subagents?.model) ??
<<<<<<< HEAD
    normalizeModelSelection(agentConfig?.model) ??
    normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model)
=======
    normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model) ??
    (params.includeAgentPrimary === false ? undefined : normalizeModelSelection(agentConfig?.model))
>>>>>>> upstream/main
  );
}

/**
 * Resolve a normalized model string through a pre-built alias index, returning
 * a fully qualified `provider/model` string.  If the value is already qualified
 * or not a known alias, returns it unchanged.
 */
function resolveModelThroughAliases(value: string, aliasIndex: ModelAliasIndex): string {
  // Already a provider/model ref — no alias resolution needed.
  if (value.includes("/")) {
    return value;
  }
  // Check if the value is a known alias; if so, resolve to provider/model.
  // Unknown bare strings are returned as-is (don't guess the provider).
  const aliasKey = normalizeLowercaseStringOrEmpty(value);
  const aliasMatch = aliasIndex.byAlias.get(aliasKey);
  if (aliasMatch) {
    return `${aliasMatch.ref.provider}/${aliasMatch.ref.model}`;
  }
  return value;
}

export function resolveSubagentSpawnModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  modelOverride?: unknown;
}): string {
  const runtimeDefault = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  const configured = resolveConfiguredSubagentSpawnModelSelection({
    cfg: params.cfg,
    agentId: params.agentId,
    modelOverride: params.modelOverride,
    defaultProvider: runtimeDefault.provider,
  });
  if (configured) {
    return configured;
  }
  const raw =
    normalizeModelSelection(resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)) ??
    `${runtimeDefault.provider}/${runtimeDefault.model}`;
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: runtimeDefault.provider,
  });
  return resolveModelThroughAliases(raw, aliasIndex);
}

export function resolveConfiguredSubagentSpawnModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  modelOverride?: unknown;
  defaultProvider?: string;
  includeAgentPrimary?: boolean;
}): string | undefined {
  const raw =
    normalizeModelSelection(params.modelOverride) ??
    resolveSubagentConfiguredModelSelection({
      cfg: params.cfg,
      agentId: params.agentId,
      includeAgentPrimary: params.includeAgentPrimary,
    });
  if (!raw) {
    return undefined;
  }
  const defaultProvider =
    normalizeOptionalString(params.defaultProvider) ??
    resolveDefaultModelForAgent({
      cfg: params.cfg,
      agentId: params.agentId,
    }).provider;
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider,
  });
  return resolveModelThroughAliases(raw, aliasIndex);
}

export function buildAllowedModelSet(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
    agentId?: string;
  } & ModelManifestNormalizationContext,
): {
  allowAny: boolean;
  allowedCatalog: ModelCatalogEntry[];
  allowedKeys: Set<string>;
} {
<<<<<<< HEAD
  const rawAllowlist = (() => {
    const modelMap = params.cfg.agents?.defaults?.models ?? {};
    return Object.keys(modelMap);
  })();
  const allowAny = rawAllowlist.length === 0;
  const defaultModel = params.defaultModel?.trim();
  const defaultRef =
    defaultModel && params.defaultProvider
      ? parseModelRef(defaultModel, params.defaultProvider)
      : null;
  const defaultKey = defaultRef ? modelKey(defaultRef.provider, defaultRef.model) : undefined;
  const catalogKeys = new Set(params.catalog.map((entry) => modelKey(entry.provider, entry.id)));

  if (allowAny) {
    if (defaultKey) {
      catalogKeys.add(defaultKey);
    }
    return {
      allowAny: true,
      allowedCatalog: params.catalog,
      allowedKeys: catalogKeys,
    };
  }

  const allowedKeys = new Set<string>();
  const syntheticCatalogEntries = new Map<string, ModelCatalogEntry>();
  const resolveConfiguredSyntheticEntry = (
    provider: string,
    model: string,
  ): ModelCatalogEntry | null => {
    const configuredModels = params.cfg.models?.providers?.[provider]?.models;
    if (!Array.isArray(configuredModels)) {
      return null;
    }
    const configured = configuredModels.find(
      (entry) => typeof entry?.id === "string" && entry.id.trim() === model,
    );
    if (!configured) {
      return null;
    }
    return {
      provider,
      id: model,
      name:
        typeof configured.name === "string" && configured.name.trim().length > 0
          ? configured.name.trim()
          : model,
      contextWindow:
        typeof configured.contextWindow === "number" && configured.contextWindow > 0
          ? configured.contextWindow
          : undefined,
      reasoning: typeof configured.reasoning === "boolean" ? configured.reasoning : undefined,
      input: Array.isArray(configured.input) ? configured.input : undefined,
    };
  };
  for (const raw of rawAllowlist) {
    const parsed = parseModelRef(String(raw), params.defaultProvider);
    if (!parsed) {
      continue;
    }
    const key = modelKey(parsed.provider, parsed.model);
    // Explicit allowlist entries are always trusted, even when bundled catalog
    // data is stale and does not include the configured model yet.
    allowedKeys.add(key);

    if (!catalogKeys.has(key) && !syntheticCatalogEntries.has(key)) {
      const configuredSynthetic = resolveConfiguredSyntheticEntry(parsed.provider, parsed.model);
      syntheticCatalogEntries.set(key, {
        ...configuredSynthetic,
        id: parsed.model,
        name: configuredSynthetic?.name ?? parsed.model,
        provider: parsed.provider,
      });
    }
  }

  for (const fallback of resolveAllowedFallbacks({
    cfg: params.cfg,
    agentId: params.agentId,
  })) {
    const parsed = parseModelRef(String(fallback), params.defaultProvider);
    if (parsed) {
      const key = modelKey(parsed.provider, parsed.model);
      allowedKeys.add(key);

      if (!catalogKeys.has(key) && !syntheticCatalogEntries.has(key)) {
        syntheticCatalogEntries.set(key, {
          id: parsed.model,
          name: parsed.model,
          provider: parsed.provider,
        });
      }
    }
  }

  if (defaultKey) {
    allowedKeys.add(defaultKey);
  }

  const allowedCatalog = [
    ...params.catalog.filter((entry) => {
      const key = modelKey(entry.provider, entry.id);
      return allowedKeys.has(key) && !syntheticCatalogEntries.has(key);
    }),
    ...syntheticCatalogEntries.values(),
  ];

  if (allowedCatalog.length === 0 && allowedKeys.size === 0) {
    if (defaultKey) {
      catalogKeys.add(defaultKey);
    }
    return {
      allowAny: true,
      allowedCatalog: params.catalog,
      allowedKeys: catalogKeys,
    };
  }

  return { allowAny: false, allowedCatalog, allowedKeys };
}

export function buildConfiguredModelCatalog(params: { cfg: OpenClawConfig }): ModelCatalogEntry[] {
  const providers = params.cfg.models?.providers;
  if (!providers || typeof providers !== "object") {
    return [];
  }

  const catalog: ModelCatalogEntry[] = [];
  for (const [providerRaw, provider] of Object.entries(providers)) {
    const providerId = normalizeProviderId(providerRaw);
    if (!providerId || !Array.isArray(provider?.models)) {
      continue;
    }
    for (const model of provider.models) {
      const id = typeof model?.id === "string" ? model.id.trim() : "";
      if (!id) {
        continue;
      }
      const name = typeof model?.name === "string" && model.name.trim() ? model.name.trim() : id;
      const contextWindow =
        typeof model?.contextWindow === "number" && model.contextWindow > 0
          ? model.contextWindow
          : undefined;
      const reasoning = typeof model?.reasoning === "boolean" ? model.reasoning : undefined;
      const input = Array.isArray(model?.input) ? model.input : undefined;
      catalog.push({
        provider: providerId,
        id,
        name,
        contextWindow,
        reasoning,
        input,
      });
    }
  }

  return catalog;
}

export type ModelRefStatus = {
  key: string;
  inCatalog: boolean;
  allowAny: boolean;
  allowed: boolean;
};

export function getModelRefStatus(params: {
  cfg: OpenClawConfig;
  catalog: ModelCatalogEntry[];
  ref: ModelRef;
  defaultProvider: string;
  defaultModel?: string;
}): ModelRefStatus {
  const allowed = buildAllowedModelSet({
=======
  return buildAllowedModelSetWithFallbacks({
>>>>>>> upstream/main
    cfg: params.cfg,
    catalog: params.catalog,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
    fallbackModels: resolveAllowedFallbacks({
      cfg: params.cfg,
      agentId: params.agentId,
    }),
    manifestPlugins: params.manifestPlugins,
  });
}

export function getModelRefStatus(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    ref: ModelRef;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
): ModelRefStatus {
  return getModelRefStatusWithFallbackModels({
    cfg: params.cfg,
    catalog: params.catalog,
    ref: params.ref,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
    fallbackModels: resolveAllowedFallbacks({
      cfg: params.cfg,
    }),
    manifestPlugins: params.manifestPlugins,
  });
}

function getModelRefStatusForResolve(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
  ref: ModelRef,
): ModelRefStatus {
  return getModelRefStatus({
    cfg: params.cfg,
    catalog: params.catalog,
    ref,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
    manifestPlugins: params.manifestPlugins,
  });
}

export function resolveAllowedModelRef(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    raw: string;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
):
  | { ref: ModelRef; key: string }
  | {
      error: string;
    } {
  const trimmed = params.raw.trim();
  if (!trimmed) {
    return { error: "invalid model: empty" };
  }

  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    manifestPlugins: params.manifestPlugins,
  });

<<<<<<< HEAD
  // When the model string has no provider prefix ("/"), try to infer the
  // correct provider from the configured allowlist before falling back to the
  // session's current default provider. This prevents provider prefix drift
  // when switching models across different providers (see #48369).
  const effectiveDefaultProvider = !trimmed.includes("/")
    ? (inferUniqueProviderFromConfiguredModels({ cfg: params.cfg, model: trimmed }) ??
      params.defaultProvider)
    : params.defaultProvider;

  const resolved = resolveModelRefFromString({
    raw: trimmed,
    defaultProvider: effectiveDefaultProvider,
    aliasIndex,
=======
  const openrouterCompatRef = resolveConfiguredOpenRouterCompatAlias({
    cfg: params.cfg,
    raw: trimmed,
    defaultProvider: params.defaultProvider,
    manifestPlugins: params.manifestPlugins,
>>>>>>> upstream/main
  });
  if (openrouterCompatRef) {
    const status = getModelRefStatusForResolve(params, openrouterCompatRef);
    if (!status.allowed) {
      return { error: `model not allowed: ${status.key}` };
    }
    return { ref: openrouterCompatRef, key: status.key };
  }

  return resolveAllowedModelRefFromAliasIndex({
    cfg: params.cfg,
    raw: params.raw,
    defaultProvider: params.defaultProvider,
<<<<<<< HEAD
    defaultModel: params.defaultModel,
  });
  if (!status.allowed) {
    return { error: `model not allowed: ${status.key}` };
  }

  return { ref: resolved.ref, key: status.key };
}

export function resolveThinkingDefault(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
}): ThinkLevel {
  const normalizedProvider = normalizeProviderId(params.provider);
  const normalizedModel = params.model.toLowerCase().replace(/\./g, "-");
  const catalogCandidate = params.catalog?.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  const configuredModels = params.cfg.agents?.defaults?.models;
  const canonicalKey = modelKey(params.provider, params.model);
  const legacyKey = legacyModelKey(params.provider, params.model);
  const primarySelection = normalizeModelSelection(params.cfg.agents?.defaults?.model);
  const normalizedPrimarySelection =
    typeof primarySelection === "string" ? primarySelection.trim().toLowerCase() : undefined;
  const explicitModelConfigured =
    (configuredModels ? canonicalKey in configuredModels : false) ||
    Boolean(legacyKey && configuredModels && legacyKey in configuredModels) ||
    normalizedPrimarySelection === canonicalKey.toLowerCase() ||
    Boolean(legacyKey && normalizedPrimarySelection === legacyKey.toLowerCase()) ||
    normalizedPrimarySelection === params.model.trim().toLowerCase();
  const perModelThinking =
    configuredModels?.[canonicalKey]?.params?.thinking ??
    (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : undefined);
  if (
    perModelThinking === "off" ||
    perModelThinking === "minimal" ||
    perModelThinking === "low" ||
    perModelThinking === "medium" ||
    perModelThinking === "high" ||
    perModelThinking === "xhigh" ||
    perModelThinking === "adaptive"
  ) {
    return perModelThinking;
  }
  const configured = params.cfg.agents?.defaults?.thinkingDefault;
  if (configured) {
    return configured;
  }
  if (
    normalizedProvider === "anthropic" &&
    explicitModelConfigured &&
    typeof catalogCandidate?.name === "string" &&
    /4\.6\b/.test(catalogCandidate.name) &&
    (normalizedModel.startsWith("claude-opus-4-6") ||
      normalizedModel.startsWith("claude-sonnet-4-6"))
  ) {
    return "adaptive";
  }
  return resolveThinkingDefaultForModel({
    provider: params.provider,
    model: params.model,
    catalog: params.catalog,
=======
    aliasIndex,
    manifestPlugins: params.manifestPlugins,
    getStatus: (ref) => getModelRefStatusForResolve(params, ref),
>>>>>>> upstream/main
  });
}

/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
export function resolveReasoningDefault(params: {
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
}): "on" | "off" {
  const key = modelKey(params.provider, params.model);
  const candidate = params.catalog?.find(
    (entry) =>
      (entry.provider === params.provider && entry.id === params.model) ||
      (entry.provider === key && entry.id === params.model),
  );
  return candidate?.reasoning === true ? "on" : "off";
}
