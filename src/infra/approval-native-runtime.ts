<<<<<<< HEAD
import type {
  ChannelApprovalKind,
  ChannelApprovalNativeAdapter,
  ChannelApprovalNativeTarget,
} from "../channels/plugins/types.adapters.js";
import type { OpenClawConfig } from "../config/config.js";
import {
  resolveChannelNativeApprovalDeliveryPlan,
  type ChannelApprovalNativePlannedTarget,
} from "./approval-native-delivery.js";
=======
// Creates channel-native approval runtimes and delivery flows.
import type { ChannelApprovalNativeAdapter } from "../channels/plugins/approval-native.types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveChannelNativeApprovalDeliveryPlan,
  type ChannelApprovalNativePlannedTarget,
  type ChannelApprovalNativeDeliveryPlan,
} from "./approval-native-delivery.js";
import { createApprovalNativeRouteReporter } from "./approval-native-route-coordinator.js";
import type {
  ChannelNativeApprovalDeliveryCallbacks,
  ChannelNativeApprovalTransportSpec,
  PreparedChannelNativeApprovalTarget,
} from "./approval-native-runtime-types.js";
import type { ChannelApprovalKind } from "./approval-types.js";
>>>>>>> upstream/main
import {
  createExecApprovalChannelRuntime,
  type ExecApprovalChannelRuntime,
  type ExecApprovalChannelRuntimeAdapter,
} from "./exec-approval-channel-runtime.js";
<<<<<<< HEAD
=======
import type { ExecApprovalChannelRuntimeEventKind } from "./exec-approval-channel-runtime.types.js";
>>>>>>> upstream/main
import type { ExecApprovalResolved } from "./exec-approvals.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
import type { PluginApprovalResolved } from "./plugin-approvals.js";
import type { PluginApprovalRequest } from "./plugin-approvals.js";

type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;

<<<<<<< HEAD
export type PreparedChannelNativeApprovalTarget<TPreparedTarget> = {
  dedupeKey: string;
  target: TPreparedTarget;
};

function buildTargetKey(target: ChannelApprovalNativeTarget): string {
  return `${target.to}:${target.threadId == null ? "" : String(target.threadId)}`;
}

=======
export type { PreparedChannelNativeApprovalTarget } from "./approval-native-runtime-types.js";

type ChannelNativeApprovalPlanDeliveryResult<TPendingEntry> = {
  entries: TPendingEntry[];
  deliveryPlan: ChannelApprovalNativeDeliveryPlan;
  deliveredTargets: ChannelApprovalNativePlannedTarget[];
};

/** Delivers an approval request to the adapter-planned native targets and returns pending entries. */
>>>>>>> upstream/main
export async function deliverApprovalRequestViaChannelNativePlan<
  TPreparedTarget,
  TPendingEntry,
  TRequest extends ApprovalRequest = ApprovalRequest,
>(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  approvalKind: ChannelApprovalKind;
  request: TRequest;
  adapter?: ChannelApprovalNativeAdapter | null;
<<<<<<< HEAD
  sendOriginNotice?: (params: {
    originTarget: ChannelApprovalNativeTarget;
    request: TRequest;
  }) => Promise<void>;
=======
>>>>>>> upstream/main
  prepareTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
  }) =>
    | PreparedChannelNativeApprovalTarget<TPreparedTarget>
    | null
    | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: TRequest;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
<<<<<<< HEAD
  onOriginNoticeError?: (params: {
    error: unknown;
    originTarget: ChannelApprovalNativeTarget;
    request: TRequest;
  }) => void;
=======
>>>>>>> upstream/main
  onDeliveryError?: (params: {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
  }) => void;
  onDuplicateSkipped?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
  }) => void;
  onDelivered?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    entry: TPendingEntry;
  }) => void;
<<<<<<< HEAD
}): Promise<TPendingEntry[]> {
=======
}): Promise<ChannelNativeApprovalPlanDeliveryResult<TPendingEntry>> {
>>>>>>> upstream/main
  const deliveryPlan = await resolveChannelNativeApprovalDeliveryPlan({
    cfg: params.cfg,
    accountId: params.accountId,
    approvalKind: params.approvalKind,
    request: params.request,
    adapter: params.adapter,
  });

<<<<<<< HEAD
  const originTargetKey = deliveryPlan.originTarget
    ? buildTargetKey(deliveryPlan.originTarget)
    : null;
  const plannedTargetKeys = new Set(
    deliveryPlan.targets.map((plannedTarget) => buildTargetKey(plannedTarget.target)),
  );

  if (
    deliveryPlan.notifyOriginWhenDmOnly &&
    deliveryPlan.originTarget &&
    (originTargetKey == null || !plannedTargetKeys.has(originTargetKey))
  ) {
    try {
      await params.sendOriginNotice?.({
        originTarget: deliveryPlan.originTarget,
        request: params.request,
      });
    } catch (error) {
      params.onOriginNoticeError?.({
        error,
        originTarget: deliveryPlan.originTarget,
        request: params.request,
      });
    }
  }

  const deliveredKeys = new Set<string>();
  const pendingEntries: TPendingEntry[] = [];
=======
  const deliveredKeys = new Set<string>();
  const pendingEntries: TPendingEntry[] = [];
  const deliveredTargets: ChannelApprovalNativePlannedTarget[] = [];
>>>>>>> upstream/main
  for (const plannedTarget of deliveryPlan.targets) {
    try {
      const preparedTarget = await params.prepareTarget({
        plannedTarget,
        request: params.request,
      });
      if (!preparedTarget) {
        continue;
      }
<<<<<<< HEAD
=======
      // Dedupe after preparation because different surfaces can converge on the same message target.
>>>>>>> upstream/main
      if (deliveredKeys.has(preparedTarget.dedupeKey)) {
        params.onDuplicateSkipped?.({
          plannedTarget,
          preparedTarget,
          request: params.request,
        });
        continue;
      }

      const entry = await params.deliverTarget({
        plannedTarget,
        preparedTarget: preparedTarget.target,
        request: params.request,
      });
      if (!entry) {
        continue;
      }

      deliveredKeys.add(preparedTarget.dedupeKey);
      pendingEntries.push(entry);
<<<<<<< HEAD
=======
      deliveredTargets.push(plannedTarget);
>>>>>>> upstream/main
      params.onDelivered?.({
        plannedTarget,
        preparedTarget,
        request: params.request,
        entry,
      });
    } catch (error) {
      params.onDeliveryError?.({
        error,
        plannedTarget,
        request: params.request,
      });
    }
  }

<<<<<<< HEAD
  return pendingEntries;
=======
  return {
    entries: pendingEntries,
    deliveryPlan,
    deliveredTargets,
  };
>>>>>>> upstream/main
}

function defaultResolveApprovalKind(request: ApprovalRequest): ChannelApprovalKind {
  return request.id.startsWith("plugin:") ? "plugin" : "exec";
}

type ChannelNativeApprovalRuntimeAdapter<
  TPendingEntry,
  TPreparedTarget,
  TPendingContent,
  TRequest extends ApprovalRequest = ApprovalRequest,
  TResolved extends ApprovalResolved = ApprovalResolved,
> = Omit<
  ExecApprovalChannelRuntimeAdapter<TPendingEntry, TRequest, TResolved>,
  "deliverRequested"
<<<<<<< HEAD
> & {
  accountId?: string | null;
  nativeAdapter?: ChannelApprovalNativeAdapter | null;
  resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
  buildPendingContent: (params: {
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
  }) => TPendingContent | Promise<TPendingContent>;
  sendOriginNotice?: (params: {
    originTarget: ChannelApprovalNativeTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => Promise<void>;
  prepareTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) =>
    | PreparedChannelNativeApprovalTarget<TPreparedTarget>
    | null
    | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  onOriginNoticeError?: (params: {
    error: unknown;
    originTarget: ChannelApprovalNativeTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDeliveryError?: (params: {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDuplicateSkipped?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDelivered?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
    entry: TPendingEntry;
  }) => void;
};

=======
> &
  ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> &
  ChannelNativeApprovalDeliveryCallbacks<
    TPendingEntry,
    TPreparedTarget,
    TPendingContent,
    TRequest
  > & {
    channel?: string;
    channelLabel?: string;
    accountId?: string | null;
    nativeAdapter?: ChannelApprovalNativeAdapter | null;
    resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
    buildPendingContent: (params: {
      request: TRequest;
      approvalKind: ChannelApprovalKind;
      nowMs: number;
    }) => TPendingContent | Promise<TPendingContent>;
    onStopped?: () => Promise<void> | void;
  };

/** Creates the shared gateway approval runtime backed by channel-native delivery hooks. */
>>>>>>> upstream/main
export function createChannelNativeApprovalRuntime<
  TPendingEntry,
  TPreparedTarget,
  TPendingContent,
  TRequest extends ApprovalRequest = ApprovalRequest,
  TResolved extends ApprovalResolved = ApprovalResolved,
>(
  adapter: ChannelNativeApprovalRuntimeAdapter<
    TPendingEntry,
    TPreparedTarget,
    TPendingContent,
    TRequest,
    TResolved
  >,
): ExecApprovalChannelRuntime<TRequest, TResolved> {
  const nowMs = adapter.nowMs ?? Date.now;
  const resolveApprovalKind =
    adapter.resolveApprovalKind ?? ((request: TRequest) => defaultResolveApprovalKind(request));
<<<<<<< HEAD

  return createExecApprovalChannelRuntime<TPendingEntry, TRequest, TResolved>({
=======
  let runtimeRequest:
    | ((method: string, params: Record<string, unknown>) => Promise<unknown>)
    | null = null;
  const handledEventKinds = new Set<ExecApprovalChannelRuntimeEventKind>(
    adapter.eventKinds ?? ["exec"],
  );
  const routeReporter = createApprovalNativeRouteReporter({
    handledKinds: handledEventKinds,
    channel: adapter.channel,
    channelLabel: adapter.channelLabel,
    accountId: adapter.accountId,
    requestGateway: async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
      if (!runtimeRequest) {
        throw new Error(`${adapter.label}: gateway client not connected`);
      }
      return (await runtimeRequest(method, params)) as T;
    },
  });

  const runtime = createExecApprovalChannelRuntime<TPendingEntry, TRequest, TResolved>({
>>>>>>> upstream/main
    label: adapter.label,
    clientDisplayName: adapter.clientDisplayName,
    cfg: adapter.cfg,
    gatewayUrl: adapter.gatewayUrl,
    eventKinds: adapter.eventKinds,
    isConfigured: adapter.isConfigured,
<<<<<<< HEAD
    shouldHandle: adapter.shouldHandle,
    finalizeResolved: adapter.finalizeResolved,
    finalizeExpired: adapter.finalizeExpired,
    nowMs,
    deliverRequested: async (request) => {
      const approvalKind = resolveApprovalKind(request);
      const pendingContent = await adapter.buildPendingContent({
        request,
        approvalKind,
        nowMs: nowMs(),
      });
      return await deliverApprovalRequestViaChannelNativePlan({
        cfg: adapter.cfg,
        accountId: adapter.accountId,
        approvalKind,
        request,
        adapter: adapter.nativeAdapter,
        sendOriginNotice: adapter.sendOriginNotice
          ? async ({ originTarget, request }) => {
              await adapter.sendOriginNotice?.({
                originTarget,
                request,
                approvalKind,
                pendingContent,
              });
            }
          : undefined,
        prepareTarget: async ({ plannedTarget, request }) =>
          await adapter.prepareTarget({
            plannedTarget,
            request,
            approvalKind,
            pendingContent,
          }),
        deliverTarget: async ({ plannedTarget, preparedTarget, request }) =>
          await adapter.deliverTarget({
            plannedTarget,
            preparedTarget,
            request,
            approvalKind,
            pendingContent,
          }),
        onOriginNoticeError: adapter.onOriginNoticeError
          ? ({ error, originTarget, request }) => {
              adapter.onOriginNoticeError?.({
                error,
                originTarget,
                request,
                approvalKind,
                pendingContent,
              });
            }
          : undefined,
        onDeliveryError: adapter.onDeliveryError
          ? ({ error, plannedTarget, request }) => {
              adapter.onDeliveryError?.({
                error,
                plannedTarget,
                request,
                approvalKind,
                pendingContent,
              });
            }
          : undefined,
        onDuplicateSkipped: adapter.onDuplicateSkipped
          ? ({ plannedTarget, preparedTarget, request }) => {
              adapter.onDuplicateSkipped?.({
                plannedTarget,
                preparedTarget,
                request,
                approvalKind,
                pendingContent,
              });
            }
          : undefined,
        onDelivered: adapter.onDelivered
          ? ({ plannedTarget, preparedTarget, request, entry }) => {
              adapter.onDelivered?.({
                plannedTarget,
                preparedTarget,
                request,
                approvalKind,
                pendingContent,
                entry,
              });
            }
          : undefined,
      });
    },
  });
=======
    shouldHandle: (request) => {
      const approvalKind = resolveApprovalKind(request);
      routeReporter.observeRequest({
        approvalKind,
        request,
      });
      let shouldHandle: boolean;
      try {
        shouldHandle = adapter.shouldHandle(request);
      } catch (error) {
        void routeReporter.reportSkipped({
          approvalKind,
          request,
        });
        throw error;
      }
      if (shouldHandle) {
        return shouldHandle;
      }
      void routeReporter.reportSkipped({
        approvalKind,
        request,
      });
      return false;
    },
    finalizeResolved: adapter.finalizeResolved,
    finalizeExpired: adapter.finalizeExpired,
    onStopped: adapter.onStopped,
    beforeGatewayClientStart: () => {
      routeReporter.start();
    },
    nowMs,
    deliverRequested: async (request) => {
      const approvalKind = resolveApprovalKind(request);
      let deliveryPlan: ChannelApprovalNativeDeliveryPlan = {
        targets: [],
        originTarget: null,
        notifyOriginWhenDmOnly: false,
      };
      let deliveredTargets: ChannelApprovalNativePlannedTarget[] = [];
      try {
        const pendingContent = await adapter.buildPendingContent({
          request,
          approvalKind,
          nowMs: nowMs(),
        });
        const deliveryResult = await deliverApprovalRequestViaChannelNativePlan({
          cfg: adapter.cfg,
          accountId: adapter.accountId,
          approvalKind,
          request,
          adapter: adapter.nativeAdapter,
          prepareTarget: async ({ plannedTarget, request: requestCandidate }) =>
            await adapter.prepareTarget({
              plannedTarget,
              request: requestCandidate,
              approvalKind,
              pendingContent,
            }),
          deliverTarget: async ({ plannedTarget, preparedTarget, request: requestEntry }) =>
            await adapter.deliverTarget({
              plannedTarget,
              preparedTarget,
              request: requestEntry,
              approvalKind,
              pendingContent,
            }),
          onDeliveryError: adapter.onDeliveryError
            ? ({ error, plannedTarget, request: requestResult }) => {
                adapter.onDeliveryError?.({
                  error,
                  plannedTarget,
                  request: requestResult,
                  approvalKind,
                  pendingContent,
                });
              }
            : undefined,
          onDuplicateSkipped: adapter.onDuplicateSkipped
            ? ({ plannedTarget, preparedTarget, request: requestValue }) => {
                adapter.onDuplicateSkipped?.({
                  plannedTarget,
                  preparedTarget,
                  request: requestValue,
                  approvalKind,
                  pendingContent,
                });
              }
            : undefined,
          onDelivered: adapter.onDelivered
            ? ({ plannedTarget, preparedTarget, request: requestLocal, entry }) => {
                adapter.onDelivered?.({
                  plannedTarget,
                  preparedTarget,
                  request: requestLocal,
                  approvalKind,
                  pendingContent,
                  entry,
                });
              }
            : undefined,
        });
        deliveryPlan = deliveryResult.deliveryPlan;
        deliveredTargets = deliveryResult.deliveredTargets;
        return deliveryResult.entries;
      } finally {
        await routeReporter.reportDelivery({
          approvalKind,
          request,
          deliveryPlan,
          deliveredTargets,
        });
      }
    },
  });

  runtimeRequest = (method, params) => runtime.request(method, params);

  return {
    ...runtime,
    async start() {
      try {
        await runtime.start();
      } catch (error) {
        await routeReporter.stop();
        throw error;
      }
    },
    async stop() {
      await routeReporter.stop();
      await runtime.stop();
    },
  };
>>>>>>> upstream/main
}
