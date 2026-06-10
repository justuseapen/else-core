<<<<<<< HEAD
=======
// Matrix plugin module implements env auth behavior.
>>>>>>> upstream/main
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { getMatrixScopedEnvVarNames } from "../../env-vars.js";

type MatrixEnvConfig = {
  homeserver: string;
  userId: string;
  accessToken?: string;
  password?: string;
  deviceId?: string;
  deviceName?: string;
};

<<<<<<< HEAD
function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveGlobalMatrixEnvConfig(env: NodeJS.ProcessEnv): MatrixEnvConfig {
  return {
    homeserver: clean(env.MATRIX_HOMESERVER),
    userId: clean(env.MATRIX_USER_ID),
    accessToken: clean(env.MATRIX_ACCESS_TOKEN) || undefined,
    password: clean(env.MATRIX_PASSWORD) || undefined,
    deviceId: clean(env.MATRIX_DEVICE_ID) || undefined,
    deviceName: clean(env.MATRIX_DEVICE_NAME) || undefined,
  };
}

export function resolveScopedMatrixEnvConfig(
  accountId: string,
  env: NodeJS.ProcessEnv = process.env,
): MatrixEnvConfig {
  const keys = getMatrixScopedEnvVarNames(accountId);
  return {
    homeserver: clean(env[keys.homeserver]),
    userId: clean(env[keys.userId]),
    accessToken: clean(env[keys.accessToken]) || undefined,
    password: clean(env[keys.password]) || undefined,
    deviceId: clean(env[keys.deviceId]) || undefined,
    deviceName: clean(env[keys.deviceName]) || undefined,
=======
function cleanEnv(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveGlobalMatrixEnvConfig(env: NodeJS.ProcessEnv): MatrixEnvConfig {
  return {
    homeserver: cleanEnv(env.MATRIX_HOMESERVER),
    userId: cleanEnv(env.MATRIX_USER_ID),
    accessToken: cleanEnv(env.MATRIX_ACCESS_TOKEN) || undefined,
    password: cleanEnv(env.MATRIX_PASSWORD) || undefined,
    deviceId: cleanEnv(env.MATRIX_DEVICE_ID) || undefined,
    deviceName: cleanEnv(env.MATRIX_DEVICE_NAME) || undefined,
>>>>>>> upstream/main
  };
}

export function hasReadyMatrixEnvAuth(config: {
  homeserver?: string;
  userId?: string;
  accessToken?: string;
  password?: string;
}): boolean {
<<<<<<< HEAD
  const homeserver = clean(config.homeserver);
  const userId = clean(config.userId);
  const accessToken = clean(config.accessToken);
  const password = clean(config.password);
  return Boolean(homeserver && (accessToken || (userId && password)));
}

=======
  const homeserver = cleanEnv(config.homeserver);
  const userId = cleanEnv(config.userId);
  const accessToken = cleanEnv(config.accessToken);
  const password = cleanEnv(config.password);
  return Boolean(homeserver && (accessToken || (userId && password)));
}

export function resolveScopedMatrixEnvConfig(
  accountId: string,
  env: NodeJS.ProcessEnv = process.env,
): MatrixEnvConfig {
  const keys = getMatrixScopedEnvVarNames(accountId);
  return {
    homeserver: cleanEnv(env[keys.homeserver]),
    userId: cleanEnv(env[keys.userId]),
    accessToken: cleanEnv(env[keys.accessToken]) || undefined,
    password: cleanEnv(env[keys.password]) || undefined,
    deviceId: cleanEnv(env[keys.deviceId]) || undefined,
    deviceName: cleanEnv(env[keys.deviceName]) || undefined,
  };
}

>>>>>>> upstream/main
export function resolveMatrixEnvAuthReadiness(
  accountId: string,
  env: NodeJS.ProcessEnv = process.env,
): {
  ready: boolean;
  homeserver?: string;
  userId?: string;
  sourceHint: string;
  missingMessage: string;
} {
  const normalizedAccountId = normalizeAccountId(accountId);
  const scoped = resolveScopedMatrixEnvConfig(normalizedAccountId, env);
<<<<<<< HEAD
  if (normalizedAccountId !== DEFAULT_ACCOUNT_ID) {
    const keys = getMatrixScopedEnvVarNames(normalizedAccountId);
    return {
      ready: hasReadyMatrixEnvAuth(scoped),
=======
  const scopedReady = hasReadyMatrixEnvAuth(scoped);
  if (normalizedAccountId !== DEFAULT_ACCOUNT_ID) {
    const keys = getMatrixScopedEnvVarNames(normalizedAccountId);
    return {
      ready: scopedReady,
>>>>>>> upstream/main
      homeserver: scoped.homeserver || undefined,
      userId: scoped.userId || undefined,
      sourceHint: `${keys.homeserver} (+ auth vars)`,
      missingMessage: `Set per-account env vars for "${normalizedAccountId}" (for example ${keys.homeserver} + ${keys.accessToken} or ${keys.userId} + ${keys.password}).`,
    };
  }

  const defaultScoped = resolveScopedMatrixEnvConfig(DEFAULT_ACCOUNT_ID, env);
  const global = resolveGlobalMatrixEnvConfig(env);
<<<<<<< HEAD
  const defaultKeys = getMatrixScopedEnvVarNames(DEFAULT_ACCOUNT_ID);
  return {
    ready: hasReadyMatrixEnvAuth(defaultScoped) || hasReadyMatrixEnvAuth(global),
=======
  const defaultScopedReady = hasReadyMatrixEnvAuth(defaultScoped);
  const globalReady = hasReadyMatrixEnvAuth(global);
  const defaultKeys = getMatrixScopedEnvVarNames(DEFAULT_ACCOUNT_ID);
  return {
    ready: defaultScopedReady || globalReady,
>>>>>>> upstream/main
    homeserver: defaultScoped.homeserver || global.homeserver || undefined,
    userId: defaultScoped.userId || global.userId || undefined,
    sourceHint: "MATRIX_* or MATRIX_DEFAULT_*",
    missingMessage:
      `Set Matrix env vars for the default account ` +
      `(for example MATRIX_HOMESERVER + MATRIX_ACCESS_TOKEN, MATRIX_USER_ID + MATRIX_PASSWORD, ` +
      `or ${defaultKeys.homeserver} + ${defaultKeys.accessToken}).`,
  };
}
