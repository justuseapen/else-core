<<<<<<< HEAD
import {
  type ChannelDoctorAdapter,
  type ChannelDoctorConfigMutation,
  type ChannelDoctorEmptyAllowlistAccountContext,
  type ChannelDoctorLegacyConfigRule,
} from "openclaw/plugin-sdk/channel-contract";
import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { inspectTelegramAccount } from "./account-inspect.js";
import { listTelegramAccountIds, resolveTelegramAccount } from "./accounts.js";
import { isNumericTelegramUserId, normalizeTelegramAllowFromEntry } from "./allow-from.js";
import { lookupTelegramChatId } from "./api-fetch.js";
import { resolveTelegramPreviewStreamMode } from "./preview-streaming.js";

type TelegramAllowFromUsernameHit = { path: string; entry: string };
=======
// Telegram plugin module implements doctor behavior.
import type {
  ChannelDoctorAdapter,
  ChannelDoctorEmptyAllowlistAccountContext,
} from "openclaw/plugin-sdk/channel-contract";
import {
  resolveChannelStreamingBlockEnabled,
  resolveChannelStreamingPreviewToolProgress,
} from "openclaw/plugin-sdk/channel-outbound";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { inspectTelegramAccount } from "./account-inspect.js";
import {
  listTelegramAccountIds,
  mergeTelegramAccountConfig,
  resolveDefaultTelegramAccountId,
  resolveTelegramAccount,
} from "./accounts.js";
import { isNumericTelegramSenderUserId, normalizeTelegramAllowFromEntry } from "./allow-from.js";
import { lookupTelegramChatId } from "./api-fetch.js";
import { hasTelegramBotEndpointApiRoot, normalizeTelegramApiRoot } from "./api-root.js";
import {
  legacyConfigRules as TELEGRAM_LEGACY_CONFIG_RULES,
  normalizeCompatibilityConfig as normalizeTelegramCompatibilityConfig,
} from "./doctor-contract.js";
import { resolveTelegramPreviewStreamMode } from "./preview-streaming.js";

type TelegramAllowFromInvalidHit = { path: string; entry: string };
type TelegramMalformedGroupsHit = { path: string; actualType: string };
type TelegramSelectedQuoteToolProgressHit = { path: string; replyToMode: string };
type TelegramApiRootBotEndpointHit = {
  path: string;
  pathSegments: string[];
  value: string;
  normalized: string;
};
>>>>>>> upstream/main
type DoctorAllowFromList = Array<string | number>;
type DoctorAccountRecord = Record<string, unknown>;

type TelegramAllowFromListRef = {
  pathLabel: string;
  holder: Record<string, unknown>;
  key: "allowFrom" | "groupAllowFrom";
};

function asObjectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

<<<<<<< HEAD
function ensureNestedRecord(owner: Record<string, unknown>, key: string): Record<string, unknown> {
  const existing = asObjectRecord(owner[key]);
  if (existing) {
    return { ...existing };
  }
  return {};
}

function sanitizeForLog(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

function describeUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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

function normalizeTelegramCompatibilityConfig(cfg: OpenClawConfig): ChannelDoctorConfigMutation {
  const rawEntry = asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.telegram);
  if (!rawEntry) {
    return { config: cfg, changes: [] };
  }

  const changes: string[] = [];
  let updated = rawEntry;
  let changed = false;

  const base = normalizeTelegramStreamingAliases({
    entry: rawEntry,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = base.entry;
  changed = base.changed;

  const rawAccounts = asObjectRecord(updated.accounts);
  if (rawAccounts) {
    let accountsChanged = false;
    const accounts = { ...rawAccounts };
    for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
      const account = asObjectRecord(rawAccount);
      if (!account) {
        continue;
      }
      const accountStreaming = normalizeTelegramStreamingAliases({
        entry: account,
        pathPrefix: `channels.telegram.accounts.${accountId}`,
        changes,
      });
      if (accountStreaming.changed) {
        accounts[accountId] = accountStreaming.entry;
        accountsChanged = true;
      }
    }
    if (accountsChanged) {
      updated = { ...updated, accounts };
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
        telegram: updated as unknown as NonNullable<OpenClawConfig["channels"]>["telegram"],
      } as OpenClawConfig["channels"],
    },
    changes,
  };
}

function hasAllowFromEntries(values?: DoctorAllowFromList): boolean {
  return Array.isArray(values) && values.some((entry) => String(entry).trim());
=======
function sanitizeForLog(value: string): string {
  return value.replace(/\p{Cc}+/gu, " ").trim();
}

function hasAllowFromEntries(values?: DoctorAllowFromList): boolean {
  return Array.isArray(values) && values.some((entry) => normalizeOptionalString(String(entry)));
>>>>>>> upstream/main
}

function collectTelegramAccountScopes(
  cfg: OpenClawConfig,
<<<<<<< HEAD
): Array<{ prefix: string; account: Record<string, unknown> }> {
  const scopes: Array<{ prefix: string; account: Record<string, unknown> }> = [];
=======
): Array<{ prefix: string; pathSegments: string[]; account: Record<string, unknown> }> {
  const scopes: Array<{
    prefix: string;
    pathSegments: string[];
    account: Record<string, unknown>;
  }> = [];
>>>>>>> upstream/main
  const telegram = asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.telegram);
  if (!telegram) {
    return scopes;
  }
<<<<<<< HEAD
  scopes.push({ prefix: "channels.telegram", account: telegram });
=======
  scopes.push({
    prefix: "channels.telegram",
    pathSegments: ["channels", "telegram"],
    account: telegram,
  });
>>>>>>> upstream/main
  const accounts = asObjectRecord(telegram.accounts);
  if (!accounts) {
    return scopes;
  }
  for (const key of Object.keys(accounts)) {
    const account = asObjectRecord(accounts[key]);
    if (account) {
<<<<<<< HEAD
      scopes.push({ prefix: `channels.telegram.accounts.${key}`, account });
=======
      scopes.push({
        prefix: `channels.telegram.accounts.${key}`,
        pathSegments: ["channels", "telegram", "accounts", key],
        account,
      });
>>>>>>> upstream/main
    }
  }
  return scopes;
}

function collectTelegramAllowFromLists(
  prefix: string,
  account: Record<string, unknown>,
): TelegramAllowFromListRef[] {
  const refs: TelegramAllowFromListRef[] = [
    { pathLabel: `${prefix}.allowFrom`, holder: account, key: "allowFrom" },
    { pathLabel: `${prefix}.groupAllowFrom`, holder: account, key: "groupAllowFrom" },
  ];
  const groups = asObjectRecord(account.groups);
  if (!groups) {
    return refs;
  }
  for (const groupId of Object.keys(groups)) {
    const group = asObjectRecord(groups[groupId]);
    if (!group) {
      continue;
    }
    refs.push({
      pathLabel: `${prefix}.groups.${groupId}.allowFrom`,
      holder: group,
      key: "allowFrom",
    });
    const topics = asObjectRecord(group.topics);
    if (!topics) {
      continue;
    }
    for (const topicId of Object.keys(topics)) {
      const topic = asObjectRecord(topics[topicId]);
      if (!topic) {
        continue;
      }
      refs.push({
        pathLabel: `${prefix}.groups.${groupId}.topics.${topicId}.allowFrom`,
        holder: topic,
        key: "allowFrom",
      });
    }
  }
  return refs;
}

<<<<<<< HEAD
export function scanTelegramAllowFromUsernameEntries(
  cfg: OpenClawConfig,
): TelegramAllowFromUsernameHit[] {
  const hits: TelegramAllowFromUsernameHit[] = [];
=======
function describeConfigValueType(value: unknown): string {
  if (Array.isArray(value)) {
    return "array";
  }
  if (value === null) {
    return "null";
  }
  return typeof value;
}

export function scanTelegramMalformedGroupsConfig(
  cfg: OpenClawConfig,
): TelegramMalformedGroupsHit[] {
  const hits: TelegramMalformedGroupsHit[] = [];
  for (const scope of collectTelegramAccountScopes(cfg)) {
    if (!Object.hasOwn(scope.account, "groups")) {
      continue;
    }
    const groups = scope.account.groups;
    if (asObjectRecord(groups)) {
      continue;
    }
    hits.push({
      path: `${scope.prefix}.groups`,
      actualType: describeConfigValueType(groups),
    });
  }
  return hits;
}

export function collectTelegramMalformedGroupsWarnings(params: {
  hits: TelegramMalformedGroupsHit[];
  doctorFixCommand: string;
}): string[] {
  if (params.hits.length === 0) {
    return [];
  }
  const sample = params.hits[0] ?? {
    path: "channels.telegram.groups",
    actualType: "unknown",
  };
  return [
    `- ${sanitizeForLog(sample.path)} has invalid Telegram groups shape (${sanitizeForLog(sample.actualType)}); expected an object map keyed by Telegram group/chat id, not an array, string, or null.`,
    `- Example shape: channels.telegram.groups."-1001234567890".topics."99" = { agentId: "support" }. Use topics for forum-topic routing, then rerun ${params.doctorFixCommand} for any remaining Telegram config cleanup.`,
  ];
}

export function scanTelegramInvalidAllowFromEntries(
  cfg: OpenClawConfig,
): TelegramAllowFromInvalidHit[] {
  const hits: TelegramAllowFromInvalidHit[] = [];
>>>>>>> upstream/main
  const scanList = (pathLabel: string, list: unknown) => {
    if (!Array.isArray(list)) {
      return;
    }
    for (const entry of list) {
      const normalized = normalizeTelegramAllowFromEntry(entry);
<<<<<<< HEAD
      if (!normalized || normalized === "*" || isNumericTelegramUserId(normalized)) {
        continue;
      }
      hits.push({ path: pathLabel, entry: String(entry).trim() });
=======
      if (!normalized || normalized === "*" || isNumericTelegramSenderUserId(normalized)) {
        continue;
      }
      hits.push({ path: pathLabel, entry: normalizeOptionalString(String(entry)) ?? "" });
>>>>>>> upstream/main
    }
  };

  for (const scope of collectTelegramAccountScopes(cfg)) {
    for (const ref of collectTelegramAllowFromLists(scope.prefix, scope.account)) {
      scanList(ref.pathLabel, ref.holder[ref.key]);
    }
  }
  return hits;
}

<<<<<<< HEAD
export function collectTelegramAllowFromUsernameWarnings(params: {
  hits: TelegramAllowFromUsernameHit[];
=======
export function collectTelegramInvalidAllowFromWarnings(params: {
  hits: TelegramAllowFromInvalidHit[];
>>>>>>> upstream/main
  doctorFixCommand: string;
}): string[] {
  if (params.hits.length === 0) {
    return [];
  }
  const sampleEntry = sanitizeForLog(params.hits[0]?.entry ?? "@");
  return [
<<<<<<< HEAD
    `- Telegram allowFrom contains ${params.hits.length} non-numeric entries (e.g. ${sampleEntry}); Telegram authorization requires numeric sender IDs.`,
    `- Run "${params.doctorFixCommand}" to auto-resolve @username entries to numeric IDs (requires a Telegram bot token).`,
  ];
}

=======
    `- Telegram allowFrom contains ${params.hits.length} invalid sender entries (e.g. ${sampleEntry}); Telegram authorization requires positive numeric sender user IDs.`,
    `- Run "${params.doctorFixCommand}" to auto-resolve @username entries to numeric IDs (requires a Telegram bot token). Move negative chat IDs under channels.telegram.groups instead of allowFrom.`,
  ];
}

export function scanTelegramBotEndpointApiRoots(
  cfg: OpenClawConfig,
): TelegramApiRootBotEndpointHit[] {
  const hits: TelegramApiRootBotEndpointHit[] = [];
  for (const scope of collectTelegramAccountScopes(cfg)) {
    const value = scope.account.apiRoot;
    if (typeof value !== "string" || !hasTelegramBotEndpointApiRoot(value)) {
      continue;
    }
    hits.push({
      path: `${scope.prefix}.apiRoot`,
      pathSegments: [...scope.pathSegments, "apiRoot"],
      value,
      normalized: normalizeTelegramApiRoot(value),
    });
  }
  return hits;
}

export function collectTelegramApiRootWarnings(params: {
  hits: TelegramApiRootBotEndpointHit[];
  doctorFixCommand: string;
}): string[] {
  if (params.hits.length === 0) {
    return [];
  }
  const samplePath = sanitizeForLog(params.hits[0]?.path ?? "channels.telegram.apiRoot");
  return [
    `- ${samplePath} points at a full Telegram bot endpoint; apiRoot must be the Bot API root only. This can make startup calls like deleteWebhook, deleteMyCommands, and setMyCommands fail with 404 even when direct curl commands work.`,
    `- Run "${params.doctorFixCommand}" to remove the trailing /bot<TOKEN> path from Telegram apiRoot.`,
  ];
}

function formatTelegramAccountConfigPath(cfg: OpenClawConfig, accountId: string): string {
  const telegram = asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.telegram);
  const accounts = asObjectRecord(telegram?.accounts);
  if (!accounts || Object.keys(accounts).length === 0) {
    return "channels.telegram";
  }
  return accountId === "default" ? "channels.telegram" : `channels.telegram.accounts.${accountId}`;
}

export function scanTelegramSelectedQuoteToolProgressWarnings(
  cfg: OpenClawConfig,
): TelegramSelectedQuoteToolProgressHit[] {
  if (!asObjectRecord((cfg.channels as Record<string, unknown> | undefined)?.telegram)) {
    return [];
  }
  return listTelegramAccountIds(cfg).flatMap((accountId) => {
    const account = mergeTelegramAccountConfig(cfg, accountId);
    const replyToMode = account.replyToMode ?? "off";
    if (replyToMode === "off") {
      return [];
    }
    if (resolveTelegramPreviewStreamMode(account) === "off") {
      return [];
    }
    const blockStreamingEnabled =
      resolveChannelStreamingBlockEnabled(account) ??
      cfg.agents?.defaults?.blockStreamingDefault === "on";
    if (blockStreamingEnabled || !resolveChannelStreamingPreviewToolProgress(account)) {
      return [];
    }
    return [
      {
        path: formatTelegramAccountConfigPath(cfg, accountId),
        replyToMode,
      },
    ];
  });
}

export function collectTelegramSelectedQuoteToolProgressWarnings(params: {
  hits: TelegramSelectedQuoteToolProgressHit[];
}): string[] {
  if (params.hits.length === 0) {
    return [];
  }
  const sample = params.hits[0] ?? { path: "channels.telegram", replyToMode: "first" };
  return [
    `- ${sanitizeForLog(sample.path)} has replyToMode: "${sanitizeForLog(sample.replyToMode)}" while Telegram preview tool-progress is enabled. Telegram selected quote replies must send the final answer through the native quote-reply path, so those turns skip the short "Working" tool-progress preview. Current-message replies without selected quote text still keep preview streaming.`,
    '- Set replyToMode: "off" when tool-progress preview matters more than native quote replies, or set streaming.preview.toolProgress: false to keep quote replies and silence this warning.',
  ];
}

export function maybeRepairTelegramApiRoots(cfg: OpenClawConfig): {
  config: OpenClawConfig;
  changes: string[];
} {
  const hits = scanTelegramBotEndpointApiRoots(cfg);
  if (hits.length === 0) {
    return { config: cfg, changes: [] };
  }

  const next = structuredClone(cfg);
  const apply = (path: string[], normalized: string) => {
    let target: Record<string, unknown> | null = next as Record<string, unknown>;
    for (const segment of path.slice(0, -1)) {
      target = asObjectRecord(target?.[segment]);
      if (!target) {
        return;
      }
    }
    target[path[path.length - 1] ?? "apiRoot"] = normalized;
  };

  for (const hit of hits) {
    apply(hit.pathSegments, hit.normalized);
  }
  return {
    config: next,
    changes: hits.map(
      (hit) => `- ${sanitizeForLog(hit.path)}: removed trailing /bot<TOKEN> from Telegram apiRoot.`,
    ),
  };
}

export function collectTelegramMissingEnvTokenWarnings(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): string[] {
  if (resolveDefaultTelegramAccountId(params.cfg) !== "default") {
    return [];
  }
  const account = inspectTelegramAccount({
    cfg: params.cfg,
    accountId: "default",
    envToken: params.env?.TELEGRAM_BOT_TOKEN ?? "",
  });
  if (!account.enabled || account.tokenStatus !== "missing" || account.tokenSource !== "none") {
    return [];
  }
  return [
    "- channels.telegram: default account has no available bot token, and TELEGRAM_BOT_TOKEN is absent in this doctor environment. After migration, verify TELEGRAM_BOT_TOKEN is present in the state-dir .env or configure channels.telegram.botToken / channels.telegram.accounts.default.botToken as a SecretRef.",
  ];
}

async function repairTelegramConfig(params: { cfg: OpenClawConfig }): Promise<{
  config: OpenClawConfig;
  changes: string[];
}> {
  const apiRootRepair = maybeRepairTelegramApiRoots(params.cfg);
  const allowFromRepair = await maybeRepairTelegramAllowFromUsernames(apiRootRepair.config);
  return {
    config: allowFromRepair.config,
    changes: [...apiRootRepair.changes, ...allowFromRepair.changes],
  };
}

>>>>>>> upstream/main
export async function maybeRepairTelegramAllowFromUsernames(cfg: OpenClawConfig): Promise<{
  config: OpenClawConfig;
  changes: string[];
}> {
<<<<<<< HEAD
  const hits = scanTelegramAllowFromUsernameEntries(cfg);
=======
  const hits = scanTelegramInvalidAllowFromEntries(cfg);
>>>>>>> upstream/main
  if (hits.length === 0) {
    return { config: cfg, changes: [] };
  }

<<<<<<< HEAD
  const { getChannelsCommandSecretTargetIds, resolveCommandSecretRefsViaGateway } =
    await import("openclaw/plugin-sdk/runtime-secret-resolution");
=======
  const usernameHits = hits.filter((hit) => {
    const normalized = normalizeTelegramAllowFromEntry(hit.entry);
    return normalized.length > 0 && !/\s/.test(normalized) && !normalized.startsWith("-");
  });

  if (usernameHits.length === 0) {
    return {
      config: cfg,
      changes: hits
        .slice(0, 5)
        .map(
          (hit) =>
            `- ${sanitizeForLog(hit.path)}: invalid sender entry ${sanitizeForLog(hit.entry)}; allowFrom requires positive numeric Telegram user IDs. Move group chat IDs under channels.telegram.groups.`,
        ),
    };
  }

  const { getChannelsCommandSecretTargetIds, resolveCommandSecretRefsViaGateway } =
    await import("openclaw/plugin-sdk/runtime");
>>>>>>> upstream/main

  const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
    config: cfg,
    commandName: "doctor --fix",
    targetIds: getChannelsCommandSecretTargetIds(),
    mode: "read_only_status",
  });

  const tokenResolutionWarnings: string[] = [];
  const resolverAccountIds: string[] = [];
<<<<<<< HEAD
=======
  let sawConfiguredUnavailableToken = false;
>>>>>>> upstream/main
  for (const accountId of listTelegramAccountIds(resolvedConfig)) {
    let inspected: ReturnType<typeof inspectTelegramAccount>;
    try {
      inspected = inspectTelegramAccount({ cfg: resolvedConfig, accountId });
    } catch (error) {
      tokenResolutionWarnings.push(
<<<<<<< HEAD
        `- Telegram account ${accountId}: failed to inspect bot token (${describeUnknownError(error)}).`,
=======
        `- Telegram account ${accountId}: failed to inspect bot token (${formatErrorMessage(error)}).`,
>>>>>>> upstream/main
      );
      continue;
    }
    if (inspected.tokenStatus === "configured_unavailable") {
<<<<<<< HEAD
=======
      sawConfiguredUnavailableToken = true;
>>>>>>> upstream/main
      tokenResolutionWarnings.push(
        `- Telegram account ${accountId}: failed to inspect bot token (configured but unavailable in this command path).`,
      );
    }
<<<<<<< HEAD
    const token = inspected.tokenSource === "none" ? "" : inspected.token.trim();
=======
    const token =
      inspected.tokenSource === "none" ? "" : (normalizeOptionalString(inspected.token) ?? "");
>>>>>>> upstream/main
    if (token) {
      resolverAccountIds.push(accountId);
    }
  }

  if (resolverAccountIds.length === 0) {
    return {
      config: cfg,
      changes: [
        ...tokenResolutionWarnings,
<<<<<<< HEAD
        "- Telegram allowFrom contains @username entries, but no Telegram bot token is available in this command path; cannot auto-resolve.",
=======
        sawConfiguredUnavailableToken
          ? "- Telegram allowFrom contains @username entries, but configured Telegram bot credentials are unavailable in this command path; cannot auto-resolve."
          : "- Telegram allowFrom contains @username entries, but no Telegram bot token is available in this command path; cannot auto-resolve.",
>>>>>>> upstream/main
      ],
    };
  }
  const resolveUserId = async (raw: string): Promise<string | null> => {
<<<<<<< HEAD
    const trimmed = raw.trim();
=======
    const trimmed = normalizeOptionalString(raw) ?? "";
>>>>>>> upstream/main
    if (!trimmed) {
      return null;
    }
    const normalized = normalizeTelegramAllowFromEntry(trimmed);
    if (!normalized || normalized === "*") {
      return null;
    }
<<<<<<< HEAD
    if (isNumericTelegramUserId(normalized) || /\s/.test(normalized)) {
      return isNumericTelegramUserId(normalized) ? normalized : null;
=======
    if (isNumericTelegramSenderUserId(normalized) || /\s/.test(normalized)) {
      return isNumericTelegramSenderUserId(normalized) ? normalized : null;
>>>>>>> upstream/main
    }
    const username = normalized.startsWith("@") ? normalized : `@${normalized}`;
    for (const accountId of resolverAccountIds) {
      try {
        const account = resolveTelegramAccount({ cfg: resolvedConfig, accountId });
        const token = account.token.trim();
        if (!token) {
          continue;
        }
        const id = await lookupTelegramChatId({
          token,
          chatId: username,
          network: account.config.network,
          signal: undefined,
        });
        if (id) {
          return id;
        }
      } catch {
        // ignore and try next account
      }
    }
    return null;
  };

  const next = structuredClone(cfg);
  const changes: string[] = [];

  const repairList = async (pathLabel: string, holder: Record<string, unknown>, key: string) => {
    const raw = holder[key];
    if (!Array.isArray(raw)) {
      return;
    }
    const out: DoctorAllowFromList = [];
    const replaced: Array<{ from: string; to: string }> = [];
    for (const entry of raw) {
      const normalized = normalizeTelegramAllowFromEntry(entry);
      if (!normalized) {
        continue;
      }
<<<<<<< HEAD
      if (normalized === "*" || isNumericTelegramUserId(normalized)) {
=======
      if (normalized === "*" || isNumericTelegramSenderUserId(normalized)) {
>>>>>>> upstream/main
        out.push(normalized);
        continue;
      }
      const resolved = await resolveUserId(String(entry));
      if (resolved) {
        out.push(resolved);
<<<<<<< HEAD
        replaced.push({ from: String(entry).trim(), to: resolved });
      } else {
        out.push(String(entry).trim());
=======
        replaced.push({ from: normalizeOptionalString(String(entry)) ?? "", to: resolved });
      } else {
        out.push(normalizeOptionalString(String(entry)) ?? "");
>>>>>>> upstream/main
      }
    }
    const deduped: DoctorAllowFromList = [];
    const seen = new Set<string>();
    for (const entry of out) {
<<<<<<< HEAD
      const keyValue = String(entry).trim();
=======
      const keyValue = normalizeOptionalString(String(entry)) ?? "";
>>>>>>> upstream/main
      if (!keyValue || seen.has(keyValue)) {
        continue;
      }
      seen.add(keyValue);
      deduped.push(entry);
    }
    holder[key] = deduped;
    for (const replacement of replaced.slice(0, 5)) {
      changes.push(
        `- ${sanitizeForLog(pathLabel)}: resolved ${sanitizeForLog(replacement.from)} -> ${sanitizeForLog(replacement.to)}`,
      );
    }
    if (replaced.length > 5) {
      changes.push(
        `- ${sanitizeForLog(pathLabel)}: resolved ${replaced.length - 5} more @username entries`,
      );
    }
  };

  for (const scope of collectTelegramAccountScopes(next)) {
    for (const ref of collectTelegramAllowFromLists(scope.prefix, scope.account)) {
      await repairList(ref.pathLabel, ref.holder, ref.key);
    }
  }

  if (changes.length === 0) {
    return { config: cfg, changes: [] };
  }
  return { config: next, changes };
}

function hasConfiguredGroups(account: DoctorAccountRecord, parent?: DoctorAccountRecord): boolean {
  const groups =
    (asObjectRecord(account.groups) as DoctorAccountRecord | null) ??
    (asObjectRecord(parent?.groups) as DoctorAccountRecord | null);
  return Boolean(groups) && Object.keys(groups ?? {}).length > 0;
}

export function collectTelegramGroupPolicyWarnings(params: {
  account: DoctorAccountRecord;
  prefix: string;
  effectiveAllowFrom?: DoctorAllowFromList;
  dmPolicy?: string;
  parent?: DoctorAccountRecord;
}): string[] {
  if (!hasConfiguredGroups(params.account, params.parent)) {
    const effectiveDmPolicy = params.dmPolicy ?? "pairing";
    const dmSetupLine =
      effectiveDmPolicy === "pairing"
        ? "DMs use pairing mode, so new senders must start a chat and be approved before regular messages are accepted."
        : effectiveDmPolicy === "allowlist"
          ? `DMs use allowlist mode, so only sender IDs in ${params.prefix}.allowFrom are accepted.`
          : effectiveDmPolicy === "open"
            ? "DMs are open."
            : "DMs are disabled.";
    return [
      `- ${params.prefix}: Telegram is in first-time setup mode. ${dmSetupLine} Group messages stay blocked until you add allowed chats under ${params.prefix}.groups (and optional sender IDs under ${params.prefix}.groupAllowFrom), or set ${params.prefix}.groupPolicy to "open" if you want broad group access.`,
    ];
  }

  const rawGroupAllowFrom =
    (params.account.groupAllowFrom as DoctorAllowFromList | undefined) ??
    (params.parent?.groupAllowFrom as DoctorAllowFromList | undefined);
  const groupAllowFrom = hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : undefined;
  const effectiveGroupAllowFrom = groupAllowFrom ?? params.effectiveAllowFrom;
  if (hasAllowFromEntries(effectiveGroupAllowFrom)) {
    return [];
  }

  return [
    `- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom (and allowFrom) is empty — all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom or ${params.prefix}.allowFrom, or set ${params.prefix}.groupPolicy to "open".`,
  ];
}

export function collectTelegramEmptyAllowlistExtraWarnings(
  params: ChannelDoctorEmptyAllowlistAccountContext,
): string[] {
  const account = params.account as DoctorAccountRecord;
  const parent = params.parent as DoctorAccountRecord | undefined;
  return params.channelName === "telegram" &&
    ((account.groupPolicy as string | undefined) ??
      (parent?.groupPolicy as string | undefined) ??
      undefined) === "allowlist"
    ? collectTelegramGroupPolicyWarnings({
        account,
        dmPolicy: params.dmPolicy,
        effectiveAllowFrom: params.effectiveAllowFrom as DoctorAllowFromList | undefined,
        parent,
        prefix: params.prefix,
      })
    : [];
}

<<<<<<< HEAD
function hasLegacyTelegramStreamingAliases(value: unknown): boolean {
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
    entry.draftChunk !== undefined ||
    entry.blockStreamingCoalesce !== undefined
  );
}

function hasLegacyTelegramAccountStreamingAliases(value: unknown): boolean {
  const accounts = asObjectRecord(value);
  if (!accounts) {
    return false;
  }
  return Object.values(accounts).some((account) => hasLegacyTelegramStreamingAliases(account));
}

const TELEGRAM_LEGACY_CONFIG_RULES: ChannelDoctorLegacyConfigRule[] = [
  {
    path: ["channels", "telegram"],
    message:
      "channels.telegram.streamMode, channels.telegram.streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce}.",
    match: hasLegacyTelegramStreamingAliases,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      "channels.telegram.accounts.<id>.streamMode, streaming (scalar), chunkMode, blockStreaming, draftChunk, and blockStreamingCoalesce are legacy; use channels.telegram.accounts.<id>.streaming.{mode,chunkMode,preview.chunk,block.enabled,block.coalesce}.",
    match: hasLegacyTelegramAccountStreamingAliases,
  },
];

export const telegramDoctor: ChannelDoctorAdapter = {
  legacyConfigRules: TELEGRAM_LEGACY_CONFIG_RULES,
  normalizeCompatibilityConfig: ({ cfg }) => normalizeTelegramCompatibilityConfig(cfg),
  collectPreviewWarnings: ({ cfg, doctorFixCommand }) =>
    collectTelegramAllowFromUsernameWarnings({
      hits: scanTelegramAllowFromUsernameEntries(cfg),
      doctorFixCommand,
    }),
  repairConfig: async ({ cfg }) => await maybeRepairTelegramAllowFromUsernames(cfg),
=======
export const telegramDoctor: ChannelDoctorAdapter = {
  legacyConfigRules: TELEGRAM_LEGACY_CONFIG_RULES,
  normalizeCompatibilityConfig: normalizeTelegramCompatibilityConfig,
  collectPreviewWarnings: ({ cfg, doctorFixCommand, env }) => [
    ...collectTelegramMissingEnvTokenWarnings({ cfg, env }),
    ...collectTelegramMalformedGroupsWarnings({
      hits: scanTelegramMalformedGroupsConfig(cfg),
      doctorFixCommand,
    }),
    ...collectTelegramInvalidAllowFromWarnings({
      hits: scanTelegramInvalidAllowFromEntries(cfg),
      doctorFixCommand,
    }),
    ...collectTelegramApiRootWarnings({
      hits: scanTelegramBotEndpointApiRoots(cfg),
      doctorFixCommand,
    }),
    ...collectTelegramSelectedQuoteToolProgressWarnings({
      hits: scanTelegramSelectedQuoteToolProgressWarnings(cfg),
    }),
  ],
  repairConfig: async ({ cfg }) => await repairTelegramConfig({ cfg }),
>>>>>>> upstream/main
  collectEmptyAllowlistExtraWarnings: collectTelegramEmptyAllowlistExtraWarnings,
  shouldSkipDefaultEmptyGroupAllowlistWarning: (params) => params.channelName === "telegram",
};
