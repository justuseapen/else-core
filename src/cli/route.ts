// Route-first CLI entry point for commands that can run before full Commander setup.
import { isTruthyEnvValue } from "../infra/env.js";
import { defaultRuntime } from "../runtime.js";
<<<<<<< HEAD
import { getCommandPathWithRootOptions, hasFlag, hasHelpOrVersion } from "./argv.js";
=======
import { resolveCliArgvInvocation } from "./argv-invocation.js";
import { hasFlag } from "./argv.js";
import {
  applyCliExecutionStartupPresentation,
  ensureCliExecutionBootstrap,
  resolveCliExecutionStartupContext,
} from "./command-execution-startup.js";
>>>>>>> upstream/main
import { findRoutedCommand } from "./program/routes.js";

async function prepareRoutedCommand(params: {
  argv: string[];
  commandPath: string[];
  loadPlugins?: boolean | ((argv: string[]) => boolean);
}) {
<<<<<<< HEAD
  const suppressDoctorStdout = hasFlag(params.argv, "--json");
  const skipConfigGuard =
    (params.commandPath[0] === "status" && suppressDoctorStdout) ||
    (params.commandPath[0] === "gateway" && params.commandPath[1] === "status");
  if (!suppressDoctorStdout && process.stdout.isTTY) {
    const [{ emitCliBanner }, { VERSION }] = await Promise.all([
      import("./banner.js"),
      import("../version.js"),
    ]);
    emitCliBanner(VERSION, { argv: params.argv });
  }
  if (!skipConfigGuard) {
    const { ensureConfigReady } = await import("./program/config-guard.js");
    await ensureConfigReady({
      runtime: defaultRuntime,
      commandPath: params.commandPath,
      ...(suppressDoctorStdout ? { suppressDoctorStdout: true } : {}),
    });
  }
=======
  const { startupPolicy } = resolveCliExecutionStartupContext({
    argv: params.argv,
    jsonOutputMode: hasFlag(params.argv, "--json"),
    env: process.env,
    routeMode: true,
  });
  const { VERSION } = await import("../version.js");
  await applyCliExecutionStartupPresentation({
    argv: params.argv,
    startupPolicy,
    showBanner: process.stdout.isTTY && !startupPolicy.suppressDoctorStdout,
    version: VERSION,
  });
>>>>>>> upstream/main
  const shouldLoadPlugins =
    typeof params.loadPlugins === "function" ? params.loadPlugins(params.argv) : params.loadPlugins;
  // Routed commands still honor config guards, logging policy, and plugin loading decisions.
  await ensureCliExecutionBootstrap({
    runtime: defaultRuntime,
    commandPath: params.commandPath,
    startupPolicy,
    loadPlugins: shouldLoadPlugins ?? startupPolicy.loadPlugins,
  });
}

/** Try a lightweight route-first command before falling back to the full CLI program. */
export async function tryRouteCli(argv: string[]): Promise<boolean> {
  if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) {
    return false;
  }
  const invocation = resolveCliArgvInvocation(argv);
  if (invocation.hasHelpOrVersion) {
    return false;
  }
  if (!invocation.commandPath[0]) {
    return false;
  }
  const route = findRoutedCommand(invocation.commandPath, argv);
  if (!route) {
    return false;
  }
  if (route.canRun && !route.canRun(argv)) {
    // Let Commander own unsupported argv shapes so user-facing validation stays centralized.
    return false;
  }
  await prepareRoutedCommand({
    argv,
    commandPath: invocation.commandPath,
    loadPlugins: route.loadPlugins,
  });
  return route.run(argv);
}
