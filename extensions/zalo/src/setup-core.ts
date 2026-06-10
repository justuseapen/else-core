// Zalo plugin module implements setup core behavior.
import {
  addWildcardAllowFrom,
  createDelegatedSetupWizardProxy,
  createPatchedAccountSetupAdapter,
  createSetupInputPresenceValidator,
  type ChannelSetupWizard,
  type ChannelSetupDmPolicy,
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/setup";
import { resolveDefaultZaloAccountId, resolveZaloAccount } from "./accounts.js";
import type { OpenClawConfig } from "./runtime-api.js";
=======
  createSetupTranslator,
  type ChannelSetupDmPolicy,
  type ChannelSetupWizard,
} from "openclaw/plugin-sdk/setup";
import { resolveDefaultZaloAccountId, resolveZaloAccount } from "./accounts.js";
import { promptZaloAllowFrom } from "./setup-allow-from.js";

const t = createSetupTranslator();
>>>>>>> upstream/main

const channel = "zalo" as const;

type ZaloAccountSetupConfig = {
  enabled?: boolean;
  dmPolicy?: string;
  allowFrom?: Array<string | number> | ReadonlyArray<string | number>;
};

export const zaloSetupAdapter = createPatchedAccountSetupAdapter({
  channelKey: channel,
  validateInput: createSetupInputPresenceValidator({
    defaultAccountOnlyEnvError: "ZALO_BOT_TOKEN can only be used for the default account.",
    whenNotUseEnv: [
      {
        someOf: ["token", "tokenFile"],
        message: "Zalo requires token or --token-file (or --use-env).",
      },
    ],
  }),
  buildPatch: (input) =>
    input.useEnv
      ? {}
      : input.tokenFile
        ? { tokenFile: input.tokenFile }
        : input.token
          ? { botToken: input.token }
          : {},
});

export const zaloDmPolicy: ChannelSetupDmPolicy = {
  label: "Zalo",
  channel,
  policyKey: "channels.zalo.dmPolicy",
  allowFromKey: "channels.zalo.allowFrom",
  resolveConfigKeys: (cfg, accountId) =>
<<<<<<< HEAD
    (accountId ?? resolveDefaultZaloAccountId(cfg as OpenClawConfig)) !== DEFAULT_ACCOUNT_ID
      ? {
          policyKey: `channels.zalo.accounts.${accountId ?? resolveDefaultZaloAccountId(cfg as OpenClawConfig)}.dmPolicy`,
          allowFromKey: `channels.zalo.accounts.${accountId ?? resolveDefaultZaloAccountId(cfg as OpenClawConfig)}.allowFrom`,
=======
    (accountId ?? resolveDefaultZaloAccountId(cfg)) !== DEFAULT_ACCOUNT_ID
      ? {
          policyKey: `channels.zalo.accounts.${accountId ?? resolveDefaultZaloAccountId(cfg)}.dmPolicy`,
          allowFromKey: `channels.zalo.accounts.${accountId ?? resolveDefaultZaloAccountId(cfg)}.allowFrom`,
>>>>>>> upstream/main
        }
      : {
          policyKey: "channels.zalo.dmPolicy",
          allowFromKey: "channels.zalo.allowFrom",
        },
  getCurrent: (cfg, accountId) =>
    resolveZaloAccount({
<<<<<<< HEAD
      cfg: cfg as OpenClawConfig,
      accountId: accountId ?? resolveDefaultZaloAccountId(cfg as OpenClawConfig),
=======
      cfg,
      accountId: accountId ?? resolveDefaultZaloAccountId(cfg),
>>>>>>> upstream/main
    }).config.dmPolicy ?? "pairing",
  setPolicy: (cfg, policy, accountId) => {
    const resolvedAccountId =
      accountId && normalizeAccountId(accountId)
        ? (normalizeAccountId(accountId) ?? DEFAULT_ACCOUNT_ID)
<<<<<<< HEAD
        : resolveDefaultZaloAccountId(cfg as OpenClawConfig);
    const resolved = resolveZaloAccount({
      cfg: cfg as OpenClawConfig,
=======
        : resolveDefaultZaloAccountId(cfg);
    const resolved = resolveZaloAccount({
      cfg,
>>>>>>> upstream/main
      accountId: resolvedAccountId,
    });
    if (resolvedAccountId === DEFAULT_ACCOUNT_ID) {
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          zalo: {
            ...cfg.channels?.zalo,
            enabled: true,
            dmPolicy: policy,
            ...(policy === "open"
              ? { allowFrom: addWildcardAllowFrom(resolved.config.allowFrom) }
              : {}),
          },
        },
      };
    }
<<<<<<< HEAD
=======
    const currentAccount = cfg.channels?.zalo?.accounts?.[resolvedAccountId] as
      | ZaloAccountSetupConfig
      | undefined;
>>>>>>> upstream/main
    return {
      ...cfg,
      channels: {
        ...cfg.channels,
        zalo: {
          ...cfg.channels?.zalo,
          enabled: true,
          accounts: {
            ...cfg.channels?.zalo?.accounts,
            [resolvedAccountId]: {
<<<<<<< HEAD
              ...cfg.channels?.zalo?.accounts?.[resolvedAccountId],
              enabled: cfg.channels?.zalo?.accounts?.[resolvedAccountId]?.enabled ?? true,
=======
              ...currentAccount,
              enabled: currentAccount?.enabled ?? true,
>>>>>>> upstream/main
              dmPolicy: policy,
              ...(policy === "open"
                ? { allowFrom: addWildcardAllowFrom(resolved.config.allowFrom) }
                : {}),
            },
          },
        },
      },
    };
  },
<<<<<<< HEAD
  promptAllowFrom: async (params) =>
    (await loadZaloSetupWizard()).dmPolicy?.promptAllowFrom?.(params) ?? params.cfg,
};

async function loadZaloSetupWizard(): Promise<ChannelSetupWizard> {
  return (await import("./setup-surface.js")).zaloSetupWizard;
}

=======
  promptAllowFrom: async ({ cfg, prompter, accountId }) =>
    promptZaloAllowFrom({
      cfg,
      prompter,
      accountId: accountId ?? resolveDefaultZaloAccountId(cfg),
    }),
};

>>>>>>> upstream/main
export function createZaloSetupWizardProxy(
  loadWizard: () => Promise<ChannelSetupWizard>,
): ChannelSetupWizard {
  return createDelegatedSetupWizardProxy({
    channel,
    loadWizard,
    status: {
<<<<<<< HEAD
      configuredLabel: "configured",
      unconfiguredLabel: "needs token",
      configuredHint: "recommended · configured",
      unconfiguredHint: "recommended · newcomer-friendly",
=======
      configuredLabel: t("wizard.channels.statusConfigured"),
      unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
      configuredHint: t("wizard.channels.statusRecommendedConfigured"),
      unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
>>>>>>> upstream/main
      configuredScore: 1,
      unconfiguredScore: 10,
    },
    credentials: [],
    delegateFinalize: true,
    dmPolicy: zaloDmPolicy,
    disable: (cfg) => ({
      ...cfg,
      channels: {
        ...cfg.channels,
        zalo: {
          ...cfg.channels?.zalo,
          enabled: false,
        },
      },
    }),
  });
}
