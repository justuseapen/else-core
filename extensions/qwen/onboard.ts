<<<<<<< HEAD
=======
// Qwen setup module handles plugin onboarding behavior.
>>>>>>> upstream/main
import {
  createModelCatalogPresetAppliers,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import {
  QWEN_CN_BASE_URL,
  QWEN_DEFAULT_MODEL_REF,
  QWEN_GLOBAL_BASE_URL,
<<<<<<< HEAD
  QWEN_STANDARD_CN_BASE_URL,
  QWEN_STANDARD_GLOBAL_BASE_URL,
} from "./models.js";
import { buildQwenProvider } from "./provider-catalog.js";

export {
  QWEN_CN_BASE_URL,
  QWEN_DEFAULT_MODEL_REF,
  QWEN_GLOBAL_BASE_URL,
  QWEN_STANDARD_CN_BASE_URL,
  QWEN_STANDARD_GLOBAL_BASE_URL,
};
=======
  QWEN_OAUTH_DEFAULT_MODEL_REF,
  QWEN_OAUTH_PROVIDER_ID,
  QWEN_STANDARD_CN_BASE_URL,
  QWEN_STANDARD_GLOBAL_BASE_URL,
} from "./models.js";
import { buildQwenOAuthProvider, buildQwenProvider } from "./provider-catalog.js";
>>>>>>> upstream/main

const qwenPresetAppliers = createModelCatalogPresetAppliers<[string]>({
  primaryModelRef: QWEN_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig, baseUrl: string) => {
<<<<<<< HEAD
    const provider = buildQwenProvider();
=======
    const provider = buildQwenProvider({ baseUrl });
>>>>>>> upstream/main
    return {
      providerId: "qwen",
      api: provider.api ?? "openai-completions",
      baseUrl,
      catalogModels: provider.models ?? [],
      aliases: [
        ...(provider.models ?? []).flatMap((model) => [
          `qwen/${model.id}`,
          `modelstudio/${model.id}`,
        ]),
        { modelRef: QWEN_DEFAULT_MODEL_REF, alias: "Qwen" },
      ],
    };
  },
});

<<<<<<< HEAD
export function applyQwenProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_GLOBAL_BASE_URL);
}

export function applyQwenProviderConfigCn(cfg: OpenClawConfig): OpenClawConfig {
=======
const qwenOAuthPresetAppliers = createModelCatalogPresetAppliers<[]>({
  primaryModelRef: QWEN_OAUTH_DEFAULT_MODEL_REF,
  resolveParams: () => {
    const provider = buildQwenOAuthProvider();
    return {
      providerId: QWEN_OAUTH_PROVIDER_ID,
      api: provider.api ?? "openai-completions",
      baseUrl: provider.baseUrl,
      catalogModels: provider.models ?? [],
      aliases: [
        ...(provider.models ?? []).map((model) => `qwen-oauth/${model.id}`),
        { modelRef: QWEN_OAUTH_DEFAULT_MODEL_REF, alias: "Qwen OAuth" },
      ],
    };
  },
});

function applyQwenProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_GLOBAL_BASE_URL);
}

function applyQwenProviderConfigCn(cfg: OpenClawConfig): OpenClawConfig {
>>>>>>> upstream/main
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_CN_BASE_URL);
}

export function applyQwenConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyConfig(cfg, QWEN_GLOBAL_BASE_URL);
}

export function applyQwenConfigCn(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyConfig(cfg, QWEN_CN_BASE_URL);
}

<<<<<<< HEAD
export function applyQwenStandardProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_STANDARD_GLOBAL_BASE_URL);
}

export function applyQwenStandardProviderConfigCn(cfg: OpenClawConfig): OpenClawConfig {
=======
function applyQwenStandardProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_STANDARD_GLOBAL_BASE_URL);
}

function applyQwenStandardProviderConfigCn(cfg: OpenClawConfig): OpenClawConfig {
>>>>>>> upstream/main
  return qwenPresetAppliers.applyProviderConfig(cfg, QWEN_STANDARD_CN_BASE_URL);
}

export function applyQwenStandardConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_GLOBAL_BASE_URL);
}

export function applyQwenStandardConfigCn(cfg: OpenClawConfig): OpenClawConfig {
  return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_CN_BASE_URL);
}

<<<<<<< HEAD
=======
export function applyQwenOAuthConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qwenOAuthPresetAppliers.applyConfig(cfg);
}

>>>>>>> upstream/main
export const applyModelStudioProviderConfig = applyQwenProviderConfig;
export const applyModelStudioProviderConfigCn = applyQwenProviderConfigCn;
export const applyModelStudioConfig = applyQwenConfig;
export const applyModelStudioConfigCn = applyQwenConfigCn;
export const applyModelStudioStandardProviderConfig = applyQwenStandardProviderConfig;
export const applyModelStudioStandardProviderConfigCn = applyQwenStandardProviderConfigCn;
export const applyModelStudioStandardConfig = applyQwenStandardConfig;
export const applyModelStudioStandardConfigCn = applyQwenStandardConfigCn;
