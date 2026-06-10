<<<<<<< HEAD
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { z } from "openclaw/plugin-sdk/zod";
import type { OpenClawPluginConfigSchema } from "../runtime-api.js";

export const ACPX_PERMISSION_MODES = ["approve-all", "approve-reads", "deny-all"] as const;
export type AcpxPermissionMode = (typeof ACPX_PERMISSION_MODES)[number];

export const ACPX_NON_INTERACTIVE_POLICIES = ["deny", "fail"] as const;
export type AcpxNonInteractivePermissionPolicy = (typeof ACPX_NON_INTERACTIVE_POLICIES)[number];

=======
/**
 * ACPX plugin configuration schema and public config types. Runtime setup uses
 * this file as the single source of truth for validation and defaulting.
 */
import { z } from "zod";

const ACPX_PERMISSION_MODES = ["approve-all", "approve-reads", "deny-all"] as const;
/** Permission policy applied to interactive ACPX tool requests. */
export type AcpxPermissionMode = (typeof ACPX_PERMISSION_MODES)[number];

const ACPX_NON_INTERACTIVE_POLICIES = ["deny", "fail"] as const;
/** Permission policy applied when ACPX cannot ask a human for approval. */
export type AcpxNonInteractivePermissionPolicy = (typeof ACPX_NON_INTERACTIVE_POLICIES)[number];

/** Default session timeout for ACPX runtime turns. */
export const DEFAULT_ACPX_TIMEOUT_SECONDS = 120;

/** Raw MCP server command config accepted from plugin configuration. */
>>>>>>> upstream/main
export type McpServerConfig = {
  command: string;
  args?: string[];
  env?: Record<string, string>;
};

<<<<<<< HEAD
=======
/** Normalized MCP server config emitted to the ACPX runtime process. */
>>>>>>> upstream/main
export type AcpxMcpServer = {
  name: string;
  command: string;
  args: string[];
  env: Array<{ name: string; value: string }>;
};

<<<<<<< HEAD
export type AcpxPluginConfig = {
  cwd?: string;
  stateDir?: string;
  permissionMode?: AcpxPermissionMode;
  nonInteractivePermissions?: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge?: boolean;
=======
/** User-provided ACPX plugin configuration before defaults are resolved. */
export type AcpxPluginConfig = {
  cwd?: string;
  stateDir?: string;
  probeAgent?: string;
  permissionMode?: AcpxPermissionMode;
  nonInteractivePermissions?: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge?: boolean;
  openClawToolsMcpBridge?: boolean;
>>>>>>> upstream/main
  strictWindowsCmdWrapper?: boolean;
  timeoutSeconds?: number;
  queueOwnerTtlSeconds?: number;
  mcpServers?: Record<string, McpServerConfig>;
<<<<<<< HEAD
  agents?: Record<string, { command: string }>;
};

export type ResolvedAcpxPluginConfig = {
  cwd: string;
  stateDir: string;
  permissionMode: AcpxPermissionMode;
  nonInteractivePermissions: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge: boolean;
  strictWindowsCmdWrapper: boolean;
  timeoutSeconds?: number;
  queueOwnerTtlSeconds: number;
=======
  agents?: Record<string, { command: string; args?: string[] }>;
};

/** Fully resolved ACPX config consumed by the runtime service. */
export type ResolvedAcpxPluginConfig = {
  cwd: string;
  stateDir: string;
  probeAgent?: string;
  permissionMode: AcpxPermissionMode;
  nonInteractivePermissions: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge: boolean;
  openClawToolsMcpBridge: boolean;
  strictWindowsCmdWrapper: boolean;
  timeoutSeconds?: number;
  queueOwnerTtlSeconds: number;
  legacyCompatibilityConfig: {
    strictWindowsCmdWrapper?: boolean;
    queueOwnerTtlSeconds?: number;
  };
>>>>>>> upstream/main
  mcpServers: Record<string, McpServerConfig>;
  agents: Record<string, string>;
};

const nonEmptyTrimmedString = (message: string) =>
  z.string({ error: message }).trim().min(1, { error: message });

const McpServerConfigSchema = z.object({
  command: nonEmptyTrimmedString("command must be a non-empty string").describe(
    "Command to run the MCP server",
  ),
  args: z
    .array(z.string({ error: "args must be an array of strings" }), {
      error: "args must be an array of strings",
    })
    .optional()
    .describe("Arguments to pass to the command"),
  env: z
    .record(z.string(), z.string({ error: "env values must be strings" }), {
      error: "env must be an object of strings",
    })
    .optional()
    .describe("Environment variables for the MCP server"),
});

<<<<<<< HEAD
export const AcpxPluginConfigSchema = z.strictObject({
  cwd: nonEmptyTrimmedString("cwd must be a non-empty string").optional(),
  stateDir: nonEmptyTrimmedString("stateDir must be a non-empty string").optional(),
=======
/** Zod schema for validating raw ACPX plugin config from OpenClaw config. */
export const AcpxPluginConfigSchema = z.strictObject({
  cwd: nonEmptyTrimmedString("cwd must be a non-empty string").optional(),
  stateDir: nonEmptyTrimmedString("stateDir must be a non-empty string").optional(),
  probeAgent: nonEmptyTrimmedString("probeAgent must be a non-empty string").optional(),
>>>>>>> upstream/main
  permissionMode: z
    .enum(ACPX_PERMISSION_MODES, {
      error: `permissionMode must be one of: ${ACPX_PERMISSION_MODES.join(", ")}`,
    })
    .optional(),
  nonInteractivePermissions: z
    .enum(ACPX_NON_INTERACTIVE_POLICIES, {
      error: `nonInteractivePermissions must be one of: ${ACPX_NON_INTERACTIVE_POLICIES.join(", ")}`,
    })
    .optional(),
  pluginToolsMcpBridge: z.boolean({ error: "pluginToolsMcpBridge must be a boolean" }).optional(),
<<<<<<< HEAD
=======
  openClawToolsMcpBridge: z
    .boolean({ error: "openClawToolsMcpBridge must be a boolean" })
    .optional(),
>>>>>>> upstream/main
  strictWindowsCmdWrapper: z
    .boolean({ error: "strictWindowsCmdWrapper must be a boolean" })
    .optional(),
  timeoutSeconds: z
    .number({ error: "timeoutSeconds must be a number >= 0.001" })
    .min(0.001, { error: "timeoutSeconds must be a number >= 0.001" })
<<<<<<< HEAD
    .optional(),
=======
    .default(DEFAULT_ACPX_TIMEOUT_SECONDS),
>>>>>>> upstream/main
  queueOwnerTtlSeconds: z
    .number({ error: "queueOwnerTtlSeconds must be a number >= 0" })
    .min(0, { error: "queueOwnerTtlSeconds must be a number >= 0" })
    .optional(),
  mcpServers: z.record(z.string(), McpServerConfigSchema).optional(),
  agents: z
    .record(
      z.string(),
      z.strictObject({
        command: nonEmptyTrimmedString("agents.<id>.command must be a non-empty string"),
<<<<<<< HEAD
=======
        args: z.array(z.string({ error: "args must be an array of strings" })).optional(),
>>>>>>> upstream/main
      }),
    )
    .optional(),
});
<<<<<<< HEAD

export function createAcpxPluginConfigSchema(): OpenClawPluginConfigSchema {
  return buildPluginConfigSchema(AcpxPluginConfigSchema);
}
=======
>>>>>>> upstream/main
