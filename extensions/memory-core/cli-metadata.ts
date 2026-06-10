<<<<<<< HEAD
=======
// Memory Core plugin module implements cli metadata behavior.
>>>>>>> upstream/main
import { definePluginEntry } from "openclaw/plugin-sdk/core";

export default definePluginEntry({
  id: "memory-core",
  name: "Memory (Core)",
  description: "File-backed memory search tools and CLI",
  register(api) {
    api.registerCli(
      async ({ program }) => {
<<<<<<< HEAD
        const { registerMemoryCli } = await import("./src/cli.js");
=======
        const { registerMemoryCli } = await import("./cli.js");
>>>>>>> upstream/main
        registerMemoryCli(program);
      },
      {
        descriptors: [
          {
            name: "memory",
            description: "Search, inspect, and reindex memory files",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
