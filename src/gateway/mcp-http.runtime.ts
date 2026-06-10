<<<<<<< HEAD
import { loadConfig } from "../config/config.js";
=======
// MCP loopback runtime scope cache.
// Resolves Gateway-visible tools for MCP clients with short-lived schema caching.
import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
import type { InboundEventKind } from "../channels/inbound-event/kind.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main
import {
  buildMcpToolSchema,
  type McpLoopbackTool,
  type McpToolSchemaEntry,
} from "./mcp-http.schema.js";
import { resolveGatewayScopedTools } from "./tool-resolution.js";

<<<<<<< HEAD
const TOOL_CACHE_TTL_MS = 30_000;
const NATIVE_TOOL_EXCLUDE = new Set(["read", "write", "edit", "apply_patch", "exec", "process"]);

export type McpLoopbackRuntime = {
  port: number;
  token: string;
};

type CachedScopedTools = {
  tools: McpLoopbackTool[];
  toolSchema: McpToolSchemaEntry[];
  configRef: ReturnType<typeof loadConfig>;
  time: number;
};

let activeRuntime: McpLoopbackRuntime | undefined;

export class McpLoopbackToolCache {
  #entries = new Map<string, CachedScopedTools>();

  resolve(params: {
    cfg: ReturnType<typeof loadConfig>;
    sessionKey: string;
    messageProvider: string | undefined;
    accountId: string | undefined;
  }): CachedScopedTools {
    const cacheKey = [params.sessionKey, params.messageProvider ?? "", params.accountId ?? ""].join(
      "\u0000",
    );
    const now = Date.now();
    const cached = this.#entries.get(cacheKey);
=======
// MCP loopback runtime scopes gateway tools to the current session/channel
// context and caches the expensive schema projection for short bursts of tool
// list/call traffic from the same MCP client.
const TOOL_CACHE_TTL_MS = 30_000;
const TOOL_CACHE_MAX_ENTRIES = 256;
const NATIVE_TOOL_EXCLUDE = new Set(["read", "write", "edit", "apply_patch", "exec", "process"]);

type CachedScopedTools = {
  agentId: string | undefined;
  tools: McpLoopbackTool[];
  toolSchema: McpToolSchemaEntry[];
  configRef: OpenClawConfig;
  time: number;
};

type McpLoopbackScopeParams = {
  cfg: OpenClawConfig;
  sessionKey: string;
  messageProvider: string | undefined;
  currentChannelId: string | undefined;
  currentThreadTs: string | undefined;
  currentMessageId: string | number | undefined;
  currentInboundAudio: boolean | undefined;
  accountId: string | undefined;
  inboundEventKind: InboundEventKind | undefined;
  sourceReplyDeliveryMode: SourceReplyDeliveryMode | undefined;
  senderIsOwner: boolean | undefined;
};

/** Resolves loopback-visible tools after applying gateway scope and native-tool exclusions. */
export function resolveMcpLoopbackScopedTools(params: McpLoopbackScopeParams): {
  agentId: string | undefined;
  tools: McpLoopbackTool[];
} {
  const scoped = resolveGatewayScopedTools({
    ...params,
    surface: "loopback",
    excludeToolNames: NATIVE_TOOL_EXCLUDE,
  });
  return {
    agentId: scoped.agentId,
    tools: scoped.tools,
  };
}

/** Short-lived cache for loopback tool lists keyed by session/channel context. */
export class McpLoopbackToolCache {
  #entries = new Map<string, CachedScopedTools>();

  resolve(params: McpLoopbackScopeParams): CachedScopedTools {
    const cacheKey = [
      params.sessionKey,
      params.messageProvider ?? "",
      params.currentChannelId ?? "",
      params.currentThreadTs ?? "",
      params.currentMessageId != null ? String(params.currentMessageId) : "",
      params.currentInboundAudio === true ? "audio" : "no-audio",
      params.accountId ?? "",
      params.inboundEventKind ?? "",
      params.sourceReplyDeliveryMode ?? "",
      params.senderIsOwner === true
        ? "owner"
        : params.senderIsOwner === false
          ? "non-owner"
          : "unknown-owner",
    ].join("\u0000");
    const now = Date.now();
    for (const [key, entry] of this.#entries) {
      if (now - entry.time >= TOOL_CACHE_TTL_MS) {
        this.#entries.delete(key);
      }
    }
    const cached = this.#entries.get(cacheKey);
    // Config object identity is part of the cache contract so explicit gateway
    // reloads invalidate tool scope and schema without filesystem polling.
>>>>>>> upstream/main
    if (cached && cached.configRef === params.cfg && now - cached.time < TOOL_CACHE_TTL_MS) {
      return cached;
    }

<<<<<<< HEAD
    const next = resolveGatewayScopedTools({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      messageProvider: params.messageProvider,
      accountId: params.accountId,
      excludeToolNames: NATIVE_TOOL_EXCLUDE,
    });
    const nextEntry: CachedScopedTools = {
=======
    const next = resolveMcpLoopbackScopedTools(params);
    const nextEntry: CachedScopedTools = {
      agentId: next.agentId,
>>>>>>> upstream/main
      tools: next.tools,
      toolSchema: buildMcpToolSchema(next.tools),
      configRef: params.cfg,
      time: now,
    };
    this.#entries.set(cacheKey, nextEntry);
<<<<<<< HEAD
    for (const [key, entry] of this.#entries) {
      if (now - entry.time >= TOOL_CACHE_TTL_MS) {
        this.#entries.delete(key);
      }
=======
    while (this.#entries.size > TOOL_CACHE_MAX_ENTRIES) {
      const oldestKey = this.#entries.keys().next().value;
      if (oldestKey === undefined) {
        break;
      }
      this.#entries.delete(oldestKey);
>>>>>>> upstream/main
    }
    return nextEntry;
  }
}
<<<<<<< HEAD

export function getActiveMcpLoopbackRuntime(): McpLoopbackRuntime | undefined {
  return activeRuntime ? { ...activeRuntime } : undefined;
}

export function setActiveMcpLoopbackRuntime(runtime: McpLoopbackRuntime): void {
  activeRuntime = { ...runtime };
}

export function clearActiveMcpLoopbackRuntime(token: string): void {
  if (activeRuntime?.token === token) {
    activeRuntime = undefined;
  }
}

export function createMcpLoopbackServerConfig(port: number) {
  return {
    mcpServers: {
      openclaw: {
        type: "http",
        url: `http://127.0.0.1:${port}/mcp`,
        headers: {
          Authorization: "Bearer ${OPENCLAW_MCP_TOKEN}",
          "x-session-key": "${OPENCLAW_MCP_SESSION_KEY}",
          "x-openclaw-agent-id": "${OPENCLAW_MCP_AGENT_ID}",
          "x-openclaw-account-id": "${OPENCLAW_MCP_ACCOUNT_ID}",
          "x-openclaw-message-channel": "${OPENCLAW_MCP_MESSAGE_CHANNEL}",
        },
      },
    },
  };
}
=======
>>>>>>> upstream/main
