// Text-end repeat tests ensure repeated full snapshots do not duplicate block
// replies or assistantTexts.
import { describe, expect, it, vi } from "vitest";
import {
  createTextEndBlockReplyHarness,
  emitAssistantTextDelta,
  emitAssistantTextEnd,
  extractTextPayloads,
} from "./embedded-agent-subscribe.e2e-harness.js";

<<<<<<< HEAD:src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-duplicate-text-end-repeats-full.test.ts
describe("subscribeEmbeddedPiSession", () => {
=======
describe("subscribeEmbeddedAgentSession", () => {
>>>>>>> upstream/main:src/agents/embedded-agent-subscribe.subscribe-embedded-agent-session.does-not-duplicate-text-end-repeats-full.test.ts
  it("does not duplicate when text_end repeats full content", async () => {
    const onBlockReply = vi.fn();
    const { emit, subscription } = createTextEndBlockReplyHarness({ onBlockReply });

    emitAssistantTextDelta({ emit, delta: "Good morning!" });
    emitAssistantTextEnd({ emit, content: "Good morning!" });
    await Promise.resolve();

    await vi.waitFor(() => {
      expect(onBlockReply).toHaveBeenCalledTimes(1);
    });
    expect(subscription.assistantTexts).toEqual(["Good morning!"]);
  });
  it("does not duplicate block chunks when text_end repeats full content", async () => {
<<<<<<< HEAD:src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-duplicate-text-end-repeats-full.test.ts
=======
    // Chunked deltas may already flush all visible text before text_end repeats
    // the same content; the snapshot must be ignored.
>>>>>>> upstream/main:src/agents/embedded-agent-subscribe.subscribe-embedded-agent-session.does-not-duplicate-text-end-repeats-full.test.ts
    const onBlockReply = vi.fn();
    const { emit } = createTextEndBlockReplyHarness({
      onBlockReply,
      blockReplyChunking: {
        minChars: 5,
        maxChars: 40,
        breakPreference: "newline",
      },
    });

    const fullText = "First line\nSecond line\nThird line\n";

    emitAssistantTextDelta({ emit, delta: fullText });
    await Promise.resolve();

    const callsAfterDelta = onBlockReply.mock.calls.length;
    expect(extractTextPayloads(onBlockReply.mock.calls)).toEqual([
      "First line\nSecond line\nThird line",
    ]);

    emitAssistantTextEnd({ emit, content: fullText });
    await Promise.resolve();

    expect(onBlockReply).toHaveBeenCalledTimes(callsAfterDelta);
  });
});
