<<<<<<< HEAD
=======
// Vitest UI package config tests validate UI package test project settings.
>>>>>>> upstream/main
import { describe, expect, it } from "vitest";
import uiConfig from "../ui/vitest.config.ts";
import uiNodeConfig from "../ui/vitest.node.config.ts";

<<<<<<< HEAD
describe("ui package vitest config", () => {
  it("keeps the standalone ui package on thread workers with isolation enabled", () => {
    expect(uiConfig.test?.pool).toBe("threads");
    expect(uiConfig.test?.isolate).toBe(true);
    expect(uiConfig.test?.projects).toHaveLength(3);

    for (const project of uiConfig.test?.projects ?? []) {
      expect(project.test?.pool).toBe("threads");
      expect(project.test?.isolate).toBe(true);
      expect(project.test?.runner).toBeUndefined();
    }
  });

  it("keeps the standalone ui node config on thread workers with isolation enabled", () => {
    expect(uiNodeConfig.test?.pool).toBe("threads");
    expect(uiNodeConfig.test?.isolate).toBe(true);
    expect(uiNodeConfig.test?.runner).toBeUndefined();
=======
function requireTestConfig<T extends { test?: unknown }>(config: T): NonNullable<T["test"]> {
  if (!config.test) {
    throw new Error("expected ui package vitest test config");
  }
  return config.test as NonNullable<T["test"]>;
}

describe("ui package vitest config", () => {
  it("keeps the standalone ui package on thread workers without isolation", () => {
    const testConfig = requireTestConfig(uiConfig);

    expect(testConfig.pool).toBe("threads");
    expect(testConfig.isolate).toBe(false);
    expect(testConfig.projects).toHaveLength(3);

    for (const project of testConfig.projects) {
      const projectTestConfig = requireTestConfig(project);
      expect(projectTestConfig.pool).toBe("threads");
      expect(projectTestConfig.isolate).toBe(false);
      expect(projectTestConfig.runner).toBeUndefined();
    }
  });

  it("keeps the standalone ui node config on thread workers without isolation", () => {
    const testConfig = requireTestConfig(uiNodeConfig);

    expect(testConfig.pool).toBe("threads");
    expect(testConfig.isolate).toBe(false);
    expect(testConfig.runner).toBeUndefined();
>>>>>>> upstream/main
  });
});
