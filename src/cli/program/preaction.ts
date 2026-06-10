// Global Commander pre-action hook: startup presentation, config guard, logging, and plugin preflight.
import type { Command } from "commander";
import { setVerbose } from "../../globals.js";
import type { LogLevel } from "../../logging/levels.js";
import { defaultRuntime } from "../../runtime.js";
import { resolveCliArgvInvocation } from "../argv-invocation.js";
import { getVerboseFlag, isHelpOrVersionInvocation } from "../argv.js";
import { resolveCliName } from "../cli-name.js";
import {
  applyCliExecutionStartupPresentation,
  ensureCliExecutionBootstrap,
  resolveCliExecutionStartupContext,
} from "../command-execution-startup.js";
import { shouldBypassConfigGuardForCommandPath } from "../command-startup-policy.js";
import {
  resolvePluginInstallInvalidConfigPolicy,
  resolvePluginInstallPreactionRequest,
} from "../plugin-install-config-policy.js";
import { isCommandJsonOutputMode } from "./json-mode.js";
import { isParentDefaultHelpAction } from "./parent-default-help.js";

function setProcessTitleForCommand(actionCommand: Command) {
  let current: Command = actionCommand;
  while (current.parent && current.parent.parent) {
    current = current.parent;
  }
  const name = current.name();
  const cliName = resolveCliName();
  if (!name || name === cliName) {
    return;
  }
  process.title = `${cliName}-${name}`;
}

<<<<<<< HEAD
// Commands that need plugins loaded before execution.
const PLUGIN_REQUIRED_COMMANDS = new Set([
  "agent",
  "message",
  "channels",
  "directory",
  "agents",
  "configure",
  "status",
  "health",
]);
const CONFIG_GUARD_BYPASS_COMMANDS = new Set(["backup", "doctor", "completion", "secrets"]);
let configGuardModulePromise: Promise<typeof import("./config-guard.js")> | undefined;
let pluginRegistryModulePromise: Promise<typeof import("../plugin-registry.js")> | undefined;

function shouldBypassConfigGuard(commandPath: string[]): boolean {
  const [primary, secondary] = commandPath;
  if (!primary) {
    return false;
  }
  if (CONFIG_GUARD_BYPASS_COMMANDS.has(primary)) {
    return true;
  }
  if (primary === "config" && (secondary === "validate" || secondary === "schema")) {
    return true;
  }
  return false;
}

function loadConfigGuardModule() {
  configGuardModulePromise ??= import("./config-guard.js");
  return configGuardModulePromise;
}

function loadPluginRegistryModule() {
  pluginRegistryModulePromise ??= import("../plugin-registry.js");
  return pluginRegistryModulePromise;
}

function resolvePluginRegistryScope(commandPath: string[]): "channels" | "all" {
  return commandPath[0] === "status" || commandPath[0] === "health" ? "channels" : "all";
}

function shouldLoadPluginsForCommand(commandPath: string[], jsonOutputMode: boolean): boolean {
  const [primary, secondary] = commandPath;
  if (!primary || !PLUGIN_REQUIRED_COMMANDS.has(primary)) {
    return false;
  }
  if ((primary === "status" || primary === "health") && jsonOutputMode) {
    return false;
  }
  // Setup wizard and channels add should stay manifest-first and load selected plugins on demand.
  if (primary === "onboard" || (primary === "channels" && secondary === "add")) {
    return false;
  }
  return true;
}
=======
>>>>>>> upstream/main
function shouldAllowInvalidConfigForAction(actionCommand: Command, commandPath: string[]): boolean {
  return (
    resolvePluginInstallInvalidConfigPolicy(
      resolvePluginInstallPreactionRequest({
        actionCommand,
        commandPath,
        argv: process.argv,
      }),
<<<<<<< HEAD
    ) === "allow-bundled-recovery"
=======
    ) === "allow-plugin-recovery"
>>>>>>> upstream/main
  );
}

function getRootCommand(command: Command): Command {
  let current = command;
  while (current.parent) {
    current = current.parent;
  }
  return current;
}

function getCliLogLevel(actionCommand: Command): LogLevel | undefined {
  const root = getRootCommand(actionCommand);
  if (typeof root.getOptionValueSource !== "function") {
    return undefined;
  }
  if (root.getOptionValueSource("logLevel") !== "cli") {
    return undefined;
  }
  const logLevel = root.opts<Record<string, unknown>>().logLevel;
  return typeof logLevel === "string" ? (logLevel as LogLevel) : undefined;
}

function isBareParentDefaultHelpInvocation(actionCommand: Command, argv: string[]): boolean {
  if (!isParentDefaultHelpAction(actionCommand)) {
    return false;
  }
  const { commandPath } = resolveCliArgvInvocation(argv);
  const [primary, extra] = commandPath;
  if (extra !== undefined || !primary) {
    return false;
  }
  return primary === actionCommand.name() || actionCommand.aliases().includes(primary);
}

function isGuidedConfigAction(actionCommand: Command): boolean {
  return actionCommand.name() === "config" && !actionCommand.parent?.parent;
}

function isGuidedConfigCommandPath(commandPath: string[]): boolean {
  const [primary, secondary, extra] = commandPath;
  if (primary !== "config" || extra !== undefined) {
    return false;
  }
  return (
    secondary !== "get" &&
    secondary !== "set" &&
    secondary !== "patch" &&
    secondary !== "unset" &&
    secondary !== "file" &&
    secondary !== "schema" &&
    secondary !== "validate"
  );
}

/** Register global pre-action bootstrap hooks for every non-help command invocation. */
export function registerPreActionHooks(program: Command, programVersion: string) {
  program.hook("preAction", async (_thisCommand, actionCommand) => {
    setProcessTitleForCommand(actionCommand);
    const argv = process.argv;
    if (isHelpOrVersionInvocation(argv) || isBareParentDefaultHelpInvocation(actionCommand, argv)) {
      return;
    }
    const jsonOutputMode = isCommandJsonOutputMode(actionCommand, argv);
    const { commandPath, startupPolicy } = resolveCliExecutionStartupContext({
      argv,
      jsonOutputMode,
      env: process.env,
    });
    await applyCliExecutionStartupPresentation({
      startupPolicy,
      version: programVersion,
    });
    const verbose = getVerboseFlag(argv, { includeDebug: true });
    setVerbose(verbose);
    const cliLogLevel = getCliLogLevel(actionCommand);
    if (cliLogLevel) {
      process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
    }
    if (!verbose) {
      process.env.NODE_NO_WARNINGS ??= "1";
    }
    if (
      shouldBypassConfigGuardForCommandPath(commandPath) ||
      isGuidedConfigAction(actionCommand) ||
      isGuidedConfigCommandPath(commandPath)
    ) {
      return;
    }
    await ensureCliExecutionBootstrap({
      runtime: defaultRuntime,
      commandPath,
      startupPolicy,
      allowInvalid: shouldAllowInvalidConfigForAction(actionCommand, commandPath),
      skipConfigGuard: shouldBypassConfigGuardForCommandPath(commandPath),
    });
  });
}
