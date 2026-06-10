<<<<<<< HEAD
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { listSlackAccountIds, resolveSlackAccount } from "../accounts.js";
import { normalizeSlackWebhookPath } from "./paths.js";

let slackHttpHandlerRuntimePromise: Promise<typeof import("./handler.runtime.js")> | null = null;

async function loadSlackHttpHandlerRuntime() {
  slackHttpHandlerRuntimePromise ??= import("./handler.runtime.js");
  return await slackHttpHandlerRuntimePromise;
}

export function registerSlackPluginHttpRoutes(api: OpenClawPluginApi): void {
  const accountIds = new Set<string>([DEFAULT_ACCOUNT_ID, ...listSlackAccountIds(api.config)]);
  const registeredPaths = new Set<string>();
  for (const accountId of accountIds) {
    const account = resolveSlackAccount({ cfg: api.config, accountId });
    registeredPaths.add(normalizeSlackWebhookPath(account.config.webhookPath));
  }
  if (registeredPaths.size === 0) {
    registeredPaths.add(normalizeSlackWebhookPath());
  }
  for (const path of registeredPaths) {
    api.registerHttpRoute({
      path,
      auth: "plugin",
      handler: async (req, res) =>
        await (await loadSlackHttpHandlerRuntime()).handleSlackHttpRequest(req, res),
=======
// Slack plugin module implements plugin routes behavior.
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/channel-plugin-common";
import { normalizeSlackWebhookPath } from "./paths.js";
import { handleSlackHttpRequest } from "./registry.js";

type SlackWebhookConfig = {
  webhookPath?: unknown;
  accounts?: Record<string, { webhookPath?: unknown } | undefined>;
};

function resolveSlackWebhookPaths(config: OpenClawPluginApi["config"]): string[] {
  const slack = config.channels?.slack as SlackWebhookConfig | undefined;
  const accountConfigs = slack?.accounts ?? {};
  const paths = new Set<string>();
  for (const accountId of new Set([DEFAULT_ACCOUNT_ID, ...Object.keys(accountConfigs)])) {
    const path = accountConfigs[accountId]?.webhookPath ?? slack?.webhookPath;
    paths.add(normalizeSlackWebhookPath(typeof path === "string" ? path : undefined));
  }
  return [...paths].toSorted((left, right) => left.localeCompare(right));
}

export function registerSlackPluginHttpRoutes(api: OpenClawPluginApi): void {
  for (const path of resolveSlackWebhookPaths(api.config)) {
    api.registerHttpRoute({
      path,
      auth: "plugin",
      handler: async (req, res) => await handleSlackHttpRequest(req, res),
>>>>>>> upstream/main
    });
  }
}
