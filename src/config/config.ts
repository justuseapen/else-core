// Public config facade for IO, mutation, runtime snapshots, paths, and shared config types.
export {
  clearConfigCache,
  ConfigRuntimeRefreshError,
  clearRuntimeConfigSnapshot,
  registerConfigWriteListener,
  createConfigIO,
  getRuntimeConfig,
<<<<<<< HEAD
=======
  getRuntimeConfigSnapshotMetadata,
>>>>>>> upstream/main
  getRuntimeConfigSnapshot,
  getRuntimeConfigSourceSnapshot,
  projectConfigOntoRuntimeSourceSnapshot,
  loadConfig,
  readBestEffortConfig,
  readSourceConfigBestEffort,
  parseConfigJson5,
  promoteConfigSnapshotToLastKnownGood,
  readConfigFileSnapshot,
  readConfigFileSnapshotWithPluginMetadata,
  readConfigFileSnapshotForWrite,
  readSourceConfigSnapshot,
  readSourceConfigSnapshotForWrite,
<<<<<<< HEAD
=======
  recoverConfigFromLastKnownGood,
  recoverConfigFromJsonRootSuffix,
>>>>>>> upstream/main
  resetConfigRuntimeState,
  resolveConfigSnapshotHash,
  resolveRuntimeConfigCacheKey,
  selectApplicableRuntimeConfig,
  setRuntimeConfigSnapshotRefreshHandler,
  setRuntimeConfigSnapshot,
  writeConfigFile,
} from "./io.js";
<<<<<<< HEAD
export type { ConfigWriteNotification } from "./io.js";
export { ConfigMutationConflictError, mutateConfigFile, replaceConfigFile } from "./mutate.js";
=======
export {
  hashRuntimeConfigValue,
  resolveConfigWriteAfterWrite,
  resolveConfigWriteFollowUp,
} from "./runtime-snapshot.js";
export type {
  ConfigWriteAfterWrite,
  ConfigWriteFollowUp,
  RuntimeConfigSnapshotMetadata,
} from "./runtime-snapshot.js";
export type {
  ConfigSnapshotReadOptions,
  ConfigWriteNotification,
  ConfigWriteResult,
  ReadConfigFileSnapshotWithPluginMetadataResult,
} from "./io.js";
export {
  ConfigMutationConflictError,
  mutateConfigFile,
  mutateConfigFileWithRetry,
  replaceConfigFile,
  transformConfigFile,
  transformConfigFileWithRetry,
} from "./mutate.js";
export type {
  ConfigMutationCommit,
  ConfigMutationCommitParams,
  ConfigMutationCommitResult,
  ConfigMutationContext,
  ConfigMutationIO,
  ConfigReplaceResult,
  ConfigMutationResult,
  ConfigTransformResult,
  TransformConfigFileParams,
  TransformConfigFileWithRetryParams,
} from "./mutate.js";
export {
  assertConfigWriteAllowedInCurrentMode,
  NixModeConfigMutationError,
} from "./nix-mode-write-guard.js";
>>>>>>> upstream/main
export * from "./paths.js";
export * from "./recovery-policy.js";
export * from "./runtime-overrides.js";
export * from "./types.js";
export {
  validateConfigObject,
  validateConfigObjectRaw,
  validateConfigObjectRawWithPlugins,
  validateConfigObjectWithPlugins,
} from "./validation.js";
