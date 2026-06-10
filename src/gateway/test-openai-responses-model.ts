/**
 * Mock OpenAI Responses provider used by gateway compatibility tests.
 */
const MOCK_OPENAI_RESPONSES_PROVIDER_ID = "mock-openai";

<<<<<<< HEAD
export function buildOpenAiResponsesTestModel(id = "gpt-5.4") {
=======
function buildOpenAiResponsesTestModel(id = "gpt-5.4") {
>>>>>>> upstream/main
  return {
    id,
    name: id,
    api: "openai-responses",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128_000,
    maxTokens: 4096,
  } as const;
}

<<<<<<< HEAD
export function buildOpenAiResponsesProviderConfig(baseUrl: string, modelId = "gpt-5.4") {
=======
function buildOpenAiResponsesProviderConfig(baseUrl: string, modelId = "gpt-5.4") {
>>>>>>> upstream/main
  return {
    baseUrl,
    apiKey: "test",
    api: "openai-responses",
    models: [buildOpenAiResponsesTestModel(modelId)],
  } as const;
}

<<<<<<< HEAD
=======
/** Builds provider config and model refs for local OpenAI-compatible HTTP tests. */
>>>>>>> upstream/main
export function buildMockOpenAiResponsesProvider(baseUrl: string, modelId = "gpt-5.4") {
  return {
    providerId: MOCK_OPENAI_RESPONSES_PROVIDER_ID,
    modelId,
    modelRef: `${MOCK_OPENAI_RESPONSES_PROVIDER_ID}/${modelId}`,
    config: buildOpenAiResponsesProviderConfig(baseUrl, modelId),
  } as const;
}
