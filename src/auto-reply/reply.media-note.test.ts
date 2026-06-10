<<<<<<< HEAD
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";
import type { OpenClawConfig } from "../config/config.js";
import {
  createReplyRuntimeMocks,
  installReplyRuntimeMocks,
  makeEmbeddedTextResult,
  resetReplyRuntimeMocks,
} from "./reply.test-harness.js";

let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
const agentMocks = createReplyRuntimeMocks();

installReplyRuntimeMocks(agentMocks);

async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(
    async (home) => {
      agentMocks.runEmbeddedPiAgent.mockClear();
      return await fn(home);
    },
    {
      env: {
        OPENCLAW_BUNDLED_SKILLS_DIR: (home) => path.join(home, "bundled-skills"),
      },
      prefix: "openclaw-media-note-",
    },
  );
}

function makeCfg(home: string) {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-6",
        workspace: path.join(home, "openclaw"),
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: path.join(home, "sessions.json") },
  } as unknown as OpenClawConfig;
}
=======
/** Tests media-note behavior as it appears through reply prompt assembly. */
import { describe, expect, it } from "vitest";
import { finalizeInboundContext } from "./reply/inbound-context.js";
import { buildReplyPromptBodies } from "./reply/prompt-prelude.js";
>>>>>>> upstream/main

describe("getReplyFromConfig media note plumbing", () => {
  it("includes all MediaPaths in the agent prompt", () => {
    const sessionCtx = finalizeInboundContext({
      Body: "hello",
      BodyForAgent: "hello",
      From: "+1001",
      To: "+2000",
      MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
      MediaUrls: ["/tmp/a.png", "/tmp/b.png"],
    });
    const prompt = buildReplyPromptBodies({
      ctx: sessionCtx,
      sessionCtx,
      effectiveBaseBody: sessionCtx.BodyForAgent,
      prefixedBody: sessionCtx.BodyForAgent,
    }).prefixedCommandBody;

    expect(prompt).toContain("[media attached: 2 files]");
    const idxA = prompt.indexOf("[media attached 1/2: /tmp/a.png");
    const idxB = prompt.indexOf("[media attached 2/2: /tmp/b.png");
    expect(idxA).toBeGreaterThanOrEqual(0);
    expect(idxB).toBeGreaterThanOrEqual(0);
    expect(idxA).toBeLessThan(idxB);
    expect(prompt).toContain("hello");
  });

  it("keeps the real image attachment note after image understanding rewrites the body", () => {
    const describedBody = [
      "[Image]",
      "User text:",
      "make this widescreen",
      "Description:",
      "a red barn at sunset",
    ].join("\n");
    const sessionCtx = finalizeInboundContext({
      Body: describedBody,
      BodyForAgent: describedBody,
      From: "+1001",
      To: "+2000",
      MediaPaths: ["/tmp/media-store/real-image.png"],
      MediaUrls: ["https://example.com/real-image.png"],
      MediaTypes: ["image/png"],
      MediaUnderstanding: [
        {
          kind: "image.description",
          attachmentIndex: 0,
          text: "a red barn at sunset",
          provider: "openai",
        },
      ],
    });
    const prompt = buildReplyPromptBodies({
      ctx: sessionCtx,
      sessionCtx,
      effectiveBaseBody: sessionCtx.BodyForAgent,
      prefixedBody: sessionCtx.BodyForAgent,
    }).prefixedCommandBody;

    expect(prompt).toContain(
      "[media attached: /tmp/media-store/real-image.png (image/png) | https://example.com/real-image.png]",
    );
    expect(prompt).toContain(describedBody);
  });
});
