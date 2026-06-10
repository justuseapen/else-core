<<<<<<< HEAD
=======
// Coordinates browser process cleanup for CLI-managed runtime sessions.
import type { OpenClawConfig } from "./config/types.openclaw.js";
>>>>>>> upstream/main
import { runBestEffortCleanup } from "./infra/non-fatal-cleanup.js";
import { closeTrackedBrowserTabsForSessions } from "./plugin-sdk/browser-maintenance.js";

function normalizeSessionKeys(sessionKeys: string[]): string[] {
  const keys = new Set<string>();
  for (const sessionKey of sessionKeys) {
    const normalized = sessionKey.trim();
    if (normalized) {
      keys.add(normalized);
    }
  }
  return [...keys];
}

<<<<<<< HEAD
export async function cleanupBrowserSessionsForLifecycleEnd(params: {
=======
function isBrowserCleanupDisabled(cfg: OpenClawConfig | undefined): boolean {
  return cfg?.browser?.enabled === false || cfg?.plugins?.entries?.browser?.enabled === false;
}

export async function cleanupBrowserSessionsForLifecycleEnd(params: {
  cfg?: OpenClawConfig;
>>>>>>> upstream/main
  sessionKeys: string[];
  onWarn?: (message: string) => void;
  onError?: (error: unknown) => void;
}): Promise<void> {
<<<<<<< HEAD
=======
  if (isBrowserCleanupDisabled(params.cfg)) {
    return;
  }
>>>>>>> upstream/main
  const sessionKeys = normalizeSessionKeys(params.sessionKeys);
  if (sessionKeys.length === 0) {
    return;
  }
  await runBestEffortCleanup({
    cleanup: async () => {
      await closeTrackedBrowserTabsForSessions({
        sessionKeys,
        onWarn: params.onWarn,
      });
    },
    onError: params.onError,
  });
}
