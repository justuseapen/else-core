// Control UI config module wires vitest behavior.
import { defineConfig } from "vitest/config";
<<<<<<< HEAD
import { resolveDefaultVitestPool } from "../vitest.shared.config.ts";
=======
import { resolveDefaultVitestPool } from "../test/vitest/vitest.shared.config.ts";
>>>>>>> upstream/main

// Node-only tests for pure logic (no Playwright/browser dependency).
export default defineConfig({
  test: {
<<<<<<< HEAD
    isolate: true,
=======
    isolate: false,
>>>>>>> upstream/main
    pool: resolveDefaultVitestPool(),
    testTimeout: 120_000,
    include: [
      "src/**/*.node.test.ts",
      "src/ui/chat/chat-responsive.browser.test.ts",
      "src/ui/views/sessions.browser.test.ts",
    ],
    environment: "node",
  },
});
