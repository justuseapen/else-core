<<<<<<< HEAD
export type ServicePrefix<TService extends string> = { prefix: string; service: TService };

=======
/**
 * Chat target prefix parsers.
 *
 * Parses service-qualified chat ids, guids, identifiers, and sender allowlist targets.
 */
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { normalizeStringEntries } from "@openclaw/normalization-core/string-normalization";
import { parseStrictInteger } from "../../infra/parse-finite-number.js";

/**
 * Prefix mapping for service-qualified target strings.
 */
export type ServicePrefix<TService extends string> = { prefix: string; service: TService };

/**
 * Normalized input used by chat target prefix parsers.
 */
>>>>>>> upstream/main
export type ChatTargetPrefixesParams = {
  trimmed: string;
  lower: string;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
};

<<<<<<< HEAD
=======
/**
 * Parsed conversation target forms accepted by channel allowlists and target resolvers.
 */
>>>>>>> upstream/main
export type ParsedChatTarget =
  | { kind: "chat_id"; chatId: number }
  | { kind: "chat_guid"; chatGuid: string }
  | { kind: "chat_identifier"; chatIdentifier: string };

<<<<<<< HEAD
export type ParsedChatAllowTarget = ParsedChatTarget | { kind: "handle"; handle: string };

=======
/**
 * Parsed allowlist target, including sender handles.
 */
export type ParsedChatAllowTarget = ParsedChatTarget | { kind: "handle"; handle: string };

/**
 * Sender metadata used for chat-aware allowlist checks.
 */
>>>>>>> upstream/main
export type ChatSenderAllowParams = {
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
<<<<<<< HEAD
};

function isAllowedParsedChatSender<TParsed extends ParsedChatAllowTarget>(params: {
=======
  allowConversationTargets?: boolean | null;
};

/**
 * Checks whether a sender or current conversation matches an allowlist entry.
 */
export function isAllowedParsedChatSender(params: {
>>>>>>> upstream/main
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
<<<<<<< HEAD
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => TParsed;
}): boolean {
  const allowFrom = params.allowFrom.map((entry) => String(entry).trim());
=======
  allowConversationTargets?: boolean | null;
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
}): boolean {
  const allowFrom = normalizeStringEntries(params.allowFrom);
>>>>>>> upstream/main
  if (allowFrom.length === 0) {
    return false;
  }
  if (allowFrom.includes("*")) {
    return true;
  }

  const senderNormalized = params.normalizeSender(params.sender);
<<<<<<< HEAD
  const chatId = params.chatId ?? undefined;
  const chatGuid = params.chatGuid?.trim();
  const chatIdentifier = params.chatIdentifier?.trim();
=======
  const allowConversationTargets = params.allowConversationTargets === true;
  // Conversation ids are only considered when the channel opts in; otherwise
  // allowlists stay sender-handle based for compatibility with older configs.
  const chatId = allowConversationTargets ? (params.chatId ?? undefined) : undefined;
  const chatGuid = allowConversationTargets ? normalizeOptionalString(params.chatGuid) : undefined;
  const chatIdentifier = allowConversationTargets
    ? normalizeOptionalString(params.chatIdentifier)
    : undefined;
>>>>>>> upstream/main

  for (const entry of allowFrom) {
    if (!entry) {
      continue;
    }
    const parsed = params.parseAllowTarget(entry);
    if (parsed.kind === "chat_id" && chatId !== undefined) {
      if (parsed.chatId === chatId) {
        return true;
      }
    } else if (parsed.kind === "chat_guid" && chatGuid) {
      if (parsed.chatGuid === chatGuid) {
        return true;
      }
    } else if (parsed.kind === "chat_identifier" && chatIdentifier) {
      if (parsed.chatIdentifier === chatIdentifier) {
        return true;
      }
    } else if (parsed.kind === "handle" && senderNormalized) {
      if (parsed.handle === senderNormalized) {
        return true;
      }
    }
  }
  return false;
}

function stripPrefix(value: string, prefix: string): string {
  return value.slice(prefix.length).trim();
}

function startsWithAnyPrefix(value: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => value.startsWith(prefix));
}

<<<<<<< HEAD
=======
/**
 * Resolves service-prefixed handle targets, delegating chat-shaped remainders.
 */
>>>>>>> upstream/main
export function resolveServicePrefixedTarget<TService extends string, TTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<ServicePrefix<TService>>;
  isChatTarget: (remainderLower: string) => boolean;
  parseTarget: (remainder: string) => TTarget;
}): ({ kind: "handle"; to: string; service: TService } | TTarget) | null {
  for (const { prefix, service } of params.servicePrefixes) {
    if (!params.lower.startsWith(prefix)) {
      continue;
    }
    const remainder = stripPrefix(params.trimmed, prefix);
    if (!remainder) {
      throw new Error(`${prefix} target is required`);
    }
<<<<<<< HEAD
    const remainderLower = remainder.toLowerCase();
=======
    const remainderLower = normalizeLowercaseStringOrEmpty(remainder);
>>>>>>> upstream/main
    if (params.isChatTarget(remainderLower)) {
      return params.parseTarget(remainder);
    }
    return { kind: "handle", to: remainder, service };
  }
  return null;
}

<<<<<<< HEAD
=======
/**
 * Resolves service-prefixed targets where chat ids should bypass handle parsing.
 */
>>>>>>> upstream/main
export function resolveServicePrefixedChatTarget<TService extends string, TTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<ServicePrefix<TService>>;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
  extraChatPrefixes?: string[];
  parseTarget: (remainder: string) => TTarget;
}): ({ kind: "handle"; to: string; service: TService } | TTarget) | null {
  const chatPrefixes = [
    ...params.chatIdPrefixes,
    ...params.chatGuidPrefixes,
    ...params.chatIdentifierPrefixes,
    ...(params.extraChatPrefixes ?? []),
  ];
  return resolveServicePrefixedTarget({
    trimmed: params.trimmed,
    lower: params.lower,
    servicePrefixes: params.servicePrefixes,
    isChatTarget: (remainderLower) => startsWithAnyPrefix(remainderLower, chatPrefixes),
    parseTarget: params.parseTarget,
  });
}

<<<<<<< HEAD
=======
/**
 * Parses chat target prefixes and throws for malformed prefixed values.
 */
>>>>>>> upstream/main
export function parseChatTargetPrefixesOrThrow(
  params: ChatTargetPrefixesParams,
): ParsedChatTarget | null {
  for (const prefix of params.chatIdPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
<<<<<<< HEAD
      const chatId = Number.parseInt(value, 10);
      if (!Number.isFinite(chatId)) {
=======
      const chatId = parseStrictInteger(value);
      if (chatId === undefined) {
>>>>>>> upstream/main
        throw new Error(`Invalid chat_id: ${value}`);
      }
      return { kind: "chat_id", chatId };
    }
  }

  for (const prefix of params.chatGuidPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (!value) {
        throw new Error("chat_guid is required");
      }
      return { kind: "chat_guid", chatGuid: value };
    }
  }

  for (const prefix of params.chatIdentifierPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (!value) {
        throw new Error("chat_identifier is required");
      }
      return { kind: "chat_identifier", chatIdentifier: value };
    }
  }

  return null;
}

<<<<<<< HEAD
=======
/**
 * Resolves service-prefixed allowlist targets.
 */
>>>>>>> upstream/main
export function resolveServicePrefixedAllowTarget<TAllowTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<{ prefix: string }>;
  parseAllowTarget: (remainder: string) => TAllowTarget;
}): (TAllowTarget | { kind: "handle"; handle: string }) | null {
  for (const { prefix } of params.servicePrefixes) {
    if (!params.lower.startsWith(prefix)) {
      continue;
    }
    const remainder = stripPrefix(params.trimmed, prefix);
    if (!remainder) {
      return { kind: "handle", handle: "" };
    }
    return params.parseAllowTarget(remainder);
  }
  return null;
}

<<<<<<< HEAD
=======
/**
 * Resolves service-prefixed allow targets before falling back to chat prefixes.
 */
>>>>>>> upstream/main
export function resolveServicePrefixedOrChatAllowTarget<
  TAllowTarget extends ParsedChatAllowTarget,
>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<{ prefix: string }>;
  parseAllowTarget: (remainder: string) => TAllowTarget;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
}): TAllowTarget | null {
  const servicePrefixed = resolveServicePrefixedAllowTarget({
    trimmed: params.trimmed,
    lower: params.lower,
    servicePrefixes: params.servicePrefixes,
    parseAllowTarget: params.parseAllowTarget,
  });
  if (servicePrefixed) {
    return servicePrefixed as TAllowTarget;
  }

  const chatTarget = parseChatAllowTargetPrefixes({
    trimmed: params.trimmed,
    lower: params.lower,
    chatIdPrefixes: params.chatIdPrefixes,
    chatGuidPrefixes: params.chatGuidPrefixes,
    chatIdentifierPrefixes: params.chatIdentifierPrefixes,
  });
  if (chatTarget) {
    return chatTarget as TAllowTarget;
  }
  return null;
}

<<<<<<< HEAD
export function createAllowedChatSenderMatcher<TParsed extends ParsedChatAllowTarget>(params: {
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => TParsed;
=======
/**
 * Creates a reusable sender matcher for chat-aware channel allowlists.
 */
export function createAllowedChatSenderMatcher(params: {
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
  allowConversationTargets?: boolean;
>>>>>>> upstream/main
}): (input: ChatSenderAllowParams) => boolean {
  return (input) =>
    isAllowedParsedChatSender({
      allowFrom: input.allowFrom,
      sender: input.sender,
      chatId: input.chatId,
      chatGuid: input.chatGuid,
      chatIdentifier: input.chatIdentifier,
<<<<<<< HEAD
=======
      allowConversationTargets:
        input.allowConversationTargets ?? params.allowConversationTargets ?? false,
>>>>>>> upstream/main
      normalizeSender: params.normalizeSender,
      parseAllowTarget: params.parseAllowTarget,
    });
}

<<<<<<< HEAD
=======
/**
 * Parses chat target prefixes for allowlist entries, ignoring malformed values.
 */
>>>>>>> upstream/main
export function parseChatAllowTargetPrefixes(
  params: ChatTargetPrefixesParams,
): ParsedChatTarget | null {
  for (const prefix of params.chatIdPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
<<<<<<< HEAD
      const chatId = Number.parseInt(value, 10);
      if (Number.isFinite(chatId)) {
=======
      const chatId = parseStrictInteger(value);
      if (chatId !== undefined) {
>>>>>>> upstream/main
        return { kind: "chat_id", chatId };
      }
    }
  }

  for (const prefix of params.chatGuidPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (value) {
        return { kind: "chat_guid", chatGuid: value };
      }
    }
  }

  for (const prefix of params.chatIdentifierPrefixes) {
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (value) {
        return { kind: "chat_identifier", chatIdentifier: value };
      }
    }
  }

  return null;
}
