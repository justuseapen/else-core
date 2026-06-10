<<<<<<< HEAD
=======
// Nextcloud Talk plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
<<<<<<< HEAD
=======
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import { resolveNextcloudTalkAccount } from "./accounts.js";
import type { CoreConfig } from "./types.js";

function normalizeNextcloudTalkApproverId(value: string | number): string | undefined {
<<<<<<< HEAD
  const normalized = String(value)
    .trim()
    .replace(/^(nextcloud-talk|nc-talk|nc):/i, "")
    .trim()
    .toLowerCase();
  return normalized || undefined;
=======
  return normalizeOptionalLowercaseString(
    String(value)
      .trim()
      .replace(/^(nextcloud-talk|nc-talk|nc):/i, ""),
  );
>>>>>>> upstream/main
}

export const nextcloudTalkApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Nextcloud Talk",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveNextcloudTalkAccount({ cfg: cfg as CoreConfig, accountId });
    return resolveApprovalApprovers({
      allowFrom: account.config.allowFrom,
      normalizeApprover: normalizeNextcloudTalkApproverId,
    });
  },
  normalizeSenderId: (value) => normalizeNextcloudTalkApproverId(value),
});
