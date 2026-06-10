<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
// Tests browser lifecycle cleanup after CLI and runtime shutdown paths.
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "./config/types.openclaw.js";
>>>>>>> upstream/main

const closeTrackedBrowserTabsForSessions = vi.hoisted(() => vi.fn(async () => 0));

vi.mock("./plugin-sdk/browser-maintenance.js", () => ({
  closeTrackedBrowserTabsForSessions,
}));

<<<<<<< HEAD
=======
const { cleanupBrowserSessionsForLifecycleEnd } = await import("./browser-lifecycle-cleanup.js");

>>>>>>> upstream/main
describe("cleanupBrowserSessionsForLifecycleEnd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes session keys before closing browser sessions", async () => {
<<<<<<< HEAD
    const { cleanupBrowserSessionsForLifecycleEnd } =
      await import("./browser-lifecycle-cleanup.js");
=======
>>>>>>> upstream/main
    const onWarn = vi.fn();

    await expect(
      cleanupBrowserSessionsForLifecycleEnd({
        sessionKeys: ["", "  session-a  ", "session-a", "session-b"],
        onWarn,
      }),
    ).resolves.toBeUndefined();

    expect(closeTrackedBrowserTabsForSessions).toHaveBeenCalledWith({
      sessionKeys: ["session-a", "session-b"],
      onWarn,
    });
  });

<<<<<<< HEAD
  it("swallows browser cleanup failures", async () => {
    const { cleanupBrowserSessionsForLifecycleEnd } =
      await import("./browser-lifecycle-cleanup.js");
=======
  it("skips cleanup when root browser support is disabled", async () => {
    await expect(
      cleanupBrowserSessionsForLifecycleEnd({
        cfg: { browser: { enabled: false } } as OpenClawConfig,
        sessionKeys: ["session-a"],
      }),
    ).resolves.toBeUndefined();

    expect(closeTrackedBrowserTabsForSessions).not.toHaveBeenCalled();
  });

  it("skips cleanup when the browser plugin entry is disabled", async () => {
    await expect(
      cleanupBrowserSessionsForLifecycleEnd({
        cfg: { plugins: { entries: { browser: { enabled: false } } } } as OpenClawConfig,
        sessionKeys: ["session-a"],
      }),
    ).resolves.toBeUndefined();

    expect(closeTrackedBrowserTabsForSessions).not.toHaveBeenCalled();
  });

  it("swallows browser cleanup failures", async () => {
>>>>>>> upstream/main
    const onError = vi.fn();
    const error = new Error("cleanup failed");
    closeTrackedBrowserTabsForSessions.mockRejectedValueOnce(error);

    await expect(
      cleanupBrowserSessionsForLifecycleEnd({
        sessionKeys: ["session-a"],
        onError,
      }),
    ).resolves.toBeUndefined();

    expect(onError).toHaveBeenCalledWith(error);
  });
});
