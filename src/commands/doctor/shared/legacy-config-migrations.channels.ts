<<<<<<< HEAD
import {
  defineLegacyConfigMigration,
=======
// Legacy channel config migrations for routing, streaming, groups, and account aliases.
import {
  defineLegacyConfigMigration,
  ensureRecord,
>>>>>>> upstream/main
  getRecord,
  type LegacyConfigMigrationSpec,
  type LegacyConfigRule,
} from "../../../config/legacy.shared.js";

<<<<<<< HEAD
type StreamingMode = "off" | "partial" | "block" | "progress";
type DiscordPreviewStreamMode = "off" | "partial" | "block";
type TelegramPreviewStreamMode = "off" | "partial" | "block";
type SlackLegacyDraftStreamMode = "replace" | "status_final" | "append";

function hasOwnKey(target: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function normalizeStreamingMode(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

function parseStreamingMode(value: unknown): StreamingMode | null {
  const normalized = normalizeStreamingMode(value);
  if (
    normalized === "off" ||
    normalized === "partial" ||
    normalized === "block" ||
    normalized === "progress"
  ) {
    return normalized;
  }
  return null;
}

function parseDiscordPreviewStreamMode(value: unknown): DiscordPreviewStreamMode | null {
  const parsed = parseStreamingMode(value);
  if (!parsed) {
    return null;
  }
  return parsed === "progress" ? "partial" : parsed;
}

function parseTelegramPreviewStreamMode(value: unknown): TelegramPreviewStreamMode | null {
  const parsed = parseStreamingMode(value);
  if (!parsed) {
    return null;
  }
  return parsed === "progress" ? "partial" : parsed;
}

function parseSlackLegacyDraftStreamMode(value: unknown): SlackLegacyDraftStreamMode | null {
  const normalized = normalizeStreamingMode(value);
  if (normalized === "replace" || normalized === "status_final" || normalized === "append") {
    return normalized;
  }
  return null;
}

function mapSlackLegacyDraftStreamModeToStreaming(mode: SlackLegacyDraftStreamMode): StreamingMode {
  if (mode === "append") {
    return "block";
  }
  if (mode === "status_final") {
    return "progress";
  }
  return "partial";
}

function resolveTelegramPreviewStreamMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): TelegramPreviewStreamMode {
  const parsedStreaming = parseStreamingMode(params.streaming);
  if (parsedStreaming) {
    return parsedStreaming === "progress" ? "partial" : parsedStreaming;
  }

  const legacy = parseTelegramPreviewStreamMode(params.streamMode);
  if (legacy) {
    return legacy;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming ? "partial" : "off";
  }
  return "partial";
}

function resolveDiscordPreviewStreamMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): DiscordPreviewStreamMode {
  const parsedStreaming = parseDiscordPreviewStreamMode(params.streaming);
  if (parsedStreaming) {
    return parsedStreaming;
  }

  const legacy = parseDiscordPreviewStreamMode(params.streamMode);
  if (legacy) {
    return legacy;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming ? "partial" : "off";
  }
  return "off";
}

function resolveSlackStreamingMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): StreamingMode {
  const parsedStreaming = parseStreamingMode(params.streaming);
  if (parsedStreaming) {
    return parsedStreaming;
  }
  const legacyStreamMode = parseSlackLegacyDraftStreamMode(params.streamMode);
  if (legacyStreamMode) {
    return mapSlackLegacyDraftStreamModeToStreaming(legacyStreamMode);
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming ? "partial" : "off";
  }
  return "partial";
}

function resolveSlackNativeStreaming(
  params: {
    nativeStreaming?: unknown;
    streaming?: unknown;
  } = {},
): boolean {
  if (typeof params.nativeStreaming === "boolean") {
    return params.nativeStreaming;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming;
  }
  return true;
=======
function hasOwnKey(target: Record<string, unknown>, key: string): boolean {
  return Object.hasOwn(target, key);
}

function cleanupEmptyRecord(parent: Record<string, unknown>, key: string): void {
  const value = getRecord(parent[key]);
  if (value && Object.keys(value).length === 0) {
    delete parent[key];
  }
}

function resolveCompatibleDefaultGroupEntry(section: Record<string, unknown>): {
  groups: Record<string, unknown>;
  entry: Record<string, unknown>;
} | null {
  const existingGroups = section.groups;
  if (existingGroups !== undefined && !getRecord(existingGroups)) {
    return null;
  }
  const groups = getRecord(existingGroups) ?? {};
  const defaultKey = "*";
  const existingEntry = groups[defaultKey];
  if (existingEntry !== undefined && !getRecord(existingEntry)) {
    return null;
  }
  const entry = getRecord(existingEntry) ?? {};
  return { groups, entry };
}

function migrateChannelDefaultRequireMention(params: {
  section: Record<string, unknown>;
  channelId: string;
  legacyPath: string;
  requireMention: unknown;
  changes: string[];
}): boolean {
  const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(params.section);
  if (!defaultGroupEntry) {
    params.changes.push(
      `Removed ${params.legacyPath} (channels.${params.channelId}.groups has an incompatible shape; fix remaining issues manually).`,
    );
    return false;
  }

  const { groups, entry } = defaultGroupEntry;
  if (entry.requireMention === undefined) {
    entry.requireMention = params.requireMention;
    groups["*"] = entry;
    params.section.groups = groups;
    params.changes.push(
      `Moved ${params.legacyPath} → channels.${params.channelId}.groups."*".requireMention.`,
    );
    return true;
  }

  params.changes.push(
    `Removed ${params.legacyPath} (channels.${params.channelId}.groups."*" already set).`,
  );
  return false;
}

function migrateRoutingAllowFrom(raw: Record<string, unknown>, changes: string[]): void {
  const routing = getRecord(raw.routing);
  if (!routing || routing.allowFrom === undefined) {
    return;
  }

  const channels = getRecord(raw.channels);
  const whatsapp = getRecord(channels?.whatsapp);
  if (!channels || !whatsapp) {
    delete routing.allowFrom;
    cleanupEmptyRecord(raw, "routing");
    changes.push("Removed routing.allowFrom (channels.whatsapp not configured).");
    return;
  }

  if (whatsapp.allowFrom === undefined) {
    whatsapp.allowFrom = routing.allowFrom;
    changes.push("Moved routing.allowFrom → channels.whatsapp.allowFrom.");
  } else {
    changes.push("Removed routing.allowFrom (channels.whatsapp.allowFrom already set).");
  }

  delete routing.allowFrom;
  channels.whatsapp = whatsapp;
  raw.channels = channels;
  cleanupEmptyRecord(raw, "routing");
}

function migrateRoutingGroupChatMessages(params: {
  raw: Record<string, unknown>;
  routing: Record<string, unknown>;
  groupChat: Record<string, unknown>;
  changes: string[];
}): void {
  const migrateMessageGroupField = (field: "historyLimit" | "mentionPatterns") => {
    const value = params.groupChat[field];
    if (value === undefined) {
      return;
    }

    const messages = ensureRecord(params.raw, "messages");
    const messagesGroup = ensureRecord(messages, "groupChat");
    if (messagesGroup[field] === undefined) {
      messagesGroup[field] = value;
      params.changes.push(`Moved routing.groupChat.${field} → messages.groupChat.${field}.`);
    } else {
      params.changes.push(
        `Removed routing.groupChat.${field} (messages.groupChat.${field} already set).`,
      );
    }
    delete params.groupChat[field];
  };

  migrateMessageGroupField("historyLimit");
  migrateMessageGroupField("mentionPatterns");

  if (Object.keys(params.groupChat).length === 0) {
    delete params.routing.groupChat;
  } else {
    params.routing.groupChat = params.groupChat;
  }
}

function migrateRoutingGroupChatRequireMention(params: {
  raw: Record<string, unknown>;
  groupChat: Record<string, unknown>;
  changes: string[];
}): void {
  const requireMention = params.groupChat.requireMention;
  if (requireMention === undefined) {
    return;
  }

  const channels = getRecord(params.raw.channels);
  let matchedChannel = false;
  if (channels) {
    for (const channelId of ["whatsapp", "telegram", "imessage"]) {
      const section = getRecord(channels[channelId]);
      if (!section) {
        continue;
      }
      matchedChannel = true;
      migrateChannelDefaultRequireMention({
        section,
        channelId,
        legacyPath: "routing.groupChat.requireMention",
        requireMention,
        changes: params.changes,
      });
      channels[channelId] = section;
    }
    params.raw.channels = channels;
  }

  if (!matchedChannel) {
    params.changes.push(
      "Removed routing.groupChat.requireMention (no configured WhatsApp, Telegram, or iMessage channel found).",
    );
  }
  delete params.groupChat.requireMention;
}

function migrateRoutingGroupChat(raw: Record<string, unknown>, changes: string[]): void {
  const routing = getRecord(raw.routing);
  const groupChat = getRecord(routing?.groupChat);
  if (!routing || !groupChat) {
    return;
  }

  migrateRoutingGroupChatRequireMention({ raw, groupChat, changes });
  migrateRoutingGroupChatMessages({ raw, routing, groupChat, changes });
  cleanupEmptyRecord(raw, "routing");
}

function migrateTelegramRequireMention(raw: Record<string, unknown>, changes: string[]): void {
  const channels = getRecord(raw.channels);
  const telegram = getRecord(channels?.telegram);
  if (!channels || !telegram || telegram.requireMention === undefined) {
    return;
  }

  migrateChannelDefaultRequireMention({
    section: telegram,
    channelId: "telegram",
    legacyPath: "channels.telegram.requireMention",
    requireMention: telegram.requireMention,
    changes,
  });
  delete telegram.requireMention;
  channels.telegram = telegram;
  raw.channels = channels;
}

function hasLegacyFeishuAccountBotName(value: unknown): boolean {
  const accounts = getRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((entry) => {
    const account = getRecord(entry);
    return Boolean(account && hasOwnKey(account, "botName"));
  });
}

function migrateFeishuAccountBotName(raw: Record<string, unknown>, changes: string[]): void {
  const channels = getRecord(raw.channels);
  const feishu = getRecord(channels?.feishu);
  const accounts = getRecord(feishu?.accounts);
  if (!channels || !feishu || !accounts) {
    return;
  }

  for (const [accountId, accountRaw] of Object.entries(accounts)) {
    const account = getRecord(accountRaw);
    if (!account || !hasOwnKey(account, "botName")) {
      continue;
    }

    const legacyPath = `channels.feishu.accounts.${accountId}.botName`;
    const currentPath = `channels.feishu.accounts.${accountId}.name`;
    if (account.name === undefined) {
      account.name = account.botName;
      changes.push(`Moved ${legacyPath} → ${currentPath}.`);
    } else {
      changes.push(`Removed ${legacyPath} (${currentPath} already set).`);
    }
    delete account.botName;
    accounts[accountId] = account;
  }

  feishu.accounts = accounts;
  channels.feishu = feishu;
  raw.channels = channels;
>>>>>>> upstream/main
}

function hasLegacyThreadBindingTtl(value: unknown): boolean {
  const threadBindings = getRecord(value);
  return Boolean(threadBindings && hasOwnKey(threadBindings, "ttlHours"));
}

<<<<<<< HEAD
=======
function hasLegacyThreadBindingSpawnSplit(value: unknown): boolean {
  const threadBindings = getRecord(value);
  return Boolean(
    threadBindings &&
    (hasOwnKey(threadBindings, "spawnSubagentSessions") ||
      hasOwnKey(threadBindings, "spawnAcpSessions")),
  );
}

>>>>>>> upstream/main
function hasLegacyThreadBindingTtlInAccounts(value: unknown): boolean {
  const accounts = getRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((entry) =>
    hasLegacyThreadBindingTtl(getRecord(entry)?.threadBindings),
  );
}

<<<<<<< HEAD
=======
function hasLegacyThreadBindingSpawnSplitInAccounts(value: unknown): boolean {
  const accounts = getRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((entry) =>
    hasLegacyThreadBindingSpawnSplit(getRecord(entry)?.threadBindings),
  );
}

>>>>>>> upstream/main
function migrateThreadBindingsTtlHoursForPath(params: {
  owner: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): boolean {
  const threadBindings = getRecord(params.owner.threadBindings);
  if (!threadBindings || !hasOwnKey(threadBindings, "ttlHours")) {
    return false;
  }

  const hadIdleHours = threadBindings.idleHours !== undefined;
  if (!hadIdleHours) {
    threadBindings.idleHours = threadBindings.ttlHours;
  }
  delete threadBindings.ttlHours;
  params.owner.threadBindings = threadBindings;

  if (hadIdleHours) {
    params.changes.push(
      `Removed ${params.pathPrefix}.threadBindings.ttlHours (${params.pathPrefix}.threadBindings.idleHours already set).`,
    );
  } else {
    params.changes.push(
      `Moved ${params.pathPrefix}.threadBindings.ttlHours → ${params.pathPrefix}.threadBindings.idleHours.`,
    );
  }
  return true;
}

<<<<<<< HEAD
=======
function resolveMigratedSpawnSessions(
  threadBindings: Record<string, unknown>,
): boolean | undefined {
  const subagent = threadBindings.spawnSubagentSessions;
  const acp = threadBindings.spawnAcpSessions;
  const subagentBool = typeof subagent === "boolean" ? subagent : undefined;
  const acpBool = typeof acp === "boolean" ? acp : undefined;
  if (subagentBool === undefined) {
    return acpBool;
  }
  if (acpBool === undefined) {
    return subagentBool;
  }
  return subagentBool && acpBool;
}

function migrateThreadBindingsSpawnSessionsForPath(params: {
  owner: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): boolean {
  const threadBindings = getRecord(params.owner.threadBindings);
  if (!threadBindings || !hasLegacyThreadBindingSpawnSplit(threadBindings)) {
    return false;
  }

  const hadSpawnSessions = threadBindings.spawnSessions !== undefined;
  const resolved = resolveMigratedSpawnSessions(threadBindings);
  const oldSubagent = threadBindings.spawnSubagentSessions;
  const oldAcp = threadBindings.spawnAcpSessions;
  delete threadBindings.spawnSubagentSessions;
  delete threadBindings.spawnAcpSessions;
  if (!hadSpawnSessions && resolved !== undefined) {
    threadBindings.spawnSessions = resolved;
  }
  params.owner.threadBindings = threadBindings;

  if (hadSpawnSessions) {
    params.changes.push(
      `Removed deprecated ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions (${params.pathPrefix}.threadBindings.spawnSessions already set).`,
    );
  } else if (
    typeof oldSubagent === "boolean" &&
    typeof oldAcp === "boolean" &&
    oldSubagent !== oldAcp
  ) {
    params.changes.push(
      `Collapsed conflicting ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`,
    );
  } else {
    params.changes.push(
      `Moved ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`,
    );
  }
  return true;
}

>>>>>>> upstream/main
function hasLegacyThreadBindingTtlInAnyChannel(value: unknown): boolean {
  const channels = getRecord(value);
  if (!channels) {
    return false;
  }
  return Object.values(channels).some((entry) => {
    const channel = getRecord(entry);
    if (!channel) {
      return false;
    }
    return (
      hasLegacyThreadBindingTtl(channel.threadBindings) ||
      hasLegacyThreadBindingTtlInAccounts(channel.accounts)
    );
  });
}

<<<<<<< HEAD
function hasLegacyTelegramStreamingKeys(value: unknown): boolean {
  const entry = getRecord(value);
  if (!entry) {
    return false;
  }
  return (
    entry.streamMode !== undefined ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    hasOwnKey(entry, "chunkMode") ||
    hasOwnKey(entry, "blockStreaming") ||
    hasOwnKey(entry, "draftChunk") ||
    hasOwnKey(entry, "blockStreamingCoalesce")
  );
}

function hasLegacyDiscordStreamingKeys(value: unknown): boolean {
  const entry = getRecord(value);
  if (!entry) {
    return false;
  }
  return (
    entry.streamMode !== undefined ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    hasOwnKey(entry, "chunkMode") ||
    hasOwnKey(entry, "blockStreaming") ||
    hasOwnKey(entry, "draftChunk") ||
    hasOwnKey(entry, "blockStreamingCoalesce")
  );
}

function hasLegacySlackStreamingKeys(value: unknown): boolean {
  const entry = getRecord(value);
  if (!entry) {
    return false;
  }
  return (
    entry.streamMode !== undefined ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    hasOwnKey(entry, "chunkMode") ||
    hasOwnKey(entry, "blockStreaming") ||
    hasOwnKey(entry, "blockStreamingCoalesce") ||
    hasOwnKey(entry, "nativeStreaming")
  );
}

function ensureNestedRecord(owner: Record<string, unknown>, key: string): Record<string, unknown> {
  const existing = getRecord(owner[key]);
  if (existing) {
    return existing;
  }
  const created: Record<string, unknown> = {};
  owner[key] = created;
  return created;
}

function moveLegacyStreamingShapeForPath(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  resolveMode?: (entry: Record<string, unknown>) => string;
  resolveNativeTransport?: (entry: Record<string, unknown>) => boolean;
}): boolean {
  let changed = false;
  const legacyStreaming = params.entry.streaming;
  const legacyStreamingInput = {
    ...params.entry,
    streaming: legacyStreaming,
  };
  const legacyNativeTransportInput = {
    nativeStreaming: params.entry.nativeStreaming,
    streaming: legacyStreaming,
  };
  const hadLegacyStreamMode = hasOwnKey(params.entry, "streamMode");
  const hadLegacyStreamingScalar =
    typeof legacyStreaming === "string" || typeof legacyStreaming === "boolean";

  if (params.resolveMode && (hadLegacyStreamMode || hadLegacyStreamingScalar)) {
    const streaming = ensureNestedRecord(params.entry, "streaming");
    if (!hasOwnKey(streaming, "mode")) {
      const resolvedMode = params.resolveMode(legacyStreamingInput);
      streaming.mode = resolvedMode;
      if (hadLegacyStreamMode) {
        params.changes.push(
          `Moved ${params.pathPrefix}.streamMode → ${params.pathPrefix}.streaming.mode (${resolvedMode}).`,
        );
      }
      if (typeof legacyStreaming === "boolean") {
        params.changes.push(
          `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.mode (${resolvedMode}).`,
        );
      } else if (typeof legacyStreaming === "string") {
        params.changes.push(
          `Moved ${params.pathPrefix}.streaming (scalar) → ${params.pathPrefix}.streaming.mode (${resolvedMode}).`,
        );
      }
    } else {
      params.changes.push(
        `Removed legacy ${params.pathPrefix}.streaming mode aliases (${params.pathPrefix}.streaming.mode already set).`,
      );
    }
    changed = true;
  }

  if (hadLegacyStreamMode) {
    delete params.entry.streamMode;
    changed = true;
  }

  if (hadLegacyStreamingScalar) {
    if (!getRecord(params.entry.streaming)) {
      params.entry.streaming = {};
    }
    changed = true;
  }

  if (hasOwnKey(params.entry, "chunkMode")) {
    const streaming = ensureNestedRecord(params.entry, "streaming");
    if (!hasOwnKey(streaming, "chunkMode")) {
      streaming.chunkMode = params.entry.chunkMode;
      params.changes.push(
        `Moved ${params.pathPrefix}.chunkMode → ${params.pathPrefix}.streaming.chunkMode.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.chunkMode (${params.pathPrefix}.streaming.chunkMode already set).`,
      );
    }
    delete params.entry.chunkMode;
    changed = true;
  }

  if (hasOwnKey(params.entry, "blockStreaming")) {
    const block = ensureNestedRecord(ensureNestedRecord(params.entry, "streaming"), "block");
    if (!hasOwnKey(block, "enabled")) {
      block.enabled = params.entry.blockStreaming;
      params.changes.push(
        `Moved ${params.pathPrefix}.blockStreaming → ${params.pathPrefix}.streaming.block.enabled.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.blockStreaming (${params.pathPrefix}.streaming.block.enabled already set).`,
      );
    }
    delete params.entry.blockStreaming;
    changed = true;
  }

  if (hasOwnKey(params.entry, "draftChunk")) {
    const preview = ensureNestedRecord(ensureNestedRecord(params.entry, "streaming"), "preview");
    if (!hasOwnKey(preview, "chunk")) {
      preview.chunk = params.entry.draftChunk;
      params.changes.push(
        `Moved ${params.pathPrefix}.draftChunk → ${params.pathPrefix}.streaming.preview.chunk.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.draftChunk (${params.pathPrefix}.streaming.preview.chunk already set).`,
      );
    }
    delete params.entry.draftChunk;
    changed = true;
  }

  if (hasOwnKey(params.entry, "blockStreamingCoalesce")) {
    const block = ensureNestedRecord(ensureNestedRecord(params.entry, "streaming"), "block");
    if (!hasOwnKey(block, "coalesce")) {
      block.coalesce = params.entry.blockStreamingCoalesce;
      params.changes.push(
        `Moved ${params.pathPrefix}.blockStreamingCoalesce → ${params.pathPrefix}.streaming.block.coalesce.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.blockStreamingCoalesce (${params.pathPrefix}.streaming.block.coalesce already set).`,
      );
    }
    delete params.entry.blockStreamingCoalesce;
    changed = true;
  }

  if (params.resolveNativeTransport && hasOwnKey(params.entry, "nativeStreaming")) {
    const streaming = ensureNestedRecord(params.entry, "streaming");
    if (!hasOwnKey(streaming, "nativeTransport")) {
      streaming.nativeTransport = params.resolveNativeTransport(legacyNativeTransportInput);
      params.changes.push(
        `Moved ${params.pathPrefix}.nativeStreaming → ${params.pathPrefix}.streaming.nativeTransport.`,
      );
    } else {
      params.changes.push(
        `Removed ${params.pathPrefix}.nativeStreaming (${params.pathPrefix}.streaming.nativeTransport already set).`,
      );
    }
    delete params.entry.nativeStreaming;
    changed = true;
  } else if (params.resolveNativeTransport && typeof legacyStreaming === "boolean") {
    const streaming = ensureNestedRecord(params.entry, "streaming");
    if (!hasOwnKey(streaming, "nativeTransport")) {
      streaming.nativeTransport = params.resolveNativeTransport(legacyNativeTransportInput);
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.nativeTransport.`,
      );
      changed = true;
    }
  }

  return changed;
}

function hasLegacyGoogleChatStreamMode(value: unknown): boolean {
  const entry = getRecord(value);
  if (!entry) {
    return false;
  }
  return entry.streamMode !== undefined;
}

function hasLegacyKeysInAccounts(
  value: unknown,
  matchEntry: (entry: Record<string, unknown>) => boolean,
): boolean {
  const accounts = getRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((entry) => matchEntry(getRecord(entry) ?? {}));
}

function hasLegacyAllowAlias(entry: Record<string, unknown>): boolean {
  return hasOwnKey(entry, "allow");
}

function migrateAllowAliasForPath(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): boolean {
  if (!hasLegacyAllowAlias(params.entry)) {
    return false;
  }

  const legacyAllow = params.entry.allow;
  const hadEnabled = params.entry.enabled !== undefined;
  if (!hadEnabled) {
    params.entry.enabled = legacyAllow;
  }
  delete params.entry.allow;

  if (hadEnabled) {
    params.changes.push(
      `Removed ${params.pathPrefix}.allow (${params.pathPrefix}.enabled already set).`,
    );
  } else {
    params.changes.push(`Moved ${params.pathPrefix}.allow → ${params.pathPrefix}.enabled.`);
  }
  return true;
}

function hasLegacySlackChannelAllowAlias(value: unknown): boolean {
  const entry = getRecord(value);
  const channels = getRecord(entry?.channels);
  if (!channels) {
    return false;
  }
  return Object.values(channels).some((channel) => hasLegacyAllowAlias(getRecord(channel) ?? {}));
}

function hasLegacyGoogleChatGroupAllowAlias(value: unknown): boolean {
  const entry = getRecord(value);
  const groups = getRecord(entry?.groups);
  if (!groups) {
    return false;
  }
  return Object.values(groups).some((group) => hasLegacyAllowAlias(getRecord(group) ?? {}));
}

function hasLegacyDiscordGuildChannelAllowAlias(value: unknown): boolean {
  const entry = getRecord(value);
  const guilds = getRecord(entry?.guilds);
  if (!guilds) {
    return false;
  }
  return Object.values(guilds).some((guildValue) => {
    const channels = getRecord(getRecord(guildValue)?.channels);
    if (!channels) {
      return false;
    }
    return Object.values(channels).some((channel) => hasLegacyAllowAlias(getRecord(channel) ?? {}));
=======
function hasLegacyThreadBindingSpawnSplitInAnyChannel(value: unknown): boolean {
  const channels = getRecord(value);
  if (!channels) {
    return false;
  }
  return Object.values(channels).some((entry) => {
    const channel = getRecord(entry);
    if (!channel) {
      return false;
    }
    return (
      hasLegacyThreadBindingSpawnSplit(channel.threadBindings) ||
      hasLegacyThreadBindingSpawnSplitInAccounts(channel.accounts)
    );
>>>>>>> upstream/main
  });
}

const THREAD_BINDING_RULES: LegacyConfigRule[] = [
  {
    path: ["session", "threadBindings"],
    message:
      'session.threadBindings.ttlHours was renamed to session.threadBindings.idleHours. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingTtl(value),
  },
  {
    path: ["channels"],
    message:
      'channels.<id>.threadBindings.ttlHours was renamed to channels.<id>.threadBindings.idleHours. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingTtlInAnyChannel(value),
  },
<<<<<<< HEAD
];

const CHANNEL_STREAMING_RULES: LegacyConfigRule[] = [
  {
    path: ["channels", "telegram"],
    message:
      'channels.telegram.streamMode, channels.telegram.streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyTelegramStreamingKeys(value),
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      'channels.telegram.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.accounts.<id>.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacyTelegramStreamingKeys),
  },
  {
    path: ["channels", "discord"],
    message:
      'channels.discord.streamMode, channels.discord.streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.discord.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyDiscordStreamingKeys(value),
  },
  {
    path: ["channels", "discord", "accounts"],
    message:
      'channels.discord.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.discord.accounts.<id>.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacyDiscordStreamingKeys),
  },
  {
    path: ["channels", "slack"],
    message:
      'channels.slack.streamMode, channels.slack.streaming (scalar), chunkMode, blockStreaming, blockStreamingCoalesce, and nativeStreaming are legacy; use channels.slack.streaming.{mode,chunkMode,block.enabled,block.coalesce,nativeTransport} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacySlackStreamingKeys(value),
  },
  {
    path: ["channels", "slack", "accounts"],
    message:
      'channels.slack.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, blockStreamingCoalesce, and nativeStreaming are legacy; use channels.slack.accounts.<id>.streaming.{mode,chunkMode,block.enabled,block.coalesce,nativeTransport} instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacySlackStreamingKeys),
  },
];

const CHANNEL_ENABLED_ALIAS_RULES: LegacyConfigRule[] = [
  {
    path: ["channels", "slack"],
    message:
      'channels.slack.channels.<id>.allow is legacy; use channels.slack.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacySlackChannelAllowAlias(value),
  },
  {
    path: ["channels", "slack", "accounts"],
    message:
      'channels.slack.accounts.<id>.channels.<id>.allow is legacy; use channels.slack.accounts.<id>.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacySlackChannelAllowAlias),
  },
  {
    path: ["channels", "googlechat"],
    message:
      'channels.googlechat.groups.<id>.allow is legacy; use channels.googlechat.groups.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyGoogleChatGroupAllowAlias(value),
  },
  {
    path: ["channels", "googlechat", "accounts"],
    message:
      'channels.googlechat.accounts.<id>.groups.<id>.allow is legacy; use channels.googlechat.accounts.<id>.groups.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacyGoogleChatGroupAllowAlias),
  },
  {
    path: ["channels", "discord"],
    message:
      'channels.discord.guilds.<id>.channels.<id>.allow is legacy; use channels.discord.guilds.<id>.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyDiscordGuildChannelAllowAlias(value),
  },
  {
    path: ["channels", "discord", "accounts"],
    message:
      'channels.discord.accounts.<id>.guilds.<id>.channels.<id>.allow is legacy; use channels.discord.accounts.<id>.guilds.<id>.channels.<id>.enabled instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacyDiscordGuildChannelAllowAlias),
  },
];

const GOOGLECHAT_STREAMMODE_RULES: LegacyConfigRule[] = [
  {
    path: ["channels", "googlechat"],
    message: "channels.googlechat.streamMode is legacy and no longer used; it is removed on load.",
    match: (value) => hasLegacyGoogleChatStreamMode(value),
  },
  {
    path: ["channels", "googlechat", "accounts"],
    message:
      "channels.googlechat.accounts.<id>.streamMode is legacy and no longer used; it is removed on load.",
    match: (value) => hasLegacyKeysInAccounts(value, hasLegacyGoogleChatStreamMode),
  },
];

export const LEGACY_CONFIG_MIGRATIONS_CHANNELS: LegacyConfigMigrationSpec[] = [
  defineLegacyConfigMigration({
=======
  {
    path: ["session", "threadBindings"],
    message:
      'session.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by session.threadBindings.spawnSessions. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingSpawnSplit(value),
  },
  {
    path: ["channels"],
    message:
      'channels.<id>.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by channels.<id>.threadBindings.spawnSessions. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingSpawnSplitInAnyChannel(value),
  },
];

const GROUP_ROUTING_RULES: LegacyConfigRule[] = [
  {
    path: ["routing", "allowFrom"],
    message:
      'routing.allowFrom was removed; use channels.whatsapp.allowFrom instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "requireMention"],
    message:
      'routing.groupChat.requireMention was removed; use channels.<channel>.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "historyLimit"],
    message:
      'routing.groupChat.historyLimit was moved; use messages.groupChat.historyLimit instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "mentionPatterns"],
    message:
      'routing.groupChat.mentionPatterns was moved; use messages.groupChat.mentionPatterns instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["channels", "telegram", "requireMention"],
    message:
      'channels.telegram.requireMention was removed; use channels.telegram.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
];

const FEISHU_ACCOUNT_RULES: LegacyConfigRule[] = [
  {
    path: ["channels", "feishu", "accounts"],
    message:
      'channels.feishu.accounts.<id>.botName was renamed to channels.feishu.accounts.<id>.name. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyFeishuAccountBotName(value),
  },
];

const WEBCHAT_CHANNEL_RULES: LegacyConfigRule[] = [
  {
    path: ["channels", "webchat"],
    message: 'channels.webchat is retired. Run "openclaw doctor --fix".',
  },
];

function migrateRetiredWebchatChannelConfig(raw: Record<string, unknown>, changes: string[]): void {
  const channels = getRecord(raw.channels);
  if (!channels || !hasOwnKey(channels, "webchat")) {
    return;
  }

  delete channels.webchat;
  raw.channels = channels;
  cleanupEmptyRecord(raw, "channels");
  changes.push("Removed retired channels.webchat config.");
}

/** Legacy config migration specs for channel-owned compatibility keys. */
export const LEGACY_CONFIG_MIGRATIONS_CHANNELS: LegacyConfigMigrationSpec[] = [
  defineLegacyConfigMigration({
    id: "channels.webchat-remove",
    describe: "Remove retired WebChat channel config",
    legacyRules: WEBCHAT_CHANNEL_RULES,
    apply: (raw, changes) => {
      migrateRetiredWebchatChannelConfig(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
    id: "legacy-group-routing->channel-groups",
    describe:
      "Move legacy routing group chat settings to current channel group and messages config",
    legacyRules: GROUP_ROUTING_RULES,
    apply: (raw, changes) => {
      migrateRoutingAllowFrom(raw, changes);
      migrateRoutingGroupChat(raw, changes);
      migrateTelegramRequireMention(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
    id: "feishu.accounts.botName->name",
    describe: "Move legacy Feishu account botName config to account name",
    legacyRules: FEISHU_ACCOUNT_RULES,
    apply: (raw, changes) => {
      migrateFeishuAccountBotName(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
>>>>>>> upstream/main
    id: "thread-bindings.ttlHours->idleHours",
    describe:
      "Move legacy threadBindings.ttlHours keys to threadBindings.idleHours (session + channel configs)",
    legacyRules: THREAD_BINDING_RULES,
    apply: (raw, changes) => {
      const session = getRecord(raw.session);
      if (session) {
        migrateThreadBindingsTtlHoursForPath({
          owner: session,
          pathPrefix: "session",
          changes,
        });
<<<<<<< HEAD
=======
        migrateThreadBindingsSpawnSessionsForPath({
          owner: session,
          pathPrefix: "session",
          changes,
        });
>>>>>>> upstream/main
        raw.session = session;
      }

      const channels = getRecord(raw.channels);
      if (!channels) {
        return;
      }

      for (const [channelId, channelRaw] of Object.entries(channels)) {
        const channel = getRecord(channelRaw);
        if (!channel) {
          continue;
        }
        migrateThreadBindingsTtlHoursForPath({
          owner: channel,
          pathPrefix: `channels.${channelId}`,
          changes,
        });
<<<<<<< HEAD
=======
        migrateThreadBindingsSpawnSessionsForPath({
          owner: channel,
          pathPrefix: `channels.${channelId}`,
          changes,
        });
>>>>>>> upstream/main

        const accounts = getRecord(channel.accounts);
        if (accounts) {
          for (const [accountId, accountRaw] of Object.entries(accounts)) {
            const account = getRecord(accountRaw);
            if (!account) {
              continue;
            }
            migrateThreadBindingsTtlHoursForPath({
              owner: account,
              pathPrefix: `channels.${channelId}.accounts.${accountId}`,
              changes,
            });
<<<<<<< HEAD
=======
            migrateThreadBindingsSpawnSessionsForPath({
              owner: account,
              pathPrefix: `channels.${channelId}.accounts.${accountId}`,
              changes,
            });
>>>>>>> upstream/main
            accounts[accountId] = account;
          }
          channel.accounts = accounts;
        }
        channels[channelId] = channel;
      }
      raw.channels = channels;
    },
  }),
<<<<<<< HEAD
  defineLegacyConfigMigration({
    id: "channels.streaming-keys->channels.streaming",
    describe:
      "Normalize legacy streaming keys to channels.<provider>.streaming (Telegram/Discord/Slack)",
    legacyRules: CHANNEL_STREAMING_RULES,
    apply: (raw, changes) => {
      const channels = getRecord(raw.channels);
      if (!channels) {
        return;
      }

      const migrateProviderEntry = (params: {
        provider: "telegram" | "discord" | "slack";
        entry: Record<string, unknown>;
        pathPrefix: string;
      }) => {
        if (params.provider === "telegram") {
          moveLegacyStreamingShapeForPath({
            entry: params.entry,
            pathPrefix: params.pathPrefix,
            changes,
            resolveMode: resolveTelegramPreviewStreamMode,
          });
          return;
        }

        if (params.provider === "discord") {
          moveLegacyStreamingShapeForPath({
            entry: params.entry,
            pathPrefix: params.pathPrefix,
            changes,
            resolveMode: resolveDiscordPreviewStreamMode,
          });
          return;
        }

        moveLegacyStreamingShapeForPath({
          entry: params.entry,
          pathPrefix: params.pathPrefix,
          changes,
          resolveMode: resolveSlackStreamingMode,
          resolveNativeTransport: resolveSlackNativeStreaming,
        });
      };

      const migrateProvider = (provider: "telegram" | "discord" | "slack") => {
        const providerEntry = getRecord(channels[provider]);
        if (!providerEntry) {
          return;
        }
        migrateProviderEntry({
          provider,
          entry: providerEntry,
          pathPrefix: `channels.${provider}`,
        });
        const accounts = getRecord(providerEntry.accounts);
        if (!accounts) {
          return;
        }
        for (const [accountId, accountValue] of Object.entries(accounts)) {
          const account = getRecord(accountValue);
          if (!account) {
            continue;
          }
          migrateProviderEntry({
            provider,
            entry: account,
            pathPrefix: `channels.${provider}.accounts.${accountId}`,
          });
        }
      };

      migrateProvider("telegram");
      migrateProvider("discord");
      migrateProvider("slack");
    },
  }),
  defineLegacyConfigMigration({
    id: "channels.allow->channels.enabled",
    describe:
      "Normalize legacy nested channel allow toggles to enabled (Slack/Google Chat/Discord)",
    legacyRules: CHANNEL_ENABLED_ALIAS_RULES,
    apply: (raw, changes) => {
      const channels = getRecord(raw.channels);
      if (!channels) {
        return;
      }

      const migrateSlackEntry = (entry: Record<string, unknown>, pathPrefix: string) => {
        const channelEntries = getRecord(entry.channels);
        if (!channelEntries) {
          return;
        }
        for (const [channelId, channelRaw] of Object.entries(channelEntries)) {
          const channel = getRecord(channelRaw);
          if (!channel) {
            continue;
          }
          migrateAllowAliasForPath({
            entry: channel,
            pathPrefix: `${pathPrefix}.channels.${channelId}`,
            changes,
          });
          channelEntries[channelId] = channel;
        }
        entry.channels = channelEntries;
      };

      const migrateGoogleChatEntry = (entry: Record<string, unknown>, pathPrefix: string) => {
        const groups = getRecord(entry.groups);
        if (!groups) {
          return;
        }
        for (const [groupId, groupRaw] of Object.entries(groups)) {
          const group = getRecord(groupRaw);
          if (!group) {
            continue;
          }
          migrateAllowAliasForPath({
            entry: group,
            pathPrefix: `${pathPrefix}.groups.${groupId}`,
            changes,
          });
          groups[groupId] = group;
        }
        entry.groups = groups;
      };

      const migrateDiscordEntry = (entry: Record<string, unknown>, pathPrefix: string) => {
        const guilds = getRecord(entry.guilds);
        if (!guilds) {
          return;
        }
        for (const [guildId, guildRaw] of Object.entries(guilds)) {
          const guild = getRecord(guildRaw);
          if (!guild) {
            continue;
          }
          const channelEntries = getRecord(guild.channels);
          if (!channelEntries) {
            guilds[guildId] = guild;
            continue;
          }
          for (const [channelId, channelRaw] of Object.entries(channelEntries)) {
            const channel = getRecord(channelRaw);
            if (!channel) {
              continue;
            }
            migrateAllowAliasForPath({
              entry: channel,
              pathPrefix: `${pathPrefix}.guilds.${guildId}.channels.${channelId}`,
              changes,
            });
            channelEntries[channelId] = channel;
          }
          guild.channels = channelEntries;
          guilds[guildId] = guild;
        }
        entry.guilds = guilds;
      };

      const migrateProviderAccounts = (
        provider: "slack" | "googlechat" | "discord",
        migrateEntry: (entry: Record<string, unknown>, pathPrefix: string) => void,
      ) => {
        const providerEntry = getRecord(channels[provider]);
        if (!providerEntry) {
          return;
        }
        migrateEntry(providerEntry, `channels.${provider}`);
        const accounts = getRecord(providerEntry.accounts);
        if (!accounts) {
          channels[provider] = providerEntry;
          return;
        }
        for (const [accountId, accountRaw] of Object.entries(accounts)) {
          const account = getRecord(accountRaw);
          if (!account) {
            continue;
          }
          migrateEntry(account, `channels.${provider}.accounts.${accountId}`);
          accounts[accountId] = account;
        }
        providerEntry.accounts = accounts;
        channels[provider] = providerEntry;
      };

      migrateProviderAccounts("slack", migrateSlackEntry);
      migrateProviderAccounts("googlechat", migrateGoogleChatEntry);
      migrateProviderAccounts("discord", migrateDiscordEntry);
      raw.channels = channels;
    },
  }),
  defineLegacyConfigMigration({
    id: "channels.googlechat.streamMode->remove",
    describe: "Remove legacy Google Chat streamMode keys that are no longer used",
    legacyRules: GOOGLECHAT_STREAMMODE_RULES,
    apply: (raw, changes) => {
      const channels = getRecord(raw.channels);
      if (!channels) {
        return;
      }

      const migrateEntry = (entry: Record<string, unknown>, pathPrefix: string) => {
        if (entry.streamMode === undefined) {
          return;
        }
        delete entry.streamMode;
        changes.push(`Removed ${pathPrefix}.streamMode (legacy key no longer used).`);
      };

      const googlechat = getRecord(channels.googlechat);
      if (!googlechat) {
        return;
      }

      migrateEntry(googlechat, "channels.googlechat");

      const accounts = getRecord(googlechat.accounts);
      if (accounts) {
        for (const [accountId, accountValue] of Object.entries(accounts)) {
          const account = getRecord(accountValue);
          if (!account) {
            continue;
          }
          migrateEntry(account, `channels.googlechat.accounts.${accountId}`);
          accounts[accountId] = account;
        }
        googlechat.accounts = accounts;
      }

      channels.googlechat = googlechat;
      raw.channels = channels;
    },
  }),
=======
>>>>>>> upstream/main
];
