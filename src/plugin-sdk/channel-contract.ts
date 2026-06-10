// Pure channel contract types used by plugin implementations and tests.
export type {
  BaseProbeResult,
  BaseTokenResolution,
  ChannelAgentTool,
  ChannelAccountSnapshot,
  ChannelApprovalAdapter,
  ChannelApprovalCapability,
  ChannelCommandConversationContext,
<<<<<<< HEAD
=======
  ChannelCapabilities,
>>>>>>> upstream/main
  ChannelDirectoryEntry,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelGroupContext,
  ChannelLogSink,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMessageActionDiscoveryContext,
  ChannelMessageActionName,
  ChannelMessageToolDiscovery,
  ChannelMessageToolSchemaContribution,
<<<<<<< HEAD
=======
  ChannelMeta,
>>>>>>> upstream/main
  ChannelStructuredComponents,
  ChannelStatusIssue,
  ChannelThreadingContext,
  ChannelThreadingToolContext,
  ChannelToolSend,
<<<<<<< HEAD
} from "../channels/plugins/types.js";
export type { ChannelLegacyStateMigrationPlan } from "../channels/plugins/types.core.js";
=======
} from "../channels/plugins/types.public.js";
export type { ChannelLegacyStateMigrationPlan } from "../channels/plugins/legacy-state-migration.types.js";
>>>>>>> upstream/main

export type {
  ChannelDirectoryAdapter,
  ChannelDoctorAdapter,
  ChannelDoctorConfigMutation,
  ChannelDoctorEmptyAllowlistAccountContext,
  ChannelDoctorLegacyConfigRule,
  ChannelDoctorSequenceResult,
  ChannelGatewayContext,
  ChannelOutboundAdapter,
<<<<<<< HEAD
} from "../channels/plugins/types.adapters.js";
=======
  ChannelOutboundContext,
  ChannelOutboundPayloadHint,
  ChannelStatusAdapter,
} from "../channels/plugins/types.adapters.js";
export type { ChannelRuntimeSurface } from "../channels/plugins/channel-runtime-surface.types.js";
>>>>>>> upstream/main
