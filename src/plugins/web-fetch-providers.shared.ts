<<<<<<< HEAD
import { resolveBundledPluginCompatibleActivationInputs } from "./activation-context.js";
import { type NormalizedPluginsConfig } from "./config-state.js";
import type { PluginLoadOptions } from "./loader.js";
import { resolveManifestContractPluginIds } from "./manifest-registry.js";
import type { PluginWebFetchProviderEntry } from "./types.js";

function resolveBundledWebFetchCompatPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): string[] {
  return resolveManifestContractPluginIds({
    contract: "webFetchProviders",
    origin: "bundled",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
}

function compareWebFetchProvidersAlphabetically(
  left: Pick<PluginWebFetchProviderEntry, "id" | "pluginId">,
  right: Pick<PluginWebFetchProviderEntry, "id" | "pluginId">,
): number {
  return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
=======
// Shares web fetch provider loading helpers across provider plugins.
import type { PluginLoadOptions } from "./loader.js";
import type { PluginWebFetchProviderEntry } from "./types.js";
import {
  resolveBundledWebProviderResolutionConfig,
  sortPluginProviders,
  sortPluginProvidersForAutoDetect,
} from "./web-provider-resolution-shared.js";
>>>>>>> upstream/main

export function sortWebFetchProviders(
  providers: PluginWebFetchProviderEntry[],
): PluginWebFetchProviderEntry[] {
<<<<<<< HEAD
  return providers.toSorted(compareWebFetchProvidersAlphabetically);
=======
  return sortPluginProviders(providers);
>>>>>>> upstream/main
}

export function sortWebFetchProvidersForAutoDetect(
  providers: PluginWebFetchProviderEntry[],
): PluginWebFetchProviderEntry[] {
<<<<<<< HEAD
  return providers.toSorted((left, right) => {
    const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return compareWebFetchProvidersAlphabetically(left, right);
  });
=======
  return sortPluginProvidersForAutoDetect(providers);
>>>>>>> upstream/main
}

export function resolveBundledWebFetchResolutionConfig(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
<<<<<<< HEAD
  bundledAllowlistCompat?: boolean;
}): {
  config: PluginLoadOptions["config"];
  normalized: NormalizedPluginsConfig;
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  const activation = resolveBundledPluginCompatibleActivationInputs({
    rawConfig: params.config,
    env: params.env,
    workspaceDir: params.workspaceDir,
    applyAutoEnable: true,
    compatMode: {
      allowlist: params.bundledAllowlistCompat,
      enablement: "always",
      vitest: true,
    },
    resolveCompatPluginIds: resolveBundledWebFetchCompatPluginIds,
  });

  return {
    config: activation.config,
    normalized: activation.normalized,
    activationSourceConfig: activation.activationSourceConfig,
    autoEnabledReasons: activation.autoEnabledReasons,
  };
=======
}): {
  config: PluginLoadOptions["config"];
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  return resolveBundledWebProviderResolutionConfig({
    contract: "webFetchProviders",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
>>>>>>> upstream/main
}
