<<<<<<< HEAD
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import type { DatabaseSync, StatementSync } from "node:sqlite";
import { requireNodeSqlite } from "../infra/node-sqlite.js";
import type { DeliveryContext } from "../utils/delivery-context.js";
import { resolveTaskRegistryDir, resolveTaskRegistrySqlitePath } from "./task-registry.paths.js";
import type { TaskRegistryStoreSnapshot } from "./task-registry.store.js";
import type { TaskDeliveryState, TaskRecord } from "./task-registry.types.js";

type TaskRegistryRow = {
  task_id: string;
  runtime: TaskRecord["runtime"];
  source_id: string | null;
  owner_key: string;
  scope_kind: TaskRecord["scopeKind"];
  child_session_key: string | null;
  parent_flow_id: string | null;
  parent_task_id: string | null;
  agent_id: string | null;
  run_id: string | null;
  label: string | null;
  task: string;
  status: TaskRecord["status"];
  delivery_status: TaskRecord["deliveryStatus"];
  notify_policy: TaskRecord["notifyPolicy"];
  created_at: number | bigint;
  started_at: number | bigint | null;
  ended_at: number | bigint | null;
  last_event_at: number | bigint | null;
  cleanup_after: number | bigint | null;
  error: string | null;
  progress_summary: string | null;
  terminal_summary: string | null;
  terminal_outcome: TaskRecord["terminalOutcome"] | null;
};

type TaskDeliveryStateRow = {
  task_id: string;
  requester_origin_json: string | null;
  last_notified_event_at: number | bigint | null;
};

type TableInfoRow = {
  name: string;
};

type TaskRegistryStatements = {
  legacyRequesterSessionColumn: boolean;
  selectAll: StatementSync;
  selectAllDeliveryStates: StatementSync;
  upsertRow: StatementSync;
  replaceDeliveryState: StatementSync;
  deleteRow: StatementSync;
  deleteDeliveryState: StatementSync;
  clearRows: StatementSync;
  clearDeliveryStates: StatementSync;
};
=======
// Persists task registry records and events through the OpenClaw SQLite state database.
import type { DatabaseSync } from "node:sqlite";
import type { Insertable, Selectable } from "kysely";
import { executeSqliteQuerySync, getNodeSqliteKysely } from "../infra/kysely-sync.js";
import type { DB as OpenClawStateKyselyDatabase } from "../state/openclaw-state-db.generated.js";
import {
  closeOpenClawStateDatabase,
  openOpenClawStateDatabase,
  runOpenClawStateWriteTransaction,
} from "../state/openclaw-state-db.js";
import { parseDeliveryContextJson } from "./task-registry.sqlite.shared.js";
import type { TaskRegistryStoreSnapshot } from "./task-registry.store.types.js";
import {
  parseOptionalTaskTerminalOutcome,
  parseTaskDeliveryStatus,
  parseTaskNotifyPolicy,
  parseTaskRuntime,
  parseTaskScopeKind,
  parseTaskStatus,
  type TaskDeliveryState,
  type TaskRecord,
} from "./task-registry.types.js";

type TaskRunsTable = OpenClawStateKyselyDatabase["task_runs"];
type TaskDeliveryStateTable = OpenClawStateKyselyDatabase["task_delivery_state"];
type TaskRegistryStoreDatabase = Pick<
  OpenClawStateKyselyDatabase,
  "task_delivery_state" | "task_runs"
>;

type TaskRegistryRow = Selectable<TaskRunsTable> & {
  runtime: string;
  scope_kind: string;
  status: string;
  delivery_status: string;
  notify_policy: string;
  terminal_outcome: string | null;
};

type TaskDeliveryStateRow = Selectable<TaskDeliveryStateTable>;
>>>>>>> upstream/main

type TaskRegistryDatabase = {
  db: DatabaseSync;
  path: string;
<<<<<<< HEAD
  statements: TaskRegistryStatements;
};

let cachedDatabase: TaskRegistryDatabase | null = null;
const TASK_REGISTRY_DIR_MODE = 0o700;
const TASK_REGISTRY_FILE_MODE = 0o600;
const TASK_REGISTRY_SIDECAR_SUFFIXES = ["", "-shm", "-wal"] as const;
=======
};

// SQLite-backed task store mirrors task records and delivery state into openclaw-state.db.
const TASK_RUN_SELECT_COLUMNS = [
  "task_id",
  "runtime",
  "task_kind",
  "source_id",
  "requester_session_key",
  "owner_key",
  "scope_kind",
  "child_session_key",
  "parent_flow_id",
  "parent_task_id",
  "agent_id",
  "run_id",
  "label",
  "task",
  "status",
  "delivery_status",
  "notify_policy",
  "created_at",
  "started_at",
  "ended_at",
  "last_event_at",
  "cleanup_after",
  "error",
  "progress_summary",
  "terminal_summary",
  "terminal_outcome",
] as const;

let cachedDatabase: TaskRegistryDatabase | null = null;
>>>>>>> upstream/main

function normalizeNumber(value: number | bigint | null): number | undefined {
  if (typeof value === "bigint") {
    return Number(value);
  }
  return typeof value === "number" ? value : undefined;
}

function serializeJson(value: unknown): string | null {
  return value == null ? null : JSON.stringify(value);
}

<<<<<<< HEAD
function parseJsonValue<T>(raw: string | null): T | undefined {
  if (!raw?.trim()) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

=======
>>>>>>> upstream/main
function rowToTaskRecord(row: TaskRegistryRow): TaskRecord {
  const startedAt = normalizeNumber(row.started_at);
  const endedAt = normalizeNumber(row.ended_at);
  const lastEventAt = normalizeNumber(row.last_event_at);
  const cleanupAfter = normalizeNumber(row.cleanup_after);
<<<<<<< HEAD
  return {
    taskId: row.task_id,
    runtime: row.runtime,
    ...(row.source_id ? { sourceId: row.source_id } : {}),
    requesterSessionKey: row.scope_kind === "system" ? "" : row.owner_key,
    ownerKey: row.owner_key,
    scopeKind: row.scope_kind,
=======
  const scopeKind = parseTaskScopeKind(row.scope_kind);
  const terminalOutcome = parseOptionalTaskTerminalOutcome(row.terminal_outcome);
  // System tasks intentionally have no requester session; ownerKey is the lookup anchor.
  const requesterSessionKey =
    scopeKind === "system" ? "" : row.requester_session_key?.trim() || row.owner_key;
  return {
    taskId: row.task_id,
    runtime: parseTaskRuntime(row.runtime),
    ...(row.task_kind ? { taskKind: row.task_kind } : {}),
    ...(row.source_id ? { sourceId: row.source_id } : {}),
    requesterSessionKey,
    ownerKey: row.owner_key,
    scopeKind,
>>>>>>> upstream/main
    ...(row.child_session_key ? { childSessionKey: row.child_session_key } : {}),
    ...(row.parent_flow_id ? { parentFlowId: row.parent_flow_id } : {}),
    ...(row.parent_task_id ? { parentTaskId: row.parent_task_id } : {}),
    ...(row.agent_id ? { agentId: row.agent_id } : {}),
    ...(row.run_id ? { runId: row.run_id } : {}),
    ...(row.label ? { label: row.label } : {}),
    task: row.task,
<<<<<<< HEAD
    status: row.status,
    deliveryStatus: row.delivery_status,
    notifyPolicy: row.notify_policy,
=======
    status: parseTaskStatus(row.status),
    deliveryStatus: parseTaskDeliveryStatus(row.delivery_status),
    notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
>>>>>>> upstream/main
    createdAt: normalizeNumber(row.created_at) ?? 0,
    ...(startedAt != null ? { startedAt } : {}),
    ...(endedAt != null ? { endedAt } : {}),
    ...(lastEventAt != null ? { lastEventAt } : {}),
    ...(cleanupAfter != null ? { cleanupAfter } : {}),
    ...(row.error ? { error: row.error } : {}),
    ...(row.progress_summary ? { progressSummary: row.progress_summary } : {}),
    ...(row.terminal_summary ? { terminalSummary: row.terminal_summary } : {}),
<<<<<<< HEAD
    ...(row.terminal_outcome ? { terminalOutcome: row.terminal_outcome } : {}),
=======
    ...(terminalOutcome ? { terminalOutcome } : {}),
>>>>>>> upstream/main
  };
}

function rowToTaskDeliveryState(row: TaskDeliveryStateRow): TaskDeliveryState {
<<<<<<< HEAD
  const requesterOrigin = parseJsonValue<DeliveryContext>(row.requester_origin_json);
=======
  const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
>>>>>>> upstream/main
  const lastNotifiedEventAt = normalizeNumber(row.last_notified_event_at);
  return {
    taskId: row.task_id,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    ...(lastNotifiedEventAt != null ? { lastNotifiedEventAt } : {}),
  };
}

<<<<<<< HEAD
function bindTaskRecordBase(record: TaskRecord) {
  return {
    task_id: record.taskId,
    runtime: record.runtime,
    source_id: record.sourceId ?? null,
=======
function bindTaskRecordBase(record: TaskRecord): Insertable<TaskRunsTable> {
  return {
    task_id: record.taskId,
    runtime: record.runtime,
    task_kind: record.taskKind ?? null,
    source_id: record.sourceId ?? null,
    requester_session_key: record.scopeKind === "system" ? "" : record.requesterSessionKey,
>>>>>>> upstream/main
    owner_key: record.ownerKey,
    scope_kind: record.scopeKind,
    child_session_key: record.childSessionKey ?? null,
    parent_flow_id: record.parentFlowId ?? null,
    parent_task_id: record.parentTaskId ?? null,
    agent_id: record.agentId ?? null,
    run_id: record.runId ?? null,
    label: record.label ?? null,
    task: record.task,
    status: record.status,
    delivery_status: record.deliveryStatus,
    notify_policy: record.notifyPolicy,
    created_at: record.createdAt,
    started_at: record.startedAt ?? null,
    ended_at: record.endedAt ?? null,
    last_event_at: record.lastEventAt ?? null,
    cleanup_after: record.cleanupAfter ?? null,
    error: record.error ?? null,
    progress_summary: record.progressSummary ?? null,
    terminal_summary: record.terminalSummary ?? null,
    terminal_outcome: record.terminalOutcome ?? null,
  };
}

<<<<<<< HEAD
function bindTaskRecord(record: TaskRecord, legacyRequesterSessionColumn: boolean) {
  if (!legacyRequesterSessionColumn) {
    return bindTaskRecordBase(record);
  }
  return {
    ...bindTaskRecordBase(record),
    requester_session_key: record.scopeKind === "system" ? "" : record.requesterSessionKey,
  };
}

function bindTaskDeliveryState(state: TaskDeliveryState) {
=======
function bindTaskDeliveryState(state: TaskDeliveryState): Insertable<TaskDeliveryStateTable> {
>>>>>>> upstream/main
  return {
    task_id: state.taskId,
    requester_origin_json: serializeJson(state.requesterOrigin),
    last_notified_event_at: state.lastNotifiedEventAt ?? null,
  };
}

<<<<<<< HEAD
function createStatements(db: DatabaseSync): TaskRegistryStatements {
  const legacyRequesterSessionColumn = hasTaskRunsColumn(db, "requester_session_key");
  const upsertLegacyRequesterColumns = legacyRequesterSessionColumn
    ? `
        requester_session_key,
`
    : "";
  const upsertLegacyRequesterValues = legacyRequesterSessionColumn
    ? `
        @requester_session_key,
`
    : "";
  return {
    legacyRequesterSessionColumn,
    selectAll: db.prepare(`
      SELECT
        task_id,
        runtime,
        source_id,
        owner_key,
        scope_kind,
        child_session_key,
        parent_flow_id,
        parent_task_id,
        agent_id,
        run_id,
        label,
        task,
        status,
        delivery_status,
        notify_policy,
        created_at,
        started_at,
        ended_at,
        last_event_at,
        cleanup_after,
        error,
        progress_summary,
        terminal_summary,
        terminal_outcome
      FROM task_runs
      ORDER BY created_at ASC, task_id ASC
    `),
    selectAllDeliveryStates: db.prepare(`
      SELECT
        task_id,
        requester_origin_json,
        last_notified_event_at
      FROM task_delivery_state
      ORDER BY task_id ASC
    `),
    upsertRow: db.prepare(`
      INSERT INTO task_runs (
        task_id,
        runtime,
        source_id,
${upsertLegacyRequesterColumns}        owner_key,
        scope_kind,
        child_session_key,
        parent_flow_id,
        parent_task_id,
        agent_id,
        run_id,
        label,
        task,
        status,
        delivery_status,
        notify_policy,
        created_at,
        started_at,
        ended_at,
        last_event_at,
        cleanup_after,
        error,
        progress_summary,
        terminal_summary,
        terminal_outcome
      ) VALUES (
        @task_id,
        @runtime,
        @source_id,
${upsertLegacyRequesterValues}        @owner_key,
        @scope_kind,
        @child_session_key,
        @parent_flow_id,
        @parent_task_id,
        @agent_id,
        @run_id,
        @label,
        @task,
        @status,
        @delivery_status,
        @notify_policy,
        @created_at,
        @started_at,
        @ended_at,
        @last_event_at,
        @cleanup_after,
        @error,
        @progress_summary,
        @terminal_summary,
        @terminal_outcome
      )
      ON CONFLICT(task_id) DO UPDATE SET
        runtime = excluded.runtime,
        source_id = excluded.source_id,
        owner_key = excluded.owner_key,
        scope_kind = excluded.scope_kind,
        child_session_key = excluded.child_session_key,
        parent_flow_id = excluded.parent_flow_id,
        parent_task_id = excluded.parent_task_id,
        agent_id = excluded.agent_id,
        run_id = excluded.run_id,
        label = excluded.label,
        task = excluded.task,
        status = excluded.status,
        delivery_status = excluded.delivery_status,
        notify_policy = excluded.notify_policy,
        created_at = excluded.created_at,
        started_at = excluded.started_at,
        ended_at = excluded.ended_at,
        last_event_at = excluded.last_event_at,
        cleanup_after = excluded.cleanup_after,
        error = excluded.error,
        progress_summary = excluded.progress_summary,
        terminal_summary = excluded.terminal_summary,
        terminal_outcome = excluded.terminal_outcome
    `),
    replaceDeliveryState: db.prepare(`
      INSERT OR REPLACE INTO task_delivery_state (
        task_id,
        requester_origin_json,
        last_notified_event_at
      ) VALUES (
        @task_id,
        @requester_origin_json,
        @last_notified_event_at
      )
    `),
    deleteRow: db.prepare(`DELETE FROM task_runs WHERE task_id = ?`),
    deleteDeliveryState: db.prepare(`DELETE FROM task_delivery_state WHERE task_id = ?`),
    clearRows: db.prepare(`DELETE FROM task_runs`),
    clearDeliveryStates: db.prepare(`DELETE FROM task_delivery_state`),
  };
}

function hasTaskRunsColumn(db: DatabaseSync, columnName: string): boolean {
  const rows = db.prepare(`PRAGMA table_info(task_runs)`).all() as TableInfoRow[];
  return rows.some((row) => row.name === columnName);
}

function migrateLegacyOwnerColumns(db: DatabaseSync) {
  if (!hasTaskRunsColumn(db, "owner_key")) {
    db.exec(`ALTER TABLE task_runs ADD COLUMN owner_key TEXT;`);
  }
  if (!hasTaskRunsColumn(db, "scope_kind")) {
    db.exec(`ALTER TABLE task_runs ADD COLUMN scope_kind TEXT NOT NULL DEFAULT 'session';`);
  }
  if (hasTaskRunsColumn(db, "requester_session_key")) {
    db.exec(`
      UPDATE task_runs
      SET owner_key = requester_session_key
      WHERE owner_key IS NULL
    `);
  }
  db.exec(`
    UPDATE task_runs
    SET owner_key = CASE
      WHEN trim(COALESCE(owner_key, '')) <> '' THEN trim(owner_key)
      ELSE 'system:' || runtime || ':' || COALESCE(NULLIF(source_id, ''), task_id)
    END
  `);
  db.exec(`
    UPDATE task_runs
    SET scope_kind = CASE
      WHEN scope_kind = 'system' THEN 'system'
      WHEN owner_key LIKE 'system:%' THEN 'system'
      ELSE 'session'
    END
  `);
}

function ensureSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_runs (
      task_id TEXT PRIMARY KEY,
      runtime TEXT NOT NULL,
      source_id TEXT,
      owner_key TEXT NOT NULL,
      scope_kind TEXT NOT NULL,
      child_session_key TEXT,
      parent_flow_id TEXT,
      parent_task_id TEXT,
      agent_id TEXT,
      run_id TEXT,
      label TEXT,
      task TEXT NOT NULL,
      status TEXT NOT NULL,
      delivery_status TEXT NOT NULL,
      notify_policy TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      started_at INTEGER,
      ended_at INTEGER,
      last_event_at INTEGER,
      cleanup_after INTEGER,
      error TEXT,
      progress_summary TEXT,
      terminal_summary TEXT,
      terminal_outcome TEXT
    );
  `);
  migrateLegacyOwnerColumns(db);
  if (!hasTaskRunsColumn(db, "parent_flow_id")) {
    db.exec(`ALTER TABLE task_runs ADD COLUMN parent_flow_id TEXT;`);
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_delivery_state (
      task_id TEXT PRIMARY KEY,
      requester_origin_json TEXT,
      last_notified_event_at INTEGER
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);`,
  );
}

function ensureTaskRegistryPermissions(pathname: string) {
  const dir = resolveTaskRegistryDir(process.env);
  mkdirSync(dir, { recursive: true, mode: TASK_REGISTRY_DIR_MODE });
  chmodSync(dir, TASK_REGISTRY_DIR_MODE);
  for (const suffix of TASK_REGISTRY_SIDECAR_SUFFIXES) {
    const candidate = `${pathname}${suffix}`;
    if (!existsSync(candidate)) {
      continue;
    }
    chmodSync(candidate, TASK_REGISTRY_FILE_MODE);
  }
}

function openTaskRegistryDatabase(): TaskRegistryDatabase {
  const pathname = resolveTaskRegistrySqlitePath(process.env);
  if (cachedDatabase && cachedDatabase.path === pathname) {
    return cachedDatabase;
  }
  if (cachedDatabase) {
    cachedDatabase.db.close();
    cachedDatabase = null;
  }
  ensureTaskRegistryPermissions(pathname);
  const { DatabaseSync } = requireNodeSqlite();
  const db = new DatabaseSync(pathname);
  db.exec(`PRAGMA journal_mode = WAL;`);
  db.exec(`PRAGMA synchronous = NORMAL;`);
  db.exec(`PRAGMA busy_timeout = 5000;`);
  ensureSchema(db);
  ensureTaskRegistryPermissions(pathname);
  cachedDatabase = {
    db,
    path: pathname,
    statements: createStatements(db),
=======
function getTaskRegistryKysely(db: DatabaseSync) {
  return getNodeSqliteKysely<TaskRegistryStoreDatabase>(db);
}

function pruneRowsNotInSnapshot(params: {
  db: DatabaseSync;
  tableName: "task_delivery_state" | "task_runs";
  columnName: "task_id";
  tempTableName: string;
  ids: readonly string[];
}) {
  params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${params.tempTableName} (id TEXT PRIMARY KEY)`);
  params.db.exec(`DELETE FROM ${params.tempTableName}`);
  const insert = params.db.prepare(`INSERT OR IGNORE INTO ${params.tempTableName} (id) VALUES (?)`);
  for (const id of params.ids) {
    insert.run(id);
  }
  params.db.exec(`
    DELETE FROM ${params.tableName}
    WHERE NOT EXISTS (
      SELECT 1 FROM ${params.tempTableName}
      WHERE ${params.tempTableName}.id = ${params.tableName}.${params.columnName}
    )
  `);
  params.db.exec(`DELETE FROM ${params.tempTableName}`);
}

function selectTaskRows(db: DatabaseSync): TaskRegistryRow[] {
  const query = getTaskRegistryKysely(db)
    .selectFrom("task_runs")
    .select(TASK_RUN_SELECT_COLUMNS)
    .orderBy("created_at", "asc")
    .orderBy("task_id", "asc");
  return executeSqliteQuerySync(db, query).rows;
}

function selectTaskDeliveryStateRows(db: DatabaseSync): TaskDeliveryStateRow[] {
  const query = getTaskRegistryKysely(db)
    .selectFrom("task_delivery_state")
    .select(["task_id", "requester_origin_json", "last_notified_event_at"])
    .orderBy("task_id", "asc");
  return executeSqliteQuerySync(db, query).rows;
}

function upsertTaskRow(db: DatabaseSync, row: Insertable<TaskRunsTable>): void {
  executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .insertInto("task_runs")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("task_id").doUpdateSet({
          runtime: (eb) => eb.ref("excluded.runtime"),
          task_kind: (eb) => eb.ref("excluded.task_kind"),
          source_id: (eb) => eb.ref("excluded.source_id"),
          requester_session_key: (eb) => eb.ref("excluded.requester_session_key"),
          owner_key: (eb) => eb.ref("excluded.owner_key"),
          scope_kind: (eb) => eb.ref("excluded.scope_kind"),
          child_session_key: (eb) => eb.ref("excluded.child_session_key"),
          parent_flow_id: (eb) => eb.ref("excluded.parent_flow_id"),
          parent_task_id: (eb) => eb.ref("excluded.parent_task_id"),
          agent_id: (eb) => eb.ref("excluded.agent_id"),
          run_id: (eb) => eb.ref("excluded.run_id"),
          label: (eb) => eb.ref("excluded.label"),
          task: (eb) => eb.ref("excluded.task"),
          status: (eb) => eb.ref("excluded.status"),
          delivery_status: (eb) => eb.ref("excluded.delivery_status"),
          notify_policy: (eb) => eb.ref("excluded.notify_policy"),
          created_at: (eb) => eb.ref("excluded.created_at"),
          started_at: (eb) => eb.ref("excluded.started_at"),
          ended_at: (eb) => eb.ref("excluded.ended_at"),
          last_event_at: (eb) => eb.ref("excluded.last_event_at"),
          cleanup_after: (eb) => eb.ref("excluded.cleanup_after"),
          error: (eb) => eb.ref("excluded.error"),
          progress_summary: (eb) => eb.ref("excluded.progress_summary"),
          terminal_summary: (eb) => eb.ref("excluded.terminal_summary"),
          terminal_outcome: (eb) => eb.ref("excluded.terminal_outcome"),
        }),
      ),
  );
}

function replaceTaskDeliveryStateRow(
  db: DatabaseSync,
  row: Insertable<TaskDeliveryStateTable>,
): void {
  executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .insertInto("task_delivery_state")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("task_id").doUpdateSet({
          requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
          last_notified_event_at: (eb) => eb.ref("excluded.last_notified_event_at"),
        }),
      ),
  );
}

function deleteTaskRowsWithDeliveryState(db: DatabaseSync, taskId: string): void {
  const kysely = getTaskRegistryKysely(db);
  executeSqliteQuerySync(
    db,
    kysely.deleteFrom("task_delivery_state").where("task_id", "=", taskId),
  );
  executeSqliteQuerySync(db, kysely.deleteFrom("task_runs").where("task_id", "=", taskId));
}

function openTaskRegistryDatabase(): TaskRegistryDatabase {
  const database = openOpenClawStateDatabase();
  const pathname = database.path;
  if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) {
    return cachedDatabase;
  }
  if (cachedDatabase && !cachedDatabase.db.isOpen) {
    cachedDatabase = null;
  }
  cachedDatabase = {
    db: database.db,
    path: pathname,
>>>>>>> upstream/main
  };
  return cachedDatabase;
}

<<<<<<< HEAD
function withWriteTransaction(write: (statements: TaskRegistryStatements) => void) {
  const { db, path, statements } = openTaskRegistryDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    write(statements);
    db.exec("COMMIT");
    ensureTaskRegistryPermissions(path);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function loadTaskRegistryStateFromSqlite(): TaskRegistryStoreSnapshot {
  const { statements } = openTaskRegistryDatabase();
  const taskRows = statements.selectAll.all() as TaskRegistryRow[];
  const deliveryRows = statements.selectAllDeliveryStates.all() as TaskDeliveryStateRow[];
=======
function withWriteTransaction(write: (database: TaskRegistryDatabase) => void) {
  const database = openTaskRegistryDatabase();
  runOpenClawStateWriteTransaction(() => {
    write(database);
  });
}

export function loadTaskRegistryStateFromSqlite(): TaskRegistryStoreSnapshot {
  const { db } = openTaskRegistryDatabase();
  const taskRows = selectTaskRows(db);
  const deliveryRows = selectTaskDeliveryStateRows(db);
>>>>>>> upstream/main
  return {
    tasks: new Map(taskRows.map((row) => [row.task_id, rowToTaskRecord(row)])),
    deliveryStates: new Map(deliveryRows.map((row) => [row.task_id, rowToTaskDeliveryState(row)])),
  };
}

<<<<<<< HEAD
export function saveTaskRegistryStateToSqlite(snapshot: TaskRegistryStoreSnapshot) {
  withWriteTransaction((statements) => {
    statements.clearDeliveryStates.run();
    statements.clearRows.run();
    for (const task of snapshot.tasks.values()) {
      statements.upsertRow.run(bindTaskRecord(task, statements.legacyRequesterSessionColumn));
    }
    for (const state of snapshot.deliveryStates.values()) {
      statements.replaceDeliveryState.run(bindTaskDeliveryState(state));
=======
export function listTaskRegistryRecordsByOwnerKeyFromSqlite(ownerKey: string): TaskRecord[] {
  const key = ownerKey.trim();
  if (!key) {
    return [];
  }
  const { db } = openTaskRegistryDatabase();
  const query = getTaskRegistryKysely(db)
    .selectFrom("task_runs")
    .select(TASK_RUN_SELECT_COLUMNS)
    .where("owner_key", "=", key)
    .orderBy("created_at", "asc")
    .orderBy("task_id", "asc");
  const rows = executeSqliteQuerySync(db, query).rows;
  return rows.map(rowToTaskRecord);
}

export function saveTaskRegistryStateToSqlite(snapshot: TaskRegistryStoreSnapshot) {
  withWriteTransaction(({ db }) => {
    const kysely = getTaskRegistryKysely(db);
    const taskIds = [...snapshot.tasks.keys()];
    if (taskIds.length === 0) {
      executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
      executeSqliteQuerySync(db, kysely.deleteFrom("task_runs"));
      return;
    }
    pruneRowsNotInSnapshot({
      db,
      tableName: "task_runs",
      columnName: "task_id",
      tempTableName: "openclaw_live_task_run_ids",
      ids: taskIds,
    });
    const deliveryTaskIds = [...snapshot.deliveryStates.keys()];
    if (deliveryTaskIds.length === 0) {
      executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
    } else {
      pruneRowsNotInSnapshot({
        db,
        tableName: "task_delivery_state",
        columnName: "task_id",
        tempTableName: "openclaw_live_task_delivery_ids",
        ids: deliveryTaskIds,
      });
    }
    for (const task of snapshot.tasks.values()) {
      upsertTaskRow(db, bindTaskRecordBase(task));
    }
    for (const state of snapshot.deliveryStates.values()) {
      replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
>>>>>>> upstream/main
    }
  });
}

export function upsertTaskRegistryRecordToSqlite(task: TaskRecord) {
<<<<<<< HEAD
  const store = openTaskRegistryDatabase();
  store.statements.upsertRow.run(
    bindTaskRecord(task, store.statements.legacyRequesterSessionColumn),
  );
=======
  withWriteTransaction(({ db }) => {
    upsertTaskRow(db, bindTaskRecordBase(task));
  });
>>>>>>> upstream/main
}

export function upsertTaskWithDeliveryStateToSqlite(params: {
  task: TaskRecord;
  deliveryState?: TaskDeliveryState;
}) {
<<<<<<< HEAD
  withWriteTransaction((statements) => {
    statements.upsertRow.run(bindTaskRecord(params.task, statements.legacyRequesterSessionColumn));
    if (params.deliveryState) {
      statements.replaceDeliveryState.run(bindTaskDeliveryState(params.deliveryState));
    } else {
      statements.deleteDeliveryState.run(params.task.taskId);
=======
  withWriteTransaction(({ db }) => {
    upsertTaskRow(db, bindTaskRecordBase(params.task));
    if (params.deliveryState) {
      replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(params.deliveryState));
    } else {
      executeSqliteQuerySync(
        db,
        getTaskRegistryKysely(db)
          .deleteFrom("task_delivery_state")
          .where("task_id", "=", params.task.taskId),
      );
>>>>>>> upstream/main
    }
  });
}

export function deleteTaskRegistryRecordFromSqlite(taskId: string) {
<<<<<<< HEAD
  const store = openTaskRegistryDatabase();
  store.statements.deleteRow.run(taskId);
  store.statements.deleteDeliveryState.run(taskId);
}

export function deleteTaskAndDeliveryStateFromSqlite(taskId: string) {
  withWriteTransaction((statements) => {
    statements.deleteRow.run(taskId);
    statements.deleteDeliveryState.run(taskId);
=======
  withWriteTransaction(({ db }) => {
    deleteTaskRowsWithDeliveryState(db, taskId);
  });
}

export function deleteTaskAndDeliveryStateFromSqlite(taskId: string) {
  withWriteTransaction(({ db }) => {
    deleteTaskRowsWithDeliveryState(db, taskId);
>>>>>>> upstream/main
  });
}

export function upsertTaskDeliveryStateToSqlite(state: TaskDeliveryState) {
<<<<<<< HEAD
  const store = openTaskRegistryDatabase();
  store.statements.replaceDeliveryState.run(bindTaskDeliveryState(state));
}

export function deleteTaskDeliveryStateFromSqlite(taskId: string) {
  const store = openTaskRegistryDatabase();
  store.statements.deleteDeliveryState.run(taskId);
}

export function closeTaskRegistrySqliteStore() {
  if (!cachedDatabase) {
    return;
  }
  cachedDatabase.db.close();
  cachedDatabase = null;
=======
  withWriteTransaction(({ db }) => {
    replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
  });
}

export function deleteTaskDeliveryStateFromSqlite(taskId: string) {
  withWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getTaskRegistryKysely(db).deleteFrom("task_delivery_state").where("task_id", "=", taskId),
    );
  });
}

export function closeTaskRegistryDatabase() {
  cachedDatabase = null;
  closeOpenClawStateDatabase();
>>>>>>> upstream/main
}
