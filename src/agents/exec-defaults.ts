<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions.js";
import type { ExecAsk, ExecHost, ExecSecurity, ExecTarget } from "../infra/exec-approvals.js";
=======
/**
 * Resolves default exec tool settings from session and config context.
 */
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  loadExecApprovals,
  type ExecAsk,
  type ExecHost,
  type ExecMode,
  type ExecSecurity,
  type ExecTarget,
  maxAsk,
  minSecurity,
  normalizeExecAsk,
  normalizeExecSecurity,
  normalizeExecTarget,
  resolveExecApprovalsFromFile,
  resolveExecModeFromPolicy,
  resolveExecModePolicy,
  resolveExecPolicyForMode,
} from "../infra/exec-approvals.js";
>>>>>>> upstream/main
import { resolveAgentConfig, resolveSessionAgentId } from "./agent-scope.js";
import { isRequestedExecTargetAllowed, resolveExecTarget } from "./bash-tools.exec-runtime.js";
import { resolveSandboxRuntimeStatus } from "./sandbox/runtime-status.js";

<<<<<<< HEAD
type ResolvedExecConfig = {
  host?: ExecTarget;
=======
// Resolved exec config layers come from global config, agent config, legacy
// session fields, and per-call overrides.
type ResolvedExecConfig = {
  host?: ExecTarget;
  mode?: ExecMode;
>>>>>>> upstream/main
  security?: ExecSecurity;
  ask?: ExecAsk;
  node?: string;
};

<<<<<<< HEAD
function resolveExecConfigState(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
=======
type ExecOverridesConfig = Omit<ResolvedExecConfig, "mode">;

// Legacy security/ask values remain accepted on existing sessions/config, but
// mode wins when present because it expands to a complete policy tuple.
function hasLegacyExecPolicyOverride(exec?: ResolvedExecConfig): boolean {
  return exec?.security !== undefined || exec?.ask !== undefined;
}

// Layering keeps the most specific mode/security/ask while preserving policy
// bounds from approvals and sandbox availability later in resolution.
type LayeredExecPolicy = {
  mode?: ExecMode;
  security: ExecSecurity;
  ask: ExecAsk;
};

function applyExecPolicyLayer(
  base: LayeredExecPolicy,
  layer?: ResolvedExecConfig,
): LayeredExecPolicy {
  if (!layer) {
    return base;
  }
  if (layer.mode) {
    return {
      mode: layer.mode,
      ...resolveExecPolicyForMode(layer.mode),
    };
  }
  if (hasLegacyExecPolicyOverride(layer)) {
    return {
      security: layer.security ?? base.security,
      ask: layer.ask ?? base.ask,
    };
  }
  return base;
}

function applySessionLegacyExecPolicyLayer(
  base: LayeredExecPolicy,
  sessionEntry?: SessionEntry,
): LayeredExecPolicy {
  const security = normalizeExecSecurity(sessionEntry?.execSecurity);
  const ask = normalizeExecAsk(sessionEntry?.execAsk);
  if (security !== null || ask !== null) {
    return {
      security: security ?? base.security,
      ask: ask ?? base.ask,
    };
  }
  return base;
}

// Gather the shared config state once so canExecRequestNode and
// resolveExecDefaults stay aligned on agent/global/session precedence.
function resolveExecConfigState(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  execOverrides?: ExecOverridesConfig;
>>>>>>> upstream/main
  agentId?: string;
  sessionKey?: string;
}): {
  cfg: OpenClawConfig;
  host: ExecTarget;
<<<<<<< HEAD
=======
  agentId: string | undefined;
>>>>>>> upstream/main
  agentExec?: ResolvedExecConfig;
  globalExec?: ResolvedExecConfig;
} {
  const cfg = params.cfg ?? {};
  const resolvedAgentId =
    params.agentId ??
    resolveSessionAgentId({
      sessionKey: params.sessionKey,
      config: cfg,
    });
  const globalExec = cfg.tools?.exec;
  const agentExec = resolvedAgentId
    ? resolveAgentConfig(cfg, resolvedAgentId)?.tools?.exec
    : undefined;
  const host =
<<<<<<< HEAD
    (params.sessionEntry?.execHost as ExecTarget | undefined) ??
=======
    params.execOverrides?.host ??
    normalizeExecTarget(params.sessionEntry?.execHost) ??
>>>>>>> upstream/main
    (agentExec?.host as ExecTarget | undefined) ??
    (globalExec?.host as ExecTarget | undefined) ??
    "auto";
  return {
    cfg,
    host,
<<<<<<< HEAD
=======
    agentId: resolvedAgentId,
>>>>>>> upstream/main
    agentExec,
    globalExec,
  };
}

<<<<<<< HEAD
export function canExecRequestNode(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  agentId?: string;
  sessionKey?: string;
}): boolean {
  const { host } = resolveExecConfigState(params);
  return isRequestedExecTargetAllowed({
    configuredTarget: host,
    requestedTarget: "node",
  });
}

export function resolveExecDefaults(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  agentId?: string;
  sessionKey?: string;
  sandboxAvailable?: boolean;
}): {
  host: ExecTarget;
  effectiveHost: ExecHost;
=======
function resolveExecSandboxAvailability(params: {
  cfg: OpenClawConfig;
  sessionKey?: string;
  sandboxAvailable?: boolean;
}) {
  return (
    params.sandboxAvailable ??
    (params.sessionKey
      ? resolveSandboxRuntimeStatus({
          cfg: params.cfg,
          sessionKey: params.sessionKey,
        }).sandboxed
      : false)
  );
}

/** Returns whether the current exec policy allows requesting host node execution. */
export function canExecRequestNode(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  execOverrides?: ExecOverridesConfig;
  agentId?: string;
  sessionKey?: string;
  sandboxAvailable?: boolean;
}): boolean {
  const { cfg, host } = resolveExecConfigState(params);
  return isRequestedExecTargetAllowed({
    configuredTarget: host,
    requestedTarget: "node",
    sandboxAvailable: resolveExecSandboxAvailability({
      cfg,
      sessionKey: params.sessionKey,
      sandboxAvailable: params.sandboxAvailable,
    }),
  });
}

/** Resolves effective exec host, mode, approval policy, and node availability. */
export function resolveExecDefaults(params: {
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  execOverrides?: ExecOverridesConfig;
  agentId?: string;
  sessionKey?: string;
  sandboxAvailable?: boolean;
  elevatedRequested?: boolean;
}): {
  host: ExecTarget;
  effectiveHost: ExecHost;
  mode: ExecMode;
>>>>>>> upstream/main
  security: ExecSecurity;
  ask: ExecAsk;
  node?: string;
  canRequestNode: boolean;
} {
<<<<<<< HEAD
  const { cfg, host, agentExec, globalExec } = resolveExecConfigState(params);
  const sandboxAvailable =
    params.sandboxAvailable ??
    (params.sessionKey
      ? resolveSandboxRuntimeStatus({
          cfg,
          sessionKey: params.sessionKey,
        }).sandboxed
      : false);
  const resolved = resolveExecTarget({
    configuredTarget: host,
    elevatedRequested: false,
    sandboxAvailable,
  });
  return {
    host,
    effectiveHost: resolved.effectiveHost,
    security:
      (params.sessionEntry?.execSecurity as ExecSecurity | undefined) ??
      agentExec?.security ??
      globalExec?.security ??
      "deny",
    ask:
      (params.sessionEntry?.execAsk as ExecAsk | undefined) ??
      agentExec?.ask ??
      globalExec?.ask ??
      "on-miss",
    node: params.sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node,
    canRequestNode: isRequestedExecTargetAllowed({
      configuredTarget: host,
      requestedTarget: "node",
=======
  const {
    cfg,
    host,
    agentId: resolvedAgentId,
    agentExec,
    globalExec,
  } = resolveExecConfigState(params);
  const sandboxAvailable = resolveExecSandboxAvailability({
    cfg,
    sessionKey: params.sessionKey,
    sandboxAvailable: params.sandboxAvailable,
  });
  const resolved = resolveExecTarget({
    configuredTarget: host,
    elevatedRequested: params.elevatedRequested === true,
    sandboxAvailable,
  });
  const defaultSecurity = resolved.effectiveHost === "sandbox" ? "deny" : "full";
  const approvalDefaults =
    resolved.effectiveHost === "sandbox"
      ? undefined
      : resolveExecApprovalsFromFile({
          file: loadExecApprovals(),
          agentId: resolvedAgentId,
          overrides: {
            security: defaultSecurity,
            ask: "off",
          },
        }).agent;
  const basePolicy: LayeredExecPolicy = {
    security: approvalDefaults?.security ?? defaultSecurity,
    ask: approvalDefaults?.ask ?? "off",
  };
  const layeredPolicy = applyExecPolicyLayer(
    applySessionLegacyExecPolicyLayer(
      applyExecPolicyLayer(applyExecPolicyLayer(basePolicy, globalExec), agentExec),
      params.sessionEntry,
    ),
    params.execOverrides,
  );
  const modePolicy = resolveExecModePolicy(layeredPolicy);
  // Approval files are safety bounds: they can only reduce security/ask from
  // config-derived policy, never grant a less restrictive effective mode.
  const security =
    approvalDefaults?.security !== undefined
      ? minSecurity(modePolicy.security, approvalDefaults.security)
      : modePolicy.security;
  const ask =
    approvalDefaults?.ask !== undefined
      ? maxAsk(modePolicy.ask, approvalDefaults.ask)
      : modePolicy.ask;
  const mode =
    security === modePolicy.security && ask === modePolicy.ask
      ? modePolicy.mode
      : resolveExecModeFromPolicy({ security, ask });
  return {
    host,
    effectiveHost: resolved.effectiveHost,
    mode,
    security,
    ask,
    node:
      params.execOverrides?.node ??
      params.sessionEntry?.execNode ??
      agentExec?.node ??
      globalExec?.node,
    canRequestNode: isRequestedExecTargetAllowed({
      configuredTarget: host,
      requestedTarget: "node",
      sandboxAvailable,
>>>>>>> upstream/main
    }),
  };
}
