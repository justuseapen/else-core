<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
import type { StreamFn } from "@mariozechner/pi-agent-core";
import { streamSimple } from "@mariozechner/pi-ai";
import { createAnthropicVertexStreamFnForModel } from "../anthropic-vertex-stream.js";
import { createOpenAIWebSocketStreamFn } from "../openai-ws-stream.js";
import { createBoundaryAwareStreamFnForModel } from "../provider-transport-stream.js";
=======
/**
 * Resolves provider stream functions and API keys for embedded agents.
 */
import { getApiProvider } from "../../llm/api-registry.js";
import { streamSimple } from "../../llm/stream.js";
import { createAnthropicVertexStreamFnForModel } from "../anthropic-vertex-stream.js";
import { createBoundaryAwareStreamFnForModel } from "../provider-transport-stream.js";
import type { StreamFn } from "../runtime/index.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
import { stripSystemPromptCacheBoundary } from "../system-prompt-cache-boundary.js";
import type { EmbeddedRunAttemptParams } from "./run/types.js";

let embeddedAgentBaseStreamFnCache = new WeakMap<object, StreamFn | undefined>();
<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
=======
let openClawNativeCodexResponsesStreamFnForTest: StreamFn | undefined;

type EmbeddedStreamOptions = Parameters<StreamFn>[2] & {
  authProfileId?: string;
  promptCacheKey?: string;
};
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts

export function resolveEmbeddedAgentBaseStreamFn(params: {
  session: { agent: { streamFn?: StreamFn } };
}): StreamFn | undefined {
  const cached = embeddedAgentBaseStreamFnCache.get(params.session);
  if (cached !== undefined || embeddedAgentBaseStreamFnCache.has(params.session)) {
    return cached;
  }
  const baseStreamFn = params.session.agent.streamFn;
  embeddedAgentBaseStreamFnCache.set(params.session, baseStreamFn);
  return baseStreamFn;
}

export function resetEmbeddedAgentBaseStreamFnCacheForTest(): void {
  embeddedAgentBaseStreamFnCache = new WeakMap<object, StreamFn | undefined>();
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
export function describeEmbeddedAgentStreamStrategy(params: {
  currentStreamFn: StreamFn | undefined;
  providerStreamFn?: StreamFn;
  shouldUseWebSocketTransport: boolean;
  wsApiKey?: string;
  model: EmbeddedRunAttemptParams["model"];
=======
function isDefaultOpenClawStreamFnForModel(
  model: EmbeddedRunAttemptParams["model"],
  streamFn: StreamFn | undefined,
): boolean {
  if (!streamFn || streamFn === streamSimple) {
    return true;
  }
  const api = typeof model.api === "string" ? model.api.trim() : "";
  if (!api) {
    return false;
  }
  const provider = getApiProvider(api as never);
  return streamFn === provider?.streamSimple || streamFn === provider?.stream;
}

function hasResolvedRuntimeApiKey(apiKey: string | undefined): boolean {
  return typeof apiKey === "string" && apiKey.trim().length > 0;
}

function isOpenAICodexResponsesModel(model: EmbeddedRunAttemptParams["model"]): boolean {
  return model.provider === "openai" && model.api === "openai-chatgpt-responses";
}

function resolveOpenClawNativeCodexResponsesStreamFn(params: {
  model: EmbeddedRunAttemptParams["model"];
  currentStreamFn: StreamFn | undefined;
}): StreamFn | undefined {
  if (!isOpenAICodexResponsesModel(params.model)) {
    return undefined;
  }
  if (!isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn)) {
    return undefined;
  }
  return openClawNativeCodexResponsesStreamFnForTest ?? params.currentStreamFn ?? streamSimple;
}

export function describeEmbeddedAgentStreamStrategy(params: {
  currentStreamFn: StreamFn | undefined;
  providerStreamFn?: StreamFn;
  model: EmbeddedRunAttemptParams["model"];
  resolvedApiKey?: string;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
}): string {
  if (params.providerStreamFn) {
    return "provider";
  }
<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
  if (params.shouldUseWebSocketTransport) {
    return params.wsApiKey ? "openai-websocket" : "session-http-fallback";
  }
  if (params.model.provider === "anthropic-vertex") {
    return "anthropic-vertex";
  }
  if (params.currentStreamFn === undefined || params.currentStreamFn === streamSimple) {
=======
  if (params.model.provider === "anthropic-vertex") {
    return "anthropic-vertex";
  }
  if (
    resolveOpenClawNativeCodexResponsesStreamFn({
      model: params.model,
      currentStreamFn: params.currentStreamFn,
    })
  ) {
    return "openclaw-native-codex-responses";
  }
  if (isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn)) {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
    return createBoundaryAwareStreamFnForModel(params.model)
      ? `boundary-aware:${params.model.api}`
      : "stream-simple";
  }
<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
=======
  if (
    hasResolvedRuntimeApiKey(params.resolvedApiKey) &&
    createBoundaryAwareStreamFnForModel(params.model)
  ) {
    return `boundary-aware:${params.model.api}`;
  }
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
  return "session-custom";
}

export async function resolveEmbeddedAgentApiKey(params: {
  provider: string;
  resolvedApiKey?: string;
  authStorage?: { getApiKey(provider: string): Promise<string | undefined> };
}): Promise<string | undefined> {
  const resolvedApiKey = params.resolvedApiKey?.trim();
  if (resolvedApiKey) {
    return resolvedApiKey;
  }
  return params.authStorage ? await params.authStorage.getApiKey(params.provider) : undefined;
}

export function resolveEmbeddedAgentStreamFn(params: {
  currentStreamFn: StreamFn | undefined;
  providerStreamFn?: StreamFn;
<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
  shouldUseWebSocketTransport: boolean;
  wsApiKey?: string;
  sessionId: string;
  signal?: AbortSignal;
  model: EmbeddedRunAttemptParams["model"];
  resolvedApiKey?: string;
  authStorage?: { getApiKey(provider: string): Promise<string | undefined> };
}): StreamFn {
  if (params.providerStreamFn) {
    const inner = params.providerStreamFn;
    const normalizeContext = (context: Parameters<StreamFn>[1]) =>
      context.systemPrompt
        ? {
            ...context,
            systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
          }
        : context;
    // Provider-owned transports bypass pi-coding-agent's default auth lookup,
    // so keep injecting the resolved runtime apiKey for streamSimple-compatible
    // transports that still read credentials from options.apiKey.
    if (params.authStorage || params.resolvedApiKey) {
      const { authStorage, model, resolvedApiKey } = params;
      return async (m, context, options) => {
        const apiKey = await resolveEmbeddedAgentApiKey({
          provider: model.provider,
          resolvedApiKey,
          authStorage,
        });
        return inner(m, normalizeContext(context), {
          ...options,
          apiKey: apiKey ?? options?.apiKey,
        });
      };
    }
    return (m, context, options) => inner(m, normalizeContext(context), options);
  }

  const currentStreamFn = params.currentStreamFn ?? streamSimple;
  if (params.shouldUseWebSocketTransport) {
    return params.wsApiKey
      ? createOpenAIWebSocketStreamFn(params.wsApiKey, params.sessionId, {
          signal: params.signal,
        })
      : currentStreamFn;
  }

=======
  sessionId: string;
  promptCacheKey?: string;
  signal?: AbortSignal;
  model: EmbeddedRunAttemptParams["model"];
  resolvedApiKey?: string;
  authProfileId?: string;
  authStorage?: { getApiKey(provider: string): Promise<string | undefined> };
}): StreamFn {
  if (params.providerStreamFn) {
    return wrapEmbeddedAgentStreamFn(params.providerStreamFn, {
      runSignal: params.signal,
      resolvedApiKey: params.resolvedApiKey,
      authProfileId: params.authProfileId,
      authStorage: params.authStorage,
      providerId: params.model.provider,
      promptCacheKey: params.promptCacheKey,
      transformContext: (context) =>
        context.systemPrompt
          ? {
              ...context,
              systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
            }
          : context,
    });
  }

  const currentStreamFn = params.currentStreamFn ?? streamSimple;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
  if (params.model.provider === "anthropic-vertex") {
    return createAnthropicVertexStreamFnForModel(params.model);
  }

<<<<<<< HEAD:src/agents/pi-embedded-runner/stream-resolution.ts
  if (params.currentStreamFn === undefined || params.currentStreamFn === streamSimple) {
    const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
    if (boundaryAwareStreamFn) {
      return boundaryAwareStreamFn;
    }
  }

  return currentStreamFn;
}
=======
  const openClawNativeCodexResponsesStreamFn = resolveOpenClawNativeCodexResponsesStreamFn({
    model: params.model,
    currentStreamFn: params.currentStreamFn,
  });
  if (openClawNativeCodexResponsesStreamFn) {
    return wrapEmbeddedAgentStreamFn(openClawNativeCodexResponsesStreamFn, {
      runSignal: params.signal,
      resolvedApiKey: params.resolvedApiKey,
      authProfileId: params.authProfileId,
      authStorage: params.authStorage,
      providerId: params.model.provider,
      sessionId: params.sessionId,
      promptCacheKey: params.promptCacheKey,
      transformContext: (context) =>
        context.systemPrompt
          ? {
              ...context,
              systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
            }
          : context,
    });
  }

  if (
    isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn) ||
    hasResolvedRuntimeApiKey(params.resolvedApiKey)
  ) {
    const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
    if (boundaryAwareStreamFn) {
      // Some OpenClaw session factories return a provider-specific stream wrapper
      // once runtime auth is resolved. Keep transport-supported APIs on
      // OpenClaw's HTTP transport so provider-specific auth/header semantics
      // are not lost behind that wrapper.
      // Boundary-aware transports read credentials from options.apiKey just
      // like provider-owned streams, but the embedded run layer never gets to
      // inject the resolved runtime key for them. Without this wrap, OAuth
      // providers (e.g. openai/gpt-5.5 over ChatGPT OAuth) hit the Responses API with an
      // empty bearer and fail with 401 Missing bearer auth header.
      return wrapEmbeddedAgentStreamFn(boundaryAwareStreamFn, {
        runSignal: params.signal,
        resolvedApiKey: params.resolvedApiKey,
        authProfileId: params.authProfileId,
        authStorage: params.authStorage,
        providerId: params.model.provider,
        promptCacheKey: params.promptCacheKey,
      });
    }
  }

  const promptCacheKey = params.promptCacheKey?.trim();
  if (!promptCacheKey) {
    return currentStreamFn;
  }
  return wrapEmbeddedAgentStreamFn(currentStreamFn, {
    runSignal: params.signal,
    resolvedApiKey: undefined,
    authProfileId: undefined,
    authStorage: undefined,
    providerId: params.model.provider,
    promptCacheKey,
  });
}

export const testing = {
  setOpenClawNativeCodexResponsesStreamFnForTest(streamFn: StreamFn | undefined): void {
    openClawNativeCodexResponsesStreamFnForTest = streamFn;
  },
  resetOpenClawNativeCodexResponsesStreamFnForTest(): void {
    openClawNativeCodexResponsesStreamFnForTest = undefined;
  },
};

function wrapEmbeddedAgentStreamFn(
  inner: StreamFn,
  params: {
    runSignal: AbortSignal | undefined;
    resolvedApiKey: string | undefined;
    authProfileId: string | undefined;
    authStorage: { getApiKey(provider: string): Promise<string | undefined> } | undefined;
    providerId: string;
    sessionId?: string;
    promptCacheKey?: string;
    transformContext?: (context: Parameters<StreamFn>[1]) => Parameters<StreamFn>[1];
  },
): StreamFn {
  const transformContext =
    params.transformContext ?? ((context: Parameters<StreamFn>[1]) => context);
  const mergeRunSignal = (options: Parameters<StreamFn>[2]) => {
    const embeddedOptions = options as EmbeddedStreamOptions | undefined;
    const signal = embeddedOptions?.signal ?? params.runSignal;
    let merged =
      params.sessionId && !embeddedOptions?.sessionId
        ? { ...embeddedOptions, sessionId: params.sessionId }
        : embeddedOptions;
    const promptCacheKey = params.promptCacheKey?.trim();
    if (promptCacheKey && !merged?.promptCacheKey) {
      merged = { ...merged, promptCacheKey };
    }
    if (params.authProfileId && !merged?.authProfileId) {
      merged = { ...merged, authProfileId: params.authProfileId };
    }
    return signal ? { ...merged, signal } : merged;
  };
  if (!params.authStorage && !params.resolvedApiKey) {
    return (m, context, options) => inner(m, transformContext(context), mergeRunSignal(options));
  }
  const { authStorage, providerId, resolvedApiKey } = params;
  return async (m, context, options) => {
    const apiKey = await resolveEmbeddedAgentApiKey({
      provider: providerId,
      resolvedApiKey,
      authStorage,
    });
    return inner(m, transformContext(context), {
      ...mergeRunSignal(options),
      apiKey: apiKey ?? options?.apiKey,
    });
  };
}
export { testing as __testing };
>>>>>>> upstream/main:src/agents/embedded-agent-runner/stream-resolution.ts
