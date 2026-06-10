<<<<<<< HEAD
// Real workspace contract for memory engine storage/index helpers.

export {
  buildFileEntry,
  buildMultimodalChunkForIndexing,
  chunkMarkdown,
  cosineSimilarity,
  ensureDir,
  hashText,
  listMemoryFiles,
  normalizeExtraMemoryPaths,
  parseEmbedding,
  remapChunkLines,
  runWithConcurrency,
  type MemoryChunk,
  type MemoryFileEntry,
} from "./host/internal.js";
export { readMemoryFile } from "./host/read-file.js";
export { resolveMemoryBackendConfig } from "./host/backend-config.js";
export type {
  ResolvedMemoryBackendConfig,
  ResolvedQmdConfig,
  ResolvedQmdMcporterConfig,
} from "./host/backend-config.js";
export type {
  MemoryEmbeddingProbeResult,
  MemoryProviderStatus,
  MemorySearchManager,
  MemorySearchResult,
  MemorySource,
  MemorySyncProgressUpdate,
} from "./host/types.js";
export { ensureMemoryIndexSchema } from "./host/memory-schema.js";
export { loadSqliteVecExtension } from "./host/sqlite-vec.js";
export { requireNodeSqlite } from "./host/sqlite.js";
export { isFileMissingError, statRegularFile } from "./host/fs-utils.js";
=======
/**
 * Core-facing facade for memory backend storage config resolution. Keep this
 * path stable while the shared SDK package owns provider status semantics.
 */
export {
  resolveMemoryBackendConfig,
  type MemoryProviderStatus,
} from "../../packages/memory-host-sdk/src/engine-storage.js";
>>>>>>> upstream/main
