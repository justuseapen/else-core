<<<<<<< HEAD
import type { StreamFn } from "@mariozechner/pi-agent-core";
import {
  createGoogleThinkingPayloadWrapper,
  sanitizeGoogleThinkingPayload,
} from "../agents/pi-embedded-runner/google-stream-wrappers.js";
import { createMinimaxFastModeWrapper } from "../agents/pi-embedded-runner/minimax-stream-wrappers.js";
import {
  createMoonshotThinkingWrapper,
  resolveMoonshotThinkingType,
} from "../agents/pi-embedded-runner/moonshot-thinking-stream-wrappers.js";
=======
// Provider stream helpers expose shared wrapper families and payload transforms for provider plugins.
import { createGoogleThinkingPayloadWrapper } from "../llm/providers/stream-wrappers/google.js";
import { createMinimaxFastModeWrapper } from "../llm/providers/stream-wrappers/minimax.js";
import { resolveMoonshotThinkingKeep } from "../llm/providers/stream-wrappers/moonshot-thinking.js";
>>>>>>> upstream/main
import {
  createCodexNativeWebSearchWrapper,
  createOpenAIAttributionHeadersWrapper,
  createOpenAIFastModeWrapper,
  createOpenAIReasoningCompatibilityWrapper,
  createOpenAIResponsesContextManagementWrapper,
  createOpenAIServiceTierWrapper,
<<<<<<< HEAD
  createOpenAITextVerbosityWrapper,
  resolveOpenAIFastMode,
  resolveOpenAIServiceTier,
  resolveOpenAITextVerbosity,
} from "../agents/pi-embedded-runner/openai-stream-wrappers.js";
import {
  createKilocodeWrapper,
  createOpenRouterSystemCacheWrapper,
  createOpenRouterWrapper,
  isProxyReasoningUnsupported,
} from "../agents/pi-embedded-runner/proxy-stream-wrappers.js";
import {
  createToolStreamWrapper,
  createZaiToolStreamWrapper,
} from "../agents/pi-embedded-runner/zai-stream-wrappers.js";
import type { ProviderPlugin } from "../plugins/types.js";
import type { ProviderWrapStreamFnContext } from "./plugin-entry.js";

export type ProviderStreamWrapperFactory =
  | ((streamFn: StreamFn | undefined) => StreamFn | undefined)
  | null
  | undefined
  | false;

export function composeProviderStreamWrappers(
  baseStreamFn: StreamFn | undefined,
  ...wrappers: ProviderStreamWrapperFactory[]
): StreamFn | undefined {
  return wrappers.reduce(
    (streamFn, wrapper) => (wrapper ? wrapper(streamFn) : streamFn),
    baseStreamFn,
  );
}

export type ProviderStreamFamily =
  | "google-thinking"
  | "kilocode-thinking"
  | "moonshot-thinking"
  | "minimax-fast-mode"
  | "openai-responses-defaults"
  | "openrouter-thinking"
=======
  createOpenAIStringContentWrapper,
  createOpenAITextVerbosityWrapper,
  createOpenAIThinkingLevelWrapper,
  resolveOpenAIFastMode,
  resolveOpenAIServiceTier,
  resolveOpenAITextVerbosity,
} from "../llm/providers/stream-wrappers/openai.js";
import {
  createKilocodeWrapper,
  createOpenRouterWrapper,
  isProxyReasoningUnsupported,
} from "../llm/providers/stream-wrappers/proxy.js";
import type { ProviderPlugin } from "../plugins/types.js";
import type { ProviderWrapStreamFnContext } from "./plugin-entry.js";
import {
  createMoonshotThinkingWrapper,
  createToolStreamWrapper,
  resolveMoonshotThinkingType,
} from "./provider-stream-shared.js";
export {
  applyAnthropicEphemeralCacheControlMarkers,
  applyAnthropicPayloadPolicyToParams,
  composeProviderStreamWrappers,
  createAnthropicThinkingPrefillPayloadWrapper,
  createMoonshotThinkingWrapper,
  createPlainTextToolCallCompatWrapper,
  createToolStreamWrapper,
  createZaiToolStreamWrapper,
  defaultToolStreamExtraParams,
  isOpenAICompatibleThinkingEnabled,
  type ProviderStreamWrapperFactory,
  resolveAnthropicPayloadPolicy,
  resolveMoonshotThinkingType,
  streamWithPayloadPatch,
  stripTrailingAnthropicAssistantPrefillWhenThinking,
} from "./provider-stream-shared.js";

/** Named stream-wrapper bundles that provider plugins can opt into without duplicating policy. */
export type ProviderStreamFamily =
  /** Applies Google thinking-level payload normalization. */
  | "google-thinking"
  /** Applies Kilocode proxy reasoning payload normalization. */
  | "kilocode-thinking"
  /** Applies Moonshot thinking type/keep normalization. */
  | "moonshot-thinking"
  /** Enables MiniMax high-speed model routing when requested. */
  | "minimax-fast-mode"
  /** Applies the default OpenAI Responses wrapper stack. */
  | "openai-responses-defaults"
  /** Applies OpenRouter proxy reasoning payload normalization. */
  | "openrouter-thinking"
  /** Enables tool-call event streaming unless explicitly disabled. */
>>>>>>> upstream/main
  | "tool-stream-default-on";

type ProviderStreamFamilyHooks = Pick<ProviderPlugin, "wrapStreamFn">;

<<<<<<< HEAD
export function buildProviderStreamFamilyHooks(
=======
/** Builds provider hook objects for one supported stream-wrapper family. */
export function buildProviderStreamFamilyHooks(
  /**
   * Family key selecting the exact wrapper bundle to attach to a provider.
   */
>>>>>>> upstream/main
  family: ProviderStreamFamily,
): ProviderStreamFamilyHooks {
  switch (family) {
    case "google-thinking":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) =>
          createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel),
      };
    case "moonshot-thinking":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) => {
          const thinkingType = resolveMoonshotThinkingType({
            configuredThinking: ctx.extraParams?.thinking,
            thinkingLevel: ctx.thinkingLevel,
          });
<<<<<<< HEAD
          return createMoonshotThinkingWrapper(ctx.streamFn, thinkingType);
=======
          const thinkingKeep = resolveMoonshotThinkingKeep({
            configuredThinking: ctx.extraParams?.thinking,
          });
          return createMoonshotThinkingWrapper(ctx.streamFn, thinkingType, thinkingKeep);
>>>>>>> upstream/main
        },
      };
    case "kilocode-thinking":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) => {
          const thinkingLevel =
            ctx.modelId === "kilo/auto" || isProxyReasoningUnsupported(ctx.modelId)
              ? undefined
              : ctx.thinkingLevel;
          return createKilocodeWrapper(ctx.streamFn, thinkingLevel);
        },
      };
    case "minimax-fast-mode":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) =>
          createMinimaxFastModeWrapper(ctx.streamFn, ctx.extraParams?.fastMode === true),
      };
    case "openai-responses-defaults":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) => {
<<<<<<< HEAD
=======
          // Wrapper order is observable: header/default params must be in place
          // before payload-shape and context-management compatibility rewrites.
>>>>>>> upstream/main
          let nextStreamFn = createOpenAIAttributionHeadersWrapper(ctx.streamFn);

          if (resolveOpenAIFastMode(ctx.extraParams)) {
            nextStreamFn = createOpenAIFastModeWrapper(nextStreamFn);
          }

          const serviceTier = resolveOpenAIServiceTier(ctx.extraParams);
          if (serviceTier) {
            nextStreamFn = createOpenAIServiceTierWrapper(nextStreamFn, serviceTier);
          }

          const textVerbosity = resolveOpenAITextVerbosity(ctx.extraParams);
          if (textVerbosity) {
            nextStreamFn = createOpenAITextVerbosityWrapper(nextStreamFn, textVerbosity);
          }

          nextStreamFn = createCodexNativeWebSearchWrapper(nextStreamFn, {
            config: ctx.config,
            agentDir: ctx.agentDir,
<<<<<<< HEAD
          });
          return createOpenAIResponsesContextManagementWrapper(
            createOpenAIReasoningCompatibilityWrapper(nextStreamFn),
=======
            agentId: ctx.agentId,
            nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy,
          });
          nextStreamFn = createOpenAIStringContentWrapper(nextStreamFn);
          return createOpenAIResponsesContextManagementWrapper(
            createOpenAIReasoningCompatibilityWrapper(
              createOpenAIThinkingLevelWrapper(nextStreamFn, ctx.thinkingLevel),
            ),
>>>>>>> upstream/main
            ctx.extraParams,
          );
        },
      };
    case "openrouter-thinking":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) => {
          const thinkingLevel =
            ctx.modelId === "auto" || isProxyReasoningUnsupported(ctx.modelId)
              ? undefined
              : ctx.thinkingLevel;
<<<<<<< HEAD
          return createOpenRouterWrapper(ctx.streamFn, thinkingLevel);
=======
          return createOpenRouterWrapper(ctx.streamFn, thinkingLevel, ctx.extraParams);
>>>>>>> upstream/main
        },
      };
    case "tool-stream-default-on":
      return {
        wrapStreamFn: (ctx: ProviderWrapStreamFnContext) =>
          createToolStreamWrapper(ctx.streamFn, ctx.extraParams?.tool_stream !== false),
      };
  }
<<<<<<< HEAD
}

// Public stream-wrapper helpers for provider plugins.

export {
  applyAnthropicPayloadPolicyToParams,
  resolveAnthropicPayloadPolicy,
} from "../agents/anthropic-payload-policy.js";
export {
  buildCopilotDynamicHeaders,
  hasCopilotVisionInput,
} from "../agents/copilot-dynamic-headers.js";
export { applyAnthropicEphemeralCacheControlMarkers } from "../agents/pi-embedded-runner/anthropic-cache-control-payload.js";
export {
  createAnthropicToolPayloadCompatibilityWrapper,
  createOpenAIAnthropicToolPayloadCompatibilityWrapper,
} from "../agents/pi-embedded-runner/anthropic-family-tool-payload-compat.js";
export {
  createBedrockNoCacheWrapper,
  isAnthropicBedrockModel,
} from "../agents/pi-embedded-runner/bedrock-stream-wrappers.js";
=======
  throw new Error("Unsupported provider stream family");
}

/** @deprecated Google provider-owned stream hook shortcut; use local provider hooks instead. */
export const GOOGLE_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("google-thinking");
/** @deprecated Kilocode provider-owned stream hook shortcut; use local provider hooks instead. */
export const KILOCODE_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("kilocode-thinking");
/** @deprecated Moonshot provider-owned stream hook shortcut; use local provider hooks instead. */
export const MOONSHOT_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("moonshot-thinking");
/** @deprecated MiniMax provider-owned stream hook shortcut; use local provider hooks instead. */
export const MINIMAX_FAST_MODE_STREAM_HOOKS = buildProviderStreamFamilyHooks("minimax-fast-mode");
/** @deprecated OpenAI provider-owned stream hook shortcut; use local provider hooks instead. */
export const OPENAI_RESPONSES_STREAM_HOOKS = buildProviderStreamFamilyHooks(
  "openai-responses-defaults",
);
/** @deprecated OpenRouter provider-owned stream hook shortcut; use local provider hooks instead. */
export const OPENROUTER_THINKING_STREAM_HOOKS =
  buildProviderStreamFamilyHooks("openrouter-thinking");
/** @deprecated Provider-owned stream hook shortcut; use local provider hooks instead. */
export const TOOL_STREAM_DEFAULT_ON_HOOKS =
  buildProviderStreamFamilyHooks("tool-stream-default-on");

// Public stream-wrapper helpers for provider plugins.

export {
  createAnthropicToolPayloadCompatibilityWrapper,
  createOpenAIAnthropicToolPayloadCompatibilityWrapper,
} from "../llm/providers/stream-wrappers/anthropic-family-tool-payload-compat.js";
>>>>>>> upstream/main
export {
  createGoogleThinkingPayloadWrapper,
  sanitizeGoogleThinkingPayload,
} from "../llm/providers/stream-wrappers/google.js";
export {
  createKilocodeWrapper,
  createOpenRouterSystemCacheWrapper,
  createOpenRouterWrapper,
  isProxyReasoningUnsupported,
<<<<<<< HEAD
} from "../agents/pi-embedded-runner/proxy-stream-wrappers.js";
export { createMinimaxFastModeWrapper } from "../agents/pi-embedded-runner/minimax-stream-wrappers.js";
export {
  createMoonshotThinkingWrapper,
  resolveMoonshotThinkingType,
} from "../agents/pi-embedded-runner/moonshot-thinking-stream-wrappers.js";
=======
} from "../llm/providers/stream-wrappers/proxy.js";
export { createMinimaxFastModeWrapper } from "../llm/providers/stream-wrappers/minimax.js";
>>>>>>> upstream/main
export {
  createOpenAIAttributionHeadersWrapper,
  createCodexNativeWebSearchWrapper,
  createOpenAIDefaultTransportWrapper,
  createOpenAIFastModeWrapper,
  createOpenAIReasoningCompatibilityWrapper,
  createOpenAIResponsesContextManagementWrapper,
  createOpenAIServiceTierWrapper,
  createOpenAITextVerbosityWrapper,
  resolveOpenAIFastMode,
  resolveOpenAIServiceTier,
  resolveOpenAITextVerbosity,
<<<<<<< HEAD
} from "../agents/pi-embedded-runner/openai-stream-wrappers.js";
export { streamWithPayloadPatch } from "../agents/pi-embedded-runner/stream-payload-utils.js";
export { createToolStreamWrapper, createZaiToolStreamWrapper };
=======
} from "../llm/providers/stream-wrappers/openai.js";
>>>>>>> upstream/main
export {
  getOpenRouterModelCapabilities,
  loadOpenRouterModelCapabilities,
} from "../agents/embedded-agent-runner/openrouter-model-capabilities.js";
