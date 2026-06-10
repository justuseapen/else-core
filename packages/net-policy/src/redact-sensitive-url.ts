<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
import type { ConfigUiHint } from "../config-ui-hints-types.js";

=======
// Network Policy module implements redact sensitive url behavior.
type ConfigUiHintTags = {
  tags?: string[];
};

function normalizeLowercaseStringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** Config UI hint tag for URL-like values that may embed credentials or tokens. */
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
export const SENSITIVE_URL_HINT_TAG = "url-secret";

const SENSITIVE_URL_QUERY_PARAM_NAMES = new Set([
  "token",
  "key",
  "api_key",
  "apikey",
  "secret",
  "access_token",
<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
  "password",
  "pass",
  "auth",
  "client_secret",
  "refresh_token",
]);

export function isSensitiveUrlQueryParamName(name: string): boolean {
  return SENSITIVE_URL_QUERY_PARAM_NAMES.has(name.toLowerCase());
}

=======
  "auth_token",
  "password",
  "pass",
  "passwd",
  "auth",
  "client_secret",
  "hook_token",
  "refresh_token",
  "signature",
]);

/** True for auth-like URL query parameter names that should be redacted. */
export function isSensitiveUrlQueryParamName(name: string): boolean {
  const normalized = normalizeLowercaseStringOrEmpty(name).replaceAll("-", "_");
  return SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized);
}

/** True for config paths whose URL values may contain credentials or secret query params. */
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
export function isSensitiveUrlConfigPath(path: string): boolean {
  if (path.endsWith(".baseUrl") || path.endsWith(".httpUrl")) {
    return true;
  }
<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
=======
  if (path.endsWith(".cdpUrl")) {
    return true;
  }
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
  if (path.endsWith(".request.proxy.url")) {
    return true;
  }
  return /^mcp\.servers\.(?:\*|[^.]+)\.url$/.test(path);
}

<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
export function hasSensitiveUrlHintTag(hint: Pick<ConfigUiHint, "tags"> | undefined): boolean {
  return hint?.tags?.includes(SENSITIVE_URL_HINT_TAG) === true;
}

=======
/** True when a config UI hint explicitly marks a URL-like value as secret-bearing. */
export function hasSensitiveUrlHintTag(hint: ConfigUiHintTags | undefined): boolean {
  return hint?.tags?.includes(SENSITIVE_URL_HINT_TAG) === true;
}

/** Redacts credentials and sensitive query params from parseable URLs. */
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
export function redactSensitiveUrl(value: string): string {
  try {
    const parsed = new URL(value);
    let mutated = false;
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "***" : "";
      parsed.password = parsed.password ? "***" : "";
      mutated = true;
    }
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (isSensitiveUrlQueryParamName(key)) {
        parsed.searchParams.set(key, "***");
        mutated = true;
      }
    }
    return mutated ? parsed.toString() : value;
  } catch {
    return value;
  }
}

<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
=======
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
export function redactSensitiveUrlLikeString(value: string): string {
  const redactedUrl = redactSensitiveUrl(value);
  if (redactedUrl !== value) {
    return redactedUrl;
  }
  return value
<<<<<<< HEAD:src/shared/net/redact-sensitive-url.ts
    .replace(/\/\/([^@/?#]+)@/, "//***:***@")
=======
    .replace(/\/\/([^@/?#\s]+)@/g, "//***:***@")
>>>>>>> upstream/main:packages/net-policy/src/redact-sensitive-url.ts
    .replace(/([?&])([^=&]+)=([^&]*)/g, (match, prefix: string, key: string) =>
      isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match,
    );
}
