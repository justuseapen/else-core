<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/core";

=======
/**
 * Browser CLI metadata entry. It registers the `openclaw browser` command lazily
 * so command discovery does not load the full browser runtime.
 */
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

/** Plugin entry that contributes Browser CLI commands. */
>>>>>>> upstream/main
export default definePluginEntry({
  id: "browser",
  name: "Browser",
  description: "Default browser tool plugin",
  register(api) {
    api.registerCli(
      async ({ program }) => {
<<<<<<< HEAD
        const { registerBrowserCli } = await import("./runtime-api.js");
=======
        const { registerBrowserCli } = await import("./src/cli/browser-cli.js");
>>>>>>> upstream/main
        registerBrowserCli(program);
      },
      { commands: ["browser"] },
    );
  },
});
