<<<<<<< HEAD
=======
// Plugin registry test helpers provide a process-wide stub registry with default
// channel and speech providers for gateway suites.
>>>>>>> upstream/main
import type { PluginRegistry } from "../plugins/registry.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";
import { createDefaultGatewayTestChannels } from "./test-helpers.channels.js";
import { createDefaultGatewayTestSpeechProviders } from "./test-helpers.speech.js";

<<<<<<< HEAD
=======
/**
 * Process-wide plugin registry fixture for gateway tests.
 */
>>>>>>> upstream/main
function createStubPluginRegistry(): PluginRegistry {
  return {
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: createDefaultGatewayTestChannels(),
    channelSetups: [],
    providers: [],
<<<<<<< HEAD
=======
    modelCatalogProviders: [],
    embeddingProviders: [],
>>>>>>> upstream/main
    speechProviders: createDefaultGatewayTestSpeechProviders(),
    realtimeTranscriptionProviders: [],
    realtimeVoiceProviders: [],
    mediaUnderstandingProviders: [],
<<<<<<< HEAD
=======
    transcriptSourceProviders: [],
>>>>>>> upstream/main
    imageGenerationProviders: [],
    videoGenerationProviders: [],
    musicGenerationProviders: [],
    webFetchProviders: [],
    webSearchProviders: [],
<<<<<<< HEAD
    memoryEmbeddingProviders: [],
    gatewayHandlers: {},
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    commands: [],
=======
    migrationProviders: [],
    codexAppServerExtensionFactories: [],
    agentToolResultMiddlewares: [],
    memoryEmbeddingProviders: [],
    textTransforms: [],
    agentHarnesses: [],
    gatewayHandlers: {},
    gatewayMethodDescriptors: [],
    httpRoutes: [],
    cliRegistrars: [],
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
>>>>>>> upstream/main
    conversationBindingResolvedHandlers: [],
    diagnostics: [],
  };
}

const GATEWAY_TEST_PLUGIN_REGISTRY_STATE_KEY = Symbol.for(
  "openclaw.gatewayTestHelpers.pluginRegistryState",
);

const pluginRegistryState = resolveGlobalSingleton(GATEWAY_TEST_PLUGIN_REGISTRY_STATE_KEY, () => ({
  registry: createStubPluginRegistry(),
}));

setActivePluginRegistry(pluginRegistryState.registry);

<<<<<<< HEAD
=======
/** Installs a plugin registry fixture as the active runtime registry. */
>>>>>>> upstream/main
export function setTestPluginRegistry(registry: PluginRegistry): void {
  pluginRegistryState.registry = registry;
  setActivePluginRegistry(registry);
}

<<<<<<< HEAD
=======
/** Restores the default empty gateway test plugin registry. */
>>>>>>> upstream/main
export function resetTestPluginRegistry(): void {
  pluginRegistryState.registry = createStubPluginRegistry();
  setActivePluginRegistry(pluginRegistryState.registry);
}

<<<<<<< HEAD
=======
/** Returns the currently active gateway test plugin registry. */
>>>>>>> upstream/main
export function getTestPluginRegistry(): PluginRegistry {
  return pluginRegistryState.registry;
}
