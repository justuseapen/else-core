<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";
import { buildChannelConfigSchema } from "../channels/plugins/config-schema.js";
import type { ChannelConfigRuntimeSchema } from "../channels/plugins/types.plugin.js";
=======
/** Loads bundled channel config schema metadata from source or public surface modules. */
import fs from "node:fs";
import path from "node:path";
import {
  buildChannelConfigSchema,
  buildJsonChannelConfigSchema,
} from "../channels/plugins/config-schema.js";
import type { ChannelConfigRuntimeSchema } from "../channels/plugins/types.config.js";
import type { JsonSchemaObject } from "../shared/json-schema.types.js";
import {
  normalizeBundledPluginStringList,
  trimBundledPluginString,
} from "./bundled-plugin-scan.js";
import type { PluginConfigUiHint } from "./manifest-types.js";
>>>>>>> upstream/main
import type {
  OpenClawPackageManifest,
  PluginManifest,
  PluginManifestChannelConfig,
} from "./manifest.js";
import {
<<<<<<< HEAD
  buildPluginLoaderAliasMap,
  buildPluginLoaderJitiOptions,
  shouldPreferNativeJiti,
} from "./sdk-alias.js";
import type { PluginConfigUiHint } from "./types.js";

const PUBLIC_SURFACE_SOURCE_EXTENSIONS = [".ts", ".mts", ".js", ".mjs", ".cts", ".cjs"] as const;
=======
  createPluginModuleLoaderCache,
  getCachedPluginModuleLoader,
  type PluginModuleLoaderCache,
} from "./plugin-module-loader-cache.js";
import { PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./public-surface-runtime.js";

>>>>>>> upstream/main
const SOURCE_CONFIG_SCHEMA_CANDIDATES = [
  path.join("src", "config-schema.ts"),
  path.join("src", "config-schema.js"),
  path.join("src", "config-schema.mts"),
  path.join("src", "config-schema.mjs"),
  path.join("src", "config-schema.cts"),
  path.join("src", "config-schema.cjs"),
] as const;
<<<<<<< HEAD
const PUBLIC_CONFIG_SURFACE_BASENAMES = ["channel-config-api", "runtime-api", "api"] as const;

type ChannelConfigSurface = {
  schema: Record<string, unknown>;
=======
const PUBLIC_CONFIG_SURFACE_BASENAMES = ["channel-config-api"] as const;

type ChannelConfigSurface = {
  schema: JsonSchemaObject;
>>>>>>> upstream/main
  uiHints?: Record<string, PluginConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
};

<<<<<<< HEAD
const jitiLoaders = new Map<string, ReturnType<typeof createJiti>>();

function trimString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => trimString(entry) ?? "").filter(Boolean);
}
=======
const moduleLoaders: PluginModuleLoaderCache = createPluginModuleLoaderCache();
>>>>>>> upstream/main

function isBuiltChannelConfigSchema(value: unknown): value is ChannelConfigSurface {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as { schema?: unknown };
  return Boolean(candidate.schema && typeof candidate.schema === "object");
}

<<<<<<< HEAD
=======
function isJsonSchemaConfigSurface(value: unknown): value is JsonSchemaObject {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.safeParse === "function" || typeof candidate.toJSONSchema === "function") {
    return false;
  }
  return (
    typeof candidate.type === "string" ||
    Array.isArray(candidate.anyOf) ||
    Array.isArray(candidate.oneOf) ||
    Array.isArray(candidate.allOf) ||
    Array.isArray(candidate.enum) ||
    Object.hasOwn(candidate, "const")
  );
}

>>>>>>> upstream/main
function resolveConfigSchemaExport(imported: Record<string, unknown>): ChannelConfigSurface | null {
  for (const [name, value] of Object.entries(imported)) {
    if (name.endsWith("ChannelConfigSchema") && isBuiltChannelConfigSchema(value)) {
      return value;
    }
  }

  for (const [name, value] of Object.entries(imported)) {
    if (!name.endsWith("ConfigSchema") || name.endsWith("AccountConfigSchema")) {
      continue;
    }
    if (isBuiltChannelConfigSchema(value)) {
      return value;
    }
<<<<<<< HEAD
=======
    if (isJsonSchemaConfigSurface(value)) {
      return buildJsonChannelConfigSchema(value);
    }
>>>>>>> upstream/main
    if (value && typeof value === "object") {
      return buildChannelConfigSchema(value as never);
    }
  }

  for (const value of Object.values(imported)) {
    if (isBuiltChannelConfigSchema(value)) {
      return value;
    }
  }

  return null;
}

<<<<<<< HEAD
function getJiti(modulePath: string) {
  const tryNative =
    shouldPreferNativeJiti(modulePath) || modulePath.includes(`${path.sep}dist${path.sep}`);
  const aliasMap = buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url);
  const cacheKey = JSON.stringify({
    tryNative,
    aliasMap: Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)),
  });
  const cached = jitiLoaders.get(cacheKey);
  if (cached) {
    return cached;
  }
  const loader = createJiti(import.meta.url, {
    ...buildPluginLoaderJitiOptions(aliasMap),
    tryNative,
  });
  jitiLoaders.set(cacheKey, loader);
  return loader;
=======
function getModuleLoader(modulePath: string) {
  return getCachedPluginModuleLoader({
    cache: moduleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    preferBuiltDist: true,
    loaderFilename: import.meta.url,
  });
>>>>>>> upstream/main
}

function resolveChannelConfigSchemaModulePath(pluginDir: string): string | undefined {
  for (const relativePath of SOURCE_CONFIG_SCHEMA_CANDIDATES) {
    const candidate = path.join(pluginDir, relativePath);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  for (const basename of PUBLIC_CONFIG_SURFACE_BASENAMES) {
    for (const extension of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
      const candidate = path.join(pluginDir, `${basename}${extension}`);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  return undefined;
}

function loadChannelConfigSurfaceModuleSync(modulePath: string): ChannelConfigSurface | null {
  try {
<<<<<<< HEAD
    const imported = getJiti(modulePath)(modulePath) as Record<string, unknown>;
=======
    const imported = getModuleLoader(modulePath)(modulePath) as Record<string, unknown>;
>>>>>>> upstream/main
    return resolveConfigSchemaExport(imported);
  } catch {
    return null;
  }
}

function resolvePackageChannelMeta(
  packageManifest: OpenClawPackageManifest | undefined,
  channelId: string,
): OpenClawPackageManifest["channel"] | undefined {
  const channelMeta = packageManifest?.channel;
  return channelMeta?.id?.trim() === channelId ? channelMeta : undefined;
}

export function collectBundledChannelConfigs(params: {
  pluginDir: string;
  manifest: PluginManifest;
  packageManifest?: OpenClawPackageManifest;
}): Record<string, PluginManifestChannelConfig> | undefined {
<<<<<<< HEAD
  const channelIds = normalizeStringList(params.manifest.channels);
=======
  const channelIds = normalizeBundledPluginStringList(params.manifest.channels);
>>>>>>> upstream/main
  const existingChannelConfigs: Record<string, PluginManifestChannelConfig> =
    params.manifest.channelConfigs && Object.keys(params.manifest.channelConfigs).length > 0
      ? { ...params.manifest.channelConfigs }
      : {};
  if (channelIds.length === 0) {
    return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : undefined;
  }

  const surfaceModulePath = resolveChannelConfigSchemaModulePath(params.pluginDir);
  const surface = surfaceModulePath ? loadChannelConfigSurfaceModuleSync(surfaceModulePath) : null;

  for (const channelId of channelIds) {
    const existing = existingChannelConfigs[channelId];
    const channelMeta = resolvePackageChannelMeta(params.packageManifest, channelId);
<<<<<<< HEAD
    const preferOver = normalizeStringList(channelMeta?.preferOver);
=======
    const preferOver = normalizeBundledPluginStringList(channelMeta?.preferOver);
>>>>>>> upstream/main
    const uiHints: Record<string, PluginConfigUiHint> | undefined =
      surface?.uiHints || existing?.uiHints
        ? {
            ...(surface?.uiHints && Object.keys(surface.uiHints).length > 0 ? surface.uiHints : {}),
            ...(existing?.uiHints && Object.keys(existing.uiHints).length > 0
              ? existing.uiHints
              : {}),
          }
        : undefined;

    if (!surface?.schema && !existing?.schema) {
      continue;
    }

    existingChannelConfigs[channelId] = {
      schema: surface?.schema ?? existing?.schema ?? {},
      ...(uiHints && Object.keys(uiHints).length > 0 ? { uiHints } : {}),
      ...((surface?.runtime ?? existing?.runtime)
        ? { runtime: surface?.runtime ?? existing?.runtime }
        : {}),
<<<<<<< HEAD
      ...((trimString(existing?.label) ?? trimString(channelMeta?.label))
        ? { label: trimString(existing?.label) ?? trimString(channelMeta?.label)! }
        : {}),
      ...((trimString(existing?.description) ?? trimString(channelMeta?.blurb))
        ? {
            description: trimString(existing?.description) ?? trimString(channelMeta?.blurb)!,
=======
      ...((trimBundledPluginString(existing?.label) ?? trimBundledPluginString(channelMeta?.label))
        ? {
            label:
              trimBundledPluginString(existing?.label) ??
              trimBundledPluginString(channelMeta?.label)!,
          }
        : {}),
      ...((trimBundledPluginString(existing?.description) ??
      trimBundledPluginString(channelMeta?.blurb))
        ? {
            description:
              trimBundledPluginString(existing?.description) ??
              trimBundledPluginString(channelMeta?.blurb)!,
>>>>>>> upstream/main
          }
        : {}),
      ...(existing?.preferOver?.length
        ? { preferOver: existing.preferOver }
        : preferOver.length > 0
          ? { preferOver }
          : {}),
<<<<<<< HEAD
=======
      ...((existing?.commands ?? channelMeta?.commands)
        ? { commands: existing?.commands ?? channelMeta?.commands }
        : {}),
>>>>>>> upstream/main
    };
  }

  return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : undefined;
}
