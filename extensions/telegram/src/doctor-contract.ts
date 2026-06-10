<<<<<<< HEAD
=======
// Telegram plugin module implements doctor contract behavior.
>>>>>>> upstream/main
import type {
  ChannelDoctorConfigMutation,
  ChannelDoctorLegacyConfigRule,
} from "openclaw/plugin-sdk/channel-contract";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveTelegramPreviewStreamMode } from "./preview-streaming.js";

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

function normalizeTelegramStreamingAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): { entry: Record<string, unknown>; changed: boolean } {
  const beforeStreaming = params.entry.streaming;
  const hadLegacyStreamMode = params.entry.streamMode !== undefined;
  const hasLegacyFlatFields =
    params.entry.chunkMode !== undefined ||
    params.entry.blockStreaming !== undefined ||
    params.entry.draftChunk !== undefined ||
    params.entry.blockStreamingCoalesce !== undefined;
  const resolved = resolveTelegramPreviewStreamMode(params.entry);
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
  const preview = ensureNestedRecord(streaming, "preview");

  if (
    (hadLegacyStreamMode ||
      typeof beforeStreaming === "boolean" ||
      typeof beforeStreaming === "string") &&
    streaming.mode === undefined
  ) {
    streaming.mode = resolved;
    if (hadLegacyStreamMode) {
      params.changes.push(
        `Moved ${params.pathPrefix}.streamMode → ${params.pathPrefix}.streaming.mode (${resolved}).`,
      );
    } else if (typeof beforeStreaming === "boolean") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.mode (${resolved}).`,
      );
    } else if (typeof beforeStreaming === "string") {
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (scalar) → ${params.pathPrefix}.streaming.mode (${resolved}).`,
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
  if (updated.draftChunk !== undefined && preview.chunk === undefined) {
    preview.chunk = updated.draftChunk;
    delete updated.draftChunk;
    params.changes.push(
      `Moved ${params.pathPrefix}.draftChunk → ${params.pathPrefix}.streaming.preview.chunk.`,
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

  if (Object.keys(preview).length > 0) {
    streaming.preview = preview;
  }
  if (Object.keys(block).length > 0) {
    streaming.block = block;
  }
  updated.streaming = streaming;
  return { entry: updated, changed };
}

function hasLegacyTelegramStreamingAliases(value: unknown): boolean {
=======
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  asObjectRecord,
  hasLegacyAccountStreamingAliases,
  hasLegacyStreamingAliases,
  normalizeLegacyChannelAliases,
} from "openclaw/plugin-sdk/runtime-doctor";
import { resolveTelegramPreviewStreamMode } from "./preview-streaming.js";

function hasLegacyTelegramStreamingAliases(value: unknown): boolean {
  return hasLegacyStreamingAliases(value, { includePreviewChunk: true });
}

function hasRetiredTelegramDmConfig(value: unknown): boolean {
>>>>>>> upstream/main
  const entry = asObjectRecord(value);
  if (!entry) {
    return false;
  }
<<<<<<< HEAD
  return (
    entry.streamMode !== undefined ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    entry.chunkMode !== undefined ||
    entry.blockStreaming !== undefined ||
    entry.draftChunk !== undefined ||
    entry.blockStreamingCoalesce !== undefined
  );
}

function hasLegacyTelegramAccountStreamingAliases(value: unknown): boolean {
=======
  if (asObjectRecord(entry.dm)) {
    return true;
  }
  return Object.values(asObjectRecord(entry.direct) ?? {}).some(
    (direct) => asObjectRecord(direct)?.threadReplies !== undefined,
  );
}

function hasRetiredTelegramAccountDmConfig(value: unknown): boolean {
>>>>>>> upstream/main
  const accounts = asObjectRecord(value);
  if (!accounts) {
    return false;
  }
<<<<<<< HEAD
  return Object.values(accounts).some((account) => hasLegacyTelegramStreamingAliases(account));
=======
  return Object.values(accounts).some((account) => hasRetiredTelegramDmConfig(account));
}

function removeRetiredTelegramDmConfig(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): { entry: Record<string, unknown>; changed: boolean } {
  let updated = params.entry;
  let changed = false;
  const dm = asObjectRecord(updated.dm);
  if (dm) {
    const { dm: _ignored, ...rest } = updated;
    updated = rest;
    params.changes.push(
      dm.threadReplies === undefined
        ? `Removed ${params.pathPrefix}.dm.`
        : `Removed ${params.pathPrefix}.dm.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`,
    );
    changed = true;
  }

  const direct = asObjectRecord(updated.direct);
  if (direct) {
    let directChanged = false;
    const nextDirect = { ...direct };
    for (const [chatId, rawDirectConfig] of Object.entries(direct)) {
      const directConfig = asObjectRecord(rawDirectConfig);
      if (!directConfig || directConfig.threadReplies === undefined) {
        continue;
      }
      const nextDirectConfig = { ...directConfig };
      delete nextDirectConfig.threadReplies;
      nextDirect[chatId] = nextDirectConfig;
      params.changes.push(
        `Removed ${params.pathPrefix}.direct.${chatId}.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`,
      );
      directChanged = true;
    }
    if (directChanged) {
      updated = { ...updated, direct: nextDirect };
      changed = true;
    }
  }

  return { entry: updated, changed };
>>>>>>> upstream/main
}

function resolveCompatibleDefaultGroupEntry(section: Record<string, unknown>): {
  groups: Record<string, unknown>;
  entry: Record<string, unknown>;
} | null {
  const existingGroups = section.groups;
  if (existingGroups !== undefined && !asObjectRecord(existingGroups)) {
    return null;
  }
  const groups = asObjectRecord(existingGroups) ?? {};
  const defaultKey = "*";
  const existingEntry = groups[defaultKey];
  if (existingEntry !== undefined && !asObjectRecord(existingEntry)) {
    return null;
  }
  const entry = asObjectRecord(existingEntry) ?? {};
  return { groups, entry };
}

export const legacyConfigRules: ChannelDoctorLegacyConfigRule[] = [
  {
    path: ["channels", "telegram", "groupMentionsOnly"],
    message:
      'channels.telegram.groupMentionsOnly was removed; use channels.telegram.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["channels", "telegram"],
    message:
<<<<<<< HEAD
=======
      'channels.telegram.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramDmConfig,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      'channels.telegram.accounts.<id>.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramAccountDmConfig,
  },
  {
    path: ["channels", "telegram"],
    message:
>>>>>>> upstream/main
      "channels.telegram.streamMode, channels.telegram.streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce}.",
    match: hasLegacyTelegramStreamingAliases,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      "channels.telegram.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.accounts.<id>.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce}.",
<<<<<<< HEAD
    match: hasLegacyTelegramAccountStreamingAliases,
=======
    match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyTelegramStreamingAliases),
>>>>>>> upstream/main
  },
];

export function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation {
  const rawEntry = asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.telegram);
  if (!rawEntry) {
    return { config: cfg, changes: [] };
  }

  const changes: string[] = [];
  let updated = rawEntry;
  let changed = false;

<<<<<<< HEAD
=======
  const removedThreadReplies = removeRetiredTelegramDmConfig({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = removedThreadReplies.entry;
  changed = changed || removedThreadReplies.changed;

>>>>>>> upstream/main
  if (updated.groupMentionsOnly !== undefined) {
    const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(updated);
    if (!defaultGroupEntry) {
      changes.push(
        "Skipped channels.telegram.groupMentionsOnly migration because channels.telegram.groups already has an incompatible shape; fix remaining issues manually.",
      );
    } else {
      const { groups, entry } = defaultGroupEntry;
      if (entry.requireMention === undefined) {
        entry.requireMention = updated.groupMentionsOnly;
        groups["*"] = entry;
        updated = { ...updated, groups };
        changes.push(
          'Moved channels.telegram.groupMentionsOnly → channels.telegram.groups."*".requireMention.',
        );
      } else {
        changes.push(
          'Removed channels.telegram.groupMentionsOnly (channels.telegram.groups."*" already set).',
        );
      }
      const { groupMentionsOnly: _ignored, ...rest } = updated;
      updated = rest;
      changed = true;
    }
  }

<<<<<<< HEAD
  const base = normalizeTelegramStreamingAliases({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = base.entry;
  changed = changed || base.changed;

  const rawAccounts = asObjectRecord(updated.accounts);
  if (rawAccounts) {
    let accountsChanged = false;
    const accounts = { ...rawAccounts };
    for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
=======
  const aliases = normalizeLegacyChannelAliases({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
    resolveStreamingOptions: (entry) => ({
      includePreviewChunk: true,
      resolvedMode: resolveTelegramPreviewStreamMode(entry),
    }),
  });
  updated = aliases.entry;
  changed = changed || aliases.changed;

  const accounts = asObjectRecord(updated.accounts);
  if (accounts) {
    let accountsChanged = false;
    const nextAccounts = { ...accounts };
    for (const [accountId, rawAccount] of Object.entries(accounts)) {
>>>>>>> upstream/main
      const account = asObjectRecord(rawAccount);
      if (!account) {
        continue;
      }
<<<<<<< HEAD
      const accountStreaming = normalizeTelegramStreamingAliases({
=======
      const accountRemovedThreadReplies = removeRetiredTelegramDmConfig({
>>>>>>> upstream/main
        entry: account,
        pathPrefix: `channels.telegram.accounts.${accountId}`,
        changes,
      });
<<<<<<< HEAD
      if (accountStreaming.changed) {
        accounts[accountId] = accountStreaming.entry;
=======
      if (accountRemovedThreadReplies.changed) {
        nextAccounts[accountId] = accountRemovedThreadReplies.entry;
>>>>>>> upstream/main
        accountsChanged = true;
      }
    }
    if (accountsChanged) {
<<<<<<< HEAD
      updated = { ...updated, accounts };
=======
      updated = { ...updated, accounts: nextAccounts };
>>>>>>> upstream/main
      changed = true;
    }
  }

  if (!changed && changes.length === 0) {
    return { config: cfg, changes: [] };
  }
  return {
    config: {
      ...cfg,
      channels: {
        ...cfg.channels,
        telegram: updated as unknown as NonNullable<OpenClawConfig["channels"]>["telegram"],
      } as OpenClawConfig["channels"],
    },
    changes,
  };
}
