<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
import type { DeliveryContext } from "../../utils/delivery-context.js";
import { VIDEO_GENERATION_TASK_KIND } from "../video-generation-task-status.js";
import {
  completeMediaGenerationTaskRun,
  createMediaGenerationTaskRun,
  failMediaGenerationTaskRun,
  recordMediaGenerationTaskProgress,
  wakeMediaGenerationTaskCompletion,
=======
/**
 * Video-generation background task lifecycle adapters.
 *
 * Specializes the shared media background runner with video status text and completion metadata.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { VIDEO_GENERATION_TASK_KIND } from "../video-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
>>>>>>> upstream/main
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

export type VideoGenerationTaskHandle = MediaGenerationTaskHandle;

<<<<<<< HEAD
export function createVideoGenerationTaskRun(params: {
  sessionKey?: string;
  requesterOrigin?: DeliveryContext;
  prompt: string;
  providerId?: string;
}): VideoGenerationTaskHandle | null {
  return createMediaGenerationTaskRun({
    sessionKey: params.sessionKey,
    requesterOrigin: params.requesterOrigin,
    prompt: params.prompt,
    providerId: params.providerId,
    toolName: "video_generate",
    taskKind: VIDEO_GENERATION_TASK_KIND,
    label: "Video generation",
    queuedProgressSummary: "Queued video generation",
  });
}

export function recordVideoGenerationTaskProgress(params: {
  handle: VideoGenerationTaskHandle | null;
  progressSummary: string;
  eventSummary?: string;
}) {
  recordMediaGenerationTaskProgress(params);
}

export function completeVideoGenerationTaskRun(params: {
  handle: VideoGenerationTaskHandle | null;
  provider: string;
  model: string;
  count: number;
  paths: string[];
}) {
  completeMediaGenerationTaskRun({
    ...params,
    generatedLabel: "video",
  });
}

export function failVideoGenerationTaskRun(params: {
  handle: VideoGenerationTaskHandle | null;
  error: unknown;
}) {
  failMediaGenerationTaskRun({
    ...params,
    progressSummary: "Video generation failed",
  });
}

=======
/** Shared lifecycle configured with video-specific status text and event metadata. */
export const videoGenerationTaskLifecycle = createMediaGenerationTaskLifecycle({
  toolName: "video_generate",
  taskKind: VIDEO_GENERATION_TASK_KIND,
  label: "Video generation",
  queuedProgressSummary: "Queued video generation",
  generatedLabel: "video",
  failureProgressSummary: "Video generation failed",
  eventSource: "video_generation",
  announceType: "video generation task",
  completionLabel: "video",
});

/** Creates a queued video-generation background task run. */
export const createVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.createTaskRun>
) => videoGenerationTaskLifecycle.createTaskRun(...params);

/** Records progress for an active video-generation task. */
export const recordVideoGenerationTaskProgress = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.recordTaskProgress>
) => videoGenerationTaskLifecycle.recordTaskProgress(...params);

/** Marks a video-generation task complete and stores generated attachment metadata. */
export const completeVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.completeTaskRun>
) => videoGenerationTaskLifecycle.completeTaskRun(...params);

/** Marks a video-generation task failed and emits task status updates. */
export const failVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.failTaskRun>
) => videoGenerationTaskLifecycle.failTaskRun(...params);

/** Wakes the waiting session turn with final video-generation output. */
>>>>>>> upstream/main
export async function wakeVideoGenerationTaskCompletion(params: {
  config?: OpenClawConfig;
  handle: VideoGenerationTaskHandle | null;
  status: "ok" | "error";
  statusLabel: string;
  result: string;
<<<<<<< HEAD
  mediaUrls?: string[];
  statsLine?: string;
}) {
  await wakeMediaGenerationTaskCompletion({
    config: params.config,
    handle: params.handle,
    status: params.status,
    statusLabel: params.statusLabel,
    result: params.result,
    mediaUrls: params.mediaUrls,
    statsLine: params.statsLine,
    eventSource: "video_generation",
    announceType: "video generation task",
    toolName: "video_generate",
    completionLabel: "video",
  });
=======
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
}) {
  return await videoGenerationTaskLifecycle.wakeTaskCompletion(params);
>>>>>>> upstream/main
}
