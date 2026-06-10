// Provides the empty plugin registry used before discovery completes.
import type { PluginRegistry } from "./registry-types.js";

export function createEmptyPluginRegistry(): PluginRegistry {
  return {
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: [],
    channelSetups: [],
    providers: [],
<<<<<<< HEAD
=======
    modelCatalogProviders: [],
    cliBackends: [],
    textTransforms: [],
    embeddingProviders: [],
>>>>>>> upstream/main
    speechProviders: [],
    realtimeTranscriptionProviders: [],
    realtimeVoiceProviders: [],
    mediaUnderstandingProviders: [],
    transcriptSourceProviders: [],
    imageGenerationProviders: [],
    videoGenerationProviders: [],
    musicGenerationProviders: [],
    webFetchProviders: [],
    webSearchProviders: [],
<<<<<<< HEAD
    memoryEmbeddingProviders: [],
=======
    migrationProviders: [],
    codexAppServerExtensionFactories: [],
    agentToolResultMiddlewares: [],
    memoryEmbeddingProviders: [],
    agentHarnesses: [],
>>>>>>> upstream/main
    gatewayHandlers: {},
    gatewayMethodDescriptors: [],
    coreGatewayMethodNames: [],
    httpRoutes: [],
    hostedMediaResolvers: [],
    cliRegistrars: [],
    reloads: [],
    nodeHostCommands: [],
<<<<<<< HEAD
=======
    nodeInvokePolicies: [],
>>>>>>> upstream/main
    securityAuditCollectors: [],
    services: [],
    gatewayDiscoveryServices: [],
    commands: [],
    sessionExtensions: [],
    trustedToolPolicies: [],
    toolMetadata: [],
    controlUiDescriptors: [],
    runtimeLifecycles: [],
    agentEventSubscriptions: [],
    sessionSchedulerJobs: [],
    sessionActions: [],
    conversationBindingResolvedHandlers: [],
    diagnostics: [],
  };
}
