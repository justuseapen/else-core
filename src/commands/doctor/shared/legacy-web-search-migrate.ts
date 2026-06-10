<<<<<<< HEAD
import type { OpenClawConfig } from "../../../config/config.js";
import { mergeMissing } from "../../../config/legacy.shared.js";
import {
  loadPluginManifestRegistry,
  resolveManifestContractOwnerPluginId,
} from "../../../plugins/manifest-registry.js";

type JsonRecord = Record<string, unknown>;

const MODERN_SCOPED_WEB_SEARCH_KEYS = new Set(["openaiCodex"]);

// Tavily only ever used the plugin-owned config path, so there is no legacy
// `tools.web.search.tavily.*` shape to migrate.
const NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS = new Set(["tavily"]);
const LEGACY_WEB_SEARCH_PROVIDER_IDS = loadPluginManifestRegistry({ cache: true })
  .plugins.filter((plugin) => plugin.origin === "bundled")
  .flatMap((plugin) => plugin.contracts?.webSearchProviders ?? [])
  .filter((providerId) => !NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS.has(providerId))
  .toSorted((left, right) => left.localeCompare(right));
const LEGACY_WEB_SEARCH_PROVIDER_ID_SET = new Set(LEGACY_WEB_SEARCH_PROVIDER_IDS);
const LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID = "brave";

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneRecord<T extends JsonRecord>(value: T | undefined): T {
  return { ...value } as T;
}

function ensureRecord(target: JsonRecord, key: string): JsonRecord {
  const current = target[key];
  if (isRecord(current)) {
    return current;
  }
  const next: JsonRecord = {};
  target[key] = next;
  return next;
=======
// Legacy web-search config migration from tools.web.search to plugin-owned configs.
import { mergeMissing } from "../../../config/legacy.shared.js";
import {
  cloneRecord,
  ensureRecord,
  hasOwnKey,
  isRecord,
  type JsonRecord,
} from "./legacy-config-record-shared.js";

const DANGEROUS_RECORD_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const BUNDLED_LEGACY_WEB_SEARCH_OWNERS = new Map<string, string>([
  ["brave", "brave"],
  ["duckduckgo", "duckduckgo"],
  ["exa", "exa"],
  ["firecrawl", "firecrawl"],
  ["gemini", "google"],
  ["grok", "xai"],
  ["kimi", "moonshot"],
  ["minimax", "minimax"],
  ["ollama", "ollama"],
  ["parallel", "parallel"],
  ["parallel-free", "parallel"],
  ["perplexity", "perplexity"],
  ["searxng", "searxng"],
  ["tavily", "tavily"],
]);

// Tavily and Parallel (paid + free) only ever used the plugin-owned config path,
// so there is no legacy `tools.web.search.<id>.*` shape to migrate for them.
const NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS = new Set([
  "parallel",
  "parallel-free",
  "tavily",
]);
const LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID = "brave";

function getBundledLegacyWebSearchOwners(): ReadonlyMap<string, string> {
  return BUNDLED_LEGACY_WEB_SEARCH_OWNERS;
}

function getLegacyWebSearchProviderIds(
  owners: ReadonlyMap<string, string> = getBundledLegacyWebSearchOwners(),
): string[] {
  return [...owners.keys()]
    .filter((providerId) => !NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS.has(providerId))
    .toSorted((left, right) => left.localeCompare(right));
}

function getLegacyWebSearchProviderIdSet(owners: ReadonlyMap<string, string>): Set<string> {
  return new Set(getLegacyWebSearchProviderIds(owners));
>>>>>>> upstream/main
}

function resolveLegacySearchConfig(raw: unknown): JsonRecord | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }
  const tools = isRecord(raw.tools) ? raw.tools : undefined;
  const web = isRecord(tools?.web) ? tools.web : undefined;
  return isRecord(web?.search) ? web.search : undefined;
}

function copyLegacyProviderConfig(search: JsonRecord, providerKey: string): JsonRecord | undefined {
  const current = search[providerKey];
  return isRecord(current) ? cloneRecord(current) : undefined;
}

<<<<<<< HEAD
function hasOwnKey(target: JsonRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function hasMappedLegacyWebSearchConfig(raw: unknown): boolean {
=======
function hasMappedLegacyWebSearchConfig(
  raw: unknown,
  owners: ReadonlyMap<string, string>,
): boolean {
>>>>>>> upstream/main
  const search = resolveLegacySearchConfig(raw);
  if (!search) {
    return false;
  }
  if (hasOwnKey(search, "apiKey")) {
    return true;
  }
<<<<<<< HEAD
  return LEGACY_WEB_SEARCH_PROVIDER_IDS.some((providerId) => isRecord(search[providerId]));
}

function resolveLegacyGlobalWebSearchMigration(search: JsonRecord): {
=======
  return getLegacyWebSearchProviderIds(owners).some((providerId) => isRecord(search[providerId]));
}

function resolveLegacyGlobalWebSearchMigration(
  search: JsonRecord,
  owners: ReadonlyMap<string, string>,
): {
>>>>>>> upstream/main
  pluginId: string;
  payload: JsonRecord;
  legacyPath: string;
  targetPath: string;
} | null {
  const legacyProviderConfig = copyLegacyProviderConfig(
    search,
    LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID,
  );
  const payload = legacyProviderConfig ?? {};
  const hasLegacyApiKey = hasOwnKey(search, "apiKey");
  if (hasLegacyApiKey) {
    payload.apiKey = search.apiKey;
  }
  if (Object.keys(payload).length === 0) {
    return null;
  }
  const pluginId =
<<<<<<< HEAD
    resolveManifestContractOwnerPluginId({
      contract: "webSearchProviders",
      value: LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID,
      origin: "bundled",
    }) ?? LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID;
=======
    owners.get(LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID) ?? LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID;
>>>>>>> upstream/main
  return {
    pluginId,
    payload,
    legacyPath: hasLegacyApiKey
      ? "tools.web.search.apiKey"
      : `tools.web.search.${LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID}`,
    targetPath:
      hasLegacyApiKey && !legacyProviderConfig
        ? `plugins.entries.${pluginId}.config.webSearch.apiKey`
        : `plugins.entries.${pluginId}.config.webSearch`,
  };
}

function migratePluginWebSearchConfig(params: {
  root: JsonRecord;
  legacyPath: string;
  targetPath: string;
  pluginId: string;
  payload: JsonRecord;
  changes: string[];
}) {
  const plugins = ensureRecord(params.root, "plugins");
  const entries = ensureRecord(plugins, "entries");
  const entry = ensureRecord(entries, params.pluginId);
  const config = ensureRecord(entry, "config");
  const hadEnabled = entry.enabled !== undefined;
  const existing = isRecord(config.webSearch) ? cloneRecord(config.webSearch) : undefined;

  if (!hadEnabled) {
    entry.enabled = true;
  }

  if (!existing) {
    config.webSearch = cloneRecord(params.payload);
    params.changes.push(`Moved ${params.legacyPath} → ${params.targetPath}.`);
    return;
  }

  const merged = cloneRecord(existing);
  mergeMissing(merged, params.payload);
  const changed = JSON.stringify(merged) !== JSON.stringify(existing) || !hadEnabled;
  config.webSearch = merged;
  if (changed) {
    params.changes.push(
      `Merged ${params.legacyPath} → ${params.targetPath} (filled missing fields from legacy; kept explicit plugin config values).`,
    );
    return;
  }

  params.changes.push(`Removed ${params.legacyPath} (${params.targetPath} already set).`);
}

<<<<<<< HEAD
export function listLegacyWebSearchConfigPaths(raw: unknown): string[] {
=======
/** List legacy tools.web.search provider config paths present in raw config. */
export function listLegacyWebSearchConfigPaths(raw: unknown): string[] {
  const owners = getBundledLegacyWebSearchOwners();
>>>>>>> upstream/main
  const search = resolveLegacySearchConfig(raw);
  if (!search) {
    return [];
  }
  const paths: string[] = [];

  if ("apiKey" in search) {
    paths.push("tools.web.search.apiKey");
  }
<<<<<<< HEAD
  for (const providerId of LEGACY_WEB_SEARCH_PROVIDER_IDS) {
=======
  for (const providerId of getLegacyWebSearchProviderIds(owners)) {
>>>>>>> upstream/main
    const scoped = search[providerId];
    if (isRecord(scoped)) {
      for (const key of Object.keys(scoped)) {
        paths.push(`tools.web.search.${providerId}.${key}`);
      }
    }
  }
  return paths;
}

<<<<<<< HEAD
export function normalizeLegacyWebSearchConfig<T>(raw: T): T {
  if (!isRecord(raw)) {
    return raw;
  }

  const search = resolveLegacySearchConfig(raw);
  if (!search) {
    return raw;
  }

  return normalizeLegacyWebSearchConfigRecord(raw).config;
}

=======
/** Move legacy web-search provider config into provider plugin entries. */
>>>>>>> upstream/main
export function migrateLegacyWebSearchConfig<T>(raw: T): { config: T; changes: string[] } {
  if (!isRecord(raw)) {
    return { config: raw, changes: [] };
  }

<<<<<<< HEAD
  if (!hasMappedLegacyWebSearchConfig(raw)) {
    return { config: raw, changes: [] };
  }

  return normalizeLegacyWebSearchConfigRecord(raw);
=======
  const owners = getBundledLegacyWebSearchOwners();
  if (!hasMappedLegacyWebSearchConfig(raw, owners)) {
    return { config: raw, changes: [] };
  }

  return normalizeLegacyWebSearchConfigRecord(structuredClone(raw) as T & JsonRecord, owners);
>>>>>>> upstream/main
}

function normalizeLegacyWebSearchConfigRecord<T extends JsonRecord>(
  raw: T,
<<<<<<< HEAD
=======
  owners: ReadonlyMap<string, string>,
>>>>>>> upstream/main
): {
  config: T;
  changes: string[];
} {
  const nextRoot = cloneRecord(raw);
  const tools = ensureRecord(nextRoot, "tools");
  const web = ensureRecord(tools, "web");
  const search = resolveLegacySearchConfig(nextRoot);
  if (!search) {
    return { config: raw, changes: [] };
  }
  const nextSearch: JsonRecord = {};
  const changes: string[] = [];

  for (const [key, value] of Object.entries(search)) {
    if (key === "apiKey") {
      continue;
    }
<<<<<<< HEAD
    if (LEGACY_WEB_SEARCH_PROVIDER_ID_SET.has(key) && isRecord(value)) {
      continue;
    }
    if (MODERN_SCOPED_WEB_SEARCH_KEYS.has(key) || !isRecord(value)) {
      nextSearch[key] = value;
    }
  }
  web.search = nextSearch;

  const globalSearchMigration = resolveLegacyGlobalWebSearchMigration(search);
=======
    if (getLegacyWebSearchProviderIdSet(owners).has(key) && isRecord(value)) {
      continue;
    }
    if (DANGEROUS_RECORD_KEYS.has(key)) {
      continue;
    }
    nextSearch[key] = value;
  }
  web.search = nextSearch;

  const globalSearchMigration = resolveLegacyGlobalWebSearchMigration(search, owners);
>>>>>>> upstream/main
  if (globalSearchMigration) {
    migratePluginWebSearchConfig({
      root: nextRoot,
      legacyPath: globalSearchMigration.legacyPath,
      targetPath: globalSearchMigration.targetPath,
      pluginId: globalSearchMigration.pluginId,
      payload: globalSearchMigration.payload,
      changes,
    });
  }

<<<<<<< HEAD
  for (const providerId of LEGACY_WEB_SEARCH_PROVIDER_IDS) {
=======
  for (const providerId of getLegacyWebSearchProviderIds(owners)) {
>>>>>>> upstream/main
    if (providerId === LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID) {
      continue;
    }
    const scoped = copyLegacyProviderConfig(search, providerId);
    if (!scoped || Object.keys(scoped).length === 0) {
      continue;
    }
<<<<<<< HEAD
    const pluginId = resolveManifestContractOwnerPluginId({
      contract: "webSearchProviders",
      value: providerId,
      origin: "bundled",
    });
=======
    const pluginId = owners.get(providerId);
>>>>>>> upstream/main
    if (!pluginId) {
      continue;
    }
    migratePluginWebSearchConfig({
      root: nextRoot,
      legacyPath: `tools.web.search.${providerId}`,
      targetPath: `plugins.entries.${pluginId}.config.webSearch`,
      pluginId,
      payload: scoped,
      changes,
    });
  }

  return { config: nextRoot, changes };
}
<<<<<<< HEAD

export function resolvePluginWebSearchConfig(
  config: OpenClawConfig | undefined,
  pluginId: string,
): Record<string, unknown> | undefined {
  const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
  if (!isRecord(pluginConfig)) {
    return undefined;
  }
  const webSearch = pluginConfig.webSearch;
  return isRecord(webSearch) ? webSearch : undefined;
}
=======
>>>>>>> upstream/main
