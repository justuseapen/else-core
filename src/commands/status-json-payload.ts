<<<<<<< HEAD
import {
  buildGatewayStatusJsonPayload,
  resolveStatusUpdateChannelInfo,
} from "./status-all/format.js";

export { resolveStatusUpdateChannelInfo } from "./status-all/format.js";

export function buildStatusJsonPayload(params: {
  summary: Record<string, unknown>;
  updateConfigChannel?: string | null;
  update: {
    installKind?: string | null;
    git?: {
      tag?: string | null;
      branch?: string | null;
    } | null;
  } & Record<string, unknown>;
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
  gatewayService: unknown;
  nodeService: unknown;
=======
// Builds the stable JSON payload for `openclaw status --json`.
// Optional deep fields are included only when their upstream probes actually ran.

import { resolveStatusUpdateChannelInfo } from "./status-all/format.js";
import {
  buildStatusGatewayJsonPayloadFromSurface,
  type StatusOverviewSurface,
} from "./status-overview-surface.ts";

/** Combines scan summary, overview surface, services, agents, diagnostics, and optional deep probes. */
export function buildStatusJsonPayload(params: {
  summary: Record<string, unknown>;
  surface: StatusOverviewSurface;
  osSummary: unknown;
  memory: unknown;
  memoryPlugin: unknown;
>>>>>>> upstream/main
  agents: unknown;
  secretDiagnostics: string[];
  securityAudit?: unknown;
  health?: unknown;
  usage?: unknown;
  lastHeartbeat?: unknown;
  pluginCompatibility?: Array<Record<string, unknown>> | null | undefined;
}) {
  const channelInfo = resolveStatusUpdateChannelInfo({
<<<<<<< HEAD
    updateConfigChannel: params.updateConfigChannel,
    update: params.update,
=======
    updateConfigChannel: params.surface.cfg.update?.channel ?? undefined,
    update: params.surface.update,
>>>>>>> upstream/main
  });
  return {
    ...params.summary,
    os: params.osSummary,
<<<<<<< HEAD
    update: params.update,
=======
    update: params.surface.update,
>>>>>>> upstream/main
    updateChannel: channelInfo.channel,
    updateChannelSource: channelInfo.source,
    memory: params.memory,
    memoryPlugin: params.memoryPlugin,
<<<<<<< HEAD
    gateway: buildGatewayStatusJsonPayload({
      gatewayMode: params.gatewayMode,
      gatewayConnection: params.gatewayConnection,
      remoteUrlMissing: params.remoteUrlMissing,
      gatewayReachable: params.gatewayReachable,
      gatewayProbe: params.gatewayProbe,
      gatewaySelf: params.gatewaySelf,
      gatewayProbeAuthWarning: params.gatewayProbeAuthWarning,
    }),
    gatewayService: params.gatewayService,
    nodeService: params.nodeService,
=======
    gateway: buildStatusGatewayJsonPayloadFromSurface({ surface: params.surface }),
    gatewayService: params.surface.gatewayService,
    nodeService: params.surface.nodeService,
>>>>>>> upstream/main
    agents: params.agents,
    secretDiagnostics: params.secretDiagnostics,
    ...(params.securityAudit ? { securityAudit: params.securityAudit } : {}),
    ...(params.pluginCompatibility
      ? {
<<<<<<< HEAD
=======
          // Keep warnings grouped with a count so consumers can test compatibility status cheaply.
>>>>>>> upstream/main
          pluginCompatibility: {
            count: params.pluginCompatibility.length,
            warnings: params.pluginCompatibility,
          },
        }
      : {}),
    ...(params.health || params.usage || params.lastHeartbeat
      ? {
<<<<<<< HEAD
=======
          // Deep/usage fields stay absent in fast mode instead of appearing as null placeholders.
>>>>>>> upstream/main
          health: params.health,
          usage: params.usage,
          lastHeartbeat: params.lastHeartbeat,
        }
      : {}),
  };
}
