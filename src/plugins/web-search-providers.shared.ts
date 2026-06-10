<<<<<<< HEAD
import { resolveBundledPluginCompatibleActivationInputs } from "./activation-context.js";
import { type NormalizedPluginsConfig } from "./config-state.js";
=======
// Shares web-search provider loading helpers across runtime paths.
>>>>>>> upstream/main
import type { PluginLoadOptions } from "./loader.js";
import { resolveManifestContractPluginIds } from "./manifest-registry.js";
import type { PluginWebSearchProviderEntry } from "./types.js";
<<<<<<< HEAD

function resolveBundledWebSearchCompatPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): string[] {
  return resolveManifestContractPluginIds({
    contract: "webSearchProviders",
    origin: "bundled",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
}

function compareWebSearchProvidersAlphabetically(
  left: Pick<PluginWebSearchProviderEntry, "id" | "pluginId">,
  right: Pick<PluginWebSearchProviderEntry, "id" | "pluginId">,
): number {
  return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
=======
import {
  resolveBundledWebProviderResolutionConfig,
  sortPluginProviders,
  sortPluginProvidersForAutoDetect,
} from "./web-provider-resolution-shared.js";
>>>>>>> upstream/main

export function sortWebSearchProviders(
  providers: PluginWebSearchProviderEntry[],
): PluginWebSearchProviderEntry[] {
  return sortPluginProviders(providers);
}

export function sortWebSearchProvidersForAutoDetect(
  providers: PluginWebSearchProviderEntry[],
): PluginWebSearchProviderEntry[] {
  return sortPluginProvidersForAutoDetect(providers);
}

export function resolveBundledWebSearchResolutionConfig(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): {
  config: PluginLoadOptions["config"];
<<<<<<< HEAD
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
    resolveCompatPluginIds: resolveBundledWebSearchCompatPluginIds,
  });

  return {
    config: activation.config,
    normalized: activation.normalized,
    activationSourceConfig: activation.activationSourceConfig,
    autoEnabledReasons: activation.autoEnabledReasons,
  };
=======
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  return resolveBundledWebProviderResolutionConfig({
    contract: "webSearchProviders",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
>>>>>>> upstream/main
}
