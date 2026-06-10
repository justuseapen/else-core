<<<<<<< HEAD
=======
// Feishu plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
<<<<<<< HEAD
=======
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import { resolveFeishuAccount } from "./accounts.js";
import { normalizeFeishuTarget } from "./targets.js";

function normalizeFeishuApproverId(value: string | number): string | undefined {
  const normalized = normalizeFeishuTarget(String(value));
<<<<<<< HEAD
  const trimmed = normalized?.trim().toLowerCase();
=======
  const trimmed = normalizeOptionalLowercaseString(normalized);
>>>>>>> upstream/main
  return trimmed?.startsWith("ou_") ? trimmed : undefined;
}

export const feishuApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Feishu",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveFeishuAccount({ cfg, accountId }).config;
    return resolveApprovalApprovers({
      allowFrom: account.allowFrom,
      normalizeApprover: normalizeFeishuApproverId,
    });
  },
  normalizeSenderId: (value) => normalizeFeishuApproverId(value),
});
