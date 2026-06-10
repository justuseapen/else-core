<<<<<<< HEAD
=======
// Shared bootstrap for status scans.
// Starts update, Tailscale, agent, and gateway probes with cold-start shortcuts for first-run users.

>>>>>>> upstream/main
import type { OpenClawConfig } from "../config/types.js";
import type { UpdateCheckResult } from "../infra/update-check.js";
import { runExec } from "../process/exec.js";
import { createEmptyTaskAuditSummary } from "../tasks/task-registry.audit.shared.js";
import { createEmptyTaskRegistrySummary } from "../tasks/task-registry.summary.js";
import { buildTailscaleHttpsUrl, resolveGatewayProbeSnapshot } from "./status.scan.shared.js";

<<<<<<< HEAD
export function buildColdStartUpdateResult(): UpdateCheckResult {
=======
function buildColdStartUpdateResult(): UpdateCheckResult {
>>>>>>> upstream/main
  return {
    root: null,
    installKind: "unknown",
    packageManager: "unknown",
  };
}

<<<<<<< HEAD
export function buildColdStartAgentLocalStatuses() {
=======
function buildColdStartAgentLocalStatuses() {
>>>>>>> upstream/main
  return {
    defaultId: "main",
    agents: [],
    totalSessions: 0,
    bootstrapPendingCount: 0,
  };
}

<<<<<<< HEAD
=======
/** Builds an empty summary for cold-start status paths that skip network and session work. */
>>>>>>> upstream/main
export function buildColdStartStatusSummary() {
  return {
    runtimeVersion: null,
    heartbeat: {
      defaultAgentId: "main",
      agents: [],
    },
    channelSummary: [],
    queuedSystemEvents: [],
    tasks: createEmptyTaskRegistrySummary(),
    taskAudit: createEmptyTaskAuditSummary(),
    sessions: {
      paths: [],
      count: 0,
      defaults: { model: null, contextTokens: null },
      recent: [],
      byAgent: [],
    },
  };
}

<<<<<<< HEAD
export function shouldSkipStatusScanNetworkChecks(params: {
=======
function shouldSkipStatusScanNetworkChecks(params: {
>>>>>>> upstream/main
  coldStart: boolean;
  hasConfiguredChannels: boolean;
  all?: boolean;
}): boolean {
<<<<<<< HEAD
  return params.coldStart && !params.hasConfiguredChannels && params.all !== true;
}

export async function createStatusScanCoreBootstrap<TAgentStatus>(params: {
=======
  // First-run users without channels should get instant status instead of waiting on network probes.
  return params.coldStart && !params.hasConfiguredChannels && params.all !== true;
}

type StatusScanExecRunner = (
  command: string,
  args: string[],
  opts?: number | { timeoutMs?: number; maxBuffer?: number; cwd?: string },
) => Promise<{ stdout: string; stderr: string }>;

type StatusScanCoreBootstrapParams<TAgentStatus> = {
>>>>>>> upstream/main
  coldStart: boolean;
  cfg: OpenClawConfig;
  hasConfiguredChannels: boolean;
  opts: { timeoutMs?: number; all?: boolean };
<<<<<<< HEAD
  getTailnetHostname: (
    runner: (cmd: string, args: string[]) => Promise<unknown>,
  ) => Promise<string | null>;
=======
  skipUpdateCheck?: boolean;
  fetchGitUpdate?: boolean;
  includeRegistryUpdate?: boolean;
  includeLocalStatusRpcFallback?: boolean;
  gatewayProbeTimeoutMs?: number;
  getTailnetHostname: (runner: StatusScanExecRunner) => Promise<string | null>;
>>>>>>> upstream/main
  getUpdateCheckResult: (params: {
    timeoutMs: number;
    fetchGit: boolean;
    includeRegistry: boolean;
<<<<<<< HEAD
  }) => Promise<UpdateCheckResult>;
  getAgentLocalStatuses: (cfg: OpenClawConfig) => Promise<TAgentStatus>;
}) {
=======
    updateConfigChannel?: string | null;
  }) => Promise<UpdateCheckResult>;
  getAgentLocalStatuses: (cfg: OpenClawConfig) => Promise<TAgentStatus>;
};

/** Starts the common async probes used by status scans and exposes their promises to callers. */
export async function createStatusScanCoreBootstrap<TAgentStatus>(
  params: StatusScanCoreBootstrapParams<TAgentStatus>,
) {
>>>>>>> upstream/main
  const tailscaleMode = params.cfg.gateway?.tailscale?.mode ?? "off";
  const skipColdStartNetworkChecks = shouldSkipStatusScanNetworkChecks({
    coldStart: params.coldStart,
    hasConfiguredChannels: params.hasConfiguredChannels,
    all: params.opts.all,
  });
<<<<<<< HEAD
  const updateTimeoutMs = params.opts.all ? 6500 : 2500;
=======
  const statusTimeoutMs = params.opts.timeoutMs ?? 10_000;
  const updateTimeoutMs = Math.min(params.opts.all ? 6500 : 2500, statusTimeoutMs);
  const tailscaleTimeoutMs = Math.min(1200, statusTimeoutMs);
>>>>>>> upstream/main
  const tailscaleDnsPromise =
    tailscaleMode === "off"
      ? Promise.resolve<string | null>(null)
      : params
          .getTailnetHostname((cmd, args) =>
<<<<<<< HEAD
            runExec(cmd, args, { timeoutMs: 1200, maxBuffer: 200_000 }),
          )
          .catch(() => null);
  const updatePromise = skipColdStartNetworkChecks
    ? Promise.resolve(buildColdStartUpdateResult())
    : params.getUpdateCheckResult({
        timeoutMs: updateTimeoutMs,
        fetchGit: true,
        includeRegistry: true,
=======
            runExec(cmd, args, { timeoutMs: tailscaleTimeoutMs, maxBuffer: 200_000 }),
          )
          .catch(() => null);
  const skipNetworkUpdate = skipColdStartNetworkChecks || params.skipUpdateCheck === true;
  // Update checks can hit git/registry, so cold-start status uses a synthetic unknown result.
  const updatePromise = skipNetworkUpdate
    ? Promise.resolve(buildColdStartUpdateResult())
    : params.getUpdateCheckResult({
        timeoutMs: updateTimeoutMs,
        fetchGit: params.fetchGitUpdate ?? true,
        includeRegistry: params.includeRegistryUpdate ?? true,
        updateConfigChannel: params.cfg.update?.channel ?? null,
>>>>>>> upstream/main
      });
  const agentStatusPromise = skipColdStartNetworkChecks
    ? Promise.resolve(buildColdStartAgentLocalStatuses() as TAgentStatus)
    : params.getAgentLocalStatuses(params.cfg);
  const gatewayProbePromise = resolveGatewayProbeSnapshot({
    cfg: params.cfg,
    opts: {
      ...params.opts,
<<<<<<< HEAD
      ...(skipColdStartNetworkChecks ? { skipProbe: true } : {}),
=======
      ...(params.gatewayProbeTimeoutMs !== undefined
        ? { timeoutMs: params.gatewayProbeTimeoutMs }
        : {}),
      ...(skipColdStartNetworkChecks ? { skipProbe: true } : {}),
      localStatusRpcFallback: params.includeLocalStatusRpcFallback !== false,
>>>>>>> upstream/main
    },
  });

  return {
    tailscaleMode,
    tailscaleDnsPromise,
    updatePromise,
    agentStatusPromise,
    gatewayProbePromise,
    skipColdStartNetworkChecks,
    resolveTailscaleHttpsUrl: async () =>
      buildTailscaleHttpsUrl({
        tailscaleMode,
        tailscaleDns: await tailscaleDnsPromise,
<<<<<<< HEAD
=======
        serviceName: params.cfg.gateway?.tailscale?.serviceName,
>>>>>>> upstream/main
        controlUiBasePath: params.cfg.gateway?.controlUi?.basePath,
      }),
  };
}
<<<<<<< HEAD

export async function createStatusScanBootstrap<TAgentStatus, TSummary>(params: {
  coldStart: boolean;
  cfg: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  hasConfiguredChannels: boolean;
  opts: { timeoutMs?: number; all?: boolean };
  getTailnetHostname: (
    runner: (cmd: string, args: string[]) => Promise<unknown>,
  ) => Promise<string | null>;
  getUpdateCheckResult: (params: {
    timeoutMs: number;
    fetchGit: boolean;
    includeRegistry: boolean;
  }) => Promise<UpdateCheckResult>;
  getAgentLocalStatuses: (cfg: OpenClawConfig) => Promise<TAgentStatus>;
  getStatusSummary: (params: {
    config: OpenClawConfig;
    sourceConfig: OpenClawConfig;
  }) => Promise<TSummary>;
}) {
  const core = await createStatusScanCoreBootstrap<TAgentStatus>({
    coldStart: params.coldStart,
    cfg: params.cfg,
    hasConfiguredChannels: params.hasConfiguredChannels,
    opts: params.opts,
    getTailnetHostname: params.getTailnetHostname,
    getUpdateCheckResult: params.getUpdateCheckResult,
    getAgentLocalStatuses: params.getAgentLocalStatuses,
  });
  const summaryPromise = core.skipColdStartNetworkChecks
    ? Promise.resolve(buildColdStartStatusSummary() as TSummary)
    : params.getStatusSummary({
        config: params.cfg,
        sourceConfig: params.sourceConfig,
      });
  return {
    ...core,
    summaryPromise,
  };
}
=======
>>>>>>> upstream/main
