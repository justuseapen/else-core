<<<<<<< HEAD
=======
// Whatsapp plugin module implements command policy behavior.
>>>>>>> upstream/main
import type { ChannelPlugin } from "openclaw/plugin-sdk/core";

export const whatsappCommandPolicy: NonNullable<ChannelPlugin["commands"]> = {
  enforceOwnerForCommands: true,
  preferSenderE164ForCommands: true,
  skipWhenConfigEmpty: true,
};
