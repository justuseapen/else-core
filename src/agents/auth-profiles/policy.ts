<<<<<<< HEAD
import type { OpenClawConfig } from "../../config/config.js";
=======
/**
 * Auth profile policy validation.
 * Rejects SecretRef-backed OAuth material because OAuth credentials are mutable
 * runtime state and must stay directly persisted by refresh flows.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
>>>>>>> upstream/main
import { coerceSecretRef, resolveSecretInputRef } from "../../config/types.secrets.js";
import type { AuthProfileCredential, AuthProfileStore } from "./types.js";

type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];

<<<<<<< HEAD
=======
/** Validation error for SecretRef usage in OAuth auth profiles. */
>>>>>>> upstream/main
type OAuthSecretRefPolicyViolation = {
  profileId: string;
  path: string;
  reason: string;
};

<<<<<<< HEAD
=======
// OAuth credentials are runtime-mutated during refresh. SecretRef-backed OAuth
// fields would split mutable state across stores, so validation rejects them.
>>>>>>> upstream/main
function pushViolation(
  violations: OAuthSecretRefPolicyViolation[],
  profileId: string,
  field: string,
  reason: string,
): void {
  violations.push({
    profileId,
    path: `profiles.${profileId}.${field}`,
    reason,
  });
}

function hasSecretRefInput(params: {
  value: unknown;
  refValue?: unknown;
  defaults: SecretDefaults | undefined;
}): boolean {
  return (
    resolveSecretInputRef({
      value: params.value,
      refValue: params.refValue,
      defaults: params.defaults,
    }).ref !== null
  );
}

function collectTypeOAuthSecretRefViolations(params: {
  profileId: string;
  credential: AuthProfileCredential;
  defaults: SecretDefaults | undefined;
  violations: OAuthSecretRefPolicyViolation[];
}): void {
  if (params.credential.type !== "oauth") {
    return;
  }
  const reason =
    'SecretRef is not allowed for type="oauth" auth profiles (OAuth credentials are runtime-mutable).';
  const record = params.credential as Record<string, unknown>;
  for (const field of ["access", "refresh", "token", "tokenRef", "key", "keyRef"] as const) {
    if (coerceSecretRef(record[field], params.defaults) === null) {
      continue;
    }
    pushViolation(params.violations, params.profileId, field, reason);
  }
}

function collectOAuthModeSecretRefViolations(params: {
  profileId: string;
  credential: AuthProfileCredential;
  defaults: SecretDefaults | undefined;
<<<<<<< HEAD
  configuredMode?: "api_key" | "oauth" | "token";
=======
  configuredMode?: "api_key" | "aws-sdk" | "oauth" | "token";
>>>>>>> upstream/main
  violations: OAuthSecretRefPolicyViolation[];
}): void {
  if (params.configuredMode !== "oauth") {
    return;
  }
  const reason =
    `SecretRef is not allowed when auth.profiles.${params.profileId}.mode is "oauth" ` +
    "(OAuth credentials are runtime-mutable).";
  if (params.credential.type === "api_key") {
    if (
      hasSecretRefInput({
        value: params.credential.key,
        refValue: params.credential.keyRef,
        defaults: params.defaults,
      })
    ) {
      pushViolation(params.violations, params.profileId, "key", reason);
    }
    return;
  }
  if (params.credential.type === "token") {
    if (
      hasSecretRefInput({
        value: params.credential.token,
        refValue: params.credential.tokenRef,
        defaults: params.defaults,
      })
    ) {
      pushViolation(params.violations, params.profileId, "token", reason);
    }
  }
}

<<<<<<< HEAD
export function collectOAuthSecretRefPolicyViolations(params: {
=======
function collectOAuthSecretRefPolicyViolations(params: {
>>>>>>> upstream/main
  store: AuthProfileStore;
  cfg?: OpenClawConfig;
  profileIds?: Iterable<string>;
}): OAuthSecretRefPolicyViolation[] {
  const defaults = params.cfg?.secrets?.defaults;
  const profileFilter = params.profileIds ? new Set(params.profileIds) : null;
  const violations: OAuthSecretRefPolicyViolation[] = [];
  for (const [profileId, credential] of Object.entries(params.store.profiles)) {
    if (profileFilter && !profileFilter.has(profileId)) {
      continue;
    }
    collectTypeOAuthSecretRefViolations({
      profileId,
      credential,
      defaults,
      violations,
    });
    collectOAuthModeSecretRefViolations({
      profileId,
      credential,
      defaults,
      configuredMode: params.cfg?.auth?.profiles?.[profileId]?.mode,
      violations,
    });
  }
  return violations;
}

<<<<<<< HEAD
=======
/** Throws when OAuth profiles contain unsupported SecretRef fields. */
>>>>>>> upstream/main
export function assertNoOAuthSecretRefPolicyViolations(params: {
  store: AuthProfileStore;
  cfg?: OpenClawConfig;
  profileIds?: Iterable<string>;
  context?: string;
}): void {
  const violations = collectOAuthSecretRefPolicyViolations(params);
  if (violations.length === 0) {
    return;
  }
  const lines = [
    `${params.context ?? "auth-profiles"} policy validation failed: OAuth + SecretRef is not supported.`,
    ...violations.map((violation) => `- ${violation.path}: ${violation.reason}`),
  ];
  throw new Error(lines.join("\n"));
}
