<<<<<<< HEAD
import { beforeEach, describe, it, vi } from "vitest";
import {
  expectAugmentedCodexCatalog,
  expectCodexBuiltInSuppression,
  expectCodexMissingAuthHint,
  importProviderRuntimeCatalogModule,
  loadBundledPluginPublicSurfaceSync,
} from "../../../test/helpers/plugins/provider-catalog.js";
import type { ProviderPlugin } from "../../../test/helpers/plugins/provider-catalog.js";
import {
  registerProviderPlugin,
  requireRegisteredProvider,
} from "../../../test/helpers/plugins/provider-registration.js";
=======
// Openai provider module implements model/runtime integration.
import {
  registerProviderPlugin,
  requireRegisteredProvider,
} from "openclaw/plugin-sdk/plugin-test-runtime";
import {
  expectAugmentedCodexCatalog,
  expectedOpenaiPluginCodexCatalogEntriesWithGpt55,
  expectCodexMissingAuthHint,
  importProviderRuntimeCatalogModule,
  loadBundledPluginPublicSurface,
} from "openclaw/plugin-sdk/provider-test-contracts";
import type { ProviderPlugin } from "openclaw/plugin-sdk/provider-test-contracts";
import { beforeEach, describe, it, vi } from "vitest";
>>>>>>> upstream/main

const PROVIDER_CATALOG_CONTRACT_TIMEOUT_MS = 300_000;

type ResolvePluginProviders = (params?: { onlyPluginIds?: string[] }) => ProviderPlugin[];
type ResolveOwningPluginIdsForProvider = (params: { provider: string }) => string[] | undefined;
type ResolveCatalogHookProviderPluginIds = (params: unknown) => string[];

const resolvePluginProvidersMock = vi.hoisted(() => vi.fn<ResolvePluginProviders>(() => []));
const resolveOwningPluginIdsForProviderMock = vi.hoisted(() =>
  vi.fn<ResolveOwningPluginIdsForProvider>(() => undefined),
);
const resolveCatalogHookProviderPluginIdsMock = vi.hoisted(() =>
  vi.fn<ResolveCatalogHookProviderPluginIds>((_) => [] as string[]),
);

<<<<<<< HEAD
vi.mock("../../../src/plugins/providers.js", () => ({
  resolveOwningPluginIdsForProvider: (params: unknown) =>
    resolveOwningPluginIdsForProviderMock(params as never),
  resolveCatalogHookProviderPluginIds: (params: unknown) =>
    resolveCatalogHookProviderPluginIdsMock(params as never),
}));

vi.mock("../../../src/plugins/providers.runtime.js", () => ({
  resolvePluginProviders: (params: unknown) => resolvePluginProvidersMock(params as never),
}));
=======
vi.mock("openclaw/plugin-sdk/provider-catalog-runtime", async () => {
  const actual = await vi.importActual<
    typeof import("openclaw/plugin-sdk/provider-catalog-runtime")
  >("openclaw/plugin-sdk/provider-catalog-runtime");
  const resolveCatalogHookProviders = (params: unknown) =>
    resolvePluginProvidersMock({
      onlyPluginIds: resolveCatalogHookProviderPluginIdsMock(params),
    });
  return {
    ...actual,
    augmentModelCatalogWithProviderPlugins: async (params: {
      context: Parameters<NonNullable<ProviderPlugin["augmentModelCatalog"]>>[0];
    }) => {
      const supplemental = [];
      for (const provider of resolveCatalogHookProviders(params)) {
        const entries = await provider.augmentModelCatalog?.(params.context);
        if (entries?.length) {
          supplemental.push(...entries);
        }
      }
      return supplemental;
    },
    resolveOwningPluginIdsForProvider: (params: unknown) =>
      resolveOwningPluginIdsForProviderMock(params as never),
    resolveCatalogHookProviderPluginIds: (params: unknown) =>
      resolveCatalogHookProviderPluginIdsMock(params as never),
    isPluginProvidersLoadInFlight: () => false,
    resolvePluginProviders: (params: unknown) => resolvePluginProvidersMock(params as never),
  };
});
>>>>>>> upstream/main

export function describeOpenAIProviderCatalogContract() {
  const contractDepsPromise = (async () => {
    vi.resetModules();
<<<<<<< HEAD
    const openaiPlugin = loadBundledPluginPublicSurfaceSync<{
=======
    const openaiPlugin = await loadBundledPluginPublicSurface<{
>>>>>>> upstream/main
      default: Parameters<typeof registerProviderPlugin>[0]["plugin"];
    }>({
      pluginId: "openai",
      artifactBasename: "index.js",
    });
    const openaiProviders = (
      await registerProviderPlugin({
        plugin: openaiPlugin.default,
        id: "openai",
        name: "OpenAI",
      })
    ).providers;
    const openaiProvider = requireRegisteredProvider(openaiProviders, "openai", "provider");
<<<<<<< HEAD
    const {
      augmentModelCatalogWithProviderPlugins,
      resetProviderRuntimeHookCacheForTest,
      resolveProviderBuiltInModelSuppression,
    } = await importProviderRuntimeCatalogModule();
    return {
      augmentModelCatalogWithProviderPlugins,
      resetProviderRuntimeHookCacheForTest,
      resolveProviderBuiltInModelSuppression,
=======
    const { augmentModelCatalogWithProviderPlugins } = await importProviderRuntimeCatalogModule();
    return {
      augmentModelCatalogWithProviderPlugins,
>>>>>>> upstream/main
      openaiProviders,
      openaiProvider,
    };
  })();

  describe(
    "openai provider catalog contract",
    { timeout: PROVIDER_CATALOG_CONTRACT_TIMEOUT_MS },
    () => {
      beforeEach(async () => {
<<<<<<< HEAD
        const { resetProviderRuntimeHookCacheForTest, openaiProviders } = await contractDepsPromise;
        resetProviderRuntimeHookCacheForTest();
=======
        const { openaiProviders } = await contractDepsPromise;
>>>>>>> upstream/main

        resolvePluginProvidersMock.mockReset();
        resolvePluginProvidersMock.mockImplementation((params?: { onlyPluginIds?: string[] }) => {
          const onlyPluginIds = params?.onlyPluginIds;
          if (!onlyPluginIds || onlyPluginIds.length === 0) {
            return openaiProviders;
          }
          return onlyPluginIds.includes("openai") ? openaiProviders : [];
        });

        resolveOwningPluginIdsForProviderMock.mockReset();
        resolveOwningPluginIdsForProviderMock.mockImplementation((params) => {
          switch (params.provider) {
            case "azure-openai-responses":
            case "openai":
<<<<<<< HEAD
            case "openai-codex":
=======
>>>>>>> upstream/main
              return ["openai"];
            default:
              return undefined;
          }
        });

        resolveCatalogHookProviderPluginIdsMock.mockReset();
        resolveCatalogHookProviderPluginIdsMock.mockReturnValue(["openai"]);
      });

      it("keeps codex-only missing-auth hints wired through the provider runtime", async () => {
        const { openaiProvider } = await contractDepsPromise;
        expectCodexMissingAuthHint(
          (params) => openaiProvider.buildMissingAuthMessage?.(params.context) ?? undefined,
<<<<<<< HEAD
        );
      });

      it("keeps built-in model suppression wired through the provider runtime", async () => {
        const { resolveProviderBuiltInModelSuppression } = await contractDepsPromise;
        expectCodexBuiltInSuppression(resolveProviderBuiltInModelSuppression);
      });

      it("keeps bundled model augmentation wired through the provider runtime", async () => {
        const { augmentModelCatalogWithProviderPlugins } = await contractDepsPromise;
        await expectAugmentedCodexCatalog(augmentModelCatalogWithProviderPlugins);
=======
          "openai/gpt-5.5",
        );
      });

      it("keeps bundled model augmentation wired through the provider runtime", async () => {
        const { augmentModelCatalogWithProviderPlugins } = await contractDepsPromise;
        await expectAugmentedCodexCatalog(
          augmentModelCatalogWithProviderPlugins,
          expectedOpenaiPluginCodexCatalogEntriesWithGpt55,
        );
>>>>>>> upstream/main
      });
    },
  );
}
