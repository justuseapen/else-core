<<<<<<< HEAD
import type { VoiceCallConfig } from "./config.js";
import { VoiceCallConfigSchema } from "./config.js";

export const VOICE_CALL_LEGACY_CONFIG_REMOVAL_VERSION = "2026.6.0";

export type VoiceCallLegacyConfigIssue = {
=======
// Voice Call helper module supports config compat behavior.
import { asOptionalRecord, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import type { VoiceCallConfig } from "./config.js";
import { VoiceCallConfigSchema } from "./config.js";

// Legacy voice-call config warnings and doctor-fix migration helpers.

/** Version where legacy voice-call config shape support is removed. */
export const VOICE_CALL_LEGACY_CONFIG_REMOVAL_VERSION = "2026.6.0";

/** One legacy config issue with the replacement path and message. */
type VoiceCallLegacyConfigIssue = {
>>>>>>> upstream/main
  path: string;
  replacement: string;
  message: string;
};

<<<<<<< HEAD
function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getString(obj: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = obj?.[key];
  return typeof value === "string" ? value : undefined;
}

function getNumber(obj: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = obj?.[key];
  return typeof value === "number" ? value : undefined;
}

=======
const asObject = asOptionalRecord;
const getString = readStringField;

/** Read finite numeric config values. */
function getNumber(obj: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = obj?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** Merge legacy provider-specific values into the canonical providers map. */
>>>>>>> upstream/main
function mergeProviderConfig(
  providersValue: unknown,
  providerId: string,
  compatValues: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (Object.keys(compatValues).length === 0) {
    return asObject(providersValue);
  }

  const providers = asObject(providersValue) ?? {};
  const existing = asObject(providers[providerId]) ?? {};
  return {
    ...providers,
    [providerId]: {
      ...existing,
      ...compatValues,
    },
  };
}

<<<<<<< HEAD
export function collectVoiceCallLegacyConfigIssues(value: unknown): VoiceCallLegacyConfigIssue[] {
  const raw = asObject(value) ?? {};
=======
/** Collect legacy voice-call config keys that should be migrated. */
export function collectVoiceCallLegacyConfigIssues(value: unknown): VoiceCallLegacyConfigIssue[] {
  const raw = asObject(value) ?? {};
  const realtime = asObject(raw.realtime);
  const realtimeAgentContext = asObject(realtime?.agentContext);
>>>>>>> upstream/main
  const twilio = asObject(raw.twilio);
  const streaming = asObject(raw.streaming);

  const issues: VoiceCallLegacyConfigIssue[] = [];
  if (raw.provider === "log") {
    issues.push({
      path: "provider",
      replacement: "provider",
      message: 'Replace provider "log" with "mock".',
    });
  }
  if (typeof twilio?.from === "string") {
    issues.push({
      path: "twilio.from",
      replacement: "fromNumber",
      message: "Move twilio.from to fromNumber.",
    });
  }
  if (typeof streaming?.sttProvider === "string") {
    issues.push({
      path: "streaming.sttProvider",
      replacement: "streaming.provider",
      message: "Move streaming.sttProvider to streaming.provider.",
    });
  }
  if (typeof streaming?.openaiApiKey === "string") {
    issues.push({
      path: "streaming.openaiApiKey",
      replacement: "streaming.providers.openai.apiKey",
      message: "Move streaming.openaiApiKey to streaming.providers.openai.apiKey.",
    });
  }
  if (typeof streaming?.sttModel === "string") {
    issues.push({
      path: "streaming.sttModel",
      replacement: "streaming.providers.openai.model",
      message: "Move streaming.sttModel to streaming.providers.openai.model.",
    });
  }
  if (typeof streaming?.silenceDurationMs === "number") {
    issues.push({
      path: "streaming.silenceDurationMs",
      replacement: "streaming.providers.openai.silenceDurationMs",
      message: "Move streaming.silenceDurationMs to streaming.providers.openai.silenceDurationMs.",
    });
  }
  if (typeof streaming?.vadThreshold === "number") {
    issues.push({
      path: "streaming.vadThreshold",
      replacement: "streaming.providers.openai.vadThreshold",
      message: "Move streaming.vadThreshold to streaming.providers.openai.vadThreshold.",
    });
  }
<<<<<<< HEAD
=======
  if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt")) {
    issues.push({
      path: "realtime.agentContext.includeSystemPrompt",
      replacement: "realtime.agentContext",
      message:
        "Remove realtime.agentContext.includeSystemPrompt; realtime context now uses the generated agent prompt.",
    });
  }
>>>>>>> upstream/main

  return issues;
}

<<<<<<< HEAD
=======
/** Format runtime warnings for legacy voice-call config keys. */
>>>>>>> upstream/main
export function formatVoiceCallLegacyConfigWarnings(params: {
  value: unknown;
  configPathPrefix: string;
  doctorFixCommand: string;
}): string[] {
  const issues = collectVoiceCallLegacyConfigIssues(params.value);
  if (issues.length === 0) {
    return [];
  }

  return [
    `[voice-call] legacy config keys detected under ${params.configPathPrefix}; runtime loading will not rewrite them, and support for the legacy shape will be removed in ${VOICE_CALL_LEGACY_CONFIG_REMOVAL_VERSION}. Run "${params.doctorFixCommand}".`,
    ...issues.map(
      (issue) => `[voice-call] ${params.configPathPrefix}.${issue.path}: ${issue.message}`,
    ),
  ];
}

<<<<<<< HEAD
=======
/** Migrate legacy voice-call config input to the current canonical shape. */
>>>>>>> upstream/main
export function migrateVoiceCallLegacyConfigInput(params: {
  value: unknown;
  configPathPrefix?: string;
}): {
  config: Record<string, unknown>;
  changes: string[];
  issues: VoiceCallLegacyConfigIssue[];
} {
  const raw = asObject(params.value) ?? {};
<<<<<<< HEAD
=======
  const realtime = asObject(raw.realtime);
  const realtimeAgentContext = asObject(realtime?.agentContext);
>>>>>>> upstream/main
  const twilio = asObject(raw.twilio);
  const streaming = asObject(raw.streaming);
  const configPathPrefix = params.configPathPrefix ?? "plugins.entries.voice-call.config";
  const issues = collectVoiceCallLegacyConfigIssues(raw);

  const legacyStreamingOpenAICompat: Record<string, unknown> = {};
  const streamingOpenAIApiKey = getString(streaming, "openaiApiKey");
  if (streamingOpenAIApiKey) {
    legacyStreamingOpenAICompat.apiKey = streamingOpenAIApiKey;
  }
  const streamingSttModel = getString(streaming, "sttModel");
  if (streamingSttModel) {
    legacyStreamingOpenAICompat.model = streamingSttModel;
  }
  const streamingSilenceDurationMs = getNumber(streaming, "silenceDurationMs");
  if (streamingSilenceDurationMs !== undefined) {
    legacyStreamingOpenAICompat.silenceDurationMs = streamingSilenceDurationMs;
  }
  const streamingVadThreshold = getNumber(streaming, "vadThreshold");
  if (streamingVadThreshold !== undefined) {
    legacyStreamingOpenAICompat.vadThreshold = streamingVadThreshold;
  }
  const streamingProvider = getString(streaming, "provider");
  const legacyStreamingProvider = getString(streaming, "sttProvider");

  const normalizedStreaming: Record<string, unknown> | undefined = streaming
    ? {
        ...streaming,
        provider: streamingProvider ?? legacyStreamingProvider,
        providers: mergeProviderConfig(streaming.providers, "openai", legacyStreamingOpenAICompat),
      }
    : undefined;

  if (normalizedStreaming) {
    delete normalizedStreaming.sttProvider;
    delete normalizedStreaming.openaiApiKey;
    delete normalizedStreaming.sttModel;
    delete normalizedStreaming.silenceDurationMs;
    delete normalizedStreaming.vadThreshold;
  }

  const normalizedTwilio = twilio
    ? {
        ...twilio,
      }
    : undefined;
  if (normalizedTwilio) {
    delete normalizedTwilio.from;
  }

<<<<<<< HEAD
=======
  const normalizedRealtimeAgentContext = realtimeAgentContext
    ? {
        ...realtimeAgentContext,
      }
    : undefined;
  if (normalizedRealtimeAgentContext) {
    delete normalizedRealtimeAgentContext.includeSystemPrompt;
  }

  const normalizedRealtime = realtime
    ? {
        ...realtime,
        agentContext: normalizedRealtimeAgentContext ?? realtime.agentContext,
      }
    : undefined;

>>>>>>> upstream/main
  const config = {
    ...raw,
    provider: raw.provider === "log" ? "mock" : raw.provider,
    fromNumber: raw.fromNumber ?? (typeof twilio?.from === "string" ? twilio.from : undefined),
    twilio: normalizedTwilio,
    streaming: normalizedStreaming,
<<<<<<< HEAD
=======
    realtime: normalizedRealtime,
>>>>>>> upstream/main
  };

  const changes: string[] = [];
  if (raw.provider === "log") {
    changes.push(`Moved ${configPathPrefix}.provider "log" → "mock".`);
  }
  if (typeof twilio?.from === "string" && typeof raw.fromNumber !== "string") {
    changes.push(`Moved ${configPathPrefix}.twilio.from → ${configPathPrefix}.fromNumber.`);
  }
  if (typeof streaming?.sttProvider === "string") {
    changes.push(
      `Moved ${configPathPrefix}.streaming.sttProvider → ${configPathPrefix}.streaming.provider.`,
    );
  }
  if (typeof streaming?.openaiApiKey === "string") {
    changes.push(
      `Moved ${configPathPrefix}.streaming.openaiApiKey → ${configPathPrefix}.streaming.providers.openai.apiKey.`,
    );
  }
  if (typeof streaming?.sttModel === "string") {
    changes.push(
      `Moved ${configPathPrefix}.streaming.sttModel → ${configPathPrefix}.streaming.providers.openai.model.`,
    );
  }
<<<<<<< HEAD
  if (typeof streaming?.silenceDurationMs === "number") {
    changes.push(
      `Moved ${configPathPrefix}.streaming.silenceDurationMs → ${configPathPrefix}.streaming.providers.openai.silenceDurationMs.`,
    );
  }
  if (typeof streaming?.vadThreshold === "number") {
    changes.push(
      `Moved ${configPathPrefix}.streaming.vadThreshold → ${configPathPrefix}.streaming.providers.openai.vadThreshold.`,
    );
=======
  if (getNumber(streaming, "silenceDurationMs") !== undefined) {
    changes.push(
      `Moved ${configPathPrefix}.streaming.silenceDurationMs → ${configPathPrefix}.streaming.providers.openai.silenceDurationMs.`,
    );
  } else if (typeof streaming?.silenceDurationMs === "number") {
    changes.push(`Removed invalid ${configPathPrefix}.streaming.silenceDurationMs.`);
  }
  if (getNumber(streaming, "vadThreshold") !== undefined) {
    changes.push(
      `Moved ${configPathPrefix}.streaming.vadThreshold → ${configPathPrefix}.streaming.providers.openai.vadThreshold.`,
    );
  } else if (typeof streaming?.vadThreshold === "number") {
    changes.push(`Removed invalid ${configPathPrefix}.streaming.vadThreshold.`);
  }
  if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt")) {
    changes.push(`Removed ${configPathPrefix}.realtime.agentContext.includeSystemPrompt.`);
>>>>>>> upstream/main
  }

  return { config, changes, issues };
}

<<<<<<< HEAD
=======
/** Normalize legacy voice-call config input without returning migration metadata. */
>>>>>>> upstream/main
export function normalizeVoiceCallLegacyConfigInput(value: unknown): Record<string, unknown> {
  return migrateVoiceCallLegacyConfigInput({ value }).config;
}

<<<<<<< HEAD
=======
/** Parse voice-call plugin config after applying legacy normalization. */
>>>>>>> upstream/main
export function parseVoiceCallPluginConfig(value: unknown): VoiceCallConfig {
  return VoiceCallConfigSchema.parse(normalizeVoiceCallLegacyConfigInput(value));
}
