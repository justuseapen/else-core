<<<<<<< HEAD
import path from "node:path";
import {
  DEFAULT_ACCOUNT_ID,
  normalizeAllowFromEntries,
  normalizeE164,
  pathExists,
  splitSetupEntries,
=======
// Whatsapp plugin module implements setup finalize behavior.
import {
  DEFAULT_ACCOUNT_ID,
  splitSetupEntries,
  createSetupTranslator,
>>>>>>> upstream/main
  type DmPolicy,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/setup";
import type { ChannelSetupWizard } from "openclaw/plugin-sdk/setup";
import { formatCliCommand, formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
import {
  resolveDefaultWhatsAppAccountId,
  resolveWhatsAppAccount,
  resolveWhatsAppAuthDir,
} from "./accounts.js";
<<<<<<< HEAD
import { loginWeb } from "./login.js";
import { whatsappSetupAdapter } from "./setup-core.js";

=======
import { hasWebCredsSync } from "./creds-files.js";
import {
  normalizeWhatsAppAllowFromEntries,
  normalizeWhatsAppAllowFromEntry,
} from "./normalize-target.js";
import { whatsappSetupAdapter } from "./setup-core.js";

const t = createSetupTranslator();

>>>>>>> upstream/main
type SetupPrompter = Parameters<NonNullable<ChannelSetupWizard["finalize"]>>[0]["prompter"];
type SetupRuntime = Parameters<NonNullable<ChannelSetupWizard["finalize"]>>[0]["runtime"];
type WhatsAppConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["whatsapp"]>;
type WhatsAppAccountConfig = NonNullable<NonNullable<WhatsAppConfig["accounts"]>[string]>;

<<<<<<< HEAD
=======
function trimPromptText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function isDefaultWhatsAppAccountKey(accountId: string): boolean {
  return accountId.trim().toLowerCase() === DEFAULT_ACCOUNT_ID;
}

function shouldWriteDefaultWhatsAppAccountConfigAtAccountScope(cfg: OpenClawConfig): boolean {
  const accounts = cfg.channels?.whatsapp?.accounts;
  if (!accounts) {
    return false;
  }
  if (accounts.default) {
    return true;
  }
  return Object.keys(accounts).some((accountId) => !isDefaultWhatsAppAccountKey(accountId));
}

function resolveDefaultWhatsAppAccountWriteKey(cfg: OpenClawConfig): string {
  const accounts = cfg.channels?.whatsapp?.accounts;
  if (!accounts) {
    return DEFAULT_ACCOUNT_ID;
  }
  const match = Object.keys(accounts).find((accountId) => isDefaultWhatsAppAccountKey(accountId));
  return match ?? DEFAULT_ACCOUNT_ID;
}

function resolveWhatsAppConfigPathPrefix(cfg: OpenClawConfig, accountId: string): string {
  if (
    accountId === DEFAULT_ACCOUNT_ID &&
    shouldWriteDefaultWhatsAppAccountConfigAtAccountScope(cfg)
  ) {
    return `channels.whatsapp.accounts.${resolveDefaultWhatsAppAccountWriteKey(cfg)}`;
  }
  return accountId === DEFAULT_ACCOUNT_ID
    ? "channels.whatsapp"
    : `channels.whatsapp.accounts.${accountId}`;
}

>>>>>>> upstream/main
function mergeWhatsAppConfig(
  cfg: OpenClawConfig,
  accountId: string,
  patch: Partial<WhatsAppAccountConfig>,
  options?: { unsetOnUndefined?: string[] },
): OpenClawConfig {
<<<<<<< HEAD
  const channelConfig: WhatsAppConfig = { ...(cfg.channels?.whatsapp ?? {}) };
  const mutableChannelConfig = channelConfig as Record<string, unknown>;
  if (accountId === DEFAULT_ACCOUNT_ID) {
=======
  const channelConfig: WhatsAppConfig = { ...cfg.channels?.whatsapp };
  const mutableChannelConfig = channelConfig as Record<string, unknown>;
  const targetPathPrefix = resolveWhatsAppConfigPathPrefix(cfg, accountId);
  if (targetPathPrefix === "channels.whatsapp") {
>>>>>>> upstream/main
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) {
        if (options?.unsetOnUndefined?.includes(key)) {
          delete mutableChannelConfig[key];
        }
        continue;
      }
      mutableChannelConfig[key] = value;
    }
    return {
      ...cfg,
      channels: {
        ...cfg.channels,
        whatsapp: channelConfig,
      },
    };
  }
  const accounts = {
<<<<<<< HEAD
    ...((channelConfig.accounts as Record<string, WhatsAppAccountConfig> | undefined) ?? {}),
  };
  const nextAccount: WhatsAppAccountConfig = { ...(accounts[accountId] ?? {}) };
=======
    ...(channelConfig.accounts as Record<string, WhatsAppAccountConfig> | undefined),
  };
  const targetAccountId =
    accountId === DEFAULT_ACCOUNT_ID ? resolveDefaultWhatsAppAccountWriteKey(cfg) : accountId;
  const lowerDefaultAccount =
    accountId === DEFAULT_ACCOUNT_ID && targetAccountId !== DEFAULT_ACCOUNT_ID
      ? accounts[DEFAULT_ACCOUNT_ID]
      : undefined;
  const nextAccount: WhatsAppAccountConfig = {
    ...accounts[targetAccountId],
    ...lowerDefaultAccount,
  };
>>>>>>> upstream/main
  const mutableNextAccount = nextAccount as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      if (options?.unsetOnUndefined?.includes(key)) {
        delete mutableNextAccount[key];
      }
      continue;
    }
    mutableNextAccount[key] = value;
  }
<<<<<<< HEAD
  accounts[accountId] = nextAccount as WhatsAppAccountConfig;
=======
  accounts[targetAccountId] = nextAccount;
  if (lowerDefaultAccount) {
    delete accounts[DEFAULT_ACCOUNT_ID];
  }
>>>>>>> upstream/main
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      whatsapp: {
        ...channelConfig,
        accounts,
      },
    },
  };
}

function setWhatsAppDmPolicy(
  cfg: OpenClawConfig,
  accountId: string,
  dmPolicy: DmPolicy,
): OpenClawConfig {
  return mergeWhatsAppConfig(cfg, accountId, { dmPolicy });
}

function setWhatsAppAllowFrom(
  cfg: OpenClawConfig,
  accountId: string,
  allowFrom?: string[],
): OpenClawConfig {
  return mergeWhatsAppConfig(cfg, accountId, { allowFrom }, { unsetOnUndefined: ["allowFrom"] });
}

function setWhatsAppSelfChatMode(
  cfg: OpenClawConfig,
  accountId: string,
  selfChatMode: boolean,
): OpenClawConfig {
  return mergeWhatsAppConfig(cfg, accountId, { selfChatMode });
}

<<<<<<< HEAD
export async function detectWhatsAppLinked(
  cfg: OpenClawConfig,
  accountId: string,
): Promise<boolean> {
  const { authDir } = resolveWhatsAppAuthDir({ cfg, accountId });
  const credsPath = path.join(authDir, "creds.json");
  return await pathExists(credsPath);
=======
async function detectWhatsAppLinked(cfg: OpenClawConfig, accountId: string): Promise<boolean> {
  const { authDir } = resolveWhatsAppAuthDir({ cfg, accountId });
  return hasWebCredsSync(authDir);
>>>>>>> upstream/main
}

async function promptWhatsAppOwnerAllowFrom(params: {
  existingAllowFrom: string[];
  prompter: SetupPrompter;
}): Promise<{ normalized: string; allowFrom: string[] }> {
  const { prompter, existingAllowFrom } = params;

<<<<<<< HEAD
  await prompter.note(
    "We need the sender/owner number so OpenClaw can allowlist you.",
    "WhatsApp number",
  );
  const entry = await prompter.text({
    message: "Your personal WhatsApp number (the phone you will message from)",
    placeholder: "+15555550123",
    initialValue: existingAllowFrom[0],
    validate: (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) {
        return "Required";
      }
      const normalized = normalizeE164(raw);
=======
  await prompter.note(t("wizard.whatsapp.ownerNumberNote"), t("wizard.whatsapp.numberTitle"));
  const entry = await prompter.text({
    message: t("wizard.whatsapp.personalNumberPrompt"),
    placeholder: "+15555550123",
    initialValue: existingAllowFrom[0],
    validate: (value) => {
      const raw = trimPromptText(value);
      if (!raw) {
        return t("common.required");
      }
      const normalized = normalizeWhatsAppAllowFromEntry(raw);
>>>>>>> upstream/main
      if (!normalized) {
        return `Invalid number: ${raw}`;
      }
      return undefined;
    },
  });

<<<<<<< HEAD
  const normalized = normalizeE164(String(entry).trim());
  if (!normalized) {
    throw new Error("Invalid WhatsApp owner number (expected E.164 after validation).");
  }
  const allowFrom = normalizeAllowFromEntries(
    [...existingAllowFrom.filter((item) => item !== "*"), normalized],
    normalizeE164,
  );
=======
  const normalized = normalizeWhatsAppAllowFromEntry(trimPromptText(entry));
  if (!normalized) {
    throw new Error("Invalid WhatsApp owner number (expected E.164 after validation).");
  }
  const allowFrom = normalizeWhatsAppAllowFromEntries([
    ...existingAllowFrom.filter((item) => item !== "*"),
    normalized,
  ]);
>>>>>>> upstream/main
  return { normalized, allowFrom };
}

async function applyWhatsAppOwnerAllowlist(params: {
  cfg: OpenClawConfig;
  accountId: string;
  existingAllowFrom: string[];
  messageLines: string[];
  prompter: SetupPrompter;
  title: string;
}): Promise<OpenClawConfig> {
  const { normalized, allowFrom } = await promptWhatsAppOwnerAllowFrom({
    prompter: params.prompter,
    existingAllowFrom: params.existingAllowFrom,
  });
  let next = setWhatsAppSelfChatMode(params.cfg, params.accountId, true);
  next = setWhatsAppDmPolicy(next, params.accountId, "allowlist");
  next = setWhatsAppAllowFrom(next, params.accountId, allowFrom);
  await params.prompter.note(
    [...params.messageLines, `- allowFrom includes ${normalized}`].join("\n"),
    params.title,
  );
  return next;
}

function parseWhatsAppAllowFromEntries(raw: string): { entries: string[]; invalidEntry?: string } {
  const parts = splitSetupEntries(raw);
  if (parts.length === 0) {
    return { entries: [] };
  }
  const entries: string[] = [];
  for (const part of parts) {
    if (part === "*") {
      entries.push("*");
      continue;
    }
<<<<<<< HEAD
    const normalized = normalizeE164(part);
=======
    const normalized = normalizeWhatsAppAllowFromEntry(part);
>>>>>>> upstream/main
    if (!normalized) {
      return { entries: [], invalidEntry: part };
    }
    entries.push(normalized);
  }
<<<<<<< HEAD
  return { entries: normalizeAllowFromEntries(entries, normalizeE164) };
=======
  return { entries: normalizeWhatsAppAllowFromEntries(entries) };
>>>>>>> upstream/main
}

async function promptWhatsAppDmAccess(params: {
  cfg: OpenClawConfig;
  accountId: string;
  forceAllowFrom: boolean;
  prompter: SetupPrompter;
}): Promise<OpenClawConfig> {
  const accountId = params.accountId.trim() || DEFAULT_ACCOUNT_ID;
  const account = resolveWhatsAppAccount({ cfg: params.cfg, accountId });
  const existingPolicy = account.dmPolicy ?? "pairing";
  const existingAllowFrom = account.allowFrom ?? [];
  const existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
<<<<<<< HEAD
  const policyKey =
    accountId === DEFAULT_ACCOUNT_ID
      ? "channels.whatsapp.dmPolicy"
      : `channels.whatsapp.accounts.${accountId}.dmPolicy`;
  const allowFromKey =
    accountId === DEFAULT_ACCOUNT_ID
      ? "channels.whatsapp.allowFrom"
      : `channels.whatsapp.accounts.${accountId}.allowFrom`;
=======
  const configPathPrefix = resolveWhatsAppConfigPathPrefix(params.cfg, accountId);
  const policyKey = `${configPathPrefix}.dmPolicy`;
  const allowFromKey = `${configPathPrefix}.allowFrom`;
>>>>>>> upstream/main

  if (params.forceAllowFrom) {
    return await applyWhatsAppOwnerAllowlist({
      cfg: params.cfg,
      accountId,
      prompter: params.prompter,
      existingAllowFrom,
<<<<<<< HEAD
      title: "WhatsApp allowlist",
      messageLines: ["Allowlist mode enabled."],
=======
      title: t("wizard.whatsapp.allowlistTitle"),
      messageLines: [t("wizard.whatsapp.allowlistModeEnabled")],
>>>>>>> upstream/main
    });
  }

  await params.prompter.note(
    [
      `WhatsApp direct chats are gated by \`${policyKey}\` + \`${allowFromKey}\`.`,
      "- pairing (default): unknown senders get a pairing code; owner approves",
      "- allowlist: unknown senders are blocked",
      '- open: public inbound DMs (requires allowFrom to include "*")',
      "- disabled: ignore WhatsApp DMs",
      "",
      `Current: dmPolicy=${existingPolicy}, allowFrom=${existingLabel}`,
<<<<<<< HEAD
      `Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`,
    ].join("\n"),
    "WhatsApp DM access",
  );

  const phoneMode = await params.prompter.select({
    message: "WhatsApp phone setup",
    options: [
      { value: "personal", label: "This is my personal phone number" },
      { value: "separate", label: "Separate phone just for OpenClaw" },
=======
      t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") }),
    ].join("\n"),
    t("wizard.whatsapp.dmAccessTitle"),
  );

  const phoneMode = await params.prompter.select({
    message: t("wizard.whatsapp.phoneSetupPrompt"),
    options: [
      { value: "personal", label: t("wizard.whatsapp.personalPhoneLabel") },
      { value: "separate", label: t("wizard.whatsapp.separatePhoneLabel") },
>>>>>>> upstream/main
    ],
  });

  if (phoneMode === "personal") {
    return await applyWhatsAppOwnerAllowlist({
      cfg: params.cfg,
      accountId,
      prompter: params.prompter,
      existingAllowFrom,
<<<<<<< HEAD
      title: "WhatsApp personal phone",
      messageLines: [
        "Personal phone mode enabled.",
        "- dmPolicy set to allowlist (pairing skipped)",
=======
      title: t("wizard.whatsapp.personalPhoneTitle"),
      messageLines: [
        t("wizard.whatsapp.personalPhoneModeEnabled"),
        t("wizard.whatsapp.dmPolicySetAllowlist"),
>>>>>>> upstream/main
      ],
    });
  }

  const policy = (await params.prompter.select({
<<<<<<< HEAD
    message: "WhatsApp DM policy",
    options: [
      { value: "pairing", label: "Pairing (recommended)" },
      { value: "allowlist", label: "Allowlist only (block unknown senders)" },
      { value: "open", label: "Open (public inbound DMs)" },
      { value: "disabled", label: "Disabled (ignore WhatsApp DMs)" },
=======
    message: t("wizard.whatsapp.dmPolicyPrompt"),
    options: [
      { value: "pairing", label: t("wizard.channels.dmPolicyPairing") },
      { value: "allowlist", label: t("wizard.whatsapp.dmPolicyAllowlistOnly") },
      { value: "open", label: t("wizard.channels.dmPolicyOpenOption") },
      { value: "disabled", label: t("wizard.whatsapp.dmPolicyDisabled") },
>>>>>>> upstream/main
    ],
  })) as DmPolicy;

  let next = setWhatsAppSelfChatMode(params.cfg, accountId, false);
  next = setWhatsAppDmPolicy(next, accountId, policy);
  if (policy === "open") {
<<<<<<< HEAD
    const allowFrom = normalizeAllowFromEntries(["*", ...existingAllowFrom], normalizeE164);
=======
    const allowFrom = normalizeWhatsAppAllowFromEntries(["*", ...existingAllowFrom]);
>>>>>>> upstream/main
    next = setWhatsAppAllowFrom(next, accountId, allowFrom.length > 0 ? allowFrom : ["*"]);
    return next;
  }
  if (policy === "disabled") {
    return next;
  }

  const allowOptions =
    existingAllowFrom.length > 0
      ? ([
<<<<<<< HEAD
          { value: "keep", label: "Keep current allowFrom" },
          {
            value: "unset",
            label: "Unset allowFrom (use pairing approvals only)",
          },
          { value: "list", label: "Set allowFrom to specific numbers" },
        ] as const)
      : ([
          { value: "unset", label: "Unset allowFrom (default)" },
          { value: "list", label: "Set allowFrom to specific numbers" },
        ] as const);

  const mode = await params.prompter.select({
    message: "WhatsApp allowFrom (optional pre-allowlist)",
=======
          { value: "keep", label: t("wizard.whatsapp.keepCurrentAllowFrom") },
          {
            value: "unset",
            label: t("wizard.whatsapp.unsetAllowFromPairing"),
          },
          { value: "list", label: t("wizard.whatsapp.setAllowFromNumbers") },
        ] as const)
      : ([
          { value: "unset", label: t("wizard.whatsapp.unsetAllowFromDefault") },
          { value: "list", label: t("wizard.whatsapp.setAllowFromNumbers") },
        ] as const);

  const mode = await params.prompter.select({
    message: t("wizard.whatsapp.allowFromPrompt"),
>>>>>>> upstream/main
    options: allowOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  });

  if (mode === "keep") {
    return next;
  }
  if (mode === "unset") {
    return setWhatsAppAllowFrom(next, accountId, undefined);
  }

  const allowRaw = await params.prompter.text({
<<<<<<< HEAD
    message: "Allowed sender numbers (comma-separated, E.164)",
    placeholder: "+15555550123, +447700900123",
    validate: (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) {
        return "Required";
      }
      const parsed = parseWhatsAppAllowFromEntries(raw);
      if (parsed.entries.length === 0 && !parsed.invalidEntry) {
        return "Required";
=======
    message: t("wizard.whatsapp.allowedSenderNumbers"),
    placeholder: "+15555550123, +447700900123",
    validate: (value) => {
      const raw = trimPromptText(value);
      if (!raw) {
        return t("common.required");
      }
      const parsed = parseWhatsAppAllowFromEntries(raw);
      if (parsed.entries.length === 0 && !parsed.invalidEntry) {
        return t("common.required");
>>>>>>> upstream/main
      }
      if (parsed.invalidEntry) {
        return `Invalid number: ${parsed.invalidEntry}`;
      }
      return undefined;
    },
  });

<<<<<<< HEAD
  const parsed = parseWhatsAppAllowFromEntries(String(allowRaw));
=======
  const parsed = parseWhatsAppAllowFromEntries(trimPromptText(allowRaw));
  if (parsed.invalidEntry) {
    throw new Error(`Invalid number: ${parsed.invalidEntry}`);
  }
  if (parsed.entries.length === 0) {
    throw new Error("Invalid WhatsApp allowFrom list (expected at least one E.164 number).");
  }
>>>>>>> upstream/main
  return setWhatsAppAllowFrom(next, accountId, parsed.entries);
}

export async function finalizeWhatsAppSetup(params: {
  cfg: OpenClawConfig;
  accountId: string;
  forceAllowFrom: boolean;
  prompter: SetupPrompter;
  runtime: SetupRuntime;
}) {
  const accountId = params.accountId.trim() || resolveDefaultWhatsAppAccountId(params.cfg);
  let next =
    accountId === DEFAULT_ACCOUNT_ID
      ? params.cfg
      : whatsappSetupAdapter.applyAccountConfig({
          cfg: params.cfg,
          accountId,
          input: {},
        });

  const linked = await detectWhatsAppLinked(next, accountId);
  const { authDir } = resolveWhatsAppAuthDir({
    cfg: next,
    accountId,
  });

  if (!linked) {
    await params.prompter.note(
      [
<<<<<<< HEAD
        "Scan the QR with WhatsApp on your phone.",
        `Credentials are stored under ${authDir}/ for future runs.`,
        `Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`,
      ].join("\n"),
      "WhatsApp linking",
=======
        t("wizard.whatsapp.scanQr"),
        t("wizard.whatsapp.credentialsStored", { authDir }),
        t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") }),
      ].join("\n"),
      t("wizard.whatsapp.linkingTitle"),
>>>>>>> upstream/main
    );
  }

  const wantsLink = await params.prompter.confirm({
<<<<<<< HEAD
    message: linked ? "WhatsApp already linked. Re-link now?" : "Link WhatsApp now (QR)?",
=======
    message: linked ? t("wizard.whatsapp.relinkPrompt") : t("wizard.whatsapp.linkNowPrompt"),
>>>>>>> upstream/main
    initialValue: !linked,
  });
  if (wantsLink) {
    try {
<<<<<<< HEAD
=======
      const { loginWeb } = await import("./login.js");
>>>>>>> upstream/main
      await loginWeb(false, undefined, params.runtime, accountId);
    } catch (error) {
      params.runtime.error(`WhatsApp login failed: ${String(error)}`);
      await params.prompter.note(
<<<<<<< HEAD
        `Docs: ${formatDocsLink("/whatsapp", "whatsapp")}`,
        "WhatsApp help",
=======
        t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") }),
        t("wizard.whatsapp.helpTitle"),
>>>>>>> upstream/main
      );
    }
  } else if (!linked) {
    await params.prompter.note(
<<<<<<< HEAD
      `Run \`${formatCliCommand("openclaw channels login")}\` later to link WhatsApp.`,
=======
      t("wizard.whatsapp.linkLater", {
        command: formatCliCommand("openclaw channels login"),
      }),
>>>>>>> upstream/main
      "WhatsApp",
    );
  }

  next = await promptWhatsAppDmAccess({
    cfg: next,
    accountId,
    forceAllowFrom: params.forceAllowFrom,
    prompter: params.prompter,
  });
  return { cfg: next };
}
