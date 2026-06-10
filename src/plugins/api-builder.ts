<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
=======
// Builds plugin API objects from config, registries, and runtime helpers.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { attachPluginApiFacades, type OpenClawPluginApiWithoutFacades } from "./api-facades.js";
>>>>>>> upstream/main
import type { PluginRuntime } from "./runtime/types.js";
import type { OpenClawPluginApi, PluginLogger } from "./types.js";

export type BuildPluginApiParams = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  rootDir?: string;
  registrationMode: OpenClawPluginApi["registrationMode"];
  config: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  runtime: PluginRuntime;
  logger: PluginLogger;
  resolvePath: (input: string) => string;
  handlers?: Partial<
    Pick<
      OpenClawPluginApi,
      | "registerTool"
      | "registerHook"
      | "registerHttpRoute"
<<<<<<< HEAD
=======
      | "registerHostedMediaResolver"
>>>>>>> upstream/main
      | "registerChannel"
      | "registerGatewayMethod"
      | "registerCli"
      | "registerReload"
      | "registerNodeHostCommand"
<<<<<<< HEAD
      | "registerSecurityAuditCollector"
      | "registerService"
      | "registerConfigMigration"
      | "registerAutoEnableProbe"
      | "registerProvider"
=======
      | "registerNodeInvokePolicy"
      | "registerSecurityAuditCollector"
      | "registerService"
      | "registerGatewayDiscoveryService"
      | "registerCliBackend"
      | "registerTextTransforms"
      | "registerConfigMigration"
      | "registerMigrationProvider"
      | "registerAutoEnableProbe"
      | "registerProvider"
      | "registerModelCatalogProvider"
      | "registerEmbeddingProvider"
>>>>>>> upstream/main
      | "registerSpeechProvider"
      | "registerRealtimeTranscriptionProvider"
      | "registerRealtimeVoiceProvider"
      | "registerMediaUnderstandingProvider"
<<<<<<< HEAD
=======
      | "registerTranscriptSourceProvider"
>>>>>>> upstream/main
      | "registerImageGenerationProvider"
      | "registerVideoGenerationProvider"
      | "registerMusicGenerationProvider"
      | "registerWebFetchProvider"
      | "registerWebSearchProvider"
      | "registerInteractiveHandler"
      | "onConversationBindingResolved"
      | "registerCommand"
      | "registerContextEngine"
<<<<<<< HEAD
=======
      | "registerCompactionProvider"
      | "registerAgentHarness"
      | "registerCodexAppServerExtensionFactory"
      | "registerAgentToolResultMiddleware"
      | "registerSessionExtension"
      | "enqueueNextTurnInjection"
      | "registerTrustedToolPolicy"
      | "registerToolMetadata"
      | "registerControlUiDescriptor"
      | "registerRuntimeLifecycle"
      | "registerAgentEventSubscription"
      | "emitAgentEvent"
      | "setRunContext"
      | "getRunContext"
      | "clearRunContext"
      | "registerSessionSchedulerJob"
      | "registerSessionAction"
      | "sendSessionAttachment"
      | "scheduleSessionTurn"
      | "unscheduleSessionTurnsByTag"
      | "registerDetachedTaskRuntime"
      | "registerMemoryCapability"
>>>>>>> upstream/main
      | "registerMemoryPromptSection"
      | "registerMemoryPromptSupplement"
      | "registerMemoryCorpusSupplement"
      | "registerMemoryFlushPlan"
      | "registerMemoryRuntime"
      | "registerMemoryEmbeddingProvider"
      | "on"
    >
  >;
};

const noopRegisterTool: OpenClawPluginApi["registerTool"] = () => {};
const noopRegisterHook: OpenClawPluginApi["registerHook"] = () => {};
const noopRegisterHttpRoute: OpenClawPluginApi["registerHttpRoute"] = () => {};
<<<<<<< HEAD
=======
const noopRegisterHostedMediaResolver: OpenClawPluginApi["registerHostedMediaResolver"] = () => {};
>>>>>>> upstream/main
const noopRegisterChannel: OpenClawPluginApi["registerChannel"] = () => {};
const noopRegisterGatewayMethod: OpenClawPluginApi["registerGatewayMethod"] = () => {};
const noopRegisterCli: OpenClawPluginApi["registerCli"] = () => {};
const noopRegisterReload: OpenClawPluginApi["registerReload"] = () => {};
const noopRegisterNodeHostCommand: OpenClawPluginApi["registerNodeHostCommand"] = () => {};
<<<<<<< HEAD
const noopRegisterSecurityAuditCollector: OpenClawPluginApi["registerSecurityAuditCollector"] =
  () => {};
const noopRegisterService: OpenClawPluginApi["registerService"] = () => {};
const noopRegisterConfigMigration: OpenClawPluginApi["registerConfigMigration"] = () => {};
const noopRegisterAutoEnableProbe: OpenClawPluginApi["registerAutoEnableProbe"] = () => {};
const noopRegisterProvider: OpenClawPluginApi["registerProvider"] = () => {};
=======
const noopRegisterNodeInvokePolicy: OpenClawPluginApi["registerNodeInvokePolicy"] = () => {};
const noopRegisterSecurityAuditCollector: OpenClawPluginApi["registerSecurityAuditCollector"] =
  () => {};
const noopRegisterService: OpenClawPluginApi["registerService"] = () => {};
const noopRegisterGatewayDiscoveryService: OpenClawPluginApi["registerGatewayDiscoveryService"] =
  () => {};
const noopRegisterCliBackend: OpenClawPluginApi["registerCliBackend"] = () => {};
const noopRegisterTextTransforms: OpenClawPluginApi["registerTextTransforms"] = () => {};
const noopRegisterConfigMigration: OpenClawPluginApi["registerConfigMigration"] = () => {};
const noopRegisterMigrationProvider: OpenClawPluginApi["registerMigrationProvider"] = () => {};
const noopRegisterAutoEnableProbe: OpenClawPluginApi["registerAutoEnableProbe"] = () => {};
const noopRegisterProvider: OpenClawPluginApi["registerProvider"] = () => {};
const noopRegisterModelCatalogProvider: OpenClawPluginApi["registerModelCatalogProvider"] =
  () => {};
const noopRegisterEmbeddingProvider: OpenClawPluginApi["registerEmbeddingProvider"] = () => {};
>>>>>>> upstream/main
const noopRegisterSpeechProvider: OpenClawPluginApi["registerSpeechProvider"] = () => {};
const noopRegisterRealtimeTranscriptionProvider: OpenClawPluginApi["registerRealtimeTranscriptionProvider"] =
  () => {};
const noopRegisterRealtimeVoiceProvider: OpenClawPluginApi["registerRealtimeVoiceProvider"] =
  () => {};
const noopRegisterMediaUnderstandingProvider: OpenClawPluginApi["registerMediaUnderstandingProvider"] =
  () => {};
<<<<<<< HEAD
=======
const noopRegisterTranscriptsSourceProvider: OpenClawPluginApi["registerTranscriptSourceProvider"] =
  () => {};
>>>>>>> upstream/main
const noopRegisterImageGenerationProvider: OpenClawPluginApi["registerImageGenerationProvider"] =
  () => {};
const noopRegisterVideoGenerationProvider: OpenClawPluginApi["registerVideoGenerationProvider"] =
  () => {};
const noopRegisterMusicGenerationProvider: OpenClawPluginApi["registerMusicGenerationProvider"] =
  () => {};
const noopRegisterWebFetchProvider: OpenClawPluginApi["registerWebFetchProvider"] = () => {};
const noopRegisterWebSearchProvider: OpenClawPluginApi["registerWebSearchProvider"] = () => {};
const noopRegisterInteractiveHandler: OpenClawPluginApi["registerInteractiveHandler"] = () => {};
const noopOnConversationBindingResolved: OpenClawPluginApi["onConversationBindingResolved"] =
  () => {};
const noopRegisterCommand: OpenClawPluginApi["registerCommand"] = () => {};
const noopRegisterContextEngine: OpenClawPluginApi["registerContextEngine"] = () => {};
<<<<<<< HEAD
=======
const noopRegisterCompactionProvider: OpenClawPluginApi["registerCompactionProvider"] = () => {};
const noopRegisterAgentHarness: OpenClawPluginApi["registerAgentHarness"] = () => {};
const noopRegisterCodexAppServerExtensionFactory: OpenClawPluginApi["registerCodexAppServerExtensionFactory"] =
  () => {};
const noopRegisterAgentToolResultMiddleware: OpenClawPluginApi["registerAgentToolResultMiddleware"] =
  () => {};
const noopRegisterSessionExtension: OpenClawPluginApi["registerSessionExtension"] = () => {};
const noopEnqueueNextTurnInjection: OpenClawPluginApi["enqueueNextTurnInjection"] = async (
  injection,
) => ({ enqueued: false, id: "", sessionKey: injection.sessionKey });
const noopRegisterTrustedToolPolicy: OpenClawPluginApi["registerTrustedToolPolicy"] = () => {};
const noopRegisterToolMetadata: OpenClawPluginApi["registerToolMetadata"] = () => {};
const noopRegisterControlUiDescriptor: OpenClawPluginApi["registerControlUiDescriptor"] = () => {};
const noopRegisterRuntimeLifecycle: OpenClawPluginApi["registerRuntimeLifecycle"] = () => {};
const noopRegisterAgentEventSubscription: OpenClawPluginApi["registerAgentEventSubscription"] =
  () => {};
const noopEmitAgentEvent: OpenClawPluginApi["emitAgentEvent"] = () => ({
  emitted: false,
  reason: "not wired",
});
const noopSetRunContext: OpenClawPluginApi["setRunContext"] = () => false;
const noopGetRunContext: OpenClawPluginApi["getRunContext"] = () => undefined;
const noopClearRunContext: OpenClawPluginApi["clearRunContext"] = () => {};
const noopRegisterSessionSchedulerJob: OpenClawPluginApi["registerSessionSchedulerJob"] = () =>
  undefined;
const noopRegisterSessionAction: OpenClawPluginApi["registerSessionAction"] = () => {};
const noopSendSessionAttachment: OpenClawPluginApi["sendSessionAttachment"] = async () => ({
  ok: false,
  error: "not wired",
});
const noopScheduleSessionTurn: OpenClawPluginApi["scheduleSessionTurn"] = async () => undefined;
const noopUnscheduleSessionTurnsByTag: OpenClawPluginApi["unscheduleSessionTurnsByTag"] =
  async () => ({ removed: 0, failed: 0 });
const noopRegisterDetachedTaskRuntime: OpenClawPluginApi["registerDetachedTaskRuntime"] = () => {};
const noopRegisterMemoryCapability: OpenClawPluginApi["registerMemoryCapability"] = () => {};
>>>>>>> upstream/main
const noopRegisterMemoryPromptSection: OpenClawPluginApi["registerMemoryPromptSection"] = () => {};
const noopRegisterMemoryPromptSupplement: OpenClawPluginApi["registerMemoryPromptSupplement"] =
  () => {};
const noopRegisterMemoryCorpusSupplement: OpenClawPluginApi["registerMemoryCorpusSupplement"] =
  () => {};
const noopRegisterMemoryFlushPlan: OpenClawPluginApi["registerMemoryFlushPlan"] = () => {};
const noopRegisterMemoryRuntime: OpenClawPluginApi["registerMemoryRuntime"] = () => {};
const noopRegisterMemoryEmbeddingProvider: OpenClawPluginApi["registerMemoryEmbeddingProvider"] =
  () => {};
const noopOn: OpenClawPluginApi["on"] = () => {};

export function buildPluginApi(params: BuildPluginApiParams): OpenClawPluginApi {
  const handlers = params.handlers ?? {};
<<<<<<< HEAD
  return {
=======
  const registerCli = handlers.registerCli ?? noopRegisterCli;
  const api: OpenClawPluginApiWithoutFacades = {
>>>>>>> upstream/main
    id: params.id,
    name: params.name,
    version: params.version,
    description: params.description,
    source: params.source,
    rootDir: params.rootDir,
    registrationMode: params.registrationMode,
    config: params.config,
    pluginConfig: params.pluginConfig,
    runtime: params.runtime,
    logger: params.logger,
    registerTool: handlers.registerTool ?? noopRegisterTool,
    registerHook: handlers.registerHook ?? noopRegisterHook,
    registerHttpRoute: handlers.registerHttpRoute ?? noopRegisterHttpRoute,
<<<<<<< HEAD
    registerChannel: handlers.registerChannel ?? noopRegisterChannel,
    registerGatewayMethod: handlers.registerGatewayMethod ?? noopRegisterGatewayMethod,
    registerCli: handlers.registerCli ?? noopRegisterCli,
    registerReload: handlers.registerReload ?? noopRegisterReload,
    registerNodeHostCommand: handlers.registerNodeHostCommand ?? noopRegisterNodeHostCommand,
    registerSecurityAuditCollector:
      handlers.registerSecurityAuditCollector ?? noopRegisterSecurityAuditCollector,
    registerService: handlers.registerService ?? noopRegisterService,
    registerConfigMigration: handlers.registerConfigMigration ?? noopRegisterConfigMigration,
    registerAutoEnableProbe: handlers.registerAutoEnableProbe ?? noopRegisterAutoEnableProbe,
    registerProvider: handlers.registerProvider ?? noopRegisterProvider,
=======
    registerHostedMediaResolver:
      handlers.registerHostedMediaResolver ?? noopRegisterHostedMediaResolver,
    registerChannel: handlers.registerChannel ?? noopRegisterChannel,
    registerGatewayMethod: handlers.registerGatewayMethod ?? noopRegisterGatewayMethod,
    registerCli,
    registerNodeCliFeature: (registrar, opts) =>
      registerCli(registrar, {
        ...opts,
        parentPath: ["nodes"],
      }),
    registerReload: handlers.registerReload ?? noopRegisterReload,
    registerNodeHostCommand: handlers.registerNodeHostCommand ?? noopRegisterNodeHostCommand,
    registerNodeInvokePolicy: handlers.registerNodeInvokePolicy ?? noopRegisterNodeInvokePolicy,
    registerSecurityAuditCollector:
      handlers.registerSecurityAuditCollector ?? noopRegisterSecurityAuditCollector,
    registerService: handlers.registerService ?? noopRegisterService,
    registerGatewayDiscoveryService:
      handlers.registerGatewayDiscoveryService ?? noopRegisterGatewayDiscoveryService,
    registerCliBackend: handlers.registerCliBackend ?? noopRegisterCliBackend,
    registerTextTransforms: handlers.registerTextTransforms ?? noopRegisterTextTransforms,
    registerConfigMigration: handlers.registerConfigMigration ?? noopRegisterConfigMigration,
    registerMigrationProvider: handlers.registerMigrationProvider ?? noopRegisterMigrationProvider,
    registerAutoEnableProbe: handlers.registerAutoEnableProbe ?? noopRegisterAutoEnableProbe,
    registerProvider: handlers.registerProvider ?? noopRegisterProvider,
    registerModelCatalogProvider:
      handlers.registerModelCatalogProvider ?? noopRegisterModelCatalogProvider,
    registerEmbeddingProvider: handlers.registerEmbeddingProvider ?? noopRegisterEmbeddingProvider,
>>>>>>> upstream/main
    registerSpeechProvider: handlers.registerSpeechProvider ?? noopRegisterSpeechProvider,
    registerRealtimeTranscriptionProvider:
      handlers.registerRealtimeTranscriptionProvider ?? noopRegisterRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider:
      handlers.registerRealtimeVoiceProvider ?? noopRegisterRealtimeVoiceProvider,
    registerMediaUnderstandingProvider:
      handlers.registerMediaUnderstandingProvider ?? noopRegisterMediaUnderstandingProvider,
<<<<<<< HEAD
=======
    registerTranscriptSourceProvider:
      handlers.registerTranscriptSourceProvider ?? noopRegisterTranscriptsSourceProvider,
>>>>>>> upstream/main
    registerImageGenerationProvider:
      handlers.registerImageGenerationProvider ?? noopRegisterImageGenerationProvider,
    registerVideoGenerationProvider:
      handlers.registerVideoGenerationProvider ?? noopRegisterVideoGenerationProvider,
    registerMusicGenerationProvider:
      handlers.registerMusicGenerationProvider ?? noopRegisterMusicGenerationProvider,
    registerWebFetchProvider: handlers.registerWebFetchProvider ?? noopRegisterWebFetchProvider,
    registerWebSearchProvider: handlers.registerWebSearchProvider ?? noopRegisterWebSearchProvider,
    registerInteractiveHandler:
      handlers.registerInteractiveHandler ?? noopRegisterInteractiveHandler,
    onConversationBindingResolved:
      handlers.onConversationBindingResolved ?? noopOnConversationBindingResolved,
    registerCommand: handlers.registerCommand ?? noopRegisterCommand,
    registerContextEngine: handlers.registerContextEngine ?? noopRegisterContextEngine,
<<<<<<< HEAD
=======
    registerCompactionProvider:
      handlers.registerCompactionProvider ?? noopRegisterCompactionProvider,
    registerAgentHarness: handlers.registerAgentHarness ?? noopRegisterAgentHarness,
    registerCodexAppServerExtensionFactory:
      handlers.registerCodexAppServerExtensionFactory ?? noopRegisterCodexAppServerExtensionFactory,
    registerAgentToolResultMiddleware:
      handlers.registerAgentToolResultMiddleware ?? noopRegisterAgentToolResultMiddleware,
    registerSessionExtension: handlers.registerSessionExtension ?? noopRegisterSessionExtension,
    enqueueNextTurnInjection: handlers.enqueueNextTurnInjection ?? noopEnqueueNextTurnInjection,
    registerTrustedToolPolicy: handlers.registerTrustedToolPolicy ?? noopRegisterTrustedToolPolicy,
    registerToolMetadata: handlers.registerToolMetadata ?? noopRegisterToolMetadata,
    registerControlUiDescriptor:
      handlers.registerControlUiDescriptor ?? noopRegisterControlUiDescriptor,
    registerRuntimeLifecycle: handlers.registerRuntimeLifecycle ?? noopRegisterRuntimeLifecycle,
    registerAgentEventSubscription:
      handlers.registerAgentEventSubscription ?? noopRegisterAgentEventSubscription,
    emitAgentEvent: handlers.emitAgentEvent ?? noopEmitAgentEvent,
    setRunContext: handlers.setRunContext ?? noopSetRunContext,
    getRunContext: handlers.getRunContext ?? noopGetRunContext,
    clearRunContext: handlers.clearRunContext ?? noopClearRunContext,
    registerSessionSchedulerJob:
      handlers.registerSessionSchedulerJob ?? noopRegisterSessionSchedulerJob,
    registerSessionAction: handlers.registerSessionAction ?? noopRegisterSessionAction,
    sendSessionAttachment: handlers.sendSessionAttachment ?? noopSendSessionAttachment,
    scheduleSessionTurn: handlers.scheduleSessionTurn ?? noopScheduleSessionTurn,
    unscheduleSessionTurnsByTag:
      handlers.unscheduleSessionTurnsByTag ?? noopUnscheduleSessionTurnsByTag,
    registerDetachedTaskRuntime:
      handlers.registerDetachedTaskRuntime ?? noopRegisterDetachedTaskRuntime,
    registerMemoryCapability: handlers.registerMemoryCapability ?? noopRegisterMemoryCapability,
>>>>>>> upstream/main
    registerMemoryPromptSection:
      handlers.registerMemoryPromptSection ?? noopRegisterMemoryPromptSection,
    registerMemoryPromptSupplement:
      handlers.registerMemoryPromptSupplement ?? noopRegisterMemoryPromptSupplement,
    registerMemoryCorpusSupplement:
      handlers.registerMemoryCorpusSupplement ?? noopRegisterMemoryCorpusSupplement,
    registerMemoryFlushPlan: handlers.registerMemoryFlushPlan ?? noopRegisterMemoryFlushPlan,
    registerMemoryRuntime: handlers.registerMemoryRuntime ?? noopRegisterMemoryRuntime,
    registerMemoryEmbeddingProvider:
      handlers.registerMemoryEmbeddingProvider ?? noopRegisterMemoryEmbeddingProvider,
    resolvePath: params.resolvePath,
    on: handlers.on ?? noopOn,
  };
<<<<<<< HEAD
=======
  return attachPluginApiFacades(api);
>>>>>>> upstream/main
}
