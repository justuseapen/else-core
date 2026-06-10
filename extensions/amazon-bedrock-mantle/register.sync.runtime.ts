<<<<<<< HEAD
=======
/**
 * Synchronous Amazon Bedrock Mantle provider registration. It wires discovery,
 * runtime bearer-token preparation, stream wrappers, and failover classifiers.
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
>>>>>>> upstream/main
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
import {
  mergeImplicitMantleProvider,
  resolveImplicitMantleProvider,
  resolveMantleBearerToken,
<<<<<<< HEAD
} from "./discovery.js";

export function registerBedrockMantlePlugin(api: OpenClawPluginApi): void {
  const providerId = "amazon-bedrock-mantle";
=======
  resolveMantleRuntimeBearerToken,
} from "./discovery.js";
import { createMantleAnthropicStreamFn } from "./mantle-anthropic.runtime.js";

type BedrockMantlePluginConfig = {
  discovery?: {
    enabled?: boolean;
  };
};

/** Register the Amazon Bedrock Mantle provider with OpenClaw. */
export function registerBedrockMantlePlugin(api: OpenClawPluginApi): void {
  const providerId = "amazon-bedrock-mantle";
  const startupPluginConfig = (api.pluginConfig ?? {}) as BedrockMantlePluginConfig;

  function resolveCurrentPluginConfig(
    config: OpenClawConfig | undefined,
  ): BedrockMantlePluginConfig | undefined {
    const runtimePluginConfig = resolvePluginConfigObject(config, providerId);
    return (
      (runtimePluginConfig as BedrockMantlePluginConfig | undefined) ??
      (config ? undefined : startupPluginConfig)
    );
  }
>>>>>>> upstream/main

  api.registerProvider({
    id: providerId,
    label: "Amazon Bedrock Mantle (OpenAI-compatible)",
    docsPath: "/providers/bedrock-mantle",
    auth: [],
    catalog: {
      order: "simple",
      run: async (ctx) => {
<<<<<<< HEAD
        const implicit = await resolveImplicitMantleProvider({
          env: ctx.env,
=======
        const currentPluginConfig = resolveCurrentPluginConfig(ctx.config);
        const implicit = await resolveImplicitMantleProvider({
          env: ctx.env,
          pluginConfig: currentPluginConfig,
>>>>>>> upstream/main
        });
        if (!implicit) {
          return null;
        }
        return {
          provider: mergeImplicitMantleProvider({
            existing: ctx.config.models?.providers?.[providerId],
            implicit,
          }),
        };
      },
    },
    resolveConfigApiKey: ({ env }) =>
<<<<<<< HEAD
      resolveMantleBearerToken(env) ? "AWS_BEARER_TOKEN_BEDROCK" : undefined,
=======
      resolveMantleBearerToken(env) ? "env:AWS_BEARER_TOKEN_BEDROCK" : undefined,
    prepareRuntimeAuth: async ({ apiKey, env }) =>
      await resolveMantleRuntimeBearerToken({
        apiKey,
        env,
      }),
    createStreamFn: ({ model }) =>
      model.api === "anthropic-messages" ? createMantleAnthropicStreamFn() : undefined,
>>>>>>> upstream/main
    matchesContextOverflowError: ({ errorMessage }) =>
      /context_length_exceeded|max.*tokens.*exceeded/i.test(errorMessage),
    classifyFailoverReason: ({ errorMessage }) => {
      if (/rate_limit|too many requests|429/i.test(errorMessage)) {
        return "rate_limit";
      }
<<<<<<< HEAD
      if (/overloaded|503/i.test(errorMessage)) {
=======
      if (/overloaded|503|service.*unavailable/i.test(errorMessage)) {
>>>>>>> upstream/main
        return "overloaded";
      }
      return undefined;
    },
  });
}
