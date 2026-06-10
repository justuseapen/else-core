<<<<<<< HEAD
import type {
  ModelDefinitionConfig,
  ModelProviderConfig,
} from "openclaw/plugin-sdk/provider-model-shared";
=======
// Stepfun provider module implements model/runtime integration.
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };
>>>>>>> upstream/main

export const STEPFUN_PROVIDER_ID = "stepfun";
export const STEPFUN_PLAN_PROVIDER_ID = "stepfun-plan";

export const STEPFUN_STANDARD_CN_BASE_URL = "https://api.stepfun.com/v1";
export const STEPFUN_STANDARD_INTL_BASE_URL = "https://api.stepfun.ai/v1";
export const STEPFUN_PLAN_CN_BASE_URL = "https://api.stepfun.com/step_plan/v1";
export const STEPFUN_PLAN_INTL_BASE_URL = "https://api.stepfun.ai/step_plan/v1";

<<<<<<< HEAD
export const STEPFUN_DEFAULT_MODEL_ID = "step-3.5-flash";
export const STEPFUN_FLASH_2603_MODEL_ID = "step-3.5-flash-2603";
export const STEPFUN_DEFAULT_MODEL_REF = `${STEPFUN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;
export const STEPFUN_PLAN_DEFAULT_MODEL_REF = `${STEPFUN_PLAN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;

const STEPFUN_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
} as const;

function buildStepFunModel(id: string, name: string): ModelDefinitionConfig {
  return {
    id,
    name,
    reasoning: true,
    input: ["text"],
    cost: STEPFUN_DEFAULT_COST,
    contextWindow: 262_144,
    maxTokens: 65_536,
  };
}

const STEPFUN_STANDARD_MODEL_CATALOG: ReadonlyArray<ModelDefinitionConfig> = [
  buildStepFunModel(STEPFUN_DEFAULT_MODEL_ID, "Step 3.5 Flash"),
];

const STEPFUN_PLAN_MODEL_CATALOG: ReadonlyArray<ModelDefinitionConfig> = [
  buildStepFunModel(STEPFUN_DEFAULT_MODEL_ID, "Step 3.5 Flash"),
  buildStepFunModel(STEPFUN_FLASH_2603_MODEL_ID, "Step 3.5 Flash 2603"),
];

function cloneCatalog(models: ReadonlyArray<ModelDefinitionConfig>): ModelDefinitionConfig[] {
  return models.map((model) => ({ ...model }));
=======
const STEPFUN_DEFAULT_MODEL_ID = "step-3.5-flash";
export const STEPFUN_DEFAULT_MODEL_REF = `${STEPFUN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;
export const STEPFUN_PLAN_DEFAULT_MODEL_REF = `${STEPFUN_PLAN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;

type StepFunManifestProviderId = keyof typeof manifest.modelCatalog.providers;

function buildStepFunManifestProvider(
  providerId: StepFunManifestProviderId,
  baseUrl: string,
): ModelProviderConfig {
  const provider = buildManifestModelProviderConfig({
    providerId,
    catalog: manifest.modelCatalog.providers[providerId],
  });
  return provider.baseUrl === baseUrl ? provider : { ...provider, baseUrl };
>>>>>>> upstream/main
}

export function buildStepFunProvider(
  baseUrl: string = STEPFUN_STANDARD_INTL_BASE_URL,
): ModelProviderConfig {
<<<<<<< HEAD
  return {
    baseUrl,
    api: "openai-completions",
    models: cloneCatalog(STEPFUN_STANDARD_MODEL_CATALOG),
  };
=======
  return buildStepFunManifestProvider(STEPFUN_PROVIDER_ID, baseUrl);
>>>>>>> upstream/main
}

export function buildStepFunPlanProvider(
  baseUrl: string = STEPFUN_PLAN_INTL_BASE_URL,
): ModelProviderConfig {
<<<<<<< HEAD
  return {
    baseUrl,
    api: "openai-completions",
    models: cloneCatalog(STEPFUN_PLAN_MODEL_CATALOG),
  };
=======
  return buildStepFunManifestProvider(STEPFUN_PLAN_PROVIDER_ID, baseUrl);
>>>>>>> upstream/main
}
