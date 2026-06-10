<<<<<<< HEAD
import { describe, expect, it, vi } from "vitest";
import { resolveChannelApprovalAdapter, resolveChannelApprovalCapability } from "./approvals.js";

describe("resolveChannelApprovalCapability", () => {
  it("falls back to legacy approval fields when approvalCapability is absent", () => {
    const authorizeActorAction = vi.fn();
    const getActionAvailabilityState = vi.fn();
    const delivery = { hasConfiguredDmRoute: vi.fn() };
    const describeExecApprovalSetup = vi.fn();

    expect(
      resolveChannelApprovalCapability({
        auth: {
          authorizeActorAction,
          getActionAvailabilityState,
        },
        approvals: {
          describeExecApprovalSetup,
          delivery,
        },
      }),
    ).toEqual({
      authorizeActorAction,
      getActionAvailabilityState,
      describeExecApprovalSetup,
      delivery,
      render: undefined,
      native: undefined,
    });
  });

  it("merges partial approvalCapability fields with legacy approval wiring", () => {
    const capabilityAuth = vi.fn();
    const legacyAvailability = vi.fn();
    const legacyDelivery = { hasConfiguredDmRoute: vi.fn() };
=======
// Approval tests cover channel plugin approval request formatting and dispatch.
import { describe, expect, it, vi } from "vitest";
import { resolveChannelApprovalAdapter, resolveChannelApprovalCapability } from "./approvals.js";

function createNativeRuntimeStub() {
  return {
    availability: {
      isConfigured: vi.fn(),
      shouldHandle: vi.fn(),
    },
    presentation: {
      buildPendingPayload: vi.fn(),
      buildResolvedResult: vi.fn(),
      buildExpiredResult: vi.fn(),
    },
    transport: {
      prepareTarget: vi.fn(),
      deliverPending: vi.fn(),
    },
  };
}

describe("resolveChannelApprovalCapability", () => {
  it("returns undefined when approvalCapability is absent", () => {
    expect(resolveChannelApprovalCapability({})).toBeUndefined();
  });

  it("returns approvalCapability as the canonical approval contract", () => {
    const capabilityAuth = vi.fn();
    const capabilityAvailability = vi.fn();
    const capabilityNativeRuntime = createNativeRuntimeStub();
    const delivery = { hasConfiguredDmRoute: vi.fn() };
>>>>>>> upstream/main

    expect(
      resolveChannelApprovalCapability({
        approvalCapability: {
          authorizeActorAction: capabilityAuth,
<<<<<<< HEAD
        },
        auth: {
          getActionAvailabilityState: legacyAvailability,
        },
        approvals: {
          delivery: legacyDelivery,
=======
          getActionAvailabilityState: capabilityAvailability,
          delivery,
          nativeRuntime: capabilityNativeRuntime,
>>>>>>> upstream/main
        },
      }),
    ).toEqual({
      authorizeActorAction: capabilityAuth,
<<<<<<< HEAD
      getActionAvailabilityState: legacyAvailability,
      delivery: legacyDelivery,
=======
      getActionAvailabilityState: capabilityAvailability,
      delivery,
      nativeRuntime: capabilityNativeRuntime,
>>>>>>> upstream/main
      render: undefined,
      native: undefined,
    });
  });
});

describe("resolveChannelApprovalAdapter", () => {
<<<<<<< HEAD
  it("preserves legacy delivery surfaces when approvalCapability only defines auth", () => {
    const delivery = { hasConfiguredDmRoute: vi.fn() };
=======
  it("returns only delivery/runtime surfaces from approvalCapability", () => {
    const delivery = { hasConfiguredDmRoute: vi.fn() };
    const nativeRuntime = createNativeRuntimeStub();
>>>>>>> upstream/main
    const describeExecApprovalSetup = vi.fn();

    expect(
      resolveChannelApprovalAdapter({
        approvalCapability: {
<<<<<<< HEAD
          authorizeActorAction: vi.fn(),
        },
        approvals: {
          describeExecApprovalSetup,
          delivery,
=======
          describeExecApprovalSetup,
          delivery,
          nativeRuntime,
          authorizeActorAction: vi.fn(),
>>>>>>> upstream/main
        },
      }),
    ).toEqual({
      describeExecApprovalSetup,
      delivery,
<<<<<<< HEAD
=======
      nativeRuntime,
>>>>>>> upstream/main
      render: undefined,
      native: undefined,
    });
  });
});
