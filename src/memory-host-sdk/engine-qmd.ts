<<<<<<< HEAD
// Real workspace contract for QMD/session/query helpers used by the memory engine.

export { extractKeywords, isQueryStopWordToken } from "./host/query-expansion.js";
export {
  buildSessionEntry,
  listSessionFilesForAgent,
  sessionPathForFile,
  type SessionFileEntry,
} from "./host/session-files.js";
export { parseQmdQueryJson, type QmdQueryResult } from "./host/qmd-query-parser.js";
export {
  deriveQmdScopeChannel,
  deriveQmdScopeChatType,
  isQmdScopeAllowed,
} from "./host/qmd-scope.js";
export {
  checkQmdBinaryAvailability,
  resolveCliSpawnInvocation,
  runCliCommand,
} from "./host/qmd-process.js";
=======
/**
 * Core-facing facade for qmd engine availability checks. The package owns the
 * binary probing contract; repo callers import through this stable local path.
 */
export {
  checkQmdBinaryAvailability,
  resolveQmdBinaryUnavailableReason,
  type QmdBinaryAvailability,
  type QmdBinaryUnavailable,
  type QmdBinaryUnavailableReason,
} from "../../packages/memory-host-sdk/src/engine-qmd.js";
>>>>>>> upstream/main
