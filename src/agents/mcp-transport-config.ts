<<<<<<< HEAD
=======
/**
 * Resolves MCP transport command, environment, and timeout configuration.
 */
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { sanitizeForLog } from "../../packages/terminal-core/src/ansi.js";
import { resolveOpenClawMcpTransportAlias } from "../config/mcp-config-normalize.js";
>>>>>>> upstream/main
import { logWarn } from "../logger.js";
import {
  describeHttpMcpServerLaunchConfig,
  resolveHttpMcpServerLaunchConfig,
  type HttpMcpTransportType,
} from "./mcp-http.js";
import {
  describeStdioMcpServerLaunchConfig,
  resolveStdioMcpServerLaunchConfig,
} from "./mcp-stdio.js";

<<<<<<< HEAD
export type McpTransportType = "stdio" | HttpMcpTransportType;

type ResolvedBaseMcpTransportConfig = {
  description: string;
  connectionTimeoutMs: number;
};

export type ResolvedStdioMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
=======
// Resolves raw MCP server config into the transport shape used by bundle MCP
// runtime startup. Stdio is preferred when launch config is valid; otherwise
// HTTP/SSE transports are attempted with normalized timeout fields.
type ResolvedBaseMcpTransportConfig = {
  description: string;
  connectionTimeoutMs: number;
  requestTimeoutMs: number;
  supportsParallelToolCalls: boolean;
};

type ResolvedStdioMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
>>>>>>> upstream/main
  kind: "stdio";
  transportType: "stdio";
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
};

<<<<<<< HEAD
export type ResolvedHttpMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
=======
type ResolvedHttpMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
>>>>>>> upstream/main
  kind: "http";
  transportType: HttpMcpTransportType;
  url: string;
  headers?: Record<string, string>;
<<<<<<< HEAD
};

export type ResolvedMcpTransportConfig =
  | ResolvedStdioMcpTransportConfig
  | ResolvedHttpMcpTransportConfig;

const DEFAULT_CONNECTION_TIMEOUT_MS = 30_000;

function getConnectionTimeoutMs(rawServer: unknown): number {
  if (
    rawServer &&
    typeof rawServer === "object" &&
    typeof (rawServer as { connectionTimeoutMs?: unknown }).connectionTimeoutMs === "number" &&
    (rawServer as { connectionTimeoutMs: number }).connectionTimeoutMs > 0
  ) {
    return (rawServer as { connectionTimeoutMs: number }).connectionTimeoutMs;
=======
  auth?: "oauth";
  oauth?: Record<string, unknown>;
  sslVerify?: boolean;
  clientCert?: string;
  clientKey?: string;
};

type ResolvedMcpTransportConfig = ResolvedStdioMcpTransportConfig | ResolvedHttpMcpTransportConfig;

const DEFAULT_CONNECTION_TIMEOUT_MS = 30_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 60_000;

function getPositiveNumber(rawServer: unknown, keys: readonly string[]): number | undefined {
  if (!rawServer || typeof rawServer !== "object") {
    return undefined;
  }
  const record = rawServer as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
  }
  return undefined;
}

function getConnectionTimeoutMs(rawServer: unknown): number {
  const milliseconds = getPositiveNumber(rawServer, ["connectionTimeoutMs"]);
  if (milliseconds) {
    return Math.floor(milliseconds);
  }
  const seconds = getPositiveNumber(rawServer, ["connectTimeout", "connect_timeout"]);
  if (seconds) {
    return Math.floor(seconds * 1_000);
>>>>>>> upstream/main
  }
  return DEFAULT_CONNECTION_TIMEOUT_MS;
}

<<<<<<< HEAD
=======
function getRequestTimeoutMs(rawServer: unknown): number {
  const milliseconds = getPositiveNumber(rawServer, ["requestTimeoutMs"]);
  if (milliseconds) {
    return Math.floor(milliseconds);
  }
  const seconds = getPositiveNumber(rawServer, ["timeout"]);
  if (seconds) {
    return Math.floor(seconds * 1_000);
  }
  return DEFAULT_REQUEST_TIMEOUT_MS;
}

function getBooleanField(rawServer: unknown, keys: readonly string[]): boolean | undefined {
  if (!rawServer || typeof rawServer !== "object") {
    return undefined;
  }
  const record = rawServer as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return undefined;
}

function getStringField(rawServer: unknown, keys: readonly string[]): string | undefined {
  if (!rawServer || typeof rawServer !== "object") {
    return undefined;
  }
  const record = rawServer as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

>>>>>>> upstream/main
function getRequestedTransport(rawServer: unknown): string {
  if (
    !rawServer ||
    typeof rawServer !== "object" ||
    typeof (rawServer as { transport?: unknown }).transport !== "string"
  ) {
    return "";
  }
<<<<<<< HEAD
  return ((rawServer as { transport?: string }).transport ?? "").trim().toLowerCase();
=======
  return normalizeLowercaseStringOrEmpty((rawServer as { transport?: string }).transport);
}

function getRequestedTransportAlias(rawServer: unknown): HttpMcpTransportType | "" {
  if (
    !rawServer ||
    typeof rawServer !== "object" ||
    typeof (rawServer as { type?: unknown }).type !== "string"
  ) {
    return "";
  }
  return resolveOpenClawMcpTransportAlias((rawServer as { type?: string }).type) ?? "";
>>>>>>> upstream/main
}

function resolveHttpTransportConfig(
  serverName: string,
  rawServer: unknown,
  transportType: HttpMcpTransportType,
): ResolvedHttpMcpTransportConfig | null {
  const launch = resolveHttpMcpServerLaunchConfig(rawServer, {
    transportType,
    onDroppedHeader: (key) => {
      logWarn(
        `bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`,
      );
    },
    onMalformedHeaders: () => {
      logWarn(
        `bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`,
      );
    },
  });
  if (!launch.ok) {
    return null;
  }
  return {
    kind: "http",
    transportType: launch.config.transportType,
    url: launch.config.url,
    headers: launch.config.headers,
<<<<<<< HEAD
    description: describeHttpMcpServerLaunchConfig(launch.config),
    connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
  };
}

=======
    ...(rawServer &&
    typeof rawServer === "object" &&
    (rawServer as { auth?: unknown }).auth === "oauth"
      ? { auth: "oauth" as const }
      : {}),
    ...(rawServer &&
    typeof rawServer === "object" &&
    (rawServer as { oauth?: unknown }).oauth &&
    typeof (rawServer as { oauth?: unknown }).oauth === "object" &&
    !Array.isArray((rawServer as { oauth?: unknown }).oauth)
      ? { oauth: (rawServer as { oauth: Record<string, unknown> }).oauth }
      : {}),
    ...(getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) !== undefined
      ? { sslVerify: getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) }
      : {}),
    ...(getStringField(rawServer, ["clientCert", "client_cert"])
      ? { clientCert: getStringField(rawServer, ["clientCert", "client_cert"]) }
      : {}),
    ...(getStringField(rawServer, ["clientKey", "client_key"])
      ? { clientKey: getStringField(rawServer, ["clientKey", "client_key"]) }
      : {}),
    description: describeHttpMcpServerLaunchConfig(launch.config),
    connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
    requestTimeoutMs: getRequestTimeoutMs(rawServer),
    supportsParallelToolCalls:
      getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ??
      false,
  };
}

/** Resolve one MCP server's launch transport config, or null when unsupported. */
>>>>>>> upstream/main
export function resolveMcpTransportConfig(
  serverName: string,
  rawServer: unknown,
): ResolvedMcpTransportConfig | null {
<<<<<<< HEAD
  const requestedTransport = getRequestedTransport(rawServer);
  const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer);
  if (stdioLaunch.ok) {
=======
  const logServerName = sanitizeForLog(serverName);
  const requestedTransport = getRequestedTransport(rawServer);
  const requestedTransportAlias = requestedTransport ? "" : getRequestedTransportAlias(rawServer);
  const effectiveTransport = requestedTransport || requestedTransportAlias;
  const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, {
    onDroppedEnv: (key) => {
      logWarn(
        `bundle-mcp: server "${logServerName}": env "${sanitizeForLog(key)}" is blocked for stdio startup safety and was ignored.`,
      );
    },
  });
  if (stdioLaunch.ok) {
    // A command-bearing server is always treated as stdio even when HTTP-ish
    // aliases are present, matching existing MCP config precedence.
>>>>>>> upstream/main
    return {
      kind: "stdio",
      transportType: "stdio",
      command: stdioLaunch.config.command,
      args: stdioLaunch.config.args,
      env: stdioLaunch.config.env,
      cwd: stdioLaunch.config.cwd,
      description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
      connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
<<<<<<< HEAD
=======
      requestTimeoutMs: getRequestTimeoutMs(rawServer),
      supportsParallelToolCalls:
        getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ??
        false,
>>>>>>> upstream/main
    };
  }

  if (
<<<<<<< HEAD
    requestedTransport &&
    requestedTransport !== "sse" &&
    requestedTransport !== "streamable-http"
  ) {
    logWarn(
      `bundle-mcp: skipped server "${serverName}" because transport "${requestedTransport}" is not supported.`,
=======
    effectiveTransport &&
    effectiveTransport !== "sse" &&
    effectiveTransport !== "streamable-http"
  ) {
    logWarn(
      `bundle-mcp: skipped server "${logServerName}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`,
>>>>>>> upstream/main
    );
    return null;
  }

<<<<<<< HEAD
  if (requestedTransport === "streamable-http") {
=======
  if (effectiveTransport === "streamable-http") {
>>>>>>> upstream/main
    const httpTransport = resolveHttpTransportConfig(serverName, rawServer, "streamable-http");
    if (httpTransport) {
      return httpTransport;
    }
  }

  const sseTransport = resolveHttpTransportConfig(serverName, rawServer, "sse");
  if (sseTransport) {
    return sseTransport;
  }

  const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
  const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
  logWarn(
<<<<<<< HEAD
    `bundle-mcp: skipped server "${serverName}" because ${stdioLaunch.reason} and ${httpReason}.`,
=======
    `bundle-mcp: skipped server "${logServerName}" because ${stdioLaunch.reason} and ${httpReason}.`,
>>>>>>> upstream/main
  );
  return null;
}
