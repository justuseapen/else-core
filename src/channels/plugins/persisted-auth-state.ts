<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
=======
/**
 * Bundled channel persisted-auth state probes.
 *
 * Lists and checks channel package metadata that can report persisted auth state.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
>>>>>>> upstream/main
import {
  hasBundledChannelPackageState,
  listBundledChannelIdsForPackageState,
} from "./package-state-probes.js";

<<<<<<< HEAD
export function listBundledChannelIdsWithPersistedAuthState(): string[] {
  return listBundledChannelIdsForPackageState("persistedAuthState");
}

=======
/**
 * Lists bundled channels that declare persisted-auth state metadata.
 */
export function listBundledChannelIdsWithPersistedAuthState(
  discovery?: PluginDiscoveryResult,
): string[] {
  return listBundledChannelIdsForPackageState("persistedAuthState", discovery);
}

/**
 * Returns whether a bundled channel reports persisted auth state.
 */
>>>>>>> upstream/main
export function hasBundledChannelPersistedAuthState(params: {
  channelId: string;
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
=======
  discovery?: PluginDiscoveryResult;
>>>>>>> upstream/main
}): boolean {
  return hasBundledChannelPackageState({
    metadataKey: "persistedAuthState",
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env,
<<<<<<< HEAD
=======
    discovery: params.discovery,
>>>>>>> upstream/main
  });
}
