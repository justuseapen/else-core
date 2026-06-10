<<<<<<< HEAD
import { collectChannelLegacyConfigRules } from "../channels/plugins/legacy-config.js";
=======
// Applies legacy config rules during load-time compatibility checks.
>>>>>>> upstream/main
import { LEGACY_CONFIG_RULES } from "./legacy.rules.js";
import type { LegacyConfigRule } from "./legacy.shared.js";
import type { LegacyConfigIssue } from "./types.js";

// Legacy checks use raw dotted paths so doctor can report exact config keys.
function getPathValue(root: Record<string, unknown>, path: string[]): unknown {
  let cursor: unknown = root;
  for (const key of path) {
    if (!cursor || typeof cursor !== "object") {
      return undefined;
    }
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return cursor;
}

<<<<<<< HEAD
=======
/** Finds legacy config issues using built-in rules plus optional caller rules. */
>>>>>>> upstream/main
export function findLegacyConfigIssues(
  raw: unknown,
  sourceRaw?: unknown,
  extraRules: LegacyConfigRule[] = [],
<<<<<<< HEAD
=======
  _touchedPaths?: ReadonlyArray<ReadonlyArray<string>>,
>>>>>>> upstream/main
): LegacyConfigIssue[] {
  if (!raw || typeof raw !== "object") {
    return [];
  }
  const root = raw as Record<string, unknown>;
  const sourceRoot =
    sourceRaw && typeof sourceRaw === "object" ? (sourceRaw as Record<string, unknown>) : root;
  const issues: LegacyConfigIssue[] = [];
<<<<<<< HEAD
  for (const rule of [
    ...LEGACY_CONFIG_RULES,
    ...collectChannelLegacyConfigRules(),
    ...extraRules,
  ]) {
=======
  for (const rule of [...LEGACY_CONFIG_RULES, ...extraRules]) {
>>>>>>> upstream/main
    const cursor = getPathValue(root, rule.path);
    if (cursor !== undefined && (!rule.match || rule.match(cursor, root))) {
      if (rule.requireSourceLiteral) {
        const sourceCursor = getPathValue(sourceRoot, rule.path);
        if (sourceCursor === undefined) {
          continue;
        }
        if (rule.match && !rule.match(sourceCursor, sourceRoot)) {
          continue;
        }
      }
      issues.push({ path: rule.path.join("."), message: rule.message });
    }
  }
  return issues;
}
