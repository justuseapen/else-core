<<<<<<< HEAD
=======
// Session search tests cover gateway session rows, transcript usage summaries,
// subagent state, model context limits, and cost/token display metadata.
>>>>>>> upstream/main
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
  addSubagentRunForTests,
  resetSubagentRegistryForTests,
<<<<<<< HEAD
} from "../agents/subagent-registry.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions.js";
import { listSessionsFromStore } from "./session-utils.js";
=======
} from "../agents/subagent-registry.test-helpers.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions.js";
import { registerAgentRunContext, resetAgentRunContextForTest } from "../infra/agent-events.js";
import { buildGatewaySessionInfo, listSessionsFromStore } from "./session-utils.js";

const MAIN_SESSION_KEY = "agent:main:main";
const MAIN_SESSION_ID = "sess-main";
const TRANSCRIPT_TOTAL_TOKENS = 3_200;
const TRANSCRIPT_COST_USD = 0.007725;
const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const ANTHROPIC_CONTEXT_TOKENS = 1_048_576;
const FREE_OPENAI_MODEL = "gpt-5.3-codex-spark";

type TranscriptUsageFixture = {
  provider: string;
  model: string;
  input: number;
  output: number;
  cacheRead: number;
  costTotal: number;
};

const ANTHROPIC_USAGE: TranscriptUsageFixture = {
  provider: "anthropic",
  model: ANTHROPIC_MODEL,
  input: 2_000,
  output: 500,
  cacheRead: 1_200,
  costTotal: TRANSCRIPT_COST_USD,
};

const FREE_OPENAI_USAGE: TranscriptUsageFixture = {
  provider: "openai",
  model: FREE_OPENAI_MODEL,
  input: 5_107,
  output: 1_827,
  cacheRead: 1_536,
  costTotal: 0,
};
>>>>>>> upstream/main

function createModelDefaultsConfig(params: {
  primary: string;
  models?: Record<string, Record<string, never>>;
}): OpenClawConfig {
  return {
    agents: {
      defaults: {
        model: { primary: params.primary },
        models: params.models,
      },
    },
  } as OpenClawConfig;
}

function createLegacyRuntimeListConfig(
  models?: Record<string, Record<string, never>>,
): OpenClawConfig {
  return createModelDefaultsConfig({
<<<<<<< HEAD
    primary: "google-gemini-cli/gemini-3-pro-preview",
=======
    primary: "google-gemini-cli/gemini-3.1-pro-preview",
>>>>>>> upstream/main
    ...(models ? { models } : {}),
  });
}

function createLegacyRuntimeStore(model: string): Record<string, SessionEntry> {
  return {
    "agent:main:main": {
      sessionId: "sess-main",
      updatedAt: Date.now(),
      model,
    } as SessionEntry,
  };
}

<<<<<<< HEAD
describe("listSessionsFromStore search", () => {
  afterEach(() => {
    resetSubagentRegistryForTests({ persist: false });
=======
function createOpenAiPricingConfig(params: {
  id: string;
  label: string;
  cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
}): OpenClawConfig {
  return {
    session: { mainKey: "main" },
    agents: { list: [{ id: "main", default: true }] },
    models: {
      providers: {
        openai: {
          models: [
            {
              id: params.id,
              label: params.label,
              baseUrl: "https://api.openai.com/v1",
              cost: params.cost,
            },
          ],
        },
      },
    },
  } as unknown as OpenClawConfig;
}

type DefaultTranscriptFixtureParams<T> = {
  prefix: string;
  transcriptId?: string;
  run: (fixture: { storePath: string; now: number }) => T;
};

function withTranscriptFixture<T>(
  usage: TranscriptUsageFixture,
  params: DefaultTranscriptFixtureParams<T>,
): T {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), params.prefix));
  const storePath = path.join(tmpDir, "sessions.json");
  const transcriptId = params.transcriptId ?? MAIN_SESSION_ID;
  const now = Date.now();
  fs.writeFileSync(
    path.join(tmpDir, `${transcriptId}.jsonl`),
    [
      JSON.stringify({ type: "session", version: 1, id: transcriptId }),
      JSON.stringify({
        message: {
          role: "assistant",
          provider: usage.provider,
          model: usage.model,
          usage: {
            input: usage.input,
            output: usage.output,
            cacheRead: usage.cacheRead,
            cost: { total: usage.costTotal },
          },
        },
      }),
    ].join("\n"),
    "utf-8",
  );

  try {
    return params.run({ storePath, now });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const withAnthropicTranscriptFixture = <T>(params: DefaultTranscriptFixtureParams<T>) =>
  withTranscriptFixture(ANTHROPIC_USAGE, params);

const withFreeOpenAiTranscriptFixture = <T>(params: DefaultTranscriptFixtureParams<T>) =>
  withTranscriptFixture(FREE_OPENAI_USAGE, params);

function createAnthropicContext1mConfig(): OpenClawConfig {
  return {
    session: { mainKey: "main" },
    agents: {
      list: [{ id: "main", default: true }],
      defaults: {
        models: {
          [`anthropic/${ANTHROPIC_MODEL}`]: { params: { context1m: true } },
        },
      },
    },
  } as unknown as OpenClawConfig;
}

function listSingleSession(params: {
  cfg: OpenClawConfig;
  storePath: string;
  key: string;
  entry: SessionEntry;
}) {
  return listSessionsFromStore({
    cfg: params.cfg,
    storePath: params.storePath,
    store: {
      [params.key]: params.entry,
    },
    opts: {},
  });
}

function listMainSession(params: { cfg: OpenClawConfig; storePath: string; entry: SessionEntry }) {
  return listSingleSession({
    cfg: params.cfg,
    storePath: params.storePath,
    key: MAIN_SESSION_KEY,
    entry: params.entry,
  });
}

function registerRunningSubagent(params: {
  runId: string;
  childSessionKey: string;
  model: string;
  now: number;
}) {
  addSubagentRunForTests({
    runId: params.runId,
    childSessionKey: params.childSessionKey,
    controllerSessionKey: MAIN_SESSION_KEY,
    requesterSessionKey: MAIN_SESSION_KEY,
    requesterDisplayKey: "main",
    task: "child task",
    cleanup: "keep",
    createdAt: params.now - 5_000,
    startedAt: params.now - 4_000,
    model: params.model,
  });
  registerAgentRunContext(params.runId, {
    sessionKey: params.childSessionKey,
  });
}

type ListedSession = ReturnType<typeof listSessionsFromStore>["sessions"][number];

function expectSessionModel(
  session: ListedSession | undefined,
  expected: { key: string; provider: string; model: string },
) {
  expect(session?.key).toBe(expected.key);
  expect(session?.modelProvider).toBe(expected.provider);
  expect(session?.model).toBe(expected.model);
}

function expectTranscriptBackfill(
  session: ListedSession | undefined,
  expected?: { contextTokens?: number; estimatedCostUsd?: number },
) {
  expect(session?.totalTokens).toBe(TRANSCRIPT_TOTAL_TOKENS);
  expect(session?.totalTokensFresh).toBe(true);
  if (expected?.contextTokens !== undefined) {
    expect(session?.contextTokens).toBe(expected.contextTokens);
  }
  if (expected?.estimatedCostUsd !== undefined) {
    expect(session?.estimatedCostUsd).toBeCloseTo(expected.estimatedCostUsd, 8);
  }
}

function sessionEntry(overrides: Partial<SessionEntry> = {}, updatedAt = Date.now()): SessionEntry {
  return {
    sessionId: MAIN_SESSION_ID,
    updatedAt,
    ...overrides,
  } as SessionEntry;
}

function mainSessionStore(entry: SessionEntry): Record<string, SessionEntry> {
  return { [MAIN_SESSION_KEY]: entry };
}

function transcriptFallbackEntry(now: number, overrides: Partial<SessionEntry> = {}): SessionEntry {
  return sessionEntry(
    {
      totalTokens: 0,
      totalTokensFresh: false,
      ...overrides,
    },
    now,
  );
}

function expectAnthropicBackfill(session: ListedSession | undefined) {
  expectTranscriptBackfill(session, {
    contextTokens: ANTHROPIC_CONTEXT_TOKENS,
    estimatedCostUsd: TRANSCRIPT_COST_USD,
  });
}

function expectOpenAiGpt54Backfill(session: ListedSession | undefined) {
  expectSessionModel(session, {
    key: MAIN_SESSION_KEY,
    provider: "openai",
    model: "gpt-5.4",
  });
  expectTranscriptBackfill(session);
}

function freeOpenAiUsageEntry(): SessionEntry {
  return sessionEntry({
    modelProvider: "openai",
    model: FREE_OPENAI_MODEL,
    inputTokens: FREE_OPENAI_USAGE.input,
    outputTokens: FREE_OPENAI_USAGE.output,
    cacheRead: FREE_OPENAI_USAGE.cacheRead,
    cacheWrite: 0,
  });
}

function anthropicUsageEntry(now: number, overrides: Partial<SessionEntry> = {}): SessionEntry {
  return {
    sessionId: MAIN_SESSION_ID,
    updatedAt: now,
    totalTokens: 0,
    totalTokensFresh: false,
    inputTokens: ANTHROPIC_USAGE.input,
    outputTokens: ANTHROPIC_USAGE.output,
    cacheRead: ANTHROPIC_USAGE.cacheRead,
    ...overrides,
  } as SessionEntry;
}

function zeroUsageTranscriptEntry(
  now: number,
  overrides: Partial<SessionEntry> = {},
): SessionEntry {
  return transcriptFallbackEntry(now, {
    inputTokens: 0,
    outputTokens: 0,
    cacheRead: 0,
    cacheWrite: 0,
    ...overrides,
  });
}

function childTranscriptEntry(sessionId: string, now: number): SessionEntry {
  return transcriptFallbackEntry(now, {
    sessionId,
    spawnedBy: MAIN_SESSION_KEY,
  });
}

describe("listSessionsFromStore search", () => {
  afterEach(() => {
    resetSubagentRegistryForTests();
    resetAgentRunContextForTest();
>>>>>>> upstream/main
  });

  const baseCfg = {
    session: { mainKey: "main" },
    agents: { list: [{ id: "main", default: true }] },
  } as OpenClawConfig;

  const makeStore = (): Record<string, SessionEntry> => ({
    "agent:main:work-project": {
      sessionId: "sess-work-1",
      updatedAt: Date.now(),
      displayName: "Work Project Alpha",
      label: "work",
    } as SessionEntry,
    "agent:main:personal-chat": {
      sessionId: "sess-personal-1",
      updatedAt: Date.now() - 1000,
      displayName: "Personal Chat",
      subject: "Family Reunion Planning",
    } as SessionEntry,
    "agent:main:discord:group:dev-team": {
      sessionId: "sess-discord-1",
      updatedAt: Date.now() - 2000,
      label: "discord",
      subject: "Dev Team Discussion",
    } as SessionEntry,
  });

<<<<<<< HEAD
  test("returns all sessions when search is empty or missing", () => {
    const cases = [{ opts: { search: "" } }, { opts: {} }] as const;
    for (const testCase of cases) {
      const result = listSessionsFromStore({
        cfg: baseCfg,
        storePath: "/tmp/sessions.json",
        store: makeStore(),
        opts: testCase.opts,
      });
=======
  function listSearchSessions(params: {
    opts: Parameters<typeof listSessionsFromStore>[0]["opts"];
    cfg?: OpenClawConfig;
    store?: Record<string, SessionEntry>;
  }) {
    return listSessionsFromStore({
      cfg: params.cfg ?? baseCfg,
      storePath: "/tmp/sessions.json",
      store: params.store ?? makeStore(),
      opts: params.opts,
    });
  }

  function listConfiguredMainSession(cfg: OpenClawConfig, entry: SessionEntry) {
    return listSearchSessions({
      cfg,
      store: mainSessionStore(entry),
      opts: {},
    });
  }

  test("returns all sessions when search is empty or missing", () => {
    const cases = [{ opts: { search: "" } }, { opts: {} }] as const;
    for (const testCase of cases) {
      const result = listSearchSessions({ opts: testCase.opts });
>>>>>>> upstream/main
      expect(result.sessions).toHaveLength(3);
    }
  });

  test("filters sessions across display metadata and key fields", () => {
    const cases = [
      { search: "WORK PROJECT", expectedKey: "agent:main:work-project" },
      { search: "reunion", expectedKey: "agent:main:personal-chat" },
      { search: "discord", expectedKey: "agent:main:discord:group:dev-team" },
      { search: "sess-personal", expectedKey: "agent:main:personal-chat" },
      { search: "dev-team", expectedKey: "agent:main:discord:group:dev-team" },
      { search: "alpha", expectedKey: "agent:main:work-project" },
      { search: "  personal  ", expectedKey: "agent:main:personal-chat" },
      { search: "nonexistent-term", expectedKey: undefined },
    ] as const;

    for (const testCase of cases) {
<<<<<<< HEAD
      const result = listSessionsFromStore({
        cfg: baseCfg,
        storePath: "/tmp/sessions.json",
        store: makeStore(),
        opts: { search: testCase.search },
      });
=======
      const result = listSearchSessions({ opts: { search: testCase.search } });
>>>>>>> upstream/main
      if (!testCase.expectedKey) {
        expect(result.sessions).toHaveLength(0);
        continue;
      }
      expect(result.sessions).toHaveLength(1);
      expect(result.sessions[0].key).toBe(testCase.expectedKey);
    }
  });

<<<<<<< HEAD
=======
  test("filters sessions by the displayed provider and model identity", () => {
    const now = Date.now();
    const cfg = createModelDefaultsConfig({
      primary: "anthropic/claude-sonnet-4-6",
    });
    const store: Record<string, SessionEntry> = {
      "agent:main:inherited-default": {
        sessionId: "sess-inherited-default",
        updatedAt: now,
        label: "Inherited default",
      } as SessionEntry,
      "agent:main:override": {
        sessionId: "sess-override",
        updatedAt: now - 1_000,
        label: "Override",
        providerOverride: "openai",
        modelOverride: "gpt-5.5",
      } as SessionEntry,
      "agent:main:runtime": {
        sessionId: "sess-runtime",
        updatedAt: now - 2_000,
        label: "Runtime",
        modelProvider: "google",
        model: "gemini-3.1-pro-preview",
      } as SessionEntry,
    };
    const cases = [
      { search: "anthropic", expectedKey: "agent:main:inherited-default" },
      { search: "claude-sonnet", expectedKey: "agent:main:inherited-default" },
      { search: "anthropic/claude-sonnet", expectedKey: "agent:main:inherited-default" },
      { search: "openai/gpt-5.5", expectedKey: "agent:main:override" },
      { search: "gemini-3.1", expectedKey: "agent:main:runtime" },
      { search: "google/gemini", expectedKey: "agent:main:runtime" },
    ] as const;

    for (const testCase of cases) {
      const result = listSearchSessions({
        cfg,
        store,
        opts: { search: testCase.search },
      });

      expect(result.sessions.map((session) => session.key)).toEqual([testCase.expectedKey]);
      expect(result.totalCount).toBe(1);
    }
  });

  test("keeps derived model search for colon model ids", () => {
    const now = Date.now();
    const cfg = createModelDefaultsConfig({
      primary: "ollama/qwen3:0.6b",
    });
    const result = listSearchSessions({
      cfg,
      store: {
        "agent:main:inherited-local-model": {
          sessionId: "sess-inherited-local-model",
          updatedAt: now,
          label: "Inherited local model",
        } as SessionEntry,
      },
      opts: { search: "qwen3:0.6b" },
    });

    expect(result.sessions.map((session) => session.key)).toEqual([
      "agent:main:inherited-local-model",
    ]);
    expect(result.totalCount).toBe(1);
  });

>>>>>>> upstream/main
  test("hides cron run alias session keys from sessions list", () => {
    const now = Date.now();
    const store: Record<string, SessionEntry> = {
      "agent:main:cron:job-1": {
        sessionId: "run-abc",
        updatedAt: now,
        label: "Cron: job-1",
      } as SessionEntry,
      "agent:main:cron:job-1:run:run-abc": {
        sessionId: "run-abc",
        updatedAt: now,
        label: "Cron: job-1",
      } as SessionEntry,
    };

<<<<<<< HEAD
    const result = listSessionsFromStore({
      cfg: baseCfg,
      storePath: "/tmp/sessions.json",
=======
    const result = listSearchSessions({
>>>>>>> upstream/main
      store,
      opts: {},
    });

    expect(result.sessions.map((session) => session.key)).toEqual(["agent:main:cron:job-1"]);
  });

  test.each([
    {
      name: "does not guess provider for legacy runtime model without modelProvider",
      cfg: createLegacyRuntimeListConfig(),
      runtimeModel: "claude-sonnet-4-6",
      expectedProvider: undefined,
    },
    {
      name: "infers provider for legacy runtime model when allowlist match is unique",
      cfg: createLegacyRuntimeListConfig({ "anthropic/claude-sonnet-4-6": {} }),
      runtimeModel: "claude-sonnet-4-6",
      expectedProvider: "anthropic",
    },
    {
      name: "infers wrapper provider for slash-prefixed legacy runtime model when allowlist match is unique",
      cfg: createLegacyRuntimeListConfig({
        "vercel-ai-gateway/anthropic/claude-sonnet-4-6": {},
      }),
      runtimeModel: "anthropic/claude-sonnet-4-6",
      expectedProvider: "vercel-ai-gateway",
    },
  ])("$name", ({ cfg, runtimeModel, expectedProvider }) => {
<<<<<<< HEAD
    const result = listSessionsFromStore({
      cfg,
      storePath: "/tmp/sessions.json",
=======
    const result = listSearchSessions({
      cfg,
>>>>>>> upstream/main
      store: createLegacyRuntimeStore(runtimeModel),
      opts: {},
    });

    expect(result.sessions[0]?.modelProvider).toBe(expectedProvider);
    expect(result.sessions[0]?.model).toBe(runtimeModel);
  });

  test("exposes unknown totals when freshness is stale or missing", () => {
    const now = Date.now();
    const store: Record<string, SessionEntry> = {
      "agent:main:fresh": {
        sessionId: "sess-fresh",
        updatedAt: now,
        totalTokens: 1200,
        totalTokensFresh: true,
      } as SessionEntry,
      "agent:main:stale": {
        sessionId: "sess-stale",
        updatedAt: now - 1000,
        totalTokens: 2200,
        totalTokensFresh: false,
      } as SessionEntry,
      "agent:main:missing": {
        sessionId: "sess-missing",
        updatedAt: now - 2000,
        inputTokens: 100,
        outputTokens: 200,
      } as SessionEntry,
    };

<<<<<<< HEAD
    const result = listSessionsFromStore({
      cfg: baseCfg,
      storePath: "/tmp/sessions.json",
=======
    const result = listSearchSessions({
>>>>>>> upstream/main
      store,
      opts: {},
    });

    const fresh = result.sessions.find((row) => row.key === "agent:main:fresh");
    const stale = result.sessions.find((row) => row.key === "agent:main:stale");
    const missing = result.sessions.find((row) => row.key === "agent:main:missing");
    expect(fresh?.totalTokens).toBe(1200);
    expect(fresh?.totalTokensFresh).toBe(true);
    expect(stale?.totalTokens).toBeUndefined();
    expect(stale?.totalTokensFresh).toBe(false);
    expect(missing?.totalTokens).toBeUndefined();
    expect(missing?.totalTokensFresh).toBe(false);
  });

  test("includes estimated session cost when model pricing is configured", () => {
<<<<<<< HEAD
    const cfg = {
      session: { mainKey: "main" },
      agents: { list: [{ id: "main", default: true }] },
      models: {
        providers: {
          openai: {
            models: [
              {
                id: "gpt-5.4",
                label: "GPT 5.4",
                baseUrl: "https://api.openai.com/v1",
                cost: { input: 1.25, output: 10, cacheRead: 0.125, cacheWrite: 0.5 },
              },
            ],
          },
        },
      },
    } as unknown as OpenClawConfig;
    const result = listSessionsFromStore({
      cfg,
      storePath: "/tmp/sessions.json",
      store: {
        "agent:main:main": {
          sessionId: "sess-main",
          updatedAt: Date.now(),
          modelProvider: "openai",
          model: "gpt-5.4",
          inputTokens: 2_000,
          outputTokens: 500,
          cacheRead: 1_000,
          cacheWrite: 200,
        } as SessionEntry,
      },
      opts: {},
    });

    expect(result.sessions[0]?.estimatedCostUsd).toBeCloseTo(0.007725, 8);
  });

  test("prefers persisted estimated session cost from the store", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-session-utils-store-cost-"));
    const storePath = path.join(tmpDir, "sessions.json");
    fs.writeFileSync(
      path.join(tmpDir, "sess-main.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-main" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    try {
      const result = listSessionsFromStore({
        cfg: baseCfg,
        storePath,
        store: {
          "agent:main:main": {
            sessionId: "sess-main",
            updatedAt: Date.now(),
            modelProvider: "anthropic",
            model: "claude-sonnet-4-6",
            estimatedCostUsd: 0.1234,
            totalTokens: 0,
            totalTokensFresh: false,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]?.estimatedCostUsd).toBe(0.1234);
      expect(result.sessions[0]?.totalTokens).toBe(3_200);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("keeps zero estimated session cost when configured model pricing resolves to free", () => {
    const cfg = {
      session: { mainKey: "main" },
      agents: { list: [{ id: "main", default: true }] },
      models: {
        providers: {
          "openai-codex": {
            models: [
              {
                id: "gpt-5.3-codex-spark",
                label: "GPT 5.3 Codex Spark",
                baseUrl: "https://api.openai.com/v1",
                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
              },
            ],
          },
        },
      },
    } as unknown as OpenClawConfig;
    const result = listSessionsFromStore({
      cfg,
      storePath: "/tmp/sessions.json",
      store: {
        "agent:main:main": {
          sessionId: "sess-main",
          updatedAt: Date.now(),
          modelProvider: "openai-codex",
          model: "gpt-5.3-codex-spark",
          inputTokens: 5_107,
          outputTokens: 1_827,
          cacheRead: 1_536,
          cacheWrite: 0,
        } as SessionEntry,
      },
      opts: {},
    });
=======
    const cfg = createOpenAiPricingConfig({
      id: "gpt-5.4",
      label: "GPT 5.4",
      cost: { input: 1.25, output: 10, cacheRead: 0.125, cacheWrite: 0.5 },
    });
    const result = listConfiguredMainSession(
      cfg,
      sessionEntry({
        modelProvider: "openai",
        model: "gpt-5.4",
        inputTokens: 2_000,
        outputTokens: 500,
        cacheRead: 1_000,
        cacheWrite: 200,
      }),
    );

    expect(result.sessions[0]?.estimatedCostUsd).toBeCloseTo(TRANSCRIPT_COST_USD, 8);
  });

  test("prefers persisted estimated session cost from the store", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-store-cost-",
      run: ({ storePath, now }) => {
        const result = listMainSession({
          cfg: baseCfg,
          storePath,
          entry: transcriptFallbackEntry(now, {
            modelProvider: "anthropic",
            model: ANTHROPIC_MODEL,
            estimatedCostUsd: 0.1234,
          }),
        });

        expect(result.sessions[0]?.estimatedCostUsd).toBe(0.1234);
        expect(result.sessions[0]?.totalTokens).toBe(TRANSCRIPT_TOTAL_TOKENS);
      },
    });
  });

  test("keeps zero estimated session cost when configured model pricing resolves to free", () => {
    const cfg = createOpenAiPricingConfig({
      id: FREE_OPENAI_MODEL,
      label: "GPT 5.3 Codex Spark",
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    });
    const result = listConfiguredMainSession(cfg, freeOpenAiUsageEntry());
>>>>>>> upstream/main

    expect(result.sessions[0]?.estimatedCostUsd).toBe(0);
  });

  test("falls back to transcript usage for totalTokens and zero estimatedCostUsd", () => {
<<<<<<< HEAD
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-session-utils-zero-cost-"));
    const storePath = path.join(tmpDir, "sessions.json");
    fs.writeFileSync(
      path.join(tmpDir, "sess-main.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-main" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "openai-codex",
            model: "gpt-5.3-codex-spark",
            usage: {
              input: 5_107,
              output: 1_827,
              cacheRead: 1_536,
              cost: { total: 0 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    try {
      const result = listSessionsFromStore({
        cfg: baseCfg,
        storePath,
        store: {
          "agent:main:main": {
            sessionId: "sess-main",
            updatedAt: Date.now(),
            modelProvider: "openai-codex",
            model: "gpt-5.3-codex-spark",
            totalTokens: 0,
            totalTokensFresh: false,
            inputTokens: 0,
            outputTokens: 0,
            cacheRead: 0,
            cacheWrite: 0,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]?.totalTokens).toBe(6_643);
      expect(result.sessions[0]?.totalTokensFresh).toBe(true);
      expect(result.sessions[0]?.estimatedCostUsd).toBe(0);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("falls back to transcript usage for totalTokens and estimatedCostUsd, and derives contextTokens from the resolved model", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-session-utils-"));
    const storePath = path.join(tmpDir, "sessions.json");
    const cfg = {
      session: { mainKey: "main" },
      agents: {
        list: [{ id: "main", default: true }],
        defaults: {
          models: {
            "anthropic/claude-sonnet-4-6": { params: { context1m: true } },
          },
        },
      },
    } as unknown as OpenClawConfig;
    fs.writeFileSync(
      path.join(tmpDir, "sess-main.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-main" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    try {
      const result = listSessionsFromStore({
        cfg,
        storePath,
        store: {
          "agent:main:main": {
            sessionId: "sess-main",
            updatedAt: Date.now(),
            modelProvider: "anthropic",
            model: "claude-sonnet-4-6",
            totalTokens: 0,
            totalTokensFresh: false,
            inputTokens: 0,
            outputTokens: 0,
            cacheRead: 0,
            cacheWrite: 0,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]?.totalTokens).toBe(3_200);
      expect(result.sessions[0]?.totalTokensFresh).toBe(true);
      expect(result.sessions[0]?.contextTokens).toBe(1_048_576);
      expect(result.sessions[0]?.estimatedCostUsd).toBeCloseTo(0.007725, 8);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("uses subagent run model immediately for child sessions while transcript usage fills live totals", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-session-utils-subagent-"));
    const storePath = path.join(tmpDir, "sessions.json");
    const now = Date.now();
    const cfg = {
      session: { mainKey: "main" },
      agents: {
        list: [{ id: "main", default: true }],
        defaults: {
          models: {
            "anthropic/claude-sonnet-4-6": { params: { context1m: true } },
          },
        },
      },
    } as unknown as OpenClawConfig;
    fs.writeFileSync(
      path.join(tmpDir, "sess-child.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-child" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    addSubagentRunForTests({
      runId: "run-child-live",
      childSessionKey: "agent:main:subagent:child-live",
      controllerSessionKey: "agent:main:main",
      requesterSessionKey: "agent:main:main",
      requesterDisplayKey: "main",
      task: "child task",
      cleanup: "keep",
      createdAt: now - 5_000,
      startedAt: now - 4_000,
      model: "anthropic/claude-sonnet-4-6",
    });

    try {
      const result = listSessionsFromStore({
        cfg,
        storePath,
        store: {
          "agent:main:subagent:child-live": {
            sessionId: "sess-child",
            updatedAt: now,
            spawnedBy: "agent:main:main",
            totalTokens: 0,
            totalTokensFresh: false,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]).toMatchObject({
        key: "agent:main:subagent:child-live",
        status: "running",
        modelProvider: "anthropic",
        model: "claude-sonnet-4-6",
        totalTokens: 3_200,
        totalTokensFresh: true,
        contextTokens: 1_048_576,
      });
      expect(result.sessions[0]?.estimatedCostUsd).toBeCloseTo(0.007725, 8);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("keeps a running subagent model when transcript fallback still reflects an older run", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "openclaw-session-utils-subagent-stale-model-"),
    );
    const storePath = path.join(tmpDir, "sessions.json");
    const now = Date.now();
    const cfg = {
      session: { mainKey: "main" },
      agents: {
        list: [{ id: "main", default: true }],
        defaults: {
          models: {
            "anthropic/claude-sonnet-4-6": { params: { context1m: true } },
          },
        },
      },
    } as unknown as OpenClawConfig;
    fs.writeFileSync(
      path.join(tmpDir, "sess-child-stale.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-child-stale" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    addSubagentRunForTests({
      runId: "run-child-live-new-model",
      childSessionKey: "agent:main:subagent:child-live-stale-transcript",
      controllerSessionKey: "agent:main:main",
      requesterSessionKey: "agent:main:main",
      requesterDisplayKey: "main",
      task: "child task",
      cleanup: "keep",
      createdAt: now - 5_000,
      startedAt: now - 4_000,
      model: "openai/gpt-5.4",
    });

    try {
      const result = listSessionsFromStore({
        cfg,
        storePath,
        store: {
          "agent:main:subagent:child-live-stale-transcript": {
            sessionId: "sess-child-stale",
            updatedAt: now,
            spawnedBy: "agent:main:main",
            totalTokens: 0,
            totalTokensFresh: false,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]).toMatchObject({
        key: "agent:main:subagent:child-live-stale-transcript",
        status: "running",
        modelProvider: "openai",
        model: "gpt-5.4",
        totalTokens: 3_200,
        totalTokensFresh: true,
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("keeps the selected override model when runtime identity was intentionally cleared", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "openclaw-session-utils-cleared-runtime-model-"),
    );
    const storePath = path.join(tmpDir, "sessions.json");
    const now = Date.now();
    const cfg = {
      session: { mainKey: "main" },
      agents: {
        list: [{ id: "main", default: true }],
        defaults: {
          models: {
            "anthropic/claude-sonnet-4-6": { params: { context1m: true } },
          },
        },
      },
    } as unknown as OpenClawConfig;
    fs.writeFileSync(
      path.join(tmpDir, "sess-override.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-override" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    try {
      const result = listSessionsFromStore({
        cfg,
        storePath,
        store: {
          "agent:main:main": {
            sessionId: "sess-override",
            updatedAt: now,
            providerOverride: "openai",
            modelOverride: "gpt-5.4",
            totalTokens: 0,
            totalTokensFresh: false,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]).toMatchObject({
        key: "agent:main:main",
        modelProvider: "openai",
        model: "gpt-5.4",
        totalTokens: 3_200,
        totalTokensFresh: true,
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("does not replace the current runtime model when transcript fallback is only for missing pricing", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-session-utils-pricing-"));
    const storePath = path.join(tmpDir, "sessions.json");
    const now = Date.now();
    const cfg = {
      session: { mainKey: "main" },
      agents: {
        list: [{ id: "main", default: true }],
      },
    } as unknown as OpenClawConfig;
    fs.writeFileSync(
      path.join(tmpDir, "sess-pricing.jsonl"),
      [
        JSON.stringify({ type: "session", version: 1, id: "sess-pricing" }),
        JSON.stringify({
          message: {
            role: "assistant",
            provider: "anthropic",
            model: "claude-sonnet-4-6",
            usage: {
              input: 2_000,
              output: 500,
              cacheRead: 1_200,
              cost: { total: 0.007725 },
            },
          },
        }),
      ].join("\n"),
      "utf-8",
    );

    try {
      const result = listSessionsFromStore({
        cfg,
        storePath,
        store: {
          "agent:main:main": {
            sessionId: "sess-pricing",
            updatedAt: now,
            modelProvider: "openai",
            model: "gpt-5.4",
            contextTokens: 200_000,
            totalTokens: 3_200,
            totalTokensFresh: true,
            inputTokens: 2_000,
            outputTokens: 500,
            cacheRead: 1_200,
          } as SessionEntry,
        },
        opts: {},
      });

      expect(result.sessions[0]).toMatchObject({
        key: "agent:main:main",
        modelProvider: "openai",
        model: "gpt-5.4",
        totalTokens: 3_200,
        totalTokensFresh: true,
        contextTokens: 200_000,
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
=======
    withFreeOpenAiTranscriptFixture({
      prefix: "openclaw-session-utils-zero-cost-",
      run: ({ storePath, now }) => {
        const result = listMainSession({
          cfg: baseCfg,
          storePath,
          entry: zeroUsageTranscriptEntry(now, {
            modelProvider: "openai",
            model: FREE_OPENAI_MODEL,
          }),
        });

        expect(result.sessions[0]?.totalTokens).toBe(6_643);
        expect(result.sessions[0]?.totalTokensFresh).toBe(true);
        expect(result.sessions[0]?.estimatedCostUsd).toBe(0);
      },
    });
  });

  test("falls back to transcript usage for totalTokens and estimatedCostUsd, and derives contextTokens from the resolved model", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-",
      run: ({ storePath, now }) => {
        const result = listMainSession({
          cfg: createAnthropicContext1mConfig(),
          storePath,
          entry: zeroUsageTranscriptEntry(now, {
            modelProvider: "anthropic",
            model: ANTHROPIC_MODEL,
          }),
        });

        expectAnthropicBackfill(result.sessions[0]);
      },
    });
  });

  test("chat history session metadata keeps model-derived contextTokens without transcript usage", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-info-context-",
      run: ({ storePath, now }) => {
        const row = buildGatewaySessionInfo({
          cfg: {
            models: {
              providers: {
                "local-test": {
                  models: [{ id: "test-model", contextTokens: 123_456 }],
                },
              },
            },
          } as unknown as OpenClawConfig,
          storePath,
          key: MAIN_SESSION_KEY,
          store: {
            [MAIN_SESSION_KEY]: {
              sessionId: MAIN_SESSION_ID,
              updatedAt: now,
              modelProvider: "local-test",
              model: "test-model",
            } as SessionEntry,
          },
        });

        expect(row.totalTokens).toBeUndefined();
        expect(row.totalTokensFresh).toBe(false);
        expect(row.estimatedCostUsd).toBeUndefined();
        expect(row.contextTokens).toBe(123_456);
      },
    });
  });

  test("uses subagent run model immediately for child sessions while transcript usage fills live totals", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-subagent-",
      transcriptId: "sess-child",
      run: ({ storePath, now }) => {
        registerRunningSubagent({
          runId: "run-child-live",
          childSessionKey: "agent:main:subagent:child-live",
          model: `anthropic/${ANTHROPIC_MODEL}`,
          now,
        });

        const result = listSingleSession({
          cfg: createAnthropicContext1mConfig(),
          storePath,
          key: "agent:main:subagent:child-live",
          entry: childTranscriptEntry("sess-child", now),
        });

        expectSessionModel(result.sessions[0], {
          key: "agent:main:subagent:child-live",
          provider: "anthropic",
          model: ANTHROPIC_MODEL,
        });
        expect(result.sessions[0]?.status).toBe("running");
        expectAnthropicBackfill(result.sessions[0]);
      },
    });
  });

  test("keeps a running subagent model when transcript fallback still reflects an older run", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-subagent-stale-model-",
      transcriptId: "sess-child-stale",
      run: ({ storePath, now }) => {
        registerRunningSubagent({
          runId: "run-child-live-new-model",
          childSessionKey: "agent:main:subagent:child-live-stale-transcript",
          model: "openai/gpt-5.4",
          now,
        });

        const result = listSingleSession({
          cfg: createAnthropicContext1mConfig(),
          storePath,
          key: "agent:main:subagent:child-live-stale-transcript",
          entry: childTranscriptEntry("sess-child-stale", now),
        });

        expectSessionModel(result.sessions[0], {
          key: "agent:main:subagent:child-live-stale-transcript",
          provider: "openai",
          model: "gpt-5.4",
        });
        expect(result.sessions[0]?.status).toBe("running");
        expectTranscriptBackfill(result.sessions[0]);
      },
    });
  });

  test("keeps the selected override model when runtime identity was intentionally cleared", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-cleared-runtime-model-",
      transcriptId: "sess-override",
      run: ({ storePath, now }) => {
        const result = listMainSession({
          cfg: createAnthropicContext1mConfig(),
          storePath,
          entry: transcriptFallbackEntry(now, {
            sessionId: "sess-override",
            providerOverride: "openai",
            modelOverride: "gpt-5.4",
          }),
        });

        expectOpenAiGpt54Backfill(result.sessions[0]);
      },
    });
  });

  test("does not replace the current runtime model when transcript fallback is only for missing pricing", () => {
    withAnthropicTranscriptFixture({
      prefix: "openclaw-session-utils-pricing-",
      transcriptId: "sess-pricing",
      run: ({ storePath, now }) => {
        const result = listMainSession({
          cfg: {
            session: { mainKey: "main" },
            agents: {
              list: [{ id: "main", default: true }],
            },
          } as unknown as OpenClawConfig,
          storePath,
          entry: anthropicUsageEntry(now, {
            sessionId: "sess-pricing",
            modelProvider: "openai",
            model: "gpt-5.4",
            contextTokens: 200_000,
            totalTokens: TRANSCRIPT_TOTAL_TOKENS,
            totalTokensFresh: true,
          }),
        });

        expectOpenAiGpt54Backfill(result.sessions[0]);
        expect(result.sessions[0]?.contextTokens).toBe(200_000);
      },
    });
>>>>>>> upstream/main
  });
});
