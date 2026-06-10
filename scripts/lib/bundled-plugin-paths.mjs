<<<<<<< HEAD
export const BUNDLED_PLUGIN_ROOT_DIR = "extensions";
export const BUNDLED_PLUGIN_PATH_PREFIX = `${BUNDLED_PLUGIN_ROOT_DIR}/`;
export const BUNDLED_PLUGIN_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.test.ts`;
export const BUNDLED_PLUGIN_E2E_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.e2e.test.ts`;
export const BUNDLED_PLUGIN_LIVE_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.live.test.ts`;

=======
// Canonical path helpers for bundled plugin source and dist locations.
/** Root directory containing bundled plugin source packages. */
export const BUNDLED_PLUGIN_ROOT_DIR = "extensions";
/** Prefix for bundled plugin source paths. */
export const BUNDLED_PLUGIN_PATH_PREFIX = `${BUNDLED_PLUGIN_ROOT_DIR}/`;
/** Glob for bundled plugin unit tests. */
export const BUNDLED_PLUGIN_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.test.ts`;
/** Glob for bundled plugin E2E tests. */
export const BUNDLED_PLUGIN_E2E_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.e2e.test.ts`;
/** Glob for bundled plugin live tests. */
export const BUNDLED_PLUGIN_LIVE_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.live.test.ts`;

/** Return a bundled plugin source root path. */
>>>>>>> upstream/main
export function bundledPluginRoot(pluginId) {
  return `${BUNDLED_PLUGIN_PATH_PREFIX}${pluginId}`;
}

<<<<<<< HEAD
=======
/** Return a bundled plugin source file path. */
>>>>>>> upstream/main
export function bundledPluginFile(pluginId, relativePath) {
  return `${bundledPluginRoot(pluginId)}/${relativePath}`;
}

<<<<<<< HEAD
=======
/** Return a bundled plugin dist root path. */
>>>>>>> upstream/main
export function bundledDistPluginRoot(pluginId) {
  return `dist/${bundledPluginRoot(pluginId)}`;
}

<<<<<<< HEAD
=======
/** Return a bundled plugin dist file path. */
>>>>>>> upstream/main
export function bundledDistPluginFile(pluginId, relativePath) {
  return `${bundledDistPluginRoot(pluginId)}/${relativePath}`;
}

<<<<<<< HEAD
=======
/** Return a bundled plugin source callsite string with a line number. */
>>>>>>> upstream/main
export function bundledPluginCallsite(pluginId, relativePath, line) {
  return `${bundledPluginFile(pluginId, relativePath)}:${line}`;
}
