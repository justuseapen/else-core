<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __testing as threadBindingTesting,
  createThreadBindingManager,
} from "./thread-bindings.js";
=======
// Discord tests cover reply delivery plugin behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestClient } from "../internal/discord.js";
>>>>>>> upstream/main

const sendDurableMessageBatchMock = vi.hoisted(() =>
  vi.fn(async () => ({
    status: "sent" as const,
    results: [{ messageId: "msg-1", channelId: "channel-1" }],
  })),
);
const sendMessageDiscordMock = vi.hoisted(() => vi.fn());
const sendVoiceMessageDiscordMock = vi.hoisted(() => vi.fn());

<<<<<<< HEAD
=======
vi.mock("openclaw/plugin-sdk/channel-outbound", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/channel-outbound")>(
    "openclaw/plugin-sdk/channel-outbound",
  );
  return {
    ...actual,
    sendDurableMessageBatch: sendDurableMessageBatchMock,
  };
});

>>>>>>> upstream/main
vi.mock("../send.js", async () => {
  const actual = await vi.importActual<typeof import("../send.js")>("../send.js");
  return {
    ...actual,
    sendMessageDiscord: (...args: unknown[]) => sendMessageDiscordMock(...args),
    sendVoiceMessageDiscord: (...args: unknown[]) => sendVoiceMessageDiscordMock(...args),
<<<<<<< HEAD
    sendWebhookMessageDiscord: (...args: unknown[]) => sendWebhookMessageDiscordMock(...args),
  };
});

vi.mock("../send.shared.js", () => ({
  sendDiscordText: (...args: unknown[]) => sendDiscordTextMock(...args),
}));

vi.mock("openclaw/plugin-sdk/retry-runtime", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/retry-runtime")>(
    "openclaw/plugin-sdk/retry-runtime",
  );
  return {
    ...actual,
    retryAsync: retryAsyncMock,
=======
>>>>>>> upstream/main
  };
});

let deliverDiscordReply: typeof import("./reply-delivery.js").deliverDiscordReply;

type DeliverParams = Record<string, unknown> & {
  cfg?: OpenClawConfig;
  formatting?: unknown;
  deps?: Record<string, (...args: unknown[]) => Promise<unknown>>;
};

function firstDeliverParams() {
  const calls = sendDurableMessageBatchMock.mock.calls as unknown as Array<[DeliverParams]>;
  const params = calls[0]?.[0];
  if (!params) {
    throw new Error("sendDurableMessageBatch was not called");
  }
  return params;
}

function recordField(value: unknown, field: string): Record<string, unknown> {
  if (value === undefined || value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`expected ${field} to be an object`);
  }
  return value as Record<string, unknown>;
}

function firstMockCall(mock: { mock: { calls: unknown[][] } }, label: string): unknown[] {
  const [call] = mock.mock.calls;
  if (!call) {
    throw new Error(`expected ${label} call`);
  }
  return call;
}

function firstMockArg(mock: { mock: { calls: unknown[][] } }, label: string, index: number) {
  return firstMockCall(mock, label)[index];
}

function objectArgAt(
  mock: { mock: { calls: unknown[][] } },
  index: number,
): Record<string, unknown> {
  const value = firstMockArg(mock, "mock", index);
  if (value === undefined || value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`expected call argument ${index} to be an object`);
  }
  return value as Record<string, unknown>;
}

describe("deliverDiscordReply", () => {
  const runtime = {} as RuntimeEnv;
  const cfg = {
    channels: { discord: { token: "test-token" } },
  } as OpenClawConfig;

<<<<<<< HEAD
    await deliverDiscordReply({
      replies: [{ text: "retry me" }],
      target: "channel:123",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
    });

    expect(sendMessageDiscordMock).toHaveBeenCalledTimes(2);
  };
  const createBoundThreadBindings = async (
    overrides: Partial<{
      threadId: string;
      channelId: string;
      targetSessionKey: string;
      agentId: string;
      label: string;
      webhookId: string;
      webhookToken: string;
      introText: string;
    }> = {},
  ) => {
    const threadBindings = createThreadBindingManager({
      accountId: "default",
      persist: false,
      enableSweeper: false,
    });
    await threadBindings.bindTarget({
      threadId: "thread-1",
      channelId: "parent-1",
      targetKind: "subagent",
      targetSessionKey: "agent:main:subagent:child",
      agentId: "main",
      webhookId: "wh_1",
      webhookToken: "tok_1",
      introText: "",
      ...overrides,
    });
    return threadBindings;
  };

=======
>>>>>>> upstream/main
  beforeAll(async () => {
    ({ deliverDiscordReply } = await import("./reply-delivery.js"));
  });

  beforeEach(() => {
<<<<<<< HEAD
    sendMessageDiscordMock.mockClear().mockResolvedValue({
=======
    sendDurableMessageBatchMock.mockClear();
    sendDurableMessageBatchMock.mockResolvedValue({
      status: "sent",
      results: [{ messageId: "msg-1", channelId: "channel-1" }],
    });
    sendMessageDiscordMock.mockReset().mockResolvedValue({
>>>>>>> upstream/main
      messageId: "msg-1",
      channelId: "channel-1",
    });
    sendVoiceMessageDiscordMock.mockReset().mockResolvedValue({
      messageId: "voice-1",
      channelId: "channel-1",
    });
  });

  it("bridges regular replies to shared outbound with Discord package deps", async () => {
    const rest = {} as RequestClient;
    const replies = [{ text: "shared path" }];

    await deliverDiscordReply({
<<<<<<< HEAD
      replies: [
        {
          text: "Hello there",
          mediaUrls: ["https://example.com/voice.ogg", "https://example.com/extra.mp3"],
          audioAsVoice: true,
        },
      ],
      target: "channel:123",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      replyToId: "reply-1",
    });

    expect(sendVoiceMessageDiscordMock).toHaveBeenCalledTimes(1);
    expect(sendVoiceMessageDiscordMock).toHaveBeenCalledWith(
      "channel:123",
      "https://example.com/voice.ogg",
      expect.objectContaining({ token: "token", replyTo: "reply-1" }),
    );

    expect(sendMessageDiscordMock).toHaveBeenCalledTimes(2);
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      1,
      "channel:123",
      "Hello there",
      expect.objectContaining({ token: "token", replyTo: "reply-1" }),
    );
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      2,
      "channel:123",
      "",
      expect.objectContaining({
        token: "token",
        mediaUrl: "https://example.com/extra.mp3",
        replyTo: "reply-1",
      }),
    );
  });

  it("skips follow-up text when the voice payload text is blank", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "   ",
          mediaUrl: "https://example.com/voice.ogg",
          audioAsVoice: true,
        },
      ],
      target: "channel:456",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
    });

    expect(sendVoiceMessageDiscordMock).toHaveBeenCalledTimes(1);
    expect(sendMessageDiscordMock).not.toHaveBeenCalled();
  });

  it("passes mediaLocalRoots through media sends", async () => {
    const mediaLocalRoots = ["/tmp/workspace-agent"] as const;
    await deliverDiscordReply({
      replies: [
        {
          text: "Media reply",
          mediaUrls: ["https://example.com/first.png", "https://example.com/second.png"],
        },
      ],
      target: "channel:654",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      mediaLocalRoots,
    });

    expect(sendMessageDiscordMock).toHaveBeenCalledTimes(2);
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      1,
      "channel:654",
      "Media reply",
      expect.objectContaining({
        token: "token",
        mediaUrl: "https://example.com/first.png",
        mediaLocalRoots,
      }),
    );
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      2,
      "channel:654",
      "",
      expect.objectContaining({
        token: "token",
        mediaUrl: "https://example.com/second.png",
        mediaLocalRoots,
      }),
    );
  });

  it("sends text first and videos as a separate media-only follow-up", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "done — i kicked off a 5s Molty clip",
          mediaUrls: ["/tmp/molty.mp4"],
        },
      ],
      target: "channel:654",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      replyToId: "reply-1",
    });

    expect(sendMessageDiscordMock).toHaveBeenCalledTimes(2);
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      1,
      "channel:654",
      "done — i kicked off a 5s Molty clip",
      expect.objectContaining({
        token: "token",
        replyTo: "reply-1",
      }),
    );
    expect(sendMessageDiscordMock).toHaveBeenNthCalledWith(
      2,
      "channel:654",
      "",
      expect.objectContaining({
        token: "token",
        mediaUrl: "/tmp/molty.mp4",
        replyTo: "reply-1",
      }),
    );
  });

  it("forwards cfg to Discord send helpers", async () => {
    await deliverDiscordReply({
      replies: [{ text: "cfg path" }],
=======
      replies,
>>>>>>> upstream/main
      target: "channel:101",
      token: "token",
      accountId: "default",
      rest,
      runtime,
      cfg,
      textLimit: 2000,
      replyToId: "reply-1",
      replyToMode: "all",
      kind: "final",
    });

    const params = firstDeliverParams();
    expect(params.channel).toBe("discord");
    expect(params.to).toBe("channel:101");
    expect(params.accountId).toBe("default");
    expect(params.payloads).toEqual(replies);
    expect(params.replyToId).toBe("reply-1");
    expect(params.replyToMode).toBe("all");

    const deps = params.deps!;
    await deps.discord("channel:101", "probe", { verbose: false });
    expect(firstMockArg(sendMessageDiscordMock, "sendMessageDiscord", 0)).toBe("channel:101");
    expect(firstMockArg(sendMessageDiscordMock, "sendMessageDiscord", 1)).toBe("probe");
    const sendOptions = objectArgAt(sendMessageDiscordMock, 2);
    expect(sendOptions.cfg).toBe(params.cfg);
    expect(sendOptions.token).toBe("token");
    expect(sendOptions.rest).toBe(rest);
  });

  it("fails when shared outbound accepts a final reply but delivers no Discord message", async () => {
    sendDurableMessageBatchMock.mockResolvedValueOnce({ status: "sent", results: [] });

    await expect(
      deliverDiscordReply({
        replies: [{ text: "lost reply" }],
        target: "channel:101",
        token: "token",
        accountId: "default",
        runtime,
        cfg,
        textLimit: 2000,
        kind: "final",
      }),
    ).rejects.toThrow("discord final reply produced no delivered message for channel:101");
  });

  it("preserves explicit tool progress payloads at the tool delivery boundary", async () => {
    await deliverDiscordReply({
      replies: [{ text: "🛠️ Exec: `echo visible`" }],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "tool",
    });

    expect(sendDurableMessageBatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payloads: [{ text: "🛠️ Exec: `echo visible`" }],
      }),
    );
  });

<<<<<<< HEAD
  it("honors payload reply targets even when replyToMode is off", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "explicit reply",
          replyToId: "reply-explicit-1",
          replyToTag: true,
          replyToCurrent: true,
        },
      ],
      target: "channel:202",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      replyToMode: "off",
    });

    expect(sendMessageDiscordMock).toHaveBeenCalledWith(
      "channel:202",
      "explicit reply",
      expect.objectContaining({ replyTo: "reply-explicit-1" }),
    );
  });

  it("uses replyToId only for the first chunk when replyToMode is first", async () => {
=======
  it("strips assistant scaffolding from explicit tool progress payloads", async () => {
>>>>>>> upstream/main
    await deliverDiscordReply({
      replies: [
        {
          text: [
            "<think>private reasoning</think>",
            '<tool_call>{"name":"x"}</tool_call>',
            "🛠️ run git status",
          ].join("\n"),
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "tool",
    });

    expect(sendDurableMessageBatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payloads: [{ text: "🛠️ run git status" }],
      }),
    );
  });

  it("strips internal execution trace lines at the final Discord send boundary", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: [
            "📊 Session Status: current",
            "🛠️ run git status",
            "⚠️ 🛠️ `run openclaw definitely-not-a-real-subcommand (agent)` failed",
            "🛠️ `gh pr view`",
            "🛠️ `docker compose up`",
            "🛠️ elevated · `cd /tmp && pnpm test`",
            "🛠️ pty · `apply_patch update`",
            "📖 Read: lines 1-40 from secret.md",
            "Visible reply.",
          ].join("\n"),
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ text: "Visible reply." }]);
  });

  it("drops pure internal tool failure warnings at the final Discord send boundary", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "⚠️ 🛠️ `run openclaw definitely-not-a-real-subcommand (agent)` failed",
          isError: true,
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(sendDurableMessageBatchMock).not.toHaveBeenCalled();
  });

  it("strips serialized tool call blocks at the final Discord send boundary", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: [
            "[tool:exec]",
            "<parameter=command>",
            'cat /proc/mounts 2>/dev/null | grep -i "libra|rav|openclaw" | head -20',
            "</parameter>",
            "",
            "<function=exec>",
            "<parameter=command>",
            'find / -maxdepth 4 -type d \\( -name "ravdb" -o -name "librav" \\) 2>/dev/null | head -20',
            "</parameter>",
            "<parameter=timeout_ms>",
            "1000",
            "</parameter>",
            "</function>",
            "",
            "Visible reply.",
          ].join("\n"),
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ text: "Visible reply." }]);
  });

  it("drops pure internal trace text while preserving media-only delivery", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "commentary: calling tool\nanalysis: inspect private state",
          mediaUrl: "https://example.com/result.png",
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([
      { mediaUrl: "https://example.com/result.png", text: undefined },
    ]);
  });

<<<<<<< HEAD
  it("uses replyToId only for the first chunk when replyToMode is batched", async () => {
    await deliverDiscordReply({
      replies: [
        {
          text: "1234567890",
        },
      ],
      target: "channel:789",
      token: "token",
      runtime,
      cfg,
      textLimit: 5,
      replyToId: "reply-1",
      replyToMode: "batched",
    });

    expect(sendMessageDiscordMock).toHaveBeenCalledTimes(2);
    expect(sendMessageDiscordMock.mock.calls).toEqual([
      expect.arrayContaining([
        "channel:789",
        "12345",
        expect.objectContaining({ replyTo: "reply-1" }),
      ]),
      expect.arrayContaining([
        "channel:789",
        "67890",
        expect.not.objectContaining({ replyTo: expect.anything() }),
      ]),
    ]);
  });

  it("does not consume replyToId for replyToMode=first on whitespace-only payloads", async () => {
=======
  it("preserves component-only channelData payloads when text scrubs empty", async () => {
    const channelData = {
      discord: {
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 1,
                label: "Open",
                custom_id: "open",
              },
            ],
          },
        ],
      },
    };

>>>>>>> upstream/main
    await deliverDiscordReply({
      replies: [
        {
          text: "analysis: internal only",
          channelData,
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ channelData, text: undefined }]);
  });

  it("preserves presentation-only payloads when text scrubs empty", async () => {
    const presentation = {
      title: "Action required",
      blocks: [
        {
          type: "buttons" as const,
          buttons: [{ label: "Approve", value: "approve", style: "primary" as const }],
        },
      ],
    };

    await deliverDiscordReply({
      replies: [
        {
          text: "commentary: hidden",
          presentation,
        },
      ],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ presentation, text: undefined }]);
  });

  it("does not strip ordinary code-fenced examples of tool-call labels", async () => {
    const text = ["Example:", "```", "🛠️ Exec: run ls", "```"].join("\n");

    await deliverDiscordReply({
      replies: [{ text }],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ text }]);
  });

  it("does not strip ordinary visible labeled lines", async () => {
    const text = [
      "Command: restart the gateway",
      "Search: check recent Discord logs",
      "Open: the channel status page",
      "Find: the failing account",
    ].join("\n");

    await deliverDiscordReply({
      replies: [{ text }],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      kind: "final",
    });

    expect(firstDeliverParams().payloads).toEqual([{ text }]);
  });

  it("passes resolved Discord formatting options as explicit delivery options", async () => {
    const baseCfg = {
      channels: {
        discord: {
          token: "test-token",
          markdown: { tables: "code" },
          accounts: {
            default: {
              token: "account-token",
              maxLinesPerMessage: 99,
              streaming: { chunkMode: "length" },
            },
          },
        },
      },
    } as OpenClawConfig;

    await deliverDiscordReply({
      replies: [{ text: "formatted" }],
      target: "channel:101",
      token: "token",
      accountId: "default",
      runtime,
      cfg: baseCfg,
      textLimit: 1234,
      maxLinesPerMessage: 7,
      tableMode: "off",
      chunkMode: "newline",
      kind: "final",
    });

    expect(firstDeliverParams().cfg).toBe(baseCfg);
    expect(firstDeliverParams().formatting).toEqual({
      textLimit: 1234,
      maxLinesPerMessage: 7,
      tableMode: "off",
      chunkMode: "newline",
    });
  });

  it("passes media roots and explicit off-mode payload reply tags to shared outbound", async () => {
    const replies = [
      {
        text: "explicit reply",
        replyToId: "reply-explicit-1",
        replyToTag: true,
      },
    ];

    await deliverDiscordReply({
      replies,
      target: "channel:202",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      replyToMode: "off",
      mediaLocalRoots: ["/tmp/openclaw-media"],
      kind: "final",
    });

    const params = firstDeliverParams();
    expect(params.payloads).toEqual(replies);
    expect(params.replyToId).toBeUndefined();
    expect(params.replyToMode).toBe("off");
    expect(params.mediaAccess).toEqual({ localRoots: ["/tmp/openclaw-media"] });
  });

  it("bridges Discord voice sends through the outbound dependency bag", async () => {
    await deliverDiscordReply({
      replies: [{ text: "voice", mediaUrl: "https://example.com/voice.ogg", audioAsVoice: true }],
      target: "channel:123",
      token: "token",
      runtime,
      cfg,
      textLimit: 2000,
      replyToId: "reply-1",
      kind: "final",
    });

    const deps = firstDeliverParams().deps!;
    await deps.discordVoice("channel:123", "https://example.com/voice.ogg", {
      cfg,
      replyTo: "reply-1",
    });

    expect(firstMockArg(sendVoiceMessageDiscordMock, "sendVoiceMessageDiscord", 0)).toBe(
      "channel:123",
    );
    expect(firstMockArg(sendVoiceMessageDiscordMock, "sendVoiceMessageDiscord", 1)).toBe(
      "https://example.com/voice.ogg",
    );
    const voiceOptions = objectArgAt(sendVoiceMessageDiscordMock, 2);
    expect(voiceOptions.cfg).toBe(cfg);
    expect(voiceOptions.token).toBe("token");
    expect(voiceOptions.replyTo).toBe("reply-1");
  });

  it("rewrites bound thread replies to parent target plus thread id and persona", async () => {
    const threadBindings = {
      listBySessionKey: vi.fn(() => [
        {
          accountId: "default",
          channelId: "parent-1",
          threadId: "thread-1",
          targetSessionKey: "agent:main:subagent:child",
          agentId: "main",
          label: "child",
          webhookId: "wh_1",
          webhookToken: "tok_1",
        },
      ]),
      touchThread: vi.fn(),
    };

    await deliverDiscordReply({
      replies: [{ text: "Hello from subagent" }],
      target: "channel:thread-1",
      token: "token",
      accountId: "default",
      runtime,
      cfg,
      textLimit: 2000,
      replyToId: "reply-1",
      sessionKey: "agent:main:subagent:child",
      threadBindings,
      kind: "final",
    });

    const params = firstDeliverParams();
    expect(params.to).toBe("channel:parent-1");
    expect(params.threadId).toBe("thread-1");
    expect(params.replyToId).toBe("reply-1");
    expect(recordField(params.identity, "identity").name).toBe("🤖 child");
    const session = recordField(params.session, "session");
    expect(session.key).toBe("agent:main:subagent:child");
    expect(session.agentId).toBe("main");
  });
});
