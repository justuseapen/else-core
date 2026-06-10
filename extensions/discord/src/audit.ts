// Discord plugin module implements audit behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { inspectDiscordAccount } from "./account-inspect.js";
import {
  auditDiscordChannelPermissionsWithFetcher,
  collectDiscordAuditChannelIdsForAccount,
  type DiscordChannelPermissionsAudit,
} from "./audit-core.js";
import { fetchChannelPermissionsDiscord } from "./send.js";

<<<<<<< HEAD
export type DiscordChannelPermissionsAuditEntry = {
  channelId: string;
  ok: boolean;
  missing?: string[];
  error?: string | null;
  matchKey?: string;
  matchSource?: "id";
};

export type DiscordChannelPermissionsAudit = {
  ok: boolean;
  checkedChannels: number;
  unresolvedChannels: number;
  channels: DiscordChannelPermissionsAuditEntry[];
  elapsedMs: number;
};

const REQUIRED_CHANNEL_PERMISSIONS = ["ViewChannel", "SendMessages"] as const;

function shouldAuditChannelConfig(config: DiscordGuildChannelConfig | undefined) {
  if (!config) {
    return true;
  }
  if (config.enabled === false) {
    return false;
  }
  return true;
}

function listConfiguredGuildChannelKeys(
  guilds: Record<string, DiscordGuildEntry> | undefined,
): string[] {
  if (!guilds) {
    return [];
  }
  const ids = new Set<string>();
  for (const entry of Object.values(guilds)) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const channelsRaw = (entry as { channels?: unknown }).channels;
    if (!isRecord(channelsRaw)) {
      continue;
    }
    for (const [key, value] of Object.entries(channelsRaw)) {
      const channelId = String(key).trim();
      if (!channelId) {
        continue;
      }
      // Skip wildcard keys (e.g. "*" meaning "all channels") — they are valid
      // config but are not real channel IDs and should not be audited.
      if (channelId === "*") {
        continue;
      }
      if (!shouldAuditChannelConfig(value as DiscordGuildChannelConfig | undefined)) {
        continue;
      }
      ids.add(channelId);
    }
  }
  return [...ids].toSorted((a, b) => a.localeCompare(b));
}

=======
>>>>>>> upstream/main
export function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) {
  const account = inspectDiscordAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return collectDiscordAuditChannelIdsForAccount(account.config);
}

export async function auditDiscordChannelPermissions(params: {
  cfg: OpenClawConfig;
  token: string;
  accountId?: string | null;
  channelIds: string[];
  timeoutMs: number;
}): Promise<DiscordChannelPermissionsAudit> {
  return await auditDiscordChannelPermissionsWithFetcher({
    ...params,
    fetchChannelPermissions: fetchChannelPermissionsDiscord,
  });
}
