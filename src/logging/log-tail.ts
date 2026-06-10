<<<<<<< HEAD
=======
// Log tail helpers read recent log lines with optional parsing and redaction.
>>>>>>> upstream/main
import fs from "node:fs/promises";
import path from "node:path";
import { getResolvedLoggerSettings } from "../logging.js";
import { clamp } from "../utils.js";
<<<<<<< HEAD

=======
import { redactSensitiveLines, resolveRedactOptions } from "./redact.js";

// Tail reader for the active log file, with cursor reset and line redaction.
>>>>>>> upstream/main
const DEFAULT_LIMIT = 500;
const DEFAULT_MAX_BYTES = 250_000;
const MAX_LIMIT = 5000;
const MAX_BYTES = 1_000_000;
const ROLLING_LOG_RE = /^openclaw-\d{4}-\d{2}-\d{2}\.log$/;

<<<<<<< HEAD
=======
/** Payload returned to log-tail callers with cursor and truncation metadata. */
>>>>>>> upstream/main
export type LogTailPayload = {
  file: string;
  cursor: number;
  size: number;
  lines: string[];
  truncated: boolean;
  reset: boolean;
};

function isRollingLogFile(file: string): boolean {
  return ROLLING_LOG_RE.test(path.basename(file));
}

<<<<<<< HEAD
async function resolveLogFile(file: string): Promise<string> {
=======
/** Resolves a rolling daily log path to the newest existing rolling log when needed. */
export async function resolveLogFile(file: string): Promise<string> {
>>>>>>> upstream/main
  const stat = await fs.stat(file).catch(() => null);
  if (stat) {
    return file;
  }
  if (!isRollingLogFile(file)) {
    return file;
  }

  const dir = path.dirname(file);
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => null);
  if (!entries) {
    return file;
  }

  const candidates = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && ROLLING_LOG_RE.test(entry.name))
      .map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        const fileStat = await fs.stat(fullPath).catch(() => null);
        return fileStat ? { path: fullPath, mtimeMs: fileStat.mtimeMs } : null;
      }),
  );
  const sorted = candidates
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .toSorted((a, b) => b.mtimeMs - a.mtimeMs);
  return sorted[0]?.path ?? file;
}

async function readLogSlice(params: {
  file: string;
  cursor?: number;
  limit: number;
  maxBytes: number;
}): Promise<Omit<LogTailPayload, "file">> {
  const stat = await fs.stat(params.file).catch(() => null);
  if (!stat) {
    return {
      cursor: 0,
      size: 0,
      lines: [],
      truncated: false,
      reset: false,
    };
  }

  const size = stat.size;
  const maxBytes = clamp(params.maxBytes, 1, MAX_BYTES);
  const limit = clamp(params.limit, 1, MAX_LIMIT);
  let cursor =
    typeof params.cursor === "number" && Number.isFinite(params.cursor)
      ? Math.max(0, Math.floor(params.cursor))
      : undefined;
  let reset = false;
  let truncated = false;
<<<<<<< HEAD
  let start = 0;

  if (cursor != null) {
    if (cursor > size) {
=======
  let start;

  if (cursor != null) {
    if (cursor > size) {
      // File rotated or shrank since the previous cursor; restart near the end.
>>>>>>> upstream/main
      reset = true;
      start = Math.max(0, size - maxBytes);
      truncated = start > 0;
    } else {
      start = cursor;
      if (size - start > maxBytes) {
<<<<<<< HEAD
=======
        // Cursor is valid but too stale; cap reads and tell the caller state was reset.
>>>>>>> upstream/main
        reset = true;
        truncated = true;
        start = Math.max(0, size - maxBytes);
      }
    }
  } else {
    start = Math.max(0, size - maxBytes);
    truncated = start > 0;
  }

  if (size === 0 || size <= start) {
    return {
      cursor: size,
      size,
      lines: [],
      truncated,
      reset,
    };
  }

  const handle = await fs.open(params.file, "r");
  try {
    let prefix = "";
    if (start > 0) {
      const prefixBuf = Buffer.alloc(1);
      const prefixRead = await handle.read(prefixBuf, 0, 1, start - 1);
      prefix = prefixBuf.toString("utf8", 0, prefixRead.bytesRead);
    }

    const length = Math.max(0, size - start);
    const buffer = Buffer.alloc(length);
    const readResult = await handle.read(buffer, 0, length, start);
    const text = buffer.toString("utf8", 0, readResult.bytesRead);
    let lines = text.split("\n");
    if (start > 0 && prefix !== "\n") {
<<<<<<< HEAD
=======
      // Drop the first partial line when starting in the middle of a file.
>>>>>>> upstream/main
      lines = lines.slice(1);
    }
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines = lines.slice(0, -1);
    }
    if (lines.length > limit) {
      lines = lines.slice(lines.length - limit);
    }

    cursor = size;

    return {
      cursor,
      size,
      lines,
      truncated,
      reset,
    };
  } finally {
    await handle.close();
  }
}

<<<<<<< HEAD
=======
/** Reads and redacts the configured log tail with bounded bytes and line count. */
>>>>>>> upstream/main
export async function readConfiguredLogTail(params?: {
  cursor?: number;
  limit?: number;
  maxBytes?: number;
}): Promise<LogTailPayload> {
  const file = await resolveLogFile(getResolvedLoggerSettings().file);
  const result = await readLogSlice({
    file,
    cursor: params?.cursor,
    limit: params?.limit ?? DEFAULT_LIMIT,
    maxBytes: params?.maxBytes ?? DEFAULT_MAX_BYTES,
  });
<<<<<<< HEAD
  return { file, ...result };
=======
  const redaction = resolveRedactOptions();
  return {
    file,
    ...result,
    lines: redactSensitiveLines(result.lines, redaction),
  };
>>>>>>> upstream/main
}
