<<<<<<< HEAD
import type { Api, Model } from "@mariozechner/pi-ai";
import { detectOpenAICompletionsCompat } from "../agents/openai-completions-compat.js";
import type { ModelCompatConfig } from "../config/types.models.js";

function extractModelCompat(
=======
// Normalizes provider model compatibility metadata from plugins.
import { normalizeStringEntries } from "@openclaw/normalization-core/string-normalization";
import { detectOpenAICompletionsCompat } from "../agents/openai-completions-compat.js";
import type { ModelCompatConfig } from "../config/types.models.js";
import type { Model } from "../llm/types.js";

export function extractModelCompat(
>>>>>>> upstream/main
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ModelCompatConfig | undefined {
  if (!modelOrCompat || typeof modelOrCompat !== "object") {
    return undefined;
  }
  if ("compat" in modelOrCompat) {
    const compat = (modelOrCompat as { compat?: unknown }).compat;
    return compat && typeof compat === "object" ? (compat as ModelCompatConfig) : undefined;
  }
  return modelOrCompat as ModelCompatConfig;
}

<<<<<<< HEAD
export function applyModelCompatPatch<T extends { compat?: ModelCompatConfig }>(
  model: T,
  patch: ModelCompatConfig,
): T {
  const nextCompat = { ...model.compat, ...patch };
  if (
    model.compat &&
    Object.entries(patch).every(
      ([key, value]) => model.compat?.[key as keyof ModelCompatConfig] === value,
    )
=======
/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
export function applyModelCompatPatch<T extends { compat?: ModelCompatConfig }>(
  model: T,
  patch: Partial<ModelCompatConfig> & Record<string, unknown>,
): T {
  const nextCompat = { ...model.compat, ...patch } as ModelCompatConfig;
  const currentCompat = model.compat as (Record<string, unknown> & ModelCompatConfig) | undefined;
  if (
    model.compat &&
    Object.entries(patch).every(([key, value]) => currentCompat?.[key] === value)
>>>>>>> upstream/main
  ) {
    return model;
  }
  return {
    ...model,
    compat: nextCompat,
  };
}

export function hasToolSchemaProfile(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
  profile: string,
): boolean {
  return extractModelCompat(modelOrCompat)?.toolSchemaProfile === profile;
}

export function hasNativeWebSearchTool(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): boolean {
  return extractModelCompat(modelOrCompat)?.nativeWebSearchTool === true;
}

export function resolveToolCallArgumentsEncoding(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ModelCompatConfig["toolCallArgumentsEncoding"] | undefined {
  return extractModelCompat(modelOrCompat)?.toolCallArgumentsEncoding;
}

export function resolveUnsupportedToolSchemaKeywords(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ReadonlySet<string> {
  const keywords = extractModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
  return new Set(
<<<<<<< HEAD
    keywords
      .filter((keyword): keyword is string => typeof keyword === "string")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  );
}

function isOpenAiCompletionsModel(model: Model<Api>): model is Model<"openai-completions"> {
  return model.api === "openai-completions";
}

function isAnthropicMessagesModel(model: Model<Api>): model is Model<"anthropic-messages"> {
=======
    normalizeStringEntries(
      keywords.filter((keyword): keyword is string => typeof keyword === "string"),
    ),
  );
}

export function shouldOmitEmptyArrayItems(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): boolean {
  const compat = extractModelCompat(modelOrCompat) as
    | (ModelCompatConfig & { omitEmptyArrayItems?: unknown })
    | undefined;
  return compat?.omitEmptyArrayItems === true;
}

function isOpenAiCompletionsModel(model: Model): model is Model<"openai-completions"> {
  return model.api === "openai-completions";
}

function isAnthropicMessagesModel(model: Model): model is Model<"anthropic-messages"> {
>>>>>>> upstream/main
  return model.api === "anthropic-messages";
}

function normalizeAnthropicBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/v1\/?$/, "");
}

<<<<<<< HEAD
export function normalizeModelCompat(model: Model<Api>): Model<Api> {
=======
export function normalizeModelCompat(model: Model): Model {
>>>>>>> upstream/main
  const baseUrl = model.baseUrl ?? "";

  if (isAnthropicMessagesModel(model) && baseUrl) {
    const normalized = normalizeAnthropicBaseUrl(baseUrl);
    if (normalized !== baseUrl) {
      return { ...model, baseUrl: normalized } as Model<"anthropic-messages">;
    }
  }

  if (!isOpenAiCompletionsModel(model)) {
    return model;
  }

  const compat = model.compat ?? undefined;
  const detectedCompatDefaults = baseUrl
    ? detectOpenAICompletionsCompat(model).defaults
    : undefined;
  const needsForce = Boolean(
    detectedCompatDefaults &&
    (!detectedCompatDefaults.supportsDeveloperRole ||
      !detectedCompatDefaults.supportsUsageInStreaming ||
      !detectedCompatDefaults.supportsStrictMode),
  );
  if (!needsForce) {
    return model;
  }
  const forcedDeveloperRole = compat?.supportsDeveloperRole === true;
  const hasStreamingUsageOverride = compat?.supportsUsageInStreaming !== undefined;
  const targetStrictMode = compat?.supportsStrictMode ?? detectedCompatDefaults?.supportsStrictMode;
  if (
    compat?.supportsDeveloperRole !== undefined &&
    hasStreamingUsageOverride &&
    compat?.supportsStrictMode !== undefined
  ) {
    return model;
  }

  return {
    ...model,
    compat: compat
      ? {
          ...compat,
          supportsDeveloperRole: forcedDeveloperRole || false,
          ...(hasStreamingUsageOverride
            ? {}
            : {
                supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
              }),
          supportsStrictMode: targetStrictMode,
        }
      : {
          supportsDeveloperRole: false,
          supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
          supportsStrictMode: detectedCompatDefaults?.supportsStrictMode ?? false,
        },
  } as typeof model;
}
