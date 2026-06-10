<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { generateMusic, listRuntimeMusicGenerationProviders } from "./runtime.js";
import type { MusicGenerationProvider } from "./types.js";

const mocks = vi.hoisted(() => {
  const debug = vi.fn();
  return {
    createSubsystemLogger: vi.fn(() => ({ debug })),
    describeFailoverError: vi.fn(),
    getMusicGenerationProvider: vi.fn<
      (providerId: string, config?: OpenClawConfig) => MusicGenerationProvider | undefined
    >(() => undefined),
    getProviderEnvVars: vi.fn<(providerId: string) => string[]>(() => []),
    isFailoverError: vi.fn<(err: unknown) => boolean>(() => false),
    listMusicGenerationProviders: vi.fn<(config?: OpenClawConfig) => MusicGenerationProvider[]>(
      () => [],
    ),
    parseMusicGenerationModelRef: vi.fn<
      (raw?: string) => { provider: string; model: string } | undefined
    >((raw?: string) => {
      const trimmed = raw?.trim();
      if (!trimmed) {
        return undefined;
      }
      const slash = trimmed.indexOf("/");
      if (slash <= 0 || slash === trimmed.length - 1) {
        return undefined;
      }
      return {
        provider: trimmed.slice(0, slash),
        model: trimmed.slice(slash + 1),
      };
    }),
    resolveAgentModelFallbackValues: vi.fn<(value: unknown) => string[]>(() => []),
    resolveAgentModelPrimaryValue: vi.fn<(value: unknown) => string | undefined>(() => undefined),
    debug,
  };
});

vi.mock("../agents/failover-error.js", () => ({
  describeFailoverError: mocks.describeFailoverError,
  isFailoverError: mocks.isFailoverError,
}));
vi.mock("../config/model-input.js", () => ({
  resolveAgentModelFallbackValues: mocks.resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue: mocks.resolveAgentModelPrimaryValue,
}));
vi.mock("../logging/subsystem.js", () => ({
  createSubsystemLogger: mocks.createSubsystemLogger,
}));
vi.mock("../secrets/provider-env-vars.js", () => ({
  getProviderEnvVars: mocks.getProviderEnvVars,
}));
vi.mock("./model-ref.js", () => ({
  parseMusicGenerationModelRef: mocks.parseMusicGenerationModelRef,
}));
vi.mock("./provider-registry.js", () => ({
  getMusicGenerationProvider: mocks.getMusicGenerationProvider,
  listMusicGenerationProviders: mocks.listMusicGenerationProviders,
}));

describe("music-generation runtime", () => {
  beforeEach(() => {
    mocks.createSubsystemLogger.mockClear();
    mocks.describeFailoverError.mockReset();
    mocks.getMusicGenerationProvider.mockReset();
    mocks.getProviderEnvVars.mockReset();
    mocks.getProviderEnvVars.mockReturnValue([]);
    mocks.isFailoverError.mockReset();
    mocks.isFailoverError.mockReturnValue(false);
    mocks.listMusicGenerationProviders.mockReset();
    mocks.listMusicGenerationProviders.mockReturnValue([]);
    mocks.parseMusicGenerationModelRef.mockClear();
    mocks.resolveAgentModelFallbackValues.mockReset();
    mocks.resolveAgentModelFallbackValues.mockReturnValue([]);
    mocks.resolveAgentModelPrimaryValue.mockReset();
    mocks.resolveAgentModelPrimaryValue.mockReturnValue(undefined);
    mocks.debug.mockReset();
=======
// Tests music generation runtime dispatch and provider fallback behavior.
import { beforeEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/types.js";
import {
  generateMusic,
  listRuntimeMusicGenerationProviders,
  type GenerateMusicParams,
  type MusicGenerationRuntimeDeps,
} from "./runtime.js";
import type { MusicGenerationProvider } from "./types.js";

let providers: MusicGenerationProvider[] = [];
let listedConfigs: Array<OpenClawConfig | undefined> = [];

const runtimeDeps: MusicGenerationRuntimeDeps = {
  getProvider: (providerId) => providers.find((provider) => provider.id === providerId),
  listProviders: (config) => {
    listedConfigs.push(config);
    return providers;
  },
  log: {
    debug: () => {},
  },
};

function runGenerateMusic(params: GenerateMusicParams) {
  return generateMusic(params, runtimeDeps);
}

describe("music-generation runtime", () => {
  beforeEach(() => {
    providers = [];
    listedConfigs = [];
>>>>>>> upstream/main
  });

  it("generates tracks through the active music-generation provider", async () => {
    const authStore = { version: 1, profiles: {} } as const;
    let seenAuthStore: unknown;
<<<<<<< HEAD
    mocks.resolveAgentModelPrimaryValue.mockReturnValue("music-plugin/track-v1");
    const provider: MusicGenerationProvider = {
      id: "music-plugin",
      capabilities: {},
      async generateMusic(req: { authStore?: unknown }) {
        seenAuthStore = req.authStore;
=======
    let seenTimeoutMs: number | undefined;
    const provider: MusicGenerationProvider = {
      id: "music-plugin",
      capabilities: {},
      async generateMusic(req: { authStore?: unknown; timeoutMs?: number }) {
        seenAuthStore = req.authStore;
        seenTimeoutMs = req.timeoutMs;
>>>>>>> upstream/main
        return {
          tracks: [
            {
              buffer: Buffer.from("mp3-bytes"),
              mimeType: "audio/mpeg",
              fileName: "sample.mp3",
            },
          ],
          model: "track-v1",
        };
      },
    };
<<<<<<< HEAD
    mocks.getMusicGenerationProvider.mockReturnValue(provider);

    const result = await generateMusic({
=======
    providers = [provider];

    const result = await runGenerateMusic({
>>>>>>> upstream/main
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "music-plugin/track-v1" },
          },
        },
      } as OpenClawConfig,
      prompt: "play a synth line",
      agentDir: "/tmp/agent",
      authStore,
<<<<<<< HEAD
=======
      timeoutMs: 12_345,
>>>>>>> upstream/main
    });

    expect(result.provider).toBe("music-plugin");
    expect(result.model).toBe("track-v1");
<<<<<<< HEAD
    expect(result.attempts).toEqual([]);
    expect(result.ignoredOverrides).toEqual([]);
    expect(seenAuthStore).toEqual(authStore);
=======
    expect(result.attempts).toStrictEqual([]);
    expect(result.ignoredOverrides).toStrictEqual([]);
    expect(seenAuthStore).toEqual(authStore);
    expect(seenTimeoutMs).toBe(12_345);
>>>>>>> upstream/main
    expect(result.tracks).toEqual([
      {
        buffer: Buffer.from("mp3-bytes"),
        mimeType: "audio/mpeg",
        fileName: "sample.mp3",
      },
    ]);
  });

<<<<<<< HEAD
  it("lists runtime music-generation providers through the provider registry", () => {
    const providers: MusicGenerationProvider[] = [
=======
  it("uses configured music-generation timeout when call omits timeoutMs", async () => {
    let seenTimeoutMs: number | undefined;
    providers = [
      {
        id: "music-plugin",
        capabilities: {},
        async generateMusic(req: { timeoutMs?: number }) {
          seenTimeoutMs = req.timeoutMs;
          return {
            tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
            model: "track-v1",
          };
        },
      },
    ];

    await runGenerateMusic({
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "music-plugin/track-v1", timeoutMs: 300_000 },
          },
        },
      } as OpenClawConfig,
      prompt: "play a synth line",
    });

    expect(seenTimeoutMs).toBe(300_000);
  });

  it("does not list providers when explicit config disables auto provider fallback", async () => {
    const provider: MusicGenerationProvider = {
      id: "music-plugin",
      capabilities: {},
      async generateMusic() {
        return {
          tracks: [
            {
              buffer: Buffer.from("mp3-bytes"),
              mimeType: "audio/mpeg",
              fileName: "sample.mp3",
            },
          ],
          model: "track-v1",
        };
      },
    };
    providers = [provider];

    const params: GenerateMusicParams = {
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "music-plugin/track-v1" },
          },
        },
      } as OpenClawConfig,
      prompt: "play a synth line",
      autoProviderFallback: false,
    };

    const result = await runGenerateMusic(params);

    expect(result.provider).toBe("music-plugin");
    expect(listedConfigs).toStrictEqual([]);
  });

  it("auto-detects and falls through to another configured music-generation provider by default", async () => {
    providers = [
      {
        id: "google",
        defaultModel: "lyria-3-clip-preview",
        capabilities: {},
        isConfigured: () => true,
        async generateMusic() {
          throw new Error("Google music generation response missing audio data");
        },
      },
      {
        id: "minimax",
        defaultModel: "music-2.6",
        capabilities: {},
        isConfigured: () => true,
        async generateMusic() {
          return {
            tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
            model: "music-2.6",
          };
        },
      },
    ];

    const result = await runGenerateMusic({
      cfg: {} as OpenClawConfig,
      prompt: "play a synth line",
    });

    expect(result.provider).toBe("minimax");
    expect(result.model).toBe("music-2.6");
    expect(result.attempts).toEqual([
      {
        provider: "google",
        model: "lyria-3-clip-preview",
        error: "Google music generation response missing audio data",
      },
    ]);
  });

  it("lists runtime music-generation providers through the provider registry", () => {
    const registryProviders: MusicGenerationProvider[] = [
>>>>>>> upstream/main
      {
        id: "music-plugin",
        defaultModel: "track-v1",
        models: ["track-v1"],
        capabilities: {
<<<<<<< HEAD
          supportsDuration: true,
=======
          generate: {
            supportsDuration: true,
          },
>>>>>>> upstream/main
        },
        generateMusic: async () => ({
          tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
        }),
      },
    ];
<<<<<<< HEAD
    mocks.listMusicGenerationProviders.mockReturnValue(providers);

    expect(listRuntimeMusicGenerationProviders({ config: {} as OpenClawConfig })).toEqual(
      providers,
    );
    expect(mocks.listMusicGenerationProviders).toHaveBeenCalledWith({} as OpenClawConfig);
=======
    providers = registryProviders;

    expect(
      listRuntimeMusicGenerationProviders({ config: {} as OpenClawConfig }, runtimeDeps),
    ).toEqual(registryProviders);
    expect(listedConfigs).toEqual([{} as OpenClawConfig]);
>>>>>>> upstream/main
  });

  it("ignores unsupported optional overrides per provider and model", async () => {
    let seenRequest:
      | {
          lyrics?: string;
          instrumental?: boolean;
          durationSeconds?: number;
          format?: string;
        }
      | undefined;
<<<<<<< HEAD
    mocks.resolveAgentModelPrimaryValue.mockReturnValue("google/lyria-3-clip-preview");
    mocks.getMusicGenerationProvider.mockReturnValue({
      id: "google",
      capabilities: {
        supportsLyrics: true,
        supportsInstrumental: true,
        supportsFormat: true,
        supportedFormatsByModel: {
          "lyria-3-clip-preview": ["mp3"],
        },
      },
      generateMusic: async (req) => {
        seenRequest = {
          lyrics: req.lyrics,
          instrumental: req.instrumental,
          durationSeconds: req.durationSeconds,
          format: req.format,
        };
        return {
          tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
          model: "lyria-3-clip-preview",
        };
      },
    });

    const result = await generateMusic({
=======
    providers = [
      {
        id: "google",
        capabilities: {
          generate: {
            supportsLyrics: true,
            supportsInstrumental: true,
            supportsFormat: true,
            supportedFormatsByModel: {
              "lyria-3-clip-preview": ["mp3"],
            },
          },
        },
        generateMusic: async (req) => {
          seenRequest = {
            lyrics: req.lyrics,
            instrumental: req.instrumental,
            durationSeconds: req.durationSeconds,
            format: req.format,
          };
          return {
            tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
            model: "lyria-3-clip-preview",
          };
        },
      },
    ];

    const result = await runGenerateMusic({
>>>>>>> upstream/main
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "google/lyria-3-clip-preview" },
          },
        },
      } as OpenClawConfig,
      prompt: "energetic arcade anthem",
      lyrics: "Hero crab in the neon tide",
      instrumental: true,
      durationSeconds: 30,
      format: "wav",
    });

    expect(seenRequest).toEqual({
      lyrics: "Hero crab in the neon tide",
      instrumental: true,
      durationSeconds: undefined,
      format: undefined,
    });
    expect(result.ignoredOverrides).toEqual([
      { key: "durationSeconds", value: 30 },
      { key: "format", value: "wav" },
    ]);
  });
<<<<<<< HEAD
=======

  it("ignores model-specific unsupported lyrics and instrumental overrides", async () => {
    let seenRequest:
      | {
          lyrics?: string;
          instrumental?: boolean;
        }
      | undefined;
    providers = [
      {
        id: "fal",
        capabilities: {
          generate: {
            supportsLyrics: true,
            supportsLyricsByModel: {
              "fal-ai/stable-audio-25/text-to-audio": false,
            },
            supportsInstrumental: true,
            supportsInstrumentalByModel: {
              "fal-ai/stable-audio-25/text-to-audio": false,
            },
          },
        },
        generateMusic: async (req) => {
          seenRequest = {
            lyrics: req.lyrics,
            instrumental: req.instrumental,
          };
          return {
            tracks: [{ buffer: Buffer.from("wav-bytes"), mimeType: "audio/wav" }],
            model: "fal-ai/stable-audio-25/text-to-audio",
          };
        },
      },
    ];

    const result = await runGenerateMusic({
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "fal/fal-ai/stable-audio-25/text-to-audio" },
          },
        },
      } as OpenClawConfig,
      prompt: "orchestral hit",
      lyrics: "rise up",
      instrumental: true,
    });

    expect(seenRequest).toEqual({
      lyrics: undefined,
      instrumental: undefined,
    });
    expect(result.ignoredOverrides).toEqual([
      { key: "lyrics", value: "rise up" },
      { key: "instrumental", value: true },
    ]);
  });

  it("uses mode-specific capabilities for edit requests", async () => {
    let seenRequest:
      | {
          lyrics?: string;
          instrumental?: boolean;
          durationSeconds?: number;
          format?: string;
        }
      | undefined;
    providers = [
      {
        id: "google",
        capabilities: {
          generate: {
            supportsLyrics: false,
            supportsInstrumental: false,
            supportsFormat: true,
            supportedFormats: ["mp3"],
          },
          edit: {
            enabled: true,
            maxInputImages: 1,
            supportsLyrics: true,
            supportsInstrumental: true,
            supportsDuration: false,
            supportsFormat: false,
          },
        },
        generateMusic: async (req) => {
          seenRequest = {
            lyrics: req.lyrics,
            instrumental: req.instrumental,
            durationSeconds: req.durationSeconds,
            format: req.format,
          };
          return {
            tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
            model: "lyria-3-pro-preview",
          };
        },
      },
    ];

    const result = await runGenerateMusic({
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "google/lyria-3-pro-preview" },
          },
        },
      } as OpenClawConfig,
      prompt: "turn this cover image into a trailer cue",
      lyrics: "rise up",
      instrumental: true,
      durationSeconds: 30,
      format: "mp3",
      inputImages: [{ buffer: Buffer.from("png"), mimeType: "image/png" }],
    });

    expect(seenRequest).toEqual({
      lyrics: "rise up",
      instrumental: true,
      durationSeconds: undefined,
      format: undefined,
    });
    expect(result.ignoredOverrides).toEqual([
      { key: "durationSeconds", value: 30 },
      { key: "format", value: "mp3" },
    ]);
  });

  it("normalizes requested durations to the closest supported max duration", async () => {
    let seenRequest:
      | {
          durationSeconds?: number;
        }
      | undefined;
    providers = [
      {
        id: "minimax",
        capabilities: {
          generate: {
            supportsDuration: true,
            maxDurationSeconds: 30,
          },
        },
        generateMusic: async (req) => {
          seenRequest = {
            durationSeconds: req.durationSeconds,
          };
          return {
            tracks: [{ buffer: Buffer.from("mp3-bytes"), mimeType: "audio/mpeg" }],
            model: "music-2.6",
          };
        },
      },
    ];

    const result = await runGenerateMusic({
      cfg: {
        agents: {
          defaults: {
            musicGenerationModel: { primary: "minimax/music-2.6" },
          },
        },
      } as OpenClawConfig,
      prompt: "energetic arcade anthem",
      durationSeconds: 45,
    });

    expect(seenRequest).toEqual({
      durationSeconds: 30,
    });
    expect(result.ignoredOverrides).toStrictEqual([]);
    if (!result.normalization || !result.metadata) {
      throw new Error("Expected normalization and metadata");
    }
    expect(result.normalization.durationSeconds?.requested).toBe(45);
    expect(result.normalization.durationSeconds?.applied).toBe(30);
    expect(result.metadata.requestedDurationSeconds).toBe(45);
    expect(result.metadata.normalizedDurationSeconds).toBe(30);
  });
>>>>>>> upstream/main
});
