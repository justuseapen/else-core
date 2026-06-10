<<<<<<< HEAD
import {
  listBundledChannelPlugins,
=======
// Test helper for installing bundled channel plugins into the active plugin registry.
import {
  getBundledChannelPlugin,
  listBundledChannelPluginIds,
>>>>>>> upstream/main
  setBundledChannelRuntime,
} from "../channels/plugins/bundled.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import type { PluginRuntime } from "../plugins/runtime/index.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";

function resolveChannelPluginsForTests(onlyPluginIds?: readonly string[]) {
<<<<<<< HEAD
  const scopedIds = onlyPluginIds ? new Set(onlyPluginIds) : null;
  return listBundledChannelPlugins().filter((plugin) => !scopedIds || scopedIds.has(plugin.id));
=======
  const ids = onlyPluginIds ?? listBundledChannelPluginIds();
  return ids.flatMap((id) => {
    const plugin = getBundledChannelPlugin(id);
    return plugin ? [plugin] : [];
  });
>>>>>>> upstream/main
}

function createChannelTestRuntime(): PluginRuntime {
  return {
    state: {
      resolveStateDir: (_env, homeDir) => (homeDir ?? (() => "/tmp"))(),
    },
  } as PluginRuntime;
}

<<<<<<< HEAD
export function setChannelPluginRegistryForTests(onlyPluginIds?: readonly string[]): void {
=======
function setChannelPluginRegistryForTests(onlyPluginIds?: readonly string[]): void {
>>>>>>> upstream/main
  const plugins = resolveChannelPluginsForTests(onlyPluginIds);
  const runtime = createChannelTestRuntime();
  for (const plugin of plugins) {
    try {
      setBundledChannelRuntime(plugin.id, runtime);
    } catch {
      // Most bundled channels do not need a runtime setter for contract tests.
    }
  }

  const channels = plugins.map((plugin) => ({
    pluginId: plugin.id,
    plugin,
    source: "test" as const,
  })) as unknown as Parameters<typeof createTestRegistry>[0];
  setActivePluginRegistry(createTestRegistry(channels));
}

<<<<<<< HEAD
=======
/** Reset the active plugin registry to bundled channel plugins for command tests. */
>>>>>>> upstream/main
export function setDefaultChannelPluginRegistryForTests(): void {
  setChannelPluginRegistryForTests();
}
