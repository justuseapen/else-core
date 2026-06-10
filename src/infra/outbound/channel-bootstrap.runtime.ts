<<<<<<< HEAD
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import type { OpenClawConfig } from "../../config/config.js";
import { applyPluginAutoEnable } from "../../config/plugin-auto-enable.js";
import { resolveRuntimePluginRegistry } from "../../plugins/loader.js";
import {
  getActivePluginChannelRegistry,
  getActivePluginChannelRegistryVersion,
=======
// Outbound channel bootstrap lazily loads runtime plugins for selected channels
// when only setup-shell metadata is active.
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { applyPluginAutoEnable } from "../../config/plugin-auto-enable.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { resolveRuntimePluginRegistry } from "../../plugins/loader.js";
import type { PluginChannelRegistration } from "../../plugins/registry-types.js";
import {
  getActivePluginChannelRegistry,
  getActivePluginChannelRegistryVersion,
  getActivePluginRegistry,
  getActivePluginRegistryVersion,
>>>>>>> upstream/main
} from "../../plugins/runtime.js";
import type { DeliverableMessageChannel } from "../../utils/message-channel.js";

const bootstrapAttempts = new Set<string>();

<<<<<<< HEAD
=======
/** Clears the per-registry channel bootstrap retry guard for isolated tests. */
>>>>>>> upstream/main
export function resetOutboundChannelBootstrapStateForTests(): void {
  bootstrapAttempts.clear();
}

<<<<<<< HEAD
=======
function channelEntryCanSend(entry: PluginChannelRegistration | undefined): boolean {
  return Boolean(entry?.plugin?.outbound?.sendText ?? entry?.plugin?.message?.send?.text);
}

function findChannelEntry(
  registry: ReturnType<typeof getActivePluginRegistry>,
  channel: DeliverableMessageChannel,
): PluginChannelRegistration | undefined {
  return registry?.channels?.find((entry) => entry?.plugin?.id === channel);
}

function canResolveSendCapableChannel(channel: DeliverableMessageChannel): boolean {
  const activeChannelRegistry = getActivePluginChannelRegistry();
  const channelEntry = findChannelEntry(activeChannelRegistry, channel);
  if (channelEntryCanSend(channelEntry)) {
    return true;
  }

  const activeRegistry = getActivePluginRegistry();
  if (activeRegistry && activeRegistry !== activeChannelRegistry) {
    return channelEntryCanSend(findChannelEntry(activeRegistry, channel));
  }
  return false;
}

/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
>>>>>>> upstream/main
export function bootstrapOutboundChannelPlugin(params: {
  channel: DeliverableMessageChannel;
  cfg?: OpenClawConfig;
}): void {
  const cfg = params.cfg;
  if (!cfg) {
    return;
  }

<<<<<<< HEAD
  const activeChannelRegistry = getActivePluginChannelRegistry();
  const activeHasRequestedChannel = activeChannelRegistry?.channels?.some(
    (entry) => entry?.plugin?.id === params.channel,
  );
  if (activeHasRequestedChannel) {
    return;
  }

  const attemptKey = `${getActivePluginChannelRegistryVersion()}:${params.channel}`;
  if (bootstrapAttempts.has(attemptKey)) {
    return;
  }
=======
  if (canResolveSendCapableChannel(params.channel)) {
    return;
  }

  const attemptKey = `${getActivePluginChannelRegistryVersion()}:${getActivePluginRegistryVersion()}:${params.channel}`;
  if (bootstrapAttempts.has(attemptKey)) {
    return;
  }
  // Retry once per registry version/channel; failed loads clear the guard below
  // so config fixes in the same process can try again.
>>>>>>> upstream/main
  bootstrapAttempts.add(attemptKey);

  const autoEnabled = applyPluginAutoEnable({ config: cfg });
  const defaultAgentId = resolveDefaultAgentId(autoEnabled.config);
  const workspaceDir = resolveAgentWorkspaceDir(autoEnabled.config, defaultAgentId);
  try {
    resolveRuntimePluginRegistry({
      config: autoEnabled.config,
      activationSourceConfig: cfg,
      autoEnabledReasons: autoEnabled.autoEnabledReasons,
      workspaceDir,
      runtimeOptions: {
        allowGatewaySubagentBinding: true,
      },
    });
<<<<<<< HEAD
=======
    if (!canResolveSendCapableChannel(params.channel)) {
      bootstrapAttempts.delete(attemptKey);
    }
>>>>>>> upstream/main
  } catch {
    bootstrapAttempts.delete(attemptKey);
  }
}
