// HTTP endpoint adapter for invoking gateway tools from OpenAI-compatible clients.
import type { IncomingMessage, ServerResponse } from "node:http";
<<<<<<< HEAD
import { runBeforeToolCallHook } from "../agents/pi-tools.before-tool-call.js";
import { resolveToolLoopDetectionConfig } from "../agents/pi-tools.js";
import { isKnownCoreToolId } from "../agents/tool-catalog.js";
import { applyOwnerOnlyToolPolicy } from "../agents/tool-policy.js";
import { ToolInputError } from "../agents/tools/common.js";
import { loadConfig } from "../config/config.js";
import { resolveMainSessionKey } from "../config/sessions.js";
import { logWarn } from "../logger.js";
import { isTestDefaultMemorySlotDisabled } from "../plugins/config-state.js";
import { normalizeMessageChannel } from "../utils/message-channel.js";
import type { AuthRateLimiter } from "./auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import {
  readJsonBodyOrError,
  sendInvalidRequest,
  sendJson,
  sendMethodNotAllowed,
} from "./http-common.js";
import {
  authorizeGatewayHttpRequestOrReply,
=======
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { normalizeMessageChannel } from "../utils/message-channel.js";
import type { AuthRateLimiter } from "./auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import { readJsonBodyOrError, sendJson, sendMethodNotAllowed } from "./http-common.js";
import {
  authorizeScopedGatewayHttpRequestOrReply,
>>>>>>> upstream/main
  getHeader,
  resolveOpenAiCompatibleHttpOperatorScopes,
  resolveOpenAiCompatibleHttpSenderIsOwner,
} from "./http-utils.js";
<<<<<<< HEAD
import { authorizeOperatorScopesForMethod } from "./method-scopes.js";
import { resolveGatewayScopedTools } from "./tool-resolution.js";
=======
import { invokeGatewayTool, type ToolsInvokeInput } from "./tools-invoke-shared.js";
>>>>>>> upstream/main

const DEFAULT_BODY_BYTES = 2 * 1024 * 1024;

/** Handle `/tools/invoke` requests and return false when another HTTP route should handle them. */
export async function handleToolsInvokeHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  opts: {
    auth: ResolvedGatewayAuth;
    maxBodyBytes?: number;
    trustedProxies?: string[];
    allowRealIpFallback?: boolean;
    rateLimiter?: AuthRateLimiter;
  },
): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "bad_request", message: "Invalid request URL" }));
    return true;
  }
  if (url.pathname !== "/tools/invoke") {
    return false;
  }

  if (req.method !== "POST") {
    sendMethodNotAllowed(res, "POST");
    return true;
  }

<<<<<<< HEAD
  const cfg = loadConfig();
  const requestAuth = await authorizeGatewayHttpRequestOrReply({
=======
  // /tools/invoke intentionally uses the same shared-secret HTTP trust model as
  // the OpenAI-compatible APIs: token/password bearer auth is full operator
  // access for the gateway, not a narrower per-request scope boundary.
  const authResult = await authorizeScopedGatewayHttpRequestOrReply({
>>>>>>> upstream/main
    req,
    res,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
    operatorMethod: "agent",
    resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
  });
<<<<<<< HEAD
  if (!requestAuth) {
    return true;
  }

  // /tools/invoke intentionally uses the same shared-secret HTTP trust model as
  // the OpenAI-compatible APIs: token/password bearer auth is full operator
  // access for the gateway, not a narrower per-request scope boundary.
  const requestedScopes = resolveOpenAiCompatibleHttpOperatorScopes(req, requestAuth);
  const scopeAuth = authorizeOperatorScopesForMethod("agent", requestedScopes);
  if (!scopeAuth.allowed) {
    sendJson(res, 403, {
      ok: false,
      error: {
        type: "forbidden",
        message: `missing scope: ${scopeAuth.missingScope}`,
      },
    });
=======
  if (!authResult) {
>>>>>>> upstream/main
    return true;
  }
  const { cfg, requestAuth } = authResult;

  const bodyUnknown = await readJsonBodyOrError(req, res, opts.maxBodyBytes ?? DEFAULT_BODY_BYTES);
  if (bodyUnknown === undefined) {
    return true;
  }
  const body = (bodyUnknown ?? {}) as ToolsInvokeInput;

  // Resolve message channel/account hints (optional headers) for policy inheritance.
  const messageChannel = normalizeMessageChannel(
    getHeader(req, "x-openclaw-message-channel") ?? "",
  );
<<<<<<< HEAD
  const accountId = getHeader(req, "x-openclaw-account-id")?.trim() || undefined;
  const agentTo = getHeader(req, "x-openclaw-message-to")?.trim() || undefined;
  const agentThreadId = getHeader(req, "x-openclaw-thread-id")?.trim() || undefined;
  const { agentId, tools } = resolveGatewayScopedTools({
    cfg,
    sessionKey,
    messageProvider: messageChannel ?? undefined,
    accountId,
    agentTo,
    agentThreadId,
    allowGatewaySubagentBinding: true,
    allowMediaInvokeCommands: true,
    disablePluginTools: isKnownCoreToolId(toolName),
  });
  // Owner semantics intentionally follow the same shared-secret HTTP contract
  // on this direct tool surface; SECURITY.md documents this as designed-as-is.
  const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth);
  const gatewayFiltered = applyOwnerOnlyToolPolicy(tools, senderIsOwner);

  const tool = gatewayFiltered.find((t) => t.name === toolName);
  if (!tool) {
    sendJson(res, 404, {
      ok: false,
      error: { type: "not_found", message: `Tool not available: ${toolName}` },
    });
    return true;
  }

  try {
    const toolCallId = `http-${Date.now()}`;
    const toolArgs = mergeActionIntoArgsIfSupported({
      // oxlint-disable-next-line typescript/no-explicit-any
      toolSchema: (tool as any).parameters,
      action,
      args,
    });
    const hookResult = await runBeforeToolCallHook({
      toolName,
      params: toolArgs,
      toolCallId,
      ctx: {
        agentId,
        sessionKey,
        loopDetection: resolveToolLoopDetectionConfig({ cfg, agentId }),
      },
    });
    if (hookResult.blocked) {
      sendJson(res, 403, {
        ok: false,
        error: { type: "tool_call_blocked", message: hookResult.reason },
      });
      return true;
    }
    // oxlint-disable-next-line typescript/no-explicit-any
    const result = await (tool as any).execute?.(toolCallId, hookResult.params);
    sendJson(res, 200, { ok: true, result });
  } catch (err) {
    const inputStatus = resolveToolInputErrorStatus(err);
    if (inputStatus !== null) {
      sendJson(res, inputStatus, {
        ok: false,
        error: { type: "tool_error", message: getErrorMessage(err) || "invalid tool arguments" },
      });
      return true;
    }
    logWarn(`tools-invoke: tool execution failed: ${String(err)}`);
    sendJson(res, 500, {
      ok: false,
      error: { type: "tool_error", message: "tool execution failed" },
    });
=======
  const accountId = normalizeOptionalString(getHeader(req, "x-openclaw-account-id"));
  const agentTo = normalizeOptionalString(getHeader(req, "x-openclaw-message-to"));
  const agentThreadId = normalizeOptionalString(getHeader(req, "x-openclaw-thread-id"));
  const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth);
  const outcome = await invokeGatewayTool({
    cfg,
    input: body,
    messageChannel: messageChannel ?? undefined,
    accountId,
    agentTo,
    agentThreadId,
    senderIsOwner,
    toolCallIdPrefix: "http",
  });
  if (outcome.ok) {
    sendJson(res, outcome.status, { ok: true, result: outcome.result });
  } else {
    sendJson(res, outcome.status, { ok: false, error: outcome.error });
>>>>>>> upstream/main
  }

  return true;
}
