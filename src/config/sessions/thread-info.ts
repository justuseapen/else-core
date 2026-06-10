<<<<<<< HEAD
import { resolveSessionThreadInfo } from "../../channels/plugins/session-conversation.js";
=======
// Thread-info helpers delegate generic and loaded plugin-owned thread key parsing.
import { resolveSessionThreadInfo } from "../../channels/plugins/session-conversation.js";
import { resolveLoadedSessionThreadInfo } from "../../channels/plugins/session-thread-info-loaded.js";
>>>>>>> upstream/main

/**
 * Extract deliveryContext and threadId from a sessionKey.
 * Supports generic :thread: suffixes plus plugin-owned thread/session grammars.
 */
export function parseSessionThreadInfo(sessionKey: string | undefined): {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
} {
  return resolveSessionThreadInfo(sessionKey);
}
<<<<<<< HEAD
=======

export function parseSessionThreadInfoFast(sessionKey: string | undefined): {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
} {
  return resolveLoadedSessionThreadInfo(sessionKey);
}
>>>>>>> upstream/main
