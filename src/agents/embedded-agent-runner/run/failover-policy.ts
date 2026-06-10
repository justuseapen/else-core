<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
import type { FailoverReason } from "../../pi-embedded-helpers.js";

export type RunFailoverDecisionAction =
  | "continue_normal"
  | "rotate_profile"
  | "fallback_model"
  | "surface_error"
  | "return_error_payload";

=======
/**
 * Resolves retry, fallback, and terminal failover decisions for a run.
 */
import type { FailoverReason } from "../../embedded-agent-helpers.js";

/** Failover action selected for one embedded run failure decision point. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
export type RunFailoverDecision =
  | {
      action: "continue_normal";
    }
  | {
      action: "rotate_profile" | "surface_error";
      reason: FailoverReason | null;
    }
  | {
      action: "fallback_model";
      reason: FailoverReason;
    }
  | {
      action: "return_error_payload";
    };

export type RetryLimitFailoverDecision = Extract<
  RunFailoverDecision,
  { action: "fallback_model" | "return_error_payload" }
>;

export type PromptFailoverDecision = Extract<
  RunFailoverDecision,
  { action: "rotate_profile" | "fallback_model" | "surface_error" }
>;

export type AssistantFailoverDecision = Extract<
  RunFailoverDecision,
  { action: "continue_normal" | "rotate_profile" | "fallback_model" | "surface_error" }
>;

type RetryLimitDecisionParams = {
  stage: "retry_limit";
  fallbackConfigured: boolean;
  failoverReason: FailoverReason | null;
};

type PromptDecisionParams = {
  stage: "prompt";
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
  aborted: boolean;
  fallbackConfigured: boolean;
  failoverFailure: boolean;
  failoverReason: FailoverReason | null;
=======
  allowFormatRetry?: boolean;
  aborted: boolean;
  externalAbort: boolean;
  fallbackConfigured: boolean;
  failoverFailure: boolean;
  failoverReason: FailoverReason | null;
  harnessOwnsTransport?: boolean;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
  profileRotated: boolean;
};

type AssistantDecisionParams = {
  stage: "assistant";
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
  aborted: boolean;
=======
  allowFormatRetry?: boolean;
  aborted: boolean;
  externalAbort: boolean;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
  fallbackConfigured: boolean;
  failoverFailure: boolean;
  failoverReason: FailoverReason | null;
  timedOut: boolean;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
  timedOutDuringCompaction: boolean;
=======
  idleTimedOut: boolean;
  timedOutDuringCompaction: boolean;
  timedOutDuringToolExecution: boolean;
  harnessOwnsTransport?: boolean;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
  profileRotated: boolean;
};

export type RunFailoverDecisionParams =
  | RetryLimitDecisionParams
  | PromptDecisionParams
  | AssistantDecisionParams;

function shouldEscalateRetryLimit(reason: FailoverReason | null): boolean {
  return Boolean(
    reason &&
    reason !== "timeout" &&
    reason !== "model_not_found" &&
    reason !== "format" &&
    reason !== "session_expired",
  );
}

<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
function shouldRotatePrompt(params: PromptDecisionParams): boolean {
  return params.failoverFailure && params.failoverReason !== "timeout";
}

function shouldRotateAssistant(params: AssistantDecisionParams): boolean {
  return (
    (!params.aborted && (params.failoverFailure || params.failoverReason !== null)) ||
    (params.timedOut && !params.timedOutDuringCompaction)
  );
}

=======
function isTerminalFormatFailure(params: {
  allowFormatRetry?: boolean;
  failoverFailure: boolean;
  failoverReason: FailoverReason | null;
}): boolean {
  return (
    params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true
  );
}

function shouldRotatePrompt(params: PromptDecisionParams): boolean {
  return (
    params.failoverFailure &&
    params.failoverReason !== "timeout" &&
    !isTerminalFormatFailure(params)
  );
}

function isAssistantTimeoutFailure(params: AssistantDecisionParams): boolean {
  return (
    params.idleTimedOut ||
    (params.timedOut && !params.timedOutDuringCompaction && !params.timedOutDuringToolExecution)
  );
}

function isConcreteNonTimeoutAssistantFailure(params: AssistantDecisionParams): boolean {
  return (
    params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout"
  );
}

function shouldRotateAssistant(params: AssistantDecisionParams): boolean {
  if (isTerminalFormatFailure(params)) {
    return false;
  }
  const timeoutFailure = isAssistantTimeoutFailure(params);
  const harnessOwnedTimeout =
    params.harnessOwnsTransport && (timeoutFailure || params.failoverReason === "timeout");
  if (harnessOwnedTimeout && !isConcreteNonTimeoutAssistantFailure(params)) {
    return false;
  }
  return (!params.aborted && params.failoverFailure) || timeoutFailure;
}

function assistantFallbackReason(params: AssistantDecisionParams): FailoverReason {
  const failoverReason = params.failoverReason;
  if (params.failoverFailure && failoverReason && failoverReason !== "timeout") {
    return failoverReason;
  }
  return isAssistantTimeoutFailure(params) ? "timeout" : (failoverReason ?? "unknown");
}

/** Preserves an existing retry reason unless the current attempt produced a stronger signal. */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
export function mergeRetryFailoverReason(params: {
  previous: FailoverReason | null;
  failoverReason: FailoverReason | null;
  timedOut?: boolean;
}): FailoverReason | null {
  return params.failoverReason ?? (params.timedOut ? "timeout" : null) ?? params.previous;
}

export function resolveRunFailoverDecision(
  params: RetryLimitDecisionParams,
): RetryLimitFailoverDecision;
export function resolveRunFailoverDecision(params: PromptDecisionParams): PromptFailoverDecision;
export function resolveRunFailoverDecision(
  params: AssistantDecisionParams,
): AssistantFailoverDecision;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
=======
/**
 * Chooses whether a run should rotate auth profile, switch model fallback,
 * surface the error, continue normally, or return an error payload. Prompt,
 * assistant, and retry-limit stages intentionally use different action sets.
 */
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
export function resolveRunFailoverDecision(params: RunFailoverDecisionParams): RunFailoverDecision {
  if (params.stage === "retry_limit") {
    if (params.fallbackConfigured && shouldEscalateRetryLimit(params.failoverReason)) {
      const fallbackReason = params.failoverReason ?? "unknown";
      return {
        action: "fallback_model",
        reason: fallbackReason,
      };
    }
    return {
      action: "return_error_payload",
    };
  }

  if (params.stage === "prompt") {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
=======
    if (params.externalAbort) {
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    }
    if (params.harnessOwnsTransport && params.failoverReason === "timeout") {
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    }
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
    if (!params.profileRotated && shouldRotatePrompt(params)) {
      return {
        action: "rotate_profile",
        reason: params.failoverReason,
      };
    }
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
    if (params.fallbackConfigured && params.failoverFailure) {
=======
    if (params.fallbackConfigured && params.failoverFailure && !isTerminalFormatFailure(params)) {
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
      return {
        action: "fallback_model",
        reason: params.failoverReason ?? "unknown",
      };
    }
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  }

<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
=======
  if (params.externalAbort) {
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  }
  if (isTerminalFormatFailure(params)) {
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  }
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
  const assistantShouldRotate = shouldRotateAssistant(params);
  if (!params.profileRotated && assistantShouldRotate) {
    return {
      action: "rotate_profile",
      reason: params.failoverReason,
    };
  }
  if (assistantShouldRotate && params.fallbackConfigured) {
    return {
      action: "fallback_model",
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/failover-policy.ts
      reason: params.timedOut ? "timeout" : (params.failoverReason ?? "unknown"),
=======
      reason: assistantFallbackReason(params),
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/failover-policy.ts
    };
  }
  if (!assistantShouldRotate) {
    return {
      action: "continue_normal",
    };
  }
  return {
    action: "surface_error",
    reason: params.failoverReason,
  };
}
