<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
=======
// Qa Channel setup module handles plugin onboarding behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
import { DEFAULT_ACCOUNT_ID } from "./accounts.js";
import type { CoreConfig } from "./types.js";

export function applyQaSetup(params: {
  cfg: OpenClawConfig;
  accountId: string;
  input: Record<string, unknown>;
}): OpenClawConfig {
  const nextCfg = structuredClone(params.cfg) as CoreConfig;
  const section = nextCfg.channels?.["qa-channel"] ?? {};
<<<<<<< HEAD
  const accounts = { ...(section.accounts ?? {}) };
  const target =
    params.accountId === DEFAULT_ACCOUNT_ID
      ? { ...section }
      : { ...(accounts[params.accountId] ?? {}) };
=======
  const accounts = { ...section.accounts };
  const target =
    params.accountId === DEFAULT_ACCOUNT_ID ? { ...section } : { ...accounts[params.accountId] };
>>>>>>> upstream/main
  if (typeof params.input.baseUrl === "string") {
    target.baseUrl = params.input.baseUrl;
  }
  if (typeof params.input.botUserId === "string") {
    target.botUserId = params.input.botUserId;
  }
  if (typeof params.input.botDisplayName === "string") {
    target.botDisplayName = params.input.botDisplayName;
  }
  nextCfg.channels ??= {};
  if (params.accountId === DEFAULT_ACCOUNT_ID) {
    nextCfg.channels["qa-channel"] = {
      ...section,
      ...target,
    };
  } else {
    accounts[params.accountId] = target;
    nextCfg.channels["qa-channel"] = {
      ...section,
      accounts,
    };
  }
  return nextCfg as OpenClawConfig;
}
