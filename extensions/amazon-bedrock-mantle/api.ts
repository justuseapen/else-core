<<<<<<< HEAD
export {
  discoverMantleModels,
  generateBearerTokenFromIam,
=======
/**
 * Public Amazon Bedrock Mantle API barrel for discovery and bearer-token
 * helpers shared by config, runtime, and tests.
 */
export {
  discoverMantleModels,
  generateBearerTokenFromIam,
  getCachedIamToken,
  MANTLE_IAM_TOKEN_MARKER,
>>>>>>> upstream/main
  mergeImplicitMantleProvider,
  resetIamTokenCacheForTest,
  resetMantleDiscoveryCacheForTest,
  resolveImplicitMantleProvider,
  resolveMantleBearerToken,
<<<<<<< HEAD
=======
  resolveMantleRuntimeBearerToken,
>>>>>>> upstream/main
} from "./discovery.js";
