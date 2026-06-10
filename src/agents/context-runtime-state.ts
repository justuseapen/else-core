<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
=======
/**
 * Process-global context-window runtime state.
 * Keeps model-config loads, backoff counters, and token cache reset behavior
 * shared across module reloads and runtime seams.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createLazyImportLoader, type LazyPromiseLoader } from "../shared/lazy-promise.js";
>>>>>>> upstream/main
import { MODEL_CONTEXT_TOKEN_CACHE } from "./context-cache.js";

const CONTEXT_WINDOW_RUNTIME_STATE_KEY = Symbol.for("openclaw.contextWindowRuntimeState");

type ContextWindowRuntimeState = {
  loadPromise: Promise<void> | null;
  configuredConfig: OpenClawConfig | undefined;
  configLoadFailures: number;
  nextConfigLoadAttemptAtMs: number;
<<<<<<< HEAD
  modelsConfigRuntimePromise: Promise<typeof import("./models-config.runtime.js")> | undefined;
};

=======
  modelsConfigRuntimeLoader: LazyPromiseLoader<typeof import("./models-config.runtime.js")>;
};

/** Shared mutable state for context-window resolution and model config loading. */
>>>>>>> upstream/main
export const CONTEXT_WINDOW_RUNTIME_STATE = (() => {
  const globalState = globalThis as typeof globalThis & {
    [CONTEXT_WINDOW_RUNTIME_STATE_KEY]?: ContextWindowRuntimeState;
  };
  if (!globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY]) {
<<<<<<< HEAD
=======
    // The loader is lifecycle-owned here; callers reuse the same pending load
    // promise and backoff counters instead of racing config discovery.
>>>>>>> upstream/main
    globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] = {
      loadPromise: null,
      configuredConfig: undefined,
      configLoadFailures: 0,
      nextConfigLoadAttemptAtMs: 0,
<<<<<<< HEAD
      modelsConfigRuntimePromise: undefined,
=======
      modelsConfigRuntimeLoader: createLazyImportLoader(() => import("./models-config.runtime.js")),
>>>>>>> upstream/main
    };
  }
  return globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY];
})();

<<<<<<< HEAD
=======
/** Reset context-window runtime state and token cache for isolated tests. */
>>>>>>> upstream/main
export function resetContextWindowCacheForTest(): void {
  CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = null;
  CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = undefined;
  CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
  CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
<<<<<<< HEAD
  CONTEXT_WINDOW_RUNTIME_STATE.modelsConfigRuntimePromise = undefined;
=======
  CONTEXT_WINDOW_RUNTIME_STATE.modelsConfigRuntimeLoader.clear();
>>>>>>> upstream/main
  MODEL_CONTEXT_TOKEN_CACHE.clear();
}
