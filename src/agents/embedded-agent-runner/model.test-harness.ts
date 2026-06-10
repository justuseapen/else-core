// Shared model fixtures for embedded runner model resolution tests.
import { vi } from "vitest";
import type { ModelDefinitionConfig } from "../../config/types.js";

type DiscoverModelsMock = typeof import("../agent-model-discovery.js").discoverModels;

export const makeModel = (id: string): ModelDefinitionConfig => ({
  // Smallest valid model row used when tests only care about inheritance or
  // provider routing.
  id,
  name: id,
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1,
  maxTokens: 1,
});

export const OPENAI_CODEX_TEMPLATE_MODEL = {
  id: "gpt-5.3-codex",
  name: "GPT-5.3 Codex",
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.test-harness.ts
  provider: "openai-codex",
  api: "openai-codex-responses",
=======
  provider: "openai",
  api: "openai-chatgpt-responses",
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.test-harness.ts
  baseUrl: "https://chatgpt.com/backend-api",
  reasoning: true,
  input: ["text", "image"] as const,
  cost: { input: 2.5, output: 15, cacheRead: 0.25, cacheWrite: 0 },
  contextWindow: 1_050_000,
  contextTokens: 272_000,
  maxTokens: 128000,
};

function mockTemplateModel(
  discoverModelsMock: DiscoverModelsMock,
  provider: string,
  modelId: string,
  templateModel: unknown,
): void {
  mockDiscoveredModel(discoverModelsMock, {
    provider,
    modelId,
    templateModel,
  });
}

export function mockOpenAICodexTemplateModel(discoverModelsMock: DiscoverModelsMock): void {
  mockTemplateModel(
    discoverModelsMock,
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.test-harness.ts
    "openai-codex",
=======
    "openai",
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.test-harness.ts
    OPENAI_CODEX_TEMPLATE_MODEL.id,
    OPENAI_CODEX_TEMPLATE_MODEL,
  );
}

export function buildOpenAICodexForwardCompatExpectation(
  id = "gpt-5.3-codex",
): Partial<ModelDefinitionConfig> & {
  provider: string;
  id: string;
  api: string;
  baseUrl: string;
} {
  // Expected metadata varies by requested future Codex id while preserving the
  // native ChatGPT Responses transport contract.
  const isGpt54 = id === "gpt-5.4";
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.test-harness.ts
=======
  const isGpt55 = id === "gpt-5.5";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.test-harness.ts
  const isGpt54Mini = id === "gpt-5.4-mini";
  const isSpark = id === "gpt-5.3-codex-spark";
  return {
    provider: "openai",
    id,
    api: "openai-chatgpt-responses",
    baseUrl: "https://chatgpt.com/backend-api",
    reasoning: true,
    input: isSpark ? ["text"] : ["text", "image"],
    cost: isSpark
      ? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
      : isGpt54
        ? { input: 2.5, output: 15, cacheRead: 0.25, cacheWrite: 0 }
        : isGpt54Mini
          ? { input: 0.75, output: 4.5, cacheRead: 0.075, cacheWrite: 0 }
          : OPENAI_CODEX_TEMPLATE_MODEL.cost,
<<<<<<< HEAD:src/agents/pi-embedded-runner/model.test-harness.ts
    contextWindow: isGpt54 ? 1_050_000 : isSpark ? 128_000 : 272000,
    ...(isGpt54 ? { contextTokens: 272_000 } : {}),
=======
    contextWindow: isGpt54
      ? 1_050_000
      : isGpt55 || isGpt54Mini
        ? 400_000
        : isSpark
          ? 128_000
          : 272000,
    ...(isGpt54 || isGpt55 || isGpt54Mini ? { contextTokens: 272_000 } : {}),
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.test-harness.ts
    maxTokens: 128000,
  };
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/model.test-harness.ts
export const GOOGLE_GEMINI_CLI_PRO_TEMPLATE_MODEL = {
  id: "gemini-3-pro-preview",
  name: "Gemini 3 Pro Preview (Cloud Code Assist)",
  provider: "google",
  api: "google-generative-ai",
  baseUrl: "https://cloudcode-pa.googleapis.com",
  reasoning: true,
  input: ["text", "image"] as const,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 200000,
  maxTokens: 64000,
};

export const GOOGLE_GEMINI_CLI_FLASH_TEMPLATE_MODEL = {
  id: "gemini-3-flash-preview",
  name: "Gemini 3 Flash Preview (Cloud Code Assist)",
  provider: "google",
  api: "google-generative-ai",
  baseUrl: "https://cloudcode-pa.googleapis.com",
  reasoning: false,
  input: ["text", "image"] as const,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 200000,
  maxTokens: 64000,
};

export function mockGoogleGeminiCliProTemplateModel(discoverModelsMock: DiscoverModelsMock): void {
  mockTemplateModel(
    discoverModelsMock,
    "google",
    "gemini-3-pro-preview",
    GOOGLE_GEMINI_CLI_PRO_TEMPLATE_MODEL,
  );
}

export function mockGoogleGeminiCliFlashTemplateModel(
  discoverModelsMock: DiscoverModelsMock,
): void {
  mockTemplateModel(
    discoverModelsMock,
    "google",
    "gemini-3-flash-preview",
    GOOGLE_GEMINI_CLI_FLASH_TEMPLATE_MODEL,
  );
}

=======
>>>>>>> upstream/main:src/agents/embedded-agent-runner/model.test-harness.ts
export function resetMockDiscoverModels(discoverModelsMock: DiscoverModelsMock): void {
  vi.mocked(discoverModelsMock).mockReturnValue({
    find: vi.fn(() => null),
  } as unknown as ReturnType<DiscoverModelsMock>);
}

export function mockDiscoveredModel(
  discoverModelsMock: DiscoverModelsMock,
  params: {
    provider: string;
    modelId: string;
    templateModel: unknown;
  },
): void {
  // Discovery mock returns exactly one template row so fallback tests cannot
  // accidentally pass by matching a sibling model.
  vi.mocked(discoverModelsMock).mockReturnValue({
    find: vi.fn((provider: string, modelId: string) => {
      if (provider === params.provider && modelId === params.modelId) {
        return params.templateModel;
      }
      return null;
    }),
  } as unknown as ReturnType<DiscoverModelsMock>);
}
