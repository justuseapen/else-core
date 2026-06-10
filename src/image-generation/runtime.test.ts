<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { generateImage, listRuntimeImageGenerationProviders } from "./runtime.js";
import type { ImageGenerationProvider } from "./types.js";

const mocks = vi.hoisted(() => {
  const debug = vi.fn();
  return {
    createSubsystemLogger: vi.fn(() => ({ debug })),
    describeFailoverError: vi.fn(),
    getImageGenerationProvider: vi.fn<
      (providerId: string, config?: OpenClawConfig) => ImageGenerationProvider | undefined
    >(() => undefined),
    getProviderEnvVars: vi.fn<(providerId: string) => string[]>(() => []),
    isFailoverError: vi.fn<(err: unknown) => boolean>(() => false),
    listImageGenerationProviders: vi.fn<(config?: OpenClawConfig) => ImageGenerationProvider[]>(
      () => [],
    ),
    parseImageGenerationModelRef: vi.fn<
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
  parseImageGenerationModelRef: mocks.parseImageGenerationModelRef,
}));
vi.mock("./provider-registry.js", () => ({
  getImageGenerationProvider: mocks.getImageGenerationProvider,
  listImageGenerationProviders: mocks.listImageGenerationProviders,
}));

describe("image-generation runtime", () => {
  beforeEach(() => {
    mocks.createSubsystemLogger.mockClear();
    mocks.describeFailoverError.mockReset();
    mocks.getImageGenerationProvider.mockReset();
    mocks.getProviderEnvVars.mockReset();
    mocks.getProviderEnvVars.mockReturnValue([]);
    mocks.isFailoverError.mockReset();
    mocks.isFailoverError.mockReturnValue(false);
    mocks.listImageGenerationProviders.mockReset();
    mocks.listImageGenerationProviders.mockReturnValue([]);
    mocks.parseImageGenerationModelRef.mockClear();
    mocks.resolveAgentModelFallbackValues.mockReset();
    mocks.resolveAgentModelFallbackValues.mockReturnValue([]);
    mocks.resolveAgentModelPrimaryValue.mockReset();
    mocks.resolveAgentModelPrimaryValue.mockReturnValue(undefined);
    mocks.debug.mockReset();
=======
/** Tests image-generation runtime fallback, overrides, and error reporting. */
import { beforeEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  generateImage,
  listRuntimeImageGenerationProviders,
  type GenerateImageParams,
  type ImageGenerationRuntimeDeps,
} from "./runtime.js";
import type { ImageGenerationProvider } from "./types.js";

let providers: ImageGenerationProvider[] = [];
let listedConfigs: Array<OpenClawConfig | undefined> = [];
let providerEnvVars: Record<string, string[]> = {};
let warnings: string[] = [];

const runtimeDeps: ImageGenerationRuntimeDeps = {
  getProvider: (providerId) => providers.find((provider) => provider.id === providerId),
  listProviders: (config) => {
    listedConfigs.push(config);
    return providers;
  },
  getProviderEnvVars: (providerId) => providerEnvVars[providerId] ?? [],
  log: {
    warn: (message) => {
      warnings.push(message);
    },
  },
};

function runGenerateImage(params: GenerateImageParams) {
  return generateImage(params, runtimeDeps);
}

describe("image-generation runtime", () => {
  beforeEach(() => {
    providers = [];
    listedConfigs = [];
    providerEnvVars = {};
    warnings = [];
>>>>>>> upstream/main
  });

  it("generates images through the active image-generation provider", async () => {
    const authStore = { version: 1, profiles: {} } as const;
    let seenAuthStore: unknown;
<<<<<<< HEAD
    mocks.resolveAgentModelPrimaryValue.mockReturnValue("image-plugin/img-v1");
=======
    let seenTimeoutMs: number | undefined;
    let seenSsrfPolicy: unknown;
>>>>>>> upstream/main
    const provider: ImageGenerationProvider = {
      id: "image-plugin",
      capabilities: {
        generate: {},
        edit: { enabled: false },
      },
<<<<<<< HEAD
      async generateImage(req: { authStore?: unknown }) {
        seenAuthStore = req.authStore;
=======
      async generateImage(req: { authStore?: unknown; timeoutMs?: number; ssrfPolicy?: unknown }) {
        seenAuthStore = req.authStore;
        seenTimeoutMs = req.timeoutMs;
        seenSsrfPolicy = req.ssrfPolicy;
>>>>>>> upstream/main
        return {
          images: [
            {
              buffer: Buffer.from("png-bytes"),
              mimeType: "image/png",
              fileName: "sample.png",
            },
          ],
          model: "img-v1",
        };
      },
    };
<<<<<<< HEAD
    mocks.getImageGenerationProvider.mockReturnValue(provider);

    const result = await generateImage({
=======
    providers = [provider];

    const result = await runGenerateImage({
>>>>>>> upstream/main
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "image-plugin/img-v1" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      agentDir: "/tmp/agent",
      authStore,
      timeoutMs: 12_345,
      ssrfPolicy: { allowRfc2544BenchmarkRange: true },
    });

    expect(result.provider).toBe("image-plugin");
    expect(result.model).toBe("img-v1");
    expect(result.attempts).toStrictEqual([]);
    expect(seenAuthStore).toEqual(authStore);
    expect(seenTimeoutMs).toBe(12_345);
    expect(seenSsrfPolicy).toEqual({ allowRfc2544BenchmarkRange: true });
    expect(result.images).toEqual([
      {
        buffer: Buffer.from("png-bytes"),
        mimeType: "image/png",
        fileName: "sample.png",
      },
    ]);
<<<<<<< HEAD
    expect(result.ignoredOverrides).toEqual([]);
  });

=======
    expect(result.ignoredOverrides).toStrictEqual([]);
  });

  it("does not list providers when explicit config disables auto provider fallback", async () => {
    const provider: ImageGenerationProvider = {
      id: "image-plugin",
      capabilities: {
        generate: {},
        edit: { enabled: false },
      },
      async generateImage() {
        return {
          images: [
            {
              buffer: Buffer.from("png-bytes"),
              mimeType: "image/png",
              fileName: "sample.png",
            },
          ],
          model: "img-v1",
        };
      },
    };
    providers = [provider];

    const params: GenerateImageParams = {
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "image-plugin/img-v1" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      autoProviderFallback: false,
    };

    const result = await runGenerateImage(params);

    expect(result.provider).toBe("image-plugin");
    expect(listedConfigs).toStrictEqual([]);
  });

  it("uses configured image-generation timeout when the call omits timeoutMs", async () => {
    let seenTimeoutMs: number | undefined;
    const provider: ImageGenerationProvider = {
      id: "image-plugin",
      capabilities: {
        generate: {},
        edit: { enabled: false },
      },
      async generateImage(req: { timeoutMs?: number }) {
        seenTimeoutMs = req.timeoutMs;
        return {
          images: [
            {
              buffer: Buffer.from("png-bytes"),
              mimeType: "image/png",
              fileName: "sample.png",
            },
          ],
          model: "img-v1",
        };
      },
    };
    providers = [provider];

    await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: {
              primary: "image-plugin/img-v1",
              timeoutMs: 180_000,
            },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
    });

    expect(seenTimeoutMs).toBe(180_000);
  });

  it("uses provider default image-generation timeout when the call and config omit timeoutMs", async () => {
    let seenTimeoutMs: number | undefined;
    const provider: ImageGenerationProvider = {
      id: "image-plugin",
      defaultTimeoutMs: 600_000,
      capabilities: {
        generate: {},
        edit: { enabled: false },
      },
      async generateImage(req: { timeoutMs?: number }) {
        seenTimeoutMs = req.timeoutMs;
        return {
          images: [
            {
              buffer: Buffer.from("png-bytes"),
              mimeType: "image/png",
              fileName: "sample.png",
            },
          ],
          model: "img-v1",
        };
      },
    };
    providers = [provider];

    await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "image-plugin/img-v1" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
    });

    expect(seenTimeoutMs).toBe(600_000);
  });

  it("auto-detects and falls through to another configured image-generation provider by default", async () => {
    providers = [
      {
        id: "openai",
        defaultModel: "gpt-image-1",
        capabilities: {
          generate: {},
          edit: { enabled: true },
        },
        isConfigured: () => true,
        async generateImage() {
          throw new Error("OpenAI API key missing");
        },
      },
      {
        id: "google",
        defaultModel: "gemini-3.1-flash-image-preview",
        capabilities: {
          generate: {},
          edit: { enabled: true },
        },
        isConfigured: () => true,
        async generateImage() {
          return {
            images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
            model: "gemini-3.1-flash-image-preview",
          };
        },
      },
    ];

    const result = await runGenerateImage({
      cfg: {} as OpenClawConfig,
      prompt: "draw a cat",
    });

    expect(result.provider).toBe("google");
    expect(result.model).toBe("gemini-3.1-flash-image-preview");
    expect(result.attempts).toEqual([
      {
        provider: "openai",
        model: "gpt-image-1",
        error: "OpenAI API key missing",
      },
    ]);
    expect(warnings).toContain(
      "image-generation candidate failed: openai/gpt-image-1: OpenAI API key missing",
    );
  });

>>>>>>> upstream/main
  it("drops unsupported provider geometry overrides and reports them", async () => {
    let seenRequest:
      | {
          size?: string;
          aspectRatio?: string;
          resolution?: string;
        }
      | undefined;
<<<<<<< HEAD
    mocks.resolveAgentModelPrimaryValue.mockReturnValue("openai/gpt-image-1");
    mocks.getImageGenerationProvider.mockReturnValue({
      id: "openai",
      capabilities: {
        generate: {
          supportsSize: true,
          supportsAspectRatio: false,
          supportsResolution: false,
        },
        edit: {
          enabled: true,
          supportsSize: true,
          supportsAspectRatio: false,
          supportsResolution: false,
        },
        geometry: {
          sizes: ["1024x1024", "1024x1536", "1536x1024"],
        },
      },
      async generateImage(req) {
        seenRequest = {
          size: req.size,
          aspectRatio: req.aspectRatio,
          resolution: req.resolution,
        };
        return {
          images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
        };
      },
    });

    const result = await generateImage({
=======
    providers = [
      {
        id: "openai",
        capabilities: {
          generate: {
            supportsSize: true,
            supportsAspectRatio: false,
            supportsResolution: false,
          },
          edit: {
            enabled: true,
            supportsSize: true,
            supportsAspectRatio: false,
            supportsResolution: false,
          },
          geometry: {
            sizes: ["1024x1024", "1024x1536", "1536x1024"],
          },
        },
        async generateImage(req) {
          seenRequest = {
            size: req.size,
            aspectRatio: req.aspectRatio,
            resolution: req.resolution,
          };
          return {
            images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
          };
        },
      },
    ];

    const result = await runGenerateImage({
>>>>>>> upstream/main
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "openai/gpt-image-1" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      size: "1024x1024",
      aspectRatio: "1:1",
      resolution: "2K",
    });

    expect(seenRequest).toEqual({
      size: "1024x1024",
      aspectRatio: undefined,
      resolution: undefined,
    });
    expect(result.ignoredOverrides).toEqual([
      { key: "aspectRatio", value: "1:1" },
      { key: "resolution", value: "2K" },
    ]);
  });

<<<<<<< HEAD
  it("lists runtime image-generation providers through the provider registry", () => {
    const providers: ImageGenerationProvider[] = [
=======
  it("filters image output hints by provider capabilities", async () => {
    let seenRequest:
      | {
          quality?: string;
          outputFormat?: string;
          background?: string;
          providerOptions?: unknown;
        }
      | undefined;
    providers = [
      {
        id: "openai",
        capabilities: {
          generate: {
            supportsSize: true,
          },
          edit: {
            enabled: true,
            supportsSize: true,
          },
          output: {
            qualities: ["low", "medium", "high", "auto"],
            formats: ["png", "jpeg", "webp"],
            backgrounds: ["transparent", "opaque", "auto"],
          },
        },
        async generateImage(req) {
          seenRequest = {
            quality: req.quality,
            outputFormat: req.outputFormat,
            background: req.background,
            providerOptions: req.providerOptions,
          };
          return {
            images: [{ buffer: Buffer.from("jpeg-bytes"), mimeType: "image/jpeg" }],
          };
        },
      },
    ];

    const result = await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "openai/gpt-image-2" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cheap preview",
      quality: "low",
      outputFormat: "jpeg",
      background: "opaque",
      providerOptions: {
        openai: {
          background: "opaque",
          moderation: "low",
          outputCompression: 60,
          user: "end-user-42",
        },
      },
    });

    expect(seenRequest).toEqual({
      quality: "low",
      outputFormat: "jpeg",
      background: "opaque",
      providerOptions: {
        openai: {
          background: "opaque",
          moderation: "low",
          outputCompression: 60,
          user: "end-user-42",
        },
      },
    });
    expect(result.ignoredOverrides).toStrictEqual([]);
  });

  it("drops unsupported image output hints and reports them", async () => {
    let seenRequest:
      | {
          quality?: string;
          outputFormat?: string;
          background?: string;
        }
      | undefined;
    providers = [
      {
        id: "vydra",
        capabilities: {
          generate: {},
          edit: {
            enabled: false,
          },
        },
        async generateImage(req) {
          seenRequest = {
            quality: req.quality,
            outputFormat: req.outputFormat,
            background: req.background,
          };
          return {
            images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
          };
        },
      },
    ];

    const result = await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "vydra/grok-imagine" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      quality: "low",
      outputFormat: "jpeg",
      background: "transparent",
    });

    expect(seenRequest).toEqual({
      quality: undefined,
      outputFormat: undefined,
      background: undefined,
    });
    expect(result.ignoredOverrides).toEqual([
      { key: "quality", value: "low" },
      { key: "outputFormat", value: "jpeg" },
      { key: "background", value: "transparent" },
    ]);
  });

  it("maps requested size to the closest supported fallback geometry", async () => {
    let seenRequest:
      | {
          size?: string;
          aspectRatio?: string;
          resolution?: string;
        }
      | undefined;
    providers = [
      {
        id: "minimax",
        capabilities: {
          generate: {
            supportsSize: false,
            supportsAspectRatio: true,
            supportsResolution: false,
          },
          edit: {
            enabled: true,
            supportsSize: false,
            supportsAspectRatio: true,
            supportsResolution: false,
          },
          geometry: {
            aspectRatios: ["1:1", "16:9"],
          },
        },
        async generateImage(req) {
          seenRequest = {
            size: req.size,
            aspectRatio: req.aspectRatio,
            resolution: req.resolution,
          };
          return {
            images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
            model: "image-01",
          };
        },
      },
    ];

    const result = await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "minimax/image-01" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      size: "1280x720",
    });

    expect(seenRequest).toEqual({
      size: undefined,
      aspectRatio: "16:9",
      resolution: undefined,
    });
    expect(result.ignoredOverrides).toStrictEqual([]);
    if (!result.normalization || !result.metadata) {
      throw new Error("Expected image-generation normalization metadata");
    }
    expect(result.normalization.aspectRatio?.applied).toBe("16:9");
    expect(result.normalization.aspectRatio?.derivedFrom).toBe("size");
    expect(result.metadata.requestedSize).toBe("1280x720");
    expect(result.metadata.normalizedAspectRatio).toBe("16:9");
    expect(result.metadata.aspectRatioDerivedFromSize).toBe("16:9");
  });

  it("uses model-specific geometry lists before provider normalization", async () => {
    let seenRequest:
      | {
          size?: string;
          aspectRatio?: string;
        }
      | undefined;
    providers = [
      {
        id: "fal",
        capabilities: {
          generate: {
            supportsSize: true,
            supportsAspectRatio: true,
          },
          edit: {
            enabled: true,
            supportsSize: true,
            supportsAspectRatio: true,
          },
          geometry: {
            sizes: ["1024x1024", "1536x1024", "1024x1536"],
            sizesByModel: {
              "krea/v2/medium/text-to-image": [],
            },
            aspectRatios: ["1:1", "4:3", "3:2", "16:9"],
          },
        },
        async generateImage(req) {
          seenRequest = {
            size: req.size,
            aspectRatio: req.aspectRatio,
          };
          return {
            images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
          };
        },
      },
    ];

    await runGenerateImage({
      cfg: {
        agents: {
          defaults: {
            imageGenerationModel: { primary: "fal/krea/v2/medium/text-to-image" },
          },
        },
      } as OpenClawConfig,
      prompt: "draw a cat",
      size: "1024x768",
    });

    expect(seenRequest).toEqual({
      size: "1024x768",
      aspectRatio: undefined,
    });
  });

  it("lists runtime image-generation providers through the provider registry", () => {
    const registryProviders: ImageGenerationProvider[] = [
>>>>>>> upstream/main
      {
        id: "image-plugin",
        defaultModel: "img-v1",
        models: ["img-v1", "img-v2"],
        capabilities: {
          generate: {
            supportsResolution: true,
          },
          edit: {
            enabled: true,
            maxInputImages: 3,
          },
          geometry: {
            resolutions: ["1K", "2K"],
          },
        },
        generateImage: async () => ({
          images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
        }),
      },
    ];
<<<<<<< HEAD
    mocks.listImageGenerationProviders.mockReturnValue(providers);

    expect(listRuntimeImageGenerationProviders({ config: {} as OpenClawConfig })).toEqual(
      providers,
    );
    expect(mocks.listImageGenerationProviders).toHaveBeenCalledWith({} as OpenClawConfig);
  });

  it("builds a generic config hint without hardcoded provider ids", async () => {
    mocks.listImageGenerationProviders.mockReturnValue([
      {
        id: "vision-one",
        defaultModel: "paint-v1",
=======
    providers = registryProviders;

    expect(
      listRuntimeImageGenerationProviders({ config: {} as OpenClawConfig }, runtimeDeps),
    ).toEqual(registryProviders);
    expect(listedConfigs).toEqual([{} as OpenClawConfig]);
  });

  it("builds a generic config hint without hardcoded provider ids", async () => {
    providers = [
      {
        id: "vision-one",
        defaultModel: "paint-v1",
        isConfigured: () => false,
>>>>>>> upstream/main
        capabilities: {
          generate: {},
          edit: { enabled: false },
        },
        generateImage: async () => ({
          images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
        }),
      },
      {
        id: "vision-two",
        defaultModel: "paint-v2",
<<<<<<< HEAD
=======
        isConfigured: () => false,
>>>>>>> upstream/main
        capabilities: {
          generate: {},
          edit: { enabled: false },
        },
        generateImage: async () => ({
          images: [{ buffer: Buffer.from("png-bytes"), mimeType: "image/png" }],
        }),
      },
<<<<<<< HEAD
    ]);
    mocks.getProviderEnvVars.mockImplementation((providerId: string) => {
      if (providerId === "vision-one") {
        return ["VISION_ONE_API_KEY"];
      }
      if (providerId === "vision-two") {
        return ["VISION_TWO_API_KEY"];
      }
      return [];
    });

    const promise = generateImage({ cfg: {} as OpenClawConfig, prompt: "draw a cat" });

    await expect(promise).rejects.toThrow("No image-generation model configured.");
    await expect(promise).rejects.toThrow(
      'Set agents.defaults.imageGenerationModel.primary to a provider/model like "vision-one/paint-v1".',
    );
    await expect(promise).rejects.toThrow("vision-one: VISION_ONE_API_KEY");
    await expect(promise).rejects.toThrow("vision-two: VISION_TWO_API_KEY");
=======
    ];
    providerEnvVars = {
      "vision-one": ["VISION_ONE_API_KEY"],
      "vision-two": ["VISION_TWO_API_KEY"],
    };

    await expect(
      runGenerateImage({ cfg: {} as OpenClawConfig, prompt: "draw a cat" }),
    ).rejects.toThrow(
      'No image-generation model configured. Set agents.defaults.imageGenerationModel.primary to a provider/model like "vision-one/paint-v1". If you want a specific provider, also configure that provider\'s auth/API key first (vision-one: VISION_ONE_API_KEY; vision-two: VISION_TWO_API_KEY).',
    );
>>>>>>> upstream/main
  });
});
