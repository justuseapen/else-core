<<<<<<< HEAD
import { randomUUID } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveGatewayClientBootstrap } from "../gateway/client-bootstrap.js";
import { GatewayClient } from "../gateway/client.js";
import { APPROVALS_SCOPE, READ_SCOPE, WRITE_SCOPE } from "../gateway/method-scopes.js";
import type { EventFrame } from "../gateway/protocol/index.js";
import { extractFirstTextBlock } from "../shared/chat-message-content.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
=======
// Channel MCP bridge translates MCP tool calls into channel runtime operations.
import { randomUUID } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "@openclaw/normalization-core/string-coerce";
import type { EventFrame } from "../../packages/gateway-protocol/src/index.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { GatewayClient } from "../gateway/client.js";
import { extractFirstTextBlock } from "../shared/chat-message-content.js";
>>>>>>> upstream/main
import { VERSION } from "../version.js";
import type {
  ApprovalDecision,
  ApprovalKind,
  ChatHistoryResult,
  ClaudeChannelMode,
<<<<<<< HEAD
  ClaudePermissionRequest,
  ConversationDescriptor,
  PendingApproval,
  QueueEvent,
=======
  ConversationDescriptor,
  PendingApproval,
  QueueEvent,
  SessionDescribeResult,
>>>>>>> upstream/main
  SessionListResult,
  SessionMessagePayload,
  WaitFilter,
} from "./channel-shared.js";
import { matchEventFilter, normalizeApprovalId, toConversation, toText } from "./channel-shared.js";

<<<<<<< HEAD
=======
/**
 * Runtime bridge between MCP tools and the OpenClaw Gateway channel APIs.
 *
 * The bridge owns readiness, event cursoring, pending approval state, and the
 * narrow request methods that channel MCP tools expose to external clients.
 */
>>>>>>> upstream/main
type PendingWaiter = {
  filter: WaitFilter;
  resolve: (value: QueueEvent | null) => void;
  timeout: NodeJS.Timeout | null;
};

<<<<<<< HEAD
=======
type PendingApprovalEntry = {
  approval: PendingApproval;
  trackedAtMs: number;
};

>>>>>>> upstream/main
type ServerNotification = {
  method: string;
  params?: Record<string, unknown>;
};

const CLAUDE_PERMISSION_REPLY_RE = /^(yes|no)\s+([a-km-z]{5})$/i;
const QUEUE_LIMIT = 1_000;
<<<<<<< HEAD

=======
const PENDING_CLAUDE_PERMISSION_TTL_MS = 60 * 60 * 1_000;
const PENDING_APPROVAL_DEFAULT_TTL_MS = 30 * 60 * 1_000;
const PENDING_SWEEP_INTERVAL_MS = 5 * 60 * 1_000;

/** Connects the MCP server surface to a Gateway client and queues channel events for polling. */
>>>>>>> upstream/main
export class OpenClawChannelBridge {
  private gateway: GatewayClient | null = null;
  private readonly verbose: boolean;
  private readonly claudeChannelMode: ClaudeChannelMode;
  private readonly queue: QueueEvent[] = [];
  private readonly pendingWaiters = new Set<PendingWaiter>();
<<<<<<< HEAD
  private readonly pendingClaudePermissions = new Map<string, ClaudePermissionRequest>();
  private readonly pendingApprovals = new Map<string, PendingApproval>();
=======
  private readonly pendingClaudePermissions = new Map<string, number>();
  private readonly pendingApprovals = new Map<string, PendingApprovalEntry>();
  private pendingSweepInterval: NodeJS.Timeout | null = null;
>>>>>>> upstream/main
  private server: McpServer | null = null;
  private cursor = 0;
  private closed = false;
  private ready = false;
  private started = false;
<<<<<<< HEAD
=======
  private retryingInitialConnect = false;
>>>>>>> upstream/main
  private readonly readyPromise: Promise<void>;
  private resolveReady!: () => void;
  private rejectReady!: (error: Error) => void;
  private readySettled = false;

  constructor(
    private readonly cfg: OpenClawConfig,
    private readonly params: {
      gatewayUrl?: string;
      gatewayToken?: string;
      gatewayPassword?: string;
      claudeChannelMode: ClaudeChannelMode;
      verbose: boolean;
    },
  ) {
    this.verbose = params.verbose;
    this.claudeChannelMode = params.claudeChannelMode;
    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
  }

<<<<<<< HEAD
=======
  /** Attach the MCP server used for outbound protocol notifications. */
>>>>>>> upstream/main
  setServer(server: McpServer): void {
    this.server = server;
  }

<<<<<<< HEAD
=======
  /** Start the Gateway connection and resolve only after session subscription succeeds. */
>>>>>>> upstream/main
  async start(): Promise<void> {
    if (this.started) {
      await this.readyPromise;
      return;
    }
    this.started = true;
<<<<<<< HEAD
=======
    const [
      { resolveGatewayClientBootstrap },
      { GatewayClient: GatewayClientCtor },
      { startGatewayClientWhenEventLoopReady },
      { APPROVALS_SCOPE, READ_SCOPE, WRITE_SCOPE },
      { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES },
    ] = await Promise.all([
      import("../gateway/client-bootstrap.js"),
      import("../gateway/client.js"),
      import("../gateway/client-start-readiness.js"),
      import("../gateway/method-scopes.js"),
      import("../../packages/gateway-protocol/src/client-info.js"),
    ]);
>>>>>>> upstream/main
    const bootstrap = await resolveGatewayClientBootstrap({
      config: this.cfg,
      gatewayUrl: this.params.gatewayUrl,
      explicitAuth: {
        token: this.params.gatewayToken,
        password: this.params.gatewayPassword,
      },
      env: process.env,
    });
    if (this.closed) {
      this.resolveReadyOnce();
      return;
    }

<<<<<<< HEAD
    this.gateway = new GatewayClient({
      url: bootstrap.url,
      token: bootstrap.auth.token,
      password: bootstrap.auth.password,
=======
    this.gateway = new GatewayClientCtor({
      url: bootstrap.url,
      token: bootstrap.auth.token,
      password: bootstrap.auth.password,
      preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
>>>>>>> upstream/main
      clientName: GATEWAY_CLIENT_NAMES.CLI,
      clientDisplayName: "OpenClaw MCP",
      clientVersion: VERSION,
      mode: GATEWAY_CLIENT_MODES.CLI,
      scopes: [READ_SCOPE, WRITE_SCOPE, APPROVALS_SCOPE],
<<<<<<< HEAD
=======
      requestTimeoutMs: 180_000,
>>>>>>> upstream/main
      onEvent: (event) => {
        void this.handleGatewayEvent(event);
      },
      onHelloOk: () => {
<<<<<<< HEAD
        void this.handleHelloOk();
      },
      onConnectError: (error) => {
        this.rejectReadyOnce(error instanceof Error ? error : new Error(String(error)));
      },
      onClose: (code, reason) => {
        if (!this.ready && !this.closed) {
          this.rejectReadyOnce(new Error(`gateway closed before ready (${code}): ${reason}`));
        }
      },
    });
    this.gateway.start();
    await this.readyPromise;
  }

=======
        this.retryingInitialConnect = false;
        void this.handleHelloOk();
      },
      onConnectError: (error) => {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        if (shouldRetryInitialMcpGatewayConnect(normalizedError)) {
          this.retryingInitialConnect = true;
          return;
        }
        this.rejectReadyOnce(normalizedError);
      },
      onClose: (code, reason) => {
        if (!this.ready && !this.closed && !this.retryingInitialConnect) {
          this.rejectReadyOnce(new Error(`gateway closed before ready (${code}): ${reason}`));
        }
        this.retryingInitialConnect = false;
      },
    });
    const readiness = await startGatewayClientWhenEventLoopReady(this.gateway, {
      clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs },
    });
    if (!readiness.ready) {
      this.rejectReadyOnce(new Error("gateway event loop readiness timeout"));
    }
    await this.readyPromise;
  }

  /** Wait until the bridge has subscribed to Gateway session events. */
>>>>>>> upstream/main
  async waitUntilReady(): Promise<void> {
    await this.readyPromise;
  }

<<<<<<< HEAD
=======
  /** Stop Gateway IO and release waiters so MCP shutdown cannot hang on pending polls. */
>>>>>>> upstream/main
  async close(): Promise<void> {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.resolveReadyOnce();
<<<<<<< HEAD
=======
    if (this.pendingSweepInterval) {
      clearInterval(this.pendingSweepInterval);
      this.pendingSweepInterval = null;
    }
    this.pendingClaudePermissions.clear();
    this.pendingApprovals.clear();
>>>>>>> upstream/main
    for (const waiter of this.pendingWaiters) {
      if (waiter.timeout) {
        clearTimeout(waiter.timeout);
      }
      waiter.resolve(null);
    }
    this.pendingWaiters.clear();
    const gateway = this.gateway;
    this.gateway = null;
    await gateway?.stopAndWait().catch(() => undefined);
  }

<<<<<<< HEAD
=======
  /** List Gateway sessions that have enough routing metadata to be channel conversations. */
>>>>>>> upstream/main
  async listConversations(params?: {
    limit?: number;
    search?: string;
    channel?: string;
    includeDerivedTitles?: boolean;
    includeLastMessage?: boolean;
  }): Promise<ConversationDescriptor[]> {
    await this.waitUntilReady();
<<<<<<< HEAD
    const response = await this.requestGateway<SessionListResult>("sessions.list", {
=======
    const response: SessionListResult = await this.requestGateway("sessions.list", {
>>>>>>> upstream/main
      limit: params?.limit ?? 50,
      search: params?.search,
      includeDerivedTitles: params?.includeDerivedTitles ?? true,
      includeLastMessage: params?.includeLastMessage ?? true,
    });
<<<<<<< HEAD
    const requestedChannel = toText(params?.channel)?.toLowerCase();
=======
    const requestedChannel = normalizeOptionalLowercaseString(params?.channel);
>>>>>>> upstream/main
    return (response.sessions ?? [])
      .map(toConversation)
      .filter((conversation): conversation is ConversationDescriptor => Boolean(conversation))
      .filter((conversation) =>
<<<<<<< HEAD
        requestedChannel ? conversation.channel.toLowerCase() === requestedChannel : true,
      );
  }

=======
        requestedChannel
          ? normalizeLowercaseStringOrEmpty(conversation.channel) === requestedChannel
          : true,
      );
  }

  /** Resolve one conversation by its stable session key. */
>>>>>>> upstream/main
  async getConversation(sessionKey: string): Promise<ConversationDescriptor | null> {
    const normalizedSessionKey = sessionKey.trim();
    if (!normalizedSessionKey) {
      return null;
    }
<<<<<<< HEAD
    const conversations = await this.listConversations({ limit: 500, includeLastMessage: true });
    return (
      conversations.find((conversation) => conversation.sessionKey === normalizedSessionKey) ?? null
    );
  }

=======
    await this.waitUntilReady();
    const response: SessionDescribeResult = await this.requestGateway("sessions.describe", {
      key: normalizedSessionKey,
      includeDerivedTitles: true,
      includeLastMessage: true,
    });
    return response.session ? toConversation(response.session) : null;
  }

  /** Read recent history through the Gateway session API. */
>>>>>>> upstream/main
  async readMessages(
    sessionKey: string,
    limit = 20,
  ): Promise<NonNullable<ChatHistoryResult["messages"]>> {
    await this.waitUntilReady();
<<<<<<< HEAD
    const response = await this.requestGateway<ChatHistoryResult>("chat.history", {
      sessionKey,
=======
    const response: ChatHistoryResult = await this.requestGateway("sessions.get", {
      key: sessionKey,
>>>>>>> upstream/main
      limit,
    });
    return response.messages ?? [];
  }

<<<<<<< HEAD
=======
  /** Send a reply using the same channel route stored on the conversation. */
>>>>>>> upstream/main
  async sendMessage(params: {
    sessionKey: string;
    text: string;
  }): Promise<Record<string, unknown>> {
    const conversation = await this.getConversation(params.sessionKey);
    if (!conversation) {
      throw new Error(`Conversation not found for session ${params.sessionKey}`);
    }
    return await this.requestGateway("send", {
      to: conversation.to,
      channel: conversation.channel,
      accountId: conversation.accountId,
      threadId: conversation.threadId == null ? undefined : String(conversation.threadId),
      message: params.text,
      sessionKey: conversation.sessionKey,
      idempotencyKey: randomUUID(),
    });
  }

<<<<<<< HEAD
  listPendingApprovals(): PendingApproval[] {
    return [...this.pendingApprovals.values()].toSorted((a, b) => {
      return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
    });
  }

=======
  /** Return locally tracked approval requests that are still open. */
  listPendingApprovals(): PendingApproval[] {
    this.sweepPendingExpired();
    return [...this.pendingApprovals.values()]
      .map((entry) => entry.approval)
      .toSorted((a, b) => {
        return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
      });
  }

  /** Forward an MCP approval decision to the matching Gateway approval resolver. */
>>>>>>> upstream/main
  async respondToApproval(params: {
    kind: ApprovalKind;
    id: string;
    decision: ApprovalDecision;
  }): Promise<Record<string, unknown>> {
    if (params.kind === "exec") {
      return await this.requestGateway("exec.approval.resolve", {
        id: params.id,
        decision: params.decision,
      });
    }
    return await this.requestGateway("plugin.approval.resolve", {
      id: params.id,
      decision: params.decision,
    });
  }

<<<<<<< HEAD
=======
  /** Poll queued events after a cursor without consuming them. */
>>>>>>> upstream/main
  pollEvents(filter: WaitFilter, limit = 20): { events: QueueEvent[]; nextCursor: number } {
    const events = this.queue.filter((event) => matchEventFilter(event, filter)).slice(0, limit);
    const nextCursor = events.at(-1)?.cursor ?? filter.afterCursor;
    return { events, nextCursor };
  }

<<<<<<< HEAD
=======
  /** Wait for the next matching event, resolving null on timeout or bridge close. */
>>>>>>> upstream/main
  async waitForEvent(filter: WaitFilter, timeoutMs = 30_000): Promise<QueueEvent | null> {
    const existing = this.queue.find((event) => matchEventFilter(event, filter));
    if (existing) {
      return existing;
    }
    return await new Promise<QueueEvent | null>((resolve) => {
      const waiter: PendingWaiter = {
        filter,
        resolve: (value) => {
          this.pendingWaiters.delete(waiter);
          resolve(value);
        },
        timeout: null,
      };
      if (timeoutMs > 0) {
        waiter.timeout = setTimeout(() => {
          waiter.resolve(null);
        }, timeoutMs);
      }
      this.pendingWaiters.add(waiter);
    });
  }

<<<<<<< HEAD
=======
  /** Accept a Claude channel permission notification and expose it through event polling. */
>>>>>>> upstream/main
  async handleClaudePermissionRequest(params: {
    requestId: string;
    toolName: string;
    description: string;
    inputPreview: string;
  }): Promise<void> {
<<<<<<< HEAD
    this.pendingClaudePermissions.set(params.requestId, {
      toolName: params.toolName,
      description: params.description,
      inputPreview: params.inputPreview,
    });
=======
    if (this.closed) {
      return;
    }
    this.pendingClaudePermissions.set(params.requestId, Date.now());
    this.ensurePendingSweeper();
>>>>>>> upstream/main
    this.enqueue({
      cursor: this.nextCursor(),
      type: "claude_permission_request",
      requestId: params.requestId,
      toolName: params.toolName,
      description: params.description,
      inputPreview: params.inputPreview,
    });
    if (this.verbose) {
      process.stderr.write(`openclaw mcp: pending Claude permission ${params.requestId}\n`);
    }
  }

  private async requestGateway<T = Record<string, unknown>>(
    method: string,
    params: Record<string, unknown>,
  ): Promise<T> {
    if (!this.gateway) {
      throw new Error("Gateway client is not ready");
    }
    return await this.gateway.request<T>(method, params);
  }

  private async sendNotification(notification: ServerNotification): Promise<void> {
    if (!this.server || this.closed) {
      return;
    }
    try {
      await this.server.server.notification(notification);
    } catch (error) {
      if (this.verbose && !this.closed) {
        process.stderr.write(
          `openclaw mcp: notification ${notification.method} failed: ${String(error)}\n`,
        );
      }
    }
  }

  private async handleHelloOk(): Promise<void> {
    try {
      await this.requestGateway("sessions.subscribe", {});
      this.ready = true;
      this.resolveReadyOnce();
    } catch (error) {
      this.rejectReadyOnce(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private resolveReadyOnce(): void {
    if (this.readySettled) {
      return;
    }
    this.readySettled = true;
    this.resolveReady();
  }

  private rejectReadyOnce(error: Error): void {
    if (this.readySettled) {
      return;
    }
    this.readySettled = true;
    this.rejectReady(error);
  }

  private nextCursor(): number {
    this.cursor += 1;
    return this.cursor;
  }

  private enqueue(event: QueueEvent): void {
    this.queue.push(event);
<<<<<<< HEAD
=======
    // Retain enough history for cursor polling without letting a long MCP session grow unbounded.
>>>>>>> upstream/main
    while (this.queue.length > QUEUE_LIMIT) {
      this.queue.shift();
    }
    for (const waiter of this.pendingWaiters) {
      if (!matchEventFilter(event, waiter.filter)) {
        continue;
      }
      if (waiter.timeout) {
        clearTimeout(waiter.timeout);
      }
      waiter.resolve(event);
    }
  }

  private trackApproval(kind: ApprovalKind, payload: Record<string, unknown>): void {
<<<<<<< HEAD
=======
    if (this.closed) {
      return;
    }
>>>>>>> upstream/main
    const id = normalizeApprovalId(payload.id);
    if (!id) {
      return;
    }
    this.pendingApprovals.set(id, {
<<<<<<< HEAD
      kind,
      id,
      request:
        payload.request && typeof payload.request === "object"
          ? (payload.request as Record<string, unknown>)
          : undefined,
      createdAtMs: typeof payload.createdAtMs === "number" ? payload.createdAtMs : undefined,
      expiresAtMs: typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : undefined,
    });
=======
      approval: {
        kind,
        id,
        request:
          payload.request && typeof payload.request === "object"
            ? (payload.request as Record<string, unknown>)
            : undefined,
        createdAtMs: typeof payload.createdAtMs === "number" ? payload.createdAtMs : undefined,
        expiresAtMs: typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : undefined,
      },
      trackedAtMs: Date.now(),
    });
    this.ensurePendingSweeper();
  }

  private ensurePendingSweeper(): void {
    if (this.pendingSweepInterval || this.closed) {
      return;
    }
    this.pendingSweepInterval = setInterval(() => {
      this.sweepPendingExpired();
    }, PENDING_SWEEP_INTERVAL_MS);
    // Pending approval cleanup must not keep a stdio MCP process alive after its client exits.
    this.pendingSweepInterval.unref();
  }

  private sweepPendingExpired(now: number = Date.now()): void {
    // Claude permissions have no Gateway resolution event, so they expire by local observation time.
    for (const [id, createdAtMs] of this.pendingClaudePermissions) {
      if (now - createdAtMs >= PENDING_CLAUDE_PERMISSION_TTL_MS) {
        this.pendingClaudePermissions.delete(id);
      }
    }
    for (const [id, entry] of this.pendingApprovals) {
      const expiry =
        entry.approval.expiresAtMs ?? entry.trackedAtMs + PENDING_APPROVAL_DEFAULT_TTL_MS;
      if (now >= expiry) {
        this.pendingApprovals.delete(id);
      }
    }
    if (
      this.pendingSweepInterval &&
      this.pendingClaudePermissions.size === 0 &&
      this.pendingApprovals.size === 0
    ) {
      clearInterval(this.pendingSweepInterval);
      this.pendingSweepInterval = null;
    }
>>>>>>> upstream/main
  }

  private resolveTrackedApproval(payload: Record<string, unknown>): void {
    const id = normalizeApprovalId(payload.id);
    if (id) {
      this.pendingApprovals.delete(id);
    }
  }

  private async handleGatewayEvent(event: EventFrame): Promise<void> {
    switch (event.event) {
      case "session.message":
        await this.handleSessionMessageEvent(event.payload as SessionMessagePayload);
        return;
      case "exec.approval.requested": {
        const raw = (event.payload ?? {}) as Record<string, unknown>;
        this.trackApproval("exec", raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "exec_approval_requested",
          raw,
        });
        return;
      }
      case "exec.approval.resolved": {
        const raw = (event.payload ?? {}) as Record<string, unknown>;
        this.resolveTrackedApproval(raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "exec_approval_resolved",
          raw,
        });
        return;
      }
      case "plugin.approval.requested": {
        const raw = (event.payload ?? {}) as Record<string, unknown>;
        this.trackApproval("plugin", raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "plugin_approval_requested",
          raw,
        });
        return;
      }
      case "plugin.approval.resolved": {
        const raw = (event.payload ?? {}) as Record<string, unknown>;
        this.resolveTrackedApproval(raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "plugin_approval_resolved",
          raw,
        });
      }
    }
  }

  private async handleSessionMessageEvent(payload: SessionMessagePayload): Promise<void> {
    const sessionKey = toText(payload.sessionKey);
    if (!sessionKey) {
      return;
    }
    const conversation =
      toConversation({
        key: sessionKey,
        lastChannel: toText(payload.lastChannel),
        lastTo: toText(payload.lastTo),
        lastAccountId: toText(payload.lastAccountId),
        lastThreadId: payload.lastThreadId,
      }) ?? undefined;
    const role = toText(payload.message?.role);
    const text = extractFirstTextBlock(payload.message);
    const permissionMatch = text ? CLAUDE_PERMISSION_REPLY_RE.exec(text) : null;
    if (permissionMatch) {
<<<<<<< HEAD
      const requestId = permissionMatch[2]?.toLowerCase();
=======
      const requestId = normalizeOptionalLowercaseString(permissionMatch[2]);
>>>>>>> upstream/main
      if (requestId && this.pendingClaudePermissions.has(requestId)) {
        this.pendingClaudePermissions.delete(requestId);
        await this.sendNotification({
          method: "notifications/claude/channel/permission",
          params: {
            request_id: requestId,
<<<<<<< HEAD
            behavior: permissionMatch[1]?.toLowerCase().startsWith("y") ? "allow" : "deny",
=======
            behavior: normalizeLowercaseStringOrEmpty(permissionMatch[1]).startsWith("y")
              ? "allow"
              : "deny",
>>>>>>> upstream/main
          },
        });
        return;
      }
    }

    this.enqueue({
      cursor: this.nextCursor(),
      type: "message",
      sessionKey,
      conversation,
      messageId: toText(payload.messageId),
      messageSeq: typeof payload.messageSeq === "number" ? payload.messageSeq : undefined,
      role,
      text,
      raw: payload,
    });

    if (!this.shouldEmitClaudeChannel(role, conversation)) {
      return;
    }
    await this.sendNotification({
      method: "notifications/claude/channel",
      params: {
        content: text ?? "[non-text message]",
        meta: {
          session_key: sessionKey,
          channel: conversation?.channel ?? "",
          to: conversation?.to ?? "",
          account_id: conversation?.accountId ?? "",
          thread_id: conversation?.threadId == null ? "" : String(conversation.threadId),
          message_id: toText(payload.messageId) ?? "",
        },
      },
    });
  }

  private shouldEmitClaudeChannel(
    role: string | undefined,
    conversation: ConversationDescriptor | undefined,
  ): boolean {
    if (this.claudeChannelMode === "off") {
      return false;
    }
    if (role !== "user") {
      return false;
    }
    return Boolean(conversation);
  }
}
<<<<<<< HEAD
=======

/** Decide whether startup should wait for a retryable Gateway connect failure to recover. */
export function shouldRetryInitialMcpGatewayConnect(error: Error): boolean {
  if (
    error.name === "GatewayClientRequestError" &&
    "retryable" in error &&
    typeof error.retryable === "boolean"
  ) {
    return error.retryable;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes("gateway request timeout for connect") ||
    message.includes("gateway connect challenge timeout")
  );
}
>>>>>>> upstream/main
