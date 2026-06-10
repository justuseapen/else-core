<<<<<<< HEAD
=======
// Configured state tests cover channel plugin configured-state detection and summaries.
import { createRequire } from "node:module";
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import {
  hasBundledChannelConfiguredState,
  listBundledChannelIdsWithConfiguredState,
} from "./configured-state.js";

<<<<<<< HEAD
describe("bundled channel configured-state metadata", () => {
  it("lists the shipped metadata-first configured-state channels", () => {
    expect(listBundledChannelIdsWithConfiguredState()).toEqual(
      expect.arrayContaining(["discord", "irc", "slack", "telegram"]),
    );
=======
const nodeRequire = createRequire(import.meta.url);

describe("bundled channel configured-state metadata", () => {
  it("lists the shipped metadata-first configured-state channels", () => {
    expect(listBundledChannelIdsWithConfiguredState()).toEqual([
      "discord",
      "irc",
      "slack",
      "telegram",
    ]);
>>>>>>> upstream/main
  });

  it("resolves Discord, Slack, Telegram, and IRC env probes without full plugin loads", () => {
    expect(
      hasBundledChannelConfiguredState({
        channelId: "discord",
        cfg: {},
        env: { DISCORD_BOT_TOKEN: "token" },
      }),
    ).toBe(true);
    expect(
      hasBundledChannelConfiguredState({
        channelId: "slack",
        cfg: {},
        env: { SLACK_BOT_TOKEN: "xoxb-test" },
      }),
    ).toBe(true);
    expect(
      hasBundledChannelConfiguredState({
        channelId: "telegram",
        cfg: {},
        env: { TELEGRAM_BOT_TOKEN: "token" },
      }),
    ).toBe(true);
    expect(
      hasBundledChannelConfiguredState({
        channelId: "irc",
        cfg: {},
        env: { IRC_HOST: "irc.example.com", IRC_NICK: "openclaw" },
      }),
    ).toBe(true);
  });
<<<<<<< HEAD
=======

  it("uses declarative env metadata without a TypeScript source require hook", () => {
    const previousTsHook = nodeRequire.extensions[".ts"];
    delete nodeRequire.extensions[".ts"];
    try {
      expect(
        hasBundledChannelConfiguredState({
          channelId: "discord",
          cfg: {},
          env: { DISCORD_BOT_TOKEN: "token" },
        }),
      ).toBe(true);
    } finally {
      if (previousTsHook) {
        nodeRequire.extensions[".ts"] = previousTsHook;
      }
    }
  });
>>>>>>> upstream/main
});
