#!/usr/bin/env node

<<<<<<< HEAD
=======
// Runs the closed-loop voice-call test slice through the repo Vitest wrapper.
>>>>>>> upstream/main
import { execFileSync } from "node:child_process";
import { bundledPluginFile } from "./lib/bundled-plugin-paths.mjs";

const args = [
  "run",
  "--config",
  "vitest.config.ts",
  bundledPluginFile("voice-call", "src/manager.test.ts"),
  bundledPluginFile("voice-call", "src/media-stream.test.ts"),
  "src/plugins/voice-call.plugin.test.ts",
  "--maxWorkers=1",
];

<<<<<<< HEAD
execFileSync("vitest", args, {
=======
execFileSync(process.execPath, ["scripts/run-vitest.mjs", ...args], {
>>>>>>> upstream/main
  stdio: "inherit",
});
