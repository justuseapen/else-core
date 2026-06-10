<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.spawn-workspace.context-injection.test.ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cleanupTempPaths,
  createContextEngineAttemptRunner,
  getHoisted,
  resetEmbeddedAttemptHarness,
} from "./attempt.spawn-workspace.test-support.js";

const hoisted = getHoisted();

describe("runEmbeddedAttempt context injection", () => {
  const tempPaths: string[] = [];

=======
// Coverage for bootstrap context injection and heartbeat filtering in attempts.
import type { AgentMessage } from "openclaw/plugin-sdk/agent-core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { filterHeartbeatTranscriptArtifacts } from "../../../auto-reply/heartbeat-filter.js";
import { HEARTBEAT_PROMPT } from "../../../auto-reply/heartbeat.js";
import { limitHistoryTurns } from "../history.js";
import { buildEmbeddedMessageActionDiscoveryInput } from "../message-action-discovery-input.js";
import {
  assembleAttemptContextEngine,
  type AttemptContextEngine,
  resolveAttemptBootstrapContext,
} from "./attempt.context-engine-helpers.js";
import { resetEmbeddedAttemptHarness } from "./attempt.spawn-workspace.test-support.js";

async function resolveBootstrapContext(params: {
  contextInjectionMode?: "always" | "continuation-skip" | "never";
  bootstrapContextMode?: string;
  bootstrapContextRunKind?: string;
  bootstrapMode?: "full" | "limited" | "none";
  completed?: boolean;
  resolver?: () => Promise<{ bootstrapFiles: unknown[]; contextFiles: unknown[] }>;
}) {
  // Helper exposes both resolved context and dependency calls so tests can
  // assert when bootstrap probing is skipped.
  const hasCompletedBootstrapTurn = vi.fn(async () => params.completed ?? false);
  const resolveBootstrapContextForRun =
    params.resolver ??
    vi.fn(async () => ({
      bootstrapFiles: [],
      contextFiles: [],
    }));

  const result = await resolveAttemptBootstrapContext({
    contextInjectionMode: params.contextInjectionMode ?? "always",
    bootstrapContextMode: params.bootstrapContextMode ?? "full",
    bootstrapContextRunKind: params.bootstrapContextRunKind ?? "default",
    bootstrapMode: params.bootstrapMode ?? "none",
    sessionFile: "/tmp/session.jsonl",
    hasCompletedBootstrapTurn,
    resolveBootstrapContextForRun,
  });

  return { result, hasCompletedBootstrapTurn, resolveBootstrapContextForRun };
}

describe("embedded attempt context injection", () => {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.spawn-workspace.context-injection.test.ts
  beforeEach(() => {
    resetEmbeddedAttemptHarness();
  });

<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.spawn-workspace.context-injection.test.ts
  afterEach(async () => {
    await cleanupTempPaths(tempPaths);
  });

  it("skips bootstrap reinjection on safe continuation turns when configured", async () => {
    hoisted.resolveContextInjectionModeMock.mockReturnValue("continuation-skip");
    hoisted.hasCompletedBootstrapTurnMock.mockResolvedValue(true);

    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      sessionKey: "agent:main",
      tempPaths,
    });

    expect(hoisted.hasCompletedBootstrapTurnMock).toHaveBeenCalled();
    expect(hoisted.resolveBootstrapContextForRunMock).not.toHaveBeenCalled();
  });

  it("checks continuation state only after taking the session lock", async () => {
    hoisted.resolveContextInjectionModeMock.mockReturnValue("continuation-skip");
    hoisted.hasCompletedBootstrapTurnMock.mockResolvedValue(true);

    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      sessionKey: "agent:main",
      tempPaths,
    });

    expect(hoisted.acquireSessionWriteLockMock).toHaveBeenCalled();
    expect(hoisted.hasCompletedBootstrapTurnMock).toHaveBeenCalled();
    const lockCallOrder = hoisted.acquireSessionWriteLockMock.mock.invocationCallOrder[0];
    const continuationCallOrder = hoisted.hasCompletedBootstrapTurnMock.mock.invocationCallOrder[0];
    expect(lockCallOrder).toBeLessThan(continuationCallOrder);
  });

  it("still resolves bootstrap context when continuation-skip has no completed assistant turn yet", async () => {
    hoisted.resolveContextInjectionModeMock.mockReturnValue("continuation-skip");
    hoisted.hasCompletedBootstrapTurnMock.mockResolvedValue(false);

    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      sessionKey: "agent:main",
      tempPaths,
    });

    expect(hoisted.resolveBootstrapContextForRunMock).toHaveBeenCalledTimes(1);
  });

  it("never skips heartbeat bootstrap filtering", async () => {
    hoisted.resolveContextInjectionModeMock.mockReturnValue("continuation-skip");
    hoisted.hasCompletedBootstrapTurnMock.mockResolvedValue(true);

    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      attemptOverrides: {
        bootstrapContextMode: "lightweight",
        bootstrapContextRunKind: "heartbeat",
      },
      sessionKey: "agent:main:heartbeat:test",
      tempPaths,
    });

    expect(hoisted.hasCompletedBootstrapTurnMock).not.toHaveBeenCalled();
    expect(hoisted.resolveBootstrapContextForRunMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contextMode: "lightweight",
        runKind: "heartbeat",
      }),
    );
  });

  it("records full bootstrap completion after a successful non-heartbeat turn", async () => {
    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      sessionKey: "agent:main",
      tempPaths,
    });

    expect(hoisted.sessionManager.appendCustomEntry).toHaveBeenCalledWith(
      "openclaw:bootstrap-context:full",
      expect.objectContaining({
        runId: "run-context-engine-forwarding",
        sessionId: "embedded-session",
      }),
    );
  });

  it("does not record full bootstrap completion for heartbeat runs", async () => {
    await createContextEngineAttemptRunner({
      contextEngine: {
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 1 }),
      },
      attemptOverrides: {
        bootstrapContextMode: "lightweight",
        bootstrapContextRunKind: "heartbeat",
      },
      sessionKey: "agent:main:heartbeat:test",
      tempPaths,
    });

    expect(hoisted.sessionManager.appendCustomEntry).not.toHaveBeenCalledWith(
      "openclaw:bootstrap-context:full",
      expect.anything(),
    );
=======
  it("skips bootstrap reinjection on safe continuation turns when configured", async () => {
    const { result, hasCompletedBootstrapTurn, resolveBootstrapContextForRun } =
      await resolveBootstrapContext({
        contextInjectionMode: "continuation-skip",
        completed: true,
      });

    expect(result.isContinuationTurn).toBe(true);
    expect(result.bootstrapFiles).toStrictEqual([]);
    expect(result.contextFiles).toStrictEqual([]);
    expect(hasCompletedBootstrapTurn).toHaveBeenCalledWith("/tmp/session.jsonl");
    expect(resolveBootstrapContextForRun).not.toHaveBeenCalled();
  });

  it("still resolves bootstrap context when continuation-skip has no completed assistant turn yet", async () => {
    const resolver = vi.fn(async () => ({
      bootstrapFiles: [{ name: "AGENTS.md" }],
      contextFiles: [{ path: "AGENTS.md" }],
    }));

    const { result } = await resolveBootstrapContext({
      contextInjectionMode: "continuation-skip",
      completed: false,
      resolver,
    });

    expect(result.isContinuationTurn).toBe(false);
    expect(result.bootstrapFiles).toEqual([{ name: "AGENTS.md" }]);
    expect(result.contextFiles).toEqual([{ path: "AGENTS.md" }]);
    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it("disables bootstrap injection without marking the turn as a continuation", async () => {
    const { result, hasCompletedBootstrapTurn, resolveBootstrapContextForRun } =
      await resolveBootstrapContext({
        contextInjectionMode: "never",
        bootstrapMode: "full",
        completed: true,
      });

    expect(result.isContinuationTurn).toBe(false);
    expect(result.shouldRecordCompletedBootstrapTurn).toBe(false);
    expect(result.bootstrapFiles).toStrictEqual([]);
    expect(result.contextFiles).toStrictEqual([]);
    expect(hasCompletedBootstrapTurn).not.toHaveBeenCalled();
    expect(resolveBootstrapContextForRun).not.toHaveBeenCalled();
  });

  it("does not let a stale completed marker suppress pending workspace bootstrap", async () => {
    // Pending BOOTSTRAP.md content takes precedence over completed-turn markers
    // from earlier sessions.
    const resolver = vi.fn(async () => ({
      bootstrapFiles: [{ name: "BOOTSTRAP.md" }],
      contextFiles: [{ path: "BOOTSTRAP.md" }],
    }));

    const { result, hasCompletedBootstrapTurn } = await resolveBootstrapContext({
      contextInjectionMode: "continuation-skip",
      bootstrapMode: "full",
      completed: true,
      resolver,
    });

    expect(result.isContinuationTurn).toBe(false);
    expect(result.bootstrapFiles).toEqual([{ name: "BOOTSTRAP.md" }]);
    expect(result.contextFiles).toEqual([{ path: "BOOTSTRAP.md" }]);
    expect(hasCompletedBootstrapTurn).not.toHaveBeenCalled();
    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it("builds embedded message-action discovery routing context", () => {
    const input = buildEmbeddedMessageActionDiscoveryInput({
      cfg: {},
      channel: "matrix",
      currentChannelId: "room",
      currentThreadTs: "thread",
      currentMessageId: 123,
      accountId: "work",
      sessionKey: "agent:main",
      sessionId: "session",
      agentId: "main",
      senderId: "@alice:example.org",
    });

    expect(input.channel).toBe("matrix");
    expect(input.currentChannelId).toBe("room");
    expect(input.currentThreadTs).toBe("thread");
    expect(input.currentMessageId).toBe(123);
    expect(input.accountId).toBe("work");
    expect(input.sessionKey).toBe("agent:main");
    expect(input.sessionId).toBe("session");
    expect(input.agentId).toBe("main");
    expect(input.requesterSenderId).toBe("@alice:example.org");
  });

  it("never skips heartbeat bootstrap filtering", async () => {
    const { result, hasCompletedBootstrapTurn, resolveBootstrapContextForRun } =
      await resolveBootstrapContext({
        contextInjectionMode: "continuation-skip",
        bootstrapContextMode: "lightweight",
        bootstrapContextRunKind: "heartbeat",
        completed: true,
      });

    expect(result.isContinuationTurn).toBe(false);
    expect(result.shouldRecordCompletedBootstrapTurn).toBe(false);
    expect(hasCompletedBootstrapTurn).not.toHaveBeenCalled();
    expect(resolveBootstrapContextForRun).toHaveBeenCalledTimes(1);
  });

  it("runs full bootstrap injection after a successful non-heartbeat turn", async () => {
    const resolver = vi.fn(async () => ({
      bootstrapFiles: [{ name: "AGENTS.md", content: "bootstrap context" }],
      contextFiles: [{ path: "AGENTS.md", content: "bootstrap context" }],
    }));

    const { result } = await resolveBootstrapContext({
      bootstrapContextMode: "full",
      bootstrapContextRunKind: "default",
      bootstrapMode: "full",
      resolver,
    });

    expect(result.shouldRecordCompletedBootstrapTurn).toBe(true);
    expect(result.bootstrapFiles).toEqual([{ name: "AGENTS.md", content: "bootstrap context" }]);
  });

  it("does not record full bootstrap completion for heartbeat runs", async () => {
    const { result } = await resolveBootstrapContext({
      bootstrapContextMode: "lightweight",
      bootstrapContextRunKind: "heartbeat",
      bootstrapMode: "none",
    });

    expect(result.shouldRecordCompletedBootstrapTurn).toBe(false);
  });

  it("allows continuation skip again for limited bootstrap mode", async () => {
    const { result, hasCompletedBootstrapTurn, resolveBootstrapContextForRun } =
      await resolveBootstrapContext({
        contextInjectionMode: "continuation-skip",
        bootstrapMode: "limited",
        completed: true,
      });

    expect(result.isContinuationTurn).toBe(true);
    expect(hasCompletedBootstrapTurn).toHaveBeenCalledWith("/tmp/session.jsonl");
    expect(resolveBootstrapContextForRun).not.toHaveBeenCalled();
    expect(result.shouldRecordCompletedBootstrapTurn).toBe(false);
  });

  it("filters no-op heartbeat pairs before history limiting and context-engine assembly", async () => {
    // Heartbeat artifacts should not consume the limited turn budget passed into
    // context-engine assembly.
    const assemble = vi.fn(async ({ messages }: { messages: AgentMessage[] }) => ({
      messages,
      estimatedTokens: 1,
    }));
    const sessionMessages: AgentMessage[] = [
      { role: "user", content: "real question", timestamp: 1 } as AgentMessage,
      { role: "assistant", content: "real answer", timestamp: 2 } as unknown as AgentMessage,
      { role: "user", content: HEARTBEAT_PROMPT, timestamp: 3 } as AgentMessage,
      { role: "assistant", content: "HEARTBEAT_OK", timestamp: 4 } as unknown as AgentMessage,
    ];

    const heartbeatFiltered = filterHeartbeatTranscriptArtifacts(
      sessionMessages,
      undefined,
      HEARTBEAT_PROMPT,
    );
    const limited = limitHistoryTurns(heartbeatFiltered, 1);
    await assembleAttemptContextEngine({
      contextEngine: {
        info: { id: "test", name: "Test", version: "0.0.1" },
        ingest: async () => ({ ingested: true }),
        compact: async () => ({ ok: false, compacted: false, reason: "unused" }),
        assemble,
      } satisfies AttemptContextEngine,
      sessionId: "session",
      sessionKey: "agent:main:guildchat:dm:test-user",
      messages: limited,
      modelId: "gpt-test",
    });

    const assembleInput = assemble.mock.calls.at(0)?.[0] as
      | { messages?: AgentMessage[] }
      | undefined;
    const projectedMessages = assembleInput?.messages?.map((message) => ({
      role: message.role,
      content: (message as { content?: unknown }).content,
    }));
    expect(projectedMessages).toEqual([
      { role: "user", content: "real question" },
      { role: "assistant", content: "real answer" },
    ]);
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.spawn-workspace.context-injection.test.ts
  });
});
