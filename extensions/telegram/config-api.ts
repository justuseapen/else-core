<<<<<<< HEAD
export {
  buildChannelConfigSchema,
  TelegramConfigSchema,
} from "openclaw/plugin-sdk/channel-config-schema";
=======
// Telegram API module exposes the plugin public contract.
export {
  buildChannelConfigSchema,
  TelegramConfigSchema,
} from "openclaw/plugin-sdk/bundled-channel-config-schema";
>>>>>>> upstream/main
export {
  normalizeTelegramCommandDescription,
  normalizeTelegramCommandName,
  resolveTelegramCustomCommands,
} from "./src/command-config.js";
