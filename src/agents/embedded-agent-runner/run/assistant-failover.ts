<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { OpenClawConfig } from "../../../config/config.js";
import { sanitizeForLog } from "../../../terminal/ansi.js";
import type { AuthProfileFailureReason } from "../../auth-profiles.js";
import { FailoverError, resolveFailoverStatus } from "../../failover-error.js";
=======
/**
 * Handles assistant-stage failover decisions during embedded-agent attempts.
 */
import { sanitizeForLog } from "../../../../packages/terminal-core/src/ansi.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { AssistantMessage } from "../../../llm/types.js";
import type { AuthProfileFailureReason } from "../../auth-profiles.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
import {
  formatAssistantErrorText,
  formatBillingErrorMessage,
  isTimeoutErrorMessage,
  type FailoverReason,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
} from "../../pi-embedded-helpers.js";
=======
} from "../../embedded-agent-helpers.js";
import { FailoverError, resolveFailoverStatus } from "../../failover-error.js";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
import {
  mergeRetryFailoverReason,
  resolveRunFailoverDecision,
  type AssistantFailoverDecision,
} from "./failover-policy.js";

type AssistantFailoverOutcome =
  | {
      action: "continue_normal";
      overloadProfileRotations: number;
    }
  | {
      action: "retry";
      overloadProfileRotations: number;
      lastRetryFailoverReason: FailoverReason | null;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
=======
      retryKind?: "same_model_idle_timeout";
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
    }
  | {
      action: "throw";
      overloadProfileRotations: number;
      error: FailoverError;
    };

<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
export async function handleAssistantFailover(params: {
  initialDecision: AssistantFailoverDecision;
  aborted: boolean;
=======
/**
 * Applies an assistant-stage failover decision and returns the next run action.
 * It owns auth-profile rotation, overload/rate-limit escalation, same-model
 * idle-timeout retry, and FailoverError construction for outer model fallback.
 */
export async function handleAssistantFailover(params: {
  initialDecision: AssistantFailoverDecision;
  aborted: boolean;
  externalAbort: boolean;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
  fallbackConfigured: boolean;
  failoverFailure: boolean;
  failoverReason: FailoverReason | null;
  timedOut: boolean;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
  timedOutDuringCompaction: boolean;
=======
  idleTimedOut: boolean;
  timedOutDuringCompaction: boolean;
  timedOutDuringToolExecution: boolean;
  allowSameModelIdleTimeoutRetry: boolean;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
  assistantProfileFailureReason: AuthProfileFailureReason | null;
  lastProfileId?: string;
  modelId: string;
  provider: string;
  activeErrorContext: { provider: string; model: string };
  lastAssistant: AssistantMessage | undefined;
  config: OpenClawConfig | undefined;
  sessionKey?: string;
  authFailure: boolean;
  rateLimitFailure: boolean;
  billingFailure: boolean;
  cloudCodeAssistFormatError: boolean;
  isProbeSession: boolean;
  overloadProfileRotations: number;
  overloadProfileRotationLimit: number;
  previousRetryFailoverReason: FailoverReason | null;
  logAssistantFailoverDecision: (
    decision: "rotate_profile" | "fallback_model" | "surface_error",
    extra?: { status?: number },
  ) => void;
  warn: (message: string) => void;
  maybeMarkAuthProfileFailure: (failure: {
    profileId?: string;
    reason?: AuthProfileFailureReason | null;
    modelId?: string;
  }) => Promise<void>;
  maybeEscalateRateLimitProfileFallback: (params: {
    failoverProvider: string;
    failoverModel: string;
    logFallbackDecision: (decision: "fallback_model", extra?: { status?: number }) => void;
  }) => void;
  maybeBackoffBeforeOverloadFailover: (reason: FailoverReason | null) => Promise<void>;
  advanceAuthProfile: () => Promise<boolean>;
}): Promise<AssistantFailoverOutcome> {
  let overloadProfileRotations = params.overloadProfileRotations;
  let decision = params.initialDecision;
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts

  if (decision.action === "rotate_profile") {
    if (params.lastProfileId) {
      const reason = params.timedOut ? "timeout" : params.assistantProfileFailureReason;
      await params.maybeMarkAuthProfileFailure({
        profileId: params.lastProfileId,
        reason,
        modelId: params.modelId,
      });
      if (params.timedOut && !params.isProbeSession) {
        params.warn(`Profile ${params.lastProfileId} timed out. Trying next account...`);
      }
      if (params.cloudCodeAssistFormatError) {
        params.warn(
          `Profile ${params.lastProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`,
        );
      }
    }
=======
  const sameModelIdleTimeoutRetry = (): AssistantFailoverOutcome => {
    params.warn(
      `[llm-idle-timeout] ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} produced no reply before the idle watchdog; retrying same model`,
    );
    return {
      action: "retry",
      overloadProfileRotations,
      retryKind: "same_model_idle_timeout",
      lastRetryFailoverReason: mergeRetryFailoverReason({
        previous: params.previousRetryFailoverReason,
        failoverReason: params.failoverReason,
        timedOut: true,
      }),
    };
  };

  if (decision.action === "rotate_profile") {
    const failedProfileId = params.lastProfileId;
    const timeoutFailure = params.timedOut || params.idleTimedOut;
    const failureReason = params.assistantProfileFailureReason;
    const markFailedProfile = async () => {
      if (!failedProfileId || !failureReason) {
        return;
      }
      try {
        await params.maybeMarkAuthProfileFailure({
          profileId: failedProfileId,
          reason: failureReason,
          modelId: params.modelId,
        });
      } catch (err) {
        params.warn(`profile failure mark failed: ${String(err)}`);
      }
    };
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts

    if (params.failoverReason === "overloaded") {
      overloadProfileRotations += 1;
      if (
        overloadProfileRotations > params.overloadProfileRotationLimit &&
        params.fallbackConfigured
      ) {
        const status = resolveFailoverStatus("overloaded");
        params.warn(
          `overload profile rotation cap reached for ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`,
        );
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
=======
        await markFailedProfile();
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
        params.logAssistantFailoverDecision("fallback_model", { status });
        return {
          action: "throw",
          overloadProfileRotations,
          error: new FailoverError(
            "The AI service is temporarily overloaded. Please try again in a moment.",
            {
              reason: "overloaded",
              provider: params.activeErrorContext.provider,
              model: params.activeErrorContext.model,
              profileId: params.lastProfileId,
              status,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
=======
              rawError: params.lastAssistant?.errorMessage?.trim(),
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
            },
          ),
        };
      }
    }

    if (params.failoverReason === "rate_limit") {
      params.maybeEscalateRateLimitProfileFallback({
        failoverProvider: params.activeErrorContext.provider,
        failoverModel: params.activeErrorContext.model,
        logFallbackDecision: params.logAssistantFailoverDecision,
      });
    }

    const rotated = await params.advanceAuthProfile();
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
    if (rotated) {
=======
    const markFailedProfilePromise = markFailedProfile();
    if (timeoutFailure && !params.isProbeSession && failedProfileId) {
      const timeoutLabel = params.idleTimedOut ? "idle timeout (model silent)" : "timed out";
      params.warn(`Profile ${failedProfileId} ${timeoutLabel}. Trying next account...`);
    }
    if (params.cloudCodeAssistFormatError && failedProfileId) {
      params.warn(
        `Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`,
      );
    }
    if (rotated) {
      // Marking the failed profile is non-blocking after rotation succeeds; the
      // retry can proceed with the next profile while the failure record settles.
      void markFailedProfilePromise;
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
      params.logAssistantFailoverDecision("rotate_profile");
      await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
      return {
        action: "retry",
        overloadProfileRotations,
        lastRetryFailoverReason: mergeRetryFailoverReason({
          previous: params.previousRetryFailoverReason,
          failoverReason: params.failoverReason,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
          timedOut: params.timedOut,
        }),
      };
    }

    decision = resolveRunFailoverDecision({
      stage: "assistant",
      aborted: params.aborted,
=======
          timedOut: params.timedOut || params.idleTimedOut,
        }),
      };
    }
    await markFailedProfilePromise;
    if (params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) {
      return sameModelIdleTimeoutRetry();
    }

    decision = resolveRunFailoverDecision({
      stage: "assistant",
      allowFormatRetry: params.cloudCodeAssistFormatError,
      aborted: params.aborted,
      externalAbort: params.externalAbort,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
      fallbackConfigured: params.fallbackConfigured,
      failoverFailure: params.failoverFailure,
      failoverReason: params.failoverReason,
      timedOut: params.timedOut,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
      timedOutDuringCompaction: params.timedOutDuringCompaction,
=======
      idleTimedOut: params.idleTimedOut,
      timedOutDuringCompaction: params.timedOutDuringCompaction,
      timedOutDuringToolExecution: params.timedOutDuringToolExecution,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
      profileRotated: true,
    });
  }

  if (decision.action === "fallback_model") {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
    await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
    const message =
      (params.lastAssistant
        ? formatAssistantErrorText(params.lastAssistant, {
            cfg: params.config,
            sessionKey: params.sessionKey,
            provider: params.activeErrorContext.provider,
            model: params.activeErrorContext.model,
          })
        : undefined) ||
      params.lastAssistant?.errorMessage?.trim() ||
      (params.timedOut
        ? "LLM request timed out."
        : params.rateLimitFailure
          ? "LLM request rate limited."
          : params.billingFailure
            ? formatBillingErrorMessage(
                params.activeErrorContext.provider,
                params.activeErrorContext.model,
              )
            : params.authFailure
              ? "LLM request unauthorized."
              : "LLM request failed.");
    const status =
      resolveFailoverStatus(decision.reason) ?? (isTimeoutErrorMessage(message) ? 408 : undefined);
    params.logAssistantFailoverDecision("fallback_model", { status });
=======
    // Backoff runs before throwing so the outer fallback model starts after the
    // provider-specific overload delay.
    await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
    const message = resolveAssistantFailoverErrorMessage(params);
    const status =
      resolveFailoverStatus(decision.reason) ?? (isTimeoutErrorMessage(message) ? 408 : undefined);
    params.logAssistantFailoverDecision("fallback_model", { status });
    const shouldSuspend =
      Boolean(params.sessionKey) &&
      (decision.reason === "rate_limit" || decision.reason === "billing");

>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
    return {
      action: "throw",
      overloadProfileRotations,
      error: new FailoverError(message, {
        reason: decision.reason,
        provider: params.activeErrorContext.provider,
        model: params.activeErrorContext.model,
        profileId: params.lastProfileId,
        status,
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
=======
        rawError: params.lastAssistant?.errorMessage?.trim(),
        suspend: shouldSuspend,
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
      }),
    };
  }

  if (decision.action === "surface_error") {
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
    params.logAssistantFailoverDecision("surface_error");
=======
    if (!params.externalAbort && params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) {
      return sameModelIdleTimeoutRetry();
    }
    params.logAssistantFailoverDecision("surface_error");
    // Only current provider failures throw here. External aborts, timeout
    // payload synthesis, and stale classified text without failoverFailure
    // keep the normal payload path.
    if (!params.externalAbort && !params.timedOut && params.failoverFailure) {
      const message = resolveAssistantFailoverErrorMessage(params);
      const reason = resolveSurfaceErrorReason(decision.reason, params);
      const status =
        resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : undefined);
      const shouldSuspend =
        Boolean(params.sessionKey) && (reason === "rate_limit" || reason === "billing");

      return {
        action: "throw",
        overloadProfileRotations,
        error: new FailoverError(message, {
          reason,
          provider: params.activeErrorContext.provider,
          model: params.activeErrorContext.model,
          profileId: params.lastProfileId,
          status,
          rawError: params.lastAssistant?.errorMessage?.trim(),
          suspend: shouldSuspend,
        }),
      };
    }
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
  }

  return {
    action: "continue_normal",
    overloadProfileRotations,
  };
}
<<<<<<< HEAD:src/agents/pi-embedded-runner/run/assistant-failover.ts
=======

function resolveAssistantFailoverErrorMessage(params: {
  lastAssistant: AssistantMessage | undefined;
  config: OpenClawConfig | undefined;
  sessionKey?: string;
  activeErrorContext: { provider: string; model: string };
  timedOut: boolean;
  idleTimedOut: boolean;
  rateLimitFailure: boolean;
  billingFailure: boolean;
  authFailure: boolean;
}): string {
  const timeoutFailure = params.timedOut || params.idleTimedOut;
  return (
    (params.lastAssistant
      ? formatAssistantErrorText(params.lastAssistant, {
          cfg: params.config,
          sessionKey: params.sessionKey,
          provider: params.activeErrorContext.provider,
          model: params.activeErrorContext.model,
        })
      : undefined) ||
    params.lastAssistant?.errorMessage?.trim() ||
    (timeoutFailure
      ? "LLM request timed out."
      : params.rateLimitFailure
        ? "LLM request rate limited."
        : params.billingFailure
          ? formatBillingErrorMessage(
              params.activeErrorContext.provider,
              params.activeErrorContext.model,
            )
          : params.authFailure
            ? "LLM request unauthorized."
            : "LLM request failed.")
  );
}

function resolveSurfaceErrorReason(
  declared: FailoverReason | null,
  params: {
    billingFailure: boolean;
    authFailure: boolean;
    rateLimitFailure: boolean;
  },
): FailoverReason {
  if (declared) {
    return declared;
  }
  if (params.billingFailure) {
    return "billing";
  }
  if (params.authFailure) {
    return "auth";
  }
  if (params.rateLimitFailure) {
    return "rate_limit";
  }
  return "unknown";
}
>>>>>>> upstream/main:src/agents/embedded-agent-runner/run/assistant-failover.ts
