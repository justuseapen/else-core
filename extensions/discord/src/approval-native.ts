<<<<<<< HEAD
import type { DiscordExecApprovalConfig, OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { ExecApprovalRequest, PluginApprovalRequest } from "openclaw/plugin-sdk/infra-runtime";
=======
// Discord plugin module implements approval native behavior.
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import type { ChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
import { resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import type { ChannelApprovalCapability } from "openclaw/plugin-sdk/channel-contract";
import type { DiscordExecApprovalConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
export { shouldHandleDiscordApprovalRequest } from "./approval-shared.js";
>>>>>>> upstream/main
import { listDiscordAccountIds, resolveDiscordAccount } from "./accounts.js";
import {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
  createApproverRestrictedNativeApprovalCapability,
  splitChannelApprovalCapability,
<<<<<<< HEAD
  doesApprovalRequestMatchChannelAccount,
  isChannelExecApprovalClientEnabledFromConfig,
  matchesApprovalRequestFilters,
} from "./approval-runtime.js";
=======
} from "./approval-runtime.js";
import { shouldHandleDiscordApprovalRequest } from "./approval-shared.js";
>>>>>>> upstream/main
import {
  getDiscordExecApprovalApprovers,
  isDiscordExecApprovalApprover,
  isDiscordExecApprovalClientEnabled,
} from "./exec-approvals.js";

<<<<<<< HEAD
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;

=======
// Legacy export kept for monitor test/support surfaces; native routing now uses
// the shared session-conversation fallback helper instead.
>>>>>>> upstream/main
export function extractDiscordChannelId(sessionKey?: string | null): string | null {
  if (!sessionKey) {
    return null;
  }
  const match = sessionKey.match(/discord:(?:channel|group):(\d+)/);
  return match ? match[1] : null;
}

function extractDiscordSessionKind(sessionKey?: string | null): "channel" | "group" | "dm" | null {
  if (!sessionKey) {
    return null;
  }
<<<<<<< HEAD
  const match = sessionKey.match(/discord:(channel|group|dm):/);
  if (!match) {
    return null;
  }
  return match[1] as "channel" | "group" | "dm";
=======
  // DM session keys use the `direct` peer kind in the normalized form
  // (`agent:<id>:discord[:account]:direct:<userId>`); legacy keys may still use
  // `dm`. Treat both as the same logical kind for downstream comparisons.
  const match = sessionKey.match(/discord:(?:[^:]+:)?(channel|group|dm|direct):/);
  if (!match) {
    return null;
  }
  const raw = match[1];
  if (raw === "direct") {
    return "dm";
  }
  return raw as "channel" | "group" | "dm";
>>>>>>> upstream/main
}

function normalizeDiscordOriginChannelId(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const prefixed = trimmed.match(/^(?:channel|group):(\d+)$/i);
  if (prefixed) {
    return prefixed[1];
  }
  return /^\d+$/.test(trimmed) ? trimmed : null;
}

<<<<<<< HEAD
export function shouldHandleDiscordApprovalRequest(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  request: ApprovalRequest;
  configOverride?: DiscordExecApprovalConfig | null;
}): boolean {
  const config =
    params.configOverride ??
    resolveDiscordAccount({ cfg: params.cfg, accountId: params.accountId }).config.execApprovals;
  const approvers = getDiscordExecApprovalApprovers({
    cfg: params.cfg,
    accountId: params.accountId,
    configOverride: params.configOverride,
  });
  if (
    !doesApprovalRequestMatchChannelAccount({
      cfg: params.cfg,
      request: params.request,
      channel: "discord",
      accountId: params.accountId,
    })
  ) {
    return false;
  }
  if (
    !isChannelExecApprovalClientEnabledFromConfig({
      enabled: config?.enabled,
      approverCount: approvers.length,
    })
  ) {
    return false;
  }
  return matchesApprovalRequestFilters({
    request: params.request.request,
    agentFilter: config?.agentFilter,
    sessionFilter: config?.sessionFilter,
  });
=======
function normalizeDiscordThreadId(value?: string | number | null): string | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return /^\d+$/.test(normalized) ? normalized : undefined;
>>>>>>> upstream/main
}

function createDiscordOriginTargetResolver(configOverride?: DiscordExecApprovalConfig | null) {
  return createChannelNativeOriginTargetResolver({
    channel: "discord",
    shouldHandleRequest: ({ cfg, accountId, request }) =>
      shouldHandleDiscordApprovalRequest({
        cfg,
        accountId,
        request,
        configOverride,
      }),
    resolveTurnSourceTarget: (request) => {
<<<<<<< HEAD
      const sessionKind = extractDiscordSessionKind(request.request.sessionKey?.trim() || null);
      const turnSourceChannel = request.request.turnSourceChannel?.trim().toLowerCase() || "";
      const rawTurnSourceTo = request.request.turnSourceTo?.trim() || "";
      const turnSourceTo = normalizeDiscordOriginChannelId(rawTurnSourceTo);
=======
      const sessionConversation = resolveApprovalRequestSessionConversation({
        request,
        channel: "discord",
        bundledFallback: false,
      });
      const sessionKind = extractDiscordSessionKind(
        normalizeOptionalString(request.request.sessionKey) ?? null,
      );
      const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
      const rawTurnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
      const turnSourceTo = normalizeDiscordOriginChannelId(rawTurnSourceTo);
      const threadId =
        normalizeDiscordThreadId(request.request.turnSourceThreadId) ??
        normalizeDiscordThreadId(sessionConversation?.threadId) ??
        undefined;
>>>>>>> upstream/main
      const hasExplicitOriginTarget = /^(?:channel|group):/i.test(rawTurnSourceTo);
      if (turnSourceChannel !== "discord" || !turnSourceTo || sessionKind === "dm") {
        return null;
      }
      return hasExplicitOriginTarget || sessionKind === "channel" || sessionKind === "group"
<<<<<<< HEAD
        ? { to: turnSourceTo }
        : null;
    },
    resolveSessionTarget: (sessionTarget, request) => {
=======
        ? { to: turnSourceTo, threadId }
        : null;
    },
    resolveSessionTarget: (sessionTarget, request) => {
      const sessionConversation = resolveApprovalRequestSessionConversation({
        request,
        channel: "discord",
        bundledFallback: false,
      });
>>>>>>> upstream/main
      const sessionKind = extractDiscordSessionKind(request.request.sessionKey?.trim() || null);
      if (sessionKind === "dm") {
        return null;
      }
      const targetTo = normalizeDiscordOriginChannelId(sessionTarget.to);
<<<<<<< HEAD
      return targetTo ? { to: targetTo } : null;
    },
    targetsMatch: (a, b) => a.to === b.to,
    resolveFallbackTarget: (request) => {
=======
      return targetTo
        ? {
            to: targetTo,
            threadId:
              normalizeDiscordThreadId(sessionTarget.threadId) ??
              normalizeDiscordThreadId(sessionConversation?.threadId) ??
              undefined,
          }
        : null;
    },
    resolveFallbackTarget: (request) => {
      const sessionConversation = resolveApprovalRequestSessionConversation({
        request,
        channel: "discord",
        bundledFallback: false,
      });
>>>>>>> upstream/main
      const sessionKind = extractDiscordSessionKind(request.request.sessionKey?.trim() || null);
      if (sessionKind === "dm") {
        return null;
      }
<<<<<<< HEAD
      const legacyChannelId = extractDiscordChannelId(request.request.sessionKey?.trim() || null);
      return legacyChannelId ? { to: legacyChannelId } : null;
=======
      const fallbackChannelId = normalizeDiscordOriginChannelId(sessionConversation?.id);
      return fallbackChannelId
        ? {
            to: fallbackChannelId,
            threadId: normalizeDiscordThreadId(sessionConversation?.threadId) ?? undefined,
          }
        : null;
>>>>>>> upstream/main
    },
  });
}

function createDiscordApproverDmTargetResolver(configOverride?: DiscordExecApprovalConfig | null) {
  return createChannelApproverDmTargetResolver({
    shouldHandleRequest: ({ cfg, accountId, request }) =>
      shouldHandleDiscordApprovalRequest({
        cfg,
        accountId,
        request,
        configOverride,
      }),
    resolveApprovers: ({ cfg, accountId }) =>
      getDiscordExecApprovalApprovers({ cfg, accountId, configOverride }),
<<<<<<< HEAD
    mapApprover: (approver) => ({ to: String(approver) }),
  });
}

export function createDiscordApprovalCapability(configOverride?: DiscordExecApprovalConfig | null) {
  return createApproverRestrictedNativeApprovalCapability({
    channel: "discord",
    channelLabel: "Discord",
    describeExecApprovalSetup: ({ accountId }) => {
=======
    mapApprover: (approver) => ({ to: approver }),
  });
}

function createDiscordApprovalCapability(configOverride?: DiscordExecApprovalConfig | null) {
  return createApproverRestrictedNativeApprovalCapability({
    channel: "discord",
    channelLabel: "Discord",
    describeExecApprovalSetup: ({
      accountId,
    }: Parameters<NonNullable<ChannelApprovalCapability["describeExecApprovalSetup"]>>[0]) => {
>>>>>>> upstream/main
      const prefix =
        accountId && accountId !== "default"
          ? `channels.discord.accounts.${accountId}`
          : "channels.discord";
<<<<<<< HEAD
      return `Approve it from the Web UI or terminal UI for now. Discord supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
=======
      return `Approve it from the Web UI or terminal UI for now. Discord supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; set \`${prefix}.execApprovals.enabled\` to \`auto\` or \`true\`.`;
>>>>>>> upstream/main
    },
    listAccountIds: listDiscordAccountIds,
    hasApprovers: ({ cfg, accountId }) =>
      getDiscordExecApprovalApprovers({ cfg, accountId, configOverride }).length > 0,
    isExecAuthorizedSender: ({ cfg, accountId, senderId }) =>
      isDiscordExecApprovalApprover({ cfg, accountId, senderId, configOverride }),
    isNativeDeliveryEnabled: ({ cfg, accountId }) =>
      isDiscordExecApprovalClientEnabled({ cfg, accountId, configOverride }),
    resolveNativeDeliveryMode: ({ cfg, accountId }) =>
      configOverride?.target ??
      resolveDiscordAccount({ cfg, accountId }).config.execApprovals?.target ??
      "dm",
    resolveOriginTarget: createDiscordOriginTargetResolver(configOverride),
    resolveApproverDmTargets: createDiscordApproverDmTargetResolver(configOverride),
    notifyOriginWhenDmOnly: true,
<<<<<<< HEAD
=======
    nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
      eventKinds: ["exec", "plugin"],
      isConfigured: ({ cfg, accountId }) =>
        isDiscordExecApprovalClientEnabled({ cfg, accountId, configOverride }),
      shouldHandle: ({ cfg, accountId, request }) =>
        shouldHandleDiscordApprovalRequest({
          cfg,
          accountId,
          request,
          configOverride,
        }),
      load: async () =>
        (await import("./approval-handler.runtime.js"))
          .discordApprovalNativeRuntime as unknown as ChannelApprovalNativeRuntimeAdapter,
    }),
>>>>>>> upstream/main
  });
}

export function createDiscordNativeApprovalAdapter(
  configOverride?: DiscordExecApprovalConfig | null,
) {
  return splitChannelApprovalCapability(createDiscordApprovalCapability(configOverride));
}

let cachedDiscordApprovalCapability: ReturnType<typeof createDiscordApprovalCapability> | undefined;
<<<<<<< HEAD
let cachedDiscordNativeApprovalAdapter:
  | ReturnType<typeof createDiscordNativeApprovalAdapter>
  | undefined;
=======
>>>>>>> upstream/main

export function getDiscordApprovalCapability() {
  cachedDiscordApprovalCapability ??= createDiscordApprovalCapability();
  return cachedDiscordApprovalCapability;
}
<<<<<<< HEAD

export function getDiscordNativeApprovalAdapter() {
  cachedDiscordNativeApprovalAdapter ??= createDiscordNativeApprovalAdapter();
  return cachedDiscordNativeApprovalAdapter;
}
=======
>>>>>>> upstream/main
