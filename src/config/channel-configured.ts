<<<<<<< HEAD
import { hasMeaningfulChannelConfig } from "../channels/config-presence.js";
import { getBootstrapChannelPlugin } from "../channels/plugins/bootstrap-registry.js";
import { hasBundledChannelConfiguredState } from "../channels/plugins/configured-state.js";
import { hasBundledChannelPersistedAuthState } from "../channels/plugins/persisted-auth-state.js";
import { isRecord } from "../utils.js";
import type { OpenClawConfig } from "./config.js";

function resolveChannelConfig(
  cfg: OpenClawConfig,
  channelId: string,
): Record<string, unknown> | null {
  const channels = cfg.channels as Record<string, unknown> | undefined;
  const entry = channels?.[channelId];
  return isRecord(entry) ? entry : null;
}

function isGenericChannelConfigured(cfg: OpenClawConfig, channelId: string): boolean {
  const entry = resolveChannelConfig(cfg, channelId);
  return hasMeaningfulChannelConfig(entry);
}
=======
// Determines whether a channel is configured from bootstrap and plugin state.
import { getBootstrapChannelPlugin } from "../channels/plugins/bootstrap-registry.js";
import { hasBundledChannelConfiguredState } from "../channels/plugins/configured-state.js";
import {
  hasMeaningfulChannelConfigShallow,
  resolveChannelConfigRecord,
} from "./channel-configured-shared.js";
import type { OpenClawConfig } from "./types.openclaw.js";
>>>>>>> upstream/main

/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
export function isChannelConfigured(
  cfg: OpenClawConfig,
  channelId: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
<<<<<<< HEAD
  if (hasBundledChannelConfiguredState({ channelId, cfg, env })) {
    return true;
  }
  const pluginPersistedAuthState = hasBundledChannelPersistedAuthState({ channelId, cfg, env });
  if (pluginPersistedAuthState) {
    return true;
  }
  if (isGenericChannelConfigured(cfg, channelId)) {
    return true;
  }
=======
  // Treat explicit persisted config as configured before consulting channel-specific env/state
  // probes; user-authored config should win over inferred setup state.
  if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) {
    return true;
  }
  // Bundled channels can expose configured state through env vars or persisted credential files.
  if (hasBundledChannelConfiguredState({ channelId, cfg, env })) {
    return true;
  }
  // Bootstrap plugins cover channels that are available before full plugin registry loading.
>>>>>>> upstream/main
  const plugin = getBootstrapChannelPlugin(channelId);
  return Boolean(plugin?.config?.hasConfiguredState?.({ cfg, env }));
}
