<<<<<<< HEAD
import type { VoiceCallTtsConfig } from "./config.js";

=======
// Voice Call provider module implements model/runtime integration.
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import type { VoiceCallTtsConfig } from "./config.js";

// Resolves preferred voice settings from configured TTS provider blocks.

/** Read voice setting aliases from one provider-specific config block. */
>>>>>>> upstream/main
function resolveProviderVoiceSetting(providerConfig: unknown): string | undefined {
  if (!providerConfig || typeof providerConfig !== "object") {
    return undefined;
  }
  const candidate = providerConfig as {
<<<<<<< HEAD
    voice?: unknown;
    voiceId?: unknown;
  };
  if (typeof candidate.voice === "string" && candidate.voice.trim()) {
    return candidate.voice;
  }
  if (typeof candidate.voiceId === "string" && candidate.voiceId.trim()) {
    return candidate.voiceId;
  }
  return undefined;
}

=======
    speakerVoice?: unknown;
    speakerVoiceId?: unknown;
    voice?: unknown;
    voiceId?: unknown;
  };
  return (
    normalizeOptionalString(candidate.speakerVoice) ??
    normalizeOptionalString(candidate.speakerVoiceId) ??
    normalizeOptionalString(candidate.voice) ??
    normalizeOptionalString(candidate.voiceId)
  );
}

/** Resolve the active provider's preferred voice id/name from voice-call TTS config. */
>>>>>>> upstream/main
export function resolvePreferredTtsVoice(config: { tts?: VoiceCallTtsConfig }): string | undefined {
  const providerId = config.tts?.provider;
  if (!providerId) {
    return undefined;
  }
  return resolveProviderVoiceSetting(config.tts?.providers?.[providerId]);
}
