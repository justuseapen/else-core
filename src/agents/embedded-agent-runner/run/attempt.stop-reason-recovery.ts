<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
import type { StreamFn } from "@mariozechner/pi-agent-core";
import { createAssistantMessageEventStream, streamSimple } from "@mariozechner/pi-ai";
=======
/**
 * Recovers sensitive stop reasons by wrapping provider stream functions.
 */
import { formatErrorMessage } from "../../../infra/errors.js";
import { createAssistantMessageEventStream } from "../../../llm/utils/event-stream.js";
import type { StreamFn } from "../../runtime/index.js";
import type { MutableAssistantMessageEventStream } from "../../stream-compat.js";
import { createStreamIteratorWrapper } from "../../stream-iterator-wrapper.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
import { buildStreamErrorAssistantMessage } from "../../stream-message-shared.js";

const UNHANDLED_STOP_REASON_RE = /^Unhandled stop reason:\s*(.+)$/i;

function formatUnhandledStopReasonErrorMessage(stopReason: string): string {
  return `The model stopped because the provider returned an unhandled stop reason: ${stopReason}. Please rephrase and try again.`;
}

function normalizeUnhandledStopReasonMessage(message: unknown): string | undefined {
  if (typeof message !== "string") {
    return undefined;
  }
  const match = message.trim().match(UNHANDLED_STOP_REASON_RE);
  const stopReason = match?.[1]?.trim();
  if (!stopReason) {
    return undefined;
  }
  return formatUnhandledStopReasonErrorMessage(stopReason);
}

function patchUnhandledStopReasonInAssistantMessage(message: unknown): void {
  if (!message || typeof message !== "object") {
    return;
  }

  const assistant = message as { errorMessage?: unknown; stopReason?: unknown };
  const normalizedMessage = normalizeUnhandledStopReasonMessage(assistant.errorMessage);
  if (!normalizedMessage) {
    return;
  }

  assistant.stopReason = "error";
  assistant.errorMessage = normalizedMessage;
}

function buildUnhandledStopReasonErrorStream(
  model: Parameters<StreamFn>[0],
  errorMessage: string,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
): ReturnType<typeof streamSimple> {
=======
): MutableAssistantMessageEventStream {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
  const stream = createAssistantMessageEventStream();
  queueMicrotask(() => {
    stream.push({
      type: "error",
      reason: "error",
      error: buildStreamErrorAssistantMessage({
        model: {
          api: model.api,
          provider: model.provider,
          id: model.id,
        },
        errorMessage,
      }),
    });
    stream.end();
  });
  return stream;
}

function wrapStreamHandleUnhandledStopReason(
  model: Parameters<StreamFn>[0],
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
  stream: ReturnType<typeof streamSimple>,
): ReturnType<typeof streamSimple> {
=======
  stream: MutableAssistantMessageEventStream,
): MutableAssistantMessageEventStream {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
  const originalResult = stream.result.bind(stream);
  stream.result = async () => {
    try {
      const message = await originalResult();
      patchUnhandledStopReasonInAssistantMessage(message);
      return message;
    } catch (err) {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
      const normalizedMessage = normalizeUnhandledStopReasonMessage(
        err instanceof Error ? err.message : String(err),
      );
=======
      const normalizedMessage = normalizeUnhandledStopReasonMessage(formatErrorMessage(err));
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
      if (!normalizedMessage) {
        throw err;
      }
      return buildStreamErrorAssistantMessage({
        model: {
          api: model.api,
          provider: model.provider,
          id: model.id,
        },
        errorMessage: normalizedMessage,
      });
    }
  };

  const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
  (stream as { [Symbol.asyncIterator]: typeof originalAsyncIterator })[Symbol.asyncIterator] =
    function () {
      const iterator = originalAsyncIterator();
      let emittedSyntheticTerminal = false;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
      return {
        async next() {
=======
      return createStreamIteratorWrapper({
        iterator,
        next: async (streamIterator) => {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
          if (emittedSyntheticTerminal) {
            return { done: true as const, value: undefined };
          }

          try {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
            const result = await iterator.next();
=======
            const result = await streamIterator.next();
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
            if (!result.done && result.value && typeof result.value === "object") {
              const event = result.value as { error?: unknown };
              patchUnhandledStopReasonInAssistantMessage(event.error);
            }
            return result;
          } catch (err) {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
            const normalizedMessage = normalizeUnhandledStopReasonMessage(
              err instanceof Error ? err.message : String(err),
            );
            if (!normalizedMessage) {
              throw err;
            }
=======
            const normalizedMessage = normalizeUnhandledStopReasonMessage(formatErrorMessage(err));
            if (!normalizedMessage) {
              throw err;
            }
            // The provider stream failed before yielding a terminal event. Emit a
            // synthetic error event once so callers still receive a normal stream
            // shape and iterator completion.
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
            emittedSyntheticTerminal = true;
            return {
              done: false as const,
              value: {
                type: "error" as const,
                reason: "error" as const,
                error: buildStreamErrorAssistantMessage({
                  model: {
                    api: model.api,
                    provider: model.provider,
                    id: model.id,
                  },
                  errorMessage: normalizedMessage,
                }),
              },
            };
          }
        },
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
        async return(value?: unknown) {
          return iterator.return?.(value) ?? { done: true as const, value: undefined };
        },
        async throw(error?: unknown) {
          return iterator.throw?.(error) ?? { done: true as const, value: undefined };
        },
        [Symbol.asyncIterator]() {
          return this;
        },
      };
=======
      });
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
    };

  return stream;
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
=======
/**
 * Wraps provider streams so raw "Unhandled stop reason" failures are rewritten
 * into stable error messages. Recovery covers synchronous creation failures,
 * async stream creation failures, iterator errors, and `result()` errors.
 */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
export function wrapStreamFnHandleSensitiveStopReason(baseFn: StreamFn): StreamFn {
  return (model, context, options) => {
    try {
      const maybeStream = baseFn(model, context, options);
      if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) {
        return Promise.resolve(maybeStream).then(
          (stream) => wrapStreamHandleUnhandledStopReason(model, stream),
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
          (err) => {
            const normalizedMessage = normalizeUnhandledStopReasonMessage(
              err instanceof Error ? err.message : String(err),
            );
=======
          (err: unknown) => {
            const normalizedMessage = normalizeUnhandledStopReasonMessage(formatErrorMessage(err));
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
            if (!normalizedMessage) {
              throw err;
            }
            return buildUnhandledStopReasonErrorStream(model, normalizedMessage);
          },
        );
      }
      return wrapStreamHandleUnhandledStopReason(model, maybeStream);
    } catch (err) {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/attempt.stop-reason-recovery.ts
      const normalizedMessage = normalizeUnhandledStopReasonMessage(
        err instanceof Error ? err.message : String(err),
      );
=======
      const normalizedMessage = normalizeUnhandledStopReasonMessage(formatErrorMessage(err));
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/attempt.stop-reason-recovery.ts
      if (!normalizedMessage) {
        throw err;
      }
      return buildUnhandledStopReasonErrorStream(model, normalizedMessage);
    }
  };
}
