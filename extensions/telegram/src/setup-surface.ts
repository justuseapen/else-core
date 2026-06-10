// Telegram plugin module implements setup surface behavior.
import {
  addWildcardAllowFrom,
  applySetupAccountConfigPatch,
  createAllowFromSection,
  createStandardChannelSetupStatus,
  type ChannelSetupDmPolicy,
  DEFAULT_ACCOUNT_ID,
  hasConfiguredSecretInput,
  patchChannelConfigForAccount,
  setSetupChannelEnabled,
  splitSetupEntries,
  createSetupTranslator,
} from "openclaw/plugin-sdk/setup";
import type { ChannelSetupWizard } from "openclaw/plugin-sdk/setup";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { inspectTelegramAccount } from "./account-inspect.js";
import { listTelegramAccountIds, resolveTelegramAccount } from "./accounts.js";
import {
<<<<<<< HEAD
  listTelegramAccountIds,
  mergeTelegramAccountConfig,
  resolveDefaultTelegramAccountId,
  resolveTelegramAccount,
} from "./accounts.js";
import {
=======
  getTelegramTokenHelpLines,
  getTelegramUserIdHelpLines,
>>>>>>> upstream/main
  parseTelegramAllowFromId,
} from "./setup-core.js";
import {
  buildTelegramDmAccessWarningLines,
  ensureTelegramDefaultGroupMentionGate,
  shouldShowTelegramDmAccessWarning,
  telegramSetupDmPolicy,
} from "./setup-surface.helpers.js";

const t = createSetupTranslator();

const channel = "telegram" as const;

<<<<<<< HEAD
function ensureTelegramDefaultGroupMentionGate(
  cfg: OpenClawConfig,
  accountId: string,
): OpenClawConfig {
  const resolved = resolveTelegramAccount({ cfg, accountId });
  const wildcardGroup = resolved.config.groups?.["*"];
  if (wildcardGroup?.requireMention !== undefined) {
    return cfg;
  }
  return patchChannelConfigForAccount({
    cfg,
    channel,
    accountId,
    patch: {
      groups: {
        ...resolved.config.groups,
        "*": {
          ...wildcardGroup,
          requireMention: true,
        },
      },
    },
  });
}

function shouldShowTelegramDmAccessWarning(cfg: OpenClawConfig, accountId: string): boolean {
  const merged = mergeTelegramAccountConfig(cfg, accountId);
  const policy = merged.dmPolicy ?? "pairing";
  const hasAllowFrom =
    Array.isArray(merged.allowFrom) && merged.allowFrom.some((e) => String(e).trim());
  return policy === "pairing" && !hasAllowFrom;
}

function buildTelegramDmAccessWarningLines(accountId: string): string[] {
  const configBase =
    accountId === DEFAULT_ACCOUNT_ID
      ? "channels.telegram"
      : `channels.telegram.accounts.${accountId}`;
  return [
    "Your bot is using DM policy: pairing.",
    "Any Telegram user who discovers the bot can send pairing requests.",
    "For private use, configure an allowlist with your Telegram user id:",
    "  " + formatCliCommand(`openclaw config set ${configBase}.dmPolicy "allowlist"`),
    "  " + formatCliCommand(`openclaw config set ${configBase}.allowFrom '["YOUR_USER_ID"]'`),
    `Docs: ${formatDocsLink("/channels/pairing", "channels/pairing")}`,
  ];
}

const dmPolicy: ChannelSetupDmPolicy = {
  label: "Telegram",
  channel,
  policyKey: "channels.telegram.dmPolicy",
  allowFromKey: "channels.telegram.allowFrom",
  resolveConfigKeys: (cfg, accountId) =>
    (accountId ?? resolveDefaultTelegramAccountId(cfg)) !== DEFAULT_ACCOUNT_ID
      ? {
          policyKey: `channels.telegram.accounts.${accountId ?? resolveDefaultTelegramAccountId(cfg)}.dmPolicy`,
          allowFromKey: `channels.telegram.accounts.${accountId ?? resolveDefaultTelegramAccountId(cfg)}.allowFrom`,
        }
      : {
          policyKey: "channels.telegram.dmPolicy",
          allowFromKey: "channels.telegram.allowFrom",
        },
  getCurrent: (cfg, accountId) =>
    mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).dmPolicy ??
    "pairing",
  setPolicy: (cfg, policy, accountId) => {
    const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
    const merged = mergeTelegramAccountConfig(cfg, resolvedAccountId);
    const patch = {
      dmPolicy: policy,
      ...(policy === "open" ? { allowFrom: addWildcardAllowFrom(merged.allowFrom) } : {}),
    };
    return accountId == null && resolvedAccountId !== DEFAULT_ACCOUNT_ID
      ? applySetupAccountConfigPatch({
          cfg,
          channelKey: channel,
          accountId: resolvedAccountId,
          patch,
        })
      : patchChannelConfigForAccount({
          cfg,
          channel,
          accountId: resolvedAccountId,
          patch,
        });
  },
  promptAllowFrom: promptTelegramAllowFromForAccount,
};

=======
>>>>>>> upstream/main
export const telegramSetupWizard: ChannelSetupWizard = {
  channel,
  status: createStandardChannelSetupStatus({
    channelLabel: "Telegram",
    configuredLabel: t("wizard.channels.statusConfigured"),
    unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
    configuredHint: t("wizard.channels.statusRecommendedConfigured"),
    unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
    configuredScore: 1,
    unconfiguredScore: 10,
    resolveConfigured: ({ cfg, accountId }) =>
      (accountId ? [accountId] : listTelegramAccountIds(cfg)).some((resolvedAccountId) => {
        const account = inspectTelegramAccount({ cfg, accountId: resolvedAccountId });
        return account.configured;
      }),
  }),
  prepare: async ({ cfg, accountId, credentialValues }) => ({
    cfg: ensureTelegramDefaultGroupMentionGate(cfg, accountId),
    credentialValues,
  }),
  credentials: [
    {
      inputKey: "token",
      providerHint: channel,
      credentialLabel: t("wizard.telegram.botToken"),
      preferredEnvVar: "TELEGRAM_BOT_TOKEN",
      helpTitle: t("wizard.telegram.botToken"),
      helpLines: getTelegramTokenHelpLines(),
      envPrompt: t("wizard.telegram.tokenEnvPrompt"),
      keepPrompt: t("wizard.telegram.tokenKeepPrompt"),
      inputPrompt: t("wizard.telegram.tokenInputPrompt"),
      allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
      inspect: ({ cfg, accountId }) => {
        const resolved = resolveTelegramAccount({ cfg, accountId });
        const hasConfiguredBotToken = hasConfiguredSecretInput(resolved.config.botToken);
        const hasConfiguredValue =
          hasConfiguredBotToken || Boolean(resolved.config.tokenFile?.trim());
        return {
          accountConfigured: Boolean(resolved.token) || hasConfiguredValue,
          hasConfiguredValue,
          resolvedValue: normalizeOptionalString(resolved.token),
          envValue:
            accountId === DEFAULT_ACCOUNT_ID
              ? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN)
              : undefined,
        };
      },
    },
  ],
  allowFrom: createAllowFromSection({
    helpTitle: t("wizard.telegram.userIdTitle"),
    helpLines: getTelegramUserIdHelpLines(),
    message: t("wizard.telegram.allowFromPrompt"),
    placeholder: "123456789",
    invalidWithoutCredentialNote: t("wizard.telegram.allowFromInvalid"),
    parseInputs: splitSetupEntries,
    parseId: parseTelegramAllowFromId,
    resolveEntries: async ({ entries }) =>
      entries.map((entry) => {
        const id = parseTelegramAllowFromId(entry);
        return { input: entry, resolved: Boolean(id), id };
      }),
    apply: async ({ cfg, accountId, allowFrom }) =>
      patchChannelConfigForAccount({
        cfg,
        channel,
        accountId,
        patch: { dmPolicy: "allowlist", allowFrom },
      }),
  }),
  finalize: async ({ cfg, accountId, prompter }) => {
    if (!shouldShowTelegramDmAccessWarning(cfg, accountId)) {
      return;
    }
    await prompter.note(
      buildTelegramDmAccessWarningLines(accountId).join("\n"),
      "Telegram DM access warning",
    );
  },
  dmPolicy: telegramSetupDmPolicy,
  disable: (cfg) => setSetupChannelEnabled(cfg, channel, false),
};
