<<<<<<< HEAD
import type { ExecApprovalReplyDecision } from "openclaw/plugin-sdk/approval-runtime";
=======
// Matrix plugin module implements approval reactions behavior.
import type { ExecApprovalReplyDecision } from "openclaw/plugin-sdk/approval-runtime";
import { getOptionalMatrixRuntime } from "./runtime.js";
>>>>>>> upstream/main

const MATRIX_APPROVAL_REACTION_META = {
  "allow-once": {
    emoji: "✅",
    label: "Allow once",
  },
  "allow-always": {
    emoji: "♾️",
    label: "Allow always",
  },
  deny: {
    emoji: "❌",
    label: "Deny",
  },
} satisfies Record<ExecApprovalReplyDecision, { emoji: string; label: string }>;

const MATRIX_APPROVAL_REACTION_ORDER = [
  "allow-once",
  "allow-always",
  "deny",
] as const satisfies readonly ExecApprovalReplyDecision[];

<<<<<<< HEAD
=======
const PERSISTENT_NAMESPACE = "matrix.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1000;
const DEFAULT_REACTION_TARGET_TTL_MS = 24 * 60 * 60 * 1000;

>>>>>>> upstream/main
export type MatrixApprovalReactionBinding = {
  decision: ExecApprovalReplyDecision;
  emoji: string;
  label: string;
};

<<<<<<< HEAD
export type MatrixApprovalReactionResolution = {
=======
type MatrixApprovalReactionResolution = {
>>>>>>> upstream/main
  approvalId: string;
  decision: ExecApprovalReplyDecision;
};

type MatrixApprovalReactionTarget = {
  approvalId: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
};

<<<<<<< HEAD
const matrixApprovalReactionTargets = new Map<string, MatrixApprovalReactionTarget>();
=======
type PersistedMatrixApprovalReactionTarget = {
  version: 1;
  target: MatrixApprovalReactionTarget;
};

type MatrixApprovalReactionStore = {
  register(
    key: string,
    value: PersistedMatrixApprovalReactionTarget,
    opts?: { ttlMs?: number },
  ): Promise<void>;
  lookup(key: string): Promise<PersistedMatrixApprovalReactionTarget | undefined>;
  delete(key: string): Promise<boolean>;
};

const matrixApprovalReactionTargets = new Map<string, MatrixApprovalReactionTarget>();
let persistentStore: MatrixApprovalReactionStore | undefined;
let persistentStoreDisabled = false;
>>>>>>> upstream/main

function buildReactionTargetKey(roomId: string, eventId: string): string | null {
  const normalizedRoomId = roomId.trim();
  const normalizedEventId = eventId.trim();
  if (!normalizedRoomId || !normalizedEventId) {
    return null;
  }
  return `${normalizedRoomId}:${normalizedEventId}`;
}

<<<<<<< HEAD
=======
function reportPersistentApprovalReactionError(error: unknown): void {
  try {
    getOptionalMatrixRuntime()
      ?.logging.getChildLogger({ plugin: "matrix", feature: "approval-reaction-state" })
      .warn("Matrix persistent approval reaction state failed", { error: String(error) });
  } catch {
    // Best effort only: persistent state must never break Matrix reactions.
  }
}

function disablePersistentApprovalReactionStore(error: unknown): void {
  persistentStoreDisabled = true;
  persistentStore = undefined;
  reportPersistentApprovalReactionError(error);
}

function getPersistentApprovalReactionStore(): MatrixApprovalReactionStore | undefined {
  if (persistentStoreDisabled) {
    return undefined;
  }
  if (persistentStore) {
    return persistentStore;
  }
  const runtime = getOptionalMatrixRuntime();
  if (!runtime) {
    return undefined;
  }
  try {
    persistentStore = runtime.state.openKeyedStore<PersistedMatrixApprovalReactionTarget>({
      namespace: PERSISTENT_NAMESPACE,
      maxEntries: PERSISTENT_MAX_ENTRIES,
      defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
    });
    return persistentStore;
  } catch (error) {
    disablePersistentApprovalReactionStore(error);
    return undefined;
  }
}

function readPersistedTarget(value: unknown): MatrixApprovalReactionTarget | null {
  const persisted = value as PersistedMatrixApprovalReactionTarget | undefined;
  if (
    persisted?.version !== 1 ||
    !persisted.target ||
    typeof persisted.target.approvalId !== "string" ||
    !Array.isArray(persisted.target.allowedDecisions)
  ) {
    return null;
  }
  return persisted.target;
}

function rememberPersistentApprovalReactionTarget(params: {
  key: string;
  target: MatrixApprovalReactionTarget;
  ttlMs?: number;
}): void {
  const ttlMs = params.ttlMs == null ? DEFAULT_REACTION_TARGET_TTL_MS : Math.max(1, params.ttlMs);
  const store = getPersistentApprovalReactionStore();
  if (!store) {
    return;
  }
  void store
    .register(params.key, { version: 1, target: params.target }, { ttlMs })
    .catch(disablePersistentApprovalReactionStore);
}

function forgetPersistentApprovalReactionTarget(key: string): void {
  const store = getPersistentApprovalReactionStore();
  if (!store) {
    return;
  }
  void store.delete(key).catch(disablePersistentApprovalReactionStore);
}

async function lookupPersistentApprovalReactionTarget(
  key: string,
): Promise<MatrixApprovalReactionTarget | null> {
  const store = getPersistentApprovalReactionStore();
  if (!store) {
    return null;
  }
  try {
    return readPersistedTarget(await store.lookup(key));
  } catch (error) {
    disablePersistentApprovalReactionStore(error);
    return null;
  }
}

>>>>>>> upstream/main
export function listMatrixApprovalReactionBindings(
  allowedDecisions: readonly ExecApprovalReplyDecision[],
): MatrixApprovalReactionBinding[] {
  const allowed = new Set(allowedDecisions);
  return MATRIX_APPROVAL_REACTION_ORDER.filter((decision) => allowed.has(decision)).map(
    (decision) => ({
      decision,
      emoji: MATRIX_APPROVAL_REACTION_META[decision].emoji,
      label: MATRIX_APPROVAL_REACTION_META[decision].label,
    }),
  );
}

export function buildMatrixApprovalReactionHint(
  allowedDecisions: readonly ExecApprovalReplyDecision[],
): string | null {
  const bindings = listMatrixApprovalReactionBindings(allowedDecisions);
  if (bindings.length === 0) {
    return null;
  }
  return `React here: ${bindings.map((binding) => `${binding.emoji} ${binding.label}`).join(", ")}`;
}

<<<<<<< HEAD
export function resolveMatrixApprovalReactionDecision(
=======
function resolveMatrixApprovalReactionDecision(
>>>>>>> upstream/main
  reactionKey: string,
  allowedDecisions: readonly ExecApprovalReplyDecision[],
): ExecApprovalReplyDecision | null {
  const normalizedReaction = reactionKey.trim();
  if (!normalizedReaction) {
    return null;
  }
  const allowed = new Set(allowedDecisions);
  for (const decision of MATRIX_APPROVAL_REACTION_ORDER) {
    if (!allowed.has(decision)) {
      continue;
    }
    if (MATRIX_APPROVAL_REACTION_META[decision].emoji === normalizedReaction) {
      return decision;
    }
  }
  return null;
}

export function registerMatrixApprovalReactionTarget(params: {
  roomId: string;
  eventId: string;
  approvalId: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
<<<<<<< HEAD
=======
  ttlMs?: number;
>>>>>>> upstream/main
}): void {
  const key = buildReactionTargetKey(params.roomId, params.eventId);
  const approvalId = params.approvalId.trim();
  const allowedDecisions = Array.from(
    new Set(
      params.allowedDecisions.filter(
        (decision): decision is ExecApprovalReplyDecision =>
          decision === "allow-once" || decision === "allow-always" || decision === "deny",
      ),
    ),
  );
  if (!key || !approvalId || allowedDecisions.length === 0) {
    return;
  }
<<<<<<< HEAD
  matrixApprovalReactionTargets.set(key, {
    approvalId,
    allowedDecisions,
=======
  const target = {
    approvalId,
    allowedDecisions,
  };
  matrixApprovalReactionTargets.set(key, target);
  rememberPersistentApprovalReactionTarget({
    key,
    target,
    ttlMs: params.ttlMs,
>>>>>>> upstream/main
  });
}

export function unregisterMatrixApprovalReactionTarget(params: {
  roomId: string;
  eventId: string;
}): void {
  const key = buildReactionTargetKey(params.roomId, params.eventId);
  if (!key) {
    return;
  }
  matrixApprovalReactionTargets.delete(key);
<<<<<<< HEAD
}

export function resolveMatrixApprovalReactionTarget(params: {
  roomId: string;
  eventId: string;
  reactionKey: string;
}): MatrixApprovalReactionResolution | null {
  const key = buildReactionTargetKey(params.roomId, params.eventId);
  if (!key) {
    return null;
  }
  const target = matrixApprovalReactionTargets.get(key);
=======
  forgetPersistentApprovalReactionTarget(key);
}

function resolveTarget(params: {
  target: MatrixApprovalReactionTarget | null | undefined;
  reactionKey: string;
}): MatrixApprovalReactionResolution | null {
  const target = params.target;
>>>>>>> upstream/main
  if (!target) {
    return null;
  }
  const decision = resolveMatrixApprovalReactionDecision(
    params.reactionKey,
    target.allowedDecisions,
  );
  if (!decision) {
    return null;
  }
  return {
    approvalId: target.approvalId,
    decision,
  };
}

<<<<<<< HEAD
export function clearMatrixApprovalReactionTargetsForTest(): void {
  matrixApprovalReactionTargets.clear();
=======
export function resolveMatrixApprovalReactionTarget(params: {
  roomId: string;
  eventId: string;
  reactionKey: string;
}): MatrixApprovalReactionResolution | null {
  const key = buildReactionTargetKey(params.roomId, params.eventId);
  if (!key) {
    return null;
  }
  return resolveTarget({
    target: matrixApprovalReactionTargets.get(key),
    reactionKey: params.reactionKey,
  });
}

export async function resolveMatrixApprovalReactionTargetWithPersistence(params: {
  roomId: string;
  eventId: string;
  reactionKey: string;
}): Promise<MatrixApprovalReactionResolution | null> {
  const key = buildReactionTargetKey(params.roomId, params.eventId);
  if (!key) {
    return null;
  }
  const inMemory = resolveTarget({
    target: matrixApprovalReactionTargets.get(key),
    reactionKey: params.reactionKey,
  });
  if (inMemory) {
    return inMemory;
  }
  return resolveTarget({
    target: await lookupPersistentApprovalReactionTarget(key),
    reactionKey: params.reactionKey,
  });
}

export function clearMatrixApprovalReactionTargetsForTest(): void {
  matrixApprovalReactionTargets.clear();
  persistentStore = undefined;
  persistentStoreDisabled = false;
>>>>>>> upstream/main
}
