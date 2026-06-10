// Discord plugin module implements native command behavior.
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { resolveNativeCommandSessionTargets } from "openclaw/plugin-sdk/command-auth-native";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { buildPairingReply } from "openclaw/plugin-sdk/conversation-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import {
  buildCommandTextFromArgs,
  findCommandByNativeName,
  parseCommandArgs,
  resolveCommandArgMenu,
  serializeCommandArgs,
  type ChatCommandDefinition,
  type NativeCommandSpec,
} from "openclaw/plugin-sdk/native-command-registry";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { createSubsystemLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import {
  resolveDiscordAccountAllowFrom,
  resolveDiscordAccountDmPolicy,
  resolveDiscordMaxLinesPerMessage,
} from "../accounts.js";
import {
  Button,
  Command,
  StringSelectMenu,
  type ButtonInteraction,
  type CommandInteraction,
  type CommandOptions,
  type StringSelectMenuInteraction,
<<<<<<< HEAD
} from "@buape/carbon";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { createChannelReplyPipeline } from "openclaw/plugin-sdk/channel-reply-pipeline";
import { resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-streaming";
import {
  resolveCommandAuthorizedFromAuthorizers,
  resolveNativeCommandSessionTargets,
} from "openclaw/plugin-sdk/command-auth-native";
import type { OpenClawConfig, loadConfig } from "openclaw/plugin-sdk/config-runtime";
import { buildPairingReply } from "openclaw/plugin-sdk/conversation-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import {
  buildCommandTextFromArgs,
  findCommandByNativeName,
  listChatCommands,
  parseCommandArgs,
  resolveCommandArgChoices,
  resolveCommandArgMenu,
  serializeCommandArgs,
  type ChatCommandDefinition,
  type CommandArgDefinition,
  type CommandArgValues,
  type CommandArgs,
  type NativeCommandSpec,
} from "openclaw/plugin-sdk/native-command-registry";
import * as pluginRuntime from "openclaw/plugin-sdk/plugin-runtime";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import {
  dispatchReplyWithDispatcher,
  type ReplyPayload,
} from "openclaw/plugin-sdk/reply-dispatch-runtime";
import {
  resolveSendableOutboundReplyParts,
  resolveTextChunksWithFallback,
} from "openclaw/plugin-sdk/reply-payload";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { loadWebMedia } from "openclaw/plugin-sdk/web-media";
import { resolveDiscordMaxLinesPerMessage } from "../accounts.js";
import { chunkDiscordTextWithMode } from "../chunk.js";
import {
  isDiscordGroupAllowedByPolicy,
  normalizeDiscordAllowList,
  normalizeDiscordSlug,
  resolveDiscordChannelPolicyCommandAuthorizer,
  resolveGroupDmAllow,
  resolveDiscordChannelConfigWithFallback,
  resolveDiscordAllowListMatch,
  resolveDiscordGuildEntry,
  resolveDiscordMemberAccessState,
=======
} from "../internal/discord.js";
import {
  resolveDiscordChannelPolicyCommandAuthorizer,
>>>>>>> upstream/main
  resolveDiscordOwnerAccess,
} from "./allow-list.js";
import { resolveDiscordChannelTopicSafe } from "./channel-access.js";
import { resolveDiscordDmCommandAccess } from "./dm-command-auth.js";
import { handleDiscordDmCommandDecision } from "./dm-command-decision.js";
import { dispatchDiscordNativeAgentReply } from "./native-command-agent-reply.js";
import {
  resolveDiscordCommandOwnerAllowFrom,
  resolveDiscordGuildNativeCommandAuthorized,
  resolveDiscordNativeAutocompleteAuthorized,
  resolveDiscordNativeCommandChannelAccessContext,
  resolveDiscordNativeGroupDmAccess,
} from "./native-command-auth.js";
import {
  shouldBypassConfiguredAcpEnsure,
  shouldBypassConfiguredAcpGuildGuards,
} from "./native-command-bypass.js";
import { buildDiscordNativeCommandContext } from "./native-command-context.js";
import type { DispatchDiscordCommandInteractionResult } from "./native-command-dispatch.js";
import {
  DISCORD_EMPTY_VISIBLE_REPLY_WARNING,
  deliverDiscordInteractionReply,
  hasRenderableReplyPayload,
  safeDiscordInteractionCall,
} from "./native-command-reply.js";
import { maybeDeliverDiscordDirectStatus } from "./native-command-status.js";
import {
  buildDiscordCommandArgMenu,
  createDiscordCommandArgFallbackButton as createDiscordCommandArgFallbackButtonUi,
  createDiscordModelPickerFallbackButton as createDiscordModelPickerFallbackButtonUi,
  createDiscordModelPickerFallbackSelect as createDiscordModelPickerFallbackSelectUi,
  replyWithDiscordModelPickerProviders,
  resolveDiscordNativeChoiceContext,
  shouldOpenDiscordModelPickerFromCommand,
  type DiscordCommandArgContext,
  type DiscordModelPickerContext,
} from "./native-command-ui.js";
import { createNativeCommandDefinition, readDiscordCommandArgs } from "./native-command.args.js";
import {
  buildDiscordCommandOptions,
  truncateDiscordCommandDescriptionLocalizations,
  truncateDiscordCommandDescription,
} from "./native-command.options.js";
import { nativeCommandRuntime } from "./native-command.runtime.js";
import type { DiscordCommandArgs, DiscordConfig } from "./native-command.types.js";
import { resolveDiscordNativeInteractionChannelContext } from "./native-interaction-channel-context.js";
import { resolveDiscordSenderIdentity } from "./sender-identity.js";
import type { ThreadBindingManager } from "./thread-bindings.js";

const log = createSubsystemLogger("discord/native-command");
<<<<<<< HEAD
// Discord application command and option descriptions are limited to 1-100 chars.
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
const DISCORD_COMMAND_DESCRIPTION_MAX = 100;
let matchPluginCommandImpl = pluginRuntime.matchPluginCommand;
let executePluginCommandImpl = pluginRuntime.executePluginCommand;
let dispatchReplyWithDispatcherImpl = dispatchReplyWithDispatcher;
let resolveDiscordNativeInteractionRouteStateImpl = resolveDiscordNativeInteractionRouteState;

export const __testing = {
  setMatchPluginCommand(
    next: typeof pluginRuntime.matchPluginCommand,
  ): typeof pluginRuntime.matchPluginCommand {
    const previous = matchPluginCommandImpl;
    matchPluginCommandImpl = next;
    return previous;
  },
  setExecutePluginCommand(
    next: typeof pluginRuntime.executePluginCommand,
  ): typeof pluginRuntime.executePluginCommand {
    const previous = executePluginCommandImpl;
    executePluginCommandImpl = next;
    return previous;
  },
  setDispatchReplyWithDispatcher(
    next: typeof dispatchReplyWithDispatcher,
  ): typeof dispatchReplyWithDispatcher {
    const previous = dispatchReplyWithDispatcherImpl;
    dispatchReplyWithDispatcherImpl = next;
    return previous;
  },
  setResolveDiscordNativeInteractionRouteState(
    next: typeof resolveDiscordNativeInteractionRouteState,
  ): typeof resolveDiscordNativeInteractionRouteState {
    const previous = resolveDiscordNativeInteractionRouteStateImpl;
    resolveDiscordNativeInteractionRouteStateImpl = next;
    return previous;
  },
};

function truncateDiscordCommandDescription(params: { value: string; label: string }): string {
  const { value, label } = params;
  if (value.length <= DISCORD_COMMAND_DESCRIPTION_MAX) {
    return value;
  }
  log.warn(
    `discord: truncating native command description (${label}) from ${value.length} to ${DISCORD_COMMAND_DESCRIPTION_MAX}: ${JSON.stringify(value)}`,
  );
  return value.slice(0, DISCORD_COMMAND_DESCRIPTION_MAX);
}

function resolveDiscordCommandLogLabel(command: ChatCommandDefinition): string {
  if (typeof command.nativeName === "string" && command.nativeName.trim().length > 0) {
    return command.nativeName;
  }
  return command.key;
}

function resolveDiscordNativeCommandAllowlistAccess(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  sender: { id: string; name?: string; tag?: string };
  chatType: "direct" | "group" | "thread" | "channel";
  conversationId?: string;
  guildId?: string | null;
}) {
  const commandsAllowFrom = params.cfg.commands?.allowFrom;
  if (!commandsAllowFrom || typeof commandsAllowFrom !== "object") {
    return { configured: false, allowed: false } as const;
  }
  const rawAllowList = Array.isArray(commandsAllowFrom.discord)
    ? commandsAllowFrom.discord
    : commandsAllowFrom["*"];
  if (!Array.isArray(rawAllowList)) {
    return { configured: false, allowed: false } as const;
  }
  // Check guild-level entries (e.g. "guild:123456") before user matching.
  const guildId = params.guildId?.trim();
  if (guildId) {
    for (const entry of rawAllowList) {
      const text = String(entry).trim();
      if (text.startsWith("guild:") && text.slice("guild:".length) === guildId) {
        return { configured: true, allowed: true } as const;
      }
    }
  }
  const allowList = normalizeDiscordAllowList(rawAllowList.map(String), [
    "discord:",
    "user:",
    "pk:",
  ]);
  if (!allowList) {
    return { configured: true, allowed: false } as const;
  }
  const match = resolveDiscordAllowListMatch({
    allowList,
    candidate: params.sender,
    allowNameMatching: false,
  });
  return { configured: true, allowed: match.allowed } as const;
}

function resolveDiscordGuildNativeCommandAuthorized(params: {
  cfg: ReturnType<typeof loadConfig>;
  discordConfig: DiscordConfig;
  useAccessGroups: boolean;
  commandsAllowFromAccess: ReturnType<typeof resolveDiscordNativeCommandAllowlistAccess>;
  guildInfo?: ReturnType<typeof resolveDiscordGuildEntry> | null;
  channelConfig?: ReturnType<typeof resolveDiscordChannelConfigWithFallback> | null;
  memberRoleIds: string[];
  sender: { id: string; name?: string; tag?: string };
  allowNameMatching: boolean;
  ownerAllowListConfigured: boolean;
  ownerAllowed: boolean;
}) {
  const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: params.cfg.channels?.discord !== undefined,
    groupPolicy: params.discordConfig?.groupPolicy,
    defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy,
  });
  const policyAuthorizer = resolveDiscordChannelPolicyCommandAuthorizer({
    groupPolicy,
    guildInfo: params.guildInfo,
    channelConfig: params.channelConfig,
  });
  if (!policyAuthorizer.allowed) {
    return false;
  }
  const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
    channelConfig: params.channelConfig,
    guildInfo: params.guildInfo,
    memberRoleIds: params.memberRoleIds,
    sender: params.sender,
    allowNameMatching: params.allowNameMatching,
  });
  const commandAllowlistAuthorizer = {
    configured: params.commandsAllowFromAccess.configured,
    allowed: params.commandsAllowFromAccess.allowed,
  };
  const ownerAuthorizer = {
    configured: params.ownerAllowListConfigured,
    allowed: params.ownerAllowed,
  };
  const memberAuthorizer = {
    configured: hasAccessRestrictions,
    allowed: memberAllowed,
  };
  const fallbackAuthorizers = [policyAuthorizer, ownerAuthorizer, memberAuthorizer];
  return resolveCommandAuthorizedFromAuthorizers({
    useAccessGroups: params.useAccessGroups,
    authorizers: params.useAccessGroups
      ? params.commandsAllowFromAccess.configured
        ? [commandAllowlistAuthorizer]
        : fallbackAuthorizers
      : params.commandsAllowFromAccess.configured
        ? [commandAllowlistAuthorizer]
        : fallbackAuthorizers,
    modeWhenAccessGroupsOff: "configured",
  });
}

function buildDiscordCommandOptions(params: {
  command: ChatCommandDefinition;
  cfg: ReturnType<typeof loadConfig>;
  authorizeChoiceContext?: (interaction: AutocompleteInteraction) => Promise<boolean>;
  resolveChoiceContext?: (
    interaction: AutocompleteInteraction,
  ) => Promise<{ provider?: string; model?: string } | null>;
}): CommandOptions | undefined {
  const { command, cfg, authorizeChoiceContext, resolveChoiceContext } = params;
  const commandLabel = resolveDiscordCommandLogLabel(command);
  const args = command.args;
  if (!args || args.length === 0) {
    return undefined;
  }
  return args.map((arg) => {
    const required = arg.required ?? false;
    if (arg.type === "number") {
      return {
        name: arg.name,
        description: truncateDiscordCommandDescription({
          value: arg.description,
          label: `command:${commandLabel} arg:${arg.name}`,
        }),
        type: ApplicationCommandOptionType.Number,
        required,
      };
    }
    if (arg.type === "boolean") {
      return {
        name: arg.name,
        description: truncateDiscordCommandDescription({
          value: arg.description,
          label: `command:${commandLabel} arg:${arg.name}`,
        }),
        type: ApplicationCommandOptionType.Boolean,
        required,
      };
    }
    const resolvedChoices = resolveCommandArgChoices({ command, arg, cfg });
    const shouldAutocomplete =
      arg.preferAutocomplete === true ||
      (resolvedChoices.length > 0 &&
        (typeof arg.choices === "function" || resolvedChoices.length > 25));
    const autocomplete = shouldAutocomplete
      ? async (interaction: AutocompleteInteraction) => {
          if (
            typeof arg.choices === "function" &&
            resolveChoiceContext &&
            authorizeChoiceContext &&
            !(await authorizeChoiceContext(interaction))
          ) {
            await interaction.respond([]);
            return;
          }
          const focused = interaction.options.getFocused();
          const focusValue =
            typeof focused?.value === "string" ? focused.value.trim().toLowerCase() : "";
          const context =
            typeof arg.choices === "function" && resolveChoiceContext
              ? await resolveChoiceContext(interaction)
              : null;
          const choices = resolveCommandArgChoices({
            command,
            arg,
            cfg,
            provider: context?.provider,
            model: context?.model,
          });
          const filtered = focusValue
            ? choices.filter((choice) => choice.label.toLowerCase().includes(focusValue))
            : choices;
          await interaction.respond(
            filtered.slice(0, 25).map((choice) => ({ name: choice.label, value: choice.value })),
          );
        }
      : undefined;
    const choices =
      resolvedChoices.length > 0 && !autocomplete
        ? resolvedChoices
            .slice(0, 25)
            .map((choice) => ({ name: choice.label, value: choice.value }))
        : undefined;
    return {
      name: arg.name,
      description: truncateDiscordCommandDescription({
        value: arg.description,
        label: `command:${commandLabel} arg:${arg.name}`,
      }),
      type: ApplicationCommandOptionType.String,
      required,
      choices,
      autocomplete,
    };
  }) satisfies CommandOptions;
}

function shouldBypassConfiguredAcpEnsure(commandName: string): boolean {
  const normalized = commandName.trim().toLowerCase();
  return normalized === "acp" || normalized === "new" || normalized === "reset";
}

function resolveDiscordNativeGroupDmAccess(params: {
  isGroupDm: boolean;
  groupEnabled?: boolean;
  groupChannels?: string[];
  channelId: string;
  channelName?: string;
  channelSlug: string;
}): { allowed: true } | { allowed: false; reason: "disabled" | "not-allowlisted" } {
  if (!params.isGroupDm) {
    return { allowed: true };
  }
  if (params.groupEnabled === false) {
    return { allowed: false, reason: "disabled" };
  }
  if (
    !resolveGroupDmAllow({
      channels: params.groupChannels,
      channelId: params.channelId,
      channelName: params.channelName,
      channelSlug: params.channelSlug,
    })
  ) {
    return { allowed: false, reason: "not-allowlisted" };
  }
  return { allowed: true };
}

async function resolveDiscordNativeAutocompleteAuthorized(params: {
  interaction: AutocompleteInteraction;
  cfg: ReturnType<typeof loadConfig>;
  discordConfig: DiscordConfig;
  accountId: string;
}): Promise<boolean> {
  const { interaction, cfg, discordConfig, accountId } = params;
  const user = interaction.user;
  if (!user) {
    return false;
  }
  const sender = resolveDiscordSenderIdentity({ author: user, pluralkitInfo: null });
  const channel = interaction.channel;
  const channelType = channel?.type;
  const isDirectMessage = channelType === ChannelType.DM;
  const isGroupDm = channelType === ChannelType.GroupDM;
  const isThreadChannel =
    channelType === ChannelType.PublicThread ||
    channelType === ChannelType.PrivateThread ||
    channelType === ChannelType.AnnouncementThread;
  const channelName = channel && "name" in channel ? (channel.name as string) : undefined;
  const channelSlug = channelName ? normalizeDiscordSlug(channelName) : "";
  const rawChannelId = channel?.id ?? "";
  const memberRoleIds = Array.isArray(interaction.rawData.member?.roles)
    ? interaction.rawData.member.roles.map((roleId: string) => String(roleId))
    : [];
  const allowNameMatching = isDangerousNameMatchingEnabled(discordConfig);
  const useAccessGroups = cfg.commands?.useAccessGroups !== false;
  const { ownerAllowList, ownerAllowed: ownerOk } = resolveDiscordOwnerAccess({
    allowFrom: discordConfig?.allowFrom ?? discordConfig?.dm?.allowFrom ?? [],
    sender: {
      id: sender.id,
      name: sender.name,
      tag: sender.tag,
    },
    allowNameMatching,
  });
  const commandsAllowFromAccess = resolveDiscordNativeCommandAllowlistAccess({
    cfg,
    accountId,
    sender: {
      id: sender.id,
      name: sender.name,
      tag: sender.tag,
    },
    chatType: isDirectMessage
      ? "direct"
      : isThreadChannel
        ? "thread"
        : interaction.guild
          ? "channel"
          : "group",
    conversationId: rawChannelId || undefined,
    guildId: interaction.guild?.id,
  });
  const guildInfo = resolveDiscordGuildEntry({
    guild: interaction.guild ?? undefined,
    guildId: interaction.guild?.id ?? undefined,
    guildEntries: discordConfig?.guilds,
  });
  let threadParentId: string | undefined;
  let threadParentName: string | undefined;
  let threadParentSlug = "";
  if (interaction.guild && channel && isThreadChannel && rawChannelId) {
    const channelInfo = await resolveDiscordChannelInfo(interaction.client, rawChannelId);
    const parentInfo = await resolveDiscordThreadParentInfo({
      client: interaction.client,
      threadChannel: {
        id: rawChannelId,
        name: channelName,
        parentId: "parentId" in channel ? (channel.parentId ?? undefined) : undefined,
        parent: undefined,
      },
      channelInfo,
    });
    threadParentId = parentInfo.id;
    threadParentName = parentInfo.name;
    threadParentSlug = threadParentName ? normalizeDiscordSlug(threadParentName) : "";
  }
  const channelConfig = interaction.guild
    ? resolveDiscordChannelConfigWithFallback({
        guildInfo,
        channelId: rawChannelId,
        channelName,
        channelSlug,
        parentId: threadParentId,
        parentName: threadParentName,
        parentSlug: threadParentSlug,
        scope: isThreadChannel ? "thread" : "channel",
      })
    : null;
  if (channelConfig?.enabled === false) {
    return false;
  }
  if (interaction.guild && channelConfig?.allowed === false) {
    return false;
  }
  if (useAccessGroups && interaction.guild) {
    const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
      providerConfigPresent: cfg.channels?.discord !== undefined,
      groupPolicy: discordConfig?.groupPolicy,
      defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy,
    });
    const policyAuthorizer = resolveDiscordChannelPolicyCommandAuthorizer({
      groupPolicy,
      guildInfo,
      channelConfig,
    });
    if (!policyAuthorizer.allowed) {
      return false;
    }
  }
  const dmEnabled = discordConfig?.dm?.enabled ?? true;
  const dmPolicy = discordConfig?.dmPolicy ?? discordConfig?.dm?.policy ?? "pairing";
  if (isDirectMessage) {
    if (!dmEnabled || dmPolicy === "disabled") {
      return false;
    }
    const dmAccess = await resolveDiscordDmCommandAccess({
      accountId,
      dmPolicy,
      configuredAllowFrom: discordConfig?.allowFrom ?? discordConfig?.dm?.allowFrom ?? [],
      sender: {
        id: sender.id,
        name: sender.name,
        tag: sender.tag,
      },
      allowNameMatching,
      useAccessGroups,
    });
    if (dmAccess.decision !== "allow") {
      return false;
    }
  }
  const groupDmAccess = resolveDiscordNativeGroupDmAccess({
    isGroupDm,
    groupEnabled: discordConfig?.dm?.groupEnabled,
    groupChannels: discordConfig?.dm?.groupChannels,
    channelId: rawChannelId,
    channelName,
    channelSlug,
  });
  if (!groupDmAccess.allowed) {
    return false;
  }
  if (!isDirectMessage) {
    return resolveDiscordGuildNativeCommandAuthorized({
      cfg,
      discordConfig,
      useAccessGroups,
      commandsAllowFromAccess,
      guildInfo,
      channelConfig,
      memberRoleIds,
      sender,
      allowNameMatching,
      ownerAllowListConfigured: ownerAllowList != null,
      ownerAllowed: ownerOk,
    });
  }
  return true;
}

function readDiscordCommandArgs(
  interaction: CommandInteraction,
  definitions?: CommandArgDefinition[],
): CommandArgs | undefined {
  if (!definitions || definitions.length === 0) {
    return undefined;
  }
  const values: CommandArgValues = {};
  for (const definition of definitions) {
    let value: string | number | boolean | null | undefined;
    if (definition.type === "number") {
      value = interaction.options.getNumber(definition.name) ?? null;
    } else if (definition.type === "boolean") {
      value = interaction.options.getBoolean(definition.name) ?? null;
    } else {
      value = interaction.options.getString(definition.name) ?? null;
    }
    if (value != null) {
      values[definition.name] = value;
    }
  }
  return Object.keys(values).length > 0 ? { values } : undefined;
}

function isDiscordUnknownInteraction(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error as {
    discordCode?: number;
    status?: number;
    message?: string;
    rawBody?: { code?: number; message?: string };
  };
  if (err.discordCode === 10062 || err.rawBody?.code === 10062) {
    return true;
  }
  if (err.status === 404 && /Unknown interaction/i.test(err.message ?? "")) {
    return true;
  }
  if (/Unknown interaction/i.test(err.rawBody?.message ?? "")) {
    return true;
  }
  return false;
}

function hasRenderableReplyPayload(payload: ReplyPayload): boolean {
  if (resolveSendableOutboundReplyParts(payload).hasContent) {
    return true;
  }
  const discordData = payload.channelData?.discord as
    | { components?: TopLevelComponents[] }
    | undefined;
  if (Array.isArray(discordData?.components) && discordData.components.length > 0) {
    return true;
  }
  return false;
}

async function safeDiscordInteractionCall<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (isDiscordUnknownInteraction(error)) {
      logVerbose(`discord: ${label} skipped (interaction expired)`);
      return null;
    }
    throw error;
  }
}
=======
export { testing, testing as __testing } from "./native-command.runtime.js";
>>>>>>> upstream/main

export function createDiscordNativeCommand(params: {
  command: NativeCommandSpec;
  cfg: OpenClawConfig;
  discordConfig: DiscordConfig;
  accountId: string;
  sessionPrefix: string;
  ephemeralDefault: boolean;
  threadBindings: ThreadBindingManager;
}): Command {
  const {
    command,
    cfg,
    discordConfig,
    accountId,
    sessionPrefix,
    ephemeralDefault,
    threadBindings,
  } = params;
  const fallbackCommandDefinition = createNativeCommandDefinition(command);
  const pluginCommandMatch = nativeCommandRuntime.matchPluginCommand(`/${command.name}`);
  const commandDefinition =
    pluginCommandMatch !== null
      ? fallbackCommandDefinition
      : (findCommandByNativeName(command.name, "discord", {
          includeBundledChannelFallback: false,
        }) ?? fallbackCommandDefinition);
  const argDefinitions = commandDefinition.args ?? command.args;
  const commandOptions = buildDiscordCommandOptions({
    command: commandDefinition,
    cfg,
    authorizeChoiceContext: async (interaction) =>
      await resolveDiscordNativeAutocompleteAuthorized({
        interaction,
        cfg,
        discordConfig,
        accountId,
        skipCommandOwnerAllowFrom: pluginCommandMatch !== null,
      }),
    resolveChoiceContext: async (interaction) =>
      resolveDiscordNativeChoiceContext({
        interaction,
        cfg,
        accountId,
        threadBindings,
      }),
  });
  const options = commandOptions
    ? (commandOptions satisfies CommandOptions)
    : command.acceptsArgs
      ? ([
          {
            name: "input",
            description: "Command input",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ] satisfies CommandOptions)
      : undefined;

  return new (class extends Command {
    override name = command.name;
    override description = truncateDiscordCommandDescription({
      value: command.description,
      label: `command:${command.name}`,
    });
<<<<<<< HEAD
    defer = false;
    ephemeral = ephemeralDefault;
    options = options;

    async run(interaction: CommandInteraction) {
      const deferred = await safeDiscordInteractionCall("interaction defer", () =>
        interaction.defer(),
=======
    override descriptionLocalizations = truncateDiscordCommandDescriptionLocalizations({
      value: command.descriptionLocalizations,
      label: `command:${command.name}`,
    });
    override defer = false;
    override ephemeral = ephemeralDefault;
    override options = options;

    async run(interaction: CommandInteraction) {
      const deferred = await safeDiscordInteractionCall("interaction defer", () =>
        interaction.defer({ ephemeral: this.ephemeral }),
>>>>>>> upstream/main
      );
      if (deferred === null) {
        return;
      }
      const commandArgs = argDefinitions?.length
        ? readDiscordCommandArgs(interaction, argDefinitions)
        : command.acceptsArgs
          ? parseCommandArgs(commandDefinition, interaction.options.getString("input") ?? "")
          : undefined;
      const commandArgsWithRaw = commandArgs
        ? ({
            ...commandArgs,
            raw: serializeCommandArgs(commandDefinition, commandArgs) ?? commandArgs.raw,
          } satisfies DiscordCommandArgs)
        : undefined;
      const prompt = buildCommandTextFromArgs(commandDefinition, commandArgsWithRaw);
      await dispatchDiscordCommandInteraction({
        interaction,
        prompt,
        command: commandDefinition,
        commandArgs: commandArgsWithRaw,
        cfg,
        discordConfig,
        accountId,
        sessionPrefix,
        // Slash commands are deferred up front, so all later responses must use
        // follow-up/edit semantics instead of the initial reply endpoint.
        preferFollowUp: true,
        threadBindings,
        responseEphemeral: ephemeralDefault,
      });
    }
  })();
}

async function dispatchDiscordCommandInteraction(params: {
  interaction: CommandInteraction | ButtonInteraction | StringSelectMenuInteraction;
  prompt: string;
  command: ChatCommandDefinition;
  commandArgs?: DiscordCommandArgs;
  cfg: OpenClawConfig;
  discordConfig: DiscordConfig;
  accountId: string;
  sessionPrefix: string;
  preferFollowUp: boolean;
  threadBindings: ThreadBindingManager;
  responseEphemeral?: boolean;
  suppressReplies?: boolean;
}): Promise<DispatchDiscordCommandInteractionResult> {
  const {
    interaction,
    prompt,
    command,
    commandArgs,
    cfg,
    discordConfig,
    accountId,
    sessionPrefix,
    preferFollowUp,
    threadBindings,
    responseEphemeral,
    suppressReplies,
  } = params;
  const commandName = command.nativeName ?? command.key;
  const respond = async (content: string, options?: { ephemeral?: boolean }) => {
    const ephemeral = options?.ephemeral ?? responseEphemeral;
    const payload = {
      content,
      ...(ephemeral !== undefined ? { ephemeral } : {}),
    };
    await safeDiscordInteractionCall("interaction reply", async () => {
      if (preferFollowUp) {
        await interaction.followUp(payload);
        return;
      }
      await interaction.reply(payload);
    });
  };

  const useAccessGroups = cfg.commands?.useAccessGroups !== false;
  const user = interaction.user;
  if (!user) {
    return { accepted: false };
  }
  const sender = resolveDiscordSenderIdentity({ author: user, pluralkitInfo: null });
  const channel = interaction.channel;
  const {
    isDirectMessage,
    isGroupDm,
    isThreadChannel,
    channelName,
    channelSlug,
    rawChannelId,
    threadParentId,
    threadParentName,
    threadParentSlug,
  } = await resolveDiscordNativeInteractionChannelContext({
    channel,
    client: interaction.client,
    hasGuild: Boolean(interaction.guild),
    channelIdFallback: "",
  });
  const memberRoleIds = Array.isArray(interaction.rawData.member?.roles)
    ? interaction.rawData.member.roles.map((roleId: string) => roleId)
    : [];
  const allowNameMatching = isDangerousNameMatchingEnabled(discordConfig);
  const configuredDmAllowFrom =
    resolveDiscordAccountAllowFrom({
      cfg,
      accountId,
    }) ?? [];
  const commandOwnerAllowFrom = resolveDiscordCommandOwnerAllowFrom(cfg);
  const { ownerAllowList: discordOwnerAllowList, ownerAllowed: discordOwnerOk } =
    resolveDiscordOwnerAccess({
      allowFrom: configuredDmAllowFrom,
      sender: {
        id: sender.id,
        name: sender.name,
        tag: sender.tag,
      },
      allowNameMatching,
    });
  const { ownerAllowed: commandOwnerOk } = resolveDiscordOwnerAccess({
    allowFrom: commandOwnerAllowFrom,
    sender: {
      id: sender.id,
      name: sender.name,
      tag: sender.tag,
    },
    allowNameMatching,
  });
  const commandOwnerAllowAll = commandOwnerAllowFrom?.includes("*") === true;
  const senderIsCommandOwner = commandOwnerOk || commandOwnerAllowAll;
  const ownerAllowListConfigured = discordOwnerAllowList != null;
  const ownerOk = discordOwnerOk;
  const { commandsAllowFromAccess, guildInfo, channelConfig } =
    resolveDiscordNativeCommandChannelAccessContext({
      cfg,
      discordConfig,
      accountId,
      sender,
      isDirectMessage,
      isThreadChannel,
      guild: interaction.guild ?? null,
      rawChannelId,
      channelName,
      channelSlug,
      threadParentId,
      threadParentName,
      threadParentSlug,
    });
  let nativeRouteStatePromise:
    | ReturnType<typeof nativeCommandRuntime.resolveDiscordNativeInteractionRouteState>
    | undefined;
  const getNativeRouteState = () =>
    (nativeRouteStatePromise ??= nativeCommandRuntime.resolveDiscordNativeInteractionRouteState({
      cfg,
      accountId,
      guildId: interaction.guild?.id ?? undefined,
      memberRoleIds,
      isDirectMessage,
      isGroupDm,
      directUserId: user.id,
      conversationId: rawChannelId || "unknown",
      parentConversationId: threadParentId,
      threadBinding: isThreadChannel ? threadBindings.getByThreadId(rawChannelId) : undefined,
      enforceConfiguredBindingReadiness: !shouldBypassConfiguredAcpEnsure(commandName),
    }));
  const canBypassConfiguredAcpGuildGuards = async () => {
    if (!interaction.guild || !shouldBypassConfiguredAcpGuildGuards(commandName)) {
      return false;
    }
    const routeState = await getNativeRouteState();
    return (
      routeState.effectiveRoute.matchedBy === "binding.channel" ||
      routeState.boundSessionKey != null ||
      routeState.configuredBinding != null ||
      routeState.configuredRoute != null
    );
  };
  if (channelConfig?.enabled === false && !(await canBypassConfiguredAcpGuildGuards())) {
    await respond("This channel is disabled.");
    return { accepted: false };
  }
  if (
    interaction.guild &&
    channelConfig?.allowed === false &&
    !(await canBypassConfiguredAcpGuildGuards())
  ) {
    await respond("This channel is not allowed.");
    return { accepted: false };
  }
  if (useAccessGroups && interaction.guild) {
    const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
      providerConfigPresent: cfg.channels?.discord !== undefined,
      groupPolicy: discordConfig?.groupPolicy,
      defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy,
    });
    const policyAuthorizer = resolveDiscordChannelPolicyCommandAuthorizer({
      groupPolicy,
      guildInfo,
      channelConfig,
    });
<<<<<<< HEAD
    if (!policyAuthorizer.allowed) {
=======
    if (!policyAuthorizer.allowed && !(await canBypassConfiguredAcpGuildGuards())) {
>>>>>>> upstream/main
      await respond("This channel is not allowed.");
      return { accepted: false };
    }
  }
  const dmEnabled = discordConfig?.dm?.enabled ?? true;
  const dmPolicy = resolveDiscordAccountDmPolicy({ cfg, accountId }) ?? "pairing";
  let commandAuthorized = true;
  if (isDirectMessage) {
    if (!dmEnabled || dmPolicy === "disabled") {
      await respond("Discord DMs are disabled.");
      return { accepted: false };
    }
    const dmAccess = await resolveDiscordDmCommandAccess({
      accountId,
      dmPolicy,
      configuredAllowFrom: configuredDmAllowFrom,
      sender: {
        id: sender.id,
        name: sender.name,
        tag: sender.tag,
      },
      allowNameMatching,
      cfg,
      rest: interaction.client.rest,
    });
    commandAuthorized = dmAccess.senderAccess.allowed ? dmAccess.commandAccess.authorized : false;
    if (dmAccess.senderAccess.decision !== "allow") {
      await handleDiscordDmCommandDecision({
        senderAccess: dmAccess.senderAccess,
        accountId,
        sender: {
          id: user.id,
          tag: sender.tag,
          name: sender.name,
        },
        onPairingCreated: async (code) => {
          await respond(
            buildPairingReply({
              channel: "discord",
              idLine: `Your Discord user id: ${user.id}`,
              code,
            }),
            { ephemeral: true },
          );
        },
        onUnauthorized: async () => {
          await respond("You are not authorized to use this command.", { ephemeral: true });
        },
      });
      return { accepted: false };
    }
  }
  const groupDmAccess = resolveDiscordNativeGroupDmAccess({
    isGroupDm,
    groupEnabled: discordConfig?.dm?.groupEnabled,
    groupChannels: discordConfig?.dm?.groupChannels,
    channelId: rawChannelId,
    channelName,
    channelSlug,
  });
  if (!groupDmAccess.allowed) {
    await respond(
      groupDmAccess.reason === "disabled"
        ? "Discord group DMs are disabled."
        : "This group DM is not allowed.",
    );
<<<<<<< HEAD
    return;
  }
  if (!isDirectMessage) {
    commandAuthorized = resolveDiscordGuildNativeCommandAuthorized({
      cfg,
=======
    return { accepted: false };
  }
  if (!isDirectMessage) {
    commandAuthorized = await resolveDiscordGuildNativeCommandAuthorized({
      cfg,
      accountId,
>>>>>>> upstream/main
      discordConfig,
      useAccessGroups,
      commandsAllowFromAccess,
      guildInfo,
      channelConfig,
      memberRoleIds,
      sender,
      allowNameMatching,
<<<<<<< HEAD
      ownerAllowListConfigured: ownerAllowList != null,
      ownerAllowed: ownerOk,
    });
    if (!commandAuthorized) {
=======
      ownerAllowListConfigured,
      ownerAllowed: ownerOk,
    });
    if (!commandAuthorized && !(await canBypassConfiguredAcpGuildGuards())) {
>>>>>>> upstream/main
      await respond("You are not authorized to use this command.", { ephemeral: true });
      return { accepted: false };
    }
  }
<<<<<<< HEAD
=======

  const pluginMatch = nativeCommandRuntime.matchPluginCommand(prompt);
  if (
    commandOwnerAllowFrom &&
    !senderIsCommandOwner &&
    !commandsAllowFromAccess.allowed &&
    commandName !== "status" &&
    !pluginMatch
  ) {
    await respond("You are not authorized to use this command.", { ephemeral: true });
    return { accepted: false };
  }
>>>>>>> upstream/main

  const isGuild = Boolean(interaction.guild);
  const channelId = rawChannelId || "unknown";
  const menuNeedsModelContext =
    !(commandArgs?.raw && !commandArgs.values) &&
    command.args?.some(
      (arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null,
    );
  const menuModelContext = menuNeedsModelContext
    ? await resolveDiscordNativeChoiceContext({
        interaction: interaction as CommandInteraction,
        cfg,
        accountId,
        threadBindings,
      })
    : null;
  const menu = resolveCommandArgMenu({
    command,
    args: commandArgs,
    cfg,
    provider: menuModelContext?.provider,
    model: menuModelContext?.model,
  });
  if (menu) {
    const menuPayload = buildDiscordCommandArgMenu({
      command,
      menu,
      interaction: interaction as CommandInteraction,
      ctx: {
        cfg,
        discordConfig,
        accountId,
        sessionPrefix,
        threadBindings,
      },
      safeInteractionCall: safeDiscordInteractionCall,
      dispatchCommandInteraction: dispatchDiscordCommandInteraction,
    });
    if (preferFollowUp) {
      await safeDiscordInteractionCall("interaction follow-up", () =>
        interaction.followUp({
          content: menuPayload.content,
          components: menuPayload.components,
          ephemeral: true,
        }),
      );
      return { accepted: true };
    }
    await safeDiscordInteractionCall("interaction reply", () =>
      interaction.reply({
        content: menuPayload.content,
        components: menuPayload.components,
        ephemeral: true,
      }),
    );
    return { accepted: true };
  }

<<<<<<< HEAD
  const pluginMatch = matchPluginCommandImpl(prompt);
  let nativeRouteStatePromise:
    | ReturnType<typeof resolveDiscordNativeInteractionRouteStateImpl>
    | undefined;
  const getNativeRouteState = () =>
    (nativeRouteStatePromise ??= resolveDiscordNativeInteractionRouteStateImpl({
      cfg,
      accountId,
      guildId: interaction.guild?.id ?? undefined,
      memberRoleIds,
      isDirectMessage,
      isGroupDm,
      directUserId: user.id,
      conversationId: rawChannelId || "unknown",
      parentConversationId: threadParentId,
      threadBinding: isThreadChannel ? threadBindings.getByThreadId(rawChannelId) : undefined,
      enforceConfiguredBindingReadiness: !shouldBypassConfiguredAcpEnsure(
        command.nativeName ?? command.key,
      ),
    }));
  if (pluginMatch) {
=======
  if (pluginMatch && commandName !== "status") {
>>>>>>> upstream/main
    if (suppressReplies) {
      return { accepted: true };
    }
<<<<<<< HEAD
    const channelId = rawChannelId || "unknown";
    const isThreadChannel =
      interaction.channel?.type === ChannelType.PublicThread ||
      interaction.channel?.type === ChannelType.PrivateThread ||
      interaction.channel?.type === ChannelType.AnnouncementThread;
    const messageThreadId = !isDirectMessage && isThreadChannel ? channelId : undefined;
    const threadParentId =
      !isDirectMessage && isThreadChannel ? (interaction.channel.parentId ?? undefined) : undefined;
    const { effectiveRoute } = await getNativeRouteState();
    const pluginReply = await executePluginCommandImpl({
=======
    const messageThreadId = !isDirectMessage && isThreadChannel ? channelId : undefined;
    const pluginThreadParentId = !isDirectMessage && isThreadChannel ? threadParentId : undefined;
    const routeState = await getNativeRouteState();
    const { effectiveRoute } = routeState;
    const pluginCommandAgentId =
      (isThreadChannel ? threadBindings.getByThreadId(rawChannelId)?.agentId : undefined) ||
      routeState.configuredBinding?.statefulTarget.agentId ||
      effectiveRoute.agentId;
    const targetSessionEntry = nativeCommandRuntime.getSessionEntry({
      agentId: pluginCommandAgentId,
      sessionKey: effectiveRoute.sessionKey,
    });
    const pluginReply = await nativeCommandRuntime.executePluginCommand({
>>>>>>> upstream/main
      command: pluginMatch.command,
      args: pluginMatch.args,
      senderId: sender.id,
      channel: "discord",
      channelId,
      isAuthorizedSender: commandAuthorized,
<<<<<<< HEAD
      sessionKey: effectiveRoute.sessionKey,
=======
      senderIsOwner: senderIsCommandOwner,
      agentId: pluginCommandAgentId,
      sessionKey: effectiveRoute.sessionKey,
      authProfileId: targetSessionEntry?.authProfileOverride,
>>>>>>> upstream/main
      commandBody: prompt,
      config: cfg,
      from: isDirectMessage
        ? `discord:${user.id}`
        : isGroupDm
          ? `discord:group:${channelId}`
          : `discord:channel:${channelId}`,
      to: `slash:${user.id}`,
      accountId,
      messageThreadId,
<<<<<<< HEAD
      threadParentId,
=======
      threadParentId: pluginThreadParentId,
>>>>>>> upstream/main
    });
    if (!hasRenderableReplyPayload(pluginReply)) {
      await respond(DISCORD_EMPTY_VISIBLE_REPLY_WARNING);
      return { accepted: true, effectiveRoute };
    }
    await deliverDiscordInteractionReply({
      interaction,
      payload: pluginReply,
      textLimit: resolveTextChunkLimit(cfg, "discord", accountId, {
        fallbackLimit: 2000,
      }),
      maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({ cfg, discordConfig, accountId }),
      preferFollowUp,
      responseEphemeral,
      chunkMode: resolveChunkMode(cfg, "discord", accountId),
    });
    return { accepted: true, effectiveRoute };
  }

  const pickerCommandContext = shouldOpenDiscordModelPickerFromCommand({
    command,
    commandArgs,
  });
  if (pickerCommandContext) {
    await replyWithDiscordModelPickerProviders({
      interaction,
      cfg,
      command: pickerCommandContext,
      userId: user.id,
      accountId,
      threadBindings,
      preferFollowUp,
      safeInteractionCall: safeDiscordInteractionCall,
    });
    return { accepted: true };
  }

  const interactionId = interaction.rawData.id;
  const routeState = await getNativeRouteState();
  if (routeState.bindingReadiness && !routeState.bindingReadiness.ok) {
    const configuredBinding = routeState.configuredBinding;
    if (configuredBinding) {
      logVerbose(
        `discord native command: configured ACP binding unavailable for channel ${configuredBinding.record.conversation.conversationId}: ${routeState.bindingReadiness.error}`,
      );
      await respond("Configured ACP binding is unavailable right now. Please try again.");
      return { accepted: false };
    }
  }
  const boundSessionKey = routeState.boundSessionKey;
  const effectiveRoute = routeState.effectiveRoute;
  const { sessionKey, commandTargetSessionKey } = resolveNativeCommandSessionTargets({
    agentId: effectiveRoute.agentId,
    sessionPrefix,
    userId: user.id,
    targetSessionKey: effectiveRoute.sessionKey,
    boundSessionKey,
  });
  const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, effectiveRoute.agentId);
  const ctxPayload = buildDiscordNativeCommandContext({
    prompt,
    commandArgs: commandArgs ?? {},
    sessionKey,
    commandTargetSessionKey,
    accountId: effectiveRoute.accountId,
    interactionId,
    channelId,
    threadParentId,
    memberRoleIds,
    guildId: interaction.guild?.id,
    guildName: interaction.guild?.name,
    channelTopic: resolveDiscordChannelTopicSafe(channel),
    channelConfig,
    guildInfo,
    allowNameMatching,
    commandAuthorized,
    isDirectMessage,
    isGroupDm,
    isGuild,
    isThreadChannel,
    user: {
      id: user.id,
      username: user.username,
      globalName: user.globalName,
    },
    sender: { id: sender.id, name: sender.name, tag: sender.tag },
  });

  const directStatusResult = await maybeDeliverDiscordDirectStatus({
    commandName,
    suppressReplies,
    resolveDirectStatusReplyForSession: nativeCommandRuntime.resolveDirectStatusReplyForSession,
    cfg,
    discordConfig,
    accountId,
    sessionKey,
    commandTargetSessionKey,
    channel: "discord",
    senderId: sender.id,
    senderIsOwner: senderIsCommandOwner,
    isAuthorizedSender: commandAuthorized,
    isGroup: isGuild || isGroupDm,
    defaultGroupActivation: () =>
      !isGuild ? "always" : channelConfig?.requireMention === false ? "always" : "mention",
    interaction,
    mediaLocalRoots,
    preferFollowUp,
    responseEphemeral,
    effectiveRoute,
    respond,
  });
<<<<<<< HEAD
  const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, effectiveRoute.agentId);
  const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(discordConfig);

  let didReply = false;
  const dispatchResult = await dispatchReplyWithDispatcherImpl({
    ctx: ctxPayload,
    cfg,
    dispatcherOptions: {
      ...replyPipeline,
      humanDelay: resolveHumanDelayConfig(cfg, effectiveRoute.agentId),
      deliver: async (payload) => {
        if (suppressReplies) {
          return;
        }
        try {
          await deliverDiscordInteractionReply({
            interaction,
            payload,
            mediaLocalRoots,
            textLimit: resolveTextChunkLimit(cfg, "discord", accountId, {
              fallbackLimit: 2000,
            }),
            maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({ cfg, discordConfig, accountId }),
            preferFollowUp: preferFollowUp || didReply,
            chunkMode: resolveChunkMode(cfg, "discord", accountId),
          });
        } catch (error) {
          if (isDiscordUnknownInteraction(error)) {
            logVerbose("discord: interaction reply skipped (interaction expired)");
            return;
          }
          throw error;
        }
        didReply = true;
      },
      onError: (err, info) => {
        const message = err instanceof Error ? (err.stack ?? err.message) : String(err);
        log.error(`discord slash ${info.kind} reply failed: ${message}`);
      },
    },
    replyOptions: {
      skillFilter: channelConfig?.skills,
      disableBlockStreaming:
        typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : undefined,
      onModelSelected,
    },
  });

  // Fallback: if the agent turn produced no deliverable replies (for example,
  // a skill only used message.send side effects), close the interaction with
  // a minimal acknowledgment so Discord does not stay in a pending state.
  if (
    !suppressReplies &&
    !didReply &&
    dispatchResult.counts.final === 0 &&
    dispatchResult.counts.block === 0 &&
    dispatchResult.counts.tool === 0
  ) {
    await safeDiscordInteractionCall("interaction empty fallback", async () => {
      const payload = {
        content: "✅ Done.",
        ephemeral: true,
      };
      if (preferFollowUp) {
        await interaction.followUp(payload);
        return;
      }
      await interaction.reply(payload);
    });
=======
  if (directStatusResult) {
    return directStatusResult;
>>>>>>> upstream/main
  }

  await dispatchDiscordNativeAgentReply({
    cfg,
    discordConfig,
    accountId,
    interaction,
    ctxPayload,
    effectiveRoute,
    channelConfig,
    mediaLocalRoots,
    preferFollowUp,
    responseEphemeral,
    suppressReplies,
    log,
  });

  return { accepted: true, effectiveRoute };
}

export function createDiscordCommandArgFallbackButton(params: DiscordCommandArgContext): Button {
  return createDiscordCommandArgFallbackButtonUi({
    ctx: params,
    safeInteractionCall: safeDiscordInteractionCall,
    dispatchCommandInteraction: dispatchDiscordCommandInteraction,
  });
}

export function createDiscordModelPickerFallbackButton(params: DiscordModelPickerContext): Button {
  return createDiscordModelPickerFallbackButtonUi({
    ctx: params,
    safeInteractionCall: safeDiscordInteractionCall,
    dispatchCommandInteraction: dispatchDiscordCommandInteraction,
  });
}

export function createDiscordModelPickerFallbackSelect(
  params: DiscordModelPickerContext,
): StringSelectMenu {
  return createDiscordModelPickerFallbackSelectUi({
    ctx: params,
    safeInteractionCall: safeDiscordInteractionCall,
    dispatchCommandInteraction: dispatchDiscordCommandInteraction,
  });
}
