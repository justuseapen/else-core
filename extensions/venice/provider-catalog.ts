<<<<<<< HEAD
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { discoverVeniceModels, VENICE_BASE_URL } from "./api.js";
=======
// Venice provider module implements model/runtime integration.
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { discoverVeniceModels, VENICE_BASE_URL } from "./models.js";
>>>>>>> upstream/main

export async function buildVeniceProvider(): Promise<ModelProviderConfig> {
  const models = await discoverVeniceModels();
  return {
    baseUrl: VENICE_BASE_URL,
    api: "openai-completions",
    models,
  };
}
