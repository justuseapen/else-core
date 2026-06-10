<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/plugin-entry";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

=======
// Xai helper module supports x search config behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { isRecord } from "./tool-config-shared.js";

type JsonRecord = Record<string, unknown>;

>>>>>>> upstream/main
function cloneRecord<T extends JsonRecord | undefined>(value: T): T {
  if (!value) {
    return value;
  }
  return { ...value } as T;
}

<<<<<<< HEAD
export function resolveLegacyXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
=======
function resolveLegacyXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
>>>>>>> upstream/main
  const web = config?.tools?.web as Record<string, unknown> | undefined;
  const xSearch = web?.x_search;
  return isRecord(xSearch) ? cloneRecord(xSearch) : undefined;
}

<<<<<<< HEAD
export function resolvePluginXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
=======
function resolvePluginXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
>>>>>>> upstream/main
  const pluginConfig = config?.plugins?.entries?.xai?.config;
  if (!isRecord(pluginConfig?.xSearch)) {
    return undefined;
  }
  return cloneRecord(pluginConfig.xSearch);
}

<<<<<<< HEAD
export function resolveEffectiveXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
  const legacy = resolveLegacyXSearchConfig(config);
  const pluginOwned = resolvePluginXSearchConfig(config);
  if (!legacy) {
    return pluginOwned;
  }
  if (!pluginOwned) {
    return legacy;
  }
  return {
    ...legacy,
    ...pluginOwned,
  };
=======
function resolveLegacyGrokWebSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
  const web = config?.tools?.web as Record<string, unknown> | undefined;
  const search = web?.search;
  if (!isRecord(search) || !isRecord(search.grok)) {
    return undefined;
  }
  return cloneRecord(search.grok);
}

function resolvePluginWebSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
  const pluginConfig = config?.plugins?.entries?.xai?.config;
  if (!isRecord(pluginConfig?.webSearch)) {
    return undefined;
  }
  return cloneRecord(pluginConfig.webSearch);
}

function baseUrlFallback(config?: JsonRecord): JsonRecord | undefined {
  return typeof config?.baseUrl === "string" && config.baseUrl.trim()
    ? { baseUrl: config.baseUrl }
    : undefined;
}

export function resolveEffectiveXSearchConfig(config?: OpenClawConfig): JsonRecord | undefined {
  const legacyGrokBaseUrl = baseUrlFallback(resolveLegacyGrokWebSearchConfig(config));
  const pluginWebSearchBaseUrl = baseUrlFallback(resolvePluginWebSearchConfig(config));
  const legacy = resolveLegacyXSearchConfig(config);
  const pluginOwned = resolvePluginXSearchConfig(config);
  const merged = {
    ...legacyGrokBaseUrl,
    ...pluginWebSearchBaseUrl,
    ...legacy,
    ...pluginOwned,
  };
  if (Object.keys(merged).length === 0) {
    return undefined;
  }
  return merged;
>>>>>>> upstream/main
}

export function setPluginXSearchConfigValue(
  configTarget: OpenClawConfig,
  key: string,
  value: unknown,
): void {
  const plugins = (configTarget.plugins ??= {}) as { entries?: Record<string, unknown> };
  const entries = (plugins.entries ??= {});
  const entry = (entries.xai ??= {}) as { config?: Record<string, unknown> };
  const config = (entry.config ??= {});
  const xSearch = (config.xSearch ??= {}) as Record<string, unknown>;
  xSearch[key] = value;
}
