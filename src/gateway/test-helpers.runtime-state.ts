<<<<<<< HEAD
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { Mock, vi } from "vitest";
import type { MsgContext } from "../auto-reply/templating.js";
import type { GetReplyOptions, ReplyPayload } from "../auto-reply/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { AgentBinding } from "../config/types.agents.js";
import type { HooksConfig } from "../config/types.hooks.js";
import type { TailscaleWhoisIdentity } from "../infra/tailscale.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";

=======
// Runtime-state test helpers hold hoisted mutable mocks shared by gateway
// Vitest suites and module mocks.
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";
import type { Mock } from "vitest";
import type { GetReplyOptions } from "../auto-reply/get-reply-options.types.js";
import type { ReplyPayload } from "../auto-reply/reply-payload.js";
import type { MsgContext } from "../auto-reply/templating.js";
import type { AgentBinding } from "../config/types.agents.js";
import type { HooksConfig } from "../config/types.hooks.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RunCronAgentTurnResult } from "../cron/isolated-agent/run.types.js";
import type { TailscaleWhoisIdentity } from "../infra/tailscale.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";

/**
 * Hoisted mutable state shared by gateway Vitest module mocks.
 */
>>>>>>> upstream/main
export type GetReplyFromConfigFn = (
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OpenClawConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
<<<<<<< HEAD
export type CronIsolatedRunFn = (
  ...args: unknown[]
) => Promise<{ status: string; summary: string }>;
export type AgentCommandFn = (...args: unknown[]) => Promise<void>;
export type SendWhatsAppFn = (...args: unknown[]) => Promise<{ messageId: string; toJid: string }>;
export type RunBtwSideQuestionFn = (...args: unknown[]) => Promise<unknown>;
export type DispatchInboundMessageFn = (...args: unknown[]) => Promise<unknown>;

const GATEWAY_TEST_CONFIG_ROOT_KEY = Symbol.for("openclaw.gatewayTestHelpers.configRoot");

export type GatewayTestHoistedState = {
  testTailnetIPv4: { value: string | undefined };
  piSdkMock: {
=======
type CronIsolatedRunFn = (...args: unknown[]) => Promise<RunCronAgentTurnResult>;
type AgentCommandFn = (...args: unknown[]) => Promise<void>;
type SendWhatsAppFn = (...args: unknown[]) => Promise<{ messageId: string; toJid: string }>;
export type RunBtwSideQuestionFn = (...args: unknown[]) => Promise<unknown>;
type DispatchInboundMessageFn = (...args: unknown[]) => Promise<unknown>;
type CompactEmbeddedAgentSessionFn = (...args: unknown[]) => Promise<unknown>;

const GATEWAY_TEST_CONFIG_ROOT_KEY = Symbol.for("openclaw.gatewayTestHelpers.configRoot");

type GatewayTestHoistedState = {
  testTailnetIPv4: { value: string | undefined };
  agentDiscoveryMock: {
>>>>>>> upstream/main
    enabled: boolean;
    discoverCalls: number;
    models: Array<{
      id: string;
      name?: string;
      provider: string;
      contextWindow?: number;
      reasoning?: boolean;
<<<<<<< HEAD
=======
      input?: string[];
>>>>>>> upstream/main
    }>;
  };
  cronIsolatedRun: Mock<CronIsolatedRunFn>;
  agentCommand: Mock<AgentCommandFn>;
  runBtwSideQuestion: Mock<RunBtwSideQuestionFn>;
  dispatchInboundMessage: Mock<DispatchInboundMessageFn>;
  testIsNixMode: { value: boolean };
  sessionStoreSaveDelayMs: { value: number };
  embeddedRunMock: {
    activeIds: Set<string>;
    abortCalls: string[];
    waitCalls: string[];
    waitResults: Map<string, boolean>;
<<<<<<< HEAD
=======
    compactEmbeddedAgentSession: Mock<CompactEmbeddedAgentSessionFn>;
>>>>>>> upstream/main
  };
  testTailscaleWhois: { value: TailscaleWhoisIdentity | null };
  getReplyFromConfig: Mock<GetReplyFromConfigFn>;
  sendWhatsAppMock: Mock<SendWhatsAppFn>;
  testState: {
    agentConfig: Record<string, unknown> | undefined;
    agentsConfig: Record<string, unknown> | undefined;
    bindingsConfig: AgentBinding[] | undefined;
    channelsConfig: Record<string, unknown> | undefined;
    sessionStorePath: string | undefined;
    sessionConfig: Record<string, unknown> | undefined;
    allowFrom: string[] | undefined;
    cronStorePath: string | undefined;
    cronEnabled: boolean | undefined;
    gatewayBind: "auto" | "lan" | "tailnet" | "loopback" | undefined;
    gatewayAuth: Record<string, unknown> | undefined;
    gatewayControlUi: Record<string, unknown> | undefined;
    hooksConfig: HooksConfig | undefined;
<<<<<<< HEAD
    canvasHostPort: number | undefined;
=======
>>>>>>> upstream/main
    legacyIssues: Array<{ path: string; message: string }>;
    legacyParsed: Record<string, unknown>;
    migrationConfig: Record<string, unknown> | null;
    migrationChanges: string[];
  };
};

const gatewayTestHoisted = vi.hoisted(() => {
  const key = Symbol.for("openclaw.gatewayTestHelpers.hoisted");
  const store = globalThis as Record<PropertyKey, unknown>;
<<<<<<< HEAD
  if (Object.prototype.hasOwnProperty.call(store, key)) {
=======
  if (Object.hasOwn(store, key)) {
>>>>>>> upstream/main
    return store[key] as GatewayTestHoistedState;
  }
  const created: GatewayTestHoistedState = {
    testTailnetIPv4: { value: undefined },
<<<<<<< HEAD
    piSdkMock: {
=======
    agentDiscoveryMock: {
>>>>>>> upstream/main
      enabled: false,
      discoverCalls: 0,
      models: [],
    },
    cronIsolatedRun: vi.fn(async () => ({ status: "ok", summary: "ok" })),
    agentCommand: vi.fn().mockResolvedValue(undefined),
    runBtwSideQuestion: vi.fn().mockResolvedValue(undefined),
    dispatchInboundMessage: vi.fn(),
    testIsNixMode: { value: false },
    sessionStoreSaveDelayMs: { value: 0 },
    embeddedRunMock: {
      activeIds: new Set<string>(),
      abortCalls: [],
      waitCalls: [],
      waitResults: new Map<string, boolean>(),
<<<<<<< HEAD
=======
      compactEmbeddedAgentSession: vi.fn().mockResolvedValue({
        ok: true,
        compacted: true,
        result: {
          summary: "summary",
          firstKeptEntryId: "entry-1",
          tokensBefore: 120,
          tokensAfter: 80,
        },
      }),
>>>>>>> upstream/main
    },
    testTailscaleWhois: { value: null },
    getReplyFromConfig: vi.fn<GetReplyFromConfigFn>().mockResolvedValue(undefined),
    sendWhatsAppMock: vi.fn().mockResolvedValue({ messageId: "msg-1", toJid: "jid-1" }),
    testState: {
      agentConfig: undefined,
      agentsConfig: undefined,
      bindingsConfig: undefined,
      channelsConfig: undefined,
      sessionStorePath: undefined,
      sessionConfig: undefined,
      allowFrom: undefined,
      cronStorePath: undefined,
      cronEnabled: false,
      gatewayBind: undefined,
      gatewayAuth: undefined,
      gatewayControlUi: undefined,
      hooksConfig: undefined,
<<<<<<< HEAD
      canvasHostPort: undefined,
=======
>>>>>>> upstream/main
      legacyIssues: [],
      legacyParsed: {},
      migrationConfig: null,
      migrationChanges: [],
    },
  };
  store[key] = created;
  return created;
});

<<<<<<< HEAD
=======
/** Returns the singleton state object used by gateway test module mocks. */
>>>>>>> upstream/main
export function getGatewayTestHoistedState(): GatewayTestHoistedState {
  return gatewayTestHoisted;
}

export const testTailnetIPv4 = gatewayTestHoisted.testTailnetIPv4;
export const testTailscaleWhois = gatewayTestHoisted.testTailscaleWhois;
<<<<<<< HEAD
export const piSdkMock = gatewayTestHoisted.piSdkMock;
=======
export const agentDiscoveryMock = gatewayTestHoisted.agentDiscoveryMock;
>>>>>>> upstream/main
export const cronIsolatedRun = gatewayTestHoisted.cronIsolatedRun;
export const agentCommand = gatewayTestHoisted.agentCommand;
export const runBtwSideQuestion = gatewayTestHoisted.runBtwSideQuestion;
export const dispatchInboundMessageMock = gatewayTestHoisted.dispatchInboundMessage;
export const getReplyFromConfig = gatewayTestHoisted.getReplyFromConfig;
export const mockGetReplyFromConfigOnce = (impl: GetReplyFromConfigFn) => {
  getReplyFromConfig.mockImplementationOnce(impl);
};
export const sendWhatsAppMock = gatewayTestHoisted.sendWhatsAppMock;
export const testState = gatewayTestHoisted.testState;
export const testIsNixMode = gatewayTestHoisted.testIsNixMode;
export const sessionStoreSaveDelayMs = gatewayTestHoisted.sessionStoreSaveDelayMs;
export const embeddedRunMock = gatewayTestHoisted.embeddedRunMock;

export const testConfigRoot = resolveGlobalSingleton(GATEWAY_TEST_CONFIG_ROOT_KEY, () => ({
  value: path.join(os.tmpdir(), `openclaw-gateway-test-${process.pid}-${crypto.randomUUID()}`),
}));

<<<<<<< HEAD
=======
/** Updates the config root used by gateway config-module mocks. */
>>>>>>> upstream/main
export function setTestConfigRoot(root: string): void {
  testConfigRoot.value = root;
  process.env.OPENCLAW_CONFIG_PATH = path.join(root, "openclaw.json");
}
