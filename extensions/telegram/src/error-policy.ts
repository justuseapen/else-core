<<<<<<< HEAD
=======
// Telegram plugin module implements error policy behavior.
>>>>>>> upstream/main
import type {
  TelegramAccountConfig,
  TelegramDirectConfig,
  TelegramGroupConfig,
  TelegramTopicConfig,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/config-runtime";

export type TelegramErrorPolicy = "always" | "once" | "silent";
=======
} from "openclaw/plugin-sdk/config-contracts";
import {
  asDateTimestampMs,
  isFutureDateTimestampMs,
  resolveExpiresAtMsFromDurationMs,
} from "openclaw/plugin-sdk/number-runtime";

type TelegramErrorPolicy = "always" | "once" | "silent";
>>>>>>> upstream/main

type TelegramErrorConfig =
  | TelegramAccountConfig
  | TelegramDirectConfig
  | TelegramGroupConfig
  | TelegramTopicConfig;

const errorCooldownStore = new Map<string, Map<string, number>>();
const DEFAULT_ERROR_COOLDOWN_MS = 14400000;

function pruneExpiredCooldowns(messageStore: Map<string, number>, now: number) {
  for (const [message, expiresAt] of messageStore) {
<<<<<<< HEAD
    if (expiresAt <= now) {
=======
    if (!isFutureDateTimestampMs(expiresAt, { nowMs: now })) {
>>>>>>> upstream/main
      messageStore.delete(message);
    }
  }
}

export function resolveTelegramErrorPolicy(params: {
  accountConfig?: TelegramAccountConfig;
  groupConfig?: TelegramDirectConfig | TelegramGroupConfig;
  topicConfig?: TelegramTopicConfig;
}): {
  policy: TelegramErrorPolicy;
  cooldownMs: number;
} {
  const configs: Array<TelegramErrorConfig | undefined> = [
    params.accountConfig,
    params.groupConfig,
    params.topicConfig,
  ];
  let policy: TelegramErrorPolicy = "always";
  let cooldownMs = DEFAULT_ERROR_COOLDOWN_MS;

  for (const config of configs) {
    if (config?.errorPolicy) {
      policy = config.errorPolicy;
    }
    if (typeof config?.errorCooldownMs === "number") {
      cooldownMs = config.errorCooldownMs;
    }
  }

  return { policy, cooldownMs };
}

export function buildTelegramErrorScopeKey(params: {
  accountId: string;
  chatId: string | number;
  threadId?: string | number | null;
}): string {
  const threadId = params.threadId == null ? "main" : String(params.threadId);
  return `${params.accountId}:${String(params.chatId)}:${threadId}`;
}

export function shouldSuppressTelegramError(params: {
  scopeKey: string;
  cooldownMs: number;
  errorMessage?: string;
}): boolean {
  const { scopeKey, cooldownMs, errorMessage } = params;
<<<<<<< HEAD
  const now = Date.now();
  const messageKey = errorMessage ?? "";
  const scopeStore = errorCooldownStore.get(scopeKey);
=======
  const now = asDateTimestampMs(Date.now());
  const messageKey = errorMessage ?? "";
  const scopeStore = errorCooldownStore.get(scopeKey);
  if (now === undefined) {
    errorCooldownStore.delete(scopeKey);
    return false;
  }
>>>>>>> upstream/main

  if (scopeStore) {
    pruneExpiredCooldowns(scopeStore, now);
    if (scopeStore.size === 0) {
      errorCooldownStore.delete(scopeKey);
    }
  }

  if (errorCooldownStore.size > 100) {
    for (const [scope, messageStore] of errorCooldownStore) {
      pruneExpiredCooldowns(messageStore, now);
      if (messageStore.size === 0) {
        errorCooldownStore.delete(scope);
      }
    }
  }

  const expiresAt = scopeStore?.get(messageKey);
<<<<<<< HEAD
  if (typeof expiresAt === "number" && expiresAt > now) {
    return true;
  }

  const nextScopeStore = scopeStore ?? new Map<string, number>();
  nextScopeStore.set(messageKey, now + cooldownMs);
=======
  if (isFutureDateTimestampMs(expiresAt, { nowMs: now })) {
    return true;
  }

  const nextExpiresAt = resolveExpiresAtMsFromDurationMs(cooldownMs, { nowMs: now });
  if (nextExpiresAt === undefined) {
    scopeStore?.delete(messageKey);
    return false;
  }
  const nextScopeStore = scopeStore ?? new Map<string, number>();
  nextScopeStore.set(messageKey, nextExpiresAt);
>>>>>>> upstream/main
  errorCooldownStore.set(scopeKey, nextScopeStore);
  return false;
}

export function isSilentErrorPolicy(policy: TelegramErrorPolicy): boolean {
  return policy === "silent";
}

export function resetTelegramErrorPolicyStoreForTest() {
  errorCooldownStore.clear();
}
