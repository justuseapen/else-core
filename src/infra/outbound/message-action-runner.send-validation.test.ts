<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type {
  ChannelDirectoryEntryKind,
  ChannelMessagingAdapter,
  ChannelOutboundAdapter,
  ChannelPlugin,
} from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import {
  createChannelTestPluginBase,
  createTestRegistry,
} from "../../test-utils/channel-plugins.js";
import { runMessageAction } from "./message-action-runner.js";

const slackConfig = {
  channels: {
    slack: {
      botToken: "xoxb-test",
      appToken: "xapp-test",
    },
  },
} as OpenClawConfig;

const runDrySend = (params: {
  cfg: OpenClawConfig;
  actionParams: Record<string, unknown>;
  toolContext?: Record<string, unknown>;
}) =>
  runMessageAction({
    cfg: params.cfg,
    action: "send",
    params: params.actionParams as never,
    toolContext: params.toolContext as never,
    dryRun: true,
  });

type ResolvedTestTarget = { to: string; kind: ChannelDirectoryEntryKind };

const directOutbound: ChannelOutboundAdapter = { deliveryMode: "direct" };

function normalizeSlackTarget(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("#")) {
    return trimmed.slice(1).trim();
  }
  if (/^channel:/i.test(trimmed)) {
    return trimmed.replace(/^channel:/i, "").trim();
  }
  if (/^user:/i.test(trimmed)) {
    return trimmed.replace(/^user:/i, "").trim();
  }
  const mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
  if (mention?.[1]) {
    return mention[1];
  }
  return trimmed;
}

function createConfiguredTestPlugin(params: {
  id: "slack" | "telegram";
  isConfigured: (cfg: OpenClawConfig) => boolean;
  normalizeTarget: (raw: string) => string | undefined;
  resolveTarget: (input: string) => ResolvedTestTarget | null;
}): ChannelPlugin {
  const messaging: ChannelMessagingAdapter = {
    normalizeTarget: params.normalizeTarget,
    targetResolver: {
      looksLikeId: (raw) => Boolean(params.resolveTarget(raw.trim())),
      hint: "<id>",
      resolveTarget: async (resolverParams) => {
        const resolved = params.resolveTarget(resolverParams.input);
        return resolved ? { ...resolved, source: "normalized" } : null;
      },
    },
    inferTargetChatType: (inferParams) =>
      params.resolveTarget(inferParams.to)?.kind === "user" ? "direct" : "group",
  };
  return {
    ...createChannelTestPluginBase({
      id: params.id,
      config: {
        listAccountIds: () => ["default"],
        resolveAccount: () => ({ enabled: true }),
        isConfigured: (_account, cfg) => params.isConfigured(cfg),
      },
    }),
    outbound: directOutbound,
    messaging,
  };
}

const slackTestPlugin = createConfiguredTestPlugin({
  id: "slack",
  isConfigured: (cfg) => Boolean(cfg.channels?.slack?.botToken?.trim()),
  normalizeTarget: (raw) => normalizeSlackTarget(raw) || undefined,
  resolveTarget: (input) => {
    const normalized = normalizeSlackTarget(input);
    if (!normalized) {
      return null;
    }
    if (/^[A-Z0-9]+$/i.test(normalized)) {
      const kind = /^U/i.test(normalized) ? "user" : "group";
      return { to: normalized, kind };
    }
    return null;
  },
});

const telegramTestPlugin = createConfiguredTestPlugin({
  id: "telegram",
  isConfigured: (cfg) => Boolean(cfg.channels?.telegram?.botToken?.trim()),
  normalizeTarget: (raw) => raw.trim() || undefined,
  resolveTarget: (input) => {
    const normalized = input.trim();
    if (!normalized) {
      return null;
    }
    return {
      to: normalized.replace(/^telegram:/i, ""),
      kind: normalized.startsWith("@") ? "user" : "group",
    };
  },
});
=======
// Covers send validation for target/channel mismatches, configured channel
// availability, and explicit target requirements.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import { createTestRegistry } from "../../test-utils/channel-plugins.js";
import { runMessageAction } from "./message-action-runner.js";
import {
  forumTestPlugin,
  runDrySend,
  workspaceConfig,
  workspaceTestPlugin,
} from "./message-action-runner.test-helpers.js";

const emptyConfig = {} as OpenClawConfig;
>>>>>>> upstream/main

describe("runMessageAction send validation", () => {
  beforeEach(() => {
    setActivePluginRegistry(
      createTestRegistry([
        {
<<<<<<< HEAD
          pluginId: "slack",
          source: "test",
          plugin: slackTestPlugin,
        },
        {
          pluginId: "telegram",
          source: "test",
          plugin: telegramTestPlugin,
=======
          pluginId: "workspace",
          source: "test",
          plugin: workspaceTestPlugin,
        },
        {
          pluginId: "forum",
          source: "test",
          plugin: forumTestPlugin,
>>>>>>> upstream/main
        },
      ]),
    );
  });

  afterEach(() => {
    setActivePluginRegistry(createTestRegistry([]));
  });

  it("requires message when no media hint is provided", async () => {
    await expect(
      runDrySend({
<<<<<<< HEAD
        cfg: slackConfig,
        actionParams: {
          channel: "slack",
=======
        cfg: workspaceConfig,
        actionParams: {
          channel: "workspace",
>>>>>>> upstream/main
          target: "#C12345678",
        },
        toolContext: { currentChannelId: "C12345678" },
      }),
    ).rejects.toThrow(/message required/i);
  });

<<<<<<< HEAD
  it("allows send when only shared interactive payloads are provided", async () => {
    const result = await runDrySend({
      cfg: {
        channels: {
          telegram: {
            botToken: "telegram-test",
=======
  it("allows send when only presentation payloads are provided", async () => {
    const result = await runDrySend({
      cfg: {
        channels: {
          forum: {
            botToken: "forum-test",
>>>>>>> upstream/main
          },
        },
      } as OpenClawConfig,
      actionParams: {
<<<<<<< HEAD
        channel: "telegram",
        target: "123456",
        interactive: {
=======
        channel: "forum",
        target: "123456",
        presentation: {
>>>>>>> upstream/main
          blocks: [
            {
              type: "buttons",
              buttons: [{ label: "Approve", value: "approve" }],
            },
          ],
        },
      },
    });

    expect(result.kind).toBe("send");
  });

<<<<<<< HEAD
  it("allows send when only Slack blocks are provided", async () => {
    const result = await runDrySend({
      cfg: slackConfig,
      actionParams: {
        channel: "slack",
        target: "#C12345678",
        blocks: [{ type: "divider" }],
=======
  it("allows send when only generic presentation blocks are provided", async () => {
    const result = await runDrySend({
      cfg: workspaceConfig,
      actionParams: {
        channel: "workspace",
        target: "#C12345678",
        presentation: { blocks: [{ type: "divider" }] },
>>>>>>> upstream/main
      },
      toolContext: { currentChannelId: "C12345678" },
    });

    expect(result.kind).toBe("send");
  });

<<<<<<< HEAD
=======
  it("uses the current internal UI source as the message-tool-only send sink", async () => {
    const result = await runMessageAction({
      cfg: emptyConfig,
      action: "send",
      params: {
        message: "hello from codex",
      },
      toolContext: {
        currentChannelProvider: "webchat",
      },
      sessionKey: "agent:main",
      sourceReplyDeliveryMode: "message_tool_only",
    });

    expect(result).toMatchObject({
      kind: "send",
      channel: "webchat",
      to: "current-run",
      handledBy: "internal-source",
      dryRun: false,
      payload: {
        status: "ok",
        deliveryStatus: "sent",
        sourceReplySink: "internal-ui",
        sourceReply: {
          text: "hello from codex",
        },
      },
    });
    if (result.kind !== "send") {
      throw new Error(`expected send result, got ${result.kind}`);
    }
    expect(result.toolResult?.content).toEqual([
      {
        type: "text",
        text: "Sent visible reply to the current source conversation via internal-ui.",
      },
    ]);
    expect(result.toolResult?.details).toEqual({
      status: "ok",
      deliveryStatus: "sent",
      channel: "webchat",
      target: "current-run",
      sourceReplyDeliveryMode: "message_tool_only",
      sourceReplySink: "internal-ui",
      sourceReply: {
        text: "hello from codex",
      },
      message: "hello from codex",
      dryRun: false,
    });
    expect(JSON.stringify(result.toolResult?.content)).not.toContain("hello from codex");
  });

  it("uses non-webchat current source context as the message-tool-only send sink", async () => {
    const result = await runMessageAction({
      cfg: emptyConfig,
      action: "send",
      params: {
        message: "telegram reply",
      },
      toolContext: {
        currentChannelProvider: "telegram",
        currentChannelId: "user:123456789",
        currentMessageId: 98765,
      },
      sessionKey: "agent:main:telegram:direct:123456789",
      sourceReplyDeliveryMode: "message_tool_only",
    });

    expect(result).toMatchObject({
      kind: "send",
      channel: "webchat",
      to: "current-run",
      handledBy: "internal-source",
      payload: {
        status: "ok",
        sourceReplyDeliveryMode: "message_tool_only",
        sourceReply: {
          text: "telegram reply",
        },
      },
    });
  });

  it("requires source address context before inferring non-webchat source sinks", async () => {
    await expect(
      runMessageAction({
        cfg: emptyConfig,
        action: "send",
        params: {
          message: "telegram reply",
        },
        toolContext: {
          currentChannelProvider: "telegram",
        },
        sessionKey: "agent:main:telegram:direct:123456789",
        sourceReplyDeliveryMode: "message_tool_only",
      }),
    ).rejects.toThrow(/requires a target/i);
  });

  it("strips unsupported citation control markers from internal UI source replies", async () => {
    const result = await runMessageAction({
      cfg: emptyConfig,
      action: "send",
      params: {
        message: "v2026.5.20 release note citeturn2view0",
      },
      toolContext: {
        currentChannelProvider: "webchat",
      },
      sessionKey: "agent:main",
      sourceReplyDeliveryMode: "message_tool_only",
    });

    expect(result).toMatchObject({
      kind: "send",
      payload: {
        sourceReply: {
          text: "v2026.5.20 release note",
        },
      },
    });
    expect(JSON.stringify(result.payload)).not.toContain("turn2view0");
  });

  it("does not infer an internal UI sink outside message-tool-only source delivery", async () => {
    await expect(
      runMessageAction({
        cfg: emptyConfig,
        action: "send",
        params: {
          message: "hello from codex",
        },
        toolContext: {
          currentChannelProvider: "webchat",
        },
        sessionKey: "agent:main",
        sourceReplyDeliveryMode: "automatic",
      }),
    ).rejects.toThrow(/requires a target/i);
  });

  it("keeps explicit message routes on the normal outbound path", async () => {
    const result = await runMessageAction({
      cfg: workspaceConfig,
      action: "send",
      params: {
        channel: "workspace",
        target: "#C12345678",
        message: "hello from codex",
      },
      toolContext: {
        currentChannelProvider: "webchat",
      },
      sessionKey: "agent:main",
      sourceReplyDeliveryMode: "message_tool_only",
      dryRun: true,
    });

    expect(result).toMatchObject({
      kind: "send",
      channel: "workspace",
      handledBy: "core",
      dryRun: true,
    });
  });

  it("strips unsupported citation control markers from normal channel sends", async () => {
    const sentText: string[] = [];
    const sendText: NonNullable<
      NonNullable<typeof workspaceTestPlugin.outbound>["sendText"]
    > = async (ctx) => {
      sentText.push(ctx.text);
      return { channel: "workspace", messageId: "workspace-test-message" };
    };
    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "workspace",
          source: "test",
          plugin: {
            ...workspaceTestPlugin,
            outbound: {
              ...workspaceTestPlugin.outbound,
              sendText,
            },
          },
        },
      ]),
    );

    const result = await runMessageAction({
      cfg: workspaceConfig,
      action: "send",
      params: {
        channel: "workspace",
        target: "#C12345678",
        message: "v2026.5.20 release note citeturn2view0",
      },
    });

    expect(result).toMatchObject({
      kind: "send",
      channel: "workspace",
    });
    expect(sentText).toEqual(["v2026.5.20 release note"]);
    expect(JSON.stringify(result.payload)).not.toContain("turn2view0");
  });

  it("rejects message sends whose body is only leaked plain-text tool calls", async () => {
    await expect(
      runDrySend({
        cfg: workspaceConfig,
        actionParams: {
          channel: "workspace",
          target: "#C12345678",
          message: '[tool:read] {"path":"/app/skills/meme-maker/SKILL.md"}',
        },
        toolContext: { currentChannelId: "C12345678" },
      }),
    ).rejects.toThrow(/send requires text or media/i);
  });

>>>>>>> upstream/main
  it.each([
    {
      name: "structured poll params",
      actionParams: {
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        target: "#C12345678",
        message: "hi",
        pollQuestion: "Ready?",
        pollOption: ["Yes", "No"],
      },
    },
    {
      name: "string-encoded poll params",
      actionParams: {
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        target: "#C12345678",
        message: "hi",
        pollDurationSeconds: "60",
        pollPublic: "true",
      },
    },
    {
      name: "snake_case poll params",
      actionParams: {
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        target: "#C12345678",
        message: "hi",
        poll_question: "Ready?",
        poll_option: ["Yes", "No"],
        poll_public: "true",
      },
    },
    {
      name: "negative poll duration params",
      actionParams: {
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        target: "#C12345678",
        message: "hi",
        pollDurationSeconds: -5,
      },
    },
  ])("rejects send actions that include $name", async ({ actionParams }) => {
    await expect(
      runDrySend({
<<<<<<< HEAD
        cfg: slackConfig,
=======
        cfg: workspaceConfig,
>>>>>>> upstream/main
        actionParams,
        toolContext: { currentChannelId: "C12345678" },
      }),
    ).rejects.toThrow(/use action "poll" instead of "send"/i);
  });
<<<<<<< HEAD
=======

  it("allows send when only schema-padded shared poll modifiers are present", async () => {
    // LLMs routinely echo the shared `message` tool schema's poll modifier
    // defaults (`pollDurationHours: 1`, `pollMulti: false`) on every plain
    // `send` call alongside the rest of the schema-padded slots. Without a
    // pollQuestion or pollOption present, these defaults are noise — not
    // poll intent — and must not block the send.
    const result = await runDrySend({
      cfg: workspaceConfig,
      actionParams: {
        channel: "workspace",
        target: "#C12345678",
        message: "hello",
        pollQuestion: "",
        pollOption: [],
        pollDurationHours: 1,
        pollMulti: false,
      },
      toolContext: { currentChannelId: "C12345678" },
    });

    expect(result.kind).toBe("send");
  });
});

describe("message body alias normalization", () => {
  beforeEach(() => {
    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "workspace",
          source: "test",
          plugin: workspaceTestPlugin,
        },
      ]),
    );
  });

  afterEach(() => {
    setActivePluginRegistry(createTestRegistry([]));
    vi.restoreAllMocks();
  });

  it.each([
    { alias: "SendMessage", value: "hello from alias" },
    { alias: "content", value: "hello from content" },
    { alias: "text", value: "hello from text" },
  ])("normalizes $alias alias to message for send", async ({ alias, value }) => {
    const result = await runDrySend({
      cfg: workspaceConfig,
      actionParams: {
        channel: "workspace",
        target: "#C12345678",
        [alias]: value,
      },
      toolContext: { currentChannelId: "C12345678" },
    });

    expect(result.kind).toBe("send");
  });

  it("does not overwrite an explicit message with an alias", async () => {
    const result = await runDrySend({
      cfg: workspaceConfig,
      actionParams: {
        channel: "workspace",
        target: "#C12345678",
        message: "explicit",
        SendMessage: "alias value",
      },
      toolContext: { currentChannelId: "C12345678" },
    });

    expect(result.kind).toBe("send");
  });

  it("emits a diagnostic warning when normalizing an alias", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await runDrySend({
      cfg: workspaceConfig,
      actionParams: {
        channel: "workspace",
        target: "#C12345678",
        SendMessage: "alias body",
      },
      toolContext: { currentChannelId: "C12345678" },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[message-tool] normalized alias "SendMessage" to "message"'),
    );
  });

  it.each([
    {
      name: "reasoning tag",
      SendMessage: "<think>internal reasoning</think>Visible answer",
    },
    {
      name: "formatted reasoning prefix",
      SendMessage: "Reasoning:\n_internal plan_\n\nVisible answer",
    },
  ])("sanitizes SendMessage alias $name before delivery", async ({ SendMessage }) => {
    const result = await runMessageAction({
      cfg: emptyConfig,
      action: "send",
      params: {
        SendMessage,
      },
      toolContext: {
        currentChannelProvider: "webchat",
      },
      sessionKey: "agent:main",
      sourceReplyDeliveryMode: "message_tool_only",
    });

    expect(result).toMatchObject({
      kind: "send",
      payload: {
        sourceReply: {
          text: "Visible answer",
        },
      },
    });
  });

  it("still rejects send with no message and no alias", async () => {
    await expect(
      runDrySend({
        cfg: workspaceConfig,
        actionParams: {
          channel: "workspace",
          target: "#C12345678",
        },
        toolContext: { currentChannelId: "C12345678" },
      }),
    ).rejects.toThrow(/message required/i);
  });
>>>>>>> upstream/main
});
