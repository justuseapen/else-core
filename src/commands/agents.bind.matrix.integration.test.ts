<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it } from "vitest";
=======
// Agent bind Matrix integration tests cover account binding resolution through plugin registry surfaces.
import { afterEach, describe, expect, it } from "vitest";
>>>>>>> upstream/main
import { setActivePluginRegistry } from "../plugins/runtime.js";
import {
  createBindingResolverTestPlugin,
  createTestRegistry,
} from "../test-utils/channel-plugins.js";
<<<<<<< HEAD
import {
  loadFreshAgentsCommandModuleForTest,
  readConfigFileSnapshotMock,
  resetAgentsBindTestHarness,
  runtime,
  writeConfigFileMock,
} from "./agents.bind.test-support.js";
import { baseConfigSnapshot } from "./test-runtime-config-helpers.js";
=======
import { parseBindingSpecs } from "./agents.bindings.js";
>>>>>>> upstream/main

const matrixBindingPlugin = createBindingResolverTestPlugin({
  id: "matrix",
  resolveBindingAccountId: ({ accountId, agentId }) => {
    const explicit = accountId?.trim();
    if (explicit) {
      return explicit;
    }
    const agent = agentId?.trim();
    return agent || "default";
  },
});
<<<<<<< HEAD

let agentsBindCommand: typeof import("./agents.js").agentsBindCommand;

describe("agents bind matrix integration", () => {
  beforeEach(async () => {
    ({ agentsBindCommand } = await loadFreshAgentsCommandModuleForTest());
    resetAgentsBindTestHarness();

=======

describe("agents bind matrix integration", () => {
  it("uses matrix plugin binding resolver when accountId is omitted", () => {
>>>>>>> upstream/main
    setActivePluginRegistry(
      createTestRegistry([{ pluginId: "matrix", plugin: matrixBindingPlugin, source: "test" }]),
    );

    const parsed = parseBindingSpecs({ agentId: "main", specs: ["matrix"], config: {} });

    expect(parsed.errors).toStrictEqual([]);
    expect(parsed.bindings).toEqual([
      { type: "route", agentId: "main", match: { channel: "matrix", accountId: "main" } },
    ]);
  });

  afterEach(() => {
    setActivePluginRegistry(createTestRegistry());
<<<<<<< HEAD
  });

  it("uses matrix plugin binding resolver when accountId is omitted", async () => {
    readConfigFileSnapshotMock.mockResolvedValue({
      ...baseConfigSnapshot,
      config: {},
    });

    await agentsBindCommand({ agent: "main", bind: ["matrix"] }, runtime);

    expect(writeConfigFileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        bindings: [
          { type: "route", agentId: "main", match: { channel: "matrix", accountId: "main" } },
        ],
      }),
    );
    expect(runtime.exit).not.toHaveBeenCalled();
=======
>>>>>>> upstream/main
  });
});
