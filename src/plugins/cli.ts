// Registers plugin-related CLI commands.
import type { Command } from "commander";
<<<<<<< HEAD
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { removeCommandByName } from "../cli/program/command-tree.js";
import { registerLazyCommand } from "../cli/program/register-lazy-command.js";
import type { OpenClawConfig } from "../config/config.js";
import { loadConfig } from "../config/config.js";
import { applyPluginAutoEnable } from "../config/plugin-auto-enable.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  loadOpenClawPluginCliRegistry,
  loadOpenClawPlugins,
  type PluginLoadOptions,
} from "./loader.js";
import type { PluginRegistry } from "./registry.js";
import type { OpenClawPluginCliCommandDescriptor } from "./types.js";
import type { PluginLogger } from "./types.js";
=======
import { getRuntimeConfig, readConfigFileSnapshot } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  createPluginCliLogger,
  loadPluginCliDescriptors,
  loadPluginCliRegistrationEntriesWithDefaults,
  type PluginCliLoaderOptions,
} from "./cli-registry-loader.js";
import { registerPluginCliCommandGroups } from "./register-plugin-cli-command-groups.js";
import type { OpenClawPluginCliCommandDescriptor, PluginLogger } from "./types.js";
>>>>>>> upstream/main

type PluginCliRegistrationMode = "eager" | "lazy";

<<<<<<< HEAD
type PluginCliRegistrationMode = "eager" | "lazy";

=======
>>>>>>> upstream/main
type RegisterPluginCliOptions = {
  mode?: PluginCliRegistrationMode;
  primary?: string | null;
};

<<<<<<< HEAD
function canRegisterPluginCliLazily(entry: {
  commands: string[];
  descriptors: OpenClawPluginCliCommandDescriptor[];
}): boolean {
  if (entry.descriptors.length === 0) {
    return false;
  }
  const descriptorNames = new Set(entry.descriptors.map((descriptor) => descriptor.name));
  return entry.commands.every((command) => descriptorNames.has(command));
}

function hasIgnoredAsyncPluginRegistration(registry: PluginRegistry): boolean {
  return (registry.diagnostics ?? []).some(
    (entry) =>
      entry.message === "plugin register returned a promise; async registration is ignored",
  );
}

function mergeCliRegistrars(params: {
  runtimeRegistry: PluginRegistry;
  metadataRegistry: PluginRegistry;
}) {
  const runtimeCommands = new Set(
    params.runtimeRegistry.cliRegistrars.flatMap((entry) => entry.commands),
  );
  return [
    ...params.runtimeRegistry.cliRegistrars,
    ...params.metadataRegistry.cliRegistrars.filter(
      (entry) => !entry.commands.some((command) => runtimeCommands.has(command)),
    ),
  ];
}

function resolvePluginCliLoadContext(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv) {
  const config = cfg ?? loadConfig();
  const autoEnabled = applyPluginAutoEnable({ config, env: env ?? process.env });
  const resolvedConfig = autoEnabled.config;
  const workspaceDir = resolveAgentWorkspaceDir(
    resolvedConfig,
    resolveDefaultAgentId(resolvedConfig),
  );
  const logger: PluginLogger = {
    info: (msg: string) => log.info(msg),
    warn: (msg: string) => log.warn(msg),
    error: (msg: string) => log.error(msg),
    debug: (msg: string) => log.debug(msg),
  };
  return {
    rawConfig: config,
    config: resolvedConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir,
    logger,
  };
}

async function loadPluginCliMetadataRegistry(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
  loaderOptions?: Pick<PluginLoadOptions, "pluginSdkResolution">,
) {
  const context = resolvePluginCliLoadContext(cfg, env);
  return {
    ...context,
    registry: await loadOpenClawPluginCliRegistry({
      config: context.config,
      activationSourceConfig: context.rawConfig,
      autoEnabledReasons: context.autoEnabledReasons,
      workspaceDir: context.workspaceDir,
      env,
      logger: context.logger,
      ...loaderOptions,
    }),
  };
}

async function loadPluginCliCommandRegistry(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
  loaderOptions?: Pick<PluginLoadOptions, "pluginSdkResolution">,
) {
  const context = resolvePluginCliLoadContext(cfg, env);
  const runtimeRegistry = loadOpenClawPlugins({
    config: context.config,
    activationSourceConfig: context.rawConfig,
    autoEnabledReasons: context.autoEnabledReasons,
    workspaceDir: context.workspaceDir,
    env,
    logger: context.logger,
    ...loaderOptions,
  });

  if (!hasIgnoredAsyncPluginRegistration(runtimeRegistry)) {
    return {
      ...context,
      registry: runtimeRegistry,
    };
  }

  try {
    const metadataRegistry = await loadOpenClawPluginCliRegistry({
      config: context.config,
      activationSourceConfig: context.rawConfig,
      autoEnabledReasons: context.autoEnabledReasons,
      workspaceDir: context.workspaceDir,
      env,
      logger: context.logger,
      ...loaderOptions,
    });
    return {
      ...context,
      registry: {
        ...runtimeRegistry,
        cliRegistrars: mergeCliRegistrars({
          runtimeRegistry,
          metadataRegistry,
        }),
      },
    };
  } catch (error) {
    log.warn(`plugin CLI metadata fallback failed: ${String(error)}`);
    return {
      ...context,
      registry: runtimeRegistry,
    };
  }
}

export async function getPluginCliCommandDescriptors(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
  loaderOptions?: Pick<PluginLoadOptions, "pluginSdkResolution">,
): Promise<OpenClawPluginCliCommandDescriptor[]> {
  try {
    const { registry } = await loadPluginCliMetadataRegistry(cfg, env, loaderOptions);
    const seen = new Set<string>();
    const descriptors: OpenClawPluginCliCommandDescriptor[] = [];
    for (const entry of registry.cliRegistrars) {
      for (const descriptor of entry.descriptors) {
        if (seen.has(descriptor.name)) {
          continue;
        }
        seen.add(descriptor.name);
        descriptors.push(descriptor);
=======
type PluginCliRegistrationEntries = Awaited<
  ReturnType<typeof loadPluginCliRegistrationEntriesWithDefaults>
>;

const PLUGIN_CLI_ENTRIES_CACHE_KEY = Symbol.for("openclaw.plugin-cli-registration-entries-cache");

interface ProgramWithEntriesCache {
  [PLUGIN_CLI_ENTRIES_CACHE_KEY]?: {
    primary: string | undefined;
    inputKey: string;
    entries: PluginCliRegistrationEntries;
  };
}

const logger = createPluginCliLogger();
const loaderOptionIds = new WeakMap<object, number>();
let nextLoaderOptionId = 1;

const quietDescriptorLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
} satisfies PluginLogger;

function stableJsonKey(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  try {
    return JSON.stringify(value, (_key, entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return entry;
>>>>>>> upstream/main
      }
      return Object.fromEntries(
        Object.entries(entry).toSorted(([left], [right]) => left.localeCompare(right)),
      );
    });
  } catch {
    return "unserializable";
  }
}

<<<<<<< HEAD
=======
function loaderOptionsKey(loaderOptions: PluginCliLoaderOptions | undefined): string {
  if (!loaderOptions) {
    return "undefined";
  }
  const existing = loaderOptionIds.get(loaderOptions);
  if (existing) {
    return String(existing);
  }
  const id = nextLoaderOptionId;
  nextLoaderOptionId += 1;
  loaderOptionIds.set(loaderOptions, id);
  return String(id);
}

export const loadValidatedConfigForPluginRegistration =
  async (): Promise<OpenClawConfig | null> => {
    const snapshot = await readConfigFileSnapshot();
    if (!snapshot.valid) {
      return null;
    }
    return getRuntimeConfig();
  };

export async function getPluginCliCommandDescriptors(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
  loaderOptions?: PluginCliLoaderOptions,
): Promise<OpenClawPluginCliCommandDescriptor[]> {
  return loadPluginCliDescriptors({ cfg, env, loaderOptions, logger: quietDescriptorLogger });
}

>>>>>>> upstream/main
export async function registerPluginCliCommands(
  program: Command,
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
<<<<<<< HEAD
  loaderOptions?: Pick<PluginLoadOptions, "pluginSdkResolution">,
  options?: RegisterPluginCliOptions,
) {
  const { config, workspaceDir, logger, registry } = await loadPluginCliCommandRegistry(
    cfg,
    env,
    loaderOptions,
  );
  const mode = options?.mode ?? "eager";
  const primary = options?.primary ?? null;

  const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));

  for (const entry of registry.cliRegistrars) {
    const registerEntry = async () => {
      await entry.register({
        program,
        config,
        workspaceDir,
        logger,
      });
    };

    if (primary && entry.commands.includes(primary)) {
      for (const commandName of new Set(entry.commands)) {
        removeCommandByName(program, commandName);
      }
      await registerEntry();
      for (const command of entry.commands) {
        existingCommands.add(command);
      }
      continue;
    }

    if (entry.commands.length > 0) {
      const overlaps = entry.commands.filter((command) => existingCommands.has(command));
      if (overlaps.length > 0) {
        log.debug(
          `plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(
            ", ",
          )})`,
        );
        continue;
      }
    }

    try {
      if (mode === "lazy" && canRegisterPluginCliLazily(entry)) {
        for (const descriptor of entry.descriptors) {
          registerLazyCommand({
            program,
            name: descriptor.name,
            description: descriptor.description,
            removeNames: entry.commands,
            register: async () => {
              await registerEntry();
            },
          });
        }
      } else {
        if (mode === "lazy" && entry.descriptors.length > 0) {
          log.debug(
            `plugin CLI lazy register fallback to eager (${entry.pluginId}): descriptors do not cover all command roots`,
          );
        }
        await registerEntry();
      }
      for (const command of entry.commands) {
        existingCommands.add(command);
      }
    } catch (err) {
      log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
    }
=======
  loaderOptions?: PluginCliLoaderOptions,
  options?: RegisterPluginCliOptions,
) {
  const mode = options?.mode ?? "eager";
  const primary = options?.primary ?? undefined;
  const inputKey = [stableJsonKey(cfg), stableJsonKey(env), loaderOptionsKey(loaderOptions)].join(
    "\0",
  );

  const programWithCache = program as Command & ProgramWithEntriesCache;
  const cached = programWithCache[PLUGIN_CLI_ENTRIES_CACHE_KEY];
  let entries: PluginCliRegistrationEntries;
  if (cached && cached.primary === primary && cached.inputKey === inputKey) {
    entries = cached.entries;
  } else {
    entries = await loadPluginCliRegistrationEntriesWithDefaults({
      cfg,
      env,
      loaderOptions,
      primaryCommand: primary,
    });
    programWithCache[PLUGIN_CLI_ENTRIES_CACHE_KEY] = { primary, inputKey, entries };
>>>>>>> upstream/main
  }

  await registerPluginCliCommandGroups(program, entries, {
    mode,
    primary,
    existingCommands: new Set(program.commands.map((cmd) => cmd.name())),
    logger,
  });
}

export async function registerPluginCliCommandsFromValidatedConfig(
  program: Command,
  env?: NodeJS.ProcessEnv,
  loaderOptions?: PluginCliLoaderOptions,
  options?: RegisterPluginCliOptions,
): Promise<OpenClawConfig | null> {
  const config = await loadValidatedConfigForPluginRegistration();
  if (!config) {
    return null;
  }
  await registerPluginCliCommands(program, config, env, loaderOptions, options);
  return config;
}
