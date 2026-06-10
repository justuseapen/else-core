<<<<<<< HEAD
import { createChannelReplyPipeline } from "openclaw/plugin-sdk/channel-reply-pipeline";
import { deliverReplies, emitTelegramMessageSentHooks } from "./bot/delivery.js";

export { createChannelReplyPipeline, deliverReplies, emitTelegramMessageSentHooks };
=======
// Telegram plugin module implements bot native commandselivery behavior.
import { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
import { deliverReplies, emitTelegramMessageSentHooks } from "./bot/delivery.js";

export { createChannelMessageReplyPipeline, deliverReplies, emitTelegramMessageSentHooks };
>>>>>>> upstream/main
