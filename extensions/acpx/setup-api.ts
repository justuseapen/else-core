<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
=======
/**
 * ACPX setup plugin entry. It auto-enables setup when ACP config already points
 * at the embedded ACPX runtime backend.
 */
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main

export default definePluginEntry({
  id: "acpx",
  name: "ACPX Setup",
  description: "Lightweight ACPX setup hooks",
  register(api) {
    api.registerAutoEnableProbe(({ config }) => {
<<<<<<< HEAD
      const backendRaw =
        typeof config.acp?.backend === "string" ? config.acp.backend.trim().toLowerCase() : "";
=======
      const backendRaw = normalizeLowercaseStringOrEmpty(config.acp?.backend);
>>>>>>> upstream/main
      const configured =
        config.acp?.enabled === true ||
        config.acp?.dispatch?.enabled === true ||
        backendRaw === "acpx";
      return configured && (!backendRaw || backendRaw === "acpx") ? "ACP runtime configured" : null;
    });
  },
});
