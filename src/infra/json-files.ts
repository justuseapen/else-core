// Wraps fs-safe JSON reads and atomic writes with OpenClaw defaults.
import "./fs-safe-defaults.js";
import {
  JsonFileReadError,
  readJson as readJsonImpl,
  readJsonIfExists as readJsonIfExistsImpl,
} from "@openclaw/fs-safe/json";
import { replaceFileAtomic } from "./replace-file.js";

<<<<<<< HEAD
function getErrorCode(err: unknown): string | undefined {
  return err instanceof Error ? (err as NodeJS.ErrnoException).code : undefined;
}

async function replaceFileWithWindowsFallback(tempPath: string, filePath: string, mode: number) {
  try {
    await fs.rename(tempPath, filePath);
    return;
  } catch (err) {
    const code = getErrorCode(err);
    if (process.platform !== "win32" || (code !== "EPERM" && code !== "EEXIST")) {
      throw err;
    }
  }

  await fs.copyFile(tempPath, filePath);
  try {
    await fs.chmod(filePath, mode);
  } catch {
    // best-effort; ignore on platforms without chmod
  }
  await fs.rm(tempPath, { force: true }).catch(() => undefined);
}

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
=======
type WriteTextAtomicBeforeRename = (params: {
  filePath: string;
  tempPath: string;
}) => Promise<void>;

export {
  JsonFileReadError,
  readJsonSync,
  readRootJsonObjectSync,
  readRootJsonSync,
  readRootStructuredFileSync,
  tryReadJsonSync,
  tryReadJsonSync as readJsonFileSync,
  writeJson,
  writeJson as writeJsonAtomic,
  writeJsonSync,
} from "@openclaw/fs-safe/json";

/** Reads and parses JSON, wrapping unexpected read failures in JsonFileReadError. */
export async function readJson<T>(filePath: string): Promise<T> {
>>>>>>> upstream/main
  try {
    return await readJsonImpl<T>(filePath);
  } catch (err) {
    throw err instanceof JsonFileReadError ? err : new JsonFileReadError(filePath, "read", err);
  }
}

/** Strict JSON read alias for callers that must fail on missing or invalid files. */
export async function readJsonFileStrict<T>(filePath: string): Promise<T> {
  return readJson<T>(filePath);
}

/** Reads JSON when the file exists, returning null only for a missing path. */
export async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  try {
    return await readJsonIfExistsImpl<T>(filePath);
  } catch (err) {
    if (err instanceof JsonFileReadError) {
      throw err;
    }
    throw new JsonFileReadError(filePath, "read", err);
  }
}

/** Durable JSON read alias that keeps parse/read errors visible to callers. */
export async function readDurableJsonFile<T>(filePath: string): Promise<T | null> {
  return readJsonIfExists<T>(filePath);
}

/**
 * tryReadJson delegates to readJsonIfExists instead of the internal
 * tryReadJsonImpl from @openclaw/fs-safe. The fs-safe implementation retries
 * race conditions before propagating errors; this wrapper keeps the historical
 * null-on-error contract for callers that intentionally treat reads as optional.
 */
export async function tryReadJson<T>(filePath: string): Promise<T | null> {
  try {
    return await readJsonIfExists<T>(filePath);
  } catch {
    return null;
  }
}

/** Optional JSON read that returns null for missing, invalid, or racing files. */
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  return tryReadJson<T>(filePath);
}

export { createAsyncLock } from "@openclaw/fs-safe/advanced";

export type WriteTextAtomicOptions = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  durable?: boolean;
  beforeRename?: WriteTextAtomicBeforeRename;
  /**
   * Prefix for the staged `<prefix>.<pid>.<uuid>.tmp` file. Defaults to the
   * generic `.fs-safe-replace`; pass a target-specific prefix so an orphaned
   * temp (from a crash between write and rename) is identifiable and reclaimable.
   */
  tempPrefix?: string;
};

/** Writes text through the repo atomic replace helper with durable fsync by default. */
export async function writeTextAtomic(
  filePath: string,
  content: string,
<<<<<<< HEAD
  options?: { mode?: number; ensureDirMode?: number; appendTrailingNewline?: boolean },
) {
  const mode = options?.mode ?? 0o600;
  const payload =
    options?.appendTrailingNewline && !content.endsWith("\n") ? `${content}\n` : content;
  const mkdirOptions: { recursive: true; mode?: number } = { recursive: true };
  if (typeof options?.ensureDirMode === "number") {
    mkdirOptions.mode = options.ensureDirMode;
  }
  await fs.mkdir(path.dirname(filePath), mkdirOptions);
  const parentDir = path.dirname(filePath);
  const tmp = `${filePath}.${randomUUID()}.tmp`;
  try {
    const tmpHandle = await fs.open(tmp, "w", mode);
    try {
      await tmpHandle.writeFile(payload, { encoding: "utf8" });
      await tmpHandle.sync();
    } finally {
      await tmpHandle.close().catch(() => undefined);
    }
    try {
      await fs.chmod(tmp, mode);
    } catch {
      // best-effort; ignore on platforms without chmod
    }
    await replaceFileWithWindowsFallback(tmp, filePath, mode);
    try {
      const dirHandle = await fs.open(parentDir, "r");
      try {
        await dirHandle.sync();
      } finally {
        await dirHandle.close().catch(() => undefined);
      }
    } catch {
      // best-effort; some platforms/filesystems do not support syncing directories.
    }
    try {
      await fs.chmod(filePath, mode);
    } catch {
      // best-effort; ignore on platforms without chmod
    }
  } finally {
    await fs.rm(tmp, { force: true }).catch(() => undefined);
  }
}

export function createAsyncLock() {
  let lock: Promise<void> = Promise.resolve();
  return async function withLock<T>(fn: () => Promise<T>): Promise<T> {
    const prev = lock;
    let release: (() => void) | undefined;
    lock = new Promise<void>((resolve) => {
      release = resolve;
    });
    await prev;
    try {
      return await fn();
    } finally {
      release?.();
    }
  };
=======
  options?: WriteTextAtomicOptions,
): Promise<void> {
  const payload = options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content;
  await replaceFileAtomic({
    filePath,
    content: payload,
    mode: options?.mode ?? 0o600,
    dirMode: options?.dirMode ?? 0o777 & ~process.umask(),
    copyFallbackOnPermissionError: true,
    syncTempFile: options?.durable !== false,
    syncParentDir: options?.durable !== false,
    ...(options?.beforeRename ? { beforeRename: options.beforeRename } : {}),
    ...(options?.tempPrefix ? { tempPrefix: options.tempPrefix } : {}),
  });
>>>>>>> upstream/main
}
