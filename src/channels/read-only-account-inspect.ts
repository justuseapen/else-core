<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { getChannelPlugin } from "./plugins/registry.js";
import type { ChannelId } from "./plugins/types.js";

=======
// Read-only channel account inspection facade for setup and status diagnostics.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getBundledChannelAccountInspector } from "./plugins/bundled.js";
import { getLoadedChannelPlugin } from "./plugins/registry.js";
import type { ChannelId } from "./plugins/types.public.js";

// Read-only account inspection facade for status/setup diagnostics. Prefer a
// loaded plugin inspector, then the lightweight bundled inspector artifact.
>>>>>>> upstream/main
export type ReadOnlyInspectedAccount = Record<string, unknown>;

/** Inspects channel account config without loading mutable runtime surfaces. */
export async function inspectReadOnlyChannelAccount(params: {
  channelId: ChannelId;
  cfg: OpenClawConfig;
  accountId?: string | null;
}): Promise<ReadOnlyInspectedAccount | null> {
<<<<<<< HEAD
  const inspectAccount = getChannelPlugin(params.channelId)?.config.inspectAccount;
=======
  const inspectAccount =
    getLoadedChannelPlugin(params.channelId)?.config.inspectAccount ??
    getBundledChannelAccountInspector(params.channelId);
>>>>>>> upstream/main
  if (!inspectAccount) {
    return null;
  }
  return (await Promise.resolve(
    inspectAccount(params.cfg, params.accountId),
  )) as ReadOnlyInspectedAccount | null;
}
