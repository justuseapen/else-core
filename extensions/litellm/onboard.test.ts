<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { createLegacyProviderConfig } from "../../test/helpers/plugins/onboard-config.js";
=======
// Litellm tests cover onboard plugin behavior.
import { expectProviderOnboardMergedLegacyConfig } from "openclaw/plugin-sdk/provider-test-contracts";
import { describe, expect, it } from "vitest";
>>>>>>> upstream/main
import { applyLitellmProviderConfig } from "./onboard.js";

describe("litellm onboard", () => {
  it("preserves existing baseUrl and api key while adding the default model", () => {
<<<<<<< HEAD
    const cfg = applyLitellmProviderConfig(
      createLegacyProviderConfig({
        providerId: "litellm",
        api: "anthropic-messages",
        modelId: "custom-model",
        modelName: "Custom",
        baseUrl: "https://litellm.example/v1",
        apiKey: "  old-key  ",
      }),
    );

    expect(cfg.models?.providers?.litellm?.baseUrl).toBe("https://litellm.example/v1");
    expect(cfg.models?.providers?.litellm?.api).toBe("openai-completions");
    expect(cfg.models?.providers?.litellm?.apiKey).toBe("old-key");
    expect(cfg.models?.providers?.litellm?.models.map((m) => m.id)).toEqual([
      "custom-model",
      "claude-opus-4-6",
    ]);
=======
    const provider = expectProviderOnboardMergedLegacyConfig({
      applyProviderConfig: applyLitellmProviderConfig,
      providerId: "litellm",
      providerApi: "openai-completions",
      baseUrl: "https://litellm.example/v1",
      legacyApi: "anthropic-messages",
      legacyModelId: "custom-model",
      legacyModelName: "Custom",
      legacyBaseUrl: "https://litellm.example/v1",
      legacyApiKey: "  old-key  ",
    });

    expect(provider?.models.map((m) => m.id)).toEqual(["custom-model", "claude-opus-4-6"]);
>>>>>>> upstream/main
  });
});
