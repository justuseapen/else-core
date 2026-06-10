<<<<<<< HEAD
=======
// Googlechat plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
<<<<<<< HEAD
import { resolveGoogleChatAccount } from "./accounts.js";
import { isGoogleChatUserTarget, normalizeGoogleChatTarget } from "./targets.js";

function normalizeGoogleChatApproverId(value: string | number): string | undefined {
=======
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveGoogleChatAccount } from "./accounts.js";
import { isGoogleChatUserTarget, normalizeGoogleChatTarget } from "./targets.js";

export function normalizeGoogleChatApproverId(value: string | number): string | undefined {
>>>>>>> upstream/main
  const normalized = normalizeGoogleChatTarget(String(value));
  if (!normalized || !isGoogleChatUserTarget(normalized)) {
    return undefined;
  }
<<<<<<< HEAD
  const suffix = normalized.slice("users/".length).trim().toLowerCase();
=======
  const suffix = normalizeLowercaseStringOrEmpty(normalized.slice("users/".length));
>>>>>>> upstream/main
  if (!suffix || suffix.includes("@")) {
    return undefined;
  }
  return `users/${suffix}`;
}

<<<<<<< HEAD
export const googleChatApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Google Chat",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveGoogleChatAccount({ cfg, accountId }).config;
    return resolveApprovalApprovers({
      allowFrom: account.dm?.allowFrom,
      defaultTo: account.defaultTo,
      normalizeApprover: normalizeGoogleChatApproverId,
    });
  },
=======
export function getGoogleChatApprovalApprovers(params: {
  cfg: Parameters<typeof resolveGoogleChatAccount>[0]["cfg"];
  accountId?: string | null;
}): string[] {
  const account = resolveGoogleChatAccount(params).config;
  return resolveApprovalApprovers({
    allowFrom: account.dm?.allowFrom,
    defaultTo: account.defaultTo,
    normalizeApprover: normalizeGoogleChatApproverId,
  });
}

export const googleChatApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Google Chat",
  resolveApprovers: getGoogleChatApprovalApprovers,
>>>>>>> upstream/main
  normalizeSenderId: (value) => normalizeGoogleChatApproverId(value),
});
