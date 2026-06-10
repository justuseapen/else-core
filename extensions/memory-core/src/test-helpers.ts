<<<<<<< HEAD
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach } from "vitest";

export function createMemoryCoreTestHarness() {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })),
    );
  });

  async function createTempWorkspace(prefix: string): Promise<string> {
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    tempDirs.push(workspaceDir);
=======
// Memory Core helper module supports test helpers behavior.
import fs from "node:fs/promises";
import path from "node:path";
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
import { afterAll, beforeAll } from "vitest";
import {
  configureMemoryCoreDreamingStateForTests,
  resetMemoryCoreDreamingStateForTests,
} from "./dreaming-state.js";

export function createMemoryCoreTestHarness() {
  let fixtureRoot = "";
  let caseId = 0;

  beforeAll(async () => {
    await configureMemoryCoreDreamingStateForTests();
    fixtureRoot = await fs.mkdtemp(
      path.join(resolvePreferredOpenClawTmpDir(), "memory-core-test-fixtures-"),
    );
  });

  afterAll(async () => {
    if (!fixtureRoot) {
      return;
    }
    await fs.rm(fixtureRoot, { recursive: true, force: true });
    resetMemoryCoreDreamingStateForTests();
  });

  async function createTempWorkspace(prefix: string): Promise<string> {
    const workspaceDir = path.join(fixtureRoot, `${prefix}${caseId++}`);
    await fs.mkdir(workspaceDir, { recursive: true });
>>>>>>> upstream/main
    return workspaceDir;
  }

  return {
    createTempWorkspace,
  };
}
