<<<<<<< HEAD
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionBindingRecord } from "../../infra/outbound/session-binding-service.js";
=======
// Tests ACP dispatch abort behavior and emitted lifecycle hooks.
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
>>>>>>> upstream/main
import type {
  AcpRuntime,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeTurnInput,
} from "../../plugin-sdk/acp-runtime.js";
<<<<<<< HEAD
import type {
  PluginHookBeforeDispatchResult,
  PluginHookReplyDispatchResult,
  PluginTargetedInboundClaimOutcome,
} from "../../plugins/hooks.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import {
  createChannelTestPluginBase,
  createTestRegistry,
} from "../../test-utils/channel-plugins.js";
import { createInternalHookEventPayload } from "../../test-utils/internal-hook-event-payload.js";
import type { ReplyPayload } from "../types.js";
import type { ReplyDispatcher } from "./reply-dispatcher.js";
import { buildTestCtx } from "./test-ctx.js";

type AbortResult = { handled: boolean; aborted: boolean; stoppedSubagents?: number };

const mocks = vi.hoisted(() => ({
  routeReply: vi.fn(async (_params: unknown) => ({ ok: true, messageId: "mock" })),
  tryFastAbortFromMessage: vi.fn<() => Promise<AbortResult>>(async () => ({
    handled: false,
    aborted: false,
  })),
}));
const diagnosticMocks = vi.hoisted(() => ({
  logMessageQueued: vi.fn(),
  logMessageProcessed: vi.fn(),
  logSessionStateChange: vi.fn(),
}));
const hookMocks = vi.hoisted(() => ({
  registry: {
    plugins: [] as Array<{ id: string; status: "loaded" | "disabled" | "error" }>,
  },
  runner: {
    hasHooks: vi.fn<(hookName?: string) => boolean>(() => false),
    runInboundClaim: vi.fn(async () => undefined),
    runInboundClaimForPlugin: vi.fn(async () => undefined),
    runInboundClaimForPluginOutcome: vi.fn<() => Promise<PluginTargetedInboundClaimOutcome>>(
      async () => ({ status: "no_handler" as const }),
    ),
    runMessageReceived: vi.fn(async () => {}),
    runBeforeDispatch: vi.fn<
      (_event: unknown, _ctx: unknown) => Promise<PluginHookBeforeDispatchResult | undefined>
    >(async () => undefined),
    runReplyDispatch: vi.fn<
      (_event: unknown, _ctx: unknown) => Promise<PluginHookReplyDispatchResult | undefined>
    >(async () => undefined),
  },
}));
const internalHookMocks = vi.hoisted(() => ({
  createInternalHookEvent: vi.fn(),
  triggerInternalHook: vi.fn(async () => {}),
}));
const acpMocks = vi.hoisted(() => ({
  listAcpSessionEntries: vi.fn(async () => []),
  readAcpSessionEntry: vi.fn<(params: { sessionKey: string; cfg?: OpenClawConfig }) => unknown>(
    () => null,
  ),
  upsertAcpSessionMeta: vi.fn<
    (params: {
      sessionKey: string;
      cfg?: OpenClawConfig;
      mutate: (
        current: Record<string, unknown> | undefined,
        entry: { acp?: Record<string, unknown> } | undefined,
      ) => Record<string, unknown> | null | undefined;
    }) => Promise<unknown>
  >(async () => null),
  requireAcpRuntimeBackend: vi.fn<() => unknown>(),
}));
const sessionBindingMocks = vi.hoisted(() => ({
  listBySession: vi.fn<(targetSessionKey: string) => SessionBindingRecord[]>(() => []),
  resolveByConversation: vi.fn<
    (ref: {
      channel: string;
      accountId: string;
      conversationId: string;
      parentConversationId?: string;
    }) => SessionBindingRecord | null
  >(() => null),
  touch: vi.fn(),
}));
const pluginConversationBindingMocks = vi.hoisted(() => ({
  shownFallbackNoticeBindingIds: new Set<string>(),
}));
const sessionStoreMocks = vi.hoisted(() => ({
  currentEntry: undefined as Record<string, unknown> | undefined,
  loadSessionStore: vi.fn(() => ({})),
  resolveStorePath: vi.fn(() => "/tmp/mock-sessions.json"),
  resolveSessionStoreEntry: vi.fn(() => ({ existing: sessionStoreMocks.currentEntry })),
}));
const acpManagerRuntimeMocks = vi.hoisted(() => ({
  getAcpSessionManager: vi.fn(),
}));
const agentEventMocks = vi.hoisted(() => ({
  emitAgentEvent: vi.fn(),
  onAgentEvent: vi.fn<(listener: unknown) => () => void>(() => () => {}),
}));
const ttsMocks = vi.hoisted(() => ({
  maybeApplyTtsToPayload: vi.fn(async (paramsUnknown: unknown) => {
    const params = paramsUnknown as { payload: ReplyPayload };
    return params.payload;
  }),
  normalizeTtsAutoMode: vi.fn((value: unknown) => (typeof value === "string" ? value : undefined)),
  resolveTtsConfig: vi.fn((_cfg: OpenClawConfig) => ({ mode: "final" })),
}));
const threadInfoMocks = vi.hoisted(() => ({
  parseSessionThreadInfo: vi.fn<
    (sessionKey: string | undefined) => {
      baseSessionKey: string | undefined;
      threadId: string | undefined;
    }
  >(),
}));

function parseGenericThreadSessionInfo(sessionKey: string | undefined) {
  const trimmed = sessionKey?.trim();
  if (!trimmed) {
    return { baseSessionKey: undefined, threadId: undefined };
  }
  const threadMarker = ":thread:";
  const topicMarker = ":topic:";
  const marker = trimmed.includes(threadMarker)
    ? threadMarker
    : trimmed.includes(topicMarker)
      ? topicMarker
      : undefined;
  if (!marker) {
    return { baseSessionKey: trimmed, threadId: undefined };
  }
  const index = trimmed.lastIndexOf(marker);
  if (index < 0) {
    return { baseSessionKey: trimmed, threadId: undefined };
  }
  const baseSessionKey = trimmed.slice(0, index).trim() || undefined;
  const threadId = trimmed.slice(index + marker.length).trim() || undefined;
  return { baseSessionKey, threadId };
}

vi.mock("./route-reply.runtime.js", () => ({
  isRoutableChannel: () => true,
  routeReply: mocks.routeReply,
}));
vi.mock("./route-reply.js", () => ({
  isRoutableChannel: () => true,
  routeReply: mocks.routeReply,
}));
vi.mock("./abort.runtime.js", () => ({
  tryFastAbortFromMessage: mocks.tryFastAbortFromMessage,
  formatAbortReplyText: () => "⚙️ Agent was aborted.",
}));
vi.mock("../../logging/diagnostic.js", () => ({
  logMessageQueued: diagnosticMocks.logMessageQueued,
  logMessageProcessed: diagnosticMocks.logMessageProcessed,
  logSessionStateChange: diagnosticMocks.logSessionStateChange,
}));
vi.mock("../../config/sessions/thread-info.js", () => ({
  parseSessionThreadInfo: (sessionKey: string | undefined) =>
    threadInfoMocks.parseSessionThreadInfo(sessionKey),
}));
vi.mock("./dispatch-from-config.runtime.js", () => ({
  createInternalHookEvent: internalHookMocks.createInternalHookEvent,
  loadSessionStore: sessionStoreMocks.loadSessionStore,
  resolveSessionStoreEntry: sessionStoreMocks.resolveSessionStoreEntry,
  resolveStorePath: sessionStoreMocks.resolveStorePath,
  triggerInternalHook: internalHookMocks.triggerInternalHook,
}));
vi.mock("../../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () => hookMocks.runner,
  getGlobalPluginRegistry: () => hookMocks.registry,
}));
vi.mock("../../acp/runtime/session-meta.js", () => ({
  listAcpSessionEntries: acpMocks.listAcpSessionEntries,
  readAcpSessionEntry: acpMocks.readAcpSessionEntry,
  upsertAcpSessionMeta: acpMocks.upsertAcpSessionMeta,
}));
vi.mock("../../acp/runtime/registry.js", () => ({
  requireAcpRuntimeBackend: acpMocks.requireAcpRuntimeBackend,
}));
vi.mock("../../infra/outbound/session-binding-service.js", () => ({
  getSessionBindingService: () => ({
    bind: vi.fn(async () => {
      throw new Error("bind not mocked");
    }),
    getCapabilities: vi.fn(() => ({
      adapterAvailable: true,
      bindSupported: true,
      unbindSupported: true,
      placements: ["current", "child"] as const,
    })),
    listBySession: (targetSessionKey: string) =>
      sessionBindingMocks.listBySession(targetSessionKey),
    resolveByConversation: sessionBindingMocks.resolveByConversation,
    touch: sessionBindingMocks.touch,
    unbind: vi.fn(async () => []),
  }),
}));
vi.mock("../../infra/agent-events.js", () => ({
  emitAgentEvent: (params: unknown) => agentEventMocks.emitAgentEvent(params),
  onAgentEvent: (listener: unknown) => agentEventMocks.onAgentEvent(listener),
}));
vi.mock("../../plugins/conversation-binding.js", () => ({
  buildPluginBindingDeclinedText: () => "Plugin binding request was declined.",
  buildPluginBindingErrorText: () => "Plugin binding request failed.",
  buildPluginBindingUnavailableText: (binding: { pluginName?: string; pluginId: string }) =>
    `${binding.pluginName ?? binding.pluginId} is not currently loaded.`,
  hasShownPluginBindingFallbackNotice: (bindingId: string) =>
    pluginConversationBindingMocks.shownFallbackNoticeBindingIds.has(bindingId),
  isPluginOwnedSessionBindingRecord: (
    record: SessionBindingRecord | null | undefined,
  ): record is SessionBindingRecord =>
    record?.metadata != null &&
    typeof record.metadata === "object" &&
    (record.metadata as { pluginBindingOwner?: string }).pluginBindingOwner === "plugin",
  markPluginBindingFallbackNoticeShown: (bindingId: string) => {
    pluginConversationBindingMocks.shownFallbackNoticeBindingIds.add(bindingId);
  },
  toPluginConversationBinding: (record: SessionBindingRecord) => ({
    bindingId: record.bindingId,
    pluginId: "unknown-plugin",
    pluginName: undefined,
    pluginRoot: "",
    channel: record.conversation.channel,
    accountId: record.conversation.accountId,
    conversationId: record.conversation.conversationId,
    parentConversationId: record.conversation.parentConversationId,
  }),
}));
vi.mock("./dispatch-acp-manager.runtime.js", () => ({
  getAcpSessionManager: () => acpManagerRuntimeMocks.getAcpSessionManager(),
  getSessionBindingService: () => ({
    listBySession: (targetSessionKey: string) =>
      sessionBindingMocks.listBySession(targetSessionKey),
    unbind: vi.fn(async () => []),
  }),
}));
vi.mock("../../tts/tts.js", () => ({
  maybeApplyTtsToPayload: (params: unknown) => ttsMocks.maybeApplyTtsToPayload(params),
  normalizeTtsAutoMode: (value: unknown) => ttsMocks.normalizeTtsAutoMode(value),
  resolveTtsConfig: (cfg: OpenClawConfig) => ttsMocks.resolveTtsConfig(cfg),
}));
vi.mock("../../tts/tts.runtime.js", () => ({
  maybeApplyTtsToPayload: (params: unknown) => ttsMocks.maybeApplyTtsToPayload(params),
}));
vi.mock("../../tts/status-config.js", () => ({
  resolveStatusTtsSnapshot: () => ({
    autoMode: "always",
    provider: "auto",
    maxLength: 1500,
    summarize: true,
  }),
}));
vi.mock("./dispatch-acp-tts.runtime.js", () => ({
  maybeApplyTtsToPayload: (params: unknown) => ttsMocks.maybeApplyTtsToPayload(params),
}));
vi.mock("./dispatch-acp-session.runtime.js", () => ({
  readAcpSessionEntry: (params: { sessionKey: string; cfg?: OpenClawConfig }) =>
    acpMocks.readAcpSessionEntry(params),
}));
vi.mock("../../tts/tts-config.js", () => ({
  normalizeTtsAutoMode: (value: unknown) => ttsMocks.normalizeTtsAutoMode(value),
  resolveConfiguredTtsMode: (cfg: OpenClawConfig) => ttsMocks.resolveTtsConfig(cfg).mode,
}));

const noAbortResult = { handled: false, aborted: false } as const;
let dispatchReplyFromConfig: typeof import("./dispatch-from-config.js").dispatchReplyFromConfig;
let tryDispatchAcpReplyHook: typeof import("../../plugin-sdk/acp-runtime.js").tryDispatchAcpReplyHook;

function createDispatcher(): ReplyDispatcher {
  return {
    sendToolResult: vi.fn(() => true),
    sendBlockReply: vi.fn(() => true),
    sendFinalReply: vi.fn(() => true),
    waitForIdle: vi.fn(async () => {}),
    getQueuedCounts: vi.fn(() => ({ tool: 0, block: 0, final: 0 })),
    getFailedCounts: vi.fn(() => ({ tool: 0, block: 0, final: 0 })),
    markComplete: vi.fn(),
  };
}
=======
import { createInternalHookEventPayload } from "../../test-utils/internal-hook-event-payload.js";
import {
  acpManagerRuntimeMocks,
  acpMocks,
  agentEventMocks,
  createDispatcher,
  diagnosticMocks,
  hookMocks,
  internalHookMocks,
  mocks,
  noAbortResult,
  resetPluginTtsAndThreadMocks,
  sessionBindingMocks,
  sessionStoreMocks,
  setDiscordTestRegistry,
} from "./dispatch-from-config.shared.test-harness.js";
import { buildTestCtx } from "./test-ctx.js";

let dispatchReplyFromConfig: typeof import("./dispatch-from-config.js").dispatchReplyFromConfig;
let tryDispatchAcpReplyHook: typeof import("../../plugin-sdk/acp-runtime.js").tryDispatchAcpReplyHook;
let resetInboundDedupe: typeof import("./inbound-dedupe.js").resetInboundDedupe;
let replyRunRegistry: typeof import("./reply-run-registry.js").replyRunRegistry;
let getActiveReplyRunCount: typeof import("./reply-run-registry.js").getActiveReplyRunCount;
let createReplyOperation: typeof import("./reply-run-registry.js").createReplyOperation;
let replyRunTesting: typeof import("./reply-run-registry.js").__testing;
>>>>>>> upstream/main

function shouldUseAcpReplyDispatchHook(eventUnknown: unknown): boolean {
  const event = eventUnknown as {
    sessionKey?: string;
<<<<<<< HEAD
=======
    isTailDispatch?: boolean;
>>>>>>> upstream/main
    ctx?: {
      SessionKey?: string;
      CommandTargetSessionKey?: string;
      AcpDispatchTailAfterReset?: boolean;
    };
  };
<<<<<<< HEAD
  if (event.ctx?.AcpDispatchTailAfterReset) {
=======
  if (event.isTailDispatch === true) {
>>>>>>> upstream/main
    return true;
  }
  return [event.sessionKey, event.ctx?.SessionKey, event.ctx?.CommandTargetSessionKey].some(
    (value) => {
      const key = value?.trim();
      return Boolean(key && (key.includes("acp:") || key.includes(":acp") || key.includes("-acp")));
    },
  );
}

function setNoAbort() {
  mocks.tryFastAbortFromMessage.mockResolvedValue(noAbortResult);
}

<<<<<<< HEAD
=======
async function raceWithTimeoutResult<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutResult: T,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(timeoutResult), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

>>>>>>> upstream/main
function createMockAcpSessionManager() {
  return {
    resolveSession: (params: { cfg: OpenClawConfig; sessionKey: string }) => {
      const entry = acpMocks.readAcpSessionEntry({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
      }) as { acp?: Record<string, unknown> } | null;
      if (entry?.acp) {
        return {
          kind: "ready" as const,
          sessionKey: params.sessionKey,
          meta: entry.acp,
        };
      }
      return { kind: "none" as const, sessionKey: params.sessionKey };
    },
    getObservabilitySnapshot: () => ({
      runtimeCache: { activeSessions: 0, idleTtlMs: 0, evictedTotal: 0 },
      turns: {
        active: 0,
        queueDepth: 0,
        completed: 0,
        failed: 0,
        averageLatencyMs: 0,
        maxLatencyMs: 0,
      },
      errorsByCode: {},
    }),
    runTurn: vi.fn(
      async (params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        text?: string;
        attachments?: unknown[];
        mode: string;
        requestId: string;
        signal?: AbortSignal;
        onEvent: (event: Record<string, unknown>) => Promise<void>;
      }) => {
        const entry = acpMocks.readAcpSessionEntry({
          cfg: params.cfg,
          sessionKey: params.sessionKey,
        }) as {
          acp?: { agent?: string; mode?: string };
        } | null;
        const runtimeBackend = acpMocks.requireAcpRuntimeBackend() as {
          runtime?: AcpRuntime;
        };
        if (!runtimeBackend.runtime) {
          throw new Error("ACP runtime backend not mocked");
        }
        const handle = await runtimeBackend.runtime.ensureSession({
          sessionKey: params.sessionKey,
          mode: (entry?.acp?.mode || "persistent") as AcpRuntimeEnsureInput["mode"],
          agent: entry?.acp?.agent || "codex",
        });
        const stream = runtimeBackend.runtime.runTurn({
          handle,
          text: params.text ?? "",
          attachments: params.attachments as AcpRuntimeTurnInput["attachments"],
          mode: params.mode as AcpRuntimeTurnInput["mode"],
          requestId: params.requestId,
          signal: params.signal,
        });
        for await (const event of stream) {
          await params.onEvent(event);
        }
      },
    ),
  };
}

describe("dispatchReplyFromConfig ACP abort", () => {
  beforeAll(async () => {
    ({ dispatchReplyFromConfig } = await import("./dispatch-from-config.js"));
    ({ tryDispatchAcpReplyHook } = await import("../../plugin-sdk/acp-runtime.js"));
<<<<<<< HEAD
  });

  beforeEach(() => {
    const discordTestPlugin = {
      ...createChannelTestPluginBase({
        id: "discord",
        capabilities: { chatTypes: ["direct"], nativeCommands: true },
      }),
      outbound: {
        deliveryMode: "direct",
        shouldSuppressLocalPayloadPrompt: () => false,
      },
    };
    setActivePluginRegistry(
      createTestRegistry([{ pluginId: "discord", source: "test", plugin: discordTestPlugin }]),
    );
=======
    ({ resetInboundDedupe } = await import("./inbound-dedupe.js"));
    ({
      replyRunRegistry,
      getActiveReplyRunCount,
      createReplyOperation,
      __testing: replyRunTesting,
    } = await import("./reply-run-registry.js"));
  });

  beforeEach(() => {
    setDiscordTestRegistry();
    replyRunTesting.resetReplyRunRegistry();
    resetInboundDedupe();
>>>>>>> upstream/main
    acpManagerRuntimeMocks.getAcpSessionManager.mockReset();
    acpManagerRuntimeMocks.getAcpSessionManager.mockReturnValue(createMockAcpSessionManager());
    hookMocks.runner.hasHooks.mockReset();
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "reply_dispatch",
    );
    hookMocks.runner.runBeforeDispatch.mockReset();
    hookMocks.runner.runBeforeDispatch.mockResolvedValue(undefined);
    hookMocks.runner.runReplyDispatch.mockReset();
    hookMocks.runner.runReplyDispatch.mockImplementation(async (event: unknown, ctx: unknown) => {
      if (!shouldUseAcpReplyDispatchHook(event)) {
        return undefined;
      }
      return (await tryDispatchAcpReplyHook(event as never, ctx as never)) ?? undefined;
    });
    hookMocks.runner.runInboundClaim.mockReset();
    hookMocks.runner.runInboundClaim.mockResolvedValue(undefined);
    hookMocks.runner.runInboundClaimForPlugin.mockReset();
    hookMocks.runner.runInboundClaimForPlugin.mockResolvedValue(undefined);
    hookMocks.runner.runInboundClaimForPluginOutcome.mockReset();
    hookMocks.runner.runInboundClaimForPluginOutcome.mockResolvedValue({
      status: "no_handler",
    });
    hookMocks.runner.runMessageReceived.mockReset();
    internalHookMocks.createInternalHookEvent.mockReset();
    internalHookMocks.createInternalHookEvent.mockImplementation(createInternalHookEventPayload);
    internalHookMocks.triggerInternalHook.mockReset();
    sessionStoreMocks.currentEntry = undefined;
    sessionStoreMocks.loadSessionStore.mockReset().mockReturnValue({});
<<<<<<< HEAD
=======
    sessionStoreMocks.readSessionEntry.mockReset().mockReturnValue(undefined);
>>>>>>> upstream/main
    sessionStoreMocks.resolveStorePath.mockReset().mockReturnValue("/tmp/mock-sessions.json");
    sessionStoreMocks.resolveSessionStoreEntry.mockReset().mockReturnValue({ existing: undefined });
    acpMocks.listAcpSessionEntries.mockReset().mockResolvedValue([]);
    acpMocks.readAcpSessionEntry.mockReset().mockReturnValue(null);
    acpMocks.upsertAcpSessionMeta.mockReset().mockResolvedValue(null);
<<<<<<< HEAD
=======
    acpMocks.getAcpRuntimeBackend.mockReset();
>>>>>>> upstream/main
    acpMocks.requireAcpRuntimeBackend.mockReset();
    sessionBindingMocks.listBySession.mockReset().mockReturnValue([]);
    sessionBindingMocks.resolveByConversation.mockReset().mockReturnValue(null);
    sessionBindingMocks.touch.mockReset();
<<<<<<< HEAD
    pluginConversationBindingMocks.shownFallbackNoticeBindingIds.clear();
    ttsMocks.maybeApplyTtsToPayload
      .mockReset()
      .mockImplementation(async (paramsUnknown: unknown) => {
        const params = paramsUnknown as { payload: ReplyPayload };
        return params.payload;
      });
    ttsMocks.normalizeTtsAutoMode
      .mockReset()
      .mockImplementation((value: unknown) => (typeof value === "string" ? value : undefined));
    ttsMocks.resolveTtsConfig.mockReset().mockReturnValue({ mode: "final" });
    threadInfoMocks.parseSessionThreadInfo
      .mockReset()
      .mockImplementation(parseGenericThreadSessionInfo);
    diagnosticMocks.logMessageQueued.mockReset();
    diagnosticMocks.logMessageProcessed.mockReset();
    diagnosticMocks.logSessionStateChange.mockReset();
=======
    resetPluginTtsAndThreadMocks();
    diagnosticMocks.logMessageQueued.mockReset();
    diagnosticMocks.logMessageProcessed.mockReset();
    diagnosticMocks.logSessionStateChange.mockReset();
    diagnosticMocks.markDiagnosticSessionProgress.mockReset();
>>>>>>> upstream/main
    agentEventMocks.emitAgentEvent.mockReset();
    agentEventMocks.onAgentEvent.mockReset().mockImplementation(() => () => {});
    setNoAbort();
  });

  it("aborts ACP dispatch promptly when the caller abort signal fires", async () => {
    let releaseTurn: (() => void) | undefined;
    const releasePromise = new Promise<void>((resolve) => {
      releaseTurn = resolve;
    });
    const runtime = {
      ensureSession: vi.fn(
        async (input: { sessionKey: string; mode: string; agent: string }) =>
          ({
            sessionKey: input.sessionKey,
            backend: "acpx",
            runtimeSessionName: `${input.sessionKey}:${input.mode}`,
          }) as AcpRuntimeHandle,
      ),
      runTurn: vi.fn(async function* (params: { signal?: AbortSignal }) {
        await new Promise<void>((resolve) => {
          if (params.signal?.aborted) {
            resolve();
            return;
          }
          const onAbort = () => resolve();
          params.signal?.addEventListener("abort", onAbort, { once: true });
          void releasePromise.then(resolve);
        });
        yield { type: "done" } as AcpRuntimeEvent;
      }),
      cancel: vi.fn(async () => {}),
      close: vi.fn(async () => {}),
    } satisfies AcpRuntime;
    acpMocks.readAcpSessionEntry.mockReturnValue({
      sessionKey: "agent:codex-acp:session-1",
      storeSessionKey: "agent:codex-acp:session-1",
      cfg: {},
      storePath: "/tmp/mock-sessions.json",
      entry: {},
      acp: {
        backend: "acpx",
        agent: "codex",
        runtimeSessionName: "runtime:1",
        mode: "persistent",
        state: "idle",
        lastActivityAt: Date.now(),
      },
    });
    acpMocks.requireAcpRuntimeBackend.mockReturnValue({
      id: "acpx",
      runtime,
    });

    const abortController = new AbortController();
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:codex-acp:session-1",
      BodyForAgent: "write a test",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        acp: {
          enabled: true,
          dispatch: { enabled: true },
        },
<<<<<<< HEAD
=======
        session: {
          sendPolicy: { default: "allow" },
        },
>>>>>>> upstream/main
      } as OpenClawConfig,
      dispatcher,
      replyOptions: { abortSignal: abortController.signal },
    });

    await vi.waitFor(() => {
      expect(runtime.runTurn).toHaveBeenCalledTimes(1);
    });
    abortController.abort();
<<<<<<< HEAD
    const outcome = await Promise.race([
      dispatchPromise.then(() => "settled" as const),
      new Promise<"pending">((resolve) => {
        setTimeout(() => resolve("pending"), 100);
      }),
    ]);
=======
    const outcome = await raceWithTimeoutResult(
      dispatchPromise.then(() => "settled" as const),
      100,
      "pending" as const,
    );
>>>>>>> upstream/main
    releaseTurn?.();
    await dispatchPromise;

    expect(outcome).toBe("settled");
<<<<<<< HEAD
=======
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("completes the dispatch-owned operation when ACP tail dispatch handles the turn", async () => {
    hookMocks.runner.runReplyDispatch.mockImplementation(async (eventUnknown: unknown) => {
      const event = eventUnknown as {
        isTailDispatch?: boolean;
      };
      if (event.isTailDispatch === true) {
        return {
          handled: true,
          queuedFinal: false,
          counts: { tool: 0, block: 0, final: 0 },
        };
      }
      return undefined;
    });

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:regular-tail",
      BodyForAgent: "/reset continue",
    });
    const result = await dispatchReplyFromConfig({
      ctx,
      cfg: {
        acp: {
          enabled: true,
          dispatch: { enabled: true },
        },
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: async (resolverCtx) => {
        resolverCtx.AcpDispatchTailAfterReset = true;
        return undefined;
      },
    });

    expect(result.counts.final).toBe(0);
    expect(hookMocks.runner.runReplyDispatch).toHaveBeenCalledTimes(2);
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("treats an aborted ACP tail dispatch as a handled dispatch", async () => {
    let tailDispatchStarted!: () => void;
    const tailDispatchStartedPromise = new Promise<void>((resolve) => {
      tailDispatchStarted = resolve;
    });
    hookMocks.runner.runReplyDispatch.mockImplementation(
      async (eventUnknown: unknown, hookCtxUnknown: unknown) => {
        const event = eventUnknown as {
          isTailDispatch?: boolean;
        };
        if (event.isTailDispatch === true) {
          const hookCtx = hookCtxUnknown as { abortSignal?: AbortSignal };
          expect(hookCtx.abortSignal).toBeDefined();
          tailDispatchStarted();
          return new Promise<never>(() => {});
        }
        return undefined;
      },
    );

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:tail-abort",
      BodyForAgent: "/reset continue",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        acp: {
          enabled: true,
          dispatch: { enabled: true },
        },
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: async (resolverCtx) => {
        resolverCtx.AcpDispatchTailAfterReset = true;
        return undefined;
      },
    });

    await tailDispatchStartedPromise;
    expect(replyRunRegistry.abort("agent:tail-abort")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("suppresses late reply_dispatch sends when a hook ignores a dispatch abort", async () => {
    let hookStarted!: () => void;
    let releaseHook!: () => void;
    let hookCompleted!: () => void;
    const hookStartedPromise = new Promise<void>((resolve) => {
      hookStarted = resolve;
    });
    const releaseHookPromise = new Promise<void>((resolve) => {
      releaseHook = resolve;
    });
    const hookCompletedPromise = new Promise<void>((resolve) => {
      hookCompleted = resolve;
    });
    const lateSendResults: boolean[] = [];

    hookMocks.runner.runReplyDispatch.mockImplementation(
      async (_eventUnknown: unknown, hookCtxUnknown: unknown) => {
        const hookCtx = hookCtxUnknown as {
          dispatcher: {
            sendToolResult: (payload: { text: string }) => boolean;
            sendBlockReply: (payload: { text: string }) => boolean;
            sendFinalReply: (payload: { text: string }) => boolean;
            getQueuedCounts: () => { tool: number; block: number; final: number };
          };
        };
        hookStarted();
        await releaseHookPromise;
        lateSendResults.push(
          hookCtx.dispatcher.sendToolResult({ text: "late tool should not send" }),
          hookCtx.dispatcher.sendBlockReply({ text: "late block should not send" }),
          hookCtx.dispatcher.sendFinalReply({ text: "late final should not send" }),
        );
        hookCompleted();
        return {
          handled: true,
          queuedFinal: false,
          counts: hookCtx.dispatcher.getQueuedCounts(),
        };
      },
    );

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:reply-dispatch-abort",
      BodyForAgent: "hang in reply dispatch",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await hookStartedPromise;
    expect(replyRunRegistry.abort("agent:reply-dispatch-abort")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(dispatcher.sendToolResult).not.toHaveBeenCalled();
    expect(dispatcher.sendBlockReply).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();

    releaseHook();
    await hookCompletedPromise;
    expect(lateSendResults).toEqual([false, false, false]);
    expect(dispatcher.sendToolResult).not.toHaveBeenCalled();
    expect(dispatcher.sendBlockReply).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("keys bound ACP tail abort ownership to the source dispatch session", async () => {
    const sourceSessionKey = "agent:main:discord:channel:C1";
    const boundAcpSessionKey = "agent:codex:acp:bound-session";
    const boundConversation = {
      bindingId: "binding-acp-tail",
      targetSessionKey: boundAcpSessionKey,
      targetKind: "session" as const,
      status: "active" as const,
      boundAt: Date.now(),
      conversation: {
        channel: "discord",
        accountId: "default",
        conversationId: "C1",
      },
    };
    const sessionStore = {
      [sourceSessionKey]: {
        sessionId: "source-session-id",
        updatedAt: Date.now(),
      },
      [boundAcpSessionKey]: {
        sessionId: "acp-session-id",
        updatedAt: Date.now(),
      },
    };
    sessionBindingMocks.resolveByConversation.mockReturnValue(boundConversation);
    sessionStoreMocks.loadSessionStore.mockReturnValue(sessionStore);
    sessionStoreMocks.resolveSessionStoreEntry.mockImplementation((...args: unknown[]) => {
      const params = args[0] as { store?: Record<string, unknown>; sessionKey?: string };
      const existing =
        params.store && params.sessionKey ? params.store[params.sessionKey] : undefined;
      return {
        existing:
          existing && typeof existing === "object"
            ? (existing as Record<string, unknown>)
            : undefined,
      };
    });
    acpMocks.readAcpSessionEntry.mockImplementation((params: { sessionKey: string }) =>
      params.sessionKey === boundAcpSessionKey
        ? {
            sessionKey: boundAcpSessionKey,
            storeSessionKey: boundAcpSessionKey,
            cfg: {},
            storePath: "/tmp/mock-sessions.json",
            entry: sessionStore[boundAcpSessionKey],
            acp: {
              backend: "acpx",
              agent: "codex",
              runtimeSessionName: "runtime:bound",
              mode: "persistent",
              state: "idle",
              lastActivityAt: Date.now(),
            },
          }
        : null,
    );

    let tailDispatchStarted!: () => void;
    const tailDispatchStartedPromise = new Promise<void>((resolve) => {
      tailDispatchStarted = resolve;
    });
    hookMocks.runner.runReplyDispatch.mockImplementation(
      async (eventUnknown: unknown, hookCtxUnknown: unknown) => {
        const event = eventUnknown as {
          sessionKey?: string;
          isTailDispatch?: boolean;
        };
        if (event.isTailDispatch === true) {
          const hookCtx = hookCtxUnknown as { abortSignal?: AbortSignal };
          expect(event.sessionKey).toBe(boundAcpSessionKey);
          expect(hookCtx.abortSignal).toBeDefined();
          tailDispatchStarted();
          return new Promise<never>(() => {});
        }
        return undefined;
      },
    );

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      OriginatingChannel: "discord",
      AccountId: "default",
      To: "C1",
      SessionKey: sourceSessionKey,
      BodyForAgent: "/reset continue",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        acp: {
          enabled: true,
          dispatch: { enabled: true },
        },
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: async (resolverCtx) => {
        resolverCtx.AcpDispatchTailAfterReset = true;
        return undefined;
      },
    });

    await tailDispatchStartedPromise;
    expect(replyRunRegistry.abort(boundAcpSessionKey)).toBe(false);
    expect(replyRunRegistry.abort(sourceSessionKey)).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("treats a pre-dispatch reply operation abort as a handled dispatch", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "before_dispatch",
    );
    let beforeDispatchStarted!: () => void;
    const beforeDispatchStartedPromise = new Promise<void>((resolve) => {
      beforeDispatchStarted = resolve;
    });
    hookMocks.runner.runBeforeDispatch.mockImplementation(
      async () =>
        new Promise<undefined>(() => {
          beforeDispatchStarted();
        }),
    );

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:pre-dispatch-abort",
      BodyForAgent: "hang in before dispatch",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await beforeDispatchStartedPromise;
    expect(replyRunRegistry.abort("agent:pre-dispatch-abort")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(diagnosticMocks.logMessageProcessed).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome: "completed",
        reason: "reply_operation_aborted",
      }),
    );
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("registers pre-dispatch abort ownership when diagnostics are disabled", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "before_dispatch",
    );
    let beforeDispatchStarted!: () => void;
    const beforeDispatchStartedPromise = new Promise<void>((resolve) => {
      beforeDispatchStarted = resolve;
    });
    hookMocks.runner.runBeforeDispatch.mockImplementation(
      async () =>
        new Promise<undefined>(() => {
          beforeDispatchStarted();
        }),
    );

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:diagnostics-disabled-abort",
      BodyForAgent: "hang in before dispatch",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: false },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await beforeDispatchStartedPromise;
    expect(replyRunRegistry.abort("agent:diagnostics-disabled-abort")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(diagnosticMocks.logMessageProcessed).not.toHaveBeenCalled();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("does not block pre-dispatch hooks behind active source operations", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "before_dispatch",
    );
    let beforeDispatchStarted!: () => void;
    const beforeDispatchStartedPromise = new Promise<void>((resolve) => {
      beforeDispatchStarted = resolve;
    });
    hookMocks.runner.runBeforeDispatch.mockImplementation(async () => {
      beforeDispatchStarted();
      return undefined;
    });

    const existingOperation = createReplyOperation({
      sessionKey: "agent:already-active",
      sessionId: "already-active-session",
      resetTriggered: false,
    });
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:already-active",
      BodyForAgent: "hang while an operation is already active",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await expect(beforeDispatchStartedPromise.then(() => "started" as const)).resolves.toBe(
      "started",
    );
    expect(replyRunRegistry.abort("agent:already-active")).toBe(true);
    type DispatchOutcome =
      | { status: "settled"; result: Awaited<typeof dispatchPromise> }
      | { status: "pending" };
    const outcome = await raceWithTimeoutResult<DispatchOutcome>(
      dispatchPromise.then((result) => ({ status: "settled" as const, result })),
      100,
      { status: "pending" as const },
    );
    expect(outcome).toMatchObject({
      status: "settled",
      result: {
        queuedFinal: false,
        counts: { tool: 0, block: 0, final: 0 },
      },
    });
    expect(existingOperation.result).toEqual({ kind: "aborted", code: "aborted_by_user" });
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("suppresses handled before_dispatch final delivery after active source abort", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "before_dispatch",
    );
    mocks.routeReply.mockClear();
    const existingOperation = createReplyOperation({
      sessionKey: "agent:already-active-handled",
      sessionId: "already-active-session",
      resetTriggered: false,
    });
    hookMocks.runner.runBeforeDispatch.mockImplementation(async () => {
      expect(replyRunRegistry.abort("agent:already-active-handled")).toBe(true);
      return {
        handled: true,
        text: "handled by hook",
      };
    });
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:already-active-handled",
      BodyForAgent: "hook handles while an operation is already active",
    });

    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(mocks.routeReply).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    expect(existingOperation.result).toEqual({ kind: "aborted", code: "aborted_by_user" });
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("wires active source operation abort into pre-dispatch reply_dispatch hooks", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "reply_dispatch",
    );
    let hookStarted!: () => void;
    let releaseHook!: () => void;
    let hookCompleted!: () => void;
    const hookStartedPromise = new Promise<void>((resolve) => {
      hookStarted = resolve;
    });
    const releaseHookPromise = new Promise<void>((resolve) => {
      releaseHook = resolve;
    });
    const hookCompletedPromise = new Promise<void>((resolve) => {
      hookCompleted = resolve;
    });
    const lateSendResults: boolean[] = [];
    const abortStates: boolean[] = [];
    let hookAbortSignal: AbortSignal | undefined;

    hookMocks.runner.runReplyDispatch.mockImplementation(
      async (_eventUnknown: unknown, hookCtxUnknown: unknown) => {
        const hookCtx = hookCtxUnknown as {
          abortSignal?: AbortSignal;
          dispatcher: {
            sendToolResult: (payload: { text: string }) => boolean;
            sendBlockReply: (payload: { text: string }) => boolean;
            sendFinalReply: (payload: { text: string }) => boolean;
            getQueuedCounts: () => { tool: number; block: number; final: number };
          };
        };
        hookAbortSignal = hookCtx.abortSignal;
        hookStarted();
        await releaseHookPromise;
        abortStates.push(hookCtx.abortSignal?.aborted === true);
        lateSendResults.push(
          hookCtx.dispatcher.sendToolResult({ text: "late tool should not send" }),
          hookCtx.dispatcher.sendBlockReply({ text: "late block should not send" }),
          hookCtx.dispatcher.sendFinalReply({ text: "late final should not send" }),
        );
        hookCompleted();
        return {
          handled: true,
          queuedFinal: false,
          counts: hookCtx.dispatcher.getQueuedCounts(),
        };
      },
    );

    const existingOperation = createReplyOperation({
      sessionKey: "agent:already-active-reply-dispatch",
      sessionId: "already-active-reply-dispatch-session",
      resetTriggered: false,
    });
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:already-active-reply-dispatch",
      BodyForAgent: "reply dispatch while an operation is already active",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await hookStartedPromise;
    expect(hookAbortSignal).toBe(existingOperation.abortSignal);
    expect(replyRunRegistry.abort("agent:already-active-reply-dispatch")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(existingOperation.result).toEqual({ kind: "aborted", code: "aborted_by_user" });

    releaseHook();
    await hookCompletedPromise;
    expect(abortStates).toEqual([true]);
    expect(lateSendResults).toEqual([false, false, false]);
    expect(dispatcher.sendToolResult).not.toHaveBeenCalled();
    expect(dispatcher.sendBlockReply).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("suppresses reply resolver runs after active source abort", async () => {
    const existingOperation = createReplyOperation({
      sessionKey: "agent:already-active-resolver",
      sessionId: "active-session",
      resetTriggered: false,
    });
    existingOperation.setPhase("running");
    const replyResolver = vi.fn(async () => undefined);
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:already-active-resolver",
      BodyForAgent: "resolver waits behind active operation",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver,
    });

    expect(replyRunRegistry.abort("agent:already-active-resolver")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(existingOperation.result).toEqual({ kind: "aborted", code: "aborted_by_user" });
    expect(replyResolver).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    existingOperation.complete();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("keeps caller abort active while waiting for an active source operation", async () => {
    const existingOperation = createReplyOperation({
      sessionKey: "agent:already-active-caller-abort",
      sessionId: "active-session",
      resetTriggered: false,
    });
    const callerAbort = new AbortController();
    const replyResolver = vi.fn(async () => ({ text: "late final should not send" }));
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:already-active-caller-abort",
      BodyForAgent: "resolver should honor caller abort too",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyOptions: { abortSignal: callerAbort.signal },
      replyResolver,
    });

    callerAbort.abort();

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(existingOperation.result).toBeNull();
    expect(replyResolver).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    existingOperation.abortByUser();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("suppresses late callback and final replies when the resolver ignores a dispatch abort", async () => {
    let resolverStarted!: () => void;
    let releaseResolver!: () => void;
    const resolverStartedPromise = new Promise<void>((resolve) => {
      resolverStarted = resolve;
    });
    const releaseResolverPromise = new Promise<void>((resolve) => {
      releaseResolver = resolve;
    });

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:resolver-abort",
      BodyForAgent: "hang in resolver",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: async (_resolverCtx, options) => {
        resolverStarted();
        await releaseResolverPromise;
        await options?.onToolResult?.({ text: "late tool should not send" });
        await options?.onBlockReply?.({ text: "late block should not send" });
        return { text: "late final should not send" };
      },
    });

    await resolverStartedPromise;
    expect(replyRunRegistry.abort("agent:resolver-abort")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();

    releaseResolver();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(dispatcher.sendToolResult).not.toHaveBeenCalled();
    expect(dispatcher.sendBlockReply).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).not.toHaveBeenCalled();
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("treats a resolver AbortError after dispatch abort as a handled dispatch", async () => {
    let resolverStarted!: () => void;
    const resolverStartedPromise = new Promise<void>((resolve) => {
      resolverStarted = resolve;
    });

    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:resolver-abort-error",
      BodyForAgent: "abort in resolver",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: async (_resolverCtx, options) => {
        resolverStarted();
        const abortSignal = options?.abortSignal;
        if (!abortSignal) {
          throw new Error("expected dispatch abort signal");
        }
        await new Promise<void>((resolve) => {
          abortSignal.addEventListener("abort", () => resolve(), { once: true });
        });
        const err = new Error("resolver aborted");
        err.name = "AbortError";
        throw err;
      },
    });

    await resolverStartedPromise;
    expect(replyRunRegistry.abort("agent:resolver-abort-error")).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(diagnosticMocks.logMessageProcessed).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome: "completed",
        reason: "reply_operation_aborted",
      }),
    );
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("keys native command pre-dispatch ownership to the command target session", async () => {
    hookMocks.runner.hasHooks.mockImplementation(
      (hookName?: string) => hookName === "before_dispatch",
    );
    let beforeDispatchStarted!: () => void;
    const beforeDispatchStartedPromise = new Promise<void>((resolve) => {
      beforeDispatchStarted = resolve;
    });
    hookMocks.runner.runBeforeDispatch.mockImplementation(
      async () =>
        new Promise<undefined>(() => {
          beforeDispatchStarted();
        }),
    );

    const sourceSessionKey = "agent:main:discord:slash:user-1";
    const targetSessionKey = "agent:main:discord:channel:target-1";
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      CommandSource: "native",
      CommandTurn: {
        kind: "native",
        source: "native",
        authorized: true,
      },
      SessionKey: sourceSessionKey,
      CommandTargetSessionKey: targetSessionKey,
      BodyForAgent: "hang before command target dispatch",
    });
    const dispatchPromise = dispatchReplyFromConfig({
      ctx,
      cfg: {
        diagnostics: { enabled: true },
        session: {
          sendPolicy: { default: "allow" },
        },
      } as OpenClawConfig,
      dispatcher,
      replyResolver: vi.fn(),
    });

    await expect(
      raceWithTimeoutResult(
        beforeDispatchStartedPromise.then(() => "started" as const),
        100,
        "pending" as const,
      ),
    ).resolves.toBe("started");
    expect(replyRunRegistry.abort(sourceSessionKey)).toBe(false);
    expect(replyRunRegistry.abort(targetSessionKey)).toBe(true);

    await expect(dispatchPromise).resolves.toMatchObject({
      queuedFinal: false,
      counts: { tool: 0, block: 0, final: 0 },
    });
    expect(getActiveReplyRunCount()).toBe(0);
  });

  it("does not let a current-session fast abort abort its own dispatch operation", async () => {
    const dispatcher = createDispatcher();
    const ctx = buildTestCtx({
      Provider: "discord",
      Surface: "discord",
      SessionKey: "agent:self-stop",
      BodyForAgent: "/stop",
    });
    const replyResolver = vi.fn();

    await expect(
      dispatchReplyFromConfig({
        ctx,
        cfg: {
          diagnostics: { enabled: true },
          session: {
            sendPolicy: { default: "allow" },
          },
        } as OpenClawConfig,
        dispatcher,
        replyOptions: { sourceReplyDeliveryMode: "automatic" },
        replyResolver,
        fastAbortResolver: async () => {
          expect(replyRunRegistry.abort("agent:self-stop")).toBe(false);
          return { handled: true, aborted: true };
        },
        formatAbortReplyTextResolver: () => "stopped",
      }),
    ).resolves.toMatchObject({
      queuedFinal: true,
    });

    expect(replyResolver).not.toHaveBeenCalled();
    expect(dispatcher.sendFinalReply).toHaveBeenCalledWith({ text: "stopped" });
    expect(getActiveReplyRunCount()).toBe(0);
>>>>>>> upstream/main
  });
});
