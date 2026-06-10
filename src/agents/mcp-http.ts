<<<<<<< HEAD
import {
  redactSensitiveUrl,
  redactSensitiveUrlLikeString,
} from "../shared/net/redact-sensitive-url.js";
import { isMcpConfigRecord, toMcpStringRecord } from "./mcp-config-shared.js";

export type HttpMcpTransportType = "sse" | "streamable-http";

export type HttpMcpServerLaunchConfig = {
=======
/**
 * HTTP MCP launch config normalization.
 *
 * MCP server setup uses this to validate SSE/streamable HTTP server records,
 * sanitize headers, and redact sensitive URLs in diagnostics.
 */
import {
  redactSensitiveUrl,
  redactSensitiveUrlLikeString,
} from "@openclaw/net-policy/redact-sensitive-url";
import { isMcpConfigRecord, toMcpStringRecord } from "./mcp-config-shared.js";

/** Supported HTTP-based MCP transport flavors. */
export type HttpMcpTransportType = "sse" | "streamable-http";

type HttpMcpServerLaunchConfig = {
>>>>>>> upstream/main
  transportType: HttpMcpTransportType;
  url: string;
  headers?: Record<string, string>;
};

<<<<<<< HEAD
export type HttpMcpServerLaunchResult =
  | { ok: true; config: HttpMcpServerLaunchConfig }
  | { ok: false; reason: string };

=======
type HttpMcpServerLaunchResult =
  | { ok: true; config: HttpMcpServerLaunchConfig }
  | { ok: false; reason: string };

/** Normalizes an HTTP MCP server config record into a launchable transport config. */
>>>>>>> upstream/main
export function resolveHttpMcpServerLaunchConfig(
  raw: unknown,
  options?: {
    transportType?: HttpMcpTransportType;
    onDroppedHeader?: (key: string, value: unknown) => void;
    onMalformedHeaders?: (value: unknown) => void;
  },
): HttpMcpServerLaunchResult {
  if (!isMcpConfigRecord(raw)) {
    return { ok: false, reason: "server config must be an object" };
  }
  if (typeof raw.url !== "string" || raw.url.trim().length === 0) {
    return { ok: false, reason: "its url is missing" };
  }
  const url = raw.url.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      ok: false,
      reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`,
    };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      reason: `only http and https URLs are supported, got ${parsed.protocol}`,
    };
  }

  let headers: Record<string, string> | undefined;
  if (raw.headers !== undefined && raw.headers !== null) {
    if (!isMcpConfigRecord(raw.headers)) {
      options?.onMalformedHeaders?.(raw.headers);
    } else {
      headers = toMcpStringRecord(raw.headers, {
        onDroppedEntry: options?.onDroppedHeader,
      });
    }
  }

  return {
    ok: true,
    config: {
      transportType: options?.transportType ?? "sse",
      url,
      headers,
    },
  };
}

<<<<<<< HEAD
=======
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
>>>>>>> upstream/main
export function describeHttpMcpServerLaunchConfig(config: HttpMcpServerLaunchConfig): string {
  return redactSensitiveUrl(config.url);
}
