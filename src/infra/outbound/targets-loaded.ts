<<<<<<< HEAD
import { getChannelPlugin } from "../../channels/plugins/index.js";
import type { ChannelOutboundTargetMode, ChannelPlugin } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import { getActivePluginRegistry } from "../../plugins/runtime.js";
import type { GatewayMessageChannel } from "../../utils/message-channel.js";
import {
  isDeliverableMessageChannel,
  normalizeMessageChannel,
} from "../../utils/message-channel.js";
import {
=======
// Loaded-target resolution uses only already-loaded plugins so hot send paths
// can avoid triggering channel discovery.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { getLoadedChannelPluginForRead } from "../../channels/plugins/registry-loaded-read.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelOutboundTargetMode } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { GatewayMessageChannel } from "../../utils/message-channel.js";
import {
>>>>>>> upstream/main
  resolveOutboundTargetWithPlugin,
  type OutboundTargetResolution,
} from "./targets-resolve-shared.js";

function resolveLoadedOutboundChannelPlugin(channel: string): ChannelPlugin | undefined {
<<<<<<< HEAD
  const normalized = normalizeMessageChannel(channel);
  if (!normalized || !isDeliverableMessageChannel(normalized)) {
    return undefined;
  }

  const current = getChannelPlugin(normalized);
  if (current) {
    return current;
  }

  const activeRegistry = getActivePluginRegistry();
  if (!activeRegistry) {
    return undefined;
  }
  for (const entry of activeRegistry.channels) {
    const plugin = entry?.plugin;
    if (plugin?.id === normalized) {
      return plugin;
    }
  }
  return undefined;
}

=======
  const normalized = normalizeOptionalString(channel);
  if (!normalized) {
    return undefined;
  }

  return getLoadedChannelPluginForRead(normalized);
}

/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
>>>>>>> upstream/main
export function tryResolveLoadedOutboundTarget(params: {
  channel: GatewayMessageChannel;
  to?: string;
  allowFrom?: string[];
  cfg?: OpenClawConfig;
  accountId?: string | null;
  mode?: ChannelOutboundTargetMode;
}): OutboundTargetResolution | undefined {
  return resolveOutboundTargetWithPlugin({
    plugin: resolveLoadedOutboundChannelPlugin(params.channel),
    target: params,
  });
}
