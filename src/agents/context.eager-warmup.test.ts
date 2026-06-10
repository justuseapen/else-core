<<<<<<< HEAD
=======
// Verifies importing context helpers does not eagerly load runtime config for
// lightweight CLI commands.
import { importFreshModule } from "openclaw/plugin-sdk/test-fixtures";
>>>>>>> upstream/main
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const loadConfigMock = vi.hoisted(() => vi.fn());

<<<<<<< HEAD
vi.mock("../config/config.js", () => ({
  loadConfig: loadConfigMock,
}));
=======
vi.mock("../config/config.js", () => ({ getRuntimeConfig: loadConfigMock }));
>>>>>>> upstream/main

describe("agents/context eager warmup", () => {
  const originalArgv = process.argv.slice();

  beforeEach(() => {
<<<<<<< HEAD
    vi.resetModules();
=======
>>>>>>> upstream/main
    loadConfigMock.mockReset();
  });

  afterEach(() => {
    process.argv = originalArgv.slice();
  });

  it.each([
    ["models", ["node", "openclaw", "models", "set", "openai/gpt-5.4"]],
    ["agent", ["node", "openclaw", "agent", "--message", "ok"]],
<<<<<<< HEAD
  ])("does not eager-load config for %s commands on import", async (_label, argv) => {
    process.argv = argv;
    await import("./context.js");
=======
    ["memory", ["node", "openclaw", "memory", "search", "--json"]],
  ])("does not eager-load config for %s commands on import", async (_label, argv) => {
    // Import-time config reads are expensive and can fail for commands that only
    // need static context helpers.
    process.argv = argv;
    await importFreshModule(import.meta.url, `./context.js?scope=${_label}`);
>>>>>>> upstream/main

    expect(loadConfigMock).not.toHaveBeenCalled();
  });
});
