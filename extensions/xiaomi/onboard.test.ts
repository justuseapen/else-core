<<<<<<< HEAD
import { resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { describe, expect, it } from "vitest";
import { createLegacyProviderConfig } from "../../test/helpers/plugins/onboard-config.js";
import { applyXiaomiConfig, applyXiaomiProviderConfig } from "./onboard.js";
=======
// Xiaomi tests cover onboard plugin behavior.
import {
  expectProviderOnboardMergedLegacyConfig,
  expectProviderOnboardPrimaryModel,
} from "openclaw/plugin-sdk/provider-test-contracts";
import { describe, expect, it } from "vitest";
import {
  applyXiaomiConfig,
  applyXiaomiProviderConfig,
  applyXiaomiTokenPlanConfig,
  applyXiaomiTokenPlanProviderConfig,
} from "./onboard.js";
import { buildXiaomiProvider, buildXiaomiTokenPlanProvider } from "./provider-catalog.js";
>>>>>>> upstream/main

describe("xiaomi onboard", () => {
  it("adds Xiaomi provider with correct settings", () => {
    const cfg = applyXiaomiConfig({});
<<<<<<< HEAD
    expect(cfg.models?.providers?.xiaomi).toMatchObject({
      baseUrl: "https://api.xiaomimimo.com/v1",
      api: "openai-completions",
    });
    expect(cfg.models?.providers?.xiaomi?.models.map((m) => m.id)).toEqual([
=======
    const provider = cfg.models?.providers?.xiaomi;
    expect(provider).toEqual(buildXiaomiProvider());
    expect(provider?.models.map((m) => m.id)).toEqual([
>>>>>>> upstream/main
      "mimo-v2-flash",
      "mimo-v2-pro",
      "mimo-v2-omni",
    ]);
<<<<<<< HEAD
    expect(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model)).toBe("xiaomi/mimo-v2-flash");
  });

  it("merges Xiaomi models and keeps existing provider overrides", () => {
    const cfg = applyXiaomiProviderConfig(
      createLegacyProviderConfig({
        providerId: "xiaomi",
        api: "openai-completions",
        modelId: "custom-model",
        modelName: "Custom",
      }),
    );

    expect(cfg.models?.providers?.xiaomi?.baseUrl).toBe("https://api.xiaomimimo.com/v1");
    expect(cfg.models?.providers?.xiaomi?.api).toBe("openai-completions");
    expect(cfg.models?.providers?.xiaomi?.apiKey).toBe("old-key");
    expect(cfg.models?.providers?.xiaomi?.models.map((m) => m.id)).toEqual([
=======
    expect(cfg.agents?.defaults?.models?.["xiaomi/mimo-v2-flash"]).toEqual({ alias: "Xiaomi" });
    expect(cfg.agents?.defaults?.model).toEqual({ primary: "xiaomi/mimo-v2-flash" });
    expectProviderOnboardPrimaryModel({
      applyConfig: applyXiaomiConfig,
      modelRef: "xiaomi/mimo-v2-flash",
    });
  });

  it("merges Xiaomi models and keeps existing provider overrides", () => {
    const provider = expectProviderOnboardMergedLegacyConfig({
      applyProviderConfig: applyXiaomiProviderConfig,
      providerId: "xiaomi",
      providerApi: "openai-completions",
      baseUrl: "https://api.xiaomimimo.com/v1",
      legacyApi: "openai-completions",
      legacyModelId: "custom-model",
      legacyModelName: "Custom",
    });
    expect(provider?.models.map((m) => m.id)).toEqual([
>>>>>>> upstream/main
      "custom-model",
      "mimo-v2-flash",
      "mimo-v2-pro",
      "mimo-v2-omni",
    ]);
  });
<<<<<<< HEAD
=======

  it("adds Xiaomi Token Plan provider with a regional endpoint preset", () => {
    const cfg = applyXiaomiTokenPlanConfig({}, "ams");
    const provider = cfg.models?.providers?.["xiaomi-token-plan"];
    expect(provider).toEqual({
      ...buildXiaomiTokenPlanProvider(),
      baseUrl: "https://token-plan-ams.xiaomimimo.com/v1",
    });
    expect(provider?.models.map((m) => m.id)).toEqual(["mimo-v2.5-pro", "mimo-v2.5"]);
    expect(cfg.agents?.defaults?.models?.["xiaomi-token-plan/mimo-v2.5-pro"]).toEqual({
      alias: "Xiaomi MiMo V2.5 Pro",
    });
    expect(cfg.agents?.defaults?.model).toEqual({ primary: "xiaomi-token-plan/mimo-v2.5-pro" });
    expectProviderOnboardPrimaryModel({
      applyConfig: (config) => applyXiaomiTokenPlanConfig(config, "ams"),
      modelRef: "xiaomi-token-plan/mimo-v2.5-pro",
    });
  });

  it("merges Xiaomi Token Plan models and rewrites the selected regional base URL", () => {
    const provider = expectProviderOnboardMergedLegacyConfig({
      applyProviderConfig: (config) => applyXiaomiTokenPlanProviderConfig(config, "sgp"),
      providerId: "xiaomi-token-plan",
      providerApi: "openai-completions",
      baseUrl: "https://token-plan-sgp.xiaomimimo.com/v1",
      legacyApi: "openai-completions",
      legacyModelId: "custom-token-plan-model",
      legacyModelName: "Custom Token Plan",
    });
    expect(provider?.models.map((m) => m.id)).toEqual([
      "custom-token-plan-model",
      "mimo-v2.5-pro",
      "mimo-v2.5",
    ]);
  });
>>>>>>> upstream/main
});
