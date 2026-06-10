<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VIDEO_GENERATION_TASK_KIND } from "../video-generation-task-status.js";
import {
  createVideoGenerationTaskRun,
  recordVideoGenerationTaskProgress,
  wakeVideoGenerationTaskCompletion,
} from "./video-generate-background.js";

const taskExecutorMocks = vi.hoisted(() => ({
  createRunningTaskRun: vi.fn(),
  recordTaskRunProgressByRunId: vi.fn(),
  completeTaskRunByRunId: vi.fn(),
  failTaskRunByRunId: vi.fn(),
}));

const announceDeliveryMocks = vi.hoisted(() => ({
  deliverSubagentAnnouncement: vi.fn(),
}));
const taskDeliveryRuntimeMocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock("../../tasks/task-executor.js", () => taskExecutorMocks);
vi.mock("../../tasks/task-registry-delivery-runtime.js", () => taskDeliveryRuntimeMocks);
vi.mock("../subagent-announce-delivery.js", () => announceDeliveryMocks);

describe("video generate background helpers", () => {
  beforeEach(() => {
    taskExecutorMocks.createRunningTaskRun.mockReset();
    taskExecutorMocks.recordTaskRunProgressByRunId.mockReset();
    taskDeliveryRuntimeMocks.sendMessage.mockReset();
    announceDeliveryMocks.deliverSubagentAnnouncement.mockReset();
=======
// Video generation background tests cover detached task lifecycle, keepalive
// progress, completion announcement, and direct failure delivery.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAgentRunContext, resetAgentRunContextForTest } from "../../infra/agent-events.js";
import { VIDEO_GENERATION_TASK_KIND } from "../video-generation-task-status.js";
import {
  announceDeliveryMocks,
  createMediaCompletionFixture,
  expectFallbackMediaAnnouncement,
  expectQueuedTaskRun,
  expectRecordedTaskProgress,
  resetMediaBackgroundMocks,
  taskDeliveryRuntimeMocks,
  taskExecutorMocks,
} from "./media-generate-background.test-support.js";

vi.mock("../../tasks/detached-task-runtime.js", () => taskExecutorMocks);
vi.mock("../../tasks/task-registry-delivery-runtime.js", () => taskDeliveryRuntimeMocks);
vi.mock("../subagent-announce-delivery.js", () => announceDeliveryMocks);

const {
  createVideoGenerationTaskRun,
  failVideoGenerationTaskRun,
  recordVideoGenerationTaskProgress,
  wakeVideoGenerationTaskCompletion,
} = await import("./video-generate-background.js");
const { withMediaGenerationTaskKeepalive } = await import("./media-generate-background-shared.js");

describe("video generate background helpers", () => {
  beforeEach(() => {
    resetAgentRunContextForTest();
    resetMediaBackgroundMocks({
      taskExecutorMocks,
      taskDeliveryRuntimeMocks,
      announceDeliveryMocks,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    resetAgentRunContextForTest();
>>>>>>> upstream/main
  });

  it("creates a running task with queued progress text", () => {
    taskExecutorMocks.createRunningTaskRun.mockReturnValue({
      taskId: "task-123",
    });

    const handle = createVideoGenerationTaskRun({
      sessionKey: "agent:main:discord:direct:123",
      requesterOrigin: {
        channel: "discord",
        to: "channel:1",
      },
      prompt: "friendly lobster surfing",
      providerId: "openai",
    });

<<<<<<< HEAD
    expect(handle).toMatchObject({
      taskId: "task-123",
      requesterSessionKey: "agent:main:discord:direct:123",
      taskLabel: "friendly lobster surfing",
    });
    expect(taskExecutorMocks.createRunningTaskRun).toHaveBeenCalledWith(
      expect.objectContaining({
        taskKind: VIDEO_GENERATION_TASK_KIND,
        sourceId: "video_generate:openai",
        progressSummary: "Queued video generation",
      }),
    );
=======
    expect(handle?.taskId).toBe("task-123");
    expect(handle?.requesterSessionKey).toBe("agent:main:discord:direct:123");
    expect(handle?.taskLabel).toBe("friendly lobster surfing");
    expectQueuedTaskRun({
      taskExecutorMocks,
      taskKind: VIDEO_GENERATION_TASK_KIND,
      sourceId: "video_generate:openai",
      progressSummary: "Queued video generation",
    });
>>>>>>> upstream/main
  });

  it("records task progress updates", () => {
    recordVideoGenerationTaskProgress({
      handle: {
        taskId: "task-123",
        runId: "tool:video_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        taskLabel: "friendly lobster surfing",
      },
      progressSummary: "Saving generated video",
    });

<<<<<<< HEAD
    expect(taskExecutorMocks.recordTaskRunProgressByRunId).toHaveBeenCalledWith(
      expect.objectContaining({
        runId: "tool:video_generate:abc",
        progressSummary: "Saving generated video",
      }),
=======
    expectRecordedTaskProgress({
      taskExecutorMocks,
      runId: "tool:video_generate:abc",
      progressSummary: "Saving generated video",
    });
  });

  it("keeps the detached video tool run context registered until terminal status", () => {
    taskExecutorMocks.createRunningTaskRun.mockReturnValue({
      taskId: "task-123",
    });

    const handle = createVideoGenerationTaskRun({
      sessionKey: "agent:main:discord:channel:123",
      prompt: "friendly lobster surfing",
      providerId: "fal",
    });
    if (!handle) {
      throw new Error("expected video generation task handle");
    }

    expect(handle.runId).toMatch(/^tool:video_generate:/);
    expect(getAgentRunContext(handle.runId)?.sessionKey).toBe("agent:main:discord:channel:123");

    const beforeProgress = Date.now();
    recordVideoGenerationTaskProgress({
      handle,
      progressSummary: "Generating video",
    });

    expect(getAgentRunContext(handle.runId)?.lastActiveAt).toBeGreaterThanOrEqual(beforeProgress);

    failVideoGenerationTaskRun({
      handle,
      error: new Error("provider failed"),
    });

    expect(getAgentRunContext(handle.runId)).toBeUndefined();
  });

  it("keeps long-running media tasks fresh while provider work is pending", async () => {
    // Provider video generation can outlive normal activity windows; keepalive
    // progress prevents the detached task from looking stale while it waits.
    vi.useFakeTimers();
    let resolveRun: ((value: string) => void) | undefined;
    const runPromise = new Promise<string>((resolve) => {
      resolveRun = resolve;
    });
    const task = withMediaGenerationTaskKeepalive({
      handle: {
        taskId: "task-123",
        runId: "tool:video_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        taskLabel: "friendly lobster surfing",
      },
      progressSummary: "Generating video",
      run: () => runPromise,
    });

    await vi.advanceTimersByTimeAsync(60_000);

    expectRecordedTaskProgress({
      taskExecutorMocks,
      runId: "tool:video_generate:abc",
      progressSummary: "Generating video",
    });

    if (!resolveRun) {
      throw new Error("Expected video generation run resolver to be initialized");
    }
    resolveRun("done");
    await expect(task).resolves.toBe("done");
    const callsAfterCompletion = taskExecutorMocks.recordTaskRunProgressByRunId.mock.calls.length;

    await vi.advanceTimersByTimeAsync(60_000);

    expect(taskExecutorMocks.recordTaskRunProgressByRunId).toHaveBeenCalledTimes(
      callsAfterCompletion,
>>>>>>> upstream/main
    );
  });

  it("queues a completion event by default when direct send is disabled", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "direct",
    });

    await wakeVideoGenerationTaskCompletion({
<<<<<<< HEAD
      handle: {
        taskId: "task-123",
        runId: "tool:video_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "friendly lobster surfing",
      },
      status: "ok",
      statusLabel: "completed successfully",
      result: "Generated 1 video.\nMEDIA:/tmp/generated-lobster.mp4",
      mediaUrls: ["/tmp/generated-lobster.mp4"],
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalled();
  });

  it("delivers completed video directly to the requester channel when enabled", async () => {
    taskDeliveryRuntimeMocks.sendMessage.mockResolvedValue({
      channel: "discord",
      messageId: "msg-1",
    });

    await wakeVideoGenerationTaskCompletion({
      config: { tools: { media: { asyncCompletion: { directSend: true } } } },
      handle: {
        taskId: "task-123",
        runId: "tool:video_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "friendly lobster surfing",
      },
      status: "ok",
      statusLabel: "completed successfully",
      result: "Generated 1 video.\nMEDIA:/tmp/generated-lobster.mp4",
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "discord",
        to: "channel:1",
        threadId: "thread-1",
        content: "Generated 1 video.",
        mediaUrls: ["/tmp/generated-lobster.mp4"],
      }),
    );
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).not.toHaveBeenCalled();
  });

  it("falls back to a video-generation completion event when direct delivery fails", async () => {
    taskDeliveryRuntimeMocks.sendMessage.mockRejectedValue(new Error("discord upload failed"));
=======
      ...createMediaCompletionFixture({
        runId: "tool:video_generate:abc",
        taskLabel: "friendly lobster surfing",
        result: "Generated 1 video.\nMEDIA:/tmp/generated-lobster.mp4",
        mediaUrls: ["/tmp/generated-lobster.mp4"],
      }),
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledTimes(1);
  });

  it("keeps completed video agent-mediated even when direct send is enabled", async () => {
>>>>>>> upstream/main
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "direct",
    });

    await wakeVideoGenerationTaskCompletion({
<<<<<<< HEAD
      config: { tools: { media: { asyncCompletion: { directSend: true } } } },
      handle: {
        taskId: "task-123",
        runId: "tool:video_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "friendly lobster surfing",
      },
      status: "ok",
      statusLabel: "completed successfully",
      result: "Generated 1 video.\nMEDIA:/tmp/generated-lobster.mp4",
      mediaUrls: ["/tmp/generated-lobster.mp4"],
    });

    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledWith(
      expect.objectContaining({
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: expect.objectContaining({
          channel: "discord",
          to: "channel:1",
        }),
        expectsCompletionMessage: true,
        internalEvents: expect.arrayContaining([
          expect.objectContaining({
            source: "video_generation",
            announceType: "video generation task",
            status: "ok",
            result: expect.stringContaining("MEDIA:/tmp/generated-lobster.mp4"),
            mediaUrls: ["/tmp/generated-lobster.mp4"],
            replyInstruction: expect.stringContaining("Prefer the message tool for delivery"),
          }),
        ]),
      }),
    );
=======
      ...createMediaCompletionFixture({
        directSend: true,
        runId: "tool:video_generate:abc",
        taskLabel: "friendly lobster surfing",
        result: "Generated 1 video.\nMEDIA:/tmp/generated-lobster.mp4",
        mediaUrls: ["/tmp/generated-lobster.mp4"],
      }),
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expectFallbackMediaAnnouncement({
      deliverAnnouncementMock: announceDeliveryMocks.deliverSubagentAnnouncement,
      requesterSessionKey: "agent:main:discord:direct:123",
      channel: "discord",
      to: "channel:1",
      source: "video_generation",
      announceType: "video generation task",
      resultMediaPath: "MEDIA:/tmp/generated-lobster.mp4",
      mediaUrls: ["/tmp/generated-lobster.mp4"],
    });
  });

  it("delivers video generation failures directly instead of relying on the model handoff", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: false,
      path: "direct",
      reason: "generated_media_missing",
      error: "completion agent did not deliver generated media",
    });

    await wakeVideoGenerationTaskCompletion({
      ...createMediaCompletionFixture({
        runId: "tool:video_generate:abc",
        taskLabel: "friendly lobster surfing",
        result: "All video generation models failed.",
      }),
      status: "error",
      statusLabel: "failed",
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).toHaveBeenCalledTimes(1);
    expect(taskDeliveryRuntimeMocks.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "discord",
        to: "channel:1",
        threadId: "thread-1",
        content: "Video generation failed: All video generation models failed.",
        requesterSessionKey: "agent:main:discord:direct:123",
        idempotencyKey: "video_generate:task-123:error:direct",
        mirror: expect.objectContaining({
          sessionKey: "agent:main:discord:direct:123",
          idempotencyKey: "video_generate:task-123:error:direct",
        }),
      }),
    );
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledTimes(1);
  });

  it("keeps active video generation failure wakes agent-mediated", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "steered",
    });

    await wakeVideoGenerationTaskCompletion({
      ...createMediaCompletionFixture({
        runId: "tool:video_generate:abc",
        taskLabel: "friendly lobster surfing",
        result: "All video generation models failed.",
      }),
      status: "error",
      statusLabel: "failed",
    });

    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledTimes(1);
    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
>>>>>>> upstream/main
  });
});
