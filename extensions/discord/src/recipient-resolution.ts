<<<<<<< HEAD
import { loadConfig, type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveDiscordAccount } from "./accounts.js";
import { parseAndResolveDiscordTarget } from "./target-resolver.js";
=======
// Discord plugin module implements recipient resolution behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveDiscordAccount } from "./accounts.js";
import { parseAndResolveDiscordTarget } from "./target-resolver.js";
import type { DiscordTargetParseOptions } from "./targets.js";
>>>>>>> upstream/main

type DiscordRecipient =
  | {
      kind: "user";
      id: string;
    }
  | {
      kind: "channel";
      id: string;
    };

export async function parseAndResolveRecipient(
  raw: string,
<<<<<<< HEAD
  accountId?: string,
  cfg?: OpenClawConfig,
): Promise<DiscordRecipient> {
  const resolvedCfg = cfg ?? loadConfig();
  const accountInfo = resolveDiscordAccount({ cfg: resolvedCfg, accountId });
  const trimmed = raw.trim();
  const parseOptions = {
    ambiguousMessage: `Ambiguous Discord recipient "${trimmed}". Use "user:${trimmed}" for DMs or "channel:${trimmed}" for channel messages.`,
  };
=======
  cfg: OpenClawConfig,
  accountId?: string,
  parseOptions: DiscordTargetParseOptions = {},
): Promise<DiscordRecipient> {
  if (!cfg) {
    throw new Error(
      "Discord recipient resolution requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.",
    );
  }
  const resolvedCfg = requireRuntimeConfig(cfg, "Discord recipient resolution");
  const accountInfo = resolveDiscordAccount({ cfg: resolvedCfg, accountId });
>>>>>>> upstream/main
  const resolved = await parseAndResolveDiscordTarget(
    raw,
    {
      cfg: resolvedCfg,
      accountId: accountInfo.accountId,
    },
    parseOptions,
  );
  return { kind: resolved.kind, id: resolved.id };
}
<<<<<<< HEAD
=======

export async function parseAndResolveChannelRecipient(
  raw: string,
  cfg: OpenClawConfig,
  accountId?: string,
): Promise<DiscordRecipient> {
  return await parseAndResolveRecipient(raw, cfg, accountId, {
    defaultKind: "channel",
  });
}
>>>>>>> upstream/main
