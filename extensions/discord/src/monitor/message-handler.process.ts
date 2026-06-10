// Discord plugin module implements message handler.process behavior.
import path from "node:path";
import { MessageFlags } from "discord-api-types/v10";
import { resolveAckReaction, resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import {
  createStatusReactionController,
  DEFAULT_TIMING,
  logAckFailure,
  shouldAckReaction as shouldAckReactionGate,
} from "openclaw/plugin-sdk/channel-feedback";
import {
  dispatchChannelInboundReply,
  hasFinalInboundReplyDispatch,
  recordChannelBotPairLoopAndCheckSuppression,
} from "openclaw/plugin-sdk/channel-inbound";
<<<<<<< HEAD
import { createChannelReplyPipeline } from "openclaw/plugin-sdk/channel-reply-pipeline";
import { resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-streaming";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/config-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/config-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
import { readSessionUpdatedAt, resolveStorePath } from "openclaw/plugin-sdk/config-runtime";
=======
import {
  createChannelMessageReplyPipeline,
  defineFinalizableLivePreviewAdapter,
  deliverWithFinalizableLivePreviewAdapter,
  resolveChannelMessageSourceReplyDeliveryMode,
} from "openclaw/plugin-sdk/channel-outbound";
import {
  buildChannelProgressDraftLine,
  buildChannelProgressDraftLineForEntry,
  resolveChannelStreamingBlockEnabled,
  resolveTranscriptBackedChannelFinalText,
} from "openclaw/plugin-sdk/channel-outbound";
>>>>>>> upstream/main
import { recordInboundSession } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { resolveChunkMode } from "openclaw/plugin-sdk/reply-chunking";
<<<<<<< HEAD
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-dispatch-runtime";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-dispatch-runtime";
import {
  buildPendingHistoryContextFromMap,
  clearHistoryEntriesIfEnabled,
} from "openclaw/plugin-sdk/reply-history";
import { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { buildAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { danger, logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { evaluateSupplementalContextVisibility } from "openclaw/plugin-sdk/security-runtime";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-runtime";
import { stripInlineDirectiveTagsForDelivery } from "openclaw/plugin-sdk/text-runtime";
import { stripReasoningTagsFromText } from "openclaw/plugin-sdk/text-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-runtime";
import { resolveDiscordMaxLinesPerMessage } from "../accounts.js";
import { chunkDiscordTextWithMode } from "../chunk.js";
import { resolveDiscordDraftStreamingChunking } from "../draft-chunking.js";
import { createDiscordDraftStream } from "../draft-stream.js";
import { resolveDiscordPreviewStreamMode } from "../preview-streaming.js";
import { removeReactionDiscord } from "../send.js";
import { editMessageDiscord } from "../send.messages.js";
import {
  createDiscordAckReactionAdapter,
  createDiscordAckReactionContext,
  queueInitialDiscordAckReaction,
} from "./ack-reactions.js";
import { normalizeDiscordSlug } from "./allow-list.js";
import { resolveTimestampMs } from "./format.js";
import {
  buildDiscordInboundAccessContext,
  createDiscordSupplementalContextAccessChecker,
} from "./inbound-context.js";
import type { DiscordMessagePreflightContext } from "./message-handler.preflight.js";
=======
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import {
  buildTtsSupplementMediaPayload,
  getReplyPayloadTtsSupplement,
  isReplyPayloadNonTerminalToolErrorWarning,
  resolveSendableOutboundReplyParts,
} from "openclaw/plugin-sdk/reply-payload";
import type { ReplyDispatchKind, ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import { danger, logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
>>>>>>> upstream/main
import {
  loadSessionStore,
  readLatestAssistantTextFromSessionTranscript,
  resolveAndPersistSessionFile,
  resolveSessionStoreEntry,
  resolveStorePath,
} from "openclaw/plugin-sdk/session-store-runtime";
import { resolveDiscordAccount, resolveDiscordMaxLinesPerMessage } from "../accounts.js";
import { createDiscordRestClient } from "../client.js";
import { beginDiscordInboundEventDeliveryCorrelation } from "../inbound-event-delivery.js";
import {
  discordTextHasBroadcastMention,
  discordTextHasTargetedMention,
  rewriteDiscordKnownMentions,
} from "../mentions.js";
import { removeReactionDiscord } from "../send.js";
import { editMessageDiscord } from "../send.messages.js";
import { resolveDiscordTargetChannelId } from "../send.shared.js";
import { resolveDiscordChannelId } from "../targets.js";
import {
  createDiscordAckReactionAdapter,
  createDiscordAckReactionContext,
  queueInitialDiscordAckReaction,
} from "./ack-reactions.js";
import { buildDiscordMessageProcessContext } from "./message-handler.context.js";
import { createDiscordDraftPreviewController } from "./message-handler.draft-preview.js";
import type { DiscordMessagePreflightContext } from "./message-handler.preflight.js";
import { resolveForwardedMediaList, resolveMediaList } from "./message-utils.js";
import { deliverDiscordReply } from "./reply-delivery.js";
<<<<<<< HEAD
import { resolveDiscordAutoThreadReplyPlan, resolveDiscordThreadStarter } from "./threading.js";
=======
import { sanitizeDiscordFrontChannelReplyPayloads } from "./reply-safety.js";
import { createDiscordReplyTypingFeedback } from "./reply-typing-feedback.js";
>>>>>>> upstream/main
import {
  DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
  DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
} from "./timeouts.js";
<<<<<<< HEAD
import { sendTyping } from "./typing.js";
=======
>>>>>>> upstream/main

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

<<<<<<< HEAD
const DISCORD_TYPING_MAX_DURATION_MS = 20 * 60_000;
=======
>>>>>>> upstream/main
let replyRuntimePromise: Promise<typeof import("openclaw/plugin-sdk/reply-runtime")> | undefined;

async function loadReplyRuntime() {
  replyRuntimePromise ??= import("openclaw/plugin-sdk/reply-runtime");
  return await replyRuntimePromise;
}

function isProcessAborted(abortSignal?: AbortSignal): boolean {
  return Boolean(abortSignal?.aborted);
}

function formatDiscordReplyDeliveryFailure(params: {
  kind: string;
  err: unknown;
  target: string;
  sessionKey?: string;
}) {
  const context = [
    `target=${params.target}`,
    params.sessionKey ? `session=${params.sessionKey}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return `discord ${params.kind} reply failed (${context}): ${String(params.err)}`;
}

function isFallbackOnlyToolWarningFinal(payload: ReplyPayload): boolean {
  if (payload.isError !== true || !isReplyPayloadNonTerminalToolErrorWarning(payload)) {
    return false;
  }
  return !resolveSendableOutboundReplyParts(payload).hasMedia;
}

type DiscordReplySkipReason =
  | "aborted before delivery"
  | "reasoning payload"
  | "internal-only payload";

export function formatDiscordReplySkip(params: {
  kind: "tool" | "block" | "final";
  reason: DiscordReplySkipReason;
  target: string;
  sessionKey?: string;
}) {
  const context = [
    `target=${params.target}`,
    params.sessionKey ? `session=${params.sessionKey}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return `discord ${params.kind} reply skipped (${params.reason}): ${context}`;
}

type DiscordMessageProcessObserver = {
  onFinalReplyStart?: () => void;
  onFinalReplyDelivered?: () => void;
  onReplyPlanResolved?: (params: { createdThreadId?: string; sessionKey?: string }) => void;
};

type ToolStartPayload = {
  name?: string;
  phase?: string;
  args?: Record<string, unknown>;
  detailMode?: "explain" | "raw";
};

function readToolStringArg(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readToolBooleanArg(args: Record<string, unknown>, key: string): boolean {
  return args[key] === true;
}

export async function processDiscordMessage(
  ctx: DiscordMessagePreflightContext,
  observer?: DiscordMessageProcessObserver,
) {
  try {
    await processDiscordMessageInner(ctx, observer);
  } finally {
    ctx.replyTypingFeedback?.onCleanup?.();
  }
}

async function processDiscordMessageInner(
  ctx: DiscordMessagePreflightContext,
  observer?: DiscordMessageProcessObserver,
) {
  const dispatchStartedAt = Date.now();
  const {
    cfg,
    discordConfig,
    accountId,
    token,
    runtime,
    guildHistories,
    historyLimit,
    mediaMaxBytes,
    textLimit,
    replyToMode,
    ackReactionScope,
    message,
    messageChannelId,
    isGuildMessage,
    isDirectMessage,
    isGroupDm,
    messageText,
    shouldRequireMention,
    canDetectMention,
    effectiveWasMentioned,
    shouldBypassMention,
    channelConfig,
    threadBindings,
    route,
    discordRestFetch,
    abortSignal,
    botLoopProtection,
    replyTypingFeedback,
  } = ctx;
  if (isProcessAborted(abortSignal)) {
    return;
  }
  if (botLoopProtection) {
    const botLoopResult = recordChannelBotPairLoopAndCheckSuppression(botLoopProtection);
    if (botLoopResult.suppressed) {
      logVerbose(
        `discord: bot-to-bot loop detected before dispatch setup, suppressing for ${Math.max(0, Math.ceil((botLoopResult.cooldownUntilMs - Date.now()) / 1000))}s`,
      );
      return;
    }
  }

  const ssrfPolicy = cfg.browser?.ssrfPolicy;
  const mediaResolveOptions = {
    fetchImpl: discordRestFetch,
    ssrfPolicy,
    readIdleTimeoutMs: DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
    totalTimeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
    abortSignal,
  };
  const mediaList = await resolveMediaList(message, mediaMaxBytes, mediaResolveOptions);
  if (isProcessAborted(abortSignal)) {
    return;
  }
  const forwardedMediaList = await resolveForwardedMediaList(
    message,
    mediaMaxBytes,
    mediaResolveOptions,
  );
  if (isProcessAborted(abortSignal)) {
    return;
  }
  mediaList.push(...forwardedMediaList);
  const text = messageText;
  if (!text) {
    logVerbose("discord: drop message " + message.id + " (empty content)");
    return;
  }

  const boundThreadId = ctx.threadBinding?.conversation?.conversationId?.trim();
  if (boundThreadId && typeof threadBindings.touchThread === "function") {
    threadBindings.touchThread({ threadId: boundThreadId });
  }
  const { dispatchReplyWithBufferedBlockDispatcher } = await loadReplyRuntime();
  const sourceReplyDeliveryMode = resolveChannelMessageSourceReplyDeliveryMode({
    cfg,
    ctx: {
      ChatType: isDirectMessage
        ? "direct"
        : isGroupDm
          ? "group"
          : isGuildMessage
            ? "channel"
            : undefined,
      InboundEventKind: ctx.inboundEventKind,
    },
  });
  const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
  const ackReaction = resolveAckReaction(cfg, route.agentId, {
    channel: "discord",
    accountId,
  });
  const removeAckAfterReply = cfg.messages?.removeAckAfterReply ?? false;
  const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, route.agentId);
  const isRoomEvent = ctx.inboundEventKind === "room_event";
  const shouldAckReaction = () =>
    Boolean(
      !isRoomEvent &&
      ackReaction &&
      shouldAckReactionGate({
        scope: ackReactionScope,
        isDirect: isDirectMessage,
        isGroup: isGuildMessage || isGroupDm,
        isMentionableGroup: isGuildMessage,
        requireMention: shouldRequireMention,
        canDetectMention,
        effectiveWasMentioned,
        shouldBypassMention,
      }),
    );
  const shouldSendAckReaction = shouldAckReaction();
<<<<<<< HEAD
  const statusReactionsEnabled =
    shouldSendAckReaction && cfg.messages?.statusReactions?.enabled !== false;
  // Discord outbound helpers expect Carbon's request client shape explicitly.
  const ackReactionContext = createDiscordAckReactionContext({
    rest: client.rest as unknown as RequestClient,
=======
  const statusReactionsExplicitlyEnabled = cfg.messages?.statusReactions?.enabled === true;
  const statusReactionsEnabled =
    !isRoomEvent &&
    shouldSendAckReaction &&
    cfg.messages?.statusReactions?.enabled !== false &&
    (!sourceRepliesAreToolOnly || statusReactionsExplicitlyEnabled);
  const feedbackRest = createDiscordRestClient({
    cfg,
    token,
    accountId,
  }).rest;
  const deliveryRest = createDiscordRestClient({
    cfg,
    token,
    accountId,
  }).rest;
  // Discord outbound helpers expect the internal REST client shape explicitly.
  const ackReactionContext = createDiscordAckReactionContext({
    rest: feedbackRest,
>>>>>>> upstream/main
    cfg,
    accountId,
  });
  const discordAdapter = createDiscordAckReactionAdapter({
    channelId: messageChannelId,
    messageId: message.id,
    reactionContext: ackReactionContext,
  });
<<<<<<< HEAD
  const statusReactions = createStatusReactionController({
=======
  let statusReactionTarget = `${messageChannelId}/${message.id}`;
  let statusReactionsActive = statusReactionsEnabled;
  let statusReactions = createStatusReactionController({
>>>>>>> upstream/main
    enabled: statusReactionsEnabled,
    adapter: discordAdapter,
    initialEmoji: ackReaction,
    emojis: cfg.messages?.statusReactions?.emojis,
    timing: cfg.messages?.statusReactions?.timing,
    onError: (err) => {
      logAckFailure({
        log: logVerbose,
        channel: "discord",
        target: statusReactionTarget,
        error: err,
      });
    },
  });
<<<<<<< HEAD
  queueInitialDiscordAckReaction({
    enabled: statusReactionsEnabled,
    shouldSendAckReaction,
    ackReaction,
    statusReactions,
    reactionAdapter: discordAdapter,
    target: `${messageChannelId}/${message.id}`,
  });
  const { createReplyDispatcherWithTyping, dispatchInboundMessage } = await loadReplyRuntime();

  const fromLabel = isDirectMessage
    ? buildDirectLabel(author)
    : buildGuildLabel({
        guild: data.guild ?? undefined,
        channelName: channelName ?? messageChannelId,
        channelId: messageChannelId,
      });
  const senderLabel = sender.label;
  const isForumParent =
    threadParentType === ChannelType.GuildForum || threadParentType === ChannelType.GuildMedia;
  const forumParentSlug =
    isForumParent && threadParentName ? normalizeDiscordSlug(threadParentName) : "";
  const threadChannelId = threadChannel?.id;
  const isForumStarter =
    Boolean(threadChannelId && isForumParent && forumParentSlug) && message.id === threadChannelId;
  const forumContextLine = isForumStarter ? `[Forum parent: #${forumParentSlug}]` : null;
  const groupChannel = isGuildMessage && displayChannelSlug ? `#${displayChannelSlug}` : undefined;
  const groupSubject = isDirectMessage ? undefined : groupChannel;
  const senderName = sender.isPluralKit
    ? (sender.name ?? author.username)
    : (data.member?.nickname ?? author.globalName ?? author.username);
  const senderUsername = sender.isPluralKit
    ? (sender.tag ?? sender.name ?? author.username)
    : author.username;
  const senderTag = sender.tag;
  const { groupSystemPrompt, ownerAllowFrom, untrustedContext } = buildDiscordInboundAccessContext({
    channelConfig,
    guildInfo,
    sender: { id: sender.id, name: sender.name, tag: sender.tag },
    allowNameMatching: isDangerousNameMatchingEnabled(discordConfig),
    isGuild: isGuildMessage,
    channelTopic: channelInfo?.topic,
    messageBody: text,
  });
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg,
    channel: "discord",
    accountId,
  });
  const allowNameMatching = isDangerousNameMatchingEnabled(discordConfig);
  const isSupplementalContextSenderAllowed = createDiscordSupplementalContextAccessChecker({
    channelConfig,
    guildInfo,
    allowNameMatching,
    isGuild: isGuildMessage,
  });
  const storePath = resolveStorePath(cfg.session?.store, {
    agentId: route.agentId,
  });
  const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
  const previousTimestamp = readSessionUpdatedAt({
    storePath,
    sessionKey: route.sessionKey,
  });
  let combinedBody = formatInboundEnvelope({
    channel: "Discord",
    from: fromLabel,
    timestamp: resolveTimestampMs(message.timestamp),
    body: text,
    chatType: isDirectMessage ? "direct" : "channel",
    senderLabel,
    previousTimestamp,
    envelope: envelopeOptions,
  });
  const shouldIncludeChannelHistory =
    !isDirectMessage && !(isGuildMessage && channelConfig?.autoThread && !threadChannel);
  if (shouldIncludeChannelHistory) {
    combinedBody = buildPendingHistoryContextFromMap({
      historyMap: guildHistories,
      historyKey: messageChannelId,
      limit: historyLimit,
      currentMessage: combinedBody,
      formatEntry: (entry) =>
        formatInboundEnvelope({
          channel: "Discord",
          from: fromLabel,
          timestamp: entry.timestamp,
          body: `${entry.body} [id:${entry.messageId ?? "unknown"} channel:${messageChannelId}]`,
          chatType: "channel",
          senderLabel: entry.sender,
          envelope: envelopeOptions,
        }),
    });
  }
  const replyContext = resolveReplyContext(message, resolveDiscordMessageText);
  const replyVisibility = replyContext
    ? evaluateSupplementalContextVisibility({
        mode: contextVisibilityMode,
        kind: "quote",
        senderAllowed: isSupplementalContextSenderAllowed({
          id: replyContext.senderId,
          name: replyContext.senderName,
          tag: replyContext.senderTag,
          memberRoleIds: replyContext.memberRoleIds,
        }),
      })
    : null;
  const filteredReplyContext = replyContext && replyVisibility?.include ? replyContext : null;
  if (replyContext && !filteredReplyContext && isGuildMessage) {
    logVerbose(`discord: drop reply context (mode=${contextVisibilityMode})`);
  }
  if (forumContextLine) {
    combinedBody = `${combinedBody}\n${forumContextLine}`;
  }

  let threadStarterBody: string | undefined;
  let threadLabel: string | undefined;
  let parentSessionKey: string | undefined;
  if (threadChannel) {
    const includeThreadStarter = channelConfig?.includeThreadStarter !== false;
    if (includeThreadStarter) {
      const starter = await resolveDiscordThreadStarter({
        channel: threadChannel,
        client,
        parentId: threadParentId,
        parentType: threadParentType,
        resolveTimestampMs,
      });
      if (starter?.text) {
        const starterVisibility = evaluateSupplementalContextVisibility({
          mode: contextVisibilityMode,
          kind: "thread",
          senderAllowed: isSupplementalContextSenderAllowed({
            id: starter.authorId,
            name: starter.authorName ?? starter.author,
            tag: starter.authorTag,
            memberRoleIds: starter.memberRoleIds,
          }),
        });
        if (starterVisibility.include) {
          // Keep thread starter as raw text; metadata is provided out-of-band in the system prompt.
          threadStarterBody = starter.text;
        } else {
          logVerbose(`discord: drop thread starter context (mode=${contextVisibilityMode})`);
        }
      }
    }
    const parentName = threadParentName ?? "parent";
    threadLabel = threadName
      ? `Discord thread #${normalizeDiscordSlug(parentName)} › ${threadName}`
      : `Discord thread #${normalizeDiscordSlug(parentName)}`;
    if (threadParentId) {
      parentSessionKey = buildAgentSessionKey({
        agentId: route.agentId,
        channel: route.channel,
        peer: { kind: "channel", id: threadParentId },
      });
    }
  }
  const mediaPayload = buildDiscordMediaPayload(mediaList);
  const threadKeys = resolveThreadSessionKeys({
    baseSessionKey,
    threadId: threadChannel ? messageChannelId : undefined,
    parentSessionKey,
    useSuffix: false,
=======
  const resolveTrackedReactionChannelId = async (
    args: Record<string, unknown>,
  ): Promise<string> => {
    const target =
      readToolStringArg(args, "channelId") ??
      readToolStringArg(args, "channel_id") ??
      readToolStringArg(args, "to");
    if (!target) {
      return messageChannelId;
    }
    try {
      return resolveDiscordChannelId(target);
    } catch {
      return (
        await resolveDiscordTargetChannelId(target, {
          cfg,
          token,
          accountId,
        })
      ).channelId;
    }
  };
  const maybeBindStatusReactionsToToolReaction = async (payload: ToolStartPayload) => {
    if (
      sourceRepliesAreToolOnly ||
      cfg.messages?.statusReactions?.enabled === false ||
      payload.phase !== "start" ||
      payload.name !== "message" ||
      !payload.args
    ) {
      return;
    }
    const args = payload.args;
    const action = readToolStringArg(args, "action")?.toLowerCase();
    if (action !== "react") {
      return;
    }
    const shouldTrack =
      readToolBooleanArg(args, "trackToolCalls") || readToolBooleanArg(args, "track_tool_calls");
    if (!shouldTrack) {
      return;
    }
    const emoji = readToolStringArg(args, "emoji");
    const remove = readToolBooleanArg(args, "remove");
    if (!emoji || remove) {
      return;
    }
    const trackedMessageId =
      readToolStringArg(args, "messageId") ?? readToolStringArg(args, "message_id") ?? message.id;
    let trackedChannelId: string;
    try {
      trackedChannelId = await resolveTrackedReactionChannelId(args);
    } catch (err) {
      logAckFailure({
        log: logVerbose,
        channel: "discord",
        target: `${readToolStringArg(args, "to") ?? readToolStringArg(args, "channelId") ?? messageChannelId}/${trackedMessageId}`,
        error: err,
      });
      return;
    }
    statusReactionTarget = `${trackedChannelId}/${trackedMessageId}`;
    if (statusReactionsActive) {
      void statusReactions.clear();
    }
    const trackedAdapter = createDiscordAckReactionAdapter({
      channelId: trackedChannelId,
      messageId: trackedMessageId,
      reactionContext: ackReactionContext,
    });
    statusReactions = createStatusReactionController({
      enabled: true,
      adapter: trackedAdapter,
      initialEmoji: emoji,
      emojis: cfg.messages?.statusReactions?.emojis,
      timing: cfg.messages?.statusReactions?.timing,
      onError: (err) => {
        logAckFailure({
          log: logVerbose,
          channel: "discord",
          target: statusReactionTarget,
          error: err,
        });
      },
    });
    statusReactionsActive = true;
    void statusReactions.setQueued();
  };
  queueInitialDiscordAckReaction({
    enabled: statusReactionsEnabled,
    shouldSendAckReaction,
    ackReaction,
    statusReactions,
    reactionAdapter: discordAdapter,
    target: `${messageChannelId}/${message.id}`,
>>>>>>> upstream/main
  });
  const processContext = await buildDiscordMessageProcessContext({
    ctx,
    text,
    mediaList,
  });
  if (!processContext) {
    return;
  }
<<<<<<< HEAD
  // Keep DM routes user-addressed so follow-up sends resolve direct session keys.
  const lastRouteTo = isDirectMessage ? `user:${author.id}` : effectiveTo;

  const inboundHistory =
    shouldIncludeChannelHistory && historyLimit > 0
      ? (guildHistories.get(messageChannelId) ?? []).map((entry) => ({
          sender: entry.sender,
          body: entry.body,
          timestamp: entry.timestamp,
        }))
      : undefined;

  const ctxPayload = finalizeInboundContext({
    Body: combinedBody,
    BodyForAgent: baseText ?? text,
    InboundHistory: inboundHistory,
    RawBody: baseText,
    CommandBody: baseText,
    From: effectiveFrom,
    To: effectiveTo,
    SessionKey: boundSessionKey ?? autoThreadContext?.SessionKey ?? threadKeys.sessionKey,
    AccountId: route.accountId,
    ChatType: isDirectMessage ? "direct" : "channel",
    ConversationLabel: fromLabel,
    SenderName: senderName,
    SenderId: sender.id,
    SenderUsername: senderUsername,
    SenderTag: senderTag,
    GroupSubject: groupSubject,
    GroupChannel: groupChannel,
    UntrustedContext: untrustedContext,
    GroupSystemPrompt: isGuildMessage ? groupSystemPrompt : undefined,
    GroupSpace: isGuildMessage ? (guildInfo?.id ?? guildSlug) || undefined : undefined,
    OwnerAllowFrom: ownerAllowFrom,
    Provider: "discord" as const,
    Surface: "discord" as const,
    WasMentioned: effectiveWasMentioned,
    MessageSid: message.id,
    ReplyToId: filteredReplyContext?.id,
    ReplyToBody: filteredReplyContext?.body,
    ReplyToSender: filteredReplyContext?.sender,
    ParentSessionKey: autoThreadContext?.ParentSessionKey ?? threadKeys.parentSessionKey,
    MessageThreadId: threadChannel?.id ?? autoThreadContext?.createdThreadId ?? undefined,
    ThreadStarterBody: threadStarterBody,
    ThreadLabel: threadLabel,
    Timestamp: resolveTimestampMs(message.timestamp),
    ...mediaPayload,
    CommandAuthorized: commandAuthorized,
    CommandSource: "text" as const,
    // Originating channel for reply routing.
    OriginatingChannel: "discord" as const,
    OriginatingTo: autoThreadContext?.OriginatingTo ?? replyTarget,
  });
  const persistedSessionKey = ctxPayload.SessionKey ?? route.sessionKey;
=======
  const {
    ctxPayload,
    persistedSessionKey,
    turn,
    replyPlan,
    deliverTarget,
    replyTarget,
    replyReference,
  } = processContext;
>>>>>>> upstream/main
  observer?.onReplyPlanResolved?.({
    createdThreadId: replyPlan.createdThreadId,
    sessionKey: persistedSessionKey,
  });

  const typingChannelId = deliverTarget.startsWith("channel:")
    ? deliverTarget.slice("channel:".length)
    : messageChannelId;
  // Deliver target can move into a thread after preflight accepted the message.
  // The typing owner follows the final target before reply dispatch starts.
  const typingFeedback =
    replyTypingFeedback ??
    createDiscordReplyTypingFeedback({
      cfg,
      token,
      accountId,
      channelId: typingChannelId,
      rest: feedbackRest,
      log: logVerbose,
    });
  if (replyTypingFeedback) {
    // A carried prestart only covers queue wait time; dispatch needs a fresh
    // controller after retargeting so an expired TTL cannot silence the run.
    replyTypingFeedback.restartForDispatch(typingChannelId);
  } else {
    typingFeedback.updateChannelId(typingChannelId);
  }

  const { onModelSelected, ...replyPipeline } = createChannelMessageReplyPipeline({
    cfg,
    agentId: route.agentId,
    channel: "discord",
    accountId: route.accountId,
    typingCallbacks: typingFeedback,
  });
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "discord",
    accountId,
  });
  const maxLinesPerMessage = resolveDiscordMaxLinesPerMessage({
    cfg,
    discordConfig,
    accountId,
  });
  const chunkMode = resolveChunkMode(cfg, "discord", accountId);
  const clearGroupHistory = () => {
    if (isDirectMessage) {
      return;
    }
    createChannelHistoryWindow({ historyMap: guildHistories }).clear({
      historyKey: messageChannelId,
      limit: historyLimit,
    });
  };
  const beginDeliveryCorrelation = () =>
    isRoomEvent
      ? beginDiscordInboundEventDeliveryCorrelation(
          ctxPayload.SessionKey,
          {
            outboundTo: messageChannelId,
            outboundAccountId: route.accountId,
            markInboundEventDelivered: clearGroupHistory,
          },
          { inboundEventKind: ctxPayload.InboundEventKind },
        )
      : () => {};
  const endDiscordInboundEventDeliveryCorrelation = beginDeliveryCorrelation();
  const resolveCurrentTurnTranscriptFinalText = async (): Promise<string | undefined> => {
    const sessionKey = ctxPayload.SessionKey;
    if (!sessionKey) {
      return undefined;
    }
    try {
      const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
      const store = loadSessionStore(storePath, { clone: false });
      const sessionEntry = resolveSessionStoreEntry({ store, sessionKey }).existing;
      if (!sessionEntry?.sessionId) {
        return undefined;
      }
      const { sessionFile } = await resolveAndPersistSessionFile({
        sessionId: sessionEntry.sessionId,
        sessionKey,
        sessionStore: store,
        storePath,
        sessionEntry,
        agentId: route.agentId,
        sessionsDir: path.dirname(storePath),
      });
      const latest = await readLatestAssistantTextFromSessionTranscript(sessionFile);
      if (!latest?.timestamp || latest.timestamp < dispatchStartedAt) {
        return undefined;
      }
      return latest.text;
    } catch (err) {
      logVerbose(`discord transcript final candidate lookup failed: ${String(err)}`);
      return undefined;
    }
  };

<<<<<<< HEAD
  // --- Discord draft stream (edit-based preview streaming) ---
  const discordStreamMode = resolveDiscordPreviewStreamMode(discordConfig);
  const draftMaxChars = Math.min(textLimit, 2000);
  const accountBlockStreamingEnabled =
    resolveChannelStreamingBlockEnabled(discordConfig) ??
    cfg.agents?.defaults?.blockStreamingDefault === "on";
  const canStreamDraft = discordStreamMode !== "off" && !accountBlockStreamingEnabled;
  const draftReplyToMessageId = () => replyReference.use();
  const deliverChannelId = deliverTarget.startsWith("channel:")
    ? deliverTarget.slice("channel:".length)
    : messageChannelId;
  const draftStream = canStreamDraft
    ? createDiscordDraftStream({
        rest: client.rest,
        channelId: deliverChannelId,
        maxChars: draftMaxChars,
        replyToMessageId: draftReplyToMessageId,
        minInitialChars: 30,
        throttleMs: 1200,
        log: logVerbose,
        warn: logVerbose,
      })
    : undefined;
  const draftChunking =
    draftStream && discordStreamMode === "block"
      ? resolveDiscordDraftStreamingChunking(cfg, accountId)
      : undefined;
  const shouldSplitPreviewMessages = discordStreamMode === "block";
  const draftChunker = draftChunking ? new EmbeddedBlockChunker(draftChunking) : undefined;
  let lastPartialText = "";
  let draftText = "";
  let hasStreamedMessage = false;
  let finalizedViaPreviewMessage = false;

  const resolvePreviewFinalText = (text?: string) => {
    if (typeof text !== "string") {
      return undefined;
    }
    const formatted = convertMarkdownTables(
      stripInlineDirectiveTagsForDelivery(text).text,
      tableMode,
    );
    const chunks = chunkDiscordTextWithMode(formatted, {
      maxChars: draftMaxChars,
      maxLines: maxLinesPerMessage,
      chunkMode,
    });
    if (!chunks.length && formatted) {
      chunks.push(formatted);
    }
    if (chunks.length !== 1) {
      return undefined;
    }
    const trimmed = chunks[0].trim();
    if (!trimmed) {
      return undefined;
    }
    const currentPreviewText = discordStreamMode === "block" ? draftText : lastPartialText;
    if (
      currentPreviewText &&
      currentPreviewText.startsWith(trimmed) &&
      trimmed.length < currentPreviewText.length
    ) {
      return undefined;
    }
    return trimmed;
  };

  const updateDraftFromPartial = (text?: string) => {
    if (!draftStream || !text) {
      return;
    }
    // Strip reasoning/thinking tags that may leak through the stream.
    const cleaned = stripInlineDirectiveTagsForDelivery(
      stripReasoningTagsFromText(text, { mode: "strict", trim: "both" }),
    ).text;
    // Skip pure-reasoning messages (e.g. "Reasoning:\n…") that contain no answer text.
    if (!cleaned || cleaned.startsWith("Reasoning:\n")) {
      return;
    }
    if (cleaned === lastPartialText) {
      return;
    }
    hasStreamedMessage = true;
    if (discordStreamMode === "partial") {
      // Keep the longer preview to avoid visible punctuation flicker.
      if (
        lastPartialText &&
        lastPartialText.startsWith(cleaned) &&
        cleaned.length < lastPartialText.length
      ) {
        return;
      }
      lastPartialText = cleaned;
      draftStream.update(cleaned);
      return;
    }

    let delta = cleaned;
    if (cleaned.startsWith(lastPartialText)) {
      delta = cleaned.slice(lastPartialText.length);
    } else {
      // Streaming buffer reset (or non-monotonic stream). Start fresh.
      draftChunker?.reset();
      draftText = "";
    }
    lastPartialText = cleaned;
    if (!delta) {
      return;
    }
    if (!draftChunker) {
      draftText = cleaned;
      draftStream.update(draftText);
      return;
    }
    draftChunker.append(delta);
    draftChunker.drain({
      force: false,
      emit: (chunk) => {
        draftText += chunk;
        draftStream.update(draftText);
      },
    });
  };

  const flushDraft = async () => {
    if (!draftStream) {
      return;
    }
    if (draftChunker?.hasBuffered()) {
      draftChunker.drain({
        force: true,
        emit: (chunk) => {
          draftText += chunk;
        },
      });
      draftChunker.reset();
      if (draftText) {
        draftStream.update(draftText);
      }
    }
    await draftStream.flush();
  };

  // When draft streaming is active, suppress block streaming to avoid double-streaming.
  const disableBlockStreamingForDraft = draftStream ? true : undefined;
=======
  const deliverChannelId = deliverTarget.startsWith("channel:")
    ? deliverTarget.slice("channel:".length)
    : messageChannelId;
  const draftPreview = createDiscordDraftPreviewController({
    cfg,
    discordConfig,
    accountId,
    sourceRepliesAreToolOnly,
    textLimit,
    deliveryRest,
    deliverChannelId,
    replyReference,
    tableMode,
    maxLinesPerMessage,
    chunkMode,
    log: logVerbose,
  });
  const finalPreviewFlags =
    (discordConfig?.suppressEmbeds ?? true) ? MessageFlags.SuppressEmbeds : undefined;
>>>>>>> upstream/main
  let finalReplyStartNotified = false;
  const notifyFinalReplyStart = () => {
    if (finalReplyStartNotified) {
      return;
    }
    finalReplyStartNotified = true;
    draftPreview.markFinalReplyStarted();
    observer?.onFinalReplyStart?.();
  };
<<<<<<< HEAD

  const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } =
    createReplyDispatcherWithTyping({
      ...replyPipeline,
      humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
      deliver: async (payload: ReplyPayload, info) => {
        if (isProcessAborted(abortSignal)) {
          return;
        }
        const isFinal = info.kind === "final";
        if (payload.isReasoning) {
          // Reasoning/thinking payloads should not be delivered to Discord.
          return;
        }
        if (draftStream && isFinal) {
          await flushDraft();
          const reply = resolveSendableOutboundReplyParts(payload);
          const hasMedia = reply.hasMedia;
          const finalText = payload.text;
          const previewFinalText = resolvePreviewFinalText(finalText);
          const hasExplicitReplyDirective =
            Boolean(payload.replyToTag || payload.replyToCurrent) ||
            (typeof finalText === "string" && /\[\[\s*reply_to(?:_current|\s*:)/i.test(finalText));
          const previewMessageId = draftStream.messageId();

          // Try to finalize via preview edit (text-only, fits in 2000 chars, not an error)
          const canFinalizeViaPreviewEdit =
            !finalizedViaPreviewMessage &&
            !hasMedia &&
            typeof previewFinalText === "string" &&
            typeof previewMessageId === "string" &&
            !hasExplicitReplyDirective &&
            !payload.isError;

          if (canFinalizeViaPreviewEdit) {
            await draftStream.stop();
            if (isProcessAborted(abortSignal)) {
              return;
            }
            try {
              notifyFinalReplyStart();
              await editMessageDiscord(
                deliverChannelId,
                previewMessageId,
                { content: previewFinalText },
                { rest: client.rest },
              );
              finalizedViaPreviewMessage = true;
              replyReference.markSent();
              observer?.onFinalReplyDelivered?.();
              return;
            } catch (err) {
              logVerbose(
                `discord: preview final edit failed; falling back to standard send (${String(err)})`,
              );
            }
          }

          // Check if stop() flushed a message we can edit
          if (!finalizedViaPreviewMessage) {
            await draftStream.stop();
            if (isProcessAborted(abortSignal)) {
              return;
            }
            const messageIdAfterStop = draftStream.messageId();
            if (
              typeof messageIdAfterStop === "string" &&
              typeof previewFinalText === "string" &&
              !hasMedia &&
              !hasExplicitReplyDirective &&
              !payload.isError
            ) {
              try {
                notifyFinalReplyStart();
                await editMessageDiscord(
                  deliverChannelId,
                  messageIdAfterStop,
                  { content: previewFinalText },
                  { rest: client.rest },
                );
                finalizedViaPreviewMessage = true;
                replyReference.markSent();
                observer?.onFinalReplyDelivered?.();
                return;
              } catch (err) {
                logVerbose(
                  `discord: post-stop preview edit failed; falling back to standard send (${String(err)})`,
                );
              }
            }
          }

          // Clear the preview and fall through to standard delivery
          if (!finalizedViaPreviewMessage) {
            await draftStream.clear();
          }
        }
        if (isProcessAborted(abortSignal)) {
          return;
        }

        const replyToId = replyReference.use();
        if (isFinal) {
          notifyFinalReplyStart();
        }
        await deliverDiscordReply({
          cfg,
          replies: [payload],
=======
  let userFacingFinalDelivered = false;
  let userFacingFinalDeliveryFailed = false;
  let pendingToolWarningFinal:
    | { payload: ReplyPayload; info: { kind: ReplyDispatchKind } }
    | undefined;
  const markUserFacingFinalDelivered = () => {
    userFacingFinalDelivered = true;
    userFacingFinalDeliveryFailed = false;
    pendingToolWarningFinal = undefined;
    draftPreview.markFinalReplyDelivered();
    observer?.onFinalReplyDelivered?.();
  };
  const beforeDiscordPayloadDelivery = (
    payload: ReplyPayload,
    info: { kind: ReplyDispatchKind },
  ): ReplyPayload | null => {
    if (isProcessAborted(abortSignal)) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
>>>>>>> upstream/main
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return null;
    }
    if (payload.isReasoning) {
      // Reasoning/thinking payloads should not be delivered to Discord.
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "reasoning payload",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return null;
    }
    if (draftPreview.draftStream && draftPreview.isProgressMode && info.kind === "block") {
      const reply = resolveSendableOutboundReplyParts(payload);
      if (!reply.hasMedia && !payload.isError) {
        return null;
      }
    }
    if (info.kind === "final" && !isFallbackOnlyToolWarningFinal(payload)) {
      draftPreview.markFinalReplyStarted();
    }
    return payload;
  };

<<<<<<< HEAD
  const resolvedBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(discordConfig);
  let dispatchResult: Awaited<ReturnType<typeof dispatchInboundMessage>> | null = null;
=======
  const deliverDiscordPayload = async (
    payload: ReplyPayload,
    info: { kind: ReplyDispatchKind },
    options?: { allowFallbackOnlyToolWarning?: boolean },
  ) => {
    if (isProcessAborted(abortSignal)) {
      // Surface so operators don't chase missing replies when an abort
      // drops a model-produced text payload.
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    const isFinal = info.kind === "final";
    if (payload.isReasoning) {
      // Reasoning/thinking payloads should not be delivered to Discord.
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "reasoning payload",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    if (
      isFinal &&
      !options?.allowFallbackOnlyToolWarning &&
      isFallbackOnlyToolWarningFinal(payload)
    ) {
      if (
        !userFacingFinalDelivered &&
        (!finalReplyStartNotified || userFacingFinalDeliveryFailed)
      ) {
        pendingToolWarningFinal = { payload, info };
      }
      return { visibleReplySent: false };
    }
    if (isFinal) {
      draftPreview.markFinalReplyStarted();
    }
    const finalText =
      isFinal && typeof payload.text === "string"
        ? await resolveTranscriptBackedChannelFinalText({
            finalText: payload.text,
            resolveCandidateText: resolveCurrentTurnTranscriptFinalText,
          })
        : payload.text;
    const effectivePayload = finalText !== payload.text ? { ...payload, text: finalText } : payload;
    const [deliverablePayload] = sanitizeDiscordFrontChannelReplyPayloads([effectivePayload], {
      kind: info.kind,
    });
    if (!deliverablePayload) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "internal-only payload",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    const draftStream = draftPreview.draftStream;
    if (draftStream && draftPreview.isProgressMode && info.kind === "block") {
      const reply = resolveSendableOutboundReplyParts(deliverablePayload);
      if (!reply.hasMedia && !deliverablePayload.isError) {
        return { visibleReplySent: false };
      }
    }
    const shouldFinalizeDraftPreview =
      draftStream &&
      isFinal &&
      (!draftPreview.isProgressMode || draftPreview.hasProgressDraftStarted) &&
      !deliverablePayload.isError;
    if (shouldFinalizeDraftPreview) {
      const reply = resolveSendableOutboundReplyParts(deliverablePayload);
      const hasMedia = reply.hasMedia;
      const ttsSupplement = getReplyPayloadTtsSupplement(deliverablePayload);
      const previewSourceText = deliverablePayload.text ?? ttsSupplement?.spokenText;
      const previewFinalText = draftPreview.resolvePreviewFinalText(previewSourceText);
      const previewReplyToId = replyReference.peek();
      const hasExplicitReplyDirective =
        Boolean(deliverablePayload.replyToTag || deliverablePayload.replyToCurrent) ||
        (typeof previewSourceText === "string" &&
          /\[\[\s*reply_to(?:_current|\s*:)/i.test(previewSourceText));

      const result = await deliverWithFinalizableLivePreviewAdapter({
        kind: info.kind,
        payload: deliverablePayload,
        adapter: defineFinalizableLivePreviewAdapter({
          draft: {
            flush: () => draftPreview.flush(),
            clear: () => draftStream.clear(),
            discardPending: () => draftStream.discardPending(),
            seal: () => draftStream.seal(),
            id: draftStream.messageId,
          },
          buildFinalEdit: () => {
            if (
              draftPreview.finalizedViaPreviewMessage ||
              (hasMedia && !ttsSupplement) ||
              typeof previewFinalText !== "string" ||
              hasExplicitReplyDirective ||
              deliverablePayload.isError
            ) {
              return undefined;
            }
            // Discord pings only on create, not edits: send a targeted mention fresh, but keep mixed @everyone/@here in place so the create cannot escalate a broadcast.
            const rewrittenFinal = rewriteDiscordKnownMentions(previewFinalText, {
              accountId,
              mentionAliases: resolveDiscordAccount({ cfg, accountId }).config.mentionAliases,
            });
            if (
              discordTextHasTargetedMention(rewrittenFinal) &&
              !discordTextHasBroadcastMention(rewrittenFinal)
            ) {
              return undefined;
            }
            return {
              content: previewFinalText,
              ...(finalPreviewFlags ? { flags: finalPreviewFlags } : {}),
            };
          },
          editFinal: async (previewMessageId, edit) => {
            if (isProcessAborted(abortSignal)) {
              throw new Error("process aborted");
            }
            notifyFinalReplyStart();
            await editMessageDiscord(deliverChannelId, previewMessageId, edit, {
              cfg,
              accountId,
              rest: deliveryRest,
            });
          },
          onPreviewFinalized: () => {
            markUserFacingFinalDelivered();
            draftPreview.markPreviewFinalized();
            replyReference.markSent();
          },
          buildSupplementalPayload: () =>
            ttsSupplement ? buildTtsSupplementMediaPayload(deliverablePayload) : undefined,
          deliverSupplemental: async (supplementalPayload) => {
            if (isProcessAborted(abortSignal)) {
              return false;
            }
            const supplementalReplyToId =
              previewReplyToId ??
              replyReference.peek() ??
              (replyToMode === "all"
                ? typeof message.id === "string" && message.id
                  ? message.id
                  : ctxPayload.MessageSid
                : undefined);
            await deliverDiscordReply({
              cfg,
              replies: [supplementalPayload],
              target: deliverTarget,
              token,
              accountId,
              rest: deliveryRest,
              runtime,
              replyToId: supplementalReplyToId,
              replyToMode,
              textLimit,
              maxLinesPerMessage,
              tableMode,
              chunkMode,
              sessionKey: ctxPayload.SessionKey,
              threadBindings,
              mediaLocalRoots,
              kind: info.kind,
            });
            return true;
          },
          logPreviewEditFailure: (err) => {
            logVerbose(
              `discord: preview final edit failed; falling back to standard send (${String(err)})`,
            );
          },
        }),
        deliverNormally: async () => {
          if (isProcessAborted(abortSignal)) {
            return false;
          }
          const fallbackPayload =
            ttsSupplement &&
            ttsSupplement.visibleTextAlreadyDelivered !== true &&
            !deliverablePayload.text?.trim()
              ? { ...deliverablePayload, text: ttsSupplement.spokenText }
              : deliverablePayload;
          const replyToId = replyReference.use();
          notifyFinalReplyStart();
          await deliverDiscordReply({
            cfg,
            replies: [fallbackPayload],
            target: deliverTarget,
            token,
            accountId,
            rest: deliveryRest,
            runtime,
            replyToId,
            replyToMode,
            textLimit,
            maxLinesPerMessage,
            tableMode,
            chunkMode,
            sessionKey: ctxPayload.SessionKey,
            threadBindings,
            mediaLocalRoots,
            kind: info.kind,
          });
          return true;
        },
        onNormalDelivered: () => {
          markUserFacingFinalDelivered();
          replyReference.markSent();
        },
      });
      if (result.kind !== "normal-skipped") {
        return { visibleReplySent: true };
      }
    }
    if (isProcessAborted(abortSignal)) {
      // Mirror the entry-point abort log so a mid-deliver abort (after
      // the preview path bowed out) does not silently drop the reply.
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }

    const replyToId = replyReference.use();
    if (isFinal) {
      notifyFinalReplyStart();
    }
    await deliverDiscordReply({
      cfg,
      replies: [deliverablePayload],
      target: deliverTarget,
      token,
      accountId,
      rest: deliveryRest,
      runtime,
      replyToId,
      replyToMode,
      textLimit,
      maxLinesPerMessage,
      tableMode,
      chunkMode,
      sessionKey: ctxPayload.SessionKey,
      threadBindings,
      mediaLocalRoots,
      kind: info.kind,
    });
    replyReference.markSent();
    if (isFinal && deliverablePayload.isError !== true) {
      markUserFacingFinalDelivered();
    }
    return { visibleReplySent: true };
  };
  const onDiscordDeliveryError = (err: unknown, info: { kind: string }) => {
    if (info.kind === "final" && finalReplyStartNotified && !userFacingFinalDelivered) {
      userFacingFinalDeliveryFailed = true;
    }
    runtime.error(
      danger(
        formatDiscordReplyDeliveryFailure({
          kind: info.kind,
          err,
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      ),
    );
  };
  const onDiscordReplyStart = async () => {
    if (isProcessAborted(abortSignal)) {
      return;
    }
    await replyPipeline.typingCallbacks?.onReplyStart();
    await statusReactions.setThinking();
  };

  const resolvedBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(discordConfig);
  let dispatchResult: Awaited<ReturnType<typeof dispatchReplyWithBufferedBlockDispatcher>> | null =
    null;
>>>>>>> upstream/main
  let dispatchError = false;
  let dispatchAborted = false;
  const deliverPendingToolWarningFinalIfNeeded = async () => {
    if (!pendingToolWarningFinal || userFacingFinalDelivered || isProcessAborted(abortSignal)) {
      return undefined;
    }
    const pending = pendingToolWarningFinal;
    pendingToolWarningFinal = undefined;
    try {
      return await deliverDiscordPayload(pending.payload, pending.info, {
        allowFallbackOnlyToolWarning: true,
      });
    } catch (err) {
      dispatchError = true;
      onDiscordDeliveryError(err, pending.info);
      return { visibleReplySent: false };
    }
  };
  try {
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
    const preparedResult = await dispatchChannelInboundReply({
      cfg,
      channel: "discord",
      accountId: route.accountId,
      agentId: route.agentId,
      routeSessionKey: persistedSessionKey,
      storePath: turn.storePath,
      ctxPayload,
      recordInboundSession,
      dispatchReplyWithBufferedBlockDispatcher,
      dispatcherOptions: {
        ...replyPipeline,
        humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
        beforeDeliver: beforeDiscordPayloadDelivery,
        onReplyStart: onDiscordReplyStart,
        onFreshSettledDelivery: deliverPendingToolWarningFinalIfNeeded,
      },
      delivery: {
        deliver: deliverDiscordPayload,
        onError: onDiscordDeliveryError,
      },
      record: turn.record,
      history: isRoomEvent
        ? undefined
        : {
            isGroup: isGuildMessage,
            historyKey: messageChannelId,
            historyMap: guildHistories,
            limit: historyLimit,
          },
      replyOptions: {
        abortSignal,
        skillFilter: channelConfig?.skills,
<<<<<<< HEAD
        disableBlockStreaming:
          disableBlockStreamingForDraft ??
          (typeof resolvedBlockStreamingEnabled === "boolean"
            ? !resolvedBlockStreamingEnabled
            : undefined),
        onPartialReply: draftStream ? (payload) => updateDraftFromPartial(payload.text) : undefined,
        onAssistantMessageStart: draftStream
          ? () => {
              if (shouldSplitPreviewMessages && hasStreamedMessage) {
                logVerbose("discord: calling forceNewMessage() for draft stream");
                draftStream.forceNewMessage();
              }
              lastPartialText = "";
              draftText = "";
              draftChunker?.reset();
            }
=======
        sourceReplyDeliveryMode,
        queuedDeliveryCorrelations: isRoomEvent ? [{ begin: beginDeliveryCorrelation }] : undefined,
        suppressTyping: isRoomEvent ? true : undefined,
        allowProgressCallbacksWhenSourceDeliverySuppressed:
          sourceRepliesAreToolOnly && draftPreview.draftStream && draftPreview.isProgressMode
            ? true
            : undefined,
        disableBlockStreaming: sourceRepliesAreToolOnly
          ? true
          : (draftPreview.disableBlockStreamingForDraft ??
            (typeof resolvedBlockStreamingEnabled === "boolean"
              ? !resolvedBlockStreamingEnabled
              : undefined)),
        onPartialReply:
          draftPreview.draftStream && !draftPreview.isProgressMode
            ? (payload) => draftPreview.updateFromPartial(payload.text)
            : undefined,
        onAssistantMessageStart: draftPreview.draftStream
          ? () => draftPreview.handleAssistantMessageBoundary()
>>>>>>> upstream/main
          : undefined,
        onReasoningEnd: draftPreview.draftStream
          ? () => draftPreview.handleAssistantMessageBoundary()
          : undefined,
        onModelSelected,
        suppressDefaultToolProgressMessages: draftPreview.suppressDefaultToolProgressMessages
          ? true
          : undefined,
        commentaryProgressEnabled: draftPreview.isProgressMode
          ? draftPreview.commentaryProgressEnabled
          : undefined,
        onReasoningStream: async (payload) => {
          await statusReactions.setThinking();
          await draftPreview.pushReasoningProgress(payload?.text, {
            snapshot: payload?.isReasoningSnapshot === true,
          });
        },
        onToolStart: async (payload) => {
          if (isProcessAborted(abortSignal)) {
            return;
          }
          await maybeBindStatusReactionsToToolReaction(payload);
          await statusReactions.setTool(payload.name);
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLineForEntry(
              discordConfig,
              {
                event: "tool",
                name: payload.name,
                phase: payload.phase,
                args: payload.args,
              },
              payload.detailMode ? { detailMode: payload.detailMode } : undefined,
            ),
            { toolName: payload.name },
          );
        },
        onItemEvent: async (payload) => {
          if (payload.kind === "preamble") {
            if (draftPreview.commentaryProgressEnabled && payload.progressText) {
              await draftPreview.pushCommentaryProgress(payload.progressText, {
                itemId: payload.itemId,
              });
            }
            return;
          }
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLineForEntry(discordConfig, {
              event: "item",
              itemId: payload.itemId,
              itemKind: payload.kind,
              title: payload.title,
              name: payload.name,
              phase: payload.phase,
              status: payload.status,
              summary: payload.summary,
              progressText: payload.progressText,
              meta: payload.meta,
            }),
          );
        },
        onPlanUpdate: async (payload) => {
          if (payload.phase !== "update") {
            return;
          }
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "plan",
              phase: payload.phase,
              title: payload.title,
              explanation: payload.explanation,
              steps: payload.steps,
            }),
          );
        },
        onApprovalEvent: async (payload) => {
          if (payload.phase !== "requested") {
            return;
          }
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "approval",
              phase: payload.phase,
              title: payload.title,
              command: payload.command,
              reason: payload.reason,
              message: payload.message,
            }),
          );
        },
        onCommandOutput: async (payload) => {
          if (payload.phase !== "end") {
            return;
          }
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "command-output",
              phase: payload.phase,
              title: payload.title,
              name: payload.name,
              status: payload.status,
              exitCode: payload.exitCode,
            }),
          );
        },
        onPatchSummary: async (payload) => {
          if (payload.phase !== "end") {
            return;
          }
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "patch",
              phase: payload.phase,
              title: payload.title,
              name: payload.name,
              added: payload.added,
              modified: payload.modified,
              deleted: payload.deleted,
              summary: payload.summary,
            }),
          );
        },
        onCompactionStart: async () => {
          if (isProcessAborted(abortSignal)) {
            return;
          }
          await statusReactions.setCompacting();
        },
        onCompactionEnd: async () => {
          if (isProcessAborted(abortSignal)) {
            return;
          }
          statusReactions.cancelPending();
          await statusReactions.setThinking();
        },
      },
    });
    if (!preparedResult.dispatched) {
      return;
    }
    dispatchResult = preparedResult.dispatchResult;
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
  } catch (err) {
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
    dispatchError = true;
    throw err;
  } finally {
    endDiscordInboundEventDeliveryCorrelation();
    await draftPreview.cleanup();
    const finalDeliveryFailed = (dispatchResult?.failedCounts?.final ?? 0) > 0;
    if (statusReactionsActive) {
      if (dispatchAborted) {
        if (removeAckAfterReply) {
          void statusReactions.clear();
        } else {
          void statusReactions.restoreInitial();
        }
      } else {
        if (dispatchError || finalDeliveryFailed) {
          await statusReactions.setError();
        } else {
          await statusReactions.setDone();
        }
        if (removeAckAfterReply) {
          void (async () => {
            await sleep(
              dispatchError || finalDeliveryFailed
                ? DEFAULT_TIMING.errorHoldMs
                : DEFAULT_TIMING.doneHoldMs,
            );
            await statusReactions.clear();
          })();
        } else {
          void statusReactions.restoreInitial();
        }
      }
    } else if (shouldSendAckReaction && ackReaction && removeAckAfterReply) {
      void removeReactionDiscord(
        messageChannelId,
        message.id,
        ackReaction,
        ackReactionContext,
      ).catch((err: unknown) => {
        logAckFailure({
          log: logVerbose,
          channel: "discord",
          target: `${messageChannelId}/${message.id}`,
          error: err,
        });
      });
    }
  }
  if (dispatchAborted) {
    return;
  }

  const finalDispatchResult = dispatchResult;
  if (!finalDispatchResult || !hasFinalInboundReplyDispatch(finalDispatchResult)) {
    return;
  }
  if (shouldLogVerbose()) {
    const finalCount = finalDispatchResult.counts.final;
    logVerbose(
      `discord: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${replyTarget}`,
    );
  }
}
