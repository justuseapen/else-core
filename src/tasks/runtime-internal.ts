<<<<<<< HEAD
=======
// Internal task registry facade used by runtime modules without exposing public SDK surface.
>>>>>>> upstream/main
export {
  cancelTaskById,
  createTaskRecord,
  deleteTaskRecordById,
  ensureTaskRegistryReady,
<<<<<<< HEAD
  findLatestTaskForOwnerKey,
  findLatestTaskForFlowId,
  findLatestTaskForRelatedSessionKey,
  findTaskByRunId,
  getTaskById,
  getTaskRegistrySnapshot,
  getTaskRegistrySummary,
  listTaskRecords,
  listTasksForFlowId,
  listTasksForOwnerKey,
  listTasksForRelatedSessionKey,
=======
  resetTaskRegistryControlRuntimeForTests,
  findLatestTaskForFlowId,
  finalizeTaskRunByRunId,
  getTaskById,
  hasActiveTaskForChildSessionKey,
  listFreshTasksForOwnerKey,
  listTaskRecords,
  listTasksForFlowId,
  listTasksForOwnerKey,
>>>>>>> upstream/main
  linkTaskToFlowById,
  markTaskLostById,
  markTaskRunningByRunId,
  markTaskTerminalById,
<<<<<<< HEAD
  markTaskTerminalByRunId,
  maybeDeliverTaskTerminalUpdate,
  recordTaskProgressByRunId,
  resolveTaskForLookupToken,
  resetTaskRegistryForTests,
  isParentFlowLinkError,
  setTaskCleanupAfterById,
  setTaskProgressById,
  setTaskRunDeliveryStatusByRunId,
  setTaskTimingById,
  updateTaskNotifyPolicyById,
} from "./task-registry.js";
=======
  maybeDeliverTaskTerminalUpdate,
  recordTaskProgressByRunId,
  reloadTaskRegistryFromStore,
  resetTaskRegistryDeliveryRuntimeForTests,
  resolveTaskForLookupToken,
  resetTaskRegistryForTests,
  isParentFlowLinkError,
  setTaskRegistryControlRuntimeForTests,
  setTaskRegistryDeliveryRuntimeForTests,
  setTaskCleanupAfterById,
  setTaskRunDeliveryStatusByRunId,
  updateTaskNotifyPolicyById,
} from "./task-registry.js";
export type { TaskRecord } from "./task-registry.types.js";
>>>>>>> upstream/main
