// Agent command tests cover local agent runs, session routing, and command runtime behavior.
import fs from "node:fs";
import path from "node:path";
import { withTempHome as withTempHomeBase } from "openclaw/plugin-sdk/test-env";
import { beforeEach, describe, expect, it, type MockInstance, vi } from "vitest";
<<<<<<< HEAD
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";
import "../cron/isolated-agent.mocks.js";
import { __testing as acpManagerTesting } from "../acp/control-plane/manager.js";
import { resolveAgentDir, resolveSessionAgentId } from "../agents/agent-scope.js";
import * as authProfilesModule from "../agents/auth-profiles.js";
import { resolveSession } from "../agents/command/session.js";
import { loadModelCatalog } from "../agents/model-catalog.js";
=======
import "./agent-command.test-mocks.js";
import { testing as acpManagerTesting } from "../acp/control-plane/manager.js";
import * as authProfileStoreModule from "../agents/auth-profiles/store.js";
import * as attemptExecutionRuntime from "../agents/command/attempt-execution.runtime.js";
import { runEmbeddedAgent } from "../agents/embedded-agent.js";
import { loadManifestModelCatalog, loadModelCatalog } from "../agents/model-catalog.js";
>>>>>>> upstream/main
import * as modelSelectionModule from "../agents/model-selection.js";
import { BASE_THINKING_LEVELS } from "../auto-reply/thinking.shared.js";
import * as runtimeSnapshotModule from "../config/runtime-snapshot.js";
import { loadSessionStore } from "../config/sessions/store-load.js";
import { clearSessionStoreCacheForTest } from "../config/sessions/store.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  emitAgentEvent,
  onAgentEvent,
  resetAgentEventsForTest,
  resetAgentRunContextForTest,
} from "../infra/agent-events.js";
import type { PluginProviderRegistration } from "../plugins/registry.js";
import { resetPluginRuntimeStateForTest, setActivePluginRegistry } from "../plugins/runtime.js";
import type { RuntimeEnv } from "../runtime.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";
import { agentCommand, agentCommandFromIngress, testing as agentCommandTesting } from "./agent.js";
import { createThrowingTestRuntime } from "./test-runtime-config-helpers.js";

const configIoMocks = vi.hoisted(() => ({
  loadConfig: vi.fn(),
  readConfigFileSnapshotForWrite: vi.fn(),
}));
const pluginRegistryMocks = vi.hoisted(() => ({
  ensurePluginRegistryLoaded: vi.fn(),
}));

vi.mock("../config/io.js", () => ({
  getRuntimeConfig: configIoMocks.loadConfig,
  loadConfig: configIoMocks.loadConfig,
  readConfigFileSnapshotForWrite: configIoMocks.readConfigFileSnapshotForWrite,
}));

vi.mock("../plugins/runtime/runtime-registry-loader.js", () => ({
  ensurePluginRegistryLoaded: pluginRegistryMocks.ensurePluginRegistryLoaded,
}));

vi.mock("../agents/auth-profiles/store.js", () => {
  const createEmptyStore = () => ({ version: 1, profiles: {} });
  return {
    clearRuntimeAuthProfileStoreSnapshots: vi.fn(),
    ensureAuthProfileStore: vi.fn(createEmptyStore),
    ensureAuthProfileStoreForLocalUpdate: vi.fn(createEmptyStore),
    hasAnyAuthProfileStoreSource: vi.fn(() => false),
    loadAuthProfileStore: vi.fn(createEmptyStore),
    loadAuthProfileStoreForRuntime: vi.fn(createEmptyStore),
    loadAuthProfileStoreForSecretsRuntime: vi.fn(createEmptyStore),
    replaceRuntimeAuthProfileStoreSnapshots: vi.fn(),
    saveAuthProfileStore: vi.fn(),
    updateAuthProfileStoreWithLock: vi.fn(async () => createEmptyStore()),
  };
});

<<<<<<< HEAD
vi.mock("../agents/auth-profiles.js", async () => {
  const actual = await vi.importActual<typeof import("../agents/auth-profiles.js")>(
    "../agents/auth-profiles.js",
  );
  return {
    ...actual,
    ensureAuthProfileStore: vi.fn(() => ({ version: 1, profiles: {} })),
  };
});

vi.mock("../agents/workspace.js", () => {
  const resolveDefaultAgentWorkspaceDir = () => "/tmp/openclaw-workspace";
  return {
    DEFAULT_AGENT_WORKSPACE_DIR: "/tmp/openclaw-workspace",
    DEFAULT_AGENTS_FILENAME: "AGENTS.md",
    DEFAULT_IDENTITY_FILENAME: "IDENTITY.md",
    resolveDefaultAgentWorkspaceDir,
    ensureAgentWorkspace: vi.fn(async ({ dir }: { dir: string }) => ({ dir })),
  };
});

vi.mock("../agents/command/session-store.js", async () => {
  const actual = await vi.importActual<typeof import("../agents/command/session-store.js")>(
    "../agents/command/session-store.js",
  );
  return {
    ...actual,
=======
vi.mock("../agents/command/session-store.runtime.js", () => {
  return {
>>>>>>> upstream/main
    updateSessionStoreAfterAgentRun: vi.fn(async () => undefined),
  };
});

vi.mock("../agents/command/cli-compaction.js", () => {
  return {
    runCliTurnCompactionLifecycle: vi.fn(
      async (params: { sessionEntry?: unknown }) => params.sessionEntry,
    ),
  };
});

vi.mock("../agents/command/attempt-execution.runtime.js", () => {
  return {
    buildAcpResult: vi.fn(),
    createAcpVisibleTextAccumulator: vi.fn(),
    emitAcpAssistantDelta: vi.fn(),
    emitAcpLifecycleEnd: vi.fn(),
    emitAcpLifecycleError: vi.fn(),
    emitAcpLifecycleStart: vi.fn(),
    persistAcpTurnTranscript: vi.fn(
      async (params: { sessionEntry?: unknown }) => params.sessionEntry,
    ),
    persistCliTurnTranscript: vi.fn(
      async (params: { sessionEntry?: unknown }) => params.sessionEntry,
    ),
    runAgentAttempt: vi.fn(async (params: Record<string, unknown>) => {
      const opts = params.opts as Record<string, unknown>;
      const runContext = params.runContext as Record<string, unknown>;
      const sessionEntry = params.sessionEntry as
        | {
            authProfileOverride?: string;
            authProfileOverrideSource?: string;
          }
        | undefined;
      const providerOverride = params.providerOverride as string;
      const authProfileProvider = params.authProfileProvider as string;
      const authProfileId =
        providerOverride === authProfileProvider ? sessionEntry?.authProfileOverride : undefined;

      return await runEmbeddedAgent({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        agentId: params.sessionAgentId,
        trigger: "user",
        messageChannel: params.messageChannel,
        agentAccountId: runContext.accountId,
        messageTo: opts.replyTo ?? opts.to,
        messageThreadId: opts.threadId,
        sessionFile: params.sessionFile,
        workspaceDir: params.workspaceDir,
        config: params.cfg,
        skillsSnapshot: params.skillsSnapshot,
        prompt: params.body,
        images: opts.images,
        imageOrder: opts.imageOrder,
        clientTools: opts.clientTools,
        provider: providerOverride,
        model: params.modelOverride,
        authProfileId,
        authProfileIdSource: authProfileId ? sessionEntry?.authProfileOverrideSource : undefined,
        thinkLevel: params.resolvedThinkLevel,
        fastMode: params.fastMode,
        verboseLevel: params.resolvedVerboseLevel,
        timeoutMs: params.timeoutMs,
        runId: params.runId,
        lane: opts.lane,
        abortSignal: opts.abortSignal,
        extraSystemPrompt: opts.extraSystemPrompt,
        bootstrapContextMode: opts.bootstrapContextMode,
        bootstrapContextRunKind: opts.bootstrapContextRunKind,
        internalEvents: opts.internalEvents,
        inputProvenance: opts.inputProvenance,
        streamParams: opts.streamParams,
        agentDir: params.agentDir,
        allowTransientCooldownProbe: params.allowTransientCooldownProbe,
        cleanupBundleMcpOnRunEnd: opts.cleanupBundleMcpOnRunEnd,
        cleanupCliLiveSessionOnRunEnd: opts.cleanupCliLiveSessionOnRunEnd,
        modelRun: opts.modelRun,
        promptMode: opts.promptMode,
        disableTools: opts.modelRun === true,
        onAgentEvent: params.onAgentEvent,
      } as never);
    }),
    sessionFileHasContent: vi.fn(async () => false),
  };
});

<<<<<<< HEAD
const configSpy = vi.spyOn(configModule, "loadConfig");
const readConfigFileSnapshotForWriteSpy = vi.spyOn(configModule, "readConfigFileSnapshotForWrite");

async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(fn, { prefix: "openclaw-agent-" });
}

async function loadFreshAgentCommandModulesForTest() {
  vi.resetModules();
  const runEmbeddedPiAgentMock = vi.fn();
  const loadModelCatalogMock = vi.fn();
  vi.doMock("../agents/pi-embedded.js", () => ({
    abortEmbeddedPiRun: vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: runEmbeddedPiAgentMock,
    resolveEmbeddedSessionLane: (key: string) => `session:${key.trim() || "main"}`,
  }));
  vi.doMock("../agents/model-catalog.js", () => ({
    loadModelCatalog: loadModelCatalogMock,
  }));
  const [agentModule, configModuleFresh, commandSecretGatewayModuleFresh] = await Promise.all([
    import("./agent.js"),
    import("../config/config.js"),
    import("../cli/command-secret-gateway.js"),
  ]);
  return {
    agentCommand: agentModule.agentCommand,
    configModuleFresh,
    commandSecretGatewayModuleFresh,
    runEmbeddedPiAgentMock,
    loadModelCatalogMock,
  };
=======
vi.mock("../agents/command/delivery.runtime.js", () => {
  return {
    deliverAgentCommandResult: vi.fn(
      async (params: {
        cfg: OpenClawConfig;
        deps: {
          sendMessageTelegram?: (
            to: string,
            text: string,
            opts: Record<string, unknown>,
          ) => Promise<unknown>;
        };
        runtime: RuntimeEnv;
        opts: {
          channel?: string;
          deliver?: boolean;
          json?: boolean;
          to?: string;
        };
        result: { meta?: Record<string, unknown> };
        payloads?: Array<{ text?: string; mediaUrl?: string | null }>;
      }) => {
        const payloads = params.payloads ?? [];
        if (params.opts.json) {
          params.runtime.log(JSON.stringify({ payloads, meta: params.result.meta ?? {} }));
          return;
        }
        if (params.opts.deliver && params.opts.channel === "telegram" && params.opts.to) {
          for (const payload of payloads) {
            await params.deps.sendMessageTelegram?.(params.opts.to, payload.text ?? "", {
              ...(payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {}),
              accountId: undefined,
              verbose: false,
            });
          }
          return;
        }
        for (const payload of payloads) {
          if (payload.text) {
            params.runtime.log(payload.text);
          }
        }
      },
    ),
  };
});

vi.mock("../config/sessions/transcript-resolve.runtime.js", () => {
  const dirname = (filePath: string): string => {
    const lastSlash = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
    return lastSlash >= 0 ? filePath.slice(0, lastSlash) : ".";
  };
  const joinPath = (...parts: string[]): string => {
    const separator = parts.some((part) => part.includes("\\")) ? "\\" : "/";
    const normalizedParts: string[] = [];
    for (const [index, part] of parts.entries()) {
      const normalized =
        index === 0 ? part.replace(/[\\/]+$/u, "") : part.replace(/^[\\/]+|[\\/]+$/gu, "");
      if (normalized.length > 0) {
        normalizedParts.push(normalized);
      }
    }
    return normalizedParts.join(separator);
  };
  const resolveSessionFile = (sessionId: string, agentId: string, sessionsDir?: string): string =>
    joinPath(sessionsDir ?? ".openclaw", "agents", agentId, "sessions", `${sessionId}.jsonl`);

  return {
    resolveSessionTranscriptFile: vi.fn(
      async (params: {
        sessionId: string;
        sessionKey: string;
        sessionEntry?: { sessionFile?: string; sessionId?: string };
        sessionStore?: Record<string, { sessionFile?: string; sessionId?: string }>;
        storePath?: string;
        agentId: string;
        threadId?: string | number;
      }) => {
        const sessionsDir = params.storePath ? dirname(params.storePath) : undefined;
        const sessionFileFromStorePath =
          params.sessionEntry?.sessionFile ??
          resolveSessionFile(params.sessionId, params.agentId, sessionsDir);
        const sessionFile = params.sessionEntry?.sessionFile
          ? sessionFileFromStorePath
          : resolveSessionFile(params.sessionId, params.agentId, sessionsDir);
        let sessionEntry = params.sessionEntry;
        if (params.sessionStore && params.storePath && params.sessionKey) {
          const existingEntry = params.sessionStore[params.sessionKey] ?? {};
          sessionEntry = {
            ...existingEntry,
            sessionId: params.sessionId,
            sessionFile,
          };
          params.sessionStore[params.sessionKey] = sessionEntry;
          fs.writeFileSync(params.storePath, JSON.stringify(params.sessionStore));
        }
        return { sessionFile, sessionEntry };
      },
    ),
  };
});

const runtime = createThrowingTestRuntime();

async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(fn, {
    prefix: "openclaw-agent-",
    skipHomeCleanup: true,
    skipSessionCleanup: true,
  });
>>>>>>> upstream/main
}

function mockConfig(
  home: string,
  storePath: string,
  agentOverrides?: Partial<NonNullable<NonNullable<OpenClawConfig["agents"]>["defaults"]>>,
  telegramOverrides?: Partial<NonNullable<NonNullable<OpenClawConfig["channels"]>["telegram"]>>,
  agentsList?: NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>,
) {
  const cfg = {
    agents: {
      defaults: {
        model: { primary: "anthropic/claude-opus-4-6" },
        models: { "anthropic/claude-opus-4-6": {} },
        workspace: path.join(home, "openclaw"),
        ...agentOverrides,
      },
      list: agentsList,
    },
    session: { store: storePath, mainKey: "main" },
    channels: {
      telegram: telegramOverrides ? { ...telegramOverrides } : undefined,
    },
  } as OpenClawConfig;
  configIoMocks.loadConfig.mockReturnValue(cfg);
  return cfg;
}

function writeSessionStoreSeed(
  storePath: string,
  sessions: Record<string, Record<string, unknown>>,
) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(sessions));
}

function createDefaultAgentResult(params?: {
  payloads?: Array<Record<string, unknown>>;
  durationMs?: number;
}) {
  return {
    payloads: params?.payloads ?? [{ text: "ok" }],
    meta: {
      durationMs: params?.durationMs ?? 5,
      agentMeta: { sessionId: "s", provider: "p", model: "m" },
    },
  };
}

function getLastEmbeddedCall() {
  const calls = vi.mocked(runEmbeddedAgent).mock.calls;
  return calls[calls.length - 1]?.[0];
}

function expectLastRunProviderModel(provider: string, model: string): void {
  const callArgs = getLastEmbeddedCall();
  expect(callArgs?.provider).toBe(provider);
  expect(callArgs?.model).toBe(model);
}

function readSessionStore<T>(storePath: string): Record<string, T> {
  return JSON.parse(fs.readFileSync(storePath, "utf-8")) as Record<string, T>;
}

async function runAgentWithSessionKey(sessionKey: string): Promise<void> {
  await agentCommand({ message: "hi", sessionKey }, runtime);
}

function mockModelCatalogOnce(entries: ReturnType<typeof loadManifestModelCatalog>): void {
  vi.mocked(loadManifestModelCatalog).mockReturnValueOnce(entries);
  vi.mocked(loadModelCatalog).mockResolvedValueOnce(entries);
}

function installThinkingTestProviders() {
  const registry = createTestRegistry();
  registry.providers = ["anthropic", "codex", "ollama", "openai", "openrouter"].map(
    (providerId): PluginProviderRegistration => ({
      pluginId: providerId,
      source: "test",
      provider: {
        id: providerId,
        label: providerId,
        auth: [],
        resolveThinkingProfile: () => ({
          levels: BASE_THINKING_LEVELS.map((id) => ({ id })),
          defaultLevel: "off",
        }),
      },
    }),
  );
  setActivePluginRegistry(registry);
}

beforeEach(() => {
  vi.clearAllMocks();
  resetPluginRuntimeStateForTest();
  installThinkingTestProviders();
  clearSessionStoreCacheForTest();
  resetAgentEventsForTest();
  resetAgentRunContextForTest();
  acpManagerTesting.resetAcpSessionManagerForTests();
<<<<<<< HEAD
  configModule.clearRuntimeConfigSnapshot();
  vi.mocked(runEmbeddedPiAgent).mockResolvedValue(createDefaultAgentResult());
  vi.mocked(loadModelCatalog).mockResolvedValue([]);
  readConfigFileSnapshotForWriteSpy.mockResolvedValue({
=======
  runtimeSnapshotModule.clearRuntimeConfigSnapshot();
  vi.mocked(runEmbeddedAgent).mockResolvedValue(createDefaultAgentResult());
  vi.mocked(loadManifestModelCatalog).mockReturnValue([]);
  vi.mocked(loadModelCatalog).mockResolvedValue([]);
  vi.mocked(modelSelectionModule.isCliProvider).mockImplementation(() => false);
  configIoMocks.readConfigFileSnapshotForWrite.mockResolvedValue({
>>>>>>> upstream/main
    snapshot: { valid: false, resolved: {} as OpenClawConfig },
    writeOptions: {},
  });
});

describe("agentCommand", () => {
  it("enables the Codex runtime plugin and provider owner for one-shot OpenAI model overrides", async () => {
    await withTempHome(async (home) => {
<<<<<<< HEAD
      const {
        agentCommand: freshAgentCommand,
        configModuleFresh,
        commandSecretGatewayModuleFresh,
        runEmbeddedPiAgentMock,
        loadModelCatalogMock,
      } = await loadFreshAgentCommandModulesForTest();
      const freshConfigSpy = vi.spyOn(configModuleFresh, "loadConfig");
      const freshReadConfigFileSnapshotForWriteSpy = vi.spyOn(
        configModuleFresh,
        "readConfigFileSnapshotForWrite",
      );
      const freshSetRuntimeConfigSnapshotSpy = vi.spyOn(
        configModuleFresh,
        "setRuntimeConfigSnapshot",
      );
      runEmbeddedPiAgentMock.mockResolvedValue(createDefaultAgentResult());
      loadModelCatalogMock.mockResolvedValue([]);
=======
      const storePath = path.join(home, "sessions.json");
      mockConfig(home, storePath, { models: undefined });
>>>>>>> upstream/main

      await agentCommand(
        {
          message: "hi",
          agentId: "main",
          model: "openai/gpt-5.2",
          allowModelOverride: true,
        },
        runtime,
      );

      expect(pluginRegistryMocks.ensurePluginRegistryLoaded).toHaveBeenCalledTimes(1);
      for (const [registryLoad] of pluginRegistryMocks.ensurePluginRegistryLoaded.mock.calls) {
        expect(registryLoad?.scope).toBe("all");
        expect(registryLoad?.config).toBeTypeOf("object");
        expect(registryLoad?.activationSourceConfig).toBeTypeOf("object");
        expect(registryLoad?.workspaceDir).toBe(path.join(home, "openclaw"));
        expect(registryLoad?.onlyPluginIds).toEqual(["codex", "openai"]);
      }
      expectLastRunProviderModel("openai", "gpt-5.2");
    });
  });

  it("does not enable Codex for one-shot OpenAI overrides when the provider forces OpenClaw", async () => {
    await withTempHome(async (home) => {
      const storePath = path.join(home, "sessions.json");
      const cfg = mockConfig(home, storePath, { models: undefined });
      cfg.models = {
        providers: {
          openai: {
            baseUrl: "https://api.openai.com/v1",
            agentRuntime: { id: "openclaw" },
            models: [],
          },
        },
      };

      await agentCommand(
        {
          message: "hi",
          agentId: "main",
          model: "openai/gpt-5.2",
          allowModelOverride: true,
        },
        runtime,
      );

      expect(pluginRegistryMocks.ensurePluginRegistryLoaded).not.toHaveBeenCalled();
      expectLastRunProviderModel("openai", "gpt-5.2");
    });
  });

  it("enforces ingress model override authorization", async () => {
    await expect(
      // Runtime guard for non-TS callers; TS callsites are statically typed.
      agentCommandFromIngress(
        {
          message: "hi",
          to: "+1555",
        } as never,
        runtime,
      ),
    ).rejects.toThrow("allowModelOverride must be explicitly set for ingress agent runs.");
  });

  it("uses the selected agent thinkingDefault for fresh ingress runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
<<<<<<< HEAD
      const loadedConfig = {
        agents: {
          defaults: {
            model: { primary: "anthropic/claude-opus-4-6" },
            models: { "anthropic/claude-opus-4-6": {} },
            workspace: path.join(home, "openclaw"),
          },
=======
      mockConfig(
        home,
        store,
        {
          thinkingDefault: "high",
>>>>>>> upstream/main
        },
        undefined,
        [{ id: "main", default: true, thinkingDefault: "off" }],
      );

      await agentCommandFromIngress(
        {
          message: "ping",
          agentId: "main",
          allowModelOverride: false,
        },
        runtime,
      );

      expect(getLastEmbeddedCall()?.thinkLevel).toBe("off");
    });
  });

  it("installs a local gateway request scope for embedded agent dispatch", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);
      const { getPluginRuntimeGatewayRequestScope } =
        await import("../plugins/runtime/gateway-request-scope.js");
      vi.mocked(attemptExecutionRuntime.runAgentAttempt).mockImplementationOnce(async () => {
        const scope = getPluginRuntimeGatewayRequestScope();
        expect(scope?.context?.getRuntimeConfig()).toMatchObject({
          session: { store },
        });
        return createDefaultAgentResult();
      });

      await agentCommand({ message: "ping", agentId: "main" }, runtime);

      expect(getPluginRuntimeGatewayRequestScope()).toBeUndefined();
    });
  });

  it("persists local overrides", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);
      vi.mocked(runEmbeddedAgent).mockResolvedValue(
        createDefaultAgentResult({
          payloads: [{ text: "json-reply", mediaUrl: "http://x.test/a.jpg" }],
          durationMs: 42,
        }),
      );

      await agentCommand(
        {
          message: "ping",
          to: "+1222",
          accountId: "kev",
          thinking: "high",
          verbose: "on",
          json: true,
        },
        runtime,
      );

      const saved = JSON.parse(fs.readFileSync(store, "utf-8")) as Record<
        string,
        { thinkingLevel?: string; verboseLevel?: string }
      >;
      const entry = Object.values(saved)[0];
      expect(entry.thinkingLevel).toBe("high");
      expect(entry.verboseLevel).toBe("on");

      const callArgs = getLastEmbeddedCall();
      expect(callArgs?.thinkLevel).toBe("high");
      expect(callArgs?.verboseLevel).toBe("on");
      expect(callArgs?.prompt).toBe("ping");
      expect(callArgs?.agentAccountId).toBe("kev");

      const logCalls = (runtime.log as unknown as MockInstance).mock.calls;
      const logged = logCalls[logCalls.length - 1]?.[0] as string;
      const parsed = JSON.parse(logged) as {
        payloads: Array<{ text: string; mediaUrl?: string | null }>;
        meta: { durationMs: number };
      };
      expect(parsed.payloads[0].text).toBe("json-reply");
      expect(parsed.payloads[0].mediaUrl).toBe("http://x.test/a.jpg");
      expect(parsed.meta.durationMs).toBe(42);
    });
  });

  it("persists embedded-runner turns to the session transcript", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);
      const base = createDefaultAgentResult({ payloads: [{ text: "assistant-visible" }] });
      vi.mocked(runEmbeddedAgent).mockResolvedValueOnce({
        ...base,
        meta: {
          ...base.meta,
          executionTrace: { runner: "embedded" },
        },
      });

      await agentCommand({ message: "hello from user", agentId: "main" }, runtime);

      expect(vi.mocked(attemptExecutionRuntime.persistCliTurnTranscript)).toHaveBeenCalledTimes(1);
      const persistArgs = vi.mocked(attemptExecutionRuntime.persistCliTurnTranscript).mock
        .calls[0]?.[0];
      expect(persistArgs?.embeddedAssistantGapFill).toBe(true);
      expect(persistArgs?.body).toBe("hello from user");
      expect(persistArgs?.result.meta?.executionTrace?.runner).toBe("embedded");
    });
  });

  it("gap-fills Telegram-visible embedded replies without a runner trace", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);
      const sendMessageTelegram = vi.fn(async () => undefined);
      const base = createDefaultAgentResult({ payloads: [{ text: "assistant-visible" }] });
      vi.mocked(runEmbeddedAgent).mockResolvedValueOnce({
        ...base,
        meta: {
          ...base.meta,
          finalAssistantVisibleText: "assistant-visible",
        },
      });

      await agentCommandFromIngress(
        {
          message: "call a tool then answer",
          agentId: "main",
          to: "+1222",
          channel: "telegram",
          messageChannel: "telegram",
          deliver: true,
          allowModelOverride: false,
          sessionEffects: "internal",
        },
        runtime,
        { sendMessageTelegram },
      );

      expect(sendMessageTelegram).toHaveBeenCalledWith("+1222", "assistant-visible", {
        verbose: false,
      });
      expect(vi.mocked(attemptExecutionRuntime.persistCliTurnTranscript)).toHaveBeenCalledTimes(1);
      const persistArgs = vi.mocked(attemptExecutionRuntime.persistCliTurnTranscript).mock
        .calls[0]?.[0];
      expect(persistArgs?.embeddedAssistantGapFill).toBe(true);
      expect(persistArgs?.body).toBe("call a tool then answer");
    });
  });

  it("passes configured fast mode to embedded runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, {
        model: "openai/gpt-5.5",
        models: {
          "openai/gpt-5.5": { params: { fastMode: true } },
        },
      });

      await agentCommand({ message: "ping", agentId: "main" }, runtime);

      const callArgs = getLastEmbeddedCall();
      expect(callArgs?.provider).toBe("openai");
      expect(callArgs?.model).toBe("gpt-5.5");
      expect(callArgs?.fastMode).toBe(true);
    });
  });

  it("does not load the full model catalog for trusted explicit overrides without an allowlist", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, { models: {} });

      await agentCommand(
        {
          message: "ping",
          to: "+1222",
          model: "openrouter/auto",
        },
        runtime,
      );

      expect(loadModelCatalog).not.toHaveBeenCalled();
      expectLastRunProviderModel("openrouter", "openrouter/auto");
      const thinkingDefaultCall = vi.mocked(modelSelectionModule.resolveThinkingDefault).mock
        .calls[0]?.[0];
      expect(thinkingDefaultCall?.provider).toBe("openrouter");
      expect(thinkingDefaultCall?.model).toBe("openrouter/auto");
      expect(thinkingDefaultCall?.catalog).toBeUndefined();
    });
  });

  it("uses no-tools plain prompt mode for one-shot model runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, { models: {} });

      await agentCommand(
        {
          message: "Reply with exactly OPENCLAW-MODEL-OK",
          agentId: "main",
          model: "openrouter/auto",
          modelRun: true,
          promptMode: "none",
        },
        runtime,
      );

      const callArgs = getLastEmbeddedCall();
      expect(callArgs?.provider).toBe("openrouter");
      expect(callArgs?.model).toBe("openrouter/auto");
      expect(callArgs?.modelRun).toBe(true);
      expect(callArgs?.promptMode).toBe("none");
      expect(callArgs?.disableTools).toBe(true);
    });
  });

  it("bypasses ACP sessions for one-shot model runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      const sessionKey = "agent:main:main";
      mockConfig(home, store, { models: {} });
      writeSessionStoreSeed(store, {
        [sessionKey]: {
          sessionId: "acp-backed-session",
          updatedAt: Date.now(),
        },
      });
      const runTurn = vi.fn();
      acpManagerTesting.setAcpSessionManagerForTests({
        resolveSession: vi.fn(() => ({
          kind: "ready",
          sessionKey,
          meta: {
            backend: "acpx",
            agent: "codex",
            runtimeSessionName: "runtime-1",
            mode: "persistent",
            state: "idle",
            lastActivityAt: Date.now(),
          },
        })),
        runTurn,
      });

      await agentCommand(
        {
          message: "Reply with exactly OPENCLAW-MODEL-OK",
          sessionKey,
          model: "openrouter/auto",
          modelRun: true,
          promptMode: "none",
        },
        runtime,
      );

      expect(runTurn).not.toHaveBeenCalled();
      const callArgs = getLastEmbeddedCall();
      expect(callArgs?.provider).toBe("openrouter");
      expect(callArgs?.model).toBe("openrouter/auto");
      expect(callArgs?.prompt).toBe("Reply with exactly OPENCLAW-MODEL-OK");
      expect(callArgs?.modelRun).toBe(true);
      expect(callArgs?.promptMode).toBe("none");
      expect(callArgs?.disableTools).toBe(true);
    });
  });

  it("borrows session lookup data without returning cached mutable store objects", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      const sessionKey = "agent:main:cache-borrow";
      writeSessionStoreSeed(store, {
        [sessionKey]: {
          sessionId: "session-cache-borrow",
          updatedAt: Date.now(),
          thinkingLevel: "low",
        },
        "agent:main:other": {
          sessionId: "session-other",
          updatedAt: Date.now(),
        },
      });
      mockConfig(home, store, { models: {} });

      const prepared = await agentCommandTesting.prepareAgentCommandExecution(
        {
          message: "prepare only",
          sessionKey,
        },
        runtime,
      );
      const cached = loadSessionStore(store, { clone: false });

      expect(prepared.sessionStore).not.toBe(cached);
      expect(prepared.sessionEntry).not.toBe(cached[sessionKey]);
      expect(prepared.sessionStore?.[sessionKey]).toBe(prepared.sessionEntry);
      expect(prepared.sessionStore?.["agent:main:other"]).toBeUndefined();
    });
  });

  it("passes resolved session-id resume files to embedded runs", async () => {
    await withTempHome(async (home) => {
      const resumeStore = path.join(home, "sessions-resume.json");
      writeSessionStoreSeed(resumeStore, {
        foo: {
          sessionId: "session-123",
          updatedAt: Date.now(),
          systemSent: true,
        },
      });
      mockConfig(home, resumeStore);

      await agentCommand(
        { message: "resume me", sessionId: "session-123", thinking: "low" },
        runtime,
      );

      const callArgs = getLastEmbeddedCall();
      expect(callArgs?.sessionId).toBe("session-123");
<<<<<<< HEAD
    });
  });

  it("creates a stable session key for explicit session-id-only runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      const cfg = mockConfig(home, store);

      const resolution = resolveSession({ cfg, sessionId: "explicit-session-123" });

      expect(resolution.sessionKey).toBe("agent:main:explicit:explicit-session-123");
      expect(resolution.sessionId).toBe("explicit-session-123");
    });
  });

  it("uses the resumed session agent scope when sessionId resolves to another agent store", async () => {
    await withCrossAgentResumeFixture(async ({ sessionId, sessionKey, cfg }) => {
      const resolution = resolveSession({ cfg, sessionId });
      expect(resolution.sessionKey).toBe(sessionKey);
      const agentId = resolveSessionAgentId({ sessionKey: resolution.sessionKey, config: cfg });
      expect(agentId).toBe("exec");
      expect(resolveAgentDir(cfg, agentId)).toContain(
        `${path.sep}agents${path.sep}exec${path.sep}agent`,
      );
    });
  });

  it("resolves duplicate cross-agent sessionIds deterministically", async () => {
    await withTempHome(async (home) => {
      const storePattern = path.join(home, "sessions", "{agentId}", "sessions.json");
      const otherStore = path.join(home, "sessions", "other", "sessions.json");
      const retiredStore = path.join(home, "sessions", "retired", "sessions.json");
      writeSessionStoreSeed(otherStore, {
        "agent:other:main": {
          sessionId: "run-dup",
          updatedAt: Date.now() + 1_000,
        },
      });
      writeSessionStoreSeed(retiredStore, {
        "agent:retired:acp:run-dup": {
          sessionId: "run-dup",
          updatedAt: Date.now(),
        },
      });
      const cfg = mockConfig(home, storePattern, undefined, undefined, [
        { id: "other" },
        { id: "retired", default: true },
      ]);

      const resolution = resolveSession({ cfg, sessionId: "run-dup" });

      expect(resolution.sessionKey).toBe("agent:retired:acp:run-dup");
      expect(resolution.storePath).toBe(retiredStore);
    });
  });

  it("uses origin.provider for channel-specific session reset overrides", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      writeSessionStoreSeed(store, {
        main: {
          sessionId: "origin-provider-reset",
          updatedAt: Date.now() - 30 * 60_000,
          origin: { provider: "discord" },
        },
      });
      const cfg = mockConfig(home, store);
      cfg.session = {
        ...cfg.session,
        reset: { mode: "idle", idleMinutes: 10 },
        resetByChannel: {
          discord: { mode: "idle", idleMinutes: 120 },
        },
      };

      const resolution = resolveSession({ cfg, sessionKey: "main" });

      expect(resolution.sessionId).toBe("origin-provider-reset");
      expect(resolution.isNewSession).toBe(false);
    });
  });

  it("forwards resolved outbound session context when resuming by sessionId", async () => {
    await withCrossAgentResumeFixture(async ({ sessionId, sessionKey, cfg }) => {
      const resolution = resolveSession({ cfg, sessionId });
      expect(resolution.sessionKey).toBe(sessionKey);
      const agentId = resolveSessionAgentId({ sessionKey: resolution.sessionKey, config: cfg });
      expect(
        buildOutboundSessionContext({
          cfg,
          sessionKey: resolution.sessionKey,
          agentId,
        }),
      ).toEqual(
        expect.objectContaining({
          key: sessionKey,
          agentId: "exec",
        }),
      );
    });
  });

  it("resolves resumed session transcript path from custom session store directory", async () => {
    await withTempHome(async (home) => {
      const customStoreDir = path.join(home, "custom-state");
      const store = path.join(customStoreDir, "sessions.json");
      writeSessionStoreSeed(store, {});
      mockConfig(home, store);
      const resolveSessionFilePathSpy = vi.spyOn(sessionPathsModule, "resolveSessionFilePath");

      await agentCommand({ message: "resume me", sessionId: "session-custom-123" }, runtime);

      const matchingCall = resolveSessionFilePathSpy.mock.calls.find(
        (call) => call[0] === "session-custom-123",
      );
      expect(matchingCall?.[2]).toEqual(
        expect.objectContaining({
          agentId: "main",
          sessionsDir: customStoreDir,
        }),
=======
      expect(callArgs?.sessionFile).toContain(
        `${path.dirname(resumeStore)}${path.sep}agents${path.sep}main${path.sep}sessions${path.sep}session-123.jsonl`,
>>>>>>> upstream/main
      );
    });
  });

  it("does not duplicate agent events from embedded runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);

      const assistantEvents: Array<{ runId: string; text?: string }> = [];
      const stop = onAgentEvent((evt) => {
        if (evt.stream !== "assistant") {
          return;
        }
        assistantEvents.push({
          runId: evt.runId,
          text: typeof evt.data?.text === "string" ? evt.data.text : undefined,
        });
      });

      vi.mocked(runEmbeddedAgent).mockImplementationOnce(async (params) => {
        const runId = (params as { runId?: string } | undefined)?.runId ?? "run";
        const data = { text: "hello", delta: "hello" };
        (
          params as {
            onAgentEvent?: (evt: { stream: string; data: Record<string, unknown> }) => void;
          }
        ).onAgentEvent?.({ stream: "assistant", data });
        emitAgentEvent({ runId, stream: "assistant", data });
        return {
          payloads: [{ text: "hello" }],
          meta: { agentMeta: { provider: "p", model: "m" } },
        } as never;
      });

      await agentCommand({ message: "hi", to: "+1555", thinking: "low" }, runtime);
      stop();

      const matching = assistantEvents.filter((evt) => evt.text === "hello");
      expect(matching).toHaveLength(1);
    });
  });

  it("does not publish Codex app-server events from the core command callback", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
<<<<<<< HEAD
      mockConfig(home, store, {
        model: { primary: "openai/gpt-4.1-mini" },
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
        },
=======
      mockConfig(home, store);

      const codexEvents: Array<{ runId: string; phase?: string }> = [];
      const stop = onAgentEvent((evt) => {
        if (evt.stream !== "codex_app_server.lifecycle") {
          return;
        }
        codexEvents.push({
          runId: evt.runId,
          phase: typeof evt.data?.phase === "string" ? evt.data.phase : undefined,
        });
>>>>>>> upstream/main
      });

      vi.mocked(runEmbeddedAgent).mockImplementationOnce(async (params) => {
        (
          params as {
            onAgentEvent?: (evt: { stream: string; data: Record<string, unknown> }) => void;
          }
        ).onAgentEvent?.({
          stream: "codex_app_server.lifecycle",
          data: { phase: "startup" },
        });
        return {
          payloads: [{ text: "hello" }],
          meta: { agentMeta: { provider: "p", model: "m" } },
        } as never;
      });

      await agentCommand({ message: "hi", to: "+1555", thinking: "low" }, runtime);
      stop();

      expect(codexEvents).toHaveLength(0);
    });
  });

  it("probes the configured primary first for origin-backed auto session model overrides", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      writeSessionStoreSeed(store, {
        "agent:main:subagent:test": {
          sessionId: "session-subagent",
          updatedAt: Date.now(),
          providerOverride: "anthropic",
          modelOverride: "claude-opus-4-6",
<<<<<<< HEAD
=======
          modelOverrideSource: "auto",
          modelOverrideFallbackOriginProvider: "openai",
          modelOverrideFallbackOriginModel: "gpt-4.1-mini",
>>>>>>> upstream/main
        },
      });

      mockConfig(home, store, {
        model: {
          primary: "openai/gpt-4.1-mini",
          fallbacks: ["openai/gpt-5.4"],
        },
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
          "openai/gpt-5.4": {},
        },
      });

<<<<<<< HEAD
      vi.mocked(loadModelCatalog).mockResolvedValueOnce([
=======
      mockModelCatalogOnce([
>>>>>>> upstream/main
        { id: "claude-opus-4-6", name: "Opus", provider: "anthropic" },
        { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
        { id: "gpt-5.4", name: "GPT-5.2", provider: "openai" },
      ]);
      vi.mocked(runEmbeddedAgent)
        .mockRejectedValueOnce(Object.assign(new Error("rate limited"), { status: 429 }))
        .mockResolvedValueOnce({
          payloads: [{ text: "ok" }],
          meta: {
            durationMs: 5,
            agentMeta: { sessionId: "session-subagent", provider: "openai", model: "gpt-5.4" },
          },
        });

      await agentCommand(
        {
          message: "hi",
          sessionKey: "agent:main:subagent:test",
        },
        runtime,
      );

      const attempts = vi
        .mocked(runEmbeddedAgent)
        .mock.calls.map((call) => ({ provider: call[0]?.provider, model: call[0]?.model }));
      expect(attempts).toEqual([
<<<<<<< HEAD
        { provider: "anthropic", model: "claude-opus-4-6" },
=======
        { provider: "openai", model: "gpt-4.1-mini" },
>>>>>>> upstream/main
        { provider: "openai", model: "gpt-5.4" },
      ]);
    });
  });

  it("clears legacy auto session model overrides without origin metadata", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions-legacy-auto-override.json");
      writeSessionStoreSeed(store, {
        "agent:main:subagent:legacy-auto": {
          sessionId: "session-legacy-auto",
          updatedAt: Date.now(),
          providerOverride: "anthropic",
          modelOverride: "claude-opus-4-6",
          modelOverrideSource: "auto",
        },
      });

      mockConfig(home, store, {
<<<<<<< HEAD
        model: { primary: "anthropic/claude-opus-4-6" },
        models: {},
      });

      vi.mocked(loadModelCatalog).mockResolvedValueOnce([
        { id: "claude-opus-4-6", name: "Opus", provider: "anthropic" },
=======
        model: {
          primary: "openai/gpt-4.1-mini",
          fallbacks: ["openai/gpt-5.4"],
        },
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
          "openai/gpt-5.4": {},
        },
      });

      mockModelCatalogOnce([
        { id: "claude-opus-4-6", name: "Opus", provider: "anthropic" },
        { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
        { id: "gpt-5.4", name: "GPT-5.4", provider: "openai" },
>>>>>>> upstream/main
      ]);

      await agentCommand(
        {
          message: "hi",
          sessionKey: "agent:main:subagent:legacy-auto",
        },
        runtime,
      );

      const attempts = vi
        .mocked(runEmbeddedAgent)
        .mock.calls.map((call) => ({ provider: call[0]?.provider, model: call[0]?.model }));
      expect(attempts).toEqual([{ provider: "openai", model: "gpt-4.1-mini" }]);

      const cleared = readSessionStore<{
        providerOverride?: string;
        modelOverride?: string;
        modelOverrideSource?: string;
      }>(store);
      const entry = cleared["agent:main:subagent:legacy-auto"];
      expect(entry?.providerOverride).toBeUndefined();
      expect(entry?.modelOverride).toBeUndefined();
      expect(entry?.modelOverrideSource).toBeUndefined();
    });
  });

  it("does not use fallback list for user session model overrides", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions-user-override.json");
      writeSessionStoreSeed(store, {
        "agent:main:subagent:user-override": {
          sessionId: "session-user-override",
          updatedAt: Date.now(),
          providerOverride: "ollama",
          modelOverride: "qwen3.5:27b",
          modelOverrideSource: "user",
        },
      });

      mockConfig(home, store, {
        model: {
          primary: "openai/gpt-4.1-mini",
          fallbacks: ["openai/gpt-5.4"],
        },
        models: {
          "ollama/qwen3.5:27b": {},
          "openai/gpt-4.1-mini": {},
          "openai/gpt-5.4": {},
        },
      });

      mockModelCatalogOnce([
        { id: "qwen3.5:27b", name: "Qwen 3.5", provider: "ollama" },
        { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
        { id: "gpt-5.4", name: "GPT-5.4", provider: "openai" },
      ]);
      vi.mocked(runEmbeddedAgent).mockRejectedValueOnce(new Error("connect ECONNREFUSED"));

      await expect(
        agentCommand(
          {
            message: "hi",
            sessionKey: "agent:main:subagent:user-override",
          },
          runtime,
        ),
      ).rejects.toThrow("connect ECONNREFUSED");

      const attempts = vi
        .mocked(runEmbeddedAgent)
        .mock.calls.map((call) => ({ provider: call[0]?.provider, model: call[0]?.model }));
      expect(attempts).toEqual([{ provider: "ollama", model: "qwen3.5:27b" }]);
    });
  });

  it("clears disallowed stored override fields", async () => {
    await withTempHome(async (home) => {
      const clearStore = path.join(home, "sessions-clear-overrides.json");
      writeSessionStoreSeed(clearStore, {
        "agent:main:subagent:clear-overrides": {
          sessionId: "session-clear-overrides",
          updatedAt: Date.now(),
          providerOverride: "anthropic",
          modelOverride: "claude-opus-4-6",
          authProfileOverride: "profile-legacy",
          authProfileOverrideSource: "user",
          authProfileOverrideCompactionCount: 2,
          fallbackNoticeSelectedModel: "anthropic/claude-opus-4-6",
          fallbackNoticeActiveModel: "openai/gpt-4.1-mini",
          fallbackNoticeReason: "fallback",
        },
      });

      mockConfig(home, clearStore, {
        model: { primary: "openai/gpt-4.1-mini" },
        models: {
          "openai/gpt-4.1-mini": {},
        },
      });

<<<<<<< HEAD
      vi.mocked(loadModelCatalog).mockResolvedValueOnce([
=======
      mockModelCatalogOnce([
>>>>>>> upstream/main
        { id: "claude-opus-4-6", name: "Opus", provider: "anthropic" },
        { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
      ]);

      await runAgentWithSessionKey("agent:main:subagent:clear-overrides");

      expectLastRunProviderModel("openai", "gpt-4.1-mini");

      const cleared = readSessionStore<{
        providerOverride?: string;
        modelOverride?: string;
        authProfileOverride?: string;
        authProfileOverrideSource?: string;
        authProfileOverrideCompactionCount?: number;
        fallbackNoticeSelectedModel?: string;
        fallbackNoticeActiveModel?: string;
        fallbackNoticeReason?: string;
      }>(clearStore);
      const entry = cleared["agent:main:subagent:clear-overrides"];
      expect(entry?.providerOverride).toBeUndefined();
      expect(entry?.modelOverride).toBeUndefined();
      expect(entry?.authProfileOverride).toBeUndefined();
      expect(entry?.authProfileOverrideSource).toBeUndefined();
      expect(entry?.authProfileOverrideCompactionCount).toBeUndefined();
      expect(entry?.fallbackNoticeSelectedModel).toBeUndefined();
      expect(entry?.fallbackNoticeActiveModel).toBeUndefined();
      expect(entry?.fallbackNoticeReason).toBeUndefined();
    });
  });

  it("handles one-off provider/model overrides and validates override values", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, {
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
        },
      });

      await agentCommand(
        {
          message: "use the override",
          sessionKey: "agent:main:subagent:run-override",
          provider: "openai",
          model: "gpt-4.1-mini",
        },
        runtime,
      );

      expectLastRunProviderModel("openai", "gpt-4.1-mini");

      const saved = readSessionStore<{
        providerOverride?: string;
        modelOverride?: string;
      }>(store);
      expect(saved["agent:main:subagent:run-override"]?.providerOverride).toBeUndefined();
      expect(saved["agent:main:subagent:run-override"]?.modelOverride).toBeUndefined();

<<<<<<< HEAD
  it("rejects explicit override values that contain control characters", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, {
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
        },
      });

      await expect(
        agentCommand(
          {
            message: "use an invalid override",
            sessionKey: "agent:main:subagent:invalid-override",
            provider: "openai\u001b[31m",
            model: "gpt-4.1-mini",
          },
          runtime,
        ),
      ).rejects.toThrow("Provider override contains invalid control characters.");
    });
  });

  it("sanitizes provider/model text in model-allowlist errors", async () => {
    const parseModelRefSpy = vi.spyOn(modelSelectionModule, "parseModelRef");
    parseModelRefSpy.mockImplementationOnce(() => ({
      provider: "anthropic\u001b[31m",
      model: "claude-haiku-4-5\u001b[32m",
    }));
    try {
      await withTempHome(async (home) => {
        const store = path.join(home, "sessions.json");
        mockConfig(home, store, {
          models: {
            "openai/gpt-4.1-mini": {},
          },
        });

        await expect(
          agentCommand(
            {
              message: "use disallowed override",
              sessionKey: "agent:main:subagent:sanitized-override-error",
              model: "claude-haiku-4-5",
            },
            runtime,
          ),
        ).rejects.toThrow(
          'Model override "anthropic/claude-haiku-4-5" is not allowed for agent "main".',
        );
      });
    } finally {
      parseModelRefSpy.mockRestore();
    }
  });

  it("keeps stored auth profile overrides during one-off cross-provider runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
=======
>>>>>>> upstream/main
      writeSessionStoreSeed(store, {
        "agent:main:subagent:temp-openai-run": {
          sessionId: "session-temp-openai-run",
          updatedAt: Date.now(),
          authProfileOverride: "anthropic:work",
          authProfileOverrideSource: "user",
          authProfileOverrideCompactionCount: 2,
        },
      });
<<<<<<< HEAD
      mockConfig(home, store, {
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
        },
      });
      vi.mocked(authProfilesModule.ensureAuthProfileStore).mockReturnValue({
=======
      vi.mocked(authProfileStoreModule.ensureAuthProfileStore).mockReturnValue({
>>>>>>> upstream/main
        version: 1,
        profiles: {
          "anthropic:work": {
            provider: "anthropic",
          },
        },
      } as never);

      await agentCommand(
        {
          message: "use a different provider once",
          sessionKey: "agent:main:subagent:temp-openai-run",
          provider: "openai",
          model: "gpt-4.1-mini",
        },
        runtime,
      );

      expectLastRunProviderModel("openai", "gpt-4.1-mini");
      expect(getLastEmbeddedCall()?.authProfileId).toBeUndefined();

      const savedAuth = readSessionStore<{
        authProfileOverride?: string;
        authProfileOverrideSource?: string;
        authProfileOverrideCompactionCount?: number;
      }>(store);
      expect(savedAuth["agent:main:subagent:temp-openai-run"]?.authProfileOverride).toBe(
        "anthropic:work",
      );
      expect(savedAuth["agent:main:subagent:temp-openai-run"]?.authProfileOverrideSource).toBe(
        "user",
      );
      expect(
        savedAuth["agent:main:subagent:temp-openai-run"]?.authProfileOverrideCompactionCount,
      ).toBe(2);

      await expect(
        agentCommand(
          {
            message: "use an invalid override",
            sessionKey: "agent:main:subagent:invalid-override",
            provider: "openai\u001b[31m",
            model: "gpt-4.1-mini",
          },
          runtime,
        ),
      ).rejects.toThrow("Provider override contains invalid control characters.");

      const parseModelRefSpy = vi.spyOn(modelSelectionModule, "parseModelRef");
      parseModelRefSpy.mockImplementationOnce(() => ({
        provider: "anthropic\u001b[31m",
        model: "claude-haiku-4-5\u001b[32m",
      }));
      mockConfig(home, store, {
        models: {
          "openai/gpt-4.1-mini": {},
        },
      });
      try {
        await expect(
          agentCommand(
            {
              message: "use disallowed override",
              sessionKey: "agent:main:subagent:sanitized-override-error",
              model: "claude-haiku-4-5",
            },
            runtime,
          ),
        ).rejects.toThrow(
          'Model override "anthropic/claude-haiku-4-5" is not allowed for agent "main".',
        );
      } finally {
        parseModelRefSpy.mockRestore();
      }
    });
  });

  it("passes resolved default thinking level to embedded runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, {
        model: { primary: "openai/gpt-4.1-mini" },
        models: {
          "anthropic/claude-opus-4-6": {},
          "openai/gpt-4.1-mini": {},
        },
      });
      mockModelCatalogOnce([
        {
          id: "gpt-4.1-mini",
          name: "GPT-4.1 Mini",
          provider: "openai",
          reasoning: true,
        },
      ]);

      await agentCommand({ message: "hi", to: "+1555" }, runtime);

      expect(getLastEmbeddedCall()?.thinkLevel).toBe("low");
      expectLastRunProviderModel("openai", "gpt-4.1-mini");
    });
  });

  it("passes routing context to embedded runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, undefined, undefined, [{ id: "ops" }]);

      await agentCommand(
        { message: "hi", agentId: "ops", replyChannel: "slack", thinking: "low" },
        runtime,
      );
      let callArgs = getLastEmbeddedCall();
      expect(callArgs?.sessionKey).toBe("agent:ops:main");
      expect(callArgs?.sessionFile).toContain(`${path.sep}agents${path.sep}ops${path.sep}sessions`);
      expect(callArgs?.messageChannel).toBe("slack");
      expect(runtime.log).toHaveBeenCalledWith("ok");

      await agentCommand(
        {
          message: "hi",
          to: "+1555",
          channel: "whatsapp",
          thinking: "low",
          runContext: { messageChannel: "slack", accountId: "acct-2" },
        },
        runtime,
      );
      callArgs = getLastEmbeddedCall();
      expect(callArgs?.messageChannel).toBe("slack");
      expect(callArgs?.agentAccountId).toBe("acct-2");

      await expect(agentCommand({ message: "hi", agentId: "ghost" }, runtime)).rejects.toThrow(
        'Unknown agent id "ghost"',
      );
    });
  });

<<<<<<< HEAD
  it("defaults thinking to low for reasoning-capable models", async () => {
    await expectDefaultThinkLevel({
      catalogEntry: {
        id: "claude-opus-4-6",
        name: "Opus 4.5",
        provider: "anthropic",
        reasoning: true,
      },
      expected: "low",
    });
  });

  it("defaults thinking to adaptive for Anthropic Claude 4.6 models", async () => {
    await expectDefaultThinkLevel({
      agentOverrides: {
        model: { primary: "anthropic/claude-opus-4-6" },
        models: { "anthropic/claude-opus-4-6": {} },
      },
      catalogEntry: {
        id: "claude-opus-4-6",
        name: "Opus 4.6",
        provider: "anthropic",
        reasoning: true,
      },
      expected: "adaptive",
    });
  });

  it("prefers per-model thinking over global thinkingDefault", async () => {
    await expectDefaultThinkLevel({
      agentOverrides: {
        thinkingDefault: "low",
        models: {
          "anthropic/claude-opus-4-6": {
            params: { thinking: "high" },
          },
        },
      },
      catalogEntry: {
        id: "claude-opus-4-6",
        name: "Opus 4.5",
        provider: "anthropic",
        reasoning: true,
      },
      expected: "high",
    });
  });

  it("prints JSON payload when requested", async () => {
    await withTempHome(async (home) => {
      vi.mocked(runEmbeddedPiAgent).mockResolvedValue(
        createDefaultAgentResult({
          payloads: [{ text: "json-reply", mediaUrl: "http://x.test/a.jpg" }],
          durationMs: 42,
        }),
      );
      const store = path.join(home, "sessions.json");
      mockConfig(home, store);

      await agentCommand({ message: "hi", to: "+1999", json: true }, runtime);

      const logged = (runtime.log as unknown as MockInstance).mock.calls.at(-1)?.[0] as string;
      const parsed = JSON.parse(logged) as {
        payloads: Array<{ text: string; mediaUrl?: string | null }>;
        meta: { durationMs: number };
      };
      expect(parsed.payloads[0].text).toBe("json-reply");
      expect(parsed.payloads[0].mediaUrl).toBe("http://x.test/a.jpg");
      expect(parsed.meta.durationMs).toBe(42);
    });
  });

  it("passes the message through as the agent prompt", async () => {
    const callArgs = await runEmbeddedWithTempConfig({
      args: { message: "ping", to: "+1333" },
    });
    expect(callArgs?.prompt).toBe("ping");
  });

  it("passes through telegram accountId when delivering", async () => {
=======
  it("uses explicit session keys for embedded runs", async () => {
>>>>>>> upstream/main
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, undefined, undefined, [{ id: "main" }, { id: "ops" }]);

      await agentCommand({ message: "hi", sessionKey: "agent:ops:incident-42" }, runtime);

      let callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("agent:ops:incident-42");
      expect(callArgs?.sessionFile).toContain(`${path.sep}agents${path.sep}ops${path.sep}sessions`);

      await agentCommand({ message: "hi", agentId: "ops", sessionKey: "incident-42" }, runtime);

      callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("agent:ops:incident-42");

      await agentCommand({ message: "hi", agentId: "ops", sessionKey: "global" }, runtime);

      callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("agent:ops:global");
      expect(callArgs?.sessionFile).toContain(`${path.sep}agents${path.sep}ops${path.sep}sessions`);
    });
  });

  it("scopes bare explicit session keys to the default agent for embedded runs", async () => {
    await withTempHome(async (home) => {
      const store = path.join(home, "sessions.json");
      mockConfig(home, store, undefined, undefined, [{ id: "ops", default: true }, { id: "main" }]);

      await agentCommand({ message: "hi", sessionKey: "incident-42" }, runtime);

      let callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("agent:ops:incident-42");

      await agentCommand({ message: "hi", sessionKey: "global" }, runtime);

      callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("global");
      expect(callArgs?.sessionFile).toContain(`${path.sep}agents${path.sep}ops${path.sep}sessions`);

      await agentCommand({ message: "hi", sessionKey: "unknown" }, runtime);

      callArgs = getLastEmbeddedCall();
      expect(callArgs?.agentId).toBe("ops");
      expect(callArgs?.sessionKey).toBe("unknown");
      expect(callArgs?.sessionFile).toContain(`${path.sep}agents${path.sep}ops${path.sep}sessions`);
    });
  });
});
