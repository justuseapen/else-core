<<<<<<< HEAD
=======
// Shared auth rotation tests cover token generation changes, connected client
// disconnects, device-token issuers, and secret-ref sourced gateway auth.
>>>>>>> upstream/main
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import {
<<<<<<< HEAD
=======
  loadGatewayConfig,
  openAuthenticatedGatewayWs,
  waitForGatewayWsClose,
} from "./shared-auth.test-helpers.js";
import {
>>>>>>> upstream/main
  connectOk,
  getFreePort,
  installGatewayTestHooks,
  rpcReq,
  startGatewayServer,
  testState,
  trackConnectChallengeNonce,
} from "./test-helpers.js";

installGatewayTestHooks({ scope: "suite" });

const ORIGINAL_GATEWAY_AUTH = testState.gatewayAuth;
const ORIGINAL_GATEWAY_TOKEN_ENV = process.env.OPENCLAW_GATEWAY_TOKEN;
const OLD_TOKEN = "shared-token-old";
const NEW_TOKEN = "shared-token-new";
const DEFERRED_RESTART_DELAY_MS = 1_000;
const SECRET_REF_TOKEN_ID = "OPENCLAW_SHARED_AUTH_ROTATION_SECRET_REF";

<<<<<<< HEAD
let server: Awaited<ReturnType<typeof startGatewayServer>>;
let port = 0;

beforeAll(async () => {
  port = await getFreePort();
  testState.gatewayAuth = { mode: "token", token: OLD_TOKEN };
  server = await startGatewayServer(port, { controlUiEnabled: true });
});

afterAll(async () => {
=======
let port = 0;

afterAll(() => {
>>>>>>> upstream/main
  testState.gatewayAuth = ORIGINAL_GATEWAY_AUTH;
  if (ORIGINAL_GATEWAY_TOKEN_ENV === undefined) {
    delete process.env.OPENCLAW_GATEWAY_TOKEN;
  } else {
    process.env.OPENCLAW_GATEWAY_TOKEN = ORIGINAL_GATEWAY_TOKEN_ENV;
  }
<<<<<<< HEAD
  await server.close();
});

async function openAuthenticatedWs(token: string): Promise<WebSocket> {
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  trackConnectChallengeNonce(ws);
  await new Promise<void>((resolve) => ws.once("open", resolve));
  await connectOk(ws, { token });
  return ws;
}

async function openDeviceTokenWs(): Promise<WebSocket> {
  const identityPath = path.join(os.tmpdir(), `openclaw-shared-auth-${process.pid}-${port}.json`);
  const { loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem } =
    await import("../infra/device-identity.js");
  const { approveDevicePairing, requestDevicePairing, rotateDeviceToken } =
    await import("../infra/device-pairing.js");
=======
});

async function openDeviceTokenWsWithDetails(
  params: { issuerGeneration?: string; browserClient?: boolean } = {},
): Promise<{
  ws: WebSocket;
  deviceId: string;
  hello: Awaited<ReturnType<typeof connectOk>> & {
    auth?: { deviceToken?: unknown };
  };
}> {
  const identityPath = path.join(os.tmpdir(), `openclaw-shared-auth-${process.pid}-${port}.json`);
  const { loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem } =
    await import("../infra/device-identity.js");
  const { approveDevicePairing, ensureDeviceToken, requestDevicePairing, rotateDeviceToken } =
    await import("../infra/device-pairing.js");
  const client = params.browserClient
    ? {
        id: "openclaw-control-ui",
        version: "1.0.0",
        platform: "test",
        mode: "webchat",
      }
    : {
        id: "test",
        version: "1.0.0",
        platform: "test",
        mode: "test",
      };
>>>>>>> upstream/main

  const identity = loadOrCreateDeviceIdentity(identityPath);
  const pending = await requestDevicePairing({
    deviceId: identity.deviceId,
    publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
<<<<<<< HEAD
    clientId: "test",
    clientMode: "test",
=======
    clientId: client.id,
    clientMode: client.mode,
>>>>>>> upstream/main
    role: "operator",
    scopes: ["operator.admin"],
  });
  await approveDevicePairing(pending.request.requestId, {
    callerScopes: ["operator.admin"],
  });
<<<<<<< HEAD
  const rotated = await rotateDeviceToken({
    deviceId: identity.deviceId,
    role: "operator",
    scopes: ["operator.admin"],
  });
  expect(rotated.ok).toBe(true);

  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  trackConnectChallengeNonce(ws);
  await new Promise<void>((resolve) => ws.once("open", resolve));
  await connectOk(ws, {
    skipDefaultAuth: true,
    deviceIdentityPath: identityPath,
    deviceToken: rotated.ok ? rotated.entry.token : "",
    scopes: ["operator.admin"],
  });
  return ws;
}

async function waitForClose(ws: WebSocket): Promise<{ code: number; reason: string }> {
  return await new Promise((resolve) => {
    ws.once("close", (code, reason) => {
      resolve({ code, reason: reason.toString() });
    });
  });
}

async function loadCurrentConfig(ws: WebSocket): Promise<{
  hash: string;
  config: Record<string, unknown>;
}> {
  const current = await rpcReq<{
    hash?: string;
    config?: Record<string, unknown>;
  }>(ws, "config.get", {});
  expect(current.ok).toBe(true);
  expect(typeof current.payload?.hash).toBe("string");
  return {
    hash: String(current.payload?.hash),
    config: structuredClone(current.payload?.config ?? {}),
  };
}

async function sendSharedTokenRotationPatch(ws: WebSocket): Promise<{ ok: boolean }> {
  const current = await loadCurrentConfig(ws);
=======
  let issuedDeviceToken;
  if (params.issuerGeneration) {
    const deviceToken = await ensureDeviceToken({
      deviceId: identity.deviceId,
      role: "operator",
      scopes: ["operator.admin"],
      issuer: {
        kind: "shared-gateway-auth",
        generation: params.issuerGeneration,
      },
    });
    expect(deviceToken?.token).toBeTypeOf("string");
    issuedDeviceToken = deviceToken?.token ?? "";
  } else {
    const rotated = await rotateDeviceToken({
      deviceId: identity.deviceId,
      role: "operator",
      scopes: ["operator.admin"],
    });
    expect(rotated.ok).toBe(true);
    issuedDeviceToken = rotated.ok ? rotated.entry.token : "";
  }

  const ws = new WebSocket(
    `ws://127.0.0.1:${port}`,
    params.browserClient ? { headers: { origin: `http://127.0.0.1:${port}` } } : undefined,
  );
  trackConnectChallengeNonce(ws);
  await new Promise<void>((resolve) => {
    ws.once("open", resolve);
  });
  const hello = (await connectOk(ws, {
    skipDefaultAuth: true,
    client,
    deviceIdentityPath: identityPath,
    deviceToken: issuedDeviceToken,
    scopes: ["operator.admin"],
  })) as Awaited<ReturnType<typeof connectOk>> & {
    auth?: { deviceToken?: unknown };
  };
  return { ws, deviceId: identity.deviceId, hello };
}

async function openDeviceTokenWs(params: { issuerGeneration?: string } = {}): Promise<WebSocket> {
  const { ws } = await openDeviceTokenWsWithDetails(params);
  return ws;
}

async function closeWsAndWait(ws: WebSocket, timeoutMs = 2_000): Promise<void> {
  if (ws.readyState === WebSocket.CLOSED) {
    return;
  }
  await new Promise<void>((resolve) => {
    const onClose = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      ws.off("close", onClose);
      resolve();
    }, timeoutMs);
    ws.once("close", onClose);
    try {
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    } catch {
      clearTimeout(timer);
      ws.off("close", onClose);
      resolve();
    }
  });
}

async function sendSharedTokenRotationPatch(ws: WebSocket): Promise<{ ok: boolean }> {
  const current = await loadGatewayConfig(ws);
>>>>>>> upstream/main
  return await rpcReq(ws, "config.patch", {
    baseHash: current.hash,
    raw: JSON.stringify({ gateway: { auth: { token: NEW_TOKEN } } }),
    restartDelayMs: DEFERRED_RESTART_DELAY_MS,
  });
}

async function applyCurrentConfig(ws: WebSocket) {
<<<<<<< HEAD
  const current = await loadCurrentConfig(ws);
=======
  const current = await loadGatewayConfig(ws);
>>>>>>> upstream/main
  return await rpcReq(ws, "config.apply", {
    baseHash: current.hash,
    raw: JSON.stringify(current.config, null, 2),
  });
}

<<<<<<< HEAD
describe("gateway shared auth rotation", () => {
=======
async function expectGatewayAuthChangedClose(closed: ReturnType<typeof waitForGatewayWsClose>) {
  await expect(closed).resolves.toEqual({
    code: 4001,
    reason: "gateway auth changed",
  });
}

async function resolveRequiredSharedGatewayGeneration() {
  const { resolveSharedGatewaySessionGeneration } =
    await import("./server/ws-shared-generation.js");
  const issuerGeneration = resolveSharedGatewaySessionGeneration({
    mode: "token",
    token: OLD_TOKEN,
    allowTailscale: false,
  });
  expect(issuerGeneration).toBeTypeOf("string");
  if (!issuerGeneration) {
    throw new Error("expected shared gateway generation");
  }
  return issuerGeneration;
}

function requireHelloDeviceToken(
  hello: Awaited<ReturnType<typeof openDeviceTokenWsWithDetails>>["hello"],
) {
  const helloDeviceToken = hello.auth?.deviceToken;
  if (typeof helloDeviceToken !== "string") {
    throw new Error("expected hello device token");
  }
  return helloDeviceToken;
}

async function expectIssuerTaggedDeviceToken(params: {
  deviceId: string;
  token: string;
  issuerGeneration: string;
}) {
  const { getPairedDevice, verifyDeviceToken } = await import("../infra/device-pairing.js");
  const paired = await getPairedDevice(params.deviceId);
  expect(paired?.tokens?.operator?.issuer).toEqual({
    kind: "shared-gateway-auth",
    generation: params.issuerGeneration,
  });
  await expect(
    verifyDeviceToken({
      deviceId: params.deviceId,
      token: params.token,
      role: "operator",
      scopes: ["operator.admin"],
      requiredSharedGatewaySessionGeneration: params.issuerGeneration,
    }),
  ).resolves.toEqual({
    ok: true,
    issuer: {
      kind: "shared-gateway-auth",
      generation: params.issuerGeneration,
    },
  });
}

async function expectIssuerMetadataPreservedOnReconnect(params: { browserClient?: boolean } = {}) {
  const issuerGeneration = await resolveRequiredSharedGatewayGeneration();
  const { ws, deviceId, hello } = await openDeviceTokenWsWithDetails({
    issuerGeneration,
    browserClient: params.browserClient,
  });
  try {
    await expectIssuerTaggedDeviceToken({
      deviceId,
      token: requireHelloDeviceToken(hello),
      issuerGeneration,
    });
  } finally {
    await closeWsAndWait(ws);
  }
}

describe("gateway shared auth rotation", () => {
  let server: Awaited<ReturnType<typeof startGatewayServer>>;
  let sharedTokenRotationCase: {
    closed: Awaited<ReturnType<typeof waitForGatewayWsClose>>;
    ok: boolean;
  };

  beforeAll(async () => {
    port = await getFreePort();
    testState.gatewayAuth = { mode: "token", token: OLD_TOKEN };
    server = await startGatewayServer(port, { controlUiEnabled: true });

    const ws = await openAuthenticatedGatewayWs(port, OLD_TOKEN);
    try {
      const closed = waitForGatewayWsClose(ws);
      const res = await sendSharedTokenRotationPatch(ws);
      sharedTokenRotationCase = {
        closed: await closed,
        ok: res.ok,
      };
    } finally {
      await closeWsAndWait(ws);
    }
  });

>>>>>>> upstream/main
  beforeEach(() => {
    testState.gatewayAuth = { mode: "token", token: OLD_TOKEN };
  });

<<<<<<< HEAD
  it("disconnects existing shared-token websocket sessions after config.patch rotates auth", async () => {
    const ws = await openAuthenticatedWs(OLD_TOKEN);
    try {
      const closed = waitForClose(ws);
      const res = await sendSharedTokenRotationPatch(ws);

      expect(res.ok).toBe(true);
      await expect(closed).resolves.toMatchObject({
        code: 4001,
        reason: "gateway auth changed",
      });
    } finally {
      ws.close();
    }
=======
  afterAll(async () => {
    await server.close();
  });

  it("disconnects existing shared-token websocket sessions after config.patch rotates auth", async () => {
    expect(sharedTokenRotationCase.ok).toBe(true);
    expect(sharedTokenRotationCase.closed).toEqual({
      code: 4001,
      reason: "gateway auth changed",
    });
>>>>>>> upstream/main
  });

  it("keeps existing device-token websocket sessions connected after shared token rotation", async () => {
    const ws = await openDeviceTokenWs();
    try {
      const res = await sendSharedTokenRotationPatch(ws);
      expect(res.ok).toBe(true);

      const followUp = await rpcReq<{ hash?: string }>(ws, "config.get", {});
      expect(followUp.ok).toBe(true);
      expect(typeof followUp.payload?.hash).toBe("string");
    } finally {
<<<<<<< HEAD
      ws.close();
    }
  });
=======
      await closeWsAndWait(ws);
    }
  });

  it("disconnects issuer-tagged device-token websocket sessions after shared token rotation", async () => {
    const issuerGeneration = await resolveRequiredSharedGatewayGeneration();
    const ws = await openDeviceTokenWs({
      issuerGeneration,
    });
    try {
      const closed = waitForGatewayWsClose(ws);
      const res = await sendSharedTokenRotationPatch(ws);

      expect(res.ok).toBe(true);
      await expectGatewayAuthChangedClose(closed);
    } finally {
      await closeWsAndWait(ws);
    }
  });

  it("preserves issuer-tagged browser device tokens on reconnect", async () => {
    await expectIssuerMetadataPreservedOnReconnect({ browserClient: true });
  });

  it("keeps issuer metadata when tagged device tokens reconnect through non-browser clients", async () => {
    await expectIssuerMetadataPreservedOnReconnect();
  });
>>>>>>> upstream/main
});

describe("gateway shared auth rotation with unchanged SecretRefs", () => {
  let secretRefServer: Awaited<ReturnType<typeof startGatewayServer>>;
  let secretRefPort = 0;

  beforeAll(async () => {
    const configPath = process.env.OPENCLAW_CONFIG_PATH;
    if (!configPath) {
      throw new Error("OPENCLAW_CONFIG_PATH missing in gateway test environment");
    }
    secretRefPort = await getFreePort();
<<<<<<< HEAD
=======
    testState.gatewayAuth = undefined;
>>>>>>> upstream/main
    process.env[SECRET_REF_TOKEN_ID] = OLD_TOKEN;
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(
      configPath,
      `${JSON.stringify(
        {
          gateway: {
            auth: {
              mode: "token",
              token: { source: "env", provider: "default", id: SECRET_REF_TOKEN_ID },
            },
          },
        },
        null,
        2,
      )}\n`,
      "utf-8",
    );
    secretRefServer = await startGatewayServer(secretRefPort, { controlUiEnabled: true });
  });

  beforeEach(() => {
<<<<<<< HEAD
=======
    testState.gatewayAuth = undefined;
>>>>>>> upstream/main
    process.env[SECRET_REF_TOKEN_ID] = OLD_TOKEN;
  });

  afterAll(async () => {
    delete process.env[SECRET_REF_TOKEN_ID];
    testState.gatewayAuth = ORIGINAL_GATEWAY_AUTH;
    await secretRefServer.close();
  });

  async function openSecretRefAuthenticatedWs(): Promise<WebSocket> {
<<<<<<< HEAD
    const ws = new WebSocket(`ws://127.0.0.1:${secretRefPort}`);
    trackConnectChallengeNonce(ws);
    await new Promise<void>((resolve) => ws.once("open", resolve));
    await connectOk(ws, { token: OLD_TOKEN });
    return ws;
  }

  it("keeps shared-auth websocket sessions connected when config.apply reapplies an unchanged SecretRef token", async () => {
    const ws = await openSecretRefAuthenticatedWs();
    try {
      const res = await applyCurrentConfig(ws);
      expect(res.ok).toBe(true);

      const followUp = await rpcReq<{ hash?: string }>(ws, "config.get", {});
      expect(followUp.ok).toBe(true);
      expect(typeof followUp.payload?.hash).toBe("string");
    } finally {
      ws.close();
=======
    return openAuthenticatedGatewayWs(secretRefPort, OLD_TOKEN);
  }

  it("disconnects shared-auth websocket sessions when config.apply rewrites a SecretRef token", async () => {
    const ws = await openSecretRefAuthenticatedWs();
    try {
      const closed = waitForGatewayWsClose(ws, 30_000);
      process.env[SECRET_REF_TOKEN_ID] = NEW_TOKEN;
      const res = await applyCurrentConfig(ws);
      expect(res.ok).toBe(true);
      await expectGatewayAuthChangedClose(closed);
    } finally {
      await closeWsAndWait(ws);
>>>>>>> upstream/main
    }
  });
});
