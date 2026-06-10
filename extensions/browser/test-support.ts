<<<<<<< HEAD
export {
  createCliRuntimeCapture,
  createTempHomeEnv,
  expectGeneratedTokenPersistedToGatewayAuth,
  type CliMockOutputRuntime,
  type CliRuntimeCapture,
  type FetchMock,
  type TempHomeEnv,
=======
/**
 * Browser test-support re-exports from shared plugin-sdk test fixtures.
 */
export {
  createCliRuntimeCapture,
  expectGeneratedTokenPersistedToGatewayAuth,
  type CliMockOutputRuntime,
  type CliRuntimeCapture,
} from "openclaw/plugin-sdk/test-fixtures";
export {
  createTempHomeEnv,
>>>>>>> upstream/main
  withEnv,
  withEnvAsync,
  withFetchPreconnect,
  isLiveTestEnabled,
<<<<<<< HEAD
  type OpenClawConfig,
} from "openclaw/plugin-sdk/testing";
=======
} from "openclaw/plugin-sdk/test-env";
export type { FetchMock, TempHomeEnv } from "openclaw/plugin-sdk/test-env";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main
