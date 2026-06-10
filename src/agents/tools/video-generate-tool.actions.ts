<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
import { getProviderEnvVars } from "../../secrets/provider-env-vars.js";
import { listRuntimeVideoGenerationProviders } from "../../video-generation/runtime.js";
=======
/**
 * video_generate action result helpers.
 *
 * Formats provider listing, active-task status, and duplicate-guard responses for the tool.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { listSupportedVideoGenerationModes } from "../../video-generation/capabilities.js";
import { listRuntimeVideoGenerationProviders } from "../../video-generation/runtime.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
>>>>>>> upstream/main
import {
  buildVideoGenerationTaskStatusDetails,
  buildVideoGenerationTaskStatusText,
  findActiveVideoGenerationTaskForSession,
<<<<<<< HEAD
} from "../video-generation-task-status.js";

type VideoGenerateActionResult = {
  content: Array<{ type: "text"; text: string }>;
  details: Record<string, unknown>;
};

function getVideoGenerationProviderAuthEnvVars(providerId: string): string[] {
  return getProviderEnvVars(providerId);
=======
  findDuplicateGuardVideoGenerationTaskForSession,
} from "../video-generation-task-status.js";
import {
  createMediaGenerateProviderListActionResult,
  createMediaGenerateTaskStatusActions,
  type MediaGenerateActionResult,
} from "./media-generate-tool-actions-shared.js";

type VideoGenerateActionResult = MediaGenerateActionResult;

function summarizeVideoGenerationCapabilities(
  provider: ReturnType<typeof listRuntimeVideoGenerationProviders>[number],
): string {
  const supportedModes = listSupportedVideoGenerationModes(provider);
  const generate = provider.capabilities.generate;
  const imageToVideo = provider.capabilities.imageToVideo;
  const videoToVideo = provider.capabilities.videoToVideo;
  // providerOptions may be declared at the mode level (generate) or at the flat
  // provider-capabilities level. The runtime checks both; surface the union so
  // the agent sees a single merged view of which opaque keys each provider
  // actually accepts.
  const declaredProviderOptions: Record<string, string> = {};
  for (const [key, type] of Object.entries(provider.capabilities.providerOptions ?? {})) {
    declaredProviderOptions[key] = type;
  }
  for (const [key, type] of Object.entries(generate?.providerOptions ?? {})) {
    declaredProviderOptions[key] = type;
  }
  for (const [key, type] of Object.entries(imageToVideo?.providerOptions ?? {})) {
    declaredProviderOptions[key] = type;
  }
  for (const [key, type] of Object.entries(videoToVideo?.providerOptions ?? {})) {
    declaredProviderOptions[key] = type;
  }
  const maxInputAudios =
    generate?.maxInputAudios ??
    imageToVideo?.maxInputAudios ??
    videoToVideo?.maxInputAudios ??
    provider.capabilities.maxInputAudios;
  const capabilities = [
    supportedModes.length > 0 ? `modes=${supportedModes.join("/")}` : null,
    generate?.maxVideos ? `maxVideos=${generate.maxVideos}` : null,
    imageToVideo?.maxInputImages ? `maxInputImages=${imageToVideo.maxInputImages}` : null,
    videoToVideo?.maxInputVideos ? `maxInputVideos=${videoToVideo.maxInputVideos}` : null,
    typeof maxInputAudios === "number" && maxInputAudios > 0
      ? `maxInputAudios=${maxInputAudios}`
      : null,
    generate?.maxDurationSeconds ? `maxDurationSeconds=${generate.maxDurationSeconds}` : null,
    generate?.supportedDurationSeconds?.length
      ? `supportedDurationSeconds=${generate.supportedDurationSeconds.join("/")}`
      : null,
    generate?.supportedDurationSecondsByModel &&
    Object.keys(generate.supportedDurationSecondsByModel).length > 0
      ? `supportedDurationSecondsByModel=${Object.entries(generate.supportedDurationSecondsByModel)
          .map(([modelId, durations]) => `${modelId}:${durations.join("/")}`)
          .join("; ")}`
      : null,
    generate?.supportsResolution ? "resolution" : null,
    generate?.supportsAspectRatio ? "aspectRatio" : null,
    generate?.supportsSize ? "size" : null,
    generate?.supportsAudio ? "audio" : null,
    generate?.supportsWatermark ? "watermark" : null,
    Object.keys(declaredProviderOptions).length > 0
      ? `providerOptions={${Object.entries(declaredProviderOptions)
          .map(([key, type]) => `${key}:${type}`)
          .join(", ")}}`
      : null,
  ]
    .filter((entry): entry is string => Boolean(entry))
    .join(", ");
  return capabilities;
>>>>>>> upstream/main
}

export function createVideoGenerateListActionResult(
  config?: OpenClawConfig,
<<<<<<< HEAD
): VideoGenerateActionResult {
  const providers = listRuntimeVideoGenerationProviders({ config });
  if (providers.length === 0) {
    return {
      content: [{ type: "text", text: "No video-generation providers are registered." }],
      details: { providers: [] },
    };
  }
  const lines = providers.map((provider) => {
    const authHints = getVideoGenerationProviderAuthEnvVars(provider.id);
    const capabilities = [
      provider.capabilities.maxVideos ? `maxVideos=${provider.capabilities.maxVideos}` : null,
      provider.capabilities.maxInputImages
        ? `maxInputImages=${provider.capabilities.maxInputImages}`
        : null,
      provider.capabilities.maxInputVideos
        ? `maxInputVideos=${provider.capabilities.maxInputVideos}`
        : null,
      provider.capabilities.maxDurationSeconds
        ? `maxDurationSeconds=${provider.capabilities.maxDurationSeconds}`
        : null,
      provider.capabilities.supportedDurationSeconds?.length
        ? `supportedDurationSeconds=${provider.capabilities.supportedDurationSeconds.join("/")}`
        : null,
      provider.capabilities.supportedDurationSecondsByModel &&
      Object.keys(provider.capabilities.supportedDurationSecondsByModel).length > 0
        ? `supportedDurationSecondsByModel=${Object.entries(
            provider.capabilities.supportedDurationSecondsByModel,
          )
            .map(([modelId, durations]) => `${modelId}:${durations.join("/")}`)
            .join("; ")}`
        : null,
      provider.capabilities.supportsResolution ? "resolution" : null,
      provider.capabilities.supportsAspectRatio ? "aspectRatio" : null,
      provider.capabilities.supportsSize ? "size" : null,
      provider.capabilities.supportsAudio ? "audio" : null,
      provider.capabilities.supportsWatermark ? "watermark" : null,
    ]
      .filter((entry): entry is string => Boolean(entry))
      .join(", ");
    return [
      `${provider.id}: default=${provider.defaultModel ?? "none"}`,
      provider.models?.length ? `models=${provider.models.join(", ")}` : null,
      capabilities ? `capabilities=${capabilities}` : null,
      authHints.length > 0 ? `auth=${authHints.join(" / ")}` : null,
    ]
      .filter((entry): entry is string => Boolean(entry))
      .join(" | ");
  });
  return {
    content: [{ type: "text", text: lines.join("\n") }],
    details: {
      providers: providers.map((provider) => ({
        id: provider.id,
        defaultModel: provider.defaultModel,
        models: provider.models ?? [],
        authEnvVars: getVideoGenerationProviderAuthEnvVars(provider.id),
        capabilities: provider.capabilities,
      })),
    },
  };
}

export function createVideoGenerateStatusActionResult(
  sessionKey?: string,
): VideoGenerateActionResult {
  const activeTask = findActiveVideoGenerationTaskForSession(sessionKey);
  if (!activeTask) {
    return {
      content: [
        {
          type: "text",
          text: "No active video generation task is currently running for this session.",
        },
      ],
      details: {
        action: "status",
        active: false,
      },
    };
  }
  return {
    content: [
      {
        type: "text",
        text: buildVideoGenerationTaskStatusText(activeTask),
      },
    ],
    details: {
      action: "status",
      ...buildVideoGenerationTaskStatusDetails(activeTask),
    },
  };
=======
  options?: { workspaceDir?: string; agentDir?: string; authStore?: AuthProfileStore },
): VideoGenerateActionResult {
  const providers = listRuntimeVideoGenerationProviders({ config });
  return createMediaGenerateProviderListActionResult({
    kind: "video_generation",
    providers,
    emptyText: "No video-generation providers are registered.",
    cfg: config,
    workspaceDir: options?.workspaceDir,
    agentDir: options?.agentDir,
    authStore: options?.authStore,
    listModes: listSupportedVideoGenerationModes,
    summarizeCapabilities: summarizeVideoGenerationCapabilities,
  });
}

const videoGenerateTaskStatusActions = createMediaGenerateTaskStatusActions({
  inactiveText: "No active video generation task is currently running for this session.",
  findActiveTask: (sessionKey) => findActiveVideoGenerationTaskForSession(sessionKey) ?? undefined,
  buildStatusText: buildVideoGenerationTaskStatusText,
  buildStatusDetails: buildVideoGenerationTaskStatusDetails,
});

export function createVideoGenerateStatusActionResult(
  sessionKey?: string,
): VideoGenerateActionResult {
  return videoGenerateTaskStatusActions.createStatusActionResult(sessionKey);
>>>>>>> upstream/main
}

export function createVideoGenerateDuplicateGuardResult(
  sessionKey?: string,
<<<<<<< HEAD
): VideoGenerateActionResult | null {
  const activeTask = findActiveVideoGenerationTaskForSession(sessionKey);
  if (!activeTask) {
    return null;
=======
  params?: { prompt?: string; requestKey?: string },
): VideoGenerateActionResult | undefined {
  const blockingTask = findDuplicateGuardVideoGenerationTaskForSession(sessionKey, {
    prompt: params?.prompt,
    requestKey: params?.requestKey,
  });
  if (!blockingTask) {
    return undefined;
>>>>>>> upstream/main
  }
  return {
    content: [
      {
        type: "text",
<<<<<<< HEAD
        text: buildVideoGenerationTaskStatusText(activeTask, { duplicateGuard: true }),
=======
        text: buildVideoGenerationTaskStatusText(blockingTask, { duplicateGuard: true }),
>>>>>>> upstream/main
      },
    ],
    details: {
      action: "status",
      duplicateGuard: true,
<<<<<<< HEAD
      ...buildVideoGenerationTaskStatusDetails(activeTask),
=======
      ...buildVideoGenerationTaskStatusDetails(blockingTask),
>>>>>>> upstream/main
    },
  };
}
