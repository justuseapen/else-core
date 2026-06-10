<<<<<<< HEAD:src/agents/pi-embedded-helpers/bootstrap.test.ts
=======
// Covers bootstrap stripping of invalid thought-signature fields.
>>>>>>> upstream/main:src/agents/embedded-agent-helpers/bootstrap.test.ts
import { describe, expect, it } from "vitest";
import { stripThoughtSignatures } from "./bootstrap.js";

describe("stripThoughtSignatures", () => {
  it("preserves thinkingSignature while still stripping invalid thought signatures", () => {
<<<<<<< HEAD:src/agents/pi-embedded-helpers/bootstrap.test.ts
=======
    // Providers use camel-case thinkingSignature for signed reasoning, while
    // OpenClaw-style thoughtSignature fields are internal and must be stripped.
>>>>>>> upstream/main:src/agents/embedded-agent-helpers/bootstrap.test.ts
    const thinkingBlock = {
      type: "thinking",
      thinking: "internal",
      thinkingSignature: "keep_me",
      thoughtSignature: "msg_123",
    };
    const redactedBlock = {
      type: "redacted_thinking",
      redacted_thinking: "...",
      thinkingSignature: "keep_me_too",
      thoughtSignature: "msg_456",
    };
    const textBlock = {
      type: "text",
      text: "visible",
      thoughtSignature: "msg_789",
    };

    const result = stripThoughtSignatures([thinkingBlock, redactedBlock, textBlock], {
      includeCamelCase: true,
    });

    expect(result[0]).toEqual({
      type: "thinking",
      thinking: "internal",
      thinkingSignature: "keep_me",
    });
    expect(result[1]).toEqual({
      type: "redacted_thinking",
      redacted_thinking: "...",
      thinkingSignature: "keep_me_too",
    });
    expect(result[2]).toEqual({
      type: "text",
      text: "visible",
    });
  });
});
