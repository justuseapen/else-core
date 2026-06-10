// Openai plugin entrypoint registers its OpenClaw integration.
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
<<<<<<< HEAD
=======
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
>>>>>>> upstream/main
import { buildOpenAIImageGenerationProvider } from "./image-generation-provider.js";
import { openaiMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { openAiMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { buildOpenAIProvider } from "./openai-provider.js";
import {
  resolveOpenAIPromptOverlayMode,
  resolveOpenAISystemPromptContribution,
} from "./prompt-overlay.js";
import { buildOpenAIRealtimeTranscriptionProvider } from "./realtime-transcription-provider.js";
import { buildOpenAIRealtimeVoiceProvider } from "./realtime-voice-provider.js";
import { buildOpenAISpeechProvider } from "./speech-provider.js";
import { buildOpenAIVideoGenerationProvider } from "./video-generation-provider.js";

export default definePluginEntry({
  id: "openai",
  name: "OpenAI Provider",
  description: "Bundled OpenAI provider plugins",
  register(api) {
<<<<<<< HEAD
    const promptOverlayMode = resolveOpenAIPromptOverlayMode(api.pluginConfig);
    const buildProviderWithPromptContribution = <
      T extends
        | ReturnType<typeof buildOpenAIProvider>
        | ReturnType<typeof buildOpenAICodexProviderPlugin>,
    >(
      provider: T,
    ): T => ({
      ...provider,
      resolveSystemPromptContribution: (ctx) =>
        resolveOpenAISystemPromptContribution({
          mode: promptOverlayMode,
          modelProviderId: provider.id,
          modelId: ctx.modelId,
        }),
    });
    api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
    api.registerProvider(buildProviderWithPromptContribution(buildOpenAICodexProviderPlugin()));
=======
    const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
    const buildProviderWithPromptContribution = <T extends ReturnType<typeof buildOpenAIProvider>>(
      provider: T,
    ): T => ({
      ...provider,
      ...openAIToolCompatHooks,
      resolveSystemPromptContribution: (ctx) => {
        const runtimePluginConfig = resolvePluginConfigObject(ctx.config, "openai");
        const pluginConfig =
          runtimePluginConfig ??
          (ctx.config ? undefined : (api.pluginConfig as Record<string, unknown>));
        return resolveOpenAISystemPromptContribution({
          config: ctx.config,
          legacyPluginConfig: pluginConfig,
          mode: resolveOpenAIPromptOverlayMode(pluginConfig),
          modelProviderId: provider.id,
          modelId: ctx.modelId,
          trigger: ctx.trigger,
        });
      },
    });
    api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
    api.registerMemoryEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
>>>>>>> upstream/main
    api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
    api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
    api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
    api.registerSpeechProvider(buildOpenAISpeechProvider());
    api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
<<<<<<< HEAD
    api.registerMediaUnderstandingProvider(openaiCodexMediaUnderstandingProvider);
=======
>>>>>>> upstream/main
    api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
  },
});
