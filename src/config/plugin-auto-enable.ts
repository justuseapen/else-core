<<<<<<< HEAD
=======
// Public facade for plugin auto-enable detection, application, and reason types.
>>>>>>> upstream/main
export {
  applyPluginAutoEnable,
  materializePluginAutoEnableCandidates,
} from "./plugin-auto-enable.apply.js";
export { detectPluginAutoEnableCandidates } from "./plugin-auto-enable.detect.js";
export type {
  PluginAutoEnableCandidate,
  PluginAutoEnableResult,
<<<<<<< HEAD
} from "./plugin-auto-enable.shared.js";
=======
} from "./plugin-auto-enable.types.js";
>>>>>>> upstream/main
export { resolvePluginAutoEnableCandidateReason } from "./plugin-auto-enable.shared.js";
