// Telegram plugin module implements draft stream behavior.
import type { Bot } from "grammy";
<<<<<<< HEAD
import { createFinalizableDraftLifecycle } from "openclaw/plugin-sdk/channel-lifecycle";
=======
import {
  createFinalizableDraftStreamControlsForState,
  takeMessageIdAfterStop,
} from "openclaw/plugin-sdk/channel-outbound";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
>>>>>>> upstream/main
import { buildTelegramThreadParams, type TelegramThreadSpec } from "./bot/helpers.js";
import { isSafeToRetrySendError, isTelegramClientRejection } from "./network-errors.js";
import { normalizeTelegramReplyToMessageId } from "./outbound-params.js";

const TELEGRAM_STREAM_MAX_CHARS = 4096;
const DEFAULT_THROTTLE_MS = 1000;
<<<<<<< HEAD
const TELEGRAM_DRAFT_ID_MAX = 2_147_483_647;
const THREAD_NOT_FOUND_RE = /400:\s*Bad Request:\s*message thread not found/i;
const DRAFT_METHOD_UNAVAILABLE_RE =
  /(unknown method|method .*not (found|available|supported)|unsupported)/i;
const DRAFT_CHAT_UNSUPPORTED_RE = /(can't be used|can be used only)/i;

type TelegramSendMessageDraft = (
  chatId: Parameters<Bot["api"]["sendMessage"]>[0],
  draftId: number,
  text: string,
  params?: {
    message_thread_id?: number;
    parse_mode?: "HTML";
  },
) => Promise<unknown>;

type TelegramSendMessageParams = Parameters<Bot["api"]["sendMessage"]>[2];

function hasNumericMessageThreadId(
  params: TelegramSendMessageParams | undefined,
): params is TelegramSendMessageParams & { message_thread_id: number } {
  return (
    typeof params === "object" &&
    params !== null &&
    typeof (params as { message_thread_id?: unknown }).message_thread_id === "number"
  );
}

/**
 * Keep draft-id allocation shared across bundled chunks so concurrent preview
 * lanes do not accidentally reuse draft ids when code-split entries coexist.
 */
const TELEGRAM_DRAFT_STREAM_STATE_KEY = Symbol.for("openclaw.telegramDraftStreamState");
let draftStreamState: { nextDraftId: number } | undefined;

function getDraftStreamState(): { nextDraftId: number } {
  if (!draftStreamState) {
    const globalStore = globalThis as Record<PropertyKey, unknown>;
    draftStreamState = (globalStore[TELEGRAM_DRAFT_STREAM_STATE_KEY] as
      | { nextDraftId: number }
      | undefined) ?? {
      nextDraftId: 0,
    };
    globalStore[TELEGRAM_DRAFT_STREAM_STATE_KEY] = draftStreamState;
  }
  return draftStreamState;
}

function allocateTelegramDraftId(): number {
  const state = getDraftStreamState();
  state.nextDraftId = state.nextDraftId >= TELEGRAM_DRAFT_ID_MAX ? 1 : state.nextDraftId + 1;
  return state.nextDraftId;
}

function resolveSendMessageDraftApi(api: Bot["api"]): TelegramSendMessageDraft | undefined {
  const sendMessageDraft = (api as Bot["api"] & { sendMessageDraft?: TelegramSendMessageDraft })
    .sendMessageDraft;
  if (typeof sendMessageDraft !== "function") {
    return undefined;
  }
  return sendMessageDraft.bind(api as object);
}

function shouldFallbackFromDraftTransport(err: unknown): boolean {
  const text =
    typeof err === "string"
      ? err
      : err instanceof Error
        ? err.message
        : typeof err === "object" && err && "description" in err
          ? typeof err.description === "string"
            ? err.description
            : ""
          : "";
  if (!/sendMessageDraft/i.test(text)) {
    return false;
  }
  return DRAFT_METHOD_UNAVAILABLE_RE.test(text) || DRAFT_CHAT_UNSUPPORTED_RE.test(text);
}
=======
>>>>>>> upstream/main

export type TelegramDraftStream = {
  update: (text: string) => void;
  flush: () => Promise<void>;
  messageId: () => number | undefined;
  visibleSinceMs?: () => number | undefined;
  previewRevision?: () => number;
  lastDeliveredText?: () => string;
  clear: () => Promise<void>;
  stop: () => Promise<void>;
  /** Stop without a final flush or delete. */
  discard?: () => Promise<void>;
  /** Return the current preview message id after pending updates settle. */
  materialize?: () => Promise<number | undefined>;
  /** Reset internal state so the next update creates a new message instead of editing. */
  forceNewMessage: () => void;
  /** True when a preview sendMessage was attempted but the response was lost. */
  sendMayHaveLanded?: () => boolean;
};

type TelegramDraftPreview = {
  text: string;
  parseMode?: "HTML";
};

type SupersededTelegramPreview = {
  messageId: number;
  textSnapshot: string;
  parseMode?: "HTML";
  visibleSinceMs?: number;
  retain?: boolean;
};

function renderTelegramDraftPreview(
  text: string,
  renderText: ((text: string) => TelegramDraftPreview) | undefined,
): TelegramDraftPreview {
  const trimmed = text.trimEnd();
  return renderText?.(trimmed) ?? { text: trimmed };
}

function findTelegramDraftChunkLength(
  text: string,
  maxChars: number,
  renderText: ((text: string) => TelegramDraftPreview) | undefined,
): number {
  let best = 0;
  let low = 1;
  let high = text.length;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const renderedText = renderTelegramDraftPreview(text.slice(0, mid), renderText).text.trimEnd();
    if (renderedText && renderedText.length <= maxChars) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}

export function createTelegramDraftStream(params: {
  api: Bot["api"];
  chatId: Parameters<Bot["api"]["sendMessage"]>[0];
  maxChars?: number;
  thread?: TelegramThreadSpec | null;
  replyToMessageId?: number;
  throttleMs?: number;
  /** Minimum chars before sending first message (debounce for push notifications) */
  minInitialChars?: number;
  /** Optional preview renderer (e.g. markdown -> HTML + parse mode). */
  renderText?: (text: string) => TelegramDraftPreview;
  /** Called when a late send resolves after forceNewMessage() switched generations. */
  onSupersededPreview?: (preview: SupersededTelegramPreview) => void;
  log?: (message: string) => void;
  warn?: (message: string) => void;
}): TelegramDraftStream {
  const maxChars = Math.min(
    params.maxChars ?? TELEGRAM_STREAM_MAX_CHARS,
    TELEGRAM_STREAM_MAX_CHARS,
  );
  const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
  const minInitialChars = params.minInitialChars;
  const chatId = params.chatId;
  const threadParams = buildTelegramThreadParams(params.thread);
  const replyToMessageId = normalizeTelegramReplyToMessageId(params.replyToMessageId);
  const replyParams =
    replyToMessageId != null
      ? {
          ...threadParams,
          reply_to_message_id: replyToMessageId,
          allow_sending_without_reply: true,
        }
      : threadParams;

  const streamState = { stopped: false, final: false };
  let messageSendAttempted = false;
  let streamMessageId: number | undefined;
  let streamVisibleSinceMs: number | undefined;
  let lastSentText = "";
  let lastDeliveredText = "";
  let lastRequestedText = "";
  let lastSentParseMode: "HTML" | undefined;
  let previewRevision = 0;
  let generation = 0;
  let deliveredTextOffset = 0;
  type PreviewSendParams = {
    renderedText: string;
    renderedParseMode: "HTML" | undefined;
    sendGeneration: number;
  };
  const sendRenderedMessage = async (sendArgs: {
    renderedText: string;
    renderedParseMode: "HTML" | undefined;
  }) => {
    const sendParams = sendArgs.renderedParseMode
      ? {
          ...replyParams,
          parse_mode: sendArgs.renderedParseMode,
        }
      : replyParams;
<<<<<<< HEAD
    const usedThreadParams = hasNumericMessageThreadId(sendParams);
    try {
      return {
        sent: await params.api.sendMessage(chatId, sendArgs.renderedText, sendParams),
        usedThreadParams,
      };
    } catch (err) {
      if (!usedThreadParams || !THREAD_NOT_FOUND_RE.test(String(err))) {
        throw err;
      }
      const threadlessParams: TelegramSendMessageParams = { ...(sendParams ?? {}) };
      delete threadlessParams.message_thread_id;
      params.warn?.(sendArgs.fallbackWarnMessage);
      return {
        sent: await params.api.sendMessage(
          chatId,
          sendArgs.renderedText,
          Object.keys(threadlessParams).length > 0 ? threadlessParams : undefined,
        ),
        usedThreadParams: false,
      };
    }
=======
    return await params.api.sendMessage(chatId, sendArgs.renderedText, sendParams);
>>>>>>> upstream/main
  };
  const sendMessageTransportPreview = async ({
    renderedText,
    renderedParseMode,
    sendGeneration,
  }: PreviewSendParams): Promise<boolean> => {
    if (typeof streamMessageId === "number") {
      streamVisibleSinceMs ??= Date.now();
      if (renderedParseMode) {
        await params.api.editMessageText(chatId, streamMessageId, renderedText, {
          parse_mode: renderedParseMode,
        });
      } else {
        await params.api.editMessageText(chatId, streamMessageId, renderedText);
      }
      return true;
    }
    messageSendAttempted = true;
    let sent: Awaited<ReturnType<typeof sendRenderedMessage>>;
    try {
      sent = await sendRenderedMessage({
        renderedText,
        renderedParseMode,
      });
    } catch (err) {
      if (isSafeToRetrySendError(err) || isTelegramClientRejection(err)) {
        messageSendAttempted = false;
      }
      throw err;
    }
    const sentMessageId = sent?.message_id;
    if (typeof sentMessageId !== "number" || !Number.isFinite(sentMessageId)) {
      streamState.stopped = true;
      params.warn?.("telegram stream preview stopped (missing message id from sendMessage)");
      return false;
    }
    const normalizedMessageId = Math.trunc(sentMessageId);
    const visibleSinceMs = Date.now();
    if (sendGeneration !== generation) {
      params.onSupersededPreview?.({
        messageId: normalizedMessageId,
        textSnapshot: renderedText,
        parseMode: renderedParseMode,
        visibleSinceMs,
        retain: true,
      });
      return true;
    }
    streamMessageId = normalizedMessageId;
    streamVisibleSinceMs = visibleSinceMs;
    return true;
  };
  const stopOversizedPreview = (renderedText: string): false => {
    streamState.stopped = true;
    params.warn?.(
      `telegram stream preview stopped (text length ${renderedText.length} > ${maxChars})`,
    );
    return false;
  };

  const sendOrEditStreamMessage = async (text: string): Promise<boolean> => {
    if (streamState.stopped && !streamState.final) {
      return false;
    }
    const trimmed = text.trimEnd();
    if (!trimmed) {
      return false;
    }
    const currentText = trimmed.slice(deliveredTextOffset).trimStart();
    if (!currentText) {
      return false;
    }
    const rendered = renderTelegramDraftPreview(currentText, params.renderText);
    const renderedText = rendered.text.trimEnd();
    const renderedParseMode = rendered.parseMode;
    if (!renderedText) {
      return false;
    }
    if (renderedText.length > maxChars) {
      const chunkLength = findTelegramDraftChunkLength(currentText, maxChars, params.renderText);
      if (!streamState.final) {
        if (chunkLength > 0) {
          return await sendOrEditStreamMessage(
            trimmed.slice(0, deliveredTextOffset) + currentText.slice(0, chunkLength),
          );
        }
        return stopOversizedPreview(renderedText);
      }
      if (lastDeliveredText.length > deliveredTextOffset) {
        const supersededMessageId = streamMessageId;
        const supersededTextSnapshot = lastSentText;
        const supersededParseMode = lastSentParseMode;
        const supersededVisibleSinceMs = streamVisibleSinceMs;
        deliveredTextOffset = lastDeliveredText.length;
        resetStreamToNewMessage({ keepFinal: true, keepPending: true, resetOffset: false });
        if (typeof supersededMessageId === "number") {
          params.onSupersededPreview?.({
            messageId: supersededMessageId,
            textSnapshot: supersededTextSnapshot,
            parseMode: supersededParseMode,
            visibleSinceMs: supersededVisibleSinceMs,
            retain: true,
          });
        }
        return await sendOrEditStreamMessage(trimmed);
      }
      if (chunkLength > 0) {
        const sent = await sendOrEditStreamMessage(
          trimmed.slice(0, deliveredTextOffset) + currentText.slice(0, chunkLength),
        );
        if (!sent) {
          return false;
        }
        return await sendOrEditStreamMessage(trimmed);
      }
      return stopOversizedPreview(renderedText);
    }
    if (renderedText === lastSentText && renderedParseMode === lastSentParseMode) {
      return true;
    }
    const sendGeneration = generation;

    if (typeof streamMessageId !== "number" && minInitialChars != null && !streamState.final) {
      if (renderedText.length < minInitialChars) {
        return false;
      }
    }

    lastSentText = renderedText;
    lastSentParseMode = renderedParseMode;
    try {
      const sent = await sendMessageTransportPreview({
        renderedText,
        renderedParseMode,
        sendGeneration,
      });
      if (sent) {
        previewRevision += 1;
        lastDeliveredText = trimmed;
      }
      return sent;
    } catch (err) {
      streamState.stopped = true;
      params.warn?.(`telegram stream preview failed: ${formatErrorMessage(err)}`);
      return false;
    }
  };

  const {
    loop,
    update: updateDraft,
    stopForClear,
  } = createFinalizableDraftStreamControlsForState({
    throttleMs,
    state: streamState,
    sendOrEditStreamMessage,
  });

  const update = (text: string) => {
    if (streamState.stopped || streamState.final) {
      return;
    }
    lastRequestedText = text;
    updateDraft(text);
  };

  const stop = async () => {
    streamState.final = true;
    await loop.flush();
    if (streamState.stopped) {
      return;
    }
    const finalText = lastRequestedText.trimEnd();
    if (finalText && finalText !== lastDeliveredText.trimEnd()) {
      await sendOrEditStreamMessage(finalText);
    }
    streamState.final = true;
  };

  const resetStreamToNewMessage: (options?: {
    keepFinal?: boolean;
    keepPending?: boolean;
    resetOffset?: boolean;
  }) => void = (options) => {
    streamState.stopped = false;
    streamState.final = options?.keepFinal === true;
    generation += 1;
    messageSendAttempted = false;
    streamMessageId = undefined;
    streamVisibleSinceMs = undefined;
    lastSentText = "";
    lastSentParseMode = undefined;
    if (options?.resetOffset !== false) {
      deliveredTextOffset = 0;
      lastRequestedText = "";
    }
    if (!options?.keepPending) {
      loop.resetPending();
    }
    loop.resetThrottleWindow();
  };

  const clear = async () => {
    const messageId = await takeMessageIdAfterStop({
      stopForClear,
      readMessageId: () => streamMessageId,
      clearMessageId: () => {
        streamMessageId = undefined;
      },
    });
    if (typeof messageId === "number" && Number.isFinite(messageId)) {
      try {
        await params.api.deleteMessage(chatId, messageId);
        params.log?.(`telegram stream preview deleted (chat=${chatId}, message=${messageId})`);
      } catch (err) {
        params.warn?.(`telegram stream preview cleanup failed: ${formatErrorMessage(err)}`);
      }
    }
  };

  const discard = async () => {
    await stopForClear();
  };

  const forceNewMessage = () => {
    resetStreamToNewMessage();
  };

  const materialize = async (): Promise<number | undefined> => {
    await stop();
    return streamMessageId;
  };

  params.log?.(`telegram stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);

  return {
    update,
    flush: loop.flush,
    messageId: () => streamMessageId,
    visibleSinceMs: () => streamVisibleSinceMs,
    previewRevision: () => previewRevision,
    lastDeliveredText: () => lastDeliveredText,
    clear,
    stop,
    discard,
    materialize,
    forceNewMessage,
    sendMayHaveLanded: () => messageSendAttempted && typeof streamMessageId !== "number",
  };
}
<<<<<<< HEAD

export const __testing = {
  resetTelegramDraftStreamForTests() {
    getDraftStreamState().nextDraftId = 0;
  },
};
=======
>>>>>>> upstream/main
