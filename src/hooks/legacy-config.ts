<<<<<<< HEAD
=======
// Legacy hook config helpers convert older hook records into current config shape.
>>>>>>> upstream/main
type LegacyInternalHookHandler = {
  event: string;
  module: string;
  export?: string;
};

type LegacyInternalHooksCarrier = {
  hooks?: {
    internal?: {
      handlers?: LegacyInternalHookHandler[];
    };
  };
};

<<<<<<< HEAD
=======
/** Read legacy hooks.internal.handlers entries for backward-compatible config detection. */
>>>>>>> upstream/main
export function getLegacyInternalHookHandlers(config: unknown): LegacyInternalHookHandler[] {
  const handlers = (config as LegacyInternalHooksCarrier)?.hooks?.internal?.handlers;
  return Array.isArray(handlers) ? handlers : [];
}
