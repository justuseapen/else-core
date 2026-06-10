<<<<<<< HEAD
=======
// Control UI module implements thinking behavior.
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.ts";

>>>>>>> upstream/main
export type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  reasoning?: boolean;
};

<<<<<<< HEAD
const BASE_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "adaptive"] as const;
const BINARY_THINKING_LEVELS = ["off", "on"] as const;
const ANTHROPIC_CLAUDE_46_MODEL_RE = /^claude-(?:opus|sonnet)-4(?:\.|-)6(?:$|[-.])/i;
const AMAZON_BEDROCK_CLAUDE_46_MODEL_RE = /claude-(?:opus|sonnet)-4(?:\.|-)6(?:$|[-.])/i;
=======
const BASE_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high"] as const;
>>>>>>> upstream/main

export function normalizeThinkingProviderId(provider?: string | null): string {
  if (!provider) {
    return "";
  }
<<<<<<< HEAD
  const normalized = provider.trim().toLowerCase();
=======
  const normalized = normalizeLowercaseStringOrEmpty(provider);
>>>>>>> upstream/main
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  if (normalized === "bedrock" || normalized === "aws-bedrock") {
    return "amazon-bedrock";
  }
  return normalized;
}

export function isBinaryThinkingProvider(provider?: string | null): boolean {
<<<<<<< HEAD
  return normalizeThinkingProviderId(provider) === "zai";
=======
  void provider;
  return false;
>>>>>>> upstream/main
}

export function normalizeThinkLevel(raw?: string | null): string | undefined {
  if (!raw) {
    return undefined;
  }
<<<<<<< HEAD
  const key = raw.trim().toLowerCase();
=======
  const key = normalizeLowercaseStringOrEmpty(raw);
>>>>>>> upstream/main
  const collapsed = key.replace(/[\s_-]+/g, "");
  if (collapsed === "adaptive" || collapsed === "auto") {
    return "adaptive";
  }
<<<<<<< HEAD
  if (collapsed === "xhigh" || collapsed === "extrahigh") {
    return "xhigh";
  }
  if (key === "off") {
=======
  if (collapsed === "max") {
    return "max";
  }
  if (collapsed === "xhigh" || collapsed === "extrahigh") {
    return "xhigh";
  }
  if (key === "off" || key === "none") {
>>>>>>> upstream/main
    return "off";
  }
  if (["on", "enable", "enabled"].includes(key)) {
    return "low";
  }
  if (["min", "minimal"].includes(key)) {
    return "minimal";
  }
  if (["low", "thinkhard", "think-hard", "think_hard"].includes(key)) {
    return "low";
  }
  if (["mid", "med", "medium", "thinkharder", "think-harder", "harder"].includes(key)) {
    return "medium";
  }
<<<<<<< HEAD
  if (
    ["high", "ultra", "ultrathink", "think-hard", "thinkhardest", "highest", "max"].includes(key)
  ) {
=======
  if (["high", "ultra", "ultrathink", "think-hard", "thinkhardest", "highest"].includes(key)) {
>>>>>>> upstream/main
    return "high";
  }
  if (key === "think") {
    return "minimal";
  }
  return undefined;
}

<<<<<<< HEAD
export function listThinkingLevelLabels(provider?: string | null): readonly string[] {
  return isBinaryThinkingProvider(provider) ? BINARY_THINKING_LEVELS : BASE_THINKING_LEVELS;
}

export function formatThinkingLevels(provider?: string | null): string {
  return listThinkingLevelLabels(provider).join(", ");
=======
export function listThinkingLevelLabels(
  provider?: string | null,
  model?: string | null,
): readonly string[] {
  void provider;
  void model;
  return BASE_THINKING_LEVELS;
}

export function formatThinkingLevels(provider?: string | null, model?: string | null): string {
  return listThinkingLevelLabels(provider, model).join(", ");
>>>>>>> upstream/main
}

export function resolveThinkingDefaultForModel(params: {
  provider: string;
  model: string;
  catalog?: ThinkingCatalogEntry[];
}): string {
<<<<<<< HEAD
  const normalizedProvider = normalizeThinkingProviderId(params.provider);
  const modelId = params.model.trim();
  if (normalizedProvider === "anthropic" && ANTHROPIC_CLAUDE_46_MODEL_RE.test(modelId)) {
    return "adaptive";
  }
  if (normalizedProvider === "amazon-bedrock" && AMAZON_BEDROCK_CLAUDE_46_MODEL_RE.test(modelId)) {
    return "adaptive";
  }
=======
>>>>>>> upstream/main
  const candidate = params.catalog?.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  return candidate?.reasoning ? "low" : "off";
}
