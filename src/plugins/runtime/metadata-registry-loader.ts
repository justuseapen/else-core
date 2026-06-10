<<<<<<< HEAD
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import type { OpenClawConfig } from "../../config/config.js";
import { loadConfig } from "../../config/config.js";
import { applyPluginAutoEnable } from "../../config/plugin-auto-enable.js";
import { createSubsystemLogger } from "../../logging.js";
import { loadOpenClawPlugins } from "../loader.js";
import type { PluginRegistry } from "../registry.js";
import type { PluginLogger } from "../types.js";

const log = createSubsystemLogger("plugins");

=======
// Metadata registry loader builds plugin metadata registries without activating runtime barrels.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { loadOpenClawPlugins } from "../loader.js";
import type { PluginManifestRegistry } from "../manifest-registry.js";
import { hasExplicitPluginIdScope } from "../plugin-scope.js";
import type { PluginRegistry } from "../registry.js";
import type { PluginLogger } from "../types.js";
import {
  buildPluginRuntimeLoadOptions,
  resolvePluginRuntimeLoadContext,
  type PluginRuntimeLoadContext,
} from "./load-context.js";

/** Loads a non-activated plugin metadata registry snapshot for validation/status callers. */
>>>>>>> upstream/main
export function loadPluginMetadataRegistrySnapshot(options?: {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
  workspaceDir?: string;
  onlyPluginIds?: string[];
  loadModules?: boolean;
}): PluginRegistry {
  const env = options?.env ?? process.env;
  const baseConfig = options?.config ?? loadConfig();
  const autoEnabled = applyPluginAutoEnable({ config: baseConfig, env });
  const resolvedConfig = autoEnabled.config;
  const workspaceDir =
    options?.workspaceDir ??
    resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig));
  const logger: PluginLogger = {
    info: (message) => log.info(message),
    warn: (message) => log.warn(message),
    error: (message) => log.error(message),
    debug: (message) => log.debug(message),
  };

  return loadOpenClawPlugins({
    config: resolvedConfig,
    activationSourceConfig: options?.activationSourceConfig ?? baseConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir,
    env,
    logger,
    throwOnLoadError: true,
    cache: false,
    activate: false,
    mode: "validate",
    loadModules: options?.loadModules,
    ...(options?.onlyPluginIds?.length ? { onlyPluginIds: options.onlyPluginIds } : {}),
  });
=======
  logger?: PluginLogger;
  workspaceDir?: string;
  onlyPluginIds?: string[];
  loadModules?: boolean;
  manifestRegistry?: PluginManifestRegistry;
  runtimeContext?: PluginRuntimeLoadContext;
}): PluginRegistry {
  const context = options?.runtimeContext ?? resolvePluginRuntimeLoadContext(options);

  return loadOpenClawPlugins(
    buildPluginRuntimeLoadOptions(context, {
      ...(options?.config !== undefined ? { config: options.config } : {}),
      ...(options?.activationSourceConfig !== undefined
        ? { activationSourceConfig: options.activationSourceConfig }
        : {}),
      ...(options?.workspaceDir !== undefined ? { workspaceDir: options.workspaceDir } : {}),
      ...(options?.env !== undefined ? { env: options.env } : {}),
      ...(options?.logger !== undefined ? { logger: options.logger } : {}),
      throwOnLoadError: true,
      cache: false,
      activate: false,
      mode: "validate",
      loadModules: options?.loadModules,
      ...(hasExplicitPluginIdScope(options?.onlyPluginIds)
        ? { onlyPluginIds: options?.onlyPluginIds }
        : {}),
      ...(options?.manifestRegistry ? { manifestRegistry: options.manifestRegistry } : {}),
    }),
  );
>>>>>>> upstream/main
}
