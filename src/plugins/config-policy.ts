<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
=======
// Evaluates plugin config policy without activating plugin runtime code.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveMemorySlotDecisionShared,
  resolvePluginActivationDecisionShared,
  toPluginActivationState,
  type PluginActivationSource,
  type PluginActivationStateLike,
} from "./config-activation-shared.js";
>>>>>>> upstream/main
import {
  hasExplicitPluginConfig as hasExplicitPluginConfigShared,
  identityNormalizePluginId,
  isBundledChannelEnabledByChannelConfig as isBundledChannelEnabledByChannelConfigShared,
  normalizePluginsConfigWithResolver as normalizePluginsConfigWithResolverShared,
  type NormalizePluginId,
  type NormalizedPluginsConfig as SharedNormalizedPluginsConfig,
} from "./config-normalization-shared.js";
<<<<<<< HEAD
import { hasKind } from "./slots.js";
import type { PluginKind, PluginOrigin } from "./types.js";

export type PluginActivationSource = "disabled" | "explicit" | "auto" | "default";

export type PluginActivationState = {
  enabled: boolean;
  activated: boolean;
  explicitlyEnabled: boolean;
  source: PluginActivationSource;
  reason?: string;
};
=======
import type { PluginKind } from "./plugin-kind.types.js";
import type { PluginOrigin } from "./plugin-origin.types.js";

export type { PluginActivationSource };
export type PluginActivationState = PluginActivationStateLike;
>>>>>>> upstream/main

export type NormalizedPluginsConfig = SharedNormalizedPluginsConfig;

export function normalizePluginsConfigWithResolver(
  config?: OpenClawConfig["plugins"],
  normalizePluginId: NormalizePluginId = identityNormalizePluginId,
): NormalizedPluginsConfig {
  return normalizePluginsConfigWithResolverShared(config, normalizePluginId);
}

<<<<<<< HEAD
function resolveExplicitPluginSelection(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
}): { explicitlyEnabled: boolean; reason?: string } {
  if (params.config.entries[params.id]?.enabled === true) {
    return { explicitlyEnabled: true, reason: "enabled in config" };
  }
  if (
    params.origin === "bundled" &&
    isBundledChannelEnabledByChannelConfig(params.rootConfig, params.id)
  ) {
    return { explicitlyEnabled: true, reason: "channel enabled in config" };
  }
  if (params.config.slots.memory === params.id) {
    return { explicitlyEnabled: true, reason: "selected memory slot" };
  }
  if (params.origin !== "bundled" && params.config.allow.includes(params.id)) {
    return { explicitlyEnabled: true, reason: "selected in allowlist" };
  }
  return { explicitlyEnabled: false };
}

=======
>>>>>>> upstream/main
export function resolvePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  sourceConfig?: NormalizedPluginsConfig;
  sourceRootConfig?: OpenClawConfig;
  autoEnabledReason?: string;
}): PluginActivationState {
<<<<<<< HEAD
  const explicitSelection = resolveExplicitPluginSelection({
    id: params.id,
    origin: params.origin,
    config: params.sourceConfig ?? params.config,
    rootConfig: params.sourceRootConfig ?? params.rootConfig,
  });

  if (!params.config.enabled) {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: explicitSelection.explicitlyEnabled,
      source: "disabled",
      reason: "plugins disabled",
    };
  }
  if (params.config.deny.includes(params.id)) {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: explicitSelection.explicitlyEnabled,
      source: "disabled",
      reason: "blocked by denylist",
    };
  }
  const entry = params.config.entries[params.id];
  if (entry?.enabled === false) {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: explicitSelection.explicitlyEnabled,
      source: "disabled",
      reason: "disabled in config",
    };
  }
  const explicitlyAllowed = params.config.allow.includes(params.id);
  if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true) {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: explicitSelection.explicitlyEnabled,
      source: "disabled",
      reason: "workspace plugin (disabled by default)",
    };
  }
  if (params.config.slots.memory === params.id) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: true,
      source: "explicit",
      reason: "selected memory slot",
    };
  }
  if (params.config.allow.length > 0 && !explicitlyAllowed) {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: explicitSelection.explicitlyEnabled,
      source: "disabled",
      reason: "not in allowlist",
    };
  }
  if (explicitSelection.explicitlyEnabled) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: true,
      source: "explicit",
      reason: explicitSelection.reason,
    };
  }
  if (params.autoEnabledReason) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: false,
      source: "auto",
      reason: params.autoEnabledReason,
    };
  }
  if (entry?.enabled === true) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: false,
      source: "auto",
      reason: "enabled by effective config",
    };
  }
  if (
    params.origin === "bundled" &&
    isBundledChannelEnabledByChannelConfig(params.rootConfig, params.id)
  ) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: false,
      source: "auto",
      reason: "channel configured",
    };
  }
  if (params.origin === "bundled" && params.enabledByDefault === true) {
    return {
      enabled: true,
      activated: true,
      explicitlyEnabled: false,
      source: "default",
      reason: "bundled default enablement",
    };
  }
  if (params.origin === "bundled") {
    return {
      enabled: false,
      activated: false,
      explicitlyEnabled: false,
      source: "disabled",
      reason: "bundled (disabled by default)",
    };
  }
  return {
    enabled: true,
    activated: true,
    explicitlyEnabled: explicitSelection.explicitlyEnabled,
    source: "default",
  };
}
export function hasExplicitPluginConfig(plugins?: OpenClawConfig["plugins"]): boolean {
  return hasExplicitPluginConfigShared(plugins);
}
export function resolveEnableState(
  id: string,
  origin: PluginOrigin,
  config: NormalizedPluginsConfig,
  enabledByDefault?: boolean,
): { enabled: boolean; reason?: string } {
  const state = resolvePluginActivationState({
    id,
    origin,
    config,
    enabledByDefault,
  });
  return state.enabled ? { enabled: true } : { enabled: false, reason: state.reason };
}

export function isBundledChannelEnabledByChannelConfig(
  cfg: OpenClawConfig | undefined,
  pluginId: string,
): boolean {
  return isBundledChannelEnabledByChannelConfigShared(cfg, pluginId);
}

export function resolveEffectiveEnableState(params: {
=======
  return toPluginActivationState(
    resolvePluginActivationDecisionShared({
      ...params,
      activationSource: {
        plugins: params.sourceConfig ?? params.config,
        rootConfig: params.sourceRootConfig ?? params.rootConfig,
      },
      isBundledChannelEnabledByChannelConfig,
    }),
  );
}
export const hasExplicitPluginConfig = hasExplicitPluginConfigShared;

export const isBundledChannelEnabledByChannelConfig = isBundledChannelEnabledByChannelConfigShared;

type PolicyEffectiveActivationParams = {
>>>>>>> upstream/main
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  sourceConfig?: NormalizedPluginsConfig;
  sourceRootConfig?: OpenClawConfig;
  autoEnabledReason?: string;
<<<<<<< HEAD
}): { enabled: boolean; reason?: string } {
  const state = resolveEffectivePluginActivationState(params);
  return state.enabled ? { enabled: true } : { enabled: false, reason: state.reason };
}

export function resolveEffectivePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  sourceConfig?: NormalizedPluginsConfig;
  sourceRootConfig?: OpenClawConfig;
  autoEnabledReason?: string;
}): PluginActivationState {
=======
};

export function resolveEffectivePluginActivationState(
  params: PolicyEffectiveActivationParams,
): PluginActivationState {
>>>>>>> upstream/main
  return resolvePluginActivationState(params);
}

export function resolveMemorySlotDecision(params: {
  id: string;
  kind?: PluginKind | PluginKind[];
  slot: string | null | undefined;
  selectedId: string | null;
}): { enabled: boolean; reason?: string; selected?: boolean } {
<<<<<<< HEAD
  if (!hasKind(params.kind, "memory")) {
    return { enabled: true };
  }
  // A dual-kind plugin (e.g. ["memory", "context-engine"]) that lost the
  // memory slot must stay enabled so its other slot role can still load.
  const isMultiKind = Array.isArray(params.kind) && params.kind.length > 1;
  if (params.slot === null) {
    return isMultiKind ? { enabled: true } : { enabled: false, reason: "memory slot disabled" };
  }
  if (typeof params.slot === "string") {
    if (params.slot === params.id) {
      return { enabled: true, selected: true };
    }
    return isMultiKind
      ? { enabled: true }
      : { enabled: false, reason: `memory slot set to "${params.slot}"` };
  }
  if (params.selectedId && params.selectedId !== params.id) {
    return isMultiKind
      ? { enabled: true }
      : { enabled: false, reason: `memory slot already filled by "${params.selectedId}"` };
  }
  return { enabled: true, selected: true };
=======
  return resolveMemorySlotDecisionShared(params);
>>>>>>> upstream/main
}
