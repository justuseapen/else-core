<<<<<<< HEAD
=======
// Materializes normalized config into runtime-ready settings.
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
>>>>>>> upstream/main
import {
  applyCompactionDefaults,
  applyContextPruningDefaults,
  applyAgentDefaults,
<<<<<<< HEAD
=======
  applyCronDefaults,
>>>>>>> upstream/main
  applyLoggingDefaults,
  applyMessageDefaults,
  applyModelDefaults,
  applySessionDefaults,
  applyTalkConfigNormalization,
} from "./defaults.js";
import { normalizeExecSafeBinProfilesInConfig } from "./normalize-exec-safe-bin.js";
import { normalizeConfigPaths } from "./normalize-paths.js";
import type { OpenClawConfig, ResolvedSourceConfig, RuntimeConfig } from "./types.js";

<<<<<<< HEAD
export type ConfigMaterializationMode = "load" | "missing" | "snapshot";

=======
type ConfigMaterializationMode = "load" | "missing" | "snapshot";

/** Defaults profile selected for config load, missing-file, or snapshot materialization. */
>>>>>>> upstream/main
type MaterializationProfile = {
  includeCompactionDefaults: boolean;
  includeContextPruningDefaults: boolean;
  includeLoggingDefaults: boolean;
  normalizePaths: boolean;
};

const MATERIALIZATION_PROFILES: Record<ConfigMaterializationMode, MaterializationProfile> = {
  load: {
    includeCompactionDefaults: true,
    includeContextPruningDefaults: true,
    includeLoggingDefaults: true,
    normalizePaths: true,
  },
  missing: {
    includeCompactionDefaults: true,
    includeContextPruningDefaults: true,
    includeLoggingDefaults: false,
    normalizePaths: false,
  },
  snapshot: {
    includeCompactionDefaults: false,
    includeContextPruningDefaults: false,
    includeLoggingDefaults: true,
    normalizePaths: true,
  },
};

export function asResolvedSourceConfig(config: OpenClawConfig): ResolvedSourceConfig {
  return config as ResolvedSourceConfig;
}

export function asRuntimeConfig(config: OpenClawConfig): RuntimeConfig {
  return config as RuntimeConfig;
}

export function materializeRuntimeConfig(
  config: OpenClawConfig,
  mode: ConfigMaterializationMode,
<<<<<<< HEAD
=======
  options: {
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
    loadManifestRegistry?: () => Pick<PluginManifestRegistry, "plugins"> | undefined;
  } = {},
>>>>>>> upstream/main
): RuntimeConfig {
  const profile = MATERIALIZATION_PROFILES[mode];
  let next = applyMessageDefaults(config);
  if (profile.includeLoggingDefaults) {
    next = applyLoggingDefaults(next);
  }
  next = applySessionDefaults(next);
  next = applyAgentDefaults(next);
<<<<<<< HEAD
  if (profile.includeContextPruningDefaults) {
    next = applyContextPruningDefaults(next);
=======
  next = applyCronDefaults(next);
  if (profile.includeContextPruningDefaults) {
    next = applyContextPruningDefaults(next, { manifestRegistry: options.manifestRegistry });
>>>>>>> upstream/main
  }
  if (profile.includeCompactionDefaults) {
    next = applyCompactionDefaults(next);
  }
<<<<<<< HEAD
  next = applyModelDefaults(next);
=======
  next = applyModelDefaults(next, {
    manifestRegistry: options.manifestRegistry,
    loadManifestRegistry: options.loadManifestRegistry,
  });
>>>>>>> upstream/main
  next = applyTalkConfigNormalization(next);
  if (profile.normalizePaths) {
    normalizeConfigPaths(next);
  }
  normalizeExecSafeBinProfilesInConfig(next);
  return asRuntimeConfig(next);
}
