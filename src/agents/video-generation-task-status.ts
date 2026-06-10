<<<<<<< HEAD
=======
/**
 * Video generation task status helpers.
 *
 * These wrap the generic media task status helpers with video-specific kind,
 * source, labels, duplicate-guard timing, and prompt-context wording.
 */
>>>>>>> upstream/main
import type { TaskRecord } from "../tasks/task-registry.types.js";
import {
  buildActiveMediaGenerationTaskPromptContextForSession,
  buildMediaGenerationTaskStatusDetails,
  buildMediaGenerationTaskStatusText,
  findActiveMediaGenerationTaskForSession,
<<<<<<< HEAD
=======
  findDuplicateGuardMediaGenerationTaskForSession,
>>>>>>> upstream/main
  getMediaGenerationTaskProviderId,
  isActiveMediaGenerationTask,
} from "./media-generation-task-status-shared.js";

export const VIDEO_GENERATION_TASK_KIND = "video_generation";
const VIDEO_GENERATION_SOURCE_PREFIX = "video_generate";
<<<<<<< HEAD

=======
const RECENT_VIDEO_GENERATION_DUPLICATE_GUARD_MS = 2 * 60_000;

/** Returns whether a task is an active video generation task. */
>>>>>>> upstream/main
export function isActiveVideoGenerationTask(task: TaskRecord): boolean {
  return isActiveMediaGenerationTask({
    task,
    taskKind: VIDEO_GENERATION_TASK_KIND,
  });
}

<<<<<<< HEAD
=======
/** Extracts the provider id from a video generation task source. */
>>>>>>> upstream/main
export function getVideoGenerationTaskProviderId(task: TaskRecord): string | undefined {
  return getMediaGenerationTaskProviderId(task, VIDEO_GENERATION_SOURCE_PREFIX);
}

<<<<<<< HEAD
export function findActiveVideoGenerationTaskForSession(sessionKey?: string): TaskRecord | null {
=======
/** Finds an active video generation task for a session. */
export function findActiveVideoGenerationTaskForSession(
  sessionKey?: string,
): TaskRecord | undefined {
>>>>>>> upstream/main
  return findActiveMediaGenerationTaskForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

<<<<<<< HEAD
=======
/** Finds a recent matching video task used to suppress duplicate generation requests. */
export function findDuplicateGuardVideoGenerationTaskForSession(
  sessionKey?: string,
  params?: { prompt?: string; requestKey?: string },
): TaskRecord | undefined {
  return findDuplicateGuardMediaGenerationTaskForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    taskLabel: params?.prompt,
    requestKey: params?.requestKey,
    maxAgeMs: RECENT_VIDEO_GENERATION_DUPLICATE_GUARD_MS,
  });
}

/** Builds structured status details for a video generation task. */
>>>>>>> upstream/main
export function buildVideoGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown> {
  return buildMediaGenerationTaskStatusDetails({
    task,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

<<<<<<< HEAD
=======
/** Builds the user-facing status text for a video generation task. */
>>>>>>> upstream/main
export function buildVideoGenerationTaskStatusText(
  task: TaskRecord,
  params?: { duplicateGuard?: boolean },
): string {
  return buildMediaGenerationTaskStatusText({
    task,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    nounLabel: "Video generation",
    toolName: "video_generate",
    completionLabel: "video",
    duplicateGuard: params?.duplicateGuard,
  });
}

<<<<<<< HEAD
=======
/** Builds prompt context describing an active video generation task in the session. */
>>>>>>> upstream/main
export function buildActiveVideoGenerationTaskPromptContextForSession(
  sessionKey?: string,
): string | undefined {
  return buildActiveMediaGenerationTaskPromptContextForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    nounLabel: "Video generation",
    toolName: "video_generate",
    completionLabel: "videos",
  });
}
