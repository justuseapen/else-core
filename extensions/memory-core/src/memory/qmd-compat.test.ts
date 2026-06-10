<<<<<<< HEAD
=======
// Memory Core tests cover qmd compat plugin behavior.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { resolveQmdCollectionPatternFlags } from "./qmd-compat.js";

describe("resolveQmdCollectionPatternFlags", () => {
<<<<<<< HEAD
  it("prefers modern --glob by default and falls back to legacy --mask", () => {
    expect(resolveQmdCollectionPatternFlags(null)).toEqual(["--glob", "--mask"]);
    expect(resolveQmdCollectionPatternFlags("--glob")).toEqual(["--glob", "--mask"]);
  });

  it("keeps preferring legacy --mask after a legacy-only qmd succeeds", () => {
    expect(resolveQmdCollectionPatternFlags("--mask")).toEqual(["--mask", "--glob"]);
  });
=======
  it("prefers --mask by default and falls back to --glob", () => {
    expect(resolveQmdCollectionPatternFlags(null)).toEqual(["--mask", "--glob"]);
    expect(resolveQmdCollectionPatternFlags("--mask")).toEqual(["--mask", "--glob"]);
  });

  it("keeps preferring --glob after a glob-only qmd succeeds", () => {
    expect(resolveQmdCollectionPatternFlags("--glob")).toEqual(["--glob", "--mask"]);
  });
>>>>>>> upstream/main
});
