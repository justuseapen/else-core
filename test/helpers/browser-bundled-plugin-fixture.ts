<<<<<<< HEAD
=======
// Browser bundled plugin fixtures build browser extension plugin layouts for tests.
>>>>>>> upstream/main
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

<<<<<<< HEAD
=======
// Bundled browser plugin fixture used by plugin/package tests.

>>>>>>> upstream/main
const BROWSER_FIXTURE_MANIFEST = {
  id: "browser",
  enabledByDefault: true,
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {},
  },
};

const BROWSER_FIXTURE_ENTRY = `module.exports = {
  id: "browser",
  name: "Browser",
  description: "Bundled browser fixture plugin",
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {},
  },
  register(api) {
<<<<<<< HEAD
    api.registerTool(() => ({
=======
    api.registerTool((ctx) => ({
>>>>>>> upstream/main
      name: "browser",
      label: "browser",
      description: "browser fixture tool",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        return {
          content: [{ type: "text", text: "ok" }],
<<<<<<< HEAD
          details: {},
=======
          details: {
            workspaceOnly: ctx.fsPolicy?.workspaceOnly ?? null,
          },
>>>>>>> upstream/main
        };
      },
    }));
    api.registerCli(({ program }) => {
      program.command("browser");
    }, { commands: ["browser"] });
    api.registerGatewayMethod("browser.request", async () => ({ ok: true }), {
<<<<<<< HEAD
      scope: "operator.write",
=======
      scope: "operator.admin",
>>>>>>> upstream/main
    });
    api.registerService({
      id: "browser-control",
      start() {},
    });
  },
};`;

<<<<<<< HEAD
=======
/** Create a temporary bundled browser plugin fixture and cleanup callback. */
>>>>>>> upstream/main
export function createBundledBrowserPluginFixture(): { rootDir: string; cleanup: () => void } {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-browser-bundled-"));
  const pluginDir = path.join(rootDir, "browser");
  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(
    path.join(pluginDir, "openclaw.plugin.json"),
    JSON.stringify(BROWSER_FIXTURE_MANIFEST, null, 2),
    "utf8",
  );
  fs.writeFileSync(path.join(pluginDir, "index.js"), BROWSER_FIXTURE_ENTRY, "utf8");
  return {
    rootDir,
    cleanup() {
      fs.rmSync(rootDir, { recursive: true, force: true });
    },
  };
}
