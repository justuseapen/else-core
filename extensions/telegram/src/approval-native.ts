<<<<<<< HEAD
=======
// Telegram plugin module implements approval native behavior.
>>>>>>> upstream/main
import {
  createApproverRestrictedNativeApprovalCapability,
  splitChannelApprovalCapability,
} from "openclaw/plugin-sdk/approval-delivery-runtime";
<<<<<<< HEAD
=======
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import type { ChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
>>>>>>> upstream/main
import {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
} from "openclaw/plugin-sdk/approval-native-runtime";
<<<<<<< HEAD
import type { ChannelApprovalCapability } from "openclaw/plugin-sdk/channel-contract";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { ExecApprovalRequest, PluginApprovalRequest } from "openclaw/plugin-sdk/infra-runtime";
=======
import type {
  ExecApprovalRequest,
  PluginApprovalRequest,
} from "openclaw/plugin-sdk/approval-runtime";
import type { ChannelApprovalCapability } from "openclaw/plugin-sdk/channel-contract";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import { listTelegramAccountIds } from "./accounts.js";
import {
  getTelegramExecApprovalApprovers,
  isTelegramExecApprovalApprover,
  isTelegramExecApprovalAuthorizedSender,
  isTelegramExecApprovalClientEnabled,
  isTelegramExecApprovalTargetRecipient,
  resolveTelegramExecApprovalTarget,
  shouldHandleTelegramExecApprovalRequest,
} from "./exec-approvals.js";
<<<<<<< HEAD
=======
import { parseTelegramThreadId } from "./outbound-params.js";
>>>>>>> upstream/main
import { normalizeTelegramChatId, parseTelegramTarget } from "./targets.js";

type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type TelegramOriginTarget = { to: string; threadId?: number };

function resolveTurnSourceTelegramOriginTarget(
  request: ApprovalRequest,
): TelegramOriginTarget | null {
<<<<<<< HEAD
  const turnSourceChannel = request.request.turnSourceChannel?.trim().toLowerCase() || "";
  const rawTurnSourceTo = request.request.turnSourceTo?.trim() || "";
=======
  const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
  const rawTurnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
>>>>>>> upstream/main
  const parsedTurnSourceTarget = rawTurnSourceTo ? parseTelegramTarget(rawTurnSourceTo) : null;
  const turnSourceTo = normalizeTelegramChatId(parsedTurnSourceTarget?.chatId ?? rawTurnSourceTo);
  if (turnSourceChannel !== "telegram" || !turnSourceTo) {
    return null;
  }
  const rawThreadId =
    request.request.turnSourceThreadId ?? parsedTurnSourceTarget?.messageThreadId ?? undefined;
<<<<<<< HEAD
  const threadId =
    typeof rawThreadId === "number"
      ? rawThreadId
      : typeof rawThreadId === "string"
        ? Number.parseInt(rawThreadId, 10)
        : undefined;
  return {
    to: turnSourceTo,
    threadId: Number.isFinite(threadId) ? threadId : undefined,
=======
  return {
    to: turnSourceTo,
    threadId: parseTelegramThreadId(rawThreadId),
>>>>>>> upstream/main
  };
}

function resolveSessionTelegramOriginTarget(sessionTarget: {
  to: string;
<<<<<<< HEAD
  threadId?: number | null;
}): TelegramOriginTarget {
  return {
    to: normalizeTelegramChatId(sessionTarget.to) ?? sessionTarget.to,
    threadId: sessionTarget.threadId ?? undefined,
  };
}

function telegramTargetsMatch(a: TelegramOriginTarget, b: TelegramOriginTarget): boolean {
  const normalizedA = normalizeTelegramChatId(a.to) ?? a.to;
  const normalizedB = normalizeTelegramChatId(b.to) ?? b.to;
  return normalizedA === normalizedB && a.threadId === b.threadId;
}

=======
  threadId?: string | number | null;
}): TelegramOriginTarget {
  return {
    to: normalizeTelegramChatId(sessionTarget.to) ?? sessionTarget.to,
    threadId: parseTelegramThreadId(sessionTarget.threadId),
  };
}

>>>>>>> upstream/main
const resolveTelegramOriginTarget = createChannelNativeOriginTargetResolver({
  channel: "telegram",
  shouldHandleRequest: ({ cfg, accountId, request }) =>
    shouldHandleTelegramExecApprovalRequest({
      cfg,
      accountId,
      request,
    }),
  resolveTurnSourceTarget: resolveTurnSourceTelegramOriginTarget,
  resolveSessionTarget: resolveSessionTelegramOriginTarget,
<<<<<<< HEAD
  targetsMatch: telegramTargetsMatch,
=======
>>>>>>> upstream/main
});

const resolveTelegramApproverDmTargets = createChannelApproverDmTargetResolver({
  shouldHandleRequest: ({ cfg, accountId, request }) =>
    shouldHandleTelegramExecApprovalRequest({
      cfg,
      accountId,
      request,
    }),
  resolveApprovers: getTelegramExecApprovalApprovers,
  mapApprover: (approver) => ({ to: approver }),
});

const telegramNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
  channel: "telegram",
  channelLabel: "Telegram",
<<<<<<< HEAD
  describeExecApprovalSetup: ({ accountId }) => {
=======
  describeExecApprovalSetup: ({ accountId }: { accountId?: string | null }) => {
>>>>>>> upstream/main
    const prefix =
      accountId && accountId !== "default"
        ? `channels.telegram.accounts.${accountId}`
        : "channels.telegram";
<<<<<<< HEAD
    return `Approve it from the Web UI or terminal UI for now. Telegram supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\`; if you leave it unset, OpenClaw can infer numeric owner IDs from \`${prefix}.allowFrom\` or direct-message \`${prefix}.defaultTo\` when possible. Leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
=======
    return `Approve it from the Web UI or terminal UI for now. Telegram supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
>>>>>>> upstream/main
  },
  listAccountIds: listTelegramAccountIds,
  hasApprovers: ({ cfg, accountId }) =>
    getTelegramExecApprovalApprovers({ cfg, accountId }).length > 0,
  isExecAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isTelegramExecApprovalAuthorizedSender({ cfg, accountId, senderId }),
  isPluginAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isTelegramExecApprovalApprover({ cfg, accountId, senderId }),
  isNativeDeliveryEnabled: ({ cfg, accountId }) =>
    isTelegramExecApprovalClientEnabled({ cfg, accountId }),
  resolveNativeDeliveryMode: ({ cfg, accountId }) =>
    resolveTelegramExecApprovalTarget({ cfg, accountId }),
  requireMatchingTurnSourceChannel: true,
  resolveSuppressionAccountId: ({ target, request }) =>
<<<<<<< HEAD
    target.accountId?.trim() || request.request.turnSourceAccountId?.trim() || undefined,
  resolveOriginTarget: resolveTelegramOriginTarget,
  resolveApproverDmTargets: resolveTelegramApproverDmTargets,
=======
    normalizeOptionalString(target.accountId) ??
    normalizeOptionalString(request.request.turnSourceAccountId),
  resolveOriginTarget: resolveTelegramOriginTarget,
  resolveApproverDmTargets: resolveTelegramApproverDmTargets,
  notifyOriginWhenDmOnly: true,
  nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
    eventKinds: ["exec", "plugin"],
    isConfigured: ({ cfg, accountId }) =>
      isTelegramExecApprovalClientEnabled({
        cfg,
        accountId,
      }),
    shouldHandle: ({ cfg, accountId, request }) =>
      shouldHandleTelegramExecApprovalRequest({
        cfg,
        accountId,
        request,
      }),
    load: async () =>
      (await import("./approval-handler.runtime.js"))
        .telegramApprovalNativeRuntime as unknown as ChannelApprovalNativeRuntimeAdapter,
  }),
>>>>>>> upstream/main
});

const resolveTelegramApproveCommandBehavior: NonNullable<
  ChannelApprovalCapability["resolveApproveCommandBehavior"]
<<<<<<< HEAD
> = ({ cfg, accountId, senderId, approvalKind }) => {
=======
> = (
  params: Parameters<NonNullable<ChannelApprovalCapability["resolveApproveCommandBehavior"]>>[0],
) => {
  const { cfg, accountId, senderId, approvalKind } = params;
>>>>>>> upstream/main
  if (approvalKind !== "exec") {
    return undefined;
  }
  if (isTelegramExecApprovalClientEnabled({ cfg, accountId })) {
    return undefined;
  }
  if (isTelegramExecApprovalTargetRecipient({ cfg, accountId, senderId })) {
    return undefined;
  }
  if (
    isTelegramExecApprovalAuthorizedSender({ cfg, accountId, senderId }) &&
    !isTelegramExecApprovalApprover({ cfg, accountId, senderId })
  ) {
    return undefined;
  }
  return {
    kind: "reply",
    text: "❌ Telegram exec approvals are not enabled for this bot account.",
  };
};

export const telegramApprovalCapability: ChannelApprovalCapability = {
  ...telegramNativeApprovalCapability,
  resolveApproveCommandBehavior: resolveTelegramApproveCommandBehavior,
};

export const telegramNativeApprovalAdapter = splitChannelApprovalCapability(
  telegramApprovalCapability,
);
