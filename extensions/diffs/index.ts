<<<<<<< HEAD
import path from "node:path";
import {
  definePluginEntry,
  resolvePreferredOpenClawTmpDir,
  type OpenClawPluginApi,
} from "./api.js";
import {
  diffsPluginConfigSchema,
  resolveDiffsPluginDefaults,
  resolveDiffsPluginSecurity,
  resolveDiffsPluginViewerBaseUrl,
} from "./src/config.js";
import { createDiffsHttpHandler } from "./src/http.js";
import { DIFFS_AGENT_GUIDANCE } from "./src/prompt-guidance.js";
import { DiffArtifactStore } from "./src/store.js";
import { createDiffsTool } from "./src/tool.js";
=======
// Diffs plugin entrypoint registers its OpenClaw integration.
import { definePluginEntry } from "./api.js";
import { diffsPluginConfigSchema } from "./src/config.js";
import { registerDiffsPlugin } from "./src/plugin.js";
>>>>>>> upstream/main

export default definePluginEntry({
  id: "diffs",
  name: "Diffs",
  description: "Read-only diff viewer and PNG/PDF renderer for agents.",
  configSchema: diffsPluginConfigSchema,
<<<<<<< HEAD
  register(api: OpenClawPluginApi) {
    const defaults = resolveDiffsPluginDefaults(api.pluginConfig);
    const security = resolveDiffsPluginSecurity(api.pluginConfig);
    const viewerBaseUrl = resolveDiffsPluginViewerBaseUrl(api.pluginConfig);
    const store = new DiffArtifactStore({
      rootDir: path.join(resolvePreferredOpenClawTmpDir(), "openclaw-diffs"),
      logger: api.logger,
    });

    api.registerTool(
      (ctx) => createDiffsTool({ api, store, defaults, viewerBaseUrl, context: ctx }),
      {
        name: "diffs",
      },
    );
    api.registerHttpRoute({
      path: "/plugins/diffs",
      auth: "plugin",
      match: "prefix",
      handler: createDiffsHttpHandler({
        store,
        logger: api.logger,
        allowRemoteViewer: security.allowRemoteViewer,
        trustedProxies: api.config.gateway?.trustedProxies,
        allowRealIpFallback: api.config.gateway?.allowRealIpFallback === true,
      }),
    });
    api.on("before_prompt_build", async () => ({
      prependSystemContext: DIFFS_AGENT_GUIDANCE,
    }));
  },
=======
  register: registerDiffsPlugin,
>>>>>>> upstream/main
});
