<<<<<<< HEAD
import type { OpenClawConfig } from "../config/types.js";
import { buildStatusJsonPayload } from "./status-json-payload.ts";
import {
  resolveStatusRuntimeDetails,
  resolveStatusSecurityAudit,
} from "./status-runtime-shared.ts";
=======
// Resolves runtime-only inputs for status JSON after the fast scan completes.
// Keeps gateway health, usage, security audit, and service summaries behind explicit option gates.

import type { OpenClawConfig } from "../config/types.js";
import type { UpdateCheckResult } from "../infra/update-check.js";
import { buildStatusJsonPayload } from "./status-json-payload.ts";
import { buildStatusOverviewSurfaceFromScan } from "./status-overview-surface.ts";
import { resolveStatusRuntimeSnapshot } from "./status-runtime-shared.ts";
>>>>>>> upstream/main

type StatusJsonScanLike = {
  cfg: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  summary: Record<string, unknown>;
<<<<<<< HEAD
  update: {
    installKind?: string | null;
    git?: {
      tag?: string | null;
      branch?: string | null;
    } | null;
  } & Record<string, unknown>;
=======
  update: UpdateCheckResult;
>>>>>>> upstream/main
  osSummary: unknown;
  memory: unknown;
  memoryPlugin: unknown;
  gatewayMode: "local" | "remote";
  gatewayConnection: {
    url: string;
    urlSource?: string;
  };
  remoteUrlMissing: boolean;
  gatewayReachable: boolean;
  gatewayProbe:
    | {
        connectLatencyMs?: number | null;
        error?: string | null;
      }
    | null
    | undefined;
<<<<<<< HEAD
=======
  gatewayProbeAuth:
    | {
        token?: string;
        password?: string;
      }
    | null
    | undefined;
>>>>>>> upstream/main
  gatewaySelf:
    | {
        host?: string | null;
        ip?: string | null;
        version?: string | null;
        platform?: string | null;
      }
    | null
    | undefined;
  gatewayProbeAuthWarning?: string | null;
  agentStatus: unknown;
  secretDiagnostics: string[];
  pluginCompatibility?: Array<Record<string, unknown>> | null | undefined;
};

<<<<<<< HEAD
=======
/** Builds the status JSON object from a completed scan plus optional runtime/deep probes. */
>>>>>>> upstream/main
export async function resolveStatusJsonOutput(params: {
  scan: StatusJsonScanLike;
  opts: {
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
  };
  includeSecurityAudit: boolean;
  includePluginCompatibility?: boolean;
  suppressHealthErrors?: boolean;
}) {
  const { scan, opts } = params;
<<<<<<< HEAD
  const securityAudit = params.includeSecurityAudit
    ? await resolveStatusSecurityAudit({
        config: scan.cfg,
        sourceConfig: scan.sourceConfig,
      })
    : undefined;
  const { usage, health, lastHeartbeat, gatewayService, nodeService } =
    await resolveStatusRuntimeDetails({
      config: scan.cfg,
=======
  const { securityAudit, usage, health, lastHeartbeat, gatewayService, nodeService } =
    await resolveStatusRuntimeSnapshot({
      config: scan.cfg,
      sourceConfig: scan.sourceConfig,
>>>>>>> upstream/main
      timeoutMs: opts.timeoutMs,
      usage: opts.usage,
      deep: opts.deep,
      gatewayReachable: scan.gatewayReachable,
<<<<<<< HEAD
=======
      includeSecurityAudit: params.includeSecurityAudit,
>>>>>>> upstream/main
      suppressHealthErrors: params.suppressHealthErrors,
    });

  return buildStatusJsonPayload({
    summary: scan.summary,
<<<<<<< HEAD
    updateConfigChannel: scan.cfg.update?.channel,
    update: scan.update,
    osSummary: scan.osSummary,
    memory: scan.memory,
    memoryPlugin: scan.memoryPlugin,
    gatewayMode: scan.gatewayMode,
    gatewayConnection: scan.gatewayConnection,
    remoteUrlMissing: scan.remoteUrlMissing,
    gatewayReachable: scan.gatewayReachable,
    gatewayProbe: scan.gatewayProbe,
    gatewaySelf: scan.gatewaySelf,
    gatewayProbeAuthWarning: scan.gatewayProbeAuthWarning,
    gatewayService,
    nodeService,
=======
    surface: buildStatusOverviewSurfaceFromScan({
      // The scan shape is intentionally narrower than the surface helper's full scan type.
      scan: scan as never,
      gatewayService,
      nodeService,
    }),
    osSummary: scan.osSummary,
    memory: scan.memory,
    memoryPlugin: scan.memoryPlugin,
>>>>>>> upstream/main
    agents: scan.agentStatus,
    secretDiagnostics: scan.secretDiagnostics,
    securityAudit,
    health,
    usage,
    lastHeartbeat,
    pluginCompatibility: params.includePluginCompatibility ? scan.pluginCompatibility : undefined,
  });
}
