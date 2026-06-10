<<<<<<< HEAD
import { resolveSubagentLabel, sortSubagentRuns } from "../auto-reply/reply/subagents-utils.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveStorePath } from "../config/sessions/paths.js";
import { loadSessionStore } from "../config/sessions/store-load.js";
import type { SessionEntry } from "../config/sessions/types.js";
=======
/**
 * Subagent list builder.
 *
 * Combines live registry runs and persisted session metadata for sessions_list/subagents views.
 */
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { resolveSubagentLabel, sortSubagentRuns } from "../auto-reply/reply/subagents-utils.js";
import { resolveStorePath } from "../config/sessions/paths.js";
import { loadSessionStore } from "../config/sessions/store-load.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main
import { parseAgentSessionKey, type ParsedAgentSessionKey } from "../routing/session-key.js";
import {
  formatDurationCompact,
  formatTokenUsageDisplay,
  resolveTotalTokens,
  truncateLine,
} from "../shared/subagents-format.js";
import { resolveModelDisplayName, resolveModelDisplayRef } from "./model-selection-display.js";
import { subagentRuns } from "./subagent-registry-memory.js";
<<<<<<< HEAD
import { countPendingDescendantRunsFromRuns } from "./subagent-registry-queries.js";
=======
import {
  countActiveDescendantRunsFromRuns,
  countPendingDescendantRunsFromRuns,
} from "./subagent-registry-queries.js";
>>>>>>> upstream/main
import {
  getSubagentSessionRuntimeMs,
  getSubagentSessionStartedAt,
} from "./subagent-registry-read.js";
import { getSubagentRunsSnapshotForRead } from "./subagent-registry-state.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
<<<<<<< HEAD

export type SubagentListItem = {
=======
import {
  hasSubagentRunEnded,
  isLiveUnendedSubagentRun,
  shouldKeepSubagentRunChildLink,
} from "./subagent-run-liveness.js";

type SubagentListItem = {
>>>>>>> upstream/main
  index: number;
  line: string;
  runId: string;
  sessionKey: string;
<<<<<<< HEAD
=======
  taskName?: string;
>>>>>>> upstream/main
  label: string;
  task: string;
  status: string;
  pendingDescendants: number;
  runtime: string;
  runtimeMs: number;
  childSessions?: string[];
  model?: string;
  totalTokens?: number;
  startedAt?: number;
  endedAt?: number;
};

<<<<<<< HEAD
export type BuiltSubagentList = {
=======
type BuiltSubagentList = {
>>>>>>> upstream/main
  total: number;
  active: SubagentListItem[];
  recent: SubagentListItem[];
  text: string;
};

<<<<<<< HEAD
export type SessionEntryResolution = {
=======
type SessionEntryResolution = {
>>>>>>> upstream/main
  storePath: string;
  entry: SessionEntry | undefined;
};

<<<<<<< HEAD
function resolveStorePathForKey(
  cfg: OpenClawConfig,
  key: string,
  parsed?: ParsedAgentSessionKey | null,
) {
=======
function resolveStorePathForKey(cfg: OpenClawConfig, parsed?: ParsedAgentSessionKey | null) {
>>>>>>> upstream/main
  return resolveStorePath(cfg.session?.store, {
    agentId: parsed?.agentId,
  });
}

<<<<<<< HEAD
=======
/** Resolve persisted session metadata for a session key, caching per store path. */
>>>>>>> upstream/main
export function resolveSessionEntryForKey(params: {
  cfg: OpenClawConfig;
  key: string;
  cache: Map<string, Record<string, SessionEntry>>;
}): SessionEntryResolution {
  const parsed = parseAgentSessionKey(params.key);
<<<<<<< HEAD
  const storePath = resolveStorePathForKey(params.cfg, params.key, parsed);
=======
  const storePath = resolveStorePathForKey(params.cfg, parsed);
>>>>>>> upstream/main
  let store = params.cache.get(storePath);
  if (!store) {
    store = loadSessionStore(storePath);
    params.cache.set(storePath, store);
  }
  return {
    storePath,
    entry: store[params.key],
  };
}

<<<<<<< HEAD
export function buildLatestSubagentRunIndex(runs: Map<string, SubagentRunRecord>) {
=======
/** Build child-session indexes from the latest run associated with each child key. */
export function buildLatestSubagentRunIndex(
  runs: Map<string, SubagentRunRecord>,
  options?: { now?: number },
) {
  const now = options?.now ?? Date.now();
>>>>>>> upstream/main
  const latestByChildSessionKey = new Map<string, SubagentRunRecord>();
  for (const entry of runs.values()) {
    const childSessionKey = entry.childSessionKey?.trim();
    if (!childSessionKey) {
      continue;
    }
    const existing = latestByChildSessionKey.get(childSessionKey);
    if (!existing || entry.createdAt > existing.createdAt) {
      latestByChildSessionKey.set(childSessionKey, entry);
    }
  }

  const childSessionsByController = new Map<string, string[]>();
  for (const [childSessionKey, entry] of latestByChildSessionKey.entries()) {
    const controllerSessionKey =
      entry.controllerSessionKey?.trim() || entry.requesterSessionKey?.trim();
    if (!controllerSessionKey) {
      continue;
    }
<<<<<<< HEAD
=======
    if (
      !shouldKeepSubagentRunChildLink(entry, {
        activeDescendants: countActiveDescendantRunsFromRuns(runs, childSessionKey),
        now,
      })
    ) {
      // Completed child links age out unless active descendants still depend on
      // the controller relationship.
      continue;
    }
>>>>>>> upstream/main
    const existing = childSessionsByController.get(controllerSessionKey);
    if (existing) {
      existing.push(childSessionKey);
      continue;
    }
    childSessionsByController.set(controllerSessionKey, [childSessionKey]);
  }
<<<<<<< HEAD
  for (const childSessions of childSessionsByController.values()) {
    childSessions.sort();
=======
  for (const [controllerSessionKey, childSessions] of childSessionsByController) {
    childSessionsByController.set(controllerSessionKey, childSessions.toSorted());
>>>>>>> upstream/main
  }

  return {
    latestByChildSessionKey,
    childSessionsByController,
  };
}

<<<<<<< HEAD
=======
/** Create a cached descendant counter for repeated list rendering checks. */
>>>>>>> upstream/main
export function createPendingDescendantCounter(runsSnapshot?: Map<string, SubagentRunRecord>) {
  const pendingDescendantCache = new Map<string, number>();
  return (sessionKey: string) => {
    if (pendingDescendantCache.has(sessionKey)) {
      return pendingDescendantCache.get(sessionKey) ?? 0;
    }
    const snapshot = runsSnapshot ?? getSubagentRunsSnapshotForRead(subagentRuns);
    const pending = Math.max(0, countPendingDescendantRunsFromRuns(snapshot, sessionKey));
    pendingDescendantCache.set(sessionKey, pending);
    return pending;
  };
}

<<<<<<< HEAD
=======
/** Return whether a run should be shown in the active subagent section. */
>>>>>>> upstream/main
export function isActiveSubagentRun(
  entry: SubagentRunRecord,
  pendingDescendantCount: (sessionKey: string) => number,
) {
<<<<<<< HEAD
  return !entry.endedAt || pendingDescendantCount(entry.childSessionKey) > 0;
=======
  return isLiveUnendedSubagentRun(entry) || pendingDescendantCount(entry.childSessionKey) > 0;
>>>>>>> upstream/main
}

function resolveRunStatus(entry: SubagentRunRecord, options?: { pendingDescendants?: number }) {
  const pendingDescendants = Math.max(0, options?.pendingDescendants ?? 0);
  if (pendingDescendants > 0) {
    const childLabel = pendingDescendants === 1 ? "child" : "children";
    return `active (waiting on ${pendingDescendants} ${childLabel})`;
  }
<<<<<<< HEAD
  if (!entry.endedAt) {
=======
  if (!hasSubagentRunEnded(entry)) {
>>>>>>> upstream/main
    return "running";
  }
  const status = entry.outcome?.status ?? "done";
  if (status === "ok") {
    return "done";
  }
  if (status === "error") {
    return "failed";
  }
  return status;
}

function resolveModelRef(entry?: SessionEntry, fallbackModel?: string) {
  return resolveModelDisplayRef({
    runtimeProvider: entry?.modelProvider,
    runtimeModel: entry?.model,
    overrideProvider: entry?.providerOverride,
    overrideModel: entry?.modelOverride,
    fallbackModel,
  });
}

function resolveModelDisplay(entry?: SessionEntry, fallbackModel?: string) {
  return resolveModelDisplayName({
    runtimeProvider: entry?.modelProvider,
    runtimeModel: entry?.model,
    overrideProvider: entry?.providerOverride,
    overrideModel: entry?.modelOverride,
    fallbackModel,
  });
}

function buildListText(params: {
  active: Array<{ line: string }>;
  recent: Array<{ line: string }>;
  recentMinutes: number;
}) {
  const lines: string[] = [];
  lines.push("active subagents:");
  if (params.active.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(...params.active.map((entry) => entry.line));
  }
  lines.push("");
  lines.push(`recent (last ${params.recentMinutes}m):`);
  if (params.recent.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(...params.recent.map((entry) => entry.line));
  }
  return lines.join("\n");
}

<<<<<<< HEAD
=======
/** Build structured and text views for active and recent subagent runs. */
>>>>>>> upstream/main
export function buildSubagentList(params: {
  cfg: OpenClawConfig;
  runs: SubagentRunRecord[];
  recentMinutes: number;
  taskMaxChars?: number;
}): BuiltSubagentList {
  const now = Date.now();
  const recentCutoff = now - params.recentMinutes * 60_000;
  const dedupedRuns: SubagentRunRecord[] = [];
  const seenChildSessionKeys = new Set<string>();
  for (const entry of sortSubagentRuns(params.runs)) {
    if (seenChildSessionKeys.has(entry.childSessionKey)) {
      continue;
    }
<<<<<<< HEAD
=======
    // Multiple records can point at one child session after steering or retry;
    // the sorted first entry is the display authority.
>>>>>>> upstream/main
    seenChildSessionKeys.add(entry.childSessionKey);
    dedupedRuns.push(entry);
  }
  const cache = new Map<string, Record<string, SessionEntry>>();
  const snapshot = getSubagentRunsSnapshotForRead(subagentRuns);
  const { childSessionsByController } = buildLatestSubagentRunIndex(snapshot);
  const pendingDescendantCount = createPendingDescendantCounter(snapshot);
  let index = 1;
  const buildListEntry = (entry: SubagentRunRecord, runtimeMs: number) => {
    const sessionEntry = resolveSessionEntryForKey({
      cfg: params.cfg,
      key: entry.childSessionKey,
      cache,
    }).entry;
    const totalTokens = resolveTotalTokens(sessionEntry);
    const usageText = formatTokenUsageDisplay(sessionEntry);
    const pendingDescendants = pendingDescendantCount(entry.childSessionKey);
    const status = resolveRunStatus(entry, {
      pendingDescendants,
    });
    const childSessions = childSessionsByController.get(entry.childSessionKey) ?? [];
    const runtime = formatDurationCompact(runtimeMs) ?? "n/a";
    const label = truncateLine(resolveSubagentLabel(entry), 48);
    const task = truncateLine(entry.task.trim(), params.taskMaxChars ?? 72);
<<<<<<< HEAD
    const line = `${index}. ${label} (${resolveModelDisplay(sessionEntry, entry.model)}, ${runtime}${usageText ? `, ${usageText}` : ""}) ${status}${task.toLowerCase() !== label.toLowerCase() ? ` - ${task}` : ""}`;
=======
    const taskName = entry.taskName?.trim();
    const taskNamePrefix = taskName ? `${taskName}: ` : "";
    const line = `${index}. ${taskNamePrefix}${label} (${resolveModelDisplay(sessionEntry, entry.model)}, ${runtime}${usageText ? `, ${usageText}` : ""}) ${status}${normalizeLowercaseStringOrEmpty(task) !== normalizeLowercaseStringOrEmpty(label) ? ` - ${task}` : ""}`;
>>>>>>> upstream/main
    const view: SubagentListItem = {
      index,
      line,
      runId: entry.runId,
      sessionKey: entry.childSessionKey,
<<<<<<< HEAD
=======
      ...(taskName ? { taskName } : {}),
>>>>>>> upstream/main
      label,
      task,
      status,
      pendingDescendants,
      runtime,
      runtimeMs,
      ...(childSessions.length > 0 ? { childSessions } : {}),
      model: resolveModelRef(sessionEntry, entry.model),
      totalTokens,
      startedAt: getSubagentSessionStartedAt(entry),
      ...(entry.endedAt ? { endedAt: entry.endedAt } : {}),
    };
    index += 1;
    return view;
  };
  const active = dedupedRuns
    .filter((entry) => isActiveSubagentRun(entry, pendingDescendantCount))
    .map((entry) => buildListEntry(entry, getSubagentSessionRuntimeMs(entry, now) ?? 0));
  const recent = dedupedRuns
    .filter(
      (entry) =>
        !isActiveSubagentRun(entry, pendingDescendantCount) &&
<<<<<<< HEAD
        !!entry.endedAt &&
=======
        Boolean(entry.endedAt) &&
>>>>>>> upstream/main
        (entry.endedAt ?? 0) >= recentCutoff,
    )
    .map((entry) =>
      buildListEntry(entry, getSubagentSessionRuntimeMs(entry, entry.endedAt ?? now) ?? 0),
    );
  return {
    total: dedupedRuns.length,
    active,
    recent,
    text: buildListText({ active, recent, recentMinutes: params.recentMinutes }),
  };
}
