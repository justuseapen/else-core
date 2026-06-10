// Discord plugin module implements outbound adapter behavior.
import type { OutboundIdentity } from "openclaw/plugin-sdk/channel-outbound";
import { resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import {
  type ChannelOutboundAdapter,
  createAttachedChannelResultAdapter,
} from "openclaw/plugin-sdk/channel-send-result";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  normalizeOptionalString,
  normalizeOptionalStringifiedId,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkDiscordTextWithMode } from "./chunk.js";
import { withDiscordDeliveryRetry } from "./delivery-retry.js";
import { notifyDiscordInboundEventOutboundPayloadSuccess } from "./inbound-event-delivery.js";
import { isLikelyDiscordVideoMedia } from "./media-detection.js";
import type { ThreadBindingRecord } from "./monitor/thread-bindings.js";
import { normalizeDiscordOutboundTarget } from "./normalize.js";
<<<<<<< HEAD
import { sendDiscordComponentMessage } from "./send.components.js";
import { sendMessageDiscord, sendPollDiscord, sendWebhookMessageDiscord } from "./send.js";
import { buildDiscordInteractiveComponents } from "./shared-interactive.js";
=======
import { normalizeDiscordApprovalPayload } from "./outbound-approval.js";
import { buildDiscordPresentationPayload } from "./outbound-components.js";
import { sendDiscordOutboundPayload } from "./outbound-payload.js";
import {
  loadDiscordSendRuntime,
  resolveDiscordFormattingOptions,
  resolveDiscordOutboundTarget,
  type DiscordSendFn,
  type DiscordVoiceSendFn,
} from "./outbound-send-context.js";
>>>>>>> upstream/main

export const DISCORD_TEXT_CHUNK_LIMIT = 2000;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE =
  /<\s*(system-reminder|previous_response)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE =
  /<\s*(?:system-reminder|previous_response)\b[^>]*\/\s*>/gi;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE =
  /<\s*\/?\s*(?:system-reminder|previous_response)\b[^>]*>/gi;

<<<<<<< HEAD
function hasApprovalChannelData(payload: { channelData?: unknown }): boolean {
  const channelData = payload.channelData;
  if (!channelData || typeof channelData !== "object" || Array.isArray(channelData)) {
    return false;
  }
  return Boolean((channelData as { execApproval?: unknown }).execApproval);
}

function neutralizeDiscordApprovalMentions(value: string): string {
  return value
    .replace(/@everyone/gi, "@\u200beveryone")
    .replace(/@here/gi, "@\u200bhere")
    .replace(/<@/g, "<@\u200b")
    .replace(/<#/g, "<#\u200b");
}

function normalizeDiscordApprovalPayload<T extends { text?: string; channelData?: unknown }>(
  payload: T,
): T {
  return hasApprovalChannelData(payload) && payload.text
    ? {
        ...payload,
        text: neutralizeDiscordApprovalMentions(payload.text),
      }
    : payload;
}

function resolveDiscordOutboundTarget(params: {
  to: string;
  threadId?: string | number | null;
}): string {
  if (params.threadId == null) {
    return params.to;
  }
  const threadId = String(params.threadId).trim();
  if (!threadId) {
    return params.to;
  }
  return `channel:${threadId}`;
=======
function stripDiscordInternalRuntimeScaffolding(text: string): string {
  return text
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE, "")
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE, "")
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE, "");
}

type DiscordThreadBindingsModule = typeof import("./monitor/thread-bindings.js");

let discordThreadBindingsPromise: Promise<DiscordThreadBindingsModule> | undefined;

function loadDiscordThreadBindings(): Promise<DiscordThreadBindingsModule> {
  discordThreadBindingsPromise ??= import("./monitor/thread-bindings.js");
  return discordThreadBindingsPromise;
>>>>>>> upstream/main
}

function resolveDiscordWebhookIdentity(params: {
  identity?: OutboundIdentity;
  binding: ThreadBindingRecord;
}): { username?: string; avatarUrl?: string } {
  const usernameRaw = normalizeOptionalString(params.identity?.name);
  const fallbackUsername = normalizeOptionalString(params.binding.label) ?? params.binding.agentId;
  const username = (usernameRaw || fallbackUsername || "").slice(0, 80) || undefined;
  const avatarUrl = normalizeOptionalString(params.identity?.avatarUrl);
  return { username, avatarUrl };
}

async function maybeSendDiscordWebhookText(params: {
  cfg: OpenClawConfig;
  text: string;
  threadId?: string | number | null;
  accountId?: string | null;
  identity?: OutboundIdentity;
  replyToId?: string | null;
}): Promise<{ messageId: string; channelId: string } | null> {
  if (params.threadId == null) {
    return null;
  }
  const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
  if (!threadId) {
    return null;
  }
  const { getThreadBindingManager } = await loadDiscordThreadBindings();
  const manager = getThreadBindingManager(params.accountId ?? undefined);
  if (!manager) {
    return null;
  }
  const binding = manager.getByThreadId(threadId);
  if (!binding?.webhookId || !binding?.webhookToken) {
    return null;
  }
  const persona = resolveDiscordWebhookIdentity({
    identity: params.identity,
    binding,
  });
  const { sendWebhookMessageDiscord } = await loadDiscordSendRuntime();
  const result = await sendWebhookMessageDiscord(params.text, {
    webhookId: binding.webhookId,
    webhookToken: binding.webhookToken,
    accountId: binding.accountId,
    threadId: binding.threadId,
    cfg: params.cfg,
    replyTo: params.replyToId ?? undefined,
    username: persona.username,
    avatarUrl: persona.avatarUrl,
  });
  return result;
}

export const discordOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit, ctx) =>
    chunkDiscordTextWithMode(text, {
      maxChars: limit,
      maxLines: ctx?.formatting?.maxLinesPerMessage,
    }),
  textChunkLimit: DISCORD_TEXT_CHUNK_LIMIT,
  sanitizeText: ({ text }) => stripDiscordInternalRuntimeScaffolding(text),
  pollMaxOptions: 10,
  normalizePayload: ({ payload }) => normalizeDiscordApprovalPayload(payload),
<<<<<<< HEAD
  resolveTarget: ({ to }) => normalizeDiscordOutboundTarget(to),
  sendPayload: async (ctx) => {
    const payload = normalizeDiscordApprovalPayload({
      ...ctx.payload,
      text: ctx.payload.text ?? "",
    });
    const discordData = payload.channelData?.discord as
      | { components?: DiscordComponentMessageSpec }
      | undefined;
    const rawComponentSpec =
      discordData?.components ?? buildDiscordInteractiveComponents(payload.interactive);
    const componentSpec = rawComponentSpec
      ? rawComponentSpec.text
        ? rawComponentSpec
        : {
            ...rawComponentSpec,
            text: payload.text?.trim() ? payload.text : undefined,
          }
      : undefined;
    if (!componentSpec) {
      return await sendTextMediaPayload({
        channel: "discord",
        ctx: {
          ...ctx,
          payload,
        },
        adapter: discordOutbound,
      });
    }
    const send =
      resolveOutboundSendDep<typeof sendMessageDiscord>(ctx.deps, "discord") ?? sendMessageDiscord;
    const target = resolveDiscordOutboundTarget({ to: ctx.to, threadId: ctx.threadId });
    const mediaUrls = resolvePayloadMediaUrls(payload);
    const result = await sendPayloadMediaSequenceOrFallback({
      text: payload.text ?? "",
      mediaUrls,
      fallbackResult: { messageId: "", channelId: target },
      sendNoMedia: async () =>
        await sendDiscordComponentMessage(target, componentSpec, {
          replyTo: ctx.replyToId ?? undefined,
          accountId: ctx.accountId ?? undefined,
          silent: ctx.silent ?? undefined,
          cfg: ctx.cfg,
        }),
      send: async ({ text, mediaUrl, isFirst }) => {
        if (isFirst) {
          return await sendDiscordComponentMessage(target, componentSpec, {
            mediaUrl,
            mediaAccess: ctx.mediaAccess,
            mediaLocalRoots: ctx.mediaLocalRoots,
            mediaReadFile: ctx.mediaReadFile,
            replyTo: ctx.replyToId ?? undefined,
            accountId: ctx.accountId ?? undefined,
            silent: ctx.silent ?? undefined,
            cfg: ctx.cfg,
          });
        }
        return await send(target, text, {
          verbose: false,
          mediaUrl,
          mediaAccess: ctx.mediaAccess,
          mediaLocalRoots: ctx.mediaLocalRoots,
          mediaReadFile: ctx.mediaReadFile,
          replyTo: ctx.replyToId ?? undefined,
          accountId: ctx.accountId ?? undefined,
          silent: ctx.silent ?? undefined,
          cfg: ctx.cfg,
        });
=======
  presentationCapabilities: {
    supported: true,
    buttons: true,
    selects: true,
    context: true,
    divider: true,
    limits: {
      actions: {
        maxActions: 25,
        maxActionsPerRow: 5,
        maxRows: 5,
        maxLabelLength: 80,
        supportsDisabled: true,
>>>>>>> upstream/main
      },
      selects: {
        maxOptions: 25,
        maxLabelLength: 100,
        maxValueBytes: 100,
      },
      text: {
        maxLength: DISCORD_TEXT_CHUNK_LIMIT,
        encoding: "characters",
        markdownDialect: "discord-markdown",
      },
    },
  },
  deliveryCapabilities: {
    durableFinal: {
      text: true,
      media: true,
      poll: true,
      payload: true,
      silent: true,
      replyTo: true,
      thread: true,
      messageSendingHooks: true,
    },
  },
  renderPresentation: async ({ payload, presentation }) => {
    return await buildDiscordPresentationPayload({
      payload,
      presentation,
    });
  },
  resolveTarget: ({ to, allowFrom }) => normalizeDiscordOutboundTarget(to, allowFrom),
  sendPayload: async (ctx) =>
    await sendDiscordOutboundPayload({
      ctx,
      fallbackAdapter: discordOutbound,
    }),
  ...createAttachedChannelResultAdapter({
    channel: "discord",
    sendText: async ({
      cfg,
      to,
      text,
      accountId,
      deps,
      replyToId,
      threadId,
      identity,
      silent,
      formatting,
    }) => {
      if (!silent) {
        const webhookResult = await maybeSendDiscordWebhookText({
          cfg,
          text,
          threadId,
          accountId,
          identity,
          replyToId,
        }).catch(() => null);
        if (webhookResult) {
          return webhookResult;
        }
      }
      const send =
        resolveOutboundSendDep<DiscordSendFn>(deps, "discord") ??
        (await loadDiscordSendRuntime()).sendMessageDiscord;
      return await withDiscordDeliveryRetry({
        cfg,
        accountId,
        fn: async () =>
          await send(resolveDiscordOutboundTarget({ to, threadId }), text, {
            verbose: false,
            replyTo: replyToId ?? undefined,
            accountId: accountId ?? undefined,
            silent: silent ?? undefined,
            cfg,
            ...resolveDiscordFormattingOptions({ formatting }),
          }),
      });
    },
    sendMedia: async ({
      cfg,
      to,
      text,
      mediaUrl,
      audioAsVoice,
      mediaAccess,
      mediaLocalRoots,
      mediaReadFile,
      accountId,
      deps,
      replyToId,
      threadId,
      silent,
      formatting,
    }) => {
      const send =
<<<<<<< HEAD
        resolveOutboundSendDep<typeof sendMessageDiscord>(deps, "discord") ?? sendMessageDiscord;
      return await send(resolveDiscordOutboundTarget({ to, threadId }), text, {
        verbose: false,
        mediaUrl,
        mediaLocalRoots,
        mediaReadFile,
        replyTo: replyToId ?? undefined,
        accountId: accountId ?? undefined,
        silent: silent ?? undefined,
=======
        resolveOutboundSendDep<DiscordSendFn>(deps, "discord") ??
        (await loadDiscordSendRuntime()).sendMessageDiscord;
      const target = resolveDiscordOutboundTarget({ to, threadId });
      const formattingOptions = resolveDiscordFormattingOptions({ formatting });
      if (audioAsVoice && mediaUrl) {
        const sendVoice =
          resolveOutboundSendDep<DiscordVoiceSendFn>(deps, "discordVoice") ??
          (await loadDiscordSendRuntime()).sendVoiceMessageDiscord;
        return await withDiscordDeliveryRetry({
          cfg,
          accountId,
          fn: async () =>
            await sendVoice(target, mediaUrl, {
              cfg,
              replyTo: replyToId ?? undefined,
              accountId: accountId ?? undefined,
              silent: silent ?? undefined,
            }),
        });
      }
      if (text.trim() && mediaUrl && isLikelyDiscordVideoMedia(mediaUrl)) {
        await withDiscordDeliveryRetry({
          cfg,
          accountId,
          fn: async () =>
            await send(target, text, {
              verbose: false,
              replyTo: replyToId ?? undefined,
              accountId: accountId ?? undefined,
              silent: silent ?? undefined,
              cfg,
              ...formattingOptions,
            }),
        });
        return await withDiscordDeliveryRetry({
          cfg,
          accountId,
          fn: async () =>
            await send(target, "", {
              verbose: false,
              mediaUrl,
              mediaAccess,
              mediaLocalRoots,
              mediaReadFile,
              accountId: accountId ?? undefined,
              silent: silent ?? undefined,
              cfg,
              ...formattingOptions,
            }),
        });
      }
      return await withDiscordDeliveryRetry({
>>>>>>> upstream/main
        cfg,
        accountId,
        fn: async () =>
          await send(target, text, {
            verbose: false,
            mediaUrl,
            mediaAccess,
            mediaLocalRoots,
            mediaReadFile,
            replyTo: replyToId ?? undefined,
            accountId: accountId ?? undefined,
            silent: silent ?? undefined,
            cfg,
            ...formattingOptions,
          }),
      });
    },
    sendPoll: async ({ cfg, to, poll, accountId, threadId, silent }) =>
      await withDiscordDeliveryRetry({
        cfg,
        accountId,
        fn: async () =>
          await (
            await loadDiscordSendRuntime()
          ).sendPollDiscord(resolveDiscordOutboundTarget({ to, threadId }), poll, {
            accountId: accountId ?? undefined,
            silent: silent ?? undefined,
            cfg,
          }),
      }),
  }),
  afterDeliverPayload: async ({ target, payload }) => {
    notifyDiscordInboundEventOutboundPayloadSuccess({
      payload,
      to: resolveDiscordOutboundTarget({ to: target.to, threadId: target.threadId }),
      accountId: target.accountId,
    });
    const threadId = normalizeOptionalStringifiedId(target.threadId);
    if (!threadId) {
      return;
    }
    const { getThreadBindingManager } = await loadDiscordThreadBindings();
    const manager = getThreadBindingManager(target.accountId ?? undefined);
    if (!manager?.getByThreadId(threadId)) {
      return;
    }
    manager.touchThread({ threadId });
  },
};
