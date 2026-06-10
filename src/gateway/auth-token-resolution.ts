<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { resolveSecretInputRef } from "../config/types.secrets.js";
import { readGatewayTokenEnv, trimToUndefined } from "./credentials.js";
=======
// Gateway auth token resolution applies explicit/config/SecretRef/env
// precedence with caller-controlled env fallback behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveSecretInputRef } from "../config/types.secrets.js";
import { trimToUndefined } from "./credentials.js";
>>>>>>> upstream/main
import {
  resolveConfiguredSecretInputString,
  type SecretInputUnresolvedReasonStyle,
} from "./resolve-configured-secret-input-string.js";

<<<<<<< HEAD
export type GatewayAuthTokenResolutionSource = "explicit" | "config" | "secretRef" | "env";
export type GatewayAuthTokenEnvFallback = "never" | "no-secret-ref" | "always";

=======
// Single-token resolver for local gateway auth consumers that need to know
// whether the winning token came from explicit args, config, SecretRef, or env.
type GatewayAuthTokenResolutionSource = "explicit" | "config" | "secretRef" | "env";
type GatewayAuthTokenEnvFallback = "never" | "no-secret-ref" | "always";

/** Resolves gateway.auth.token with configurable env fallback and SecretRef diagnostics. */
>>>>>>> upstream/main
export async function resolveGatewayAuthToken(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  explicitToken?: string;
  envFallback?: GatewayAuthTokenEnvFallback;
  unresolvedReasonStyle?: SecretInputUnresolvedReasonStyle;
}): Promise<{
  token?: string;
  source?: GatewayAuthTokenResolutionSource;
  secretRefConfigured: boolean;
  unresolvedRefReason?: string;
}> {
  const explicitToken = trimToUndefined(params.explicitToken);
  if (explicitToken) {
    return {
      token: explicitToken,
      source: "explicit",
      secretRefConfigured: false,
    };
  }

  const tokenInput = params.cfg.gateway?.auth?.token;
  const tokenRef = resolveSecretInputRef({
    value: tokenInput,
    defaults: params.cfg.secrets?.defaults,
  }).ref;
  const envFallback = params.envFallback ?? "always";
<<<<<<< HEAD
  const envToken = readGatewayTokenEnv(params.env);
=======
  const envToken = trimToUndefined(params.env.OPENCLAW_GATEWAY_TOKEN);
>>>>>>> upstream/main

  if (!tokenRef) {
    const configToken = trimToUndefined(tokenInput);
    if (configToken) {
      return {
        token: configToken,
        source: "config",
        secretRefConfigured: false,
      };
    }
    if (envFallback !== "never" && envToken) {
      return {
        token: envToken,
        source: "env",
        secretRefConfigured: false,
      };
    }
    return { secretRefConfigured: false };
  }

  const resolved = await resolveConfiguredSecretInputString({
    config: params.cfg,
    env: params.env,
    value: tokenInput,
    path: "gateway.auth.token",
    unresolvedReasonStyle: params.unresolvedReasonStyle,
  });
  if (resolved.value) {
    return {
      token: resolved.value,
      source: "secretRef",
      secretRefConfigured: true,
    };
  }
<<<<<<< HEAD
=======
  // Env fallback after a configured SecretRef is intentionally opt-in so
  // callers can fail closed when unresolved secrets should block startup.
>>>>>>> upstream/main
  if (envFallback === "always" && envToken) {
    return {
      token: envToken,
      source: "env",
      secretRefConfigured: true,
    };
  }
  return {
    secretRefConfigured: true,
    unresolvedRefReason: resolved.unresolvedRefReason,
  };
}
