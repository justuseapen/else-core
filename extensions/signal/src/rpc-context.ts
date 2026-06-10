<<<<<<< HEAD
=======
// Signal plugin module implements rpc context behavior.
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main
import { resolveSignalAccount } from "./accounts.js";

export function resolveSignalRpcContext(
  opts: { baseUrl?: string; account?: string; accountId?: string },
  accountInfo?: ReturnType<typeof resolveSignalAccount>,
) {
<<<<<<< HEAD
  const hasBaseUrl = Boolean(opts.baseUrl?.trim());
  const hasAccount = Boolean(opts.account?.trim());
=======
  const hasBaseUrl = Boolean(normalizeOptionalString(opts.baseUrl));
  const hasAccount = Boolean(normalizeOptionalString(opts.account));
>>>>>>> upstream/main
  if ((!hasBaseUrl || !hasAccount) && !accountInfo) {
    throw new Error("Signal account config is required when baseUrl or account is missing");
  }
  const resolvedAccount = accountInfo;
<<<<<<< HEAD
  const baseUrl = opts.baseUrl?.trim() || resolvedAccount?.baseUrl;
=======
  const baseUrl = normalizeOptionalString(opts.baseUrl) ?? resolvedAccount?.baseUrl;
>>>>>>> upstream/main
  if (!baseUrl) {
    throw new Error("Signal base URL is required");
  }
  const account =
    normalizeOptionalString(opts.account) ??
    normalizeOptionalString(resolvedAccount?.config.account);
  return { baseUrl, account };
}
