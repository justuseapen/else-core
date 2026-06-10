<<<<<<< HEAD
=======
// Checks whether a requester can read or mutate task-flow records.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
>>>>>>> upstream/main
import {
  findLatestTaskFlowForOwnerKey,
  getTaskFlowById,
  listTaskFlowsForOwnerKey,
} from "./task-flow-registry.js";
import type { TaskFlowRecord } from "./task-flow-registry.types.js";

<<<<<<< HEAD
function normalizeOwnerKey(ownerKey?: string): string | undefined {
  const trimmed = ownerKey?.trim();
  return trimmed ? trimmed : undefined;
}

function canOwnerAccessFlow(flow: TaskFlowRecord, callerOwnerKey: string): boolean {
  return normalizeOwnerKey(flow.ownerKey) === normalizeOwnerKey(callerOwnerKey);
}

=======
/** Reads a flow only when it belongs to the caller owner key. */
>>>>>>> upstream/main
export function getTaskFlowByIdForOwner(params: {
  flowId: string;
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
  const flow = getTaskFlowById(params.flowId);
<<<<<<< HEAD
  return flow && canOwnerAccessFlow(flow, params.callerOwnerKey) ? flow : undefined;
}

export function listTaskFlowsForOwner(params: { callerOwnerKey: string }): TaskFlowRecord[] {
  const ownerKey = normalizeOwnerKey(params.callerOwnerKey);
=======
  return flow &&
    normalizeOptionalString(flow.ownerKey) === normalizeOptionalString(params.callerOwnerKey)
    ? flow
    : undefined;
}

export function listTaskFlowsForOwner(params: { callerOwnerKey: string }): TaskFlowRecord[] {
  const ownerKey = normalizeOptionalString(params.callerOwnerKey);
>>>>>>> upstream/main
  return ownerKey ? listTaskFlowsForOwnerKey(ownerKey) : [];
}

export function findLatestTaskFlowForOwner(params: {
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
<<<<<<< HEAD
  const ownerKey = normalizeOwnerKey(params.callerOwnerKey);
=======
  const ownerKey = normalizeOptionalString(params.callerOwnerKey);
>>>>>>> upstream/main
  return ownerKey ? findLatestTaskFlowForOwnerKey(ownerKey) : undefined;
}

export function resolveTaskFlowForLookupTokenForOwner(params: {
  token: string;
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
  const direct = getTaskFlowByIdForOwner({
    flowId: params.token,
    callerOwnerKey: params.callerOwnerKey,
  });
  if (direct) {
    return direct;
  }
<<<<<<< HEAD
  const normalizedToken = normalizeOwnerKey(params.token);
  const normalizedCallerOwnerKey = normalizeOwnerKey(params.callerOwnerKey);
=======
  const normalizedToken = normalizeOptionalString(params.token);
  const normalizedCallerOwnerKey = normalizeOptionalString(params.callerOwnerKey);
>>>>>>> upstream/main
  if (!normalizedToken || normalizedToken !== normalizedCallerOwnerKey) {
    return undefined;
  }
  return findLatestTaskFlowForOwner({ callerOwnerKey: normalizedCallerOwnerKey });
}
