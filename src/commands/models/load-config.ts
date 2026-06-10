<<<<<<< HEAD
=======
/** Config loader for model commands with command-scoped secret resolution. */
>>>>>>> upstream/main
import { resolveCommandConfigWithSecrets } from "../../cli/command-config-resolution.js";
import type { RuntimeEnv } from "../../runtime.js";
import {
  getRuntimeConfig,
<<<<<<< HEAD
  readSourceConfigSnapshotForWrite,
=======
  getRuntimeConfigSourceSnapshot,
>>>>>>> upstream/main
  setRuntimeConfigSnapshot,
  type OpenClawConfig,
  getModelsCommandSecretTargetIds,
} from "./load-config.runtime.js";

/** Source and resolved config pair returned by model command config loading. */
export type LoadedModelsConfig = {
  sourceConfig: OpenClawConfig;
  resolvedConfig: OpenClawConfig;
  diagnostics: string[];
};

<<<<<<< HEAD
async function loadSourceConfigSnapshot(fallback: OpenClawConfig): Promise<OpenClawConfig> {
  try {
    const { snapshot } = await readSourceConfigSnapshotForWrite();
    if (snapshot.valid) {
      return snapshot.sourceConfig;
    }
  } catch {
    // Fall back to runtime-loaded config if source snapshot cannot be read.
  }
  return fallback;
}

=======
/** Loads config, resolves model command secrets, and preserves the source snapshot. */
>>>>>>> upstream/main
export async function loadModelsConfigWithSource(params: {
  commandName: string;
  runtime?: RuntimeEnv;
}): Promise<LoadedModelsConfig> {
  const runtimeConfig = getRuntimeConfig();
<<<<<<< HEAD
  const sourceConfig = await loadSourceConfigSnapshot(runtimeConfig);
=======
  const pinnedSourceConfig = getRuntimeConfigSourceSnapshot();
  const sourceConfig = pinnedSourceConfig ?? runtimeConfig;
>>>>>>> upstream/main
  const { resolvedConfig, diagnostics } = await resolveCommandConfigWithSecrets({
    config: runtimeConfig,
    commandName: params.commandName,
    targetIds: getModelsCommandSecretTargetIds(),
    runtime: params.runtime,
  });
<<<<<<< HEAD
=======
  // Keep the original source snapshot pinned so later config writes do not
  // accidentally serialize already-resolved secret values.
>>>>>>> upstream/main
  setRuntimeConfigSnapshot(resolvedConfig, sourceConfig);
  return {
    sourceConfig,
    resolvedConfig,
    diagnostics,
  };
}

/** Loads the resolved model command config when callers do not need source metadata. */
export async function loadModelsConfig(params: {
  commandName: string;
  runtime?: RuntimeEnv;
}): Promise<OpenClawConfig> {
  return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
