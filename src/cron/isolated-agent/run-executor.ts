<<<<<<< HEAD
import type { SkillSnapshot } from "../../agents/skills.js";
import type { ThinkLevel, VerboseLevel } from "../../auto-reply/thinking.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { AgentDefaultsConfig } from "../../config/types.agent-defaults.js";
import type { CronJob } from "../types.js";
import { resolveCronPayloadOutcome } from "./helpers.js";
import {
  countActiveDescendantRuns,
  listDescendantRunsForRequester,
=======
/** Executes isolated cron prompts with model fallbacks and interim-ack retries. */
import { createHash } from "node:crypto";
import type { BootstrapContextMode } from "../../agents/bootstrap-files.js";
import { resolveCliRuntimeExecutionProvider } from "../../agents/model-runtime-aliases.js";
import type { ThinkLevel, VerboseLevel } from "../../auto-reply/thinking.js";
import type { AgentDefaultsConfig } from "../../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SourceDeliveryPlan } from "../../infra/outbound/source-delivery-plan.js";
import { createLazyImportLoader } from "../../shared/lazy-promise.js";
import type { SkillSnapshot } from "../../skills/types.js";
import type { CronAgentExecutionPhaseUpdate, CronJob } from "../types.js";
import {
  resolveCronChannelOutputPolicy,
  resolveCurrentChannelTarget,
} from "./channel-output-policy.js";
import { resolveCronPayloadOutcome } from "./helpers.js";
import {
  getCliSessionId,
  ensureSelectedAgentHarnessPlugin,
  isCliProvider,
>>>>>>> upstream/main
  LiveSessionModelSwitchError,
  logWarn,
  normalizeVerboseLevel,
  registerAgentRunContext,
  resolveBootstrapWarningSignaturesSeen,
<<<<<<< HEAD
  resolveFastModeState,
  resolveNestedAgentLane,
  resolveSessionTranscriptPath,
  runEmbeddedPiAgent,
=======
  resolveCronAgentLane,
  resolveSessionTranscriptPath,
  runCliAgent,
>>>>>>> upstream/main
  runWithModelFallback,
} from "./run-execution.runtime.js";
import { resolveCronFallbacksOverride } from "./run-fallback-policy.js";
import type {
  CronLiveSelection,
  MutableCronSession,
  PersistCronSessionEntry,
} from "./run-session-state.js";
import { syncCronSessionLiveSelection } from "./run-session-state.js";
import { isLikelyInterimCronMessage } from "./subagent-followup-hints.js";

type AgentTurnPayload = Extract<CronJob["payload"], { kind: "agentTurn" }> | null;
<<<<<<< HEAD
type CronPromptRunResult = Awaited<ReturnType<typeof runEmbeddedPiAgent>>;

=======
type CronPromptRunResult = Awaited<ReturnType<typeof runCliAgent>>;
type CronEmbeddedRuntime = typeof import("./run-embedded.runtime.js");
type CronSubagentRegistryRuntime = typeof import("./run-subagent-registry.runtime.js");

const cronEmbeddedRuntimeLoader = createLazyImportLoader<CronEmbeddedRuntime>(
  () => import("./run-embedded.runtime.js"),
);
const cronSubagentRegistryRuntimeLoader = createLazyImportLoader<CronSubagentRegistryRuntime>(
  () => import("./run-subagent-registry.runtime.js"),
);

async function loadCronEmbeddedRuntime() {
  return await cronEmbeddedRuntimeLoader.load();
}

async function loadCronSubagentRegistryRuntime() {
  return await cronSubagentRegistryRuntimeLoader.load();
}

const COMMAND_STYLE_CRON_PREFIX =
  /^(?:(?:[A-Z_][A-Z0-9_]*=\S+\s+)+)?(?:cd\s+\S+|(?:\.{1,2}|~)?\/\S+|[A-Za-z]:[\\/]\S+|(?:bash|bun|cargo|deno|docker|gh|git|go|make|node|npm|npx|pnpm|python|python3|ruby|sh|tsx|uv|zsh)\b)/u;

function resolveIsolatedCronPromptCacheKey(params: {
  job: CronJob;
  agentId: string;
  agentSessionKey: string;
  provider: string;
  model: string;
}): string | undefined {
  if (params.job.sessionTarget !== "isolated") {
    return undefined;
  }
  const material = JSON.stringify({
    version: 1,
    kind: "isolated-cron",
    jobId: params.job.id,
    agentId: params.agentId,
    agentSessionKey: params.agentSessionKey,
    provider: params.provider,
    model: params.model,
  });
  const digest = createHash("sha256").update(material).digest("hex").slice(0, 32);
  // Isolated cron rotates transcript/session ids per run; keep cache affinity
  // on stable job identity without sending raw local session labels upstream.
  return `openclaw-cron-${digest}`;
}

/** Detects single-line cron prompts that look like shell commands or command invocations. */
export function isCommandStyleCronMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed || trimmed.includes("\n")) {
    return false;
  }
  return COMMAND_STYLE_CRON_PREFIX.test(trimmed);
}

function resolveCronBootstrapContextMode(
  payload: AgentTurnPayload,
): BootstrapContextMode | undefined {
  // Command-like cron prompts benefit from lightweight bootstrap context so
  // simple scheduled command tasks do not spend budget on full repo context.
  if (payload?.lightContext === true) {
    return "lightweight";
  }
  if (payload?.lightContext === false) {
    return undefined;
  }
  return isCommandStyleCronMessage(payload?.message ?? "") ? "lightweight" : undefined;
}

/** Result envelope returned after an isolated cron prompt completes. */
>>>>>>> upstream/main
export type CronExecutionResult = {
  runResult: CronPromptRunResult;
  fallbackProvider: string;
  fallbackModel: string;
  runStartedAt: number;
  runEndedAt: number;
  liveSelection: CronLiveSelection;
};

<<<<<<< HEAD
=======
/** Creates the model-fallback executor for one isolated cron prompt run. */
>>>>>>> upstream/main
export function createCronPromptExecutor(params: {
  cfg: OpenClawConfig;
  cfgWithAgentDefaults: OpenClawConfig;
  job: CronJob;
  agentId: string;
  agentDir: string;
  agentSessionKey: string;
<<<<<<< HEAD
=======
  runSessionKey: string;
>>>>>>> upstream/main
  workspaceDir: string;
  lane?: string;
  resolvedVerboseLevel: VerboseLevel;
  thinkLevel: ThinkLevel | undefined;
  timeoutMs: number;
<<<<<<< HEAD
  messageChannel: string | undefined;
  resolvedDelivery: { accountId?: string };
  toolPolicy: {
    requireExplicitMessageTarget: boolean;
    disableMessageTool: boolean;
  };
  skillsSnapshot: SkillSnapshot;
  agentPayload: AgentTurnPayload;
=======
  /** Set when the cron payload's `timeoutSeconds` was explicitly configured. */
  runTimeoutOverrideMs?: number;
  suppressExecNotifyOnExit: boolean;
  resolvedDelivery: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  deliveryRequested?: boolean;
  sourceDelivery: SourceDeliveryPlan;
  skillsSnapshot: SkillSnapshot;
  agentPayload: AgentTurnPayload;
  useSubagentFallbacks: boolean;
  inheritDefaultFallbacksForAgentStringModel?: boolean;
  modelFallbacksOverride?: string[];
>>>>>>> upstream/main
  liveSelection: CronLiveSelection;
  cronSession: MutableCronSession;
  abortSignal?: AbortSignal;
  abortReason: () => string;
<<<<<<< HEAD
}) {
  const sessionFile = resolveSessionTranscriptPath(
    params.cronSession.sessionEntry.sessionId,
    params.agentId,
  );
  const cronFallbacksOverride = resolveCronFallbacksOverride({
    cfg: params.cfg,
    job: params.job,
    agentId: params.agentId,
  });
=======
  onExecutionStarted?: () => void;
  onExecutionPhase?: (
    info: Pick<CronAgentExecutionPhaseUpdate, "phase"> &
      Partial<Omit<CronAgentExecutionPhaseUpdate, "jobId" | "phase">>,
  ) => void;
}) {
  const sessionFile =
    params.cronSession.sessionEntry.sessionFile?.trim() ||
    resolveSessionTranscriptPath(params.cronSession.sessionEntry.sessionId, params.agentId);
  // Fallback for callers that bypass prepareCronRunContext before persisting retries.
  if (!params.cronSession.sessionEntry.sessionFile?.trim()) {
    params.cronSession.sessionEntry.sessionFile = sessionFile;
  }
  const cronFallbacksOverride =
    params.modelFallbacksOverride ??
    resolveCronFallbacksOverride({
      cfg: params.cfg,
      job: params.job,
      agentId: params.agentId,
      useSubagentFallbacks: params.useSubagentFallbacks,
      inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel,
    });
>>>>>>> upstream/main
  let runResult: CronPromptRunResult | undefined;
  let fallbackProvider = params.liveSelection.provider;
  let fallbackModel = params.liveSelection.model;
  let runEndedAt = Date.now();
  let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(
    params.cronSession.sessionEntry.systemPromptReport,
  );
<<<<<<< HEAD
=======
  const bootstrapContextMode = resolveCronBootstrapContextMode(params.agentPayload);
  const sourceReplyDeliveryMode = params.sourceDelivery.sourceReplyDeliveryMode;
  const messageChannel = params.sourceDelivery.target.channel ?? params.resolvedDelivery.channel;
>>>>>>> upstream/main

  const runPrompt = async (promptText: string) => {
    const fallbackResult = await runWithModelFallback({
      cfg: params.cfgWithAgentDefaults,
      provider: params.liveSelection.provider,
      model: params.liveSelection.model,
      runId: params.cronSession.sessionEntry.sessionId,
<<<<<<< HEAD
      agentDir: params.agentDir,
=======
      sessionId: params.cronSession.sessionEntry.sessionId,
      lane: resolveCronAgentLane(params.lane),
      agentDir: params.agentDir,
      agentId: params.agentId,
      sessionKey: params.runSessionKey,
      prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
        await ensureSelectedAgentHarnessPlugin({
          config: params.cfgWithAgentDefaults,
          provider,
          modelId: model,
          agentId: params.agentId,
          sessionKey: params.runSessionKey,
          agentHarnessRuntimeOverride,
          workspaceDir: params.workspaceDir,
        });
      },
>>>>>>> upstream/main
      fallbacksOverride: cronFallbacksOverride,
      run: async (providerOverride, modelOverride, runOptions) => {
        if (params.abortSignal?.aborted) {
          throw new Error(params.abortReason());
        }
<<<<<<< HEAD
        const bootstrapPromptWarningSignature =
          bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1];
        const result = await runEmbeddedPiAgent({
          sessionId: params.cronSession.sessionEntry.sessionId,
          sessionKey: params.agentSessionKey,
          agentId: params.agentId,
          trigger: "cron",
          allowGatewaySubagentBinding: true,
          senderIsOwner: true,
          messageChannel: params.messageChannel,
          agentAccountId: params.resolvedDelivery.accountId,
=======
        const executionProvider =
          resolveCliRuntimeExecutionProvider({
            provider: providerOverride,
            cfg: params.cfgWithAgentDefaults,
            agentId: params.agentId,
            modelId: modelOverride,
          }) ?? providerOverride;
        const bootstrapPromptWarningSignature =
          bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1];
        // CLI providers can resume provider-native sessions; embedded providers
        // use OpenClaw's transcript/session file plus prompt-cache affinity.
        if (isCliProvider(executionProvider, params.cfgWithAgentDefaults)) {
          const cliSessionId = params.cronSession.isNewSession
            ? undefined
            : await getCliSessionId(params.cronSession.sessionEntry, executionProvider);
          const result = await runCliAgent({
            sessionId: params.cronSession.sessionEntry.sessionId,
            sessionKey: params.runSessionKey,
            sessionEntry: params.cronSession.sessionEntry,
            agentId: params.agentId,
            trigger: "cron",
            jobId: params.job.id,
            sessionFile,
            workspaceDir: params.workspaceDir,
            config: params.cfgWithAgentDefaults,
            prompt: promptText,
            provider: executionProvider,
            model: modelOverride,
            thinkLevel: params.thinkLevel,
            timeoutMs: params.timeoutMs,
            runId: params.cronSession.sessionEntry.sessionId,
            lane: resolveCronAgentLane(params.lane),
            cliSessionId,
            skillsSnapshot: params.skillsSnapshot,
            messageChannel,
            sourceReplyDeliveryMode,
            abortSignal: params.abortSignal,
            onExecutionStarted: params.onExecutionStarted,
            onExecutionPhase: params.onExecutionPhase,
            bootstrapContextMode,
            bootstrapContextRunKind: "cron",
            bootstrapPromptWarningSignaturesSeen,
            bootstrapPromptWarningSignature,
          });
          bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(
            result.meta?.systemPromptReport,
          );
          return result;
        }
        const { resolveFastModeState, runEmbeddedAgent } = await loadCronEmbeddedRuntime();
        const promptCacheKey = resolveIsolatedCronPromptCacheKey({
          job: params.job,
          agentId: params.agentId,
          agentSessionKey: params.agentSessionKey,
          provider: providerOverride,
          model: modelOverride,
        });
        const currentChannelId = await resolveCurrentChannelTarget({
          channel: messageChannel,
          to: params.resolvedDelivery.to,
          threadId: params.resolvedDelivery.threadId,
        });
        // Embedded runs receive both the explicit route and the current-channel
        // id so message-tool policy can target the same chat as fallback delivery.
        const result = await runEmbeddedAgent({
          sessionId: params.cronSession.sessionEntry.sessionId,
          sessionKey: params.runSessionKey,
          promptCacheKey,
          agentId: params.agentId,
          trigger: "cron",
          jobId: params.job.id,
          cleanupBundleMcpOnRunEnd: params.job.sessionTarget === "isolated",
          allowGatewaySubagentBinding: true,
          messageChannel,
          agentAccountId: params.resolvedDelivery.accountId,
          messageTo: params.resolvedDelivery.to,
          messageThreadId: params.resolvedDelivery.threadId,
          currentChannelId,
>>>>>>> upstream/main
          sessionFile,
          agentDir: params.agentDir,
          workspaceDir: params.workspaceDir,
          config: params.cfgWithAgentDefaults,
          skillsSnapshot: params.skillsSnapshot,
          prompt: promptText,
<<<<<<< HEAD
          lane: resolveNestedAgentLane(params.lane),
          provider: providerOverride,
          model: modelOverride,
=======
          lane: resolveCronAgentLane(params.lane),
          provider: providerOverride,
          model: modelOverride,
          modelFallbacksOverride: cronFallbacksOverride,
>>>>>>> upstream/main
          authProfileId: params.liveSelection.authProfileId,
          authProfileIdSource: params.liveSelection.authProfileId
            ? params.liveSelection.authProfileIdSource
            : undefined,
          thinkLevel: params.thinkLevel,
          fastMode: resolveFastModeState({
            cfg: params.cfgWithAgentDefaults,
            provider: providerOverride,
            model: modelOverride,
            agentId: params.agentId,
            sessionEntry: params.cronSession.sessionEntry,
          }).enabled,
          verboseLevel: params.resolvedVerboseLevel,
          timeoutMs: params.timeoutMs,
<<<<<<< HEAD
          bootstrapContextMode: params.agentPayload?.lightContext ? "lightweight" : undefined,
          bootstrapContextRunKind: "cron",
          toolsAllow: params.agentPayload?.toolsAllow,
          runId: params.cronSession.sessionEntry.sessionId,
          requireExplicitMessageTarget: params.toolPolicy.requireExplicitMessageTarget,
          disableMessageTool: params.toolPolicy.disableMessageTool,
          allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
          abortSignal: params.abortSignal,
=======
          runTimeoutOverrideMs: params.runTimeoutOverrideMs,
          bootstrapContextMode,
          bootstrapContextRunKind: "cron",
          toolsAllow: params.agentPayload?.toolsAllow,
          execOverrides: params.suppressExecNotifyOnExit
            ? {
                notifyOnExit: false,
                notifyOnExitEmptySuccess: false,
              }
            : undefined,
          sourceReplyDeliveryMode,
          runId: params.cronSession.sessionEntry.sessionId,
          requireExplicitMessageTarget: params.sourceDelivery.messageTool.requireExplicitTarget,
          disableMessageTool: !params.sourceDelivery.messageTool.enabled,
          forceMessageTool: params.sourceDelivery.messageTool.force,
          allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
          abortSignal: params.abortSignal,
          onExecutionStarted: params.onExecutionStarted,
          onExecutionPhase: params.onExecutionPhase,
>>>>>>> upstream/main
          bootstrapPromptWarningSignaturesSeen,
          bootstrapPromptWarningSignature,
        });
        bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(
          result.meta?.systemPromptReport,
        );
        return result;
      },
    });
    runResult = fallbackResult.result;
    fallbackProvider = fallbackResult.provider;
    fallbackModel = fallbackResult.model;
    params.liveSelection.provider = fallbackResult.provider;
    params.liveSelection.model = fallbackResult.model;
    runEndedAt = Date.now();
  };

  return {
    runPrompt,
    getState: () => ({
      runResult,
      fallbackProvider,
      fallbackModel,
      runEndedAt,
      liveSelection: params.liveSelection,
    }),
  };
}

<<<<<<< HEAD
=======
/** Executes an isolated cron prompt, including live model-switch and interim-ack retries. */
>>>>>>> upstream/main
export async function executeCronRun(params: {
  cfg: OpenClawConfig;
  cfgWithAgentDefaults: OpenClawConfig;
  job: CronJob;
  agentId: string;
  agentDir: string;
  agentSessionKey: string;
<<<<<<< HEAD
=======
  runSessionKey: string;
>>>>>>> upstream/main
  workspaceDir: string;
  lane?: string;
  resolvedDelivery: {
    channel?: string;
    accountId?: string;
<<<<<<< HEAD
  };
  toolPolicy: {
    requireExplicitMessageTarget: boolean;
    disableMessageTool: boolean;
  };
  skillsSnapshot: SkillSnapshot;
  agentPayload: AgentTurnPayload;
=======
    to?: string;
    threadId?: string | number;
  };
  deliveryRequested?: boolean;
  sourceDelivery: SourceDeliveryPlan;
  skillsSnapshot: SkillSnapshot;
  agentPayload: AgentTurnPayload;
  useSubagentFallbacks: boolean;
  inheritDefaultFallbacksForAgentStringModel?: boolean;
  modelFallbacksOverride?: string[];
>>>>>>> upstream/main
  agentVerboseDefault: AgentDefaultsConfig["verboseDefault"];
  liveSelection: CronLiveSelection;
  cronSession: MutableCronSession;
  commandBody: string;
  persistSessionEntry: PersistCronSessionEntry;
  abortSignal?: AbortSignal;
  abortReason: () => string;
  isAborted: () => boolean;
<<<<<<< HEAD
  thinkLevel: ThinkLevel | undefined;
  timeoutMs: number;
=======
  onExecutionStarted?: () => void;
  onExecutionPhase?: (
    info: Pick<CronAgentExecutionPhaseUpdate, "phase"> &
      Partial<Omit<CronAgentExecutionPhaseUpdate, "jobId" | "phase">>,
  ) => void;
  thinkLevel: ThinkLevel | undefined;
  timeoutMs: number;
  /** Set when the cron payload's `timeoutSeconds` was explicitly configured. */
  runTimeoutOverrideMs?: number;
  suppressExecNotifyOnExit: boolean;
>>>>>>> upstream/main
  runStartedAt?: number;
}): Promise<CronExecutionResult> {
  const resolvedVerboseLevel: VerboseLevel =
    normalizeVerboseLevel(params.cronSession.sessionEntry.verboseLevel) ??
    normalizeVerboseLevel(params.agentVerboseDefault) ??
    "off";
  registerAgentRunContext(params.cronSession.sessionEntry.sessionId, {
<<<<<<< HEAD
    sessionKey: params.agentSessionKey,
=======
    sessionKey: params.runSessionKey,
    sessionId: params.cronSession.sessionEntry.sessionId,
>>>>>>> upstream/main
    verboseLevel: resolvedVerboseLevel,
  });
  const executor = createCronPromptExecutor({
    cfg: params.cfg,
    cfgWithAgentDefaults: params.cfgWithAgentDefaults,
    job: params.job,
    agentId: params.agentId,
    agentDir: params.agentDir,
    agentSessionKey: params.agentSessionKey,
<<<<<<< HEAD
=======
    runSessionKey: params.runSessionKey,
>>>>>>> upstream/main
    workspaceDir: params.workspaceDir,
    lane: params.lane,
    resolvedVerboseLevel,
    thinkLevel: params.thinkLevel,
    timeoutMs: params.timeoutMs,
<<<<<<< HEAD
    messageChannel: params.resolvedDelivery.channel,
    resolvedDelivery: params.resolvedDelivery,
    toolPolicy: params.toolPolicy,
    skillsSnapshot: params.skillsSnapshot,
    agentPayload: params.agentPayload,
=======
    runTimeoutOverrideMs: params.runTimeoutOverrideMs,
    suppressExecNotifyOnExit: params.suppressExecNotifyOnExit,
    resolvedDelivery: params.resolvedDelivery,
    deliveryRequested: params.deliveryRequested,
    sourceDelivery: params.sourceDelivery,
    skillsSnapshot: params.skillsSnapshot,
    agentPayload: params.agentPayload,
    useSubagentFallbacks: params.useSubagentFallbacks,
    inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel,
    modelFallbacksOverride: params.modelFallbacksOverride,
>>>>>>> upstream/main
    liveSelection: params.liveSelection,
    cronSession: params.cronSession,
    abortSignal: params.abortSignal,
    abortReason: params.abortReason,
<<<<<<< HEAD
=======
    onExecutionStarted: params.onExecutionStarted,
    onExecutionPhase: params.onExecutionPhase,
>>>>>>> upstream/main
  });

  const runStartedAt = params.runStartedAt ?? Date.now();
  const MAX_MODEL_SWITCH_RETRIES = 2;
  let modelSwitchRetries = 0;
  while (true) {
    try {
      await executor.runPrompt(params.commandBody);
      break;
    } catch (err) {
      if (!(err instanceof LiveSessionModelSwitchError)) {
        throw err;
      }
      modelSwitchRetries += 1;
      if (modelSwitchRetries > MAX_MODEL_SWITCH_RETRIES) {
        logWarn(
          `[cron:${params.job.id}] LiveSessionModelSwitchError retry limit reached (${MAX_MODEL_SWITCH_RETRIES}); aborting`,
        );
        throw err;
      }
      params.liveSelection.provider = err.provider;
      params.liveSelection.model = err.model;
      params.liveSelection.authProfileId = err.authProfileId;
      params.liveSelection.authProfileIdSource = err.authProfileId
        ? err.authProfileIdSource
        : undefined;
      syncCronSessionLiveSelection({
        entry: params.cronSession.sessionEntry,
        liveSelection: params.liveSelection,
      });
      try {
<<<<<<< HEAD
=======
        // Persist the switched model before retrying so later delivery/session
        // metadata agrees with the model that actually handled the run.
>>>>>>> upstream/main
        await params.persistSessionEntry();
      } catch (persistErr) {
        logWarn(
          `[cron:${params.job.id}] Failed to persist model switch session entry: ${String(persistErr)}`,
        );
      }
      continue;
    }
  }

  let { runResult, fallbackProvider, fallbackModel, runEndedAt } = executor.getState();
  if (!runResult) {
    throw new Error("cron isolated run returned no result");
  }

  if (!params.isAborted()) {
    const interimPayloads = runResult.payloads ?? [];
    const {
      deliveryPayloadHasStructuredContent: interimPayloadHasStructuredContent,
<<<<<<< HEAD
=======
      hasFatalErrorPayload: interimHasFatalErrorPayload,
>>>>>>> upstream/main
      outputText: interimOutputText,
    } = resolveCronPayloadOutcome({
      payloads: interimPayloads,
      runLevelError: runResult.meta?.error,
<<<<<<< HEAD
=======
      failureSignal: runResult.meta?.failureSignal,
      finalAssistantVisibleText: runResult.meta?.finalAssistantVisibleText,
      preferFinalAssistantVisibleText: (
        await resolveCronChannelOutputPolicy(params.resolvedDelivery.channel, {
          deliveryRequested: params.deliveryRequested,
        })
      ).preferFinalAssistantVisibleText,
>>>>>>> upstream/main
    });
    const interimText = interimOutputText?.trim() ?? "";
    const shouldRetryInterimAck =
      !runResult.meta?.error &&
<<<<<<< HEAD
      !runResult.didSendViaMessagingTool &&
      !interimPayloadHasStructuredContent &&
      !interimPayloads.some((payload) => payload?.isError === true) &&
      !listDescendantRunsForRequester(params.agentSessionKey).some((entry) => {
        const descendantStartedAt =
          typeof entry.startedAt === "number" ? entry.startedAt : entry.createdAt;
        return typeof descendantStartedAt === "number" && descendantStartedAt >= runStartedAt;
      }) &&
      countActiveDescendantRuns(params.agentSessionKey) === 0 &&
      isLikelyInterimCronMessage(interimText);

    if (shouldRetryInterimAck) {
=======
      !interimHasFatalErrorPayload &&
      !runResult.didSendViaMessagingTool &&
      !interimPayloadHasStructuredContent &&
      !interimPayloads.some((payload) => payload?.isError === true) &&
      isLikelyInterimCronMessage(interimText);

    let hasFreshDescendants = false;
    let hasActiveDescendants = false;
    if (shouldRetryInterimAck) {
      const { countActiveDescendantRuns, listDescendantRunsForRequester } =
        await loadCronSubagentRegistryRuntime();
      hasFreshDescendants = listDescendantRunsForRequester(params.runSessionKey).some((entry) => {
        const descendantStartedAt =
          typeof entry.startedAt === "number" ? entry.startedAt : entry.createdAt;
        return typeof descendantStartedAt === "number" && descendantStartedAt >= runStartedAt;
      });
      hasActiveDescendants = countActiveDescendantRuns(params.runSessionKey) > 0;
    }

    if (shouldRetryInterimAck && !hasFreshDescendants && !hasActiveDescendants) {
      // Retry a bare acknowledgement only when no descendant subagent was
      // spawned; otherwise delivery waits for the subagent follow-up path.
>>>>>>> upstream/main
      const continuationPrompt = [
        "Your previous response was only an acknowledgement and did not complete this cron task.",
        "Complete the original task now.",
        "Do not send a status update like 'on it'.",
        "Use tools when needed, including sessions_spawn for parallel subtasks, wait for spawned subagents to finish, then return only the final summary.",
      ].join(" ");
      await executor.runPrompt(continuationPrompt);
      ({ runResult, fallbackProvider, fallbackModel, runEndedAt } = executor.getState());
    }
  }

  if (!runResult) {
    throw new Error("cron isolated run returned no result");
  }
  return {
    runResult,
    fallbackProvider,
    fallbackModel,
    runStartedAt,
    runEndedAt,
    liveSelection: params.liveSelection,
  };
}
