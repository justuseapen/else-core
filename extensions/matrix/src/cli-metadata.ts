<<<<<<< HEAD
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
=======
// Matrix plugin module implements cli metadata behavior.
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/channel-plugin-common";
>>>>>>> upstream/main

export function registerMatrixCliMetadata(api: OpenClawPluginApi) {
  api.registerCli(
    async ({ program }) => {
      const { registerMatrixCli } = await import("./cli.js");
      registerMatrixCli({ program });
    },
    {
      descriptors: [
        {
          name: "matrix",
          description: "Manage Matrix accounts, verification, devices, and profile state",
          hasSubcommands: true,
        },
      ],
    },
  );
}
