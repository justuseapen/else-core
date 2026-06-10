<<<<<<< HEAD
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  isJavaScriptModulePath,
  resolveCompiledBundledModulePath,
  resolveExistingPluginModulePath,
  resolvePluginModuleCandidates,
} from "./module-loader.js";

const tempDirs: string[] = [];
=======
// Module loader tests cover channel plugin module resolution and import failure handling.
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { importFreshModule } from "openclaw/plugin-sdk/test-fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isJavaScriptModulePath } from "../../plugins/native-module-require.js";
import type { PluginModuleLoaderFactory } from "../../plugins/plugin-module-loader-cache.js";
import { resolveExistingPluginModulePath } from "./module-loader.js";

const tempDirs: string[] = [];
const testRequire = createRequire(import.meta.url);
>>>>>>> upstream/main

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
<<<<<<< HEAD
=======
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock("jiti");
>>>>>>> upstream/main
});

function createTempDir(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-channel-module-loader-"));
  tempDirs.push(tempDir);
  return tempDir;
}

<<<<<<< HEAD
describe("channel plugin module loader helpers", () => {
  it("prefers compiled bundled dist output when present", () => {
    const rootDir = createTempDir();
    const runtimePath = path.join(rootDir, "dist-runtime", "entry.js");
    const compiledPath = path.join(rootDir, "dist", "entry.js");
    fs.mkdirSync(path.dirname(compiledPath), { recursive: true });
    fs.writeFileSync(compiledPath, "export {};\n", "utf8");

    expect(resolveCompiledBundledModulePath(runtimePath)).toBe(compiledPath);
  });

  it("keeps dist-runtime path when compiled bundled output is absent", () => {
    const rootDir = createTempDir();
    const runtimePath = path.join(rootDir, "dist-runtime", "entry.js");

    expect(resolveCompiledBundledModulePath(runtimePath)).toBe(runtimePath);
  });

  it("resolves plugin module candidates and picks the first existing extension", () => {
    const rootDir = createTempDir();
    const expectedPath = path.join(rootDir, "src", "checker.mjs");
    fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
    fs.writeFileSync(expectedPath, "export const ok = true;\n", "utf8");

    expect(resolvePluginModuleCandidates(rootDir, "./src/checker")).toEqual([
      path.join(rootDir, "src", "checker"),
      path.join(rootDir, "src", "checker.ts"),
      path.join(rootDir, "src", "checker.js"),
      path.join(rootDir, "src", "checker.mjs"),
      path.join(rootDir, "src", "checker.cjs"),
    ]);
=======
function requireCreateJitiCall(
  createJiti: ReturnType<typeof vi.fn>,
): [string, { tryNative?: boolean }] {
  const call = createJiti.mock.calls[0];
  if (!call) {
    throw new Error("expected createJiti call");
  }
  return call as [string, { tryNative?: boolean }];
}

describe("channel plugin module loader helpers", () => {
  it("resolves extensionless plugin module specifiers to the first existing extension", () => {
    const rootDir = createTempDir();
    const expectedPath = path.join(rootDir, "src", "checker.mts");
    fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
    fs.writeFileSync(expectedPath, "export const ok = true;\n", "utf8");

>>>>>>> upstream/main
    expect(resolveExistingPluginModulePath(rootDir, "./src/checker")).toBe(expectedPath);
  });

  it("detects JavaScript module paths case-insensitively", () => {
    expect(isJavaScriptModulePath("/tmp/entry.js")).toBe(true);
    expect(isJavaScriptModulePath("/tmp/entry.MJS")).toBe(true);
    expect(isJavaScriptModulePath("/tmp/entry.ts")).toBe(false);
  });
<<<<<<< HEAD
=======

  it("uses native require for eligible JavaScript modules without creating Jiti", async () => {
    const createJiti = vi.fn(() => vi.fn(() => ({ ok: false })));
    vi.doMock("jiti", () => ({
      createJiti,
    }));
    const loaderModule = await importFreshModule<typeof import("./module-loader.js")>(
      import.meta.url,
      "./module-loader.js?scope=native-require",
    );
    const rootDir = createTempDir();
    const modulePath = path.join(rootDir, "dist", "extensions", "demo", "index.cjs");
    fs.mkdirSync(path.dirname(modulePath), { recursive: true });
    fs.writeFileSync(modulePath, "module.exports = { ok: true };\n", "utf8");

    expect(
      loaderModule.loadChannelPluginModule({
        modulePath,
        rootDir,
      }),
    ).toEqual({ ok: true });
    expect(createJiti).not.toHaveBeenCalled();
  });

  it("loads TypeScript channel plugin modules through Jiti when native loading is unavailable", async () => {
    const loadWithJiti = vi.fn((target: string) => ({
      loadedBy: "jiti",
      target,
    }));
    const createJiti = vi.fn(
      (_filename: string, _options: { tryNative?: boolean }) => loadWithJiti,
    );
    const sourceExtensions = [".ts", ".tsx", ".mts", ".cts"] as const;
    const sourceHooks = new Map<string, NodeJS.RequireExtensions[string] | undefined>();
    for (const extension of sourceExtensions) {
      sourceHooks.set(extension, testRequire.extensions[extension]);
      delete testRequire.extensions[extension];
    }
    const loaderModule = await importFreshModule<typeof import("./module-loader.js")>(
      import.meta.url,
      "./module-loader.js?scope=source-ts-jiti-fallback",
    );
    loaderModule.setChannelPluginModuleLoaderFactoryForTest(
      createJiti as unknown as PluginModuleLoaderFactory,
    );
    const rootDir = createTempDir();
    const modulePath = path.join(rootDir, "extensions", "demo", "index.ts");
    fs.mkdirSync(path.dirname(modulePath), { recursive: true });
    fs.writeFileSync(modulePath, 'throw new Error("native source load failed");\n', "utf8");

    try {
      expect(
        loaderModule.loadChannelPluginModule({
          modulePath,
          rootDir,
        }),
      ).toEqual({
        loadedBy: "jiti",
        target: fs.realpathSync.native(modulePath),
      });
      expect(createJiti).toHaveBeenCalledOnce();
      const [loaderFilename, loaderOptions] = requireCreateJitiCall(createJiti);
      expect(loaderFilename).toContain("module-loader.ts");
      expect(loaderOptions.tryNative).toBe(false);
      expect(loadWithJiti).toHaveBeenCalledWith(fs.realpathSync.native(modulePath));
    } finally {
      for (const [extension, hook] of sourceHooks) {
        if (hook) {
          testRequire.extensions[extension] = hook;
        } else {
          delete testRequire.extensions[extension];
        }
      }
    }
  });
>>>>>>> upstream/main
});
