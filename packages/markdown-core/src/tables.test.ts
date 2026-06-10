<<<<<<< HEAD:src/markdown/tables.test.ts
=======
// Markdown Core tests cover tables behavior.
>>>>>>> upstream/main:packages/markdown-core/src/tables.test.ts
import { describe, expect, it } from "vitest";
import { convertMarkdownTables } from "./tables.js";

describe("convertMarkdownTables", () => {
  it("falls back to code rendering for block mode", () => {
    const rendered = convertMarkdownTables("| A | B |\n|---|---|\n| 1 | 2 |", "block");

<<<<<<< HEAD:src/markdown/tables.test.ts
    expect(rendered).toContain("```");
    expect(rendered).toContain("| A | B |");
    expect(rendered).toContain("| 1 | 2 |");
=======
    expect(rendered).toBe("```\n| A | B |\n| --- | --- |\n| 1 | 2 |\n```");
>>>>>>> upstream/main:packages/markdown-core/src/tables.test.ts
  });
});
