<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";

const listDevicePairingMock = vi.fn();
const loadApnsRegistrationMock = vi.fn();
=======
/**
 * Tests iOS push notification dispatch for exec approval requests.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExecApprovalRequest, ExecApprovalResolved } from "../infra/exec-approvals.js";
import { createDeferred } from "./test-helpers.deferred.js";

const listDevicePairingMock = vi.fn();
const loadApnsRegistrationMock = vi.fn();
const loadApnsRegistrationsMock = vi.fn();
>>>>>>> upstream/main
const resolveApnsAuthConfigFromEnvMock = vi.fn();
const resolveApnsRelayConfigFromEnvMock = vi.fn();
const sendApnsExecApprovalAlertMock = vi.fn();
const sendApnsExecApprovalResolvedWakeMock = vi.fn();
<<<<<<< HEAD

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

vi.mock("../config/config.js", () => ({
  loadConfig: () => ({ gateway: {} }),
=======
let createExecApprovalIosPushDelivery: typeof import("./exec-approval-ios-push.js").createExecApprovalIosPushDelivery;

function apnsRegistration(nodeId = "ios-device-1") {
  return {
    nodeId,
    transport: "direct",
    token: "apns-token",
    topic: "ai.openclaw.ios.test",
    environment: "sandbox",
    updatedAtMs: 1,
  };
}

function successfulApnsPushResult() {
  return {
    ok: true,
    status: 200,
    environment: "sandbox",
    topic: "ai.openclaw.ios.test",
    tokenSuffix: "token",
    transport: "direct",
  };
}

function resolvedApnsAuthConfig() {
  return {
    ok: true,
    value: { teamId: "team", keyId: "key", privateKey: "private-key" },
  };
}

function approvalRequest(id: string): ExecApprovalRequest {
  return {
    id,
    request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
    createdAtMs: 1,
    expiresAtMs: 2,
  };
}

function approvalResolved(id: string): ExecApprovalResolved {
  return {
    id,
    decision: "allow-once",
    ts: 1,
  };
}

function pairedIosOperator(options: {
  deviceId?: string;
  publicKey?: string;
  platform?: string;
  approvedAtMs?: number;
  scopes: string[];
  approvedScopes?: string[];
  token?: string;
}) {
  const deviceId = options.deviceId ?? "ios-device-1";
  return {
    deviceId,
    publicKey: options.publicKey ?? "pub",
    platform: options.platform ?? "iOS 18",
    role: "operator",
    roles: ["operator"],
    approvedScopes: options.approvedScopes,
    createdAtMs: 1,
    approvedAtMs: options.approvedAtMs ?? 1,
    tokens: {
      operator: {
        token: options.token ?? "operator-token",
        role: "operator",
        scopes: options.scopes,
        createdAtMs: 1,
      },
    },
  };
}

function mockPairedIosOperators(...paired: ReturnType<typeof pairedIosOperator>[]) {
  listDevicePairingMock.mockResolvedValue({
    pending: [],
    paired,
  });
}

function mockPairedIosOperator(scopes: string[]) {
  mockPairedIosOperators(pairedIosOperator({ scopes }));
}

vi.mock("../config/config.js", () => ({
  getRuntimeConfig: () => ({ gateway: {} }),
>>>>>>> upstream/main
}));

vi.mock("../infra/device-pairing.js", async () => {
  const actual = await vi.importActual<typeof import("../infra/device-pairing.js")>(
    "../infra/device-pairing.js",
  );
  return {
    ...actual,
    listDevicePairing: listDevicePairingMock,
  };
});

vi.mock("../infra/push-apns.js", () => ({
  loadApnsRegistration: loadApnsRegistrationMock,
<<<<<<< HEAD
=======
  loadApnsRegistrations: loadApnsRegistrationsMock,
>>>>>>> upstream/main
  resolveApnsAuthConfigFromEnv: resolveApnsAuthConfigFromEnvMock,
  resolveApnsRelayConfigFromEnv: resolveApnsRelayConfigFromEnvMock,
  sendApnsExecApprovalAlert: sendApnsExecApprovalAlertMock,
  sendApnsExecApprovalResolvedWake: sendApnsExecApprovalResolvedWakeMock,
  clearApnsRegistrationIfCurrent: vi.fn(),
  shouldClearStoredApnsRegistration: vi.fn(() => false),
}));

describe("createExecApprovalIosPushDelivery", () => {
<<<<<<< HEAD
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    listDevicePairingMock.mockResolvedValue({ pending: [], paired: [] });
    loadApnsRegistrationMock.mockResolvedValue({
      nodeId: "ios-device-1",
      transport: "direct",
      token: "apns-token",
      topic: "ai.openclaw.ios.test",
      environment: "sandbox",
      updatedAtMs: 1,
    });
    resolveApnsAuthConfigFromEnvMock.mockResolvedValue({
      ok: true,
      value: { teamId: "team", keyId: "key", privateKey: "private-key" },
    });
    resolveApnsRelayConfigFromEnvMock.mockReturnValue({ ok: false, error: "unused" });
    sendApnsExecApprovalAlertMock.mockResolvedValue({
      ok: true,
      status: 200,
      environment: "sandbox",
      topic: "ai.openclaw.ios.test",
      tokenSuffix: "token",
      transport: "direct",
    });
    sendApnsExecApprovalResolvedWakeMock.mockResolvedValue({
      ok: true,
      status: 200,
      environment: "sandbox",
      topic: "ai.openclaw.ios.test",
      tokenSuffix: "token",
      transport: "direct",
    });
  });

  it("does not target iOS devices whose active operator token lacks operator.approvals", async () => {
    listDevicePairingMock.mockResolvedValue({
      pending: [],
      paired: [
        {
          deviceId: "ios-device-1",
          publicKey: "pub",
          platform: "iOS 18",
          role: "operator",
          roles: ["operator"],
          approvedScopes: ["operator.approvals"],
          createdAtMs: 1,
          approvedAtMs: 1,
          tokens: {
            operator: {
              token: "operator-token",
              role: "operator",
              scopes: ["operator.read"],
              createdAtMs: 1,
            },
          },
        },
      ],
    });

    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const accepted = await delivery.handleRequested({
      id: "approval-1",
      request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
      createdAtMs: 1,
      expiresAtMs: 2,
    });

    expect(accepted).toBe(false);
    expect(loadApnsRegistrationMock).not.toHaveBeenCalled();
=======
  beforeAll(async () => {
    ({ createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js"));
  });

  beforeEach(() => {
    vi.clearAllMocks();
    listDevicePairingMock.mockResolvedValue({ pending: [], paired: [] });
    loadApnsRegistrationMock.mockResolvedValue(apnsRegistration());
    loadApnsRegistrationsMock.mockImplementation(async (nodeIds: readonly string[]) => {
      const registrations = [];
      for (const nodeId of nodeIds) {
        const registration = await loadApnsRegistrationMock(nodeId);
        if (registration) {
          registrations.push({ nodeId, registration });
        }
      }
      return registrations;
    });
    resolveApnsAuthConfigFromEnvMock.mockResolvedValue(resolvedApnsAuthConfig());
    resolveApnsRelayConfigFromEnvMock.mockReturnValue({ ok: false, error: "unused" });
    sendApnsExecApprovalAlertMock.mockResolvedValue(successfulApnsPushResult());
    sendApnsExecApprovalResolvedWakeMock.mockResolvedValue(successfulApnsPushResult());
  });

  it("does not target iOS devices whose active operator token lacks operator.approvals", async () => {
    mockPairedIosOperators(
      pairedIosOperator({
        scopes: ["operator.read"],
        approvedScopes: ["operator.approvals"],
      }),
    );

    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const accepted = await delivery.handleRequested(approvalRequest("approval-1"));

    expect(accepted).toBe(false);
    expect(loadApnsRegistrationsMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
    expect(sendApnsExecApprovalAlertMock).not.toHaveBeenCalled();
  });

  it("targets iOS devices when the active operator token includes operator.approvals", async () => {
<<<<<<< HEAD
    listDevicePairingMock.mockResolvedValue({
      pending: [],
      paired: [
        {
          deviceId: "ios-device-1",
          publicKey: "pub",
          platform: "iOS 18",
          role: "operator",
          roles: ["operator"],
          createdAtMs: 1,
          approvedAtMs: 1,
          tokens: {
            operator: {
              token: "operator-token",
              role: "operator",
              scopes: ["operator.approvals", "operator.read"],
              createdAtMs: 1,
            },
          },
        },
      ],
    });

    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const accepted = await delivery.handleRequested({
      id: "approval-2",
      request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
      createdAtMs: 1,
      expiresAtMs: 2,
    });

    expect(accepted).toBe(true);
    expect(loadApnsRegistrationMock).toHaveBeenCalledWith("ios-device-1");
    expect(sendApnsExecApprovalAlertMock).toHaveBeenCalledTimes(1);
  });

  it("does not treat iOS as a live approval route when every push fails", async () => {
    const warn = vi.fn();
    listDevicePairingMock.mockResolvedValue({
      pending: [],
      paired: [
        {
          deviceId: "ios-device-1",
          publicKey: "pub",
          platform: "iOS 18",
          role: "operator",
          roles: ["operator"],
          createdAtMs: 1,
          approvedAtMs: 1,
          tokens: {
            operator: {
              token: "operator-token",
              role: "operator",
              scopes: ["operator.approvals", "operator.read"],
              createdAtMs: 1,
            },
          },
        },
      ],
    });
=======
    mockPairedIosOperator(["operator.approvals", "operator.read"]);

    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const accepted = await delivery.handleRequested(approvalRequest("approval-2"));

    expect(accepted).toBe(true);
    expect(loadApnsRegistrationsMock).toHaveBeenCalledWith(["ios-device-1"]);
    expect(sendApnsExecApprovalAlertMock).toHaveBeenCalledTimes(1);
  });

  it("loads APNs registrations in one bulk read for all visible iOS operators", async () => {
    mockPairedIosOperators(
      pairedIosOperator({
        deviceId: "ios-device-1",
        publicKey: "pub-1",
        scopes: ["operator.approvals"],
        token: "operator-token-1",
      }),
      pairedIosOperator({
        deviceId: "ios-device-2",
        publicKey: "pub-2",
        platform: "iPadOS 18",
        approvedAtMs: 2,
        scopes: ["operator.approvals"],
        token: "operator-token-2",
      }),
    );

    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    await delivery.handleRequested(approvalRequest("approval-bulk-load"));

    expect(loadApnsRegistrationsMock).toHaveBeenCalledTimes(1);
    expect(loadApnsRegistrationsMock).toHaveBeenCalledWith(["ios-device-1", "ios-device-2"]);
  });

  it("does not target iOS devices rejected by the approval visibility filter", async () => {
    mockPairedIosOperator(["operator.approvals", "operator.read"]);
    const isTargetVisible = vi.fn(() => false);

    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const accepted = await delivery.handleRequested(approvalRequest("approval-filtered"), {
      isTargetVisible,
    });

    expect(accepted).toBe(false);
    expect(isTargetVisible).toHaveBeenCalledWith({
      deviceId: "ios-device-1",
      scopes: ["operator.approvals", "operator.read"],
    });
    expect(loadApnsRegistrationsMock).not.toHaveBeenCalled();
    expect(sendApnsExecApprovalAlertMock).not.toHaveBeenCalled();
  });

  it("does not treat iOS as a live approval route when every push fails", async () => {
    const warn = vi.fn();
    mockPairedIosOperator(["operator.approvals", "operator.read"]);
>>>>>>> upstream/main
    sendApnsExecApprovalAlertMock.mockResolvedValue({
      ok: false,
      status: 410,
      reason: "Unregistered",
      environment: "sandbox",
      topic: "ai.openclaw.ios.test",
      tokenSuffix: "token",
      transport: "direct",
    });

<<<<<<< HEAD
    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: { warn } });

    const accepted = await delivery.handleRequested({
      id: "approval-dead-route",
      request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
      createdAtMs: 1,
      expiresAtMs: 2,
    });
=======
    const delivery = createExecApprovalIosPushDelivery({ log: { warn } });

    const accepted = await delivery.handleRequested(approvalRequest("approval-dead-route"));
>>>>>>> upstream/main

    expect(accepted).toBe(false);
    expect(sendApnsExecApprovalAlertMock).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "exec approvals: iOS request push failed node=ios-device-1 status=410 reason=Unregistered",
    );
    expect(warn).toHaveBeenCalledWith(
      "exec approvals: iOS request push reached no devices approvalId=approval-dead-route attempted=1",
    );
  });

  it("waits for request delivery to finish before sending cleanup pushes", async () => {
<<<<<<< HEAD
    listDevicePairingMock.mockResolvedValue({
      pending: [],
      paired: [
        {
          deviceId: "ios-device-1",
          publicKey: "pub",
          platform: "iOS 18",
          role: "operator",
          roles: ["operator"],
          createdAtMs: 1,
          approvedAtMs: 1,
          tokens: {
            operator: {
              token: "operator-token",
              role: "operator",
              scopes: ["operator.approvals", "operator.read"],
              createdAtMs: 1,
            },
          },
        },
      ],
    });
=======
    mockPairedIosOperator(["operator.approvals", "operator.read"]);
>>>>>>> upstream/main
    const requestedPush = createDeferred<{
      ok: boolean;
      status: number;
      environment: string;
      topic: string;
      tokenSuffix: string;
      transport: string;
    }>();
    sendApnsExecApprovalAlertMock.mockReturnValue(requestedPush.promise);

<<<<<<< HEAD
    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const requested = delivery.handleRequested({
      id: "approval-ordered-cleanup",
      request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
      createdAtMs: 1,
      expiresAtMs: 2,
    });
    const resolved = delivery.handleResolved({
      id: "approval-ordered-cleanup",
      decision: "allow-once",
      ts: 1,
    });
=======
    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    const requested = delivery.handleRequested(approvalRequest("approval-ordered-cleanup"));
    const resolved = delivery.handleResolved(approvalResolved("approval-ordered-cleanup"));
>>>>>>> upstream/main

    await Promise.resolve();
    expect(sendApnsExecApprovalResolvedWakeMock).not.toHaveBeenCalled();

<<<<<<< HEAD
    requestedPush.resolve({
      ok: true,
      status: 200,
      environment: "sandbox",
      topic: "ai.openclaw.ios.test",
      tokenSuffix: "token",
      transport: "direct",
    });
=======
    requestedPush.resolve(successfulApnsPushResult());
>>>>>>> upstream/main
    await requested;
    await resolved;

    expect(sendApnsExecApprovalResolvedWakeMock).toHaveBeenCalledTimes(1);
  });

  it("skips cleanup pushes when the original request target set is unknown", async () => {
    const debug = vi.fn();
<<<<<<< HEAD
    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: { debug } });

    await delivery.handleResolved({
      id: "approval-missing-targets",
      decision: "allow-once",
      ts: 1,
    });
=======
    const delivery = createExecApprovalIosPushDelivery({ log: { debug } });

    await delivery.handleResolved(approvalResolved("approval-missing-targets"));
>>>>>>> upstream/main

    expect(debug).toHaveBeenCalledWith(
      "exec approvals: iOS cleanup push skipped approvalId=approval-missing-targets reason=missing-targets",
    );
    expect(listDevicePairingMock).not.toHaveBeenCalled();
<<<<<<< HEAD
    expect(loadApnsRegistrationMock).not.toHaveBeenCalled();
=======
    expect(loadApnsRegistrationsMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
    expect(sendApnsExecApprovalResolvedWakeMock).not.toHaveBeenCalled();
  });

  it("sends cleanup pushes only to the original request targets", async () => {
<<<<<<< HEAD
    listDevicePairingMock.mockResolvedValue({
      pending: [],
      paired: [
        {
          deviceId: "ios-device-1",
          publicKey: "pub",
          platform: "iOS 18",
          role: "operator",
          roles: ["operator"],
          createdAtMs: 1,
          approvedAtMs: 1,
          tokens: {
            operator: {
              token: "operator-token",
              role: "operator",
              scopes: ["operator.approvals", "operator.read"],
              createdAtMs: 1,
            },
          },
        },
      ],
    });

    const { createExecApprovalIosPushDelivery } = await import("./exec-approval-ios-push.js");
    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    await delivery.handleRequested({
      id: "approval-cleanup",
      request: { command: "echo ok", host: "gateway", allowedDecisions: ["allow-once"] },
      createdAtMs: 1,
      expiresAtMs: 2,
    });
    vi.clearAllMocks();
    loadApnsRegistrationMock.mockResolvedValue({
      nodeId: "ios-device-1",
      transport: "direct",
      token: "apns-token",
      topic: "ai.openclaw.ios.test",
      environment: "sandbox",
      updatedAtMs: 1,
    });
    resolveApnsAuthConfigFromEnvMock.mockResolvedValue({
      ok: true,
      value: { teamId: "team", keyId: "key", privateKey: "private-key" },
    });

    await delivery.handleResolved({
      id: "approval-cleanup",
      decision: "allow-once",
      ts: 1,
    });

    expect(listDevicePairingMock).not.toHaveBeenCalled();
    expect(loadApnsRegistrationMock).toHaveBeenCalledWith("ios-device-1");
=======
    mockPairedIosOperator(["operator.approvals", "operator.read"]);

    const delivery = createExecApprovalIosPushDelivery({ log: {} });

    await delivery.handleRequested(approvalRequest("approval-cleanup"));
    vi.clearAllMocks();
    loadApnsRegistrationMock.mockResolvedValue(apnsRegistration());
    resolveApnsAuthConfigFromEnvMock.mockResolvedValue(resolvedApnsAuthConfig());

    await delivery.handleResolved(approvalResolved("approval-cleanup"));

    expect(listDevicePairingMock).not.toHaveBeenCalled();
    expect(loadApnsRegistrationsMock).toHaveBeenCalledWith(["ios-device-1"]);
>>>>>>> upstream/main
    expect(sendApnsExecApprovalResolvedWakeMock).toHaveBeenCalledTimes(1);
  });
});
