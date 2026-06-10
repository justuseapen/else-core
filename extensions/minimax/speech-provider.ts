<<<<<<< HEAD
=======
// Minimax provider module implements model/runtime integration.
import { transcodeAudioBufferToOpus } from "openclaw/plugin-sdk/media-runtime";
import {
  isProviderAuthProfileConfigured,
  type OpenClawConfig,
  resolveProviderAuthProfileApiKey,
} from "openclaw/plugin-sdk/provider-auth";
>>>>>>> upstream/main
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import type {
  SpeechDirectiveTokenParseContext,
  SpeechProviderConfig,
  SpeechProviderOverrides,
  SpeechProviderPlugin,
} from "openclaw/plugin-sdk/speech-core";
import {
<<<<<<< HEAD
=======
  asObject,
  parseSpeechDirectiveNumberOverride,
  trimToUndefined,
} from "openclaw/plugin-sdk/speech-core";
import { asFiniteNumberInRange } from "openclaw/plugin-sdk/string-coerce-runtime";
import {
>>>>>>> upstream/main
  DEFAULT_MINIMAX_TTS_BASE_URL,
  MINIMAX_TTS_MODELS,
  MINIMAX_TTS_VOICES,
  minimaxTTS,
  normalizeMinimaxTtsBaseUrl,
} from "./tts.js";

<<<<<<< HEAD
=======
const MINIMAX_PORTAL_PROVIDER_ID = "minimax-portal";
const MINIMAX_TOKEN_PLAN_ENV_VARS = [
  "MINIMAX_OAUTH_TOKEN",
  "MINIMAX_CODE_PLAN_KEY",
  "MINIMAX_CODING_API_KEY",
] as const;

>>>>>>> upstream/main
type MinimaxTtsProviderConfig = {
  apiKey?: string;
  baseUrl: string;
  model: string;
  voiceId: string;
  speed?: number;
  vol?: number;
  pitch?: number;
};

type MinimaxTtsProviderOverrides = {
  model?: string;
  voiceId?: string;
  speed?: number;
  vol?: number;
  pitch?: number;
};

<<<<<<< HEAD
function trimToUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
=======
function resolveConfiguredPortalTtsBaseUrl(cfg: OpenClawConfig | undefined): string | undefined {
  const providers = asObject(asObject(cfg?.models)?.providers);
  const portalProvider = asObject(providers?.[MINIMAX_PORTAL_PROVIDER_ID]);
  const portalBaseUrl = trimToUndefined(portalProvider?.baseUrl);
  return portalBaseUrl ? normalizeMinimaxTtsBaseUrl(portalBaseUrl) : undefined;
}

function resolveMinimaxTokenPlanEnvKey(): string | undefined {
  for (const envVar of MINIMAX_TOKEN_PLAN_ENV_VARS) {
    const value = trimToUndefined(process.env[envVar]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

async function resolveMinimaxPortalProfileToken(
  cfg: OpenClawConfig | undefined,
): Promise<string | undefined> {
  return await resolveProviderAuthProfileApiKey({
    cfg,
    provider: MINIMAX_PORTAL_PROVIDER_ID,
  });
}

async function resolveMinimaxTtsApiKey(params: {
  cfg: OpenClawConfig | undefined;
  configApiKey?: string;
}): Promise<string | undefined> {
  return (
    params.configApiKey ??
    (await resolveMinimaxPortalProfileToken(params.cfg)) ??
    resolveMinimaxTokenPlanEnvKey() ??
    trimToUndefined(process.env.MINIMAX_API_KEY)
  );
>>>>>>> upstream/main
}

function normalizeMinimaxProviderConfig(
  rawConfig: Record<string, unknown>,
<<<<<<< HEAD
=======
  cfg?: OpenClawConfig,
>>>>>>> upstream/main
): MinimaxTtsProviderConfig {
  const providers = asObject(rawConfig.providers);
  const raw = asObject(providers?.minimax) ?? asObject(rawConfig.minimax);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "messages.tts.providers.minimax.apiKey",
    }),
    baseUrl: normalizeMinimaxTtsBaseUrl(
      trimToUndefined(raw?.baseUrl) ??
        trimToUndefined(process.env.MINIMAX_API_HOST) ??
<<<<<<< HEAD
=======
        resolveConfiguredPortalTtsBaseUrl(cfg) ??
>>>>>>> upstream/main
        DEFAULT_MINIMAX_TTS_BASE_URL,
    ),
    model:
      trimToUndefined(raw?.model) ??
      trimToUndefined(process.env.MINIMAX_TTS_MODEL) ??
      "speech-2.8-hd",
    voiceId:
      trimToUndefined(raw?.voiceId) ??
      trimToUndefined(process.env.MINIMAX_TTS_VOICE_ID) ??
      "English_expressive_narrator",
<<<<<<< HEAD
    speed: asNumber(raw?.speed),
    vol: asNumber(raw?.vol),
    pitch: asNumber(raw?.pitch),
  };
}

function readMinimaxProviderConfig(config: SpeechProviderConfig): MinimaxTtsProviderConfig {
  const normalized = normalizeMinimaxProviderConfig({});
  return {
    apiKey: trimToUndefined(config.apiKey) ?? normalized.apiKey,
    baseUrl: trimToUndefined(config.baseUrl) ?? normalized.baseUrl,
    model: trimToUndefined(config.model) ?? normalized.model,
    voiceId: trimToUndefined(config.voiceId) ?? normalized.voiceId,
    speed: asNumber(config.speed) ?? normalized.speed,
    vol: asNumber(config.vol) ?? normalized.vol,
    pitch: asNumber(config.pitch) ?? normalized.pitch,
=======
    speed: normalizeMinimaxSpeed(raw?.speed),
    vol: normalizeMinimaxVolume(raw?.vol),
    pitch: normalizeMinimaxPitch(raw?.pitch),
  };
}

function normalizeMinimaxSpeed(value: unknown): number | undefined {
  return asFiniteNumberInRange(value, { min: 0.5, max: 2 });
}

function normalizeMinimaxVolume(value: unknown): number | undefined {
  return asFiniteNumberInRange(value, { min: 0, max: 10, minExclusive: true });
}

function normalizeMinimaxPitch(value: unknown): number | undefined {
  const pitch = asFiniteNumberInRange(value, { min: -12, max: 12 });
  return pitch !== undefined ? Math.trunc(pitch) : undefined;
}

function readMinimaxProviderConfig(
  config: SpeechProviderConfig,
  cfg?: OpenClawConfig,
): MinimaxTtsProviderConfig {
  const normalized = normalizeMinimaxProviderConfig({}, cfg);
  return {
    apiKey: trimToUndefined(config.apiKey) ?? normalized.apiKey,
    baseUrl: normalizeMinimaxTtsBaseUrl(trimToUndefined(config.baseUrl) ?? normalized.baseUrl),
    model: trimToUndefined(config.model) ?? normalized.model,
    voiceId: trimToUndefined(config.voiceId) ?? normalized.voiceId,
    speed: normalizeMinimaxSpeed(config.speed) ?? normalized.speed,
    vol: normalizeMinimaxVolume(config.vol) ?? normalized.vol,
    pitch: normalizeMinimaxPitch(config.pitch) ?? normalized.pitch,
>>>>>>> upstream/main
  };
}

function readMinimaxOverrides(
  overrides: SpeechProviderOverrides | undefined,
): MinimaxTtsProviderOverrides {
  if (!overrides) {
    return {};
  }
  return {
    model: trimToUndefined(overrides.model),
    voiceId: trimToUndefined(overrides.voiceId),
<<<<<<< HEAD
    speed: asNumber(overrides.speed),
    vol: asNumber(overrides.vol),
    pitch: asNumber(overrides.pitch),
=======
    speed: normalizeMinimaxSpeed(overrides.speed),
    vol: normalizeMinimaxVolume(overrides.vol),
    pitch: normalizeMinimaxPitch(overrides.pitch),
>>>>>>> upstream/main
  };
}

function parseDirectiveToken(ctx: SpeechDirectiveTokenParseContext): {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
} {
  switch (ctx.key) {
    case "voice":
    case "voiceid":
    case "voice_id":
    case "minimax_voice":
    case "minimaxvoice":
      if (!ctx.policy.allowVoice) {
        return { handled: true };
      }
      return { handled: true, overrides: { voiceId: ctx.value } };
    case "model":
    case "minimax_model":
    case "minimaxmodel":
      if (!ctx.policy.allowModelId) {
        return { handled: true };
      }
      return { handled: true, overrides: { model: ctx.value } };
    case "speed": {
<<<<<<< HEAD
      if (!ctx.policy.allowVoiceSettings) {
        return { handled: true };
      }
      const speed = Number(ctx.value);
      if (!Number.isFinite(speed) || speed < 0.5 || speed > 2.0) {
        return { handled: true, warnings: [`invalid MiniMax speed "${ctx.value}" (0.5-2.0)`] };
      }
      return { handled: true, overrides: { speed } };
    }
    case "vol":
    case "volume": {
      if (!ctx.policy.allowVoiceSettings) {
        return { handled: true };
      }
      const vol = Number(ctx.value);
      if (!Number.isFinite(vol) || vol <= 0 || vol > 10) {
        return {
          handled: true,
          warnings: [`invalid MiniMax volume "${ctx.value}" (0-10, exclusive)`],
        };
      }
      return { handled: true, overrides: { vol } };
    }
    case "pitch": {
      if (!ctx.policy.allowVoiceSettings) {
        return { handled: true };
      }
      const pitch = Number(ctx.value);
      if (!Number.isFinite(pitch) || pitch < -12 || pitch > 12) {
        return { handled: true, warnings: [`invalid MiniMax pitch "${ctx.value}" (-12 to 12)`] };
      }
      return { handled: true, overrides: { pitch } };
=======
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "speed",
        range: { min: 0.5, max: 2 },
        warning: (value) => `invalid MiniMax speed "${value}" (0.5-2.0)`,
      });
    }
    case "vol":
    case "volume": {
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "vol",
        range: { min: 0, minExclusive: true, max: 10 },
        warning: (value) => `invalid MiniMax volume "${value}" (0-10, exclusive)`,
      });
    }
    case "pitch": {
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "pitch",
        range: { min: -12, max: 12 },
        warning: (value) => `invalid MiniMax pitch "${value}" (-12 to 12)`,
      });
>>>>>>> upstream/main
    }
    default:
      return { handled: false };
  }
}

export function buildMinimaxSpeechProvider(): SpeechProviderPlugin {
  return {
    id: "minimax",
    label: "MiniMax",
    autoSelectOrder: 40,
<<<<<<< HEAD
    models: MINIMAX_TTS_MODELS,
    voices: MINIMAX_TTS_VOICES,
    resolveConfig: ({ rawConfig }) => normalizeMinimaxProviderConfig(rawConfig),
=======
    defaultModel: MINIMAX_TTS_MODELS[0],
    models: MINIMAX_TTS_MODELS,
    voices: MINIMAX_TTS_VOICES,
    resolveConfig: ({ rawConfig, cfg }) => normalizeMinimaxProviderConfig(rawConfig, cfg),
>>>>>>> upstream/main
    parseDirectiveToken,
    resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
      const base = normalizeMinimaxProviderConfig(baseTtsConfig);
      return {
        ...base,
        ...(talkProviderConfig.apiKey === undefined
          ? {}
          : {
              apiKey: normalizeResolvedSecretInputString({
                value: talkProviderConfig.apiKey,
                path: "talk.providers.minimax.apiKey",
              }),
            }),
        ...(trimToUndefined(talkProviderConfig.baseUrl) == null
          ? {}
          : { baseUrl: normalizeMinimaxTtsBaseUrl(trimToUndefined(talkProviderConfig.baseUrl)) }),
        ...(trimToUndefined(talkProviderConfig.modelId) == null
          ? {}
          : { model: trimToUndefined(talkProviderConfig.modelId) }),
        ...(trimToUndefined(talkProviderConfig.voiceId) == null
          ? {}
          : { voiceId: trimToUndefined(talkProviderConfig.voiceId) }),
<<<<<<< HEAD
        ...(asNumber(talkProviderConfig.speed) == null
          ? {}
          : { speed: asNumber(talkProviderConfig.speed) }),
        ...(asNumber(talkProviderConfig.vol) == null
          ? {}
          : { vol: asNumber(talkProviderConfig.vol) }),
        ...(asNumber(talkProviderConfig.pitch) == null
          ? {}
          : { pitch: asNumber(talkProviderConfig.pitch) }),
=======
        ...(normalizeMinimaxSpeed(talkProviderConfig.speed) == null
          ? {}
          : { speed: normalizeMinimaxSpeed(talkProviderConfig.speed) }),
        ...(normalizeMinimaxVolume(talkProviderConfig.vol) == null
          ? {}
          : { vol: normalizeMinimaxVolume(talkProviderConfig.vol) }),
        ...(normalizeMinimaxPitch(talkProviderConfig.pitch) == null
          ? {}
          : { pitch: normalizeMinimaxPitch(talkProviderConfig.pitch) }),
>>>>>>> upstream/main
      };
    },
    resolveTalkOverrides: ({ params }) => ({
      ...(trimToUndefined(params.voiceId) == null
        ? {}
        : { voiceId: trimToUndefined(params.voiceId) }),
      ...(trimToUndefined(params.modelId) == null
        ? {}
        : { model: trimToUndefined(params.modelId) }),
<<<<<<< HEAD
      ...(asNumber(params.speed) == null ? {} : { speed: asNumber(params.speed) }),
      ...(asNumber(params.vol) == null ? {} : { vol: asNumber(params.vol) }),
      ...(asNumber(params.pitch) == null ? {} : { pitch: asNumber(params.pitch) }),
    }),
    listVoices: async () => MINIMAX_TTS_VOICES.map((voice) => ({ id: voice, name: voice })),
    isConfigured: ({ providerConfig }) =>
      Boolean(readMinimaxProviderConfig(providerConfig).apiKey || process.env.MINIMAX_API_KEY),
    synthesize: async (req) => {
      const config = readMinimaxProviderConfig(req.providerConfig);
      const overrides = readMinimaxOverrides(req.providerOverrides);
      const apiKey = config.apiKey || process.env.MINIMAX_API_KEY;
      if (!apiKey) {
        throw new Error("MiniMax API key missing");
=======
      ...(normalizeMinimaxSpeed(params.speed) == null
        ? {}
        : { speed: normalizeMinimaxSpeed(params.speed) }),
      ...(normalizeMinimaxVolume(params.vol) == null
        ? {}
        : { vol: normalizeMinimaxVolume(params.vol) }),
      ...(normalizeMinimaxPitch(params.pitch) == null
        ? {}
        : { pitch: normalizeMinimaxPitch(params.pitch) }),
    }),
    listVoices: async () => MINIMAX_TTS_VOICES.map((voice) => ({ id: voice, name: voice })),
    isConfigured: ({ cfg, providerConfig }) =>
      Boolean(
        readMinimaxProviderConfig(providerConfig, cfg).apiKey ||
        isProviderAuthProfileConfigured({ cfg, provider: MINIMAX_PORTAL_PROVIDER_ID }) ||
        resolveMinimaxTokenPlanEnvKey() ||
        process.env.MINIMAX_API_KEY,
      ),
    synthesize: async (req) => {
      const config = readMinimaxProviderConfig(req.providerConfig, req.cfg);
      const overrides = readMinimaxOverrides(req.providerOverrides);
      const apiKey = await resolveMinimaxTtsApiKey({
        cfg: req.cfg,
        configApiKey: config.apiKey,
      });
      if (!apiKey) {
        throw new Error("MiniMax TTS auth missing");
>>>>>>> upstream/main
      }
      const audioBuffer = await minimaxTTS({
        text: req.text,
        apiKey,
        baseUrl: config.baseUrl,
        model: overrides.model ?? config.model,
        voiceId: overrides.voiceId ?? config.voiceId,
        speed: overrides.speed ?? config.speed,
        vol: overrides.vol ?? config.vol,
        pitch: overrides.pitch ?? config.pitch,
        timeoutMs: req.timeoutMs,
      });
<<<<<<< HEAD
=======
      if (req.target === "voice-note") {
        const opusBuffer = await transcodeAudioBufferToOpus({
          audioBuffer,
          inputExtension: "mp3",
          tempPrefix: "tts-minimax-",
          timeoutMs: req.timeoutMs,
        });
        return {
          audioBuffer: opusBuffer,
          outputFormat: "opus",
          fileExtension: ".opus",
          voiceCompatible: true,
        };
      }
>>>>>>> upstream/main
      return {
        audioBuffer,
        outputFormat: "mp3",
        fileExtension: ".mp3",
        voiceCompatible: false,
      };
    },
  };
}
