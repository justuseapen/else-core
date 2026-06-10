/**
 * Client-side execution engine for slash commands.
 * Calls gateway RPC methods and returns formatted results.
 */

<<<<<<< HEAD
import { createChatModelOverride, resolvePreferredServerChatModel } from "../chat-model-ref.ts";
import type { GatewayBrowserClient } from "../gateway.ts";
import {
  DEFAULT_AGENT_ID,
  DEFAULT_MAIN_KEY,
  isSubagentSessionKey,
  parseAgentSessionKey,
} from "../session-key.ts";
=======
import {
  createChatModelOverride,
  resolvePreferredServerChatModelValue,
} from "../chat-model-ref.ts";
import type { GatewayBrowserClient } from "../gateway.ts";
import { DEFAULT_AGENT_ID, DEFAULT_MAIN_KEY, parseAgentSessionKey } from "../session-key.ts";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "../string-coerce.ts";
>>>>>>> upstream/main
import {
  formatThinkingLevels,
  normalizeThinkLevel,
  resolveThinkingDefaultForModel,
} from "../thinking.ts";
import type {
  AgentsListResult,
  ChatModelOverride,
  GatewaySessionRow,
  GatewayThinkingLevelOption,
  ModelCatalogEntry,
  SessionsListResult,
  SessionsPatchResult,
} from "../types.ts";
import { generateUUID } from "../uuid.ts";
import { SLASH_COMMANDS } from "./slash-commands.ts";

export type SlashCommandResult = {
  /** Markdown-formatted result to display in chat. */
  content: string;
  /** Side-effect action the caller should perform after displaying the result. */
  action?: "refresh" | "export" | "new-session" | "reset" | "stop" | "clear" | "navigate-usage";
  /** Optional session-level directive changes that the caller should mirror locally. */
  sessionPatch?: {
    modelOverride?: ChatModelOverride | null;
  };
  /** When set, the caller should track this as the active run (enables Abort, blocks concurrent sends). */
  trackRunId?: string;
  /** When set, the caller should surface a visible pending item tied to the current run. */
  pendingCurrentRun?: boolean;
};

export type SlashCommandContext = {
  chatModelCatalog?: ModelCatalogEntry[];
  modelCatalog?: ModelCatalogEntry[];
  sessionsResult?: SessionsListResult | null;
<<<<<<< HEAD
=======
  agentId?: string;
>>>>>>> upstream/main
};

function normalizeVerboseLevel(raw?: string | null): "off" | "on" | "full" | undefined {
  if (!raw) {
    return undefined;
  }
<<<<<<< HEAD
  const key = raw.toLowerCase();
=======
  const key = normalizeLowercaseStringOrEmpty(raw);
>>>>>>> upstream/main
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "all", "everything"].includes(key)) {
    return "full";
  }
  if (["on", "minimal", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}

<<<<<<< HEAD
=======
function isSessionDefaultDirectiveValue(raw?: string | null): boolean {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return false;
  }
  return ["default", "inherit", "inherited", "clear", "reset", "unpin"].includes(key);
}

>>>>>>> upstream/main
export async function executeSlashCommand(
  client: GatewayBrowserClient,
  sessionKey: string,
  commandName: string,
  args: string,
  context: SlashCommandContext = {},
): Promise<SlashCommandResult> {
  switch (commandName) {
    case "help":
      return executeHelp();
    case "new":
      return { content: "Starting new session...", action: "new-session" };
    case "reset":
      return { content: "Resetting session...", action: "reset" };
    case "stop":
      return { content: "Stopping current run...", action: "stop" };
    case "clear":
      return { content: "Chat history cleared.", action: "clear" };
    case "compact":
      return await executeCompact(client, sessionKey, context);
    case "model":
      return await executeModel(client, sessionKey, args, context);
    case "think":
      return await executeThink(client, sessionKey, args, context);
    case "fast":
      return await executeFast(client, sessionKey, args, context);
    case "verbose":
      return await executeVerbose(client, sessionKey, args, context);
    case "export-session":
      return { content: "Exporting session...", action: "export" };
    case "usage":
      return await executeUsage(client, sessionKey);
    case "agents":
      return await executeAgents(client);
<<<<<<< HEAD
    case "kill":
      return await executeKill(client, sessionKey, args);
=======
>>>>>>> upstream/main
    case "steer":
      return await executeSteer(client, sessionKey, args, context);
    case "redirect":
      return await executeRedirect(client, sessionKey, args, context);
    default:
      return { content: `Unknown command: \`/${commandName}\`` };
  }
}

// ── Command Implementations ──

function executeHelp(): SlashCommandResult {
  const lines = ["**Available Commands**\n"];
  let currentCategory = "";

  for (const cmd of SLASH_COMMANDS) {
    const cat = cmd.category ?? "session";
    if (cat !== currentCategory) {
      currentCategory = cat;
      lines.push(`**${cat.charAt(0).toUpperCase() + cat.slice(1)}**`);
    }
    const argStr = cmd.args ? ` ${cmd.args}` : "";
    const local = cmd.executeLocal ? "" : " *(agent)*";
    lines.push(`\`/${cmd.name}${argStr}\` — ${cmd.description}${local}`);
  }

  lines.push("\nType `/` to open the command menu.");
  return { content: lines.join("\n") };
}

async function executeCompact(
  client: GatewayBrowserClient,
  sessionKey: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  try {
    const result = await client.request<{
      compacted?: boolean;
      reason?: string;
      result?: { tokensBefore?: number; tokensAfter?: number };
    }>("sessions.compact", { key: sessionKey, ...selectedGlobalScope(sessionKey, context) });
    if (result?.compacted) {
      const before = result.result?.tokensBefore;
      const after = result.result?.tokensAfter;
      const tokenSummary =
        typeof before === "number" && typeof after === "number"
          ? ` (${before.toLocaleString()} -> ${after.toLocaleString()} tokens)`
          : "";
      return { content: `Context compacted successfully${tokenSummary}.`, action: "refresh" };
    }
    if (typeof result?.reason === "string" && result.reason.trim()) {
      return { content: `Compaction skipped: ${result.reason}`, action: "refresh" };
    }
    return { content: "Compaction skipped.", action: "refresh" };
  } catch (err) {
    return { content: `Compaction failed: ${String(err)}` };
  }
}

async function executeModel(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  const modelCatalog = context.chatModelCatalog ?? context.modelCatalog;
  if (!args) {
    try {
      const [sessions, models] = await Promise.all([
        client.request<SessionsListResult>("sessions.list", {}),
        modelCatalog ? Promise.resolve(modelCatalog) : loadModelCatalog(client),
      ]);
      const session = resolveCurrentSession(sessions, sessionKey);
      const model = session?.model || sessions?.defaults?.model || "default";
      const available = models.map((m: ModelCatalogEntry) => m.id);
      const lines = [`**Current model:** \`${model}\``];
      if (available.length > 0) {
        lines.push(
          `**Available:** ${available
            .slice(0, 10)
            .map((m: string) => `\`${m}\``)
            .join(", ")}${available.length > 10 ? ` +${available.length - 10} more` : ""}`,
        );
      }
      return { content: lines.join("\n") };
    } catch (err) {
      return { content: `Failed to get model info: ${String(err)}` };
    }
  }

  try {
    const requestedModel = args.trim();
    const [patched, resolvedModelCatalog] = await Promise.all([
      client.request<SessionsPatchResult>("sessions.patch", {
        key: sessionKey,
        ...selectedGlobalScope(sessionKey, context),
        model: requestedModel,
      }),
      modelCatalog
        ? Promise.resolve(modelCatalog)
        : loadModelCatalog(client, { allowFailure: true }),
    ]);
    const resolvedModel = patched.resolved?.model ?? requestedModel;
    let resolvedValue = resolvePreferredServerChatModelValue(
      resolvedModel,
      patched.resolved?.modelProvider,
      resolvedModelCatalog,
    );
    const requestedOverride = createChatModelOverride(requestedModel);
    const resolvedProvider = patched.resolved?.modelProvider?.trim();
    if (
      requestedOverride?.kind === "qualified" &&
      resolvedProvider &&
      resolvedValue &&
      !resolvedValue.toLowerCase().startsWith(`${resolvedProvider.toLowerCase()}/`) &&
      requestedOverride.value.toLowerCase().endsWith(`/${resolvedModel.trim().toLowerCase()}`)
    ) {
      resolvedValue = requestedOverride.value;
    }
    return {
      content: `Model set to \`${requestedModel}\`.`,
      action: "refresh",
      sessionPatch: { modelOverride: createChatModelOverride(resolvedValue) },
    };
  } catch (err) {
    return { content: `Failed to set model: ${String(err)}` };
  }
}

async function executeThink(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  const rawLevel = args.trim();

  if (!rawLevel) {
    try {
      const { session, defaults, models } = await loadThinkingCommandState(client, sessionKey);
      return {
        content: formatDirectiveOptions(
<<<<<<< HEAD
          `Current thinking level: ${resolveCurrentThinkingLevel(session, models)}.`,
          formatThinkingLevels(session?.modelProvider),
=======
          `Current thinking level: ${resolveCurrentThinkingLevel(session, defaults, models)}.`,
          formatThinkingCommandOptionsForSession(session, defaults),
>>>>>>> upstream/main
        ),
      };
    } catch (err) {
      return { content: `Failed to get thinking level: ${String(err)}` };
    }
  }

  if (isSessionDefaultDirectiveValue(rawLevel)) {
    try {
      await client.request("sessions.patch", {
        key: sessionKey,
        ...selectedGlobalScope(sessionKey, context),
        thinkingLevel: null,
      });
      return {
<<<<<<< HEAD
        content: `Unrecognized thinking level "${rawLevel}". Valid levels: ${formatThinkingLevels(session?.modelProvider)}.`,
=======
        content: "Thinking level reset to default.",
        action: "refresh",
>>>>>>> upstream/main
      };
    } catch (err) {
      return { content: `Failed to reset thinking level: ${String(err)}` };
    }
  }

  try {
    const { session, defaults } = await loadCurrentSessionState(client, sessionKey);
    const level = resolveThinkingLevelInput(rawLevel, session, defaults);
    if (!level) {
      return {
        content: `Unrecognized thinking level "${rawLevel}". Valid levels: ${formatThinkingCommandOptionsForSession(session, defaults)}.`,
      };
    }
    if (!isThinkingLevelOptionForSession(session, defaults, level)) {
      return {
        content: `Unsupported thinking level "${rawLevel}" for this model. Valid levels: ${formatThinkingCommandOptionsForSession(session, defaults)}.`,
      };
    }
    await client.request("sessions.patch", {
      key: sessionKey,
      ...selectedGlobalScope(sessionKey, context),
      thinkingLevel: level,
    });
    return {
      content: `Thinking level set to **${level}**.`,
      action: "refresh",
    };
  } catch (err) {
    return { content: `Failed to set thinking level: ${String(err)}` };
  }
}

async function executeVerbose(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  const rawLevel = args.trim();

  if (!rawLevel) {
    try {
      const session = await loadCurrentSession(client, sessionKey);
      return {
        content: formatDirectiveOptions(
          `Current verbose level: ${normalizeVerboseLevel(session?.verboseLevel) ?? "off"}.`,
          "on, full, off",
        ),
      };
    } catch (err) {
      return { content: `Failed to get verbose level: ${String(err)}` };
    }
  }

  const level = normalizeVerboseLevel(rawLevel);
  if (!level) {
    return {
      content: `Unrecognized verbose level "${rawLevel}". Valid levels: off, on, full.`,
    };
  }

  try {
    await client.request("sessions.patch", {
      key: sessionKey,
      ...selectedGlobalScope(sessionKey, context),
      verboseLevel: level,
    });
    return {
      content: `Verbose mode set to **${level}**.`,
      action: "refresh",
    };
  } catch (err) {
    return { content: `Failed to set verbose mode: ${String(err)}` };
  }
}

async function executeFast(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  const rawMode = normalizeLowercaseStringOrEmpty(args);

  if (!rawMode || rawMode === "status") {
    try {
      const session = await loadCurrentSession(client, sessionKey);
      return {
        content: formatDirectiveOptions(
          `Current fast mode: ${resolveCurrentFastMode(session)}.`,
          "status, on, off, default",
        ),
      };
    } catch (err) {
      return { content: `Failed to get fast mode: ${String(err)}` };
    }
  }

  if (isSessionDefaultDirectiveValue(rawMode)) {
    try {
      await client.request("sessions.patch", {
        key: sessionKey,
        ...selectedGlobalScope(sessionKey, context),
        fastMode: null,
      });
      return {
        content: "Fast mode reset to default.",
        action: "refresh",
      };
    } catch (err) {
      return { content: `Failed to reset fast mode: ${String(err)}` };
    }
  }

  if (rawMode !== "on" && rawMode !== "off") {
    return {
      content: `Unrecognized fast mode "${args.trim()}". Valid levels: status, on, off, default.`,
    };
  }

  try {
    await client.request("sessions.patch", {
      key: sessionKey,
      ...selectedGlobalScope(sessionKey, context),
      fastMode: rawMode === "on",
    });
    return {
      content: `Fast mode ${rawMode === "on" ? "enabled" : "disabled"}.`,
      action: "refresh",
    };
  } catch (err) {
    return { content: `Failed to set fast mode: ${String(err)}` };
  }
}

async function executeUsage(
  client: GatewayBrowserClient,
  sessionKey: string,
): Promise<SlashCommandResult> {
  try {
    const sessions = await client.request<SessionsListResult>("sessions.list", {});
    const session = resolveCurrentSession(sessions, sessionKey);
    if (!session) {
      return { content: "No active session." };
    }
    const hasInputTokens = Number.isFinite(session.inputTokens);
    const hasOutputTokens = Number.isFinite(session.outputTokens);
    const input = hasInputTokens ? (session.inputTokens ?? 0) : 0;
    const output = hasOutputTokens ? (session.outputTokens ?? 0) : 0;
    const cumulativeTotal = hasInputTokens || hasOutputTokens ? input + output : null;
    const contextSnapshotTotal = Number.isFinite(session.totalTokens)
      ? (session.totalTokens ?? null)
      : cumulativeTotal;
    const totalTokensFresh = session.totalTokensFresh !== false;
    const ctx = session.contextTokens ?? 0;
    const pct =
      contextSnapshotTotal !== null && totalTokensFresh && ctx > 0
        ? Math.round((contextSnapshotTotal / ctx) * 100)
        : null;
    const totalDisplay =
      cumulativeTotal === null
        ? "n/a"
        : `${totalTokensFresh ? "" : "~"}${fmtTokens(cumulativeTotal)}`;

    const lines = [
      "**Session Usage**",
      `Input: **${fmtTokens(input)}** tokens`,
      `Output: **${fmtTokens(output)}** tokens`,
      `Total: **${totalDisplay}** tokens`,
    ];
    if (pct !== null) {
      lines.push(`Context: **${pct}%** of ${fmtTokens(ctx)}`);
    }
    if (session.model) {
      lines.push(`Model: \`${session.model}\``);
    }
    return { content: lines.join("\n") };
  } catch (err) {
    return { content: `Failed to get usage: ${String(err)}` };
  }
}

async function executeAgents(client: GatewayBrowserClient): Promise<SlashCommandResult> {
  try {
    const result = await client.request<AgentsListResult>("agents.list", {});
    const agents = result?.agents ?? [];
    if (agents.length === 0) {
      return { content: "No agents configured." };
    }
    const lines = [`**Agents** (${agents.length})\n`];
    for (const agent of agents) {
      const isDefault = agent.id === result?.defaultId;
      const name = agent.identity?.name || agent.name || agent.id;
      const marker = isDefault ? " *(default)*" : "";
      const runtime = agent.agentRuntime?.id ? ` · runtime \`${agent.agentRuntime.id}\`` : "";
      lines.push(`- \`${agent.id}\` — ${name}${marker}${runtime}`);
    }
    return { content: lines.join("\n") };
  } catch (err) {
    return { content: `Failed to list agents: ${String(err)}` };
  }
}

function normalizeSessionKey(key?: string | null): string | undefined {
  return normalizeOptionalLowercaseString(key);
}

function selectedGlobalScope(
  sessionKey: string,
  context: SlashCommandContext,
): { agentId?: string } {
  const normalizedSessionKey = normalizeSessionKey(sessionKey);
  const parsed = parseAgentSessionKey(normalizedSessionKey ?? "");
  const aliasAgentId =
    parsed &&
    parsed.agentId !== DEFAULT_AGENT_ID &&
    (parsed.rest === DEFAULT_MAIN_KEY || parsed.rest === "global")
      ? parsed.agentId
      : undefined;
  const agentId = aliasAgentId ?? normalizeOptionalLowercaseString(context.agentId);
  return (normalizedSessionKey === "global" || aliasAgentId) && agentId ? { agentId } : {};
}

function resolveEquivalentSessionKeys(
  currentSessionKey: string,
  currentAgentId: string | undefined,
): Set<string> {
  const keys = new Set<string>([currentSessionKey]);
  if (currentAgentId && currentAgentId !== DEFAULT_AGENT_ID) {
    const agentMainKey = `agent:${currentAgentId}:${DEFAULT_MAIN_KEY}`;
    const agentGlobalKey = `agent:${currentAgentId}:global`;
    if (currentSessionKey === agentMainKey || currentSessionKey === agentGlobalKey) {
      keys.add("global");
    }
  }
  if (currentAgentId === DEFAULT_AGENT_ID) {
    const canonicalDefaultMain = `agent:${DEFAULT_AGENT_ID}:main`;
    if (currentSessionKey === DEFAULT_MAIN_KEY) {
      keys.add(canonicalDefaultMain);
    } else if (currentSessionKey === canonicalDefaultMain) {
      keys.add(DEFAULT_MAIN_KEY);
    }
  }
  return keys;
}

function formatDirectiveOptions(text: string, options: string): string {
  return `${text}\nOptions: ${options}.`;
}

function formatThinkingOptionsForSession(
  session: GatewaySessionRow | undefined,
  defaults?: SessionsListResult["defaults"],
  separator = ", ",
): string {
  return resolveThinkingLevelOptionsForSession(session, defaults)
    .map((level) => level.label)
    .join(separator);
}

function formatThinkingCommandOptionsForSession(
  session: GatewaySessionRow | undefined,
  defaults?: SessionsListResult["defaults"],
): string {
  const options = formatThinkingOptionsForSession(session, defaults);
  return options.split(", ").includes("default") ? options : `default, ${options}`;
}

function resolveThinkingLevelInput(
  rawLevel: string,
  session: GatewaySessionRow | undefined,
  defaults: SessionsListResult["defaults"] | undefined,
): string | undefined {
  const normalized = normalizeThinkLevel(rawLevel);
  if (normalized) {
    return normalized;
  }
  const rawKey = normalizeLowercaseStringOrEmpty(rawLevel);
  return resolveThinkingLevelOptionsForSession(session, defaults)
    .map((option) => ({
      id: normalizeThinkLevel(option.id) ?? normalizeLowercaseStringOrEmpty(option.id),
      label: normalizeLowercaseStringOrEmpty(option.label),
    }))
    .find((option) => option.id === rawKey || option.label === rawKey)?.id;
}

function isThinkingLevelOptionForSession(
  session: GatewaySessionRow | undefined,
  defaults: SessionsListResult["defaults"] | undefined,
  level: string,
): boolean {
  return resolveThinkingLevelOptionsForSession(session, defaults).some((option) => {
    const id = normalizeThinkLevel(option.id) ?? normalizeLowercaseStringOrEmpty(option.id);
    return id === level || normalizeThinkLevel(option.label) === level;
  });
}

function resolveThinkingLevelOptionsForSession(
  session: GatewaySessionRow | undefined,
  defaults: SessionsListResult["defaults"] | undefined,
): GatewayThinkingLevelOption[] {
  if (session?.thinkingLevels?.length) {
    return session.thinkingLevels;
  }
  const matchesDefaults = sessionModelMatchesDefaults(session, defaults);
  if (matchesDefaults && defaults?.thinkingLevels?.length) {
    return defaults.thinkingLevels;
  }
  const labels =
    (session?.thinkingOptions?.length ? session.thinkingOptions : null) ??
    (matchesDefaults && defaults?.thinkingOptions?.length ? defaults.thinkingOptions : null) ??
    formatThinkingLevels(
      session?.modelProvider ?? defaults?.modelProvider,
      session?.model ?? defaults?.model,
    ).split(/\s*,\s*/);
  return labels.filter(Boolean).map((label) => ({
    id: normalizeThinkLevel(label) ?? normalizeLowercaseStringOrEmpty(label),
    label,
  }));
}

function sessionModelMatchesDefaults(
  session: GatewaySessionRow | undefined,
  defaults: SessionsListResult["defaults"] | undefined,
): boolean {
  return (
    (!session?.modelProvider || session.modelProvider === defaults?.modelProvider) &&
    (!session?.model || session.model === defaults?.model)
  );
}

async function loadCurrentSession(
  client: GatewayBrowserClient,
  sessionKey: string,
): Promise<GatewaySessionRow | undefined> {
  return (await loadCurrentSessionState(client, sessionKey)).session;
}

async function loadCurrentSessionState(
  client: GatewayBrowserClient,
  sessionKey: string,
): Promise<{
  session: GatewaySessionRow | undefined;
  defaults: SessionsListResult["defaults"] | undefined;
}> {
  const sessions = await client.request<SessionsListResult>("sessions.list", {});
  return {
    session: resolveCurrentSession(sessions, sessionKey),
    defaults: sessions?.defaults,
  };
}

function resolveCurrentSession(
  sessions: SessionsListResult | undefined,
  sessionKey: string,
): GatewaySessionRow | undefined {
  const normalizedSessionKey = normalizeSessionKey(sessionKey);
  const currentAgentId =
    parseAgentSessionKey(normalizedSessionKey ?? "")?.agentId ??
    (normalizedSessionKey === DEFAULT_MAIN_KEY ? DEFAULT_AGENT_ID : undefined);
  const aliases = normalizedSessionKey
    ? resolveEquivalentSessionKeys(normalizedSessionKey, currentAgentId)
    : new Set<string>();
  return sessions?.sessions?.find((session: GatewaySessionRow) => {
    const key = normalizeSessionKey(session.key);
    return key ? aliases.has(key) : false;
  });
}

async function loadThinkingCommandState(client: GatewayBrowserClient, sessionKey: string) {
  const [sessions, models] = await Promise.all([
    client.request<SessionsListResult>("sessions.list", {}),
    loadModelCatalog(client),
  ]);
  return {
    session: resolveCurrentSession(sessions, sessionKey),
    defaults: sessions?.defaults,
    models,
  };
}

async function loadModelCatalog(
  client: GatewayBrowserClient,
  opts?: { allowFailure?: boolean },
): Promise<ModelCatalogEntry[]> {
  try {
    const result = await client.request<{ models: ModelCatalogEntry[] }>("models.list", {
      view: "configured",
    });
    return result?.models ?? [];
  } catch (err) {
    if (opts?.allowFailure) {
      return [];
    }
    throw err;
  }
}

function resolveCurrentThinkingLevel(
  session: GatewaySessionRow | undefined,
  defaults: SessionsListResult["defaults"] | undefined,
  models: ModelCatalogEntry[],
): string {
  const persisted = normalizeThinkLevel(session?.thinkingLevel);
  if (persisted) {
    return (
      resolveThinkingLevelOptionsForSession(session, defaults).find(
        (level) => normalizeThinkLevel(level.id) === persisted,
      )?.label ?? persisted
    );
  }
  if (session?.thinkingDefault) {
    return session.thinkingDefault;
  }
  if ((!session || sessionModelMatchesDefaults(session, defaults)) && defaults?.thinkingDefault) {
    return defaults.thinkingDefault;
  }
  const provider = session?.modelProvider ?? defaults?.modelProvider;
  const model = session?.model ?? defaults?.model;
  if (!provider || !model) {
    return "off";
  }
  return resolveThinkingDefaultForModel({
    provider,
    model,
    catalog: models,
  });
}

function resolveCurrentFastMode(session: GatewaySessionRow | undefined): "on" | "off" {
  return session?.fastMode === true ? "on" : "off";
}

<<<<<<< HEAD
/**
 * Match a target name against active subagent sessions by key/label only.
 * Unlike resolveKillTargets, this does NOT match by agent id (avoiding
 * false positives for common words like "main") and filters to active
 * sessions (no endedAt) so stale subagents are not targeted.
 */
function resolveSteerSubagent(
  sessions: GatewaySessionRow[],
  currentSessionKey: string,
  target: string,
): string[] {
  const normalizedTarget = target.trim().toLowerCase();
  if (!normalizedTarget) {
    return [];
  }
  const normalizedCurrentSessionKey = currentSessionKey.trim().toLowerCase();
  const currentParsed = parseAgentSessionKey(normalizedCurrentSessionKey);
  const currentAgentId =
    currentParsed?.agentId ??
    (normalizedCurrentSessionKey === DEFAULT_MAIN_KEY ? DEFAULT_AGENT_ID : undefined);
  const sessionIndex = buildSessionIndex(sessions);

  const keys = new Set<string>();
  for (const session of sessions) {
    const key = session?.key?.trim();
    if (!key || !isSubagentSessionKey(key)) {
      continue;
    }
    const normalizedKey = key.toLowerCase();
    const parsed = parseAgentSessionKey(normalizedKey);
    const belongsToCurrentSession = isWithinCurrentSessionSubtree(
      normalizedKey,
      normalizedCurrentSessionKey,
      sessionIndex,
      currentAgentId,
      parsed?.agentId,
    );
    if (!belongsToCurrentSession) {
      continue;
    }
    // P2: match only on subagent key suffix or label, not agent id
    const isMatch =
      normalizedKey === normalizedTarget ||
      normalizedKey.endsWith(`:subagent:${normalizedTarget}`) ||
      normalizedKey === `subagent:${normalizedTarget}` ||
      (session.label ?? "").toLowerCase() === normalizedTarget;
    if (isMatch) {
      keys.add(key);
    }
  }
  return [...keys];
}

/**
 * Resolve an optional subagent target from the first word of args.
 * Returns the resolved session key and the remaining message, or
 * falls back to the current session key with the full args as message.
 *
 * Ended subagents are still resolved here so explicit `/steer <id> ...`
 * can surface the correct "No active run matched" message and `/redirect <id> ...`
 * can restart that specific session instead of silently steering the current one.
 */
async function resolveSteerTarget(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<
  | { key: string; message: string; label?: string; sessions?: SessionsListResult }
  | { error: string }
> {
=======
async function resolveSteerTarget(
  sessionKey: string,
  args: string,
): Promise<{ key: string; message: string } | { error: string }> {
>>>>>>> upstream/main
  const trimmed = args.trim();
  if (!trimmed) {
    return { error: "empty" };
  }
<<<<<<< HEAD
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx > 0) {
    const maybeTarget = trimmed.slice(0, spaceIdx);
    const rest = trimmed.slice(spaceIdx + 1).trim();
    // Skip "all" — resolveKillTargets treats it as a wildcard, but steer/redirect
    // target a single session, so "all good now" should not match subagents.
    if (rest && maybeTarget.toLowerCase() !== "all") {
      const sessions =
        context.sessionsResult ?? (await client.request<SessionsListResult>("sessions.list", {}));
      const matched = resolveSteerSubagent(sessions?.sessions ?? [], sessionKey, maybeTarget);
      if (matched.length === 1) {
        return { key: matched[0], message: rest, label: maybeTarget, sessions };
      }
      if (matched.length > 1) {
        return { error: `Multiple sub-agents match \`${maybeTarget}\`. Be more specific.` };
      }
    }
  }
  return { key: sessionKey, message: trimmed };
=======
  return {
    key: sessionKey,
    message: trimmed,
  };
>>>>>>> upstream/main
}

function isActiveSteerSession(session: GatewaySessionRow | undefined): boolean {
  return session?.status === "running" && session.endedAt == null;
}

/** Soft inject — queues a message into the active run via chat.send (deliver: false). */
async function executeSteer(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  try {
<<<<<<< HEAD
    const resolved = await resolveSteerTarget(client, sessionKey, args, context);
    if ("error" in resolved) {
      return {
        content: resolved.error === "empty" ? "Usage: `/steer [id] <message>`" : resolved.error,
      };
    }
    const sessions =
      resolved.sessions ?? (await client.request<SessionsListResult>("sessions.list", {}));
    const targetSession = resolveCurrentSession(sessions, resolved.key);
    if (!isActiveSteerSession(targetSession)) {
      return {
        content: resolved.label
          ? `No active run matched \`${resolved.label}\`. Use \`/redirect\` instead.`
          : "No active run. Use the chat input or `/redirect` instead.",
=======
    const resolved = await resolveSteerTarget(sessionKey, args);
    if ("error" in resolved) {
      return {
        content: resolved.error === "empty" ? "Usage: `/steer <message>`" : resolved.error,
      };
    }
    const sessions =
      context.sessionsResult ??
      (await client.request<SessionsListResult>(
        "sessions.list",
        selectedGlobalScope(sessionKey, context),
      ));
    const targetSession = resolveCurrentSession(sessions, resolved.key);
    if (!isActiveSteerSession(targetSession)) {
      return {
        content: "No active run. Use the chat input or `/redirect` instead.",
>>>>>>> upstream/main
      };
    }
    await client.request("chat.send", {
      sessionKey: resolved.key,
<<<<<<< HEAD
=======
      ...selectedGlobalScope(resolved.key, context),
>>>>>>> upstream/main
      message: resolved.message,
      deliver: false,
      idempotencyKey: generateUUID(),
    });
    return {
<<<<<<< HEAD
      content: resolved.label ? `Steered \`${resolved.label}\`.` : "Steered.",
=======
      content: "Steered.",
>>>>>>> upstream/main
      pendingCurrentRun: resolved.key === sessionKey,
    };
  } catch (err) {
    return { content: `Failed to steer: ${String(err)}` };
  }
}

/** Hard redirect — aborts the active run and restarts with a new message. */
async function executeRedirect(
  client: GatewayBrowserClient,
  sessionKey: string,
  args: string,
  context: SlashCommandContext,
): Promise<SlashCommandResult> {
  try {
<<<<<<< HEAD
    const resolved = await resolveSteerTarget(client, sessionKey, args, context);
    if ("error" in resolved) {
      return {
        content: resolved.error === "empty" ? "Usage: `/redirect [id] <message>`" : resolved.error,
=======
    const resolved = await resolveSteerTarget(sessionKey, args);
    if ("error" in resolved) {
      return {
        content: resolved.error === "empty" ? "Usage: `/redirect <message>`" : resolved.error,
>>>>>>> upstream/main
      };
    }
    const resp = await client.request<{ runId?: string }>("sessions.steer", {
      key: resolved.key,
<<<<<<< HEAD
      message: resolved.message,
    });
    // Only track the run when redirecting the current session. Subagent
    // redirects target a different sessionKey, so chat events for that run
    // would never clear chatRunId on the current view.
    const runId = typeof resp?.runId === "string" ? resp.runId : undefined;
    const trackRunId = resolved.key === sessionKey ? runId : undefined;
    return {
      content: resolved.label ? `Redirected \`${resolved.label}\`.` : "Redirected.",
      trackRunId,
=======
      ...selectedGlobalScope(resolved.key, context),
      message: resolved.message,
    });
    const runId = typeof resp?.runId === "string" ? resp.runId : undefined;
    return {
      content: "Redirected.",
      trackRunId: runId,
>>>>>>> upstream/main
    };
  } catch (err) {
    return { content: `Failed to redirect: ${String(err)}` };
  }
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}
