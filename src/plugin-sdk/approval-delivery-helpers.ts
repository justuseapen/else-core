<<<<<<< HEAD
=======
// Approval delivery helpers format approval prompts and results for channel plugins.
>>>>>>> upstream/main
import type { ExecApprovalRequest } from "../infra/exec-approvals.js";
import type { PluginApprovalRequest } from "../infra/plugin-approvals.js";
import type { ChannelApprovalCapability } from "./channel-contract.js";
import type { OpenClawConfig } from "./config-runtime.js";
import { normalizeMessageChannel } from "./routing.js";

type ApprovalKind = "exec" | "plugin";
type NativeApprovalDeliveryMode = "dm" | "channel" | "both";
type NativeApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type NativeApprovalTarget = { to: string; threadId?: string | number | null };
type NativeApprovalSurface = "origin" | "approver-dm";
<<<<<<< HEAD

type ApprovalAdapterParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
=======
type ChannelApprovalCapabilitySurfaces = Pick<
  ChannelApprovalCapability,
  "delivery" | "nativeRuntime" | "render" | "native"
>;

type ApprovalAdapterParams = {
  /** Full config used to inspect channel approval settings. */
  cfg: OpenClawConfig;
  /** Optional channel account id for account-scoped approval settings. */
  accountId?: string | null;
  /** Actor attempting the approval action. */
>>>>>>> upstream/main
  senderId?: string | null;
};

type DeliverySuppressionParams = {
<<<<<<< HEAD
  cfg: OpenClawConfig;
  approvalKind: ApprovalKind;
  target: { channel: string; accountId?: string | null };
=======
  /** Full config used to inspect native approval delivery settings. */
  cfg: OpenClawConfig;
  /** Approval kind being delivered. */
  approvalKind: ApprovalKind;
  /** Forwarding fallback target under consideration. */
  target: { channel: string; accountId?: string | null };
  /** Approval request metadata, including original turn source when available. */
>>>>>>> upstream/main
  request: { request: { turnSourceChannel?: string | null; turnSourceAccountId?: string | null } };
};

type ApproverRestrictedNativeApprovalParams = {
<<<<<<< HEAD
  channel: string;
  channelLabel: string;
  listAccountIds: (cfg: OpenClawConfig) => string[];
  hasApprovers: (params: ApprovalAdapterParams) => boolean;
  isExecAuthorizedSender: (params: ApprovalAdapterParams) => boolean;
  isPluginAuthorizedSender?: (params: ApprovalAdapterParams) => boolean;
  isNativeDeliveryEnabled: (params: { cfg: OpenClawConfig; accountId?: string | null }) => boolean;
=======
  /** Channel id that owns this native approval capability. */
  channel: string;
  /** Human-readable channel label used in denial messages. */
  channelLabel: string;
  /** Lists configured account ids so DM-route availability can scan every account. */
  listAccountIds: (cfg: OpenClawConfig) => string[];
  /** Whether an account has approvers configured. */
  hasApprovers: (params: ApprovalAdapterParams) => boolean;
  /** Whether a sender can approve exec approvals for this account. */
  isExecAuthorizedSender: (params: ApprovalAdapterParams) => boolean;
  /** Optional plugin approval authorization hook; defaults to exec authorization. */
  isPluginAuthorizedSender?: (params: ApprovalAdapterParams) => boolean;
  /** Whether native approval delivery is enabled for an account. */
  isNativeDeliveryEnabled: (params: { cfg: OpenClawConfig; accountId?: string | null }) => boolean;
  /** Native delivery target preference for an account. */
>>>>>>> upstream/main
  resolveNativeDeliveryMode: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => NativeApprovalDeliveryMode;
<<<<<<< HEAD
  requireMatchingTurnSourceChannel?: boolean;
  resolveSuppressionAccountId?: (params: DeliverySuppressionParams) => string | undefined;
=======
  /** Requires the approval request's original turn channel to match this channel before suppression. */
  requireMatchingTurnSourceChannel?: boolean;
  /** Optional account id resolver used when deciding forwarding-fallback suppression. */
  resolveSuppressionAccountId?: (params: DeliverySuppressionParams) => string | undefined;
  /** Resolves the original channel target for native approval delivery. */
>>>>>>> upstream/main
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ApprovalKind;
    request: NativeApprovalRequest;
  }) => NativeApprovalTarget | null | Promise<NativeApprovalTarget | null>;
<<<<<<< HEAD
=======
  /** Resolves approver DM targets for native approval delivery. */
>>>>>>> upstream/main
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ApprovalKind;
    request: NativeApprovalRequest;
  }) => NativeApprovalTarget[] | Promise<NativeApprovalTarget[]>;
<<<<<<< HEAD
  notifyOriginWhenDmOnly?: boolean;
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
};

=======
  /** Whether DM-only native delivery should also notify the origin channel. */
  notifyOriginWhenDmOnly?: boolean;
  /** Native runtime hooks used by channel-specific delivery implementations. */
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"];
  /** Optional setup description helper shown when exec approvals are unavailable. */
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
};

/** Build the canonical approval capability for channels that restrict approvals to configured approvers. */
>>>>>>> upstream/main
function buildApproverRestrictedNativeApprovalCapability(
  params: ApproverRestrictedNativeApprovalParams,
): ChannelApprovalCapability {
  const pluginSenderAuth = params.isPluginAuthorizedSender ?? params.isExecAuthorizedSender;
<<<<<<< HEAD
=======
  const availabilityState = (enabled: boolean) =>
    enabled ? ({ kind: "enabled" } as const) : ({ kind: "disabled" } as const);
>>>>>>> upstream/main
  const normalizePreferredSurface = (
    mode: NativeApprovalDeliveryMode,
  ): NativeApprovalSurface | "both" =>
    mode === "channel" ? "origin" : mode === "dm" ? "approver-dm" : "both";
<<<<<<< HEAD
=======
  const hasConfiguredApprovers = ({
    cfg,
    accountId,
  }: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => params.hasApprovers({ cfg, accountId });
  const isExecInitiatingSurfaceEnabled = ({
    cfg,
    accountId,
  }: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) =>
    hasConfiguredApprovers({ cfg, accountId }) &&
    params.isNativeDeliveryEnabled({ cfg, accountId });
  const resolveExecInitiatingSurfaceState = ({
    cfg,
    accountId,
  }: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
  }) => availabilityState(isExecInitiatingSurfaceEnabled({ cfg, accountId }));
>>>>>>> upstream/main

  return createChannelApprovalCapability({
    authorizeActorAction: ({
      cfg,
      accountId,
      senderId,
      approvalKind,
    }: {
      cfg: OpenClawConfig;
      accountId?: string | null;
      senderId?: string | null;
      action: "approve";
      approvalKind: ApprovalKind;
    }) => {
      const authorized =
        approvalKind === "plugin"
          ? pluginSenderAuth({ cfg, accountId, senderId })
          : params.isExecAuthorizedSender({ cfg, accountId, senderId });
      return authorized
        ? { authorized: true }
        : {
            authorized: false,
            reason: `❌ You are not authorized to approve ${approvalKind} requests on ${params.channelLabel}.`,
          };
    },
    getActionAvailabilityState: ({
      cfg,
      accountId,
    }: {
      cfg: OpenClawConfig;
      accountId?: string | null;
      action: "approve";
<<<<<<< HEAD
    }) =>
      params.hasApprovers({ cfg, accountId })
        ? ({ kind: "enabled" } as const)
        : ({ kind: "disabled" } as const),
    describeExecApprovalSetup: params.describeExecApprovalSetup,
    approvals: {
      delivery: {
        hasConfiguredDmRoute: ({ cfg }: { cfg: OpenClawConfig }) =>
          params.listAccountIds(cfg).some((accountId) => {
            if (!params.hasApprovers({ cfg, accountId })) {
              return false;
            }
            if (!params.isNativeDeliveryEnabled({ cfg, accountId })) {
              return false;
            }
            const target = params.resolveNativeDeliveryMode({ cfg, accountId });
            return target === "dm" || target === "both";
          }),
        shouldSuppressForwardingFallback: (input: DeliverySuppressionParams) => {
          const channel = normalizeMessageChannel(input.target.channel) ?? input.target.channel;
          if (channel !== params.channel) {
            return false;
          }
          if (params.requireMatchingTurnSourceChannel) {
            const turnSourceChannel = normalizeMessageChannel(
              input.request.request.turnSourceChannel,
            );
            if (turnSourceChannel !== params.channel) {
              return false;
            }
          }
          const resolvedAccountId = params.resolveSuppressionAccountId?.(input);
          const accountId =
            (resolvedAccountId === undefined
              ? input.target.accountId?.trim()
              : resolvedAccountId.trim()) || undefined;
          return params.isNativeDeliveryEnabled({ cfg: input.cfg, accountId });
        },
      },
      native:
        params.resolveOriginTarget || params.resolveApproverDmTargets
          ? {
              describeDeliveryCapabilities: ({
                cfg,
                accountId,
              }: {
                cfg: OpenClawConfig;
                accountId?: string | null;
                approvalKind: ApprovalKind;
                request: NativeApprovalRequest;
              }) => ({
                enabled:
                  params.hasApprovers({ cfg, accountId }) &&
                  params.isNativeDeliveryEnabled({ cfg, accountId }),
                preferredSurface: normalizePreferredSurface(
                  params.resolveNativeDeliveryMode({ cfg, accountId }),
                ),
                supportsOriginSurface: Boolean(params.resolveOriginTarget),
                supportsApproverDmSurface: Boolean(params.resolveApproverDmTargets),
                notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? false,
              }),
              resolveOriginTarget: params.resolveOriginTarget,
              resolveApproverDmTargets: params.resolveApproverDmTargets,
            }
          : undefined,
    },
  });
}

=======
    }) => availabilityState(hasConfiguredApprovers({ cfg, accountId })),
    getExecInitiatingSurfaceState: resolveExecInitiatingSurfaceState,
    describeExecApprovalSetup: params.describeExecApprovalSetup,
    delivery: {
      hasConfiguredDmRoute: ({ cfg }: { cfg: OpenClawConfig }) =>
        params.listAccountIds(cfg).some((accountId) => {
          if (!hasConfiguredApprovers({ cfg, accountId })) {
            return false;
          }
          if (!params.isNativeDeliveryEnabled({ cfg, accountId })) {
            return false;
          }
          const target = params.resolveNativeDeliveryMode({ cfg, accountId });
          return target === "dm" || target === "both";
        }),
      shouldSuppressForwardingFallback: (input: DeliverySuppressionParams) => {
        const channel = normalizeMessageChannel(input.target.channel) ?? input.target.channel;
        if (channel !== params.channel) {
          return false;
        }
        if (params.requireMatchingTurnSourceChannel) {
          const turnSourceChannel = normalizeMessageChannel(
            input.request.request.turnSourceChannel,
          );
          if (turnSourceChannel !== params.channel) {
            return false;
          }
        }
        const resolvedAccountId = params.resolveSuppressionAccountId?.(input);
        const accountId =
          (resolvedAccountId === undefined
            ? input.target.accountId?.trim()
            : resolvedAccountId.trim()) || undefined;
        // Suppress generic forwarding only when this channel's native route can
        // handle the same account; otherwise the fallback is the only delivery path.
        return params.isNativeDeliveryEnabled({ cfg: input.cfg, accountId });
      },
    },
    native:
      params.resolveOriginTarget || params.resolveApproverDmTargets
        ? {
            describeDeliveryCapabilities: ({
              cfg,
              accountId,
            }: {
              cfg: OpenClawConfig;
              accountId?: string | null;
              approvalKind: ApprovalKind;
              request: NativeApprovalRequest;
            }) => ({
              enabled: isExecInitiatingSurfaceEnabled({ cfg, accountId }),
              preferredSurface: normalizePreferredSurface(
                params.resolveNativeDeliveryMode({ cfg, accountId }),
              ),
              supportsOriginSurface: Boolean(params.resolveOriginTarget),
              supportsApproverDmSurface: Boolean(params.resolveApproverDmTargets),
              notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? false,
            }),
            resolveOriginTarget: params.resolveOriginTarget,
            resolveApproverDmTargets: params.resolveApproverDmTargets,
          }
        : undefined,
    nativeRuntime: params.nativeRuntime,
  });
}

/** Build the legacy split approval adapter shape for approver-restricted native channels. */
>>>>>>> upstream/main
export function createApproverRestrictedNativeApprovalAdapter(
  params: ApproverRestrictedNativeApprovalParams,
) {
  return splitChannelApprovalCapability(buildApproverRestrictedNativeApprovalCapability(params));
}

<<<<<<< HEAD
export function createChannelApprovalCapability(params: {
  authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
  getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
  resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
  approvals?: Pick<ChannelApprovalCapability, "delivery" | "render" | "native">;
}): ChannelApprovalCapability {
  return {
    authorizeActorAction: params.authorizeActorAction,
    getActionAvailabilityState: params.getActionAvailabilityState,
    resolveApproveCommandBehavior: params.resolveApproveCommandBehavior,
    describeExecApprovalSetup: params.describeExecApprovalSetup,
    delivery: params.approvals?.delivery,
    render: params.approvals?.render,
    native: params.approvals?.native,
  };
}

=======
/** Assemble a channel approval capability from its auth, delivery, render, and native surfaces. */
export function createChannelApprovalCapability(params: {
  /** Authorizes actors attempting approval actions. */
  authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
  /** Reports whether approval actions are generally available. */
  getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
  /** Reports whether exec approvals can start from the initiating surface. */
  getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
  /** Optional command behavior override for approval replies. */
  resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  /** Optional setup copy for unavailable exec approval paths. */
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
  /** Delivery fallback and DM-route helpers. */
  delivery?: ChannelApprovalCapability["delivery"];
  /** Native runtime hooks for channel-specific approval delivery. */
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"];
  /** Render hooks for pending/resolved approval payloads. */
  render?: ChannelApprovalCapability["render"];
  /** Native target/capability discovery hooks. */
  native?: ChannelApprovalCapability["native"];
  /** @deprecated Pass delivery/nativeRuntime/render/native directly. */
  approvals?: Partial<ChannelApprovalCapabilitySurfaces>;
}): ChannelApprovalCapability {
  // Keep the approvals alias for shipped plugin-sdk callers; registry tests track
  // this compatibility marker until the public deprecation window closes.
  const surfaces: ChannelApprovalCapabilitySurfaces = {
    delivery: params.delivery ?? params.approvals?.delivery,
    nativeRuntime: params.nativeRuntime ?? params.approvals?.nativeRuntime,
    render: params.render ?? params.approvals?.render,
    native: params.native ?? params.approvals?.native,
  };
  return {
    authorizeActorAction: params.authorizeActorAction,
    getActionAvailabilityState: params.getActionAvailabilityState,
    getExecInitiatingSurfaceState: params.getExecInitiatingSurfaceState,
    resolveApproveCommandBehavior: params.resolveApproveCommandBehavior,
    describeExecApprovalSetup: params.describeExecApprovalSetup,
    delivery: surfaces.delivery,
    nativeRuntime: surfaces.nativeRuntime,
    render: surfaces.render,
    native: surfaces.native,
  };
}

/** Split the canonical approval capability into the adapter shape older channel loaders consume. */
>>>>>>> upstream/main
export function splitChannelApprovalCapability(capability: ChannelApprovalCapability): {
  auth: {
    authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
    getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
<<<<<<< HEAD
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
=======
    getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
  nativeRuntime: ChannelApprovalCapability["nativeRuntime"];
>>>>>>> upstream/main
  render: ChannelApprovalCapability["render"];
  native: ChannelApprovalCapability["native"];
  describeExecApprovalSetup: ChannelApprovalCapability["describeExecApprovalSetup"];
} {
  return {
    auth: {
      authorizeActorAction: capability.authorizeActorAction,
      getActionAvailabilityState: capability.getActionAvailabilityState,
<<<<<<< HEAD
      resolveApproveCommandBehavior: capability.resolveApproveCommandBehavior,
    },
    delivery: capability.delivery,
=======
      getExecInitiatingSurfaceState: capability.getExecInitiatingSurfaceState,
      resolveApproveCommandBehavior: capability.resolveApproveCommandBehavior,
    },
    delivery: capability.delivery,
    nativeRuntime: capability.nativeRuntime,
>>>>>>> upstream/main
    render: capability.render,
    native: capability.native,
    describeExecApprovalSetup: capability.describeExecApprovalSetup,
  };
}

<<<<<<< HEAD
=======
/** Build the canonical approval capability for approver-restricted native delivery channels. */
>>>>>>> upstream/main
export function createApproverRestrictedNativeApprovalCapability(
  params: ApproverRestrictedNativeApprovalParams,
): ChannelApprovalCapability {
  return buildApproverRestrictedNativeApprovalCapability(params);
}
