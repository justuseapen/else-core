<<<<<<< HEAD
import { randomUUID } from "node:crypto";
=======
// Loads and saves JSON files with symlink backup handling.
import "./fs-safe-defaults.js";
>>>>>>> upstream/main
import fs from "node:fs";
import path from "node:path";
import { tryReadJsonSync, writeJsonSync } from "@openclaw/fs-safe/json";

<<<<<<< HEAD
const JSON_FILE_MODE = 0o600;
const JSON_DIR_MODE = 0o700;

function trySetSecureMode(pathname: string) {
  try {
    fs.chmodSync(pathname, JSON_FILE_MODE);
  } catch {
    // best-effort on platforms without chmod support
  }
}

function trySyncDirectory(pathname: string) {
  let fd: number | undefined;
  try {
    fd = fs.openSync(path.dirname(pathname), "r");
    fs.fsyncSync(fd);
  } catch {
    // best-effort; some platforms/filesystems do not support syncing directories.
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // best-effort cleanup
      }
    }
  }
}

function readSymlinkTargetPath(linkPath: string): string {
  const target = fs.readlinkSync(linkPath);
  return path.resolve(path.dirname(linkPath), target);
}

function resolveJsonWriteTarget(pathname: string): { targetPath: string; followsSymlink: boolean } {
  let currentPath = pathname;
  const visited = new Set<string>();
  let followsSymlink = false;

  for (;;) {
    let stat: fs.Stats;
    try {
      stat = fs.lstatSync(currentPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      return { targetPath: currentPath, followsSymlink };
    }

    if (!stat.isSymbolicLink()) {
      return { targetPath: currentPath, followsSymlink };
    }

    if (visited.has(currentPath)) {
      const err = new Error(
        `Too many symlink levels while resolving ${pathname}`,
      ) as NodeJS.ErrnoException;
      err.code = "ELOOP";
      throw err;
    }

    visited.add(currentPath);
    followsSymlink = true;
    currentPath = readSymlinkTargetPath(currentPath);
  }
}

function renameJsonFileWithFallback(tmpPath: string, pathname: string) {
  try {
    fs.renameSync(tmpPath, pathname);
    return;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // Windows does not reliably support rename-based overwrite for existing files.
    if (code === "EPERM" || code === "EEXIST") {
      fs.copyFileSync(tmpPath, pathname);
      fs.rmSync(tmpPath, { force: true });
      return;
    }
    throw error;
  }
}

function writeTempJsonFile(pathname: string, payload: string) {
  const fd = fs.openSync(pathname, "w", JSON_FILE_MODE);
  try {
    fs.writeFileSync(fd, payload, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

export function loadJsonFile<T = unknown>(pathname: string): T | undefined {
  try {
    const raw = fs.readFileSync(pathname, "utf8");
    return JSON.parse(raw) as T;
  } catch {
=======
export { tryReadJsonSync, writeJsonSync };

function resolveJsonSymlinkTarget(pathname: string): string | undefined {
  let stat: fs.Stats;
  try {
    stat = fs.lstatSync(pathname);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
  if (!stat.isSymbolicLink()) {
>>>>>>> upstream/main
    return undefined;
  }

  return path.resolve(path.dirname(pathname), fs.readlinkSync(pathname));
}

function resolveJsonSaveTarget(pathname: string): string {
  const target = resolveJsonSymlinkTarget(pathname);
  if (!target) {
    return pathname;
  }
  fs.statSync(path.dirname(target));
  return target;
}

export function saveJsonFile(pathname: string, data: unknown): void {
  writeJsonSync(resolveJsonSaveTarget(pathname), data);
}

export function repairJsonFilePermissions(pathname: string): void {
  const target = resolveJsonSaveTarget(pathname);
  let fd: number | undefined;
  try {
    fd = fs.openSync(
      target,
      fs.constants.O_RDONLY |
        (process.platform !== "win32" && "O_NOFOLLOW" in fs.constants
          ? fs.constants.O_NOFOLLOW
          : 0),
    );
    fs.fchmodSync(fd, 0o600);
  } catch {
    // Matches fs-safe JSON writes: permission repair is best-effort.
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // best-effort cleanup
      }
    }
  }
}

<<<<<<< HEAD
export function saveJsonFile(pathname: string, data: unknown) {
  const { targetPath, followsSymlink } = resolveJsonWriteTarget(pathname);
  const tmpPath = `${targetPath}.${randomUUID()}.tmp`;
  const payload = `${JSON.stringify(data, null, 2)}\n`;

  if (!followsSymlink) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: JSON_DIR_MODE });
  }
  try {
    writeTempJsonFile(tmpPath, payload);
    trySetSecureMode(tmpPath);
    renameJsonFileWithFallback(tmpPath, targetPath);
    trySetSecureMode(targetPath);
    trySyncDirectory(targetPath);
  } finally {
    try {
      fs.rmSync(tmpPath, { force: true });
    } catch {
      // best-effort cleanup when rename does not happen
    }
  }
=======
// oxlint-disable-next-line typescript-eslint/no-unnecessary-type-parameters -- legacy typed JSON loader alias.
export function loadJsonFile<T = unknown>(pathname: string): T | undefined {
  const direct = tryReadJsonSync<T>(pathname);
  if (direct !== null) {
    return direct;
  }
  const target = resolveJsonSymlinkTarget(pathname);
  return target ? (tryReadJsonSync<T>(target) ?? undefined) : undefined;
>>>>>>> upstream/main
}
