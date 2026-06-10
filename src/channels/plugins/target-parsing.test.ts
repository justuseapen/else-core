// Target parsing tests cover channel target syntax parsing and validation.
import { beforeEach, describe, expect, it } from "vitest";
import {
  channelRouteTargetsMatchExact,
  channelRouteTargetsShareConversation,
} from "../../plugin-sdk/channel-route.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import { createTestRegistry } from "../../test-utils/channel-plugins.js";
import {
  comparableChannelTargetsMatch,
<<<<<<< HEAD
  comparableChannelTargetsShareRoute,
  parseExplicitTargetForChannel,
  resolveComparableTargetForChannel,
} from "./target-parsing.js";

function parseTelegramTargetForTest(raw: string): {
  to: string;
  threadId?: number;
  chatType?: "direct" | "group";
} {
  const trimmed = raw
    .trim()
    .replace(/^telegram:/i, "")
    .replace(/^tg:/i, "");
  const prefixedTopic = /^group:([^:]+):topic:(\d+)$/i.exec(trimmed);
  if (prefixedTopic) {
    return {
      to: prefixedTopic[1],
      threadId: Number.parseInt(prefixedTopic[2], 10),
      chatType: "group",
    };
  }
  const topic = /^([^:]+):topic:(\d+)$/i.exec(trimmed);
  if (topic) {
    return {
      to: topic[1],
      threadId: Number.parseInt(topic[2], 10),
      chatType: topic[1].startsWith("-") ? "group" : "direct",
    };
  }
  return {
    to: trimmed,
    chatType: trimmed.startsWith("-") ? "group" : undefined,
  };
}

function setMinimalTargetParsingRegistry(): void {
  setActivePluginRegistry(
    createTestRegistry([
      {
        pluginId: "telegram",
        plugin: {
          id: "telegram",
          meta: {
            id: "telegram",
            label: "Telegram",
            selectionLabel: "Telegram",
            docsPath: "/channels/telegram",
            blurb: "test stub",
          },
          capabilities: { chatTypes: ["direct", "group"] },
          config: {
            listAccountIds: () => [],
            resolveAccount: () => ({}),
          },
          messaging: {
            parseExplicitTarget: ({ raw }: { raw: string }) => parseTelegramTargetForTest(raw),
          },
        },
        source: "test",
      },
      {
        pluginId: "demo-target",
        source: "test",
        plugin: {
          id: "demo-target",
          meta: {
            id: "demo-target",
            label: "Demo Target",
            selectionLabel: "Demo Target",
            docsPath: "/channels/demo-target",
            blurb: "test stub",
          },
          capabilities: { chatTypes: ["direct"] },
          config: {
            listAccountIds: () => [],
            resolveAccount: () => ({}),
          },
          messaging: {
            parseExplicitTarget: ({ raw }: { raw: string }) => ({
              to: raw.trim().toUpperCase(),
              chatType: "direct" as const,
            }),
          },
        },
      },
    ]),
  );
}
=======
  parseExplicitTargetForLoadedChannel,
  resolveComparableTargetForLoadedChannel,
  resolveRouteTargetForLoadedChannel,
} from "./target-parsing-loaded.js";
>>>>>>> upstream/main

function parseThreadedTargetForTest(raw: string): {
  to: string;
  threadId?: number;
  chatType?: "direct" | "group";
} {
  const trimmed = raw
    .trim()
    .replace(/^threaded:/i, "")
    .replace(/^mock:/i, "");
  const prefixedTopic = /^group:([^:]+):topic:(\d+)$/i.exec(trimmed);
  if (prefixedTopic) {
    return {
      to: prefixedTopic[1],
      threadId: Number.parseInt(prefixedTopic[2], 10),
      chatType: "group",
    };
  }
  const topic = /^([^:]+):topic:(\d+)$/i.exec(trimmed);
  if (topic) {
    return {
      to: topic[1],
      threadId: Number.parseInt(topic[2], 10),
      chatType: topic[1].startsWith("-") ? "group" : "direct",
    };
  }
  return {
    to: trimmed,
    chatType: trimmed.startsWith("-") ? "group" : undefined,
  };
}

function setMinimalTargetParsingRegistry(): void {
  setActivePluginRegistry(
    createTestRegistry([
      {
        pluginId: "mock-threaded",
        plugin: {
          id: "mock-threaded",
          meta: {
            id: "mock-threaded",
            label: "Mock Threaded",
            selectionLabel: "Mock Threaded",
            docsPath: "/channels/mock-threaded",
            blurb: "test stub",
          },
          capabilities: { chatTypes: ["direct", "group"] },
          config: {
            listAccountIds: () => [],
            resolveAccount: () => ({}),
          },
          messaging: {
            parseExplicitTarget: ({ raw }: { raw: string }) => parseThreadedTargetForTest(raw),
          },
        },
        source: "test",
      },
      {
        pluginId: "demo-target",
        source: "test",
        plugin: {
          id: "demo-target",
          meta: {
            id: "demo-target",
            label: "Demo Target",
            selectionLabel: "Demo Target",
            docsPath: "/channels/demo-target",
            blurb: "test stub",
          },
          capabilities: { chatTypes: ["direct"] },
          config: {
            listAccountIds: () => [],
            resolveAccount: () => ({}),
          },
          messaging: {
            parseExplicitTarget: ({ raw }: { raw: string }) => ({
              to: raw.trim().toUpperCase(),
              chatType: "direct" as const,
            }),
          },
        },
      },
    ]),
  );
}

describe("parseExplicitTargetForLoadedChannel", () => {
  beforeEach(() => {
    setMinimalTargetParsingRegistry();
  });

<<<<<<< HEAD
  it("parses Telegram targets via the registered channel plugin contract", () => {
    expect(parseExplicitTargetForChannel("telegram", "telegram:group:-100123:topic:77")).toEqual({
      to: "-100123",
=======
  it("parses threaded targets via the registered channel plugin contract", () => {
    expect(
      parseExplicitTargetForLoadedChannel("mock-threaded", "threaded:group:room-a:topic:77"),
    ).toEqual({
      to: "room-a",
>>>>>>> upstream/main
      threadId: 77,
      chatType: "group",
    });
    expect(parseExplicitTargetForLoadedChannel("mock-threaded", "room-a")).toEqual({
      to: "room-a",
      chatType: undefined,
    });
  });

  it("parses registered non-bundled channel targets via the active plugin contract", () => {
<<<<<<< HEAD
    expect(parseExplicitTargetForChannel("demo-target", "team-room")).toEqual({
=======
    expect(parseExplicitTargetForLoadedChannel("demo-target", "team-room")).toEqual({
      to: "TEAM-ROOM",
      chatType: "direct",
    });
    expect(parseExplicitTargetForLoadedChannel("demo-target", "team-room")).toEqual({
>>>>>>> upstream/main
      to: "TEAM-ROOM",
      chatType: "direct",
    });
  });

<<<<<<< HEAD
  it("builds comparable targets from plugin-owned grammar", () => {
    expect(
      resolveComparableTargetForChannel({
        channel: "telegram",
        rawTarget: "telegram:group:-100123:topic:77",
      }),
    ).toEqual({
      rawTo: "telegram:group:-100123:topic:77",
      to: "-100123",
=======
  it("builds route targets from plugin-owned grammar", () => {
    expect(
      resolveRouteTargetForLoadedChannel({
        channel: "mock-threaded",
        rawTarget: "threaded:group:room-a:topic:77",
      }),
    ).toEqual({
      channel: "mock-threaded",
      rawTo: "threaded:group:room-a:topic:77",
      to: "room-a",
      threadId: 77,
      chatType: "group",
    });
    expect(
      resolveRouteTargetForLoadedChannel({
        channel: "mock-threaded",
        rawTarget: "threaded:group:room-a:topic:77",
      }),
    ).toEqual({
      channel: "mock-threaded",
      rawTo: "threaded:group:room-a:topic:77",
      to: "room-a",
>>>>>>> upstream/main
      threadId: 77,
      chatType: "group",
    });
  });

<<<<<<< HEAD
  it("matches comparable targets when only the plugin grammar differs", () => {
    const topicTarget = resolveComparableTargetForChannel({
      channel: "telegram",
      rawTarget: "telegram:-100123:topic:77",
    });
    const bareTarget = resolveComparableTargetForChannel({
      channel: "telegram",
      rawTarget: "-100123",
    });

    expect(
      comparableChannelTargetsMatch({
=======
  it("matches route targets when only the plugin grammar differs", () => {
    const topicTarget = resolveRouteTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "threaded:room-a:topic:77",
    });
    const bareTarget = resolveRouteTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "room-a",
    });

    expect(
      channelRouteTargetsMatchExact({
>>>>>>> upstream/main
        left: topicTarget,
        right: bareTarget,
      }),
    ).toBe(false);
    expect(
<<<<<<< HEAD
      comparableChannelTargetsShareRoute({
=======
      channelRouteTargetsShareConversation({
>>>>>>> upstream/main
        left: topicTarget,
        right: bareTarget,
      }),
    ).toBe(true);
  });
<<<<<<< HEAD
=======

  it("compares numeric and string thread ids through the shared route contract", () => {
    const numericThread = resolveRouteTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "threaded:room-a:topic:77",
    });
    const stringThread = resolveRouteTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "room-a",
      fallbackThreadId: "77",
    });

    expect(
      channelRouteTargetsMatchExact({
        left: numericThread,
        right: stringThread,
      }),
    ).toBe(true);
  });

  it("keeps deprecated comparable target helpers as route wrappers", () => {
    const numericThread = resolveComparableTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "threaded:room-a:topic:77",
    });
    const stringThread = resolveRouteTargetForLoadedChannel({
      channel: "mock-threaded",
      rawTarget: "room-a",
      fallbackThreadId: "77",
    });

    expect(
      comparableChannelTargetsMatch({
        left: numericThread,
        right: stringThread,
      }),
    ).toBe(true);
  });
>>>>>>> upstream/main
});
