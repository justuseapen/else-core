<<<<<<< HEAD
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import { describe, expect, it } from "vitest";
import { createSlackOutboundPayloadHarness } from "../contract-api.js";
=======
// Slack tests cover outbound payload plugin behavior.
import { installChannelOutboundPayloadContractSuite } from "openclaw/plugin-sdk/channel-contract-testing";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import { describe, expect, it } from "vitest";
import { createSlackOutboundPayloadHarness, slackOutbound } from "../test-api.js";
>>>>>>> upstream/main

function createHarness(params: {
  payload: ReplyPayload;
  sendResults?: Array<{ messageId: string }>;
}) {
  return createSlackOutboundPayloadHarness(params);
}

<<<<<<< HEAD
describe("slackOutbound sendPayload", () => {
  it("forwards Slack blocks from channelData", async () => {
    const { run, sendMock, to } = createHarness({
      payload: {
        text: "Fallback summary",
        channelData: {
          slack: {
            blocks: [{ type: "divider" }],
          },
        },
=======
type MockWithCalls = {
  mock: { calls: unknown[][] };
};

function sendCall(sendMock: MockWithCalls, index: number): unknown[] {
  const call = sendMock.mock.calls[index];
  if (!call) {
    throw new Error(`expected Slack send call ${index}`);
  }
  return call;
}

function sendOptions(call: unknown[]): {
  blocks?: Array<{
    block_id?: string;
    elements?: Array<{ action_id?: string }>;
    type?: string;
  }>;
  mediaUrl?: string;
} {
  const options = call?.[2];
  if (!options) {
    throw new Error("Expected Slack send options");
  }
  return options as {
    blocks?: Array<{
      block_id?: string;
      elements?: Array<{ action_id?: string }>;
      type?: string;
    }>;
    mediaUrl?: string;
  };
}

describe("slackOutbound sendPayload", () => {
  it("renders presentation blocks", async () => {
    const { run, sendMock, to } = createHarness({
      payload: {
        text: "Fallback summary",
        presentation: { blocks: [{ type: "divider" }] },
>>>>>>> upstream/main
      },
    });

    const result = await run();

    expect(sendMock).toHaveBeenCalledTimes(1);
<<<<<<< HEAD
    expect(sendMock).toHaveBeenCalledWith(
      to,
      "Fallback summary",
      expect.objectContaining({
        blocks: [{ type: "divider" }],
      }),
    );
    expect(result).toMatchObject({ channel: "slack", messageId: "sl-1" });
  });

  it("accepts blocks encoded as JSON strings in Slack channelData", async () => {
    const { run, sendMock, to } = createHarness({
      payload: {
        channelData: {
          slack: {
            blocks: '[{"type":"section","text":{"type":"mrkdwn","text":"hello"}}]',
          },
        },
      },
    });

    await run();

    expect(sendMock).toHaveBeenCalledWith(
      to,
      "",
      expect.objectContaining({
        blocks: [{ type: "section", text: { type: "mrkdwn", text: "hello" } }],
      }),
    );
  });

  it("rejects invalid Slack blocks from channelData", async () => {
    const { run, sendMock } = createHarness({
      payload: {
        channelData: {
          slack: {
            blocks: {},
          },
        },
      },
    });

    await expect(run()).rejects.toThrow(/blocks must be an array/i);
    expect(sendMock).not.toHaveBeenCalled();
=======
    const call = sendCall(sendMock, 0);
    expect(call[0]).toBe(to);
    expect(call[1]).toBe("Fallback summary");
    expect(sendOptions(call).blocks).toEqual([{ type: "divider" }]);
    expect(result.channel).toBe("slack");
    expect(result.messageId).toBe("sl-1");
  });

  it("keeps the portable fallback when presentation renders no Slack blocks", async () => {
    const payload: ReplyPayload = {
      presentation: {
        blocks: [
          {
            type: "buttons",
            buttons: [{ label: "Launch", webApp: { url: "https://example.com/app" } }],
          },
        ],
      },
    };

    const rendered = await slackOutbound.renderPresentation?.({
      payload,
      presentation: payload.presentation!,
      ctx: {
        cfg: {},
        to: "C12345",
        text: "",
        payload,
      },
    });

    expect(rendered).toBeNull();
>>>>>>> upstream/main
  });

  it("sends media before a separate interactive blocks message", async () => {
    const { run, sendMock, to } = createHarness({
      payload: {
        text: "Approval required",
        mediaUrl: "https://example.com/image.png",
        interactive: {
          blocks: [
            {
              type: "buttons",
              buttons: [{ label: "Allow", value: "pluginbind:approval-123:o" }],
            },
          ],
        },
      },
      sendResults: [{ messageId: "sl-media" }, { messageId: "sl-controls" }],
    });

    const result = await run();

    expect(sendMock).toHaveBeenCalledTimes(2);
<<<<<<< HEAD
    expect(sendMock).toHaveBeenNthCalledWith(
      1,
      to,
      "",
      expect.objectContaining({
        mediaUrl: "https://example.com/image.png",
      }),
    );
    expect(sendMock.mock.calls[0]?.[2]).not.toHaveProperty("blocks");
    expect(sendMock).toHaveBeenNthCalledWith(
      2,
      to,
      "Approval required",
      expect.objectContaining({
        blocks: [
          expect.objectContaining({
            type: "actions",
          }),
        ],
      }),
    );
    expect(result).toMatchObject({ channel: "slack", messageId: "sl-controls" });
=======
    const mediaCall = sendCall(sendMock, 0);
    expect(mediaCall[0]).toBe(to);
    expect(mediaCall[1]).toBe("");
    expect(sendOptions(mediaCall).mediaUrl).toBe("https://example.com/image.png");
    expect(mediaCall[2]).not.toHaveProperty("blocks");
    const controlsCall = sendCall(sendMock, 1);
    expect(controlsCall[0]).toBe(to);
    expect(controlsCall[1]).toBe("Approval required");
    expect(sendOptions(controlsCall).blocks?.[0]?.type).toBe("actions");
    expect(result.channel).toBe("slack");
    expect(result.messageId).toBe("sl-controls");
>>>>>>> upstream/main
  });

  it("fails when merged Slack blocks exceed the platform limit", async () => {
    const { run, sendMock } = createHarness({
      payload: {
<<<<<<< HEAD
        channelData: {
          slack: {
            blocks: Array.from({ length: 50 }, () => ({ type: "divider" })),
          },
        },
=======
        presentation: { blocks: Array.from({ length: 50 }, () => ({ type: "divider" })) },
>>>>>>> upstream/main
        interactive: {
          blocks: [
            {
              type: "buttons",
              buttons: [{ label: "Allow", value: "pluginbind:approval-123:o" }],
            },
          ],
        },
      },
    });

    await expect(run()).rejects.toThrow(/Slack blocks cannot exceed 50 items/i);
    expect(sendMock).not.toHaveBeenCalled();
  });
<<<<<<< HEAD
=======

  it("offsets presentation controls against native Slack blocks before standalone interactive controls", async () => {
    const { run, sendMock, to } = createHarness({
      payload: {
        text: "Deploy?",
        channelData: {
          slack: {
            blocks: [
              {
                type: "actions",
                block_id: "openclaw_reply_buttons_1",
                elements: [],
              },
            ],
          },
        },
        presentation: {
          blocks: [
            {
              type: "buttons",
              buttons: [{ label: "Stage", value: "stage" }],
            },
          ],
        },
        interactive: {
          blocks: [
            {
              type: "buttons",
              buttons: [{ label: "Approve", value: "approve" }],
            },
          ],
        },
      },
    });

    await run();

    expect(sendMock).toHaveBeenCalledTimes(1);
    const call = sendCall(sendMock, 0);
    expect(call[0]).toBe(to);
    expect(call[1]).toBe("Deploy?");
    const blocks = sendOptions(call).blocks;
    expect(blocks?.[0]?.block_id).toBe("openclaw_reply_buttons_1");
    expect(blocks?.[1]?.block_id).toBe("openclaw_reply_buttons_2");
    expect(blocks?.[1]?.elements?.[0]?.action_id).toBe("openclaw:reply_button:2:1");
    expect(blocks?.[2]?.block_id).toBe("openclaw_reply_buttons_3");
    expect(blocks?.[2]?.elements?.[0]?.action_id).toBe("openclaw:reply_button:3:1");
  });
});

describe("Slack outbound payload contract", () => {
  installChannelOutboundPayloadContractSuite({
    channel: "slack",
    chunking: { mode: "passthrough", longTextLength: 5000 },
    createHarness: createSlackOutboundPayloadHarness,
  });
>>>>>>> upstream/main
});
