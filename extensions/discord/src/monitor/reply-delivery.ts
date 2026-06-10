// Discord plugin module implements reply delivery behavior.
import { resolveAgentAvatar } from "openclaw/plugin-sdk/agent-runtime";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { MarkdownTableMode, ReplyToMode } from "openclaw/plugin-sdk/config-runtime";
import type { ChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-dispatch-runtime";
import {
  resolveSendableOutboundReplyParts,
  resolveTextChunksWithFallback,
  sendMediaWithLeadingCaption,
} from "openclaw/plugin-sdk/reply-payload";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import {
  resolveRetryConfig,
  retryAsync,
  type RetryConfig,
  type RetryRunner,
} from "openclaw/plugin-sdk/retry-runtime";
=======
import {
  buildOutboundSessionContext,
  sendDurableMessageBatch,
  type OutboundDeliveryFormattingOptions,
  type OutboundIdentity,
  type OutboundSendDeps,
} from "openclaw/plugin-sdk/channel-outbound";
import type {
  MarkdownTableMode,
  OpenClawConfig,
  ReplyToMode,
} from "openclaw/plugin-sdk/config-contracts";
import type { OutboundMediaAccess } from "openclaw/plugin-sdk/media-runtime";
import type { ChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-dispatch-runtime";
>>>>>>> upstream/main
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import type { RequestClient } from "../internal/discord.js";
import { sendMessageDiscord, sendVoiceMessageDiscord } from "../send.js";
import { sanitizeDiscordFrontChannelReplyPayloads } from "./reply-safety.js";

export type DiscordThreadBindingLookupRecord = {
  accountId: string;
  channelId: string;
  threadId: string;
  agentId: string;
  label?: string;
  webhookId?: string;
  webhookToken?: string;
};

export type DiscordThreadBindingLookup = {
  listBySessionKey: (targetSessionKey: string) => DiscordThreadBindingLookupRecord[];
  touchThread?: (params: { threadId: string; at?: number; persist?: boolean }) => unknown;
};

<<<<<<< HEAD
type ResolvedRetryConfig = Required<RetryConfig>;

const DISCORD_VIDEO_MEDIA_EXTENSIONS = new Set([".avi", ".m4v", ".mkv", ".mov", ".mp4", ".webm"]);

const DISCORD_DELIVERY_RETRY_DEFAULTS: ResolvedRetryConfig = {
  attempts: 3,
  minDelayMs: 1000,
  maxDelayMs: 30_000,
  jitter: 0,
};

function isRetryableDiscordError(err: unknown): boolean {
  const status = (err as { status?: number }).status ?? (err as { statusCode?: number }).statusCode;
  return status === 429 || (status !== undefined && status >= 500);
}

function getDiscordRetryAfterMs(err: unknown): number | undefined {
  if (!err || typeof err !== "object") {
    return undefined;
  }
  if (
    "retryAfter" in err &&
    typeof err.retryAfter === "number" &&
    Number.isFinite(err.retryAfter)
  ) {
    return err.retryAfter * 1000;
  }
  const retryAfterRaw = (err as { headers?: Record<string, string> }).headers?.["retry-after"];
  if (!retryAfterRaw) {
    return undefined;
  }
  const retryAfterMs = Number(retryAfterRaw) * 1000;
  return Number.isFinite(retryAfterMs) ? retryAfterMs : undefined;
}

function resolveDeliveryRetryConfig(retry?: RetryConfig): ResolvedRetryConfig {
  return resolveRetryConfig(DISCORD_DELIVERY_RETRY_DEFAULTS, retry);
}

function normalizeMediaPathForExtension(mediaUrl: string): string {
  const trimmed = mediaUrl.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.pathname.toLowerCase();
  } catch {
    const withoutHash = trimmed.split("#", 1)[0] ?? trimmed;
    const withoutQuery = withoutHash.split("?", 1)[0] ?? withoutHash;
    return withoutQuery.toLowerCase();
  }
}

function isLikelyDiscordVideoMedia(mediaUrl: string): boolean {
  const normalized = normalizeMediaPathForExtension(mediaUrl);
  for (const ext of DISCORD_VIDEO_MEDIA_EXTENSIONS) {
    if (normalized.endsWith(ext)) {
      return true;
    }
  }
  return false;
}

async function sendWithRetry(
  fn: () => Promise<unknown>,
  retryConfig: ResolvedRetryConfig,
): Promise<void> {
  await retryAsync(fn, {
    ...retryConfig,
    shouldRetry: (err) => isRetryableDiscordError(err),
    retryAfterMs: getDiscordRetryAfterMs,
  });
}

=======
>>>>>>> upstream/main
function resolveTargetChannelId(target: string): string | undefined {
  if (!target.startsWith("channel:")) {
    return undefined;
  }
  const channelId = target.slice("channel:".length).trim();
  return channelId || undefined;
}

function resolveBoundThreadBinding(params: {
  threadBindings?: DiscordThreadBindingLookup;
  sessionKey?: string;
  target: string;
}): DiscordThreadBindingLookupRecord | undefined {
  const sessionKey = params.sessionKey?.trim();
  if (!params.threadBindings || !sessionKey) {
    return undefined;
  }
  const targetChannelId = resolveTargetChannelId(params.target);
  if (!targetChannelId) {
    return undefined;
  }
  return params.threadBindings
    .listBySessionKey(sessionKey)
    .find((entry) => entry.threadId === targetChannelId);
}

<<<<<<< HEAD
function createPayloadReplyToResolver(params: {
  payload: ReplyPayload;
  replyToMode: ReplyToMode;
  resolveFallbackReplyTo: () => string | undefined;
}): () => string | undefined {
  const payloadReplyTo = params.payload.replyToId?.trim() || undefined;
  const allowExplicitReplyWhenOff = Boolean(
    payloadReplyTo && (params.payload.replyToTag || params.payload.replyToCurrent),
  );

  if (!payloadReplyTo || (params.replyToMode === "off" && !allowExplicitReplyWhenOff)) {
    return params.resolveFallbackReplyTo;
  }

  let payloadReplyUsed = false;
  return () => {
    if (params.replyToMode === "all") {
      return payloadReplyTo;
    }
    if (payloadReplyUsed) {
      return undefined;
    }
    payloadReplyUsed = true;
    return payloadReplyTo;
  };
}

function resolveBindingPersona(
=======
function resolveBindingIdentity(
>>>>>>> upstream/main
  cfg: OpenClawConfig,
  binding: DiscordThreadBindingLookupRecord | undefined,
): OutboundIdentity | undefined {
  if (!binding) {
    return undefined;
  }
  const baseLabel = binding.label?.trim() || binding.agentId;
  const identity: OutboundIdentity = {
    name: (`🤖 ${baseLabel}`.trim() || "🤖 agent").slice(0, 80),
  };
  try {
    const avatar = resolveAgentAvatar(cfg, binding.agentId);
    if (avatar.kind === "remote") {
      identity.avatarUrl = avatar.url;
    }
  } catch {
    // Avatar is cosmetic; delivery should not depend on local identity config.
  }
  return identity;
}

function createDiscordDeliveryDeps(params: {
  cfg: OpenClawConfig;
  token: string;
  rest?: RequestClient;
}): OutboundSendDeps {
  return {
    discord: (to: string, text: string, opts?: Parameters<typeof sendMessageDiscord>[2]) =>
      sendMessageDiscord(to, text, {
        ...opts,
        cfg: opts?.cfg ?? params.cfg,
        token: params.token,
        rest: params.rest,
      }),
    discordVoice: (
      to: string,
      audioPath: string,
      opts?: Parameters<typeof sendVoiceMessageDiscord>[2],
    ) =>
      sendVoiceMessageDiscord(to, audioPath, {
        ...opts,
        cfg: opts?.cfg ?? params.cfg,
        token: params.token,
        rest: params.rest,
      }),
  };
}

type DiscordDeliveryOptions = {
  to: string;
  threadId?: string;
  agentId?: string;
  identity?: OutboundIdentity;
  mediaAccess?: OutboundMediaAccess;
  replyToMode: ReplyToMode;
  formatting: OutboundDeliveryFormattingOptions;
};

function resolveDiscordDeliveryOptions(params: {
  cfg: OpenClawConfig;
  target: string;
  sessionKey?: string;
  threadBindings?: DiscordThreadBindingLookup;
  textLimit: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  replyToMode?: ReplyToMode;
  mediaLocalRoots?: readonly string[];
}): DiscordDeliveryOptions {
  const binding = resolveBoundThreadBinding({
    threadBindings: params.threadBindings,
    sessionKey: params.sessionKey,
    target: params.target,
  });
  return {
    to: binding ? `channel:${binding.channelId}` : params.target,
    threadId: binding?.threadId,
    agentId: binding?.agentId,
    identity: resolveBindingIdentity(params.cfg, binding),
    mediaAccess: params.mediaLocalRoots?.length
      ? { localRoots: params.mediaLocalRoots }
      : undefined,
    replyToMode: params.replyToMode ?? "all",
    formatting: {
      textLimit: params.textLimit,
      maxLinesPerMessage: params.maxLinesPerMessage,
      tableMode: params.tableMode,
      chunkMode: params.chunkMode,
    },
  };
}

export async function deliverDiscordReply(params: {
  cfg: OpenClawConfig;
  replies: ReplyPayload[];
  target: string;
  token: string;
  accountId?: string;
  rest?: RequestClient;
  runtime: RuntimeEnv;
  textLimit: number;
  maxLinesPerMessage?: number;
  replyToId?: string;
  replyToMode?: ReplyToMode;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  sessionKey?: string;
  threadBindings?: DiscordThreadBindingLookup;
  mediaLocalRoots?: readonly string[];
  kind: "tool" | "block" | "final";
}) {
<<<<<<< HEAD
  const chunkLimit = Math.min(params.textLimit, 2000);
  const replyTo = params.replyToId?.trim() || undefined;
  const replyToMode = params.replyToMode ?? "all";
  const replyOnce = isSingleUseReplyToMode(replyToMode);
  let replyUsed = false;
  const resolveReplyTo = () => {
    if (!replyTo) {
      return undefined;
    }
    if (!replyOnce) {
      return replyTo;
    }
    if (replyUsed) {
      return undefined;
    }
    replyUsed = true;
    return replyTo;
  };
  const binding = resolveBoundThreadBinding({
    threadBindings: params.threadBindings,
    sessionKey: params.sessionKey,
    target: params.target,
  });
  const persona = resolveBindingPersona(params.cfg, binding);
  // Pre-resolve channel ID and retry runner once to avoid per-chunk overhead.
  // This eliminates redundant channel-type GET requests and client creation that
  // can cause ordering issues when multiple chunks share the RequestClient queue.
  const channelId = resolveTargetChannelId(params.target);
  const account = resolveDiscordAccount({ cfg: params.cfg, accountId: params.accountId });
  const retryConfig = resolveDeliveryRetryConfig(account.config.retry);
  const request: RetryRunner | undefined = channelId
    ? createDiscordRetryRunner({ configRetry: account.config.retry })
    : undefined;
  let deliveredAny = false;
  for (const payload of params.replies) {
    const resolvePayloadReplyTo = createPayloadReplyToResolver({
      payload,
      replyToMode,
      resolveFallbackReplyTo: resolveReplyTo,
    });
    const tableMode = params.tableMode ?? "code";
    const reply = resolveSendableOutboundReplyParts(payload, {
      text: convertMarkdownTables(payload.text ?? "", tableMode),
    });
    if (!reply.hasContent) {
      continue;
    }
    if (!reply.hasMedia) {
      const mode = params.chunkMode ?? "length";
      const chunks = resolveTextChunksWithFallback(
        reply.text,
        chunkDiscordTextWithMode(reply.text, {
          maxChars: chunkLimit,
          maxLines: params.maxLinesPerMessage,
          chunkMode: mode,
        }),
      );
      for (const chunk of chunks) {
        if (!chunk.trim()) {
          continue;
        }
        const replyTo = resolvePayloadReplyTo();
        await sendDiscordChunkWithFallback({
          cfg: params.cfg,
          target: params.target,
          text: chunk,
          token: params.token,
          rest: params.rest,
          accountId: params.accountId,
          maxLinesPerMessage: params.maxLinesPerMessage,
          replyTo,
          binding,
          chunkMode: params.chunkMode,
          username: persona.username,
          avatarUrl: persona.avatarUrl,
          channelId,
          request,
          retryConfig,
        });
        deliveredAny = true;
      }
      continue;
    }

    const firstMedia = reply.mediaUrls[0];
    if (!firstMedia) {
      continue;
    }
    // Voice message path: audioAsVoice flag routes through sendVoiceMessageDiscord.
    if (payload.audioAsVoice) {
      const replyTo = resolvePayloadReplyTo();
      await sendVoiceMessageDiscord(params.target, firstMedia, {
        cfg: params.cfg,
        token: params.token,
        rest: params.rest,
        accountId: params.accountId,
        replyTo,
      });
      deliveredAny = true;
      // Voice messages cannot include text; send remaining text separately if present.
      await sendDiscordChunkWithFallback({
        cfg: params.cfg,
        target: params.target,
        text: reply.text,
        token: params.token,
        rest: params.rest,
        accountId: params.accountId,
        maxLinesPerMessage: params.maxLinesPerMessage,
        replyTo: resolvePayloadReplyTo(),
        binding,
        chunkMode: params.chunkMode,
        username: persona.username,
        avatarUrl: persona.avatarUrl,
        channelId,
        request,
        retryConfig,
      });
      // Additional media items are sent as regular attachments (voice is single-file only).
      await sendMediaWithLeadingCaption({
        mediaUrls: reply.mediaUrls.slice(1),
        caption: "",
        send: async ({ mediaUrl }) => {
          const replyTo = resolvePayloadReplyTo();
          await sendWithRetry(
            () =>
              sendMessageDiscord(params.target, "", {
                cfg: params.cfg,
                token: params.token,
                rest: params.rest,
                mediaUrl,
                accountId: params.accountId,
                mediaLocalRoots: params.mediaLocalRoots,
                replyTo,
              }),
            retryConfig,
          );
        },
      });
      continue;
    }

    const shouldSplitVideoMediaReply =
      reply.text.trim().length > 0 &&
      reply.mediaUrls.some((mediaUrl) => isLikelyDiscordVideoMedia(mediaUrl));
    if (shouldSplitVideoMediaReply) {
      await sendDiscordChunkWithFallback({
        cfg: params.cfg,
        target: params.target,
        text: reply.text,
        token: params.token,
        rest: params.rest,
        accountId: params.accountId,
        maxLinesPerMessage: params.maxLinesPerMessage,
        replyTo: resolvePayloadReplyTo(),
        binding,
        chunkMode: params.chunkMode,
        username: persona.username,
        avatarUrl: persona.avatarUrl,
        channelId,
        request,
        retryConfig,
      });
      await sendMediaWithLeadingCaption({
        mediaUrls: reply.mediaUrls,
        caption: "",
        send: async ({ mediaUrl }) => {
          const replyTo = resolvePayloadReplyTo();
          await sendWithRetry(
            () =>
              sendMessageDiscord(params.target, "", {
                cfg: params.cfg,
                token: params.token,
                rest: params.rest,
                mediaUrl,
                accountId: params.accountId,
                mediaLocalRoots: params.mediaLocalRoots,
                replyTo,
              }),
            retryConfig,
          );
        },
      });
      deliveredAny = true;
      continue;
    }

    await sendMediaWithLeadingCaption({
      mediaUrls: reply.mediaUrls,
      caption: reply.text,
      send: async ({ mediaUrl, caption }) => {
        const replyTo = resolvePayloadReplyTo();
        await sendWithRetry(
          () =>
            sendMessageDiscord(params.target, caption ?? "", {
              cfg: params.cfg,
              token: params.token,
              rest: params.rest,
              mediaUrl,
              accountId: params.accountId,
              mediaLocalRoots: params.mediaLocalRoots,
              replyTo,
            }),
          retryConfig,
        );
      },
    });
    deliveredAny = true;
=======
  void params.runtime;

  const delivery = resolveDiscordDeliveryOptions(params);
  const payloads = sanitizeDiscordFrontChannelReplyPayloads(params.replies, { kind: params.kind });
  if (payloads.length === 0) {
    return;
>>>>>>> upstream/main
  }

  const send = await sendDurableMessageBatch({
    cfg: params.cfg,
    channel: "discord",
    to: delivery.to,
    accountId: params.accountId,
    payloads,
    replyToId: normalizeOptionalString(params.replyToId),
    replyToMode: delivery.replyToMode,
    formatting: delivery.formatting,
    threadId: delivery.threadId,
    identity: delivery.identity,
    deps: createDiscordDeliveryDeps({
      cfg: params.cfg,
      token: params.token,
      rest: params.rest,
    }),
    mediaAccess: delivery.mediaAccess,
    session: buildOutboundSessionContext({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      agentId: delivery.agentId,
      requesterAccountId: params.accountId,
    }),
  });
  if (send.status === "failed" || send.status === "partial_failed") {
    throw send.error;
  }
  const results = send.status === "sent" ? send.results : [];
  if (results.length === 0) {
    throw new Error(`discord final reply produced no delivered message for ${delivery.to}`);
  }
}
