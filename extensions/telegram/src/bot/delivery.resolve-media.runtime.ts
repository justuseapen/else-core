<<<<<<< HEAD
import { logVerbose, retryAsync, warn } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/ssrf-runtime";
import { resolveTelegramApiBase, shouldRetryTelegramTransportFallback } from "../fetch.js";
import { fetchRemoteMedia, MediaFetchError, saveMediaBuffer } from "../telegram-media.runtime.js";

export {
  fetchRemoteMedia,
=======
// Telegram plugin module implements delivery.resolve media behavior.
import { logVerbose, retryAsync, warn } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/ssrf-runtime";
import { resolveTelegramApiBase, shouldRetryTelegramTransportFallback } from "../fetch.js";
import {
  readRemoteMediaBuffer,
  MediaFetchError,
  saveMediaBuffer,
  saveRemoteMedia,
} from "../telegram-media.runtime.js";

export {
  readRemoteMediaBuffer,
>>>>>>> upstream/main
  formatErrorMessage,
  logVerbose,
  MediaFetchError,
  resolveTelegramApiBase,
  retryAsync,
  saveMediaBuffer,
<<<<<<< HEAD
=======
  saveRemoteMedia,
>>>>>>> upstream/main
  shouldRetryTelegramTransportFallback,
  warn,
};
