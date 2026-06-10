<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts
import type { AgentTool } from "@mariozechner/pi-agent-core";
import type { TSchema } from "@sinclair/typebox";
import type { OpenClawConfig } from "../../config/config.js";
=======
/**
 * Normalizes and logs provider-specific tool schemas at runtime.
 */
import type { TSchema } from "typebox";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ProviderRuntimePluginHandle } from "../../plugins/provider-hook-runtime.js";
import type { ProviderRuntimeModel } from "../../plugins/provider-runtime-model.types.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
import {
  inspectProviderToolSchemasWithPlugin,
  normalizeProviderToolSchemasWithPlugin,
} from "../../plugins/provider-runtime.js";
<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts
import type { ProviderRuntimeModel } from "../../plugins/types.js";
=======
import type { ProviderToolSchemaDiagnostic } from "../../plugins/types.js";
import type { AgentTool } from "../runtime/index.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
import type { AnyAgentTool } from "../tools/common.js";
import { log } from "./logger.js";

type ProviderToolSchemaParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
  tools: AgentTool<TSchemaType, TResult>[];
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts
};

=======
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowRuntimePluginLoad?: boolean;
};

function buildProviderToolSchemaContext<TSchemaType extends TSchema = TSchema, TResult = unknown>(
  params: ProviderToolSchemaParams<TSchemaType, TResult>,
  provider: string,
) {
  return {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    model: params.model,
    tools: params.tools as unknown as AnyAgentTool[],
  };
}

>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
/**
 * Runs provider-owned tool-schema normalization without encoding provider
 * families in the embedded runner.
 */
export function normalizeProviderToolSchemas<
  TSchemaType extends TSchema = TSchema,
  TResult = unknown,
>(params: ProviderToolSchemaParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[] {
  const provider = params.provider.trim();
  const pluginNormalized = normalizeProviderToolSchemasWithPlugin({
    provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts
    context: {
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      provider,
      modelId: params.modelId,
      modelApi: params.modelApi,
      model: params.model,
      tools: params.tools as unknown as AnyAgentTool[],
    },
=======
    runtimeHandle: params.runtimeHandle,
    allowRuntimePluginLoad: params.allowRuntimePluginLoad,
    context: buildProviderToolSchemaContext(params, provider),
>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
  });
  return Array.isArray(pluginNormalized)
    ? (pluginNormalized as AgentTool<TSchemaType, TResult>[])
    : params.tools;
}

/**
 * Logs provider-owned tool-schema diagnostics after normalization.
 */
export function logProviderToolSchemaDiagnostics(params: ProviderToolSchemaParams): void {
  const provider = params.provider.trim();
  const diagnostics = inspectProviderToolSchemasWithPlugin({
    provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts
    context: {
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      provider,
      modelId: params.modelId,
      modelApi: params.modelApi,
      model: params.model,
      tools: params.tools as unknown as AnyAgentTool[],
    },
=======
    runtimeHandle: params.runtimeHandle,
    allowRuntimePluginLoad: params.allowRuntimePluginLoad,
    context: buildProviderToolSchemaContext(params, provider),
>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
  });
  if (!Array.isArray(diagnostics)) {
    return;
  }
<<<<<<< HEAD:src/agents/pi-embedded-runner/tool-schema-runtime.ts

  log.info("provider tool schema snapshot", {
    provider: params.provider,
    toolCount: params.tools.length,
    tools: params.tools.map((tool, index) => `${index}:${tool.name}`),
  });
  for (const diagnostic of diagnostics) {
    log.warn("provider tool schema diagnostic", {
      provider: params.provider,
      index: diagnostic.toolIndex,
      tool: diagnostic.toolName,
      violations: diagnostic.violations.slice(0, 12),
      violationCount: diagnostic.violations.length,
    });
  }
=======
  if (diagnostics.length === 0) {
    return;
  }

  const summary = summarizeProviderToolSchemaDiagnostics(diagnostics);
  log.warn(
    `provider tool schema diagnostics: ${diagnostics.length} ${diagnostics.length === 1 ? "tool" : "tools"} for ${params.provider}: ${summary}`,
    {
      provider: params.provider,
      toolCount: params.tools.length,
      diagnosticCount: diagnostics.length,
      tools: params.tools.map((tool, index) => `${index}:${tool.name}`),
      diagnostics: diagnostics.map((diagnostic) => ({
        index: diagnostic.toolIndex,
        tool: diagnostic.toolName,
        violations: diagnostic.violations.slice(0, 12),
        violationCount: diagnostic.violations.length,
      })),
    },
  );
}

function summarizeProviderToolSchemaDiagnostics(
  diagnostics: readonly ProviderToolSchemaDiagnostic[],
) {
  const visible = diagnostics.slice(0, 6).map((diagnostic) => {
    const violationCount = diagnostic.violations.length;
    return `${diagnostic.toolName || "unknown"} (${violationCount} ${violationCount === 1 ? "violation" : "violations"})`;
  });
  const remaining = diagnostics.length - visible.length;
  return remaining > 0 ? `${visible.join(", ")}, +${remaining} more` : visible.join(", ");
>>>>>>> upstream/main:src/agents/embedded-agent-runner/tool-schema-runtime.ts
}
