<<<<<<< HEAD
export { loadConfig, resolveMarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
=======
// Telegram plugin module implements send behavior.
export { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
export { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
export type { PollInput, MediaKind } from "openclaw/plugin-sdk/media-runtime";
export {
  buildOutboundMediaLoadOptions,
  getImageMetadata,
  isGifMedia,
  kindFromMime,
  normalizePollInput,
<<<<<<< HEAD
=======
  probeVideoDimensions,
>>>>>>> upstream/main
} from "openclaw/plugin-sdk/media-runtime";
export { loadWebMedia } from "openclaw/plugin-sdk/web-media";
