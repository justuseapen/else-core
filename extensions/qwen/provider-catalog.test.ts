<<<<<<< HEAD
=======
// Qwen tests cover provider catalog plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import {
  applyQwenNativeStreamingUsageCompat,
  buildQwenProvider,
  QWEN_BASE_URL,
<<<<<<< HEAD
  QWEN_DEFAULT_MODEL_ID,
} from "./api.js";

=======
  QWEN_STANDARD_GLOBAL_BASE_URL,
  QWEN_DEFAULT_MODEL_ID,
} from "./api.js";

type QwenProvider = ReturnType<typeof buildQwenProvider>;

function getQwenModelIds(provider: QwenProvider): string[] {
  return provider.models.map((model) => model.id);
}

>>>>>>> upstream/main
describe("qwen provider catalog", () => {
  it("builds the bundled Qwen provider defaults", () => {
    const provider = buildQwenProvider();

    expect(provider.baseUrl).toBe(QWEN_BASE_URL);
    expect(provider.api).toBe("openai-completions");
<<<<<<< HEAD
    expect(provider.models?.length).toBeGreaterThan(0);
    expect(provider.models?.find((model) => model.id === QWEN_DEFAULT_MODEL_ID)).toBeTruthy();
    expect(provider.models?.find((model) => model.id === "qwen3.6-plus")).toBeTruthy();
=======
    const modelIds = getQwenModelIds(provider);
    expect(modelIds.length).toBeGreaterThan(0);
    expect(modelIds).toContain(QWEN_DEFAULT_MODEL_ID);
    expect(modelIds).not.toContain("qwen3.6-plus");
  });

  it("only advertises qwen3.6-plus on Standard endpoints", () => {
    const coding = buildQwenProvider({ baseUrl: QWEN_BASE_URL });
    const codingTrailingDot = buildQwenProvider({
      baseUrl: " https://coding-intl.dashscope.aliyuncs.com./v1 ",
    });
    const standard = buildQwenProvider({ baseUrl: QWEN_STANDARD_GLOBAL_BASE_URL });

    expect(getQwenModelIds(coding)).not.toContain("qwen3.6-plus");
    expect(getQwenModelIds(codingTrailingDot)).not.toContain("qwen3.6-plus");
    expect(getQwenModelIds(standard)).toContain("qwen3.6-plus");
>>>>>>> upstream/main
  });

  it("opts native Qwen baseUrls into streaming usage only inside the extension", () => {
    const nativeProvider = applyQwenNativeStreamingUsageCompat(buildQwenProvider());
<<<<<<< HEAD
    expect(
      nativeProvider.models?.every((model) => model.compat?.supportsUsageInStreaming === true),
=======
    expect(nativeProvider.models.length).toBeGreaterThan(0);
    expect(
      nativeProvider.models.every((model) => {
        if (!model.compat) {
          throw new Error(`expected Qwen model ${model.id} compat`);
        }
        return model.compat.supportsUsageInStreaming === true;
      }),
>>>>>>> upstream/main
    ).toBe(true);

    const customProvider = applyQwenNativeStreamingUsageCompat({
      ...buildQwenProvider(),
      baseUrl: "https://proxy.example.com/v1",
    });
    expect(
<<<<<<< HEAD
      customProvider.models?.some((model) => model.compat?.supportsUsageInStreaming === true),
=======
      customProvider.models.some(
        (model) => model.compat && model.compat.supportsUsageInStreaming === true,
      ),
>>>>>>> upstream/main
    ).toBe(false);
  });
});
