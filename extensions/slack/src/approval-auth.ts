<<<<<<< HEAD
=======
// Slack plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveSlackAccount } from "./accounts.js";
=======
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { resolveSlackAccount, resolveSlackAccountAllowFrom } from "./accounts.js";
>>>>>>> upstream/main
import { normalizeSlackApproverId } from "./exec-approvals.js";

export function getSlackApprovalApprovers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[] {
  const account = resolveSlackAccount(params).config;
  return resolveApprovalApprovers({
<<<<<<< HEAD
    allowFrom: account.allowFrom,
    extraAllowFrom: account.dm?.allowFrom,
=======
    allowFrom: resolveSlackAccountAllowFrom(params),
>>>>>>> upstream/main
    defaultTo: account.defaultTo,
    normalizeApprover: normalizeSlackApproverId,
    normalizeDefaultTo: normalizeSlackApproverId,
  });
}

export function isSlackApprovalAuthorizedSender(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  senderId?: string | null;
}): boolean {
  const senderId = params.senderId ? normalizeSlackApproverId(params.senderId) : undefined;
  if (!senderId) {
    return false;
  }
<<<<<<< HEAD
  return getSlackApprovalApprovers(params).includes(senderId);
=======
  const approvers = getSlackApprovalApprovers(params);
  if (approvers.length > 0) {
    return approvers.includes(senderId);
  }
  return (resolveSlackAccountAllowFrom(params) ?? []).some((entry) => entry.trim() === "*");
>>>>>>> upstream/main
}

export const slackApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Slack",
  resolveApprovers: ({ cfg, accountId }) => getSlackApprovalApprovers({ cfg, accountId }),
  normalizeSenderId: (value) => normalizeSlackApproverId(value),
});
