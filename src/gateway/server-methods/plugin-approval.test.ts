<<<<<<< HEAD
=======
// Plugin approval tests cover requested/resolved plugin approval events,
// requester visibility, broadcast behavior, and approval manager integration.
>>>>>>> upstream/main
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PluginApprovalRequestPayload } from "../../infra/plugin-approvals.js";
import { ExecApprovalManager } from "../exec-approval-manager.js";
import { createPluginApprovalHandlers } from "./plugin-approval.js";
import type { GatewayRequestHandlerOptions } from "./types.js";

function createManager() {
  return new ExecApprovalManager<PluginApprovalRequestPayload>();
}

<<<<<<< HEAD
=======
function createLogGatewayMock() {
  return { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() };
}

function createApprovalContext(
  params: {
    broadcast?: ReturnType<typeof vi.fn>;
    hasExecApprovalClients?: GatewayRequestHandlerOptions["context"]["hasExecApprovalClients"];
  } = {},
): GatewayRequestHandlerOptions["context"] {
  return {
    broadcast: params.broadcast ?? vi.fn(),
    logGateway: createLogGatewayMock(),
    hasExecApprovalClients: params.hasExecApprovalClients ?? (() => true),
  } as unknown as GatewayRequestHandlerOptions["context"];
}

function createClient(
  params: {
    connId?: string;
    clientId?: string;
    displayName?: string;
    deviceId?: string;
    scopes?: string[];
  } = {},
): GatewayRequestHandlerOptions["client"] {
  const connect: Record<string, unknown> = {
    client: {
      id: params.clientId ?? "test-client",
      displayName: params.displayName ?? "Test Client",
    },
  };
  if (params.deviceId) {
    connect.device = { id: params.deviceId };
  }
  if (params.scopes) {
    connect.scopes = params.scopes;
  }
  return {
    connId: params.connId ?? "conn-test-client",
    connect,
  } as unknown as GatewayRequestHandlerOptions["client"];
}

>>>>>>> upstream/main
function createMockOptions(
  method: string,
  params: Record<string, unknown>,
  overrides?: Partial<GatewayRequestHandlerOptions>,
): GatewayRequestHandlerOptions {
  return {
    req: { method, params, id: "req-1" },
    params,
<<<<<<< HEAD
    client: {
      connect: {
        client: { id: "test-client", displayName: "Test Client" },
      },
    },
    isWebchatConnect: () => false,
    respond: vi.fn(),
    context: {
      broadcast: vi.fn(),
      logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
      hasExecApprovalClients: () => true,
    },
=======
    client: createClient(),
    isWebchatConnect: () => false,
    respond: vi.fn(),
    context: createApprovalContext(),
>>>>>>> upstream/main
    ...overrides,
  } as unknown as GatewayRequestHandlerOptions;
}

<<<<<<< HEAD
=======
function createNoExecApprovalContext(): GatewayRequestHandlerOptions["context"] {
  return createApprovalContext({ hasExecApprovalClients: () => false });
}

type MockCallSource = {
  mock: {
    calls: ArrayLike<ReadonlyArray<unknown>>;
  };
};

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    throw new Error(`expected ${label}`);
  }
  return value as Record<string, unknown>;
}

function requireArray(value: unknown, label: string): unknown[] {
  expect(Array.isArray(value), label).toBe(true);
  return value as unknown[];
}

function mockCall(source: unknown, index: number, label: string) {
  const call = (source as MockCallSource).mock.calls[index];
  if (!call) {
    throw new Error(`Expected ${label}`);
  }
  return call;
}

function responseCall(source: unknown, index = 0) {
  const call = mockCall(source, index, `response call ${index}`);
  return {
    ok: call[0],
    result: call[1],
    error: call[2],
  };
}

function responseResult(source: unknown, index = 0) {
  return requireRecord(responseCall(source, index).result, `response result ${index}`);
}

function responseError(source: unknown, index = 0) {
  return requireRecord(responseCall(source, index).error, `response error ${index}`);
}

function acceptedResult(source: unknown) {
  const callSource = source as MockCallSource;
  const call = Array.from(callSource.mock.calls).find((candidate) => {
    const result = candidate[1];
    return typeof result === "object" && result !== null && "status" in result
      ? (result as Record<string, unknown>).status === "accepted"
      : false;
  });
  if (!call) {
    throw new Error("Expected accepted response call");
  }
  return requireRecord(call[1], "accepted response result");
}

function acceptedApprovalId(source: unknown) {
  const id = acceptedResult(source).id;
  expect(id, "accepted approval id").toBeTypeOf("string");
  return id as string;
}

function expectResponseOk(source: unknown, index = 0) {
  const call = responseCall(source, index);
  expect(call.ok).toBe(true);
  expect(call.error).toBeUndefined();
  return requireRecord(call.result, `response result ${index}`);
}

function expectResponseRejected(source: unknown, index = 0) {
  expect(responseCall(source, index).ok).toBe(false);
  return responseError(source, index);
}

async function waitForAcceptedApproval(respond: unknown) {
  await vi.waitFor(() => {
    const accepted = acceptedResult(respond);
    expect(accepted.status).toBe("accepted");
    expect(accepted.id).toBeTypeOf("string");
  });
  return acceptedApprovalId(respond);
}

function createOwnedClient(owner: "owner" | "other" = "owner") {
  return createClient({
    connId: `conn-${owner}`,
    clientId: `client-${owner}`,
    deviceId: `device-${owner}`,
  });
}

function registerApproval(
  approvalManager: ExecApprovalManager<PluginApprovalRequestPayload>,
  params: {
    title?: string;
    description?: string;
    id?: string;
    allowedDecisions?: PluginApprovalRequestPayload["allowedDecisions"];
  } = {},
) {
  const request = {
    title: params.title ?? "T",
    description: params.description ?? "D",
    ...(params.allowedDecisions ? { allowedDecisions: params.allowedDecisions } : {}),
  };
  const record = params.id
    ? approvalManager.create(request, 60_000, params.id)
    : approvalManager.create(request, 60_000);
  void approvalManager.register(record, 60_000);
  return record;
}

function registerOwnedApproval(
  approvalManager: ExecApprovalManager<PluginApprovalRequestPayload>,
  params: { title: string; id?: string; owner?: "owner" | "other" },
) {
  const record = registerApproval(approvalManager, { title: params.title, id: params.id });
  const owner = params.owner ?? "owner";
  record.requestedByDeviceId = `device-${owner}`;
  record.requestedByConnId = `conn-${owner}`;
  record.requestedByClientId = `client-${owner}`;
  return record;
}

function expectPluginApprovalId(value: unknown, label: string): string {
  expect(value, label).toBeTypeOf("string");
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string`);
  }
  expect(value.startsWith("plugin:"), label).toBe(true);
  const uuid = value.slice("plugin:".length);
  expect(uuid).toHaveLength(36);
  expect(uuid.split("-").map((part) => part.length)).toEqual([8, 4, 4, 4, 12]);
  expect(
    uuid.split("-").every((part) => /^[0-9a-f]+$/.test(part)),
    label,
  ).toBe(true);
  return value;
}

function broadcastCall(opts: GatewayRequestHandlerOptions, index = 0) {
  const call = mockCall(opts.context.broadcast, index, "broadcast call");
  return {
    event: call?.[0],
    payload: requireRecord(call?.[1], "broadcast payload"),
    options: call?.[2],
  };
}

const invalidParamMethodCases = [
  { method: "plugin.approval.request" },
  { method: "plugin.approval.resolve" },
] as const;

const invalidRequestCases = [
  {
    name: "invalid severity value",
    params: { title: "T", description: "D", severity: "extreme" },
  },
  {
    name: "title exceeding max length",
    params: { title: "x".repeat(81), description: "D" },
  },
  {
    name: "description exceeding max length",
    params: { title: "T", description: "x".repeat(257) },
  },
  {
    name: "timeoutMs exceeding max",
    params: { title: "T", description: "D", timeoutMs: 700_000 },
  },
] as const;

>>>>>>> upstream/main
describe("createPluginApprovalHandlers", () => {
  let manager: ExecApprovalManager<PluginApprovalRequestPayload>;

  beforeEach(() => {
    manager = createManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

<<<<<<< HEAD
  it("returns handlers for all three plugin approval methods", () => {
    const handlers = createPluginApprovalHandlers(manager);
    expect(handlers).toHaveProperty("plugin.approval.request");
    expect(handlers).toHaveProperty("plugin.approval.waitDecision");
    expect(handlers).toHaveProperty("plugin.approval.resolve");
    expect(typeof handlers["plugin.approval.request"]).toBe("function");
    expect(typeof handlers["plugin.approval.waitDecision"]).toBe("function");
    expect(typeof handlers["plugin.approval.resolve"]).toBe("function");
  });

  describe("plugin.approval.request", () => {
    it("rejects invalid params", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {});
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({
          code: expect.any(String),
        }),
      );
    });

=======
  it("returns handlers for every plugin approval method", () => {
    const handlers = createPluginApprovalHandlers(manager);
    expect(Object.keys(handlers).toSorted()).toEqual([
      "plugin.approval.list",
      "plugin.approval.request",
      "plugin.approval.resolve",
      "plugin.approval.waitDecision",
    ]);
  });

  describe("invalid params", () => {
    it.each(invalidParamMethodCases)("$method rejects invalid params", async ({ method }) => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions(method, {});
      await handlers[method](opts);
      expect(responseCall(opts.respond).result).toBeUndefined();
      expect(expectResponseRejected(opts.respond).code).toBeTypeOf("string");
    });
  });

  describe("plugin.approval.request", () => {
>>>>>>> upstream/main
    it("creates and registers approval with twoPhase", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const respond = vi.fn();
      const opts = createMockOptions(
        "plugin.approval.request",
        {
          title: "Sensitive action",
          description: "This tool modifies production data",
          severity: "warning",
          twoPhase: true,
        },
        { respond },
      );

      // Don't await — the handler blocks waiting for the decision.
      // Instead, let it run and resolve the approval after the accepted response.
      const handlerPromise = handlers["plugin.approval.request"](opts);

<<<<<<< HEAD
      // Wait for the twoPhase "accepted" response
      await vi.waitFor(() => {
        expect(respond).toHaveBeenCalledWith(
          true,
          expect.objectContaining({ status: "accepted", id: expect.any(String) }),
          undefined,
        );
      });

      expect(opts.context.broadcast).toHaveBeenCalledWith(
        "plugin.approval.requested",
        expect.objectContaining({ id: expect.any(String) }),
        { dropIfSlow: true },
      );

      // Resolve the approval so the handler can complete
      const acceptedCall = respond.mock.calls.find(
        (c) => (c[1] as Record<string, unknown>)?.status === "accepted",
      );
      const approvalId = (acceptedCall?.[1] as Record<string, unknown>)?.id as string;
=======
      const approvalId = await waitForAcceptedApproval(respond);

      const requestedBroadcast = broadcastCall(opts);
      expect(requestedBroadcast.event).toBe("plugin.approval.requested");
      expect(requestedBroadcast.payload.id).toBeTypeOf("string");
      expect(requestedBroadcast.options).toEqual({ dropIfSlow: true });

      // Resolve the approval so the handler can complete
      expect(manager.getSnapshot(approvalId)?.requestedByClientId).toBe("test-client");
>>>>>>> upstream/main
      manager.resolve(approvalId, "allow-once");

      await handlerPromise;

      // Final response with decision
<<<<<<< HEAD
      expect(respond).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ id: approvalId, decision: "allow-once" }),
        undefined,
      );
=======
      const finalResult = expectResponseOk(respond, 1);
      expect(finalResult.id).toBe(approvalId);
      expect(finalResult.decision).toBe("allow-once");
>>>>>>> upstream/main
    });

    it("expires immediately when no approval route", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions(
        "plugin.approval.request",
        {
          title: "Sensitive action",
          description: "Desc",
        },
        {
<<<<<<< HEAD
          context: {
            broadcast: vi.fn(),
            logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
            hasExecApprovalClients: () => false,
          } as unknown as GatewayRequestHandlerOptions["context"],
        },
      );
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ decision: null }),
        undefined,
      );
=======
          context: createNoExecApprovalContext(),
        },
      );
      await handlers["plugin.approval.request"](opts);
      expect(expectResponseOk(opts.respond).decision).toBeNull();
>>>>>>> upstream/main
    });

    it("passes caller connId to hasExecApprovalClients to exclude self", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const hasExecApprovalClients = vi.fn().mockReturnValue(false);
      const opts = createMockOptions(
        "plugin.approval.request",
        { title: "T", description: "D" },
        {
<<<<<<< HEAD
          client: {
            connId: "backend-conn-42",
            connect: { client: { id: "test", displayName: "Test" } },
          } as unknown as GatewayRequestHandlerOptions["client"],
          context: {
            broadcast: vi.fn(),
            logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
            hasExecApprovalClients,
          } as unknown as GatewayRequestHandlerOptions["context"],
=======
          client: createClient({
            connId: "backend-conn-42",
            clientId: "test",
            displayName: "Test",
          }),
          context: createApprovalContext({ hasExecApprovalClients }),
>>>>>>> upstream/main
        },
      );
      await handlers["plugin.approval.request"](opts);
      expect(hasExecApprovalClients).toHaveBeenCalledWith("backend-conn-42");
    });

    it("keeps plugin approvals pending when the originating chat can handle /approve directly", async () => {
      vi.useFakeTimers();
      try {
        const handlers = createPluginApprovalHandlers(manager);
        const respond = vi.fn();
        const opts = createMockOptions(
          "plugin.approval.request",
          {
            title: "Sensitive action",
            description: "Desc",
            twoPhase: true,
            turnSourceChannel: "slack",
            turnSourceTo: "C123",
          },
          {
            respond,
<<<<<<< HEAD
            context: {
              broadcast: vi.fn(),
              logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
              hasExecApprovalClients: () => false,
            } as unknown as GatewayRequestHandlerOptions["context"],
=======
            context: createApprovalContext({ hasExecApprovalClients: () => false }),
>>>>>>> upstream/main
          },
        );

        const requestPromise = handlers["plugin.approval.request"](opts);
<<<<<<< HEAD

        await vi.waitFor(() => {
          expect(respond).toHaveBeenCalledWith(
            true,
            expect.objectContaining({ status: "accepted", id: expect.any(String) }),
            undefined,
          );
        });

        const acceptedCall = respond.mock.calls.find(
          (call) => (call[1] as Record<string, unknown>)?.status === "accepted",
        );
        const approvalId = (acceptedCall?.[1] as Record<string, unknown>)?.id as string;
=======
        const approvalId = await waitForAcceptedApproval(respond);
>>>>>>> upstream/main
        manager.resolve(approvalId, "allow-once");

        await requestPromise;
      } finally {
        vi.useRealTimers();
      }
    });

<<<<<<< HEAD
    it("rejects invalid severity value", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {
        title: "T",
        description: "D",
        severity: "extreme",
      });
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ code: expect.any(String) }),
      );
    });

    it("rejects title exceeding max length", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {
        title: "x".repeat(81),
        description: "D",
      });
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ code: expect.any(String) }),
      );
    });

    it("rejects description exceeding max length", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {
        title: "T",
        description: "x".repeat(257),
      });
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ code: expect.any(String) }),
      );
    });

    it("rejects timeoutMs exceeding max", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {
        title: "T",
        description: "D",
        timeoutMs: 700_000,
      });
      await handlers["plugin.approval.request"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ code: expect.any(String) }),
      );
=======
    it.each(invalidRequestCases)("rejects $name", async ({ params }) => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", params);
      await handlers["plugin.approval.request"](opts);
      expect(expectResponseRejected(opts.respond).code).toBeTypeOf("string");
>>>>>>> upstream/main
    });

    it("generates plugin-prefixed IDs", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const respond = vi.fn();
      const opts = createMockOptions(
        "plugin.approval.request",
        { title: "T", description: "D" },
        {
          respond,
<<<<<<< HEAD
          context: {
            broadcast: vi.fn(),
            logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
            hasExecApprovalClients: () => false,
          } as unknown as GatewayRequestHandlerOptions["context"],
        },
      );
      await handlers["plugin.approval.request"](opts);
      const result = respond.mock.calls[0]?.[1] as Record<string, unknown> | undefined;
      expect(result?.id).toEqual(expect.stringMatching(/^plugin:/));
=======
          context: createApprovalContext({ hasExecApprovalClients: () => false }),
        },
      );
      await handlers["plugin.approval.request"](opts);
      const result = responseResult(respond);
      expectPluginApprovalId(result?.id, "generated plugin approval id");
>>>>>>> upstream/main
    });

    it("passes plugin-prefixed IDs directly to manager.create", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const createSpy = vi.spyOn(manager, "create");
      const opts = createMockOptions(
        "plugin.approval.request",
        { title: "T", description: "D" },
        {
<<<<<<< HEAD
          context: {
            broadcast: vi.fn(),
            logGateway: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
            hasExecApprovalClients: () => false,
          } as unknown as GatewayRequestHandlerOptions["context"],
=======
          context: createNoExecApprovalContext(),
>>>>>>> upstream/main
        },
      );

      await handlers["plugin.approval.request"](opts);

      expect(createSpy).toHaveBeenCalledTimes(1);
<<<<<<< HEAD
      expect(createSpy.mock.calls[0]?.[2]).toEqual(expect.stringMatching(/^plugin:/));
=======
      expectPluginApprovalId(
        mockCall(createSpy, 0, "manager.create call")[2],
        "manager.create approval id",
      );
>>>>>>> upstream/main
    });

    it("rejects plugin-provided id field", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.request", {
        id: "plugin-provided-id",
        title: "T",
        description: "D",
      });
      await handlers["plugin.approval.request"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ message: expect.stringContaining("unexpected property") }),
      );
=======
      expect(responseCall(opts.respond).ok).toBe(false);
      expect(responseError(opts.respond).message).toContain("unexpected property");
    });

    it("stores scoped allowed decisions on plugin approval requests", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const respond = vi.fn();
      const opts = createMockOptions(
        "plugin.approval.request",
        {
          title: "T",
          description: "D",
          allowedDecisions: ["allow-once", "deny", "allow-once"],
          twoPhase: true,
        },
        { respond },
      );

      const handlerPromise = handlers["plugin.approval.request"](opts);
      const approvalId = await waitForAcceptedApproval(respond);
      expect(manager.getSnapshot(approvalId)?.request.allowedDecisions).toEqual([
        "allow-once",
        "deny",
      ]);
      manager.resolve(approvalId, "deny");
      await handlerPromise;
    });
  });

  describe("plugin.approval.list", () => {
    it("lists pending plugin approvals", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const respond = vi.fn();
      const requestOpts = createMockOptions(
        "plugin.approval.request",
        {
          title: "Sensitive action",
          description: "Desc",
          twoPhase: true,
        },
        { respond },
      );

      const handlerPromise = handlers["plugin.approval.request"](requestOpts);
      const approvalId = await waitForAcceptedApproval(respond);

      const listRespond = vi.fn();
      await handlers["plugin.approval.list"](
        createMockOptions("plugin.approval.list", {}, { respond: listRespond }),
      );
      const listCall = responseCall(listRespond);
      expect(listCall.ok).toBe(true);
      expect(listCall.error).toBeUndefined();
      const approvals = requireArray(listCall.result, "approval list");
      expect(approvals).toHaveLength(1);
      const approval = requireRecord(approvals[0], "approval");
      const listedApprovalId = expectPluginApprovalId(approval.id, "listed approval id");
      const request = requireRecord(approval.request, "approval request");
      expect(request.title).toBe("Sensitive action");
      expect(request.description).toBe("Desc");

      expect(listedApprovalId).toBe(approvalId);
      manager.resolve(approvalId, "allow-once");
      await handlerPromise;
    });

    it("lists only plugin approvals owned by the caller", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      registerOwnedApproval(manager, { title: "Visible", id: "plugin:visible" });
      registerOwnedApproval(manager, {
        title: "Hidden",
        id: "plugin:hidden",
        owner: "other",
      });

      const listRespond = vi.fn();
      await handlers["plugin.approval.list"](
        createMockOptions(
          "plugin.approval.list",
          {},
          {
            respond: listRespond,
            client: createOwnedClient(),
          },
        ),
      );

      const listCall = responseCall(listRespond);
      expect(listCall.ok).toBe(true);
      const approvals = requireArray(listCall.result, "approval list");
      expect(approvals.map((entry) => requireRecord(entry, "approval").id)).toEqual([
        "plugin:visible",
      ]);
>>>>>>> upstream/main
    });
  });

  describe("plugin.approval.waitDecision", () => {
    it("rejects missing id", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.waitDecision", {});
      await handlers["plugin.approval.waitDecision"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ message: expect.stringContaining("id is required") }),
      );
=======
      expect(expectResponseRejected(opts.respond).message).toContain("id is required");
>>>>>>> upstream/main
    });

    it("returns not found for unknown id", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.waitDecision", { id: "unknown" });
      await handlers["plugin.approval.waitDecision"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ message: expect.stringContaining("expired or not found") }),
      );
=======
      expect(expectResponseRejected(opts.respond).message).toContain("expired or not found");
    });

    it("returns not found for approvals hidden from the caller", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const record = registerOwnedApproval(manager, { title: "T" });
      manager.resolve(record.id, "allow-once");

      const opts = createMockOptions(
        "plugin.approval.waitDecision",
        { id: record.id },
        {
          client: createClient({
            connId: "conn-other",
            clientId: "client-other",
            deviceId: "device-other",
            scopes: ["operator.approvals"],
          }),
        },
      );
      await handlers["plugin.approval.waitDecision"](opts);
      expect(expectResponseRejected(opts.respond).message).toContain("expired or not found");
>>>>>>> upstream/main
    });

    it("returns decision when resolved", async () => {
      const handlers = createPluginApprovalHandlers(manager);
<<<<<<< HEAD
      const record = manager.create({ title: "T", description: "D" }, 60_000);
      void manager.register(record, 60_000);
=======
      const record = registerApproval(manager);
>>>>>>> upstream/main

      // Resolve before waiting
      manager.resolve(record.id, "allow-once");

      const opts = createMockOptions("plugin.approval.waitDecision", { id: record.id });
      await handlers["plugin.approval.waitDecision"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ id: record.id, decision: "allow-once" }),
        undefined,
      );
=======
      const result = expectResponseOk(opts.respond);
      expect(result.id).toBe(record.id);
      expect(result.decision).toBe("allow-once");
>>>>>>> upstream/main
    });
  });

  describe("plugin.approval.resolve", () => {
<<<<<<< HEAD
    it("rejects invalid params", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.resolve", {});
      await handlers["plugin.approval.resolve"](opts);
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({
          code: expect.any(String),
        }),
      );
    });

    it("rejects invalid decision", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const record = manager.create({ title: "T", description: "D" }, 60_000);
      void manager.register(record, 60_000);
=======
    it("rejects invalid decision", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const record = registerApproval(manager);
>>>>>>> upstream/main
      const opts = createMockOptions("plugin.approval.resolve", {
        id: record.id,
        decision: "invalid",
      });
      await handlers["plugin.approval.resolve"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ message: "invalid decision" }),
      );
=======
      expect(expectResponseRejected(opts.respond).message).toBe("invalid decision");
>>>>>>> upstream/main
    });

    it("resolves a pending approval", async () => {
      const handlers = createPluginApprovalHandlers(manager);
<<<<<<< HEAD
      const record = manager.create({ title: "T", description: "D" }, 60_000);
      void manager.register(record, 60_000);
=======
      const record = registerApproval(manager);
>>>>>>> upstream/main

      const opts = createMockOptions("plugin.approval.resolve", {
        id: record.id,
        decision: "deny",
      });
      await handlers["plugin.approval.resolve"](opts);
      expect(opts.respond).toHaveBeenCalledWith(true, { ok: true }, undefined);
<<<<<<< HEAD
      expect(opts.context.broadcast).toHaveBeenCalledWith(
        "plugin.approval.resolved",
        expect.objectContaining({ id: record.id, decision: "deny" }),
        { dropIfSlow: true },
      );
=======
      const resolvedBroadcast = broadcastCall(opts);
      expect(resolvedBroadcast.event).toBe("plugin.approval.resolved");
      expect(resolvedBroadcast.payload.id).toBe(record.id);
      expect(resolvedBroadcast.payload.decision).toBe("deny");
      expect(resolvedBroadcast.options).toEqual({ dropIfSlow: true });
    });

    it("resolves only plugin approvals owned by the caller", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const visible = registerOwnedApproval(manager, {
        title: "Visible",
        id: "plugin:abcd-visible",
      });
      const hidden = registerOwnedApproval(manager, {
        title: "Hidden",
        id: "plugin:abcd-hidden",
        owner: "other",
      });

      const ownerClient = createOwnedClient();
      const resolveRespond = vi.fn();
      await handlers["plugin.approval.resolve"](
        createMockOptions(
          "plugin.approval.resolve",
          {
            id: "plugin:abcd",
            decision: "allow-once",
          },
          {
            respond: resolveRespond,
            client: ownerClient,
          },
        ),
      );
      expect(resolveRespond).toHaveBeenCalledWith(true, { ok: true }, undefined);
      expect(manager.getSnapshot(visible.id)?.decision).toBe("allow-once");
      expect(manager.getSnapshot(hidden.id)?.decision).toBeUndefined();

      const hiddenRespond = vi.fn();
      await handlers["plugin.approval.resolve"](
        createMockOptions(
          "plugin.approval.resolve",
          {
            id: hidden.id,
            decision: "deny",
          },
          {
            respond: hiddenRespond,
            client: ownerClient,
          },
        ),
      );
      const error = expectResponseRejected(hiddenRespond);
      expect(error.code).toBe("INVALID_REQUEST");
      expect(error.message).toBe("unknown or expired approval id");
      expect(manager.getSnapshot(hidden.id)?.decision).toBeUndefined();
    });

    it("rejects decisions outside plugin approval allowed decisions", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const record = registerApproval(manager, {
        allowedDecisions: ["allow-once", "deny"],
      });

      const opts = createMockOptions("plugin.approval.resolve", {
        id: record.id,
        decision: "allow-always",
      });
      await handlers["plugin.approval.resolve"](opts);
      const error = expectResponseRejected(opts.respond);
      expect(error.code).toBe("INVALID_REQUEST");
      expect(error.message).toBe("allow-always is unavailable for this plugin approval");
      expect(error.details).toEqual({ allowedDecisions: ["allow-once", "deny"] });
      expect(manager.getSnapshot(record.id)?.decision).toBeUndefined();
>>>>>>> upstream/main
    });

    it("rejects unknown approval id", async () => {
      const handlers = createPluginApprovalHandlers(manager);
      const opts = createMockOptions("plugin.approval.resolve", {
        id: "nonexistent",
        decision: "allow-once",
      });
      await handlers["plugin.approval.resolve"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({
          code: "INVALID_REQUEST",
          message: expect.stringContaining("unknown or expired"),
          details: expect.objectContaining({ reason: "APPROVAL_NOT_FOUND" }),
        }),
      );
=======
      const error = expectResponseRejected(opts.respond);
      expect(error.code).toBe("INVALID_REQUEST");
      expect(error.message).toContain("unknown or expired");
      expect(requireRecord(error.details, "error details").reason).toBe("APPROVAL_NOT_FOUND");
>>>>>>> upstream/main
    });

    it("accepts unique short id prefixes", async () => {
      const handlers = createPluginApprovalHandlers(manager);
<<<<<<< HEAD
      const record = manager.create({ title: "T", description: "D" }, 60_000, "abcdef-1234");
      void manager.register(record, 60_000);
=======
      const record = registerApproval(manager, { id: "abcdef-1234" });
>>>>>>> upstream/main

      const opts = createMockOptions("plugin.approval.resolve", {
        id: "abcdef",
        decision: "allow-always",
      });
      await handlers["plugin.approval.resolve"](opts);
      expect(opts.respond).toHaveBeenCalledWith(true, { ok: true }, undefined);
      expect(manager.getSnapshot(record.id)?.decision).toBe("allow-always");
    });

    it("does not leak candidate ids when prefixes are ambiguous", async () => {
      const handlers = createPluginApprovalHandlers(manager);
<<<<<<< HEAD
      const recordA = manager.create({ title: "A", description: "D" }, 60_000, "plugin:abc-1111");
      const recordB = manager.create({ title: "B", description: "D" }, 60_000, "plugin:abc-2222");
      void manager.register(recordA, 60_000);
      void manager.register(recordB, 60_000);
=======
      registerApproval(manager, { title: "A", id: "plugin:abc-1111" });
      registerApproval(manager, { title: "B", id: "plugin:abc-2222" });
>>>>>>> upstream/main

      const opts = createMockOptions("plugin.approval.resolve", {
        id: "plugin:abc",
        decision: "deny",
      });
      await handlers["plugin.approval.resolve"](opts);
<<<<<<< HEAD
      expect(opts.respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({
          code: "INVALID_REQUEST",
          message: "unknown or expired approval id",
        }),
      );
=======
      const error = expectResponseRejected(opts.respond);
      expect(error.code).toBe("INVALID_REQUEST");
      expect(error.message).toBe("unknown or expired approval id");
>>>>>>> upstream/main
    });
  });
});
