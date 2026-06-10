<<<<<<< HEAD
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildMinimaxMusicGenerationProvider } from "./music-generation-provider.js";
=======
// Minimax tests cover music generation provider plugin behavior.
import { expectExplicitMusicGenerationCapabilities } from "openclaw/plugin-sdk/provider-test-contracts";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  getMinimaxProviderHttpMocks,
  installMinimaxProviderHttpMockCleanup,
  loadMinimaxMusicGenerationProviderModule,
} from "./provider-http.test-helpers.js";
>>>>>>> upstream/main

const {
  resolveApiKeyForProviderMock,
  postJsonRequestMock,
  fetchWithTimeoutMock,
<<<<<<< HEAD
  assertOkOrThrowHttpErrorMock,
  resolveProviderHttpRequestConfigMock,
} = vi.hoisted(() => ({
  resolveApiKeyForProviderMock: vi.fn(async () => ({ apiKey: "minimax-key" })),
  postJsonRequestMock: vi.fn(),
  fetchWithTimeoutMock: vi.fn(),
  assertOkOrThrowHttpErrorMock: vi.fn(async () => {}),
  resolveProviderHttpRequestConfigMock: vi.fn((params) => ({
    baseUrl: params.baseUrl ?? params.defaultBaseUrl,
    allowPrivateNetwork: false,
    headers: new Headers(params.defaultHeaders),
    dispatcherPolicy: undefined,
  })),
}));

vi.mock("openclaw/plugin-sdk/provider-auth-runtime", () => ({
  resolveApiKeyForProvider: resolveApiKeyForProviderMock,
}));

vi.mock("openclaw/plugin-sdk/provider-http", () => ({
  assertOkOrThrowHttpError: assertOkOrThrowHttpErrorMock,
  fetchWithTimeout: fetchWithTimeoutMock,
  postJsonRequest: postJsonRequestMock,
  resolveProviderHttpRequestConfig: resolveProviderHttpRequestConfigMock,
}));

describe("minimax music generation provider", () => {
  afterEach(() => {
    resolveApiKeyForProviderMock.mockClear();
    postJsonRequestMock.mockReset();
    fetchWithTimeoutMock.mockReset();
    assertOkOrThrowHttpErrorMock.mockClear();
    resolveProviderHttpRequestConfigMock.mockClear();
  });

  it("creates music and downloads the generated track", async () => {
    postJsonRequestMock.mockResolvedValue({
      response: {
        json: async () => ({
          task_id: "task-123",
          audio_url: "https://example.com/out.mp3",
          lyrics: "our city wakes",
          base_resp: { status_code: 0 },
        }),
      },
      release: vi.fn(async () => {}),
    });
    fetchWithTimeoutMock.mockResolvedValue({
      headers: new Headers({ "content-type": "audio/mpeg" }),
      arrayBuffer: async () => Buffer.from("mp3-bytes"),
    });
=======
  resolveProviderHttpRequestConfigMock,
} = getMinimaxProviderHttpMocks();

let buildMinimaxMusicGenerationProvider: Awaited<
  ReturnType<typeof loadMinimaxMusicGenerationProviderModule>
>["buildMinimaxMusicGenerationProvider"];
let buildMinimaxPortalMusicGenerationProvider: Awaited<
  ReturnType<typeof loadMinimaxMusicGenerationProviderModule>
>["buildMinimaxPortalMusicGenerationProvider"];

beforeAll(async () => {
  ({ buildMinimaxMusicGenerationProvider, buildMinimaxPortalMusicGenerationProvider } =
    await loadMinimaxMusicGenerationProviderModule());
});

installMinimaxProviderHttpMockCleanup();

function mockMusicGenerationResponse(json: Record<string, unknown>): void {
  const response = new Response(JSON.stringify(json), {
    headers: { "content-type": "application/json" },
  });
  postJsonRequestMock.mockResolvedValue({
    response,
    release: vi.fn(async () => {}),
  });
  fetchWithTimeoutMock.mockResolvedValue({
    headers: new Headers({ "content-type": "audio/mpeg" }),
    arrayBuffer: async () => Buffer.from("mp3-bytes"),
  });
}

function mockCallArg(mock: { mock: { calls: unknown[][] } }, index = 0): Record<string, unknown> {
  const call = mock.mock.calls[index];
  if (!call) {
    throw new Error(`expected mock call ${index}`);
  }
  return call[0] as Record<string, unknown>;
}

function streamedAudioResponse(bytes: string): Response {
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(bytes));
        controller.close();
      },
    }),
    { headers: { "content-type": "audio/mpeg" } },
  );
}

describe("minimax music generation provider", () => {
  it("declares explicit mode capabilities", () => {
    expectExplicitMusicGenerationCapabilities(buildMinimaxMusicGenerationProvider());
  });

  it("streams generated music chunks from MiniMax", async () => {
    const chunkA = Buffer.from("ID3\x04\x00mp3-a");
    const chunkB = Buffer.from("mp3-b");
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        [
          `data: ${JSON.stringify({ data: { status: 1, audio: chunkA.toString("hex") }, base_resp: { status_code: 0 } })}`,
          `data: ${JSON.stringify({ data: { status: 1, audio: chunkB.toString("hex") }, base_resp: { status_code: 0 } })}`,
          `data: ${JSON.stringify({ data: { status: 2, audio: Buffer.concat([chunkA, chunkB]).toString("hex") }, base_resp: { status_code: 0 } })}`,
          "",
        ].join("\n\n"),
        {
          headers: { "content-type": "text/event-stream" },
        },
      ),
      release: vi.fn(async () => {}),
    });
>>>>>>> upstream/main

    const provider = buildMinimaxMusicGenerationProvider();
    const result = await provider.generateMusic({
      provider: "minimax",
<<<<<<< HEAD
      model: "music-2.5+",
=======
      model: "",
>>>>>>> upstream/main
      prompt: "upbeat dance-pop with female vocals",
      cfg: {},
      lyrics: "our city wakes",
      durationSeconds: 45,
    });

<<<<<<< HEAD
    expect(postJsonRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://api.minimax.io/v1/music_generation",
        body: expect.objectContaining({
          model: "music-2.5+",
          lyrics: "our city wakes",
          output_format: "url",
        }),
      }),
    );
    expect(result.tracks).toHaveLength(1);
    expect(result.lyrics).toEqual(["our city wakes"]);
    expect(result.metadata).toEqual(
      expect.objectContaining({
        taskId: "task-123",
        audioUrl: "https://example.com/out.mp3",
      }),
    );
=======
    const request = mockCallArg(postJsonRequestMock);
    expect(request.url).toBe("https://api.minimax.io/v1/music_generation");
    const body = request.body as Record<string, unknown>;
    expect(body.model).toBe("music-2.6");
    expect(body.prompt).toBe("upbeat dance-pop with female vocals");
    expect(body.prompt).not.toContain("Target duration");
    expect(body).not.toHaveProperty("duration");
    expect(body.lyrics).toBe("our city wakes");
    expect(body.stream).toBe(true);
    expect(body.output_format).toBe("hex");
    expect(body.audio_setting).toEqual({
      sample_rate: 44100,
      bitrate: 256000,
      format: "mp3",
    });
    expect(request.timeoutMs).toBe(300000);
    expect(request?.headers).toBeInstanceOf(Headers);
    const headers = request?.headers as Headers | undefined;
    expect(headers?.get("content-type")).toBe("application/json");
    expect(result.tracks).toHaveLength(1);
    expect(result.tracks[0]?.buffer).toEqual(Buffer.concat([chunkA, chunkB]));
    expect(result.tracks[0]?.mimeType).toBe("audio/mpeg");
    expect(result.metadata?.requestedLyrics).toBe(true);
    expect(result.metadata).not.toHaveProperty("requestedDurationSeconds");
  });

  it("reports streaming music task failures", async () => {
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        `data: ${JSON.stringify({
          base_resp: { status_code: 0 },
        })}\n\ndata: ${JSON.stringify({
          base_resp: { status_code: 2013, status_msg: "render rejected" },
        })}`,
        {
          headers: { "content-type": "text/event-stream" },
        },
      ),
      release: vi.fn(async () => {}),
    });

    const provider = buildMinimaxMusicGenerationProvider();

    await expect(
      provider.generateMusic({
        provider: "minimax",
        model: "music-2.6",
        prompt: "upbeat dance-pop with female vocals",
        cfg: {},
      }),
    ).rejects.toThrow("MiniMax music generation failed (2013): render rejected");
  });

  it("keeps terminal streaming audio when no progressive chunks were sent", async () => {
    const terminalAudio = Buffer.from("terminal-mp3");
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        `data: ${JSON.stringify({
          data: { status: 2, audio: terminalAudio.toString("hex") },
          base_resp: { status_code: 0 },
        })}`,
        {
          headers: { "content-type": "text/event-stream" },
        },
      ),
      release: vi.fn(async () => {}),
    });

    const provider = buildMinimaxMusicGenerationProvider();
    const result = await provider.generateMusic({
      provider: "minimax",
      model: "music-2.6",
      prompt: "upbeat dance-pop with female vocals",
      cfg: {},
    });

    expect(result.tracks[0]?.buffer).toEqual(terminalAudio);
  });

  it("rejects streamed generated music that exceeds the configured media cap", async () => {
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        `data: ${JSON.stringify({
          data: { status: 2, audio: Buffer.from("too-large").toString("hex") },
          base_resp: { status_code: 0 },
        })}`,
        {
          headers: { "content-type": "text/event-stream" },
        },
      ),
      release: vi.fn(async () => {}),
    });

    const provider = buildMinimaxMusicGenerationProvider();
    await expect(
      provider.generateMusic({
        provider: "minimax",
        model: "music-2.6",
        prompt: "short track",
        cfg: { agents: { defaults: { mediaMaxMb: 0.000001 } } },
      }),
    ).rejects.toThrow("MiniMax generated music download exceeds 1 bytes");
  });

  it("rejects inline generated music that exceeds the configured media cap before decoding", async () => {
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        JSON.stringify({
          data: {
            audio: Buffer.from("too-large").toString("hex"),
          },
          base_resp: { status_code: 0 },
        }),
        {
          headers: { "content-type": "application/json" },
        },
      ),
      release: vi.fn(async () => {}),
    });

    const provider = buildMinimaxMusicGenerationProvider();
    await expect(
      provider.generateMusic({
        provider: "minimax",
        model: "music-2.6",
        prompt: "short track",
        cfg: { agents: { defaults: { mediaMaxMb: 0.000001 } } },
      }),
    ).rejects.toThrow("MiniMax generated music download exceeds 1 bytes");
  });

  it("downloads tracks when url output is returned in data.audio", async () => {
    mockMusicGenerationResponse({
      task_id: "task-url",
      lyrics: "our city wakes",
      data: {
        audio: "https://example.com/url-audio.mp3",
      },
      base_resp: { status_code: 0 },
    });

    const provider = buildMinimaxMusicGenerationProvider();
    const result = await provider.generateMusic({
      provider: "minimax",
      model: "music-2.6",
      prompt: "upbeat dance-pop with female vocals",
      cfg: {},
      lyrics: "our city wakes",
    });

    expect(fetchWithTimeoutMock).toHaveBeenCalledWith(
      "https://example.com/url-audio.mp3",
      { method: "GET" },
      120000,
      fetch,
    );
    expect(result.tracks[0]?.buffer.byteLength).toBeGreaterThan(0);
    expect(result.lyrics).toEqual(["our city wakes"]);
    expect(result.metadata?.taskId).toBe("task-url");
    expect(result.metadata?.audioUrl).toBe("https://example.com/url-audio.mp3");
  });

  it("rejects generated music downloads that exceed the configured media cap", async () => {
    postJsonRequestMock.mockResolvedValue({
      response: new Response(
        JSON.stringify({
          data: {
            audio: "https://example.com/too-large.mp3",
          },
          base_resp: { status_code: 0 },
        }),
        { headers: { "content-type": "application/json" } },
      ),
      release: vi.fn(async () => {}),
    });
    fetchWithTimeoutMock.mockResolvedValueOnce(streamedAudioResponse("too-large"));

    const provider = buildMinimaxMusicGenerationProvider();
    await expect(
      provider.generateMusic({
        provider: "minimax",
        model: "music-2.6",
        prompt: "short track",
        cfg: { agents: { defaults: { mediaMaxMb: 0.000001 } } },
      }),
    ).rejects.toThrow("MiniMax generated music download exceeds 1 bytes");
  });

  it("honors explicit long caller timeouts for request and download fallbacks", async () => {
    mockMusicGenerationResponse({
      data: {
        audio: "https://example.com/long-timeout.mp3",
      },
      base_resp: { status_code: 0 },
    });

    const provider = buildMinimaxMusicGenerationProvider();
    await provider.generateMusic({
      provider: "minimax",
      model: "music-2.6",
      prompt: "upbeat dance-pop with female vocals",
      cfg: {},
      lyrics: "our city wakes",
      timeoutMs: 600000,
    });

    expect(mockCallArg(postJsonRequestMock).timeoutMs).toBe(600000);
    expect(fetchWithTimeoutMock).toHaveBeenCalledWith(
      "https://example.com/long-timeout.mp3",
      { method: "GET" },
      600000,
      fetch,
    );
  });

  it("applies explicit caller timeouts while reading streaming response bodies", async () => {
    vi.useFakeTimers();
    try {
      let cancelled = false;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          setTimeout(() => {
            if (cancelled) {
              return;
            }
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({
                  data: { status: 2, audio: Buffer.from("late-mp3").toString("hex") },
                  base_resp: { status_code: 0 },
                })}`,
              ),
            );
            controller.close();
          }, 200);
        },
        cancel() {
          cancelled = true;
        },
      });
      postJsonRequestMock.mockResolvedValue({
        response: new Response(stream, {
          headers: { "content-type": "text/event-stream" },
        }),
        release: vi.fn(async () => {}),
      });

      const provider = buildMinimaxMusicGenerationProvider();
      const generation = provider.generateMusic({
        provider: "minimax",
        model: "music-2.6",
        prompt: "upbeat dance-pop with female vocals",
        cfg: {},
        timeoutMs: 50,
      });
      const expectation = expect(generation).rejects.toThrow(
        "MiniMax music generation timed out after 50ms",
      );

      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(50);

      await expectation;
      expect(cancelled).toBe(true);
    } finally {
      vi.useRealTimers();
    }
>>>>>>> upstream/main
  });

  it("rejects instrumental requests that also include lyrics", async () => {
    const provider = buildMinimaxMusicGenerationProvider();

    await expect(
      provider.generateMusic({
        provider: "minimax",
<<<<<<< HEAD
        model: "music-2.5+",
=======
        model: "music-2.6",
>>>>>>> upstream/main
        prompt: "driving techno",
        cfg: {},
        instrumental: true,
        lyrics: "do not sing this",
      }),
    ).rejects.toThrow("cannot use lyrics when instrumental=true");
  });
<<<<<<< HEAD
=======

  it("uses lyrics optimizer when lyrics are omitted", async () => {
    mockMusicGenerationResponse({
      task_id: "task-456",
      audio_url: "https://example.com/out.mp3",
      base_resp: { status_code: 0 },
    });

    const provider = buildMinimaxMusicGenerationProvider();
    await provider.generateMusic({
      provider: "minimax",
      model: "music-2.6",
      prompt: "upbeat dance-pop",
      cfg: {},
    });

    const request = mockCallArg(postJsonRequestMock);
    const body = request.body as Record<string, unknown>;
    expect(body.model).toBe("music-2.6");
    expect(body.lyrics_optimizer).toBe(true);
  });

  it("routes portal music generation through minimax-portal auth and HTTP config", async () => {
    mockMusicGenerationResponse({
      task_id: "task-portal",
      audio_url: "https://example.com/portal.mp3",
      base_resp: { status_code: 0 },
    });

    const provider = buildMinimaxPortalMusicGenerationProvider();
    await provider.generateMusic({
      provider: "minimax-portal",
      model: "",
      prompt: "cinematic synth theme",
      cfg: {
        models: {
          providers: {
            minimax: {
              baseUrl: "https://wrong.example/anthropic",
              models: [],
            },
            "minimax-portal": {
              baseUrl: "https://api.minimaxi.com/anthropic",
              models: [],
            },
          },
        },
      },
    });

    expect(mockCallArg(resolveApiKeyForProviderMock).provider).toBe("minimax-portal");
    const httpConfigParams = mockCallArg(resolveProviderHttpRequestConfigMock);
    expect(httpConfigParams.baseUrl).toBe("https://api.minimaxi.com");
    expect(httpConfigParams.provider).toBe("minimax-portal");
    expect(httpConfigParams.capability).toBe("audio");
    expect(httpConfigParams.transport).toBe("http");
    expect(mockCallArg(postJsonRequestMock).url).toBe(
      "https://api.minimaxi.com/v1/music_generation",
    );
  });
>>>>>>> upstream/main
});
