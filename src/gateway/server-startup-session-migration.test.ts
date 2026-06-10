<<<<<<< HEAD
=======
/**
 * Gateway startup session migration tests.
 */
>>>>>>> upstream/main
import { describe, expect, it, vi } from "vitest";
import { runStartupSessionMigration } from "./server-startup-session-migration.js";

function makeLog() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
  };
}

function makeCfg() {
  return { agents: { defaults: {} }, session: {} } as Parameters<
    typeof runStartupSessionMigration
  >[0]["cfg"];
}

<<<<<<< HEAD
=======
function firstLogMessage(log: ReturnType<typeof vi.fn>, label: string): string {
  const [message] = log.mock.calls[0] ?? [];
  if (typeof message !== "string") {
    throw new Error(`expected ${label} message`);
  }
  return message;
}

>>>>>>> upstream/main
describe("runStartupSessionMigration", () => {
  it("logs changes when orphaned keys are canonicalized", async () => {
    const log = makeLog();
    const migrate = vi.fn().mockResolvedValue({
      changes: ["Canonicalized 2 orphaned session key(s) in /tmp/store.json"],
      warnings: [],
    });
    await runStartupSessionMigration({
      cfg: makeCfg(),
      log,
      deps: { migrateOrphanedSessionKeys: migrate },
    });
    expect(migrate).toHaveBeenCalledOnce();
    expect(log.info).toHaveBeenCalledOnce();
<<<<<<< HEAD
    expect(log.info.mock.calls[0][0]).toContain("canonicalized orphaned session keys");
=======
    expect(firstLogMessage(log.info, "startup migration info")).toContain(
      "canonicalized orphaned session keys",
    );
>>>>>>> upstream/main
    expect(log.warn).not.toHaveBeenCalled();
  });

  it("logs warnings from migration", async () => {
    const log = makeLog();
    const migrate = vi.fn().mockResolvedValue({
      changes: [],
      warnings: ["Could not read /bad/path: ENOENT"],
    });
    await runStartupSessionMigration({
      cfg: makeCfg(),
      log,
      deps: { migrateOrphanedSessionKeys: migrate },
    });
    expect(log.info).not.toHaveBeenCalled();
    expect(log.warn).toHaveBeenCalledOnce();
<<<<<<< HEAD
    expect(log.warn.mock.calls[0][0]).toContain("session key migration warnings");
=======
    expect(firstLogMessage(log.warn, "startup migration warning")).toContain(
      "session key migration warnings",
    );
>>>>>>> upstream/main
  });

  it("silently continues when no changes needed", async () => {
    const log = makeLog();
    const migrate = vi.fn().mockResolvedValue({ changes: [], warnings: [] });
    await runStartupSessionMigration({
      cfg: makeCfg(),
      log,
      deps: { migrateOrphanedSessionKeys: migrate },
    });
    expect(log.info).not.toHaveBeenCalled();
    expect(log.warn).not.toHaveBeenCalled();
  });

  it("catches and logs migration errors without throwing", async () => {
    const log = makeLog();
    const migrate = vi.fn().mockRejectedValue(new Error("disk full"));
    await runStartupSessionMigration({
      cfg: makeCfg(),
      log,
      deps: { migrateOrphanedSessionKeys: migrate },
    });
    expect(log.warn).toHaveBeenCalledOnce();
<<<<<<< HEAD
    expect(log.warn.mock.calls[0][0]).toContain("migration failed during startup");
    expect(log.warn.mock.calls[0][0]).toContain("disk full");
=======
    const warning = firstLogMessage(log.warn, "startup migration failure warning");
    expect(warning).toContain("migration failed during startup");
    expect(warning).toContain("disk full");
>>>>>>> upstream/main
  });
});
