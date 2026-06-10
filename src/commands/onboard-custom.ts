<<<<<<< HEAD
import { CONTEXT_WINDOW_HARD_MIN_TOKENS } from "../agents/context-window-guard.js";
import { DEFAULT_PROVIDER } from "../agents/defaults.js";
import { buildModelAliasIndex, modelKey } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ModelProviderConfig } from "../config/types.models.js";
import { isSecretRef, type SecretInput } from "../config/types.secrets.js";
import { OLLAMA_DEFAULT_BASE_URL } from "../plugins/provider-model-defaults.js";
=======
/**
 * Interactive custom provider onboarding prompts and endpoint verification.
 *
 * The pure config helpers are re-exported from here because setup and configure
 * flows import this command module as their custom API entrypoint.
 */
import { modelKey } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretInput } from "../config/types.secrets.js";
import { ensureApiKeyFromEnvOrPrompt } from "../plugins/provider-auth-input.js";
>>>>>>> upstream/main
import type { RuntimeEnv } from "../runtime.js";
import { fetchWithTimeout } from "../utils/fetch-timeout.js";
import { normalizeSecretInput } from "../utils/normalize-secret-input.js";
import { t } from "../wizard/i18n/index.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import {
  applyCustomApiConfig,
  buildAnthropicVerificationProbeRequest,
  buildEndpointIdFromUrl,
  buildOpenAiVerificationProbeRequest,
  normalizeEndpointId,
  normalizeOptionalProviderApiKey,
  resolveCustomModelAliasError,
  resolveCustomModelImageInputInference,
  resolveCustomProviderId,
  type CustomApiCompatibility,
  type CustomApiResult,
} from "./onboard-custom-config.js";
export {
  applyCustomApiConfig,
  buildAnthropicVerificationProbeRequest,
  buildOpenAiVerificationProbeRequest,
  CustomApiError,
  inferCustomModelSupportsImageInput,
  parseNonInteractiveCustomApiFlags,
  resolveCustomModelImageInputInference,
  resolveCustomProviderId,
  type ApplyCustomApiConfigParams,
  type CustomApiCompatibility,
  type CustomApiErrorCode,
  type CustomModelImageInputInference,
  type CustomApiResult,
  type ParseNonInteractiveCustomApiFlagsParams,
  type ParsedNonInteractiveCustomApiFlags,
  type ResolveCustomProviderIdParams,
  type ResolvedCustomProviderId,
} from "./onboard-custom-config.js";
import type { SecretInputMode } from "./onboard-types.js";

const VERIFY_TIMEOUT_MS = 30_000;
<<<<<<< HEAD

function normalizeContextWindowForCustomModel(value: unknown): number {
  const parsed = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
  return parsed >= CONTEXT_WINDOW_HARD_MIN_TOKENS ? parsed : CONTEXT_WINDOW_HARD_MIN_TOKENS;
}

function isAzureFoundryUrl(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    const host = url.hostname.toLowerCase();
    return host.endsWith(".services.ai.azure.com");
  } catch {
    return false;
  }
}

function isAzureOpenAiUrl(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    const host = url.hostname.toLowerCase();
    return host.endsWith(".openai.azure.com");
  } catch {
    return false;
  }
}

function isAzureUrl(baseUrl: string): boolean {
  return isAzureFoundryUrl(baseUrl) || isAzureOpenAiUrl(baseUrl);
}

/**
 * Transforms an Azure AI Foundry/OpenAI URL to include the deployment path.
 * Azure requires: https://host/openai/deployments/<model-id>/chat/completions?api-version=2024-xx-xx-preview
 * But we can't add query params here, so we just add the path prefix.
 * The api-version will be handled by the Azure OpenAI client or as a query param.
 *
 * Example:
 *   https://my-resource.services.ai.azure.com + gpt-5.4-nano
 *   => https://my-resource.services.ai.azure.com/openai/deployments/gpt-5.4-nano
 */
function transformAzureUrl(baseUrl: string, modelId: string): string {
  const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  // Check if the URL already includes the deployment path
  if (normalizedUrl.includes("/openai/deployments/")) {
    return normalizedUrl;
  }
  return `${normalizedUrl}/openai/deployments/${modelId}`;
}

/**
 * Transforms an Azure URL into the base URL stored in config.
 *
 * Example:
 *   https://my-resource.openai.azure.com
 *   => https://my-resource.openai.azure.com/openai/v1
 */
function transformAzureConfigUrl(baseUrl: string): string {
  const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (normalizedUrl.endsWith("/openai/v1")) {
    return normalizedUrl;
  }
  // Strip a full deployment path back to the base origin
  const deploymentIdx = normalizedUrl.indexOf("/openai/deployments/");
  const base = deploymentIdx !== -1 ? normalizedUrl.slice(0, deploymentIdx) : normalizedUrl;
  return `${base}/openai/v1`;
}

function hasSameHost(a: string, b: string): boolean {
  try {
    return new URL(a).hostname.toLowerCase() === new URL(b).hostname.toLowerCase();
  } catch {
    return false;
  }
}

export type CustomApiCompatibility = "openai" | "anthropic";
=======
>>>>>>> upstream/main
type CustomApiCompatibilityChoice = CustomApiCompatibility | "unknown";

const COMPATIBILITY_OPTIONS: Array<{
  value: CustomApiCompatibilityChoice;
  labelKey: string;
  hintKey: string;
}> = [
  {
    value: "openai",
    labelKey: "wizard.customProvider.compatibilityOpenAi",
    hintKey: "wizard.customProvider.compatibilityOpenAiHint",
  },
  {
    value: "openai-responses",
    labelKey: "wizard.customProvider.compatibilityOpenAiResponses",
    hintKey: "wizard.customProvider.compatibilityOpenAiResponsesHint",
  },
  {
    value: "anthropic",
    labelKey: "wizard.customProvider.compatibilityAnthropic",
    hintKey: "wizard.customProvider.compatibilityAnthropicHint",
  },
  {
    value: "unknown",
    labelKey: "wizard.customProvider.compatibilityUnknown",
    hintKey: "wizard.customProvider.compatibilityUnknownHint",
  },
];

function formatVerificationError(error: unknown): string {
  if (!error) {
    return "unknown error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown error";
  }
}

type VerificationResult = {
  ok: boolean;
  status?: number;
  error?: unknown;
};

function isJsonVerificationResponse(res: Response): boolean {
  const contentType =
    typeof res.headers?.get === "function" ? (res.headers.get("content-type") ?? "") : "";
  if (!contentType.trim()) {
    return true;
  }
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return (
    mediaType === "application/json" || (mediaType !== undefined && mediaType.endsWith("+json"))
  );
}

async function requestVerification(params: {
  endpoint: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}): Promise<VerificationResult> {
  try {
    const res = await fetchWithTimeout(
      params.endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...params.headers,
        },
        body: JSON.stringify(params.body),
      },
      VERIFY_TIMEOUT_MS,
    );
    if (res.ok && !isJsonVerificationResponse(res)) {
      const contentType = res.headers.get("content-type") || "missing content-type";
      // HTML success often means the user pasted a dashboard/root URL instead
      // of the API base path; fail before storing a config that cannot run.
      return {
        ok: false,
        error: `Verification returned ${contentType} instead of JSON. Check the provider base URL; OpenAI-compatible endpoints usually need a /v1 path prefix.`,
      };
    }
    return { ok: res.ok, status: res.status };
  } catch (error) {
    return { ok: false, error };
  }
}

async function requestOpenAiVerification(params: {
  baseUrl: string;
  apiKey: string;
  modelId: string;
  responsesApi?: boolean;
}): Promise<VerificationResult> {
  return await requestVerification(buildOpenAiVerificationProbeRequest(params));
}

async function requestAnthropicVerification(params: {
  baseUrl: string;
  apiKey: string;
  modelId: string;
}): Promise<VerificationResult> {
  return await requestVerification(buildAnthropicVerificationProbeRequest(params));
}

async function promptBaseUrlAndKey(params: {
  prompter: WizardPrompter;
  config: OpenClawConfig;
  secretInputMode?: SecretInputMode;
  initialBaseUrl?: string;
}): Promise<{ baseUrl: string; apiKey?: SecretInput; resolvedApiKey: string }> {
  const baseUrlInput = await params.prompter.text({
    message: t("wizard.customProvider.apiBaseUrl"),
    initialValue: params.initialBaseUrl,
    placeholder: "https://api.example.com/v1",
    validate: (val) => {
      return URL.canParse(val) ? undefined : t("wizard.customProvider.validUrl");
    },
  });
  const baseUrl = baseUrlInput.trim();
  const providerHint = buildEndpointIdFromUrl(baseUrl) || "custom";
  let apiKeyInput: SecretInput | undefined;
  // Keep the persisted key shape from the credential helper while also keeping
  // the resolved plaintext only for the immediate verification probe.
  const resolvedApiKey = await ensureApiKeyFromEnvOrPrompt({
    config: params.config,
    provider: providerHint,
    envLabel: "CUSTOM_API_KEY",
    promptMessage: t("wizard.customProvider.apiKeyPrompt"),
    normalize: normalizeSecretInput,
    validate: () => undefined,
    prompter: params.prompter,
    secretInputMode: params.secretInputMode,
    setCredential: async (apiKey) => {
      apiKeyInput = apiKey;
    },
  });
  return {
    baseUrl,
    apiKey: normalizeOptionalProviderApiKey(apiKeyInput),
    resolvedApiKey: normalizeSecretInput(resolvedApiKey),
  };
}

type CustomApiRetryChoice = "baseUrl" | "model" | "both";

async function promptCustomApiRetryChoice(prompter: WizardPrompter): Promise<CustomApiRetryChoice> {
  return await prompter.select({
    message: t("wizard.customProvider.retryChoice"),
    options: [
      { value: "baseUrl", label: t("wizard.customProvider.changeBaseUrl") },
      { value: "model", label: t("wizard.customProvider.changeModel") },
      { value: "both", label: t("wizard.customProvider.changeBaseUrlAndModel") },
    ],
  });
}

async function promptCustomApiModelId(prompter: WizardPrompter): Promise<string> {
  return (
    await prompter.text({
      message: t("wizard.customProvider.modelId"),
      placeholder: t("wizard.customProvider.modelIdPlaceholder"),
      validate: (val) => (val.trim() ? undefined : t("wizard.customProvider.modelIdRequired")),
    })
  ).trim();
}

async function applyCustomApiRetryChoice(params: {
  prompter: WizardPrompter;
  config: OpenClawConfig;
  secretInputMode?: SecretInputMode;
  retryChoice: CustomApiRetryChoice;
  current: { baseUrl: string; apiKey?: SecretInput; resolvedApiKey: string; modelId: string };
}): Promise<{ baseUrl: string; apiKey?: SecretInput; resolvedApiKey: string; modelId: string }> {
  let { baseUrl, apiKey, resolvedApiKey, modelId } = params.current;
  if (params.retryChoice === "baseUrl" || params.retryChoice === "both") {
    const retryInput = await promptBaseUrlAndKey({
      prompter: params.prompter,
      config: params.config,
      secretInputMode: params.secretInputMode,
      initialBaseUrl: baseUrl,
    });
    baseUrl = retryInput.baseUrl;
    apiKey = retryInput.apiKey;
    resolvedApiKey = retryInput.resolvedApiKey;
  }
  if (params.retryChoice === "model" || params.retryChoice === "both") {
    modelId = await promptCustomApiModelId(params.prompter);
  }
  return { baseUrl, apiKey, resolvedApiKey, modelId };
}

<<<<<<< HEAD
function resolveProviderApi(
  compatibility: CustomApiCompatibility,
): "openai-completions" | "anthropic-messages" {
  return compatibility === "anthropic" ? "anthropic-messages" : "openai-completions";
}

function parseCustomApiCompatibility(raw?: string): CustomApiCompatibility {
  const compatibilityRaw = raw?.trim().toLowerCase();
  if (!compatibilityRaw) {
    return "openai";
  }
  if (compatibilityRaw !== "openai" && compatibilityRaw !== "anthropic") {
    throw new CustomApiError(
      "invalid_compatibility",
      'Invalid --custom-compatibility (use "openai" or "anthropic").',
    );
  }
  return compatibilityRaw;
}

export function resolveCustomProviderId(
  params: ResolveCustomProviderIdParams,
): ResolvedCustomProviderId {
  const providers = params.config.models?.providers ?? {};
  const baseUrl = params.baseUrl.trim();
  const explicitProviderId = params.providerId?.trim();
  if (explicitProviderId && !normalizeEndpointId(explicitProviderId)) {
    throw new CustomApiError(
      "invalid_provider_id",
      "Custom provider ID must include letters, numbers, or hyphens.",
    );
  }
  const requestedProviderId = explicitProviderId || buildEndpointIdFromUrl(baseUrl);
  const providerIdResult = resolveUniqueEndpointId({
    requestedId: requestedProviderId,
    baseUrl,
    providers,
  });

  return {
    providerId: providerIdResult.providerId,
    ...(providerIdResult.renamed
      ? {
          providerIdRenamedFrom: normalizeEndpointId(requestedProviderId) || "custom",
        }
      : {}),
  };
}

export function parseNonInteractiveCustomApiFlags(
  params: ParseNonInteractiveCustomApiFlagsParams,
): ParsedNonInteractiveCustomApiFlags {
  const baseUrl = params.baseUrl?.trim() ?? "";
  const modelId = params.modelId?.trim() ?? "";
  if (!baseUrl || !modelId) {
    throw new CustomApiError(
      "missing_required",
      [
        'Auth choice "custom-api-key" requires a base URL and model ID.',
        "Use --custom-base-url and --custom-model-id.",
      ].join("\n"),
    );
  }

  const apiKey = params.apiKey?.trim();
  const providerId = params.providerId?.trim();
  if (providerId && !normalizeEndpointId(providerId)) {
    throw new CustomApiError(
      "invalid_provider_id",
      "Custom provider ID must include letters, numbers, or hyphens.",
    );
  }
  return {
    baseUrl,
    modelId,
    compatibility: parseCustomApiCompatibility(params.compatibility),
    ...(apiKey ? { apiKey } : {}),
    ...(providerId ? { providerId } : {}),
  };
}

export function applyCustomApiConfig(params: ApplyCustomApiConfigParams): CustomApiResult {
  const baseUrl = params.baseUrl.trim();
  try {
    new URL(baseUrl);
  } catch {
    throw new CustomApiError("invalid_base_url", "Custom provider base URL must be a valid URL.");
  }

  if (params.compatibility !== "openai" && params.compatibility !== "anthropic") {
    throw new CustomApiError(
      "invalid_compatibility",
      'Custom provider compatibility must be "openai" or "anthropic".',
    );
  }

  const modelId = params.modelId.trim();
  if (!modelId) {
    throw new CustomApiError("invalid_model_id", "Custom provider model ID is required.");
  }

  const isAzure = isAzureUrl(baseUrl);
  const isAzureOpenAi = isAzureOpenAiUrl(baseUrl);
  const resolvedBaseUrl = isAzure ? transformAzureConfigUrl(baseUrl) : baseUrl;

  const providerIdResult = resolveCustomProviderId({
    config: params.config,
    baseUrl: resolvedBaseUrl,
    providerId: params.providerId,
  });
  const providerId = providerIdResult.providerId;
  const providers = params.config.models?.providers ?? {};

  const modelRef = modelKey(providerId, modelId);
  const alias = params.alias?.trim() ?? "";
  const aliasError = resolveAliasError({
    raw: alias,
    cfg: params.config,
    modelRef,
  });
  if (aliasError) {
    throw new CustomApiError("invalid_alias", aliasError);
  }

  const existingProvider = providers[providerId];
  const existingModels = Array.isArray(existingProvider?.models) ? existingProvider.models : [];
  const hasModel = existingModels.some((model) => model.id === modelId);
  const isLikelyReasoningModel = isAzure && /\b(o[134]|gpt-([5-9]|\d{2,}))\b/i.test(modelId);
  const nextModel = isAzure
    ? {
        id: modelId,
        name: `${modelId} (Custom Provider)`,
        contextWindow: AZURE_DEFAULT_CONTEXT_WINDOW,
        maxTokens: AZURE_DEFAULT_MAX_TOKENS,
        input: isLikelyReasoningModel
          ? (["text", "image"] as Array<"text" | "image">)
          : (["text"] as ["text"]),
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        reasoning: isLikelyReasoningModel,
        compat: { supportsStore: false },
      }
    : {
        id: modelId,
        name: `${modelId} (Custom Provider)`,
        contextWindow: DEFAULT_CONTEXT_WINDOW,
        maxTokens: DEFAULT_MAX_TOKENS,
        input: ["text"] as ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        reasoning: false,
      };
  const mergedModels = hasModel
    ? existingModels.map((model) =>
        model.id === modelId
          ? {
              ...model,
              ...(isAzure ? nextModel : {}),
              name: model.name ?? nextModel.name,
              cost: model.cost ?? nextModel.cost,
              contextWindow: normalizeContextWindowForCustomModel(model.contextWindow),
              maxTokens: model.maxTokens ?? nextModel.maxTokens,
            }
          : model,
      )
    : [...existingModels, nextModel];
  const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {};
  const normalizedApiKey =
    normalizeOptionalProviderApiKey(params.apiKey) ??
    normalizeOptionalProviderApiKey(existingApiKey);

  const providerApi = isAzureOpenAi
    ? ("azure-openai-responses" as const)
    : resolveProviderApi(params.compatibility);
  const azureHeaders = isAzure && normalizedApiKey ? { "api-key": normalizedApiKey } : undefined;

  let config: OpenClawConfig = {
    ...params.config,
    models: {
      ...params.config.models,
      mode: params.config.models?.mode ?? "merge",
      providers: {
        ...providers,
        [providerId]: {
          ...existingProviderRest,
          baseUrl: resolvedBaseUrl,
          api: providerApi,
          ...(normalizedApiKey ? { apiKey: normalizedApiKey } : {}),
          ...(isAzure ? { authHeader: false } : {}),
          ...(azureHeaders ? { headers: azureHeaders } : {}),
          models: mergedModels.length > 0 ? mergedModels : [nextModel],
        },
      },
    },
  };

  config = applyPrimaryModel(config, modelRef);
  if (isAzure && isLikelyReasoningModel) {
    const existingPerModelThinking = config.agents?.defaults?.models?.[modelRef]?.params?.thinking;
    if (!existingPerModelThinking) {
      config = {
        ...config,
        agents: {
          ...config.agents,
          defaults: {
            ...config.agents?.defaults,
            models: {
              ...config.agents?.defaults?.models,
              [modelRef]: {
                ...config.agents?.defaults?.models?.[modelRef],
                params: {
                  ...config.agents?.defaults?.models?.[modelRef]?.params,
                  thinking: "medium",
                },
              },
            },
          },
        },
      };
    }
  }
  if (alias) {
    config = {
      ...config,
      agents: {
        ...config.agents,
        defaults: {
          ...config.agents?.defaults,
          models: {
            ...config.agents?.defaults?.models,
            [modelRef]: {
              ...config.agents?.defaults?.models?.[modelRef],
              alias,
            },
          },
        },
      },
    };
  }

  return {
    config,
    providerId,
    modelId,
    ...(providerIdResult.providerIdRenamedFrom
      ? { providerIdRenamedFrom: providerIdResult.providerIdRenamedFrom }
      : {}),
  };
}

=======
/** Prompts for a custom API provider, verifies it, and persists the selected model. */
>>>>>>> upstream/main
export async function promptCustomApiConfig(params: {
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  config: OpenClawConfig;
  secretInputMode?: SecretInputMode;
}): Promise<CustomApiResult> {
  const { prompter, runtime, config } = params;

  const baseInput = await promptBaseUrlAndKey({
    prompter,
    config,
    secretInputMode: params.secretInputMode,
  });
  let baseUrl = baseInput.baseUrl;
  let apiKey = baseInput.apiKey;
  let resolvedApiKey = baseInput.resolvedApiKey;

  const compatibilityChoice = await prompter.select({
    message: t("wizard.customProvider.compatibility"),
    options: COMPATIBILITY_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
      hint: t(option.hintKey),
    })),
  });

  let modelId = await promptCustomApiModelId(prompter);

  let compatibility: CustomApiCompatibility | null =
    compatibilityChoice === "unknown" ? null : compatibilityChoice;

  while (true) {
    let verifiedFromProbe = false;
    if (!compatibility) {
      // Probe in a fixed order so unknown endpoints converge to a concrete
      // config API value before we write provider metadata.
      const probeSpinner = prompter.progress(t("wizard.customProvider.detectionProgress"));
      const openaiProbe = await requestOpenAiVerification({
        baseUrl,
        apiKey: resolvedApiKey,
        modelId,
      });
      if (openaiProbe.ok) {
        probeSpinner.stop(t("wizard.customProvider.detectedOpenAi"));
        compatibility = "openai";
        verifiedFromProbe = true;
      } else {
        const openaiResponsesProbe = await requestOpenAiVerification({
          baseUrl,
          apiKey: resolvedApiKey,
          modelId,
          responsesApi: true,
        });
        if (openaiResponsesProbe.ok) {
          probeSpinner.stop(t("wizard.customProvider.detectedOpenAiResponses"));
          compatibility = "openai-responses";
          verifiedFromProbe = true;
        } else {
          const anthropicProbe = await requestAnthropicVerification({
            baseUrl,
            apiKey: resolvedApiKey,
            modelId,
          });
          if (anthropicProbe.ok) {
            probeSpinner.stop(t("wizard.customProvider.detectedAnthropic"));
            compatibility = "anthropic";
            verifiedFromProbe = true;
          } else {
            probeSpinner.stop(t("wizard.customProvider.detectionFailed"));
            await prompter.note(
              t("wizard.customProvider.detectionFailedNote"),
              t("wizard.customProvider.detectionNoteTitle"),
            );
            const retryChoice = await promptCustomApiRetryChoice(prompter);
            ({ baseUrl, apiKey, resolvedApiKey, modelId } = await applyCustomApiRetryChoice({
              prompter,
              config,
              secretInputMode: params.secretInputMode,
              retryChoice,
              current: { baseUrl, apiKey, resolvedApiKey, modelId },
            }));
            continue;
          }
        }
      }
    }

    if (verifiedFromProbe) {
      break;
    }

    // Explicit compatibility choices still get a live probe so setup does not
    // persist endpoints or models that fail the selected protocol.
    const verifySpinner = prompter.progress(t("wizard.customProvider.verifying"));
    const result =
      compatibility === "anthropic"
        ? await requestAnthropicVerification({ baseUrl, apiKey: resolvedApiKey, modelId })
        : await requestOpenAiVerification({
            baseUrl,
            apiKey: resolvedApiKey,
            modelId,
            responsesApi: compatibility === "openai-responses",
          });
    if (result.ok) {
      verifySpinner.stop(t("wizard.customProvider.verificationSuccessful"));
      break;
    }
    if (result.error !== undefined) {
      verifySpinner.stop(
        t("wizard.customProvider.verificationFailedError", {
          error: formatVerificationError(result.error),
        }),
      );
    } else {
      verifySpinner.stop(
        t("wizard.customProvider.verificationFailedStatus", { status: result.status }),
      );
    }
    const retryChoice = await promptCustomApiRetryChoice(prompter);
    ({ baseUrl, apiKey, resolvedApiKey, modelId } = await applyCustomApiRetryChoice({
      prompter,
      config,
      secretInputMode: params.secretInputMode,
      retryChoice,
      current: { baseUrl, apiKey, resolvedApiKey, modelId },
    }));
    if (compatibilityChoice === "unknown") {
      compatibility = null;
    }
  }

  const suggestedId = buildEndpointIdFromUrl(baseUrl);
  const providerIdInput = await prompter.text({
    message: t("wizard.customProvider.endpointId"),
    initialValue: suggestedId,
    placeholder: "custom",
    validate: (value) => {
      const normalized = normalizeEndpointId(value);
      if (!normalized) {
        return t("wizard.customProvider.endpointIdRequired");
      }
      return undefined;
    },
  });
  const aliasInput = await prompter.text({
    message: t("wizard.customProvider.modelAlias"),
    placeholder: t("wizard.customProvider.modelAliasPlaceholder"),
    initialValue: "",
    validate: (value) => {
      const resolvedProvider = resolveCustomProviderId({
        config,
        baseUrl,
        providerId: providerIdInput,
      });
      // Alias validation must use the post-collision provider id, otherwise a
      // renamed endpoint could incorrectly collide with the requested id.
      const modelRef = modelKey(resolvedProvider.providerId, modelId);
      return resolveCustomModelAliasError({ raw: value, cfg: config, modelRef });
    },
  });
  const imageInputInference = resolveCustomModelImageInputInference(modelId);
  const supportsImageInput =
    imageInputInference.confidence === "known"
      ? imageInputInference.supportsImageInput
      : await prompter.confirm({
          message: t("wizard.customProvider.imageInput"),
          initialValue: imageInputInference.supportsImageInput,
        });
  const resolvedCompatibility = compatibility ?? "openai";
  const result = applyCustomApiConfig({
    config,
    baseUrl,
    modelId,
    compatibility: resolvedCompatibility,
    apiKey,
    providerId: providerIdInput,
    alias: aliasInput,
    supportsImageInput,
  });

  if (result.providerIdRenamedFrom && result.providerId) {
    await prompter.note(
      t("wizard.customProvider.endpointIdRenamed", {
        from: result.providerIdRenamedFrom,
        to: result.providerId,
      }),
      t("wizard.customProvider.endpointIdTitle"),
    );
  }

  runtime.log(`Configured custom provider: ${result.providerId}/${result.modelId}`);
  return result;
}
