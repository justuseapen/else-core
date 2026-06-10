<<<<<<< HEAD
=======
// Memory Wiki tests cover index plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import plugin from "./index.js";
import { createMemoryWikiTestHarness } from "./src/test-helpers.js";

const { createPluginApi } = createMemoryWikiTestHarness();

describe("memory-wiki plugin", () => {
<<<<<<< HEAD
  it("registers prompt supplement, gateway methods, tools, and wiki cli surface", async () => {
=======
  it("registers prompt supplement, gateway methods, tools, and wiki cli surface", () => {
>>>>>>> upstream/main
    const {
      api,
      registerCli,
      registerGatewayMethod,
      registerMemoryCorpusSupplement,
      registerMemoryPromptSupplement,
      registerTool,
    } = createPluginApi();

<<<<<<< HEAD
    await plugin.register(api);
=======
    plugin.register(api);
>>>>>>> upstream/main

    expect(registerMemoryCorpusSupplement).toHaveBeenCalledTimes(1);
    expect(registerMemoryPromptSupplement).toHaveBeenCalledTimes(1);
    expect(registerGatewayMethod.mock.calls.map((call) => call[0])).toEqual([
      "wiki.status",
<<<<<<< HEAD
=======
      "wiki.importRuns",
      "wiki.importInsights",
      "wiki.palace",
>>>>>>> upstream/main
      "wiki.init",
      "wiki.doctor",
      "wiki.compile",
      "wiki.ingest",
      "wiki.lint",
      "wiki.bridge.import",
      "wiki.unsafeLocal.import",
      "wiki.search",
      "wiki.apply",
      "wiki.get",
      "wiki.obsidian.status",
      "wiki.obsidian.search",
      "wiki.obsidian.open",
      "wiki.obsidian.command",
      "wiki.obsidian.daily",
    ]);
    expect(registerTool).toHaveBeenCalledTimes(5);
    expect(registerTool.mock.calls.map((call) => call[1]?.name)).toEqual([
      "wiki_status",
      "wiki_lint",
      "wiki_apply",
      "wiki_search",
      "wiki_get",
    ]);
    expect(registerCli).toHaveBeenCalledTimes(1);
<<<<<<< HEAD
    expect(registerCli.mock.calls[0]?.[1]).toMatchObject({
      descriptors: [
        expect.objectContaining({
          name: "wiki",
          hasSubcommands: true,
        }),
=======
    expect(registerCli.mock.calls[0]?.[1]).toStrictEqual({
      descriptors: [
        {
          name: "wiki",
          description: "Inspect and initialize the memory wiki vault",
          hasSubcommands: true,
        },
>>>>>>> upstream/main
      ],
    });
  });
});
