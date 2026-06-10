// Covers channel/target inference, legacy target rewrite, target validation,
// and plugin alias-aware message-action normalization.
import { describe, expect, it, vi } from "vitest";
import { normalizeMessageActionInput } from "./message-action-normalization.js";

vi.mock("../../channels/plugins/bootstrap-registry.js", async () => ({
  getBootstrapChannelPlugin: (
    await import("./message-action-test-fixtures.js")
  ).createPinboardMessageActionBootstrapRegistryMock(),
}));

vi.mock("../../utils/message-channel.js", () => ({
  isDeliverableMessageChannel: (value: string) => ["workspace", "forum"].includes(value),
  normalizeMessageChannel: (value?: string | null) =>
    typeof value === "string" ? value.trim().toLowerCase() : undefined,
}));

describe("normalizeMessageActionInput", () => {
  type NormalizeMessageActionInputCase = {
    input: Parameters<typeof normalizeMessageActionInput>[0];
    expectedFields?: Record<string, unknown>;
    absentFields?: string[];
  };

  it.each([
    {
      input: {
        action: "send",
        args: {
          target: "channel:C1",
          to: "legacy",
          channelId: "legacy-channel",
        },
      },
      expectedFields: { target: "channel:C1", to: "channel:C1" },
      absentFields: ["channelId"],
    },
    {
      input: {
        action: "send",
        args: {
          target: "1214056829",
          channelId: "",
          to: "   ",
        },
      },
      expectedFields: { target: "1214056829", to: "1214056829" },
      absentFields: ["channelId"],
    },
    {
      input: {
        action: "send",
        args: {
          to: "channel:C1",
        },
      },
      expectedFields: { target: "channel:C1", to: "channel:C1" },
    },
    {
      input: {
        action: "send",
        args: {},
        toolContext: {
          currentChannelId: "channel:C1",
        },
      },
      expectedFields: { target: "channel:C1", to: "channel:C1" },
    },
    {
      input: {
        action: "send",
        args: {
          target: "channel:C1",
        },
        toolContext: {
          currentChannelId: "C1",
<<<<<<< HEAD
          currentChannelProvider: "slack",
        },
      },
      expectedFields: { channel: "slack" },
=======
          currentChannelProvider: "workspace",
        },
      },
      expectedFields: { channel: "workspace" },
>>>>>>> upstream/main
    },
    {
      input: {
        action: "broadcast",
        args: {},
        toolContext: {
          currentChannelId: "channel:C1",
        },
      },
      absentFields: ["target", "to"],
    },
    {
      input: {
        action: "send",
        args: {
          target: "channel:C1",
        },
        toolContext: {
          currentChannelProvider: "webchat",
        },
      },
      absentFields: ["channel"],
    },
    {
      input: {
        action: "edit",
        args: {
          messageId: "msg_123",
        },
        toolContext: {
          currentChannelId: "channel:C1",
        },
      },
      expectedFields: { messageId: "msg_123" },
      absentFields: ["target", "to"],
    },
    {
      input: {
        action: "pin",
        args: {
<<<<<<< HEAD
          channel: "feishu",
=======
          channel: "pinboard",
>>>>>>> upstream/main
          messageId: "om_123",
        },
      },
      expectedFields: { messageId: "om_123" },
      absentFields: ["target", "to"],
    },
    {
      input: {
        action: "list-pins",
        args: {
<<<<<<< HEAD
          channel: "feishu",
=======
          channel: "pinboard",
>>>>>>> upstream/main
          chatId: "oc_123",
        },
      },
      expectedFields: { chatId: "oc_123" },
      absentFields: ["target", "to"],
    },
    {
      input: {
        action: "read",
        args: {
<<<<<<< HEAD
          channel: "slack",
=======
          channel: "workspace",
>>>>>>> upstream/main
          messageId: "123.456",
        },
        toolContext: {
          currentChannelId: "C12345678",
<<<<<<< HEAD
          currentChannelProvider: "slack",
=======
          currentChannelProvider: "workspace",
>>>>>>> upstream/main
        },
      },
      expectedFields: { target: "C12345678", messageId: "123.456" },
    },
    {
      input: {
        action: "channel-info",
        args: {
          channelId: "C123",
        },
      },
      expectedFields: { target: "C123", channelId: "C123" },
      absentFields: ["to"],
    },
  ] satisfies NormalizeMessageActionInputCase[])(
    "normalizes message action input for %j",
    ({ input, expectedFields, absentFields }) => {
      const normalized = normalizeMessageActionInput(input);
      if (expectedFields) {
        for (const [field, value] of Object.entries(expectedFields)) {
          expect(normalized[field]).toBe(value);
        }
      }
      for (const field of absentFields ?? []) {
        expect(field in normalized).toBe(false);
      }
    },
  );

  it("throws when required target remains unresolved", () => {
    expect(() =>
      normalizeMessageActionInput({
        action: "send",
        args: {},
      }),
    ).toThrow(/requires a target/);
  });
});
