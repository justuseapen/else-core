<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
import { listRuntimeMusicGenerationProviders } from "../../music-generation/runtime.js";
import { getProviderEnvVars } from "../../secrets/provider-env-vars.js";
=======
/**
 * music_generate action helpers.
 *
 * Handles provider listing, task status, and duplicate-guard output for the music generation tool.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { listSupportedMusicGenerationModes } from "../../music-generation/capabilities.js";
import { listRuntimeMusicGenerationProviders } from "../../music-generation/runtime.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
>>>>>>> upstream/main
import {
  buildMusicGenerationTaskStatusDetails,
  buildMusicGenerationTaskStatusText,
  findActiveMusicGenerationTaskForSession,
<<<<<<< HEAD
} from "../music-generation-task-status.js";

type MusicGenerateActionResult = {
  content: Array<{ type: "text"; text: string }>;
  details: Record<string, unknown>;
};

function getMusicGenerationProviderAuthEnvVars(providerId: string): string[] {
  return getProviderEnvVars(providerId);
}

export function createMusicGenerateListActionResult(
  config?: OpenClawConfig,
): MusicGenerateActionResult {
  const providers = listRuntimeMusicGenerationProviders({ config });
  if (providers.length === 0) {
    return {
      content: [{ type: "text", text: "No music-generation providers are registered." }],
      details: { providers: [] },
    };
  }
  const lines = providers.map((provider) => {
    const authHints = getMusicGenerationProviderAuthEnvVars(provider.id);
    const capabilities = [
      provider.capabilities.maxTracks ? `maxTracks=${provider.capabilities.maxTracks}` : null,
      provider.capabilities.maxInputImages
        ? `maxInputImages=${provider.capabilities.maxInputImages}`
        : null,
      provider.capabilities.maxDurationSeconds
        ? `maxDurationSeconds=${provider.capabilities.maxDurationSeconds}`
        : null,
      provider.capabilities.supportsLyrics ? "lyrics" : null,
      provider.capabilities.supportsInstrumental ? "instrumental" : null,
      provider.capabilities.supportsDuration ? "duration" : null,
      provider.capabilities.supportsFormat ? "format" : null,
      provider.capabilities.supportedFormats?.length
        ? `supportedFormats=${provider.capabilities.supportedFormats.join("/")}`
        : null,
      provider.capabilities.supportedFormatsByModel &&
      Object.keys(provider.capabilities.supportedFormatsByModel).length > 0
        ? `supportedFormatsByModel=${Object.entries(provider.capabilities.supportedFormatsByModel)
            .map(([modelId, formats]) => `${modelId}:${formats.join("/")}`)
            .join("; ")}`
        : null,
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
        authEnvVars: getMusicGenerationProviderAuthEnvVars(provider.id),
        capabilities: provider.capabilities,
      })),
    },
  };
}

export function createMusicGenerateStatusActionResult(
  sessionKey?: string,
): MusicGenerateActionResult {
  const activeTask = findActiveMusicGenerationTaskForSession(sessionKey);
  if (!activeTask) {
    return {
      content: [
        {
          type: "text",
          text: "No active music generation task is currently running for this session.",
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
        text: buildMusicGenerationTaskStatusText(activeTask),
      },
    ],
    details: {
      action: "status",
      ...buildMusicGenerationTaskStatusDetails(activeTask),
    },
  };
}

export function createMusicGenerateDuplicateGuardResult(
  sessionKey?: string,
): MusicGenerateActionResult | null {
  const activeTask = findActiveMusicGenerationTaskForSession(sessionKey);
  if (!activeTask) {
    return null;
=======
  findDuplicateGuardMusicGenerationTaskForSession,
} from "../music-generation-task-status.js";
import {
  createMediaGenerateProviderListActionResult,
  createMediaGenerateTaskStatusActions,
  type MediaGenerateActionResult,
} from "./media-generate-tool-actions-shared.js";

type MusicGenerateActionResult = MediaGenerateActionResult;

/** Formats provider capability details for the music generation `list` action. */
function summarizeMusicGenerationCapabilities(
  provider: ReturnType<typeof listRuntimeMusicGenerationProviders>[number],
): string {
  const supportedModes = listSupportedMusicGenerationModes(provider);
  const generate = provider.capabilities.generate;
  const edit = provider.capabilities.edit;
  const capabilities = [
    supportedModes.length > 0 ? `modes=${supportedModes.join("/")}` : null,
    generate?.maxTracks ? `maxTracks=${generate.maxTracks}` : null,
    edit?.maxInputImages ? `maxInputImages=${edit.maxInputImages}` : null,
    generate?.maxDurationSeconds ? `maxDurationSeconds=${generate.maxDurationSeconds}` : null,
    generate?.supportsLyrics ? "lyrics" : null,
    generate?.supportsLyricsByModel && Object.keys(generate.supportsLyricsByModel).length > 0
      ? `supportsLyricsByModel=${Object.entries(generate.supportsLyricsByModel)
          .map(([modelId, supported]) => `${modelId}:${supported}`)
          .join("; ")}`
      : null,
    generate?.supportsInstrumental ? "instrumental" : null,
    generate?.supportsInstrumentalByModel &&
    Object.keys(generate.supportsInstrumentalByModel).length > 0
      ? `supportsInstrumentalByModel=${Object.entries(generate.supportsInstrumentalByModel)
          .map(([modelId, supported]) => `${modelId}:${supported}`)
          .join("; ")}`
      : null,
    generate?.supportsDuration ? "duration" : null,
    generate?.supportsFormat ? "format" : null,
    generate?.supportedFormats?.length
      ? `supportedFormats=${generate.supportedFormats.join("/")}`
      : null,
    generate?.supportedFormatsByModel && Object.keys(generate.supportedFormatsByModel).length > 0
      ? `supportedFormatsByModel=${Object.entries(generate.supportedFormatsByModel)
          .map(([modelId, formats]) => `${modelId}:${formats.join("/")}`)
          .join("; ")}`
      : null,
  ]
    .filter((entry): entry is string => Boolean(entry))
    .join(", ");
  return capabilities;
}

/** Builds the music-generation provider listing result shown to the agent. */
export function createMusicGenerateListActionResult(
  config?: OpenClawConfig,
  options?: { workspaceDir?: string; agentDir?: string; authStore?: AuthProfileStore },
): MusicGenerateActionResult {
  const providers = listRuntimeMusicGenerationProviders({ config });
  return createMediaGenerateProviderListActionResult({
    kind: "music_generation",
    providers,
    emptyText: "No music-generation providers are registered.",
    cfg: config,
    workspaceDir: options?.workspaceDir,
    agentDir: options?.agentDir,
    authStore: options?.authStore,
    listModes: listSupportedMusicGenerationModes,
    summarizeCapabilities: summarizeMusicGenerationCapabilities,
  });
}

const musicGenerateTaskStatusActions = createMediaGenerateTaskStatusActions({
  inactiveText: "No active music generation task is currently running for this session.",
  findActiveTask: (sessionKey) => findActiveMusicGenerationTaskForSession(sessionKey) ?? undefined,
  buildStatusText: buildMusicGenerationTaskStatusText,
  buildStatusDetails: buildMusicGenerationTaskStatusDetails,
});

/** Builds status output for the active music-generation task in the current session. */
export function createMusicGenerateStatusActionResult(
  sessionKey?: string,
): MusicGenerateActionResult {
  return musicGenerateTaskStatusActions.createStatusActionResult(sessionKey);
}

/** Returns duplicate-guard status output when a matching music task is already active. */
export function createMusicGenerateDuplicateGuardResult(
  sessionKey?: string,
  params?: { prompt?: string; requestKey?: string },
): MusicGenerateActionResult | undefined {
  const blockingTask = findDuplicateGuardMusicGenerationTaskForSession(sessionKey, {
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
        text: buildMusicGenerationTaskStatusText(activeTask, { duplicateGuard: true }),
=======
        text: buildMusicGenerationTaskStatusText(blockingTask, { duplicateGuard: true }),
>>>>>>> upstream/main
      },
    ],
    details: {
      action: "status",
      duplicateGuard: true,
<<<<<<< HEAD
      ...buildMusicGenerationTaskStatusDetails(activeTask),
=======
      ...buildMusicGenerationTaskStatusDetails(blockingTask),
>>>>>>> upstream/main
    },
  };
}
