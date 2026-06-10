<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
// Gateway client bootstrap tests keep URL override provenance wired into shared
// auth resolution so CLI and env callers authenticate against the intended target.
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { resolveGatewayConnectionAuth } from "./connection-auth.js";

type AuthResolutionParams = Parameters<typeof resolveGatewayConnectionAuth>[0];
>>>>>>> upstream/main

const mockState = vi.hoisted(() => ({
  buildGatewayConnectionDetails: vi.fn(),
  resolveGatewayConnectionAuth: vi.fn(),
}));

<<<<<<< HEAD
vi.mock("./call.js", () => ({
  buildGatewayConnectionDetails: (...args: unknown[]) =>
=======
vi.mock("./connection-details.js", () => ({
  buildGatewayConnectionDetailsWithResolvers: (...args: unknown[]) =>
>>>>>>> upstream/main
    mockState.buildGatewayConnectionDetails(...args),
}));

vi.mock("./connection-auth.js", () => ({
  resolveGatewayConnectionAuth: (...args: unknown[]) =>
    mockState.resolveGatewayConnectionAuth(...args),
}));

const { resolveGatewayClientBootstrap, resolveGatewayUrlOverrideSource } =
  await import("./client-bootstrap.js");

<<<<<<< HEAD
=======
function expectLastAuthResolutionParams(expected: {
  urlOverride?: string;
  urlOverrideSource?: "cli" | "env";
}) {
  const [params] = mockState.resolveGatewayConnectionAuth.mock.calls.at(-1) ?? [];
  if (params === undefined) {
    throw new Error("Expected shared auth resolution to be called");
  }
  const authParams = params as AuthResolutionParams;
  expect(authParams.env).toBe(process.env);
  expect(authParams.urlOverride).toBe(expected.urlOverride);
  expect(authParams.urlOverrideSource).toBe(expected.urlOverrideSource);
}

>>>>>>> upstream/main
describe("resolveGatewayUrlOverrideSource", () => {
  it("maps override url sources only", () => {
    expect(resolveGatewayUrlOverrideSource("cli --url")).toBe("cli");
    expect(resolveGatewayUrlOverrideSource("env OPENCLAW_GATEWAY_URL")).toBe("env");
    expect(resolveGatewayUrlOverrideSource("config gateway.remote.url")).toBeUndefined();
  });
});

describe("resolveGatewayClientBootstrap", () => {
  beforeEach(() => {
    mockState.buildGatewayConnectionDetails.mockReset();
    mockState.resolveGatewayConnectionAuth.mockReset();
    mockState.resolveGatewayConnectionAuth.mockResolvedValue({
      token: undefined,
      password: undefined,
    });
  });

  it("passes cli override context into shared auth resolution", async () => {
<<<<<<< HEAD
    mockState.buildGatewayConnectionDetails.mockReturnValue({
=======
    mockState.buildGatewayConnectionDetails.mockReturnValueOnce({
>>>>>>> upstream/main
      url: "wss://override.example/ws",
      urlSource: "cli --url",
    });

    const result = await resolveGatewayClientBootstrap({
      config: {} as never,
      gatewayUrl: "wss://override.example/ws",
      env: process.env,
    });

    expect(result).toEqual({
      url: "wss://override.example/ws",
      urlSource: "cli --url",
<<<<<<< HEAD
=======
      preauthHandshakeTimeoutMs: undefined,
>>>>>>> upstream/main
      auth: {
        token: undefined,
        password: undefined,
      },
    });
<<<<<<< HEAD
    expect(mockState.resolveGatewayConnectionAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        env: process.env,
        urlOverride: "wss://override.example/ws",
        urlOverrideSource: "cli",
      }),
    );
=======
    expectLastAuthResolutionParams({
      urlOverride: "wss://override.example/ws",
      urlOverrideSource: "cli",
    });
>>>>>>> upstream/main
  });

  it("does not mark config-derived urls as overrides", async () => {
    mockState.buildGatewayConnectionDetails.mockReturnValue({
      url: "wss://gateway.example/ws",
      urlSource: "config gateway.remote.url",
    });

    await resolveGatewayClientBootstrap({
      config: {} as never,
      env: process.env,
    });

<<<<<<< HEAD
    expect(mockState.resolveGatewayConnectionAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        env: process.env,
        urlOverride: undefined,
        urlOverrideSource: undefined,
      }),
    );
=======
    expectLastAuthResolutionParams({
      urlOverride: undefined,
      urlOverrideSource: undefined,
    });
  });

  it("carries configured preauth handshake timeout for GatewayClient callers", async () => {
    mockState.buildGatewayConnectionDetails.mockReturnValue({
      url: "ws://127.0.0.1:18789",
      urlSource: "local loopback",
    });

    const result = await resolveGatewayClientBootstrap({
      config: { gateway: { handshakeTimeoutMs: 30_000 } } as never,
      env: process.env,
    });

    expect(result.preauthHandshakeTimeoutMs).toBe(30_000);
>>>>>>> upstream/main
  });
});
