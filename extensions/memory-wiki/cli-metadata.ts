<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/core";
=======
// Memory Wiki plugin module implements cli metadata behavior.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
>>>>>>> upstream/main

export default definePluginEntry({
  id: "memory-wiki",
  name: "Memory Wiki",
  description: "Persistent wiki compiler and Obsidian-friendly knowledge vault for OpenClaw.",
  register(api) {
    api.registerCli(
<<<<<<< HEAD
      async ({ program }) => {
        const { registerWikiCli } = await import("./src/cli.js");
        registerWikiCli(program);
=======
      async ({ program, config: appConfig }) => {
        const [{ registerWikiCli }, { resolveMemoryWikiConfig }] = await Promise.all([
          import("./src/cli.js"),
          import("./src/config.js"),
        ]);
        const pluginConfig = appConfig.plugins?.entries?.["memory-wiki"]?.config;
        registerWikiCli(program, resolveMemoryWikiConfig(pluginConfig), appConfig);
>>>>>>> upstream/main
      },
      {
        descriptors: [
          {
            name: "wiki",
            description: "Inspect and initialize the memory wiki vault",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
