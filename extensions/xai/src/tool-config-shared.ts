<<<<<<< HEAD
import { normalizeXaiModelId } from "../model-id.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function coerceXaiToolConfig<TConfig extends Record<string, unknown>>(
  config: Record<string, unknown> | undefined,
): TConfig {
  return isRecord(config) ? (config as TConfig) : ({} as TConfig);
=======
// Xai helper module supports tool config shared behavior.
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeXaiModelId } from "../model-id.js";

export { isRecord };

export function coerceXaiToolConfig(
  config: Record<string, unknown> | undefined,
): Record<string, unknown> {
  return isRecord(config) ? config : {};
>>>>>>> upstream/main
}

export function resolveNormalizedXaiToolModel(params: {
  config?: Record<string, unknown>;
  defaultModel: string;
}): string {
<<<<<<< HEAD
  const value = coerceXaiToolConfig<{ model?: unknown }>(params.config).model;
=======
  const value = coerceXaiToolConfig(params.config).model;
>>>>>>> upstream/main
  return typeof value === "string" && value.trim()
    ? normalizeXaiModelId(value.trim())
    : params.defaultModel;
}

export function resolvePositiveIntegerToolConfig(
  config: Record<string, unknown> | undefined,
  key: string,
): number | undefined {
<<<<<<< HEAD
  const raw = coerceXaiToolConfig<Record<string, unknown>>(config)[key];
=======
  const raw = coerceXaiToolConfig(config)[key];
>>>>>>> upstream/main
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return undefined;
  }
  const normalized = Math.trunc(raw);
  return normalized > 0 ? normalized : undefined;
}
