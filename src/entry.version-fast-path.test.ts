<<<<<<< HEAD
import process from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { importFreshModule } from "../test/helpers/import-fresh.js";

const applyCliProfileEnvMock = vi.hoisted(() => vi.fn());
const attachChildProcessBridgeMock = vi.hoisted(() => vi.fn());
const installProcessWarningFilterMock = vi.hoisted(() => vi.fn());
const isMainModuleMock = vi.hoisted(() => vi.fn(() => true));
const isRootHelpInvocationMock = vi.hoisted(() => vi.fn(() => false));
const isRootVersionInvocationMock = vi.hoisted(() => vi.fn(() => true));
const normalizeEnvMock = vi.hoisted(() => vi.fn());
const normalizeWindowsArgvMock = vi.hoisted(() => vi.fn((argv: string[]) => argv));
const parseCliProfileArgsMock = vi.hoisted(() => vi.fn((argv: string[]) => ({ ok: true, argv })));
const resolveCliContainerTargetMock = vi.hoisted(() => vi.fn<() => string | null>(() => null));
const resolveCommitHashMock = vi.hoisted(() => vi.fn<() => string | null>(() => "abc1234"));
const runCliMock = vi.hoisted(() => vi.fn(async () => {}));
const shouldSkipRespawnForArgvMock = vi.hoisted(() => vi.fn(() => true));
=======
// Tests version fast-path output before the full entrypoint loads.
import { describe, expect, it, vi } from "vitest";
import { tryHandleRootVersionFastPath } from "./entry.version-fast-path.js";
>>>>>>> upstream/main

vi.mock("./cli/argv.js", () => ({
  isRootHelpInvocation: () => false,
  isRootVersionInvocation: (argv: string[]) => argv.includes("--version"),
}));

vi.mock("./cli/container-target.js", () => ({
  parseCliContainerArgs: (argv: string[]) => ({ ok: true, container: null, argv }),
  resolveCliContainerTarget: (argv: string[], env: NodeJS.ProcessEnv = process.env) =>
    argv.includes("--container") ? "demo" : (env.OPENCLAW_CONTAINER ?? null),
}));

async function flushVersionFastPath() {
  await Promise.resolve();
  await Promise.resolve();
}

async function importEntry(scope: string) {
  return await importFreshModule<typeof import("./entry.js")>(
    import.meta.url,
    `./entry.js?scope=${scope}`,
  );
}

describe("entry root version fast path", () => {
  it("prints version output and skips host handling when container-targeted", async () => {
    const output = vi.fn();
    const exit = vi.fn();
    const resolveVersion = vi.fn<
      () => Promise<{
        VERSION: string;
        resolveCommitHash: (params: { moduleUrl: string }) => string | null;
      }>
    >(async () => ({
      VERSION: "9.9.9-test",
      resolveCommitHash: vi.fn(() => "abc1234"),
    }));

<<<<<<< HEAD
  beforeEach(() => {
    vi.clearAllMocks();
    originalArgv = [...process.argv];
    originalGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
    delete process.env.OPENCLAW_GATEWAY_TOKEN;
    process.argv = ["node", "openclaw", "--version"];
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(((_code?: number) => undefined) as typeof process.exit);
  });

  afterEach(() => {
    process.argv = originalArgv;
    if (originalGatewayToken === undefined) {
      delete process.env.OPENCLAW_GATEWAY_TOKEN;
    } else {
      process.env.OPENCLAW_GATEWAY_TOKEN = originalGatewayToken;
    }
    exitSpy.mockRestore();
  });

  it("prints commit-tagged version output when commit metadata is available", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await importEntry("commit-tagged");
    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith("OpenClaw 9.9.9-test (abc1234)");
      expect(exitSpy).toHaveBeenCalledWith(0);
=======
    expect(
      tryHandleRootVersionFastPath(["node", "openclaw", "--version"], {
        output,
        exit,
        resolveVersion,
      }),
    ).toBe(true);
    await flushVersionFastPath();
    expect(output).toHaveBeenCalledWith("OpenClaw 9.9.9-test (abc1234)");
    expect(exit).toHaveBeenCalledWith(0);

    output.mockClear();
    exit.mockClear();
    resolveVersion.mockResolvedValueOnce({
      VERSION: "9.9.9-test",
      resolveCommitHash: vi.fn(() => null),
>>>>>>> upstream/main
    });

    expect(
      tryHandleRootVersionFastPath(["node", "openclaw", "--version"], {
        output,
        exit,
        resolveVersion,
      }),
    ).toBe(true);
    await flushVersionFastPath();
    expect(output).toHaveBeenCalledWith("OpenClaw 9.9.9-test");
    expect(exit).toHaveBeenCalledWith(0);

    output.mockClear();
    exit.mockClear();
    expect(
      tryHandleRootVersionFastPath(["node", "openclaw", "--container", "demo", "--version"], {
        output,
        exit,
        resolveVersion,
      }),
    ).toBe(false);
    expect(resolveVersion).toHaveBeenCalledTimes(2);
    expect(output).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();

<<<<<<< HEAD
    await importEntry("plain-version");
    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith("OpenClaw 9.9.9-test");
      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    logSpy.mockRestore();
  });

  it("skips the host version fast path when a container target is active", async () => {
    resolveCliContainerTargetMock.mockReturnValue("demo");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await importEntry("container-target");
    await vi.waitFor(() => {
      expect(runCliMock).toHaveBeenCalledWith(["node", "openclaw", "--version"]);
    });
    expect(logSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it("allows root version container mode when gateway override env vars are set", async () => {
    resolveCliContainerTargetMock.mockReturnValue("demo");
    process.env.OPENCLAW_GATEWAY_TOKEN = "demo-token";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await importEntry("gateway-override");
    await vi.waitFor(() => {
      expect(runCliMock).toHaveBeenCalledWith(["node", "openclaw", "--version"]);
    });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
=======
    expect(
      tryHandleRootVersionFastPath(["node", "openclaw", "--version"], {
        env: { OPENCLAW_CONTAINER: "demo" },
        output,
        exit,
        resolveVersion,
      }),
    ).toBe(false);
>>>>>>> upstream/main
  });
});
