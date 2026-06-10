<<<<<<< HEAD
=======
/**
 * Gateway node catalog regression tests.
 */
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import {
  createKnownNodeCatalog,
  getKnownNode,
  getKnownNodeEntry,
  listKnownNodes,
} from "./node-catalog.js";

<<<<<<< HEAD
=======
type CatalogInput = Parameters<typeof createKnownNodeCatalog>[0];
type TestPairedDevice = CatalogInput["pairedDevices"][number];
type TestPairedNode = NonNullable<CatalogInput["pairedNodes"]>[number];

function pairedDevice(overrides: Partial<TestPairedDevice> = {}): TestPairedDevice {
  return {
    deviceId: "mac-1",
    publicKey: "public-key",
    displayName: "Mac",
    clientId: "openclaw-macos",
    clientMode: "node",
    role: "node",
    roles: ["node"],
    tokens: {
      node: {
        token: "current-token",
        role: "node",
        scopes: [],
        createdAtMs: 1,
      },
    },
    createdAtMs: 1,
    approvedAtMs: 99,
    ...overrides,
  };
}

function pairedNode(overrides: Partial<TestPairedNode> = {}): TestPairedNode {
  return {
    nodeId: "mac-1",
    token: "node-token",
    platform: "macos",
    caps: ["camera"],
    commands: ["system.run"],
    createdAtMs: 1,
    approvedAtMs: 100,
    ...overrides,
  };
}

>>>>>>> upstream/main
describe("gateway/node-catalog", () => {
  it("filters paired nodes by active node token instead of sticky historical roles", () => {
    const catalog = createKnownNodeCatalog({
      pairedDevices: [
<<<<<<< HEAD
        {
          deviceId: "legacy-mac",
          publicKey: "legacy-public-key",
          displayName: "Peter's Mac Studio",
          clientId: "clawdbot-macos",
          role: "node",
          roles: ["node"],
=======
        pairedDevice({
          deviceId: "legacy-mac",
          displayName: "Peter's Mac Studio",
          clientId: "clawdbot-macos",
>>>>>>> upstream/main
          tokens: {
            node: {
              token: "legacy-token",
              role: "node",
              scopes: [],
              createdAtMs: 1,
              revokedAtMs: 2,
            },
          },
<<<<<<< HEAD
          createdAtMs: 1,
          approvedAtMs: 1,
        },
        {
          deviceId: "current-mac",
          publicKey: "current-public-key",
          displayName: "Peter's Mac Studio",
          clientId: "openclaw-macos",
          role: "node",
          roles: ["node"],
          tokens: {
            node: {
              token: "current-token",
              role: "node",
              scopes: [],
              createdAtMs: 1,
            },
          },
          createdAtMs: 1,
          approvedAtMs: 1,
        },
=======
          approvedAtMs: 1,
        }),
        pairedDevice({
          deviceId: "current-mac",
          displayName: "Peter's Mac Studio",
          approvedAtMs: 1,
        }),
>>>>>>> upstream/main
      ],
      pairedNodes: [],
      connectedNodes: [],
    });

    expect(listKnownNodes(catalog).map((node) => node.nodeId)).toEqual(["current-mac"]);
  });

  it("builds one merged node view for paired and live state", () => {
    const connectedAtMs = 123;
    const catalog = createKnownNodeCatalog({
      pairedDevices: [
<<<<<<< HEAD
        {
          deviceId: "mac-1",
          publicKey: "public-key",
          displayName: "Mac",
          clientId: "openclaw-macos",
          clientMode: "node",
          role: "node",
          roles: ["node"],
          remoteIp: "100.0.0.10",
          tokens: {
            node: {
              token: "current-token",
              role: "node",
              scopes: [],
              createdAtMs: 1,
            },
          },
          createdAtMs: 1,
          approvedAtMs: 99,
        },
      ],
      pairedNodes: [
        {
          nodeId: "mac-1",
          token: "node-token",
          displayName: "Mac",
          platform: "darwin",
=======
        pairedDevice({
          remoteIp: "100.0.0.10",
        }),
      ],
      pairedNodes: [
        pairedNode({
          displayName: "Mac",
>>>>>>> upstream/main
          version: "1.2.0",
          coreVersion: "1.2.0",
          uiVersion: "1.2.0",
          remoteIp: "100.0.0.9",
<<<<<<< HEAD
          caps: ["camera"],
          commands: ["system.run"],
          createdAtMs: 1,
          approvedAtMs: 100,
        },
=======
          approvedAtMs: 100,
        }),
>>>>>>> upstream/main
      ],
      connectedNodes: [
        {
          nodeId: "mac-1",
          connId: "conn-1",
          client: {} as never,
          clientId: "openclaw-macos",
          clientMode: "node",
          displayName: "Mac",
<<<<<<< HEAD
          platform: "darwin",
          version: "1.2.3",
          caps: ["camera", "screen"],
=======
          platform: "macos",
          version: "1.2.3",
          declaredCaps: ["camera", "screen"],
          caps: ["camera", "screen"],
          declaredCommands: ["screen.snapshot", "system.run"],
>>>>>>> upstream/main
          commands: ["screen.snapshot", "system.run"],
          remoteIp: "100.0.0.11",
          pathEnv: "/usr/bin:/bin",
          connectedAtMs,
        },
      ],
    });

    const entry = getKnownNodeEntry(catalog, "mac-1");
<<<<<<< HEAD
    expect(entry?.nodePairing).toEqual(
      expect.objectContaining({
        commands: ["system.run"],
        caps: ["camera"],
        approvedAtMs: 100,
      }),
    );
    expect(getKnownNode(catalog, "mac-1")).toEqual(
      expect.objectContaining({
        nodeId: "mac-1",
        displayName: "Mac",
        clientId: "openclaw-macos",
        clientMode: "node",
        remoteIp: "100.0.0.11",
        caps: ["camera", "screen"],
        commands: ["screen.snapshot", "system.run"],
        pathEnv: "/usr/bin:/bin",
        approvedAtMs: 100,
        connectedAtMs,
        paired: true,
        connected: true,
      }),
    );
=======
    expect(entry?.nodePairing?.commands).toEqual(["system.run"]);
    expect(entry?.nodePairing?.caps).toEqual(["camera"]);
    expect(entry?.nodePairing?.approvedAtMs).toBe(100);
    const node = getKnownNode(catalog, "mac-1");
    expect(node?.nodeId).toBe("mac-1");
    expect(node?.displayName).toBe("Mac");
    expect(node?.clientId).toBe("openclaw-macos");
    expect(node?.clientMode).toBe("node");
    expect(node?.remoteIp).toBe("100.0.0.11");
    expect(node?.caps).toEqual(["camera", "screen"]);
    expect(node?.commands).toEqual(["screen.snapshot", "system.run"]);
    expect(node?.pathEnv).toBe("/usr/bin:/bin");
    expect(node?.approvedAtMs).toBe(100);
    expect(node?.connectedAtMs).toBe(connectedAtMs);
    expect(node?.lastSeenAtMs).toBe(connectedAtMs);
    expect(node?.lastSeenReason).toBe("connect");
    expect(node?.paired).toBe(true);
    expect(node?.connected).toBe(true);
>>>>>>> upstream/main
  });

  it("surfaces node-pair metadata even when the node is offline", () => {
    const catalog = createKnownNodeCatalog({
<<<<<<< HEAD
      pairedDevices: [
        {
          deviceId: "mac-1",
          publicKey: "public-key",
          displayName: "Mac",
          clientId: "openclaw-macos",
          clientMode: "node",
          role: "node",
          roles: ["node"],
          tokens: {
            node: {
              token: "current-token",
              role: "node",
              scopes: [],
              createdAtMs: 1,
            },
          },
          createdAtMs: 1,
          approvedAtMs: 99,
        },
      ],
      pairedNodes: [
        {
          nodeId: "mac-1",
          token: "node-token",
          platform: "darwin",
          caps: ["system"],
          commands: ["system.run"],
          createdAtMs: 1,
          approvedAtMs: 123,
        },
=======
      pairedDevices: [pairedDevice()],
      pairedNodes: [
        pairedNode({
          caps: ["system"],
          lastSeenAtMs: 456,
          lastSeenReason: "silent_push",
          approvedAtMs: 123,
        }),
>>>>>>> upstream/main
      ],
      connectedNodes: [],
    });

    const entry = getKnownNodeEntry(catalog, "mac-1");
    expect(entry?.live).toBeUndefined();
<<<<<<< HEAD
    expect(entry?.nodePairing).toEqual(
      expect.objectContaining({
        commands: ["system.run"],
        caps: ["system"],
        approvedAtMs: 123,
      }),
    );
    expect(getKnownNode(catalog, "mac-1")).toEqual(
      expect.objectContaining({
        nodeId: "mac-1",
        caps: ["system"],
        commands: ["system.run"],
        approvedAtMs: 123,
        paired: true,
        connected: false,
      }),
    );
=======
    expect(entry?.nodePairing?.commands).toEqual(["system.run"]);
    expect(entry?.nodePairing?.caps).toEqual(["system"]);
    expect(entry?.nodePairing?.approvedAtMs).toBe(123);
    const node = getKnownNode(catalog, "mac-1");
    expect(node?.nodeId).toBe("mac-1");
    expect(node?.caps).toEqual(["system"]);
    expect(node?.commands).toEqual(["system.run"]);
    expect(node?.approvedAtMs).toBe(123);
    expect(node?.lastSeenAtMs).toBe(456);
    expect(node?.lastSeenReason).toBe("silent_push");
    expect(node?.paired).toBe(true);
    expect(node?.connected).toBe(false);
  });

  it("uses the newest durable last-seen source for offline nodes", () => {
    const catalog = createKnownNodeCatalog({
      pairedDevices: [
        pairedDevice({
          deviceId: "ios-1",
          displayName: "iPhone",
          lastSeenAtMs: 300,
          lastSeenReason: "silent_push",
          approvedAtMs: 10,
        }),
      ],
      pairedNodes: [
        pairedNode({
          nodeId: "ios-1",
          platform: "ios",
          caps: [],
          commands: [],
          lastConnectedAtMs: 200,
          lastSeenAtMs: 100,
          lastSeenReason: "bg_app_refresh",
          approvedAtMs: 11,
        }),
      ],
      connectedNodes: [],
    });

    const node = getKnownNode(catalog, "ios-1");
    expect(node?.lastSeenAtMs).toBe(300);
    expect(node?.lastSeenReason).toBe("silent_push");
>>>>>>> upstream/main
  });

  it("prefers the live command surface for connected nodes", () => {
    const catalog = createKnownNodeCatalog({
      pairedDevices: [],
      pairedNodes: [
<<<<<<< HEAD
        {
          nodeId: "mac-1",
          token: "node-token",
          platform: "darwin",
          caps: ["system"],
          commands: ["system.run"],
          createdAtMs: 1,
          approvedAtMs: 123,
        },
=======
        pairedNode({
          caps: ["system"],
          approvedAtMs: 123,
        }),
>>>>>>> upstream/main
      ],
      connectedNodes: [
        {
          nodeId: "mac-1",
          connId: "conn-1",
          client: {} as never,
          displayName: "Mac",
<<<<<<< HEAD
          platform: "darwin",
          caps: ["canvas"],
=======
          platform: "macos",
          declaredCaps: ["canvas"],
          caps: ["canvas"],
          declaredCommands: ["canvas.snapshot"],
>>>>>>> upstream/main
          commands: ["canvas.snapshot"],
          connectedAtMs: 1,
        },
      ],
    });

<<<<<<< HEAD
    expect(getKnownNode(catalog, "mac-1")).toEqual(
      expect.objectContaining({
        caps: ["canvas"],
        commands: ["canvas.snapshot"],
        connected: true,
      }),
    );
=======
    const node = getKnownNode(catalog, "mac-1");
    expect(node?.caps).toEqual(["canvas"]);
    expect(node?.commands).toEqual(["canvas.snapshot"]);
    expect(node?.connected).toBe(true);
  });

  it("ignores malformed node capability entries instead of throwing", () => {
    const catalog = createKnownNodeCatalog({
      pairedDevices: [],
      pairedNodes: [],
      connectedNodes: [
        {
          nodeId: "bad-node",
          connId: "conn-1",
          client: {} as never,
          displayName: "Bad Node",
          caps: ["camera", undefined],
          commands: ["system.run", null],
          connectedAtMs: 1,
        } as never,
      ],
    });

    const nodes = listKnownNodes(catalog);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.nodeId).toBe("bad-node");
    expect(nodes[0]?.caps).toEqual(["camera"]);
    expect(nodes[0]?.commands).toEqual(["system.run"]);
>>>>>>> upstream/main
  });
});
