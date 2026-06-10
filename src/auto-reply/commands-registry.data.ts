/** Built-in and channel-derived command registry data for auto-reply commands. */
import { listLoadedChannelPlugins } from "../channels/plugins/registry-loaded.js";
import { getActivePluginChannelRegistryVersionFromState } from "../plugins/runtime-channel-state.js";
import {
  assertCommandRegistry,
  buildBuiltinChatCommands,
  defineChatCommand,
} from "./commands-registry.shared.js";
import type { ChatCommandDefinition } from "./commands-registry.types.js";
import { listThinkingLevels } from "./thinking.js";

/** Builds and caches the chat-command registry for the current channel-plugin registry version. */
type ChannelPlugin = ReturnType<typeof listLoadedChannelPlugins>[number];

function supportsNativeCommands(plugin: ChannelPlugin): boolean {
  return plugin.capabilities?.nativeCommands === true;
}

function supportsNativeCommands(plugin: ChannelPlugin): boolean {
  return plugin.capabilities?.nativeCommands === true;
}

function defineDockCommand(plugin: ChannelPlugin): ChatCommandDefinition {
  return defineChatCommand({
    key: `dock:${plugin.id}`,
    nativeName: `dock_${plugin.id}`,
    description: `Switch to ${plugin.id} for replies.`,
    textAliases: [`/dock-${plugin.id}`, `/dock_${plugin.id}`],
    category: "docks",
  });
}

let cachedCommands: ChatCommandDefinition[] | null = null;
let cachedRegistryVersion = -1;

function buildChatCommands(): ChatCommandDefinition[] {
  const commands: ChatCommandDefinition[] = [
<<<<<<< HEAD
    ...buildBuiltinChatCommands(),
    ...listChannelPlugins()
=======
    ...buildBuiltinChatCommands({ listThinkingLevels }),
    ...listLoadedChannelPlugins()
>>>>>>> upstream/main
      .filter(supportsNativeCommands)
      .map((plugin) => defineDockCommand(plugin)),
  ];

  assertCommandRegistry(commands);
  return commands;
}

/** Returns the current command registry, including dynamic dock commands for native surfaces. */
export function getChatCommands(): ChatCommandDefinition[] {
  const registryVersion = getActivePluginChannelRegistryVersionFromState();
  if (cachedCommands && registryVersion === cachedRegistryVersion) {
    return cachedCommands;
  }
  const commands = buildChatCommands();
  cachedCommands = commands;
  cachedRegistryVersion = registryVersion;
  return commands;
}
<<<<<<< HEAD

export function getNativeCommandSurfaces(): Set<string> {
  const registry = getActivePluginRegistry();
  if (cachedNativeCommandSurfaces && registry === cachedNativeRegistry) {
    return cachedNativeCommandSurfaces;
  }
  cachedNativeCommandSurfaces = new Set(
    listChannelPlugins()
      .filter(supportsNativeCommands)
      .map((plugin) => plugin.id),
  );
  cachedNativeRegistry = registry;
  return cachedNativeCommandSurfaces;
}
=======
>>>>>>> upstream/main
