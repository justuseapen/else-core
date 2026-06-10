<<<<<<< HEAD
import { loadConfig } from "../config/config.js";
import { resolveExecApprovalInitiatingSurfaceState } from "./exec-approval-surface.js";

export function hasApprovalTurnSourceRoute(params: {
  turnSourceChannel?: string | null;
  turnSourceAccountId?: string | null;
=======
// Checks whether an approval reply can route to the initiating turn source.
import { getRuntimeConfig } from "../config/config.js";
import { resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface.js";

/** Returns whether approval replies can route back to the turn's initiating surface. */
export function hasApprovalTurnSourceRoute(params: {
  turnSourceChannel?: string | null;
  turnSourceAccountId?: string | null;
  approvalKind?: "exec" | "plugin";
>>>>>>> upstream/main
}): boolean {
  if (!params.turnSourceChannel?.trim()) {
    return false;
  }
  return (
<<<<<<< HEAD
    resolveExecApprovalInitiatingSurfaceState({
      channel: params.turnSourceChannel,
      accountId: params.turnSourceAccountId,
      cfg: loadConfig(),
=======
    resolveApprovalInitiatingSurfaceState({
      channel: params.turnSourceChannel,
      accountId: params.turnSourceAccountId,
      cfg: getRuntimeConfig(),
      approvalKind: params.approvalKind ?? "exec",
>>>>>>> upstream/main
    }).kind === "enabled"
  );
}
