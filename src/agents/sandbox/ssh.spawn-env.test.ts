<<<<<<< HEAD
=======
// SSH spawn-env tests ensure subprocesses inherit only safe environment values
// while command execution and uploads run through ssh.
>>>>>>> upstream/main
import type { ChildProcess, SpawnOptions } from "node:child_process";
import { EventEmitter } from "node:events";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
<<<<<<< HEAD
=======
import { captureFullEnv } from "../../test-utils/env.js";
>>>>>>> upstream/main

const spawnMock = vi.hoisted(() => vi.fn());

type MockChildProcess = EventEmitter & {
  stdin: PassThrough;
  stdout: PassThrough;
  stderr: PassThrough;
  kill: ReturnType<typeof vi.fn>;
};

function createMockChildProcess(): MockChildProcess {
  const child = new EventEmitter() as MockChildProcess;
  child.stdin = new PassThrough();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.kill = vi.fn();
  return child;
}

vi.mock("node:child_process", async () => {
  const actual = await vi.importActual<typeof import("node:child_process")>("node:child_process");
  return {
    ...actual,
    spawn: spawnMock,
  };
});

<<<<<<< HEAD
=======
function mockSuccessfulSpawnCalls(times = 1) {
  let chain = spawnMock;
  for (let i = 0; i < times; i += 1) {
    chain = chain.mockImplementationOnce(
      (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
        const child = createMockChildProcess();
        process.nextTick(() => {
          child.emit("close", 0);
        });
        return child as unknown as ChildProcess;
      },
    );
  }
}

function spawnOptionsAt(index: number): SpawnOptions {
  // Secret filtering happens at the child_process.spawn boundary, so tests read
  // the captured SpawnOptions env directly.
  const options = spawnMock.mock.calls[index]?.[2] as SpawnOptions | undefined;
  if (!options) {
    throw new Error(`expected spawn options for call ${index}`);
  }
  return options;
}

>>>>>>> upstream/main
let runSshSandboxCommand: typeof import("./ssh.js").runSshSandboxCommand;
let uploadDirectoryToSshTarget: typeof import("./ssh.js").uploadDirectoryToSshTarget;

describe("ssh subprocess env sanitization", () => {
<<<<<<< HEAD
  const originalEnv = { ...process.env };
  const tempDirs: string[] = [];

  beforeEach(async () => {
=======
  const tempDirs: string[] = [];
  let envSnapshot: ReturnType<typeof captureFullEnv>;

  beforeEach(async () => {
    envSnapshot = captureFullEnv();
>>>>>>> upstream/main
    vi.resetModules();
    vi.clearAllMocks();
    ({ runSshSandboxCommand, uploadDirectoryToSshTarget } = await import("./ssh.js"));
  });

  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map(async (dir) => {
        await fs.rm(dir, { recursive: true, force: true });
      }),
    );
<<<<<<< HEAD
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, originalEnv);
  });

  it("filters blocked secrets before spawning ssh commands", async () => {
    spawnMock.mockImplementationOnce(
      (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
        const child = createMockChildProcess();
        process.nextTick(() => {
          child.emit("close", 0);
        });
        return child as unknown as ChildProcess;
      },
    );
=======
    envSnapshot.restore();
  });

  it("filters blocked secrets before spawning ssh commands", async () => {
    mockSuccessfulSpawnCalls();
>>>>>>> upstream/main

    process.env.OPENAI_API_KEY = "sk-test-secret";
    process.env.LANG = "en_US.UTF-8";

    await runSshSandboxCommand({
      session: {
        command: "ssh",
        configPath: "/tmp/openclaw-test-ssh-config",
        host: "openclaw-sandbox",
      },
      remoteCommand: "true",
    });

<<<<<<< HEAD
    const spawnOptions = spawnMock.mock.calls[0]?.[2] as SpawnOptions | undefined;
    const env = spawnOptions?.env;
=======
    const env = spawnOptionsAt(0).env;
>>>>>>> upstream/main
    expect(env?.OPENAI_API_KEY).toBeUndefined();
    expect(env?.LANG).toBe("en_US.UTF-8");
  });

  it("filters blocked secrets before spawning ssh uploads", async () => {
<<<<<<< HEAD
    spawnMock
      .mockImplementationOnce(
        (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
          const child = createMockChildProcess();
          process.nextTick(() => {
            child.emit("close", 0);
          });
          return child as unknown as ChildProcess;
        },
      )
      .mockImplementationOnce(
        (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
          const child = createMockChildProcess();
          process.nextTick(() => {
            child.emit("close", 0);
          });
          return child as unknown as ChildProcess;
        },
      );
=======
    mockSuccessfulSpawnCalls(2);
>>>>>>> upstream/main

    process.env.ANTHROPIC_API_KEY = "sk-test-secret";
    process.env.NODE_ENV = "test";
    const localDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-ssh-upload-env-"));
    tempDirs.push(localDir);

    await uploadDirectoryToSshTarget({
      session: {
        command: "ssh",
        configPath: "/tmp/openclaw-test-ssh-config",
        host: "openclaw-sandbox",
      },
      localDir,
      remoteDir: "/remote/workspace",
    });

<<<<<<< HEAD
    const sshSpawnOptions = spawnMock.mock.calls[1]?.[2] as SpawnOptions | undefined;
    const env = sshSpawnOptions?.env;
=======
    const env = spawnOptionsAt(1).env;
>>>>>>> upstream/main
    expect(env?.ANTHROPIC_API_KEY).toBeUndefined();
    expect(env?.NODE_ENV).toBe("test");
  });

  it.runIf(process.platform !== "win32")(
    "allows in-workspace symlinks to upload normally",
    async () => {
<<<<<<< HEAD
      spawnMock
        .mockImplementationOnce(
          (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
            const child = createMockChildProcess();
            process.nextTick(() => {
              child.emit("close", 0);
            });
            return child as unknown as ChildProcess;
          },
        )
        .mockImplementationOnce(
          (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
            const child = createMockChildProcess();
            process.nextTick(() => {
              child.emit("close", 0);
            });
            return child as unknown as ChildProcess;
          },
        );
=======
      mockSuccessfulSpawnCalls(2);
>>>>>>> upstream/main

      const localDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-ssh-upload-safe-"));
      tempDirs.push(localDir);
      await fs.mkdir(path.join(localDir, "real"), { recursive: true });
      await fs.writeFile(path.join(localDir, "real", "payload.txt"), "ok\n", "utf8");
      await fs.symlink("real", path.join(localDir, "linked-dir"));

      await uploadDirectoryToSshTarget({
        session: {
          command: "ssh",
          configPath: "/tmp/openclaw-test-ssh-config",
          host: "openclaw-sandbox",
        },
        localDir,
        remoteDir: "/remote/workspace",
      });

      expect(spawnMock).toHaveBeenCalledTimes(2);
    },
  );
});
