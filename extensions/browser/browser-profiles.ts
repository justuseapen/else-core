<<<<<<< HEAD
export {
  DEFAULT_AI_SNAPSHOT_MAX_CHARS,
=======
/**
 * Browser profile API barrel. It exposes browser profile defaults and config
 * resolution helpers for setup and runtime paths.
 */
export {
  DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
>>>>>>> upstream/main
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME,
  DEFAULT_BROWSER_EVALUATE_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_COLOR,
  DEFAULT_OPENCLAW_BROWSER_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
  DEFAULT_UPLOAD_DIR,
  resolveBrowserConfig,
  resolveProfile,
  type ResolvedBrowserConfig,
  type ResolvedBrowserProfile,
<<<<<<< HEAD
=======
  type ResolvedBrowserTabCleanupConfig,
>>>>>>> upstream/main
} from "./src/browser/config.js";
