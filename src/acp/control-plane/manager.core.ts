<<<<<<< HEAD
import { resolveAgentTimeoutMs } from "../../agents/timeout.js";
import type { OpenClawConfig } from "../../config/config.js";
import { logVerbose } from "../../globals.js";
import { normalizeAgentId } from "../../routing/session-key.js";
import { isAcpSessionKey } from "../../sessions/session-key-utils.js";
import {
  createRunningTaskRun,
  completeTaskRunByRunId,
  failTaskRunByRunId,
  startTaskRunByRunId,
} from "../../tasks/task-executor.js";
import type { DeliveryContext } from "../../utils/delivery-context.js";
import {
  AcpRuntimeError,
  toAcpRuntimeError,
  withAcpRuntimeErrorBoundary,
} from "../runtime/errors.js";
import {
  createIdentityFromEnsure,
  identityEquals,
  isSessionIdentityPending,
  mergeSessionIdentity,
  resolveRuntimeResumeSessionId,
  resolveRuntimeHandleIdentifiersFromIdentity,
  resolveSessionIdentityFromMeta,
} from "../runtime/session-identity.js";
=======
/** Main ACP session manager implementation and public control-plane facade. */
>>>>>>> upstream/main
import type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
} from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { logVerbose } from "../../globals.js";
import { isAcpSessionKey } from "../../sessions/session-key-utils.js";
import { AcpRuntimeError } from "../runtime/errors.js";
import { runManagerCancelSession } from "./manager.cancel-session.js";
import { runManagerCloseSession } from "./manager.close-session.js";
import { reconcileManagerRuntimeSessionIdentifiers } from "./manager.identity-reconcile.js";
import { runManagerInitializeSession } from "./manager.initialize-session.js";
import {
  applyManagerRuntimeControls,
  resolveManagerRuntimeCapabilities,
} from "./manager.runtime-controls.js";
import { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import { ensureManagerRuntimeHandle } from "./manager.runtime-handle-ensure.js";
import {
  runResetManagerSessionRuntimeOptions,
  runSetManagerSessionConfigOption,
  runSetManagerSessionRuntimeMode,
  runUpdateManagerSessionRuntimeOptions,
  type RuntimeOptionCommandServices,
} from "./manager.runtime-options-commands.js";
import { runManagerStartupIdentityReconcile } from "./manager.startup-identity-reconcile.js";
import { runManagerGetSessionStatus } from "./manager.status.js";
import { runManagerTurn } from "./manager.turn-runner.js";
import {
  type AcpCloseSessionInput,
  type AcpCloseSessionResult,
  type AcpInitializeSessionInput,
  type AcpManagerObservabilitySnapshot,
  type AcpRunTurnInput,
  type AcpSessionManagerDeps,
  type AcpSessionResolution,
  type AcpSessionRuntimeOptions,
  type AcpSessionStatus,
  type AcpStartupIdentityReconcileResult,
  type ActiveTurnState,
  DEFAULT_DEPS,
  type SessionAcpMeta,
  type SessionEntry,
  type TurnLatencyStats,
} from "./manager.types.js";
import {
  canonicalizeAcpSessionKey,
  normalizeAcpErrorCode,
  normalizeActorKey,
  resolveMissingMetaError,
} from "./manager.utils.js";
import {
  normalizeText,
  validateRuntimeConfigOptionInput,
  validateRuntimeModeInput,
  validateRuntimeOptionPatch,
} from "./runtime-options.js";
import { SessionActorQueue } from "./session-actor-queue.js";

<<<<<<< HEAD
const ACP_TURN_TIMEOUT_GRACE_MS = 1_000;
const ACP_TURN_TIMEOUT_CLEANUP_GRACE_MS = 2_000;
const ACP_TURN_TIMEOUT_REASON = "turn-timeout";
const ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH = 160;
const ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH = 240;

function summarizeBackgroundTaskText(text: string): string {
  const normalized = normalizeText(text) ?? "ACP background task";
  if (normalized.length <= ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH) {
    return normalized;
  }
  return `${normalized.slice(0, ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH - 1)}…`;
}

function appendBackgroundTaskProgressSummary(current: string, chunk: string): string {
  const normalizedChunk = normalizeText(chunk)?.replace(/\s+/g, " ");
  if (!normalizedChunk) {
    return current;
  }
  const combined = current ? `${current} ${normalizedChunk}` : normalizedChunk;
  if (combined.length <= ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH) {
    return combined;
  }
  return `${combined.slice(0, ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH - 1)}…`;
}

function resolveBackgroundTaskFailureStatus(error: AcpRuntimeError): "failed" | "timed_out" {
  return /\btimed out\b/i.test(error.message) ? "timed_out" : "failed";
}

function resolveBackgroundTaskTerminalResult(progressSummary: string): {
  terminalOutcome?: "blocked";
  terminalSummary?: string;
} {
  const normalized = normalizeText(progressSummary)?.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return {};
  }
  const permissionDeniedMatch = normalized.match(
    /\b(?:write failed:\s*)?permission denied(?: for (?<path>\S+))?\.?/i,
  );
  if (permissionDeniedMatch) {
    const path = permissionDeniedMatch.groups?.path?.trim().replace(/[.,;:!?]+$/, "");
    return {
      terminalOutcome: "blocked",
      terminalSummary: path ? `Permission denied for ${path}.` : "Permission denied.",
    };
  }
  if (
    /\bneed a writable session\b/i.test(normalized) ||
    /\bfilesystem authorization\b/i.test(normalized) ||
    /`?apply_patch`?/i.test(normalized)
  ) {
    return {
      terminalOutcome: "blocked",
      terminalSummary: "Writable session or apply_patch authorization required.",
    };
  }
  return {};
}

type BackgroundTaskContext = {
  requesterSessionKey: string;
  requesterOrigin?: DeliveryContext;
  childSessionKey: string;
  runId: string;
  label?: string;
  task: string;
};

=======
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
>>>>>>> upstream/main
export class AcpSessionManager {
  private readonly actorQueue = new SessionActorQueue();
  private readonly runtimeHandles = new ManagerRuntimeHandleCache();
  private readonly activeTurnBySession = new Map<string, ActiveTurnState>();
  private readonly turnLatencyStats: TurnLatencyStats = {
    completed: 0,
    failed: 0,
    totalMs: 0,
    maxMs: 0,
  };
  private readonly errorCountsByCode = new Map<string, number>();
  private readonly deps: AcpSessionManagerDeps;

  constructor(deps: AcpSessionManagerDeps = DEFAULT_DEPS) {
    this.deps = deps;
  }

  resolveSession(params: { cfg: OpenClawConfig; sessionKey: string }): AcpSessionResolution {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      return {
        kind: "none",
        sessionKey,
      };
    }
    const acp = this.deps.readSessionEntry({
      cfg: params.cfg,
      sessionKey,
      clone: false,
    })?.acp;
    if (acp) {
      return {
        kind: "ready",
        sessionKey,
        meta: acp,
      };
    }
    if (isAcpSessionKey(sessionKey)) {
      return {
        kind: "stale",
        sessionKey,
        error: resolveMissingMetaError(sessionKey),
      };
    }
    return {
      kind: "none",
      sessionKey,
    };
  }

  getObservabilitySnapshot(cfg: OpenClawConfig): AcpManagerObservabilitySnapshot {
    const completedTurns = this.turnLatencyStats.completed + this.turnLatencyStats.failed;
    const averageLatencyMs =
      completedTurns > 0 ? Math.round(this.turnLatencyStats.totalMs / completedTurns) : 0;
    return {
      runtimeCache: this.runtimeHandles.getObservabilitySnapshot(cfg),
      turns: {
        active: this.activeTurnBySession.size,
        queueDepth: this.actorQueue.getTotalPendingCount(),
        completed: this.turnLatencyStats.completed,
        failed: this.turnLatencyStats.failed,
        averageLatencyMs,
        maxLatencyMs: this.turnLatencyStats.maxMs,
      },
      errorsByCode: Object.fromEntries(
        [...this.errorCountsByCode.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
      ),
    };
  }

  async reconcilePendingSessionIdentities(params: {
    cfg: OpenClawConfig;
  }): Promise<AcpStartupIdentityReconcileResult> {
    return await runManagerStartupIdentityReconcile({
      cfg: params.cfg,
      deps: this.deps,
      withSessionActor: this.withSessionActor.bind(this),
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
    });
  }

  async initializeSession(input: AcpInitializeSessionInput): Promise<{
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
  }> {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    await this.evictIdleRuntimeHandles(input.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runManagerInitializeSession({
        input,
        sessionKey,
        deps: this.deps,
        runtimeHandles: this.runtimeHandles,
        enforceConcurrentSessionLimit: this.enforceConcurrentSessionLimit.bind(this),
        writeSessionMeta: this.writeSessionMeta.bind(this),
      });
<<<<<<< HEAD
      const handle = await withAcpRuntimeErrorBoundary({
        run: async () =>
          await runtime.ensureSession({
            sessionKey,
            agent,
            mode: input.mode,
            resumeSessionId: input.resumeSessionId,
            cwd: requestedCwd,
          }),
        fallbackCode: "ACP_SESSION_INIT_FAILED",
        fallbackMessage: "Could not initialize ACP session runtime.",
      });
      const effectiveCwd = normalizeText(handle.cwd) ?? requestedCwd;
      const effectiveRuntimeOptions = normalizeRuntimeOptions({
        ...initialRuntimeOptions,
        ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
      });

      const identityNow = Date.now();
      const initializedIdentity =
        mergeSessionIdentity({
          current: undefined,
          incoming: createIdentityFromEnsure({
            handle,
            now: identityNow,
          }),
          now: identityNow,
        }) ??
        ({
          state: "pending",
          source: "ensure",
          lastUpdatedAt: identityNow,
        } as const);
      const meta: SessionAcpMeta = {
        backend: handle.backend || backend.id,
        agent,
        runtimeSessionName: handle.runtimeSessionName,
        identity: initializedIdentity,
        mode: input.mode,
        ...(Object.keys(effectiveRuntimeOptions).length > 0
          ? { runtimeOptions: effectiveRuntimeOptions }
          : {}),
        cwd: effectiveCwd,
        state: "idle",
        lastActivityAt: Date.now(),
      };

      let persisted: SessionEntry | null = null;
      try {
        persisted = await this.writeSessionMeta({
          cfg: input.cfg,
          sessionKey,
          mutate: () => meta,
          failOnError: true,
        });
      } catch (error) {
        await runtime
          .close({
            handle,
            reason: "init-meta-failed",
          })
          .catch((closeError) => {
            logVerbose(
              `acp-manager: cleanup close failed after metadata write error for ${sessionKey}: ${String(closeError)}`,
            );
          });
        throw error;
      }

      if (!persisted?.acp) {
        await runtime
          .close({
            handle,
            reason: "init-meta-failed",
          })
          .catch((closeError) => {
            logVerbose(
              `acp-manager: cleanup close failed after metadata write error for ${sessionKey}: ${String(closeError)}`,
            );
          });

        throw new AcpRuntimeError(
          "ACP_SESSION_INIT_FAILED",
          `Could not persist ACP metadata for ${sessionKey}.`,
        );
      }
      this.setCachedRuntimeState(sessionKey, {
        runtime,
        handle,
        backend: handle.backend || backend.id,
        agent,
        mode: input.mode,
        cwd: effectiveCwd,
      });
      return {
        runtime,
        handle,
        meta,
      };
=======
>>>>>>> upstream/main
    });
  }

  async getSessionStatus(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    signal?: AbortSignal;
  }): Promise<AcpSessionStatus> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    this.throwIfAborted(params.signal);
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(
      sessionKey,
      async () =>
        await runManagerGetSessionStatus({
          cfg: params.cfg,
          sessionKey,
          signal: params.signal,
          throwIfAborted: this.throwIfAborted.bind(this),
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          resolveRuntimeCapabilities: this.resolveRuntimeCapabilities.bind(this),
          reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
        }),
      params.signal,
    );
  }

  async setSessionRuntimeMode(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    runtimeMode: string;
  }): Promise<AcpSessionRuntimeOptions> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    const runtimeMode = validateRuntimeModeInput(params.runtimeMode);

    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runSetManagerSessionRuntimeMode({
        cfg: params.cfg,
        sessionKey,
        runtimeMode,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }

  async setSessionConfigOption(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    key: string;
    value: string;
  }): Promise<AcpSessionRuntimeOptions> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    const normalizedOption = validateRuntimeConfigOptionInput(params.key, params.value);
    const key = normalizedOption.key;
    const value = normalizedOption.value;

    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runSetManagerSessionConfigOption({
        cfg: params.cfg,
        sessionKey,
        key,
        value,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }

  async updateSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    patch: Partial<AcpSessionRuntimeOptions>;
  }): Promise<AcpSessionRuntimeOptions> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    const validatedPatch = validateRuntimeOptionPatch(params.patch);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }

    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runUpdateManagerSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey,
        patch: validatedPatch,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }

  async resetSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): Promise<AcpSessionRuntimeOptions> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runResetManagerSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }

  async runTurn(input: AcpRunTurnInput): Promise<void> {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    await this.evictIdleRuntimeHandles(input.cfg);
    await this.withSessionActor(
      sessionKey,
<<<<<<< HEAD
      async () => {
        const turnStartedAt = Date.now();
        const actorKey = normalizeActorKey(sessionKey);
        const taskContext =
          input.mode === "prompt"
            ? this.resolveBackgroundTaskContext({
                cfg: input.cfg,
                sessionKey,
                requestId: input.requestId,
                text: input.text,
              })
            : null;
        if (taskContext) {
          this.createBackgroundTaskRecord(taskContext, turnStartedAt);
        }
        let taskProgressSummary = "";
        for (let attempt = 0; attempt < 2; attempt += 1) {
          const resolution = this.resolveSession({
            cfg: input.cfg,
            sessionKey,
          });
          const resolvedMeta = requireReadySessionMeta(resolution);
          let runtime: AcpRuntime | undefined;
          let handle: AcpRuntimeHandle | undefined;
          let meta: SessionAcpMeta | undefined;
          let activeTurn: ActiveTurnState | undefined;
          let internalAbortController: AbortController | undefined;
          let onCallerAbort: (() => void) | undefined;
          let activeTurnStarted = false;
          let sawTurnOutput = false;
          let retryFreshHandle = false;
          let skipPostTurnCleanup = false;
          try {
            const ensured = await this.ensureRuntimeHandle({
              cfg: input.cfg,
              sessionKey,
              meta: resolvedMeta,
            });
            runtime = ensured.runtime;
            handle = ensured.handle;
            meta = ensured.meta;
            await this.applyRuntimeControls({
              sessionKey,
              runtime,
              handle,
              meta,
            });

            await this.setSessionState({
              cfg: input.cfg,
              sessionKey,
              state: "running",
              clearLastError: true,
            });

            internalAbortController = new AbortController();
            onCallerAbort = () => {
              internalAbortController?.abort();
            };
            if (input.signal?.aborted) {
              internalAbortController.abort();
            } else if (input.signal) {
              input.signal.addEventListener("abort", onCallerAbort, { once: true });
            }

            activeTurn = {
              runtime,
              handle,
              abortController: internalAbortController,
            };
            this.activeTurnBySession.set(actorKey, activeTurn);
            activeTurnStarted = true;

            let streamError: AcpRuntimeError | null = null;
            const combinedSignal =
              input.signal && typeof AbortSignal.any === "function"
                ? AbortSignal.any([input.signal, internalAbortController.signal])
                : internalAbortController.signal;
            const eventGate = { open: true };
            const turnPromise = (async () => {
              for await (const event of runtime.runTurn({
                handle,
                text: input.text,
                attachments: input.attachments,
                mode: input.mode,
                requestId: input.requestId,
                signal: combinedSignal,
              })) {
                if (!eventGate.open) {
                  continue;
                }
                if (event.type === "error") {
                  streamError = new AcpRuntimeError(
                    normalizeAcpErrorCode(event.code),
                    event.message?.trim() || "ACP turn failed before completion.",
                  );
                } else if (event.type === "text_delta" || event.type === "tool_call") {
                  sawTurnOutput = true;
                  if (event.type === "text_delta" && event.stream !== "thought" && event.text) {
                    taskProgressSummary = appendBackgroundTaskProgressSummary(
                      taskProgressSummary,
                      event.text,
                    );
                  }
                  if (taskContext) {
                    this.markBackgroundTaskRunning(taskContext.runId, {
                      sessionKey,
                      lastEventAt: Date.now(),
                      progressSummary: taskProgressSummary || null,
                    });
                  }
                }
                if (input.onEvent) {
                  await input.onEvent(event);
                }
              }
              if (eventGate.open && streamError) {
                throw streamError;
              }
            })();
            const turnTimeoutMs = this.resolveTurnTimeoutMs({
              cfg: input.cfg,
              meta,
            });
            const sessionMode = meta.mode;
            await this.awaitTurnWithTimeout({
              sessionKey,
              turnPromise,
              timeoutMs: turnTimeoutMs + ACP_TURN_TIMEOUT_GRACE_MS,
              timeoutLabelMs: turnTimeoutMs,
              onTimeout: async () => {
                eventGate.open = false;
                skipPostTurnCleanup = true;
                if (!activeTurn) {
                  return;
                }
                await this.cleanupTimedOutTurn({
                  sessionKey,
                  activeTurn,
                  mode: sessionMode,
                });
              },
            });
            if (streamError) {
              throw streamError;
            }
            this.recordTurnCompletion({
              startedAt: turnStartedAt,
            });
            if (taskContext) {
              const terminalResult = resolveBackgroundTaskTerminalResult(taskProgressSummary);
              this.markBackgroundTaskTerminal(taskContext.runId, {
                sessionKey,
                status: "succeeded",
                endedAt: Date.now(),
                lastEventAt: Date.now(),
                error: undefined,
                progressSummary: taskProgressSummary || null,
                terminalSummary: terminalResult.terminalSummary ?? null,
                terminalOutcome: terminalResult.terminalOutcome,
              });
            }
            await this.setSessionState({
              cfg: input.cfg,
              sessionKey,
              state: "idle",
              clearLastError: true,
            });
            return;
          } catch (error) {
            const acpError = toAcpRuntimeError({
              error,
              fallbackCode: activeTurnStarted ? "ACP_TURN_FAILED" : "ACP_SESSION_INIT_FAILED",
              fallbackMessage: activeTurnStarted
                ? "ACP turn failed before completion."
                : "Could not initialize ACP session runtime.",
            });
            retryFreshHandle = this.shouldRetryTurnWithFreshHandle({
              attempt,
              sessionKey,
              error: acpError,
              sawTurnOutput,
            });
            if (retryFreshHandle) {
              continue;
            }
            this.recordTurnCompletion({
              startedAt: turnStartedAt,
              errorCode: acpError.code,
            });
            if (taskContext) {
              this.markBackgroundTaskTerminal(taskContext.runId, {
                sessionKey,
                status: resolveBackgroundTaskFailureStatus(acpError),
                endedAt: Date.now(),
                lastEventAt: Date.now(),
                error: acpError.message,
                progressSummary: taskProgressSummary || null,
                terminalSummary: null,
              });
            }
            await this.setSessionState({
              cfg: input.cfg,
              sessionKey,
              state: "error",
              lastError: acpError.message,
            });
            throw acpError;
          } finally {
            if (input.signal && onCallerAbort) {
              input.signal.removeEventListener("abort", onCallerAbort);
            }
            if (activeTurn && this.activeTurnBySession.get(actorKey) === activeTurn) {
              this.activeTurnBySession.delete(actorKey);
            }
            if (
              !retryFreshHandle &&
              !skipPostTurnCleanup &&
              runtime &&
              handle &&
              meta &&
              meta.mode !== "oneshot"
            ) {
              ({ handle } = await this.reconcileRuntimeSessionIdentifiers({
                cfg: input.cfg,
                sessionKey,
                runtime,
                handle,
                meta,
                failOnStatusError: false,
              }));
            }
            if (
              !retryFreshHandle &&
              !skipPostTurnCleanup &&
              runtime &&
              handle &&
              meta &&
              meta.mode === "oneshot"
            ) {
              try {
                await runtime.close({
                  handle,
                  reason: "oneshot-complete",
                });
              } catch (error) {
                logVerbose(
                  `acp-manager: ACP oneshot close failed for ${sessionKey}: ${String(error)}`,
                );
              } finally {
                this.clearCachedRuntimeState(sessionKey);
              }
            }
          }
          if (retryFreshHandle) {
            continue;
          }
        }
      },
=======
      async () =>
        await runManagerTurn({
          input,
          sessionKey,
          deps: this.deps,
          runtimeHandles: this.runtimeHandles,
          activeTurnBySession: this.activeTurnBySession,
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          applyRuntimeControls: this.applyRuntimeControls.bind(this),
          setSessionState: this.setSessionState.bind(this),
          recordTurnCompletion: this.recordTurnCompletion.bind(this),
          reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
          writeSessionMeta: this.writeSessionMeta.bind(this),
        }),
>>>>>>> upstream/main
      input.signal,
    );
  }

  async cancelSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason?: string;
  }): Promise<void> {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    await this.evictIdleRuntimeHandles(params.cfg);
    await runManagerCancelSession({
      cfg: params.cfg,
      sessionKey,
      reason: params.reason,
      activeTurnBySession: this.activeTurnBySession,
      withSessionActor: this.withSessionActor.bind(this),
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      setSessionState: this.setSessionState.bind(this),
    });
  }

  async closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult> {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey) {
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    }
    await this.evictIdleRuntimeHandles(input.cfg);
    return await this.withSessionActor(
      sessionKey,
      async () =>
        await runManagerCloseSession({
          input,
          sessionKey,
          deps: this.deps,
          runtimeHandles: this.runtimeHandles,
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          writeSessionMeta: this.writeSessionMeta.bind(this),
        }),
    );
  }

  private async ensureRuntimeHandle(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    meta: SessionAcpMeta;
  }): Promise<{ runtime: AcpRuntime; handle: AcpRuntimeHandle; meta: SessionAcpMeta }> {
    return await ensureManagerRuntimeHandle({
      ...params,
      deps: this.deps,
      runtimeHandles: this.runtimeHandles,
      enforceConcurrentSessionLimit: (limitParams) =>
        this.enforceConcurrentSessionLimit(limitParams),
      writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams),
    });
  }

<<<<<<< HEAD
    const backend = this.deps.requireRuntimeBackend(configuredBackend || undefined);
    const runtime = backend.runtime;
    const previousMeta = params.meta;
    const previousIdentity = resolveSessionIdentityFromMeta(previousMeta);
    let identityForEnsure = previousIdentity;
    const persistedResumeSessionId =
      mode === "persistent" ? resolveRuntimeResumeSessionId(previousIdentity) : undefined;
    const ensureSession = async (resumeSessionId?: string) =>
      await withAcpRuntimeErrorBoundary({
        run: async () =>
          await runtime.ensureSession({
            sessionKey: params.sessionKey,
            agent,
            mode,
            ...(resumeSessionId ? { resumeSessionId } : {}),
            cwd,
          }),
        fallbackCode: "ACP_SESSION_INIT_FAILED",
        fallbackMessage: "Could not initialize ACP session runtime.",
      });
    let ensured: AcpRuntimeHandle;
    if (persistedResumeSessionId) {
      try {
        ensured = await ensureSession(persistedResumeSessionId);
      } catch (error) {
        const acpError = toAcpRuntimeError({
          error,
          fallbackCode: "ACP_SESSION_INIT_FAILED",
          fallbackMessage: "Could not initialize ACP session runtime.",
        });
        if (acpError.code !== "ACP_SESSION_INIT_FAILED") {
          throw acpError;
        }
        logVerbose(
          `acp-manager: resume init failed for ${params.sessionKey}; retrying without persisted ACP session id: ${acpError.message}`,
        );
        if (identityForEnsure) {
          const {
            acpxSessionId: _staleAcpxSessionId,
            agentSessionId: _staleAgentSessionId,
            ...retryIdentity
          } = identityForEnsure;
          // The persisted resume identifiers already failed, so do not merge them back into the
          // fresh named-session handle returned by the retry path.
          identityForEnsure = {
            ...retryIdentity,
            state: "pending",
          };
        }
        ensured = await ensureSession();
      }
    } else {
      ensured = await ensureSession();
    }

    const now = Date.now();
    const effectiveCwd = normalizeText(ensured.cwd) ?? cwd;
    const nextRuntimeOptions = normalizeRuntimeOptions({
      ...runtimeOptions,
      ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
    });
    const nextIdentity =
      mergeSessionIdentity({
        current: identityForEnsure,
        incoming: createIdentityFromEnsure({
          handle: ensured,
          now,
        }),
        now,
      }) ?? identityForEnsure;
    const nextHandleIdentifiers = resolveRuntimeHandleIdentifiersFromIdentity(nextIdentity);
    const nextHandle: AcpRuntimeHandle = {
      ...ensured,
      ...(nextHandleIdentifiers.backendSessionId
        ? { backendSessionId: nextHandleIdentifiers.backendSessionId }
        : {}),
      ...(nextHandleIdentifiers.agentSessionId
        ? { agentSessionId: nextHandleIdentifiers.agentSessionId }
        : {}),
    };
    const nextMeta: SessionAcpMeta = {
      backend: ensured.backend || backend.id,
      agent,
      runtimeSessionName: ensured.runtimeSessionName,
      ...(nextIdentity ? { identity: nextIdentity } : {}),
      mode: params.meta.mode,
      ...(Object.keys(nextRuntimeOptions).length > 0 ? { runtimeOptions: nextRuntimeOptions } : {}),
      ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
      state: previousMeta.state,
      lastActivityAt: now,
      ...(previousMeta.lastError ? { lastError: previousMeta.lastError } : {}),
    };
    const shouldPersistMeta =
      previousMeta.backend !== nextMeta.backend ||
      previousMeta.runtimeSessionName !== nextMeta.runtimeSessionName ||
      !identityEquals(previousIdentity, nextIdentity) ||
      previousMeta.agent !== nextMeta.agent ||
      previousMeta.cwd !== nextMeta.cwd ||
      !runtimeOptionsEqual(previousMeta.runtimeOptions, nextMeta.runtimeOptions) ||
      hasLegacyAcpIdentityProjection(previousMeta);
    if (shouldPersistMeta) {
      await this.writeSessionMeta({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        mutate: (_current, entry) => {
          if (!entry) {
            return null;
          }
          return nextMeta;
        },
      });
    }
    this.setCachedRuntimeState(params.sessionKey, {
      runtime,
      handle: nextHandle,
      backend: ensured.backend || backend.id,
      agent,
      mode,
      cwd: effectiveCwd,
      appliedControlSignature: undefined,
    });
=======
  private runtimeOptionCommandServices(): RuntimeOptionCommandServices {
>>>>>>> upstream/main
    return {
      runtimeHandles: this.runtimeHandles,
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      resolveRuntimeCapabilities: this.resolveRuntimeCapabilities.bind(this),
      writeSessionMeta: this.writeSessionMeta.bind(this),
    };
  }

  private enforceConcurrentSessionLimit(params: { cfg: OpenClawConfig; sessionKey: string }): void {
    const configuredLimit = params.cfg.acp?.maxConcurrentSessions;
    if (typeof configuredLimit !== "number" || !Number.isFinite(configuredLimit)) {
      return;
    }
    const limit = Math.max(1, Math.floor(configuredLimit));
    if (this.runtimeHandles.has(params.sessionKey)) {
      return;
    }
    const activeCount = this.runtimeHandles.size();
    if (activeCount >= limit) {
      throw new AcpRuntimeError(
        "ACP_SESSION_INIT_FAILED",
        `ACP max concurrent sessions reached (${activeCount}/${limit}).`,
      );
    }
  }

  private recordTurnCompletion(params: { startedAt: number; errorCode?: AcpRuntimeError["code"] }) {
    const durationMs = Math.max(0, Date.now() - params.startedAt);
    this.turnLatencyStats.totalMs += durationMs;
    this.turnLatencyStats.maxMs = Math.max(this.turnLatencyStats.maxMs, durationMs);
    if (params.errorCode) {
      this.turnLatencyStats.failed += 1;
      this.recordErrorCode(params.errorCode);
      return;
    }
    this.turnLatencyStats.completed += 1;
  }

  private recordErrorCode(code: string): void {
    const normalized = normalizeAcpErrorCode(code);
    this.errorCountsByCode.set(normalized, (this.errorCountsByCode.get(normalized) ?? 0) + 1);
  }

<<<<<<< HEAD
  private shouldRetryTurnWithFreshHandle(params: {
    attempt: number;
    sessionKey: string;
    error: AcpRuntimeError;
    sawTurnOutput: boolean;
  }): boolean {
    if (params.attempt > 0 || params.sawTurnOutput) {
      return false;
    }
    if (!this.isRecoverableAcpxExitError(params.error.message)) {
      return false;
    }
    this.clearCachedRuntimeState(params.sessionKey);
    logVerbose(
      `acp-manager: retrying ${params.sessionKey} with a fresh runtime handle after early turn failure: ${params.error.message}`,
    );
    return true;
  }

  private isRecoverableAcpxExitError(message: string): boolean {
    return /^acpx exited with (code \d+|signal [a-z0-9]+)/i.test(message.trim());
  }

  private async evictIdleRuntimeHandles(params: { cfg: OpenClawConfig }): Promise<void> {
    const idleTtlMs = resolveRuntimeIdleTtlMs(params.cfg);
    if (idleTtlMs <= 0 || this.runtimeCache.size() === 0) {
      return;
    }
    const now = Date.now();
    const candidates = this.runtimeCache.collectIdleCandidates({
      maxIdleMs: idleTtlMs,
      now,
    });
    if (candidates.length === 0) {
      return;
    }

    for (const candidate of candidates) {
      await this.actorQueue.run(candidate.actorKey, async () => {
        if (this.activeTurnBySession.has(candidate.actorKey)) {
          return;
        }
        const lastTouchedAt = this.runtimeCache.getLastTouchedAt(candidate.actorKey);
        if (lastTouchedAt == null || now - lastTouchedAt < idleTtlMs) {
          return;
        }
        const cached = this.runtimeCache.peek(candidate.actorKey);
        if (!cached) {
          return;
        }
        this.runtimeCache.clear(candidate.actorKey);
        this.evictedRuntimeCount += 1;
        this.lastEvictedAt = Date.now();
        try {
          await cached.runtime.close({
            handle: cached.handle,
            reason: "idle-evicted",
          });
        } catch (error) {
          logVerbose(
            `acp-manager: idle eviction close failed for ${candidate.state.handle.sessionKey}: ${String(error)}`,
          );
        }
      });
    }
  }

=======
>>>>>>> upstream/main
  private async resolveRuntimeCapabilities(params: {
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    includeStatusConfigOptionKeys?: boolean;
  }): Promise<AcpRuntimeCapabilities> {
    return await resolveManagerRuntimeCapabilities(params);
  }

  private async evictIdleRuntimeHandles(cfg: OpenClawConfig): Promise<void> {
    await this.runtimeHandles.evictIdle({
      cfg,
      actorQueue: this.actorQueue,
      activeTurnBySession: this.activeTurnBySession,
    });
  }

  private async applyRuntimeControls(params: {
    sessionKey: string;
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
  }): Promise<void> {
    await applyManagerRuntimeControls({
      ...params,
      getCachedRuntimeState: (sessionKey) => this.runtimeHandles.get(sessionKey),
    });
  }

  private async setSessionState(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    state: SessionAcpMeta["state"];
    lastError?: string;
    clearLastError?: boolean;
  }): Promise<void> {
    await this.writeSessionMeta({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      skipMaintenance: true,
      takeCacheOwnership: true,
      mutate: (current, entry) => {
        if (!entry) {
          return null;
        }
        const base = current;
        if (!base) {
          return null;
        }
        const next: SessionAcpMeta = {
          backend: base.backend,
          agent: base.agent,
          runtimeSessionName: base.runtimeSessionName,
          ...(base.identity ? { identity: base.identity } : {}),
          mode: base.mode,
          ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
          ...(base.cwd ? { cwd: base.cwd } : {}),
          state: params.state,
          lastActivityAt: Date.now(),
          ...(base.lastError ? { lastError: base.lastError } : {}),
        };
        const lastError = normalizeText(params.lastError);
        if (lastError) {
          next.lastError = lastError;
        } else if (params.clearLastError) {
          delete next.lastError;
        }
        return next;
      },
    });
  }

  private async reconcileRuntimeSessionIdentifiers(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
    runtimeStatus?: AcpRuntimeStatus;
    failOnStatusError: boolean;
  }): Promise<{
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
    runtimeStatus?: AcpRuntimeStatus;
  }> {
    return await reconcileManagerRuntimeSessionIdentifiers({
      ...params,
      setCachedHandle: (sessionKey, handle) => {
        const cached = this.runtimeHandles.get(sessionKey);
        if (cached) {
          cached.handle = handle;
        }
      },
      writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams),
    });
  }

  private async writeSessionMeta(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    mutate: (
      current: SessionAcpMeta | undefined,
      entry: SessionEntry | undefined,
    ) => SessionAcpMeta | null | undefined;
    failOnError?: boolean;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
  }): Promise<SessionEntry | null> {
    try {
      return await this.deps.upsertSessionMeta({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        mutate: params.mutate,
        ...(params.skipMaintenance === true ? { skipMaintenance: true } : {}),
        ...(params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}),
      });
    } catch (error) {
      if (params.failOnError) {
        throw error;
      }
      logVerbose(
        `acp-manager: failed persisting ACP metadata for ${params.sessionKey}: ${String(error)}`,
      );
      return null;
    }
  }

  private async withSessionActor<T>(
    sessionKey: string,
    op: () => Promise<T>,
    signal?: AbortSignal,
  ): Promise<T> {
    const actorKey = normalizeActorKey(sessionKey);
    this.throwIfAborted(signal);

    let actorStarted = false;
    const queued = this.actorQueue.run(actorKey, async () => {
      actorStarted = true;
      this.throwIfAborted(signal);
      return await op();
    });
    if (!signal) {
      return await queued;
    }

    return await new Promise<T>((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        signal.removeEventListener("abort", onAbort);
      };
      const settleValue = (value: T) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        resolve(value);
      };
      const settleError = (error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(toLintErrorObject(error, "Non-Error rejection"));
      };
      const onAbort = () => {
        if (actorStarted) {
          return;
        }
        try {
          this.throwIfAborted(signal);
        } catch (error) {
          settleError(error);
        }
      };

      signal.addEventListener("abort", onAbort, { once: true });
      queued.then(settleValue, settleError);
      if (signal.aborted) {
        onAbort();
      }
    });
  }

  private throwIfAborted(signal?: AbortSignal): void {
    if (!signal?.aborted) {
      return;
    }
    throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP operation aborted.");
  }
}

function toLintErrorObject(value: unknown, fallbackMessage: string): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function") {
    Object.assign(error, value);
  }
<<<<<<< HEAD

  private resolveBackgroundTaskContext(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    requestId: string;
    text: string;
  }): BackgroundTaskContext | null {
    const childEntry = this.deps.readSessionEntry({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    })?.entry;
    const requesterSessionKey =
      normalizeText(childEntry?.spawnedBy) ?? normalizeText(childEntry?.parentSessionKey);
    if (!requesterSessionKey) {
      return null;
    }
    const parentEntry = this.deps.readSessionEntry({
      cfg: params.cfg,
      sessionKey: requesterSessionKey,
    })?.entry;
    return {
      requesterSessionKey,
      requesterOrigin: parentEntry?.deliveryContext ?? childEntry?.deliveryContext,
      childSessionKey: params.sessionKey,
      runId: params.requestId,
      label: normalizeText(childEntry?.label),
      task: summarizeBackgroundTaskText(params.text),
    };
  }

  private createBackgroundTaskRecord(context: BackgroundTaskContext, startedAt: number): void {
    try {
      createRunningTaskRun({
        runtime: "acp",
        sourceId: context.runId,
        ownerKey: context.requesterSessionKey,
        scopeKind: "session",
        requesterOrigin: context.requesterOrigin,
        childSessionKey: context.childSessionKey,
        runId: context.runId,
        label: context.label,
        task: context.task,
        startedAt,
      });
    } catch (error) {
      logVerbose(
        `acp-manager: failed creating background task for ${context.runId}: ${String(error)}`,
      );
    }
  }

  private markBackgroundTaskRunning(
    runId: string,
    params: {
      sessionKey?: string;
      lastEventAt?: number;
      progressSummary?: string | null;
    },
  ): void {
    try {
      startTaskRunByRunId({
        runId,
        runtime: "acp",
        sessionKey: params.sessionKey,
        lastEventAt: params.lastEventAt,
        progressSummary: params.progressSummary,
      });
    } catch (error) {
      logVerbose(`acp-manager: failed updating background task for ${runId}: ${String(error)}`);
    }
  }

  private markBackgroundTaskTerminal(
    runId: string,
    params: {
      sessionKey?: string;
      status: "succeeded" | "failed" | "timed_out";
      endedAt: number;
      lastEventAt?: number;
      error?: string;
      progressSummary?: string | null;
      terminalSummary?: string | null;
      terminalOutcome?: "succeeded" | "blocked" | null;
    },
  ): void {
    try {
      if (params.status === "succeeded") {
        completeTaskRunByRunId({
          runId,
          runtime: "acp",
          sessionKey: params.sessionKey,
          endedAt: params.endedAt,
          lastEventAt: params.lastEventAt,
          progressSummary: params.progressSummary,
          terminalSummary: params.terminalSummary,
          terminalOutcome: params.terminalOutcome,
        });
        return;
      }
      failTaskRunByRunId({
        runId,
        runtime: "acp",
        sessionKey: params.sessionKey,
        status: params.status,
        endedAt: params.endedAt,
        lastEventAt: params.lastEventAt,
        error: params.error,
        progressSummary: params.progressSummary,
        terminalSummary: params.terminalSummary,
      });
    } catch (error) {
      logVerbose(`acp-manager: failed updating background task for ${runId}: ${String(error)}`);
    }
  }
=======
  return error;
>>>>>>> upstream/main
}
