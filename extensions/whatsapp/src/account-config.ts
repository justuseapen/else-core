<<<<<<< HEAD
import {
  DEFAULT_ACCOUNT_ID,
=======
// Whatsapp helper module supports account config behavior.
import {
  DEFAULT_ACCOUNT_ID,
  mergeAccountConfig,
>>>>>>> upstream/main
  resolveAccountEntry,
  resolveMergedAccountConfig,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/account-core";
import {
  resolveChannelStreamingBlockEnabled,
  resolveChannelStreamingChunkMode,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/channel-streaming";
import type { WhatsAppAccountConfig } from "./runtime-api.js";

function resolveWhatsAppAccountConfig(
=======
} from "openclaw/plugin-sdk/channel-outbound";
import type { WhatsAppAccountConfig } from "./account-types.js";

function resolveWhatsAppDefaultAccountSharedConfig(
  cfg: OpenClawConfig,
): Partial<WhatsAppAccountConfig> | undefined {
  const defaultAccount = resolveAccountEntry(cfg.channels?.whatsapp?.accounts, DEFAULT_ACCOUNT_ID);
  if (!defaultAccount) {
    return undefined;
  }
  const {
    enabled: _ignoredEnabled,
    name: _ignoredName,
    authDir: _ignoredAuthDir,
    selfChatMode: _ignoredSelfChatMode,
    ...sharedDefaults
  } = defaultAccount;
  return sharedDefaults;
}

function resolveWhatsAppAccountConfigForTest(
>>>>>>> upstream/main
  cfg: OpenClawConfig,
  accountId: string,
): WhatsAppAccountConfig | undefined {
  return resolveAccountEntry(cfg.channels?.whatsapp?.accounts, accountId);
}

<<<<<<< HEAD
=======
function resolveMergedNamedWhatsAppAccountConfig(params: {
  cfg: OpenClawConfig;
  accountId: string;
}): WhatsAppAccountConfig {
  const rootCfg = params.cfg.channels?.whatsapp;
  const accountConfig = resolveWhatsAppAccountConfigForTest(params.cfg, params.accountId);
  return {
    ...mergeAccountConfig<WhatsAppAccountConfig>({
      channelConfig: rootCfg as WhatsAppAccountConfig | undefined,
      accountConfig: undefined,
      omitKeys: ["defaultAccount"],
    }),
    ...resolveWhatsAppDefaultAccountSharedConfig(params.cfg),
    ...accountConfig,
  };
}

>>>>>>> upstream/main
export function resolveMergedWhatsAppAccountConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): WhatsAppAccountConfig & { accountId: string } {
  const rootCfg = params.cfg.channels?.whatsapp;
  const accountId = params.accountId?.trim() || rootCfg?.defaultAccount || DEFAULT_ACCOUNT_ID;
<<<<<<< HEAD
  const merged = resolveMergedAccountConfig<WhatsAppAccountConfig>({
=======
  const base = resolveMergedAccountConfig<WhatsAppAccountConfig>({
>>>>>>> upstream/main
    channelConfig: rootCfg as WhatsAppAccountConfig | undefined,
    accounts: rootCfg?.accounts as Record<string, Partial<WhatsAppAccountConfig>> | undefined,
    accountId,
    omitKeys: ["defaultAccount"],
  });
<<<<<<< HEAD
=======
  const merged =
    accountId === DEFAULT_ACCOUNT_ID
      ? base
      : resolveMergedNamedWhatsAppAccountConfig({ cfg: params.cfg, accountId });
>>>>>>> upstream/main
  return {
    accountId,
    ...merged,
    chunkMode: resolveChannelStreamingChunkMode(merged) ?? merged.chunkMode,
    blockStreaming: resolveChannelStreamingBlockEnabled(merged) ?? merged.blockStreaming,
  };
}
