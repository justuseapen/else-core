<<<<<<< HEAD
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
=======
// Huggingface plugin entrypoint registers its OpenClaw integration.
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
>>>>>>> upstream/main
import { applyHuggingfaceConfig, HUGGINGFACE_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildHuggingfaceProvider } from "./provider-catalog.js";

const PROVIDER_ID = "huggingface";

type HuggingFacePluginConfig = {
  discovery?: {
    enabled?: boolean;
  };
};

<<<<<<< HEAD
export default definePluginEntry({
  id: PROVIDER_ID,
  name: "Hugging Face Provider",
  description: "Bundled Hugging Face provider plugin",
  register(api) {
    const pluginConfig = (api.pluginConfig ?? {}) as HuggingFacePluginConfig;
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Hugging Face",
      docsPath: "/providers/huggingface",
      envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "Hugging Face API key",
          hint: "Inference API (HF token)",
          optionKey: "huggingfaceApiKey",
          flagName: "--huggingface-api-key",
          envVar: "HUGGINGFACE_HUB_TOKEN",
          promptMessage: "Enter Hugging Face API key",
          defaultModel: HUGGINGFACE_DEFAULT_MODEL_REF,
          expectedProviders: ["huggingface"],
          applyConfig: (cfg) => applyHuggingfaceConfig(cfg),
          wizard: {
            choiceId: "huggingface-api-key",
            choiceLabel: "Hugging Face API key",
            choiceHint: "Inference API (HF token)",
            groupId: "huggingface",
            groupLabel: "Hugging Face",
            groupHint: "Inference API (HF token)",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const discoveryEnabled =
            pluginConfig.discovery?.enabled ?? ctx.config?.models?.huggingfaceDiscovery?.enabled;
          if (discoveryEnabled === false) {
            return null;
          }
          const { apiKey, discoveryApiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
          if (!apiKey) {
            return null;
          }
          return {
            provider: {
              ...(await buildHuggingfaceProvider(discoveryApiKey)),
              apiKey,
            },
          };
        },
=======
export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "Hugging Face Provider",
  description: "Bundled Hugging Face provider plugin",
  provider: {
    label: "Hugging Face",
    docsPath: "/providers/huggingface",
    envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
    auth: [
      {
        methodId: "api-key",
        label: "Hugging Face API key",
        hint: "Inference API (HF token)",
        optionKey: "huggingfaceApiKey",
        flagName: "--huggingface-api-key",
        envVar: "HUGGINGFACE_HUB_TOKEN",
        promptMessage: "Enter Hugging Face API key",
        defaultModel: HUGGINGFACE_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyHuggingfaceConfig(cfg),
>>>>>>> upstream/main
      },
    ],
    catalog: {
      order: "simple",
      run: async (ctx) => {
        const pluginEntry = ctx.config?.plugins?.entries?.[PROVIDER_ID];
        const pluginConfig =
          pluginEntry && typeof pluginEntry === "object" && pluginEntry.config
            ? (pluginEntry.config as HuggingFacePluginConfig)
            : undefined;
        const discoveryEnabled = pluginConfig?.discovery?.enabled;
        if (discoveryEnabled === false) {
          return null;
        }
        const { apiKey, discoveryApiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
        if (!apiKey) {
          return null;
        }
        return {
          provider: {
            ...(await buildHuggingfaceProvider(discoveryApiKey)),
            apiKey,
          },
        };
      },
    },
  },
});
