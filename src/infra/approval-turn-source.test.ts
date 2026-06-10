<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadConfigMock = vi.hoisted(() => vi.fn());
const resolveExecApprovalInitiatingSurfaceStateMock = vi.hoisted(() => vi.fn());

vi.mock("../config/config.js", () => ({
  loadConfig: () => loadConfigMock(),
}));

vi.mock("./exec-approval-surface.js", () => ({
  resolveExecApprovalInitiatingSurfaceState: (...args: unknown[]) =>
    resolveExecApprovalInitiatingSurfaceStateMock(...args),
=======
// Covers approval turn-source route checks.
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadConfigMock = vi.hoisted(() => vi.fn());
const resolveApprovalInitiatingSurfaceStateMock = vi.hoisted(() => vi.fn());

vi.mock("../config/config.js", () => ({
  getRuntimeConfig: () => loadConfigMock(),
}));

vi.mock("./exec-approval-surface.js", () => ({
  resolveApprovalInitiatingSurfaceState: (...args: unknown[]) =>
    resolveApprovalInitiatingSurfaceStateMock(...args),
>>>>>>> upstream/main
}));

import { hasApprovalTurnSourceRoute } from "./approval-turn-source.js";

describe("hasApprovalTurnSourceRoute", () => {
  beforeEach(() => {
    loadConfigMock.mockReset();
<<<<<<< HEAD
    resolveExecApprovalInitiatingSurfaceStateMock.mockReset();
=======
    resolveApprovalInitiatingSurfaceStateMock.mockReset();
>>>>>>> upstream/main
    loadConfigMock.mockReturnValue({ loaded: true });
  });

  it("returns true when the initiating surface is enabled", () => {
<<<<<<< HEAD
    resolveExecApprovalInitiatingSurfaceStateMock.mockReturnValue({ kind: "enabled" });
=======
    resolveApprovalInitiatingSurfaceStateMock.mockReturnValue({ kind: "enabled" });
>>>>>>> upstream/main

    expect(
      hasApprovalTurnSourceRoute({
        turnSourceChannel: "slack",
        turnSourceAccountId: "work",
      }),
    ).toBe(true);
<<<<<<< HEAD
    expect(resolveExecApprovalInitiatingSurfaceStateMock).toHaveBeenCalledWith({
      channel: "slack",
      accountId: "work",
      cfg: { loaded: true },
=======
    expect(resolveApprovalInitiatingSurfaceStateMock).toHaveBeenCalledWith({
      channel: "slack",
      accountId: "work",
      cfg: { loaded: true },
      approvalKind: "exec",
    });
  });

  it("passes plugin approval kind to the initiating surface check", () => {
    resolveApprovalInitiatingSurfaceStateMock.mockReturnValue({ kind: "disabled" });

    expect(
      hasApprovalTurnSourceRoute({
        turnSourceChannel: "whatsapp",
        turnSourceAccountId: "default",
        approvalKind: "plugin",
      }),
    ).toBe(false);
    expect(resolveApprovalInitiatingSurfaceStateMock).toHaveBeenCalledWith({
      channel: "whatsapp",
      accountId: "default",
      cfg: { loaded: true },
      approvalKind: "plugin",
>>>>>>> upstream/main
    });
  });

  it("returns false when the initiating surface is disabled or unsupported", () => {
<<<<<<< HEAD
    resolveExecApprovalInitiatingSurfaceStateMock.mockReturnValueOnce({ kind: "disabled" });
    expect(hasApprovalTurnSourceRoute({ turnSourceChannel: "discord" })).toBe(false);

    resolveExecApprovalInitiatingSurfaceStateMock.mockReturnValueOnce({ kind: "unsupported" });
=======
    resolveApprovalInitiatingSurfaceStateMock.mockReturnValueOnce({ kind: "disabled" });
    expect(hasApprovalTurnSourceRoute({ turnSourceChannel: "discord" })).toBe(false);

    resolveApprovalInitiatingSurfaceStateMock.mockReturnValueOnce({ kind: "unsupported" });
>>>>>>> upstream/main
    expect(hasApprovalTurnSourceRoute({ turnSourceChannel: "unknown-channel" })).toBe(false);
  });

  it("returns false when there is no turn-source channel", () => {
    expect(hasApprovalTurnSourceRoute({ turnSourceChannel: undefined })).toBe(false);
<<<<<<< HEAD
    expect(resolveExecApprovalInitiatingSurfaceStateMock).not.toHaveBeenCalled();
=======
    expect(resolveApprovalInitiatingSurfaceStateMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });
});
