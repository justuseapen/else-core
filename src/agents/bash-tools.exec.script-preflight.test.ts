/**
 * Exec script preflight tests.
 * Covers Python/Node script file validation, shell-bleed detection, and
 * symlink/path race handling before execution.
 */
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { __setFsSafeTestHooksForTest } from "@openclaw/fs-safe/test-hooks";
import { afterEach, describe, expect, it, vi } from "vitest";
import { withTempDir } from "../test-utils/temp-dir.js";
import { testing, createExecTool } from "./bash-tools.exec.js";

vi.mock("./bash-tools.exec-host-gateway.js", () => ({
  processGatewayAllowlist: async () => ({ allowWithoutEnforcedCommand: true }),
}));

vi.mock("./bash-tools.exec-host-node.js", () => ({
  executeNodeHostCommand: async () => {
    throw new Error("node host execution is not used by script preflight tests");
  },
}));

vi.mock("../utils/delivery-context.js", () => ({
  normalizeDeliveryContext: (value: unknown) => value,
}));

const isWin = process.platform === "win32";

const describeNonWin = isWin ? describe.skip : describe;
const describeWin = isWin ? describe : describe.skip;
<<<<<<< HEAD
=======
const parseOpenClawChannelsLoginShellCommand = testing.parseOpenClawChannelsLoginShellCommand;
const validateExecScriptPreflight = testing.validateScriptFileForShellBleed;
const createPreflightTool = () =>
  createExecTool({ host: "gateway", security: "full", ask: "on-miss" });

afterEach(() => {
  __setFsSafeTestHooksForTest();
});

async function expectSymlinkSwapDuringPreflightToAvoidErrors(params: {
  hookName: "afterPreOpenLstat" | "beforeOpen";
}) {
  await withTempDir("openclaw-exec-preflight-open-race-", async (parent) => {
    const workdir = path.join(parent, "workdir");
    const scriptPath = path.join(workdir, "script.js");
    const outsidePath = path.join(parent, "outside.js");
    await fs.mkdir(workdir, { recursive: true });
    await fs.writeFile(scriptPath, 'console.log("inside")', "utf-8");
    await fs.writeFile(outsidePath, 'console.log("$DM_JSON outside")', "utf-8");
    const scriptRealPath = await fs.realpath(scriptPath);

    let swapped = false;
    __setFsSafeTestHooksForTest({
      [params.hookName]: async (target: string) => {
        if (swapped || path.resolve(target) !== scriptRealPath) {
          return;
        }
        await fs.rm(scriptPath, { force: true });
        await fs.symlink(outsidePath, scriptPath);
        swapped = true;
      },
    });

    await expect(
      validateExecScriptPreflight({
        command: "node script.js",
        workdir,
      }),
    ).resolves.toBeUndefined();
    expect(swapped).toBe(true);
  });
}

describe("exec interactive OpenClaw channel login guard", () => {
  it("recognizes direct and package-runner channel login commands before execution", () => {
    expect(
      parseOpenClawChannelsLoginShellCommand("openclaw channels login --channel whatsapp"),
    ).toBe(true);
    expect(
      parseOpenClawChannelsLoginShellCommand(
        "pnpm exec openclaw channels login --channel whatsapp --verbose",
      ),
    ).toBe(true);
    expect(parseOpenClawChannelsLoginShellCommand("openclaw channels status --deep")).toBe(false);
  });

  it("blocks interactive channel login commands from exec", async () => {
    const tool = createPreflightTool();

    await expect(
      tool.execute("call-openclaw-channel-login", {
        command: "openclaw channels login --channel whatsapp --verbose",
      }),
    ).rejects.toThrow(/exec cannot run interactive OpenClaw channel login commands/);
    await expect(
      tool.execute("call-wrapped-openclaw-channel-login", {
        command: "sudo -u openclaw bash -lc 'openclaw channels login --channel whatsapp'",
      }),
    ).rejects.toThrow(/exec cannot run interactive OpenClaw channel login commands/);
    await expect(
      tool.execute("call-clustered-sudo-channel-login", {
        command: "sudo -EH bash -lc 'openclaw channels login --channel whatsapp'",
      }),
    ).rejects.toThrow(/exec cannot run interactive OpenClaw channel login commands/);
    await expect(
      tool.execute("call-deep-env-channel-login", {
        command: "env env env env env env openclaw channels login --channel whatsapp",
      }),
    ).rejects.toThrow(/exec cannot run interactive OpenClaw channel login commands/);
    await expect(
      tool.execute("call-env-s-trailing-channel-login", {
        command: "env -S 'openclaw channels' login --channel whatsapp",
      }),
    ).rejects.toThrow(/exec cannot run interactive OpenClaw channel login commands/);
  });
});
>>>>>>> upstream/main

describeNonWin("exec script preflight", () => {
  it("blocks shell env var injection tokens in python scripts before execution", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");

      await fs.writeFile(
        pyPath,
        [
          "import json",
          "# model accidentally wrote shell syntax:",
          "payload = $DM_JSON",
          "print(payload)",
        ].join("\n"),
        "utf-8",
      );

      const tool = createPreflightTool();

      await expect(
        tool.execute("call1", {
          command: "python bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("blocks obvious shell-as-js output before node execution", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const jsPath = path.join(tmp, "bad.js");

      await fs.writeFile(
        jsPath,
        ['NODE "$TMPDIR/hot.json"', "console.log('hi')"].join("\n"),
        "utf-8",
      );

      const tool = createPreflightTool();

      await expect(
        tool.execute("call1", {
          command: "node bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(
        /exec preflight: (detected likely shell variable injection|JS file starts with shell syntax)/,
      );
    });
  });

  it("blocks shell env var injection when script path is quoted", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const jsPath = path.join(tmp, "bad.js");
      await fs.writeFile(jsPath, "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-quoted", {
          command: 'node "bad.js"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

<<<<<<< HEAD
=======
  it("validates in-workdir scripts whose names start with '..'", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const jsPath = path.join(tmp, "..bad.js");
      await fs.writeFile(jsPath, "const value = $DM_JSON;", "utf-8");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-dotdot-prefix-script", {
          command: "node ..bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates in-workdir symlinked script entrypoints", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const targetPath = path.join(tmp, "bad-target.js");
      const linkPath = path.join(tmp, "link.js");
      await fs.writeFile(targetPath, "const value = $DM_JSON;", "utf-8");
      await fs.symlink(targetPath, linkPath);

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-symlink-entrypoint", {
          command: "node link.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates scripts under literal tilde directories in workdir", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const literalTildeDir = path.join(tmp, "~");
      await fs.mkdir(literalTildeDir, { recursive: true });
      await fs.writeFile(path.join(literalTildeDir, "bad.js"), "const value = $DM_JSON;", "utf-8");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-literal-tilde-path", {
          command: 'node "~/bad.js"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

>>>>>>> upstream/main
  it("validates python scripts when interpreter is prefixed with env", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-env-python", {
          command: "env python bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates python scripts when interpreter is prefixed with path-qualified env", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-abs-env-python", {
          command: "/usr/bin/env python bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node scripts when interpreter is prefixed with env", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const jsPath = path.join(tmp, "bad.js");
      await fs.writeFile(jsPath, "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-env-node", {
          command: "env node bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates the first positional python script operand when extra args follow", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.py"), "payload = $DM_JSON", "utf-8");
      await fs.writeFile(path.join(tmp, "ghost.py"), "print('ok')", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-python-first-script", {
          command: "python bad.py ghost.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates python script operand even when trailing option values look like scripts", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "script.py"), "payload = $DM_JSON", "utf-8");
      await fs.writeFile(path.join(tmp, "out.py"), "print('ok')", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-python-trailing-option-value", {
          command: "python script.py --output out.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates the first positional node script operand when extra args follow", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "app.js"), "const value = $DM_JSON;", "utf-8");
      await fs.writeFile(path.join(tmp, "config.js"), "console.log('ok')", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-first-script", {
          command: "node app.js config.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("still resolves node script when --require consumes a preceding .js option value", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bootstrap.js"), "console.log('bootstrap')", "utf-8");
      await fs.writeFile(path.join(tmp, "app.js"), "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-require-script", {
          command: "node --require bootstrap.js app.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node --require preload modules before a benign entry script", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad-preload.js"), "const value = $DM_JSON;", "utf-8");
      await fs.writeFile(path.join(tmp, "app.js"), "console.log('ok')", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-preload-before-entry", {
          command: "node --require bad-preload.js app.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node --require preload modules when no entry script is provided", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-require-only", {
          command: "node --require bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node --import preload modules when no entry script is provided", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-import-only", {
          command: "node --import bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node --require preload modules even when -e is present", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-require-with-eval", {
          command: 'node --require bad.js -e "console.log(123)"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("validates node --import preload modules even when -e is present", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

<<<<<<< HEAD
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
=======
      const tool = createPreflightTool();
>>>>>>> upstream/main
      await expect(
        tool.execute("call-node-import-with-eval", {
          command: 'node --import bad.js -e "console.log(123)"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
<<<<<<< HEAD
=======
    });
  });

  it("skips script-file preflight in yolo host mode", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const jsPath = path.join(tmp, "bad.js");
      await fs.writeFile(jsPath, "const value = $DM_JSON;", "utf-8");

      const tool = createExecTool({
        host: "gateway",
        security: "full",
        ask: "off",
        allowBackground: false,
      });
      const result = await tool.execute("call-yolo-bad-js", {
        command: "node bad.js",
        workdir: tmp,
      });
      const text = result.content.find((c) => c.type === "text")?.text ?? "";

      expect(text).not.toMatch(/exec preflight:/);
      expect((result.details as { status?: string }).status).toMatch(/completed|failed/);
>>>>>>> upstream/main
    });
  });

  it("runs heredoc-backed node commands in yolo host mode", async () => {
    const tool = createExecTool({
      host: "gateway",
      security: "full",
      ask: "off",
      allowBackground: false,
    });
    const result = await tool.execute("call-yolo-heredoc", {
      command: "node <<'NODE'\nprocess.stdout.write('ok')\nNODE",
    });
    const text = result.content.find((c) => c.type === "text")?.text?.trim();

    expect((result.details as { status?: string }).status).toBe("completed");
    expect(text).toBe("ok");
  });

  it("skips preflight file reads for script paths outside the workdir", async () => {
    await withTempDir("openclaw-exec-preflight-parent-", async (parent) => {
      const outsidePath = path.join(parent, "outside.js");
      const workdir = path.join(parent, "workdir");
      await fs.mkdir(workdir, { recursive: true });
      await fs.writeFile(outsidePath, "const value = $DM_JSON;", "utf-8");

      await expect(
        validateExecScriptPreflight({
          command: "node ../outside.js",
          workdir,
        }),
      ).resolves.toBeUndefined();
    });
  });

  it("does not trust a swapped script pathname between validation and read", async () => {
    await expectSymlinkSwapDuringPreflightToAvoidErrors({
      hookName: "afterPreOpenLstat",
    });
  });

  it("handles pre-open symlink swaps without surfacing preflight errors", async () => {
    await expectSymlinkSwapDuringPreflightToAvoidErrors({
      hookName: "beforeOpen",
    });
  });

  it("opens preflight script reads with O_NONBLOCK to avoid FIFO stalls", async () => {
    await withTempDir("openclaw-exec-preflight-nonblock-", async (tmp) => {
      const scriptPath = path.join(tmp, "script.js");
      await fs.writeFile(scriptPath, 'console.log("ok")', "utf-8");
      const scriptRealPath = await fs.realpath(scriptPath);

      const scriptOpenFlags: number[] = [];
      __setFsSafeTestHooksForTest({
        beforeOpen: (target, flags) => {
          if (path.resolve(target) === scriptRealPath) {
            scriptOpenFlags.push(flags);
          }
        },
      });

      await expect(
        validateExecScriptPreflight({
          command: "node script.js",
          workdir: tmp,
        }),
      ).resolves.toBeUndefined();
      expect(scriptOpenFlags).not.toStrictEqual([]);
      expect(scriptOpenFlags.every((flags) => (flags & fsConstants.O_NONBLOCK) !== 0)).toBe(true);
    });
  });

  const failClosedCases = [
    ["piped interpreter command", "cat bad.py | python"],
    ["top-level control-flow", "if true; then python bad.py; fi"],
    ["multiline top-level control-flow", "if true; then\npython bad.py\nfi"],
    ["shell-wrapped quoted script path", `bash -c "python 'bad.py'"`],
    ["top-level control-flow with quoted script path", 'if true; then python "bad.py"; fi'],
    ["shell-wrapped interpreter", 'bash -c "python bad.py"'],
    ["shell-wrapped control-flow payload", 'bash -c "if true; then python bad.py; fi"'],
    ["env-prefixed shell wrapper", 'env bash -c "python bad.py"'],
    ["absolute shell path", '/bin/bash -c "python bad.py"'],
    ["long option with separate value", 'bash --rcfile shell.rc -c "python bad.py"'],
    ["leading long options", 'bash --noprofile --norc -c "python bad.py"'],
    ["combined shell flags", 'bash -xc "python bad.py"'],
    ["-O option value", 'bash -O extglob -c "python bad.py"'],
    ["-o option value", 'bash -o errexit -c "python bad.py"'],
    ["-c not trailing short flag", 'bash -ceu "python bad.py"'],
    ["process substitution", "python <(cat bad.py)"],
  ] as const;

  it.each(failClosedCases)("fails closed for %s", async (_name, command) => {
    await expect(
      validateExecScriptPreflight({
        command,
        workdir: process.cwd(),
      }),
    ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
  });

  const passCases = [
    ["shell-wrapped echoed interpreter words", 'bash -c "echo python"'],
    ["direct inline interpreter command", 'node -e "console.log(123)"'],
    ["interpreter and script hints only in echoed text", "echo 'python bad.py | python'"],
    ["shell keyword-like text only as echo arguments", "echo time python bad.py; cat"],
    ["pipeline containing only interpreter words as plain text", "echo python | cat"],
    ["non-executing pipeline that only prints interpreter words", "printf node | wc -c"],
    ["script-like text in a separate command segment", "echo bad.py; python --version"],
    ["script hints outside interpreter segment with &&", "node --version && ls *.py"],
    [
      "piped interpreter version command with script-like upstream text",
      "echo bad.py | node --version",
    ],
    ["piped node -c command with script-like upstream text", "echo bad.py | node -c ok.js"],
    [
      "piped node -e command with inline script-like text",
      "node -e \"console.log('bad.py')\" | cat",
    ],
    ["escaped shell operator characters", "echo python bad.py \\| node"],
    ["escaped semicolons with interpreter hints", "echo python bad.py \\; node"],
    ["node -e with .py inside quoted inline code", "node -e \"console.log('bad.py')\""],
  ] as const;

  it.each(passCases)("does not fail closed for %s", async (_name, command) => {
    await expect(
      validateExecScriptPreflight({
        command,
        workdir: process.cwd(),
      }),
    ).resolves.toBeUndefined();
  });
});

describeWin("exec script preflight on windows path syntax", () => {
  it("preserves windows-style python relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.py"), "payload = $DM_JSON", "utf-8");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-win-python-relative", {
          command: "python .\\bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style node relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-win-node-relative", {
          command: "node .\\bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style python absolute drive paths during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      const absPath = path.join(tmp, "bad.py");
      await fs.writeFile(absPath, "payload = $DM_JSON", "utf-8");
      const winAbsPath = absPath.replaceAll("/", "\\");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-win-python-absolute", {
          command: `python "${winAbsPath}"`,
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style nested relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.mkdir(path.join(tmp, "subdir"), { recursive: true });
      await fs.writeFile(path.join(tmp, "subdir", "bad.py"), "payload = $DM_JSON", "utf-8");

      const tool = createPreflightTool();
      await expect(
        tool.execute("call-win-python-subdir-relative", {
          command: "python subdir\\bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("fails closed for piped interpreter commands that bypass direct script parsing", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-pipe", {
          command: "cat bad.py | python",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for top-level interpreter invocations inside shell control-flow", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-top-level-control-flow", {
          command: "if true; then python bad.py; fi",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for multiline top-level control-flow interpreter invocations", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-top-level-control-flow-multiline", {
          command: "if true; then\npython bad.py\nfi",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations with quoted script paths", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-quoted-script", {
          command: `bash -c "python '${path.basename(pyPath)}'"`,
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for top-level control-flow with quoted interpreter script paths", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-top-level-control-flow-quoted-script", {
          command: 'if true; then python "bad.py"; fi',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap", {
          command: 'bash -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("does not fail closed for shell-wrapped payloads that only echo interpreter words", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-shell-wrap-echo-text", {
        command: 'bash -c "echo python"',
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("python");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations inside control-flow payloads", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-control-flow", {
          command: 'bash -c "if true; then python bad.py; fi"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for env-prefixed shell-wrapped interpreter invocations", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-env-shell-wrap", {
          command: 'env bash -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations via absolute shell paths", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-abs-path", {
          command: '/bin/bash -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations when long options take separate values", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");
      await fs.writeFile(path.join(tmp, "shell.rc"), "# rc", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-long-option-value", {
          command: 'bash --rcfile shell.rc -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations with leading long options", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-long-options", {
          command: 'bash --noprofile --norc -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations with combined shell flags", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-combined", {
          command: 'bash -xc "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations when -O consumes a separate value", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-short-option-O-value", {
          command: 'bash -O extglob -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations when -o consumes a separate value", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-short-option-o-value", {
          command: 'bash -o errexit -c "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for shell-wrapped interpreter invocations when -c is not the trailing short flag", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-shell-wrap-short-flags", {
          command: 'bash -ceu "python bad.py"',
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("fails closed for process-substitution interpreter invocations", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const pyPath = path.join(tmp, "bad.py");
      await fs.writeFile(pyPath, "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call-process-substitution", {
          command: "python <(cat bad.py)",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: complex interpreter invocation detected/);
    });
  });

  it("allows direct inline interpreter commands with no script file hint", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-inline", {
        command: 'node -e "console.log(123)"',
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("123");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when interpreter and script hints only appear in echoed text", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-echo-text", {
        command: "echo 'python bad.py | python'",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("python bad.py | python");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when shell keyword-like text appears only as echo arguments", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-echo-keyword-like-text", {
        command: "echo time python bad.py; cat",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("time python bad.py");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for pipelines that only contain interpreter words as plain text", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-echo-pipe-text", {
        command: "echo python | cat",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("python");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for non-executing pipelines that only print interpreter words", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-printf-pipe-text", {
        command: "printf node | wc -c",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("4");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when script-like text is in a separate command segment", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-separate-script-hint-segment", {
        command: "echo bad.py; python --version",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("bad.py");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when script hints appear outside the interpreter segment with &&", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "sample.py"), "print('ok')", "utf-8");
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-interpreter-version-and-list", {
        command: "node --version && ls *.py",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("sample.py");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for piped interpreter version commands with script-like upstream text", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-piped-interpreter-version", {
        command: "echo bad.py | node --version",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toMatch(/v\d+/);
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for piped node -c syntax-check commands with script-like upstream text", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "ok.js"), "console.log('ok')", "utf-8");
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-piped-node-check", {
        command: "echo bad.py | node -c ok.js",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for piped node -e commands when inline code contains script-like text", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-piped-node-e-inline-script-hint", {
        command: "node -e \"console.log('bad.py')\" | cat",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("bad.py");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when shell operator characters are escaped", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-echo-escaped-operator", {
        command: "echo python bad.py \\| node",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("python bad.py | node");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed when escaped semicolons appear with interpreter hints", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-echo-escaped-semicolon", {
        command: "echo python bad.py \\; node",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("python bad.py ; node");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("does not fail closed for node -e when .py appears inside quoted inline code", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-inline-script-hint", {
        command: "node -e \"console.log('bad.py')\"",
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).toContain("bad.py");
      expect(text).not.toMatch(/exec preflight:/);
    });
  });
});

describeWin("exec script preflight on windows path syntax", () => {
  it("preserves windows-style python relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.py"), "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
      await expect(
        tool.execute("call-win-python-relative", {
          command: "python .\\bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style node relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.writeFile(path.join(tmp, "bad.js"), "const value = $DM_JSON;", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
      await expect(
        tool.execute("call-win-node-relative", {
          command: "node .\\bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style python absolute drive paths during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      const absPath = path.join(tmp, "bad.py");
      await fs.writeFile(absPath, "payload = $DM_JSON", "utf-8");
      const winAbsPath = absPath.replaceAll("/", "\\");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
      await expect(
        tool.execute("call-win-python-absolute", {
          command: `python "${winAbsPath}"`,
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("preserves windows-style nested relative path separators during script extraction", async () => {
    await withTempDir("openclaw-exec-preflight-win-", async (tmp) => {
      await fs.mkdir(path.join(tmp, "subdir"), { recursive: true });
      await fs.writeFile(path.join(tmp, "subdir", "bad.py"), "payload = $DM_JSON", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
      await expect(
        tool.execute("call-win-python-subdir-relative", {
          command: "python subdir\\bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });
});

describe("exec interpreter heuristics ReDoS guard", () => {
  it("does not hang on long commands with VAR=value assignments and whitespace-heavy text", async () => {
    // Simulate a heredoc with HTML content after a VAR= assignment. Keep the
    // command parser check direct so no shell process timing hides regex cost.
    const htmlBlock = '<section style="padding: 30px 20px; font-family: Arial;">'.repeat(50);
    const command = `ACCESS_TOKEN=$(__openclaw_missing_redos_guard__)\ncat > /tmp/out.html << 'EOF'\n${htmlBlock}\nEOF`;

    const start = Date.now();
    await validateExecScriptPreflight({ command, workdir: process.cwd() });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });
});
