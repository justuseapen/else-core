<<<<<<< HEAD
const MODELS_JSON_STATE_KEY = Symbol.for("openclaw.modelsJsonState");

type ModelsJsonState = {
  writeLocks: Map<string, Promise<void>>;
  readyCache: Map<
    string,
    Promise<{ fingerprint: string; result: { agentDir: string; wrote: boolean } }>
  >;
=======
// Process-wide models.json coordination state. Dynamic imports can load this
// module multiple times, so Symbol.for keeps write locks and ready-cache shared.
const MODELS_JSON_STATE_KEY = Symbol.for("openclaw.modelsJsonState");

export type ModelsJsonReadyResult = {
  agentDir: string;
  wrote: boolean;
};

export type ModelsJsonReadyState = {
  fingerprint: string;
  result: ModelsJsonReadyResult;
};

type ModelsJsonState = {
  writeLocks: Map<string, Promise<void>>;
  readyCache: Map<string, Promise<ModelsJsonReadyState>>;
>>>>>>> upstream/main
};

export const MODELS_JSON_STATE = (() => {
  const globalState = globalThis as typeof globalThis & {
    [MODELS_JSON_STATE_KEY]?: ModelsJsonState;
  };
  if (!globalState[MODELS_JSON_STATE_KEY]) {
    globalState[MODELS_JSON_STATE_KEY] = {
      writeLocks: new Map<string, Promise<void>>(),
<<<<<<< HEAD
      readyCache: new Map<
        string,
        Promise<{ fingerprint: string; result: { agentDir: string; wrote: boolean } }>
      >(),
=======
      readyCache: new Map<string, Promise<ModelsJsonReadyState>>(),
>>>>>>> upstream/main
    };
  }
  return globalState[MODELS_JSON_STATE_KEY];
})();

<<<<<<< HEAD
export function resetModelsJsonReadyCacheForTest(): void {
=======
/** Clear models.json write/ready caches for tests. */
export function resetModelsJsonReadyCacheForTest(): void {
  MODELS_JSON_STATE.writeLocks.clear();
>>>>>>> upstream/main
  MODELS_JSON_STATE.readyCache.clear();
}
