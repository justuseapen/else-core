<<<<<<< HEAD
export {
  createMatrixThreadBindingManager,
  resetMatrixThreadBindingsForTests,
} from "./src/matrix/thread-bindings.js";
export { setMatrixRuntime } from "./src/runtime.js";
export { normalizeCompatibilityConfig, legacyConfigRules } from "./src/doctor-contract.js";
=======
// Matrix API module exposes the plugin public contract.
>>>>>>> upstream/main
export {
  namedAccountPromotionKeys,
  resolveSingleAccountPromotionTarget,
  singleAccountKeysToMove,
} from "./src/setup-contract.js";
<<<<<<< HEAD
export {
  collectRuntimeConfigAssignments,
  secretTargetRegistryEntries,
} from "./src/secret-contract.js";
=======
>>>>>>> upstream/main
export { matrixSetupAdapter } from "./src/setup-core.js";
export { matrixSetupWizard } from "./src/setup-surface.js";
