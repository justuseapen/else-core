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

describe("resolveTelegramExecApproval", () => {
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

  it("routes plugin approval ids through plugin.approval.resolve", async () => {
=======
// Telegram tests cover exec approval resolver plugin behavior.
import type { ExecApprovalReplyDecision } from "openclaw/plugin-sdk/approval-reply-runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

const approvalGatewayRuntimeHoisted = vi.hoisted(() => ({
  resolveApprovalOverGatewaySpy: vi.fn(),
}));

vi.mock("openclaw/plugin-sdk/approval-gateway-runtime", () => ({
  resolveApprovalOverGateway: (...args: unknown[]) =>
    approvalGatewayRuntimeHoisted.resolveApprovalOverGatewaySpy(...args),
}));

describe("resolveTelegramExecApproval", () => {
  async function invokeResolver(params: {
    approvalId: string;
    decision: ExecApprovalReplyDecision;
    senderId: string;
    allowPluginFallback?: boolean;
  }) {
>>>>>>> upstream/main
    const { resolveTelegramExecApproval } = await import("./exec-approval-resolver.js");

    await resolveTelegramExecApproval({
      cfg: {} as never,
<<<<<<< HEAD
=======
      gatewayUrl: undefined,
      ...params,
    });
  }

  function expectApprovalGatewayCall(params: {
    approvalId: string;
    decision: ExecApprovalReplyDecision;
    senderId: string;
    allowPluginFallback?: boolean;
  }) {
    expect(approvalGatewayRuntimeHoisted.resolveApprovalOverGatewaySpy).toHaveBeenCalledWith({
      cfg: {} as never,
      approvalId: params.approvalId,
      decision: params.decision,
      senderId: params.senderId,
      gatewayUrl: undefined,
      allowPluginFallback: params.allowPluginFallback,
      clientDisplayName: `Telegram approval (${params.senderId})`,
    });
  }

  beforeEach(() => {
    approvalGatewayRuntimeHoisted.resolveApprovalOverGatewaySpy
      .mockReset()
      .mockResolvedValue(undefined);
  });

  it("routes plugin approval ids through plugin.approval.resolve", async () => {
    await invokeResolver({
>>>>>>> upstream/main
      approvalId: "plugin:abc123",
      decision: "allow-once",
      senderId: "9",
    });

<<<<<<< HEAD
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenCalledWith("plugin.approval.resolve", {
      id: "plugin:abc123",
      decision: "allow-once",
    });
  });

  it("falls back to plugin.approval.resolve when exec approval ids are unknown", async () => {
    gatewayRuntimeHoisted.requestSpy
      .mockRejectedValueOnce(new Error("unknown or expired approval id"))
      .mockResolvedValueOnce(undefined);
    const { resolveTelegramExecApproval } = await import("./exec-approval-resolver.js");

    await resolveTelegramExecApproval({
      cfg: {} as never,
=======
    expectApprovalGatewayCall({
      approvalId: "plugin:abc123",
      decision: "allow-once",
      senderId: "9",
    });
  });

  it.each([
    "falls back to plugin.approval.resolve when exec approval ids are unknown",
    "falls back to plugin.approval.resolve for structured approval-not-found errors",
  ])("%s", async () => {
    await invokeResolver({
>>>>>>> upstream/main
      approvalId: "legacy-plugin-123",
      decision: "allow-always",
      senderId: "9",
      allowPluginFallback: true,
    });

<<<<<<< HEAD
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenNthCalledWith(1, "exec.approval.resolve", {
      id: "legacy-plugin-123",
      decision: "allow-always",
    });
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenNthCalledWith(2, "plugin.approval.resolve", {
      id: "legacy-plugin-123",
      decision: "allow-always",
    });
  });

  it("falls back to plugin.approval.resolve for structured approval-not-found errors", async () => {
    const err = new Error("approval not found");
    (err as Error & { gatewayCode?: string; details?: { reason?: string } }).gatewayCode =
      "INVALID_REQUEST";
    (err as Error & { gatewayCode?: string; details?: { reason?: string } }).details = {
      reason: "APPROVAL_NOT_FOUND",
    };
    gatewayRuntimeHoisted.requestSpy.mockRejectedValueOnce(err).mockResolvedValueOnce(undefined);
    const { resolveTelegramExecApproval } = await import("./exec-approval-resolver.js");

    await resolveTelegramExecApproval({
      cfg: {} as never,
=======
    expectApprovalGatewayCall({
>>>>>>> upstream/main
      approvalId: "legacy-plugin-123",
      decision: "allow-always",
      senderId: "9",
      allowPluginFallback: true,
    });
<<<<<<< HEAD

    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenNthCalledWith(1, "exec.approval.resolve", {
      id: "legacy-plugin-123",
      decision: "allow-always",
    });
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenNthCalledWith(2, "plugin.approval.resolve", {
      id: "legacy-plugin-123",
      decision: "allow-always",
    });
  });

  it("does not fall back to plugin.approval.resolve without explicit permission", async () => {
    gatewayRuntimeHoisted.requestSpy.mockRejectedValueOnce(
      new Error("unknown or expired approval id"),
    );
    const { resolveTelegramExecApproval } = await import("./exec-approval-resolver.js");

    await expect(
      resolveTelegramExecApproval({
        cfg: {} as never,
        approvalId: "legacy-plugin-123",
        decision: "allow-always",
        senderId: "9",
      }),
    ).rejects.toThrow("unknown or expired approval id");

    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenCalledTimes(1);
    expect(gatewayRuntimeHoisted.requestSpy).toHaveBeenCalledWith("exec.approval.resolve", {
      id: "legacy-plugin-123",
      decision: "allow-always",
=======
  });

  it("passes fallback disablement through unchanged", async () => {
    await invokeResolver({
      approvalId: "legacy-plugin-123",
      decision: "allow-always",
      senderId: "9",
    });

    expectApprovalGatewayCall({
      approvalId: "legacy-plugin-123",
      decision: "allow-always",
      senderId: "9",
>>>>>>> upstream/main
    });
  });
});
