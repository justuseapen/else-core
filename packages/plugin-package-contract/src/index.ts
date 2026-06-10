<<<<<<< HEAD
export type JsonObject = Record<string, unknown>;

=======
// External code plugin package.json compatibility and validation contracts.

/** JSON object shape accepted by package contract helpers. */
export type JsonObject = Record<string, unknown>;

/** Compatibility metadata extracted from an external plugin package. */
>>>>>>> upstream/main
export type ExternalPluginCompatibility = {
  pluginApiRange?: string;
  builtWithOpenClawVersion?: string;
  pluginSdkVersion?: string;
  minGatewayVersion?: string;
};

<<<<<<< HEAD
=======
/** One validation issue for an external plugin package. */
>>>>>>> upstream/main
export type ExternalPluginValidationIssue = {
  fieldPath: string;
  message: string;
};

<<<<<<< HEAD
=======
/** Validation result plus any normalized compatibility metadata. */
>>>>>>> upstream/main
export type ExternalCodePluginValidationResult = {
  compatibility?: ExternalPluginCompatibility;
  issues: ExternalPluginValidationIssue[];
};

<<<<<<< HEAD
=======
/** Required package.json field paths for external code plugin packages. */
>>>>>>> upstream/main
export const EXTERNAL_CODE_PLUGIN_REQUIRED_FIELD_PATHS = [
  "openclaw.compat.pluginApi",
  "openclaw.build.openclawVersion",
] as const;

<<<<<<< HEAD
function isRecord(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

=======
/** Narrow unknown values to plain records. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Normalize optional package metadata strings. */
function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

/** Read OpenClaw package.json blocks without trusting caller input shape. */
>>>>>>> upstream/main
function readOpenClawBlock(packageJson: unknown) {
  const root = isRecord(packageJson) ? packageJson : undefined;
  const openclaw = isRecord(root?.openclaw) ? root.openclaw : undefined;
  const compat = isRecord(openclaw?.compat) ? openclaw.compat : undefined;
  const build = isRecord(openclaw?.build) ? openclaw.build : undefined;
  const install = isRecord(openclaw?.install) ? openclaw.install : undefined;
  return { root, openclaw, compat, build, install };
}

<<<<<<< HEAD
=======
/** Normalize compatibility metadata from an external plugin package.json. */
>>>>>>> upstream/main
export function normalizeExternalPluginCompatibility(
  packageJson: unknown,
): ExternalPluginCompatibility | undefined {
  const { root, compat, build, install } = readOpenClawBlock(packageJson);
<<<<<<< HEAD
  const version = getTrimmedString(root?.version);
  const minHostVersion = getTrimmedString(install?.minHostVersion);
  const compatibility: ExternalPluginCompatibility = {};

  const pluginApi = getTrimmedString(compat?.pluginApi);
=======
  const version = normalizeOptionalString(root?.version);
  const minHostVersion = normalizeOptionalString(install?.minHostVersion);
  const compatibility: ExternalPluginCompatibility = {};

  const pluginApi = normalizeOptionalString(compat?.pluginApi);
>>>>>>> upstream/main
  if (pluginApi) {
    compatibility.pluginApiRange = pluginApi;
  }

<<<<<<< HEAD
  const minGatewayVersion = getTrimmedString(compat?.minGatewayVersion) ?? minHostVersion;
=======
  const minGatewayVersion = normalizeOptionalString(compat?.minGatewayVersion) ?? minHostVersion;
>>>>>>> upstream/main
  if (minGatewayVersion) {
    compatibility.minGatewayVersion = minGatewayVersion;
  }

<<<<<<< HEAD
  const builtWithOpenClawVersion = getTrimmedString(build?.openclawVersion) ?? version;
=======
  const builtWithOpenClawVersion = normalizeOptionalString(build?.openclawVersion) ?? version;
>>>>>>> upstream/main
  if (builtWithOpenClawVersion) {
    compatibility.builtWithOpenClawVersion = builtWithOpenClawVersion;
  }

<<<<<<< HEAD
  const pluginSdkVersion = getTrimmedString(build?.pluginSdkVersion);
=======
  const pluginSdkVersion = normalizeOptionalString(build?.pluginSdkVersion);
>>>>>>> upstream/main
  if (pluginSdkVersion) {
    compatibility.pluginSdkVersion = pluginSdkVersion;
  }

  return Object.keys(compatibility).length > 0 ? compatibility : undefined;
}

<<<<<<< HEAD
export function listMissingExternalCodePluginFieldPaths(packageJson: unknown): string[] {
  const { compat, build } = readOpenClawBlock(packageJson);
  const missing: string[] = [];
  if (!getTrimmedString(compat?.pluginApi)) {
    missing.push("openclaw.compat.pluginApi");
  }
  if (!getTrimmedString(build?.openclawVersion)) {
=======
/** List missing required field paths for an external code plugin package.json. */
export function listMissingExternalCodePluginFieldPaths(packageJson: unknown): string[] {
  const { compat, build } = readOpenClawBlock(packageJson);
  const missing: string[] = [];
  if (!normalizeOptionalString(compat?.pluginApi)) {
    missing.push("openclaw.compat.pluginApi");
  }
  if (!normalizeOptionalString(build?.openclawVersion)) {
>>>>>>> upstream/main
    missing.push("openclaw.build.openclawVersion");
  }
  return missing;
}

<<<<<<< HEAD
=======
/** Validate an external code plugin package.json against required compatibility fields. */
>>>>>>> upstream/main
export function validateExternalCodePluginPackageJson(
  packageJson: unknown,
): ExternalCodePluginValidationResult {
  const issues = listMissingExternalCodePluginFieldPaths(packageJson).map((fieldPath) => ({
    fieldPath,
<<<<<<< HEAD
    message: `${fieldPath} is required for external code plugins published to ClawHub.`,
=======
    message: `${fieldPath} is required for external code plugin packages.`,
>>>>>>> upstream/main
  }));
  return {
    compatibility: normalizeExternalPluginCompatibility(packageJson),
    issues,
  };
}
