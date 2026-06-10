<<<<<<< HEAD
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./subagent-registry.mocks.shared.js";
import {
  clearSessionStoreCacheForTest,
  drainSessionStoreLockQueuesForTest,
} from "../config/sessions/store.js";
import { captureEnv } from "../test-utils/env.js";

const { announceSpy } = vi.hoisted(() => ({
  announceSpy: vi.fn(async () => true),
}));
=======
// Subagent registry persistence-resume tests cover restoring disk-backed child
// runs after restart and resuming their completion announce flow.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import "./subagent-registry.mocks.shared.js";
import {
  clearSessionStoreCacheForTest,
  drainSessionStoreWriterQueuesForTest,
} from "../config/sessions/store.js";
import { withEnvAsync } from "../test-utils/env.js";
import {
  createSubagentRegistryTestDeps,
  writeSubagentSessionEntry,
} from "./subagent-registry.persistence.test-support.js";

const hoisted = vi.hoisted(() => ({
  announceSpy: vi.fn(async () => true),
  allowedRunIds: undefined as Set<string> | undefined,
  registryPath: undefined as string | undefined,
}));
const { announceSpy } = hoisted;
>>>>>>> upstream/main
vi.mock("./subagent-announce.js", () => ({
  runSubagentAnnounceFlow: announceSpy,
}));

vi.mock("./subagent-orphan-recovery.js", () => ({
  scheduleOrphanRecovery: vi.fn(),
}));

<<<<<<< HEAD
let initSubagentRegistry: typeof import("./subagent-registry.js").initSubagentRegistry;
let listSubagentRunsForRequester: typeof import("./subagent-registry.js").listSubagentRunsForRequester;
let registerSubagentRun: typeof import("./subagent-registry.js").registerSubagentRun;
let resetSubagentRegistryForTests: typeof import("./subagent-registry.js").resetSubagentRegistryForTests;

async function loadSubagentRegistryModules(): Promise<void> {
  vi.resetModules();
  ({
    initSubagentRegistry,
    listSubagentRunsForRequester,
    registerSubagentRun,
    resetSubagentRegistryForTests,
  } = await import("./subagent-registry.js"));
}

describe("subagent registry persistence resume", () => {
  const envSnapshot = captureEnv(["OPENCLAW_STATE_DIR"]);
  let tempStateDir: string | null = null;

  const resolveSessionStorePath = (stateDir: string, agentId: string) =>
    path.join(stateDir, "agents", agentId, "sessions", "sessions.json");

  const readSessionStore = async (storePath: string) => {
    try {
      const raw = await fs.readFile(storePath, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, Record<string, unknown>>;
      }
    } catch {
      // ignore
    }
    return {} as Record<string, Record<string, unknown>>;
  };

=======
vi.mock("./subagent-registry.store.js", async () => {
  const actual = await vi.importActual<typeof import("./subagent-registry.store.js")>(
    "./subagent-registry.store.js",
  );
  const fsSync = await import("node:fs");
  const pathSync = await import("node:path");
  // The test redirects registry persistence to a temp file while still using
  // the real store shape so restart code exercises serialized run records.
  const resolvePath = () => hoisted.registryPath ?? actual.resolveSubagentRegistryPath();
  return {
    ...actual,
    resolveSubagentRegistryPath: resolvePath,
    loadSubagentRegistryFromDisk: () => {
      try {
        const parsed = JSON.parse(fsSync.readFileSync(resolvePath(), "utf8")) as {
          runs?: Record<string, import("./subagent-registry.types.js").SubagentRunRecord>;
        };
        return new Map(Object.entries(parsed.runs ?? {}));
      } catch {
        return new Map();
      }
    },
    saveSubagentRegistryToDisk: (
      runs: Map<string, import("./subagent-registry.types.js").SubagentRunRecord>,
    ) => {
      const pathname = resolvePath();
      const persistedRuns = hoisted.allowedRunIds
        ? new Map([...runs].filter(([runId]) => hoisted.allowedRunIds?.has(runId)))
        : runs;
      if (hoisted.allowedRunIds && persistedRuns.size === 0 && runs.size > 0) {
        return;
      }
      fsSync.mkdirSync(pathSync.dirname(pathname), { recursive: true });
      fsSync.writeFileSync(
        pathname,
        `${JSON.stringify({ version: 2, runs: Object.fromEntries(persistedRuns) }, null, 2)}\n`,
        "utf8",
      );
    },
  };
});

let mod: typeof import("./subagent-registry.js");
let callGatewayModule: typeof import("../gateway/call.js");
let agentEventsModule: typeof import("../infra/agent-events.js");

describe("subagent registry persistence resume", () => {
  let tempStateDir: string | null = null;

>>>>>>> upstream/main
  const writeChildSessionEntry = async (params: {
    sessionKey: string;
    sessionId?: string;
    updatedAt?: number;
<<<<<<< HEAD
=======
    abortedLastRun?: boolean;
>>>>>>> upstream/main
  }) => {
    if (!tempStateDir) {
      throw new Error("tempStateDir not initialized");
    }
<<<<<<< HEAD
    const storePath = resolveSessionStorePath(tempStateDir, "main");
    const store = await readSessionStore(storePath);
    store[params.sessionKey] = {
      ...store[params.sessionKey],
      sessionId: params.sessionId ?? `sess-${Date.now()}`,
      updatedAt: params.updatedAt ?? Date.now(),
    };
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, `${JSON.stringify(store)}\n`, "utf8");
    return storePath;
  };

  const flushQueuedRegistryWork = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 25));
  };

  beforeEach(async () => {
    await loadSubagentRegistryModules();
    const { callGateway } = await import("../gateway/call.js");
    const { onAgentEvent } = await import("../infra/agent-events.js");
    vi.mocked(callGateway).mockReset();
    vi.mocked(callGateway).mockResolvedValue({
=======
    return await writeSubagentSessionEntry({
      stateDir: tempStateDir,
      agentId: "main",
      sessionKey: params.sessionKey,
      sessionId: params.sessionId,
      updatedAt: params.updatedAt,
      abortedLastRun: params.abortedLastRun,
      defaultSessionId: `sess-${Date.now()}`,
    });
  };

  beforeAll(async () => {
    vi.resetModules();
    mod = await import("./subagent-registry.js");
    callGatewayModule = await import("../gateway/call.js");
    agentEventsModule = await import("../infra/agent-events.js");
  });

  beforeEach(async () => {
    announceSpy.mockClear();
    vi.mocked(callGatewayModule.callGateway).mockReset();
    vi.mocked(callGatewayModule.callGateway).mockResolvedValue({
>>>>>>> upstream/main
      status: "ok",
      startedAt: 111,
      endedAt: 222,
    });
<<<<<<< HEAD
    vi.mocked(onAgentEvent).mockReset();
    vi.mocked(onAgentEvent).mockReturnValue(() => undefined);
=======
    mod.testing.setDepsForTest({
      ...createSubagentRegistryTestDeps({
        callGateway: vi.mocked(callGatewayModule.callGateway),
        captureSubagentCompletionReply: vi.fn(async () => undefined),
      }),
    });
    mod.resetSubagentRegistryForTests({ persist: false });
    vi.mocked(agentEventsModule.onAgentEvent).mockReset();
    vi.mocked(agentEventsModule.onAgentEvent).mockReturnValue(() => undefined);
>>>>>>> upstream/main
  });

  afterEach(async () => {
    announceSpy.mockClear();
<<<<<<< HEAD
    resetSubagentRegistryForTests({ persist: false });
    await drainSessionStoreLockQueuesForTest();
=======
    mod.testing.setDepsForTest();
    mod.resetSubagentRegistryForTests({ persist: false });
    await drainSessionStoreWriterQueuesForTest();
>>>>>>> upstream/main
    clearSessionStoreCacheForTest();
    if (tempStateDir) {
      await fs.rm(tempStateDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
      tempStateDir = null;
    }
<<<<<<< HEAD
    envSnapshot.restore();
  });

  it("persists runs to disk and resumes after restart", async () => {
    tempStateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-subagent-"));
    process.env.OPENCLAW_STATE_DIR = tempStateDir;

    const { callGateway } = await import("../gateway/call.js");
    let releaseInitialWait:
      | ((value: { status: "ok"; startedAt: number; endedAt: number }) => void)
      | undefined;
    vi.mocked(callGateway)
      .mockImplementationOnce(
        async () =>
          await new Promise((resolve) => {
            releaseInitialWait = resolve as typeof releaseInitialWait;
          }),
      )
      .mockResolvedValueOnce({
        status: "ok",
        startedAt: 111,
        endedAt: 222,
      });

    registerSubagentRun({
      runId: "run-1",
      childSessionKey: "agent:main:subagent:test",
      requesterSessionKey: "agent:main:main",
      requesterOrigin: { channel: " whatsapp ", accountId: " acct-main " },
      requesterDisplayKey: "main",
      task: "do the thing",
      cleanup: "keep",
    });
    await writeChildSessionEntry({
      sessionKey: "agent:main:subagent:test",
      sessionId: "sess-test",
    });

    const registryPath = path.join(tempStateDir, "subagents", "runs.json");
    const raw = await fs.readFile(registryPath, "utf8");
    const parsed = JSON.parse(raw) as { runs?: Record<string, unknown> };
    expect(parsed.runs && Object.keys(parsed.runs)).toContain("run-1");
    const run = parsed.runs?.["run-1"] as
      | {
          requesterOrigin?: { channel?: string; accountId?: string };
        }
      | undefined;
    expect(run).toBeDefined();
    if (run) {
      expect("requesterAccountId" in run).toBe(false);
      expect("requesterChannel" in run).toBe(false);
    }
    expect(run?.requesterOrigin?.channel).toBe("whatsapp");
    expect(run?.requesterOrigin?.accountId).toBe("acct-main");

    resetSubagentRegistryForTests({ persist: false });
    initSubagentRegistry();
    releaseInitialWait?.({
      status: "ok",
      startedAt: 111,
      endedAt: 222,
    });

    await flushQueuedRegistryWork();

    expect(announceSpy).not.toHaveBeenCalled();

    const restored = listSubagentRunsForRequester("agent:main:main")[0];
    expect(restored?.childSessionKey).toBe("agent:main:subagent:test");
    expect(restored?.requesterOrigin?.channel).toBe("whatsapp");
    expect(restored?.requesterOrigin?.accountId).toBe("acct-main");
=======
    hoisted.registryPath = undefined;
    hoisted.allowedRunIds = undefined;
  });

  it("persists runs to disk and resumes after restart", async () => {
    // Persisted requesterOrigin is the current contract; legacy flat requester
    // channel/account fields should not reappear during resume.
    tempStateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-subagent-"));
    const stateDir = tempStateDir;
    await withEnvAsync({ OPENCLAW_STATE_DIR: stateDir }, async () => {
      const registryPath = path.join(stateDir, "subagents", "runs.json");
      hoisted.registryPath = registryPath;
      await fs.mkdir(path.dirname(registryPath), { recursive: true });
      await fs.writeFile(
        registryPath,
        `${JSON.stringify(
          {
            version: 2,
            runs: {
              "run-1": {
                runId: "run-1",
                childSessionKey: "agent:main:subagent:test",
                requesterSessionKey: "agent:main:main",
                requesterOrigin: { channel: "whatsapp", accountId: "acct-main" },
                requesterDisplayKey: "main",
                task: "do the thing",
                cleanup: "keep",
                createdAt: Date.now(),
              },
            },
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
      await writeChildSessionEntry({
        sessionKey: "agent:main:subagent:test",
        sessionId: "sess-test",
      });

      const raw = await fs.readFile(registryPath, "utf8");
      const parsed = JSON.parse(raw) as { runs?: Record<string, unknown> };
      expect(parsed.runs && Object.keys(parsed.runs)).toContain("run-1");
      const run = parsed.runs?.["run-1"] as
        | {
            requesterOrigin?: { channel?: string; accountId?: string };
          }
        | undefined;
      if (run === undefined) {
        throw new Error("expected persisted run");
      }
      expect("requesterAccountId" in run).toBe(false);
      expect("requesterChannel" in run).toBe(false);
      expect(run.requesterOrigin?.channel).toBe("whatsapp");
      expect(run?.requesterOrigin?.accountId).toBe("acct-main");

      mod.initSubagentRegistry();

      await vi.waitFor(() => expect(announceSpy).toHaveBeenCalled(), {
        timeout: 1_000,
        interval: 10,
      });

      const announceCalls = announceSpy.mock.calls as unknown as Array<[unknown]>;
      const announce = (announceCalls.at(-1)?.[0] ?? undefined) as
        | {
            childRunId?: string;
            childSessionKey?: string;
            requesterSessionKey?: string;
            requesterOrigin?: { channel?: string; accountId?: string };
            task?: string;
            cleanup?: string;
            outcome?: { status?: string };
          }
        | undefined;
      expect(announce?.childRunId).toBe("run-1");
      expect(announce?.childSessionKey).toBe("agent:main:subagent:test");
      expect(announce?.requesterSessionKey).toBe("agent:main:main");
      expect(announce?.requesterOrigin?.channel).toBe("whatsapp");
      expect(announce?.requesterOrigin?.accountId).toBe("acct-main");
      expect(announce?.task).toBe("do the thing");
      expect(announce?.cleanup).toBe("keep");
      expect(announce?.outcome?.status).toBe("ok");

      const restored = mod.listSubagentRunsForRequester("agent:main:main")[0];
      expect(restored?.childSessionKey).toBe("agent:main:subagent:test");
      expect(restored?.requesterOrigin?.channel).toBe("whatsapp");
      expect(restored?.requesterOrigin?.accountId).toBe("acct-main");
    });
>>>>>>> upstream/main
  });
});
