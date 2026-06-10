<<<<<<< HEAD
import {
  Button,
  Row,
  Separator,
  TextDisplay,
  serializePayload,
  type ButtonInteraction,
  type ComponentData,
  type MessagePayloadObject,
  type TopLevelComponents,
} from "@buape/carbon";
import { ButtonStyle, Routes } from "discord-api-types/v10";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { DiscordExecApprovalConfig } from "openclaw/plugin-sdk/config-runtime";
import {
  createChannelNativeApprovalRuntime,
  type ExecApprovalChannelRuntime,
} from "openclaw/plugin-sdk/infra-runtime";
import { buildExecApprovalActionDescriptors } from "openclaw/plugin-sdk/infra-runtime";
import { resolveExecApprovalCommandDisplay } from "openclaw/plugin-sdk/infra-runtime";
import { getExecApprovalApproverDmNoticeText } from "openclaw/plugin-sdk/infra-runtime";
import type {
  ExecApprovalActionDescriptor,
  ExecApprovalDecision,
  ExecApprovalRequest,
  ExecApprovalResolved,
  PluginApprovalRequest,
  PluginApprovalResolved,
} from "openclaw/plugin-sdk/infra-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { logDebug, logError } from "openclaw/plugin-sdk/text-runtime";
import {
  createDiscordNativeApprovalAdapter,
  createDiscordApprovalCapability,
  shouldHandleDiscordApprovalRequest,
} from "../approval-native.js";
import {
  getDiscordExecApprovalApprovers,
  isDiscordExecApprovalClientEnabled,
} from "../exec-approvals.js";
import { createDiscordClient, stripUndefinedFields } from "../send.shared.js";
import { DiscordUiContainer } from "../ui.js";

const EXEC_APPROVAL_KEY = "execapproval";
export { extractDiscordChannelId } from "../approval-native.js";
export type {
  ExecApprovalRequest,
  ExecApprovalResolved,
  PluginApprovalRequest,
  PluginApprovalResolved,
};

type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
type ApprovalKind = "exec" | "plugin";

function buildDiscordApprovalDmRedirectNotice(): { content: string } {
  return {
    content: getExecApprovalApproverDmNoticeText(),
  };
}

type PendingApproval = {
  discordMessageId: string;
  discordChannelId: string;
  timeoutId?: NodeJS.Timeout;
};
type DiscordPendingDelivery = {
  body: ReturnType<typeof stripUndefinedFields>;
};
type PreparedDeliveryTarget = {
  discordChannelId: string;
  recipientUserId?: string;
};

function resolveApprovalKindFromId(approvalId: string): ApprovalKind {
  return approvalId.startsWith("plugin:") ? "plugin" : "exec";
}

function isPluginApprovalRequest(request: ApprovalRequest): request is PluginApprovalRequest {
  return resolveApprovalKindFromId(request.id) === "plugin";
}

function encodeCustomIdValue(value: string): string {
  return encodeURIComponent(value);
}
=======
// Discord plugin module implements exec approvals behavior.
import { ButtonStyle } from "discord-api-types/v10";
import { resolveApprovalOverGateway } from "openclaw/plugin-sdk/approval-gateway-runtime";
import type { ExecApprovalDecision } from "openclaw/plugin-sdk/approval-runtime";
import type {
  DiscordExecApprovalConfig,
  OpenClawConfig,
} from "openclaw/plugin-sdk/config-contracts";
import { Button, type ButtonInteraction, type ComponentData } from "../internal/discord.js";
export { buildExecApprovalCustomId } from "../approval-handler.runtime.js";
import { getDiscordExecApprovalApprovers } from "../exec-approvals.js";
>>>>>>> upstream/main

export { extractDiscordChannelId } from "../approval-native.js";
function decodeCustomIdValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseExecApprovalData(
  data: ComponentData,
): { approvalId: string; action: ExecApprovalDecision } | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  const coerce = (value: unknown) =>
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  const rawId = coerce(data.id);
  const rawAction = coerce(data.action);
  if (!rawId || !rawAction) {
    return null;
  }
  const action = rawAction as ExecApprovalDecision;
  if (action !== "allow-once" && action !== "allow-always" && action !== "deny") {
    return null;
  }
  return {
    approvalId: decodeCustomIdValue(rawId),
    action,
  };
}

type ExecApprovalButtonContext = {
  getApprovers: () => string[];
  resolveApproval: (
    approvalId: string,
    decision: ExecApprovalDecision,
  ) => Promise<ExecApprovalResolveResult>;
};

type ExecApprovalResolveResult = { ok: true } | { ok: false; reason: "error" | "not-found" };

<<<<<<< HEAD
class ExecApprovalActionButton extends Button {
  customId: string;
  label: string;
  style: ButtonStyle;

  constructor(params: { approvalId: string; descriptor: ExecApprovalActionDescriptor }) {
    super();
    this.customId = buildExecApprovalCustomId(params.approvalId, params.descriptor.decision);
    this.label = params.descriptor.label;
    this.style =
      params.descriptor.style === "success"
        ? ButtonStyle.Success
        : params.descriptor.style === "primary"
          ? ButtonStyle.Primary
          : params.descriptor.style === "danger"
            ? ButtonStyle.Danger
            : ButtonStyle.Secondary;
  }
}

class ExecApprovalActionRow extends Row<Button> {
  constructor(params: {
    approvalId: string;
    ask?: string | null;
    allowedDecisions?: readonly ExecApprovalDecision[];
  }) {
    super([
      ...buildExecApprovalActionDescriptors({
        approvalCommandId: params.approvalId,
        ask: params.ask,
        allowedDecisions: params.allowedDecisions,
      }).map(
        (descriptor) => new ExecApprovalActionButton({ approvalId: params.approvalId, descriptor }),
      ),
    ]);
  }
}

function createApprovalActionRow(request: ApprovalRequest): Row<Button> {
  if (isPluginApprovalRequest(request)) {
    return new ExecApprovalActionRow({
      approvalId: request.id,
    });
  }
  return new ExecApprovalActionRow({
    approvalId: request.id,
    ask: request.request.ask,
    allowedDecisions: request.request.allowedDecisions,
  });
}

function buildExecApprovalMetadataLines(request: ExecApprovalRequest): string[] {
  const lines: string[] = [];
  if (request.request.cwd) {
    lines.push(`- Working Directory: ${request.request.cwd}`);
  }
  if (request.request.host) {
    lines.push(`- Host: ${request.request.host}`);
  }
  if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0) {
    lines.push(`- Env Overrides: ${request.request.envKeys.join(", ")}`);
  }
  if (request.request.agentId) {
    lines.push(`- Agent: ${request.request.agentId}`);
  }
  return lines;
}

function buildPluginApprovalMetadataLines(request: PluginApprovalRequest): string[] {
  const lines: string[] = [];
  const severity = request.request.severity ?? "warning";
  lines.push(
    `- Severity: ${severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"}`,
  );
  if (request.request.toolName) {
    lines.push(`- Tool: ${request.request.toolName}`);
  }
  if (request.request.pluginId) {
    lines.push(`- Plugin: ${request.request.pluginId}`);
  }
  if (request.request.agentId) {
    lines.push(`- Agent: ${request.request.agentId}`);
  }
  return lines;
}

function buildExecApprovalPayload(container: DiscordUiContainer): MessagePayloadObject {
  const components: TopLevelComponents[] = [container];
  return { components };
}

function formatCommandPreview(commandText: string, maxChars: number): string {
  const commandRaw =
    commandText.length > maxChars ? `${commandText.slice(0, maxChars)}...` : commandText;
  return commandRaw.replace(/`/g, "\u200b`");
}

function formatOptionalCommandPreview(
  commandText: string | null | undefined,
  maxChars: number,
): string | null {
  if (!commandText) {
    return null;
  }
  return formatCommandPreview(commandText, maxChars);
}

function resolveExecApprovalPreviews(
  request: ExecApprovalRequest["request"],
  maxChars: number,
  secondaryMaxChars: number,
): { commandPreview: string; commandSecondaryPreview: string | null } {
  const { commandText, commandPreview: secondaryPreview } =
    resolveExecApprovalCommandDisplay(request);
  return {
    commandPreview: formatCommandPreview(commandText, maxChars),
    commandSecondaryPreview: formatOptionalCommandPreview(secondaryPreview, secondaryMaxChars),
  };
}

function createExecApprovalRequestContainer(params: {
  request: ExecApprovalRequest;
  cfg: OpenClawConfig;
  accountId: string;
  actionRow?: Row<Button>;
}): ExecApprovalContainer {
  const { commandPreview, commandSecondaryPreview } = resolveExecApprovalPreviews(
    params.request.request,
    1000,
    500,
  );
  const expiresAtSeconds = Math.max(0, Math.floor(params.request.expiresAtMs / 1000));

  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: "Exec Approval Required",
    description: "A command needs your approval.",
    commandPreview,
    commandSecondaryPreview,
    metadataLines: buildExecApprovalMetadataLines(params.request),
    actionRow: params.actionRow,
    footer: `Expires <t:${expiresAtSeconds}:R> · ID: ${params.request.id}`,
    accentColor: "#FFA500",
  });
}

function createPluginApprovalRequestContainer(params: {
  request: PluginApprovalRequest;
  cfg: OpenClawConfig;
  accountId: string;
  actionRow?: Row<Button>;
}): ExecApprovalContainer {
  const expiresAtSeconds = Math.max(0, Math.floor(params.request.expiresAtMs / 1000));
  const severity = params.request.request.severity ?? "warning";
  const accentColor =
    severity === "critical" ? "#ED4245" : severity === "info" ? "#5865F2" : "#FAA61A";
  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: "Plugin Approval Required",
    description: "A plugin action needs your approval.",
    commandPreview: formatCommandPreview(params.request.request.title, 700),
    commandSecondaryPreview: formatOptionalCommandPreview(params.request.request.description, 1000),
    metadataLines: buildPluginApprovalMetadataLines(params.request),
    actionRow: params.actionRow,
    footer: `Expires <t:${expiresAtSeconds}:R> · ID: ${params.request.id}`,
    accentColor,
  });
}

function createExecResolvedContainer(params: {
  request: ExecApprovalRequest;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  cfg: OpenClawConfig;
  accountId: string;
}): ExecApprovalContainer {
  const { commandPreview, commandSecondaryPreview } = resolveExecApprovalPreviews(
    params.request.request,
    500,
    300,
  );

  const decisionLabel =
    params.decision === "allow-once"
      ? "Allowed (once)"
      : params.decision === "allow-always"
        ? "Allowed (always)"
        : "Denied";

  const accentColor =
    params.decision === "deny"
      ? "#ED4245"
      : params.decision === "allow-always"
        ? "#5865F2"
        : "#57F287";

  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: `Exec Approval: ${decisionLabel}`,
    description: params.resolvedBy ? `Resolved by ${params.resolvedBy}` : "Resolved",
    commandPreview,
    commandSecondaryPreview,
    footer: `ID: ${params.request.id}`,
    accentColor,
  });
}

function createPluginResolvedContainer(params: {
  request: PluginApprovalRequest;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  cfg: OpenClawConfig;
  accountId: string;
}): ExecApprovalContainer {
  const decisionLabel =
    params.decision === "allow-once"
      ? "Allowed (once)"
      : params.decision === "allow-always"
        ? "Allowed (always)"
        : "Denied";

  const accentColor =
    params.decision === "deny"
      ? "#ED4245"
      : params.decision === "allow-always"
        ? "#5865F2"
        : "#57F287";

  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: `Plugin Approval: ${decisionLabel}`,
    description: params.resolvedBy ? `Resolved by ${params.resolvedBy}` : "Resolved",
    commandPreview: formatCommandPreview(params.request.request.title, 700),
    commandSecondaryPreview: formatOptionalCommandPreview(params.request.request.description, 1000),
    metadataLines: buildPluginApprovalMetadataLines(params.request),
    footer: `ID: ${params.request.id}`,
    accentColor,
  });
}

function createExecExpiredContainer(params: {
  request: ExecApprovalRequest;
  cfg: OpenClawConfig;
  accountId: string;
}): ExecApprovalContainer {
  const { commandPreview, commandSecondaryPreview } = resolveExecApprovalPreviews(
    params.request.request,
    500,
    300,
  );

  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: "Exec Approval: Expired",
    description: "This approval request has expired.",
    commandPreview,
    commandSecondaryPreview,
    footer: `ID: ${params.request.id}`,
    accentColor: "#99AAB5",
  });
}

function createPluginExpiredContainer(params: {
  request: PluginApprovalRequest;
  cfg: OpenClawConfig;
  accountId: string;
}): ExecApprovalContainer {
  return new ExecApprovalContainer({
    cfg: params.cfg,
    accountId: params.accountId,
    title: "Plugin Approval: Expired",
    description: "This approval request has expired.",
    commandPreview: formatCommandPreview(params.request.request.title, 700),
    commandSecondaryPreview: formatOptionalCommandPreview(params.request.request.description, 1000),
    metadataLines: buildPluginApprovalMetadataLines(params.request),
    footer: `ID: ${params.request.id}`,
    accentColor: "#99AAB5",
  });
}

export type DiscordExecApprovalHandlerOpts = {
  token: string;
  accountId: string;
  config: DiscordExecApprovalConfig;
  gatewayUrl?: string;
  cfg: OpenClawConfig;
  runtime?: RuntimeEnv;
  onResolve?: (id: string, decision: ExecApprovalDecision) => Promise<void>;
};

export class DiscordExecApprovalHandler {
  private readonly runtime: ExecApprovalChannelRuntime<ApprovalRequest, ApprovalResolved>;
  private opts: DiscordExecApprovalHandlerOpts;

  constructor(opts: DiscordExecApprovalHandlerOpts) {
    this.opts = opts;
    this.runtime = createChannelNativeApprovalRuntime<
      PendingApproval,
      PreparedDeliveryTarget,
      DiscordPendingDelivery,
      ApprovalRequest,
      ApprovalResolved
    >({
      label: "discord/exec-approvals",
      clientDisplayName: "Discord Exec Approvals",
      cfg: this.opts.cfg,
      accountId: this.opts.accountId,
      gatewayUrl: this.opts.gatewayUrl,
      eventKinds: ["exec", "plugin"],
      nativeAdapter: createDiscordApprovalCapability(this.opts.config).native,
      isConfigured: () =>
        isDiscordExecApprovalClientEnabled({
          cfg: this.opts.cfg,
          accountId: this.opts.accountId,
          configOverride: this.opts.config,
        }),
      shouldHandle: (request) => this.shouldHandle(request),
      buildPendingContent: ({ request }) => {
        const actionRow = createApprovalActionRow(request);
        const container = isPluginApprovalRequest(request)
          ? createPluginApprovalRequestContainer({
              request,
              cfg: this.opts.cfg,
              accountId: this.opts.accountId,
              actionRow,
            })
          : createExecApprovalRequestContainer({
              request,
              cfg: this.opts.cfg,
              accountId: this.opts.accountId,
              actionRow,
            });
        const payload = buildExecApprovalPayload(container);
        return {
          body: stripUndefinedFields(serializePayload(payload)),
        };
      },
      sendOriginNotice: async ({ originTarget }) => {
        const { rest, request: discordRequest } = createDiscordClient(
          { token: this.opts.token, accountId: this.opts.accountId },
          this.opts.cfg,
        );
        await discordRequest(
          () =>
            rest.post(Routes.channelMessages(originTarget.to), {
              body: buildDiscordApprovalDmRedirectNotice(),
            }) as Promise<{ id: string; channel_id: string }>,
          "send-approval-dm-redirect-notice",
        );
      },
      prepareTarget: async ({ plannedTarget }) => {
        const { rest, request: discordRequest } = createDiscordClient(
          { token: this.opts.token, accountId: this.opts.accountId },
          this.opts.cfg,
        );
        if (plannedTarget.surface === "origin") {
          return {
            dedupeKey: plannedTarget.target.to,
            target: {
              discordChannelId: plannedTarget.target.to,
            },
          };
        }

        const userId = plannedTarget.target.to;
        const dmChannel = (await discordRequest(
          () =>
            rest.post(Routes.userChannels(), {
              body: { recipient_id: userId },
            }) as Promise<{ id: string }>,
          "dm-channel",
        )) as { id: string };

        if (!dmChannel?.id) {
          logError(`discord exec approvals: failed to create DM for user ${userId}`);
          return null;
        }

        return {
          dedupeKey: dmChannel.id,
          target: {
            discordChannelId: dmChannel.id,
            recipientUserId: userId,
          },
        };
      },
      deliverTarget: async ({ plannedTarget, preparedTarget, pendingContent, request }) => {
        const { rest, request: discordRequest } = createDiscordClient(
          { token: this.opts.token, accountId: this.opts.accountId },
          this.opts.cfg,
        );
        const message = (await discordRequest(
          () =>
            rest.post(Routes.channelMessages(preparedTarget.discordChannelId), {
              body: pendingContent.body,
            }) as Promise<{ id: string; channel_id: string }>,
          plannedTarget.surface === "origin" ? "send-approval-channel" : "send-approval",
        )) as { id: string; channel_id: string };

        if (!message?.id) {
          if (plannedTarget.surface === "origin") {
            logError("discord exec approvals: failed to send to channel");
          } else if (preparedTarget.recipientUserId) {
            logError(
              `discord exec approvals: failed to send message to user ${preparedTarget.recipientUserId}`,
            );
          }
          return null;
        }

        return {
          discordMessageId: message.id,
          discordChannelId: preparedTarget.discordChannelId,
        };
      },
      onOriginNoticeError: ({ error }) => {
        logError(`discord exec approvals: failed to send DM redirect notice: ${String(error)}`);
      },
      onDuplicateSkipped: ({ preparedTarget, request }) => {
        logDebug(
          `discord exec approvals: skipping duplicate approval ${request.id} for channel ${preparedTarget.dedupeKey}`,
        );
      },
      onDelivered: ({ plannedTarget, preparedTarget, request }) => {
        if (plannedTarget.surface === "origin") {
          logDebug(
            `discord exec approvals: sent approval ${request.id} to channel ${preparedTarget.target.discordChannelId}`,
          );
          return;
        }
        logDebug(
          `discord exec approvals: sent approval ${request.id} to user ${plannedTarget.target.to}`,
        );
      },
      onDeliveryError: ({ error, plannedTarget }) => {
        if (plannedTarget.surface === "origin") {
          logError(`discord exec approvals: failed to send to channel: ${String(error)}`);
          return;
        }
        logError(
          `discord exec approvals: failed to notify user ${plannedTarget.target.to}: ${String(error)}`,
        );
      },
      finalizeResolved: async ({ request, resolved, entries }) => {
        await this.finalizeResolved(request, resolved, entries);
      },
      finalizeExpired: async ({ request, entries }) => {
        await this.finalizeExpired(request, entries);
      },
    });
  }

  shouldHandle(request: ApprovalRequest): boolean {
    return shouldHandleDiscordApprovalRequest({
      cfg: this.opts.cfg,
      accountId: this.opts.accountId,
      request,
      configOverride: this.opts.config,
    });
  }

  async start(): Promise<void> {
    await this.runtime.start();
  }

  async stop(): Promise<void> {
    await this.runtime.stop();
  }

  async handleApprovalRequested(request: ApprovalRequest): Promise<void> {
    await this.runtime.handleRequested(request);
  }

  async handleApprovalResolved(resolved: ApprovalResolved): Promise<void> {
    await this.runtime.handleResolved(resolved);
  }

  async handleApprovalTimeout(approvalId: string, _source?: "channel" | "dm"): Promise<void> {
    await this.runtime.handleExpired(approvalId);
  }

  private async finalizeResolved(
    request: ApprovalRequest,
    resolved: ApprovalResolved,
    entries: PendingApproval[],
  ): Promise<void> {
    const container = isPluginApprovalRequest(request)
      ? createPluginResolvedContainer({
          request,
          decision: resolved.decision,
          resolvedBy: resolved.resolvedBy,
          cfg: this.opts.cfg,
          accountId: this.opts.accountId,
        })
      : createExecResolvedContainer({
          request,
          decision: resolved.decision,
          resolvedBy: resolved.resolvedBy,
          cfg: this.opts.cfg,
          accountId: this.opts.accountId,
        });

    for (const pending of entries) {
      await this.finalizeMessage(pending.discordChannelId, pending.discordMessageId, container);
    }
  }

  private async finalizeExpired(
    request: ApprovalRequest,
    entries: PendingApproval[],
  ): Promise<void> {
    const container = isPluginApprovalRequest(request)
      ? createPluginExpiredContainer({
          request,
          cfg: this.opts.cfg,
          accountId: this.opts.accountId,
        })
      : createExecExpiredContainer({
          request,
          cfg: this.opts.cfg,
          accountId: this.opts.accountId,
        });
    for (const pending of entries) {
      await this.finalizeMessage(pending.discordChannelId, pending.discordMessageId, container);
    }
  }

  private async finalizeMessage(
    channelId: string,
    messageId: string,
    container: DiscordUiContainer,
  ): Promise<void> {
    if (!this.opts.config.cleanupAfterResolve) {
      await this.updateMessage(channelId, messageId, container);
      return;
    }

    try {
      const { rest, request: discordRequest } = createDiscordClient(
        { token: this.opts.token, accountId: this.opts.accountId },
        this.opts.cfg,
      );

      await discordRequest(
        () => rest.delete(Routes.channelMessage(channelId, messageId)) as Promise<void>,
        "delete-approval",
      );
    } catch (err) {
      logError(`discord exec approvals: failed to delete message: ${String(err)}`);
      await this.updateMessage(channelId, messageId, container);
    }
  }

  private async updateMessage(
    channelId: string,
    messageId: string,
    container: DiscordUiContainer,
  ): Promise<void> {
    try {
      const { rest, request: discordRequest } = createDiscordClient(
        { token: this.opts.token, accountId: this.opts.accountId },
        this.opts.cfg,
      );
      const payload = buildExecApprovalPayload(container);

      await discordRequest(
        () =>
          rest.patch(Routes.channelMessage(channelId, messageId), {
            body: stripUndefinedFields(serializePayload(payload)),
          }),
        "update-approval",
      );
    } catch (err) {
      logError(`discord exec approvals: failed to update message: ${String(err)}`);
    }
  }

  async resolveApproval(approvalId: string, decision: ExecApprovalDecision): Promise<boolean> {
    const method =
      resolveApprovalKindFromId(approvalId) === "plugin"
        ? "plugin.approval.resolve"
        : "exec.approval.resolve";
    logDebug(`discord exec approvals: resolving ${approvalId} with ${decision} via ${method}`);

    try {
      await this.runtime.request(method, {
        id: approvalId,
        decision,
      });
      logDebug(`discord exec approvals: resolved ${approvalId} successfully`);
      return true;
    } catch (err) {
      logError(`discord exec approvals: resolve failed: ${String(err)}`);
      return false;
    }
  }

  /** Return the list of configured approver IDs. */
  getApprovers(): string[] {
    return getDiscordExecApprovalApprovers({
      cfg: this.opts.cfg,
      accountId: this.opts.accountId,
      configOverride: this.opts.config,
    });
  }
=======
function isStructuredApprovalNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }
  const record = err as {
    gatewayCode?: unknown;
    details?: { reason?: unknown } | null;
  };
  if (record.gatewayCode === "APPROVAL_NOT_FOUND") {
    return true;
  }
  return (
    record.gatewayCode === "INVALID_REQUEST" && record.details?.reason === "APPROVAL_NOT_FOUND"
  );
>>>>>>> upstream/main
}

export class ExecApprovalButton extends Button {
  override label = "execapproval";
  customId = "execapproval:seed=1";
  override style = ButtonStyle.Primary;

  constructor(private readonly ctx: ExecApprovalButtonContext) {
    super();
  }

  override async run(interaction: ButtonInteraction, data: ComponentData): Promise<void> {
    const parsed = parseExecApprovalData(data);
    if (!parsed) {
      try {
        await interaction.reply({
          content: "This approval is no longer valid.",
          ephemeral: true,
        });
      } catch {}
      return;
    }

    const approvers = this.ctx.getApprovers();
    const userId = interaction.userId;
    if (!approvers.some((id) => id === userId)) {
      try {
        await interaction.reply({
          content: "⛔ You are not authorized to approve exec requests.",
          ephemeral: true,
        });
      } catch {}
      return;
    }

    const decisionLabel =
      parsed.action === "allow-once"
        ? "Allowed (once)"
        : parsed.action === "allow-always"
          ? "Allowed (always)"
          : "Denied";

    try {
      await interaction.acknowledge();
    } catch {}

    const result = await this.ctx.resolveApproval(parsed.approvalId, parsed.action);
    if (!result.ok) {
      try {
        await interaction.followUp({
          content:
            result.reason === "not-found"
              ? `That approval request is no longer pending. It may have expired or already been resolved.`
              : `Failed to submit approval decision for **${decisionLabel}**. The request may have expired or already been resolved.`,
          ephemeral: true,
        });
      } catch {}
    }
  }
}

export function createExecApprovalButton(ctx: ExecApprovalButtonContext): Button {
  return new ExecApprovalButton(ctx);
}

export function createDiscordExecApprovalButtonContext(params: {
  cfg: OpenClawConfig;
  accountId: string;
  config: DiscordExecApprovalConfig;
  gatewayUrl?: string;
}): ExecApprovalButtonContext {
  return {
    getApprovers: () =>
      getDiscordExecApprovalApprovers({
        cfg: params.cfg,
        accountId: params.accountId,
        configOverride: params.config,
      }),
    resolveApproval: async (approvalId, decision) => {
      try {
        await resolveApprovalOverGateway({
          cfg: params.cfg,
          approvalId,
          decision,
          gatewayUrl: params.gatewayUrl,
          clientDisplayName: `Discord approval (${params.accountId})`,
        });
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          reason: isStructuredApprovalNotFoundError(err) ? "not-found" : "error",
        };
      }
    },
  };
}
