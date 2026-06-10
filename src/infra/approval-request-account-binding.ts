<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { resolveStorePath } from "../config/sessions/paths.js";
import { loadSessionStore } from "../config/sessions/store-load.js";
=======
// Matches approval requests against channel account and session bindings.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { resolveStorePath } from "../config/sessions/paths.js";
import { loadSessionStore } from "../config/sessions/store-load.js";
import { resolveMaintenanceConfigFromInput } from "../config/sessions/store-maintenance.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main
import { normalizeOptionalAccountId } from "../routing/account-id.js";
import { parseAgentSessionKey } from "../routing/session-key.js";
import { normalizeMessageChannel } from "../utils/message-channel.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
import type { PluginApprovalRequest } from "./plugin-approvals.js";

type ApprovalRequestLike = ExecApprovalRequest | PluginApprovalRequest;

type ApprovalRequestSessionBinding = {
  channel?: string;
  accountId?: string;
};

<<<<<<< HEAD
function normalizeOptionalString(value?: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}
=======
type PersistedApprovalRequestSessionEntry = {
  sessionKey: string;
  entry: SessionEntry;
};
>>>>>>> upstream/main

function normalizeOptionalChannel(value?: string | null): string | undefined {
  return normalizeMessageChannel(value);
}

<<<<<<< HEAD
function resolvePersistedApprovalRequestSessionBinding(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
}): ApprovalRequestSessionBinding | null {
=======
/** Loads the persisted session entry referenced by an approval request, if still present. */
export function resolvePersistedApprovalRequestSessionEntry(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
}): PersistedApprovalRequestSessionEntry | null {
>>>>>>> upstream/main
  const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
  if (!sessionKey) {
    return null;
  }
  const parsed = parseAgentSessionKey(sessionKey);
  const agentId = parsed?.agentId ?? params.request.request.agentId ?? "main";
  const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
<<<<<<< HEAD
  const store = loadSessionStore(storePath);
=======
  const store = loadSessionStore(storePath, {
    maintenanceConfig: resolveMaintenanceConfigFromInput(params.cfg.session?.maintenance),
  });
>>>>>>> upstream/main
  const entry = store[sessionKey];
  if (!entry) {
    return null;
  }
<<<<<<< HEAD
=======
  return { sessionKey, entry };
}

function resolvePersistedApprovalRequestSessionBinding(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
}): ApprovalRequestSessionBinding | null {
  const persisted = resolvePersistedApprovalRequestSessionEntry(params);
  if (!persisted) {
    return null;
  }
  const { entry } = persisted;
>>>>>>> upstream/main
  const channel = normalizeOptionalChannel(entry.origin?.provider ?? entry.lastChannel);
  const accountId = normalizeOptionalAccountId(entry.origin?.accountId ?? entry.lastAccountId);
  return channel || accountId ? { channel, accountId } : null;
}

<<<<<<< HEAD
=======
/** Resolves the account id an approval request belongs to for an optional channel filter. */
>>>>>>> upstream/main
export function resolveApprovalRequestAccountId(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel?: string | null;
}): string | null {
  const expectedChannel = normalizeOptionalChannel(params.channel);
  const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
  if (expectedChannel && turnSourceChannel && turnSourceChannel !== expectedChannel) {
    return null;
  }

  const turnSourceAccountId = normalizeOptionalAccountId(
    params.request.request.turnSourceAccountId,
  );
  if (turnSourceAccountId) {
    return turnSourceAccountId;
  }

  const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
  const sessionChannel = sessionBinding?.channel;
  if (expectedChannel && sessionChannel && sessionChannel !== expectedChannel) {
    return null;
  }

  return sessionBinding?.accountId ?? null;
}

<<<<<<< HEAD
=======
/** Resolves an approval request account only when the request can be routed to a channel. */
>>>>>>> upstream/main
export function resolveApprovalRequestChannelAccountId(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel: string;
}): string | null {
  const expectedChannel = normalizeOptionalChannel(params.channel);
  if (!expectedChannel) {
    return null;
  }
  const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
  if (!turnSourceChannel || turnSourceChannel === expectedChannel) {
    return resolveApprovalRequestAccountId(params);
  }

<<<<<<< HEAD
=======
  // A conflicting turn-source channel is authoritative for live routing; only
  // fall back to the persisted session when that stored binding names this channel.
>>>>>>> upstream/main
  const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
  return sessionBinding?.channel === expectedChannel ? (sessionBinding.accountId ?? null) : null;
}

<<<<<<< HEAD
=======
/** Checks whether a channel/account pair is eligible to handle an approval request. */
>>>>>>> upstream/main
export function doesApprovalRequestMatchChannelAccount(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel: string;
  accountId?: string | null;
}): boolean {
  const expectedChannel = normalizeOptionalChannel(params.channel);
  if (!expectedChannel) {
    return false;
  }

  const turnSourceChannel = normalizeOptionalChannel(params.request.request.turnSourceChannel);
  if (turnSourceChannel && turnSourceChannel !== expectedChannel) {
    return false;
  }

  const turnSourceAccountId = normalizeOptionalAccountId(
    params.request.request.turnSourceAccountId,
  );
  const expectedAccountId = normalizeOptionalAccountId(params.accountId);
  if (turnSourceAccountId) {
    return !expectedAccountId || expectedAccountId === turnSourceAccountId;
  }

  const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
  const sessionChannel = sessionBinding?.channel;
  if (sessionChannel && sessionChannel !== expectedChannel) {
    return false;
  }

  const boundAccountId = sessionBinding?.accountId;
  return !expectedAccountId || !boundAccountId || expectedAccountId === boundAccountId;
}
