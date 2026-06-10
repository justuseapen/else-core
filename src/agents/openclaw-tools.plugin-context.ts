<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import { normalizeDeliveryContext } from "../utils/delivery-context.js";
import type { GatewayMessageChannel } from "../utils/message-channel.js";
import { resolveAgentWorkspaceDir, resolveSessionAgentId } from "./agent-scope.js";
import { resolveWorkspaceRoot } from "./workspace-dir.js";

=======
/**
 * Runtime context resolver for OpenClaw plugin tools.
 *
 * Normalizes workspace, delivery, browser, sandbox, and active-model inputs before plugin tool invocation.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeDeliveryContext } from "../utils/delivery-context.js";
import type { GatewayMessageChannel } from "../utils/message-channel.js";
import { resolveAgentWorkspaceDir, resolveSessionAgentIds } from "./agent-scope.js";
import { modelKey } from "./model-ref-shared.js";
import type { ToolFsPolicy } from "./tool-fs-policy.js";
import { resolveWorkspaceRoot } from "./workspace-dir.js";

/** Options provided by agent runtime callers when invoking OpenClaw plugin tools. */
>>>>>>> upstream/main
export type OpenClawPluginToolOptions = {
  agentSessionKey?: string;
  agentChannel?: GatewayMessageChannel;
  agentAccountId?: string;
  agentTo?: string;
  agentThreadId?: string | number;
  agentDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
<<<<<<< HEAD
  requesterSenderId?: string | null;
  senderIsOwner?: boolean;
=======
  fsPolicy?: ToolFsPolicy;
  modelProvider?: string;
  modelId?: string;
  requesterSenderId?: string | null;
  requesterAgentIdOverride?: string;
>>>>>>> upstream/main
  sessionId?: string;
  sandboxBrowserBridgeUrl?: string;
  allowHostBrowserControl?: boolean;
  sandboxed?: boolean;
  allowGatewaySubagentBinding?: boolean;
};

<<<<<<< HEAD
=======
/** Resolves plugin-tool context inputs from runtime options and config state. */
>>>>>>> upstream/main
export function resolveOpenClawPluginToolInputs(params: {
  options?: OpenClawPluginToolOptions;
  resolvedConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig;
<<<<<<< HEAD
}) {
  const { options, resolvedConfig, runtimeConfig } = params;
  const sessionAgentId = resolveSessionAgentId({
    sessionKey: options?.agentSessionKey,
    config: resolvedConfig,
=======
  getRuntimeConfig?: () => OpenClawConfig | undefined;
}) {
  const { options, resolvedConfig, runtimeConfig, getRuntimeConfig } = params;
  const { sessionAgentId } = resolveSessionAgentIds({
    sessionKey: options?.agentSessionKey,
    config: resolvedConfig,
    agentId: options?.requesterAgentIdOverride,
>>>>>>> upstream/main
  });
  const inferredWorkspaceDir =
    options?.workspaceDir || !resolvedConfig
      ? undefined
      : resolveAgentWorkspaceDir(resolvedConfig, sessionAgentId);
  const workspaceDir = resolveWorkspaceRoot(options?.workspaceDir ?? inferredWorkspaceDir);
<<<<<<< HEAD
=======
  const modelProvider = options?.modelProvider?.trim();
  const modelId = options?.modelId?.trim();
  const activeModel =
    modelProvider || modelId
      ? {
          ...(modelProvider ? { provider: modelProvider } : {}),
          ...(modelId ? { modelId } : {}),
          ...(modelProvider && modelId ? { modelRef: modelKey(modelProvider, modelId) } : {}),
        }
      : undefined;
  // Delivery context is normalized once here so plugin tools receive the same
  // channel/account/thread shape as gateway-delivered agent tools.
>>>>>>> upstream/main
  const deliveryContext = normalizeDeliveryContext({
    channel: options?.agentChannel,
    to: options?.agentTo,
    accountId: options?.agentAccountId,
    threadId: options?.agentThreadId,
  });

  return {
    context: {
      config: options?.config,
      runtimeConfig,
<<<<<<< HEAD
=======
      getRuntimeConfig,
      fsPolicy: options?.fsPolicy,
>>>>>>> upstream/main
      workspaceDir,
      agentDir: options?.agentDir,
      agentId: sessionAgentId,
      sessionKey: options?.agentSessionKey,
      sessionId: options?.sessionId,
<<<<<<< HEAD
=======
      activeModel,
>>>>>>> upstream/main
      browser: {
        sandboxBridgeUrl: options?.sandboxBrowserBridgeUrl,
        allowHostControl: options?.allowHostBrowserControl,
      },
      messageChannel: options?.agentChannel,
      agentAccountId: options?.agentAccountId,
      deliveryContext,
      requesterSenderId: options?.requesterSenderId ?? undefined,
<<<<<<< HEAD
      senderIsOwner: options?.senderIsOwner ?? undefined,
=======
>>>>>>> upstream/main
      sandboxed: options?.sandboxed,
    },
    allowGatewaySubagentBinding: options?.allowGatewaySubagentBinding,
  };
}
