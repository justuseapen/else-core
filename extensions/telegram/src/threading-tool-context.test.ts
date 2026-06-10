<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
// Telegram tests cover threading tool context plugin behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import { buildTelegramThreadingToolContext } from "./threading-tool-context.js";

describe("buildTelegramThreadingToolContext", () => {
  it("keeps topic thread state in plugin-owned tool context", () => {
<<<<<<< HEAD
=======
    const hasRepliedRef = { value: false };
>>>>>>> upstream/main
    expect(
      buildTelegramThreadingToolContext({
        cfg: {} as OpenClawConfig,
        accountId: "default",
        context: {
          To: "telegram:-1001:topic:77",
          MessageThreadId: 77,
          CurrentMessageId: "msg-1",
        },
<<<<<<< HEAD
        hasRepliedRef: { value: false },
      }),
    ).toMatchObject({
      currentChannelId: "telegram:-1001:topic:77",
      currentThreadTs: "77",
=======
        hasRepliedRef,
      }),
    ).toEqual({
      currentChannelId: "telegram:-1001:topic:77",
      currentThreadTs: "77",
      hasRepliedRef,
>>>>>>> upstream/main
    });
  });

  it("parses topic thread state from target grammar when MessageThreadId is absent", () => {
    expect(
      buildTelegramThreadingToolContext({
        cfg: {} as OpenClawConfig,
        accountId: "default",
        context: {
          To: "telegram:-1001:topic:77",
          CurrentMessageId: "msg-1",
        },
      }),
<<<<<<< HEAD
    ).toMatchObject({
      currentChannelId: "telegram:-1001:topic:77",
      currentThreadTs: "77",
=======
    ).toEqual({
      currentChannelId: "telegram:-1001:topic:77",
      currentThreadTs: "77",
      hasRepliedRef: undefined,
>>>>>>> upstream/main
    });
  });
});
