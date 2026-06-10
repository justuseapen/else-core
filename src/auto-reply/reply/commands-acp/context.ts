<<<<<<< HEAD
import { normalizeConversationText } from "../../../acp/conversation-id.js";
=======
// Implements ACP context commands for session metadata and prompt state.
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { normalizeConversationText } from "../../../acp/conversation-id.js";
import { normalizeConversationTargetRef } from "../../../infra/outbound/session-binding-normalization.js";
>>>>>>> upstream/main
import type { HandleCommandsParams } from "../commands-types.js";
import {
  resolveConversationBindingAccountIdFromMessage,
  resolveConversationBindingChannelFromMessage,
  resolveConversationBindingContextFromAcpCommand,
  resolveConversationBindingThreadIdFromMessage,
} from "../conversation-binding-input.js";

export function resolveAcpCommandChannel(params: HandleCommandsParams): string {
  const resolved = resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel);
<<<<<<< HEAD
  return normalizeConversationText(resolved).toLowerCase();
=======
  return normalizeLowercaseStringOrEmpty(normalizeConversationText(resolved));
>>>>>>> upstream/main
}

export function resolveAcpCommandAccountId(params: HandleCommandsParams): string {
  return resolveConversationBindingAccountIdFromMessage({
    ctx: params.ctx,
    cfg: params.cfg,
    commandChannel: params.command.channel,
  });
}

export function resolveAcpCommandThreadId(params: HandleCommandsParams): string | undefined {
  return resolveConversationBindingThreadIdFromMessage(params.ctx);
}

function resolveAcpCommandConversationRef(params: HandleCommandsParams): {
  conversationId: string;
  parentConversationId?: string;
} | null {
  const resolved = resolveConversationBindingContextFromAcpCommand(params);
  if (!resolved) {
    return null;
  }
<<<<<<< HEAD
  return {
    conversationId: resolved.conversationId,
    ...(resolved.parentConversationId && resolved.parentConversationId !== resolved.conversationId
      ? { parentConversationId: resolved.parentConversationId }
      : {}),
  };
=======
  return normalizeConversationTargetRef({
    conversationId: resolved.conversationId,
    parentConversationId: resolved.parentConversationId,
  });
>>>>>>> upstream/main
}

export function resolveAcpCommandConversationId(params: HandleCommandsParams): string | undefined {
  return resolveAcpCommandConversationRef(params)?.conversationId;
}

export function resolveAcpCommandParentConversationId(
  params: HandleCommandsParams,
): string | undefined {
  return resolveAcpCommandConversationRef(params)?.parentConversationId;
}

export function resolveAcpCommandBindingContext(params: HandleCommandsParams): {
  channel: string;
  accountId: string;
  threadId?: string;
  conversationId?: string;
  parentConversationId?: string;
} {
  const conversationRef = resolveAcpCommandConversationRef(params);
  if (!conversationRef) {
    return {
      channel: resolveAcpCommandChannel(params),
      accountId: resolveAcpCommandAccountId(params),
      threadId: resolveAcpCommandThreadId(params),
    };
  }
  return {
    channel: resolveAcpCommandChannel(params),
    accountId: resolveAcpCommandAccountId(params),
    threadId: resolveAcpCommandThreadId(params),
    conversationId: conversationRef.conversationId,
    ...(conversationRef.parentConversationId
      ? { parentConversationId: conversationRef.parentConversationId }
      : {}),
  };
}
