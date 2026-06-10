// Manual facade. Keep loader boundary explicit.
<<<<<<< HEAD
type FacadeModule = typeof import("@openclaw/vercel-ai-gateway/api.js");
import {
  createLazyFacadeObjectValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-runtime.js";
=======
import type { ModelDefinitionConfig, ModelProviderConfig } from "../config/types.js";
import {
  createLazyFacadeObjectValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-loader.js";

type ModelCost = ModelDefinitionConfig["cost"];

type FacadeModule = {
  buildVercelAiGatewayProvider: () => Promise<ModelProviderConfig>;
  discoverVercelAiGatewayModels: () => Promise<ModelDefinitionConfig[]>;
  getStaticVercelAiGatewayModelCatalog: () => ModelDefinitionConfig[];
  VERCEL_AI_GATEWAY_BASE_URL: string;
  VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: number;
  VERCEL_AI_GATEWAY_DEFAULT_COST: ModelCost;
  VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: number;
  VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: string;
  VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: string;
  VERCEL_AI_GATEWAY_PROVIDER_ID: string;
};
>>>>>>> upstream/main

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "vercel-ai-gateway",
    artifactBasename: "api.js",
  });
}
<<<<<<< HEAD
=======
/** Build the Vercel AI Gateway provider config through the bundled provider facade. */
>>>>>>> upstream/main
export const buildVercelAiGatewayProvider: FacadeModule["buildVercelAiGatewayProvider"] = ((
  ...args
) =>
  loadFacadeModule()["buildVercelAiGatewayProvider"](
    ...args,
  )) as FacadeModule["buildVercelAiGatewayProvider"];
<<<<<<< HEAD
=======
/** Discover Vercel AI Gateway models through the bundled provider facade. */
>>>>>>> upstream/main
export const discoverVercelAiGatewayModels: FacadeModule["discoverVercelAiGatewayModels"] = ((
  ...args
) =>
  loadFacadeModule()["discoverVercelAiGatewayModels"](
    ...args,
  )) as FacadeModule["discoverVercelAiGatewayModels"];
<<<<<<< HEAD
=======
/** Return the static Vercel AI Gateway model catalog used before live discovery. */
>>>>>>> upstream/main
export const getStaticVercelAiGatewayModelCatalog: FacadeModule["getStaticVercelAiGatewayModelCatalog"] =
  ((...args) =>
    loadFacadeModule()["getStaticVercelAiGatewayModelCatalog"](
      ...args,
    )) as FacadeModule["getStaticVercelAiGatewayModelCatalog"];
<<<<<<< HEAD
export const VERCEL_AI_GATEWAY_BASE_URL: FacadeModule["VERCEL_AI_GATEWAY_BASE_URL"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_BASE_URL"];
export const VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"];
=======
/** Default Vercel AI Gateway base URL. */
export const VERCEL_AI_GATEWAY_BASE_URL: FacadeModule["VERCEL_AI_GATEWAY_BASE_URL"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_BASE_URL"];
/** Default context window assigned to Vercel AI Gateway models without catalog metadata. */
export const VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"];
/** Default cost metadata assigned to Vercel AI Gateway models without catalog metadata. */
>>>>>>> upstream/main
export const VERCEL_AI_GATEWAY_DEFAULT_COST: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_COST"] =
  createLazyFacadeObjectValue(
    () => loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_COST"] as object,
  ) as FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_COST"];
<<<<<<< HEAD
export const VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"];
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"];
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"];
=======
/** Default max-token value assigned to Vercel AI Gateway models without catalog metadata. */
export const VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"];
/** Default Vercel AI Gateway model id used by setup flows. */
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"];
/** Default Vercel AI Gateway provider/model reference written by setup flows. */
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"];
/** Provider id used for Vercel AI Gateway config and model refs. */
>>>>>>> upstream/main
export const VERCEL_AI_GATEWAY_PROVIDER_ID: FacadeModule["VERCEL_AI_GATEWAY_PROVIDER_ID"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_PROVIDER_ID"];
