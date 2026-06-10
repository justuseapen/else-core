<<<<<<< HEAD
=======
// Matrix plugin module implements approval native behavior.
>>>>>>> upstream/main
import {
  createChannelApprovalCapability,
  createApproverRestrictedNativeApprovalCapability,
  splitChannelApprovalCapability,
} from "openclaw/plugin-sdk/approval-delivery-runtime";
<<<<<<< HEAD
import {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
} from "openclaw/plugin-sdk/approval-native-runtime";
import type { ExecApprovalRequest, PluginApprovalRequest } from "openclaw/plugin-sdk/infra-runtime";
import { getMatrixApprovalAuthApprovers, matrixApprovalAuth } from "./approval-auth.js";
import {
  getMatrixExecApprovalApprovers,
  isMatrixExecApprovalAuthorizedSender,
  isMatrixExecApprovalClientEnabled,
  resolveMatrixExecApprovalTarget,
  shouldHandleMatrixExecApprovalRequest,
=======
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import type { ChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
import {
  createChannelNativeOriginTargetResolver,
  resolveApprovalRequestSessionConversation,
} from "openclaw/plugin-sdk/approval-native-runtime";
import type {
  ExecApprovalRequest,
  PluginApprovalRequest,
} from "openclaw/plugin-sdk/approval-runtime";
import type { ChannelApprovalCapability } from "openclaw/plugin-sdk/channel-contract";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalStringifiedId,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import { getMatrixApprovalAuthApprovers, matrixApprovalAuth } from "./approval-auth.js";
import { normalizeMatrixApproverId } from "./approval-ids.js";
import {
  getMatrixApprovalApprovers,
  getMatrixExecApprovalApprovers,
  isMatrixAnyApprovalClientEnabled,
  isMatrixApprovalClientEnabled,
  isMatrixExecApprovalClientEnabled,
  isMatrixExecApprovalAuthorizedSender,
  resolveMatrixExecApprovalTarget,
  shouldHandleMatrixApprovalRequest,
>>>>>>> upstream/main
} from "./exec-approvals.js";
import { listMatrixAccountIds } from "./matrix/accounts.js";
import { normalizeMatrixUserId } from "./matrix/monitor/allowlist.js";
import { resolveMatrixTargetIdentity } from "./matrix/target-ids.js";
import type { CoreConfig } from "./types.js";

type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
<<<<<<< HEAD
type MatrixOriginTarget = { to: string; threadId?: string };
const MATRIX_PLUGIN_NATIVE_DELIVERY_DISABLED = {
  enabled: false,
  preferredSurface: "approver-dm" as const,
  supportsOriginSurface: false,
  supportsApproverDmSurface: false,
  notifyOriginWhenDmOnly: false,
};
=======
type ApprovalKind = "exec" | "plugin";
type MatrixOriginTarget = { to: string; threadId?: string };
>>>>>>> upstream/main

function normalizeComparableTarget(value: string): string {
  const target = resolveMatrixTargetIdentity(value);
  if (!target) {
<<<<<<< HEAD
    return value.trim().toLowerCase();
=======
    return normalizeLowercaseStringOrEmpty(value);
>>>>>>> upstream/main
  }
  if (target.kind === "user") {
    return `user:${normalizeMatrixUserId(target.id)}`;
  }
<<<<<<< HEAD
  return `${target.kind.toLowerCase()}:${target.id}`;
=======
  return `${normalizeLowercaseStringOrEmpty(target.kind)}:${target.id}`;
>>>>>>> upstream/main
}

function resolveMatrixNativeTarget(raw: string): string | null {
  const target = resolveMatrixTargetIdentity(raw);
  if (!target) {
    return null;
  }
  return target.kind === "user" ? `user:${target.id}` : `room:${target.id}`;
}

<<<<<<< HEAD
function normalizeThreadId(value?: string | number | null): string | undefined {
  const trimmed = value == null ? "" : String(value).trim();
  return trimmed || undefined;
}

function resolveTurnSourceMatrixOriginTarget(request: ApprovalRequest): MatrixOriginTarget | null {
  const turnSourceChannel = request.request.turnSourceChannel?.trim().toLowerCase() || "";
=======
function resolveTurnSourceMatrixOriginTarget(request: ApprovalRequest): MatrixOriginTarget | null {
  const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
>>>>>>> upstream/main
  const turnSourceTo = request.request.turnSourceTo?.trim() || "";
  const target = resolveMatrixNativeTarget(turnSourceTo);
  if (turnSourceChannel !== "matrix" || !target) {
    return null;
  }
  return {
    to: target,
<<<<<<< HEAD
    threadId: normalizeThreadId(request.request.turnSourceThreadId),
=======
    threadId: normalizeOptionalStringifiedId(request.request.turnSourceThreadId),
>>>>>>> upstream/main
  };
}

function resolveSessionMatrixOriginTarget(sessionTarget: {
  to: string;
  threadId?: string | number | null;
}): MatrixOriginTarget | null {
  const target = resolveMatrixNativeTarget(sessionTarget.to);
  if (!target) {
    return null;
  }
  return {
    to: target,
<<<<<<< HEAD
    threadId: normalizeThreadId(sessionTarget.threadId),
  };
}

function matrixTargetsMatch(a: MatrixOriginTarget, b: MatrixOriginTarget): boolean {
  return (
    normalizeComparableTarget(a.to) === normalizeComparableTarget(b.to) &&
    (a.threadId ?? "") === (b.threadId ?? "")
  );
=======
    threadId: normalizeOptionalStringifiedId(sessionTarget.threadId),
  };
}

function normalizeMatrixOriginTarget(target: MatrixOriginTarget): MatrixOriginTarget {
  return {
    ...target,
    to: normalizeComparableTarget(target.to),
  };
>>>>>>> upstream/main
}

function hasMatrixPluginApprovers(params: { cfg: CoreConfig; accountId?: string | null }): boolean {
  return getMatrixApprovalAuthApprovers(params).length > 0;
}

<<<<<<< HEAD
const resolveMatrixOriginTarget = createChannelNativeOriginTargetResolver({
  channel: "matrix",
  shouldHandleRequest: ({ cfg, accountId, request }) =>
    shouldHandleMatrixExecApprovalRequest({
=======
function availabilityState(enabled: boolean) {
  return enabled ? ({ kind: "enabled" } as const) : ({ kind: "disabled" } as const);
}

function hasMatrixApprovalApprovers(params: {
  cfg: CoreConfig;
  accountId?: string | null;
  approvalKind: ApprovalKind;
}): boolean {
  return (
    getMatrixApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    }).length > 0
  );
}

function hasAnyMatrixApprovalApprovers(params: {
  cfg: CoreConfig;
  accountId?: string | null;
}): boolean {
  return (
    getMatrixExecApprovalApprovers(params).length > 0 ||
    getMatrixApprovalAuthApprovers(params).length > 0
  );
}

function isMatrixPluginAuthorizedSender(params: {
  cfg: CoreConfig;
  accountId?: string | null;
  senderId?: string | null;
}): boolean {
  const normalizedSenderId = params.senderId
    ? normalizeMatrixApproverId(params.senderId)
    : undefined;
  if (!normalizedSenderId) {
    return false;
  }
  return getMatrixApprovalAuthApprovers(params).includes(normalizedSenderId);
}

function resolveSuppressionAccountId(params: {
  target: { accountId?: string | null };
  request: { request: { turnSourceAccountId?: string | null } };
}): string | undefined {
  return (
    params.target.accountId?.trim() ||
    params.request.request.turnSourceAccountId?.trim() ||
    undefined
  );
}

const resolveMatrixOriginTarget = createChannelNativeOriginTargetResolver({
  channel: "matrix",
  shouldHandleRequest: ({ cfg, accountId, request }) =>
    shouldHandleMatrixApprovalRequest({
>>>>>>> upstream/main
      cfg,
      accountId,
      request,
    }),
  resolveTurnSourceTarget: resolveTurnSourceMatrixOriginTarget,
  resolveSessionTarget: resolveSessionMatrixOriginTarget,
<<<<<<< HEAD
  targetsMatch: matrixTargetsMatch,
});

const resolveMatrixApproverDmTargets = createChannelApproverDmTargetResolver({
  shouldHandleRequest: ({ cfg, accountId, request }) =>
    shouldHandleMatrixExecApprovalRequest({
      cfg,
      accountId,
      request,
    }),
  resolveApprovers: getMatrixExecApprovalApprovers,
  mapApprover: (approver) => {
    const normalized = normalizeMatrixUserId(approver);
    return normalized ? { to: `user:${normalized}` } : null;
  },
});

const matrixNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
  channel: "matrix",
  channelLabel: "Matrix",
  describeExecApprovalSetup: ({ accountId }) => {
=======
  normalizeTargetForMatch: normalizeMatrixOriginTarget,
  resolveFallbackTarget: (request) => {
    const sessionConversation = resolveApprovalRequestSessionConversation({
      request,
      channel: "matrix",
    });
    if (!sessionConversation) {
      return null;
    }
    const target = resolveMatrixNativeTarget(sessionConversation.id);
    if (!target) {
      return null;
    }
    return {
      to: target,
      threadId: normalizeOptionalStringifiedId(sessionConversation.threadId),
    };
  },
});

function resolveMatrixApproverDmTargets(params: {
  cfg: CoreConfig;
  accountId?: string | null;
  approvalKind: ApprovalKind;
  request: ApprovalRequest;
}): { to: string }[] {
  if (!shouldHandleMatrixApprovalRequest(params)) {
    return [];
  }
  return getMatrixApprovalApprovers(params)
    .map((approver) => {
      const normalized = normalizeMatrixUserId(approver);
      return normalized ? { to: `user:${normalized}` } : null;
    })
    .filter((target): target is { to: string } => target !== null);
}

const matrixNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
  channel: "matrix",
  channelLabel: "Matrix",
  describeExecApprovalSetup: ({
    accountId,
  }: Parameters<NonNullable<ChannelApprovalCapability["describeExecApprovalSetup"]>>[0]) => {
>>>>>>> upstream/main
    const prefix =
      accountId && accountId !== "default"
        ? `channels.matrix.accounts.${accountId}`
        : "channels.matrix";
    return `Approve it from the Web UI or terminal UI for now. Matrix supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`${prefix}.dm.allowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
  },
  listAccountIds: listMatrixAccountIds,
  hasApprovers: ({ cfg, accountId }) =>
<<<<<<< HEAD
    getMatrixExecApprovalApprovers({ cfg, accountId }).length > 0,
  isExecAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isMatrixExecApprovalAuthorizedSender({ cfg, accountId, senderId }),
=======
    hasAnyMatrixApprovalApprovers({
      cfg: cfg as CoreConfig,
      accountId,
    }),
  isExecAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isMatrixExecApprovalAuthorizedSender({ cfg, accountId, senderId }),
  isPluginAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isMatrixPluginAuthorizedSender({
      cfg: cfg as CoreConfig,
      accountId,
      senderId,
    }),
>>>>>>> upstream/main
  isNativeDeliveryEnabled: ({ cfg, accountId }) =>
    isMatrixExecApprovalClientEnabled({ cfg, accountId }),
  resolveNativeDeliveryMode: ({ cfg, accountId }) =>
    resolveMatrixExecApprovalTarget({ cfg, accountId }),
  requireMatchingTurnSourceChannel: true,
<<<<<<< HEAD
  resolveSuppressionAccountId: ({ target, request }) =>
    target.accountId?.trim() || request.request.turnSourceAccountId?.trim() || undefined,
  resolveOriginTarget: resolveMatrixOriginTarget,
  resolveApproverDmTargets: resolveMatrixApproverDmTargets,
=======
  resolveSuppressionAccountId,
  resolveOriginTarget: resolveMatrixOriginTarget,
  resolveApproverDmTargets: resolveMatrixApproverDmTargets,
  notifyOriginWhenDmOnly: true,
  nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
    eventKinds: ["exec", "plugin"],
    isConfigured: ({ cfg, accountId }) =>
      isMatrixAnyApprovalClientEnabled({
        cfg,
        accountId,
      }),
    shouldHandle: ({ cfg, accountId, request }) =>
      shouldHandleMatrixApprovalRequest({
        cfg,
        accountId,
        request,
      }),
    load: async () =>
      (await import("./approval-handler.runtime.js"))
        .matrixApprovalNativeRuntime as unknown as ChannelApprovalNativeRuntimeAdapter,
  }),
>>>>>>> upstream/main
});

const splitMatrixApprovalCapability = splitChannelApprovalCapability(
  matrixNativeApprovalCapability,
);
const matrixBaseNativeApprovalAdapter = splitMatrixApprovalCapability.native;
const matrixBaseDeliveryAdapter = splitMatrixApprovalCapability.delivery;
type MatrixForwardingSuppressionParams = Parameters<
  NonNullable<NonNullable<typeof matrixBaseDeliveryAdapter>["shouldSuppressForwardingFallback"]>
>[0];
const matrixDeliveryAdapter = matrixBaseDeliveryAdapter && {
  ...matrixBaseDeliveryAdapter,
<<<<<<< HEAD
  shouldSuppressForwardingFallback: (params: MatrixForwardingSuppressionParams) =>
    params.approvalKind === "plugin"
      ? false
      : (matrixBaseDeliveryAdapter.shouldSuppressForwardingFallback?.(params) ?? false),
};
const matrixExecOnlyNativeApprovalAdapter = matrixBaseNativeApprovalAdapter && {
  describeDeliveryCapabilities: (
    params: Parameters<typeof matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities>[0],
  ) =>
    params.approvalKind === "plugin"
      ? MATRIX_PLUGIN_NATIVE_DELIVERY_DISABLED
      : matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities(params),
  resolveOriginTarget: async (
    params: Parameters<NonNullable<typeof matrixBaseNativeApprovalAdapter.resolveOriginTarget>>[0],
  ) =>
    params.approvalKind === "plugin"
      ? null
      : ((await matrixBaseNativeApprovalAdapter.resolveOriginTarget?.(params)) ?? null),
  resolveApproverDmTargets: async (
    params: Parameters<
      NonNullable<typeof matrixBaseNativeApprovalAdapter.resolveApproverDmTargets>
    >[0],
  ) =>
    params.approvalKind === "plugin"
      ? []
      : ((await matrixBaseNativeApprovalAdapter.resolveApproverDmTargets?.(params)) ?? []),
};

export const matrixApprovalCapability = createChannelApprovalCapability({
  authorizeActorAction: (params) => {
=======
  shouldSuppressForwardingFallback: (params: MatrixForwardingSuppressionParams) => {
    const accountId = resolveSuppressionAccountId(params);
    if (
      !hasMatrixApprovalApprovers({
        cfg: params.cfg as CoreConfig,
        accountId,
        approvalKind: params.approvalKind,
      })
    ) {
      return false;
    }
    return matrixBaseDeliveryAdapter.shouldSuppressForwardingFallback?.(params) ?? false;
  },
};
const matrixNativeAdapter = matrixBaseNativeApprovalAdapter && {
  describeDeliveryCapabilities: (
    params: Parameters<typeof matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities>[0],
  ) => {
    const capabilities = matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities(params);
    const hasApprovers = hasMatrixApprovalApprovers({
      cfg: params.cfg as CoreConfig,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    });
    const clientEnabled = isMatrixApprovalClientEnabled({
      cfg: params.cfg,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    });
    return {
      ...capabilities,
      enabled: capabilities.enabled && hasApprovers && clientEnabled,
    };
  },
  resolveOriginTarget: matrixBaseNativeApprovalAdapter.resolveOriginTarget,
  resolveApproverDmTargets: matrixBaseNativeApprovalAdapter.resolveApproverDmTargets,
};

export const matrixApprovalCapability = createChannelApprovalCapability({
  authorizeActorAction: (
    params: Parameters<NonNullable<ChannelApprovalCapability["authorizeActorAction"]>>[0],
  ) => {
>>>>>>> upstream/main
    if (params.approvalKind !== "plugin") {
      return matrixNativeApprovalCapability.authorizeActorAction?.(params) ?? { authorized: true };
    }
    if (
      !hasMatrixPluginApprovers({
        cfg: params.cfg as CoreConfig,
        accountId: params.accountId,
      })
    ) {
      return {
        authorized: false,
        reason: "❌ Matrix plugin approvals are not enabled for this bot account.",
      } as const;
    }
    return matrixApprovalAuth.authorizeActorAction(params);
  },
<<<<<<< HEAD
  getActionAvailabilityState: (params) =>
    hasMatrixPluginApprovers({
      cfg: params.cfg as CoreConfig,
      accountId: params.accountId,
    })
      ? ({ kind: "enabled" } as const)
      : (matrixNativeApprovalCapability.getActionAvailabilityState?.(params) ??
        ({ kind: "disabled" } as const)),
  describeExecApprovalSetup: matrixNativeApprovalCapability.describeExecApprovalSetup,
  approvals: {
    delivery: matrixDeliveryAdapter,
    native: matrixExecOnlyNativeApprovalAdapter,
    render: matrixNativeApprovalCapability.render,
  },
});

export const matrixNativeApprovalAdapter = {
  auth: {
    authorizeActorAction: matrixApprovalCapability.authorizeActorAction,
    getActionAvailabilityState: matrixApprovalCapability.getActionAvailabilityState,
  },
  delivery: matrixDeliveryAdapter,
  render: matrixApprovalCapability.render,
  native: matrixExecOnlyNativeApprovalAdapter,
};
=======
  getActionAvailabilityState: (
    params: Parameters<NonNullable<ChannelApprovalCapability["getActionAvailabilityState"]>>[0],
  ) => {
    if (params.approvalKind === "plugin") {
      return availabilityState(
        hasMatrixPluginApprovers({
          cfg: params.cfg as CoreConfig,
          accountId: params.accountId,
        }),
      );
    }
    return (
      matrixNativeApprovalCapability.getActionAvailabilityState?.(params) ?? {
        kind: "disabled",
      }
    );
  },
  getExecInitiatingSurfaceState: (
    params: Parameters<NonNullable<ChannelApprovalCapability["getExecInitiatingSurfaceState"]>>[0],
  ) =>
    matrixNativeApprovalCapability.getExecInitiatingSurfaceState?.(params) ??
    ({ kind: "disabled" } as const),
  describeExecApprovalSetup: matrixNativeApprovalCapability.describeExecApprovalSetup,
  delivery: matrixDeliveryAdapter,
  nativeRuntime: matrixNativeApprovalCapability.nativeRuntime,
  native: matrixNativeAdapter,
  render: matrixNativeApprovalCapability.render,
});
>>>>>>> upstream/main
