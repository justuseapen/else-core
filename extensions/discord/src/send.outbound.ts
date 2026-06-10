<<<<<<< HEAD
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { serializePayload, type MessagePayloadObject, type RequestClient } from "@buape/carbon";
import { ChannelType, Routes } from "discord-api-types/v10";
import { loadConfig, type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/infra-runtime";
import { maxBytesForKind } from "openclaw/plugin-sdk/media-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-runtime";
import { unlinkIfExists } from "openclaw/plugin-sdk/media-runtime";
import type { PollInput } from "openclaw/plugin-sdk/media-runtime";
import { resolveChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import type { RetryConfig } from "openclaw/plugin-sdk/retry-runtime";
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-runtime";
import { loadWebMediaRaw } from "openclaw/plugin-sdk/web-media";
import { resolveDiscordAccount } from "./accounts.js";
import { resolveDiscordClientAccountContext } from "./client.js";
import { rewriteDiscordKnownMentions } from "./mentions.js";
import { parseAndResolveRecipient } from "./recipient-resolution.js";
=======
// Discord plugin module implements send.outbound behavior.
import { ChannelType } from "discord-api-types/v10";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import type { MarkdownTableMode, OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import type { OutboundMediaAccess, PollInput } from "openclaw/plugin-sdk/media-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveChunkMode, type ChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import type { RetryConfig } from "openclaw/plugin-sdk/retry-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
import { resolveDiscordAccount } from "./accounts.js";
import { createChannelMessage, createThread, type RequestClient } from "./internal/discord.js";
import { rewriteDiscordKnownMentions } from "./mentions.js";
import { parseAndResolveChannelRecipient } from "./recipient-resolution.js";
import { createDiscordSendResult, type DiscordReceiptResultSource } from "./send.receipt.js";
>>>>>>> upstream/main
import {
  buildDiscordMessageRequest,
  buildDiscordSendError,
  buildDiscordTextChunks,
  createDiscordClient,
  normalizeDiscordPollInput,
  normalizeStickerIds,
<<<<<<< HEAD
=======
  resolveDiscordMessageFlags,
>>>>>>> upstream/main
  resolveChannelId,
  resolveDiscordChannelType,
  resolveDiscordSendComponents,
  resolveDiscordSendEmbeds,
  sendDiscordMedia,
  sendDiscordText,
  type DiscordSendComponents,
  type DiscordSendEmbeds,
} from "./send.shared.js";
import type { DiscordSendResult } from "./send.types.js";
type DiscordSendOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  mediaUrl?: string;
  filename?: string;
<<<<<<< HEAD
  mediaAccess?: {
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
  };
=======
  mediaAccess?: OutboundMediaAccess;
>>>>>>> upstream/main
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  verbose?: boolean;
  rest?: RequestClient;
  replyTo?: string;
  retry?: RetryConfig;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  components?: DiscordSendComponents;
  embeds?: DiscordSendEmbeds;
  silent?: boolean;
  suppressEmbeds?: boolean;
};

type DiscordClientRequest = ReturnType<typeof createDiscordClient>["request"];

const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;

<<<<<<< HEAD
type DiscordChannelMessageResult = {
  id?: string | null;
  channel_id?: string | null;
};
=======
type DiscordChannelMessageResult = DiscordReceiptResultSource;
>>>>>>> upstream/main

async function sendDiscordThreadTextChunks(params: {
  rest: RequestClient;
  threadId: string;
  chunks: readonly string[];
  request: DiscordClientRequest;
  maxLinesPerMessage?: number;
  chunkMode: ReturnType<typeof resolveChunkMode>;
  maxChars?: number;
  silent?: boolean;
  suppressEmbeds?: boolean;
}): Promise<void> {
  for (const chunk of params.chunks) {
    await sendDiscordText(
      params.rest,
      params.threadId,
      chunk,
      undefined,
      params.request,
      params.maxLinesPerMessage,
      undefined,
      undefined,
      params.chunkMode,
      params.silent,
      params.suppressEmbeds,
      params.maxChars,
    );
  }
}

function resolveDiscordSuppressEmbeds(params: {
  configured?: boolean;
  override?: boolean;
}): boolean {
  return params.override ?? params.configured ?? true;
}

/** Discord thread names are capped at 100 characters. */
const DISCORD_THREAD_NAME_LIMIT = 100;

/** Derive a thread title from the first non-empty line of the message text. */
function deriveForumThreadName(text: string): string {
  const firstLine =
    normalizeOptionalString(text.split("\n").find((line) => normalizeOptionalString(line))) ?? "";
  return firstLine.slice(0, DISCORD_THREAD_NAME_LIMIT) || new Date().toISOString().slice(0, 16);
}

/** Forum/Media channels cannot receive regular messages; detect them here. */
function isForumLikeType(channelType?: number): boolean {
  return channelType === ChannelType.GuildForum || channelType === ChannelType.GuildMedia;
}

function toDiscordSendResult(
  result: DiscordChannelMessageResult,
  fallbackChannelId: string,
  params: {
    kind?: Parameters<typeof createDiscordSendResult>[0]["kind"];
    threadId?: string | number;
    replyToId?: string;
  } = {},
): DiscordSendResult {
  const resultParams: Parameters<typeof createDiscordSendResult>[0] = {
    result,
    fallbackChannelId,
    kind: params.kind ?? "text",
  };
  if (params.threadId != null) {
    resultParams.threadId = params.threadId;
  }
  if (params.replyToId) {
    resultParams.replyToId = params.replyToId;
  }
  return createDiscordSendResult(resultParams);
}

async function resolveDiscordSendTarget(
  to: string,
  opts: DiscordSendOpts,
): Promise<{ rest: RequestClient; request: DiscordClientRequest; channelId: string }> {
  const cfg = requireRuntimeConfig(opts.cfg, "Discord send target resolution");
  const { rest, request } = createDiscordClient({ ...opts, cfg });
  const recipient = await parseAndResolveChannelRecipient(to, cfg, opts.accountId);
  const { channelId } = await resolveChannelId(rest, recipient, request);
  return { rest, request, channelId };
}

export async function sendMessageDiscord(
  to: string,
  text: string,
  opts: DiscordSendOpts,
): Promise<DiscordSendResult> {
  const cfg = requireRuntimeConfig(opts.cfg, "Discord send");
  const accountInfo = resolveDiscordAccount({
    cfg,
    accountId: opts.accountId,
  });
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "discord",
    accountId: accountInfo.accountId,
  });
  const effectiveTableMode = opts.tableMode ?? tableMode;
  const chunkMode = opts.chunkMode ?? resolveChunkMode(cfg, "discord", accountInfo.accountId);
  const maxLinesPerMessage = opts.maxLinesPerMessage ?? accountInfo.config.maxLinesPerMessage;
  const suppressEmbeds = resolveDiscordSuppressEmbeds({
    configured: accountInfo.config.suppressEmbeds,
    override: opts.suppressEmbeds,
  });
  const textLimit =
    typeof opts.textLimit === "number" && Number.isFinite(opts.textLimit)
      ? Math.max(1, Math.min(Math.floor(opts.textLimit), 2000))
      : undefined;
  const mediaMaxBytes =
    typeof accountInfo.config.mediaMaxMb === "number"
      ? accountInfo.config.mediaMaxMb * 1024 * 1024
      : DEFAULT_DISCORD_MEDIA_MAX_MB * 1024 * 1024;
<<<<<<< HEAD
  const textWithTables = convertMarkdownTables(text ?? "", tableMode);
=======
  const textWithTables = convertMarkdownTables(text ?? "", effectiveTableMode);
>>>>>>> upstream/main
  const textWithMentions = rewriteDiscordKnownMentions(textWithTables, {
    accountId: accountInfo.accountId,
    mentionAliases: accountInfo.config.mentionAliases,
  });
  const { token, rest, request } = createDiscordClient({ ...opts, cfg });
  const recipient = await parseAndResolveChannelRecipient(to, cfg, opts.accountId);
  const { channelId } = await resolveChannelId(rest, recipient, request);

  // Forum/Media channels reject POST /messages; auto-create a thread post instead.
  const channelType = await resolveDiscordChannelType(rest, channelId);

  if (isForumLikeType(channelType)) {
    const threadName = deriveForumThreadName(textWithTables);
    const chunks = buildDiscordTextChunks(textWithMentions, {
      maxLinesPerMessage,
      chunkMode,
      maxChars: textLimit,
    });
    const starterContent = chunks[0]?.trim() ? chunks[0] : threadName;
    const starterComponents = resolveDiscordSendComponents({
      components: opts.components,
      text: starterContent,
      isFirst: true,
    });
    const starterEmbeds = resolveDiscordSendEmbeds({ embeds: opts.embeds, isFirst: true });
    const starterFlags = resolveDiscordMessageFlags({
      silent: opts.silent,
      suppressEmbeds: suppressEmbeds && !starterEmbeds?.length,
    });
    const starterBody = buildDiscordMessageRequest({
      text: starterContent,
      components: starterComponents,
      embeds: starterEmbeds,
      flags: starterFlags,
    });
    let threadRes: { id: string; message?: { id: string; channel_id: string } };
    try {
      threadRes = (await request(
        () =>
          createThread<{ id: string; message?: { id: string; channel_id: string } }>(
            rest,
            channelId,
            {
              body: {
                name: threadName,
                message: starterBody,
              },
            },
          ),
        "forum-thread",
      )) as { id: string; message?: { id: string; channel_id: string } };
    } catch (err) {
      throw await buildDiscordSendError(err, {
        channelId,
        cfg,
        rest,
        token,
        hasMedia: Boolean(opts.mediaUrl),
      });
    }

    const threadId = threadRes.id;
    const messageId = threadRes.message?.id ?? threadId;
    const resultChannelId = threadRes.message?.channel_id ?? threadId;
    const remainingChunks = chunks.slice(1);

    try {
      if (opts.mediaUrl) {
        const [mediaCaption, ...afterMediaChunks] = remainingChunks;
        await sendDiscordMedia(
          rest,
          threadId,
          mediaCaption ?? "",
          opts.mediaUrl,
          opts.filename,
          opts.mediaAccess,
          opts.mediaLocalRoots,
          opts.mediaReadFile,
          mediaMaxBytes,
          undefined,
          request,
          maxLinesPerMessage,
          undefined,
          undefined,
          chunkMode,
          opts.silent,
          suppressEmbeds,
          textLimit,
        );
        await sendDiscordThreadTextChunks({
          rest,
          threadId,
          chunks: afterMediaChunks,
          request,
          maxLinesPerMessage,
          chunkMode,
          maxChars: textLimit,
          silent: opts.silent,
          suppressEmbeds,
        });
      } else {
        await sendDiscordThreadTextChunks({
          rest,
          threadId,
          chunks: remainingChunks,
          request,
          maxLinesPerMessage,
          chunkMode,
          maxChars: textLimit,
          silent: opts.silent,
          suppressEmbeds,
        });
      }
    } catch (err) {
      throw await buildDiscordSendError(err, {
        channelId: threadId,
        cfg,
        rest,
        token,
        hasMedia: Boolean(opts.mediaUrl),
      });
    }

    recordChannelActivity({
      channel: "discord",
      accountId: accountInfo.accountId,
      direction: "outbound",
    });
    return toDiscordSendResult(
      {
        id: messageId,
        channel_id: resultChannelId,
      },
      channelId,
      { kind: opts.mediaUrl ? "media" : "text", threadId },
    );
  }

  let result: DiscordChannelMessageResult;
  try {
    if (opts.mediaUrl) {
      result = await sendDiscordMedia(
        rest,
        channelId,
        textWithMentions,
        opts.mediaUrl,
        opts.filename,
        opts.mediaAccess,
        opts.mediaLocalRoots,
        opts.mediaReadFile,
        mediaMaxBytes,
        opts.replyTo,
        request,
        maxLinesPerMessage,
        opts.components,
        opts.embeds,
        chunkMode,
        opts.silent,
        suppressEmbeds,
        textLimit,
      );
    } else {
      result = await sendDiscordText(
        rest,
        channelId,
        textWithMentions,
        opts.replyTo,
        request,
        maxLinesPerMessage,
        opts.components,
        opts.embeds,
        chunkMode,
        opts.silent,
        suppressEmbeds,
        textLimit,
      );
    }
  } catch (err) {
    throw await buildDiscordSendError(err, {
      channelId,
      cfg,
      rest,
      token,
      hasMedia: Boolean(opts.mediaUrl),
    });
  }

  recordChannelActivity({
    channel: "discord",
    accountId: accountInfo.accountId,
    direction: "outbound",
  });
<<<<<<< HEAD
  return toDiscordSendResult(result, channelId);
}

type DiscordWebhookSendOpts = {
  cfg?: OpenClawConfig;
  webhookId: string;
  webhookToken: string;
  accountId?: string;
  threadId?: string | number;
  replyTo?: string;
  username?: string;
  avatarUrl?: string;
  wait?: boolean;
};

function resolveWebhookExecutionUrl(params: {
  webhookId: string;
  webhookToken: string;
  threadId?: string | number;
  wait?: boolean;
}) {
  const baseUrl = new URL(
    `https://discord.com/api/v10/webhooks/${encodeURIComponent(params.webhookId)}/${encodeURIComponent(params.webhookToken)}`,
  );
  baseUrl.searchParams.set("wait", params.wait === false ? "false" : "true");
  if (params.threadId !== undefined && params.threadId !== null && params.threadId !== "") {
    baseUrl.searchParams.set("thread_id", String(params.threadId));
  }
  return baseUrl.toString();
}

export async function sendWebhookMessageDiscord(
  text: string,
  opts: DiscordWebhookSendOpts,
): Promise<DiscordSendResult> {
  const webhookId = opts.webhookId.trim();
  const webhookToken = opts.webhookToken.trim();
  if (!webhookId || !webhookToken) {
    throw new Error("Discord webhook id/token are required");
  }

  const replyTo = typeof opts.replyTo === "string" ? opts.replyTo.trim() : "";
  const messageReference = replyTo ? { message_id: replyTo, fail_if_not_exists: false } : undefined;
  const { account, proxyFetch } = resolveDiscordClientAccountContext({
    cfg: opts.cfg,
    accountId: opts.accountId,
  });
  const rewrittenText = rewriteDiscordKnownMentions(text, {
    accountId: account.accountId,
  });

  const response = await (proxyFetch ?? fetch)(
    resolveWebhookExecutionUrl({
      webhookId,
      webhookToken,
      threadId: opts.threadId,
      wait: opts.wait,
    }),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        content: rewrittenText,
        username: opts.username?.trim() || undefined,
        avatar_url: opts.avatarUrl?.trim() || undefined,
        ...(messageReference ? { message_reference: messageReference } : {}),
      }),
    },
  );
  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    throw new Error(
      `Discord webhook send failed (${response.status}${raw ? `: ${raw.slice(0, 200)}` : ""})`,
    );
  }

  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    channel_id?: string;
  };
  try {
    recordChannelActivity({
      channel: "discord",
      accountId: account.accountId,
      direction: "outbound",
    });
  } catch {
    // Best-effort telemetry only.
  }
  return {
    messageId: payload.id ? String(payload.id) : "unknown",
    channelId: payload.channel_id
      ? String(payload.channel_id)
      : opts.threadId
        ? String(opts.threadId)
        : "",
  };
=======
  return toDiscordSendResult(result, channelId, {
    kind: opts.mediaUrl ? "media" : opts.components || opts.embeds ? "card" : "text",
    replyToId: opts.replyTo,
  });
>>>>>>> upstream/main
}

export async function sendStickerDiscord(
  to: string,
  stickerIds: string[],
  opts: DiscordSendOpts & { content?: string },
): Promise<DiscordSendResult> {
<<<<<<< HEAD
  const cfg = opts.cfg ?? loadConfig();
  const accountInfo = resolveDiscordAccount({
    cfg,
    accountId: opts.accountId,
  });
  const { rest, request, channelId } = await resolveDiscordSendTarget(to, opts);
  const content = opts.content?.trim();
  const rewrittenContent = content
    ? rewriteDiscordKnownMentions(content, {
        accountId: accountInfo.accountId,
      })
    : undefined;
=======
  const { rest, request, channelId, rewrittenContent, suppressEmbeds } =
    await resolveDiscordStructuredSendContext(to, opts);
>>>>>>> upstream/main
  const stickers = normalizeStickerIds(stickerIds);
  const flags = resolveDiscordMessageFlags({ suppressEmbeds });
  const res = (await request(
    () =>
      createChannelMessage<{ id: string; channel_id: string }>(rest, channelId, {
        body: {
          content: rewrittenContent || undefined,
          sticker_ids: stickers,
          ...(flags ? { flags } : {}),
        },
      }),
    "sticker",
  )) as { id: string; channel_id: string };
  return toDiscordSendResult(res, channelId, { kind: "card" });
}

export async function sendPollDiscord(
  to: string,
  poll: PollInput,
  opts: DiscordSendOpts & { content?: string },
): Promise<DiscordSendResult> {
<<<<<<< HEAD
  const cfg = opts.cfg ?? loadConfig();
  const accountInfo = resolveDiscordAccount({
    cfg,
    accountId: opts.accountId,
  });
  const { rest, request, channelId } = await resolveDiscordSendTarget(to, opts);
  const content = opts.content?.trim();
  const rewrittenContent = content
    ? rewriteDiscordKnownMentions(content, {
        accountId: accountInfo.accountId,
      })
    : undefined;
=======
  const { rest, request, channelId, rewrittenContent, suppressEmbeds } =
    await resolveDiscordStructuredSendContext(to, opts);
>>>>>>> upstream/main
  if (poll.durationSeconds !== undefined) {
    throw new Error("Discord polls do not support durationSeconds; use durationHours");
  }
  const payload = normalizeDiscordPollInput(poll);
  const flags = resolveDiscordMessageFlags({ silent: opts.silent, suppressEmbeds });
  const res = (await request(
    () =>
      createChannelMessage<{ id: string; channel_id: string }>(rest, channelId, {
        body: {
          content: rewrittenContent || undefined,
          poll: payload,
          ...(flags ? { flags } : {}),
        },
      }),
    "poll",
  )) as { id: string; channel_id: string };
  return toDiscordSendResult(res, channelId, { kind: "card" });
}

async function resolveDiscordStructuredSendContext(
  to: string,
  opts: DiscordSendOpts & { content?: string },
): Promise<{
  rest: RequestClient;
  request: DiscordClientRequest;
  channelId: string;
  rewrittenContent?: string;
  suppressEmbeds: boolean;
}> {
  const cfg = requireRuntimeConfig(opts.cfg, "Discord structured send");
  const accountInfo = resolveDiscordAccount({
    cfg,
    accountId: opts.accountId,
  });
  const { rest, request, channelId } = await resolveDiscordSendTarget(to, opts);
  const content = opts.content?.trim();
  const rewrittenContent = content
    ? rewriteDiscordKnownMentions(content, {
        accountId: accountInfo.accountId,
        mentionAliases: accountInfo.config.mentionAliases,
      })
    : undefined;
  return {
    rest,
    request,
    channelId,
    rewrittenContent,
    suppressEmbeds: resolveDiscordSuppressEmbeds({
      configured: accountInfo.config.suppressEmbeds,
      override: opts.suppressEmbeds,
    }),
  };
}
