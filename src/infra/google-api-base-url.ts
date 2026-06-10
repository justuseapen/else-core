<<<<<<< HEAD
import { resolveProviderEndpoint } from "../agents/provider-attribution.js";

=======
// Normalizes Google Generative Language API base URLs.
>>>>>>> upstream/main
export const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GOOGLE_GENERATIVE_LANGUAGE_HOST = "generativelanguage.googleapis.com";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function isCanonicalGoogleApiOriginShorthand(value: string): boolean {
  return /^https:\/\/generativelanguage\.googleapis\.com\/?$/i.test(value);
}

export function normalizeGoogleApiBaseUrl(baseUrl?: string): string {
  const raw = trimTrailingSlashes(baseUrl?.trim() || DEFAULT_GOOGLE_API_BASE_URL);
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    if (
<<<<<<< HEAD
      resolveProviderEndpoint(url.toString()).endpointClass === "google-generative-ai" &&
=======
      url.hostname.toLowerCase() === GOOGLE_GENERATIVE_LANGUAGE_HOST &&
>>>>>>> upstream/main
      trimTrailingSlashes(url.pathname || "") === ""
    ) {
      url.pathname = "/v1beta";
    }
    return trimTrailingSlashes(url.toString());
  } catch {
    if (isCanonicalGoogleApiOriginShorthand(raw)) {
      return DEFAULT_GOOGLE_API_BASE_URL;
    }
    return raw;
  }
}
