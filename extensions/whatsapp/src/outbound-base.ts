<<<<<<< HEAD
=======
// Whatsapp plugin module implements outbound base behavior.
import {
  DEFAULT_ACCOUNT_ID,
  listCombinedAccountIds,
  normalizeOptionalAccountId,
  resolveListedDefaultAccountId,
} from "openclaw/plugin-sdk/account-core";
import { resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
>>>>>>> upstream/main
import {
  createAttachedChannelResultAdapter,
  type ChannelOutboundAdapter,
} from "openclaw/plugin-sdk/channel-send-result";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveOutboundSendDep, sanitizeForPlainText } from "openclaw/plugin-sdk/infra-runtime";
import { WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./outbound-send-deps.js";
=======
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import {
  normalizeWhatsAppOutboundPayload,
  normalizeWhatsAppPayloadText,
} from "./outbound-media-contract.js";
import { WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./outbound-send-deps.js";
import { lookupInboundMessageMetaForTarget } from "./quoted-message.js";
import { toWhatsappJid } from "./text-runtime.js";
>>>>>>> upstream/main

type WhatsAppChunker = NonNullable<ChannelOutboundAdapter["chunker"]>;
type WhatsAppSendTextOptions = {
  verbose: boolean;
<<<<<<< HEAD
  cfg?: OpenClawConfig;
=======
  cfg: OpenClawConfig;
>>>>>>> upstream/main
  mediaUrl?: string;
  mediaAccess?: {
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
  };
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  gifPlayback?: boolean;
<<<<<<< HEAD
  accountId?: string;
=======
  audioAsVoice?: boolean;
  forceDocument?: boolean;
  accountId?: string;
  quotedMessageKey?: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
    participant?: string;
    messageText?: string;
  };
  preserveLeadingWhitespace?: boolean;
>>>>>>> upstream/main
};
type WhatsAppSendMessage = (
  to: string,
  body: string,
  options: WhatsAppSendTextOptions,
) => Promise<{ messageId: string; toJid: string }>;
type WhatsAppSendPoll = (
  to: string,
  poll: Parameters<NonNullable<ChannelOutboundAdapter["sendPoll"]>>[0]["poll"],
<<<<<<< HEAD
  options: { verbose: boolean; accountId?: string; cfg?: OpenClawConfig },
=======
  options: { verbose: boolean; accountId?: string; cfg: OpenClawConfig },
>>>>>>> upstream/main
) => Promise<{ messageId: string; toJid: string }>;

type CreateWhatsAppOutboundBaseParams = {
  chunker: WhatsAppChunker;
  sendMessageWhatsApp: WhatsAppSendMessage;
  sendPollWhatsApp: WhatsAppSendPoll;
  shouldLogVerbose: () => boolean;
  resolveTarget: ChannelOutboundAdapter["resolveTarget"];
  normalizeText?: (text: string | undefined) => string;
  skipEmptyText?: boolean;
};

<<<<<<< HEAD
=======
function resolveQuoteLookupAccountId(cfg?: OpenClawConfig, accountId?: string | null): string {
  const explicitAccountId = normalizeOptionalAccountId(accountId);
  if (explicitAccountId) {
    return explicitAccountId;
  }
  const channelCfg = cfg?.channels?.whatsapp;
  const configuredIds = listCombinedAccountIds({
    configuredAccountIds:
      channelCfg?.accounts && typeof channelCfg.accounts === "object"
        ? Object.keys(channelCfg.accounts).filter(Boolean)
        : [],
    fallbackAccountIdWhenEmpty: DEFAULT_ACCOUNT_ID,
  });
  return resolveListedDefaultAccountId({
    accountIds: configuredIds,
    configuredDefaultAccountId: normalizeOptionalAccountId(channelCfg?.defaultAccount),
  });
}

type WhatsAppOutboundBaseCore = Pick<
  ChannelOutboundAdapter,
  | "deliveryMode"
  | "chunker"
  | "chunkerMode"
  | "textChunkLimit"
  | "sanitizeText"
  | "deliveryCapabilities"
  | "pollMaxOptions"
  | "resolveTarget"
  | "sendText"
  | "sendMedia"
  | "sendPoll"
>;

>>>>>>> upstream/main
export function createWhatsAppOutboundBase({
  chunker,
  sendMessageWhatsApp,
  sendPollWhatsApp,
  shouldLogVerbose,
  resolveTarget,
<<<<<<< HEAD
  normalizeText = (text) => text ?? "",
  skipEmptyText = false,
=======
  normalizeText = normalizeWhatsAppPayloadText,
  skipEmptyText = true,
>>>>>>> upstream/main
}: CreateWhatsAppOutboundBaseParams): Pick<
  ChannelOutboundAdapter,
  | "deliveryMode"
  | "chunker"
  | "chunkerMode"
  | "textChunkLimit"
  | "sanitizeText"
<<<<<<< HEAD
  | "pollMaxOptions"
  | "resolveTarget"
=======
  | "deliveryCapabilities"
  | "pollMaxOptions"
  | "resolveTarget"
  | "sendPayload"
>>>>>>> upstream/main
  | "sendText"
  | "sendMedia"
  | "sendPoll"
> {
<<<<<<< HEAD
  return {
=======
  const resolveQuotedMessageKey = (params: {
    accountId: string;
    to: string;
    replyToId?: string | null;
  }) => {
    const replyToId = params.replyToId?.trim();
    if (!replyToId) {
      return undefined;
    }
    const targetJid = toWhatsappJid(params.to);
    const cachedMeta = lookupInboundMessageMetaForTarget(params.accountId, targetJid, replyToId);
    return {
      id: replyToId,
      remoteJid: cachedMeta?.remoteJid ?? targetJid,
      fromMe: cachedMeta?.fromMe ?? false,
      participant: cachedMeta?.participant,
      messageText: cachedMeta?.body,
    };
  };

  const outbound: WhatsAppOutboundBaseCore = {
>>>>>>> upstream/main
    deliveryMode: "gateway",
    chunker,
    chunkerMode: "text",
    textChunkLimit: 4000,
<<<<<<< HEAD
    sanitizeText: ({ text }) => sanitizeForPlainText(text),
=======
    sanitizeText: ({ text }) => normalizeText(text),
    deliveryCapabilities: {
      durableFinal: {
        text: true,
        replyTo: true,
        messageSendingHooks: true,
      },
    },
>>>>>>> upstream/main
    pollMaxOptions: 12,
    resolveTarget,
    ...createAttachedChannelResultAdapter({
      channel: "whatsapp",
<<<<<<< HEAD
      sendText: async ({ cfg, to, text, accountId, deps, gifPlayback }) => {
=======
      sendText: async ({ cfg, to, text, accountId, deps, gifPlayback, replyToId }) => {
>>>>>>> upstream/main
        const normalizedText = normalizeText(text);
        if (skipEmptyText && !normalizedText) {
          return { messageId: "" };
        }
        const send =
          resolveOutboundSendDep<WhatsAppSendMessage>(deps, "whatsapp", {
            legacyKeys: WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS,
          }) ?? sendMessageWhatsApp;
<<<<<<< HEAD
=======
        const lookupAccountId = resolveQuoteLookupAccountId(cfg, accountId);
        const quotedMessageKey = resolveQuotedMessageKey({
          accountId: lookupAccountId,
          to,
          replyToId,
        });
>>>>>>> upstream/main
        return await send(to, normalizedText, {
          verbose: false,
          cfg,
          accountId: accountId ?? undefined,
          gifPlayback,
<<<<<<< HEAD
=======
          quotedMessageKey,
>>>>>>> upstream/main
        });
      },
      sendMedia: async ({
        cfg,
        to,
        text,
        mediaUrl,
        mediaAccess,
        mediaLocalRoots,
        mediaReadFile,
<<<<<<< HEAD
        accountId,
        deps,
        gifPlayback,
=======
        audioAsVoice,
        accountId,
        deps,
        gifPlayback,
        forceDocument,
        replyToId,
>>>>>>> upstream/main
      }) => {
        const send =
          resolveOutboundSendDep<WhatsAppSendMessage>(deps, "whatsapp", {
            legacyKeys: WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS,
          }) ?? sendMessageWhatsApp;
<<<<<<< HEAD
=======
        const lookupAccountId = resolveQuoteLookupAccountId(cfg, accountId);
        const quotedMessageKey = resolveQuotedMessageKey({
          accountId: lookupAccountId,
          to,
          replyToId,
        });
>>>>>>> upstream/main
        return await send(to, normalizeText(text), {
          verbose: false,
          cfg,
          mediaUrl,
          mediaAccess,
          mediaLocalRoots,
          mediaReadFile,
<<<<<<< HEAD
          accountId: accountId ?? undefined,
          gifPlayback,
=======
          ...(audioAsVoice === undefined ? {} : { audioAsVoice }),
          accountId: accountId ?? undefined,
          gifPlayback,
          forceDocument,
          quotedMessageKey,
>>>>>>> upstream/main
        });
      },
      sendPoll: async ({ cfg, to, poll, accountId }) =>
        await sendPollWhatsApp(to, poll, {
          verbose: shouldLogVerbose(),
          accountId: accountId ?? undefined,
          cfg,
        }),
    }),
  };
<<<<<<< HEAD
=======
  return {
    ...outbound,
    sendPayload: async (ctx) => {
      if (ctx.payload.isError === true) {
        return { channel: "whatsapp", messageId: "" };
      }
      const payload = normalizeWhatsAppOutboundPayload(ctx.payload, { normalizeText });
      if (!payload.text && !(payload.mediaUrl || payload.mediaUrls?.length)) {
        if (ctx.payload.interactive || ctx.payload.presentation || ctx.payload.channelData) {
          throw new Error(
            "WhatsApp sendPayload does not support structured-only payloads without text or media.",
          );
        }
        return { channel: "whatsapp", messageId: "" };
      }
      return await sendTextMediaPayload({
        channel: "whatsapp",
        ctx: {
          ...ctx,
          payload,
        },
        adapter: outbound,
      });
    },
  };
>>>>>>> upstream/main
}
