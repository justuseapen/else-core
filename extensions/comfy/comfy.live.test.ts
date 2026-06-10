<<<<<<< HEAD
import { beforeAll, describe, expect, it } from "vitest";
import { resolveOpenClawAgentDir } from "../../src/agents/agent-paths.js";
import { isLiveTestEnabled } from "../../src/agents/live-test-helpers.js";
import { loadConfig } from "../../src/config/config.js";
import { createTestPluginApi } from "../../test/helpers/plugins/plugin-api.js";
=======
// Comfy tests cover comfy plugin behavior.
import { resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { createTestPluginApi } from "openclaw/plugin-sdk/plugin-test-api";
import { getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { isLiveTestEnabled } from "openclaw/plugin-sdk/test-env";
import { beforeAll, describe, expect, it } from "vitest";
>>>>>>> upstream/main
import plugin from "./index.js";
import { getComfyConfig, isComfyCapabilityConfigured } from "./workflow-runtime.js";

const LIVE =
  isLiveTestEnabled(["COMFY_LIVE_TEST"]) && (process.env.COMFY_LIVE_TEST ?? "").trim() === "1";
const describeLive = LIVE ? describe : describe.skip;

type RegisteredMusicProvider = {
  id: string;
  generateMusic: Function;
  isConfigured?: Function;
};

function withPluginsEnabled<T>(cfg: T): T {
  if (!cfg || typeof cfg !== "object") {
    return cfg;
  }
  const record = cfg as Record<string, unknown>;
  return {
    ...record,
    plugins: {
<<<<<<< HEAD
      ...(record.plugins && typeof record.plugins === "object" ? (record.plugins as object) : {}),
=======
      ...(record.plugins && typeof record.plugins === "object" ? record.plugins : {}),
>>>>>>> upstream/main
      enabled: true,
    },
  } as T;
}

<<<<<<< HEAD
describeLive("comfy live", () => {
  let cfg = {} as ReturnType<typeof loadConfig>;
=======
function requireProvider<T extends { id: string }>(providers: T[], id: string): T {
  const provider = providers.find((entry) => entry.id === id);
  if (!provider) {
    throw new Error(`expected ${id} provider to be registered`);
  }
  return provider;
}

describeLive("comfy live", () => {
  let cfg = {} as OpenClawConfig;
>>>>>>> upstream/main
  let agentDir = "";
  const imageProviders: Array<{ id: string; generateImage: Function; isConfigured?: Function }> =
    [];
  const musicProviders: RegisteredMusicProvider[] = [];
  const videoProviders: Array<{ id: string; generateVideo: Function; isConfigured?: Function }> =
    [];

  beforeAll(async () => {
<<<<<<< HEAD
    cfg = withPluginsEnabled(loadConfig());
    agentDir = resolveOpenClawAgentDir();
    await plugin.register(
=======
    cfg = withPluginsEnabled(getRuntimeConfig());
    agentDir = resolveDefaultAgentDir(cfg as never);
    plugin.register(
>>>>>>> upstream/main
      createTestPluginApi({
        config: cfg as never,
        registerImageGenerationProvider(provider) {
          imageProviders.push(provider as never);
        },
        registerMusicGenerationProvider(provider) {
          musicProviders.push(provider as never);
        },
        registerVideoGenerationProvider(provider) {
          videoProviders.push(provider as never);
        },
      }),
    );
  });

  it.skipIf(!isComfyCapabilityConfigured({ cfg: cfg as never, agentDir, capability: "image" }))(
    "runs an image workflow",
    async () => {
<<<<<<< HEAD
      const provider = imageProviders.find((entry) => entry.id === "comfy");
      expect(provider).toBeDefined();
      const result = await provider!.generateImage({
=======
      const provider = requireProvider(imageProviders, "comfy");
      const result = await provider.generateImage({
>>>>>>> upstream/main
        provider: "comfy",
        model: "workflow",
        prompt: "A tiny orange lobster icon on a clean background.",
        cfg: cfg as never,
        agentDir,
      });
      expect(result.images.length).toBeGreaterThan(0);
      expect(result.images[0]?.mimeType.startsWith("image/")).toBe(true);
      expect(result.images[0]?.buffer.byteLength).toBeGreaterThan(128);
    },
    120_000,
  );

  it.skipIf(!isComfyCapabilityConfigured({ cfg: cfg as never, agentDir, capability: "video" }))(
    "runs a video workflow",
    async () => {
<<<<<<< HEAD
      const provider = videoProviders.find((entry) => entry.id === "comfy");
      expect(provider).toBeDefined();
      const result = await provider!.generateVideo({
=======
      const provider = requireProvider(videoProviders, "comfy");
      const result = await provider.generateVideo({
>>>>>>> upstream/main
        provider: "comfy",
        model: "workflow",
        prompt: "A tiny paper lobster gently waving, cinematic motion.",
        cfg: cfg as never,
        agentDir,
      });
      expect(result.videos.length).toBeGreaterThan(0);
      expect(result.videos[0]?.mimeType.startsWith("video/")).toBe(true);
      expect(result.videos[0]?.buffer.byteLength).toBeGreaterThan(512);
    },
    180_000,
  );

  it.skipIf(!isComfyCapabilityConfigured({ cfg: cfg as never, agentDir, capability: "music" }))(
    "runs a music workflow",
    async () => {
<<<<<<< HEAD
      const provider = musicProviders.find((entry) => entry.id === "comfy");
      expect(provider).toBeDefined();
      const result = await provider!.generateMusic({
=======
      const provider = requireProvider(musicProviders, "comfy");
      const result = await provider.generateMusic({
>>>>>>> upstream/main
        provider: "comfy",
        model: "workflow",
        prompt: "A gentle ambient synth loop with warm analog pads.",
        cfg: cfg as never,
        agentDir,
      });
      expect(result.tracks.length).toBeGreaterThan(0);
      expect(result.tracks[0]?.mimeType.startsWith("audio/")).toBe(true);
      expect(result.tracks[0]?.buffer.byteLength).toBeGreaterThan(512);
    },
    180_000,
  );

  it("documents the effective comfy config shape for live debugging", () => {
    const comfyConfig = getComfyConfig(cfg as never);
    expect(typeof comfyConfig).toBe("object");
  });
});
