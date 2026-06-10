<<<<<<< HEAD
import { sanitizeTextContent } from "../../agents/tools/chat-history-text.js";
import { extractTextFromChatContent } from "../../shared/chat-content.js";

=======
/** Text extraction helpers for subagent command output. */
import { sanitizeTextContent } from "../../agents/tools/chat-history-text.js";
import { extractTextFromChatContent } from "../../shared/chat-content.js";

/** Minimal chat message shape used by subagent text extraction. */
>>>>>>> upstream/main
export type ChatMessage = {
  role?: unknown;
  content?: unknown;
};

<<<<<<< HEAD
=======
/** Extracts sanitized display text from a subagent chat message. */
>>>>>>> upstream/main
export function extractMessageText(message: ChatMessage): { role: string; text: string } | null {
  const role = typeof message.role === "string" ? message.role : "";
  const shouldSanitize = role === "assistant";
  const text = extractTextFromChatContent(message.content, {
    sanitizeText: shouldSanitize ? sanitizeTextContent : undefined,
  });
  return text ? { role, text } : null;
}
