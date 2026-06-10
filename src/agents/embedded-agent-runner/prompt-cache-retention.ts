<<<<<<< HEAD:src/agents/pi-embedded-runner/prompt-cache-retention.ts
import { resolveAnthropicCacheRetentionFamily } from "./anthropic-family-cache-semantics.js";
=======
/**
 * Resolves provider/model prompt-cache retention behavior.
 */
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { resolveAnthropicCacheRetentionFamily } from "../../llm/providers/stream-wrappers/anthropic-family-cache-semantics.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/prompt-cache-retention.ts

type CacheRetention = "none" | "short" | "long";

export function isGooglePromptCacheEligible(params: {
  modelApi?: string;
  modelId?: string;
}): boolean {
  if (params.modelApi !== "google-generative-ai") {
    return false;
  }
<<<<<<< HEAD:src/agents/pi-embedded-runner/prompt-cache-retention.ts
  const normalizedModelId = params.modelId?.trim().toLowerCase() ?? "";
=======
  const normalizedModelId = normalizeLowercaseStringOrEmpty(params.modelId);
>>>>>>> upstream/main:src/agents/embedded-agent-runner/prompt-cache-retention.ts
  return normalizedModelId.startsWith("gemini-2.5") || normalizedModelId.startsWith("gemini-3");
}

export function resolveCacheRetention(
  extraParams: Record<string, unknown> | undefined,
  provider: string,
  modelApi?: string,
  modelId?: string,
<<<<<<< HEAD:src/agents/pi-embedded-runner/prompt-cache-retention.ts
=======
  supportsPromptCacheKey?: boolean,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/prompt-cache-retention.ts
): CacheRetention | undefined {
  const hasExplicitCacheConfig =
    extraParams?.cacheRetention !== undefined || extraParams?.cacheControlTtl !== undefined;
  const family = resolveAnthropicCacheRetentionFamily({
    provider,
    modelApi,
    modelId,
    hasExplicitCacheConfig,
  });
  const googleEligible = isGooglePromptCacheEligible({ modelApi, modelId });
<<<<<<< HEAD:src/agents/pi-embedded-runner/prompt-cache-retention.ts

  if (!family && !googleEligible) {
=======
  // OpenAI-compatible completions backends (oMLX, llama.cpp, etc.) opt into
  // prompt caching via `compat.supportsPromptCacheKey: true`. Without that
  // flag they sit outside the anthropic/google family gates, so issue #81281
  // dropped the user's explicit `cacheRetention` before the transport layer
  // could emit it. Proxies that route non-cacheable models via the same
  // openai-completions wire (amazon-bedrock + amazon.* nova models) leave
  // the flag unset, so the existing family gate still applies to them.
  const cacheKeyEligible = supportsPromptCacheKey === true;

  if (!family && !googleEligible && !cacheKeyEligible) {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/prompt-cache-retention.ts
    return undefined;
  }

  const newVal = extraParams?.cacheRetention;
  if (newVal === "none" || newVal === "short" || newVal === "long") {
    return newVal;
  }

  const legacy = extraParams?.cacheControlTtl;
<<<<<<< HEAD:src/agents/pi-embedded-runner/prompt-cache-retention.ts
  if (legacy === "5m") {
    return "short";
  }
  if (legacy === "1h") {
=======
  if (legacy === "5m" && (family || googleEligible)) {
    return "short";
  }
  if (legacy === "1h" && (family || googleEligible)) {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/prompt-cache-retention.ts
    return "long";
  }

  return family === "anthropic-direct" ? "short" : undefined;
}
