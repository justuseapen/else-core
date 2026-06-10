<<<<<<< HEAD
import { resetInboundDedupe } from "openclaw/plugin-sdk/reply-runtime";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  flush,
  getSlackClient,
  getSlackHandlerOrThrow,
  getSlackTestState,
  resetSlackTestState,
  startSlackMonitor,
  stopSlackMonitor,
} from "./monitor.test-helpers.js";
=======
// Slack tests cover monitor.threading.missing thread ts plugin behavior.
import { describe, expect, it, vi } from "vitest";
import { createSlackThreadTsResolver } from "./monitor/thread-resolution.js";
import type { SlackMessageEvent } from "./types.js";
>>>>>>> upstream/main

function makeThreadReplyMessage(): SlackMessageEvent {
  return {
    type: "message",
    user: "U1",
    text: "hello",
    ts: "456",
    parent_user_id: "U2",
    channel: "C1",
    channel_type: "channel",
  };
}

async function runMissingThreadScenario(params: {
  historyResponse?: { messages: Array<{ ts?: string; thread_ts?: string }> };
  historyError?: Error;
}) {
  const history = vi.fn();
  if (params.historyError) {
    history.mockRejectedValueOnce(params.historyError);
  } else {
    history.mockResolvedValueOnce(params.historyResponse ?? { messages: [{ ts: "456" }] });
  }

  const resolver = createSlackThreadTsResolver({
    client: { conversations: { history } } as never,
    cacheTtlMs: 60_000,
    maxSize: 5,
  });

  return await resolver.resolve({
    message: makeThreadReplyMessage(),
    source: "message",
  });
}

describe("Slack missing thread_ts recovery", () => {
  it("recovers missing thread_ts when parent_user_id is present", async () => {
    const message = await runMissingThreadScenario({
      historyResponse: { messages: [{ ts: "456", thread_ts: "111.222" }] },
    });
    expect(message).toEqual({
      type: "message",
      user: "U1",
      text: "hello",
      ts: "456",
      parent_user_id: "U2",
      channel: "C1",
      channel_type: "channel",
<<<<<<< HEAD
    },
  };
}

function getConversationsClient(): SlackConversationsClient {
  const client = getSlackClient();
  if (!client) {
    throw new Error("Slack client not registered");
  }
  return client.conversations as SlackConversationsClient;
}

async function runMissingThreadScenario(params: {
  historyResponse?: { messages: Array<{ ts?: string; thread_ts?: string }> };
  historyError?: Error;
}) {
  slackTestState.replyMock.mockResolvedValue({ text: "thread reply" });

  const conversations = getConversationsClient();
  if (params.historyError) {
    conversations.history.mockRejectedValueOnce(params.historyError);
  } else {
    conversations.history.mockResolvedValueOnce(
      params.historyResponse ?? { messages: [{ ts: "456" }] },
    );
  }

  const { controller, run } = startSlackMonitor(monitorSlackProvider);
  const handler = await getSlackHandlerOrThrow("message");
  await handler(makeThreadReplyEvent());

  await flush();
  await stopSlackMonitor({ controller, run });

  expect(slackTestState.sendMock).toHaveBeenCalledTimes(1);
  return slackTestState.sendMock.mock.calls[0]?.[2];
}

beforeEach(() => {
  resetInboundDedupe();
});

beforeAll(async () => {
  ({ monitorSlackProvider } = await import("./monitor.js"));
});

beforeEach(() => {
  resetInboundDedupe();
  resetSlackTestState({
    messages: { responsePrefix: "PFX" },
    channels: {
      slack: {
        dm: { enabled: true, policy: "open", allowFrom: ["*"] },
        groupPolicy: "open",
        channels: { C1: { allow: true, requireMention: false } },
      },
    },
  });
  const conversations = getConversationsClient();
  conversations.info.mockResolvedValue({
    channel: { name: "general", is_channel: true },
  });
});

describe("monitorSlackProvider threading", () => {
  it("recovers missing thread_ts when parent_user_id is present", async () => {
    const options = await runMissingThreadScenario({
      historyResponse: { messages: [{ ts: "456", thread_ts: "111.222" }] },
=======
      thread_ts: "111.222",
>>>>>>> upstream/main
    });
  });

  it("continues without thread_ts when history lookup returns no thread result", async () => {
    const message = await runMissingThreadScenario({
      historyResponse: { messages: [{ ts: "456" }] },
    });
    expect(message.thread_ts).toBeUndefined();
    expect(message["_ambiguousThreadReply"]).toBe(true);
  });

  it("continues without thread_ts when history lookup throws", async () => {
    const message = await runMissingThreadScenario({
      historyError: new Error("history failed"),
    });
    expect(message.thread_ts).toBeUndefined();
    expect(message["_ambiguousThreadReply"]).toBe(true);
  });
});
