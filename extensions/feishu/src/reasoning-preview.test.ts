<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
// Feishu tests cover reasoning preview plugin behavior.
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClawdbotConfig } from "./bot-runtime-api.js";
>>>>>>> upstream/main
import { resolveFeishuReasoningPreviewEnabled } from "./reasoning-preview.js";

const { loadSessionStoreMock } = vi.hoisted(() => ({
  loadSessionStoreMock: vi.fn(),
}));

vi.mock("./bot-runtime-api.js", async () => {
  const actual =
    await vi.importActual<typeof import("./bot-runtime-api.js")>("./bot-runtime-api.js");
  return {
    ...actual,
    loadSessionStore: loadSessionStoreMock,
  };
});

<<<<<<< HEAD
describe("resolveFeishuReasoningPreviewEnabled", () => {
=======
afterAll(() => {
  vi.doUnmock("./bot-runtime-api.js");
  vi.resetModules();
});

describe("resolveFeishuReasoningPreviewEnabled", () => {
  const emptyCfg: ClawdbotConfig = {};

>>>>>>> upstream/main
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables previews only for stream reasoning sessions", () => {
    loadSessionStoreMock.mockReturnValue({
      "agent:main:feishu:dm:ou_sender_1": { reasoningLevel: "stream" },
      "agent:main:feishu:dm:ou_sender_2": { reasoningLevel: "on" },
    });

    expect(
      resolveFeishuReasoningPreviewEnabled({
<<<<<<< HEAD
=======
        cfg: emptyCfg,
        agentId: "main",
>>>>>>> upstream/main
        storePath: "/tmp/feishu-sessions.json",
        sessionKey: "agent:main:feishu:dm:ou_sender_1",
      }),
    ).toBe(true);
    expect(
      resolveFeishuReasoningPreviewEnabled({
<<<<<<< HEAD
=======
        cfg: emptyCfg,
        agentId: "main",
>>>>>>> upstream/main
        storePath: "/tmp/feishu-sessions.json",
        sessionKey: "agent:main:feishu:dm:ou_sender_2",
      }),
    ).toBe(false);
  });

  it("returns false for missing sessions or load failures", () => {
    loadSessionStoreMock.mockImplementationOnce(() => {
      throw new Error("disk unavailable");
    });

    expect(
      resolveFeishuReasoningPreviewEnabled({
<<<<<<< HEAD
=======
        cfg: emptyCfg,
        agentId: "main",
>>>>>>> upstream/main
        storePath: "/tmp/feishu-sessions.json",
        sessionKey: "agent:main:feishu:dm:ou_sender_1",
      }),
    ).toBe(false);
    expect(
      resolveFeishuReasoningPreviewEnabled({
<<<<<<< HEAD
=======
        cfg: emptyCfg,
        agentId: "main",
>>>>>>> upstream/main
        storePath: "/tmp/feishu-sessions.json",
      }),
    ).toBe(false);
  });
<<<<<<< HEAD
=======

  it("falls back to configured stream defaults", () => {
    loadSessionStoreMock.mockReturnValue({
      "agent:main:feishu:dm:ou_sender_1": {},
      "agent:main:feishu:dm:ou_sender_2": { reasoningLevel: "off" },
    });

    const cfg: ClawdbotConfig = {
      agents: {
        defaults: { reasoningDefault: "stream" },
        list: [{ id: "Ops", reasoningDefault: "off" }],
      },
    };

    expect(
      resolveFeishuReasoningPreviewEnabled({
        cfg,
        agentId: "main",
        storePath: "/tmp/feishu-sessions.json",
        sessionKey: "agent:main:feishu:dm:ou_sender_1",
      }),
    ).toBe(true);
    expect(
      resolveFeishuReasoningPreviewEnabled({
        cfg,
        agentId: "ops",
        storePath: "/tmp/feishu-sessions.json",
      }),
    ).toBe(false);
    expect(
      resolveFeishuReasoningPreviewEnabled({
        cfg,
        agentId: "main",
        storePath: "/tmp/feishu-sessions.json",
        sessionKey: "agent:main:feishu:dm:ou_sender_2",
      }),
    ).toBe(false);
  });
>>>>>>> upstream/main
});
