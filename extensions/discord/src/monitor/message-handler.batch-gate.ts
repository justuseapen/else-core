<<<<<<< HEAD
import type { ReplyToMode } from "openclaw/plugin-sdk/config-runtime";
=======
// Discord plugin module implements message handler.batch gate behavior.
import type { ReplyToMode } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
import type { ReplyThreadingPolicy } from "openclaw/plugin-sdk/reply-reference";
import { resolveBatchedReplyThreadingPolicy } from "openclaw/plugin-sdk/reply-reference";

type ReplyThreadingContext = {
  ReplyThreading?: ReplyThreadingPolicy;
};

<<<<<<< HEAD
export function applyImplicitReplyBatchGate<T extends object>(
  ctx: T,
=======
export function applyImplicitReplyBatchGate(
  ctx: object,
>>>>>>> upstream/main
  replyToMode: ReplyToMode,
  isBatched: boolean,
) {
  const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, isBatched);
  if (!replyThreading) {
    return;
  }
<<<<<<< HEAD
  (ctx as T & ReplyThreadingContext).ReplyThreading = replyThreading;
=======
  (ctx as ReplyThreadingContext).ReplyThreading = replyThreading;
>>>>>>> upstream/main
}
