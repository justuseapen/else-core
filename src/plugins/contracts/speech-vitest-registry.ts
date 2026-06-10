<<<<<<< HEAD
import { createJiti } from "jiti";
import { loadBundledCapabilityRuntimeRegistry } from "../bundled-capability-runtime.js";
import { resolveBundledPluginRepoEntryPath } from "../bundled-plugin-metadata.js";
import { createCapturedPluginRegistration } from "../captured-registration.js";
import type { OpenClawPluginDefinition } from "../types.js";
import type {
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
=======
// Speech Vitest registry helpers load speech capability runtimes for contract tests.
import { loadBundledCapabilityRuntimeRegistry } from "../bundled-capability-runtime.js";
import type {
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  TranscriptSourceProvider,
>>>>>>> upstream/main
  MusicGenerationProviderPlugin,
  RealtimeTranscriptionProviderPlugin,
  RealtimeVoiceProviderPlugin,
  SpeechProviderPlugin,
  VideoGenerationProviderPlugin,
} from "../types.js";
import { BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS } from "./inventory/bundled-capability-metadata.js";

export type SpeechProviderContractEntry = {
  pluginId: string;
  provider: SpeechProviderPlugin;
};

export type MediaUnderstandingProviderContractEntry = {
  pluginId: string;
  provider: MediaUnderstandingProviderPlugin;
};

<<<<<<< HEAD
=======
export type TranscriptsSourceProviderContractEntry = {
  pluginId: string;
  provider: TranscriptSourceProvider;
};

>>>>>>> upstream/main
export type RealtimeVoiceProviderContractEntry = {
  pluginId: string;
  provider: RealtimeVoiceProviderPlugin;
};

export type RealtimeTranscriptionProviderContractEntry = {
  pluginId: string;
  provider: RealtimeTranscriptionProviderPlugin;
};

export type ImageGenerationProviderContractEntry = {
  pluginId: string;
  provider: ImageGenerationProviderPlugin;
};

export type VideoGenerationProviderContractEntry = {
  pluginId: string;
  provider: VideoGenerationProviderPlugin;
};

export type MusicGenerationProviderContractEntry = {
  pluginId: string;
  provider: MusicGenerationProviderPlugin;
};

type ManifestContractKey =
  | "imageGenerationProviders"
  | "speechProviders"
  | "mediaUnderstandingProviders"
<<<<<<< HEAD
=======
  | "transcriptSourceProviders"
>>>>>>> upstream/main
  | "realtimeVoiceProviders"
  | "realtimeTranscriptionProviders"
  | "videoGenerationProviders"
  | "musicGenerationProviders";

const VITEST_CONTRACT_PLUGIN_IDS = {
  imageGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.imageGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  speechProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.speechProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  mediaUnderstandingProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.mediaUnderstandingProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
<<<<<<< HEAD
=======
  transcriptSourceProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.transcriptSourceProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
>>>>>>> upstream/main
  realtimeVoiceProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.realtimeVoiceProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  realtimeTranscriptionProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.realtimeTranscriptionProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  videoGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.videoGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  musicGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.musicGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
} satisfies Record<ManifestContractKey, string[]>;

function loadVitestVideoGenerationFallbackEntries(
  pluginIds: readonly string[],
): VideoGenerationProviderContractEntry[] {
<<<<<<< HEAD
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    moduleCache: false,
    fsCache: false,
  });
  const repoRoot = process.cwd();
  return pluginIds.flatMap((pluginId) => {
    const modulePath = resolveBundledPluginRepoEntryPath({
      rootDir: repoRoot,
      pluginId,
      preferBuilt: true,
    });
    if (!modulePath) {
      return [];
    }
    try {
      const mod = jiti(modulePath) as
        | OpenClawPluginDefinition
        | { default?: OpenClawPluginDefinition };
      const plugin =
        (mod as { default?: OpenClawPluginDefinition }).default ??
        (mod as OpenClawPluginDefinition);
      if (typeof plugin?.register !== "function") {
        return [];
      }
      const captured = createCapturedPluginRegistration();
      void plugin.register(captured.api);
      return captured.videoGenerationProviders.map((provider) => ({
        pluginId,
        provider,
      }));
    } catch {
      return [];
    }
  });
}

function loadVitestCapabilityContractEntries<T>(params: {
  contract: ManifestContractKey;
=======
  return loadVitestCapabilityContractEntries({
    contract: "videoGenerationProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.videoGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function loadVitestMusicGenerationFallbackEntries(
  pluginIds: readonly string[],
): MusicGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "musicGenerationProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.musicGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function loadVitestSpeechFallbackEntries(
  pluginIds: readonly string[],
): SpeechProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "speechProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.speechProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function hasExplicitVideoGenerationModes(provider: VideoGenerationProviderPlugin): boolean {
  return Boolean(
    provider.capabilities.generate &&
    provider.capabilities.imageToVideo &&
    provider.capabilities.videoToVideo,
  );
}

function hasExplicitMusicGenerationModes(provider: MusicGenerationProviderPlugin): boolean {
  return Boolean(provider.capabilities.generate && provider.capabilities.edit);
}

function loadVitestCapabilityContractEntries<T>(params: {
  contract: ManifestContractKey;
  pluginIds?: readonly string[];
  pluginSdkResolution?: "dist" | "src";
>>>>>>> upstream/main
  pickEntries: (registry: ReturnType<typeof loadBundledCapabilityRuntimeRegistry>) => Array<{
    pluginId: string;
    provider: T;
  }>;
}): Array<{ pluginId: string; provider: T }> {
<<<<<<< HEAD
  const pluginIds = VITEST_CONTRACT_PLUGIN_IDS[params.contract];
=======
  const pluginIds = [...(params.pluginIds ?? VITEST_CONTRACT_PLUGIN_IDS[params.contract])];
>>>>>>> upstream/main
  if (pluginIds.length === 0) {
    return [];
  }
  const bulkEntries = params.pickEntries(
    loadBundledCapabilityRuntimeRegistry({
      pluginIds,
<<<<<<< HEAD
      pluginSdkResolution: "dist",
=======
      pluginSdkResolution: params.pluginSdkResolution ?? "dist",
>>>>>>> upstream/main
    }),
  );
  const coveredPluginIds = new Set(bulkEntries.map((entry) => entry.pluginId));
  if (coveredPluginIds.size === pluginIds.length) {
    return bulkEntries;
  }
  return pluginIds.flatMap((pluginId) =>
    params
      .pickEntries(
        loadBundledCapabilityRuntimeRegistry({
          pluginIds: [pluginId],
<<<<<<< HEAD
          pluginSdkResolution: "dist",
=======
          pluginSdkResolution: params.pluginSdkResolution ?? "dist",
>>>>>>> upstream/main
        }),
      )
      .filter((entry) => entry.pluginId === pluginId),
  );
}

export function loadVitestSpeechProviderContractRegistry(): SpeechProviderContractEntry[] {
<<<<<<< HEAD
  return loadVitestCapabilityContractEntries({
=======
  const entries = loadVitestCapabilityContractEntries({
>>>>>>> upstream/main
    contract: "speechProviders",
    pickEntries: (registry) =>
      registry.speechProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
<<<<<<< HEAD
=======
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.speechProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId),
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
  const replacementEntries = loadVitestSpeechFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
>>>>>>> upstream/main
}

export function loadVitestMediaUnderstandingProviderContractRegistry(): MediaUnderstandingProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "mediaUnderstandingProviders",
    pickEntries: (registry) =>
      registry.mediaUnderstandingProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

<<<<<<< HEAD
=======
export function loadVitestTranscriptsSourceProviderContractRegistry(): TranscriptsSourceProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "transcriptSourceProviders",
    pluginSdkResolution: "src",
    pickEntries: (registry) =>
      registry.transcriptSourceProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

>>>>>>> upstream/main
export function loadVitestRealtimeVoiceProviderContractRegistry(): RealtimeVoiceProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "realtimeVoiceProviders",
    pickEntries: (registry) =>
      registry.realtimeVoiceProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

export function loadVitestRealtimeTranscriptionProviderContractRegistry(): RealtimeTranscriptionProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "realtimeTranscriptionProviders",
    pickEntries: (registry) =>
      registry.realtimeTranscriptionProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

export function loadVitestImageGenerationProviderContractRegistry(): ImageGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "imageGenerationProviders",
    pickEntries: (registry) =>
      registry.imageGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

export function loadVitestVideoGenerationProviderContractRegistry(): VideoGenerationProviderContractEntry[] {
  const entries = loadVitestCapabilityContractEntries({
    contract: "videoGenerationProviders",
    pickEntries: (registry) =>
      registry.videoGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
<<<<<<< HEAD
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.videoGenerationProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId),
=======
  const stalePluginIds = new Set(
    entries
      .filter((entry) => !hasExplicitVideoGenerationModes(entry.provider))
      .map((entry) => entry.pluginId),
  );
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.videoGenerationProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId) || stalePluginIds.has(pluginId),
>>>>>>> upstream/main
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
<<<<<<< HEAD
  return [...entries, ...loadVitestVideoGenerationFallbackEntries(missingPluginIds)];
}

export function loadVitestMusicGenerationProviderContractRegistry(): MusicGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
=======
  const replacementEntries = loadVitestVideoGenerationFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
}

export function loadVitestMusicGenerationProviderContractRegistry(): MusicGenerationProviderContractEntry[] {
  const entries = loadVitestCapabilityContractEntries({
>>>>>>> upstream/main
    contract: "musicGenerationProviders",
    pickEntries: (registry) =>
      registry.musicGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
<<<<<<< HEAD
=======
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
  const stalePluginIds = new Set(
    entries
      .filter((entry) => !hasExplicitMusicGenerationModes(entry.provider))
      .map((entry) => entry.pluginId),
  );
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.musicGenerationProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId) || stalePluginIds.has(pluginId),
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
  const replacementEntries = loadVitestMusicGenerationFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
>>>>>>> upstream/main
}
