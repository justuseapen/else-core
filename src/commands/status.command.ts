<<<<<<< HEAD
import { withProgress } from "../cli/progress.js";
import { type RuntimeEnv, writeRuntimeJson } from "../runtime.js";
import { resolveStatusJsonOutput } from "./status-json-runtime.ts";
import {
  loadStatusProviderUsageModule,
  resolveStatusGatewayHealth,
  resolveStatusRuntimeDetails,
  resolveStatusSecurityAudit,
  resolveStatusUsageSummary,
} from "./status-runtime-shared.ts";
import { buildStatusCommandReportLines } from "./status.command-report.ts";
import {
  buildStatusAgentsValue,
  buildStatusFooterLines,
  buildStatusHealthRows,
  buildStatusHeartbeatValue,
  buildStatusLastHeartbeatValue,
  buildStatusMemoryValue,
  buildStatusPairingRecoveryLines,
  buildStatusPluginCompatibilityLines,
  buildStatusSecurityAuditLines,
  buildStatusSessionsRows,
  buildStatusSystemEventsRows,
  buildStatusSystemEventsTrailer,
  buildStatusTasksValue,
  statusHealthColumns,
} from "./status.command-sections.ts";

let statusScanModulePromise: Promise<typeof import("./status.scan.js")> | undefined;
let statusScanFastJsonModulePromise:
  | Promise<typeof import("./status.scan.fast-json.js")>
  | undefined;
let statusAllModulePromise: Promise<typeof import("./status-all.js")> | undefined;
let statusCommandTextRuntimePromise:
  | Promise<typeof import("./status.command.text-runtime.js")>
  | undefined;
let statusNodeModeModulePromise: Promise<typeof import("./status.node-mode.js")> | undefined;

function loadStatusScanModule() {
  statusScanModulePromise ??= import("./status.scan.js");
  return statusScanModulePromise;
}

function loadStatusScanFastJsonModule() {
  statusScanFastJsonModulePromise ??= import("./status.scan.fast-json.js");
  return statusScanFastJsonModulePromise;
}

function loadStatusAllModule() {
  statusAllModulePromise ??= import("./status-all.js");
  return statusAllModulePromise;
}

function loadStatusCommandTextRuntime() {
  statusCommandTextRuntimePromise ??= import("./status.command.text-runtime.js");
  return statusCommandTextRuntimePromise;
}

function loadStatusNodeModeModule() {
  statusNodeModeModulePromise ??= import("./status.node-mode.js");
  return statusNodeModeModulePromise;
=======
// Main `openclaw status` command orchestrator.
// It routes all/json/deep modes, collects scan/runtime state, and delegates formatting to report builders.

import {
  normalizePairingConnectRequestId,
  readConnectPairingRequiredMessage,
  readPairingConnectErrorDetails,
  type ConnectPairingRequiredReason,
} from "../../packages/gateway-protocol/src/connect-error-details.js";
import { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
import { withProgress } from "../cli/progress.js";
import { readRestartSentinel } from "../infra/restart-sentinel.js";
import type { RuntimeEnv } from "../runtime.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
import { runStatusJsonCommand } from "./status-json-command.ts";
import { buildStatusOverviewSurfaceFromScan } from "./status-overview-surface.ts";
import {
  loadStatusProviderUsageModule,
  resolveStatusGatewayHealth,
  resolveStatusSecurityAudit,
  resolveStatusRuntimeSnapshot,
  resolveStatusUsageSummary,
} from "./status-runtime-shared.ts";
import { formatUpdateRestartStatusValue } from "./status-update-restart.ts";
import { buildStatusCommandReportData } from "./status.command-report-data.ts";
import { buildStatusCommandReportLines } from "./status.command-report.ts";
import { logGatewayConnectionDetails } from "./status.gateway-connection.ts";

const statusScanModuleLoader = createLazyImportLoader(() => import("./status.scan.js"));
const statusScanFastJsonModuleLoader = createLazyImportLoader(
  () => import("./status.scan.fast-json.js"),
);
const statusAllModuleLoader = createLazyImportLoader(() => import("./status-all.js"));
const statusCommandTextRuntimeLoader = createLazyImportLoader(
  () => import("./status.command.text-runtime.js"),
);
const statusNodeModeModuleLoader = createLazyImportLoader(() => import("./status.node-mode.js"));

function loadStatusScanModule() {
  return statusScanModuleLoader.load();
}

function loadStatusScanFastJsonModule() {
  return statusScanFastJsonModuleLoader.load();
>>>>>>> upstream/main
}

function loadStatusAllModule() {
  return statusAllModuleLoader.load();
}

function loadStatusCommandTextRuntime() {
  return statusCommandTextRuntimeLoader.load();
}

function loadStatusNodeModeModule() {
  return statusNodeModeModuleLoader.load();
}

/** Extracts device-pairing recovery context from structured gateway errors or legacy message text. */
export function resolvePairingRecoveryContext(params: {
  error?: string | null;
  closeReason?: string | null;
  details?: unknown;
}): {
  requestId: string | null;
  reason: ConnectPairingRequiredReason | null;
  remediationHint: string | null;
} | null {
  const structured = readPairingConnectErrorDetails(params.details);
  if (structured) {
    return {
      requestId: normalizePairingConnectRequestId(structured.requestId) ?? null,
      reason: structured.reason ?? null,
      remediationHint: structured.remediationHint
        ? sanitizeTerminalText(structured.remediationHint)
        : null,
    };
  }
  // Older gateways only exposed pairing details in close/error text; keep status recovery helpful there.
  const source = [params.error, params.closeReason]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ");
  const pairing = readConnectPairingRequiredMessage(source);
  if (!pairing) {
    return null;
  }
  return {
    requestId: normalizePairingConnectRequestId(pairing.requestId) ?? null,
    reason: pairing.reason ?? null,
    remediationHint: null,
  };
}

/** Runs `openclaw status`, including JSON/all routing and optional deep probes. */
export async function statusCommand(
  opts: {
    json?: boolean;
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
    all?: boolean;
  },
  runtime: RuntimeEnv,
) {
  if (opts.all && !opts.json) {
<<<<<<< HEAD
=======
    // Human `--all` has a dedicated report path; JSON `--all` stays on the JSON schema.
>>>>>>> upstream/main
    await loadStatusAllModule().then(({ statusAllCommand }) =>
      statusAllCommand(runtime, { timeoutMs: opts.timeoutMs }),
    );
    return;
  }

<<<<<<< HEAD
  const scan = opts.json
    ? await loadStatusScanFastJsonModule().then(({ scanStatusJsonFast }) =>
        scanStatusJsonFast({ timeoutMs: opts.timeoutMs, all: opts.all }, runtime),
      )
    : await loadStatusScanModule().then(({ scanStatus }) =>
        scanStatus({ json: false, timeoutMs: opts.timeoutMs, all: opts.all }, runtime),
      );
  if (opts.json) {
    writeRuntimeJson(
      runtime,
      await resolveStatusJsonOutput({
        scan,
        opts,
        includeSecurityAudit: true,
        includePluginCompatibility: true,
      }),
    );
    return;
  }

  const runSecurityAudit = async () =>
    await resolveStatusSecurityAudit({
      config: scan.cfg,
      sourceConfig: scan.sourceConfig,
    });
  const securityAudit = opts.json
    ? await runSecurityAudit()
    : await withProgress(
        {
          label: "Running security audit…",
          indeterminate: true,
          enabled: true,
        },
        async () => await runSecurityAudit(),
      );
=======
  if (opts.json) {
    await runStatusJsonCommand({
      opts,
      runtime,
      includeSecurityAudit: opts.all === true,
      includePluginCompatibility: true,
      suppressHealthErrors: true,
      scanStatusJsonFast: async (scanOpts, runtimeForScan) =>
        await loadStatusScanFastJsonModule().then(({ scanStatusJsonFast }) =>
          scanStatusJsonFast(scanOpts, runtimeForScan),
        ),
    });
    return;
  }

  const scan = await loadStatusScanModule().then(({ scanStatus }) =>
    scanStatus({ json: false, timeoutMs: opts.timeoutMs, all: opts.all, deep: opts.deep }, runtime),
  );

>>>>>>> upstream/main
  const {
    cfg,
    osSummary,
    tailscaleMode,
    tailscaleDns,
    tailscaleHttpsUrl,
    update,
    gatewayConnection,
    remoteUrlMissing,
    gatewayMode,
    gatewayProbeAuth,
    gatewayProbeAuthWarning,
    gatewayProbe,
    gatewayReachable,
    gatewaySelf,
    channelIssues,
    agentStatus,
    channels,
    summary,
    secretDiagnostics,
    memory,
    memoryPlugin,
    pluginCompatibility,
  } = scan;

  const {
<<<<<<< HEAD
=======
    securityAudit,
>>>>>>> upstream/main
    usage,
    health,
    lastHeartbeat,
    gatewayService: daemon,
    nodeService: nodeDaemon,
<<<<<<< HEAD
  } = await resolveStatusRuntimeDetails({
    config: scan.cfg,
=======
  } = await resolveStatusRuntimeSnapshot({
    config: scan.cfg,
    sourceConfig: scan.sourceConfig,
>>>>>>> upstream/main
    timeoutMs: opts.timeoutMs,
    usage: opts.usage,
    deep: opts.deep,
    gatewayReachable,
<<<<<<< HEAD
    resolveUsage: async (timeoutMs) =>
=======
    includeSecurityAudit: opts.all === true || opts.deep === true,
    resolveSecurityAudit: async (input) =>
      await withProgress(
        {
          label: "Running security audit…",
          indeterminate: true,
          enabled: true,
        },
        async () => await resolveStatusSecurityAudit(input),
      ),
    resolveUsage: async (input) =>
>>>>>>> upstream/main
      await withProgress(
        {
          label: "Fetching usage snapshot…",
          indeterminate: true,
          enabled: opts.json !== true,
        },
<<<<<<< HEAD
        async () => await resolveStatusUsageSummary(timeoutMs),
=======
        async () => await resolveStatusUsageSummary(input),
>>>>>>> upstream/main
      ),
    resolveHealth: async (input) =>
      await withProgress(
        {
          label: "Checking gateway health…",
          indeterminate: true,
          enabled: opts.json !== true,
        },
        async () => await resolveStatusGatewayHealth(input),
      ),
  });

  const rich = true;
  const {
<<<<<<< HEAD
    buildStatusGatewaySurfaceValues,
    buildStatusChannelsTableRows,
    buildStatusOverviewRows,
    buildStatusUpdateSurface,
    formatCliCommand,
    formatStatusDashboardValue,
=======
    buildStatusUpdateSurface,
    formatCliCommand,
>>>>>>> upstream/main
    formatHealthChannelLines,
    formatKTokens,
    formatPromptCacheCompact,
    formatPluginCompatibilityNotice,
<<<<<<< HEAD
    formatStatusTailscaleValue,
=======
>>>>>>> upstream/main
    formatTimeAgo,
    formatTokensCompact,
    formatUpdateAvailableHint,
    getTerminalTableWidth,
    info,
    renderTable,
    resolveMemoryCacheSummary,
    resolveMemoryFtsState,
    resolveMemoryVectorState,
    shortenText,
<<<<<<< HEAD
    statusChannelsTableColumns,
    summarizePluginCompatibility,
=======
>>>>>>> upstream/main
    theme,
  } = await loadStatusCommandTextRuntime();
  const muted = (value: string) => (rich ? theme.muted(value) : value);
  const ok = (value: string) => (rich ? theme.success(value) : value);
  const warn = (value: string) => (rich ? theme.warn(value) : value);
  const updateSurface = buildStatusUpdateSurface({
    updateConfigChannel: cfg.update?.channel,
    update,
  });

  if (opts.verbose) {
<<<<<<< HEAD
=======
    // Verbose status prints the raw gateway target resolution before the report tables.
>>>>>>> upstream/main
    const { buildGatewayConnectionDetails } = await import("../gateway/call.js");
    const details = buildGatewayConnectionDetails({ config: scan.cfg });
    logGatewayConnectionDetails({
      runtime,
      info,
      message: details.message,
      trailingBlankLine: true,
    });
  }

  const tableWidth = getTerminalTableWidth();

  if (secretDiagnostics.length > 0) {
    // Secret diagnostics are already redacted by the scanner; show them before the main report.
    runtime.log(theme.warn("Secret diagnostics:"));
    for (const entry of secretDiagnostics) {
      runtime.log(`- ${entry}`);
    }
    runtime.log("");
  }

  const nodeOnlyGateway = await loadStatusNodeModeModule().then(({ resolveNodeOnlyGatewayInfo }) =>
    resolveNodeOnlyGatewayInfo({
      daemon,
      node: nodeDaemon,
    }),
  );
<<<<<<< HEAD
  const { dashboardUrl, gatewayValue, gatewayServiceValue, nodeServiceValue } =
    buildStatusGatewaySurfaceValues({
      cfg,
      gatewayMode,
      remoteUrlMissing,
      gatewayConnection,
      gatewayReachable,
      gatewayProbe,
      gatewayProbeAuth,
      gatewaySelf,
      gatewayService: daemon,
      nodeService: nodeDaemon,
      nodeOnlyGateway,
      decorateOk: ok,
      decorateWarn: warn,
    });
=======
>>>>>>> upstream/main
  const pairingRecovery = resolvePairingRecoveryContext({
    error: gatewayProbe?.error ?? null,
    closeReason: gatewayProbe?.close?.reason ?? null,
    details: gatewayProbe?.connectErrorDetails,
  });

<<<<<<< HEAD
  const agentsValue = buildStatusAgentsValue({ agentStatus, formatTimeAgo });

  const defaults = summary.sessions.defaults;
  const defaultCtx = defaults.contextTokens
    ? ` (${formatKTokens(defaults.contextTokens)} ctx)`
    : "";
  const eventsValue =
    summary.queuedSystemEvents.length > 0 ? `${summary.queuedSystemEvents.length} queued` : "none";
  const tasksValue = buildStatusTasksValue({ summary, warn, muted });

  const probesValue = health ? ok("enabled") : muted("skipped (use --deep)");

  const heartbeatValue = buildStatusHeartbeatValue({ summary });
  const lastHeartbeatValue = buildStatusLastHeartbeatValue({
    deep: opts.deep,
    gatewayReachable,
    lastHeartbeat,
    warn,
    muted,
    formatTimeAgo,
  });

  const storeLabel =
    summary.sessions.paths.length > 1
      ? `${summary.sessions.paths.length} stores`
      : (summary.sessions.paths[0] ?? "unknown");

  const memoryValue = buildStatusMemoryValue({
    memory,
    memoryPlugin,
    ok,
    warn,
    muted,
    resolveMemoryVectorState,
    resolveMemoryFtsState,
    resolveMemoryCacheSummary,
  });

  const channelLabel = updateSurface.channelLabel;
  const gitLabel = updateSurface.gitLabel;
  const pluginCompatibilitySummary = summarizePluginCompatibility(pluginCompatibility);
  const pluginCompatibilityValue =
    pluginCompatibilitySummary.noticeCount === 0
      ? ok("none")
      : warn(
          `${pluginCompatibilitySummary.noticeCount} notice${pluginCompatibilitySummary.noticeCount === 1 ? "" : "s"} · ${pluginCompatibilitySummary.pluginCount} plugin${pluginCompatibilitySummary.pluginCount === 1 ? "" : "s"}`,
        );

  const overviewRows = buildStatusOverviewRows({
    prefixRows: [{ Item: "OS", Value: `${osSummary.label} · node ${process.versions.node}` }],
    dashboardValue: formatStatusDashboardValue(dashboardUrl),
    tailscaleValue: formatStatusTailscaleValue({
      tailscaleMode,
      dnsName: tailscaleDns,
      httpsUrl: tailscaleHttpsUrl,
      decorateOff: muted,
      decorateWarn: warn,
    }),
    channelLabel,
    gitLabel,
    updateValue: updateSurface.updateAvailable
      ? warn(`available · ${updateSurface.updateLine}`)
      : updateSurface.updateLine,
    gatewayValue,
    gatewayAuthWarning: gatewayProbeAuthWarning ? warn(gatewayProbeAuthWarning) : null,
    gatewayServiceValue,
    nodeServiceValue,
    agentsValue,
    suffixRows: [
      { Item: "Memory", Value: memoryValue },
      { Item: "Plugin compatibility", Value: pluginCompatibilityValue },
      { Item: "Probes", Value: probesValue },
      { Item: "Events", Value: eventsValue },
      { Item: "Tasks", Value: tasksValue },
      { Item: "Heartbeat", Value: heartbeatValue },
      ...(lastHeartbeatValue ? [{ Item: "Last heartbeat", Value: lastHeartbeatValue }] : []),
      {
        Item: "Sessions",
        Value: `${summary.sessions.count} active · default ${defaults.model ?? "unknown"}${defaultCtx} · ${storeLabel}`,
      },
    ],
  });
  const securityAuditLines = buildStatusSecurityAuditLines({
    securityAudit,
    theme,
    shortenText,
    formatCliCommand,
  });

  const sessionsColumns = [
    { key: "Key", header: "Key", minWidth: 20, flex: true },
    { key: "Kind", header: "Kind", minWidth: 6 },
    { key: "Age", header: "Age", minWidth: 9 },
    { key: "Model", header: "Model", minWidth: 14 },
    { key: "Tokens", header: "Tokens", minWidth: 16 },
    ...(opts.verbose ? [{ key: "Cache", header: "Cache", minWidth: 16, flex: true }] : []),
  ];
  const sessionsRows = buildStatusSessionsRows({
    recent: summary.sessions.recent,
    verbose: opts.verbose,
    shortenText,
    formatTimeAgo,
    formatTokensCompact,
    formatPromptCacheCompact,
    muted,
  });
  const healthRows = health
    ? buildStatusHealthRows({
        health,
        formatHealthChannelLines,
        ok,
        warn,
        muted,
      })
    : undefined;
=======
>>>>>>> upstream/main
  const usageLines = usage
    ? await loadStatusProviderUsageModule().then(({ formatUsageReportLines }) =>
        formatUsageReportLines(usage),
      )
    : undefined;
<<<<<<< HEAD
  const updateHint = formatUpdateAvailableHint(update);
  const lines = await buildStatusCommandReportLines({
    heading: theme.heading,
    muted: theme.muted,
    renderTable,
    width: tableWidth,
    overviewRows,
    showTaskMaintenanceHint: summary.taskAudit.errors > 0,
    taskMaintenanceHint: `Task maintenance: ${formatCliCommand("openclaw tasks maintenance --apply")}`,
    pluginCompatibilityLines: buildStatusPluginCompatibilityLines({
      notices: pluginCompatibility,
      formatNotice: formatPluginCompatibilityNotice,
      warn: theme.warn,
      muted: theme.muted,
    }),
    pairingRecoveryLines: buildStatusPairingRecoveryLines({
      pairingRecovery,
      warn: theme.warn,
      muted: theme.muted,
      formatCliCommand,
    }),
    securityAuditLines,
    channelsColumns: statusChannelsTableColumns,
    channelsRows: buildStatusChannelsTableRows({
      rows: channels.rows,
      channelIssues,
      ok,
      warn,
      muted,
      accentDim: theme.accentDim,
      formatIssueMessage: (message) => shortenText(message, 84),
    }),
    sessionsColumns,
    sessionsRows,
    systemEventsRows: buildStatusSystemEventsRows({
      queuedSystemEvents: summary.queuedSystemEvents,
    }),
    systemEventsTrailer: buildStatusSystemEventsTrailer({
      queuedSystemEvents: summary.queuedSystemEvents,
      muted,
    }),
    healthColumns: health ? statusHealthColumns : undefined,
    healthRows,
    usageLines,
    footerLines: buildStatusFooterLines({
      updateHint,
      warn: theme.warn,
      formatCliCommand,
      nodeOnlyGateway,
      gatewayReachable,
    }),
  });
=======
  const overviewSurface = buildStatusOverviewSurfaceFromScan({
    scan: {
      cfg,
      update,
      tailscaleMode,
      tailscaleDns,
      tailscaleHttpsUrl,
      gatewayMode,
      remoteUrlMissing,
      gatewayConnection,
      gatewayReachable,
      gatewayProbe,
      gatewayProbeAuth,
      gatewayProbeAuthWarning,
      gatewaySelf,
    },
    gatewayService: daemon,
    nodeService: nodeDaemon,
    nodeOnlyGateway,
  });
  const updateRestartValue = formatUpdateRestartStatusValue(
    (await readRestartSentinel().catch(() => null))?.payload,
    {
      ok,
      warn,
      muted,
      formatTimeAgo,
    },
  );
  const lines = await buildStatusCommandReportLines(
    await buildStatusCommandReportData({
      opts,
      surface: overviewSurface,
      osSummary,
      summary,
      securityAudit,
      health,
      usageLines,
      lastHeartbeat,
      agentStatus,
      channels,
      channelIssues,
      memory,
      memoryPlugin,
      pluginCompatibility,
      pairingRecovery,
      tableWidth,
      ok,
      warn,
      muted,
      shortenText,
      formatCliCommand,
      formatTimeAgo,
      formatKTokens,
      formatTokensCompact,
      formatPromptCacheCompact,
      formatHealthChannelLines,
      formatPluginCompatibilityNotice,
      formatUpdateAvailableHint,
      resolveMemoryVectorState,
      resolveMemoryFtsState,
      resolveMemoryCacheSummary,
      accentDim: theme.accentDim,
      theme,
      renderTable,
      updateValue: updateSurface.updateAvailable
        ? warn(`available · ${updateSurface.updateLine}`)
        : updateSurface.updateLine,
      updateRestartValue,
    }),
  );
>>>>>>> upstream/main
  for (const line of lines) {
    runtime.log(line);
  }
}
