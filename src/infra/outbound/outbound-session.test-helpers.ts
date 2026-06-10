<<<<<<< HEAD
import type { ChannelPlugin } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import {
  buildChannelOutboundSessionRoute,
=======
// Test helpers build minimal plugin registries for outbound session-route
// scenarios without importing real channel implementations.
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "@openclaw/normalization-core/string-coerce";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  buildChannelOutboundSessionRoute,
  buildThreadAwareOutboundSessionRoute,
>>>>>>> upstream/main
  stripChannelTargetPrefix,
  stripTargetKindPrefix,
  type ChannelOutboundSessionRouteParams,
} from "../../plugin-sdk/core.js";
import {
  buildOutboundBaseSessionKey,
  normalizeOutboundThreadId,
<<<<<<< HEAD
  resolveThreadSessionKeys,
=======
>>>>>>> upstream/main
  type RoutePeer,
} from "../../plugin-sdk/routing.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import {
  createChannelTestPluginBase,
  createTestRegistry,
} from "../../test-utils/channel-plugins.js";

<<<<<<< HEAD
=======
// Session route fixtures cover direct, group, and threaded outbound routes without real plugins.
>>>>>>> upstream/main
function createSessionRouteTestPlugin(params: {
  id: ChannelPlugin["id"];
  label: string;
  resolveOutboundSessionRoute: (
    params: ChannelOutboundSessionRouteParams,
  ) => Awaited<
    ReturnType<NonNullable<NonNullable<ChannelPlugin["messaging"]>["resolveOutboundSessionRoute"]>>
  >;
}): ChannelPlugin {
  return {
    ...createChannelTestPluginBase({
      id: params.id,
      label: params.label,
      capabilities: { chatTypes: ["direct", "group", "channel"] },
    }),
    messaging: {
      resolveOutboundSessionRoute: params.resolveOutboundSessionRoute,
    },
  };
}

function buildThreadedChannelRoute(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
  useSuffix?: boolean;
}) {
  const baseSessionKey = buildOutboundBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: params.channel,
    accountId: params.accountId,
    peer: params.peer,
  });
<<<<<<< HEAD
  const normalizedThreadId = normalizeOutboundThreadId(params.threadId);
  const threadKeys = resolveThreadSessionKeys({
    baseSessionKey,
    threadId: normalizedThreadId,
    useSuffix: params.useSuffix,
  });
  return {
    sessionKey: threadKeys.sessionKey,
    baseSessionKey,
    peer: params.peer,
    chatType: params.chatType,
    from: params.from,
    to: params.to,
    ...(normalizedThreadId !== undefined ? { threadId: params.threadId } : {}),
  };
}

function parseTelegramTargetForTest(raw: string): {
=======
  return buildThreadAwareOutboundSessionRoute({
    route: {
      sessionKey: baseSessionKey,
      baseSessionKey,
      peer: params.peer,
      chatType: params.chatType,
      from: params.from,
      to: params.to,
    },
    threadId: params.threadId,
    useSuffix: params.useSuffix,
    precedence: ["threadId", "replyToId", "currentSession"],
  });
}

function parseForumTargetForTest(raw: string): {
>>>>>>> upstream/main
  chatId: string;
  messageThreadId?: number;
  chatType: "direct" | "group" | "unknown";
} {
  const trimmed = raw
    .trim()
<<<<<<< HEAD
    .replace(/^telegram:/i, "")
    .replace(/^tg:/i, "")
=======
    .replace(/^forum:/i, "")
>>>>>>> upstream/main
    .replace(/^group:/i, "");
  const prefixedTopic = /^([^:]+):topic:(\d+)$/i.exec(trimmed);
  if (prefixedTopic) {
    const chatId = prefixedTopic[1];
    return {
      chatId,
      messageThreadId: Number.parseInt(prefixedTopic[2], 10),
      chatType: chatId.startsWith("-") ? "group" : "direct",
    };
  }
  return {
    chatId: trimmed,
    chatType: trimmed.startsWith("-") ? "group" : trimmed.startsWith("@") ? "unknown" : "direct",
  };
}

<<<<<<< HEAD
function parseTelegramThreadIdForTest(threadId?: string | number | null): number | undefined {
=======
function parseForumThreadIdForTest(threadId?: string | number | null): number | undefined {
>>>>>>> upstream/main
  const normalized = normalizeOutboundThreadId(threadId);
  if (!normalized) {
    return undefined;
  }
  const topicMatch = /(?:^|:topic:|:)(\d+)$/i.exec(normalized);
  if (!topicMatch) {
    return undefined;
  }
  return Number.parseInt(topicMatch[1], 10);
}

<<<<<<< HEAD
function buildTelegramGroupPeerIdForTest(chatId: string, messageThreadId?: number): string {
  return messageThreadId ? `${chatId}:topic:${messageThreadId}` : chatId;
}

function resolveTelegramOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const parsed = parseTelegramTargetForTest(params.target);
=======
function buildForumGroupPeerIdForTest(chatId: string, messageThreadId?: number): string {
  return messageThreadId ? `${chatId}:topic:${messageThreadId}` : chatId;
}

function resolveForumOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const parsed = parseForumTargetForTest(params.target);
>>>>>>> upstream/main
  const chatId = parsed.chatId.trim();
  if (!chatId) {
    return null;
  }
<<<<<<< HEAD
  const resolvedThreadId = parsed.messageThreadId ?? parseTelegramThreadIdForTest(params.threadId);
=======
  const resolvedThreadId = parsed.messageThreadId ?? parseForumThreadIdForTest(params.threadId);
>>>>>>> upstream/main
  const isGroup =
    parsed.chatType === "group" ||
    (parsed.chatType === "unknown" &&
      params.resolvedTarget?.kind !== undefined &&
      params.resolvedTarget.kind !== "user");
  const peerId =
<<<<<<< HEAD
    isGroup && resolvedThreadId
      ? buildTelegramGroupPeerIdForTest(chatId, resolvedThreadId)
      : chatId;
=======
    isGroup && resolvedThreadId ? buildForumGroupPeerIdForTest(chatId, resolvedThreadId) : chatId;
>>>>>>> upstream/main
  const peer: RoutePeer = {
    kind: isGroup ? "group" : "direct",
    id: peerId,
  };
  if (isGroup) {
    return buildChannelOutboundSessionRoute({
      cfg: params.cfg,
      agentId: params.agentId,
<<<<<<< HEAD
      channel: "telegram",
      accountId: params.accountId,
      peer,
      chatType: "group",
      from: `telegram:group:${peerId}`,
      to: `telegram:${chatId}`,
=======
      channel: "forum",
      accountId: params.accountId,
      peer,
      chatType: "group",
      from: `forum:group:${peerId}`,
      to: `forum:${chatId}`,
>>>>>>> upstream/main
      ...(resolvedThreadId !== undefined ? { threadId: resolvedThreadId } : {}),
    });
  }
  return buildThreadedChannelRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "telegram",
=======
    channel: "forum",
>>>>>>> upstream/main
    accountId: params.accountId,
    peer,
    chatType: "direct",
    from:
      resolvedThreadId !== undefined
<<<<<<< HEAD
        ? `telegram:${chatId}:topic:${resolvedThreadId}`
        : `telegram:${chatId}`,
    to: `telegram:${chatId}`,
=======
        ? `forum:${chatId}:topic:${resolvedThreadId}`
        : `forum:${chatId}`,
    to: `forum:${chatId}`,
>>>>>>> upstream/main
    threadId: resolvedThreadId,
  });
}

<<<<<<< HEAD
function resolveSlackOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
=======
function resolveWorkspaceOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
>>>>>>> upstream/main
  const trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
<<<<<<< HEAD
  const lower = trimmed.toLowerCase();
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "slack"));
  if (!rawId) {
    return null;
  }
  const normalizedId = rawId.toLowerCase();
  const isDm = lower.startsWith("user:") || lower.startsWith("slack:") || /^u/i.test(rawId);
  const isGroupChannel =
    /^g/i.test(rawId) &&
    params.cfg.channels?.slack?.dm?.groupChannels?.some(
      (candidate) => String(candidate).trim().toLowerCase() === normalizedId,
    ) === true;
=======
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "workspace"));
  if (!rawId) {
    return null;
  }
  const normalizedId = normalizeLowercaseStringOrEmpty(rawId);
  const isDm = lower.startsWith("user:") || lower.startsWith("workspace:") || /^u/i.test(rawId);
  const workspaceConfig = params.cfg.channels?.workspace as
    | { dm?: { groupChannels?: unknown[] } }
    | undefined;
  const isGroupChannel =
    /^g/i.test(rawId) &&
    Array.isArray(workspaceConfig?.dm?.groupChannels) &&
    workspaceConfig.dm.groupChannels.some(
      (candidate: unknown) => normalizeLowercaseStringOrEmpty(String(candidate)) === normalizedId,
    );
>>>>>>> upstream/main
  const peerKind: RoutePeer["kind"] = isDm ? "direct" : isGroupChannel ? "group" : "channel";
  return buildThreadedChannelRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "slack",
=======
    channel: "workspace",
>>>>>>> upstream/main
    accountId: params.accountId,
    peer: { kind: peerKind, id: normalizedId },
    chatType: peerKind === "direct" ? "direct" : peerKind === "group" ? "group" : "channel",
    from: isDm
<<<<<<< HEAD
      ? `slack:${rawId}`
      : isGroupChannel
        ? `slack:group:${rawId}`
        : `slack:channel:${rawId}`,
=======
      ? `workspace:${rawId}`
      : isGroupChannel
        ? `workspace:group:${rawId}`
        : `workspace:channel:${rawId}`,
>>>>>>> upstream/main
    to: isDm ? `user:${rawId}` : `channel:${rawId}`,
    threadId: params.replyToId ?? params.threadId ?? undefined,
  });
}

<<<<<<< HEAD
function resolveDiscordOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
=======
function resolveGuildChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
>>>>>>> upstream/main
  const trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
  const resolvedKind = params.resolvedTarget?.kind;
  let kind: "user" | "channel";
  if (resolvedKind === "user") {
    kind = "user";
  } else if (resolvedKind === "channel" || resolvedKind === "group") {
    kind = "channel";
<<<<<<< HEAD
  } else if (/^user:/i.test(trimmed) || /^discord:/i.test(trimmed) || /^<@!?/.test(trimmed)) {
=======
  } else if (/^user:/i.test(trimmed) || /^guildchat:/i.test(trimmed) || /^<@!?/.test(trimmed)) {
>>>>>>> upstream/main
    kind = "user";
  } else if (/^channel:/i.test(trimmed)) {
    kind = "channel";
  } else if (/^\d+$/u.test(trimmed)) {
<<<<<<< HEAD
    throw new Error("Ambiguous Discord recipient");
  } else {
    kind = "channel";
  }
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "discord"));
=======
    throw new Error("Ambiguous Guild Chat recipient");
  } else {
    kind = "channel";
  }
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "guildchat"));
>>>>>>> upstream/main
  if (!rawId) {
    return null;
  }
  const peer: RoutePeer = {
    kind: kind === "user" ? "direct" : "channel",
    id: rawId,
  };
  return buildThreadedChannelRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "discord",
    accountId: params.accountId,
    peer,
    chatType: kind === "user" ? "direct" : "channel",
    from: kind === "user" ? `discord:${rawId}` : `discord:channel:${rawId}`,
=======
    channel: "guildchat",
    accountId: params.accountId,
    peer,
    chatType: kind === "user" ? "direct" : "channel",
    from: kind === "user" ? `guildchat:${rawId}` : `guildchat:channel:${rawId}`,
>>>>>>> upstream/main
    to: kind === "user" ? `user:${rawId}` : `channel:${rawId}`,
    threadId: params.threadId ?? undefined,
    useSuffix: false,
  });
}

<<<<<<< HEAD
function resolveMattermostOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
=======
function resolveBoardChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
>>>>>>> upstream/main
  const trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
  const isUser = params.resolvedTarget?.kind === "user" || /^user:/i.test(trimmed);
<<<<<<< HEAD
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "mattermost"));
=======
  const rawId = stripTargetKindPrefix(stripChannelTargetPrefix(trimmed, "boardchat"));
>>>>>>> upstream/main
  if (!rawId) {
    return null;
  }
  return buildThreadedChannelRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "mattermost",
    accountId: params.accountId,
    peer: { kind: isUser ? "direct" : "channel", id: rawId },
    chatType: isUser ? "direct" : "channel",
    from: isUser ? `mattermost:${rawId}` : `mattermost:channel:${rawId}`,
=======
    channel: "boardchat",
    accountId: params.accountId,
    peer: { kind: isUser ? "direct" : "channel", id: rawId },
    chatType: isUser ? "direct" : "channel",
    from: isUser ? `boardchat:${rawId}` : `boardchat:channel:${rawId}`,
>>>>>>> upstream/main
    to: isUser ? `user:${rawId}` : `channel:${rawId}`,
    threadId: params.replyToId ?? params.threadId ?? undefined,
  });
}

<<<<<<< HEAD
function resolveWhatsAppOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const normalized = stripChannelTargetPrefix(params.target, "whatsapp").trim().toLowerCase();
=======
function resolveMobileChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const normalized = normalizeOptionalLowercaseString(
    stripChannelTargetPrefix(params.target, "mobilechat"),
  );
>>>>>>> upstream/main
  if (!normalized) {
    return null;
  }
  const isGroup = normalized.endsWith("@g.us");
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "whatsapp",
=======
    channel: "mobilechat",
>>>>>>> upstream/main
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: normalized },
    chatType: isGroup ? "group" : "direct",
    from: normalized,
    to: normalized,
  });
}

function resolveMatrixOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const stripped = stripChannelTargetPrefix(params.target, "matrix");
  const isUser =
    params.resolvedTarget?.kind === "user" || stripped.startsWith("@") || /^user:/i.test(stripped);
  const rawId = stripTargetKindPrefix(stripped);
  if (!rawId) {
    return null;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "matrix",
    accountId: params.accountId,
    peer: { kind: isUser ? "direct" : "channel", id: rawId },
    chatType: isUser ? "direct" : "channel",
    from: isUser ? `matrix:${rawId}` : `matrix:channel:${rawId}`,
    to: `room:${rawId}`,
  });
}

<<<<<<< HEAD
function resolveMSTeamsOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const trimmed = stripChannelTargetPrefix(params.target, "msteams", "teams");
  if (!trimmed) {
    return null;
  }
  const lower = trimmed.toLowerCase();
=======
function resolveMeetingChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const trimmed = stripChannelTargetPrefix(params.target, "meetingchat", "meet");
  if (!trimmed) {
    return null;
  }
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  const rawId = stripTargetKindPrefix(trimmed);
  if (!rawId) {
    return null;
  }
  const conversationId = rawId.split(";")[0] ?? rawId;
  const isUser = lower.startsWith("user:");
  const isChannel = !isUser && /@thread\.tacv2/i.test(conversationId);
  const peerKind: RoutePeer["kind"] = isUser ? "direct" : isChannel ? "channel" : "group";
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "msteams",
=======
    channel: "meetingchat",
>>>>>>> upstream/main
    accountId: params.accountId,
    peer: { kind: peerKind, id: conversationId },
    chatType: peerKind,
    from: isUser
<<<<<<< HEAD
      ? `msteams:${conversationId}`
      : isChannel
        ? `msteams:channel:${conversationId}`
        : `msteams:group:${conversationId}`,
=======
      ? `meetingchat:${conversationId}`
      : isChannel
        ? `meetingchat:channel:${conversationId}`
        : `meetingchat:group:${conversationId}`,
>>>>>>> upstream/main
    to: isUser ? `user:${conversationId}` : `conversation:${conversationId}`,
  });
}

<<<<<<< HEAD
function resolveFeishuOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  let trimmed = stripChannelTargetPrefix(params.target, "feishu", "lark");
  if (!trimmed) {
    return null;
  }
  const lower = trimmed.toLowerCase();
=======
function resolveCollabChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  let trimmed = stripChannelTargetPrefix(params.target, "collabchat", "collab");
  if (!trimmed) {
    return null;
  }
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  let isGroup = false;
  if (lower.startsWith("group:") || lower.startsWith("chat:") || lower.startsWith("channel:")) {
    trimmed = trimmed.replace(/^(group|chat|channel):/i, "").trim();
    isGroup = true;
  } else if (lower.startsWith("user:") || lower.startsWith("dm:")) {
    trimmed = trimmed.replace(/^(user|dm):/i, "").trim();
<<<<<<< HEAD
  } else if (!trimmed.toLowerCase().startsWith("ou_") && !trimmed.toLowerCase().startsWith("on_")) {
=======
  } else if (
    !normalizeLowercaseStringOrEmpty(trimmed).startsWith("ou_") &&
    !normalizeLowercaseStringOrEmpty(trimmed).startsWith("on_")
  ) {
>>>>>>> upstream/main
    isGroup = false;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "feishu",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: trimmed },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `feishu:group:${trimmed}` : `feishu:${trimmed}`,
=======
    channel: "collabchat",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: trimmed },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `collabchat:group:${trimmed}` : `collabchat:${trimmed}`,
>>>>>>> upstream/main
    to: trimmed,
  });
}

function resolveNextcloudTalkOutboundSessionRouteForTest(
  params: ChannelOutboundSessionRouteParams,
) {
  const roomId = stripTargetKindPrefix(
    stripChannelTargetPrefix(params.target, "nextcloud-talk", "nc-talk", "nc"),
  );
  if (!roomId) {
    return null;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "nextcloud-talk",
    accountId: params.accountId,
    peer: { kind: "group", id: roomId },
    chatType: "group",
    from: `nextcloud-talk:room:${roomId}`,
    to: `nextcloud-talk:${roomId}`,
  });
}

<<<<<<< HEAD
function resolveBlueBubblesOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const stripped = stripChannelTargetPrefix(params.target, "bluebubbles");
=======
function resolveLocalChatOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const stripped = stripChannelTargetPrefix(params.target, "localchat");
>>>>>>> upstream/main
  if (!stripped) {
    return null;
  }
  const match = /^(chat_guid|chat_identifier|chat_id):(.+)$/i.exec(stripped);
  const rawId = match ? match[2].trim() : stripped.trim();
  if (!rawId) {
    return null;
  }
<<<<<<< HEAD
  const normalizedId = rawId.toLowerCase();
=======
  const normalizedId = normalizeLowercaseStringOrEmpty(rawId);
>>>>>>> upstream/main
  const isGroup = match !== null;
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
<<<<<<< HEAD
    channel: "bluebubbles",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: normalizedId },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `group:${rawId}` : `bluebubbles:${rawId}`,
    to: `bluebubbles:${stripped}`,
=======
    channel: "localchat",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: normalizedId },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `group:${rawId}` : `localchat:${rawId}`,
    to: `localchat:${stripped}`,
>>>>>>> upstream/main
  });
}

function resolveZaloOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const trimmed = stripChannelTargetPrefix(params.target, "zalo", "zl");
  if (!trimmed) {
    return null;
  }
<<<<<<< HEAD
  const isGroup = trimmed.toLowerCase().startsWith("group:");
=======
  const isGroup = normalizeLowercaseStringOrEmpty(trimmed).startsWith("group:");
>>>>>>> upstream/main
  const peerId = stripTargetKindPrefix(trimmed);
  if (!peerId) {
    return null;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "zalo",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: peerId },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `zalo:group:${peerId}` : `zalo:${peerId}`,
    to: `zalo:${peerId}`,
  });
}

function resolveZalouserOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const trimmed = stripChannelTargetPrefix(params.target, "zalouser", "zlu");
  if (!trimmed) {
    return null;
  }
<<<<<<< HEAD
  const lower = trimmed.toLowerCase();
=======
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  const isGroup = lower.startsWith("group:") || lower.startsWith("g:");
  const peerId = trimmed.replace(/^(group|user|g|u|dm):/i, "").trim();
  if (!peerId) {
    return null;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "zalouser",
    accountId: params.accountId,
    peer: { kind: isGroup ? "group" : "direct", id: peerId },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `zalouser:group:${peerId}` : `zalouser:${peerId}`,
    to: `zalouser:${peerId}`,
  });
}

function resolveNostrOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const target = stripChannelTargetPrefix(params.target, "nostr");
  if (!target) {
    return null;
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "nostr",
    accountId: params.accountId,
    peer: { kind: "direct", id: target },
    chatType: "direct",
    from: `nostr:${target}`,
    to: `nostr:${target}`,
  });
}

function resolveTlonOutboundSessionRouteForTest(params: ChannelOutboundSessionRouteParams) {
  const trimmed = stripChannelTargetPrefix(params.target, "tlon").trim();
  if (!trimmed) {
    return null;
  }
<<<<<<< HEAD
  const lower = trimmed.toLowerCase();
=======
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  if (lower.startsWith("group:")) {
    const nest = `chat/${trimmed.slice("group:".length).trim()}`;
    return buildChannelOutboundSessionRoute({
      cfg: params.cfg,
      agentId: params.agentId,
      channel: "tlon",
      accountId: params.accountId,
      peer: { kind: "group", id: nest },
      chatType: "group",
      from: `tlon:group:${nest}`,
      to: `tlon:${nest}`,
    });
  }
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "tlon",
    accountId: params.accountId,
    peer: { kind: "direct", id: trimmed },
    chatType: "direct",
    from: `tlon:${trimmed}`,
    to: `tlon:${trimmed}`,
  });
}

<<<<<<< HEAD
export function setMinimalOutboundSessionPluginRegistryForTests(): void {
  const plugins: ChannelPlugin[] = [
    createSessionRouteTestPlugin({
      id: "whatsapp",
      label: "WhatsApp",
      resolveOutboundSessionRoute: resolveWhatsAppOutboundSessionRouteForTest,
=======
/** Installs a minimal channel registry for outbound session route tests. */
export function setMinimalOutboundSessionPluginRegistryForTests(): void {
  const plugins: ChannelPlugin[] = [
    createSessionRouteTestPlugin({
      id: "mobilechat",
      label: "Mobile Chat",
      resolveOutboundSessionRoute: resolveMobileChatOutboundSessionRouteForTest,
>>>>>>> upstream/main
    }),
    createSessionRouteTestPlugin({
      id: "matrix",
      label: "Matrix",
      resolveOutboundSessionRoute: resolveMatrixOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
<<<<<<< HEAD
      id: "msteams",
      label: "Microsoft Teams",
      resolveOutboundSessionRoute: resolveMSTeamsOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "slack",
      label: "Slack",
      resolveOutboundSessionRoute: resolveSlackOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "telegram",
      label: "Telegram",
      resolveOutboundSessionRoute: resolveTelegramOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "discord",
      label: "Discord",
      resolveOutboundSessionRoute: resolveDiscordOutboundSessionRouteForTest,
=======
      id: "meetingchat",
      label: "Meeting Chat",
      resolveOutboundSessionRoute: resolveMeetingChatOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "workspace",
      label: "Workspace",
      resolveOutboundSessionRoute: resolveWorkspaceOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "forum",
      label: "Forum",
      resolveOutboundSessionRoute: resolveForumOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "guildchat",
      label: "Guild Chat",
      resolveOutboundSessionRoute: resolveGuildChatOutboundSessionRouteForTest,
>>>>>>> upstream/main
    }),
    createSessionRouteTestPlugin({
      id: "nextcloud-talk",
      label: "Nextcloud Talk",
      resolveOutboundSessionRoute: resolveNextcloudTalkOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
<<<<<<< HEAD
      id: "bluebubbles",
      label: "BlueBubbles",
      resolveOutboundSessionRoute: resolveBlueBubblesOutboundSessionRouteForTest,
=======
      id: "localchat",
      label: "Local Chat",
      resolveOutboundSessionRoute: resolveLocalChatOutboundSessionRouteForTest,
>>>>>>> upstream/main
    }),
    createSessionRouteTestPlugin({
      id: "zalo",
      label: "Zalo",
      resolveOutboundSessionRoute: resolveZaloOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "zalouser",
      label: "Zalo Personal",
      resolveOutboundSessionRoute: resolveZalouserOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "nostr",
      label: "Nostr",
      resolveOutboundSessionRoute: resolveNostrOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "tlon",
      label: "Tlon",
      resolveOutboundSessionRoute: resolveTlonOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
<<<<<<< HEAD
      id: "feishu",
      label: "Feishu",
      resolveOutboundSessionRoute: resolveFeishuOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "mattermost",
      label: "Mattermost",
      resolveOutboundSessionRoute: resolveMattermostOutboundSessionRouteForTest,
    }),
=======
      id: "collabchat",
      label: "Collab Chat",
      resolveOutboundSessionRoute: resolveCollabChatOutboundSessionRouteForTest,
    }),
    createSessionRouteTestPlugin({
      id: "boardchat",
      label: "Board Chat",
      resolveOutboundSessionRoute: resolveBoardChatOutboundSessionRouteForTest,
    }),
    {
      ...createChannelTestPluginBase({
        id: "fallbackchat",
        label: "Fallback Chat",
        capabilities: { chatTypes: ["direct", "group", "channel"] },
      }),
      messaging: {
        inferTargetChatType: ({ to }) => (to.startsWith("spaces/") ? "group" : undefined),
        targetPrefixes: ["fallbackchat"],
      },
    },
    {
      ...createChannelTestPluginBase({
        id: "legacyparser",
        label: "Legacy Parser",
        capabilities: { chatTypes: ["direct", "group", "channel"] },
      }),
      messaging: {
        parseExplicitTarget: ({ raw }) =>
          raw === "team-ops" ? { to: raw, chatType: "group" } : null,
      },
    },
>>>>>>> upstream/main
  ];
  setActivePluginRegistry(
    createTestRegistry(
      plugins.map((plugin) => ({
        pluginId: plugin.id,
        plugin,
        source: "test",
      })),
    ),
  );
}
