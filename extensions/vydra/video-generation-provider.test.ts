<<<<<<< HEAD
import * as providerAuth from "openclaw/plugin-sdk/provider-auth-runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildVydraVideoGenerationProvider } from "./video-generation-provider.js";

describe("vydra video-generation provider", () => {
=======
// Vydra tests cover video generation provider plugin behavior.
import { expectExplicitVideoGenerationCapabilities } from "openclaw/plugin-sdk/provider-test-contracts";
import { installPinnedHostnameTestHooks } from "openclaw/plugin-sdk/test-env";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  binaryResponse,
  jsonResponse,
  stubFetch,
  stubVydraApiKey,
} from "./provider-test-helpers.test.js";
import { buildVydraVideoGenerationProvider } from "./video-generation-provider.js";

function fetchCall(fetchMock: ReturnType<typeof vi.fn>, index: number) {
  const call = fetchMock.mock.calls[index];
  if (!call) {
    throw new Error(`expected fetch call ${index}`);
  }
  return call;
}

describe("vydra video-generation provider", () => {
  installPinnedHostnameTestHooks();

>>>>>>> upstream/main
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

<<<<<<< HEAD
  it("submits veo3 jobs and downloads the completed video", async () => {
    vi.spyOn(providerAuth, "resolveApiKeyForProvider").mockResolvedValue({
      apiKey: "vydra-test-key",
      source: "env",
      mode: "api-key",
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ jobId: "job-123", status: "processing" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            jobId: "job-123",
            status: "completed",
            videoUrl: "https://cdn.vydra.ai/generated/test.mp4",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(Buffer.from("mp4-data"), {
          status: 200,
          headers: { "Content-Type": "video/mp4" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
=======
  it("declares explicit mode capabilities", () => {
    expectExplicitVideoGenerationCapabilities(buildVydraVideoGenerationProvider());
  });

  it("submits veo3 jobs and downloads the completed video", async () => {
    stubVydraApiKey();
    const fetchMock = stubFetch(
      jsonResponse({ jobId: "job-123", status: "processing" }),
      jsonResponse({
        jobId: "job-123",
        status: "completed",
        videoUrl: "https://cdn.vydra.ai/generated/test.mp4",
      }),
      binaryResponse("webm-data", "video/webm"),
    );
>>>>>>> upstream/main

    const provider = buildVydraVideoGenerationProvider();
    const result = await provider.generateVideo({
      provider: "vydra",
      model: "veo3",
      prompt: "tiny city at sunrise",
      cfg: {},
    });

<<<<<<< HEAD
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://www.vydra.ai/api/v1/models/veo3",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ prompt: "tiny city at sunrise" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://www.vydra.ai/api/v1/jobs/job-123",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.videos[0]?.mimeType).toBe("video/mp4");
=======
    const createCall = fetchCall(fetchMock, 0);
    expect(createCall[0]).toBe("https://www.vydra.ai/api/v1/models/veo3");
    const createInit = createCall[1] as { method?: string; body?: unknown } | undefined;
    expect(createInit?.method).toBe("POST");
    expect(createInit?.body).toBe(JSON.stringify({ prompt: "tiny city at sunrise" }));
    const pollCall = fetchCall(fetchMock, 1);
    expect(pollCall[0]).toBe("https://www.vydra.ai/api/v1/jobs/job-123");
    const pollInit = pollCall[1] as { method?: string } | undefined;
    expect(pollInit?.method).toBe("GET");
    expect(result.videos).toHaveLength(1);
    const [video] = result.videos;
    if (!video) {
      throw new Error("Expected generated Vydra video");
    }
    expect(video.mimeType).toBe("video/webm");
    expect(video.fileName).toBe("video-1.webm");
>>>>>>> upstream/main
    expect(result.metadata).toEqual({
      jobId: "job-123",
      videoUrl: "https://cdn.vydra.ai/generated/test.mp4",
      status: "completed",
    });
  });

<<<<<<< HEAD
  it("requires a remote image url for kling", async () => {
    vi.spyOn(providerAuth, "resolveApiKeyForProvider").mockResolvedValue({
      apiKey: "vydra-test-key",
      source: "env",
      mode: "api-key",
    });
=======
  it("rejects generated video downloads that exceed the configured media cap", async () => {
    stubVydraApiKey();
    stubFetch(
      jsonResponse({ jobId: "job-123", status: "processing" }),
      jsonResponse({
        jobId: "job-123",
        status: "completed",
        videoUrl: "https://cdn.vydra.ai/generated/test.mp4",
      }),
      binaryResponse("too-large", "video/mp4"),
    );

    const provider = buildVydraVideoGenerationProvider();
    await expect(
      provider.generateVideo({
        provider: "vydra",
        model: "veo3",
        prompt: "tiny city at sunrise",
        cfg: { agents: { defaults: { mediaMaxMb: 0.000001 } } },
      }),
    ).rejects.toThrow("Vydra video download exceeds 1 bytes");
  });

  it("requires a remote image url for kling", async () => {
    stubVydraApiKey();
>>>>>>> upstream/main
    vi.stubGlobal("fetch", vi.fn());

    const provider = buildVydraVideoGenerationProvider();
    await expect(
      provider.generateVideo({
        provider: "vydra",
        model: "kling",
        prompt: "animate this image",
        cfg: {},
        inputImages: [{ buffer: Buffer.from("png"), mimeType: "image/png" }],
      }),
    ).rejects.toThrow("Vydra kling currently requires a remote image URL reference.");
  });
<<<<<<< HEAD
=======

  it("submits kling jobs with a remote image url", async () => {
    stubVydraApiKey();
    const fetchMock = stubFetch(
      jsonResponse({ jobId: "job-kling", status: "processing" }),
      jsonResponse({
        jobId: "job-kling",
        status: "completed",
        videoUrl: "https://cdn.vydra.ai/generated/kling.mp4",
      }),
      binaryResponse("mp4-data", "video/mp4"),
    );

    const provider = buildVydraVideoGenerationProvider();
    const result = await provider.generateVideo({
      provider: "vydra",
      model: "kling",
      prompt: "animate this image",
      cfg: {},
      inputImages: [{ url: "https://example.com/reference.png" }],
    });

    const createCall = fetchCall(fetchMock, 0);
    expect(createCall[0]).toBe("https://www.vydra.ai/api/v1/models/kling");
    const createInit = createCall[1] as { method?: string; body?: unknown } | undefined;
    expect(createInit?.method).toBe("POST");
    expect(createInit?.body).toBe(
      JSON.stringify({
        prompt: "animate this image",
        image_url: "https://example.com/reference.png",
        video_url: "https://example.com/reference.png",
      }),
    );
    expect(result.videos).toHaveLength(1);
    const [video] = result.videos;
    if (!video) {
      throw new Error("Expected generated Vydra kling video");
    }
    expect(video.mimeType).toBe("video/mp4");
    expect(result.metadata).toEqual({
      jobId: "job-kling",
      videoUrl: "https://cdn.vydra.ai/generated/kling.mp4",
      status: "completed",
    });
  });
>>>>>>> upstream/main
});
