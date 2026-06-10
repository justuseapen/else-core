<<<<<<< HEAD
import { isIP } from "node:net";
import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { makeProxyFetch } from "openclaw/plugin-sdk/infra-runtime";
import { danger } from "openclaw/plugin-sdk/runtime-env";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { ResolvedDiscordAccount } from "./accounts.js";

export function resolveDiscordProxyUrl(
  account: Pick<ResolvedDiscordAccount, "config">,
  cfg?: OpenClawConfig,
=======
// Discord plugin module implements proxy fetch behavior.
import { isIP } from "node:net";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { danger } from "openclaw/plugin-sdk/runtime-env";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import type { ResolvedDiscordAccount } from "./accounts.js";

function resolveDiscordProxyUrl(
  account: Pick<ResolvedDiscordAccount, "config">,
  cfg: OpenClawConfig,
>>>>>>> upstream/main
): string | undefined {
  const accountProxy = account.config.proxy?.trim();
  if (accountProxy) {
    return accountProxy;
  }
  const channelProxy = cfg?.channels?.discord?.proxy;
  if (typeof channelProxy !== "string") {
    return undefined;
  }
  const trimmed = channelProxy.trim();
  return trimmed || undefined;
}

<<<<<<< HEAD
export function resolveDiscordProxyFetchByUrl(
=======
function resolveDiscordProxyFetchByUrl(
>>>>>>> upstream/main
  proxyUrl: string | undefined,
  runtime?: Pick<RuntimeEnv, "error">,
): typeof fetch | undefined {
  return withValidatedDiscordProxy(proxyUrl, runtime, (proxy) => makeProxyFetch(proxy));
}

export function resolveDiscordProxyFetchForAccount(
  account: Pick<ResolvedDiscordAccount, "config">,
<<<<<<< HEAD
  cfg?: OpenClawConfig,
=======
  cfg: OpenClawConfig,
>>>>>>> upstream/main
  runtime?: Pick<RuntimeEnv, "error">,
): typeof fetch | undefined {
  return resolveDiscordProxyFetchByUrl(resolveDiscordProxyUrl(account, cfg), runtime);
}

export function withValidatedDiscordProxy<T>(
  proxyUrl: string | undefined,
  runtime: Pick<RuntimeEnv, "error"> | undefined,
  createValue: (proxyUrl: string) => T,
): T | undefined {
  const proxy = proxyUrl?.trim();
  if (!proxy) {
    return undefined;
  }
  try {
    validateDiscordProxyUrl(proxy);
    return createValue(proxy);
  } catch (err) {
    runtime?.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
    return undefined;
  }
}

export function validateDiscordProxyUrl(proxyUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(proxyUrl);
  } catch {
    throw new Error("Proxy URL must be a valid http or https URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Proxy URL must use http or https");
  }
  if (!isLoopbackProxyHostname(parsed.hostname)) {
    throw new Error("Proxy URL must target a loopback host");
  }
  return proxyUrl;
}

function isLoopbackProxyHostname(hostname: string): boolean {
<<<<<<< HEAD
  const normalized = hostname.trim().toLowerCase();
=======
  const normalized = normalizeLowercaseStringOrEmpty(hostname);
>>>>>>> upstream/main
  if (!normalized) {
    return false;
  }
  const bracketless =
    normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized;
  if (bracketless === "localhost") {
    return true;
  }
  const ipFamily = isIP(bracketless);
  if (ipFamily === 4) {
    return bracketless.startsWith("127.");
  }
  if (ipFamily === 6) {
    return bracketless === "::1" || bracketless === "0:0:0:0:0:0:0:1";
  }
  return false;
}
