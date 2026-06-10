<<<<<<< HEAD
import {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "openclaw/plugin-sdk/provider-onboard";
import { describe, expect, it } from "vitest";
import {
  createConfigWithFallbacks,
  EXPECTED_FALLBACKS,
} from "../../test/helpers/plugins/onboard-config.js";
=======
// Opencode tests cover onboard plugin behavior.
import {
  expectProviderOnboardAllowlistAlias,
  expectProviderOnboardPrimaryAndFallbacks,
} from "openclaw/plugin-sdk/provider-test-contracts";
import { describe, it } from "vitest";
>>>>>>> upstream/main
import { applyOpencodeZenConfig, applyOpencodeZenProviderConfig } from "./onboard.js";

const MODEL_REF = "opencode/claude-opus-4-6";

describe("opencode onboard", () => {
  it("adds allowlist entry and preserves alias", () => {
<<<<<<< HEAD
    const withDefault = applyOpencodeZenProviderConfig({});
    expect(Object.keys(withDefault.agents?.defaults?.models ?? {})).toContain(MODEL_REF);

    const withAlias = applyOpencodeZenProviderConfig({
      agents: {
        defaults: {
          models: {
            [MODEL_REF]: { alias: "My Opus" },
          },
        },
      },
    });
    expect(withAlias.agents?.defaults?.models?.[MODEL_REF]?.alias).toBe("My Opus");
  });

  it("sets primary model and preserves existing model fallbacks", () => {
    const cfg = applyOpencodeZenConfig({});
    expect(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model)).toBe(MODEL_REF);

    const cfgWithFallbacks = applyOpencodeZenConfig(createConfigWithFallbacks());
    expect(resolveAgentModelFallbackValues(cfgWithFallbacks.agents?.defaults?.model)).toEqual([
      ...EXPECTED_FALLBACKS,
    ]);
=======
    expectProviderOnboardAllowlistAlias({
      applyProviderConfig: applyOpencodeZenProviderConfig,
      modelRef: MODEL_REF,
      alias: "My Opus",
    });
  });

  it("sets primary model and preserves existing model fallbacks", () => {
    expectProviderOnboardPrimaryAndFallbacks({
      applyConfig: applyOpencodeZenConfig,
      modelRef: MODEL_REF,
    });
>>>>>>> upstream/main
  });
});
