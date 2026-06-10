<<<<<<< HEAD
=======
// Matrix API module exposes the plugin public contract.
>>>>>>> upstream/main
export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "openclaw/plugin-sdk/account-id";
<<<<<<< HEAD
export { isPrivateOrLoopbackHost } from "./private-network-host.js";
export {
  assertHttpUrlTargetsPrivateNetwork,
  isPrivateNetworkOptInEnabled,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromAllowPrivateNetwork,
  type LookupFn,
  type SsrFPolicy,
=======
export {
  isPrivateNetworkOptInEnabled,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
>>>>>>> upstream/main
} from "openclaw/plugin-sdk/ssrf-runtime";
