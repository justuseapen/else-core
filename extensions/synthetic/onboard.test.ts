<<<<<<< HEAD
import { resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { describe, expect, it } from "vitest";
import { createLegacyProviderConfig } from "../../test/helpers/plugins/onboard-config.js";
import { SYNTHETIC_DEFAULT_MODEL_REF as SYNTHETIC_DEFAULT_MODEL_REF_PUBLIC } from "./api.js";
=======
// Synthetic tests cover onboard plugin behavior.
import { resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { expectProviderOnboardMergedLegacyConfig } from "openclaw/plugin-sdk/provider-test-contracts";
import { beforeAll, describe, expect, it } from "vitest";
import { SYNTHETIC_DEFAULT_MODEL_REF as SYNTHETIC_DEFAULT_MODEL_REF_PUBLIC } from "./api.js";
import { buildSyntheticModelDefinition, SYNTHETIC_MODEL_CATALOG } from "./models.js";
>>>>>>> upstream/main
import {
  applySyntheticConfig,
  applySyntheticProviderConfig,
  SYNTHETIC_DEFAULT_MODEL_REF,
} from "./onboard.js";

describe("synthetic onboard", () => {
<<<<<<< HEAD
  it("adds synthetic provider with correct settings", () => {
    const cfg = applySyntheticConfig({});
    expect(cfg.models?.providers?.synthetic).toMatchObject({
      baseUrl: "https://api.synthetic.new/anthropic",
      api: "anthropic-messages",
    });
    expect(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model)).toBe(
      SYNTHETIC_DEFAULT_MODEL_REF_PUBLIC,
=======
  let defaultCfg: ReturnType<typeof applySyntheticConfig>;
  let mergedProvider: ReturnType<typeof expectProviderOnboardMergedLegacyConfig>;

  beforeAll(() => {
    defaultCfg = applySyntheticConfig({});
    mergedProvider = expectProviderOnboardMergedLegacyConfig({
      applyProviderConfig: applySyntheticProviderConfig,
      providerId: "synthetic",
      providerApi: "anthropic-messages",
      baseUrl: "https://api.synthetic.new/anthropic",
      legacyApi: "openai-completions",
    });
  });

  it("adds synthetic provider with correct settings", () => {
    const provider = defaultCfg.models?.providers?.synthetic;
    expect(provider?.baseUrl).toBe("https://api.synthetic.new/anthropic");
    expect(provider?.api).toBe("anthropic-messages");
    expect(provider?.models.map((model) => model.id)).toContain(
      SYNTHETIC_DEFAULT_MODEL_REF.replace(/^synthetic\//, ""),
    );
    expect(defaultCfg.agents?.defaults?.models?.[SYNTHETIC_DEFAULT_MODEL_REF]).toEqual({
      alias: "MiniMax M2.5",
    });
    expect(defaultCfg.agents?.defaults?.model).toEqual({
      primary: "synthetic/hf:MiniMaxAI/MiniMax-M2.5",
    });
    expect(provider).toEqual({
      baseUrl: "https://api.synthetic.new/anthropic",
      api: "anthropic-messages",
      models: SYNTHETIC_MODEL_CATALOG.map(buildSyntheticModelDefinition),
    });
  });

  it("keeps the public default model ref aligned", () => {
    expect(SYNTHETIC_DEFAULT_MODEL_REF).toBe(SYNTHETIC_DEFAULT_MODEL_REF_PUBLIC);
    expect(resolveAgentModelPrimaryValue(defaultCfg.agents?.defaults?.model)).toBe(
      SYNTHETIC_DEFAULT_MODEL_REF,
>>>>>>> upstream/main
    );
  });

  it("merges existing synthetic provider models", () => {
<<<<<<< HEAD
    const cfg = applySyntheticProviderConfig(
      createLegacyProviderConfig({
        providerId: "synthetic",
        api: "openai-completions",
      }),
    );
    expect(cfg.models?.providers?.synthetic?.baseUrl).toBe("https://api.synthetic.new/anthropic");
    expect(cfg.models?.providers?.synthetic?.api).toBe("anthropic-messages");
    expect(cfg.models?.providers?.synthetic?.apiKey).toBe("old-key");
    const ids = cfg.models?.providers?.synthetic?.models.map((m) => m.id);
=======
    const ids = mergedProvider?.models.map((m) => m.id);
>>>>>>> upstream/main
    expect(ids).toContain("old-model");
    expect(ids).toContain(SYNTHETIC_DEFAULT_MODEL_REF.replace(/^synthetic\//, ""));
  });
});
