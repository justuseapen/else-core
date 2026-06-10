<<<<<<< HEAD
// Shared model/catalog helpers for provider plugins.
//
// Keep provider-owned exports out of this subpath so plugin loaders can import it
// without recursing through provider-specific facades.

import type { BedrockDiscoveryConfig, ModelDefinitionConfig } from "../config/types.models.js";
=======
// Provider model helpers normalize model catalog entries shared by provider plugins.
import { normalizeProviderId as normalizeProviderIdCore } from "@openclaw/model-catalog-core/provider-id";
import {
  normalizeAntigravityPreviewModelId as normalizeAntigravityPreviewModelIdCore,
  normalizeGooglePreviewModelId as normalizeGooglePreviewModelIdCore,
} from "@openclaw/model-catalog-core/provider-model-id-normalize";
>>>>>>> upstream/main
import {
  buildAnthropicReplayPolicyForModel,
  buildGoogleGeminiReplayPolicy,
  buildHybridAnthropicOrOpenAIReplayPolicy,
  buildNativeAnthropicReplayPolicyForModel,
  buildOpenAICompatibleReplayPolicy,
  buildPassthroughGeminiSanitizingReplayPolicy,
  buildStrictAnthropicReplayPolicy,
  resolveTaggedReasoningOutputMode,
  sanitizeGoogleGeminiReplayHistory,
} from "../plugins/provider-replay-helpers.js";
import type { ProviderPlugin } from "../plugins/types.js";
import type {
  ProviderReasoningOutputModeContext,
  ProviderReplayPolicyContext,
  ProviderSanitizeReplayHistoryContext,
<<<<<<< HEAD
} from "./plugin-entry.js";

export type { ModelApi, ModelProviderConfig } from "../config/types.models.js";
=======
  ProviderThinkingProfile,
} from "./plugin-entry.js";

export type {
  ModelApi,
  ModelProviderDeclarationConfig as ModelProviderConfig,
} from "../config/types.models.js";
export type {
  UnifiedModelCatalogEntry,
  UnifiedModelCatalogKind,
  UnifiedModelCatalogSource,
} from "@openclaw/model-catalog-core/model-catalog-types";
>>>>>>> upstream/main
export type {
  BedrockDiscoveryConfig,
  ModelCompatConfig,
  ModelDefinitionConfig,
} from "../config/types.models.js";
export type {
  ProviderEndpointClass,
  ProviderEndpointResolution,
} from "../agents/provider-attribution.js";
<<<<<<< HEAD
export type { ProviderPlugin } from "../plugins/types.js";
export type { KilocodeModelCatalogEntry } from "../plugins/provider-model-kilocode.js";

export { DEFAULT_CONTEXT_TOKENS } from "../agents/defaults.js";
=======
export type {
  ProviderPlugin,
  UnifiedModelCatalogProviderContext,
  UnifiedModelCatalogProviderPlugin,
} from "../plugins/types.js";

export { DEFAULT_CONTEXT_TOKENS } from "../agents/defaults.js";
export {
  GPT5_BEHAVIOR_CONTRACT,
  GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY,
  GPT5_FRIENDLY_PROMPT_OVERLAY,
  GPT5_HEARTBEAT_PROMPT_OVERLAY,
  isGpt5ModelId,
  normalizeGpt5PromptOverlayMode,
  renderGpt5PromptOverlay,
  resolveGpt5PromptOverlayMode,
  resolveGpt5SystemPromptContribution,
  type Gpt5PromptOverlayMode,
} from "../agents/gpt5-prompt-overlay.js";
>>>>>>> upstream/main
export { resolveProviderEndpoint } from "../agents/provider-attribution.js";
export {
  applyModelCompatPatch,
  hasToolSchemaProfile,
  hasNativeWebSearchTool,
  normalizeModelCompat,
  resolveUnsupportedToolSchemaKeywords,
  resolveToolCallArgumentsEncoding,
} from "../plugins/provider-model-compat.js";
<<<<<<< HEAD
export { normalizeProviderId } from "../agents/provider-id.js";
=======
>>>>>>> upstream/main
export {
  buildAnthropicReplayPolicyForModel,
  buildGoogleGeminiReplayPolicy,
  buildHybridAnthropicOrOpenAIReplayPolicy,
  buildNativeAnthropicReplayPolicyForModel,
  buildOpenAICompatibleReplayPolicy,
  buildPassthroughGeminiSanitizingReplayPolicy,
  resolveTaggedReasoningOutputMode,
  sanitizeGoogleGeminiReplayHistory,
  buildStrictAnthropicReplayPolicy,
};
<<<<<<< HEAD
export {
  createMoonshotThinkingWrapper,
  resolveMoonshotThinkingType,
} from "../agents/pi-embedded-runner/moonshot-thinking-stream-wrappers.js";
=======

/**
 * Normalizes provider ids for config, catalog, and plugin-registry matching.
 */
export function normalizeProviderId(
  /** Provider id from config, catalog, or plugin metadata. */
  provider: string,
): string {
  return normalizeProviderIdCore(provider);
}
export {
  createMoonshotThinkingWrapper,
  resolveMoonshotThinkingType,
} from "../llm/providers/stream-wrappers/moonshot-thinking.js";
>>>>>>> upstream/main
export {
  cloneFirstTemplateModel,
  matchesExactOrPrefix,
} from "../plugins/provider-model-helpers.js";
<<<<<<< HEAD

export function getModelProviderHint(modelId: string): string | null {
  const trimmed = modelId.trim().toLowerCase();
=======
import { normalizeOptionalLowercaseString } from "../../packages/normalization-core/src/string-coerce.js";

const CLAUDE_OPUS_48_MODEL_PREFIXES = ["claude-opus-4-8", "claude-opus-4.8"] as const;
const CLAUDE_OPUS_47_MODEL_PREFIXES = ["claude-opus-4-7", "claude-opus-4.7"] as const;
const CLAUDE_ADAPTIVE_THINKING_DEFAULT_MODEL_PREFIXES = [
  "claude-opus-4-6",
  "claude-opus-4.6",
  "claude-sonnet-4-6",
  "claude-sonnet-4.6",
] as const;
const BASE_CLAUDE_THINKING_LEVELS = [
  { id: "off" },
  { id: "minimal" },
  { id: "low" },
  { id: "medium" },
  { id: "high" },
] as const satisfies ProviderThinkingProfile["levels"];

function getModelProviderHint(modelId: string): string | null {
  const trimmed = normalizeOptionalLowercaseString(modelId);
  if (!trimmed) {
    return null;
  }
>>>>>>> upstream/main
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) {
    return null;
  }
  return trimmed.slice(0, slashIndex) || null;
}

<<<<<<< HEAD
export function isProxyReasoningUnsupportedModelHint(modelId: string): boolean {
  return getModelProviderHint(modelId) === "x-ai";
}

const ANTIGRAVITY_BARE_PRO_IDS = new Set(["gemini-3-pro", "gemini-3.1-pro", "gemini-3-1-pro"]);

export function normalizeGooglePreviewModelId(id: string): string {
  if (id === "gemini-3-pro") {
    return "gemini-3-pro-preview";
  }
  if (id === "gemini-3-flash") {
    return "gemini-3-flash-preview";
  }
  if (id === "gemini-3.1-pro") {
    return "gemini-3.1-pro-preview";
  }
  if (id === "gemini-3.1-flash-lite") {
    return "gemini-3.1-flash-lite-preview";
  }
  if (id === "gemini-3.1-flash" || id === "gemini-3.1-flash-preview") {
    return "gemini-3-flash-preview";
  }
  return id;
}

export function normalizeAntigravityPreviewModelId(id: string): string {
  if (ANTIGRAVITY_BARE_PRO_IDS.has(id)) {
    return `${id}-low`;
  }
  return id;
}

export function normalizeNativeXaiModelId(id: string): string {
  if (id === "grok-4-fast-reasoning") {
    return "grok-4-fast";
  }
  if (id === "grok-4-1-fast-reasoning") {
    return "grok-4-1-fast";
  }
  if (id === "grok-4.20-experimental-beta-0304-reasoning") {
    return "grok-4.20-beta-latest-reasoning";
  }
  if (id === "grok-4.20-experimental-beta-0304-non-reasoning") {
    return "grok-4.20-beta-latest-non-reasoning";
  }
  if (id === "grok-4.20-reasoning") {
    return "grok-4.20-beta-latest-reasoning";
  }
  if (id === "grok-4.20-non-reasoning") {
    return "grok-4.20-beta-latest-non-reasoning";
  }
  return id;
}

export type ProviderReplayFamily =
  | "openai-compatible"
  | "anthropic-by-model"
=======
/** @deprecated Proxy provider-owned model helper; do not use from third-party plugins. */
export function isProxyReasoningUnsupportedModelHint(
  /** Model id that may include a provider prefix such as `x-ai/model`. */
  modelId: string,
): boolean {
  return getModelProviderHint(modelId) === "x-ai";
}

function matchesClaudeModelPrefix(modelId: string, prefixes: readonly string[]): boolean {
  const lower = normalizeOptionalLowercaseString(modelId);
  return Boolean(lower && prefixes.some((prefix) => lower.startsWith(prefix)));
}

function isClaudeOpus47ModelId(modelId: string): boolean {
  return matchesClaudeModelPrefix(modelId, CLAUDE_OPUS_47_MODEL_PREFIXES);
}

function isClaudeOpus48ModelId(modelId: string): boolean {
  return matchesClaudeModelPrefix(modelId, CLAUDE_OPUS_48_MODEL_PREFIXES);
}

/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
export function isClaudeAdaptiveThinkingDefaultModelId(
  /** Claude model id to check against adaptive-thinking default families. */
  modelId: string,
): boolean {
  return matchesClaudeModelPrefix(modelId, CLAUDE_ADAPTIVE_THINKING_DEFAULT_MODEL_PREFIXES);
}

/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
export function resolveClaudeThinkingProfile(
  /** Claude model id used to choose available thinking levels and defaults. */
  modelId: string,
): ProviderThinkingProfile {
  if (isClaudeOpus48ModelId(modelId)) {
    return {
      levels: [...BASE_CLAUDE_THINKING_LEVELS, { id: "xhigh" }, { id: "adaptive" }, { id: "max" }],
      defaultLevel: "off",
    };
  }
  if (isClaudeOpus47ModelId(modelId)) {
    return {
      levels: [...BASE_CLAUDE_THINKING_LEVELS, { id: "xhigh" }, { id: "adaptive" }, { id: "max" }],
      defaultLevel: "off",
    };
  }
  if (isClaudeAdaptiveThinkingDefaultModelId(modelId)) {
    return {
      levels: [...BASE_CLAUDE_THINKING_LEVELS, { id: "adaptive" }],
      defaultLevel: "adaptive",
    };
  }
  return { levels: BASE_CLAUDE_THINKING_LEVELS };
}

/**
 * Normalizes Antigravity preview model ids to the canonical provider catalog form.
 */
export function normalizeAntigravityPreviewModelId(
  /** Antigravity preview model id from config or catalog data. */
  id: string,
): string {
  return normalizeAntigravityPreviewModelIdCore(id);
}

/**
 * Normalizes Google preview model ids to the canonical provider catalog form.
 */
export function normalizeGooglePreviewModelId(
  /** Google preview model id from config or catalog data. */
  id: string,
): string {
  return normalizeGooglePreviewModelIdCore(id);
}

/**
 * Shared replay-policy families reused by provider plugins with matching transcript semantics.
 */
export type ProviderReplayFamily =
  | "openai-compatible"
  | "anthropic-by-model"
  | "native-anthropic-by-model"
>>>>>>> upstream/main
  | "google-gemini"
  | "passthrough-gemini"
  | "hybrid-anthropic-openai";

type ProviderReplayFamilyHooks = Pick<
  ProviderPlugin,
  "buildReplayPolicy" | "sanitizeReplayHistory" | "resolveReasoningOutputMode"
>;

type BuildProviderReplayFamilyHooksOptions =
<<<<<<< HEAD
  | { family: "openai-compatible" }
  | { family: "anthropic-by-model" }
  | { family: "google-gemini" }
  | { family: "passthrough-gemini" }
  | {
      family: "hybrid-anthropic-openai";
      anthropicModelDropThinkingBlocks?: boolean;
    };

=======
  | {
      /** OpenAI-compatible transcript family using OpenAI-style tool calls. */
      family: "openai-compatible";
      /** Whether replay policy should rewrite tool call ids for provider compatibility. */
      sanitizeToolCallIds?: boolean;
      /** Whether replay policy should strip reasoning blocks from history. */
      dropReasoningFromHistory?: boolean;
    }
  | {
      /** Anthropic-style transcript policy selected by Claude model id. */
      family: "anthropic-by-model";
    }
  | {
      /** Native Anthropic transcript policy preserving Anthropic ids/signatures. */
      family: "native-anthropic-by-model";
    }
  | {
      /** Google Gemini transcript policy with Gemini replay sanitation hooks. */
      family: "google-gemini";
    }
  | {
      /** OpenAI-compatible transport carrying Gemini-style thought signatures. */
      family: "passthrough-gemini";
    }
  | {
      /** Family that switches between Anthropic and OpenAI-compatible replay by request context. */
      family: "hybrid-anthropic-openai";
      /** Whether Anthropic-model replay should drop thinking blocks in hybrid mode. */
      anthropicModelDropThinkingBlocks?: boolean;
    };

/**
 * Builds provider replay hooks for a known transcript/reasoning compatibility family.
 */
>>>>>>> upstream/main
export function buildProviderReplayFamilyHooks(
  options: BuildProviderReplayFamilyHooksOptions,
): ProviderReplayFamilyHooks {
  switch (options.family) {
<<<<<<< HEAD
    case "openai-compatible":
      return {
        buildReplayPolicy: (ctx: ProviderReplayPolicyContext) =>
          buildOpenAICompatibleReplayPolicy(ctx.modelApi),
      };
=======
    case "openai-compatible": {
      const policyOptions = {
        sanitizeToolCallIds: options.sanitizeToolCallIds,
        dropReasoningFromHistory: options.dropReasoningFromHistory,
      };
      return {
        buildReplayPolicy: (ctx: ProviderReplayPolicyContext) =>
          buildOpenAICompatibleReplayPolicy(ctx.modelApi, {
            ...policyOptions,
            modelId: ctx.modelId,
          }),
      };
    }
>>>>>>> upstream/main
    case "anthropic-by-model":
      return {
        buildReplayPolicy: ({ modelId }: ProviderReplayPolicyContext) =>
          buildAnthropicReplayPolicyForModel(modelId),
      };
<<<<<<< HEAD
=======
    case "native-anthropic-by-model":
      return {
        buildReplayPolicy: ({ modelId }: ProviderReplayPolicyContext) =>
          buildNativeAnthropicReplayPolicyForModel(modelId),
      };
>>>>>>> upstream/main
    case "google-gemini":
      return {
        buildReplayPolicy: () => buildGoogleGeminiReplayPolicy(),
        sanitizeReplayHistory: (ctx: ProviderSanitizeReplayHistoryContext) =>
          sanitizeGoogleGeminiReplayHistory(ctx),
        resolveReasoningOutputMode: (_ctx: ProviderReasoningOutputModeContext) =>
          resolveTaggedReasoningOutputMode(),
      };
    case "passthrough-gemini":
      return {
        buildReplayPolicy: ({ modelId }: ProviderReplayPolicyContext) =>
          buildPassthroughGeminiSanitizingReplayPolicy(modelId),
      };
    case "hybrid-anthropic-openai":
      return {
        buildReplayPolicy: (ctx: ProviderReplayPolicyContext) =>
          buildHybridAnthropicOrOpenAIReplayPolicy(ctx, {
            anthropicModelDropThinkingBlocks: options.anthropicModelDropThinkingBlocks,
          }),
      };
  }
<<<<<<< HEAD
}
=======
  throw new Error("Unsupported provider replay family");
}

/** @deprecated Provider-owned replay hook shortcut; use local provider hooks instead. */
export const OPENAI_COMPATIBLE_REPLAY_HOOKS = buildProviderReplayFamilyHooks({
  family: "openai-compatible",
});

/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
export const ANTHROPIC_BY_MODEL_REPLAY_HOOKS = buildProviderReplayFamilyHooks({
  family: "anthropic-by-model",
});

/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
export const NATIVE_ANTHROPIC_REPLAY_HOOKS = buildProviderReplayFamilyHooks({
  family: "native-anthropic-by-model",
});

/** @deprecated Google provider-owned replay hook shortcut; use local provider hooks instead. */
export const PASSTHROUGH_GEMINI_REPLAY_HOOKS = buildProviderReplayFamilyHooks({
  family: "passthrough-gemini",
});
>>>>>>> upstream/main
