<<<<<<< HEAD
import crypto from "node:crypto";
import type { SubagentRunRecord } from "../../agents/subagent-registry.js";
import type { CommandHandler } from "./commands-types.js";
import { AGENT_LANE_SUBAGENT } from "../../agents/lanes.js";
import { abortEmbeddedPiRun } from "../../agents/pi-embedded.js";
import {
  clearSubagentRunSteerRestart,
  listSubagentRunsForRequester,
  markSubagentRunTerminated,
  markSubagentRunForSteerRestart,
  replaceSubagentRunAfterSteer,
} from "../../agents/subagent-registry.js";
import { spawnSubagentDirect } from "../../agents/subagent-spawn.js";
import {
  extractAssistantText,
  resolveInternalSessionKey,
  resolveMainSessionAlias,
  sanitizeTextContent,
  stripToolMessages,
} from "../../agents/tools/sessions-helpers.js";
import {
  type SessionEntry,
  loadSessionStore,
  resolveStorePath,
  updateSessionStore,
} from "../../config/sessions.js";
import { callGateway } from "../../gateway/call.js";
=======
import { listSubagentRunsForRequester } from "../../agents/subagent-registry.js";
>>>>>>> upstream/main
import { logVerbose } from "../../globals.js";
import { handleSubagentsAgentsAction } from "./commands-subagents/action-agents.js";
import { handleSubagentsFocusAction } from "./commands-subagents/action-focus.js";
import { handleSubagentsHelpAction } from "./commands-subagents/action-help.js";
import { handleSubagentsInfoAction } from "./commands-subagents/action-info.js";
import { handleSubagentsKillAction } from "./commands-subagents/action-kill.js";
import { handleSubagentsListAction } from "./commands-subagents/action-list.js";
import { handleSubagentsLogAction } from "./commands-subagents/action-log.js";
import { handleSubagentsSendAction } from "./commands-subagents/action-send.js";
import { handleSubagentsSpawnAction } from "./commands-subagents/action-spawn.js";
import { handleSubagentsUnfocusAction } from "./commands-subagents/action-unfocus.js";
import {
<<<<<<< HEAD
  formatDurationCompact,
  formatTokenUsageDisplay,
  truncateLine,
} from "../../shared/subagents-format.js";
import { INTERNAL_MESSAGE_CHANNEL } from "../../utils/message-channel.js";
import { stopSubagentsForRequester } from "./abort.js";
import { clearSessionQueues } from "./queue.js";
import {
  formatRunLabel,
  formatRunStatus,
  resolveSubagentTargetFromRuns,
  type SubagentTargetResolution,
  sortSubagentRuns,
} from "./subagents-utils.js";
=======
  type SubagentsCommandContext,
  extractMessageText,
  resolveHandledPrefix,
  resolveRequesterSessionKey,
  resolveSubagentsAction,
  stopWithText,
} from "./commands-subagents/shared.js";
import type { CommandHandler } from "./commands-types.js";
>>>>>>> upstream/main

export { extractMessageText };

export const handleSubagentsCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }

  const normalized = params.command.commandBodyNormalized;
  const handledPrefix = resolveHandledPrefix(normalized);
  if (!handledPrefix) {
    return null;
  }

  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring ${handledPrefix} from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }

  const rest = normalized.slice(handledPrefix.length).trim();
  const restTokens = rest.split(/\s+/).filter(Boolean);
  const action = resolveSubagentsAction({ handledPrefix, restTokens });
  if (!action) {
    return handleSubagentsHelpAction();
  }

  const requesterKey = resolveRequesterSessionKey(params, {
    preferCommandTarget: action === "spawn",
  });
  if (!requesterKey) {
    return stopWithText("⚠️ Missing session key.");
  }

  const ctx: SubagentsCommandContext = {
    params,
    handledPrefix,
    requesterKey,
    runs: listSubagentRunsForRequester(requesterKey),
    restTokens,
  };

  switch (action) {
    case "help":
      return handleSubagentsHelpAction();
    case "agents":
      return handleSubagentsAgentsAction(ctx);
    case "focus":
      return await handleSubagentsFocusAction(ctx);
    case "unfocus":
      return handleSubagentsUnfocusAction(ctx);
    case "list":
      return handleSubagentsListAction(ctx);
    case "kill":
      return await handleSubagentsKillAction(ctx);
    case "info":
      return handleSubagentsInfoAction(ctx);
    case "log":
      return await handleSubagentsLogAction(ctx);
    case "send":
      return await handleSubagentsSendAction(ctx, false);
    case "steer":
      return await handleSubagentsSendAction(ctx, true);
    case "spawn":
      return await handleSubagentsSpawnAction(ctx);
    default:
      return handleSubagentsHelpAction();
  }
};
