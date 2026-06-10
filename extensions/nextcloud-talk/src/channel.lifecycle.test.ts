<<<<<<< HEAD
import { afterEach, describe, expect, it, vi } from "vitest";
import { createStartAccountContext } from "../../../test/helpers/plugins/start-account-context.js";
=======
// Nextcloud Talk tests cover channel.lifecycle plugin behavior.
import { createStartAccountContext } from "openclaw/plugin-sdk/channel-test-helpers";
>>>>>>> upstream/main
import {
  expectStopPendingUntilAbort,
  startAccountAndTrackLifecycle,
  waitForStartedMocks,
<<<<<<< HEAD
} from "../../../test/helpers/plugins/start-account-lifecycle.js";
import type { ResolvedNextcloudTalkAccount } from "./accounts.js";

vi.mock("../../../src/config/bundled-channel-config-runtime.js", () => ({
  getBundledChannelRuntimeMap: () => new Map(),
  getBundledChannelConfigSchemaMap: () => new Map(),
}));

vi.mock("../../../src/channels/plugins/bundled.js", () => ({
  bundledChannelPlugins: [],
  bundledChannelSetupPlugins: [],
}));

=======
} from "openclaw/plugin-sdk/channel-test-helpers";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ResolvedNextcloudTalkAccount } from "./accounts.js";

>>>>>>> upstream/main
const hoisted = vi.hoisted(() => ({
  monitorNextcloudTalkProvider: vi.fn(),
}));

<<<<<<< HEAD
vi.mock("./monitor.js", async () => {
  const actual = await vi.importActual<typeof import("./monitor.js")>("./monitor.js");
  return {
    ...actual,
    monitorNextcloudTalkProvider: hoisted.monitorNextcloudTalkProvider,
  };
});

const { nextcloudTalkPlugin } = await import("./channel.js");
=======
vi.mock("./monitor-runtime.js", () => ({
  monitorNextcloudTalkProvider: hoisted.monitorNextcloudTalkProvider,
}));

const { nextcloudTalkGatewayAdapter } = await import("./gateway.js");

type NextcloudTalkStartAccount = NonNullable<typeof nextcloudTalkGatewayAdapter.startAccount>;

function requireStartAccount(): NextcloudTalkStartAccount {
  const startAccount = nextcloudTalkGatewayAdapter.startAccount;
  if (!startAccount) {
    throw new Error("Expected Nextcloud Talk gateway startAccount");
  }
  return startAccount;
}
>>>>>>> upstream/main

function buildAccount(): ResolvedNextcloudTalkAccount {
  return {
    accountId: "default",
    enabled: true,
    baseUrl: "https://nextcloud.example.com",
    secret: "secret", // pragma: allowlist secret
    secretSource: "config", // pragma: allowlist secret
    config: {
      baseUrl: "https://nextcloud.example.com",
      botSecret: "secret", // pragma: allowlist secret
      webhookPath: "/nextcloud-talk-webhook",
      webhookPort: 8788,
    },
  };
}

function mockStartedMonitor() {
  const stop = vi.fn();
  hoisted.monitorNextcloudTalkProvider.mockResolvedValue({ stop });
  return stop;
}

function startNextcloudAccount(abortSignal?: AbortSignal) {
<<<<<<< HEAD
  return nextcloudTalkPlugin.gateway!.startAccount!(
=======
  return requireStartAccount()(
>>>>>>> upstream/main
    createStartAccountContext({
      account: buildAccount(),
      abortSignal,
    }),
  );
}

describe("nextcloud-talk startAccount lifecycle", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("keeps startAccount pending until abort, then stops the monitor", async () => {
    const stop = mockStartedMonitor();
    const { abort, task, isSettled } = startAccountAndTrackLifecycle({
<<<<<<< HEAD
      startAccount: nextcloudTalkPlugin.gateway!.startAccount!,
=======
      startAccount: requireStartAccount(),
>>>>>>> upstream/main
      account: buildAccount(),
    });
    await expectStopPendingUntilAbort({
      waitForStarted: waitForStartedMocks(hoisted.monitorNextcloudTalkProvider),
      isSettled,
      abort,
      task,
      stop,
    });
  });

  it("stops immediately when startAccount receives an already-aborted signal", async () => {
    const stop = mockStartedMonitor();
    const abort = new AbortController();
    abort.abort();

    await startNextcloudAccount(abort.signal);

    expect(hoisted.monitorNextcloudTalkProvider).toHaveBeenCalledOnce();
    expect(stop).toHaveBeenCalledOnce();
  });
});
