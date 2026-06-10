<<<<<<< HEAD
=======
// WebSocket auth-context state tests cover shared-auth fallback and device-token candidate selection.
>>>>>>> upstream/main
import { describe, expect, it, vi } from "vitest";
import type { AuthRateLimiter } from "../../auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "../../auth.js";
import { resolveConnectAuthDecision, resolveConnectAuthState } from "./auth-context.js";

<<<<<<< HEAD
function createLimiter() {
  return {
    check: vi.fn(() => ({ allowed: true, retryAfterMs: 5_000 })),
    reset: vi.fn(),
    recordFailure: vi.fn(),
  } as unknown as AuthRateLimiter;
=======
type ResolveConnectAuthStateParams = Parameters<typeof resolveConnectAuthState>[0];
type TestRateLimiter = AuthRateLimiter & {
  check: ReturnType<typeof vi.fn<AuthRateLimiter["check"]>>;
  reset: ReturnType<typeof vi.fn<AuthRateLimiter["reset"]>>;
  recordFailure: ReturnType<typeof vi.fn<AuthRateLimiter["recordFailure"]>>;
};

const CLIENT_IP = "203.0.113.20";

function createLimiter(params?: { allowed?: boolean; retryAfterMs?: number }): TestRateLimiter {
  const allowed = params?.allowed ?? true;
  const retryAfterMs = params?.retryAfterMs ?? 5_000;
  const check = vi.fn<AuthRateLimiter["check"]>(() => ({ allowed, remaining: 10, retryAfterMs }));
  const reset = vi.fn<AuthRateLimiter["reset"]>();
  const recordFailure = vi.fn<AuthRateLimiter["recordFailure"]>();
  return {
    check,
    reset,
    recordFailure,
    size: vi.fn(() => 0),
    prune: vi.fn(),
    dispose: vi.fn(),
  };
}

async function resolveTokenAuthState(params: {
  connectAuth: ResolveConnectAuthStateParams["connectAuth"];
  hasDeviceIdentity: boolean;
  rateLimiter: AuthRateLimiter;
}) {
  return await resolveConnectAuthState({
    resolvedAuth: {
      mode: "token",
      token: "correct-secret",
      allowTailscale: false,
    } satisfies ResolvedGatewayAuth,
    connectAuth: params.connectAuth,
    hasDeviceIdentity: params.hasDeviceIdentity,
    req: {
      headers: {},
      socket: { remoteAddress: CLIENT_IP },
    } as never,
    trustedProxies: [],
    allowRealIpFallback: false,
    rateLimiter: params.rateLimiter,
    clientIp: CLIENT_IP,
  });
>>>>>>> upstream/main
}

describe("resolveConnectAuthState", () => {
  it("records shared-secret failures even when an explicit device token is also present", async () => {
    const rateLimiter = createLimiter();
<<<<<<< HEAD
    const state = await resolveConnectAuthState({
      resolvedAuth: {
        mode: "token",
        token: "correct-secret",
        allowTailscale: false,
      } satisfies ResolvedGatewayAuth,
=======
    const state = await resolveTokenAuthState({
>>>>>>> upstream/main
      connectAuth: {
        token: "wrong-secret",
        deviceToken: "fake-device-token",
      },
      hasDeviceIdentity: true,
<<<<<<< HEAD
      req: {
        headers: {},
        socket: { remoteAddress: "203.0.113.20" },
      } as never,
      trustedProxies: [],
      allowRealIpFallback: false,
      rateLimiter,
      clientIp: "203.0.113.20",
=======
      rateLimiter,
>>>>>>> upstream/main
    });

    expect(state.authOk).toBe(false);
    expect(state.authResult.reason).toBe("token_mismatch");
<<<<<<< HEAD
    expect(
      (rateLimiter as never as { recordFailure: ReturnType<typeof vi.fn> }).recordFailure,
    ).toHaveBeenCalled();
  });

  it("does not apply shared-secret lockouts to explicit device-token-only handshakes", async () => {
    const rateLimiter = {
      check: vi.fn(() => ({ allowed: false, retryAfterMs: 5_000 })),
      reset: vi.fn(),
      recordFailure: vi.fn(),
    } as unknown as AuthRateLimiter;

    const state = await resolveConnectAuthState({
      resolvedAuth: {
        mode: "token",
        token: "correct-secret",
        allowTailscale: false,
      } satisfies ResolvedGatewayAuth,
=======
    expect(rateLimiter.recordFailure).toHaveBeenCalled();
  });

  it("does not apply shared-secret lockouts to explicit device-token-only handshakes", async () => {
    const rateLimiter = createLimiter({ allowed: false });

    const state = await resolveTokenAuthState({
>>>>>>> upstream/main
      connectAuth: {
        deviceToken: "device-token-only",
      },
      hasDeviceIdentity: true,
<<<<<<< HEAD
      req: {
        headers: {},
        socket: { remoteAddress: "203.0.113.20" },
      } as never,
      trustedProxies: [],
      allowRealIpFallback: false,
      rateLimiter,
      clientIp: "203.0.113.20",
=======
      rateLimiter,
>>>>>>> upstream/main
    });

    expect(state.authOk).toBe(false);
    expect(state.authResult.rateLimited).not.toBe(true);
<<<<<<< HEAD
    expect(
      (rateLimiter as never as { check: ReturnType<typeof vi.fn> }).check,
    ).not.toHaveBeenCalled();
=======
    expect(rateLimiter.check).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });
});

describe("resolveConnectAuthDecision", () => {
<<<<<<< HEAD
=======
  it("sets sharedAuthOk false when auth mode is none (no shared secret provided)", async () => {
    const state = await resolveConnectAuthState({
      resolvedAuth: {
        mode: "none",
        allowTailscale: false,
      } satisfies ResolvedGatewayAuth,
      connectAuth: {},
      hasDeviceIdentity: false,
      req: {
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      } as never,
      trustedProxies: [],
      allowRealIpFallback: false,
      rateLimiter: createLimiter(),
      clientIp: "127.0.0.1",
    });

    expect(state.authOk).toBe(true);
    expect(state.authMethod).toBe("none");
    // auth:none does NOT set sharedAuthOk globally — it's not a shared secret.
    // Only shouldSkipLocalBackendSelfPairing treats auth:none as shared-auth-scoped
    // for local backend connections specifically.
    expect(state.sharedAuthOk).toBe(false);
  });

>>>>>>> upstream/main
  it("resets the shared-secret limiter after device-token auth succeeds", async () => {
    const rateLimiter = createLimiter();
    await resolveConnectAuthDecision({
      state: {
        authResult: { ok: false, reason: "token_mismatch" },
        authOk: false,
        authMethod: "token",
        sharedAuthOk: false,
        sharedAuthProvided: true,
        deviceTokenCandidate: "device-token",
        deviceTokenCandidateSource: "explicit-device-token",
      },
      hasDeviceIdentity: true,
      deviceId: "dev-1",
      publicKey: "pub-1",
      role: "operator",
      scopes: ["operator.read"],
      verifyBootstrapToken: async () => ({ ok: false, reason: "bootstrap_token_invalid" }),
      verifyDeviceToken: async () => ({ ok: true }),
      rateLimiter,
<<<<<<< HEAD
      clientIp: "203.0.113.20",
    });

    expect(
      (rateLimiter as never as { reset: ReturnType<typeof vi.fn> }).reset,
    ).toHaveBeenCalledWith("203.0.113.20", "shared-secret");
=======
      clientIp: CLIENT_IP,
    });

    expect(rateLimiter.reset).toHaveBeenCalledWith(CLIENT_IP, "shared-secret");
>>>>>>> upstream/main
  });
});
