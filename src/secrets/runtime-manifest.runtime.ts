<<<<<<< HEAD
export { loadPluginManifestRegistry } from "../plugins/manifest-registry.js";
=======
/**
 * Lazy runtime facade for plugin metadata snapshot reads used by secrets runtime.
 * Isolating it keeps tests able to mock manifest discovery without loading plugins.
 */
export {
  listPluginOriginsFromMetadataSnapshot,
  loadPluginMetadataSnapshot,
} from "../plugins/plugin-metadata-snapshot.js";
>>>>>>> upstream/main
