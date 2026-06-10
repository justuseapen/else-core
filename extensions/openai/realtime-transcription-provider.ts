<<<<<<< HEAD
import type {
  RealtimeTranscriptionProviderConfig,
  RealtimeTranscriptionProviderPlugin,
  RealtimeTranscriptionSession,
  RealtimeTranscriptionSessionCreateRequest,
} from "openclaw/plugin-sdk/realtime-transcription";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import WebSocket from "ws";

type OpenAIRealtimeTranscriptionProviderConfig = {
  apiKey?: string;
  model?: string;
=======
// Openai provider module implements model/runtime integration.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  isProviderAuthProfileConfigured,
  resolveProviderAuthProfileApiKey,
} from "openclaw/plugin-sdk/provider-auth";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import {
  createRealtimeTranscriptionWebSocketSession,
  type RealtimeTranscriptionProviderConfig,
  type RealtimeTranscriptionProviderPlugin,
  type RealtimeTranscriptionSession,
  type RealtimeTranscriptionSessionCreateRequest,
  type RealtimeTranscriptionWebSocketTransport,
} from "openclaw/plugin-sdk/realtime-transcription";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import {
  asFiniteNumber,
  createOpenAIRealtimeTranscriptionClientSecret,
  readRealtimeErrorDetail,
  resolveOpenAIProviderConfigRecord,
  trimToUndefined,
} from "./realtime-provider-shared.js";

type OpenAIRealtimeTranscriptionProviderConfig = {
  apiKey?: string;
  language?: string;
  model?: string;
  prompt?: string;
>>>>>>> upstream/main
  silenceDurationMs?: number;
  vadThreshold?: number;
};

type OpenAIRealtimeTranscriptionSessionConfig = RealtimeTranscriptionSessionCreateRequest & {
<<<<<<< HEAD
  apiKey: string;
  model: string;
=======
  apiKey?: string;
  cfg?: OpenClawConfig;
  language?: string;
  model: string;
  prompt?: string;
>>>>>>> upstream/main
  silenceDurationMs: number;
  vadThreshold: number;
};

type RealtimeEvent = {
  type: string;
  delta?: string;
  transcript?: string;
  error?: unknown;
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
}
=======
type OpenAIRealtimeTranscriptionSessionPayload = {
  type: "transcription";
  audio: {
    input: {
      format: { type: "audio/pcmu" };
      transcription: {
        model: string;
        language?: string;
        prompt?: string;
      };
      turn_detection: {
        type: "server_vad";
        threshold: number;
        prefix_padding_ms: number;
        silence_duration_ms: number;
      };
    };
  };
};

const OPENAI_REALTIME_TRANSCRIPTION_URL = "wss://api.openai.com/v1/realtime?intent=transcription";
const OPENAI_REALTIME_TRANSCRIPTION_CONNECT_TIMEOUT_MS = 10_000;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_RECONNECT_ATTEMPTS = 5;
const OPENAI_REALTIME_TRANSCRIPTION_RECONNECT_DELAY_MS = 1000;
const OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL = "gpt-4o-transcribe";
>>>>>>> upstream/main

function normalizeProviderConfig(
  config: RealtimeTranscriptionProviderConfig,
): OpenAIRealtimeTranscriptionProviderConfig {
<<<<<<< HEAD
  const providers = asObject(config.providers);
  const raw = asObject(providers?.openai) ?? asObject(config.openai) ?? asObject(config);
=======
  const raw = resolveOpenAIProviderConfigRecord(config);
>>>>>>> upstream/main
  return {
    apiKey:
      normalizeResolvedSecretInputString({
        value: raw?.apiKey,
        path: "plugins.entries.voice-call.config.streaming.providers.openai.apiKey",
      }) ??
      normalizeResolvedSecretInputString({
        value: raw?.openaiApiKey,
        path: "plugins.entries.voice-call.config.streaming.openaiApiKey",
      }),
<<<<<<< HEAD
    model: trimToUndefined(raw?.model) ?? trimToUndefined(raw?.sttModel),
    silenceDurationMs: asNumber(raw?.silenceDurationMs),
    vadThreshold: asNumber(raw?.vadThreshold),
  };
}

function readProviderConfig(
  providerConfig: RealtimeTranscriptionProviderConfig,
): OpenAIRealtimeTranscriptionProviderConfig {
  return normalizeProviderConfig(providerConfig);
}

class OpenAIRealtimeTranscriptionSession implements RealtimeTranscriptionSession {
  private static readonly MAX_RECONNECT_ATTEMPTS = 5;
  private static readonly RECONNECT_DELAY_MS = 1000;
  private static readonly CONNECT_TIMEOUT_MS = 10_000;

  private ws: WebSocket | null = null;
  private connected = false;
  private closed = false;
  private reconnectAttempts = 0;
  private pendingTranscript = "";

  constructor(private readonly config: OpenAIRealtimeTranscriptionSessionConfig) {}

  async connect(): Promise<void> {
    this.closed = false;
    this.reconnectAttempts = 0;
    await this.doConnect();
  }

  sendAudio(audio: Buffer): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.sendEvent({
      type: "input_audio_buffer.append",
      audio: audio.toString("base64"),
    });
  }

  close(): void {
    this.closed = true;
    this.connected = false;
    if (this.ws) {
      this.ws.close(1000, "Transcription session closed");
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  private async doConnect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket("wss://api.openai.com/v1/realtime?intent=transcription", {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "OpenAI-Beta": "realtime=v1",
        },
      });

      const connectTimeout = setTimeout(() => {
        reject(new Error("OpenAI realtime transcription connection timeout"));
      }, OpenAIRealtimeTranscriptionSession.CONNECT_TIMEOUT_MS);

      this.ws.on("open", () => {
        clearTimeout(connectTimeout);
        this.connected = true;
        this.reconnectAttempts = 0;
        this.sendEvent({
          type: "transcription_session.update",
          session: {
            input_audio_format: "g711_ulaw",
            input_audio_transcription: {
              model: this.config.model,
            },
            turn_detection: {
              type: "server_vad",
              threshold: this.config.vadThreshold,
              prefix_padding_ms: 300,
              silence_duration_ms: this.config.silenceDurationMs,
            },
          },
        });
        resolve();
      });

      this.ws.on("message", (data: Buffer) => {
        try {
          this.handleEvent(JSON.parse(data.toString()) as RealtimeEvent);
        } catch (error) {
          this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      });

      this.ws.on("error", (error) => {
        if (!this.connected) {
          clearTimeout(connectTimeout);
          reject(error);
          return;
        }
        this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
      });

      this.ws.on("close", () => {
        this.connected = false;
        if (this.closed) {
          return;
        }
        void this.attemptReconnect();
      });
    });
  }

  private async attemptReconnect(): Promise<void> {
    if (this.closed) {
      return;
    }
    if (this.reconnectAttempts >= OpenAIRealtimeTranscriptionSession.MAX_RECONNECT_ATTEMPTS) {
      this.config.onError?.(new Error("OpenAI realtime transcription reconnect limit reached"));
      return;
    }
    this.reconnectAttempts += 1;
    const delay =
      OpenAIRealtimeTranscriptionSession.RECONNECT_DELAY_MS * 2 ** (this.reconnectAttempts - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (this.closed) {
      return;
    }
    try {
      await this.doConnect();
    } catch (error) {
      this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
      await this.attemptReconnect();
    }
  }

  private handleEvent(event: RealtimeEvent): void {
    switch (event.type) {
      case "conversation.item.input_audio_transcription.delta":
        if (event.delta) {
          this.pendingTranscript += event.delta;
          this.config.onPartial?.(this.pendingTranscript);
=======
    language: trimToUndefined(raw?.language),
    model: trimToUndefined(raw?.model) ?? trimToUndefined(raw?.sttModel),
    prompt: trimToUndefined(raw?.prompt),
    silenceDurationMs: normalizeNonNegativeInteger(raw?.silenceDurationMs),
    vadThreshold: normalizeVadThreshold(raw?.vadThreshold),
  };
}

function normalizeNonNegativeInteger(value: unknown): number | undefined {
  const number = asFiniteNumber(value);
  if (number === undefined || !Number.isSafeInteger(number) || number < 0) {
    return undefined;
  }
  return number;
}

function normalizeVadThreshold(value: unknown): number | undefined {
  const number = asFiniteNumber(value);
  if (number === undefined || number < 0 || number > 1) {
    return undefined;
  }
  return number;
}

function buildOpenAIRealtimeTranscriptionSessionPayload(
  config: OpenAIRealtimeTranscriptionSessionConfig,
): OpenAIRealtimeTranscriptionSessionPayload {
  return {
    type: "transcription",
    audio: {
      input: {
        format: { type: "audio/pcmu" },
        transcription: {
          model: config.model,
          ...(config.language ? { language: config.language } : {}),
          ...(config.prompt ? { prompt: config.prompt } : {}),
        },
        turn_detection: {
          type: "server_vad",
          threshold: config.vadThreshold,
          prefix_padding_ms: 300,
          silence_duration_ms: config.silenceDurationMs,
        },
      },
    },
  };
}

async function resolveOpenAIRealtimeTranscriptionAuthorization(
  config: OpenAIRealtimeTranscriptionSessionConfig,
): Promise<string> {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
  if (apiKey) {
    return apiKey;
  }
  const authToken = await resolveProviderAuthProfileApiKey({
    provider: "openai",
    cfg: config.cfg,
  });
  if (!authToken) {
    throw new Error("OpenAI API key or Codex OAuth missing");
  }
  const clientSecret = await createOpenAIRealtimeTranscriptionClientSecret({
    authToken,
    auditContext: "openai-realtime-transcription-session",
    session: buildOpenAIRealtimeTranscriptionSessionPayload(config),
  });
  return clientSecret.value;
}

function createOpenAIRealtimeTranscriptionSession(
  config: OpenAIRealtimeTranscriptionSessionConfig,
): RealtimeTranscriptionSession {
  let pendingTranscript = "";

  const handleEvent = (
    event: RealtimeEvent,
    transport: RealtimeTranscriptionWebSocketTransport,
  ) => {
    switch (event.type) {
      case "session.updated":
      case "transcription_session.updated":
        transport.markReady();
        return;

      case "conversation.item.input_audio_transcription.delta":
        if (event.delta) {
          pendingTranscript += event.delta;
          config.onPartial?.(pendingTranscript);
>>>>>>> upstream/main
        }
        return;

      case "conversation.item.input_audio_transcription.completed":
        if (event.transcript) {
<<<<<<< HEAD
          this.config.onTranscript?.(event.transcript);
        }
        this.pendingTranscript = "";
        return;

      case "input_audio_buffer.speech_started":
        this.pendingTranscript = "";
        this.config.onSpeechStart?.();
        return;

      case "error": {
        const detail =
          event.error && typeof event.error === "object" && "message" in event.error
            ? String((event.error as { message?: unknown }).message ?? "Unknown error")
            : event.error
              ? String(event.error)
              : "Unknown error";
        this.config.onError?.(new Error(detail));
        return;
      }

      default:
        return;
    }
  }

  private sendEvent(event: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }
=======
          config.onTranscript?.(event.transcript);
        }
        pendingTranscript = "";
        return;

      case "input_audio_buffer.speech_started":
        pendingTranscript = "";
        config.onSpeechStart?.();
        return;

      case "error": {
        const detail = readRealtimeErrorDetail(event.error);
        const error = new Error(detail);
        if (!transport.isReady()) {
          transport.failConnect(error);
        } else {
          config.onError?.(error);
        }
      }

      default:
    }
  };

  return createRealtimeTranscriptionWebSocketSession<RealtimeEvent>({
    providerId: "openai",
    callbacks: config,
    url: OPENAI_REALTIME_TRANSCRIPTION_URL,
    headers: async () => {
      const bearer = await resolveOpenAIRealtimeTranscriptionAuthorization(config);
      return (
        resolveProviderRequestHeaders({
          provider: "openai",
          baseUrl: OPENAI_REALTIME_TRANSCRIPTION_URL,
          capability: "audio",
          transport: "websocket",
          defaultHeaders: {
            Authorization: `Bearer ${bearer}`,
          },
        }) ?? {
          Authorization: `Bearer ${bearer}`,
        }
      );
    },
    connectTimeoutMs: OPENAI_REALTIME_TRANSCRIPTION_CONNECT_TIMEOUT_MS,
    maxReconnectAttempts: OPENAI_REALTIME_TRANSCRIPTION_MAX_RECONNECT_ATTEMPTS,
    reconnectDelayMs: OPENAI_REALTIME_TRANSCRIPTION_RECONNECT_DELAY_MS,
    connectTimeoutMessage: "OpenAI realtime transcription connection timeout",
    connectClosedBeforeReadyMessage: "OpenAI realtime transcription connection closed before ready",
    reconnectLimitMessage: "OpenAI realtime transcription reconnect limit reached",
    sendAudio: (audio, transport) => {
      transport.sendJson({
        type: "input_audio_buffer.append",
        audio: audio.toString("base64"),
      });
    },
    onOpen: (transport: RealtimeTranscriptionWebSocketTransport) => {
      transport.sendJson({
        type: "session.update",
        session: buildOpenAIRealtimeTranscriptionSessionPayload(config),
      });
    },
    onMessage: handleEvent,
  });
>>>>>>> upstream/main
}

export function buildOpenAIRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin {
  return {
    id: "openai",
    label: "OpenAI Realtime Transcription",
    aliases: ["openai-realtime"],
<<<<<<< HEAD
    autoSelectOrder: 10,
    resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
    isConfigured: ({ providerConfig }) =>
      Boolean(readProviderConfig(providerConfig).apiKey || process.env.OPENAI_API_KEY),
    createSession: (req) => {
      const config = readProviderConfig(req.providerConfig);
      const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key missing");
      }
      return new OpenAIRealtimeTranscriptionSession({
        ...req,
        apiKey,
        model: config.model ?? "gpt-4o-transcribe",
=======
    defaultModel: OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL,
    autoSelectOrder: 10,
    resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
    isConfigured: ({ cfg, providerConfig }) =>
      Boolean(
        normalizeProviderConfig(providerConfig).apiKey ||
        process.env.OPENAI_API_KEY ||
        isProviderAuthProfileConfigured({ provider: "openai", cfg }),
      ),
    createSession: (req) => {
      const config = normalizeProviderConfig(req.providerConfig);
      return createOpenAIRealtimeTranscriptionSession({
        ...req,
        apiKey: config.apiKey,
        language: config.language,
        model: config.model ?? OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL,
        prompt: config.prompt,
>>>>>>> upstream/main
        silenceDurationMs: config.silenceDurationMs ?? 800,
        vadThreshold: config.vadThreshold ?? 0.5,
      });
    },
  };
}
