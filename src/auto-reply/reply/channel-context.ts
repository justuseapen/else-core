<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
=======
/** Resolves channel and account context for command handlers. */
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
>>>>>>> upstream/main
import { getActivePluginChannelRegistry } from "../../plugins/runtime.js";

type CommandSurfaceParams = {
  ctx: {
    OriginatingChannel?: string;
    Surface?: string;
    Provider?: string;
    AccountId?: string;
  };
  command: {
    channel?: string;
  };
};

type ChannelAccountParams = {
  cfg: OpenClawConfig;
  ctx: {
    OriginatingChannel?: string;
    Surface?: string;
    Provider?: string;
    AccountId?: string;
  };
  command: {
    channel?: string;
  };
};

<<<<<<< HEAD
=======
/** Resolves the command surface channel from inbound context and command state. */
>>>>>>> upstream/main
export function resolveCommandSurfaceChannel(params: CommandSurfaceParams): string {
  const channel =
    params.ctx.OriginatingChannel ??
    params.command.channel ??
    params.ctx.Surface ??
    params.ctx.Provider;
  return normalizeOptionalLowercaseString(channel) ?? "";
}

<<<<<<< HEAD
export function resolveChannelAccountId(params: ChannelAccountParams): string {
  const accountId = typeof params.ctx.AccountId === "string" ? params.ctx.AccountId.trim() : "";
=======
/** Resolves command account id, falling back to plugin default account config. */
export function resolveChannelAccountId(params: ChannelAccountParams): string {
  const accountId = normalizeOptionalString(params.ctx.AccountId) ?? "";
>>>>>>> upstream/main
  if (accountId) {
    return accountId;
  }
  const channel = resolveCommandSurfaceChannel(params);
  const plugin = getActivePluginChannelRegistry()?.channels.find(
    (entry) => entry.plugin.id === channel,
  )?.plugin;
<<<<<<< HEAD
  const configuredDefault = plugin?.config.defaultAccountId?.(params.cfg)?.trim();
=======
  const configuredDefault = normalizeOptionalString(plugin?.config.defaultAccountId?.(params.cfg));
>>>>>>> upstream/main
  return configuredDefault || "default";
}
