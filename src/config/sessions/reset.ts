<<<<<<< HEAD
import { resolveSessionThreadInfo } from "../../channels/plugins/session-conversation.js";
=======
// Reset helpers classify session keys and route reset config by session/channel type.
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "@openclaw/normalization-core/string-coerce";
import { resolveLoadedSessionThreadInfo } from "../../channels/plugins/session-thread-info-loaded.js";
>>>>>>> upstream/main
import { normalizeMessageChannel } from "../../utils/message-channel.js";
import type { SessionConfig, SessionResetConfig } from "../types.base.js";
/** Public reset policy exports plus helpers that classify direct, group, and thread sessions. */
export {
  DEFAULT_RESET_AT_HOUR,
  DEFAULT_RESET_MODE,
  evaluateSessionFreshness,
  resolveDailyResetAtMs,
  resolveSessionResetPolicy,
  type SessionFreshness,
  type SessionResetMode,
  type SessionResetPolicy,
  type SessionResetType,
} from "./reset-policy.js";
import type { SessionResetType } from "./reset-policy.js";

<<<<<<< HEAD
export type SessionResetMode = "daily" | "idle";
export type SessionResetType = "direct" | "group" | "thread";

export type SessionResetPolicy = {
  mode: SessionResetMode;
  atHour: number;
  idleMinutes?: number;
};

export type SessionFreshness = {
  fresh: boolean;
  dailyResetAt?: number;
  idleExpiresAt?: number;
};

export const DEFAULT_RESET_MODE: SessionResetMode = "daily";
export const DEFAULT_RESET_AT_HOUR = 4;

=======
>>>>>>> upstream/main
const GROUP_SESSION_MARKERS = [":group:", ":channel:"];

/** Returns true when a session key is known to represent a thread. */
export function isThreadSessionKey(sessionKey?: string | null): boolean {
<<<<<<< HEAD
  return Boolean(resolveSessionThreadInfo(sessionKey).threadId);
=======
  return Boolean(resolveLoadedSessionThreadInfo(sessionKey).threadId);
>>>>>>> upstream/main
}

export function resolveSessionResetType(params: {
  sessionKey?: string | null;
  isGroup?: boolean;
  isThread?: boolean;
}): SessionResetType {
  // Thread wins over group because thread-specific reset policy should apply to grouped replies.
  if (params.isThread || isThreadSessionKey(params.sessionKey)) {
    return "thread";
  }
  if (params.isGroup) {
    return "group";
  }
  const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
  if (GROUP_SESSION_MARKERS.some((marker) => normalized.includes(marker))) {
    return "group";
  }
  return "direct";
}

export function resolveThreadFlag(params: {
  sessionKey?: string | null;
  messageThreadId?: string | number | null;
  threadLabel?: string | null;
  threadStarterBody?: string | null;
  parentSessionKey?: string | null;
}): boolean {
  if (params.messageThreadId != null) {
    return true;
  }
  if (params.threadLabel?.trim()) {
    return true;
  }
  if (params.threadStarterBody?.trim()) {
    return true;
  }
  if (params.parentSessionKey?.trim()) {
    return true;
  }
  return isThreadSessionKey(params.sessionKey);
}

export function resolveChannelResetConfig(params: {
  sessionCfg?: SessionConfig;
  channel?: string | null;
}): SessionResetConfig | undefined {
  const resetByChannel = params.sessionCfg?.resetByChannel;
  if (!resetByChannel) {
    return undefined;
  }
  const normalized = normalizeMessageChannel(params.channel);
  const fallback = normalizeOptionalLowercaseString(params.channel);
  // Channel ids can arrive as public message-channel names or raw provider keys.
  const key = normalized ?? fallback;
  if (!key) {
    return undefined;
  }
  return resetByChannel[key];
}
