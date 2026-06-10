// Re-exports fs-safe helpers with OpenClaw defaults and wrappers.
import "./fs-safe-defaults.js";
import fs from "node:fs/promises";
import path from "node:path";
<<<<<<< HEAD
import { logWarn } from "../logger.js";
import { resolveBoundaryPath } from "./boundary-path.js";
import { sameFileIdentity } from "./file-identity.js";
import { isPinnedPathHelperSpawnError, runPinnedPathHelper } from "./fs-pinned-path-helper.js";
import { runPinnedWriteHelper } from "./fs-pinned-write-helper.js";
import { expandHomePrefix } from "./home-dir.js";
import { assertNoPathAliasEscape, PATH_ALIAS_POLICIES } from "./path-alias-guards.js";
=======
>>>>>>> upstream/main
import {
  ensureDirectoryWithinRoot,
  findExistingAncestor,
  writeViaSiblingTempPath,
} from "@openclaw/fs-safe/advanced";
import { root as fsSafeRoot, type ReadResult } from "@openclaw/fs-safe/root";

export { FsSafeError, type FsSafeErrorCode } from "@openclaw/fs-safe/errors";
export {
  assertAbsolutePathInput,
  canonicalPathFromExistingAncestor,
  findExistingAncestor,
  resolveAbsolutePathForRead,
  resolveAbsolutePathForWrite,
  type AbsolutePathSymlinkPolicy,
  type EnsureAbsoluteDirectoryOptions,
  type EnsureAbsoluteDirectoryResult,
  type ResolvedAbsolutePath,
  type ResolvedWritableAbsolutePath,
} from "@openclaw/fs-safe/advanced";
export { isPathInside } from "@openclaw/fs-safe/path";
export { pathExists, pathExistsSync } from "@openclaw/fs-safe/advanced";
export { movePathToTrash, type MovePathToTrashOptions } from "@openclaw/fs-safe/advanced";
export { readLocalFileFromRoots, resolveLocalPathFromRootsSync } from "@openclaw/fs-safe/advanced";
export {
  appendRegularFile,
  appendRegularFileSync,
  readRegularFile,
  readRegularFileSync,
  resolveRegularFileAppendFlags,
  statRegularFile,
  statRegularFileSync,
} from "@openclaw/fs-safe/advanced";
export {
  openLocalFileSafely,
  readLocalFileSafely,
  resolveOpenedFileRealPathForHandle,
  root,
  type OpenResult,
  type ReadResult,
} from "@openclaw/fs-safe/root";
export { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
export {
  readSecureFile,
  type SecureFileReadOptions,
  type SecureFileReadResult,
} from "@openclaw/fs-safe/secure-file";
export {
  walkDirectory,
  walkDirectorySync,
  type WalkDirectoryEntry,
  type WalkDirectoryOptions,
  type WalkDirectoryResult,
} from "@openclaw/fs-safe/walk";
export { withTimeout } from "@openclaw/fs-safe/advanced";

export type ExternalFileWriteOptions = {
  rootDir: string;
  path: string;
  write: (tempPath: string) => Promise<void>;
  fallbackFileName?: string;
  tempPrefix?: string;
};

export type ExternalFileWriteResult = {
  path: string;
};

export async function ensureAbsoluteDirectory(
  dirPath: string,
  options?: { scopeLabel?: string; mode?: number },
): Promise<{ ok: true; path: string } | { ok: false; error: Error }> {
  const absolutePath = path.resolve(dirPath);
  const scopeLabel = options?.scopeLabel ?? "directory";
  const existingAncestor = await findExistingAncestor(absolutePath);
  if (!existingAncestor) {
    return { ok: false, error: new Error(`Invalid path: must stay within ${scopeLabel}`) };
  }
  if (existingAncestor === absolutePath) {
    try {
      const stat = await fs.lstat(absolutePath);
      if (!stat.isSymbolicLink() && stat.isDirectory()) {
        return { ok: true, path: absolutePath };
      }
    } catch {
      // Fall through to the uniform invalid-path result below.
    }
    return { ok: false, error: new Error(`Invalid path: must stay within ${scopeLabel}`) };
  }
  const result = await ensureDirectoryWithinRoot({
    rootDir: existingAncestor,
    requestedPath: path.relative(existingAncestor, absolutePath),
    scopeLabel,
    mode: options?.mode,
  });
  if (result.ok) {
    return result;
  }
  return { ok: false, error: new Error(result.error) };
}

export async function writeExternalFileWithinRoot(
  options: ExternalFileWriteOptions,
): Promise<ExternalFileWriteResult> {
  const targetPath = path.resolve(options.rootDir, options.path);
  await writeViaSiblingTempPath({
    rootDir: options.rootDir,
    targetPath,
    writeTemp: options.write,
    fallbackFileName: options.fallbackFileName,
    tempPrefix: options.tempPrefix,
  });
  return { path: targetPath };
}

/** @deprecated Use root(rootDir).read(relativePath, options). */
export async function readFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
  maxBytes?: number;
}): Promise<ReadResult> {
  const root = await fsSafeRoot(params.rootDir);
  return await root.read(params.relativePath, {
    hardlinks: params.rejectHardlinks === false ? "allow" : "reject",
    maxBytes: params.maxBytes,
    nonBlockingRead: params.nonBlockingRead,
    symlinks: params.allowSymlinkTargetWithinRoot === true ? "follow-within-root" : "reject",
  });
}

<<<<<<< HEAD
export function createRootScopedReadFile(params: {
  rootDir: string;
  rejectHardlinks?: boolean;
  maxBytes?: number;
}): (filePath: string) => Promise<Buffer> {
  const rootDir = path.resolve(params.rootDir);
  return async (filePath: string) => {
    const safeRead = await readPathWithinRoot({
      rootDir,
      filePath,
      rejectHardlinks: params.rejectHardlinks,
      maxBytes: params.maxBytes,
    });
    return safeRead.buffer;
  };
}

export async function readLocalFileSafely(params: {
  filePath: string;
  maxBytes?: number;
}): Promise<SafeLocalReadResult> {
  const opened = await openVerifiedLocalFile(params.filePath);
  try {
    return await readOpenedFileSafely({ opened, maxBytes: params.maxBytes });
  } finally {
    await opened.handle.close().catch(() => {});
  }
}

async function readOpenedFileSafely(params: {
  opened: SafeOpenResult;
  maxBytes?: number;
}): Promise<SafeLocalReadResult> {
  if (params.maxBytes !== undefined && params.opened.stat.size > params.maxBytes) {
    throw new SafeOpenError(
      "too-large",
      `file exceeds limit of ${params.maxBytes} bytes (got ${params.opened.stat.size})`,
    );
  }
  const buffer = await params.opened.handle.readFile();
  return {
    buffer,
    realPath: params.opened.realPath,
    stat: params.opened.stat,
  };
}

export type SafeWritableOpenResult = {
  handle: FileHandle;
  createdForWrite: boolean;
  openedRealPath: string;
  openedStat: Stats;
};

function emitWriteBoundaryWarning(reason: string) {
  logWarn(`security: fs-safe write boundary warning (${reason})`);
}

function buildAtomicWriteTempPath(targetPath: string): string {
  const dir = path.dirname(targetPath);
  const base = path.basename(targetPath);
  return path.join(dir, `.${base}.${process.pid}.${randomUUID()}.tmp`);
}

async function writeTempFileForAtomicReplace(params: {
  tempPath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mode: number;
}): Promise<Stats> {
  const tempHandle = await fs.open(params.tempPath, OPEN_WRITE_CREATE_FLAGS, params.mode);
  try {
    if (typeof params.data === "string") {
      await tempHandle.writeFile(params.data, params.encoding ?? "utf8");
    } else {
      await tempHandle.writeFile(params.data);
    }
    return await tempHandle.stat();
  } finally {
    await tempHandle.close().catch(() => {});
  }
}

async function verifyAtomicWriteResult(params: {
  rootDir: string;
  targetPath: string;
  expectedIdentity: { dev: number | bigint; ino: number | bigint };
}): Promise<void> {
  const rootReal = await fs.realpath(params.rootDir);
  const rootWithSep = ensureTrailingSep(rootReal);
  const opened = await openVerifiedLocalFile(params.targetPath, { rejectHardlinks: true });
  try {
    if (!sameFileIdentity(opened.stat, params.expectedIdentity)) {
      throw new SafeOpenError("path-mismatch", "path changed during write");
    }
    if (!isPathInside(rootWithSep, opened.realPath)) {
      throw new SafeOpenError("outside-workspace", "file is outside workspace root");
    }
  } finally {
    await opened.handle.close().catch(() => {});
  }
}

export async function resolveOpenedFileRealPathForHandle(
  handle: FileHandle,
  ioPath: string,
): Promise<string> {
  try {
    return await fs.realpath(ioPath);
  } catch (err) {
    if (!isNotFoundPathError(err)) {
      throw err;
    }
  }

  const fdCandidates =
    process.platform === "linux"
      ? [`/proc/self/fd/${handle.fd}`, `/dev/fd/${handle.fd}`]
      : process.platform === "win32"
        ? []
        : [`/dev/fd/${handle.fd}`];
  for (const fdPath of fdCandidates) {
    try {
      return await fs.realpath(fdPath);
    } catch {
      // try next fd path
    }
  }
  throw new SafeOpenError("path-mismatch", "unable to resolve opened file path");
}

export async function openWritableFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  mkdir?: boolean;
  mode?: number;
  truncateExisting?: boolean;
  append?: boolean;
}): Promise<SafeWritableOpenResult> {
  const { rootReal, rootWithSep, resolved } = await resolvePathWithinRoot(params);
  try {
    await assertNoPathAliasEscape({
      absolutePath: resolved,
      rootPath: rootReal,
      boundaryLabel: "root",
    });
  } catch (err) {
    throw new SafeOpenError("invalid-path", "path alias escape blocked", { cause: err });
  }
  if (params.mkdir !== false) {
    await fs.mkdir(path.dirname(resolved), { recursive: true });
  }

  let ioPath = resolved;
  try {
    const resolvedRealPath = await fs.realpath(resolved);
    if (!isPathInside(rootWithSep, resolvedRealPath)) {
      throw new SafeOpenError("outside-workspace", "file is outside workspace root");
    }
    ioPath = resolvedRealPath;
  } catch (err) {
    if (err instanceof SafeOpenError) {
      throw err;
    }
    if (!isNotFoundPathError(err)) {
      throw err;
    }
  }

  const fileMode = params.mode ?? 0o600;

  let handle: FileHandle;
  let createdForWrite = false;
  const existingFlags = params.append ? OPEN_APPEND_EXISTING_FLAGS : OPEN_WRITE_EXISTING_FLAGS;
  const createFlags = params.append ? OPEN_APPEND_CREATE_FLAGS : OPEN_WRITE_CREATE_FLAGS;
  try {
    try {
      handle = await fs.open(ioPath, existingFlags, fileMode);
    } catch (err) {
      if (!isNotFoundPathError(err)) {
        throw err;
      }
      handle = await fs.open(ioPath, createFlags, fileMode);
      createdForWrite = true;
    }
  } catch (err) {
    if (isNotFoundPathError(err)) {
      throw new SafeOpenError("not-found", "file not found");
    }
    if (isSymlinkOpenError(err)) {
      throw new SafeOpenError("invalid-path", "symlink open blocked", { cause: err });
    }
    throw err;
  }

  let openedRealPath: string | null = null;
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) {
      throw new SafeOpenError("invalid-path", "path is not a regular file under root");
    }
    if (stat.nlink > 1) {
      throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
    }

    try {
      const lstat = await fs.lstat(ioPath);
      if (lstat.isSymbolicLink() || !lstat.isFile()) {
        throw new SafeOpenError("invalid-path", "path is not a regular file under root");
      }
      if (!sameFileIdentity(stat, lstat)) {
        throw new SafeOpenError("path-mismatch", "path changed during write");
      }
    } catch (err) {
      if (!isNotFoundPathError(err)) {
        throw err;
      }
    }

    const realPath = await resolveOpenedFileRealPathForHandle(handle, ioPath);
    openedRealPath = realPath;
    const realStat = await fs.stat(realPath);
    if (!sameFileIdentity(stat, realStat)) {
      throw new SafeOpenError("path-mismatch", "path mismatch");
    }
    if (realStat.nlink > 1) {
      throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
    }
    if (!isPathInside(rootWithSep, realPath)) {
      throw new SafeOpenError("outside-workspace", "file is outside workspace root");
    }

    // Truncate only after boundary and identity checks complete. This avoids
    // irreversible side effects if a symlink target changes before validation.
    if (params.append !== true && params.truncateExisting !== false && !createdForWrite) {
      await handle.truncate(0);
    }
    return {
      handle,
      createdForWrite,
      openedRealPath: realPath,
      openedStat: stat,
    };
  } catch (err) {
    const cleanupCreatedPath = createdForWrite && err instanceof SafeOpenError;
    const cleanupPath = openedRealPath ?? ioPath;
    await handle.close().catch(() => {});
    if (cleanupCreatedPath) {
      await fs.rm(cleanupPath, { force: true }).catch(() => {});
    }
    throw err;
  }
}

export async function appendFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
  prependNewlineIfNeeded?: boolean;
}): Promise<void> {
  const target = await openWritableFileWithinRoot({
    rootDir: params.rootDir,
    relativePath: params.relativePath,
    mkdir: params.mkdir,
    truncateExisting: false,
    append: true,
  });
  try {
    let prefix = "";
    if (
      params.prependNewlineIfNeeded === true &&
      !target.createdForWrite &&
      target.openedStat.size > 0 &&
      ((typeof params.data === "string" && !params.data.startsWith("\n")) ||
        (Buffer.isBuffer(params.data) && params.data.length > 0 && params.data[0] !== 0x0a))
    ) {
      const lastByte = Buffer.alloc(1);
      const { bytesRead } = await target.handle.read(lastByte, 0, 1, target.openedStat.size - 1);
      if (bytesRead === 1 && lastByte[0] !== 0x0a) {
        prefix = "\n";
      }
    }

    if (typeof params.data === "string") {
      await target.handle.appendFile(`${prefix}${params.data}`, params.encoding ?? "utf8");
      return;
    }

    const payload =
      prefix.length > 0 ? Buffer.concat([Buffer.from(prefix, "utf8"), params.data]) : params.data;
    await target.handle.appendFile(payload);
  } finally {
    await target.handle.close().catch(() => {});
  }
}

export async function removePathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
}): Promise<void> {
  const resolved = await resolvePinnedRemovePathWithinRoot(params);
  if (process.platform === "win32") {
    await removePathWithinRootLegacy(resolved);
    return;
  }
  try {
    await runPinnedPathHelper({
      operation: "remove",
      rootPath: resolved.rootReal,
      relativePath: resolved.relativePosix,
    });
  } catch (error) {
    if (isPinnedPathHelperSpawnError(error)) {
      await removePathWithinRootLegacy(resolved);
      return;
    }
    throw normalizePinnedPathError(error);
  }
}

export async function mkdirPathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  allowRoot?: boolean;
}): Promise<void> {
  const resolved = await resolvePinnedPathWithinRoot(params);
  if (process.platform === "win32") {
    await mkdirPathWithinRootLegacy(resolved);
    return;
  }
  try {
    await runPinnedPathHelper({
      operation: "mkdirp",
      rootPath: resolved.rootReal,
      relativePath: resolved.relativePosix,
    });
  } catch (error) {
    if (isPinnedPathHelperSpawnError(error)) {
      await mkdirPathWithinRootLegacy(resolved);
      return;
    }
    throw normalizePinnedPathError(error);
  }
}

=======
/** @deprecated Use root(rootDir).write(relativePath, data, options). */
>>>>>>> upstream/main
export async function writeFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
}): Promise<void> {
  const root = await fsSafeRoot(params.rootDir);
  await root.write(params.relativePath, params.data, {
    encoding: params.encoding,
    mkdir: params.mkdir,
  });
}
<<<<<<< HEAD

async function resolvePinnedWriteTargetWithinRoot(params: {
  rootDir: string;
  relativePath: string;
}): Promise<{
  rootReal: string;
  targetPath: string;
  relativeParentPath: string;
  basename: string;
  mode: number;
}> {
  const { rootReal, rootWithSep, resolved } = await resolvePathWithinRoot(params);
  try {
    await assertNoPathAliasEscape({
      absolutePath: resolved,
      rootPath: rootReal,
      boundaryLabel: "root",
    });
  } catch (err) {
    throw new SafeOpenError("invalid-path", "path alias escape blocked", { cause: err });
  }

  const relativeResolved = path.relative(rootReal, resolved);
  if (relativeResolved.startsWith("..") || path.isAbsolute(relativeResolved)) {
    throw new SafeOpenError("outside-workspace", "file is outside workspace root");
  }
  const relativePosix = relativeResolved
    ? relativeResolved.split(path.sep).join(path.posix.sep)
    : "";
  const basename = path.posix.basename(relativePosix);
  if (!basename || basename === "." || basename === "/") {
    throw new SafeOpenError("invalid-path", "invalid target path");
  }
  let mode = 0o600;
  try {
    const opened = await openFileWithinRoot({
      rootDir: params.rootDir,
      relativePath: params.relativePath,
      rejectHardlinks: true,
    });
    try {
      mode = opened.stat.mode & 0o777;
      if (!isPathInside(rootWithSep, opened.realPath)) {
        throw new SafeOpenError("outside-workspace", "file is outside workspace root");
      }
    } finally {
      await opened.handle.close().catch(() => {});
    }
  } catch (err) {
    if (!(err instanceof SafeOpenError) || err.code !== "not-found") {
      throw err;
    }
  }

  return {
    rootReal,
    targetPath: resolved,
    relativeParentPath:
      path.posix.dirname(relativePosix) === "." ? "" : path.posix.dirname(relativePosix),
    basename,
    mode: mode || 0o600,
  };
}

async function resolvePinnedPathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  allowRoot?: boolean;
}): Promise<{ rootReal: string; resolved: string; relativePosix: string }> {
  const resolved = await resolvePinnedBoundaryPathWithinRoot({
    rootDir: params.rootDir,
    relativePath: params.relativePath,
    policy: PATH_ALIAS_POLICIES.strict,
  });
  const relativeResolved = path.relative(resolved.rootReal, resolved.canonicalPath);
  if ((relativeResolved === "" || relativeResolved === ".") && params.allowRoot === true) {
    return { rootReal: resolved.rootReal, resolved: resolved.canonicalPath, relativePosix: "" };
  }
  if (
    relativeResolved === "" ||
    relativeResolved === "." ||
    relativeResolved.startsWith("..") ||
    path.isAbsolute(relativeResolved)
  ) {
    throw new SafeOpenError("outside-workspace", "file is outside workspace root");
  }

  const relativePosix = relativeResolved.split(path.sep).join(path.posix.sep);
  if (!isPathInside(resolved.rootWithSep, resolved.canonicalPath)) {
    throw new SafeOpenError("outside-workspace", "file is outside workspace root");
  }

  return { rootReal: resolved.rootReal, resolved: resolved.canonicalPath, relativePosix };
}

async function resolvePinnedRemovePathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
}): Promise<{ rootReal: string; resolved: string; relativePosix: string }> {
  const resolved = await resolvePinnedBoundaryPathWithinRoot({
    rootDir: params.rootDir,
    relativePath: params.relativePath,
    policy: PATH_ALIAS_POLICIES.unlinkTarget,
  });
  const relativeResolved = path.relative(resolved.rootReal, resolved.canonicalPath);
  if (
    relativeResolved === "" ||
    relativeResolved === "." ||
    relativeResolved.startsWith("..") ||
    path.isAbsolute(relativeResolved)
  ) {
    throw new SafeOpenError("outside-workspace", "file is outside workspace root");
  }
  const relativePosix = relativeResolved.split(path.sep).join(path.posix.sep);
  if (!isPathInside(resolved.rootWithSep, resolved.canonicalPath)) {
    throw new SafeOpenError("outside-workspace", "file is outside workspace root");
  }

  const parentRelative = path.posix.dirname(relativePosix);
  if (parentRelative === "." || parentRelative === "") {
    return { rootReal: resolved.rootReal, resolved: resolved.canonicalPath, relativePosix };
  }
  return { rootReal: resolved.rootReal, resolved: resolved.canonicalPath, relativePosix };
}

async function resolvePinnedBoundaryPathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  policy: (typeof PATH_ALIAS_POLICIES)[keyof typeof PATH_ALIAS_POLICIES];
}): Promise<{ rootReal: string; rootWithSep: string; canonicalPath: string }> {
  const { rootReal } = await resolvePathWithinRoot({
    rootDir: params.rootDir,
    relativePath: ".",
  });
  let resolved;
  try {
    resolved = await resolveBoundaryPath({
      absolutePath: path.resolve(rootReal, await expandRelativePathWithHome(params.relativePath)),
      rootPath: rootReal,
      rootCanonicalPath: rootReal,
      boundaryLabel: "root",
      policy: params.policy,
    });
  } catch (err) {
    throw new SafeOpenError("invalid-path", "path alias escape blocked", { cause: err });
  }
  const rootWithSep = ensureTrailingSep(resolved.rootCanonicalPath);
  return {
    rootReal: resolved.rootCanonicalPath,
    rootWithSep,
    canonicalPath: resolved.canonicalPath,
  };
}

function normalizePinnedWriteError(error: unknown): Error {
  if (error instanceof SafeOpenError) {
    return error;
  }
  return new SafeOpenError("invalid-path", "path is not a regular file under root", {
    cause: error instanceof Error ? error : undefined,
  });
}

function normalizePinnedPathError(error: unknown): Error {
  if (error instanceof SafeOpenError) {
    return error;
  }
  if (error instanceof Error) {
    const message = error.message;
    if (/No such file or directory/i.test(message)) {
      return new SafeOpenError("not-found", "file not found", { cause: error });
    }
    if (/Not a directory|symbolic link|Too many levels of symbolic links/i.test(message)) {
      return new SafeOpenError("invalid-path", "path is not under root", { cause: error });
    }
    if (/Directory not empty/i.test(message)) {
      return new SafeOpenError("invalid-path", "directory is not empty", { cause: error });
    }
    if (/Is a directory|Operation not permitted|Permission denied/i.test(message)) {
      return new SafeOpenError("invalid-path", "path is not removable under root", {
        cause: error,
      });
    }
  }
  return new SafeOpenError("invalid-path", "path is not under root", {
    cause: error instanceof Error ? error : undefined,
  });
}

async function removePathWithinRootLegacy(resolved: { resolved: string }): Promise<void> {
  await fs.rm(resolved.resolved);
}

async function mkdirPathWithinRootLegacy(resolved: { resolved: string }): Promise<void> {
  await fs.mkdir(resolved.resolved, { recursive: true });
}

async function writeFileWithinRootLegacy(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
}): Promise<void> {
  const target = await openWritableFileWithinRoot({
    rootDir: params.rootDir,
    relativePath: params.relativePath,
    mkdir: params.mkdir,
    truncateExisting: false,
  });
  const destinationPath = target.openedRealPath;
  const targetMode = target.openedStat.mode & 0o777;
  await target.handle.close().catch(() => {});
  let tempPath: string | null = null;
  try {
    tempPath = buildAtomicWriteTempPath(destinationPath);
    const writtenStat = await writeTempFileForAtomicReplace({
      tempPath,
      data: params.data,
      encoding: params.encoding,
      mode: targetMode || 0o600,
    });
    await fs.rename(tempPath, destinationPath);
    tempPath = null;
    try {
      await verifyAtomicWriteResult({
        rootDir: params.rootDir,
        targetPath: destinationPath,
        expectedIdentity: writtenStat,
      });
    } catch (err) {
      emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
      throw err;
    }
  } finally {
    if (tempPath) {
      await fs.rm(tempPath, { force: true }).catch(() => {});
    }
  }
}

async function copyFileWithinRootLegacy(
  params: {
    sourcePath: string;
    rootDir: string;
    relativePath: string;
    maxBytes?: number;
    mkdir?: boolean;
    rejectSourceHardlinks?: boolean;
  },
  source: SafeOpenResult,
): Promise<void> {
  let target: SafeWritableOpenResult | null = null;
  let sourceClosedByStream = false;
  let targetClosedByUs = false;
  let tempHandle: FileHandle | null = null;
  let tempPath: string | null = null;
  let tempClosedByStream = false;
  try {
    target = await openWritableFileWithinRoot({
      rootDir: params.rootDir,
      relativePath: params.relativePath,
      mkdir: params.mkdir,
      truncateExisting: false,
    });
    const destinationPath = target.openedRealPath;
    const targetMode = target.openedStat.mode & 0o777;
    await target.handle.close().catch(() => {});
    targetClosedByUs = true;

    tempPath = buildAtomicWriteTempPath(destinationPath);
    tempHandle = await fs.open(tempPath, OPEN_WRITE_CREATE_FLAGS, targetMode || 0o600);
    const sourceStream = source.handle.createReadStream();
    const targetStream = tempHandle.createWriteStream();
    sourceStream.once("close", () => {
      sourceClosedByStream = true;
    });
    targetStream.once("close", () => {
      tempClosedByStream = true;
    });
    await import("node:stream/promises").then(({ pipeline }) =>
      pipeline(sourceStream, targetStream),
    );
    const writtenStat = await fs.stat(tempPath);
    if (!tempClosedByStream) {
      await tempHandle.close().catch(() => {});
      tempClosedByStream = true;
    }
    tempHandle = null;
    await fs.rename(tempPath, destinationPath);
    tempPath = null;
    try {
      await verifyAtomicWriteResult({
        rootDir: params.rootDir,
        targetPath: destinationPath,
        expectedIdentity: writtenStat,
      });
    } catch (err) {
      emitWriteBoundaryWarning(`post-copy verification failed: ${String(err)}`);
      throw err;
    }
  } catch (err) {
    if (target?.createdForWrite) {
      await fs.rm(target.openedRealPath, { force: true }).catch(() => {});
    }
    throw err;
  } finally {
    if (tempPath) {
      await fs.rm(tempPath, { force: true }).catch(() => {});
    }
    if (!sourceClosedByStream) {
      await source.handle.close().catch(() => {});
    }
    if (tempHandle && !tempClosedByStream) {
      await tempHandle.close().catch(() => {});
    }
    if (target && !targetClosedByUs) {
      await target.handle.close().catch(() => {});
    }
  }
}
=======
>>>>>>> upstream/main
