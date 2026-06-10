<<<<<<< HEAD
=======
// Gateway node catalog builder.
// Merges paired devices, approved node records, and live websocket sessions.
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { normalizeSortedUniqueTrimmedStringList } from "@openclaw/normalization-core/string-normalization";
>>>>>>> upstream/main
import { hasEffectivePairedDeviceRole, type PairedDevice } from "../infra/device-pairing.js";
import type { NodePairingPairedNode } from "../infra/node-pairing.js";
import type { NodeListNode } from "../shared/node-list-types.js";
import type { NodeSession } from "./node-registry.js";

<<<<<<< HEAD
export type KnownNodeDevicePairingSource = {
=======
type KnownNodeDevicePairingSource = {
>>>>>>> upstream/main
  nodeId: string;
  displayName?: string;
  platform?: string;
  clientId?: string;
  clientMode?: string;
  remoteIp?: string;
  approvedAtMs?: number;
<<<<<<< HEAD
};

export type KnownNodeApprovedSource = {
=======
  lastSeenAtMs?: number;
  lastSeenReason?: string;
};

type KnownNodeApprovedSource = {
>>>>>>> upstream/main
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  remoteIp?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  caps: string[];
  commands: string[];
  permissions?: Record<string, boolean>;
  approvedAtMs?: number;
<<<<<<< HEAD
};

export type KnownNodeEntry = {
=======
  lastConnectedAtMs?: number;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
};

type KnownNodeEntry = {
>>>>>>> upstream/main
  nodeId: string;
  devicePairing?: KnownNodeDevicePairingSource;
  nodePairing?: KnownNodeApprovedSource;
  live?: NodeSession;
  effective: NodeListNode;
};

<<<<<<< HEAD
export type KnownNodeCatalog = {
  entriesById: Map<string, KnownNodeEntry>;
};

function uniqueSortedStrings(...items: Array<readonly string[] | undefined>): string[] {
  const values = new Set<string>();
  for (const item of items) {
    if (!item) {
      continue;
    }
    for (const value of item) {
      const trimmed = value.trim();
      if (trimmed) {
        values.add(trimmed);
      }
    }
  }
  return [...values].toSorted((left, right) => left.localeCompare(right));
=======
type KnownNodeCatalog = {
  entriesById: Map<string, KnownNodeEntry>;
};

function uniqueSortedStrings(...items: Array<readonly unknown[] | undefined>): string[] {
  return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
>>>>>>> upstream/main
}

function buildDevicePairingSource(entry: PairedDevice): KnownNodeDevicePairingSource {
  return {
    nodeId: entry.deviceId,
    displayName: entry.displayName,
    platform: entry.platform,
    clientId: entry.clientId,
    clientMode: entry.clientMode,
    remoteIp: entry.remoteIp,
    approvedAtMs: entry.approvedAtMs,
<<<<<<< HEAD
=======
    lastSeenAtMs: entry.lastSeenAtMs,
    lastSeenReason: entry.lastSeenReason,
>>>>>>> upstream/main
  };
}

function buildApprovedNodeSource(entry: NodePairingPairedNode): KnownNodeApprovedSource {
  return {
    nodeId: entry.nodeId,
    displayName: entry.displayName,
    platform: entry.platform,
    version: entry.version,
    coreVersion: entry.coreVersion,
    uiVersion: entry.uiVersion,
    remoteIp: entry.remoteIp,
    deviceFamily: entry.deviceFamily,
    modelIdentifier: entry.modelIdentifier,
    caps: entry.caps ?? [],
    commands: entry.commands ?? [],
    permissions: entry.permissions,
    approvedAtMs: entry.approvedAtMs,
<<<<<<< HEAD
=======
    lastConnectedAtMs: entry.lastConnectedAtMs,
    lastSeenAtMs: entry.lastSeenAtMs,
    lastSeenReason: entry.lastSeenReason,
  };
}

function resolveEffectiveLastSeen(params: {
  live?: NodeSession;
  devicePairing?: KnownNodeDevicePairingSource;
  nodePairing?: KnownNodeApprovedSource;
}): { lastSeenAtMs?: number; lastSeenReason?: string } {
  // Live connected time is the freshest signal; stored last-seen values fill in
  // disconnected rows without letting stale device-pairing data override nodes.
  const candidates: Array<{ atMs: number; reason?: string }> = [
    params.live?.connectedAtMs ? { atMs: params.live.connectedAtMs, reason: "connect" } : undefined,
    params.nodePairing?.lastSeenAtMs
      ? { atMs: params.nodePairing.lastSeenAtMs, reason: params.nodePairing.lastSeenReason }
      : undefined,
    params.nodePairing?.lastConnectedAtMs
      ? { atMs: params.nodePairing.lastConnectedAtMs, reason: "connect" }
      : undefined,
    params.devicePairing?.lastSeenAtMs
      ? { atMs: params.devicePairing.lastSeenAtMs, reason: params.devicePairing.lastSeenReason }
      : undefined,
  ].filter((entry) => entry !== undefined);
  let newest: { atMs: number; reason?: string } | undefined;
  for (const candidate of candidates) {
    if (!newest || candidate.atMs > newest.atMs) {
      newest = candidate;
    }
  }
  if (!newest) {
    return {};
  }
  return {
    lastSeenAtMs: newest.atMs,
    lastSeenReason: newest.reason,
>>>>>>> upstream/main
  };
}

function buildEffectiveKnownNode(entry: {
  nodeId: string;
  devicePairing?: KnownNodeDevicePairingSource;
  nodePairing?: KnownNodeApprovedSource;
  live?: NodeSession;
}): NodeListNode {
  const { nodeId, devicePairing, nodePairing, live } = entry;
<<<<<<< HEAD
=======
  const lastSeen = resolveEffectiveLastSeen({ live, devicePairing, nodePairing });
>>>>>>> upstream/main
  return {
    nodeId,
    displayName: live?.displayName ?? nodePairing?.displayName ?? devicePairing?.displayName,
    platform: live?.platform ?? nodePairing?.platform ?? devicePairing?.platform,
    version: live?.version ?? nodePairing?.version,
    coreVersion: live?.coreVersion ?? nodePairing?.coreVersion,
    uiVersion: live?.uiVersion ?? nodePairing?.uiVersion,
    clientId: live?.clientId ?? devicePairing?.clientId,
    clientMode: live?.clientMode ?? devicePairing?.clientMode,
    deviceFamily: live?.deviceFamily ?? nodePairing?.deviceFamily,
    modelIdentifier: live?.modelIdentifier ?? nodePairing?.modelIdentifier,
    remoteIp: live?.remoteIp ?? nodePairing?.remoteIp ?? devicePairing?.remoteIp,
    caps: live ? uniqueSortedStrings(live.caps) : uniqueSortedStrings(nodePairing?.caps),
    commands: live
      ? uniqueSortedStrings(live.commands)
      : uniqueSortedStrings(nodePairing?.commands),
    pathEnv: live?.pathEnv,
    permissions: live?.permissions ?? nodePairing?.permissions,
    connectedAtMs: live?.connectedAtMs,
<<<<<<< HEAD
=======
    lastSeenAtMs: lastSeen.lastSeenAtMs,
    lastSeenReason: lastSeen.lastSeenReason,
>>>>>>> upstream/main
    approvedAtMs: nodePairing?.approvedAtMs ?? devicePairing?.approvedAtMs,
    paired: Boolean(devicePairing ?? nodePairing),
    connected: Boolean(live),
  };
}

function compareKnownNodes(left: NodeListNode, right: NodeListNode): number {
  if (left.connected !== right.connected) {
    return left.connected ? -1 : 1;
  }
<<<<<<< HEAD
  const leftName = (left.displayName ?? left.nodeId).toLowerCase();
  const rightName = (right.displayName ?? right.nodeId).toLowerCase();
=======
  const leftName = normalizeLowercaseStringOrEmpty(left.displayName ?? left.nodeId);
  const rightName = normalizeLowercaseStringOrEmpty(right.displayName ?? right.nodeId);
>>>>>>> upstream/main
  if (leftName < rightName) {
    return -1;
  }
  if (leftName > rightName) {
    return 1;
  }
  return left.nodeId.localeCompare(right.nodeId);
}

<<<<<<< HEAD
=======
/** Builds a node catalog keyed by node id from pairing stores and live sessions. */
>>>>>>> upstream/main
export function createKnownNodeCatalog(params: {
  pairedDevices: readonly PairedDevice[];
  pairedNodes?: readonly NodePairingPairedNode[];
  connectedNodes: readonly NodeSession[];
}): KnownNodeCatalog {
  const devicePairingById = new Map(
    params.pairedDevices
      .filter((entry) => hasEffectivePairedDeviceRole(entry, "node"))
      .map((entry) => [entry.deviceId, buildDevicePairingSource(entry)]),
  );
  const nodePairingById = new Map(
    (params.pairedNodes ?? []).map((entry) => [entry.nodeId, buildApprovedNodeSource(entry)]),
  );
  const liveById = new Map(params.connectedNodes.map((entry) => [entry.nodeId, entry]));
  const nodeIds = new Set<string>([
    ...devicePairingById.keys(),
    ...nodePairingById.keys(),
    ...liveById.keys(),
  ]);
  const entriesById = new Map<string, KnownNodeEntry>();
  for (const nodeId of nodeIds) {
    const devicePairing = devicePairingById.get(nodeId);
    const nodePairing = nodePairingById.get(nodeId);
    const live = liveById.get(nodeId);
    entriesById.set(nodeId, {
      nodeId,
      devicePairing,
      nodePairing,
      live,
      effective: buildEffectiveKnownNode({
        nodeId,
        devicePairing,
        nodePairing,
        live,
      }),
    });
  }
  return { entriesById };
}

<<<<<<< HEAD
=======
/** Lists known nodes with connected nodes first and deterministic display ordering. */
>>>>>>> upstream/main
export function listKnownNodes(catalog: KnownNodeCatalog): NodeListNode[] {
  return [...catalog.entriesById.values()]
    .map((entry) => entry.effective)
    .toSorted(compareKnownNodes);
}

<<<<<<< HEAD
=======
/** Returns the merged catalog entry for diagnostics that need source details. */
>>>>>>> upstream/main
export function getKnownNodeEntry(
  catalog: KnownNodeCatalog,
  nodeId: string,
): KnownNodeEntry | null {
  return catalog.entriesById.get(nodeId) ?? null;
}

<<<<<<< HEAD
=======
/** Returns the effective node row shown to gateway clients. */
>>>>>>> upstream/main
export function getKnownNode(catalog: KnownNodeCatalog, nodeId: string): NodeListNode | null {
  return getKnownNodeEntry(catalog, nodeId)?.effective ?? null;
}
