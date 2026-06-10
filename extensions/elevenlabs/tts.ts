// Elevenlabs plugin module implements tts behavior.
import {
  assertOkOrThrowProviderError,
  assertProviderBinaryResponseContent,
  readProviderBinaryResponse,
} from "openclaw/plugin-sdk/provider-http";
import {
  asObject,
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  readResponseTextLimited,
  requireInRange,
<<<<<<< HEAD
  trimToUndefined,
  truncateErrorDetail,
} from "openclaw/plugin-sdk/speech";

const DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";

function isValidVoiceId(voiceId: string): boolean {
  return /^[a-zA-Z0-9]{10,40}$/.test(voiceId);
}

function normalizeElevenLabsBaseUrl(baseUrl?: string): string {
  const trimmed = baseUrl?.trim();
  if (!trimmed) {
    return DEFAULT_ELEVENLABS_BASE_URL;
  }
  return trimmed.replace(/\/+$/, "");
}
=======
} from "openclaw/plugin-sdk/speech";
import {
  fetchWithSsrFGuard,
  ssrfPolicyFromHttpBaseUrlAllowedHostname,
} from "openclaw/plugin-sdk/ssrf-runtime";
import { isValidElevenLabsVoiceId, normalizeElevenLabsBaseUrl } from "./shared.js";
>>>>>>> upstream/main

function formatElevenLabsErrorPayload(payload: unknown): string | undefined {
  const root = asObject(payload);
  if (!root) {
    return undefined;
  }
  const detailObject = asObject(root.detail);
  const message =
    trimToUndefined(root.message) ??
    trimToUndefined(detailObject?.message) ??
    trimToUndefined(detailObject?.detail) ??
    trimToUndefined(root.error);
  const code =
    trimToUndefined(root.code) ??
    trimToUndefined(detailObject?.code) ??
    trimToUndefined(detailObject?.status);
  if (message && code) {
    return `${truncateErrorDetail(message)} [code=${code}]`;
  }
  if (message) {
    return truncateErrorDetail(message);
  }
  if (code) {
    return `[code=${code}]`;
  }
  return undefined;
}

async function extractElevenLabsErrorDetail(response: Response): Promise<string | undefined> {
  const rawBody = trimToUndefined(await readResponseTextLimited(response));
  if (!rawBody) {
    return undefined;
  }
  try {
    return formatElevenLabsErrorPayload(JSON.parse(rawBody)) ?? truncateErrorDetail(rawBody);
  } catch {
    return truncateErrorDetail(rawBody);
  }
}

function assertElevenLabsVoiceSettings(settings: {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  speed: number;
}) {
  requireInRange(settings.stability, 0, 1, "stability");
  requireInRange(settings.similarityBoost, 0, 1, "similarityBoost");
  requireInRange(settings.style, 0, 1, "style");
  requireInRange(settings.speed, 0.5, 2, "speed");
}

function resolveElevenLabsAcceptHeader(outputFormat: string): string | undefined {
  const normalized = outputFormat.trim().toLowerCase();
  if (!normalized || normalized.startsWith("mp3_")) {
    return "audio/mpeg";
  }
  return undefined;
}

function normalizeElevenLabsLatencyTier(latencyTier: number | undefined): number | undefined {
  if (latencyTier === undefined || !Number.isFinite(latencyTier)) {
    return undefined;
  }
  if (!Number.isSafeInteger(latencyTier)) {
    throw new Error("latencyTier must be an integer");
  }
  requireInRange(latencyTier, 0, 4, "latencyTier");
  return latencyTier;
}

type ElevenLabsTtsRequestParams = {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  modelId: string;
  outputFormat: string;
  seed?: number;
  applyTextNormalization?: "auto" | "on" | "off";
  languageCode?: string;
  latencyTier?: number;
  voiceSettings: {
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
    speed: number;
  };
  timeoutMs: number;
};

function prepareElevenLabsTtsRequest(params: ElevenLabsTtsRequestParams & { stream: boolean }): {
  url: URL;
  normalizedBaseUrl: string;
  acceptHeader?: string;
  body: string;
} {
  const {
    text,
    baseUrl,
    voiceId,
    modelId,
    outputFormat,
    seed,
    applyTextNormalization,
    languageCode,
    latencyTier,
    voiceSettings,
  } = params;
  if (!isValidElevenLabsVoiceId(voiceId)) {
    throw new Error("Invalid voiceId format");
  }
  assertElevenLabsVoiceSettings(voiceSettings);
  const normalizedLanguage = normalizeLanguageCode(languageCode);
  const normalizedNormalization = normalizeApplyTextNormalization(applyTextNormalization);
  const normalizedSeed = normalizeSeed(seed);
  const normalizedBaseUrl = normalizeElevenLabsBaseUrl(baseUrl);
  const normalizedLatencyTier = normalizeElevenLabsLatencyTier(latencyTier);
  const url = new URL(
    `${normalizedBaseUrl}/v1/text-to-speech/${voiceId}${params.stream ? "/stream" : ""}`,
  );
  if (outputFormat) {
    url.searchParams.set("output_format", outputFormat);
  }
  const supportsStreamingLatency = modelId.trim().toLowerCase() !== "eleven_v3";
  if (normalizedLatencyTier !== undefined && supportsStreamingLatency) {
    url.searchParams.set("optimize_streaming_latency", normalizedLatencyTier.toString());
  }
  const acceptHeader = resolveElevenLabsAcceptHeader(outputFormat);
  return {
    url,
    normalizedBaseUrl,
    acceptHeader,
    body: JSON.stringify({
      text,
      model_id: modelId,
      seed: normalizedSeed,
      apply_text_normalization: normalizedNormalization,
      language_code: normalizedLanguage,
      voice_settings: {
        stability: voiceSettings.stability,
        similarity_boost: voiceSettings.similarityBoost,
        style: voiceSettings.style,
        use_speaker_boost: voiceSettings.useSpeakerBoost,
        speed: voiceSettings.speed,
      },
    }),
  };
}

export async function elevenLabsTTS(params: ElevenLabsTtsRequestParams): Promise<Buffer> {
  const { apiKey, timeoutMs } = params;
  const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
    ...params,
    stream: false,
  });

  const { response, release } = await fetchWithSsrFGuard({
    url: url.toString(),
    init: {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        ...(acceptHeader ? { Accept: acceptHeader } : {}),
      },
<<<<<<< HEAD
      body: JSON.stringify({
        text,
        model_id: modelId,
        seed: normalizedSeed,
        apply_text_normalization: normalizedNormalization,
        language_code: normalizedLanguage,
        latency_optimization_level: latencyTier,
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarityBoost,
          style: voiceSettings.style,
          use_speaker_boost: voiceSettings.useSpeakerBoost,
          speed: voiceSettings.speed,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await extractElevenLabsErrorDetail(response);
      const requestId =
        trimToUndefined(response.headers.get("x-request-id")) ??
        trimToUndefined(response.headers.get("request-id"));
      throw new Error(
        `ElevenLabs API error (${response.status})` +
          (detail ? `: ${detail}` : "") +
          (requestId ? ` [request_id=${requestId}]` : ""),
      );
    }

    return Buffer.from(await response.arrayBuffer());
=======
      body,
    },
    timeoutMs,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
    auditContext: "elevenlabs.tts",
  });
  try {
    await assertOkOrThrowProviderError(response, "ElevenLabs API error");

    return Buffer.from(await readProviderBinaryResponse(response, "ElevenLabs API error", "audio"));
>>>>>>> upstream/main
  } finally {
    await release();
  }
}

export async function elevenLabsTTSStream(params: ElevenLabsTtsRequestParams): Promise<{
  audioStream: ReadableStream<Uint8Array>;
  release: () => Promise<void>;
}> {
  const { apiKey, timeoutMs } = params;
  const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
    ...params,
    stream: true,
  });

  const { response, release } = await fetchWithSsrFGuard({
    url: url.toString(),
    init: {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        ...(acceptHeader ? { Accept: acceptHeader } : {}),
      },
      body,
    },
    timeoutMs,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
    auditContext: "elevenlabs.tts.stream",
  });
  let handedOff = false;
  try {
    await assertOkOrThrowProviderError(response, "ElevenLabs API error");
    assertProviderBinaryResponseContent(response, "ElevenLabs API error", "audio");
    if (!response.body) {
      throw new Error("ElevenLabs API response missing audio stream");
    }
    handedOff = true;
    return {
      audioStream: response.body,
      release,
    };
  } finally {
    if (!handedOff) {
      await release();
    }
  }
}
