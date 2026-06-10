<<<<<<< HEAD
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
=======
// Zai plugin module implements model definitions behavior.
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };
>>>>>>> upstream/main

export const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
export const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";
export const ZAI_GLOBAL_BASE_URL = "https://api.z.ai/api/paas/v4";
export const ZAI_CN_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
export const ZAI_DEFAULT_MODEL_ID = "glm-5.1";
export const ZAI_DEFAULT_MODEL_REF = `zai/${ZAI_DEFAULT_MODEL_ID}`;

const ZAI_MANIFEST_CATALOG = manifest.modelCatalog.providers.zai;
const ZAI_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "zai",
  catalog: ZAI_MANIFEST_CATALOG,
});
const ZAI_MODEL_CATALOG = new Map(
  ZAI_MANIFEST_PROVIDER.models.map((model) => [model.id, model] as const),
);

<<<<<<< HEAD
export const ZAI_DEFAULT_COST = {
  input: 1,
  output: 3.2,
  cacheRead: 0.2,
  cacheWrite: 0,
} satisfies ModelDefinitionConfig["cost"];

const ZAI_MODEL_CATALOG = {
  "glm-5.1": {
    name: "GLM-5.1",
    reasoning: true,
    input: ["text"],
    contextWindow: 202800,
    maxTokens: 131100,
    cost: { input: 1.2, output: 4, cacheRead: 0.24, cacheWrite: 0 },
  },
  "glm-5": {
    name: "GLM-5",
    reasoning: true,
    input: ["text"],
    contextWindow: 202800,
    maxTokens: 131100,
    cost: ZAI_DEFAULT_COST,
  },
  "glm-5-turbo": {
    name: "GLM-5 Turbo",
    reasoning: true,
    input: ["text"],
    contextWindow: 202800,
    maxTokens: 131100,
    cost: { input: 1.2, output: 4, cacheRead: 0.24, cacheWrite: 0 },
  },
  "glm-5v-turbo": {
    name: "GLM-5V Turbo",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 202800,
    maxTokens: 131100,
    cost: { input: 1.2, output: 4, cacheRead: 0.24, cacheWrite: 0 },
  },
  "glm-4.7": {
    name: "GLM-4.7",
    reasoning: true,
    input: ["text"],
    contextWindow: 204800,
    maxTokens: 131072,
    cost: { input: 0.6, output: 2.2, cacheRead: 0.11, cacheWrite: 0 },
  },
  "glm-4.7-flash": {
    name: "GLM-4.7 Flash",
    reasoning: true,
    input: ["text"],
    contextWindow: 200000,
    maxTokens: 131072,
    cost: { input: 0.07, output: 0.4, cacheRead: 0, cacheWrite: 0 },
  },
  "glm-4.7-flashx": {
    name: "GLM-4.7 FlashX",
    reasoning: true,
    input: ["text"],
    contextWindow: 200000,
    maxTokens: 128000,
    cost: { input: 0.06, output: 0.4, cacheRead: 0.01, cacheWrite: 0 },
  },
  "glm-4.6": {
    name: "GLM-4.6",
    reasoning: true,
    input: ["text"],
    contextWindow: 204800,
    maxTokens: 131072,
    cost: { input: 0.6, output: 2.2, cacheRead: 0.11, cacheWrite: 0 },
  },
  "glm-4.6v": {
    name: "GLM-4.6V",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 128000,
    maxTokens: 32768,
    cost: { input: 0.3, output: 0.9, cacheRead: 0, cacheWrite: 0 },
  },
  "glm-4.5": {
    name: "GLM-4.5",
    reasoning: true,
    input: ["text"],
    contextWindow: 131072,
    maxTokens: 98304,
    cost: { input: 0.6, output: 2.2, cacheRead: 0.11, cacheWrite: 0 },
  },
  "glm-4.5-air": {
    name: "GLM-4.5 Air",
    reasoning: true,
    input: ["text"],
    contextWindow: 131072,
    maxTokens: 98304,
    cost: { input: 0.2, output: 1.1, cacheRead: 0.03, cacheWrite: 0 },
  },
  "glm-4.5-flash": {
    name: "GLM-4.5 Flash",
    reasoning: true,
    input: ["text"],
    contextWindow: 131072,
    maxTokens: 98304,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  },
  "glm-4.5v": {
    name: "GLM-4.5V",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 64000,
    maxTokens: 16384,
    cost: { input: 0.6, output: 1.8, cacheRead: 0, cacheWrite: 0 },
  },
} as const satisfies Record<string, ZaiCatalogEntry>;

type ZaiCatalogId = keyof typeof ZAI_MODEL_CATALOG;
=======
export const ZAI_DEFAULT_COST =
  ZAI_MODEL_CATALOG.get("glm-5")?.cost ??
  ({
    input: 1,
    output: 3.2,
    cacheRead: 0.2,
    cacheWrite: 0,
  } satisfies ModelDefinitionConfig["cost"]);
>>>>>>> upstream/main

export function resolveZaiBaseUrl(endpoint?: string): string {
  switch (endpoint) {
    case "coding-cn":
      return ZAI_CODING_CN_BASE_URL;
    case "global":
      return ZAI_GLOBAL_BASE_URL;
    case "cn":
      return ZAI_CN_BASE_URL;
    case "coding-global":
      return ZAI_CODING_GLOBAL_BASE_URL;
    default:
      return ZAI_GLOBAL_BASE_URL;
  }
}

export function buildZaiCatalogModels(): ModelDefinitionConfig[] {
  return ZAI_MANIFEST_PROVIDER.models.map((model) =>
    Object.assign({}, model, { input: [...model.input] }),
  );
}

export function buildZaiModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: ModelDefinitionConfig["input"];
  cost?: ModelDefinitionConfig["cost"];
  contextWindow?: number;
  maxTokens?: number;
}): ModelDefinitionConfig {
  const catalog = ZAI_MODEL_CATALOG.get(params.id);
  return {
    id: params.id,
    name: params.name ?? catalog?.name ?? `GLM ${params.id}`,
    reasoning: params.reasoning ?? catalog?.reasoning ?? true,
    input:
      params.input ?? (catalog?.input ? ([...catalog.input] as ("text" | "image")[]) : ["text"]),
    cost: params.cost ?? catalog?.cost ?? ZAI_DEFAULT_COST,
    contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 202800,
    maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 131100,
  };
}
