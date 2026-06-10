<<<<<<< HEAD
import { buildChannelConfigSchema, GoogleChatConfigSchema } from "openclaw/plugin-sdk/googlechat";
=======
// Googlechat helper module supports config schema behavior.
import { buildChannelConfigSchema, GoogleChatConfigSchema } from "../config-api.js";
>>>>>>> upstream/main

export const GoogleChatChannelConfigSchema = buildChannelConfigSchema(GoogleChatConfigSchema);
