<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HookRunner } from "../../plugins/hooks.js";
import type { MsgContext } from "../templating.js";
import { SILENT_REPLY_TOKEN } from "../tokens.js";
=======
// Tests before-agent-reply hooks in the get-reply pipeline.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { HookRunner } from "../../plugins/hooks.js";
import { SILENT_REPLY_TOKEN } from "../tokens.js";
import {
  buildGetReplyGroupCtx,
  createGetReplyContinueDirectivesResult,
  createGetReplySessionState,
  registerGetReplyRuntimeOverrides,
} from "./get-reply.test-fixtures.js";
import { loadGetReplyModuleForTest } from "./get-reply.test-loader.js";
>>>>>>> upstream/main
import "./get-reply.test-runtime-mocks.js";

const mocks = vi.hoisted(() => ({
  resolveReplyDirectives: vi.fn(),
  handleInlineActions: vi.fn(),
  initSessionState: vi.fn(),
  hasHooks: vi.fn<HookRunner["hasHooks"]>(),
  runBeforeAgentReply: vi.fn<HookRunner["runBeforeAgentReply"]>(),
}));

vi.mock("../../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () =>
    ({
      hasHooks: mocks.hasHooks,
      runBeforeAgentReply: mocks.runBeforeAgentReply,
    }) as unknown as HookRunner,
}));
<<<<<<< HEAD
vi.mock("./get-reply-directives.js", () => ({
  resolveReplyDirectives: (...args: unknown[]) => mocks.resolveReplyDirectives(...args),
}));
vi.mock("./get-reply-inline-actions.js", () => ({
  handleInlineActions: (...args: unknown[]) => mocks.handleInlineActions(...args),
}));
vi.mock("./session.js", () => ({
  initSessionState: (...args: unknown[]) => mocks.initSessionState(...args),
}));

let getReplyFromConfig: typeof import("./get-reply.js").getReplyFromConfig;

async function loadFreshGetReplyModuleForTest() {
  vi.resetModules();
  ({ getReplyFromConfig } = await import("./get-reply.js"));
}

function buildCtx(overrides: Partial<MsgContext> = {}): MsgContext {
  return {
    Provider: "telegram",
    Surface: "telegram",
    OriginatingChannel: "telegram",
    OriginatingTo: "telegram:-100123",
    ChatType: "group",
    Body: "hello world",
    BodyForAgent: "hello world",
    RawBody: "hello world",
    CommandBody: "hello world",
    BodyForCommands: "hello world",
    SessionKey: "agent:main:telegram:-100123",
    From: "telegram:user:42",
    To: "telegram:-100123",
    Timestamp: 1710000000000,
    ...overrides,
  };
}

function createContinueDirectivesResult() {
  return {
    kind: "continue" as const,
    result: {
      commandSource: "text",
      command: {
        surface: "telegram",
        channel: "telegram",
        channelId: "telegram",
        ownerList: [],
        senderIsOwner: false,
        isAuthorizedSender: true,
        senderId: "42",
        abortKey: "agent:main:telegram:-100123",
        rawBodyNormalized: "hello world",
        commandBodyNormalized: "hello world",
        from: "telegram:user:42",
        to: "telegram:-100123",
        resetHookTriggered: false,
      },
      allowTextCommands: true,
      skillCommands: [],
      directives: {},
      cleanedBody: "hello world",
      elevatedEnabled: false,
      elevatedAllowed: false,
      elevatedFailures: [],
      defaultActivation: "always",
      resolvedThinkLevel: undefined,
      resolvedVerboseLevel: "off",
      resolvedReasoningLevel: "off",
      resolvedElevatedLevel: "off",
      execOverrides: undefined,
      blockStreamingEnabled: false,
      blockReplyChunking: undefined,
      resolvedBlockStreamingBreak: undefined,
      provider: "openai",
      model: "gpt-4o-mini",
      modelState: {
        resolveDefaultThinkingLevel: async () => undefined,
      },
      contextTokens: 0,
      inlineStatusRequested: false,
      directiveAck: undefined,
      perMessageQueueMode: undefined,
      perMessageQueueOptions: undefined,
    },
  };
}

describe("getReplyFromConfig before_agent_reply wiring", () => {
  beforeEach(async () => {
    await loadFreshGetReplyModuleForTest();
=======
registerGetReplyRuntimeOverrides(mocks);

let getReplyFromConfig: typeof import("./get-reply.js").getReplyFromConfig;

async function loadGetReplyRuntimeForTest() {
  ({ getReplyFromConfig } = await loadGetReplyModuleForTest({ cacheKey: import.meta.url }));
}

function createContinueDirectivesResult() {
  return createGetReplyContinueDirectivesResult({
    body: "hello world",
    abortKey: "agent:main:telegram:-100123",
    from: "telegram:user:42",
    to: "telegram:-100123",
    senderId: "42",
    commandSource: "text",
    senderIsOwner: false,
    resetHookTriggered: false,
  });
}

describe("getReplyFromConfig before_agent_reply wiring", () => {
  beforeAll(async () => {
    await loadGetReplyRuntimeForTest();
  });

  beforeEach(() => {
    vi.stubEnv("OPENCLAW_ALLOW_SLOW_REPLY_TESTS", "1");
>>>>>>> upstream/main
    mocks.resolveReplyDirectives.mockReset();
    mocks.handleInlineActions.mockReset();
    mocks.initSessionState.mockReset();
    mocks.hasHooks.mockReset();
    mocks.runBeforeAgentReply.mockReset();

<<<<<<< HEAD
    mocks.initSessionState.mockResolvedValue({
      sessionCtx: buildCtx({
        OriginatingChannel: "Telegram",
        Provider: "telegram",
      }),
      sessionEntry: {},
      previousSessionEntry: {},
      sessionStore: {},
      sessionKey: "agent:main:telegram:-100123",
      sessionId: "session-1",
      isNewSession: false,
      resetTriggered: false,
      systemSent: false,
      abortedLastRun: false,
      storePath: "/tmp/sessions.json",
      sessionScope: "per-chat",
      groupResolution: undefined,
      isGroup: true,
      triggerBodyNormalized: "hello world",
      bodyStripped: "hello world",
    });
=======
    mocks.initSessionState.mockResolvedValue(
      createGetReplySessionState({
        sessionCtx: buildGetReplyGroupCtx({ OriginatingChannel: "Telegram", Provider: "telegram" }),
        sessionKey: "agent:main:telegram:-100123",
        sessionScope: "per-chat",
        isGroup: true,
        triggerBodyNormalized: "hello world",
        bodyStripped: "hello world",
      }),
    );
>>>>>>> upstream/main
    mocks.resolveReplyDirectives.mockResolvedValue(createContinueDirectivesResult());
    mocks.handleInlineActions.mockResolvedValue({
      kind: "continue",
      directives: {},
      abortedLastRun: false,
<<<<<<< HEAD
=======
      cleanedBody: "hello world",
>>>>>>> upstream/main
    });
    mocks.hasHooks.mockImplementation((hookName) => hookName === "before_agent_reply");
  });

  it("returns a plugin reply and invokes the hook after inline actions", async () => {
    mocks.runBeforeAgentReply.mockResolvedValue({
      handled: true,
      reply: { text: "plugin reply" },
    });

<<<<<<< HEAD
    const result = await getReplyFromConfig(buildCtx(), undefined, {});

    expect(result).toEqual({ text: "plugin reply" });
    expect(mocks.runBeforeAgentReply).toHaveBeenCalledWith(
      { cleanedBody: "hello world" },
      expect.objectContaining({
        agentId: "main",
        sessionKey: "agent:main:telegram:-100123",
        sessionId: "session-1",
        workspaceDir: "/tmp/workspace",
        messageProvider: "telegram",
        trigger: "user",
        channelId: "telegram",
      }),
    );
=======
    const result = await getReplyFromConfig(buildGetReplyGroupCtx(), undefined, {});

    expect(result).toEqual({ text: "plugin reply" });
    expect(mocks.runBeforeAgentReply).toHaveBeenCalledTimes(1);
    const [[body, hookCtx]] = mocks.runBeforeAgentReply.mock.calls as unknown as Array<
      [
        { cleanedBody?: string },
        {
          agentId?: string;
          sessionKey?: string;
          sessionId?: string;
          workspaceDir?: string;
          messageProvider?: string;
          trigger?: string;
          channelId?: string;
        },
      ]
    >;
    expect(body.cleanedBody).toBe("hello world");
    expect(hookCtx.agentId).toBe("main");
    expect(hookCtx.sessionKey).toBe("agent:main:telegram:-100123");
    expect(hookCtx.sessionId).toBe("session-1");
    expect(hookCtx.workspaceDir).toBe("/tmp/workspace");
    expect(hookCtx.messageProvider).toBe("telegram");
    expect(hookCtx.trigger).toBe("user");
    expect(hookCtx.channelId).toBe("-100123");
>>>>>>> upstream/main
    expect(mocks.handleInlineActions.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.runBeforeAgentReply.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("falls back to NO_REPLY when the hook claims without a reply payload", async () => {
    mocks.runBeforeAgentReply.mockResolvedValue({ handled: true });

<<<<<<< HEAD
    const result = await getReplyFromConfig(buildCtx(), undefined, {});
=======
    const result = await getReplyFromConfig(buildGetReplyGroupCtx(), undefined, {});
>>>>>>> upstream/main

    expect(result).toEqual({ text: SILENT_REPLY_TOKEN });
  });
});
<<<<<<< HEAD
=======
afterEach(() => {
  vi.unstubAllEnvs();
});
>>>>>>> upstream/main
