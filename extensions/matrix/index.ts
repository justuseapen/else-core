<<<<<<< HEAD
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/channel-entry-contract";
import { registerMatrixCliMetadata } from "./cli-metadata.js";

=======
// Matrix plugin entrypoint registers its OpenClaw integration.
import {
  defineBundledChannelEntry,
  type OpenClawPluginApi,
} from "openclaw/plugin-sdk/channel-entry-contract";
import { registerMatrixCliMetadata } from "./cli-metadata.js";
import { registerMatrixSubagentHooks } from "./subagent-hooks-api.js";

type MatrixHandlersRuntimeModule = typeof import("./plugin-entry.handlers.runtime.js");

let matrixHandlersRuntimePromise: Promise<MatrixHandlersRuntimeModule> | null = null;

function loadMatrixHandlersRuntimeModule() {
  matrixHandlersRuntimePromise ??= import("./plugin-entry.handlers.runtime.js");
  return matrixHandlersRuntimePromise;
}

export function registerMatrixFullRuntime(api: OpenClawPluginApi): void {
  api.registerGatewayMethod("matrix.verify.recoveryKey", async (ctx) => {
    const { handleVerifyRecoveryKey } = await loadMatrixHandlersRuntimeModule();
    await handleVerifyRecoveryKey(ctx);
  });

  api.registerGatewayMethod("matrix.verify.bootstrap", async (ctx) => {
    const { handleVerificationBootstrap } = await loadMatrixHandlersRuntimeModule();
    await handleVerificationBootstrap(ctx);
  });

  api.registerGatewayMethod("matrix.verify.status", async (ctx) => {
    const { handleVerificationStatus } = await loadMatrixHandlersRuntimeModule();
    await handleVerificationStatus(ctx);
  });

  registerMatrixSubagentHooks(api);
}

>>>>>>> upstream/main
export default defineBundledChannelEntry({
  id: "matrix",
  name: "Matrix",
  description: "Matrix channel plugin (matrix-js-sdk)",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "matrixPlugin",
<<<<<<< HEAD
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setMatrixRuntime",
  },
  registerCliMetadata: registerMatrixCliMetadata,
  registerFull(api) {
    void import("./plugin-entry.handlers.runtime.js")
      .then(({ ensureMatrixCryptoRuntime }) =>
        ensureMatrixCryptoRuntime({ log: api.logger.info }).catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          api.logger.warn?.(`matrix: crypto runtime bootstrap failed: ${message}`);
        }),
      )
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        api.logger.warn?.(`matrix: failed loading crypto bootstrap runtime: ${message}`);
      });

    api.registerGatewayMethod("matrix.verify.recoveryKey", async (ctx) => {
      const { handleVerifyRecoveryKey } = await import("./plugin-entry.handlers.runtime.js");
      await handleVerifyRecoveryKey(ctx);
    });

    api.registerGatewayMethod("matrix.verify.bootstrap", async (ctx) => {
      const { handleVerificationBootstrap } = await import("./plugin-entry.handlers.runtime.js");
      await handleVerificationBootstrap(ctx);
    });

    api.registerGatewayMethod("matrix.verify.status", async (ctx) => {
      const { handleVerificationStatus } = await import("./plugin-entry.handlers.runtime.js");
      await handleVerificationStatus(ctx);
    });
=======
>>>>>>> upstream/main
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
    exportName: "setMatrixRuntime",
  },
  registerCliMetadata: registerMatrixCliMetadata,
  registerFull: registerMatrixFullRuntime,
});
