// Manual facade. Keep loader boundary explicit.
<<<<<<< HEAD
type FacadeModule = typeof import("@openclaw/github-copilot/api.js");
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";
=======
import type { RuntimeEnv } from "../runtime.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  githubCopilotLoginCommand: (
    opts: { profileId?: string; yes?: boolean; agentDir?: string },
    runtime: RuntimeEnv,
  ) => Promise<void>;
};
>>>>>>> upstream/main

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "github-copilot",
    artifactBasename: "api.js",
  });
}
<<<<<<< HEAD
=======

/** @deprecated GitHub Copilot provider-owned login helper; use provider auth hooks instead. */
>>>>>>> upstream/main
export const githubCopilotLoginCommand: FacadeModule["githubCopilotLoginCommand"] = ((...args) =>
  loadFacadeModule()["githubCopilotLoginCommand"](
    ...args,
  )) as FacadeModule["githubCopilotLoginCommand"];
