// Filesystem fixture helpers create plugin filesystem layouts for registry and loader tests.
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function chmodSafeDir(dir: string) {
  if (process.platform === "win32") {
    return;
  }
  fs.chmodSync(dir, 0o755);
}

/** Creates a directory with test-safe permissions. */
export function mkdirSafeDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
  chmodSafeDir(dir);
}

/** Creates and tracks a temporary directory for synchronous test cleanup. */
export function makeTrackedTempDir(prefix: string, trackedDirs: string[]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix + "-"));
  chmodSafeDir(dir);
  trackedDirs.push(dir);
  return dir;
}

<<<<<<< HEAD
export async function makeTrackedTempDirAsync(prefix: string, trackedDirs: string[]) {
  const dir = await fsPromises.mkdtemp(path.join(os.tmpdir(), String(prefix) + "-"));
=======
/** Creates and tracks a temporary directory for async test cleanup. */
export async function makeTrackedTempDirAsync(prefix: string, trackedDirs: string[]) {
  const dir = await fsPromises.mkdtemp(path.join(os.tmpdir(), prefix + "-"));
>>>>>>> upstream/main
  chmodSafeDir(dir);
  trackedDirs.push(dir);
  return dir;
}

<<<<<<< HEAD
=======
/** Removes and clears tracked temporary directories synchronously. */
>>>>>>> upstream/main
export function cleanupTrackedTempDirs(trackedDirs: string[]) {
  for (const dir of trackedDirs.splice(0)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failures
    }
  }
}

<<<<<<< HEAD
=======
/** Removes and clears tracked temporary directories asynchronously. */
>>>>>>> upstream/main
export async function cleanupTrackedTempDirsAsync(trackedDirs: string[]) {
  await Promise.all(
    trackedDirs.splice(0).map(async (dir) => {
      try {
        await fsPromises.rm(dir, { recursive: true, force: true });
      } catch {
        // ignore cleanup failures
      }
    }),
  );
}

<<<<<<< HEAD
=======
/** Creates a per-suite temp-root tracker with deterministic case directory names. */
>>>>>>> upstream/main
export function createSuiteTempRootTracker(
  prefix: string,
  baseDir = path.join(process.cwd(), ".tmp"),
) {
  let suiteTempRoot = "";
  let tempDirCounter = 0;

  function ensureSuiteTempRoot() {
    if (suiteTempRoot) {
      return suiteTempRoot;
    }
    fs.mkdirSync(baseDir, { recursive: true });
<<<<<<< HEAD
    suiteTempRoot = fs.mkdtempSync(path.join(baseDir, String(prefix) + "-"));
=======
    suiteTempRoot = fs.mkdtempSync(path.join(baseDir, `${prefix}-`));
>>>>>>> upstream/main
    return suiteTempRoot;
  }

  function makeTempDir() {
<<<<<<< HEAD
    const dir = path.join(ensureSuiteTempRoot(), `case-${String(tempDirCounter)}`);
=======
    const dir = path.join(ensureSuiteTempRoot(), `case-${tempDirCounter}`);
>>>>>>> upstream/main
    tempDirCounter += 1;
    fs.mkdirSync(dir);
    return dir;
  }

  function cleanup() {
    if (!suiteTempRoot) {
      return;
    }
    try {
      fs.rmSync(suiteTempRoot, { recursive: true, force: true });
    } finally {
      suiteTempRoot = "";
      tempDirCounter = 0;
    }
  }

  return {
    cleanup,
    ensureSuiteTempRoot,
    makeTempDir,
  };
}
