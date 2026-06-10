<<<<<<< HEAD
=======
/**
 * Runtime barrel for subagent announce registry helpers. Announce delivery
 * imports this narrow surface so tests can replace registry behavior without
 * loading the full persistence layer.
 */
>>>>>>> upstream/main
export {
  countActiveDescendantRuns,
  countPendingDescendantRuns,
  countPendingDescendantRunsExcludingRun,
  getLatestSubagentRunByChildSessionKey,
  isSubagentSessionRunActive,
  listSubagentRunsForRequester,
  replaceSubagentRunAfterSteer,
  resolveRequesterForChildSession,
  shouldIgnorePostCompletionAnnounceForSession,
} from "./subagent-registry-runtime.js";
