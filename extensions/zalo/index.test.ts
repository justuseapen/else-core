<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Zalo tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { describe } from "vitest";
>>>>>>> upstream/main
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

describe("zalo bundled entries", () => {
<<<<<<< HEAD
  it("loads the channel plugin without a runtime-barrel cycle", () => {
    const plugin = entry.loadChannelPlugin();
    expect(plugin.id).toBe("zalo");
  });

  it("loads the setup plugin without a runtime-barrel cycle", () => {
    const plugin = setupEntry.loadSetupPlugin();
    expect(plugin.id).toBe("zalo");
=======
  assertBundledChannelEntries({
    entry,
    expectedId: "zalo",
    expectedName: "Zalo",
    setupEntry,
    channelMessage: "declares the channel plugin without a runtime-barrel cycle",
    setupMessage: "declares the setup plugin without a runtime-barrel cycle",
>>>>>>> upstream/main
  });
});
