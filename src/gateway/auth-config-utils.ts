<<<<<<< HEAD
import type { GatewayAuthConfig, OpenClawConfig } from "../config/config.js";
import { hasConfiguredSecretInput } from "../config/types.secrets.js";
=======
// Gateway auth config utilities materialize token/password SecretRefs only for
// the auth mode that can actually consume them.
import type { GatewayAuthConfig } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { hasConfiguredSecretInput, resolveSecretInputRef } from "../config/types.secrets.js";
>>>>>>> upstream/main
import { resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string.js";
import {
  assignResolvedGatewaySecretInput,
  readGatewaySecretInputValue,
  type SupportedGatewaySecretInputPath,
} from "./secret-input-paths.js";

<<<<<<< HEAD
export type GatewayAuthSecretInputPath = Extract<
=======
type GatewayAuthSecretInputPath = Extract<
>>>>>>> upstream/main
  SupportedGatewaySecretInputPath,
  "gateway.auth.token" | "gateway.auth.password"
>;

<<<<<<< HEAD
export type GatewayAuthSecretRefResolutionParams = {
=======
type GatewayAuthSecretRefResolutionParams = {
>>>>>>> upstream/main
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  mode?: GatewayAuthConfig["mode"];
  hasPasswordCandidate: boolean;
  hasTokenCandidate: boolean;
};

<<<<<<< HEAD
=======
/** Check whether a local Gateway auth input is configured directly or through defaults. */
>>>>>>> upstream/main
export function hasConfiguredGatewayAuthSecretInput(
  cfg: OpenClawConfig,
  path: GatewayAuthSecretInputPath,
): boolean {
  return hasConfiguredSecretInput(readGatewaySecretInputValue(cfg, path), cfg.secrets?.defaults);
}

<<<<<<< HEAD
export function shouldResolveGatewayAuthSecretRef(params: {
=======
/** Decide whether a token/password secret ref can be active for the configured auth mode. */
function shouldResolveGatewayAuthSecretRef(params: {
>>>>>>> upstream/main
  mode?: GatewayAuthConfig["mode"];
  path: GatewayAuthSecretInputPath;
  hasPasswordCandidate: boolean;
  hasTokenCandidate: boolean;
}): boolean {
  const isTokenPath = params.path === "gateway.auth.token";
  const hasPathCandidate = isTokenPath ? params.hasTokenCandidate : params.hasPasswordCandidate;
  if (hasPathCandidate) {
<<<<<<< HEAD
    return false;
  }
  if (params.mode === (isTokenPath ? "token" : "password")) {
    return true;
  }
  if (params.mode === "token" || params.mode === "none" || params.mode === "trusted-proxy") {
    return false;
  }
  if (params.mode === "password") {
    return !isTokenPath;
  }
  return isTokenPath ? !params.hasPasswordCandidate : !params.hasTokenCandidate;
}

export function shouldResolveGatewayTokenSecretRef(
  params: Omit<GatewayAuthSecretRefResolutionParams, "cfg" | "env">,
): boolean {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.token",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}

export function shouldResolveGatewayPasswordSecretRef(
  params: Omit<GatewayAuthSecretRefResolutionParams, "cfg" | "env">,
): boolean {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.password",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}

export async function resolveGatewayAuthSecretRefValue(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  path: GatewayAuthSecretInputPath;
  shouldResolve: boolean;
}): Promise<string | undefined> {
  if (!params.shouldResolve) {
    return undefined;
  }
  const value = await resolveRequiredConfiguredSecretRefInputString({
    config: params.cfg,
    env: params.env,
    value: readGatewaySecretInputValue(params.cfg, params.path),
    path: params.path,
  });
  if (!value) {
    return undefined;
  }
  return value;
}

export async function resolveGatewayTokenSecretRefValue(
  params: GatewayAuthSecretRefResolutionParams,
): Promise<string | undefined> {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.token",
    shouldResolve: shouldResolveGatewayTokenSecretRef(params),
  });
}

export async function resolveGatewayPasswordSecretRefValue(
  params: GatewayAuthSecretRefResolutionParams,
): Promise<string | undefined> {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.password",
    shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
  });
}

export async function resolveGatewayAuthSecretRef(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  path: GatewayAuthSecretInputPath;
  shouldResolve: boolean;
}): Promise<OpenClawConfig> {
  const value = await resolveGatewayAuthSecretRefValue(params);
  if (!value) {
    return params.cfg;
  }
  const nextConfig = structuredClone(params.cfg);
  nextConfig.gateway ??= {};
  nextConfig.gateway.auth ??= {};
  assignResolvedGatewaySecretInput({
    config: nextConfig,
    path: params.path,
    value,
  });
  return nextConfig;
=======
    return false;
  }
  if (params.mode === (isTokenPath ? "token" : "password")) {
    return true;
  }
  if (params.mode === "trusted-proxy") {
    return !isTokenPath;
  }
  if (params.mode === "token" || params.mode === "none") {
    return false;
  }
  if (params.mode === "password") {
    return !isTokenPath;
  }
  // With implicit mode, resolve the side that does not already have a concrete
  // candidate so token and password defaults do not both get materialized.
  return isTokenPath ? !params.hasPasswordCandidate : !params.hasTokenCandidate;
>>>>>>> upstream/main
}

function shouldResolveGatewayTokenSecretRef(
  params: Omit<GatewayAuthSecretRefResolutionParams, "cfg" | "env">,
): boolean {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.token",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}

function shouldResolveGatewayPasswordSecretRef(
  params: Omit<GatewayAuthSecretRefResolutionParams, "cfg" | "env">,
): boolean {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.password",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}

function hasActiveExecGatewayAuthSecretRef(params: {
  cfg: OpenClawConfig;
  path: GatewayAuthSecretInputPath;
  shouldResolve: boolean;
}): boolean {
  if (!params.shouldResolve) {
    return false;
  }
  const { ref } = resolveSecretInputRef({
    value: readGatewaySecretInputValue(params.cfg, params.path),
    defaults: params.cfg.secrets?.defaults,
  });
  return ref?.source === "exec";
}

/** Check whether active local Gateway auth refs can be read without invoking exec providers. */
export function canMaterializeGatewayAuthSecretRefsWithoutExec(
  params: GatewayAuthSecretRefResolutionParams,
): boolean {
  return !(
    hasActiveExecGatewayAuthSecretRef({
      cfg: params.cfg,
      path: "gateway.auth.token",
      shouldResolve: shouldResolveGatewayTokenSecretRef(params),
    }) ||
    hasActiveExecGatewayAuthSecretRef({
      cfg: params.cfg,
      path: "gateway.auth.password",
      shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
    })
  );
}

async function resolveGatewayAuthSecretRefValue(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  path: GatewayAuthSecretInputPath;
  shouldResolve: boolean;
}): Promise<string | undefined> {
  if (!params.shouldResolve) {
    return undefined;
  }
  const value = await resolveRequiredConfiguredSecretRefInputString({
    config: params.cfg,
    env: params.env,
    value: readGatewaySecretInputValue(params.cfg, params.path),
    path: params.path,
  });
  if (!value) {
    return undefined;
  }
  return value;
}

/** Resolve the Gateway auth token ref only when token auth can use it. */
export async function resolveGatewayTokenSecretRefValue(
  params: GatewayAuthSecretRefResolutionParams,
): Promise<string | undefined> {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.token",
    shouldResolve: shouldResolveGatewayTokenSecretRef(params),
  });
}

/** Resolve the Gateway auth password ref only when password auth can use it. */
export async function resolveGatewayPasswordSecretRefValue(
  params: GatewayAuthSecretRefResolutionParams,
): Promise<string | undefined> {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.password",
    shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
  });
}

async function resolveGatewayAuthSecretRef(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  path: GatewayAuthSecretInputPath;
  shouldResolve: boolean;
}): Promise<OpenClawConfig> {
  const value = await resolveGatewayAuthSecretRefValue(params);
  if (!value) {
    return params.cfg;
  }
  // Mutate a clone so startup validation can materialize secrets without
  // altering the caller's raw config object.
  const nextConfig = structuredClone(params.cfg);
  nextConfig.gateway ??= {};
  nextConfig.gateway.auth ??= {};
  assignResolvedGatewaySecretInput({
    config: nextConfig,
    path: params.path,
    value,
  });
  return nextConfig;
}

async function resolveGatewayPasswordSecretRef(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  mode?: GatewayAuthConfig["mode"];
  hasPasswordCandidate: boolean;
  hasTokenCandidate: boolean;
}): Promise<OpenClawConfig> {
  return resolveGatewayAuthSecretRef({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.password",
    shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
  });
}

<<<<<<< HEAD
=======
/** Materialize active local Gateway auth secret refs on a cloned config. */
>>>>>>> upstream/main
export async function materializeGatewayAuthSecretRefs(
  params: GatewayAuthSecretRefResolutionParams,
): Promise<OpenClawConfig> {
  const cfgWithToken = await resolveGatewayAuthSecretRef({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.token",
    shouldResolve: shouldResolveGatewayTokenSecretRef(params),
  });
  return await resolveGatewayPasswordSecretRef({
    cfg: cfgWithToken,
    env: params.env,
    mode: params.mode,
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate:
      params.hasTokenCandidate ||
      hasConfiguredGatewayAuthSecretInput(cfgWithToken, "gateway.auth.token"),
  });
}
