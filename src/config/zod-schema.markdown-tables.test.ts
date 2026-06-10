<<<<<<< HEAD
=======
// Verifies markdown table config schema parsing and defaults.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { MarkdownTableModeSchema } from "./zod-schema.core.js";

describe("MarkdownTableModeSchema", () => {
  it("accepts block mode", () => {
<<<<<<< HEAD
    expect(() => MarkdownTableModeSchema.parse("block")).not.toThrow();
  });

  it("rejects unsupported values", () => {
    expect(() => MarkdownTableModeSchema.parse("plain")).toThrow();
=======
    expect(MarkdownTableModeSchema.parse("block")).toBe("block");
  });

  it("rejects unsupported values", () => {
    const result = MarkdownTableModeSchema.safeParse("plain");

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected unsupported markdown table mode to fail schema validation.");
    }
    expect(result.error.issues[0]?.code).toBe("invalid_value");
>>>>>>> upstream/main
  });
});
