<<<<<<< HEAD
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
=======
// Imessage helper module supports normalize behavior.
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main

const SERVICE_PREFIXES = ["imessage:", "sms:", "auto:"] as const;
const CHAT_TARGET_PREFIX_RE =
  /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;

<<<<<<< HEAD
function trimMessagingTarget(raw: string): string | undefined {
  const trimmed = raw.trim();
  return trimmed || undefined;
}

=======
>>>>>>> upstream/main
function looksLikeHandleOrPhoneTarget(params: {
  raw: string;
  prefixPattern: RegExp;
  phonePattern?: RegExp;
}): boolean {
  const trimmed = params.raw.trim();
  if (!trimmed) {
    return false;
  }
  if (params.prefixPattern.test(trimmed)) {
    return true;
  }
  if (trimmed.includes("@")) {
    return true;
  }
  return (params.phonePattern ?? /^\+?\d{3,}$/).test(trimmed);
}

<<<<<<< HEAD
export function normalizeIMessageHandle(raw: string): string {
=======
function normalizeIMessageHandle(raw: string): string {
>>>>>>> upstream/main
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
<<<<<<< HEAD
  const lowered = trimmed.toLowerCase();
=======
  const lowered = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  if (lowered.startsWith("imessage:")) {
    return normalizeIMessageHandle(trimmed.slice("imessage:".length));
  }
  if (lowered.startsWith("sms:")) {
    return normalizeIMessageHandle(trimmed.slice("sms:".length));
  }
  if (lowered.startsWith("auto:")) {
    return normalizeIMessageHandle(trimmed.slice("auto:".length));
  }
  if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
    const prefix = trimmed.match(CHAT_TARGET_PREFIX_RE)?.[0];
    if (!prefix) {
      return "";
    }
    const value = trimmed.slice(prefix.length).trim();
<<<<<<< HEAD
    return `${prefix.toLowerCase()}${value}`;
  }
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
=======
    return `${normalizeLowercaseStringOrEmpty(prefix)}${value}`;
  }
  if (trimmed.includes("@")) {
    return normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  }
  const normalized = normalizeE164(trimmed);
  if (normalized) {
    return normalized;
  }
  return trimmed.replace(/\s+/g, "");
}

export function normalizeIMessageMessagingTarget(raw: string): string | undefined {
<<<<<<< HEAD
  const trimmed = trimMessagingTarget(raw);
=======
  const trimmed = normalizeOptionalString(raw);
>>>>>>> upstream/main
  if (!trimmed) {
    return undefined;
  }

<<<<<<< HEAD
  const lower = trimmed.toLowerCase();
=======
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
>>>>>>> upstream/main
  for (const prefix of SERVICE_PREFIXES) {
    if (lower.startsWith(prefix)) {
      const remainder = trimmed.slice(prefix.length).trim();
      const normalizedHandle = normalizeIMessageHandle(remainder);
      if (!normalizedHandle) {
        return undefined;
      }
      if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) {
        return normalizedHandle;
      }
      return `${prefix}${normalizedHandle}`;
    }
  }

  const normalized = normalizeIMessageHandle(trimmed);
  return normalized || undefined;
}

export function looksLikeIMessageTargetId(raw: string): boolean {
<<<<<<< HEAD
  const trimmed = trimMessagingTarget(raw);
=======
  const trimmed = normalizeOptionalString(raw);
>>>>>>> upstream/main
  if (!trimmed) {
    return false;
  }
  if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
    return true;
  }
  return looksLikeHandleOrPhoneTarget({
    raw: trimmed,
    prefixPattern: /^(imessage:|sms:|auto:)/i,
  });
}
