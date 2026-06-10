<<<<<<< HEAD
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";

type VolcModelCatalogEntry = {
  id: string;
  name: string;
  reasoning: boolean;
  input: ReadonlyArray<ModelDefinitionConfig["input"][number]>;
  contextWindow: number;
  maxTokens: number;
};

const VOLC_MODEL_KIMI_K2_5 = {
  id: "kimi-k2-5-260127",
  name: "Kimi K2.5",
  reasoning: false,
  input: ["text", "image"] as const,
  contextWindow: 256000,
  maxTokens: 4096,
} as const;

const VOLC_MODEL_GLM_4_7 = {
  id: "glm-4-7-251222",
  name: "GLM 4.7",
  reasoning: false,
  input: ["text", "image"] as const,
  contextWindow: 200000,
  maxTokens: 4096,
} as const;

const VOLC_SHARED_CODING_MODEL_CATALOG = [
  {
    id: "ark-code-latest",
    name: "Ark Coding Plan",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "doubao-seed-code",
    name: "Doubao Seed Code",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "glm-4.7",
    name: "GLM 4.7 Coding",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 200000,
    maxTokens: 4096,
  },
  {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5 Coding",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
] as const;

export const BYTEPLUS_BASE_URL = "https://ark.ap-southeast.bytepluses.com/api/v3";
export const BYTEPLUS_CODING_BASE_URL = "https://ark.ap-southeast.bytepluses.com/api/coding/v3";
export const BYTEPLUS_DEFAULT_MODEL_ID = "seed-1-8-251228";
export const BYTEPLUS_CODING_DEFAULT_MODEL_ID = "ark-code-latest";
export const BYTEPLUS_DEFAULT_MODEL_REF = `byteplus/${BYTEPLUS_DEFAULT_MODEL_ID}`;

=======
/**
 * BytePlus model catalog helpers derived from the plugin manifest.
 */
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };

const BYTEPLUS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "byteplus",
  catalog: manifest.modelCatalog.providers.byteplus,
});

const BYTEPLUS_CODING_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "byteplus-plan",
  catalog: manifest.modelCatalog.providers["byteplus-plan"],
});

/** Base URL for BytePlus chat/model APIs from the manifest catalog. */
export const BYTEPLUS_BASE_URL = BYTEPLUS_MANIFEST_PROVIDER.baseUrl;
/** Base URL for BytePlus Plan coding APIs from the manifest catalog. */
export const BYTEPLUS_CODING_BASE_URL = BYTEPLUS_CODING_MANIFEST_PROVIDER.baseUrl;

/** Fallback cost shape retained for callers that need BytePlus defaults. */
>>>>>>> upstream/main
export const BYTEPLUS_DEFAULT_COST = {
  input: 0.0001,
  output: 0.0002,
  cacheRead: 0,
  cacheWrite: 0,
};

<<<<<<< HEAD
export const BYTEPLUS_MODEL_CATALOG = [
  {
    id: "seed-1-8-251228",
    name: "Seed 1.8",
    reasoning: false,
    input: ["text", "image"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  VOLC_MODEL_KIMI_K2_5,
  VOLC_MODEL_GLM_4_7,
] as const;

export const BYTEPLUS_CODING_MODEL_CATALOG = VOLC_SHARED_CODING_MODEL_CATALOG;

export type BytePlusCatalogEntry = (typeof BYTEPLUS_MODEL_CATALOG)[number];
export type BytePlusCodingCatalogEntry = (typeof BYTEPLUS_CODING_MODEL_CATALOG)[number];

function buildVolcModelDefinition(
  entry: VolcModelCatalogEntry,
  cost: ModelDefinitionConfig["cost"],
): ModelDefinitionConfig {
  return {
    id: entry.id,
    name: entry.name,
    reasoning: entry.reasoning,
    input: [...entry.input],
    cost,
    contextWindow: entry.contextWindow,
    maxTokens: entry.maxTokens,
  };
}

export function buildBytePlusModelDefinition(
  entry: BytePlusCatalogEntry | BytePlusCodingCatalogEntry,
): ModelDefinitionConfig {
  return buildVolcModelDefinition(entry, BYTEPLUS_DEFAULT_COST);
}
=======
/** BytePlus general model catalog entries. */
export const BYTEPLUS_MODEL_CATALOG: ModelDefinitionConfig[] = BYTEPLUS_MANIFEST_PROVIDER.models;
/** BytePlus coding/planning model catalog entries. */
export const BYTEPLUS_CODING_MODEL_CATALOG: ModelDefinitionConfig[] =
  BYTEPLUS_CODING_MANIFEST_PROVIDER.models;

/** Clones one manifest model definition so callers can mutate safely. */
export function buildBytePlusModelDefinition(entry: ModelDefinitionConfig): ModelDefinitionConfig {
  return {
    ...entry,
    input: [...entry.input],
    cost: { ...entry.cost },
  };
}
>>>>>>> upstream/main
