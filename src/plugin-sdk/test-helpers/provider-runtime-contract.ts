<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { StreamFn } from "@mariozechner/pi-agent-core";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProviderPlugin, ProviderRuntimeModel } from "../../../src/plugins/types.js";
import {
  createProviderUsageFetch,
  makeResponse,
} from "../../../src/test-utils/provider-usage-fetch.js";
import { registerProviderPlugin, requireRegisteredProvider } from "./provider-registration.js";

const CONTRACT_SETUP_TIMEOUT_MS = 300_000;

const refreshOpenAICodexTokenMock = vi.hoisted(() => vi.fn());
const getOAuthProvidersMock = vi.hoisted(() =>
  vi.fn(() => [
    { id: "anthropic", envApiKey: "ANTHROPIC_API_KEY", oauthTokenEnv: "ANTHROPIC_OAUTH_TOKEN" },
    { id: "google", envApiKey: "GOOGLE_API_KEY", oauthTokenEnv: "GOOGLE_OAUTH_TOKEN" },
    { id: "openai-codex", envApiKey: "OPENAI_API_KEY", oauthTokenEnv: "OPENAI_OAUTH_TOKEN" },
  ]),
);
const providerRuntimeContractModules = vi.hoisted(() => ({
  anthropicIndexModuleUrl: new URL("../../../extensions/anthropic/index.ts", import.meta.url).href,
  githubCopilotIndexModuleUrl: new URL(
    "../../../extensions/github-copilot/index.ts",
    import.meta.url,
  ).href,
  googleIndexModuleUrl: new URL("../../../extensions/google/index.ts", import.meta.url).href,
  openAIIndexModuleUrl: new URL("../../../extensions/openai/index.ts", import.meta.url).href,
  openAICodexProviderRuntimeModuleId: new URL(
    "../../../extensions/openai/openai-codex-provider.runtime.js",
    import.meta.url,
  ).pathname,
  openRouterIndexModuleUrl: new URL("../../../extensions/openrouter/index.ts", import.meta.url)
    .href,
  veniceIndexModuleUrl: new URL("../../../extensions/venice/index.ts", import.meta.url).href,
  xAIIndexModuleUrl: new URL("../../../extensions/xai/index.ts", import.meta.url).href,
  zaiIndexModuleUrl: new URL("../../../extensions/zai/index.ts", import.meta.url).href,
}));
========
// Provider runtime contract helpers define reusable runtime tests for provider plugins.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProviderRuntimeModel } from "../plugin-entry.js";
import { registerProviderPlugin, requireRegisteredProvider } from "../plugin-test-runtime.js";
import type { ProviderPlugin } from "../provider-model-shared.js";
import { createProviderUsageFetch, makeResponse } from "../test-env.js";

const CONTRACT_SETUP_TIMEOUT_MS = 300_000;

const OPENAI_CODEX_PROVIDER_RUNTIME_MODULE_ID =
  "../../../extensions/openai/openai-chatgpt-provider.runtime.js";
const refreshOpenAICodexTokenMock = vi.fn();
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

function installProviderRuntimeContractMocks() {
  vi.doMock(OPENAI_CODEX_PROVIDER_RUNTIME_MODULE_ID, () => ({
    refreshOpenAICodexToken: refreshOpenAICodexTokenMock,
  }));
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
vi.mock(providerRuntimeContractModules.openAICodexProviderRuntimeModuleId, () => ({
  refreshOpenAICodexToken: refreshOpenAICodexTokenMock,
}));
========
function removeProviderRuntimeContractMocks() {
  vi.doUnmock(OPENAI_CODEX_PROVIDER_RUNTIME_MODULE_ID);
}
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

async function importBundledProviderPlugin<T>(moduleUrl: string): Promise<T> {
  return (await import(`${moduleUrl}?t=${Date.now()}`)) as T;
}

function createModel(overrides: Partial<ProviderRuntimeModel> & Pick<ProviderRuntimeModel, "id">) {
  return {
    id: overrides.id,
    name: overrides.name ?? overrides.id,
    api: overrides.api ?? "openai-responses",
    provider: overrides.provider ?? "demo",
    baseUrl: overrides.baseUrl ?? "https://api.example.com/v1",
    reasoning: overrides.reasoning ?? true,
    input: overrides.input ?? ["text"],
    cost: overrides.cost ?? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: overrides.contextWindow ?? 200_000,
    maxTokens: overrides.maxTokens ?? 8_192,
  } satisfies ProviderRuntimeModel;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  expect(value, label).toBeTypeOf("object");
  expect(value, label).not.toBeNull();
  return value as Record<string, unknown>;
}

function expectFields(value: unknown, fields: Record<string, unknown>) {
  const record = requireRecord(value, "record");
  for (const [key, expected] of Object.entries(fields)) {
    expect(record[key]).toEqual(expected);
  }
}

type ProviderRuntimeContractFixture = {
  providerIds: string[];
  pluginId: string;
  name: string;
  load: ProviderRuntimeContractPluginLoader;
};

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
const PROVIDER_RUNTIME_CONTRACT_FIXTURES: readonly ProviderRuntimeContractFixture[] = [
  {
    providerIds: ["anthropic"],
    pluginId: "anthropic",
    name: "Anthropic",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.anthropicIndexModuleUrl),
  },
  {
    providerIds: ["github-copilot"],
    pluginId: "github-copilot",
    name: "GitHub Copilot",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.githubCopilotIndexModuleUrl),
  },
  {
    providerIds: ["google", "google-gemini-cli"],
    pluginId: "google",
    name: "Google",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.googleIndexModuleUrl),
  },
  {
    providerIds: ["openai", "openai-codex"],
    pluginId: "openai",
    name: "OpenAI",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.openAIIndexModuleUrl),
  },
  {
    providerIds: ["openrouter"],
    pluginId: "openrouter",
    name: "OpenRouter",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.openRouterIndexModuleUrl),
  },
  {
    providerIds: ["venice"],
    pluginId: "venice",
    name: "Venice",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.veniceIndexModuleUrl),
  },
  {
    providerIds: ["xai"],
    pluginId: "xai",
    name: "xAI",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.xAIIndexModuleUrl),
  },
  {
    providerIds: ["zai"],
    pluginId: "zai",
    name: "Z.AI",
    load: async () =>
      await importBundledProviderPlugin<{
        default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
      }>(providerRuntimeContractModules.zaiIndexModuleUrl),
  },
] as const;
========
export type ProviderRuntimeContractPluginLoader = () => Promise<{
  default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
}>;
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

function installRuntimeHooks(fixtures: readonly ProviderRuntimeContractFixture[]) {
  const providers = new Map<string, ProviderPlugin>();
  let loadPromise: Promise<void> | null = null;

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
function requireProviderContractProvider(providerId: string): ProviderPlugin {
  const provider = providerRuntimeContractProviders.get(providerId);
  if (!provider) {
    throw new Error(`provider runtime contract fixture missing for ${providerId}`);
  }
  return provider;
}

function installRuntimeHooks() {
  beforeAll(async () => {
    providerRuntimeContractProviders.clear();
    const registeredFixtures = await Promise.all(
      PROVIDER_RUNTIME_CONTRACT_FIXTURES.map(async (fixture) => {
        const plugin = await fixture.load();
        return {
          fixture,
          providers: (
            await registerProviderPlugin({
              plugin: plugin.default,
              id: fixture.pluginId,
              name: fixture.name,
            })
          ).providers,
        };
      }),
    );
    for (const { fixture, providers } of registeredFixtures) {
      for (const providerId of fixture.providerIds) {
        providerRuntimeContractProviders.set(
          providerId,
          requireRegisteredProvider(providers, providerId, "provider"),
        );
      }
========
  function requireProviderContractProvider(providerId: string): ProviderPlugin {
    const provider = providers.get(providerId);
    if (!provider) {
      throw new Error(`provider runtime contract fixture missing for ${providerId}`);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
    }
    return provider;
  }

  async function ensureProvidersLoaded() {
    if (!loadPromise) {
      loadPromise = (async () => {
        providers.clear();
        const registeredFixtures = await Promise.all(
          fixtures.map(async (fixture) => {
            const plugin = await fixture.load();
            return {
              fixture,
              providers: (
                await registerProviderPlugin({
                  plugin: plugin.default,
                  id: fixture.pluginId,
                  name: fixture.name,
                })
              ).providers,
            };
          }),
        );
        for (const { fixture, providers: registeredProviders } of registeredFixtures) {
          for (const providerId of fixture.providerIds) {
            providers.set(
              providerId,
              requireRegisteredProvider(registeredProviders, providerId, "provider"),
            );
          }
        }
      })();
    }

    await loadPromise;
  }

  beforeAll(async () => {
    installProviderRuntimeContractMocks();
    await ensureProvidersLoaded();
  }, CONTRACT_SETUP_TIMEOUT_MS);

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
========
  afterAll(() => {
    removeProviderRuntimeContractMocks();
  });

>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
  beforeEach(() => {
    refreshOpenAICodexTokenMock.mockReset();
  }, CONTRACT_SETUP_TIMEOUT_MS);
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeAnthropicProviderRuntimeContract() {
  describe("anthropic provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();

========
  return requireProviderContractProvider;
}

export function describeAnthropicProviderRuntimeContract(
  load: ProviderRuntimeContractPluginLoader,
) {
  describe("anthropic provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["anthropic"], pluginId: "anthropic", name: "Anthropic", load },
    ]);

>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
    it("owns anthropic 4.6 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("anthropic");
      const model = provider.resolveDynamicModel?.({
        provider: "anthropic",
        modelId: "claude-sonnet-4.6-20260219",
        modelRegistry: {
          find: (_provider: string, id: string) =>
<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
            id === "claude-sonnet-4.5-20260219"
========
            id === "claude-sonnet-4-6-20260219"
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
              ? createModel({
                  id,
                  api: "anthropic-messages",
                  provider: "anthropic",
                  baseUrl: "https://api.anthropic.com",
                })
              : null,
        } as never,
      });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
      expect(model).toMatchObject({
========
      expectFields(model, {
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
        id: "claude-sonnet-4.6-20260219",
        provider: "anthropic",
        api: "anthropic-messages",
        baseUrl: "https://api.anthropic.com",
      });
    });

    it("owns usage auth resolution", async () => {
      const provider = requireProviderContractProvider("anthropic");
      await expect(
        provider.resolveUsageAuth?.({
          config: {} as never,
          env: {} as NodeJS.ProcessEnv,
          provider: "anthropic",
          resolveApiKeyFromConfigAndStore: () => undefined,
          resolveOAuthToken: async () => ({
            token: "anthropic-oauth-token",
          }),
        }),
      ).resolves.toEqual({
        token: "anthropic-oauth-token",
      });
    });

    it("owns auth doctor hint generation", () => {
      const provider = requireProviderContractProvider("anthropic");
      const hint = provider.buildAuthDoctorHint?.({
        provider: "anthropic",
        profileId: "anthropic:default",
        config: {
          auth: {
            profiles: {
              "anthropic:default": {
                provider: "anthropic",
                mode: "oauth",
              },
            },
          },
        } as never,
        store: {
          version: 1,
          profiles: {
            "anthropic:oauth-user@example.com": {
              type: "oauth",
              provider: "anthropic",
              access: "oauth-access",
              refresh: "oauth-refresh",
              expires: Date.now() + 60_000,
            },
          },
        },
      });

      expect(hint).toContain("suggested profile: anthropic:oauth-user@example.com");
      expect(hint).toContain("openclaw doctor --yes");
    });

    it("owns usage snapshot fetching", async () => {
      const provider = requireProviderContractProvider("anthropic");
      const mockFetch = createProviderUsageFetch(async (url) => {
        if (url.includes("api.anthropic.com/api/oauth/usage")) {
          return makeResponse(200, {
            five_hour: { utilization: 20, resets_at: "2026-01-07T01:00:00Z" },
            seven_day: { utilization: 35, resets_at: "2026-01-09T01:00:00Z" },
          });
        }
        return makeResponse(404, "not found");
      });

      await expect(
        provider.fetchUsageSnapshot?.({
          config: {} as never,
          env: {} as NodeJS.ProcessEnv,
          provider: "anthropic",
          token: "anthropic-oauth-token",
          timeoutMs: 5_000,
          fetchFn: mockFetch as unknown as typeof fetch,
        }),
      ).resolves.toEqual({
        provider: "anthropic",
        displayName: "Claude",
        windows: [
          { label: "5h", usedPercent: 20, resetAt: Date.parse("2026-01-07T01:00:00Z") },
          { label: "Week", usedPercent: 35, resetAt: Date.parse("2026-01-09T01:00:00Z") },
        ],
      });
    });
  });
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeGithubCopilotProviderRuntimeContract() {
========
export function describeGithubCopilotProviderRuntimeContract(
  load: ProviderRuntimeContractPluginLoader,
) {
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
  describe(
    "github-copilot provider runtime contract",
    { timeout: CONTRACT_SETUP_TIMEOUT_MS },
    () => {
<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
      installRuntimeHooks();
========
      const requireProviderContractProvider = installRuntimeHooks([
        {
          providerIds: ["github-copilot"],
          pluginId: "github-copilot",
          name: "GitHub Copilot",
          load,
        },
      ]);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

      it("owns Copilot-specific forward-compat fallbacks", () => {
        const provider = requireProviderContractProvider("github-copilot");
        const model = provider.resolveDynamicModel?.({
          provider: "github-copilot",
          modelId: "gpt-5.4",
          modelRegistry: {
            find: (_provider: string, id: string) =>
              id === "gpt-5.2-codex"
                ? createModel({
                    id,
<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
                    api: "openai-codex-responses",
========
                    api: "openai-chatgpt-responses",
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
                    provider: "github-copilot",
                    baseUrl: "https://api.copilot.example",
                  })
                : null,
          } as never,
        });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
        expect(model).toMatchObject({
          id: "gpt-5.4",
          provider: "github-copilot",
          api: "openai-codex-responses",
========
        expectFields(model, {
          id: "gpt-5.4",
          provider: "github-copilot",
          api: "openai-responses",
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
        });
      });
    },
  );
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeGoogleProviderRuntimeContract() {
  describe("google provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();
========
export function describeGoogleProviderRuntimeContract(load: ProviderRuntimeContractPluginLoader) {
  describe("google provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["google", "google-gemini-cli"], pluginId: "google", name: "Google", load },
    ]);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

    it("owns google direct gemini 3.1 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("google");
      const model = provider.resolveDynamicModel?.({
        provider: "google",
        modelId: "gemini-3.1-pro-preview",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gemini-3-pro-preview"
              ? createModel({
                  id,
                  api: "google-generative-ai",
                  provider: "google",
                  baseUrl: "https://generativelanguage.googleapis.com",
                  reasoning: false,
                  contextWindow: 1_048_576,
                  maxTokens: 65_536,
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gemini-3.1-pro-preview",
        provider: "google",
        api: "google-generative-ai",
        baseUrl: "https://generativelanguage.googleapis.com",
        reasoning: true,
      });
    });

    it("owns gemini cli 3.1 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("google-gemini-cli");
      const model = provider.resolveDynamicModel?.({
        provider: "google-gemini-cli",
        modelId: "gemini-3.1-pro-preview",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gemini-3-pro-preview"
              ? createModel({
                  id,
                  api: "google-gemini-cli",
                  provider: "google-gemini-cli",
                  baseUrl: "https://cloudcode-pa.googleapis.com",
                  reasoning: false,
                  contextWindow: 1_048_576,
                  maxTokens: 65_536,
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gemini-3.1-pro-preview",
        provider: "google-gemini-cli",
        reasoning: true,
      });
    });

    it("owns usage-token parsing", async () => {
      const provider = requireProviderContractProvider("google-gemini-cli");
      await expect(
        provider.resolveUsageAuth?.({
          config: {} as never,
          env: {} as NodeJS.ProcessEnv,
          provider: "google-gemini-cli",
          resolveApiKeyFromConfigAndStore: () => undefined,
          resolveOAuthToken: async () => ({
            token: '{"token":"google-oauth-token"}',
            accountId: "google-account",
          }),
        }),
      ).resolves.toEqual({
        token: "google-oauth-token",
        accountId: "google-account",
      });
    });

    it("owns OAuth auth-profile formatting", () => {
      const provider = requireProviderContractProvider("google-gemini-cli");

      expect(
        provider.formatApiKey?.({
          type: "oauth",
          provider: "google-gemini-cli",
          access: "google-oauth-token",
          refresh: "refresh-token",
          expires: Date.now() + 60_000,
          projectId: "proj-123",
        }),
      ).toBe('{"token":"google-oauth-token","projectId":"proj-123"}');
    });

    it("owns usage snapshot fetching", async () => {
      const provider = requireProviderContractProvider("google-gemini-cli");
      const mockFetch = createProviderUsageFetch(async (url) => {
        if (url.includes("cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota")) {
          return makeResponse(200, {
            buckets: [
              { modelId: "gemini-3.1-pro-preview", remainingFraction: 0.4 },
              { modelId: "gemini-3.1-flash-preview", remainingFraction: 0.8 },
            ],
          });
        }
        return makeResponse(404, "not found");
      });

      const snapshot = await provider.fetchUsageSnapshot?.({
        config: {} as never,
        env: {} as NodeJS.ProcessEnv,
        provider: "google-gemini-cli",
        token: "google-oauth-token",
        timeoutMs: 5_000,
        fetchFn: mockFetch as unknown as typeof fetch,
      });

      expectFields(snapshot, {
        provider: "google-gemini-cli",
        displayName: "Gemini",
      });
      expect(snapshot?.windows[0]).toEqual({ label: "Pro", usedPercent: 60 });
      expect(snapshot?.windows[1]?.label).toBe("Flash");
      expect(snapshot?.windows[1]?.usedPercent).toBeCloseTo(20);
    });
  });
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeOpenAIProviderRuntimeContract() {
  describe("openai provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();
========
export function describeOpenAIProviderRuntimeContract(load: ProviderRuntimeContractPluginLoader) {
  describe("openai provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["openai", "openai"], pluginId: "openai", name: "OpenAI", load },
    ]);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

    it("owns openai gpt-5.4 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.4-pro",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.2-pro"
              ? createModel({
                  id,
                  provider: "openai",
                  baseUrl: "https://api.openai.com/v1",
                  input: ["text", "image"],
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gpt-5.4-pro",
        provider: "openai",
        api: "openai-responses",
        baseUrl: "https://api.openai.com/v1",
        contextWindow: 1_050_000,
        maxTokens: 128_000,
      });
    });

    it("owns openai gpt-5.5 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.5",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.4"
              ? createModel({
                  id,
                  provider: "openai",
                  baseUrl: "https://api.openai.com/v1",
                  input: ["text", "image"],
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gpt-5.5",
        provider: "openai",
        api: "openai-responses",
        baseUrl: "https://api.openai.com/v1",
        contextWindow: 1_000_000,
        contextTokens: 272_000,
        maxTokens: 128_000,
        mediaInput: {
          image: { maxSidePx: 6000, preferredSidePx: 2048, tokenMode: "detail" },
        },
      });
    });

    it("owns openai gpt-5.4 mini forward-compat resolution", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.4-mini",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5-mini"
              ? createModel({
                  id,
                  provider: "openai",
                  api: "openai-responses",
                  baseUrl: "https://api.openai.com/v1",
                  input: ["text", "image"],
                  reasoning: true,
                  contextWindow: 400_000,
                  maxTokens: 128_000,
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gpt-5.4-mini",
        provider: "openai",
        api: "openai-responses",
        baseUrl: "https://api.openai.com/v1",
        contextWindow: 400_000,
        maxTokens: 128_000,
      });
    });

    it("owns direct openai transport normalization", () => {
      const provider = requireProviderContractProvider("openai");
      expectFields(
        provider.normalizeResolvedModel?.({
          provider: "openai",
          modelId: "gpt-5.4",
          model: createModel({
            id: "gpt-5.4",
            provider: "openai",
            api: "openai-completions",
            baseUrl: "https://api.openai.com/v1",
            input: ["text", "image"],
            contextWindow: 1_050_000,
            maxTokens: 128_000,
          }),
        }),
<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
      ).toMatchObject({
        api: "openai-responses",
      });
    });

    it("owns refresh fallback for accountId extraction failures", async () => {
      const provider = requireProviderContractProvider("openai-codex");
      const credential = {
        type: "oauth" as const,
        provider: "openai-codex",
        access: "cached-access-token",
        refresh: "refresh-token",
        expires: Date.now() - 60_000,
      };

      refreshOpenAICodexTokenMock.mockRejectedValueOnce(
        new Error("Failed to extract accountId from token"),
      );

      await expect(provider.refreshOAuth?.(credential)).resolves.toEqual(credential);
    });

========
        {
          api: "openai-responses",
        },
      );
    });

    it("owns refresh fallback for accountId extraction failures", async () => {
      const provider = requireProviderContractProvider("openai");
      const credential = {
        type: "oauth" as const,
        provider: "openai",
        access: "cached-access-token",
        refresh: "refresh-token",
        expires: Date.now() - 60_000,
      };

      refreshOpenAICodexTokenMock.mockRejectedValueOnce(
        new Error("Failed to extract accountId from token"),
      );

      await expect(provider.refreshOAuth?.(credential)).resolves.toEqual(credential);
    });

>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
    it("owns forward-compat codex models", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.4",
        authProfileMode: "oauth",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.2-codex"
              ? createModel({
                  id,
                  api: "openai-chatgpt-responses",
                  provider: "openai",
                  baseUrl: "https://chatgpt.com/backend-api",
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gpt-5.4",
        provider: "openai",
        api: "openai-chatgpt-responses",
        contextWindow: 1_050_000,
        maxTokens: 128_000,
      });
    });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
    it("owns forward-compat codex mini models", () => {
      const provider = requireProviderContractProvider("openai-codex");
      const model = provider.resolveDynamicModel?.({
        provider: "openai-codex",
        modelId: "gpt-5.4-mini",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.1-codex-mini"
              ? createModel({
                  id,
                  api: "openai-codex-responses",
                  provider: "openai-codex",
                  baseUrl: "https://chatgpt.com/backend-api",
========
    it("keeps OpenClaw cost metadata but applies Codex context metadata for gpt-5.5 models", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.5",
        authProfileMode: "oauth",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.5"
              ? createModel({
                  id,
                  api: "openai-chatgpt-responses",
                  provider: "openai",
                  baseUrl: "https://chatgpt.com/backend-api",
                  input: ["text", "image"],
                  cost: { input: 5, output: 30, cacheRead: 0.5, cacheWrite: 0 },
                  contextWindow: 272_000,
                  maxTokens: 128_000,
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
                })
              : null,
        } as never,
      });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
      expect(model).toMatchObject({
        id: "gpt-5.4-mini",
        provider: "openai-codex",
        api: "openai-codex-responses",
        contextWindow: 272_000,
========
      expectFields(model, {
        id: "gpt-5.5",
        provider: "openai",
        api: "openai-chatgpt-responses",
        contextWindow: 400_000,
        contextTokens: 272_000,
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
        maxTokens: 128_000,
      });
    });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
========
    it("claims codex mini models through the Codex OAuth route", () => {
      const provider = requireProviderContractProvider("openai");
      const model = provider.resolveDynamicModel?.({
        provider: "openai",
        modelId: "gpt-5.4-mini",
        authProfileMode: "oauth",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "gpt-5.4"
              ? createModel({
                  id,
                  api: "openai-chatgpt-responses",
                  provider: "openai",
                  baseUrl: "https://chatgpt.com/backend-api",
                  cost: { input: 5, output: 30, cacheRead: 0.5, cacheWrite: 0 },
                  contextWindow: 272_000,
                  maxTokens: 128_000,
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "gpt-5.4-mini",
        provider: "openai",
        api: "openai-chatgpt-responses",
        contextWindow: 400_000,
        contextTokens: 272_000,
        maxTokens: 128_000,
        cost: { input: 0.75, output: 4.5, cacheRead: 0.075, cacheWrite: 0 },
      });
    });

>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
    it("owns codex transport defaults", () => {
      const provider = requireProviderContractProvider("openai");
      expect(
        provider.prepareExtraParams?.({
          provider: "openai",
          modelId: "gpt-5.4",
          model: createModel({
            id: "gpt-5.4",
            provider: "openai",
            api: "openai-chatgpt-responses",
            baseUrl: "https://chatgpt.com/backend-api/codex",
          }),
          extraParams: { temperature: 0.2 },
        }),
      ).toEqual({
        temperature: 0.2,
        transport: "auto",
      });
    });

    it("owns usage snapshot fetching", async () => {
      const provider = requireProviderContractProvider("openai");
      const mockFetch = createProviderUsageFetch(async (url) => {
        if (url.includes("chatgpt.com/backend-api/wham/usage")) {
          return makeResponse(200, {
            rate_limit: {
              primary_window: {
                used_percent: 12,
                limit_window_seconds: 10800,
                reset_at: 1_705_000,
              },
            },
            plan_type: "Plus",
          });
        }
        return makeResponse(404, "not found");
      });

      await expect(
        provider.fetchUsageSnapshot?.({
          config: {} as never,
          env: {} as NodeJS.ProcessEnv,
          provider: "openai",
          token: "codex-token",
          accountId: "acc-1",
          timeoutMs: 5_000,
          fetchFn: mockFetch as unknown as typeof fetch,
        }),
      ).resolves.toEqual({
        provider: "openai",
        displayName: "OpenAI",
        windows: [{ label: "3h", usedPercent: 12, resetAt: 1_705_000_000 }],
        plan: "Plus",
      });
    });
  });
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeXAIProviderRuntimeContract() {
  describe("xai provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();

    it("owns Grok forward-compat resolution for newer fast models", () => {
      const provider = requireProviderContractProvider("xai");
      const model = provider.resolveDynamicModel?.({
        provider: "xai",
        modelId: "grok-4-1-fast-reasoning",
        modelRegistry: {
          find: () => null,
        } as never,
        providerConfig: {
          api: "openai-completions",
          baseUrl: "https://api.x.ai/v1",
        },
      });

      expect(model).toMatchObject({
        id: "grok-4-1-fast-reasoning",
        provider: "xai",
        api: "openai-completions",
        baseUrl: "https://api.x.ai/v1",
        reasoning: true,
        contextWindow: 2_000_000,
      });
    });

    it("owns modern-model matching without accepting multi-agent ids", () => {
      const provider = requireProviderContractProvider("xai");

      expect(
        provider.isModernModelRef?.({
          provider: "xai",
          modelId: "grok-4-1-fast-reasoning",
        } as never),
      ).toBe(true);
      expect(
        provider.isModernModelRef?.({
          provider: "xai",
          modelId: "grok-4.20-multi-agent-experimental-beta-0304",
        } as never),
      ).toBe(false);
    });

    it("owns direct xai compat flags on resolved models", () => {
      const provider = requireProviderContractProvider("xai");

      expect(
        provider.normalizeResolvedModel?.({
          provider: "xai",
          modelId: "grok-4-1-fast",
          model: createModel({
            id: "grok-4-1-fast",
            provider: "xai",
            api: "openai-completions",
            baseUrl: "https://api.x.ai/v1",
          }),
        } as never),
      ).toMatchObject({
        compat: {
          toolSchemaProfile: "xai",
          nativeWebSearchTool: true,
          toolCallArgumentsEncoding: "html-entities",
        },
      });
    });

    it("owns downstream xai compat contributions for x-ai routed models", () => {
      const provider = requireProviderContractProvider("xai");

      expect(
        provider.contributeResolvedModelCompat?.({
          provider: "openrouter",
          modelId: "x-ai/grok-4-1-fast",
          model: createModel({
            id: "x-ai/grok-4-1-fast",
            provider: "openrouter",
            api: "openai-completions",
            baseUrl: "https://openrouter.ai/api/v1",
          }),
        } as never),
      ).toMatchObject({
        toolSchemaProfile: "xai",
        nativeWebSearchTool: true,
        toolCallArgumentsEncoding: "html-entities",
      });
    });

    it("owns xai tool_stream defaults", () => {
      const provider = requireProviderContractProvider("xai");

      expect(
        provider.prepareExtraParams?.({
          provider: "xai",
          modelId: "grok-4-1-fast-reasoning",
          extraParams: { temperature: 0.2 },
        }),
      ).toEqual({
        temperature: 0.2,
        tool_stream: true,
      });

      expect(
        provider.prepareExtraParams?.({
          provider: "xai",
          modelId: "grok-4-1-fast-reasoning",
          extraParams: { tool_stream: false },
        }),
      ).toEqual({
        tool_stream: false,
      });
    });

    it("owns xai fast-mode model rewriting through the plugin stream hook", () => {
      const provider = requireProviderContractProvider("xai");
      let capturedModelId = "";
      const baseStreamFn: StreamFn = (model) => {
        capturedModelId = model.id;
        return {
          push() {},
          async result() {
            return undefined;
          },
          async *[Symbol.asyncIterator]() {
            // Minimal async stream surface for xAI decode wrappers.
          },
        } as unknown as ReturnType<StreamFn>;
      };

      const streamFn = provider.wrapStreamFn?.({
        provider: "xai",
        modelId: "grok-4",
        extraParams: { fastMode: true },
        streamFn: baseStreamFn,
      });

      expect(streamFn).toBeTypeOf("function");
      void streamFn?.(
        createModel({
          id: "grok-4",
          provider: "xai",
          api: "openai-completions",
          baseUrl: "https://api.x.ai/v1",
        }) as never,
        { messages: [] } as never,
        {},
      );
      expect(capturedModelId).toBe("grok-4-fast");
    });
  });
}

export function describeOpenRouterProviderRuntimeContract() {
  describe("openrouter provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();
========
export function describeOpenRouterProviderRuntimeContract(
  load: ProviderRuntimeContractPluginLoader,
) {
  describe("openrouter provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["openrouter"], pluginId: "openrouter", name: "OpenRouter", load },
    ]);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

    it("owns dynamic OpenRouter model defaults", () => {
      const provider = requireProviderContractProvider("openrouter");
      const model = provider.resolveDynamicModel?.({
        provider: "openrouter",
        modelId: "x-ai/grok-4-1-fast",
        modelRegistry: {
          find: () => null,
        } as never,
      });

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
      expect(model).toMatchObject({
========
      expectFields(model, {
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
        id: "x-ai/grok-4-1-fast",
        provider: "openrouter",
        api: "openai-completions",
        baseUrl: "https://openrouter.ai/api/v1",
        maxTokens: 8192,
      });
    });
  });
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeVeniceProviderRuntimeContract() {
  describe("venice provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();

    it("owns xai downstream compat flags for grok-backed Venice models", () => {
      const provider = requireProviderContractProvider("venice");
      expect(
        provider.normalizeResolvedModel?.({
          provider: "venice",
          modelId: "grok-41-fast",
          model: createModel({
            id: "grok-41-fast",
            provider: "venice",
            api: "openai-completions",
            baseUrl: "https://api.venice.ai/api/v1",
          }),
        }),
      ).toMatchObject({
        compat: {
          toolSchemaProfile: "xai",
          nativeWebSearchTool: true,
          toolCallArgumentsEncoding: "html-entities",
        },
      });
========
export function describeVeniceProviderRuntimeContract(load: ProviderRuntimeContractPluginLoader) {
  describe("venice provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["venice"], pluginId: "venice", name: "Venice", load },
    ]);

    it("owns xai downstream compat flags for grok-backed Venice models", () => {
      const provider = requireProviderContractProvider("venice");
      const model = provider.normalizeResolvedModel?.({
        provider: "venice",
        modelId: "grok-41-fast",
        model: createModel({
          id: "grok-41-fast",
          provider: "venice",
          api: "openai-completions",
          baseUrl: "https://api.venice.ai/api/v1",
        }),
      });
      const compat = requireRecord(model?.compat, "compat");
      expect(compat.toolSchemaProfile).toBe("xai");
      expect(compat.nativeWebSearchTool).toBe(true);
      expect(compat.toolCallArgumentsEncoding).toBe("html-entities");
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts
    });
  });
}

<<<<<<<< HEAD:test/helpers/plugins/provider-runtime-contract.ts
export function describeZAIProviderRuntimeContract() {
  describe("zai provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    installRuntimeHooks();
========
export function describeZAIProviderRuntimeContract(load: ProviderRuntimeContractPluginLoader) {
  describe("zai provider runtime contract", { timeout: CONTRACT_SETUP_TIMEOUT_MS }, () => {
    const requireProviderContractProvider = installRuntimeHooks([
      { providerIds: ["zai"], pluginId: "zai", name: "Z.AI", load },
    ]);
>>>>>>>> upstream/main:src/plugin-sdk/test-helpers/provider-runtime-contract.ts

    it("owns glm-5 forward-compat resolution", () => {
      const provider = requireProviderContractProvider("zai");
      const model = provider.resolveDynamicModel?.({
        provider: "zai",
        modelId: "glm-5",
        modelRegistry: {
          find: (_provider: string, id: string) =>
            id === "glm-4.7"
              ? createModel({
                  id,
                  api: "openai-completions",
                  provider: "zai",
                  baseUrl: "https://api.z.ai/api/paas/v4",
                  reasoning: false,
                  contextWindow: 202_752,
                  maxTokens: 16_384,
                })
              : null,
        } as never,
      });

      expectFields(model, {
        id: "glm-5",
        provider: "zai",
        api: "openai-completions",
        reasoning: true,
      });
    });

    it("owns usage auth resolution", async () => {
      const provider = requireProviderContractProvider("zai");
      await expect(
        provider.resolveUsageAuth?.({
          config: {} as never,
          env: {
            ZAI_API_KEY: "env-zai-token",
          } as NodeJS.ProcessEnv,
          provider: "zai",
          resolveApiKeyFromConfigAndStore: () => "env-zai-token",
          resolveOAuthToken: async () => null,
        }),
      ).resolves.toEqual({
        token: "env-zai-token",
      });
    });

    it("owns usage snapshot fetching", async () => {
      const provider = requireProviderContractProvider("zai");
      const mockFetch = createProviderUsageFetch(async (url) => {
        if (url.includes("api.z.ai/api/monitor/usage/quota/limit")) {
          return makeResponse(200, {
            success: true,
            code: 200,
            data: {
              planName: "Pro",
              limits: [
                {
                  type: "TOKENS_LIMIT",
                  percentage: 25,
                  unit: 3,
                  number: 6,
                  nextResetTime: "2026-01-07T06:00:00Z",
                },
              ],
            },
          });
        }
        return makeResponse(404, "not found");
      });

      await expect(
        provider.fetchUsageSnapshot?.({
          config: {} as never,
          env: {} as NodeJS.ProcessEnv,
          provider: "zai",
          token: "env-zai-token",
          timeoutMs: 5_000,
          fetchFn: mockFetch as unknown as typeof fetch,
        }),
      ).resolves.toEqual({
        provider: "zai",
        displayName: "z.ai",
        windows: [{ label: "Tokens (6h)", usedPercent: 25, resetAt: 1_767_765_600_000 }],
        plan: "Pro",
      });
    });
  });
}
