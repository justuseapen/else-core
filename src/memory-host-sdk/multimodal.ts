<<<<<<< HEAD
export {
  isMemoryMultimodalEnabled,
  normalizeMemoryMultimodalSettings,
  supportsMemoryMultimodalEmbeddings,
  type MemoryMultimodalSettings,
} from "./host/multimodal.js";
=======
/**
 * Core-facing multimodal memory helpers. The shared SDK package owns modality
 * detection and payload contracts; this facade keeps internal imports stable.
 */
export * from "../../packages/memory-host-sdk/src/multimodal.js";
>>>>>>> upstream/main
