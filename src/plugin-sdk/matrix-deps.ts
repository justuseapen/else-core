// Manual facade. Keep loader boundary explicit.
<<<<<<< HEAD
type FacadeModule = typeof import("@openclaw/matrix/runtime-api.js");
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";
=======
import type { RuntimeEnv } from "../runtime.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  ensureMatrixSdkInstalled: (params: {
    runtime: RuntimeEnv;
    confirm?: (message: string) => Promise<boolean>;
  }) => Promise<void>;
  isMatrixSdkAvailable: () => boolean;
};
>>>>>>> upstream/main

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "matrix",
    artifactBasename: "runtime-api.js",
  });
}

<<<<<<< HEAD
export const ensureMatrixSdkInstalled: FacadeModule["ensureMatrixSdkInstalled"] = ((...args) =>
  loadFacadeModule().ensureMatrixSdkInstalled(...args)) as FacadeModule["ensureMatrixSdkInstalled"];
=======
/** Ensure Matrix plugin runtime dependencies are available before Matrix setup/use. */
export const ensureMatrixSdkInstalled: FacadeModule["ensureMatrixSdkInstalled"] = ((...args) =>
  loadFacadeModule().ensureMatrixSdkInstalled(...args)) as FacadeModule["ensureMatrixSdkInstalled"];
/** Returns whether Matrix SDK dependencies are currently importable. */
>>>>>>> upstream/main
export const isMatrixSdkAvailable: FacadeModule["isMatrixSdkAvailable"] = ((...args) =>
  loadFacadeModule().isMatrixSdkAvailable(...args)) as FacadeModule["isMatrixSdkAvailable"];
