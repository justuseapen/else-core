<<<<<<< HEAD
import type {
=======
// Qa Lab plugin module implements bus queries behavior.
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import type {
  QaBusAttachment,
>>>>>>> upstream/main
  QaBusConversation,
  QaBusEvent,
  QaBusMessage,
  QaBusPollInput,
  QaBusPollResult,
  QaBusReadMessageInput,
  QaBusSearchMessagesInput,
  QaBusStateSnapshot,
  QaBusThread,
<<<<<<< HEAD
=======
  QaBusToolCall,
>>>>>>> upstream/main
} from "./runtime-api.js";

export const DEFAULT_ACCOUNT_ID = "default";

export function normalizeAccountId(raw?: string): string {
  const trimmed = raw?.trim();
  return trimmed || DEFAULT_ACCOUNT_ID;
}

export function normalizeConversationFromTarget(target: string): {
  conversation: QaBusConversation;
  threadId?: string;
} {
  const trimmed = target.trim();
  if (trimmed.startsWith("thread:")) {
    const rest = trimmed.slice("thread:".length);
    const slash = rest.indexOf("/");
    if (slash > 0) {
      return {
        conversation: { id: rest.slice(0, slash), kind: "channel" },
        threadId: rest.slice(slash + 1),
      };
    }
  }
  if (trimmed.startsWith("channel:")) {
    return {
      conversation: { id: trimmed.slice("channel:".length), kind: "channel" },
    };
  }
<<<<<<< HEAD
=======
  if (trimmed.startsWith("group:")) {
    return {
      conversation: { id: trimmed.slice("group:".length), kind: "group" },
    };
  }
>>>>>>> upstream/main
  if (trimmed.startsWith("dm:")) {
    return {
      conversation: { id: trimmed.slice("dm:".length), kind: "direct" },
    };
  }
  return {
    conversation: { id: trimmed, kind: "direct" },
  };
}

export function cloneMessage(message: QaBusMessage): QaBusMessage {
  return {
    ...message,
    conversation: { ...message.conversation },
<<<<<<< HEAD
=======
    attachments: (message.attachments ?? []).map((attachment) => cloneAttachment(attachment)),
    toolCalls: message.toolCalls?.map((toolCall) => cloneToolCall(toolCall)),
>>>>>>> upstream/main
    reactions: message.reactions.map((reaction) => ({ ...reaction })),
  };
}

<<<<<<< HEAD
=======
function cloneAttachment(attachment: QaBusAttachment): QaBusAttachment {
  return { ...attachment };
}

function cloneToolCall(toolCall: QaBusToolCall): QaBusToolCall {
  return {
    name: toolCall.name,
    ...(toolCall.arguments ? { arguments: structuredClone(toolCall.arguments) } : {}),
  };
}

>>>>>>> upstream/main
export function cloneEvent(event: QaBusEvent): QaBusEvent {
  switch (event.kind) {
    case "inbound-message":
    case "outbound-message":
    case "message-edited":
    case "message-deleted":
    case "reaction-added":
      return { ...event, message: cloneMessage(event.message) };
    case "thread-created":
      return { ...event, thread: { ...event.thread } };
  }
<<<<<<< HEAD
=======
  throw new Error("Unsupported QA bus event kind");
>>>>>>> upstream/main
}

export function buildQaBusSnapshot(params: {
  cursor: number;
  conversations: Map<string, QaBusConversation>;
  threads: Map<string, QaBusThread>;
  messages: Map<string, QaBusMessage>;
  events: QaBusEvent[];
}): QaBusStateSnapshot {
  return {
    cursor: params.cursor,
<<<<<<< HEAD
    conversations: Array.from(params.conversations.values()).map((conversation) => ({
      ...conversation,
    })),
    threads: Array.from(params.threads.values()).map((thread) => ({ ...thread })),
=======
    conversations: Array.from(params.conversations.values()).map((conversation) =>
      Object.assign({}, conversation),
    ),
    threads: Array.from(params.threads.values()).map((thread) => Object.assign({}, thread)),
>>>>>>> upstream/main
    messages: Array.from(params.messages.values()).map((message) => cloneMessage(message)),
    events: params.events.map((event) => cloneEvent(event)),
  };
}

export function readQaBusMessage(params: {
  messages: Map<string, QaBusMessage>;
  input: QaBusReadMessageInput;
}) {
  const message = params.messages.get(params.input.messageId);
  if (!message) {
    throw new Error(`qa-bus message not found: ${params.input.messageId}`);
  }
  return cloneMessage(message);
}

export function searchQaBusMessages(params: {
  messages: Map<string, QaBusMessage>;
  input: QaBusSearchMessagesInput;
}) {
  const accountId = normalizeAccountId(params.input.accountId);
  const limit = Math.max(1, Math.min(params.input.limit ?? 20, 100));
<<<<<<< HEAD
  const query = params.input.query?.trim().toLowerCase();
=======
  const query = normalizeOptionalLowercaseString(params.input.query);
>>>>>>> upstream/main
  return Array.from(params.messages.values())
    .filter((message) => message.accountId === accountId)
    .filter((message) =>
      params.input.conversationId ? message.conversation.id === params.input.conversationId : true,
    )
    .filter((message) =>
      params.input.threadId ? message.threadId === params.input.threadId : true,
    )
<<<<<<< HEAD
    .filter((message) => (query ? message.text.toLowerCase().includes(query) : true))
=======
    .filter((message) => {
      if (!query) {
        return true;
      }
      const attachmentHaystack = message.attachments ?? [];
      const searchableAttachmentText = attachmentHaystack
        .flatMap((attachment) => [
          attachment.fileName,
          attachment.altText,
          attachment.transcript,
          attachment.mimeType,
        ])
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();
      const messageText = normalizeOptionalLowercaseString(message.text) ?? "";
      const searchableToolText = (message.toolCalls ?? [])
        .map((toolCall) => toolCall.name)
        .join(" ")
        .toLowerCase();
      return `${messageText} ${searchableAttachmentText} ${searchableToolText}`.includes(query);
    })
>>>>>>> upstream/main
    .slice(-limit)
    .map((message) => cloneMessage(message));
}

<<<<<<< HEAD
=======
export function resolveQaBusPollStartCursor(params: {
  currentCursor: number;
  requestedCursor?: number;
}): number {
  const requestedCursor = params.requestedCursor ?? 0;
  return params.currentCursor < requestedCursor ? 0 : requestedCursor;
}

>>>>>>> upstream/main
export function pollQaBusEvents(params: {
  events: QaBusEvent[];
  cursor: number;
  input?: QaBusPollInput;
}): QaBusPollResult {
  const accountId = normalizeAccountId(params.input?.accountId);
<<<<<<< HEAD
  const startCursor = params.input?.cursor ?? 0;
  const effectiveStartCursor = params.cursor < startCursor ? 0 : startCursor;
=======
  const effectiveStartCursor = resolveQaBusPollStartCursor({
    currentCursor: params.cursor,
    requestedCursor: params.input?.cursor,
  });
>>>>>>> upstream/main
  const limit = Math.max(1, Math.min(params.input?.limit ?? 100, 500));
  const matches = params.events
    .filter((event) => event.accountId === accountId && event.cursor > effectiveStartCursor)
    .slice(0, limit)
    .map((event) => cloneEvent(event));
  return {
    cursor: params.cursor,
    events: matches,
  };
}
