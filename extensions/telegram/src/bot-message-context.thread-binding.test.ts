<<<<<<< HEAD
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { buildTelegramMessageContextForTest } from "./bot-message-context.test-harness.js";

const recordInboundSessionMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const resolveTelegramConversationRouteMock = vi.hoisted(() => vi.fn());

vi.mock("./bot-message-context.session.runtime.js", async () => {
  const actual = await vi.importActual<typeof import("./bot-message-context.session.runtime.js")>(
    "./bot-message-context.session.runtime.js",
  );
  return {
    ...actual,
    recordInboundSession: (...args: unknown[]) => recordInboundSessionMock(...args),
  };
});
vi.mock("./conversation-route.js", async () => {
  const actual =
    await vi.importActual<typeof import("./conversation-route.js")>("./conversation-route.js");
  return {
    ...actual,
=======
// Telegram tests cover bot message context.thread binding plugin behavior.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { telegramRouteTestSessionRuntime } from "./bot-message-context.route-test-support.js";
import { buildTelegramMessageContextForTest } from "./bot-message-context.test-harness.js";
import type { TelegramConversationBindingMode } from "./conversation-route.js";

const recordInboundSessionMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const resolveTelegramConversationRouteMock = vi.hoisted(() => vi.fn());
type TelegramTestSessionRuntime = NonNullable<
  import("./bot-message-context.types.js").BuildTelegramMessageContextParams["sessionRuntime"]
>;
const recordInboundSessionForThreadBindingTest: NonNullable<
  TelegramTestSessionRuntime["recordInboundSession"]
> = async (params) => {
  await recordInboundSessionMock(params);
};

vi.mock("./conversation-route.js", async () => {
  const actual =
    await vi.importActual<typeof import("./conversation-route.js")>("./conversation-route.js");
  return {
    ...actual,
>>>>>>> upstream/main
    resolveTelegramConversationRoute: (...args: unknown[]) =>
      resolveTelegramConversationRouteMock(...args),
  };
});

<<<<<<< HEAD
function createBoundRoute(params: { accountId: string; sessionKey: string; agentId: string }) {
  return {
    configuredBinding: null,
    configuredBindingSessionKey: "",
=======
const threadBindingSessionRuntime = {
  ...telegramRouteTestSessionRuntime,
  recordInboundSession: recordInboundSessionForThreadBindingTest,
} satisfies TelegramTestSessionRuntime;

function createBoundRoute(params: {
  accountId: string;
  sessionKey: string;
  agentId: string;
  bindingMode?: TelegramConversationBindingMode;
}) {
  return {
    bindingMode: params.bindingMode ?? {
      kind: "runtime-bound",
      sessionKey: params.sessionKey,
    },
>>>>>>> upstream/main
    route: {
      accountId: params.accountId,
      agentId: params.agentId,
      channel: "telegram",
      sessionKey: params.sessionKey,
      mainSessionKey: `agent:${params.agentId}:main`,
      matchedBy: "binding.channel",
      lastRoutePolicy: "bound",
    },
  } as const;
}
<<<<<<< HEAD

=======

function createForumTopicMessage() {
  return {
    message_id: 1,
    chat: { id: -100200300, type: "supergroup", is_forum: true },
    message_thread_id: 77,
    date: 1_700_000_000,
    text: "hello",
    from: { id: 42, first_name: "Alice" },
  } as const;
}

async function buildForumTopicMessageContext(accountId?: string) {
  return await buildTelegramMessageContextForTest({
    ...(accountId ? { accountId } : {}),
    sessionRuntime: threadBindingSessionRuntime,
    message: createForumTopicMessage(),
    options: { forceWasMentioned: true },
    resolveGroupActivation: () => true,
  });
}

function expectRouteArgs(): Record<string, unknown> {
  expect(resolveTelegramConversationRouteMock).toHaveBeenCalledTimes(1);
  return (
    resolveTelegramConversationRouteMock.mock.calls.at(0) as unknown as [Record<string, unknown>]
  )[0];
}

>>>>>>> upstream/main
describe("buildTelegramMessageContext thread binding override", () => {
  beforeEach(() => {
    recordInboundSessionMock.mockClear();
    resolveTelegramConversationRouteMock.mockReset();
  });

  it("passes forum topic messages through the route seam and uses the bound session", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "default",
        sessionKey: "agent:codex-acp:session-1",
        agentId: "codex-acp",
      }),
    );
<<<<<<< HEAD
=======

    const ctx = await buildForumTopicMessageContext();

    const routeArgs = expectRouteArgs();
    expect(routeArgs.accountId).toBe("default");
    expect(routeArgs.chatId).toBe(-100200300);
    expect(routeArgs.isGroup).toBe(true);
    expect(routeArgs.resolvedThreadId).toBe(77);
    expect(routeArgs.replyThreadId).toBe(77);
    expect(routeArgs.senderId).toBe("42");
    expect(ctx?.ctxPayload?.SessionKey).toBe("agent:codex-acp:session-1");
    expect(ctx?.turn.record.updateLastRoute).toBeUndefined();
  });

  it("bypasses mention gating for bound forum topic messages", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "default",
        sessionKey: "plugin-binding:openclaw-codex-app-server:session-1",
        agentId: "main",
        bindingMode: { kind: "plugin-owned-runtime" },
      }),
    );
>>>>>>> upstream/main

    const ctx = await buildTelegramMessageContextForTest({
      sessionRuntime: threadBindingSessionRuntime,
      message: createForumTopicMessage(),
      resolveGroupActivation: () => undefined,
      resolveGroupRequireMention: () => true,
      resolveTelegramGroupConfig: () => ({
        groupConfig: { requireMention: true },
        topicConfig: { requireMention: true },
      }),
    });

<<<<<<< HEAD
    expect(resolveTelegramConversationRouteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "default",
        chatId: -100200300,
        isGroup: true,
        resolvedThreadId: 77,
        replyThreadId: 77,
        senderId: "42",
      }),
    );
    expect(ctx?.ctxPayload?.SessionKey).toBe("agent:codex-acp:session-1");
    expect(recordInboundSessionMock.mock.calls[0]?.[0]).toMatchObject({
      updateLastRoute: undefined,
    });
=======
    expect(ctx?.ctxPayload?.SessionKey).toBe("plugin-binding:openclaw-codex-app-server:session-1");
  });

  it("keeps mention gating for normal channel binding routes", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "default",
        sessionKey: "agent:main:telegram:group:-100200300:topic:77",
        agentId: "main",
      }),
    );

    const ctx = await buildTelegramMessageContextForTest({
      sessionRuntime: threadBindingSessionRuntime,
      message: createForumTopicMessage(),
      resolveGroupActivation: () => undefined,
      resolveGroupRequireMention: () => true,
      resolveTelegramGroupConfig: () => ({
        groupConfig: { requireMention: true },
        topicConfig: { requireMention: true },
      }),
    });

    expect(ctx).toBeNull();
>>>>>>> upstream/main
  });

  it("treats named-account bound conversations as explicit route matches", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "work",
        sessionKey: "agent:codex-acp:session-2",
        agentId: "codex-acp",
      }),
    );

    const ctx = await buildForumTopicMessageContext("work");

<<<<<<< HEAD
    expect(resolveTelegramConversationRouteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "work",
        chatId: -100200300,
        isGroup: true,
        resolvedThreadId: 77,
        replyThreadId: 77,
        senderId: "42",
      }),
    );
    expect(ctx).not.toBeNull();
=======
    const routeArgs = expectRouteArgs();
    expect(routeArgs.accountId).toBe("work");
    expect(routeArgs.chatId).toBe(-100200300);
    expect(routeArgs.isGroup).toBe(true);
    expect(routeArgs.resolvedThreadId).toBe(77);
    expect(routeArgs.replyThreadId).toBe(77);
    expect(routeArgs.senderId).toBe("42");
>>>>>>> upstream/main
    expect(ctx?.route.accountId).toBe("work");
    expect(ctx?.route.matchedBy).toBe("binding.channel");
    expect(ctx?.ctxPayload?.SessionKey).toBe("agent:codex-acp:session-2");
  });

  it("passes dm messages through the route seam and uses the bound session", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "default",
        sessionKey: "agent:codex-acp:session-dm",
        agentId: "codex-acp",
      }),
    );

    const ctx = await buildTelegramMessageContextForTest({
      sessionRuntime: threadBindingSessionRuntime,
      message: {
        message_id: 1,
        chat: { id: 1234, type: "private" },
        date: 1_700_000_000,
        text: "hello",
        from: { id: 42, first_name: "Alice" },
      },
    });

<<<<<<< HEAD
    expect(resolveTelegramConversationRouteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "default",
        chatId: 1234,
        isGroup: false,
        resolvedThreadId: undefined,
        replyThreadId: undefined,
        senderId: "42",
      }),
    );
    expect(ctx?.ctxPayload?.SessionKey).toBe("agent:codex-acp:session-dm");
=======
    const routeArgs = expectRouteArgs();
    expect(routeArgs.accountId).toBe("default");
    expect(routeArgs.chatId).toBe(1234);
    expect(routeArgs.isGroup).toBe(false);
    expect(routeArgs.resolvedThreadId).toBeUndefined();
    expect(routeArgs.replyThreadId).toBeUndefined();
    expect(routeArgs.senderId).toBe("42");
    expect(ctx?.ctxPayload?.SessionKey).toBe("agent:codex-acp:session-dm");
  });

  it("preserves Telegram DM topic thread IDs in the inbound context", async () => {
    resolveTelegramConversationRouteMock.mockReturnValue(
      createBoundRoute({
        accountId: "default",
        sessionKey: "agent:codex-acp:session-dm-topic",
        agentId: "codex-acp",
      }),
    );

    const ctx = await buildTelegramMessageContextForTest({
      sessionRuntime: threadBindingSessionRuntime,
      message: {
        message_id: 1,
        message_thread_id: 77,
        chat: { id: 1234, type: "private" },
        date: 1_700_000_000,
        text: "hello",
        from: { id: 42, first_name: "Alice" },
      },
    });

    const routeArgs = expectRouteArgs();
    expect(routeArgs.chatId).toBe(1234);
    expect(routeArgs.isGroup).toBe(false);
    expect(routeArgs.resolvedThreadId).toBeUndefined();
    expect(routeArgs.replyThreadId).toBe(77);
    expect(ctx?.ctxPayload?.MessageThreadId).toBe(77);
>>>>>>> upstream/main
  });
});
