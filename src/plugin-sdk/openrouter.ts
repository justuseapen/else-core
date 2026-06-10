// Manual facade. Keep loader boundary explicit.
<<<<<<< HEAD
type FacadeModule = typeof import("@openclaw/openrouter/api.js");
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";
=======
import type { ModelProviderConfig, OpenClawConfig } from "../config/types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  applyOpenrouterConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  applyOpenrouterProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  buildOpenrouterProvider: () => ModelProviderConfig;
  OPENROUTER_DEFAULT_MODEL_REF: string;
};
>>>>>>> upstream/main

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "openrouter",
    artifactBasename: "api.js",
  });
}
<<<<<<< HEAD
export const applyOpenrouterConfig: FacadeModule["applyOpenrouterConfig"] = ((...args) =>
  loadFacadeModule()["applyOpenrouterConfig"](...args)) as FacadeModule["applyOpenrouterConfig"];
=======
/** Apply OpenRouter defaults to the full OpenClaw config. */
export const applyOpenrouterConfig: FacadeModule["applyOpenrouterConfig"] = ((...args) =>
  loadFacadeModule()["applyOpenrouterConfig"](...args)) as FacadeModule["applyOpenrouterConfig"];
/** Apply only OpenRouter provider config defaults. */
>>>>>>> upstream/main
export const applyOpenrouterProviderConfig: FacadeModule["applyOpenrouterProviderConfig"] = ((
  ...args
) =>
  loadFacadeModule()["applyOpenrouterProviderConfig"](
    ...args,
  )) as FacadeModule["applyOpenrouterProviderConfig"];
<<<<<<< HEAD
=======
/** Build the OpenRouter model provider entry used by setup/config helpers. */
>>>>>>> upstream/main
export const buildOpenrouterProvider: FacadeModule["buildOpenrouterProvider"] = ((...args) =>
  loadFacadeModule()["buildOpenrouterProvider"](
    ...args,
  )) as FacadeModule["buildOpenrouterProvider"];
<<<<<<< HEAD
=======
/** Default OpenRouter provider/model reference written by setup flows. */
>>>>>>> upstream/main
export const OPENROUTER_DEFAULT_MODEL_REF: FacadeModule["OPENROUTER_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["OPENROUTER_DEFAULT_MODEL_REF"];
