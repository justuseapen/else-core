// Whatsapp plugin module implements shared behavior.
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import {
  adaptScopedAccountAccessor,
  createScopedChannelConfigAdapter,
  createScopedDmSecurityResolver,
} from "openclaw/plugin-sdk/channel-config-helpers";
<<<<<<< HEAD
import { createAllowlistProviderRouteAllowlistWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { createChannelPluginBase, getChatChannelMeta } from "openclaw/plugin-sdk/core";
import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import {
  createDelegatedSetupWizardProxy,
  type ChannelSetupWizard,
} from "openclaw/plugin-sdk/setup-runtime";
=======
>>>>>>> upstream/main
import {
  collectOpenGroupPolicyRouteAllowlistWarnings,
  createAllowlistProviderGroupPolicyWarningCollector,
} from "openclaw/plugin-sdk/channel-policy";
import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import { createChannelPluginBase } from "openclaw/plugin-sdk/core";
import {
  createDelegatedSetupWizardProxy,
  type ChannelSetupWizard,
} from "openclaw/plugin-sdk/setup-runtime";
import {
  hasAnyWhatsAppAuth,
  listWhatsAppAccountIds,
  resolveDefaultWhatsAppAccountId,
  resolveWhatsAppAccount,
  hasAnyWhatsAppAuth,
  type ResolvedWhatsAppAccount,
} from "./accounts.js";
import { formatWhatsAppConfigAllowFromEntries } from "./config-accessors.js";
import { WhatsAppChannelConfigSchema } from "./config-schema.js";
import { whatsappDoctor } from "./doctor.js";
<<<<<<< HEAD
import { resolveWhatsAppGroupIntroHint } from "./group-intro.js";
import {
  resolveWhatsAppGroupRequireMention,
  resolveWhatsAppGroupToolPolicy,
} from "./group-policy.js";
import { resolveLegacyGroupSessionKey } from "./group-session-contract.js";
import { applyWhatsAppSecurityConfigFixes } from "./security-fix.js";
import { canonicalizeLegacySessionKey, isLegacyGroupSessionKey } from "./session-contract.js";

export const WHATSAPP_CHANNEL = "whatsapp" as const;
const WHATSAPP_UNSUPPORTED_SECRET_REF_SURFACE_PATTERNS = [
  "channels.whatsapp.creds.json",
  "channels.whatsapp.accounts.*.creds.json",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function collectUnsupportedSecretRefConfigCandidates(raw: unknown): Array<{
  path: string;
  value: unknown;
}> {
  if (!isRecord(raw) || !isRecord(raw.channels) || !isRecord(raw.channels.whatsapp)) {
    return [];
  }

  const candidates: Array<{ path: string; value: unknown }> = [];
  const whatsapp = raw.channels.whatsapp;
  const creds = isRecord(whatsapp.creds) ? whatsapp.creds : null;
  if (creds) {
    candidates.push({
      path: "channels.whatsapp.creds.json",
      value: creds.json,
    });
  }

  const accounts = isRecord(whatsapp.accounts) ? whatsapp.accounts : null;
  if (!accounts) {
    return candidates;
  }
  for (const [accountId, account] of Object.entries(accounts)) {
    if (!isRecord(account) || !isRecord(account.creds)) {
      continue;
    }
    candidates.push({
      path: `channels.whatsapp.accounts.${accountId}.creds.json`,
      value: account.creds.json,
    });
  }
  return candidates;
}
=======
import { resolveWhatsAppConfigPath } from "./group-config-path.js";
import { resolveLegacyGroupSessionKey } from "./group-session-contract.js";
import {
  collectUnsupportedSecretRefConfigCandidates,
  unsupportedSecretRefSurfacePatterns,
} from "./security-contract.js";
import { applyWhatsAppSecurityConfigFixes } from "./security-fix.js";
import {
  canonicalizeLegacySessionKey,
  deriveLegacySessionChatType,
  isLegacyGroupSessionKey,
} from "./session-contract.js";

const WHATSAPP_CHANNEL = "whatsapp" as const;
>>>>>>> upstream/main

export async function loadWhatsAppChannelRuntime() {
  return await import("./channel.runtime.js");
}

async function loadWhatsAppSetupSurface() {
  return await import("./setup-surface.js");
}

export const whatsappSetupWizardProxy = createWhatsAppSetupWizardProxy(
  async () => (await loadWhatsAppSetupSurface()).whatsappSetupWizard,
);

const whatsappConfigAdapter = createScopedChannelConfigAdapter<ResolvedWhatsAppAccount>({
  sectionKey: WHATSAPP_CHANNEL,
  listAccountIds: listWhatsAppAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveWhatsAppAccount),
  defaultAccountId: resolveDefaultWhatsAppAccountId,
  clearBaseFields: [],
  allowTopLevel: false,
  resolveAllowFrom: (account) => account.allowFrom,
  formatAllowFrom: (allowFrom) => formatWhatsAppConfigAllowFromEntries(allowFrom),
  resolveDefaultTo: (account) => account.defaultTo,
});

const whatsappResolveDmPolicy = createScopedDmSecurityResolver<ResolvedWhatsAppAccount>({
  channelKey: WHATSAPP_CHANNEL,
  resolvePolicy: (account) => account.dmPolicy,
  resolveAllowFrom: (account) => account.allowFrom,
  policyPathSuffix: "dmPolicy",
  normalizeEntry: (raw) => normalizeE164(raw),
  inheritSharedDefaultsFromDefaultAccount: true,
});

<<<<<<< HEAD
export function createWhatsAppSetupWizardProxy(
=======
function createWhatsAppSetupWizardProxy(
>>>>>>> upstream/main
  loadWizard: () => Promise<ChannelSetupWizard>,
): ChannelSetupWizard {
  return createDelegatedSetupWizardProxy({
    channel: WHATSAPP_CHANNEL,
    loadWizard,
    status: {
      configuredLabel: "linked",
      unconfiguredLabel: "not linked",
      configuredHint: "linked",
      unconfiguredHint: "not linked",
      configuredScore: 5,
      unconfiguredScore: 4,
    },
<<<<<<< HEAD
    resolveShouldPromptAccountIds: (params) => Boolean(params.shouldPromptAccountIds),
=======
    resolveShouldPromptAccountIds: (params) => params.shouldPromptAccountIds,
>>>>>>> upstream/main
    credentials: [],
    delegateFinalize: true,
    disable: (cfg) => ({
      ...cfg,
      channels: {
        ...cfg.channels,
        whatsapp: {
          ...cfg.channels?.whatsapp,
          enabled: false,
        },
      },
    }),
    onAccountRecorded: (accountId, options) => {
      options?.onAccountId?.(WHATSAPP_CHANNEL, accountId);
    },
  });
}

export function createWhatsAppPluginBase(params: {
  groups: NonNullable<ChannelPlugin<ResolvedWhatsAppAccount>["groups"]>;
  setupWizard: NonNullable<ChannelPlugin<ResolvedWhatsAppAccount>["setupWizard"]>;
  setup: NonNullable<ChannelPlugin<ResolvedWhatsAppAccount>["setup"]>;
  isConfigured: NonNullable<ChannelPlugin<ResolvedWhatsAppAccount>["config"]>["isConfigured"];
}) {
  const collectWhatsAppSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector<{
    account: ResolvedWhatsAppAccount;
    cfg: Parameters<typeof resolveWhatsAppAccount>[0]["cfg"];
    accountId?: string | null;
  }>({
    providerConfigPresent: (cfg) => cfg.channels?.whatsapp !== undefined,
    resolveGroupPolicy: ({ account }) => account.groupPolicy,
    collect: ({ account, accountId, cfg, groupPolicy }) =>
      collectOpenGroupPolicyRouteAllowlistWarnings({
        groupPolicy,
        routeAllowlistConfigured:
          Boolean(account.groups) && Object.keys(account.groups ?? {}).length > 0,
        restrictSenders: {
          surface: "WhatsApp groups",
          openScope: "any member in allowed groups",
          groupPolicyPath: resolveWhatsAppConfigPath({ cfg, accountId, field: "groupPolicy" }),
          groupAllowFromPath: resolveWhatsAppConfigPath({
            cfg,
            accountId,
            field: "groupAllowFrom",
          }),
        },
        noRouteAllowlist: {
          surface: "WhatsApp groups",
          routeAllowlistPath: resolveWhatsAppConfigPath({ cfg, accountId, field: "groups" }),
          routeScope: "group",
          groupPolicyPath: resolveWhatsAppConfigPath({ cfg, accountId, field: "groupPolicy" }),
          groupAllowFromPath: resolveWhatsAppConfigPath({
            cfg,
            accountId,
            field: "groupAllowFrom",
          }),
        },
      }),
  });
  const base = createChannelPluginBase({
    id: WHATSAPP_CHANNEL,
    meta: {
      label: "WhatsApp",
      selectionLabel: "WhatsApp (QR link)",
      detailLabel: "WhatsApp Web",
      docsPath: "/channels/whatsapp",
      docsLabel: "whatsapp",
      blurb: "works with your own number; recommend a separate phone + eSIM.",
      systemImage: "message",
      showConfigured: false,
      quickstartAllowFrom: true,
      forceAccountBinding: true,
      preferSessionLookupForAnnounceTarget: true,
    },
    setupWizard: params.setupWizard,
    capabilities: {
      chatTypes: ["direct", "group", "channel"],
      polls: true,
      reactions: true,
      media: true,
      tts: {
        voice: {
          synthesisTarget: "voice-note",
          transcodesAudio: true,
        },
      },
    },
    // `channels.whatsapp.accounts.*` (account add/remove, and `enabled` flips)
    // must restart the channel so a disabled account's provider is torn down;
    // the broad `channels.whatsapp` noop prefix below otherwise swallows it as a
    // hot no-op and leaves the account connected until a full restart.
    reload: {
      configPrefixes: ["web", "channels.whatsapp.accounts"],
      noopPrefixes: ["channels.whatsapp"],
    },
    gatewayMethodDescriptors: [{ name: "web.login.start" }, { name: "web.login.wait" }],
    configSchema: WhatsAppChannelConfigSchema,
    config: {
      ...whatsappConfigAdapter,
      isEnabled: (account, cfg) => account.enabled && cfg.web?.enabled !== false,
      disabledReason: () => "disabled",
      isConfigured: params.isConfigured,
      hasPersistedAuthState: ({ cfg }) => hasAnyWhatsAppAuth(cfg),
      unconfiguredReason: () => "not linked",
      describeAccount: (account) =>
        describeAccountSnapshot({
          account,
          configured: Boolean(account.authDir),
          extra: {
            linked: Boolean(account.authDir),
            dmPolicy: account.dmPolicy,
            allowFrom: account.allowFrom,
          },
        }),
    },
    security: {
      applyConfigFixes: applyWhatsAppSecurityConfigFixes,
      resolveDmPolicy: whatsappResolveDmPolicy,
      collectWarnings: collectWhatsAppSecurityWarnings,
    },
    doctor: whatsappDoctor,
    setup: params.setup,
    groups: params.groups,
  });
  return {
    ...base,
    setupWizard: base.setupWizard!,
    capabilities: base.capabilities!,
    reload: base.reload!,
    gatewayMethodDescriptors: base.gatewayMethodDescriptors!,
    configSchema: base.configSchema!,
    config: base.config!,
    messaging: {
      defaultMarkdownTableMode: "bullets",
<<<<<<< HEAD
      resolveLegacyGroupSessionKey,
      isLegacyGroupSessionKey,
      canonicalizeLegacySessionKey: (params) =>
        canonicalizeLegacySessionKey({ key: params.key, agentId: params.agentId }),
    },
    secrets: {
      unsupportedSecretRefSurfacePatterns: WHATSAPP_UNSUPPORTED_SECRET_REF_SURFACE_PATTERNS,
=======
      deriveLegacySessionChatType,
      resolveLegacyGroupSessionKey,
      isLegacyGroupSessionKey,
      canonicalizeLegacySessionKey: (paramsLocal) =>
        canonicalizeLegacySessionKey({ key: paramsLocal.key, agentId: paramsLocal.agentId }),
    },
    secrets: {
      unsupportedSecretRefSurfacePatterns,
>>>>>>> upstream/main
      collectUnsupportedSecretRefConfigCandidates,
    },
    security: base.security!,
    groups: base.groups!,
  } satisfies Pick<
    ChannelPlugin<ResolvedWhatsAppAccount>,
    | "id"
    | "meta"
    | "setupWizard"
    | "capabilities"
    | "reload"
    | "gatewayMethodDescriptors"
    | "configSchema"
    | "config"
    | "messaging"
    | "secrets"
    | "security"
    | "doctor"
    | "setup"
    | "groups"
  >;
}
