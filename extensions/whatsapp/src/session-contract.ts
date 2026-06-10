<<<<<<< HEAD
=======
// Whatsapp plugin module implements session contract behavior.
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

>>>>>>> upstream/main
function extractLegacyWhatsAppGroupId(key: string): string | null {
  const trimmed = key.trim();
  if (!trimmed) {
    return null;
  }
<<<<<<< HEAD
  const lower = trimmed.toLowerCase();
  if (trimmed.startsWith("group:")) {
    const id = trimmed.slice("group:".length).trim();
    return id.toLowerCase().includes("@g.us") ? id : null;
=======
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  if (trimmed.startsWith("group:")) {
    const id = trimmed.slice("group:".length).trim();
    return normalizeLowercaseStringOrEmpty(id).includes("@g.us") ? id : null;
>>>>>>> upstream/main
  }
  if (!lower.includes("@g.us")) {
    return null;
  }
  if (!trimmed.includes(":")) {
    return trimmed;
  }
  if (lower.startsWith("whatsapp:") && !trimmed.includes(":group:")) {
    const remainder = trimmed.slice("whatsapp:".length).trim();
    const cleaned = remainder.replace(/^group:/i, "").trim();
    return cleaned || null;
  }
  return null;
}

export function isLegacyGroupSessionKey(key: string): boolean {
  return extractLegacyWhatsAppGroupId(key) !== null;
}

<<<<<<< HEAD
=======
export function deriveLegacySessionChatType(key: string): "group" | undefined {
  return isLegacyGroupSessionKey(key) ? "group" : undefined;
}

>>>>>>> upstream/main
export function canonicalizeLegacySessionKey(params: {
  key: string;
  agentId: string;
}): string | null {
  const legacyGroupId = extractLegacyWhatsAppGroupId(params.key);
  return legacyGroupId
<<<<<<< HEAD
    ? `agent:${params.agentId}:whatsapp:group:${legacyGroupId}`.toLowerCase()
=======
    ? `agent:${normalizeLowercaseStringOrEmpty(params.agentId)}:whatsapp:group:${normalizeLowercaseStringOrEmpty(legacyGroupId)}`
>>>>>>> upstream/main
    : null;
}
