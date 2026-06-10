<<<<<<< HEAD
import { getChannelPlugin, resolveChannelApprovalCapability } from "../channels/plugins/index.js";
import type { OpenClawConfig } from "../config/config.js";
import { normalizeMessageChannel } from "../utils/message-channel.js";

export type ApprovalCommandAuthorization = {
=======
// Authorizes chat approval commands against channel approval policy.
import { getChannelPlugin, resolveChannelApprovalCapability } from "../channels/plugins/index.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { isImplicitSameChatApprovalAuthorization } from "../plugin-sdk/approval-auth-helpers.js";
import { normalizeMessageChannel } from "../utils/message-channel.js";

type ApprovalCommandAuthorization = {
>>>>>>> upstream/main
  authorized: boolean;
  reason?: string;
  explicit: boolean;
};

<<<<<<< HEAD
=======
/** Resolves whether a chat `/approve` command is authorized by channel-specific approval policy. */
>>>>>>> upstream/main
export function resolveApprovalCommandAuthorization(params: {
  cfg: OpenClawConfig;
  channel?: string | null;
  accountId?: string | null;
  senderId?: string | null;
  kind: "exec" | "plugin";
}): ApprovalCommandAuthorization {
  const channel = normalizeMessageChannel(params.channel);
  if (!channel) {
<<<<<<< HEAD
=======
    // Non-channel command paths keep legacy behavior: allow, but do not count as explicit chat auth.
>>>>>>> upstream/main
    return { authorized: true, explicit: false };
  }
  const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(channel));
  const resolved = approvalCapability?.authorizeActorAction?.({
    cfg: params.cfg,
    accountId: params.accountId,
    senderId: params.senderId,
    action: "approve",
    approvalKind: params.kind,
  });
  if (!resolved) {
    return { authorized: true, explicit: false };
  }
<<<<<<< HEAD
=======
  // Keep `resolved` by reference; cloning before this check would drop the
  // non-enumerable implicit-fallback marker.
  const implicitSameChatAuthorization = isImplicitSameChatApprovalAuthorization(resolved);
>>>>>>> upstream/main
  const availability = approvalCapability?.getActionAvailabilityState?.({
    cfg: params.cfg,
    accountId: params.accountId,
    action: "approve",
<<<<<<< HEAD
=======
    approvalKind: params.kind,
>>>>>>> upstream/main
  });
  return {
    authorized: resolved.authorized,
    reason: resolved.reason,
<<<<<<< HEAD
    explicit: resolved.authorized ? availability?.kind !== "disabled" : true,
=======
    explicit: resolved.authorized
      ? !implicitSameChatAuthorization && availability?.kind !== "disabled"
      : true,
>>>>>>> upstream/main
  };
}
