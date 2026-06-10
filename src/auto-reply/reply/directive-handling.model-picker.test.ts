<<<<<<< HEAD
=======
// Tests model picker item construction and provider endpoint labeling.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import {
  buildModelPickerItems,
  resolveProviderEndpointLabel,
} from "./directive-handling.model-picker.js";

describe("directive-handling.model-picker", () => {
<<<<<<< HEAD
  it("dedupes provider aliases when building picker items", () => {
=======
  it("preserves distinct provider ids when building picker items", () => {
>>>>>>> upstream/main
    expect(
      buildModelPickerItems([
        { provider: "z.ai", id: "glm-5" },
        { provider: "z-ai", id: "glm-5" },
      ]),
<<<<<<< HEAD
    ).toEqual([{ provider: "zai", model: "glm-5" }]);
  });

  it("matches provider endpoint labels across canonical aliases", () => {
    const result = resolveProviderEndpointLabel("z-ai", {
=======
    ).toEqual([
      { provider: "z-ai", model: "glm-5" },
      { provider: "z.ai", model: "glm-5" },
    ]);
  });

  it("matches provider endpoint labels for exact provider ids", () => {
    const result = resolveProviderEndpointLabel("z.ai", {
>>>>>>> upstream/main
      models: {
        providers: {
          "z.ai": {
            baseUrl: "https://api.z.ai/api/paas/v4",
            api: "responses",
          },
        },
      },
    } as never);

    expect(result).toEqual({
      endpoint: "https://api.z.ai/api/paas/v4",
      api: "responses",
    });
  });
});
