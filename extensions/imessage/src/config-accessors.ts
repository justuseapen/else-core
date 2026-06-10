<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
// Imessage helper module supports config accessors behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
import { resolveIMessageAccount } from "./accounts.js";

export function resolveIMessageConfigAllowFrom(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[] {
  return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}

export function resolveIMessageConfigDefaultTo(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string | undefined {
  const defaultTo = resolveIMessageAccount(params).config.defaultTo;
  if (defaultTo == null) {
    return undefined;
  }
<<<<<<< HEAD
  const normalized = String(defaultTo).trim();
=======
  const normalized = defaultTo.trim();
>>>>>>> upstream/main
  return normalized || undefined;
}
