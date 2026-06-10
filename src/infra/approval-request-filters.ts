<<<<<<< HEAD
import { parseAgentSessionKey } from "../routing/session-key.js";
import { compileSafeRegex, testRegexWithBoundedInput } from "../security/safe-regex.js";

=======
// Filters approval requests by agent and session patterns.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { parseAgentSessionKey } from "../routing/session-key.js";
import { compileSafeRegex, testRegexWithBoundedInput } from "../security/safe-regex.js";

/** Minimal approval request identity used by agent/session filter checks. */
>>>>>>> upstream/main
export type ApprovalRequestFilterInput = {
  agentId?: string | null;
  sessionKey?: string | null;
};

<<<<<<< HEAD
=======
/** Matches session filters as literal substrings first, then bounded safe regexes. */
>>>>>>> upstream/main
export function matchesApprovalRequestSessionFilter(
  sessionKey: string,
  patterns: string[],
): boolean {
  return patterns.some((pattern) => {
    if (sessionKey.includes(pattern)) {
      return true;
    }
    const regex = compileSafeRegex(pattern);
    return regex ? testRegexWithBoundedInput(regex, sessionKey) : false;
  });
}

<<<<<<< HEAD
=======
/**
 * Applies optional approval request filters for agent ids and session keys.
 * Agent id can be parsed from the session key only when the caller opts in.
 */
>>>>>>> upstream/main
export function matchesApprovalRequestFilters(params: {
  request: ApprovalRequestFilterInput;
  agentFilter?: string[];
  sessionFilter?: string[];
  fallbackAgentIdFromSessionKey?: boolean;
}): boolean {
  if (params.agentFilter?.length) {
<<<<<<< HEAD
    const explicitAgentId = params.request.agentId?.trim() || undefined;
=======
    const explicitAgentId = normalizeOptionalString(params.request.agentId);
>>>>>>> upstream/main
    const sessionAgentId = params.fallbackAgentIdFromSessionKey
      ? (parseAgentSessionKey(params.request.sessionKey)?.agentId ?? undefined)
      : undefined;
    const agentId = explicitAgentId ?? sessionAgentId;
    if (!agentId || !params.agentFilter.includes(agentId)) {
      return false;
    }
  }

  if (params.sessionFilter?.length) {
<<<<<<< HEAD
    const sessionKey = params.request.sessionKey?.trim();
=======
    const sessionKey = normalizeOptionalString(params.request.sessionKey);
>>>>>>> upstream/main
    if (!sessionKey || !matchesApprovalRequestSessionFilter(sessionKey, params.sessionFilter)) {
      return false;
    }
  }

  return true;
}
