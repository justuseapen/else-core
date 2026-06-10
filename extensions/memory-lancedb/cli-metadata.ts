<<<<<<< HEAD
=======
// Memory Lancedb plugin module implements cli metadata behavior.
>>>>>>> upstream/main
import { definePluginEntry } from "openclaw/plugin-sdk/core";

export default definePluginEntry({
  id: "memory-lancedb",
  name: "Memory LanceDB",
  description: "LanceDB-backed memory provider",
  register(api) {
<<<<<<< HEAD
    api.registerCli(() => {}, { commands: ["ltm"] });
=======
    api.registerCli(() => {}, {
      descriptors: [
        {
          name: "ltm",
          description: "Inspect and query LanceDB-backed memory",
          hasSubcommands: true,
        },
      ],
    });
>>>>>>> upstream/main
  },
});
