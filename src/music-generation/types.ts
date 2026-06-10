<<<<<<< HEAD
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { OpenClawConfig } from "../config/config.js";

export type MusicGenerationOutputFormat = "mp3" | "wav";

=======
// Shared music generation request, response, and provider type contracts.
import type { MediaNormalizationEntry } from "../../packages/media-generation-core/src/normalization.js";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";

/**
 * Public music generation provider contracts.
 *
 * Providers implement these request/result/capability shapes so the core
 * runtime can normalize prompts, options, assets, and fallback diagnostics.
 */
/** Audio output formats currently understood by music generation providers. */
export type MusicGenerationOutputFormat = "mp3" | "wav";

/** In-memory audio asset returned from a music generation provider. */
>>>>>>> upstream/main
export type GeneratedMusicAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};

<<<<<<< HEAD
=======
/** Optional source image passed to image-conditioned music edit models. */
>>>>>>> upstream/main
export type MusicGenerationSourceImage = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};

<<<<<<< HEAD
export type MusicGenerationProviderConfiguredContext = {
=======
type MusicGenerationProviderConfiguredContext = {
>>>>>>> upstream/main
  cfg?: OpenClawConfig;
  agentDir?: string;
};

<<<<<<< HEAD
=======
/** Provider request after runtime fallback and override normalization. */
>>>>>>> upstream/main
export type MusicGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
};

<<<<<<< HEAD
=======
/** Provider result before runtime fallback metadata is attached. */
>>>>>>> upstream/main
export type MusicGenerationResult = {
  tracks: GeneratedMusicAsset[];
  model?: string;
  lyrics?: string[];
  metadata?: Record<string, unknown>;
};

<<<<<<< HEAD
=======
/** Caller override dropped because the selected provider/model does not support it. */
>>>>>>> upstream/main
export type MusicGenerationIgnoredOverride = {
  key: "lyrics" | "instrumental" | "durationSeconds" | "format";
  value: string | boolean | number;
};

<<<<<<< HEAD
export type MusicGenerationProviderCapabilities = {
  maxTracks?: number;
  maxInputImages?: number;
  maxDurationSeconds?: number;
  supportsLyrics?: boolean;
  supportsInstrumental?: boolean;
=======
/** Active music generation request mode. */
export type MusicGenerationMode = "generate" | "edit";

/** Capability block for prompt-only music generation. */
export type MusicGenerationModeCapabilities = {
  maxTracks?: number;
  maxDurationSeconds?: number;
  supportsLyrics?: boolean;
  supportsLyricsByModel?: Readonly<Record<string, boolean>>;
  supportsInstrumental?: boolean;
  supportsInstrumentalByModel?: Readonly<Record<string, boolean>>;
>>>>>>> upstream/main
  supportsDuration?: boolean;
  supportsFormat?: boolean;
  supportedFormats?: readonly MusicGenerationOutputFormat[];
  supportedFormatsByModel?: Readonly<Record<string, readonly MusicGenerationOutputFormat[]>>;
};

<<<<<<< HEAD
=======
/** Capability block for image-conditioned music generation. */
export type MusicGenerationEditCapabilities = MusicGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
};

/** Provider capability declaration, including optional mode-specific overrides. */
export type MusicGenerationProviderCapabilities = MusicGenerationModeCapabilities & {
  maxInputImages?: number;
  generate?: MusicGenerationModeCapabilities;
  edit?: MusicGenerationEditCapabilities;
};

/** Normalization metadata attached to runtime results. */
export type MusicGenerationNormalization = {
  durationSeconds?: MediaNormalizationEntry<number>;
};

/** Provider implementation contract consumed by the music generation runtime. */
>>>>>>> upstream/main
export type MusicGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  models?: string[];
  capabilities: MusicGenerationProviderCapabilities;
  isConfigured?: (ctx: MusicGenerationProviderConfiguredContext) => boolean;
  generateMusic: (req: MusicGenerationRequest) => Promise<MusicGenerationResult>;
};
