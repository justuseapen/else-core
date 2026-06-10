<<<<<<< HEAD
=======
// Channel MCP server tests cover channel tool registration and requests.
>>>>>>> upstream/main
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";
<<<<<<< HEAD
import { createOpenClawChannelMcpServer, OpenClawChannelBridge } from "./channel-server.js";
=======
import { shouldRetryInitialMcpGatewayConnect } from "./channel-bridge.js";
import { createOpenClawChannelMcpServer, OpenClawChannelBridge } from "./channel-server.js";
import { extractAttachmentsFromMessage } from "./channel-shared.js";
>>>>>>> upstream/main

const ClaudeChannelNotificationSchema = z.object({
  method: z.literal("notifications/claude/channel"),
  params: z.object({
    content: z.string(),
    meta: z.record(z.string(), z.string()),
  }),
});

const ClaudePermissionNotificationSchema = z.object({
  method: z.literal("notifications/claude/channel/permission"),
  params: z.object({
    request_id: z.string(),
    behavior: z.enum(["allow", "deny"]),
  }),
});

async function connectMcpWithoutGateway(params?: { claudeChannelMode?: "auto" | "on" | "off" }) {
  const serverHarness = await createOpenClawChannelMcpServer({
    claudeChannelMode: params?.claudeChannelMode ?? "auto",
<<<<<<< HEAD
=======
    config: {} as never,
>>>>>>> upstream/main
    verbose: false,
  });
  const client = new Client({ name: "mcp-test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await serverHarness.server.connect(serverTransport);
  await client.connect(clientTransport);
  return {
    client,
    bridge: serverHarness.bridge,
    close: async () => {
      await client.close();
      await serverHarness.close();
    },
  };
}

<<<<<<< HEAD
describe("openclaw channel mcp server", () => {
  describe("gateway-backed flows", () => {
    describe("gateway integration", () => {
=======
function attachReadyGateway(
  bridge: OpenClawChannelBridge,
  gatewayRequest: ReturnType<typeof vi.fn>,
) {
  (
    bridge as unknown as {
      gateway: { request: typeof gatewayRequest; stopAndWait: () => Promise<void> };
      readySettled: boolean;
      resolveReady: () => void;
    }
  ).gateway = {
    request: gatewayRequest,
    stopAndWait: async () => {},
  };
  (
    bridge as unknown as {
      readySettled: boolean;
      resolveReady: () => void;
    }
  ).readySettled = true;
  (
    bridge as unknown as {
      resolveReady: () => void;
    }
  ).resolveReady();
}

async function flushMcpNotifications() {
  await Promise.resolve();
  await Promise.resolve();
}

function requireFirstMockCall(mock: { mock: { calls: unknown[][] } }, label: string): unknown[] {
  const call = mock.mock.calls[0];
  if (!call) {
    throw new Error(`expected ${label} call`);
  }
  return call;
}

function gatewayRequestError(retryable: boolean): Error {
  return Object.assign(new Error(retryable ? "gateway busy" : "auth failed"), {
    name: "GatewayClientRequestError",
    retryable,
  });
}

describe("openclaw channel mcp server", () => {
  test("keeps initial MCP gateway connection alive through transient connect errors", () => {
    expect(
      shouldRetryInitialMcpGatewayConnect(new Error("gateway request timeout for connect")),
    ).toBe(true);
    expect(shouldRetryInitialMcpGatewayConnect(gatewayRequestError(true))).toBe(true);
    expect(shouldRetryInitialMcpGatewayConnect(gatewayRequestError(false))).toBe(false);
  });

  describe("gateway-backed flows", () => {
    describe("gateway integration", () => {
      test("returns conversation and message payloads in primary MCP content", async () => {
        const sessionKey = "agent:main:telegram:direct:123";
        const mcp = await connectMcpWithoutGateway({ claudeChannelMode: "off" });
        try {
          const gatewayRequest = vi.fn(async (method: string) => {
            if (method === "sessions.list") {
              return {
                sessions: [
                  {
                    key: sessionKey,
                    deliveryContext: { channel: "telegram", to: "123" },
                    lastMessagePreview: "hello",
                  },
                ],
              };
            }
            if (method === "sessions.get") {
              return {
                messages: [{ id: "msg-1", role: "assistant", content: "hello from transcript" }],
              };
            }
            throw new Error(`unexpected gateway method ${method}`);
          });
          attachReadyGateway(mcp.bridge, gatewayRequest);

          const conversations = (await mcp.client.callTool({
            name: "conversations_list",
            arguments: {},
          })) as { content?: Array<{ type: string; text?: string }> };
          expect(conversations.content?.[0]?.text).toContain(`"sessionKey": "${sessionKey}"`);
          expect(conversations.content?.[0]?.text).toContain(`"lastMessagePreview": "hello"`);

          const messages = (await mcp.client.callTool({
            name: "messages_read",
            arguments: { session_key: sessionKey },
          })) as { content?: Array<{ type: string; text?: string }> };
          expect(messages.content?.[0]?.text).toContain(`"id": "msg-1"`);
          expect(messages.content?.[0]?.text).toContain("hello from transcript");
        } finally {
          await mcp.close();
        }
      });

>>>>>>> upstream/main
      test("lists conversations and reads messages", async () => {
        const sessionKey = "agent:main:main";
        const gatewayRequest = vi.fn(async (method: string) => {
          if (method === "sessions.list") {
            return {
              sessions: [
                {
                  key: sessionKey,
                  channel: "telegram",
                  deliveryContext: {
                    to: "-100123",
                    accountId: "acct-1",
                    threadId: 42,
                  },
                },
              ],
            };
          }
<<<<<<< HEAD
          if (method === "chat.history") {
=======
          if (method === "sessions.get") {
>>>>>>> upstream/main
            return {
              messages: [
                {
                  role: "assistant",
                  content: [{ type: "text", text: "hello from transcript" }],
                },
                {
                  __openclaw: {
                    id: "msg-attachment",
                  },
                  role: "assistant",
                  content: [
                    { type: "text", text: "attached image" },
                    {
                      type: "image",
                      source: {
                        type: "base64",
                        media_type: "image/png",
                        data: "abc",
                      },
                    },
                  ],
                },
              ],
            };
          }
          throw new Error(`unexpected gateway method ${method}`);
        });
<<<<<<< HEAD
        let mcp: Awaited<ReturnType<typeof connectMcpWithoutGateway>> | null = null;
        try {
          mcp = await connectMcpWithoutGateway({
            claudeChannelMode: "off",
          });
          const connectedMcp = mcp;
          (
            connectedMcp.bridge as unknown as {
              gateway: { request: typeof gatewayRequest; stopAndWait: () => Promise<void> };
              readySettled: boolean;
              resolveReady: () => void;
            }
          ).gateway = {
            request: gatewayRequest,
            stopAndWait: async () => {},
          };
          (
            connectedMcp.bridge as unknown as {
              readySettled: boolean;
              resolveReady: () => void;
            }
          ).readySettled = true;
          (
            connectedMcp.bridge as unknown as {
              resolveReady: () => void;
            }
          ).resolveReady();

          const listed = (await connectedMcp.client.callTool({
            name: "conversations_list",
            arguments: {},
          })) as {
            structuredContent?: { conversations?: Array<Record<string, unknown>> };
          };
          expect(listed.structuredContent?.conversations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sessionKey,
                channel: "telegram",
                to: "-100123",
                accountId: "acct-1",
                threadId: 42,
              }),
            ]),
          );

          const read = (await connectedMcp.client.callTool({
            name: "messages_read",
            arguments: { session_key: sessionKey, limit: 5 },
          })) as {
            structuredContent?: { messages?: Array<Record<string, unknown>> };
          };
          expect(read.structuredContent?.messages?.[0]).toMatchObject({
            role: "assistant",
            content: [{ type: "text", text: "hello from transcript" }],
          });
          expect(read.structuredContent?.messages?.[1]).toMatchObject({
            __openclaw: {
              id: "msg-attachment",
            },
          });

          const attachments = (await connectedMcp.client.callTool({
            name: "attachments_fetch",
            arguments: { session_key: sessionKey, message_id: "msg-attachment" },
          })) as {
            structuredContent?: { attachments?: Array<Record<string, unknown>> };
            isError?: boolean;
          };
          expect(attachments.isError).not.toBe(true);
          expect(attachments.structuredContent?.attachments).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: "image",
              }),
            ]),
          );
        } finally {
          await mcp?.close();
=======
        const bridge = new OpenClawChannelBridge({} as never, {
          claudeChannelMode: "off",
          verbose: false,
        });
        attachReadyGateway(bridge, gatewayRequest);

        const conversations = await bridge.listConversations();
        expect(conversations).toHaveLength(1);
        expect(conversations[0]?.sessionKey).toBe(sessionKey);
        expect(conversations[0]?.channel).toBe("telegram");
        expect(conversations[0]?.to).toBe("-100123");
        expect(conversations[0]?.accountId).toBe("acct-1");
        expect(conversations[0]?.threadId).toBe(42);

        const messages = await bridge.readMessages(sessionKey, 5);
        expect(messages[0]?.role).toBe("assistant");
        expect(messages[0]?.content).toEqual([{ type: "text", text: "hello from transcript" }]);
        expect((messages[1]?.["__openclaw"] as { id?: string } | undefined)?.id).toBe(
          "msg-attachment",
        );
        expect(
          extractAttachmentsFromMessage(messages[1]).some(
            (entry) => (entry as { type?: unknown }).type === "image",
          ),
        ).toBe(true);
      });

      test("serializes conversation and message payloads into MCP primary content", async () => {
        const mcp = await connectMcpWithoutGateway({ claudeChannelMode: "off" });
        try {
          const gatewayRequest = vi.fn(async (method: string) => {
            if (method === "sessions.list") {
              return {
                sessions: [
                  {
                    key: "agent:main:telegram:direct:123",
                    channel: "telegram",
                    deliveryContext: { to: "123" },
                    lastMessagePreview: "hello",
                  },
                ],
              };
            }
            if (method === "sessions.get") {
              return {
                messages: [
                  {
                    id: "msg-1",
                    role: "assistant",
                    content: [{ type: "text", text: "full transcript text" }],
                  },
                ],
              };
            }
            throw new Error(`unexpected gateway method ${method}`);
          });
          attachReadyGateway(mcp.bridge, gatewayRequest);

          const conversations = (await mcp.client.callTool({
            name: "conversations_list",
            arguments: {},
          })) as { content?: Array<{ type: string; text?: string }> };
          expect(conversations.content?.[0]?.text).toContain('"sessionKey"');
          expect(conversations.content?.[0]?.text).toContain('"lastMessagePreview": "hello"');

          const messages = (await mcp.client.callTool({
            name: "messages_read",
            arguments: { session_key: "agent:main:telegram:direct:123" },
          })) as { content?: Array<{ type: string; text?: string }> };
          expect(messages.content?.[0]?.text).toContain('"id": "msg-1"');
          expect(messages.content?.[0]?.text).toContain("full transcript text");
        } finally {
          await mcp.close();
>>>>>>> upstream/main
        }
      });

      test("emits Claude channel and permission notifications", async () => {
        const sessionKey = "agent:main:main";
<<<<<<< HEAD
        let mcp: Awaited<ReturnType<typeof connectMcpWithoutGateway>> | null = null;
=======
        let mcp: Awaited<ReturnType<typeof connectMcpWithoutGateway>> | null | undefined;
>>>>>>> upstream/main
        try {
          const channelNotifications: Array<{ content: string; meta: Record<string, string> }> = [];
          const permissionNotifications: Array<{
            request_id: string;
            behavior: "allow" | "deny";
          }> = [];

          mcp = await connectMcpWithoutGateway({
            claudeChannelMode: "on",
          });
          mcp.client.setNotificationHandler(ClaudeChannelNotificationSchema, ({ params }) => {
            channelNotifications.push(params);
          });
          mcp.client.setNotificationHandler(ClaudePermissionNotificationSchema, ({ params }) => {
            permissionNotifications.push(params);
          });

          await (
            mcp.bridge as unknown as {
              handleSessionMessageEvent: (payload: Record<string, unknown>) => Promise<void>;
            }
          ).handleSessionMessageEvent({
            sessionKey,
            lastChannel: "imessage",
            lastTo: "+15551234567",
            messageId: "msg-user-1",
            message: {
              role: "user",
              content: [{ type: "text", text: "hello Claude" }],
              timestamp: Date.now(),
            },
          });

<<<<<<< HEAD
          await vi.waitFor(() => {
            expect(channelNotifications).toHaveLength(1);
          });
          expect(channelNotifications[0]).toMatchObject({
            content: "hello Claude",
            meta: expect.objectContaining({
              session_key: sessionKey,
              channel: "imessage",
              to: "+15551234567",
              message_id: "msg-user-1",
            }),
          });
=======
          await flushMcpNotifications();
          expect(channelNotifications).toHaveLength(1);
          expect(channelNotifications[0]?.content).toBe("hello Claude");
          expect(channelNotifications[0]?.meta.session_key).toBe(sessionKey);
          expect(channelNotifications[0]?.meta.channel).toBe("imessage");
          expect(channelNotifications[0]?.meta.to).toBe("+15551234567");
          expect(channelNotifications[0]?.meta.message_id).toBe("msg-user-1");
>>>>>>> upstream/main

          await mcp.client.notification({
            method: "notifications/claude/channel/permission_request",
            params: {
              request_id: "abcde",
              tool_name: "Bash",
              description: "run npm test",
              input_preview: '{"cmd":"npm test"}',
            },
          });

          await (
            mcp.bridge as unknown as {
              handleSessionMessageEvent: (payload: Record<string, unknown>) => Promise<void>;
            }
          ).handleSessionMessageEvent({
            sessionKey,
            lastChannel: "imessage",
            lastTo: "+15551234567",
            messageId: "msg-user-2",
            message: {
              role: "user",
              content: [{ type: "text", text: "yes abcde" }],
              timestamp: Date.now(),
            },
          });

<<<<<<< HEAD
          await vi.waitFor(() => {
            expect(permissionNotifications).toHaveLength(1);
          });
=======
          await flushMcpNotifications();
          expect(permissionNotifications).toHaveLength(1);
>>>>>>> upstream/main
          expect(permissionNotifications[0]).toEqual({
            request_id: "abcde",
            behavior: "allow",
          });

          await (
            mcp.bridge as unknown as {
              handleSessionMessageEvent: (payload: Record<string, unknown>) => Promise<void>;
            }
          ).handleSessionMessageEvent({
            sessionKey,
            lastChannel: "imessage",
            lastTo: "+15551234567",
            messageId: "msg-user-3",
            message: {
              role: "user",
              content: "plain string user turn",
              timestamp: Date.now(),
            },
          });

<<<<<<< HEAD
          await vi.waitFor(() => {
            expect(channelNotifications).toHaveLength(2);
          });
          expect(channelNotifications[1]).toMatchObject({
            content: "plain string user turn",
            meta: expect.objectContaining({
              session_key: sessionKey,
              message_id: "msg-user-3",
            }),
          });
=======
          await flushMcpNotifications();
          expect(channelNotifications).toHaveLength(2);
          expect(channelNotifications[1]?.content).toBe("plain string user turn");
          expect(channelNotifications[1]?.meta.session_key).toBe(sessionKey);
          expect(channelNotifications[1]?.meta.message_id).toBe("msg-user-3");
>>>>>>> upstream/main
        } finally {
          await mcp?.close();
        }
      });
    });

    test("sendMessage normalizes route metadata for gateway send", async () => {
      const bridge = new OpenClawChannelBridge({} as never, {
        claudeChannelMode: "off",
        verbose: false,
      });
      const gatewayRequest = vi.fn().mockResolvedValue({ ok: true, channel: "telegram" });

<<<<<<< HEAD
      (
        bridge as unknown as {
          gateway: { request: typeof gatewayRequest; stopAndWait: () => Promise<void> };
          readySettled: boolean;
          resolveReady: () => void;
        }
      ).gateway = {
        request: gatewayRequest,
        stopAndWait: async () => {},
      };
      (
        bridge as unknown as {
          readySettled: boolean;
          resolveReady: () => void;
        }
      ).readySettled = true;
      (
        bridge as unknown as {
          resolveReady: () => void;
        }
      ).resolveReady();
=======
      attachReadyGateway(bridge, gatewayRequest);
>>>>>>> upstream/main

      vi.spyOn(bridge, "getConversation").mockResolvedValue({
        sessionKey: "agent:main:main",
        channel: "telegram",
        to: "-100123",
        accountId: "acct-1",
        threadId: 42,
      });

      await bridge.sendMessage({
        sessionKey: "agent:main:main",
        text: "reply from mcp",
      });

<<<<<<< HEAD
      expect(gatewayRequest).toHaveBeenCalledWith(
        "send",
        expect.objectContaining({
          to: "-100123",
          channel: "telegram",
          accountId: "acct-1",
          threadId: "42",
          sessionKey: "agent:main:main",
          message: "reply from mcp",
        }),
      );
    });

    test("lists routed sessions that only expose modern channel fields", async () => {
=======
      expect(gatewayRequest).toHaveBeenCalledTimes(1);
      const [method, payload] = requireFirstMockCall(gatewayRequest, "gateway request");
      expect(method).toBe("send");
      const sendPayload = payload as Record<string, unknown>;
      expect(sendPayload.to).toBe("-100123");
      expect(sendPayload.channel).toBe("telegram");
      expect(sendPayload.accountId).toBe("acct-1");
      expect(sendPayload.threadId).toBe("42");
      expect(sendPayload.sessionKey).toBe("agent:main:main");
      expect(sendPayload.message).toBe("reply from mcp");
    });

    test("gets one conversation through sessions.describe without broad listing", async () => {
      const bridge = new OpenClawChannelBridge({} as never, {
        claudeChannelMode: "off",
        verbose: false,
      });
      const gatewayRequest = vi.fn(async (method: string) => {
        if (method === "sessions.describe") {
          return {
            session: {
              key: "agent:main:main",
              deliveryContext: {
                channel: "telegram",
                to: "-100123",
                accountId: "acct-1",
              },
              lastMessagePreview: "latest message",
            },
          };
        }
        throw new Error(`unexpected gateway method ${method}`);
      });

      attachReadyGateway(bridge, gatewayRequest);

      const conversation = await bridge.getConversation("agent:main:main");
      expect(conversation?.sessionKey).toBe("agent:main:main");
      expect(conversation?.channel).toBe("telegram");
      expect(conversation?.to).toBe("-100123");
      expect(conversation?.accountId).toBe("acct-1");
      expect(conversation?.lastMessagePreview).toBe("latest message");
      expect(gatewayRequest).toHaveBeenCalledWith("sessions.describe", {
        key: "agent:main:main",
        includeDerivedTitles: true,
        includeLastMessage: true,
      });
    });

    test("lists routed sessions from deliveryContext without mirrored route fields", async () => {
>>>>>>> upstream/main
      const bridge = new OpenClawChannelBridge({} as never, {
        claudeChannelMode: "off",
        verbose: false,
      });
      const gatewayRequest = vi.fn().mockResolvedValue({
        sessions: [
          {
            key: "agent:main:channel-field",
<<<<<<< HEAD
            channel: "telegram",
            deliveryContext: {
=======
            deliveryContext: {
              channel: "telegram",
>>>>>>> upstream/main
              to: "-100111",
            },
          },
          {
            key: "agent:main:origin-field",
<<<<<<< HEAD
            origin: {
              provider: "imessage",
              accountId: "imessage-default",
              threadId: "thread-7",
            },
            deliveryContext: {
              to: "+15551230000",
            },
=======
            deliveryContext: {
              channel: "imessage",
              to: "+15551230000",
              accountId: "imessage-default",
              threadId: "thread-7",
            },
>>>>>>> upstream/main
          },
        ],
      });

<<<<<<< HEAD
      (
        bridge as unknown as {
          gateway: { request: typeof gatewayRequest; stopAndWait: () => Promise<void> };
          readySettled: boolean;
          resolveReady: () => void;
        }
      ).gateway = {
        request: gatewayRequest,
        stopAndWait: async () => {},
      };
      (
        bridge as unknown as {
          readySettled: boolean;
          resolveReady: () => void;
        }
      ).readySettled = true;
      (
        bridge as unknown as {
          resolveReady: () => void;
        }
      ).resolveReady();

      await expect(bridge.listConversations()).resolves.toEqual([
        expect.objectContaining({
          sessionKey: "agent:main:channel-field",
          channel: "telegram",
          to: "-100111",
        }),
        expect.objectContaining({
          sessionKey: "agent:main:origin-field",
          channel: "imessage",
          to: "+15551230000",
          accountId: "imessage-default",
          threadId: "thread-7",
        }),
      ]);
=======
      attachReadyGateway(bridge, gatewayRequest);

      const conversations = await bridge.listConversations();
      expect(conversations).toHaveLength(2);
      expect(conversations[0]?.sessionKey).toBe("agent:main:channel-field");
      expect(conversations[0]?.channel).toBe("telegram");
      expect(conversations[0]?.to).toBe("-100111");
      expect(conversations[1]?.sessionKey).toBe("agent:main:origin-field");
      expect(conversations[1]?.channel).toBe("imessage");
      expect(conversations[1]?.to).toBe("+15551230000");
      expect(conversations[1]?.accountId).toBe("imessage-default");
      expect(conversations[1]?.threadId).toBe("thread-7");
>>>>>>> upstream/main
    });

    test("swallows notification send errors after channel replies are matched", async () => {
      const bridge = new OpenClawChannelBridge({} as never, {
        claudeChannelMode: "on",
        verbose: false,
      });

      (
        bridge as unknown as {
<<<<<<< HEAD
          pendingClaudePermissions: Map<string, Record<string, unknown>>;
          server: { server: { notification: ReturnType<typeof vi.fn> } };
        }
      ).pendingClaudePermissions.set("abcde", {
        toolName: "Bash",
        description: "run npm test",
        inputPreview: '{"cmd":"npm test"}',
      });
=======
          pendingClaudePermissions: Map<string, number>;
          server: { server: { notification: ReturnType<typeof vi.fn> } };
        }
      ).pendingClaudePermissions.set("abcde", Date.now());
>>>>>>> upstream/main
      (
        bridge as unknown as {
          server: { server: { notification: ReturnType<typeof vi.fn> } };
        }
      ).server = {
        server: {
          notification: vi.fn().mockRejectedValue(new Error("Not connected")),
        },
      };

      await expect(
        (
          bridge as unknown as {
            handleSessionMessageEvent: (payload: Record<string, unknown>) => Promise<void>;
          }
        ).handleSessionMessageEvent({
          sessionKey: "agent:main:main",
          message: {
            role: "user",
            content: [{ type: "text", text: "yes abcde" }],
          },
        }),
      ).resolves.toBeUndefined();
    });

    test("waits for queued events through the MCP tool", async () => {
      const mcp = await connectMcpWithoutGateway({ claudeChannelMode: "off" });
      try {
        await (
          mcp.bridge as unknown as {
            handleSessionMessageEvent: (payload: Record<string, unknown>) => Promise<void>;
          }
        ).handleSessionMessageEvent({
          sessionKey: "agent:main:main",
          lastChannel: "telegram",
          lastTo: "-100123",
          lastAccountId: "acct-1",
          lastThreadId: 42,
          messageId: "msg-2",
          messageSeq: 1,
          message: {
            role: "user",
            content: [{ type: "text", text: "inbound live message" }],
          },
        });

        const waited = (await mcp.client.callTool({
          name: "events_wait",
          arguments: { session_key: "agent:main:main", after_cursor: 0, timeout_ms: 250 },
        })) as {
          structuredContent?: { event?: Record<string, unknown> };
        };
<<<<<<< HEAD
        expect(waited.structuredContent?.event).toMatchObject({
          type: "message",
          sessionKey: "agent:main:main",
          messageId: "msg-2",
          role: "user",
          text: "inbound live message",
        });
=======
        expect(waited.structuredContent?.event?.type).toBe("message");
        expect(waited.structuredContent?.event?.sessionKey).toBe("agent:main:main");
        expect(waited.structuredContent?.event?.messageId).toBe("msg-2");
        expect(waited.structuredContent?.event?.role).toBe("user");
        expect(waited.structuredContent?.event?.text).toBe("inbound live message");
>>>>>>> upstream/main
      } finally {
        await mcp.close();
      }
    });
  });
});
