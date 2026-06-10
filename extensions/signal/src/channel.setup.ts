<<<<<<< HEAD
import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import { type ResolvedSignalAccount } from "./accounts.js";
=======
// Signal plugin module implements channel.setup behavior.
import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import type { ResolvedSignalAccount } from "./accounts.js";
>>>>>>> upstream/main
import { signalSetupAdapter } from "./setup-core.js";
import { createSignalPluginBase, signalSetupWizard } from "./shared.js";

export const signalSetupPlugin: ChannelPlugin<ResolvedSignalAccount> = {
  ...createSignalPluginBase({
    setupWizard: signalSetupWizard,
    setup: signalSetupAdapter,
  }),
};
