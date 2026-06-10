<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { clearPluginDiscoveryCache } from "../plugins/discovery.js";
import {
  clearPluginManifestRegistryCache,
  type PluginManifestRegistry,
} from "../plugins/manifest-registry.js";
import { clearPluginSetupRegistryCache } from "../plugins/setup-registry.js";
import {
  cleanupTrackedTempDirs,
  makeTrackedTempDir,
  mkdirSafeDir,
} from "../plugins/test-helpers/fs-fixtures.js";

const tempDirs: string[] = [];

export function resetPluginAutoEnableTestState(): void {
  clearPluginDiscoveryCache();
  clearPluginManifestRegistryCache();
=======
// Provides fixtures for plugin auto-enable config tests.
import path from "node:path";
import { clearCurrentPluginMetadataSnapshot } from "../plugins/current-plugin-metadata-snapshot.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import { clearPluginSetupRegistryCache } from "../plugins/setup-registry.js";
import { cleanupTrackedTempDirs, makeTrackedTempDir } from "../plugins/test-helpers/fs-fixtures.js";

const tempDirs: string[] = [];

/** Clears auto-enable plugin caches and temp dirs between tests. */
export function resetPluginAutoEnableTestState(): void {
  clearCurrentPluginMetadataSnapshot();
>>>>>>> upstream/main
  clearPluginSetupRegistryCache();
  cleanupTrackedTempDirs(tempDirs);
}

export function makeTempDir(): string {
  return makeTrackedTempDir("openclaw-plugin-auto-enable", tempDirs);
}

export function makeIsolatedEnv(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const rootDir = makeTempDir();
  return {
    OPENCLAW_STATE_DIR: path.join(rootDir, "state"),
<<<<<<< HEAD
=======
    OPENCLAW_BUNDLED_PLUGINS_DIR: path.join(process.cwd(), "extensions"),
    OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR: "1",
    VITEST: "true",
>>>>>>> upstream/main
    ...overrides,
  };
}

<<<<<<< HEAD
export function writePluginManifestFixture(params: {
  rootDir: string;
  id: string;
  channels: string[];
}): void {
  mkdirSafeDir(params.rootDir);
  fs.writeFileSync(
    path.join(params.rootDir, "openclaw.plugin.json"),
    JSON.stringify(
      {
        id: params.id,
        channels: params.channels,
        configSchema: { type: "object" },
      },
      null,
      2,
    ),
    "utf-8",
  );
  fs.writeFileSync(path.join(params.rootDir, "index.ts"), "export default {}", "utf-8");
}

=======
>>>>>>> upstream/main
export function makeRegistry(
  plugins: Array<{
    id: string;
    channels: string[];
<<<<<<< HEAD
    autoEnableWhenConfiguredProviders?: string[];
    modelSupport?: { modelPrefixes?: string[]; modelPatterns?: string[] };
    contracts?: { webSearchProviders?: string[]; webFetchProviders?: string[] };
    providers?: string[];
    channelConfigs?: Record<string, { schema: Record<string, unknown>; preferOver?: string[] }>;
=======
    activation?: { onAgentHarnesses?: string[] };
    autoEnableWhenConfiguredProviders?: string[];
    modelSupport?: { modelPrefixes?: string[]; modelPatterns?: string[] };
    contracts?: { webSearchProviders?: string[]; webFetchProviders?: string[]; tools?: string[] };
    providers?: string[];
    cliBackends?: string[];
    origin?: PluginOrigin;
    configSchema?: Record<string, unknown>;
    channelConfigs?: Record<
      string,
      { schema: Record<string, unknown>; label?: string; preferOver?: string[] }
    >;
>>>>>>> upstream/main
  }>,
): PluginManifestRegistry {
  return {
    plugins: plugins.map((plugin) => ({
      id: plugin.id,
      channels: plugin.channels,
<<<<<<< HEAD
      autoEnableWhenConfiguredProviders: plugin.autoEnableWhenConfiguredProviders,
      modelSupport: plugin.modelSupport,
      contracts: plugin.contracts,
      channelConfigs: plugin.channelConfigs,
      providers: plugin.providers ?? [],
      skills: [],
      hooks: [],
      origin: "config" as const,
=======
      activation: plugin.activation,
      autoEnableWhenConfiguredProviders: plugin.autoEnableWhenConfiguredProviders,
      modelSupport: plugin.modelSupport,
      contracts: plugin.contracts,
      configSchema: plugin.configSchema,
      channelConfigs: plugin.channelConfigs,
      providers: plugin.providers ?? [],
      cliBackends: plugin.cliBackends ?? [],
      skills: [],
      hooks: [],
      origin: plugin.origin ?? "config",
>>>>>>> upstream/main
      rootDir: `/fake/${plugin.id}`,
      source: `/fake/${plugin.id}/index.js`,
      manifestPath: `/fake/${plugin.id}/openclaw.plugin.json`,
    })),
    diagnostics: [],
  };
}

export function makeApnChannelConfig() {
  return { channels: { apn: { someKey: "value" } } };
}
<<<<<<< HEAD

export function makeBluebubblesAndImessageChannels() {
  return {
    bluebubbles: { serverUrl: "http://localhost:1234", password: "x" },
    imessage: { cliPath: "/usr/local/bin/imsg" },
  };
}
=======
>>>>>>> upstream/main
