<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { applyPluginAutoEnable } from "../config/plugin-auto-enable.js";
import {
  withBundledPluginAllowlistCompat,
=======
// Builds plugin activation context from config, discovery, and manifests.
import { applyPluginAutoEnable } from "../config/plugin-auto-enable.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
>>>>>>> upstream/main
  withBundledPluginEnablementCompat,
  withBundledPluginVitestCompat,
} from "./bundled-compat.js";
import {
  createPluginActivationSource,
  normalizePluginsConfig,
  type NormalizedPluginsConfig,
  type PluginActivationConfigSource,
} from "./config-state.js";
<<<<<<< HEAD

export type PluginActivationCompatConfig = {
  allowlistPluginIds?: readonly string[];
=======
import { getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot.js";
import type { PluginDiscoveryResult } from "./discovery.js";

export type PluginActivationCompatConfig = {
>>>>>>> upstream/main
  enablementPluginIds?: readonly string[];
  vitestPluginIds?: readonly string[];
};

export type PluginActivationBundledCompatMode = {
<<<<<<< HEAD
  allowlist?: boolean;
  enablement?: "always" | "allowlist";
=======
  enablement?: "always";
>>>>>>> upstream/main
  vitest?: boolean;
};

export type PluginActivationInputs = {
  rawConfig?: OpenClawConfig;
  config?: OpenClawConfig;
  normalized: NormalizedPluginsConfig;
  activationSourceConfig?: OpenClawConfig;
  activationSource: PluginActivationConfigSource;
  autoEnabledReasons: Record<string, string[]>;
};

export type PluginActivationSnapshot = Pick<
  PluginActivationInputs,
  | "rawConfig"
  | "config"
  | "normalized"
  | "activationSourceConfig"
  | "activationSource"
  | "autoEnabledReasons"
>;

export type BundledPluginCompatibleActivationInputs = PluginActivationInputs & {
  compatPluginIds: string[];
};

<<<<<<< HEAD
export function withActivatedPluginIds(params: {
  config?: OpenClawConfig;
  pluginIds: readonly string[];
=======
export type BundledPluginCompatibleLoadValues = Pick<
  BundledPluginCompatibleActivationInputs,
  "rawConfig" | "config" | "activationSourceConfig" | "autoEnabledReasons" | "compatPluginIds"
>;

type BundledPluginCompatibleActivationParams = {
  rawConfig?: OpenClawConfig;
  resolvedConfig?: OpenClawConfig;
  autoEnabledReasons?: Record<string, string[]>;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  onlyPluginIds?: readonly string[];
  applyAutoEnable?: boolean;
  compatMode: PluginActivationBundledCompatMode;
  resolveCompatPluginIds: (params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: readonly string[];
  }) => string[];
  discovery?: PluginDiscoveryResult;
};

export function withActivatedPluginIds(params: {
  config?: OpenClawConfig;
  pluginIds: readonly string[];
  overrideGlobalDisable?: boolean;
  overrideExplicitDisable?: boolean;
>>>>>>> upstream/main
}): OpenClawConfig | undefined {
  if (params.pluginIds.length === 0) {
    return params.config;
  }
<<<<<<< HEAD
  const allow = new Set(params.config?.plugins?.allow ?? []);
=======
  const originalAllow = params.config?.plugins?.allow ?? [];
  const useAllowlistDiscovery = originalAllow.length > 0;
  const originalAllowSet = useAllowlistDiscovery ? new Set(originalAllow) : undefined;
  const allow = new Set(originalAllow);
>>>>>>> upstream/main
  const entries = {
    ...params.config?.plugins?.entries,
  };
  for (const pluginId of params.pluginIds) {
    const normalized = pluginId.trim();
    if (!normalized) {
      continue;
    }
<<<<<<< HEAD
    allow.add(normalized);
    entries[normalized] = {
      ...entries[normalized],
      enabled: true,
    };
  }
=======
    if (originalAllowSet && !originalAllowSet.has(normalized)) {
      continue;
    }
    allow.add(normalized);
    const existingEntry = entries[normalized];
    entries[normalized] = {
      ...existingEntry,
      enabled: existingEntry?.enabled !== false || params.overrideExplicitDisable === true,
    };
  }
  const forcePluginsEnabled =
    params.overrideGlobalDisable === true && params.config?.plugins?.enabled === false;
>>>>>>> upstream/main
  return {
    ...params.config,
    plugins: {
      ...params.config?.plugins,
<<<<<<< HEAD
=======
      ...(forcePluginsEnabled ? { enabled: true } : {}),
>>>>>>> upstream/main
      ...(allow.size > 0 ? { allow: [...allow] } : {}),
      entries,
    },
  };
}

export function applyPluginCompatibilityOverrides(params: {
  config?: OpenClawConfig;
  compat?: PluginActivationCompatConfig;
  env: NodeJS.ProcessEnv;
}): OpenClawConfig | undefined {
<<<<<<< HEAD
  const allowlistCompat = params.compat?.allowlistPluginIds?.length
    ? withBundledPluginAllowlistCompat({
        config: params.config,
        pluginIds: params.compat.allowlistPluginIds,
      })
    : params.config;
  const enablementCompat = params.compat?.enablementPluginIds?.length
    ? withBundledPluginEnablementCompat({
        config: allowlistCompat,
        pluginIds: params.compat.enablementPluginIds,
      })
    : allowlistCompat;
=======
  const enablementCompat = params.compat?.enablementPluginIds?.length
    ? withBundledPluginEnablementCompat({
        config: params.config,
        pluginIds: params.compat.enablementPluginIds,
      })
    : params.config;
>>>>>>> upstream/main
  const vitestCompat = params.compat?.vitestPluginIds?.length
    ? withBundledPluginVitestCompat({
        config: enablementCompat,
        pluginIds: params.compat.vitestPluginIds,
        env: params.env,
      })
    : enablementCompat;
  return vitestCompat;
}

<<<<<<< HEAD
=======
function shouldResolveBundledCompatPluginIds(params: {
  compatMode: PluginActivationBundledCompatMode;
}): boolean {
  return params.compatMode.enablement === "always" || params.compatMode.vitest === true;
}

function createBundledPluginCompatConfig(params: {
  compatMode: PluginActivationBundledCompatMode;
  compatPluginIds: string[];
}): PluginActivationCompatConfig {
  return {
    enablementPluginIds:
      params.compatMode.enablement === "always" ? params.compatPluginIds : undefined,
    vitestPluginIds: params.compatMode.vitest ? params.compatPluginIds : undefined,
  };
}

function applyPluginAutoEnableForActivation(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  workspaceDir?: string;
  discovery?: PluginDiscoveryResult;
}) {
  const currentSnapshot = getCurrentPluginMetadataSnapshot({
    config: params.config,
    env: params.env,
    workspaceDir: params.workspaceDir,
    allowWorkspaceScopedSnapshot: true,
  });
  const defaultDiscoverySnapshot =
    normalizePluginsConfig(params.config.plugins).loadPaths.length === 0
      ? getCurrentPluginMetadataSnapshot({
          env: params.env,
          workspaceDir: params.workspaceDir,
          allowWorkspaceScopedSnapshot: true,
          requireDefaultDiscoveryContext: true,
        })
      : undefined;
  const currentManifestRegistry =
    currentSnapshot?.manifestRegistry ?? defaultDiscoverySnapshot?.manifestRegistry;
  return applyPluginAutoEnable({
    config: params.config,
    env: params.env,
    manifestRegistry: currentManifestRegistry,
    discovery: params.discovery,
  });
}

>>>>>>> upstream/main
export function resolvePluginActivationSnapshot(params: {
  rawConfig?: OpenClawConfig;
  resolvedConfig?: OpenClawConfig;
  autoEnabledReasons?: Record<string, string[]>;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
  applyAutoEnable?: boolean;
=======
  workspaceDir?: string;
  applyAutoEnable?: boolean;
  discovery?: PluginDiscoveryResult;
>>>>>>> upstream/main
}): PluginActivationSnapshot {
  const env = params.env ?? process.env;
  const rawConfig = params.rawConfig ?? params.resolvedConfig;
  let resolvedConfig = params.resolvedConfig ?? params.rawConfig;
  let autoEnabledReasons = params.autoEnabledReasons;

  if (params.applyAutoEnable && rawConfig !== undefined) {
<<<<<<< HEAD
    const autoEnabled = applyPluginAutoEnable({
      config: rawConfig,
      env,
=======
    const autoEnabled = applyPluginAutoEnableForActivation({
      config: rawConfig,
      env,
      workspaceDir: params.workspaceDir,
      discovery: params.discovery,
>>>>>>> upstream/main
    });
    resolvedConfig = autoEnabled.config;
    autoEnabledReasons = autoEnabled.autoEnabledReasons;
  }

  return {
    rawConfig,
    config: resolvedConfig,
    normalized: normalizePluginsConfig(resolvedConfig?.plugins),
    activationSourceConfig: rawConfig,
    activationSource: createPluginActivationSource({
      config: rawConfig,
    }),
    autoEnabledReasons: autoEnabledReasons ?? {},
  };
}

export function resolvePluginActivationInputs(params: {
  rawConfig?: OpenClawConfig;
  resolvedConfig?: OpenClawConfig;
  autoEnabledReasons?: Record<string, string[]>;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
  compat?: PluginActivationCompatConfig;
  applyAutoEnable?: boolean;
=======
  workspaceDir?: string;
  compat?: PluginActivationCompatConfig;
  applyAutoEnable?: boolean;
  discovery?: PluginDiscoveryResult;
>>>>>>> upstream/main
}): PluginActivationInputs {
  const env = params.env ?? process.env;
  const snapshot = resolvePluginActivationSnapshot({
    rawConfig: params.rawConfig,
    resolvedConfig: params.resolvedConfig,
    autoEnabledReasons: params.autoEnabledReasons,
    env,
<<<<<<< HEAD
    applyAutoEnable: params.applyAutoEnable,
=======
    workspaceDir: params.workspaceDir,
    applyAutoEnable: params.applyAutoEnable,
    discovery: params.discovery,
>>>>>>> upstream/main
  });
  const config = applyPluginCompatibilityOverrides({
    config: snapshot.config,
    compat: params.compat,
    env,
  });

  return {
    rawConfig: snapshot.rawConfig,
    config,
    normalized: normalizePluginsConfig(config?.plugins),
    activationSourceConfig: snapshot.activationSourceConfig,
    activationSource: snapshot.activationSource,
    autoEnabledReasons: snapshot.autoEnabledReasons,
  };
}

<<<<<<< HEAD
export function resolveBundledPluginCompatibleActivationInputs(params: {
  rawConfig?: OpenClawConfig;
  resolvedConfig?: OpenClawConfig;
  autoEnabledReasons?: Record<string, string[]>;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  onlyPluginIds?: readonly string[];
  applyAutoEnable?: boolean;
  compatMode: PluginActivationBundledCompatMode;
  resolveCompatPluginIds: (params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: readonly string[];
  }) => string[];
}): BundledPluginCompatibleActivationInputs {
=======
export function resolveBundledPluginCompatibleActivationInputs(
  params: BundledPluginCompatibleActivationParams,
): BundledPluginCompatibleActivationInputs {
>>>>>>> upstream/main
  const snapshot = resolvePluginActivationSnapshot({
    rawConfig: params.rawConfig,
    resolvedConfig: params.resolvedConfig,
    autoEnabledReasons: params.autoEnabledReasons,
    env: params.env,
<<<<<<< HEAD
    applyAutoEnable: params.applyAutoEnable,
  });
  const allowlistCompatEnabled = params.compatMode.allowlist === true;
  const shouldResolveCompatPluginIds =
    allowlistCompatEnabled ||
    params.compatMode.enablement === "always" ||
    (params.compatMode.enablement === "allowlist" && allowlistCompatEnabled) ||
    params.compatMode.vitest === true;
=======
    workspaceDir: params.workspaceDir,
    applyAutoEnable: params.applyAutoEnable,
    discovery: params.discovery,
  });
  const shouldResolveCompatPluginIds = shouldResolveBundledCompatPluginIds({
    compatMode: params.compatMode,
  });
>>>>>>> upstream/main
  const compatPluginIds = shouldResolveCompatPluginIds
    ? params.resolveCompatPluginIds({
        config: snapshot.config,
        workspaceDir: params.workspaceDir,
        env: params.env,
        onlyPluginIds: params.onlyPluginIds,
      })
    : [];
  const activation = resolvePluginActivationInputs({
    rawConfig: snapshot.rawConfig,
    resolvedConfig: snapshot.config,
    autoEnabledReasons: snapshot.autoEnabledReasons,
    env: params.env,
<<<<<<< HEAD
    compat: {
      allowlistPluginIds: allowlistCompatEnabled ? compatPluginIds : undefined,
      enablementPluginIds:
        params.compatMode.enablement === "always" ||
        (params.compatMode.enablement === "allowlist" && allowlistCompatEnabled)
          ? compatPluginIds
          : undefined,
      vitestPluginIds: params.compatMode.vitest ? compatPluginIds : undefined,
    },
=======
    workspaceDir: params.workspaceDir,
    compat: createBundledPluginCompatConfig({
      compatMode: params.compatMode,
      compatPluginIds,
    }),
    discovery: params.discovery,
>>>>>>> upstream/main
  });

  return {
    ...activation,
    compatPluginIds,
  };
}
<<<<<<< HEAD
=======

export function resolveBundledPluginCompatibleLoadValues(
  params: BundledPluginCompatibleActivationParams,
): BundledPluginCompatibleLoadValues {
  const env = params.env ?? process.env;
  const rawConfig = params.rawConfig ?? params.resolvedConfig;
  let resolvedConfig = params.resolvedConfig ?? params.rawConfig;
  let autoEnabledReasons = params.autoEnabledReasons ?? {};

  if (params.applyAutoEnable && rawConfig !== undefined) {
    const autoEnabled = applyPluginAutoEnableForActivation({
      config: rawConfig,
      env,
      workspaceDir: params.workspaceDir,
      discovery: params.discovery,
    });
    resolvedConfig = autoEnabled.config;
    autoEnabledReasons = autoEnabled.autoEnabledReasons;
  }

  const shouldResolveCompatPluginIds = shouldResolveBundledCompatPluginIds({
    compatMode: params.compatMode,
  });
  const compatPluginIds = shouldResolveCompatPluginIds
    ? params.resolveCompatPluginIds({
        config: resolvedConfig,
        workspaceDir: params.workspaceDir,
        env,
        onlyPluginIds: params.onlyPluginIds,
      })
    : [];
  const config = applyPluginCompatibilityOverrides({
    config: resolvedConfig,
    compat: createBundledPluginCompatConfig({
      compatMode: params.compatMode,
      compatPluginIds,
    }),
    env,
  });

  return {
    rawConfig,
    config,
    activationSourceConfig: rawConfig,
    autoEnabledReasons,
    compatPluginIds,
  };
}
>>>>>>> upstream/main
