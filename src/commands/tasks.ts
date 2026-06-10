<<<<<<< HEAD
import { loadConfig } from "../config/config.js";
import { info } from "../globals.js";
import type { RuntimeEnv } from "../runtime.js";
import {
  cancelTaskById,
  getTaskById,
  updateTaskNotifyPolicyById,
} from "../tasks/runtime-internal.js";
import {
  listTaskFlowAuditFindings,
  summarizeTaskFlowAuditFindings,
  type TaskFlowAuditCode,
  type TaskFlowAuditSeverity,
} from "../tasks/task-flow-registry.audit.js";
=======
// Human-facing background task commands.
// Handles task listing/show/cancel/notify/audit plus registry maintenance for tasks, flows, and sessions.

import fs from "node:fs";
import { timestampMsToIsoString } from "@openclaw/normalization-core/number-coercion";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { isRich, theme } from "../../packages/terminal-core/src/theme.js";
import { formatCliCommand } from "../cli/command-format.js";
import { formatLookupMiss } from "../cli/error-format.js";
import { getRuntimeConfig } from "../config/config.js";
import {
  loadSessionStore,
  pruneStaleEntries,
  resolveAllAgentSessionStoreTargetsSync,
  updateSessionStore,
  type SessionEntry,
} from "../config/sessions.js";
import { loadCronJobsStoreSync, resolveCronJobsStorePath } from "../cron/store.js";
import type { RuntimeEnv } from "../runtime.js";
import { parseAgentSessionKey } from "../sessions/session-key-utils.js";
import { getTaskById, updateTaskNotifyPolicyById } from "../tasks/runtime-internal.js";
import { cancelDetachedTaskRunById } from "../tasks/task-executor.js";
import { listTaskFlowAuditFindings } from "../tasks/task-flow-registry.audit.js";
>>>>>>> upstream/main
import {
  getInspectableTaskFlowAuditSummary,
  previewTaskFlowRegistryMaintenance,
  runTaskFlowRegistryMaintenance,
} from "../tasks/task-flow-registry.maintenance.js";
<<<<<<< HEAD
import type { TaskFlowRecord } from "../tasks/task-flow-registry.types.js";
import {
  listTaskAuditFindings,
  summarizeTaskAuditFindings,
  type TaskAuditCode,
  type TaskAuditSeverity,
=======
import {
  listTaskAuditFindings,
  summarizeRetainedLostTaskAuditFindings,
  summarizeTaskAuditFindings,
>>>>>>> upstream/main
} from "../tasks/task-registry.audit.js";
import {
  getInspectableTaskAuditSummary,
  getInspectableTaskRegistrySummary,
<<<<<<< HEAD
=======
  configureTaskRegistryMaintenance,
  getTaskRegistryMaintenanceDiagnostics,
>>>>>>> upstream/main
  previewTaskRegistryMaintenance,
  runTaskRegistryMaintenance,
} from "../tasks/task-registry.maintenance.js";
import {
  reconcileInspectableTasks,
  reconcileTaskLookupToken,
} from "../tasks/task-registry.reconcile.js";
import { summarizeTaskRecords } from "../tasks/task-registry.summary.js";
import type { TaskNotifyPolicy, TaskRecord } from "../tasks/task-registry.types.js";
<<<<<<< HEAD
import { isRich, theme } from "../terminal/theme.js";
=======
import {
  buildTaskSystemAuditFindings,
  type TaskSystemAuditCode,
  type TaskSystemAuditFinding,
  type TaskSystemAuditSeverity,
} from "./tasks-audit-system.js";
>>>>>>> upstream/main

const RUNTIME_PAD = 8;
const STATUS_PAD = 10;
const DELIVERY_PAD = 14;
const ID_PAD = 10;
const RUN_PAD = 10;
<<<<<<< HEAD
=======
const SESSION_REGISTRY_RETENTION_MS = 7 * 24 * 60 * 60_000;

const info = theme.info;

function formatTaskLookupMiss(lookup: string): string {
  return formatLookupMiss({
    noun: "Task",
    value: lookup,
    listCommand: "openclaw tasks list",
    valueLabel: "task id",
  });
}

function formatTaskTimestamp(value: number | undefined): string {
  return timestampMsToIsoString(value) ?? "n/a";
}

async function loadTaskCancelConfig() {
  return getRuntimeConfig();
}

type GatewayTaskCancelSummary = {
  id?: string;
  taskId?: string;
  runtime?: string;
  runId?: string;
};

type GatewayTaskCancelResult = {
  found?: boolean;
  cancelled?: boolean;
  reason?: string;
  task?: GatewayTaskCancelSummary;
};

async function tryCancelCronTaskViaGateway(
  task: TaskRecord,
): Promise<GatewayTaskCancelResult | null> {
  if (task.runtime !== "cron") {
    return null;
  }
  try {
    const { callGateway } = await import("../gateway/call.js");
    return await callGateway<GatewayTaskCancelResult>({
      method: "tasks.cancel",
      params: { taskId: task.taskId },
      timeoutMs: 5_000,
    });
  } catch {
    return null;
  }
}

function configureTaskMaintenanceFromConfig(): void {
  const cfg = getRuntimeConfig();
  configureTaskRegistryMaintenance({
    cronStorePath: resolveCronJobsStorePath(cfg.cron?.store),
  });
}

type SessionRegistryMaintenanceStoreSummary = {
  agentId: string;
  storePath: string;
  beforeCount: number;
  afterCount: number;
  pruned: number;
  preservedRunning: number;
};

type SessionRegistryMaintenanceSummary = {
  retentionMs: number;
  runningCronJobs: number;
  pruned: number;
  stores: SessionRegistryMaintenanceStoreSummary[];
};

function parseCronRunSessionJobId(sessionKey: string): string | undefined {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) {
    return undefined;
  }
  return /^cron:([^:]+):run:[^:]+$/u.exec(parsed.rest)?.[1];
}

function readRunningCronJobIds(): Set<string> {
  try {
    const cronStorePath = resolveCronJobsStorePath(getRuntimeConfig().cron?.store);
    return new Set(
      loadCronJobsStoreSync(cronStorePath)
        .jobs.filter((job) => typeof job.state?.runningAtMs === "number")
        // Cron session keys are matched case-insensitively against job ids.
        .map((job) => job.id.toLowerCase()),
    );
  } catch {
    return new Set();
  }
}

function buildSessionRegistryPreserveKeys(params: {
  store: Record<string, SessionEntry>;
  runningCronJobIds: ReadonlySet<string>;
}): { preserveKeys: Set<string>; preservedRunning: number } {
  const preserveKeys = new Set<string>();
  let preservedRunning = 0;
  for (const key of Object.keys(params.store)) {
    const jobId = parseCronRunSessionJobId(key);
    if (!jobId) {
      // Non-cron session rows are outside this maintenance pass; preserve them.
      preserveKeys.add(key);
      continue;
    }
    if (params.runningCronJobIds.has(jobId)) {
      preserveKeys.add(key);
      preservedRunning += 1;
    }
  }
  return { preserveKeys, preservedRunning };
}

async function runSessionRegistryMaintenance(params: {
  apply: boolean;
}): Promise<SessionRegistryMaintenanceSummary> {
  const cfg = getRuntimeConfig();
  const runningCronJobIds = readRunningCronJobIds();
  const stores: SessionRegistryMaintenanceStoreSummary[] = [];
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg)) {
    if (!fs.existsSync(target.storePath)) {
      stores.push({
        agentId: target.agentId,
        storePath: target.storePath,
        beforeCount: 0,
        afterCount: 0,
        pruned: 0,
        preservedRunning: 0,
      });
      continue;
    }
    const beforeStore = loadSessionStore(target.storePath, { skipCache: true });
    const beforeCount = Object.keys(beforeStore).length;
    if (params.apply) {
      // Apply mode mutates each store atomically through updateSessionStore.
      const applied = await updateSessionStore(
        target.storePath,
        (store) => {
          const { preserveKeys, preservedRunning } = buildSessionRegistryPreserveKeys({
            store,
            runningCronJobIds,
          });
          const pruned = pruneStaleEntries(store, SESSION_REGISTRY_RETENTION_MS, {
            log: false,
            preserveKeys,
          });
          return {
            pruned,
            afterCount: Object.keys(store).length,
            preservedRunning,
          };
        },
        { skipMaintenance: true },
      );
      stores.push({
        agentId: target.agentId,
        storePath: target.storePath,
        beforeCount,
        afterCount: applied.afterCount,
        pruned: applied.pruned,
        preservedRunning: applied.preservedRunning,
      });
      continue;
    }
    const previewStore = structuredClone(beforeStore);
    // Preview mode runs pruning against a clone so dry-run output cannot change stores.
    const { preserveKeys, preservedRunning } = buildSessionRegistryPreserveKeys({
      store: previewStore,
      runningCronJobIds,
    });
    const pruned = pruneStaleEntries(previewStore, SESSION_REGISTRY_RETENTION_MS, {
      log: false,
      preserveKeys,
    });
    stores.push({
      agentId: target.agentId,
      storePath: target.storePath,
      beforeCount,
      afterCount: Object.keys(previewStore).length,
      pruned,
      preservedRunning,
    });
  }
  return {
    retentionMs: SESSION_REGISTRY_RETENTION_MS,
    runningCronJobs: runningCronJobIds.size,
    pruned: stores.reduce((total, store) => total + store.pruned, 0),
    stores,
  };
}
>>>>>>> upstream/main

function truncate(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }
  if (maxChars <= 1) {
    return value.slice(0, maxChars);
  }
  return `${value.slice(0, maxChars - 1)}…`;
}

function shortToken(value: string | undefined, maxChars = ID_PAD): string {
<<<<<<< HEAD
  const trimmed = value?.trim();
=======
  const trimmed = normalizeOptionalString(value);
>>>>>>> upstream/main
  if (!trimmed) {
    return "n/a";
  }
  return truncate(trimmed, maxChars);
}

function formatTaskStatusCell(status: string, rich: boolean) {
  const padded = status.padEnd(STATUS_PAD);
  if (!rich) {
    return padded;
  }
  if (status === "succeeded") {
    return theme.success(padded);
  }
  if (status === "failed" || status === "lost" || status === "timed_out") {
    return theme.error(padded);
  }
  if (status === "running") {
    return theme.accentBright(padded);
  }
  return theme.muted(padded);
}

function formatTaskRows(tasks: TaskRecord[], rich: boolean) {
  const header = [
    "Task".padEnd(ID_PAD),
    "Kind".padEnd(RUNTIME_PAD),
    "Status".padEnd(STATUS_PAD),
    "Delivery".padEnd(DELIVERY_PAD),
    "Run".padEnd(RUN_PAD),
    "Child Session",
    "Summary",
  ].join(" ");
  const lines = [rich ? theme.heading(header) : header];
  for (const task of tasks) {
    const summary = truncate(
<<<<<<< HEAD
      task.terminalSummary?.trim() ||
        task.progressSummary?.trim() ||
        task.label?.trim() ||
=======
      normalizeOptionalString(task.terminalSummary) ||
        normalizeOptionalString(task.progressSummary) ||
        normalizeOptionalString(task.label) ||
>>>>>>> upstream/main
        task.task.trim(),
      80,
    );
    const line = [
      shortToken(task.taskId).padEnd(ID_PAD),
      task.runtime.padEnd(RUNTIME_PAD),
      formatTaskStatusCell(task.status, rich),
      task.deliveryStatus.padEnd(DELIVERY_PAD),
      shortToken(task.runId, RUN_PAD).padEnd(RUN_PAD),
<<<<<<< HEAD
      truncate(task.childSessionKey?.trim() || "n/a", 36).padEnd(36),
=======
      truncate(normalizeOptionalString(task.childSessionKey) || "n/a", 36).padEnd(36),
>>>>>>> upstream/main
      summary,
    ].join(" ");
    lines.push(line.trimEnd());
  }
  return lines;
}

function formatTaskListSummary(tasks: TaskRecord[]) {
  const summary = summarizeTaskRecords(tasks);
  return `${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${summary.failures} issues`;
}

function formatAgeMs(ageMs: number | undefined): string {
  if (typeof ageMs !== "number" || ageMs < 1000) {
    return "fresh";
  }
  const totalSeconds = Math.floor(ageMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) {
    return `${days}d${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${totalSeconds}s`;
}

<<<<<<< HEAD
type TaskSystemAuditCode = TaskAuditCode | TaskFlowAuditCode;
type TaskSystemAuditSeverity = TaskAuditSeverity | TaskFlowAuditSeverity;

type TaskSystemAuditFinding = {
  kind: "task" | "task_flow";
  severity: TaskSystemAuditSeverity;
  code: TaskSystemAuditCode;
  detail: string;
  ageMs?: number;
  status?: string;
  token?: string;
  task?: TaskRecord;
  flow?: TaskFlowRecord;
};

function compareSystemAuditFindings(left: TaskSystemAuditFinding, right: TaskSystemAuditFinding) {
  const severityRank = (severity: TaskSystemAuditSeverity) => (severity === "error" ? 0 : 1);
  const severityDiff = severityRank(left.severity) - severityRank(right.severity);
  if (severityDiff !== 0) {
    return severityDiff;
  }
  const leftAge = left.ageMs ?? -1;
  const rightAge = right.ageMs ?? -1;
  if (leftAge !== rightAge) {
    return rightAge - leftAge;
  }
  const leftCreatedAt = left.task?.createdAt ?? left.flow?.createdAt ?? 0;
  const rightCreatedAt = right.task?.createdAt ?? right.flow?.createdAt ?? 0;
  return leftCreatedAt - rightCreatedAt;
}

=======
>>>>>>> upstream/main
function formatAuditRows(findings: TaskSystemAuditFinding[], rich: boolean) {
  const header = [
    "Scope".padEnd(8),
    "Severity".padEnd(8),
    "Code".padEnd(22),
    "Item".padEnd(ID_PAD),
    "Status".padEnd(STATUS_PAD),
    "Age".padEnd(8),
    "Detail",
  ].join(" ");
  const lines = [rich ? theme.heading(header) : header];
  for (const finding of findings) {
    const severity = finding.severity.padEnd(8);
    const status = formatTaskStatusCell(finding.status ?? "n/a", rich);
    const severityCell = !rich
      ? severity
      : finding.severity === "error"
        ? theme.error(severity)
        : theme.warn(severity);
    const scope = finding.kind === "task" ? "Task" : "TaskFlow";
    lines.push(
      [
        scope.padEnd(8),
        severityCell,
        finding.code.padEnd(22),
        shortToken(finding.token).padEnd(ID_PAD),
        status,
        formatAgeMs(finding.ageMs).padEnd(8),
        truncate(finding.detail, 88),
      ]
        .join(" ")
        .trimEnd(),
    );
  }
  return lines;
}

function toSystemAuditFindings(params: {
  severityFilter?: TaskSystemAuditSeverity;
  codeFilter?: TaskSystemAuditCode;
}) {
<<<<<<< HEAD
  const taskFindings = listTaskAuditFindings();
  const flowFindings = listTaskFlowAuditFindings();
  const allFindings: TaskSystemAuditFinding[] = [
    ...taskFindings.map((finding) => ({
      kind: "task" as const,
      severity: finding.severity,
      code: finding.code,
      detail: finding.detail,
      ageMs: finding.ageMs,
      status: finding.task.status,
      token: finding.task.taskId,
      task: finding.task,
    })),
    ...flowFindings.map((finding) => ({
      kind: "task_flow" as const,
      severity: finding.severity,
      code: finding.code,
      detail: finding.detail,
      ageMs: finding.ageMs,
      status: finding.flow?.status ?? "n/a",
      token: finding.flow?.flowId,
      ...(finding.flow ? { flow: finding.flow } : {}),
    })),
  ];
  const filteredFindings = allFindings
    .filter((finding) => {
      if (params.severityFilter && finding.severity !== params.severityFilter) {
        return false;
      }
      if (params.codeFilter && finding.code !== params.codeFilter) {
        return false;
      }
      return true;
    })
    .toSorted(compareSystemAuditFindings);
  const sortedAllFindings = [...allFindings].toSorted(compareSystemAuditFindings);
  return {
    allFindings: sortedAllFindings,
    filteredFindings,
    taskFindings,
    flowFindings,
    summary: {
      total: sortedAllFindings.length,
      errors: sortedAllFindings.filter((finding) => finding.severity === "error").length,
      warnings: sortedAllFindings.filter((finding) => finding.severity !== "error").length,
      tasks: summarizeTaskAuditFindings(taskFindings),
      taskFlows: summarizeTaskFlowAuditFindings(flowFindings),
    },
  };
}

=======
  // Human audit reconciles inspectable tasks first so stale detached runs are reflected.
  const taskFindings = listTaskAuditFindings({ tasks: reconcileInspectableTasks() });
  const flowFindings = listTaskFlowAuditFindings();
  return buildTaskSystemAuditFindings({
    taskFindings,
    flowFindings,
    severityFilter: params.severityFilter,
    codeFilter: params.codeFilter,
  });
}

/** Lists background tasks with optional runtime/status filters. */
>>>>>>> upstream/main
export async function tasksListCommand(
  opts: { json?: boolean; runtime?: string; status?: string },
  runtime: RuntimeEnv,
) {
  const runtimeFilter = opts.runtime?.trim();
  const statusFilter = opts.status?.trim();
  const tasks = reconcileInspectableTasks().filter((task) => {
    if (runtimeFilter && task.runtime !== runtimeFilter) {
      return false;
    }
    if (statusFilter && task.status !== statusFilter) {
      return false;
    }
    return true;
  });

  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          count: tasks.length,
          runtime: runtimeFilter ?? null,
          status: statusFilter ?? null,
          tasks,
        },
        null,
        2,
      ),
    );
    return;
  }

  runtime.log(info(`Background tasks: ${tasks.length}`));
  runtime.log(info(`Task pressure: ${formatTaskListSummary(tasks)}`));
  if (runtimeFilter) {
    runtime.log(info(`Runtime filter: ${runtimeFilter}`));
  }
  if (statusFilter) {
    runtime.log(info(`Status filter: ${statusFilter}`));
  }
  if (tasks.length === 0) {
<<<<<<< HEAD
    runtime.log("No background tasks found.");
=======
    runtime.log(
      `No background tasks found. Run ${formatCliCommand("openclaw tasks audit")} to check for stale task state.`,
    );
>>>>>>> upstream/main
    return;
  }
  const rich = isRich();
  for (const line of formatTaskRows(tasks, rich)) {
    runtime.log(line);
  }
}

<<<<<<< HEAD
=======
/** Shows one task record by id or lookup token. */
>>>>>>> upstream/main
export async function tasksShowCommand(
  opts: { json?: boolean; lookup: string },
  runtime: RuntimeEnv,
) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
<<<<<<< HEAD
    runtime.error(`Task not found: ${opts.lookup}`);
=======
    runtime.error(formatTaskLookupMiss(opts.lookup));
>>>>>>> upstream/main
    runtime.exit(1);
    return;
  }

  if (opts.json) {
    runtime.log(JSON.stringify(task, null, 2));
    return;
  }

  const lines = [
    "Background task:",
    `taskId: ${task.taskId}`,
    `kind: ${task.runtime}`,
    `sourceId: ${task.sourceId ?? "n/a"}`,
    `status: ${task.status}`,
    `result: ${task.terminalOutcome ?? "n/a"}`,
    `delivery: ${task.deliveryStatus}`,
    `notify: ${task.notifyPolicy}`,
    `ownerKey: ${task.ownerKey}`,
    `childSessionKey: ${task.childSessionKey ?? "n/a"}`,
    `parentTaskId: ${task.parentTaskId ?? "n/a"}`,
    `agentId: ${task.agentId ?? "n/a"}`,
    `runId: ${task.runId ?? "n/a"}`,
    `label: ${task.label ?? "n/a"}`,
    `task: ${task.task}`,
<<<<<<< HEAD
    `createdAt: ${new Date(task.createdAt).toISOString()}`,
    `startedAt: ${task.startedAt ? new Date(task.startedAt).toISOString() : "n/a"}`,
    `endedAt: ${task.endedAt ? new Date(task.endedAt).toISOString() : "n/a"}`,
    `lastEventAt: ${task.lastEventAt ? new Date(task.lastEventAt).toISOString() : "n/a"}`,
    `cleanupAfter: ${task.cleanupAfter ? new Date(task.cleanupAfter).toISOString() : "n/a"}`,
=======
    `createdAt: ${formatTaskTimestamp(task.createdAt)}`,
    `startedAt: ${formatTaskTimestamp(task.startedAt)}`,
    `endedAt: ${formatTaskTimestamp(task.endedAt)}`,
    `lastEventAt: ${formatTaskTimestamp(task.lastEventAt)}`,
    `cleanupAfter: ${formatTaskTimestamp(task.cleanupAfter)}`,
>>>>>>> upstream/main
    ...(task.error ? [`error: ${task.error}`] : []),
    ...(task.progressSummary ? [`progressSummary: ${task.progressSummary}`] : []),
    ...(task.terminalSummary ? [`terminalSummary: ${task.terminalSummary}`] : []),
  ];
  for (const line of lines) {
    runtime.log(line);
  }
}

<<<<<<< HEAD
=======
/** Updates a task's notification policy. */
>>>>>>> upstream/main
export async function tasksNotifyCommand(
  opts: { lookup: string; notify: TaskNotifyPolicy },
  runtime: RuntimeEnv,
) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
<<<<<<< HEAD
    runtime.error(`Task not found: ${opts.lookup}`);
=======
    runtime.error(formatTaskLookupMiss(opts.lookup));
>>>>>>> upstream/main
    runtime.exit(1);
    return;
  }
  const updated = updateTaskNotifyPolicyById({
    taskId: task.taskId,
    notifyPolicy: opts.notify,
  });
  if (!updated) {
<<<<<<< HEAD
    runtime.error(`Task not found: ${opts.lookup}`);
=======
    runtime.error(formatTaskLookupMiss(opts.lookup));
>>>>>>> upstream/main
    runtime.exit(1);
    return;
  }
  runtime.log(`Updated ${updated.taskId} notify policy to ${updated.notifyPolicy}.`);
}

<<<<<<< HEAD
export async function tasksCancelCommand(opts: { lookup: string }, runtime: RuntimeEnv) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
    runtime.error(`Task not found: ${opts.lookup}`);
    runtime.exit(1);
    return;
  }
  const result = await cancelTaskById({
    cfg: loadConfig(),
    taskId: task.taskId,
  });
  if (!result.found) {
    runtime.error(result.reason ?? `Task not found: ${opts.lookup}`);
=======
/** Cancels a detached task run by lookup token. */
export async function tasksCancelCommand(opts: { lookup: string }, runtime: RuntimeEnv) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
    runtime.error(formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  const gatewayResult = await tryCancelCronTaskViaGateway(task);
  if (gatewayResult) {
    if (!gatewayResult.found) {
      runtime.error(gatewayResult.reason ?? formatTaskLookupMiss(opts.lookup));
      runtime.exit(1);
      return;
    }
    if (!gatewayResult.cancelled) {
      runtime.error(gatewayResult.reason ?? `Could not cancel task: ${opts.lookup}`);
      runtime.exit(1);
      return;
    }
    const updated = gatewayResult.task;
    runtime.log(
      `Cancelled ${updated?.taskId ?? updated?.id ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`,
    );
    return;
  }
  const result = await cancelDetachedTaskRunById({
    cfg: await loadTaskCancelConfig(),
    taskId: task.taskId,
  });
  if (!result.found) {
    runtime.error(result.reason ?? formatTaskLookupMiss(opts.lookup));
>>>>>>> upstream/main
    runtime.exit(1);
    return;
  }
  if (!result.cancelled) {
    runtime.error(result.reason ?? `Could not cancel task: ${opts.lookup}`);
    runtime.exit(1);
    return;
  }
  const updated = getTaskById(task.taskId);
  runtime.log(
    `Cancelled ${updated?.taskId ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`,
  );
}

<<<<<<< HEAD
=======
/** Prints or serializes combined task/task-flow audit findings. */
>>>>>>> upstream/main
export async function tasksAuditCommand(
  opts: {
    json?: boolean;
    severity?: TaskSystemAuditSeverity;
    code?: TaskSystemAuditCode;
    limit?: number;
  },
  runtime: RuntimeEnv,
) {
<<<<<<< HEAD
=======
  configureTaskMaintenanceFromConfig();
>>>>>>> upstream/main
  const severityFilter = opts.severity?.trim() as TaskSystemAuditSeverity | undefined;
  const codeFilter = opts.code?.trim() as TaskSystemAuditCode | undefined;
  const { allFindings, filteredFindings, taskFindings, summary } = toSystemAuditFindings({
    severityFilter,
    codeFilter,
  });
  const limit = typeof opts.limit === "number" && opts.limit > 0 ? opts.limit : undefined;
  const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;

  if (opts.json) {
    const legacySummary = summarizeTaskAuditFindings(taskFindings);
    runtime.log(
      JSON.stringify(
        {
          count: allFindings.length,
          filteredCount: filteredFindings.length,
          displayed: displayed.length,
          filters: {
            severity: severityFilter ?? null,
            code: codeFilter ?? null,
            limit: limit ?? null,
          },
          summary: {
            ...legacySummary,
            taskFlows: summary.taskFlows,
            combined: {
              total: summary.total,
              errors: summary.errors,
              warnings: summary.warnings,
            },
          },
          findings: displayed,
        },
        null,
        2,
      ),
    );
    return;
  }

  runtime.log(
    info(
      `Tasks audit: ${summary.total} findings · ${summary.errors} errors · ${summary.warnings} warnings`,
    ),
  );
  if (severityFilter || codeFilter) {
    runtime.log(info(`Showing ${filteredFindings.length} matching findings.`));
  }
  if (severityFilter) {
    runtime.log(info(`Severity filter: ${severityFilter}`));
  }
  if (codeFilter) {
    runtime.log(info(`Code filter: ${codeFilter}`));
  }
  if (limit) {
    runtime.log(info(`Limit: ${limit}`));
  }
  runtime.log(
    info(`Task findings: ${summary.tasks.total} · TaskFlow findings: ${summary.taskFlows.total}`),
  );
  if (displayed.length === 0) {
    runtime.log("No tasks audit findings.");
    return;
  }
  const rich = isRich();
  for (const line of formatAuditRows(displayed, rich)) {
    runtime.log(line);
  }
}

<<<<<<< HEAD
=======
/** Previews or applies task, task-flow, and backing session-registry maintenance. */
>>>>>>> upstream/main
export async function tasksMaintenanceCommand(
  opts: { json?: boolean; apply?: boolean },
  runtime: RuntimeEnv,
) {
<<<<<<< HEAD
=======
  configureTaskMaintenanceFromConfig();
>>>>>>> upstream/main
  const auditBefore = getInspectableTaskAuditSummary();
  const flowAuditBefore = getInspectableTaskFlowAuditSummary();
  const taskMaintenance = opts.apply
    ? await runTaskRegistryMaintenance()
    : previewTaskRegistryMaintenance();
<<<<<<< HEAD
  const flowMaintenance = opts.apply
    ? await runTaskFlowRegistryMaintenance()
    : previewTaskFlowRegistryMaintenance();
  const summary = getInspectableTaskRegistrySummary();
  const auditAfter = opts.apply ? getInspectableTaskAuditSummary() : auditBefore;
  const flowAuditAfter = opts.apply ? getInspectableTaskFlowAuditSummary() : flowAuditBefore;
=======
  // JSON diagnostics explain the task-maintenance decision above, before the
  // separate session-registry sweep can prune backing session rows.
  const diagnostics = opts.json ? getTaskRegistryMaintenanceDiagnostics() : undefined;
  const flowMaintenance = opts.apply
    ? await runTaskFlowRegistryMaintenance()
    : previewTaskFlowRegistryMaintenance();
  const sessionMaintenance = await runSessionRegistryMaintenance({ apply: Boolean(opts.apply) });
  const summary = getInspectableTaskRegistrySummary();
  const auditAfter = opts.apply ? getInspectableTaskAuditSummary() : auditBefore;
  const flowAuditAfter = opts.apply ? getInspectableTaskFlowAuditSummary() : flowAuditBefore;
  const retainedLostAfter = summarizeRetainedLostTaskAuditFindings(
    listTaskAuditFindings({ tasks: reconcileInspectableTasks() }),
  );
>>>>>>> upstream/main

  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          mode: opts.apply ? "apply" : "preview",
          maintenance: {
            tasks: taskMaintenance,
            taskFlows: flowMaintenance,
<<<<<<< HEAD
          },
          tasks: summary,
=======
            sessions: sessionMaintenance,
          },
          tasks: summary,
          diagnostics,
>>>>>>> upstream/main
          auditBefore: {
            ...auditBefore,
            taskFlows: flowAuditBefore,
          },
          auditAfter: {
            ...auditAfter,
            taskFlows: flowAuditAfter,
          },
        },
        null,
        2,
      ),
    );
    return;
  }

  runtime.log(
    info(
<<<<<<< HEAD
      `Tasks maintenance (${opts.apply ? "applied" : "preview"}): tasks ${taskMaintenance.reconciled} reconcile · ${taskMaintenance.cleanupStamped} cleanup stamp · ${taskMaintenance.pruned} prune; task-flows ${flowMaintenance.reconciled} reconcile · ${flowMaintenance.pruned} prune`,
=======
      `Tasks maintenance (${opts.apply ? "applied" : "preview"}): tasks ${taskMaintenance.reconciled} reconcile · ${taskMaintenance.recovered} recovered · ${taskMaintenance.cleanupStamped} cleanup stamp · ${taskMaintenance.pruned} prune; task-flows ${flowMaintenance.reconciled} reconcile · ${flowMaintenance.pruned} prune`,
    ),
  );
  runtime.log(
    info(
      `Session registry: ${sessionMaintenance.pruned} prune · ${sessionMaintenance.runningCronJobs} running cron jobs`,
>>>>>>> upstream/main
    ),
  );
  runtime.log(
    info(
      `${opts.apply ? "Tasks health after apply" : "Tasks health"}: ${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${auditAfter.errors + flowAuditAfter.errors} audit errors · ${auditAfter.warnings + flowAuditAfter.warnings} audit warnings`,
    ),
  );
<<<<<<< HEAD
=======
  if (retainedLostAfter.count > 0) {
    runtime.log(
      info(
        `Retained lost tasks: ${retainedLostAfter.count} retained until ${timestampMsToIsoString(retainedLostAfter.nextCleanupAfter) ?? "cleanupAfter"}; maintenance will prune after cleanupAfter.`,
      ),
    );
  }
>>>>>>> upstream/main
  if (opts.apply) {
    runtime.log(
      info(
        `Tasks health before apply: ${auditBefore.errors + flowAuditBefore.errors} audit errors · ${auditBefore.warnings + flowAuditBefore.warnings} audit warnings`,
      ),
    );
  }
  if (!opts.apply) {
    runtime.log("Dry run only. Re-run with `openclaw tasks maintenance --apply` to write changes.");
  }
}
