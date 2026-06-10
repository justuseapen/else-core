// Covers bound delivery routing for active bindings, requester matching,
// ambiguous bindings, and fail-closed fallback reasons.
import { beforeEach, describe, expect, it } from "vitest";
import { createBoundDeliveryRouter } from "./bound-delivery-router.js";
import {
  testing,
  registerSessionBindingAdapter,
  type SessionBindingRecord,
} from "./session-binding-service.js";

const TARGET_SESSION_KEY = "agent:main:subagent:child";

function createRuntimeBinding(
  targetSessionKey: string,
  conversationId: string,
  boundAt: number,
  parentConversationId?: string,
): SessionBindingRecord {
  return {
    bindingId: `runtime:${conversationId}`,
    targetSessionKey,
    targetKind: "subagent",
    conversation: {
      channel: "richchat",
      accountId: "runtime",
      conversationId,
      parentConversationId,
    },
    status: "active",
    boundAt,
  };
}

function registerRuntimeSessionBindings(
  targetSessionKey: string,
  bindings: SessionBindingRecord[],
): void {
  registerSessionBindingAdapter({
    channel: "richchat",
    accountId: "runtime",
    listBySession: (requestedSessionKey) =>
      requestedSessionKey === targetSessionKey ? bindings : [],
    resolveByConversation: () => null,
  });
}

describe("bound delivery router", () => {
  beforeEach(() => {
    testing.resetSessionBindingAdaptersForTests();
  });

  const resolveDestination = (params: {
    targetSessionKey?: string;
    bindings?: SessionBindingRecord[];
    requesterConversationId?: string;
    failClosed?: boolean;
  }) => {
    if (params.bindings) {
<<<<<<< HEAD
      registerDiscordSessionBindings(
=======
      registerRuntimeSessionBindings(
>>>>>>> upstream/main
        params.targetSessionKey ?? TARGET_SESSION_KEY,
        params.bindings,
      );
    }
    return createBoundDeliveryRouter().resolveDestination({
      eventKind: "task_completion",
      targetSessionKey: params.targetSessionKey ?? TARGET_SESSION_KEY,
      ...(params.requesterConversationId !== undefined
        ? {
            requester: {
<<<<<<< HEAD
              channel: "discord",
=======
              channel: "richchat",
>>>>>>> upstream/main
              accountId: "runtime",
              conversationId: params.requesterConversationId,
            },
          }
        : {}),
      failClosed: params.failClosed ?? false,
    });
  };

  it.each([
    {
      name: "resolves to a bound destination when a single active binding exists",
<<<<<<< HEAD
      bindings: [createDiscordBinding(TARGET_SESSION_KEY, "thread-1", 1, "parent-1")],
=======
      bindings: [createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1, "parent-1")],
>>>>>>> upstream/main
      requesterConversationId: "parent-1",
      expected: {
        mode: "bound",
      },
      expectedConversationId: "thread-1",
    },
    {
      name: "falls back when no active binding exists",
      targetSessionKey: "agent:main:subagent:missing",
      requesterConversationId: "parent-1",
      expected: {
        binding: null,
        mode: "fallback",
        reason: "no-active-binding",
      },
    },
    {
      name: "fails closed when multiple bindings exist without requester signal",
      bindings: [
<<<<<<< HEAD
        createDiscordBinding(TARGET_SESSION_KEY, "thread-1", 1),
        createDiscordBinding(TARGET_SESSION_KEY, "thread-2", 2),
=======
        createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1),
        createRuntimeBinding(TARGET_SESSION_KEY, "thread-2", 2),
>>>>>>> upstream/main
      ],
      failClosed: true,
      expected: {
        binding: null,
        mode: "fallback",
<<<<<<< HEAD
        reason: "ambiguous-without-requester",
      },
    },
    {
      name: "selects requester-matching conversation when multiple bindings exist",
      bindings: [
        createDiscordBinding(TARGET_SESSION_KEY, "thread-1", 1),
        createDiscordBinding(TARGET_SESSION_KEY, "thread-2", 2),
      ],
      requesterConversationId: "thread-2",
      failClosed: true,
      expected: {
        mode: "bound",
        reason: "requester-match",
      },
      expectedConversationId: "thread-2",
    },
    {
      name: "falls back for invalid requester conversation values",
      bindings: [createDiscordBinding(TARGET_SESSION_KEY, "thread-1", 1)],
      requesterConversationId: " ",
      failClosed: true,
      expected: {
=======
        reason: "missing-requester",
      },
    },
    {
      name: "fails closed when requester signal is missing even with a single binding",
      bindings: [createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1)],
      failClosed: true,
      expected: {
        binding: null,
        mode: "fallback",
        reason: "missing-requester",
      },
    },
    {
      name: "selects requester-matching conversation when multiple bindings exist",
      bindings: [
        createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1),
        createRuntimeBinding(TARGET_SESSION_KEY, "thread-2", 2),
      ],
      requesterConversationId: "thread-2",
      failClosed: true,
      expected: {
        mode: "bound",
        reason: "requester-match",
      },
      expectedConversationId: "thread-2",
    },
    {
      name: "normalizes adapter binding conversations before requester matching",
      bindings: [
        {
          ...createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1),
          conversation: {
            channel: " richchat ",
            accountId: " runtime ",
            conversationId: " thread-1 ",
          },
        },
        {
          ...createRuntimeBinding(TARGET_SESSION_KEY, "thread-2", 2),
          conversation: {
            channel: " RICHCHAT ",
            accountId: " Runtime ",
            conversationId: " thread-2 ",
          },
        },
      ],
      requesterConversationId: "thread-2",
      failClosed: true,
      expected: {
        mode: "bound",
        reason: "requester-match",
      },
      expectedConversationId: " thread-2 ",
    },
    {
      name: "falls back for invalid requester conversation values",
      bindings: [createRuntimeBinding(TARGET_SESSION_KEY, "thread-1", 1)],
      requesterConversationId: " ",
      failClosed: true,
      expected: {
>>>>>>> upstream/main
        binding: null,
        mode: "fallback",
        reason: "invalid-requester",
      },
    },
  ])(
    "$name",
    ({
      targetSessionKey,
      bindings,
      requesterConversationId,
      failClosed,
      expected,
      expectedConversationId,
    }) => {
      const route = resolveDestination({
        targetSessionKey,
        bindings,
        requesterConversationId,
        failClosed,
      });

<<<<<<< HEAD
      expect(route).toMatchObject(expected);
=======
      for (const [key, value] of Object.entries(expected)) {
        expect((route as Record<string, unknown>)[key]).toEqual(value);
      }
>>>>>>> upstream/main
      if (expectedConversationId !== undefined) {
        expect(route.binding?.conversation.conversationId).toBe(expectedConversationId);
      }
    },
  );
});
