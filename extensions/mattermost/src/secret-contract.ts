<<<<<<< HEAD
=======
// Mattermost plugin module implements secret contract behavior.
>>>>>>> upstream/main
import {
  collectSimpleChannelFieldAssignments,
  getChannelSurface,
  type ResolverContext,
  type SecretDefaults,
  type SecretTargetRegistryEntry,
<<<<<<< HEAD
} from "openclaw/plugin-sdk/security-runtime";

export const secretTargetRegistryEntries = [
=======
} from "openclaw/plugin-sdk/channel-secret-basic-runtime";

export const secretTargetRegistryEntries: SecretTargetRegistryEntry[] = [
>>>>>>> upstream/main
  {
    id: "channels.mattermost.accounts.*.botToken",
    targetType: "channels.mattermost.accounts.*.botToken",
    configFile: "openclaw.json",
    pathPattern: "channels.mattermost.accounts.*.botToken",
    secretShape: "secret_input",
    expectedResolvedValue: "string",
    includeInPlan: true,
    includeInConfigure: true,
    includeInAudit: true,
  },
  {
    id: "channels.mattermost.botToken",
    targetType: "channels.mattermost.botToken",
    configFile: "openclaw.json",
    pathPattern: "channels.mattermost.botToken",
    secretShape: "secret_input",
    expectedResolvedValue: "string",
    includeInPlan: true,
    includeInConfigure: true,
    includeInAudit: true,
  },
<<<<<<< HEAD
] satisfies SecretTargetRegistryEntry[];

export function collectRuntimeConfigAssignments(params: {
  config: { channels?: Record<string, unknown> };
  defaults: SecretDefaults | undefined;
=======
];

export function collectRuntimeConfigAssignments(params: {
  config: { channels?: Record<string, unknown> };
  defaults?: SecretDefaults;
>>>>>>> upstream/main
  context: ResolverContext;
}): void {
  const resolved = getChannelSurface(params.config, "mattermost");
  if (!resolved) {
    return;
  }
  const { channel: mattermost, surface } = resolved;
  collectSimpleChannelFieldAssignments({
    channelKey: "mattermost",
    field: "botToken",
    channel: mattermost,
    surface,
    defaults: params.defaults,
    context: params.context,
    topInactiveReason: "no enabled account inherits this top-level Mattermost botToken.",
    accountInactiveReason: "Mattermost account is disabled.",
  });
}
<<<<<<< HEAD
=======

export const channelSecrets = {
  secretTargetRegistryEntries,
  collectRuntimeConfigAssignments,
};
>>>>>>> upstream/main
