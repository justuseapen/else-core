// Outside-workspace store tests cover media storage outside project roots.
import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";

const mocks = vi.hoisted(() => ({
  readLocalFileSafely: vi.fn(),
<<<<<<< HEAD
  isSafeOpenError: vi.fn(
=======
  isFsSafeError: vi.fn(
>>>>>>> upstream/main
    (error: unknown) => typeof error === "object" && error !== null && "code" in error,
  ),
}));

vi.mock("./store.runtime.js", () => {
  return {
    readLocalFileSafely: mocks.readLocalFileSafely,
<<<<<<< HEAD
    isSafeOpenError: mocks.isSafeOpenError,
=======
    isFsSafeError: mocks.isFsSafeError,
>>>>>>> upstream/main
  };
});

type StoreModule = typeof import("./store.js");

let SaveMediaSourceError: StoreModule["SaveMediaSourceError"];
let saveMediaSource: StoreModule["saveMediaSource"];

async function expectOutsideWorkspaceStoreFailure(sourcePath: string) {
<<<<<<< HEAD
  await expect(saveMediaSource(sourcePath)).rejects.toMatchObject({
    code: "invalid-path",
    message: "Media path is outside workspace root",
=======
  let storeError: unknown;
  try {
    await saveMediaSource(sourcePath);
  } catch (error) {
    storeError = error;
  }
  expect(storeError).toBeInstanceOf(SaveMediaSourceError);
  if (!(storeError instanceof SaveMediaSourceError)) {
    throw new Error("expected SaveMediaSourceError");
  }
  expect(storeError.name).toBe("SaveMediaSourceError");
  expect(storeError.code).toBe("invalid-path");
  expect(storeError.message).toBe("Media path is outside workspace root");
  expect(storeError.cause).toStrictEqual({
    code: "outside-workspace",
    message: "file is outside workspace root",
>>>>>>> upstream/main
  });
}

describe("media store outside-workspace mapping", () => {
  let tempHome: TempHomeEnv;
  let home = "";

  beforeAll(async () => {
<<<<<<< HEAD
    ({ saveMediaSource } = await import("./store.js"));
=======
    ({ SaveMediaSourceError, saveMediaSource } = await import("./store.js"));
>>>>>>> upstream/main
    tempHome = await createTempHomeEnv("openclaw-media-store-test-home-");
    home = tempHome.home;
  });

  afterAll(async () => {
    await tempHome.restore();
  });

  it("maps outside-workspace reads to a descriptive invalid-path error", async () => {
    const sourcePath = path.join(home, "outside-media.txt");
    await fs.writeFile(sourcePath, "hello");
    mocks.readLocalFileSafely.mockRejectedValueOnce({
      code: "outside-workspace",
      message: "file is outside workspace root",
    });

    await expectOutsideWorkspaceStoreFailure(sourcePath);
  });
});
