<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { collectPreparedPrepackErrors, shouldSkipPrepack } from "../scripts/openclaw-prepack.ts";

describe("shouldSkipPrepack", () => {
  it("treats unset and explicit false values as disabled", () => {
    expect(shouldSkipPrepack({})).toBe(false);
    expect(shouldSkipPrepack({ OPENCLAW_PREPACK_PREPARED: "0" })).toBe(false);
    expect(shouldSkipPrepack({ OPENCLAW_PREPACK_PREPARED: "false" })).toBe(false);
  });

  it("treats non-false values as enabled", () => {
    expect(shouldSkipPrepack({ OPENCLAW_PREPACK_PREPARED: "1" })).toBe(true);
    expect(shouldSkipPrepack({ OPENCLAW_PREPACK_PREPARED: "true" })).toBe(true);
  });
});
=======
// OpenClaw prepack tests validate package prepack output.
import { describe, expect, it } from "vitest";
import {
  collectPreparedPrepackErrors,
  resolvePrepackCommandTimeoutMs,
  runPrepackCommand,
} from "../scripts/openclaw-prepack.ts";
>>>>>>> upstream/main

describe("collectPreparedPrepackErrors", () => {
  it("accepts prepared release artifacts", () => {
    expect(
      collectPreparedPrepackErrors(
        ["dist/index.mjs", "dist/control-ui/index.html"],
        ["dist/control-ui/assets/index-Bu8rSoJV.js"],
      ),
<<<<<<< HEAD
    ).toEqual([]);
=======
    ).toStrictEqual([]);
>>>>>>> upstream/main
  });

  it("reports missing build and control ui artifacts", () => {
    expect(collectPreparedPrepackErrors([], [])).toEqual([
      "missing required prepared artifact: dist/index.js or dist/index.mjs",
      "missing required prepared artifact: dist/control-ui/index.html",
      "missing prepared Control UI asset payload under dist/control-ui/assets/",
    ]);
  });
});
<<<<<<< HEAD
=======

describe("runPrepackCommand", () => {
  it("returns captured output for successful commands", () => {
    const result = runPrepackCommand(process.execPath, ["--eval", "process.stdout.write('ok')"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 1000,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe("ok");
  });

  it("bounds commands that ignore termination", () => {
    const startedAt = Date.now();
    const result = runPrepackCommand(
      process.execPath,
      ["--eval", "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);"],
      {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 100,
      },
    );

    expect(result.error).toBeInstanceOf(Error);
    expect(Date.now() - startedAt).toBeLessThan(2500);
  });
});

describe("resolvePrepackCommandTimeoutMs", () => {
  it("parses only positive integer environment timeouts", () => {
    expect(resolvePrepackCommandTimeoutMs({})).toBe(30 * 60 * 1000);
    expect(resolvePrepackCommandTimeoutMs({ OPENCLAW_PREPACK_COMMAND_TIMEOUT_MS: "" })).toBe(
      30 * 60 * 1000,
    );
    expect(resolvePrepackCommandTimeoutMs({ OPENCLAW_PREPACK_COMMAND_TIMEOUT_MS: "1234" })).toBe(
      1234,
    );

    for (const raw of ["nope", "10m", "1e3", "0", "-1", "9007199254740992"]) {
      expect(() =>
        resolvePrepackCommandTimeoutMs({ OPENCLAW_PREPACK_COMMAND_TIMEOUT_MS: raw }),
      ).toThrow(`invalid OPENCLAW_PREPACK_COMMAND_TIMEOUT_MS: ${raw}`);
    }
  });
});
>>>>>>> upstream/main
