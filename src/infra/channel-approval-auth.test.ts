<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
// Tests channel approval authorization and sender validation.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createResolvedApproverActionAuthAdapter } from "../plugin-sdk/approval-auth-helpers.js";
>>>>>>> upstream/main

const getChannelPluginMock = vi.hoisted(() => vi.fn());

vi.mock("../channels/plugins/index.js", async () => {
  const actual = await vi.importActual<typeof import("../channels/plugins/index.js")>(
    "../channels/plugins/index.js",
  );
  return {
    ...actual,
    getChannelPlugin: (...args: unknown[]) => getChannelPluginMock(...args),
  };
});

import { resolveApprovalCommandAuthorization } from "./channel-approval-auth.js";

describe("resolveApprovalCommandAuthorization", () => {
  beforeEach(() => {
    getChannelPluginMock.mockReset();
  });

  it("allows commands by default when the channel has no approval override", () => {
    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        senderId: "U123",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: false });
  });

  it("delegates to the channel approval override when present", () => {
    getChannelPluginMock.mockReturnValue({
<<<<<<< HEAD
      auth: {
=======
      approvalCapability: {
>>>>>>> upstream/main
        authorizeActorAction: ({
          approvalKind,
        }: {
          action: "approve";
          approvalKind: "exec" | "plugin";
        }) =>
          approvalKind === "plugin"
            ? { authorized: false, reason: "plugin denied" }
            : { authorized: true },
      },
    });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
<<<<<<< HEAD
        channel: "discord",
=======
        channel: "guildchat",
>>>>>>> upstream/main
        accountId: "work",
        senderId: "123",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: true });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
<<<<<<< HEAD
        channel: "discord",
=======
        channel: "guildchat",
>>>>>>> upstream/main
        accountId: "work",
        senderId: "123",
        kind: "plugin",
      }),
    ).toEqual({ authorized: false, reason: "plugin denied", explicit: true });
  });

<<<<<<< HEAD
  it("prefers approvalCapability over legacy auth wiring when present", () => {
    getChannelPluginMock.mockReturnValue({
      auth: {
        authorizeActorAction: () => ({ authorized: false, reason: "legacy denied" }),
      },
      approvalCapability: {
        authorizeActorAction: () => ({ authorized: true }),
        getActionAvailabilityState: () => ({ kind: "enabled" }),
=======
  it("uses approvalCapability as the canonical approval auth contract", () => {
    const getActionAvailabilityState = vi.fn(() => ({ kind: "enabled" as const }));
    getChannelPluginMock.mockReturnValue({
      approvalCapability: {
        authorizeActorAction: () => ({ authorized: true }),
        getActionAvailabilityState,
>>>>>>> upstream/main
      },
    });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
        channel: "matrix",
        senderId: "123",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: true });
<<<<<<< HEAD
  });

  it("keeps disabled approval availability implicit even when same-chat auth returns allow", () => {
    getChannelPluginMock.mockReturnValue({
      auth: {
        authorizeActorAction: () => ({ authorized: true }),
        getActionAvailabilityState: () => ({ kind: "disabled" }),
=======
    expect(getActionAvailabilityState).toHaveBeenCalledWith({
      cfg: {} as never,
      accountId: undefined,
      action: "approve",
      approvalKind: "exec",
    });
  });

  it("keeps disabled approval availability implicit even when same-chat auth returns allow", () => {
    const getActionAvailabilityState = vi.fn(() => ({ kind: "disabled" as const }));
    getChannelPluginMock.mockReturnValue({
      approvalCapability: {
        authorizeActorAction: () => ({ authorized: true }),
        getActionAvailabilityState,
>>>>>>> upstream/main
      },
    });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
<<<<<<< HEAD
        channel: "slack",
=======
        channel: "workspace",
>>>>>>> upstream/main
        accountId: "work",
        senderId: "U123",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: false });
<<<<<<< HEAD
=======
    expect(getActionAvailabilityState).toHaveBeenCalledWith({
      cfg: {} as never,
      accountId: "work",
      action: "approve",
      approvalKind: "exec",
    });
  });

  it("keeps empty approver fallback implicit without bypassing channel sender auth", () => {
    getChannelPluginMock.mockReturnValue({
      approvalCapability: createResolvedApproverActionAuthAdapter({
        channelLabel: "QuietChat",
        resolveApprovers: () => [],
      }),
    });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
        channel: "quietchat",
        accountId: "work",
        senderId: "uuid:attacker",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: false });
  });

  it("keeps configured approvers explicit when sender matches", () => {
    getChannelPluginMock.mockReturnValue({
      approvalCapability: createResolvedApproverActionAuthAdapter({
        channelLabel: "QuietChat",
        resolveApprovers: () => ["uuid:owner"],
      }),
    });

    expect(
      resolveApprovalCommandAuthorization({
        cfg: {} as never,
        channel: "quietchat",
        accountId: "work",
        senderId: "uuid:owner",
        kind: "exec",
      }),
    ).toEqual({ authorized: true, explicit: true });
>>>>>>> upstream/main
  });
});
