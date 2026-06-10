<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { BUNDLED_PLUGIN_LIVE_TEST_GLOB } from "../../vitest.bundled-plugin-paths.ts";
import liveConfig from "../../vitest.live.config.ts";
=======
// Covers live Vitest config shape.
import { describe, expect, it } from "vitest";
import {
  normalizeConfigPath,
  normalizeConfigPaths,
} from "../../test/helpers/vitest-config-paths.js";
import { BUNDLED_PLUGIN_LIVE_TEST_GLOB } from "../../test/vitest/vitest.bundled-plugin-paths.ts";
import liveConfig from "../../test/vitest/vitest.live.config.ts";
>>>>>>> upstream/main

describe("live vitest config", () => {
  it("runs as a standalone config instead of inheriting unit projects", () => {
    expect(liveConfig.test?.projects).toBeUndefined();
  });

  it("keeps live tests on thread workers with the non-isolated runner", () => {
    expect(liveConfig.test?.pool).toBe("threads");
    expect(liveConfig.test?.isolate).toBe(false);
<<<<<<< HEAD
    expect(liveConfig.test?.runner).toBe("./test/non-isolated-runner.ts");
=======
    expect(normalizeConfigPath(liveConfig.test?.runner)).toBe("test/non-isolated-runner.ts");
>>>>>>> upstream/main
  });

  it("includes live test globs and runtime setup", () => {
    expect(liveConfig.test?.include).toEqual([
      "src/**/*.live.test.ts",
<<<<<<< HEAD
      BUNDLED_PLUGIN_LIVE_TEST_GLOB,
    ]);
    expect(liveConfig.test?.setupFiles).toContain("test/setup-openclaw-runtime.ts");
=======
      "test/**/*.live.test.ts",
      BUNDLED_PLUGIN_LIVE_TEST_GLOB,
    ]);
    expect(normalizeConfigPaths(liveConfig.test?.setupFiles)).toEqual([
      "test/setup.ts",
      "test/setup-openclaw-runtime.ts",
    ]);
>>>>>>> upstream/main
  });
});
