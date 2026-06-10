<<<<<<< HEAD
=======
// Matrix tests cover idb persistence.lock order plugin behavior.
>>>>>>> upstream/main
import "fake-indexeddb/auto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
<<<<<<< HEAD
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
=======
import { resetPluginStateStoreForTests } from "openclaw/plugin-sdk/plugin-state-test-runtime";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { installMatrixTestRuntime } from "../../test-runtime.js";
>>>>>>> upstream/main
import {
  computeMinimumRetryWindowMs,
  MATRIX_IDB_PERSIST_INTERVAL_MS,
} from "./idb-persistence-lock.js";
import { clearAllIndexedDbState, seedDatabase } from "./idb-persistence.test-helpers.js";

const { withFileLockMock } = vi.hoisted(() => ({
  withFileLockMock: vi.fn(
    async <T>(_filePath: string, _options: unknown, fn: () => Promise<T>) => await fn(),
  ),
}));

<<<<<<< HEAD
vi.mock("openclaw/plugin-sdk/infra-runtime", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/infra-runtime")>(
    "openclaw/plugin-sdk/infra-runtime",
=======
vi.mock("openclaw/plugin-sdk/file-lock", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/file-lock")>(
    "openclaw/plugin-sdk/file-lock",
>>>>>>> upstream/main
  );
  return {
    ...actual,
    withFileLock: withFileLockMock,
  };
});

let persistIdbToDisk: typeof import("./idb-persistence.js").persistIdbToDisk;
let restoreIdbFromDisk: typeof import("./idb-persistence.js").restoreIdbFromDisk;
type CapturedLockOptions =
  typeof import("./idb-persistence-lock.js").MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS;
<<<<<<< HEAD
=======
const DATABASE_PREFIX = "openclaw-matrix-lock-order-test";
const cryptoDatabaseName = `${DATABASE_PREFIX}::matrix-sdk-crypto`;
>>>>>>> upstream/main

beforeAll(async () => {
  ({ persistIdbToDisk, restoreIdbFromDisk } = await import("./idb-persistence.js"));
});

describe("Matrix IndexedDB persistence lock ordering", () => {
  let tmpDir: string;

  beforeEach(async () => {
<<<<<<< HEAD
=======
    resetPluginStateStoreForTests();
    installMatrixTestRuntime();
>>>>>>> upstream/main
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "matrix-idb-lock-order-"));
    withFileLockMock.mockReset();
    withFileLockMock.mockImplementation(
      async <T>(_filePath: string, _options: unknown, fn: () => Promise<T>) => await fn(),
    );
<<<<<<< HEAD
    await clearAllIndexedDbState();
  });

  afterEach(async () => {
    await clearAllIndexedDbState();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("captures the snapshot after the file lock is acquired", async () => {
    const snapshotPath = path.join(tmpDir, "crypto-idb-snapshot.json");
    const dbName = "openclaw-matrix-test::matrix-sdk-crypto";
    await seedDatabase({
      name: dbName,
=======
    await clearAllIndexedDbState({ databasePrefix: DATABASE_PREFIX });
  });

  afterEach(async () => {
    await clearAllIndexedDbState({ databasePrefix: DATABASE_PREFIX });
    resetPluginStateStoreForTests();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("captures the current snapshot into SQLite state", async () => {
    const snapshotPath = path.join(tmpDir, "crypto-idb-snapshot.json");
    await seedDatabase({
      name: cryptoDatabaseName,
>>>>>>> upstream/main
      storeName: "sessions",
      records: [{ key: "room-1", value: { session: "old-session" } }],
    });

<<<<<<< HEAD
    withFileLockMock.mockImplementationOnce(async (_filePath, _options, fn) => {
      await seedDatabase({
        name: dbName,
        storeName: "sessions",
        records: [{ key: "room-1", value: { session: "new-session" } }],
      });
      return await fn();
    });

    await persistIdbToDisk({ snapshotPath, databasePrefix: "openclaw-matrix-test" });

    const data = JSON.parse(fs.readFileSync(snapshotPath, "utf8")) as Array<{
      stores: Array<{
        name: string;
        records: Array<{ key: IDBValidKey; value: { session: string } }>;
      }>;
    }>;
    const sessionsStore = data[0]?.stores.find((store) => store.name === "sessions");
    expect(sessionsStore?.records).toEqual([{ key: "room-1", value: { session: "new-session" } }]);
  });

  it("waits at least one persist interval before timing out on snapshot lock contention", async () => {
=======
    await persistIdbToDisk({ snapshotPath, databasePrefix: DATABASE_PREFIX });
    await clearAllIndexedDbState({ databasePrefix: DATABASE_PREFIX });

    await expect(restoreIdbFromDisk(snapshotPath)).resolves.toBe(true);
    const dbs = await indexedDB.databases();
    expect(dbs.map((entry) => entry.name)).toContain(cryptoDatabaseName);
  });

  it("uses the long snapshot lock options when importing a legacy file", async () => {
>>>>>>> upstream/main
    const snapshotPath = path.join(tmpDir, "crypto-idb-snapshot.json");
    const capturedOptions: CapturedLockOptions[] = [];

    withFileLockMock.mockImplementationOnce(async (_filePath, options) => {
      capturedOptions.push(options as CapturedLockOptions);
<<<<<<< HEAD
      return 0;
    });
    await persistIdbToDisk({ snapshotPath, databasePrefix: "openclaw-matrix-test" });

    withFileLockMock.mockImplementationOnce(async (_filePath, options) => {
      capturedOptions.push(options as CapturedLockOptions);
      return false;
    });
    await restoreIdbFromDisk(snapshotPath);

    expect(capturedOptions).toHaveLength(2);
=======
      return false;
    });
    fs.writeFileSync(snapshotPath, "[]", "utf8");
    await restoreIdbFromDisk(snapshotPath);

    expect(capturedOptions).toHaveLength(1);
>>>>>>> upstream/main
    for (const options of capturedOptions) {
      expect(computeMinimumRetryWindowMs(options.retries)).toBeGreaterThanOrEqual(
        MATRIX_IDB_PERSIST_INTERVAL_MS,
      );
      expect(options.stale).toBe(5 * 60_000);
    }
  });
});
