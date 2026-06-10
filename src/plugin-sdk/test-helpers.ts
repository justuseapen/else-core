<<<<<<< HEAD
import { mkdtempSync, type RmOptions } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach } from "vitest";

export function createPluginSdkTestHarness(options?: { cleanup?: RmOptions }) {
  const tempDirs: string[] = [];

  afterEach(async () => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (!dir) {
        continue;
      }
      await rm(dir, {
        recursive: true,
        force: true,
        ...options?.cleanup,
      });
    }
  });

  async function createTempDir(prefix: string): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), prefix));
    tempDirs.push(dir);
=======
/**
 * Shared test harness for plugin SDK contract tests that need temp fixtures.
 */
import { mkdirSync, type RmOptions } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll } from "vitest";

/** Creates per-suite temp fixture helpers with automatic Vitest cleanup. */
export function createPluginSdkTestHarness(options?: { cleanup?: RmOptions }) {
  let fixtureRoot = "";
  let caseId = 0;

  beforeAll(async () => {
    fixtureRoot = await mkdtemp(path.join(tmpdir(), "openclaw-plugin-sdk-fixtures-"));
  });

  afterAll(async () => {
    if (!fixtureRoot) {
      return;
    }
    await rm(fixtureRoot, {
      recursive: true,
      force: true,
      ...options?.cleanup,
    });
  });

  function nextTempDir(prefix: string): string {
    return path.join(fixtureRoot, `${prefix}${caseId++}`);
  }

  async function createTempDir(prefix: string): Promise<string> {
    const dir = nextTempDir(prefix);
    await mkdir(dir, { recursive: true });
>>>>>>> upstream/main
    return dir;
  }

  function createTempDirSync(prefix: string): string {
<<<<<<< HEAD
    const dir = mkdtempSync(path.join(tmpdir(), prefix));
    tempDirs.push(dir);
=======
    const dir = nextTempDir(prefix);
    mkdirSync(dir, { recursive: true });
>>>>>>> upstream/main
    return dir;
  }

  return {
    createTempDir,
    createTempDirSync,
  };
}
