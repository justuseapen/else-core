<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
=======
/**
 * Bundled channel configured-state probes.
 *
 * Lists and checks bundled channels that can report configured account state.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
>>>>>>> upstream/main
import {
  hasBundledChannelPackageState,
  listBundledChannelIdsForPackageState,
} from "./package-state-probes.js";

<<<<<<< HEAD
export function listBundledChannelIdsWithConfiguredState(): string[] {
  return listBundledChannelIdsForPackageState("configuredState");
}

=======
/**
 * Lists bundled channel ids that expose configured-state detectors.
 */
export function listBundledChannelIdsWithConfiguredState(
  discovery?: PluginDiscoveryResult,
): string[] {
  return listBundledChannelIdsForPackageState("configuredState", discovery);
}

/**
 * Checks whether a bundled channel reports configured state for the current config.
 */
>>>>>>> upstream/main
export function hasBundledChannelConfiguredState(params: {
  channelId: string;
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
=======
  discovery?: PluginDiscoveryResult;
>>>>>>> upstream/main
}): boolean {
  return hasBundledChannelPackageState({
    metadataKey: "configuredState",
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env,
<<<<<<< HEAD
=======
    discovery: params.discovery,
>>>>>>> upstream/main
  });
}
