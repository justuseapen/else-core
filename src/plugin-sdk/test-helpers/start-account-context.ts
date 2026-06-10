<<<<<<<< HEAD:test/helpers/plugins/start-account-context.ts
import { vi } from "vitest";
import type {
  ChannelAccountSnapshot,
  ChannelGatewayContext,
} from "../../../src/channels/plugins/types.js";
import type { OpenClawConfig } from "../../../src/config/config.js";
import type { RuntimeEnv } from "../../../src/runtime.js";
import { createRuntimeEnv } from "./runtime-env.js";
========
/**
 * Test helper for constructing a channel account startup context.
 */
import { vi } from "vitest";
import { createRuntimeEnv } from "../testing.js";
import type {
  ChannelAccountSnapshot,
  ChannelGatewayContext,
  OpenClawConfig,
  RuntimeEnv,
} from "../testing.js";
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/start-account-context.ts

/** Creates a minimal ChannelGatewayContext with mutable status for startAccount tests. */
export function createStartAccountContext<TAccount extends { accountId: string }>(params: {
  account: TAccount;
  abortSignal?: AbortSignal;
  cfg?: OpenClawConfig;
  runtime?: RuntimeEnv;
  statusPatchSink?: (next: ChannelAccountSnapshot) => void;
}): ChannelGatewayContext<TAccount> {
  const snapshot: ChannelAccountSnapshot = {
    accountId: params.account.accountId,
    configured: true,
    enabled: true,
    running: false,
  };
  return {
    accountId: params.account.accountId,
    account: params.account,
    cfg: params.cfg ?? ({} as OpenClawConfig),
    runtime: params.runtime ?? createRuntimeEnv(),
    abortSignal: params.abortSignal ?? new AbortController().signal,
    log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    getStatus: () => snapshot,
    setStatus: (next) => {
      Object.assign(snapshot, next);
      params.statusPatchSink?.(snapshot);
    },
  };
}
