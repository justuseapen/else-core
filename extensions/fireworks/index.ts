<<<<<<< HEAD
import type {
  ProviderResolveDynamicModelContext,
  ProviderRuntimeModel,
} from "openclaw/plugin-sdk/plugin-entry";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import {
  buildProviderReplayFamilyHooks,
  cloneFirstTemplateModel,
  DEFAULT_CONTEXT_TOKENS,
  normalizeModelCompat,
} from "openclaw/plugin-sdk/provider-model-shared";
=======
// Fireworks plugin entrypoint registers its OpenClaw integration.
import type { ProviderResolveDynamicModelContext } from "openclaw/plugin-sdk/plugin-entry";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import {
  cloneFirstTemplateModel,
  DEFAULT_CONTEXT_TOKENS,
  normalizeModelCompat,
  OPENAI_COMPATIBLE_REPLAY_HOOKS,
} from "openclaw/plugin-sdk/provider-model-shared";
import { isFireworksKimiModelId } from "./model-id.js";
>>>>>>> upstream/main
import { applyFireworksConfig, FIREWORKS_DEFAULT_MODEL_REF } from "./onboard.js";
import {
  buildFireworksProvider,
  FIREWORKS_BASE_URL,
  FIREWORKS_DEFAULT_CONTEXT_WINDOW,
  FIREWORKS_DEFAULT_MAX_TOKENS,
  FIREWORKS_DEFAULT_MODEL_ID,
} from "./provider-catalog.js";
<<<<<<< HEAD

const PROVIDER_ID = "fireworks";
const OPENAI_COMPATIBLE_REPLAY_HOOKS = buildProviderReplayFamilyHooks({
  family: "openai-compatible",
});

function resolveFireworksDynamicModel(
  ctx: ProviderResolveDynamicModelContext,
): ProviderRuntimeModel | undefined {
=======
import { wrapFireworksProviderStream } from "./stream.js";
import { resolveFireworksThinkingProfile } from "./thinking-policy.js";

const PROVIDER_ID = "fireworks";
function isFireworksGlmModelId(modelId: string): boolean {
  const normalized = modelId.trim().toLowerCase();
  const lastSegment = normalized.split("/").pop() ?? normalized;
  return /^glm[-_.]/.test(lastSegment);
}

function resolveFireworksDynamicInput(modelId: string): Array<"text" | "image"> {
  return isFireworksGlmModelId(modelId) ? ["text"] : ["text", "image"];
}

function resolveFireworksDynamicModel(ctx: ProviderResolveDynamicModelContext) {
>>>>>>> upstream/main
  const modelId = ctx.modelId.trim();
  if (!modelId) {
    return undefined;
  }
<<<<<<< HEAD
=======
  const isKimiModel = isFireworksKimiModelId(modelId);
  const input = resolveFireworksDynamicInput(modelId);
>>>>>>> upstream/main

  return (
    cloneFirstTemplateModel({
      providerId: PROVIDER_ID,
      modelId,
      templateIds: [FIREWORKS_DEFAULT_MODEL_ID],
      ctx,
      patch: {
        provider: PROVIDER_ID,
<<<<<<< HEAD
=======
        reasoning: !isKimiModel,
        input,
>>>>>>> upstream/main
      },
    }) ??
    normalizeModelCompat({
      id: modelId,
      name: modelId,
      provider: PROVIDER_ID,
      api: "openai-completions",
      baseUrl: FIREWORKS_BASE_URL,
<<<<<<< HEAD
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: FIREWORKS_DEFAULT_CONTEXT_WINDOW,
      maxTokens: FIREWORKS_DEFAULT_MAX_TOKENS || DEFAULT_CONTEXT_TOKENS,
    } as ProviderRuntimeModel)
=======
      reasoning: !isKimiModel,
      input,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: FIREWORKS_DEFAULT_CONTEXT_WINDOW,
      maxTokens: FIREWORKS_DEFAULT_MAX_TOKENS || DEFAULT_CONTEXT_TOKENS,
    })
>>>>>>> upstream/main
  );
}

export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "Fireworks Provider",
  description: "Bundled Fireworks AI provider plugin",
  provider: {
    label: "Fireworks",
    aliases: ["fireworks-ai"],
    docsPath: "/providers/fireworks",
    auth: [
      {
        methodId: "api-key",
        label: "Fireworks API key",
        hint: "API key",
        optionKey: "fireworksApiKey",
        flagName: "--fireworks-api-key",
        envVar: "FIREWORKS_API_KEY",
        promptMessage: "Enter Fireworks API key",
        defaultModel: FIREWORKS_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyFireworksConfig(cfg),
      },
    ],
    catalog: {
      buildProvider: buildFireworksProvider,
      allowExplicitBaseUrl: true,
    },
    ...OPENAI_COMPATIBLE_REPLAY_HOOKS,
<<<<<<< HEAD
=======
    wrapStreamFn: wrapFireworksProviderStream,
    resolveThinkingProfile: ({ modelId }) => resolveFireworksThinkingProfile(modelId),
>>>>>>> upstream/main
    resolveDynamicModel: (ctx) => resolveFireworksDynamicModel(ctx),
    isModernModelRef: () => true,
  },
});
