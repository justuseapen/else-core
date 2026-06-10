<<<<<<< HEAD
import { afterAll } from "vitest";
=======
// Extension test setup installs extension-specific mocks and cleanup.
import { afterAll, beforeEach, vi } from "vitest";
>>>>>>> upstream/main
import { installSharedTestSetup } from "./setup.shared.js";

const testEnv = installSharedTestSetup({ loadProfileEnv: false });

<<<<<<< HEAD
=======
beforeEach(() => {
  vi.useRealTimers();
});

>>>>>>> upstream/main
afterAll(() => {
  testEnv.cleanup();
});
