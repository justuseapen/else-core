<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { __testing } from "./responses-tool-shared.js";
=======
// Xai tests cover responses tool shared plugin behavior.
import { describe, expect, it } from "vitest";
import { testing } from "./responses-tool-shared.js";
>>>>>>> upstream/main

describe("xai responses tool helpers", () => {
  it("builds the shared xAI Responses tool body", () => {
    expect(
<<<<<<< HEAD
      __testing.buildXaiResponsesToolBody({
=======
      testing.buildXaiResponsesToolBody({
>>>>>>> upstream/main
        model: "grok-4-1-fast",
        inputText: "search for openclaw",
        tools: [{ type: "x_search" }],
        maxTurns: 2,
      }),
    ).toEqual({
      model: "grok-4-1-fast",
      input: [{ role: "user", content: "search for openclaw" }],
      tools: [{ type: "x_search" }],
      max_turns: 2,
    });
  });

  it("falls back to annotation citations when the API omits top-level citations", () => {
    expect(
<<<<<<< HEAD
      __testing.resolveXaiResponseTextAndCitations({
=======
      testing.resolveXaiResponseTextAndCitations({
>>>>>>> upstream/main
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: "Found it",
                annotations: [{ type: "url_citation", url: "https://example.com/a" }],
              },
            ],
          },
        ],
      }),
    ).toEqual({
      content: "Found it",
      citations: ["https://example.com/a"],
    });
  });

<<<<<<< HEAD
  it("prefers explicit top-level citations when present", () => {
    expect(
      __testing.resolveXaiResponseTextAndCitations({
=======
  it("ignores malformed output, content, and annotation entries", () => {
    expect(
      testing.extractXaiWebSearchContent({
        output: [
          null,
          {
            type: "message",
            content: [
              null,
              {
                type: "output_text",
                text: "Found it",
                annotations: [
                  null,
                  { type: "url_citation", url: "https://example.com/a" },
                  { type: "url_citation", url: "https://example.com/a" },
                  { type: "url_citation" },
                ],
              },
            ],
          },
        ],
      }),
    ).toEqual({
      text: "Found it",
      annotationCitations: ["https://example.com/a"],
    });
  });

  it("prefers explicit top-level citations when present", () => {
    expect(
      testing.resolveXaiResponseTextAndCitations({
>>>>>>> upstream/main
        output_text: "Done",
        citations: ["https://example.com/b"],
      }),
    ).toEqual({
      content: "Done",
      citations: ["https://example.com/b"],
    });
  });
<<<<<<< HEAD
=======

  it("includes inline citations only when enabled", () => {
    const data = {
      output_text: "Done",
      citations: ["https://example.com/b"],
      inline_citations: [{ start_index: 0, end_index: 4, url: "https://example.com/b" }],
    };
    expect(testing.resolveXaiResponseTextCitationsAndInline(data, true)).toEqual({
      content: "Done",
      citations: ["https://example.com/b"],
      inlineCitations: [{ start_index: 0, end_index: 4, url: "https://example.com/b" }],
    });
    expect(testing.resolveXaiResponseTextCitationsAndInline(data, false)).toEqual({
      content: "Done",
      citations: ["https://example.com/b"],
      inlineCitations: undefined,
    });
  });

  it("rejects successful Responses tool payloads without answer text", () => {
    expect(() => testing.requireXaiResponseTextAndCitations({}, "xAI tool failed")).toThrow(
      "xAI tool failed: malformed JSON response",
    );
  });
>>>>>>> upstream/main
});
