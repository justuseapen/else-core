// Tests install shell script version references stay aligned with package metadata.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanupTempDirs, makeTempDir } from "../test/helpers/temp-dir.js";
<<<<<<< HEAD

const tempRoots: string[] = [];

function withFakeCli(versionOutput: string): { root: string; cliPath: string } {
  const root = makeTempDir(tempRoots, "openclaw-install-sh-");
  const cliPath = path.join(root, "openclaw");
  const escapedOutput = versionOutput.replace(/'/g, "'\\''");
  fs.writeFileSync(
    cliPath,
    `#!/usr/bin/env bash
printf '%s\n' '${escapedOutput}'
`,
    "utf-8",
  );
  fs.chmodSync(cliPath, 0o755);
  return { root, cliPath };
=======

const tempRoots: string[] = [];
const installerPath = path.join(process.cwd(), "scripts", "install.sh");
const installerSource = fs.readFileSync(installerPath, "utf-8");
const versionHelperStart = installerSource.indexOf("load_install_version_helpers() {");
const versionHelperEnd = installerSource.indexOf("\nis_gateway_daemon_loaded() {");

if (versionHelperStart < 0 || versionHelperEnd < 0) {
  throw new Error("install.sh version helper block not found");
>>>>>>> upstream/main
}

const versionHelperSource = installerSource.slice(versionHelperStart, versionHelperEnd);

function resolveInstallerVersionCases(params: { stdinCwd: string }): string[] {
  const output = execFileSync(
    "bash",
    [
      "-c",
      `${versionHelperSource}
fake_openclaw_decorated() { printf '%s\\n' 'OpenClaw 2026.3.10 (abcdef0)'; }
fake_openclaw_raw() { printf '%s\\n' "OpenClaw dev's build"; }
OPENCLAW_BIN=fake_openclaw_decorated resolve_openclaw_version
OPENCLAW_BIN=fake_openclaw_raw resolve_openclaw_version
(
  cd "$1"
  source /dev/stdin <<'OPENCLAW_STDIN_INSTALLER'
${versionHelperSource}
fake_openclaw_stdin() { printf '%s\\n' 'OpenClaw 2026.3.10 (abcdef0)'; }
OPENCLAW_BIN=fake_openclaw_stdin
resolve_openclaw_version
OPENCLAW_STDIN_INSTALLER
)`,
      "openclaw-version-test",
      params.stdinCwd,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf-8",
      env: {
        ...process.env,
        OPENCLAW_INSTALL_SH_NO_RUN: "1",
      },
    },
  );
  return output.trimEnd().split("\n");
}

describe("install.sh version resolution", () => {
  afterEach(() => {
    cleanupTempDirs(tempRoots);
  });

  it.runIf(process.platform !== "win32")(
    "parses CLI versions and keeps stdin helpers isolated from cwd",
    () => {
<<<<<<< HEAD
      const fixture = withFakeCli("OpenClaw 2026.3.10 (abcdef0)");

      expect(resolveVersionFromInstaller(fixture.cliPath)).toBe("2026.3.10");
    },
  );

  it.runIf(process.platform !== "win32")(
    "falls back to raw output when no semantic version is present",
    () => {
      const fixture = withFakeCli("OpenClaw dev's build");

      expect(resolveVersionFromInstaller(fixture.cliPath)).toBe("OpenClaw dev's build");
    },
  );

  it.runIf(process.platform !== "win32")(
    "does not source version helpers from cwd when installer runs via stdin",
    () => {
      const fixture = withFakeCli("OpenClaw 2026.3.10 (abcdef0)");

=======
>>>>>>> upstream/main
      const hostileCwd = makeTempDir(tempRoots, "openclaw-install-stdin-");
      const hostileHelper = path.join(
        hostileCwd,
        "docker",
        "install-sh-common",
        "version-parse.sh",
      );
      fs.mkdirSync(path.dirname(hostileHelper), { recursive: true });
      fs.writeFileSync(
        hostileHelper,
        `#!/usr/bin/env bash
extract_openclaw_semver() {
  printf '%s' 'poisoned'
}
`,
        "utf-8",
      );

      expect(
        resolveInstallerVersionCases({
          stdinCwd: hostileCwd,
        }),
      ).toEqual(["2026.3.10", "OpenClaw dev's build", "2026.3.10"]);
    },
  );
});
