<<<<<<< HEAD
=======
// Whatsapp plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
import { resolveWhatsAppAccount } from "./accounts.js";
import { normalizeWhatsAppTarget } from "./normalize.js";

<<<<<<< HEAD
function normalizeWhatsAppApproverId(value: string | number): string | undefined {
=======
type ApprovalKind = "exec" | "plugin";

export function normalizeWhatsAppApproverId(value: string | number): string | undefined {
>>>>>>> upstream/main
  const normalized = normalizeWhatsAppTarget(String(value));
  if (!normalized || normalized.endsWith("@g.us")) {
    return undefined;
  }
  return normalized;
}

<<<<<<< HEAD
export const whatsappApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "WhatsApp",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveWhatsAppAccount({ cfg, accountId });
    return resolveApprovalApprovers({
      allowFrom: account.allowFrom,
      defaultTo: account.defaultTo,
      normalizeApprover: normalizeWhatsAppApproverId,
    });
  },
  normalizeSenderId: (value) => normalizeWhatsAppApproverId(value),
});
=======
function normalizeWhatsAppApproverEntry(value: string | number): string | undefined {
  return String(value).trim() === "*" ? "*" : normalizeWhatsAppApproverId(value);
}

export function getWhatsAppApprovalApprovers(params: {
  cfg: Parameters<typeof resolveWhatsAppAccount>[0]["cfg"];
  accountId?: string | null;
}): string[] {
  const account = resolveWhatsAppAccount({ cfg: params.cfg, accountId: params.accountId });
  return resolveApprovalApprovers({
    allowFrom: account.allowFrom,
    normalizeApprover: normalizeWhatsAppApproverEntry,
  });
}

const whatsappResolvedApproverAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "WhatsApp",
  resolveApprovers: ({ cfg, accountId }) => getWhatsAppApprovalApprovers({ cfg, accountId }),
  normalizeSenderId: (value) => normalizeWhatsAppApproverId(value),
});

export const whatsappApprovalAuth = {
  authorizeActorAction({
    cfg,
    accountId,
    senderId,
    approvalKind,
  }: {
    cfg: Parameters<typeof resolveWhatsAppAccount>[0]["cfg"];
    accountId?: string | null;
    senderId?: string | null;
    action: "approve";
    approvalKind: ApprovalKind;
  }) {
    if (getWhatsAppApprovalApprovers({ cfg, accountId }).includes("*")) {
      return { authorized: true } as const;
    }
    return whatsappResolvedApproverAuth.authorizeActorAction({
      cfg,
      accountId,
      senderId,
      action: "approve",
      approvalKind,
    });
  },
};
>>>>>>> upstream/main
