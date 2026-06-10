<<<<<<< HEAD
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import { buildAgentSessionKey } from "openclaw/plugin-sdk/routing";
import type { QaBusState } from "./bus-state.js";
import { extractQaToolPayload } from "./extract-tool-payload.js";
import { startQaGatewayChild } from "./gateway-child.js";
import { startQaLabServer } from "./lab-server.js";
import type { QaLabScenarioOutcome } from "./lab-server.js";
import { startQaMockOpenAiServer } from "./mock-openai-server.js";
import { renderQaMarkdownReport, type QaReportCheck, type QaReportScenario } from "./report.js";
import { qaChannelPlugin, type QaBusMessage } from "./runtime-api.js";
import { readQaBootstrapScenarioCatalog } from "./scenario-catalog.js";
=======
// Qa Lab plugin module implements suite behavior.
import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { disposeRegisteredAgentHarnesses } from "openclaw/plugin-sdk/agent-harness";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import {
  renderQaMarkdownReport,
  type QaReportCheck,
  type QaReportScenario,
} from "openclaw/plugin-sdk/qa-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { startQaGatewayChild, type QaCliBackendAuthMode } from "./gateway-child.js";
import type {
  QaLabLatestReport,
  QaLabScenarioOutcome,
  QaLabServerHandle,
  QaLabServerStartParams,
} from "./lab-server.types.js";
import { resolveQaLiveTurnTimeoutMs } from "./live-timeout.js";
import {
  isQaFastModeEnabled,
  normalizeQaProviderMode,
  type QaProviderMode,
} from "./model-selection.js";
import { DEFAULT_QA_LIVE_PROVIDER_MODE } from "./providers/index.js";
import { startQaProviderServer } from "./providers/server-runtime.js";
import type { QaThinkingLevel } from "./qa-gateway-config.js";
import {
  createQaTransportAdapter,
  defaultQaSuiteConcurrencyForTransport,
  normalizeQaTransportId,
  type QaTransportId,
} from "./qa-transport-registry.js";
import type { QaTransportAdapter } from "./qa-transport.js";
import { defaultQaModelForMode } from "./run-config.js";
import {
  captureRuntimeParityCell,
  isRuntimeParityResultPass,
  runRuntimeParityScenario,
  type RuntimeId,
  type RuntimeParityCell,
  type RuntimeParityResult,
} from "./runtime-parity.js";
import { readQaBootstrapScenarioCatalog } from "./scenario-catalog.js";
import { runScenarioFlow } from "./scenario-flow-runner.js";
import {
  applyQaMergePatch,
  collectQaSuiteGatewayConfigPatch,
  collectQaSuiteGatewayRuntimeOptions,
  collectQaSuitePluginIds,
  mapQaSuiteWithConcurrency,
  normalizeQaSuiteConcurrency,
  resolveQaSuiteWorkerStartStaggerMs,
  resolveQaSuiteOutputDir,
  scenarioRequiresControlUi,
  selectQaSuiteScenarios,
  shouldUseIsolatedQaSuiteScenarioWorkers,
  splitModelRef,
} from "./suite-planning.js";
import { createQaSuiteScenarioFlowApi } from "./suite-runtime-flow.js";
import { waitForGatewayHealthy, waitForTransportReady } from "./suite-runtime-gateway.js";
import type { QaSuiteRuntimeEnv } from "./suite-runtime-types.js";
import { countQaSuiteFailedScenarios, type QaSuiteSummaryJson } from "./suite-summary.js";
import { closeQaWebSessions } from "./web-runtime.js";
>>>>>>> upstream/main

type QaSuiteStep = {
  name: string;
  run: () => Promise<string | void>;
};

<<<<<<< HEAD
type QaSuiteScenarioResult = {
=======
function resolveQaSuiteControlUiEnabled(params: {
  explicit?: boolean;
  scenarios: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"];
}) {
  return (
    params.explicit ?? params.scenarios.some((scenario) => scenarioRequiresControlUi(scenario))
  );
}

export type QaSuiteScenarioResult = {
>>>>>>> upstream/main
  name: string;
  status: "pass" | "fail";
  steps: QaReportCheck[];
  details?: string;
<<<<<<< HEAD
};

type QaSuiteEnvironment = {
  lab: Awaited<ReturnType<typeof startQaLabServer>>;
  mock: Awaited<ReturnType<typeof startQaMockOpenAiServer>> | null;
  gateway: Awaited<ReturnType<typeof startQaGatewayChild>>;
  cfg: OpenClawConfig;
  providerMode: "mock-openai" | "live-openai";
  primaryModel: string;
  alternateModel: string;
};

const QA_IMAGE_UNDERSTANDING_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAT0lEQVR42u3RQQkAMAzAwPg33Wnos+wgBo40dboAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+Azy47PDiI4pA2wAAAABJRU5ErkJggg==";

type QaSkillStatusEntry = {
  name?: string;
  eligible?: boolean;
  disabled?: boolean;
  blockedByAllowlist?: boolean;
};

type QaConfigSnapshot = {
  hash?: string;
  config?: Record<string, unknown>;
};

function splitModelRef(ref: string) {
  const slash = ref.indexOf("/");
  if (slash <= 0 || slash === ref.length - 1) {
    return null;
  }
  return {
    provider: ref.slice(0, slash),
    model: ref.slice(slash + 1),
  };
}

function liveTurnTimeoutMs(env: QaSuiteEnvironment, fallbackMs: number) {
  return env.providerMode === "live-openai" ? Math.max(fallbackMs, 120_000) : fallbackMs;
}

function hasDiscoveryLabels(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("worked") &&
    lower.includes("failed") &&
    lower.includes("blocked") &&
    (lower.includes("follow-up") || lower.includes("follow up"))
  );
}

function reportsMissingDiscoveryFiles(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("not present") ||
    lower.includes("missing files") ||
    lower.includes("blocked by missing") ||
    lower.includes("could not inspect")
  );
=======
  runtimeParity?: RuntimeParityResult;
};

type QaSuiteEnvironment = {
  lab: QaLabServerHandle;
  webSessionIds: Set<string>;
} & QaSuiteRuntimeEnv;

export type QaSuiteStartLabFn = (params?: QaLabServerStartParams) => Promise<QaLabServerHandle>;

export type QaSuiteRunParams = {
  repoRoot?: string;
  outputDir?: string;
  providerMode?: QaProviderMode;
  transportId?: QaTransportId;
  primaryModel?: string;
  alternateModel?: string;
  fastMode?: boolean;
  thinkingDefault?: QaThinkingLevel;
  claudeCliAuthMode?: QaCliBackendAuthMode;
  scenarioIds?: string[];
  lab?: QaLabServerHandle;
  startLab?: QaSuiteStartLabFn;
  concurrency?: number;
  enabledPluginIds?: string[];
  controlUiEnabled?: boolean;
  transportReadyTimeoutMs?: number;
  forcedRuntime?: RuntimeId;
  runtimePair?: [RuntimeId, RuntimeId];
  captureRuntimeParityCell?: boolean;
};

function parseQaSuiteBooleanEnv(value: string | undefined): boolean | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") {
    return true;
  }
  if (normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off") {
    return false;
  }
  return undefined;
}

function shouldLogQaSuiteProgress(env: NodeJS.ProcessEnv = process.env) {
  const override = parseQaSuiteBooleanEnv(env.OPENCLAW_QA_SUITE_PROGRESS);
  if (override !== undefined) {
    return override;
  }
  return parseQaSuiteBooleanEnv(env.CI) === true;
}

function resolveQaSuiteTransportReadyTimeoutMs(
  explicitTimeoutMs?: number,
  env: NodeJS.ProcessEnv = process.env,
) {
  if (
    typeof explicitTimeoutMs === "number" &&
    Number.isFinite(explicitTimeoutMs) &&
    explicitTimeoutMs > 0
  ) {
    return Math.floor(explicitTimeoutMs);
  }
  const raw = env.OPENCLAW_QA_TRANSPORT_READY_TIMEOUT_MS;
  if (!raw) {
    return 120_000;
  }
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === undefined) {
    return 120_000;
  }
  return parsed;
}

function writeQaSuiteProgress(enabled: boolean, message: string) {
  if (!enabled) {
    return;
  }
  process.stderr.write(`[qa-suite] ${message}\n`);
}

async function waitForQaLabReady(baseUrl: string, timeoutMs = 10_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const { response, release } = await fetchWithSsrFGuard({
        url: `${baseUrl}/readyz`,
        policy: { allowPrivateNetwork: true },
        auditContext: "qa-lab-suite-wait-for-lab-ready",
      });
      try {
        if (response.ok) {
          return;
        }
      } finally {
        await release();
      }
    } catch {
      // retry
    }
    await sleep(100);
  }
  throw new Error(`timed out after ${timeoutMs}ms waiting for qa-lab ready`);
}

async function waitForQaLabReadyOrStopOwned(params: {
  lab: Pick<QaLabServerHandle, "listenUrl" | "stop">;
  ownsLab: boolean;
  timeoutMs?: number;
}) {
  try {
    await waitForQaLabReady(params.lab.listenUrl, params.timeoutMs);
  } catch (error) {
    if (params.ownsLab) {
      await params.lab.stop();
    }
    throw error;
  }
}

function sanitizeQaSuiteProgressValue(value: string): string {
  let normalized = "";
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code === undefined) {
      continue;
    }
    const isControl = code <= 0x1f || (code >= 0x7f && code <= 0x9f);
    normalized += isControl ? " " : char;
  }
  normalized = normalized.replace(/\s+/gu, " ").trim();
  return normalized.length > 0 ? normalized : "<empty>";
}

function requireQaSuiteStartLab(startLab: QaSuiteStartLabFn | undefined): QaSuiteStartLabFn {
  if (startLab) {
    return startLab;
  }
  throw new Error(
    "QA suite requires startLab when no lab handle is provided; use the runtime launcher or pass startLab explicitly.",
  );
}

function shouldRunQaSuiteWithIsolatedScenarioWorkers(params: {
  scenarios: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"];
  concurrency: number;
  lab?: QaLabServerHandle;
  startLab?: QaSuiteStartLabFn;
}) {
  if (
    !shouldUseIsolatedQaSuiteScenarioWorkers({
      scenarios: params.scenarios,
      concurrency: params.concurrency,
    })
  ) {
    return false;
  }

  if (params.concurrency === 1 && params.lab && !params.startLab) {
    return false;
  }

  return true;
}

const QA_IMAGE_UNDERSTANDING_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAklEQVR4AewaftIAAAK4SURBVO3BAQEAMAwCIG//znsQgXfJBZjUALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsl9wFmNQAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwP4TIF+7ciPkoAAAAASUVORK5CYII=";

const QA_IMAGE_UNDERSTANDING_LARGE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAACuklEQVR4Ae3BAQEAMAwCIG//znsQgXfJBZjUALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsBpjVALMaYFYDzGqAWQ0wqwFmNcCsl9wFmNQAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwGmNUAsxpgVgPMaoBZDTCrAWY1wKwP4TIF+2YE/z8AAAAASUVORK5CYII=";

const QA_IMAGE_UNDERSTANDING_VALID_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALklEQVR4nO3OoQEAAAyDsP7/9HYGJgJNdtuVDQAAAAAAACAHxH8AAAAAAACAHvBX0fhq85dN7QAAAABJRU5ErkJggg==";

function liveTurnTimeoutMs(
  env: Pick<QaSuiteRuntimeEnv, "providerMode" | "primaryModel" | "alternateModel">,
  fallbackMs: number,
) {
  return resolveQaLiveTurnTimeoutMs(env, fallbackMs);
>>>>>>> upstream/main
}

export type QaSuiteResult = {
  outputDir: string;
  reportPath: string;
  summaryPath: string;
  report: string;
  scenarios: QaSuiteScenarioResult[];
  watchUrl: string;
<<<<<<< HEAD
};

function createQaActionConfig(baseUrl: string): OpenClawConfig {
  return {
    channels: {
      "qa-channel": {
        enabled: true,
        baseUrl,
        botUserId: "openclaw",
        botDisplayName: "OpenClaw QA",
        allowFrom: ["*"],
      },
    },
  };
}

async function waitForCondition<T>(
  check: () => T | Promise<T | null | undefined> | null | undefined,
  timeoutMs = 15_000,
  intervalMs = 100,
): Promise<T> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const value = await check();
    if (value !== null && value !== undefined) {
      return value;
    }
    await sleep(intervalMs);
  }
  throw new Error(`timed out after ${timeoutMs}ms`);
}

async function waitForOutboundMessage(
  state: QaBusState,
  predicate: (message: QaBusMessage) => boolean,
  timeoutMs = 15_000,
) {
  return await waitForCondition(
    () =>
      state
        .getSnapshot()
        .messages.filter((message) => message.direction === "outbound")
        .find(predicate),
    timeoutMs,
  );
}

async function waitForNoOutbound(state: QaBusState, timeoutMs = 1_200) {
  await sleep(timeoutMs);
  const outbound = state
    .getSnapshot()
    .messages.filter((message) => message.direction === "outbound");
  if (outbound.length > 0) {
    throw new Error(`expected no outbound messages, saw ${outbound.length}`);
  }
}

function recentOutboundSummary(state: QaBusState, limit = 5) {
  return state
    .getSnapshot()
    .messages.filter((message) => message.direction === "outbound")
    .slice(-limit)
    .map((message) => `${message.conversation.id}:${message.text}`)
    .join(" | ");
}

=======
  runtimeParityCell?: RuntimeParityCell;
};

>>>>>>> upstream/main
async function runScenario(name: string, steps: QaSuiteStep[]): Promise<QaSuiteScenarioResult> {
  const stepResults: QaReportCheck[] = [];
  for (const step of steps) {
    try {
      if (process.env.OPENCLAW_QA_DEBUG === "1") {
        console.error(`[qa-suite] start scenario="${name}" step="${step.name}"`);
      }
      const details = await step.run();
      if (process.env.OPENCLAW_QA_DEBUG === "1") {
        console.error(`[qa-suite] pass scenario="${name}" step="${step.name}"`);
      }
      stepResults.push({
        name: step.name,
        status: "pass",
        ...(details ? { details } : {}),
      });
    } catch (error) {
<<<<<<< HEAD
      const details = error instanceof Error ? error.message : String(error);
=======
      const details = formatErrorMessage(error);
>>>>>>> upstream/main
      if (process.env.OPENCLAW_QA_DEBUG === "1") {
        console.error(`[qa-suite] fail scenario="${name}" step="${step.name}" details=${details}`);
      }
      stepResults.push({
        name: step.name,
        status: "fail",
        details,
      });
      return {
        name,
        status: "fail",
        steps: stepResults,
        details,
      };
    }
  }
  return {
    name,
    status: "pass",
    steps: stepResults,
  };
}

<<<<<<< HEAD
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`request failed ${response.status}: ${url}`);
  }
  return (await response.json()) as T;
}

async function waitForGatewayHealthy(env: QaSuiteEnvironment, timeoutMs = 45_000) {
  await waitForCondition(
    async () => {
      try {
        const response = await fetch(`${env.gateway.baseUrl}/readyz`);
        return response.ok ? true : undefined;
      } catch {
        return undefined;
      }
    },
    timeoutMs,
    250,
  );
}

async function waitForQaChannelReady(env: QaSuiteEnvironment, timeoutMs = 45_000) {
  await waitForCondition(
    async () => {
      try {
        const payload = (await env.gateway.call(
          "channels.status",
          { probe: false, timeoutMs: 2_000 },
          { timeoutMs: 5_000 },
        )) as {
          channelAccounts?: Record<
            string,
            Array<{
              accountId?: string;
              running?: boolean;
              restartPending?: boolean;
            }>
          >;
        };
        const accounts = payload.channelAccounts?.["qa-channel"] ?? [];
        const account = accounts.find((entry) => entry.accountId === "default") ?? accounts[0];
        if (account?.running && account.restartPending !== true) {
          return true;
        }
        return undefined;
      } catch {
        return undefined;
      }
    },
    timeoutMs,
    500,
  );
}

async function waitForConfigRestartSettle(
  env: QaSuiteEnvironment,
  restartDelayMs = 1_000,
  timeoutMs = 60_000,
) {
  // config.patch/config.apply schedule a delayed SIGUSR1 restart after the RPC returns.
  // Give the restart window time to fire before treating readyz as settled.
  await sleep(restartDelayMs + 750);
  await waitForGatewayHealthy(env, timeoutMs);
}

function isGatewayRestartRace(error: unknown) {
  const text = error instanceof Error ? error.message : String(error);
  return (
    text.includes("gateway closed (1012)") ||
    text.includes("gateway closed (1006") ||
    text.includes("abnormal closure") ||
    text.includes("service restart")
  );
}

async function readConfigSnapshot(env: QaSuiteEnvironment) {
  const snapshot = (await env.gateway.call(
    "config.get",
    {},
    { timeoutMs: 60_000 },
  )) as QaConfigSnapshot;
  if (!snapshot.hash || !snapshot.config) {
    throw new Error("config.get returned no hash/config");
  }
  return {
    hash: snapshot.hash,
    config: snapshot.config,
  } satisfies { hash: string; config: Record<string, unknown> };
}

async function patchConfig(params: {
  env: QaSuiteEnvironment;
  patch: Record<string, unknown>;
  sessionKey?: string;
  note?: string;
  restartDelayMs?: number;
}) {
  const snapshot = await readConfigSnapshot(params.env);
  const restartDelayMs = params.restartDelayMs ?? 1_000;
  try {
    const result = await params.env.gateway.call(
      "config.patch",
      {
        raw: JSON.stringify(params.patch, null, 2),
        baseHash: snapshot.hash,
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.note ? { note: params.note } : {}),
        restartDelayMs,
      },
      { timeoutMs: 45_000 },
    );
    await waitForConfigRestartSettle(params.env, restartDelayMs);
    return result;
  } catch (error) {
    if (!isGatewayRestartRace(error)) {
      throw error;
    }
    await waitForConfigRestartSettle(params.env, restartDelayMs);
    return { ok: true, restarted: true };
  }
}

async function applyConfig(params: {
  env: QaSuiteEnvironment;
  nextConfig: Record<string, unknown>;
  sessionKey?: string;
  note?: string;
  restartDelayMs?: number;
}) {
  const snapshot = await readConfigSnapshot(params.env);
  const restartDelayMs = params.restartDelayMs ?? 1_000;
  try {
    const result = await params.env.gateway.call(
      "config.apply",
      {
        raw: JSON.stringify(params.nextConfig, null, 2),
        baseHash: snapshot.hash,
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.note ? { note: params.note } : {}),
        restartDelayMs,
      },
      { timeoutMs: 45_000 },
    );
    await waitForConfigRestartSettle(params.env, restartDelayMs);
    return result;
  } catch (error) {
    if (!isGatewayRestartRace(error)) {
      throw error;
    }
    await waitForConfigRestartSettle(params.env, restartDelayMs);
    return { ok: true, restarted: true };
  }
}

async function createSession(env: QaSuiteEnvironment, label: string, key?: string) {
  const created = (await env.gateway.call(
    "sessions.create",
    {
      label,
      ...(key ? { key } : {}),
    },
    {
      timeoutMs: liveTurnTimeoutMs(env, 60_000),
    },
  )) as { key?: string };
  const sessionKey = created.key?.trim();
  if (!sessionKey) {
    throw new Error("sessions.create returned no key");
  }
  return sessionKey;
}

async function readEffectiveTools(env: QaSuiteEnvironment, sessionKey: string) {
  const payload = (await env.gateway.call(
    "tools.effective",
    {
      sessionKey,
    },
    {
      timeoutMs: liveTurnTimeoutMs(env, 90_000),
    },
  )) as {
    groups?: Array<{ tools?: Array<{ id?: string }> }>;
  };
  const ids = new Set<string>();
  for (const group of payload.groups ?? []) {
    for (const tool of group.tools ?? []) {
      if (tool.id?.trim()) {
        ids.add(tool.id.trim());
      }
    }
  }
  return ids;
}

async function readSkillStatus(env: QaSuiteEnvironment, agentId = "qa") {
  const payload = (await env.gateway.call(
    "skills.status",
    {
      agentId,
    },
    {
      timeoutMs: liveTurnTimeoutMs(env, 45_000),
    },
  )) as {
    skills?: QaSkillStatusEntry[];
  };
  return payload.skills ?? [];
}

async function runQaCli(
  env: QaSuiteEnvironment,
  args: string[],
  opts?: { timeoutMs?: number; json?: boolean },
) {
  const stdout: Buffer[] = [];
  const stderr: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, ["dist/index.js", ...args], {
      cwd: process.cwd(),
      env: env.gateway.runtimeEnv,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`qa cli timed out: openclaw ${args.join(" ")}`));
    }, opts?.timeoutMs ?? 60_000);
    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `qa cli failed (${code ?? "unknown"}): ${Buffer.concat(stderr).toString("utf8").trim()}`,
        ),
      );
    });
  });
  const text = Buffer.concat(stdout).toString("utf8").trim();
  if (!opts?.json) {
    return text;
  }
  return text ? (JSON.parse(text) as unknown) : {};
}

async function forceMemoryIndex(params: {
  env: QaSuiteEnvironment;
  query: string;
  expectedNeedle: string;
}) {
  await waitForGatewayHealthy(params.env, 60_000);
  await waitForQaChannelReady(params.env, 60_000);
  await runQaCli(params.env, ["memory", "index", "--agent", "qa", "--force"], {
    timeoutMs: liveTurnTimeoutMs(params.env, 60_000),
  });
  const payload = (await runQaCli(
    params.env,
    ["memory", "search", "--agent", "qa", "--json", "--query", params.query],
    {
      timeoutMs: liveTurnTimeoutMs(params.env, 60_000),
      json: true,
    },
  )) as { results?: Array<{ snippet?: string; text?: string; path?: string }> };
  const haystack = JSON.stringify(payload.results ?? []);
  if (!haystack.includes(params.expectedNeedle)) {
    throw new Error(`memory index missing expected fact after reindex: ${haystack}`);
  }
}

function findSkill(skills: QaSkillStatusEntry[], name: string) {
  return skills.find((skill) => skill.name === name);
}

async function writeWorkspaceSkill(params: {
  env: QaSuiteEnvironment;
  name: string;
  body: string;
}) {
  const skillDir = path.join(params.env.gateway.workspaceDir, "skills", params.name);
  await fs.mkdir(skillDir, { recursive: true });
  const skillPath = path.join(skillDir, "SKILL.md");
  await fs.writeFile(skillPath, `${params.body.trim()}\n`, "utf8");
  return skillPath;
}

async function callPluginToolsMcp(params: {
  env: QaSuiteEnvironment;
  toolName: string;
  args: Record<string, unknown>;
}) {
  const transportEnv = Object.fromEntries(
    Object.entries(params.env.gateway.runtimeEnv).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--import", "tsx", "src/mcp/plugin-tools-serve.ts"],
    stderr: "pipe",
    env: transportEnv,
  });
  const client = new Client({ name: "openclaw-qa-suite", version: "0.0.0" }, {});
  try {
    await client.connect(transport);
    const listed = await client.listTools();
    const tool = listed.tools.find((entry) => entry.name === params.toolName);
    if (!tool) {
      throw new Error(`MCP tool missing: ${params.toolName}`);
    }
    return await client.callTool({
      name: params.toolName,
      arguments: params.args,
    });
  } finally {
    await client.close().catch(() => {});
  }
}

async function runAgentPrompt(
  env: QaSuiteEnvironment,
  params: {
    sessionKey: string;
    message: string;
    to?: string;
    threadId?: string;
    provider?: string;
    model?: string;
    timeoutMs?: number;
    attachments?: Array<{
      mimeType: string;
      fileName: string;
      content: string;
    }>;
  },
) {
  const target = params.to ?? "dm:qa-operator";
  const started = (await env.gateway.call(
    "agent",
    {
      idempotencyKey: randomUUID(),
      agentId: "qa",
      sessionKey: params.sessionKey,
      message: params.message,
      deliver: true,
      channel: "qa-channel",
      to: target,
      replyChannel: "qa-channel",
      replyTo: target,
      ...(params.threadId ? { threadId: params.threadId } : {}),
      ...(params.provider ? { provider: params.provider } : {}),
      ...(params.model ? { model: params.model } : {}),
      ...(params.attachments ? { attachments: params.attachments } : {}),
    },
    {
      timeoutMs: params.timeoutMs ?? 30_000,
    },
  )) as { runId?: string; status?: string };
  if (!started.runId) {
    throw new Error(`agent call did not return a runId: ${JSON.stringify(started)}`);
  }
  const waited = (await env.gateway.call(
    "agent.wait",
    {
      runId: started.runId,
      timeoutMs: params.timeoutMs ?? 30_000,
    },
    {
      timeoutMs: (params.timeoutMs ?? 30_000) + 5_000,
    },
  )) as { status?: string; error?: string };
  if (waited.status !== "ok") {
    throw new Error(
      `agent.wait returned ${String(waited.status ?? "unknown")}: ${waited.error ?? "no error"}`,
    );
  }
  return {
    started,
    waited,
  };
}

type QaActionName = "delete" | "edit" | "react" | "thread-create";

async function handleQaAction(params: {
  env: QaSuiteEnvironment;
  action: QaActionName;
  args: Record<string, unknown>;
}) {
  const result = await qaChannelPlugin.actions?.handleAction?.({
    channel: "qa-channel",
    action: params.action,
    cfg: params.env.cfg,
    accountId: "default",
    params: params.args,
  });
  return extractQaToolPayload(result);
}

function buildScenarioMap(env: QaSuiteEnvironment) {
  const state = env.lab.state;
  const reset = async () => {
    state.reset();
    await sleep(100);
  };

  return new Map<string, () => Promise<QaSuiteScenarioResult>>([
    [
      "channel-chat-baseline",
      async () =>
        await runScenario("Channel baseline conversation", [
          {
            name: "ignores unmentioned channel chatter",
            run: async () => {
              await reset();
              state.addInboundMessage({
                conversation: { id: "qa-room", kind: "channel", title: "QA Room" },
                senderId: "alice",
                senderName: "Alice",
                text: "hello team, no bot ping here",
              });
              await waitForNoOutbound(state);
            },
          },
          {
            name: "replies when mentioned in channel",
            run: async () => {
              state.addInboundMessage({
                conversation: { id: "qa-room", kind: "channel", title: "QA Room" },
                senderId: "alice",
                senderName: "Alice",
                text: "@openclaw explain the QA lab",
              });
              const message = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-room" && !candidate.threadId,
                env.providerMode === "live-openai" ? 45_000 : 45_000,
              );
              return message.text;
            },
          },
        ]),
    ],
    [
      "cron-one-minute-ping",
      async () =>
        await runScenario("Cron one-minute ping", [
          {
            name: "stores a reminder roughly one minute ahead",
            run: async () => {
              await reset();
              const at = new Date(Date.now() + 60_000).toISOString();
              const cronMarker = `QA-CRON-${randomUUID().slice(0, 8)}`;
              const response = (await env.gateway.call("cron.add", {
                name: `qa-suite-${randomUUID()}`,
                enabled: true,
                schedule: { kind: "at", at },
                sessionTarget: "isolated",
                wakeMode: "next-heartbeat",
                payload: {
                  kind: "agentTurn",
                  message: `A QA cron just fired. Send a one-line ping back to the room containing this exact marker: ${cronMarker}`,
                },
                delivery: {
                  mode: "announce",
                  channel: "qa-channel",
                  to: "channel:qa-room",
                },
              })) as { id?: string; schedule?: { at?: string } };
              const scheduledAt = response.schedule?.at ?? at;
              const delta = new Date(scheduledAt).getTime() - Date.now();
              if (delta < 45_000 || delta > 75_000) {
                throw new Error(`expected ~1 minute schedule, got ${delta}ms`);
              }
              (globalThis as typeof globalThis & { __qaCronJobId?: string }).__qaCronJobId =
                response.id;
              (globalThis as typeof globalThis & { __qaCronMarker?: string }).__qaCronMarker =
                cronMarker;
              return scheduledAt;
            },
          },
          {
            name: "forces the reminder through QA channel delivery",
            run: async () => {
              const jobId = (globalThis as typeof globalThis & { __qaCronJobId?: string })
                .__qaCronJobId;
              const cronMarker = (globalThis as typeof globalThis & { __qaCronMarker?: string })
                .__qaCronMarker;
              if (!jobId) {
                throw new Error("missing cron job id");
              }
              if (!cronMarker) {
                throw new Error("missing cron marker");
              }
              await env.gateway.call(
                "cron.run",
                { id: jobId, mode: "force" },
                { timeoutMs: 30_000 },
              );
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) =>
                  candidate.conversation.id === "qa-room" && candidate.text.includes(cronMarker),
                liveTurnTimeoutMs(env, 30_000),
              );
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "dm-chat-baseline",
      async () =>
        await runScenario("DM baseline conversation", [
          {
            name: "replies coherently in DM",
            run: async () => {
              await reset();
              state.addInboundMessage({
                conversation: { id: "alice", kind: "direct" },
                senderId: "alice",
                senderName: "Alice",
                text: "Hello there, who are you?",
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "alice",
              );
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "lobster-invaders-build",
      async () =>
        await runScenario("Build Lobster Invaders", [
          {
            name: "creates the artifact after reading context",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:lobster-invaders",
                message:
                  "Read the QA kickoff context first, then build a tiny Lobster Invaders HTML game in this workspace and tell me where it is.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-operator",
              );
              const artifactPath = path.join(env.gateway.workspaceDir, "lobster-invaders.html");
              const artifact = await fs.readFile(artifactPath, "utf8");
              if (!artifact.includes("Lobster Invaders")) {
                throw new Error("missing Lobster Invaders artifact");
              }
              if (env.mock) {
                const requests = await fetchJson<Array<{ prompt?: string; toolOutput?: string }>>(
                  `${env.mock.baseUrl}/debug/requests`,
                );
                if (
                  !requests.some((request) => (request.toolOutput ?? "").includes("QA mission"))
                ) {
                  throw new Error("expected pre-write read evidence");
                }
              }
              return "lobster-invaders.html";
            },
          },
        ]),
    ],
    [
      "memory-recall",
      async () =>
        await runScenario("Memory recall after context switch", [
          {
            name: "stores the canary fact",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:memory",
                message: "Please remember this fact for later: the QA canary code is ALPHA-7.",
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-operator",
              );
              return outbound.text;
            },
          },
          {
            name: "recalls the same fact later",
            run: async () => {
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:memory",
                message: "What was the QA canary code I asked you to remember earlier?",
              });
              const outbound = await waitForCondition(
                () =>
                  state
                    .getSnapshot()
                    .messages.filter(
                      (candidate) =>
                        candidate.direction === "outbound" &&
                        candidate.conversation.id === "qa-operator" &&
                        candidate.text.includes("ALPHA-7"),
                    )
                    .at(-1),
                20_000,
              );
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "model-switch-follow-up",
      async () =>
        await runScenario("Model switch follow-up", [
          {
            name: "runs on the default configured model",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:model-switch",
                message: "Say hello from the default configured model.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-operator",
              );
              if (env.mock) {
                const request = await fetchJson<{ body?: { model?: string } }>(
                  `${env.mock.baseUrl}/debug/last-request`,
                );
                return String(request.body?.model ?? "");
              }
              return outbound.text;
            },
          },
          {
            name: "switches to the alternate model and continues",
            run: async () => {
              const alternate = splitModelRef(env.alternateModel);
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:model-switch",
                message: "Continue the exchange after switching models and note the handoff.",
                provider: alternate?.provider,
                model: alternate?.model,
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForCondition(
                () =>
                  state
                    .getSnapshot()
                    .messages.filter(
                      (candidate) =>
                        candidate.direction === "outbound" &&
                        candidate.conversation.id === "qa-operator" &&
                        (candidate.text.toLowerCase().includes("switch") ||
                          candidate.text.toLowerCase().includes("handoff")),
                    )
                    .at(-1),
                liveTurnTimeoutMs(env, 20_000),
              );
              if (env.mock) {
                const request = await fetchJson<{ body?: { model?: string } }>(
                  `${env.mock.baseUrl}/debug/last-request`,
                );
                if (request.body?.model !== "gpt-5.4-alt") {
                  throw new Error(`expected gpt-5.4-alt, got ${String(request.body?.model ?? "")}`);
                }
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "reaction-edit-delete",
      async () =>
        await runScenario("Reaction, edit, delete lifecycle", [
          {
            name: "records reaction, edit, and delete actions",
            run: async () => {
              await reset();
              const seed = state.addOutboundMessage({
                to: "channel:qa-room",
                text: "seed message",
              });
              await handleQaAction({
                env,
                action: "react",
                args: { messageId: seed.id, emoji: "white_check_mark" },
              });
              await handleQaAction({
                env,
                action: "edit",
                args: { messageId: seed.id, text: "seed message (edited)" },
              });
              await handleQaAction({
                env,
                action: "delete",
                args: { messageId: seed.id },
              });
              const message = state.readMessage({ messageId: seed.id });
              if (
                message.reactions.length === 0 ||
                !message.deleted ||
                !message.text.includes("(edited)")
              ) {
                throw new Error("message lifecycle did not persist");
              }
              return message.text;
            },
          },
        ]),
    ],
    [
      "source-docs-discovery-report",
      async () =>
        await runScenario("Source and docs discovery report", [
          {
            name: "reads seeded material and emits a protocol report",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:discovery",
                message:
                  "Read the seeded docs and source plan. The full repo is mounted under ./repo/. Explicitly inspect repo/qa/seed-scenarios.json, repo/qa/QA_KICKOFF_TASK.md, repo/extensions/qa-lab/src/suite.ts, and repo/docs/help/testing.md, then report grouped into Worked, Failed, Blocked, and Follow-up. Mention at least two extra QA scenarios beyond the seed list.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForCondition(
                () =>
                  state
                    .getSnapshot()
                    .messages.filter(
                      (candidate) =>
                        candidate.direction === "outbound" &&
                        candidate.conversation.id === "qa-operator" &&
                        hasDiscoveryLabels(candidate.text),
                    )
                    .at(-1),
                liveTurnTimeoutMs(env, 20_000),
                env.providerMode === "live-openai" ? 250 : 100,
              );
              if (reportsMissingDiscoveryFiles(outbound.text)) {
                throw new Error(`discovery report still missed repo files: ${outbound.text}`);
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "subagent-handoff",
      async () =>
        await runScenario("Subagent handoff", [
          {
            name: "delegates a bounded task and reports the result",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:subagent",
                message:
                  "Delegate one bounded QA task to a subagent. Wait for the subagent to finish. Then reply with three labeled sections exactly once: Delegated task, Result, Evidence. Include the child result itself, not 'waiting'.",
                timeoutMs: liveTurnTimeoutMs(env, 90_000),
              });
              const outbound = await waitForCondition(
                () =>
                  state
                    .getSnapshot()
                    .messages.filter(
                      (candidate) =>
                        candidate.direction === "outbound" &&
                        candidate.conversation.id === "qa-operator" &&
                        candidate.text.toLowerCase().includes("delegated task") &&
                        candidate.text.toLowerCase().includes("result") &&
                        candidate.text.toLowerCase().includes("evidence") &&
                        !candidate.text.toLowerCase().includes("waiting"),
                    )
                    .at(-1),
                liveTurnTimeoutMs(env, 45_000),
                env.providerMode === "live-openai" ? 250 : 100,
              );
              const lower = outbound.text.toLowerCase();
              if (
                lower.includes("failed to delegate") ||
                lower.includes("could not delegate") ||
                lower.includes("subagent unavailable")
              ) {
                throw new Error(`subagent handoff reported failure: ${outbound.text}`);
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "thread-follow-up",
      async () =>
        await runScenario("Threaded follow-up", [
          {
            name: "keeps follow-up inside the thread",
            run: async () => {
              await reset();
              const threadPayload = (await handleQaAction({
                env,
                action: "thread-create",
                args: {
                  channelId: "qa-room",
                  title: "QA deep dive",
                },
              })) as { thread?: { id?: string } } | undefined;
              const threadId = threadPayload?.thread?.id;
              if (!threadId) {
                throw new Error("missing thread id");
              }
              state.addInboundMessage({
                conversation: { id: "qa-room", kind: "channel", title: "QA Room" },
                senderId: "alice",
                senderName: "Alice",
                text: "@openclaw reply in one short sentence inside this thread only. Do not use ACP or any external runtime. Confirm you stayed in-thread.",
                threadId,
                threadTitle: "QA deep dive",
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) =>
                  candidate.conversation.id === "qa-room" && candidate.threadId === threadId,
                env.providerMode === "live-openai" ? 45_000 : 15_000,
              );
              const leaked = state
                .getSnapshot()
                .messages.some(
                  (candidate) =>
                    candidate.direction === "outbound" &&
                    candidate.conversation.id === "qa-room" &&
                    !candidate.threadId,
                );
              if (leaked) {
                throw new Error("thread reply leaked into root channel");
              }
              const lower = outbound.text.toLowerCase();
              if (
                lower.includes("acp backend") ||
                lower.includes("acpx") ||
                lower.includes("not configured")
              ) {
                throw new Error(`thread reply fell back to ACP error: ${outbound.text}`);
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "memory-tools-channel-context",
      async () =>
        await runScenario("Memory tools in channel context", [
          {
            name: "uses memory_search plus memory_get before answering in-channel",
            run: async () => {
              await reset();
              await fs.writeFile(
                path.join(env.gateway.workspaceDir, "MEMORY.md"),
                "Hidden QA fact: the project codename is ORBIT-9.\n",
                "utf8",
              );
              await forceMemoryIndex({
                env,
                query: "project codename ORBIT-9",
                expectedNeedle: "ORBIT-9",
              });
              const prompt =
                "@openclaw Memory tools check: what is the hidden project codename stored only in memory? Use memory tools first.";
              state.addInboundMessage({
                conversation: { id: "qa-room", kind: "channel", title: "QA Room" },
                senderId: "alice",
                senderName: "Alice",
                text: prompt,
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) =>
                  candidate.conversation.id === "qa-room" && candidate.text.includes("ORBIT-9"),
                liveTurnTimeoutMs(env, 30_000),
              );
              if (env.mock) {
                const requests = await fetchJson<
                  Array<{ allInputText?: string; plannedToolName?: string; toolOutput?: string }>
                >(`${env.mock.baseUrl}/debug/requests`);
                const relevant = requests.filter((request) =>
                  String(request.allInputText ?? "").includes("Memory tools check"),
                );
                if (!relevant.some((request) => request.plannedToolName === "memory_search")) {
                  throw new Error("expected memory_search in mock request plan");
                }
                if (!requests.some((request) => request.plannedToolName === "memory_get")) {
                  throw new Error("expected memory_get in mock request plan");
                }
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "memory-failure-fallback",
      async () =>
        await runScenario("Memory failure fallback", [
          {
            name: "falls back cleanly when group:memory tools are denied",
            run: async () => {
              const original = await readConfigSnapshot(env);
              const originalTools =
                original.config.tools && typeof original.config.tools === "object"
                  ? (original.config.tools as Record<string, unknown>)
                  : null;
              const originalToolsDeny = originalTools
                ? Object.prototype.hasOwnProperty.call(originalTools, "deny")
                  ? structuredClone(originalTools.deny)
                  : undefined
                : undefined;
              await fs.writeFile(
                path.join(env.gateway.workspaceDir, "MEMORY.md"),
                "Do not reveal directly: fallback fact is ORBIT-9.\n",
                "utf8",
              );
              await patchConfig({
                env,
                patch: { tools: { deny: ["group:memory"] } },
              });
              await waitForGatewayHealthy(env);
              await waitForQaChannelReady(env, 60_000);
              try {
                const sessionKey = await createSession(env, "Memory fallback");
                const tools = await readEffectiveTools(env, sessionKey);
                if (tools.has("memory_search") || tools.has("memory_get")) {
                  throw new Error("memory tools still present after deny patch");
                }
                await reset();
                await runAgentPrompt(env, {
                  sessionKey: "agent:qa:memory-failure",
                  message:
                    "Memory unavailable check: a hidden fact exists only in memory files. If you cannot confirm it, say so clearly and do not guess.",
                  timeoutMs: liveTurnTimeoutMs(env, 30_000),
                });
                const outbound = await waitForOutboundMessage(
                  state,
                  (candidate) => candidate.conversation.id === "qa-operator",
                  liveTurnTimeoutMs(env, 30_000),
                );
                const lower = outbound.text.toLowerCase();
                if (outbound.text.includes("ORBIT-9")) {
                  throw new Error(`hallucinated hidden fact: ${outbound.text}`);
                }
                if (!lower.includes("could not confirm") && !lower.includes("will not guess")) {
                  throw new Error(`missing graceful fallback language: ${outbound.text}`);
                }
                return outbound.text;
              } finally {
                await patchConfig({
                  env,
                  patch: {
                    tools: {
                      deny: originalToolsDeny === undefined ? null : originalToolsDeny,
                    },
                  },
                });
                await waitForGatewayHealthy(env);
                await waitForQaChannelReady(env, 60_000);
              }
            },
          },
        ]),
    ],
    [
      "model-switch-tool-continuity",
      async () =>
        await runScenario("Model switch with tool continuity", [
          {
            name: "keeps using tools after switching models",
            run: async () => {
              await waitForGatewayHealthy(env, 60_000);
              await waitForQaChannelReady(env, 60_000);
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:model-switch-tools",
                message:
                  "Read QA_KICKOFF_TASK.md and summarize the QA mission in one clause before any model switch.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const alternate = splitModelRef(env.alternateModel);
              const beforeSwitchCursor = state.getSnapshot().messages.length;
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:model-switch-tools",
                message:
                  "Switch models now. Tool continuity check: reread QA_KICKOFF_TASK.md and mention the handoff in one short sentence.",
                provider: alternate?.provider,
                model: alternate?.model,
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForCondition(
                () => {
                  const snapshot = state.getSnapshot();
                  return snapshot.messages
                    .slice(beforeSwitchCursor)
                    .filter(
                      (candidate) =>
                        candidate.direction === "outbound" &&
                        candidate.conversation.id === "qa-operator" &&
                        (candidate.text.toLowerCase().includes("model switch") ||
                          candidate.text.toLowerCase().includes("handoff")),
                    )
                    .at(-1);
                },
                liveTurnTimeoutMs(env, 30_000),
              );
              if (env.mock) {
                const requests = await fetchJson<
                  Array<{ allInputText?: string; plannedToolName?: string; model?: string }>
                >(`${env.mock.baseUrl}/debug/requests`);
                const switched = requests.find((request) =>
                  String(request.allInputText ?? "").includes("Tool continuity check"),
                );
                if (switched?.plannedToolName !== "read") {
                  throw new Error(
                    `expected read after switch, got ${String(switched?.plannedToolName ?? "")}`,
                  );
                }
                if (switched?.model !== "gpt-5.4-alt") {
                  throw new Error(`expected alternate model, got ${String(switched?.model ?? "")}`);
                }
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "mcp-plugin-tools-call",
      async () =>
        await runScenario("MCP plugin-tools call", [
          {
            name: "serves and calls memory_search over MCP",
            run: async () => {
              await fs.writeFile(
                path.join(env.gateway.workspaceDir, "MEMORY.md"),
                "MCP fact: the codename is ORBIT-9.\n",
                "utf8",
              );
              await forceMemoryIndex({
                env,
                query: "ORBIT-9 codename",
                expectedNeedle: "ORBIT-9",
              });
              const result = await callPluginToolsMcp({
                env,
                toolName: "memory_search",
                args: {
                  query: "ORBIT-9 codename",
                  maxResults: 3,
                },
              });
              const text = JSON.stringify(result.content ?? []);
              if (!text.includes("ORBIT-9")) {
                throw new Error(`MCP memory_search missed expected fact: ${text}`);
              }
              return text;
            },
          },
        ]),
    ],
    [
      "skill-visibility-invocation",
      async () =>
        await runScenario("Skill visibility and invocation", [
          {
            name: "reports visible skill and applies its marker on the next turn",
            run: async () => {
              await writeWorkspaceSkill({
                env,
                name: "qa-visible-skill",
                body: `---
name: qa-visible-skill
description: Visible QA skill marker
---
When the user asks for the visible skill marker exactly, reply with exactly: VISIBLE-SKILL-OK`,
              });
              const skills = await readSkillStatus(env);
              const visible = findSkill(skills, "qa-visible-skill");
              if (!visible?.eligible || visible.disabled || visible.blockedByAllowlist) {
                throw new Error(`skill not visible/eligible: ${JSON.stringify(visible)}`);
              }
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:visible-skill",
                message: "Visible skill marker: give me the visible skill marker exactly.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) =>
                  candidate.conversation.id === "qa-operator" &&
                  candidate.text.includes("VISIBLE-SKILL-OK"),
                liveTurnTimeoutMs(env, 20_000),
              );
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "skill-install-hot-availability",
      async () =>
        await runScenario("Skill install hot availability", [
          {
            name: "picks up a newly added workspace skill without restart",
            run: async () => {
              const before = await readSkillStatus(env);
              if (findSkill(before, "qa-hot-install-skill")) {
                throw new Error("qa-hot-install-skill unexpectedly already present");
              }
              await writeWorkspaceSkill({
                env,
                name: "qa-hot-install-skill",
                body: `---
name: qa-hot-install-skill
description: Hot install QA marker
---
When the user asks for the hot install marker exactly, reply with exactly: HOT-INSTALL-OK`,
              });
              await waitForCondition(
                async () => {
                  const skills = await readSkillStatus(env);
                  return findSkill(skills, "qa-hot-install-skill")?.eligible ? true : undefined;
                },
                15_000,
                200,
              );
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:hot-skill",
                message: "Hot install marker: give me the hot install marker exactly.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) =>
                  candidate.conversation.id === "qa-operator" &&
                  candidate.text.includes("HOT-INSTALL-OK"),
                liveTurnTimeoutMs(env, 20_000),
              );
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "native-image-generation",
      async () =>
        await runScenario("Native image generation", [
          {
            name: "enables image_generate and saves a real media artifact",
            run: async () => {
              const imageModelRef =
                env.providerMode === "live-openai" ? "openai/gpt-image-1" : "openai/gpt-image-1";
              await patchConfig({
                env,
                patch:
                  env.providerMode === "mock-openai"
                    ? {
                        plugins: {
                          allow: ["memory-core", "openai", "qa-channel"],
                          entries: {
                            openai: {
                              enabled: true,
                            },
                          },
                        },
                        models: {
                          providers: {
                            openai: {
                              baseUrl: `${env.mock?.baseUrl}/v1`,
                              apiKey: "test",
                              api: "openai-responses",
                              models: [
                                {
                                  id: "gpt-image-1",
                                  name: "gpt-image-1",
                                  api: "openai-responses",
                                  reasoning: false,
                                  input: ["text"],
                                  cost: {
                                    input: 0,
                                    output: 0,
                                    cacheRead: 0,
                                    cacheWrite: 0,
                                  },
                                  contextWindow: 128_000,
                                  maxTokens: 4096,
                                },
                              ],
                            },
                          },
                        },
                        agents: {
                          defaults: {
                            imageGenerationModel: {
                              primary: "openai/gpt-image-1",
                            },
                          },
                        },
                      }
                    : {
                        agents: {
                          defaults: {
                            imageGenerationModel: {
                              primary: imageModelRef,
                            },
                          },
                        },
                      },
              });
              await waitForGatewayHealthy(env);
              const sessionKey = await createSession(env, "Image generation");
              const tools = await readEffectiveTools(env, sessionKey);
              if (!tools.has("image_generate")) {
                throw new Error("image_generate not present after imageGenerationModel patch");
              }
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:image-generate",
                message:
                  "Image generation check: generate a QA lighthouse image and summarize it in one short sentence.",
                timeoutMs: liveTurnTimeoutMs(env, 45_000),
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-operator",
                liveTurnTimeoutMs(env, 45_000),
              );
              if (env.mock) {
                const mockBaseUrl = env.mock.baseUrl;
                const requests = await fetchJson<
                  Array<{ allInputText?: string; plannedToolName?: string; toolOutput?: string }>
                >(`${mockBaseUrl}/debug/requests`);
                const imageRequest = requests.find((request) =>
                  String(request.allInputText ?? "").includes("Image generation check"),
                );
                if (imageRequest?.plannedToolName !== "image_generate") {
                  throw new Error(
                    `expected image_generate, got ${String(imageRequest?.plannedToolName ?? "")}`,
                  );
                }
                const generated = await waitForCondition(
                  async () => {
                    const requests = await fetchJson<Array<{ prompt?: string; model?: string }>>(
                      `${mockBaseUrl}/debug/image-generations`,
                    );
                    return requests.find(
                      (request) =>
                        request.model === "gpt-image-1" &&
                        String(request.prompt ?? "").includes("QA lighthouse"),
                    );
                  },
                  15_000,
                  250,
                ).catch((error) => {
                  throw new Error(
                    `image provider was never invoked: ${error instanceof Error ? error.message : String(error)}; toolOutput=${String(imageRequest.toolOutput ?? "")}`,
                  );
                });
                return `${outbound.text}\nIMAGE_PROMPT:${generated.prompt ?? ""}`;
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "image-understanding-attachment",
      async () =>
        await runScenario("Image understanding from attachment", [
          {
            name: "describes an attached image in one short sentence",
            run: async () => {
              await reset();
              await runAgentPrompt(env, {
                sessionKey: "agent:qa:image-understanding",
                message:
                  "Image understanding check: describe the attached image in one short sentence.",
                attachments: [
                  {
                    mimeType: "image/png",
                    fileName: "red-top-blue-bottom.png",
                    content: QA_IMAGE_UNDERSTANDING_PNG_BASE64,
                  },
                ],
                timeoutMs: liveTurnTimeoutMs(env, 45_000),
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.conversation.id === "qa-operator",
                liveTurnTimeoutMs(env, 45_000),
              );
              const lower = outbound.text.toLowerCase();
              if (!lower.includes("red") || !lower.includes("blue")) {
                throw new Error(`missing expected colors in image description: ${outbound.text}`);
              }
              if (env.mock) {
                const mockBaseUrl = env.mock.baseUrl;
                const requests = await fetchJson<
                  Array<{ prompt?: string; imageInputCount?: number; model?: string }>
                >(`${mockBaseUrl}/debug/requests`);
                const imageRequest = requests.find((request) =>
                  String(request.prompt ?? "").includes("Image understanding check"),
                );
                if ((imageRequest?.imageInputCount ?? 0) < 1) {
                  throw new Error(
                    `expected at least one input image, got ${String(imageRequest?.imageInputCount ?? 0)}`,
                  );
                }
              }
              return outbound.text;
            },
          },
        ]),
    ],
    [
      "config-patch-hot-apply",
      async () =>
        await runScenario("Config patch skill disable", [
          {
            name: "disables a workspace skill after config.patch restart",
            run: async () => {
              await writeWorkspaceSkill({
                env,
                name: "qa-hot-disable-skill",
                body: `---
name: qa-hot-disable-skill
description: Hot disable QA marker
---
When the user asks for the hot disable marker exactly, reply with exactly: HOT-PATCH-DISABLED-OK`,
              });
              await waitForCondition(
                async () => {
                  const skills = await readSkillStatus(env);
                  return findSkill(skills, "qa-hot-disable-skill")?.eligible ? true : undefined;
                },
                15_000,
                200,
              ).catch((error) => {
                throw new Error(
                  `hot-disable skill never became eligible: ${error instanceof Error ? error.message : String(error)}`,
                );
              });
              const beforeSkills = await readSkillStatus(env);
              const beforeSkill = findSkill(beforeSkills, "qa-hot-disable-skill");
              if (!beforeSkill?.eligible || beforeSkill.disabled) {
                throw new Error(`unexpected pre-patch skill state: ${JSON.stringify(beforeSkill)}`);
              }
              const patchResult = (await patchConfig({
                env,
                patch: {
                  skills: {
                    entries: {
                      "qa-hot-disable-skill": {
                        enabled: false,
                      },
                    },
                  },
                },
              })) as {
                restart?: {
                  coalesced?: boolean;
                  delayMs?: number;
                };
              };
              await waitForQaChannelReady(env, 60_000).catch((error) => {
                throw new Error(
                  `qa-channel never returned ready after config.patch: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                );
              });
              await waitForCondition(
                async () => {
                  const skills = await readSkillStatus(env);
                  return findSkill(skills, "qa-hot-disable-skill")?.disabled ? true : undefined;
                },
                15_000,
                200,
              ).catch((error) => {
                throw new Error(
                  `hot-disable skill never flipped to disabled: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                );
              });
              const afterSkills = await readSkillStatus(env);
              const afterSkill = findSkill(afterSkills, "qa-hot-disable-skill");
              if (!afterSkill?.disabled) {
                throw new Error(`unexpected post-patch skill state: ${JSON.stringify(afterSkill)}`);
              }
              return `restartDelayMs=${String(patchResult.restart?.delayMs ?? "")}\npre=${JSON.stringify(beforeSkill)}\npost=${JSON.stringify(afterSkill)}`;
            },
          },
        ]),
    ],
    [
      "config-apply-restart-wakeup",
      async () =>
        await runScenario("Config apply restart wake-up", [
          {
            name: "restarts cleanly and posts the restart sentinel back into qa-channel",
            run: async () => {
              await reset();
              const sessionKey = buildAgentSessionKey({
                agentId: "qa",
                channel: "qa-channel",
                peer: {
                  kind: "channel",
                  id: "qa-room",
                },
              });
              await createSession(env, "Restart wake-up", sessionKey);
              await runAgentPrompt(env, {
                sessionKey,
                to: "channel:qa-room",
                message: "Acknowledge restart wake-up setup in qa-room.",
                timeoutMs: liveTurnTimeoutMs(env, 30_000),
              });
              const current = await readConfigSnapshot(env);
              const nextConfig = structuredClone(current.config);
              const gatewayConfig = (nextConfig.gateway ??= {}) as Record<string, unknown>;
              const controlUi = (gatewayConfig.controlUi ??= {}) as Record<string, unknown>;
              const allowedOrigins = Array.isArray(controlUi.allowedOrigins)
                ? [...(controlUi.allowedOrigins as string[])]
                : [];
              const wakeMarker = `QA-RESTART-${randomUUID().slice(0, 8)}`;
              if (!allowedOrigins.includes("http://127.0.0.1:65535")) {
                allowedOrigins.push("http://127.0.0.1:65535");
              }
              controlUi.allowedOrigins = allowedOrigins;
              await applyConfig({
                env,
                nextConfig,
                sessionKey,
                note: wakeMarker,
              });
              await waitForGatewayHealthy(env, 60_000).catch((error) => {
                throw new Error(
                  `gateway never returned healthy after config.apply: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                );
              });
              await waitForQaChannelReady(env, 60_000).catch((error) => {
                throw new Error(
                  `qa-channel never returned ready after config.apply: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                );
              });
              const outbound = await waitForOutboundMessage(
                state,
                (candidate) => candidate.text.includes(wakeMarker),
                60_000,
              ).catch((error) => {
                throw new Error(
                  `restart sentinel never appeared: ${
                    error instanceof Error ? error.message : String(error)
                  }; outbound=${recentOutboundSummary(state)}`,
                );
              });
              return `${outbound.conversation.id}: ${outbound.text}`;
            },
          },
        ]),
    ],
    [
      "runtime-inventory-drift-check",
      async () =>
        await runScenario("Runtime inventory drift check", [
          {
            name: "keeps tools.effective and skills.status aligned after config changes",
            run: async () => {
              await writeWorkspaceSkill({
                env,
                name: "qa-drift-skill",
                body: `---
name: qa-drift-skill
description: Drift skill marker
---
When the user asks for the drift skill marker exactly, reply with exactly: DRIFT-SKILL-OK`,
              });
              const sessionKey = await createSession(env, "Inventory drift");
              const beforeTools = await readEffectiveTools(env, sessionKey);
              if (!beforeTools.has("image_generate")) {
                throw new Error("expected image_generate before drift patch");
              }
              const beforeSkills = await readSkillStatus(env);
              if (!findSkill(beforeSkills, "qa-drift-skill")?.eligible) {
                throw new Error("expected qa-drift-skill to be eligible before patch");
              }
              await patchConfig({
                env,
                patch: {
                  tools: {
                    deny: ["image_generate"],
                  },
                  skills: {
                    entries: {
                      "qa-drift-skill": {
                        enabled: false,
                      },
                    },
                  },
                },
              });
              await waitForGatewayHealthy(env);
              const afterTools = await readEffectiveTools(env, sessionKey);
              if (afterTools.has("image_generate")) {
                throw new Error("image_generate still present after deny patch");
              }
              const afterSkills = await readSkillStatus(env);
              const driftSkill = findSkill(afterSkills, "qa-drift-skill");
              if (!driftSkill?.disabled) {
                throw new Error(`expected disabled drift skill, got ${JSON.stringify(driftSkill)}`);
              }
              return `image_generate removed, qa-drift-skill disabled=${String(driftSkill.disabled)}`;
            },
          },
        ]),
    ],
  ]);
}

export async function runQaSuite(params?: {
  outputDir?: string;
  providerMode?: "mock-openai" | "live-openai";
  primaryModel?: string;
  alternateModel?: string;
  fastMode?: boolean;
  scenarioIds?: string[];
}) {
  const startedAt = new Date();
  const providerMode = params?.providerMode ?? "mock-openai";
  const fastMode = params?.fastMode ?? providerMode === "live-openai";
  const primaryModel =
    params?.primaryModel ??
    (providerMode === "live-openai" ? "openai/gpt-5.4" : "mock-openai/gpt-5.4");
  const alternateModel =
    params?.alternateModel ??
    (providerMode === "live-openai" ? "openai/gpt-5.4" : "mock-openai/gpt-5.4-alt");
  const outputDir =
    params?.outputDir ??
    path.join(process.cwd(), ".artifacts", "qa-e2e", `suite-${Date.now().toString(36)}`);
  await fs.mkdir(outputDir, { recursive: true });

  const lab = await startQaLabServer({
    host: "127.0.0.1",
    port: 0,
    embeddedGateway: "disabled",
  });
  const mock =
    providerMode === "mock-openai"
      ? await startQaMockOpenAiServer({
          host: "127.0.0.1",
          port: 0,
        })
      : null;
  const gateway = await startQaGatewayChild({
    repoRoot: process.cwd(),
    providerBaseUrl: mock ? `${mock.baseUrl}/v1` : undefined,
    qaBusBaseUrl: lab.listenUrl,
=======
function createScenarioFlowApi(
  env: QaSuiteEnvironment,
  scenario: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"][number],
) {
  return createQaSuiteScenarioFlowApi({
    env,
    scenario,
    runScenario,
    splitModelRef,
    formatErrorMessage,
    liveTurnTimeoutMs,
    resolveQaLiveTurnTimeoutMs,
    constants: {
      imageUnderstandingPngBase64: QA_IMAGE_UNDERSTANDING_PNG_BASE64,
      imageUnderstandingLargePngBase64: QA_IMAGE_UNDERSTANDING_LARGE_PNG_BASE64,
      imageUnderstandingValidPngBase64: QA_IMAGE_UNDERSTANDING_VALID_PNG_BASE64,
    },
  });
}

async function runScenarioDefinition(
  env: QaSuiteEnvironment,
  scenario: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"][number],
) {
  const api = createScenarioFlowApi(env, scenario);
  if (!scenario.execution.flow) {
    throw new Error(`scenario missing flow: ${scenario.id}`);
  }
  return await runScenarioFlow({
    api,
    flow: scenario.execution.flow,
    scenarioTitle: scenario.title,
  });
}

function isRuntimeParityPass(result: RuntimeParityResult) {
  return isRuntimeParityResultPass(result);
}

function formatRuntimeParityCellDetails(cell: RuntimeParityCell) {
  const errors = [cell.transportErrorClass, cell.runtimeErrorClass].filter(Boolean).join(", ");
  const sentinels = cell.sentinelFindings?.map((finding) => finding.kind).join(", ");
  return [
    `runtime=${cell.runtime}`,
    `wallMs=${cell.wallClockMs}`,
    `toolCalls=${cell.toolCalls.length}`,
    `finalChars=${cell.finalText.length}`,
    `tokens=${cell.usage.totalTokens}`,
    ...(errors ? [`errors=${errors}`] : []),
    ...(sentinels ? [`sentinels=${sentinels}`] : []),
  ].join(" ");
}

function buildRuntimeParityScenarioResult(params: {
  scenarioName: string;
  result: RuntimeParityResult;
}): QaSuiteScenarioResult {
  const driftStepStatus = isRuntimeParityPass(params.result) ? "pass" : "fail";
  const openclawCell = params.result.cells.openclaw;
  return {
    name: params.scenarioName,
    status: driftStepStatus,
    details: params.result.driftDetails ?? `runtime drift classified as ${params.result.drift}`,
    steps: [
      {
        name: openclawCell.runtime,
        status:
          openclawCell.runtimeErrorClass || openclawCell.transportErrorClass ? "fail" : "pass",
        details: formatRuntimeParityCellDetails(openclawCell),
      },
      {
        name: params.result.cells.codex.runtime,
        status:
          params.result.cells.codex.runtimeErrorClass ||
          params.result.cells.codex.transportErrorClass
            ? "fail"
            : "pass",
        details: formatRuntimeParityCellDetails(params.result.cells.codex),
      },
      {
        name: "runtime drift",
        status: driftStepStatus,
        details: params.result.driftDetails ?? params.result.drift,
      },
    ],
    runtimeParity: params.result,
  };
}

function createQaSuiteReportNotes(params: {
  transport: QaTransportAdapter;
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
  fastMode: boolean;
  concurrency: number;
  isolatedWorkers?: boolean;
}) {
  return params.transport.createReportNotes(params);
}

function buildQaIsolatedScenarioWorkerParams(params: {
  repoRoot: string;
  outputDir: string;
  providerMode: QaProviderMode;
  transportId: QaTransportId;
  primaryModel: string;
  alternateModel: string;
  fastMode: boolean;
  scenario: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"][number];
  input?: QaSuiteRunParams;
  startLab: QaSuiteStartLabFn;
}): QaSuiteRunParams {
  return {
    repoRoot: params.repoRoot,
    outputDir: params.outputDir,
    providerMode: params.providerMode,
    transportId: params.transportId,
    primaryModel: params.primaryModel,
    alternateModel: params.alternateModel,
    fastMode: params.fastMode,
    thinkingDefault: params.input?.thinkingDefault,
    claudeCliAuthMode: params.input?.claudeCliAuthMode,
    scenarioIds: [params.scenario.id],
    enabledPluginIds: params.input?.enabledPluginIds,
    concurrency: 1,
    startLab: params.startLab,
    controlUiEnabled: scenarioRequiresControlUi(params.scenario),
    transportReadyTimeoutMs: params.input?.transportReadyTimeoutMs,
    forcedRuntime: params.input?.forcedRuntime,
  };
}

function normalizeQaSuiteModelRef(input: string | undefined, fallback: string) {
  const model = input?.trim();
  return model && model.length > 0 ? model : fallback;
}

function remapModelRefForForcedRuntime(params: {
  modelRef: string;
  providerMode: QaProviderMode;
  forcedRuntime?: RuntimeId;
}) {
  if (params.forcedRuntime !== "codex" || params.providerMode !== "mock-openai") {
    return params.modelRef;
  }
  const split = splitModelRef(params.modelRef);
  if (!split || split.provider !== "mock-openai") {
    return params.modelRef;
  }
  return `openai/${split.model}`;
}

function buildQaRuntimeEnvPatch(params: {
  providerMode: QaProviderMode;
  forcedRuntime?: RuntimeId;
  mockBaseUrl?: string;
}): NodeJS.ProcessEnv | undefined {
  const patch: NodeJS.ProcessEnv = {};
  if (params.forcedRuntime) {
    patch.OPENCLAW_BUILD_PRIVATE_QA = "1";
    patch.OPENCLAW_QA_FORCE_RUNTIME = params.forcedRuntime;
  }
  if (params.forcedRuntime !== "codex" || params.providerMode !== "mock-openai") {
    return Object.keys(patch).length > 0 ? patch : undefined;
  }
  const mockBaseUrl = params.mockBaseUrl?.trim().replace(/\/+$/u, "");
  if (!mockBaseUrl) {
    return Object.keys(patch).length > 0 ? patch : undefined;
  }
  // The forced codex lane uses the Codex app-server's native OpenAI provider
  // path, so pin the managed app-server to the QA mock endpoint instead of
  // leaking to the maintainer's real OpenAI config.
  patch.OPENCLAW_CODEX_APP_SERVER_ARGS = `app-server -c openai_base_url=${mockBaseUrl}/v1 --listen stdio://`;
  patch.OPENAI_API_KEY = "qa-mock-openai-key";
  patch.CODEX_API_KEY = "qa-mock-openai-key";
  return patch;
}

function appendNodeOption(raw: string | undefined, option: string) {
  const parts = (raw ?? "").split(/\s+/u).filter(Boolean);
  return parts.includes(option) ? parts.join(" ") : [...parts, option].join(" ");
}

function shouldCaptureGatewayHeapCheckpoints(env: NodeJS.ProcessEnv = process.env) {
  return parseQaSuiteBooleanEnv(env.OPENCLAW_QA_GATEWAY_HEAP_CHECKPOINTS) === true;
}

function buildQaGatewayHeapCheckpointRuntimeEnvPatch(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv | undefined {
  if (!shouldCaptureGatewayHeapCheckpoints(env)) {
    return undefined;
  }
  return {
    NODE_OPTIONS: appendNodeOption(env.NODE_OPTIONS, "--heapsnapshot-signal=SIGUSR2"),
  };
}

function mergeQaRuntimeEnvPatches(
  ...patches: Array<NodeJS.ProcessEnv | undefined>
): NodeJS.ProcessEnv | undefined {
  const merged: NodeJS.ProcessEnv = {};
  for (const patch of patches) {
    if (!patch) {
      continue;
    }
    Object.assign(merged, patch);
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export type QaSuiteSummaryJsonParams = {
  scenarios: QaSuiteScenarioResult[];
  startedAt: Date;
  finishedAt: Date;
  metrics?: QaSuiteSummaryJson["metrics"];
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
  fastMode: boolean;
  concurrency: number;
  scenarioIds?: readonly string[];
  runtimePair?: [RuntimeId, RuntimeId];
};

/**
 * Strongly-typed shape of `qa-suite-summary.json`. The GPT-5.5 parity gate
 * (agentic-parity-report.ts, #64441) and any future parity wrapper can
 * import this type instead of re-declaring the shape, so changes to the
 * summary schema propagate through to every consumer at type-check time.
 */
export type { QaSuiteSummaryJson } from "./suite-summary.js";

type QaSuiteGatewayRssSample = NonNullable<
  NonNullable<QaSuiteSummaryJson["metrics"]>["gatewayProcessRssSamples"]
>[number];

type QaGatewayHandle = Awaited<ReturnType<typeof startQaGatewayChild>>;
type QaSuiteGatewayHeapSnapshot = NonNullable<
  NonNullable<QaSuiteSummaryJson["metrics"]>["gatewayHeapSnapshots"]
>[number];

/**
 * Pure-ish JSON builder for qa-suite-summary.json. Exported so the GPT-5.5
 * parity gate (agentic-parity-report.ts, #64441) and any future parity
 * runner can assert-and-trust the provider/model that produced a given
 * summary instead of blindly accepting the caller's candidateLabel /
 * baselineLabel. Without the `run` block, a maintainer who swaps candidate
 * and baseline summary paths could silently produce a mislabeled verdict.
 *
 * `scenarioIds` is only recorded when the caller passed a non-empty array
 * (an explicit scenario selection). A missing or empty array means "no
 * filter, full lane-selected catalog", which the summary encodes as `null`
 * so parity/report tooling doesn't mistake a full run for an explicit
 * empty selection.
 */
export function buildQaSuiteSummaryJson(params: QaSuiteSummaryJsonParams): QaSuiteSummaryJson {
  const primarySplit = splitModelRef(params.primaryModel);
  const alternateSplit = splitModelRef(params.alternateModel);
  return {
    scenarios: params.scenarios,
    counts: {
      total: params.scenarios.length,
      passed: params.scenarios.filter((scenario) => scenario.status === "pass").length,
      failed: countQaSuiteFailedScenarios(params.scenarios),
    },
    ...(params.metrics ? { metrics: params.metrics } : {}),
    run: {
      startedAt: params.startedAt.toISOString(),
      finishedAt: params.finishedAt.toISOString(),
      providerMode: params.providerMode,
      primaryModel: params.primaryModel,
      primaryProvider: primarySplit?.provider ?? null,
      primaryModelName: primarySplit?.model ?? null,
      alternateModel: params.alternateModel,
      alternateProvider: alternateSplit?.provider ?? null,
      alternateModelName: alternateSplit?.model ?? null,
      fastMode: params.fastMode,
      concurrency: params.concurrency,
      scenarioIds:
        params.scenarioIds && params.scenarioIds.length > 0 ? [...params.scenarioIds] : null,
      runtimePair: params.runtimePair ?? null,
    },
  };
}

async function runQaRuntimeParitySuite(params: {
  repoRoot: string;
  outputDir: string;
  startedAt: Date;
  providerMode: QaProviderMode;
  transportId: QaTransportId;
  primaryModel: string;
  alternateModel: string;
  fastMode: boolean;
  thinkingDefault?: QaThinkingLevel;
  claudeCliAuthMode?: QaCliBackendAuthMode;
  enabledPluginIds?: string[];
  concurrency: number;
  selectedCatalogScenarios: ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"];
  startLab?: QaSuiteStartLabFn;
  lab?: QaLabServerHandle;
  progressEnabled: boolean;
  scenarioIds?: readonly string[];
  runtimePair: [RuntimeId, RuntimeId];
}) {
  const ownsLab = !params.lab;
  const startLab = requireQaSuiteStartLab(params.startLab);
  const lab =
    params.lab ??
    (await startLab({
      repoRoot: params.repoRoot,
      host: "127.0.0.1",
      port: 0,
      embeddedGateway: "disabled",
    }));
  const transport = createQaTransportAdapter({
    id: params.transportId,
    state: lab.state,
  });
  const liveScenarioOutcomes: QaLabScenarioOutcome[] = params.selectedCatalogScenarios.map(
    (scenario) => ({
      id: scenario.id,
      name: scenario.title,
      status: "pending",
    }),
  );
  lab.setScenarioRun({
    kind: "suite",
    status: "running",
    startedAt: params.startedAt.toISOString(),
    scenarios: [...liveScenarioOutcomes],
  });

  try {
    const scenarios = await mapQaSuiteWithConcurrency(
      params.selectedCatalogScenarios,
      params.concurrency,
      async (scenario, index): Promise<QaSuiteScenarioResult> => {
        const scenarioIdForLog = sanitizeQaSuiteProgressValue(scenario.id);
        writeQaSuiteProgress(
          params.progressEnabled,
          `runtime pair start (${index + 1}/${params.selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
        );
        liveScenarioOutcomes[index] = {
          id: scenario.id,
          name: scenario.title,
          status: "running",
          startedAt: new Date().toISOString(),
        };
        lab.setScenarioRun({
          kind: "suite",
          status: "running",
          startedAt: params.startedAt.toISOString(),
          scenarios: [...liveScenarioOutcomes],
        });

        const parity = await runRuntimeParityScenario({
          scenarioId: scenario.id,
          runCell: async (runtime) => {
            const cellOutputDir = path.join(
              params.outputDir,
              "runtime-cells",
              scenario.id,
              runtime,
            );
            const cellStartedAt = Date.now();
            const cellResult = await runQaSuite({
              repoRoot: params.repoRoot,
              outputDir: cellOutputDir,
              providerMode: params.providerMode,
              transportId: params.transportId,
              primaryModel: remapModelRefForForcedRuntime({
                modelRef: params.primaryModel,
                providerMode: params.providerMode,
                forcedRuntime: runtime,
              }),
              alternateModel: remapModelRefForForcedRuntime({
                modelRef: params.alternateModel,
                providerMode: params.providerMode,
                forcedRuntime: runtime,
              }),
              fastMode: params.fastMode,
              thinkingDefault: params.thinkingDefault,
              claudeCliAuthMode: params.claudeCliAuthMode,
              scenarioIds: [scenario.id],
              concurrency: 1,
              enabledPluginIds: params.enabledPluginIds,
              startLab,
              controlUiEnabled: scenarioRequiresControlUi(scenario),
              forcedRuntime: runtime,
              captureRuntimeParityCell: true,
            });
            const scenarioResult =
              cellResult.scenarios[0] ??
              ({
                name: scenario.title,
                status: "fail",
                details: "runtime parity cell returned no scenario result",
                steps: [
                  {
                    name: "runtime parity cell",
                    status: "fail",
                    details: "runtime parity cell returned no scenario result",
                  },
                ],
              } satisfies QaSuiteScenarioResult);
            const fallbackCell = {
              runtime,
              transcriptBytes: "",
              toolCalls: [],
              finalText: "",
              usage: {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
              },
              wallClockMs: Math.max(1, Date.now() - cellStartedAt),
              runtimeErrorClass: "capture-missing",
              bootStateLines: [],
            } satisfies RuntimeParityCell;
            return {
              scenarioStatus: scenarioResult.status,
              scenarioDetails: scenarioResult.details,
              cell: cellResult.runtimeParityCell ?? fallbackCell,
            };
          },
        });

        const result = buildRuntimeParityScenarioResult({
          scenarioName: scenario.title,
          result: parity,
        });
        liveScenarioOutcomes[index] = {
          id: scenario.id,
          name: scenario.title,
          status: result.status,
          details: result.details,
          steps: result.steps,
          startedAt: liveScenarioOutcomes[index]?.startedAt,
          finishedAt: new Date().toISOString(),
        };
        lab.setScenarioRun({
          kind: "suite",
          status: "running",
          startedAt: params.startedAt.toISOString(),
          scenarios: [...liveScenarioOutcomes],
        });
        writeQaSuiteProgress(
          params.progressEnabled,
          `runtime pair ${result.status} (${index + 1}/${params.selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
        );
        return result;
      },
      {
        startStaggerMs: resolveQaSuiteWorkerStartStaggerMs(params.concurrency),
      },
    );

    const finishedAt = new Date();
    const { report, reportPath, summaryPath } = await writeQaSuiteArtifacts({
      outputDir: params.outputDir,
      startedAt: params.startedAt,
      finishedAt,
      scenarios,
      transport,
      providerMode: params.providerMode,
      primaryModel: params.primaryModel,
      alternateModel: params.alternateModel,
      fastMode: params.fastMode,
      concurrency: params.concurrency,
      scenarioIds:
        params.scenarioIds && params.scenarioIds.length > 0
          ? params.selectedCatalogScenarios.map((scenario) => scenario.id)
          : undefined,
      runtimePair: params.runtimePair,
    });
    lab.setLatestReport({
      outputPath: reportPath,
      markdown: report,
      generatedAt: finishedAt.toISOString(),
    } satisfies QaLabLatestReport);
    lab.setScenarioRun({
      kind: "suite",
      status: "completed",
      startedAt: params.startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      scenarios: [...liveScenarioOutcomes],
    });
    return {
      outputDir: params.outputDir,
      reportPath,
      summaryPath,
      report,
      scenarios,
      watchUrl: lab.baseUrl,
    } satisfies QaSuiteResult;
  } finally {
    if (ownsLab) {
      await lab.stop();
    }
  }
}

async function writeQaSuiteArtifacts(params: {
  outputDir: string;
  startedAt: Date;
  finishedAt: Date;
  scenarios: QaSuiteScenarioResult[];
  metrics?: QaSuiteSummaryJson["metrics"];
  transport: QaTransportAdapter;
  // Reuse the canonical QaProviderMode union instead of re-declaring it
  // inline. Loop 6 already unified `QaSuiteSummaryJsonParams.providerMode`
  // on this type; keeping the writer in sync prevents drift when model-
  // selection.ts adds a new provider mode.
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
  fastMode: boolean;
  concurrency: number;
  isolatedWorkers?: boolean;
  scenarioIds?: readonly string[];
  runtimePair?: [RuntimeId, RuntimeId];
}) {
  const report = renderQaMarkdownReport({
    title: "OpenClaw QA Scenario Suite",
    startedAt: params.startedAt,
    finishedAt: params.finishedAt,
    checks: [],
    scenarios: params.scenarios.map((scenario) => ({
      name: scenario.name,
      status: scenario.status,
      details: scenario.details,
      steps: scenario.steps,
    })) satisfies QaReportScenario[],
    notes: createQaSuiteReportNotes(params),
  });
  const reportPath = path.join(params.outputDir, "qa-suite-report.md");
  const summaryPath = path.join(params.outputDir, "qa-suite-summary.json");
  await fs.writeFile(reportPath, report, "utf8");
  await fs.writeFile(
    summaryPath,
    `${JSON.stringify(buildQaSuiteSummaryJson(params), null, 2)}\n`,
    "utf8",
  );
  return { report, reportPath, summaryPath };
}

function buildQaSuiteRuntimeMetrics(params: {
  startedAt: Date;
  finishedAt: Date;
  gatewayProcessCpuStartMs: number | null;
  gatewayProcessCpuEndMs: number | null;
  gatewayProcessRssStartBytes: number | null;
  gatewayProcessRssEndBytes: number | null;
  gatewayProcessRssSamples?: QaSuiteGatewayRssSample[];
  gatewayHeapSnapshots?: QaSuiteGatewayHeapSnapshot[];
}): QaSuiteSummaryJson["metrics"] {
  const wallMs = Math.max(1, params.finishedAt.getTime() - params.startedAt.getTime());
  const gatewayProcessRssSamples = params.gatewayProcessRssSamples ?? [];
  const gatewayHeapSnapshots = params.gatewayHeapSnapshots ?? [];
  const gatewayProcessRssPeakBytes =
    gatewayProcessRssSamples.length > 0
      ? Math.max(...gatewayProcessRssSamples.map((sample) => sample.gatewayProcessRssBytes))
      : params.gatewayProcessRssStartBytes === null || params.gatewayProcessRssEndBytes === null
        ? null
        : Math.max(params.gatewayProcessRssStartBytes, params.gatewayProcessRssEndBytes);
  const gatewayHeapSnapshotMetrics =
    gatewayHeapSnapshots.length === 0 ? {} : { gatewayHeapSnapshots };
  const rssMetrics =
    params.gatewayProcessRssStartBytes === null || params.gatewayProcessRssEndBytes === null
      ? gatewayHeapSnapshotMetrics
      : {
          gatewayProcessRssStartBytes: params.gatewayProcessRssStartBytes,
          gatewayProcessRssEndBytes: params.gatewayProcessRssEndBytes,
          gatewayProcessRssDeltaBytes:
            params.gatewayProcessRssEndBytes - params.gatewayProcessRssStartBytes,
          ...(gatewayProcessRssPeakBytes === null
            ? {}
            : {
                gatewayProcessRssPeakBytes,
                gatewayProcessRssPeakDeltaBytes:
                  gatewayProcessRssPeakBytes - params.gatewayProcessRssStartBytes,
              }),
          ...(gatewayProcessRssSamples.length === 0 ? {} : { gatewayProcessRssSamples }),
          ...gatewayHeapSnapshotMetrics,
        };
  if (params.gatewayProcessCpuStartMs === null || params.gatewayProcessCpuEndMs === null) {
    return { wallMs, ...rssMetrics };
  }
  const gatewayProcessCpuMs = Math.max(
    0,
    params.gatewayProcessCpuEndMs - params.gatewayProcessCpuStartMs,
  );
  return {
    wallMs,
    gatewayProcessCpuMs,
    gatewayCpuCoreRatio: Math.round((gatewayProcessCpuMs / wallMs) * 1000) / 1000,
    ...rssMetrics,
  };
}

function sanitizeQaHeapCheckpointLabel(label: string) {
  return label.replace(/[^a-zA-Z0-9._-]+/gu, "-").replace(/^-+|-+$/gu, "") || "checkpoint";
}

async function listGatewayHeapSnapshotFiles(tempRoot: string) {
  const entries = await fs.readdir(tempRoot, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".heapsnapshot")) {
      continue;
    }
    const pathName = path.join(tempRoot, entry.name);
    const stats = await fs.stat(pathName).catch(() => null);
    if (stats) {
      files.push({ pathName, mtimeMs: stats.mtimeMs, size: stats.size });
    }
  }
  return files.toSorted((left, right) => left.mtimeMs - right.mtimeMs);
}

async function waitForStableFileSize(pathName: string) {
  let lastSize = -1;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const stats = await fs.stat(pathName).catch(() => null);
    if (stats && stats.size > 0 && stats.size === lastSize) {
      return stats.size;
    }
    lastSize = stats?.size ?? -1;
    await sleep(250);
  }
  const stats = await fs.stat(pathName);
  return stats.size;
}

async function captureGatewayHeapSnapshotCheckpoint(params: {
  gateway: QaGatewayHandle;
  outputDir: string;
  label: string;
}): Promise<QaSuiteGatewayHeapSnapshot | undefined> {
  const before = new Set(
    (await listGatewayHeapSnapshotFiles(params.gateway.tempRoot)).map((file) => file.pathName),
  );
  params.gateway.signalProcess("SIGUSR2");
  let snapshotPath: string | undefined;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const next = (await listGatewayHeapSnapshotFiles(params.gateway.tempRoot)).filter(
      (file) => !before.has(file.pathName),
    );
    snapshotPath = next.at(-1)?.pathName;
    if (snapshotPath) {
      break;
    }
    await sleep(250);
  }
  if (!snapshotPath) {
    return undefined;
  }

  const bytes = await waitForStableFileSize(snapshotPath);
  const snapshotsDir = path.join(params.outputDir, "artifacts", "gateway-heap-snapshots");
  await fs.mkdir(snapshotsDir, { recursive: true });
  const relativePath = path.join(
    "artifacts",
    "gateway-heap-snapshots",
    `${sanitizeQaHeapCheckpointLabel(params.label)}.heapsnapshot`,
  );
  await fs.copyFile(snapshotPath, path.join(params.outputDir, relativePath));
  return {
    label: params.label,
    at: new Date().toISOString(),
    path: relativePath,
    bytes,
  };
}

export async function runQaSuite(params?: QaSuiteRunParams): Promise<QaSuiteResult> {
  const startedAt = new Date();
  const repoRoot = path.resolve(params?.repoRoot ?? process.cwd());
  const providerMode = normalizeQaProviderMode(
    params?.providerMode ?? DEFAULT_QA_LIVE_PROVIDER_MODE,
  );
  const transportId = normalizeQaTransportId(params?.transportId);
  const primaryModel = normalizeQaSuiteModelRef(
    params?.primaryModel,
    defaultQaModelForMode(providerMode),
  );
  const alternateModel = normalizeQaSuiteModelRef(
    params?.alternateModel,
    defaultQaModelForMode(providerMode, true),
  );
  const fastMode =
    typeof params?.fastMode === "boolean"
      ? params.fastMode
      : isQaFastModeEnabled({ primaryModel, alternateModel });
  const outputDir = await resolveQaSuiteOutputDir(repoRoot, params?.outputDir);
  const catalog = readQaBootstrapScenarioCatalog();
  const selectedCatalogScenarios = selectQaSuiteScenarios({
    scenarios: catalog.scenarios,
    scenarioIds: params?.scenarioIds,
    providerMode,
    primaryModel,
    claudeCliAuthMode: params?.claudeCliAuthMode,
  });
  const enabledPluginIds = [
    ...new Set([
      ...collectQaSuitePluginIds(selectedCatalogScenarios),
      ...(params?.enabledPluginIds ?? []).map((pluginId) => pluginId.trim()).filter(Boolean),
      ...(params?.forcedRuntime && params.forcedRuntime !== "openclaw"
        ? [params.forcedRuntime]
        : []),
    ]),
  ];
  const gatewayConfigPatch = collectQaSuiteGatewayConfigPatch(selectedCatalogScenarios);
  const gatewayRuntimeOptions = collectQaSuiteGatewayRuntimeOptions(selectedCatalogScenarios);
  const concurrency = normalizeQaSuiteConcurrency(
    params?.concurrency,
    selectedCatalogScenarios.length,
    defaultQaSuiteConcurrencyForTransport(transportId),
  );
  const progressEnabled = shouldLogQaSuiteProgress();
  const gatewayHeapCheckpointsEnabled = shouldCaptureGatewayHeapCheckpoints();
  writeQaSuiteProgress(
    progressEnabled,
    `run start: scenarios=${selectedCatalogScenarios.length} concurrency=${concurrency} transport=${transportId}`,
  );
  const useIsolatedScenarioWorkers = shouldRunQaSuiteWithIsolatedScenarioWorkers({
    scenarios: selectedCatalogScenarios,
    concurrency,
    lab: params?.lab,
    startLab: params?.startLab,
  });

  if (params?.runtimePair) {
    return await runQaRuntimeParitySuite({
      repoRoot,
      outputDir,
      startedAt,
      providerMode,
      transportId,
      primaryModel,
      alternateModel,
      fastMode,
      thinkingDefault: params.thinkingDefault,
      claudeCliAuthMode: params.claudeCliAuthMode,
      enabledPluginIds: params.enabledPluginIds,
      concurrency,
      selectedCatalogScenarios,
      startLab: params.startLab,
      lab: params.lab,
      progressEnabled,
      scenarioIds: params.scenarioIds,
      runtimePair: params.runtimePair,
    });
  }

  if (useIsolatedScenarioWorkers) {
    const ownsLab = !params?.lab;
    const startLab = requireQaSuiteStartLab(params?.startLab);
    const lab =
      params?.lab ??
      (await startLab({
        repoRoot,
        host: "127.0.0.1",
        port: 0,
        embeddedGateway: "disabled",
      }));
    const transport = createQaTransportAdapter({
      id: transportId,
      state: lab.state,
    });
    const liveScenarioOutcomes: QaLabScenarioOutcome[] = selectedCatalogScenarios.map(
      (scenario) => ({
        id: scenario.id,
        name: scenario.title,
        status: "pending",
      }),
    );
    const updateScenarioRun = () =>
      lab.setScenarioRun({
        kind: "suite",
        status: "running",
        startedAt: startedAt.toISOString(),
        scenarios: [...liveScenarioOutcomes],
      });
    const completedScenarioResults: Array<QaSuiteScenarioResult | undefined> = Array.from({
      length: selectedCatalogScenarios.length,
    });
    let artifactWriteQueue = Promise.resolve();
    const writePartialArtifacts = () => {
      const partialScenarios = completedScenarioResults.filter(
        (scenario): scenario is QaSuiteScenarioResult => scenario !== undefined,
      );
      if (partialScenarios.length === 0) {
        return;
      }
      artifactWriteQueue = artifactWriteQueue
        .then(async () => {
          const partialFinishedAt = new Date();
          const { report, reportPath } = await writeQaSuiteArtifacts({
            outputDir,
            startedAt,
            finishedAt: partialFinishedAt,
            scenarios: partialScenarios,
            transport,
            providerMode,
            primaryModel,
            alternateModel,
            fastMode,
            concurrency,
            isolatedWorkers: true,
            scenarioIds:
              params?.scenarioIds && params.scenarioIds.length > 0
                ? selectedCatalogScenarios.map((scenario) => scenario.id)
                : undefined,
          });
          lab.setLatestReport({
            outputPath: reportPath,
            markdown: report,
            generatedAt: partialFinishedAt.toISOString(),
          } satisfies QaLabLatestReport);
        })
        .catch((error: unknown) => {
          writeQaSuiteProgress(
            progressEnabled,
            `partial artifact write failed: ${sanitizeQaSuiteProgressValue(formatErrorMessage(error))}`,
          );
        });
    };

    try {
      updateScenarioRun();
      const workerStartStaggerMs = resolveQaSuiteWorkerStartStaggerMs(concurrency);
      writeQaSuiteProgress(progressEnabled, `scenario start stagger=${workerStartStaggerMs}ms`);
      const scenarios: QaSuiteScenarioResult[] = await mapQaSuiteWithConcurrency(
        selectedCatalogScenarios,
        concurrency,
        async (scenario, index): Promise<QaSuiteScenarioResult> => {
          const scenarioIdForLog = sanitizeQaSuiteProgressValue(scenario.id);
          writeQaSuiteProgress(
            progressEnabled,
            `scenario start (${index + 1}/${selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
          );
          liveScenarioOutcomes[index] = {
            id: scenario.id,
            name: scenario.title,
            status: "running",
            startedAt: new Date().toISOString(),
          };
          updateScenarioRun();
          try {
            const scenarioOutputDir = path.join(outputDir, "scenarios", scenario.id);
            const result: QaSuiteResult = await runQaSuite(
              buildQaIsolatedScenarioWorkerParams({
                repoRoot,
                outputDir: scenarioOutputDir,
                providerMode,
                transportId,
                primaryModel,
                alternateModel,
                fastMode,
                startLab,
                scenario,
                input: params,
              }),
            );
            const scenarioResult: QaSuiteScenarioResult =
              result.scenarios[0] ??
              ({
                name: scenario.title,
                status: "fail",
                details: "isolated scenario run returned no scenario result",
                steps: [
                  {
                    name: "isolated scenario worker",
                    status: "fail",
                    details: "isolated scenario run returned no scenario result",
                  },
                ],
              } satisfies QaSuiteScenarioResult);
            liveScenarioOutcomes[index] = {
              id: scenario.id,
              name: scenario.title,
              status: scenarioResult.status,
              details: scenarioResult.details,
              steps: scenarioResult.steps,
              startedAt: liveScenarioOutcomes[index]?.startedAt,
              finishedAt: new Date().toISOString(),
            };
            updateScenarioRun();
            writeQaSuiteProgress(
              progressEnabled,
              `scenario ${scenarioResult.status} (${index + 1}/${selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
            );
            completedScenarioResults[index] = scenarioResult;
            writePartialArtifacts();
            return scenarioResult;
          } catch (error) {
            const details = formatErrorMessage(error);
            const scenarioResult = {
              name: scenario.title,
              status: "fail",
              details,
              steps: [
                {
                  name: "isolated scenario worker",
                  status: "fail",
                  details,
                },
              ],
            } satisfies QaSuiteScenarioResult;
            liveScenarioOutcomes[index] = {
              id: scenario.id,
              name: scenario.title,
              status: "fail",
              details,
              steps: scenarioResult.steps,
              startedAt: liveScenarioOutcomes[index]?.startedAt,
              finishedAt: new Date().toISOString(),
            };
            updateScenarioRun();
            writeQaSuiteProgress(
              progressEnabled,
              `scenario fail (${index + 1}/${selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
            );
            completedScenarioResults[index] = scenarioResult;
            writePartialArtifacts();
            return scenarioResult;
          }
        },
        { startStaggerMs: workerStartStaggerMs },
      );
      await artifactWriteQueue;
      const finishedAt = new Date();
      const failedCount = scenarios.filter((scenario) => scenario.status === "fail").length;
      lab.setScenarioRun({
        kind: "suite",
        status: "completed",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        scenarios: [...liveScenarioOutcomes],
      });
      const { report, reportPath, summaryPath } = await writeQaSuiteArtifacts({
        outputDir,
        startedAt,
        finishedAt,
        scenarios,
        transport,
        providerMode,
        primaryModel,
        alternateModel,
        fastMode,
        concurrency,
        isolatedWorkers: true,
        // When the caller supplied an explicit non-empty --scenario filter,
        // record the executed (post-selectQaSuiteScenarios-normalized) ids
        // so the summary matches what actually ran. When the caller passed
        // nothing or an empty array ("no filter, full lane catalog"),
        // preserve the unfiltered = null semantic so the summary stays
        // distinguishable from an explicit all-scenarios selection.
        scenarioIds:
          params?.scenarioIds && params.scenarioIds.length > 0
            ? selectedCatalogScenarios.map((scenario) => scenario.id)
            : undefined,
      });
      lab.setLatestReport({
        outputPath: reportPath,
        markdown: report,
        generatedAt: finishedAt.toISOString(),
      } satisfies QaLabLatestReport);
      writeQaSuiteProgress(
        progressEnabled,
        `run complete: passed=${scenarios.length - failedCount} failed=${failedCount} total=${scenarios.length}`,
      );
      return {
        outputDir,
        reportPath,
        summaryPath,
        report,
        scenarios,
        watchUrl: lab.baseUrl,
      } satisfies QaSuiteResult;
    } finally {
      await disposeRegisteredAgentHarnesses();
      if (ownsLab) {
        await lab.stop();
      }
    }
  }

  const ownsLab = !params?.lab;
  const startLab = params?.startLab;
  writeQaSuiteProgress(progressEnabled, "lab start");
  const lab =
    params?.lab ??
    (await requireQaSuiteStartLab(startLab)({
      repoRoot,
      host: "127.0.0.1",
      port: 0,
      embeddedGateway: "disabled",
    }));
  writeQaSuiteProgress(progressEnabled, `lab ready: ${sanitizeQaSuiteProgressValue(lab.baseUrl)}`);
  await waitForQaLabReadyOrStopOwned({ lab, ownsLab });
  const transport = createQaTransportAdapter({
    id: transportId,
    state: lab.state,
  });
  writeQaSuiteProgress(progressEnabled, `provider start: ${providerMode}`);
  const mock = await startQaProviderServer(providerMode);
  writeQaSuiteProgress(
    progressEnabled,
    `provider ready: ${sanitizeQaSuiteProgressValue(mock?.baseUrl ?? "live")}`,
  );
  writeQaSuiteProgress(progressEnabled, "gateway start");
  const gateway = await startQaGatewayChild({
    repoRoot,
    providerBaseUrl: mock ? `${mock.baseUrl}/v1` : undefined,
    transport,
    transportBaseUrl: lab.listenUrl,
    controlUiAllowedOrigins: [lab.listenUrl],
>>>>>>> upstream/main
    providerMode,
    primaryModel,
    alternateModel,
    fastMode,
<<<<<<< HEAD
    controlUiEnabled: true,
  });
  lab.setControlUi({
    controlUiProxyTarget: gateway.baseUrl,
    controlUiToken: gateway.token,
=======
    thinkingDefault: params?.thinkingDefault,
    claudeCliAuthMode: params?.claudeCliAuthMode,
    controlUiEnabled: params?.controlUiEnabled ?? true,
    enabledPluginIds,
    forwardHostHome: gatewayRuntimeOptions?.forwardHostHome,
    mutateConfig: gatewayConfigPatch
      ? (cfg) => applyQaMergePatch(cfg, gatewayConfigPatch) as OpenClawConfig
      : undefined,
    runtimeEnvPatch: mergeQaRuntimeEnvPatches(
      buildQaRuntimeEnvPatch({
        providerMode,
        forcedRuntime: params?.forcedRuntime,
        mockBaseUrl: mock?.baseUrl,
      }),
      buildQaGatewayHeapCheckpointRuntimeEnvPatch(),
    ),
  });
  writeQaSuiteProgress(
    progressEnabled,
    `gateway ready: ${sanitizeQaSuiteProgressValue(gateway.baseUrl)}`,
  );
  lab.setControlUi({
    controlUiProxyTarget: gateway.baseUrl,
    controlUiProxyToken: gateway.token,
>>>>>>> upstream/main
  });
  const env: QaSuiteEnvironment = {
    lab,
    mock,
    gateway,
<<<<<<< HEAD
    cfg: createQaActionConfig(lab.listenUrl),
    providerMode,
    primaryModel,
    alternateModel,
  };

  try {
    const catalog = readQaBootstrapScenarioCatalog();
    const requestedScenarioIds = params?.scenarioIds ? new Set(params.scenarioIds) : null;
    const selectedCatalogScenarios = requestedScenarioIds
      ? catalog.scenarios.filter((scenario) => requestedScenarioIds.has(scenario.id))
      : catalog.scenarios;
    if (requestedScenarioIds) {
      const foundScenarioIds = new Set(selectedCatalogScenarios.map((scenario) => scenario.id));
      const missingScenarioIds = [...requestedScenarioIds].filter(
        (scenarioId) => !foundScenarioIds.has(scenarioId),
      );
      if (missingScenarioIds.length > 0) {
        throw new Error(`unknown QA scenario id(s): ${missingScenarioIds.join(", ")}`);
      }
    }
    const scenarioMap = buildScenarioMap(env);
=======
    // Markdown scenarios should see the full staged gateway config, not just
    // the transport fragment. Routing/session/plugin assertions depend on it.
    cfg: gateway.cfg,
    transport,
    repoRoot,
    providerMode,
    primaryModel,
    alternateModel,
    webSessionIds: new Set(),
  };

  let preserveGatewayRuntimeDir: string | undefined;
  try {
    const transportReadyTimeoutMs = resolveQaSuiteTransportReadyTimeoutMs(
      params?.transportReadyTimeoutMs,
    );
    // The gateway child already waits for /readyz before returning, but the
    // selected transport can still be finishing account startup. Pay that
    // readiness cost once here so the first scenario does not race bootstrap.
    await waitForTransportReady(env, transportReadyTimeoutMs).catch(async () => {
      await waitForGatewayHealthy(env, transportReadyTimeoutMs);
      await waitForTransportReady(env, transportReadyTimeoutMs);
    });
    await sleep(1_000);
>>>>>>> upstream/main
    const scenarios: QaSuiteScenarioResult[] = [];
    const liveScenarioOutcomes: QaLabScenarioOutcome[] = selectedCatalogScenarios.map(
      (scenario) => ({
        id: scenario.id,
        name: scenario.title,
        status: "pending",
      }),
    );

    lab.setScenarioRun({
      kind: "suite",
      status: "running",
      startedAt: startedAt.toISOString(),
      scenarios: liveScenarioOutcomes,
    });

<<<<<<< HEAD
    for (const [index, scenario] of selectedCatalogScenarios.entries()) {
      const run = scenarioMap.get(scenario.id);
      if (!run) {
        const missingResult = {
          name: scenario.title,
          status: "fail",
          details: `no executable scenario registered for ${scenario.id}`,
          steps: [],
        } satisfies QaSuiteScenarioResult;
        scenarios.push(missingResult);
        liveScenarioOutcomes[index] = {
          id: scenario.id,
          name: scenario.title,
          status: "fail",
          details: missingResult.details,
          steps: [],
          finishedAt: new Date().toISOString(),
        };
        lab.setScenarioRun({
          kind: "suite",
          status: "running",
          startedAt: startedAt.toISOString(),
          scenarios: [...liveScenarioOutcomes],
        });
        continue;
      }
=======
    const gatewayProcessRssSamples: QaSuiteGatewayRssSample[] = [];
    const sampleGatewayProcessRss = (label: string) => {
      const gatewayProcessRssBytes = gateway.getProcessRssBytes?.() ?? null;
      if (gatewayProcessRssBytes !== null) {
        gatewayProcessRssSamples.push({
          label,
          at: new Date().toISOString(),
          gatewayProcessRssBytes,
        });
      }
      return gatewayProcessRssBytes;
    };
    const gatewayProcessCpuStartMs = gateway.getProcessCpuMs?.() ?? null;
    const gatewayProcessRssStartBytes = sampleGatewayProcessRss("suite-start");
    const gatewayHeapSnapshots: QaSuiteGatewayHeapSnapshot[] = [];
    const captureGatewayHeapCheckpoint = async (label: string) => {
      if (!gatewayHeapCheckpointsEnabled) {
        return;
      }
      const snapshot = await captureGatewayHeapSnapshotCheckpoint({
        gateway,
        outputDir,
        label,
      });
      if (snapshot) {
        gatewayHeapSnapshots.push(snapshot);
      }
    };
    await captureGatewayHeapCheckpoint("suite-start");
    for (const [index, scenario] of selectedCatalogScenarios.entries()) {
      const scenarioIdForLog = sanitizeQaSuiteProgressValue(scenario.id);
      writeQaSuiteProgress(
        progressEnabled,
        `scenario start (${index + 1}/${selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
      );
      sampleGatewayProcessRss(`scenario:${scenario.id}:start`);
>>>>>>> upstream/main
      liveScenarioOutcomes[index] = {
        id: scenario.id,
        name: scenario.title,
        status: "running",
        startedAt: new Date().toISOString(),
      };
      lab.setScenarioRun({
        kind: "suite",
        status: "running",
        startedAt: startedAt.toISOString(),
        scenarios: [...liveScenarioOutcomes],
      });

<<<<<<< HEAD
      const result = await run();
      scenarios.push(result);
=======
      const result = await runScenarioDefinition(env, scenario);
      sampleGatewayProcessRss(`scenario:${scenario.id}:finish`);
      scenarios.push(result);
      writeQaSuiteProgress(
        progressEnabled,
        `scenario ${result.status} (${index + 1}/${selectedCatalogScenarios.length}): ${scenarioIdForLog}`,
      );
>>>>>>> upstream/main
      liveScenarioOutcomes[index] = {
        id: scenario.id,
        name: scenario.title,
        status: result.status,
        details: result.details,
        steps: result.steps,
        startedAt: liveScenarioOutcomes[index]?.startedAt,
        finishedAt: new Date().toISOString(),
      };
      lab.setScenarioRun({
        kind: "suite",
        status: "running",
        startedAt: startedAt.toISOString(),
        scenarios: [...liveScenarioOutcomes],
      });
    }

<<<<<<< HEAD
    const finishedAt = new Date();
=======
    const runtimeParityCell =
      params?.captureRuntimeParityCell &&
      params.forcedRuntime &&
      selectedCatalogScenarios.length === 1 &&
      scenarios.length > 0
        ? await captureRuntimeParityCell({
            runtime: params.forcedRuntime,
            gateway,
            scenarioResult: scenarios[0],
            wallClockMs: Math.max(1, Date.now() - startedAt.getTime()),
            mockBaseUrl: mock?.baseUrl,
          })
        : undefined;
    const finishedAt = new Date();
    await captureGatewayHeapCheckpoint("suite-finish");
    const metrics = buildQaSuiteRuntimeMetrics({
      startedAt,
      finishedAt,
      gatewayProcessCpuStartMs,
      gatewayProcessCpuEndMs: gateway.getProcessCpuMs?.() ?? null,
      gatewayProcessRssStartBytes,
      gatewayProcessRssEndBytes: sampleGatewayProcessRss("suite-finish"),
      gatewayProcessRssSamples,
      gatewayHeapSnapshots,
    });
    const failedCount = scenarios.filter((scenario) => scenario.status === "fail").length;
    if (scenarios.some((scenario) => scenario.status === "fail")) {
      preserveGatewayRuntimeDir = path.join(outputDir, "artifacts", "gateway-runtime");
    }
>>>>>>> upstream/main
    lab.setScenarioRun({
      kind: "suite",
      status: "completed",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      scenarios: [...liveScenarioOutcomes],
    });
<<<<<<< HEAD
    const report = renderQaMarkdownReport({
      title: "OpenClaw QA Scenario Suite",
      startedAt,
      finishedAt,
      checks: [],
      scenarios: scenarios.map((scenario) => ({
        name: scenario.name,
        status: scenario.status,
        details: scenario.details,
        steps: scenario.steps,
      })) satisfies QaReportScenario[],
      notes: [
        providerMode === "mock-openai"
          ? "Runs against qa-channel + qa-lab bus + real gateway child + mock OpenAI provider."
          : `Runs against qa-channel + qa-lab bus + real gateway child + live OpenAI models (${primaryModel}, ${alternateModel})${fastMode ? " with fast mode enabled" : ""}.`,
        "Cron uses a one-minute schedule assertion plus forced execution for fast verification.",
      ],
    });
    const reportPath = path.join(outputDir, "qa-suite-report.md");
    const summaryPath = path.join(outputDir, "qa-suite-summary.json");
    await fs.writeFile(reportPath, report, "utf8");
    await fs.writeFile(
      summaryPath,
      `${JSON.stringify(
        {
          scenarios,
          counts: {
            total: scenarios.length,
            passed: scenarios.filter((scenario) => scenario.status === "pass").length,
            failed: scenarios.filter((scenario) => scenario.status === "fail").length,
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
=======
    const { report, reportPath, summaryPath } = await writeQaSuiteArtifacts({
      outputDir,
      startedAt,
      finishedAt,
      scenarios,
      metrics,
      transport,
      providerMode,
      primaryModel,
      alternateModel,
      fastMode,
      concurrency,
      isolatedWorkers: false,
      // Same "filtered → executed list, unfiltered → null" convention as
      // the concurrent-path writeQaSuiteArtifacts call above.
      scenarioIds:
        params?.scenarioIds && params.scenarioIds.length > 0
          ? selectedCatalogScenarios.map((scenario) => scenario.id)
          : undefined,
    });
    const latestReport = {
      outputPath: reportPath,
      markdown: report,
      generatedAt: finishedAt.toISOString(),
    } satisfies QaLabLatestReport;
    lab.setLatestReport(latestReport);
    writeQaSuiteProgress(
      progressEnabled,
      `run complete: passed=${scenarios.length - failedCount} failed=${failedCount} total=${scenarios.length}`,
>>>>>>> upstream/main
    );

    return {
      outputDir,
      reportPath,
      summaryPath,
      report,
      scenarios,
      watchUrl: lab.baseUrl,
<<<<<<< HEAD
    } satisfies QaSuiteResult;
  } finally {
    const keepTemp = process.env.OPENCLAW_QA_KEEP_TEMP === "1" || false;
    await gateway.stop({
      keepTemp,
    });
    await mock?.stop();
    await lab.stop();
  }
}
=======
      ...(runtimeParityCell ? { runtimeParityCell } : {}),
    } satisfies QaSuiteResult;
  } catch (error) {
    preserveGatewayRuntimeDir = path.join(outputDir, "artifacts", "gateway-runtime");
    throw error;
  } finally {
    await closeQaWebSessions(env.webSessionIds);
    const keepTemp = process.env.OPENCLAW_QA_KEEP_TEMP === "1" || false;
    await gateway.stop({
      keepTemp,
      preserveToDir: keepTemp ? undefined : preserveGatewayRuntimeDir,
    });
    await disposeRegisteredAgentHarnesses();
    await mock?.stop();
    if (ownsLab) {
      await lab.stop();
    } else {
      lab.setControlUi({
        controlUiUrl: null,
        controlUiProxyTarget: null,
      });
    }
  }
}

export const qaSuiteProgressTesting = {
  appendNodeOption,
  buildQaGatewayHeapCheckpointRuntimeEnvPatch,
  buildQaIsolatedScenarioWorkerParams,
  buildQaSuiteRuntimeMetrics,
  buildQaRuntimeEnvPatch,
  mergeQaRuntimeEnvPatches,
  parseQaSuiteBooleanEnv,
  remapModelRefForForcedRuntime,
  resolveQaSuiteControlUiEnabled,
  scenarioRequiresControlUi,
  resolveQaSuiteTransportReadyTimeoutMs,
  sanitizeQaSuiteProgressValue,
  shouldRunQaSuiteWithIsolatedScenarioWorkers,
  shouldLogQaSuiteProgress,
  waitForQaLabReadyOrStopOwned,
};
>>>>>>> upstream/main
