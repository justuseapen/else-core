/**
 * Tests Anthropic Vertex stream facade loading.
 * Ensures core routes through the bundled provider public surface.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SYSTEM_PROMPT_CACHE_BOUNDARY } from "./system-prompt-cache-boundary.js";

<<<<<<< HEAD
const hoisted = vi.hoisted(() => {
  const streamAnthropicMock = vi.fn<(model: unknown, context: unknown, options: unknown) => symbol>(
    () => Symbol("anthropic-vertex-stream"),
  );
  const anthropicVertexCtorMock = vi.fn();

  return {
    streamAnthropicMock,
    anthropicVertexCtorMock,
  };
});

vi.mock("@mariozechner/pi-ai", async () => {
  const original =
    await vi.importActual<typeof import("@mariozechner/pi-ai")>("@mariozechner/pi-ai");
  return {
    ...original,
    streamAnthropic: (model: unknown, context: unknown, options: unknown) =>
      hoisted.streamAnthropicMock(model, context, options),
  };
});

vi.mock("@anthropic-ai/vertex-sdk", () => ({
  AnthropicVertex: vi.fn(function MockAnthropicVertex(options: unknown) {
    hoisted.anthropicVertexCtorMock(options);
    return { options };
  }),
}));

let createAnthropicVertexStreamFn: typeof import("./anthropic-vertex-stream.js").createAnthropicVertexStreamFn;
let createAnthropicVertexStreamFnForModel: typeof import("./anthropic-vertex-stream.js").createAnthropicVertexStreamFnForModel;

async function loadFreshAnthropicVertexStreamModuleForTest() {
  vi.resetModules();
  vi.doMock("@mariozechner/pi-ai", async () => {
    const original =
      await vi.importActual<typeof import("@mariozechner/pi-ai")>("@mariozechner/pi-ai");
    return {
      ...original,
      streamAnthropic: (model: unknown, context: unknown, options: unknown) =>
        hoisted.streamAnthropicMock(model, context, options),
    };
  });
  vi.doMock("@anthropic-ai/vertex-sdk", () => ({
    AnthropicVertex: vi.fn(function MockAnthropicVertex(options: unknown) {
      hoisted.anthropicVertexCtorMock(options);
      return { options };
    }),
  }));
  return await import("./anthropic-vertex-stream.js");
}

function makeModel(params: { id: string; maxTokens?: number }): Model<"anthropic-messages"> {
  return {
    id: params.id,
    api: "anthropic-messages",
    provider: "anthropic-vertex",
    ...(params.maxTokens !== undefined ? { maxTokens: params.maxTokens } : {}),
  } as Model<"anthropic-messages">;
}

describe("createAnthropicVertexStreamFn", () => {
=======
const facadeRuntimeMocks = vi.hoisted(() => ({
  loadBundledPluginPublicSurfaceModuleSync: vi.fn(),
}));

vi.mock("../plugin-sdk/facade-runtime.js", () => ({
  loadBundledPluginPublicSurfaceModuleSync:
    facadeRuntimeMocks.loadBundledPluginPublicSurfaceModuleSync,
}));

describe("anthropic-vertex stream facade", () => {
>>>>>>> upstream/main
  beforeEach(() => {
    vi.resetModules();
    facadeRuntimeMocks.loadBundledPluginPublicSurfaceModuleSync.mockReset();
  });

  it("loads the stream facade through the plugin public surface", async () => {
    const createStream = vi.fn(
      (model: { baseUrl?: string }, env: NodeJS.ProcessEnv) => async () => ({
        marker: "external-vertex",
        baseUrl: model.baseUrl,
        envMarker: env.OPENCLAW_TEST_MARKER,
      }),
    );
    facadeRuntimeMocks.loadBundledPluginPublicSurfaceModuleSync.mockReturnValue({
      createAnthropicVertexStreamFnForModel: createStream,
    });

<<<<<<< HEAD
  it("passes an explicit baseURL through to the Vertex client", () => {
    const streamFn = createAnthropicVertexStreamFn(
      "vertex-project",
      "us-east5",
      "https://proxy.example.test/vertex/v1",
    );

    void streamFn(makeModel({ id: "claude-sonnet-4-6", maxTokens: 128000 }), { messages: [] }, {});

    expect(hoisted.anthropicVertexCtorMock).toHaveBeenCalledWith({
      projectId: "vertex-project",
      region: "us-east5",
      baseURL: "https://proxy.example.test/vertex/v1",
    });
  });

  it("defaults maxTokens to the model limit instead of the old 32000 cap", () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-opus-4-6", maxTokens: 128000 });

    void streamFn(model, { messages: [] }, {});

    expect(hoisted.streamAnthropicMock).toHaveBeenCalledWith(
      model,
      { messages: [] },
      expect.objectContaining({
        maxTokens: 128000,
      }),
    );
  });

  it("clamps explicit maxTokens to the selected model limit", () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-sonnet-4-6", maxTokens: 128000 });

    void streamFn(model, { messages: [] }, { maxTokens: 999999 });

    expect(hoisted.streamAnthropicMock).toHaveBeenCalledWith(
      model,
      { messages: [] },
      expect.objectContaining({
        maxTokens: 128000,
      }),
    );
  });

  it("maps xhigh reasoning to max effort for adaptive Opus models", () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-opus-4-6", maxTokens: 64000 });

    void streamFn(model, { messages: [] }, { reasoning: "xhigh" });

    expect(hoisted.streamAnthropicMock).toHaveBeenCalledWith(
      model,
      { messages: [] },
      expect.objectContaining({
        thinkingEnabled: true,
        effort: "max",
      }),
    );
  });

  it("applies Anthropic cache-boundary shaping before forwarding payload hooks", async () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-sonnet-4-6", maxTokens: 64000 });
    const onPayload = vi.fn(async (payload: unknown) => payload);

    void streamFn(
      model,
      {
        systemPrompt: `Stable prefix${SYSTEM_PROMPT_CACHE_BOUNDARY}Dynamic suffix`,
        messages: [{ role: "user", content: "Hello" }],
      } as never,
      {
        cacheRetention: "short",
        onPayload,
      } as never,
    );

    const transportOptions = hoisted.streamAnthropicMock.mock.calls[0]?.[2] as {
      onPayload?: (payload: unknown, payloadModel: unknown) => Promise<unknown>;
    };
    const payload = {
      system: [
        {
          type: "text",
          text: `Stable prefix${SYSTEM_PROMPT_CACHE_BOUNDARY}Dynamic suffix`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: "Hello" }],
    };

    const nextPayload = await transportOptions.onPayload?.(payload, model);

    expect(onPayload).toHaveBeenCalledWith(
      {
        system: [
          {
            type: "text",
            text: "Stable prefix",
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: "Dynamic suffix",
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Hello",
                cache_control: { type: "ephemeral" },
              },
            ],
          },
        ],
      },
      model,
    );
    expect(nextPayload).toEqual({
      system: [
        {
          type: "text",
          text: "Stable prefix",
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: "Dynamic suffix",
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Hello",
              cache_control: { type: "ephemeral" },
            },
          ],
        },
      ],
    });
  });

  it("reapplies Anthropic cache-boundary shaping when payload hooks return a fresh payload", async () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-sonnet-4-6", maxTokens: 64000 });
    const onPayload = vi.fn(async () => ({
      system: [
        {
          type: "text",
          text: `Stable prefix${SYSTEM_PROMPT_CACHE_BOUNDARY}Dynamic suffix`,
        },
      ],
      messages: [{ role: "user", content: "Hello again" }],
    }));

    void streamFn(
      model,
      {
        systemPrompt: `Stable prefix${SYSTEM_PROMPT_CACHE_BOUNDARY}Dynamic suffix`,
        messages: [{ role: "user", content: "Hello" }],
      } as never,
      {
        cacheRetention: "short",
        onPayload,
      } as never,
    );

    const transportOptions = hoisted.streamAnthropicMock.mock.calls[0]?.[2] as {
      onPayload?: (payload: unknown, payloadModel: unknown) => Promise<unknown>;
    };
    const nextPayload = await transportOptions.onPayload?.(
      {
        system: [
          {
            type: "text",
            text: `Stable prefix${SYSTEM_PROMPT_CACHE_BOUNDARY}Dynamic suffix`,
          },
        ],
        messages: [{ role: "user", content: "Hello" }],
      },
      model,
    );

    expect(nextPayload).toEqual({
      system: [
        {
          type: "text",
          text: "Stable prefix",
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: "Dynamic suffix",
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Hello again",
              cache_control: { type: "ephemeral" },
            },
          ],
        },
      ],
    });
  });

  it("omits maxTokens when neither the model nor request provide a finite limit", () => {
    const streamFn = createAnthropicVertexStreamFn("vertex-project", "us-east5");
    const model = makeModel({ id: "claude-sonnet-4-6" });

    void streamFn(model, { messages: [] }, { maxTokens: Number.NaN });

    expect(hoisted.streamAnthropicMock).toHaveBeenCalledWith(
      model,
      { messages: [] },
      expect.not.objectContaining({
        maxTokens: expect.anything(),
      }),
    );
  });
});

describe("createAnthropicVertexStreamFnForModel", () => {
  beforeEach(() => {
    hoisted.anthropicVertexCtorMock.mockClear();
  });

  beforeEach(async () => {
    ({ createAnthropicVertexStreamFn, createAnthropicVertexStreamFnForModel } =
      await loadFreshAnthropicVertexStreamModuleForTest());
  });

  it("derives project and region from the model and env", () => {
=======
    const { createAnthropicVertexStreamFnForModel } = await import("./anthropic-vertex-stream.js");
>>>>>>> upstream/main
    const streamFn = createAnthropicVertexStreamFnForModel(
      { baseUrl: "https://us-central1-aiplatform.googleapis.com" },
      { OPENCLAW_TEST_MARKER: "registry" },
    );

    expect(facadeRuntimeMocks.loadBundledPluginPublicSurfaceModuleSync).toHaveBeenCalledWith({
      dirName: "anthropic-vertex",
      artifactBasename: "api.js",
    });
    expect(createStream).toHaveBeenCalledWith(
      { baseUrl: "https://us-central1-aiplatform.googleapis.com" },
      { OPENCLAW_TEST_MARKER: "registry" },
    );
    await expect(streamFn({} as never, {} as never, {} as never)).resolves.toEqual({
      marker: "external-vertex",
      baseUrl: "https://us-central1-aiplatform.googleapis.com",
      envMarker: "registry",
    });
  });
});
