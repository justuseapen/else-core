<<<<<<< HEAD
import { describe, expect, it, vi } from "vitest";
import { runGatewayHttpRequestStages } from "./server-http.js";

=======
/**
 * Tests the staged HTTP request pipeline used by the gateway server.
 */
import { describe, expect, it, vi } from "vitest";
import { runGatewayHttpRequestStages } from "./server-http.js";

type TestGatewayHttpRequestStage = Parameters<typeof runGatewayHttpRequestStages>[0][number];

async function expectContinueOnErrorStageSkips(params: {
  stageName: string;
  stageError: Error;
  stageRun: TestGatewayHttpRequestStage["run"];
  prefixStages?: TestGatewayHttpRequestStage[];
}): Promise<void> {
  const stageC = vi.fn(() => true);
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    const result = await runGatewayHttpRequestStages([
      ...(params.prefixStages ?? []),
      {
        name: params.stageName,
        continueOnError: true,
        run: params.stageRun,
      },
      { name: "c", run: stageC },
    ]);

    expect(result).toBe(true);
    expect(stageC).toHaveBeenCalled();
    expect(consoleSpy.mock.calls).toEqual([
      [`[gateway-http] stage "${params.stageName}" threw — skipping:`, params.stageError],
    ]);
  } finally {
    consoleSpy.mockRestore();
  }
}

>>>>>>> upstream/main
describe("runGatewayHttpRequestStages", () => {
  it("returns true when a stage handles the request", async () => {
    const stages = [
      { name: "a", run: () => false },
      { name: "b", run: () => true },
      { name: "c", run: () => false },
    ];
    expect(await runGatewayHttpRequestStages(stages)).toBe(true);
  });

  it("returns false when no stage handles the request", async () => {
    const stages = [
      { name: "a", run: () => false },
      { name: "b", run: () => false },
    ];
    expect(await runGatewayHttpRequestStages(stages)).toBe(false);
  });

<<<<<<< HEAD
  it("skips a throwing stage and continues to subsequent stages", async () => {
    const stageC = vi.fn(() => true);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const stages = [
      { name: "a", run: () => false },
      {
        name: "broken-facade",
        run: () => {
          throw new Error("Cannot find module '@slack/bolt'");
        },
      },
      { name: "c", run: stageC },
    ];

    const result = await runGatewayHttpRequestStages(stages);

    expect(result).toBe(true);
    expect(stageC).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('stage "broken-facade" threw'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("skips a rejecting async stage and continues", async () => {
    const stageC = vi.fn(() => true);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const stages = [
      {
        name: "async-broken",
        run: async () => {
          throw new Error("ERR_MODULE_NOT_FOUND");
        },
      },
      { name: "c", run: stageC },
    ];

    const result = await runGatewayHttpRequestStages(stages);

    expect(result).toBe(true);
    expect(stageC).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('stage "async-broken" threw'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("returns false when the only non-throwing stages do not handle", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

=======
  it("skips a throwing stage marked continueOnError and continues to subsequent stages", async () => {
    const stageError = new Error("Cannot find module '@slack/bolt'");
    await expectContinueOnErrorStageSkips({
      stageName: "broken-facade",
      stageError,
      stageRun: () => {
        throw stageError;
      },
      prefixStages: [{ name: "a", run: () => false }],
    });
  });

  it("skips a rejecting async stage marked continueOnError and continues", async () => {
    const stageError = new Error("ERR_MODULE_NOT_FOUND");
    await expectContinueOnErrorStageSkips({
      stageName: "async-broken",
      stageError,
      stageRun: async () => {
        throw stageError;
      },
    });
  });

  it("rethrows when a stage throws without continueOnError", async () => {
>>>>>>> upstream/main
    const stages = [
      {
        name: "broken",
        run: () => {
          throw new Error("load failed");
        },
      },
      { name: "unmatched", run: () => false },
    ];

<<<<<<< HEAD
    const result = await runGatewayHttpRequestStages(stages);

    expect(result).toBe(false);

    consoleSpy.mockRestore();
=======
    await expect(runGatewayHttpRequestStages(stages)).rejects.toThrow("load failed");
>>>>>>> upstream/main
  });
});
