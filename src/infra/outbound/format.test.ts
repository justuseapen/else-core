// Covers direct/gateway outbound summary formatting and JSON delivery payload
// projections.
import { describe, expect, it, vi } from "vitest";
import {
  buildOutboundDeliveryJson,
  formatGatewaySummary,
  formatOutboundDeliverySummary,
} from "./format.js";

const getChannelPluginMock = vi.hoisted(() =>
  vi.fn((channel: string) => {
    const labels: Record<string, string> = {
      alpha: "Alpha",
      localchat: "Local Chat",
      richchat: "Rich Chat",
      workspace: "Workspace",
      teamchat: "Team Chat",
    };
    const label = labels[channel];
    return label ? { meta: { label } } : undefined;
  }),
);

vi.mock("../../channels/plugins/index.js", () => ({
  getLoadedChannelPlugin: getChannelPluginMock,
  getChannelPlugin: getChannelPluginMock,
}));
describe("formatOutboundDeliverySummary", () => {
  it.each([
    {
<<<<<<< HEAD
      channel: "telegram" as const,
      result: undefined,
      expected: "✅ Sent via Telegram. Message ID: unknown",
    },
    {
      channel: "imessage" as const,
      result: undefined,
      expected: "✅ Sent via iMessage. Message ID: unknown",
    },
    {
      channel: "telegram" as const,
      result: {
        channel: "telegram" as const,
        messageId: "m1",
        chatId: "c1",
      },
      expected: "✅ Sent via Telegram. Message ID: m1 (chat c1)",
    },
    {
      channel: "discord" as const,
      result: {
        channel: "discord" as const,
        messageId: "d1",
        channelId: "chan",
      },
      expected: "✅ Sent via Discord. Message ID: d1 (channel chan)",
    },
    {
      channel: "slack" as const,
      result: {
        channel: "slack" as const,
        messageId: "s1",
        roomId: "room-1",
      },
      expected: "✅ Sent via Slack. Message ID: s1 (room room-1)",
    },
    {
      channel: "msteams" as const,
      result: {
        channel: "msteams" as const,
        messageId: "t1",
        conversationId: "conv-1",
      },
      expected: "✅ Sent via msteams. Message ID: t1 (conversation conv-1)",
=======
      channel: "alpha" as const,
      result: undefined,
      expected: "✅ Sent via Alpha. Message ID: unknown",
    },
    {
      channel: "localchat" as const,
      result: undefined,
      expected: "✅ Sent via Local Chat. Message ID: unknown",
    },
    {
      channel: "alpha" as const,
      result: {
        channel: "alpha" as const,
        messageId: "m1",
        chatId: "c1",
      },
      expected: "✅ Sent via Alpha. Message ID: m1 (chat c1)",
    },
    {
      channel: "richchat" as const,
      result: {
        channel: "richchat" as const,
        messageId: "d1",
        channelId: "chan",
      },
      expected: "✅ Sent via Rich Chat. Message ID: d1 (channel chan)",
    },
    {
      channel: "workspace" as const,
      result: {
        channel: "workspace" as const,
        messageId: "s1",
        roomId: "room-1",
      },
      expected: "✅ Sent via Workspace. Message ID: s1 (room room-1)",
    },
    {
      channel: "teamchat" as const,
      result: {
        channel: "teamchat" as const,
        messageId: "t1",
        conversationId: "conv-1",
      },
      expected: "✅ Sent via Team Chat. Message ID: t1 (conversation conv-1)",
>>>>>>> upstream/main
    },
  ])("formats delivery summary for %j", ({ channel, result, expected }) => {
    expect(formatOutboundDeliverySummary(channel, result)).toBe(expected);
  });
});

describe("buildOutboundDeliveryJson", () => {
  it.each([
    {
      input: {
<<<<<<< HEAD
        channel: "telegram" as const,
        to: "123",
        result: { channel: "telegram" as const, messageId: "m1", chatId: "c1" },
        mediaUrl: "https://example.com/a.png",
      },
      expected: {
        channel: "telegram",
=======
        channel: "alpha" as const,
        to: "123",
        result: { channel: "alpha" as const, messageId: "m1", chatId: "c1" },
        mediaUrl: "https://example.com/a.png",
      },
      expected: {
        channel: "alpha",
>>>>>>> upstream/main
        via: "direct",
        to: "123",
        messageId: "m1",
        mediaUrl: "https://example.com/a.png",
        chatId: "c1",
      },
    },
    {
      input: {
<<<<<<< HEAD
        channel: "whatsapp" as const,
        to: "+1",
        result: { channel: "whatsapp" as const, messageId: "w1", toJid: "jid" },
      },
      expected: {
        channel: "whatsapp",
=======
        channel: "directchat" as const,
        to: "+1",
        result: { channel: "directchat" as const, messageId: "w1", toJid: "jid" },
      },
      expected: {
        channel: "directchat",
>>>>>>> upstream/main
        via: "direct",
        to: "+1",
        messageId: "w1",
        mediaUrl: null,
        toJid: "jid",
      },
    },
    {
      input: {
<<<<<<< HEAD
        channel: "signal" as const,
        to: "+1",
        result: { channel: "signal" as const, messageId: "s1", timestamp: 123 },
      },
      expected: {
        channel: "signal",
=======
        channel: "pager" as const,
        to: "+1",
        result: { channel: "pager" as const, messageId: "s1", timestamp: 123 },
      },
      expected: {
        channel: "pager",
>>>>>>> upstream/main
        via: "direct",
        to: "+1",
        messageId: "s1",
        mediaUrl: null,
        timestamp: 123,
      },
    },
    {
      input: {
<<<<<<< HEAD
        channel: "discord" as const,
=======
        channel: "richchat" as const,
>>>>>>> upstream/main
        to: "channel:1",
        via: "gateway" as const,
        result: {
          messageId: "g1",
          channelId: "1",
          meta: { thread: "2" },
        },
      },
      expected: {
<<<<<<< HEAD
        channel: "discord",
=======
        channel: "richchat",
>>>>>>> upstream/main
        via: "gateway",
        to: "channel:1",
        messageId: "g1",
        mediaUrl: null,
        channelId: "1",
        meta: { thread: "2" },
      },
    },
  ])("builds delivery JSON for %j", ({ input, expected }) => {
    expect(buildOutboundDeliveryJson(input)).toEqual(expected);
  });
});

describe("formatGatewaySummary", () => {
  it.each([
    {
<<<<<<< HEAD
      input: { channel: "whatsapp", messageId: "m1" },
      expected: "✅ Sent via gateway (whatsapp). Message ID: m1",
    },
    {
      input: { action: "Poll sent", channel: "discord", messageId: "p1" },
      expected: "✅ Poll sent via gateway (discord). Message ID: p1",
=======
      input: { channel: "directchat", messageId: "m1" },
      expected: "✅ Sent via gateway (directchat). Message ID: m1",
    },
    {
      input: { action: "Poll sent", channel: "richchat", messageId: "p1" },
      expected: "✅ Poll sent via gateway (richchat). Message ID: p1",
>>>>>>> upstream/main
    },
    {
      input: {},
      expected: "✅ Sent via gateway. Message ID: unknown",
    },
  ])("formats gateway summary for %j", ({ input, expected }) => {
    expect(formatGatewaySummary(input)).toBe(expected);
  });
});
