<<<<<<< HEAD
export type TelegramCustomCommandInput = {
  command?: string | null;
  description?: string | null;
};

export type TelegramCustomCommandIssue = {
  index: number;
  field: "command" | "description";
  message: string;
};
const TELEGRAM_COMMAND_NAME_PATTERN_VALUE = /^[a-z0-9_]{1,32}$/;

function normalizeTelegramCommandNameImpl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const withoutSlash = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return withoutSlash.trim().toLowerCase().replace(/-/g, "_");
}

function normalizeTelegramCommandDescriptionImpl(value: string): string {
  return value.trim();
=======
/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use plugin-local Telegram command config handling for new plugin code.
 */

import {
  normalizeCommandDescription,
  normalizeSlashCommandName,
  resolveCustomCommands,
} from "../shared/custom-command-config.js";

/** Raw Telegram bot command entry from config. */
export type TelegramCustomCommandInput = {
  /** User-provided command name; leading slash is optional and removed during normalization. */
  command?: string | null;
  /** User-provided Bot API description, trimmed before validation. */
  description?: string | null;
};

/** Validation issue returned for one Telegram custom command entry. */
export type TelegramCustomCommandIssue = {
  /** Zero-based index of the command entry that failed validation. */
  index: number;
  /** Field that should be corrected in the raw command entry. */
  field: "command" | "description";
  /** Operator-facing validation message with the normalized command when available. */
  message: string;
};
const TELEGRAM_COMMAND_NAME_PATTERN_VALUE = /^[a-z0-9_]{1,32}$/;
const TELEGRAM_CUSTOM_COMMAND_CONFIG = {
  label: "Telegram",
  pattern: TELEGRAM_COMMAND_NAME_PATTERN_VALUE,
  patternDescription: "use a-z, 0-9, underscore; max 32 chars",
} as const;

function normalizeTelegramCommandNameImpl(value: string): string {
  return normalizeSlashCommandName(value);
}

function normalizeTelegramCommandDescriptionImpl(value: string): string {
  return normalizeCommandDescription(value);
>>>>>>> upstream/main
}

function resolveTelegramCustomCommandsImpl(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
  checkDuplicates?: boolean;
}): {
  commands: Array<{ command: string; description: string }>;
  issues: TelegramCustomCommandIssue[];
} {
<<<<<<< HEAD
  const entries = Array.isArray(params.commands) ? params.commands : [];
  const reserved = params.reservedCommands ?? new Set<string>();
  const checkReserved = params.checkReserved !== false;
  const checkDuplicates = params.checkDuplicates !== false;
  const seen = new Set<string>();
  const resolved: Array<{ command: string; description: string }> = [];
  const issues: TelegramCustomCommandIssue[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const normalized = normalizeTelegramCommandNameImpl(String(entry?.command ?? ""));
    if (!normalized) {
      issues.push({
        index,
        field: "command",
        message: "Telegram custom command is missing a command name.",
      });
      continue;
    }
    if (!TELEGRAM_COMMAND_NAME_PATTERN_VALUE.test(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" is invalid (use a-z, 0-9, underscore; max 32 chars).`,
      });
      continue;
    }
    if (checkReserved && reserved.has(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" conflicts with a native command.`,
      });
      continue;
    }
    if (checkDuplicates && seen.has(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" is duplicated.`,
      });
      continue;
    }
    const description = normalizeTelegramCommandDescriptionImpl(String(entry?.description ?? ""));
    if (!description) {
      issues.push({
        index,
        field: "description",
        message: `Telegram custom command "/${normalized}" is missing a description.`,
      });
      continue;
    }
    if (checkDuplicates) {
      seen.add(normalized);
    }
    resolved.push({ command: normalized, description });
  }

  return { commands: resolved, issues };
}

=======
  // Keep the deprecated SDK subpath on the shared command validator so config,
  // doctor, and plugin-local Telegram flows report the same normalized issues.
  return resolveCustomCommands({
    ...params,
    config: TELEGRAM_CUSTOM_COMMAND_CONFIG,
  });
}

/** Returns the Telegram command-name regex accepted by Bot API menu commands. */
>>>>>>> upstream/main
export function getTelegramCommandNamePattern(): RegExp {
  return TELEGRAM_COMMAND_NAME_PATTERN_VALUE;
}

<<<<<<< HEAD
export const TELEGRAM_COMMAND_NAME_PATTERN = TELEGRAM_COMMAND_NAME_PATTERN_VALUE;

export function normalizeTelegramCommandName(value: string): string {
  return normalizeTelegramCommandNameImpl(value);
}

export function normalizeTelegramCommandDescription(value: string): string {
  return normalizeTelegramCommandDescriptionImpl(value);
}

export function resolveTelegramCustomCommands(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
=======
/** Telegram Bot API command-name pattern: a-z, 0-9, underscore, max 32 chars. */
export const TELEGRAM_COMMAND_NAME_PATTERN = TELEGRAM_COMMAND_NAME_PATTERN_VALUE;

/** Normalizes user-provided Telegram command names into Bot API form. */
export function normalizeTelegramCommandName(
  /** Raw command name; leading slash is optional and dashes become underscores. */
  value: string,
): string {
  return normalizeTelegramCommandNameImpl(value);
}

/** Normalizes Telegram command descriptions for Bot API menu registration. */
export function normalizeTelegramCommandDescription(
  /** Raw command description, trimmed without other text rewriting. */
  value: string,
): string {
  return normalizeTelegramCommandDescriptionImpl(value);
}

/** Validates and normalizes configured Telegram custom commands. */
export function resolveTelegramCustomCommands(params: {
  /** Raw configured commands to normalize and validate in order. */
  commands?: TelegramCustomCommandInput[] | null;
  /** Native command names that custom commands must not shadow when reserved checks are enabled. */
  reservedCommands?: Set<string>;
  /** Set false to allow names that overlap native commands. */
  checkReserved?: boolean;
  /** Set false to allow duplicate normalized custom command names. */
>>>>>>> upstream/main
  checkDuplicates?: boolean;
}): {
  commands: Array<{ command: string; description: string }>;
  issues: TelegramCustomCommandIssue[];
} {
  return resolveTelegramCustomCommandsImpl(params);
}
