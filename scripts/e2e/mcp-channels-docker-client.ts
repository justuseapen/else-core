<<<<<<< HEAD
=======
// Mcp Channels Docker Client script supports OpenClaw repository automation.
>>>>>>> upstream/main
import { randomUUID } from "node:crypto";
import {
  assert,
  ClaudeChannelNotificationSchema,
  ClaudePermissionNotificationSchema,
  connectGateway,
  connectMcpClient,
  extractTextFromGatewayPayload,
  type ClaudeChannelNotification,
<<<<<<< HEAD
  maybeApprovePendingBridgePairing,
  waitFor,
} from "./mcp-channels-harness.ts";
=======
  type GatewayRpcClient,
  maybeApprovePendingBridgePairing,
  waitFor,
} from "./mcp-channels-harness.ts";
import {
  connectMcpClientWithPairingReconnect,
  createMcpClientTempState,
} from "./mcp-client-temp-state.ts";

function summarizeSessionRows(rows: Array<Record<string, unknown>> | undefined) {
  return (rows ?? []).map((entry) => ({
    key: entry.key,
    channel: entry.channel,
    deliveryContext: entry.deliveryContext,
    lastChannel: entry.lastChannel,
    lastTo: entry.lastTo,
    lastAccountId: entry.lastAccountId,
    lastThreadId: entry.lastThreadId,
  }));
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error === undefined || error === null) {
    return "";
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") {
    return `${error}`;
  }
  if (typeof error === "symbol") {
    return error.description ?? "symbol";
  }
  try {
    return JSON.stringify(error) ?? "";
  } catch {
    return Object.prototype.toString.call(error);
  }
}

async function waitForGatewaySeededConversation(gateway: GatewayRpcClient) {
  let lastList: { sessions?: Array<Record<string, unknown>> } | undefined;
  let lastError: unknown;
  try {
    return await waitFor(
      "seeded conversation in gateway sessions.list",
      async () => {
        try {
          lastList = await gateway.request<{ sessions?: Array<Record<string, unknown>> }>(
            "sessions.list",
            { limit: 50, includeDerivedTitles: false, includeLastMessage: false },
          );
          lastError = undefined;
        } catch (error) {
          lastError = error;
          return undefined;
        }
        return lastList.sessions?.find((entry) => entry.key === "agent:main:main");
      },
      180_000,
    );
  } catch (error) {
    throw new Error(
      `gateway sessions.list did not include seeded conversation: ${JSON.stringify(
        {
          count: lastList?.sessions?.length ?? 0,
          sessions: summarizeSessionRows(lastList?.sessions),
          lastError: formatUnknownError(lastError),
        },
        null,
        2,
      )}`,
      { cause: error },
    );
  }
}
>>>>>>> upstream/main

async function main() {
  const gatewayUrl = process.env.GW_URL?.trim();
  const gatewayToken = process.env.GW_TOKEN?.trim();
  assert(gatewayUrl, "missing GW_URL");
  assert(gatewayToken, "missing GW_TOKEN");

  const gateway = await connectGateway({ url: gatewayUrl, token: gatewayToken });
<<<<<<< HEAD
  let mcpHandle = await connectMcpClient({
    gatewayUrl,
    gatewayToken,
  });
  let mcp = mcpHandle.client;

  try {
    if (await maybeApprovePendingBridgePairing(gateway)) {
      await Promise.allSettled([mcp.close(), mcpHandle.transport.close()]);
      mcpHandle = await connectMcpClient({
        gatewayUrl,
        gatewayToken,
      });
      mcp = mcpHandle.client;
    }

    const listed = (await mcp.callTool({
      name: "conversations_list",
      arguments: {},
    })) as {
      structuredContent?: { conversations?: Array<Record<string, unknown>> };
    };
    const conversation = listed.structuredContent?.conversations?.find(
      (entry) => entry.sessionKey === "agent:main:main",
    );
    assert(conversation, "expected seeded conversation in conversations_list");
    assert(conversation.channel === "imessage", "expected seeded channel");
    assert(conversation.to === "+15551234567", "expected seeded target");

    const fetched = (await mcp.callTool({
      name: "conversation_get",
      arguments: { session_key: "agent:main:main" },
    })) as {
      structuredContent?: { conversation?: Record<string, unknown> };
      isError?: boolean;
    };
=======
  let mcpHandle: Awaited<ReturnType<typeof connectMcpClient>> | undefined;
  const mcpTempState = createMcpClientTempState({ gatewayToken });

  try {
    const gatewayConversation = await waitForGatewaySeededConversation(gateway);
    assert(
      (gatewayConversation.deliveryContext as { channel?: unknown } | undefined)?.channel ===
        "imessage",
      "expected seeded gateway deliveryContext channel",
    );
    assert(
      (gatewayConversation.deliveryContext as { to?: unknown } | undefined)?.to === "+15551234567",
      "expected seeded gateway deliveryContext target",
    );

    mcpHandle = await connectMcpClientWithPairingReconnect({
      tempState: mcpTempState,
      connect: (tempState) =>
        connectMcpClient({
          gatewayUrl,
          gatewayToken,
          tempState,
        }),
      maybeApprovePairing: () => maybeApprovePendingBridgePairing(gateway),
    });
    const mcp = mcpHandle.client;
    const callTool = <T>(params: Parameters<typeof mcp.callTool>[0]) =>
      mcp.callTool(params, undefined, { timeout: 240_000 }) as Promise<T>;

    let lastMcpConversationList: unknown;
    const conversation = await waitFor(
      "seeded conversation in conversations_list",
      async () => {
        const listed = await callTool<{
          structuredContent?: { conversations?: Array<Record<string, unknown>> };
        }>({
          name: "conversations_list",
          arguments: {
            includeDerivedTitles: false,
            includeLastMessage: false,
          },
        });
        lastMcpConversationList = listed;
        return listed.structuredContent?.conversations?.find(
          (entry) => entry.sessionKey === "agent:main:main",
        );
      },
      240_000,
    ).catch((error: unknown) => {
      throw new Error(
        `timeout waiting for seeded MCP conversation: ${JSON.stringify(
          lastMcpConversationList,
          null,
          2,
        )}`,
        { cause: error },
      );
    });
    assert(conversation.channel === "imessage", "expected seeded channel");
    assert(conversation.to === "+15551234567", "expected seeded target");

    const fetched = await callTool<{
      structuredContent?: { conversation?: Record<string, unknown> };
      isError?: boolean;
    }>({
      name: "conversation_get",
      arguments: { session_key: "agent:main:main" },
    });
>>>>>>> upstream/main
    assert(!fetched.isError, "conversation_get should succeed");
    assert(
      fetched.structuredContent?.conversation?.sessionKey === "agent:main:main",
      "conversation_get returned wrong session",
    );

<<<<<<< HEAD
    const history = (await mcp.callTool({
      name: "messages_read",
      arguments: { session_key: "agent:main:main", limit: 10 },
    })) as {
      structuredContent?: { messages?: Array<Record<string, unknown>> };
    };
    const messages = history.structuredContent?.messages ?? [];
    assert(messages.length >= 2, "expected seeded transcript messages");
    const attachmentMessage = messages.find((entry) => {
      const raw = entry.__openclaw;
      return raw && typeof raw === "object" && (raw as { id?: unknown }).id === "msg-attachment";
    });
    assert(attachmentMessage, "expected seeded attachment message");

    const attachments = (await mcp.callTool({
      name: "attachments_fetch",
      arguments: { session_key: "agent:main:main", message_id: "msg-attachment" },
    })) as {
      structuredContent?: { attachments?: Array<Record<string, unknown>> };
      isError?: boolean;
    };
=======
    let lastHistory: unknown;
    const messages = await waitFor(
      "seeded transcript messages",
      async () => {
        const history = await callTool<{
          structuredContent?: { messages?: Array<Record<string, unknown>> };
        }>({
          name: "messages_read",
          arguments: { session_key: "agent:main:main", limit: 10 },
        });
        lastHistory = history;
        const currentMessages = history.structuredContent?.messages ?? [];
        return currentMessages.length >= 2 ? currentMessages : undefined;
      },
      240_000,
    ).catch((error: unknown) => {
      throw new Error(
        `timeout waiting for seeded transcript messages: ${JSON.stringify(lastHistory, null, 2)}`,
        { cause: error },
      );
    });
    await waitFor(
      "seeded attachment message",
      () =>
        messages.find((entry) => {
          const raw = entry["__openclaw"];
          return (
            raw && typeof raw === "object" && (raw as { id?: unknown }).id === "msg-attachment"
          );
        }),
      240_000,
    );

    const attachments = await callTool<{
      structuredContent?: { attachments?: Array<Record<string, unknown>> };
      isError?: boolean;
    }>({
      name: "attachments_fetch",
      arguments: { session_key: "agent:main:main", message_id: "msg-attachment" },
    });
>>>>>>> upstream/main
    assert(!attachments.isError, "attachments_fetch should succeed");
    assert(
      (attachments.structuredContent?.attachments?.length ?? 0) === 1,
      "expected one seeded attachment",
    );

    const waited = (await Promise.all([
<<<<<<< HEAD
      mcp.callTool({
=======
      callTool<{
        structuredContent?: { event?: Record<string, unknown> };
      }>({
>>>>>>> upstream/main
        name: "events_wait",
        arguments: {
          session_key: "agent:main:main",
          after_cursor: 0,
          timeout_ms: 10_000,
        },
<<<<<<< HEAD
      }) as Promise<{
        structuredContent?: { event?: Record<string, unknown> };
      }>,
=======
      }),
>>>>>>> upstream/main
      gateway.request("chat.inject", {
        sessionKey: "agent:main:main",
        message: "assistant live event",
      }),
    ]).then(([result]) => result)) as {
      structuredContent?: { event?: Record<string, unknown> };
    };
    const assistantEvent = waited.structuredContent?.event;
    assert(assistantEvent, "expected events_wait result");
    assert(assistantEvent.type === "message", "expected message event");
    assert(assistantEvent.role === "assistant", "expected assistant event role");
    assert(assistantEvent.text === "assistant live event", "expected assistant event text");
    const assistantCursor = typeof assistantEvent.cursor === "number" ? assistantEvent.cursor : 0;

<<<<<<< HEAD
    const polled = (await mcp.callTool({
      name: "events_poll",
      arguments: { session_key: "agent:main:main", after_cursor: 0, limit: 10 },
    })) as {
      structuredContent?: { events?: Array<Record<string, unknown>> };
    };
=======
    const polled = await callTool<{
      structuredContent?: { events?: Array<Record<string, unknown>> };
    }>({
      name: "events_poll",
      arguments: { session_key: "agent:main:main", after_cursor: 0, limit: 10 },
    });
>>>>>>> upstream/main
    assert(
      (polled.structuredContent?.events ?? []).some(
        (entry) => entry.text === "assistant live event",
      ),
      "expected assistant event in events_poll",
    );

    const channelMessage = `hello from docker ${randomUUID()}`;
<<<<<<< HEAD
    const userEvent = (await Promise.all([
      mcp.callTool({
        name: "events_wait",
        arguments: {
          session_key: "agent:main:main",
          after_cursor: assistantCursor,
          timeout_ms: 10_000,
        },
      }) as Promise<{
        structuredContent?: { event?: Record<string, unknown> };
      }>,
      gateway.request("chat.send", {
        sessionKey: "agent:main:main",
        message: channelMessage,
        idempotencyKey: randomUUID(),
      }),
    ]).then(([result]) => result)) as {
      structuredContent?: { event?: Record<string, unknown> };
    };
    const rawGatewayUserMessage = await waitFor("raw gateway user session.message", () =>
      gateway.events.find(
        (entry) =>
          entry.event === "session.message" &&
          entry.payload.sessionKey === "agent:main:main" &&
          extractTextFromGatewayPayload(entry.payload) === channelMessage,
      ),
    );
    if (userEvent.structuredContent?.event?.text !== channelMessage) {
      throw new Error(
        `expected user event after chat.send: ${JSON.stringify(
          {
            userEvent: userEvent.structuredContent?.event ?? null,
            rawGatewayUserMessage: rawGatewayUserMessage ?? null,
=======
    await gateway.request("chat.send", {
      sessionKey: "agent:main:main",
      message: channelMessage,
      idempotencyKey: randomUUID(),
    });
    const rawGatewayUserMessage = await waitFor(
      "raw gateway user session.message",
      () =>
        gateway.events.find(
          (entry) =>
            entry.event === "session.message" &&
            entry.payload.sessionKey === "agent:main:main" &&
            extractTextFromGatewayPayload(entry.payload) === channelMessage,
        ),
      10_000,
    ).catch(() => undefined);
    const userEvent = await waitFor(
      "MCP user session.message event",
      async () => {
        const polledValue = await callTool<{
          structuredContent?: { events?: Array<Record<string, unknown>> };
        }>({
          name: "events_poll",
          arguments: { session_key: "agent:main:main", after_cursor: assistantCursor, limit: 50 },
        });
        return (polledValue.structuredContent?.events ?? []).find(
          (entry) => entry.text === channelMessage,
        );
      },
      60_000,
    ).catch(() => undefined);
    if (userEvent?.text !== channelMessage) {
      const polledLocal = await callTool<{
        structuredContent?: { events?: Array<Record<string, unknown>> };
      }>({
        name: "events_poll",
        arguments: { session_key: "agent:main:main", after_cursor: assistantCursor, limit: 50 },
      });
      throw new Error(
        `expected user event after chat.send: ${JSON.stringify(
          {
            userEvent: userEvent ?? null,
            rawGatewayUserMessage: rawGatewayUserMessage ?? null,
            mcpEventsAfterAssistant: polledLocal.structuredContent?.events ?? [],
>>>>>>> upstream/main
            recentGatewayEvents: gateway.events.slice(-10).map((entry) => ({
              event: entry.event,
              sessionKey: entry.payload.sessionKey,
              text: extractTextFromGatewayPayload(entry.payload),
            })),
          },
          null,
          2,
        )}`,
      );
    }
<<<<<<< HEAD
    assert(rawGatewayUserMessage, "expected raw gateway session.message after chat.send");
=======
>>>>>>> upstream/main

    let helpNotification: ClaudeChannelNotification;
    try {
      helpNotification = await waitFor(
        "Claude channel notification",
        () =>
          mcpHandle.rawMessages
            .map((entry) => ClaudeChannelNotificationSchema.safeParse(entry))
            .find(
              (entry) =>
                entry.success &&
                entry.data.params.meta.session_key === "agent:main:main" &&
                entry.data.params.content === channelMessage,
            )?.data.params,
      );
    } catch (error) {
      throw new Error(
        `timeout waiting for Claude channel notification: ${JSON.stringify(
          {
            rawMessages: mcpHandle.rawMessages.slice(-10),
          },
          null,
          2,
        )}`,
        { cause: error },
      );
    }
    assert(helpNotification.content === channelMessage, "expected Claude channel content");

    await mcp.notification({
      method: "notifications/claude/channel/permission_request",
      params: {
        request_id: "abcde",
        tool_name: "Bash",
        description: "run npm test",
        input_preview: '{"cmd":"npm test"}',
      },
    });

    await gateway.request("chat.send", {
      sessionKey: "agent:main:main",
      message: "yes abcde",
      idempotencyKey: randomUUID(),
    });
<<<<<<< HEAD
    const permission = await waitFor(
      "Claude permission notification",
      () =>
        mcpHandle.rawMessages
          .map((entry) => ClaudePermissionNotificationSchema.safeParse(entry))
          .find((entry) => entry.success && entry.data.params.request_id === "abcde")?.data.params,
    );
=======
    let permission: { request_id: string; behavior: "allow" | "deny" };
    try {
      permission = await waitFor(
        "Claude permission notification",
        () =>
          mcpHandle.rawMessages
            .map((entry) => ClaudePermissionNotificationSchema.safeParse(entry))
            .find((entry) => entry.success && entry.data.params.request_id === "abcde")?.data
            .params,
        60_000,
      );
    } catch (error) {
      throw new Error(
        `timeout waiting for Claude permission notification: ${JSON.stringify(
          {
            rawMessages: mcpHandle.rawMessages.slice(-10),
            recentGatewayEvents: gateway.events.slice(-10).map((entry) => ({
              event: entry.event,
              sessionKey: entry.payload.sessionKey,
              text: extractTextFromGatewayPayload(entry.payload),
            })),
          },
          null,
          2,
        )}`,
        { cause: error },
      );
    }
>>>>>>> upstream/main
    assert(permission.behavior === "allow", "expected allow permission reply");

    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          sessionKey: "agent:main:main",
          rawNotifications: mcpHandle.rawMessages.filter(
            (entry) =>
              ClaudeChannelNotificationSchema.safeParse(entry).success ||
              ClaudePermissionNotificationSchema.safeParse(entry).success,
          ).length,
        },
        null,
        2,
      ) + "\n",
    );
  } finally {
<<<<<<< HEAD
    await Promise.allSettled([mcp.close(), mcpHandle.transport.close(), gateway.close()]);
=======
    const closeTasks: Array<Promise<unknown>> = [gateway.close()];
    if (mcpHandle) {
      closeTasks.push(mcpHandle.client.close(), mcpHandle.transport.close());
    }
    await Promise.allSettled(closeTasks);
    mcpHandle?.cleanup();
    mcpTempState.cleanup();
>>>>>>> upstream/main
  }
}

await main();
