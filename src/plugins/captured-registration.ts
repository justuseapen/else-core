<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { buildPluginApi } from "./api-builder.js";
import type { MemoryEmbeddingProviderAdapter } from "./memory-embedding-providers.js";
import type { PluginRuntime } from "./runtime/types.js";
import type {
  AnyAgentTool,
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  MusicGenerationProviderPlugin,
  OpenClawPluginApi,
  OpenClawPluginCliCommandDescriptor,
  OpenClawPluginCliRegistrar,
=======
// Captures plugin registrations for controlled registry assembly.
import { normalizeStringEntries } from "@openclaw/normalization-core/string-normalization";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type {
  AgentToolResultMiddleware,
  AgentToolResultMiddlewareOptions,
} from "./agent-tool-result-middleware-types.js";
import { normalizeAgentToolResultMiddlewareRuntimes } from "./agent-tool-result-middleware.js";
import { buildPluginApi } from "./api-builder.js";
import type { CodexAppServerExtensionFactory } from "./codex-app-server-extension-types.js";
import type { EmbeddingProviderAdapter } from "./embedding-providers.js";
import type {
  PluginAgentEventSubscriptionRegistration,
  PluginControlUiDescriptor,
  PluginRuntimeLifecycleRegistration,
  PluginSessionActionRegistration,
  PluginSessionSchedulerJobRegistration,
  PluginSessionExtensionRegistration,
  PluginToolMetadataRegistration,
  PluginTrustedToolPolicyRegistration,
} from "./host-hooks.js";
import type { MemoryEmbeddingProviderAdapter } from "./memory-embedding-providers.js";
import type { PluginAgentToolResultMiddlewareRegistration } from "./registry-types.js";
import type { PluginRuntime } from "./runtime/types.js";
import type {
  AnyAgentTool,
  AgentHarness,
  CliBackendPlugin,
  OpenClawPluginApi,
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  TranscriptSourceProvider,
  MigrationProviderPlugin,
  MusicGenerationProviderPlugin,
  OpenClawPluginCliCommandDescriptor,
  OpenClawPluginCliRegistrar,
  PluginTextTransformRegistration,
>>>>>>> upstream/main
  ProviderPlugin,
  RealtimeTranscriptionProviderPlugin,
  RealtimeVoiceProviderPlugin,
  SpeechProviderPlugin,
<<<<<<< HEAD
=======
  UnifiedModelCatalogProviderPlugin,
>>>>>>> upstream/main
  VideoGenerationProviderPlugin,
  WebFetchProviderPlugin,
  WebSearchProviderPlugin,
} from "./types.js";

type CapturedPluginCliRegistration = {
  register: OpenClawPluginCliRegistrar;
<<<<<<< HEAD
=======
  parentPath: string[];
>>>>>>> upstream/main
  commands: string[];
  descriptors: OpenClawPluginCliCommandDescriptor[];
};

export type CapturedPluginRegistration = {
  api: OpenClawPluginApi;
  providers: ProviderPlugin[];
<<<<<<< HEAD
  cliRegistrars: CapturedPluginCliRegistration[];
=======
  agentHarnesses: AgentHarness[];
  cliRegistrars: CapturedPluginCliRegistration[];
  cliBackends: CliBackendPlugin[];
  textTransforms: PluginTextTransformRegistration[];
  codexAppServerExtensionFactories: CodexAppServerExtensionFactory[];
  agentToolResultMiddlewares: PluginAgentToolResultMiddlewareRegistration[];
  embeddingProviders: EmbeddingProviderAdapter[];
>>>>>>> upstream/main
  speechProviders: SpeechProviderPlugin[];
  realtimeTranscriptionProviders: RealtimeTranscriptionProviderPlugin[];
  realtimeVoiceProviders: RealtimeVoiceProviderPlugin[];
  mediaUnderstandingProviders: MediaUnderstandingProviderPlugin[];
  transcriptSourceProviders: TranscriptSourceProvider[];
  imageGenerationProviders: ImageGenerationProviderPlugin[];
  videoGenerationProviders: VideoGenerationProviderPlugin[];
  musicGenerationProviders: MusicGenerationProviderPlugin[];
  webFetchProviders: WebFetchProviderPlugin[];
  webSearchProviders: WebSearchProviderPlugin[];
<<<<<<< HEAD
  memoryEmbeddingProviders: MemoryEmbeddingProviderAdapter[];
=======
  migrationProviders: MigrationProviderPlugin[];
  memoryEmbeddingProviders: MemoryEmbeddingProviderAdapter[];
  sessionExtensions: PluginSessionExtensionRegistration[];
  trustedToolPolicies: PluginTrustedToolPolicyRegistration[];
  toolMetadata: PluginToolMetadataRegistration[];
  controlUiDescriptors: PluginControlUiDescriptor[];
  runtimeLifecycles: PluginRuntimeLifecycleRegistration[];
  agentEventSubscriptions: PluginAgentEventSubscriptionRegistration[];
  sessionSchedulerJobs: PluginSessionSchedulerJobRegistration[];
  sessionActions: PluginSessionActionRegistration[];
>>>>>>> upstream/main
  tools: AnyAgentTool[];
  modelCatalogProviders: UnifiedModelCatalogProviderPlugin[];
};

export function createCapturedPluginRegistration(params?: {
  config?: OpenClawConfig;
<<<<<<< HEAD
  registrationMode?: OpenClawPluginApi["registrationMode"];
}): CapturedPluginRegistration {
  const providers: ProviderPlugin[] = [];
  const cliRegistrars: CapturedPluginCliRegistration[] = [];
=======
  id?: string;
  name?: string;
  registrationMode?: OpenClawPluginApi["registrationMode"];
  source?: string;
}): CapturedPluginRegistration {
  const providers: ProviderPlugin[] = [];
  const agentHarnesses: AgentHarness[] = [];
  const cliRegistrars: CapturedPluginCliRegistration[] = [];
  const cliBackends: CliBackendPlugin[] = [];
  const textTransforms: PluginTextTransformRegistration[] = [];
  const codexAppServerExtensionFactories: CodexAppServerExtensionFactory[] = [];
  const agentToolResultMiddlewares: PluginAgentToolResultMiddlewareRegistration[] = [];
  const embeddingProviders: EmbeddingProviderAdapter[] = [];
>>>>>>> upstream/main
  const speechProviders: SpeechProviderPlugin[] = [];
  const realtimeTranscriptionProviders: RealtimeTranscriptionProviderPlugin[] = [];
  const realtimeVoiceProviders: RealtimeVoiceProviderPlugin[] = [];
  const mediaUnderstandingProviders: MediaUnderstandingProviderPlugin[] = [];
  const transcriptSourceProviders: TranscriptSourceProvider[] = [];
  const imageGenerationProviders: ImageGenerationProviderPlugin[] = [];
  const videoGenerationProviders: VideoGenerationProviderPlugin[] = [];
  const musicGenerationProviders: MusicGenerationProviderPlugin[] = [];
  const webFetchProviders: WebFetchProviderPlugin[] = [];
  const webSearchProviders: WebSearchProviderPlugin[] = [];
<<<<<<< HEAD
  const memoryEmbeddingProviders: MemoryEmbeddingProviderAdapter[] = [];
  const tools: AnyAgentTool[] = [];
=======
  const migrationProviders: MigrationProviderPlugin[] = [];
  const memoryEmbeddingProviders: MemoryEmbeddingProviderAdapter[] = [];
  const sessionExtensions: PluginSessionExtensionRegistration[] = [];
  const trustedToolPolicies: PluginTrustedToolPolicyRegistration[] = [];
  const toolMetadata: PluginToolMetadataRegistration[] = [];
  const controlUiDescriptors: PluginControlUiDescriptor[] = [];
  const runtimeLifecycles: PluginRuntimeLifecycleRegistration[] = [];
  const agentEventSubscriptions: PluginAgentEventSubscriptionRegistration[] = [];
  const sessionSchedulerJobs: PluginSessionSchedulerJobRegistration[] = [];
  const sessionActions: PluginSessionActionRegistration[] = [];
  let capturedSessionTurnCount = 0;
  const tools: AnyAgentTool[] = [];
  const modelCatalogProviders: UnifiedModelCatalogProviderPlugin[] = [];
  const pluginId = params?.id ?? "captured-plugin-registration";
  const pluginName = params?.name ?? "Captured Plugin Registration";
  const pluginSource = params?.source ?? "captured-plugin-registration";
>>>>>>> upstream/main
  const noopLogger = {
    info() {},
    warn() {},
    error() {},
    debug() {},
  };

  return {
    providers,
<<<<<<< HEAD
    cliRegistrars,
=======
    agentHarnesses,
    cliRegistrars,
    cliBackends,
    textTransforms,
    codexAppServerExtensionFactories,
    agentToolResultMiddlewares,
    embeddingProviders,
>>>>>>> upstream/main
    speechProviders,
    realtimeTranscriptionProviders,
    realtimeVoiceProviders,
    mediaUnderstandingProviders,
    transcriptSourceProviders,
    imageGenerationProviders,
    videoGenerationProviders,
    musicGenerationProviders,
    webFetchProviders,
    webSearchProviders,
<<<<<<< HEAD
    memoryEmbeddingProviders,
    tools,
    api: buildPluginApi({
      id: "captured-plugin-registration",
      name: "Captured Plugin Registration",
      source: "captured-plugin-registration",
=======
    migrationProviders,
    memoryEmbeddingProviders,
    sessionExtensions,
    trustedToolPolicies,
    toolMetadata,
    controlUiDescriptors,
    runtimeLifecycles,
    agentEventSubscriptions,
    sessionSchedulerJobs,
    sessionActions,
    tools,
    modelCatalogProviders,
    api: buildPluginApi({
      id: pluginId,
      name: pluginName,
      source: pluginSource,
>>>>>>> upstream/main
      registrationMode: params?.registrationMode ?? "full",
      config: params?.config ?? ({} as OpenClawConfig),
      runtime: {} as PluginRuntime,
      logger: noopLogger,
      resolvePath: (input) => input,
      handlers: {
        registerCli(registrar, opts) {
<<<<<<< HEAD
=======
          const parentPath = normalizeStringEntries(opts?.parentPath ?? []);
>>>>>>> upstream/main
          const descriptors = (opts?.descriptors ?? [])
            .map((descriptor) => ({
              name: descriptor.name.trim(),
              description: descriptor.description.trim(),
              hasSubcommands: descriptor.hasSubcommands,
            }))
            .filter((descriptor) => descriptor.name && descriptor.description);
<<<<<<< HEAD
          const commands = [
            ...(opts?.commands ?? []),
            ...descriptors.map((descriptor) => descriptor.name),
          ]
            .map((command) => command.trim())
            .filter(Boolean);
=======
          const commands = normalizeStringEntries([
            ...(opts?.commands ?? []),
            ...descriptors.map((descriptor) => descriptor.name),
          ]);
>>>>>>> upstream/main
          if (commands.length === 0) {
            return;
          }
          cliRegistrars.push({
            register: registrar,
<<<<<<< HEAD
=======
            parentPath,
>>>>>>> upstream/main
            commands,
            descriptors,
          });
        },
        registerProvider(provider: ProviderPlugin) {
          providers.push(provider);
        },
<<<<<<< HEAD
=======
        registerModelCatalogProvider(provider: UnifiedModelCatalogProviderPlugin) {
          modelCatalogProviders.push(provider);
        },
        registerAgentHarness(harness: AgentHarness) {
          agentHarnesses.push(harness);
        },
        registerCodexAppServerExtensionFactory(factory: CodexAppServerExtensionFactory) {
          codexAppServerExtensionFactories.push(factory);
        },
        registerAgentToolResultMiddleware(
          handler: AgentToolResultMiddleware,
          options?: AgentToolResultMiddlewareOptions,
        ) {
          const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
          agentToolResultMiddlewares.push({
            pluginId,
            pluginName,
            rawHandler: handler,
            handler,
            runtimes,
            source: pluginSource,
          });
        },
        registerCliBackend(backend: CliBackendPlugin) {
          cliBackends.push(backend);
        },
        registerTextTransforms(transforms: PluginTextTransformRegistration) {
          textTransforms.push(transforms);
        },
        registerEmbeddingProvider(provider: EmbeddingProviderAdapter) {
          embeddingProviders.push(provider);
        },
>>>>>>> upstream/main
        registerSpeechProvider(provider: SpeechProviderPlugin) {
          speechProviders.push(provider);
        },
        registerRealtimeTranscriptionProvider(provider: RealtimeTranscriptionProviderPlugin) {
          realtimeTranscriptionProviders.push(provider);
        },
        registerRealtimeVoiceProvider(provider: RealtimeVoiceProviderPlugin) {
          realtimeVoiceProviders.push(provider);
        },
        registerMediaUnderstandingProvider(provider: MediaUnderstandingProviderPlugin) {
          mediaUnderstandingProviders.push(provider);
        },
<<<<<<< HEAD
=======
        registerTranscriptSourceProvider(provider: TranscriptSourceProvider) {
          transcriptSourceProviders.push(provider);
        },
>>>>>>> upstream/main
        registerImageGenerationProvider(provider: ImageGenerationProviderPlugin) {
          imageGenerationProviders.push(provider);
        },
        registerVideoGenerationProvider(provider: VideoGenerationProviderPlugin) {
          videoGenerationProviders.push(provider);
        },
        registerMusicGenerationProvider(provider: MusicGenerationProviderPlugin) {
          musicGenerationProviders.push(provider);
        },
        registerWebFetchProvider(provider: WebFetchProviderPlugin) {
          webFetchProviders.push(provider);
        },
        registerWebSearchProvider(provider: WebSearchProviderPlugin) {
          webSearchProviders.push(provider);
        },
<<<<<<< HEAD
        registerMemoryEmbeddingProvider(adapter: MemoryEmbeddingProviderAdapter) {
          memoryEmbeddingProviders.push(adapter);
        },
=======
        registerMigrationProvider(provider: MigrationProviderPlugin) {
          migrationProviders.push(provider);
        },
        registerMemoryEmbeddingProvider(adapter: MemoryEmbeddingProviderAdapter) {
          memoryEmbeddingProviders.push(adapter);
        },
        registerSessionExtension(extension: PluginSessionExtensionRegistration) {
          sessionExtensions.push(extension);
        },
        registerTrustedToolPolicy(policy: PluginTrustedToolPolicyRegistration) {
          trustedToolPolicies.push(policy);
        },
        registerToolMetadata(metadata: PluginToolMetadataRegistration) {
          toolMetadata.push(metadata);
        },
        registerControlUiDescriptor(descriptor: PluginControlUiDescriptor) {
          controlUiDescriptors.push(descriptor);
        },
        registerRuntimeLifecycle(lifecycle: PluginRuntimeLifecycleRegistration) {
          runtimeLifecycles.push(lifecycle);
        },
        registerAgentEventSubscription(subscription: PluginAgentEventSubscriptionRegistration) {
          agentEventSubscriptions.push(subscription);
        },
        emitAgentEvent: () => ({ emitted: false, reason: "captured registration" }),
        registerSessionSchedulerJob(job: PluginSessionSchedulerJobRegistration) {
          sessionSchedulerJobs.push(job);
          return {
            id: job.id,
            pluginId,
            sessionKey: job.sessionKey,
            kind: job.kind,
          };
        },
        registerSessionAction(action: PluginSessionActionRegistration) {
          sessionActions.push(action);
        },
        sendSessionAttachment: async () => ({ ok: false, error: "captured registration" }),
        scheduleSessionTurn: async (schedule) => {
          capturedSessionTurnCount += 1;
          return {
            id: `captured-session-turn-${capturedSessionTurnCount}`,
            pluginId,
            sessionKey: schedule.sessionKey,
            kind: "session-turn",
          };
        },
        unscheduleSessionTurnsByTag: async () => ({ removed: 0, failed: 0 }),
>>>>>>> upstream/main
        registerTool(tool) {
          if (typeof tool !== "function") {
            tools.push(tool);
          }
        },
      },
    }),
  };
}

export function capturePluginRegistration(
  params: NonNullable<Parameters<typeof createCapturedPluginRegistration>[0]> & {
    register(api: OpenClawPluginApi): void;
  },
): CapturedPluginRegistration {
  const captured = createCapturedPluginRegistration(params);
  params.register(captured.api);
  return captured;
}
