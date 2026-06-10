<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";

const gatewayRuntimeHoisted = vi.hoisted(() => ({
  requestSpy: vi.fn(),
  startSpy: vi.fn(),
  stopSpy: vi.fn(),
  stopAndWaitSpy: vi.fn(async () => undefined),
  createClientSpy: vi.fn(),
}));

vi.mock("openclaw/plugin-sdk/gateway-runtime", () => ({
  createOperatorApprovalsGatewayClient: gatewayRuntimeHoisted.createClientSpy,
}));

describe("resolveMatrixExecApproval", () => {
  beforeEach(() => {
    gatewayRuntimeHoisted.requestSpy.mockReset();
    gatewayRuntimeHoisted.startSpy.mockReset();
    gatewayRuntimeHoisted.stopSpy.mockReset();
    gatewayRuntimeHoisted.stopAndWaitSpy.mockReset().mockResolvedValue(undefined);
    gatewayRuntimeHoisted.createClientSpy.mockReset().mockImplementation((opts) => ({
      start: () => {
        gatewayRuntimeHoisted.startSpy();
        opts.onHelloOk?.();
      },
      request: gatewayRuntimeHoisted.requestSpy,
      stop: gatewayRuntimeHoisted.stopSpy,
      stopAndWait: gatewayRuntimeHoisted.stopAndWaitSpy,
    }));
  });

  it("submits exec approval resolutions through the gateway approvals client", async () => {
    const { resolveMatrixExecApproval } = await import("./exec-approval-resolver.js");

    await resolveMatrixExecApproval({
=======
// Matrix tests cover exec approval resolver plugin behavior.
import { beforeEach, describe, expect, it, vi } from "vitest";

const approvalRuntimeHoisted = vi.hoisted(() => ({
  resolveApprovalOverGatewaySpy: vi.fn(),
}));

vi.mock("openclaw/plugin-sdk/approval-gateway-runtime", () => ({
  resolveApprovalOverGateway: (...args: unknown[]) =>
    approvalRuntimeHoisted.resolveApprovalOverGatewaySpy(...args),
}));

describe("resolveMatrixApproval", () => {
  beforeEach(() => {
    approvalRuntimeHoisted.resolveApprovalOverGatewaySpy.mockReset();
  });

  it("submits exec approval resolutions through the shared gateway resolver", async () => {
    const { resolveMatrixApproval } = await import("./exec-approval-resolver.js");

    await resolveMatrixApproval({
>>>>>>> upstream/main
      cfg: {} as never,
      approvalId: "req-123",
      decision: "allow-once",
      senderId: "@owner:example.org",
    });

<<<<<<< HEAD
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenCalledWith("exec.approval.resolve", {
      id: "req-123",
      decision: "allow-once",
=======
    expect(approvalRuntimeHoisted.resolveApprovalOverGatewaySpy).toHaveBeenCalledWith({
      cfg: {} as never,
      approvalId: "req-123",
      decision: "allow-once",
      senderId: "@owner:example.org",
      gatewayUrl: undefined,
      clientDisplayName: "Matrix approval (@owner:example.org)",
    });
  });

  it("passes plugin approval ids through unchanged", async () => {
    const { resolveMatrixApproval } = await import("./exec-approval-resolver.js");

    await resolveMatrixApproval({
      cfg: {} as never,
      approvalId: "plugin:req-123",
      decision: "deny",
      senderId: "@owner:example.org",
    });

    expect(approvalRuntimeHoisted.resolveApprovalOverGatewaySpy).toHaveBeenCalledWith({
      cfg: {} as never,
      approvalId: "plugin:req-123",
      decision: "deny",
      senderId: "@owner:example.org",
      gatewayUrl: undefined,
      clientDisplayName: "Matrix approval (@owner:example.org)",
>>>>>>> upstream/main
    });
  });

  it("recognizes structured approval-not-found errors", async () => {
    const { isApprovalNotFoundError } = await import("./exec-approval-resolver.js");
    const err = new Error("approval not found");
    (err as Error & { gatewayCode?: string; details?: { reason?: string } }).gatewayCode =
      "INVALID_REQUEST";
    (err as Error & { gatewayCode?: string; details?: { reason?: string } }).details = {
      reason: "APPROVAL_NOT_FOUND",
    };

    expect(isApprovalNotFoundError(err)).toBe(true);
  });
});
