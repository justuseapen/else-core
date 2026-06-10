<<<<<<< HEAD
=======
/**
 * @deprecated Compatibility subpath. Import logger/runtime helpers from
 * `openclaw/plugin-sdk/runtime` instead.
 */

>>>>>>> upstream/main
import { format } from "node:util";
import type { OutputRuntimeEnv, RuntimeEnv } from "../runtime.js";

/** Minimal logger contract accepted by runtime-adapter helpers. */
type LoggerLike = {
  info: (message: string) => void;
  error: (message: string) => void;
};

<<<<<<< HEAD
/** Adapt a simple logger into the RuntimeEnv contract used by shared plugin SDK helpers. */
=======
/** @deprecated Import from `openclaw/plugin-sdk/runtime` instead. */
>>>>>>> upstream/main
export function createLoggerBackedRuntime(params: {
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv {
  return {
    log: (...args) => {
      params.logger.info(format(...args));
    },
    error: (...args) => {
      params.logger.error(format(...args));
    },
    writeStdout: (value) => {
      params.logger.info(value);
    },
    writeJson: (value, space = 2) => {
      params.logger.info(JSON.stringify(value, null, space > 0 ? space : undefined));
    },
    exit: (code: number): never => {
      throw params.exitError?.(code) ?? new Error(`exit ${code}`);
    },
  };
}

<<<<<<< HEAD
/** Reuse an existing runtime when present, otherwise synthesize one from the provided logger. */
=======
/** @deprecated Import from `openclaw/plugin-sdk/runtime` instead. */
>>>>>>> upstream/main
export function resolveRuntimeEnv(params: {
  runtime: RuntimeEnv;
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): RuntimeEnv;
<<<<<<< HEAD
=======
/** @deprecated Import from `openclaw/plugin-sdk/runtime` instead. */
>>>>>>> upstream/main
export function resolveRuntimeEnv(params: {
  runtime?: undefined;
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv;
export function resolveRuntimeEnv(params: {
  runtime?: RuntimeEnv;
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): RuntimeEnv | OutputRuntimeEnv {
  return params.runtime ?? createLoggerBackedRuntime(params);
}

<<<<<<< HEAD
/** Resolve a runtime that treats exit requests as unsupported errors instead of process termination. */
=======
/** @deprecated Import from `openclaw/plugin-sdk/runtime` instead. */
>>>>>>> upstream/main
export function resolveRuntimeEnvWithUnavailableExit(params: {
  runtime: RuntimeEnv;
  logger: LoggerLike;
  unavailableMessage?: string;
}): RuntimeEnv;
<<<<<<< HEAD
=======
/** @deprecated Import from `openclaw/plugin-sdk/runtime` instead. */
>>>>>>> upstream/main
export function resolveRuntimeEnvWithUnavailableExit(params: {
  runtime?: undefined;
  logger: LoggerLike;
  unavailableMessage?: string;
}): OutputRuntimeEnv;
export function resolveRuntimeEnvWithUnavailableExit(params: {
  runtime?: RuntimeEnv;
  logger: LoggerLike;
  unavailableMessage?: string;
}): RuntimeEnv | OutputRuntimeEnv {
  if (params.runtime) {
    return resolveRuntimeEnv({
      runtime: params.runtime,
      logger: params.logger,
      exitError: () => new Error(params.unavailableMessage ?? "Runtime exit not available"),
    });
  }
  return resolveRuntimeEnv({
    logger: params.logger,
    exitError: () => new Error(params.unavailableMessage ?? "Runtime exit not available"),
  });
}
