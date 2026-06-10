<<<<<<< HEAD:src/agents/pi-embedded-runner/run.codex-server-error-fallback.test.ts
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
=======
// Coverage for handing Codex server_error turns to model fallback.
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { makeAssistantMessageFixture } from "../test-helpers/assistant-message-fixtures.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.codex-server-error-fallback.test.ts
import { makeModelFallbackCfg } from "../test-helpers/model-fallback-config-fixture.js";
import { makeAttemptResult } from "./run.overflow-compaction.fixture.js";
import {
  loadRunOverflowCompactionHarness,
  MockedFailoverError,
  mockedClassifyFailoverReason,
  mockedFormatAssistantErrorText,
  mockedGlobalHookRunner,
  mockedIsFailoverAssistantError,
  mockedRunEmbeddedAttempt,
  overflowBaseRunParams,
  resetRunOverflowCompactionHarnessMocks,
} from "./run.overflow-compaction.harness.js";
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.codex-server-error-fallback.test.ts
import type { EmbeddedRunAttemptResult } from "./run/types.js";

let runEmbeddedPiAgent: typeof import("./run.js").runEmbeddedPiAgent;

describe("runEmbeddedPiAgent Codex server_error fallback handoff", () => {
  beforeAll(async () => {
    ({ runEmbeddedPiAgent } = await loadRunOverflowCompactionHarness());
=======

let runEmbeddedAgent: typeof import("./run.js").runEmbeddedAgent;

describe("runEmbeddedAgent Codex server_error fallback handoff", () => {
  beforeAll(async () => {
    ({ runEmbeddedAgent } = await loadRunOverflowCompactionHarness());
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.codex-server-error-fallback.test.ts
  });

  beforeEach(() => {
    resetRunOverflowCompactionHarnessMocks();
    mockedGlobalHookRunner.hasHooks.mockImplementation(() => false);
  });

  it("throws FailoverError for Codex server_error when model fallbacks are configured", async () => {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.codex-server-error-fallback.test.ts
=======
    // Codex server_error is a provider failure, not a normal assistant reply;
    // configured fallbacks should receive it through the failover path.
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.codex-server-error-fallback.test.ts
    const rawCodexError =
      'Codex error: {"type":"error","error":{"type":"server_error","code":"server_error","message":"An error occurred while processing your request."},"sequence_number":2}';

    mockedClassifyFailoverReason.mockReturnValue("timeout");
    mockedIsFailoverAssistantError.mockReturnValue(true);
    mockedFormatAssistantErrorText.mockReturnValue(
      "LLM error server_error: An error occurred while processing your request.",
    );
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.codex-server-error-fallback.test.ts
    mockedRunEmbeddedAttempt.mockResolvedValueOnce(
      makeAttemptResult({
        assistantTexts: [],
        lastAssistant: {
          stopReason: "error",
          errorMessage: rawCodexError,
          provider: "openai-codex",
          model: "gpt-5.4",
        } as EmbeddedRunAttemptResult["lastAssistant"],
      }),
    );

    const promise = runEmbeddedPiAgent({
=======
    const currentAttemptAssistant = makeAssistantMessageFixture({
      stopReason: "error",
      errorMessage: rawCodexError,
      provider: "openai",
      model: "gpt-5.4",
    });
    mockedRunEmbeddedAttempt.mockResolvedValueOnce(
      makeAttemptResult({
        assistantTexts: [],
        lastAssistant: currentAttemptAssistant,
        currentAttemptAssistant,
      }),
    );

    const promise = runEmbeddedAgent({
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.codex-server-error-fallback.test.ts
      ...overflowBaseRunParams,
      runId: "run-codex-server-error-fallback",
      config: makeModelFallbackCfg({
        agents: {
          defaults: {
            model: {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.codex-server-error-fallback.test.ts
              primary: "openai-codex/gpt-5.4",
=======
              primary: "openai/gpt-5.4",
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.codex-server-error-fallback.test.ts
              fallbacks: ["anthropic/claude-opus-4-6"],
            },
          },
        },
      }),
    });

    await expect(promise).rejects.toBeInstanceOf(MockedFailoverError);
    await expect(promise).rejects.toThrow(
      "LLM error server_error: An error occurred while processing your request.",
    );
  });
});
