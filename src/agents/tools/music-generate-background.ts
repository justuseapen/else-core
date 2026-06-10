<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
import type { DeliveryContext } from "../../utils/delivery-context.js";
import { MUSIC_GENERATION_TASK_KIND } from "../music-generation-task-status.js";
import {
  completeMediaGenerationTaskRun,
  createMediaGenerationTaskRun,
  failMediaGenerationTaskRun,
  recordMediaGenerationTaskProgress,
  wakeMediaGenerationTaskCompletion,
=======
/**
 * Music generation background task facade.
 *
 * Binds shared detached media-task lifecycle behavior to music_generate labels and completion messages.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { MUSIC_GENERATION_TASK_KIND } from "../music-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
>>>>>>> upstream/main
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

export type MusicGenerationTaskHandle = MediaGenerationTaskHandle;

<<<<<<< HEAD
export function createMusicGenerationTaskRun(params: {
  sessionKey?: string;
  requesterOrigin?: DeliveryContext;
  prompt: string;
  providerId?: string;
}): MusicGenerationTaskHandle | null {
  return createMediaGenerationTaskRun({
    sessionKey: params.sessionKey,
    requesterOrigin: params.requesterOrigin,
    prompt: params.prompt,
    providerId: params.providerId,
    toolName: "music_generate",
    taskKind: MUSIC_GENERATION_TASK_KIND,
    label: "Music generation",
    queuedProgressSummary: "Queued music generation",
  });
}

export function recordMusicGenerationTaskProgress(params: {
  handle: MusicGenerationTaskHandle | null;
  progressSummary: string;
  eventSummary?: string;
}) {
  recordMediaGenerationTaskProgress(params);
}

export function completeMusicGenerationTaskRun(params: {
  handle: MusicGenerationTaskHandle | null;
  provider: string;
  model: string;
  count: number;
  paths: string[];
}) {
  completeMediaGenerationTaskRun({
    ...params,
    generatedLabel: "track",
  });
}

export function failMusicGenerationTaskRun(params: {
  handle: MusicGenerationTaskHandle | null;
  error: unknown;
}) {
  failMediaGenerationTaskRun({
    ...params,
    progressSummary: "Music generation failed",
  });
}

=======
/** Shared lifecycle configured with music-specific status text and event metadata. */
export const musicGenerationTaskLifecycle = createMediaGenerationTaskLifecycle({
  toolName: "music_generate",
  taskKind: MUSIC_GENERATION_TASK_KIND,
  label: "Music generation",
  queuedProgressSummary: "Queued music generation",
  generatedLabel: "track",
  failureProgressSummary: "Music generation failed",
  eventSource: "music_generation",
  announceType: "music generation task",
  completionLabel: "music",
});

/** Creates a queued music-generation background task run. */
export const createMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.createTaskRun>
) => musicGenerationTaskLifecycle.createTaskRun(...params);

/** Records progress for an active music-generation task. */
export const recordMusicGenerationTaskProgress = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.recordTaskProgress>
) => musicGenerationTaskLifecycle.recordTaskProgress(...params);

/** Marks a music-generation task complete and stores generated attachment metadata. */
export const completeMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.completeTaskRun>
) => musicGenerationTaskLifecycle.completeTaskRun(...params);

/** Marks a music-generation task failed and emits task status updates. */
export const failMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.failTaskRun>
) => musicGenerationTaskLifecycle.failTaskRun(...params);

/** Wakes the waiting session turn with final music-generation output. */
>>>>>>> upstream/main
export async function wakeMusicGenerationTaskCompletion(params: {
  config?: OpenClawConfig;
  handle: MusicGenerationTaskHandle | null;
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
    eventSource: "music_generation",
    announceType: "music generation task",
    toolName: "music_generate",
    completionLabel: "music",
  });
=======
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
}) {
  return await musicGenerationTaskLifecycle.wakeTaskCompletion(params);
>>>>>>> upstream/main
}
