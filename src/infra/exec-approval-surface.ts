<<<<<<< HEAD
import {
  getChannelPlugin,
  listChannelPlugins,
  resolveChannelApprovalAdapter,
  resolveChannelApprovalCapability,
} from "../channels/plugins/index.js";
import { loadConfig, type OpenClawConfig } from "../config/config.js";
=======
// Resolves native approval support for the initiating channel surface.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import {
  getChannelPlugin,
  listChannelPlugins,
  resolveChannelApprovalCapability,
} from "../channels/plugins/index.js";
import { getRuntimeConfig, type OpenClawConfig } from "../config/config.js";
>>>>>>> upstream/main
import {
  INTERNAL_MESSAGE_CHANNEL,
  isDeliverableMessageChannel,
  normalizeMessageChannel,
} from "../utils/message-channel.js";

/** Native approval availability for the channel/account that initiated an approval. */
export type ExecApprovalInitiatingSurfaceState =
  | { kind: "enabled"; channel: string | undefined; channelLabel: string; accountId?: string }
  | { kind: "disabled"; channel: string; channelLabel: string; accountId?: string }
  | { kind: "unsupported"; channel: string; channelLabel: string; accountId?: string };
<<<<<<< HEAD
=======

type ApprovalKind = "exec" | "plugin";
>>>>>>> upstream/main

function labelForChannel(channel?: string): string {
  if (channel === "tui") {
    return "terminal UI";
  }
  if (channel === INTERNAL_MESSAGE_CHANNEL) {
    return "Web UI";
  }
  return (
    getChannelPlugin(channel ?? "")?.meta.label ??
    (channel ? channel[0]?.toUpperCase() + channel.slice(1) : "this platform")
  );
<<<<<<< HEAD
}

function hasNativeExecApprovalCapability(channel?: string): boolean {
  const capability = resolveChannelApprovalCapability(getChannelPlugin(channel ?? ""));
  return Boolean(capability?.native && capability.getActionAvailabilityState);
=======
>>>>>>> upstream/main
}

function hasNativeExecApprovalCapability(channel?: string): boolean {
  const capability = resolveChannelApprovalCapability(getChannelPlugin(channel ?? ""));
  if (!capability?.native) {
    return false;
  }
  return Boolean(capability.getExecInitiatingSurfaceState || capability.getActionAvailabilityState);
}

/** Resolves whether exec approvals can be handled on the initiating surface. */
export function resolveExecApprovalInitiatingSurfaceState(params: {
  channel?: string | null;
  accountId?: string | null;
  cfg?: OpenClawConfig;
}): ExecApprovalInitiatingSurfaceState {
  return resolveApprovalInitiatingSurfaceState({ ...params, approvalKind: "exec" });
}

/** Resolves whether approvals of a given kind can be handled on the initiating surface. */
export function resolveApprovalInitiatingSurfaceState(params: {
  channel?: string | null;
  accountId?: string | null;
  cfg?: OpenClawConfig;
  approvalKind: ApprovalKind;
}): ExecApprovalInitiatingSurfaceState {
  const channel = normalizeMessageChannel(params.channel);
  const channelLabel = labelForChannel(channel);
<<<<<<< HEAD
  const accountId = params.accountId?.trim() || undefined;
=======
  const accountId = normalizeOptionalString(params.accountId);
>>>>>>> upstream/main
  if (!channel || channel === INTERNAL_MESSAGE_CHANNEL || channel === "tui") {
    return { kind: "enabled", channel, channelLabel, accountId };
  }

<<<<<<< HEAD
  const cfg = params.cfg ?? loadConfig();
  const state = resolveChannelApprovalCapability(
    getChannelPlugin(channel),
  )?.getActionAvailabilityState?.({
    cfg,
    accountId: params.accountId,
    action: "approve",
  });
=======
  const cfg = params.cfg ?? getRuntimeConfig();
  const capability = resolveChannelApprovalCapability(getChannelPlugin(channel));
  // Prefer the exec-specific hook, then the generic approval hook, before
  // falling back to basic deliverability for channels without native state.
  const state =
    (params.approvalKind === "exec"
      ? capability?.getExecInitiatingSurfaceState?.({
          cfg,
          accountId: params.accountId,
          action: "approve",
        })
      : undefined) ??
    capability?.getActionAvailabilityState?.({
      cfg,
      accountId: params.accountId,
      action: "approve",
      approvalKind: params.approvalKind,
    });
>>>>>>> upstream/main
  if (state) {
    return { ...state, channel, channelLabel, accountId };
  }
  if (isDeliverableMessageChannel(channel)) {
    return { kind: "enabled", channel, channelLabel, accountId };
  }
  return { kind: "unsupported", channel, channelLabel, accountId };
<<<<<<< HEAD
}

export function supportsNativeExecApprovalClient(channel?: string | null): boolean {
  const normalized = normalizeMessageChannel(channel);
  if (!normalized || normalized === INTERNAL_MESSAGE_CHANNEL || normalized === "tui") {
    return true;
  }
  return hasNativeExecApprovalCapability(normalized);
}

export function listNativeExecApprovalClientLabels(params?: {
  excludeChannel?: string | null;
}): string[] {
  const excludeChannel = normalizeMessageChannel(params?.excludeChannel);
  return listChannelPlugins()
    .filter((plugin) => plugin.id !== excludeChannel)
    .filter((plugin) => hasNativeExecApprovalCapability(plugin.id))
    .map((plugin) => plugin.meta.label?.trim())
    .filter((label): label is string => Boolean(label))
    .toSorted((a, b) => a.localeCompare(b));
}

export function describeNativeExecApprovalClientSetup(params: {
  channel?: string | null;
  channelLabel?: string | null;
  accountId?: string | null;
}): string | null {
  const channel = normalizeMessageChannel(params.channel);
  if (!channel || channel === INTERNAL_MESSAGE_CHANNEL || channel === "tui") {
    return null;
  }
  const channelLabel = params.channelLabel?.trim() || labelForChannel(channel);
  const accountId = params.accountId?.trim() || undefined;
  return (
    resolveChannelApprovalCapability(getChannelPlugin(channel))?.describeExecApprovalSetup?.({
      channel,
      channelLabel,
      accountId,
    }) ?? null
  );
}

export function hasConfiguredExecApprovalDmRoute(cfg: OpenClawConfig): boolean {
  return listChannelPlugins().some(
    (plugin) =>
      resolveChannelApprovalAdapter(plugin)?.delivery?.hasConfiguredDmRoute?.({ cfg }) ?? false,
=======
}

/** Returns whether a channel can present native exec approval UI. */
export function supportsNativeExecApprovalClient(channel?: string | null): boolean {
  const normalized = normalizeMessageChannel(channel);
  if (!normalized || normalized === INTERNAL_MESSAGE_CHANNEL || normalized === "tui") {
    return true;
  }
  return hasNativeExecApprovalCapability(normalized);
}

/** Lists native exec approval client labels for reply guidance. */
export function listNativeExecApprovalClientLabels(params?: {
  excludeChannel?: string | null;
}): string[] {
  const excludeChannel = normalizeMessageChannel(params?.excludeChannel);
  return listChannelPlugins()
    .filter((plugin) => plugin.id !== excludeChannel)
    .filter((plugin) => hasNativeExecApprovalCapability(plugin.id))
    .map((plugin) => normalizeOptionalString(plugin.meta.label))
    .filter((label): label is string => Boolean(label))
    .toSorted((a, b) => a.localeCompare(b));
}

/** Returns channel-specific setup guidance for native exec approvals, when available. */
export function describeNativeExecApprovalClientSetup(params: {
  channel?: string | null;
  channelLabel?: string | null;
  accountId?: string | null;
}): string | null {
  const channel = normalizeMessageChannel(params.channel);
  if (!channel || channel === INTERNAL_MESSAGE_CHANNEL || channel === "tui") {
    return null;
  }
  const channelLabel = normalizeOptionalString(params.channelLabel) ?? labelForChannel(channel);
  const accountId = normalizeOptionalString(params.accountId);
  return (
    resolveChannelApprovalCapability(getChannelPlugin(channel))?.describeExecApprovalSetup?.({
      channel,
      channelLabel,
      accountId,
    }) ?? null
>>>>>>> upstream/main
  );
}
