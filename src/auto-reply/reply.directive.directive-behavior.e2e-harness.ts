/** E2E harness for reply directive behavior tests. */
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { afterEach, beforeEach, vi } from "vitest";
import { clearRuntimeAuthProfileStoreSnapshots } from "../agents/auth-profiles.js";
import { clearSessionStoreCacheForTest } from "../config/sessions.js";
import { resetSystemEventsForTest } from "../infra/system-events.js";
import { createEmptyPluginRegistry } from "../plugins/registry-empty.js";
import type { PluginProviderRegistration } from "../plugins/registry.js";
import { resetPluginRuntimeStateForTest, setActivePluginRegistry } from "../plugins/runtime.js";
import type { ProviderPlugin } from "../plugins/types.js";
<<<<<<< HEAD
=======
import { resetSkillsRefreshForTest } from "../skills/runtime/refresh.js";
>>>>>>> upstream/main
import {
  clearSessionAuthProfileOverrideMock,
  compactEmbeddedAgentSessionMock,
  loadModelCatalogMock,
  resolveCommandSecretRefsViaGatewayMock,
  resolveSessionAuthProfileOverrideMock,
  runDirectiveBehaviorReplyAgent,
  runEmbeddedAgentMock,
  runDirectiveBehaviorPreparedReply,
  runPreparedReplyMock,
  runReplyAgentMock,
} from "./reply.directive.directive-behavior.e2e-mocks.js";

const DEFAULT_TEST_MODEL_CATALOG: Array<{
  id: string;
  name: string;
  provider: string;
}> = [
  { id: "claude-opus-4-6", name: "Opus 4.5", provider: "anthropic" },
  { id: "claude-sonnet-4-1", name: "Sonnet 4.1", provider: "anthropic" },
  { id: "gpt-5.4", name: "GPT-5.4", provider: "openai" },
  { id: "gpt-5.4-pro", name: "GPT-5.4 Pro", provider: "openai" },
  { id: "gpt-5.4-mini", name: "GPT-5.4 Mini", provider: "openai" },
  { id: "gpt-5.4-nano", name: "GPT-5.4 Nano", provider: "openai" },
<<<<<<< HEAD
  { id: "gpt-5.4", name: "GPT-5.4 (Codex)", provider: "openai-codex" },
  { id: "gpt-5.4-mini", name: "GPT-5.4 Mini (Codex)", provider: "openai-codex" },
=======
  { id: "gpt-5.4", name: "GPT-5.4 (Codex)", provider: "openai" },
  { id: "gpt-5.4-pro", name: "GPT-5.4 Pro (Codex)", provider: "openai" },
  { id: "gpt-5.4-mini", name: "GPT-5.4 Mini (Codex)", provider: "openai" },
>>>>>>> upstream/main
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
];

const OPENAI_XHIGH_MODEL_IDS = [
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.4-mini",
  "gpt-5.4-nano",
  "gpt-5.2",
] as const;

<<<<<<< HEAD
const OPENAI_XHIGH_MODEL_IDS = [
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.4-mini",
  "gpt-5.4-nano",
  "gpt-5.2",
] as const;

const OPENAI_CODEX_XHIGH_MODEL_IDS = [
  "gpt-5.4",
=======
const OPENAI_CODEX_XHIGH_MODEL_IDS = [
  "gpt-5.4",
  "gpt-5.4-pro",
>>>>>>> upstream/main
  "gpt-5.4-mini",
  "gpt-5.3-codex",
  "gpt-5.3-codex-spark",
  "gpt-5.2-codex",
  "gpt-5.1-codex",
] as const;
<<<<<<< HEAD

function createThinkingPolicyProvider(
  providerId: string,
  xhighModelIds: readonly string[],
): ProviderPlugin {
  return {
    id: providerId,
    label: providerId,
    auth: [],
    supportsXHighThinking: ({ modelId }) => xhighModelIds.includes(modelId.trim().toLowerCase()),
  };
}

function createDirectiveBehaviorProviderRegistry(): ReturnType<typeof createEmptyPluginRegistry> {
  const registry = createEmptyPluginRegistry();
  const providers: PluginProviderRegistration[] = [
    {
      pluginId: "openai",
      pluginName: "OpenAI Provider",
      source: "test",
      provider: createThinkingPolicyProvider("openai", OPENAI_XHIGH_MODEL_IDS),
    },
    {
      pluginId: "openai",
      pluginName: "OpenAI Provider",
      source: "test",
      provider: createThinkingPolicyProvider("openai-codex", OPENAI_CODEX_XHIGH_MODEL_IDS),
    },
  ];
  registry.providers.push(...providers);
  return registry;
}

export function replyText(res: ReplyPayloadText | ReplyPayloadText[]): string | undefined {
  if (Array.isArray(res)) {
    return typeof res[0]?.text === "string" ? res[0]?.text : undefined;
  }
  return typeof res?.text === "string" ? res.text : undefined;
}
=======
>>>>>>> upstream/main

function createThinkingPolicyProvider(
  providerId: string,
  xhighModelIds: readonly string[],
): ProviderPlugin {
  return {
    id: providerId,
    label: providerId,
    auth: [],
    supportsXHighThinking: ({ modelId }) =>
      xhighModelIds.includes(normalizeLowercaseStringOrEmpty(modelId)),
  };
}

function createDirectiveBehaviorProviderRegistry(): ReturnType<typeof createEmptyPluginRegistry> {
  const registry = createEmptyPluginRegistry();
  const providers: PluginProviderRegistration[] = [
    {
      pluginId: "openai",
      pluginName: "OpenAI Provider",
      source: "test",
      provider: createThinkingPolicyProvider("openai", OPENAI_XHIGH_MODEL_IDS),
    },
    {
      pluginId: "openai",
      pluginName: "OpenAI Provider",
      source: "test",
      provider: createThinkingPolicyProvider("openai", OPENAI_CODEX_XHIGH_MODEL_IDS),
    },
<<<<<<< HEAD
  );
}

export function sessionStorePath(home: string): string {
  return path.join(home, "sessions.json");
}

export function makeWhatsAppDirectiveConfig(
  home: string,
  defaults: Record<string, unknown>,
  extra: Record<string, unknown> = {},
) {
  return {
    agents: {
      defaults: {
        workspace: path.join(home, "openclaw"),
        ...defaults,
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: sessionStorePath(home) },
    ...extra,
  };
}

export const AUTHORIZED_WHATSAPP_COMMAND = {
  From: "+1222",
  To: "+1222",
  Provider: "whatsapp",
  SenderE164: "+1222",
  CommandAuthorized: true,
} as const;

export function makeElevatedDirectiveConfig(home: string) {
  return makeWhatsAppDirectiveConfig(
    home,
    {
      model: "anthropic/claude-opus-4-6",
      elevatedDefault: "on",
    },
    {
      tools: {
        elevated: {
          allowFrom: { whatsapp: ["+1222"] },
        },
      },
      channels: { whatsapp: { allowFrom: ["+1222"] } },
      session: { store: sessionStorePath(home) },
    },
  );
}

export function assertModelSelection(
  storePath: string,
  selection: { model?: string; provider?: string } = {},
) {
  const store = loadSessionStore(storePath);
  const entry = store[MAIN_SESSION_KEY];
  expect(entry).toBeDefined();
  expect(entry?.modelOverride).toBe(selection.model);
  expect(entry?.providerOverride).toBe(selection.provider);
}

export function assertElevatedOffStatusReply(text: string | undefined) {
  expect(text).toContain("Elevated mode disabled.");
  const optionsLine = text?.split("\n").find((line) => line.trim().startsWith("⚙️"));
  expect(optionsLine).toBeTruthy();
  expect(optionsLine).not.toContain("elevated");
=======
  ];
  registry.providers.push(...providers);
  return registry;
>>>>>>> upstream/main
}

export function installDirectiveBehaviorE2EHooks() {
  beforeEach(async () => {
    await resetSkillsRefreshForTest();
    clearRuntimeAuthProfileStoreSnapshots();
    clearSessionStoreCacheForTest();
    resetSystemEventsForTest();
    resetPluginRuntimeStateForTest();
    setActivePluginRegistry(createDirectiveBehaviorProviderRegistry());
<<<<<<< HEAD
    runEmbeddedPiAgentMock.mockReset();
=======
    compactEmbeddedAgentSessionMock.mockReset();
    compactEmbeddedAgentSessionMock.mockResolvedValue({ payloads: [], meta: {} });
    runEmbeddedAgentMock.mockReset();
>>>>>>> upstream/main
    loadModelCatalogMock.mockReset();
    loadModelCatalogMock.mockResolvedValue(DEFAULT_TEST_MODEL_CATALOG);
    resolveCommandSecretRefsViaGatewayMock.mockReset();
    resolveCommandSecretRefsViaGatewayMock.mockImplementation(async ({ config }) => ({
      resolvedConfig: config,
      diagnostics: [],
      targetStatesByPath: {},
      hadUnresolvedTargets: false,
    }));
    clearSessionAuthProfileOverrideMock.mockReset();
    clearSessionAuthProfileOverrideMock.mockResolvedValue(undefined);
    resolveSessionAuthProfileOverrideMock.mockReset();
    resolveSessionAuthProfileOverrideMock.mockResolvedValue(undefined);
    runReplyAgentMock.mockReset();
    runReplyAgentMock.mockImplementation(runDirectiveBehaviorReplyAgent);
    runPreparedReplyMock.mockReset();
    runPreparedReplyMock.mockImplementation(runDirectiveBehaviorPreparedReply);
  });

  afterEach(async () => {
    await resetSkillsRefreshForTest();
    clearRuntimeAuthProfileStoreSnapshots();
    clearSessionStoreCacheForTest();
    resetSystemEventsForTest();
    resetPluginRuntimeStateForTest();
    vi.restoreAllMocks();
  });
}
<<<<<<< HEAD

export function installFreshDirectiveBehaviorReplyMocks(params?: {
  onActualRunPreparedReply?: (runPreparedReply: RunPreparedReply) => void;
  runPreparedReply?: (...args: Parameters<RunPreparedReply>) => unknown;
}) {
  vi.doMock("../agents/pi-embedded.js", () => ({
    abortEmbeddedPiRun: vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: (...args: unknown[]) => runEmbeddedPiAgentMock(...args),
    queueEmbeddedPiMessage: vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: (key: string) => `session:${key.trim() || "main"}`,
    isEmbeddedPiRunActive: vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vi.fn().mockReturnValue(false),
  }));
  vi.doMock("../agents/model-catalog.js", () => ({
    loadModelCatalog: loadModelCatalogMock,
  }));
  if (params?.runPreparedReply || params?.onActualRunPreparedReply) {
    vi.doMock("./reply/get-reply-run.js", async () => {
      const actual = await vi.importActual<typeof import("./reply/get-reply-run.js")>(
        "./reply/get-reply-run.js",
      );
      params.onActualRunPreparedReply?.(actual.runPreparedReply);
      return {
        ...actual,
        runPreparedReply: (...args: Parameters<RunPreparedReply>) =>
          params.runPreparedReply?.(...args),
      };
    });
  }
}

export function makeRestrictedElevatedDisabledConfig(home: string) {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-6",
        workspace: path.join(home, "openclaw"),
      },
      list: [
        {
          id: "restricted",
          tools: {
            elevated: { enabled: false },
          },
        },
      ],
    },
    tools: {
      elevated: {
        allowFrom: { whatsapp: ["+1222"] },
      },
    },
    channels: { whatsapp: { allowFrom: ["+1222"] } },
    session: { store: path.join(home, "sessions.json") },
  } as const;
}
=======
>>>>>>> upstream/main
