<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Discord tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { describe } from "vitest";
>>>>>>> upstream/main
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

describe("discord bundled entries", () => {
<<<<<<< HEAD
  it("loads the channel plugin without importing the broad api barrel", () => {
    const plugin = entry.loadChannelPlugin();
    expect(plugin.id).toBe("discord");
  });

  it("loads the setup plugin without importing the broad api barrel", () => {
    const plugin = setupEntry.loadSetupPlugin();
    expect(plugin.id).toBe("discord");
=======
  assertBundledChannelEntries({
    entry,
    expectedId: "discord",
    expectedName: "Discord",
    setupEntry,
>>>>>>> upstream/main
  });
});
