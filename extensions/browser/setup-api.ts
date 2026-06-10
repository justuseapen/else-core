<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/plugin-entry";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
=======
/**
 * Browser setup entry. It auto-enables the Browser plugin when config or tool
 * policies reference browser control.
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk/plugin-entry";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isRecord } from "./src/record-shared.js";
>>>>>>> upstream/main

function listContainsBrowser(value: unknown): boolean {
  return (
    Array.isArray(value) &&
<<<<<<< HEAD
    value.some((entry) => typeof entry === "string" && entry.trim().toLowerCase() === "browser")
=======
    value.some((entry) => normalizeOptionalLowercaseString(entry) === "browser")
>>>>>>> upstream/main
  );
}

function toolPolicyReferencesBrowser(value: unknown): boolean {
  return (
    isRecord(value) && (listContainsBrowser(value.allow) || listContainsBrowser(value.alsoAllow))
  );
}

function hasBrowserToolReference(config: OpenClawConfig): boolean {
  if (toolPolicyReferencesBrowser(config.tools)) {
    return true;
  }
  const agentList = config.agents?.list;
  return Array.isArray(agentList)
    ? agentList.some((entry) => isRecord(entry) && toolPolicyReferencesBrowser(entry.tools))
    : false;
}

<<<<<<< HEAD
=======
/** Setup entry that detects existing Browser configuration references. */
>>>>>>> upstream/main
export default definePluginEntry({
  id: "browser",
  name: "Browser Setup",
  description: "Lightweight Browser setup hooks",
  register(api) {
    api.registerAutoEnableProbe(({ config }) => {
      if (
        config.browser?.enabled === false ||
        config.plugins?.entries?.browser?.enabled === false
      ) {
        return null;
      }
<<<<<<< HEAD
      if (Object.prototype.hasOwnProperty.call(config, "browser")) {
        return "browser configured";
      }
      if (
        config.plugins?.entries &&
        Object.prototype.hasOwnProperty.call(config.plugins.entries, "browser")
      ) {
=======
      if (Object.hasOwn(config, "browser")) {
        return "browser configured";
      }
      if (config.plugins?.entries && Object.hasOwn(config.plugins.entries, "browser")) {
>>>>>>> upstream/main
        return "browser plugin configured";
      }
      if (hasBrowserToolReference(config)) {
        return "browser tool referenced";
      }
      return null;
    });
  },
});
