<<<<<<< HEAD
import type { StreamFn } from "@mariozechner/pi-agent-core";
import { streamSimple } from "@mariozechner/pi-ai";
=======
/**
 * Anthropic stream wrappers. They add beta headers, service tier/fast-mode
 * payload fields, and thinking-prefill cleanup around provider stream functions.
 */
import type { StreamFn } from "openclaw/plugin-sdk/agent-core";
import { streamSimple } from "openclaw/plugin-sdk/llm";
>>>>>>> upstream/main
import type { ProviderWrapStreamFnContext } from "openclaw/plugin-sdk/plugin-entry";
import {
  applyAnthropicPayloadPolicyToParams,
  composeProviderStreamWrappers,
<<<<<<< HEAD
  resolveAnthropicPayloadPolicy,
  streamWithPayloadPatch,
} from "openclaw/plugin-sdk/provider-stream-shared";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";

const log = createSubsystemLogger("anthropic-stream");

const ANTHROPIC_CONTEXT_1M_BETA = "context-1m-2025-08-07";
const ANTHROPIC_1M_MODEL_PREFIXES = ["claude-opus-4", "claude-sonnet-4"] as const;
const PI_AI_DEFAULT_ANTHROPIC_BETAS = [
  "fine-grained-tool-streaming-2025-05-14",
  "interleaved-thinking-2025-05-14",
] as const;
const PI_AI_OAUTH_ANTHROPIC_BETAS = [
  "claude-code-20250219",
  "oauth-2025-04-20",
  ...PI_AI_DEFAULT_ANTHROPIC_BETAS,
=======
  createAnthropicThinkingPrefillPayloadWrapper,
  resolveAnthropicPayloadPolicy,
  stripTrailingAnthropicAssistantPrefillWhenThinking,
  streamWithPayloadPatch,
} from "openclaw/plugin-sdk/provider-stream-shared";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import {
  normalizeFastMode,
  normalizeLowercaseStringOrEmpty,
  readStringValue,
} from "openclaw/plugin-sdk/string-coerce-runtime";

const log = createSubsystemLogger("anthropic-stream");

const ANTHROPIC_CONTEXT_1M_BETA_LEGACY = "context-1m-2025-08-07";
const ANTHROPIC_GA_1M_MODEL_PREFIXES = [
  "claude-opus-4-8",
  "claude-opus-4.8",
  "claude-opus-4-6",
  "claude-opus-4.6",
  "claude-opus-4-7",
  "claude-opus-4.7",
  "claude-sonnet-4-6",
  "claude-sonnet-4.6",
] as const;
const OPENCLAW_DEFAULT_ANTHROPIC_BETAS = [
  "fine-grained-tool-streaming-2025-05-14",
  "interleaved-thinking-2025-05-14",
] as const;
const OPENCLAW_OAUTH_ANTHROPIC_BETAS = [
  "claude-code-20250219",
  "oauth-2025-04-20",
  ...OPENCLAW_DEFAULT_ANTHROPIC_BETAS,
>>>>>>> upstream/main
] as const;

type AnthropicServiceTier = "auto" | "standard_only";

function isAnthropic1MModel(modelId: string): boolean {
<<<<<<< HEAD
  const normalized = modelId.trim().toLowerCase();
  return ANTHROPIC_1M_MODEL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
=======
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return ANTHROPIC_GA_1M_MODEL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
>>>>>>> upstream/main
}

function parseHeaderList(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeAnthropicBetaHeader(
  headers: Record<string, string> | undefined,
  betas: string[],
): Record<string, string> {
  const merged = { ...headers };
<<<<<<< HEAD
  const existingKey = Object.keys(merged).find((key) => key.toLowerCase() === "anthropic-beta");
=======
  const existingKey = Object.keys(merged).find(
    (key) => normalizeLowercaseStringOrEmpty(key) === "anthropic-beta",
  );
>>>>>>> upstream/main
  const existing = existingKey ? parseHeaderList(merged[existingKey]) : [];
  const values = Array.from(new Set([...existing, ...betas]));
  const key = existingKey ?? "anthropic-beta";
  merged[key] = values.join(",");
  return merged;
}

function isAnthropicOAuthApiKey(apiKey: unknown): boolean {
  return typeof apiKey === "string" && apiKey.includes("sk-ant-oat");
}

function resolveAnthropicFastServiceTier(enabled: boolean): AnthropicServiceTier {
  return enabled ? "auto" : "standard_only";
}

<<<<<<< HEAD
function normalizeFastMode(raw?: string | boolean | null): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (!raw) {
    return undefined;
  }
  const key = raw.toLowerCase();
  if (["off", "false", "no", "0", "disable", "disabled", "normal"].includes(key)) {
    return false;
  }
  if (["on", "true", "yes", "1", "enable", "enabled", "fast"].includes(key)) {
    return true;
  }
  return undefined;
}

=======
>>>>>>> upstream/main
function normalizeAnthropicServiceTier(value: unknown): AnthropicServiceTier | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
<<<<<<< HEAD
  const normalized = value.trim().toLowerCase();
=======
  const normalized = normalizeLowercaseStringOrEmpty(value);
>>>>>>> upstream/main
  if (normalized === "auto" || normalized === "standard_only") {
    return normalized;
  }
  return undefined;
}

<<<<<<< HEAD
export function resolveAnthropicBetas(
  extraParams: Record<string, unknown> | undefined,
  modelId: string,
=======
function hasConfiguredAnthropicBeta(extraParams: Record<string, unknown> | undefined): boolean {
  const configured = extraParams?.anthropicBeta;
  if (typeof configured === "string") {
    return configured.trim().length > 0;
  }
  if (!Array.isArray(configured)) {
    return false;
  }
  return configured.some((beta) => typeof beta === "string" && beta.trim().length > 0);
}

/** Resolve configured Anthropic beta headers from extra model params. */
export function resolveAnthropicBetas(
  extraParams: Record<string, unknown> | undefined,
  _modelId: string,
>>>>>>> upstream/main
): string[] | undefined {
  const betas = new Set<string>();
  const configured = extraParams?.anthropicBeta;
  if (typeof configured === "string" && configured.trim()) {
<<<<<<< HEAD
    betas.add(configured.trim());
  } else if (Array.isArray(configured)) {
    for (const beta of configured) {
      if (typeof beta === "string" && beta.trim()) {
        betas.add(beta.trim());
=======
    for (const beta of parseHeaderList(configured)) {
      betas.add(beta);
    }
  } else if (Array.isArray(configured)) {
    for (const beta of configured) {
      if (typeof beta === "string" && beta.trim()) {
        for (const betaValue of parseHeaderList(beta)) {
          betas.add(betaValue);
        }
>>>>>>> upstream/main
      }
    }
  }

<<<<<<< HEAD
  if (extraParams?.context1m === true) {
    if (isAnthropic1MModel(modelId)) {
      betas.add(ANTHROPIC_CONTEXT_1M_BETA);
    } else {
      log.warn(`ignoring context1m for non-opus/sonnet model: anthropic/${modelId}`);
    }
  }
=======
  // Newer Claude 4.x 1M context is GA. Keep context1m as a context-sizing
  // opt-in, but do not send the retired beta even if it remains in older config.
  betas.delete(ANTHROPIC_CONTEXT_1M_BETA_LEGACY);
>>>>>>> upstream/main

  return betas.size > 0 ? [...betas] : undefined;
}

<<<<<<< HEAD
=======
/** Wrap a stream function to merge OpenClaw and configured Anthropic beta headers. */
>>>>>>> upstream/main
export function createAnthropicBetaHeadersWrapper(
  baseStreamFn: StreamFn | undefined,
  betas: string[],
): StreamFn {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const isOauth = isAnthropicOAuthApiKey(options?.apiKey);
<<<<<<< HEAD
    const requestedContext1m = betas.includes(ANTHROPIC_CONTEXT_1M_BETA);
    const effectiveBetas =
      isOauth && requestedContext1m
        ? betas.filter((beta) => beta !== ANTHROPIC_CONTEXT_1M_BETA)
        : betas;
    if (isOauth && requestedContext1m) {
      log.warn(
        `ignoring context1m for Anthropic Claude CLI or legacy token auth on ${model.provider}/${model.id}; falling back to the standard context window because Anthropic rejects context-1m beta with non-API-key auth`,
      );
    }

    const piAiBetas = isOauth
      ? (PI_AI_OAUTH_ANTHROPIC_BETAS as readonly string[])
      : (PI_AI_DEFAULT_ANTHROPIC_BETAS as readonly string[]);
    const allBetas = [...new Set([...piAiBetas, ...effectiveBetas])];
=======
    const effectiveBetas = betas.filter((beta) => beta !== ANTHROPIC_CONTEXT_1M_BETA_LEGACY);

    const openClawBetas = isOauth
      ? (OPENCLAW_OAUTH_ANTHROPIC_BETAS as readonly string[])
      : (OPENCLAW_DEFAULT_ANTHROPIC_BETAS as readonly string[]);
    const allBetas = [...new Set([...openClawBetas, ...effectiveBetas])];
>>>>>>> upstream/main
    return underlying(model, context, {
      ...options,
      headers: mergeAnthropicBetaHeader(options?.headers, allBetas),
    });
  };
}

<<<<<<< HEAD
=======
/** Wrap a stream function with the Anthropic fast-mode service tier. */
>>>>>>> upstream/main
export function createAnthropicFastModeWrapper(
  baseStreamFn: StreamFn | undefined,
  enabled: boolean,
): StreamFn {
<<<<<<< HEAD
  const underlying = baseStreamFn ?? streamSimple;
  const serviceTier = resolveAnthropicFastServiceTier(enabled);
  return (model, context, options) => {
    if (isAnthropicOAuthApiKey(options?.apiKey)) {
      return underlying(model, context, options);
    }

    const payloadPolicy = resolveAnthropicPayloadPolicy({
      provider: typeof model.provider === "string" ? model.provider : undefined,
      api: typeof model.api === "string" ? model.api : undefined,
      baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : undefined,
      serviceTier,
    });
    if (!payloadPolicy.allowsServiceTier) {
      return underlying(model, context, options);
    }

    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) =>
      applyAnthropicPayloadPolicyToParams(payloadObj, payloadPolicy),
    );
  };
}

=======
  return createAnthropicServiceTierWrapper(baseStreamFn, resolveAnthropicFastServiceTier(enabled));
}

/** Wrap a stream function with an explicit Anthropic service tier when allowed. */
>>>>>>> upstream/main
export function createAnthropicServiceTierWrapper(
  baseStreamFn: StreamFn | undefined,
  serviceTier: AnthropicServiceTier,
): StreamFn {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (isAnthropicOAuthApiKey(options?.apiKey)) {
      return underlying(model, context, options);
    }

    const payloadPolicy = resolveAnthropicPayloadPolicy({
<<<<<<< HEAD
      provider: typeof model.provider === "string" ? model.provider : undefined,
      api: typeof model.api === "string" ? model.api : undefined,
      baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : undefined,
=======
      provider: readStringValue(model.provider),
      api: readStringValue(model.api),
      baseUrl: readStringValue(model.baseUrl),
>>>>>>> upstream/main
      serviceTier,
    });
    if (!payloadPolicy.allowsServiceTier) {
      return underlying(model, context, options);
    }

    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) =>
      applyAnthropicPayloadPolicyToParams(payloadObj, payloadPolicy),
    );
  };
}

<<<<<<< HEAD
=======
/** Wrap a stream function to strip trailing assistant prefill before thinking requests. */
export function createAnthropicThinkingPrefillWrapper(
  baseStreamFn: StreamFn | undefined,
): StreamFn {
  return createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, (stripped) => {
    log.warn(
      `removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because Anthropic extended thinking requires conversations to end with a user turn`,
    );
  });
}

/** Resolve Anthropic fast-mode setting from model extra params. */
>>>>>>> upstream/main
export function resolveAnthropicFastMode(
  extraParams: Record<string, unknown> | undefined,
): boolean | undefined {
  return normalizeFastMode(
    (extraParams?.fastMode ?? extraParams?.fast_mode) as string | boolean | null | undefined,
  );
}

<<<<<<< HEAD
=======
/** Resolve Anthropic service tier from model extra params. */
>>>>>>> upstream/main
export function resolveAnthropicServiceTier(
  extraParams: Record<string, unknown> | undefined,
): AnthropicServiceTier | undefined {
  const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
  const normalized = normalizeAnthropicServiceTier(raw);
  if (raw !== undefined && normalized === undefined) {
    const rawSummary = typeof raw === "string" ? raw : typeof raw;
    log.warn(`ignoring invalid Anthropic service tier param: ${rawSummary}`);
  }
  return normalized;
}

<<<<<<< HEAD
=======
/** Compose all Anthropic stream wrappers for one provider/model context. */
>>>>>>> upstream/main
export function wrapAnthropicProviderStream(
  ctx: ProviderWrapStreamFnContext,
): StreamFn | undefined {
  const anthropicBetas = resolveAnthropicBetas(ctx.extraParams, ctx.modelId);
<<<<<<< HEAD
=======
  const needsAnthropicBetaWrapper =
    anthropicBetas !== undefined ||
    hasConfiguredAnthropicBeta(ctx.extraParams) ||
    (ctx.extraParams?.context1m === true && isAnthropic1MModel(ctx.modelId));
>>>>>>> upstream/main
  const serviceTier = resolveAnthropicServiceTier(ctx.extraParams);
  const fastMode = resolveAnthropicFastMode(ctx.extraParams);
  return composeProviderStreamWrappers(
    ctx.streamFn,
<<<<<<< HEAD
    anthropicBetas?.length
      ? (streamFn) => createAnthropicBetaHeadersWrapper(streamFn, anthropicBetas)
=======
    needsAnthropicBetaWrapper
      ? (streamFn) => createAnthropicBetaHeadersWrapper(streamFn, anthropicBetas ?? [])
>>>>>>> upstream/main
      : undefined,
    serviceTier
      ? (streamFn) => createAnthropicServiceTierWrapper(streamFn, serviceTier)
      : undefined,
    fastMode !== undefined
      ? (streamFn) => createAnthropicFastModeWrapper(streamFn, fastMode)
      : undefined,
<<<<<<< HEAD
  );
}

export const __testing = { log };
=======
    (streamFn) => createAnthropicThinkingPrefillWrapper(streamFn),
  );
}

/** Test-only hooks for Anthropic stream wrapper behavior. */
export const testing = {
  log,
  stripTrailingAssistantPrefillWhenThinking: stripTrailingAnthropicAssistantPrefillWhenThinking,
};
export { testing as __testing };
>>>>>>> upstream/main
