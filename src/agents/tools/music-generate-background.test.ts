<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MUSIC_GENERATION_TASK_KIND } from "../music-generation-task-status.js";
import {
  createMusicGenerationTaskRun,
  recordMusicGenerationTaskProgress,
  wakeMusicGenerationTaskCompletion,
} from "./music-generate-background.js";

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

describe("music generate background helpers", () => {
  beforeEach(() => {
    taskExecutorMocks.createRunningTaskRun.mockReset();
    taskExecutorMocks.recordTaskRunProgressByRunId.mockReset();
    taskDeliveryRuntimeMocks.sendMessage.mockReset();
    announceDeliveryMocks.deliverSubagentAnnouncement.mockReset();
=======
// Music background tests cover task-run creation, progress recording, and
// completion delivery through announcement agents or direct fallback sends.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MUSIC_GENERATION_TASK_KIND } from "../music-generation-task-status.js";
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
  createMusicGenerationTaskRun,
  recordMusicGenerationTaskProgress,
  wakeMusicGenerationTaskCompletion,
} = await import("./music-generate-background.js");

function getDeliveredInternalEvents(): Array<Record<string, unknown>> {
  // Completion agents receive internal events; tests inspect them to keep the
  // visible-reply media contract explicit.
  const params = announceDeliveryMocks.deliverSubagentAnnouncement.mock.calls.at(0)?.[0] as
    | { internalEvents?: unknown }
    | undefined;
  if (!Array.isArray(params?.internalEvents)) {
    throw new Error("Expected delivered internal events");
  }
  return params.internalEvents as Array<Record<string, unknown>>;
}

function expectReplyInstructionContains(text: string) {
  const event = getDeliveredInternalEvents().find(
    (item) => typeof item.replyInstruction === "string" && item.replyInstruction.includes(text),
  );
  if (!event) {
    throw new Error(`Expected reply instruction containing ${text}`);
  }
}

describe("music generate background helpers", () => {
  beforeEach(() => {
    resetMediaBackgroundMocks({
      taskExecutorMocks,
      taskDeliveryRuntimeMocks,
      announceDeliveryMocks,
    });
>>>>>>> upstream/main
  });

  it("creates a running task with queued progress text", () => {
    taskExecutorMocks.createRunningTaskRun.mockReturnValue({
      taskId: "task-123",
    });

    const handle = createMusicGenerationTaskRun({
      sessionKey: "agent:main:discord:direct:123",
      requesterOrigin: {
        channel: "discord",
        to: "channel:1",
      },
      prompt: "night-drive synthwave",
      providerId: "google",
    });

<<<<<<< HEAD
    expect(handle).toMatchObject({
      taskId: "task-123",
      requesterSessionKey: "agent:main:discord:direct:123",
      taskLabel: "night-drive synthwave",
    });
    expect(taskExecutorMocks.createRunningTaskRun).toHaveBeenCalledWith(
      expect.objectContaining({
        taskKind: MUSIC_GENERATION_TASK_KIND,
        sourceId: "music_generate:google",
        progressSummary: "Queued music generation",
      }),
    );
=======
    if (!handle) {
      throw new Error("Expected music generation task handle");
    }
    expect(handle.taskId).toBe("task-123");
    expect(handle.requesterSessionKey).toBe("agent:main:discord:direct:123");
    expect(handle.taskLabel).toBe("night-drive synthwave");
    expectQueuedTaskRun({
      taskExecutorMocks,
      taskKind: MUSIC_GENERATION_TASK_KIND,
      sourceId: "music_generate:google",
      progressSummary: "Queued music generation",
    });
>>>>>>> upstream/main
  });

  it("records task progress updates", () => {
    recordMusicGenerationTaskProgress({
      handle: {
        taskId: "task-123",
        runId: "tool:music_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        taskLabel: "night-drive synthwave",
      },
      progressSummary: "Saving generated music",
    });

<<<<<<< HEAD
    expect(taskExecutorMocks.recordTaskRunProgressByRunId).toHaveBeenCalledWith(
      expect.objectContaining({
        runId: "tool:music_generate:abc",
        progressSummary: "Saving generated music",
      }),
    );
=======
    expectRecordedTaskProgress({
      taskExecutorMocks,
      runId: "tool:music_generate:abc",
      progressSummary: "Saving generated music",
    });
>>>>>>> upstream/main
  });

  it("queues a completion event by default when direct send is disabled", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "direct",
    });

    await wakeMusicGenerationTaskCompletion({
<<<<<<< HEAD
      handle: {
        taskId: "task-123",
        runId: "tool:music_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "night-drive synthwave",
      },
      status: "ok",
      statusLabel: "completed successfully",
=======
      ...createMediaCompletionFixture({
        runId: "tool:music_generate:abc",
        taskLabel: "night-drive synthwave",
        result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
        mediaUrls: ["/tmp/generated-night-drive.mp3"],
      }),
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledTimes(1);
  });

  it("tells channel completion agents to follow the visible-reply contract", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "direct",
    });
    const completion = createMediaCompletionFixture({
      runId: "tool:music_generate:abc",
      taskLabel: "night-drive synthwave",
>>>>>>> upstream/main
      result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
      mediaUrls: ["/tmp/generated-night-drive.mp3"],
    });

<<<<<<< HEAD
    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalled();
  });

  it("delivers completed music directly to the requester channel when enabled", async () => {
    taskDeliveryRuntimeMocks.sendMessage.mockResolvedValue({
      channel: "discord",
      messageId: "msg-1",
    });

    await wakeMusicGenerationTaskCompletion({
      config: { tools: { media: { asyncCompletion: { directSend: true } } } },
      handle: {
        taskId: "task-123",
        runId: "tool:music_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "night-drive synthwave",
      },
      status: "ok",
      statusLabel: "completed successfully",
      result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
=======
    await wakeMusicGenerationTaskCompletion({
      ...completion,
      handle: {
        ...completion.handle,
        requesterSessionKey: "agent:main:discord:channel:C123",
      },
    });

    expectReplyInstructionContains("visible-reply contract");
    expectReplyInstructionContains("final-reply MEDIA lines");
  });

  it("delivers failure completion notices directly", async () => {
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: false,
      path: "direct",
      reason: "generated_media_missing",
      error: "completion agent did not deliver generated media",
    });
    const completion = createMediaCompletionFixture({
      runId: "tool:music_generate:abc",
      taskLabel: "night-drive synthwave",
      result: "provider failed",
    });

    await wakeMusicGenerationTaskCompletion({
      ...completion,
      status: "error",
      statusLabel: "failed",
>>>>>>> upstream/main
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
<<<<<<< HEAD
        channel: "discord",
        to: "channel:1",
        threadId: "thread-1",
        content: "Generated 1 track.",
        mediaUrls: ["/tmp/generated-night-drive.mp3"],
      }),
    );
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).not.toHaveBeenCalled();
  });

  it("falls back to a music-generation completion event when direct delivery fails", async () => {
    taskDeliveryRuntimeMocks.sendMessage.mockRejectedValue(new Error("discord upload failed"));
=======
        content: "Music generation failed: provider failed",
        idempotencyKey: "music_generate:task-123:error:direct",
      }),
    );
    expect(announceDeliveryMocks.deliverSubagentAnnouncement).toHaveBeenCalledTimes(1);
  });

  it.each(["agent:main:discord:guild-123:channel-456", "agent:main:whatsapp:123@g.us"])(
    "warns legacy group/channel completion agents for %s",
    async (requesterSessionKey) => {
      announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
        delivered: true,
        path: "direct",
      });
      const completion = createMediaCompletionFixture({
        runId: "tool:music_generate:abc",
        taskLabel: "night-drive synthwave",
        result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
        mediaUrls: ["/tmp/generated-night-drive.mp3"],
      });

      await wakeMusicGenerationTaskCompletion({
        ...completion,
        handle: {
          ...completion.handle,
          requesterSessionKey,
        },
      });

      expectReplyInstructionContains("visible-reply contract");
      expectReplyInstructionContains("final-reply MEDIA lines");
    },
  );

  it("queues a completion event when direct send is enabled globally", async () => {
    taskDeliveryRuntimeMocks.sendMessage.mockResolvedValue({
      channel: "discord",
      messageId: "msg-1",
    });
>>>>>>> upstream/main
    announceDeliveryMocks.deliverSubagentAnnouncement.mockResolvedValue({
      delivered: true,
      path: "direct",
    });

    await wakeMusicGenerationTaskCompletion({
<<<<<<< HEAD
      config: { tools: { media: { asyncCompletion: { directSend: true } } } },
      handle: {
        taskId: "task-123",
        runId: "tool:music_generate:abc",
        requesterSessionKey: "agent:main:discord:direct:123",
        requesterOrigin: {
          channel: "discord",
          to: "channel:1",
          threadId: "thread-1",
        },
        taskLabel: "night-drive synthwave",
      },
      status: "ok",
      statusLabel: "completed successfully",
      result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
      mediaUrls: ["/tmp/generated-night-drive.mp3"],
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
            source: "music_generation",
            announceType: "music generation task",
            status: "ok",
            result: expect.stringContaining("MEDIA:/tmp/generated-night-drive.mp3"),
            mediaUrls: ["/tmp/generated-night-drive.mp3"],
            replyInstruction: expect.stringContaining("Prefer the message tool for delivery"),
          }),
        ]),
      }),
    );
=======
      ...createMediaCompletionFixture({
        directSend: true,
        runId: "tool:music_generate:abc",
        taskLabel: "night-drive synthwave",
        result: "Generated 1 track.\nMEDIA:/tmp/generated-night-drive.mp3",
        mediaUrls: ["/tmp/generated-night-drive.mp3"],
      }),
    });

    expect(taskDeliveryRuntimeMocks.sendMessage).not.toHaveBeenCalled();
    expectFallbackMediaAnnouncement({
      deliverAnnouncementMock: announceDeliveryMocks.deliverSubagentAnnouncement,
      requesterSessionKey: "agent:main:discord:direct:123",
      channel: "discord",
      to: "channel:1",
      source: "music_generation",
      announceType: "music generation task",
      resultMediaPath: "MEDIA:/tmp/generated-night-drive.mp3",
      mediaUrls: ["/tmp/generated-night-drive.mp3"],
    });
>>>>>>> upstream/main
  });
});
