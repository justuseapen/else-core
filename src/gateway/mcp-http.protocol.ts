<<<<<<< HEAD
export const MCP_LOOPBACK_SERVER_NAME = "openclaw";
export const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
export const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"] as const;

export type JsonRpcId = string | number | null | undefined;

=======
/** Server identity advertised by the local MCP loopback initialize response. */
export const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** Protocol-facing loopback server version, independent from the OpenClaw app version. */
export const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** MCP protocol versions accepted by the loopback HTTP bridge, newest first for negotiation. */
export const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"] as const;

type JsonRpcId = string | number | null | undefined;

/** Minimal JSON-RPC request shape accepted by the MCP loopback HTTP handler. */
>>>>>>> upstream/main
export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
};

<<<<<<< HEAD
=======
/**
 * Builds a JSON-RPC success response, using null for notifications or malformed missing ids.
 */
>>>>>>> upstream/main
export function jsonRpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0" as const, id: id ?? null, result };
}

<<<<<<< HEAD
=======
/**
 * Builds a JSON-RPC error response with the same id normalization as success responses.
 */
>>>>>>> upstream/main
export function jsonRpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id: id ?? null, error: { code, message } };
}
