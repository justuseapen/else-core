<<<<<<< HEAD
=======
// Whatsapp plugin module implements group session contract behavior.
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

>>>>>>> upstream/main
export function resolveLegacyGroupSessionKey(ctx: { From?: string }): {
  key: string;
  channel: string;
  id: string;
  chatType: "group";
} | null {
  const from = typeof ctx.From === "string" ? ctx.From.trim() : "";
<<<<<<< HEAD
  if (!from || from.includes(":") || !from.toLowerCase().endsWith("@g.us")) {
    return null;
  }
  const normalized = from.toLowerCase();
=======
  const normalized = normalizeLowercaseStringOrEmpty(from);
  if (!from || from.includes(":") || !normalized.endsWith("@g.us")) {
    return null;
  }
>>>>>>> upstream/main
  return {
    key: `whatsapp:group:${normalized}`,
    channel: "whatsapp",
    id: normalized,
    chatType: "group",
  };
}
