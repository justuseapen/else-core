// Gateway plugin bootstrap helpers.
// Applies activation config, installs runtime bindings, loads and pins plugins.
import { primeConfiguredBindingRegistry } from "../channels/plugins/binding-registry.js";
<<<<<<< HEAD
import type { loadConfig } from "../config/config.js";
import { resolvePluginActivationSnapshot } from "../plugins/activation-context.js";
=======
import { applyPluginAutoEnable } from "../config/plugin-auto-enable.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginLookUpTable } from "../plugins/plugin-lookup-table.js";
import type { PluginRegistryParams } from "../plugins/registry-types.js";
>>>>>>> upstream/main
import type { PluginRegistry } from "../plugins/registry.js";
import { pinActivePluginChannelRegistry } from "../plugins/runtime.js";
import {
  setGatewayNodesRuntime,
  setGatewaySubagentRuntime,
} from "../plugins/runtime/gateway-bindings.js";
import { mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config.js";
import type { GatewayRequestHandler } from "./server-methods/types.js";
import {
  createGatewayNodesRuntime,
  createGatewaySubagentRuntime,
  loadGatewayPlugins,
  setPluginSubagentOverridePolicies,
} from "./server-plugins.js";

// Gateway plugin bootstrap applies activation/auto-enable config, installs
// plugin runtime bindings, loads plugins, primes channel bindings, and pins the
// active registry for startup/reload paths.
type GatewayPluginBootstrapLog = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  debug: (msg: string) => void;
};

type GatewayStartupTrace = {
  detail: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
};

type GatewayPluginBootstrapParams = {
<<<<<<< HEAD
  cfg: ReturnType<typeof loadConfig>;
  activationSourceConfig?: ReturnType<typeof loadConfig>;
=======
  cfg: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
>>>>>>> upstream/main
  workspaceDir: string;
  log: GatewayPluginBootstrapLog;
  coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
  coreGatewayMethodNames?: readonly string[];
  hostServices?: PluginRegistryParams["hostServices"];
  baseMethods: string[];
  pluginIds?: string[];
<<<<<<< HEAD
=======
  pluginLookUpTable?: PluginLookUpTable;
>>>>>>> upstream/main
  preferSetupRuntimeForChannelPlugins?: boolean;
  suppressPluginInfoLogs?: boolean;
  logDiagnostics?: boolean;
  startupTrace?: GatewayStartupTrace;
  beforePrimeRegistry?: (pluginRegistry: PluginRegistry) => void;
};

function installGatewayPluginRuntimeEnvironment(cfg: OpenClawConfig) {
  setPluginSubagentOverridePolicies(cfg);
  setGatewaySubagentRuntime(createGatewaySubagentRuntime());
  setGatewayNodesRuntime(createGatewayNodesRuntime());
}

// Diagnostics are logged after registry priming so startup output contains
// plugin ids/source hints without exposing internal diagnostic objects.
function logGatewayPluginDiagnostics(params: {
  diagnostics: PluginRegistry["diagnostics"];
  log: Pick<GatewayPluginBootstrapLog, "error" | "info">;
}) {
  for (const diag of params.diagnostics) {
    const details = [
      diag.pluginId ? `plugin=${diag.pluginId}` : null,
      diag.source ? `source=${diag.source}` : null,
    ]
      .filter((entry): entry is string => Boolean(entry))
      .join(", ");
    const message = details
      ? `[plugins] ${diag.message} (${details})`
      : `[plugins] ${diag.message}`;
    if (diag.level === "error") {
      params.log.error(message);
    } else {
      params.log.info(message);
    }
  }
}

/** Prepares gateway plugin runtime and returns the loaded plugin registry state. */
export function prepareGatewayPluginLoad(params: GatewayPluginBootstrapParams) {
<<<<<<< HEAD
  const activation = resolvePluginActivationSnapshot({
    rawConfig: params.activationSourceConfig ?? params.cfg,
    env: process.env,
    applyAutoEnable: true,
  });
  const resolvedConfig = activation.config ?? params.cfg;
  installGatewayPluginRuntimeEnvironment(resolvedConfig);
  const loaded = loadGatewayPlugins({
    cfg: resolvedConfig,
    activationSourceConfig: params.activationSourceConfig ?? params.cfg,
    autoEnabledReasons: activation.autoEnabledReasons,
=======
  const activationSourceConfig = params.activationSourceConfig ?? params.cfg;
  const autoEnabled = applyPluginAutoEnable({
    config: activationSourceConfig,
    env: process.env,
    ...(params.pluginLookUpTable?.manifestRegistry
      ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry }
      : {}),
    discovery: params.pluginLookUpTable?.discovery,
  });
  const resolvedConfig =
    activationSourceConfig === params.cfg
      ? autoEnabled.config
      : mergeActivationSectionsIntoRuntimeConfig({
          runtimeConfig: params.cfg,
          activationConfig: autoEnabled.config,
        });
  // Runtime bindings must be installed before loadGatewayPlugins so plugin
  // hooks that inspect gateway/node/subagent helpers see current config.
  installGatewayPluginRuntimeEnvironment(resolvedConfig);
  const loaded = loadGatewayPlugins({
    cfg: resolvedConfig,
    activationSourceConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
>>>>>>> upstream/main
    workspaceDir: params.workspaceDir,
    log: params.log,
    ...(params.coreGatewayHandlers !== undefined && {
      coreGatewayHandlers: params.coreGatewayHandlers,
    }),
    ...(params.coreGatewayMethodNames !== undefined && {
      coreGatewayMethodNames: params.coreGatewayMethodNames,
    }),
    ...(params.hostServices !== undefined && {
      hostServices: params.hostServices,
    }),
    baseMethods: params.baseMethods,
    pluginIds: params.pluginIds,
<<<<<<< HEAD
=======
    pluginLookUpTable: params.pluginLookUpTable,
>>>>>>> upstream/main
    preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
    suppressPluginInfoLogs: params.suppressPluginInfoLogs,
    startupTrace: params.startupTrace,
  });
  params.beforePrimeRegistry?.(loaded.pluginRegistry);
  primeConfiguredBindingRegistry({ cfg: resolvedConfig });
  if ((params.logDiagnostics ?? true) && loaded.pluginRegistry.diagnostics.length > 0) {
    logGatewayPluginDiagnostics({
      diagnostics: loaded.pluginRegistry.diagnostics,
      log: params.log,
    });
  }
  return loaded;
}

/** Loads and pins gateway plugins during normal gateway startup. */
export function loadGatewayStartupPlugins(
  params: Omit<GatewayPluginBootstrapParams, "beforePrimeRegistry">,
) {
  return prepareGatewayPluginLoad({
    ...params,
    beforePrimeRegistry: pinActivePluginChannelRegistry,
  });
}

/** Reloads deferred gateway plugins while preserving startup bootstrap behavior. */
export function reloadDeferredGatewayPlugins(
  params: Omit<
    GatewayPluginBootstrapParams,
    "beforePrimeRegistry" | "preferSetupRuntimeForChannelPlugins"
  >,
) {
  return prepareGatewayPluginLoad({
    ...params,
    beforePrimeRegistry: pinActivePluginChannelRegistry,
  });
}
