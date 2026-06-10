<<<<<<< HEAD
import { RequestClient } from "@buape/carbon";
import { loadConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RetryConfig, RetryRunner } from "openclaw/plugin-sdk/retry-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
=======
// Discord plugin module implements client behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import type { RetryConfig, RetryRunner } from "openclaw/plugin-sdk/retry-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import {
  mergeDiscordAccountConfig,
  resolveDiscordAccount,
  type ResolvedDiscordAccount,
} from "./accounts.js";
<<<<<<< HEAD
=======
import { RequestClient } from "./internal/discord.js";
>>>>>>> upstream/main
import { resolveDiscordProxyFetchForAccount } from "./proxy-fetch.js";
import { createDiscordRequestClient } from "./proxy-request-client.js";
import { createDiscordRetryRunner } from "./retry.js";
import type { DiscordRuntimeAccountContext } from "./send.types.js";
import { normalizeDiscordToken } from "./token.js";

export type DiscordClientOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  rest?: RequestClient;
  retry?: RetryConfig;
  verbose?: boolean;
};

export function createDiscordRuntimeAccountContext(params: {
<<<<<<< HEAD
  cfg: ReturnType<typeof loadConfig>;
=======
  cfg: OpenClawConfig;
>>>>>>> upstream/main
  accountId: string;
}): DiscordRuntimeAccountContext {
  return {
    cfg: params.cfg,
    accountId: normalizeAccountId(params.accountId),
  };
}

export function resolveDiscordClientAccountContext(
  opts: Pick<DiscordClientOpts, "cfg" | "accountId">,
<<<<<<< HEAD
  cfg?: ReturnType<typeof loadConfig>,
  runtime?: Pick<RuntimeEnv, "error">,
) {
  const resolvedCfg = opts.cfg ?? cfg ?? loadConfig();
=======
  runtime?: Pick<RuntimeEnv, "error">,
) {
  const resolvedCfg = requireRuntimeConfig(opts.cfg, "Discord client");
>>>>>>> upstream/main
  const account = resolveAccountWithoutToken({
    cfg: resolvedCfg,
    accountId: opts.accountId,
  });
  return {
    cfg: resolvedCfg,
    account,
    proxyFetch: resolveDiscordProxyFetchForAccount(account, resolvedCfg, runtime),
  };
}

<<<<<<< HEAD
function resolveToken(params: { accountId: string; fallbackToken?: string }) {
=======
function resolveToken(params: {
  account: ResolvedDiscordAccount;
  accountId: string;
  fallbackToken?: string;
}) {
>>>>>>> upstream/main
  const fallback = normalizeDiscordToken(params.fallbackToken, "channels.discord.token");
  if (!fallback) {
    if (params.account.tokenStatus === "configured_unavailable") {
      throw new Error(
        `Discord bot token configured for account "${params.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`,
      );
    }
    throw new Error(
      `Discord bot token missing for account "${params.accountId}" (set discord.accounts.${params.accountId}.token or DISCORD_BOT_TOKEN for default).`,
    );
  }
  return fallback;
}

<<<<<<< HEAD
export function resolveDiscordProxyFetch(
  opts: Pick<DiscordClientOpts, "cfg" | "accountId">,
  cfg?: ReturnType<typeof loadConfig>,
  runtime?: Pick<RuntimeEnv, "error">,
): typeof fetch | undefined {
  return resolveDiscordClientAccountContext(opts, cfg, runtime).proxyFetch;
}

function resolveRest(
  token: string,
  account: ResolvedDiscordAccount,
  cfg: ReturnType<typeof loadConfig>,
=======
function resolveRest(
  token: string,
  account: ResolvedDiscordAccount,
  cfg: OpenClawConfig,
>>>>>>> upstream/main
  rest?: RequestClient,
  proxyFetch?: typeof fetch,
) {
  if (rest) {
    return rest;
  }
  const resolvedProxyFetch = proxyFetch ?? resolveDiscordProxyFetchForAccount(account, cfg);
  return createDiscordRequestClient(
    token,
    resolvedProxyFetch ? { fetch: resolvedProxyFetch } : undefined,
  );
}

function resolveAccountWithoutToken(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedDiscordAccount {
  const accountId = normalizeAccountId(params.accountId);
  const merged = mergeDiscordAccountConfig(params.cfg, accountId);
  const baseEnabled = params.cfg.channels?.discord?.enabled !== false;
  const accountEnabled = merged.enabled !== false;
  return {
    accountId,
    enabled: baseEnabled && accountEnabled,
    name: normalizeOptionalString(merged.name),
    token: "",
    tokenSource: "none",
    tokenStatus: "missing",
    config: merged,
  };
}

<<<<<<< HEAD
export function createDiscordRestClient(
  opts: DiscordClientOpts,
  cfg?: ReturnType<typeof loadConfig>,
) {
  const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
  const proxyContext = resolveDiscordClientAccountContext(opts, cfg);
=======
export function createDiscordRestClient(opts: DiscordClientOpts) {
  const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
  const proxyContext = resolveDiscordClientAccountContext(opts);
>>>>>>> upstream/main
  const resolvedCfg = proxyContext.cfg;
  const account = explicitToken
    ? proxyContext.account
    : resolveDiscordAccount({ cfg: resolvedCfg, accountId: opts.accountId });
  const token =
    explicitToken ??
    resolveToken({
      account,
      accountId: account.accountId,
      fallbackToken: account.token,
    });
  const rest = resolveRest(token, account, resolvedCfg, opts.rest, proxyContext.proxyFetch);
  return { token, rest, account };
}

export function createDiscordClient(opts: DiscordClientOpts): {
  token: string;
  rest: RequestClient;
  request: RetryRunner;
} {
  const { token, rest, account } = createDiscordRestClient(opts);
  const request = createDiscordRetryRunner({
    retry: opts.retry,
    configRetry: account.config.retry,
    verbose: opts.verbose,
  });
  return { token, rest, request };
}

export function resolveDiscordRest(opts: DiscordClientOpts) {
  return createDiscordRestClient(opts).rest;
}
