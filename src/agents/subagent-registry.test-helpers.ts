<<<<<<< HEAD
import { resetAnnounceQueuesForTests } from "./subagent-announce-queue.js";
import { subagentRuns } from "./subagent-registry-memory.js";
import { listRunsForRequesterFromRuns } from "./subagent-registry-queries.js";
=======
// Subagent registry test helpers expose the in-memory run map for small unit
// tests that do not need persistence, lifecycle hooks, or gateway mocks.
import { subagentRuns } from "./subagent-registry-memory.js";
>>>>>>> upstream/main
import type { SubagentRunRecord } from "./subagent-registry.types.js";

export function resetSubagentRegistryForTests() {
  subagentRuns.clear();
<<<<<<< HEAD
  resetAnnounceQueuesForTests();
=======
>>>>>>> upstream/main
}

export function addSubagentRunForTests(entry: SubagentRunRecord) {
  subagentRuns.set(entry.runId, entry);
}
<<<<<<< HEAD

export function listSubagentRunsForRequester(
  requesterSessionKey: string,
  options?: { requesterRunId?: string },
) {
  return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
=======
>>>>>>> upstream/main
