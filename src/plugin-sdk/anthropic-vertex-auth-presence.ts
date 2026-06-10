<<<<<<< HEAD
import { readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";
=======
// Anthropic Vertex auth helpers detect local credential presence for provider setup flows.
import { readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../packages/normalization-core/src/string-coerce.js";
>>>>>>> upstream/main
import { normalizeOptionalSecretInput } from "../utils/normalize-secret-input.js";

const GCLOUD_DEFAULT_ADC_PATH = join(
  homedir(),
  ".config",
  "gcloud",
  "application_default_credentials.json",
);

function hasAnthropicVertexMetadataServerAdc(env: NodeJS.ProcessEnv = process.env): boolean {
  const explicitMetadataOptIn = normalizeOptionalSecretInput(env.ANTHROPIC_VERTEX_USE_GCP_METADATA);
<<<<<<< HEAD
  return explicitMetadataOptIn === "1" || explicitMetadataOptIn?.toLowerCase() === "true";
}

function normalizeOptionalPathInput(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
=======
  return (
    explicitMetadataOptIn === "1" ||
    normalizeLowercaseStringOrEmpty(explicitMetadataOptIn) === "true"
  );
>>>>>>> upstream/main
}

function resolveAnthropicVertexDefaultAdcPath(env: NodeJS.ProcessEnv = process.env): string {
  return platform() === "win32"
    ? join(
        env.APPDATA ?? join(homedir(), "AppData", "Roaming"),
        "gcloud",
        "application_default_credentials.json",
      )
    : GCLOUD_DEFAULT_ADC_PATH;
}

function resolveAnthropicVertexAdcCredentialsPathCandidate(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
<<<<<<< HEAD
  const explicit = normalizeOptionalPathInput(env.GOOGLE_APPLICATION_CREDENTIALS);
  if (explicit) {
    return explicit;
  }
=======
  const explicit = normalizeOptionalString(env.GOOGLE_APPLICATION_CREDENTIALS);
  if (explicit) {
    return explicit;
  }
  // Only probe the user's default ADC file for the real process environment; injected
  // test/runtime env objects should not accidentally depend on host filesystem state.
>>>>>>> upstream/main
  if (env !== process.env) {
    return undefined;
  }
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

<<<<<<< HEAD
=======
/**
 * Return whether Anthropic Vertex can authenticate through GCP metadata or ADC credentials.
 * This is a preflight signal only; provider calls still perform their own auth validation.
 */
>>>>>>> upstream/main
export function hasAnthropicVertexAvailableAuth(env: NodeJS.ProcessEnv = process.env): boolean {
  return hasAnthropicVertexMetadataServerAdc(env) || canReadAnthropicVertexAdc(env);
}
