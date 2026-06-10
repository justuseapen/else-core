<<<<<<< HEAD
export * from "openclaw/plugin-sdk/text-runtime";
=======
// Whatsapp plugin module implements text runtime behavior.
export {
  convertMarkdownTables,
  sanitizeAssistantVisibleText,
  sanitizeAssistantVisibleTextWithProfile,
  stripToolCallXmlTags,
} from "openclaw/plugin-sdk/text-chunking";
export { normalizeE164, resolveUserPath, sleep } from "openclaw/plugin-sdk/text-utility-runtime";
>>>>>>> upstream/main
export {
  assertWebChannel,
  isSelfChatMode,
  jidToE164,
  markdownToWhatsApp,
  resolveJidToE164,
  toWhatsappJid,
<<<<<<< HEAD
=======
  toWhatsappJidWithLid,
>>>>>>> upstream/main
  type JidToE164Options,
  type WebChannel,
} from "./targets-runtime.js";
