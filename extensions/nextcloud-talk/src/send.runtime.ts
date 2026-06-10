<<<<<<< HEAD
export { resolveMarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
export { ssrfPolicyFromPrivateNetworkOptIn } from "openclaw/plugin-sdk/ssrf-runtime";
export { convertMarkdownTables } from "openclaw/plugin-sdk/text-runtime";
=======
// Nextcloud Talk plugin module implements send behavior.
export { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
export { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
export { ssrfPolicyFromPrivateNetworkOptIn } from "openclaw/plugin-sdk/ssrf-runtime";
export { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
>>>>>>> upstream/main
export { fetchWithSsrFGuard } from "../runtime-api.js";
export { resolveNextcloudTalkAccount } from "./accounts.js";
export { getNextcloudTalkRuntime } from "./runtime.js";
export { generateNextcloudTalkSignature } from "./signature.js";
