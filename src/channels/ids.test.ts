<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { listChannelCatalogEntries } from "../plugins/channel-catalog-registry.js";
=======
// Channel id tests cover identifier normalization and validation helpers.
import { describe, expect, it } from "vitest";
import { listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read.js";
>>>>>>> upstream/main
import {
  CHAT_CHANNEL_ALIASES,
  CHAT_CHANNEL_ORDER,
  normalizeChatChannelId,
  type ChatChannelId,
} from "./ids.js";

<<<<<<< HEAD
function collectBundledChatChannelAliases(): Record<string, ChatChannelId> {
  const aliases = new Map<string, ChatChannelId>();

  for (const entry of listChannelCatalogEntries({ origin: "bundled" })) {
    const channel = entry.channel;
    const rawId = channel?.id?.trim();
=======
function collectChatChannelAliases(): Record<string, ChatChannelId> {
  const aliases = new Map<string, ChatChannelId>();

  for (const entry of listBundledChannelCatalogEntries()) {
    const rawId = entry.id.trim();
>>>>>>> upstream/main
    if (!rawId || !CHAT_CHANNEL_ORDER.includes(rawId)) {
      continue;
    }
    const channelId = rawId;
<<<<<<< HEAD
    if (!channel) {
      continue;
    }
    for (const alias of channel.aliases ?? []) {
=======
    for (const alias of entry.aliases ?? []) {
>>>>>>> upstream/main
      const normalizedAlias = alias.trim().toLowerCase();
      if (!normalizedAlias) {
        continue;
      }
      aliases.set(normalizedAlias, channelId);
    }
  }

  return Object.fromEntries(
    [...aliases.entries()].toSorted(([left], [right]) => left.localeCompare(right)),
  ) as Record<string, ChatChannelId>;
}

describe("channel ids", () => {
  it("normalizes built-in aliases + trims whitespace", () => {
    expect(normalizeChatChannelId(" imsg ")).toBe("imessage");
    expect(normalizeChatChannelId("gchat")).toBe("googlechat");
    expect(normalizeChatChannelId("google-chat")).toBe("googlechat");
    expect(normalizeChatChannelId("internet-relay-chat")).toBe("irc");
    expect(normalizeChatChannelId("telegram")).toBe("telegram");
    expect(normalizeChatChannelId("web")).toBeNull();
    expect(normalizeChatChannelId("nope")).toBeNull();
  });

<<<<<<< HEAD
  it("matches bundled built-in channel alias metadata", () => {
    expect(CHAT_CHANNEL_ALIASES).toEqual(collectBundledChatChannelAliases());
=======
  it("matches channel catalog alias metadata", () => {
    expect(CHAT_CHANNEL_ALIASES).toEqual(collectChatChannelAliases());
>>>>>>> upstream/main
  });
});
