// Loader contract tests cover plugin loader behavior, registry setup, and reset boundaries.
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
<<<<<<< HEAD
import { withBundledPluginAllowlistCompat } from "../bundled-compat.js";
import {
  loadPluginManifestRegistry,
  resolveManifestContractPluginIds,
} from "../manifest-registry.js";
import { __testing as providerTesting } from "../providers.js";
import { resolvePluginWebSearchProviders } from "../web-search-providers.runtime.js";
=======
import { uniqueSortedStrings } from "../../plugin-sdk/test-helpers/string-utils.js";
import { resolveManifestContractPluginIds } from "../plugin-registry.js";
import { testing as providerTesting } from "../providers.js";
import { resolveBundledContractSnapshotPluginIds } from "./inventory/bundled-capability-metadata.js";
>>>>>>> upstream/main
import { providerContractCompatPluginIds } from "./registry.js";

function resolveBundledManifestProviderPluginIds() {
  return uniqueSortedStrings(resolveBundledContractSnapshotPluginIds("providerIds"));
}

function expectPluginAllowlistEquals(
  allow: string[] | undefined,
  pluginIds: string[],
  expectedExtraEntry?: string,
) {
  expect(allow).toEqual(expectedExtraEntry ? [expectedExtraEntry, ...pluginIds] : pluginIds);
}

function expectPluginAllowlistContains(
  allow: string[] | undefined,
  pluginIds: string[],
  expectedExtraEntry?: string,
) {
  expect(allow).toEqual(expect.arrayContaining(pluginIds));
  if (expectedExtraEntry) {
    expect(allow).toContain(expectedExtraEntry);
  }
}

function createAllowlistCompatConfig(pluginIds: string[]) {
  return withBundledPluginAllowlistCompat({
    config: {
      plugins: {
        allow: [demoAllowEntry],
      },
    },
    pluginIds,
  });
}

const demoAllowEntry = "demo-allowed";

describe("plugin loader contract", () => {
  let providerPluginIds: string[] = [];
  let manifestProviderPluginIds: string[] = [];
<<<<<<< HEAD
  let compatPluginIds: string[] = [];
  let compatConfig: ReturnType<typeof withBundledPluginAllowlistCompat>;
  let vitestCompatConfig: ReturnType<typeof providerTesting.withBundledProviderVitestCompat>;
  let webSearchPluginIds: string[] = [];
  let bundledWebSearchPluginIds: string[] = [];
  let webSearchAllowlistCompatConfig: ReturnType<typeof withBundledPluginAllowlistCompat>;
=======
  let vitestCompatConfig: ReturnType<typeof providerTesting.withBundledProviderVitestCompat>;
  let webSearchPluginIds: string[] = [];
  let bundledWebSearchPluginIds: string[] = [];
>>>>>>> upstream/main

  beforeAll(() => {
    providerPluginIds = uniqueSortedStrings(providerContractCompatPluginIds);
    manifestProviderPluginIds = resolveBundledManifestProviderPluginIds();
<<<<<<< HEAD
    compatPluginIds = providerTesting.resolveBundledProviderCompatPluginIds({
      config: {
        plugins: {
          allow: [demoAllowEntry],
        },
      },
    });
    compatConfig = createAllowlistCompatConfig(compatPluginIds);
=======
>>>>>>> upstream/main
    vitestCompatConfig = providerTesting.withBundledProviderVitestCompat({
      config: undefined,
      pluginIds: providerPluginIds,
      env: { VITEST: "1" } as NodeJS.ProcessEnv,
    });
    webSearchPluginIds = uniqueSortedStrings(
<<<<<<< HEAD
      resolvePluginWebSearchProviders({ origin: "bundled" }).map((entry) => entry.pluginId),
    );
    bundledWebSearchPluginIds = uniqueSortedStrings(
      resolveManifestContractPluginIds({
        contract: "webSearchProviders",
        origin: "bundled",
      }),
    );
    webSearchAllowlistCompatConfig = createAllowlistCompatConfig(webSearchPluginIds);
=======
      resolveBundledContractSnapshotPluginIds("webSearchProviderIds"),
    );
    bundledWebSearchPluginIds = uniqueSortedStrings(
      resolveManifestContractPluginIds({
        contract: "webSearchProviders",
        origin: "bundled",
      }),
    );
>>>>>>> upstream/main
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps bundled provider registry wired to the manifest inventory", () => {
    expect(providerPluginIds).toEqual(manifestProviderPluginIds);
<<<<<<< HEAD
    const sortedCompatPluginIds = uniqueSortedStrings(compatPluginIds);
    expect(sortedCompatPluginIds).toEqual(manifestProviderPluginIds);
    expect(sortedCompatPluginIds).toEqual(expect.arrayContaining(providerPluginIds));
    expectPluginAllowlistContains(compatConfig?.plugins?.allow, providerPluginIds, demoAllowEntry);
=======
>>>>>>> upstream/main
  });

  it("keeps vitest bundled provider enablement wired to the provider registry", () => {
    expect(providerPluginIds).toEqual(manifestProviderPluginIds);
    expect(vitestCompatConfig?.plugins?.enabled).toBe(true);
<<<<<<< HEAD
    expectPluginAllowlistContains(vitestCompatConfig?.plugins?.allow, providerPluginIds);
=======
    expectPluginAllowlistEquals(vitestCompatConfig?.plugins?.allow, providerPluginIds);
>>>>>>> upstream/main
  });

  it("keeps bundled web search loading scoped to the web search registry", () => {
    expect(bundledWebSearchPluginIds).toEqual(webSearchPluginIds);
  });
<<<<<<< HEAD

  it("keeps bundled web search allowlist compatibility wired to the web search registry", () => {
    expectPluginAllowlistContains(
      webSearchAllowlistCompatConfig?.plugins?.allow,
      webSearchPluginIds,
      demoAllowEntry,
    );
  });
=======
>>>>>>> upstream/main
});
