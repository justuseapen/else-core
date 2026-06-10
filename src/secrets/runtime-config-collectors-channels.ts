<<<<<<< HEAD
import { iterateBootstrapChannelPlugins } from "../channels/plugins/bootstrap-registry.js";
import type { OpenClawConfig } from "../config/config.js";
import { type ResolverContext, type SecretDefaults } from "./runtime-shared.js";
=======
/** Collects channel contract secret assignments during runtime preparation. */
import { getBootstrapChannelSecrets } from "../channels/plugins/bootstrap-registry.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import { loadChannelSecretContractApi } from "./channel-contract-api.js";
import type { ResolverContext, SecretDefaults } from "./runtime-shared.js";
>>>>>>> upstream/main

/** Collects SecretRef assignments declared by active channel/plugin channel contracts. */
export function collectChannelConfigAssignments(params: {
  config: OpenClawConfig;
  /** Defaults from the source config, used before assignment writes mutate config. */
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  /** Optional installed plugin roots for external channel contract loading. */
  loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): void {
<<<<<<< HEAD
  if (!params.config.channels || Object.keys(params.config.channels).length === 0) {
    return;
  }
  for (const plugin of iterateBootstrapChannelPlugins()) {
    plugin.secrets?.collectRuntimeConfigAssignments?.(params);
=======
  const channelIds = Object.keys(params.config.channels ?? {});
  if (channelIds.length === 0) {
    return;
  }
  for (const channelId of channelIds) {
    const contract = loadChannelSecretContractApi({
      channelId,
      config: params.config,
      env: params.context.env,
      loadablePluginOrigins: params.loadablePluginOrigins,
    });
    const collectRuntimeConfigAssignments =
      contract?.collectRuntimeConfigAssignments ??
      getBootstrapChannelSecrets(channelId)?.collectRuntimeConfigAssignments;
    // Bootstrap contracts cover built-in channels before plugin contract loading is available.
    collectRuntimeConfigAssignments?.(params);
>>>>>>> upstream/main
  }
}
