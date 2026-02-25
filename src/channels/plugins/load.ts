<<<<<<< HEAD
import type { PluginRegistry } from "../../plugins/registry.js";
=======
import { createChannelRegistryLoader } from "./registry-loader.js";
>>>>>>> upstream/main
import type { ChannelId, ChannelPlugin } from "./types.js";
import { getActivePluginRegistry } from "../../plugins/runtime.js";

const loadPluginFromRegistry = createChannelRegistryLoader<ChannelPlugin>((entry) => entry.plugin);

export async function loadChannelPlugin(id: ChannelId): Promise<ChannelPlugin | undefined> {
  return loadPluginFromRegistry(id);
}
