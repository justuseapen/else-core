<<<<<<< HEAD
import { existsSync } from "node:fs";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.js";

=======
// Config loading helpers shared by status scan variants.
// Handles missing-config cold start and secret diagnostics before scan work begins.

import { existsSync } from "node:fs";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.js";
import { resolveGatewayAuthTokenSourceConflict } from "../gateway/auth-token-source-conflict.js";

/** Returns true when tests should avoid the missing-config cold-start fast path. */
>>>>>>> upstream/main
export function shouldSkipStatusScanMissingConfigFastPath(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.VITEST === "true" || env.VITEST_POOL_ID !== undefined || env.NODE_ENV === "test";
}

<<<<<<< HEAD
=======
/** Returns whether status should treat this run as a no-config cold start. */
>>>>>>> upstream/main
export function resolveStatusScanColdStart(params?: {
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): boolean {
  const env = params?.env ?? process.env;
  const skipMissingConfigFastPath =
    params?.allowMissingConfigFastPath === true && shouldSkipStatusScanMissingConfigFastPath(env);
  return !skipMissingConfigFastPath && !existsSync(resolveConfigPath(env));
}

<<<<<<< HEAD
=======
/** Loads best-effort config, resolves read-only secrets, and appends status secret diagnostics. */
>>>>>>> upstream/main
export async function loadStatusScanCommandConfig(params: {
  commandName: string;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  resolveConfig: (
    sourceConfig: OpenClawConfig,
  ) => Promise<{ resolvedConfig: OpenClawConfig; diagnostics: string[] }>;
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): Promise<{
  coldStart: boolean;
  sourceConfig: OpenClawConfig;
  resolvedConfig: OpenClawConfig;
  secretDiagnostics: string[];
}> {
  const env = params.env ?? process.env;
  const coldStart = resolveStatusScanColdStart({
    env,
    allowMissingConfigFastPath: params.allowMissingConfigFastPath,
  });
  const sourceConfig =
    coldStart && params.allowMissingConfigFastPath === true
      ? {}
      : await params.readBestEffortConfig();
  const { resolvedConfig, diagnostics } =
    coldStart && params.allowMissingConfigFastPath === true
      ? { resolvedConfig: sourceConfig, diagnostics: [] }
      : await params.resolveConfig(sourceConfig);
<<<<<<< HEAD
=======
  const tokenConflict = resolveGatewayAuthTokenSourceConflict({ cfg: sourceConfig, env });
  // Token source conflicts are config-level diagnostics, even when secret resolution itself succeeded.
>>>>>>> upstream/main
  return {
    coldStart,
    sourceConfig,
    resolvedConfig,
<<<<<<< HEAD
    secretDiagnostics: diagnostics,
=======
    secretDiagnostics: tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics,
>>>>>>> upstream/main
  };
}
