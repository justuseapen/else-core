<<<<<<< HEAD
=======
// Memory Core plugin module implements qmd compat behavior.
>>>>>>> upstream/main
export type QmdCollectionPatternFlag = "--glob" | "--mask";

export function resolveQmdCollectionPatternFlags(
  preferredFlag: QmdCollectionPatternFlag | null,
): QmdCollectionPatternFlag[] {
<<<<<<< HEAD
  return preferredFlag === "--mask" ? ["--mask", "--glob"] : ["--glob", "--mask"];
=======
  return preferredFlag === "--glob" ? ["--glob", "--mask"] : ["--mask", "--glob"];
>>>>>>> upstream/main
}
