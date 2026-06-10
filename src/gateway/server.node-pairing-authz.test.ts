<<<<<<< HEAD
import { describe, expect, test } from "vitest";
import { WebSocket } from "ws";
import { approveNodePairing, listNodePairing, requestNodePairing } from "../infra/node-pairing.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
import {
  issueOperatorToken,
=======
// Node pairing authorization tests cover approved node reconnects, visible
// command scopes, and gateway enforcement around node client identity.
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { WebSocket } from "ws";
import {
  approveNodePairing,
  getPairedNode,
  listNodePairing,
  requestNodePairing,
} from "../infra/node-pairing.js";
import { createSuiteTempRootTracker } from "../test-helpers/temp-dir.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
import {
>>>>>>> upstream/main
  loadDeviceIdentity,
  openTrackedWs,
  pairDeviceIdentity,
} from "./device-authz.test-helpers.js";
import { connectGatewayClient } from "./test-helpers.e2e.js";
import {
  connectOk,
  installGatewayTestHooks,
  rpcReq,
  startServerWithClient,
} from "./test-helpers.js";

installGatewayTestHooks({ scope: "suite" });

<<<<<<< HEAD
=======
const tempDirs = createSuiteTempRootTracker({ prefix: "openclaw-node-pair-authz-" });

async function makeNodePairingStateDir(): Promise<string> {
  return await tempDirs.make("case");
}

function requireApprovedPairing(
  result: Awaited<ReturnType<typeof approveNodePairing>>,
): Exclude<typeof result, null | { status: "forbidden"; missingScope: string }> {
  if (!result || "status" in result) {
    throw new Error(`Expected approved node pairing, got ${JSON.stringify(result)}`);
  }
  return result;
}

>>>>>>> upstream/main
async function connectNodeClient(params: {
  port: number;
  deviceIdentity: ReturnType<typeof loadDeviceIdentity>["identity"];
  commands: string[];
}) {
  return await connectGatewayClient({
    url: `ws://127.0.0.1:${params.port}`,
    token: "secret",
    role: "node",
    clientName: GATEWAY_CLIENT_NAMES.NODE_HOST,
    clientDisplayName: "node-command-pin",
    clientVersion: "1.0.0",
<<<<<<< HEAD
    platform: "darwin",
=======
    platform: "macos",
    deviceFamily: "Mac",
>>>>>>> upstream/main
    mode: GATEWAY_CLIENT_MODES.NODE,
    scopes: [],
    commands: params.commands,
    deviceIdentity: params.deviceIdentity,
    timeoutMessage: "timeout waiting for paired node to connect",
  });
}

<<<<<<< HEAD
describe("gateway node pairing authorization", () => {
  test("requires operator.admin for exec-capable node pairing approvals", async () => {
    const started = await startServerWithClient("secret");
    const approver = await issueOperatorToken({
      name: "node-pair-approve-pairing-only",
      approvedScopes: ["operator.admin"],
      tokenScopes: ["operator.pairing"],
      clientId: GATEWAY_CLIENT_NAMES.TEST,
      clientMode: GATEWAY_CLIENT_MODES.TEST,
    });

    let pairingWs: WebSocket | undefined;
    try {
      const request = await requestNodePairing({
        nodeId: "node-approve-target",
        platform: "darwin",
        commands: ["system.run"],
      });

      pairingWs = await openTrackedWs(started.port);
      await connectOk(pairingWs, {
        skipDefaultAuth: true,
        deviceToken: approver.token,
        deviceIdentityPath: approver.identityPath,
        scopes: ["operator.pairing"],
      });

      const approve = await rpcReq(pairingWs, "node.pair.approve", {
        requestId: request.request.requestId,
      });
      expect(approve.ok).toBe(false);
      expect(approve.error?.message).toBe("missing scope: operator.admin");

      await expect(
        import("../infra/node-pairing.js").then((m) => m.getPairedNode("node-approve-target")),
      ).resolves.toBeNull();
    } finally {
      pairingWs?.close();
      started.ws.close();
      await started.server.close();
      started.envSnapshot.restore();
    }
  });

  test("requires operator.pairing before node pairing approvals", async () => {
    const started = await startServerWithClient("secret");
    const approver = await issueOperatorToken({
      name: "node-pair-approve-attacker",
      approvedScopes: ["operator.admin"],
      tokenScopes: ["operator.write"],
      clientId: GATEWAY_CLIENT_NAMES.TEST,
      clientMode: GATEWAY_CLIENT_MODES.TEST,
    });

    let pairingWs: WebSocket | undefined;
    try {
      const request = await requestNodePairing({
        nodeId: "node-approve-target",
        platform: "darwin",
        commands: ["system.run"],
      });

      pairingWs = await openTrackedWs(started.port);
      await connectOk(pairingWs, {
        skipDefaultAuth: true,
        deviceToken: approver.token,
        deviceIdentityPath: approver.identityPath,
        scopes: ["operator.write"],
      });

      const approve = await rpcReq(pairingWs, "node.pair.approve", {
        requestId: request.request.requestId,
      });
      expect(approve.ok).toBe(false);
      expect(approve.error?.message).toBe("missing scope: operator.pairing");

      await expect(
        import("../infra/node-pairing.js").then((m) => m.getPairedNode("node-approve-target")),
      ).resolves.toBeNull();
    } finally {
      pairingWs?.close();
      started.ws.close();
      await started.server.close();
      started.envSnapshot.restore();
    }
  });

  test("allows pairing-only operators to approve commandless node requests", async () => {
    const started = await startServerWithClient("secret");
    const approver = await issueOperatorToken({
      name: "node-pair-approve-commandless",
      approvedScopes: ["operator.admin"],
      tokenScopes: ["operator.pairing"],
      clientId: GATEWAY_CLIENT_NAMES.TEST,
      clientMode: GATEWAY_CLIENT_MODES.TEST,
    });

    let pairingWs: WebSocket | undefined;
    try {
      const request = await requestNodePairing({
        nodeId: "node-approve-target",
        platform: "darwin",
      });

      pairingWs = await openTrackedWs(started.port);
      await connectOk(pairingWs, {
        skipDefaultAuth: true,
        deviceToken: approver.token,
        deviceIdentityPath: approver.identityPath,
        scopes: ["operator.pairing"],
      });

      const approve = await rpcReq<{
        requestId?: string;
        node?: { nodeId?: string };
      }>(pairingWs, "node.pair.approve", {
        requestId: request.request.requestId,
      });
      expect(approve.ok).toBe(true);
      expect(approve.payload?.requestId).toBe(request.request.requestId);
      expect(approve.payload?.node?.nodeId).toBe("node-approve-target");

      await expect(
        import("../infra/node-pairing.js").then((m) => m.getPairedNode("node-approve-target")),
      ).resolves.toEqual(
        expect.objectContaining({
          nodeId: "node-approve-target",
        }),
      );
    } finally {
      pairingWs?.close();
      started.ws.close();
      await started.server.close();
      started.envSnapshot.restore();
    }
  });

  test("does not pin connected node commands to the approved pairing record", async () => {
    const started = await startServerWithClient("secret");
    const pairedNode = await pairDeviceIdentity({
      name: "node-command-pin",
      role: "node",
      scopes: [],
      clientId: GATEWAY_CLIENT_NAMES.NODE_HOST,
      clientMode: GATEWAY_CLIENT_MODES.NODE,
    });

    let controlWs: WebSocket | undefined;
    let firstClient: Awaited<ReturnType<typeof connectGatewayClient>> | undefined;
    let nodeClient: Awaited<ReturnType<typeof connectGatewayClient>> | undefined;
    try {
      controlWs = await openTrackedWs(started.port);
      await connectOk(controlWs, { token: "secret" });

      firstClient = await connectNodeClient({
        port: started.port,
        deviceIdentity: pairedNode.identity,
        commands: ["canvas.snapshot"],
      });
      await firstClient.stopAndWait();

      const request = await requestNodePairing({
        nodeId: pairedNode.identity.deviceId,
        platform: "darwin",
        commands: ["canvas.snapshot"],
      });
      await approveNodePairing(request.request.requestId, {
        callerScopes: ["operator.pairing", "operator.write"],
      });

      nodeClient = await connectNodeClient({
        port: started.port,
        deviceIdentity: pairedNode.identity,
        commands: ["canvas.snapshot", "system.run"],
      });

      const deadline = Date.now() + 2_000;
      let lastNodes: Array<{ nodeId: string; connected?: boolean; commands?: string[] }> = [];
      while (Date.now() < deadline) {
        const list = await rpcReq<{
          nodes?: Array<{ nodeId: string; connected?: boolean; commands?: string[] }>;
        }>(controlWs, "node.list", {});
        lastNodes = list.payload?.nodes ?? [];
        const node = lastNodes.find(
          (entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected,
        );
        if (
          JSON.stringify(node?.commands?.toSorted() ?? []) ===
          JSON.stringify(["canvas.snapshot", "system.run"])
        ) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      expect(
        lastNodes
          .find((entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected)
          ?.commands?.toSorted(),
        JSON.stringify(lastNodes),
      ).toEqual(["canvas.snapshot", "system.run"]);
    } finally {
      controlWs?.close();
      await firstClient?.stopAndWait();
      await nodeClient?.stopAndWait();
      started.ws.close();
      await started.server.close();
      started.envSnapshot.restore();
    }
  });

  test("does not request repair pairing when a paired node reconnects with more commands", async () => {
    const started = await startServerWithClient("secret");
    const pairedNode = await pairDeviceIdentity({
      name: "node-command-empty",
      role: "node",
      scopes: [],
      clientId: GATEWAY_CLIENT_NAMES.NODE_HOST,
      clientMode: GATEWAY_CLIENT_MODES.NODE,
    });

    let controlWs: WebSocket | undefined;
    let nodeClient: Awaited<ReturnType<typeof connectGatewayClient>> | undefined;
    try {
      controlWs = await openTrackedWs(started.port);
      await connectOk(controlWs, { token: "secret" });

      const initialApproval = await requestNodePairing({
        nodeId: pairedNode.identity.deviceId,
        platform: "darwin",
      });
      await approveNodePairing(initialApproval.request.requestId, {
        callerScopes: ["operator.pairing"],
      });

      nodeClient = await connectNodeClient({
        port: started.port,
        deviceIdentity: pairedNode.identity,
        commands: ["canvas.snapshot", "system.run"],
      });

      const deadline = Date.now() + 2_000;
      let lastNodes: Array<{ nodeId: string; connected?: boolean; commands?: string[] }> = [];
      while (Date.now() < deadline) {
        const list = await rpcReq<{
          nodes?: Array<{ nodeId: string; connected?: boolean; commands?: string[] }>;
        }>(controlWs, "node.list", {});
        lastNodes = list.payload?.nodes ?? [];
        const node = lastNodes.find(
          (entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected,
        );
        if (
          JSON.stringify(node?.commands?.toSorted() ?? []) ===
          JSON.stringify(["canvas.snapshot", "system.run"])
        ) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      const repairedNode = lastNodes.find(
        (entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected,
      );
      expect(repairedNode?.commands?.toSorted(), JSON.stringify(lastNodes)).toEqual([
        "canvas.snapshot",
        "system.run",
      ]);

      await expect(listNodePairing()).resolves.toEqual(
        expect.objectContaining({
          pending: [],
        }),
      );
    } finally {
      controlWs?.close();
      await nodeClient?.stopAndWait();
      started.ws.close();
      await started.server.close();
      started.envSnapshot.restore();
    }
=======
async function expectRePairingRequest(params: {
  started: Awaited<ReturnType<typeof startServerWithClient>>;
  pairedName: string;
  initialCommands?: string[];
  reconnectCommands: string[];
  approvalScopes: string[];
  expectedVisibleCommands: string[];
}) {
  const pairedNode = await pairDeviceIdentity({
    name: params.pairedName,
    role: "node",
    scopes: [],
    clientId: GATEWAY_CLIENT_NAMES.NODE_HOST,
    clientMode: GATEWAY_CLIENT_MODES.NODE,
  });

  let controlWs: WebSocket | undefined;
  let firstClient: Awaited<ReturnType<typeof connectGatewayClient>> | undefined;
  let nodeClient: Awaited<ReturnType<typeof connectGatewayClient>> | undefined;
  try {
    controlWs = await openTrackedWs(params.started.port);
    await connectOk(controlWs, { token: "secret" });

    if (params.initialCommands) {
      firstClient = await connectNodeClient({
        port: params.started.port,
        deviceIdentity: pairedNode.identity,
        commands: params.initialCommands,
      });
      await firstClient.stopAndWait();
    }

    const request = await requestNodePairing({
      nodeId: pairedNode.identity.deviceId,
      platform: "macos",
      deviceFamily: "Mac",
      ...(params.initialCommands ? { commands: params.initialCommands } : {}),
    });
    await approveNodePairing(request.request.requestId, {
      callerScopes: params.approvalScopes,
    });

    nodeClient = await connectNodeClient({
      port: params.started.port,
      deviceIdentity: pairedNode.identity,
      commands: params.reconnectCommands,
    });
    const connectedControlWs = controlWs;

    let lastNodes: Array<{ nodeId: string; connected?: boolean; commands?: string[] }> = [];
    await vi.waitFor(async () => {
      const list = await rpcReq<{
        nodes?: Array<{ nodeId: string; connected?: boolean; commands?: string[] }>;
      }>(connectedControlWs, "node.list", {});
      lastNodes = list.payload?.nodes ?? [];
      const node = lastNodes.find(
        (entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected,
      );
      if (
        JSON.stringify(node?.commands?.toSorted() ?? []) ===
        JSON.stringify(params.expectedVisibleCommands)
      ) {
        return;
      }
      throw new Error(`node commands not visible yet: ${JSON.stringify(lastNodes)}`);
    });

    expect(
      lastNodes
        .find((entry) => entry.nodeId === pairedNode.identity.deviceId && entry.connected)
        ?.commands?.toSorted(),
      JSON.stringify(lastNodes),
    ).toEqual(params.expectedVisibleCommands);

    const pairing = await listNodePairing();
    const pending = pairing.pending?.find((entry) => entry.nodeId === pairedNode.identity.deviceId);
    expect(pending?.nodeId).toBe(pairedNode.identity.deviceId);
    expect(pending?.commands).toEqual(params.reconnectCommands);
  } finally {
    controlWs?.close();
    await firstClient?.stopAndWait();
    await nodeClient?.stopAndWait();
  }
}

async function expectRpcNodePairingApprovalRejected(params: {
  started: Awaited<ReturnType<typeof startServerWithClient>>;
  operatorScopes: string[];
  operatorName: string;
  nodeId: string;
  expectedMessage: string;
}): Promise<void> {
  const ws = await openTrackedWs(params.started.port);
  try {
    await connectOk(ws, {
      token: "secret",
      scopes: params.operatorScopes,
      deviceIdentityPath: `${await makeNodePairingStateDir()}/${params.operatorName}.json`,
    });
    const request = await requestNodePairing({
      nodeId: params.nodeId,
      platform: "macos",
      deviceFamily: "Mac",
      commands: ["system.run"],
    });

    const approve = await rpcReq(ws, "node.pair.approve", {
      requestId: request.request.requestId,
    });

    expect(approve.ok).toBe(false);
    expect(approve.error?.message).toContain(params.expectedMessage);
    await expect(getPairedNode(params.nodeId)).resolves.toBeNull();
  } finally {
    ws.close();
  }
}

function describeWithGatewayServer(
  name: string,
  defineTests: (getStarted: () => Awaited<ReturnType<typeof startServerWithClient>>) => void,
): void {
  describe(name, () => {
    let started: Awaited<ReturnType<typeof startServerWithClient>> | undefined;

    beforeAll(async () => {
      started = await startServerWithClient("secret");
    });

    afterAll(async () => {
      started?.ws.close();
      await started?.server.close();
      started?.envSnapshot.restore();
    });

    defineTests(() => {
      if (!started) {
        throw new Error("gateway test server was not started");
      }
      return started;
    });
  });
}

describe("gateway node pairing authorization", () => {
  beforeAll(async () => {
    await tempDirs.setup();
  });

  afterAll(async () => {
    await tempDirs.cleanup();
  });

  describe("approval scopes", () => {
    test("rejects node pairing approval without admin scope", async () => {
      const baseDir = await makeNodePairingStateDir();
      const request = await requestNodePairing(
        {
          nodeId: "node-approve-reject-admin",
          platform: "macos",
          deviceFamily: "Mac",
          commands: ["system.run"],
        },
        baseDir,
      );

      await expect(
        approveNodePairing(
          request.request.requestId,
          { callerScopes: ["operator.pairing"] },
          baseDir,
        ),
      ).resolves.toEqual({
        status: "forbidden",
        missingScope: "operator.admin",
      });
      await expect(getPairedNode("node-approve-reject-admin", baseDir)).resolves.toBeNull();
    });

    test("rejects node pairing approval without pairing scope", async () => {
      const baseDir = await makeNodePairingStateDir();
      const request = await requestNodePairing(
        {
          nodeId: "node-approve-reject-pairing",
          platform: "macos",
          deviceFamily: "Mac",
          commands: ["system.run"],
        },
        baseDir,
      );

      await expect(
        approveNodePairing(
          request.request.requestId,
          { callerScopes: ["operator.write"] },
          baseDir,
        ),
      ).resolves.toEqual({
        status: "forbidden",
        missingScope: "operator.pairing",
      });
      await expect(getPairedNode("node-approve-reject-pairing", baseDir)).resolves.toBeNull();
    });

    test("approves commandless node pairing with pairing scope", async () => {
      const baseDir = await makeNodePairingStateDir();
      const request = await requestNodePairing(
        {
          nodeId: "node-approve-target",
          platform: "macos",
          deviceFamily: "Mac",
        },
        baseDir,
      );

      const approved = requireApprovedPairing(
        await approveNodePairing(
          request.request.requestId,
          { callerScopes: ["operator.pairing"] },
          baseDir,
        ),
      );
      expect(approved.requestId).toBe(request.request.requestId);
      expect(approved.node.nodeId).toBe("node-approve-target");

      const pairedNode = await getPairedNode("node-approve-target", baseDir);
      expect(pairedNode?.nodeId).toBe("node-approve-target");
    });
  });

  describeWithGatewayServer("rpc approval scopes", (getStarted) => {
    test("rejects system.run node pairing approval without admin scope through rpc", async () => {
      await expectRpcNodePairingApprovalRejected({
        started: getStarted(),
        operatorScopes: ["operator.pairing"],
        operatorName: "operator-pairing",
        nodeId: "node-rpc-approve-reject-admin",
        expectedMessage: "missing scope: operator.admin",
      });
    });

    test("rejects node pairing approval without pairing scope through rpc", async () => {
      await expectRpcNodePairingApprovalRejected({
        started: getStarted(),
        operatorScopes: ["operator.write"],
        operatorName: "operator-write",
        nodeId: "node-rpc-approve-reject-pairing",
        expectedMessage: "operator.pairing",
      });
    });
  });

  describeWithGatewayServer("paired node reconnects", (getStarted) => {
    test("requests re-pairing when a paired node reconnects with upgraded commands", async () => {
      await expectRePairingRequest({
        started: getStarted(),
        pairedName: "node-command-pin",
        initialCommands: ["screen.snapshot"],
        reconnectCommands: ["screen.snapshot", "system.run"],
        approvalScopes: ["operator.pairing", "operator.write"],
        expectedVisibleCommands: ["screen.snapshot"],
      });
    });

    test("requests re-pairing when a commandless paired node reconnects with system.run", async () => {
      await expectRePairingRequest({
        started: getStarted(),
        pairedName: "node-command-empty",
        reconnectCommands: ["screen.snapshot", "system.run"],
        approvalScopes: ["operator.pairing"],
        expectedVisibleCommands: [],
      });
    });
>>>>>>> upstream/main
  });
});
