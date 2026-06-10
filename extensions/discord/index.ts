<<<<<<< HEAD
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";

type DiscordSubagentHooksModule = typeof import("./subagent-hooks-api.js");

let discordSubagentHooksPromise: Promise<DiscordSubagentHooksModule> | null = null;

function loadDiscordSubagentHooksModule() {
  discordSubagentHooksPromise ??= import("./subagent-hooks-api.js");
  return discordSubagentHooksPromise;
}

=======
// Discord plugin entrypoint registers its OpenClaw integration.
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { registerDiscordSubagentHooks } from "./subagent-hooks-api.js";
import { discordVoiceTranscriptsSourceProvider } from "./transcripts-source-api.js";

>>>>>>> upstream/main
export default defineBundledChannelEntry({
  id: "discord",
  name: "Discord",
  description: "Discord channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "discordPlugin",
  },
  runtime: {
<<<<<<< HEAD
    specifier: "./runtime-api.js",
    exportName: "setDiscordRuntime",
  },
  registerFull(api) {
    api.on("subagent_spawning", async (event) => {
      const { handleDiscordSubagentSpawning } = await loadDiscordSubagentHooksModule();
      return await handleDiscordSubagentSpawning(api, event);
    });
    api.on("subagent_ended", async (event) => {
      const { handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
      handleDiscordSubagentEnded(event);
    });
    api.on("subagent_delivery_target", async (event) => {
      const { handleDiscordSubagentDeliveryTarget } = await loadDiscordSubagentHooksModule();
      return handleDiscordSubagentDeliveryTarget(event);
    });
=======
    specifier: "./runtime-setter-api.js",
    exportName: "setDiscordRuntime",
  },
  accountInspect: {
    specifier: "./account-inspect-api.js",
    exportName: "inspectDiscordReadOnlyAccount",
  },
  registerFull(api) {
    registerDiscordSubagentHooks(api);
    api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
>>>>>>> upstream/main
  },
});
