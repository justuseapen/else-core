<<<<<<< HEAD
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { buildTogetherModelDefinition, TOGETHER_BASE_URL, TOGETHER_MODEL_CATALOG } from "./api.js";
=======
// Together provider module implements model/runtime integration.
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };
>>>>>>> upstream/main

export function buildTogetherProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "together",
    catalog: manifest.modelCatalog.providers.together,
  });
}
