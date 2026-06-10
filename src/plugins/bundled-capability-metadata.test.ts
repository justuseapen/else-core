<<<<<<< HEAD
import { describe, expect, it } from "vitest";
import { listBundledPluginMetadata } from "./bundled-plugin-metadata.js";
=======
// Verifies bundled capability metadata emitted by plugins.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { expectNoReaddirSyncDuring } from "../test-utils/fs-scan-assertions.js";
import { listGitTrackedFiles, toRepoRelativePath } from "../test-utils/repo-files.js";
import { normalizeBundledPluginStringList } from "./bundled-plugin-scan.js";
>>>>>>> upstream/main
import {
  BUNDLED_AUTO_ENABLE_PROVIDER_PLUGIN_IDS,
  BUNDLED_LEGACY_PLUGIN_ID_ALIASES,
  BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS,
<<<<<<< HEAD
} from "./contracts/inventory/bundled-capability-metadata.js";

function uniqueStrings(values: readonly string[] | undefined): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values ?? []) {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

describe("bundled capability metadata", () => {
  it("keeps contract snapshots aligned with bundled plugin manifests", () => {
    const expected = listBundledPluginMetadata()
      .map(({ manifest }) => ({
        pluginId: manifest.id,
        providerIds: uniqueStrings(manifest.providers),
        speechProviderIds: uniqueStrings(manifest.contracts?.speechProviders),
        realtimeTranscriptionProviderIds: uniqueStrings(
          manifest.contracts?.realtimeTranscriptionProviders,
        ),
        realtimeVoiceProviderIds: uniqueStrings(manifest.contracts?.realtimeVoiceProviders),
        mediaUnderstandingProviderIds: uniqueStrings(
          manifest.contracts?.mediaUnderstandingProviders,
        ),
        imageGenerationProviderIds: uniqueStrings(manifest.contracts?.imageGenerationProviders),
        videoGenerationProviderIds: uniqueStrings(manifest.contracts?.videoGenerationProviders),
        musicGenerationProviderIds: uniqueStrings(manifest.contracts?.musicGenerationProviders),
        webFetchProviderIds: uniqueStrings(manifest.contracts?.webFetchProviders),
        webSearchProviderIds: uniqueStrings(manifest.contracts?.webSearchProviders),
        toolNames: uniqueStrings(manifest.contracts?.tools),
      }))
      .filter(
        (entry) =>
          entry.providerIds.length > 0 ||
          entry.speechProviderIds.length > 0 ||
          entry.realtimeTranscriptionProviderIds.length > 0 ||
          entry.realtimeVoiceProviderIds.length > 0 ||
          entry.mediaUnderstandingProviderIds.length > 0 ||
          entry.imageGenerationProviderIds.length > 0 ||
          entry.videoGenerationProviderIds.length > 0 ||
          entry.musicGenerationProviderIds.length > 0 ||
          entry.webFetchProviderIds.length > 0 ||
          entry.webSearchProviderIds.length > 0 ||
          entry.toolNames.length > 0,
      )
      .toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));

    expect(BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS).toEqual(expected);
  });

  it("keeps lightweight alias maps aligned with bundled plugin manifests", () => {
    const manifests = listBundledPluginMetadata().map((entry) => entry.manifest);
=======
  buildBundledPluginContractSnapshot,
  hasBundledPluginContractSnapshotCapabilities,
} from "./contracts/inventory/bundled-capability-metadata.js";
import { pluginTestRepoRoot as repoRoot } from "./generated-plugin-test-helpers.js";
import type { OpenClawPackageManifest } from "./manifest.js";
import type { PluginManifest } from "./manifest.js";

function listGitExtensionPackagePaths(extensionsDir: string): string[] | null {
  const relativeDir = toRepoRelativePath(repoRoot, extensionsDir);
  if (!relativeDir || relativeDir.startsWith("..") || path.isAbsolute(relativeDir)) {
    return null;
  }
  const files = listGitTrackedFiles({ repoRoot, pathspecs: relativeDir });
  if (!files) {
    return null;
  }
  return files
    .filter((line) => /^extensions\/[^/]+\/package\.json$/u.test(line))
    .map((line) => path.join(repoRoot, ...line.split("/")))
    .toSorted();
}

function listExtensionPackagePaths(extensionsDir: string): string[] {
  const gitPaths = listGitExtensionPackagePaths(extensionsDir);
  if (gitPaths) {
    return gitPaths;
  }

  return fs
    .readdirSync(extensionsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(extensionsDir, entry.name, "package.json"))
    .filter((packagePath) => fs.existsSync(packagePath));
}

function readManifestRecords(): PluginManifest[] {
  const extensionsDir = path.join(repoRoot, "extensions");
  return listExtensionPackagePaths(extensionsDir)
    .filter((packagePath) => {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8")) as {
        openclaw?: OpenClawPackageManifest;
      };
      return normalizeBundledPluginStringList(packageJson.openclaw?.extensions).length > 0;
    })
    .map(
      (packagePath) =>
        JSON.parse(
          fs.readFileSync(path.join(path.dirname(packagePath), "openclaw.plugin.json"), "utf-8"),
        ) as PluginManifest,
    )
    .toSorted((left, right) => left.id.localeCompare(right.id));
}

describe("bundled capability metadata", () => {
  it("lists bundled extension packages from git without scanning extension dirs", () => {
    const extensionsDir = path.join(repoRoot, "extensions");
    expectNoReaddirSyncDuring(() => {
      const packagePaths = listExtensionPackagePaths(extensionsDir);

      expect(packagePaths.length).toBeGreaterThan(0);
      expect(packagePaths.every((file) => file.endsWith("package.json"))).toBe(true);
    });
  });

  it("keeps contract snapshots aligned with bundled plugin manifests", () => {
    const expected = readManifestRecords()
      .map(buildBundledPluginContractSnapshot)
      .filter(hasBundledPluginContractSnapshotCapabilities)
      .toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));

    expect(BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS).toEqual(expected);
    expect(
      BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.find((entry) => entry.pluginId === "migrate-hermes"),
    ).toEqual({
      pluginId: "migrate-hermes",
      cliBackendIds: [],
      providerIds: [],
      providerEnvVars: {},
      embeddingProviderIds: [],
      speechProviderIds: [],
      realtimeTranscriptionProviderIds: [],
      realtimeVoiceProviderIds: [],
      mediaUnderstandingProviderIds: [],
      transcriptSourceProviderIds: [],
      documentExtractorIds: [],
      imageGenerationProviderIds: [],
      videoGenerationProviderIds: [],
      musicGenerationProviderIds: [],
      webContentExtractorIds: [],
      webFetchProviderIds: [],
      webSearchProviderIds: [],
      migrationProviderIds: ["hermes"],
      toolNames: [],
    });
  });

  it("keeps lightweight alias maps aligned with bundled plugin manifests", () => {
    const manifests = readManifestRecords();
>>>>>>> upstream/main
    const expectedLegacyAliases = Object.fromEntries(
      manifests
        .flatMap((manifest) =>
          (manifest.legacyPluginIds ?? []).map((legacyPluginId) => [legacyPluginId, manifest.id]),
        )
        .toSorted(([left], [right]) => left.localeCompare(right)),
    );
    const expectedAutoEnableProviderPluginIds = Object.fromEntries(
      manifests
        .flatMap((manifest) =>
          (manifest.autoEnableWhenConfiguredProviders ?? []).map((providerId) => [
            providerId,
            manifest.id,
          ]),
        )
        .toSorted(([left], [right]) => left.localeCompare(right)),
    );

    expect(BUNDLED_LEGACY_PLUGIN_ID_ALIASES).toEqual(expectedLegacyAliases);
    expect(BUNDLED_AUTO_ENABLE_PROVIDER_PLUGIN_IDS).toEqual(expectedAutoEnableProviderPluginIds);
  });
});
