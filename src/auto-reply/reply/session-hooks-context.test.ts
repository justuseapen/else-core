// Tests context passed to session lifecycle hooks.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { HookRunner } from "../../plugins/hooks.js";
import { initSessionState } from "./session.js";

const hookRunnerMocks = vi.hoisted(() => ({
  hasHooks: vi.fn<HookRunner["hasHooks"]>(),
  runSessionStart: vi.fn<HookRunner["runSessionStart"]>(),
  runSessionEnd: vi.fn<HookRunner["runSessionEnd"]>(),
}));
const sessionCleanupMocks = vi.hoisted(() => ({
  closeTrackedBrowserTabsForSessions: vi.fn(async () => 0),
  resetRegisteredAgentHarnessSessions: vi.fn(async () => undefined),
  retireSessionMcpRuntime: vi.fn(async () => false),
}));

vi.mock("../../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () =>
    ({
      hasHooks: hookRunnerMocks.hasHooks,
      runSessionStart: hookRunnerMocks.runSessionStart,
      runSessionEnd: hookRunnerMocks.runSessionEnd,
    }) as unknown as HookRunner,
}));

vi.mock("../../agents/harness/registry.js", () => ({
  resetRegisteredAgentHarnessSessions: sessionCleanupMocks.resetRegisteredAgentHarnessSessions,
}));

vi.mock("../../agents/agent-bundle-mcp-tools.js", () => ({
  retireSessionMcpRuntime: sessionCleanupMocks.retireSessionMcpRuntime,
}));

vi.mock("../../plugin-sdk/browser-maintenance.js", () => ({
  closeTrackedBrowserTabsForSessions: sessionCleanupMocks.closeTrackedBrowserTabsForSessions,
}));

vi.mock("../../agents/session-write-lock.js", async () => {
  const actual = await vi.importActual<typeof import("../../agents/session-write-lock.js")>(
    "../../agents/session-write-lock.js",
  );
  return {
    ...actual,
    acquireSessionWriteLock: vi.fn(async () => ({ release: async () => {} })),
    resolveSessionLockMaxHoldFromTimeout: vi.fn(
      ({
        timeoutMs,
        graceMs = 2 * 60 * 1000,
        minMs = 5 * 60 * 1000,
      }: {
        timeoutMs: number;
        graceMs?: number;
        minMs?: number;
      }) => Math.max(minMs, timeoutMs + graceMs),
    ),
  };
});

async function createStorePath(prefix: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), `${prefix}-`));
  return path.join(root, "sessions.json");
}

async function writeStore(
  storePath: string,
  store: Record<string, SessionEntry | Record<string, unknown>>,
): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store), "utf-8");
}

async function writeTranscript(
  storePath: string,
  sessionId: string,
  text = "hello",
): Promise<string> {
  const transcriptPath = path.join(path.dirname(storePath), `${sessionId}.jsonl`);
  await fs.writeFile(
    transcriptPath,
    `${JSON.stringify({
      type: "message",
      id: `${sessionId}-m1`,
      message: { role: "user", content: text },
    })}\n`,
    "utf-8",
  );
  return transcriptPath;
}

<<<<<<< HEAD
=======
async function createStoredSession(params: {
  prefix: string;
  sessionKey: string;
  sessionId: string;
  text?: string;
  updatedAt?: number;
}): Promise<{ storePath: string; transcriptPath: string }> {
  const storePath = await createStorePath(params.prefix);
  const transcriptPath = await writeTranscript(storePath, params.sessionId, params.text);
  await writeStore(storePath, {
    [params.sessionKey]: {
      sessionId: params.sessionId,
      sessionFile: transcriptPath,
      updatedAt: params.updatedAt ?? Date.now(),
    },
  });
  return { storePath, transcriptPath };
}

type SessionResetConfig = NonNullable<NonNullable<OpenClawConfig["session"]>["reset"]>;

async function initStoredSessionState(params: {
  prefix: string;
  sessionKey: string;
  sessionId: string;
  text: string;
  updatedAt: number;
  reset?: SessionResetConfig;
}): Promise<void> {
  const { storePath } = await createStoredSession(params);
  const cfg = {
    session: {
      store: storePath,
      ...(params.reset ? { reset: params.reset } : {}),
    },
  } as OpenClawConfig;

  await initSessionState({
    ctx: { Body: "hello", SessionKey: params.sessionKey },
    cfg,
    commandAuthorized: true,
  });
}

function expectFields(value: unknown, expected: Record<string, unknown>): void {
  if (!value || typeof value !== "object") {
    throw new Error("expected fields object");
  }
  const record = value as Record<string, unknown>;
  for (const [key, expectedValue] of Object.entries(expected)) {
    expect(record[key], key).toEqual(expectedValue);
  }
}

function requireHookCall(
  mock: ReturnType<typeof vi.fn>,
  label: string,
): readonly [Record<string, unknown>, Record<string, unknown> | undefined] {
  const call = mock.mock.calls[0];
  if (!call) {
    throw new Error(`expected ${label} hook call`);
  }
  const [event, context] = call;
  if (!event || typeof event !== "object") {
    throw new Error(`expected ${label} hook event`);
  }
  if (context !== undefined && (!context || typeof context !== "object")) {
    throw new Error(`expected ${label} hook context`);
  }
  return [event as Record<string, unknown>, context as Record<string, unknown> | undefined];
}

>>>>>>> upstream/main
describe("session hook context wiring", () => {
  beforeEach(() => {
    hookRunnerMocks.hasHooks.mockReset();
    hookRunnerMocks.runSessionStart.mockReset();
    hookRunnerMocks.runSessionEnd.mockReset();
    sessionCleanupMocks.closeTrackedBrowserTabsForSessions.mockClear();
    sessionCleanupMocks.resetRegisteredAgentHarnessSessions.mockClear();
    sessionCleanupMocks.retireSessionMcpRuntime.mockClear();
    hookRunnerMocks.runSessionStart.mockResolvedValue(undefined);
    hookRunnerMocks.runSessionEnd.mockResolvedValue(undefined);
    hookRunnerMocks.hasHooks.mockImplementation(
      (hookName) => hookName === "session_start" || hookName === "session_end",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes sessionKey to session_start hook context", async () => {
    const sessionKey = "agent:main:telegram:direct:123";
    const storePath = await createStorePath("openclaw-session-hook-start");
    await writeStore(storePath, {});
    const cfg = { session: { store: storePath } } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "hello", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

    expect(hookRunnerMocks.runSessionStart).toHaveBeenCalledTimes(1);
<<<<<<< HEAD
    const [event, context] = hookRunnerMocks.runSessionStart.mock.calls[0] ?? [];
    expect(event).toMatchObject({ sessionKey });
    expect(context).toMatchObject({ sessionKey, agentId: "main" });
    expect(context).toMatchObject({ sessionId: event?.sessionId });
=======
    const [event, context] = requireHookCall(hookRunnerMocks.runSessionStart, "session_start");
    expectFields(event, { sessionKey });
    expectFields(context, { sessionKey, agentId: "main", sessionId: event?.sessionId });
>>>>>>> upstream/main
  });

  it("passes sessionKey to session_end hook context on reset", async () => {
    const sessionKey = "agent:main:telegram:direct:123";
<<<<<<< HEAD
    const storePath = await createStorePath("openclaw-session-hook-end");
    const transcriptPath = await writeTranscript(storePath, "old-session");
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId: "old-session",
        sessionFile: transcriptPath,
        updatedAt: Date.now(),
      },
=======
    const { storePath } = await createStoredSession({
      prefix: "openclaw-session-hook-end",
      sessionKey,
      sessionId: "old-session",
>>>>>>> upstream/main
    });
    const cfg = { session: { store: storePath } } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "/new", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

    expect(hookRunnerMocks.runSessionEnd).toHaveBeenCalledTimes(1);
    expect(hookRunnerMocks.runSessionStart).toHaveBeenCalledTimes(1);
<<<<<<< HEAD
    const [event, context] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
    expect(event).toMatchObject({
=======
    const [event, context] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
    expectFields(event, {
>>>>>>> upstream/main
      sessionKey,
      reason: "new",
      transcriptArchived: true,
    });
<<<<<<< HEAD
    expect(context).toMatchObject({ sessionKey, agentId: "main" });
    expect(context).toMatchObject({ sessionId: event?.sessionId });
    expect(event?.sessionFile).toContain(".jsonl.reset.");

    const [startEvent, startContext] = hookRunnerMocks.runSessionStart.mock.calls[0] ?? [];
    expect(startEvent).toMatchObject({ resumedFrom: "old-session" });
    expect(event?.nextSessionId).toBe(startEvent?.sessionId);
    expect(startContext).toMatchObject({ sessionId: startEvent?.sessionId });
=======
    expectFields(context, { sessionKey, agentId: "main", sessionId: event?.sessionId });
    expect(event?.sessionFile).toContain(".jsonl.reset.");

    const [startEvent, startContext] = requireHookCall(
      hookRunnerMocks.runSessionStart,
      "session_start",
    );
    expectFields(startEvent, { resumedFrom: "old-session" });
    expect(event?.nextSessionId).toBe(startEvent?.sessionId);
    expectFields(startContext, { sessionId: startEvent?.sessionId });
>>>>>>> upstream/main
  });

  it("marks explicit /reset rollovers with reason reset", async () => {
    const sessionKey = "agent:main:telegram:direct:456";
<<<<<<< HEAD
    const storePath = await createStorePath("openclaw-session-hook-explicit-reset");
    const transcriptPath = await writeTranscript(storePath, "reset-session", "reset me");
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId: "reset-session",
        sessionFile: transcriptPath,
        updatedAt: Date.now(),
      },
=======
    const { storePath } = await createStoredSession({
      prefix: "openclaw-session-hook-explicit-reset",
      sessionKey,
      sessionId: "reset-session",
      text: "reset me",
>>>>>>> upstream/main
    });
    const cfg = { session: { store: storePath } } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "/reset", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

<<<<<<< HEAD
    const [event] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
    expect(event).toMatchObject({ reason: "reset" });
=======
    const [event] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
    expectFields(event, { reason: "reset" });
>>>>>>> upstream/main
  });

  it("maps custom reset trigger aliases to the new-session reason", async () => {
    const sessionKey = "agent:main:telegram:direct:alias";
<<<<<<< HEAD
    const storePath = await createStorePath("openclaw-session-hook-reset-alias");
    const transcriptPath = await writeTranscript(storePath, "alias-session", "alias me");
    await writeStore(storePath, {
      [sessionKey]: {
        sessionId: "alias-session",
        sessionFile: transcriptPath,
        updatedAt: Date.now(),
      },
=======
    const { storePath } = await createStoredSession({
      prefix: "openclaw-session-hook-reset-alias",
      sessionKey,
      sessionId: "alias-session",
      text: "alias me",
>>>>>>> upstream/main
    });
    const cfg = {
      session: {
        store: storePath,
        resetTriggers: ["/fresh"],
      },
    } as OpenClawConfig;

    await initSessionState({
      ctx: { Body: "/fresh", SessionKey: sessionKey },
      cfg,
      commandAuthorized: true,
    });

<<<<<<< HEAD
    const [event] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
    expect(event).toMatchObject({ reason: "new" });
=======
    const [event] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
    expectFields(event, { reason: "new" });
>>>>>>> upstream/main
  });

  it("marks daily stale rollovers and exposes the archived transcript path", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
      const sessionKey = "agent:main:telegram:direct:daily";
<<<<<<< HEAD
      const storePath = await createStorePath("openclaw-session-hook-daily");
      const transcriptPath = await writeTranscript(storePath, "daily-session", "daily");
      await writeStore(storePath, {
        [sessionKey]: {
          sessionId: "daily-session",
          sessionFile: transcriptPath,
          updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
        },
      });
      const cfg = { session: { store: storePath } } as OpenClawConfig;

      await initSessionState({
        ctx: { Body: "hello", SessionKey: sessionKey },
        cfg,
        commandAuthorized: true,
      });

      const [event] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
      const [startEvent] = hookRunnerMocks.runSessionStart.mock.calls[0] ?? [];
      expect(event).toMatchObject({
=======
      await initStoredSessionState({
        prefix: "openclaw-session-hook-daily",
        sessionKey,
        sessionId: "daily-session",
        text: "daily",
        updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
      });

      const [event] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
      const [startEvent] = requireHookCall(hookRunnerMocks.runSessionStart, "session_start");
      expectFields(event, {
>>>>>>> upstream/main
        reason: "daily",
        transcriptArchived: true,
      });
      expect(event?.sessionFile).toContain(".jsonl.reset.");
      expect(event?.nextSessionId).toBe(startEvent?.sessionId);
    } finally {
      vi.useRealTimers();
    }
  });

  it("marks idle stale rollovers with reason idle", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
      const sessionKey = "agent:main:telegram:direct:idle";
<<<<<<< HEAD
      const storePath = await createStorePath("openclaw-session-hook-idle");
      const transcriptPath = await writeTranscript(storePath, "idle-session", "idle");
      await writeStore(storePath, {
        [sessionKey]: {
          sessionId: "idle-session",
          sessionFile: transcriptPath,
          updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
        },
      });
      const cfg = {
        session: {
          store: storePath,
          reset: {
            mode: "idle",
            idleMinutes: 30,
          },
        },
      } as OpenClawConfig;

      await initSessionState({
        ctx: { Body: "hello", SessionKey: sessionKey },
        cfg,
        commandAuthorized: true,
      });

      const [event] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
      expect(event).toMatchObject({ reason: "idle" });
=======
      await initStoredSessionState({
        prefix: "openclaw-session-hook-idle",
        sessionKey,
        sessionId: "idle-session",
        text: "idle",
        updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
        reset: {
          mode: "idle",
          idleMinutes: 30,
        },
      });

      const [event] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
      expectFields(event, { reason: "idle" });
>>>>>>> upstream/main
    } finally {
      vi.useRealTimers();
    }
  });

  it("prefers idle over daily when both rollover conditions are true", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 0, 18, 5, 30, 0));
      const sessionKey = "agent:main:telegram:direct:overlap";
<<<<<<< HEAD
      const storePath = await createStorePath("openclaw-session-hook-overlap");
      const transcriptPath = await writeTranscript(storePath, "overlap-session", "overlap");
      await writeStore(storePath, {
        [sessionKey]: {
          sessionId: "overlap-session",
          sessionFile: transcriptPath,
          updatedAt: new Date(2026, 0, 18, 4, 45, 0).getTime(),
        },
      });
      const cfg = {
        session: {
          store: storePath,
          reset: {
            mode: "daily",
            atHour: 4,
            idleMinutes: 30,
          },
        },
      } as OpenClawConfig;

      await initSessionState({
        ctx: { Body: "hello", SessionKey: sessionKey },
        cfg,
        commandAuthorized: true,
      });

      const [event] = hookRunnerMocks.runSessionEnd.mock.calls[0] ?? [];
      expect(event).toMatchObject({ reason: "idle" });
=======
      await initStoredSessionState({
        prefix: "openclaw-session-hook-overlap",
        sessionKey,
        sessionId: "overlap-session",
        text: "overlap",
        updatedAt: new Date(2026, 0, 18, 4, 45, 0).getTime(),
        reset: {
          mode: "daily",
          atHour: 4,
          idleMinutes: 30,
        },
      });

      const [event] = requireHookCall(hookRunnerMocks.runSessionEnd, "session_end");
      expectFields(event, { reason: "idle" });
>>>>>>> upstream/main
    } finally {
      vi.useRealTimers();
    }
  });
});
