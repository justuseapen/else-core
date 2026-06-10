// Auth choice tests cover auth choice application, provider config, and credential prompts.
import fs from "node:fs/promises";
<<<<<<< HEAD
import type { OAuthCredentials } from "@mariozechner/pi-ai";
import { afterEach, describe, expect, it, vi } from "vitest";
=======
import path from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
>>>>>>> upstream/main
import { resolveAgentDir } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveAgentModelPrimaryValue } from "../config/model-input.js";
import type { ModelProviderConfig } from "../config/types.models.js";
<<<<<<< HEAD
import { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
import { providerApiKeyAuthRuntime } from "../plugins/provider-api-key-auth.runtime.js";
import type { ProviderAuthMethod, ProviderAuthResult, ProviderPlugin } from "../plugins/types.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyAuthChoice, resolvePreferredProviderForAuthChoice } from "./auth-choice.js";
import type { AuthChoice } from "./onboard-types.js";
=======
import { testing as providerAuthChoiceTesting } from "../plugins/provider-auth-choice.js";
import * as providerAuthChoices from "../plugins/provider-auth-choices.js";
import type { ProviderAuthMethod, ProviderAuthResult, ProviderPlugin } from "../plugins/types.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyAuthChoice } from "./auth-choice.apply.js";
>>>>>>> upstream/main
import {
  createAuthTestLifecycle,
  createExitThrowingRuntime,
  createWizardPrompter,
  setupAuthTestEnv,
} from "./test-wizard-helpers.js";

type DetectZaiEndpoint = (params: {
  apiKey: string;
  endpoint?: "global" | "cn" | "coding-global" | "coding-cn";
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}) => Promise<{
  endpoint: "global" | "cn" | "coding-global" | "coding-cn";
  baseUrl: string;
  modelId: string;
  note: string;
} | null>;

const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
<<<<<<< HEAD
const MINIMAX_CN_API_BASE_URL = "https://api.minimax.chat/v1";
const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";

const loginOpenAICodexOAuth = vi.hoisted(() =>
  vi.fn<() => Promise<OAuthCredentials | null>>(async () => null),
);
vi.mock("./openai-codex-oauth.js", () => ({
  loginOpenAICodexOAuth,
}));

const resolvePluginProviders = vi.hoisted(() => vi.fn<() => ProviderPlugin[]>(() => []));
vi.mock("../plugins/provider-auth-choice.runtime.js", async () => {
  const actual = await vi.importActual<typeof import("../plugins/provider-auth-choice.runtime.js")>(
    "../plugins/provider-auth-choice.runtime.js",
  );
=======
const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";

const resolvePluginProviders = vi.hoisted(() => vi.fn<() => ProviderPlugin[]>(() => []));
const runProviderModelSelectedHook = vi.hoisted(() => vi.fn(async () => {}));

vi.mock("../plugins/provider-install-catalog.js", () => ({
  resolveProviderInstallCatalogEntry: vi.fn(() => undefined),
}));

vi.mock("./auth-choice.apply.api-providers.js", () => {
  const normalizeProviderIdLocal = (value: string) => value.trim().toLowerCase();
  const resolveChoiceByKind = (params: {
    authChoice: string;
    kind: ProviderAuthMethod["kind"];
    tokenProvider?: string;
  }) => {
    const providerId = normalizeProviderIdLocal(params.tokenProvider ?? "");
    if (!providerId) {
      return params.authChoice;
    }
    const provider = resolvePluginProviders().find(
      (entry) => normalizeProviderIdLocal(entry.id) === providerId,
    );
    return (
      provider?.auth.find((method) => method.kind === params.kind)?.wizard?.choiceId ??
      params.authChoice
    );
  };
>>>>>>> upstream/main
  return {
    applyAuthChoiceApiProviders: vi.fn(async () => null),
    normalizeApiKeyTokenProviderAuthChoice: (params: {
      authChoice: string;
      tokenProvider?: string;
    }) => {
      if (params.authChoice === "token" || params.authChoice === "setup-token") {
        return resolveChoiceByKind({ ...params, kind: "token" });
      }
      if (params.authChoice === "apiKey") {
        return resolveChoiceByKind({ ...params, kind: "api_key" });
      }
      return params.authChoice;
    },
  };
});

const detectZaiEndpoint = vi.hoisted(() => vi.fn<DetectZaiEndpoint>(async () => null));

vi.mock("../agents/agent-scope.js", () => ({
  resolveDefaultAgentId: () => "main",
  resolveAgentDir: (configForTest: unknown, agentId: string) =>
    `${process.env.OPENCLAW_STATE_DIR ?? "/tmp/openclaw-state"}/agents/${agentId}/agent`,
  resolveAgentWorkspaceDir: (configForTest: unknown, agentId: string) =>
    `/tmp/openclaw-workspaces/${agentId}`,
  // Required by src/agents/model-runtime-policy.ts, which is transitively
  // imported through provider-auth-choice -> copilot-runtime-plugin-install ->
  // copilot-routing -> model-runtime-policy.
  resolveSessionAgentIds: () => ({ defaultAgentId: "main", sessionAgentId: "main" }),
  listAgentEntries: () => [],
}));

vi.mock("../agents/workspace.js", () => ({
  resolveDefaultAgentWorkspaceDir: () => "/tmp/openclaw-workspace",
}));

vi.mock("../plugins/setup-browser.js", () => ({
  isRemoteEnvironment: () => false,
  openUrl: vi.fn(async () => {}),
}));

vi.mock("../plugins/provider-oauth-flow.js", () => ({
  createVpsAwareOAuthHandlers: vi.fn(),
}));

vi.mock("../plugins/provider-auth-helpers.js", () => ({
  applyAuthProfileConfig: (
    cfg: OpenClawConfig,
    params: {
      profileId: string;
      provider: string;
      mode: "api_key" | "aws-sdk" | "oauth" | "token";
      email?: string;
      displayName?: string;
    },
  ): OpenClawConfig => ({
    ...cfg,
    auth: {
      ...cfg.auth,
      profiles: {
        ...cfg.auth?.profiles,
        [params.profileId]: {
          provider: params.provider,
          mode: params.mode,
          ...(params.email ? { email: params.email } : {}),
          ...(params.displayName ? { displayName: params.displayName } : {}),
        },
      },
    },
  }),
}));

type StoredAuthProfile = {
  key?: string;
  token?: string;
  keyRef?: { source: string; provider: string; id: string };
  access?: string;
  refresh?: string;
  expires?: number;
  provider?: string;
  type?: string;
  email?: string;
  metadata?: Record<string, string>;
};

<<<<<<< HEAD
=======
const testAuthProfileStores = vi.hoisted(
  () => new Map<string, { profiles: Record<string, StoredAuthProfile> }>(),
);

// These tests verify profile payloads, not file locking; keep auth stores in memory.
function resolveTestAuthStoreKey(agentDir?: string): string {
  return agentDir?.trim() || process.env.OPENCLAW_AGENT_DIR || "__main__";
}

function readTestAuthProfileStore(agentDir?: string): {
  profiles: Record<string, StoredAuthProfile>;
} {
  return testAuthProfileStores.get(resolveTestAuthStoreKey(agentDir)) ?? { profiles: {} };
}

function seedTestAuthProfile(params: {
  profileId: string;
  credential: StoredAuthProfile;
  agentDir?: string;
}): void {
  const key = resolveTestAuthStoreKey(params.agentDir);
  const store = testAuthProfileStores.get(key) ?? { profiles: {} };
  store.profiles[params.profileId] = params.credential;
  testAuthProfileStores.set(key, store);
}

vi.mock("../agents/auth-profiles.js", () => ({
  upsertAuthProfile: (params: {
    profileId: string;
    credential: StoredAuthProfile;
    agentDir?: string;
  }) => {
    seedTestAuthProfile(params);
  },
  upsertAuthProfileWithLock: async (params: {
    profileId: string;
    credential: StoredAuthProfile;
    agentDir?: string;
  }) => {
    seedTestAuthProfile(params);
    return { version: 1, profiles: readTestAuthProfileStore(params.agentDir).profiles };
  },
}));

>>>>>>> upstream/main
function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

<<<<<<< HEAD
=======
function normalizeProviderId(value: string): string {
  return value.trim().toLowerCase();
}

function resolveProviderPluginChoice(params: { providers: ProviderPlugin[]; choice: string }) {
  const choice = params.choice.trim();
  if (!choice) {
    return null;
  }
  if (choice.startsWith("provider-plugin:")) {
    const payload = choice.slice("provider-plugin:".length);
    const separator = payload.indexOf(":");
    const providerId = separator >= 0 ? payload.slice(0, separator) : payload;
    const methodId = separator >= 0 ? payload.slice(separator + 1) : undefined;
    const provider = params.providers.find(
      (entry) => normalizeProviderId(entry.id) === normalizeProviderId(providerId),
    );
    const method = methodId
      ? provider?.auth.find((entry) => entry.id === methodId)
      : provider?.auth[0];
    return provider && method ? { provider, method } : null;
  }
  for (const provider of params.providers) {
    for (const method of provider.auth) {
      if (method.wizard?.choiceId === choice) {
        return { provider, method, wizard: method.wizard };
      }
    }
    if (normalizeProviderId(provider.id) === normalizeProviderId(choice) && provider.auth[0]) {
      return { provider, method: provider.auth[0] };
    }
  }
  return null;
}

>>>>>>> upstream/main
function providerConfigPatch(
  providerId: string,
  patch: Record<string, unknown>,
): Partial<OpenClawConfig> {
  const providers: Record<string, ModelProviderConfig> = {
    [providerId]: patch as ModelProviderConfig,
  };
  return {
    models: {
      providers,
    },
  };
}

<<<<<<< HEAD
function createApiKeyProvider(params: {
=======
type TestSecretRef = { source: "env"; provider: string; id: string };
type TestSecretInput = string | TestSecretRef;

function normalizeProviderInput(value: unknown): string | undefined {
  const normalized = normalizeText(value).toLowerCase();
  return normalized || undefined;
}

function buildApiKeyCredential(
  provider: string,
  input: TestSecretInput,
  metadata?: Record<string, string>,
): {
  type: "api_key";
  provider: string;
  key?: string;
  keyRef?: TestSecretRef;
  metadata?: Record<string, string>;
} {
  if (typeof input === "string") {
    return { type: "api_key", provider, key: input, ...(metadata ? { metadata } : {}) };
  }
  return { type: "api_key", provider, keyRef: input, ...(metadata ? { metadata } : {}) };
}

async function resolveRefApiKeyInput(params: {
  env: NodeJS.ProcessEnv;
  envVar: string;
  prompter: WizardPrompter;
}): Promise<TestSecretInput> {
  if (typeof params.prompter.select === "function") {
    const source = await params.prompter.select({
      message: "Choose secret reference source",
      options: [
        { label: "Environment variable", value: "env" },
        { label: "Secret provider", value: "provider" },
      ],
    });
    if (source !== "env") {
      await params.prompter.text?.({ message: "Enter secret provider reference" });
      await params.prompter.note?.(
        "Could not validate provider reference; choose an environment variable instead.",
        "Reference check failed",
      );
    }
  }
  const envName =
    normalizeText(await params.prompter.text?.({ message: "Enter environment variable name" })) ||
    params.envVar;
  await params.prompter.note?.(`Validated environment variable ${envName}.`, "Reference validated");
  return { source: "env", provider: "default", id: envName };
}

async function resolveApiKeyInput(params: {
  ctx: Parameters<ProviderAuthMethod["run"]>[0];
  providerId: string;
  expectedProviders: string[];
  optionKey: string;
  envVar: string;
  promptMessage: string;
  noteMessage?: string;
  noteTitle?: string;
}): Promise<{ input: TestSecretInput; mode?: "plaintext" | "ref" }> {
  const opts = (params.ctx.opts ?? {}) as Record<string, unknown>;
  const flagValue = normalizeText(opts[params.optionKey]);
  const token = flagValue || normalizeText(params.ctx.opts?.token);
  const tokenProvider = normalizeProviderInput(
    flagValue ? params.providerId : params.ctx.opts?.tokenProvider,
  );
  const expectedProviders = params.expectedProviders.map((provider) => provider.toLowerCase());
  if (token && tokenProvider && expectedProviders.includes(tokenProvider)) {
    return { input: token, mode: params.ctx.secretInputMode };
  }

  if (params.noteMessage) {
    await params.ctx.prompter.note(params.noteMessage, params.noteTitle);
  }

  const env = params.ctx.env ?? process.env;
  if (params.ctx.secretInputMode === "ref") {
    return {
      input: await resolveRefApiKeyInput({
        env,
        envVar: params.envVar,
        prompter: params.ctx.prompter,
      }),
      mode: "ref",
    };
  }

  const envValue = normalizeText(env[params.envVar]);
  if (envValue) {
    const useEnv = await params.ctx.prompter.confirm?.({
      message: `Use ${params.envVar} from environment?`,
    });
    if (useEnv) {
      return { input: envValue, mode: "plaintext" };
    }
  }

  return {
    input: normalizeText(await params.ctx.prompter.text({ message: params.promptMessage })),
    mode: "plaintext",
  };
}

async function createApiKeyProvider(params: {
>>>>>>> upstream/main
  providerId: string;
  label: string;
  choiceId: string;
  optionKey: string;
  flagName: `--${string}`;
  envVar: string;
  promptMessage: string;
  defaultModel?: string;
  profileId?: string;
  profileIds?: string[];
  expectedProviders?: string[];
  noteMessage?: string;
  noteTitle?: string;
  applyConfig?: Partial<OpenClawConfig>;
<<<<<<< HEAD
}): ProviderPlugin {
=======
}): Promise<ProviderPlugin> {
  const profileIds =
    params.profileIds && params.profileIds.length > 0
      ? params.profileIds
      : [params.profileId ?? `${params.providerId}:default`];
>>>>>>> upstream/main
  return {
    id: params.providerId,
    label: params.label,
    auth: [
<<<<<<< HEAD
      createProviderApiKeyAuthMethod({
        providerId: params.providerId,
        methodId: "api-key",
        label: params.label,
        optionKey: params.optionKey,
        flagName: params.flagName,
        envVar: params.envVar,
        promptMessage: params.promptMessage,
        ...(params.profileId ? { profileId: params.profileId } : {}),
        ...(params.profileIds ? { profileIds: params.profileIds } : {}),
        ...(params.defaultModel ? { defaultModel: params.defaultModel } : {}),
        ...(params.expectedProviders ? { expectedProviders: params.expectedProviders } : {}),
        ...(params.noteMessage ? { noteMessage: params.noteMessage } : {}),
        ...(params.noteTitle ? { noteTitle: params.noteTitle } : {}),
        ...(params.applyConfig ? { applyConfig: () => params.applyConfig as OpenClawConfig } : {}),
=======
      {
        id: "api-key",
        label: params.label,
        kind: "api_key",
>>>>>>> upstream/main
        wizard: {
          choiceId: params.choiceId,
          choiceLabel: params.label,
          groupId: params.providerId,
          groupLabel: params.label,
        },
<<<<<<< HEAD
      }),
=======
        run: async (ctx) => {
          const { input } = await resolveApiKeyInput({
            ctx,
            providerId: params.providerId,
            expectedProviders: params.expectedProviders ?? [params.providerId],
            optionKey: params.optionKey,
            envVar: params.envVar,
            promptMessage: params.promptMessage,
            noteMessage: params.noteMessage,
            noteTitle: params.noteTitle,
          });
          return {
            profiles: profileIds.map((profileId) => ({
              profileId,
              credential: buildApiKeyCredential(
                profileId.split(":", 1)[0] || params.providerId,
                input,
              ),
            })),
            ...(params.applyConfig ? { configPatch: params.applyConfig as OpenClawConfig } : {}),
            ...(params.defaultModel ? { defaultModel: params.defaultModel } : {}),
          };
        },
      },
>>>>>>> upstream/main
    ],
  };
}

function createFixedChoiceProvider(params: {
  providerId: string;
  label: string;
  choiceId: string;
  method: ProviderAuthMethod;
}): ProviderPlugin {
  return {
    id: params.providerId,
    label: params.label,
    auth: [
      {
        ...params.method,
        wizard: {
          choiceId: params.choiceId,
          choiceLabel: params.label,
          groupId: params.providerId,
          groupLabel: params.label,
        },
      },
    ],
  };
}

<<<<<<< HEAD
function createDefaultProviderPlugins() {
  const buildApiKeyCredential = providerApiKeyAuthRuntime.buildApiKeyCredential;
  const ensureApiKeyFromOptionEnvOrPrompt =
    providerApiKeyAuthRuntime.ensureApiKeyFromOptionEnvOrPrompt;
  const normalizeApiKeyInput = providerApiKeyAuthRuntime.normalizeApiKeyInput;
  const validateApiKeyInput = providerApiKeyAuthRuntime.validateApiKeyInput;

=======
async function createDefaultProviderPlugins(): Promise<ProviderPlugin[]> {
>>>>>>> upstream/main
  const createZaiMethod = (choiceId: "zai-api-key" | "zai-coding-global"): ProviderAuthMethod => ({
    id: choiceId === "zai-api-key" ? "api-key" : "coding-global",
    label: "Z.AI API key",
    kind: "api_key",
    wizard: {
      choiceId,
      choiceLabel: "Z.AI API key",
      groupId: "zai",
      groupLabel: "Z.AI",
    },
    run: async (ctx) => {
      const token = normalizeText(await ctx.prompter.text({ message: "Enter Z.AI API key" }));
      const detectResult = await detectZaiEndpoint(
        choiceId === "zai-coding-global"
          ? { apiKey: token, endpoint: "coding-global" }
          : { apiKey: token },
      );
      let baseUrl = detectResult?.baseUrl;
      let modelId = detectResult?.modelId;
      if (!baseUrl || !modelId) {
        if (choiceId === "zai-coding-global") {
          baseUrl = ZAI_CODING_GLOBAL_BASE_URL;
          modelId = "glm-5";
        } else {
          const endpoint = await ctx.prompter.select({
            message: "Select Z.AI endpoint",
            initialValue: "global",
            options: [
              { label: "Global", value: "global" },
              { label: "Coding CN", value: "coding-cn" },
            ],
          });
          baseUrl = endpoint === "coding-cn" ? ZAI_CODING_CN_BASE_URL : ZAI_CODING_GLOBAL_BASE_URL;
          modelId = "glm-5";
        }
      }
      return {
        profiles: [
          {
            profileId: "zai:default",
            credential: buildApiKeyCredential("zai", token),
          },
        ],
        configPatch: providerConfigPatch("zai", { baseUrl }) as OpenClawConfig,
        defaultModel: `zai/${modelId}`,
      };
    },
  });

<<<<<<< HEAD
  const cloudflareAiGatewayMethod: ProviderAuthMethod = {
    id: "api-key",
    label: "Cloudflare AI Gateway API key",
    kind: "api_key",
    wizard: {
      choiceId: "cloudflare-ai-gateway-api-key",
      choiceLabel: "Cloudflare AI Gateway API key",
      groupId: "cloudflare-ai-gateway",
      groupLabel: "Cloudflare AI Gateway",
    },
    run: async (ctx) => {
      const opts = (ctx.opts ?? {}) as Record<string, unknown>;
      const accountId =
        normalizeText(opts.cloudflareAiGatewayAccountId) ||
        normalizeText(await ctx.prompter.text({ message: "Enter Cloudflare account ID" }));
      const gatewayId =
        normalizeText(opts.cloudflareAiGatewayGatewayId) ||
        normalizeText(await ctx.prompter.text({ message: "Enter Cloudflare gateway ID" }));
      let capturedSecretInput = "";
      let capturedMode: "plaintext" | "ref" | undefined;
      await ensureApiKeyFromOptionEnvOrPrompt({
        token:
          normalizeText(opts.cloudflareAiGatewayApiKey) ||
          normalizeText(ctx.opts?.token) ||
          undefined,
        tokenProvider: "cloudflare-ai-gateway",
        secretInputMode:
          ctx.allowSecretRefPrompt === false
            ? (ctx.secretInputMode ?? "plaintext")
            : ctx.secretInputMode,
        config: ctx.config,
        expectedProviders: ["cloudflare-ai-gateway"],
        provider: "cloudflare-ai-gateway",
        envLabel: "CLOUDFLARE_AI_GATEWAY_API_KEY",
        promptMessage: "Enter Cloudflare AI Gateway API key",
        normalize: normalizeApiKeyInput,
        validate: validateApiKeyInput,
        prompter: ctx.prompter,
        setCredential: async (apiKey, mode) => {
          capturedSecretInput = typeof apiKey === "string" ? apiKey : "";
          capturedMode = mode;
        },
      });
      return {
        profiles: [
          {
            profileId: "cloudflare-ai-gateway:default",
            credential: buildApiKeyCredential(
              "cloudflare-ai-gateway",
              capturedSecretInput,
              { accountId, gatewayId },
              capturedMode ? { secretInputMode: capturedMode } : undefined,
            ),
          },
        ],
        defaultModel: "cloudflare-ai-gateway/claude-sonnet-4-5",
      };
    },
  };

  const chutesOAuthMethod: ProviderAuthMethod = {
    id: "oauth",
    label: "Chutes OAuth",
    kind: "device_code",
    wizard: {
      choiceId: "chutes",
      choiceLabel: "Chutes",
      groupId: "chutes",
      groupLabel: "Chutes",
    },
    run: async (ctx) => {
      const state = "state-test";
      ctx.runtime.log(`Open this URL: https://api.chutes.ai/idp/authorize?state=${state}`);
      const redirect = String(
        await ctx.prompter.text({ message: "Paste the redirect URL or code" }),
      );
      const params = new URLSearchParams(redirect.startsWith("?") ? redirect.slice(1) : redirect);
      const code = params.get("code") ?? redirect;
      const tokenResponse = await fetch("https://api.chutes.ai/idp/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, client_id: process.env.CHUTES_CLIENT_ID }),
      });
      const tokenJson = (await tokenResponse.json()) as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
      };
      const userResponse = await fetch("https://api.chutes.ai/idp/userinfo", {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      const userJson = (await userResponse.json()) as { username: string };
      return {
        profiles: [
          {
            profileId: `chutes:${userJson.username}`,
            credential: {
              type: "oauth",
              provider: "chutes",
              access: tokenJson.access_token,
              refresh: tokenJson.refresh_token,
              expires: Date.now() + tokenJson.expires_in * 1000,
              email: userJson.username,
            },
          },
        ],
      };
    },
  };

  return [
    createApiKeyProvider({
      providerId: "anthropic",
      label: "Anthropic API key",
      choiceId: "apiKey",
      optionKey: "anthropicApiKey",
      flagName: "--anthropic-api-key",
      envVar: "ANTHROPIC_API_KEY",
      promptMessage: "Enter Anthropic API key",
    }),
    createApiKeyProvider({
=======
  return [
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "google",
      label: "Gemini API key",
      choiceId: "gemini-api-key",
      optionKey: "geminiApiKey",
      flagName: "--gemini-api-key",
      envVar: "GEMINI_API_KEY",
      promptMessage: "Enter Gemini API key",
      defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
    }),
<<<<<<< HEAD
    createApiKeyProvider({
=======
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "huggingface",
      label: "Hugging Face API key",
      choiceId: "huggingface-api-key",
      optionKey: "huggingfaceApiKey",
      flagName: "--huggingface-api-key",
      envVar: "HUGGINGFACE_HUB_TOKEN",
      promptMessage: "Enter Hugging Face API key",
      defaultModel: "huggingface/Qwen/Qwen3-Coder-480B-A35B-Instruct",
    }),
<<<<<<< HEAD
    createApiKeyProvider({
      providerId: "litellm",
      label: "LiteLLM API key",
      choiceId: "litellm-api-key",
      optionKey: "litellmApiKey",
      flagName: "--litellm-api-key",
      envVar: "LITELLM_API_KEY",
      promptMessage: "Enter LiteLLM API key",
      defaultModel: "litellm/anthropic/claude-opus-4.6",
    }),
    createApiKeyProvider({
      providerId: "minimax",
      label: "MiniMax API key (Global)",
      choiceId: "minimax-global-api",
      optionKey: "minimaxApiKey",
      flagName: "--minimax-api-key",
      envVar: "MINIMAX_API_KEY",
      promptMessage: "Enter MiniMax API key",
      profileId: "minimax:global",
      defaultModel: "minimax/MiniMax-M2.7",
    }),
    createApiKeyProvider({
      providerId: "minimax",
      label: "MiniMax API key (CN)",
      choiceId: "minimax-cn-api",
      optionKey: "minimaxApiKey",
      flagName: "--minimax-api-key",
      envVar: "MINIMAX_API_KEY",
      promptMessage: "Enter MiniMax CN API key",
      profileId: "minimax:cn",
      defaultModel: "minimax/MiniMax-M2.7",
      applyConfig: providerConfigPatch("minimax", { baseUrl: MINIMAX_CN_API_BASE_URL }),
      expectedProviders: ["minimax", "minimax-cn"],
    }),
    createApiKeyProvider({
      providerId: "mistral",
      label: "Mistral API key",
      choiceId: "mistral-api-key",
      optionKey: "mistralApiKey",
      flagName: "--mistral-api-key",
      envVar: "MISTRAL_API_KEY",
      promptMessage: "Enter Mistral API key",
      defaultModel: "mistral/mistral-large-latest",
    }),
    createApiKeyProvider({
      providerId: "moonshot",
      label: "Moonshot API key",
      choiceId: "moonshot-api-key",
      optionKey: "moonshotApiKey",
      flagName: "--moonshot-api-key",
      envVar: "MOONSHOT_API_KEY",
      promptMessage: "Enter Moonshot API key",
      defaultModel: "moonshot/moonshot-v1-128k",
    }),
    createFixedChoiceProvider({
      providerId: "ollama",
      label: "Ollama",
      choiceId: "ollama",
      method: {
        id: "local",
        label: "Ollama",
        kind: "custom",
        run: async () => ({ profiles: [] }),
      },
    }),
    createApiKeyProvider({
=======
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "openai",
      label: "OpenAI API key",
      choiceId: "openai-api-key",
      optionKey: "openaiApiKey",
      flagName: "--openai-api-key",
      envVar: "OPENAI_API_KEY",
      promptMessage: "Enter OpenAI API key",
<<<<<<< HEAD
      defaultModel: "openai/gpt-5.4",
    }),
    createApiKeyProvider({
=======
      profileId: "openai:api-key",
      defaultModel: "openai/gpt-5.5",
    }),
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "opencode",
      label: "OpenCode Zen",
      choiceId: "opencode-zen",
      optionKey: "opencodeZenApiKey",
      flagName: "--opencode-zen-api-key",
      envVar: "OPENCODE_API_KEY",
      promptMessage: "Enter OpenCode API key",
      profileIds: ["opencode:default", "opencode-go:default"],
      defaultModel: "opencode/claude-opus-4-6",
      expectedProviders: ["opencode", "opencode-go"],
      noteMessage: "OpenCode uses one API key across the Zen and Go catalogs.",
      noteTitle: "OpenCode",
    }),
<<<<<<< HEAD
    createApiKeyProvider({
=======
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "opencode-go",
      label: "OpenCode Go",
      choiceId: "opencode-go",
      optionKey: "opencodeGoApiKey",
      flagName: "--opencode-go-api-key",
      envVar: "OPENCODE_API_KEY",
      promptMessage: "Enter OpenCode API key",
      profileIds: ["opencode-go:default", "opencode:default"],
<<<<<<< HEAD
      defaultModel: "opencode-go/kimi-k2.5",
=======
      defaultModel: "opencode-go/kimi-k2.6",
>>>>>>> upstream/main
      expectedProviders: ["opencode", "opencode-go"],
      noteMessage: "OpenCode uses one API key across the Zen and Go catalogs.",
      noteTitle: "OpenCode",
    }),
<<<<<<< HEAD
    createApiKeyProvider({
=======
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "openrouter",
      label: "OpenRouter API key",
      choiceId: "openrouter-api-key",
      optionKey: "openrouterApiKey",
      flagName: "--openrouter-api-key",
      envVar: "OPENROUTER_API_KEY",
      promptMessage: "Enter OpenRouter API key",
      defaultModel: "openrouter/auto",
    }),
<<<<<<< HEAD
    createApiKeyProvider({
      providerId: "qianfan",
      label: "Qianfan API key",
      choiceId: "qianfan-api-key",
      optionKey: "qianfanApiKey",
      flagName: "--qianfan-api-key",
      envVar: "QIANFAN_API_KEY",
      promptMessage: "Enter Qianfan API key",
      defaultModel: "qianfan/ernie-4.5-8k",
    }),
    createApiKeyProvider({
=======
    await createApiKeyProvider({
>>>>>>> upstream/main
      providerId: "synthetic",
      label: "Synthetic API key",
      choiceId: "synthetic-api-key",
      optionKey: "syntheticApiKey",
      flagName: "--synthetic-api-key",
      envVar: "SYNTHETIC_API_KEY",
      promptMessage: "Enter Synthetic API key",
      defaultModel: "synthetic/Synthetic-1",
    }),
<<<<<<< HEAD
    createApiKeyProvider({
      providerId: "together",
      label: "Together API key",
      choiceId: "together-api-key",
      optionKey: "togetherApiKey",
      flagName: "--together-api-key",
      envVar: "TOGETHER_API_KEY",
      promptMessage: "Enter Together API key",
      defaultModel: "together/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    }),
    createApiKeyProvider({
      providerId: "venice",
      label: "Venice AI",
      choiceId: "venice-api-key",
      optionKey: "veniceApiKey",
      flagName: "--venice-api-key",
      envVar: "VENICE_API_KEY",
      promptMessage: "Enter Venice AI API key",
      defaultModel: "venice/venice-uncensored",
      noteMessage: "Venice is a privacy-focused inference service.",
      noteTitle: "Venice AI",
    }),
    createApiKeyProvider({
      providerId: "vercel-ai-gateway",
      label: "AI Gateway API key",
      choiceId: "ai-gateway-api-key",
      optionKey: "aiGatewayApiKey",
      flagName: "--ai-gateway-api-key",
      envVar: "AI_GATEWAY_API_KEY",
      promptMessage: "Enter AI Gateway API key",
      defaultModel: "vercel-ai-gateway/anthropic/claude-opus-4.6",
    }),
    createApiKeyProvider({
      providerId: "xai",
      label: "xAI API key",
      choiceId: "xai-api-key",
      optionKey: "xaiApiKey",
      flagName: "--xai-api-key",
      envVar: "XAI_API_KEY",
      promptMessage: "Enter xAI API key",
      defaultModel: "xai/grok-4",
    }),
    createApiKeyProvider({
      providerId: "xiaomi",
      label: "Xiaomi API key",
      choiceId: "xiaomi-api-key",
      optionKey: "xiaomiApiKey",
      flagName: "--xiaomi-api-key",
      envVar: "XIAOMI_API_KEY",
      promptMessage: "Enter Xiaomi API key",
      defaultModel: "xiaomi/mimo-v2-flash",
    }),
=======
>>>>>>> upstream/main
    {
      id: "zai",
      label: "Z.AI",
      auth: [createZaiMethod("zai-api-key"), createZaiMethod("zai-coding-global")],
    },
<<<<<<< HEAD
    {
      id: "cloudflare-ai-gateway",
      label: "Cloudflare AI Gateway",
      auth: [cloudflareAiGatewayMethod],
    },
    {
      id: "chutes",
      label: "Chutes",
      auth: [chutesOAuthMethod],
    },
    createApiKeyProvider({
      providerId: "kimi",
      label: "Kimi Code API key",
      choiceId: "kimi-code-api-key",
      optionKey: "kimiApiKey",
      flagName: "--kimi-api-key",
      envVar: "KIMI_API_KEY",
      promptMessage: "Enter Kimi Code API key",
      defaultModel: "kimi/kimi-k2.5",
      expectedProviders: ["kimi", "kimi-code", "kimi-coding"],
    }),
    createFixedChoiceProvider({
      providerId: "github-copilot",
      label: "GitHub Copilot",
      choiceId: "github-copilot",
      method: {
        id: "device",
        label: "GitHub device login",
        kind: "device_code",
        run: async () => ({ profiles: [] }),
      },
    }),
=======
>>>>>>> upstream/main
  ];
}

describe("applyAuthChoice", () => {
  const lifecycle = createAuthTestLifecycle([
    "OPENCLAW_STATE_DIR",
    "OPENCLAW_AGENT_DIR",
    "ANTHROPIC_API_KEY",
    "OPENROUTER_API_KEY",
    "HF_TOKEN",
    "HUGGINGFACE_HUB_TOKEN",
    "GEMINI_API_KEY",
    "OPENCODE_API_KEY",
    "SYNTHETIC_API_KEY",
  ]);
  let authTestRoot: string | null = null;
  let authStateCounter = 0;
  async function setupTempState() {
    if (!authTestRoot) {
      throw new Error("auth test root not initialized");
    }
    testAuthProfileStores.clear();
    const stateDir = path.join(authTestRoot, `state-${++authStateCounter}`);
    const agentDir = path.join(stateDir, "agent");
    process.env.OPENCLAW_STATE_DIR = stateDir;
    process.env.OPENCLAW_AGENT_DIR = agentDir;
  }
  function createPrompter(overrides: Partial<WizardPrompter>): WizardPrompter {
    return createWizardPrompter(overrides, { defaultSelect: "" });
  }
  function createSelectFirstOption(): WizardPrompter["select"] {
    return vi.fn(async (params) => params.options[0]?.value as never);
  }
  function createNoopMultiselect(): WizardPrompter["multiselect"] {
    return vi.fn(async () => []);
  }
  function createApiKeyPromptHarness(
    overrides: Partial<Pick<WizardPrompter, "select" | "multiselect" | "text" | "confirm">> = {},
  ): {
    select: WizardPrompter["select"];
    multiselect: WizardPrompter["multiselect"];
    prompter: WizardPrompter;
    runtime: ReturnType<typeof createExitThrowingRuntime>;
  } {
    const select = overrides.select ?? createSelectFirstOption();
    const multiselect = overrides.multiselect ?? createNoopMultiselect();
    return {
      select,
      multiselect,
      prompter: createPrompter({ ...overrides, select, multiselect }),
      runtime: createExitThrowingRuntime(),
    };
  }
  async function readAuthProfiles() {
    return readTestAuthProfileStore(resolveAgentDir({} as OpenClawConfig, "main"));
  }
  async function readAuthProfilesForAgentDir(agentDir: string) {
    return readTestAuthProfileStore(agentDir);
  }
  async function readAuthProfile(profileId: string) {
    return (await readAuthProfiles()).profiles?.[profileId];
  }
  function expectAuthProfileConfig(
    result: { config: OpenClawConfig },
    profileId: string,
    expected: { provider: string; mode: string },
  ) {
    const profile = result.config.auth?.profiles?.[profileId];
    expect(profile?.provider).toBe(expected.provider);
    expect(profile?.mode).toBe(expected.mode);
  }
  function promptMessages(mock: { mock: { calls: unknown[][] } }): string[] {
    return mock.mock.calls.map((call) => {
      const message = (call[0] as { message?: unknown }).message;
      return typeof message === "string" ? message : "";
    });
  }
  function expectPromptMessageContaining(mock: { mock: { calls: unknown[][] } }, expected: string) {
    expect(promptMessages(mock).join("\n")).toContain(expected);
  }
  function expectPromptMessage(mock: { mock: { calls: unknown[][] } }, expected: string) {
    expect(promptMessages(mock)).toContain(expected);
  }
  function firstCallArg(mock: { mock: { calls: unknown[][] } }): unknown {
    const call = mock.mock.calls[0];
    if (!call) {
      throw new Error("Expected first mock call");
    }
    return call[0];
  }

  let defaultProviderPlugins: ProviderPlugin[] = [];

  beforeAll(async () => {
    authTestRoot = (await setupAuthTestEnv("openclaw-auth-")).stateDir;
    defaultProviderPlugins = await createDefaultProviderPlugins();
    resolvePluginProviders.mockReturnValue(defaultProviderPlugins);
    providerAuthChoiceTesting.setDepsForTest({
      loadPluginProviderRuntime: async () => ({
        resolvePluginProviders,
        resolvePluginSetupProvider: () => undefined,
        resolveProviderPluginChoice,
        runProviderModelSelectedHook,
      }),
    });
  });

  afterAll(async () => {
    providerAuthChoiceTesting.resetDepsForTest();
    if (authTestRoot) {
      await fs.rm(authTestRoot, { recursive: true, force: true });
    }
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    resolvePluginProviders.mockReset();
    resolvePluginProviders.mockReturnValue(defaultProviderPlugins);
    runProviderModelSelectedHook.mockClear();
    detectZaiEndpoint.mockReset();
    detectZaiEndpoint.mockResolvedValue(null);
<<<<<<< HEAD
    loginOpenAICodexOAuth.mockReset();
    loginOpenAICodexOAuth.mockResolvedValue(null);
=======
    testAuthProfileStores.clear();
>>>>>>> upstream/main
    await lifecycle.cleanup();
  });

<<<<<<< HEAD
  resolvePluginProviders.mockReturnValue(createDefaultProviderPlugins());

  it("applies Anthropic setup-token auth when the provider exposes the setup flow", async () => {
    await setupTempState();

    resolvePluginProviders.mockReturnValue([
      createFixedChoiceProvider({
        providerId: "anthropic",
        label: "Anthropic",
        choiceId: "setup-token",
        method: {
          id: "setup-token",
          label: "Anthropic setup-token",
          kind: "token",
          run: vi.fn(
            async (): Promise<ProviderAuthResult> => ({
              profiles: [
                {
                  profileId: "anthropic:default",
                  credential: {
                    type: "token",
                    provider: "anthropic",
                    token: `sk-ant-oat01-${"a".repeat(80)}`,
                  },
                },
              ],
              defaultModel: "anthropic/claude-sonnet-4-6",
            }),
          ),
        },
      }),
    ]);

    const result = await applyAuthChoice({
      authChoice: "token",
      config: {} as OpenClawConfig,
      prompter: createPrompter({}),
      runtime: createExitThrowingRuntime(),
      setDefaultModel: true,
      opts: {
        tokenProvider: "anthropic",
        token: `sk-ant-oat01-${"a".repeat(80)}`,
      },
    });

    expect(result.config.auth?.profiles?.["anthropic:default"]).toMatchObject({
      provider: "anthropic",
      mode: "token",
    });
    expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
      "anthropic/claude-sonnet-4-6",
    );
    expect((await readAuthProfile("anthropic:default"))?.token).toBe(
      `sk-ant-oat01-${"a".repeat(80)}`,
    );
  });

  it("does not throw when openai-codex oauth fails", async () => {
=======
  it("applies Anthropic setup-token auth when the provider exposes the setup flow", async () => {
>>>>>>> upstream/main
    await setupTempState();

    resolvePluginProviders.mockReturnValue([
      createFixedChoiceProvider({
        providerId: "anthropic",
        label: "Anthropic",
        choiceId: "setup-token",
        method: {
          id: "setup-token",
          label: "Anthropic setup-token",
          kind: "token",
          run: vi.fn(
            async (): Promise<ProviderAuthResult> => ({
              profiles: [
                {
                  profileId: "anthropic:default",
                  credential: {
                    type: "token",
                    provider: "anthropic",
                    token: `sk-ant-oat01-${"a".repeat(80)}`,
                  },
                },
              ],
              defaultModel: "anthropic/claude-sonnet-4-6",
            }),
          ),
        },
      }),
    ]);

    const result = await applyAuthChoice({
      authChoice: "token",
      config: {} as OpenClawConfig,
      prompter: createPrompter({}),
      runtime: createExitThrowingRuntime(),
      setDefaultModel: true,
      opts: {
        tokenProvider: "anthropic",
        token: `sk-ant-oat01-${"a".repeat(80)}`,
      },
    });

    expectAuthProfileConfig(result, "anthropic:default", {
      provider: "anthropic",
      mode: "token",
    });
    expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
      "anthropic/claude-sonnet-4-6",
    );
    expect((await readAuthProfile("anthropic:default"))?.token).toBe(
      `sk-ant-oat01-${"a".repeat(80)}`,
    );
  });

<<<<<<< HEAD
=======
  it("fails fast when a removed provider auth choice is passed to the interactive flow", async () => {
    const spy = vi
      .spyOn(providerAuthChoices, "resolveManifestDeprecatedProviderAuthChoice")
      .mockReturnValueOnce({
        choiceId: "openai",
      } as never);
    try {
      await expect(
        applyAuthChoice({
          authChoice: "openai-chatgpt-import",
          config: {},
          prompter: createPrompter({}),
          runtime: createExitThrowingRuntime(),
          setDefaultModel: true,
        }),
      ).rejects.toThrow(
        'Auth choice "openai-chatgpt-import" is no longer supported. Use "openai" instead, or run openclaw onboard to choose interactively.',
      );
    } finally {
      spy.mockRestore();
    }
  });

  it("escapes removed provider auth choice guidance for terminal output", async () => {
    const spy = vi
      .spyOn(providerAuthChoices, "resolveManifestDeprecatedProviderAuthChoice")
      .mockReturnValueOnce({
        choiceId: "modern\nchoice",
      } as never);
    try {
      await expect(
        applyAuthChoice({
          authChoice: "legacy\u001b[31mchoice",
          config: {},
          prompter: createPrompter({}),
          runtime: createExitThrowingRuntime(),
          setDefaultModel: true,
        }),
      ).rejects.toThrow(
        'Auth choice "legacy\\u001b[31mchoice" is no longer supported. Use "modern\\nchoice" instead, or run openclaw onboard to choose interactively.',
      );
    } finally {
      spy.mockRestore();
    }
  });

>>>>>>> upstream/main
  it("prompts and writes provider API key profiles for common providers", async () => {
    const scenarios: Array<{
      authChoice: "huggingface-api-key";
      promptContains: string;
      profileId: string;
      provider: string;
      token: string;
    }> = [
      {
<<<<<<< HEAD
        authChoice: "minimax-global-api" as const,
        promptContains: "Enter MiniMax API key",
        profileId: "minimax:global",
        provider: "minimax",
        token: "sk-minimax-test",
      },
      {
        authChoice: "minimax-cn-api" as const,
        promptContains: "Enter MiniMax CN API key",
        profileId: "minimax:cn",
        provider: "minimax",
        token: "sk-minimax-test",
      },
      {
        authChoice: "synthetic-api-key" as const,
        promptContains: "Enter Synthetic API key",
        profileId: "synthetic:default",
        provider: "synthetic",
        token: "sk-synthetic-test",
      },
      {
=======
>>>>>>> upstream/main
        authChoice: "huggingface-api-key" as const,
        promptContains: "Hugging Face",
        profileId: "huggingface:default",
        provider: "huggingface",
        token: "hf-test-token",
      },
    ];
    await setupTempState();
    for (const scenario of scenarios) {
      const text = vi.fn().mockResolvedValue(scenario.token);
      const { prompter, runtime } = createApiKeyPromptHarness({ text });

      const result = await applyAuthChoice({
        authChoice: scenario.authChoice,
        config: {},
        prompter,
        runtime,
        setDefaultModel: true,
      });

      expectPromptMessageContaining(text, scenario.promptContains);
      expectAuthProfileConfig(result, scenario.profileId, {
        provider: scenario.provider,
        mode: "api_key",
      });
      expect((await readAuthProfile(scenario.profileId))?.key).toBe(scenario.token);
    }
  });

  it("uses Z.AI endpoint detection and prompts in the auth flow", async () => {
    const scenarios: Array<{
      authChoice: "zai-api-key" | "zai-coding-global";
      token: string;
      endpointSelection?: "coding-cn" | "global";
      detectResult?: {
        endpoint: "coding-global" | "coding-cn";
        modelId: string;
        baseUrl: string;
        note: string;
      };
      shouldPromptForEndpoint: boolean;
      expectedDetectCall?: { apiKey: string; endpoint?: "coding-global" | "coding-cn" };
    }> = [
      {
        authChoice: "zai-api-key",
        token: "zai-test-key",
        endpointSelection: "coding-cn",
        shouldPromptForEndpoint: true,
      },
      {
        authChoice: "zai-coding-global",
        token: "zai-test-key",
        detectResult: {
          endpoint: "coding-global",
          modelId: "glm-4.7",
          baseUrl: ZAI_CODING_GLOBAL_BASE_URL,
          note: "Detected coding-global endpoint with GLM-4.7 fallback",
        },
        shouldPromptForEndpoint: false,
        expectedDetectCall: { apiKey: "zai-test-key", endpoint: "coding-global" },
      },
<<<<<<< HEAD
      {
        authChoice: "zai-api-key",
        token: "zai-detected-key",
        detectResult: {
          endpoint: "coding-global",
          modelId: "glm-4.5",
          baseUrl: ZAI_CODING_GLOBAL_BASE_URL,
          note: "Detected coding-global endpoint",
        },
        shouldPromptForEndpoint: false,
        expectedDetectCall: { apiKey: "zai-detected-key" },
      },
=======
>>>>>>> upstream/main
    ];
    await setupTempState();
    for (const scenario of scenarios) {
      detectZaiEndpoint.mockReset();
      detectZaiEndpoint.mockResolvedValue(null);
      if (scenario.detectResult) {
        detectZaiEndpoint.mockResolvedValueOnce(scenario.detectResult);
      }

      const text = vi.fn().mockResolvedValue(scenario.token);
      const select = vi.fn(async (params: { message: string }) => {
        if (params.message === "Select Z.AI endpoint") {
          return scenario.endpointSelection ?? "global";
        }
        return "default";
      });
      const { prompter, runtime } = createApiKeyPromptHarness({
        select: select as WizardPrompter["select"],
        text,
      });

      const result = await applyAuthChoice({
        authChoice: scenario.authChoice,
        config: {},
        prompter,
        runtime,
        setDefaultModel: true,
      });

      if (scenario.expectedDetectCall) {
        expect(detectZaiEndpoint).toHaveBeenCalledWith(scenario.expectedDetectCall);
      }
      if (scenario.shouldPromptForEndpoint) {
        const endpointPrompt = select.mock.calls
          .map((call) => call[0] as { message?: string; initialValue?: string })
          .find((call) => call.message === "Select Z.AI endpoint");
        expect(endpointPrompt?.initialValue).toBe("global");
      } else {
<<<<<<< HEAD
        expect(select).not.toHaveBeenCalledWith(
          expect.objectContaining({ message: "Select Z.AI endpoint" }),
        );
      }
      expect(result.config.auth?.profiles?.["zai:default"]).toMatchObject({
=======
        expect(promptMessages(select)).not.toContain("Select Z.AI endpoint");
      }
      expectAuthProfileConfig(result, "zai:default", {
>>>>>>> upstream/main
        provider: "zai",
        mode: "api_key",
      });
      expect((await readAuthProfile("zai:default"))?.key).toBe(scenario.token);
    }
  });

  it("uses provided tokens without prompting across alias and direct provider choices", async () => {
    const scenarios: Array<{
      authChoice: "apiKey" | "gemini-api-key";
      config?: OpenClawConfig;
      setDefaultModel: boolean;
      tokenProvider: string;
      token: string;
      profileId: string;
      provider: string;
      expectedModel?: string;
      expectedModelPrefix?: string;
      expectedAgentModelOverride?: string;
      extraProfiles?: string[];
    }> = [
      {
        authChoice: "apiKey",
        setDefaultModel: true,
        tokenProvider: " GOOGLE  ",
        token: "sk-gemini-token-provider-test",
        profileId: "google:default",
        provider: "google",
        expectedModel: GOOGLE_GEMINI_DEFAULT_MODEL,
      },
      {
        authChoice: "gemini-api-key",
        config: { agents: { defaults: { model: { primary: "openai/gpt-4o-mini" } } } },
        setDefaultModel: false,
        tokenProvider: "google",
        token: "sk-gemini-test",
        profileId: "google:default",
        provider: "google",
        expectedModel: "openai/gpt-4o-mini",
        expectedAgentModelOverride: GOOGLE_GEMINI_DEFAULT_MODEL,
      },
    ];
    await setupTempState();
    for (const scenario of scenarios) {
      delete process.env.HF_TOKEN;
      delete process.env.HUGGINGFACE_HUB_TOKEN;

      const text = vi.fn().mockResolvedValue("should-not-be-used");
      const confirm = vi.fn(async () => false);
      const { prompter, runtime } = createApiKeyPromptHarness({ text, confirm });

      const result = await applyAuthChoice({
        authChoice: scenario.authChoice,
        config: scenario.config ?? {},
        prompter,
        runtime,
        setDefaultModel: scenario.setDefaultModel,
        opts: {
          tokenProvider: scenario.tokenProvider,
          token: scenario.token,
        },
      });

      expect(text).not.toHaveBeenCalled();
      expect(confirm).not.toHaveBeenCalled();
      expectAuthProfileConfig(result, scenario.profileId, {
        provider: scenario.provider,
        mode: "api_key",
      });
      const selectedModel = resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model);
      if (scenario.expectedModel) {
        expect(selectedModel).toBe(scenario.expectedModel);
      }
      if (scenario.expectedModelPrefix) {
        expect(selectedModel?.startsWith(scenario.expectedModelPrefix)).toBe(true);
      }
      if (scenario.expectedAgentModelOverride) {
        expect(result.agentModelOverride).toBe(scenario.expectedAgentModelOverride);
      }
      expect((await readAuthProfile(scenario.profileId))?.key).toBe(scenario.token);
      for (const extraProfile of scenario.extraProfiles ?? []) {
        expect((await readAuthProfile(extraProfile))?.key).toBe(scenario.token);
      }
    }
  });

  it("uses existing env API keys for selected providers", async () => {
    const scenarios: Array<{
      authChoice: "openrouter-api-key";
      envKey: "OPENROUTER_API_KEY";
      envValue: string;
      profileId: string;
      provider: string;
      expectEnvPrompt: boolean;
      expectedTextCalls: number;
      expectedKey?: string;
      expectedModel?: string;
    }> = [
      {
        authChoice: "openrouter-api-key",
        envKey: "OPENROUTER_API_KEY",
        envValue: "sk-openrouter-test",
        profileId: "openrouter:default",
        provider: "openrouter",
        expectEnvPrompt: true,
        expectedTextCalls: 0,
        expectedKey: "sk-openrouter-test",
        expectedModel: "openrouter/auto",
      },
    ];
    await setupTempState();
    for (const scenario of scenarios) {
      delete process.env.SYNTHETIC_API_KEY;
      delete process.env.OPENROUTER_API_KEY;
      process.env[scenario.envKey] = scenario.envValue;

      const text = vi.fn();
      const confirm = vi.fn(async () => true);
      const { prompter, runtime } = createApiKeyPromptHarness({ text, confirm });

      const result = await applyAuthChoice({
        authChoice: scenario.authChoice,
        config: {},
        prompter,
        runtime,
        setDefaultModel: true,
      });

      if (scenario.expectEnvPrompt) {
        expectPromptMessageContaining(confirm, scenario.envKey);
      } else {
        expect(confirm).not.toHaveBeenCalled();
      }
      expect(text).toHaveBeenCalledTimes(scenario.expectedTextCalls);
      expectAuthProfileConfig(result, scenario.profileId, {
        provider: scenario.provider,
        mode: "api_key",
      });
      if (scenario.expectedModel) {
        expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
          scenario.expectedModel,
        );
      }
      const profile = await readAuthProfile(scenario.profileId);
      expect(profile?.key).toBe(scenario.expectedKey);
      expect(profile?.keyRef).toBeUndefined();
    }
  });

  it("keeps an existing default model when configure re-applies provider auth", async () => {
    await setupTempState();
    vi.stubEnv("OPENROUTER_API_KEY", "sk-openrouter-test");
    const note = vi.fn();
    const confirm = vi.fn(async () => true);
    const text = vi.fn();
    const existingPrimary = "anthropic/claude-opus-4-6";
    const prompter = createPrompter({ text, confirm, note });

    const result = await applyAuthChoice({
      authChoice: "openrouter-api-key",
      config: { agents: { defaults: { model: { primary: existingPrimary } } } },
      prompter,
      runtime: createExitThrowingRuntime(),
      setDefaultModel: true,
      preserveExistingDefaultModel: true,
    });

    expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
      existingPrimary,
    );
    expect(result.config.agents?.defaults?.models?.["openrouter/auto"]).toStrictEqual({});
    expect(runProviderModelSelectedHook).not.toHaveBeenCalled();
    expect(note).toHaveBeenCalledWith(
      "Kept existing default model anthropic/claude-opus-4-6; openrouter/auto is available.",
      "Model configured",
    );
  });

  it("enables the owning plugin for manifest provider auth choices", async () => {
    await setupTempState();
    const provider = createFixedChoiceProvider({
      providerId: "github-copilot",
      label: "GitHub Copilot",
      choiceId: "github-copilot-github",
      method: {
        id: "github",
        label: "GitHub Copilot",
        kind: "token",
        run: vi.fn(
          async (): Promise<ProviderAuthResult> => ({
            profiles: [
              {
                profileId: "github-copilot:github",
                credential: {
                  type: "token",
                  provider: "github-copilot",
                  token: "gho_copilot_test",
                },
              },
            ],
            defaultModel: "github-copilot/claude-opus-4.7",
          }),
        ),
      },
    });
    const manifestSpy = vi
      .spyOn(providerAuthChoices, "resolveManifestProviderAuthChoice")
      .mockReturnValue({
        pluginId: "github-copilot",
        providerId: "github-copilot",
        methodId: "github",
        choiceId: "github-copilot-github",
        choiceLabel: "GitHub Copilot",
      });
    providerAuthChoiceTesting.setDepsForTest({
      loadPluginProviderRuntime: async () => ({
        resolvePluginProviders,
        resolvePluginSetupProvider: () => provider,
        resolveProviderPluginChoice,
        runProviderModelSelectedHook,
      }),
    });
    try {
      const result = await applyAuthChoice({
        authChoice: "github-copilot-github",
        config: { plugins: { entries: { "github-copilot": { enabled: false } } } },
        prompter: createPrompter({}),
        runtime: createExitThrowingRuntime(),
        setDefaultModel: true,
        preserveExistingDefaultModel: true,
      });

      expect(result.config.plugins?.entries?.["github-copilot"]).toEqual({ enabled: true });
      expectAuthProfileConfig(result, "github-copilot:github", {
        provider: "github-copilot",
        mode: "token",
      });
      expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
        "github-copilot/claude-opus-4.7",
      );
    } finally {
      manifestSpy.mockRestore();
      providerAuthChoiceTesting.setDepsForTest({
        loadPluginProviderRuntime: async () => ({
          resolvePluginProviders,
          resolvePluginSetupProvider: () => undefined,
          resolveProviderPluginChoice,
          runProviderModelSelectedHook,
        }),
      });
    }
  });

  it("uses explicit env for plugin auth resolution instead of host env", async () => {
    await setupTempState();
    process.env.OPENAI_API_KEY = "sk-openai-host"; // pragma: allowlist secret
    const env = { OPENAI_API_KEY: "sk-openai-explicit" } as NodeJS.ProcessEnv; // pragma: allowlist secret
    const text = vi.fn().mockResolvedValue("should-not-be-used");
    const confirm = vi.fn(async () => true);
    const { prompter, runtime } = createApiKeyPromptHarness({ text, confirm });

    const result = await applyAuthChoice({
      authChoice: "openai-api-key",
      config: {},
      env,
      prompter,
      runtime,
      setDefaultModel: false,
    });

    const providerResolveInput = firstCallArg(resolvePluginProviders) as {
      env?: NodeJS.ProcessEnv;
      mode?: string;
    };
    expect(providerResolveInput.env).toBe(env);
    expect(providerResolveInput.mode).toBe("setup");
    expectPromptMessageContaining(confirm, "OPENAI_API_KEY");
    expect(text).not.toHaveBeenCalled();
    expectAuthProfileConfig(result, "openai:api-key", {
      provider: "openai",
      mode: "api_key",
    });
    expect((await readAuthProfile("openai:api-key"))?.key).toBe("sk-openai-explicit");
  });

  it("uses explicit env for plugin auth resolution instead of host env", async () => {
    await setupTempState();
    process.env.OPENAI_API_KEY = "sk-openai-host"; // pragma: allowlist secret
    const env = { OPENAI_API_KEY: "sk-openai-explicit" } as NodeJS.ProcessEnv; // pragma: allowlist secret
    const text = vi.fn().mockResolvedValue("should-not-be-used");
    const confirm = vi.fn(async () => true);
    const { prompter, runtime } = createApiKeyPromptHarness({ text, confirm });

    const result = await applyAuthChoice({
      authChoice: "openai-api-key",
      config: {},
      env,
      prompter,
      runtime,
      setDefaultModel: false,
    });

    expect(resolvePluginProviders).toHaveBeenCalledWith(
      expect.objectContaining({
        config: {},
        env,
      }),
    );
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("OPENAI_API_KEY"),
      }),
    );
    expect(text).not.toHaveBeenCalled();
    expect(result.config.auth?.profiles?.["openai:default"]).toMatchObject({
      provider: "openai",
      mode: "api_key",
    });
    expect((await readAuthProfile("openai:default"))?.key).toBe("sk-openai-explicit");
  });

  it("keeps existing default model for explicit provider keys when setDefaultModel=false", async () => {
    const scenarios: Array<{
      authChoice: "synthetic-api-key" | "opencode-zen";
      token: string | undefined;
      promptMessage: string;
      existingPrimary: string;
      expectedOverride: string;
      profileId?: string;
      profileProvider?: string;
      expectedStoredKey?: string;
      extraProfileId?: string;
      expectProviderConfigUndefined?: "opencode";
      agentId?: string;
    }> = [
      {
        authChoice: "synthetic-api-key",
        token: undefined,
        promptMessage: "Enter Synthetic API key",
        existingPrimary: "openai/gpt-4o-mini",
        expectedOverride: "synthetic/Synthetic-1",
        profileId: "synthetic:default",
        profileProvider: "synthetic",
        expectedStoredKey: "",
        agentId: "agent-1",
      },
      {
        authChoice: "opencode-zen",
        token: "sk-opencode-zen-test",
        promptMessage: "Enter OpenCode API key",
        existingPrimary: "anthropic/claude-opus-4-5",
        expectedOverride: "opencode/claude-opus-4-6",
        profileId: "opencode:default",
        profileProvider: "opencode",
        extraProfileId: "opencode-go:default",
        expectProviderConfigUndefined: "opencode",
      },
    ];
    await setupTempState();
    for (const scenario of scenarios) {
      const text = vi.fn().mockResolvedValue(scenario.token);
      const { prompter, runtime } = createApiKeyPromptHarness({ text });

      const result = await applyAuthChoice({
        authChoice: scenario.authChoice,
        config: { agents: { defaults: { model: { primary: scenario.existingPrimary } } } },
        prompter,
        runtime,
        setDefaultModel: false,
        agentId: scenario.agentId,
      });

      expectPromptMessage(text, scenario.promptMessage);
      expect(resolveAgentModelPrimaryValue(result.config.agents?.defaults?.model)).toBe(
        scenario.existingPrimary,
      );
      expect(result.agentModelOverride).toBe(scenario.expectedOverride);
      if (scenario.profileId && scenario.profileProvider) {
        expectAuthProfileConfig(result, scenario.profileId, {
          provider: scenario.profileProvider,
          mode: "api_key",
        });
        const profileStore =
          scenario.agentId && scenario.agentId !== "default"
            ? await readAuthProfilesForAgentDir(resolveAgentDir(result.config, scenario.agentId))
            : await readAuthProfiles();
        expect(profileStore.profiles?.[scenario.profileId]?.key).toBe(
          scenario.expectedStoredKey ?? scenario.token,
        );
        expect(profileStore.profiles?.[scenario.profileId]?.key).not.toBe("undefined");
      }
      if (scenario.extraProfileId) {
        const profileStore =
          scenario.agentId && scenario.agentId !== "default"
            ? await readAuthProfilesForAgentDir(resolveAgentDir(result.config, scenario.agentId))
            : await readAuthProfiles();
        expect(profileStore.profiles?.[scenario.extraProfileId]?.key).toBe(scenario.token);
      }
      if (scenario.expectProviderConfigUndefined) {
        expect(
          result.config.models?.providers?.[scenario.expectProviderConfigUndefined],
        ).toBeUndefined();
      }
    }
  });
});
