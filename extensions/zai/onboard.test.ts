<<<<<<< HEAD
import { resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { describe, expect, it } from "vitest";
=======
// Zai tests cover onboard plugin behavior.
import { resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { expectProviderOnboardPreservesPrimary } from "openclaw/plugin-sdk/provider-test-contracts";
import { beforeAll, describe, expect, it } from "vitest";
>>>>>>> upstream/main
import { ZAI_CODING_CN_BASE_URL, ZAI_GLOBAL_BASE_URL } from "./model-definitions.js";
import { applyZaiConfig, applyZaiProviderConfig } from "./onboard.js";

describe("zai onboard", () => {
<<<<<<< HEAD
  it("adds zai provider with correct settings", () => {
    const cfg = applyZaiConfig({});
    expect(cfg.models?.providers?.zai).toMatchObject({
      baseUrl: ZAI_GLOBAL_BASE_URL,
      api: "openai-completions",
    });
    const ids = cfg.models?.providers?.zai?.models?.map((m) => m.id);
    expect(ids).toContain("glm-5");
    expect(ids).toContain("glm-5-turbo");
    expect(ids).toContain("glm-4.7");
    expect(ids).toContain("glm-4.7-flash");
    expect(ids).toContain("glm-4.7-flashx");
  });

  it("supports CN endpoint for supported coding models", () => {
    for (const modelId of ["glm-4.7-flash", "glm-4.7-flashx"] as const) {
      const cfg = applyZaiConfig({}, { endpoint: "coding-cn", modelId });
=======
  let defaultCfg: ReturnType<typeof applyZaiConfig>;
  let cnFlashCfg: ReturnType<typeof applyZaiConfig>;
  let cnFlashxCfg: ReturnType<typeof applyZaiConfig>;

  beforeAll(() => {
    defaultCfg = applyZaiConfig({});
    cnFlashCfg = applyZaiConfig({}, { endpoint: "coding-cn", modelId: "glm-4.7-flash" });
    cnFlashxCfg = applyZaiConfig({}, { endpoint: "coding-cn", modelId: "glm-4.7-flashx" });
  });

  it("adds zai provider with correct settings", () => {
    expect(defaultCfg.models?.providers?.zai?.baseUrl).toBe(ZAI_GLOBAL_BASE_URL);
    expect(defaultCfg.models?.providers?.zai?.api).toBe("openai-completions");
    const ids = defaultCfg.models?.providers?.zai?.models?.map((m) => m.id);
    expect(ids).toEqual([
      "glm-5.1",
      "glm-5",
      "glm-5-turbo",
      "glm-5v-turbo",
      "glm-4.7",
      "glm-4.7-flash",
      "glm-4.7-flashx",
      "glm-4.6",
      "glm-4.6v",
      "glm-4.5",
      "glm-4.5-air",
      "glm-4.5-flash",
      "glm-4.5v",
    ]);
  });

  it("supports CN endpoint for supported coding models", () => {
    for (const [modelId, cfg] of [
      ["glm-4.7-flash", cnFlashCfg],
      ["glm-4.7-flashx", cnFlashxCfg],
    ] as const) {
>>>>>>> upstream/main
      expect(cfg.models?.providers?.zai?.baseUrl).toBe(ZAI_CODING_CN_BASE_URL);
      expect(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model)).toBe(`zai/${modelId}`);
    }
  });

  it("does not overwrite existing primary model in provider-only mode", () => {
<<<<<<< HEAD
    const cfg = applyZaiProviderConfig({
      agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
    });
    expect(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model)).toBe(
      "anthropic/claude-opus-4-5",
    );
=======
    expectProviderOnboardPreservesPrimary({
      applyProviderConfig: applyZaiProviderConfig,
      primaryModelRef: "anthropic/claude-opus-4-5",
    });
>>>>>>> upstream/main
  });
});
