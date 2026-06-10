<<<<<<< HEAD
=======
// Msteams plugin module implements approval auth behavior.
>>>>>>> upstream/main
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-auth-runtime";
<<<<<<< HEAD
=======
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import type { OpenClawConfig } from "../runtime-api.js";
import { normalizeMSTeamsMessagingTarget } from "./resolve-allowlist.js";

const MSTEAMS_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeMSTeamsApproverId(value: string | number): string | undefined {
  const normalized = normalizeMSTeamsMessagingTarget(String(value));
  if (!normalized?.startsWith("user:")) {
    return undefined;
  }
<<<<<<< HEAD
  const id = normalized.slice("user:".length).trim().toLowerCase();
=======
  const id = normalizeOptionalLowercaseString(normalized.slice("user:".length));
  if (!id) {
    return undefined;
  }
>>>>>>> upstream/main
  return MSTEAMS_ID_RE.test(id) ? id : undefined;
}

function resolveMSTeamsChannelConfig(cfg: OpenClawConfig) {
  return cfg.channels?.msteams;
}

export const msTeamsApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Microsoft Teams",
  resolveApprovers: ({ cfg }) => {
    const channel = resolveMSTeamsChannelConfig(cfg);
    return resolveApprovalApprovers({
      allowFrom: channel?.allowFrom,
      defaultTo: channel?.defaultTo,
      normalizeApprover: normalizeMSTeamsApproverId,
    });
  },
  normalizeSenderId: (value) => {
<<<<<<< HEAD
    const trimmed = value.trim().toLowerCase();
=======
    const trimmed = normalizeOptionalLowercaseString(value);
    if (!trimmed) {
      return undefined;
    }
>>>>>>> upstream/main
    return MSTEAMS_ID_RE.test(trimmed) ? trimmed : undefined;
  },
});
