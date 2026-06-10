<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { BrowserValidationError, toBrowserErrorResponse } from "./errors.js";

describe("browser error mapping", () => {
  it("maps blocked browser targets to conflict responses", () => {
    const err = new Error(
      "Browser target is unavailable after SSRF policy blocked its navigation.",
    );
    err.name = "BlockedBrowserTargetError";

    expect(toBrowserErrorResponse(err)).toEqual({
      status: 409,
      message: "Browser target is unavailable after SSRF policy blocked its navigation.",
    });
  });

  it("preserves BrowserError mappings", () => {
    expect(toBrowserErrorResponse(new BrowserValidationError("bad input"))).toEqual({
      status: 400,
      message: "bad input",
    });
=======
// Browser tests cover errors plugin behavior.
import { describe, expect, it } from "vitest";
import { BrowserTabNotFoundError } from "./errors.js";

describe("BrowserTabNotFoundError", () => {
  it("teaches agents that bare numbers are not stable tab targets", () => {
    const err = new BrowserTabNotFoundError({ input: "2" });

    expect(err.message).toBe(
      'tab not found: browser tab "2" not found. Numeric values are not tab targets; use a stable tab id like "t1", a label, or a raw targetId. For positional selection, use "openclaw browser tab select 2".',
    );
>>>>>>> upstream/main
  });
});
