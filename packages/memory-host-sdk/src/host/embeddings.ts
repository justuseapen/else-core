// Memory Host SDK module implements embeddings behavior.
import { DEFAULT_LOCAL_MODEL } from "./embedding-defaults.js";
import { sanitizeAndNormalizeEmbedding } from "./embedding-vectors.js";
import { createLocalEmbeddingWorkerProvider } from "./embeddings-worker.js";
import type { EmbeddingProvider, EmbeddingProviderOptions } from "./embeddings.types.js";
import {
<<<<<<< HEAD
  createBedrockEmbeddingProvider,
  hasAwsCredentials,
  type BedrockEmbeddingClient,
} from "./embeddings-bedrock.js";
import {
  createGeminiEmbeddingProvider,
  type GeminiEmbeddingClient,
  type GeminiTaskType,
} from "./embeddings-gemini.js";
import {
  createMistralEmbeddingProvider,
  type MistralEmbeddingClient,
} from "./embeddings-mistral.js";
import { createOllamaEmbeddingProvider, type OllamaEmbeddingClient } from "./embeddings-ollama.js";
import { createOpenAiEmbeddingProvider, type OpenAiEmbeddingClient } from "./embeddings-openai.js";
import { createVoyageEmbeddingProvider, type VoyageEmbeddingClient } from "./embeddings-voyage.js";
import { importNodeLlamaCpp } from "./node-llama.js";

export type { GeminiEmbeddingClient } from "./embeddings-gemini.js";
export type { MistralEmbeddingClient } from "./embeddings-mistral.js";
export type { OpenAiEmbeddingClient } from "./embeddings-openai.js";
export type { VoyageEmbeddingClient } from "./embeddings-voyage.js";
export type { OllamaEmbeddingClient } from "./embeddings-ollama.js";
export type { BedrockEmbeddingClient } from "./embeddings-bedrock.js";

export type EmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string) => Promise<number[]>;
  embedBatch: (texts: string[]) => Promise<number[][]>;
  embedBatchInputs?: (inputs: EmbeddingInput[]) => Promise<number[][]>;
};

export type EmbeddingProviderId =
  | "openai"
  | "local"
  | "gemini"
  | "voyage"
  | "mistral"
  | "ollama"
  | "bedrock";
export type EmbeddingProviderRequest = EmbeddingProviderId | "auto";
export type EmbeddingProviderFallback = EmbeddingProviderId | "none";

// Remote providers considered for auto-selection when provider === "auto".
// Ollama is intentionally excluded here so that "auto" mode does not
// implicitly assume a local Ollama instance is available.
// Bedrock is included when AWS credentials are detected.
const REMOTE_EMBEDDING_PROVIDER_IDS = ["openai", "gemini", "voyage", "mistral"] as const;

export type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: EmbeddingProviderRequest;
  fallbackFrom?: EmbeddingProviderId;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  openAi?: OpenAiEmbeddingClient;
  gemini?: GeminiEmbeddingClient;
  voyage?: VoyageEmbeddingClient;
  mistral?: MistralEmbeddingClient;
  ollama?: OllamaEmbeddingClient;
  bedrock?: BedrockEmbeddingClient;
};

export type EmbeddingProviderOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider: EmbeddingProviderRequest;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  fallback: EmbeddingProviderFallback;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
  };
  /** Provider-specific output vector dimensions for supported embedding families. */
  outputDimensionality?: number;
  /** Gemini: override the default task type sent with embedding requests. */
  taskType?: GeminiTaskType;
};

export const DEFAULT_LOCAL_MODEL =
  "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";

function canAutoSelectLocal(options: EmbeddingProviderOptions): boolean {
  const modelPath = options.local?.modelPath?.trim();
  if (!modelPath) {
    return false;
=======
  importNodeLlamaCpp,
  type Llama,
  type LlamaEmbeddingContext,
  type LlamaModel,
} from "./node-llama.js";
import { normalizeOptionalString } from "./string-utils.js";

type DisposableResource = {
  dispose?: () => Promise<void> | void;
};

export type {
  EmbeddingProvider,
  EmbeddingProviderFallback,
  EmbeddingProviderId,
  EmbeddingProviderOptions,
  EmbeddingProviderRequest,
  GeminiTaskType,
} from "./embeddings.types.js";

export { DEFAULT_LOCAL_MODEL } from "./embedding-defaults.js";

export type LocalEmbeddingProviderRuntimeOptions = {
  workerScriptPath?: string;
  nodeLlamaCppImportUrl?: string;
};

async function disposeResources(
  resources: Array<DisposableResource | null | undefined>,
): Promise<void> {
  let firstError: unknown;
  for (const resource of resources) {
    try {
      await resource?.dispose?.();
    } catch (err) {
      firstError ??= err;
    }
>>>>>>> upstream/main
  }
  if (firstError) {
    throw toLintErrorObject(firstError, "Non-Error thrown");
  }
}

export async function createLocalEmbeddingProvider(
  options: EmbeddingProviderOptions,
  runtimeOptions?: LocalEmbeddingProviderRuntimeOptions,
): Promise<EmbeddingProvider> {
  return await createLocalEmbeddingWorkerProvider(options, runtimeOptions);
}

export async function createLocalEmbeddingProviderInProcess(
  options: EmbeddingProviderOptions,
): Promise<EmbeddingProvider> {
  const modelPath = normalizeOptionalString(options.local?.modelPath) || DEFAULT_LOCAL_MODEL;
  const modelCacheDir = normalizeOptionalString(options.local?.modelCacheDir);
  const nodeLlamaCppImportUrl = normalizeOptionalString(
    (options.local as EmbeddingProviderOptions["local"] & { nodeLlamaCppImportUrl?: string })
      ?.nodeLlamaCppImportUrl,
  );
  const contextSize: number | "auto" = options.local?.contextSize ?? 4096;

  // Lazy-load node-llama-cpp to keep startup light unless local is enabled.
  const { getLlama, resolveModelFile, LlamaLogLevel } =
    await importNodeLlamaCpp(nodeLlamaCppImportUrl);

  let llama: Llama | null = null;
  let embeddingModel: LlamaModel | null = null;
  let embeddingContext: LlamaEmbeddingContext | null = null;
  let initPromise: Promise<LlamaEmbeddingContext> | null = null;
  let initAbortController: AbortController | null = null;
  let closePromise: Promise<void> | null = null;
  let closed = false;

  const throwIfClosed = () => {
    if (closed) {
      throw new Error("Local embedding provider has been closed");
    }
  };
  const disposeAndThrowIfClosed = async <T extends DisposableResource>(resource: T): Promise<T> => {
    if (!closed) {
      return resource;
    }
    await disposeResources([resource]);
    throwIfClosed();
    return resource;
  };

  const ensureContext = async (): Promise<LlamaEmbeddingContext> => {
    throwIfClosed();
    if (embeddingContext) {
      return embeddingContext;
    }
    if (initPromise) {
      return initPromise;
    }
    initPromise = (async () => {
      const abortController = new AbortController();
      initAbortController = abortController;
      try {
        if (!llama) {
          const nextLlama = await getLlama({
            logLevel: LlamaLogLevel.error,
          });
          llama = await disposeAndThrowIfClosed(nextLlama);
        }
        if (!embeddingModel) {
          const resolved = await resolveModelFile(modelPath, {
            ...(modelCacheDir ? { directory: modelCacheDir } : {}),
            signal: abortController.signal,
          });
          throwIfClosed();
          const nextModel = await llama.loadModel({
            modelPath: resolved,
            loadSignal: abortController.signal,
          });
          embeddingModel = await disposeAndThrowIfClosed(nextModel);
        }
        if (!embeddingContext) {
          const nextContext = await embeddingModel.createEmbeddingContext({
            contextSize,
            createSignal: abortController.signal,
          });
          embeddingContext = await disposeAndThrowIfClosed(nextContext);
        }
        return embeddingContext;
      } catch (err) {
        initPromise = null;
        throw err;
      } finally {
        if (initAbortController === abortController) {
          initAbortController = null;
        }
      }
    })();
    return initPromise;
  };

  return {
    id: "local",
    model: modelPath,
    embedQuery: async (text, optionsValue) => {
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const embedding = await ctx.getEmbeddingFor(text);
      return sanitizeAndNormalizeEmbedding(Array.from(embedding.vector));
    },
    embedBatch: async (texts, optionsLocal) => {
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const embeddings: number[][] = [];
      for (const text of texts) {
        throwIfClosed();
        optionsLocal?.signal?.throwIfAborted();
        const embedding = await ctx.getEmbeddingFor(text);
        embeddings.push(sanitizeAndNormalizeEmbedding(Array.from(embedding.vector)));
      }
      return embeddings;
    },
    close: async () => {
      if (closePromise) {
        return closePromise;
      }
      closed = true;
      initAbortController?.abort();
      initAbortController = null;
      closePromise = (async () => {
        const context = embeddingContext;
        const model = embeddingModel;
        const runtime = llama;
        embeddingContext = null;
        embeddingModel = null;
        llama = null;
        initPromise = null;
        await disposeResources([context, model, runtime]);
      })();
      return closePromise;
    },
  };
}

<<<<<<< HEAD
export async function createEmbeddingProvider(
  options: EmbeddingProviderOptions,
): Promise<EmbeddingProviderResult> {
  const requestedProvider = options.provider;
  const fallback = options.fallback;

  const createProvider = async (id: EmbeddingProviderId) => {
    if (id === "local") {
      const provider = await createLocalEmbeddingProvider(options);
      return { provider };
    }
    if (id === "ollama") {
      const { provider, client } = await createOllamaEmbeddingProvider(options);
      return { provider, ollama: client };
    }
    if (id === "gemini") {
      const { provider, client } = await createGeminiEmbeddingProvider(options);
      return { provider, gemini: client };
    }
    if (id === "voyage") {
      const { provider, client } = await createVoyageEmbeddingProvider(options);
      return { provider, voyage: client };
    }
    if (id === "mistral") {
      const { provider, client } = await createMistralEmbeddingProvider(options);
      return { provider, mistral: client };
    }
    if (id === "bedrock") {
      const { provider, client } = await createBedrockEmbeddingProvider(options);
      return { provider, bedrock: client };
    }
    const { provider, client } = await createOpenAiEmbeddingProvider(options);
    return { provider, openAi: client };
  };

  const formatPrimaryError = (err: unknown, provider: EmbeddingProviderId) =>
    provider === "local" ? formatLocalSetupError(err) : formatErrorMessage(err);

  if (requestedProvider === "auto") {
    const missingKeyErrors: string[] = [];
    let localError: string | null = null;

    if (canAutoSelectLocal(options)) {
      try {
        const local = await createProvider("local");
        return { ...local, requestedProvider };
      } catch (err) {
        localError = formatLocalSetupError(err);
      }
    }

    for (const provider of REMOTE_EMBEDDING_PROVIDER_IDS) {
      try {
        const result = await createProvider(provider);
        return { ...result, requestedProvider };
      } catch (err) {
        const message = formatPrimaryError(err, provider);
        if (isMissingApiKeyError(err)) {
          missingKeyErrors.push(message);
          continue;
        }
        // Non-auth errors (e.g., network) are still fatal
        const wrapped = new Error(message) as Error & { cause?: unknown };
        wrapped.cause = err;
        throw wrapped;
      }
    }

    // Try bedrock if AWS credentials are available
    if (await hasAwsCredentials()) {
      try {
        const result = await createProvider("bedrock");
        return { ...result, requestedProvider };
      } catch (err) {
        const message = formatPrimaryError(err, "bedrock");
        if (isMissingApiKeyError(err)) {
          missingKeyErrors.push(message);
        } else {
          const wrapped = new Error(message) as Error & { cause?: unknown };
          wrapped.cause = err;
          throw wrapped;
        }
      }
    }

    // All providers failed due to missing API keys - return null provider for FTS-only mode
    const details = [...missingKeyErrors, localError].filter(Boolean) as string[];
    const reason = details.length > 0 ? details.join("\n\n") : "No embeddings provider available.";
    return {
      provider: null,
      requestedProvider,
      providerUnavailableReason: reason,
    };
=======
function toLintErrorObject(value: unknown, fallbackMessage: string): Error {
  if (value instanceof Error) {
    return value;
>>>>>>> upstream/main
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
