<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRuntimeEnv } from "../../../test/helpers/plugins/runtime-env.js";
=======
// Zalo tests cover monitor.image.polling plugin behavior.
import { createRuntimeEnv } from "openclaw/plugin-sdk/plugin-test-runtime";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
>>>>>>> upstream/main
import {
  createImageLifecycleCore,
  createImageUpdate,
  createLifecycleMonitorSetup,
  expectImageLifecycleDelivery,
<<<<<<< HEAD
} from "../test-support/lifecycle-test-support.js";
import {
  getUpdatesMock,
  getZaloRuntimeMock,
  loadLifecycleMonitorModule,
  resetLifecycleTestState,
  sendMessageMock,
} from "../test-support/monitor-mocks-test-support.js";
=======
  settleAsyncWork,
} from "./test-support/lifecycle-test-support.js";
import {
  getUpdatesMock,
  getZaloRuntimeMock,
  loadCachedLifecycleMonitorModule,
  resetLifecycleTestState,
  sendMessageMock,
} from "./test-support/monitor-mocks-test-support.js";
>>>>>>> upstream/main

describe("Zalo polling image handling", () => {
  const {
    core,
    finalizeInboundContextMock,
    recordInboundSessionMock,
    readRemoteMediaBufferMock,
    saveRemoteMediaMock,
    saveMediaBufferMock,
  } = createImageLifecycleCore();

  beforeEach(async () => {
    await resetLifecycleTestState();
    getZaloRuntimeMock.mockReturnValue(core);
  });

<<<<<<< HEAD
  afterEach(async () => {
=======
  afterAll(async () => {
>>>>>>> upstream/main
    await resetLifecycleTestState();
  });

  it("downloads inbound image media from photo_url and preserves display_name", async () => {
    getUpdatesMock
      .mockResolvedValueOnce({
        ok: true,
        result: createImageUpdate({ date: 1774084566880 }),
      })
      .mockImplementation(() => new Promise(() => {}));

<<<<<<< HEAD
    const { monitorZaloProvider } = await loadLifecycleMonitorModule();
=======
    const { monitorZaloProvider } = await loadCachedLifecycleMonitorModule("zalo-image-polling");
>>>>>>> upstream/main
    const abort = new AbortController();
    const runtime = createRuntimeEnv();
    const { account, config } = createLifecycleMonitorSetup({
      accountId: "default",
      dmPolicy: "open",
    });
    const run = monitorZaloProvider({
      token: "zalo-token", // pragma: allowlist secret
      account,
      config,
      runtime,
      abortSignal: abort.signal,
    });

    await settleAsyncWork();
    expect(saveRemoteMediaMock).toHaveBeenCalledTimes(1);
    expect(readRemoteMediaBufferMock).not.toHaveBeenCalled();
    expectImageLifecycleDelivery({
      readRemoteMediaBufferMock,
      saveRemoteMediaMock,
      saveMediaBufferMock,
      finalizeInboundContextMock,
      recordInboundSessionMock,
    });

    abort.abort();
    await run;
  });

  it("rejects unauthorized DM images before downloading media", async () => {
    getUpdatesMock
      .mockResolvedValueOnce({
        ok: true,
        result: createImageUpdate({
          messageId: "msg-unauthorized-1",
          userId: "user-unauthorized-1",
          chatId: "chat-unauthorized-1",
        }),
      })
      .mockImplementation(() => new Promise(() => {}));

<<<<<<< HEAD
    const { monitorZaloProvider } = await loadLifecycleMonitorModule();
=======
    const { monitorZaloProvider } = await loadCachedLifecycleMonitorModule("zalo-image-polling");
>>>>>>> upstream/main
    const abort = new AbortController();
    const runtime = createRuntimeEnv();
    const { account, config } = createLifecycleMonitorSetup({
      accountId: "default",
      dmPolicy: "pairing",
      allowFrom: ["allowed-user"],
    });
    const run = monitorZaloProvider({
      token: "zalo-token", // pragma: allowlist secret
      account,
      config,
      runtime,
      abortSignal: abort.signal,
    });

<<<<<<< HEAD
    await vi.waitFor(() => expect(sendMessageMock).toHaveBeenCalledTimes(1));
    expect(fetchRemoteMediaMock).not.toHaveBeenCalled();
=======
    await settleAsyncWork();
    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(readRemoteMediaBufferMock).not.toHaveBeenCalled();
>>>>>>> upstream/main
    expect(saveMediaBufferMock).not.toHaveBeenCalled();
    expect(finalizeInboundContextMock).not.toHaveBeenCalled();
    expect(recordInboundSessionMock).not.toHaveBeenCalled();

    abort.abort();
    await run;
  });
});
