<<<<<<< HEAD:src/agents/pi-embedded-runner/model-context-tokens.ts
import type { Api, Model } from "@mariozechner/pi-ai";

type PiModelWithOptionalContextTokens = Model<Api> & {
  contextTokens?: number;
};

export function readPiModelContextTokens(model: Model<Api> | null | undefined): number | undefined {
  const value = (model as PiModelWithOptionalContextTokens | null | undefined)?.contextTokens;
=======
/**
 * Reads normalized context-token metadata from resolved model definitions.
 */
import type { Model } from "../../llm/types.js";

/**
 * Reads optional context-token metadata from discovered models without widening the core model type.
 */
type AgentModelWithOptionalContextTokens = Model & {
  contextTokens?: number;
};

/** Returns finite context-token metadata when a model discovery source provided it. */
/** Prefer contextTokens, then contextWindow, when present on model metadata. */
export function readAgentModelContextTokens(model: Model | null | undefined): number | undefined {
  const value = (model as AgentModelWithOptionalContextTokens | null | undefined)?.contextTokens;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model-context-tokens.ts
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
