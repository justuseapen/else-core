<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetTaskFlowRegistryForTests } from "../../tasks/task-flow-registry.js";
import {
  resetTaskRegistryDeliveryRuntimeForTests,
  resetTaskRegistryForTests,
  setTaskRegistryDeliveryRuntimeForTests,
} from "../../tasks/task-registry.js";
import { createRuntimeTaskFlow } from "./runtime-taskflow.js";
import { createRuntimeTaskFlows, createRuntimeTaskRuns } from "./runtime-tasks.js";

const hoisted = vi.hoisted(() => {
  const sendMessageMock = vi.fn();
  const cancelSessionMock = vi.fn();
  const killSubagentRunAdminMock = vi.fn();
  return {
    sendMessageMock,
    cancelSessionMock,
    killSubagentRunAdminMock,
  };
});

vi.mock("../../acp/control-plane/manager.js", () => ({
  getAcpSessionManager: () => ({
    cancelSession: hoisted.cancelSessionMock,
  }),
}));

vi.mock("../../agents/subagent-control.js", () => ({
  killSubagentRunAdmin: (params: unknown) => hoisted.killSubagentRunAdminMock(params),
}));

afterEach(() => {
  resetTaskRegistryDeliveryRuntimeForTests();
  resetTaskRegistryForTests();
  resetTaskFlowRegistryForTests({ persist: false });
  vi.clearAllMocks();
});

describe("runtime tasks", () => {
  beforeEach(() => {
    setTaskRegistryDeliveryRuntimeForTests({
      sendMessage: hoisted.sendMessageMock,
    });
=======
// Runtime task tests cover plugin task runtime registration, invocation, and cleanup.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDetachedTaskLifecycleRuntime,
  setDetachedTaskLifecycleRuntime,
} from "../../tasks/detached-task-runtime.js";
import {
  getRuntimeTaskMocks,
  installRuntimeTaskDeliveryMock,
  resetRuntimeTaskTestState,
} from "./runtime-task-test-harness.js";
import { createRuntimeTaskFlow } from "./runtime-taskflow.js";
import { createRuntimeTaskFlows, createRuntimeTaskRuns } from "./runtime-tasks.js";

const runtimeTaskMocks = getRuntimeTaskMocks();

afterEach(() => {
  resetRuntimeTaskTestState();
});

function requireRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected a non-array record");
  }
  return value as Record<string, unknown>;
}

function requireRecordById(items: readonly unknown[], id: string): Record<string, unknown> {
  for (const item of items) {
    const record = requireRecord(item);
    if (record.id === id) {
      return record;
    }
  }
  throw new Error(`Missing record ${id}`);
}

function requireCreatedFlow<T>(flow: T | null): T {
  if (!flow) {
    throw new Error("expected managed TaskFlow creation to succeed");
  }
  return flow;
}

describe("runtime tasks", () => {
  beforeEach(() => {
    installRuntimeTaskDeliveryMock();
>>>>>>> upstream/main
  });

  it("exposes canonical task and TaskFlow DTOs without leaking raw registry fields", () => {
    const legacyTaskFlow = createRuntimeTaskFlow().bindSession({
      sessionKey: "agent:main:main",
      requesterOrigin: {
        channel: "telegram",
        to: "telegram:123",
      },
    });
    const taskFlows = createRuntimeTaskFlows().bindSession({
      sessionKey: "agent:main:main",
    });
    const taskRuns = createRuntimeTaskRuns().bindSession({
      sessionKey: "agent:main:main",
    });
    const otherTaskFlows = createRuntimeTaskFlows().bindSession({
      sessionKey: "agent:main:other",
    });
    const otherTaskRuns = createRuntimeTaskRuns().bindSession({
      sessionKey: "agent:main:other",
    });

<<<<<<< HEAD
    const created = legacyTaskFlow.createManaged({
      controllerId: "tests/runtime-tasks",
      goal: "Review inbox",
      currentStep: "triage",
      stateJson: { lane: "priority" },
    });
=======
    const created = requireCreatedFlow(
      legacyTaskFlow.createManaged({
        controllerId: "tests/runtime-tasks",
        goal: "Review inbox",
        currentStep: "triage",
        stateJson: { lane: "priority" },
      }),
    );
>>>>>>> upstream/main
    const child = legacyTaskFlow.runTask({
      flowId: created.flowId,
      runtime: "acp",
      childSessionKey: "agent:main:subagent:child",
      runId: "runtime-task-run",
      label: "Inbox triage",
      task: "Review PR 1",
      status: "running",
      startedAt: 10,
      lastEventAt: 11,
      progressSummary: "Inspecting",
    });
    if (!child.created) {
      throw new Error("expected child task creation to succeed");
    }

<<<<<<< HEAD
    expect(taskFlows.list()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: created.flowId,
          ownerKey: "agent:main:main",
          goal: "Review inbox",
          currentStep: "triage",
        }),
      ]),
    );
    expect(taskFlows.get(created.flowId)).toMatchObject({
      id: created.flowId,
      ownerKey: "agent:main:main",
      goal: "Review inbox",
      currentStep: "triage",
      state: { lane: "priority" },
      taskSummary: {
        total: 1,
        active: 1,
      },
      tasks: [
        expect.objectContaining({
          id: child.task.taskId,
          flowId: created.flowId,
          title: "Review PR 1",
          label: "Inbox triage",
          runId: "runtime-task-run",
        }),
      ],
    });
    expect(taskRuns.list()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: child.task.taskId,
          flowId: created.flowId,
          sessionKey: "agent:main:main",
          title: "Review PR 1",
          status: "running",
        }),
      ]),
    );
    expect(taskRuns.get(child.task.taskId)).toMatchObject({
      id: child.task.taskId,
      flowId: created.flowId,
      title: "Review PR 1",
      progressSummary: "Inspecting",
    });
    expect(taskRuns.findLatest()?.id).toBe(child.task.taskId);
    expect(taskRuns.resolve("runtime-task-run")?.id).toBe(child.task.taskId);
    expect(taskFlows.getTaskSummary(created.flowId)).toMatchObject({
      total: 1,
      active: 1,
    });
=======
    const listedFlow = requireRecordById(taskFlows.list(), created.flowId);
    expect(listedFlow.ownerKey).toBe("agent:main:main");
    expect(listedFlow.goal).toBe("Review inbox");
    expect(listedFlow.currentStep).toBe("triage");

    const flow = requireRecord(taskFlows.get(created.flowId));
    expect(flow.id).toBe(created.flowId);
    expect(flow.ownerKey).toBe("agent:main:main");
    expect(flow.goal).toBe("Review inbox");
    expect(flow.currentStep).toBe("triage");
    expect(flow.state).toEqual({ lane: "priority" });
    const taskSummary = requireRecord(flow.taskSummary);
    expect(taskSummary.total).toBe(1);
    expect(taskSummary.active).toBe(1);
    const flowTasks = flow.tasks;
    expect(Array.isArray(flowTasks)).toBe(true);
    const flowTask = requireRecordById(flowTasks as unknown[], child.task.taskId);
    expect(flowTask.flowId).toBe(created.flowId);
    expect(flowTask.title).toBe("Review PR 1");
    expect(flowTask.label).toBe("Inbox triage");
    expect(flowTask.runId).toBe("runtime-task-run");

    const listedRun = requireRecordById(taskRuns.list(), child.task.taskId);
    expect(listedRun.flowId).toBe(created.flowId);
    expect(listedRun.sessionKey).toBe("agent:main:main");
    expect(listedRun.title).toBe("Review PR 1");
    expect(listedRun.status).toBe("running");
    const taskRun = requireRecord(taskRuns.get(child.task.taskId));
    expect(taskRun.id).toBe(child.task.taskId);
    expect(taskRun.flowId).toBe(created.flowId);
    expect(taskRun.title).toBe("Review PR 1");
    expect(taskRun.progressSummary).toBe("Inspecting");
    expect(taskRuns.findLatest()?.id).toBe(child.task.taskId);
    expect(taskRuns.resolve("runtime-task-run")?.id).toBe(child.task.taskId);
    const summary = requireRecord(taskFlows.getTaskSummary(created.flowId));
    expect(summary.total).toBe(1);
    expect(summary.active).toBe(1);
>>>>>>> upstream/main

    expect(otherTaskFlows.get(created.flowId)).toBeUndefined();
    expect(otherTaskRuns.get(child.task.taskId)).toBeUndefined();

    const flowDetail = taskFlows.get(created.flowId);
    expect(flowDetail).not.toHaveProperty("revision");
    expect(flowDetail).not.toHaveProperty("controllerId");
    expect(flowDetail).not.toHaveProperty("syncMode");

    const taskDetail = taskRuns.get(child.task.taskId);
    expect(taskDetail).not.toHaveProperty("taskId");
    expect(taskDetail).not.toHaveProperty("requesterSessionKey");
    expect(taskDetail).not.toHaveProperty("scopeKind");
  });

  it("maps task cancellation results onto canonical task DTOs", async () => {
    const legacyTaskFlow = createRuntimeTaskFlow().bindSession({
      sessionKey: "agent:main:main",
    });
    const taskRuns = createRuntimeTaskRuns().bindSession({
      sessionKey: "agent:main:main",
    });

<<<<<<< HEAD
    const created = legacyTaskFlow.createManaged({
      controllerId: "tests/runtime-tasks",
      goal: "Cancel active task",
    });
=======
    const created = requireCreatedFlow(
      legacyTaskFlow.createManaged({
        controllerId: "tests/runtime-tasks",
        goal: "Cancel active task",
      }),
    );
>>>>>>> upstream/main
    const child = legacyTaskFlow.runTask({
      flowId: created.flowId,
      runtime: "acp",
      childSessionKey: "agent:main:subagent:child",
      runId: "runtime-task-cancel",
      task: "Cancel me",
      status: "running",
      startedAt: 20,
      lastEventAt: 21,
    });
    if (!child.created) {
      throw new Error("expected child task creation to succeed");
    }

    const result = await taskRuns.cancel({
      taskId: child.task.taskId,
      cfg: {} as never,
    });

<<<<<<< HEAD
    expect(hoisted.cancelSessionMock).toHaveBeenCalledWith({
=======
    expect(runtimeTaskMocks.cancelSessionMock).toHaveBeenCalledWith({
>>>>>>> upstream/main
      cfg: {},
      sessionKey: "agent:main:subagent:child",
      reason: "task-cancel",
    });
<<<<<<< HEAD
    expect(result).toMatchObject({
      found: true,
      cancelled: true,
      task: {
        id: child.task.taskId,
        title: "Cancel me",
        status: "cancelled",
      },
=======
    expect(result.found).toBe(true);
    expect(result.cancelled).toBe(true);
    const task = requireRecord(result.task);
    expect(task.id).toBe(child.task.taskId);
    expect(task.title).toBe("Cancel me");
    expect(task.status).toBe("cancelled");
  });

  it("routes runtime task cancellation through the detached task runtime seam", async () => {
    const legacyTaskFlow = createRuntimeTaskFlow().bindSession({
      sessionKey: "agent:main:main",
    });
    const taskRuns = createRuntimeTaskRuns().bindSession({
      sessionKey: "agent:main:main",
    });

    const created = requireCreatedFlow(
      legacyTaskFlow.createManaged({
        controllerId: "tests/runtime-tasks",
        goal: "Cancel through runtime seam",
      }),
    );
    const child = legacyTaskFlow.runTask({
      flowId: created.flowId,
      runtime: "acp",
      childSessionKey: "agent:main:subagent:child",
      runId: "runtime-task-cancel-seam",
      task: "Cancel via seam",
      status: "running",
      startedAt: 22,
      lastEventAt: 23,
    });
    if (!child.created) {
      throw new Error("expected child task creation to succeed");
    }

    const defaultRuntime = getDetachedTaskLifecycleRuntime();
    const cancelDetachedTaskRunByIdSpy = vi.fn(
      (...args: Parameters<typeof defaultRuntime.cancelDetachedTaskRunById>) =>
        defaultRuntime.cancelDetachedTaskRunById(...args),
    );
    setDetachedTaskLifecycleRuntime({
      ...defaultRuntime,
      cancelDetachedTaskRunById: cancelDetachedTaskRunByIdSpy,
    });

    await taskRuns.cancel({
      taskId: child.task.taskId,
      cfg: {} as never,
    });

    expect(cancelDetachedTaskRunByIdSpy).toHaveBeenCalledWith({
      cfg: {} as never,
      taskId: child.task.taskId,
>>>>>>> upstream/main
    });
  });

  it("does not allow cross-owner task cancellation or leak task details", async () => {
    const legacyTaskFlow = createRuntimeTaskFlow().bindSession({
      sessionKey: "agent:main:main",
    });
    const otherTaskRuns = createRuntimeTaskRuns().bindSession({
      sessionKey: "agent:main:other",
    });

<<<<<<< HEAD
    const created = legacyTaskFlow.createManaged({
      controllerId: "tests/runtime-tasks",
      goal: "Keep owner isolation",
    });
=======
    const created = requireCreatedFlow(
      legacyTaskFlow.createManaged({
        controllerId: "tests/runtime-tasks",
        goal: "Keep owner isolation",
      }),
    );
>>>>>>> upstream/main
    const child = legacyTaskFlow.runTask({
      flowId: created.flowId,
      runtime: "acp",
      childSessionKey: "agent:main:subagent:child",
      runId: "runtime-task-isolation",
      task: "Do not cancel me",
      status: "running",
      startedAt: 30,
      lastEventAt: 31,
    });
    if (!child.created) {
      throw new Error("expected child task creation to succeed");
    }

    const result = await otherTaskRuns.cancel({
      taskId: child.task.taskId,
      cfg: {} as never,
    });

<<<<<<< HEAD
    expect(hoisted.cancelSessionMock).not.toHaveBeenCalled();
=======
    expect(runtimeTaskMocks.cancelSessionMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
    expect(result).toEqual({
      found: false,
      cancelled: false,
      reason: "Task not found.",
    });
    expect(otherTaskRuns.get(child.task.taskId)).toBeUndefined();
  });
});
