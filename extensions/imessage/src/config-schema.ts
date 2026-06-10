<<<<<<< HEAD
=======
// Imessage helper module supports config schema behavior.
>>>>>>> upstream/main
import { buildChannelConfigSchema, IMessageConfigSchema } from "../config-api.js";
import { iMessageChannelConfigUiHints } from "./config-ui-hints.js";

export const IMessageChannelConfigSchema = buildChannelConfigSchema(IMessageConfigSchema, {
  uiHints: iMessageChannelConfigUiHints,
});
