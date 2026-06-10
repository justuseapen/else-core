<<<<<<< HEAD
import { discoverOpenClawPlugins } from "./discovery.js";
import {
  loadPluginManifest,
  type PluginPackageChannel,
  type PluginPackageInstall,
} from "./manifest.js";
import type { PluginOrigin } from "./types.js";
=======
// Maintains channel catalog entries advertised by plugins.
import { normalizeOptionalString as resolveOptionalString } from "@openclaw/normalization-core/string-coerce";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import { discoverOpenClawPlugins, type PluginDiscoveryResult } from "./discovery.js";
import { loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader.js";
import type { PluginPackageChannel, PluginPackageInstall } from "./manifest.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
>>>>>>> upstream/main

export type PluginChannelCatalogEntry = {
  pluginId: string;
  origin: PluginOrigin;
  packageName?: string;
  workspaceDir?: string;
  rootDir: string;
  channel: PluginPackageChannel;
  install?: PluginPackageInstall;
};

export function listChannelCatalogEntries(
  params: {
    origin?: PluginOrigin;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
  } = {},
): PluginChannelCatalogEntry[] {
  return discoverOpenClawPlugins({
    workspaceDir: params.workspaceDir,
    env: params.env,
  }).candidates.flatMap((candidate) => {
=======
    /**
     * Optional override.  When omitted and `origin !== "bundled"`, the persisted
     * plugin install ledger is loaded synchronously so that npm-installed
     * channels stored outside the discovery roots are visible to the catalog.
     * Bundled-only callers skip the load to avoid the disk read.
     */
    installRecords?: Record<string, PluginInstallRecord>;
    discovery?: PluginDiscoveryResult;
  } = {},
): PluginChannelCatalogEntry[] {
  const installRecords = resolveInstallRecords(params);
  const discovery =
    params.discovery ??
    discoverOpenClawPlugins({
      workspaceDir: params.workspaceDir,
      env: params.env,
      ...(installRecords && Object.keys(installRecords).length > 0 ? { installRecords } : {}),
    });
  return discovery.candidates.flatMap((candidate) => {
>>>>>>> upstream/main
    if (params.origin && candidate.origin !== params.origin) {
      return [];
    }
    const channel = candidate.packageManifest?.channel;
    if (!channel?.id) {
      return [];
    }
<<<<<<< HEAD
    const manifest = loadPluginManifest(candidate.rootDir, candidate.origin !== "bundled");
    if (!manifest.ok) {
=======
    const pluginId = resolveChannelCatalogPluginId(candidate);
    if (!pluginId) {
>>>>>>> upstream/main
      return [];
    }
    return [
      {
<<<<<<< HEAD
        pluginId: manifest.manifest.id,
=======
        pluginId,
>>>>>>> upstream/main
        origin: candidate.origin,
        packageName: candidate.packageName,
        workspaceDir: candidate.workspaceDir,
        rootDir: candidate.rootDir,
        channel,
        ...(candidate.packageManifest?.install
          ? { install: candidate.packageManifest.install }
          : {}),
      },
    ];
  });
}
<<<<<<< HEAD
=======

function resolveChannelCatalogPluginId(
  candidate: PluginDiscoveryResult["candidates"][number],
): string | undefined {
  return (
    resolveOptionalString(candidate.bundledManifest?.id) ??
    resolveOptionalString(candidate.bundledManifestId) ??
    resolveOptionalString(candidate.packageManifest?.plugin?.id) ??
    resolveOptionalString(candidate.idHint)
  );
}

function resolveInstallRecords(params: {
  origin?: PluginOrigin;
  env?: NodeJS.ProcessEnv;
  installRecords?: Record<string, PluginInstallRecord>;
}): Record<string, PluginInstallRecord> | undefined {
  if (params.installRecords) {
    return params.installRecords;
  }
  if (params.origin === "bundled") {
    return undefined;
  }
  try {
    return loadInstalledPluginIndexInstallRecordsSync(params.env ? { env: params.env } : {});
  } catch {
    return undefined;
  }
}
>>>>>>> upstream/main
