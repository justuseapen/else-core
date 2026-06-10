<<<<<<< HEAD
import { isNormalizedSenderAllowed } from "openclaw/plugin-sdk/allow-from";
import {
  resolveOpenProviderRuntimeGroupPolicy,
  type GroupPolicy,
} from "openclaw/plugin-sdk/config-runtime";
import {
  evaluateSenderGroupAccess,
  type SenderGroupAccessDecision,
} from "openclaw/plugin-sdk/group-access";
=======
// Zalo plugin module implements group access behavior.
import type { GroupPolicy } from "openclaw/plugin-sdk/config-contracts";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
>>>>>>> upstream/main

const ZALO_ALLOW_FROM_PREFIX_RE = /^(zalo|zl):/i;

export function normalizeZaloAllowEntry(value: string): string {
  return value.trim().replace(ZALO_ALLOW_FROM_PREFIX_RE, "").trim().toLowerCase();
}

export function resolveZaloRuntimeGroupPolicy(params: {
  providerConfigPresent: boolean;
  groupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
}): {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
} {
  return resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: params.providerConfigPresent,
    groupPolicy: params.groupPolicy,
    defaultGroupPolicy: params.defaultGroupPolicy,
  });
}
