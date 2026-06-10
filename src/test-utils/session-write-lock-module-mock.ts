<<<<<<< HEAD
import { vi } from "vitest";
=======
// Typed mock facade for session write-lock module tests.
>>>>>>> upstream/main
import type * as SessionWriteLockModule from "../agents/session-write-lock.js";

type SessionWriteLockModuleShape = typeof SessionWriteLockModule;

<<<<<<< HEAD
=======
/** Creates a session-write-lock module mock while preserving untouched exports. */
>>>>>>> upstream/main
export async function buildSessionWriteLockModuleMock(
  loadActual: () => Promise<SessionWriteLockModuleShape>,
  acquireSessionWriteLock: SessionWriteLockModuleShape["acquireSessionWriteLock"],
): Promise<SessionWriteLockModuleShape> {
  const original = await loadActual();
  return {
    ...original,
    acquireSessionWriteLock,
  };
}
<<<<<<< HEAD

export function resetModulesWithSessionWriteLockDoMock(
  modulePath: string,
  acquireSessionWriteLock: SessionWriteLockModuleShape["acquireSessionWriteLock"],
): void {
  vi.resetModules();
  vi.doMock(modulePath, () =>
    buildSessionWriteLockModuleMock(
      () => vi.importActual<SessionWriteLockModuleShape>(modulePath),
      acquireSessionWriteLock,
    ),
  );
}
=======
>>>>>>> upstream/main
