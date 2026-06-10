<<<<<<< HEAD
=======
// Slack plugin module implements doctor contract behavior.
>>>>>>> upstream/main
import type {
  ChannelDoctorConfigMutation,
  ChannelDoctorLegacyConfigRule,
} from "openclaw/plugin-sdk/channel-contract";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import {
  resolveSlackNativeStreaming,
  resolveSlackStreamingMode,
} from "./streaming-compat.js";

function asObjectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function ensureNestedRecord(owner: Record<string, unknown>, key: string): Record<string, unknown> {
  const existing = asObjectRecord(owner[key]);
  if (existing) {
    return { ...existing };
  }
  return {};
}

function normalizeSlackStreamingAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): { entry: Record<string, unknown>; changed: boolean } {
  const beforeStreaming = params.entry.streaming;
  const hadLegacyStreamMode = params.entry.streamMode !== undefined;
  const hasLegacyFlatFields =
    params.entry.chunkMode !== undefined ||
    params.entry.blockStreaming !== undefined ||
    params.entry.blockStreamingCoalesce !== undefined ||
    params.entry.nativeStreaming !== undefined;
  const resolvedStreaming = resolveSlackStreamingMode(params.entry);
  const resolvedNativeStreaming = resolveSlackNativeStreaming(params.entry);
  const shouldNormalize =
    hadLegacyStreamMode ||
    typeof beforeStreaming === "boolean" ||
    typeof beforeStreaming === "string" ||
    hasLegacyFlatFields;
  if (!shouldNormalize) {
    return { entry: params.entry, changed: false };
  }

  let updated = { ...params.entry };
  let changed = false;
  const streaming = ensureNestedRecord(updated, "streaming");
  const block = ensureNestedRecord(streaming, "block");

  if (
    (hadLegacyStreamMode ||
      typeof beforeStreaming === "boolean" ||
      typeof beforeStreaming === "string") &&
    streaming.mode === undefined
  ) {
    streaming.mode = resolvedStreaming;
    if (hadLegacyStreamMode) {
      params.changes.push(
        `Moved ${params.pathPrefix}.streamMode → ${params.pathPrefix}.streaming.mode (${resolvedStreaming}).`,
      );
    }
    if (typeof beforeStreaming === "boolean") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.mode (${resolvedStreaming}).`,
      );
    } else if (typeof beforeStreaming === "string") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (scalar) → ${params.pathPrefix}.streaming.mode (${resolvedStreaming}).`,
      );
    }
    changed = true;
  }
  if (hadLegacyStreamMode) {
    delete updated.streamMode;
    changed = true;
  }
  if (updated.chunkMode !== undefined && streaming.chunkMode === undefined) {
    streaming.chunkMode = updated.chunkMode;
    delete updated.chunkMode;
    params.changes.push(
      `Moved ${params.pathPrefix}.chunkMode → ${params.pathPrefix}.streaming.chunkMode.`,
    );
    changed = true;
  }
  if (updated.blockStreaming !== undefined && block.enabled === undefined) {
    block.enabled = updated.blockStreaming;
    delete updated.blockStreaming;
    params.changes.push(
      `Moved ${params.pathPrefix}.blockStreaming → ${params.pathPrefix}.streaming.block.enabled.`,
    );
    changed = true;
  }
  if (updated.blockStreamingCoalesce !== undefined && block.coalesce === undefined) {
    block.coalesce = updated.blockStreamingCoalesce;
    delete updated.blockStreamingCoalesce;
    params.changes.push(
      `Moved ${params.pathPrefix}.blockStreamingCoalesce → ${params.pathPrefix}.streaming.block.coalesce.`,
    );
    changed = true;
  }
  if (updated.nativeStreaming !== undefined && streaming.nativeTransport === undefined) {
    streaming.nativeTransport = resolvedNativeStreaming;
    delete updated.nativeStreaming;
    params.changes.push(
      `Moved ${params.pathPrefix}.nativeStreaming → ${params.pathPrefix}.streaming.nativeTransport.`,
    );
    changed = true;
  } else if (typeof beforeStreaming === "boolean" && streaming.nativeTransport === undefined) {
    streaming.nativeTransport = resolvedNativeStreaming;
    params.changes.push(
      `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.nativeTransport.`,
    );
    changed = true;
  }

  if (Object.keys(block).length > 0) {
    streaming.block = block;
  }
  updated.streaming = streaming;

  return { entry: updated, changed };
}

function hasLegacySlackStreamingAliases(value: unknown): boolean {
  const entry = asObjectRecord(value);
  if (!entry) {
    return false;
  }
  return (
    entry.streamMode !== undefined ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    entry.chunkMode !== undefined ||
    entry.blockStreaming !== undefined ||
    entry.blockStreamingCoalesce !== undefined ||
    entry.nativeStreaming !== undefined
  );
}

function hasLegacySlackAccountStreamingAliases(value: unknown): boolean {
  const accounts = asObjectRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((account) => hasLegacySlackStreamingAliases(account));
=======
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  asObjectRecord,
  hasLegacyAccountStreamingAliases,
  hasLegacyStreamingAliases,
  normalizeLegacyChannelAliases,
} from "openclaw/plugin-sdk/runtime-doctor";
import { resolveSlackNativeStreaming, resolveSlackStreamingMode } from "./streaming-compat.js";

function hasLegacySlackStreamingAliases(value: unknown): boolean {
  return hasLegacyStreamingAliases(value, { includeNativeTransport: true });
}

function hasLegacySlackChannelAllowAlias(value: unknown): boolean {
  const channels = asObjectRecord(asObjectRecord(value)?.channels);
  if (!channels) {
    return false;
  }
  return Object.values(channels).some((channel) =>
    Object.hasOwn(asObjectRecord(channel) ?? {}, "allow"),
  );
}

function normalizeSlackChannelAllowAliases(params: {
  channels: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): { channels: Record<string, unknown>; changed: boolean } {
  let changed = false;
  const nextChannels = { ...params.channels };
  for (const [channelId, channelValue] of Object.entries(params.channels)) {
    const channel = asObjectRecord(channelValue);
    if (!channel || !Object.hasOwn(channel, "allow")) {
      continue;
    }
    const nextChannel = { ...channel };
    if (nextChannel.enabled === undefined) {
      nextChannel.enabled = channel.allow;
      params.changes.push(
        `Moved ${params.pathPrefix}.${channelId}.allow → ${params.pathPrefix}.${channelId}.enabled.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.${channelId}.allow (${params.pathPrefix}.${channelId}.enabled already set).`,
      );
    }
    delete nextChannel.allow;
    nextChannels[channelId] = nextChannel;
    changed = true;
  }
  return { channels: nextChannels, changed };
>>>>>>> upstream/main
}

export const legacyConfigRules: ChannelDoctorLegacyConfigRule[] = [
  {
    path: ["channels", "slack"],
    message:
      "channels.slack.streamMode, channels.slack.streaming (scalar), chunkMode, blockStreaming, blockStreamingCoalesce, and nativeStreaming are legacy; use channels.slack.streaming.{mode,chunkMode,block.enabled,block.coalesce,nativeTransport}.",
    match: hasLegacySlackStreamingAliases,
  },
  {
    path: ["channels", "slack", "accounts"],
    message:
      "channels.slack.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, blockStreamingCoalesce, and nativeStreaming are legacy; use channels.slack.accounts.<id>.streaming.{mode,chunkMode,block.enabled,block.coalesce,nativeTransport}.",
<<<<<<< HEAD
    match: hasLegacySlackAccountStreamingAliases,
=======
    match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacySlackStreamingAliases),
  },
  {
    path: ["channels", "slack"],
    message:
      'channels.slack.channels.<id>.allow is legacy; use channels.slack.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: hasLegacySlackChannelAllowAlias,
  },
  {
    path: ["channels", "slack", "accounts"],
    message:
      'channels.slack.accounts.<id>.channels.<id>.allow is legacy; use channels.slack.accounts.<id>.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => {
      const accounts = asObjectRecord(value);
      if (!accounts) {
        return false;
      }
      return Object.values(accounts).some((account) => hasLegacySlackChannelAllowAlias(account));
    },
>>>>>>> upstream/main
  },
];

export function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation {
  const rawEntry = asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.slack);
  if (!rawEntry) {
    return { config: cfg, changes: [] };
  }

  const changes: string[] = [];
<<<<<<< HEAD
  let updated = rawEntry;
  let changed = false;

  const baseStreaming = normalizeSlackStreamingAliases({
    entry: updated,
    pathPrefix: "channels.slack",
    changes,
  });
  updated = baseStreaming.entry;
  changed = changed || baseStreaming.changed;

  const rawAccounts = asObjectRecord(updated.accounts);
  if (rawAccounts) {
    let accountsChanged = false;
    const accounts = { ...rawAccounts };
    for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
      const account = asObjectRecord(rawAccount);
      if (!account) {
        continue;
      }
      const streaming = normalizeSlackStreamingAliases({
        entry: account,
        pathPrefix: `channels.slack.accounts.${accountId}`,
        changes,
      });
      if (streaming.changed) {
        accounts[accountId] = streaming.entry;
        accountsChanged = true;
      }
    }
    if (accountsChanged) {
      updated = { ...updated, accounts };
=======
  let updated;
  let changed;

  const aliases = normalizeLegacyChannelAliases({
    entry: rawEntry,
    pathPrefix: "channels.slack",
    changes,
    normalizeDm: true,
    normalizeAccountDm: true,
    resolveStreamingOptions: (entry) => ({
      resolvedMode: resolveSlackStreamingMode(entry),
      resolvedNativeTransport: resolveSlackNativeStreaming(entry),
    }),
  });
  updated = aliases.entry;
  changed = aliases.changed;

  const channels = asObjectRecord(updated.channels);
  if (channels) {
    const normalized = normalizeSlackChannelAllowAliases({
      channels,
      pathPrefix: "channels.slack.channels",
      changes,
    });
    if (normalized.changed) {
      updated = { ...updated, channels: normalized.channels };
      changed = true;
    }
  }

  const accounts = asObjectRecord(updated.accounts);
  if (accounts) {
    let accountsChanged = false;
    const nextAccounts = { ...accounts };
    for (const [accountId, accountValue] of Object.entries(accounts)) {
      const account = asObjectRecord(accountValue);
      const channelEntries = asObjectRecord(account?.channels);
      if (!account || !channelEntries) {
        continue;
      }
      const normalized = normalizeSlackChannelAllowAliases({
        channels: channelEntries,
        pathPrefix: `channels.slack.accounts.${accountId}.channels`,
        changes,
      });
      if (!normalized.changed) {
        continue;
      }
      nextAccounts[accountId] = { ...account, channels: normalized.channels };
      accountsChanged = true;
    }
    if (accountsChanged) {
      updated = { ...updated, accounts: nextAccounts };
>>>>>>> upstream/main
      changed = true;
    }
  }

  if (!changed) {
    return { config: cfg, changes: [] };
  }
  return {
    config: {
      ...cfg,
      channels: {
        ...cfg.channels,
        slack: updated as unknown as NonNullable<OpenClawConfig["channels"]>["slack"],
      } as OpenClawConfig["channels"],
    },
    changes,
  };
}
