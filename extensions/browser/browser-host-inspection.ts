<<<<<<< HEAD
=======
/**
 * Browser host-inspection API barrel. It exposes Chrome executable discovery
 * and version parsing helpers.
 */
>>>>>>> upstream/main
export type { BrowserExecutable } from "./src/browser/chrome.executables.js";
export {
  parseBrowserMajorVersion,
  readBrowserVersion,
  resolveGoogleChromeExecutableForPlatform,
} from "./src/browser/chrome.executables.js";
