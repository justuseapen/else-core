<<<<<<< HEAD
=======
/** Stores active web-tool metadata for the secrets runtime snapshot. */
>>>>>>> upstream/main
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";

let activeRuntimeWebToolsMetadata: RuntimeWebToolsMetadata | null = null;

<<<<<<< HEAD
=======
/**
 * Clears active web-tool metadata when the secrets runtime snapshot is reset.
 */
>>>>>>> upstream/main
export function clearActiveRuntimeWebToolsMetadata(): void {
  activeRuntimeWebToolsMetadata = null;
}

<<<<<<< HEAD
=======
/**
 * Stores web-tool metadata with clone isolation from caller-owned objects.
 */
>>>>>>> upstream/main
export function setActiveRuntimeWebToolsMetadata(metadata: RuntimeWebToolsMetadata): void {
  activeRuntimeWebToolsMetadata = structuredClone(metadata);
}

<<<<<<< HEAD
=======
/**
 * Returns active web-tool metadata without exposing mutable runtime state.
 */
>>>>>>> upstream/main
export function getActiveRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata | null {
  if (!activeRuntimeWebToolsMetadata) {
    return null;
  }
  return structuredClone(activeRuntimeWebToolsMetadata);
}
