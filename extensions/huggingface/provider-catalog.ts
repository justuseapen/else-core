<<<<<<< HEAD
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
=======
// Huggingface provider module implements model/runtime integration.
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-types";
>>>>>>> upstream/main
import {
  buildHuggingfaceModelDefinition,
  discoverHuggingfaceModels,
  HUGGINGFACE_BASE_URL,
  HUGGINGFACE_MODEL_CATALOG,
} from "./models.js";
<<<<<<< HEAD

export {
  buildHuggingfaceModelDefinition,
  discoverHuggingfaceModels,
  HUGGINGFACE_BASE_URL,
  HUGGINGFACE_MODEL_CATALOG,
} from "./models.js";
=======
>>>>>>> upstream/main

export async function buildHuggingfaceProvider(
  discoveryApiKey?: string,
): Promise<ModelProviderConfig> {
  const resolvedSecret = discoveryApiKey?.trim() ?? "";
  const models =
    resolvedSecret !== ""
      ? await discoverHuggingfaceModels(resolvedSecret)
      : HUGGINGFACE_MODEL_CATALOG.map(buildHuggingfaceModelDefinition);
  return {
    baseUrl: HUGGINGFACE_BASE_URL,
    api: "openai-completions",
    models,
  };
}
