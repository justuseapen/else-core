<<<<<<< HEAD
=======
// Device Pair tests cover pair command auth plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { resolvePairingCommandAuthState } from "./pair-command-auth.js";

describe("device-pair pairing command auth", () => {
<<<<<<< HEAD
  it("treats non-gateway channels as external approvals", () => {
=======
  it("fails closed for non-gateway channels without pairing scopes", () => {
>>>>>>> upstream/main
    expect(
      resolvePairingCommandAuthState({
        channel: "telegram",
        gatewayClientScopes: undefined,
      }),
    ).toEqual({
      isInternalGatewayCaller: false,
<<<<<<< HEAD
      isMissingInternalPairingPrivilege: false,
=======
      isMissingPairingPrivilege: true,
      isMissingSetupHandoffPrivilege: true,
>>>>>>> upstream/main
      approvalCallerScopes: undefined,
    });
  });

<<<<<<< HEAD
=======
  it("accepts command owners on non-gateway channels", () => {
    expect(
      resolvePairingCommandAuthState({
        channel: "telegram",
        gatewayClientScopes: undefined,
        senderIsOwner: true,
      }),
    ).toEqual({
      isInternalGatewayCaller: false,
      isMissingPairingPrivilege: false,
      isMissingSetupHandoffPrivilege: false,
      approvalCallerScopes: ["operator.pairing"],
    });
  });

>>>>>>> upstream/main
  it("fails closed for webchat when scopes are absent", () => {
    expect(
      resolvePairingCommandAuthState({
        channel: "webchat",
        gatewayClientScopes: undefined,
      }),
    ).toEqual({
      isInternalGatewayCaller: true,
<<<<<<< HEAD
      isMissingInternalPairingPrivilege: true,
=======
      isMissingPairingPrivilege: true,
      isMissingSetupHandoffPrivilege: true,
>>>>>>> upstream/main
      approvalCallerScopes: [],
    });
  });

<<<<<<< HEAD
  it("accepts pairing and admin scopes for internal callers", () => {
=======
  it("tracks pairing and setup-handoff privileges independently for internal callers", () => {
>>>>>>> upstream/main
    expect(
      resolvePairingCommandAuthState({
        channel: "webchat",
        gatewayClientScopes: ["operator.write", "operator.pairing"],
      }),
    ).toEqual({
      isInternalGatewayCaller: true,
<<<<<<< HEAD
      isMissingInternalPairingPrivilege: false,
=======
      isMissingPairingPrivilege: false,
      isMissingSetupHandoffPrivilege: true,
>>>>>>> upstream/main
      approvalCallerScopes: ["operator.write", "operator.pairing"],
    });
    expect(
      resolvePairingCommandAuthState({
        channel: "webchat",
<<<<<<< HEAD
=======
        gatewayClientScopes: ["operator.write", "operator.pairing", "operator.talk.secrets"],
      }),
    ).toEqual({
      isInternalGatewayCaller: true,
      isMissingPairingPrivilege: false,
      isMissingSetupHandoffPrivilege: false,
      approvalCallerScopes: ["operator.write", "operator.pairing", "operator.talk.secrets"],
    });
    expect(
      resolvePairingCommandAuthState({
        channel: "webchat",
>>>>>>> upstream/main
        gatewayClientScopes: ["operator.admin"],
      }),
    ).toEqual({
      isInternalGatewayCaller: true,
<<<<<<< HEAD
      isMissingInternalPairingPrivilege: false,
      approvalCallerScopes: ["operator.admin"],
    });
  });
=======
      isMissingPairingPrivilege: false,
      isMissingSetupHandoffPrivilege: false,
      approvalCallerScopes: ["operator.admin"],
    });
  });

  it("preserves gateway scopes for command owners with gateway scope context", () => {
    expect(
      resolvePairingCommandAuthState({
        channel: "telegram",
        gatewayClientScopes: ["operator.write", "operator.pairing"],
        senderIsOwner: true,
      }),
    ).toEqual({
      isInternalGatewayCaller: true,
      isMissingPairingPrivilege: false,
      isMissingSetupHandoffPrivilege: true,
      approvalCallerScopes: ["operator.write", "operator.pairing"],
    });
  });
>>>>>>> upstream/main
});
