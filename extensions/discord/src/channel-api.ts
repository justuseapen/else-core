<<<<<<< HEAD
=======
// Discord API module exposes the plugin public contract.
>>>>>>> upstream/main
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
export {
  buildTokenChannelStatusSummary,
  PAIRING_APPROVED_MESSAGE,
  projectCredentialSnapshotFields,
  resolveConfiguredFromCredentialStatuses,
} from "openclaw/plugin-sdk/channel-status";
<<<<<<< HEAD
export { createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main

const DISCORD_CHANNEL_META = {
  id: "discord",
  label: "Discord",
  selectionLabel: "Discord (Bot API)",
  detailLabel: "Discord Bot",
  docsPath: "/channels/discord",
  docsLabel: "discord",
  blurb: "very well supported right now.",
  systemImage: "bubble.left.and.bubble.right",
  markdownCapable: true,
<<<<<<< HEAD
=======
  preferSessionLookupForAnnounceTarget: true,
>>>>>>> upstream/main
} as const;

export function getChatChannelMeta(id: string) {
  if (id !== DISCORD_CHANNEL_META.id) {
    throw new Error(`Unsupported Discord channel meta lookup: ${id}`);
  }
  return DISCORD_CHANNEL_META;
}
