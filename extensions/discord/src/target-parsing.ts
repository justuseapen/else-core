<<<<<<< HEAD
=======
// Discord plugin module implements target parsing behavior.
>>>>>>> upstream/main
import {
  buildMessagingTarget,
  parseMentionPrefixOrAtUserTarget,
  requireTargetKind,
  type MessagingTarget,
  type MessagingTargetKind,
  type MessagingTargetParseOptions,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/messaging-targets";
=======
} from "openclaw/plugin-sdk/channel-targets";
>>>>>>> upstream/main

export type DiscordTargetKind = MessagingTargetKind;

export type DiscordTarget = MessagingTarget;

export type DiscordTargetParseOptions = MessagingTargetParseOptions;

export function parseDiscordTarget(
  raw: string,
  options: DiscordTargetParseOptions = {},
): DiscordTarget | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
<<<<<<< HEAD
=======
  const providerPrefixedTarget = parseDiscordProviderPrefixedTarget(trimmed);
  if (providerPrefixedTarget) {
    return providerPrefixedTarget;
  }
>>>>>>> upstream/main
  const userTarget = parseMentionPrefixOrAtUserTarget({
    raw: trimmed,
    mentionPattern: /^<@!?(\d+)>$/,
    prefixes: [
      { prefix: "user:", kind: "user" },
      { prefix: "channel:", kind: "channel" },
      { prefix: "discord:", kind: "user" },
    ],
    atUserPattern: /^\d+$/,
    atUserErrorMessage: "Discord DMs require a user id (use user:<id> or a <@id> mention)",
  });
  if (userTarget) {
    return userTarget;
  }
  if (/^\d+$/.test(trimmed)) {
    if (options.defaultKind) {
      return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
    }
    throw new Error(
      options.ambiguousMessage ??
<<<<<<< HEAD
        `Ambiguous Discord recipient "${trimmed}". Use "user:${trimmed}" for DMs or "channel:${trimmed}" for channel messages.`,
=======
        `Ambiguous Discord recipient "${trimmed}". For DMs use "user:${trimmed}" or "<@${trimmed}>"; for channels use "channel:${trimmed}".`,
>>>>>>> upstream/main
    );
  }
  return buildMessagingTarget("channel", trimmed, trimmed);
}

<<<<<<< HEAD
=======
function parseDiscordProviderPrefixedTarget(raw: string): DiscordTarget | undefined {
  const match = /^discord:(channel|user):(.+)$/i.exec(raw);
  if (!match) {
    return undefined;
  }
  const kind = match[1]?.toLowerCase() as "channel" | "user" | undefined;
  const id = match[2]?.trim();
  if (!kind || !id) {
    return undefined;
  }
  return buildMessagingTarget(kind, id, `${kind}:${id}`);
}

>>>>>>> upstream/main
export function resolveDiscordChannelId(raw: string): string {
  const target = parseDiscordTarget(raw, { defaultKind: "channel" });
  return requireTargetKind({ platform: "Discord", target, kind: "channel" });
}
