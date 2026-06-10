<<<<<<< HEAD
import { listPotentialConfiguredChannelIds } from "../../../channels/config-presence.js";
import type { OpenClawConfig } from "../../../config/config.js";
=======
// Doctor warnings for configured channels blocked by disabled channel plugins.
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import { sanitizeForLog } from "../../../../packages/terminal-core/src/ansi.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import {
  listExplicitConfiguredChannelIdsForConfig,
  resolveConfiguredChannelPresencePolicy,
} from "../../../plugins/channel-plugin-ids.js";
>>>>>>> upstream/main
import {
  normalizePluginsConfig,
  resolveEffectivePluginActivationState,
} from "../../../plugins/config-state.js";
<<<<<<< HEAD
import { loadPluginManifestRegistry } from "../../../plugins/manifest-registry.js";
import { sanitizeForLog } from "../../../terminal/ansi.js";

export type ChannelPluginBlockerHit = {
  channelId: string;
  pluginId: string;
  reason: "disabled in config" | "plugins disabled";
};

=======
import { loadPluginManifestRegistryForPluginRegistry } from "../../../plugins/plugin-registry.js";

export type ChannelPluginBlockerHit = {
  /** Normalized configured channel id whose backing plugin is unavailable. */
  channelId: string;
  /** Plugin id that would provide the configured channel. */
  pluginId: string;
  /** Effective activation reason preventing the plugin from loading. */
  reason: "disabled in config" | "plugins disabled";
};

function hasExplicitChannelPluginBlockerConfig(cfg: OpenClawConfig): boolean {
  if (cfg.plugins?.enabled === false) {
    return true;
  }
  const entries = cfg.plugins?.entries;
  if (!entries || typeof entries !== "object") {
    return false;
  }
  return Object.values(entries).some((entry) => {
    return (
      entry &&
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      "enabled" in entry &&
      (entry as { enabled?: unknown }).enabled === false
    );
  });
}

/** Find configured channel ids whose backing plugins are explicitly disabled. */
>>>>>>> upstream/main
export function scanConfiguredChannelPluginBlockers(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): ChannelPluginBlockerHit[] {
<<<<<<< HEAD
  const configuredChannelIds = new Set(
    listPotentialConfiguredChannelIds(cfg, env).map((id) => id.trim()),
=======
  if (!hasExplicitChannelPluginBlockerConfig(cfg)) {
    return [];
  }
  const configuredChannelIds = new Set(
    listExplicitConfiguredChannelIdsForConfig(cfg)
      .map((channelId) => normalizeOptionalLowercaseString(channelId))
      .filter((channelId): channelId is string => Boolean(channelId)),
>>>>>>> upstream/main
  );
  if (configuredChannelIds.size === 0) {
    return [];
  }

  const pluginsConfig = normalizePluginsConfig(cfg.plugins);
<<<<<<< HEAD
  const registry = loadPluginManifestRegistry({
    config: cfg,
    env,
  });
=======
  const registry = loadPluginManifestRegistryForPluginRegistry({
    config: cfg,
    env,
    includeDisabled: true,
  });
  const activeConfiguredChannelIds = new Set(
    resolveConfiguredChannelPresencePolicy({
      config: cfg,
      env,
      includePersistedAuthState: false,
      manifestRecords: registry.plugins,
    })
      .filter((entry) => entry.effective)
      .map((entry) => entry.channelId),
  );
>>>>>>> upstream/main
  const hits: ChannelPluginBlockerHit[] = [];

  for (const plugin of registry.plugins) {
    if (plugin.channels.length === 0) {
      continue;
    }

    const activationState = resolveEffectivePluginActivationState({
      id: plugin.id,
      origin: plugin.origin,
      config: pluginsConfig,
      rootConfig: cfg,
      enabledByDefault: plugin.enabledByDefault,
    });
    if (
      activationState.activated ||
      !activationState.reason ||
      (activationState.reason !== "disabled in config" &&
        activationState.reason !== "plugins disabled")
    ) {
      continue;
    }

<<<<<<< HEAD
    for (const channelId of plugin.channels) {
      if (!configuredChannelIds.has(channelId)) {
        continue;
      }
=======
    for (const rawChannelId of plugin.channels) {
      const channelId = normalizeOptionalLowercaseString(rawChannelId);
      if (!channelId) {
        continue;
      }
      if (!configuredChannelIds.has(channelId)) {
        continue;
      }
      if (activeConfiguredChannelIds.has(channelId)) {
        continue;
      }
>>>>>>> upstream/main
      hits.push({
        channelId,
        pluginId: plugin.id,
        reason: activationState.reason,
      });
    }
  }

  return hits;
}

function formatReason(hit: ChannelPluginBlockerHit): string {
  if (hit.reason === "disabled in config") {
    return `plugin "${sanitizeForLog(hit.pluginId)}" is disabled by plugins.entries.${sanitizeForLog(hit.pluginId)}.enabled=false.`;
  }
  if (hit.reason === "plugins disabled") {
    return `plugins.enabled=false blocks channel plugins globally.`;
  }
  return `plugin "${sanitizeForLog(hit.pluginId)}" is not loadable (${sanitizeForLog(hit.reason)}).`;
}

<<<<<<< HEAD
=======
/** Format doctor warnings for configured channels blocked by plugin activation state. */
>>>>>>> upstream/main
export function collectConfiguredChannelPluginBlockerWarnings(
  hits: ChannelPluginBlockerHit[],
): string[] {
  return hits.map(
    (hit) =>
      `- channels.${sanitizeForLog(hit.channelId)}: channel is configured, but ${formatReason(hit)} Fix plugin enablement before relying on setup guidance for this channel.`,
  );
}

<<<<<<< HEAD
=======
/** Return true when a setup warning targets a channel already explained by plugin blockers. */
>>>>>>> upstream/main
export function isWarningBlockedByChannelPlugin(
  warning: string,
  hits: ChannelPluginBlockerHit[],
): boolean {
  return hits.some((hit) => {
    const prefix = `channels.${sanitizeForLog(hit.channelId)}`;
    return warning.includes(`${prefix}:`) || warning.includes(`${prefix}.`);
  });
}
