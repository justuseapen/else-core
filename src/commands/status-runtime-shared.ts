<<<<<<< HEAD
import type { OpenClawConfig } from "../config/types.js";
import type { HeartbeatEventPayload } from "../infra/heartbeat-events.js";
import type { HealthSummary } from "./health.js";
import { getDaemonStatusSummary, getNodeDaemonStatusSummary } from "./status.daemon.js";

let providerUsagePromise: Promise<typeof import("../infra/provider-usage.js")> | undefined;
let securityAuditModulePromise: Promise<typeof import("../security/audit.runtime.js")> | undefined;
let gatewayCallModulePromise: Promise<typeof import("../gateway/call.js")> | undefined;

function loadProviderUsage() {
  providerUsagePromise ??= import("../infra/provider-usage.js");
  return providerUsagePromise;
}

function loadSecurityAuditModule() {
  securityAuditModulePromise ??= import("../security/audit.runtime.js");
  return securityAuditModulePromise;
}

function loadGatewayCallModule() {
  gatewayCallModulePromise ??= import("../gateway/call.js");
  return gatewayCallModulePromise;
}

export async function resolveStatusSecurityAudit(params: {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
}) {
  const { runSecurityAudit } = await loadSecurityAuditModule();
=======
// Shared runtime probes used by status text and JSON commands.
// Heavy modules stay lazily loaded so fast status output avoids security/provider/gateway costs.

import { resolveDefaultAgentDir } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/types.js";
import type { HeartbeatEventPayload } from "../infra/heartbeat-events.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
import type { HealthSummary } from "./health.js";
import { getDaemonStatusSummary, getNodeDaemonStatusSummary } from "./status.daemon.js";

const providerUsageLoader = createLazyImportLoader(() => import("../infra/provider-usage.js"));
const securityAuditModuleLoader = createLazyImportLoader(
  () => import("../security/audit.runtime.js"),
);
const readOnlyChannelPluginsModuleLoader = createLazyImportLoader(
  () => import("../channels/plugins/read-only.js"),
);
const gatewayCallModuleLoader = createLazyImportLoader(() => import("../gateway/call.js"));

function loadProviderUsage() {
  return providerUsageLoader.load();
}

function loadSecurityAuditModule() {
  return securityAuditModuleLoader.load();
}

function loadReadOnlyChannelPluginsModule() {
  return readOnlyChannelPluginsModuleLoader.load();
}

function loadGatewayCallModule() {
  return gatewayCallModuleLoader.load();
}

/** Runs the lightweight security audit used by status JSON/all output. */
export async function resolveStatusSecurityAudit(params: {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  timeoutMs?: number;
}) {
  const { runSecurityAudit } = await loadSecurityAuditModule();
  const { resolveReadOnlyChannelPluginsForConfig } = await loadReadOnlyChannelPluginsModule();
  const readOnlyPlugins = resolveReadOnlyChannelPluginsForConfig(params.config, {
    activationSourceConfig: params.sourceConfig,
    includeSetupFallbackPlugins: false,
  });
>>>>>>> upstream/main
  return await runSecurityAudit({
    config: params.config,
    sourceConfig: params.sourceConfig,
    deep: false,
<<<<<<< HEAD
    includeFilesystem: true,
    includeChannelSecurity: true,
  });
}

export async function resolveStatusUsageSummary(timeoutMs?: number) {
  const { loadProviderUsageSummary } = await loadProviderUsage();
  return await loadProviderUsageSummary({ timeoutMs });
}

=======
    ...(params.timeoutMs !== undefined ? { deepTimeoutMs: params.timeoutMs } : {}),
    includeFilesystem: true,
    includeChannelSecurity: true,
    loadPluginSecurityCollectors: false,
    // Missing configured channel plugins make plugin-specific collectors unreliable; omit plugin list then.
    ...(readOnlyPlugins.missingConfiguredChannelIds.length === 0
      ? { plugins: readOnlyPlugins.plugins }
      : {}),
  });
}

type StatusUsageSummaryOptions = {
  config: OpenClawConfig;
  timeoutMs?: number;
  agentDir?: string;
};

/** Loads provider usage for status output, defaulting to the config's default agent directory. */
export async function resolveStatusUsageSummary(params: StatusUsageSummaryOptions) {
  const { loadProviderUsageSummary } = await loadProviderUsage();
  return await loadProviderUsageSummary({
    timeoutMs: params.timeoutMs,
    config: params.config,
    agentDir: params.agentDir ?? resolveDefaultAgentDir(params.config),
  });
}

/** Exposes the lazily loaded provider-usage module for callers that need its helpers. */
>>>>>>> upstream/main
export async function loadStatusProviderUsageModule() {
  return await loadProviderUsage();
}

<<<<<<< HEAD
=======
/** Calls gateway health and lets errors propagate to deep status callers. */
>>>>>>> upstream/main
export async function resolveStatusGatewayHealth(params: {
  config: OpenClawConfig;
  timeoutMs?: number;
}) {
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway<HealthSummary>({
    method: "health",
    params: { probe: true },
    timeoutMs: params.timeoutMs,
    config: params.config,
  });
}

<<<<<<< HEAD
=======
/** Calls gateway health but converts unreachable/failing probes into an error object. */
>>>>>>> upstream/main
export async function resolveStatusGatewayHealthSafe(params: {
  config: OpenClawConfig;
  timeoutMs?: number;
  gatewayReachable: boolean;
  gatewayProbeError?: string | null;
  callOverrides?: {
    url: string;
    token?: string;
    password?: string;
  };
}) {
  if (!params.gatewayReachable) {
<<<<<<< HEAD
=======
    // Preserve the probe error so status-all can explain why health was not called.
>>>>>>> upstream/main
    return { error: params.gatewayProbeError ?? "gateway unreachable" };
  }
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway<HealthSummary>({
    method: "health",
    params: { probe: true },
    timeoutMs: params.timeoutMs,
    config: params.config,
    ...params.callOverrides,
<<<<<<< HEAD
  }).catch((err) => ({ error: String(err) }));
}

=======
  }).catch((err: unknown) => ({ error: String(err) }));
}

/** Reads gateway delivery diagnostics when reachable, returning null on failures. */
export async function resolveStatusGatewayDiagnosticsSafe(params: {
  config: OpenClawConfig;
  timeoutMs?: number;
  gatewayReachable: boolean;
  callOverrides?: {
    url: string;
    token?: string;
    password?: string;
  };
}) {
  if (!params.gatewayReachable) {
    return null;
  }
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway<unknown>({
    method: "diagnostics.stability",
    params: { limit: 1000 },
    timeoutMs: params.timeoutMs,
    config: params.config,
    ...params.callOverrides,
  }).catch(() => null);
}

/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
>>>>>>> upstream/main
export async function resolveStatusLastHeartbeat(params: {
  config: OpenClawConfig;
  timeoutMs?: number;
  gatewayReachable: boolean;
}) {
  if (!params.gatewayReachable) {
    return null;
  }
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway<HeartbeatEventPayload | null>({
    method: "last-heartbeat",
    params: {},
    timeoutMs: params.timeoutMs,
    config: params.config,
  }).catch(() => null);
}

<<<<<<< HEAD
=======
/** Resolves launchd/systemd summaries for the gateway and node services together. */
>>>>>>> upstream/main
export async function resolveStatusServiceSummaries() {
  return await Promise.all([getDaemonStatusSummary(), getNodeDaemonStatusSummary()]);
}

type StatusUsageSummary = Awaited<ReturnType<typeof resolveStatusUsageSummary>>;
type StatusGatewayHealth = Awaited<ReturnType<typeof resolveStatusGatewayHealth>>;
type StatusLastHeartbeat = Awaited<ReturnType<typeof resolveStatusLastHeartbeat>>;
type StatusGatewayServiceSummary = Awaited<ReturnType<typeof getDaemonStatusSummary>>;
type StatusNodeServiceSummary = Awaited<ReturnType<typeof getNodeDaemonStatusSummary>>;
<<<<<<< HEAD

=======
type StatusSecurityAudit = Awaited<ReturnType<typeof resolveStatusSecurityAudit>>;

/** Resolves optional usage/deep runtime details plus service summaries for status output. */
>>>>>>> upstream/main
export async function resolveStatusRuntimeDetails(params: {
  config: OpenClawConfig;
  timeoutMs?: number;
  usage?: boolean;
  deep?: boolean;
  gatewayReachable: boolean;
  suppressHealthErrors?: boolean;
<<<<<<< HEAD
  resolveUsage?: (timeoutMs?: number) => Promise<StatusUsageSummary>;
=======
  resolveUsage?: (input: StatusUsageSummaryOptions) => Promise<StatusUsageSummary>;
>>>>>>> upstream/main
  resolveHealth?: (input: {
    config: OpenClawConfig;
    timeoutMs?: number;
  }) => Promise<StatusGatewayHealth>;
}) {
  const resolveUsageSummary = params.resolveUsage ?? resolveStatusUsageSummary;
  const resolveGatewayHealthSummary = params.resolveHealth ?? resolveStatusGatewayHealth;
<<<<<<< HEAD
  const usage = params.usage ? await resolveUsageSummary(params.timeoutMs) : undefined;
=======
  const usage = params.usage
    ? await resolveUsageSummary({
        timeoutMs: params.timeoutMs,
        config: params.config,
      })
    : undefined;
>>>>>>> upstream/main
  const health = params.deep
    ? params.suppressHealthErrors
      ? await resolveGatewayHealthSummary({
          config: params.config,
          timeoutMs: params.timeoutMs,
        }).catch(() => undefined)
      : await resolveGatewayHealthSummary({
          config: params.config,
          timeoutMs: params.timeoutMs,
        })
    : undefined;
<<<<<<< HEAD
=======
  // Last heartbeat is a deep-only gateway call; fast status should not spend network time here.
>>>>>>> upstream/main
  const lastHeartbeat = params.deep
    ? await resolveStatusLastHeartbeat({
        config: params.config,
        timeoutMs: params.timeoutMs,
        gatewayReachable: params.gatewayReachable,
      })
    : null;
  const [gatewayService, nodeService] = await resolveStatusServiceSummaries();
  const result = {
    usage,
    health,
    lastHeartbeat,
    gatewayService,
    nodeService,
  };
  return result satisfies {
    usage?: StatusUsageSummary;
    health?: StatusGatewayHealth;
    lastHeartbeat: StatusLastHeartbeat;
    gatewayService: StatusGatewayServiceSummary;
    nodeService: StatusNodeServiceSummary;
  };
}
<<<<<<< HEAD
=======

/** Resolves the full runtime snapshot, including optional security audit, for status JSON/text. */
export async function resolveStatusRuntimeSnapshot(params: {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  timeoutMs?: number;
  usage?: boolean;
  deep?: boolean;
  gatewayReachable: boolean;
  includeSecurityAudit?: boolean;
  suppressHealthErrors?: boolean;
  resolveSecurityAudit?: (input: {
    config: OpenClawConfig;
    sourceConfig: OpenClawConfig;
    timeoutMs?: number;
  }) => Promise<StatusSecurityAudit>;
  resolveUsage?: (input: StatusUsageSummaryOptions) => Promise<StatusUsageSummary>;
  resolveHealth?: (input: {
    config: OpenClawConfig;
    timeoutMs?: number;
  }) => Promise<StatusGatewayHealth>;
}) {
  const securityAudit = params.includeSecurityAudit
    ? await (params.resolveSecurityAudit ?? resolveStatusSecurityAudit)({
        config: params.config,
        sourceConfig: params.sourceConfig,
        timeoutMs: params.timeoutMs,
      })
    : undefined;
  const runtimeDetails = await resolveStatusRuntimeDetails({
    config: params.config,
    timeoutMs: params.timeoutMs,
    usage: params.usage,
    deep: params.deep,
    gatewayReachable: params.gatewayReachable,
    suppressHealthErrors: params.suppressHealthErrors,
    resolveUsage: params.resolveUsage,
    resolveHealth: params.resolveHealth,
  });
  return {
    securityAudit,
    ...runtimeDetails,
  } satisfies {
    securityAudit?: StatusSecurityAudit;
    usage?: StatusUsageSummary;
    health?: StatusGatewayHealth;
    lastHeartbeat: StatusLastHeartbeat;
    gatewayService: StatusGatewayServiceSummary;
    nodeService: StatusNodeServiceSummary;
  };
}
>>>>>>> upstream/main
