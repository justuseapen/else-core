<<<<<<< HEAD
=======
/**
 * Runtime bridge for provider-owned model id normalization hooks. Source and
 * built artifacts can resolve different extensions, so this module probes both
 * once and caches the result.
 */
>>>>>>> upstream/main
import { createRequire } from "node:module";

type ProviderRuntimeModule = Pick<
  typeof import("../plugins/provider-runtime.js"),
  "normalizeProviderModelIdWithPlugin"
>;

const require = createRequire(import.meta.url);
<<<<<<< HEAD
=======
// Built code loads .js while source/test paths may still resolve .ts. Try both
// once, then cache the absence to avoid repeated require work on hot paths.
>>>>>>> upstream/main
const PROVIDER_RUNTIME_CANDIDATES = [
  "../plugins/provider-runtime.js",
  "../plugins/provider-runtime.ts",
] as const;

let providerRuntimeModule: ProviderRuntimeModule | undefined;
<<<<<<< HEAD
=======
let providerRuntimeLoadAttempted = false;
>>>>>>> upstream/main

function loadProviderRuntime(): ProviderRuntimeModule | null {
  if (providerRuntimeModule) {
    return providerRuntimeModule;
  }
<<<<<<< HEAD
=======
  if (providerRuntimeLoadAttempted) {
    return null;
  }
  providerRuntimeLoadAttempted = true;
>>>>>>> upstream/main
  for (const candidate of PROVIDER_RUNTIME_CANDIDATES) {
    try {
      providerRuntimeModule = require(candidate) as ProviderRuntimeModule;
      return providerRuntimeModule;
    } catch {
      // Try source/runtime candidates in order.
    }
  }
  return null;
}

<<<<<<< HEAD
=======
/** Normalizes provider model ids through plugin runtime hooks when available. */
>>>>>>> upstream/main
export function normalizeProviderModelIdWithRuntime(params: {
  provider: string;
  context: {
    provider: string;
    modelId: string;
  };
}): string | undefined {
  return loadProviderRuntime()?.normalizeProviderModelIdWithPlugin(params);
}
