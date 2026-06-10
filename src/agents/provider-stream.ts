/**
 * Provider stream registration entry point.
 * Resolves plugin-owned or transport-aware stream functions and registers the
 * model API once a concrete stream implementation exists.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Api, Model } from "../llm/types.js";
import { resolveProviderStreamFn } from "../plugins/provider-runtime.js";
import { ensureCustomApiRegistered } from "./custom-api-registry.js";
import { createTransportAwareStreamFnForModel } from "./provider-transport-stream.js";
<<<<<<< HEAD
=======
import type { StreamFn } from "./runtime/index.js";
>>>>>>> upstream/main

/** Resolves and registers the stream function for a provider-backed model. */
export function registerProviderStreamForModel<TApi extends Api>(params: {
  model: Model<TApi>;
  cfg?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  allowRuntimePluginLoad?: boolean;
}): StreamFn | undefined {
  const streamFn =
    resolveProviderStreamFn({
      provider: params.model.provider,
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
<<<<<<< HEAD
=======
      allowRuntimePluginLoad: params.allowRuntimePluginLoad,
>>>>>>> upstream/main
      context: {
        config: params.cfg,
        agentDir: params.agentDir,
        workspaceDir: params.workspaceDir,
        provider: params.model.provider,
        modelId: params.model.id,
        model: params.model,
      },
<<<<<<< HEAD
    }) ?? createTransportAwareStreamFnForModel(params.model);
=======
    }) ??
    createTransportAwareStreamFnForModel(params.model, {
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      env: params.env,
    });
>>>>>>> upstream/main
  if (!streamFn) {
    return undefined;
  }
  // Register custom APIs only after a concrete stream exists, so later callers
  // can route by model.api without reloading provider runtime hooks.
  ensureCustomApiRegistered(params.model.api, streamFn);
  return streamFn;
}
