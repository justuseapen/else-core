<<<<<<< HEAD
=======
/**
 * Anthropic Vertex region, project, and ADC auth detection helpers. They keep
 * credential probing local to the provider plugin.
 */
>>>>>>> upstream/main
import { readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import { resolveProviderEndpoint } from "openclaw/plugin-sdk/provider-http";
<<<<<<< HEAD
=======
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
>>>>>>> upstream/main

const ANTHROPIC_VERTEX_DEFAULT_REGION = "global";
const ANTHROPIC_VERTEX_REGION_RE = /^[a-z0-9-]+$/;
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
<<<<<<< HEAD
const GCLOUD_DEFAULT_ADC_PATH = join(
  homedir(),
  ".config",
  "gcloud",
  "application_default_credentials.json",
);
=======
>>>>>>> upstream/main

type AdcProjectFile = {
  project_id?: unknown;
  quota_project_id?: unknown;
};

function normalizeOptionalSecretInput(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

<<<<<<< HEAD
=======
/** Resolve the configured Vertex region, defaulting to global. */
>>>>>>> upstream/main
export function resolveAnthropicVertexRegion(env: NodeJS.ProcessEnv = process.env): string {
  const region =
    normalizeOptionalSecretInput(env.GOOGLE_CLOUD_LOCATION) ||
    normalizeOptionalSecretInput(env.CLOUD_ML_REGION);

  return region && ANTHROPIC_VERTEX_REGION_RE.test(region)
    ? region
    : ANTHROPIC_VERTEX_DEFAULT_REGION;
}

<<<<<<< HEAD
=======
/** Resolve the Vertex project id from explicit env or ADC files. */
>>>>>>> upstream/main
export function resolveAnthropicVertexProjectId(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return (
    normalizeOptionalSecretInput(env.ANTHROPIC_VERTEX_PROJECT_ID) ||
    normalizeOptionalSecretInput(env.GOOGLE_CLOUD_PROJECT) ||
    normalizeOptionalSecretInput(env.GOOGLE_CLOUD_PROJECT_ID) ||
    resolveAnthropicVertexProjectIdFromAdc(env)
  );
}

<<<<<<< HEAD
=======
/** Extract a Vertex region from a provider base URL when possible. */
>>>>>>> upstream/main
export function resolveAnthropicVertexRegionFromBaseUrl(baseUrl?: string): string | undefined {
  const endpoint = resolveProviderEndpoint(baseUrl);
  return endpoint.endpointClass === "google-vertex" ? endpoint.googleVertexRegion : undefined;
}

<<<<<<< HEAD
=======
/** Resolve the client region from model base URL first, then env fallback. */
>>>>>>> upstream/main
export function resolveAnthropicVertexClientRegion(params?: {
  baseUrl?: string;
  env?: NodeJS.ProcessEnv;
}): string {
  return (
    resolveAnthropicVertexRegionFromBaseUrl(params?.baseUrl) ||
    resolveAnthropicVertexRegion(params?.env)
  );
}

function hasAnthropicVertexMetadataServerAdc(env: NodeJS.ProcessEnv = process.env): boolean {
  const explicitMetadataOptIn = normalizeOptionalSecretInput(env.ANTHROPIC_VERTEX_USE_GCP_METADATA);
<<<<<<< HEAD
  return explicitMetadataOptIn === "1" || explicitMetadataOptIn?.toLowerCase() === "true";
=======
  return (
    explicitMetadataOptIn === "1" ||
    normalizeLowercaseStringOrEmpty(explicitMetadataOptIn) === "true"
  );
}

function resolveAnthropicVertexHomeDir(env: NodeJS.ProcessEnv = process.env): string {
  return (
    normalizeOptionalSecretInput(env.HOME) ||
    normalizeOptionalSecretInput(env.USERPROFILE) ||
    homedir()
  );
>>>>>>> upstream/main
}

function resolveAnthropicVertexDefaultAdcPath(env: NodeJS.ProcessEnv = process.env): string {
  return platform() === "win32"
    ? join(
<<<<<<< HEAD
        env.APPDATA ?? join(homedir(), "AppData", "Roaming"),
        "gcloud",
        "application_default_credentials.json",
      )
    : GCLOUD_DEFAULT_ADC_PATH;
=======
        normalizeOptionalSecretInput(env.APPDATA) ??
          join(resolveAnthropicVertexHomeDir(env), "AppData", "Roaming"),
        "gcloud",
        "application_default_credentials.json",
      )
    : join(
        resolveAnthropicVertexHomeDir(env),
        ".config",
        "gcloud",
        "application_default_credentials.json",
      );
>>>>>>> upstream/main
}

function resolveAnthropicVertexAdcCredentialsPathCandidate(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const explicit = normalizeOptionalSecretInput(env.GOOGLE_APPLICATION_CREDENTIALS);
  if (explicit) {
    return explicit;
  }
<<<<<<< HEAD
  if (env !== process.env) {
    return undefined;
  }
=======
>>>>>>> upstream/main
  return resolveAnthropicVertexDefaultAdcPath(env);
}

function canReadAnthropicVertexAdc(env: NodeJS.ProcessEnv = process.env): boolean {
  const credentialsPath = resolveAnthropicVertexAdcCredentialsPathCandidate(env);
  if (!credentialsPath) {
    return false;
  }
  try {
    readFileSync(credentialsPath, "utf8");
    return true;
  } catch {
    return false;
  }
}

function resolveAnthropicVertexProjectIdFromAdc(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const credentialsPath = resolveAnthropicVertexAdcCredentialsPathCandidate(env);
  if (!credentialsPath) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(readFileSync(credentialsPath, "utf8")) as AdcProjectFile;
    return (
      normalizeOptionalSecretInput(parsed.project_id) ||
      normalizeOptionalSecretInput(parsed.quota_project_id)
    );
  } catch {
    return undefined;
  }
}

<<<<<<< HEAD
=======
/** Return whether ADC credentials or metadata-server auth are available. */
>>>>>>> upstream/main
export function hasAnthropicVertexCredentials(env: NodeJS.ProcessEnv = process.env): boolean {
  return hasAnthropicVertexMetadataServerAdc(env) || canReadAnthropicVertexAdc(env);
}

<<<<<<< HEAD
=======
/** Return whether Anthropic Vertex has usable auth for implicit registration. */
>>>>>>> upstream/main
export function hasAnthropicVertexAvailableAuth(env: NodeJS.ProcessEnv = process.env): boolean {
  return hasAnthropicVertexCredentials(env);
}

<<<<<<< HEAD
=======
/** Resolve the synthetic config API key marker for Anthropic Vertex auth. */
>>>>>>> upstream/main
export function resolveAnthropicVertexConfigApiKey(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return hasAnthropicVertexAvailableAuth(env) ? GCP_VERTEX_CREDENTIALS_MARKER : undefined;
}
