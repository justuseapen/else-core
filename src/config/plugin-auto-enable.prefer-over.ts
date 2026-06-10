<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { getChatChannelMeta, normalizeChatChannelId } from "../channels/registry.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import { isRecord, resolveConfigDir, resolveUserPath } from "../utils.js";
import type { OpenClawConfig } from "./config.js";
import type { PluginAutoEnableCandidate } from "./plugin-auto-enable.shared.js";
=======
// Resolves plugin auto-enable preference ordering across candidate plugins.
import fs from "node:fs";
import path from "node:path";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { normalizeStringEntries } from "@openclaw/normalization-core/string-normalization";
import { getChatChannelMeta, normalizeChatChannelId } from "../channels/registry.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import { isRecord, resolveConfigDir, resolveUserPath } from "../utils.js";
import type { PluginAutoEnableCandidate } from "./plugin-auto-enable.types.js";
import type { OpenClawConfig } from "./types.openclaw.js";
>>>>>>> upstream/main

type ExternalCatalogChannelEntry = {
  id: string;
  preferOver: string[];
};

const ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];

function splitEnvPaths(value: string): string[] {
<<<<<<< HEAD
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }
  return trimmed
    .split(/[;,]/g)
    .flatMap((chunk) => chunk.split(path.delimiter))
    .map((entry) => entry.trim())
    .filter(Boolean);
=======
  const trimmed = normalizeOptionalString(value) ?? "";
  if (!trimmed) {
    return [];
  }
  return normalizeStringEntries(
    trimmed.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)),
  );
>>>>>>> upstream/main
}

function resolveExternalCatalogPaths(env: NodeJS.ProcessEnv): string[] {
  for (const key of ENV_CATALOG_PATHS) {
<<<<<<< HEAD
    const raw = env[key];
    if (raw && raw.trim()) {
=======
    const raw = normalizeOptionalString(env[key]);
    if (raw) {
>>>>>>> upstream/main
      return splitEnvPaths(raw);
    }
  }
  const configDir = resolveConfigDir(env);
  return [
    path.join(configDir, "mpm", "plugins.json"),
    path.join(configDir, "mpm", "catalog.json"),
    path.join(configDir, "plugins", "catalog.json"),
  ];
}

function parseExternalCatalogChannelEntries(raw: unknown): ExternalCatalogChannelEntry[] {
  const list = (() => {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (!isRecord(raw)) {
      return [];
    }
    const entries = raw.entries ?? raw.packages ?? raw.plugins;
    return Array.isArray(entries) ? entries : [];
  })();

  const channels: ExternalCatalogChannelEntry[] = [];
  for (const entry of list) {
    if (!isRecord(entry) || !isRecord(entry.openclaw) || !isRecord(entry.openclaw.channel)) {
      continue;
    }
    const channel = entry.openclaw.channel;
<<<<<<< HEAD
    const id = typeof channel.id === "string" ? channel.id.trim() : "";
=======
    const id = normalizeOptionalString(channel.id) ?? "";
>>>>>>> upstream/main
    if (!id) {
      continue;
    }
    const preferOver = Array.isArray(channel.preferOver)
      ? channel.preferOver.filter((value): value is string => typeof value === "string")
      : [];
    channels.push({ id, preferOver });
  }
  return channels;
}

function resolveExternalCatalogPreferOver(channelId: string, env: NodeJS.ProcessEnv): string[] {
  for (const rawPath of resolveExternalCatalogPaths(env)) {
    const resolved = resolveUserPath(rawPath, env);
    if (!fs.existsSync(resolved)) {
      continue;
    }
    try {
      const payload = JSON.parse(fs.readFileSync(resolved, "utf-8")) as unknown;
      const channel = parseExternalCatalogChannelEntries(payload).find(
        (entry) => entry.id === channelId,
      );
      if (channel) {
        return channel.preferOver;
      }
    } catch {
      // Ignore invalid catalog files.
    }
  }
  return [];
}

<<<<<<< HEAD
function resolvePreferredOverIds(
  pluginId: string,
  env: NodeJS.ProcessEnv,
  registry: PluginManifestRegistry,
): string[] {
  const normalized = normalizeChatChannelId(pluginId);
  if (normalized) {
    return [...(getChatChannelMeta(normalized).preferOver ?? [])];
  }
  const installedPlugin = registry.plugins.find((record) => record.id === pluginId);
  const manifestChannelPreferOver = installedPlugin?.channelConfigs?.[pluginId]?.preferOver;
=======
function resolveBuiltInChannelPreferOver(channelId: string): readonly string[] {
  const builtInChannelId = normalizeChatChannelId(channelId);
  if (!builtInChannelId) {
    return [];
  }
  return getChatChannelMeta(builtInChannelId)?.preferOver ?? [];
}

function resolvePreferredOverIds(
  candidate: PluginAutoEnableCandidate,
  env: NodeJS.ProcessEnv,
  registry: PluginManifestRegistry,
): string[] {
  const channelId =
    candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId;
  const installedPlugin = registry.plugins.find((record) => record.id === candidate.pluginId);
  const manifestChannelPreferOver = installedPlugin?.channelConfigs?.[channelId]?.preferOver;
>>>>>>> upstream/main
  if (manifestChannelPreferOver?.length) {
    return [...manifestChannelPreferOver];
  }
  const installedChannelMeta = installedPlugin?.channelCatalogMeta;
  if (installedChannelMeta?.preferOver?.length) {
    return [...installedChannelMeta.preferOver];
  }
<<<<<<< HEAD
  return resolveExternalCatalogPreferOver(pluginId, env);
=======
  const builtInChannelPreferOver = resolveBuiltInChannelPreferOver(channelId);
  if (builtInChannelPreferOver.length) {
    return [...builtInChannelPreferOver];
  }
  return resolveExternalCatalogPreferOver(channelId, env);
}

function getPluginAutoEnableCandidateCacheKey(candidate: PluginAutoEnableCandidate): string {
  return `${candidate.pluginId}:${candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId}`;
>>>>>>> upstream/main
}

export function shouldSkipPreferredPluginAutoEnable(params: {
  config: OpenClawConfig;
  entry: PluginAutoEnableCandidate;
  configured: readonly PluginAutoEnableCandidate[];
  env: NodeJS.ProcessEnv;
  registry: PluginManifestRegistry;
  isPluginDenied: (config: OpenClawConfig, pluginId: string) => boolean;
  isPluginExplicitlyDisabled: (config: OpenClawConfig, pluginId: string) => boolean;
<<<<<<< HEAD
}): boolean {
=======
  preferOverCache: Map<string, string[]>;
}): boolean {
  const getPreferredOverIds = (candidate: PluginAutoEnableCandidate): string[] => {
    const cacheKey = getPluginAutoEnableCandidateCacheKey(candidate);
    const cached = params.preferOverCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const resolved = resolvePreferredOverIds(candidate, params.env, params.registry);
    params.preferOverCache.set(cacheKey, resolved);
    return resolved;
  };

>>>>>>> upstream/main
  for (const other of params.configured) {
    if (other.pluginId === params.entry.pluginId) {
      continue;
    }
    if (
      params.isPluginDenied(params.config, other.pluginId) ||
      params.isPluginExplicitlyDisabled(params.config, other.pluginId)
    ) {
      continue;
    }
<<<<<<< HEAD
    if (
      resolvePreferredOverIds(other.pluginId, params.env, params.registry).includes(
        params.entry.pluginId,
      )
    ) {
=======
    if (getPreferredOverIds(other).includes(params.entry.pluginId)) {
>>>>>>> upstream/main
      return true;
    }
  }
  return false;
}
