<<<<<<< HEAD
type FacadeModule = typeof import("@openclaw/anthropic-vertex/api.js");
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";

=======
/**
 * Public SDK facade for Anthropic Vertex implicit provider discovery and config helpers.
 */
import type { ModelProviderConfig } from "../config/types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";

type FacadeModule = {
  resolveAnthropicVertexClientRegion: (params?: {
    baseUrl?: string;
    env?: NodeJS.ProcessEnv;
  }) => string;
  resolveAnthropicVertexProjectId: (env?: NodeJS.ProcessEnv) => string | undefined;
  buildAnthropicVertexProvider: (params?: { env?: NodeJS.ProcessEnv }) => ModelProviderConfig;
  resolveImplicitAnthropicVertexProvider: (params?: {
    env?: NodeJS.ProcessEnv;
  }) => ModelProviderConfig | null;
  mergeImplicitAnthropicVertexProvider: (params: {
    existing?: ModelProviderConfig;
    implicit: ModelProviderConfig;
  }) => ModelProviderConfig;
};

>>>>>>> upstream/main
function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "anthropic-vertex",
    artifactBasename: "api.js",
  });
}

<<<<<<< HEAD
=======
/** Resolves the Anthropic Vertex region through the activated bundled provider facade. */
>>>>>>> upstream/main
export const resolveAnthropicVertexClientRegion: FacadeModule["resolveAnthropicVertexClientRegion"] =
  ((...args) =>
    loadFacadeModule().resolveAnthropicVertexClientRegion(
      ...args,
    )) as FacadeModule["resolveAnthropicVertexClientRegion"];

<<<<<<< HEAD
=======
/** Resolves the Anthropic Vertex project id through the activated provider facade. */
>>>>>>> upstream/main
export const resolveAnthropicVertexProjectId: FacadeModule["resolveAnthropicVertexProjectId"] = ((
  ...args
) =>
  loadFacadeModule().resolveAnthropicVertexProjectId(
    ...args,
  )) as FacadeModule["resolveAnthropicVertexProjectId"];
