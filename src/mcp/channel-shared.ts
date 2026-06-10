<<<<<<< HEAD
import { z } from "zod";
import { normalizeMessageChannel } from "../utils/message-channel.js";

export type ClaudeChannelMode = "off" | "on" | "auto";

=======
// Shared MCP channel helpers normalize channel tool payloads and responses.
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString as toText,
} from "@openclaw/normalization-core/string-coerce";
import { z } from "zod";

/**
 * Shared channel MCP contracts and normalization helpers.
 *
 * These shapes are intentionally smaller than raw Gateway payloads so MCP tools
 * can return stable structured content without exposing every session detail.
 */
/** Controls whether the MCP server advertises Claude channel extensions. */
export type ClaudeChannelMode = "off" | "on" | "auto";

/** Conversation route information required to read and reply through a channel session. */
>>>>>>> upstream/main
export type ConversationDescriptor = {
  sessionKey: string;
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
  label?: string;
  displayName?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  updatedAt?: number | null;
};

<<<<<<< HEAD
export type SessionRow = {
=======
type SessionRow = {
>>>>>>> upstream/main
  key: string;
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
  };
  origin?: {
    provider?: string;
    accountId?: string;
    threadId?: string | number;
  };
  label?: string;
  displayName?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  updatedAt?: number | null;
};

<<<<<<< HEAD
=======
/** Minimal Gateway response shape used by conversation listing. */
>>>>>>> upstream/main
export type SessionListResult = {
  sessions?: SessionRow[];
};

<<<<<<< HEAD
=======
/** Minimal Gateway response shape used by conversation lookup. */
export type SessionDescribeResult = {
  session?: SessionRow | null;
};

/** Minimal Gateway response shape used by message reads. */
>>>>>>> upstream/main
export type ChatHistoryResult = {
  messages?: Array<{ id?: string; role?: string; content?: unknown; [key: string]: unknown }>;
};

<<<<<<< HEAD
=======
/** Gateway session.message payload fields consumed by the MCP event bridge. */
>>>>>>> upstream/main
export type SessionMessagePayload = {
  sessionKey?: string;
  messageId?: string;
  messageSeq?: number;
  message?: { role?: string; content?: unknown; [key: string]: unknown };
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  [key: string]: unknown;
};

<<<<<<< HEAD
export type ApprovalKind = "exec" | "plugin";
export type ApprovalDecision = "allow-once" | "allow-always" | "deny";

=======
/** Gateway approval family exposed through MCP. */
export type ApprovalKind = "exec" | "plugin";
/** Decision values accepted by Gateway approval resolvers. */
export type ApprovalDecision = "allow-once" | "allow-always" | "deny";

/** Approval request tracked locally while waiting for an MCP client decision. */
>>>>>>> upstream/main
export type PendingApproval = {
  kind: ApprovalKind;
  id: string;
  request?: Record<string, unknown>;
  createdAtMs?: number;
  expiresAtMs?: number;
};

<<<<<<< HEAD
=======
/** Cursor-addressed event returned by MCP event polling and waiting tools. */
>>>>>>> upstream/main
export type QueueEvent =
  | {
      cursor: number;
      type: "message";
      sessionKey: string;
      conversation?: ConversationDescriptor;
      messageId?: string;
      messageSeq?: number;
      role?: string;
      text?: string;
      raw: SessionMessagePayload;
    }
  | {
      cursor: number;
      type: "claude_permission_request";
      requestId: string;
      toolName: string;
      description: string;
      inputPreview: string;
    }
  | {
      cursor: number;
      type: "exec_approval_requested" | "exec_approval_resolved";
      raw: Record<string, unknown>;
    }
  | {
      cursor: number;
      type: "plugin_approval_requested" | "plugin_approval_resolved";
      raw: Record<string, unknown>;
    };

<<<<<<< HEAD
=======
/** Claude channel permission notification payload before it is assigned an event cursor. */
>>>>>>> upstream/main
export type ClaudePermissionRequest = {
  toolName: string;
  description: string;
  inputPreview: string;
};

<<<<<<< HEAD
=======
/** Cursor and optional session filter used by event polling and waiting. */
>>>>>>> upstream/main
export type WaitFilter = {
  afterCursor: number;
  sessionKey?: string;
};

<<<<<<< HEAD
=======
/** Raw MCP notification schema emitted by Claude channel clients for permission prompts. */
>>>>>>> upstream/main
export const ClaudePermissionRequestSchema = z.object({
  method: z.literal("notifications/claude/channel/permission_request"),
  params: z.object({
    request_id: z.string(),
    tool_name: z.string(),
    description: z.string(),
    input_preview: z.string(),
  }),
});

<<<<<<< HEAD
export function toText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function resolveMessageId(entry: Record<string, unknown>): string | undefined {
  return (
    toText(entry.id) ??
    (entry.__openclaw && typeof entry.__openclaw === "object"
      ? toText((entry.__openclaw as { id?: unknown }).id)
=======
export { toText };

/** Resolve the visible message id, including OpenClaw metadata attached to raw entries. */
export function resolveMessageId(entry: Record<string, unknown>): string | undefined {
  return (
    toText(entry.id) ??
    (entry["__openclaw"] && typeof entry["__openclaw"] === "object"
      ? toText((entry["__openclaw"] as { id?: unknown }).id)
>>>>>>> upstream/main
      : undefined)
  );
}

<<<<<<< HEAD
=======
/** Build the text summary format expected by simple MCP tool results. */
>>>>>>> upstream/main
export function summarizeResult(
  label: string,
  count: number,
): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: `${label}: ${count}` }],
  };
}

<<<<<<< HEAD
export function resolveConversationChannel(row: SessionRow): string | undefined {
  return normalizeMessageChannel(
=======
/** Build a text summary plus pretty JSON payload for MCP clients without structured rendering. */
export function summarizeStructuredResult(
  label: string,
  count: number,
  payload: unknown,
): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: `${label}: ${count}\n\n${JSON.stringify(payload, null, 2)}` }],
  };
}

function resolveConversationChannel(row: SessionRow): string | undefined {
  return normalizeOptionalLowercaseString(
>>>>>>> upstream/main
    toText(row.deliveryContext?.channel) ??
      toText(row.lastChannel) ??
      toText(row.channel) ??
      toText(row.origin?.provider),
  );
}

<<<<<<< HEAD
=======
/** Convert a Gateway session row into a reply-capable conversation descriptor. */
>>>>>>> upstream/main
export function toConversation(row: SessionRow): ConversationDescriptor | null {
  const channel = resolveConversationChannel(row);
  const to = toText(row.deliveryContext?.to) ?? toText(row.lastTo);
  if (!channel || !to) {
    return null;
  }
  return {
    sessionKey: row.key,
    channel,
    to,
    accountId:
      toText(row.deliveryContext?.accountId) ??
      toText(row.lastAccountId) ??
      toText(row.origin?.accountId),
    threadId: row.deliveryContext?.threadId ?? row.lastThreadId ?? row.origin?.threadId,
    label: toText(row.label),
    displayName: toText(row.displayName),
    derivedTitle: toText(row.derivedTitle),
    lastMessagePreview: toText(row.lastMessagePreview),
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : null,
  };
}

<<<<<<< HEAD
=======
/** Check whether a queued event should be visible to a poll or wait call. */
>>>>>>> upstream/main
export function matchEventFilter(event: QueueEvent, filter: WaitFilter): boolean {
  if (event.cursor <= filter.afterCursor) {
    return false;
  }
  if (!filter.sessionKey) {
    return true;
  }
  return "sessionKey" in event && event.sessionKey === filter.sessionKey;
}

<<<<<<< HEAD
=======
/** Return non-text content blocks from a raw message payload. */
>>>>>>> upstream/main
export function extractAttachmentsFromMessage(message: unknown): unknown[] {
  if (!message || typeof message !== "object") {
    return [];
  }
  const content = (message as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return [];
  }
  return content.filter((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    return toText((entry as { type?: unknown }).type) !== "text";
  });
}

<<<<<<< HEAD
=======
/** Normalize approval identifiers before local tracking or resolution. */
>>>>>>> upstream/main
export function normalizeApprovalId(value: unknown): string | undefined {
  const id = toText(value);
  return id ? id.trim() : undefined;
}
