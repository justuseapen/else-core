<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";

const DISABLED_BUNDLED_CHANNELS = Object.freeze({
  bluebubbles: { enabled: false },
  discord: { enabled: false },
  feishu: { enabled: false },
  googlechat: { enabled: false },
  imessage: { enabled: false },
  irc: { enabled: false },
  line: { enabled: false },
  mattermost: { enabled: false },
  matrix: { enabled: false },
  msteams: { enabled: false },
  qqbot: { enabled: false },
  signal: { enabled: false },
  slack: { enabled: false },
  "synology-chat": { enabled: false },
  telegram: { enabled: false },
  tlon: { enabled: false },
  whatsapp: { enabled: false },
  zalo: { enabled: false },
  zalouser: { enabled: false },
} satisfies Record<string, { enabled: false }>);
=======
// Qa Lab helper module supports qa gateway config behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import {
  defaultQaModelForMode,
  normalizeQaProviderMode,
  splitQaModelRef,
  type QaProviderMode,
} from "./model-selection.js";
import { getQaProvider } from "./providers/index.js";
import { DEFAULT_QA_PROVIDER_MODE } from "./providers/index.js";
import type { QaThinkingLevel } from "./qa-thinking.js";
import type { QaTransportGatewayConfig } from "./qa-transport.js";

export { normalizeQaThinkingLevel, type QaThinkingLevel } from "./qa-thinking.js";

export const DEFAULT_QA_CONTROL_UI_ALLOWED_ORIGINS = Object.freeze([
  "http://127.0.0.1:18789",
  "http://localhost:18789",
  "http://127.0.0.1:43124",
  "http://localhost:43124",
]);

export const QA_BASE_RUNTIME_PLUGIN_IDS = Object.freeze(["acpx", "memory-core"]);

export function mergeQaControlUiAllowedOrigins(extraOrigins?: string[]) {
  const normalizedExtra = (extraOrigins ?? [])
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  return uniqueStrings([...DEFAULT_QA_CONTROL_UI_ALLOWED_ORIGINS, ...normalizedExtra]);
}

function normalizeQaGatewayModelRef(input: string | undefined, fallback: string) {
  const model = input?.trim();
  return model && model.length > 0 ? model : fallback;
}

function buildQaModelSelection(primaryModel: string, alternateModel: string) {
  const fallbacks = alternateModel !== primaryModel ? [alternateModel] : undefined;
  return fallbacks ? { primary: primaryModel, fallbacks } : { primary: primaryModel };
}
>>>>>>> upstream/main

export function buildQaGatewayConfig(params: {
  bind: "loopback" | "lan";
  gatewayPort: number;
  gatewayToken: string;
  providerBaseUrl?: string;
<<<<<<< HEAD
  qaBusBaseUrl: string;
=======
>>>>>>> upstream/main
  workspaceDir: string;
  controlUiRoot?: string;
  controlUiAllowedOrigins?: string[];
  controlUiEnabled?: boolean;
<<<<<<< HEAD
  providerMode?: "mock-openai" | "live-openai";
  primaryModel?: string;
  alternateModel?: string;
  fastMode?: boolean;
}): OpenClawConfig {
  const mockProviderBaseUrl = params.providerBaseUrl ?? "http://127.0.0.1:44080/v1";
  const mockOpenAiProvider: ModelProviderConfig = {
    baseUrl: mockProviderBaseUrl,
    apiKey: "test",
    api: "openai-responses",
    models: [
      {
        id: "gpt-5.4",
        name: "gpt-5.4",
        api: "openai-responses",
        reasoning: false,
        input: ["text", "image"],
        cost: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow: 128_000,
        maxTokens: 4096,
      },
      {
        id: "gpt-5.4-alt",
        name: "gpt-5.4-alt",
        api: "openai-responses",
        reasoning: false,
        input: ["text", "image"],
        cost: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow: 128_000,
        maxTokens: 4096,
      },
      {
        id: "gpt-image-1",
        name: "gpt-image-1",
        api: "openai-responses",
        reasoning: false,
        input: ["text"],
        cost: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow: 128_000,
        maxTokens: 4096,
      },
    ],
  };
  const providerMode = params.providerMode ?? "mock-openai";
  const allowedPlugins =
    providerMode === "live-openai"
      ? ["memory-core", "openai", "qa-channel"]
      : ["memory-core", "qa-channel"];
  const primaryModel =
    params.primaryModel ??
    (providerMode === "live-openai" ? "openai/gpt-5.4" : "mock-openai/gpt-5.4");
  const alternateModel =
    params.alternateModel ??
    (providerMode === "live-openai" ? "openai/gpt-5.4" : "mock-openai/gpt-5.4-alt");
  const imageGenerationModelRef =
    providerMode === "live-openai" ? "openai/gpt-image-1" : "mock-openai/gpt-image-1";
  const liveModelParams =
    providerMode === "live-openai"
      ? {
          transport: "sse",
          openaiWsWarmup: false,
          ...(params.fastMode ? { fastMode: true } : {}),
        }
      : {
          transport: "sse",
          openaiWsWarmup: false,
        };
  const allowedOrigins =
    params.controlUiAllowedOrigins && params.controlUiAllowedOrigins.length > 0
      ? params.controlUiAllowedOrigins
      : [
          "http://127.0.0.1:18789",
          "http://localhost:18789",
          "http://127.0.0.1:43124",
          "http://localhost:43124",
        ];
=======
  providerMode?: QaProviderMode;
  primaryModel?: string;
  alternateModel?: string;
  imageGenerationModel?: string | null;
  enabledProviderIds?: string[];
  enabledPluginIds?: string[];
  transportPluginIds?: readonly string[];
  transportConfig?: QaTransportGatewayConfig;
  liveProviderConfigs?: Record<string, ModelProviderConfig>;
  fastMode?: boolean;
  thinkingDefault?: QaThinkingLevel;
}): OpenClawConfig {
  const providerBaseUrl = params.providerBaseUrl ?? "http://127.0.0.1:44080/v1";
  const providerMode = normalizeQaProviderMode(params.providerMode ?? DEFAULT_QA_PROVIDER_MODE);
  const provider = getQaProvider(providerMode);
  const primaryModel = normalizeQaGatewayModelRef(
    params.primaryModel,
    defaultQaModelForMode(providerMode),
  );
  const alternateModel = normalizeQaGatewayModelRef(
    params.alternateModel,
    defaultQaModelForMode(providerMode, { alternate: true }),
  );
  const modelProviderIds = [primaryModel, alternateModel]
    .map((ref) => splitQaModelRef(ref)?.provider)
    .filter((providerValue): providerValue is string => Boolean(providerValue));
  const imageGenerationModelRef =
    params.imageGenerationModel !== undefined
      ? params.imageGenerationModel
      : provider.defaultImageGenerationModel({ modelProviderIds });
  const selectedProviderIds = provider.usesModelProviderPlugins
    ? [
        ...new Set(
          [...(params.enabledProviderIds ?? []), ...modelProviderIds, imageGenerationModelRef]
            .map((value) =>
              typeof value === "string" ? (splitQaModelRef(value)?.provider ?? value) : null,
            )
            .filter((providerLocal): providerLocal is string => Boolean(providerLocal)),
        ),
      ]
    : [];
  const selectedPluginIds = provider.usesModelProviderPlugins
    ? uniqueStrings(
        (params.enabledPluginIds?.length ?? 0) > 0
          ? (params.enabledPluginIds ?? [])
          : selectedProviderIds,
      )
    : uniqueStrings(
        (params.enabledPluginIds ?? [])
          .map((pluginId) => pluginId.trim())
          .filter((pluginId) => pluginId.length > 0),
      );
  const transportPluginIds = uniqueStrings(params.transportPluginIds ?? [])
    .map((pluginId) => pluginId.trim())
    .filter((pluginId) => pluginId.length > 0);
  const pluginEntries = Object.fromEntries(
    selectedPluginIds.map((pluginId) => [pluginId, { enabled: true }]),
  );
  const transportPluginEntries = Object.fromEntries(
    transportPluginIds.map((pluginId) => [pluginId, { enabled: true }]),
  );
  const allowedPlugins = [
    ...new Set([...QA_BASE_RUNTIME_PLUGIN_IDS, ...selectedPluginIds, ...transportPluginIds]),
  ];
  const resolveModelParams = (modelRef: string) =>
    provider.resolveModelParams({
      modelRef,
      fastMode: params.fastMode,
      thinkingDefault: params.thinkingDefault,
    });
  const allowedOrigins = mergeQaControlUiAllowedOrigins(params.controlUiAllowedOrigins);
  const gatewayModels = provider.buildGatewayModels({
    providerBaseUrl,
    liveProviderConfigs: params.liveProviderConfigs,
  });
>>>>>>> upstream/main

  return {
    plugins: {
      allow: allowedPlugins,
<<<<<<< HEAD
      entries: {
        acpx: {
          enabled: false,
=======
      slots: {
        memory: "memory-core",
      },
      entries: {
        acpx: {
          enabled: true,
          config: {
            pluginToolsMcpBridge: true,
            openClawToolsMcpBridge: true,
          },
>>>>>>> upstream/main
        },
        "memory-core": {
          enabled: true,
        },
<<<<<<< HEAD
        ...(providerMode === "live-openai"
          ? {
              openai: {
                enabled: true,
              },
            }
          : {}),
=======
        ...pluginEntries,
        ...transportPluginEntries,
>>>>>>> upstream/main
      },
    },
    agents: {
      defaults: {
        workspace: params.workspaceDir,
<<<<<<< HEAD
        model: {
          primary: primaryModel,
        },
        imageGenerationModel: {
          primary: imageGenerationModelRef,
        },
=======
        model: buildQaModelSelection(primaryModel, alternateModel),
        ...(imageGenerationModelRef
          ? {
              imageGenerationModel: {
                primary: imageGenerationModelRef,
              },
            }
          : {}),
        ...(params.thinkingDefault ? { thinkingDefault: params.thinkingDefault } : {}),
>>>>>>> upstream/main
        memorySearch: {
          sync: {
            watch: true,
            watchDebounceMs: 25,
            onSessionStart: true,
            onSearch: true,
          },
        },
        models: {
          [primaryModel]: {
<<<<<<< HEAD
            params: liveModelParams,
          },
          [alternateModel]: {
            params: liveModelParams,
=======
            params: resolveModelParams(primaryModel),
          },
          [alternateModel]: {
            params: resolveModelParams(alternateModel),
>>>>>>> upstream/main
          },
        },
        subagents: {
          allowAgents: ["*"],
          maxConcurrent: 2,
        },
      },
      list: [
        {
          id: "qa",
          default: true,
<<<<<<< HEAD
          model: {
            primary: primaryModel,
          },
=======
          model: buildQaModelSelection(primaryModel, alternateModel),
>>>>>>> upstream/main
          identity: {
            name: "C-3PO QA",
            theme: "Flustered Protocol Droid",
            emoji: "🤖",
            avatar: "avatars/c3po.png",
          },
          subagents: {
            allowAgents: ["*"],
          },
<<<<<<< HEAD
=======
          tools: {
            profile: "coding",
          },
>>>>>>> upstream/main
        },
      ],
    },
    memory: {
      backend: "builtin",
    },
<<<<<<< HEAD
    ...(providerMode === "mock-openai"
      ? {
          models: {
            mode: "replace",
            providers: {
              "mock-openai": mockOpenAiProvider,
            },
=======
    tools: {
      // The parity scenarios are code-agent contracts: they must always expose
      // file, image, memory, and subagent tools even when the surrounding
      // environment defaults to a messaging-only profile.
      profile: "coding",
    },
    ...(gatewayModels
      ? {
          models: {
            mode: gatewayModels.mode,
            providers: gatewayModels.providers,
>>>>>>> upstream/main
          },
        }
      : {}),
    gateway: {
      mode: "local",
      bind: params.bind,
      port: params.gatewayPort,
      auth: {
        mode: "token",
        token: params.gatewayToken,
      },
<<<<<<< HEAD
=======
      reload: {
        // QA restart scenarios need deterministic reload timing instead of the
        // much longer production deferral window.
        deferralTimeoutMs: 1_000,
      },
>>>>>>> upstream/main
      controlUi: {
        enabled: params.controlUiEnabled ?? true,
        ...((params.controlUiEnabled ?? true) && params.controlUiRoot
          ? { root: params.controlUiRoot }
          : {}),
        ...((params.controlUiEnabled ?? true)
          ? {
              allowInsecureAuth: true,
              allowedOrigins,
            }
          : {}),
      },
    },
    discovery: {
      mdns: {
        mode: "off",
      },
    },
<<<<<<< HEAD
    channels: {
      ...DISABLED_BUNDLED_CHANNELS,
      "qa-channel": {
        enabled: true,
        baseUrl: params.qaBusBaseUrl,
        botUserId: "openclaw",
        botDisplayName: "OpenClaw QA",
        allowFrom: ["*"],
        pollTimeoutMs: 250,
      },
    },
    messages: {
      groupChat: {
        mentionPatterns: ["\\b@?openclaw\\b"],
      },
    },
=======
    ...(params.transportConfig?.channels ? { channels: params.transportConfig.channels } : {}),
    ...(params.transportConfig?.messages ? { messages: params.transportConfig.messages } : {}),
>>>>>>> upstream/main
  } satisfies OpenClawConfig;
}
