<<<<<<< HEAD
import path from "node:path";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { resolveMemorySearchConfig } from "../agents/memory-search.js";
import type { OpenClawConfig } from "../config/config.js";
=======
// Memory host dreaming helpers record and load memory dreaming artifacts.
import path from "node:path";
import { asNullableRecord } from "@openclaw/normalization-core/record-coerce";
import {
  lowercasePreservingWhitespace,
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
  normalizeStringifiedOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
>>>>>>> upstream/main

export const DEFAULT_MEMORY_DREAMING_ENABLED = false;
export const DEFAULT_MEMORY_DREAMING_TIMEZONE = undefined;
export const DEFAULT_MEMORY_DREAMING_VERBOSE_LOGGING = false;
<<<<<<< HEAD
export const DEFAULT_MEMORY_DREAMING_STORAGE_MODE = "inline";
export const DEFAULT_MEMORY_DREAMING_SEPARATE_REPORTS = false;
export const DEFAULT_MEMORY_DREAMING_FREQUENCY = "0 3 * * *";
=======
export const DEFAULT_MEMORY_DREAMING_STORAGE_MODE = "separate";
export const DEFAULT_MEMORY_DREAMING_SEPARATE_REPORTS = false;
export const DEFAULT_MEMORY_DREAMING_FREQUENCY = "0 3 * * *";
export const DEFAULT_MEMORY_DREAMING_PLUGIN_ID = "memory-core";
export const MANAGED_MEMORY_DREAMING_CRON_NAME = "Memory Dreaming Promotion";
export const MANAGED_MEMORY_DREAMING_CRON_TAG = "[managed-by=memory-core.short-term-promotion]";
export const MEMORY_DREAMING_SYSTEM_EVENT_TEXT =
  "__openclaw_memory_core_short_term_promotion_dream__";
export const LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME = "Memory Light Dreaming";
export const LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG = "[managed-by=memory-core.dreaming.light]";
export const LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT = "__openclaw_memory_core_light_sleep__";
export const LEGACY_MEMORY_REM_DREAMING_CRON_NAME = "Memory REM Dreaming";
export const LEGACY_MEMORY_REM_DREAMING_CRON_TAG = "[managed-by=memory-core.dreaming.rem]";
export const LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT = "__openclaw_memory_core_rem_sleep__";
>>>>>>> upstream/main

export const DEFAULT_MEMORY_LIGHT_DREAMING_CRON_EXPR = "0 */6 * * *";
export const DEFAULT_MEMORY_LIGHT_DREAMING_LOOKBACK_DAYS = 2;
export const DEFAULT_MEMORY_LIGHT_DREAMING_LIMIT = 100;
export const DEFAULT_MEMORY_LIGHT_DREAMING_DEDUPE_SIMILARITY = 0.9;

export const DEFAULT_MEMORY_DEEP_DREAMING_CRON_EXPR = "0 3 * * *";
export const DEFAULT_MEMORY_DEEP_DREAMING_LIMIT = 10;
export const DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE = 0.8;
export const DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT = 3;
export const DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES = 3;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS = 14;
export const DEFAULT_MEMORY_DEEP_DREAMING_MAX_AGE_DAYS = 30;
<<<<<<< HEAD
=======
export const DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS = 160;
>>>>>>> upstream/main

export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_ENABLED = true;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_TRIGGER_BELOW_HEALTH = 0.35;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_LOOKBACK_DAYS = 30;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MAX_CANDIDATES = 20;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MIN_CONFIDENCE = 0.9;
export const DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_AUTO_WRITE_MIN_CONFIDENCE = 0.97;

export const DEFAULT_MEMORY_REM_DREAMING_CRON_EXPR = "0 5 * * 0";
export const DEFAULT_MEMORY_REM_DREAMING_LOOKBACK_DAYS = 7;
export const DEFAULT_MEMORY_REM_DREAMING_LIMIT = 10;
export const DEFAULT_MEMORY_REM_DREAMING_MIN_PATTERN_STRENGTH = 0.75;

export const DEFAULT_MEMORY_DREAMING_SPEED = "balanced";
export const DEFAULT_MEMORY_DREAMING_THINKING = "medium";
export const DEFAULT_MEMORY_DREAMING_BUDGET = "medium";

export type MemoryDreamingSpeed = "fast" | "balanced" | "slow";
export type MemoryDreamingThinking = "low" | "medium" | "high";
export type MemoryDreamingBudget = "cheap" | "medium" | "expensive";
export type MemoryDreamingStorageMode = "inline" | "separate" | "both";

export type MemoryLightDreamingSource = "daily" | "sessions" | "recall";
export type MemoryDeepDreamingSource = "daily" | "memory" | "sessions" | "logs" | "recall";
export type MemoryRemDreamingSource = "memory" | "daily" | "deep";

export type MemoryDreamingExecutionConfig = {
  speed: MemoryDreamingSpeed;
  thinking: MemoryDreamingThinking;
  budget: MemoryDreamingBudget;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

export type MemoryDreamingStorageConfig = {
  mode: MemoryDreamingStorageMode;
  separateReports: boolean;
};

export type MemoryLightDreamingConfig = {
  enabled: boolean;
  cron: string;
  lookbackDays: number;
  limit: number;
  dedupeSimilarity: number;
  sources: MemoryLightDreamingSource[];
  execution: MemoryDreamingExecutionConfig;
};

export type MemoryDeepDreamingRecoveryConfig = {
  enabled: boolean;
  triggerBelowHealth: number;
  lookbackDays: number;
  maxRecoveredCandidates: number;
  minRecoveryConfidence: number;
  autoWriteMinConfidence: number;
};

export type MemoryDeepDreamingConfig = {
  enabled: boolean;
  cron: string;
  limit: number;
  minScore: number;
  minRecallCount: number;
  minUniqueQueries: number;
  recencyHalfLifeDays: number;
  maxAgeDays?: number;
<<<<<<< HEAD
=======
  maxPromotedSnippetTokens?: number;
>>>>>>> upstream/main
  sources: MemoryDeepDreamingSource[];
  recovery: MemoryDeepDreamingRecoveryConfig;
  execution: MemoryDreamingExecutionConfig;
};

export type MemoryRemDreamingConfig = {
  enabled: boolean;
  cron: string;
  lookbackDays: number;
  limit: number;
  minPatternStrength: number;
  sources: MemoryRemDreamingSource[];
  execution: MemoryDreamingExecutionConfig;
};

export type MemoryDreamingPhaseName = "light" | "deep" | "rem";

export type MemoryDreamingConfig = {
  enabled: boolean;
  frequency: string;
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
  execution: {
    defaults: MemoryDreamingExecutionConfig;
  };
  phases: {
    light: MemoryLightDreamingConfig;
    deep: MemoryDeepDreamingConfig;
    rem: MemoryRemDreamingConfig;
  };
};

export type MemoryDreamingWorkspace = {
  workspaceDir: string;
  agentIds: string[];
};

<<<<<<< HEAD
=======
export type MemoryDreamingWorkspaceOptions = {
  primaryWorkspaceDir?: string | null;
  primaryAgentId?: string | null;
  env?: NodeJS.ProcessEnv;
};

>>>>>>> upstream/main
const DEFAULT_MEMORY_LIGHT_DREAMING_SOURCES: MemoryLightDreamingSource[] = [
  "daily",
  "sessions",
  "recall",
];
const DEFAULT_MEMORY_DEEP_DREAMING_SOURCES: MemoryDeepDreamingSource[] = [
  "daily",
  "memory",
  "sessions",
  "logs",
  "recall",
];
const DEFAULT_MEMORY_REM_DREAMING_SOURCES: MemoryRemDreamingSource[] = ["memory", "daily", "deep"];

<<<<<<< HEAD
function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

=======
>>>>>>> upstream/main
function normalizeTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeNonNegativeInt(value: unknown, fallback: number): number {
<<<<<<< HEAD
  if (typeof value === "string" && value.trim().length === 0) {
    return fallback;
  }
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
=======
  const normalized = normalizeStringifiedOptionalString(value);
  if (typeof value === "string" && !normalized) {
    return fallback;
  }
  const num = typeof value === "string" ? Number(normalized) : Number(value);
>>>>>>> upstream/main
  if (!Number.isFinite(num)) {
    return fallback;
  }
  const floored = Math.floor(num);
  if (floored < 0) {
    return fallback;
  }
  return floored;
}

function normalizeOptionalPositiveInt(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
<<<<<<< HEAD
  if (typeof value === "string" && value.trim().length === 0) {
    return undefined;
  }
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
=======
  const normalized = normalizeStringifiedOptionalString(value);
  if (typeof value === "string" && !normalized) {
    return undefined;
  }
  const num = typeof value === "string" ? Number(normalized) : Number(value);
>>>>>>> upstream/main
  if (!Number.isFinite(num)) {
    return undefined;
  }
  const floored = Math.floor(num);
  if (floored <= 0) {
    return undefined;
  }
  return floored;
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
<<<<<<< HEAD
    const normalized = value.trim().toLowerCase();
=======
    const normalized = normalizeLowercaseStringOrEmpty(value);
>>>>>>> upstream/main
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return fallback;
}

function normalizeScore(value: unknown, fallback: number): number {
<<<<<<< HEAD
  if (typeof value === "string" && value.trim().length === 0) {
    return fallback;
  }
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
=======
  const normalized = normalizeStringifiedOptionalString(value);
  if (typeof value === "string" && !normalized) {
    return fallback;
  }
  const num = typeof value === "string" ? Number(normalized) : Number(value);
>>>>>>> upstream/main
  if (!Number.isFinite(num) || num < 0 || num > 1) {
    return fallback;
  }
  return num;
}

function normalizeSimilarity(value: unknown, fallback: number): number {
  return normalizeScore(value, fallback);
}

function normalizeStringArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: readonly T[],
): T[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }
  const allowedSet = new Set(allowed);
  const normalized: T[] = [];
  for (const entry of value) {
<<<<<<< HEAD
    const normalizedEntry = normalizeTrimmedString(entry)?.toLowerCase();
=======
    const normalizedEntry = normalizeOptionalLowercaseString(entry);
>>>>>>> upstream/main
    if (!normalizedEntry || !allowedSet.has(normalizedEntry as T)) {
      continue;
    }
    if (!normalized.includes(normalizedEntry as T)) {
      normalized.push(normalizedEntry as T);
    }
  }
  return normalized.length > 0 ? normalized : [...fallback];
}

function normalizeStorageMode(value: unknown): MemoryDreamingStorageMode {
<<<<<<< HEAD
  const normalized = normalizeTrimmedString(value)?.toLowerCase();
=======
  const normalized = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (normalized === "inline" || normalized === "separate" || normalized === "both") {
    return normalized;
  }
  return DEFAULT_MEMORY_DREAMING_STORAGE_MODE;
}

function normalizeSpeed(value: unknown): MemoryDreamingSpeed | undefined {
<<<<<<< HEAD
  const normalized = normalizeTrimmedString(value)?.toLowerCase();
=======
  const normalized = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (normalized === "fast" || normalized === "balanced" || normalized === "slow") {
    return normalized;
  }
  return undefined;
}

function normalizeThinking(value: unknown): MemoryDreamingThinking | undefined {
<<<<<<< HEAD
  const normalized = normalizeTrimmedString(value)?.toLowerCase();
=======
  const normalized = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (normalized === "low" || normalized === "medium" || normalized === "high") {
    return normalized;
  }
  return undefined;
}

function normalizeBudget(value: unknown): MemoryDreamingBudget | undefined {
<<<<<<< HEAD
  const normalized = normalizeTrimmedString(value)?.toLowerCase();
=======
  const normalized = normalizeOptionalLowercaseString(value);
>>>>>>> upstream/main
  if (normalized === "cheap" || normalized === "medium" || normalized === "expensive") {
    return normalized;
  }
  return undefined;
}

function resolveExecutionConfig(
  value: unknown,
  fallback: MemoryDreamingExecutionConfig,
): MemoryDreamingExecutionConfig {
<<<<<<< HEAD
  const record = asRecord(value);
=======
  const record = asNullableRecord(value);
>>>>>>> upstream/main
  const maxOutputTokens = normalizeOptionalPositiveInt(record?.maxOutputTokens);
  const timeoutMs = normalizeOptionalPositiveInt(record?.timeoutMs);
  const temperatureRaw = record?.temperature;
  const temperature =
    typeof temperatureRaw === "number" && Number.isFinite(temperatureRaw) && temperatureRaw >= 0
      ? Math.min(2, temperatureRaw)
      : undefined;
<<<<<<< HEAD
=======
  const model = normalizeTrimmedString(record?.model) ?? fallback.model;
>>>>>>> upstream/main

  return {
    speed: normalizeSpeed(record?.speed) ?? fallback.speed,
    thinking: normalizeThinking(record?.thinking) ?? fallback.thinking,
    budget: normalizeBudget(record?.budget) ?? fallback.budget,
<<<<<<< HEAD
    ...(normalizeTrimmedString(record?.model)
      ? { model: normalizeTrimmedString(record?.model) }
      : {}),
=======
    ...(model ? { model } : {}),
>>>>>>> upstream/main
    ...(typeof maxOutputTokens === "number" ? { maxOutputTokens } : {}),
    ...(typeof temperature === "number" ? { temperature } : {}),
    ...(typeof timeoutMs === "number" ? { timeoutMs } : {}),
  };
}

function normalizePathForComparison(input: string): string {
  const normalized = path.resolve(input);
<<<<<<< HEAD
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
=======
  return process.platform === "win32" ? lowercasePreservingWhitespace(normalized) : normalized;
>>>>>>> upstream/main
}

function formatLocalIsoDay(epochMs: number): string {
  const date = new Date(epochMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

<<<<<<< HEAD
export function resolveMemoryCorePluginConfig(
  cfg: OpenClawConfig | Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  const root = asRecord(cfg);
  const plugins = asRecord(root?.plugins);
  const entries = asRecord(plugins?.entries);
  const memoryCore = asRecord(entries?.["memory-core"]);
  return asRecord(memoryCore?.config) ?? undefined;
}

=======
export function resolveMemoryDreamingPluginId(
  cfg: OpenClawConfig | Record<string, unknown> | undefined,
): string {
  const root = asNullableRecord(cfg);
  const plugins = asNullableRecord(root?.plugins);
  const slots = asNullableRecord(plugins?.slots);
  const configuredSlot = normalizeTrimmedString(slots?.memory);
  if (configuredSlot && normalizeLowercaseStringOrEmpty(configuredSlot) !== "none") {
    return configuredSlot;
  }
  return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}

export function resolveMemoryDreamingPluginConfig(
  cfg: OpenClawConfig | Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  const root = asNullableRecord(cfg);
  const plugins = asNullableRecord(root?.plugins);
  const entries = asNullableRecord(plugins?.entries);
  const pluginId = resolveMemoryDreamingPluginId(cfg);
  const memoryPlugin = asNullableRecord(entries?.[pluginId]);
  return asNullableRecord(memoryPlugin?.config) ?? undefined;
}

/** @deprecated Use resolveMemoryDreamingPluginConfig. */
export const resolveMemoryCorePluginConfig = resolveMemoryDreamingPluginConfig;

>>>>>>> upstream/main
export function resolveMemoryDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryDreamingConfig {
<<<<<<< HEAD
  const dreaming = asRecord(params.pluginConfig?.dreaming);
=======
  const dreaming = asNullableRecord(params.pluginConfig?.dreaming);
>>>>>>> upstream/main
  const frequency =
    normalizeTrimmedString(dreaming?.frequency) ?? DEFAULT_MEMORY_DREAMING_FREQUENCY;
  const timezone =
    normalizeTrimmedString(dreaming?.timezone) ??
    normalizeTrimmedString(params.cfg?.agents?.defaults?.userTimezone) ??
    DEFAULT_MEMORY_DREAMING_TIMEZONE;
<<<<<<< HEAD
  const storage = asRecord(dreaming?.storage);
  const execution = asRecord(dreaming?.execution);
  const phases = asRecord(dreaming?.phases);
=======
  const storage = asNullableRecord(dreaming?.storage);
  const execution = asNullableRecord(dreaming?.execution);
  const phases = asNullableRecord(dreaming?.phases);
  const topLevelModel = normalizeTrimmedString(dreaming?.model);
>>>>>>> upstream/main

  const defaultExecution = resolveExecutionConfig(execution?.defaults, {
    speed: DEFAULT_MEMORY_DREAMING_SPEED,
    thinking: DEFAULT_MEMORY_DREAMING_THINKING,
    budget: DEFAULT_MEMORY_DREAMING_BUDGET,
<<<<<<< HEAD
  });

  const light = asRecord(phases?.light);
  const deep = asRecord(phases?.deep);
  const rem = asRecord(phases?.rem);
  const deepRecovery = asRecord(deep?.recovery);
  const maxAgeDays = normalizeOptionalPositiveInt(deep?.maxAgeDays);
=======
    ...(topLevelModel ? { model: topLevelModel } : {}),
  });

  const light = asNullableRecord(phases?.light);
  const deep = asNullableRecord(phases?.deep);
  const rem = asNullableRecord(phases?.rem);
  const deepRecovery = asNullableRecord(deep?.recovery);
  const maxAgeDays = normalizeOptionalPositiveInt(deep?.maxAgeDays);
  const maxPromotedSnippetTokens = normalizeOptionalPositiveInt(deep?.maxPromotedSnippetTokens);
>>>>>>> upstream/main

  return {
    enabled: normalizeBoolean(dreaming?.enabled, DEFAULT_MEMORY_DREAMING_ENABLED),
    frequency,
    ...(timezone ? { timezone } : {}),
    verboseLogging: normalizeBoolean(
      dreaming?.verboseLogging,
      DEFAULT_MEMORY_DREAMING_VERBOSE_LOGGING,
    ),
    storage: {
      mode: normalizeStorageMode(storage?.mode),
      separateReports: normalizeBoolean(
        storage?.separateReports,
        DEFAULT_MEMORY_DREAMING_SEPARATE_REPORTS,
      ),
    },
    execution: {
      defaults: defaultExecution,
    },
    phases: {
      light: {
        enabled: normalizeBoolean(light?.enabled, true),
        cron: frequency,
        lookbackDays: normalizeNonNegativeInt(
          light?.lookbackDays,
          DEFAULT_MEMORY_LIGHT_DREAMING_LOOKBACK_DAYS,
        ),
        limit: normalizeNonNegativeInt(light?.limit, DEFAULT_MEMORY_LIGHT_DREAMING_LIMIT),
        dedupeSimilarity: normalizeSimilarity(
          light?.dedupeSimilarity,
          DEFAULT_MEMORY_LIGHT_DREAMING_DEDUPE_SIMILARITY,
        ),
        sources: normalizeStringArray(
          light?.sources,
          ["daily", "sessions", "recall"] as const,
          DEFAULT_MEMORY_LIGHT_DREAMING_SOURCES,
        ),
        execution: resolveExecutionConfig(light?.execution, {
          ...defaultExecution,
          speed: "fast",
          thinking: "low",
          budget: "cheap",
        }),
      },
      deep: {
        enabled: normalizeBoolean(deep?.enabled, true),
        cron: frequency,
        limit: normalizeNonNegativeInt(deep?.limit, DEFAULT_MEMORY_DEEP_DREAMING_LIMIT),
        minScore: normalizeScore(deep?.minScore, DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE),
        minRecallCount: normalizeNonNegativeInt(
          deep?.minRecallCount,
          DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT,
        ),
        minUniqueQueries: normalizeNonNegativeInt(
          deep?.minUniqueQueries,
          DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES,
        ),
        recencyHalfLifeDays: normalizeNonNegativeInt(
          deep?.recencyHalfLifeDays,
          DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS,
        ),
        ...(typeof maxAgeDays === "number"
          ? { maxAgeDays }
          : typeof DEFAULT_MEMORY_DEEP_DREAMING_MAX_AGE_DAYS === "number"
            ? { maxAgeDays: DEFAULT_MEMORY_DEEP_DREAMING_MAX_AGE_DAYS }
            : {}),
<<<<<<< HEAD
=======
        maxPromotedSnippetTokens:
          maxPromotedSnippetTokens ?? DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS,
>>>>>>> upstream/main
        sources: normalizeStringArray(
          deep?.sources,
          ["daily", "memory", "sessions", "logs", "recall"] as const,
          DEFAULT_MEMORY_DEEP_DREAMING_SOURCES,
        ),
        recovery: {
          enabled: normalizeBoolean(
            deepRecovery?.enabled,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_ENABLED,
          ),
          triggerBelowHealth: normalizeScore(
            deepRecovery?.triggerBelowHealth,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_TRIGGER_BELOW_HEALTH,
          ),
          lookbackDays: normalizeNonNegativeInt(
            deepRecovery?.lookbackDays,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_LOOKBACK_DAYS,
          ),
          maxRecoveredCandidates: normalizeNonNegativeInt(
            deepRecovery?.maxRecoveredCandidates,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MAX_CANDIDATES,
          ),
          minRecoveryConfidence: normalizeScore(
            deepRecovery?.minRecoveryConfidence,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_MIN_CONFIDENCE,
          ),
          autoWriteMinConfidence: normalizeScore(
            deepRecovery?.autoWriteMinConfidence,
            DEFAULT_MEMORY_DEEP_DREAMING_RECOVERY_AUTO_WRITE_MIN_CONFIDENCE,
          ),
        },
        execution: resolveExecutionConfig(deep?.execution, {
          ...defaultExecution,
          speed: "balanced",
          thinking: "high",
          budget: "medium",
        }),
      },
      rem: {
        enabled: normalizeBoolean(rem?.enabled, true),
        cron: frequency,
        lookbackDays: normalizeNonNegativeInt(
          rem?.lookbackDays,
          DEFAULT_MEMORY_REM_DREAMING_LOOKBACK_DAYS,
        ),
        limit: normalizeNonNegativeInt(rem?.limit, DEFAULT_MEMORY_REM_DREAMING_LIMIT),
        minPatternStrength: normalizeScore(
          rem?.minPatternStrength,
          DEFAULT_MEMORY_REM_DREAMING_MIN_PATTERN_STRENGTH,
        ),
        sources: normalizeStringArray(
          rem?.sources,
          ["memory", "daily", "deep"] as const,
          DEFAULT_MEMORY_REM_DREAMING_SOURCES,
        ),
        execution: resolveExecutionConfig(rem?.execution, {
          ...defaultExecution,
          speed: "slow",
          thinking: "high",
          budget: "expensive",
        }),
      },
    },
  };
}

export function resolveMemoryDeepDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryDeepDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
} {
  const resolved = resolveMemoryDreamingConfig(params);
  return {
    ...resolved.phases.deep,
    enabled: resolved.enabled && resolved.phases.deep.enabled,
    ...(resolved.timezone ? { timezone: resolved.timezone } : {}),
    verboseLogging: resolved.verboseLogging,
    storage: resolved.storage,
  };
}

export function resolveMemoryLightDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryLightDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
} {
  const resolved = resolveMemoryDreamingConfig(params);
  return {
    ...resolved.phases.light,
    enabled: resolved.enabled && resolved.phases.light.enabled,
    ...(resolved.timezone ? { timezone: resolved.timezone } : {}),
    verboseLogging: resolved.verboseLogging,
    storage: resolved.storage,
  };
}

export function resolveMemoryRemDreamingConfig(params: {
  pluginConfig?: Record<string, unknown>;
  cfg?: OpenClawConfig;
}): MemoryRemDreamingConfig & {
  timezone?: string;
  verboseLogging: boolean;
  storage: MemoryDreamingStorageConfig;
} {
  const resolved = resolveMemoryDreamingConfig(params);
  return {
    ...resolved.phases.rem,
    enabled: resolved.enabled && resolved.phases.rem.enabled,
    ...(resolved.timezone ? { timezone: resolved.timezone } : {}),
    verboseLogging: resolved.verboseLogging,
    storage: resolved.storage,
  };
}

export function formatMemoryDreamingDay(epochMs: number, timezone?: string): string {
  if (!timezone) {
    return formatLocalIsoDay(epochMs);
  }
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(epochMs));
    const values = new Map(parts.map((part) => [part.type, part.value]));
    const year = values.get("year");
    const month = values.get("month");
    const day = values.get("day");
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fall back to host-local day for invalid or unsupported timezones.
  }
  return formatLocalIsoDay(epochMs);
}

export function isSameMemoryDreamingDay(
  firstEpochMs: number,
  secondEpochMs: number,
  timezone?: string,
): boolean {
  return (
    formatMemoryDreamingDay(firstEpochMs, timezone) ===
    formatMemoryDreamingDay(secondEpochMs, timezone)
  );
}

<<<<<<< HEAD
export function resolveMemoryDreamingWorkspaces(cfg: OpenClawConfig): MemoryDreamingWorkspace[] {
=======
export function resolveMemoryDreamingWorkspaces(
  cfg: OpenClawConfig,
  options: MemoryDreamingWorkspaceOptions = {},
): MemoryDreamingWorkspace[] {
>>>>>>> upstream/main
  const configured = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  const agentIds: string[] = [];
  const seenAgents = new Set<string>();
  for (const entry of configured) {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string") {
      continue;
    }
<<<<<<< HEAD
    const id = entry.id.trim().toLowerCase();
=======
    const id = normalizeOptionalLowercaseString(entry.id);
>>>>>>> upstream/main
    if (!id || seenAgents.has(id)) {
      continue;
    }
    seenAgents.add(id);
    agentIds.push(id);
  }
  if (agentIds.length === 0) {
    agentIds.push(resolveDefaultAgentId(cfg));
  }

  const byWorkspace = new Map<string, MemoryDreamingWorkspace>();
<<<<<<< HEAD
  for (const agentId of agentIds) {
    if (!resolveMemorySearchConfig(cfg, agentId)) {
      continue;
    }
    const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId)?.trim();
    if (!workspaceDir) {
      continue;
    }
    const key = normalizePathForComparison(workspaceDir);
    const existing = byWorkspace.get(key);
    if (existing) {
      existing.agentIds.push(agentId);
      continue;
    }
    byWorkspace.set(key, { workspaceDir, agentIds: [agentId] });
  }
=======
  const addWorkspace = (workspaceDirRaw: string | undefined, agentIdRaw: string): void => {
    const workspaceDir = workspaceDirRaw?.trim();
    if (!workspaceDir) {
      return;
    }
    const agentId = normalizeOptionalLowercaseString(agentIdRaw) || resolveDefaultAgentId(cfg);
    const key = normalizePathForComparison(workspaceDir);
    const existing = byWorkspace.get(key);
    if (existing) {
      if (!existing.agentIds.includes(agentId)) {
        existing.agentIds.push(agentId);
      }
      return;
    }
    byWorkspace.set(key, { workspaceDir, agentIds: [agentId] });
  };

  for (const agentId of agentIds) {
    addWorkspace(resolveAgentWorkspaceDir(cfg, agentId, options.env), agentId);
  }
  addWorkspace(
    options.primaryWorkspaceDir ?? undefined,
    options.primaryAgentId ?? resolveDefaultAgentId(cfg),
  );
>>>>>>> upstream/main
  return [...byWorkspace.values()];
}
