<<<<<<< HEAD
=======
// Openai plugin module implements replay policy behavior.
>>>>>>> upstream/main
import type {
  ProviderReplayPolicy,
  ProviderReplayPolicyContext,
} from "openclaw/plugin-sdk/plugin-entry";

<<<<<<< HEAD
=======
const RESPONSES_FAMILY_APIS = new Set([
  "openai-responses",
  "openai-chatgpt-responses",
  "azure-openai-responses",
]);

>>>>>>> upstream/main
/**
 * Returns the provider-owned replay policy for OpenAI-family transports.
 */
export function buildOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy {
<<<<<<< HEAD
=======
  const isResponsesFamily = RESPONSES_FAMILY_APIS.has(ctx.modelApi ?? "");
>>>>>>> upstream/main
  return {
    sanitizeMode: "images-only",
    applyAssistantFirstOrderingFix: false,
    validateGeminiTurns: false,
    validateAnthropicTurns: false,
<<<<<<< HEAD
=======
    ...(isResponsesFamily ? { allowSyntheticToolResults: true } : {}),
>>>>>>> upstream/main
    ...(ctx.modelApi === "openai-completions"
      ? {
          sanitizeToolCallIds: true,
          toolCallIdMode: "strict" as const,
        }
      : {
          sanitizeToolCallIds: false,
        }),
  };
}
