<<<<<<< HEAD
import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { Api, Model } from "@mariozechner/pi-ai";
import { createAnthropicMessagesTransportStreamFn } from "./anthropic-transport-stream.js";
import { createGoogleGenerativeAiTransportStreamFn } from "./google-transport-stream.js";
=======
/**
 * Transport-aware stream factory selection.
 *
 * Routes models that need OpenClaw-managed proxy/TLS/local-service semantics onto built-in transport implementations.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Api, Model } from "../llm/types.js";
import { resolveProviderStreamFn } from "../plugins/provider-runtime.js";
import { createAnthropicMessagesTransportStreamFn } from "./anthropic-transport-stream.js";
>>>>>>> upstream/main
import {
  createAzureOpenAIResponsesTransportStreamFn,
  createOpenAICompletionsTransportStreamFn,
  createOpenAIResponsesTransportStreamFn,
} from "./openai-transport-stream.js";
<<<<<<< HEAD
import { getModelProviderRequestTransport } from "./provider-request-config.js";

const SUPPORTED_TRANSPORT_APIS = new Set<Api>([
  "openai-responses",
  "openai-codex-responses",
=======
import { getModelProviderLocalService } from "./provider-local-service.js";
import { getModelProviderRequestTransport } from "./provider-request-config.js";
import type { StreamFn } from "./runtime/index.js";

const SUPPORTED_TRANSPORT_APIS = new Set<Api>([
  "openai-responses",
  "openai-chatgpt-responses",
>>>>>>> upstream/main
  "openai-completions",
  "azure-openai-responses",
  "anthropic-messages",
  "google-generative-ai",
]);

const SIMPLE_TRANSPORT_API_ALIAS: Record<string, Api> = {
  "openai-responses": "openclaw-openai-responses-transport",
<<<<<<< HEAD
  "openai-codex-responses": "openclaw-openai-responses-transport",
=======
  "openai-chatgpt-responses": "openclaw-openai-responses-transport",
>>>>>>> upstream/main
  "openai-completions": "openclaw-openai-completions-transport",
  "azure-openai-responses": "openclaw-azure-openai-responses-transport",
  "anthropic-messages": "openclaw-anthropic-messages-transport",
  "google-generative-ai": "openclaw-google-generative-ai-transport",
};

<<<<<<< HEAD
function createSupportedTransportStreamFn(api: Api): StreamFn | undefined {
  switch (api) {
    case "openai-responses":
    case "openai-codex-responses":
=======
type ProviderTransportStreamContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
};

function createProviderOwnedGoogleTransportStreamFn(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  return (
    resolveProviderStreamFn({
      provider: model.provider,
      config: ctx?.cfg,
      workspaceDir: ctx?.workspaceDir,
      env: ctx?.env,
      context: {
        config: ctx?.cfg,
        agentDir: ctx?.agentDir,
        workspaceDir: ctx?.workspaceDir,
        provider: model.provider,
        modelId: model.id,
        model,
      },
    }) ??
    resolveProviderStreamFn({
      provider: "google",
      config: ctx?.cfg,
      workspaceDir: ctx?.workspaceDir,
      env: ctx?.env,
      context: {
        config: ctx?.cfg,
        agentDir: ctx?.agentDir,
        workspaceDir: ctx?.workspaceDir,
        provider: model.provider,
        modelId: model.id,
        model,
      },
    }) ??
    undefined
  );
}

function createSupportedTransportStreamFn(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  switch (model.api) {
    case "openai-responses":
    case "openai-chatgpt-responses":
>>>>>>> upstream/main
      return createOpenAIResponsesTransportStreamFn();
    case "openai-completions":
      return createOpenAICompletionsTransportStreamFn();
    case "azure-openai-responses":
      return createAzureOpenAIResponsesTransportStreamFn();
    case "anthropic-messages":
      return createAnthropicMessagesTransportStreamFn();
    case "google-generative-ai":
<<<<<<< HEAD
      return createGoogleGenerativeAiTransportStreamFn();
=======
      return createProviderOwnedGoogleTransportStreamFn(model, ctx);
>>>>>>> upstream/main
    default:
      return undefined;
  }
}

<<<<<<< HEAD
function hasTransportOverrides(model: Model<Api>): boolean {
  const request = getModelProviderRequestTransport(model);
  return Boolean(request?.proxy || request?.tls);
}

=======
function hasOpenClawTransportRequirement(model: Model): boolean {
  const request = getModelProviderRequestTransport(model);
  return Boolean(request?.proxy || request?.tls || getModelProviderLocalService(model));
}

/** Returns whether OpenClaw has a managed transport implementation for this API. */
>>>>>>> upstream/main
export function isTransportAwareApiSupported(api: Api): boolean {
  return SUPPORTED_TRANSPORT_APIS.has(api);
}

<<<<<<< HEAD
=======
/** Maps public model APIs to the internal transport API id used by simple runtime dispatch. */
>>>>>>> upstream/main
export function resolveTransportAwareSimpleApi(api: Api): Api | undefined {
  return SIMPLE_TRANSPORT_API_ALIAS[api];
}

<<<<<<< HEAD
export function createTransportAwareStreamFnForModel(model: Model<Api>): StreamFn | undefined {
  if (!hasTransportOverrides(model)) {
=======
/** Creates a managed transport stream only when request overrides require it. */
export function createTransportAwareStreamFnForModel(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  if (!hasOpenClawTransportRequirement(model)) {
>>>>>>> upstream/main
    return undefined;
  }
  if (!isTransportAwareApiSupported(model.api)) {
    throw new Error(
<<<<<<< HEAD
      `Model-provider request.proxy/request.tls is not yet supported for api "${model.api}"`,
    );
  }
  return createSupportedTransportStreamFn(model.api);
}

export function createBoundaryAwareStreamFnForModel(model: Model<Api>): StreamFn | undefined {
  if (!isTransportAwareApiSupported(model.api)) {
    return undefined;
  }
  return createSupportedTransportStreamFn(model.api);
}

export function prepareTransportAwareSimpleModel<TApi extends Api>(model: Model<TApi>): Model<Api> {
  const streamFn = createTransportAwareStreamFnForModel(model as Model<Api>);
=======
      `Model-provider request.proxy/request.tls/localService is not yet supported for api "${model.api}"`,
    );
  }
  return createSupportedTransportStreamFn(model, ctx);
}

/** Creates a managed OpenClaw transport stream for explicit fallback/runtime callers. */
export function createOpenClawTransportStreamFnForModel(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  // Explicit fallback callers use this when they need OpenClaw's HTTP
  // transport semantics regardless of the default embedded-runner strategy.
  // Native OpenAI HTTP still depends on this path for strict tool shaping,
  // attribution, cache-boundary stripping, and runtime credential injection.
  if (!isTransportAwareApiSupported(model.api)) {
    return undefined;
  }
  return createSupportedTransportStreamFn(model, ctx);
}

export function createBoundaryAwareStreamFnForModel(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  // Default embedded-runner fallback. Keep OpenAI-family APIs here while native
  // HTTP streams preserve the same OpenClaw request contract.
  if (!isTransportAwareApiSupported(model.api)) {
    return undefined;
  }
  return createSupportedTransportStreamFn(model, ctx);
}

export function prepareTransportAwareSimpleModel<TApi extends Api>(
  model: Model<TApi>,
  ctx?: ProviderTransportStreamContext,
): Model {
  const streamFn = createTransportAwareStreamFnForModel(model as Model, ctx);
>>>>>>> upstream/main
  const alias = resolveTransportAwareSimpleApi(model.api);
  if (!streamFn || !alias) {
    return model;
  }
  return {
    ...model,
    api: alias,
  };
}

<<<<<<< HEAD
export function buildTransportAwareSimpleStreamFn(model: Model<Api>): StreamFn | undefined {
  return createTransportAwareStreamFnForModel(model);
=======
export function buildTransportAwareSimpleStreamFn(
  model: Model,
  ctx?: ProviderTransportStreamContext,
): StreamFn | undefined {
  return createTransportAwareStreamFnForModel(model, ctx);
>>>>>>> upstream/main
}
