<<<<<<< HEAD
=======
// Ollama plugin module implements memory embedding adapter behavior.
>>>>>>> upstream/main
import type { MemoryEmbeddingProviderAdapter } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
import {
  DEFAULT_OLLAMA_EMBEDDING_MODEL,
  createOllamaEmbeddingProvider,
} from "./embedding-provider.js";

export const ollamaMemoryEmbeddingProviderAdapter: MemoryEmbeddingProviderAdapter = {
  id: "ollama",
  defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
  transport: "remote",
<<<<<<< HEAD
=======
  authProviderId: "ollama",
>>>>>>> upstream/main
  create: async (options) => {
    const { provider, client } = await createOllamaEmbeddingProvider({
      ...options,
      provider: "ollama",
      fallback: "none",
    });
    return {
      provider,
      runtime: {
        id: "ollama",
<<<<<<< HEAD
=======
        inlineBatchTimeoutMs: 10 * 60_000,
>>>>>>> upstream/main
        cacheKeyData: {
          provider: "ollama",
          model: client.model,
        },
      },
    };
  },
};
