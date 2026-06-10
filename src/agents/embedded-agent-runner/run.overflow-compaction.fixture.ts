<<<<<<< HEAD:src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
=======
/**
 * Test fixtures for embedded-run overflow compaction scenarios.
 */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.overflow-compaction.fixture.ts
import { buildAttemptReplayMetadata } from "./run/incomplete-turn.js";
import type { EmbeddedRunAttemptResult } from "./run/types.js";

const DEFAULT_OVERFLOW_ERROR_MESSAGE =
  "request_too_large: Request size exceeds model context window";

export function makeOverflowError(message: string = DEFAULT_OVERFLOW_ERROR_MESSAGE): Error {
  return new Error(message);
}

export function makeCompactionSuccess(params: {
  summary: string;
  firstKeptEntryId?: string;
  tokensBefore?: number;
  tokensAfter?: number;
  sessionId?: string;
  sessionFile?: string;
}) {
  return {
    ok: true as const,
    compacted: true as const,
    result: {
      summary: params.summary,
      ...(params.firstKeptEntryId ? { firstKeptEntryId: params.firstKeptEntryId } : {}),
      ...(params.tokensBefore !== undefined ? { tokensBefore: params.tokensBefore } : {}),
      ...(params.tokensAfter !== undefined ? { tokensAfter: params.tokensAfter } : {}),
      ...(params.sessionId !== undefined ? { sessionId: params.sessionId } : {}),
      ...(params.sessionFile !== undefined ? { sessionFile: params.sessionFile } : {}),
    },
  };
}

export function makeAttemptResult(
  overrides: Partial<EmbeddedRunAttemptResult> = {},
): EmbeddedRunAttemptResult {
  const toolMetas = overrides.toolMetas ?? [];
  const didSendViaMessagingTool = overrides.didSendViaMessagingTool ?? false;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
  const successfulCronAdds = overrides.successfulCronAdds;
=======
  const messagingToolSentTexts = overrides.messagingToolSentTexts ?? [];
  const messagingToolSentMediaUrls = overrides.messagingToolSentMediaUrls ?? [];
  const messagingToolSentTargets = overrides.messagingToolSentTargets ?? [];
  const successfulCronAdds = overrides.successfulCronAdds;
  const acceptedSessionSpawns = overrides.acceptedSessionSpawns ?? [];
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.overflow-compaction.fixture.ts
  return {
    aborted: false,
    externalAbort: false,
    timedOut: false,
    idleTimedOut: false,
    timedOutDuringCompaction: false,
    timedOutDuringToolExecution: false,
    promptError: null,
    promptErrorSource: null,
    sessionIdUsed: "test-session",
    assistantTexts: ["Hello!"],
    toolMetas,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
=======
    acceptedSessionSpawns,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.overflow-compaction.fixture.ts
    lastAssistant: undefined,
    messagesSnapshot: [],
    replayMetadata:
      overrides.replayMetadata ??
      buildAttemptReplayMetadata({
        toolMetas,
        didSendViaMessagingTool,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
=======
        messagingToolSentTexts,
        messagingToolSentMediaUrls,
        messagingToolSentTargets,
        acceptedSessionSpawns,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.overflow-compaction.fixture.ts
        successfulCronAdds,
      }),
    itemLifecycle: {
      startedCount: 0,
      completedCount: 0,
      activeCount: 0,
    },
    didSendViaMessagingTool,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
    messagingToolSentTexts: [],
    messagingToolSentMediaUrls: [],
    messagingToolSentTargets: [],
=======
    messagingToolSentTexts,
    messagingToolSentMediaUrls,
    messagingToolSentTargets,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run.overflow-compaction.fixture.ts
    cloudCodeAssistFormatError: false,
    ...overrides,
  };
}

type MockRunEmbeddedAttempt = {
  mockResolvedValueOnce: (value: EmbeddedRunAttemptResult) => unknown;
};

type MockCompactDirect = {
  mockResolvedValueOnce: (value: {
    ok: true;
    compacted: true;
    result: {
      summary: string;
      firstKeptEntryId?: string;
      tokensBefore?: number;
      tokensAfter?: number;
      sessionId?: string;
      sessionFile?: string;
    };
  }) => unknown;
};

export function mockOverflowRetrySuccess(params: {
  runEmbeddedAttempt: MockRunEmbeddedAttempt;
  compactDirect: MockCompactDirect;
  overflowMessage?: string;
}) {
  const overflowError = makeOverflowError(params.overflowMessage);

  params.runEmbeddedAttempt.mockResolvedValueOnce(
    makeAttemptResult({ promptError: overflowError }),
  );
  params.runEmbeddedAttempt.mockResolvedValueOnce(makeAttemptResult({ promptError: null }));

  params.compactDirect.mockResolvedValueOnce(
    makeCompactionSuccess({
      summary: "Compacted session",
      firstKeptEntryId: "entry-5",
      tokensBefore: 150000,
    }),
  );

  return overflowError;
}

export function queueOverflowAttemptWithOversizedToolOutput(
  runEmbeddedAttempt: MockRunEmbeddedAttempt,
  overflowError: Error = makeOverflowError(),
): Error {
  runEmbeddedAttempt.mockResolvedValueOnce(
    makeAttemptResult({
      promptError: overflowError,
      messagesSnapshot: [
        {
          role: "toolResult",
          content: [{ type: "text", text: "x".repeat(80_000) }],
        } as unknown as EmbeddedRunAttemptResult["messagesSnapshot"][number],
      ],
    }),
  );
  return overflowError;
}
