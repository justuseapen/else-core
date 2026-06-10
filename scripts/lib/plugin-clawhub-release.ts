<<<<<<< HEAD
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { validateExternalCodePluginPackageJson } from "../../packages/plugin-package-contract/src/index.ts";
import { parseReleaseVersion } from "../openclaw-npm-release-check.ts";
import {
  collectChangedExtensionIdsFromPaths,
  collectPublishablePluginPackageErrors,
  parsePluginReleaseArgs,
  parsePluginReleaseSelection,
  parsePluginReleaseSelectionMode,
  resolveChangedPublishablePluginPackages,
  resolveSelectedPublishablePluginPackages,
  type GitRangeSelection,
  type ParsedPluginReleaseArgs,
  type PluginReleaseSelectionMode,
} from "./plugin-npm-release.ts";

export {
  collectChangedExtensionIdsFromPaths,
  parsePluginReleaseArgs,
  parsePluginReleaseSelection,
  parsePluginReleaseSelectionMode,
  resolveChangedPublishablePluginPackages,
  resolveSelectedPublishablePluginPackages,
  type GitRangeSelection,
  type ParsedPluginReleaseArgs,
  type PluginReleaseSelectionMode,
};

export type PluginPackageJson = {
=======
// Plugin Clawhub Release script supports OpenClaw repository automation.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { validateExternalCodePluginPackageJson } from "../../packages/plugin-package-contract/src/index.ts";
import { readBoundedResponseText } from "./bounded-response.ts";
import {
  collectExtensionPackageJsonCandidates,
  collectChangedPathsFromGitRange,
  collectChangedExtensionIdsFromPaths,
  collectPublishablePluginPackageErrors,
  assertPluginReleaseVersionFloors,
  parsePluginReleaseArgs,
  resolvePublishablePluginVersion,
  resolveGitCommitSha,
  resolveChangedPublishablePluginPackages,
  resolveSelectedPublishablePluginPackages,
  type GitRangeSelection,
  type PluginReleaseSelectionMode,
} from "./plugin-npm-release.ts";

export { assertPluginReleaseVersionFloors, parsePluginReleaseArgs };

type PluginPackageJson = {
>>>>>>> upstream/main
  name?: string;
  version?: string;
  private?: boolean;
  openclaw?: {
    extensions?: string[];
    install?: {
      npmSpec?: string;
    };
    compat?: {
      pluginApi?: string;
      minGatewayVersion?: string;
    };
    build?: {
      openclawVersion?: string;
      pluginSdkVersion?: string;
    };
    release?: {
      publishToClawHub?: boolean;
      publishToNpm?: boolean;
    };
  };
};

export type PublishablePluginPackage = {
  extensionId: string;
  packageDir: string;
  packageName: string;
  version: string;
<<<<<<< HEAD
  channel: "stable" | "beta";
  publishTag: "latest" | "beta";
};

export type PluginReleasePlanItem = PublishablePluginPackage & {
  alreadyPublished: boolean;
};

export type PluginReleasePlan = {
=======
  channel: "stable" | "alpha" | "beta";
  publishTag: "latest" | "alpha" | "beta";
};

type PluginReleasePlanItem = PublishablePluginPackage & {
  alreadyPublished: boolean;
  artifactName: string;
};

type PluginReleasePlan = {
>>>>>>> upstream/main
  all: PluginReleasePlanItem[];
  candidates: PluginReleasePlanItem[];
  skippedPublished: PluginReleasePlanItem[];
};

<<<<<<< HEAD
const CLAWHUB_DEFAULT_REGISTRY = "https://clawhub.ai";
=======
type ClawHubPackageOwnerDetail = {
  owner?: {
    handle?: unknown;
  } | null;
};

type ClawHubPublishablePluginPackageFilters = {
  extensionIds?: readonly string[];
  packageNames?: readonly string[];
};

const CLAWHUB_DEFAULT_REGISTRY = "https://clawhub.ai";
const CLAWHUB_RESPONSE_BODY_MAX_BYTES = 1024 * 1024;
>>>>>>> upstream/main
const SAFE_EXTENSION_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
const CLAWHUB_SHARED_RELEASE_INPUT_PATHS = [
  ".github/workflows/plugin-clawhub-release.yml",
  ".github/actions/setup-node-env",
  "package.json",
  "pnpm-lock.yaml",
  "packages/plugin-package-contract/src/index.ts",
<<<<<<< HEAD
  "scripts/lib/npm-publish-plan.mjs",
  "scripts/lib/plugin-npm-release.ts",
  "scripts/lib/plugin-clawhub-release.ts",
=======
  "scripts/lib/bounded-response.ts",
  "scripts/lib/npm-publish-plan.mjs",
  "scripts/lib/plugin-npm-release.ts",
  "scripts/lib/plugin-clawhub-release.ts",
  "scripts/plugin-clawhub-owner-preflight.ts",
>>>>>>> upstream/main
  "scripts/openclaw-npm-release-check.ts",
  "scripts/plugin-clawhub-publish.sh",
  "scripts/plugin-clawhub-release-check.ts",
  "scripts/plugin-clawhub-release-plan.ts",
] as const;

<<<<<<< HEAD
function readPluginPackageJson(path: string): PluginPackageJson {
  return JSON.parse(readFileSync(path, "utf8")) as PluginPackageJson;
}

function normalizePath(path: string) {
  return path.trim().replaceAll("\\", "/");
}

function isNullGitRef(ref: string | undefined): boolean {
  return !ref || /^0+$/.test(ref);
}

function assertSafeGitRef(ref: string, label: string) {
  const trimmed = ref.trim();
  if (!trimmed || isNullGitRef(trimmed)) {
    throw new Error(`${label} is required.`);
  }
  if (
    trimmed.startsWith("-") ||
    trimmed.includes("\u0000") ||
    trimmed.includes("\r") ||
    trimmed.includes("\n")
  ) {
    throw new Error(`${label} must be a normal git ref or commit SHA.`);
  }
  return trimmed;
}

function resolveGitCommitSha(rootDir: string, ref: string, label: string) {
  const safeRef = assertSafeGitRef(ref, label);
  try {
    return execFileSync("git", ["rev-parse", "--verify", "--quiet", `${safeRef}^{commit}`], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    throw new Error(`${label} is not a valid git commit ref: ${safeRef}`);
  }
}

=======
>>>>>>> upstream/main
function getRegistryBaseUrl(explicit?: string) {
  return (
    explicit?.trim() ||
    process.env.CLAWHUB_REGISTRY?.trim() ||
    process.env.CLAWHUB_SITE?.trim() ||
    CLAWHUB_DEFAULT_REGISTRY
  );
}

<<<<<<< HEAD
export function collectClawHubPublishablePluginPackages(
  rootDir = resolve("."),
): PublishablePluginPackage[] {
  const extensionsDir = join(rootDir, "extensions");
  const dirs = readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  );

  const publishable: PublishablePluginPackage[] = [];
  const validationErrors: string[] = [];

  for (const dir of dirs) {
    const packageDir = join("extensions", dir.name);
    const absolutePackageDir = join(extensionsDir, dir.name);
    const packageJsonPath = join(absolutePackageDir, "package.json");
    let packageJson: PluginPackageJson;
    try {
      packageJson = readPluginPackageJson(packageJsonPath);
    } catch {
      continue;
    }

    if (packageJson.openclaw?.release?.publishToClawHub !== true) {
      continue;
    }
    if (!SAFE_EXTENSION_ID_RE.test(dir.name)) {
      validationErrors.push(
        `${dir.name}: extension directory name must match ^[a-z0-9][a-z0-9._-]*$ for ClawHub publish.`,
=======
function formatClawHubPackageArtifactName(
  plugin: Pick<PublishablePluginPackage, "packageName" | "version">,
) {
  const safeName = plugin.packageName
    .replace(/^@/u, "")
    .replace(/[^A-Za-z0-9_.-]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return `clawhub-package-${safeName}-${plugin.version}`;
}

async function readClawHubPackageOwnerDetail(
  response: Response,
  packageName: string,
): Promise<ClawHubPackageOwnerDetail> {
  return JSON.parse(
    await readBoundedResponseText(
      response,
      `ClawHub package owner response for ${packageName}`,
      CLAWHUB_RESPONSE_BODY_MAX_BYTES,
    ),
  ) as ClawHubPackageOwnerDetail;
}

export function collectClawHubPublishablePluginPackages(
  rootDir = resolve("."),
  filters: ClawHubPublishablePluginPackageFilters = {},
): PublishablePluginPackage[] {
  const publishable: PublishablePluginPackage[] = [];
  const validationErrors: string[] = [];
  const selectedExtensionIds = new Set(filters.extensionIds ?? []);
  const selectedPackageNames = new Set(filters.packageNames ?? []);
  const hasSelectedExtensionIds = Array.isArray(filters.extensionIds);
  const hasSelectedPackageNames = Array.isArray(filters.packageNames);

  for (const candidate of collectExtensionPackageJsonCandidates(rootDir)) {
    const { extensionId, packageDir, packageJson } = candidate;
    if (hasSelectedExtensionIds && !selectedExtensionIds.has(extensionId)) {
      continue;
    }
    const packageName = packageJson.name?.trim() ?? "";
    if (hasSelectedPackageNames && !selectedPackageNames.has(packageName)) {
      continue;
    }
    if (packageJson.openclaw?.release?.publishToClawHub !== true) {
      continue;
    }
    if (!SAFE_EXTENSION_ID_RE.test(extensionId)) {
      validationErrors.push(
        `${extensionId}: extension directory name must match ^[a-z0-9][a-z0-9._-]*$ for ClawHub publish.`,
>>>>>>> upstream/main
      );
      continue;
    }

    const errors = collectPublishablePluginPackageErrors({
<<<<<<< HEAD
      extensionId: dir.name,
=======
      extensionId,
>>>>>>> upstream/main
      packageDir,
      packageJson,
    });
    if (errors.length > 0) {
<<<<<<< HEAD
      validationErrors.push(...errors.map((error) => `${dir.name}: ${error}`));
=======
      validationErrors.push(...errors.map((error) => `${extensionId}: ${error}`));
>>>>>>> upstream/main
      continue;
    }
    const contractValidation = validateExternalCodePluginPackageJson(packageJson);
    if (contractValidation.issues.length > 0) {
      validationErrors.push(
<<<<<<< HEAD
        ...contractValidation.issues.map((issue) => `${dir.name}: ${issue.message}`),
=======
        ...contractValidation.issues.map((issue) => `${extensionId}: ${issue.message}`),
>>>>>>> upstream/main
      );
      continue;
    }

<<<<<<< HEAD
    const version = packageJson.version!.trim();
    const parsedVersion = parseReleaseVersion(version);
    if (parsedVersion === null) {
      validationErrors.push(
        `${dir.name}: package.json version must match YYYY.M.D, YYYY.M.D-N, or YYYY.M.D-beta.N; found "${version}".`,
      );
      continue;
    }

    publishable.push({
      extensionId: dir.name,
      packageDir,
      packageName: packageJson.name!.trim(),
      version,
      channel: parsedVersion.channel,
      publishTag: parsedVersion.channel === "beta" ? "beta" : "latest",
=======
    const resolvedVersion = resolvePublishablePluginVersion({
      extensionId,
      packageJson,
      validationErrors,
    });
    if (!resolvedVersion) {
      continue;
    }
    const { version, parsedVersion } = resolvedVersion;

    publishable.push({
      extensionId,
      packageDir,
      packageName,
      version,
      channel: parsedVersion.channel,
      publishTag:
        parsedVersion.channel === "alpha"
          ? "alpha"
          : parsedVersion.channel === "beta"
            ? "beta"
            : "latest",
>>>>>>> upstream/main
    });
  }

  if (validationErrors.length > 0) {
    throw new Error(
      `Publishable ClawHub plugin metadata validation failed:\n${validationErrors.map((error) => `- ${error}`).join("\n")}`,
    );
  }

  return publishable.toSorted((left, right) => left.packageName.localeCompare(right.packageName));
}

export function collectPluginClawHubReleasePathsFromGitRange(params: {
  rootDir?: string;
  gitRange: GitRangeSelection;
}): string[] {
  return collectPluginClawHubReleasePathsFromGitRangeForPathspecs(params, ["extensions"]);
}

function collectPluginClawHubRelevantPathsFromGitRange(params: {
  rootDir?: string;
  gitRange: GitRangeSelection;
}): string[] {
  return collectPluginClawHubReleasePathsFromGitRangeForPathspecs(params, [
    "extensions",
    ...CLAWHUB_SHARED_RELEASE_INPUT_PATHS,
  ]);
}

function collectPluginClawHubReleasePathsFromGitRangeForPathspecs(
  params: {
    rootDir?: string;
    gitRange: GitRangeSelection;
  },
  pathspecs: readonly string[],
): string[] {
<<<<<<< HEAD
  const rootDir = params.rootDir ?? resolve(".");
  const { baseRef, headRef } = params.gitRange;

  if (isNullGitRef(baseRef) || isNullGitRef(headRef)) {
    return [];
  }

  const baseSha = resolveGitCommitSha(rootDir, baseRef, "baseRef");
  const headSha = resolveGitCommitSha(rootDir, headRef, "headRef");

  return execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMR", baseSha, headSha, "--", ...pathspecs],
    {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((path) => normalizePath(path));
=======
  return collectChangedPathsFromGitRange({
    rootDir: params.rootDir,
    gitRange: params.gitRange,
    pathspecs,
  });
>>>>>>> upstream/main
}

function hasSharedClawHubReleaseInputChanges(changedPaths: readonly string[]) {
  return changedPaths.some((path) =>
    CLAWHUB_SHARED_RELEASE_INPUT_PATHS.some(
      (sharedPath) => path === sharedPath || path.startsWith(`${sharedPath}/`),
    ),
  );
}

export function resolveChangedClawHubPublishablePluginPackages(params: {
  plugins: PublishablePluginPackage[];
  changedPaths: readonly string[];
}): PublishablePluginPackage[] {
  return resolveChangedPublishablePluginPackages({
    plugins: params.plugins,
    changedExtensionIds: collectChangedExtensionIdsFromPaths(params.changedPaths),
  });
}

export function resolveSelectedClawHubPublishablePluginPackages(params: {
  plugins: PublishablePluginPackage[];
  selection?: string[];
  selectionMode?: PluginReleaseSelectionMode;
  gitRange?: GitRangeSelection;
  rootDir?: string;
}): PublishablePluginPackage[] {
  if (params.selectionMode === "all-publishable") {
    return params.plugins;
  }
  if (params.selection && params.selection.length > 0) {
    return resolveSelectedPublishablePluginPackages({
      plugins: params.plugins,
      selection: params.selection,
    });
  }
  if (params.gitRange) {
    const changedPaths = collectPluginClawHubRelevantPathsFromGitRange({
      rootDir: params.rootDir,
      gitRange: params.gitRange,
    });
    if (hasSharedClawHubReleaseInputChanges(changedPaths)) {
      return params.plugins;
    }
    return resolveChangedClawHubPublishablePluginPackages({
      plugins: params.plugins,
      changedPaths,
    });
  }
  return params.plugins;
}

function readPackageManifestAtGitRef(params: {
  rootDir?: string;
  ref: string;
  packageDir: string;
}): PluginPackageJson | null {
  const rootDir = params.rootDir ?? resolve(".");
  const commitSha = resolveGitCommitSha(rootDir, params.ref, "ref");
  try {
    const raw = execFileSync("git", ["show", `${commitSha}:${params.packageDir}/package.json`], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(raw) as PluginPackageJson;
  } catch {
    return null;
  }
}

export function collectClawHubVersionGateErrors(params: {
  plugins: PublishablePluginPackage[];
  gitRange: GitRangeSelection;
  rootDir?: string;
}): string[] {
  const changedPaths = collectPluginClawHubReleasePathsFromGitRange({
    rootDir: params.rootDir,
    gitRange: params.gitRange,
  });
  const changedPlugins = resolveChangedClawHubPublishablePluginPackages({
    plugins: params.plugins,
    changedPaths,
  });

  const errors: string[] = [];
  for (const plugin of changedPlugins) {
    const baseManifest = readPackageManifestAtGitRef({
      rootDir: params.rootDir,
      ref: params.gitRange.baseRef,
      packageDir: plugin.packageDir,
    });
    if (baseManifest?.openclaw?.release?.publishToClawHub !== true) {
      continue;
    }
    const baseVersion =
      typeof baseManifest.version === "string" && baseManifest.version.trim()
        ? baseManifest.version.trim()
        : null;
    if (baseVersion === null || baseVersion !== plugin.version) {
      continue;
    }
    errors.push(
      `${plugin.packageName}@${plugin.version}: changed publishable plugin still has the same version in package.json.`,
    );
  }

  return errors;
}

<<<<<<< HEAD
export async function isPluginVersionPublishedOnClawHub(
=======
async function isPluginVersionPublishedOnClawHub(
>>>>>>> upstream/main
  packageName: string,
  version: string,
  options: {
    fetchImpl?: typeof fetch;
    registryBaseUrl?: string;
  } = {},
): Promise<boolean> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = new URL(
    `/api/v1/packages/${encodeURIComponent(packageName)}/versions/${encodeURIComponent(version)}`,
    getRegistryBaseUrl(options.registryBaseUrl),
  );
  const response = await fetchImpl(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    return false;
  }
  if (response.ok) {
    return true;
  }

  throw new Error(
    `Failed to query ClawHub for ${packageName}@${version}: ${response.status} ${response.statusText}`,
  );
}

<<<<<<< HEAD
=======
export async function collectClawHubOpenClawOwnerErrors(params: {
  plugins: readonly Pick<PublishablePluginPackage, "packageName">[];
  requiredOwnerHandle?: string;
  registryBaseUrl?: string;
  fetchImpl?: typeof fetch;
}): Promise<string[]> {
  const fetchImpl = params.fetchImpl ?? fetch;
  const requiredOwnerHandle = params.requiredOwnerHandle ?? "openclaw";
  const errors: string[] = [];

  await Promise.all(
    params.plugins.map(async (plugin) => {
      if (!plugin.packageName.startsWith("@openclaw/")) {
        return;
      }

      const url = new URL(
        `/api/v1/packages/${encodeURIComponent(plugin.packageName)}`,
        getRegistryBaseUrl(params.registryBaseUrl),
      );
      const response = await fetchImpl(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 404) {
        errors.push(
          `${plugin.packageName}: ClawHub package row must already exist under @${requiredOwnerHandle} before OpenClaw release publish.`,
        );
        return;
      }
      if (!response.ok) {
        errors.push(
          `${plugin.packageName}: failed to query ClawHub owner: ${response.status} ${response.statusText}`,
        );
        return;
      }

      const detail = await readClawHubPackageOwnerDetail(response, plugin.packageName);
      const ownerHandle = typeof detail.owner?.handle === "string" ? detail.owner.handle : null;
      if (ownerHandle !== requiredOwnerHandle) {
        errors.push(
          `${plugin.packageName}: ClawHub package owner must be @${requiredOwnerHandle}; got ${ownerHandle ? `@${ownerHandle}` : "<missing>"}.`,
        );
      }
    }),
  );

  return errors.toSorted();
}

>>>>>>> upstream/main
export async function collectPluginClawHubReleasePlan(params?: {
  rootDir?: string;
  selection?: string[];
  selectionMode?: PluginReleaseSelectionMode;
  gitRange?: GitRangeSelection;
  registryBaseUrl?: string;
  fetchImpl?: typeof fetch;
}): Promise<PluginReleasePlan> {
<<<<<<< HEAD
  const allPublishable = collectClawHubPublishablePluginPackages(params?.rootDir);
  const selectedPublishable = resolveSelectedClawHubPublishablePluginPackages({
    plugins: allPublishable,
    selection: params?.selection,
    selectionMode: params?.selectionMode,
    gitRange: params?.gitRange,
    rootDir: params?.rootDir,
  });

  const all = await Promise.all(
    selectedPublishable.map(async (plugin) => ({
      ...plugin,
      alreadyPublished: await isPluginVersionPublishedOnClawHub(
        plugin.packageName,
        plugin.version,
        {
          registryBaseUrl: params?.registryBaseUrl,
          fetchImpl: params?.fetchImpl,
        },
      ),
    })),
=======
  const rootDir = params?.rootDir;
  const selection = params?.selection ?? [];
  const changedPaths = params?.gitRange
    ? collectPluginClawHubRelevantPathsFromGitRange({
        rootDir,
        gitRange: params.gitRange,
      })
    : [];
  const sharedInputChanged = hasSharedClawHubReleaseInputChanges(changedPaths);
  const extensionIds =
    params?.selectionMode === "all-publishable" || !params?.gitRange || sharedInputChanged
      ? undefined
      : collectChangedExtensionIdsFromPaths(changedPaths);
  const allPublishable = collectClawHubPublishablePluginPackages(rootDir, {
    extensionIds,
    packageNames: selection.length > 0 ? selection : undefined,
  });
  const selectedPublishable = resolveSelectedClawHubPublishablePluginPackages({
    plugins: allPublishable,
    selection,
    selectionMode: params?.selectionMode,
    gitRange: params?.gitRange,
    rootDir,
  });

  const explicitPublishSelection = params?.selectionMode !== undefined || selection.length > 0;
  if (explicitPublishSelection) {
    assertPluginReleaseVersionFloors(selectedPublishable, "Plugin ClawHub release plan");
  }

  const all = await Promise.all(
    selectedPublishable.map(async (plugin) =>
      Object.assign({}, plugin, {
        alreadyPublished: await isPluginVersionPublishedOnClawHub(
          plugin.packageName,
          plugin.version,
          { registryBaseUrl: params?.registryBaseUrl, fetchImpl: params?.fetchImpl },
        ),
        artifactName: formatClawHubPackageArtifactName(plugin),
      }),
    ),
>>>>>>> upstream/main
  );

  return {
    all,
    candidates: all.filter((plugin) => !plugin.alreadyPublished),
    skippedPublished: all.filter((plugin) => plugin.alreadyPublished),
  };
}
