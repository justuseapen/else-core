<<<<<<< HEAD
=======
// Test temp directory helper creates and cleans up temporary directories.
>>>>>>> upstream/main
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

<<<<<<< HEAD
=======
// Synchronous temporary directory helpers for tests.

/** Create a temp dir and register it in an array or set for cleanup. */
>>>>>>> upstream/main
export function makeTempDir(tempDirs: string[] | Set<string>, prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  if (Array.isArray(tempDirs)) {
    tempDirs.push(dir);
  } else {
    tempDirs.add(dir);
  }
  return dir;
}

<<<<<<< HEAD
export function cleanupTempDirs(tempDirs: string[] | Set<string>): void {
  const dirs = Array.isArray(tempDirs) ? tempDirs.splice(0, tempDirs.length) : [...tempDirs];
=======
/** Remove all tracked temporary directories and clear the tracker. */
export function cleanupTempDirs(tempDirs: string[] | Set<string>): void {
  const dirs = Array.isArray(tempDirs) ? tempDirs.splice(0) : [...tempDirs];
>>>>>>> upstream/main
  for (const dir of dirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (!Array.isArray(tempDirs)) {
    tempDirs.clear();
  }
}
