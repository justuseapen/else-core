<<<<<<< HEAD
export { getRuntimeConfigSnapshot } from "../config/runtime-snapshot.js";
=======
/**
 * Runtime SDK subpath for config snapshot and config cache access.
 */
export {
  clearRuntimeConfigSnapshot,
  getRuntimeConfigSnapshot,
  selectApplicableRuntimeConfig,
  setRuntimeConfigSnapshot,
} from "../config/runtime-snapshot.js";
export {
  clearConfigCache,
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
} from "../config/io.js";
>>>>>>> upstream/main
export type { OpenClawConfig } from "../config/types.js";
