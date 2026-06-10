<<<<<<< HEAD
import { extractQaToolPayload } from "./extract-tool-payload.js";
import { qaChannelPlugin, type OpenClawConfig } from "./runtime-api.js";
import type { QaScenarioDefinition } from "./scenario.js";

export function createQaSelfCheckScenario(cfg: OpenClawConfig): QaScenarioDefinition {
=======
// Qa Lab plugin module implements self check scenario behavior.
import { extractQaToolPayload } from "./extract-tool-payload.js";
import type { QaScenarioDefinition } from "./scenario.js";

export function createQaSelfCheckScenario(options?: {
  waitTimeoutMs?: number;
}): QaScenarioDefinition {
  const waitTimeoutMs = options?.waitTimeoutMs ?? 5_000;
>>>>>>> upstream/main
  return {
    name: "Synthetic Slack-class roundtrip",
    steps: [
      {
        name: "DM echo roundtrip",
        async run({ state }) {
<<<<<<< HEAD
          state.addInboundMessage({
=======
          await state.addInboundMessage({
>>>>>>> upstream/main
            conversation: { id: "alice", kind: "direct" },
            senderId: "alice",
            senderName: "Alice",
            text: "hello from qa",
          });
          await state.waitFor({
            kind: "message-text",
            textIncludes: "qa-echo: hello from qa",
            direction: "outbound",
<<<<<<< HEAD
            timeoutMs: 5_000,
=======
            timeoutMs: waitTimeoutMs,
>>>>>>> upstream/main
          });
        },
      },
      {
        name: "Thread create and threaded echo",
<<<<<<< HEAD
        async run({ state }) {
          const threadResult = await qaChannelPlugin.actions?.handleAction?.({
            channel: "qa-channel",
            action: "thread-create",
            cfg,
            accountId: "default",
            params: {
              channelId: "qa-room",
              title: "QA thread",
            },
          });
          const threadPayload = extractQaToolPayload(threadResult) as
            | { thread?: { id?: string } }
            | undefined;
=======
        async run({ state, performAction }) {
          if (!performAction) {
            throw new Error("self-check action dispatcher is not configured");
          }
          const threadResult = await performAction("thread-create", {
            channelId: "qa-room",
            title: "QA thread",
          });
          const threadPayload = extractQaToolPayload(
            threadResult as Parameters<typeof extractQaToolPayload>[0],
          ) as { thread?: { id?: string } } | undefined;
>>>>>>> upstream/main
          const threadId = threadPayload?.thread?.id;
          if (!threadId) {
            throw new Error("thread-create did not return thread id");
          }

<<<<<<< HEAD
          state.addInboundMessage({
=======
          await state.addInboundMessage({
>>>>>>> upstream/main
            conversation: { id: "qa-room", kind: "channel", title: "QA Room" },
            senderId: "alice",
            senderName: "Alice",
            text: "inside thread",
            threadId,
            threadTitle: "QA thread",
          });
          await state.waitFor({
            kind: "message-text",
            textIncludes: "qa-echo: inside thread",
            direction: "outbound",
<<<<<<< HEAD
            timeoutMs: 5_000,
=======
            timeoutMs: waitTimeoutMs,
>>>>>>> upstream/main
          });
          return threadId;
        },
      },
      {
        name: "Reaction, edit, delete lifecycle",
<<<<<<< HEAD
        async run({ state }) {
          const outbound = state
            .searchMessages({ query: "qa-echo: inside thread", conversationId: "qa-room" })
            .at(-1);
          if (!outbound) {
            throw new Error("threaded outbound message not found");
          }

          await qaChannelPlugin.actions?.handleAction?.({
            channel: "qa-channel",
            action: "react",
            cfg,
            accountId: "default",
            params: {
              messageId: outbound.id,
              emoji: "white_check_mark",
            },
          });
          const reacted = state.readMessage({ messageId: outbound.id });
=======
        async run({ state, performAction }) {
          if (!performAction) {
            throw new Error("self-check action dispatcher is not configured");
          }
          const outboundMessage = (
            await state.searchMessages({
              query: "qa-echo: inside thread",
              conversationId: "qa-room",
            })
          ).at(-1);
          if (!outboundMessage) {
            throw new Error("threaded outbound message not found");
          }

          await performAction("react", {
            messageId: outboundMessage.id,
            emoji: "white_check_mark",
          });
          const reacted = await state.readMessage({ messageId: outboundMessage.id });
          if (!reacted) {
            throw new Error("reacted message not found");
          }
>>>>>>> upstream/main
          if (reacted.reactions.length === 0) {
            throw new Error("reaction not recorded");
          }

<<<<<<< HEAD
          await qaChannelPlugin.actions?.handleAction?.({
            channel: "qa-channel",
            action: "edit",
            cfg,
            accountId: "default",
            params: {
              messageId: outbound.id,
              text: "qa-echo: inside thread (edited)",
            },
          });
          const edited = state.readMessage({ messageId: outbound.id });
=======
          await performAction("edit", {
            messageId: outboundMessage.id,
            text: "qa-echo: inside thread (edited)",
          });
          const edited = await state.readMessage({ messageId: outboundMessage.id });
          if (!edited) {
            throw new Error("edited message not found");
          }
>>>>>>> upstream/main
          if (!edited.text.includes("(edited)")) {
            throw new Error("edit not recorded");
          }

<<<<<<< HEAD
          await qaChannelPlugin.actions?.handleAction?.({
            channel: "qa-channel",
            action: "delete",
            cfg,
            accountId: "default",
            params: {
              messageId: outbound.id,
            },
          });
          const deleted = state.readMessage({ messageId: outbound.id });
=======
          await performAction("delete", {
            messageId: outboundMessage.id,
          });
          const deleted = await state.readMessage({ messageId: outboundMessage.id });
          if (!deleted) {
            throw new Error("deleted message not found");
          }
>>>>>>> upstream/main
          if (!deleted.deleted) {
            throw new Error("delete not recorded");
          }
        },
      },
    ],
  };
}
