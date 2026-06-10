<<<<<<< HEAD
import fs from "node:fs";
import type { ButtonInteraction, ComponentData } from "@buape/carbon";
import { Routes } from "discord-api-types/v10";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSessionStoreCacheForTest } from "../../../../src/config/sessions.js";
import type { DiscordExecApprovalConfig } from "../../../../src/config/types.discord.js";

const { STORE_PATH, mockSessionStoreEntries } = vi.hoisted(() => ({
  STORE_PATH: "/tmp/openclaw-exec-approvals-test.json",
  mockSessionStoreEntries: {
    value: {} as Record<string, unknown>,
  },
}));

const writeStore = (store: Record<string, unknown>) => {
  mockSessionStoreEntries.value = JSON.parse(JSON.stringify(store)) as Record<string, unknown>;
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  clearSessionStoreCacheForTest();
};

beforeEach(() => {
  writeStore({});
  mockGatewayClientCtor.mockClear();
  mockResolveGatewayConnectionAuth.mockReset().mockImplementation(
    async (params: {
      config?: {
        gateway?: {
          auth?: {
            token?: string;
            password?: string;
          };
        };
      };
      env: NodeJS.ProcessEnv;
    }) => {
      const configToken = params.config?.gateway?.auth?.token;
      const configPassword = params.config?.gateway?.auth?.password;
      const envToken = params.env.OPENCLAW_GATEWAY_TOKEN;
      const envPassword = params.env.OPENCLAW_GATEWAY_PASSWORD;
      return { token: envToken ?? configToken, password: envPassword ?? configPassword };
    },
  );
});

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRestPost = vi.hoisted(() => vi.fn());
const mockRestPatch = vi.hoisted(() => vi.fn());
const mockRestDelete = vi.hoisted(() => vi.fn());
const gatewayClientStarts = vi.hoisted(() => vi.fn());
const gatewayClientStops = vi.hoisted(() => vi.fn());
const gatewayClientRequests = vi.hoisted(() =>
  vi.fn(async (..._args: unknown[]) => ({ ok: true })),
);
const gatewayClientParams = vi.hoisted(() => [] as Array<Record<string, unknown>>);
const mockGatewayClientCtor = vi.hoisted(() => vi.fn());
const mockResolveGatewayConnectionAuth = vi.hoisted(() => vi.fn());
const mockCreateOperatorApprovalsGatewayClient = vi.hoisted(() => vi.fn());

vi.mock("../send.shared.js", async () => {
  const actual = await vi.importActual<typeof import("../send.shared.js")>("../send.shared.js");
=======
// Discord tests cover exec approvals plugin behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ButtonInteraction, ComponentData } from "../internal/discord.js";

const resolveApprovalOverGatewayMock = vi.hoisted(() => vi.fn());

vi.mock("openclaw/plugin-sdk/approval-gateway-runtime", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("openclaw/plugin-sdk/approval-gateway-runtime")>();
>>>>>>> upstream/main
  return {
    ...actual,
    resolveApprovalOverGateway: resolveApprovalOverGatewayMock,
  };
});

import {
  ExecApprovalButton,
  buildExecApprovalCustomId,
  createDiscordExecApprovalButtonContext,
  extractDiscordChannelId,
  parseExecApprovalData,
} from "./exec-approvals.js";

function buildConfig(
  execApprovals?: NonNullable<NonNullable<OpenClawConfig["channels"]>["discord"]>["execApprovals"],
): OpenClawConfig {
  return {
    channels: {
      discord: {
        token: "discord-token",
        execApprovals,
      },
<<<<<<< HEAD
      request: (_fn: () => Promise<unknown>, _label: string) => _fn(),
    }),
  };
});

vi.mock("openclaw/plugin-sdk/config-runtime", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/config-runtime")>(
    "openclaw/plugin-sdk/config-runtime",
  );
  return {
    ...actual,
    loadSessionStore: () => mockSessionStoreEntries.value,
    resolveStorePath: () => STORE_PATH,
  };
});
=======
    },
  } as OpenClawConfig;
}
>>>>>>> upstream/main

function createInteraction(overrides?: Partial<ButtonInteraction>): ButtonInteraction {
  return {
    userId: "123",
    reply: vi.fn(),
    acknowledge: vi.fn(),
    followUp: vi.fn(),
    ...overrides,
  } as unknown as ButtonInteraction;
}

describe("discord exec approval monitor helpers", () => {
  beforeEach(() => {
    resolveApprovalOverGatewayMock.mockReset();
  });

  it("encodes approval ids into custom ids", () => {
    expect(buildExecApprovalCustomId("abc-123", "allow-once")).toBe(
      "execapproval:id=abc-123;action=allow-once",
    );
    expect(buildExecApprovalCustomId("abc=123;test", "deny")).toBe(
      "execapproval:id=abc%3D123%3Btest;action=deny",
    );
  });

  it("parses valid button data and rejects invalid payloads", () => {
    expect(parseExecApprovalData({ id: "abc-123", action: "allow-once" })).toEqual({
      approvalId: "abc-123",
      action: "allow-once",
    });
<<<<<<< HEAD
    const clientParams = {
      url: gatewayUrl,
      token: auth?.token,
      password: auth?.password,
      clientName: "gateway-client",
      clientDisplayName: params.clientDisplayName,
      mode: "backend",
      scopes: ["operator.approvals"],
      onEvent: params.onEvent,
      onHelloOk: params.onHelloOk,
      onConnectError: params.onConnectError,
      onClose: params.onClose,
    };
    gatewayClientParams.push(clientParams);
    mockGatewayClientCtor(clientParams);
    return {
      start: gatewayClientStarts,
      stop: gatewayClientStops,
      request: gatewayClientRequests,
    };
  },
}));

vi.mock("../../../../src/gateway/client.js", () => ({
  GatewayClient: class {
    params: Record<string, unknown>;
    constructor(params: Record<string, unknown>) {
      this.params = params;
      gatewayClientParams.push(params);
      mockGatewayClientCtor(params);
    }
    start() {
      gatewayClientStarts();
    }
    stop() {
      gatewayClientStops();
    }
    async request(...args: unknown[]) {
      return gatewayClientRequests(...args);
    }
  },
}));

vi.mock("openclaw/plugin-sdk/text-runtime", async () => {
  const actual = await vi.importActual<typeof import("openclaw/plugin-sdk/text-runtime")>(
    "openclaw/plugin-sdk/text-runtime",
  );
  return {
    ...actual,
    logDebug: vi.fn(),
    logError: vi.fn(),
  };
});

vi.mock("../../../../src/logger.js", () => ({
  logDebug: vi.fn(),
  logError: vi.fn(),
}));

let buildExecApprovalCustomId: typeof import("./exec-approvals.js").buildExecApprovalCustomId;
let extractDiscordChannelId: typeof import("./exec-approvals.js").extractDiscordChannelId;
let parseExecApprovalData: typeof import("./exec-approvals.js").parseExecApprovalData;
let DiscordExecApprovalHandler: typeof import("./exec-approvals.js").DiscordExecApprovalHandler;
let ExecApprovalButton: typeof import("./exec-approvals.js").ExecApprovalButton;
type DiscordExecApprovalHandlerInstance = InstanceType<
  typeof import("./exec-approvals.js").DiscordExecApprovalHandler
>;

type ExecApprovalRequest = import("./exec-approvals.js").ExecApprovalRequest;
type PluginApprovalRequest = import("./exec-approvals.js").PluginApprovalRequest;
type ExecApprovalButtonContext = import("./exec-approvals.js").ExecApprovalButtonContext;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createHandler(
  config: DiscordExecApprovalConfig,
  accountId = "default",
  cfgOverrides: Record<string, unknown> = {},
) {
  return new DiscordExecApprovalHandler({
    token: "test-token",
    accountId,
    config,
    cfg: { session: { store: STORE_PATH }, ...cfgOverrides },
  });
}

function mockSuccessfulDmDelivery(params?: {
  noteChannelId?: string;
  expectedNoteText?: string;
  throwOnUnexpectedRoute?: boolean;
}) {
  mockRestPost.mockImplementation(
    async (route: string, requestParams?: { body?: { content?: string } }) => {
      if (params?.noteChannelId && route === Routes.channelMessages(params.noteChannelId)) {
        if (params.expectedNoteText) {
          expect(requestParams?.body?.content).toContain(params.expectedNoteText);
        }
        return { id: "note-1", channel_id: params.noteChannelId };
      }
      if (route === Routes.userChannels()) {
        return { id: "dm-1" };
      }
      if (route === Routes.channelMessages("dm-1")) {
        return { id: "msg-1", channel_id: "dm-1" };
      }
      if (params?.throwOnUnexpectedRoute) {
        throw new Error(`unexpected route: ${route}`);
      }
      return { id: "msg-unknown" };
    },
  );
}

async function expectGatewayAuthStart(params: {
  handler: DiscordExecApprovalHandlerInstance;
  expectedUrl: string;
  expectedSource: "cli" | "env";
  expectedToken?: string;
  expectedPassword?: string;
}) {
  await params.handler.start();

  expect(mockResolveGatewayConnectionAuth).toHaveBeenCalledWith(
    expect.objectContaining({
      env: process.env,
      urlOverride: params.expectedUrl,
      urlOverrideSource: params.expectedSource,
    }),
  );

  const expectedClientParams: Record<string, unknown> = {
    url: params.expectedUrl,
  };
  if (params.expectedToken !== undefined) {
    expectedClientParams.token = params.expectedToken;
  }
  if (params.expectedPassword !== undefined) {
    expectedClientParams.password = params.expectedPassword;
  }
  expect(mockGatewayClientCtor).toHaveBeenCalledWith(expect.objectContaining(expectedClientParams));
}

function createRequest(
  overrides: Partial<ExecApprovalRequest["request"]> = {},
): ExecApprovalRequest {
  return {
    id: "test-id",
    request: {
      command: "echo hello",
      cwd: "/home/user",
      host: "gateway",
      agentId: "test-agent",
      sessionKey: "agent:test-agent:discord:channel:999888777",
      ...overrides,
    },
    createdAtMs: Date.now(),
    expiresAtMs: Date.now() + 60000,
  };
}

function createPluginRequest(
  overrides: Partial<PluginApprovalRequest["request"]> = {},
): PluginApprovalRequest {
  return {
    id: "plugin:test-id",
    request: {
      title: "Plugin approval required",
      description: "Allow plugin action",
      pluginId: "test-plugin",
      toolName: "test-tool",
      agentId: "test-agent",
      sessionKey: "agent:test-agent:discord:channel:999888777",
      ...overrides,
    },
    createdAtMs: Date.now(),
    expiresAtMs: Date.now() + 60000,
  };
}

beforeEach(() => {
  mockRestPost.mockReset();
  mockRestPatch.mockReset();
  mockRestDelete.mockReset();
  gatewayClientStarts.mockReset();
  gatewayClientStops.mockReset();
  gatewayClientRequests.mockReset();
  gatewayClientRequests.mockResolvedValue({ ok: true });
  gatewayClientParams.length = 0;
  mockCreateOperatorApprovalsGatewayClient.mockReset();
});

beforeAll(async () => {
  ({
    buildExecApprovalCustomId,
    extractDiscordChannelId,
    parseExecApprovalData,
    DiscordExecApprovalHandler,
    ExecApprovalButton,
  } = await import("./exec-approvals.js"));
});

// ─── buildExecApprovalCustomId ────────────────────────────────────────────────

describe("buildExecApprovalCustomId", () => {
  it("encodes approval id and action", () => {
    const customId = buildExecApprovalCustomId("abc-123", "allow-once");
    expect(customId).toBe("execapproval:id=abc-123;action=allow-once");
  });

  it("encodes special characters in approval id", () => {
    const customId = buildExecApprovalCustomId("abc=123;test", "deny");
    expect(customId).toBe("execapproval:id=abc%3D123%3Btest;action=deny");
  });
});

// ─── parseExecApprovalData ────────────────────────────────────────────────────

describe("parseExecApprovalData", () => {
  it("parses valid data", () => {
    const result = parseExecApprovalData({ id: "abc-123", action: "allow-once" });
    expect(result).toEqual({ approvalId: "abc-123", action: "allow-once" });
  });

  it("parses encoded data", () => {
    const result = parseExecApprovalData({
      id: "abc%3D123%3Btest",
=======
    expect(
      parseExecApprovalData({
        id: "abc%3D123%3Btest",
        action: "allow-always",
      }),
    ).toEqual({
      approvalId: "abc=123;test",
>>>>>>> upstream/main
      action: "allow-always",
    });
    expect(parseExecApprovalData({ id: "abc", action: "invalid" })).toBeNull();
    expect(parseExecApprovalData({ action: "deny" } as ComponentData)).toBeNull();
  });

  it("extracts discord channel ids from session keys", () => {
    expect(extractDiscordChannelId("agent:main:discord:channel:123456789")).toBe("123456789");
    expect(extractDiscordChannelId("agent:main:discord:group:222333444")).toBe("222333444");
    expect(extractDiscordChannelId("agent:main:telegram:channel:123456789")).toBeNull();
    expect(extractDiscordChannelId("")).toBeNull();
  });

<<<<<<< HEAD
  it("rejects missing id", () => {
    const result = parseExecApprovalData({ action: "deny" });
    expect(result).toBeNull();
  });

  it("rejects missing action", () => {
    const result = parseExecApprovalData({ id: "abc-123" });
    expect(result).toBeNull();
  });

  it("rejects null/undefined input", () => {
    // oxlint-disable-next-line typescript/no-explicit-any
    expect(parseExecApprovalData(null as any)).toBeNull();
    // oxlint-disable-next-line typescript/no-explicit-any
    expect(parseExecApprovalData(undefined as any)).toBeNull();
  });

  it("accepts all valid actions", () => {
    expect(parseExecApprovalData({ id: "x", action: "allow-once" })?.action).toBe("allow-once");
    expect(parseExecApprovalData({ id: "x", action: "allow-always" })?.action).toBe("allow-always");
    expect(parseExecApprovalData({ id: "x", action: "deny" })?.action).toBe("deny");
  });
});

// ─── roundtrip encoding ───────────────────────────────────────────────────────

describe("roundtrip encoding", () => {
  it("encodes and decodes correctly", () => {
    const approvalId = "test-approval-with=special;chars&more";
    const action = "allow-always" as const;
    const customId = buildExecApprovalCustomId(approvalId, action);

    // Parse the key=value pairs from the custom ID
    const parts = customId.split(";");
    const data: Record<string, string> = {};
    for (const part of parts) {
      const match = part.match(/^([^:]+:)?([^=]+)=(.+)$/);
      if (match) {
        data[match[2]] = match[3];
      }
    }

    const result = parseExecApprovalData(data);
    expect(result).toEqual({ approvalId, action });
  });
});

// ─── extractDiscordChannelId ──────────────────────────────────────────────────

describe("extractDiscordChannelId", () => {
  it("extracts channel IDs and rejects invalid session key inputs", () => {
    const cases: Array<{
      name: string;
      input: string | null | undefined;
      expected: string | null;
    }> = [
      {
        name: "standard session key",
        input: "agent:main:discord:channel:123456789",
        expected: "123456789",
      },
      {
        name: "agent-specific session key",
        input: "agent:test-agent:discord:channel:999888777",
        expected: "999888777",
      },
      {
        name: "group session key",
        input: "agent:main:discord:group:222333444",
        expected: "222333444",
      },
      {
        name: "longer session key",
        input: "agent:my-agent:discord:channel:111222333:thread:444555",
        expected: "111222333",
      },
      {
        name: "non-discord session key",
        input: "agent:main:telegram:channel:123456789",
        expected: null,
      },
      {
        name: "missing channel/group segment",
        input: "agent:main:discord:dm:123456789",
        expected: null,
      },
      { name: "null input", input: null, expected: null },
      { name: "undefined input", input: undefined, expected: null },
      { name: "empty input", input: "", expected: null },
    ];

    for (const testCase of cases) {
      expect(extractDiscordChannelId(testCase.input), testCase.name).toBe(testCase.expected);
    }
  });
});

// ─── DiscordExecApprovalHandler.shouldHandle ──────────────────────────────────

describe("DiscordExecApprovalHandler.shouldHandle", () => {
  it("returns false when disabled", () => {
    const handler = createHandler({ enabled: false, approvers: ["123"] });
    expect(handler.shouldHandle(createRequest())).toBe(false);
  });

  it("returns false when no approvers", () => {
    const handler = createHandler({ enabled: true, approvers: [] });
    expect(handler.shouldHandle(createRequest())).toBe(false);
  });

  it("does not treat channel allowFrom as approval authority", () => {
    const handler = createHandler({ enabled: true }, "default", {
      channels: {
        discord: {
          token: "discord-token",
          allowFrom: ["123"],
        },
      },
    });
    expect(handler.shouldHandle(createRequest())).toBe(false);
  });

  it("returns true with minimal config", () => {
    const handler = createHandler({ enabled: true, approvers: ["123"] });
    expect(handler.shouldHandle(createRequest())).toBe(true);
  });

  it("filters by agent ID", () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      agentFilter: ["allowed-agent"],
=======
  it("rejects invalid approval button payloads", async () => {
    const interaction = createInteraction();
    const button = new ExecApprovalButton({
      getApprovers: () => ["123"],
      resolveApproval: async () => ({ ok: true }),
>>>>>>> upstream/main
    });

    await button.run(interaction, { id: "", action: "" });

<<<<<<< HEAD
  it("filters by session key regex", () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      sessionFilter: ["^agent:.*:discord:"],
    });
    expect(handler.shouldHandle(createRequest({ sessionKey: "agent:test:discord:123" }))).toBe(
      true,
    );
    expect(handler.shouldHandle(createRequest({ sessionKey: "other:test:discord:123" }))).toBe(
      false,
    );
  });

  it("rejects unsafe nested-repetition regex in session filter", () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      sessionFilter: ["(a+)+$"],
    });
    expect(handler.shouldHandle(createRequest({ sessionKey: `${"a".repeat(28)}!` }))).toBe(false);
  });

  it("matches long session keys with tail-bounded regex checks", () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      sessionFilter: ["discord:tail$"],
    });
    expect(
      handler.shouldHandle(createRequest({ sessionKey: `${"x".repeat(5000)}discord:tail` })),
    ).toBe(true);
  });

  it("filters by discord account when session store includes account", () => {
    writeStore({
      "agent:test-agent:discord:channel:999888777": {
        sessionId: "sess",
        updatedAt: Date.now(),
        origin: { provider: "discord", accountId: "secondary" },
        lastAccountId: "secondary",
      },
    });
    const handler = createHandler({ enabled: true, approvers: ["123"] }, "default");
    expect(handler.shouldHandle(createRequest())).toBe(false);
    const matching = createHandler({ enabled: true, approvers: ["123"] }, "secondary");
    expect(matching.shouldHandle(createRequest())).toBe(true);
  });

  it("filters by discord account from explicit turn-source bindings when the session store misses", () => {
    const handler = createHandler({ enabled: true, approvers: ["123"] }, "default");
    const matching = createHandler({ enabled: true, approvers: ["123"] }, "secondary");

    expect(
      handler.shouldHandle(
        createRequest({
          sessionKey: "agent:test-agent:missing",
          turnSourceChannel: "discord",
          turnSourceAccountId: "secondary",
        }),
      ),
    ).toBe(false);
    expect(
      matching.shouldHandle(
        createRequest({
          sessionKey: "agent:test-agent:missing",
          turnSourceChannel: "discord",
          turnSourceAccountId: "secondary",
        }),
      ),
    ).toBe(true);
  });

  it("rejects requests bound to another channel before account-specific handling", () => {
    const handler = createHandler({ enabled: true, approvers: ["123"] }, "default");
    expect(
      handler.shouldHandle(
        createRequest({
          turnSourceChannel: "slack",
          turnSourceAccountId: "default",
        }),
      ),
    ).toBe(false);
  });

  it("combines agent and session filters", () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      agentFilter: ["my-agent"],
      sessionFilter: ["discord"],
    });
    expect(
      handler.shouldHandle(
        createRequest({
          agentId: "my-agent",
          sessionKey: "agent:my-agent:discord:123",
        }),
      ),
    ).toBe(true);
    expect(
      handler.shouldHandle(
        createRequest({
          agentId: "other-agent",
          sessionKey: "agent:other:discord:123",
        }),
      ),
    ).toBe(false);
    expect(
      handler.shouldHandle(
        createRequest({
          agentId: "my-agent",
          sessionKey: "agent:my-agent:telegram:123",
        }),
      ),
    ).toBe(false);
  });
});

// ─── DiscordExecApprovalHandler.getApprovers ──────────────────────────────────

describe("DiscordExecApprovalHandler.getApprovers", () => {
  it("returns approvers for configured, empty, and undefined lists", () => {
    const cases = [
      {
        name: "configured approvers",
        config: { enabled: true, approvers: ["111", "222"] } as DiscordExecApprovalConfig,
        expected: ["111", "222"],
      },
      {
        name: "empty approvers",
        config: { enabled: true, approvers: [] } as DiscordExecApprovalConfig,
        expected: [],
      },
      {
        name: "undefined approvers",
        config: { enabled: true } as DiscordExecApprovalConfig,
        expected: [],
      },
      {
        name: "allowFrom does not grant approver rights",
        config: { enabled: true } as DiscordExecApprovalConfig,
        cfgOverrides: {
          channels: {
            discord: {
              token: "discord-token",
              allowFrom: ["123"],
            },
          },
        },
        expected: [],
      },
      {
        name: "ownerAllowFrom still grants exec approver rights",
        config: { enabled: true } as DiscordExecApprovalConfig,
        cfgOverrides: {
          commands: {
            ownerAllowFrom: ["discord:123"],
          },
        },
        expected: ["123"],
      },
    ] as const;

    for (const testCase of cases) {
      const handler = createHandler(
        testCase.config,
        "default",
        "cfgOverrides" in testCase ? (testCase.cfgOverrides as Record<string, unknown>) : {},
      );
      expect(handler.getApprovers(), testCase.name).toEqual(testCase.expected);
    }
  });
});

// ─── ExecApprovalButton authorization ─────────────────────────────────────────

describe("ExecApprovalButton", () => {
  function createMockHandler(approverIds: string[]) {
    const handler = createHandler({
      enabled: true,
      approvers: approverIds,
    });
    // Mock resolveApproval to track calls
    handler.resolveApproval = vi.fn().mockResolvedValue(true);
    return handler;
  }

  function createMockInteraction(userId: string) {
    const reply = vi.fn().mockResolvedValue(undefined);
    const acknowledge = vi.fn().mockResolvedValue(undefined);
    const followUp = vi.fn().mockResolvedValue(undefined);
    const interaction = {
      userId,
      reply,
      acknowledge,
      followUp,
    } as unknown as ButtonInteraction;
    return { interaction, reply, acknowledge, followUp };
  }

  it("denies unauthorized users with ephemeral message", async () => {
    const handler = createMockHandler(["111", "222"]);
    const ctx: ExecApprovalButtonContext = { handler };
    const button = new ExecApprovalButton(ctx);

    const { interaction, reply, acknowledge } = createMockInteraction("999");
    const data: ComponentData = { id: "test-approval", action: "allow-once" };

    await button.run(interaction, data);

    expect(reply).toHaveBeenCalledWith({
      content: "⛔ You are not authorized to approve exec requests.",
      ephemeral: true,
    });
    expect(acknowledge).not.toHaveBeenCalled();
    // oxlint-disable-next-line typescript/unbound-method -- vi.fn() mock
    expect(handler.resolveApproval).not.toHaveBeenCalled();
  });

  it("allows authorized user and resolves approval", async () => {
    const handler = createMockHandler(["111", "222"]);
    const ctx: ExecApprovalButtonContext = { handler };
    const button = new ExecApprovalButton(ctx);

    const { interaction, reply, acknowledge } = createMockInteraction("222");
    const data: ComponentData = { id: "test-approval", action: "allow-once" };

    await button.run(interaction, data);

    expect(reply).not.toHaveBeenCalled();
    expect(acknowledge).toHaveBeenCalledTimes(1);
    // oxlint-disable-next-line typescript/unbound-method -- vi.fn() mock
    expect(handler.resolveApproval).toHaveBeenCalledWith("test-approval", "allow-once");
  });

  it("acknowledges allow-always interactions before resolving", async () => {
    const handler = createMockHandler(["111"]);
    const ctx: ExecApprovalButtonContext = { handler };
    const button = new ExecApprovalButton(ctx);

    const { interaction, acknowledge } = createMockInteraction("111");
    const data: ComponentData = { id: "test-approval", action: "allow-always" };

    await button.run(interaction, data);

    expect(acknowledge).toHaveBeenCalledTimes(1);
    // oxlint-disable-next-line typescript/unbound-method -- vi.fn() mock
    expect(handler.resolveApproval).toHaveBeenCalledWith("test-approval", "allow-always");
  });

  it("acknowledges deny interactions before resolving", async () => {
    const handler = createMockHandler(["111"]);
    const ctx: ExecApprovalButtonContext = { handler };
    const button = new ExecApprovalButton(ctx);

    const { interaction, acknowledge } = createMockInteraction("111");
    const data: ComponentData = { id: "test-approval", action: "deny" };

    await button.run(interaction, data);

    expect(acknowledge).toHaveBeenCalledTimes(1);
    // oxlint-disable-next-line typescript/unbound-method -- vi.fn() mock
    expect(handler.resolveApproval).toHaveBeenCalledWith("test-approval", "deny");
  });

  it("handles invalid data gracefully", async () => {
    const handler = createMockHandler(["111"]);
    const ctx: ExecApprovalButtonContext = { handler };
    const button = new ExecApprovalButton(ctx);

    const { interaction, acknowledge, reply } = createMockInteraction("111");
    const data: ComponentData = { id: "", action: "invalid" };

    await button.run(interaction, data);

    expect(reply).toHaveBeenCalledWith({
=======
    expect(interaction["reply"]).toHaveBeenCalledWith({
>>>>>>> upstream/main
      content: "This approval is no longer valid.",
      ephemeral: true,
    });
  });

  it("blocks non-approvers from approving", async () => {
    const interaction = createInteraction({ userId: "999" });
    const button = new ExecApprovalButton({
      getApprovers: () => ["123"],
      resolveApproval: async () => ({ ok: true }),
    });

    await button.run(interaction, { id: "abc", action: "allow-once" });

    expect(interaction["reply"]).toHaveBeenCalledWith({
      content: "⛔ You are not authorized to approve exec requests.",
      ephemeral: true,
    });
  });

  it("acknowledges and resolves valid approval clicks", async () => {
    const interaction = createInteraction();
    const resolveApproval = vi.fn(async () => ({ ok: true }) as const);
    const button = new ExecApprovalButton({
      getApprovers: () => ["123"],
      resolveApproval,
    });

    await button.run(interaction, { id: "abc", action: "allow-once" });

    expect(interaction["acknowledge"]).toHaveBeenCalled();
    expect(resolveApproval).toHaveBeenCalledWith("abc", "allow-once");
    expect(interaction["followUp"]).not.toHaveBeenCalled();
  });

  it("shows a follow-up when gateway resolution fails", async () => {
    const interaction = createInteraction();
    const button = new ExecApprovalButton({
      getApprovers: () => ["123"],
      resolveApproval: async () => ({ ok: false, reason: "error" }),
    });

    await button.run(interaction, { id: "abc", action: "deny" });

    expect(interaction["followUp"]).toHaveBeenCalledWith({
      content:
        "Failed to submit approval decision for **Denied**. The request may have expired or already been resolved.",
      ephemeral: true,
    });
  });

  it("shows a follow-up for already-resolved approval clicks", async () => {
    const interaction = createInteraction();
    const button = new ExecApprovalButton({
      getApprovers: () => ["123"],
      resolveApproval: async () => ({ ok: false, reason: "not-found" }),
    });

    await button.run(interaction, { id: "abc", action: "allow-once" });

    expect(interaction["acknowledge"]).toHaveBeenCalled();
    expect(interaction["followUp"]).toHaveBeenCalledWith({
      content:
        "That approval request is no longer pending. It may have expired or already been resolved.",
      ephemeral: true,
    });
  });

  it("builds button context from config and routes resolution over gateway", async () => {
    const cfg = buildConfig({ enabled: true, approvers: ["123"] });
    resolveApprovalOverGatewayMock.mockResolvedValue(undefined);
    const ctx = createDiscordExecApprovalButtonContext({
      cfg,
      accountId: "default",
      config: { enabled: true, approvers: ["123"] },
<<<<<<< HEAD
      cfg: {
        gateway: {
          mode: "local",
          bind: "loopback",
          auth: { mode: "token", token: "shared-gateway-token" },
        },
      },
=======
      gatewayUrl: "ws://127.0.0.1:18789",
>>>>>>> upstream/main
    });

    expect(ctx.getApprovers()).toEqual(["123"]);
    await expect(ctx.resolveApproval("abc", "allow-once")).resolves.toEqual({ ok: true });
    expect(resolveApprovalOverGatewayMock).toHaveBeenCalledWith({
      cfg,
      approvalId: "abc",
      decision: "allow-once",
      gatewayUrl: "ws://127.0.0.1:18789",
      clientDisplayName: "Discord approval (default)",
    });
  });

  it("returns false when gateway resolution throws", async () => {
    resolveApprovalOverGatewayMock.mockRejectedValue(new Error("boom"));
    const ctx = createDiscordExecApprovalButtonContext({
      cfg: buildConfig({ enabled: true, approvers: ["123"] }),
      accountId: "default",
      config: { enabled: true, approvers: ["123"] },
<<<<<<< HEAD
      cfg: {
        gateway: {
          mode: "local",
          bind: "loopback",
          auth: { mode: "token" },
        },
      },
=======
>>>>>>> upstream/main
    });

    await expect(ctx.resolveApproval("abc", "allow-once")).resolves.toEqual({
      ok: false,
      reason: "error",
    });
  });

<<<<<<< HEAD
// ─── Timeout cleanup ─────────────────────────────────────────────────────────

describe("DiscordExecApprovalHandler timeout cleanup", () => {
  beforeEach(() => {
    mockRestPost.mockClear().mockResolvedValue({ id: "mock-message", channel_id: "mock-channel" });
    mockRestPatch.mockClear().mockResolvedValue({});
    mockRestDelete.mockClear().mockResolvedValue({});
  });
});

// ─── Delivery routing ────────────────────────────────────────────────────────

describe("DiscordExecApprovalHandler delivery routing", () => {
  beforeEach(() => {
    mockRestPost.mockClear().mockResolvedValue({ id: "mock-message", channel_id: "mock-channel" });
    mockRestPatch.mockClear().mockResolvedValue({});
    mockRestDelete.mockClear().mockResolvedValue({});
  });

  it("falls back to DM delivery when channel target has no channel id", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      target: "channel",
    });

    mockSuccessfulDmDelivery();

    const request = createRequest({ sessionKey: "agent:main:discord:dm:123" });
    await handler.handleApprovalRequested(request);

    expect(mockRestPost).toHaveBeenCalledTimes(2);
    expect(mockRestPost).toHaveBeenCalledWith(Routes.userChannels(), {
      body: { recipient_id: "123" },
    });
    expect(mockRestPost).toHaveBeenCalledWith(
      Routes.channelMessages("dm-1"),
      expect.objectContaining({
        body: expect.objectContaining({
          components: expect.any(Array),
        }),
      }),
    );
  });

  it("posts an in-channel note when target is dm and the request came from a non-DM discord conversation", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      target: "dm",
    });

    mockSuccessfulDmDelivery({
      noteChannelId: "999888777",
      expectedNoteText: "I sent approval DMs to the approvers for this account",
      throwOnUnexpectedRoute: true,
    });

    await handler.handleApprovalRequested(createRequest());

    expect(mockRestPost).toHaveBeenCalledWith(
      Routes.channelMessages("999888777"),
      expect.objectContaining({
        body: expect.objectContaining({
          content: expect.stringContaining("I sent approval DMs to the approvers for this account"),
        }),
      }),
    );
    expect(mockRestPost).toHaveBeenCalledWith(
      Routes.channelMessages("dm-1"),
      expect.objectContaining({
        body: expect.any(Object),
      }),
    );
  });

  it("does not post an in-channel note when the request already came from a discord DM", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      target: "dm",
    });

    mockSuccessfulDmDelivery({ throwOnUnexpectedRoute: true });

    await handler.handleApprovalRequested(
      createRequest({ sessionKey: "agent:main:discord:dm:123" }),
    );

    expect(mockRestPost).not.toHaveBeenCalledWith(
      Routes.channelMessages("999888777"),
      expect.anything(),
    );
  });

  it("dedupes delivery when the origin route and approver DM resolve to the same Discord channel", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["999"],
      target: "both",
    });

    mockRestPost.mockImplementation(async (route: string) => {
      if (route === Routes.channelMessages("123")) {
        return { id: "msg-1", channel_id: "123" };
      }
      if (route === Routes.userChannels()) {
        return { id: "123" };
      }
      throw new Error(`unexpected route: ${route}`);
    });

    await handler.handleApprovalRequested(
      createRequest({
        sessionKey: "agent:main:discord:channel:123",
        turnSourceChannel: "discord",
        turnSourceTo: "123",
        turnSourceAccountId: "default",
      }),
    );

    expect(mockRestPost).toHaveBeenCalledTimes(2);
    expect(mockRestPost).toHaveBeenNthCalledWith(
      1,
      Routes.channelMessages("123"),
      expect.objectContaining({
        body: expect.any(Object),
      }),
    );
    expect(mockRestPost).toHaveBeenNthCalledWith(2, Routes.userChannels(), {
      body: { recipient_id: "999" },
    });
  });

  it("delivers plugin approvals through the shared runtime flow", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      target: "dm",
    });

    mockSuccessfulDmDelivery({ throwOnUnexpectedRoute: true });

    await handler.handleApprovalRequested(createPluginRequest());

    expect(mockRestPost).toHaveBeenCalledWith(
      Routes.channelMessages("dm-1"),
      expect.objectContaining({
        body: expect.objectContaining({
          components: expect.arrayContaining([
            expect.objectContaining({
              components: expect.arrayContaining([
                expect.objectContaining({
                  content: expect.stringContaining("Plugin Approval Required"),
                }),
                expect.objectContaining({
                  content: expect.stringContaining("Plugin approval required"),
                }),
              ]),
            }),
          ]),
        }),
      }),
    );
  });

  it("omits allow-always when exec approvals disallow it", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
      target: "dm",
    });

    mockSuccessfulDmDelivery({ throwOnUnexpectedRoute: true });

    await handler.handleApprovalRequested(
      createRequest({
        ask: "always",
        allowedDecisions: ["allow-once", "deny"],
      }),
    );

    const dmCall = mockRestPost.mock.calls.find(
      ([route]) => route === Routes.channelMessages("dm-1"),
    );
    const payload = JSON.stringify(dmCall?.[1]?.body);
    expect(payload).toContain("Allow Once");
    expect(payload).toContain("Deny");
    expect(payload).not.toContain("Allow Always");
  });
});

describe("DiscordExecApprovalHandler resolve routing", () => {
  it("routes plugin approval ids through plugin.approval.resolve", async () => {
    const handler = createHandler({
      enabled: true,
      approvers: ["123"],
    });

    await handler.start();
    await expect(handler.resolveApproval("plugin:test-id", "allow-once")).resolves.toBe(true);

    expect(gatewayClientRequests).toHaveBeenCalledWith("plugin.approval.resolve", {
      id: "plugin:test-id",
      decision: "allow-once",
    });
  });
});

describe("DiscordExecApprovalHandler gateway auth resolution", () => {
  it("passes CLI URL overrides to shared gateway auth resolver", async () => {
    mockResolveGatewayConnectionAuth.mockResolvedValue({
      token: "resolved-token",
      password: "resolved-password", // pragma: allowlist secret
    });
    const handler = new DiscordExecApprovalHandler({
      token: "test-token",
=======
  it("classifies structured approval-not-found gateway errors as stale clicks", async () => {
    const err = Object.assign(new Error("unknown or expired approval id"), {
      gatewayCode: "INVALID_REQUEST",
      details: { reason: "APPROVAL_NOT_FOUND" },
    });
    resolveApprovalOverGatewayMock.mockRejectedValue(err);
    const ctx = createDiscordExecApprovalButtonContext({
      cfg: buildConfig({ enabled: true, approvers: ["123"] }),
>>>>>>> upstream/main
      accountId: "default",
      config: { enabled: true, approvers: ["123"] },
<<<<<<< HEAD
      cfg: { session: { store: STORE_PATH } },
=======
>>>>>>> upstream/main
    });

    await expect(ctx.resolveApproval("abc", "allow-once")).resolves.toEqual({
      ok: false,
      reason: "not-found",
    });
  });

<<<<<<< HEAD
  it("passes env URL overrides to shared gateway auth resolver", async () => {
    const previousGatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
    try {
      process.env.OPENCLAW_GATEWAY_URL = "wss://gateway-from-env.example/ws";
      const handler = new DiscordExecApprovalHandler({
        token: "test-token",
        accountId: "default",
        config: { enabled: true, approvers: ["123"] },
        cfg: { session: { store: STORE_PATH } },
      });
=======
  it("keeps message-only approval-not-found errors visible", async () => {
    resolveApprovalOverGatewayMock.mockRejectedValue(new Error("unknown or expired approval id"));
    const ctx = createDiscordExecApprovalButtonContext({
      cfg: buildConfig({ enabled: true, approvers: ["123"] }),
      accountId: "default",
      config: { enabled: true, approvers: ["123"] },
    });
>>>>>>> upstream/main

    await expect(ctx.resolveApproval("abc", "allow-once")).resolves.toEqual({
      ok: false,
      reason: "error",
    });
  });
});
