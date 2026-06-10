#!/usr/bin/env node

<<<<<<< HEAD
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveExtensionTestPlan } from "./lib/extension-test-plan.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const pnpm = "pnpm";

async function runVitestBatch(params) {
  return await new Promise((resolve, reject) => {
    const child = spawn(
      pnpm,
      ["exec", "vitest", "run", "--config", params.config, ...params.targets, ...params.args],
      {
        cwd: repoRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
        env: params.env,
      },
    );

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

function printUsage() {
  console.error("Usage: pnpm test:extension <extension-name|path> [vitest args...]");
  console.error("       node scripts/test-extension.mjs [extension-name|path] [vitest args...]");
}

function printNoTestsMessage(plan) {
  console.log(`[test-extension] No tests found for ${plan.extensionDir}. Skipping.`);
=======
// Runs the Vitest plan for one bundled plugin by id or path.
import { formatErrorMessage } from "./lib/error-format.mjs";
import { resolveExtensionTestPlan } from "./lib/extension-test-plan.mjs";
import {
  relativizeExtensionVitestArgs,
  relativizeExtensionVitestPath,
} from "./lib/extension-vitest-paths.mjs";
import { isDirectScriptRun, runVitestBatch } from "./lib/vitest-batch-runner.mjs";

const ALLOW_NO_TESTS_FLAG = "--allow-no-tests";

function printUsage() {
  console.error(
    `Usage: pnpm test:extension <extension-name|path> [${ALLOW_NO_TESTS_FLAG}] [vitest args...]`,
  );
  console.error(
    `       node scripts/test-extension.mjs [extension-name|path] [${ALLOW_NO_TESTS_FLAG}] [vitest args...]`,
  );
}

function printNoTestsMessage(plan) {
  console.error(`[test-extension] No tests found for ${plan.extensionDir}.`);
>>>>>>> upstream/main
}

async function run() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    printUsage();
    return;
  }

<<<<<<< HEAD
  const passthroughArgs = rawArgs.filter((arg) => arg !== "--");
=======
  const allowNoTests = rawArgs.includes(ALLOW_NO_TESTS_FLAG);
  const passthroughArgs = rawArgs.filter((arg) => arg !== "--" && arg !== ALLOW_NO_TESTS_FLAG);
>>>>>>> upstream/main

  let targetArg;
  if (passthroughArgs[0] && !passthroughArgs[0].startsWith("-")) {
    targetArg = passthroughArgs.shift();
  }

  let plan;
  try {
    plan = resolveExtensionTestPlan({ cwd: process.cwd(), targetArg });
  } catch (error) {
    printUsage();
    console.error(formatErrorMessage(error));
    process.exit(1);
  }

  if (!plan.hasTests) {
    printNoTestsMessage(plan);
<<<<<<< HEAD
=======
    if (!allowNoTests) {
      process.exit(1);
    }
>>>>>>> upstream/main
    return;
  }

  console.log(`[test-extension] Running ${plan.testFileCount} test files for ${plan.extensionId}`);
  const exitCode = await runVitestBatch({
<<<<<<< HEAD
    args: passthroughArgs,
    config: plan.config,
    env: process.env,
    targets: plan.roots,
=======
    args: relativizeExtensionVitestArgs(passthroughArgs),
    config: plan.config,
    env: process.env,
    targets: plan.roots.map((target) => relativizeExtensionVitestPath(target)),
>>>>>>> upstream/main
  });
  process.exit(exitCode);
}

if (isDirectScriptRun(import.meta.url)) {
  await run();
}
