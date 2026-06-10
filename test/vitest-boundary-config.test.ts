<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import {
  createBoundaryVitestConfig,
  loadBoundaryIncludePatternsFromEnv,
} from "../vitest.boundary.config.ts";
import { boundaryTestFiles } from "../vitest.unit-paths.mjs";

describe("loadBoundaryIncludePatternsFromEnv", () => {
  it("returns null when no include file is configured", () => {
    expect(loadBoundaryIncludePatternsFromEnv({})).toBeNull();
  });
});
=======
// Vitest boundary config tests validate boundary test configuration.
import { describe, expect, it } from "vitest";
import { normalizeConfigPath, normalizeConfigPaths } from "./helpers/vitest-config-paths.js";
import { createBoundaryVitestConfig } from "./vitest/vitest.boundary.config.ts";
import { boundaryTestFiles } from "./vitest/vitest.unit-paths.mjs";

function requireTestConfig(config: ReturnType<typeof createBoundaryVitestConfig>) {
  if (!config.test) {
    throw new Error("expected boundary vitest test config");
  }
  return config.test;
}
>>>>>>> upstream/main

describe("boundary vitest config", () => {
  it("keeps boundary suites on the non-isolated runner with shared test bootstrap", () => {
    const config = createBoundaryVitestConfig({});
<<<<<<< HEAD

    expect(config.test?.isolate).toBe(false);
    expect(config.test?.runner).toBe("./test/non-isolated-runner.ts");
    expect(config.test?.include).toEqual(boundaryTestFiles);
    expect(config.test?.setupFiles).toEqual(["test/setup.ts"]);
=======
    const testConfig = requireTestConfig(config);

    expect(testConfig.isolate).toBe(false);
    expect(normalizeConfigPath(testConfig.runner)).toBe("test/non-isolated-runner.ts");
    expect(testConfig.include).toEqual(boundaryTestFiles);
    expect(normalizeConfigPaths(testConfig.setupFiles)).toEqual(["test/setup.ts"]);
>>>>>>> upstream/main
  });

  it("narrows boundary includes to matching CLI file filters", () => {
    const config = createBoundaryVitestConfig({}, [
      "node",
      "vitest",
      "run",
      "src/infra/openclaw-root.test.ts",
    ]);
<<<<<<< HEAD

    expect(config.test?.include).toEqual(["src/infra/openclaw-root.test.ts"]);
    expect(config.test?.passWithNoTests).toBe(true);
=======
    const testConfig = requireTestConfig(config);

    expect(testConfig.include).toEqual(["src/infra/openclaw-root.test.ts"]);
    expect(testConfig.passWithNoTests).toBeUndefined();
  });

  it("lets unrelated root Vitest projects skip when CLI filters match no boundary files", () => {
    const config = createBoundaryVitestConfig({}, [
      "node",
      "vitest",
      "run",
      "src/config/channel-configured.test.ts",
    ]);
    const testConfig = requireTestConfig(config);

    expect(testConfig.include).toEqual([]);
    expect(testConfig.passWithNoTests).toBe(true);
>>>>>>> upstream/main
  });
});
