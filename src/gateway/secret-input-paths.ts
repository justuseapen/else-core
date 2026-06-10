<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";

=======
// Gateway secret-input path helpers.
// Lists config locations that may contain plaintext values or SecretRefs.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Canonical Gateway config paths whose values may be plaintext or secret refs. */
>>>>>>> upstream/main
export type SupportedGatewaySecretInputPath =
  | "gateway.auth.token"
  | "gateway.auth.password"
  | "gateway.remote.token"
  | "gateway.remote.password";

<<<<<<< HEAD
=======
/** Stable scan order for Gateway secret-ref credential selection. */
>>>>>>> upstream/main
export const ALL_GATEWAY_SECRET_INPUT_PATHS: SupportedGatewaySecretInputPath[] = [
  "gateway.auth.token",
  "gateway.auth.password",
  "gateway.remote.token",
  "gateway.remote.password",
];

<<<<<<< HEAD
=======
/** Narrow an arbitrary error/config path to one of the supported Gateway secret inputs. */
>>>>>>> upstream/main
export function isSupportedGatewaySecretInputPath(
  path: string,
): path is SupportedGatewaySecretInputPath {
  return ALL_GATEWAY_SECRET_INPUT_PATHS.includes(path as SupportedGatewaySecretInputPath);
}

<<<<<<< HEAD
=======
/** Read a Gateway secret input without assuming whether it is plaintext, a ref, or absent. */
>>>>>>> upstream/main
export function readGatewaySecretInputValue(
  config: OpenClawConfig,
  path: SupportedGatewaySecretInputPath,
): unknown {
  if (path === "gateway.auth.token") {
    return config.gateway?.auth?.token;
  }
  if (path === "gateway.auth.password") {
    return config.gateway?.auth?.password;
  }
  if (path === "gateway.remote.token") {
    return config.gateway?.remote?.token;
  }
  return config.gateway?.remote?.password;
}

<<<<<<< HEAD
=======
/** Replace one Gateway secret input with its resolved plaintext value on a cloned config. */
>>>>>>> upstream/main
export function assignResolvedGatewaySecretInput(params: {
  config: OpenClawConfig;
  path: SupportedGatewaySecretInputPath;
  value: string | undefined;
}): void {
  const { config, path, value } = params;
  if (path === "gateway.auth.token") {
    if (config.gateway?.auth) {
      config.gateway.auth.token = value;
    }
    return;
  }
  if (path === "gateway.auth.password") {
    if (config.gateway?.auth) {
      config.gateway.auth.password = value;
    }
    return;
  }
  if (path === "gateway.remote.token") {
    if (config.gateway?.remote) {
      config.gateway.remote.token = value;
    }
    return;
  }
  if (config.gateway?.remote) {
    config.gateway.remote.password = value;
  }
}

<<<<<<< HEAD
=======
/** Distinguish token paths from password paths for auth-mode precedence checks. */
>>>>>>> upstream/main
export function isTokenGatewaySecretInputPath(path: SupportedGatewaySecretInputPath): boolean {
  return path === "gateway.auth.token" || path === "gateway.remote.token";
}
