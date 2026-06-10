<<<<<<< HEAD
=======
// Provider utility tests cover provider normalization and utility behavior.
>>>>>>> upstream/main
import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveProviderReasoningOutputModeWithPluginMock } = vi.hoisted(() => ({
  resolveProviderReasoningOutputModeWithPluginMock: vi.fn(),
}));

<<<<<<< HEAD
vi.mock("../plugins/provider-runtime.js", () => ({
  resolveProviderReasoningOutputModeWithPlugin: resolveProviderReasoningOutputModeWithPluginMock,
}));
=======
vi.mock("../plugins/provider-runtime.js", async () => {
  const actual = await vi.importActual<typeof import("../plugins/provider-runtime.js")>(
    "../plugins/provider-runtime.js",
  );
  return {
    ...actual,
    resolveProviderReasoningOutputModeWithPlugin: resolveProviderReasoningOutputModeWithPluginMock,
  };
});
>>>>>>> upstream/main

import { isReasoningTagProvider, resolveReasoningOutputMode } from "./provider-utils.js";

describe("resolveReasoningOutputMode", () => {
  beforeEach(() => {
    resolveProviderReasoningOutputModeWithPluginMock.mockReset();
    resolveProviderReasoningOutputModeWithPluginMock.mockReturnValue(undefined);
  });

<<<<<<< HEAD
  it.each([["google-generative-ai", "tagged"]] as const)(
    "falls back to the built-in map for %s",
=======
  it.each([["google-generative-ai", "native"]] as const)(
    "falls back to native for %s when no plugin override is present",
>>>>>>> upstream/main
    (provider, expected) => {
      expect(resolveReasoningOutputMode({ provider, workspaceDir: process.cwd() })).toBe(expected);
      expect(resolveProviderReasoningOutputModeWithPluginMock).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    ["google", "tagged"],
    ["Google", "tagged"],
    ["google-gemini-cli", "tagged"],
    ["anthropic", "native"],
    ["openai", "native"],
    ["openrouter", "native"],
    ["ollama", "native"],
    ["minimax", "native"],
    ["minimax-cn", "native"],
  ] as const)("prefers provider hooks for %s", (provider, expected) => {
    resolveProviderReasoningOutputModeWithPluginMock.mockReturnValueOnce(expected);

    expect(resolveReasoningOutputMode({ provider, workspaceDir: process.cwd() })).toBe(expected);
    expect(resolveProviderReasoningOutputModeWithPluginMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to provider hooks for unknown providers", () => {
    resolveProviderReasoningOutputModeWithPluginMock.mockReturnValue("tagged");

    expect(
      resolveReasoningOutputMode({
        provider: "custom-provider",
        workspaceDir: process.cwd(),
        modelId: "custom/model",
      }),
    ).toBe("tagged");
    expect(resolveProviderReasoningOutputModeWithPluginMock).toHaveBeenCalledTimes(1);
  });

  it("returns native when hooks do not provide an override", () => {
    expect(resolveReasoningOutputMode({ provider: "custom-provider" })).toBe("native");
    expect(resolveProviderReasoningOutputModeWithPluginMock).toHaveBeenCalledTimes(1);
  });
});

describe("isReasoningTagProvider", () => {
  beforeEach(() => {
    resolveProviderReasoningOutputModeWithPluginMock.mockReset();
    resolveProviderReasoningOutputModeWithPluginMock.mockReturnValue(undefined);
  });

  it.each([
<<<<<<< HEAD
    ["google-generative-ai", true],
=======
    ["google-generative-ai", false],
>>>>>>> upstream/main
    [null, false],
    [undefined, false],
    ["", false],
  ] as const)("returns %s for %s", (value, expected) => {
    expect(isReasoningTagProvider(value, { workspaceDir: process.cwd() })).toBe(expected);
  });

  it.each([
    ["google", true],
    ["Google", true],
    ["google-gemini-cli", true],
    ["anthropic", false],
    ["openai", false],
    ["openrouter", false],
    ["ollama", false],
    ["minimax", false],
    ["minimax-cn", false],
  ] as const)("uses provider hooks when available for %s", (value, expected) => {
    resolveProviderReasoningOutputModeWithPluginMock.mockReturnValueOnce(
      expected ? "tagged" : "native",
    );

    expect(isReasoningTagProvider(value, { workspaceDir: process.cwd() })).toBe(expected);
    expect(resolveProviderReasoningOutputModeWithPluginMock).toHaveBeenCalledTimes(1);
  });
});
