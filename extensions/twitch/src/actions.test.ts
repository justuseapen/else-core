<<<<<<< HEAD
import { describe, expect, it, vi, beforeEach } from "vitest";
import { twitchMessageActions } from "./actions.js";
=======
// Twitch tests cover actions plugin behavior.
import { describe, expect, it, vi, beforeEach } from "vitest";
import { twitchMessageActions } from "./actions.js";
import type { ResolvedTwitchAccountContext } from "./config.js";
>>>>>>> upstream/main
import { resolveTwitchAccountContext } from "./config.js";
import { twitchOutbound } from "./outbound.js";

vi.mock("./config.js", () => ({
  DEFAULT_ACCOUNT_ID: "default",
  resolveTwitchAccountContext: vi.fn(),
}));

vi.mock("./outbound.js", () => ({
  twitchOutbound: {
    sendText: vi.fn(),
  },
}));

<<<<<<< HEAD
=======
function createSecondaryAccountContext(accountId = "secondary"): ResolvedTwitchAccountContext {
  return {
    accountId,
    account: {
      channel: "secondary-channel",
      username: "secondary",
      accessToken: "oauth:secondary-token",
      clientId: "secondary-client",
      enabled: true,
    },
    tokenResolution: { source: "config", token: "oauth:secondary-token" },
    configured: true,
    availableAccountIds: ["default", "secondary"],
  };
}

>>>>>>> upstream/main
describe("twitchMessageActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses configured defaultAccount when action accountId is omitted", async () => {
    vi.mocked(resolveTwitchAccountContext)
<<<<<<< HEAD
      .mockImplementationOnce(() => ({
        accountId: "secondary",
        account: {
          channel: "secondary-channel",
          username: "secondary",
          accessToken: "oauth:secondary-token",
          clientId: "secondary-client",
          enabled: true,
        },
        tokenResolution: { source: "config", token: "oauth:secondary-token" },
        configured: true,
        availableAccountIds: ["default", "secondary"],
      }))
      .mockImplementation((_cfg, accountId) => ({
        accountId: accountId?.trim() || "secondary",
        account: {
          channel: "secondary-channel",
          username: "secondary",
          accessToken: "oauth:secondary-token",
          clientId: "secondary-client",
          enabled: true,
        },
        tokenResolution: { source: "config", token: "oauth:secondary-token" },
        configured: true,
        availableAccountIds: ["default", "secondary"],
      }));
    vi.mocked(twitchOutbound.sendText!).mockResolvedValue({
=======
      .mockImplementationOnce(() => createSecondaryAccountContext())
      .mockImplementation((_cfg, accountId) =>
        createSecondaryAccountContext(accountId?.trim() || "secondary"),
      );
    const sendText = twitchOutbound.sendText;
    if (!sendText) {
      throw new Error("twitchOutbound.sendText is unavailable");
    }
    vi.mocked(sendText).mockResolvedValue({
>>>>>>> upstream/main
      channel: "twitch",
      messageId: "msg-1",
      timestamp: 1,
    });
<<<<<<< HEAD
=======
    const cfg = {
      channels: {
        twitch: {
          defaultAccount: "secondary",
        },
      },
    };
>>>>>>> upstream/main

    await twitchMessageActions.handleAction!({
      action: "send",
      params: { message: "Hello!" },
<<<<<<< HEAD
      cfg: {
        channels: {
          twitch: {
            defaultAccount: "secondary",
          },
        },
      },
    } as never);

    expect(twitchOutbound.sendText).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "secondary",
        to: "secondary-channel",
      }),
    );
=======
      cfg,
    } as never);

    expect(twitchOutbound.sendText).toHaveBeenCalledWith({
      cfg,
      to: "secondary-channel",
      text: "Hello!",
      accountId: "secondary",
    });
>>>>>>> upstream/main
  });
});
