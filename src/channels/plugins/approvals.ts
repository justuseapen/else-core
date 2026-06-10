<<<<<<< HEAD
import type { ChannelApprovalAdapter, ChannelApprovalCapability, ChannelPlugin } from "./types.js";

function buildApprovalCapabilityFromLegacyPlugin(
  plugin?: Pick<ChannelPlugin, "auth" | "approvals"> | null,
): ChannelApprovalCapability | undefined {
  const authorizeActorAction = plugin?.auth?.authorizeActorAction;
  const getActionAvailabilityState = plugin?.auth?.getActionAvailabilityState;
  const resolveApproveCommandBehavior = plugin?.auth?.resolveApproveCommandBehavior;
  const approvals = plugin?.approvals;
  if (
    !authorizeActorAction &&
    !getActionAvailabilityState &&
    !resolveApproveCommandBehavior &&
    !approvals?.describeExecApprovalSetup &&
    !approvals?.delivery &&
    !approvals?.render &&
    !approvals?.native
  ) {
    return undefined;
  }
  return {
    authorizeActorAction,
    getActionAvailabilityState,
    resolveApproveCommandBehavior,
    describeExecApprovalSetup: approvals?.describeExecApprovalSetup,
    delivery: approvals?.delivery,
    render: approvals?.render,
    native: approvals?.native,
  };
}

export function resolveChannelApprovalCapability(
  plugin?: Pick<ChannelPlugin, "approvalCapability" | "auth" | "approvals"> | null,
): ChannelApprovalCapability | undefined {
  const capability = plugin?.approvalCapability;
  const legacyCapability = buildApprovalCapabilityFromLegacyPlugin(plugin);
  if (!capability) {
    return legacyCapability;
  }
  if (!legacyCapability) {
    return capability;
  }
  return {
    authorizeActorAction: capability.authorizeActorAction ?? legacyCapability.authorizeActorAction,
    getActionAvailabilityState:
      capability.getActionAvailabilityState ?? legacyCapability.getActionAvailabilityState,
    resolveApproveCommandBehavior:
      capability.resolveApproveCommandBehavior ?? legacyCapability.resolveApproveCommandBehavior,
    describeExecApprovalSetup:
      capability.describeExecApprovalSetup ?? legacyCapability.describeExecApprovalSetup,
    delivery: capability.delivery ?? legacyCapability.delivery,
    render: capability.render ?? legacyCapability.render,
    native: capability.native ?? legacyCapability.native,
  };
}

export function resolveChannelApprovalAdapter(
  plugin?: Pick<ChannelPlugin, "approvalCapability" | "auth" | "approvals"> | null,
=======
/**
 * Channel approval capability adapters.
 *
 * Projects plugin approval metadata into runtime approval delivery adapters.
 */
import type { ChannelApprovalAdapter, ChannelApprovalCapability } from "./types.adapters.js";
import type { ChannelPlugin } from "./types.plugin.js";

/**
 * Returns the approval capability exposed by a channel plugin.
 */
export function resolveChannelApprovalCapability(
  plugin?: Pick<ChannelPlugin, "approvalCapability"> | null,
): ChannelApprovalCapability | undefined {
  return plugin?.approvalCapability;
}

/**
 * Projects a channel approval capability into the runtime approval adapter shape.
 */
export function resolveChannelApprovalAdapter(
  plugin?: Pick<ChannelPlugin, "approvalCapability"> | null,
>>>>>>> upstream/main
): ChannelApprovalAdapter | undefined {
  const capability = resolveChannelApprovalCapability(plugin);
  if (!capability) {
    return undefined;
  }
<<<<<<< HEAD
  if (!capability.delivery && !capability.render && !capability.native) {
=======
  if (
    !capability.delivery &&
    !capability.nativeRuntime &&
    !capability.render &&
    !capability.native
  ) {
    // Auth-only capabilities are valid plugin metadata but do not form a delivery adapter.
>>>>>>> upstream/main
    return undefined;
  }
  return {
    describeExecApprovalSetup: capability.describeExecApprovalSetup,
    delivery: capability.delivery,
<<<<<<< HEAD
=======
    nativeRuntime: capability.nativeRuntime,
>>>>>>> upstream/main
    render: capability.render,
    native: capability.native,
  };
}
