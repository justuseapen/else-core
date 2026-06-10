<<<<<<< HEAD
import type { AgentMessage } from "@mariozechner/pi-agent-core";
=======
// Provides shared replay-policy helpers for provider plugins.
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import type { AgentMessage } from "../agents/runtime/index.js";
import { isGemma4ModelId } from "../shared/google-models.js";
import { sanitizeGoogleAssistantFirstOrdering } from "../shared/google-turn-ordering.js";
>>>>>>> upstream/main
import type {
  ProviderReasoningOutputMode,
  ProviderReplayPolicy,
  ProviderReplayPolicyContext,
  ProviderReplaySessionState,
  ProviderSanitizeReplayHistoryContext,
} from "./types.js";

<<<<<<< HEAD
export function buildOpenAICompatibleReplayPolicy(
  modelApi: string | null | undefined,
=======
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
export function buildOpenAICompatibleReplayPolicy(
  modelApi: string | null | undefined,
  options: {
    sanitizeToolCallIds?: boolean;
    modelId?: string | null;
    dropReasoningFromHistory?: boolean;
  } = {},
>>>>>>> upstream/main
): ProviderReplayPolicy | undefined {
  if (
    modelApi !== "openai-completions" &&
    modelApi !== "openai-responses" &&
<<<<<<< HEAD
    modelApi !== "openai-codex-responses" &&
=======
    modelApi !== "openai-chatgpt-responses" &&
>>>>>>> upstream/main
    modelApi !== "azure-openai-responses"
  ) {
    return undefined;
  }

<<<<<<< HEAD
  return {
    sanitizeToolCallIds: true,
    toolCallIdMode: "strict",
=======
  const sanitizeToolCallIds = options.sanitizeToolCallIds ?? true;
  const dropReasoningFromHistory = options.dropReasoningFromHistory ?? true;
  const isResponsesFamily =
    modelApi === "openai-responses" ||
    modelApi === "openai-chatgpt-responses" ||
    modelApi === "azure-openai-responses";

  return {
    ...(sanitizeToolCallIds
      ? { sanitizeToolCallIds: true, toolCallIdMode: "strict" as const }
      : {}),
    ...(isResponsesFamily ? { allowSyntheticToolResults: true } : {}),
>>>>>>> upstream/main
    ...(modelApi === "openai-completions"
      ? {
          applyAssistantFirstOrderingFix: true,
          validateGeminiTurns: true,
          validateAnthropicTurns: true,
        }
      : {
          applyAssistantFirstOrderingFix: false,
          validateGeminiTurns: false,
          validateAnthropicTurns: false,
        }),
<<<<<<< HEAD
  };
}

=======
    ...(modelApi === "openai-completions" &&
    (dropReasoningFromHistory || isGemma4ModelId(options.modelId))
      ? { dropReasoningFromHistory: true }
      : {}),
  };
}

/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
>>>>>>> upstream/main
export function buildStrictAnthropicReplayPolicy(
  options: {
    dropThinkingBlocks?: boolean;
    sanitizeToolCallIds?: boolean;
    preserveNativeAnthropicToolUseIds?: boolean;
  } = {},
): ProviderReplayPolicy {
  const sanitizeToolCallIds = options.sanitizeToolCallIds ?? true;
  return {
    sanitizeMode: "full",
    ...(sanitizeToolCallIds
      ? {
          sanitizeToolCallIds: true,
          toolCallIdMode: "strict" as const,
          ...(options.preserveNativeAnthropicToolUseIds
            ? { preserveNativeAnthropicToolUseIds: true }
            : {}),
        }
      : {}),
    preserveSignatures: true,
    repairToolUseResultPairing: true,
    validateAnthropicTurns: true,
    allowSyntheticToolResults: true,
    ...(options.dropThinkingBlocks ? { dropThinkingBlocks: true } : {}),
  };
}

<<<<<<< HEAD
export function buildAnthropicReplayPolicyForModel(modelId?: string): ProviderReplayPolicy {
  return buildStrictAnthropicReplayPolicy({
    dropThinkingBlocks: (modelId?.toLowerCase() ?? "").includes("claude"),
  });
}

export function buildNativeAnthropicReplayPolicyForModel(modelId?: string): ProviderReplayPolicy {
  return buildStrictAnthropicReplayPolicy({
    dropThinkingBlocks: (modelId?.toLowerCase() ?? "").includes("claude"),
=======
/**
 * Returns true for Claude models that preserve thinking blocks in context
 * natively (Opus 4.5+, Sonnet 4.5+, Haiku 4.5+). For these models, dropping
 * thinking blocks from prior turns breaks prompt cache prefix matching.
 *
 * See: https://platform.claude.com/docs/en/build-with-claude/extended-thinking#differences-in-thinking-across-model-versions
 *
 * @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks.
 */
export function shouldPreserveThinkingBlocks(modelId?: string): boolean {
  const id = normalizeLowercaseStringOrEmpty(modelId);
  if (!id.includes("claude")) {
    return false;
  }

  // Models that preserve thinking blocks natively (Claude 4.5+):
  // - claude-opus-4-x (opus-4-5, opus-4-6, ...)
  // - claude-sonnet-4-x (sonnet-4-5, sonnet-4-6, ...)
  //   Note: "sonnet-4" is safe — legacy "claude-3-5-sonnet" does not contain "sonnet-4"
  // - claude-haiku-4-x (haiku-4-5, ...)
  // Models that require dropping thinking blocks:
  // - claude-3-7-sonnet, claude-3-5-sonnet, and earlier
  if (id.includes("opus-4") || id.includes("sonnet-4") || id.includes("haiku-4")) {
    return true;
  }

  // Future-proofing: claude-5-x, claude-6-x etc. should also preserve
  if (/claude-[5-9]/.test(id) || /claude-\d{2,}/.test(id)) {
    return true;
  }

  return false;
}

/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
export function buildAnthropicReplayPolicyForModel(modelId?: string): ProviderReplayPolicy {
  const isClaude = normalizeLowercaseStringOrEmpty(modelId).includes("claude");
  return buildStrictAnthropicReplayPolicy({
    dropThinkingBlocks: isClaude && !shouldPreserveThinkingBlocks(modelId),
  });
}

/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
export function buildNativeAnthropicReplayPolicyForModel(modelId?: string): ProviderReplayPolicy {
  const isClaude = normalizeLowercaseStringOrEmpty(modelId).includes("claude");
  return buildStrictAnthropicReplayPolicy({
    dropThinkingBlocks: isClaude && !shouldPreserveThinkingBlocks(modelId),
>>>>>>> upstream/main
    sanitizeToolCallIds: true,
    preserveNativeAnthropicToolUseIds: true,
  });
}

<<<<<<< HEAD
=======
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
>>>>>>> upstream/main
export function buildHybridAnthropicOrOpenAIReplayPolicy(
  ctx: ProviderReplayPolicyContext,
  options: { anthropicModelDropThinkingBlocks?: boolean } = {},
): ProviderReplayPolicy | undefined {
  if (ctx.modelApi === "anthropic-messages" || ctx.modelApi === "bedrock-converse-stream") {
<<<<<<< HEAD
    return buildStrictAnthropicReplayPolicy({
      dropThinkingBlocks:
        options.anthropicModelDropThinkingBlocks &&
        (ctx.modelId?.toLowerCase() ?? "").includes("claude"),
    });
  }

  return buildOpenAICompatibleReplayPolicy(ctx.modelApi);
}

const GOOGLE_TURN_ORDERING_CUSTOM_TYPE = "google-turn-ordering-bootstrap";
const GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT = "(session bootstrap)";

function sanitizeGoogleAssistantFirstOrdering(messages: AgentMessage[]): AgentMessage[] {
  const first = messages[0] as { role?: unknown; content?: unknown } | undefined;
  const role = first?.role;
  const content = first?.content;
  if (
    role === "user" &&
    typeof content === "string" &&
    content.trim() === GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT
  ) {
    return messages;
  }
  if (role !== "assistant") {
    return messages;
  }

  const bootstrap: AgentMessage = {
    role: "user",
    content: GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT,
    timestamp: Date.now(),
  } as AgentMessage;

  return [bootstrap, ...messages];
}
=======
    const isClaude = normalizeLowercaseStringOrEmpty(ctx.modelId).includes("claude");
    return buildStrictAnthropicReplayPolicy({
      dropThinkingBlocks:
        options.anthropicModelDropThinkingBlocks &&
        isClaude &&
        !shouldPreserveThinkingBlocks(ctx.modelId),
    });
  }

  return buildOpenAICompatibleReplayPolicy(ctx.modelApi, { modelId: ctx.modelId });
}

const GOOGLE_TURN_ORDERING_CUSTOM_TYPE = "google-turn-ordering-bootstrap";
>>>>>>> upstream/main

function hasGoogleTurnOrderingMarker(sessionState: ProviderReplaySessionState): boolean {
  return sessionState
    .getCustomEntries()
    .some((entry) => entry.customType === GOOGLE_TURN_ORDERING_CUSTOM_TYPE);
}

function markGoogleTurnOrderingMarker(sessionState: ProviderReplaySessionState): void {
  sessionState.appendCustomEntry(GOOGLE_TURN_ORDERING_CUSTOM_TYPE, {
    timestamp: Date.now(),
  });
}

<<<<<<< HEAD
=======
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
>>>>>>> upstream/main
export function buildGoogleGeminiReplayPolicy(): ProviderReplayPolicy {
  return {
    sanitizeMode: "full",
    sanitizeToolCallIds: true,
    toolCallIdMode: "strict",
    sanitizeThoughtSignatures: {
      allowBase64Only: true,
      includeCamelCase: true,
    },
    repairToolUseResultPairing: true,
    applyAssistantFirstOrderingFix: true,
    validateGeminiTurns: true,
    validateAnthropicTurns: false,
    allowSyntheticToolResults: true,
  };
}

<<<<<<< HEAD
export function buildPassthroughGeminiSanitizingReplayPolicy(
  modelId?: string,
): ProviderReplayPolicy {
=======
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
export function buildPassthroughGeminiSanitizingReplayPolicy(
  modelId?: string,
): ProviderReplayPolicy {
  const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
>>>>>>> upstream/main
  return {
    applyAssistantFirstOrderingFix: false,
    validateGeminiTurns: false,
    validateAnthropicTurns: false,
<<<<<<< HEAD
    ...((modelId?.toLowerCase() ?? "").includes("gemini")
=======
    ...(normalizedModelId.includes("gemini")
>>>>>>> upstream/main
      ? {
          sanitizeThoughtSignatures: {
            allowBase64Only: true,
            includeCamelCase: true,
          },
        }
      : {}),
  };
}

<<<<<<< HEAD
=======
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
>>>>>>> upstream/main
export function sanitizeGoogleGeminiReplayHistory(
  ctx: ProviderSanitizeReplayHistoryContext,
): AgentMessage[] {
  const messages = sanitizeGoogleAssistantFirstOrdering(ctx.messages);
  if (
    messages !== ctx.messages &&
    ctx.sessionState &&
    !hasGoogleTurnOrderingMarker(ctx.sessionState)
  ) {
    markGoogleTurnOrderingMarker(ctx.sessionState);
  }
  return messages;
}

<<<<<<< HEAD
=======
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
>>>>>>> upstream/main
export function resolveTaggedReasoningOutputMode(): ProviderReasoningOutputMode {
  return "tagged";
}
