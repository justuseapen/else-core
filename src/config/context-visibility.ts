<<<<<<< HEAD
=======
// Resolves context visibility policy for accounts and sessions.
>>>>>>> upstream/main
import { resolveAccountEntry } from "../routing/account-lookup.js";
import { normalizeAccountId } from "../routing/session-key.js";
import type { OpenClawConfig } from "./config.js";
import type { ContextVisibilityMode } from "./types.base.js";

type ChannelContextVisibilityConfig = {
<<<<<<< HEAD
  contextVisibility?: ContextVisibilityMode;
  accounts?: Record<string, { contextVisibility?: ContextVisibilityMode }>;
};

export type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
=======
  /**
   * Channel-wide supplemental context visibility mode.
   */
  contextVisibility?: ContextVisibilityMode;
  /**
   * Account-specific visibility overrides keyed by configured channel account id.
   */
  accounts?: Record<string, { contextVisibility?: ContextVisibilityMode }>;
};

type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      /**
       * Global default supplemental context visibility for channels without a local override.
       */
>>>>>>> upstream/main
      contextVisibility?: ContextVisibilityMode;
    };
  };
};

<<<<<<< HEAD
=======
/** Reads the global channel default supplemental context visibility mode. */
>>>>>>> upstream/main
export function resolveDefaultContextVisibility(
  cfg: ContextVisibilityDefaultsConfig,
): ContextVisibilityMode | undefined {
  return cfg.channels?.defaults?.contextVisibility;
}

<<<<<<< HEAD
export function resolveChannelContextVisibilityMode(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string | null;
=======
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
export function resolveChannelContextVisibilityMode(params: {
  /** Full OpenClaw config containing channel defaults and per-channel overrides. */
  cfg: OpenClawConfig;
  /** Channel id whose visibility policy is being resolved. */
  channel: string;
  /** Optional channel account id used for account-specific overrides. */
  accountId?: string | null;
  /** Runtime adapter override that takes precedence over config-backed policy. */
>>>>>>> upstream/main
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode {
  if (params.configuredContextVisibility) {
    return params.configuredContextVisibility;
  }
  const channelConfig = params.cfg.channels?.[params.channel] as
    | ChannelContextVisibilityConfig
    | undefined;
  const accountId = normalizeAccountId(params.accountId);
  const accountMode = resolveAccountEntry(channelConfig?.accounts, accountId)?.contextVisibility;
<<<<<<< HEAD
=======
  // Preserve the public precedence order: adapter override, account override,
  // channel override, global default, then permissive legacy default.
>>>>>>> upstream/main
  return (
    accountMode ??
    channelConfig?.contextVisibility ??
    resolveDefaultContextVisibility(params.cfg) ??
    "all"
  );
}
