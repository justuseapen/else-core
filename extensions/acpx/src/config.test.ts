// ACPX tests cover config plugin behavior.
import fs from "node:fs";
<<<<<<< HEAD
=======
import { createRequire } from "node:module";
>>>>>>> upstream/main
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAcpxPluginConfig, resolveAcpxPluginRoot } from "./config.js";

<<<<<<< HEAD
describe("embedded acpx plugin config", () => {
  it("resolves workspace stateDir and cwd by default", () => {
    const workspaceDir = "/tmp/openclaw-acpx";
=======
const requireFromTest = createRequire(import.meta.url);
const TSX_IMPORT = requireFromTest.resolve("tsx");

function expectedMcpServerArgs(params: { sourceEntry: string; distEntry: string }): string[] {
  const distEntry = path.resolve(params.distEntry);
  if (fs.existsSync(distEntry)) {
    return [distEntry];
  }
  return ["--import", TSX_IMPORT, path.resolve(params.sourceEntry)];
}

describe("embedded acpx plugin config", () => {
  it("resolves workspace stateDir and cwd by default", () => {
    const workspaceDir = path.resolve("/tmp/openclaw-acpx");
>>>>>>> upstream/main
    const resolved = resolveAcpxPluginConfig({
      rawConfig: undefined,
      workspaceDir,
    });

    expect(resolved.cwd).toBe(workspaceDir);
    expect(resolved.stateDir).toBe(path.join(workspaceDir, "state"));
    expect(resolved.permissionMode).toBe("approve-reads");
    expect(resolved.nonInteractivePermissions).toBe("fail");
<<<<<<< HEAD
    expect(resolved.agents).toEqual({});
  });

  it("accepts agent command overrides", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        agents: {
          claude: { command: "claude --acp" },
          codex: { command: "codex custom-acp" },
        },
=======
    expect(resolved.timeoutSeconds).toBe(120);
    expect(resolved.agents).toStrictEqual({});
  });

  it("keeps explicit timeoutSeconds config", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        timeoutSeconds: 300,
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.timeoutSeconds).toBe(300);
  });

  it("keeps explicit probeAgent config", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        probeAgent: "claude",
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.probeAgent).toBe("claude");
  });

  it("accepts agent command overrides", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        agents: {
          claude: { command: "claude --acp" },
          codex: { command: "codex custom-acp" },
        },
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.agents).toEqual({
      claude: "claude --acp",
      codex: "codex custom-acp",
    });
  });

  it("combines agent command with args array", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        agents: {
          claude: {
            command: "node",
            args: ["/path/to/adapter.mjs", "--verbose"],
          },
          codex: {
            command: "codex-acp",
            args: ["--model", "gpt-5"],
          },
        },
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.agents).toEqual({
      claude: "node /path/to/adapter.mjs --verbose",
      codex: "codex-acp --model gpt-5",
    });
  });

  it("quotes agent args that need to survive command-line parsing as one token", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        agents: {
          custom: {
            command: "node",
            args: ["/tmp/My Adapter.mjs", "--flag=value with spaces", "owner's-choice"],
          },
        },
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.agents).toEqual({
      custom: "node '/tmp/My Adapter.mjs' '--flag=value with spaces' 'owner'\"'\"'s-choice'",
    });
  });

  it("handles agent command without args (backward compat)", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        agents: {
          simple: { command: "simple-acp" },
        },
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.agents).toEqual({
      simple: "simple-acp",
    });
  });

  it("leaves probeAgent undefined by default so the runtime picks its built-in probe agent", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: undefined,
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.probeAgent).toBeUndefined();
  });

  it("carries an explicit probeAgent through to the resolved plugin config, trimmed and lowercased", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        probeAgent: "  OpenCode  ",
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

    expect(resolved.probeAgent).toBe("opencode");
  });

  it("rejects an empty probeAgent string", () => {
    expect(() =>
      resolveAcpxPluginConfig({
        rawConfig: {
          probeAgent: "",
        },
        workspaceDir: "/tmp/openclaw-acpx",
      }),
    ).toThrow(/probeAgent must be a non-empty string/);
  });

  it("injects the built-in plugin-tools MCP server only when explicitly enabled", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        pluginToolsMcpBridge: true,
>>>>>>> upstream/main
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

<<<<<<< HEAD
    expect(resolved.agents).toEqual({
      claude: "claude --acp",
      codex: "codex custom-acp",
    });
  });

  it("injects the built-in plugin-tools MCP server only when explicitly enabled", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        pluginToolsMcpBridge: true,
=======
    const server = resolved.mcpServers["openclaw-plugin-tools"];
    expect(server).toEqual({
      command: process.execPath,
      args: expectedMcpServerArgs({
        sourceEntry: "src/mcp/plugin-tools-serve.ts",
        distEntry: "dist/mcp/plugin-tools-serve.js",
      }),
    });
  });

  it("injects the built-in OpenClaw tools MCP server only when explicitly enabled", () => {
    const resolved = resolveAcpxPluginConfig({
      rawConfig: {
        openClawToolsMcpBridge: true,
>>>>>>> upstream/main
      },
      workspaceDir: "/tmp/openclaw-acpx",
    });

<<<<<<< HEAD
    const server = resolved.mcpServers["openclaw-plugin-tools"];
    expect(server).toBeDefined();
    expect(server.command).toBe(process.execPath);
    expect(Array.isArray(server.args)).toBe(true);
    expect(server.args?.length).toBeGreaterThan(0);
=======
    const server = resolved.mcpServers["openclaw-tools"];
    expect(server).toEqual({
      command: process.execPath,
      args: expectedMcpServerArgs({
        sourceEntry: "src/mcp/openclaw-tools-serve.ts",
        distEntry: "dist/mcp/openclaw-tools-serve.js",
      }),
    });
  });

  it("resolves the plugin root from shared dist chunk paths", () => {
    const moduleUrl = new URL("../../../dist/extensions/acpx/service-shared.js", import.meta.url)
      .href;

    expect(resolveAcpxPluginRoot(moduleUrl)).toBe(path.resolve("extensions/acpx"));
>>>>>>> upstream/main
  });

  it("keeps the runtime json schema in sync with the manifest config schema", () => {
    const pluginRoot = resolveAcpxPluginRoot();
    const manifest = JSON.parse(
      fs.readFileSync(path.join(pluginRoot, "openclaw.plugin.json"), "utf8"),
    ) as { configSchema?: unknown };

<<<<<<< HEAD
    expect(manifest.configSchema).toMatchObject({
      type: "object",
      additionalProperties: false,
      properties: expect.objectContaining({
        cwd: expect.any(Object),
        stateDir: expect.any(Object),
        agents: expect.any(Object),
        mcpServers: expect.any(Object),
      }),
=======
    expect(manifest.configSchema).toStrictEqual({
      type: "object",
      additionalProperties: false,
      properties: {
        cwd: {
          type: "string",
          minLength: 1,
        },
        stateDir: {
          type: "string",
          minLength: 1,
        },
        permissionMode: {
          type: "string",
          enum: ["approve-all", "approve-reads", "deny-all"],
        },
        nonInteractivePermissions: {
          type: "string",
          enum: ["deny", "fail"],
        },
        pluginToolsMcpBridge: {
          type: "boolean",
        },
        openClawToolsMcpBridge: {
          type: "boolean",
        },
        strictWindowsCmdWrapper: {
          type: "boolean",
        },
        timeoutSeconds: {
          type: "number",
          minimum: 0.001,
          default: 120,
        },
        queueOwnerTtlSeconds: {
          type: "number",
          minimum: 0,
        },
        probeAgent: {
          type: "string",
          minLength: 1,
        },
        mcpServers: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              command: {
                type: "string",
                minLength: 1,
                description: "Command to run the MCP server",
              },
              args: {
                type: "array",
                items: { type: "string" },
                description: "Arguments to pass to the command",
              },
              env: {
                type: "object",
                additionalProperties: { type: "string" },
                description: "Environment variables for the MCP server",
              },
            },
            required: ["command"],
          },
        },
        agents: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              command: {
                type: "string",
                minLength: 1,
              },
              args: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["command"],
          },
        },
      },
>>>>>>> upstream/main
    });
  });
});
