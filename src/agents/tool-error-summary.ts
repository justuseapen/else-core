<<<<<<< HEAD
export type ToolErrorSummary = {
  toolName: string;
  meta?: string;
  error?: string;
  timedOut?: boolean;
  mutatingAction?: boolean;
  actionFingerprint?: string;
=======
/**
 * Compact tool error summary types.
 *
 * Stores failure metadata used by transcripts, retry behavior, and mutation recovery logic.
 */
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import type { FileTarget } from "./tool-mutation.js";

export type ToolErrorSummary = {
  toolName: string;
  meta?: string;
  errorCode?: string;
  error?: string;
  timedOut?: boolean;
  middlewareError?: boolean;
  mutatingAction?: boolean;
  actionFingerprint?: string;
  fileTarget?: FileTarget;
>>>>>>> upstream/main
};

const EXEC_LIKE_TOOL_NAMES = new Set(["exec", "bash"]);

<<<<<<< HEAD
export function isExecLikeToolName(toolName: string): boolean {
  return EXEC_LIKE_TOOL_NAMES.has(toolName.trim().toLowerCase());
=======
/** Detects shell-execution tools that share retry and mutation semantics. */
export function isExecLikeToolName(toolName: string): boolean {
  return EXEC_LIKE_TOOL_NAMES.has(normalizeOptionalLowercaseString(toolName) ?? "");
>>>>>>> upstream/main
}
