<<<<<<< HEAD
export { matrixPlugin } from "./src/channel.js";
export * from "./src/setup-core.js";
export * from "./src/setup-surface.js";
export * from "./src/account-selection.js";
export * from "./src/env-vars.js";
export * from "./src/storage-paths.js";
=======
// Matrix API module exposes the plugin public contract.
export { matrixPlugin } from "./src/channel.js";
export { createMatrixSetupWizardProxy, matrixSetupAdapter } from "./src/setup-core.js";
export { matrixOnboardingAdapter } from "./src/setup-surface.js";
export {
  findMatrixAccountEntry,
  requiresExplicitMatrixDefaultAccount,
  resolveConfiguredMatrixAccountIds,
  resolveMatrixChannelConfig,
  resolveMatrixDefaultOrOnlyAccountId,
} from "./src/account-selection.js";
export {
  getMatrixScopedEnvVarNames,
  listMatrixEnvAccountIds,
  resolveMatrixEnvAccountToken,
} from "./src/env-vars.js";
export {
  hashMatrixAccessToken,
  resolveMatrixAccountStorageRoot,
  resolveMatrixCredentialsDir,
  resolveMatrixCredentialsFilename,
  resolveMatrixCredentialsPath,
  resolveMatrixHomeserverKey,
  resolveMatrixLegacyFlatStoragePaths,
  resolveMatrixLegacyFlatStoreRoot,
  sanitizeMatrixPathSegment,
} from "./src/storage-paths.js";
>>>>>>> upstream/main
export {
  createMatrixThreadBindingManager,
  getMatrixThreadBindingManager,
  resetMatrixThreadBindingsForTests,
} from "./src/matrix/thread-bindings.js";
export {
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
} from "./src/matrix/thread-bindings-shared.js";
export { matrixOnboardingAdapter as matrixSetupWizard } from "./src/onboarding.js";

export const matrixSessionBindingAdapterChannels = ["matrix"] as const;
