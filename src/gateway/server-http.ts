// Gateway HTTP server routes control UI, OpenAI-compatible APIs, plugin HTTP
// surfaces, hooks, readiness, auth, and WebSocket upgrades.
import {
  createServer as createHttpServer,
  type Server as HttpServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { createServer as createHttpsServer } from "node:https";
import type { TlsOptions } from "node:tls";
import type { WebSocketServer } from "ws";
<<<<<<< HEAD
import { resolveAgentAvatar } from "../agents/identity-avatar.js";
import { CANVAS_WS_PATH, handleA2uiHttpRequest } from "../canvas-host/a2ui.js";
import type { CanvasHostHandler } from "../canvas-host/server.js";
import { listBundledChannelPlugins } from "../channels/plugins/bundled.js";
import { loadConfig } from "../config/config.js";
import type { createSubsystemLogger } from "../logging/subsystem.js";
import { resolveHookExternalContentSource as resolveHookExternalContentSourceFromSession } from "../security/external-content.js";
import { safeEqualSecret } from "../security/secret-equal.js";
=======
import { resolveBundledChannelGatewayAuthBypassPaths } from "../channels/plugins/gateway-auth-bypass.js";
import { getRuntimeConfig } from "../config/io.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main
import {
  createDiagnosticTraceContext,
  runWithDiagnosticTraceContext,
} from "../infra/diagnostic-trace-context.js";
import { resolveAssistantIdentity } from "./assistant-identity.js";
import type { AuthRateLimiter } from "./auth-rate-limit.js";
import {
  authorizeHttpGatewayConnect,
  isLocalDirectRequest,
  type GatewayAuthResult,
  type ResolvedGatewayAuth,
} from "./auth.js";
<<<<<<< HEAD
import { normalizeCanvasScopedUrl } from "./canvas-capability.js";
import {
  handleControlUiAvatarRequest,
  handleControlUiHttpRequest,
  type ControlUiRootState,
} from "./control-ui.js";
import { handleOpenAiEmbeddingsHttpRequest } from "./embeddings-http.js";
import { applyHookMappings } from "./hooks-mapping.js";
import {
  extractHookToken,
  getHookAgentPolicyError,
  getHookChannelError,
  getHookSessionKeyPrefixError,
  type HookAgentDispatchPayload,
  type HooksConfigResolved,
  isHookAgentAllowed,
  isSessionKeyAllowedByPrefix,
  normalizeAgentPayload,
  normalizeHookHeaders,
  resolveHookIdempotencyKey,
  normalizeWakePayload,
  readJsonBody,
  normalizeHookDispatchSessionKey,
  resolveHookSessionKey,
  resolveHookTargetAgentId,
  resolveHookChannel,
  resolveHookDeliver,
} from "./hooks.js";
import { sendGatewayAuthFailure, setDefaultSecurityHeaders } from "./http-common.js";
import {
  authorizeGatewayHttpRequestOrReply,
  getBearerToken,
  resolveHttpBrowserOriginPolicy,
} from "./http-utils.js";
import { handleOpenAiModelsHttpRequest } from "./models-http.js";
import { resolveRequestClientIp } from "./net.js";
import { handleOpenAiHttpRequest } from "./openai-http.js";
import { handleOpenResponsesHttpRequest } from "./openresponses-http.js";
import { DEDUPE_MAX, DEDUPE_TTL_MS } from "./server-constants.js";
import { authorizeCanvasRequest, isCanvasPath } from "./server/http-auth.js";
import { resolvePluginRouteRuntimeOperatorScopes } from "./server/plugin-route-runtime-scopes.js";
=======
import type { ControlUiRootState } from "./control-ui.js";
import type { AuthorizedGatewayHttpRequest } from "./http-auth-utils.js";
import { sendGatewayAuthFailure, setDefaultSecurityHeaders } from "./http-common.js";
import { resolveRequestClientIp } from "./net.js";
import {
  normalizePluginNodeCapabilityScopedUrl,
  type PluginNodeCapabilitySurface,
} from "./plugin-node-capability.js";
import type { HooksRequestHandler } from "./server/hooks-request-handler.js";
>>>>>>> upstream/main
import {
  isProtectedPluginRoutePathFromContext,
  resolvePluginRoutePathContext,
  type PluginRoutePathContext,
<<<<<<< HEAD
} from "./server/plugins-http.js";
=======
} from "./server/plugins-http/path-context.js";
>>>>>>> upstream/main
import type { PreauthConnectionBudget } from "./server/preauth-connection-budget.js";
import type { ReadinessChecker } from "./server/readiness.js";
import type { GatewayWsClient } from "./server/ws-types.js";

type PluginHttpRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  pathContext?: PluginRoutePathContext,
  dispatchContext?: {
    gatewayAuthSatisfied?: boolean;
    gatewayRequestAuth?: AuthorizedGatewayHttpRequest;
    gatewayRequestOperatorScopes?: readonly string[];
  },
) => Promise<boolean>;

type PluginHttpUpgradeHandler = (
  req: IncomingMessage,
  socket: import("node:stream").Duplex,
  head: Buffer,
  pathContext?: PluginRoutePathContext,
  dispatchContext?: {
    gatewayAuthSatisfied?: boolean;
    gatewayRequestAuth?: AuthorizedGatewayHttpRequest;
    gatewayRequestOperatorScopes?: readonly string[];
  },
) => Promise<boolean>;

type ResolvePluginNodeCapabilityRoute = (
  pathContext: PluginRoutePathContext,
) => PluginNodeCapabilitySurface | undefined;

let identityAvatarModulePromise: Promise<typeof import("../agents/identity-avatar.js")> | undefined;
let controlUiModulePromise: Promise<typeof import("./control-ui.js")> | undefined;
let embeddingsHttpModulePromise: Promise<typeof import("./embeddings-http.js")> | undefined;
let managedImageAttachmentsModulePromise:
  | Promise<typeof import("./managed-image-attachments.js")>
  | undefined;
let modelsHttpModulePromise: Promise<typeof import("./models-http.js")> | undefined;
let openAiHttpModulePromise: Promise<typeof import("./openai-http.js")> | undefined;
let openResponsesHttpModulePromise: Promise<typeof import("./openresponses-http.js")> | undefined;
let sessionHistoryHttpModulePromise:
  | Promise<typeof import("./sessions-history-http.js")>
  | undefined;
let sessionKillHttpModulePromise: Promise<typeof import("./session-kill-http.js")> | undefined;
let toolsInvokeHttpModulePromise: Promise<typeof import("./tools-invoke-http.js")> | undefined;
let pluginNodeCapabilityAuthModulePromise:
  | Promise<typeof import("./server/plugin-node-capability-auth.js")>
  | undefined;
let httpAuthUtilsModulePromise: Promise<typeof import("./http-auth-utils.js")> | undefined;
let pluginRouteRuntimeScopesModulePromise:
  | Promise<typeof import("./server/plugin-route-runtime-scopes.js")>
  | undefined;

function getIdentityAvatarModule() {
  identityAvatarModulePromise ??= import("../agents/identity-avatar.js");
  return identityAvatarModulePromise;
}

function getControlUiModule() {
  controlUiModulePromise ??= import("./control-ui.js");
  return controlUiModulePromise;
}

function getEmbeddingsHttpModule() {
  embeddingsHttpModulePromise ??= import("./embeddings-http.js");
  return embeddingsHttpModulePromise;
}

function getManagedImageAttachmentsModule() {
  managedImageAttachmentsModulePromise ??= import("./managed-image-attachments.js");
  return managedImageAttachmentsModulePromise;
}

function getModelsHttpModule() {
  modelsHttpModulePromise ??= import("./models-http.js");
  return modelsHttpModulePromise;
}

function getOpenAiHttpModule() {
  openAiHttpModulePromise ??= import("./openai-http.js");
  return openAiHttpModulePromise;
}

function getOpenResponsesHttpModule() {
  openResponsesHttpModulePromise ??= import("./openresponses-http.js");
  return openResponsesHttpModulePromise;
}

function getSessionHistoryHttpModule() {
  sessionHistoryHttpModulePromise ??= import("./sessions-history-http.js");
  return sessionHistoryHttpModulePromise;
}

function getSessionKillHttpModule() {
  sessionKillHttpModulePromise ??= import("./session-kill-http.js");
  return sessionKillHttpModulePromise;
}

function getToolsInvokeHttpModule() {
  toolsInvokeHttpModulePromise ??= import("./tools-invoke-http.js");
  return toolsInvokeHttpModulePromise;
}

function getPluginNodeCapabilityAuthModule() {
  pluginNodeCapabilityAuthModulePromise ??= import("./server/plugin-node-capability-auth.js");
  return pluginNodeCapabilityAuthModulePromise;
}

function getHttpAuthUtilsModule() {
  httpAuthUtilsModulePromise ??= import("./http-auth-utils.js");
  return httpAuthUtilsModulePromise;
}

function getPluginRouteRuntimeScopesModule() {
  pluginRouteRuntimeScopesModulePromise ??= import("./server/plugin-route-runtime-scopes.js");
  return pluginRouteRuntimeScopesModulePromise;
}

const GATEWAY_PROBE_STATUS_BY_PATH = new Map<string, "live" | "ready">([
  ["/health", "live"],
  ["/healthz", "live"],
  ["/ready", "ready"],
  ["/readyz", "ready"],
]);
<<<<<<< HEAD
function resolvePluginGatewayAuthBypassPaths(
  configSnapshot: ReturnType<typeof loadConfig>,
): Set<string> {
  const paths = new Set<string>();
  for (const plugin of listBundledChannelPlugins()) {
    for (const path of plugin.gateway?.resolveGatewayAuthBypassPaths?.({ cfg: configSnapshot }) ??
      []) {
      if (typeof path === "string" && path.trim()) {
        paths.add(path.trim());
      }
    }
  }
  return paths;
=======
const pluginGatewayAuthBypassPathsCache = new WeakMap<
  OpenClawConfig,
  Promise<ReadonlySet<string>>
>();

async function resolvePluginGatewayAuthBypassPaths(
  configSnapshot: OpenClawConfig,
): Promise<Set<string>> {
  const paths = new Set<string>();
  const configuredChannels = configSnapshot.channels;
  if (!configuredChannels || Object.keys(configuredChannels).length === 0) {
    return paths;
  }
  for (const channelId of Object.keys(configuredChannels)) {
    for (const path of resolveBundledChannelGatewayAuthBypassPaths({
      channelId,
      cfg: configSnapshot,
    })) {
      paths.add(path);
    }
  }
  return paths;
}

function getCachedPluginGatewayAuthBypassPaths(
  configSnapshot: OpenClawConfig,
): Promise<ReadonlySet<string>> {
  const cached = pluginGatewayAuthBypassPathsCache.get(configSnapshot);
  if (cached) {
    return cached;
  }
  const resolved = resolvePluginGatewayAuthBypassPaths(configSnapshot).catch((error: unknown) => {
    pluginGatewayAuthBypassPathsCache.delete(configSnapshot);
    throw error;
  });
  pluginGatewayAuthBypassPathsCache.set(configSnapshot, resolved);
  return resolved;
}

function isOpenAiModelsPath(pathname: string): boolean {
  return pathname === "/v1/models" || pathname.startsWith("/v1/models/");
}

function isEmbeddingsPath(pathname: string): boolean {
  return pathname === "/v1/embeddings";
}

function isOpenAiChatCompletionsPath(pathname: string): boolean {
  return pathname === "/v1/chat/completions";
}

function isOpenResponsesPath(pathname: string): boolean {
  return pathname === "/v1/responses";
}

function isToolsInvokePath(pathname: string): boolean {
  return pathname === "/tools/invoke";
}

function isManagedOutgoingImagePath(pathname: string): boolean {
  return pathname.startsWith("/api/chat/media/outgoing/");
}

function isSessionKillPath(pathname: string): boolean {
  return /^\/sessions\/[^/]+\/kill$/.test(pathname);
}

function isSessionHistoryPath(pathname: string): boolean {
  return /^\/sessions\/[^/]+\/history$/.test(pathname);
>>>>>>> upstream/main
}

function shouldEnforceDefaultPluginGatewayAuth(pathContext: PluginRoutePathContext): boolean {
  return (
    pathContext.malformedEncoding ||
    pathContext.decodePassLimitReached ||
    isProtectedPluginRoutePathFromContext(pathContext)
  );
}

async function canRevealReadinessDetails(params: {
  req: IncomingMessage;
  resolvedAuth: ResolvedGatewayAuth;
  trustedProxies: string[];
  allowRealIpFallback: boolean;
}): Promise<boolean> {
  // Readiness details expose subsystem names; show them only to local direct callers or
  // requests that prove gateway auth, while unauthenticated remote probes get a boolean.
  if (isLocalDirectRequest(params.req, params.trustedProxies, params.allowRealIpFallback)) {
    return true;
  }
  if (params.resolvedAuth.mode === "none") {
    return false;
  }

  const { getBearerToken, resolveHttpBrowserOriginPolicy } = await getHttpAuthUtilsModule();
  const bearerToken = getBearerToken(params.req);
  const authResult = await authorizeHttpGatewayConnect({
    auth: params.resolvedAuth,
    connectAuth: bearerToken ? { token: bearerToken, password: bearerToken } : null,
    req: params.req,
    trustedProxies: params.trustedProxies,
    allowRealIpFallback: params.allowRealIpFallback,
    browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req),
  });
  return authResult.ok;
}

/** Handles live/ready probe endpoints before normal gateway routing. */
async function handleGatewayProbeRequest(
  req: IncomingMessage,
  res: ServerResponse,
  requestPath: string,
  resolvedAuth: ResolvedGatewayAuth,
  trustedProxies: string[],
  allowRealIpFallback: boolean,
  getReadiness?: ReadinessChecker,
): Promise<boolean> {
  const status = GATEWAY_PROBE_STATUS_BY_PATH.get(requestPath);
  if (!status) {
    return false;
  }

  const method = (req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Method Not Allowed");
    return true;
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  let statusCode: number;
  let body: string;
  if (status === "ready" && getReadiness) {
    const includeDetails = await canRevealReadinessDetails({
      req,
      resolvedAuth,
      trustedProxies,
      allowRealIpFallback,
    });
    try {
      const result = getReadiness();
      statusCode = result.ready ? 200 : 503;
      body = JSON.stringify(includeDetails ? result : { ready: result.ready });
    } catch {
      statusCode = 503;
      body = JSON.stringify(
        includeDetails ? { ready: false, failing: ["internal"], uptimeMs: 0 } : { ready: false },
      );
    }
  } else {
    statusCode = 200;
    body = JSON.stringify({ ok: true, status });
  }
  res.statusCode = statusCode;
  res.end(method === "HEAD" ? undefined : body);
  return true;
}

function writeUpgradeAuthFailure(
  socket: { write: (chunk: string) => void },
  auth: GatewayAuthResult,
) {
  if (auth.rateLimited) {
    const retryAfterSeconds =
      auth.retryAfterMs && auth.retryAfterMs > 0 ? Math.ceil(auth.retryAfterMs / 1000) : undefined;
    socket.write(
      [
        "HTTP/1.1 429 Too Many Requests",
        retryAfterSeconds ? `Retry-After: ${retryAfterSeconds}` : undefined,
        "Content-Type: application/json; charset=utf-8",
        "Connection: close",
        "",
        JSON.stringify({
          error: {
            message: "Too many failed authentication attempts. Please try again later.",
            type: "rate_limited",
          },
        }),
      ]
        .filter(Boolean)
        .join("\r\n"),
    );
    return;
  }
  socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
}

function writeUpgradeServiceUnavailable(socket: { write: (chunk: string) => void }, body: string) {
  socket.write(
    "HTTP/1.1 503 Service Unavailable\r\n" +
      "Connection: close\r\n" +
      "Content-Type: text/plain; charset=utf-8\r\n" +
      `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n` +
      "\r\n" +
      body,
  );
}

function parseGatewayRequestPath(rawUrl: string | undefined): string | undefined {
  try {
    return new URL(rawUrl ?? "/", "http://localhost").pathname;
  } catch {
    return undefined;
  }
}

type GatewayHttpRequestStage = {
  name: string;
  run: () => Promise<boolean> | boolean;
  continueOnError?: boolean;
};

export async function runGatewayHttpRequestStages(
  stages: readonly GatewayHttpRequestStage[],
): Promise<boolean> {
  for (const stage of stages) {
    try {
      if (await stage.run()) {
        return true;
      }
    } catch (err) {
<<<<<<< HEAD
      // Log and skip the failing stage so subsequent stages (control-ui,
      // gateway-probes, etc.) remain reachable.  A common trigger is a
      // plugin-owned route/runtime code can still fail to load when an
      // optional dependency is missing. Keep later stages reachable.
=======
      if (!stage.continueOnError) {
        throw err;
      }
      // Log and skip the failing stage so subsequent stages (control-ui,
      // gateway-probes, etc.) remain reachable. A common trigger is a
      // plugin-owned route/runtime code still failing to load an optional dependency.
>>>>>>> upstream/main
      console.error(`[gateway-http] stage "${stage.name}" threw — skipping:`, err);
    }
  }
  return false;
}

function buildPluginRequestStages(params: {
  req: IncomingMessage;
  res: ServerResponse;
  requestPath: string;
<<<<<<< HEAD
  gatewayAuthBypassPaths: ReadonlySet<string>;
=======
  getGatewayAuthBypassPaths: () => Promise<ReadonlySet<string>>;
>>>>>>> upstream/main
  pluginPathContext: PluginRoutePathContext | null;
  handlePluginRequest?: PluginHttpRequestHandler;
  shouldEnforcePluginGatewayAuth?: (pathContext: PluginRoutePathContext) => boolean;
  resolvedAuth: ResolvedGatewayAuth;
  trustedProxies: string[];
  allowRealIpFallback: boolean;
  rateLimiter?: AuthRateLimiter;
}): GatewayHttpRequestStage[] {
  if (!params.handlePluginRequest) {
    return [];
  }
  let pluginGatewayAuthSatisfied = false;
<<<<<<< HEAD
  let pluginRequestOperatorScopes: string[] | undefined;
=======
  let pluginGatewayRequestAuth: AuthorizedGatewayHttpRequest | undefined;
  let pluginRequestOperatorScopes: string[] | undefined;
  // Plugin auth and plugin dispatch are separate stages so route handlers receive the
  // gateway-auth context while plugin failures can still fall through to core/Control UI routes.
>>>>>>> upstream/main
  return [
    {
      name: "plugin-auth",
      run: async () => {
<<<<<<< HEAD
        if (params.gatewayAuthBypassPaths.has(params.requestPath)) {
          return false;
        }
=======
>>>>>>> upstream/main
        const pathContext =
          params.pluginPathContext ?? resolvePluginRoutePathContext(params.requestPath);
        if (
          !(params.shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(
            pathContext,
          )
        ) {
          return false;
        }
<<<<<<< HEAD
=======
        if ((await params.getGatewayAuthBypassPaths()).has(params.requestPath)) {
          return false;
        }
        // Bypass paths are limited to bundled channel callbacks; all other protected plugin
        // routes must produce an AuthorizedGatewayHttpRequest before runtime scopes are derived.
        const { authorizeGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule();
>>>>>>> upstream/main
        const requestAuth = await authorizeGatewayHttpRequestOrReply({
          req: params.req,
          res: params.res,
          auth: params.resolvedAuth,
          trustedProxies: params.trustedProxies,
          allowRealIpFallback: params.allowRealIpFallback,
          rateLimiter: params.rateLimiter,
        });
        if (!requestAuth) {
          return true;
        }
        pluginGatewayAuthSatisfied = true;
<<<<<<< HEAD
=======
        pluginGatewayRequestAuth = requestAuth;
        const { resolvePluginRouteRuntimeOperatorScopes } =
          await getPluginRouteRuntimeScopesModule();
>>>>>>> upstream/main
        pluginRequestOperatorScopes = resolvePluginRouteRuntimeOperatorScopes(
          params.req,
          requestAuth,
        );
        return false;
      },
    },
    {
      name: "plugin-http",
      continueOnError: true,
      run: () => {
        const pathContext =
          params.pluginPathContext ?? resolvePluginRoutePathContext(params.requestPath);
        return (
          params.handlePluginRequest?.(params.req, params.res, pathContext, {
            gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
<<<<<<< HEAD
=======
            gatewayRequestAuth: pluginGatewayRequestAuth,
>>>>>>> upstream/main
            gatewayRequestOperatorScopes: pluginRequestOperatorScopes,
          }) ?? false
        );
      },
    },
  ];
}

<<<<<<< HEAD
export function createHooksRequestHandler(
  opts: {
    getHooksConfig: () => HooksConfigResolved | null;
    bindHost: string;
    port: number;
    logHooks: SubsystemLogger;
    getClientIpConfig?: () => HookClientIpConfig;
  } & HookDispatchers,
): HooksRequestHandler {
  const { getHooksConfig, logHooks, dispatchAgentHook, dispatchWakeHook, getClientIpConfig } = opts;
  const hookReplayCache = new Map<string, HookReplayEntry>();
  const hookAuthLimiter = createAuthRateLimiter({
    maxAttempts: HOOK_AUTH_FAILURE_LIMIT,
    windowMs: HOOK_AUTH_FAILURE_WINDOW_MS,
    lockoutMs: HOOK_AUTH_FAILURE_WINDOW_MS,
    exemptLoopback: false,
    // Handler lifetimes are tied to gateway runtime/tests; skip background timer fanout.
    pruneIntervalMs: 0,
  });

  const resolveHookClientKey = (req: IncomingMessage): string => {
    const clientIpConfig = getClientIpConfig?.();
    const clientIp =
      resolveRequestClientIp(
        req,
        clientIpConfig?.trustedProxies,
        clientIpConfig?.allowRealIpFallback === true,
      ) ?? req.socket?.remoteAddress;
    return normalizeRateLimitClientIp(clientIp);
  };

  const pruneHookReplayCache = (now: number) => {
    const cutoff = now - DEDUPE_TTL_MS;
    for (const [key, entry] of hookReplayCache) {
      if (entry.ts < cutoff) {
        hookReplayCache.delete(key);
      }
    }
    while (hookReplayCache.size > DEDUPE_MAX) {
      const oldestKey = hookReplayCache.keys().next().value;
      if (!oldestKey) {
        break;
      }
      hookReplayCache.delete(oldestKey);
    }
  };

  const buildHookReplayCacheKey = (params: HookReplayScope): string | undefined => {
    const idem = params.idempotencyKey?.trim();
    if (!idem) {
      return undefined;
    }
    const tokenFingerprint = createHash("sha256")
      .update(params.token ?? "", "utf8")
      .digest("hex");
    const idempotencyFingerprint = createHash("sha256").update(idem, "utf8").digest("hex");
    const scopeFingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          pathKey: params.pathKey,
          dispatchScope: params.dispatchScope,
        }),
        "utf8",
      )
      .digest("hex");
    return `${tokenFingerprint}:${scopeFingerprint}:${idempotencyFingerprint}`;
  };

  const resolveCachedHookRunId = (key: string | undefined, now: number): string | undefined => {
    if (!key) {
      return undefined;
    }
    pruneHookReplayCache(now);
    const cached = hookReplayCache.get(key);
    if (!cached) {
      return undefined;
    }
    hookReplayCache.delete(key);
    hookReplayCache.set(key, cached);
    return cached.runId;
  };

  const rememberHookRunId = (key: string | undefined, runId: string, now: number) => {
    if (!key) {
      return;
    }
    hookReplayCache.delete(key);
    hookReplayCache.set(key, { ts: now, runId });
    pruneHookReplayCache(now);
  };

  return async (req, res) => {
    const hooksConfig = getHooksConfig();
    if (!hooksConfig) {
      return false;
    }
    // Only pathname/search are used here; keep the base host fixed so bind-host
    // representation (e.g. IPv6 wildcards) cannot break request parsing.
    const url = new URL(req.url ?? "/", "http://localhost");
    const basePath = hooksConfig.basePath;
    if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      return false;
    }

    if (url.searchParams.has("token")) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(
        "Hook token must be provided via Authorization: Bearer <token> or X-OpenClaw-Token header (query parameters are not allowed).",
      );
      return true;
    }

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Allow", "POST");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Method Not Allowed");
      return true;
    }

    const token = extractHookToken(req);
    const clientKey = resolveHookClientKey(req);
    if (!safeEqualSecret(token, hooksConfig.token)) {
      const throttle = hookAuthLimiter.check(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
      if (!throttle.allowed) {
        const retryAfter = throttle.retryAfterMs > 0 ? Math.ceil(throttle.retryAfterMs / 1000) : 1;
        res.statusCode = 429;
        res.setHeader("Retry-After", String(retryAfter));
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Too Many Requests");
        logHooks.warn(`hook auth throttled for ${clientKey}; retry-after=${retryAfter}s`);
        return true;
      }
      hookAuthLimiter.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
      res.statusCode = 401;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Unauthorized");
      return true;
    }
    hookAuthLimiter.reset(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);

    const subPath = url.pathname.slice(basePath.length).replace(/^\/+/, "");
    if (!subPath) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Not Found");
      return true;
    }

    const body = await readJsonBody(req, hooksConfig.maxBodyBytes);
    if (!body.ok) {
      const status =
        body.error === "payload too large"
          ? 413
          : body.error === "request body timeout"
            ? 408
            : 400;
      sendJson(res, status, { ok: false, error: body.error });
      return true;
    }

    const payload = typeof body.value === "object" && body.value !== null ? body.value : {};
    const headers = normalizeHookHeaders(req);
    const idempotencyKey = resolveHookIdempotencyKey({
      payload: payload as Record<string, unknown>,
      headers,
    });
    const now = Date.now();

    if (subPath === "wake") {
      const normalized = normalizeWakePayload(payload as Record<string, unknown>);
      if (!normalized.ok) {
        sendJson(res, 400, { ok: false, error: normalized.error });
        return true;
      }
      dispatchWakeHook(normalized.value);
      sendJson(res, 200, { ok: true, mode: normalized.value.mode });
      return true;
    }

    if (subPath === "agent") {
      const normalized = normalizeAgentPayload(payload as Record<string, unknown>);
      if (!normalized.ok) {
        sendJson(res, 400, { ok: false, error: normalized.error });
        return true;
      }
      if (!isHookAgentAllowed(hooksConfig, normalized.value.agentId)) {
        sendJson(res, 400, { ok: false, error: getHookAgentPolicyError() });
        return true;
      }
      const sessionKey = resolveHookSessionKey({
        hooksConfig,
        source: "request",
        sessionKey: normalized.value.sessionKey,
      });
      if (!sessionKey.ok) {
        sendJson(res, 400, { ok: false, error: sessionKey.error });
        return true;
      }
      const targetAgentId = resolveHookTargetAgentId(hooksConfig, normalized.value.agentId);
      const replayKey = buildHookReplayCacheKey({
        pathKey: "agent",
        token,
        idempotencyKey,
        dispatchScope: {
          agentId: targetAgentId ?? null,
          sessionKey:
            normalized.value.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
          message: normalized.value.message,
          name: normalized.value.name,
          wakeMode: normalized.value.wakeMode,
          deliver: normalized.value.deliver,
          channel: normalized.value.channel,
          to: normalized.value.to ?? null,
          model: normalized.value.model ?? null,
          thinking: normalized.value.thinking ?? null,
          timeoutSeconds: normalized.value.timeoutSeconds ?? null,
        },
      });
      const cachedRunId = resolveCachedHookRunId(replayKey, now);
      if (cachedRunId) {
        sendJson(res, 200, { ok: true, runId: cachedRunId });
        return true;
      }
      const normalizedDispatchSessionKey = normalizeHookDispatchSessionKey({
        sessionKey: sessionKey.value,
        targetAgentId,
      });
      const allowedPrefixes = hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
      if (
        allowedPrefixes &&
        !isSessionKeyAllowedByPrefix(normalizedDispatchSessionKey, allowedPrefixes)
      ) {
        sendJson(res, 400, { ok: false, error: getHookSessionKeyPrefixError(allowedPrefixes) });
        return true;
      }
      const runId = dispatchAgentHook({
        ...normalized.value,
        idempotencyKey,
        sessionKey: normalizedDispatchSessionKey,
        agentId: targetAgentId,
        externalContentSource: "webhook",
      });
      rememberHookRunId(replayKey, runId, now);
      sendJson(res, 200, { ok: true, runId });
      return true;
    }

    if (hooksConfig.mappings.length > 0) {
      try {
        const mapped = await applyHookMappings(hooksConfig.mappings, {
          payload: payload as Record<string, unknown>,
          headers,
          url,
          path: subPath,
        });
        if (mapped) {
          if (!mapped.ok) {
            sendJson(res, 400, { ok: false, error: mapped.error });
            return true;
          }
          if (mapped.action === null) {
            res.statusCode = 204;
            res.end();
            return true;
          }
          if (mapped.action.kind === "wake") {
            dispatchWakeHook({
              text: mapped.action.text,
              mode: mapped.action.mode,
            });
            sendJson(res, 200, { ok: true, mode: mapped.action.mode });
            return true;
          }
          const channel = resolveHookChannel(mapped.action.channel);
          if (!channel) {
            sendJson(res, 400, { ok: false, error: getHookChannelError() });
            return true;
          }
          if (!isHookAgentAllowed(hooksConfig, mapped.action.agentId)) {
            sendJson(res, 400, { ok: false, error: getHookAgentPolicyError() });
            return true;
          }
          const sessionKey = resolveHookSessionKey({
            hooksConfig,
            source: "mapping",
            sessionKey: mapped.action.sessionKey,
          });
          if (!sessionKey.ok) {
            sendJson(res, 400, { ok: false, error: sessionKey.error });
            return true;
          }
          const targetAgentId = resolveHookTargetAgentId(hooksConfig, mapped.action.agentId);
          const normalizedDispatchSessionKey = normalizeHookDispatchSessionKey({
            sessionKey: sessionKey.value,
            targetAgentId,
          });
          const allowedPrefixes = hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
          if (
            allowedPrefixes &&
            !isSessionKeyAllowedByPrefix(normalizedDispatchSessionKey, allowedPrefixes)
          ) {
            sendJson(res, 400, { ok: false, error: getHookSessionKeyPrefixError(allowedPrefixes) });
            return true;
          }
          const replayKey = buildHookReplayCacheKey({
            pathKey: subPath || "mapping",
            token,
            idempotencyKey,
            dispatchScope: {
              agentId: targetAgentId ?? null,
              sessionKey:
                mapped.action.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
              message: mapped.action.message,
              name: mapped.action.name ?? "Hook",
              wakeMode: mapped.action.wakeMode,
              deliver: resolveHookDeliver(mapped.action.deliver),
              channel,
              to: mapped.action.to ?? null,
              model: mapped.action.model ?? null,
              thinking: mapped.action.thinking ?? null,
              timeoutSeconds: mapped.action.timeoutSeconds ?? null,
            },
          });
          const cachedRunId = resolveCachedHookRunId(replayKey, now);
          if (cachedRunId) {
            sendJson(res, 200, { ok: true, runId: cachedRunId });
            return true;
          }
          const runId = dispatchAgentHook({
            message: mapped.action.message,
            name: mapped.action.name ?? "Hook",
            idempotencyKey,
            agentId: targetAgentId,
            wakeMode: mapped.action.wakeMode,
            sessionKey: normalizedDispatchSessionKey,
            deliver: resolveHookDeliver(mapped.action.deliver),
            channel,
            to: mapped.action.to,
            model: mapped.action.model,
            thinking: mapped.action.thinking,
            timeoutSeconds: mapped.action.timeoutSeconds,
            allowUnsafeExternalContent: mapped.action.allowUnsafeExternalContent,
            externalContentSource: resolveMappedHookExternalContentSource({
              subPath,
              payload: payload as Record<string, unknown>,
              sessionKey: sessionKey.value,
            }),
          });
          rememberHookRunId(replayKey, runId, now);
          sendJson(res, 200, { ok: true, runId });
          return true;
        }
      } catch (err) {
        logHooks.warn(`hook mapping failed: ${String(err)}`);
        sendJson(res, 500, { ok: false, error: "hook mapping failed" });
        return true;
      }
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not Found");
    return true;
  };
}

=======
/** Creates the gateway HTTP/HTTPS server and ordered request-stage router. */
>>>>>>> upstream/main
export function createGatewayHttpServer(opts: {
  clients: Set<GatewayWsClient>;
  controlUiEnabled: boolean;
  controlUiBasePath: string;
  controlUiRoot?: ControlUiRootState;
  openAiChatCompletionsEnabled: boolean;
  openAiChatCompletionsConfig?: import("../config/types.gateway.js").GatewayHttpChatCompletionsConfig;
  openResponsesEnabled: boolean;
  openResponsesConfig?: import("../config/types.gateway.js").GatewayHttpResponsesConfig;
  strictTransportSecurityHeader?: string;
  handleHooksRequest: HooksRequestHandler;
  handlePluginRequest?: PluginHttpRequestHandler;
  handlePluginUpgrade?: PluginHttpUpgradeHandler;
  shouldEnforcePluginGatewayAuth?: (pathContext: PluginRoutePathContext) => boolean;
  resolvePluginNodeCapabilityRoute?: ResolvePluginNodeCapabilityRoute;
  resolvedAuth: ResolvedGatewayAuth;
  getResolvedAuth?: () => ResolvedGatewayAuth;
  /** Optional rate limiter for auth brute-force protection. */
  rateLimiter?: AuthRateLimiter;
  getReadiness?: ReadinessChecker;
  getRuntimeConfig?: () => OpenClawConfig;
  tlsOptions?: TlsOptions;
}): HttpServer {
  const {
    clients,
    controlUiEnabled,
    controlUiBasePath,
    controlUiRoot,
    openAiChatCompletionsEnabled,
    openAiChatCompletionsConfig,
    openResponsesEnabled,
    openResponsesConfig,
    strictTransportSecurityHeader,
    handleHooksRequest,
    handlePluginRequest,
    shouldEnforcePluginGatewayAuth,
    resolvePluginNodeCapabilityRoute,
    resolvedAuth,
    rateLimiter,
    getReadiness,
  } = opts;
  const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
  const loadGatewayConfig = opts.getRuntimeConfig ?? getRuntimeConfig;
  const openAiCompatEnabled = openAiChatCompletionsEnabled || openResponsesEnabled;
  const httpServer: HttpServer = opts.tlsOptions
    ? createHttpsServer(opts.tlsOptions, (req, res) => {
        void handleRequestWithTrace(req, res);
      })
    : createHttpServer((req, res) => {
        void handleRequestWithTrace(req, res);
      });

  function handleRequestWithTrace(req: IncomingMessage, res: ServerResponse) {
    return runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () =>
      handleRequest(req, res),
    );
  }

  async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    setDefaultSecurityHeaders(res, {
      strictTransportSecurity: strictTransportSecurityHeader,
    });

    // Don't interfere with WebSocket upgrades; ws handles the 'upgrade' event.
    if ((req.headers.upgrade ?? "").toLowerCase() === "websocket") {
      return;
    }

    try {
      const requestPath = parseGatewayRequestPath(req.url);
      if (requestPath === undefined) {
        sendGatewayAuthFailure(res, { ok: false, reason: "unauthorized" });
        return;
      }
      if (GATEWAY_PROBE_STATUS_BY_PATH.get(requestPath) === "live") {
        await handleGatewayProbeRequest(
          req,
          res,
          requestPath,
          getResolvedAuth(),
          [],
          false,
          getReadiness,
        );
        return;
      }
<<<<<<< HEAD
      const requestPath = new URL(req.url ?? "/", "http://localhost").pathname;
      const gatewayAuthBypassPaths = resolvePluginGatewayAuthBypassPaths(configSnapshot);
=======

      const configSnapshot = loadGatewayConfig();
      const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
      const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
      const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
      if (scopedNodeCapability.malformedScopedPath) {
        sendGatewayAuthFailure(res, { ok: false, reason: "unauthorized" });
        return;
      }
      if (scopedNodeCapability.rewrittenUrl) {
        // Scoped capability URLs are normalized before auth/routing so built-in handlers,
        // plugin route matching, and audit context all see the same canonical path.
        req.url = scopedNodeCapability.rewrittenUrl;
      }
      const scopedRequestPath = scopedNodeCapability.pathname;
>>>>>>> upstream/main
      const pluginPathContext = handlePluginRequest
        ? resolvePluginRoutePathContext(scopedRequestPath)
        : null;
      const resolvedAuthValue = getResolvedAuth();
      const requestStages: GatewayHttpRequestStage[] = [
        {
          name: "gateway-probes",
          run: () =>
            handleGatewayProbeRequest(
              req,
              res,
              scopedRequestPath,
              resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              getReadiness,
            ),
        },
        {
          name: "hooks",
          run: () => handleHooksRequest(req, res),
        },
<<<<<<< HEAD
        {
          name: "models",
          run: () =>
            openAiCompatEnabled
              ? handleOpenAiModelsHttpRequest(req, res, {
                  auth: resolvedAuth,
                  trustedProxies,
                  allowRealIpFallback,
                  rateLimiter,
                })
              : false,
        },
        {
          name: "embeddings",
          run: () =>
            openAiCompatEnabled
              ? handleOpenAiEmbeddingsHttpRequest(req, res, {
                  auth: resolvedAuth,
                  trustedProxies,
                  allowRealIpFallback,
                  rateLimiter,
                })
              : false,
        },
        {
          name: "tools-invoke",
          run: () =>
            handleToolsInvokeHttpRequest(req, res, {
              auth: resolvedAuth,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        },
        {
          name: "sessions-kill",
          run: () =>
            handleSessionKillHttpRequest(req, res, {
              auth: resolvedAuth,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        },
        {
          name: "sessions-history",
          run: () =>
            handleSessionHistoryHttpRequest(req, res, {
              auth: resolvedAuth,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        },
=======
>>>>>>> upstream/main
      ];
      if (openAiCompatEnabled && isOpenAiModelsPath(scopedRequestPath)) {
        requestStages.push({
          name: "models",
          run: async () =>
            (await getModelsHttpModule()).handleOpenAiModelsHttpRequest(req, res, {
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (openAiCompatEnabled && isEmbeddingsPath(scopedRequestPath)) {
        requestStages.push({
          name: "embeddings",
          run: async () =>
            (await getEmbeddingsHttpModule()).handleOpenAiEmbeddingsHttpRequest(req, res, {
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (isToolsInvokePath(scopedRequestPath)) {
        requestStages.push({
          name: "tools-invoke",
          run: async () =>
            (await getToolsInvokeHttpModule()).handleToolsInvokeHttpRequest(req, res, {
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (isSessionKillPath(scopedRequestPath)) {
        requestStages.push({
          name: "sessions-kill",
          run: async () =>
            (await getSessionKillHttpModule()).handleSessionKillHttpRequest(req, res, {
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (isSessionHistoryPath(scopedRequestPath)) {
        requestStages.push({
          name: "sessions-history",
          run: async () =>
            (await getSessionHistoryHttpModule()).handleSessionHistoryHttpRequest(req, res, {
              auth: resolvedAuthValue,
              getResolvedAuth,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (openResponsesEnabled && isOpenResponsesPath(scopedRequestPath)) {
        requestStages.push({
          name: "openresponses",
          run: async () =>
            (await getOpenResponsesHttpModule()).handleOpenResponsesHttpRequest(req, res, {
              auth: resolvedAuthValue,
              config: openResponsesConfig,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (openAiChatCompletionsEnabled && isOpenAiChatCompletionsPath(scopedRequestPath)) {
        requestStages.push({
          name: "openai",
          run: async () =>
            (await getOpenAiHttpModule()).handleOpenAiHttpRequest(req, res, {
              auth: resolvedAuthValue,
              config: openAiChatCompletionsConfig,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }
      if (
        handlePluginRequest &&
        pluginPathContext &&
        resolvePluginNodeCapabilityRoute?.(pluginPathContext)
      ) {
        const nodeCapability = resolvePluginNodeCapabilityRoute(pluginPathContext);
        requestStages.push({
          name: "plugin-node-capability-auth",
          run: async () => {
            if (!nodeCapability) {
              return false;
            }
            const { authorizePluginNodeCapabilityRequest } =
              await getPluginNodeCapabilityAuthModule();
            const ok = await authorizePluginNodeCapabilityRequest({
              req,
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              clients,
              nodeCapability,
              capability: scopedNodeCapability.capability,
              malformedScopedPath: scopedNodeCapability.malformedScopedPath,
              rateLimiter,
            });
            if (!ok.ok) {
              sendGatewayAuthFailure(res, ok);
              return true;
            }
            return false;
          },
        });
      }
      // Plugin routes run before the Control UI SPA catch-all so explicitly
      // registered plugin endpoints stay reachable. Core built-in gateway
      // routes above still keep precedence on overlapping paths.
      requestStages.push(
        ...buildPluginRequestStages({
          req,
          res,
<<<<<<< HEAD
          requestPath,
          gatewayAuthBypassPaths,
=======
          requestPath: scopedRequestPath,
          getGatewayAuthBypassPaths: () => getCachedPluginGatewayAuthBypassPaths(configSnapshot),
>>>>>>> upstream/main
          pluginPathContext,
          handlePluginRequest,
          shouldEnforcePluginGatewayAuth,
          resolvedAuth: resolvedAuthValue,
          trustedProxies,
          allowRealIpFallback,
          rateLimiter,
        }),
      );

      if (isManagedOutgoingImagePath(scopedRequestPath)) {
        requestStages.push({
<<<<<<< HEAD
          name: "control-ui-avatar",
          run: () =>
            handleControlUiAvatarRequest(req, res, {
              basePath: controlUiBasePath,
              resolveAvatar: (agentId) =>
                resolveAgentAvatar(configSnapshot, agentId, { includeUiOverride: true }),
            }),
        });
        requestStages.push({
          name: "control-ui-http",
          run: () =>
            handleControlUiHttpRequest(req, res, {
              basePath: controlUiBasePath,
              config: configSnapshot,
              root: controlUiRoot,
            }),
=======
          name: "chat-managed-image-media",
          run: async () =>
            (await getManagedImageAttachmentsModule()).handleManagedOutgoingImageHttpRequest(
              req,
              res,
              {
                auth: resolvedAuthValue,
                trustedProxies,
                allowRealIpFallback,
                rateLimiter,
              },
            ),
>>>>>>> upstream/main
        });
      }

      if (controlUiEnabled) {
        requestStages.push({
          name: "control-ui-assistant-media",
          run: async () =>
            (await getControlUiModule()).handleControlUiAssistantMediaRequest(req, res, {
              basePath: controlUiBasePath,
              config: configSnapshot,
              agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
        requestStages.push({
          name: "control-ui-avatar",
          run: async () => {
            const { handleControlUiAvatarRequest } = await getControlUiModule();
            const { resolveAgentAvatar } = await getIdentityAvatarModule();
            return handleControlUiAvatarRequest(req, res, {
              basePath: controlUiBasePath,
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
              resolveAvatar: (agentId) =>
                resolveAgentAvatar(configSnapshot, agentId, { includeUiOverride: true }),
            });
          },
        });
        requestStages.push({
          name: "control-ui-http",
          run: async () =>
            (await getControlUiModule()).handleControlUiHttpRequest(req, res, {
              basePath: controlUiBasePath,
              config: configSnapshot,
              agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
              root: controlUiRoot,
              auth: resolvedAuthValue,
              trustedProxies,
              allowRealIpFallback,
              rateLimiter,
            }),
        });
      }

      if (await runGatewayHttpRequestStages(requestStages)) {
        return;
      }

      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Not Found");
    } catch (err) {
      console.error("[gateway-http] unhandled error in request handler:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Internal Server Error");
    }
  }

  return httpServer;
}

/** Attaches WebSocket and plugin-upgrade routing to an already-created HTTP server. */
export function attachGatewayUpgradeHandler(opts: {
  httpServer: HttpServer;
  wss: WebSocketServer;
  handlePluginUpgrade?: PluginHttpUpgradeHandler;
  shouldEnforcePluginGatewayAuth?: (pathContext: PluginRoutePathContext) => boolean;
  resolvePluginNodeCapabilityRoute?: ResolvePluginNodeCapabilityRoute;
  clients: Set<GatewayWsClient>;
  preauthConnectionBudget: PreauthConnectionBudget;
  resolvedAuth: ResolvedGatewayAuth;
  getResolvedAuth?: () => ResolvedGatewayAuth;
  /** Optional rate limiter for auth brute-force protection. */
  rateLimiter?: AuthRateLimiter;
  /** Optional logger for error diagnostics. */
  log?: { warn: (msg: string) => void };
}) {
  const {
    httpServer,
    wss,
<<<<<<< HEAD
    canvasHost,
=======
    handlePluginUpgrade,
    shouldEnforcePluginGatewayAuth,
    resolvePluginNodeCapabilityRoute,
>>>>>>> upstream/main
    clients,
    preauthConnectionBudget,
    resolvedAuth,
    rateLimiter,
<<<<<<< HEAD
  } = opts;
  httpServer.on("upgrade", (req, socket, head) => {
    void (async () => {
      const configSnapshot = loadConfig();
      const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
      const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
      const scopedCanvas = normalizeCanvasScopedUrl(req.url ?? "/");
      if (scopedCanvas.malformedScopedPath) {
=======
    log,
  } = opts;
  const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
  httpServer.on("upgrade", (req, socket, head) => {
    void runWithDiagnosticTraceContext(createDiagnosticTraceContext(), async () => {
      const configSnapshot = getRuntimeConfig();
      const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
      const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
      const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
      if (scopedNodeCapability.malformedScopedPath) {
>>>>>>> upstream/main
        writeUpgradeAuthFailure(socket, { ok: false, reason: "unauthorized" });
        socket.destroy();
        return;
      }
      if (scopedNodeCapability.rewrittenUrl) {
        req.url = scopedNodeCapability.rewrittenUrl;
      }
<<<<<<< HEAD
      if (canvasHost) {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (url.pathname === CANVAS_WS_PATH) {
          const ok = await authorizeCanvasRequest({
            req,
            auth: resolvedAuth,
            trustedProxies,
            allowRealIpFallback,
            clients,
            canvasCapability: scopedCanvas.capability,
            malformedScopedPath: scopedCanvas.malformedScopedPath,
            rateLimiter,
          });
          if (!ok.ok) {
            writeUpgradeAuthFailure(socket, ok);
            socket.destroy();
            return;
          }
        }
        if (canvasHost.handleUpgrade(req, socket, head)) {
          return;
        }
      }
      const preauthBudgetKey = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback);
      if (wss.listenerCount("connection") === 0) {
        const responseBody = "Gateway websocket handlers unavailable";
        socket.write(
          "HTTP/1.1 503 Service Unavailable\r\n" +
            "Connection: close\r\n" +
            "Content-Type: text/plain; charset=utf-8\r\n" +
            `Content-Length: ${Buffer.byteLength(responseBody, "utf8")}\r\n` +
            "\r\n" +
            responseBody,
        );
=======
      const resolvedAuthLocal = getResolvedAuth();
      const requestPath = scopedNodeCapability.pathname;
      const pathContext = resolvePluginRoutePathContext(requestPath);
      const nodeCapability = resolvePluginNodeCapabilityRoute?.(pathContext);
      if (nodeCapability) {
        // Node-capability WebSocket upgrades authenticate before plugin upgrade dispatch so
        // plugin handlers never receive unauthorized scoped capability sockets.
        const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
        const ok = await authorizePluginNodeCapabilityRequest({
          req,
          auth: resolvedAuthLocal,
          trustedProxies,
          allowRealIpFallback,
          clients,
          nodeCapability,
          capability: scopedNodeCapability.capability,
          malformedScopedPath: scopedNodeCapability.malformedScopedPath,
          rateLimiter,
        });
        if (!ok.ok) {
          writeUpgradeAuthFailure(socket, ok);
          socket.destroy();
          return;
        }
      }
      if (handlePluginUpgrade) {
        let pluginGatewayAuthSatisfied = false;
        let pluginGatewayRequestAuth: AuthorizedGatewayHttpRequest | undefined;
        let pluginGatewayRequestOperatorScopes: string[] | undefined;
        const enforcePluginGatewayAuth = (
          shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth
        )(pathContext);
        if (
          enforcePluginGatewayAuth &&
          !(await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(requestPath)
        ) {
          const { checkGatewayHttpRequestAuth } = await getHttpAuthUtilsModule();
          const authCheck = await checkGatewayHttpRequestAuth({
            req,
            auth: resolvedAuthLocal,
            trustedProxies,
            allowRealIpFallback,
            rateLimiter,
            cfg: configSnapshot,
          });
          if (!authCheck.ok) {
            writeUpgradeAuthFailure(socket, authCheck.authResult);
            socket.destroy();
            return;
          }
          pluginGatewayAuthSatisfied = true;
          pluginGatewayRequestAuth = authCheck.requestAuth;
          const { resolvePluginRouteRuntimeOperatorScopes } =
            await getPluginRouteRuntimeScopesModule();
          pluginGatewayRequestOperatorScopes = resolvePluginRouteRuntimeOperatorScopes(
            req,
            authCheck.requestAuth,
          );
        }
        if (
          await handlePluginUpgrade(req, socket, head, pathContext, {
            gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
            gatewayRequestAuth: pluginGatewayRequestAuth,
            gatewayRequestOperatorScopes: pluginGatewayRequestOperatorScopes,
          })
        ) {
          return;
        }
      }
      const preauthBudgetKey = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback);
      if (wss.listenerCount("connection") === 0) {
        writeUpgradeServiceUnavailable(socket, "Gateway websocket handlers unavailable");
>>>>>>> upstream/main
        socket.destroy();
        return;
      }
      if (!preauthConnectionBudget.acquire(preauthBudgetKey)) {
<<<<<<< HEAD
        const responseBody = "Too many unauthenticated sockets";
        socket.write(
          "HTTP/1.1 503 Service Unavailable\r\n" +
            "Connection: close\r\n" +
            "Content-Type: text/plain; charset=utf-8\r\n" +
            `Content-Length: ${Buffer.byteLength(responseBody, "utf8")}\r\n` +
            "\r\n" +
            responseBody,
        );
=======
        writeUpgradeServiceUnavailable(socket, "Too many unauthenticated sockets");
>>>>>>> upstream/main
        socket.destroy();
        return;
      }
      let budgetTransferred = false;
<<<<<<< HEAD
=======
      // The socket owns the preauth budget until the WebSocket connection handler claims it;
      // close/error paths release here to avoid leaking unauthenticated connection slots.
>>>>>>> upstream/main
      const releaseUpgradeBudget = () => {
        if (budgetTransferred) {
          return;
        }
        budgetTransferred = true;
        preauthConnectionBudget.release(preauthBudgetKey);
      };
      socket.once("close", releaseUpgradeBudget);
      try {
        wss.handleUpgrade(req, socket, head, (ws) => {
          (
            ws as unknown as import("ws").WebSocket & {
              __openclawPreauthBudgetClaimed?: boolean;
              __openclawPreauthBudgetKey?: string;
            }
<<<<<<< HEAD
          ).__openclawPreauthBudgetKey = preauthBudgetKey;
=======
          )["__openclawPreauthBudgetKey"] = preauthBudgetKey;
>>>>>>> upstream/main
          wss.emit("connection", ws, req);
          const budgetClaimed = Boolean(
            (
              ws as unknown as import("ws").WebSocket & {
                __openclawPreauthBudgetClaimed?: boolean;
              }
<<<<<<< HEAD
            ).__openclawPreauthBudgetClaimed,
=======
            )["__openclawPreauthBudgetClaimed"],
>>>>>>> upstream/main
          );
          if (budgetClaimed) {
            budgetTransferred = true;
            socket.off("close", releaseUpgradeBudget);
          }
        });
      } catch {
        socket.off("close", releaseUpgradeBudget);
        releaseUpgradeBudget();
        throw new Error("gateway websocket upgrade failed");
      }
<<<<<<< HEAD
    })().catch(() => {
=======
    }).catch((err: unknown) => {
      const remoteAddress = (socket as { remoteAddress?: string }).remoteAddress ?? "unknown";
      const errorMessage = err instanceof Error ? err.message : String(err);
      log?.warn(`ws upgrade error from ${remoteAddress}: ${errorMessage}`);
>>>>>>> upstream/main
      socket.destroy();
    });
  });
}
