<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Irc tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { describe } from "vitest";
>>>>>>> upstream/main
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

describe("irc bundled entries", () => {
<<<<<<< HEAD
  it("loads the channel plugin without importing the broad api barrel", () => {
    const plugin = entry.loadChannelPlugin();
    expect(plugin.id).toBe("irc");
  });

  it("loads the setup plugin without importing the broad api barrel", () => {
    const plugin = setupEntry.loadSetupPlugin();
    expect(plugin.id).toBe("irc");
=======
  assertBundledChannelEntries({
    entry,
    expectedId: "irc",
    expectedName: "IRC",
    setupEntry,
>>>>>>> upstream/main
  });
});
