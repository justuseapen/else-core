// Onboard custom tests cover custom provider prompts and API-key credential handling.
import { afterEach, describe, expect, it, vi } from "vitest";
<<<<<<< HEAD
import { CONTEXT_WINDOW_HARD_MIN_TOKENS } from "../agents/context-window-guard.js";
import type { OpenClawConfig } from "../config/config.js";
import { defaultRuntime } from "../runtime.js";
import {
  applyCustomApiConfig,
  parseNonInteractiveCustomApiFlags,
  promptCustomApiConfig,
} from "./onboard-custom.js";

const OLLAMA_DEFAULT_BASE_URL_FOR_TEST = "http://127.0.0.1:11434";

// Mock dependencies
vi.mock("./model-picker.js", () => ({
  applyPrimaryModel: vi.fn((cfg) => cfg),
=======
import type { ensureApiKeyFromEnvOrPrompt } from "../plugins/provider-auth-input.js";
import { promptCustomApiConfig } from "./onboard-custom.js";

vi.mock("../plugins/provider-auth-input.js", () => ({
  ensureApiKeyFromEnvOrPrompt: vi.fn(
    async (params: Parameters<typeof ensureApiKeyFromEnvOrPrompt>[0]) => {
      await params.prompter.select({ message: "Secret input mode", options: [] });
      const input = await params.prompter.text({
        message: params.promptMessage,
        validate: params.validate,
      });
      const apiKey = params.normalize(input ?? "");
      await params.setCredential(apiKey);
      return apiKey;
    },
  ),
>>>>>>> upstream/main
}));

function createTestPrompter(params: { text: string[]; select?: string[]; confirm?: boolean[] }): {
  text: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  confirm: ReturnType<typeof vi.fn>;
  note: ReturnType<typeof vi.fn>;
  progress: ReturnType<typeof vi.fn>;
} {
  const text = vi.fn();
  for (const answer of params.text) {
    text.mockResolvedValueOnce(answer);
  }
  const select = vi.fn();
  for (const answer of params.select ?? []) {
    select.mockResolvedValueOnce(answer);
  }
  const confirm = vi.fn(async () => false);
  for (const answer of params.confirm ?? []) {
    confirm.mockResolvedValueOnce(answer);
  }
  return {
    text,
    progress: vi.fn(() => ({
      update: vi.fn(),
      stop: vi.fn(),
    })),
    select,
    confirm,
    note: vi.fn(),
  };
}

function stubFetchSequence(
  responses: Array<{ ok: boolean; status?: number }>,
): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn();
  for (const response of responses) {
    fetchMock.mockResolvedValueOnce({
      ok: response.ok,
      status: response.status,
      headers: new Headers({ "content-type": "application/json; charset=utf-8" }),
      json: async () => ({}),
    });
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function runPromptCustomApi(
  prompter: ReturnType<typeof createTestPrompter>,
  config: object = {},
) {
  return promptCustomApiConfig({
    prompter: prompter as unknown as Parameters<typeof promptCustomApiConfig>[0]["prompter"],
    runtime: { log: vi.fn() } as unknown as Parameters<typeof promptCustomApiConfig>[0]["runtime"],
    config,
  });
}

function expectOpenAiCompatResult(params: {
  prompter: ReturnType<typeof createTestPrompter>;
  textCalls: number;
  selectCalls: number;
  result: Awaited<ReturnType<typeof runPromptCustomApi>>;
}) {
  expect(params.prompter.text).toHaveBeenCalledTimes(params.textCalls);
  expect(params.prompter.select).toHaveBeenCalledTimes(params.selectCalls);
  expect(params.result.config.models?.providers?.custom?.api).toBe("openai-completions");
}

describe("promptCustomApiConfig", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("handles openai flow and saves alias", async () => {
    const prompter = createTestPrompter({
      text: ["http://localhost:11434/v1", "", "llama3", "custom", "local"],
      select: ["plaintext", "openai"],
    });
    stubFetchSequence([{ ok: true }]);
    const result = await runPromptCustomApi(prompter);

    expectOpenAiCompatResult({ prompter, textCalls: 5, selectCalls: 2, result });
    expect(result.config.agents?.defaults?.models?.["custom/llama3"]?.alias).toBe("local");
    expect(result.config.models?.providers?.custom?.models?.[0]?.input).toEqual(["text"]);
    expect(prompter.confirm).not.toHaveBeenCalled();
  });

  it("handles explicit OpenAI Responses flow", async () => {
    const prompter = createTestPrompter({
      text: ["https://proxy.example.com/v1", "test-key", "gpt-5.4", "custom", ""],
      select: ["plaintext", "openai-responses"],
    });
    const fetchMock = stubFetchSequence([{ ok: true }]);

    const result = await runPromptCustomApi(prompter);

    expect(result.config.models?.providers?.custom?.api).toBe("openai-responses");
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://proxy.example.com/v1/responses");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      model: "gpt-5.4",
      input: "Hi",
      max_output_tokens: 16,
    });
  });

  it("skips the image-input prompt for known custom vision models", async () => {
    const prompter = createTestPrompter({
      text: ["https://proxy.example.com/v1", "test-key", "gpt-4o", "custom", ""],
      select: ["plaintext", "openai"],
    });
    stubFetchSequence([{ ok: true }]);

    const result = await runPromptCustomApi(prompter);

    expect(result.config.models?.providers?.custom?.models?.[0]?.input).toEqual(["text", "image"]);
    expect(prompter.confirm).not.toHaveBeenCalled();
  });

  it("prompts for custom model image support when the model is unknown", async () => {
    const prompter = createTestPrompter({
      text: ["https://proxy.example.com/v1", "test-key", "private-model", "custom", ""],
      select: ["plaintext", "openai"],
      confirm: [true],
    });
    stubFetchSequence([{ ok: true }]);

    const result = await runPromptCustomApi(prompter);

    expect(result.config.models?.providers?.custom?.models?.[0]?.input).toEqual(["text", "image"]);
    expect(prompter.confirm).toHaveBeenCalledWith({
      message: "Does this model support image input?",
      initialValue: false,
    });
  });

  it("does not seed custom setup with a provider-specific base URL", async () => {
    const prompter = createTestPrompter({
      text: ["http://localhost:11434", "", "llama3", "custom", ""],
      select: ["plaintext", "openai"],
    });
    stubFetchSequence([{ ok: true }]);

    await runPromptCustomApi(prompter);

<<<<<<< HEAD
    expect(prompter.text).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "API Base URL",
        initialValue: OLLAMA_DEFAULT_BASE_URL_FOR_TEST,
      }),
=======
    const apiBaseUrlCall = prompter.text.mock.calls.find(
      ([options]) => options.message === "API Base URL",
>>>>>>> upstream/main
    );
    expect(apiBaseUrlCall?.[0].initialValue).toBeUndefined();
  });

  it("retries when verification fails", async () => {
    const prompter = createTestPrompter({
      text: ["http://localhost:11434/v1", "", "bad-model", "good-model", "custom", ""],
      select: ["plaintext", "openai", "model"],
    });
    stubFetchSequence([{ ok: false, status: 400 }, { ok: true }]);
    await runPromptCustomApi(prompter);

    expect(prompter.text).toHaveBeenCalledTimes(6);
    expect(prompter.select).toHaveBeenCalledTimes(3);
  });

  it("rejects successful-looking HTML verification responses with a base URL hint", async () => {
    const prompter = createTestPrompter({
      text: [
        "https://proxy.example.com",
        "test-key",
        "bad-model",
        "https://proxy.example.com/v1",
        "test-key",
        "custom",
        "",
      ],
      select: ["plaintext", "openai", "baseUrl", "plaintext"],
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
        text: async () => "<html>not the API</html>",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });
    vi.stubGlobal("fetch", fetchMock);

    await runPromptCustomApi(prompter);

    expect(prompter.progress.mock.results[0]?.value.stop).toHaveBeenCalledWith(
      expect.stringContaining("usually need a /v1 path prefix"),
    );
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://proxy.example.com/chat/completions");
    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://proxy.example.com/v1/chat/completions");
  });

  it("detects openai compatibility when unknown", async () => {
    const prompter = createTestPrompter({
      text: ["https://example.com/v1", "test-key", "detected-model", "custom", "alias"],
      select: ["plaintext", "unknown"],
    });
    stubFetchSequence([{ ok: true }]);
    const result = await runPromptCustomApi(prompter);

    expectOpenAiCompatResult({ prompter, textCalls: 5, selectCalls: 2, result });
  });

  it("detects OpenAI Responses compatibility when chat completions fail", async () => {
    const prompter = createTestPrompter({
      text: ["https://example.com/v1", "test-key", "detected-model", "custom", "alias"],
      select: ["plaintext", "unknown"],
    });
    const fetchMock = stubFetchSequence([{ ok: false, status: 503 }, { ok: true }]);

    const result = await runPromptCustomApi(prompter);

    expect(result.config.models?.providers?.custom?.api).toBe("openai-responses");
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://example.com/v1/chat/completions");
    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://example.com/v1/responses");
    expect(prompter.text).toHaveBeenCalledTimes(5);
    expect(prompter.select).toHaveBeenCalledTimes(2);
  });

  it("re-prompts base url when unknown detection fails", async () => {
    const prompter = createTestPrompter({
      text: [
        "https://bad.example.com/v1",
        "bad-key",
        "bad-model",
        "https://ok.example.com/v1",
        "ok-key",
        "custom",
        "",
      ],
      select: ["plaintext", "unknown", "baseUrl", "plaintext"],
    });
    stubFetchSequence([
      { ok: false, status: 404 },
      { ok: false, status: 404 },
      { ok: false, status: 404 },
      { ok: true },
    ]);
    await runPromptCustomApi(prompter);

    expect(prompter.note).toHaveBeenCalledWith(
      "This endpoint did not respond to OpenAI Chat, OpenAI Responses, or Anthropic style requests.",
      "Endpoint detection",
    );
  });

  it("aborts verification after timeout", async () => {
    vi.useFakeTimers();
    const prompter = createTestPrompter({
      text: ["http://localhost:11434/v1", "", "slow-model", "fast-model", "custom", ""],
      select: ["plaintext", "openai", "model"],
    });

    const fetchMock = vi
      .fn()
      .mockImplementationOnce((_url: string, init?: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("AbortError")));
        });
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    const promise = runPromptCustomApi(prompter);

    await vi.advanceTimersByTimeAsync(30_000);
    await promise;

    expect(prompter.text).toHaveBeenCalledTimes(6);
  });
<<<<<<< HEAD

  it("stores env SecretRef for custom provider when selected", async () => {
    vi.stubEnv("CUSTOM_PROVIDER_API_KEY", "test-env-key");
    const prompter = createTestPrompter({
      text: ["https://example.com/v1", "CUSTOM_PROVIDER_API_KEY", "detected-model", "custom", ""],
      select: ["ref", "env", "openai"],
    });
    const fetchMock = stubFetchSequence([{ ok: true }]);

    const result = await runPromptCustomApi(prompter);

    expect(result.config.models?.providers?.custom?.apiKey).toEqual({
      source: "env",
      provider: "default",
      id: "CUSTOM_PROVIDER_API_KEY",
    });
    const firstCall = fetchMock.mock.calls[0]?.[1] as
      | { headers?: Record<string, string> }
      | undefined;
    expect(firstCall?.headers?.Authorization).toBe("Bearer test-env-key");
  });

  it("re-prompts source after provider ref preflight fails and succeeds with env ref", async () => {
    vi.stubEnv("CUSTOM_PROVIDER_API_KEY", "test-env-key");
    const prompter = createTestPrompter({
      text: [
        "https://example.com/v1",
        "/providers/custom/apiKey",
        "CUSTOM_PROVIDER_API_KEY",
        "detected-model",
        "custom",
        "",
      ],
      select: ["ref", "provider", "filemain", "env", "openai"],
    });
    stubFetchSequence([{ ok: true }]);

    const result = await runPromptCustomApi(prompter, {
      secrets: {
        providers: {
          filemain: {
            source: "file",
            path: "/tmp/openclaw-missing-provider.json",
            mode: "json",
          },
        },
      },
    });

    expect(prompter.note).toHaveBeenCalledWith(
      expect.stringContaining("Could not validate provider reference"),
      "Reference check failed",
    );
    expect(result.config.models?.providers?.custom?.apiKey).toEqual({
      source: "env",
      provider: "default",
      id: "CUSTOM_PROVIDER_API_KEY",
    });
  });
});

describe("applyCustomApiConfig", () => {
  it.each([
    {
      name: "uses hard-min context window for newly added custom models",
      existingContextWindow: undefined,
      expectedContextWindow: CONTEXT_WINDOW_HARD_MIN_TOKENS,
    },
    {
      name: "upgrades existing custom model context window when below hard minimum",
      existingContextWindow: 4096,
      expectedContextWindow: CONTEXT_WINDOW_HARD_MIN_TOKENS,
    },
    {
      name: "preserves existing custom model context window when already above minimum",
      existingContextWindow: 131072,
      expectedContextWindow: 131072,
    },
  ])("$name", ({ existingContextWindow, expectedContextWindow }) => {
    const result = applyCustomModelConfigWithContextWindow(existingContextWindow);
    const model = result.config.models?.providers?.custom?.models?.find(
      (entry) => entry.id === "foo-large",
    );
    expect(model?.contextWindow).toBe(expectedContextWindow);
  });

  it.each([
    {
      name: "invalid compatibility values at runtime",
      params: {
        config: {},
        baseUrl: "https://llm.example.com/v1",
        modelId: "foo-large",
        compatibility: "invalid" as unknown as "openai",
      },
      expectedMessage: 'Custom provider compatibility must be "openai" or "anthropic".',
    },
    {
      name: "explicit provider ids that normalize to empty",
      params: {
        config: {},
        baseUrl: "https://llm.example.com/v1",
        modelId: "foo-large",
        compatibility: "openai" as const,
        providerId: "!!!",
      },
      expectedMessage: "Custom provider ID must include letters, numbers, or hyphens.",
    },
  ])("rejects $name", ({ params, expectedMessage }) => {
    expect(() => applyCustomApiConfig(params)).toThrow(expectedMessage);
  });

  it("produces azure-specific config for Azure OpenAI URLs with reasoning model", () => {
    const result = applyCustomApiConfig({
      config: {},
      baseUrl: "https://user123-resource.openai.azure.com",
      modelId: "o4-mini",
      compatibility: "openai",
      apiKey: "abcd1234",
    });
    const providerId = result.providerId!;
    const provider = result.config.models?.providers?.[providerId];

    expect(provider?.baseUrl).toBe("https://user123-resource.openai.azure.com/openai/v1");
    expect(provider?.api).toBe("azure-openai-responses");
    expect(provider?.authHeader).toBe(false);
    expect(provider?.headers).toEqual({ "api-key": "abcd1234" });

    const model = provider?.models?.find((m) => m.id === "o4-mini");
    expect(model?.input).toEqual(["text", "image"]);
    expect(model?.reasoning).toBe(true);
    expect(model?.compat).toEqual({ supportsStore: false });

    const modelRef = `${providerId}/${result.modelId}`;
    expect(result.config.agents?.defaults?.models?.[modelRef]?.params?.thinking).toBe("medium");
  });

  it("keeps selected compatibility for Azure AI Foundry URLs", () => {
    const result = applyCustomApiConfig({
      config: {},
      baseUrl: "https://my-resource.services.ai.azure.com",
      modelId: "gpt-4.1",
      compatibility: "openai",
      apiKey: "key123",
    });
    const providerId = result.providerId!;
    const provider = result.config.models?.providers?.[providerId];

    expect(provider?.baseUrl).toBe("https://my-resource.services.ai.azure.com/openai/v1");
    expect(provider?.api).toBe("openai-completions");
    expect(provider?.authHeader).toBe(false);
    expect(provider?.headers).toEqual({ "api-key": "key123" });

    const model = provider?.models?.find((m) => m.id === "gpt-4.1");
    expect(model?.reasoning).toBe(false);
    expect(model?.input).toEqual(["text"]);
    expect(model?.compat).toEqual({ supportsStore: false });

    const modelRef = `${providerId}/gpt-4.1`;
    expect(result.config.agents?.defaults?.models?.[modelRef]?.params?.thinking).toBeUndefined();
  });

  it("strips pre-existing deployment path from Azure URL in stored config", () => {
    const result = applyCustomApiConfig({
      config: {},
      baseUrl: "https://my-resource.openai.azure.com/openai/deployments/gpt-4",
      modelId: "gpt-4",
      compatibility: "openai",
      apiKey: "key456",
    });
    const providerId = result.providerId!;
    const provider = result.config.models?.providers?.[providerId];

    expect(provider?.baseUrl).toBe("https://my-resource.openai.azure.com/openai/v1");
  });

  it("re-onboard updates existing Azure provider instead of creating a duplicate", () => {
    const oldProviderId = "custom-my-resource-openai-azure-com";
    const result = applyCustomApiConfig({
      config: {
        models: {
          providers: {
            [oldProviderId]: {
              baseUrl: "https://my-resource.openai.azure.com/openai/deployments/gpt-4",
              api: "openai-completions",
              models: [
                {
                  id: "gpt-4",
                  name: "gpt-4",
                  contextWindow: 1,
                  maxTokens: 1,
                  input: ["text"],
                  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                  reasoning: false,
                },
              ],
            },
          },
        },
      },
      baseUrl: "https://my-resource.openai.azure.com",
      modelId: "gpt-4",
      compatibility: "openai",
      apiKey: "key789",
    });

    expect(result.providerId).toBe(oldProviderId);
    expect(result.providerIdRenamedFrom).toBeUndefined();
    const provider = result.config.models?.providers?.[oldProviderId];
    expect(provider?.baseUrl).toBe("https://my-resource.openai.azure.com/openai/v1");
    expect(provider?.api).toBe("azure-openai-responses");
    expect(provider?.authHeader).toBe(false);
    expect(provider?.headers).toEqual({ "api-key": "key789" });
  });

  it("does not add azure fields for non-azure URLs", () => {
    const result = applyCustomApiConfig({
      config: {},
      baseUrl: "https://llm.example.com/v1",
      modelId: "foo-large",
      compatibility: "openai",
      apiKey: "key123",
      providerId: "custom",
    });
    const provider = result.config.models?.providers?.custom;

    expect(provider?.api).toBe("openai-completions");
    expect(provider?.authHeader).toBeUndefined();
    expect(provider?.headers).toBeUndefined();
    expect(provider?.models?.[0]?.reasoning).toBe(false);
    expect(provider?.models?.[0]?.input).toEqual(["text"]);
    expect(provider?.models?.[0]?.compat).toBeUndefined();
    expect(
      result.config.agents?.defaults?.models?.["custom/foo-large"]?.params?.thinking,
    ).toBeUndefined();
  });

  it("re-onboard preserves user-customized fields for non-azure models", () => {
    const result = applyCustomApiConfig({
      config: {
        models: {
          providers: {
            custom: {
              baseUrl: "https://llm.example.com/v1",
              api: "openai-completions",
              models: [
                {
                  id: "foo-large",
                  name: "My Custom Model",
                  reasoning: true,
                  input: ["text", "image"],
                  cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0 },
                  contextWindow: 131072,
                  maxTokens: 16384,
                },
              ],
            },
          },
        },
      } as OpenClawConfig,
      baseUrl: "https://llm.example.com/v1",
      modelId: "foo-large",
      compatibility: "openai",
      apiKey: "key",
      providerId: "custom",
    });
    const model = result.config.models?.providers?.custom?.models?.find(
      (m) => m.id === "foo-large",
    );
    expect(model?.name).toBe("My Custom Model");
    expect(model?.reasoning).toBe(true);
    expect(model?.input).toEqual(["text", "image"]);
    expect(model?.cost).toEqual({ input: 1, output: 2, cacheRead: 0, cacheWrite: 0 });
    expect(model?.maxTokens).toBe(16384);
    expect(model?.contextWindow).toBe(131072);
  });

  it("preserves existing per-model thinking when already set for azure reasoning model", () => {
    const providerId = "custom-my-resource-openai-azure-com";
    const modelRef = `${providerId}/o3-mini`;
    const result = applyCustomApiConfig({
      config: {
        agents: {
          defaults: {
            models: {
              [modelRef]: { params: { thinking: "high" } },
            },
          },
        },
      } as OpenClawConfig,
      baseUrl: "https://my-resource.openai.azure.com",
      modelId: "o3-mini",
      compatibility: "openai",
      apiKey: "key",
    });
    expect(result.config.agents?.defaults?.models?.[modelRef]?.params?.thinking).toBe("high");
  });
});

describe("parseNonInteractiveCustomApiFlags", () => {
  it("parses required flags and defaults compatibility to openai", () => {
    const result = parseNonInteractiveCustomApiFlags({
      baseUrl: " https://llm.example.com/v1 ",
      modelId: " foo-large ",
      apiKey: " custom-test-key ",
      providerId: " my-custom ",
    });

    expect(result).toEqual({
      baseUrl: "https://llm.example.com/v1",
      modelId: "foo-large",
      compatibility: "openai",
      apiKey: "custom-test-key", // pragma: allowlist secret
      providerId: "my-custom",
    });
  });

  it.each([
    {
      name: "missing required flags",
      flags: { baseUrl: "https://llm.example.com/v1" },
      expectedMessage: 'Auth choice "custom-api-key" requires a base URL and model ID.',
    },
    {
      name: "invalid compatibility values",
      flags: {
        baseUrl: "https://llm.example.com/v1",
        modelId: "foo-large",
        compatibility: "xmlrpc",
      },
      expectedMessage: 'Invalid --custom-compatibility (use "openai" or "anthropic").',
    },
    {
      name: "invalid explicit provider ids",
      flags: {
        baseUrl: "https://llm.example.com/v1",
        modelId: "foo-large",
        providerId: "!!!",
      },
      expectedMessage: "Custom provider ID must include letters, numbers, or hyphens.",
    },
  ])("rejects $name", ({ flags, expectedMessage }) => {
    expect(() => parseNonInteractiveCustomApiFlags(flags)).toThrow(expectedMessage);
  });
=======
>>>>>>> upstream/main
});
