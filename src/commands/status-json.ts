<<<<<<< HEAD
import { type RuntimeEnv, writeRuntimeJson } from "../runtime.js";
import { resolveStatusJsonOutput } from "./status-json-runtime.ts";
import { scanStatusJsonFast } from "./status.scan.fast-json.js";

=======
// Thin `openclaw status --json` wrapper.
// Command wiring lives here; scan/payload behavior lives in the shared JSON command runner.

import type { RuntimeEnv } from "../runtime.js";
import { runStatusJsonCommand } from "./status-json-command.ts";
import { scanStatusJsonFast } from "./status.scan.fast-json.js";

/** Runs status JSON with the standard fast scan and all-mode security audit behavior. */
>>>>>>> upstream/main
export async function statusJsonCommand(
  opts: {
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
    all?: boolean;
  },
  runtime: RuntimeEnv,
) {
<<<<<<< HEAD
  const scan = await scanStatusJsonFast({ timeoutMs: opts.timeoutMs, all: opts.all }, runtime);
  writeRuntimeJson(
    runtime,
    await resolveStatusJsonOutput({
      scan,
      opts,
      includeSecurityAudit: opts.all === true,
      suppressHealthErrors: true,
    }),
  );
=======
  await runStatusJsonCommand({
    opts,
    runtime,
    scanStatusJsonFast,
    // `--all` is the opt-in path for heavier security audit fields in JSON output.
    includeSecurityAudit: opts.all === true,
    suppressHealthErrors: true,
  });
>>>>>>> upstream/main
}
