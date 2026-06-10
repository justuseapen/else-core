<<<<<<< HEAD
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { importFreshModule } from "../../../test/helpers/import-fresh.js";
import type { OpenClawConfig } from "../../config/config.js";
import { defaultRuntime } from "../../runtime.js";
=======
// Tests follow-up queue message-id dedupe and drain scheduling behavior.
import { importFreshModule } from "openclaw/plugin-sdk/test-fixtures";
import { beforeEach, describe, expect, it } from "vitest";
>>>>>>> upstream/main
import type { FollowupRun, QueueSettings } from "./queue.js";
import {
  enqueueFollowupRun,
  resetRecentQueuedMessageIdDedupe,
  scheduleFollowupDrain,
} from "./queue.js";
<<<<<<< HEAD

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createRun(params: {
  prompt: string;
  messageId?: string;
  originatingChannel?: FollowupRun["originatingChannel"];
  originatingTo?: string;
  originatingAccountId?: string;
  originatingThreadId?: string | number;
}): FollowupRun {
  return {
    prompt: params.prompt,
    messageId: params.messageId,
    enqueuedAt: Date.now(),
    originatingChannel: params.originatingChannel,
    originatingTo: params.originatingTo,
    originatingAccountId: params.originatingAccountId,
    originatingThreadId: params.originatingThreadId,
    run: {
      agentId: "agent",
      agentDir: "/tmp",
      sessionId: "sess",
      sessionFile: "/tmp/session.json",
      workspaceDir: "/tmp",
      config: {} as OpenClawConfig,
      provider: "openai",
      model: "gpt-test",
      timeoutMs: 10_000,
      blockReplyBreak: "text_end",
=======
import {
  createDeferred,
  createQueueTestRun as createRun,
  installQueueRuntimeErrorSilencer,
} from "./queue.test-helpers.js";

installQueueRuntimeErrorSilencer();

const collectSettings: QueueSettings = {
  mode: "collect",
  debounceMs: 0,
  cap: 50,
  dropPolicy: "summarize",
};

function createFollowupCollector(expectedCalls = 1): {
  calls: FollowupRun[];
  done: ReturnType<typeof createDeferred<void>>;
  runFollowup: (run: FollowupRun) => Promise<void>;
} {
  const calls: FollowupRun[] = [];
  const done = createDeferred<void>();
  return {
    calls,
    done,
    runFollowup: async (run: FollowupRun) => {
      calls.push(run);
      if (calls.length >= expectedCalls) {
        done.resolve();
      }
>>>>>>> upstream/main
    },
  };
}

<<<<<<< HEAD
let previousRuntimeError: typeof defaultRuntime.error;

beforeAll(() => {
  previousRuntimeError = defaultRuntime.error;
  defaultRuntime.error = (() => {}) as typeof defaultRuntime.error;
});

afterAll(() => {
  defaultRuntime.error = previousRuntimeError;
});

=======
>>>>>>> upstream/main
describe("followup queue deduplication", () => {
  beforeEach(() => {
    resetRecentQueuedMessageIdDedupe();
  });

  it("deduplicates messages with same Discord message_id", async () => {
    const key = `test-dedup-message-id-${Date.now()}`;
<<<<<<< HEAD
    const calls: FollowupRun[] = [];
    const done = createDeferred<void>();
    const expectedCalls = 1;
    const runFollowup = async (run: FollowupRun) => {
      calls.push(run);
      if (calls.length >= expectedCalls) {
        done.resolve();
      }
    };
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
    const { calls, done, runFollowup } = createFollowupCollector();
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "[Discord Guild #test channel id:123] Hello",
        messageId: "m1",
        originatingChannel: "discord",
        originatingTo: "channel:123",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(first).toBe(true);

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "[Discord Guild #test channel id:123] Hello (dupe)",
        messageId: "m1",
        originatingChannel: "discord",
        originatingTo: "channel:123",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(second).toBe(false);

    const third = enqueueFollowupRun(
      key,
      createRun({
        prompt: "[Discord Guild #test channel id:123] World",
        messageId: "m2",
        originatingChannel: "discord",
        originatingTo: "channel:123",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(third).toBe(true);

    scheduleFollowupDrain(key, runFollowup);
    await done.promise;
    expect(calls[0]?.prompt).toContain("[Queued messages while agent was busy]");
  });

<<<<<<< HEAD
  it("deduplicates same message_id after queue drain restarts", async () => {
    const key = `test-dedup-after-drain-${Date.now()}`;
    const calls: FollowupRun[] = [];
    const done = createDeferred<void>();
    const runFollowup = async (run: FollowupRun) => {
      calls.push(run);
      done.resolve();
    };
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
  it("deduplicates message ids when numeric and string thread ids share a route", () => {
    const key = `test-dedup-thread-normalized-${Date.now()}`;

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "first",
        messageId: "same-id",
        originatingChannel: "telegram",
        originatingTo: "-100123",
        originatingThreadId: 42.9,
      }),
      collectSettings,
    );
    expect(first).toBe(true);

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "second",
        messageId: "same-id",
        originatingChannel: "telegram",
        originatingTo: "-100123",
        originatingThreadId: "42",
      }),
      collectSettings,
    );
    expect(second).toBe(false);
  });

  it("deduplicates same message_id after queue drain restarts", async () => {
    const key = `test-dedup-after-drain-${Date.now()}`;
    const { calls, done, runFollowup } = createFollowupCollector();
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "first",
        messageId: "same-id",
        originatingChannel: "signal",
        originatingTo: "+10000000000",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(first).toBe(true);

    scheduleFollowupDrain(key, runFollowup);
    await done.promise;

    const redelivery = enqueueFollowupRun(
      key,
      createRun({
        prompt: "first-redelivery",
        messageId: "same-id",
        originatingChannel: "signal",
        originatingTo: "+10000000000",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );

    expect(redelivery).toBe(false);
    expect(calls).toHaveLength(1);
  });

  it("deduplicates same message_id across distinct enqueue module instances", async () => {
    const enqueueA = await importFreshModule<typeof import("./queue/enqueue.js")>(
      import.meta.url,
      "./queue/enqueue.js?scope=dedupe-a",
    );
    const enqueueB = await importFreshModule<typeof import("./queue/enqueue.js")>(
      import.meta.url,
      "./queue/enqueue.js?scope=dedupe-b",
    );
    const { clearSessionQueues } = await import("./queue.js");
    const key = `test-dedup-cross-module-${Date.now()}`;
<<<<<<< HEAD
    const calls: FollowupRun[] = [];
    const done = createDeferred<void>();
    const runFollowup = async (run: FollowupRun) => {
      calls.push(run);
      done.resolve();
    };
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
    const { calls, done, runFollowup } = createFollowupCollector();
>>>>>>> upstream/main

    enqueueA.resetRecentQueuedMessageIdDedupe();
    enqueueB.resetRecentQueuedMessageIdDedupe();

    try {
      expect(
        enqueueA.enqueueFollowupRun(
          key,
          createRun({
            prompt: "first",
            messageId: "same-id",
            originatingChannel: "signal",
            originatingTo: "+10000000000",
          }),
<<<<<<< HEAD
          settings,
=======
          collectSettings,
>>>>>>> upstream/main
        ),
      ).toBe(true);

      scheduleFollowupDrain(key, runFollowup);
      await done.promise;
<<<<<<< HEAD
      await new Promise<void>((resolve) => setImmediate(resolve));
=======
      await new Promise<void>((resolve) => {
        setImmediate(resolve);
      });
>>>>>>> upstream/main

      expect(
        enqueueB.enqueueFollowupRun(
          key,
          createRun({
            prompt: "first-redelivery",
            messageId: "same-id",
            originatingChannel: "signal",
            originatingTo: "+10000000000",
          }),
<<<<<<< HEAD
          settings,
=======
          collectSettings,
>>>>>>> upstream/main
        ),
      ).toBe(false);
      expect(calls).toHaveLength(1);
    } finally {
      clearSessionQueues([key]);
      enqueueA.resetRecentQueuedMessageIdDedupe();
      enqueueB.resetRecentQueuedMessageIdDedupe();
    }
  });

  it("does not collide recent message-id keys when routing contains delimiters", async () => {
    const key = `test-dedup-key-collision-${Date.now()}`;
<<<<<<< HEAD
    const calls: FollowupRun[] = [];
    const done = createDeferred<void>();
    const runFollowup = async (run: FollowupRun) => {
      calls.push(run);
      done.resolve();
    };
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
    const { done, runFollowup } = createFollowupCollector();
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "first",
        messageId: "same-id",
        originatingChannel: "signal|group",
        originatingTo: "peer",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(first).toBe(true);

    scheduleFollowupDrain(key, runFollowup);
    await done.promise;

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "second",
        messageId: "same-id",
        originatingChannel: "signal",
        originatingTo: "group|peer",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(second).toBe(true);
  });

<<<<<<< HEAD
  it("deduplicates exact prompt when routing matches and no message id", async () => {
    const key = `test-dedup-whatsapp-${Date.now()}`;
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
  it("deduplicates exact prompt when routing matches and no message id", () => {
    const key = `test-dedup-whatsapp-${Date.now()}`;
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Hello world",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(first).toBe(true);

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Hello world",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(second).toBe(true);

    const third = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Hello world 2",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(third).toBe(true);
  });

<<<<<<< HEAD
  it("does not deduplicate across different providers without message id", async () => {
    const key = `test-dedup-cross-provider-${Date.now()}`;
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
  it("does not deduplicate across different providers without message id", () => {
    const key = `test-dedup-cross-provider-${Date.now()}`;
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Same text",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(first).toBe(true);

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Same text",
        originatingChannel: "discord",
        originatingTo: "channel:123",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
    );
    expect(second).toBe(true);
  });

<<<<<<< HEAD
  it("can opt-in to prompt-based dedupe when message id is absent", async () => {
    const key = `test-dedup-prompt-mode-${Date.now()}`;
    const settings: QueueSettings = {
      mode: "collect",
      debounceMs: 0,
      cap: 50,
      dropPolicy: "summarize",
    };
=======
  it("can opt-in to prompt-based dedupe when message id is absent", () => {
    const key = `test-dedup-prompt-mode-${Date.now()}`;
>>>>>>> upstream/main

    const first = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Hello world",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
      "prompt",
    );
    expect(first).toBe(true);

    const second = enqueueFollowupRun(
      key,
      createRun({
        prompt: "Hello world",
        originatingChannel: "whatsapp",
        originatingTo: "+1234567890",
      }),
<<<<<<< HEAD
      settings,
=======
      collectSettings,
>>>>>>> upstream/main
      "prompt",
    );
    expect(second).toBe(false);
  });
});
