<<<<<<< HEAD
import { hasPotentialConfiguredChannels } from "../channels/config-presence.js";
import { resolveCommandConfigWithSecrets } from "../cli/command-config-resolution.js";
import { getStatusCommandSecretTargetIds } from "../cli/command-secret-targets.js";
import { readBestEffortConfig } from "../config/config.js";
=======
// Shared status scan overview used by compact status, status --json, and status --all.
// It collects config, update, gateway, channel, and local agent state before specialized callers add details.

>>>>>>> upstream/main
import type { OpenClawConfig } from "../config/types.js";
import type { collectChannelStatusIssues as collectChannelStatusIssuesFn } from "../infra/channels-status-issues.js";
import { resolveOsSummary } from "../infra/os-summary.js";
import type { UpdateCheckResult } from "../infra/update-check.js";
import type { RuntimeEnv } from "../runtime.js";
<<<<<<< HEAD
=======
import { createLazyImportLoader } from "../shared/lazy-promise.js";
>>>>>>> upstream/main
import type { buildChannelsTable as buildChannelsTableFn } from "./status-all/channels.js";
import type { getAgentLocalStatuses as getAgentLocalStatusesFn } from "./status.agent-local.js";
import {
  buildColdStartStatusSummary,
  createStatusScanCoreBootstrap,
} from "./status.scan.bootstrap-shared.js";
import { loadStatusScanCommandConfig } from "./status.scan.config-shared.js";
import type { GatewayProbeSnapshot } from "./status.scan.shared.js";

<<<<<<< HEAD
let statusScanDepsRuntimeModulePromise:
  | Promise<typeof import("./status.scan.deps.runtime.js")>
  | undefined;
let statusAgentLocalModulePromise: Promise<typeof import("./status.agent-local.js")> | undefined;
let statusUpdateModulePromise: Promise<typeof import("./status.update.js")> | undefined;
let statusScanRuntimeModulePromise: Promise<typeof import("./status.scan.runtime.js")> | undefined;
let gatewayCallModulePromise: Promise<typeof import("../gateway/call.js")> | undefined;
let statusSummaryModulePromise: Promise<typeof import("./status.summary.js")> | undefined;

function loadStatusScanDepsRuntimeModule() {
  statusScanDepsRuntimeModulePromise ??= import("./status.scan.deps.runtime.js");
  return statusScanDepsRuntimeModulePromise;
}

function loadStatusAgentLocalModule() {
  statusAgentLocalModulePromise ??= import("./status.agent-local.js");
  return statusAgentLocalModulePromise;
}

function loadStatusUpdateModule() {
  statusUpdateModulePromise ??= import("./status.update.js");
  return statusUpdateModulePromise;
}

function loadStatusScanRuntimeModule() {
  statusScanRuntimeModulePromise ??= import("./status.scan.runtime.js");
  return statusScanRuntimeModulePromise;
}

function loadGatewayCallModule() {
  gatewayCallModulePromise ??= import("../gateway/call.js");
  return gatewayCallModulePromise;
}

function loadStatusSummaryModule() {
  statusSummaryModulePromise ??= import("./status.summary.js");
  return statusSummaryModulePromise;
=======
type StatusGatewayProbeTimeoutResolver = (cfg: OpenClawConfig) => number | undefined;

const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(
  () => import("./status.scan.deps.runtime.js"),
);
const statusAgentLocalModuleLoader = createLazyImportLoader(
  () => import("./status.agent-local.js"),
);
const statusUpdateModuleLoader = createLazyImportLoader(() => import("./status.update.js"));
const statusScanRuntimeModuleLoader = createLazyImportLoader(
  () => import("./status.scan.runtime.js"),
);
const gatewayCallModuleLoader = createLazyImportLoader(() => import("../gateway/call.js"));
const statusSummaryModuleLoader = createLazyImportLoader(() => import("./status.summary.js"));
const channelPluginIdsModuleLoader = createLazyImportLoader(
  () => import("../plugins/channel-plugin-ids.js"),
);
const configModuleLoader = createLazyImportLoader(() => import("../config/config.js"));
const commandConfigResolutionModuleLoader = createLazyImportLoader(
  () => import("../cli/command-config-resolution.js"),
);
const commandSecretTargetsModuleLoader = createLazyImportLoader(
  () => import("../cli/command-secret-targets.js"),
);

function loadStatusScanDepsRuntimeModule() {
  return statusScanDepsRuntimeModuleLoader.load();
}

function loadStatusAgentLocalModule() {
  return statusAgentLocalModuleLoader.load();
}

function loadStatusUpdateModule() {
  return statusUpdateModuleLoader.load();
}

function loadStatusScanRuntimeModule() {
  return statusScanRuntimeModuleLoader.load();
}

function loadGatewayCallModule() {
  return gatewayCallModuleLoader.load();
}

function loadStatusSummaryModule() {
  return statusSummaryModuleLoader.load();
}

function loadChannelPluginIdsModule() {
  return channelPluginIdsModuleLoader.load();
}

function loadConfigModule() {
  return configModuleLoader.load();
}

function loadCommandConfigResolutionModule() {
  return commandConfigResolutionModuleLoader.load();
}

function loadCommandSecretTargetsModule() {
  return commandSecretTargetsModuleLoader.load();
>>>>>>> upstream/main
}

async function resolveStatusChannelsStatus(params: {
  cfg: OpenClawConfig;
  gatewayReachable: boolean;
  opts: { timeoutMs?: number; all?: boolean };
  gatewayCallOverrides?: GatewayProbeSnapshot["gatewayCallOverrides"];
  useGatewayCallOverrides?: boolean;
}) {
  if (!params.gatewayReachable) {
<<<<<<< HEAD
=======
    // Avoid a second gateway call after probe failure; channel tables can still summarize local config.
>>>>>>> upstream/main
    return null;
  }
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway({
    config: params.cfg,
    method: "channels.status",
    params: {
      probe: false,
      timeoutMs: Math.min(8000, params.opts.timeoutMs ?? 10_000),
    },
    timeoutMs: Math.min(params.opts.all ? 5000 : 2500, params.opts.timeoutMs ?? 10_000),
    ...(params.useGatewayCallOverrides === true ? (params.gatewayCallOverrides ?? {}) : {}),
  }).catch(() => null);
}

export type StatusScanOverviewResult = {
  coldStart: boolean;
  hasConfiguredChannels: boolean;
  skipColdStartNetworkChecks: boolean;
  cfg: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  secretDiagnostics: string[];
  osSummary: ReturnType<typeof resolveOsSummary>;
  tailscaleMode: string;
  tailscaleDns: string | null;
  tailscaleHttpsUrl: string | null;
  update: UpdateCheckResult;
  gatewaySnapshot: Pick<
    GatewayProbeSnapshot,
    | "gatewayConnection"
    | "remoteUrlMissing"
    | "gatewayMode"
    | "gatewayProbeAuth"
    | "gatewayProbeAuthWarning"
    | "gatewayProbe"
    | "gatewayReachable"
    | "gatewaySelf"
    | "gatewayCallOverrides"
  >;
  channelsStatus: unknown;
  channelIssues: ReturnType<typeof collectChannelStatusIssuesFn>;
  channels: Awaited<ReturnType<typeof buildChannelsTableFn>>;
  agentStatus: Awaited<ReturnType<typeof getAgentLocalStatusesFn>>;
};

<<<<<<< HEAD
=======
/** Collects the common status scan data shared by text, JSON, and status-all commands. */
>>>>>>> upstream/main
export async function collectStatusScanOverview(params: {
  commandName: string;
  opts: { timeoutMs?: number; all?: boolean };
  showSecrets: boolean;
  runtime?: RuntimeEnv;
  allowMissingConfigFastPath?: boolean;
<<<<<<< HEAD
  resolveHasConfiguredChannels?: (cfg: OpenClawConfig) => boolean;
  includeChannelsData?: boolean;
  useGatewayCallOverridesForChannelsStatus?: boolean;
=======
  skipUpdateCheck?: boolean;
  fetchGitUpdate?: boolean;
  includeRegistryUpdate?: boolean;
  resolveHasConfiguredChannels?: (
    cfg: OpenClawConfig,
    sourceConfig: OpenClawConfig,
  ) => boolean | Promise<boolean>;
  includeChannelsData?: boolean;
  includeLiveChannelStatus?: boolean;
  includeLocalStatusRpcFallback?: boolean;
  gatewayProbeTimeoutMs?: number | StatusGatewayProbeTimeoutResolver;
  includeChannelSetupRuntimeFallback?: boolean;
  channelCredentialResolutionSkipped?: boolean;
  useGatewayCallOverridesForChannelsStatus?: boolean;
  includeChannelSecretTargets?: boolean;
  skipConfigPluginValidation?: boolean;
>>>>>>> upstream/main
  progress?: {
    setLabel(label: string): void;
    tick(): void;
  };
  labels?: {
    loadingConfig?: string;
    checkingTailscale?: string;
    checkingForUpdates?: string;
    resolvingAgents?: string;
    probingGateway?: string;
    queryingChannelStatus?: string;
    summarizingChannels?: string;
  };
}): Promise<StatusScanOverviewResult> {
  if (params.labels?.loadingConfig) {
    params.progress?.setLabel(params.labels.loadingConfig);
  }
  const {
    coldStart,
    sourceConfig,
    resolvedConfig: cfg,
    secretDiagnostics,
  } = await loadStatusScanCommandConfig({
    commandName: params.commandName,
    allowMissingConfigFastPath: params.allowMissingConfigFastPath,
<<<<<<< HEAD
    readBestEffortConfig,
    resolveConfig: async (loadedConfig) =>
      await resolveCommandConfigWithSecrets({
        config: loadedConfig,
        commandName: params.commandName,
        targetIds: getStatusCommandSecretTargetIds(),
=======
    readBestEffortConfig: async () =>
      (await loadConfigModule()).readBestEffortConfig({
        skipPluginValidation: params.skipConfigPluginValidation,
      }),
    resolveConfig: async (loadedConfig) =>
      await (
        await loadCommandConfigResolutionModule()
      ).resolveCommandConfigWithSecrets({
        config: loadedConfig,
        commandName: params.commandName,
        targetIds: (await loadCommandSecretTargetsModule()).getStatusCommandSecretTargetIds(
          loadedConfig,
          process.env,
          { includeChannelTargets: params.includeChannelSecretTargets },
        ),
>>>>>>> upstream/main
        mode: "read_only_status",
        ...(params.runtime ? { runtime: params.runtime } : {}),
      }),
  });
  params.progress?.tick();
  const hasConfiguredChannels = params.resolveHasConfiguredChannels
<<<<<<< HEAD
    ? params.resolveHasConfiguredChannels(cfg)
    : hasPotentialConfiguredChannels(cfg);
  const osSummary = resolveOsSummary();
=======
    ? await params.resolveHasConfiguredChannels(cfg, sourceConfig)
    : await loadChannelPluginIdsModule().then(({ hasConfiguredChannelsForReadOnlyScope }) =>
        hasConfiguredChannelsForReadOnlyScope({
          config: cfg,
          activationSourceConfig: sourceConfig,
        }),
      );
  const osSummary = resolveOsSummary();
  const gatewayProbeTimeoutMs =
    typeof params.gatewayProbeTimeoutMs === "function"
      ? params.gatewayProbeTimeoutMs(cfg)
      : params.gatewayProbeTimeoutMs;
>>>>>>> upstream/main
  const bootstrap = await createStatusScanCoreBootstrap<
    Awaited<ReturnType<typeof getAgentLocalStatusesFn>>
  >({
    coldStart,
    cfg,
    hasConfiguredChannels,
    opts: params.opts,
<<<<<<< HEAD
=======
    skipUpdateCheck: params.skipUpdateCheck,
    fetchGitUpdate: params.fetchGitUpdate,
    includeRegistryUpdate: params.includeRegistryUpdate,
    includeLocalStatusRpcFallback: params.includeLocalStatusRpcFallback,
    gatewayProbeTimeoutMs,
>>>>>>> upstream/main
    getTailnetHostname: async (runner) =>
      await loadStatusScanDepsRuntimeModule().then(({ getTailnetHostname }) =>
        getTailnetHostname(runner),
      ),
    getUpdateCheckResult: async (updateParams) =>
      await loadStatusUpdateModule().then(({ getUpdateCheckResult }) =>
        getUpdateCheckResult(updateParams),
      ),
    getAgentLocalStatuses: async (bootstrapCfg) =>
      await loadStatusAgentLocalModule().then(({ getAgentLocalStatuses }) =>
        getAgentLocalStatuses(bootstrapCfg),
      ),
  });

  if (params.labels?.checkingTailscale) {
    params.progress?.setLabel(params.labels.checkingTailscale);
  }
  const tailscaleDns = await bootstrap.tailscaleDnsPromise;
  params.progress?.tick();

  if (params.labels?.checkingForUpdates) {
    params.progress?.setLabel(params.labels.checkingForUpdates);
  }
  const update = await bootstrap.updatePromise;
  params.progress?.tick();

  if (params.labels?.resolvingAgents) {
    params.progress?.setLabel(params.labels.resolvingAgents);
  }
  const agentStatus = await bootstrap.agentStatusPromise;
  params.progress?.tick();

  if (params.labels?.probingGateway) {
    params.progress?.setLabel(params.labels.probingGateway);
  }
  const gatewaySnapshot = await bootstrap.gatewayProbePromise;
  params.progress?.tick();

  const tailscaleHttpsUrl = await bootstrap.resolveTailscaleHttpsUrl();
  const includeChannelsData = params.includeChannelsData !== false;
<<<<<<< HEAD
=======
  const includeLiveChannelStatus = params.includeLiveChannelStatus !== false;
>>>>>>> upstream/main
  const { channelsStatus, channelIssues, channels } = includeChannelsData
    ? await (async () => {
        if (params.labels?.queryingChannelStatus) {
          params.progress?.setLabel(params.labels.queryingChannelStatus);
        }
<<<<<<< HEAD
        const channelsStatus = await resolveStatusChannelsStatus({
          cfg,
          gatewayReachable: gatewaySnapshot.gatewayReachable,
          opts: params.opts,
          gatewayCallOverrides: gatewaySnapshot.gatewayCallOverrides,
          useGatewayCallOverrides: params.useGatewayCallOverridesForChannelsStatus,
        });
        params.progress?.tick();
        const { collectChannelStatusIssues, buildChannelsTable } =
          await loadStatusScanRuntimeModule().then(({ statusScanRuntime }) => statusScanRuntime);
        const channelIssues = channelsStatus ? collectChannelStatusIssues(channelsStatus) : [];
        if (params.labels?.summarizingChannels) {
          params.progress?.setLabel(params.labels.summarizingChannels);
        }
        const channels = await buildChannelsTable(cfg, {
          showSecrets: params.showSecrets,
          sourceConfig,
        });
        params.progress?.tick();
        return { channelsStatus, channelIssues, channels };
      })()
    : {
=======
        const channelsStatusLocal = includeLiveChannelStatus
          ? await resolveStatusChannelsStatus({
              cfg,
              gatewayReachable: gatewaySnapshot.gatewayReachable,
              opts: params.opts,
              gatewayCallOverrides: gatewaySnapshot.gatewayCallOverrides,
              useGatewayCallOverrides: params.useGatewayCallOverridesForChannelsStatus,
            })
          : null;
        params.progress?.tick();
        // Runtime channel helpers stay lazy because JSON fast paths can skip channel data entirely.
        const { collectChannelStatusIssues, buildChannelsTable } =
          await loadStatusScanRuntimeModule().then(({ statusScanRuntime }) => statusScanRuntime);
        const channelIssuesLocal = channelsStatusLocal
          ? collectChannelStatusIssues(channelsStatusLocal)
          : [];
        if (params.labels?.summarizingChannels) {
          params.progress?.setLabel(params.labels.summarizingChannels);
        }
        const channelsLocal = await buildChannelsTable(cfg, {
          showSecrets: params.showSecrets,
          sourceConfig,
          includeSetupFallbackPlugins: params.includeChannelSetupRuntimeFallback !== false,
          liveChannelStatus: channelsStatusLocal,
          ...(params.channelCredentialResolutionSkipped === true
            ? { credentialResolutionSkipped: true }
            : {}),
        });
        params.progress?.tick();
        return {
          channelsStatus: channelsStatusLocal,
          channelIssues: channelIssuesLocal,
          channels: channelsLocal,
        };
      })()
    : {
        // Some JSON/fast scans only need gateway/config fields; keep channel output structurally empty.
>>>>>>> upstream/main
        channelsStatus: null,
        channelIssues: [],
        channels: { rows: [], details: [] },
      };

  return {
    coldStart,
    hasConfiguredChannels,
    skipColdStartNetworkChecks: bootstrap.skipColdStartNetworkChecks,
    cfg,
    sourceConfig,
    secretDiagnostics,
    osSummary,
    tailscaleMode: bootstrap.tailscaleMode,
    tailscaleDns,
    tailscaleHttpsUrl,
    update,
    gatewaySnapshot,
    channelsStatus,
    channelIssues,
    channels,
    agentStatus,
  };
}

<<<<<<< HEAD
export async function resolveStatusSummaryFromOverview(params: {
  overview: Pick<StatusScanOverviewResult, "skipColdStartNetworkChecks" | "cfg" | "sourceConfig">;
=======
/** Resolves the summary object from overview data, preserving cold-start fast-path behavior. */
export async function resolveStatusSummaryFromOverview(params: {
  overview: Pick<StatusScanOverviewResult, "skipColdStartNetworkChecks" | "cfg" | "sourceConfig">;
  includeChannelSummary?: boolean;
>>>>>>> upstream/main
}) {
  if (params.overview.skipColdStartNetworkChecks) {
    return buildColdStartStatusSummary();
  }
  return await loadStatusSummaryModule().then(({ getStatusSummary }) =>
    getStatusSummary({
      config: params.overview.cfg,
      sourceConfig: params.overview.sourceConfig,
<<<<<<< HEAD
=======
      includeChannelSummary: params.includeChannelSummary,
>>>>>>> upstream/main
    }),
  );
}
