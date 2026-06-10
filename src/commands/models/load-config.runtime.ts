<<<<<<< HEAD
export { resolveCommandSecretRefsViaGateway } from "../../cli/command-secret-gateway.js";
export { getModelsCommandSecretTargetIds } from "../../cli/command-secret-targets.js";
export {
  getRuntimeConfig,
  readSourceConfigSnapshotForWrite,
=======
/** Runtime seams for loading model command config and secret target ids. */
export { getModelsCommandSecretTargetIds } from "../../cli/command-secret-targets.js";
export {
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
>>>>>>> upstream/main
  setRuntimeConfigSnapshot,
  type OpenClawConfig,
} from "../../config/config.js";
