/**
 * Standalone MCP server that exposes OpenClaw plugin-registered tools
 * (e.g. memory-lancedb's memory_recall, memory_store, memory_forget)
 * so ACP sessions running Claude Code can use them.
 *
 * Run via: node --import tsx src/mcp/plugin-tools-serve.ts
 * Or: bun src/mcp/plugin-tools-serve.ts
 */
import { pathToFileURL } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
<<<<<<< HEAD
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import type { AnyAgentTool } from "../agents/tools/common.js";
import type { OpenClawConfig } from "../config/config.js";
import { loadConfig } from "../config/config.js";
import { routeLogsToStderr } from "../logging/console.js";
import { resolvePluginTools } from "../plugins/tools.js";
import { VERSION } from "../version.js";

function resolveJsonSchemaForTool(tool: AnyAgentTool): Record<string, unknown> {
  const params = tool.parameters;
  if (params && typeof params === "object" && "type" in params) {
    return params as Record<string, unknown>;
  }
  // Fallback: accept any object
  return { type: "object", properties: {} };
}

function resolveTools(config: OpenClawConfig): AnyAgentTool[] {
  return resolvePluginTools({
    context: { config },
=======
import { pickSandboxToolPolicy } from "../agents/sandbox-tool-policy.js";
import {
  collectExplicitAllowlist,
  collectExplicitDenylist,
  mergeAlsoAllowPolicy,
  resolveToolProfilePolicy,
} from "../agents/tool-policy.js";
import type { AnyAgentTool } from "../agents/tools/common.js";
import { getRuntimeConfig } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { formatErrorMessage } from "../infra/errors.js";
import { routeLogsToStderr } from "../logging/console.js";
import { ensureStandalonePluginToolRegistryLoaded, resolvePluginTools } from "../plugins/tools.js";
import { connectToolsMcpServerToStdio, createToolsMcpServer } from "./tools-stdio-server.js";

function resolvePluginToolPolicy(config: OpenClawConfig): {
  toolAllowlist?: string[];
  toolDenylist?: string[];
} {
  const profilePolicy = mergeAlsoAllowPolicy(
    resolveToolProfilePolicy(config.tools?.profile),
    config.tools?.alsoAllow,
  );
  const globalPolicy = pickSandboxToolPolicy(config.tools);
  const toolAllowlist = collectExplicitAllowlist([profilePolicy, globalPolicy]);
  const toolDenylist = collectExplicitDenylist([profilePolicy, globalPolicy]);
  return {
    ...(toolAllowlist.length > 0 ? { toolAllowlist } : {}),
    ...(toolDenylist.length > 0 ? { toolDenylist } : {}),
  };
}

function resolveTools(config: OpenClawConfig): AnyAgentTool[] {
  const pluginToolPolicy = resolvePluginToolPolicy(config);
  ensureStandalonePluginToolRegistryLoaded({
    context: { config },
    ...pluginToolPolicy,
  });
  return resolvePluginTools({
    context: { config },
    ...pluginToolPolicy,
>>>>>>> upstream/main
    suppressNameConflicts: true,
  });
}

export function createPluginToolsMcpServer(
  params: {
    config?: OpenClawConfig;
    tools?: AnyAgentTool[];
  } = {},
): Server {
<<<<<<< HEAD
  const cfg = params.config ?? loadConfig();
  const tools = params.tools ?? resolveTools(cfg);

  const toolMap = new Map<string, AnyAgentTool>();
  for (const tool of tools) {
    toolMap.set(tool.name, tool);
  }

  const server = new Server(
    { name: "openclaw-plugin-tools", version: VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? "",
      inputSchema: resolveJsonSchemaForTool(tool),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = toolMap.get(request.params.name);
    if (!tool) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
    }
    try {
      const result = await tool.execute(`mcp-${Date.now()}`, request.params.arguments ?? {});
      return {
        content: Array.isArray(result.content)
          ? result.content
          : [{ type: "text", text: String(result.content) }],
      };
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Tool error: ${err instanceof Error ? err.message : String(err)}` },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function servePluginToolsMcp(): Promise<void> {
  // MCP stdio requires stdout to stay protocol-only.
  routeLogsToStderr();

  const config = loadConfig();
=======
  const cfg = params.config ?? getRuntimeConfig();
  const tools = params.tools ?? resolveTools(cfg);
  return createToolsMcpServer({ name: "openclaw-plugin-tools", tools });
}

export async function servePluginToolsMcp(): Promise<void> {
  // MCP stdio requires stdout to stay protocol-only, including during plugin
  // tool discovery before the transport is connected.
  routeLogsToStderr();

  const config = getRuntimeConfig();
>>>>>>> upstream/main
  const tools = resolveTools(config);
  const server = createPluginToolsMcpServer({ config, tools });
  if (tools.length === 0) {
    process.stderr.write("plugin-tools-serve: no plugin tools found\n");
  }

<<<<<<< HEAD
  const transport = new StdioServerTransport();

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    process.stdin.off("end", shutdown);
    process.stdin.off("close", shutdown);
    process.off("SIGINT", shutdown);
    process.off("SIGTERM", shutdown);
    void server.close();
  };

  process.stdin.once("end", shutdown);
  process.stdin.once("close", shutdown);
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await server.connect(transport);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  servePluginToolsMcp().catch((err) => {
    process.stderr.write(
      `plugin-tools-serve: ${err instanceof Error ? err.message : String(err)}\n`,
    );
=======
  await connectToolsMcpServerToStdio(server);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  servePluginToolsMcp().catch((err: unknown) => {
    process.stderr.write(`plugin-tools-serve: ${formatErrorMessage(err)}\n`);
>>>>>>> upstream/main
    process.exit(1);
  });
}
