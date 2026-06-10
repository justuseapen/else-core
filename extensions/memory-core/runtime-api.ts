<<<<<<< HEAD
=======
// Memory Core API module exposes the plugin public contract.
>>>>>>> upstream/main
export { getMemorySearchManager, MemoryIndexManager } from "./src/memory/index.js";
export { memoryRuntime } from "./src/runtime-provider.js";
export {
  DEFAULT_LOCAL_MODEL,
  getBuiltinMemoryEmbeddingProviderDoctorMetadata,
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata,
<<<<<<< HEAD
} from "./src/memory/provider-adapters.js";
=======
  registerBuiltInMemoryEmbeddingProviders,
} from "./src/memory/provider-adapters.js";
export { createEmbeddingProvider } from "./src/memory/embeddings.js";
>>>>>>> upstream/main
export {
  resolveMemoryCacheSummary,
  resolveMemoryFtsState,
  resolveMemoryVectorState,
  type Tone,
} from "openclaw/plugin-sdk/memory-core-host-status";
export { checkQmdBinaryAvailability } from "openclaw/plugin-sdk/memory-core-host-engine-qmd";
export { hasConfiguredMemorySecretInput } from "openclaw/plugin-sdk/memory-core-host-secret";
<<<<<<< HEAD
export {
  auditShortTermPromotionArtifacts,
=======
export { auditDreamingArtifacts, repairDreamingArtifacts } from "./src/dreaming-repair.js";
export { configureMemoryCoreDreamingState } from "./src/dreaming-state.js";
export {
  auditShortTermPromotionArtifacts,
  loadShortTermPromotionDreamingStats,
  removeGroundedShortTermCandidates,
>>>>>>> upstream/main
  repairShortTermPromotionArtifacts,
} from "./src/short-term-promotion.js";
export type { BuiltinMemoryEmbeddingProviderDoctorMetadata } from "./src/memory/provider-adapters.js";
export type {
<<<<<<< HEAD
  RepairShortTermPromotionArtifactsResult,
=======
  DreamingArtifactsAuditSummary,
  RepairDreamingArtifactsResult,
} from "./src/dreaming-repair.js";
export type {
  RepairShortTermPromotionArtifactsResult,
  ShortTermDreamingStats,
  ShortTermDreamingStatsEntry,
>>>>>>> upstream/main
  ShortTermAuditSummary,
} from "./src/short-term-promotion.js";
