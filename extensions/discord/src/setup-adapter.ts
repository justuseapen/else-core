<<<<<<< HEAD
import { createEnvPatchedAccountSetupAdapter } from "openclaw/plugin-sdk/setup-adapter-runtime";
import type { ChannelSetupAdapter } from "openclaw/plugin-sdk/setup-runtime";
=======
// Discord plugin module implements setup adapter behavior.
import {
  createEnvPatchedAccountSetupAdapter,
  type ChannelSetupAdapter,
} from "openclaw/plugin-sdk/setup-runtime";
>>>>>>> upstream/main

const channel = "discord" as const;

export const discordSetupAdapter: ChannelSetupAdapter = createEnvPatchedAccountSetupAdapter({
  channelKey: channel,
  defaultAccountOnlyEnvError: "DISCORD_BOT_TOKEN can only be used for the default account.",
  missingCredentialError: "Discord requires token (or --use-env).",
  hasCredentials: (input) => Boolean(input.token),
  buildPatch: (input) => (input.token ? { token: input.token } : {}),
});
