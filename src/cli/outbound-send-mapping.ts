<<<<<<< HEAD
import { normalizeAnyChannelId } from "../channels/registry.js";
import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
=======
// Maps CLI send dependency sources into outbound send dependencies with legacy aliases.
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { normalizeChannelId } from "../channels/registry.js";
import {
  resolveLegacyOutboundSendDepKeys,
  type OutboundSendDeps,
} from "../infra/outbound/send-deps.js";
>>>>>>> upstream/main

/**
 * CLI-internal send function sources, keyed by channel ID.
 * Each value is a lazily-loaded send function for that channel.
 */
export const CLI_OUTBOUND_SEND_FACTORY: unique symbol = Symbol.for(
  "openclaw.cliOutboundSendFactory",
) as never;

<<<<<<< HEAD
function normalizeLegacyChannelStem(raw: string): string {
  return raw
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .trim()
    .toLowerCase()
    .replace(/-/g, "");
}

=======
type CliOutboundSendFactory = (channelId: string) => unknown;
export type CliOutboundSendSource = {
  [channelId: string]: unknown;
  [CLI_OUTBOUND_SEND_FACTORY]?: CliOutboundSendFactory;
};

function normalizeLegacyChannelStem(raw: string): string {
  const normalized = normalizeLowercaseStringOrEmpty(
    raw
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/_/g, "-")
      .trim(),
  );
  return normalized.replace(/-/g, "");
}

>>>>>>> upstream/main
function resolveChannelIdFromLegacySourceKey(key: string): string | undefined {
  const match = key.match(/^sendMessage(.+)$/);
  if (!match) {
    return undefined;
  }
  const normalizedStem = normalizeLegacyChannelStem(match[1] ?? "");
<<<<<<< HEAD
  return normalizeAnyChannelId(normalizedStem) ?? (normalizedStem || undefined);
}

function resolveLegacyDepKeysForChannel(channelId: string): string[] {
  const compact = channelId.replace(/[^a-z0-9]+/gi, "");
  if (!compact) {
    return [];
  }
  const pascal = compact.charAt(0).toUpperCase() + compact.slice(1);
  const keys = new Set<string>();
  keys.add(`send${pascal}`);
  if (pascal.startsWith("I") && pascal.length > 1) {
    keys.add(`sendI${pascal.slice(1)}`);
  }
  if (pascal.startsWith("Ms") && pascal.length > 2) {
    keys.add(`sendMS${pascal.slice(2)}`);
  }
  return [...keys];
=======
  return normalizedStem || undefined;
}

function resolveChannelIdFromLegacyOutboundKey(key: string): string | undefined {
  const match = key.match(/^send(.+)$/);
  if (!match) {
    return undefined;
  }
  const normalizedStem = normalizeLegacyChannelStem(match[1] ?? "");
  return normalizedStem || undefined;
}

function resolveKnownChannelId(raw: string): string | undefined {
  return normalizeChannelId(raw) ?? undefined;
>>>>>>> upstream/main
}

/**
 * Pass CLI send sources through as-is — both CliOutboundSendSource and
 * OutboundSendDeps are now channel-ID-keyed records.
 */
export function createOutboundSendDepsFromCliSource(deps: CliOutboundSendSource): OutboundSendDeps {
  const outbound: OutboundSendDeps = { ...deps };
  const sendFactory = deps[CLI_OUTBOUND_SEND_FACTORY];

  for (const legacySourceKey of Object.keys(deps)) {
    const channelId = resolveChannelIdFromLegacySourceKey(legacySourceKey);
    if (!channelId) {
      continue;
    }
    const sourceValue = deps[legacySourceKey];
    if (sourceValue !== undefined && outbound[channelId] === undefined) {
      outbound[channelId] = sourceValue;
    }
  }

  for (const channelId of Object.keys(outbound)) {
    const sourceValue = outbound[channelId];
    if (sourceValue === undefined) {
      continue;
    }
<<<<<<< HEAD
    for (const legacyDepKey of resolveLegacyDepKeysForChannel(channelId)) {
=======
    for (const legacyDepKey of resolveLegacyOutboundSendDepKeys(channelId)) {
>>>>>>> upstream/main
      if (outbound[legacyDepKey] === undefined) {
        outbound[legacyDepKey] = sourceValue;
      }
    }
  }

  if (!sendFactory) {
    return outbound;
  }

  const resolveFactoryValue = (key: string): unknown => {
    // Proxy reads can come from legacy sendX keys or canonical channel ids.
    const candidate =
      outbound[key] === undefined ? (resolveChannelIdFromLegacyOutboundKey(key) ?? key) : key;
    const channelId = resolveKnownChannelId(candidate);
    if (!channelId || channelId === "then" || channelId === "toJSON") {
      return undefined;
    }
    const value = sendFactory(channelId);
    if (value !== undefined) {
      outbound[channelId] = value;
      for (const legacyDepKey of resolveLegacyOutboundSendDepKeys(channelId)) {
        outbound[legacyDepKey] ??= value;
      }
    }
    return value;
  };

  return new Proxy(outbound, {
    get(target, property, receiver) {
      if (typeof property !== "string") {
        return Reflect.get(target, property, receiver);
      }
      const existing = Reflect.get(target, property, receiver);
      if (existing !== undefined) {
        return existing;
      }
      return resolveFactoryValue(property);
    },
  });
}
