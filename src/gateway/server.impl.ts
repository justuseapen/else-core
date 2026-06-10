// Gateway server implementation builds runtime state, method registries, HTTP
// and WebSocket surfaces, config reload hooks, and graceful restart/shutdown.
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { uniqueStrings } from "@openclaw/normalization-core/string-normalization";
import { getActiveEmbeddedRunCount } from "../agents/embedded-agent-runner/run-state.js";
import { getTotalPendingReplies } from "../auto-reply/reply/dispatcher-registry.js";
<<<<<<< HEAD
import type { CanvasHostServer } from "../canvas-host/server.js";
import { type ChannelId, listChannelPlugins } from "../channels/plugins/index.js";
import { runChannelPluginStartupMaintenance } from "../channels/plugins/lifecycle-startup.js";
import { formatCliCommand } from "../cli/command-format.js";
=======
import {
  getLoadedChannelPluginEntryById,
  listLoadedChannelPlugins,
} from "../channels/plugins/registry-loaded.js";
import type { ChannelId } from "../channels/plugins/types.public.js";
>>>>>>> upstream/main
import { createDefaultDeps } from "../cli/deps.js";
import { isRestartEnabled } from "../config/commands.flags.js";
import {
<<<<<<< HEAD
  type ConfigFileSnapshot,
  type OpenClawConfig,
  applyConfigOverrides,
  getRuntimeConfig,
  isNixMode,
  loadConfig,
  registerConfigWriteListener,
=======
  getRuntimeConfig,
  promoteConfigSnapshotToLastKnownGood,
>>>>>>> upstream/main
  readConfigFileSnapshot,
  registerConfigWriteListener,
  setRuntimeConfigSnapshot,
  type ReadConfigFileSnapshotWithPluginMetadataResult,
} from "../config/io.js";
import { isNixMode, normalizeStateDirEnv } from "../config/paths.js";
import { applyConfigOverrides } from "../config/runtime-overrides.js";
import { resolveMainSessionKey } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
<<<<<<< HEAD
  ensureControlUiAssetsBuilt,
  isPackageProvenControlUiRootSync,
  resolveControlUiRootOverrideSync,
  resolveControlUiRootSync,
} from "../infra/control-ui-assets.js";
import { isDiagnosticsEnabled } from "../infra/diagnostic-events.js";
import { isTruthyEnvValue, logAcceptedEnvOption } from "../infra/env.js";
import { createExecApprovalForwarder } from "../infra/exec-approval-forwarder.js";
import { onHeartbeatEvent } from "../infra/heartbeat-events.js";
import { startHeartbeatRunner, type HeartbeatRunner } from "../infra/heartbeat-runner.js";
import { getMachineDisplayName } from "../infra/machine-name.js";
import { ensureOpenClawCliOnPath } from "../infra/path-env.js";
=======
  isDiagnosticsEnabled,
  setDiagnosticsEnabledForProcess,
} from "../infra/diagnostic-events.js";
import {
  emitDiagnosticsTimelineEvent,
  isDiagnosticsTimelineEnabled,
} from "../infra/diagnostics-timeline.js";
import { isTruthyEnvValue, isVitestRuntimeEnv, logAcceptedEnvOption } from "../infra/env.js";
import { ensureOpenClawCliOnPath } from "../infra/path-env.js";
import { readGatewayRestartHandoffSync } from "../infra/restart-handoff.js";
>>>>>>> upstream/main
import { setGatewaySigusr1RestartPolicy, setPreRestartDeferralCheck } from "../infra/restart.js";
import { enqueueSystemEvent } from "../infra/system-events.js";
import type { VoiceWakeRoutingConfig } from "../infra/voicewake-routing.js";
import { withDiagnosticPhase } from "../logging/diagnostic-phase.js";
import { startDiagnosticHeartbeat, stopDiagnosticHeartbeat } from "../logging/diagnostic.js";
import { createSubsystemLogger, runtimeForLogger } from "../logging/subsystem.js";
<<<<<<< HEAD
import {
  resolveConfiguredDeferredChannelPluginIds,
  resolveGatewayStartupPluginIds,
} from "../plugins/channel-plugin-ids.js";
import { getGlobalHookRunner, runGlobalGatewayStopSafely } from "../plugins/hook-runner-global.js";
import { createEmptyPluginRegistry } from "../plugins/registry.js";
import { getActivePluginRegistry, setActivePluginRegistry } from "../plugins/runtime.js";
import { createPluginRuntime } from "../plugins/runtime/index.js";
import type { PluginServicesHandle } from "../plugins/services.js";
import { getTotalQueueSize } from "../process/command-queue.js";
import type { RuntimeEnv } from "../runtime.js";
import {
  resolveCommandSecretsFromActiveRuntimeSnapshot,
  type CommandSecretAssignment,
} from "../secrets/runtime-command-secrets.js";
=======
import { setCurrentPluginMetadataSnapshot } from "../plugins/current-plugin-metadata-snapshot.js";
import type { PluginHookGatewayCronService } from "../plugins/hook-types.js";
import { clearPluginMetadataLifecycleCaches } from "../plugins/plugin-metadata-lifecycle.js";
import {
  pinActivePluginChannelRegistry,
  pinActivePluginHttpRouteRegistry,
} from "../plugins/runtime.js";
import type { PluginRuntime } from "../plugins/runtime/types.js";
import { getTotalQueueSize } from "../process/command-queue.js";
import type { RuntimeEnv } from "../runtime.js";
>>>>>>> upstream/main
import {
  clearSecretsRuntimeSnapshot,
<<<<<<< HEAD
  getActiveSecretsRuntimeSnapshot,
  prepareSecretsRuntimeSnapshot,
} from "../secrets/runtime.js";
import { onSessionLifecycleEvent } from "../sessions/session-lifecycle-events.js";
import { onSessionTranscriptUpdate } from "../sessions/transcript-events.js";
import {
  getInspectableTaskRegistrySummary,
  startTaskRegistryMaintenance,
  stopTaskRegistryMaintenance,
} from "../tasks/task-registry.maintenance.js";
import { runSetupWizard } from "../wizard/setup.js";
import { createAuthRateLimiter, type AuthRateLimiter } from "./auth-rate-limit.js";
import { resolveGatewayAuth } from "./auth.js";
import { startChannelHealthMonitor } from "./channel-health-monitor.js";
import { startGatewayConfigReloader } from "./config-reload.js";
import type { ControlUiRootState } from "./control-ui.js";
import {
  GATEWAY_EVENT_UPDATE_AVAILABLE,
  type GatewayUpdateAvailableEventPayload,
} from "./events.js";
import { createExecApprovalIosPushDelivery } from "./exec-approval-ios-push.js";
import { ExecApprovalManager } from "./exec-approval-manager.js";
import { startMcpLoopbackServer } from "./mcp-http.js";
import { startGatewayModelPricingRefresh } from "./model-pricing-cache.js";
import { NodeRegistry } from "./node-registry.js";
import { createChannelManager } from "./server-channels.js";
=======
  getActiveSecretsRuntimeConfigSnapshot,
} from "../secrets/runtime-state.js";
import { createAuthRateLimiter, type AuthRateLimiter } from "./auth-rate-limit.js";
import { resolveGatewayAuth } from "./auth.js";
import { ADMIN_SCOPE } from "./method-scopes.js";
import {
  STARTUP_UNAVAILABLE_GATEWAY_METHODS,
  listCoreGatewayMethodNames,
} from "./methods/core-descriptors.js";
>>>>>>> upstream/main
import {
  createCoreGatewayMethodDescriptors,
  createGatewayMethodDescriptorsFromHandlers,
  createGatewayMethodRegistry,
  createPluginGatewayMethodDescriptors,
  isCoreGatewayMethodClassified,
  type GatewayMethodRegistry,
} from "./methods/registry.js";
import { isLoopbackHost } from "./net.js";
import {
  listChannelPluginConfigTargetIds,
  pluginConfigTargetsChanged,
} from "./plugin-channel-reload-targets.js";
import {
  collectGatewayProcessMemoryUsageMb,
  finishGatewayRestartTrace,
  recordGatewayRestartTraceDetail,
  recordGatewayRestartTraceSpan,
  resumeGatewayRestartTraceFromEnv,
  resumeGatewayRestartTraceFromHandoff,
} from "./restart-trace.js";
import { resolveGatewayPluginConfig } from "./runtime-plugin-config.js";
import { resolveGatewayControlUiRootState } from "./server-control-ui-root.js";
import { createLazyGatewayCronState } from "./server-cron-lazy.js";
import { applyGatewayLaneConcurrency } from "./server-lanes.js";
<<<<<<< HEAD
import { startGatewayMaintenanceTimers } from "./server-maintenance.js";
import { GATEWAY_EVENTS, listGatewayMethods } from "./server-methods-list.js";
import { coreGatewayHandlers } from "./server-methods.js";
import { createExecApprovalHandlers } from "./server-methods/exec-approval.js";
import { safeParseJson } from "./server-methods/nodes.helpers.js";
import { createPluginApprovalHandlers } from "./server-methods/plugin-approval.js";
import { createSecretsHandlers } from "./server-methods/secrets.js";
import { hasConnectedMobileNode } from "./server-mobile-nodes.js";
import { loadGatewayModelCatalog } from "./server-model-catalog.js";
import { createNodeSubscriptionManager } from "./server-node-subscriptions.js";
import {
  loadGatewayStartupPlugins,
  reloadDeferredGatewayPlugins,
} from "./server-plugin-bootstrap.js";
=======
import { createGatewayServerLiveState, type GatewayServerLiveState } from "./server-live-state.js";
import { GATEWAY_EVENTS } from "./server-methods-list.js";
import type { GatewayRequestContext, GatewayRequestHandlers } from "./server-methods/types.js";
>>>>>>> upstream/main
import { setFallbackGatewayContextResolver } from "./server-plugins.js";
import type { GatewayPluginReloadResult } from "./server-reload-handlers.js";
import { createGatewayRuntimeState } from "./server-runtime-state.js";
<<<<<<< HEAD
import { resolveSessionKeyForRun } from "./server-session-key.js";
import { logGatewayStartup } from "./server-startup-log.js";
import { runStartupSessionMigration } from "./server-startup-session-migration.js";
import { startGatewaySidecars } from "./server-startup.js";
import { startGatewayTailscaleExposure } from "./server-tailscale.js";
=======
import {
  enforceSharedGatewaySessionGenerationForConfigWrite,
  getRequiredSharedGatewaySessionGeneration,
  type SharedGatewaySessionGenerationState,
} from "./server-shared-auth-generation.js";
>>>>>>> upstream/main
import { createWizardSessionTracker } from "./server-wizard-sessions.js";
import { createGatewayEventLoopHealthMonitor } from "./server/event-loop-health.js";
import {
  getHealthCache,
  getHealthVersion,
  getPresenceVersion,
  incrementPresenceVersion,
  refreshGatewayHealthSnapshot,
} from "./server/health-state.js";
import { resolveHookClientIpConfig } from "./server/hook-client-ip-config.js";
import { createReadinessChecker } from "./server/readiness.js";
import { loadGatewayTlsRuntime } from "./server/tls.js";
import { resolveSharedGatewaySessionGeneration } from "./server/ws-shared-generation.js";
import { maybeSeedControlUiAllowedOriginsAtStartup } from "./startup-control-ui-origins.js";

type LoadGatewayModelCatalog = typeof import("./server-model-catalog.js").loadGatewayModelCatalog;

let gatewayModelCatalogModulePromise: Promise<typeof import("./server-model-catalog.js")> | null =
  null;

const loadGatewayModelCatalogModule = async () => {
  gatewayModelCatalogModulePromise ??= import("./server-model-catalog.js");
  return await gatewayModelCatalogModulePromise;
};

export async function resetModelCatalogCacheForTest(): Promise<void> {
  const { resetModelCatalogCacheForTest: resetModelCatalogCacheForTestLocal } =
    await loadGatewayModelCatalogModule();
  await resetModelCatalogCacheForTestLocal();
}

ensureOpenClawCliOnPath();

const MAX_MEDIA_TTL_HOURS = 24 * 7;
const POST_READY_MAINTENANCE_DELAY_MS = 250;

type GatewayStartupChannelPlugin = {
  id: ChannelId;
  gatewayMethods?: readonly string[];
  gatewayMethodDescriptors?: readonly { name: string }[];
  meta: {
    aliases?: readonly string[];
  };
};

let gatewayStartupEarlyModulePromise: Promise<typeof import("./server-startup-early.js")> | null =
  null;
let gatewayStartupPostAttachModulePromise: Promise<
  typeof import("./server-startup-post-attach.js")
> | null = null;

function loadGatewayStartupEarlyModule(): Promise<typeof import("./server-startup-early.js")> {
  gatewayStartupEarlyModulePromise ??= import("./server-startup-early.js");
  return gatewayStartupEarlyModulePromise;
}

function loadGatewayStartupPostAttachModule(): Promise<
  typeof import("./server-startup-post-attach.js")
> {
  gatewayStartupPostAttachModulePromise ??= import("./server-startup-post-attach.js");
  return gatewayStartupPostAttachModulePromise;
}

function listGatewayStartupChannelPlugins(): GatewayStartupChannelPlugin[] {
  return listLoadedChannelPlugins() as GatewayStartupChannelPlugin[];
}

function resolveMediaCleanupTtlMs(ttlHoursRaw: number): number {
  const ttlHours = Math.min(Math.max(ttlHoursRaw, 1), MAX_MEDIA_TTL_HOURS);
  const ttlMs = ttlHours * 60 * 60_000;
  if (!Number.isFinite(ttlMs) || !Number.isSafeInteger(ttlMs)) {
    throw new Error(`Invalid media.ttlHours: ${String(ttlHoursRaw)}`);
  }
  return ttlMs;
}

const log = createSubsystemLogger("gateway");
const logDiscovery = log.child("discovery");
const logTailscale = log.child("tailscale");
const logChannels = log.child("channels");

let cachedChannelRuntimePromise: Promise<PluginRuntime["channel"]> | null = null;

function getChannelRuntime() {
  cachedChannelRuntimePromise ??= import("../plugins/runtime/runtime-channel.js").then(
    ({ createRuntimeChannel }) => createRuntimeChannel(),
  );
  return cachedChannelRuntimePromise;
}

<<<<<<< HEAD
function pruneSkippedStartupSecretSurfaces(config: OpenClawConfig): OpenClawConfig {
  const skipChannels =
    isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) ||
    isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS);
  if (!skipChannels || !config.channels) {
    return config;
  }
  return {
    ...config,
    channels: undefined,
  };
}

=======
async function closeMcpLoopbackServerOnDemand(): Promise<void> {
  const { closeMcpLoopbackServer } = await import("./mcp-http.js");
  await closeMcpLoopbackServer();
}

let gatewayCloseModulePromise: Promise<typeof import("./server-close.runtime.js")> | null = null;

function loadGatewayCloseModule(): Promise<typeof import("./server-close.runtime.js")> {
  gatewayCloseModulePromise ??= import("./server-close.runtime.js");
  return gatewayCloseModulePromise;
}

const loadGatewayModelCatalog: LoadGatewayModelCatalog = async (...args) => {
  const mod = await loadGatewayModelCatalogModule();
  return mod.loadGatewayModelCatalog(...args);
};

let gatewayPluginBootstrapModulePromise: Promise<
  typeof import("./server-plugin-bootstrap.js")
> | null = null;

const loadGatewayPluginBootstrapModule = async () => {
  gatewayPluginBootstrapModulePromise ??= import("./server-plugin-bootstrap.js");
  return await gatewayPluginBootstrapModulePromise;
};

>>>>>>> upstream/main
const logHealth = log.child("health");
const logCron = log.child("cron");
const logReload = log.child("reload");
const logHooks = log.child("hooks");
const logPlugins = log.child("plugins");
const logWsControl = log.child("ws");
const logSecrets = log.child("secrets");
const gatewayRuntime = runtimeForLogger(log);

function createGatewayStartupTrace() {
  const logEnabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
  let timelineConfig: OpenClawConfig | undefined;
  let eventLoopDelay: ReturnType<typeof monitorEventLoopDelay> | undefined;
  const timelineOptions = () => ({
    ...(timelineConfig ? { config: timelineConfig } : {}),
    env: process.env,
  });
  const eventLoopTimelineEnabled = () =>
    isDiagnosticsTimelineEnabled(timelineOptions()) &&
    isTruthyEnvValue(process.env.OPENCLAW_DIAGNOSTICS_EVENT_LOOP);
  const ensureEventLoopDelay = () => {
    if (eventLoopDelay || (!logEnabled && !eventLoopTimelineEnabled())) {
      return;
    }
    eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
    eventLoopDelay.enable();
  };
  ensureEventLoopDelay();
  const started = performance.now();
  let last = started;
  let spanSequence = 0;
  const formatMetric = (key: string, value: number | string) =>
    `${key}=${typeof value === "number" ? value.toFixed(1) : value}`;
  const mapTimelineName = (name: string) => {
    switch (name) {
      case "config.snapshot":
        return "config.load";
      case "config.auth":
      case "config.final-snapshot":
      case "runtime.config":
        return "config.normalize";
      case "plugins.bootstrap":
        return "plugins.load";
      case "runtime.post-attach":
      case "ready":
        return "gateway.ready";
      default:
        return name;
    }
  };
  const takeEventLoopSample = () => {
    if (!eventLoopDelay) {
      return undefined;
    }
    const sample = {
      p50Ms: eventLoopDelay.percentile(50) / 1_000_000,
      p95Ms: eventLoopDelay.percentile(95) / 1_000_000,
      p99Ms: eventLoopDelay.percentile(99) / 1_000_000,
      maxMs: eventLoopDelay.max / 1_000_000,
    };
    eventLoopDelay.reset();
    return sample;
  };
  const emitEventLoopTimelineSample = (
    activeSpanName: string,
    sample: ReturnType<typeof takeEventLoopSample>,
  ) => {
    if (!eventLoopTimelineEnabled()) {
      return;
    }
    if (!sample) {
      return;
    }
    emitDiagnosticsTimelineEvent(
      {
        type: "eventLoop.sample",
        name: "eventLoop",
        phase: "startup",
        activeSpanName: mapTimelineName(activeSpanName),
        attributes:
          activeSpanName === mapTimelineName(activeSpanName)
            ? undefined
            : { traceName: activeSpanName },
        ...sample,
      },
      timelineOptions(),
    );
  };
  const emit = (
    name: string,
    durationMs: number,
    totalMs: number,
    eventLoopSample: ReturnType<typeof takeEventLoopSample>,
    extras: ReadonlyArray<readonly [string, number | string]> = [],
  ) => {
    const metrics = [
      ["eventLoopMax", `${(eventLoopSample?.maxMs ?? 0).toFixed(1)}ms`] as const,
      ...extras,
    ];
    recordGatewayRestartTraceSpan(`restart.ready.${name}`, durationMs, totalMs, metrics);
    if (logEnabled) {
      log.info(
        `startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`,
      );
    }
  };
  return {
    setConfig(config: OpenClawConfig) {
      timelineConfig = config;
      ensureEventLoopDelay();
    },
    mark(name: string) {
      const now = performance.now();
      const eventLoopSample = takeEventLoopSample();
      emit(name, now - last, now - started, eventLoopSample);
      emitDiagnosticsTimelineEvent(
        {
          type: "mark",
          name: mapTimelineName(name),
          phase: "startup",
          durationMs: now - started,
          attributes: name === mapTimelineName(name) ? undefined : { traceName: name },
        },
        timelineOptions(),
      );
      emitEventLoopTimelineSample(name, eventLoopSample);
      last = now;
      if (name === "ready") {
        eventLoopDelay?.disable();
      }
    },
    detail(name: string, metrics: ReadonlyArray<readonly [string, number | string]>) {
      const attributes = Object.fromEntries(metrics);
      recordGatewayRestartTraceDetail(`restart.ready.${name}`, metrics);
      if (logEnabled) {
        log.info(
          `startup trace: ${name} ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`,
        );
      }
      emitDiagnosticsTimelineEvent(
        {
          type: "mark",
          name: mapTimelineName(name),
          phase: "startup",
          attributes: {
            traceName: name,
            ...attributes,
          },
        },
        timelineOptions(),
      );
    },
    async measure<T>(
      name: string,
      run: () => Promise<T> | T,
      options: { omitErrorMessage?: boolean } = {},
    ): Promise<T> {
      const before = performance.now();
      const spanId = `gateway-startup-${++spanSequence}`;
      emitDiagnosticsTimelineEvent(
        {
          type: "span.start",
          name: mapTimelineName(name),
          phase: "startup",
          spanId,
          attributes: name === mapTimelineName(name) ? undefined : { traceName: name },
        },
        timelineOptions(),
      );
      try {
        const result = await withDiagnosticPhase(mapTimelineName(name), run, { traceName: name });
        const now = performance.now();
        emitDiagnosticsTimelineEvent(
          {
            type: "span.end",
            name: mapTimelineName(name),
            phase: "startup",
            spanId,
            durationMs: now - before,
            attributes: name === mapTimelineName(name) ? undefined : { traceName: name },
          },
          timelineOptions(),
        );
        return result;
      } catch (error) {
        const now = performance.now();
        emitDiagnosticsTimelineEvent(
          {
            type: "span.error",
            name: mapTimelineName(name),
            phase: "startup",
            spanId,
            durationMs: now - before,
            attributes: name === mapTimelineName(name) ? undefined : { traceName: name },
            errorName: error instanceof Error ? error.name : typeof error,
            ...(options.omitErrorMessage
              ? {}
              : { errorMessage: error instanceof Error ? error.message : String(error) }),
          },
          timelineOptions(),
        );
        throw error;
      } finally {
        const now = performance.now();
        const eventLoopSample = takeEventLoopSample();
        emit(name, now - before, now - started, eventLoopSample);
        emitEventLoopTimelineSample(name, eventLoopSample);
        last = now;
      }
    },
  };
}

function formatRuntimeGatewayAuthTokenWarning(): string {
  const base =
    "Gateway auth token was missing. Generated a runtime token for this startup without changing config; restart will generate a different token.";
  if (!isNixMode) {
    return `${base} Persist one with \`openclaw config set gateway.auth.mode token\` and \`openclaw config set gateway.auth.token <token>\`.`;
  }
  return [
    base,
    "In Nix mode, set gateway.auth.token in your Nix-managed OpenClaw config and rebuild.",
    "For the first-party Nix flow, see https://github.com/openclaw/nix-openclaw#quick-start and https://docs.openclaw.ai/install/nix.",
  ].join(" ");
}

async function stopTaskRegistryMaintenanceOnDemand(): Promise<void> {
  const { stopTaskRegistryMaintenance } = await import("../tasks/task-registry.maintenance.js");
  stopTaskRegistryMaintenance();
}

type AuthRateLimitConfig = Parameters<typeof createAuthRateLimiter>[0];

function createGatewayAuthRateLimiters(rateLimitConfig: AuthRateLimitConfig | undefined): {
  rateLimiter: AuthRateLimiter;
  browserRateLimiter: AuthRateLimiter;
} {
  // Keep remote non-browser and HTTP auth attempts throttled by default while
  // preserving the normal loopback exemption unless operators configure otherwise.
  const rateLimiter = createAuthRateLimiter(rateLimitConfig ?? {});
  // Browser-origin WS auth attempts always use loopback-non-exempt throttling.
  const browserRateLimiter = createAuthRateLimiter({
    ...rateLimitConfig,
    exemptLoopback: false,
  });
  return { rateLimiter, browserRateLimiter };
}

<<<<<<< HEAD
function logGatewayAuthSurfaceDiagnostics(prepared: {
  sourceConfig: OpenClawConfig;
  warnings: Array<{ code: string; path: string; message: string }>;
}): void {
  const states = evaluateGatewayAuthSurfaceStates({
    config: prepared.sourceConfig,
    defaults: prepared.sourceConfig.secrets?.defaults,
    env: process.env,
  });
  const inactiveWarnings = new Map<string, string>();
  for (const warning of prepared.warnings) {
    if (warning.code !== "SECRETS_REF_IGNORED_INACTIVE_SURFACE") {
      continue;
    }
    inactiveWarnings.set(warning.path, warning.message);
  }
  for (const path of GATEWAY_AUTH_SURFACE_PATHS) {
    const state = states[path];
    if (!state.hasSecretRef) {
      continue;
    }
    const stateLabel = state.active ? "active" : "inactive";
    const inactiveDetails =
      !state.active && inactiveWarnings.get(path) ? inactiveWarnings.get(path) : undefined;
    const details = inactiveDetails ?? state.reason;
    logSecrets.info(`[SECRETS_GATEWAY_AUTH_SURFACE] ${path} is ${stateLabel}. ${details}`);
  }
}

function applyGatewayAuthOverridesForStartupPreflight(
  config: OpenClawConfig,
  overrides: Pick<GatewayServerOptions, "auth" | "tailscale">,
): OpenClawConfig {
  if (!overrides.auth && !overrides.tailscale) {
    return config;
  }
  return {
    ...config,
    gateway: {
      ...config.gateway,
      auth: mergeGatewayAuthConfig(config.gateway?.auth, overrides.auth),
      tailscale: mergeGatewayTailscaleConfig(config.gateway?.tailscale, overrides.tailscale),
    },
  };
}

function assertValidGatewayStartupConfigSnapshot(
  snapshot: ConfigFileSnapshot,
  options: { includeDoctorHint?: boolean } = {},
): void {
  if (snapshot.valid) {
    return;
  }
  const issues =
    snapshot.issues.length > 0
      ? formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }).join("\n")
      : "Unknown validation issue.";
  const doctorHint = options.includeDoctorHint
    ? `\nRun "${formatCliCommand("openclaw doctor --fix")}" to repair, then retry.`
    : "";
  throw new Error(`Invalid config at ${snapshot.path}.\n${issues}${doctorHint}`);
}

async function prepareGatewayStartupConfig(params: {
  configSnapshot: ConfigFileSnapshot;
  // Keep startup auth/runtime behavior aligned with loadConfig(), which applies
  // runtime overrides beyond the raw on-disk snapshot.
  runtimeConfig: OpenClawConfig;
  authOverride?: GatewayServerOptions["auth"];
  tailscaleOverride?: GatewayServerOptions["tailscale"];
  activateRuntimeSecrets: (
    config: OpenClawConfig,
    options: { reason: "startup"; activate: boolean },
  ) => Promise<{ config: OpenClawConfig }>;
}): Promise<Awaited<ReturnType<typeof ensureGatewayStartupAuth>>> {
  assertValidGatewayStartupConfigSnapshot(params.configSnapshot);

  // Fail fast before startup auth persists anything if required refs are unresolved.
  const startupPreflightConfig = applyGatewayAuthOverridesForStartupPreflight(
    params.runtimeConfig,
    {
      auth: params.authOverride,
      tailscale: params.tailscaleOverride,
    },
  );
  const preflightConfig = (
    await params.activateRuntimeSecrets(startupPreflightConfig, {
      reason: "startup",
      activate: false,
    })
  ).config;
  const preflightAuthOverride =
    typeof preflightConfig.gateway?.auth?.token === "string" ||
    typeof preflightConfig.gateway?.auth?.password === "string"
      ? {
          ...params.authOverride,
          ...(typeof preflightConfig.gateway?.auth?.token === "string"
            ? { token: preflightConfig.gateway.auth.token }
            : {}),
          ...(typeof preflightConfig.gateway?.auth?.password === "string"
            ? { password: preflightConfig.gateway.auth.password }
            : {}),
        }
      : params.authOverride;

  const authBootstrap = await ensureGatewayStartupAuth({
    cfg: params.runtimeConfig,
    env: process.env,
    authOverride: preflightAuthOverride,
    tailscaleOverride: params.tailscaleOverride,
    persist: true,
    baseHash: params.configSnapshot.hash,
  });
  const runtimeStartupConfig = applyGatewayAuthOverridesForStartupPreflight(authBootstrap.cfg, {
    auth: params.authOverride,
    tailscale: params.tailscaleOverride,
  });
  const activatedConfig = (
    await params.activateRuntimeSecrets(runtimeStartupConfig, {
      reason: "startup",
      activate: true,
    })
  ).config;
  return {
    ...authBootstrap,
    cfg: activatedConfig,
  };
}
=======
export type GatewayCloseOptions = {
  reason?: string;
  restartExpectedMs?: number | null;
  drainTimeoutMs?: number | null;
};
>>>>>>> upstream/main

export type GatewayServer = {
  close: (opts?: GatewayCloseOptions) => Promise<void>;
};

export type GatewayServerOptions = {
  /**
   * Bind address policy for the Gateway WebSocket/HTTP server.
   * - loopback: 127.0.0.1
   * - lan: 0.0.0.0
   * - tailnet: bind only to the Tailscale IPv4 address (100.64.0.0/10)
   * - auto: prefer loopback, else LAN
   */
  bind?: import("../config/config.js").GatewayBindMode;
  /**
   * Advanced override for the bind host, bypassing bind resolution.
   * Prefer `bind` unless you really need a specific address.
   */
  host?: string;
  /**
   * If false, do not serve the browser Control UI.
   * Default: config `gateway.controlUi.enabled` (or true when absent).
   */
  controlUiEnabled?: boolean;
  /**
   * If false, do not serve `POST /v1/chat/completions`.
   * Default: config `gateway.http.endpoints.chatCompletions.enabled` (or false when absent).
   */
  openAiChatCompletionsEnabled?: boolean;
  /**
   * If false, do not serve `POST /v1/responses` (OpenResponses API).
   * Default: config `gateway.http.endpoints.responses.enabled` (or false when absent).
   */
  openResponsesEnabled?: boolean;
  /**
   * Override gateway auth configuration (merges with config).
   */
  auth?: import("../config/config.js").GatewayAuthConfig;
  /**
   * Override gateway Tailscale exposure configuration (merges with config).
   */
  tailscale?: import("../config/config.js").GatewayTailscaleConfig;
  /**
   * Test-only: override the setup wizard runner.
   */
  wizardRunner?: (
    opts: import("../commands/onboard-types.js").OnboardOptions,
    runtime: import("../runtime.js").RuntimeEnv,
    prompter: import("../wizard/prompts.js").WizardPrompter,
  ) => Promise<void>;
  /**
<<<<<<< HEAD
   * Optional startup timestamp used for concise readiness logging.
   */
  startupStartedAt?: number;
=======
   * Let post-listen sidecars (channels, plugin services) finish in the background.
   * Defaults to false so gateway startup waits until sidecars are ready.
   */
  deferStartupSidecars?: boolean;
  /**
   * Optional startup timestamp used for concise readiness logging.
   */
  startupStartedAt?: number;
  /**
   * Config snapshot already read by the CLI gateway preflight. Passing it avoids
   * reparsing openclaw.json during server startup.
   */
  startupConfigSnapshotRead?: ReadConfigFileSnapshotWithPluginMetadataResult;
};

type SetupWizardRunner = NonNullable<GatewayServerOptions["wizardRunner"]>;

const runDefaultSetupWizard: SetupWizardRunner = async (...args) => {
  const { runSetupWizard } = await import("../wizard/setup.js");
  return runSetupWizard(...args);
>>>>>>> upstream/main
};

export async function startGatewayServer(
  port = 18789,
  opts: GatewayServerOptions = {},
): Promise<GatewayServer> {
  normalizeStateDirEnv(process.env);
  const { bootstrapGatewayNetworkRuntime } = await import("./server-network-runtime.js");
  bootstrapGatewayNetworkRuntime();

  const minimalTestGateway =
    isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_MINIMAL_GATEWAY === "1";

  // Ensure all default port derivations (browser/canvas) see the actual runtime port.
  process.env.OPENCLAW_GATEWAY_PORT = String(port);
  logAcceptedEnvOption({
    key: "OPENCLAW_RAW_STREAM",
    description: "raw stream logging enabled",
  });
  logAcceptedEnvOption({
    key: "OPENCLAW_RAW_STREAM_PATH",
    description: "raw stream log path override",
  });
<<<<<<< HEAD

  let configSnapshot = await readConfigFileSnapshot();
  if (configSnapshot.legacyIssues.length > 0) {
    if (isNixMode) {
      throw new Error(
        "Legacy config entries detected while running in Nix mode. Update your Nix config to the latest schema and restart.",
      );
    }
  }
  if (configSnapshot.exists) {
    assertValidGatewayStartupConfigSnapshot(configSnapshot, { includeDoctorHint: true });
  }
=======
  if (!resumeGatewayRestartTraceFromEnv(process.env, [["source", "env"]])) {
    const restartHandoff = readGatewayRestartHandoffSync();
    resumeGatewayRestartTraceFromHandoff(restartHandoff?.restartTrace, [
      ["source", restartHandoff?.source],
      ["restartKind", restartHandoff?.restartKind],
      ["supervisorMode", restartHandoff?.supervisorMode],
    ]);
  }
  const startupTrace = createGatewayStartupTrace();
  const startupConfigModulePromise = import("./server-startup-config.js");
  let startupPluginsModulePromise: Promise<typeof import("./server-startup-plugins.js")> | null =
    null;
  const loadStartupPluginsModule = () => {
    startupPluginsModulePromise ??= import("./server-startup-plugins.js");
    return startupPluginsModulePromise;
  };
  const { loadGatewayStartupConfigSnapshot } = await startupConfigModulePromise;

  const startupConfigLoad = await startupTrace.measure("config.snapshot", () =>
    loadGatewayStartupConfigSnapshot({
      minimalTestGateway,
      log,
      measure: (name, run) => startupTrace.measure(name, run),
      ...(opts.startupConfigSnapshotRead
        ? { initialSnapshotRead: opts.startupConfigSnapshotRead }
        : {}),
    }),
  );
  const configSnapshot = startupConfigLoad.snapshot;
>>>>>>> upstream/main

  const emitSecretsStateEvent = (
    code: "SECRETS_RELOADER_DEGRADED" | "SECRETS_RELOADER_RECOVERED",
    message: string,
    cfg: OpenClawConfig,
  ) => {
    enqueueSystemEvent(`[${code}] ${message}`, {
      sessionKey: resolveMainSessionKey(cfg),
      contextKey: code,
    });
  };
<<<<<<< HEAD
  let secretsActivationTail: Promise<void> = Promise.resolve();
  const runWithSecretsActivationLock = async <T>(operation: () => Promise<T>): Promise<T> => {
    const run = secretsActivationTail.then(operation, operation);
    secretsActivationTail = run.then(
      () => undefined,
      () => undefined,
    );
    return await run;
  };
  const activateRuntimeSecrets = async (
    config: OpenClawConfig,
    params: { reason: "startup" | "reload" | "restart-check"; activate: boolean },
  ) =>
    await runWithSecretsActivationLock(async () => {
      try {
        const prepared = await prepareSecretsRuntimeSnapshot({
          config: pruneSkippedStartupSecretSurfaces(config),
        });
        if (params.activate) {
          activateSecretsRuntimeSnapshot(prepared);
          logGatewayAuthSurfaceDiagnostics(prepared);
        }
        for (const warning of prepared.warnings) {
          logSecrets.warn(`[${warning.code}] ${warning.message}`);
        }
        if (secretsDegraded) {
          const recoveredMessage =
            "Secret resolution recovered; runtime remained on last-known-good during the outage.";
          logSecrets.info(`[SECRETS_RELOADER_RECOVERED] ${recoveredMessage}`);
          emitSecretsStateEvent("SECRETS_RELOADER_RECOVERED", recoveredMessage, prepared.config);
        }
        secretsDegraded = false;
        return prepared;
      } catch (err) {
        const details = String(err);
        if (!secretsDegraded) {
          logSecrets.error(`[SECRETS_RELOADER_DEGRADED] ${details}`);
          if (params.reason !== "startup") {
            emitSecretsStateEvent(
              "SECRETS_RELOADER_DEGRADED",
              `Secret resolution failed; runtime remains on last-known-good snapshot. ${details}`,
              config,
            );
          }
        } else {
          logSecrets.warn(`[SECRETS_RELOADER_DEGRADED] ${details}`);
        }
        secretsDegraded = true;
        if (params.reason === "startup") {
          throw new Error(`Startup failed: required secrets are unavailable. ${details}`, {
            cause: err,
          });
        }
        throw err;
      }
    });

  let cfgAtStart: OpenClawConfig;
  let startupInternalWriteHash: string | null = null;
=======
  const { createRuntimeSecretsActivator } = await startupConfigModulePromise;
  const activateRuntimeSecrets = createRuntimeSecretsActivator({
    logSecrets,
    emitStateEvent: emitSecretsStateEvent,
    ...(startupConfigLoad.pluginMetadataSnapshot
      ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot }
      : {}),
  });

  let cfgAtStart: OpenClawConfig;
  let startupInternalWriteHash: string | null = null;
  let startupLastGoodSnapshot = configSnapshot;
  const startupActivationSourceConfig = configSnapshot.sourceConfig;
>>>>>>> upstream/main
  const startupRuntimeConfig = applyConfigOverrides(configSnapshot.config);
  startupTrace.setConfig(startupRuntimeConfig);
  const { prepareGatewayStartupConfig } = await startupConfigModulePromise;
  const authBootstrap = await startupTrace.measure(
    "config.auth",
    () =>
      prepareGatewayStartupConfig({
        configSnapshot,
        authOverride: opts.auth,
        tailscaleOverride: opts.tailscale,
        activateRuntimeSecrets,
        log,
        measure: (name, run, measureOptions) => startupTrace.measure(name, run, measureOptions),
      }),
    { omitErrorMessage: true },
  );
  cfgAtStart = authBootstrap.cfg;
  startupTrace.setConfig(cfgAtStart);
  if (authBootstrap.generatedToken) {
    log.warn(formatRuntimeGatewayAuthTokenWarning());
  }
  const diagnosticsEnabled = isDiagnosticsEnabled(cfgAtStart);
  setDiagnosticsEnabledForProcess(diagnosticsEnabled);
  if (diagnosticsEnabled) {
<<<<<<< HEAD
    startDiagnosticHeartbeat(undefined, { getConfig: getRuntimeConfig });
=======
    startDiagnosticHeartbeat(undefined, {
      getConfig: getRuntimeConfig,
      startupGraceMs: 60_000,
    });
>>>>>>> upstream/main
  }
  setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(cfgAtStart) });
  let getActiveTaskCount = () => 0;
  setPreRestartDeferralCheck(
    () =>
      getTotalQueueSize() +
      getTotalPendingReplies() +
      getActiveEmbeddedRunCount() +
<<<<<<< HEAD
      getInspectableTaskRegistrySummary().active,
  );
  // Unconditional startup migration: seed gateway.controlUi.allowedOrigins for existing
  // non-loopback installs that upgraded to v2026.2.26+ without required origins.
  const controlUiSeed = await maybeSeedControlUiAllowedOriginsAtStartup({
    config: cfgAtStart,
    writeConfig: writeConfigFile,
    log,
  });
  cfgAtStart = controlUiSeed.config;
  if (authBootstrap.persistedGeneratedToken || controlUiSeed.persistedAllowedOriginsSeed) {
    const startupSnapshot = await readConfigFileSnapshot();
    startupInternalWriteHash = startupSnapshot.hash ?? null;
  }
  await runChannelPluginStartupMaintenance({
    cfg: cfgAtStart,
    env: process.env,
    log,
  });
  await runStartupSessionMigration({
    cfg: cfgAtStart,
    env: process.env,
    log,
  });
  initSubagentRegistry();
  const gatewayPluginConfigAtStart = applyPluginAutoEnable({
    config: cfgAtStart,
    env: process.env,
  }).config;
  const defaultAgentId = resolveDefaultAgentId(gatewayPluginConfigAtStart);
  const defaultWorkspaceDir = resolveAgentWorkspaceDir(gatewayPluginConfigAtStart, defaultAgentId);
  const deferredConfiguredChannelPluginIds = minimalTestGateway
    ? []
    : resolveConfiguredDeferredChannelPluginIds({
        config: gatewayPluginConfigAtStart,
        workspaceDir: defaultWorkspaceDir,
        env: process.env,
      });
  const startupPluginIds = minimalTestGateway
    ? []
    : resolveGatewayStartupPluginIds({
        config: gatewayPluginConfigAtStart,
        activationSourceConfig: cfgAtStart,
        workspaceDir: defaultWorkspaceDir,
        env: process.env,
      });
  const baseMethods = listGatewayMethods();
  const emptyPluginRegistry = createEmptyPluginRegistry();
  let pluginRegistry = emptyPluginRegistry;
  let baseGatewayMethods = baseMethods;
  if (!minimalTestGateway) {
    ({ pluginRegistry, gatewayMethods: baseGatewayMethods } = loadGatewayStartupPlugins({
      cfg: gatewayPluginConfigAtStart,
      activationSourceConfig: cfgAtStart,
      workspaceDir: defaultWorkspaceDir,
      log,
      coreGatewayHandlers,
      baseMethods,
      pluginIds: startupPluginIds,
      preferSetupRuntimeForChannelPlugins: deferredConfiguredChannelPluginIds.length > 0,
    }));
  } else {
    pluginRegistry = getActivePluginRegistry() ?? emptyPluginRegistry;
    setActivePluginRegistry(pluginRegistry);
=======
      getActiveTaskCount(),
  );
  // Unconditional startup migration: seed gateway.controlUi.allowedOrigins for existing
  // non-loopback installs that upgraded to v2026.2.26+ without required origins.
  const controlUiSeed = minimalTestGateway
    ? { config: cfgAtStart, seededAllowedOrigins: false }
    : await startupTrace.measure("control-ui.seed", () =>
        maybeSeedControlUiAllowedOriginsAtStartup({
          config: cfgAtStart,
          log,
          runtimeBind: opts.bind,
          runtimePort: port,
        }),
      );
  cfgAtStart = controlUiSeed.config;
  // Keep the old startup-write suppression path intact for compatibility with
  // callers that may still report a write, but startup itself no longer mutates config.
  if (startupConfigLoad.wroteConfig || authBootstrap.persistedGeneratedToken) {
    const startupSnapshot = await startupTrace.measure("config.final-snapshot", () =>
      readConfigFileSnapshot(),
    );
    startupInternalWriteHash = startupSnapshot.hash ?? null;
    startupLastGoodSnapshot = startupSnapshot;
  }
  setRuntimeConfigSnapshot(cfgAtStart, startupLastGoodSnapshot.sourceConfig);
  const { prepareGatewayPluginBootstrap } = await loadStartupPluginsModule();
  const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", () =>
    prepareGatewayPluginBootstrap({
      cfgAtStart,
      activationSourceConfig: startupActivationSourceConfig,
      startupRuntimeConfig,
      pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot,
      minimalTestGateway,
      log,
      loadRuntimePlugins: false,
      loadSetupRuntimePlugins: true,
    }),
  );
  const {
    gatewayPluginConfigAtStart,
    defaultWorkspaceDir,
    deferredConfiguredChannelPluginIds,
    startupPluginIds,
    pluginLookUpTable,
    baseMethods,
    runtimePluginsLoaded,
  } = pluginBootstrap;
  const coreGatewayMethodNames = listCoreGatewayMethodNames();
  setCurrentPluginMetadataSnapshot(pluginLookUpTable, {
    config: startupActivationSourceConfig,
    compatibleConfigs: [startupRuntimeConfig, cfgAtStart, gatewayPluginConfigAtStart],
    env: process.env,
    workspaceDir: defaultWorkspaceDir,
  });
  if (pluginLookUpTable) {
    const metrics = pluginLookUpTable.metrics;
    startupTrace.detail("plugins.lookup-table", [
      ["registrySnapshotMs", metrics.registrySnapshotMs],
      ["manifestRegistryMs", metrics.manifestRegistryMs],
      ["startupPlanMs", metrics.startupPlanMs],
      ["ownerMapsMs", metrics.ownerMapsMs],
      ["totalMs", metrics.totalMs],
      ["indexPlugins", String(metrics.indexPluginCount)],
      ["indexPluginCount", metrics.indexPluginCount],
      ["manifestPlugins", String(metrics.manifestPluginCount)],
      ["manifestPluginCount", metrics.manifestPluginCount],
      ["startupPlugins", String(metrics.startupPluginCount)],
      ["startupPluginCount", metrics.startupPluginCount],
      ["deferredChannelPlugins", String(metrics.deferredChannelPluginCount)],
      ["deferredChannelPluginCount", metrics.deferredChannelPluginCount],
    ]);
>>>>>>> upstream/main
  }
  let { pluginRegistry, baseGatewayMethods } = pluginBootstrap;
  const channelLogs = Object.fromEntries(
    listGatewayStartupChannelPlugins().map((plugin) => [plugin.id, logChannels.child(plugin.id)]),
  ) as Record<ChannelId, ReturnType<typeof createSubsystemLogger>>;
  const channelRuntimeEnvs = Object.fromEntries(
    Object.entries(channelLogs).map(([id, logger]) => [id, runtimeForLogger(logger)]),
  ) as unknown as Record<ChannelId, RuntimeEnv>;
  const listStartupChannelGatewayMethods = () => {
    const methods: string[] = [];
    for (const plugin of listGatewayStartupChannelPlugins()) {
      methods.push(...(plugin.gatewayMethods ?? []));
      for (const descriptor of plugin.gatewayMethodDescriptors ?? []) {
        methods.push(descriptor.name);
      }
    }
    return methods;
  };
  const listActiveGatewayMethods = (nextBaseGatewayMethods: string[]) =>
    uniqueStrings([...nextBaseGatewayMethods, ...listStartupChannelGatewayMethods()]);
  const runtimeConfig = await startupTrace.measure("runtime.config", async () => {
    const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config.js");
    return resolveGatewayRuntimeConfig({
      cfg: cfgAtStart,
      port,
      bind: opts.bind,
      host: opts.host,
      controlUiEnabled: opts.controlUiEnabled,
      openAiChatCompletionsEnabled: opts.openAiChatCompletionsEnabled,
      openResponsesEnabled: opts.openResponsesEnabled,
      auth: opts.auth,
      tailscale: opts.tailscale,
    });
  });
  const {
    bindHost,
    controlUiEnabled,
    openAiChatCompletionsEnabled,
    openAiChatCompletionsConfig,
    openResponsesEnabled,
    openResponsesConfig,
    strictTransportSecurityHeader,
    controlUiBasePath,
    controlUiRoot: controlUiRootOverride,
    resolvedAuth,
    tailscaleConfig,
    tailscaleMode,
  } = runtimeConfig;
  const getResolvedAuth = () =>
    resolveGatewayAuth({
      authConfig:
<<<<<<< HEAD
        getActiveSecretsRuntimeSnapshot()?.config.gateway?.auth ?? getRuntimeConfig().gateway?.auth,
=======
        getActiveSecretsRuntimeConfigSnapshot()?.config.gateway?.auth ??
        getRuntimeConfig().gateway?.auth,
>>>>>>> upstream/main
      authOverride: opts.auth,
      env: process.env,
      tailscaleMode,
    });
<<<<<<< HEAD
  let hooksConfig = runtimeConfig.hooksConfig;
  let hookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
  const canvasHostEnabled = runtimeConfig.canvasHostEnabled;
=======
  const resolveSharedGatewaySessionGenerationForConfig = (config: OpenClawConfig) =>
    resolveSharedGatewaySessionGeneration(
      resolveGatewayAuth({
        authConfig: config.gateway?.auth,
        authOverride: opts.auth,
        env: process.env,
        tailscaleMode,
      }),
      config.gateway?.trustedProxies,
    );
  const resolveCurrentSharedGatewaySessionGeneration = () =>
    resolveSharedGatewaySessionGeneration(
      getResolvedAuth(),
      getRuntimeConfig().gateway?.trustedProxies,
    );
  const resolveSharedGatewaySessionGenerationForRuntimeSnapshot = () =>
    resolveSharedGatewaySessionGeneration(
      resolveGatewayAuth({
        authConfig: getRuntimeConfig().gateway?.auth,
        authOverride: opts.auth,
        env: process.env,
        tailscaleMode,
      }),
      getRuntimeConfig().gateway?.trustedProxies,
    );
  const sharedGatewaySessionGenerationState: SharedGatewaySessionGenerationState = {
    current: resolveCurrentSharedGatewaySessionGeneration(),
    required: null,
  };
  const preauthHandshakeTimeoutMs =
    cfgAtStart.gateway?.handshakeTimeoutMs ?? getRuntimeConfig().gateway?.handshakeTimeoutMs;
  const initialHooksConfig = runtimeConfig.hooksConfig;
  const initialHookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
>>>>>>> upstream/main

  // Create auth rate limiters used by connect/auth flows.
  const rateLimitConfig = cfgAtStart.gateway?.auth?.rateLimit;
  const { rateLimiter: authRateLimiter, browserRateLimiter: browserAuthRateLimiter } =
    createGatewayAuthRateLimiters(rateLimitConfig);

  const controlUiRootState = await startupTrace.measure("control-ui.root", () =>
    resolveGatewayControlUiRootState({
      controlUiRootOverride,
      controlUiEnabled,
      gatewayRuntime,
      log,
    }),
  );

  const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
  const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();

  const deps = createDefaultDeps();
  let runtimeState: GatewayServerLiveState | null = null;
  let gatewayCronStartHandled = false;
  const gatewayTls = await startupTrace.measure("tls.runtime", () =>
    loadGatewayTlsRuntime(cfgAtStart.gateway?.tls, log.child("tls")),
  );
  if (cfgAtStart.gateway?.tls?.enabled && !gatewayTls.enabled) {
    throw new Error(gatewayTls.error ?? "gateway tls: failed to enable");
  }
  const serverStartedAt = Date.now();
  const readinessEventLoopHealth = createGatewayEventLoopHealthMonitor();
  let startupSidecarsReady = minimalTestGateway;
  let startupPendingReason = "startup-sidecars";
  let releaseStartupAccountStarts = () => {};
  const startupAccountStartsReady = new Promise<void>((resolve) => {
    releaseStartupAccountStarts = resolve;
  });
  const { createChannelManager } = await import("./server-channels.js");
  const channelManager = createChannelManager({
<<<<<<< HEAD
    loadConfig: () =>
      applyPluginAutoEnable({
        config: loadConfig(),
        env: process.env,
      }).config,
=======
    getRuntimeConfig: () => {
      const runtimeConfigLocal = getRuntimeConfig();
      return resolveGatewayPluginConfig({
        config: runtimeConfigLocal,
      });
    },
>>>>>>> upstream/main
    channelLogs,
    channelRuntimeEnvs,
    resolveChannelRuntime: getChannelRuntime,
    getPluginHttpRouteRegistry: () => pluginRegistry,
    startupTrace,
    deferStartupAccountStartsUntil: startupAccountStartsReady,
  });
  const deferStartupSidecars = opts.deferStartupSidecars === true;
  const isGatewayStartupPending = () => !startupSidecarsReady && !deferStartupSidecars;
  const getReadiness = createReadinessChecker({
    channelManager,
    startedAt: serverStartedAt,
    getStartupPending: isGatewayStartupPending,
    getStartupPendingReason: () => startupPendingReason,
    getEventLoopHealth: readinessEventLoopHealth.snapshot,
    shouldSkipChannelReadiness: () =>
      isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) ||
      isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS),
  });
  log.info("starting HTTP server...");
<<<<<<< HEAD
=======
  let currentPluginRegistryGatewayContext: GatewayRequestContext | undefined;
>>>>>>> upstream/main
  const {
    releasePluginRouteRegistry,
    httpServer,
    httpServers,
    httpBindHosts,
    startListening,
    wss,
    preauthConnectionBudget,
    clients,
    broadcast,
    broadcastToConnIds,
    agentRunSeq,
    dedupe,
    chatRunState,
    chatRunBuffers,
    chatDeltaSentAt,
    chatDeltaLastBroadcastLen,
    addChatRun,
    removeChatRun,
    chatAbortControllers,
    toolEventRecipients,
  } = await startupTrace.measure("runtime.state", () =>
    createGatewayRuntimeState({
      cfg: cfgAtStart,
      bindHost,
      port,
      controlUiEnabled,
      controlUiBasePath,
      controlUiRoot: controlUiRootState,
      openAiChatCompletionsEnabled,
      openAiChatCompletionsConfig,
      openResponsesEnabled,
      openResponsesConfig,
      strictTransportSecurityHeader,
      resolvedAuth,
      rateLimiter: authRateLimiter,
      gatewayTls,
      getResolvedAuth,
      hooksConfig: () => runtimeState?.hooksConfig ?? initialHooksConfig,
      getHookClientIpConfig: () => runtimeState?.hookClientIpConfig ?? initialHookClientIpConfig,
      pluginRegistry,
      getPluginRouteRegistry: () => pluginRegistry,
      getGatewayRequestContext: () => currentPluginRegistryGatewayContext,
      pinChannelRegistry: !minimalTestGateway,
      deps,
      log,
      logHooks,
      logPlugins,
      getReadiness,
    }),
  );
  const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime.js");
  const {
    nodeRegistry,
    nodePresenceTimers,
    sessionEventSubscribers,
    sessionMessageSubscribers,
    nodeSendToSession,
    nodeSendToAllSubscribed,
    nodeSubscribe,
    nodeUnsubscribe,
    nodeUnsubscribeAll,
    broadcastVoiceWakeChanged,
    hasTalkNodeConnected,
  } = createGatewayNodeSessionRuntime({ broadcast });
  applyGatewayLaneConcurrency(cfgAtStart);

  runtimeState = createGatewayServerLiveState({
    hooksConfig: initialHooksConfig,
    hookClientIpConfig: initialHookClientIpConfig,
    cronState: createLazyGatewayCronState({
      cfg: cfgAtStart,
      deps,
      broadcast,
    }),
    gatewayMethods: listActiveGatewayMethods(baseGatewayMethods),
  });
  deps.cron = runtimeState.cronState.cron;
  const pluginHostServices = {
    get cron() {
      return runtimeState.cronState.cron;
    },
  };
<<<<<<< HEAD
  let stopGatewayUpdateCheck = () => {};
  let tailscaleCleanup: (() => Promise<void>) | null = null;
  let skillsRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  const skillsRefreshDelayMs = 30_000;
  let skillsChangeUnsub = () => {};
  let channelHealthMonitor: ReturnType<typeof startChannelHealthMonitor> | null = null;
  let stopModelPricingRefresh = () => {};
  let mcpServer: { port: number; close: () => Promise<void> } | undefined;
  let configReloader: { stop: () => Promise<void> } = { stop: async () => {} };
  const closeOnStartupFailure = async () => {
    if (diagnosticsEnabled) {
      stopDiagnosticHeartbeat();
=======

  let closePreludeStarted = false;
  let postReadyMaintenanceTimer: ReturnType<typeof setTimeout> | null = null;
  const clearPostReadyMaintenanceTimer = () => {
    if (!postReadyMaintenanceTimer) {
      return;
>>>>>>> upstream/main
    }
    clearTimeout(postReadyMaintenanceTimer);
    postReadyMaintenanceTimer = null;
  };
  const markClosePreludeStarted = () => {
    closePreludeStarted = true;
    clearPostReadyMaintenanceTimer();
  };
  const runClosePrelude = async () => {
    markClosePreludeStarted();
    clearPluginMetadataLifecycleCaches();
    const { runGatewayClosePrelude } = await loadGatewayCloseModule();
    await runGatewayClosePrelude({
      ...(diagnosticsEnabled ? { stopDiagnostics: stopDiagnosticHeartbeat } : {}),
      clearSkillsRefreshTimer: () => {
        if (!runtimeState?.skillsRefreshTimer) {
          return;
        }
        clearTimeout(runtimeState.skillsRefreshTimer);
        runtimeState.skillsRefreshTimer = null;
      },
      skillsChangeUnsub: runtimeState.skillsChangeUnsub,
      disposeAuthRateLimiter: () => authRateLimiter.dispose(),
      disposeBrowserAuthRateLimiter: () => browserAuthRateLimiter.dispose(),
      stopModelPricingRefresh: runtimeState.stopModelPricingRefresh,
      stopChannelHealthMonitor: () => runtimeState?.channelHealthMonitor?.stop(),
      stopReadinessEventLoopHealth: readinessEventLoopHealth.stop,
      clearSecretsRuntimeSnapshot,
      closeMcpServer: closeMcpLoopbackServerOnDemand,
    });
  };
  const { getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut } =
    channelManager;
  const refreshGatewayHealthSnapshotWithRuntime: typeof refreshGatewayHealthSnapshot = (
    optsResult,
  ) =>
    refreshGatewayHealthSnapshot({
      ...optsResult,
      getRuntimeSnapshot,
      getEventLoopHealth: readinessEventLoopHealth.snapshot,
    });
  const stopRegisteredPostReadySidecars = async () => {
    const postReadySidecars = runtimeState.postReadySidecars;
    runtimeState.postReadySidecars = [];
    for (const postReadySidecar of postReadySidecars) {
      await postReadySidecar.stop();
    }
<<<<<<< HEAD
    skillsChangeUnsub();
    authRateLimiter?.dispose();
    browserAuthRateLimiter.dispose();
    stopModelPricingRefresh();
    channelHealthMonitor?.stop();
    clearSecretsRuntimeSnapshot();
    await mcpServer?.close().catch(() => {});
=======
  };
  const stopRegisteredGatewayLifetimeSidecars = async () => {
    const gatewayLifetimeSidecars = runtimeState.gatewayLifetimeSidecars;
    runtimeState.gatewayLifetimeSidecars = [];
    for (const gatewayLifetimeSidecar of gatewayLifetimeSidecars) {
      await gatewayLifetimeSidecar.stop();
    }
  };
  const createCloseHandler = () => async (optsValue?: GatewayCloseOptions) => {
    const channelIds = listLoadedChannelPlugins().map((plugin) => plugin.id as ChannelId);
    const { createGatewayCloseHandler, drainActiveSessionsForShutdown } =
      await loadGatewayCloseModule();
>>>>>>> upstream/main
    await createGatewayCloseHandler({
      bonjourStop: runtimeState.bonjourStop,
      tailscaleCleanup: runtimeState.tailscaleCleanup,
      releasePluginRouteRegistry,
      channelIds,
      stopChannel,
      pluginServices: runtimeState.pluginServices,
      postReadySidecars: runtimeState.postReadySidecars,
      cron: runtimeState.cronState.cron,
      heartbeatRunner: runtimeState.heartbeatRunner,
      updateCheckStop: runtimeState.stopGatewayUpdateCheck,
      stopTaskRegistryMaintenance: stopTaskRegistryMaintenanceOnDemand,
      nodePresenceTimers,
      broadcast,
      tickInterval: runtimeState.tickInterval,
      healthInterval: runtimeState.healthInterval,
      dedupeCleanup: runtimeState.dedupeCleanup,
      mediaCleanup: runtimeState.mediaCleanup,
      agentUnsub: runtimeState.agentUnsub,
      heartbeatUnsub: runtimeState.heartbeatUnsub,
      transcriptUnsub: runtimeState.transcriptUnsub,
      lifecycleUnsub: runtimeState.lifecycleUnsub,
      chatRunState,
      chatAbortControllers,
      removeChatRun,
      agentRunSeq,
      nodeSendToSession,
      getPendingReplyCount: getTotalPendingReplies,
      clients,
      configReloader: runtimeState.configReloader,
      wss,
      httpServer,
      httpServers,
      drainActiveSessionsForShutdown,
    })(optsValue);
  };
  let clearFallbackGatewayContextForServer = () => {};
  const closeOnStartupFailure = async () => {
    try {
      await stopRegisteredGatewayLifetimeSidecars();
      await stopRegisteredPostReadySidecars();
      await runClosePrelude();
      await createCloseHandler()({ reason: "gateway startup failed" });
    } finally {
      clearFallbackGatewayContextForServer();
    }
  };
  const broadcastVoiceWakeRoutingChanged = (config: VoiceWakeRoutingConfig) => {
    broadcast("voicewake.routing.changed", { config }, { dropIfSlow: true });
  };

<<<<<<< HEAD
  let cronState = buildGatewayCronService({
    cfg: cfgAtStart,
    deps,
    broadcast,
  });
  let { cron, storePath: cronStorePath } = cronState;
  deps.cron = cron;

  const { getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut } =
    channelManager;
  let agentUnsub: (() => void) | null = null;
  let heartbeatUnsub: (() => void) | null = null;
  let transcriptUnsub: (() => void) | null = null;
  let lifecycleUnsub: (() => void) | null = null;
  try {
    try {
      mcpServer = await startMcpLoopbackServer(0);
      log.info(`MCP loopback server listening on http://127.0.0.1:${mcpServer.port}/mcp`);
    } catch (error) {
      log.warn(`MCP loopback server failed to start: ${String(error)}`);
    }

    if (!minimalTestGateway) {
      const machineDisplayName = await getMachineDisplayName();
      const discovery = await startGatewayDiscovery({
        machineDisplayName,
        port,
        gatewayTls: gatewayTls.enabled
          ? { enabled: true, fingerprintSha256: gatewayTls.fingerprintSha256 }
          : undefined,
        wideAreaDiscoveryEnabled: cfgAtStart.discovery?.wideArea?.enabled === true,
        wideAreaDiscoveryDomain: cfgAtStart.discovery?.wideArea?.domain,
        tailscaleMode,
        mdnsMode: cfgAtStart.discovery?.mdns?.mode,
        logDiscovery,
      });
      bonjourStop = discovery.bonjourStop;
    }

    if (!minimalTestGateway) {
      setSkillsRemoteRegistry(nodeRegistry);
      void primeRemoteSkillsCache();
    }
    // Debounce skills-triggered node probes to avoid feedback loops and rapid-fire invokes.
    // Skills changes can happen in bursts (e.g., file watcher events), and each probe
    // takes time to complete. A 30-second delay ensures we batch changes together.
    skillsChangeUnsub = minimalTestGateway
      ? () => {}
      : registerSkillsChangeListener((event) => {
          if (event.reason === "remote-node") {
            return;
          }
          if (skillsRefreshTimer) {
            clearTimeout(skillsRefreshTimer);
          }
          skillsRefreshTimer = setTimeout(() => {
            skillsRefreshTimer = null;
            const latest = loadConfig();
            void refreshRemoteBinsForConnectedNodes(latest);
          }, skillsRefreshDelayMs);
        });

    if (!minimalTestGateway) {
      startTaskRegistryMaintenance();
      ({ tickInterval, healthInterval, dedupeCleanup, mediaCleanup } =
        startGatewayMaintenanceTimers({
=======
  try {
    const earlyRuntime = await startupTrace.measure("runtime.early", () =>
      loadGatewayStartupEarlyModule().then(({ startGatewayEarlyRuntime }) =>
        startGatewayEarlyRuntime({
          minimalTestGateway,
          cfgAtStart,
          port,
          gatewayTls,
          gatewayDirectReachable: !isLoopbackHost(bindHost),
          tailscaleMode,
          log,
          logDiscovery,
          nodeRegistry,
          pluginRegistry,
>>>>>>> upstream/main
          broadcast,
          nodeSendToAllSubscribed,
          getPresenceVersion,
          getHealthVersion,
          refreshGatewayHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
          logHealth,
          dedupe,
          chatAbortControllers,
          chatRunState,
          chatRunBuffers,
          chatDeltaSentAt,
          chatDeltaLastBroadcastLen,
          removeChatRun,
          agentRunSeq,
          nodeSendToSession,
          ...(typeof cfgAtStart.media?.ttlHours === "number"
            ? { mediaCleanupTtlMs: resolveMediaCleanupTtlMs(cfgAtStart.media.ttlHours) }
            : {}),
<<<<<<< HEAD
        }));
    }

    agentUnsub = minimalTestGateway
      ? null
      : onAgentEvent(
          createAgentEventHandler({
            broadcast,
            broadcastToConnIds,
            nodeSendToSession,
            agentRunSeq,
            chatRunState,
            resolveSessionKeyForRun,
            clearAgentRunContext,
            toolEventRecipients,
            sessionEventSubscribers,
          }),
        );

    heartbeatUnsub = minimalTestGateway
      ? null
      : onHeartbeatEvent((evt) => {
          broadcast("heartbeat", evt, { dropIfSlow: true });
        });

    transcriptUnsub = minimalTestGateway
      ? null
      : onSessionTranscriptUpdate((update) => {
          const sessionKey =
            update.sessionKey ?? resolveSessionKeyForTranscriptFile(update.sessionFile);
          if (!sessionKey || update.message === undefined) {
            return;
          }
          const connIds = new Set<string>();
          for (const connId of sessionEventSubscribers.getAll()) {
            connIds.add(connId);
          }
          for (const connId of sessionMessageSubscribers.get(sessionKey)) {
            connIds.add(connId);
          }
          if (connIds.size === 0) {
            return;
          }
          const { entry, storePath } = loadSessionEntry(sessionKey);
          const messageSeq = entry?.sessionId
            ? readSessionMessages(entry.sessionId, storePath, entry.sessionFile).length
            : undefined;
          const sessionRow = loadGatewaySessionRow(sessionKey);
          const sessionSnapshot = sessionRow
            ? {
                session: sessionRow,
                updatedAt: sessionRow.updatedAt ?? undefined,
                sessionId: sessionRow.sessionId,
                kind: sessionRow.kind,
                channel: sessionRow.channel,
                subject: sessionRow.subject,
                groupChannel: sessionRow.groupChannel,
                space: sessionRow.space,
                chatType: sessionRow.chatType,
                origin: sessionRow.origin,
                spawnedBy: sessionRow.spawnedBy,
                spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
                forkedFromParent: sessionRow.forkedFromParent,
                spawnDepth: sessionRow.spawnDepth,
                subagentRole: sessionRow.subagentRole,
                subagentControlScope: sessionRow.subagentControlScope,
                label: sessionRow.label,
                displayName: sessionRow.displayName,
                deliveryContext: sessionRow.deliveryContext,
                parentSessionKey: sessionRow.parentSessionKey,
                childSessions: sessionRow.childSessions,
                thinkingLevel: sessionRow.thinkingLevel,
                fastMode: sessionRow.fastMode,
                verboseLevel: sessionRow.verboseLevel,
                reasoningLevel: sessionRow.reasoningLevel,
                elevatedLevel: sessionRow.elevatedLevel,
                sendPolicy: sessionRow.sendPolicy,
                systemSent: sessionRow.systemSent,
                abortedLastRun: sessionRow.abortedLastRun,
                inputTokens: sessionRow.inputTokens,
                outputTokens: sessionRow.outputTokens,
                lastChannel: sessionRow.lastChannel,
                lastTo: sessionRow.lastTo,
                lastAccountId: sessionRow.lastAccountId,
                lastThreadId: sessionRow.lastThreadId,
                totalTokens: sessionRow.totalTokens,
                totalTokensFresh: sessionRow.totalTokensFresh,
                contextTokens: sessionRow.contextTokens,
                estimatedCostUsd: sessionRow.estimatedCostUsd,
                responseUsage: sessionRow.responseUsage,
                modelProvider: sessionRow.modelProvider,
                model: sessionRow.model,
                status: sessionRow.status,
                startedAt: sessionRow.startedAt,
                endedAt: sessionRow.endedAt,
                runtimeMs: sessionRow.runtimeMs,
              }
            : {};
          const message = attachOpenClawTranscriptMeta(update.message, {
            ...(typeof update.messageId === "string" ? { id: update.messageId } : {}),
            ...(typeof messageSeq === "number" ? { seq: messageSeq } : {}),
          });
          broadcastToConnIds(
            "session.message",
            {
              sessionKey,
              message,
              ...(typeof update.messageId === "string" ? { messageId: update.messageId } : {}),
              ...(typeof messageSeq === "number" ? { messageSeq } : {}),
              ...sessionSnapshot,
            },
            connIds,
            { dropIfSlow: true },
          );

          const sessionEventConnIds = sessionEventSubscribers.getAll();
          if (sessionEventConnIds.size > 0) {
            broadcastToConnIds(
              "sessions.changed",
              {
                sessionKey,
                phase: "message",
                ts: Date.now(),
                ...(typeof update.messageId === "string" ? { messageId: update.messageId } : {}),
                ...(typeof messageSeq === "number" ? { messageSeq } : {}),
                ...sessionSnapshot,
              },
              sessionEventConnIds,
              { dropIfSlow: true },
            );
          }
        });

    lifecycleUnsub = minimalTestGateway
      ? null
      : onSessionLifecycleEvent((event) => {
          const connIds = sessionEventSubscribers.getAll();
          if (connIds.size === 0) {
            return;
          }
          const sessionRow = loadGatewaySessionRow(event.sessionKey);
          broadcastToConnIds(
            "sessions.changed",
            {
              sessionKey: event.sessionKey,
              reason: event.reason,
              parentSessionKey: event.parentSessionKey,
              label: event.label,
              displayName: event.displayName,
              ts: Date.now(),
              ...(sessionRow
                ? {
                    updatedAt: sessionRow.updatedAt ?? undefined,
                    sessionId: sessionRow.sessionId,
                    kind: sessionRow.kind,
                    channel: sessionRow.channel,
                    subject: sessionRow.subject,
                    groupChannel: sessionRow.groupChannel,
                    space: sessionRow.space,
                    chatType: sessionRow.chatType,
                    origin: sessionRow.origin,
                    spawnedBy: sessionRow.spawnedBy,
                    spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
                    forkedFromParent: sessionRow.forkedFromParent,
                    spawnDepth: sessionRow.spawnDepth,
                    subagentRole: sessionRow.subagentRole,
                    subagentControlScope: sessionRow.subagentControlScope,
                    label: event.label ?? sessionRow.label,
                    displayName: event.displayName ?? sessionRow.displayName,
                    deliveryContext: sessionRow.deliveryContext,
                    parentSessionKey: event.parentSessionKey ?? sessionRow.parentSessionKey,
                    childSessions: sessionRow.childSessions,
                    thinkingLevel: sessionRow.thinkingLevel,
                    fastMode: sessionRow.fastMode,
                    verboseLevel: sessionRow.verboseLevel,
                    reasoningLevel: sessionRow.reasoningLevel,
                    elevatedLevel: sessionRow.elevatedLevel,
                    sendPolicy: sessionRow.sendPolicy,
                    systemSent: sessionRow.systemSent,
                    abortedLastRun: sessionRow.abortedLastRun,
                    inputTokens: sessionRow.inputTokens,
                    outputTokens: sessionRow.outputTokens,
                    lastChannel: sessionRow.lastChannel,
                    lastTo: sessionRow.lastTo,
                    lastAccountId: sessionRow.lastAccountId,
                    lastThreadId: sessionRow.lastThreadId,
                    totalTokens: sessionRow.totalTokens,
                    totalTokensFresh: sessionRow.totalTokensFresh,
                    contextTokens: sessionRow.contextTokens,
                    estimatedCostUsd: sessionRow.estimatedCostUsd,
                    responseUsage: sessionRow.responseUsage,
                    modelProvider: sessionRow.modelProvider,
                    model: sessionRow.model,
                    status: sessionRow.status,
                    startedAt: sessionRow.startedAt,
                    endedAt: sessionRow.endedAt,
                    runtimeMs: sessionRow.runtimeMs,
                  }
                : {}),
            },
            connIds,
            { dropIfSlow: true },
          );
        });

    if (!minimalTestGateway) {
      heartbeatRunner = startHeartbeatRunner({ cfg: cfgAtStart });
    }

    const healthCheckMinutes = cfgAtStart.gateway?.channelHealthCheckMinutes;
    const healthCheckDisabled = healthCheckMinutes === 0;
    const staleEventThresholdMinutes = cfgAtStart.gateway?.channelStaleEventThresholdMinutes;
    const maxRestartsPerHour = cfgAtStart.gateway?.channelMaxRestartsPerHour;
    channelHealthMonitor = healthCheckDisabled
      ? null
      : startChannelHealthMonitor({
          channelManager,
          checkIntervalMs: (healthCheckMinutes ?? 5) * 60_000,
          ...(staleEventThresholdMinutes != null && {
            staleEventThresholdMs: staleEventThresholdMinutes * 60_000,
          }),
          ...(maxRestartsPerHour != null && { maxRestartsPerHour }),
        });

    if (!minimalTestGateway) {
      void cron.start().catch((err) => logCron.error(`failed to start: ${String(err)}`));
    }

    stopModelPricingRefresh =
      !minimalTestGateway && process.env.VITEST !== "1"
        ? startGatewayModelPricingRefresh({ config: cfgAtStart })
        : () => {};

    // Recover pending outbound deliveries from previous crash/restart.
    if (!minimalTestGateway) {
      void (async () => {
        const { recoverPendingDeliveries } = await import("../infra/outbound/delivery-queue.js");
        const { deliverOutboundPayloads } = await import("../infra/outbound/deliver.js");
        const logRecovery = log.child("delivery-recovery");
        await recoverPendingDeliveries({
          deliver: deliverOutboundPayloads,
          log: logRecovery,
          cfg: cfgAtStart,
        });
      })().catch((err) => log.error(`Delivery recovery failed: ${String(err)}`));
    }

    const execApprovalManager = new ExecApprovalManager();
    const execApprovalForwarder = createExecApprovalForwarder();
    const execApprovalIosPushDelivery = createExecApprovalIosPushDelivery({ log });
    const execApprovalHandlers = createExecApprovalHandlers(execApprovalManager, {
      forwarder: execApprovalForwarder,
      iosPushDelivery: execApprovalIosPushDelivery,
    });
    const pluginApprovalManager = new ExecApprovalManager<
      import("../infra/plugin-approvals.js").PluginApprovalRequestPayload
    >();
    const pluginApprovalHandlers = createPluginApprovalHandlers(pluginApprovalManager, {
      forwarder: execApprovalForwarder,
    });
    const secretsHandlers = createSecretsHandlers({
      reloadSecrets: async () => {
        const active = getActiveSecretsRuntimeSnapshot();
        if (!active) {
          throw new Error("Secrets runtime snapshot is not active.");
        }
        const prepared = await activateRuntimeSecrets(active.sourceConfig, {
          reason: "reload",
          activate: true,
        });
        return { warningCount: prepared.warnings.length };
      },
      resolveSecrets: async ({ commandName, targetIds }) => {
        const { assignments, diagnostics, inactiveRefPaths } =
          resolveCommandSecretsFromActiveRuntimeSnapshot({
            commandName,
            targetIds: new Set(targetIds),
          });
        if (assignments.length === 0) {
          return { assignments: [] as CommandSecretAssignment[], diagnostics, inactiveRefPaths };
        }
        return { assignments, diagnostics, inactiveRefPaths };
      },
    });

    const canvasHostServerPort = (canvasHostServer as CanvasHostServer | null)?.port;

    const gatewayRequestContext: import("./server-methods/types.js").GatewayRequestContext = {
      deps,
      cron,
      cronStorePath,
      execApprovalManager,
      pluginApprovalManager,
      loadGatewayModelCatalog,
      getHealthCache,
      refreshHealthSnapshot: refreshGatewayHealthSnapshot,
      logHealth,
      logGateway: log,
      incrementPresenceVersion,
      getHealthVersion,
      broadcast,
      broadcastToConnIds,
      nodeSendToSession,
      nodeSendToAllSubscribed,
      nodeSubscribe,
      nodeUnsubscribe,
      nodeUnsubscribeAll,
      hasConnectedMobileNode: hasMobileNodeConnected,
      hasExecApprovalClients: (excludeConnId?: string) => {
        for (const gatewayClient of clients) {
          if (excludeConnId && gatewayClient.connId === excludeConnId) {
            continue;
          }
          const scopes = Array.isArray(gatewayClient.connect.scopes)
            ? gatewayClient.connect.scopes
            : [];
          if (scopes.includes("operator.admin") || scopes.includes("operator.approvals")) {
            return true;
          }
        }
        return false;
      },
      disconnectClientsForDevice: (deviceId: string, opts?: { role?: string }) => {
        for (const gatewayClient of clients) {
          if (gatewayClient.connect.device?.id !== deviceId) {
            continue;
          }
          if (opts?.role && gatewayClient.connect.role !== opts.role) {
            continue;
          }
          try {
            gatewayClient.socket.close(4001, "device removed");
          } catch {
            /* ignore */
          }
        }
      },
      disconnectClientsUsingSharedGatewayAuth: () => {
        for (const gatewayClient of clients) {
          // Trusted-proxy sessions stay up here; only token/password-authenticated
          // clients should be invalidated when the shared gateway secret changes.
          if (!gatewayClient.usesSharedGatewayAuth) {
            continue;
          }
          try {
            gatewayClient.socket.close(4001, "gateway auth changed");
          } catch {
            /* ignore */
          }
        }
      },
      nodeRegistry,
      agentRunSeq,
      chatAbortControllers,
      chatAbortedRuns: chatRunState.abortedRuns,
      chatRunBuffers: chatRunState.buffers,
      chatDeltaSentAt: chatRunState.deltaSentAt,
      chatDeltaLastBroadcastLen: chatRunState.deltaLastBroadcastLen,
      addChatRun,
      removeChatRun,
      subscribeSessionEvents: sessionEventSubscribers.subscribe,
      unsubscribeSessionEvents: sessionEventSubscribers.unsubscribe,
      subscribeSessionMessageEvents: sessionMessageSubscribers.subscribe,
      unsubscribeSessionMessageEvents: sessionMessageSubscribers.unsubscribe,
      unsubscribeAllSessionEvents: (connId: string) => {
        sessionEventSubscribers.unsubscribe(connId);
        sessionMessageSubscribers.unsubscribeAll(connId);
      },
      getSessionEventSubscriberConnIds: sessionEventSubscribers.getAll,
      registerToolEventRecipient: toolEventRecipients.add,
      dedupe,
      wizardSessions,
      findRunningWizard,
      purgeWizardSession,
      getRuntimeSnapshot,
      startChannel,
      stopChannel,
      markChannelLoggedOut,
      wizardRunner,
      broadcastVoiceWakeChanged,
    };

    // Register a lazy fallback for plugin subagent dispatch in non-WS paths
    // (Telegram polling, WhatsApp, etc.) so later runtime swaps can expose the
    // current gateway context without relying on a startup snapshot.
    setFallbackGatewayContextResolver(() => gatewayRequestContext);

    attachGatewayWsHandlers({
      wss,
      clients,
      preauthConnectionBudget,
      port,
      gatewayHost: bindHost ?? undefined,
      canvasHostEnabled: Boolean(canvasHost),
      canvasHostServerPort,
      resolvedAuth,
      getResolvedAuth,
      rateLimiter: authRateLimiter,
      browserRateLimiter: browserAuthRateLimiter,
      gatewayMethods,
      events: GATEWAY_EVENTS,
      logGateway: log,
      logHealth,
      logWsControl,
      extraHandlers: {
        ...pluginRegistry.gatewayHandlers,
        ...execApprovalHandlers,
        ...pluginApprovalHandlers,
        ...secretsHandlers,
      },
      broadcast,
      context: gatewayRequestContext,
    });
    logGatewayStartup({
      cfg: cfgAtStart,
      bindHost,
      bindHosts: httpBindHosts,
      port,
      tlsEnabled: gatewayTls.enabled,
      pluginCount: pluginRegistry.plugins.length,
      log,
      isNixMode,
      startupStartedAt: opts.startupStartedAt,
    });
    stopGatewayUpdateCheck = minimalTestGateway
      ? () => {}
      : scheduleGatewayUpdateCheck({
          cfg: cfgAtStart,
          log,
          isNixMode,
          onUpdateAvailableChange: (updateAvailable) => {
            const payload: GatewayUpdateAvailableEventPayload = { updateAvailable };
            broadcast(GATEWAY_EVENT_UPDATE_AVAILABLE, payload, { dropIfSlow: true });
=======
          skillsRefreshDelayMs: runtimeState.skillsRefreshDelayMs,
          getSkillsRefreshTimer: () => runtimeState.skillsRefreshTimer,
          setSkillsRefreshTimer: (timer) => {
            runtimeState.skillsRefreshTimer = timer;
>>>>>>> upstream/main
          },
          getRuntimeConfig,
          startupTrace,
        }),
      ),
    );
    runtimeState.bonjourStop = earlyRuntime.bonjourStop;
    getActiveTaskCount = earlyRuntime.getActiveTaskCount;
    runtimeState.skillsChangeUnsub = earlyRuntime.skillsChangeUnsub;

<<<<<<< HEAD
    if (!minimalTestGateway) {
      if (deferredConfiguredChannelPluginIds.length > 0) {
        ({ pluginRegistry } = reloadDeferredGatewayPlugins({
          cfg: gatewayPluginConfigAtStart,
          workspaceDir: defaultWorkspaceDir,
          log,
          coreGatewayHandlers,
          baseMethods,
          pluginIds: startupPluginIds,
          logDiagnostics: false,
        }));
      }
      log.info("starting channels and sidecars...");
      ({ pluginServices } = await startGatewaySidecars({
        cfg: gatewayPluginConfigAtStart,
        pluginRegistry,
        defaultWorkspaceDir,
        deps,
        startChannels,
=======
    const [{ startGatewayEventSubscriptions }, { startGatewayRuntimeServices }] =
      await startupTrace.measure("runtime.post-early-imports", () =>
        Promise.all([
          import("./server-runtime-subscriptions.js"),
          import("./server-runtime-startup-services.js"),
        ]),
      );
    const runtimeSubscriptions = await startupTrace.measure("runtime.subscriptions", () =>
      startGatewayEventSubscriptions({
        broadcast,
        broadcastToConnIds,
        nodeSendToSession,
        agentRunSeq,
        chatRunState,
        toolEventRecipients,
        sessionEventSubscribers,
        sessionMessageSubscribers,
        chatAbortControllers,
      }),
    );
    Object.assign(runtimeState, runtimeSubscriptions);

    const runtimeServices = await startupTrace.measure("runtime.services", () =>
      startGatewayRuntimeServices({
        minimalTestGateway,
        cfgAtStart,
        channelManager,
>>>>>>> upstream/main
        log,
      }),
    );
    Object.assign(runtimeState, runtimeServices);

<<<<<<< HEAD
    // Run gateway_start plugin hook (fire-and-forget)
    if (!minimalTestGateway) {
      const hookRunner = getGlobalHookRunner();
      if (hookRunner?.hasHooks("gateway_start")) {
        void hookRunner.runGatewayStart({ port }, { port }).catch((err) => {
          log.warn(`gateway_start hook failed: ${String(err)}`);
        });
      }
    }

    configReloader = minimalTestGateway
      ? { stop: async () => {} }
      : (() => {
          const { applyHotReload, requestGatewayRestart } = createGatewayReloadHandlers({
            deps,
            broadcast,
            getState: () => ({
              hooksConfig,
              hookClientIpConfig,
              heartbeatRunner,
              cronState,
              channelHealthMonitor,
            }),
            setState: (nextState) => {
              hooksConfig = nextState.hooksConfig;
              hookClientIpConfig = nextState.hookClientIpConfig;
              heartbeatRunner = nextState.heartbeatRunner;
              cronState = nextState.cronState;
              cron = cronState.cron;
              cronStorePath = cronState.storePath;
              deps.cron = cron;
              channelHealthMonitor = nextState.channelHealthMonitor;
            },
=======
    const { execApprovalManager, pluginApprovalManager, extraHandlers, coreGatewayHandlers } =
      await startupTrace.measure("gateway.handlers", async () => {
        const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] =
          await Promise.all([import("./server-aux-handlers.js"), import("./server-methods.js")]);
        return {
          ...createGatewayAuxHandlers({
            log,
            activateRuntimeSecrets,
            sharedGatewaySessionGenerationState,
            resolveSharedGatewaySessionGenerationForConfig,
            clients,
>>>>>>> upstream/main
            startChannel,
            stopChannel,
            logChannels,
          }),
          coreGatewayHandlers: coreGatewayHandlersLocal,
        };
      });
    const attachedGatewayExtraHandlers: GatewayRequestHandlers = {
      ...pluginRegistry.gatewayHandlers,
      ...extraHandlers,
    };
    let attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRegistry.gatewayHandlers));
    const buildAttachedGatewayMethodRegistry = (
      nextPluginRegistry: typeof pluginRegistry,
    ): GatewayMethodRegistry => {
      const coreDescriptorHandlers: GatewayRequestHandlers = { ...coreGatewayHandlers };
      const auxHandlers: GatewayRequestHandlers = {};
      for (const [method, handler] of Object.entries(extraHandlers)) {
        if (isCoreGatewayMethodClassified(method)) {
          coreDescriptorHandlers[method] = handler;
        } else {
          auxHandlers[method] = handler;
        }
      }
      return createGatewayMethodRegistry([
        ...createCoreGatewayMethodDescriptors(coreDescriptorHandlers),
        ...createPluginGatewayMethodDescriptors(nextPluginRegistry),
        ...createGatewayMethodDescriptorsFromHandlers({
          handlers: auxHandlers,
          owner: { kind: "aux", area: "gateway-extra" },
          defaultScope: ADMIN_SCOPE,
        }),
      ]);
    };
    let attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRegistry);
    const listAttachedGatewayMethods = () => {
      const methods = attachedGatewayMethodRegistry.listAdvertisedMethods();
      methods.push(...listStartupChannelGatewayMethods());
      return uniqueStrings(methods);
    };
    runtimeState.gatewayMethods.splice(
      0,
      runtimeState.gatewayMethods.length,
      ...listAttachedGatewayMethods(),
    );
    const replaceAttachedPluginRuntime = (loaded: {
      pluginRegistry: typeof pluginRegistry;
      gatewayMethods: string[];
    }) => {
      pluginRegistry = loaded.pluginRegistry;
      baseGatewayMethods = loaded.gatewayMethods;
      for (const key of attachedPluginGatewayHandlerKeys) {
        delete attachedGatewayExtraHandlers[key];
      }
      Object.assign(attachedGatewayExtraHandlers, pluginRegistry.gatewayHandlers);
      attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRegistry.gatewayHandlers));
      attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRegistry);
      runtimeState.gatewayMethods.splice(
        0,
        runtimeState.gatewayMethods.length,
        ...listAttachedGatewayMethods(),
      );
      pinActivePluginHttpRouteRegistry(pluginRegistry);
      pinActivePluginChannelRegistry(pluginRegistry);
    };
    const refreshAttachedGatewayDiscovery = async (nextPluginRegistry: typeof pluginRegistry) => {
      if (minimalTestGateway) {
        return;
      }
      try {
        const stopPreviousDiscovery = runtimeState.bonjourStop;
        runtimeState.bonjourStop = null;
        if (stopPreviousDiscovery) {
          try {
            await stopPreviousDiscovery();
          } catch (err) {
            logDiscovery.warn(
              `gateway discovery stop failed before plugin refresh: ${String(err)}`,
            );
          }
        }
        const { startGatewayPluginDiscovery } = await loadGatewayStartupEarlyModule();
        runtimeState.bonjourStop = await startGatewayPluginDiscovery({
          minimalTestGateway,
          cfgAtStart,
          port,
          gatewayTls,
          gatewayDirectReachable: !isLoopbackHost(bindHost),
          tailscaleMode,
          logDiscovery,
          pluginRegistry: nextPluginRegistry,
        });
      } catch (err) {
        logDiscovery.warn(`gateway discovery refresh failed after plugin load: ${String(err)}`);
      }
    };
    const listAttachedChannelConfigTargets = () =>
      new Map(
        listGatewayStartupChannelPlugins().map((plugin) => [
          plugin.id,
          listChannelPluginConfigTargetIds({
            channelId: plugin.id,
            pluginId: getLoadedChannelPluginEntryById(plugin.id)?.pluginId,
            aliases: plugin.meta.aliases,
          }),
        ]),
      );
    const reloadAttachedGatewayPlugins = async (params: {
      nextConfig: OpenClawConfig;
      changedPaths: readonly string[];
      beforeReplace: (channels: ReadonlySet<ChannelId>) => Promise<void>;
    }): Promise<GatewayPluginReloadResult> => {
      const beforeChannelTargets = listAttachedChannelConfigTargets();
      const beforeChannelIds = new Set(beforeChannelTargets.keys());
      const [{ loadPluginLookUpTable }, { prepareGatewayPluginLoad }, { startPluginServices }] =
        await Promise.all([
          import("../plugins/plugin-lookup-table.js"),
          loadGatewayPluginBootstrapModule(),
          import("../plugins/services.js"),
        ]);
      const nextPluginLookUpTable = loadPluginLookUpTable({
        config: params.nextConfig,
        workspaceDir: defaultWorkspaceDir,
        env: process.env,
        activationSourceConfig: params.nextConfig,
      });
      const nextStartupPluginIds = new Set(nextPluginLookUpTable.startup.pluginIds);
      const nextStartupChannelIds = new Set<ChannelId>();
      for (const plugin of nextPluginLookUpTable.manifestRegistry.plugins) {
        if (!nextStartupPluginIds.has(plugin.id)) {
          continue;
        }
        if (plugin.channels.length === 0) {
          nextStartupChannelIds.add(plugin.id);
          continue;
        }
        for (const channelId of plugin.channels) {
          nextStartupChannelIds.add(channelId);
        }
      }
      const channelsToStopBeforeReplace = new Set<ChannelId>();
      for (const channelId of beforeChannelIds) {
        const targetIds = beforeChannelTargets.get(channelId) ?? new Set([channelId]);
        if (
          !nextStartupChannelIds.has(channelId) ||
          pluginConfigTargetsChanged(targetIds, params.changedPaths)
        ) {
          channelsToStopBeforeReplace.add(channelId);
        }
      }
      await params.beforeReplace(channelsToStopBeforeReplace);
      setCurrentPluginMetadataSnapshot(nextPluginLookUpTable, {
        config: params.nextConfig,
        env: process.env,
        workspaceDir: defaultWorkspaceDir,
      });
      const loaded = prepareGatewayPluginLoad({
        cfg: params.nextConfig,
        workspaceDir: defaultWorkspaceDir,
        log,
        coreGatewayMethodNames,
        hostServices: pluginHostServices,
        baseMethods,
        pluginLookUpTable: nextPluginLookUpTable,
      });
      const previousPluginServices = runtimeState.pluginServices;
      runtimeState.pluginServices = null;
      if (previousPluginServices) {
        await previousPluginServices.stop().catch((err: unknown) => {
          log.warn(`plugin services stop failed during reload: ${String(err)}`);
        });
      }
      replaceAttachedPluginRuntime(loaded);
      await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
      try {
        runtimeState.pluginServices = await startPluginServices({
          registry: loaded.pluginRegistry,
          config: params.nextConfig,
          workspaceDir: defaultWorkspaceDir,
        });
      } catch (err) {
        log.warn(`plugin services failed to start after reload: ${String(err)}`);
      }
      const afterChannelTargets = listAttachedChannelConfigTargets();
      const afterChannelIds = new Set(afterChannelTargets.keys());
      const restartChannels = new Set<ChannelId>();
      for (const channelId of new Set([...beforeChannelIds, ...afterChannelIds])) {
        const targetIds =
          afterChannelTargets.get(channelId) ??
          beforeChannelTargets.get(channelId) ??
          new Set([channelId]);
        if (
          afterChannelIds.has(channelId) &&
          (beforeChannelIds.has(channelId) !== afterChannelIds.has(channelId) ||
            pluginConfigTargetsChanged(targetIds, params.changedPaths))
        ) {
          restartChannels.add(channelId);
        }
      }
      return {
        restartChannels,
        activeChannels: afterChannelIds,
      };
    };

    const unavailableGatewayMethods = new Set<string>(
      minimalTestGateway ? [] : STARTUP_UNAVAILABLE_GATEWAY_METHODS,
    );
    const gatewayRequestContext = await startupTrace.measure(
      "gateway.request-context",
      async () => {
        const { createGatewayRequestContext } = await import("./server-request-context.js");
        return createGatewayRequestContext({
          deps,
          runtimeState,
          getRuntimeConfig,
          execApprovalManager,
          pluginApprovalManager,
          loadGatewayModelCatalog,
          getHealthCache,
          refreshHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
          logHealth,
          logGateway: log,
          incrementPresenceVersion,
          getHealthVersion,
          broadcast,
          broadcastToConnIds,
          nodeSendToSession,
          nodeSendToAllSubscribed,
          nodeSubscribe,
          nodeUnsubscribe,
          nodeUnsubscribeAll,
          hasConnectedTalkNode: hasTalkNodeConnected,
          clients,
          enforceSharedGatewayAuthGenerationForConfigWrite: (nextConfig: OpenClawConfig) => {
            enforceSharedGatewaySessionGenerationForConfigWrite({
              state: sharedGatewaySessionGenerationState,
              nextConfig,
              resolveRuntimeSnapshotGeneration:
                resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
              clients,
            });
          },
          nodeRegistry,
          agentRunSeq,
          chatAbortControllers,
          chatAbortedRuns: chatRunState.abortedRuns,
          chatRunBuffers: chatRunState.buffers,
          chatDeltaSentAt: chatRunState.deltaSentAt,
          chatDeltaLastBroadcastLen: chatRunState.deltaLastBroadcastLen,
          chatDeltaLastBroadcastText: chatRunState.deltaLastBroadcastText,
          agentDeltaSentAt: chatRunState.agentDeltaSentAt,
          bufferedAgentEvents: chatRunState.bufferedAgentEvents,
          clearChatRunState: chatRunState.clearRun,
          addChatRun,
          removeChatRun,
          subscribeSessionEvents: sessionEventSubscribers.subscribe,
          unsubscribeSessionEvents: sessionEventSubscribers.unsubscribe,
          subscribeSessionMessageEvents: sessionMessageSubscribers.subscribe,
          unsubscribeSessionMessageEvents: sessionMessageSubscribers.unsubscribe,
          unsubscribeAllSessionEvents: (connId: string) => {
            sessionEventSubscribers.unsubscribe(connId);
            sessionMessageSubscribers.unsubscribeAll(connId);
          },
          getSessionEventSubscriberConnIds: sessionEventSubscribers.getAll,
          registerToolEventRecipient: toolEventRecipients.add,
          dedupe,
          wizardSessions,
          findRunningWizard,
          purgeWizardSession,
          getRuntimeSnapshot,
          getEventLoopHealth: readinessEventLoopHealth.snapshot,
          startChannel,
          stopChannel,
          markChannelLoggedOut,
          wizardRunner,
          broadcastVoiceWakeChanged,
          unavailableGatewayMethods,
          broadcastVoiceWakeRoutingChanged,
        });
      },
    );
    currentPluginRegistryGatewayContext = gatewayRequestContext;

    const fallbackGatewayContextCleanup: unknown = setFallbackGatewayContextResolver(
      () => gatewayRequestContext,
    );
    clearFallbackGatewayContextForServer =
      typeof fallbackGatewayContextCleanup === "function"
        ? () => {
            fallbackGatewayContextCleanup();
          }
        : () => {};

    if (!minimalTestGateway) {
      if (runtimePluginsLoaded && deferredConfiguredChannelPluginIds.length > 0) {
        const { reloadDeferredGatewayPlugins } = await loadGatewayPluginBootstrapModule();
        const loaded = await startupTrace.measure("gateway.deferred-plugins", () =>
          reloadDeferredGatewayPlugins({
            cfg: gatewayPluginConfigAtStart,
            activationSourceConfig: startupActivationSourceConfig,
            workspaceDir: defaultWorkspaceDir,
            log,
            coreGatewayMethodNames,
            hostServices: pluginHostServices,
            baseMethods,
            pluginIds: startupPluginIds,
            pluginLookUpTable,
            logDiagnostics: false,
          }),
        );
        replaceAttachedPluginRuntime(loaded);
        await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
      }
    }

    const [{ attachGatewayWsHandlers }, { listPluginNodeCapabilities }] =
      await startupTrace.measure("gateway.ws-imports", () =>
        Promise.all([
          import("./server-ws-runtime.js"),
          import("./server/plugins-http/route-capability.js"),
        ]),
      );
    const pluginSurfaceScheme = gatewayTls.enabled ? "https" : "http";
    await startupTrace.measure("gateway.ws-attach", () =>
      attachGatewayWsHandlers({
        wss,
        clients,
        preauthConnectionBudget,
        port,
        gatewayHost: bindHost ?? undefined,
        pluginSurfaceScheme,
        getPluginNodeCapabilities: () => listPluginNodeCapabilities(pluginRegistry),
        resolvedAuth,
        getResolvedAuth,
        getRequiredSharedGatewaySessionGeneration: () =>
          getRequiredSharedGatewaySessionGeneration(sharedGatewaySessionGenerationState),
        rateLimiter: authRateLimiter,
        browserRateLimiter: browserAuthRateLimiter,
        preauthHandshakeTimeoutMs,
        isStartupPending: isGatewayStartupPending,
        gatewayMethods: runtimeState.gatewayMethods,
        events: GATEWAY_EVENTS,
        logGateway: log,
        logHealth,
        logWsControl,
        extraHandlers: attachedGatewayExtraHandlers,
        getMethodRegistry: () => attachedGatewayMethodRegistry,
        broadcast,
        context: gatewayRequestContext,
      }),
    );
    await startupTrace.measure("http.listen", () => startListening());
    startupTrace.mark("http.bound");
    const sessionDeliveryRecoveryMaxEnqueuedAt = Date.now();
    let postAttachRuntimeReturned = false;
    let scheduledServicesActivated = false;
    let scheduledServicesModulePromise: Promise<
      typeof import("./server-runtime-services.js")
    > | null = null;
    const loadScheduledServicesModule = () => {
      scheduledServicesModulePromise ??= import("./server-runtime-services.js");
      return scheduledServicesModulePromise;
    };
    const activateScheduledServicesWhenReady = () => {
      if (
        closePreludeStarted ||
        !postAttachRuntimeReturned ||
        !startupSidecarsReady ||
        scheduledServicesActivated
      ) {
        return;
      }
      scheduledServicesActivated = true;
      void loadScheduledServicesModule().then((gatewayRuntimeServices) => {
        if (closePreludeStarted) {
          return;
        }
        const activated = gatewayRuntimeServices.activateGatewayScheduledServices({
          minimalTestGateway,
          cfgAtStart,
          deps,
          sessionDeliveryRecoveryMaxEnqueuedAt,
          cron: runtimeState.cronState.cron,
          startCron: false,
          logCron,
          log,
          pluginLookUpTable,
        });
        runtimeState.heartbeatRunner = activated.heartbeatRunner;
        runtimeState.stopModelPricingRefresh = activated.stopModelPricingRefresh;
      });
    };
    ({
      stopGatewayUpdateCheck: runtimeState.stopGatewayUpdateCheck,
      tailscaleCleanup: runtimeState.tailscaleCleanup,
      pluginServices: runtimeState.pluginServices,
    } = await startupTrace.measure("runtime.post-attach", () =>
      loadGatewayStartupPostAttachModule().then(
        ({ startGatewayPostAttachRuntime, stopPostReadySidecarsAfterCloseStarted }) =>
          startGatewayPostAttachRuntime({
            minimalTestGateway,
            cfgAtStart,
            bindHost,
            bindHosts: httpBindHosts,
            port,
            tlsEnabled: gatewayTls.enabled,
            log,
            isNixMode,
            startupStartedAt: opts.startupStartedAt,
            broadcast,
            tailscaleMode,
            resetOnExit: tailscaleConfig.resetOnExit ?? false,
            serviceName: tailscaleConfig.serviceName,
            preserveFunnel: tailscaleConfig.preserveFunnel ?? false,
            controlUiBasePath,
            logTailscale,
            gatewayPluginConfigAtStart,
            pluginRegistry,
            defaultWorkspaceDir,
            deps,
            startChannels,
            logHooks,
            logChannels,
<<<<<<< HEAD
            logCron,
            logReload,
            createHealthMonitor: (opts: {
              checkIntervalMs: number;
              staleEventThresholdMs?: number;
              maxRestartsPerHour?: number;
            }) =>
              startChannelHealthMonitor({
                channelManager,
                checkIntervalMs: opts.checkIntervalMs,
                ...(opts.staleEventThresholdMs != null && {
                  staleEventThresholdMs: opts.staleEventThresholdMs,
                }),
                ...(opts.maxRestartsPerHour != null && {
                  maxRestartsPerHour: opts.maxRestartsPerHour,
                }),
              }),
          });

          return startGatewayConfigReloader({
            initialConfig: cfgAtStart,
            initialInternalWriteHash: startupInternalWriteHash,
            readSnapshot: readConfigFileSnapshot,
            subscribeToWrites: registerConfigWriteListener,
            onHotReload: async (plan, nextConfig) => {
              const previousSnapshot = getActiveSecretsRuntimeSnapshot();
              const prepared = await activateRuntimeSecrets(nextConfig, {
                reason: "reload",
                activate: true,
=======
            unavailableGatewayMethods,
            loadStartupPlugins: runtimePluginsLoaded
              ? undefined
              : async () => {
                  const { loadGatewayStartupPluginRuntime } = await loadStartupPluginsModule();
                  return loadGatewayStartupPluginRuntime({
                    cfg: gatewayPluginConfigAtStart,
                    activationSourceConfig: startupActivationSourceConfig,
                    workspaceDir: defaultWorkspaceDir,
                    log,
                    baseMethods,
                    coreGatewayMethodNames,
                    hostServices: pluginHostServices,
                    startupPluginIds,
                    pluginLookUpTable,
                    startupTrace,
                  });
                },
            onStartupPluginsLoading: () => {
              startupPendingReason = "startup-sidecars";
            },
            onStartupPluginsLoaded: async (loaded) => {
              replaceAttachedPluginRuntime(loaded);
              startupPendingReason = "startup-sidecars";
              await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
            },
            getCronService: () =>
              runtimeState?.cronState.cron as PluginHookGatewayCronService | undefined,
            onChannelsStarted: () => {
              releaseStartupAccountStarts();
            },
            onPluginServices: (pluginServices) => {
              runtimeState.pluginServices = pluginServices;
            },
            onPostReadySidecars: (postReadySidecars) => {
              runtimeState.postReadySidecars = postReadySidecars;
              stopPostReadySidecarsAfterCloseStarted({
                postReadySidecars,
                closeStarted: closePreludeStarted,
>>>>>>> upstream/main
              });
              if (closePreludeStarted) {
                runtimeState.postReadySidecars = [];
              }
            },
            onGatewayLifetimeSidecars: (gatewayLifetimeSidecars) => {
              runtimeState.gatewayLifetimeSidecars = gatewayLifetimeSidecars;
              stopPostReadySidecarsAfterCloseStarted({
                postReadySidecars: gatewayLifetimeSidecars,
                closeStarted: closePreludeStarted,
              });
              if (closePreludeStarted) {
                runtimeState.gatewayLifetimeSidecars = [];
              }
            },
            onSidecarsReady: () => {
              startupSidecarsReady = true;
              activateScheduledServicesWhenReady();
            },
            isClosing: () => closePreludeStarted,
            startupTrace,
            deferSidecars: deferStartupSidecars,
            logReadyOnSidecars: !deferStartupSidecars,
            providerAuthPrewarm: { getConfig: getRuntimeConfig },
          }),
      ),
    ));
    startupTrace.detail("memory.ready", collectGatewayProcessMemoryUsageMb());
    startupTrace.mark("ready");
    if (deferStartupSidecars) {
      log.info("gateway ready");
    }
    finishGatewayRestartTrace("restart.ready", collectGatewayProcessMemoryUsageMb());
    postAttachRuntimeReturned = true;
    activateScheduledServicesWhenReady();

    const { startManagedGatewayConfigReloader } = await import("./server-reload-handlers.js");
    runtimeState.configReloader = startManagedGatewayConfigReloader({
      minimalTestGateway,
      initialConfig: cfgAtStart,
      initialCompareConfig: startupLastGoodSnapshot.sourceConfig,
      initialInternalWriteHash: startupInternalWriteHash,
      watchPath: configSnapshot.path,
      readSnapshot: readConfigFileSnapshot,
      promoteSnapshot: promoteConfigSnapshotToLastKnownGood,
      subscribeToWrites: registerConfigWriteListener,
      deps,
      broadcast,
      getState: () => ({
        hooksConfig: runtimeState.hooksConfig,
        hookClientIpConfig: runtimeState.hookClientIpConfig,
        heartbeatRunner: runtimeState.heartbeatRunner,
        cronState: runtimeState.cronState,
        channelHealthMonitor: runtimeState.channelHealthMonitor,
      }),
      setState: (nextState) => {
        const cronStateChanged = nextState.cronState !== runtimeState.cronState;
        runtimeState.hooksConfig = nextState.hooksConfig;
        runtimeState.hookClientIpConfig = nextState.hookClientIpConfig;
        runtimeState.heartbeatRunner = nextState.heartbeatRunner;
        runtimeState.cronState = nextState.cronState;
        deps.cron = runtimeState.cronState.cron;
        runtimeState.channelHealthMonitor = nextState.channelHealthMonitor;
        if (cronStateChanged) {
          gatewayCronStartHandled = true;
        }
      },
      startChannel,
      stopChannel,
      stopPostReadySidecars: stopRegisteredPostReadySidecars,
      reloadPlugins: reloadAttachedGatewayPlugins,
      logHooks,
      logChannels,
      logCron,
      logReload,
      onCronRestart: () => {
        gatewayCronStartHandled = true;
      },
      channelManager,
      activateRuntimeSecrets,
      resolveSharedGatewaySessionGenerationForConfig,
      sharedGatewaySessionGenerationState,
      clients,
    });
    await promoteConfigSnapshotToLastKnownGood(startupLastGoodSnapshot).catch((err: unknown) => {
      log.warn(`gateway: failed to promote config last-known-good backup: ${String(err)}`);
    });
    if (!minimalTestGateway) {
      const gatewayRuntimeServices = await loadScheduledServicesModule();
      postReadyMaintenanceTimer = gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
        delayMs: POST_READY_MAINTENANCE_DELAY_MS,
        isClosing: () => closePreludeStarted,
        onStarted: () => {
          postReadyMaintenanceTimer = null;
        },
        startMaintenance: async () => {
          if (closePreludeStarted) {
            return null;
          }
          return earlyRuntime.startMaintenance();
        },
        applyMaintenance: (maintenance) => {
          if (closePreludeStarted) {
            clearInterval(maintenance.tickInterval);
            clearInterval(maintenance.healthInterval);
            clearInterval(maintenance.dedupeCleanup);
            if (maintenance.mediaCleanup) {
              clearInterval(maintenance.mediaCleanup);
            }
            return;
          }
          runtimeState.tickInterval = maintenance.tickInterval;
          runtimeState.healthInterval = maintenance.healthInterval;
          runtimeState.dedupeCleanup = maintenance.dedupeCleanup;
          runtimeState.mediaCleanup = maintenance.mediaCleanup;
        },
        shouldStartCron: () => !closePreludeStarted && !gatewayCronStartHandled,
        markCronStartHandled: () => {
          gatewayCronStartHandled = true;
        },
        cron: runtimeState.cronState.cron,
        logCron,
        log,
        recordPostReadyMemory: () => {
          startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
        },
      });
    } else {
      startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
    }
  } catch (err) {
    await closeOnStartupFailure();
    throw err;
  }

<<<<<<< HEAD
  const close = createGatewayCloseHandler({
    bonjourStop,
    tailscaleCleanup,
    canvasHost,
    canvasHostServer,
    releasePluginRouteRegistry,
    stopChannel,
    pluginServices,
    cron,
    heartbeatRunner,
    updateCheckStop: stopGatewayUpdateCheck,
    stopTaskRegistryMaintenance,
    nodePresenceTimers,
    broadcast,
    tickInterval,
    healthInterval,
    dedupeCleanup,
    mediaCleanup,
    agentUnsub,
    heartbeatUnsub,
    transcriptUnsub,
    lifecycleUnsub,
    chatRunState,
    clients,
    configReloader,
    wss,
    httpServer,
    httpServers,
  });
=======
  const close = createCloseHandler();
>>>>>>> upstream/main

  return {
    close: async (optsLocal) => {
      try {
        markClosePreludeStarted();
        await stopRegisteredGatewayLifetimeSidecars();
        await stopRegisteredPostReadySidecars();
        // Run gateway_stop plugin hook before shutdown
        const { runGlobalGatewayStopSafely } = await import("../plugins/hook-runner-global.js");
        await runGlobalGatewayStopSafely({
          event: { reason: optsLocal?.reason ?? "gateway stopping" },
          ctx: { port },
          onError: (err) => log.warn(`gateway_stop hook failed: ${String(err)}`),
        });
        await runClosePrelude();
        await close(optsLocal);
      } finally {
        clearFallbackGatewayContextForServer();
      }
<<<<<<< HEAD
      if (skillsRefreshTimer) {
        clearTimeout(skillsRefreshTimer);
        skillsRefreshTimer = null;
      }
      skillsChangeUnsub();
      authRateLimiter?.dispose();
      browserAuthRateLimiter.dispose();
      stopModelPricingRefresh();
      channelHealthMonitor?.stop();
      clearSecretsRuntimeSnapshot();
      await mcpServer?.close().catch(() => {});
      await close(opts);
=======
>>>>>>> upstream/main
    },
  };
}
