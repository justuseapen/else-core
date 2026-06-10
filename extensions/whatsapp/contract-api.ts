<<<<<<< HEAD
type UnsupportedSecretRefConfigCandidate = {
  path: string;
  value: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const unsupportedSecretRefSurfacePatterns = [
  "channels.whatsapp.creds.json",
  "channels.whatsapp.accounts.*.creds.json",
] as const;

import { whatsappCommandPolicy as whatsappCommandPolicyImpl } from "./src/command-policy.js";
import { resolveLegacyGroupSessionKey as resolveLegacyGroupSessionKeyImpl } from "./src/group-session-contract.js";
import { __testing as whatsappAccessControlTestingImpl } from "./src/inbound/access-control.js";
=======
// Whatsapp API module exposes the plugin public contract.
import { whatsappCommandPolicy as whatsappCommandPolicyImpl } from "./src/command-policy.js";
import { resolveLegacyGroupSessionKey as resolveLegacyGroupSessionKeyImpl } from "./src/group-session-contract.js";
import { testing as whatsappAccessControlTestingImpl } from "./src/inbound/access-control.js";
>>>>>>> upstream/main
import {
  isWhatsAppGroupJid as isWhatsAppGroupJidImpl,
  normalizeWhatsAppTarget as normalizeWhatsAppTargetImpl,
} from "./src/normalize-target.js";
<<<<<<< HEAD
import {
  createWhatsAppPollFixture as createWhatsAppPollFixtureImpl,
  expectWhatsAppPollSent as expectWhatsAppPollSentImpl,
} from "./src/outbound-test-support.js";
=======
>>>>>>> upstream/main
import { resolveWhatsAppRuntimeGroupPolicy as resolveWhatsAppRuntimeGroupPolicyImpl } from "./src/runtime-group-policy.js";
import {
  canonicalizeLegacySessionKey as canonicalizeLegacySessionKeyImpl,
  isLegacyGroupSessionKey as isLegacyGroupSessionKeyImpl,
} from "./src/session-contract.js";

export const canonicalizeLegacySessionKey = canonicalizeLegacySessionKeyImpl;
<<<<<<< HEAD
export const createWhatsAppPollFixture = createWhatsAppPollFixtureImpl;
export const expectWhatsAppPollSent = expectWhatsAppPollSentImpl;
=======
>>>>>>> upstream/main
export const isLegacyGroupSessionKey = isLegacyGroupSessionKeyImpl;
export const isWhatsAppGroupJid = isWhatsAppGroupJidImpl;
export const normalizeWhatsAppTarget = normalizeWhatsAppTargetImpl;
export const resolveLegacyGroupSessionKey = resolveLegacyGroupSessionKeyImpl;
export const resolveWhatsAppRuntimeGroupPolicy = resolveWhatsAppRuntimeGroupPolicyImpl;
export const whatsappAccessControlTesting = whatsappAccessControlTestingImpl;
export const whatsappCommandPolicy = whatsappCommandPolicyImpl;
<<<<<<< HEAD

export function collectUnsupportedSecretRefConfigCandidates(
  raw: unknown,
): UnsupportedSecretRefConfigCandidate[] {
  if (!isRecord(raw)) {
    return [];
  }
  if (!isRecord(raw.channels) || !isRecord(raw.channels.whatsapp)) {
    return [];
  }

  const candidates: UnsupportedSecretRefConfigCandidate[] = [];
  const whatsapp = raw.channels.whatsapp;
  const creds = isRecord(whatsapp.creds) ? whatsapp.creds : null;
  if (creds) {
    candidates.push({
      path: "channels.whatsapp.creds.json",
      value: creds.json,
    });
  }

  const accounts = isRecord(whatsapp.accounts) ? whatsapp.accounts : null;
  if (!accounts) {
    return candidates;
  }
  for (const [accountId, account] of Object.entries(accounts)) {
    if (!isRecord(account) || !isRecord(account.creds)) {
      continue;
    }
    candidates.push({
      path: `channels.whatsapp.accounts.${accountId}.creds.json`,
      value: account.creds.json,
    });
  }
  return candidates;
}
=======
>>>>>>> upstream/main
