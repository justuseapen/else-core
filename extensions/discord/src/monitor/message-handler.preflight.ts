// Discord plugin module implements message handler.preflight behavior.
import { formatAllowlistMatchMeta } from "openclaw/plugin-sdk/allow-from";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import {
  buildMentionRegexes,
  classifyChannelInboundEvent,
  logInboundDrop,
  resolveInboundMentionDecision,
  resolveUnmentionedGroupInboundPolicy,
  recordDroppedChannelInboundHistory,
  toInboundMediaFacts,
} from "openclaw/plugin-sdk/channel-inbound";
<<<<<<< HEAD
import { resolveControlCommandGate } from "openclaw/plugin-sdk/command-auth-native";
import { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
import { shouldHandleTextCommands } from "openclaw/plugin-sdk/command-surface";
import { loadConfig } from "openclaw/plugin-sdk/config-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/config-runtime";
import type { SessionBindingRecord } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { enqueueSystemEvent, recordChannelActivity } from "openclaw/plugin-sdk/infra-runtime";
import {
  recordPendingHistoryEntryIfEnabled,
  type HistoryEntry,
} from "openclaw/plugin-sdk/reply-history";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/routing";
import { logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { getChildLogger } from "openclaw/plugin-sdk/runtime-env";
import { logDebug } from "openclaw/plugin-sdk/text-runtime";
import { resolveDefaultDiscordAccountId } from "../accounts.js";
import {
  isDiscordGroupAllowedByPolicy,
  normalizeDiscordSlug,
  resolveDiscordChannelConfigWithFallback,
=======
import { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
import { isAbortRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
import { shouldHandleTextCommands } from "openclaw/plugin-sdk/command-surface";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { logDebug } from "openclaw/plugin-sdk/logging-core";
import { mimeTypeFromFilePath } from "openclaw/plugin-sdk/media-mime";
import type { HistoryEntry } from "openclaw/plugin-sdk/reply-history";
import { getChildLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { enqueueSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { resolveDefaultDiscordAccountId } from "../accounts.js";
import { ChannelType, MessageType, type User } from "../internal/discord.js";
import {
>>>>>>> upstream/main
  resolveDiscordGuildEntry,
  resolveDiscordMemberAccessState,
  resolveDiscordShouldRequireMention,
} from "./allow-list.js";
import { resolveDiscordChannelInfoSafe, resolveDiscordChannelNameSafe } from "./channel-access.js";
import { resolveDiscordTextCommandAccess } from "./dm-command-auth.js";
import { resolveDiscordSystemLocation, resolveTimestampMs } from "./format.js";
import { resolveDiscordMessageStickers } from "./message-forwarded.js";
import { resolveDiscordDmPreflightAccess } from "./message-handler.dm-preflight.js";
import { hydrateDiscordMessageIfNeeded } from "./message-handler.hydration.js";
import { resolveDiscordPreflightChannelAccess } from "./message-handler.preflight-channel-access.js";
import { resolveDiscordPreflightChannelContext } from "./message-handler.preflight-channel-context.js";
import { buildDiscordMessagePreflightContext } from "./message-handler.preflight-context.js";
import {
  isBoundThreadBotSystemMessage,
  isDiscordThreadChannelMessage,
  resolveDiscordMentionState,
  resolveInjectedBoundThreadLookupRecord,
  resolvePreflightMentionRequirement,
  shouldIgnoreBoundThreadWebhookMessage,
} from "./message-handler.preflight-helpers.js";
import { buildDiscordPreflightHistoryEntry } from "./message-handler.preflight-history.js";
import {
  logDiscordPreflightChannelConfig,
  logDiscordPreflightInboundSummary,
} from "./message-handler.preflight-logging.js";
import { resolveDiscordPreflightPluralKitInfo } from "./message-handler.preflight-pluralkit.js";
import {
  isPreflightAborted,
  loadPreflightAudioRuntime,
  loadSystemEventsRuntime,
} from "./message-handler.preflight-runtime.js";
import { resolveDiscordPreflightThreadContext } from "./message-handler.preflight-thread.js";
import type {
  DiscordMessagePreflightContext,
  DiscordMessagePreflightParams,
} from "./message-handler.preflight.types.js";
import { resolveDiscordPreflightRoute } from "./message-handler.routing-preflight.js";
import {
  resolveDiscordChannelInfo,
  resolveDiscordMessageChannelId,
  resolveDiscordMessageText,
  resolveMediaList,
} from "./message-utils.js";
<<<<<<< HEAD
import {
  buildDiscordRoutePeer,
  resolveDiscordConversationRoute,
  resolveDiscordEffectiveRoute,
} from "./route-resolution.js";
import { resolveDiscordSenderIdentity, resolveDiscordWebhookId } from "./sender-identity.js";
import { isRecentlyUnboundThreadWebhookMessage } from "./thread-bindings.js";
=======
import { resolveDiscordSenderIdentity, resolveDiscordWebhookId } from "./sender-identity.js";
>>>>>>> upstream/main

export type {
  DiscordMessagePreflightContext,
  DiscordMessagePreflightParams,
} from "./message-handler.preflight.types.js";

export {
  resolvePreflightMentionRequirement,
  shouldIgnoreBoundThreadWebhookMessage,
} from "./message-handler.preflight-helpers.js";

<<<<<<< HEAD
let conversationRuntimePromise:
  | Promise<typeof import("openclaw/plugin-sdk/conversation-binding-runtime")>
  | undefined;
let pluralkitRuntimePromise: Promise<typeof import("../pluralkit.js")> | undefined;
let discordSendRuntimePromise: Promise<typeof import("../send.js")> | undefined;
let preflightAudioRuntimePromise: Promise<typeof import("./preflight-audio.js")> | undefined;
let systemEventsRuntimePromise: Promise<typeof import("./system-events.js")> | undefined;
let discordThreadingRuntimePromise: Promise<typeof import("./threading.js")> | undefined;

async function loadConversationRuntime() {
  conversationRuntimePromise ??= import("openclaw/plugin-sdk/conversation-binding-runtime");
  return await conversationRuntimePromise;
}

async function loadPluralKitRuntime() {
  pluralkitRuntimePromise ??= import("../pluralkit.js");
  return await pluralkitRuntimePromise;
}

async function loadDiscordSendRuntime() {
  discordSendRuntimePromise ??= import("../send.js");
  return await discordSendRuntimePromise;
}

async function loadPreflightAudioRuntime() {
  preflightAudioRuntimePromise ??= import("./preflight-audio.js");
  return await preflightAudioRuntimePromise;
}

async function loadSystemEventsRuntime() {
  systemEventsRuntimePromise ??= import("./system-events.js");
  return await systemEventsRuntimePromise;
}

async function loadDiscordThreadingRuntime() {
  discordThreadingRuntimePromise ??= import("./threading.js");
  return await discordThreadingRuntimePromise;
}

function isPreflightAborted(abortSignal?: AbortSignal): boolean {
  return Boolean(abortSignal?.aborted);
=======
const DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS = 4;
const DISCORD_HISTORY_MEDIA_MAX_BYTES = 10 * 1024 * 1024;
const DISCORD_HISTORY_MEDIA_IDLE_TIMEOUT_MS = 1_000;
const DISCORD_HISTORY_MEDIA_TOTAL_TIMEOUT_MS = 3_000;

function resolveDiscordPreflightConversationKind(params: {
  isGuildMessage: boolean;
  channelType?: ChannelType;
}) {
  const isGroupDm = params.channelType === ChannelType.GroupDM;
  const isDirectMessage =
    params.channelType === ChannelType.DM ||
    (!params.isGuildMessage && !isGroupDm && params.channelType == null);
  return { isDirectMessage, isGroupDm };
>>>>>>> upstream/main
}

function isDiscordImageAttachmentCandidate(attachment: {
  content_type?: string | null;
  filename?: string | null;
  url?: string | null;
}) {
  const contentType = attachment.content_type?.split(";")[0]?.trim().toLowerCase();
  if (contentType?.startsWith("image/")) {
    return true;
  }
  return Boolean(
    mimeTypeFromFilePath(attachment.filename)?.startsWith("image/") ||
    mimeTypeFromFilePath(attachment.url)?.startsWith("image/"),
  );
}

<<<<<<< HEAD
type BoundThreadLookupRecordLike = {
  webhookId?: string | null;
  metadata?: {
    webhookId?: string | null;
  };
};

function isDiscordThreadChannelType(type: ChannelType | undefined): boolean {
  return (
    type === ChannelType.PublicThread ||
    type === ChannelType.PrivateThread ||
    type === ChannelType.AnnouncementThread
  );
}

function isDiscordThreadChannelMessage(params: {
  isGuildMessage: boolean;
  message: Message;
  channelInfo: import("./message-utils.js").DiscordChannelInfo | null;
}): boolean {
  if (!params.isGuildMessage) {
    return false;
  }
  const channel =
    "channel" in params.message ? (params.message as { channel?: unknown }).channel : undefined;
  return Boolean(
    (channel &&
      typeof channel === "object" &&
      "isThread" in channel &&
      typeof (channel as { isThread?: unknown }).isThread === "function" &&
      (channel as { isThread: () => boolean }).isThread()) ||
    isDiscordThreadChannelType(params.channelInfo?.type),
  );
}

function resolveInjectedBoundThreadLookupRecord(params: {
  threadBindings: DiscordMessagePreflightParams["threadBindings"];
  threadId: string;
}): BoundThreadLookupRecordLike | undefined {
  const getByThreadId = (params.threadBindings as { getByThreadId?: (threadId: string) => unknown })
    .getByThreadId;
  if (typeof getByThreadId !== "function") {
    return undefined;
  }
  const binding = getByThreadId(params.threadId);
  return binding && typeof binding === "object"
    ? (binding as BoundThreadLookupRecordLike)
    : undefined;
}

function resolveDiscordMentionState(params: {
  authorIsBot: boolean;
  botId?: string;
  hasAnyMention: boolean;
  isDirectMessage: boolean;
  isExplicitlyMentioned: boolean;
  mentionRegexes: RegExp[];
  mentionText: string;
  mentionedEveryone: boolean;
  referencedAuthorId?: string;
  senderIsPluralKit: boolean;
  transcript?: string;
}): { implicitMention: boolean; wasMentioned: boolean } {
  if (params.isDirectMessage) {
    return {
      implicitMention: false,
      wasMentioned: false,
    };
  }

  const everyoneMentioned =
    params.mentionedEveryone && (!params.authorIsBot || params.senderIsPluralKit);
  const wasMentioned =
    everyoneMentioned ||
    matchesMentionWithExplicit({
      text: params.mentionText,
      mentionRegexes: params.mentionRegexes,
      explicit: {
        hasAnyMention: params.hasAnyMention,
        isExplicitlyMentioned: params.isExplicitlyMentioned,
        canResolveExplicit: Boolean(params.botId),
      },
      transcript: params.transcript,
    });
  const implicitMention = Boolean(
    params.botId && params.referencedAuthorId && params.referencedAuthorId === params.botId,
  );

  return {
    implicitMention,
    wasMentioned,
  };
}

export function resolvePreflightMentionRequirement(params: {
  shouldRequireMention: boolean;
  bypassMentionRequirement: boolean;
}): boolean {
  if (!params.shouldRequireMention) {
    return false;
  }
  return !params.bypassMentionRequirement;
}

export function shouldIgnoreBoundThreadWebhookMessage(params: {
  accountId?: string;
  threadId?: string;
  webhookId?: string | null;
  threadBinding?: BoundThreadLookupRecordLike;
}): boolean {
  const webhookId = params.webhookId?.trim() || "";
  if (!webhookId) {
    return false;
  }
  const boundWebhookId =
    typeof params.threadBinding?.webhookId === "string"
      ? params.threadBinding.webhookId.trim()
      : typeof params.threadBinding?.metadata?.webhookId === "string"
        ? params.threadBinding.metadata.webhookId.trim()
        : "";
  if (!boundWebhookId) {
    const threadId = params.threadId?.trim() || "";
    if (!threadId) {
      return false;
=======
async function resolveDiscordHistoryMediaForPendingRecord(params: {
  preflight: DiscordMessagePreflightParams;
  message: DiscordMessagePreflightContext["message"];
}) {
  const imageAttachments = (params.message.attachments ?? [])
    .filter(isDiscordImageAttachmentCandidate)
    .slice(0, DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS);
  const stickers = resolveDiscordMessageStickers(params.message).slice(
    0,
    Math.max(0, DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS - imageAttachments.length),
  );
  if (imageAttachments.length === 0 && stickers.length === 0) {
    return [];
  }
  const rawData = (() => {
    try {
      return params.message.rawData;
    } catch {
      return {};
>>>>>>> upstream/main
    }
  })();
  const mediaMessage = Object.assign(
    Object.create(Object.getPrototypeOf(params.message)),
    params.message,
  ) as typeof params.message;
  Object.defineProperties(mediaMessage, {
    attachments: { value: imageAttachments },
    rawData: {
      value: {
        ...rawData,
        attachments: imageAttachments,
        sticker_items: stickers,
        stickers,
      },
    },
    stickers: { value: stickers },
  });
  const mediaList = await resolveMediaList(
    mediaMessage,
    Math.min(params.preflight.mediaMaxBytes, DISCORD_HISTORY_MEDIA_MAX_BYTES),
    {
      fetchImpl: params.preflight.discordRestFetch,
      ssrfPolicy: params.preflight.cfg.browser?.ssrfPolicy,
      readIdleTimeoutMs: DISCORD_HISTORY_MEDIA_IDLE_TIMEOUT_MS,
      totalTimeoutMs: DISCORD_HISTORY_MEDIA_TOTAL_TIMEOUT_MS,
      abortSignal: params.preflight.abortSignal,
    },
  );
  return toInboundMediaFacts(mediaList, { kind: "image", messageId: params.message.id });
}

async function recordDiscordPendingHistoryEntry(params: {
  preflight: DiscordMessagePreflightParams;
  historyKey: string;
  message: DiscordMessagePreflightContext["message"];
  entry?: HistoryEntry;
}) {
  if (params.preflight.historyLimit <= 0) {
    return;
  }
  await recordDroppedChannelInboundHistory({
    input: {
      id: params.message.id,
      timestamp: params.entry?.timestamp,
      rawText: params.entry?.body ?? "",
      textForAgent: params.entry?.body,
      raw: params.message,
    },
    admission: { kind: "drop", reason: "discord-preflight", recordHistory: true },
    preflight: {
      message: params.entry
        ? {
            rawBody: params.entry.body,
            body: params.entry.body,
            bodyForAgent: params.entry.body,
            senderLabel: params.entry.sender,
            envelopeFrom: params.entry.sender,
          }
        : undefined,
      history: {
        key: params.historyKey,
        historyMap: params.preflight.guildHistories,
        limit: params.preflight.historyLimit,
        recordOnDrop: true,
        mediaLimit: DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS,
        shouldRecord: () => !isPreflightAborted(params.preflight.abortSignal),
      },
      media: () =>
        resolveDiscordHistoryMediaForPendingRecord({
          preflight: params.preflight,
          message: params.message,
        }),
    },
  });
}

export async function preflightDiscordMessage(
  params: DiscordMessagePreflightParams,
): Promise<DiscordMessagePreflightContext | null> {
  if (isPreflightAborted(params.abortSignal)) {
    return null;
  }
  const logger = getChildLogger({ module: "discord-auto-reply" });
  let message = params.data.message;
  const author = params.data.author;
  if (!author) {
    return null;
  }
  const messageChannelId = resolveDiscordMessageChannelId({
    message,
    eventChannelId: params.data.channel_id,
  });
  if (!messageChannelId) {
    logVerbose(`discord: drop message ${message.id} (missing channel id)`);
    return null;
  }

  const allowBotsSetting = params.discordConfig?.allowBots;
  const allowBotsMode =
    allowBotsSetting === "mentions" ? "mentions" : allowBotsSetting === true ? "all" : "off";
  if (params.botUserId && author.id === params.botUserId) {
    // Always ignore own messages to prevent self-reply loops
    return null;
  }

  message = await hydrateDiscordMessageIfNeeded({
    client: params.client,
    message,
    messageChannelId,
  });
  if (isPreflightAborted(params.abortSignal)) {
    return null;
  }

  const pluralkitConfig = params.discordConfig?.pluralkit;
  const webhookId = resolveDiscordWebhookId(message);
<<<<<<< HEAD
  const shouldCheckPluralKit = Boolean(pluralkitConfig?.enabled) && !webhookId;
  let pluralkitInfo: Awaited<
    ReturnType<typeof import("../pluralkit.js").fetchPluralKitMessageInfo>
  > = null;
  if (shouldCheckPluralKit) {
    try {
      const { fetchPluralKitMessageInfo } = await loadPluralKitRuntime();
      pluralkitInfo = await fetchPluralKitMessageInfo({
        messageId: message.id,
        config: pluralkitConfig,
      });
      if (isPreflightAborted(params.abortSignal)) {
        return null;
      }
    } catch (err) {
      logVerbose(`discord: pluralkit lookup failed for ${message.id}: ${String(err)}`);
    }
=======
  const isGuildMessage = Boolean(params.data.guild_id);
  const channelInfo = await resolveDiscordChannelInfo(params.client, messageChannelId);
  if (isPreflightAborted(params.abortSignal)) {
    return null;
  }
  const { isDirectMessage, isGroupDm } = resolveDiscordPreflightConversationKind({
    isGuildMessage,
    channelType: channelInfo?.type,
  });
  const messageText = resolveDiscordMessageText(message, {
    includeForwarded: true,
  });
  const injectedBoundThreadBinding =
    !isDirectMessage && !isGroupDm
      ? resolveInjectedBoundThreadLookupRecord({
          threadBindings: params.threadBindings,
          threadId: messageChannelId,
        })
      : undefined;
  if (
    shouldIgnoreBoundThreadWebhookMessage({
      accountId: params.accountId,
      threadId: messageChannelId,
      webhookId,
      threadBinding: injectedBoundThreadBinding,
    })
  ) {
    logVerbose(`discord: drop bound-thread webhook echo message ${message.id}`);
    return null;
  }
  if (
    isBoundThreadBotSystemMessage({
      isBoundThreadSession:
        Boolean(injectedBoundThreadBinding) &&
        isDiscordThreadChannelMessage({
          isGuildMessage,
          message,
          channelInfo,
        }),
      isBotAuthor: Boolean(author.bot),
      text: messageText,
    })
  ) {
    logVerbose(`discord: drop bound-thread bot system message ${message.id}`);
    return null;
  }
  const pluralkitInfo = await resolveDiscordPreflightPluralKitInfo({
    message,
    config: pluralkitConfig,
    abortSignal: params.abortSignal,
  });
  if (isPreflightAborted(params.abortSignal)) {
    return null;
>>>>>>> upstream/main
  }
  const sender = resolveDiscordSenderIdentity({
    author,
    member: params.data.member,
    pluralkitInfo,
  });

  if (author.bot) {
    if (allowBotsMode === "off" && !sender.isPluralKit) {
      logVerbose("discord: drop bot message (allowBots=false)");
      return null;
    }
  }
<<<<<<< HEAD

  const isGuildMessage = Boolean(params.data.guild_id);
  const channelInfo = await resolveDiscordChannelInfo(params.client, messageChannelId);
  if (isPreflightAborted(params.abortSignal)) {
    return null;
  }
  const isDirectMessage = channelInfo?.type === ChannelType.DM;
  const isGroupDm = channelInfo?.type === ChannelType.GroupDM;
  const messageText = resolveDiscordMessageText(message, {
    includeForwarded: true,
  });
  const injectedBoundThreadBinding =
    !isDirectMessage && !isGroupDm
      ? resolveInjectedBoundThreadLookupRecord({
          threadBindings: params.threadBindings,
          threadId: messageChannelId,
        })
      : undefined;
  if (
    shouldIgnoreBoundThreadWebhookMessage({
      accountId: params.accountId,
      threadId: messageChannelId,
      webhookId,
      threadBinding: injectedBoundThreadBinding,
    })
  ) {
    logVerbose(`discord: drop bound-thread webhook echo message ${message.id}`);
    return null;
  }
  if (
    isBoundThreadBotSystemMessage({
      isBoundThreadSession:
        Boolean(injectedBoundThreadBinding) &&
        isDiscordThreadChannelMessage({
          isGuildMessage,
          message,
          channelInfo,
        }),
      isBotAuthor: Boolean(author.bot),
      text: messageText,
    })
  ) {
    logVerbose(`discord: drop bound-thread bot system message ${message.id}`);
    return null;
  }
=======
>>>>>>> upstream/main
  const data = message === params.data.message ? params.data : { ...params.data, message };
  logDebug(
    `[discord-preflight] channelId=${messageChannelId} guild_id=${params.data.guild_id} channelType=${channelInfo?.type} isGuild=${isGuildMessage} isDM=${isDirectMessage} isGroupDm=${isGroupDm}`,
  );

  if (isGroupDm && !params.groupDmEnabled) {
    logVerbose("discord: drop group dm (group dms disabled)");
    return null;
  }
  if (isDirectMessage && !params.dmEnabled) {
    logVerbose("discord: drop dm (dms disabled)");
    return null;
  }

<<<<<<< HEAD
  const dmPolicy = params.discordConfig?.dmPolicy ?? params.discordConfig?.dm?.policy ?? "pairing";
  const useAccessGroups = params.cfg.commands?.useAccessGroups !== false;
=======
  const dmPolicy = params.dmPolicy;
>>>>>>> upstream/main
  const resolvedAccountId = params.accountId ?? resolveDefaultDiscordAccountId(params.cfg);
  const allowNameMatching = isDangerousNameMatchingEnabled(params.discordConfig);
  let commandAuthorized = true;
  if (isDirectMessage) {
    const access = await resolveDiscordDmPreflightAccess({
      preflight: params,
      author,
      sender,
      dmPolicy,
      resolvedAccountId,
      allowNameMatching,
    });
    if (isPreflightAborted(params.abortSignal)) {
      return null;
    }
<<<<<<< HEAD
    commandAuthorized = dmAccess.commandAuthorized;
    if (dmAccess.decision !== "allow") {
      const allowMatchMeta = formatAllowlistMatchMeta(
        dmAccess.allowMatch.allowed ? dmAccess.allowMatch : undefined,
      );
      await handleDiscordDmCommandDecision({
        dmAccess,
        accountId: resolvedAccountId,
        sender: {
          id: author.id,
          tag: formatDiscordUserTag(author),
          name: author.username ?? undefined,
        },
        onPairingCreated: async (code) => {
          logVerbose(
            `discord pairing request sender=${author.id} tag=${formatDiscordUserTag(author)} (${allowMatchMeta})`,
          );
          try {
            const conversationRuntime = await loadConversationRuntime();
            const { sendMessageDiscord } = await loadDiscordSendRuntime();
            await sendMessageDiscord(
              `user:${author.id}`,
              conversationRuntime.buildPairingReply({
                channel: "discord",
                idLine: `Your Discord user id: ${author.id}`,
                code,
              }),
              {
                token: params.token,
                rest: params.client.rest,
                accountId: params.accountId,
              },
            );
          } catch (err) {
            logVerbose(`discord pairing reply failed for ${author.id}: ${String(err)}`);
          }
        },
        onUnauthorized: async () => {
          logVerbose(
            `Blocked unauthorized discord sender ${sender.id} (dmPolicy=${dmPolicy}, ${allowMatchMeta})`,
          );
        },
      });
=======
    if (!access) {
>>>>>>> upstream/main
      return null;
    }
    commandAuthorized = access.commandAuthorized;
  }

  const botId = params.botUserId;
  const baseText = resolveDiscordMessageText(message, {
    includeForwarded: false,
  });
<<<<<<< HEAD

  // Intercept text-only slash commands (e.g. user typing "/reset" instead of using Discord's slash command picker)
  // These should not be forwarded to the agent; proper slash command interactions are handled elsewhere
  if (!isDirectMessage && baseText && hasControlCommand(baseText, params.cfg)) {
    logVerbose(`discord: drop text-based slash command ${message.id} (intercepted at gateway)`);
    return null;
  }
=======
>>>>>>> upstream/main

  recordChannelActivity({
    channel: "discord",
    accountId: params.accountId,
    direction: "inbound",
  });

  // Resolve thread parent early for binding inheritance
  const channelName =
    channelInfo?.name ??
    (isGuildMessage || isGroupDm
      ? resolveDiscordChannelNameSafe(
          "channel" in message ? (message as { channel?: unknown }).channel : undefined,
        )
      : undefined);
<<<<<<< HEAD
  const { resolveDiscordThreadChannel, resolveDiscordThreadParentInfo } =
    await loadDiscordThreadingRuntime();
  const earlyThreadChannel = resolveDiscordThreadChannel({
=======
  const threadContext = await resolveDiscordPreflightThreadContext({
    client: params.client,
>>>>>>> upstream/main
    isGuildMessage,
    message,
    channelInfo,
    messageChannelId,
    abortSignal: params.abortSignal,
  });
  if (!threadContext) {
    return null;
  }
  const { earlyThreadChannel, earlyThreadParentId, earlyThreadParentName, earlyThreadParentType } =
    threadContext;

<<<<<<< HEAD
  // Use the active runtime snapshot for bindings lookup; routing inputs are
  // still payload-derived, but this path should not reparse config from disk.
=======
  // Routing inputs are payload-derived, but config must come from the boundary
  // snapshot already threaded into the monitor path.
>>>>>>> upstream/main
  const memberRoleIds = Array.isArray(params.data.rawMember?.roles)
    ? params.data.rawMember.roles
    : [];
<<<<<<< HEAD
  const freshCfg = loadConfig();
  const conversationRuntime = await loadConversationRuntime();
  const route = resolveDiscordConversationRoute({
    cfg: freshCfg,
    accountId: params.accountId,
    guildId: params.data.guild_id ?? undefined,
=======
  const routeState = await resolveDiscordPreflightRoute({
    preflight: params,
    author,
    isDirectMessage,
    isGroupDm,
    messageChannelId,
>>>>>>> upstream/main
    memberRoleIds,
    earlyThreadParentId,
  });
  const {
    conversationRuntime,
    threadBinding,
    configuredBinding,
    boundSessionKey,
    effectiveRoute,
    boundAgentId,
    baseSessionKey,
  } = routeState;
  if (
    shouldIgnoreBoundThreadWebhookMessage({
      accountId: params.accountId,
      threadId: messageChannelId,
      webhookId,
      threadBinding,
    })
  ) {
    logVerbose(`discord: drop bound-thread webhook echo message ${message.id}`);
    return null;
  }
  const isBoundThreadSession = Boolean(threadBinding && earlyThreadChannel);
  const bypassMentionRequirement = isBoundThreadSession;
  if (
    isBoundThreadBotSystemMessage({
      isBoundThreadSession,
      isBotAuthor: Boolean(author.bot),
      text: messageText,
    })
  ) {
    logVerbose(`discord: drop bound-thread bot system message ${message.id}`);
    return null;
  }
  const mentionRegexes = buildMentionRegexes(params.cfg, effectiveRoute.agentId, {
    provider: "discord",
    conversationId: messageChannelId,
    providerPolicy: params.discordConfig?.mentionPatterns,
  });
  const explicitlyMentioned = Boolean(
    botId && message.mentionedUsers?.some((user: User) => user.id === botId),
  );
  const hasAnyMention =
    !isDirectMessage &&
    ((message.mentionedUsers?.length ?? 0) > 0 ||
      (message.mentionedRoles?.length ?? 0) > 0 ||
      (message.mentionedEveryone && (!author.bot || sender.isPluralKit)));
  const hasUserOrRoleMention =
    !isDirectMessage &&
    ((message.mentionedUsers?.length ?? 0) > 0 || (message.mentionedRoles?.length ?? 0) > 0);

  if (
    isGuildMessage &&
    (message.type === MessageType.ChatInputCommand ||
      message.type === MessageType.ContextMenuCommand)
  ) {
    logVerbose("discord: drop channel command message");
    return null;
  }

  const guildInfo = isGuildMessage
    ? resolveDiscordGuildEntry({
        guild: params.data.guild ?? undefined,
        guildId: params.data.guild_id ?? undefined,
        guildEntries: params.guildEntries,
      })
    : null;
  logDebug(
    `[discord-preflight] guild_id=${params.data.guild_id} guild_obj=${Boolean(params.data.guild)} guild_obj_id=${params.data.guild?.id} guildInfo=${Boolean(guildInfo)} guildEntries=${params.guildEntries ? Object.keys(params.guildEntries).join(",") : "none"}`,
  );
  if (
    isGuildMessage &&
    params.guildEntries &&
    Object.keys(params.guildEntries).length > 0 &&
    !guildInfo
  ) {
    logDebug(
      `[discord-preflight] guild blocked: guild_id=${params.data.guild_id} guildEntries keys=${Object.keys(params.guildEntries).join(",")}`,
    );
    logVerbose(
      `Blocked discord guild ${params.data.guild_id ?? "unknown"} (not in discord.guilds)`,
    );
    return null;
  }

  // Reuse early thread resolution from above (for binding inheritance)
  const threadChannel = earlyThreadChannel;
  const threadParentId = earlyThreadParentId;
  const threadParentName = earlyThreadParentName;
  const threadParentType = earlyThreadParentType;
  const {
    threadName,
    configChannelName,
    configChannelSlug,
    displayChannelName,
    displayChannelSlug,
    guildSlug,
    channelConfig,
  } = resolveDiscordPreflightChannelContext({
    isGuildMessage,
    messageChannelId,
    channelName,
    guildName: params.data.guild?.name,
    guildInfo,
    threadChannel,
    threadParentId,
    threadParentName,
  });
  const channelMatchMeta = formatAllowlistMatchMeta(channelConfig);
  logDiscordPreflightChannelConfig({
    channelConfig,
    channelMatchMeta,
    channelId: messageChannelId,
  });
  const channelAccess = resolveDiscordPreflightChannelAccess({
    isGuildMessage,
    isGroupDm,
    groupPolicy: params.groupPolicy,
    groupDmChannels: params.groupDmChannels,
    messageChannelId,
    displayChannelName,
    displayChannelSlug,
    guildInfo,
    channelConfig,
    channelMatchMeta,
  });
  if (!channelAccess.allowed) {
    return null;
  }
  const { channelAllowlistConfigured, channelAllowed } = channelAccess;

  const historyEntry = buildDiscordPreflightHistoryEntry({
    isGuildMessage,
    historyLimit: params.historyLimit,
    message,
    senderLabel: sender.label,
  });

  const threadOwnerId = threadChannel
    ? (resolveDiscordChannelInfoSafe(threadChannel).ownerId ?? channelInfo?.ownerId)
    : undefined;
  const shouldRequireMentionByConfig = resolveDiscordShouldRequireMention({
    isGuildMessage,
    isThread: Boolean(threadChannel),
    botId,
    threadOwnerId,
    channelConfig,
    guildInfo,
  });
  const shouldRequireMention = resolvePreflightMentionRequirement({
    shouldRequireMention: shouldRequireMentionByConfig,
    bypassMentionRequirement,
  });
  const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
    channelConfig,
    guildInfo,
    memberRoleIds,
    sender,
    allowNameMatching,
  });

  if (isGuildMessage && hasAccessRestrictions && !memberAllowed) {
    logDebug(`[discord-preflight] drop: member not allowed`);
    // Keep stable Discord user IDs out of routine deny-path logs.
    logVerbose("Blocked discord guild sender (not in users/roles allowlist)");
    return null;
  }

  // Only authorized guild senders should reach the expensive transcription path.
  const { resolveDiscordPreflightAudioMentionContext } = await loadPreflightAudioRuntime();
  const { hasTypedText, transcript: preflightTranscript } =
    await resolveDiscordPreflightAudioMentionContext({
      message,
      isDirectMessage,
      shouldRequireMention,
      mentionRegexes,
      cfg: params.cfg,
      abortSignal: params.abortSignal,
    });
  if (isPreflightAborted(params.abortSignal)) {
    return null;
  }

  const mentionText = hasTypedText ? baseText : "";
<<<<<<< HEAD
  const { implicitMention, wasMentioned } = resolveDiscordMentionState({
=======
  const { implicitMentionKinds, wasMentioned } = resolveDiscordMentionState({
>>>>>>> upstream/main
    authorIsBot: Boolean(author.bot),
    botId,
    hasAnyMention,
    isDirectMessage,
    isExplicitlyMentioned: explicitlyMentioned,
    mentionRegexes,
    mentionText,
<<<<<<< HEAD
    mentionedEveryone: Boolean(message.mentionedEveryone),
=======
    mentionedEveryone: message.mentionedEveryone,
>>>>>>> upstream/main
    referencedAuthorId: message.referencedMessage?.author?.id,
    senderIsPluralKit: sender.isPluralKit,
    transcript: preflightTranscript,
  });
<<<<<<< HEAD
  if (shouldLogVerbose()) {
    logVerbose(
      `discord: inbound id=${message.id} guild=${params.data.guild_id ?? "dm"} channel=${messageChannelId} mention=${wasMentioned ? "yes" : "no"} type=${isDirectMessage ? "dm" : isGroupDm ? "group-dm" : "guild"} content=${messageText ? "yes" : "no"}`,
    );
  }
=======
  logDiscordPreflightInboundSummary({
    messageId: message.id,
    guildId: params.data.guild_id ?? undefined,
    channelId: messageChannelId,
    wasMentioned,
    isDirectMessage,
    isGroupDm,
    hasContent: Boolean(messageText),
  });
>>>>>>> upstream/main

  const allowTextCommands = shouldHandleTextCommands({
    cfg: params.cfg,
    surface: "discord",
  });
  const hasControlCommandInMessage = hasControlCommand(baseText, params.cfg);
<<<<<<< HEAD
=======
  const hasAbortRequest = isAbortRequestText(baseText);
>>>>>>> upstream/main

  if (!isDirectMessage) {
    const commandAccess = await resolveDiscordTextCommandAccess({
      accountId: params.accountId,
      cfg: params.cfg,
      ownerAllowFrom: params.allowFrom,
      sender: {
        id: sender.id,
        name: sender.name,
        tag: sender.tag,
      },
      memberAccessConfigured: hasAccessRestrictions,
      memberAllowed,
      allowNameMatching,
      allowTextCommands,
      hasControlCommand: hasControlCommandInMessage,
    });
    commandAuthorized = commandAccess.authorized;

    if (commandAccess.shouldBlockControlCommand) {
      logInboundDrop({
        log: logVerbose,
        channel: "discord",
        reason: "control command (unauthorized)",
        target: sender.id,
      });
      return null;
    }
  }

  const canDetectMention = Boolean(botId) || mentionRegexes.length > 0;
  const mentionDecision = resolveInboundMentionDecision({
    facts: {
      canDetectMention,
      wasMentioned,
      hasAnyMention,
      implicitMentionKinds,
    },
    policy: {
      isGroup: isGuildMessage,
      requireMention: shouldRequireMention,
      allowTextCommands,
      hasControlCommand: hasControlCommandInMessage,
      commandAuthorized,
    },
  });
  const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
  const inboundEventKind = classifyChannelInboundEvent({
    conversation: { kind: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel" },
    unmentionedGroupPolicy: resolveUnmentionedGroupInboundPolicy({
      cfg: params.cfg,
      agentId: effectiveRoute.agentId,
    }),
    wasMentioned: effectiveWasMentioned,
    hasControlCommand: hasControlCommandInMessage,
    hasAbortRequest,
  });
  logDebug(
    `[discord-preflight] shouldRequireMention=${shouldRequireMention} baseRequireMention=${shouldRequireMentionByConfig} boundThreadSession=${isBoundThreadSession} mentionDecision.shouldSkip=${mentionDecision.shouldSkip} wasMentioned=${wasMentioned}`,
  );
  if (isGuildMessage && shouldRequireMention) {
    if (mentionDecision.shouldSkip) {
      logDebug(`[discord-preflight] drop: no-mention`);
      logVerbose(`discord: drop guild message (mention required, botId=${botId ?? "<missing>"})`);
      logger.info(
        {
          channelId: messageChannelId,
          reason: "no-mention",
        },
        "discord: skipping guild message",
      );
      await recordDiscordPendingHistoryEntry({
        preflight: params,
        historyKey: messageChannelId,
        message,
        entry: historyEntry,
      });
      return null;
    }
  }

  if (author.bot && !sender.isPluralKit && allowBotsMode === "mentions") {
    const botMentioned = isDirectMessage || wasMentioned || mentionDecision.implicitMention;
    if (!botMentioned) {
      logDebug(`[discord-preflight] drop: bot message missing mention (allowBots=mentions)`);
      logVerbose("discord: drop bot message (allowBots=mentions, missing mention)");
      return null;
    }
  }
  const ignoreOtherMentions =
    channelConfig?.ignoreOtherMentions ?? guildInfo?.ignoreOtherMentions ?? false;
  if (
    isGuildMessage &&
    ignoreOtherMentions &&
    hasUserOrRoleMention &&
    !wasMentioned &&
    !mentionDecision.implicitMention
  ) {
    logDebug(`[discord-preflight] drop: other-mention`);
    logVerbose(
      `discord: drop guild message (another user/role mentioned, ignoreOtherMentions=true, botId=${botId})`,
    );
    await recordDiscordPendingHistoryEntry({
      preflight: params,
      historyKey: messageChannelId,
      message,
      entry: historyEntry,
    });
    return null;
  }

  const systemLocation = resolveDiscordSystemLocation({
    isDirectMessage,
    isGroupDm,
    guild: params.data.guild ?? undefined,
    channelName: channelName ?? messageChannelId,
  });
  const { resolveDiscordSystemEvent } = await loadSystemEventsRuntime();
  const systemText = resolveDiscordSystemEvent(message, systemLocation);
  if (systemText) {
    logDebug(`[discord-preflight] drop: system event`);
    enqueueSystemEvent(systemText, {
      sessionKey: effectiveRoute.sessionKey,
      contextKey: `discord:system:${messageChannelId}:${message.id}`,
    });
    return null;
  }

  if (!messageText) {
    logDebug(`[discord-preflight] drop: empty content`);
    logVerbose(`discord: drop message ${message.id} (empty content)`);
    return null;
  }
  if (configuredBinding) {
    const ensured = await conversationRuntime.ensureConfiguredBindingRouteReady({
      cfg: params.cfg,
      bindingResolution: configuredBinding,
    });
    if (!ensured.ok) {
      logVerbose(
        `discord: configured ACP binding unavailable for channel ${configuredBinding.record.conversation.conversationId}: ${ensured.error}`,
      );
      return null;
    }
  }

  const botLoopProtection =
    author.bot &&
    !sender.isPluralKit &&
    allowBotsMode !== "off" &&
    params.botUserId &&
    author.id !== params.botUserId
      ? {
          scopeId: params.accountId,
          conversationId: messageChannelId,
          senderId: author.id,
          receiverId: params.botUserId,
          config: params.discordConfig?.botLoopProtection,
          defaultsConfig: params.cfg.channels?.defaults?.botLoopProtection,
          defaultEnabled: true,
          nowMs: resolveTimestampMs(message.timestamp),
        }
      : undefined;

  logDebug(
    `[discord-preflight] success: route=${effectiveRoute.agentId} sessionKey=${effectiveRoute.sessionKey}`,
  );
  return buildDiscordMessagePreflightContext({
    preflightParams: params,
    data,
    client: params.client,
    message,
    messageChannelId,
    author,
    sender,
    canonicalMessageId: pluralkitInfo?.original?.trim() || undefined,
    memberRoleIds,
    channelInfo,
    channelName,
    isGuildMessage,
    isDirectMessage,
    isGroupDm,
    commandAuthorized,
    baseText,
    messageText,
    ...(preflightTranscript !== undefined ? { preflightAudioTranscript: preflightTranscript } : {}),
    wasMentioned,
    route: effectiveRoute,
    threadBinding,
    boundSessionKey: boundSessionKey || undefined,
    boundAgentId,
    guildInfo,
    guildSlug,
    threadChannel,
    threadParentId,
    threadParentName,
    threadParentType,
    threadName,
    configChannelName,
    configChannelSlug,
    displayChannelName,
    displayChannelSlug,
    baseSessionKey,
    channelConfig,
    channelAllowlistConfigured,
    channelAllowed,
    shouldRequireMention,
    hasAnyMention,
    hasControlCommand: hasControlCommandInMessage,
    allowTextCommands,
    shouldBypassMention: mentionDecision.shouldBypassMention,
    effectiveWasMentioned,
    inboundEventKind,
    canDetectMention,
    historyEntry,
    botLoopProtection,
  });
}
