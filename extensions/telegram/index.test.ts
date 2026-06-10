<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Telegram tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { beforeEach, describe, vi } from "vitest";
>>>>>>> upstream/main
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

describe("telegram bundled entries", () => {
<<<<<<< HEAD
  it("loads the channel plugin without importing the broad api barrel", () => {
    const plugin = entry.loadChannelPlugin();
    expect(plugin.id).toBe("telegram");
  });

  it("loads the setup plugin without importing the broad api barrel", () => {
    const plugin = setupEntry.loadSetupPlugin();
    expect(plugin.id).toBe("telegram");
=======
  beforeEach(() => {
    vi.useRealTimers();
  });

  assertBundledChannelEntries({
    entry,
    expectedId: "telegram",
    expectedName: "Telegram",
    setupEntry,
    channelMessage: "declares the channel entry without importing the broad api barrel",
>>>>>>> upstream/main
  });
});
