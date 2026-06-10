<<<<<<< HEAD
=======
// Diffs tests cover manifest plugin behavior.
>>>>>>> upstream/main
import fs from "node:fs";
import { describe, expect, it } from "vitest";

type DiffsPackageManifest = {
  dependencies?: Record<string, string>;
<<<<<<< HEAD
  openclaw?: {
    bundle?: {
      stageRuntimeDependencies?: boolean;
    };
  };
};

describe("diffs package manifest", () => {
  it("opts into staging bundled runtime dependencies", () => {
=======
};

describe("diffs package manifest", () => {
  it("keeps runtime dependencies in the package manifest", () => {
>>>>>>> upstream/main
    const packageJson = JSON.parse(
      fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as DiffsPackageManifest;

<<<<<<< HEAD
    expect(packageJson.dependencies?.["@pierre/diffs"]).toBeDefined();
    expect(packageJson.openclaw?.bundle?.stageRuntimeDependencies).toBe(true);
=======
    expect(packageJson.dependencies).toHaveProperty("@pierre/diffs");
>>>>>>> upstream/main
  });
});
