<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { extractExplicitGroupId } from "./group-id.js";

describe("extractExplicitGroupId", () => {
  it("returns undefined for empty/null input", () => {
    expect(extractExplicitGroupId(undefined)).toBeUndefined();
    expect(extractExplicitGroupId(null)).toBeUndefined();
    expect(extractExplicitGroupId("")).toBeUndefined();
    expect(extractExplicitGroupId("  ")).toBeUndefined();
  });

  it("extracts group ID from telegram group format", () => {
    expect(extractExplicitGroupId("telegram:group:-1003776849159")).toBe("-1003776849159");
  });

  it("extracts group ID from telegram forum topic format, stripping topic suffix", () => {
    expect(extractExplicitGroupId("telegram:group:-1003776849159:topic:1264")).toBe(
=======
// Tests group id derivation for channel sessions and persisted routes.
import { afterEach, describe, expect, it } from "vitest";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import {
  createChannelTestPluginBase,
  createTestRegistry,
} from "../../test-utils/channel-plugins.js";
import { extractSimpleExplicitGroupId } from "./group-id-simple.js";
import { extractExplicitGroupId } from "./group-id.js";

afterEach(() => {
  setActivePluginRegistry(createTestRegistry());
});

describe("extractSimpleExplicitGroupId", () => {
  it("returns undefined for empty/null input", () => {
    expect(extractSimpleExplicitGroupId(undefined)).toBeUndefined();
    expect(extractSimpleExplicitGroupId(null)).toBeUndefined();
    expect(extractSimpleExplicitGroupId("")).toBeUndefined();
    expect(extractSimpleExplicitGroupId("  ")).toBeUndefined();
  });

  it("extracts group ID from provider group format", () => {
    expect(extractSimpleExplicitGroupId("chat:group:-1003776849159")).toBe("-1003776849159");
  });

  it("extracts group ID from provider topic format, stripping topic suffix", () => {
    expect(extractSimpleExplicitGroupId("chat:group:-1003776849159:topic:1264")).toBe(
>>>>>>> upstream/main
      "-1003776849159",
    );
  });

  it("extracts group ID from channel format", () => {
<<<<<<< HEAD
    expect(extractExplicitGroupId("telegram:channel:-1001234567890")).toBe("-1001234567890");
  });

  it("extracts group ID from channel format with topic", () => {
    expect(extractExplicitGroupId("telegram:channel:-1001234567890:topic:42")).toBe(
=======
    expect(extractSimpleExplicitGroupId("chat:channel:-1001234567890")).toBe("-1001234567890");
  });

  it("extracts group ID from channel format with topic", () => {
    expect(extractSimpleExplicitGroupId("chat:channel:-1001234567890:topic:42")).toBe(
>>>>>>> upstream/main
      "-1001234567890",
    );
  });

  it("extracts group ID from bare group: prefix", () => {
<<<<<<< HEAD
    expect(extractExplicitGroupId("group:-1003776849159")).toBe("-1003776849159");
  });

  it("extracts group ID from bare group: prefix with topic", () => {
    expect(extractExplicitGroupId("group:-1003776849159:topic:999")).toBe("-1003776849159");
  });

  it("extracts WhatsApp group ID", () => {
    expect(extractExplicitGroupId("whatsapp:120363123456789@g.us")).toBe("120363123456789@g.us");
  });

  it("returns undefined for unrecognized formats", () => {
    expect(extractExplicitGroupId("user:12345")).toBeUndefined();
    expect(extractExplicitGroupId("just-a-string")).toBeUndefined();
=======
    expect(extractSimpleExplicitGroupId("group:-1003776849159")).toBe("-1003776849159");
  });

  it("extracts group ID from bare group: prefix with topic", () => {
    expect(extractSimpleExplicitGroupId("group:-1003776849159:topic:999")).toBe("-1003776849159");
  });

  it("returns undefined for unrecognized formats", () => {
    expect(extractSimpleExplicitGroupId("user:12345")).toBeUndefined();
    expect(extractSimpleExplicitGroupId("just-a-string")).toBeUndefined();
  });
});

describe("extractExplicitGroupId", () => {
  it("strips Telegram numeric topic shorthand after target normalization", () => {
    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "telegram",
          source: "test",
          plugin: {
            ...createChannelTestPluginBase({
              id: "telegram",
              capabilities: { chatTypes: ["group"] },
            }),
            messaging: {
              normalizeTarget: () => "telegram:-100200300:77",
              inferTargetChatType: () => "group",
            },
          },
        },
      ]),
    );

    expect(extractExplicitGroupId("telegram:-100200300:77")).toBe("-100200300");
  });

  it("keeps legacy parser-only group target extraction quarantined", () => {
    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "legacygroup",
          source: "test",
          plugin: {
            ...createChannelTestPluginBase({
              id: "legacygroup",
              capabilities: { chatTypes: ["group"] },
            }),
            messaging: {
              parseExplicitTarget: ({ raw }: { raw: string }) =>
                raw.startsWith("legacygroup:")
                  ? { to: "group:room-a:topic:77", chatType: "group" as const }
                  : null,
            },
          },
        },
      ]),
    );

    expect(extractExplicitGroupId("legacygroup:room-a:topic:77")).toBe("room-a");
>>>>>>> upstream/main
  });
});
