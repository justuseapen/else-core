<<<<<<< HEAD
import { describe, expect, it } from "vitest";
=======
// Whatsapp tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { describe, expect, it } from "vitest";
import { whatsappPlugin } from "./channel-plugin-api.js";
>>>>>>> upstream/main
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

describe("whatsapp bundled entries", () => {
<<<<<<< HEAD
  it("loads the channel plugin without importing the broad api barrel", () => {
    const plugin = entry.loadChannelPlugin();
    expect(plugin.id).toBe("whatsapp");
  });

  it("loads the setup plugin without importing the broad api barrel", () => {
    const plugin = setupEntry.loadSetupPlugin();
    expect(plugin.id).toBe("whatsapp");
=======
  assertBundledChannelEntries({
    entry,
    expectedId: "whatsapp",
    expectedName: "WhatsApp",
    setupEntry,
  });

  it("declares account config as channel-restart reload metadata", () => {
    expect(whatsappPlugin.reload).toEqual({
      configPrefixes: ["web", "channels.whatsapp.accounts"],
      noopPrefixes: ["channels.whatsapp"],
    });
>>>>>>> upstream/main
  });
});
