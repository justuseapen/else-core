<<<<<<< HEAD
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearRuntimeConfigSnapshot, setRuntimeConfigSnapshot } from "../config/config.js";
import { clearPluginDiscoveryCache } from "../plugins/discovery.js";
import { clearPluginManifestRegistryCache } from "../plugins/manifest-registry.js";
import {
  canLoadActivatedBundledPluginPublicSurface,
  listImportedBundledPluginFacadeIds,
  loadActivatedBundledPluginPublicSurfaceModuleSync,
  loadBundledPluginPublicSurfaceModuleSync,
  resetFacadeRuntimeStateForTest,
  tryLoadActivatedBundledPluginPublicSurfaceModuleSync,
=======
// Facade runtime tests cover installed plugin facade loading and fallback resolution.
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearRuntimeConfigSnapshot, setRuntimeConfigSnapshot } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { setBundledPluginsDirOverrideForTest } from "../plugins/bundled-dir.js";
import { createPluginActivationSource, normalizePluginsConfig } from "../plugins/config-state.js";
import {
  clearCurrentPluginMetadataSnapshot,
  setCurrentPluginMetadataSnapshot,
} from "../plugins/current-plugin-metadata-snapshot.js";
import { resolveInstalledPluginIndexPolicyHash } from "../plugins/installed-plugin-index-policy.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.types.js";
import {
  evaluateBundledPluginPublicSurfaceAccess,
  resolveBundledPluginPublicSurfaceAccess as resolveActivationCheckBundledPluginPublicSurfaceAccess,
  throwForBundledPluginPublicSurfaceAccess,
} from "./facade-activation-check.runtime.js";
import {
  testing,
  listImportedBundledPluginFacadeIds,
  loadBundledPluginPublicSurfaceModuleSync,
  resetFacadeRuntimeStateForTest,
>>>>>>> upstream/main
} from "./facade-runtime.js";
import { createPluginSdkTestHarness } from "./test-helpers.js";

const { createTempDirSync } = createPluginSdkTestHarness();
const originalBundledPluginsDir = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
<<<<<<< HEAD
const originalStateDir = process.env.OPENCLAW_STATE_DIR;
const FACADE_RUNTIME_GLOBAL = "__openclawTestLoadBundledPluginPublicSurfaceModuleSync";

function createBundledPluginDir(prefix: string, marker: string): string {
  const rootDir = createTempDirSync(prefix);
  fs.mkdirSync(path.join(rootDir, "demo"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "demo", "api.js"),
=======
const originalDisableBundledPlugins = process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
const originalStateDir = process.env.OPENCLAW_STATE_DIR;
const trustedBundledFixturesRoot = path.resolve("dist-runtime", "extensions");
const trustedBundledFixtureDirs: string[] = [];
type SnapshotPluginRecord = PluginMetadataSnapshot["manifestRegistry"]["plugins"][number];

function writeJsonFile(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function createTrustedBundledFixtureRoot(prefix: string): string {
  fs.mkdirSync(trustedBundledFixturesRoot, { recursive: true });
  const rootDir = fs.mkdtempSync(path.join(trustedBundledFixturesRoot, `.${prefix}`));
  trustedBundledFixtureDirs.push(rootDir);
  return rootDir;
}

function writePluginPackageJson(
  pluginDir: string,
  name = "demo",
  type: "commonjs" | "module" = "module",
): void {
  writeJsonFile(path.join(pluginDir, "package.json"), {
    name: `@openclaw/plugin-${name}`,
    version: "0.0.0",
    type,
  });
}

function createBundledPluginDir(prefix: string, marker: string): string {
  const rootDir = createTrustedBundledFixtureRoot(prefix);
  const pluginDir = path.join(rootDir, "demo");
  fs.mkdirSync(pluginDir, { recursive: true });
  writePluginPackageJson(pluginDir);
  fs.writeFileSync(
    path.join(pluginDir, "api.js"),
>>>>>>> upstream/main
    `export const marker = ${JSON.stringify(marker)};\n`,
    "utf8",
  );
  return rootDir;
}

<<<<<<< HEAD
function createThrowingPluginDir(prefix: string): string {
  const rootDir = createTempDirSync(prefix);
  fs.mkdirSync(path.join(rootDir, "bad"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "bad", "api.js"),
=======
function useBundledPluginDirOverrideForTest(dir: string): void {
  process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = dir;
  setBundledPluginsDirOverrideForTest(dir);
}

function createThrowingPluginDir(prefix: string): string {
  const rootDir = createTrustedBundledFixtureRoot(prefix);
  const pluginDir = path.join(rootDir, "bad");
  fs.mkdirSync(pluginDir, { recursive: true });
  writePluginPackageJson(pluginDir, "bad", "commonjs");
  fs.writeFileSync(
    path.join(pluginDir, "api.js"),
>>>>>>> upstream/main
    `throw new Error("plugin load failure");\n`,
    "utf8",
  );
  return rootDir;
}

<<<<<<< HEAD
function createCircularPluginDir(prefix: string): string {
  const rootDir = createTempDirSync(prefix);
  fs.mkdirSync(path.join(rootDir, "demo"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "facade.mjs"),
    [
      `const loadBundledPluginPublicSurfaceModuleSync = globalThis.${FACADE_RUNTIME_GLOBAL};`,
      `if (typeof loadBundledPluginPublicSurfaceModuleSync !== "function") {`,
      '  throw new Error("missing facade runtime test loader");',
      "}",
      `export const marker = loadBundledPluginPublicSurfaceModuleSync({ dirName: "demo", artifactBasename: "api.js" }).marker;`,
      "",
    ].join("\n"),
    "utf8",
  );
  fs.writeFileSync(
    path.join(rootDir, "demo", "helper.js"),
    ['import { marker } from "../facade.mjs";', "export const circularMarker = marker;", ""].join(
      "\n",
    ),
    "utf8",
  );
  fs.writeFileSync(
    path.join(rootDir, "demo", "api.js"),
    ['import "./helper.js";', 'export const marker = "circular-ok";', ""].join("\n"),
    "utf8",
  );
  return rootDir;
}

afterEach(() => {
  vi.restoreAllMocks();
  clearRuntimeConfigSnapshot();
  resetFacadeRuntimeStateForTest();
  clearPluginDiscoveryCache();
  clearPluginManifestRegistryCache();
  vi.doUnmock("../plugins/manifest-registry.js");
  delete (globalThis as typeof globalThis & Record<string, unknown>)[FACADE_RUNTIME_GLOBAL];
=======
beforeEach(() => {
  delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
  delete process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
  delete process.env.OPENCLAW_STATE_DIR;
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const dir of trustedBundledFixtureDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  clearRuntimeConfigSnapshot();
  clearCurrentPluginMetadataSnapshot();
  resetFacadeRuntimeStateForTest();
  setBundledPluginsDirOverrideForTest(undefined);
  vi.doUnmock("../plugins/manifest-registry.js");
>>>>>>> upstream/main
  if (originalBundledPluginsDir === undefined) {
    delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
  } else {
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = originalBundledPluginsDir;
  }
<<<<<<< HEAD
=======
  if (originalDisableBundledPlugins === undefined) {
    delete process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
  } else {
    process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = originalDisableBundledPlugins;
  }
>>>>>>> upstream/main
  if (originalStateDir === undefined) {
    delete process.env.OPENCLAW_STATE_DIR;
  } else {
    process.env.OPENCLAW_STATE_DIR = originalStateDir;
  }
});

describe("plugin-sdk facade runtime", () => {
<<<<<<< HEAD
  it("honors bundled plugin dir overrides outside the package root", () => {
    const overrideA = createBundledPluginDir("openclaw-facade-runtime-a-", "override-a");
    const overrideB = createBundledPluginDir("openclaw-facade-runtime-b-", "override-b");

    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = overrideA;
    const fromA = loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
    });
    expect(fromA.marker).toBe("override-a");

    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = overrideB;
    const fromB = loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
    });
    expect(fromB.marker).toBe("override-b");
=======
  it("honors trusted bundled plugin dir overrides", () => {
    const overrideA = createBundledPluginDir("openclaw-facade-runtime-a-", "override-a");
    const overrideB = createBundledPluginDir("openclaw-facade-runtime-b-", "override-b");

    useBundledPluginDirOverrideForTest(overrideA);
    const fromA = testing.resolveFacadeModuleLocation({
      dirName: "demo",
      artifactBasename: "api.js",
    });
    expect(fromA).toEqual({
      modulePath: path.join(overrideA, "demo", "api.js"),
      boundaryRoot: overrideA,
    });

    useBundledPluginDirOverrideForTest(overrideB);
    const fromB = testing.resolveFacadeModuleLocation({
      dirName: "demo",
      artifactBasename: "api.js",
    });
    expect(fromB).toEqual({
      modulePath: path.join(overrideB, "demo", "api.js"),
      boundaryRoot: overrideB,
    });
  });

  it("falls back to package source surfaces when an override dir is partial", () => {
    const overrideDir = createTrustedBundledFixtureRoot("openclaw-facade-runtime-empty-");
    useBundledPluginDirOverrideForTest(overrideDir);

    const resolved = testing.resolveFacadeModuleLocation({
      dirName: "browser",
      artifactBasename: "browser-maintenance.js",
    });

    expect(resolved?.boundaryRoot).not.toBe(overrideDir);
    expect(resolved?.modulePath).toMatch(
      /(?:^|[\\/])(?:extensions|dist-runtime[\\/]extensions)[\\/]browser[\\/]browser-maintenance\.(?:ts|js)$/u,
    );
  });

  it("does not fall back to package source surfaces when bundled plugins are disabled", () => {
    process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = "1";
    delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
    testing.setFacadeActivationCheckRuntimeForTest({
      resolveRegistryPluginModuleLocation: () => null,
    } as never);

    expect(
      testing.resolveFacadeModuleLocation({
        dirName: "browser",
        artifactBasename: "browser-maintenance.js",
      }),
    ).toBeNull();
>>>>>>> upstream/main
  });

  it("returns the same object identity on repeated calls (sentinel consistency)", () => {
    const dir = createBundledPluginDir("openclaw-facade-identity-", "identity-check");
<<<<<<< HEAD
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = dir;

    const first = loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
    });
    const second = loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
=======
    useBundledPluginDirOverrideForTest(dir);
    const location = {
      modulePath: path.join(dir, "demo", "api.js"),
      boundaryRoot: dir,
    };
    const loader = vi.fn(() => ({ marker: "identity-check" }));

    const first = testing.loadFacadeModuleAtLocationSync<{ marker: string }>({
      location,
      trackedPluginId: "demo",
      loadModule: loader,
    });
    const second = testing.loadFacadeModuleAtLocationSync<{ marker: string }>({
      location,
      trackedPluginId: "demo",
      loadModule: loader,
>>>>>>> upstream/main
    });
    expect(first).toBe(second);
    expect(first.marker).toBe("identity-check");
    expect(listImportedBundledPluginFacadeIds()).toEqual(["demo"]);
<<<<<<< HEAD
  });

  it("breaks circular facade re-entry during module evaluation", () => {
    const dir = createCircularPluginDir("openclaw-facade-circular-");
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = dir;
    (globalThis as typeof globalThis & Record<string, unknown>)[FACADE_RUNTIME_GLOBAL] =
      loadBundledPluginPublicSurfaceModuleSync;

    const loaded = loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
    });

    expect(loaded.marker).toBe("circular-ok");
  });

  it("back-fills the sentinel before post-load facade tracking re-enters", async () => {
    const dir = createBundledPluginDir("openclaw-facade-post-load-", "post-load-ok");
    const reentryMarkers: Array<string | undefined> = [];

    vi.resetModules();
    vi.doMock("../plugins/manifest-registry.js", async (importOriginal) => {
      const actual = await importOriginal<typeof import("../plugins/manifest-registry.js")>();
      return {
        ...actual,
        loadPluginManifestRegistry: vi.fn(() => {
          const load = (
            globalThis as typeof globalThis & {
              [FACADE_RUNTIME_GLOBAL]?: typeof loadBundledPluginPublicSurfaceModuleSync;
            }
          )[FACADE_RUNTIME_GLOBAL];
          if (typeof load !== "function") {
            throw new Error("missing facade runtime test loader");
          }
          const reentered = load<{ marker?: string }>({
            dirName: "demo",
            artifactBasename: "api.js",
          });
          reentryMarkers.push(reentered.marker);
          return {
            plugins: [
              {
                id: "demo",
                rootDir: path.join(dir, "demo"),
                origin: "bundled",
              },
            ],
          };
        }),
      };
    });

    const facadeRuntime = await import("./facade-runtime.js");
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = dir;
    (globalThis as typeof globalThis & Record<string, unknown>)[FACADE_RUNTIME_GLOBAL] =
      facadeRuntime.loadBundledPluginPublicSurfaceModuleSync;

    const loaded = facadeRuntime.loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
      dirName: "demo",
      artifactBasename: "api.js",
=======
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("breaks circular facade re-entry during module evaluation", () => {
    const dir = createBundledPluginDir("openclaw-facade-circular-", "circular-ok");
    const location = {
      modulePath: path.join(dir, "demo", "api.js"),
      boundaryRoot: dir,
    };
    let reentered: { marker?: string } | undefined;
    const loader = vi.fn(() => {
      reentered = testing.loadFacadeModuleAtLocationSync<{ marker?: string }>({
        location,
        trackedPluginId: "demo",
        loadModule: loader,
      });
      return { marker: "circular-ok" };
    });

    const loaded = testing.loadFacadeModuleAtLocationSync<{ marker: string }>({
      location,
      trackedPluginId: "demo",
      loadModule: loader,
    });

    expect(loaded.marker).toBe("circular-ok");
    expect(reentered).toBe(loaded);
    expect(reentered?.marker).toBe("circular-ok");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("back-fills the sentinel before post-load facade tracking re-enters", () => {
    const dir = createBundledPluginDir("openclaw-facade-post-load-", "post-load-ok");
    const location = {
      modulePath: path.join(dir, "demo", "api.js"),
      boundaryRoot: dir,
    };
    const reentryMarkers: Array<string | undefined> = [];
    const loader = vi.fn(() => ({ marker: "post-load-ok" }));

    const loaded = testing.loadFacadeModuleAtLocationSync<{ marker: string }>({
      location,
      trackedPluginId: () => {
        const reentered = testing.loadFacadeModuleAtLocationSync<{ marker?: string }>({
          location,
          trackedPluginId: "demo",
          loadModule: loader,
        });
        reentryMarkers.push(reentered.marker);
        return "demo";
      },
      loadModule: loader,
>>>>>>> upstream/main
    });

    expect(loaded.marker).toBe("post-load-ok");
    expect(reentryMarkers.length).toBeGreaterThan(0);
<<<<<<< HEAD
    expect(reentryMarkers.every((marker) => marker === "post-load-ok")).toBe(true);
    expect(facadeRuntime.listImportedBundledPluginFacadeIds()).toEqual(["demo"]);
    facadeRuntime.resetFacadeRuntimeStateForTest();
    vi.doUnmock("../plugins/manifest-registry.js");
    vi.resetModules();
  });
  it("clears the cache on load failure so retries re-execute", () => {
    const dir = createThrowingPluginDir("openclaw-facade-throw-");
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = dir;
=======
    const unexpectedReentryMarkers = reentryMarkers.filter((marker) => marker !== "post-load-ok");
    expect(unexpectedReentryMarkers).toStrictEqual([]);
    expect(listImportedBundledPluginFacadeIds()).toEqual(["demo"]);
    expect(loader).toHaveBeenCalledTimes(1);
  });
  it("clears the cache on load failure so retries re-execute", () => {
    const dir = createThrowingPluginDir("openclaw-facade-throw-");
    useBundledPluginDirOverrideForTest(dir);
>>>>>>> upstream/main

    expect(() =>
      loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
        dirName: "bad",
        artifactBasename: "api.js",
      }),
    ).toThrow("plugin load failure");

<<<<<<< HEAD
    expect(listImportedBundledPluginFacadeIds()).toEqual([]);
=======
    expect(listImportedBundledPluginFacadeIds()).toStrictEqual([]);
>>>>>>> upstream/main

    // A second call must also throw (not return a stale empty sentinel).
    expect(() =>
      loadBundledPluginPublicSurfaceModuleSync<{ marker: string }>({
        dirName: "bad",
        artifactBasename: "api.js",
      }),
    ).toThrow("plugin load failure");
  });

  it("blocks runtime-api facade loads for bundled plugins that are not activated", () => {
<<<<<<< HEAD
    setRuntimeConfigSnapshot({});

    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(false);
    expect(() =>
      loadActivatedBundledPluginPublicSurfaceModuleSync({
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      }),
    ).toThrow(/Bundled plugin public surface access blocked/);
    expect(
      tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      }),
    ).toBeNull();
  });

  it("allows runtime-api facade loads when the bundled plugin is explicitly enabled", () => {
    setRuntimeConfigSnapshot({
=======
    const access = evaluateBundledPluginPublicSurfaceAccess({
      params: {
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      },
      manifestRecord: {
        id: "discord",
        origin: "bundled",
        enabledByDefault: false,
        rootDir: "/tmp/discord",
        channels: ["discord"],
      },
      config: {},
      normalizedPluginsConfig: normalizePluginsConfig(),
      activationSource: createPluginActivationSource({ config: {} }),
      autoEnabledReasons: {},
    });

    expect(access.allowed).toBe(false);
    expect(access.pluginId).toBe("discord");
    expect(access.reason).toMatch(/disabled|not enabled|not active/i);
    expect(() =>
      throwForBundledPluginPublicSurfaceAccess({
        access,
        request: {
          dirName: "discord",
          artifactBasename: "runtime-api.js",
        },
      }),
    ).toThrow(/Bundled plugin public surface access blocked/);
    expect(access.allowed).toBe(false);
  });

  it("allows runtime-api facade loads when the bundled plugin is explicitly enabled", () => {
    const dir = createTempDirSync("openclaw-facade-runtime-enabled-");
    fs.mkdirSync(path.join(dir, "discord"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "discord", "runtime-api.js"),
      'export const marker = "runtime-api-enabled";\n',
      "utf8",
    );
    const config = {
>>>>>>> upstream/main
      plugins: {
        entries: {
          discord: {
            enabled: true,
          },
        },
      },
<<<<<<< HEAD
    });

    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
  });

  it("resolves a globally-installed plugin whose rootDir basename matches the dirName", () => {
    const emptyBundled = createTempDirSync("openclaw-facade-empty-bundled-");

    const stateDir = createTempDirSync("openclaw-facade-state-");
    const lineDir = path.join(stateDir, "extensions", "line");
=======
    } as const;
    const access = evaluateBundledPluginPublicSurfaceAccess({
      params: {
        dirName: "discord",
        artifactBasename: "runtime-api.js",
      },
      manifestRecord: {
        id: "discord",
        origin: "bundled",
        enabledByDefault: false,
        rootDir: "/tmp/discord",
        channels: ["discord"],
      },
      config,
      normalizedPluginsConfig: normalizePluginsConfig(config.plugins),
      activationSource: createPluginActivationSource({ config }),
      autoEnabledReasons: {},
    });
    const loader = vi.fn(() => ({ marker: "runtime-api-enabled" }));
    const location = {
      modulePath: path.join(dir, "discord", "runtime-api.js"),
      boundaryRoot: dir,
    };

    expect(access.allowed).toBe(true);
    const loaded = testing.loadFacadeModuleAtLocationSync<{ marker: string }>({
      location,
      trackedPluginId: "discord",
      loadModule: loader,
    });
    expect(loaded.marker).toBe("runtime-api-enabled");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("resolves a globally-installed plugin whose rootDir basename matches the dirName", () => {
    const lineDir = createTempDirSync("openclaw-facade-global-line-");
>>>>>>> upstream/main
    fs.mkdirSync(lineDir, { recursive: true });
    fs.writeFileSync(
      path.join(lineDir, "runtime-api.js"),
      'export const marker = "global-line";\n',
      "utf8",
    );
    fs.writeFileSync(
      path.join(lineDir, "package.json"),
      JSON.stringify({
        name: "@openclaw/line",
        version: "0.0.0",
        openclaw: {
          extensions: ["./runtime-api.js"],
          channel: { id: "line" },
        },
      }),
      "utf8",
    );
    fs.writeFileSync(
      path.join(lineDir, "openclaw.plugin.json"),
      JSON.stringify({
        id: "line",
        channels: ["line"],
        configSchema: { type: "object", additionalProperties: false, properties: {} },
      }),
      "utf8",
    );

<<<<<<< HEAD
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = emptyBundled;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    clearPluginDiscoveryCache();
    clearPluginManifestRegistryCache();
    resetFacadeRuntimeStateForTest();

    setRuntimeConfigSnapshot({
      channels: {
        line: {
          enabled: true,
        },
      },
    });

    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "line",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
  });

  it("resolves a globally-installed plugin with an encoded scoped rootDir basename", () => {
    const emptyBundled = createTempDirSync("openclaw-facade-empty-bundled-");

    const stateDir = createTempDirSync("openclaw-facade-state-");
    const encodedDir = path.join(stateDir, "extensions", "@openclaw+line");
=======
    expect(
      testing.resolveRegistryPluginModuleLocationFromRegistry({
        registry: [
          {
            id: "line",
            rootDir: lineDir,
            channels: ["line"],
          },
        ],
        dirName: "line",
        artifactBasename: "runtime-api.js",
      }),
    ).toEqual({
      modulePath: path.join(lineDir, "runtime-api.js"),
      boundaryRoot: lineDir,
    });
  });

  it("resolves a globally-installed plugin public surface from package dist", () => {
    const lineDir = createTempDirSync("openclaw-facade-global-line-dist-");
    fs.mkdirSync(path.join(lineDir, "dist"), { recursive: true });
    fs.writeFileSync(
      path.join(lineDir, "dist", "runtime-api.js"),
      'export const marker = "global-line-dist";\n',
      "utf8",
    );
    fs.writeFileSync(
      path.join(lineDir, "package.json"),
      JSON.stringify({
        name: "@openclaw/line",
        version: "0.0.0",
        type: "module",
        openclaw: {
          extensions: ["./index.ts"],
          runtimeExtensions: ["./dist/index.js"],
          channel: { id: "line" },
        },
      }),
      "utf8",
    );
    fs.writeFileSync(
      path.join(lineDir, "openclaw.plugin.json"),
      JSON.stringify({
        id: "line",
        channels: ["line"],
        configSchema: { type: "object", additionalProperties: false, properties: {} },
      }),
      "utf8",
    );

    expect(
      testing.resolveRegistryPluginModuleLocationFromRegistry({
        registry: [
          {
            id: "line",
            rootDir: lineDir,
            channels: ["line"],
          },
        ],
        dirName: "line",
        artifactBasename: "runtime-api.js",
      }),
    ).toEqual({
      modulePath: path.join(lineDir, "dist", "runtime-api.js"),
      boundaryRoot: lineDir,
    });
  });

  it("resolves a globally-installed plugin with an encoded scoped rootDir basename", () => {
    const encodedDir = createTempDirSync("openclaw-facade-encoded-line-");
>>>>>>> upstream/main
    fs.mkdirSync(encodedDir, { recursive: true });
    fs.writeFileSync(
      path.join(encodedDir, "runtime-api.js"),
      'export const marker = "encoded-global-line";\n',
      "utf8",
    );
    fs.writeFileSync(
      path.join(encodedDir, "package.json"),
      JSON.stringify({
        name: "@openclaw/line",
        version: "0.0.0",
        openclaw: {
          extensions: ["./runtime-api.js"],
          channel: { id: "line" },
        },
      }),
      "utf8",
    );
    fs.writeFileSync(
      path.join(encodedDir, "openclaw.plugin.json"),
      JSON.stringify({
        id: "line",
        channels: ["line"],
        configSchema: { type: "object", additionalProperties: false, properties: {} },
      }),
      "utf8",
    );

<<<<<<< HEAD
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = emptyBundled;
    process.env.OPENCLAW_STATE_DIR = stateDir;

    clearPluginDiscoveryCache();
    clearPluginManifestRegistryCache();
    resetFacadeRuntimeStateForTest();

    setRuntimeConfigSnapshot({
      channels: {
        line: {
          enabled: true,
        },
      },
    });

    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "line",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
=======
    expect(
      testing.resolveRegistryPluginModuleLocationFromRegistry({
        registry: [
          {
            id: "line",
            rootDir: encodedDir,
            channels: ["line"],
          },
        ],
        dirName: "line",
        artifactBasename: "runtime-api.js",
      }),
    ).toEqual({
      modulePath: path.join(encodedDir, "runtime-api.js"),
      boundaryRoot: encodedDir,
    });
>>>>>>> upstream/main
  });

  it("keeps shared runtime-core facades available without plugin activation", () => {
    setRuntimeConfigSnapshot({});

<<<<<<< HEAD
    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "speech-core",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "image-generation-core",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
    expect(
      canLoadActivatedBundledPluginPublicSurface({
        dirName: "media-understanding-core",
        artifactBasename: "runtime-api.js",
      }),
    ).toBe(true);
=======
    for (const dirName of ["speech-core", "image-generation-core", "media-understanding-core"]) {
      expect(
        resolveActivationCheckBundledPluginPublicSurfaceAccess({
          dirName,
          artifactBasename: "runtime-api.js",
          location: null,
          sourceExtensionsRoot: "",
          resolutionKey: `runtime-core:${dirName}`,
        }),
      ).toEqual({
        allowed: true,
        pluginId: dirName,
      });
    }
  });

  it("prefers the source runtime snapshot for facade activation checks", () => {
    const dir = createTempDirSync("openclaw-facade-source-snapshot-");
    fs.mkdirSync(path.join(dir, "demo"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "demo", "runtime-api.js"),
      'export const marker = "source-snapshot";\n',
      "utf8",
    );
    fs.writeFileSync(
      path.join(dir, "demo", "openclaw.plugin.json"),
      JSON.stringify({
        id: "demo",
      }),
      "utf8",
    );
    useBundledPluginDirOverrideForTest(dir);
    setRuntimeConfigSnapshot(
      {
        plugins: {},
      },
      {
        plugins: {
          entries: {
            demo: {
              enabled: true,
            },
          },
        },
      },
    );

    expect(
      resolveActivationCheckBundledPluginPublicSurfaceAccess({
        dirName: "demo",
        artifactBasename: "runtime-api.js",
        location: {
          modulePath: path.join(dir, "demo", "runtime-api.js"),
          boundaryRoot: dir,
        },
        sourceExtensionsRoot: dir,
        resolutionKey: "source-snapshot-demo",
      }),
    ).toEqual({
      allowed: true,
      pluginId: "demo",
    });
  });

  it("validates current snapshot against facade boundary config and ignores on mismatch", () => {
    const dir = createTempDirSync("openclaw-facade-snapshot-validate-");
    fs.mkdirSync(path.join(dir, "demo"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "demo", "runtime-api.js"),
      'export const marker = "snapshot-validate";\n',
      "utf8",
    );
    // Do NOT write openclaw.plugin.json on disk to force fallback to registry scan
    useBundledPluginDirOverrideForTest(dir);

    function createTestSnapshot(
      params: {
        config?: OpenClawConfig;
        plugins?: SnapshotPluginRecord[];
      } = {},
    ): PluginMetadataSnapshot {
      const policyHash = resolveInstalledPluginIndexPolicyHash(params.config);
      return {
        policyHash,
        index: {
          version: 1,
          hostContractVersion: "test",
          compatRegistryVersion: "test",
          migrationVersion: 1,
          policyHash,
          generatedAtMs: 1,
          installRecords: {},
          plugins: [],
          diagnostics: [],
        },
        registryDiagnostics: [],
        manifestRegistry: { plugins: params.plugins ?? [], diagnostics: [] },
        plugins: [],
        diagnostics: [],
        byPluginId: new Map(),
        normalizePluginId: (pluginId) => pluginId,
        owners: {
          channels: new Map(),
          channelConfigs: new Map(),
          providers: new Map(),
          modelCatalogProviders: new Map(),
          cliBackends: new Map(),
          setupProviders: new Map(),
          commandAliases: new Map(),
          contracts: new Map(),
        },
        metrics: {
          registrySnapshotMs: 0,
          manifestRegistryMs: 0,
          ownerMapsMs: 0,
          totalMs: 0,
          indexPluginCount: 0,
          manifestPluginCount: 0,
        },
      };
    }

    const configWithPaths = {
      plugins: {
        load: { paths: ["/path/one"] },
        entries: {
          "demo-snapshot": { enabled: true },
          demo: { enabled: true },
        },
      },
    } satisfies OpenClawConfig;
    const matchedSnapshot = createTestSnapshot({
      config: configWithPaths,
      plugins: [
        {
          id: "demo-snapshot",
          rootDir: path.join(dir, "demo"),
          source: path.join(dir, "demo", "runtime-api.js"),
          manifestPath: path.join(dir, "demo", "openclaw.plugin.json"),
          channels: ["demo"],
          providers: [],
          cliBackends: [],
          skills: [],
          hooks: [],
          origin: "bundled" as const,
        },
      ],
    });

    setCurrentPluginMetadataSnapshot(matchedSnapshot, { config: configWithPaths });

    setRuntimeConfigSnapshot(
      {
        plugins: {
          load: { paths: ["/path/two"] },
          entries: {
            "demo-snapshot": { enabled: true },
            demo: { enabled: true },
          },
        },
      },
      {
        plugins: {
          load: { paths: ["/path/two"] },
          entries: {
            "demo-snapshot": { enabled: true },
            demo: { enabled: true },
          },
        },
      },
    );

    expect(
      resolveActivationCheckBundledPluginPublicSurfaceAccess({
        dirName: "demo",
        artifactBasename: "runtime-api.js",
        location: null,
        sourceExtensionsRoot: dir,
        resolutionKey: "snapshot-validate-demo",
      }),
    ).toEqual({
      allowed: false,
      reason: "no bundled plugin manifest found for demo",
    });

    setRuntimeConfigSnapshot(configWithPaths, configWithPaths);

    expect(
      resolveActivationCheckBundledPluginPublicSurfaceAccess({
        dirName: "demo",
        artifactBasename: "runtime-api.js",
        location: null,
        sourceExtensionsRoot: dir,
        resolutionKey: "snapshot-validate-demo",
      }),
    ).toEqual({
      allowed: true,
      pluginId: "demo-snapshot",
    });
>>>>>>> upstream/main
  });
});
