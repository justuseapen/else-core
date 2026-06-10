<<<<<<< HEAD
import { expect, it } from "vitest";

type ResolveTargetMode = "explicit" | "implicit" | "heartbeat";

type ResolveTargetResult = {
=======
// Resolve target error helpers share common route-target validation cases.
import { expect, it } from "vitest";

// Shared resolve-target negative cases used by messaging/channel tests. The
// target resolver shape is intentionally tiny so each channel can adapt it.
export type ResolveTargetMode = "explicit" | "implicit" | "heartbeat";

export type ResolveTargetResult = {
>>>>>>> upstream/main
  ok: boolean;
  to?: string;
  error?: unknown;
};

<<<<<<< HEAD
type ResolveTargetFn = (params: {
=======
export type ResolveTargetFn = (params: {
>>>>>>> upstream/main
  to?: string;
  mode: ResolveTargetMode;
  allowFrom: string[];
}) => ResolveTargetResult;

export function installCommonResolveTargetErrorCases(params: {
  resolveTarget: ResolveTargetFn;
  implicitAllowFrom: string[];
}) {
  const { resolveTarget, implicitAllowFrom } = params;
<<<<<<< HEAD
=======
  const expectResolveTargetError = (result: ResolveTargetResult) => {
    expect(result.ok).toBe(false);
    if (result.error === undefined) {
      throw new Error("expected resolveTarget to return an error");
    }
  };
>>>>>>> upstream/main

  it("should error on normalization failure with allowlist (implicit mode)", () => {
    const result = resolveTarget({
      to: "invalid-target",
      mode: "implicit",
      allowFrom: implicitAllowFrom,
    });

<<<<<<< HEAD
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
=======
    expectResolveTargetError(result);
>>>>>>> upstream/main
  });

  it("should error when no target provided with allowlist", () => {
    const result = resolveTarget({
      to: undefined,
      mode: "implicit",
      allowFrom: implicitAllowFrom,
    });

<<<<<<< HEAD
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
=======
    expectResolveTargetError(result);
>>>>>>> upstream/main
  });

  it("should error when no target and no allowlist", () => {
    const result = resolveTarget({
      to: undefined,
      mode: "explicit",
      allowFrom: [],
    });

<<<<<<< HEAD
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
=======
    expectResolveTargetError(result);
>>>>>>> upstream/main
  });

  it("should handle whitespace-only target", () => {
    const result = resolveTarget({
      to: "   ",
      mode: "explicit",
      allowFrom: [],
    });

<<<<<<< HEAD
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
=======
    expectResolveTargetError(result);
>>>>>>> upstream/main
  });
}
